import { Router } from 'express';
import { pool } from '../db.js';

export const menusRouter = Router();

// Liste des menus (filtre optionnel par statut : active | archived)
menusRouter.get('/', async (req, res) => {
  const { status } = req.query;
  const where = status ? 'WHERE m.status = ?' : '';
  const params = status ? [status] : [];

  const [rows] = await pool.query(
    `SELECT m.*, f.id IS NOT NULL AS is_favorite
     FROM menus m
     LEFT JOIN menu_favorites f ON f.menu_id = m.id
     ${where}
     ORDER BY m.week_start DESC`,
    params
  );
  res.json(rows);
});

// Détail d'un menu + ses notes
menusRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [[menu]] = await pool.query('SELECT * FROM menus WHERE id = ?', [id]);
  if (!menu) return res.status(404).json({ error: 'Menu introuvable' });

  const [notes] = await pool.query(
    'SELECT * FROM menu_notes WHERE menu_id = ? ORDER BY created_at DESC',
    [id]
  );
  const [[favorite]] = await pool.query(
    'SELECT id FROM menu_favorites WHERE menu_id = ?',
    [id]
  );

  res.json({ ...menu, notes, is_favorite: Boolean(favorite) });
});

// Création d'un menu (généré par Claude ou saisi manuellement)
menusRouter.post('/', async (req, res) => {
  const { title, week_start, content } = req.body;
  if (!title) return res.status(400).json({ error: 'title est requis' });

  const [result] = await pool.query(
    'INSERT INTO menus (title, week_start, content) VALUES (?, ?, ?)',
    [title, week_start ?? null, JSON.stringify(content ?? {})]
  );
  res.status(201).json({ id: result.insertId });
});

// Mise à jour du contenu d'un menu
menusRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, week_start, content } = req.body;

  await pool.query(
    'UPDATE menus SET title = COALESCE(?, title), week_start = COALESCE(?, week_start), content = COALESCE(?, content) WHERE id = ?',
    [title ?? null, week_start ?? null, content ? JSON.stringify(content) : null, id]
  );
  res.json({ success: true });
});

// Archiver / désarchiver un menu
menusRouter.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['active', 'archived'].includes(status)) {
    return res.status(400).json({ error: 'status doit être active ou archived' });
  }
  await pool.query('UPDATE menus SET status = ? WHERE id = ?', [status, id]);
  res.json({ success: true });
});

// Ajouter/retirer un menu des favoris
menusRouter.post('/:id/favorite', async (req, res) => {
  const { id } = req.params;
  await pool.query(
    'INSERT IGNORE INTO menu_favorites (menu_id) VALUES (?)',
    [id]
  );
  res.json({ success: true });
});

menusRouter.delete('/:id/favorite', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM menu_favorites WHERE menu_id = ?', [id]);
  res.json({ success: true });
});

// Ajouter une note (avis) sur un menu
menusRouter.post('/:id/notes', async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const [result] = await pool.query(
    'INSERT INTO menu_notes (menu_id, rating, comment) VALUES (?, ?, ?)',
    [id, rating ?? null, comment ?? null]
  );
  res.status(201).json({ id: result.insertId });
});

// Supprimer un menu
menusRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM menus WHERE id = ?', [id]);
  res.json({ success: true });
});
