-- Ejecutar en un proyecto Supabase dedicado a Bootcamp UIP.
create table if not exists public.bootcamp_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text not null,
 career text not null,
 school text not null,
 team text,
 is_admin boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.bootcamp_profiles enable row level security;
create schema if not exists private;
create or replace function private.bootcamp_is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.bootcamp_profiles where id=(select auth.uid()) and is_admin=true); $$;
revoke all on function private.bootcamp_is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.bootcamp_is_admin() to authenticated;
drop policy if exists bootcamp_select on public.bootcamp_profiles;
create policy bootcamp_select on public.bootcamp_profiles for select to authenticated
using (id=(select auth.uid()) or private.bootcamp_is_admin());
drop policy if exists bootcamp_admin_update on public.bootcamp_profiles;
create policy bootcamp_admin_update on public.bootcamp_profiles for update to authenticated
using (private.bootcamp_is_admin()) with check (private.bootcamp_is_admin());
-- No INSERT directo desde el navegador: el trigger crea el perfil.
create or replace function public.bootcamp_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
 insert into public.bootcamp_profiles(id,full_name,career,school,is_admin)
 values(new.id,coalesce(nullif(new.raw_user_meta_data->>'full_name',''),'Participante'),
 coalesce(nullif(new.raw_user_meta_data->>'career',''),'Otra'),
 coalesce(nullif(new.raw_user_meta_data->>'school',''),'No especificado'),
 false);
 return new;
end; $$;
drop trigger if exists on_bootcamp_signup on auth.users;
create trigger on_bootcamp_signup after insert on auth.users
for each row execute function public.bootcamp_new_user();
grant select, update on public.bootcamp_profiles to authenticated;
revoke all on public.bootcamp_profiles from anon;
-- Para cuentas existentes, habilitar solo correos institucionales verificados:
update public.bootcamp_profiles p set is_admin=true
from auth.users u where u.id=p.id and u.email_confirmed_at is not null
and lower(u.email) in ('luis.bermudez@uip.pa','marcel.gutierrez@uip.pa');
