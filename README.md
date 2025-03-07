# Project Name: Task Bridge: An Innovative Solution for Project Management

### Figma Design Link 🔗: [Task Bridge  ](https://www.figma.com/design/jEl4fmd7xKQj1auwksj5Q1/TASK-BRIDGE?node-id=0-1&t=iC8RW9DaJqFLbqNL-1)
### Website Deployed Link 🔗: [Website  ](https://task-bridge-project-managment.netlify.app/)
### postman Documentation Link 🔗: [Documentation  ](https://documenter.getpostman.com/view/39217138/2sAYX5LNgp)

<!-- ## Problem Statement
Project management often has problems like poor communication and inefficiency. Existing tools are too hard to use or lack important features. Task Bridge solves this by giving teams a simple, all-in-one platform to manage tasks, work together, and track progress.
 -->

## TaskBridge

TaskBridge is a comprehensive team collaboration and project management platform that enables teams to work together efficiently through task management, real-time communication, and video conferencing.

## 🌟 Problem Statement

In today's remote work environment, teams face challenges with:
- Scattered communication across multiple platforms
- Lack of real-time collaboration tools
- Difficulty in tracking project progress
- Need for seamless video conferencing integration
- Complex task management and assignment

TaskBridge solves these problems by providing an all-in-one solution that combines task management, team chat, and video conferencing capabilities.

## ✨ Features

### 1. Task Management
- Create, assign, and track tasks
- Set priorities and deadlines
- Add descriptions 
- Track task status and progress
- Task categories and labels

### 2. Team Collaboration
- Real-time team chat
- File sharing
- Team member profiles
- Activity feed

### 3. Video Conferencing (Powered by Jitsi)
- Instant video meetings
- Screen sharing
- Meeting chat
- Recording capabilities
- Meeting scheduling
- Join via link

### 4. User Management
- User roles and permissions
- Team creation and management
- Profile customization
- Authentication and authorization


## 🛠️ Technology Stack

### Frontend
- React.js
- Material-UI
- Socket.io-client
- Axios
- @jitsi/react-sdk

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication

# TaskBridge Database Schemas

## 👤 User Schema
<details>
<summary>Click to view User Schema</summary>

```javascript
{
  team_code: { 
    type: String, 
    required: true 
  },
  full_name: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: false 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'member'] 
  },
  password: { 
    type: String, 
    required: true 
  }
}
```

**Description:**
- Stores user information and authentication details
- Supports role-based access control (admin/member)
- Includes JWT token generation method
</details>

## 📋 Task Schema
<details>
<summary>Click to view Task Schema</summary>

```javascript
{
  team_code: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  priority: {
    type: String,
    default: "normal",
    enum: ["high", "medium", "normal", "low"]
  },
  stage: {
    type: String,
    default: "todo",
    enum: ["todo", "in progress", "review", "done"]
  },
  label: {
    type: String,
    enum: ["research", "design", "content", "planning"]
  },
  activities: [{
    type: {
      type: String,
      enum: ["assigned", "started", "in progress", "bug", "completed", "commented"]
    },
    activity: String,
    date: Date,
    by: { type: ObjectId, ref: "User" }
  }],
  assets: [String],
  team: [{ type: ObjectId, ref: "User" }],
  comments: [{
    text: String,
    user: { type: ObjectId, ref: "User" },
    createdAt: Date
  }],
  isTrashed: { 
    type: Boolean, 
    default: false 
  }
}
```

**Description:**
- Manages task information and status
- Supports task prioritization and categorization
- Tracks task history and activities
- Includes commenting system
</details>

## 🎥 Meeting Schema
<details>
<summary>Click to view Meeting Schema</summary>

```javascript
{
  team_code: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  agenda: { 
    type: String 
  },
  scheduledDate: { 
    type: Date, 
    required: true 
  },
  createdBy: { 
    type: ObjectId, 
    ref: "User", 
    required: true 
  },
  participants: [{ 
    type: ObjectId, 
    ref: "User" 
  }],
  notes: [{
    user: { type: ObjectId, ref: "User" },
    content: String,
    lastUpdated: Date
  }],
  chatMessages: [{
    sender: { type: ObjectId, ref: "User" },
    message: String,
    timestamp: Date
  }],
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "completed"],
    default: "scheduled"
  },
  meetingLink: { 
    type: String 
  },
  recordingLink: { 
    type: String 
  }
}
```

