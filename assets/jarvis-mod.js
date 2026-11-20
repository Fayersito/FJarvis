/* Jarvis · motor de módulos (registros, calendario, recordatorios, voz) */
(()=>{
const st=document.createElement('style');st.textContent=`
:root{color-scheme:dark;--bg:#060d18;--panel:#0b1626;--panel2:#0f1f34;--line:#1b3a57;--text:#e8f4ff;--muted:#8fa8c0;--cyan:#4de1ff;--hud:'Chakra Petch',system-ui,sans-serif}
*{box-sizing:border-box}body{margin:0;min-height:100vh;color:var(--text);font:15px/1.5 'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;background:radial-gradient(1000px 600px at 78% -10%,#0e2a45 0,transparent 60%),linear-gradient(rgba(77,225,255,.035) 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,rgba(77,225,255,.035) 1px,transparent 1px) 0 0/44px 44px,var(--bg)}
button,input,select,textarea{font:inherit;color:inherit}:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
.wrap{max-width:1000px;margin:auto;padding:20px 18px 40px;display:grid;gap:18px}
.bk{color:var(--cyan);text-decoration:none;font-size:14px}h1{margin:4px 0 0;font:700 clamp(26px,4vw,34px)/1.1 var(--hud)}h2{margin:0 0 12px;font:600 19px var(--hud)}
.panel{position:relative;background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line);border-radius:6px;padding:18px}
.panel::before,.panel::after{content:"";position:absolute;width:16px;height:16px;border:2px solid var(--cyan);opacity:.85}.panel::before{top:-1px;left:-1px;border-right:0;border-bottom:0}.panel::after{bottom:-1px;right:-1px;border-left:0;border-top:0}
.tls{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.tl{background:#08111f;border:1px solid var(--line);border-radius:6px;padding:12px}.tl strong{display:block;font:700 22px/1.2 var(--hud);color:var(--cyan)}.tl small{color:var(--muted);font-size:12.5px}
.fm{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.cf{margin-top:14px}.fd label{display:block;color:var(--muted);font-size:13px;margin-bottom:5px}
input:not([type=checkbox]),select,textarea{width:100%;min-width:0;background:#07101c;border:1px solid #2a4a68;border-radius:6px;padding:10px 11px}input[type=checkbox]{width:22px;height:22px;accent-color:#4de1ff}
.rw2{display:flex;gap:10px;margin-top:14px}.bt,.ac button{border:1px solid var(--cyan);background:linear-gradient(180deg,#123a52,#0c2a3e);border-radius:6px;padding:9px 14px;font-weight:600;cursor:pointer}.bt.g,.ac button{border-color:var(--line);background:transparent}.bt:hover,.ac button:hover{border-color:var(--cyan)}
.ls{list-style:none;margin:12px 0 0;padding:0}.rw{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap;padding:12px 0;border-bottom:1px solid #12263b}.rw b{font-weight:600}.rw small{display:block;color:var(--muted);font-size:13px}
.ac{display:flex;gap:6px;flex-wrap:wrap}.ac button{padding:6px 10px;font-size:13px}.ac .dg{border-color:#5a2a38;color:#ff9aa6}.rw.dn b{text-decoration:line-through;color:var(--muted)}.rw.pd{border-left:3px solid #ffd23f;padding-left:10px}
.bd{display:inline-block;margin-left:8px;font-size:12px;border:1px solid #2a4a68;border-radius:99px;padding:0 9px;color:var(--cyan)}.bd.yl{color:#ffd23f;border-color:#ffd23f}.bd.rd{color:#ff4d6d;border-color:#ff4d6d}.nt{color:var(--muted);font-size:13px}
.ch{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.ch button{background:none;border:1px solid var(--line);border-radius:6px;width:34px;height:30px;cursor:pointer}.ch b{text-transform:capitalize}
.cg{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center}.cg i{font-style:normal;color:var(--muted);font-size:12px}.cg span{padding:7px 0;border:1px solid #17304f;border-radius:5px;font-size:13px}.cg .td{border-color:var(--cyan)}.cg .mk{background:rgba(77,225,255,.2);font-weight:700}
.ch2{width:100%;display:block}#jt{position:fixed;left:50%;bottom:110px;transform:translate(-50%,30px);opacity:0;background:#0d2a40;border:1px solid var(--cyan);padding:10px 16px;border-radius:6px;transition:.25s;pointer-events:none;z-index:9}#jt.on{opacity:1;transform:translate(-50%,0)}
.inl{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}.inl input{flex:1;min-width:150px;padding:6px 9px!important;font-size:13px}
@media(max-width:700px){.wrap{padding:14px 12px 34px}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}`;
document.head.appendChild(st);
const iso=d=>d.toLocaleDateString('en-CA'),today=()=>iso(new Date()),days=d=>Math.round((new Date(d+'T12:00')-new Date(today()+'T12:00'))/864e5);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const toast=t=>{let e=document.getElementById('jt');if(!e){e=document.createElement('div');e.id='jt';document.body.appendChild(e)}e.textContent=t;e.className='on';clearTimeout(e._t);e._t=setTimeout(()=>e.className='',2400)};
window.J={today,days,ago:d=>-days(d),iso,esc,toast};
window.JMOD=function(c){
 const K='jarvisMod_'+c.id,app=document.getElementById('app');app.className='wrap';
 let D={items:[],cfg:{}},ed=null,q='',last=null,cm=new Date();cm.setDate(1);
 try{Object.assign(D,JSON.parse(localStorage.getItem(K)||'{}'))}catch(e){}
 D.items=D.items||[];D.cfg=D.cfg||{};(c.cfg||[]).forEach(f=>{if(D.cfg[f.k]==null)D.cfg[f.k]=f.def});
 const file=location.pathname.split('/').pop();
 const save=()=>{try{localStorage.setItem(K,JSON.stringify(D));localStorage.setItem('jarvisRem_'+c.id,JSON.stringify(c.rem?D.items.map(r=>{const x=c.rem(r);return x&&x.d?{...x,m:c.title,f:file}:null}).filter(Boolean):[]))}catch(e){toast('No se pudo guardar en el navegador')}};
 const by=id=>D.items.find(r=>r.id==id);
 function field(f,r){const v=r?r[f.k]:(f.def==='today'?today():f.def==null?'':f.def),id='f_'+f.k;let i;
  if(f.t==='select')i=`<select id="${id}">${f.o.map(o=>`<option ${o==v?'selected':''}>${o}</option>`).join('')}</select>`;
  else if(f.t==='area')i=`<textarea id="${id}" rows="2">${esc(v)}</textarea>`;
  else if(f.t==='check')i=`<input id="${id}" type="checkbox" ${v?'checked':''}>`;
  else i=`<input id="${id}" type="${f.t||'text'}" ${f.step?`step="${f.step}"`:''} ${f.min!=null?`min="${f.min}"`:''} ${f.max!=null?`max="${f.max}"`:''} value="${esc(v)}" placeholder="${esc(f.p||'')}" ${f.list?`list="dl_${f.k}"`:''} autocomplete="off">${f.list?`<datalist id="dl_${f.k}">${f.list(D.items).map(o=>`<option value="${esc(o)}">`).join('')}</datalist>`:''}`;
  return `<div class="fd" ${f.when?`data-w="${f.when[0]}" data-v="${f.when[1].join('|')}"`:''}><label for="${id}">${f.l}</label>${i}</div>`}
 function vis(){document.querySelectorAll('.fd[data-w]').forEach(e=>{const s=document.getElementById('f_'+e.dataset.w);e.style.display=s&&e.dataset.v.split('|').includes(s.value)?'':'none'})}
 function read(){const r={};let ok=true;c.fields.forEach(f=>{const e=document.getElementById('f_'+f.k),h=e.closest('.fd').style.display==='none';let v=f.t==='check'?e.checked:e.value.trim();if(f.t==='number')v=v===''?'':parseFloat(v);if(h)v=f.t==='check'?false:'';r[f.k]=v;if(f.req&&!h&&(v===''||Number.isNaN(v)))ok=false});return ok?r:null}
 function sorted(){const k=c.sort.replace('-',''),s=c.sort[0]==='-'?-1:1;return D.items.filter(r=>!q||JSON.stringify(r).toLowerCase().includes(q)).sort((a,b)=>((a[k]>b[k]?1:a[k]<b[k]?-1:0)*s)||(c.asc?a.id-b.id:b.id-a.id))}
 function inl(r){if(!c.inline||!c.inline.when(r))return'';return `<div class="inl">${c.inline.k.map(k=>{const f=c.fields.find(x=>x.k===k);return `<input data-ii="${r.id}" data-k="${k}" value="${esc(r[k]||'')}" placeholder="${esc(f.l)}" aria-label="${esc(f.l)}">`}).join('')}</div>`}
 function rowH(r){const[t,s]=c.row(r,D.items),b=c.badge?c.badge(r,D.items):'',rm=c.rem&&c.rem(r),df=rm&&rm.d?days(rm.d):null;
  const rb=df==null?'':`<span class="bd ${df<0?'rd':df<=(rm.pre==null?3:rm.pre)?'yl':''}">${df<0?'vencido':df===0?'hoy':'en '+df+' d'}</span>`;
  const ac=(c.actions||[]).map((a,i)=>[a,i]).filter(([a])=>!a.show||a.show(r)).map(([a,i])=>`<button data-a="${i}" data-i="${r.id}">${a.l}</button>`).join('');
  return `<li class="rw ${c.cls?c.cls(r):''}"><div><b>${esc(t)}</b>${b?`<span class="bd">${esc(b)}</span>`:''}${rb}<small>${esc(s)}</small>${inl(r)}</div><div class="ac">${ac}${c.dup?`<button data-d="${r.id}">Duplicar a hoy</button>`:''}<button data-e="${r.id}">Editar</button><button class="dg" data-x="${r.id}" aria-label="Borrar">×</button></div></li>`}
 const lst=()=>sorted().map(rowH).join('')||'<li class="nt">Sin registros.</li>';
 function calH(){const y=cm.getFullYear(),m=cm.getMonth(),f0=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate(),mk={};D.items.forEach(r=>{const d=c.cal(r);if(d)mk[d]=(mk[d]||0)+1});
  let h=`<div class="ch"><button data-cm="-1" aria-label="Mes anterior">‹</button><b>${cm.toLocaleDateString('es-ES',{month:'long',year:'numeric'})}</b><button data-cm="1" aria-label="Mes siguiente">›</button></div><div class="cg">${['L','M','X','J','V','S','D'].map(x=>`<i>${x}</i>`).join('')}`;
  for(let i=0;i<f0;i++)h+='<span></span>';
  for(let d=1;d<=n;d++){const k=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;h+=`<span class="${k===today()?'td':''} ${mk[k]?'mk':''}" title="${mk[k]||0} elemento(s)">${d}</span>`}
  return h+'</div>'}
 function render(){
  const T=c.stats?c.stats(D.items,D.cfg):[];
  const cf=(c.cfg||[]).map(f=>`<div class="fd"><label for="cf_${f.k}">${f.l}</label><input id="cf_${f.k}" type="number" step="any" value="${D.cfg[f.k]==null?'':D.cfg[f.k]}"></div>`).join('');
  app.innerHTML=`<header><a class="bk" href="index.html">← Volver a Jarvis</a><h1>${c.title}</h1></header>
  <section class="panel"><h2>Resumen</h2><div class="tls">${T.map(([l,v])=>`<div class="tl"><strong>${esc(v)}</strong><small>${esc(l)}</small></div>`).join('')||'<p class="nt">Aún no hay datos.</p>'}</div>${cf?`<div class="fm cf">${cf}</div>`:''}</section>
  ${c.cal?`<section class="panel"><h2>Calendario</h2>${calH()}</section>`:''}
  ${c.plans?`<section class="panel"><h2>Rutinas</h2><p class="nt">Empieza una rutina: se cargan tus últimos pesos y repeticiones de cada ejercicio (o los de la plantilla) y los ajustas en la lista de hoy.</p><div class="rw2" style="flex-wrap:wrap">${c.plans.map((p,i)=>`<button class="bt" data-pl="${i}">${p.n}</button>`).join('')}</div></section>`:''}
  <section class="panel"><h2 id="fh">${ed?'Editar registro':'Añadir'}</h2><div class="fm">${c.fields.map(f=>field(f,ed)).join('')}</div><div class="rw2"><button class="bt" id="sv">${ed?'Guardar cambios':'Guardar'}</button>${ed?'<button class="bt g" id="cn">Cancelar</button>':''}</div></section>
  <section class="panel"><h2>Registros</h2><input id="sq" type="search" placeholder="Buscar…" value="${esc(q)}" aria-label="Buscar"><ul class="ls" id="ls">${lst()}</ul></section>`;vis()}
 app.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset;
  if(d.x){if(confirm('¿Borrar este registro?')){D.items=D.items.filter(r=>r.id!=d.x);save();render()}}
  else if(d.e){ed=by(d.e);render();scrollTo(0,document.getElementById('fh').offsetTop-20)}
  else if(d.d){const r={...by(d.d),id:Date.now()};if('fecha' in r)r.fecha=today();D.items.push(r);ed=r;last=r.id;save();render();toast('Duplicado a hoy: ajusta pesos y repeticiones');scrollTo(0,document.getElementById('fh').offsetTop-20)}
  else if(d.a!=null){c.actions[d.a].do(by(d.i));save();render()}
  else if(d.pl!=null){const p=c.plans[d.pl];if(D.items.some(r=>r.fecha===today()&&r.rutina===p.k)){toast('Ya has empezado '+p.n+' hoy');return}
   p.ex.forEach((x,i)=>{const pv=D.items.filter(r=>r.rutina===p.k&&r.ejercicio===x.ejercicio&&r.fecha<today()).sort((a,b)=>a.fecha<b.fecha?1:-1)[0];D.items.push({id:Date.now()+i,fecha:today(),tipo:'Fuerza',rutina:p.k,ejercicio:x.ejercicio,cal:pv?pv.cal:(x.cal||''),sets:pv?pv.sets:x.sets,nota:x.nota||''})});
   save();render();toast(p.n+' cargada: ajusta pesos y repeticiones en la lista de hoy')}
  else if(d.cm){cm.setMonth(cm.getMonth()+ +d.cm);render()}
  else if(t.id==='cn'){ed=null;render()}
  else if(t.id==='sv'){const r=read();if(!r){toast('Completa los campos obligatorios');return}
   if(ed&&D.items.includes(ed))Object.assign(ed,r);else{r.id=Date.now()+Math.floor(Math.random()*1e3);D.items.push(r);last=r.id}ed=null;save();render();toast('Guardado')}});
 app.addEventListener('change',e=>{if(e.target.dataset.ii){const r=by(e.target.dataset.ii);if(r){r[e.target.dataset.k]=e.target.value.trim();save();render()}return}const i=e.target.id;if(i.startsWith('f_'))vis();if(i.startsWith('cf_')){D.cfg[i.slice(3)]=parseFloat(e.target.value)||0;save();render()}});
 app.addEventListener('input',e=>{if(e.target.id==='sq'){q=e.target.value.toLowerCase();document.getElementById('ls').innerHTML=lst()}});
 window.JARVIS_HELP=c.help||'';
 window.JARVIS_CMD=(raw,n)=>{
  if(c.quick){const r=c.quick(n,raw,D.items);if(r){r.id=Date.now();D.items.push(r);last=r.id;save();render();return 'Anotado en '+c.title.toLowerCase()+'.'}}
  if(/^(deshaz|borra lo ultimo|elimina lo ultimo|quita lo ultimo)/.test(n)){if(!last)return 'No tengo nada reciente que deshacer.';D.items=D.items.filter(r=>r.id!==last);last=null;save();render();return 'Hecho: he borrado lo último que añadí.'}
  if(/^(resumen|como voy|estado)/.test(n)){const s=(c.stats?c.stats(D.items,D.cfg):[]).map(([l,v])=>`${l}: ${v}`).join('. ');return{t:s||'Aún no hay datos.',speak:1}}
  return null};
 render()};
})();
