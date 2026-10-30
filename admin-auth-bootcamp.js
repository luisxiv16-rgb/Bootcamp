/* Bootcamp UIP 2027: módulo administrativo complementario; NO cambia index.html. */
(()=>{'use strict';
const url=window.BOOTCAMP_SUPABASE_URL,key=window.BOOTCAMP_SUPABASE_ANON_KEY;
if(!url||!key||!window.supabase)return;
const api=window.supabase.createClient(url,key),state={verified:false,admin:false,email:null};
window.bootcampAdmin={state,
 async refresh(){
  state.verified=false;state.admin=false;state.email=null;
  const {data:{user},error}=await api.auth.getUser();
  if(error||!user||!user.email_confirmed_at)return false;
  const {data:p,error:pe}=await api.from('bootcamp_profiles').select('is_admin,team').eq('id',user.id).single();
  if(pe||p?.is_admin!==true||p.team!==null)return false;
  state.verified=true;state.admin=true;state.email=user.email;return true;
 },
 async login(email,password){
  const {error}=await api.auth.signInWithPassword({email,password});if(error)throw error;
  if(!await this.refresh()){await api.auth.signOut();throw Error('Cuenta sin autorización administrativa verificada')}
  return true;
 },
 async logout(){await api.auth.signOut();state.verified=false;state.admin=false;state.email=null},
 canPreview(){return state.verified&&state.admin}
};
api.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT'){state.verified=false;state.admin=false;state.email=null}});
})();