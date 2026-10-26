-- Completar el perfil del titular autenticado con Google.
create or replace function public.bootcamp_complete_registration(
 p_name text, p_school text, p_career text
) returns void
language plpgsql security definer set search_path = ''
as $$
begin
 if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
 if length(btrim(coalesce(p_name,''))) < 2
    or length(btrim(coalesce(p_school,''))) < 2
    or p_career not in ('Psicología','Derecho','Ingeniería','Medicina','Enfermería','Negocios','Comunicación','Otra')
 then raise exception 'Revisa tus datos'; end if;
 update public.bootcamp_profiles
 set full_name=left(btrim(p_name),120), school=left(btrim(p_school),120), career=p_career
 where id=auth.uid();
 if not found then raise exception 'No existe el perfil'; end if;
end
$$;
revoke execute on function public.bootcamp_complete_registration(text,text,text) from public, anon;
grant execute on function public.bootcamp_complete_registration(text,text,text) to authenticated;
