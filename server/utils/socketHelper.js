// Socket.IO helper utilities to reduce repeated code

/**
 * Get Socket.IO instance from Express app
 * @param {Object} req - Express request object
 * @returns {Object} - Socket.IO instance
 */
export const getSocketIO = (req) => {
  return req.app.get('io');
};

/**
 * Emit event to all connected clients
 * @param {Object} req - Express request object
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
export const emitToAll = (req, event, data) => {
  const io = getSocketIO(req);
  if (io) {
    io.emit(event, data);
  }
};

/**
 * Emit event to specific room
 * @param {Object} req - Express request object
 * @param {string} room - Room name
 * @param {string} event - Event name
 * @param {any} data - Event data
 */
export const emitToRoom = (req, room, event, data) => {
  const io = getSocketIO(req);
  if (io) {
    io.to(room).emit(event, data);
  }
};

/**
 * Emit task-related events
 */
export const taskEvents = {
  // Emit task created event
  created: (req, task) => {
    emitToAll(req, 'task:created', { task });
  },

  // Emit task updated event
  updated: (req, task) => {
    emitToAll(req, 'task:updated', { task });
  },

  // Emit task deleted event
  deleted: (req, taskId) => {
    emitToAll(req, 'task:deleted', { taskId });
  },

  // Emit task moved event
  moved: (req, moveData) => {
    emitToAll(req, 'task:moved', moveData);
  },

  // Emit tasks reordered event
  reordered: (req, columnId, taskIds) => {
    emitToAll(req, 'tasks:reordered', { columnId, taskIds });
  },

  // Emit database seeded event
  seeded: (req, result) => {
    emitToAll(req, 'tasks:seeded', { 
      message: 'Database seeded successfully', 
      data: result 
    });
  },

  // Emit database cleared event
  cleared: (req) => {
    emitToAll(req, 'tasks:cleared', { message: 'Database cleared successfully' });
  }
};

/**
 * Emit user-related events
 */
export const userEvents = {
  // Emit user created event
  created: (req, user) => {
    emitToAll(req, 'user:created', { user });
  },

  // Emit user updated event
  updated: (req, user) => {
    emitToAll(req, 'user:updated', { user });
  },

  // Emit user deleted event
  deleted: (req, userId) => {
    emitToAll(req, 'user:deleted', { userId });
  }
};

/**
 * Emit notification events
 */
export const notificationEvents = {
  // Emit notification to all users
  broadcast: (req, notification) => {
    emitToAll(req, 'notification', notification);
  },

  // Emit notification to specific user
  toUser: (req, userId, notification) => {
    emitToRoom(req, `user:${userId}`, 'notification', notification);
  }
};

/**
 * Socket.IO room management helpers
 */
export const roomManagement = {
  // Join a room
  join: (socket, room) => {
    socket.join(room);
  },

  // Leave a room
  leave: (socket, room) => {
    socket.leave(room);
  },

  // Get room members count
  getMemberCount: (io, room) => {
    const roomData = io.sockets.adapter.rooms.get(room);
    return roomData ? roomData.size : 0;
  }
};

/**
 * Socket.IO connection management helpers
 */
export const connectionHelpers = {
  // Handle client connection
  onConnect: (socket) => {
    // Client connected
  },

  // Handle client disconnection
  onDisconnect: (socket) => {
    // Client disconnected
  },

  // Handle errors
  onError: (socket, error) => {
    socket.emit('error', { message: 'An error occurred' });
  }
};
