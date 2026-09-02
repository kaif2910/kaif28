const { Pool } = require('pg');
require('dotenv').config();

const databaseUrl = (process.env.DATABASE_URL || '').replace(/\s+/g, '');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      semester VARCHAR(50),
      content TEXT NOT NULL
    );
  `;
  // Add semester column if it doesn't exist
  try {
    await pool.query("ALTER TABLE notes ADD COLUMN semester VARCHAR(50);");
  } catch (e) {
    // Column might already exist
  }
  await pool.query(query);
};

const getNotes = async (department, semester) => {
  let query = 'SELECT id, title, department, semester FROM notes WHERE department = $1';
  const params = [department];
  if (semester && semester !== 'all') {
    query += ' AND semester = $2';
    params.push(semester);
  }
  const { rows } = await pool.query(query, params);
  return rows;
};

const getAllNotes = async () => {
  const query = 'SELECT id, title, department, semester FROM notes ORDER BY id DESC';
  const { rows } = await pool.query(query);
  return rows;
};

const getNoteById = async (id) => {
  const query = 'SELECT * FROM notes WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const createNote = async (title, department, semester, content) => {
  const query = 'INSERT INTO notes (title, department, semester, content) VALUES ($1, $2, $3, $4) RETURNING *';
  const { rows } = await pool.query(query, [title, department, semester, content]);
  return rows[0];
};

const deleteNote = async (id) => {
  const query = 'DELETE FROM notes WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

module.exports = {
  createTable,
  getNotes,
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
};