**Description:**
- Manages video meeting information
- Supports real-time chat during meetings
- Tracks meeting notes and participants
- Handles meeting recordings
</details>

## 💬 Chat Schema
<details>
<summary>Click to view Chat Schema</summary>

```javascript
{
  sender: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiver: { 
    type: ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: false 
  },
  audio: { 
    type: String, 
    required: false 
  },
  status: { 
    type: String, 
    enum: ['sent', 'read'], 
    default: 'sent' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  deleted: { 
    type: Boolean, 
    default: false 
  }
}
```

**Description:**
- Handles direct messaging between users
- Supports text and audio messages
- Includes message status tracking
- Implements soft delete functionality
</details>

## 📁 Folder Schema
<details>
<summary>Click to view Folder Schema</summary>

```javascript
{
  name: {
    type: String,
    required: true
  },
  team_code: {
    type: String,
    required: true
  },
  parent_folder: {
    type: ObjectId,
    ref: 'Folder',
    default: null
  },
  created_by: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}
```

**Description:**
- Manages document organization
- Supports nested folder structure
- Tracks folder ownership
- Team-based folder management
</details>

## 🔑 Common Fields
<details>
<summary>Click to view Common Fields</summary>

Most schemas include these common fields:
- `team_code`: Links data to specific teams
- `timestamps`: Automatically tracks creation and update times
- `ObjectId references`: Links to other documents
- `Soft delete`: Uses boolean flags for deletion
</details>


## TaskBridge API Routes

## 🔐 Authentication Routes
<details>
<summary>Click to expand auth routes</summary>

```http
POST /api/auth/signup - Register a new user
POST /api/auth/login - Login existing user
GET /api/auth/profile - Get authenticated user's profile (Protected)
```
</details>

## 📋 Task Routes
<details>
<summary>Click to expand task routes</summary>

```http
GET /api/tasks/:team_code - Get all tasks for a team
GET /api/tasks/stage/:stage/:team_code - Get tasks by stage for a team
GET /api/tasks/member/:member_id/:team_code - Get tasks assigned to specific member
POST /api/tasks - Create new task (Admin only)
PATCH /api/tasks/:id - Update existing task (Admin only)
DELETE /api/tasks/delete/:id - Delete task (Admin only)
POST /api/tasks/:id/comments - Add comment to task
```
</details>

## 🎥 Meeting Routes
<details>
<summary>Click to expand meeting routes</summary>

```http
POST /api/meetings/create - Create a new meeting
GET /api/meetings/upcoming/:team_code - Get upcoming meetings for team
GET /api/meetings/:id - Get specific meeting details
POST /api/meetings/:id/join - Join a meeting
POST /api/meetings/:id/notes - Add notes to meeting
GET /api/meetings/:id/chat - Get meeting chat history
```
</details>

## 👥 Team Routes
<details>
<summary>Click to expand team routes</summary>

```http
GET /api/team/:team_code - Get all team members
POST /api/team/new_user - Add new user to team
PATCH /api/team/user/:full_name/:team_code/edit - Edit team member
DELETE /api/team/user/:full_name/:team_code/delete - Remove team member
POST /api/team/import-members - Import multiple team members (Admin only)
```
</details>

## 💬 Chat Routes
<details>
<summary>Click to expand chat routes</summary>

```http
POST /api/chat/send - Send a new message
GET /api/chat/history/:userId - Get chat history with specific user
PUT /api/chat/read - Mark messages as read
DELETE /api/chat/delete/:messageId - Delete a message
```
</details>

## 📁 Document Routes
<details>
<summary>Click to expand document routes</summary>

```http
POST /api/documents/folder - Create new folder
GET /api/documents/folder/:team_code - Get all folders for team
POST /api/documents/upload - Upload new document
GET /api/documents/team/:team_code - Get all documents for team
DELETE /api/documents/:id - Delete document
POST /api/documents/:id/share - Share document with team members
```
</details>

## 🔑 Authentication Required
All routes except `/api/auth/login` and `/api/auth/signup` require authentication header:
```http
Authorization: Bearer <jwt_token>
```

## 👑 Admin Only Routes
The following routes require admin privileges:
- Creating tasks
- Updating tasks
- Deleting tasks
- Importing team members


## 🚀 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/TaskBridge.git
cd TaskBridge
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# In server directory, create .env file
URI - for mongodb sring
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

```

4. Start the development servers
```bash
# Start backend server (from server directory)
node server.js

# Start frontend server (from client directory)
npm run dev
```
