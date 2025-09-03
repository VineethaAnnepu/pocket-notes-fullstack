# 🗒️ Pocket Notes - Full Stack Application

A secure, full-featured notes application built with React and Node.js, featuring JWT authentication, real-time updates, and end-to-end encryption.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication with encrypted passwords
- **👥 Group Management**: Create and manage note groups with custom colors
- **📝 Real-time Notes**: Add, edit, and delete notes instantly
- **🎨 Beautiful UI**: Clean, responsive design with modular CSS
- **🛡️ Input Validation**: Comprehensive form validation on both frontend and backend
- **🔔 Toast Notifications**: User-friendly feedback with react-toastify
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **React Toastify** - Toast notifications
- **Vanilla CSS** - Pure CSS with modular approach (no frameworks)

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation and sanitization

## 🛠️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/pocket-notes-fullstack
   cd pocket-notes-fullstack
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm run install-all
   \`\`\`

3. **Set up environment variables**

   **Server (.env in /server folder):**
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/pocket-notes
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   \`\`\`

   **Client (.env in /client folder):**
   \`\`\`env
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

4. **Start the development servers**
   \`\`\`bash
   npm run dev
   \`\`\`

   This will start both the backend server (port 5000) and React development server (port 3000).

5. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 📁 Project Structure

\`\`\`
pocket-notes-fullstack/
├── server/                          # Backend (Node.js + Express)
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic
│   │   ├── groupController.js       # Group management
│   │   └── notesController.js       # Notes CRUD operations
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Group.js                 # Group schema
│   │   └── Note.js                  # Note schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   ├── groupRoutes.js           # Group endpoints
│   │   └── notesRoutes.js           # Notes endpoints
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── server.js                    # Server entry point
└── client/                          # Frontend (React)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── LoadingSpinner/
    │   │   └── ProtectedRoute/
    │   ├── contexts/
    │   │   └── AuthContext.js       # Authentication context
    │   ├── pages/
    │   │   ├── Login/
    │   │   ├── Register/
    │   │   └── Dashboard/           # Main notes interface
    │   ├── services/
    │   │   ├── authService.js       # Auth API calls
    │   │   ├── groupService.js      # Group API calls
    │   │   └── notesService.js      # Notes API calls
    │   ├── App.js
    │   └── index.js
    └── package.json
\`\`\`

## 🔒 Security Features

- **Password Encryption**: All passwords are hashed using bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **Protected Routes**: Frontend route protection with authentication checks
- **SQL Injection Prevention**: Mongoose ODM prevents injection attacks
- **XSS Protection**: Input sanitization and proper output encoding

## 📝 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user (protected)

### Groups
- \`GET /api/groups\` - Get user's groups (protected)
- \`POST /api/groups\` - Create new group (protected)
- \`GET /api/groups/:id\` - Get single group (protected)
- \`DELETE /api/groups/:id\` - Delete group (protected)

### Notes
- \`GET /api/notes/group/:groupId\` - Get notes for a group (protected)
- \`POST /api/notes/group/:groupId\` - Create new note (protected)
- \`PUT /api/notes/:id\` - Update note (protected)
- \`DELETE /api/notes/:id\` - Delete note (protected)

## 🚀 Deployment

### Using Render (Recommended)

1. **Backend Deployment**
   - Push your code to GitHub
   - Connect your repo to Render
   - Create a new Web Service
   - Set build command: \`npm install\`
   - Set start command: \`npm start\`
   - Add environment variables

2. **Frontend Deployment**
   - Create a new Static Site on Render
   - Set build command: \`npm run build\`
   - Set publish directory: \`build\`

3. **Database**
   - Use MongoDB Atlas for cloud database
   - Update \`MONGODB_URI\` in your environment variables

### Environment Variables for Production

**Backend:**
\`\`\`env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.onrender.com
\`\`\`

**Frontend:**
\`\`\`env
REACT_APP_API_URL=https://your-backend-domain.onrender.com/api
\`\`\`

## 🧪 Testing

Run the application locally and test the following features:
- [ ] User registration and login
- [ ] JWT token persistence
- [ ] Group creation with color selection
- [ ] Note creation, editing, and deletion
- [ ] Responsive design on different screen sizes
- [ ] Form validations and error handling
- [ ] Toast notifications

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community for the robust web framework
- MongoDB team for the flexible database solution
- All the open-source contributors who made this project possible

## 📞 Support

If you have any questions or run into issues, please:
1. Check the [Issues](https://github.com/yourusername/pocket-notes-fullstack/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

---

Made with ❤️ by [vineetha Annepu]
\`\`\`