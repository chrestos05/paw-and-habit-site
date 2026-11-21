const cfg=window.PAW_AUTH_CONFIG||{};
const ready=cfg.supabaseUrl&&cfg.supabaseAnonKey&&!cfg.supabaseUrl.startsWith('YOUR_')&&!cfg.supabaseAnonKey.startsWith('YOUR_');
let client=null;
const status=(msg,good=false)=>{const el=document.querySelector('#auth-status');if(el){el.textContent=msg;el.className=good?'status':'status';}};
async function setup(){
 if(!ready){status('Account login is prepared but needs one-time authentication setup.');return;}
 const {createClient}=supabase; client=createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
 const {data:{session}}=await client.auth.getSession(); if(session) window.location.href='account.html';
}
async function emailAuth(mode){
 if(!ready)return status('Email login will activate after the authentication settings are connected.');
 const email=document.querySelector('#email').value.trim(), password=document.querySelector('#password').value;
 if(!email||!password)return status('Enter an email address and password.');
 const result=mode==='signup'?await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/account.html'}}):await client.auth.signInWithPassword({email,password});
 if(result.error)return status(result.error.message);
 status(mode==='signup'?'Check your email to confirm your account.':'Signed in. Redirecting…',true);
 if(mode!=='signup')setTimeout(()=>location.href='account.html',600);
}
async function social(provider){
 if(!ready)return status('Social login will activate after the authentication settings are connected.');
 const {error}=await client.auth.signInWithOAuth({provider,options:{redirectTo:location.origin+'/account.html'}});if(error)status(error.message);
}
window.addEventListener('DOMContentLoaded',()=>{setup();document.querySelector('#signup')?.addEventListener('click',()=>emailAuth('signup'));document.querySelector('#signin')?.addEventListener('click',()=>emailAuth('signin'));document.querySelectorAll('[data-provider]').forEach(b=>b.addEventListener('click',()=>social(b.dataset.provider)));});
