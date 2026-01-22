const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5500; // Use process.env.PORT for Render
const host = '0.0.0.0';

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD || '1234';
const NOTES_DIR = path.join(__dirname, 'notes');


// Ensure base notes directory exists
if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Multer setup for dynamic destinations
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const department = req.body.department || 'general'; // Fallback department
        const departmentDir = path.join(NOTES_DIR, department);
        
        // Ensure the department-specific directory exists
        fs.mkdir(departmentDir, { recursive: true }, (err) => {
            if (err) {
                return cb(err, null);
            }
            cb(null, departmentDir);
        });
    },
    filename: (req, file, cb) => {
        // Use the original filename.
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// API to get notes for a specific department
app.get('/api/notes', (req, res) => {
    const department = req.query.department;
    if (!department) {
        // If no department is specified, return an empty array as per frontend expectation.
        return res.json([]);
    }

    const departmentDir = path.join(NOTES_DIR, department);

    fs.readdir(departmentDir, (err, files) => {
        if (err) {
            // If the directory doesn't exist, it's not an error, just an empty department.
            return res.json([]);
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

// API to upload a note to a specific department
app.post('/api/upload', upload.single('note'), (req, res) => {
    // Password check
    if (!req.body.password || req.body.password !== UPLOAD_PASSWORD) {
        // If a file was temporarily uploaded, delete it.
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting temp file due to bad password:", err);
            });
        }
        return res.status(401).send('Unauthorized. Incorrect password.');
    }

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    
    res.send(`File uploaded successfully to ${req.body.department} department!`);
});

// Static file serving for all notes within their subdirectories
app.use('/notes', express.static(NOTES_DIR));
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from public dir

// Fallback to serve notesshelf.html for any other request
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notesshelf.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});