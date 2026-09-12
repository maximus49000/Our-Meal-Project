import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { menusRouter } from './routes/menus.js';
import { profilesRouter } from './routes/profiles.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/menus', menusRouter);
app.use('/api/profiles', profilesRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
