import Dexie from 'dexie';

// Base de datos Dexie para almacenar registros de participantes
export const db = new Dexie('sgs-trivia');

db.version(1).stores({
  registros: '++id, nombre, correo, empresa, fecha'
});

/**
 * Guarda un nuevo registro en la base de datos
 * @param {Object} datos - Datos del registro { nombre, correo, empresa }
 * @returns {Promise<number>} - ID del registro creado
 */
export async function guardarRegistro(datos) {
  const registro = {
    ...datos,
    fecha: Date.now()
  };
  return await db.registros.add(registro);
}

/**
 * Obtiene todos los registros ordenados por fecha (más reciente primero)
 * @returns {Promise<Array>} - Lista de registros
 */
export async function obtenerRegistros() {
  return await db.registros.orderBy('fecha').reverse().toArray();
}

/**
 * Elimina un registro por su ID
 * @param {number} id - ID del registro a eliminar
 * @returns {Promise<number>} - Cantidad de registros eliminados
 */
export async function eliminarRegistro(id) {
  return await db.registros.delete(id);
}

export default db;