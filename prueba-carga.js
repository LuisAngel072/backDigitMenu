import http from 'k6/http';
import { check, sleep } from 'k6';

// --- CONFIGURACIÓN DE LA PRUEBA ---
export const options = {
  // 1. Carga: 50 usuarios virtuales (VUs) simultáneos
  vus: 50,

  // 2. Duración: Mantener el ataque por 30 segundos
  duration: '30s',

  // 3. Criterios de Aceptación (Thresholds)
  thresholds: {
    // El 95% de las peticiones deben ser más rápidas que 200ms
    http_req_duration: ['p(95)<200'],

    // La tasa de errores debe ser menor al 1%
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // --- DEFINICIÓN DE LA URL ---

  // IMPORTANTE: Como K6 corre en un contenedor, 'localhost' es él mismo.
  // Para acceder a tu PC (donde está el Backend corriendo), usamos:
  // - Windows/Mac: 'host.docker.internal'
  // - Linux: 'localhost' (pero requiere un flag extra en el comando docker)

  // Apuntamos al endpoint que filtra por rol 'mesero'
  const url = 'http://18.191.20.158:3000/api/pedidos/activos/mesero';

  // Realizamos la petición GET
  const res = http.get(url);

  // Validamos que la respuesta sea correcta (Status 200)
  check(res, {
    'status es 200': (r) => r.status === 200,
    // Validamos individualmente que cada petición sea rápida
    'tiempo < 200ms': (r) => r.timings.duration < 200,
  });

  // Pausa de 100ms entre peticiones del mismo usuario (simula comportamiento humano rápido)
  sleep(0.1);
}
