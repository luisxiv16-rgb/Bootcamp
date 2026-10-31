const D=[
['IA LAB','¿Humano o IA?',5,'ia',['Explica una capacidad real de la IA','Identifica un riesgo y cómo mitigarlo']],
['IA LAB','Prompt Master',10,'ia',['Rol','Objetivo','Contexto','Condiciones','Formato de salida']],
['IA LAB','Detective digital',5,'ia',['Afirmación que debes verificar','Fuente confiable','Cómo confirmarías la afirmación']],
['MY STORY','Mi historia en tres actos',5,'story',['Quién soy','Mis fortalezas','Hacia dónde voy']],
['MY STORY','Mi pitch profesional',10,'story',['Presentación de aproximadamente 60 segundos','Qué puedo aportar']],
['MY STORY','Mi sello personal',5,'story',['Tres fortalezas','Propuesta de valor']],
['CONNECT','Rompe el hielo',5,'connect',['Cómo iniciarías una conversación','Cómo demostrarías escucha activa']],
['CONNECT','Conecta talentos',10,'connect',['Código consentido de primer compañero','Código consentido de segundo compañero','Interés en común']],
['CONNECT','Mi primera red profesional',5,'connect',['Aprendizaje del intercambio','Colaboración posible']],
['INNOVATION HUB','Game Challenge',15,'game',['Juego utilizado','Código de los dos compañeros','Descripción de la partida']],
['INNOVATION HUB','Fair Play',5,'game',['Qué estrategia aplicaste','Qué aprendiste de respeto y colaboración']],
['INNOVATION HUB','De problema a oportunidad',10,'entrepreneur',['Problema','A quién afecta','Oportunidad de solución']],
['INNOVATION HUB','Mi primera idea emprendedora',10,'entrepreneur',['Nombre de la idea','Problema','Beneficiarios','Solución','Innovación','Recursos','Primera acción']]
],$=x=>document.getElementById(x),c=supabase.createClient(window.BOOTCAMP_SUPABASE_URL,window.BOOTCAMP_SUPABASE_ANON_KEY);
let me,allowed=new Set(),saved={},done=new Set();
const clean=s=>String(s||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
async function refresh(){
 const r=await c.auth.getUser();me=r.data.user;
 if(!me){$('account').textContent='Inicia sesión desde Registro para completar las misiones.';render();return}
 $('account').textContent='Participante: '+me.email;
 const [a,p]=await Promise.all([c.from('bootcamp_levelup_attendance').select('activity').eq('user_id',me.id),c.from('bootcamp_levelup_progress').select('challenge_id,answers,completed_at').eq('user_id',me.id)]);
 if(a.error||p.error){$('message').textContent=(a.error||p.error).message;return}
 allowed=new Set(a.data.map(x=>x.activity));saved=Object.fromEntries(p.data.map(x=>[x.challenge_id,x.answers]));done=new Set(p.data.filter(x=>x.completed_at).map(x=>x.challenge_id));render();
}
function render(){
 const root=$('cards');root.replaceChildren();D.forEach(([module,name,xp,key],i)=>{
 const div=document.createElement('article');div.className='card';
 const b=document.createElement('button'),available=allowed.has(key);
 div.innerHTML='<small>'+clean(module)+'</small><h2>'+clean(name)+'</h2><p>'+xp+' XP</p><p>'+(done.has(i+1)?'✅ Completado':available?'🔓 Habilitado':'🔒 Pendiente de taller presencial')+'</p>';
 b.textContent=available?'Abrir reto':'Pendiente de taller';b.disabled=!me||!available;b.onclick=()=>open(i);div.append(b);root.append(div)});
 const score=D.reduce((n,t,i)=>n+(done.has(i+1)?t[2]:0),0);$('account').textContent=(me?'Participante: '+me.email+' · ':'')+'Puntos LEVEL UP: '+score+'/100';
}
function open(i){
 const t=D[i];$('form').replaceChildren();const h=document.createElement('h2');h.textContent='Reto '+(i+1)+' · '+t[1];$('form').append(h);
 t[4].forEach((q,k)=>{const l=document.createElement('label');l.textContent=q;const a=document.createElement('textarea');a.dataset.key=k;a.value=saved[i+1]?.[k]||'';l.append(a);$('form').append(l)});
 const save=document.createElement('button');save.textContent='Guardar borrador';save.onclick=()=>persist(i,false);$('form').append(save);
 const submit=document.createElement('button');submit.textContent='Completar reto';submit.style.marginLeft='8px';submit.onclick=()=>persist(i,true);$('form').append(submit);
 const pdf=document.createElement('button');pdf.textContent='Guardar producto en PDF';pdf.style.marginLeft='8px';pdf.disabled=!done.has(i+1);pdf.onclick=()=>window.print();$('form').append(pdf);
 $('form').scrollIntoView({behavior:'smooth'});
}
async function persist(i,final){
 const values={};$('form').querySelectorAll('textarea').forEach(t=>values[t.dataset.key]=t.value.trim());
 if(final&&D[i][4].some((_,j)=>values[j].length<3)){$('message').textContent='Completa todos los campos.';return}
 if(final)values.submitted=true;
 $('message').textContent='Guardando en Supabase...';
 const r=await c.from('bootcamp_levelup_progress').upsert({user_id:me.id,challenge_id:i+1,answers:values},{onConflict:'user_id,challenge_id'});
 if(r.error){$('message').textContent='No se guardó: '+r.error.message;return}
 $('message').textContent='Guardado correctamente';await refresh();
}
refresh();