const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
      content TEXT NOT NULL
    );
  `;
  await pool.query(query);
};

const getNotes = async (department) => {
  const query = 'SELECT id, title, department FROM notes WHERE department = $1';
  const { rows } = await pool.query(query, [department]);
  return rows;
};

const getNoteById = async (id) => {
  const query = 'SELECT * FROM notes WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const createNote = async (title, department, content) => {
  const query = 'INSERT INTO notes (title, department, content) VALUES ($1, $2, $3) RETURNING *';
  const { rows } = await pool.query(query, [title, department, content]);
  return rows[0];
};

module.exports = {
  createTable,
  getNotes,
  getNoteById,
  createNote,
};
