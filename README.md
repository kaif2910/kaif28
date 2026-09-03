# 📚 NoteShelf — College Notes Sharing Platform

> A modern, full-stack web application to upload, manage, and share college notes — built for students, organized by department and semester.

---

## ✨ Features

- 📂 **Browse notes** filtered by Department & Semester
- ⬇️ **Download notes** directly from the browser
- 🔐 **Password-protected Admin Dashboard** to upload & delete notes
- 🌗 **Dark / Light Mode** toggle
- 🎞️ **Animated UI** with scroll effects, typewriter text & 3D tilt cards
- 📱 **Fully Responsive** — works on mobile, tablet & desktop
- 🔍 **Live Search** to filter notes by title

---

## 🛠️ Tech Stack

### 🔙 Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | Runtime environment |
| **Express.js** | ^4.19.2 | REST API & static file serving |
| **PostgreSQL (Neon)** | — | Cloud-hosted relational database |
| **pg** | ^8.17.2 | PostgreSQL client for Node.js |
| **dotenv** | ^17.2.3 | Environment variable management |
| **serverless-http** | ^4.0.0 | Wraps Express for Netlify Functions |

### 🖥️ Frontend
| Technology | Purpose |
|---|---|
| **HTML5 + CSS3** | Structure & styling (Glassmorphism, CSS Variables, Dark Mode) |
| **Vanilla JavaScript (ES6+)** | DOM manipulation, Fetch API, interactivity |
| **Google Fonts — Inter** | Typography |
| **Swiper.js v12** | Touch-friendly image carousel / slider |
| **AOS.js** (Animate On Scroll) | Scroll-triggered entrance animations |
| **Typed.js v2.1.0** | Typewriter text animation effect |
| **VanillaTilt.js v1.8.0** | 3D tilt hover effect on note cards |

### ☁️ Deployment
| Platform | Purpose |
|---|---|
| **Netlify** | Primary deployment with Netlify Functions (serverless backend) |
| **Vercel** | Alternative deployment (`vercel.json` included) |
| **Neon** | Serverless PostgreSQL cloud database hosting |

---

## 📁 Project Structure

```
clg-pj/
├── public/
│   ├── index.html        # Main student-facing page
│   ├── admin.html        # Admin dashboard (upload & delete notes)
│   └── favicon.png       # App icon
├── netlify/
│   └── functions/        # Netlify serverless functions
├── server.js             # Express server & REST API routes
├── db.js                 # PostgreSQL database connection & queries
├── .env                  # Environment variables (never commit this!)
├── .env.example          # Example env file for reference
├── netlify.toml          # Netlify deployment config
├── vercel.json           # Vercel deployment config
└── package.json          # Project metadata & dependencies
```

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notes?department=&semester=` | Get notes for a department/semester |
| `GET` | `/api/notes/all` | Get all notes (admin use) |
| `GET` | `/api/notes/:id` | Get a single note by ID (for download) |
| `POST` | `/api/upload` | Upload a new note *(password protected)* |
| `DELETE` | `/api/notes/:id` | Delete a note *(password protected)* |

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- A [Neon](https://neon.tech) PostgreSQL database (free tier available)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/noteshelf.git
   cd noteshelf
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   ```env
   PORT=5500
   UPLOAD_PASSWORD=your_secure_password
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
   ```

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Open in browser**
   ```
   http://localhost:5500
   ```

---

## 🚀 Deployment

### Netlify (Recommended)
- Connect your repo to Netlify
- Set environment variables in the Netlify dashboard
- Build command: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions`

### Vercel
- Connect your repo to Vercel
- Set environment variables in the Vercel dashboard
- The `vercel.json` config handles routing automatically

---

## 🔐 Security Notes

> ⚠️ **Never commit your `.env` file to Git.** It contains your database credentials.

- The `UPLOAD_PASSWORD` protects note upload & delete operations
- The Admin Dashboard at `/admin` requires the password to perform any action
- Database uses SSL (`sslmode=require`) for all connections

---

## 👨‍💻 Author

**Kaif** — Built as a college project to simplify note sharing across departments.

---

## 📄 License

ISC
