/**
 * Bootcamp UIP 2027 — configuración de estaciones y rotación.
 * Módulo independiente: no cambia la interfaz, autenticación ni registros existentes.
 * Propuestas para validación administrativa antes de integración.
 */
export const LAUNCH_PANAMA = "2026-11-14T08:00:00-05:00";
export const MAX_STATION_POINTS = 100;
export const NETWORKING_BONUS_MAX = 50;
export const MAX_TOTAL_POINTS = 750;
export const STATIONS = Object.freeze([
  {id:1,key:"tu-yo-2031",name:"Tu Yo del 2031",place:"Biblioteca PB",kind:"individual",evidence:["Pasaporte al 2031","Tres metas","Fortalezas","Recurso académico de biblioteca"]},
  {id:2,key:"168-horas",name:"Las 168 horas",place:"Restaurante Simulado · Piso 4",kind:"individual",evidence:["Planificación semanal","Distribución del tiempo","Estrategia ante imprevistos"]},
  {id:3,key:"desafio-ia",name:"Desafío IA",place:"Innovation Hub",kind:"individual-group",evidence:["Prompt","Respuesta","Verificación","Reflexión de uso responsable"]},
  {id:4,key:"resolucion-problemas",name:"Reto de Resolución de Problemas",place:"Mesa en la Plaza de Centro de Conexión",kind:"group",evidence:["Problema identificado","Alternativas de solución","Decisión del equipo","Reflexión"]},
  {id:5,key:"mi-marca-60",name:"Mi marca en 60 segundos",place:"Espacio de Juegos · PB",kind:"individual",evidence:["Presentación","Fortalezas","Aspiraciones","Insignia visual","Retroalimentación"]},
  {id:6,key:"vive-uip",name:"Vive la UIP",place:"Plaza Central",kind:"group",evidence:["Pasaporte de servicios","Recursos identificados","Situaciones prácticas","Oportunidad seleccionada"]},
  {id:7,key:"universidad-futuro",name:"Universidad del Futuro",place:"Cabina de TV · S1",kind:"group",evidence:["Problema","Propuesta","Prototipo","Presentación","Enlace audiovisual autorizado"]}
]);
export const ROTATIONS=Object.freeze([
 {round:1,from:"09:00",to:"09:30"},
 {round:2,from:"09:30",to:"10:00"},
 {round:3,from:"10:00",to:"10:30"},
 {break:"Coffee A Cómodo",from:"10:30",to:"11:00"},
 {round:4,from:"11:00",to:"11:30"},
 {round:5,from:"11:30",to:"12:00"},
 {round:6,from:"12:00",to:"12:30"},
 {round:7,from:"12:30",to:"13:00"}
]);
export const RUBRIC=Object.freeze({participation:20,collaboration:20,solution:30,creativity:20,reflection:10});
export function rotationFor(teamIndex,round){if(!Number.isInteger(teamIndex)||teamIndex<0||!Number.isInteger(round)||round<1||round>7)throw Error("Invalid rotation");return STATIONS[(teamIndex+round-1)%7]}
/**
 * Preview ONLY: allocate 150 students across 20 teams (10×8 and 10×7).
 * Accepts arbitrary participant objects {id,career,faculty}, does not mutate them.
 * Balanced round-robin by least represented career/faculty and current team size.
 * NEVER writes to Supabase; all confirmed assignments remain untouched.
 */
export function proposeTeams(students,teamCount=20){
 if(!Array.isArray(students)||teamCount!==20)throw Error("Expected 20 teams");
 const ids=new Set();for(const s of students){if(!s?.id||ids.has(s.id)||!s.career)throw Error("Invalid or duplicate student");ids.add(s.id)}
 if(students.length>150)throw Error("Capacity exceeded");
 const sizes=Array.from({length:20},(_,i)=>i<10?8:7);
 const teams=sizes.map((capacity,i)=>({number:i+1,capacity,members:[]}));
 const byCareer=new Map();
 for(const s of students){const k=s.career.trim().toLocaleLowerCase();if(!byCareer.has(k))byCareer.set(k,[]);byCareer.get(k).push(s)}
 const sorted=[...byCareer.values()].sort((a,b)=>b.length-a.length);
 const ordered=[];while(sorted.some(group=>group.length)){for(const group of sorted){if(group.length)ordered.push(group.shift())}}
 for(const student of ordered){
  const options=teams.filter(t=>t.members.length<t.capacity);
  options.sort((a,b)=>{
    const score=t=>(t.members.filter(x=>x.career===student.career).length*100)
      +(student.faculty?t.members.filter(x=>x.faculty===student.faculty).length*10:0)
      +(t.members.length/t.capacity)*4;
    return score(a)-score(b)||a.members.length-b.members.length||a.number-b.number;
  });
  options[0].members.push({...student});
 }
 return {teams,unassigned:[],confirmed:false,requiresAdminApproval:true};
}
export function validateProposal(proposal){
 const ids=new Set(),issues=[];
 for(const t of proposal.teams){
  if(t.members.length>t.capacity)issues.push("Team "+t.number+" over capacity");
  for(const s of t.members){if(ids.has(s.id))issues.push("Duplicate "+s.id);ids.add(s.id)}
 }
 return {valid:!issues.length,issues,totalAssigned:ids.size};
}

// Ubicaciones logísticas: no son estaciones adicionales.
export const SUPPORT_SPACES = Object.freeze([
 {name:"Plaza de la Universidad",purpose:"Apertura, integración, estación 6, cierre y reconocimientos"},
 {name:"Stand Sembrando Futuro",purpose:"Acreditación, entrega de QR, orientación de equipos y acompañamiento"},
 {name:"Coffee A Cómodo · PB",purpose:"Coffee Break y Networking Challenge"},
 {name:"Plan B · Padres SEED",purpose:"Orientación a familias: pagos, servicios, beneficios y Ecosistema Talento"}
]);
