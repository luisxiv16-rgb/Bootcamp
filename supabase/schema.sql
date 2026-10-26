-- Bootcamp UIP: ejecutar en un proyecto Supabase dedicado.
create table if not exists public.bootcamp_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text not null,
 full_name text not null,
 school text not null,
 career text not null,
 team text,
 is_admin boolean not null default false,
 created_at timestamptz not null default now()
);
create index if not exists bootcamp_career_team_idx on public.bootcamp_profiles (career,team);
alter table public.bootcamp_profiles enable row level security;
create or replace function public.bootcamp_is_admin() returns boolean language sql stable security definer set search_path = public as $$
 select exists (select 1 from public.bootcamp_profiles where id = auth.uid() and is_admin)
$$;
revoke all on function public.bootcamp_is_admin() from public;
grant execute on function public.bootcamp_is_admin() to authenticated;
drop policy if exists "read own or admin" on public.bootcamp_profiles;
create policy "read own or admin" on public.bootcamp_profiles for select to authenticated using (auth.uid()=id or public.bootcamp_is_admin());
drop policy if exists "admin team update" on public.bootcamp_profiles;
create policy "admin team update" on public.bootcamp_profiles for update to authenticated using (public.bootcamp_is_admin()) with check (public.bootcamp_is_admin());
-- Los datos vienen del registro de Auth, no del navegador con privilegios.
create or replace function public.bootcamp_create_profile() returns trigger language plpgsql security definer set search_path = public as $$
begin
 insert into public.bootcamp_profiles(id,email,full_name,career,school)
 values(new.id,coalesce(new.email,''),coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.raw_user_meta_data->>'career',''),coalesce(new.raw_user_meta_data->>'school',''))
 on conflict (id) do nothing;
 return new;
end $$;
drop trigger if exists bootcamp_auth_insert on auth.users;
create trigger bootcamp_auth_insert after insert on auth.users for each row execute function public.bootcamp_create_profile();
-- IMPORTANTE: nombrar administradores desde SQL autenticado con privilegios, nunca desde el cliente.
-- update public.bootcamp_profiles set is_admin=true where lower(email) in ('marcel.gutierrez@uip.pa','luis.bermudez@uip.pa');
