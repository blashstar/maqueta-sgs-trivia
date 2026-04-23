const cachePrecarga = new Map();

export const imagenesTrivia = [
  '/assets/img/fondo.png',
  '/assets/img/logotipo.png',
  '/assets/img/supervisor-ok.png',
  '/assets/img/supervisor-pensando.png',
  '/assets/img/supervisor-diciendo.png',
  '/assets/img/supervisor-afirma.png',
  '/assets/img/supervisor-apunta.png'
];

export const precargarImagen = (rutaImagen) => {
  if (!rutaImagen) {
    return Promise.resolve(false);
  }

  if (cachePrecarga.has(rutaImagen)) {
    return cachePrecarga.get(rutaImagen);
  }

  const promesa = new Promise((resolve) => {
    const imagen = new Image();
    imagen.decoding = 'async';
    imagen.onload = () => resolve(true);
    imagen.onerror = () => resolve(false);
    imagen.src = rutaImagen;
  });

  cachePrecarga.set(rutaImagen, promesa);
  return promesa;
};

export const precargarImagenes = async (rutas = []) => {
  const imagenesValidas = rutas.filter(Boolean);
  await Promise.all(imagenesValidas.map((ruta) => precargarImagen(ruta)));
};
