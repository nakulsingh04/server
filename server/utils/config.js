export const serverConfig = {
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management',
    uriProd: process.env.MONGODB_URI_PROD,
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  app: {
    name: process.env.APP_NAME || 'Task Management System',
    version: process.env.APP_VERSION || '1.0.0',
  },

  board: {
    defaultId: process.env.DEFAULT_BOARD_ID || 'default',
    columnIds: (process.env.COLUMN_IDS || 'todo,inProgress,done').split(','),
  },

  validation: {
    maxTitleLength: parseInt(process.env.MAX_TITLE_LENGTH) || 100,
    maxDescriptionLength: parseInt(process.env.MAX_DESCRIPTION_LENGTH) || 500,
    maxTags: parseInt(process.env.MAX_TAGS) || 5,
    maxTagLength: parseInt(process.env.MAX_TAG_LENGTH) || 20,
  },

  priorities: (process.env.PRIORITY_LEVELS || 'low,medium,high').split(','),

  socket: {
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
  },
};

export const SERVER_COLUMNS = {
  todo: {
    id: 'todo',
    title: 'To Do',
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
  },
  done: {
    id: 'done',
    title: 'Done',
  },
};

export const SERVER_VALIDATION = {
  title: {
    maxLength: serverConfig.validation.maxTitleLength,
    required: true,
  },
  description: {
    maxLength: serverConfig.validation.maxDescriptionLength,
    required: false,
  },
  tags: {
    maxCount: serverConfig.validation.maxTags,
    maxLength: serverConfig.validation.maxTagLength,
  },
  priority: {
    levels: serverConfig.priorities,
  },
  columns: {
    ids: serverConfig.board.columnIds,
  },
};
