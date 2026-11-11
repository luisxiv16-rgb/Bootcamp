// Clave PUBLICABLE de Supabase, sin credenciales privilegiadas.
window.BOOTCAMP_SUPABASE_URL = 'https://wcaoglimlyyuudunldur.supabase.co';
window.BOOTCAMP_SUPABASE_ANON_KEY = 'sb_publishable_eZtp4b_0G2PT3z3a3qq8LA_hslOja11';

/*
 * Ampliación de navegación Bootcamp UIP 2027.
 * Preserva el index.html original: únicamente incorpora enlaces a
 * páginas funcionales publicadas en el mismo dominio.
 */
document.addEventListener('DOMContentLoaded', function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  [
    { id: 'mi-registro-qr-2027', label: 'Mi registro y QR', path: '/mi-registro.html', symbol: '▦' },
    { id: 'mis-estaciones-2027', label: 'Mis estaciones 2027', path: '/mis-estaciones.html', symbol: '✦' }
  ].forEach(function (entry) {
    if (document.getElementById(entry.id)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.id = entry.id;
    button.setAttribute('aria-label', entry.label);
    button.textContent = entry.symbol + '  ' + entry.label;
    button.addEventListener('click', function () { window.location.assign(entry.path); });
    nav.appendChild(button);
  });
});
