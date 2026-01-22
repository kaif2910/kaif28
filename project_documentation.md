
# Project Documentation: College Notes

## 1. Description

This project is a simple web application for sharing college notes. It provides a web interface to view and download notes in PDF format. It also includes a password-protected admin panel for uploading new notes.

## 2. Code

### `server.js`

```javascript
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5500;
const host = '192.168.0.124';

const UPLOAD_PASSWORD = 'admin';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Multer setup
const storage = multer.diskStorage({
    destination: 'notes/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readdir(path.join(__dirname, 'notes'), (err, files) => {
        if (err) {
            console.error("Error reading notes directory:", err);
            return res.status(500).json({ error: 'Failed to read notes directory' });
        }
        const pdfFiles = files
            .filter(file => path.extname(file).toLowerCase() === '.pdf')
            .map(file => ({
                title: path.basename(file, '.pdf'),
                fileName: file
            }));
        res.json(pdfFiles);
    });
});

app.post('/api/upload', upload.single('note'), (req, res) => {
    if (!req.body.password || req.body.password !== UPLOAD_PASSWORD) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting temp file:", err);
            });
        }
        return res.status(401).send('Unauthorized. Incorrect password.');
    }
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send('File uploaded successfully!');
});

// Static file serving
app.use('/notes', express.static(path.join(__dirname, 'notes')));
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from public dir

// Fallback to serve index.html for any other request
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}`);
});
```

### `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>College Notes by kaif</title>
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
        }
        header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #ccc;
        }
        h1 {
            margin: 0;
        }
        .notes-container {
            margin-top: 20px;
        }
        .note-item {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .note-item h3 {
            margin: 0;
        }
        .download-btn {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 5px;
        }

        .admin-panel {
            background-color: #f2f2f2;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .admin-panel .container {
            max-width: 500px;
            margin: 0 auto;
        }
        .admin-panel input, .admin-panel button {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }
    </style>
</head>
<body>
    <header>
        <h1>College Notes by kaif</h1>
        <p>A place to find and share notes.</p>
    </header>

    <div class="admin-panel">
        <h2>Admin Panel</h2>
        <div class="container">
            <h3>Upload a New Note</h3>
            <form action="/api/upload" method="post" enctype="multipart/form-data">
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>

                <label for="note">Select a PDF file:</label>
                <input type="file" id="note" name="note" accept=".pdf" required>

                <button type="submit">Upload</button>
            </form>
        </div>
    </div>

    <div class="notes-container" id="notes-list">
        <!-- Notes will be added here dynamically -->
    </div>

    <script>
        const notesList = document.getElementById('notes-list');
        const uploadForm = document.querySelector('form');

        function renderNotes(notes) {
            notesList.innerHTML = '';
            notes.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note-item');

                const noteTitle = document.createElement('h3');
                noteTitle.textContent = note.title;

                const downloadLink = document.createElement('a');
                downloadLink.classList.add('download-btn');
                downloadLink.href = `/notes/${note.fileName}`;
                downloadLink.textContent = 'Download';
                downloadLink.download = note.fileName;

                noteElement.appendChild(noteTitle);
                noteElement.appendChild(downloadLink);

                notesList.appendChild(noteElement);
            });
        }

        function fetchNotes() {
            fetch('/api/notes')
                .then(response => response.json())
                .then(notes => {
                    renderNotes(notes);
                })
                .catch(error => {
                    console.error('Error fetching notes:', error);
                    notesList.innerHTML = '<p>Could not load notes. Please try again later.</p>';
                });
        }

        uploadForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(uploadForm);

            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Upload failed. Check password or file.');
            })
            .then(message => {
                alert(message); // Show success message
                fetchNotes(); // Refresh the notes list
                uploadForm.reset(); // Clear the form
            })
            .catch(error => {
                alert(error.message);
            });
        });

        // Initial fetch of notes when the page loads
        fetchNotes();
    </script>
</body>
</html>
```

## 3. Screenshots

_Please insert your screenshots in this section. You can use Markdown syntax to embed images, like this: `![Caption for your screenshot](path/to/your/screenshot.png)`_

### Screenshot 1: Main Page

![Main Page](path/to/your/screenshot1.png)

### Screenshot 2: Admin Panel

![Admin Panel](path/to/your/screenshot2.png)

### Screenshot 3: Notes List

![Notes List](path/to/your/screenshot3.png)

### Screenshot 4: Successful Upload

![Successful Upload](path/to/your/screenshot4.png)

### Screenshot 5: Failed Upload

![Failed Upload](path/to/your/screenshot5.png)
