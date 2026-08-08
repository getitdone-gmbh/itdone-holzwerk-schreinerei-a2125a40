const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;

const pool = new Pool({
  connectionString: (process.env.DATABASE_URL || '').replace('sslmode=require', 'sslmode=no-verify'),
});

async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS anfragen (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        telefon TEXT,
        nachricht TEXT NOT NULL,
        erstellt_am TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    console.log('Datenbank bereit.');
  } catch (err) {
    console.error('Fehler beim Initialisieren der Datenbank:', err);
  }
}
initDb();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/kontakt', async (req, res) => {
  const { name, email, telefon, nachricht } = req.body;

  if (!name || !email || !nachricht) {
    return res.redirect('/?status=error#kontakt');
  }

  try {
    await pool.query(
      'INSERT INTO anfragen (name, email, telefon, nachricht) VALUES ($1, $2, $3, $4)',
      [name, email, telefon || null, nachricht]
    );
    return res.redirect('/?status=erfolg#kontakt');
  } catch (err) {
    console.error('Fehler beim Speichern der Anfrage:', err);
    return res.redirect('/?status=error#kontakt');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Holzwerk-Seite läuft auf Port ${PORT}`);
});
