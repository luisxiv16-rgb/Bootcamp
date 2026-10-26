-- BOOTCAMP UIP 2027 · esquema para Supabase dedicado
-- Ejecutar solo en un proyecto nuevo de Bootcamp, no en TCU UIP.
create table if not exists public.bootcamp_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  school text,
  career text not null,
  team text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists bootcamp_profiles_career_idx on public.bootcamp_profiles(career);
create unique index if not exists bootcamp_profiles_email_idx on public.bootcamp_profiles(lower(email));

create or replace function public.bootcamp_is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.bootcamp_profiles p
 where p.id = (select auth.uid()) and p.is_admin = true);
$$;
revoke all on function public.bootcamp_is_admin() from public;
grant execute on function public.bootcamp_is_admin() to authenticated;

alter table public.bootcamp_profiles enable row level security;
drop policy if exists "Read own profile or admin" on public.bootcamp_profiles;
create policy "Read own profile or admin" on public.bootcamp_profiles
for select to authenticated using (id = (select auth.uid()) or public.bootcamp_is_admin());
drop policy if exists "Admin updates team" on public.bootcamp_profiles;
create policy "Admin updates team" on public.bootcamp_profiles
for update to authenticated using (public.bootcamp_is_admin())
with check (public.bootcamp_is_admin());

-- Impedir que administradores cambien is_admin y otros datos de perfiles desde cliente.
revoke all on public.bootcamp_profiles from anon, authenticated;
grant select on public.bootcamp_profiles to authenticated;
grant update(team) on public.bootcamp_profiles to authenticated;

create or replace function public.bootcamp_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.bootcamp_profiles(id, full_name, email, school, career, is_admin)
 values (new.id,
 left(coalesce(nullif(new.raw_user_meta_data->>'full_name',''), 'Participante'), 120),
 lower(new.email),
 left(coalesce(new.raw_user_meta_data->>'school',''),120),
 left(coalesce(nullif(new.raw_user_meta_data->>'career',''), 'Sin asignar'),120),
 lower(new.email) in ('luis.bermudez@uip.pa','marcel.gutierrez@uip.pa'))
 on conflict(id) do nothing;
 return new;
end;
$$;
drop trigger if exists bootcamp_on_auth_user_created on auth.users;
create trigger bootcamp_on_auth_user_created after insert on auth.users
for each row execute function public.bootcamp_new_user();

-- IMPORTANTE: habilitar confirmación de email y restringir cambios de correo
-- en Supabase Auth; verificar identidad institucional antes de dar privilegios.
