# Render Deployment Guide

## 🚀 Quick Deploy to Render

### 1. **Repository Setup** ✅
- ✅ Repository: `https://github.com/nakulsingh04/server.git`
- ✅ Root Directory: `server`
- ✅ Build Command: `npm run build`
- ✅ Start Command: `npm start`

### 2. **Environment Variables**

Set these environment variables in your Render dashboard:

```bash
# Server Configuration
PORT=10000
NODE_ENV=production

# MongoDB Configuration (Required)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/task-management

# JWT Secret (Required)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration (Update with your frontend URL)
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Application Configuration
APP_NAME=Task Management System
APP_VERSION=1.0.0

# Board Configuration
DEFAULT_BOARD_ID=default
COLUMN_IDS=todo,inProgress,done

# Validation Limits
MAX_TITLE_LENGTH=100
MAX_DESCRIPTION_LENGTH=500
MAX_TAGS=5
MAX_TAG_LENGTH=20

# Priority Levels
PRIORITY_LEVELS=low,medium,high

# Socket.IO Configuration
SOCKET_PING_TIMEOUT=60000
SOCKET_PING_INTERVAL=25000
```

### 3. **MongoDB Setup**

1. **Create MongoDB Atlas Account** (if you don't have one)
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Get Connection String**
   - In Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

3. **Set MONGODB_URI in Render**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/task-management`

### 4. **Render Configuration**

#### **Basic Settings:**
- **Name:** `task-management-server`
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `server`

#### **Build & Deploy:**
- **Build Command:** `npm run build`
- **Start Command:** `npm start`

#### **Environment Variables:**
Add all the environment variables listed above in the Render dashboard.

### 5. **Health Check**

Your server includes a health check endpoint:
```
GET https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### 6. **API Endpoints**

Once deployed, your API will be available at:
```
https://your-app-name.onrender.com/api/tasks
```

#### **Available Endpoints:**
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /health` - Health check

### 7. **Socket.IO**

Your server supports real-time updates via Socket.IO:
```
wss://your-app-name.onrender.com
```

#### **Socket Events:**
- `join:board` - Join a board room
- `leave:board` - Leave a board room
- `task:move` - Move task between columns
- `task:create` - Create new task
- `task:update` - Update task
- `task:delete` - Delete task

### 8. **Troubleshooting**

#### **Common Issues:**

1. **Build Fails**
   - ✅ Fixed: Added `build` script to package.json

2. **MongoDB Connection Error**
   - Check your `MONGODB_URI` environment variable
   - Ensure your MongoDB Atlas cluster is running
   - Verify network access settings in Atlas

3. **CORS Errors**
   - Update `CORS_ORIGIN` with your frontend URL
   - For development: `http://localhost:3000`
   - For production: `https://your-frontend-domain.com`

4. **Port Issues**
   - Render automatically sets `PORT` environment variable
   - Your server uses `process.env.PORT || 3001`

#### **Logs:**
- Check Render logs in the dashboard
- Your server logs MongoDB connection status
- Health check endpoint shows server status

### 9. **Security Notes**

⚠️ **Important Security Settings:**
- Change `JWT_SECRET` to a strong, unique value
- Use HTTPS in production (Render provides this)
- Set appropriate CORS origins
- Configure rate limiting as needed

### 10. **Performance**

Your server includes:
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet security headers
- ✅ MongoDB indexing for performance
- ✅ Error handling middleware
- ✅ Health check endpoint

---

## 🎉 Deployment Complete!

Once you've set up the environment variables and MongoDB, your server should deploy successfully on Render!

**Next Steps:**
1. Test the health endpoint
2. Connect your frontend to the deployed API
3. Test real-time features with Socket.IO
4. Monitor logs for any issues
