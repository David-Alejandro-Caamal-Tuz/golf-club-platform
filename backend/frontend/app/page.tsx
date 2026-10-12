'tsx' // o tsx standard react
'use client';

import { useEffect, useState } from 'react';

interface Course {
  id: number;
  name: string;
  total_holes: number;
  par_total: number;
  location: string;
}

interface Booking {
  id: number;
  booking_time: string;
  players_count: number;
  status: string;
  first_name: string;
  last_name: string;
  course_name: string;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Como estamos en Codespaces, puedes cambiar localhost por la URL de tu API o usar el puerto 4000
    const fetchData = async () => {
      try {
        const coursesRes = await fetch('http://localhost:4000/api/courses');
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

        const bookingsRes = await fetch('http://localhost:4000/api/bookings');
        const bookingsData = await bookingsRes.json();
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-emerald-400">⛳ Club de Golf - Panel de Control</h1>
        <p className="text-gray-400 mb-8">Plataforma Full Stack desarrollada para portafolio profesional.</p>

        {loading ? (
          <p>Cargando información del servidor...</p>
        ) : (
          <div className="space-y-8">
            {/* Sección de Campos */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-emerald-300">Campos Disponibles</h2>
              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-700 p-4 rounded bg-gray-750">
                    <h3 className="text-xl font-bold">{course.name}</h3>
                    <p className="text-gray-300">Ubicación: {course.location}</p>
                    <p className="text-sm text-gray-400">Hoyos: {course.total_holes} | Par: {course.par_total}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sección de Reservas / Tee Times */}
            <section className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-emerald-300">Próximas Salidas (Tee Times)</h2>
              {bookings.length === 0 ? (
                <p className="text-gray-400">No hay reservas registradas.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex justify-between items-center border-b border-gray-700 pb-3">
                      <div>
                        <p className="font-bold">{booking.first_name} {booking.last_name}</p>
                        <p className="text-sm text-gray-400">Campo: {booking.course_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-emerald-400">{new Date(booking.booking_time).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Jugadores: {booking.players_count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}