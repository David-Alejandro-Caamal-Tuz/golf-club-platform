import express, { Request, Response } from 'express';
import cors from 'cors';
import { pool } from './db';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API del Club de Golf funcionando correctamente ⛳' });
});

// 1. Obtener campos de golf
app.get('/api/courses', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM golf_courses');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los campos de golf' });
  }
});

// 2. Obtener reservas de Tee Times
app.get('/api/bookings', async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT b.id, b.booking_time, b.players_count, b.status, 
             m.first_name, m.last_name, c.name as course_name
      FROM tee_time_bookings b
      JOIN members m ON b.member_id = m.id
      JOIN golf_courses c ON b.course_id = c.id;
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// 3. Crear una nueva reserva de Tee Time
app.post('/api/bookings', async (req: Request, res: Response) => {
  const { course_id, member_id, booking_time, players_count } = req.body;

  // Validación básica
  if (!course_id || !member_id || !booking_time || !players_count) {
    return res.status(400).json({ error: 'Faltan datos obligatorios para la reserva.' });
  }

  try {
    const query = `
      INSERT INTO tee_time_bookings (course_id, member_id, booking_time, players_count, status)
      VALUES ($1, $2, $3, $4, 'CONFIRMED')
      RETURNING *;
    `;
    const values = [course_id, member_id, booking_time, players_count];
    const result = await pool.query(query, values);
    
    res.status(201).json({
      message: 'Reserva creada con éxito ⛳',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error interno al procesar la reserva' });
  }
});