/**
 * Bootcamp UIP — control de acceso para integrar SIN rediseñar Registro, Inicio,
 * Cronograma ni las demás páginas. Fecha/hora oficial: Panamá (UTC-05).
 *
 * Uso:
 *   import { gateBootcampRoutes } from './bootcamp-access-guard.js';
 *   gateBootcampRoutes({ currentPath: location.pathname, isAuthenticated: !!user,
 *       onLocked: () => navigate('/inicio') });
 *
 * IMPORTANTE: también implementar protección en el servidor/API para los retos.
 * El navegador es un control visual, no una autorización segura.
 */
export const BOOTCAMP_OPENS_AT = '2026-11-14T08:00:00-05:00';
export const BOOTCAMP_OPEN_TIMESTAMP = Date.parse(BOOTCAMP_OPENS_AT);
export const BOOTCAMP_PUBLIC_ROUTES = Object.freeze([
  '/', '/inicio', '/registro', '/cronograma', '/instrucciones',
  '/login', '/acceso', '/recuperar-contrasena'
]);
export function bootcampCountdown(now = Date.now()) {
  const remaining = Math.max(0, BOOTCAMP_OPEN_TIMESTAMP - now);
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor(remaining / 3600000) % 24,
    minutes: Math.floor(remaining / 60000) % 60,
    seconds: Math.floor(remaining / 1000) % 60,
    isOpen: remaining === 0,
    remaining
  };
}
function cleanPath(path = '/') {
  const pathname = String(path).split(/[?#]/)[0];
  return (pathname.replace(/\/+$/, '') || '/').toLowerCase();
}
export function canEnterBootcampPage({ currentPath, isAuthenticated = false, now = Date.now(), isAdmin = false }) {
  const route = cleanPath(currentPath);
  if (BOOTCAMP_PUBLIC_ROUTES.includes(route)) return true;
  if (!isAuthenticated) return false;
  // Coordinación puede gestionar participantes antes del evento.
  if (isAdmin && (route === '/coordinacion' || route.startsWith('/coordinacion/'))) return true;
  // Retos y demás módulos privados, únicamente después de la apertura.
  return now >= BOOTCAMP_OPEN_TIMESTAMP;
}
export function gateBootcampRoutes({ currentPath, isAuthenticated, isAdmin = false, onLocked, now = Date.now() }) {
  const allowed = canEnterBootcampPage({ currentPath, isAuthenticated, isAdmin, now });
  if (!allowed && typeof onLocked === 'function') onLocked();
  return allowed;
}
