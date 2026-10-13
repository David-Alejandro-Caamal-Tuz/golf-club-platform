'use client';

import { useEffect, useState, FormEvent } from 'react';

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

  // Estados para el formulario de reserva
  const [courseId, setCourseId] = useState<number>(1);
  const [memberId, setMemberId] = useState<number>(1);
  const [bookingTime, setBookingTime] = useState<string>('');
  const [playersCount, setPlayersCount] = useState<number>(2);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const fetchData = async () => {
    try {
      const coursesRes = await fetch('http://localhost:4000/api/courses');
      const coursesData = await coursesRes.json();
      setCourses(Array.isArray(coursesData) ? coursesData : []);
      if (Array.isArray(coursesData) && coursesData.length > 0) {
        setCourseId(coursesData[0].id);
      }

      const bookingsRes = await fetch('http://localhost:4000/api/bookings');
      const bookingsData = await bookingsRes.json();
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      setCourses([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBooking = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    if (!courseId) {
      setMessage('Error: Por favor selecciona un campo de golf.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: Number(courseId),
          member_id: Number(memberId),
          booking_time: bookingTime,
          players_count: Number(playersCount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('¡Reserva creada con éxito! Nos vemos en el green ⛳');
        setBookingTime('');
        fetchData();
      } else {
        setMessage(`Error: ${data.error || 'No se pudo procesar la reserva'}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMessage('Error al conectar con el servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  // Función para hacer scroll suave hacia la sección de reservas
  const scrollToBooking = () => {
    const section = document.getElementById('reservas-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Barra de Navegación Superior */}
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-light tracking-widest uppercase text-emerald-400">Golf Club & Resort</span>
        </div>
        <nav className="hidden md:flex space-x-8 text-sm tracking-wider uppercase text-slate-300">
          <a href="#inicio" className="hover:text-emerald-400 transition">Inicio</a>
          <a href="#campos" className="hover:text-emerald-400 transition">Campos</a>
          <button onClick={scrollToBooking} className="hover:text-emerald-400 transition">Reservar</button>
        </nav>
        <div className="text-xs uppercase tracking-widest text-slate-400 border border-slate-700 px-3 py-1 rounded">
          Español
        </div>
      </header>

      {/* Hero Section (Inspirado en la referencia visual) */}
      <section id="inicio" className="relative h-[85vh] flex items-center justify-center text-center px-4">
        {/* Imagen de fondo estilo campo de golf con overlay oscuro */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1920&auto=format&fit=crop')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-0"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-emerald-400 font-semibold">
            18 Hoyos · Par 72 · Experiencia de Lujo
          </p>
          <h1 className="text-4xl md:text-6xl font-serif tracking-wide text-white">
            Juega Frente al Caribe
          </h1>
          <p className="text-slate-300 max-w-lg mx-auto font-light text-sm md:text-base">
            Disfruta de instalaciones de clase mundial diseñadas para desafiar tu juego en un entorno paradisíaco.
          </p>
          <div className="pt-4">
            <button 
              onClick={scrollToBooking}
              className="bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-widest text-xs font-semibold px-8 py-4 rounded shadow-lg transition duration-300"
            >
              Reserva tu Tee Time
            </button>
          </div>
        </div>
      </section>

      {/* Contenido Principal / Sección de Reservas y Campos */}
      <main id="reservas-section" className="max-w-6xl mx-auto px-6 py-16 space-y-16">
        
        {loading ? (
          <div className="text-center py-12 text-slate-400">Cargando experiencia del club...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Formulario de Reserva (Ocupa 2 columnas) */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-2xl">
              <h2 className="text-2xl font-serif text-emerald-400 mb-2">Portal de Reservas - Tee Times</h2>
              <p className="text-slate-400 text-sm mb-6">Selecciona tu campo preferido, fecha y horario para asegurar tu salida.</p>

              {message && (
                <div className={`p-4 mb-6 rounded text-sm ${message.includes('éxito') ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200' : 'bg-red-950/80 border border-red-800 text-red-200'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleCreateBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Campo de Golf</label>
                  <select 
                    value={courseId} 
                    onChange={(e) => setCourseId(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    {Array.isArray(courses) && courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Número de Jugadores (Máx 4)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="4" 
                    value={playersCount} 
                    onChange={(e) => setPlayersCount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Fecha y Hora de Salida</label>
                  <input 
                    type="datetime-local" 
                    value={bookingTime} 
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-widest text-xs font-semibold py-4 rounded transition duration-200 disabled:opacity-50 shadow-md"
                  >
                    {submitting ? 'Procesando Reserva...' : 'Confirmar y Bloquear Tee Time'}
                  </button>
                </div>
              </form>
            </div>

            {/* Columna Derecha: Campos Disponibles */}
            <div className="space-y-6">
              <div id="campos" className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
                <h3 className="text-lg font-serif text-emerald-400 mb-4 border-b border-slate-800 pb-3">Nuestros Campos</h3>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-slate-800/60 p-4 rounded border border-slate-700/50">
                      <h4 className="font-semibold text-white">{course.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">Ubicación: {course.location}</p>
                      <div className="mt-3 flex justify-between text-xs text-emerald-400 font-medium">
                        <span>Hoyos: {course.total_holes}</span>
                        <span>Par: {course.par_total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Sección Inferior: Próximas Salidas Registradas */}
        <section className="bg-slate-900 border border-slate-800 p-8 rounded-xl shadow-xl">
          <h3 className="text-xl font-serif text-emerald-400 mb-6">Próximas Salidas Confirmadas (Tee Times)</h3>
          {bookings.length === 0 ? (
            <p className="text-slate-400 text-sm">No hay reservas registradas en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-slate-800/40 border border-slate-800 p-4 rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">{booking.first_name} {booking.last_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Campo: {booking.course_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-emerald-400 font-medium">{new Date(booking.booking_time).toLocaleString()}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Jugadores: {booking.players_count}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Pie de página */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500 tracking-wider">
        <p>© 2026 Golf Club & Resort Platform · Desarrollado para Portafolio Profesional.</p>
      </footer>

    </div>
  );
}