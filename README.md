# LinkUp 🚀

LinkUp is a full-stack real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) with real-time messaging powered by Socket.IO. Users can send and receive messages instantly without reloading the page, creating a seamless chat experience.


## 🛠 Features

* Real-Time Messaging: Messages are delivered instantly using Socket.IO’s bidirectional communication.
* User Authentication: Secure login and registration with JWT authentication.
* Responsive Design: Smooth and intuitive interface for desktop and mobile devices.
* Media Uploads: Users can send images or files via Cloudinary integration.
* Seamless Experience: Chat without page reloads, making interactions fast and fluid.

## 💻 Technologies Used

* Frontend: React.js
* Backend: Node.js, Express.js
* Database: MongoDB
* Real-Time Communication: Socket.IO
* Authentication: JWT (JSON Web Tokens)
* Media Handling: Cloudinary

## 📥 Installation and Setup

### Clone the repository

```bash
git clone https://github.com/your-username/LinkUp.git
cd LinkUp
```

### Backend Setup
```bash
cd server
npm install
npm run server
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The backend runs on http://localhost:5000 (default) and the frontend runs on http://localhost:3000. Ensure both are running to use the application properly.

## 📂 Project Structure

LinkUp/
  ├─ client/       # React frontend
  ├─ server/       # Node.js backend
  └─ README.md

🚀 Usage

* Register a new account or log in with existing credentials.
* Start chatting with other users in real-time.
* Upload images or files during conversations.
* Enjoy a responsive and seamless chat experience.
