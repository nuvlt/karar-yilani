export function setupSocketHandlers(socket, io, roomManager) {
  let currentRoom = null;
  let playerNickname = null;

  // Oyuna katıl
  socket.on('join-game', (data) => {
    const { nickname } = data;
    
    if (!nickname || nickname.length < 3 || nickname.length > 15) {
      socket.emit('error', { message: 'Geçersiz nickname' });
      return;
    }

    playerNickname = nickname;
    
    // Uygun oda bul veya oluştur
    currentRoom = roomManager.findOrCreateRoom();
    
    // Oyuncuyu odaya ekle (socket referansı ile)
    const added = currentRoom.addPlayer(socket.id, { 
      nickname,
      socket  // Socket referansını da ekle
    });
    
    if (!added) {
      socket.emit('error', { message: 'Oda dolu!' });
      return;
    }

    // Socket'i odaya ekle
    socket.join(currentRoom.id);

    // Oyuncuya oda bilgisini gönder
    socket.emit('game-joined', {
      roomId: currentRoom.id,
      players: currentRoom.getPlayers(),
      isStarted: currentRoom.isStarted(),
      isCreator: currentRoom.creatorId === socket.id // Oda kurucusu mu?
    });

    // Odadaki diğer oyunculara bildir
    socket.to(currentRoom.id).emit('player-joined', {
      nickname,
      socketId: socket.id
    });

    console.log(`${nickname} joined room ${currentRoom.id}`);
  });

  // Manuel oyun başlatma (sadece oda kurucusu)
  socket.on('manual-start', () => {
    if (!currentRoom) return;

    const result = currentRoom.manualStart(socket.id);
    
    if (!result.success) {
      socket.emit('error', { message: result.message });
    }
  });

  // Oyuncu hareketi
  socket.on('player-input', (data) => {
    if (!currentRoom || !currentRoom.gameState) return;

    const { targetX, targetY } = data;
    const snake = currentRoom.gameState.getSnake(socket.id);
    
    if (snake) {
      snake.setTarget(targetX, targetY);
    }
  });

  // Karar seçimi
  socket.on('decision-choice', (data) => {
    if (!currentRoom || !currentRoom.gameState) return;

    const { decisionId, optionIndex, effect } = data;
    const snake = currentRoom.gameState.getSnake(socket.id);
    
    if (snake) {
      snake.applyDecisionEffect(effect);
      
      // Oyuncuya feedback gönder
      socket.emit('decision-result', {
        effect,
        newScore: snake.score,
        newLength: snake.segments.length
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    if (currentRoom) {
      currentRoom.removePlayer(socket.id);
      
      // Odadaki diğer oyunculara bildir
      socket.to(currentRoom.id).emit('player-left', {
        nickname: playerNickname,
        socketId: socket.id
      });

      console.log(`${playerNickname} disconnected from room ${currentRoom.id}`);

      // Boş odaları temizle
      roomManager.cleanupEmptyRooms();
    }
  });

  // Oyundan ayrıl
  socket.on('leave-game', () => {
    if (currentRoom) {
      currentRoom.removePlayer(socket.id);
      socket.leave(currentRoom.id);
      
      socket.to(currentRoom.id).emit('player-left', {
        nickname: playerNickname,
        socketId: socket.id
      });

      currentRoom = null;
    }
  });
}
