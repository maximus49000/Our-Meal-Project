import { Router } from 'express';
import { pool } from '../db.js';

export const profilesRouter = Router();

profilesRouter.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM profiles ORDER BY name');
  res.json(rows);
});

profilesRouter.get('/:id', async (req, res) => {
  const [[profile]] = await pool.query('SELECT * FROM profiles WHERE id = ?', [
    req.params.id,
  ]);
  if (!profile) return res.status(404).json({ error: 'Profil introuvable' });
  res.json(profile);
});

profilesRouter.post('/', async (req, res) => {
  const { name, birth_date, likes, dislikes, diet, allergies, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'name est requis' });

  const [result] = await pool.query(
    'INSERT INTO profiles (name, birth_date, likes, dislikes, diet, allergies, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, birth_date ?? null, likes ?? null, dislikes ?? null, diet ?? null, allergies ?? null, notes ?? null]
  );
  res.status(201).json({ id: result.insertId });
});

profilesRouter.put('/:id', async (req, res) => {
  const { name, birth_date, likes, dislikes, diet, allergies, notes } = req.body;
  await pool.query(
    `UPDATE profiles SET
      name = COALESCE(?, name),
      birth_date = COALESCE(?, birth_date),
      likes = COALESCE(?, likes),
      dislikes = COALESCE(?, dislikes),
      diet = COALESCE(?, diet),
      allergies = COALESCE(?, allergies),
      notes = COALESCE(?, notes)
     WHERE id = ?`,
    [name ?? null, birth_date ?? null, likes ?? null, dislikes ?? null, diet ?? null, allergies ?? null, notes ?? null, req.params.id]
  );
  res.json({ success: true });
});

profilesRouter.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM profiles WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});
