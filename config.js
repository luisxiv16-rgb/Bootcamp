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
    { id: 'registro-rapido-2027', label: 'Registro rápido de participantes', path: '/registro-rapido.html', symbol: '✓' },
    { id: 'mi-registro-qr-2027', label: 'Mi registro y QR', path: '/mi-registro.html', symbol: '▦' },
    { id: 'mis-estaciones-2027', label: 'Mis estaciones 2027', path: '/mis-estaciones.html', symbol: '✦' },
    { id: 'asistencia-general-2027', label: 'Registrar asistencia', path: '/asistencia.html', symbol: '✓' }
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

/* Recuperación robusta de perfiles con un respaldo controlado por auth.uid().
   No crea perfiles, no modifica registros y nunca permite consultar otras cuentas. */
window.bootcampGetOwnProfile = async function (client, user) {
  if (!user || !user.id) return { data: null, error: { message: 'La sesión no está autenticada.' } };
  const primary = await client.from('bootcamp_profiles').select('id,full_name,email,school,career,team,is_admin,created_at').eq('id', user.id).maybeSingle();
  if (!primary.error && primary.data) return { data: primary.data, error: null };
  const backup = await client.rpc('bootcamp_2027_my_profile');
  if (!backup.error && backup.data && backup.data.id === user.id) return { data: backup.data, error: null };
  const detail = backup.error?.message || primary.error?.message || 'El perfil no está disponible.';
  return { data: null, error: { message: detail } };
};
