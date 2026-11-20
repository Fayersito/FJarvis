/* Jarvis · asistente de voz y texto compartido por todos los módulos */
(()=>{
const K='jarvisVoz_auto',SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const here=location.pathname.split('/').pop()||'index.html';
document.head.insertAdjacentHTML('beforeend',`<style>
#jv{position:fixed;left:0;right:0;bottom:0;z-index:50;background:rgba(6,13,24,.95);backdrop-filter:blur(6px);border-top:1px solid #1b3a57;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));font:14px/1.4 system-ui,-apple-system,'Segoe UI',sans-serif;color:#e8f4ff}
#jv>div{max-width:1240px;margin:auto}
#jv-say{display:none;margin:0 0 8px;color:#4de1ff}#jv-say.on{display:block}
.jv-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#jv #jv-in{flex:1;width:auto;min-width:180px;background:#07101c;border:1px solid #2a4a68;border-radius:6px;padding:10px 12px;color:#e8f4ff;font:inherit}
#jv button{border:1px solid #4de1ff;background:#0d2f44;color:#e8f4ff;border-radius:6px;padding:10px 14px;font:600 14px system-ui,sans-serif;cursor:pointer}
#jv button.on{background:#7a1f33;border-color:#ff5468}
#jv label{display:flex;align-items:center;gap:6px;color:#8fa8c0;cursor:pointer;font-size:13px}
#jv input:focus-visible,#jv button:focus-visible{outline:2px solid #4de1ff;outline-offset:2px}
#jv-ov{position:fixed;inset:0;z-index:100;background:rgba(3,8,16,.82);display:flex;align-items:center;justify-content:center;padding:16px}#jv-ov[hidden]{display:none}
.jv-card{background:#0b1626;border:1px solid #1b3a57;border-radius:8px;padding:22px;width:100%;max-width:440px;max-height:92vh;overflow:auto;color:#e8f4ff;font:15px/1.5 system-ui,sans-serif}
.jv-card h2{margin:0 0 12px;font:600 20px system-ui,sans-serif}.jv-card p{margin:0 0 10px}.jv-card label{display:block;margin:12px 0 0;color:#8fa8c0;font-size:13px}
.jv-card input[type=text],.jv-card select{display:block;width:100%;margin-top:5px;background:#07101c;border:1px solid #2a4a68;border-radius:6px;padding:10px 12px;color:#e8f4ff;font:inherit}
.jv-card input[type=range]{display:block;width:100%;margin-top:8px;padding:0;border:0;background:none;accent-color:#4de1ff}
.jv-card .jv-c{display:flex;gap:8px;align-items:center}.jv-b{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap}
.jv-card button{border:1px solid #4de1ff;background:#0d2f44;color:#e8f4ff;border-radius:6px;padding:10px 14px;font:600 14px system-ui,sans-serif;cursor:pointer}
.jv-card .jv-g{border-color:#2a4a68;background:transparent}.jv-card .jv-d{border-color:#ff5468;background:#2a1019;color:#ffb3bf;margin-top:6px}
.jv-card hr{border:0;border-top:1px solid #1b3a57;margin:18px 0 12px}.jv-n{font-size:13px;color:#8fa8c0}
body{padding-bottom:130px!important}#toast{bottom:110px!important}
</style>`);
document.body.insertAdjacentHTML('beforeend',`<div id="jv" role="region" aria-label="Asistente de voz"><div><p id="jv-say" aria-live="polite"></p><div class="jv-row"><input id="jv-in" type="text" placeholder="Escribe o habla… («ayuda» para ver comandos)" aria-label="Comando para Jarvis" autocomplete="off"><button id="jv-go">Enviar</button><button id="jv-cfg">Ajustes</button>${SR?'<button id="jv-mic">Hablar</button><label><input type="checkbox" id="jv-auto"> Escucha continua (di «Jarvis, …»)</label>':''}</div></div></div>`);
const $=id=>document.getElementById(id),S=$('jv-say'),IN=$('jv-in');
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[¿?¡!;:«»"]/g,' ').replace(/[.,](?!\d)/g,' ').replace(/\s+/g,' ').trim();
const CK='jarvisVoz_cfg';let cfg={name:'',voice:'',vol:1,on:true,asked:false},pend=null;
try{Object.assign(cfg,JSON.parse(localStorage.getItem(CK)||'{}'))}catch(e){}
const saveCfg=()=>{try{localStorage.setItem(CK,JSON.stringify(cfg))}catch(e){}};
['pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,()=>{if(pend){const t=pend;pend=null;speak(t)}}));
let rec=null,mode=null,tmr;
const auto=()=>localStorage.getItem(K)==='1';
function speak(t,force){if(!cfg.on&&!force)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t),v=speechSynthesis.getVoices().find(x=>x.voiceURI===cfg.voice);if(v){u.voice=v;u.lang=v.lang}else u.lang='es-ES';u.volume=cfg.vol;u.onerror=e=>{if(e.error==='not-allowed')pend=t};speechSynthesis.speak(u)}catch(e){}}
function out(t,v){S.textContent=t;S.classList.add('on');clearTimeout(tmr);tmr=setTimeout(()=>S.classList.remove('on'),15000);if(v)speak(t)}
const help=()=>(window.JARVIS_HELP||'')+' Para moverte: «abre nutrición», «abre leveling», «inicio» o «cierra». Pulsa Hablar, o activa la escucha continua y di «Jarvis, …».';
const NAV=[[/sueno|dormir|descanso/,'sueno.html','Sueño y energía'],[/salud|medic|cita|analitica/,'salud.html','Salud'],[/financ|dinero|gasto|presupuesto/,'finanzas.html','Finanzas'],[/informe|semanal|tendencia/,'informe.html','el informe semanal'],[/nutri|macro|comida|aliment/,'macros.html','Nutrición'],[/level|misi|rango/,'leveling.html','Leveling'],[/inicio|home|index|jarvis|panel|centro|principal/,'index.html','el centro de mando']];
function go(t){try{sessionStorage.setItem('jarvisVoz_nav',JSON.stringify({l:t[2],t:Date.now()}))}catch(e){}setTimeout(()=>{location.href=t[1]},700);return{t:`Abriendo ${t[2]}…`,nospeak:1}}
function glob(n){
 if(/^(ayuda|que puedes hacer|comandos|que sabes hacer)\b/.test(n))return help();
 if(/^((ir|ve|vamos|llevame|vuelve|volver|abre|abrir|cierra|cerrar) )?((a|al|a la|hacia) )?((el|la) )?(inicio|home|index|pagina principal|pagina de inicio|pantalla de inicio|menu principal|principal)$/.test(n)){const t=NAV[NAV.length-1];if(t[1]===here)return `Ya estás en ${t[2]}.`;return go(t)}
 if(/^(abre|abrir|ve|ir|llevame|vamos|vuelve|volver|cambia|cierra|cerrar|salir|atras)\b/.test(n)){
  let t=NAV.find(x=>x[0].test(n.replace(/^\S+\s*/,'')));
  if(!t&&/^(vuelve|volver|cierra|cerrar|salir|atras)\b/.test(n))t=NAV[2];
  if(t){if(t[1]===here)return `Ya estás en ${t[2]}.`;return go(t)}}
 return null}
function exec(raw,v){
 const n=norm(raw);if(!n)return;let r=null;
 try{r=window.JARVIS_CMD?window.JARVIS_CMD(raw,n):null}catch(e){console.error(e);r='Algo ha fallado al ejecutar eso.'}
 let sp=v;if(r&&typeof r==='object'){sp=sp||!!r.speak;if(r.nospeak)sp=false;r=r.t}
 if(r==null)r=glob(n);if(r&&typeof r==='object'){sp=sp&&!r.nospeak;r=r.t}
 if(r==null)r='No te he entendido. '+help();
 out(r,sp)}
function paint(){const m=$('jv-mic');if(m){const on=!!rec&&mode==='once';m.textContent=on?'Escuchando…':'Hablar';m.classList.toggle('on',on)}}
function stop(){if(rec){const r=rec;rec=null;r.onend=null;try{r.abort()}catch(e){}}paint()}
function listen(md){
 if(!SR)return;stop();mode=md;const r=new SR();rec=r;r.lang='es-ES';r.continuous=md==='auto';r.interimResults=false;
 r.onresult=e=>{let t=e.results[e.results.length-1][0].transcript.trim();
  if(md==='auto'){if(!/^(oye )?jarvis\b/.test(norm(t)))return;t=t.replace(/^\s*(oye\s+)?jarvis[\s,.:;-]*/i,'');if(!t){out('Dime.');return}}
  exec(t,true)};
 r.onerror=e=>{if(e.error==='not-allowed'||e.error==='service-not-allowed'){localStorage.setItem(K,'0');if($('jv-auto'))$('jv-auto').checked=false;rec=null;out('Necesito permiso para usar el micrófono.');paint()}};
 r.onend=()=>{if(rec!==r)return;rec=null;paint();if(md==='auto'&&auto())setTimeout(()=>listen('auto'),400)};
 try{r.start();if(md==='once')out('Te escucho…');paint()}catch(e){rec=null}}
$('jv-go').onclick=()=>{const t=IN.value;IN.value='';exec(t,false)};
IN.onkeydown=e=>{if(e.key==='Enter')$('jv-go').click()};
if(SR){
 $('jv-mic').onclick=()=>{if(rec&&mode==='once'){stop();return}if(auto()){out('Ya te estoy escuchando: di «Jarvis, …».');return}listen('once')};
 const cb=$('jv-auto');cb.checked=auto();
 cb.onchange=()=>{localStorage.setItem(K,cb.checked?'1':'0');if(cb.checked){listen('auto');out('Escucha continua activada. Di «Jarvis» y tu orden.')}else{stop();out('Escucha continua desactivada.')}};
 if(auto())listen('auto')
}else out('Tu navegador no admite dictado por voz. Puedes escribir las órdenes aquí.');
const OV=document.createElement('div');OV.id='jv-ov';OV.hidden=true;document.body.appendChild(OV);
const nm=()=>cfg.name?', '+cfg.name:'';
const closeOv=()=>{OV.hidden=true;OV.innerHTML=''};
const chg=()=>dispatchEvent(new Event('jarvis-cfg'));
OV.onclick=e=>{if(e.target===OV&&cfg.asked)closeOv()};
OV.onkeydown=e=>{if(e.key==='Escape'&&cfg.asked)closeOv()};
function welcome(){OV.hidden=false;
 OV.innerHTML=`<div class="jv-card" role="dialog" aria-modal="true" aria-labelledby="jv-wt"><h2 id="jv-wt">Bienvenido a Jarvis</h2><p>Antes de empezar, ¿cómo quieres que te llame?</p><input id="w-name" type="text" placeholder="Tu nombre" autocomplete="given-name" aria-label="Tu nombre" style="display:block;width:100%;background:#07101c;border:1px solid #2a4a68;border-radius:6px;padding:10px 12px;color:#e8f4ff;font:inherit"><div class="jv-b"><button id="w-ok">Continuar</button><button id="w-skip" class="jv-g">Omitir</button></div><p class="jv-n" style="margin-top:12px">Podrás cambiarlo cuando quieras en Ajustes.</p></div>`;
 const fin=n=>{cfg.name=n.trim();cfg.asked=true;saveCfg();closeOv();chg();out(cfg.name?`Encantado, ${cfg.name}. Soy Jarvis, tu asistente.`:'Listo. Puedes poner tu nombre cuando quieras en Ajustes.',true)};
 $('w-ok').onclick=()=>fin($('w-name').value);$('w-skip').onclick=()=>fin('');$('w-name').onkeydown=e=>{if(e.key==='Enter')fin($('w-name').value)};$('w-name').focus()}
function settings(){OV.hidden=false;
 OV.innerHTML=`<div class="jv-card" role="dialog" aria-modal="true" aria-labelledby="jv-st"><h2 id="jv-st">Ajustes de Jarvis</h2>
 <label>Tu nombre<input id="s-name" type="text" autocomplete="given-name"></label>
 <label>Voz narradora<select id="s-voice"></select></label>
 <label>Volumen: <b id="s-vv">${Math.round(cfg.vol*100)}</b> %<input id="s-vol" type="range" min="0" max="100" value="${Math.round(cfg.vol*100)}"></label>
 <label class="jv-c"><input id="s-on" type="checkbox" ${cfg.on?'checked':''}> Narrador activado</label>
 <div class="jv-b"><button id="s-test">Probar voz</button><button id="s-close" class="jv-g">Cerrar</button></div>
 <hr><p class="jv-n">Borra tu progreso, registros, ajustes y nombre de todos los módulos.</p><button id="s-reset" class="jv-d">Borrar todos los datos y reiniciar Jarvis</button></div>`;
 $('s-name').value=cfg.name;const sel=$('s-voice');
 const fill=()=>{const vs=speechSynthesis.getVoices().slice().sort((a,b)=>(/^es/i.test(b.lang)-/^es/i.test(a.lang))||a.name.localeCompare(b.name));sel.innerHTML='<option value="">Predeterminada del navegador</option>';vs.forEach(v=>{const o=document.createElement('option');o.value=v.voiceURI;o.textContent=`${v.name} (${v.lang})`;o.selected=v.voiceURI===cfg.voice;sel.appendChild(o)})};
 try{fill();speechSynthesis.onvoiceschanged=fill}catch(e){sel.innerHTML='<option>No disponible en este navegador</option>'}
 $('s-name').oninput=e=>{cfg.name=e.target.value.trim();saveCfg();chg()};
 sel.onchange=()=>{cfg.voice=sel.value;saveCfg()};
 $('s-vol').oninput=e=>{cfg.vol=e.target.value/100;$('s-vv').textContent=e.target.value;saveCfg()};
 $('s-on').onchange=e=>{cfg.on=e.target.checked;saveCfg()};
 $('s-test').onclick=()=>speak(`Hola${nm()}. Así sueno con esta voz y este volumen.`,true);
 $('s-close').onclick=closeOv;
 $('s-reset').onclick=()=>{
  if(!confirm('Esto borrará TODOS los datos de Jarvis: nutrición, leveling, sueño, salud, finanzas, ajustes y tu nombre. No se puede deshacer. ¿Continuar?'))return;
  if((prompt('Para confirmar, escribe BORRAR')||'').trim().toUpperCase()!=='BORRAR'){closeOv();out('Reinicio cancelado. No se ha borrado nada.');return}
  try{const ks=[];for(let i=0;i<localStorage.length;i++)ks.push(localStorage.key(i));ks.forEach(k=>{if(k&&(k.startsWith('jarvis')||k.startsWith('fleveling')))localStorage.removeItem(k)});sessionStorage.clear()}catch(e){}
  location.href='index.html'}}
$('jv-cfg').onclick=settings;
window.JarvisVoz={say:t=>out(t,false),speak,name:()=>cfg.name};
chg();
try{const m=JSON.parse(sessionStorage.getItem('jarvisVoz_nav')||'null');if(m){sessionStorage.removeItem('jarvisVoz_nav');if(Date.now()-m.t<15000)out((cfg.name?cfg.name+', te':'Te')+' he movido '+(/^el /.test(m.l)?'al '+m.l.slice(3):'a '+m.l)+'.',true)}}catch(e){}
if(!cfg.asked)welcome();
})();
