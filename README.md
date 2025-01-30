# Note Taking Application

A modern, secure note-taking application built with the MERN stack (MongoDB, Express, React, Node.js) and Firebase Authentication. Features a beautiful neumorphic design and real-time updates.

## 🌟 Features

- 🔐 Secure authentication with Firebase
- 📝 Create, read, update, and delete notes
- 💫 Beautiful neumorphic UI design
- 🔄 Real-time updates
- 📱 Responsive layout
- 🌙 Clean and modern interface

## 🛠️ Tech Stack

### Frontend
- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- React Hot Toast for notifications
- Axios for API requests
- Firebase for authentication

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Firebase Admin SDK
- Express Validator
- CORS enabled

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB Atlas account
- Firebase project with Authentication enabled

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/note-taking.git
cd note-taking
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd client
npm install
```

4. Start the development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

## 🌐 Deployment

This application is configured for deployment on Render.com

### Deployment Steps

1. Push your code to GitHub
2. Create a new account on Render.com
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` configuration
5. Set up your environment variables in Render's dashboard
6. Deploy both services (backend and frontend)

### Environment Variables on Render

Backend Service:
- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB connection string
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `PORT`: 8080

Frontend Service:
- `VITE_API_URL`: Your backend service URL
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID

## 📁 Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   ├── services/      # API services
│   │   └── config/        # Configuration files
│   └── public/            # Static files
│
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   └── dist/              # Compiled TypeScript
│
└── render.yaml            # Render deployment configuration
```

## 🔒 Security

- Firebase Authentication for secure user management
- MongoDB Atlas for secure database hosting
- CORS enabled for API security
- Environment variables for sensitive data
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for authentication
- MongoDB Atlas for database hosting
- Render for deployment
- React Hot Toast for notifications
- Tailwind CSS for styling 