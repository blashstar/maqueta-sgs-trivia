/**
 * Utilidad para detectar y mostrar el estado de conexión
 */

export const configurarMonitorConexion = () => {
  if (typeof window === 'undefined') return;

  const mostrarEstadoConexion = () => {
    const estado = navigator.onLine ? '✅ En línea' : '📴 Sin conexión';
    console.log(`Estado de conexión: ${estado}`);
    
    // Actualizar indicador visual si existe
    const indicador = document.getElementById('indicador-conexion');
    if (indicador) {
      indicador.textContent = navigator.onLine ? 'En línea' : 'Sin conexión';
      indicador.className = navigator.onLine ? 'en-linea' : 'sin-conexion';
    }
  };

  window.addEventListener('online', () => {
    console.log('✅ Conexión restaurada');
    mostrarEstadoConexion();
  });

  window.addEventListener('offline', () => {
    console.log('📴 Modo offline activado');
    mostrarEstadoConexion();
  });

  // Verificar estado inicial
  mostrarEstadoConexion();
};
