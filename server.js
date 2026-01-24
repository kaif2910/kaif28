
const express = require('express');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5500;
const host = '0.0.0.0';

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD || '1234';

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 encoded files

// API to get notes for a specific department
app.get('/api/notes', async (req, res) => {
    const department = req.query.department;
    if (!department) {
        return res.json([]);
    }
    try {
        const notes = await db.getNotes(department);
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching notes');
    }
});

// API to get a single note by ID
app.get('/api/notes/:id', async (req, res) => {
    try {
        const note = await db.getNoteById(req.params.id);
        if (note) {
            res.json(note);
        } else {
            res.status(404).send('Note not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching note');
    }
});

// API to upload a note to a specific department
app.post('/api/upload', async (req, res) => {
    if (!req.body.password || req.body.password !== UPLOAD_PASSWORD) {
        return res.status(401).send('Unauthorized. Incorrect password.');
    }

    if (!req.body.note || !req.body.department || !req.body.title) {
        return res.status(400).send('Missing note data.');
    }

    try {
        await db.createNote(req.body.title, req.body.department, req.body.note);
        res.send('File uploaded successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading note');
    }
});

// Static file serving for all notes within their subdirectories
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from public dir

// Fallback to serve notesshelf.html for any other request
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notesshelf.html'));
});

app.listen(port, async () => {
    await db.createTable();
    console.log(`Server listening on port ${port}`);
});