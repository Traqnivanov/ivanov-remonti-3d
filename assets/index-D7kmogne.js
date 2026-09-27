(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();const Jt=["room-1.wall-front","room-1.wall-back","room-1.wall-left","room-1.wall-right"],df=[...Jt,"room-1.floor","room-1.ceiling"];function Do(n){return Jt.includes(n)}function er(n){const e=n.serviceAssignments.find(t=>t.id==="assignment-fine-putty-1");if(!e||e.serviceCode!=="fine-putty"||e.label!=="Фина шпакловка"||e.quantityRuleId!=="wall-net-area-openings-v1"||e.priceBookItemId!=="dev-fine-putty"||e.presentationMode!=="highlight"||!e.clientInfo||e.targetEntityIds.some(t=>!Do(t)))throw new Error("Project is missing the canonical Fine Putty assignment.");return e}function ff(){return{id:"assignment-laminate-flooring-1",serviceCode:"laminate-flooring",label:"Ламинат",targetEntityIds:["room-1.floor"],included:!0,quantityRuleId:"floor-area-v1",priceBookItemId:"dev-laminate-flooring",presentationMode:"material",clientInfo:{what:"Ламинирана подова настилка за пода на помещението.",why:"За да се покаже и остойности конкретният подов финиш в Smart Offer.",result:"Завършен под с ламиниран финиш в крайния резултат.",includes:"Количеството се изчислява от площта на пода. DEV позицията не е production цена."}}}function pf(n="prototype-room-1"){const e=Dh(n);return e.room.openings=[{id:"room-1.door-1",kind:"door",hostSurfaceId:"room-1.wall-front",widthM:.9,heightM:2.1,offsetM:.55},{id:"room-1.window-1",kind:"window",hostSurfaceId:"room-1.wall-right",widthM:1.2,heightM:1.1,offsetM:1.4,sillM:.9}],e}function Dh(n="prototype-room-1"){return{schemaVersion:1,projectId:n,room:{id:"room-1",name:"Дневна — прототип",widthM:4.2,lengthM:4.8,heightM:2.6,surfaces:[{id:"room-1.wall-front",kind:"wall",label:"Предна стена"},{id:"room-1.wall-back",kind:"wall",label:"Задна стена"},{id:"room-1.wall-left",kind:"wall",label:"Лява стена"},{id:"room-1.wall-right",kind:"wall",label:"Дясна стена"},{id:"room-1.floor",kind:"floor",label:"Под"},{id:"room-1.ceiling",kind:"ceiling",label:"Таван"}],openings:[]},serviceAssignments:[{id:"assignment-fine-putty-1",serviceCode:"fine-putty",label:"Фина шпакловка",targetEntityIds:["room-1.wall-front","room-1.wall-back","room-1.wall-left","room-1.wall-right"],included:!0,quantityRuleId:"wall-net-area-openings-v1",priceBookItemId:"dev-fine-putty",presentationMode:"highlight",clientInfo:{what:"Фина шпакловка за финално изравняване и заглаждане на включените стени.",why:"За да се получи гладка и равномерна основа преди грундиране и боядисване.",result:"Гладки стени, подготвени за следващите довършителни слоеве.",includes:"Количеството и стойността се отнасят само за стените, включени в тази позиция."}},{...ff(),included:!1}]}}const gr=1;class ql extends Error{constructor(e,t){super(t),this.code=e,this.name="ProjectPersistenceError"}code}function Sc(n){return{schemaVersion:gr,projectId:n.projectId,rooms:[{id:n.room.id,name:n.room.name,geometry:{widthM:n.room.widthM,lengthM:n.room.lengthM,heightM:n.room.heightM},surfaces:n.room.surfaces.map(e=>({...e})),openings:n.room.openings.map(e=>({...e})),objects:[],materials:[]}],serviceAssignments:n.serviceAssignments.map(e=>({id:e.id,serviceCode:e.serviceCode,label:e.label,targetEntityIds:[...e.targetEntityIds],included:e.included,quantityRuleId:e.quantityRuleId,...e.priceBookItemId?{priceBookItemId:e.priceBookItemId}:{},...e.unitPriceEur===void 0?{}:{unitPriceEur:e.unitPriceEur},presentationMode:e.presentationMode,...e.clientInfo?{clientInfo:{...e.clientInfo}}:{}})),projectNotes:[],presentation:{}}}function mf(n){Oh(n)||Tt("Project state must be an object.");const e=n.schemaVersion;if(Number.isInteger(e)||Tt("Project schemaVersion must be an integer."),e!==gr)throw new ql("UNSUPPORTED_SCHEMA_VERSION",`Unsupported project schema version: ${String(e)}.`);return _f(vf(n))}function gf(n){const e=mf(n);e.rooms.length!==1&&vn("Current Work runtime supports exactly one room.");const t=e.rooms[0];t||vn("Current Work runtime persistence shape is incomplete."),t.id!=="room-1"&&vn("Current Work runtime expects room-1."),(t.objects.length||t.materials.length)&&vn("Current Work runtime does not yet support persisted objects or materials.");const i=e.serviceAssignments.map(Rf);Cf(i);const r={schemaVersion:1,projectId:e.projectId,room:{id:"room-1",name:t.name,widthM:t.geometry.widthM,lengthM:t.geometry.lengthM,heightM:t.geometry.heightM,surfaces:Tf(t.surfaces),openings:Af(t.openings)},serviceAssignments:i};try{er(r)}catch{vn("Current Work runtime requires the canonical Fine Putty assignment.")}return r}function _f(n){return{...n,serviceAssignments:n.serviceAssignments.map(e=>e.id==="assignment-fine-putty-1"&&e.serviceCode==="fine-putty"&&e.quantityRuleId==="wall-area-v1"?{...e,quantityRuleId:"wall-net-area-openings-v1"}:e)}}function vf(n){const e=yt(n.projectId,"projectId"),t=ni(n.rooms,"rooms"),i=ni(n.serviceAssignments,"serviceAssignments"),r=ni(n.projectNotes,"projectNotes"),s=Ai(n.presentation,"presentation");return{schemaVersion:1,projectId:e,rooms:t.map((o,a)=>yf(o,a)),serviceAssignments:i.map((o,a)=>Ef(o,a)),projectNotes:[...r],presentation:{...s}}}function yf(n,e){const t=Ai(n,`rooms[${e}]`),i=Ai(t.geometry,`rooms[${e}].geometry`),r={widthM:$r(i.widthM,`rooms[${e}].geometry.widthM`),lengthM:$r(i.lengthM,`rooms[${e}].geometry.lengthM`),heightM:$r(i.heightM,`rooms[${e}].geometry.heightM`)},s=ni(t.surfaces,`rooms[${e}].surfaces`).map((a,l)=>Sf(a,e,l)),o=ni(t.openings,`rooms[${e}].openings`).map((a,l)=>wf(a,e,l));return xf(o,s,r,e),{id:yt(t.id,`rooms[${e}].id`),name:yt(t.name,`rooms[${e}].name`),geometry:r,surfaces:s,openings:o,objects:[...ni(t.objects,`rooms[${e}].objects`)],materials:[...ni(t.materials,`rooms[${e}].materials`)]}}function Sf(n,e,t){const i=`rooms[${e}].surfaces[${t}]`,r=Ai(n,i),s=yt(r.kind,`${i}.kind`);return s!=="wall"&&s!=="floor"&&s!=="ceiling"&&Tt(`${i}.kind is invalid.`),{id:yt(r.id,`${i}.id`),kind:s,label:yt(r.label,`${i}.label`)}}function wf(n,e,t){const i=`rooms[${e}].openings[${t}]`,r=Ai(n,i),s=yt(r.kind,`${i}.kind`);s!=="door"&&s!=="window"&&Tt(`${i}.kind must be door or window.`);const o=r.sillM===void 0?void 0:Ba(r.sillM,`${i}.sillM`);return{id:yt(r.id,`${i}.id`),kind:s,hostSurfaceId:yt(r.hostSurfaceId,`${i}.hostSurfaceId`),widthM:$r(r.widthM,`${i}.widthM`),heightM:$r(r.heightM,`${i}.heightM`),offsetM:Ba(r.offsetM,`${i}.offsetM`),...o===void 0?{}:{sillM:o}}}function xf(n,e,t,i){const r=new Set,s=new Map(e.map(a=>[a.id,a])),o=1e-9;for(const a of n){r.has(a.id)&&Tt(`rooms[${i}].openings contains duplicate id ${a.id}.`),r.add(a.id);const l=s.get(a.hostSurfaceId);(!l||l.kind!=="wall")&&Tt(`Opening ${a.id} must reference an existing wall hostSurfaceId.`);const c=bf(a.hostSurfaceId,t);c===null&&Tt(`Opening ${a.id} references an unsupported wall orientation.`),a.offsetM+a.widthM>c+o&&Tt(`Opening ${a.id} exceeds its host wall width.`),(a.sillM??0)+a.heightM>t.heightM+o&&Tt(`Opening ${a.id} exceeds the room height.`)}for(let a=0;a<n.length;a+=1)for(let l=a+1;l<n.length;l+=1){const c=n[a],u=n[l];if(c.hostSurfaceId!==u.hostSurfaceId)continue;const h=c.offsetM<u.offsetM+u.widthM-o&&u.offsetM<c.offsetM+c.widthM-o,d=c.sillM??0,f=u.sillM??0,g=d<f+u.heightM-o&&f<d+c.heightM-o;h&&g&&Tt(`Openings ${c.id} and ${u.id} overlap on ${c.hostSurfaceId}.`)}}function bf(n,e){return n.endsWith(".wall-front")||n.endsWith(".wall-back")?e.widthM:n.endsWith(".wall-left")||n.endsWith(".wall-right")?e.lengthM:null}function Ef(n,e){const t=`serviceAssignments[${e}]`,i=Ai(n,t),r=If(i.presentationMode,`${t}.presentationMode`),s=i.priceBookItemId===void 0?void 0:yt(i.priceBookItemId,`${t}.priceBookItemId`),o=i.unitPriceEur===void 0?void 0:Ba(i.unitPriceEur,`${t}.unitPriceEur`),a=i.clientInfo===void 0?void 0:Mf(i.clientInfo,`${t}.clientInfo`);return{id:yt(i.id,`${t}.id`),serviceCode:yt(i.serviceCode,`${t}.serviceCode`),label:yt(i.label,`${t}.label`),targetEntityIds:ni(i.targetEntityIds,`${t}.targetEntityIds`).map((l,c)=>yt(l,`${t}.targetEntityIds[${c}]`)),included:Pf(i.included,`${t}.included`),quantityRuleId:yt(i.quantityRuleId,`${t}.quantityRuleId`),...s?{priceBookItemId:s}:{},...o===void 0?{}:{unitPriceEur:o},presentationMode:r,...a?{clientInfo:a}:{}}}function Mf(n,e){const t=Ai(n,e);return{what:yt(t.what,`${e}.what`),why:yt(t.why,`${e}.why`),result:yt(t.result,`${e}.result`),includes:yt(t.includes,`${e}.includes`)}}function Tf(n){const e={"room-1.wall-front":"wall","room-1.wall-back":"wall","room-1.wall-left":"wall","room-1.wall-right":"wall","room-1.floor":"floor","room-1.ceiling":"ceiling"};n.length!==Object.keys(e).length&&vn("Current Work runtime requires the six First Slice surfaces.");const t=new Map(n.map(i=>[i.id,i]));return Object.keys(e).map(i=>{const r=t.get(i);return(!r||r.kind!==e[i])&&vn(`Missing or invalid runtime surface: ${i}.`),{id:i,kind:r.kind,label:r.label}})}function Af(n){return n.map(e=>(Do(e.hostSurfaceId)||vn(`Unsupported runtime opening host: ${e.hostSurfaceId}.`),{id:e.id,kind:e.kind,hostSurfaceId:e.hostSurfaceId,widthM:e.widthM,heightM:e.heightM,offsetM:e.offsetM,...e.sillM===void 0?{}:{sillM:e.sillM}}))}function Rf(n){const e=new Set(df),t=n.targetEntityIds.map(i=>(e.has(i)||vn(`Unsupported service target: ${i}.`),i));return{id:n.id,serviceCode:n.serviceCode,label:n.label,targetEntityIds:t,included:n.included,quantityRuleId:n.quantityRuleId,...n.priceBookItemId?{priceBookItemId:n.priceBookItemId}:{},...n.unitPriceEur===void 0?{}:{unitPriceEur:n.unitPriceEur},presentationMode:n.presentationMode,...n.clientInfo?{clientInfo:{...n.clientInfo}}:{}}}function Cf(n){new Set(n.map(t=>t.id)).size!==n.length&&vn("Current Work runtime requires unique service assignment IDs.")}function Oh(n){return typeof n=="object"&&n!==null&&!Array.isArray(n)}function Ai(n,e){return Oh(n)||Tt(`${e} must be an object.`),n}function ni(n,e){return Array.isArray(n)||Tt(`${e} must be an array.`),n}function yt(n,e){return(typeof n!="string"||n.trim()==="")&&Tt(`${e} must be a non-empty string.`),n}function $r(n,e){return(typeof n!="number"||!Number.isFinite(n)||n<=0)&&Tt(`${e} must be a positive finite number.`),n}function Ba(n,e){return(typeof n!="number"||!Number.isFinite(n)||n<0)&&Tt(`${e} must be a non-negative finite number.`),n}function Pf(n,e){return typeof n!="boolean"&&Tt(`${e} must be a boolean.`),n}function If(n,e){return n!=="highlight"&&n!=="material"&&n!=="geometry"&&n!=="xray"&&n!=="object"&&Tt(`${e} is invalid.`),n}function Tt(n){throw new ql("INVALID_STATE",n)}function vn(n){throw new ql("UNSUPPORTED_RUNTIME_SHAPE",n)}class Dt extends Error{constructor(e,t,i){super(t,i),this.code=e,this.name="ProjectRepositoryError"}code}function Lf(n,e=()=>crypto.randomUUID()){const t=or(n,"Project title"),i=or(e(),"Project id"),r=Dh(i);return r.serviceAssignments=r.serviceAssignments.map(s=>({...s,included:!1})),{title:t,project:r}}function Df(n,e){const t=or(n.projectId,"Project id");if(!Number.isSafeInteger(e)||e<1)throw new Dt("INVALID_INPUT","Expected work version must be a positive safe integer.");return{projectId:t,expectedWorkVersion:e,project:n}}function Of(n){if(or(n.id,"Opened project id"),or(n.ownerUserId,"Opened project owner"),or(n.title,"Opened project title"),n.id!==n.project.projectId)throw new Dt("INVALID_INPUT","Opened project metadata id does not match project state id.");if(n.schemaVersion!==gr||n.project.schemaVersion!==gr)throw new Dt("INVALID_INPUT","Opened project schema version is not supported by the current Work app.");if(!Number.isSafeInteger(n.workVersion)||n.workVersion<1)throw new Dt("INVALID_INPUT","Opened project work version must be a positive safe integer.");return n}function or(n,e){const t=n.trim();if(!t)throw new Dt("INVALID_INPUT",`${e} must not be blank.`);return t}class Ti extends Error{constructor(e,t){super(t),this.code=e,this.name="ProjectSessionError"}code}async function Uf(n){const e=await n.list();if(e.length===0)return{kind:"new-project"};if(e.length===1){const t=e[0];if(!t)throw new Error("Project list reported one item but none was available.");const i=await n.open(t.id);return{kind:"ready",session:go(i)}}return{kind:"choose-project",projects:e}}function go(n){return{projectId:n.id,title:n.title,project:n.project,workVersion:n.workVersion,updatedAt:n.updatedAt,saveState:"clean",editRevision:0,savedEditRevision:0,savingEditRevision:null,lastError:null}}function Nf(n){const e=n.editRevision+1;return{...n,editRevision:e,saveState:n.saveState==="clean"?"dirty":n.saveState}}function wc(n,e,t){const i=Nf({...n,project:e});return t&&n.saveState!=="saving"&&n.saveState!=="conflict"?{...i,saveState:"clean",savedEditRevision:i.editRevision,lastError:null}:i}function Uh(n){return n.saveState==="dirty"||n.saveState==="error"}function kf(n){return n.editRevision!==n.savedEditRevision}function Ff(n){if(n.saveState==="saving")throw new Ti("SAVE_IN_PROGRESS","A project save is already in progress.");if(n.saveState==="conflict")throw new Ti("SAVE_BLOCKED_BY_CONFLICT","Reload the latest project version before saving again.");if(!Uh(n))throw new Ti("SAVE_NOT_NEEDED","The project has no unsaved changes.");return{session:{...n,saveState:"saving",savingEditRevision:n.editRevision,lastError:null},input:Df(n.project,n.workVersion)}}function Bf(n,e){if(n.saveState!=="saving"||n.savingEditRevision===null)throw new Ti("SAVE_RESULT_MISMATCH","Received a save result without a matching in-flight save.");if(e.projectId!==n.projectId)throw new Ti("SAVE_RESULT_MISMATCH","Saved project id does not match the active project session.");if(e.workVersion!==n.workVersion+1)throw new Ti("SAVE_RESULT_MISMATCH","Saved project version does not match the expected next version.");const t=n.savingEditRevision,i=n.editRevision>t;return{...n,workVersion:e.workVersion,updatedAt:e.updatedAt,saveState:i?"dirty":"clean",savedEditRevision:t,savingEditRevision:null,lastError:null}}function zf(n,e){if(n.saveState!=="saving"||n.savingEditRevision===null)throw new Ti("SAVE_RESULT_MISMATCH","Received a save failure without a matching in-flight save.");const t=e instanceof Dt&&e.code==="STALE_WRITE";return{...n,saveState:t?"conflict":"error",savingEditRevision:null,lastError:t?"Project changed on the server.":Hf(e)}}function Hf(n){return n instanceof Error&&n.message.trim()?n.message:"Project save failed."}const Vf=50;function Gf(n,e=Vf){if(!Number.isInteger(e)||e<1)throw new Error("Project history limit must be a positive integer.");return{past:[],current:{revision:0,project:Oo(n)},future:[],limit:e,nextRevision:1,savedRevision:0}}function Rn(n){return Oo(n.current.project)}function jf(n){return n.current.revision}function xc(n){return n.current.revision===n.savedRevision}function Wf(n,e=n.current.revision){if(!Number.isInteger(e)||e<0)throw new Error("Saved project history revision must be a non-negative integer.");return{...n,savedRevision:e}}function $f(n){return n.past.length>0}function qf(n){return n.future.length>0}function Xf(n,e){const t=[...n.past,Hn(n.current)];return{past:t.length>n.limit?t.slice(t.length-n.limit):t,current:{revision:n.nextRevision,project:Oo(e)},future:[],limit:n.limit,nextRevision:n.nextRevision+1,savedRevision:n.savedRevision}}function Kf(n){const e=n.past.at(-1);return e?{past:n.past.slice(0,-1).map(Hn),current:Hn(e),future:[Hn(n.current),...n.future.map(Hn)].slice(0,n.limit),limit:n.limit,nextRevision:n.nextRevision,savedRevision:n.savedRevision}:n}function Yf(n){const e=n.future[0];return e?{past:[...n.past.map(Hn),Hn(n.current)].slice(-n.limit),current:Hn(e),future:n.future.slice(1).map(Hn),limit:n.limit,nextRevision:n.nextRevision,savedRevision:n.savedRevision}:n}function Hn(n){return{revision:n.revision,project:Oo(n.project)}}function Oo(n){return structuredClone(n)}function Xl(n){const{widthM:e,lengthM:t,heightM:i}=n.room,r={"room-1.wall-front":e*i,"room-1.wall-back":e*i,"room-1.wall-left":t*i,"room-1.wall-right":t*i},s=e*t,o=2*(e+t);return{widthM:e,lengthM:t,heightM:i,floorM2:s,ceilingM2:s,grossWallsM2:o*i,perimeterM:o,volumeM3:s*i,wallAreasM2:r}}function Jf(n,e){return Xl(n).wallAreasM2[e]}function Zf(n,e){return n.room.openings.filter(t=>t.hostSurfaceId===e).reduce((t,i)=>t+i.widthM*i.heightM,0)}function Qf(n,e){return Jf(n,e)-Zf(n,e)}function ep(n,e){if(!e.included)return{ruleId:"wall-net-area-openings-v1",ruleVersion:"1.0.0",unit:"m2",value:0,sourceEntityIds:[],usedOverride:!1};if(e.targetEntityIds.length===0||e.targetEntityIds.some(s=>!Do(s)))throw new Error("wall-net-area-openings-v1 requires one or more wall targets.");const t=e.targetEntityIds,i=t.reduce((s,o)=>s+Qf(n,o),0),r=n.room.openings.filter(s=>t.includes(s.hostSurfaceId)).map(s=>s.id);return{ruleId:"wall-net-area-openings-v1",ruleVersion:"1.0.0",unit:"m2",value:i,sourceEntityIds:[...t,...r],usedOverride:!1}}function tp(n,e){if(!e.included)return{ruleId:"floor-area-v1",ruleVersion:"1.0.0",unit:"m2",value:0,sourceEntityIds:[],usedOverride:!1};if(e.targetEntityIds.length!==1||e.targetEntityIds[0]!=="room-1.floor")throw new Error("floor-area-v1 requires exactly the room floor target.");return{ruleId:"floor-area-v1",ruleVersion:"1.0.0",unit:"m2",value:Xl(n).floorM2,sourceEntityIds:["room-1.floor"],usedOverride:!1}}const np={"wall-net-area-openings-v1":ep,"floor-area-v1":tp};function ip(n,e){const t=np[e.quantityRuleId];return t?t(n,e):null}function bc(n,e,t){if(t!==null&&(!Number.isFinite(t)||t<0))throw new Error("Unit price must be a non-negative finite EUR amount.");let i=!1;const r=n.serviceAssignments.map(s=>{if(s.id!==e)return s;if(i=!0,t===null){const{unitPriceEur:o,...a}=s;return a}return{...s,unitPriceEur:t}});if(!i)throw new Error(`Missing service assignment: ${e}`);return{...n,serviceAssignments:r}}function za(n,e){const t=n.serviceAssignments.find(s=>s.id===e);if(!t||!t.included||!t.clientInfo)return null;const i=ip(n,t);if(!i)return null;const r=t.unitPriceEur;if(r===void 0)return{assignmentId:t.id,label:t.label,quantity:i,unitPriceEur:null,totalEur:null,priceStatus:"missing",clientInfo:t.clientInfo};if(!Number.isFinite(r)||r<0)throw new Error("Stored unit price must be a non-negative finite EUR amount.");return{assignmentId:t.id,label:t.label,quantity:i,unitPriceEur:r,totalEur:i.value*r,priceStatus:"priced",clientInfo:t.clientInfo}}function rp(n){const e=n.serviceAssignments.map(i=>za(n,i.id)).filter(i=>i!==null),t=e.filter(i=>i.priceStatus==="missing").map(i=>i.assignmentId);return{lines:e,pricedSubtotalEur:e.reduce((i,r)=>i+(r.totalEur??0),0),complete:t.length===0,missingPriceAssignmentIds:t}}const Kl="180",ar={ROTATE:0,DOLLY:1,PAN:2},ir={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},sp=0,Ec=1,op=2,Nh=1,ap=2,Un=3,si=0,Ht=1,cn=2,ii=0,lr=1,Mc=2,Tc=3,Ac=4,lp=5,vi=100,cp=101,up=102,hp=103,dp=104,fp=200,pp=201,mp=202,gp=203,Ha=204,Va=205,_p=206,vp=207,yp=208,Sp=209,wp=210,xp=211,bp=212,Ep=213,Mp=214,Ga=0,ja=1,Wa=2,_r=3,$a=4,qa=5,Xa=6,Ka=7,kh=0,Tp=1,Ap=2,ri=0,Rp=1,Cp=2,Pp=3,Ip=4,Lp=5,Dp=6,Op=7,Fh=300,vr=301,yr=302,Ya=303,Ja=304,Uo=306,Jr=1e3,wi=1001,Za=1002,fn=1003,Up=1004,Ss=1005,yn=1006,Wo=1007,xi=1008,xn=1009,Bh=1010,zh=1011,Zr=1012,Yl=1013,Ri=1014,Vn=1015,ps=1016,Jl=1017,Zl=1018,Qr=1020,Hh=35902,Vh=35899,Gh=1021,jh=1022,hn=1023,es=1026,ts=1027,Wh=1028,Ql=1029,$h=1030,ec=1031,tc=1033,ao=33776,lo=33777,co=33778,uo=33779,Qa=35840,el=35841,tl=35842,nl=35843,il=36196,rl=37492,sl=37496,ol=37808,al=37809,ll=37810,cl=37811,ul=37812,hl=37813,dl=37814,fl=37815,pl=37816,ml=37817,gl=37818,_l=37819,vl=37820,yl=37821,Sl=36492,wl=36494,xl=36495,bl=36283,El=36284,Ml=36285,Tl=36286,Np=3200,kp=3201,qh=0,Fp=1,Qn="",Bt="srgb",Sr="srgb-linear",_o="linear",rt="srgb",Oi=7680,Rc=519,Bp=512,zp=513,Hp=514,Xh=515,Vp=516,Gp=517,jp=518,Wp=519,Cc=35044,Pc="300 es",Sn=2e3,vo=2001;class Li{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const At=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],qr=Math.PI/180,Al=180/Math.PI;function Er(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(At[n&255]+At[n>>8&255]+At[n>>16&255]+At[n>>24&255]+"-"+At[e&255]+At[e>>8&255]+"-"+At[e>>16&15|64]+At[e>>24&255]+"-"+At[t&63|128]+At[t>>8&255]+"-"+At[t>>16&255]+At[t>>24&255]+At[i&255]+At[i>>8&255]+At[i>>16&255]+At[i>>24&255]).toLowerCase()}function We(n,e,t){return Math.max(e,Math.min(t,n))}function $p(n,e){return(n%e+e)%e}function $o(n,e,t){return(1-t)*n+t*e}function Cr(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Nt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const qp={DEG2RAD:qr};class fe{constructor(e=0,t=0){fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ci{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const d=s[o+0],f=s[o+1],g=s[o+2],v=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==d||c!==f||u!==g){let m=1-a;const p=l*d+c*f+u*g+h*v,M=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const C=Math.sqrt(S),T=Math.atan2(C,p*M);m=Math.sin(m*T)/C,a=Math.sin(a*T)/C}const w=a*M;if(l=l*m+d*w,c=c*m+f*w,u=u*m+g*w,h=h*m+v*w,m===1-a){const C=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=C,c*=C,u*=C,h*=C}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-a*f,e[t+2]=c*g+u*f+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+a+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>h){const f=2*Math.sqrt(1+i-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>h){const f=2*Math.sqrt(1+a-i-h);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const f=1-t;return this._w=f*o+t*this._w,this._x=f*i+t*this._x,this._y=f*r+t*this._y,this._z=f*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ic.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ic.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return qo.copy(this).projectOnVector(e),this.sub(qo)}reflect(e){return this.sub(qo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qo=new D,Ic=new Ci;class Ge{constructor(e,t,i,r,s,o,a,l,c){Ge.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],v=r[0],m=r[3],p=r[6],M=r[1],S=r[4],w=r[7],C=r[2],T=r[5],R=r[8];return s[0]=o*v+a*M+l*C,s[3]=o*m+a*S+l*T,s[6]=o*p+a*w+l*R,s[1]=c*v+u*M+h*C,s[4]=c*m+u*S+h*T,s[7]=c*p+u*w+h*R,s[2]=d*v+f*M+g*C,s[5]=d*m+f*S+g*T,s[8]=d*p+f*w+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,f=c*s-o*l,g=t*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(r*c-u*i)*v,e[2]=(a*i-r*o)*v,e[3]=d*v,e[4]=(u*t-r*l)*v,e[5]=(r*s-a*t)*v,e[6]=f*v,e[7]=(i*l-c*t)*v,e[8]=(o*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Xo.makeScale(e,t)),this}rotate(e){return this.premultiply(Xo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Xo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Xo=new Ge;function Kh(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function yo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Xp(){const n=yo("canvas");return n.style.display="block",n}const Lc={};function ns(n){n in Lc||(Lc[n]=!0,console.warn(n))}function Kp(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}const Dc=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Oc=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yp(){const n={enabled:!0,workingColorSpace:Sr,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===rt&&(r.r=jn(r.r),r.g=jn(r.g),r.b=jn(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===rt&&(r.r=cr(r.r),r.g=cr(r.g),r.b=cr(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Qn?_o:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ns("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ns("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Sr]:{primaries:e,whitePoint:i,transfer:_o,toXYZ:Dc,fromXYZ:Oc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Bt},outputColorSpaceConfig:{drawingBufferColorSpace:Bt}},[Bt]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:Dc,fromXYZ:Oc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Bt}}}),n}const Qe=Yp();function jn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function cr(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ui;class Jp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ui===void 0&&(Ui=yo("canvas")),Ui.width=e.width,Ui.height=e.height;const r=Ui.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Ui}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=yo("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=jn(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(jn(t[i]/255)*255):t[i]=jn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Zp=0;class nc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Zp++}),this.uuid=Er(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Ko(r[o].image)):s.push(Ko(r[o]))}else s=Ko(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Ko(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Jp.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qp=0;const Yo=new D;class Ot extends Li{constructor(e=Ot.DEFAULT_IMAGE,t=Ot.DEFAULT_MAPPING,i=wi,r=wi,s=yn,o=xi,a=hn,l=xn,c=Ot.DEFAULT_ANISOTROPY,u=Qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qp++}),this.uuid=Er(),this.name="",this.source=new nc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Yo).x}get height(){return this.source.getSize(Yo).y}get depth(){return this.source.getSize(Yo).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Fh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Jr:e.x=e.x-Math.floor(e.x);break;case wi:e.x=e.x<0?0:1;break;case Za:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Jr:e.y=e.y-Math.floor(e.y);break;case wi:e.y=e.y<0?0:1;break;case Za:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ot.DEFAULT_IMAGE=null;Ot.DEFAULT_MAPPING=Fh;Ot.DEFAULT_ANISOTROPY=1;class mt{constructor(e=0,t=0,i=0,r=1){mt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const S=(c+1)/2,w=(f+1)/2,C=(p+1)/2,T=(u+d)/4,R=(h+v)/4,N=(g+m)/4;return S>w&&S>C?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=T/i,s=R/i):w>C?w<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(w),i=T/r,s=N/r):C<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(C),i=R/s,r=N/s),this.set(i,r,s,t),this}let M=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(h-v)/M,this.z=(d-u)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class em extends Li{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new mt(0,0,e,t),this.scissorTest=!1,this.viewport=new mt(0,0,e,t);const r={width:e,height:t,depth:i.depth},s=new Ot(r);this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:yn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isArrayTexture=this.textures[r].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const r=Object.assign({},e.textures[t].image);this.textures[t].source=new nc(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends em{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Yh extends Ot{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class tm extends Ot{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=fn,this.minFilter=fn,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ms{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=nn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,nn):nn.fromBufferAttribute(s,o),nn.applyMatrix4(e.matrixWorld),this.expandByPoint(nn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ws.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ws.copy(i.boundingBox)),ws.applyMatrix4(e.matrixWorld),this.union(ws)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,nn),nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Pr),xs.subVectors(this.max,Pr),Ni.subVectors(e.a,Pr),ki.subVectors(e.b,Pr),Fi.subVectors(e.c,Pr),Wn.subVectors(ki,Ni),$n.subVectors(Fi,ki),ci.subVectors(Ni,Fi);let t=[0,-Wn.z,Wn.y,0,-$n.z,$n.y,0,-ci.z,ci.y,Wn.z,0,-Wn.x,$n.z,0,-$n.x,ci.z,0,-ci.x,-Wn.y,Wn.x,0,-$n.y,$n.x,0,-ci.y,ci.x,0];return!Jo(t,Ni,ki,Fi,xs)||(t=[1,0,0,0,1,0,0,0,1],!Jo(t,Ni,ki,Fi,xs))?!1:(bs.crossVectors(Wn,$n),t=[bs.x,bs.y,bs.z],Jo(t,Ni,ki,Fi,xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,nn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(nn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Cn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Cn=[new D,new D,new D,new D,new D,new D,new D,new D],nn=new D,ws=new ms,Ni=new D,ki=new D,Fi=new D,Wn=new D,$n=new D,ci=new D,Pr=new D,xs=new D,bs=new D,ui=new D;function Jo(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){ui.fromArray(n,s);const a=r.x*Math.abs(ui.x)+r.y*Math.abs(ui.y)+r.z*Math.abs(ui.z),l=e.dot(ui),c=t.dot(ui),u=i.dot(ui);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const nm=new ms,Ir=new D,Zo=new D;class No{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):nm.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ir.subVectors(e,this.center);const t=Ir.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ir,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ir.copy(e.center).add(Zo)),this.expandByPoint(Ir.copy(e.center).sub(Zo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Pn=new D,Qo=new D,Es=new D,qn=new D,ea=new D,Ms=new D,ta=new D;class ko{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pn.copy(this.origin).addScaledVector(this.direction,t),Pn.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Qo.copy(e).add(t).multiplyScalar(.5),Es.copy(t).sub(e).normalize(),qn.copy(this.origin).sub(Qo);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Es),a=qn.dot(this.direction),l=-qn.dot(Es),c=qn.lengthSq(),u=Math.abs(1-o*o);let h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=s*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Qo).addScaledVector(Es,d),f}intersectSphere(e,t){Pn.subVectors(e.center,this.origin);const i=Pn.dot(this.direction),r=Pn.dot(Pn)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,Pn)!==null}intersectTriangle(e,t,i,r,s){ea.subVectors(t,e),Ms.subVectors(i,e),ta.crossVectors(ea,Ms);let o=this.direction.dot(ta),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;qn.subVectors(this.origin,e);const l=a*this.direction.dot(Ms.crossVectors(qn,Ms));if(l<0)return null;const c=a*this.direction.dot(ea.cross(qn));if(c<0||l+c>o)return null;const u=-a*qn.dot(ta);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ct{constructor(e,t,i,r,s,o,a,l,c,u,h,d,f,g,v,m){ct.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,h,d,f,g,v,m)}set(e,t,i,r,s,o,a,l,c,u,h,d,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ct().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Bi.setFromMatrixColumn(e,0).length(),s=1/Bi.setFromMatrixColumn(e,1).length(),o=1/Bi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-a*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d+v*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=v+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d-v*a,t[4]=-o*h,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=v-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*u,f=o*h,g=a*u,v=a*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*h,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=v-d*h,t[8]=g*h+f,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-v*h}else if(e.order==="XZY"){const d=o*l,f=o*c,g=a*l,v=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+v,t[5]=o*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=a*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(im,e,rm)}lookAt(e,t,i){const r=this.elements;return jt.subVectors(e,t),jt.lengthSq()===0&&(jt.z=1),jt.normalize(),Xn.crossVectors(i,jt),Xn.lengthSq()===0&&(Math.abs(i.z)===1?jt.x+=1e-4:jt.z+=1e-4,jt.normalize(),Xn.crossVectors(i,jt)),Xn.normalize(),Ts.crossVectors(jt,Xn),r[0]=Xn.x,r[4]=Ts.x,r[8]=jt.x,r[1]=Xn.y,r[5]=Ts.y,r[9]=jt.y,r[2]=Xn.z,r[6]=Ts.z,r[10]=jt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],v=i[6],m=i[10],p=i[14],M=i[3],S=i[7],w=i[11],C=i[15],T=r[0],R=r[4],N=r[8],E=r[12],b=r[1],I=r[5],V=r[9],$=r[13],te=r[2],W=r[6],K=r[10],ee=r[14],G=r[3],_e=r[7],we=r[11],Te=r[15];return s[0]=o*T+a*b+l*te+c*G,s[4]=o*R+a*I+l*W+c*_e,s[8]=o*N+a*V+l*K+c*we,s[12]=o*E+a*$+l*ee+c*Te,s[1]=u*T+h*b+d*te+f*G,s[5]=u*R+h*I+d*W+f*_e,s[9]=u*N+h*V+d*K+f*we,s[13]=u*E+h*$+d*ee+f*Te,s[2]=g*T+v*b+m*te+p*G,s[6]=g*R+v*I+m*W+p*_e,s[10]=g*N+v*V+m*K+p*we,s[14]=g*E+v*$+m*ee+p*Te,s[3]=M*T+S*b+w*te+C*G,s[7]=M*R+S*I+w*W+C*_e,s[11]=M*N+S*V+w*K+C*we,s[15]=M*E+S*$+w*ee+C*Te,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15];return g*(+s*l*h-r*c*h-s*a*d+i*c*d+r*a*f-i*l*f)+v*(+t*l*f-t*c*d+s*o*d-r*o*f+r*c*u-s*l*u)+m*(+t*c*h-t*a*f-s*o*h+i*o*f+s*a*u-i*c*u)+p*(-r*a*u-t*l*h+t*a*d+r*o*h-i*o*d+i*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],M=h*m*c-v*d*c+v*l*f-a*m*f-h*l*p+a*d*p,S=g*d*c-u*m*c-g*l*f+o*m*f+u*l*p-o*d*p,w=u*v*c-g*h*c+g*a*f-o*v*f-u*a*p+o*h*p,C=g*h*l-u*v*l-g*a*d+o*v*d+u*a*m-o*h*m,T=t*M+i*S+r*w+s*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/T;return e[0]=M*R,e[1]=(v*d*s-h*m*s-v*r*f+i*m*f+h*r*p-i*d*p)*R,e[2]=(a*m*s-v*l*s+v*r*c-i*m*c-a*r*p+i*l*p)*R,e[3]=(h*l*s-a*d*s-h*r*c+i*d*c+a*r*f-i*l*f)*R,e[4]=S*R,e[5]=(u*m*s-g*d*s+g*r*f-t*m*f-u*r*p+t*d*p)*R,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*p-t*l*p)*R,e[7]=(o*d*s-u*l*s+u*r*c-t*d*c-o*r*f+t*l*f)*R,e[8]=w*R,e[9]=(g*h*s-u*v*s-g*i*f+t*v*f+u*i*p-t*h*p)*R,e[10]=(o*v*s-g*a*s+g*i*c-t*v*c-o*i*p+t*a*p)*R,e[11]=(u*a*s-o*h*s-u*i*c+t*h*c+o*i*f-t*a*f)*R,e[12]=C*R,e[13]=(u*v*r-g*h*r+g*i*d-t*v*d-u*i*m+t*h*m)*R,e[14]=(g*a*r-o*v*r-g*i*l+t*v*l+o*i*m-t*a*m)*R,e[15]=(o*h*r-u*a*r+u*i*l-t*h*l-o*i*d+t*a*d)*R,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,h=a+a,d=s*c,f=s*u,g=s*h,v=o*u,m=o*h,p=a*h,M=l*c,S=l*u,w=l*h,C=i.x,T=i.y,R=i.z;return r[0]=(1-(v+p))*C,r[1]=(f+w)*C,r[2]=(g-S)*C,r[3]=0,r[4]=(f-w)*T,r[5]=(1-(d+p))*T,r[6]=(m+M)*T,r[7]=0,r[8]=(g+S)*R,r[9]=(m-M)*R,r[10]=(1-(d+v))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Bi.set(r[0],r[1],r[2]).length();const o=Bi.set(r[4],r[5],r[6]).length(),a=Bi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],rn.copy(this);const c=1/s,u=1/o,h=1/a;return rn.elements[0]*=c,rn.elements[1]*=c,rn.elements[2]*=c,rn.elements[4]*=u,rn.elements[5]*=u,rn.elements[6]*=u,rn.elements[8]*=h,rn.elements[9]*=h,rn.elements[10]*=h,t.setFromRotationMatrix(rn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=Sn,l=!1){const c=this.elements,u=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),f=(i+r)/(i-r);let g,v;if(l)g=s/(o-s),v=o*s/(o-s);else if(a===Sn)g=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===vo)g=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=Sn,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-r),d=-(t+e)/(t-e),f=-(i+r)/(i-r);let g,v;if(l)g=1/(o-s),v=o/(o-s);else if(a===Sn)g=-2/(o-s),v=-(o+s)/(o-s);else if(a===vo)g=-1/(o-s),v=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Bi=new D,rn=new ct,im=new D(0,0,0),rm=new D(1,1,1),Xn=new D,Ts=new D,jt=new D,Uc=new ct,Nc=new Ci;class bn{constructor(e=0,t=0,i=0,r=bn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(We(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Uc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Uc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Nc.setFromEuler(this),this.setFromQuaternion(Nc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bn.DEFAULT_ORDER="XYZ";class ic{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let sm=0;const kc=new D,zi=new Ci,In=new ct,As=new D,Lr=new D,om=new D,am=new Ci,Fc=new D(1,0,0),Bc=new D(0,1,0),zc=new D(0,0,1),Hc={type:"added"},lm={type:"removed"},Hi={type:"childadded",child:null},na={type:"childremoved",child:null};class Et extends Li{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=Er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new D,t=new bn,i=new Ci,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ct},normalMatrix:{value:new Ge}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ic,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.multiply(zi),this}rotateOnWorldAxis(e,t){return zi.setFromAxisAngle(e,t),this.quaternion.premultiply(zi),this}rotateX(e){return this.rotateOnAxis(Fc,e)}rotateY(e){return this.rotateOnAxis(Bc,e)}rotateZ(e){return this.rotateOnAxis(zc,e)}translateOnAxis(e,t){return kc.copy(e).applyQuaternion(this.quaternion),this.position.add(kc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fc,e)}translateY(e){return this.translateOnAxis(Bc,e)}translateZ(e){return this.translateOnAxis(zc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(In.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?As.copy(e):As.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),Lr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?In.lookAt(Lr,As,this.up):In.lookAt(As,Lr,this.up),this.quaternion.setFromRotationMatrix(In),r&&(In.extractRotation(r.matrixWorld),zi.setFromRotationMatrix(In),this.quaternion.premultiply(zi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Hc),Hi.child=e,this.dispatchEvent(Hi),Hi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(lm),na.child=e,this.dispatchEvent(na),na.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),In.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),In.multiply(e.parent.matrixWorld)),e.applyMatrix4(In),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Hc),Hi.child=e,this.dispatchEvent(Hi),Hi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Lr,e,om),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Lr,am,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Et.DEFAULT_UP=new D(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const sn=new D,Ln=new D,ia=new D,Dn=new D,Vi=new D,Gi=new D,Vc=new D,ra=new D,sa=new D,oa=new D,aa=new mt,la=new mt,ca=new mt;class Qt{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),sn.subVectors(e,t),r.cross(sn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){sn.subVectors(r,t),Ln.subVectors(i,t),ia.subVectors(e,t);const o=sn.dot(sn),a=sn.dot(Ln),l=sn.dot(ia),c=Ln.dot(Ln),u=Ln.dot(ia),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Dn)===null?!1:Dn.x>=0&&Dn.y>=0&&Dn.x+Dn.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Dn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Dn.x),l.addScaledVector(o,Dn.y),l.addScaledVector(a,Dn.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return aa.setScalar(0),la.setScalar(0),ca.setScalar(0),aa.fromBufferAttribute(e,t),la.fromBufferAttribute(e,i),ca.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(aa,s.x),o.addScaledVector(la,s.y),o.addScaledVector(ca,s.z),o}static isFrontFacing(e,t,i,r){return sn.subVectors(i,t),Ln.subVectors(e,t),sn.cross(Ln).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return sn.subVectors(this.c,this.b),Ln.subVectors(this.a,this.b),sn.cross(Ln).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Qt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Qt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Qt.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Qt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Qt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Vi.subVectors(r,i),Gi.subVectors(s,i),ra.subVectors(e,i);const l=Vi.dot(ra),c=Gi.dot(ra);if(l<=0&&c<=0)return t.copy(i);sa.subVectors(e,r);const u=Vi.dot(sa),h=Gi.dot(sa);if(u>=0&&h<=u)return t.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(Vi,o);oa.subVectors(e,s);const f=Vi.dot(oa),g=Gi.dot(oa);if(g>=0&&f<=g)return t.copy(s);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(Gi,a);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return Vc.subVectors(s,r),a=(h-u)/(h-u+(f-g)),t.copy(r).addScaledVector(Vc,a);const p=1/(m+v+d);return o=v*p,a=d*p,t.copy(i).addScaledVector(Vi,o).addScaledVector(Gi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Jh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kn={h:0,s:0,l:0},Rs={h:0,s:0,l:0};function ua(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=Qe.workingColorSpace){if(e=$p(e,1),t=We(t,0,1),i=We(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=ua(o,s,e+1/3),this.g=ua(o,s,e),this.b=ua(o,s,e-1/3)}return Qe.colorSpaceToWorking(this,r),this}setStyle(e,t=Bt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bt){const i=Jh[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=jn(e.r),this.g=jn(e.g),this.b=jn(e.b),this}copyLinearToSRGB(e){return this.r=cr(e.r),this.g=cr(e.g),this.b=cr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bt){return Qe.workingToColorSpace(Rt.copy(this),e),Math.round(We(Rt.r*255,0,255))*65536+Math.round(We(Rt.g*255,0,255))*256+Math.round(We(Rt.b*255,0,255))}getHexString(e=Bt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.workingToColorSpace(Rt.copy(this),t);const i=Rt.r,r=Rt.g,s=Rt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Qe.workingColorSpace){return Qe.workingToColorSpace(Rt.copy(this),t),e.r=Rt.r,e.g=Rt.g,e.b=Rt.b,e}getStyle(e=Bt){Qe.workingToColorSpace(Rt.copy(this),e);const t=Rt.r,i=Rt.g,r=Rt.b;return e!==Bt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Kn),this.setHSL(Kn.h+e,Kn.s+t,Kn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Kn),e.getHSL(Rs);const i=$o(Kn.h,Rs.h,t),r=$o(Kn.s,Rs.s,t),s=$o(Kn.l,Rs.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rt=new Je;Je.NAMES=Jh;let cm=0;class Mr extends Li{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cm++}),this.uuid=Er(),this.name="",this.type="Material",this.blending=lr,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ha,this.blendDst=Va,this.blendEquation=vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Je(0,0,0),this.blendAlpha=0,this.depthFunc=_r,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Rc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Oi,this.stencilZFail=Oi,this.stencilZPass=Oi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==lr&&(i.blending=this.blending),this.side!==si&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ha&&(i.blendSrc=this.blendSrc),this.blendDst!==Va&&(i.blendDst=this.blendDst),this.blendEquation!==vi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==_r&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Rc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Oi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Oi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Oi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Zh extends Mr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.combine=kh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const gt=new D,Cs=new fe;let um=0;class wn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:um++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Cc,this.updateRanges=[],this.gpuType=Vn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Cs.fromBufferAttribute(this,t),Cs.applyMatrix3(e),this.setXY(t,Cs.x,Cs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Cr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Nt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Cr(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Cr(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Cr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Cr(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),i=Nt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),i=Nt(i,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),i=Nt(i,this.array),r=Nt(r,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Cc&&(e.usage=this.usage),e}}class Qh extends wn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class ed extends wn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class tn extends wn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let hm=0;const Kt=new ct,ha=new Et,ji=new D,Wt=new ms,Dr=new ms,xt=new D;class En extends Li{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=Er(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Kh(e)?ed:Qh)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ge().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Kt.makeRotationFromQuaternion(e),this.applyMatrix4(Kt),this}rotateX(e){return Kt.makeRotationX(e),this.applyMatrix4(Kt),this}rotateY(e){return Kt.makeRotationY(e),this.applyMatrix4(Kt),this}rotateZ(e){return Kt.makeRotationZ(e),this.applyMatrix4(Kt),this}translate(e,t,i){return Kt.makeTranslation(e,t,i),this.applyMatrix4(Kt),this}scale(e,t,i){return Kt.makeScale(e,t,i),this.applyMatrix4(Kt),this}lookAt(e){return ha.lookAt(e),ha.updateMatrix(),this.applyMatrix4(ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ji).negate(),this.translate(ji.x,ji.y,ji.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new tn(i,3))}else{const i=Math.min(e.length,t.count);for(let r=0;r<i;r++){const s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ms);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Wt.setFromBufferAttribute(s),this.morphTargetsRelative?(xt.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(xt),xt.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(xt)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new No);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];Dr.setFromBufferAttribute(a),this.morphTargetsRelative?(xt.addVectors(Wt.min,Dr.min),Wt.expandByPoint(xt),xt.addVectors(Wt.max,Dr.max),Wt.expandByPoint(xt)):(Wt.expandByPoint(Dr.min),Wt.expandByPoint(Dr.max))}Wt.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)xt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(xt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)xt.fromBufferAttribute(a,c),l&&(ji.fromBufferAttribute(e,c),xt.add(ji)),r=Math.max(r,i.distanceToSquared(xt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let N=0;N<i.count;N++)a[N]=new D,l[N]=new D;const c=new D,u=new D,h=new D,d=new fe,f=new fe,g=new fe,v=new D,m=new D;function p(N,E,b){c.fromBufferAttribute(i,N),u.fromBufferAttribute(i,E),h.fromBufferAttribute(i,b),d.fromBufferAttribute(s,N),f.fromBufferAttribute(s,E),g.fromBufferAttribute(s,b),u.sub(c),h.sub(c),f.sub(d),g.sub(d);const I=1/(f.x*g.y-g.x*f.y);isFinite(I)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(I),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(I),a[N].add(v),a[E].add(v),a[b].add(v),l[N].add(m),l[E].add(m),l[b].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let N=0,E=M.length;N<E;++N){const b=M[N],I=b.start,V=b.count;for(let $=I,te=I+V;$<te;$+=3)p(e.getX($+0),e.getX($+1),e.getX($+2))}const S=new D,w=new D,C=new D,T=new D;function R(N){C.fromBufferAttribute(r,N),T.copy(C);const E=a[N];S.copy(E),S.sub(C.multiplyScalar(C.dot(E))).normalize(),w.crossVectors(T,E);const I=w.dot(l[N])<0?-1:1;o.setXYZW(N,S.x,S.y,S.z,I)}for(let N=0,E=M.length;N<E;++N){const b=M[N],I=b.start,V=b.count;for(let $=I,te=I+V;$<te;$+=3)R(e.getX($+0)),R(e.getX($+1)),R(e.getX($+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const r=new D,s=new D,o=new D,a=new D,l=new D,c=new D,u=new D,h=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,v),o.fromBufferAttribute(t,m),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)xt.fromBufferAttribute(e,t),xt.normalize(),e.setXYZ(t,xt.x,xt.y,xt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){a.isInterleavedBufferAttribute?f=l[v]*a.data.stride+a.offset:f=l[v]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new wn(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new En,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(t))}const s=e.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Gc=new ct,hi=new ko,Ps=new No,jc=new D,Is=new D,Ls=new D,Ds=new D,da=new D,Os=new D,Wc=new D,Us=new D;class dn extends Et{constructor(e=new En,t=new Zh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Os.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],h=s[l];u!==0&&(da.fromBufferAttribute(h,e),o?Os.addScaledVector(da,u):Os.addScaledVector(da.sub(t),u))}t.add(Os)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ps.copy(i.boundingSphere),Ps.applyMatrix4(s),hi.copy(e.ray).recast(e.near),!(Ps.containsPoint(hi.origin)===!1&&(hi.intersectSphere(Ps,jc)===null||hi.origin.distanceToSquared(jc)>(e.far-e.near)**2))&&(Gc.copy(s).invert(),hi.copy(e.ray).applyMatrix4(Gc),!(i.boundingBox!==null&&hi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,hi)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),S=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let w=M,C=S;w<C;w+=3){const T=a.getX(w),R=a.getX(w+1),N=a.getX(w+2);r=Ns(this,p,e,i,c,u,h,T,R,N),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=a.getX(m),S=a.getX(m+1),w=a.getX(m+2);r=Ns(this,o,e,i,c,u,h,M,S,w),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],M=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let w=M,C=S;w<C;w+=3){const T=w,R=w+1,N=w+2;r=Ns(this,p,e,i,c,u,h,T,R,N),r&&(r.faceIndex=Math.floor(w/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=m,S=m+1,w=m+2;r=Ns(this,o,e,i,c,u,h,M,S,w),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function dm(n,e,t,i,r,s,o,a){let l;if(e.side===Ht?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===si,a),l===null)return null;Us.copy(a),Us.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Us);return c<t.near||c>t.far?null:{distance:c,point:Us.clone(),object:n}}function Ns(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Is),n.getVertexPosition(l,Ls),n.getVertexPosition(c,Ds);const u=dm(n,e,t,i,Is,Ls,Ds,Wc);if(u){const h=new D;Qt.getBarycoord(Wc,Is,Ls,Ds,h),r&&(u.uv=Qt.getInterpolatedAttribute(r,a,l,c,h,new fe)),s&&(u.uv1=Qt.getInterpolatedAttribute(s,a,l,c,h,new fe)),o&&(u.normal=Qt.getInterpolatedAttribute(o,a,l,c,h,new D),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new D,materialIndex:0};Qt.getNormal(Is,Ls,Ds,d.normal),u.face=d,u.barycoord=h}return u}class Gn extends En{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new tn(c,3)),this.setAttribute("normal",new tn(u,3)),this.setAttribute("uv",new tn(h,2));function g(v,m,p,M,S,w,C,T,R,N,E){const b=w/R,I=C/N,V=w/2,$=C/2,te=T/2,W=R+1,K=N+1;let ee=0,G=0;const _e=new D;for(let we=0;we<K;we++){const Te=we*I-$;for(let ze=0;ze<W;ze++){const Xe=ze*b-V;_e[v]=Xe*M,_e[m]=Te*S,_e[p]=te,c.push(_e.x,_e.y,_e.z),_e[v]=0,_e[m]=0,_e[p]=T>0?1:-1,u.push(_e.x,_e.y,_e.z),h.push(ze/R),h.push(1-we/N),ee+=1}}for(let we=0;we<N;we++)for(let Te=0;Te<R;Te++){const ze=d+Te+W*we,Xe=d+Te+W*(we+1),Ye=d+(Te+1)+W*(we+1),$e=d+(Te+1)+W*we;l.push(ze,Xe,$e),l.push(Xe,Ye,$e),G+=6}a.addGroup(f,G,E),f+=G,d+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Gn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function wr(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Lt(n){const e={};for(let t=0;t<n.length;t++){const i=wr(n[t]);for(const r in i)e[r]=i[r]}return e}function fm(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function td(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Qe.workingColorSpace}const pm={clone:wr,merge:Lt};var mm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class oi extends Mr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mm,this.fragmentShader=gm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=wr(e.uniforms),this.uniformsGroups=fm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class nd extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Yn=new D,$c=new fe,qc=new fe;class Zt extends nd{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Al*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(qr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Al*2*Math.atan(Math.tan(qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Yn.x,Yn.y).multiplyScalar(-e/Yn.z),Yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Yn.x,Yn.y).multiplyScalar(-e/Yn.z)}getViewSize(e,t){return this.getViewBounds(e,$c,qc),t.subVectors(qc,$c)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(qr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Wi=-90,$i=1;class _m extends Et{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Zt(Wi,$i,e,t);r.layers=this.layers,this.add(r);const s=new Zt(Wi,$i,e,t);s.layers=this.layers,this.add(s);const o=new Zt(Wi,$i,e,t);o.layers=this.layers,this.add(o);const a=new Zt(Wi,$i,e,t);a.layers=this.layers,this.add(a);const l=new Zt(Wi,$i,e,t);l.layers=this.layers,this.add(l);const c=new Zt(Wi,$i,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===Sn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===vo)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class id extends Ot{constructor(e=[],t=vr,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vm extends Pi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new id(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Gn(5,5,5),s=new oi({name:"CubemapFromEquirect",uniforms:wr(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ht,blending:ii});s.uniforms.tEquirect.value=t;const o=new dn(r,s),a=t.minFilter;return t.minFilter===xi&&(t.minFilter=yn),new _m(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}class ks extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ym={type:"move"};class fa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ks,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ks,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ks,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(ym)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ks;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Sm extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bn,this.environmentIntensity=1,this.environmentRotation=new bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const pa=new D,wm=new D,xm=new Ge;class Zn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=pa.subVectors(i,t).cross(wm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(pa),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||xm.getNormalMatrix(e),r=this.coplanarPoint(pa).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const di=new No,bm=new fe(.5,.5),Fs=new D;class rc{constructor(e=new Zn,t=new Zn,i=new Zn,r=new Zn,s=new Zn,o=new Zn){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Sn,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],v=s[9],m=s[10],p=s[11],M=s[12],S=s[13],w=s[14],C=s[15];if(r[0].setComponents(c-o,f-u,p-g,C-M).normalize(),r[1].setComponents(c+o,f+u,p+g,C+M).normalize(),r[2].setComponents(c+a,f+h,p+v,C+S).normalize(),r[3].setComponents(c-a,f-h,p-v,C-S).normalize(),i)r[4].setComponents(l,d,m,w).normalize(),r[5].setComponents(c-l,f-d,p-m,C-w).normalize();else if(r[4].setComponents(c-l,f-d,p-m,C-w).normalize(),t===Sn)r[5].setComponents(c+l,f+d,p+m,C+w).normalize();else if(t===vo)r[5].setComponents(l,d,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),di.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),di.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(di)}intersectsSprite(e){di.center.set(0,0,0);const t=bm.distanceTo(e.center);return di.radius=.7071067811865476+t,di.applyMatrix4(e.matrixWorld),this.intersectsSphere(di)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Fs.x=r.normal.x>0?e.max.x:e.min.x,Fs.y=r.normal.y>0?e.max.y:e.min.y,Fs.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Fs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class rd extends Mr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const So=new D,wo=new D,Xc=new ct,Or=new ko,Bs=new No,ma=new D,Kc=new D;class Em extends Et{constructor(e=new En,t=new rd){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)So.fromBufferAttribute(t,r-1),wo.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=So.distanceTo(wo);e.setAttribute("lineDistance",new tn(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bs.copy(i.boundingSphere),Bs.applyMatrix4(r),Bs.radius+=s,e.ray.intersectsSphere(Bs)===!1)return;Xc.copy(r).invert(),Or.copy(e.ray).applyMatrix4(Xc);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=u.getX(v),M=u.getX(v+1),S=zs(this,e,Or,l,p,M,v);S&&t.push(S)}if(this.isLineLoop){const v=u.getX(g-1),m=u.getX(f),p=zs(this,e,Or,l,v,m,g-1);p&&t.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=c){const p=zs(this,e,Or,l,v,v+1,v);p&&t.push(p)}if(this.isLineLoop){const v=zs(this,e,Or,l,g-1,f,g-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function zs(n,e,t,i,r,s,o){const a=n.geometry.attributes.position;if(So.fromBufferAttribute(a,r),wo.fromBufferAttribute(a,s),t.distanceSqToSegment(So,wo,ma,Kc)>i)return;ma.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(ma);if(!(c<e.near||c>e.far))return{distance:c,point:Kc.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}const Yc=new D,Jc=new D;class Mm extends Em{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)Yc.fromBufferAttribute(t,r),Jc.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Yc.distanceTo(Jc);e.setAttribute("lineDistance",new tn(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Tm extends Ot{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class sd extends Ot{constructor(e,t,i=Ri,r,s,o,a=fn,l=fn,c,u=es,h=1){if(u!==es&&u!==ts)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new nc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class od extends Ot{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}const Hs=new D,Vs=new D,ga=new D,Gs=new Qt;class Am extends En{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const r=Math.pow(10,4),s=Math.cos(qr*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),d={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:v,b:m,c:p}=Gs;if(v.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),Gs.getNormal(ga),h[0]=`${Math.round(v.x*r)},${Math.round(v.y*r)},${Math.round(v.z*r)}`,h[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,h[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let M=0;M<3;M++){const S=(M+1)%3,w=h[M],C=h[S],T=Gs[u[M]],R=Gs[u[S]],N=`${w}_${C}`,E=`${C}_${w}`;E in d&&d[E]?(ga.dot(d[E].normal)<=s&&(f.push(T.x,T.y,T.z),f.push(R.x,R.y,R.z)),d[E]=null):N in d||(d[N]={index0:c[M],index1:c[S],normal:ga.clone()})}}for(const g in d)if(d[g]){const{index0:v,index1:m}=d[g];Hs.fromBufferAttribute(a,v),Vs.fromBufferAttribute(a,m),f.push(Hs.x,Hs.y,Hs.z),f.push(Vs.x,Vs.y,Vs.z)}this.setAttribute("position",new tn(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Mn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const u=i[r],d=i[r+1]-u,f=(o-u)/d;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new fe:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,r=[],s=[],o=[],a=new D,l=new ct;for(let f=0;f<=e;f++){const g=f/e;r[f]=this.getTangentAt(g,new D)}s[0]=new D,o[0]=new D;let c=Number.MAX_VALUE;const u=Math.abs(r[0].x),h=Math.abs(r[0].y),d=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),h<=c&&(c=h,i.set(0,1,0)),d<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(We(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(We(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class sc extends Mn{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new fe){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*u-f*h+this.aX,c=d*h+f*u+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Rm extends sc{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function oc(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,h){let d=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,f*=u,r(o,a,d,f)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const js=new D,_a=new oc,va=new oc,ya=new oc;class Cm extends Mn{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new D){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(js.subVectors(r[0],r[1]).add(r[0]),c=js);const h=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(js.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=js),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),f),v=Math.pow(h.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(u),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),_a.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,v,m),va.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,v,m),ya.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,v,m)}else this.curveType==="catmullrom"&&(_a.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),va.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),ya.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return i.set(_a.calc(l),va.calc(l),ya.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Zc(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,l=n*a;return(2*t-2*i+s+o)*l+(-3*t+3*i-2*s-o)*a+s*n+t}function Pm(n,e){const t=1-n;return t*t*e}function Im(n,e){return 2*(1-n)*n*e}function Lm(n,e){return n*n*e}function Xr(n,e,t,i){return Pm(n,e)+Im(n,t)+Lm(n,i)}function Dm(n,e){const t=1-n;return t*t*t*e}function Om(n,e){const t=1-n;return 3*t*t*n*e}function Um(n,e){return 3*(1-n)*n*n*e}function Nm(n,e){return n*n*n*e}function Kr(n,e,t,i,r){return Dm(n,e)+Om(n,t)+Um(n,i)+Nm(n,r)}class ad extends Mn{constructor(e=new fe,t=new fe,i=new fe,r=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new fe){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Kr(e,r.x,s.x,o.x,a.x),Kr(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class km extends Mn{constructor(e=new D,t=new D,i=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Kr(e,r.x,s.x,o.x,a.x),Kr(e,r.y,s.y,o.y,a.y),Kr(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ld extends Mn{constructor(e=new fe,t=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new fe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new fe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fm extends Mn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class cd extends Mn{constructor(e=new fe,t=new fe,i=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new fe){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(Xr(e,r.x,s.x,o.x),Xr(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Bm extends Mn{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(Xr(e,r.x,s.x,o.x),Xr(e,r.y,s.y,o.y),Xr(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ud extends Mn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new fe){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],u=r[o>r.length-2?r.length-1:o+1],h=r[o>r.length-3?r.length-1:o+2];return i.set(Zc(a,l.x,c.x,u.x,h.x),Zc(a,l.y,c.y,u.y,h.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new fe().fromArray(r))}return this}}var Rl=Object.freeze({__proto__:null,ArcCurve:Rm,CatmullRomCurve3:Cm,CubicBezierCurve:ad,CubicBezierCurve3:km,EllipseCurve:sc,LineCurve:ld,LineCurve3:Fm,QuadraticBezierCurve:cd,QuadraticBezierCurve3:Bm,SplineCurve:ud});class zm extends Mn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Rl[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];i&&i.equals(u)||(t.push(u),i=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new Rl[r.type]().fromJSON(r))}return this}}class Cl extends zm{constructor(e){super(),this.type="Path",this.currentPoint=new fe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new ld(this.currentPoint.clone(),new fe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new cd(this.currentPoint.clone(),new fe(e,t),new fe(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new ad(this.currentPoint.clone(),new fe(e,t),new fe(i,r),new fe(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new ud(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,i,r,s,o,a,l),this}absellipse(e,t,i,r,s,o,a,l){const c=new sc(e,t,i,r,s,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class hd extends Cl{constructor(e){super(e),this.uuid=Er(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new Cl().fromJSON(r))}return this}}function Hm(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=dd(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c;if(i&&(s=$m(n,e,s,t)),n.length>80*t){a=1/0,l=1/0;let u=-1/0,h=-1/0;for(let d=t;d<r;d+=t){const f=n[d],g=n[d+1];f<a&&(a=f),g<l&&(l=g),f>u&&(u=f),g>h&&(h=g)}c=Math.max(u-a,h-l),c=c!==0?32767/c:0}return is(s,o,t,a,l,c,0),o}function dd(n,e,t,i,r){let s;if(r===ig(n,e,t,i)>0)for(let o=e;o<t;o+=i)s=Qc(o/i|0,n[o],n[o+1],s);else for(let o=t-i;o>=e;o-=i)s=Qc(o/i|0,n[o],n[o+1],s);return s&&xr(s,s.next)&&(ss(s),s=s.next),s}function Ii(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(xr(t,t.next)||dt(t.prev,t,t.next)===0)){if(ss(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function is(n,e,t,i,r,s,o){if(!n)return;!o&&s&&Jm(n,i,r,s);let a=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(s?Gm(n,i,r,s):Vm(n)){e.push(l.i,n.i,c.i),ss(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=jm(Ii(n),e),is(n,e,t,i,r,s,2)):o===2&&Wm(n,e,t,i,r,s):is(Ii(n),e,t,i,r,s,1);break}}}function Vm(n){const e=n.prev,t=n,i=n.next;if(dt(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,l=t.y,c=i.y,u=Math.min(r,s,o),h=Math.min(a,l,c),d=Math.max(r,s,o),f=Math.max(a,l,c);let g=i.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=f&&zr(r,a,s,l,o,c,g.x,g.y)&&dt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Gm(n,e,t,i){const r=n.prev,s=n,o=n.next;if(dt(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,u=r.y,h=s.y,d=o.y,f=Math.min(a,l,c),g=Math.min(u,h,d),v=Math.max(a,l,c),m=Math.max(u,h,d),p=Pl(f,g,e,t,i),M=Pl(v,m,e,t,i);let S=n.prevZ,w=n.nextZ;for(;S&&S.z>=p&&w&&w.z<=M;){if(S.x>=f&&S.x<=v&&S.y>=g&&S.y<=m&&S!==r&&S!==o&&zr(a,u,l,h,c,d,S.x,S.y)&&dt(S.prev,S,S.next)>=0||(S=S.prevZ,w.x>=f&&w.x<=v&&w.y>=g&&w.y<=m&&w!==r&&w!==o&&zr(a,u,l,h,c,d,w.x,w.y)&&dt(w.prev,w,w.next)>=0))return!1;w=w.nextZ}for(;S&&S.z>=p;){if(S.x>=f&&S.x<=v&&S.y>=g&&S.y<=m&&S!==r&&S!==o&&zr(a,u,l,h,c,d,S.x,S.y)&&dt(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;w&&w.z<=M;){if(w.x>=f&&w.x<=v&&w.y>=g&&w.y<=m&&w!==r&&w!==o&&zr(a,u,l,h,c,d,w.x,w.y)&&dt(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function jm(n,e){let t=n;do{const i=t.prev,r=t.next.next;!xr(i,r)&&pd(i,t,t.next,r)&&rs(i,r)&&rs(r,i)&&(e.push(i.i,t.i,r.i),ss(t),ss(t.next),t=n=r),t=t.next}while(t!==n);return Ii(t)}function Wm(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&eg(o,a)){let l=md(o,a);o=Ii(o,o.next),l=Ii(l,l.next),is(o,e,t,i,r,s,0),is(l,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function $m(n,e,t,i){const r=[];for(let s=0,o=e.length;s<o;s++){const a=e[s]*i,l=s<o-1?e[s+1]*i:n.length,c=dd(n,a,l,i,!1);c===c.next&&(c.steiner=!0),r.push(Qm(c))}r.sort(qm);for(let s=0;s<r.length;s++)t=Xm(r[s],t);return t}function qm(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),r=(e.next.y-e.y)/(e.next.x-e.x);t=i-r}return t}function Xm(n,e){const t=Km(n,e);if(!t)return e;const i=md(t,n);return Ii(i,i.next),Ii(t,t.next)}function Km(n,e){let t=e;const i=n.x,r=n.y;let s=-1/0,o;if(xr(n,t))return t;do{if(xr(n,t.next))return t.next;if(r<=t.y&&r>=t.next.y&&t.next.y!==t.y){const h=t.x+(r-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(h<=i&&h>s&&(s=h,o=t.x<t.next.x?t:t.next,h===i))return o}t=t.next}while(t!==e);if(!o)return null;const a=o,l=o.x,c=o.y;let u=1/0;t=o;do{if(i>=t.x&&t.x>=l&&i!==t.x&&fd(r<c?i:s,r,l,c,r<c?s:i,r,t.x,t.y)){const h=Math.abs(r-t.y)/(i-t.x);rs(t,n)&&(h<u||h===u&&(t.x>o.x||t.x===o.x&&Ym(o,t)))&&(o=t,u=h)}t=t.next}while(t!==a);return o}function Ym(n,e){return dt(n.prev,n,e.prev)<0&&dt(e.next,n,n.next)<0}function Jm(n,e,t,i){let r=n;do r.z===0&&(r.z=Pl(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,Zm(r)}function Zm(n){let e,t=1;do{let i=n,r;n=null;let s=null;for(e=0;i;){e++;let o=i,a=0;for(let c=0;c<t&&(a++,o=o.nextZ,!!o);c++);let l=t;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||i.z<=o.z)?(r=i,i=i.nextZ,a--):(r=o,o=o.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;i=o}s.nextZ=null,t*=2}while(e>1);return n}function Pl(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Qm(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function fd(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function zr(n,e,t,i,r,s,o,a){return!(n===o&&e===a)&&fd(n,e,t,i,r,s,o,a)}function eg(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!tg(n,e)&&(rs(n,e)&&rs(e,n)&&ng(n,e)&&(dt(n.prev,n,e.prev)||dt(n,e.prev,e))||xr(n,e)&&dt(n.prev,n,n.next)>0&&dt(e.prev,e,e.next)>0)}function dt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function xr(n,e){return n.x===e.x&&n.y===e.y}function pd(n,e,t,i){const r=$s(dt(n,e,t)),s=$s(dt(n,e,i)),o=$s(dt(t,i,n)),a=$s(dt(t,i,e));return!!(r!==s&&o!==a||r===0&&Ws(n,t,e)||s===0&&Ws(n,i,e)||o===0&&Ws(t,n,i)||a===0&&Ws(t,e,i))}function Ws(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function $s(n){return n>0?1:n<0?-1:0}function tg(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&pd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function rs(n,e){return dt(n.prev,n,n.next)<0?dt(n,e,n.next)>=0&&dt(n,n.prev,e)>=0:dt(n,e,n.prev)<0||dt(n,n.next,e)<0}function ng(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function md(n,e){const t=Il(n.i,n.x,n.y),i=Il(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Qc(n,e,t,i){const r=Il(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function ss(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Il(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ig(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class rg{static triangulate(e,t,i=2){return Hm(e,t,i)}}class rr{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return rr.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];eu(e),tu(i,e);let o=e.length;t.forEach(eu);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,tu(i,t[l]);const a=rg.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function eu(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function tu(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class ac extends En{constructor(e=new hd([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new tn(r,3)),this.setAttribute("uv",new tn(s,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,u=t.steps!==void 0?t.steps:1,h=t.depth!==void 0?t.depth:1;let d=t.bevelEnabled!==void 0?t.bevelEnabled:!0,f=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:f-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,m=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:sg;let S,w=!1,C,T,R,N;p&&(S=p.getSpacedPoints(u),w=!0,d=!1,C=p.computeFrenetFrames(u,!1),T=new D,R=new D,N=new D),d||(m=0,f=0,g=0,v=0);const E=a.extractPoints(c);let b=E.shape;const I=E.holes;if(!rr.isClockWise(b)){b=b.reverse();for(let ie=0,q=I.length;ie<q;ie++){const J=I[ie];rr.isClockWise(J)&&(I[ie]=J.reverse())}}function $(ie){const J=10000000000000001e-36;let Z=ie[0];for(let de=1;de<=ie.length;de++){const ae=de%ie.length,me=ie[ae],oe=me.x-Z.x,B=me.y-Z.y,y=oe*oe+B*B,_=Math.max(Math.abs(me.x),Math.abs(me.y),Math.abs(Z.x),Math.abs(Z.y)),L=J*_*_;if(y<=L){ie.splice(ae,1),de--;continue}Z=me}}$(b),I.forEach($);const te=I.length,W=b;for(let ie=0;ie<te;ie++){const q=I[ie];b=b.concat(q)}function K(ie,q,J){return q||console.error("THREE.ExtrudeGeometry: vec does not exist"),ie.clone().addScaledVector(q,J)}const ee=b.length;function G(ie,q,J){let Z,de,ae;const me=ie.x-q.x,oe=ie.y-q.y,B=J.x-ie.x,y=J.y-ie.y,_=me*me+oe*oe,L=me*y-oe*B;if(Math.abs(L)>Number.EPSILON){const O=Math.sqrt(_),j=Math.sqrt(B*B+y*y),F=q.x-oe/O,ce=q.y+me/O,re=J.x-y/j,he=J.y+B/j,be=((re-F)*y-(he-ce)*B)/(me*y-oe*B);Z=F+me*be-ie.x,de=ce+oe*be-ie.y;const X=Z*Z+de*de;if(X<=2)return new fe(Z,de);ae=Math.sqrt(X/2)}else{let O=!1;me>Number.EPSILON?B>Number.EPSILON&&(O=!0):me<-Number.EPSILON?B<-Number.EPSILON&&(O=!0):Math.sign(oe)===Math.sign(y)&&(O=!0),O?(Z=-oe,de=me,ae=Math.sqrt(_)):(Z=me,de=oe,ae=Math.sqrt(_/2))}return new fe(Z/ae,de/ae)}const _e=[];for(let ie=0,q=W.length,J=q-1,Z=ie+1;ie<q;ie++,J++,Z++)J===q&&(J=0),Z===q&&(Z=0),_e[ie]=G(W[ie],W[J],W[Z]);const we=[];let Te,ze=_e.concat();for(let ie=0,q=te;ie<q;ie++){const J=I[ie];Te=[];for(let Z=0,de=J.length,ae=de-1,me=Z+1;Z<de;Z++,ae++,me++)ae===de&&(ae=0),me===de&&(me=0),Te[Z]=G(J[Z],J[ae],J[me]);we.push(Te),ze=ze.concat(Te)}let Xe;if(m===0)Xe=rr.triangulateShape(W,I);else{const ie=[],q=[];for(let J=0;J<m;J++){const Z=J/m,de=f*Math.cos(Z*Math.PI/2),ae=g*Math.sin(Z*Math.PI/2)+v;for(let me=0,oe=W.length;me<oe;me++){const B=K(W[me],_e[me],ae);De(B.x,B.y,-de),Z===0&&ie.push(B)}for(let me=0,oe=te;me<oe;me++){const B=I[me];Te=we[me];const y=[];for(let _=0,L=B.length;_<L;_++){const O=K(B[_],Te[_],ae);De(O.x,O.y,-de),Z===0&&y.push(O)}Z===0&&q.push(y)}}Xe=rr.triangulateShape(ie,q)}const Ye=Xe.length,$e=g+v;for(let ie=0;ie<ee;ie++){const q=d?K(b[ie],ze[ie],$e):b[ie];w?(R.copy(C.normals[0]).multiplyScalar(q.x),T.copy(C.binormals[0]).multiplyScalar(q.y),N.copy(S[0]).add(R).add(T),De(N.x,N.y,N.z)):De(q.x,q.y,0)}for(let ie=1;ie<=u;ie++)for(let q=0;q<ee;q++){const J=d?K(b[q],ze[q],$e):b[q];w?(R.copy(C.normals[ie]).multiplyScalar(J.x),T.copy(C.binormals[ie]).multiplyScalar(J.y),N.copy(S[ie]).add(R).add(T),De(N.x,N.y,N.z)):De(J.x,J.y,h/u*ie)}for(let ie=m-1;ie>=0;ie--){const q=ie/m,J=f*Math.cos(q*Math.PI/2),Z=g*Math.sin(q*Math.PI/2)+v;for(let de=0,ae=W.length;de<ae;de++){const me=K(W[de],_e[de],Z);De(me.x,me.y,h+J)}for(let de=0,ae=I.length;de<ae;de++){const me=I[de];Te=we[de];for(let oe=0,B=me.length;oe<B;oe++){const y=K(me[oe],Te[oe],Z);w?De(y.x,y.y+S[u-1].y,S[u-1].x+J):De(y.x,y.y,h+J)}}}Y(),ne();function Y(){const ie=r.length/3;if(d){let q=0,J=ee*q;for(let Z=0;Z<Ye;Z++){const de=Xe[Z];Ie(de[2]+J,de[1]+J,de[0]+J)}q=u+m*2,J=ee*q;for(let Z=0;Z<Ye;Z++){const de=Xe[Z];Ie(de[0]+J,de[1]+J,de[2]+J)}}else{for(let q=0;q<Ye;q++){const J=Xe[q];Ie(J[2],J[1],J[0])}for(let q=0;q<Ye;q++){const J=Xe[q];Ie(J[0]+ee*u,J[1]+ee*u,J[2]+ee*u)}}i.addGroup(ie,r.length/3-ie,0)}function ne(){const ie=r.length/3;let q=0;Se(W,q),q+=W.length;for(let J=0,Z=I.length;J<Z;J++){const de=I[J];Se(de,q),q+=de.length}i.addGroup(ie,r.length/3-ie,1)}function Se(ie,q){let J=ie.length;for(;--J>=0;){const Z=J;let de=J-1;de<0&&(de=ie.length-1);for(let ae=0,me=u+m*2;ae<me;ae++){const oe=ee*ae,B=ee*(ae+1),y=q+Z+oe,_=q+de+oe,L=q+de+B,O=q+Z+B;qe(y,_,L,O)}}}function De(ie,q,J){l.push(ie),l.push(q),l.push(J)}function Ie(ie,q,J){tt(ie),tt(q),tt(J);const Z=r.length/3,de=M.generateTopUV(i,r,Z-3,Z-2,Z-1);A(de[0]),A(de[1]),A(de[2])}function qe(ie,q,J,Z){tt(ie),tt(q),tt(Z),tt(q),tt(J),tt(Z);const de=r.length/3,ae=M.generateSideWallUV(i,r,de-6,de-3,de-2,de-1);A(ae[0]),A(ae[1]),A(ae[3]),A(ae[1]),A(ae[2]),A(ae[3])}function tt(ie){r.push(l[ie*3+0]),r.push(l[ie*3+1]),r.push(l[ie*3+2])}function A(ie){s.push(ie.x),s.push(ie.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return og(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new Rl[r.type]().fromJSON(r)),new ac(i,e.options)}}const sg={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[r*3],u=e[r*3+1];return[new fe(s,o),new fe(a,l),new fe(c,u)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],u=e[i*3+1],h=e[i*3+2],d=e[r*3],f=e[r*3+1],g=e[r*3+2],v=e[s*3],m=e[s*3+1],p=e[s*3+2];return Math.abs(a-u)<Math.abs(o-c)?[new fe(o,1-l),new fe(c,1-h),new fe(d,1-g),new fe(v,1-p)]:[new fe(a,1-l),new fe(u,1-h),new fe(f,1-g),new fe(m,1-p)]}};function og(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class gs extends En{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=t/l,f=[],g=[],v=[],m=[];for(let p=0;p<u;p++){const M=p*d-o;for(let S=0;S<c;S++){const w=S*h-s;g.push(w,-M,0),v.push(0,0,1),m.push(S/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){const S=M+c*p,w=M+c*(p+1),C=M+1+c*(p+1),T=M+1+c*p;f.push(S,w,T),f.push(w,C,T)}this.setIndex(f),this.setAttribute("position",new tn(g,3)),this.setAttribute("normal",new tn(v,3)),this.setAttribute("uv",new tn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gs(e.width,e.height,e.widthSegments,e.heightSegments)}}class nu extends Mr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qh,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ag extends Mr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Np,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class lg extends Mr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class gd extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class cg extends gd{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Sa=new ct,iu=new D,ru=new D;class ug{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.mapType=xn,this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new rc,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new mt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;iu.setFromMatrixPosition(e.matrixWorld),t.position.copy(iu),ru.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(ru),t.updateMatrixWorld(),Sa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sa,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Sa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class _d extends nd{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class hg extends ug{constructor(){super(new _d(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class dg extends gd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new hg}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class fg extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const su=new ct;class pg{constructor(e,t,i=0,r=1/0){this.ray=new ko(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new ic,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return su.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(su),this}intersectObject(e,t=!0,i=[]){return Ll(e,this,i,t),i.sort(ou),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Ll(e[r],this,i,t);return i.sort(ou),i}}function ou(n,e){return n.distance-e.distance}function Ll(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)Ll(s[o],e,t,!0)}}class au{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=We(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(We(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class mg extends Li{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function lu(n,e,t,i){const r=gg(i);switch(t){case Gh:return n*e;case Wh:return n*e/r.components*r.byteLength;case Ql:return n*e/r.components*r.byteLength;case $h:return n*e*2/r.components*r.byteLength;case ec:return n*e*2/r.components*r.byteLength;case jh:return n*e*3/r.components*r.byteLength;case hn:return n*e*4/r.components*r.byteLength;case tc:return n*e*4/r.components*r.byteLength;case ao:case lo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case co:case uo:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case el:case nl:return Math.max(n,16)*Math.max(e,8)/4;case Qa:case tl:return Math.max(n,8)*Math.max(e,8)/2;case il:case rl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case sl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ol:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case al:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ll:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case cl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case ul:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case hl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case dl:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case fl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case pl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ml:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case gl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case _l:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case vl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case yl:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case Sl:case wl:case xl:return Math.ceil(n/4)*Math.ceil(e/4)*16;case bl:case El:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Ml:case Tl:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function gg(n){switch(n){case xn:case Bh:return{byteLength:1,components:1};case Zr:case zh:case ps:return{byteLength:2,components:1};case Jl:case Zl:return{byteLength:2,components:4};case Ri:case Yl:case Vn:return{byteLength:4,components:1};case Hh:case Vh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Kl}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Kl);function vd(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function _g(n){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],v=h[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const v=h[f];n.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var vg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Sg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,wg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Eg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Mg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Ag=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Pg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ig=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Lg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Dg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Og=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ug=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ng=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Fg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,zg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Hg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Vg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Gg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,jg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Wg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$g=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Yg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Jg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Qg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,e_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,t_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,n_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,i_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,r_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,s_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,o_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,a_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,l_=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,c_=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,u_=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,h_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,d_=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,f_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,p_=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,m_=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,g_=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,__=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,v_=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,y_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,S_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,w_=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,x_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,b_=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,E_=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,M_=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,T_=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,A_=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,R_=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,C_=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,P_=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,I_=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,L_=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,D_=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,O_=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,U_=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,N_=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,k_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,F_=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,B_=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,z_=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,H_=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,V_=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,G_=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,j_=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,W_=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,$_=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,q_=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,X_=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,K_=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Y_=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,J_=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Z_=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Q_=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ev=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,tv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,nv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,iv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,sv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ov=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,av=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,lv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,cv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,uv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,hv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,dv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,fv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,pv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,mv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,gv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _v=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ev=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Mv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Tv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Av=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Rv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Pv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Iv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Lv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ov=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Uv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Nv=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Fv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Bv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Vv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Gv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jv=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Wv=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,$v=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,qv=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Xv=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kv=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Yv=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,je={alphahash_fragment:vg,alphahash_pars_fragment:yg,alphamap_fragment:Sg,alphamap_pars_fragment:wg,alphatest_fragment:xg,alphatest_pars_fragment:bg,aomap_fragment:Eg,aomap_pars_fragment:Mg,batching_pars_vertex:Tg,batching_vertex:Ag,begin_vertex:Rg,beginnormal_vertex:Cg,bsdfs:Pg,iridescence_fragment:Ig,bumpmap_pars_fragment:Lg,clipping_planes_fragment:Dg,clipping_planes_pars_fragment:Og,clipping_planes_pars_vertex:Ug,clipping_planes_vertex:Ng,color_fragment:kg,color_pars_fragment:Fg,color_pars_vertex:Bg,color_vertex:zg,common:Hg,cube_uv_reflection_fragment:Vg,defaultnormal_vertex:Gg,displacementmap_pars_vertex:jg,displacementmap_vertex:Wg,emissivemap_fragment:$g,emissivemap_pars_fragment:qg,colorspace_fragment:Xg,colorspace_pars_fragment:Kg,envmap_fragment:Yg,envmap_common_pars_fragment:Jg,envmap_pars_fragment:Zg,envmap_pars_vertex:Qg,envmap_physical_pars_fragment:u_,envmap_vertex:e_,fog_vertex:t_,fog_pars_vertex:n_,fog_fragment:i_,fog_pars_fragment:r_,gradientmap_pars_fragment:s_,lightmap_pars_fragment:o_,lights_lambert_fragment:a_,lights_lambert_pars_fragment:l_,lights_pars_begin:c_,lights_toon_fragment:h_,lights_toon_pars_fragment:d_,lights_phong_fragment:f_,lights_phong_pars_fragment:p_,lights_physical_fragment:m_,lights_physical_pars_fragment:g_,lights_fragment_begin:__,lights_fragment_maps:v_,lights_fragment_end:y_,logdepthbuf_fragment:S_,logdepthbuf_pars_fragment:w_,logdepthbuf_pars_vertex:x_,logdepthbuf_vertex:b_,map_fragment:E_,map_pars_fragment:M_,map_particle_fragment:T_,map_particle_pars_fragment:A_,metalnessmap_fragment:R_,metalnessmap_pars_fragment:C_,morphinstance_vertex:P_,morphcolor_vertex:I_,morphnormal_vertex:L_,morphtarget_pars_vertex:D_,morphtarget_vertex:O_,normal_fragment_begin:U_,normal_fragment_maps:N_,normal_pars_fragment:k_,normal_pars_vertex:F_,normal_vertex:B_,normalmap_pars_fragment:z_,clearcoat_normal_fragment_begin:H_,clearcoat_normal_fragment_maps:V_,clearcoat_pars_fragment:G_,iridescence_pars_fragment:j_,opaque_fragment:W_,packing:$_,premultiplied_alpha_fragment:q_,project_vertex:X_,dithering_fragment:K_,dithering_pars_fragment:Y_,roughnessmap_fragment:J_,roughnessmap_pars_fragment:Z_,shadowmap_pars_fragment:Q_,shadowmap_pars_vertex:ev,shadowmap_vertex:tv,shadowmask_pars_fragment:nv,skinbase_vertex:iv,skinning_pars_vertex:rv,skinning_vertex:sv,skinnormal_vertex:ov,specularmap_fragment:av,specularmap_pars_fragment:lv,tonemapping_fragment:cv,tonemapping_pars_fragment:uv,transmission_fragment:hv,transmission_pars_fragment:dv,uv_pars_fragment:fv,uv_pars_vertex:pv,uv_vertex:mv,worldpos_vertex:gv,background_vert:_v,background_frag:vv,backgroundCube_vert:yv,backgroundCube_frag:Sv,cube_vert:wv,cube_frag:xv,depth_vert:bv,depth_frag:Ev,distanceRGBA_vert:Mv,distanceRGBA_frag:Tv,equirect_vert:Av,equirect_frag:Rv,linedashed_vert:Cv,linedashed_frag:Pv,meshbasic_vert:Iv,meshbasic_frag:Lv,meshlambert_vert:Dv,meshlambert_frag:Ov,meshmatcap_vert:Uv,meshmatcap_frag:Nv,meshnormal_vert:kv,meshnormal_frag:Fv,meshphong_vert:Bv,meshphong_frag:zv,meshphysical_vert:Hv,meshphysical_frag:Vv,meshtoon_vert:Gv,meshtoon_frag:jv,points_vert:Wv,points_frag:$v,shadow_vert:qv,shadow_frag:Xv,sprite_vert:Kv,sprite_frag:Yv},xe={common:{diffuse:{value:new Je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new Je(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},gn={basic:{uniforms:Lt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.fog]),vertexShader:je.meshbasic_vert,fragmentShader:je.meshbasic_frag},lambert:{uniforms:Lt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Je(0)}}]),vertexShader:je.meshlambert_vert,fragmentShader:je.meshlambert_frag},phong:{uniforms:Lt([xe.common,xe.specularmap,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,xe.lights,{emissive:{value:new Je(0)},specular:{value:new Je(1118481)},shininess:{value:30}}]),vertexShader:je.meshphong_vert,fragmentShader:je.meshphong_frag},standard:{uniforms:Lt([xe.common,xe.envmap,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.roughnessmap,xe.metalnessmap,xe.fog,xe.lights,{emissive:{value:new Je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag},toon:{uniforms:Lt([xe.common,xe.aomap,xe.lightmap,xe.emissivemap,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.gradientmap,xe.fog,xe.lights,{emissive:{value:new Je(0)}}]),vertexShader:je.meshtoon_vert,fragmentShader:je.meshtoon_frag},matcap:{uniforms:Lt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,xe.fog,{matcap:{value:null}}]),vertexShader:je.meshmatcap_vert,fragmentShader:je.meshmatcap_frag},points:{uniforms:Lt([xe.points,xe.fog]),vertexShader:je.points_vert,fragmentShader:je.points_frag},dashed:{uniforms:Lt([xe.common,xe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:je.linedashed_vert,fragmentShader:je.linedashed_frag},depth:{uniforms:Lt([xe.common,xe.displacementmap]),vertexShader:je.depth_vert,fragmentShader:je.depth_frag},normal:{uniforms:Lt([xe.common,xe.bumpmap,xe.normalmap,xe.displacementmap,{opacity:{value:1}}]),vertexShader:je.meshnormal_vert,fragmentShader:je.meshnormal_frag},sprite:{uniforms:Lt([xe.sprite,xe.fog]),vertexShader:je.sprite_vert,fragmentShader:je.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:je.background_vert,fragmentShader:je.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:je.backgroundCube_vert,fragmentShader:je.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:je.cube_vert,fragmentShader:je.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:je.equirect_vert,fragmentShader:je.equirect_frag},distanceRGBA:{uniforms:Lt([xe.common,xe.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:je.distanceRGBA_vert,fragmentShader:je.distanceRGBA_frag},shadow:{uniforms:Lt([xe.lights,xe.fog,{color:{value:new Je(0)},opacity:{value:1}}]),vertexShader:je.shadow_vert,fragmentShader:je.shadow_frag}};gn.physical={uniforms:Lt([gn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new Je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new Je(0)},specularColor:{value:new Je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:je.meshphysical_vert,fragmentShader:je.meshphysical_frag};const qs={r:0,b:0,g:0},fi=new bn,Jv=new ct;function Zv(n,e,t,i,r,s,o){const a=new Je(0);let l=s===!0?0:1,c,u,h=null,d=0,f=null;function g(S){let w=S.isScene===!0?S.background:null;return w&&w.isTexture&&(w=(S.backgroundBlurriness>0?t:e).get(w)),w}function v(S){let w=!1;const C=g(S);C===null?p(a,l):C&&C.isColor&&(p(C,1),w=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,o):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||w)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(S,w){const C=g(w);C&&(C.isCubeTexture||C.mapping===Uo)?(u===void 0&&(u=new dn(new Gn(1,1,1),new oi({name:"BackgroundCubeMaterial",uniforms:wr(gn.backgroundCube.uniforms),vertexShader:gn.backgroundCube.vertexShader,fragmentShader:gn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,R,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),fi.copy(w.backgroundRotation),fi.x*=-1,fi.y*=-1,fi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(fi.y*=-1,fi.z*=-1),u.material.uniforms.envMap.value=C,u.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Jv.makeRotationFromEuler(fi)),u.material.toneMapped=Qe.getTransfer(C.colorSpace)!==rt,(h!==C||d!==C.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=C,d=C.version,f=n.toneMapping),u.layers.enableAll(),S.unshift(u,u.geometry,u.material,0,0,null)):C&&C.isTexture&&(c===void 0&&(c=new dn(new gs(2,2),new oi({name:"BackgroundMaterial",uniforms:wr(gn.background.uniforms),vertexShader:gn.background.vertexShader,fragmentShader:gn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=C,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(C.colorSpace)!==rt,C.matrixAutoUpdate===!0&&C.updateMatrix(),c.material.uniforms.uvTransform.value.copy(C.matrix),(h!==C||d!==C.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=C,d=C.version,f=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,w){S.getRGB(qs,td(n)),i.buffers.color.setClear(qs.r,qs.g,qs.b,w,o)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,w=1){a.set(S),l=w,p(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(S){l=S,p(a,l)},render:v,addToRenderList:m,dispose:M}}function Qv(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(b,I,V,$,te){let W=!1;const K=h($,V,I);s!==K&&(s=K,c(s.object)),W=f(b,$,V,te),W&&g(b,$,V,te),te!==null&&e.update(te,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,w(b,I,V,$),te!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(te).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function u(b){return n.deleteVertexArray(b)}function h(b,I,V){const $=V.wireframe===!0;let te=i[b.id];te===void 0&&(te={},i[b.id]=te);let W=te[I.id];W===void 0&&(W={},te[I.id]=W);let K=W[$];return K===void 0&&(K=d(l()),W[$]=K),K}function d(b){const I=[],V=[],$=[];for(let te=0;te<t;te++)I[te]=0,V[te]=0,$[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:V,attributeDivisors:$,object:b,attributes:{},index:null}}function f(b,I,V,$){const te=s.attributes,W=I.attributes;let K=0;const ee=V.getAttributes();for(const G in ee)if(ee[G].location>=0){const we=te[G];let Te=W[G];if(Te===void 0&&(G==="instanceMatrix"&&b.instanceMatrix&&(Te=b.instanceMatrix),G==="instanceColor"&&b.instanceColor&&(Te=b.instanceColor)),we===void 0||we.attribute!==Te||Te&&we.data!==Te.data)return!0;K++}return s.attributesNum!==K||s.index!==$}function g(b,I,V,$){const te={},W=I.attributes;let K=0;const ee=V.getAttributes();for(const G in ee)if(ee[G].location>=0){let we=W[G];we===void 0&&(G==="instanceMatrix"&&b.instanceMatrix&&(we=b.instanceMatrix),G==="instanceColor"&&b.instanceColor&&(we=b.instanceColor));const Te={};Te.attribute=we,we&&we.data&&(Te.data=we.data),te[G]=Te,K++}s.attributes=te,s.attributesNum=K,s.index=$}function v(){const b=s.newAttributes;for(let I=0,V=b.length;I<V;I++)b[I]=0}function m(b){p(b,0)}function p(b,I){const V=s.newAttributes,$=s.enabledAttributes,te=s.attributeDivisors;V[b]=1,$[b]===0&&(n.enableVertexAttribArray(b),$[b]=1),te[b]!==I&&(n.vertexAttribDivisor(b,I),te[b]=I)}function M(){const b=s.newAttributes,I=s.enabledAttributes;for(let V=0,$=I.length;V<$;V++)I[V]!==b[V]&&(n.disableVertexAttribArray(V),I[V]=0)}function S(b,I,V,$,te,W,K){K===!0?n.vertexAttribIPointer(b,I,V,te,W):n.vertexAttribPointer(b,I,V,$,te,W)}function w(b,I,V,$){v();const te=$.attributes,W=V.getAttributes(),K=I.defaultAttributeValues;for(const ee in W){const G=W[ee];if(G.location>=0){let _e=te[ee];if(_e===void 0&&(ee==="instanceMatrix"&&b.instanceMatrix&&(_e=b.instanceMatrix),ee==="instanceColor"&&b.instanceColor&&(_e=b.instanceColor)),_e!==void 0){const we=_e.normalized,Te=_e.itemSize,ze=e.get(_e);if(ze===void 0)continue;const Xe=ze.buffer,Ye=ze.type,$e=ze.bytesPerElement,Y=Ye===n.INT||Ye===n.UNSIGNED_INT||_e.gpuType===Yl;if(_e.isInterleavedBufferAttribute){const ne=_e.data,Se=ne.stride,De=_e.offset;if(ne.isInstancedInterleavedBuffer){for(let Ie=0;Ie<G.locationSize;Ie++)p(G.location+Ie,ne.meshPerAttribute);b.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ie=0;Ie<G.locationSize;Ie++)m(G.location+Ie);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let Ie=0;Ie<G.locationSize;Ie++)S(G.location+Ie,Te/G.locationSize,Ye,we,Se*$e,(De+Te/G.locationSize*Ie)*$e,Y)}else{if(_e.isInstancedBufferAttribute){for(let ne=0;ne<G.locationSize;ne++)p(G.location+ne,_e.meshPerAttribute);b.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let ne=0;ne<G.locationSize;ne++)m(G.location+ne);n.bindBuffer(n.ARRAY_BUFFER,Xe);for(let ne=0;ne<G.locationSize;ne++)S(G.location+ne,Te/G.locationSize,Ye,we,Te*$e,Te/G.locationSize*ne*$e,Y)}}else if(K!==void 0){const we=K[ee];if(we!==void 0)switch(we.length){case 2:n.vertexAttrib2fv(G.location,we);break;case 3:n.vertexAttrib3fv(G.location,we);break;case 4:n.vertexAttrib4fv(G.location,we);break;default:n.vertexAttrib1fv(G.location,we)}}}}M()}function C(){N();for(const b in i){const I=i[b];for(const V in I){const $=I[V];for(const te in $)u($[te].object),delete $[te];delete I[V]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const I=i[b.id];for(const V in I){const $=I[V];for(const te in $)u($[te].object),delete $[te];delete I[V]}delete i[b.id]}function R(b){for(const I in i){const V=i[I];if(V[b.id]===void 0)continue;const $=V[b.id];for(const te in $)u($[te].object),delete $[te];delete V[b.id]}}function N(){E(),o=!0,s!==r&&(s=r,c(s.object))}function E(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:N,resetDefaultState:E,dispose:C,releaseStatesOfGeometry:T,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:m,disableUnusedAttributes:M}}function ey(n,e,t){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function o(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function a(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function l(c,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*d[v];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function ty(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==hn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const N=R===ps&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==xn&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Vn&&!N)}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),S=n.getParameter(n.MAX_VARYING_VECTORS),w=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:S,maxFragmentUniforms:w,vertexTextures:C,maxSamples:T}}function ny(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Zn,a=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{const M=s?0:i,S=M*4;let w=p.clippingState||null;l.value=w,w=u(g,d,S,f);for(let C=0;C!==S;++C)w[C]=t[C];p.clippingState=w,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,w=f;S!==v;++S,w+=4)o.copy(h[S]).applyMatrix4(M,a),o.normal.toArray(m,w),m[w+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function iy(n){let e=new WeakMap;function t(o,a){return a===Ya?o.mapping=vr:a===Ja&&(o.mapping=yr),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===Ya||a===Ja)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new vm(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}const sr=4,cu=[.125,.215,.35,.446,.526,.582],yi=20,wa=new _d,uu=new Je;let xa=null,ba=0,Ea=0,Ma=!1;const gi=(1+Math.sqrt(5))/2,qi=1/gi,hu=[new D(-gi,qi,0),new D(gi,qi,0),new D(-qi,0,gi),new D(qi,0,gi),new D(0,gi,-qi),new D(0,gi,qi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],ry=new D;class du{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100,s={}){const{size:o=256,position:a=ry}=s;xa=this._renderer.getRenderTarget(),ba=this._renderer.getActiveCubeFace(),Ea=this._renderer.getActiveMipmapLevel(),Ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=mu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=pu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(xa,ba,Ea),this._renderer.xr.enabled=Ma,e.scissorTest=!1,Xs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===vr||e.mapping===yr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xa=this._renderer.getRenderTarget(),ba=this._renderer.getActiveCubeFace(),Ea=this._renderer.getActiveMipmapLevel(),Ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:yn,minFilter:yn,generateMipmaps:!1,type:ps,format:hn,colorSpace:Sr,depthBuffer:!1},r=fu(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fu(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=sy(s)),this._blurMaterial=oy(s,e,t)}return r}_compileMaterial(e){const t=new dn(this._lodPlanes[0],e);this._renderer.compile(t,wa)}_sceneToCubeUV(e,t,i,r,s){const l=new Zt(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(uu),h.toneMapping=ri,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null));const v=new Zh({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1}),m=new dn(new Gn,v);let p=!1;const M=e.background;M?M.isColor&&(v.color.copy(M),e.background=null,p=!0):(v.color.copy(uu),p=!0);for(let S=0;S<6;S++){const w=S%3;w===0?(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[S],s.y,s.z)):w===1?(l.up.set(0,0,c[S]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[S],s.z)):(l.up.set(0,c[S],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[S]));const C=this._cubeSize;Xs(r,w*C,S>2?C:0,C,C),h.setRenderTarget(r),p&&h.render(m,l),h.render(e,l)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=d,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===vr||e.mapping===yr;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=mu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=pu());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new dn(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Xs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,wa)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=hu[(r-s-1)%hu.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new dn(this._lodPlanes[r],c),d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*yi-1),v=s/g,m=isFinite(s)?1+Math.floor(u*v):yi;m>yi&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yi}`);const p=[];let M=0;for(let R=0;R<yi;++R){const N=R/v,E=Math.exp(-N*N/2);p.push(E),R===0?M+=E:R<m&&(M+=2*E)}for(let R=0;R<p.length;R++)p[R]=p[R]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-i;const w=this._sizeLods[r],C=3*w*(r>S-sr?r-S+sr:0),T=4*(this._cubeSize-w);Xs(t,C,T,3*w,2*w),l.setRenderTarget(t),l.render(h,wa)}}function sy(n){const e=[],t=[],i=[];let r=n;const s=n-sr+1+cu.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-sr?l=cu[o-n+sr-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,v=3,m=2,p=1,M=new Float32Array(v*g*f),S=new Float32Array(m*g*f),w=new Float32Array(p*g*f);for(let T=0;T<f;T++){const R=T%3*2/3-1,N=T>2?0:-1,E=[R,N,0,R+2/3,N,0,R+2/3,N+1,0,R,N,0,R+2/3,N+1,0,R,N+1,0];M.set(E,v*g*T),S.set(d,m*g*T);const b=[T,T,T,T,T,T];w.set(b,p*g*T)}const C=new En;C.setAttribute("position",new wn(M,v)),C.setAttribute("uv",new wn(S,m)),C.setAttribute("faceIndex",new wn(w,p)),e.push(C),r>sr&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function fu(n,e,t){const i=new Pi(n,e,t);return i.texture.mapping=Uo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Xs(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function oy(n,e,t){const i=new Float32Array(yi),r=new D(0,1,0);return new oi({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function pu(){return new oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function mu(){return new oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:lc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function lc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function ay(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===Ya||l===Ja,u=l===vr||l===yr;if(c||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new du(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const f=a.image;return c&&f&&f.height>0||u&&f&&r(f)?(t===null&&(t=new du(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function ly(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&ns("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function cy(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];const f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,g=h.attributes.position;let v=0;if(f!==null){const M=f.array;v=f.version;for(let S=0,w=M.length;S<w;S+=3){const C=M[S+0],T=M[S+1],R=M[S+2];d.push(C,T,T,R,R,C)}}else if(g!==void 0){const M=g.array;v=g.version;for(let S=0,w=M.length/3-1;S<w;S+=3){const C=S+0,T=S+1,R=S+2;d.push(C,T,T,R,R,C)}}else return;const m=new(Kh(d)?ed:Qh)(d,1);m.version=v;const p=s.get(h);p&&e.remove(p),s.set(h,m)}function u(h){const d=s.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function uy(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,f){n.drawElements(i,f,s,d*o),t.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,d*o,g),t.update(f,i,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function h(d,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/o,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,d,0,v,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M]*v[M];t.update(p,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function hy(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function dy(n,e,t){const i=new WeakMap,r=new mt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let b=function(){N.dispose(),i.delete(a),a.removeEventListener("dispose",b)};var f=b;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let w=0;g===!0&&(w=1),v===!0&&(w=2),m===!0&&(w=3);let C=a.attributes.position.count*w,T=1;C>e.maxTextureSize&&(T=Math.ceil(C/e.maxTextureSize),C=e.maxTextureSize);const R=new Float32Array(C*T*4*h),N=new Yh(R,C,T,h);N.type=Vn,N.needsUpdate=!0;const E=w*4;for(let I=0;I<h;I++){const V=p[I],$=M[I],te=S[I],W=C*T*4*I;for(let K=0;K<V.count;K++){const ee=K*E;g===!0&&(r.fromBufferAttribute(V,K),R[W+ee+0]=r.x,R[W+ee+1]=r.y,R[W+ee+2]=r.z,R[W+ee+3]=0),v===!0&&(r.fromBufferAttribute($,K),R[W+ee+4]=r.x,R[W+ee+5]=r.y,R[W+ee+6]=r.z,R[W+ee+7]=0),m===!0&&(r.fromBufferAttribute(te,K),R[W+ee+8]=r.x,R[W+ee+9]=r.y,R[W+ee+10]=r.z,R[W+ee+11]=te.itemSize===4?r.w:1)}}d={count:h,texture:N,size:new fe(C,T)},i.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const v=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function fy(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}const yd=new Ot,gu=new sd(1,1),Sd=new Yh,wd=new tm,xd=new id,_u=[],vu=[],yu=new Float32Array(16),Su=new Float32Array(9),wu=new Float32Array(4);function Tr(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=_u[r];if(s===void 0&&(s=new Float32Array(r),_u[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function St(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function wt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Fo(n,e){let t=vu[e];t===void 0&&(t=new Int32Array(e),vu[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function py(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function my(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2fv(this.addr,e),wt(t,e)}}function gy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(St(t,e))return;n.uniform3fv(this.addr,e),wt(t,e)}}function _y(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4fv(this.addr,e),wt(t,e)}}function vy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),wt(t,e)}else{if(St(t,i))return;wu.set(i),n.uniformMatrix2fv(this.addr,!1,wu),wt(t,i)}}function yy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),wt(t,e)}else{if(St(t,i))return;Su.set(i),n.uniformMatrix3fv(this.addr,!1,Su),wt(t,i)}}function Sy(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(St(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),wt(t,e)}else{if(St(t,i))return;yu.set(i),n.uniformMatrix4fv(this.addr,!1,yu),wt(t,i)}}function wy(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function xy(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2iv(this.addr,e),wt(t,e)}}function by(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;n.uniform3iv(this.addr,e),wt(t,e)}}function Ey(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4iv(this.addr,e),wt(t,e)}}function My(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Ty(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(St(t,e))return;n.uniform2uiv(this.addr,e),wt(t,e)}}function Ay(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(St(t,e))return;n.uniform3uiv(this.addr,e),wt(t,e)}}function Ry(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(St(t,e))return;n.uniform4uiv(this.addr,e),wt(t,e)}}function Cy(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(gu.compareFunction=Xh,s=gu):s=yd,t.setTexture2D(e||s,r)}function Py(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||wd,r)}function Iy(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||xd,r)}function Ly(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Sd,r)}function Dy(n){switch(n){case 5126:return py;case 35664:return my;case 35665:return gy;case 35666:return _y;case 35674:return vy;case 35675:return yy;case 35676:return Sy;case 5124:case 35670:return wy;case 35667:case 35671:return xy;case 35668:case 35672:return by;case 35669:case 35673:return Ey;case 5125:return My;case 36294:return Ty;case 36295:return Ay;case 36296:return Ry;case 35678:case 36198:case 36298:case 36306:case 35682:return Cy;case 35679:case 36299:case 36307:return Py;case 35680:case 36300:case 36308:case 36293:return Iy;case 36289:case 36303:case 36311:case 36292:return Ly}}function Oy(n,e){n.uniform1fv(this.addr,e)}function Uy(n,e){const t=Tr(e,this.size,2);n.uniform2fv(this.addr,t)}function Ny(n,e){const t=Tr(e,this.size,3);n.uniform3fv(this.addr,t)}function ky(n,e){const t=Tr(e,this.size,4);n.uniform4fv(this.addr,t)}function Fy(n,e){const t=Tr(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function By(n,e){const t=Tr(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function zy(n,e){const t=Tr(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Hy(n,e){n.uniform1iv(this.addr,e)}function Vy(n,e){n.uniform2iv(this.addr,e)}function Gy(n,e){n.uniform3iv(this.addr,e)}function jy(n,e){n.uniform4iv(this.addr,e)}function Wy(n,e){n.uniform1uiv(this.addr,e)}function $y(n,e){n.uniform2uiv(this.addr,e)}function qy(n,e){n.uniform3uiv(this.addr,e)}function Xy(n,e){n.uniform4uiv(this.addr,e)}function Ky(n,e,t){const i=this.cache,r=e.length,s=Fo(t,r);St(i,s)||(n.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||yd,s[o])}function Yy(n,e,t){const i=this.cache,r=e.length,s=Fo(t,r);St(i,s)||(n.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||wd,s[o])}function Jy(n,e,t){const i=this.cache,r=e.length,s=Fo(t,r);St(i,s)||(n.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||xd,s[o])}function Zy(n,e,t){const i=this.cache,r=e.length,s=Fo(t,r);St(i,s)||(n.uniform1iv(this.addr,s),wt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Sd,s[o])}function Qy(n){switch(n){case 5126:return Oy;case 35664:return Uy;case 35665:return Ny;case 35666:return ky;case 35674:return Fy;case 35675:return By;case 35676:return zy;case 5124:case 35670:return Hy;case 35667:case 35671:return Vy;case 35668:case 35672:return Gy;case 35669:case 35673:return jy;case 5125:return Wy;case 36294:return $y;case 36295:return qy;case 36296:return Xy;case 35678:case 36198:case 36298:case 36306:case 35682:return Ky;case 35679:case 36299:case 36307:return Yy;case 35680:case 36300:case 36308:case 36293:return Jy;case 36289:case 36303:case 36311:case 36292:return Zy}}class e0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Dy(t.type)}}class t0{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Qy(t.type)}}class n0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Ta=/(\w+)(\])?(\[|\.)?/g;function xu(n,e){n.seq.push(e),n.map[e.id]=e}function i0(n,e,t){const i=n.name,r=i.length;for(Ta.lastIndex=0;;){const s=Ta.exec(i),o=Ta.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){xu(t,c===void 0?new e0(a,n,e):new t0(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new n0(a),xu(t,h)),t=h}}}class ho{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);i0(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function bu(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const r0=37297;let s0=0;function o0(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const Eu=new Ge;function a0(n){Qe._getMatrix(Eu,Qe.workingColorSpace,n);const e=`mat3( ${Eu.elements.map(t=>t.toFixed(4))} )`;switch(Qe.getTransfer(n)){case _o:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Mu(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+o0(n.getShaderSource(e),a)}else return s}function l0(n,e){const t=a0(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function c0(n,e){let t;switch(e){case Rp:t="Linear";break;case Cp:t="Reinhard";break;case Pp:t="Cineon";break;case Ip:t="ACESFilmic";break;case Dp:t="AgX";break;case Op:t="Neutral";break;case Lp:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ks=new D;function u0(){Qe.getLuminanceCoefficients(Ks);const n=Ks.x.toFixed(4),e=Ks.y.toFixed(4),t=Ks.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function h0(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Hr).join(`
`)}function d0(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function f0(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function Hr(n){return n!==""}function Tu(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Au(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const p0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dl(n){return n.replace(p0,g0)}const m0=new Map;function g0(n,e){let t=je[e];if(t===void 0){const i=m0.get(e);if(i!==void 0)t=je[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Dl(t)}const _0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ru(n){return n.replace(_0,v0)}function v0(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Cu(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function y0(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Nh?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===ap?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Un&&(e="SHADOWMAP_TYPE_VSM"),e}function S0(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case vr:case yr:e="ENVMAP_TYPE_CUBE";break;case Uo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function w0(n){let e="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===yr&&(e="ENVMAP_MODE_REFRACTION"),e}function x0(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case kh:e="ENVMAP_BLENDING_MULTIPLY";break;case Tp:e="ENVMAP_BLENDING_MIX";break;case Ap:e="ENVMAP_BLENDING_ADD";break}return e}function b0(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function E0(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=y0(t),c=S0(t),u=w0(t),h=x0(t),d=b0(t),f=h0(t),g=d0(s),v=r.createProgram();let m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Hr).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Hr).join(`
`),p.length>0&&(p+=`
`)):(m=[Cu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Hr).join(`
`),p=[Cu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ri?"#define TONE_MAPPING":"",t.toneMapping!==ri?je.tonemapping_pars_fragment:"",t.toneMapping!==ri?c0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",je.colorspace_pars_fragment,l0("linearToOutputTexel",t.outputColorSpace),u0(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Hr).join(`
`)),o=Dl(o),o=Tu(o,t),o=Au(o,t),a=Dl(a),a=Tu(a,t),a=Au(a,t),o=Ru(o),a=Ru(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Pc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Pc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=M+m+o,w=M+p+a,C=bu(r,r.VERTEX_SHADER,S),T=bu(r,r.FRAGMENT_SHADER,w);r.attachShader(v,C),r.attachShader(v,T),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function R(I){if(n.debug.checkShaderErrors){const V=r.getProgramInfoLog(v)||"",$=r.getShaderInfoLog(C)||"",te=r.getShaderInfoLog(T)||"",W=V.trim(),K=$.trim(),ee=te.trim();let G=!0,_e=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,C,T);else{const we=Mu(r,C,"vertex"),Te=Mu(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+W+`
`+we+`
`+Te)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(K===""||ee==="")&&(_e=!1);_e&&(I.diagnostics={runnable:G,programLog:W,vertexShader:{log:K,prefix:m},fragmentShader:{log:ee,prefix:p}})}r.deleteShader(C),r.deleteShader(T),N=new ho(r,v),E=f0(r,v)}let N;this.getUniforms=function(){return N===void 0&&R(this),N};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=r.getProgramParameter(v,r0)),b},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=s0++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=C,this.fragmentShader=T,this}let M0=0;class T0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new A0(e),t.set(e,i)),i}}class A0{constructor(e){this.id=M0++,this.code=e,this.usedTimes=0}}function R0(n,e,t,i,r,s,o){const a=new ic,l=new T0,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let f=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,b,I,V,$){const te=V.fog,W=$.geometry,K=E.isMeshStandardMaterial?V.environment:null,ee=(E.isMeshStandardMaterial?t:e).get(E.envMap||K),G=ee&&ee.mapping===Uo?ee.image.height:null,_e=g[E.type];E.precision!==null&&(f=r.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const we=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Te=we!==void 0?we.length:0;let ze=0;W.morphAttributes.position!==void 0&&(ze=1),W.morphAttributes.normal!==void 0&&(ze=2),W.morphAttributes.color!==void 0&&(ze=3);let Xe,Ye,$e,Y;if(_e){const et=gn[_e];Xe=et.vertexShader,Ye=et.fragmentShader}else Xe=E.vertexShader,Ye=E.fragmentShader,l.update(E),$e=l.getVertexShaderID(E),Y=l.getFragmentShaderID(E);const ne=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),De=$.isInstancedMesh===!0,Ie=$.isBatchedMesh===!0,qe=!!E.map,tt=!!E.matcap,A=!!ee,ie=!!E.aoMap,q=!!E.lightMap,J=!!E.bumpMap,Z=!!E.normalMap,de=!!E.displacementMap,ae=!!E.emissiveMap,me=!!E.metalnessMap,oe=!!E.roughnessMap,B=E.anisotropy>0,y=E.clearcoat>0,_=E.dispersion>0,L=E.iridescence>0,O=E.sheen>0,j=E.transmission>0,F=B&&!!E.anisotropyMap,ce=y&&!!E.clearcoatMap,re=y&&!!E.clearcoatNormalMap,he=y&&!!E.clearcoatRoughnessMap,be=L&&!!E.iridescenceMap,X=L&&!!E.iridescenceThicknessMap,pe=O&&!!E.sheenColorMap,Oe=O&&!!E.sheenRoughnessMap,Re=!!E.specularMap,ve=!!E.specularColorMap,Fe=!!E.specularIntensityMap,P=j&&!!E.transmissionMap,se=j&&!!E.thicknessMap,ge=!!E.gradientMap,Me=!!E.alphaMap,le=E.alphaTest>0,Q=!!E.alphaHash,Pe=!!E.extensions;let He=ri;E.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(He=n.toneMapping);const nt={shaderID:_e,shaderType:E.type,shaderName:E.name,vertexShader:Xe,fragmentShader:Ye,defines:E.defines,customVertexShaderID:$e,customFragmentShaderID:Y,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Ie,batchingColor:Ie&&$._colorsTexture!==null,instancing:De,instancingColor:De&&$.instanceColor!==null,instancingMorph:De&&$.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Sr,alphaToCoverage:!!E.alphaToCoverage,map:qe,matcap:tt,envMap:A,envMapMode:A&&ee.mapping,envMapCubeUVHeight:G,aoMap:ie,lightMap:q,bumpMap:J,normalMap:Z,displacementMap:d&&de,emissiveMap:ae,normalMapObjectSpace:Z&&E.normalMapType===Fp,normalMapTangentSpace:Z&&E.normalMapType===qh,metalnessMap:me,roughnessMap:oe,anisotropy:B,anisotropyMap:F,clearcoat:y,clearcoatMap:ce,clearcoatNormalMap:re,clearcoatRoughnessMap:he,dispersion:_,iridescence:L,iridescenceMap:be,iridescenceThicknessMap:X,sheen:O,sheenColorMap:pe,sheenRoughnessMap:Oe,specularMap:Re,specularColorMap:ve,specularIntensityMap:Fe,transmission:j,transmissionMap:P,thicknessMap:se,gradientMap:ge,opaque:E.transparent===!1&&E.blending===lr&&E.alphaToCoverage===!1,alphaMap:Me,alphaTest:le,alphaHash:Q,combine:E.combine,mapUv:qe&&v(E.map.channel),aoMapUv:ie&&v(E.aoMap.channel),lightMapUv:q&&v(E.lightMap.channel),bumpMapUv:J&&v(E.bumpMap.channel),normalMapUv:Z&&v(E.normalMap.channel),displacementMapUv:de&&v(E.displacementMap.channel),emissiveMapUv:ae&&v(E.emissiveMap.channel),metalnessMapUv:me&&v(E.metalnessMap.channel),roughnessMapUv:oe&&v(E.roughnessMap.channel),anisotropyMapUv:F&&v(E.anisotropyMap.channel),clearcoatMapUv:ce&&v(E.clearcoatMap.channel),clearcoatNormalMapUv:re&&v(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&v(E.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&v(E.iridescenceMap.channel),iridescenceThicknessMapUv:X&&v(E.iridescenceThicknessMap.channel),sheenColorMapUv:pe&&v(E.sheenColorMap.channel),sheenRoughnessMapUv:Oe&&v(E.sheenRoughnessMap.channel),specularMapUv:Re&&v(E.specularMap.channel),specularColorMapUv:ve&&v(E.specularColorMap.channel),specularIntensityMapUv:Fe&&v(E.specularIntensityMap.channel),transmissionMapUv:P&&v(E.transmissionMap.channel),thicknessMapUv:se&&v(E.thicknessMap.channel),alphaMapUv:Me&&v(E.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Z||B),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!W.attributes.uv&&(qe||Me),fog:!!te,useFog:E.fog===!0,fogExp2:!!te&&te.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Se,skinning:$.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Te,morphTextureStride:ze,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&I.length>0,shadowMapType:n.shadowMap.type,toneMapping:He,decodeVideoTexture:qe&&E.map.isVideoTexture===!0&&Qe.getTransfer(E.map.colorSpace)===rt,decodeVideoTextureEmissive:ae&&E.emissiveMap.isVideoTexture===!0&&Qe.getTransfer(E.emissiveMap.colorSpace)===rt,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===cn,flipSided:E.side===Ht,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Pe&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Pe&&E.extensions.multiDraw===!0||Ie)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return nt.vertexUv1s=c.has(1),nt.vertexUv2s=c.has(2),nt.vertexUv3s=c.has(3),c.clear(),nt}function p(E){const b=[];if(E.shaderID?b.push(E.shaderID):(b.push(E.customVertexShaderID),b.push(E.customFragmentShaderID)),E.defines!==void 0)for(const I in E.defines)b.push(I),b.push(E.defines[I]);return E.isRawShaderMaterial===!1&&(M(b,E),S(b,E),b.push(n.outputColorSpace)),b.push(E.customProgramCacheKey),b.join()}function M(E,b){E.push(b.precision),E.push(b.outputColorSpace),E.push(b.envMapMode),E.push(b.envMapCubeUVHeight),E.push(b.mapUv),E.push(b.alphaMapUv),E.push(b.lightMapUv),E.push(b.aoMapUv),E.push(b.bumpMapUv),E.push(b.normalMapUv),E.push(b.displacementMapUv),E.push(b.emissiveMapUv),E.push(b.metalnessMapUv),E.push(b.roughnessMapUv),E.push(b.anisotropyMapUv),E.push(b.clearcoatMapUv),E.push(b.clearcoatNormalMapUv),E.push(b.clearcoatRoughnessMapUv),E.push(b.iridescenceMapUv),E.push(b.iridescenceThicknessMapUv),E.push(b.sheenColorMapUv),E.push(b.sheenRoughnessMapUv),E.push(b.specularMapUv),E.push(b.specularColorMapUv),E.push(b.specularIntensityMapUv),E.push(b.transmissionMapUv),E.push(b.thicknessMapUv),E.push(b.combine),E.push(b.fogExp2),E.push(b.sizeAttenuation),E.push(b.morphTargetsCount),E.push(b.morphAttributeCount),E.push(b.numDirLights),E.push(b.numPointLights),E.push(b.numSpotLights),E.push(b.numSpotLightMaps),E.push(b.numHemiLights),E.push(b.numRectAreaLights),E.push(b.numDirLightShadows),E.push(b.numPointLightShadows),E.push(b.numSpotLightShadows),E.push(b.numSpotLightShadowsWithMaps),E.push(b.numLightProbes),E.push(b.shadowMapType),E.push(b.toneMapping),E.push(b.numClippingPlanes),E.push(b.numClipIntersection),E.push(b.depthPacking)}function S(E,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),E.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),E.push(a.mask)}function w(E){const b=g[E.type];let I;if(b){const V=gn[b];I=pm.clone(V.uniforms)}else I=E.uniforms;return I}function C(E,b){let I;for(let V=0,$=u.length;V<$;V++){const te=u[V];if(te.cacheKey===b){I=te,++I.usedTimes;break}}return I===void 0&&(I=new E0(n,b,E,s),u.push(I)),I}function T(E){if(--E.usedTimes===0){const b=u.indexOf(E);u[b]=u[u.length-1],u.pop(),E.destroy()}}function R(E){l.remove(E)}function N(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:w,acquireProgram:C,releaseProgram:T,releaseShaderCache:R,programs:u,dispose:N}}function C0(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function P0(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Pu(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Iu(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,f,g,v,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:v,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=v,p.group=m),e++,p}function a(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.push(p):f.transparent===!0?r.push(p):t.push(p)}function l(h,d,f,g,v,m){const p=o(h,d,f,g,v,m);f.transmission>0?i.unshift(p):f.transparent===!0?r.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||P0),i.length>1&&i.sort(d||Pu),r.length>1&&r.sort(d||Pu)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:u,sort:c}}function I0(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new Iu,n.set(i,[o])):r>=s.length?(o=new Iu,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function L0(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Je};break;case"SpotLight":t={position:new D,direction:new D,color:new Je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Je,groundColor:new Je};break;case"RectAreaLight":t={color:new Je,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function D0(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let O0=0;function U0(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function N0(n){const e=new L0,t=D0(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,s=new ct,o=new ct;function a(c){let u=0,h=0,d=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,M=0,S=0,w=0,C=0,T=0,R=0;c.sort(U0);for(let E=0,b=c.length;E<b;E++){const I=c[E],V=I.color,$=I.intensity,te=I.distance,W=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=V.r*$,h+=V.g*$,d+=V.b*$;else if(I.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(I.sh.coefficients[K],$);R++}else if(I.isDirectionalLight){const K=e.get(I);if(K.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const ee=I.shadow,G=t.get(I);G.shadowIntensity=ee.intensity,G.shadowBias=ee.bias,G.shadowNormalBias=ee.normalBias,G.shadowRadius=ee.radius,G.shadowMapSize=ee.mapSize,i.directionalShadow[f]=G,i.directionalShadowMap[f]=W,i.directionalShadowMatrix[f]=I.shadow.matrix,M++}i.directional[f]=K,f++}else if(I.isSpotLight){const K=e.get(I);K.position.setFromMatrixPosition(I.matrixWorld),K.color.copy(V).multiplyScalar($),K.distance=te,K.coneCos=Math.cos(I.angle),K.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),K.decay=I.decay,i.spot[v]=K;const ee=I.shadow;if(I.map&&(i.spotLightMap[C]=I.map,C++,ee.updateMatrices(I),I.castShadow&&T++),i.spotLightMatrix[v]=ee.matrix,I.castShadow){const G=t.get(I);G.shadowIntensity=ee.intensity,G.shadowBias=ee.bias,G.shadowNormalBias=ee.normalBias,G.shadowRadius=ee.radius,G.shadowMapSize=ee.mapSize,i.spotShadow[v]=G,i.spotShadowMap[v]=W,w++}v++}else if(I.isRectAreaLight){const K=e.get(I);K.color.copy(V).multiplyScalar($),K.halfWidth.set(I.width*.5,0,0),K.halfHeight.set(0,I.height*.5,0),i.rectArea[m]=K,m++}else if(I.isPointLight){const K=e.get(I);if(K.color.copy(I.color).multiplyScalar(I.intensity),K.distance=I.distance,K.decay=I.decay,I.castShadow){const ee=I.shadow,G=t.get(I);G.shadowIntensity=ee.intensity,G.shadowBias=ee.bias,G.shadowNormalBias=ee.normalBias,G.shadowRadius=ee.radius,G.shadowMapSize=ee.mapSize,G.shadowCameraNear=ee.camera.near,G.shadowCameraFar=ee.camera.far,i.pointShadow[g]=G,i.pointShadowMap[g]=W,i.pointShadowMatrix[g]=I.shadow.matrix,S++}i.point[g]=K,g++}else if(I.isHemisphereLight){const K=e.get(I);K.skyColor.copy(I.color).multiplyScalar($),K.groundColor.copy(I.groundColor).multiplyScalar($),i.hemi[p]=K,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=xe.LTC_FLOAT_1,i.rectAreaLTC2=xe.LTC_FLOAT_2):(i.rectAreaLTC1=xe.LTC_HALF_1,i.rectAreaLTC2=xe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const N=i.hash;(N.directionalLength!==f||N.pointLength!==g||N.spotLength!==v||N.rectAreaLength!==m||N.hemiLength!==p||N.numDirectionalShadows!==M||N.numPointShadows!==S||N.numSpotShadows!==w||N.numSpotMaps!==C||N.numLightProbes!==R)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=w,i.spotShadowMap.length=w,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=w+C-T,i.spotLightMap.length=C,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,N.directionalLength=f,N.pointLength=g,N.spotLength=v,N.rectAreaLength=m,N.hemiLength=p,N.numDirectionalShadows=M,N.numPointShadows=S,N.numSpotShadows=w,N.numSpotMaps=C,N.numLightProbes=R,i.version=O0++)}function l(c,u){let h=0,d=0,f=0,g=0,v=0;const m=u.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const S=c[p];if(S.isDirectionalLight){const w=i.directional[h];w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(m),h++}else if(S.isSpotLight){const w=i.spot[f];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),w.direction.sub(r),w.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const w=i.rectArea[g];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),o.identity(),s.copy(S.matrixWorld),s.premultiply(m),o.extractRotation(s),w.halfWidth.set(S.width*.5,0,0),w.halfHeight.set(0,S.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),g++}else if(S.isPointLight){const w=i.point[d];w.position.setFromMatrixPosition(S.matrixWorld),w.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){const w=i.hemi[v];w.direction.setFromMatrixPosition(S.matrixWorld),w.direction.transformDirection(m),v++}}}return{setup:a,setupView:l,state:i}}function Lu(n){const e=new N0(n),t=[],i=[];function r(u){c.camera=u,t.length=0,i.length=0}function s(u){t.push(u)}function o(u){i.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function k0(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Lu(n),e.set(r,[a])):s>=o.length?(a=new Lu(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}const F0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,B0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function z0(n,e,t){let i=new rc;const r=new fe,s=new fe,o=new mt,a=new ag({depthPacking:kp}),l=new lg,c={},u=t.maxTextureSize,h={[si]:Ht,[Ht]:si,[cn]:cn},d=new oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:F0,fragmentShader:B0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new En;g.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new dn(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nh;let p=this.type;this.render=function(T,R,N){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const E=n.getRenderTarget(),b=n.getActiveCubeFace(),I=n.getActiveMipmapLevel(),V=n.state;V.setBlending(ii),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const $=p!==Un&&this.type===Un,te=p===Un&&this.type!==Un;for(let W=0,K=T.length;W<K;W++){const ee=T[W],G=ee.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ee,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;r.copy(G.mapSize);const _e=G.getFrameExtents();if(r.multiply(_e),s.copy(G.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/_e.x),r.x=s.x*_e.x,G.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/_e.y),r.y=s.y*_e.y,G.mapSize.y=s.y)),G.map===null||$===!0||te===!0){const Te=this.type!==Un?{minFilter:fn,magFilter:fn}:{};G.map!==null&&G.map.dispose(),G.map=new Pi(r.x,r.y,Te),G.map.texture.name=ee.name+".shadowMap",G.camera.updateProjectionMatrix()}n.setRenderTarget(G.map),n.clear();const we=G.getViewportCount();for(let Te=0;Te<we;Te++){const ze=G.getViewport(Te);o.set(s.x*ze.x,s.y*ze.y,s.x*ze.z,s.y*ze.w),V.viewport(o),G.updateMatrices(ee,Te),i=G.getFrustum(),w(R,N,G.camera,ee,this.type)}G.isPointLightShadow!==!0&&this.type===Un&&M(G,N),G.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(E,b,I)};function M(T,R){const N=e.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Pi(r.x,r.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(R,null,N,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(R,null,N,f,v,null)}function S(T,R,N,E){let b=null;const I=N.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(I!==void 0)b=I;else if(b=N.isPointLight===!0?l:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const V=b.uuid,$=R.uuid;let te=c[V];te===void 0&&(te={},c[V]=te);let W=te[$];W===void 0&&(W=b.clone(),te[$]=W,R.addEventListener("dispose",C)),b=W}if(b.visible=R.visible,b.wireframe=R.wireframe,E===Un?b.side=R.shadowSide!==null?R.shadowSide:R.side:b.side=R.shadowSide!==null?R.shadowSide:h[R.side],b.alphaMap=R.alphaMap,b.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,b.map=R.map,b.clipShadows=R.clipShadows,b.clippingPlanes=R.clippingPlanes,b.clipIntersection=R.clipIntersection,b.displacementMap=R.displacementMap,b.displacementScale=R.displacementScale,b.displacementBias=R.displacementBias,b.wireframeLinewidth=R.wireframeLinewidth,b.linewidth=R.linewidth,N.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const V=n.properties.get(b);V.light=N}return b}function w(T,R,N,E,b){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Un)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,T.matrixWorld);const $=e.update(T),te=T.material;if(Array.isArray(te)){const W=$.groups;for(let K=0,ee=W.length;K<ee;K++){const G=W[K],_e=te[G.materialIndex];if(_e&&_e.visible){const we=S(T,_e,E,b);T.onBeforeShadow(n,T,R,N,$,we,G),n.renderBufferDirect(N,null,$,we,T,G),T.onAfterShadow(n,T,R,N,$,we,G)}}}else if(te.visible){const W=S(T,te,E,b);T.onBeforeShadow(n,T,R,N,$,W,null),n.renderBufferDirect(N,null,$,W,T,null),T.onAfterShadow(n,T,R,N,$,W,null)}}const V=T.children;for(let $=0,te=V.length;$<te;$++)w(V[$],R,N,E,b)}function C(T){T.target.removeEventListener("dispose",C);for(const N in c){const E=c[N],b=T.target.uuid;b in E&&(E[b].dispose(),delete E[b])}}}const H0={[Ga]:ja,[Wa]:Xa,[$a]:Ka,[_r]:qa,[ja]:Ga,[Xa]:Wa,[Ka]:$a,[qa]:_r};function V0(n,e){function t(){let P=!1;const se=new mt;let ge=null;const Me=new mt(0,0,0,0);return{setMask:function(le){ge!==le&&!P&&(n.colorMask(le,le,le,le),ge=le)},setLocked:function(le){P=le},setClear:function(le,Q,Pe,He,nt){nt===!0&&(le*=He,Q*=He,Pe*=He),se.set(le,Q,Pe,He),Me.equals(se)===!1&&(n.clearColor(le,Q,Pe,He),Me.copy(se))},reset:function(){P=!1,ge=null,Me.set(-1,0,0,0)}}}function i(){let P=!1,se=!1,ge=null,Me=null,le=null;return{setReversed:function(Q){if(se!==Q){const Pe=e.get("EXT_clip_control");Q?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),se=Q;const He=le;le=null,this.setClear(He)}},getReversed:function(){return se},setTest:function(Q){Q?ne(n.DEPTH_TEST):Se(n.DEPTH_TEST)},setMask:function(Q){ge!==Q&&!P&&(n.depthMask(Q),ge=Q)},setFunc:function(Q){if(se&&(Q=H0[Q]),Me!==Q){switch(Q){case Ga:n.depthFunc(n.NEVER);break;case ja:n.depthFunc(n.ALWAYS);break;case Wa:n.depthFunc(n.LESS);break;case _r:n.depthFunc(n.LEQUAL);break;case $a:n.depthFunc(n.EQUAL);break;case qa:n.depthFunc(n.GEQUAL);break;case Xa:n.depthFunc(n.GREATER);break;case Ka:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Me=Q}},setLocked:function(Q){P=Q},setClear:function(Q){le!==Q&&(se&&(Q=1-Q),n.clearDepth(Q),le=Q)},reset:function(){P=!1,ge=null,Me=null,le=null,se=!1}}}function r(){let P=!1,se=null,ge=null,Me=null,le=null,Q=null,Pe=null,He=null,nt=null;return{setTest:function(et){P||(et?ne(n.STENCIL_TEST):Se(n.STENCIL_TEST))},setMask:function(et){se!==et&&!P&&(n.stencilMask(et),se=et)},setFunc:function(et,An,pn){(ge!==et||Me!==An||le!==pn)&&(n.stencilFunc(et,An,pn),ge=et,Me=An,le=pn)},setOp:function(et,An,pn){(Q!==et||Pe!==An||He!==pn)&&(n.stencilOp(et,An,pn),Q=et,Pe=An,He=pn)},setLocked:function(et){P=et},setClear:function(et){nt!==et&&(n.clearStencil(et),nt=et)},reset:function(){P=!1,se=null,ge=null,Me=null,le=null,Q=null,Pe=null,He=null,nt=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,M=null,S=null,w=null,C=null,T=null,R=new Je(0,0,0),N=0,E=!1,b=null,I=null,V=null,$=null,te=null;const W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,ee=0;const G=n.getParameter(n.VERSION);G.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(G)[1]),K=ee>=1):G.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),K=ee>=2);let _e=null,we={};const Te=n.getParameter(n.SCISSOR_BOX),ze=n.getParameter(n.VIEWPORT),Xe=new mt().fromArray(Te),Ye=new mt().fromArray(ze);function $e(P,se,ge,Me){const le=new Uint8Array(4),Q=n.createTexture();n.bindTexture(P,Q),n.texParameteri(P,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(P,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Pe=0;Pe<ge;Pe++)P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY?n.texImage3D(se,0,n.RGBA,1,1,Me,0,n.RGBA,n.UNSIGNED_BYTE,le):n.texImage2D(se+Pe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,le);return Q}const Y={};Y[n.TEXTURE_2D]=$e(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=$e(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=$e(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=$e(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(n.DEPTH_TEST),o.setFunc(_r),J(!1),Z(Ec),ne(n.CULL_FACE),ie(ii);function ne(P){u[P]!==!0&&(n.enable(P),u[P]=!0)}function Se(P){u[P]!==!1&&(n.disable(P),u[P]=!1)}function De(P,se){return h[P]!==se?(n.bindFramebuffer(P,se),h[P]=se,P===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=se),P===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=se),!0):!1}function Ie(P,se){let ge=f,Me=!1;if(P){ge=d.get(se),ge===void 0&&(ge=[],d.set(se,ge));const le=P.textures;if(ge.length!==le.length||ge[0]!==n.COLOR_ATTACHMENT0){for(let Q=0,Pe=le.length;Q<Pe;Q++)ge[Q]=n.COLOR_ATTACHMENT0+Q;ge.length=le.length,Me=!0}}else ge[0]!==n.BACK&&(ge[0]=n.BACK,Me=!0);Me&&n.drawBuffers(ge)}function qe(P){return g!==P?(n.useProgram(P),g=P,!0):!1}const tt={[vi]:n.FUNC_ADD,[cp]:n.FUNC_SUBTRACT,[up]:n.FUNC_REVERSE_SUBTRACT};tt[hp]=n.MIN,tt[dp]=n.MAX;const A={[fp]:n.ZERO,[pp]:n.ONE,[mp]:n.SRC_COLOR,[Ha]:n.SRC_ALPHA,[wp]:n.SRC_ALPHA_SATURATE,[yp]:n.DST_COLOR,[_p]:n.DST_ALPHA,[gp]:n.ONE_MINUS_SRC_COLOR,[Va]:n.ONE_MINUS_SRC_ALPHA,[Sp]:n.ONE_MINUS_DST_COLOR,[vp]:n.ONE_MINUS_DST_ALPHA,[xp]:n.CONSTANT_COLOR,[bp]:n.ONE_MINUS_CONSTANT_COLOR,[Ep]:n.CONSTANT_ALPHA,[Mp]:n.ONE_MINUS_CONSTANT_ALPHA};function ie(P,se,ge,Me,le,Q,Pe,He,nt,et){if(P===ii){v===!0&&(Se(n.BLEND),v=!1);return}if(v===!1&&(ne(n.BLEND),v=!0),P!==lp){if(P!==m||et!==E){if((p!==vi||w!==vi)&&(n.blendEquation(n.FUNC_ADD),p=vi,w=vi),et)switch(P){case lr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Mc:n.blendFunc(n.ONE,n.ONE);break;case Tc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ac:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case lr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Mc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Tc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ac:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}M=null,S=null,C=null,T=null,R.set(0,0,0),N=0,m=P,E=et}return}le=le||se,Q=Q||ge,Pe=Pe||Me,(se!==p||le!==w)&&(n.blendEquationSeparate(tt[se],tt[le]),p=se,w=le),(ge!==M||Me!==S||Q!==C||Pe!==T)&&(n.blendFuncSeparate(A[ge],A[Me],A[Q],A[Pe]),M=ge,S=Me,C=Q,T=Pe),(He.equals(R)===!1||nt!==N)&&(n.blendColor(He.r,He.g,He.b,nt),R.copy(He),N=nt),m=P,E=!1}function q(P,se){P.side===cn?Se(n.CULL_FACE):ne(n.CULL_FACE);let ge=P.side===Ht;se&&(ge=!ge),J(ge),P.blending===lr&&P.transparent===!1?ie(ii):ie(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),o.setFunc(P.depthFunc),o.setTest(P.depthTest),o.setMask(P.depthWrite),s.setMask(P.colorWrite);const Me=P.stencilWrite;a.setTest(Me),Me&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),ae(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):Se(n.SAMPLE_ALPHA_TO_COVERAGE)}function J(P){b!==P&&(P?n.frontFace(n.CW):n.frontFace(n.CCW),b=P)}function Z(P){P!==sp?(ne(n.CULL_FACE),P!==I&&(P===Ec?n.cullFace(n.BACK):P===op?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Se(n.CULL_FACE),I=P}function de(P){P!==V&&(K&&n.lineWidth(P),V=P)}function ae(P,se,ge){P?(ne(n.POLYGON_OFFSET_FILL),($!==se||te!==ge)&&(n.polygonOffset(se,ge),$=se,te=ge)):Se(n.POLYGON_OFFSET_FILL)}function me(P){P?ne(n.SCISSOR_TEST):Se(n.SCISSOR_TEST)}function oe(P){P===void 0&&(P=n.TEXTURE0+W-1),_e!==P&&(n.activeTexture(P),_e=P)}function B(P,se,ge){ge===void 0&&(_e===null?ge=n.TEXTURE0+W-1:ge=_e);let Me=we[ge];Me===void 0&&(Me={type:void 0,texture:void 0},we[ge]=Me),(Me.type!==P||Me.texture!==se)&&(_e!==ge&&(n.activeTexture(ge),_e=ge),n.bindTexture(P,se||Y[P]),Me.type=P,Me.texture=se)}function y(){const P=we[_e];P!==void 0&&P.type!==void 0&&(n.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function _(){try{n.compressedTexImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function L(){try{n.compressedTexImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function O(){try{n.texSubImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function j(){try{n.texSubImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function F(){try{n.compressedTexSubImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ce(){try{n.compressedTexSubImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function re(){try{n.texStorage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function he(){try{n.texStorage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function be(){try{n.texImage2D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function X(){try{n.texImage3D(...arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function pe(P){Xe.equals(P)===!1&&(n.scissor(P.x,P.y,P.z,P.w),Xe.copy(P))}function Oe(P){Ye.equals(P)===!1&&(n.viewport(P.x,P.y,P.z,P.w),Ye.copy(P))}function Re(P,se){let ge=c.get(se);ge===void 0&&(ge=new WeakMap,c.set(se,ge));let Me=ge.get(P);Me===void 0&&(Me=n.getUniformBlockIndex(se,P.name),ge.set(P,Me))}function ve(P,se){const Me=c.get(se).get(P);l.get(se)!==Me&&(n.uniformBlockBinding(se,Me,P.__bindingPointIndex),l.set(se,Me))}function Fe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},_e=null,we={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,M=null,S=null,w=null,C=null,T=null,R=new Je(0,0,0),N=0,E=!1,b=null,I=null,V=null,$=null,te=null,Xe.set(0,0,n.canvas.width,n.canvas.height),Ye.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ne,disable:Se,bindFramebuffer:De,drawBuffers:Ie,useProgram:qe,setBlending:ie,setMaterial:q,setFlipSided:J,setCullFace:Z,setLineWidth:de,setPolygonOffset:ae,setScissorTest:me,activeTexture:oe,bindTexture:B,unbindTexture:y,compressedTexImage2D:_,compressedTexImage3D:L,texImage2D:be,texImage3D:X,updateUBOMapping:Re,uniformBlockBinding:ve,texStorage2D:re,texStorage3D:he,texSubImage2D:O,texSubImage3D:j,compressedTexSubImage2D:F,compressedTexSubImage3D:ce,scissor:pe,viewport:Oe,reset:Fe}}function G0(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new fe,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(y,_){return f?new OffscreenCanvas(y,_):yo("canvas")}function v(y,_,L){let O=1;const j=B(y);if((j.width>L||j.height>L)&&(O=L/Math.max(j.width,j.height)),O<1)if(typeof HTMLImageElement<"u"&&y instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&y instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&y instanceof ImageBitmap||typeof VideoFrame<"u"&&y instanceof VideoFrame){const F=Math.floor(O*j.width),ce=Math.floor(O*j.height);h===void 0&&(h=g(F,ce));const re=_?g(F,ce):h;return re.width=F,re.height=ce,re.getContext("2d").drawImage(y,0,0,F,ce),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+F+"x"+ce+")."),re}else return"data"in y&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+")."),y;return y}function m(y){return y.generateMipmaps}function p(y){n.generateMipmap(y)}function M(y){return y.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:y.isWebGL3DRenderTarget?n.TEXTURE_3D:y.isWebGLArrayRenderTarget||y.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function S(y,_,L,O,j=!1){if(y!==null){if(n[y]!==void 0)return n[y];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+y+"'")}let F=_;if(_===n.RED&&(L===n.FLOAT&&(F=n.R32F),L===n.HALF_FLOAT&&(F=n.R16F),L===n.UNSIGNED_BYTE&&(F=n.R8)),_===n.RED_INTEGER&&(L===n.UNSIGNED_BYTE&&(F=n.R8UI),L===n.UNSIGNED_SHORT&&(F=n.R16UI),L===n.UNSIGNED_INT&&(F=n.R32UI),L===n.BYTE&&(F=n.R8I),L===n.SHORT&&(F=n.R16I),L===n.INT&&(F=n.R32I)),_===n.RG&&(L===n.FLOAT&&(F=n.RG32F),L===n.HALF_FLOAT&&(F=n.RG16F),L===n.UNSIGNED_BYTE&&(F=n.RG8)),_===n.RG_INTEGER&&(L===n.UNSIGNED_BYTE&&(F=n.RG8UI),L===n.UNSIGNED_SHORT&&(F=n.RG16UI),L===n.UNSIGNED_INT&&(F=n.RG32UI),L===n.BYTE&&(F=n.RG8I),L===n.SHORT&&(F=n.RG16I),L===n.INT&&(F=n.RG32I)),_===n.RGB_INTEGER&&(L===n.UNSIGNED_BYTE&&(F=n.RGB8UI),L===n.UNSIGNED_SHORT&&(F=n.RGB16UI),L===n.UNSIGNED_INT&&(F=n.RGB32UI),L===n.BYTE&&(F=n.RGB8I),L===n.SHORT&&(F=n.RGB16I),L===n.INT&&(F=n.RGB32I)),_===n.RGBA_INTEGER&&(L===n.UNSIGNED_BYTE&&(F=n.RGBA8UI),L===n.UNSIGNED_SHORT&&(F=n.RGBA16UI),L===n.UNSIGNED_INT&&(F=n.RGBA32UI),L===n.BYTE&&(F=n.RGBA8I),L===n.SHORT&&(F=n.RGBA16I),L===n.INT&&(F=n.RGBA32I)),_===n.RGB&&(L===n.UNSIGNED_INT_5_9_9_9_REV&&(F=n.RGB9_E5),L===n.UNSIGNED_INT_10F_11F_11F_REV&&(F=n.R11F_G11F_B10F)),_===n.RGBA){const ce=j?_o:Qe.getTransfer(O);L===n.FLOAT&&(F=n.RGBA32F),L===n.HALF_FLOAT&&(F=n.RGBA16F),L===n.UNSIGNED_BYTE&&(F=ce===rt?n.SRGB8_ALPHA8:n.RGBA8),L===n.UNSIGNED_SHORT_4_4_4_4&&(F=n.RGBA4),L===n.UNSIGNED_SHORT_5_5_5_1&&(F=n.RGB5_A1)}return(F===n.R16F||F===n.R32F||F===n.RG16F||F===n.RG32F||F===n.RGBA16F||F===n.RGBA32F)&&e.get("EXT_color_buffer_float"),F}function w(y,_){let L;return y?_===null||_===Ri||_===Qr?L=n.DEPTH24_STENCIL8:_===Vn?L=n.DEPTH32F_STENCIL8:_===Zr&&(L=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Ri||_===Qr?L=n.DEPTH_COMPONENT24:_===Vn?L=n.DEPTH_COMPONENT32F:_===Zr&&(L=n.DEPTH_COMPONENT16),L}function C(y,_){return m(y)===!0||y.isFramebufferTexture&&y.minFilter!==fn&&y.minFilter!==yn?Math.log2(Math.max(_.width,_.height))+1:y.mipmaps!==void 0&&y.mipmaps.length>0?y.mipmaps.length:y.isCompressedTexture&&Array.isArray(y.image)?_.mipmaps.length:1}function T(y){const _=y.target;_.removeEventListener("dispose",T),N(_),_.isVideoTexture&&u.delete(_)}function R(y){const _=y.target;_.removeEventListener("dispose",R),b(_)}function N(y){const _=i.get(y);if(_.__webglInit===void 0)return;const L=y.source,O=d.get(L);if(O){const j=O[_.__cacheKey];j.usedTimes--,j.usedTimes===0&&E(y),Object.keys(O).length===0&&d.delete(L)}i.remove(y)}function E(y){const _=i.get(y);n.deleteTexture(_.__webglTexture);const L=y.source,O=d.get(L);delete O[_.__cacheKey],o.memory.textures--}function b(y){const _=i.get(y);if(y.depthTexture&&(y.depthTexture.dispose(),i.remove(y.depthTexture)),y.isWebGLCubeRenderTarget)for(let O=0;O<6;O++){if(Array.isArray(_.__webglFramebuffer[O]))for(let j=0;j<_.__webglFramebuffer[O].length;j++)n.deleteFramebuffer(_.__webglFramebuffer[O][j]);else n.deleteFramebuffer(_.__webglFramebuffer[O]);_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer[O])}else{if(Array.isArray(_.__webglFramebuffer))for(let O=0;O<_.__webglFramebuffer.length;O++)n.deleteFramebuffer(_.__webglFramebuffer[O]);else n.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&n.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&n.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let O=0;O<_.__webglColorRenderbuffer.length;O++)_.__webglColorRenderbuffer[O]&&n.deleteRenderbuffer(_.__webglColorRenderbuffer[O]);_.__webglDepthRenderbuffer&&n.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const L=y.textures;for(let O=0,j=L.length;O<j;O++){const F=i.get(L[O]);F.__webglTexture&&(n.deleteTexture(F.__webglTexture),o.memory.textures--),i.remove(L[O])}i.remove(y)}let I=0;function V(){I=0}function $(){const y=I;return y>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+y+" texture units while this GPU supports only "+r.maxTextures),I+=1,y}function te(y){const _=[];return _.push(y.wrapS),_.push(y.wrapT),_.push(y.wrapR||0),_.push(y.magFilter),_.push(y.minFilter),_.push(y.anisotropy),_.push(y.internalFormat),_.push(y.format),_.push(y.type),_.push(y.generateMipmaps),_.push(y.premultiplyAlpha),_.push(y.flipY),_.push(y.unpackAlignment),_.push(y.colorSpace),_.join()}function W(y,_){const L=i.get(y);if(y.isVideoTexture&&me(y),y.isRenderTargetTexture===!1&&y.isExternalTexture!==!0&&y.version>0&&L.__version!==y.version){const O=y.image;if(O===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(O.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(L,y,_);return}}else y.isExternalTexture&&(L.__webglTexture=y.sourceTexture?y.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,L.__webglTexture,n.TEXTURE0+_)}function K(y,_){const L=i.get(y);if(y.isRenderTargetTexture===!1&&y.version>0&&L.__version!==y.version){Y(L,y,_);return}t.bindTexture(n.TEXTURE_2D_ARRAY,L.__webglTexture,n.TEXTURE0+_)}function ee(y,_){const L=i.get(y);if(y.isRenderTargetTexture===!1&&y.version>0&&L.__version!==y.version){Y(L,y,_);return}t.bindTexture(n.TEXTURE_3D,L.__webglTexture,n.TEXTURE0+_)}function G(y,_){const L=i.get(y);if(y.version>0&&L.__version!==y.version){ne(L,y,_);return}t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture,n.TEXTURE0+_)}const _e={[Jr]:n.REPEAT,[wi]:n.CLAMP_TO_EDGE,[Za]:n.MIRRORED_REPEAT},we={[fn]:n.NEAREST,[Up]:n.NEAREST_MIPMAP_NEAREST,[Ss]:n.NEAREST_MIPMAP_LINEAR,[yn]:n.LINEAR,[Wo]:n.LINEAR_MIPMAP_NEAREST,[xi]:n.LINEAR_MIPMAP_LINEAR},Te={[Bp]:n.NEVER,[Wp]:n.ALWAYS,[zp]:n.LESS,[Xh]:n.LEQUAL,[Hp]:n.EQUAL,[jp]:n.GEQUAL,[Vp]:n.GREATER,[Gp]:n.NOTEQUAL};function ze(y,_){if(_.type===Vn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===yn||_.magFilter===Wo||_.magFilter===Ss||_.magFilter===xi||_.minFilter===yn||_.minFilter===Wo||_.minFilter===Ss||_.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(y,n.TEXTURE_WRAP_S,_e[_.wrapS]),n.texParameteri(y,n.TEXTURE_WRAP_T,_e[_.wrapT]),(y===n.TEXTURE_3D||y===n.TEXTURE_2D_ARRAY)&&n.texParameteri(y,n.TEXTURE_WRAP_R,_e[_.wrapR]),n.texParameteri(y,n.TEXTURE_MAG_FILTER,we[_.magFilter]),n.texParameteri(y,n.TEXTURE_MIN_FILTER,we[_.minFilter]),_.compareFunction&&(n.texParameteri(y,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(y,n.TEXTURE_COMPARE_FUNC,Te[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===fn||_.minFilter!==Ss&&_.minFilter!==xi||_.type===Vn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){const L=e.get("EXT_texture_filter_anisotropic");n.texParameterf(y,L.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function Xe(y,_){let L=!1;y.__webglInit===void 0&&(y.__webglInit=!0,_.addEventListener("dispose",T));const O=_.source;let j=d.get(O);j===void 0&&(j={},d.set(O,j));const F=te(_);if(F!==y.__cacheKey){j[F]===void 0&&(j[F]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,L=!0),j[F].usedTimes++;const ce=j[y.__cacheKey];ce!==void 0&&(j[y.__cacheKey].usedTimes--,ce.usedTimes===0&&E(_)),y.__cacheKey=F,y.__webglTexture=j[F].texture}return L}function Ye(y,_,L){return Math.floor(Math.floor(y/L)/_)}function $e(y,_,L,O){const F=y.updateRanges;if(F.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,_.width,_.height,L,O,_.data);else{F.sort((X,pe)=>X.start-pe.start);let ce=0;for(let X=1;X<F.length;X++){const pe=F[ce],Oe=F[X],Re=pe.start+pe.count,ve=Ye(Oe.start,_.width,4),Fe=Ye(pe.start,_.width,4);Oe.start<=Re+1&&ve===Fe&&Ye(Oe.start+Oe.count-1,_.width,4)===ve?pe.count=Math.max(pe.count,Oe.start+Oe.count-pe.start):(++ce,F[ce]=Oe)}F.length=ce+1;const re=n.getParameter(n.UNPACK_ROW_LENGTH),he=n.getParameter(n.UNPACK_SKIP_PIXELS),be=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,_.width);for(let X=0,pe=F.length;X<pe;X++){const Oe=F[X],Re=Math.floor(Oe.start/4),ve=Math.ceil(Oe.count/4),Fe=Re%_.width,P=Math.floor(Re/_.width),se=ve,ge=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Fe),n.pixelStorei(n.UNPACK_SKIP_ROWS,P),t.texSubImage2D(n.TEXTURE_2D,0,Fe,P,se,ge,L,O,_.data)}y.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,re),n.pixelStorei(n.UNPACK_SKIP_PIXELS,he),n.pixelStorei(n.UNPACK_SKIP_ROWS,be)}}function Y(y,_,L){let O=n.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(O=n.TEXTURE_2D_ARRAY),_.isData3DTexture&&(O=n.TEXTURE_3D);const j=Xe(y,_),F=_.source;t.bindTexture(O,y.__webglTexture,n.TEXTURE0+L);const ce=i.get(F);if(F.version!==ce.__version||j===!0){t.activeTexture(n.TEXTURE0+L);const re=Qe.getPrimaries(Qe.workingColorSpace),he=_.colorSpace===Qn?null:Qe.getPrimaries(_.colorSpace),be=_.colorSpace===Qn||re===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let X=v(_.image,!1,r.maxTextureSize);X=oe(_,X);const pe=s.convert(_.format,_.colorSpace),Oe=s.convert(_.type);let Re=S(_.internalFormat,pe,Oe,_.colorSpace,_.isVideoTexture);ze(O,_);let ve;const Fe=_.mipmaps,P=_.isVideoTexture!==!0,se=ce.__version===void 0||j===!0,ge=F.dataReady,Me=C(_,X);if(_.isDepthTexture)Re=w(_.format===ts,_.type),se&&(P?t.texStorage2D(n.TEXTURE_2D,1,Re,X.width,X.height):t.texImage2D(n.TEXTURE_2D,0,Re,X.width,X.height,0,pe,Oe,null));else if(_.isDataTexture)if(Fe.length>0){P&&se&&t.texStorage2D(n.TEXTURE_2D,Me,Re,Fe[0].width,Fe[0].height);for(let le=0,Q=Fe.length;le<Q;le++)ve=Fe[le],P?ge&&t.texSubImage2D(n.TEXTURE_2D,le,0,0,ve.width,ve.height,pe,Oe,ve.data):t.texImage2D(n.TEXTURE_2D,le,Re,ve.width,ve.height,0,pe,Oe,ve.data);_.generateMipmaps=!1}else P?(se&&t.texStorage2D(n.TEXTURE_2D,Me,Re,X.width,X.height),ge&&$e(_,X,pe,Oe)):t.texImage2D(n.TEXTURE_2D,0,Re,X.width,X.height,0,pe,Oe,X.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){P&&se&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Me,Re,Fe[0].width,Fe[0].height,X.depth);for(let le=0,Q=Fe.length;le<Q;le++)if(ve=Fe[le],_.format!==hn)if(pe!==null)if(P){if(ge)if(_.layerUpdates.size>0){const Pe=lu(ve.width,ve.height,_.format,_.type);for(const He of _.layerUpdates){const nt=ve.data.subarray(He*Pe/ve.data.BYTES_PER_ELEMENT,(He+1)*Pe/ve.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,le,0,0,He,ve.width,ve.height,1,pe,nt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,le,0,0,0,ve.width,ve.height,X.depth,pe,ve.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,le,Re,ve.width,ve.height,X.depth,0,ve.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?ge&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,le,0,0,0,ve.width,ve.height,X.depth,pe,Oe,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,le,Re,ve.width,ve.height,X.depth,0,pe,Oe,ve.data)}else{P&&se&&t.texStorage2D(n.TEXTURE_2D,Me,Re,Fe[0].width,Fe[0].height);for(let le=0,Q=Fe.length;le<Q;le++)ve=Fe[le],_.format!==hn?pe!==null?P?ge&&t.compressedTexSubImage2D(n.TEXTURE_2D,le,0,0,ve.width,ve.height,pe,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,le,Re,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?ge&&t.texSubImage2D(n.TEXTURE_2D,le,0,0,ve.width,ve.height,pe,Oe,ve.data):t.texImage2D(n.TEXTURE_2D,le,Re,ve.width,ve.height,0,pe,Oe,ve.data)}else if(_.isDataArrayTexture)if(P){if(se&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Me,Re,X.width,X.height,X.depth),ge)if(_.layerUpdates.size>0){const le=lu(X.width,X.height,_.format,_.type);for(const Q of _.layerUpdates){const Pe=X.data.subarray(Q*le/X.data.BYTES_PER_ELEMENT,(Q+1)*le/X.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,X.width,X.height,1,pe,Oe,Pe)}_.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,X.width,X.height,X.depth,pe,Oe,X.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Re,X.width,X.height,X.depth,0,pe,Oe,X.data);else if(_.isData3DTexture)P?(se&&t.texStorage3D(n.TEXTURE_3D,Me,Re,X.width,X.height,X.depth),ge&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,X.width,X.height,X.depth,pe,Oe,X.data)):t.texImage3D(n.TEXTURE_3D,0,Re,X.width,X.height,X.depth,0,pe,Oe,X.data);else if(_.isFramebufferTexture){if(se)if(P)t.texStorage2D(n.TEXTURE_2D,Me,Re,X.width,X.height);else{let le=X.width,Q=X.height;for(let Pe=0;Pe<Me;Pe++)t.texImage2D(n.TEXTURE_2D,Pe,Re,le,Q,0,pe,Oe,null),le>>=1,Q>>=1}}else if(Fe.length>0){if(P&&se){const le=B(Fe[0]);t.texStorage2D(n.TEXTURE_2D,Me,Re,le.width,le.height)}for(let le=0,Q=Fe.length;le<Q;le++)ve=Fe[le],P?ge&&t.texSubImage2D(n.TEXTURE_2D,le,0,0,pe,Oe,ve):t.texImage2D(n.TEXTURE_2D,le,Re,pe,Oe,ve);_.generateMipmaps=!1}else if(P){if(se){const le=B(X);t.texStorage2D(n.TEXTURE_2D,Me,Re,le.width,le.height)}ge&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,pe,Oe,X)}else t.texImage2D(n.TEXTURE_2D,0,Re,pe,Oe,X);m(_)&&p(O),ce.__version=F.version,_.onUpdate&&_.onUpdate(_)}y.__version=_.version}function ne(y,_,L){if(_.image.length!==6)return;const O=Xe(y,_),j=_.source;t.bindTexture(n.TEXTURE_CUBE_MAP,y.__webglTexture,n.TEXTURE0+L);const F=i.get(j);if(j.version!==F.__version||O===!0){t.activeTexture(n.TEXTURE0+L);const ce=Qe.getPrimaries(Qe.workingColorSpace),re=_.colorSpace===Qn?null:Qe.getPrimaries(_.colorSpace),he=_.colorSpace===Qn||ce===re?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,he);const be=_.isCompressedTexture||_.image[0].isCompressedTexture,X=_.image[0]&&_.image[0].isDataTexture,pe=[];for(let Q=0;Q<6;Q++)!be&&!X?pe[Q]=v(_.image[Q],!0,r.maxCubemapSize):pe[Q]=X?_.image[Q].image:_.image[Q],pe[Q]=oe(_,pe[Q]);const Oe=pe[0],Re=s.convert(_.format,_.colorSpace),ve=s.convert(_.type),Fe=S(_.internalFormat,Re,ve,_.colorSpace),P=_.isVideoTexture!==!0,se=F.__version===void 0||O===!0,ge=j.dataReady;let Me=C(_,Oe);ze(n.TEXTURE_CUBE_MAP,_);let le;if(be){P&&se&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,Fe,Oe.width,Oe.height);for(let Q=0;Q<6;Q++){le=pe[Q].mipmaps;for(let Pe=0;Pe<le.length;Pe++){const He=le[Pe];_.format!==hn?Re!==null?P?ge&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe,0,0,He.width,He.height,Re,He.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe,Fe,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?ge&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe,0,0,He.width,He.height,Re,ve,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe,Fe,He.width,He.height,0,Re,ve,He.data)}}}else{if(le=_.mipmaps,P&&se){le.length>0&&Me++;const Q=B(pe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Me,Fe,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(X){P?ge&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,pe[Q].width,pe[Q].height,Re,ve,pe[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Fe,pe[Q].width,pe[Q].height,0,Re,ve,pe[Q].data);for(let Pe=0;Pe<le.length;Pe++){const nt=le[Pe].image[Q].image;P?ge&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe+1,0,0,nt.width,nt.height,Re,ve,nt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe+1,Fe,nt.width,nt.height,0,Re,ve,nt.data)}}else{P?ge&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Re,ve,pe[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Fe,Re,ve,pe[Q]);for(let Pe=0;Pe<le.length;Pe++){const He=le[Pe];P?ge&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe+1,0,0,Re,ve,He.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Pe+1,Fe,Re,ve,He.image[Q])}}}m(_)&&p(n.TEXTURE_CUBE_MAP),F.__version=j.version,_.onUpdate&&_.onUpdate(_)}y.__version=_.version}function Se(y,_,L,O,j,F){const ce=s.convert(L.format,L.colorSpace),re=s.convert(L.type),he=S(L.internalFormat,ce,re,L.colorSpace),be=i.get(_),X=i.get(L);if(X.__renderTarget=_,!be.__hasExternalTextures){const pe=Math.max(1,_.width>>F),Oe=Math.max(1,_.height>>F);j===n.TEXTURE_3D||j===n.TEXTURE_2D_ARRAY?t.texImage3D(j,F,he,pe,Oe,_.depth,0,ce,re,null):t.texImage2D(j,F,he,pe,Oe,0,ce,re,null)}t.bindFramebuffer(n.FRAMEBUFFER,y),ae(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,O,j,X.__webglTexture,0,de(_)):(j===n.TEXTURE_2D||j>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,O,j,X.__webglTexture,F),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(y,_,L){if(n.bindRenderbuffer(n.RENDERBUFFER,y),_.depthBuffer){const O=_.depthTexture,j=O&&O.isDepthTexture?O.type:null,F=w(_.stencilBuffer,j),ce=_.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,re=de(_);ae(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,re,F,_.width,_.height):L?n.renderbufferStorageMultisample(n.RENDERBUFFER,re,F,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,F,_.width,_.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ce,n.RENDERBUFFER,y)}else{const O=_.textures;for(let j=0;j<O.length;j++){const F=O[j],ce=s.convert(F.format,F.colorSpace),re=s.convert(F.type),he=S(F.internalFormat,ce,re,F.colorSpace),be=de(_);L&&ae(_)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,be,he,_.width,_.height):ae(_)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,be,he,_.width,_.height):n.renderbufferStorage(n.RENDERBUFFER,he,_.width,_.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ie(y,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,y),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const O=i.get(_.depthTexture);O.__renderTarget=_,(!O.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),W(_.depthTexture,0);const j=O.__webglTexture,F=de(_);if(_.depthTexture.format===es)ae(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0,F):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,j,0);else if(_.depthTexture.format===ts)ae(_)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0,F):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function qe(y){const _=i.get(y),L=y.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==y.depthTexture){const O=y.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),O){const j=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,O.removeEventListener("dispose",j)};O.addEventListener("dispose",j),_.__depthDisposeCallback=j}_.__boundDepthTexture=O}if(y.depthTexture&&!_.__autoAllocateDepthBuffer){if(L)throw new Error("target.depthTexture not supported in Cube render targets");const O=y.texture.mipmaps;O&&O.length>0?Ie(_.__webglFramebuffer[0],y):Ie(_.__webglFramebuffer,y)}else if(L){_.__webglDepthbuffer=[];for(let O=0;O<6;O++)if(t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[O]),_.__webglDepthbuffer[O]===void 0)_.__webglDepthbuffer[O]=n.createRenderbuffer(),De(_.__webglDepthbuffer[O],y,!1);else{const j=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,F=_.__webglDepthbuffer[O];n.bindRenderbuffer(n.RENDERBUFFER,F),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,F)}}else{const O=y.texture.mipmaps;if(O&&O.length>0?t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=n.createRenderbuffer(),De(_.__webglDepthbuffer,y,!1);else{const j=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,F=_.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,F),n.framebufferRenderbuffer(n.FRAMEBUFFER,j,n.RENDERBUFFER,F)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function tt(y,_,L){const O=i.get(y);_!==void 0&&Se(O.__webglFramebuffer,y,y.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),L!==void 0&&qe(y)}function A(y){const _=y.texture,L=i.get(y),O=i.get(_);y.addEventListener("dispose",R);const j=y.textures,F=y.isWebGLCubeRenderTarget===!0,ce=j.length>1;if(ce||(O.__webglTexture===void 0&&(O.__webglTexture=n.createTexture()),O.__version=_.version,o.memory.textures++),F){L.__webglFramebuffer=[];for(let re=0;re<6;re++)if(_.mipmaps&&_.mipmaps.length>0){L.__webglFramebuffer[re]=[];for(let he=0;he<_.mipmaps.length;he++)L.__webglFramebuffer[re][he]=n.createFramebuffer()}else L.__webglFramebuffer[re]=n.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){L.__webglFramebuffer=[];for(let re=0;re<_.mipmaps.length;re++)L.__webglFramebuffer[re]=n.createFramebuffer()}else L.__webglFramebuffer=n.createFramebuffer();if(ce)for(let re=0,he=j.length;re<he;re++){const be=i.get(j[re]);be.__webglTexture===void 0&&(be.__webglTexture=n.createTexture(),o.memory.textures++)}if(y.samples>0&&ae(y)===!1){L.__webglMultisampledFramebuffer=n.createFramebuffer(),L.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,L.__webglMultisampledFramebuffer);for(let re=0;re<j.length;re++){const he=j[re];L.__webglColorRenderbuffer[re]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,L.__webglColorRenderbuffer[re]);const be=s.convert(he.format,he.colorSpace),X=s.convert(he.type),pe=S(he.internalFormat,be,X,he.colorSpace,y.isXRRenderTarget===!0),Oe=de(y);n.renderbufferStorageMultisample(n.RENDERBUFFER,Oe,pe,y.width,y.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+re,n.RENDERBUFFER,L.__webglColorRenderbuffer[re])}n.bindRenderbuffer(n.RENDERBUFFER,null),y.depthBuffer&&(L.__webglDepthRenderbuffer=n.createRenderbuffer(),De(L.__webglDepthRenderbuffer,y,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(F){t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture),ze(n.TEXTURE_CUBE_MAP,_);for(let re=0;re<6;re++)if(_.mipmaps&&_.mipmaps.length>0)for(let he=0;he<_.mipmaps.length;he++)Se(L.__webglFramebuffer[re][he],y,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,he);else Se(L.__webglFramebuffer[re],y,_,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);m(_)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ce){for(let re=0,he=j.length;re<he;re++){const be=j[re],X=i.get(be);let pe=n.TEXTURE_2D;(y.isWebGL3DRenderTarget||y.isWebGLArrayRenderTarget)&&(pe=y.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(pe,X.__webglTexture),ze(pe,be),Se(L.__webglFramebuffer,y,be,n.COLOR_ATTACHMENT0+re,pe,0),m(be)&&p(pe)}t.unbindTexture()}else{let re=n.TEXTURE_2D;if((y.isWebGL3DRenderTarget||y.isWebGLArrayRenderTarget)&&(re=y.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(re,O.__webglTexture),ze(re,_),_.mipmaps&&_.mipmaps.length>0)for(let he=0;he<_.mipmaps.length;he++)Se(L.__webglFramebuffer[he],y,_,n.COLOR_ATTACHMENT0,re,he);else Se(L.__webglFramebuffer,y,_,n.COLOR_ATTACHMENT0,re,0);m(_)&&p(re),t.unbindTexture()}y.depthBuffer&&qe(y)}function ie(y){const _=y.textures;for(let L=0,O=_.length;L<O;L++){const j=_[L];if(m(j)){const F=M(y),ce=i.get(j).__webglTexture;t.bindTexture(F,ce),p(F),t.unbindTexture()}}}const q=[],J=[];function Z(y){if(y.samples>0){if(ae(y)===!1){const _=y.textures,L=y.width,O=y.height;let j=n.COLOR_BUFFER_BIT;const F=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ce=i.get(y),re=_.length>1;if(re)for(let be=0;be<_.length;be++)t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer);const he=y.texture.mipmaps;he&&he.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let be=0;be<_.length;be++){if(y.resolveDepthBuffer&&(y.depthBuffer&&(j|=n.DEPTH_BUFFER_BIT),y.stencilBuffer&&y.resolveStencilBuffer&&(j|=n.STENCIL_BUFFER_BIT)),re){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ce.__webglColorRenderbuffer[be]);const X=i.get(_[be]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,X,0)}n.blitFramebuffer(0,0,L,O,0,0,L,O,j,n.NEAREST),l===!0&&(q.length=0,J.length=0,q.push(n.COLOR_ATTACHMENT0+be),y.depthBuffer&&y.resolveDepthBuffer===!1&&(q.push(F),J.push(F),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,J)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,q))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),re)for(let be=0;be<_.length;be++){t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.RENDERBUFFER,ce.__webglColorRenderbuffer[be]);const X=i.get(_[be]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ce.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+be,n.TEXTURE_2D,X,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(y.depthBuffer&&y.resolveDepthBuffer===!1&&l){const _=y.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[_])}}}function de(y){return Math.min(r.maxSamples,y.samples)}function ae(y){const _=i.get(y);return y.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function me(y){const _=o.render.frame;u.get(y)!==_&&(u.set(y,_),y.update())}function oe(y,_){const L=y.colorSpace,O=y.format,j=y.type;return y.isCompressedTexture===!0||y.isVideoTexture===!0||L!==Sr&&L!==Qn&&(Qe.getTransfer(L)===rt?(O!==hn||j!==xn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",L)),_}function B(y){return typeof HTMLImageElement<"u"&&y instanceof HTMLImageElement?(c.width=y.naturalWidth||y.width,c.height=y.naturalHeight||y.height):typeof VideoFrame<"u"&&y instanceof VideoFrame?(c.width=y.displayWidth,c.height=y.displayHeight):(c.width=y.width,c.height=y.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=V,this.setTexture2D=W,this.setTexture2DArray=K,this.setTexture3D=ee,this.setTextureCube=G,this.rebindTextures=tt,this.setupRenderTarget=A,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=qe,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=ae}function j0(n,e){function t(i,r=Qn){let s;const o=Qe.getTransfer(r);if(i===xn)return n.UNSIGNED_BYTE;if(i===Jl)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Zl)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Hh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Vh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Bh)return n.BYTE;if(i===zh)return n.SHORT;if(i===Zr)return n.UNSIGNED_SHORT;if(i===Yl)return n.INT;if(i===Ri)return n.UNSIGNED_INT;if(i===Vn)return n.FLOAT;if(i===ps)return n.HALF_FLOAT;if(i===Gh)return n.ALPHA;if(i===jh)return n.RGB;if(i===hn)return n.RGBA;if(i===es)return n.DEPTH_COMPONENT;if(i===ts)return n.DEPTH_STENCIL;if(i===Wh)return n.RED;if(i===Ql)return n.RED_INTEGER;if(i===$h)return n.RG;if(i===ec)return n.RG_INTEGER;if(i===tc)return n.RGBA_INTEGER;if(i===ao||i===lo||i===co||i===uo)if(o===rt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ao)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===lo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===co)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===uo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ao)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===lo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===co)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===uo)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Qa||i===el||i===tl||i===nl)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Qa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===el)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===tl)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===nl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===il||i===rl||i===sl)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===il||i===rl)return o===rt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===sl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===ol||i===al||i===ll||i===cl||i===ul||i===hl||i===dl||i===fl||i===pl||i===ml||i===gl||i===_l||i===vl||i===yl)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===ol)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===al)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ll)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===cl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ul)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===hl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===dl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===fl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===pl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ml)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===gl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===_l)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===vl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===yl)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Sl||i===wl||i===xl)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Sl)return o===rt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wl)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===xl)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===bl||i===El||i===Ml||i===Tl)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===bl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===El)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Ml)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Tl)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Qr?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const W0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,$0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class q0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new od(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new oi({vertexShader:W0,fragmentShader:$0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new dn(new gs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class X0 extends Li{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new q0,p={},M=t.getContextAttributes();let S=null,w=null;const C=[],T=[],R=new fe;let N=null;const E=new Zt;E.viewport=new mt;const b=new Zt;b.viewport=new mt;const I=[E,b],V=new fg;let $=null,te=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ne=C[Y];return ne===void 0&&(ne=new fa,C[Y]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Y){let ne=C[Y];return ne===void 0&&(ne=new fa,C[Y]=ne),ne.getGripSpace()},this.getHand=function(Y){let ne=C[Y];return ne===void 0&&(ne=new fa,C[Y]=ne),ne.getHandSpace()};function W(Y){const ne=T.indexOf(Y.inputSource);if(ne===-1)return;const Se=C[ne];Se!==void 0&&(Se.update(Y.inputSource,Y.frame,c||o),Se.dispatchEvent({type:Y.type,data:Y.inputSource}))}function K(){r.removeEventListener("select",W),r.removeEventListener("selectstart",W),r.removeEventListener("selectend",W),r.removeEventListener("squeeze",W),r.removeEventListener("squeezestart",W),r.removeEventListener("squeezeend",W),r.removeEventListener("end",K),r.removeEventListener("inputsourceschange",ee);for(let Y=0;Y<C.length;Y++){const ne=T[Y];ne!==null&&(T[Y]=null,C[Y].disconnect(ne))}$=null,te=null,m.reset();for(const Y in p)delete p[Y];e.setRenderTarget(S),f=null,d=null,h=null,r=null,w=null,$e.stop(),i.isPresenting=!1,e.setPixelRatio(N),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(r,t)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(S=e.getRenderTarget(),r.addEventListener("select",W),r.addEventListener("selectstart",W),r.addEventListener("selectend",W),r.addEventListener("squeeze",W),r.addEventListener("squeezestart",W),r.addEventListener("squeezeend",W),r.addEventListener("end",K),r.addEventListener("inputsourceschange",ee),M.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,De=null,Ie=null;M.depth&&(Ie=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=M.stencil?ts:es,De=M.stencil?Qr:Ri);const qe={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(qe),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),w=new Pi(d.textureWidth,d.textureHeight,{format:hn,type:xn,depthTexture:new sd(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Se={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,Se),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),w=new Pi(f.framebufferWidth,f.framebufferHeight,{format:hn,type:xn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),$e.setContext(r),$e.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ee(Y){for(let ne=0;ne<Y.removed.length;ne++){const Se=Y.removed[ne],De=T.indexOf(Se);De>=0&&(T[De]=null,C[De].disconnect(Se))}for(let ne=0;ne<Y.added.length;ne++){const Se=Y.added[ne];let De=T.indexOf(Se);if(De===-1){for(let qe=0;qe<C.length;qe++)if(qe>=T.length){T.push(Se),De=qe;break}else if(T[qe]===null){T[qe]=Se,De=qe;break}if(De===-1)break}const Ie=C[De];Ie&&Ie.connect(Se)}}const G=new D,_e=new D;function we(Y,ne,Se){G.setFromMatrixPosition(ne.matrixWorld),_e.setFromMatrixPosition(Se.matrixWorld);const De=G.distanceTo(_e),Ie=ne.projectionMatrix.elements,qe=Se.projectionMatrix.elements,tt=Ie[14]/(Ie[10]-1),A=Ie[14]/(Ie[10]+1),ie=(Ie[9]+1)/Ie[5],q=(Ie[9]-1)/Ie[5],J=(Ie[8]-1)/Ie[0],Z=(qe[8]+1)/qe[0],de=tt*J,ae=tt*Z,me=De/(-J+Z),oe=me*-J;if(ne.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(oe),Y.translateZ(me),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Ie[10]===-1)Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const B=tt+me,y=A+me,_=de-oe,L=ae+(De-oe),O=ie*A/y*B,j=q*A/y*B;Y.projectionMatrix.makePerspective(_,L,O,j,B,y),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Te(Y,ne){ne===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ne.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let ne=Y.near,Se=Y.far;m.texture!==null&&(m.depthNear>0&&(ne=m.depthNear),m.depthFar>0&&(Se=m.depthFar)),V.near=b.near=E.near=ne,V.far=b.far=E.far=Se,($!==V.near||te!==V.far)&&(r.updateRenderState({depthNear:V.near,depthFar:V.far}),$=V.near,te=V.far),V.layers.mask=Y.layers.mask|6,E.layers.mask=V.layers.mask&3,b.layers.mask=V.layers.mask&5;const De=Y.parent,Ie=V.cameras;Te(V,De);for(let qe=0;qe<Ie.length;qe++)Te(Ie[qe],De);Ie.length===2?we(V,E,b):V.projectionMatrix.copy(E.projectionMatrix),ze(Y,V,De)};function ze(Y,ne,Se){Se===null?Y.matrix.copy(ne.matrixWorld):(Y.matrix.copy(Se.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ne.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Al*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(V)},this.getCameraTexture=function(Y){return p[Y]};let Xe=null;function Ye(Y,ne){if(u=ne.getViewerPose(c||o),g=ne,u!==null){const Se=u.views;f!==null&&(e.setRenderTargetFramebuffer(w,f.framebuffer),e.setRenderTarget(w));let De=!1;Se.length!==V.cameras.length&&(V.cameras.length=0,De=!0);for(let A=0;A<Se.length;A++){const ie=Se[A];let q=null;if(f!==null)q=f.getViewport(ie);else{const Z=h.getViewSubImage(d,ie);q=Z.viewport,A===0&&(e.setRenderTargetTextures(w,Z.colorTexture,Z.depthStencilTexture),e.setRenderTarget(w))}let J=I[A];J===void 0&&(J=new Zt,J.layers.enable(A),J.viewport=new mt,I[A]=J),J.matrix.fromArray(ie.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(ie.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(q.x,q.y,q.width,q.height),A===0&&(V.matrix.copy(J.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),De===!0&&V.cameras.push(J)}const Ie=r.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const A=h.getDepthInformation(Se[0]);A&&A.isValid&&A.texture&&m.init(A,r.renderState)}if(Ie&&Ie.includes("camera-access")&&v){e.state.unbindTexture(),h=i.getBinding();for(let A=0;A<Se.length;A++){const ie=Se[A].camera;if(ie){let q=p[ie];q||(q=new od,p[ie]=q);const J=h.getCameraImage(ie);q.sourceTexture=J}}}}for(let Se=0;Se<C.length;Se++){const De=T[Se],Ie=C[Se];De!==null&&Ie!==void 0&&Ie.update(De,ne,c||o)}Xe&&Xe(Y,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),g=null}const $e=new vd;$e.setAnimationLoop(Ye),this.setAnimationLoop=function(Y){Xe=Y},this.dispose=function(){}}}const pi=new bn,K0=new ct;function Y0(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,td(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,M,S,w){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),h(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p)):p.isMeshStandardMaterial?(s(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,w)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),v(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ht&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ht&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=e.get(p),S=M.envMap,w=M.envMapRotation;S&&(m.envMap.value=S,pi.copy(w),pi.x*=-1,pi.y*=-1,pi.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),m.envMapRotation.value.setFromMatrix4(K0.makeRotationFromEuler(pi)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=S*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ht&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function J0(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,S){const w=S.program;i.uniformBlockBinding(M,w)}function c(M,S){let w=r[M.id];w===void 0&&(g(M),w=u(M),r[M.id]=w,M.addEventListener("dispose",m));const C=S.program;i.updateUBOMapping(M,C);const T=e.render.frame;s[M.id]!==T&&(d(M),s[M.id]=T)}function u(M){const S=h();M.__bindingPointIndex=S;const w=n.createBuffer(),C=M.__size,T=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,w),n.bufferData(n.UNIFORM_BUFFER,C,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,w),w}function h(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const S=r[M.id],w=M.uniforms,C=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let T=0,R=w.length;T<R;T++){const N=Array.isArray(w[T])?w[T]:[w[T]];for(let E=0,b=N.length;E<b;E++){const I=N[E];if(f(I,T,E,C)===!0){const V=I.__offset,$=Array.isArray(I.value)?I.value:[I.value];let te=0;for(let W=0;W<$.length;W++){const K=$[W],ee=v(K);typeof K=="number"||typeof K=="boolean"?(I.__data[0]=K,n.bufferSubData(n.UNIFORM_BUFFER,V+te,I.__data)):K.isMatrix3?(I.__data[0]=K.elements[0],I.__data[1]=K.elements[1],I.__data[2]=K.elements[2],I.__data[3]=0,I.__data[4]=K.elements[3],I.__data[5]=K.elements[4],I.__data[6]=K.elements[5],I.__data[7]=0,I.__data[8]=K.elements[6],I.__data[9]=K.elements[7],I.__data[10]=K.elements[8],I.__data[11]=0):(K.toArray(I.__data,te),te+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,I.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,S,w,C){const T=M.value,R=S+"_"+w;if(C[R]===void 0)return typeof T=="number"||typeof T=="boolean"?C[R]=T:C[R]=T.clone(),!0;{const N=C[R];if(typeof T=="number"||typeof T=="boolean"){if(N!==T)return C[R]=T,!0}else if(N.equals(T)===!1)return N.copy(T),!0}return!1}function g(M){const S=M.uniforms;let w=0;const C=16;for(let R=0,N=S.length;R<N;R++){const E=Array.isArray(S[R])?S[R]:[S[R]];for(let b=0,I=E.length;b<I;b++){const V=E[b],$=Array.isArray(V.value)?V.value:[V.value];for(let te=0,W=$.length;te<W;te++){const K=$[te],ee=v(K),G=w%C,_e=G%ee.boundary,we=G+_e;w+=_e,we!==0&&C-we<ee.storage&&(w+=C-we),V.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=w,w+=ee.storage}}}const T=w%C;return T>0&&(w+=C-T),M.__size=w,M.__cache={},this}function v(M){const S={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(S.boundary=4,S.storage=4):M.isVector2?(S.boundary=8,S.storage=8):M.isVector3||M.isColor?(S.boundary=16,S.storage=12):M.isVector4?(S.boundary=16,S.storage=16):M.isMatrix3?(S.boundary=48,S.storage=48):M.isMatrix4?(S.boundary=64,S.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),S}function m(M){const S=M.target;S.removeEventListener("dispose",m);const w=o.indexOf(S.__bindingPointIndex);o.splice(w,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function p(){for(const M in r)n.deleteBuffer(r[M]);o=[],r={},s={}}return{bind:l,update:c,dispose:p}}class Z0{constructor(e={}){const{canvas:t=Xp(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const M=[],S=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const w=this;let C=!1;this._outputColorSpace=Bt;let T=0,R=0,N=null,E=-1,b=null;const I=new mt,V=new mt;let $=null;const te=new Je(0);let W=0,K=t.width,ee=t.height,G=1,_e=null,we=null;const Te=new mt(0,0,K,ee),ze=new mt(0,0,K,ee);let Xe=!1;const Ye=new rc;let $e=!1,Y=!1;const ne=new ct,Se=new D,De=new mt,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let qe=!1;function tt(){return N===null?G:1}let A=i;function ie(x,U){return t.getContext(x,U)}try{const x={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Kl}`),t.addEventListener("webglcontextlost",ge,!1),t.addEventListener("webglcontextrestored",Me,!1),t.addEventListener("webglcontextcreationerror",le,!1),A===null){const U="webgl2";if(A=ie(U,x),A===null)throw ie(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let q,J,Z,de,ae,me,oe,B,y,_,L,O,j,F,ce,re,he,be,X,pe,Oe,Re,ve,Fe;function P(){q=new ly(A),q.init(),Re=new j0(A,q),J=new ty(A,q,e,Re),Z=new V0(A,q),J.reversedDepthBuffer&&d&&Z.buffers.depth.setReversed(!0),de=new hy(A),ae=new C0,me=new G0(A,q,Z,ae,J,Re,de),oe=new iy(w),B=new ay(w),y=new _g(A),ve=new Qv(A,y),_=new cy(A,y,de,ve),L=new fy(A,_,y,de),X=new dy(A,J,me),re=new ny(ae),O=new R0(w,oe,B,q,J,ve,re),j=new Y0(w,ae),F=new I0,ce=new k0(q),be=new Zv(w,oe,B,Z,L,f,l),he=new z0(w,L,J),Fe=new J0(A,de,J,Z),pe=new ey(A,q,de),Oe=new uy(A,q,de),de.programs=O.programs,w.capabilities=J,w.extensions=q,w.properties=ae,w.renderLists=F,w.shadowMap=he,w.state=Z,w.info=de}P();const se=new X0(w,A);this.xr=se,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const x=q.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){const x=q.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(x){x!==void 0&&(G=x,this.setSize(K,ee,!1))},this.getSize=function(x){return x.set(K,ee)},this.setSize=function(x,U,z=!0){if(se.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=x,ee=U,t.width=Math.floor(x*G),t.height=Math.floor(U*G),z===!0&&(t.style.width=x+"px",t.style.height=U+"px"),this.setViewport(0,0,x,U)},this.getDrawingBufferSize=function(x){return x.set(K*G,ee*G).floor()},this.setDrawingBufferSize=function(x,U,z){K=x,ee=U,G=z,t.width=Math.floor(x*z),t.height=Math.floor(U*z),this.setViewport(0,0,x,U)},this.getCurrentViewport=function(x){return x.copy(I)},this.getViewport=function(x){return x.copy(Te)},this.setViewport=function(x,U,z,H){x.isVector4?Te.set(x.x,x.y,x.z,x.w):Te.set(x,U,z,H),Z.viewport(I.copy(Te).multiplyScalar(G).round())},this.getScissor=function(x){return x.copy(ze)},this.setScissor=function(x,U,z,H){x.isVector4?ze.set(x.x,x.y,x.z,x.w):ze.set(x,U,z,H),Z.scissor(V.copy(ze).multiplyScalar(G).round())},this.getScissorTest=function(){return Xe},this.setScissorTest=function(x){Z.setScissorTest(Xe=x)},this.setOpaqueSort=function(x){_e=x},this.setTransparentSort=function(x){we=x},this.getClearColor=function(x){return x.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(x=!0,U=!0,z=!0){let H=0;if(x){let k=!1;if(N!==null){const ue=N.texture.format;k=ue===tc||ue===ec||ue===Ql}if(k){const ue=N.texture.type,Ee=ue===xn||ue===Ri||ue===Zr||ue===Qr||ue===Jl||ue===Zl,Le=be.getClearColor(),Ce=be.getClearAlpha(),Be=Le.r,Ve=Le.g,Ne=Le.b;Ee?(g[0]=Be,g[1]=Ve,g[2]=Ne,g[3]=Ce,A.clearBufferuiv(A.COLOR,0,g)):(v[0]=Be,v[1]=Ve,v[2]=Ne,v[3]=Ce,A.clearBufferiv(A.COLOR,0,v))}else H|=A.COLOR_BUFFER_BIT}U&&(H|=A.DEPTH_BUFFER_BIT),z&&(H|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ge,!1),t.removeEventListener("webglcontextrestored",Me,!1),t.removeEventListener("webglcontextcreationerror",le,!1),be.dispose(),F.dispose(),ce.dispose(),ae.dispose(),oe.dispose(),B.dispose(),L.dispose(),ve.dispose(),Fe.dispose(),O.dispose(),se.dispose(),se.removeEventListener("sessionstart",pn),se.removeEventListener("sessionend",pc),ai.stop()};function ge(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function Me(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const x=de.autoReset,U=he.enabled,z=he.autoUpdate,H=he.needsUpdate,k=he.type;P(),de.autoReset=x,he.enabled=U,he.autoUpdate=z,he.needsUpdate=H,he.type=k}function le(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function Q(x){const U=x.target;U.removeEventListener("dispose",Q),Pe(U)}function Pe(x){He(x),ae.remove(x)}function He(x){const U=ae.get(x).programs;U!==void 0&&(U.forEach(function(z){O.releaseProgram(z)}),x.isShaderMaterial&&O.releaseShaderCache(x))}this.renderBufferDirect=function(x,U,z,H,k,ue){U===null&&(U=Ie);const Ee=k.isMesh&&k.matrixWorld.determinant()<0,Le=of(x,U,z,H,k);Z.setMaterial(H,Ee);let Ce=z.index,Be=1;if(H.wireframe===!0){if(Ce=_.getWireframeAttribute(z),Ce===void 0)return;Be=2}const Ve=z.drawRange,Ne=z.attributes.position;let Ke=Ve.start*Be,it=(Ve.start+Ve.count)*Be;ue!==null&&(Ke=Math.max(Ke,ue.start*Be),it=Math.min(it,(ue.start+ue.count)*Be)),Ce!==null?(Ke=Math.max(Ke,0),it=Math.min(it,Ce.count)):Ne!=null&&(Ke=Math.max(Ke,0),it=Math.min(it,Ne.count));const ft=it-Ke;if(ft<0||ft===1/0)return;ve.setup(k,H,Le,z,Ce);let lt,ot=pe;if(Ce!==null&&(lt=y.get(Ce),ot=Oe,ot.setIndex(lt)),k.isMesh)H.wireframe===!0?(Z.setLineWidth(H.wireframeLinewidth*tt()),ot.setMode(A.LINES)):ot.setMode(A.TRIANGLES);else if(k.isLine){let ke=H.linewidth;ke===void 0&&(ke=1),Z.setLineWidth(ke*tt()),k.isLineSegments?ot.setMode(A.LINES):k.isLineLoop?ot.setMode(A.LINE_LOOP):ot.setMode(A.LINE_STRIP)}else k.isPoints?ot.setMode(A.POINTS):k.isSprite&&ot.setMode(A.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)ns("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ot.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(q.get("WEBGL_multi_draw"))ot.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const ke=k._multiDrawStarts,ut=k._multiDrawCounts,Ze=k._multiDrawCount,Vt=Ce?y.get(Ce).bytesPerElement:1,Di=ae.get(H).currentProgram.getUniforms();for(let Gt=0;Gt<Ze;Gt++)Di.setValue(A,"_gl_DrawID",Gt),ot.render(ke[Gt]/Vt,ut[Gt])}else if(k.isInstancedMesh)ot.renderInstances(Ke,ft,k.count);else if(z.isInstancedBufferGeometry){const ke=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,ut=Math.min(z.instanceCount,ke);ot.renderInstances(Ke,ft,ut)}else ot.render(Ke,ft)};function nt(x,U,z){x.transparent===!0&&x.side===cn&&x.forceSinglePass===!1?(x.side=Ht,x.needsUpdate=!0,ys(x,U,z),x.side=si,x.needsUpdate=!0,ys(x,U,z),x.side=cn):ys(x,U,z)}this.compile=function(x,U,z=null){z===null&&(z=x),p=ce.get(z),p.init(U),S.push(p),z.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),x!==z&&x.traverseVisible(function(k){k.isLight&&k.layers.test(U.layers)&&(p.pushLight(k),k.castShadow&&p.pushShadow(k))}),p.setupLights();const H=new Set;return x.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ue=k.material;if(ue)if(Array.isArray(ue))for(let Ee=0;Ee<ue.length;Ee++){const Le=ue[Ee];nt(Le,z,k),H.add(Le)}else nt(ue,z,k),H.add(ue)}),p=S.pop(),H},this.compileAsync=function(x,U,z=null){const H=this.compile(x,U,z);return new Promise(k=>{function ue(){if(H.forEach(function(Ee){ae.get(Ee).currentProgram.isReady()&&H.delete(Ee)}),H.size===0){k(x);return}setTimeout(ue,10)}q.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let et=null;function An(x){et&&et(x)}function pn(){ai.stop()}function pc(){ai.start()}const ai=new vd;ai.setAnimationLoop(An),typeof self<"u"&&ai.setContext(self),this.setAnimationLoop=function(x){et=x,se.setAnimationLoop(x),x===null?ai.stop():ai.start()},se.addEventListener("sessionstart",pn),se.addEventListener("sessionend",pc),this.render=function(x,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),se.enabled===!0&&se.isPresenting===!0&&(se.cameraAutoUpdate===!0&&se.updateCamera(U),U=se.getCamera()),x.isScene===!0&&x.onBeforeRender(w,x,U,N),p=ce.get(x,S.length),p.init(U),S.push(p),ne.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ye.setFromProjectionMatrix(ne,Sn,U.reversedDepth),Y=this.localClippingEnabled,$e=re.init(this.clippingPlanes,Y),m=F.get(x,M.length),m.init(),M.push(m),se.enabled===!0&&se.isPresenting===!0){const ue=w.xr.getDepthSensingMesh();ue!==null&&Go(ue,U,-1/0,w.sortObjects)}Go(x,U,0,w.sortObjects),m.finish(),w.sortObjects===!0&&m.sort(_e,we),qe=se.enabled===!1||se.isPresenting===!1||se.hasDepthSensing()===!1,qe&&be.addToRenderList(m,x),this.info.render.frame++,$e===!0&&re.beginShadows();const z=p.state.shadowsArray;he.render(z,x,U),$e===!0&&re.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,k=m.transmissive;if(p.setupLights(),U.isArrayCamera){const ue=U.cameras;if(k.length>0)for(let Ee=0,Le=ue.length;Ee<Le;Ee++){const Ce=ue[Ee];gc(H,k,x,Ce)}qe&&be.render(x);for(let Ee=0,Le=ue.length;Ee<Le;Ee++){const Ce=ue[Ee];mc(m,x,Ce,Ce.viewport)}}else k.length>0&&gc(H,k,x,U),qe&&be.render(x),mc(m,x,U);N!==null&&R===0&&(me.updateMultisampleRenderTarget(N),me.updateRenderTargetMipmap(N)),x.isScene===!0&&x.onAfterRender(w,x,U),ve.resetDefaultState(),E=-1,b=null,S.pop(),S.length>0?(p=S[S.length-1],$e===!0&&re.setGlobalState(w.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?m=M[M.length-1]:m=null};function Go(x,U,z,H){if(x.visible===!1)return;if(x.layers.test(U.layers)){if(x.isGroup)z=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(U);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||Ye.intersectsSprite(x)){H&&De.setFromMatrixPosition(x.matrixWorld).applyMatrix4(ne);const Ee=L.update(x),Le=x.material;Le.visible&&m.push(x,Ee,Le,z,De.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||Ye.intersectsObject(x))){const Ee=L.update(x),Le=x.material;if(H&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),De.copy(x.boundingSphere.center)):(Ee.boundingSphere===null&&Ee.computeBoundingSphere(),De.copy(Ee.boundingSphere.center)),De.applyMatrix4(x.matrixWorld).applyMatrix4(ne)),Array.isArray(Le)){const Ce=Ee.groups;for(let Be=0,Ve=Ce.length;Be<Ve;Be++){const Ne=Ce[Be],Ke=Le[Ne.materialIndex];Ke&&Ke.visible&&m.push(x,Ee,Ke,z,De.z,Ne)}}else Le.visible&&m.push(x,Ee,Le,z,De.z,null)}}const ue=x.children;for(let Ee=0,Le=ue.length;Ee<Le;Ee++)Go(ue[Ee],U,z,H)}function mc(x,U,z,H){const k=x.opaque,ue=x.transmissive,Ee=x.transparent;p.setupLightsView(z),$e===!0&&re.setGlobalState(w.clippingPlanes,z),H&&Z.viewport(I.copy(H)),k.length>0&&vs(k,U,z),ue.length>0&&vs(ue,U,z),Ee.length>0&&vs(Ee,U,z),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function gc(x,U,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[H.id]===void 0&&(p.state.transmissionRenderTarget[H.id]=new Pi(1,1,{generateMipmaps:!0,type:q.has("EXT_color_buffer_half_float")||q.has("EXT_color_buffer_float")?ps:xn,minFilter:xi,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Qe.workingColorSpace}));const ue=p.state.transmissionRenderTarget[H.id],Ee=H.viewport||I;ue.setSize(Ee.z*w.transmissionResolutionScale,Ee.w*w.transmissionResolutionScale);const Le=w.getRenderTarget(),Ce=w.getActiveCubeFace(),Be=w.getActiveMipmapLevel();w.setRenderTarget(ue),w.getClearColor(te),W=w.getClearAlpha(),W<1&&w.setClearColor(16777215,.5),w.clear(),qe&&be.render(z);const Ve=w.toneMapping;w.toneMapping=ri;const Ne=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),p.setupLightsView(H),$e===!0&&re.setGlobalState(w.clippingPlanes,H),vs(x,z,H),me.updateMultisampleRenderTarget(ue),me.updateRenderTargetMipmap(ue),q.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let it=0,ft=U.length;it<ft;it++){const lt=U[it],ot=lt.object,ke=lt.geometry,ut=lt.material,Ze=lt.group;if(ut.side===cn&&ot.layers.test(H.layers)){const Vt=ut.side;ut.side=Ht,ut.needsUpdate=!0,_c(ot,z,H,ke,ut,Ze),ut.side=Vt,ut.needsUpdate=!0,Ke=!0}}Ke===!0&&(me.updateMultisampleRenderTarget(ue),me.updateRenderTargetMipmap(ue))}w.setRenderTarget(Le,Ce,Be),w.setClearColor(te,W),Ne!==void 0&&(H.viewport=Ne),w.toneMapping=Ve}function vs(x,U,z){const H=U.isScene===!0?U.overrideMaterial:null;for(let k=0,ue=x.length;k<ue;k++){const Ee=x[k],Le=Ee.object,Ce=Ee.geometry,Be=Ee.group;let Ve=Ee.material;Ve.allowOverride===!0&&H!==null&&(Ve=H),Le.layers.test(z.layers)&&_c(Le,U,z,Ce,Ve,Be)}}function _c(x,U,z,H,k,ue){x.onBeforeRender(w,U,z,H,k,ue),x.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),k.onBeforeRender(w,U,z,H,x,ue),k.transparent===!0&&k.side===cn&&k.forceSinglePass===!1?(k.side=Ht,k.needsUpdate=!0,w.renderBufferDirect(z,U,H,k,x,ue),k.side=si,k.needsUpdate=!0,w.renderBufferDirect(z,U,H,k,x,ue),k.side=cn):w.renderBufferDirect(z,U,H,k,x,ue),x.onAfterRender(w,U,z,H,k,ue)}function ys(x,U,z){U.isScene!==!0&&(U=Ie);const H=ae.get(x),k=p.state.lights,ue=p.state.shadowsArray,Ee=k.state.version,Le=O.getParameters(x,k.state,ue,U,z),Ce=O.getProgramCacheKey(Le);let Be=H.programs;H.environment=x.isMeshStandardMaterial?U.environment:null,H.fog=U.fog,H.envMap=(x.isMeshStandardMaterial?B:oe).get(x.envMap||H.environment),H.envMapRotation=H.environment!==null&&x.envMap===null?U.environmentRotation:x.envMapRotation,Be===void 0&&(x.addEventListener("dispose",Q),Be=new Map,H.programs=Be);let Ve=Be.get(Ce);if(Ve!==void 0){if(H.currentProgram===Ve&&H.lightsStateVersion===Ee)return yc(x,Le),Ve}else Le.uniforms=O.getUniforms(x),x.onBeforeCompile(Le,w),Ve=O.acquireProgram(Le,Ce),Be.set(Ce,Ve),H.uniforms=Le.uniforms;const Ne=H.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Ne.clippingPlanes=re.uniform),yc(x,Le),H.needsLights=lf(x),H.lightsStateVersion=Ee,H.needsLights&&(Ne.ambientLightColor.value=k.state.ambient,Ne.lightProbe.value=k.state.probe,Ne.directionalLights.value=k.state.directional,Ne.directionalLightShadows.value=k.state.directionalShadow,Ne.spotLights.value=k.state.spot,Ne.spotLightShadows.value=k.state.spotShadow,Ne.rectAreaLights.value=k.state.rectArea,Ne.ltc_1.value=k.state.rectAreaLTC1,Ne.ltc_2.value=k.state.rectAreaLTC2,Ne.pointLights.value=k.state.point,Ne.pointLightShadows.value=k.state.pointShadow,Ne.hemisphereLights.value=k.state.hemi,Ne.directionalShadowMap.value=k.state.directionalShadowMap,Ne.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ne.spotShadowMap.value=k.state.spotShadowMap,Ne.spotLightMatrix.value=k.state.spotLightMatrix,Ne.spotLightMap.value=k.state.spotLightMap,Ne.pointShadowMap.value=k.state.pointShadowMap,Ne.pointShadowMatrix.value=k.state.pointShadowMatrix),H.currentProgram=Ve,H.uniformsList=null,Ve}function vc(x){if(x.uniformsList===null){const U=x.currentProgram.getUniforms();x.uniformsList=ho.seqWithValue(U.seq,x.uniforms)}return x.uniformsList}function yc(x,U){const z=ae.get(x);z.outputColorSpace=U.outputColorSpace,z.batching=U.batching,z.batchingColor=U.batchingColor,z.instancing=U.instancing,z.instancingColor=U.instancingColor,z.instancingMorph=U.instancingMorph,z.skinning=U.skinning,z.morphTargets=U.morphTargets,z.morphNormals=U.morphNormals,z.morphColors=U.morphColors,z.morphTargetsCount=U.morphTargetsCount,z.numClippingPlanes=U.numClippingPlanes,z.numIntersection=U.numClipIntersection,z.vertexAlphas=U.vertexAlphas,z.vertexTangents=U.vertexTangents,z.toneMapping=U.toneMapping}function of(x,U,z,H,k){U.isScene!==!0&&(U=Ie),me.resetTextureUnits();const ue=U.fog,Ee=H.isMeshStandardMaterial?U.environment:null,Le=N===null?w.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Sr,Ce=(H.isMeshStandardMaterial?B:oe).get(H.envMap||Ee),Be=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ve=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Ne=!!z.morphAttributes.position,Ke=!!z.morphAttributes.normal,it=!!z.morphAttributes.color;let ft=ri;H.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(ft=w.toneMapping);const lt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ot=lt!==void 0?lt.length:0,ke=ae.get(H),ut=p.state.lights;if($e===!0&&(Y===!0||x!==b)){const It=x===b&&H.id===E;re.setState(H,x,It)}let Ze=!1;H.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==ut.state.version||ke.outputColorSpace!==Le||k.isBatchedMesh&&ke.batching===!1||!k.isBatchedMesh&&ke.batching===!0||k.isBatchedMesh&&ke.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&ke.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&ke.instancing===!1||!k.isInstancedMesh&&ke.instancing===!0||k.isSkinnedMesh&&ke.skinning===!1||!k.isSkinnedMesh&&ke.skinning===!0||k.isInstancedMesh&&ke.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&ke.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&ke.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&ke.instancingMorph===!1&&k.morphTexture!==null||ke.envMap!==Ce||H.fog===!0&&ke.fog!==ue||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==re.numPlanes||ke.numIntersection!==re.numIntersection)||ke.vertexAlphas!==Be||ke.vertexTangents!==Ve||ke.morphTargets!==Ne||ke.morphNormals!==Ke||ke.morphColors!==it||ke.toneMapping!==ft||ke.morphTargetsCount!==ot)&&(Ze=!0):(Ze=!0,ke.__version=H.version);let Vt=ke.currentProgram;Ze===!0&&(Vt=ys(H,U,k));let Di=!1,Gt=!1,Rr=!1;const ht=Vt.getUniforms(),qt=ke.uniforms;if(Z.useProgram(Vt.program)&&(Di=!0,Gt=!0,Rr=!0),H.id!==E&&(E=H.id,Gt=!0),Di||b!==x){Z.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),ht.setValue(A,"projectionMatrix",x.projectionMatrix),ht.setValue(A,"viewMatrix",x.matrixWorldInverse);const Ut=ht.map.cameraPosition;Ut!==void 0&&Ut.setValue(A,Se.setFromMatrixPosition(x.matrixWorld)),J.logarithmicDepthBuffer&&ht.setValue(A,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ht.setValue(A,"isOrthographic",x.isOrthographicCamera===!0),b!==x&&(b=x,Gt=!0,Rr=!0)}if(k.isSkinnedMesh){ht.setOptional(A,k,"bindMatrix"),ht.setOptional(A,k,"bindMatrixInverse");const It=k.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),ht.setValue(A,"boneTexture",It.boneTexture,me))}k.isBatchedMesh&&(ht.setOptional(A,k,"batchingTexture"),ht.setValue(A,"batchingTexture",k._matricesTexture,me),ht.setOptional(A,k,"batchingIdTexture"),ht.setValue(A,"batchingIdTexture",k._indirectTexture,me),ht.setOptional(A,k,"batchingColorTexture"),k._colorsTexture!==null&&ht.setValue(A,"batchingColorTexture",k._colorsTexture,me));const Xt=z.morphAttributes;if((Xt.position!==void 0||Xt.normal!==void 0||Xt.color!==void 0)&&X.update(k,z,Vt),(Gt||ke.receiveShadow!==k.receiveShadow)&&(ke.receiveShadow=k.receiveShadow,ht.setValue(A,"receiveShadow",k.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(qt.envMap.value=Ce,qt.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&U.environment!==null&&(qt.envMapIntensity.value=U.environmentIntensity),Gt&&(ht.setValue(A,"toneMappingExposure",w.toneMappingExposure),ke.needsLights&&af(qt,Rr),ue&&H.fog===!0&&j.refreshFogUniforms(qt,ue),j.refreshMaterialUniforms(qt,H,G,ee,p.state.transmissionRenderTarget[x.id]),ho.upload(A,vc(ke),qt,me)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ho.upload(A,vc(ke),qt,me),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ht.setValue(A,"center",k.center),ht.setValue(A,"modelViewMatrix",k.modelViewMatrix),ht.setValue(A,"normalMatrix",k.normalMatrix),ht.setValue(A,"modelMatrix",k.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const It=H.uniformsGroups;for(let Ut=0,jo=It.length;Ut<jo;Ut++){const li=It[Ut];Fe.update(li,Vt),Fe.bind(li,Vt)}}return Vt}function af(x,U){x.ambientLightColor.needsUpdate=U,x.lightProbe.needsUpdate=U,x.directionalLights.needsUpdate=U,x.directionalLightShadows.needsUpdate=U,x.pointLights.needsUpdate=U,x.pointLightShadows.needsUpdate=U,x.spotLights.needsUpdate=U,x.spotLightShadows.needsUpdate=U,x.rectAreaLights.needsUpdate=U,x.hemisphereLights.needsUpdate=U}function lf(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(x,U,z){const H=ae.get(x);H.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),ae.get(x.texture).__webglTexture=U,ae.get(x.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:z,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,U){const z=ae.get(x);z.__webglFramebuffer=U,z.__useDefaultFramebuffer=U===void 0};const cf=A.createFramebuffer();this.setRenderTarget=function(x,U=0,z=0){N=x,T=U,R=z;let H=!0,k=null,ue=!1,Ee=!1;if(x){const Ce=ae.get(x);if(Ce.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(A.FRAMEBUFFER,null),H=!1;else if(Ce.__webglFramebuffer===void 0)me.setupRenderTarget(x);else if(Ce.__hasExternalTextures)me.rebindTextures(x,ae.get(x.texture).__webglTexture,ae.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){const Ne=x.depthTexture;if(Ce.__boundDepthTexture!==Ne){if(Ne!==null&&ae.has(Ne)&&(x.width!==Ne.image.width||x.height!==Ne.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");me.setupDepthRenderbuffer(x)}}const Be=x.texture;(Be.isData3DTexture||Be.isDataArrayTexture||Be.isCompressedArrayTexture)&&(Ee=!0);const Ve=ae.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Ve[U])?k=Ve[U][z]:k=Ve[U],ue=!0):x.samples>0&&me.useMultisampledRTT(x)===!1?k=ae.get(x).__webglMultisampledFramebuffer:Array.isArray(Ve)?k=Ve[z]:k=Ve,I.copy(x.viewport),V.copy(x.scissor),$=x.scissorTest}else I.copy(Te).multiplyScalar(G).floor(),V.copy(ze).multiplyScalar(G).floor(),$=Xe;if(z!==0&&(k=cf),Z.bindFramebuffer(A.FRAMEBUFFER,k)&&H&&Z.drawBuffers(x,k),Z.viewport(I),Z.scissor(V),Z.setScissorTest($),ue){const Ce=ae.get(x.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+U,Ce.__webglTexture,z)}else if(Ee){const Ce=U;for(let Be=0;Be<x.textures.length;Be++){const Ve=ae.get(x.textures[Be]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Be,Ve.__webglTexture,z,Ce)}}else if(x!==null&&z!==0){const Ce=ae.get(x.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Ce.__webglTexture,z)}E=-1},this.readRenderTargetPixels=function(x,U,z,H,k,ue,Ee,Le=0){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=ae.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce){Z.bindFramebuffer(A.FRAMEBUFFER,Ce);try{const Be=x.textures[Le],Ve=Be.format,Ne=Be.type;if(!J.textureFormatReadable(Ve)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=x.width-H&&z>=0&&z<=x.height-k&&(x.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+Le),A.readPixels(U,z,H,k,Re.convert(Ve),Re.convert(Ne),ue))}finally{const Be=N!==null?ae.get(N).__webglFramebuffer:null;Z.bindFramebuffer(A.FRAMEBUFFER,Be)}}},this.readRenderTargetPixelsAsync=async function(x,U,z,H,k,ue,Ee,Le=0){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=ae.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&Ee!==void 0&&(Ce=Ce[Ee]),Ce)if(U>=0&&U<=x.width-H&&z>=0&&z<=x.height-k){Z.bindFramebuffer(A.FRAMEBUFFER,Ce);const Be=x.textures[Le],Ve=Be.format,Ne=Be.type;if(!J.textureFormatReadable(Ve))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ke=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,Ke),A.bufferData(A.PIXEL_PACK_BUFFER,ue.byteLength,A.STREAM_READ),x.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+Le),A.readPixels(U,z,H,k,Re.convert(Ve),Re.convert(Ne),0);const it=N!==null?ae.get(N).__webglFramebuffer:null;Z.bindFramebuffer(A.FRAMEBUFFER,it);const ft=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await Kp(A,ft,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,Ke),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,ue),A.deleteBuffer(Ke),A.deleteSync(ft),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(x,U=null,z=0){const H=Math.pow(2,-z),k=Math.floor(x.image.width*H),ue=Math.floor(x.image.height*H),Ee=U!==null?U.x:0,Le=U!==null?U.y:0;me.setTexture2D(x,0),A.copyTexSubImage2D(A.TEXTURE_2D,z,0,0,Ee,Le,k,ue),Z.unbindTexture()};const uf=A.createFramebuffer(),hf=A.createFramebuffer();this.copyTextureToTexture=function(x,U,z=null,H=null,k=0,ue=null){ue===null&&(k!==0?(ns("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ue=k,k=0):ue=0);let Ee,Le,Ce,Be,Ve,Ne,Ke,it,ft;const lt=x.isCompressedTexture?x.mipmaps[ue]:x.image;if(z!==null)Ee=z.max.x-z.min.x,Le=z.max.y-z.min.y,Ce=z.isBox3?z.max.z-z.min.z:1,Be=z.min.x,Ve=z.min.y,Ne=z.isBox3?z.min.z:0;else{const Xt=Math.pow(2,-k);Ee=Math.floor(lt.width*Xt),Le=Math.floor(lt.height*Xt),x.isDataArrayTexture?Ce=lt.depth:x.isData3DTexture?Ce=Math.floor(lt.depth*Xt):Ce=1,Be=0,Ve=0,Ne=0}H!==null?(Ke=H.x,it=H.y,ft=H.z):(Ke=0,it=0,ft=0);const ot=Re.convert(U.format),ke=Re.convert(U.type);let ut;U.isData3DTexture?(me.setTexture3D(U,0),ut=A.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(me.setTexture2DArray(U,0),ut=A.TEXTURE_2D_ARRAY):(me.setTexture2D(U,0),ut=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,U.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,U.unpackAlignment);const Ze=A.getParameter(A.UNPACK_ROW_LENGTH),Vt=A.getParameter(A.UNPACK_IMAGE_HEIGHT),Di=A.getParameter(A.UNPACK_SKIP_PIXELS),Gt=A.getParameter(A.UNPACK_SKIP_ROWS),Rr=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,lt.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,lt.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Be),A.pixelStorei(A.UNPACK_SKIP_ROWS,Ve),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Ne);const ht=x.isDataArrayTexture||x.isData3DTexture,qt=U.isDataArrayTexture||U.isData3DTexture;if(x.isDepthTexture){const Xt=ae.get(x),It=ae.get(U),Ut=ae.get(Xt.__renderTarget),jo=ae.get(It.__renderTarget);Z.bindFramebuffer(A.READ_FRAMEBUFFER,Ut.__webglFramebuffer),Z.bindFramebuffer(A.DRAW_FRAMEBUFFER,jo.__webglFramebuffer);for(let li=0;li<Ce;li++)ht&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,ae.get(x).__webglTexture,k,Ne+li),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,ae.get(U).__webglTexture,ue,ft+li)),A.blitFramebuffer(Be,Ve,Ee,Le,Ke,it,Ee,Le,A.DEPTH_BUFFER_BIT,A.NEAREST);Z.bindFramebuffer(A.READ_FRAMEBUFFER,null),Z.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(k!==0||x.isRenderTargetTexture||ae.has(x)){const Xt=ae.get(x),It=ae.get(U);Z.bindFramebuffer(A.READ_FRAMEBUFFER,uf),Z.bindFramebuffer(A.DRAW_FRAMEBUFFER,hf);for(let Ut=0;Ut<Ce;Ut++)ht?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Xt.__webglTexture,k,Ne+Ut):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Xt.__webglTexture,k),qt?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,It.__webglTexture,ue,ft+Ut):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,It.__webglTexture,ue),k!==0?A.blitFramebuffer(Be,Ve,Ee,Le,Ke,it,Ee,Le,A.COLOR_BUFFER_BIT,A.NEAREST):qt?A.copyTexSubImage3D(ut,ue,Ke,it,ft+Ut,Be,Ve,Ee,Le):A.copyTexSubImage2D(ut,ue,Ke,it,Be,Ve,Ee,Le);Z.bindFramebuffer(A.READ_FRAMEBUFFER,null),Z.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else qt?x.isDataTexture||x.isData3DTexture?A.texSubImage3D(ut,ue,Ke,it,ft,Ee,Le,Ce,ot,ke,lt.data):U.isCompressedArrayTexture?A.compressedTexSubImage3D(ut,ue,Ke,it,ft,Ee,Le,Ce,ot,lt.data):A.texSubImage3D(ut,ue,Ke,it,ft,Ee,Le,Ce,ot,ke,lt):x.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,ue,Ke,it,Ee,Le,ot,ke,lt.data):x.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,ue,Ke,it,lt.width,lt.height,ot,lt.data):A.texSubImage2D(A.TEXTURE_2D,ue,Ke,it,Ee,Le,ot,ke,lt);A.pixelStorei(A.UNPACK_ROW_LENGTH,Ze),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Vt),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Di),A.pixelStorei(A.UNPACK_SKIP_ROWS,Gt),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Rr),ue===0&&U.generateMipmaps&&A.generateMipmap(ut),Z.unbindTexture()},this.initRenderTarget=function(x){ae.get(x).__webglFramebuffer===void 0&&me.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?me.setTextureCube(x,0):x.isData3DTexture?me.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?me.setTexture2DArray(x,0):me.setTexture2D(x,0),Z.unbindTexture()},this.resetState=function(){T=0,R=0,N=null,Z.reset(),ve.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Qe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Qe._getUnpackColorSpace()}}const Du={type:"change"},cc={type:"start"},bd={type:"end"},Ys=new ko,Ou=new Zn,Q0=Math.cos(70*qp.DEG2RAD),vt=new D,kt=2*Math.PI,st={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Aa=1e-6;class eS extends mg{constructor(e,t=null){super(e,t),this.state=st.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ar.ROTATE,MIDDLE:ar.DOLLY,RIGHT:ar.PAN},this.touches={ONE:ir.ROTATE,TWO:ir.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new Ci,this._lastTargetPosition=new D,this._quat=new Ci().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new au,this._sphericalDelta=new au,this._scale=1,this._panOffset=new D,this._rotateStart=new fe,this._rotateEnd=new fe,this._rotateDelta=new fe,this._panStart=new fe,this._panEnd=new fe,this._panDelta=new fe,this._dollyStart=new fe,this._dollyEnd=new fe,this._dollyDelta=new fe,this._dollyDirection=new D,this._mouse=new fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=nS.bind(this),this._onPointerDown=tS.bind(this),this._onPointerUp=iS.bind(this),this._onContextMenu=uS.bind(this),this._onMouseWheel=oS.bind(this),this._onKeyDown=aS.bind(this),this._onTouchStart=lS.bind(this),this._onTouchMove=cS.bind(this),this._onMouseDown=rS.bind(this),this._onMouseMove=sS.bind(this),this._interceptControlDown=hS.bind(this),this._interceptControlUp=dS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Du),this.update(),this.state=st.NONE}update(e=null){const t=this.object.position;vt.copy(t).sub(this.target),vt.applyQuaternion(this._quat),this._spherical.setFromVector3(vt),this.autoRotate&&this.state===st.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=kt:i>Math.PI&&(i-=kt),r<-Math.PI?r+=kt:r>Math.PI&&(r-=kt),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=o!=this._spherical.radius}if(vt.setFromSpherical(this._spherical),vt.applyQuaternion(this._quatInverse),t.copy(this.target).add(vt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){const a=vt.length();o=this._clampDistance(a*this._scale);const l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const a=new D(this._mouse.x,this._mouse.y,0);a.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=vt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Ys.origin.copy(this.object.position),Ys.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ys.direction))<Q0?this.object.lookAt(this.target):(Ou.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ys.intersectPlane(Ou,this.target))))}else if(this.object.isOrthographicCamera){const o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Aa||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Aa||this._lastTargetPosition.distanceToSquared(this.target)>Aa?(this.dispatchEvent(Du),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?kt/60*this.autoRotateSpeed*e:kt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){vt.setFromMatrixColumn(t,0),vt.multiplyScalar(-e),this._panOffset.add(vt)}_panUp(e,t){this.screenSpacePanning===!0?vt.setFromMatrixColumn(t,1):(vt.setFromMatrixColumn(t,0),vt.crossVectors(this.object.up,vt)),vt.multiplyScalar(e),this._panOffset.add(vt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;vt.copy(r).sub(this.target);let s=vt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*t*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=t-i.top,o=i.width,a=i.height;this._mouse.x=r/o*2-1,this._mouse.y=-(s/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(kt*this._rotateDelta.x/t.clientHeight),this._rotateUp(kt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(kt*this._rotateDelta.x/t.clientHeight),this._rotateUp(kt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,r=e.pageY-t.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const o=(e.pageX+t.x)*.5,a=(e.pageY+t.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new fe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function tS(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function nS(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function iS(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(bd),this.state=st.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function rS(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ar.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=st.DOLLY;break;case ar.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=st.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=st.ROTATE}break;case ar.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=st.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=st.PAN}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(cc)}function sS(n){switch(this.state){case st.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case st.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case st.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function oS(n){this.enabled===!1||this.enableZoom===!1||this.state!==st.NONE||(n.preventDefault(),this.dispatchEvent(cc),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(bd))}function aS(n){this.enabled!==!1&&this._handleKeyDown(n)}function lS(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case ir.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=st.TOUCH_ROTATE;break;case ir.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=st.TOUCH_PAN;break;default:this.state=st.NONE}break;case 2:switch(this.touches.TWO){case ir.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=st.TOUCH_DOLLY_PAN;break;case ir.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=st.TOUCH_DOLLY_ROTATE;break;default:this.state=st.NONE}break;default:this.state=st.NONE}this.state!==st.NONE&&this.dispatchEvent(cc)}function cS(n){switch(this._trackPointer(n),this.state){case st.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case st.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case st.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case st.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=st.NONE}}function uS(n){this.enabled!==!1&&n.preventDefault()}function hS(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function dS(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function fS(n,e){return n.room.openings.filter(t=>t.hostSurfaceId===e).map(t=>{const i=t.sillM??0;return{id:t.id,kind:t.kind,wallId:e,startM:t.offsetM,endM:t.offsetM+t.widthM,bottomM:i,topM:i+t.heightM}}).sort((t,i)=>t.startM-i.startM||t.bottomM-i.bottomM)}function pS(n,e){const{widthM:t,lengthM:i,heightM:r}=n.room,s=new Set,o=t>0?e.x/(t/2):0,a=i>0?e.z/(i/2):0;return Math.abs(o)>Math.abs(a)?s.add(o>0?"room-1.wall-right":"room-1.wall-left"):s.add(a>0?"room-1.wall-front":"room-1.wall-back"),e.y>r*1.35&&s.add("room-1.ceiling"),s}function mS(n,e,t){return!e.has(n)&&!t.has(n)}const Ra=Ul({x:.45,y:.55,z:1}),gS=-.1,_S=.24,vS=.88,yS=.76,SS=45;function wS(n,e,t=SS){const i=Math.max(.01,n.widthM),r=Math.max(.01,n.lengthM),s=Math.max(.01,n.heightM),o=Math.max(.1,e.width/Math.max(1,e.height)),a=MS(t)/2,l=Math.tan(a),c=l*o,u={x:i*gS,y:s*_S,z:0},h=Ol(Ra,-1),d=Ul(Uu(h,{x:0,y:1,z:0})),f=Ul(Uu(d,h)),g=bS(i,r,s);let v=1;for(const M of g){const S=Ed(M,u),w=ur(S,Ra),C=Math.abs(ur(S,d)),T=Math.abs(ur(S,f));v=Math.max(v,w+C/(c*vS),w+T/(l*yS))}const m=ES(u,Ol(Ra,v)),p=xS(g,m,h,d,f,c,l);return{camera:m,target:u,distance:v,ndcBounds:p}}function xS(n,e,t,i,r,s,o){let a=Number.POSITIVE_INFINITY,l=Number.NEGATIVE_INFINITY,c=Number.POSITIVE_INFINITY,u=Number.NEGATIVE_INFINITY;for(const h of n){const d=Ed(h,e),f=ur(d,t),g=ur(d,i)/(f*s),v=ur(d,r)/(f*o);a=Math.min(a,g),l=Math.max(l,g),c=Math.min(c,v),u=Math.max(u,v)}return{left:a,right:l,bottom:c,top:u}}function bS(n,e,t){const i=n/2,r=e/2;return[{x:-i,y:0,z:-r},{x:-i,y:0,z:r},{x:i,y:0,z:-r},{x:i,y:0,z:r},{x:-i,y:t,z:-r},{x:-i,y:t,z:r},{x:i,y:t,z:-r},{x:i,y:t,z:r}]}function ES(n,e){return{x:n.x+e.x,y:n.y+e.y,z:n.z+e.z}}function Ed(n,e){return{x:n.x-e.x,y:n.y-e.y,z:n.z-e.z}}function Ol(n,e){return{x:n.x*e,y:n.y*e,z:n.z*e}}function ur(n,e){return n.x*e.x+n.y*e.y+n.z*e.z}function Uu(n,e){return{x:n.y*e.z-n.z*e.y,y:n.z*e.x-n.x*e.z,z:n.x*e.y-n.y*e.x}}function Ul(n){const e=Math.hypot(n.x,n.y,n.z);return e===0?{x:0,y:0,z:1}:Ol(n,1/e)}function MS(n){return n*Math.PI/180}const Jn=.08;class TS{container;scene=new Sm;camera=new Zt(45,1,.01,100);renderer=new Z0({antialias:!0,alpha:!0});controls;raycaster=new pg;pointer=new fe;pointerDown=new fe;entityMeshes=new Map;entityOutlines=new Map;manualHidden=new Set;autoHidden=new Set;highlighted=new Set;floorFinishMesh=null;laminateFloorVisible=!1;project=null;autoCutaway=!0;showcaseFrameActive=!0;onEntitySelect;animationFrame=0;constructor(e){this.container=e.container,this.onEntitySelect=e.onEntitySelect,this.scene.background=new Je(658967),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!1,this.renderer.outputColorSpace=Bt,this.container.appendChild(this.renderer.domElement),this.camera.position.set(1,1,1),this.controls=new eS(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.08,this.controls.target.set(0,0,0),this.controls.maxPolarAngle=Math.PI*.49,this.controls.minDistance=2,this.controls.maxDistance=18;const t=new cg(16777215,1779e3,2.2);this.scene.add(t);const i=new dg(16777215,2.6);i.position.set(3.5,7,5),this.scene.add(i),this.renderer.domElement.addEventListener("pointerdown",this.handlePointerDown),this.renderer.domElement.addEventListener("pointerup",this.handlePointerUp),this.controls.addEventListener("start",this.handleControlsStart),window.addEventListener("resize",this.resize),this.resize(),this.animate()}setProject(e){this.project=e,this.rebuildRoom(),this.showcaseFrameActive=!0,this.applyShowcaseFrame(),this.updateVisibility()}setHighlightedEntities(e){this.highlighted=new Set(e),this.applyMaterials()}setLaminateFloorVisible(e){this.laminateFloorVisible=e,this.updateFloorFinishVisibility()}setManualVisibility(e,t){t?this.manualHidden.delete(e):this.manualHidden.add(e),this.updateVisibility()}showAll(){this.manualHidden.clear(),this.autoHidden.clear(),this.autoCutaway=!1,this.updateVisibility()}setAutoCutaway(e){this.autoCutaway=e,e||this.autoHidden.clear(),this.updateVisibility()}resetCamera(){this.showcaseFrameActive=!0,this.applyShowcaseFrame()}dispose(){cancelAnimationFrame(this.animationFrame),window.removeEventListener("resize",this.resize),this.renderer.domElement.removeEventListener("pointerdown",this.handlePointerDown),this.renderer.domElement.removeEventListener("pointerup",this.handlePointerUp),this.controls.removeEventListener("start",this.handleControlsStart),this.controls.dispose(),this.disposeFloorFinish(),this.renderer.dispose(),this.container.replaceChildren()}rebuildRoom(){this.disposeFloorFinish();for(const r of this.entityMeshes.values())r.geometry.dispose(),Array.isArray(r.material)?r.material.forEach(s=>s.dispose()):r.material.dispose(),this.scene.remove(r);for(const r of this.entityOutlines.values()){r.geometry.dispose();const s=r.material;Array.isArray(s)?s.forEach(o=>o.dispose()):s.dispose()}if(this.entityMeshes.clear(),this.entityOutlines.clear(),!this.project)return;const{widthM:e,lengthM:t,heightM:i}=this.project.room;this.makeMesh("room-1.floor",new Gn(e,Jn,t),new D(0,-Jn/2,0)),this.makeLaminateFloor(e,t),this.makeMesh("room-1.ceiling",new Gn(e,Jn,t),new D(0,i+Jn/2,0)),this.makeWallMesh("room-1.wall-front",e,i,new D(0,i/2,t/2)),this.makeWallMesh("room-1.wall-back",e,i,new D(0,i/2,-t/2)),this.makeWallMesh("room-1.wall-left",t,i,new D(-e/2,i/2,0),Math.PI/2),this.makeWallMesh("room-1.wall-right",t,i,new D(e/2,i/2,0),Math.PI/2),this.applyMaterials()}makeWallMesh(e,t,i,r,s=0){const o=this.createWallGeometry(e,t,i),a=this.makeMesh(e,o,r);return a.rotation.y=s,a}createWallGeometry(e,t,i){if(!this.project)return new Gn(t,i,Jn);const r=fS(this.project,e);if(!r.length)return new Gn(t,i,Jn);const s=t/2,o=i/2,a=r.filter(h=>h.bottomM<=1e-9),l=r.filter(h=>h.bottomM>1e-9),c=new hd;c.moveTo(-s,-o);for(const h of a){const d=-s+h.startM,f=-s+h.endM,g=-o+h.topM;c.lineTo(d,-o),c.lineTo(d,g),c.lineTo(f,g),c.lineTo(f,-o)}c.lineTo(s,-o),c.lineTo(s,o),c.lineTo(-s,o),c.lineTo(-s,-o);for(const h of l){const d=-s+h.startM,f=-s+h.endM,g=-o+h.bottomM,v=-o+h.topM,m=new Cl;m.moveTo(d,g),m.lineTo(d,v),m.lineTo(f,v),m.lineTo(f,g),m.lineTo(d,g),c.holes.push(m)}const u=new ac(c,{depth:Jn,bevelEnabled:!1,steps:1});return u.translate(0,0,-Jn/2),u.computeVertexNormals(),u}makeMesh(e,t,i){const r=new nu({color:2569804,roughness:.78,metalness:.03,transparent:!0,opacity:.96,side:cn}),s=new dn(t,r);s.position.copy(i),s.castShadow=!1,s.receiveShadow=!1,s.userData.entityId=e;const o=new Mm(new Am(t),new rd({color:6320522,transparent:!0,opacity:.28}));return o.renderOrder=2,s.add(o),this.scene.add(s),this.entityMeshes.set(e,s),this.entityOutlines.set(e,o),s}makeLaminateFloor(e,t){const i=document.createElement("canvas");i.width=1024,i.height=512;const r=i.getContext("2d");if(!r)return;const s=6,o=i.height/s,a=i.width/2,l=["#b58a5d","#ad8156","#ba9065","#a97d53","#b1865a"];r.fillStyle="#ad8156",r.fillRect(0,0,i.width,i.height);for(let d=0;d<s;d+=1){const f=d*o,g=d%2===0?0:a/2;for(let v=-1;v<=2;v+=1){const m=v*a-g,p=Math.abs(d*7+v*11+17)%l.length;r.fillStyle=l[p],r.fillRect(m,f,a,o),r.strokeStyle="rgba(55, 34, 20, 0.40)",r.lineWidth=2,r.strokeRect(m,f,a,o),r.strokeStyle="rgba(255, 240, 214, 0.09)",r.lineWidth=1;for(let M=1;M<=4;M+=1){const S=f+o*M/5,w=((d+v+M)%3-1)*5;r.beginPath(),r.moveTo(m+18,S),r.bezierCurveTo(m+a*.28,S+w,m+a*.68,S-w,m+a-18,S),r.stroke()}}}const c=new Tm(i);c.colorSpace=Bt,c.wrapS=Jr,c.wrapT=Jr,c.repeat.set(Math.max(.5,e/4.8),Math.max(1,t/1.2)),c.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy());const u=new nu({map:c,roughness:.76,metalness:0,side:cn}),h=new dn(new gs(e,t),u);h.rotation.x=-Math.PI/2,h.position.y=.006,h.renderOrder=1,h.visible=!1,this.scene.add(h),this.floorFinishMesh=h,this.updateFloorFinishVisibility()}disposeFloorFinish(){if(!this.floorFinishMesh)return;this.floorFinishMesh.geometry.dispose();const e=this.floorFinishMesh.material;e.map?.dispose(),e.dispose(),this.scene.remove(this.floorFinishMesh),this.floorFinishMesh=null}updateFloorFinishVisibility(){if(!this.floorFinishMesh)return;const e=this.entityMeshes.get("room-1.floor")?.visible??!0;this.floorFinishMesh.visible=this.laminateFloorVisible&&e}applyMaterials(){for(const[e,t]of this.entityMeshes){const i=t.material,r=this.highlighted.has(e),s=e.includes(".wall-"),o=this.entityOutlines.get(e);if(o){const a=o.material;a.color.setHex(r?15251531:6320522),a.opacity=r?1:.28,a.needsUpdate=!0}r?(i.color.setHex(4608356),i.emissive.setHex(8015616),i.emissiveIntensity=.28,i.opacity=1):e==="room-1.floor"?(i.color.setHex(1647926),i.emissive.setHex(0),i.opacity=1):e==="room-1.ceiling"?(i.color.setHex(5464438),i.emissive.setHex(0),i.opacity=.86):(i.color.setHex(2569804),i.emissive.setHex(0),i.opacity=.96),i.needsUpdate=!0}}updateAutoCutaway(){if(!this.project||!this.autoCutaway)return;const e=pS(this.project,{x:this.camera.position.x,y:this.camera.position.y,z:this.camera.position.z});this.autoHidden.clear(),e.forEach(t=>this.autoHidden.add(t))}updateVisibility(){for(const[e,t]of this.entityMeshes)t.visible=mS(e,this.manualHidden,this.autoHidden);this.updateFloorFinishVisibility()}handleControlsStart=()=>{this.showcaseFrameActive=!1};handlePointerDown=e=>{this.pointerDown.set(e.clientX,e.clientY)};handlePointerUp=e=>{if(this.pointerDown.distanceTo(new fe(e.clientX,e.clientY))>5)return;const i=this.renderer.domElement.getBoundingClientRect();this.pointer.x=(e.clientX-i.left)/i.width*2-1,this.pointer.y=-((e.clientY-i.top)/i.height)*2+1,this.raycaster.setFromCamera(this.pointer,this.camera);const s=this.raycaster.intersectObjects([...this.entityMeshes.values()].filter(o=>o.visible),!1)[0]?.object.userData.entityId;s&&this.onEntitySelect?.(s)};applyShowcaseFrame(e=Math.max(1,this.container.clientWidth),t=Math.max(1,this.container.clientHeight)){if(!this.project)return;const i=wS(this.project.room,{width:e,height:t},this.camera.fov);this.camera.position.set(i.camera.x,i.camera.y,i.camera.z),this.controls.target.set(i.target.x,i.target.y,i.target.z),this.controls.maxDistance=Math.max(18,i.distance*2.25),this.controls.update(),this.updateAutoCutaway(),this.updateVisibility()}resize=()=>{const e=Math.max(1,this.container.clientWidth),t=Math.max(1,this.container.clientHeight);this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.showcaseFrameActive&&this.project&&this.applyShowcaseFrame(e,t)};animate=()=>{this.animationFrame=requestAnimationFrame(this.animate),this.controls.update(),this.autoCutaway&&(this.updateAutoCutaway(),this.updateVisibility()),this.renderer.render(this.scene,this.camera)}}const AS="http://www.w3.org/2000/svg";function Xi(n,e){const t=document.createElementNS(AS,n);return Object.entries(e).forEach(([i,r])=>t.setAttribute(i,r)),t}function Nu(n,e){const t=Xl(e);n.replaceChildren();const i=Xi("svg",{viewBox:"0 0 240 190",role:"img","aria-label":"M² схема на помещението"});i.classList.add("m2-schema-svg"),i.append(Xi("rect",{x:String(52),y:String(38),width:String(136),height:String(104),rx:"4",class:"m2-room"})),[{x:120,y:24,anchor:"middle",value:`С1 · ${t.wallAreasM2["room-1.wall-front"].toFixed(2)} m²`},{x:120,y:160,anchor:"middle",value:`С2 · ${t.wallAreasM2["room-1.wall-back"].toFixed(2)} m²`},{x:35,y:90,anchor:"middle",transform:"rotate(-90 35 90)",value:`С3 · ${t.wallAreasM2["room-1.wall-left"].toFixed(2)} m²`},{x:205,y:90,anchor:"middle",transform:"rotate(90 205 90)",value:`С4 · ${t.wallAreasM2["room-1.wall-right"].toFixed(2)} m²`}].forEach(f=>{const g=Xi("text",{x:String(f.x),y:String(f.y),"text-anchor":f.anchor,class:"m2-wall-label",...f.transform?{transform:f.transform}:{}});g.textContent=f.value,i.append(g)});const c=Xi("text",{x:"120",y:"50","text-anchor":"middle",class:"m2-dimension"});c.textContent=`${t.widthM.toFixed(2)} m`;const u=Xi("text",{x:"120",y:"98","text-anchor":"middle",class:"m2-dimension m2-dimension-main"});u.textContent=`${t.widthM.toFixed(2)} × ${t.lengthM.toFixed(2)} m`;const h=Xi("text",{x:"120",y:"116","text-anchor":"middle",class:"m2-height"});h.textContent=`H ${t.heightM.toFixed(2)} m`,i.append(c,u,h),n.append(i);const d=document.createElement("div");d.className="m2-summary",d.innerHTML=`
    <span>Стени <strong>${ku(t.grossWallsM2)} m²</strong></span>
    <span>Под/таван <strong>${ku(t.floorM2)} m²</strong></span>
  `,n.append(d)}function ku(n){return new Intl.NumberFormat("bg-BG",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)}function RS(n,e){return{canAuthorProject:n==="work"&&e==="work",canInspectViewer:!0,canReturnToWork:e==="work"}}const Js="assignment-fine-putty-1",Fu="assignment-laminate-flooring-1";function Ki(n){return{selectedServiceId:n,selectedEntity:null}}function CS(n,e){const t=n.serviceAssignments.filter(i=>i.included&&i.targetEntityIds.includes(e));return{selectedServiceId:t.length===1?t[0].id:null,selectedEntity:e}}function Ca(){return{selectedServiceId:null,selectedEntity:null}}function Bu(n,e){return e.selectedEntity?n.serviceAssignments.filter(t=>t.included&&t.targetEntityIds.includes(e.selectedEntity)).map(t=>t.id):e.selectedServiceId&&n.serviceAssignments.some(t=>t.included&&t.id===e.selectedServiceId)?[e.selectedServiceId]:[]}function PS(n,e){if(e.selectedEntity)return[e.selectedEntity];if(e.selectedServiceId){const t=n.serviceAssignments.find(i=>i.included&&i.id===e.selectedServiceId);return t?[...t.targetEntityIds]:[]}return[]}function IS(n,e){const t=n.serviceAssignments.find(i=>i.id===Fu&&i.included&&i.targetEntityIds.includes("room-1.floor"));return t?e.selectedEntity?e.selectedEntity==="room-1.floor"&&t.targetEntityIds.includes(e.selectedEntity):e.selectedServiceId?e.selectedServiceId===Fu:!0:!1}const LS=Symbol.for("@supabase/supabase-js.traceContextExtractor");function DS(){return globalThis[LS]}function Bo(n,e){var t={};for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&e.indexOf(i)<0&&(t[i]=n[i]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(n);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(n,i[r])&&(t[i[r]]=n[i[r]]);return t}function OS(n,e,t,i){function r(s){return s instanceof t?s:new t(function(o){o(s)})}return new(t||(t=Promise))(function(s,o){function a(u){try{c(i.next(u))}catch(h){o(h)}}function l(u){try{c(i.throw(u))}catch(h){o(h)}}function c(u){u.done?s(u.value):r(u.value).then(a,l)}c((i=i.apply(n,e||[])).next())})}const US=n=>n?(...e)=>n(...e):(...e)=>fetch(...e);class uc extends Error{constructor(e,t="FunctionsError",i){super(e),this.name=t,this.context=i}toJSON(){return{name:this.name,message:this.message,context:this.context}}}class NS extends uc{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class zu extends uc{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class Hu extends uc{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}var Nl;(function(n){n.Any="any",n.ApNortheast1="ap-northeast-1",n.ApNortheast2="ap-northeast-2",n.ApSouth1="ap-south-1",n.ApSoutheast1="ap-southeast-1",n.ApSoutheast2="ap-southeast-2",n.CaCentral1="ca-central-1",n.EuCentral1="eu-central-1",n.EuWest1="eu-west-1",n.EuWest2="eu-west-2",n.EuWest3="eu-west-3",n.SaEast1="sa-east-1",n.UsEast1="us-east-1",n.UsWest1="us-west-1",n.UsWest2="us-west-2"})(Nl||(Nl={}));class kS{constructor(e,{headers:t={},customFetch:i,region:r=Nl.Any}={}){this.url=e,this.headers=t,this.region=r,this.fetch=US(i)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return OS(this,arguments,void 0,function*(t,i={}){var r,s;let o,a,l;try{const{headers:c,method:u,body:h,signal:d,timeout:f}=i;let g={},{region:v}=i;v||(v=this.region);const m=new URL(`${this.url}/${t}`);v&&v!=="any"&&(g["x-region"]=v,m.searchParams.set("forceFunctionRegion",v));let p;const M=!!c&&Object.keys(c).some(N=>N.toLowerCase()==="content-type");h&&!M?typeof Blob<"u"&&h instanceof Blob||h instanceof ArrayBuffer?(g["Content-Type"]="application/octet-stream",p=h):typeof h=="string"?(g["Content-Type"]="text/plain",p=h):typeof FormData<"u"&&h instanceof FormData?p=h:(g["Content-Type"]="application/json",p=JSON.stringify(h)):h&&typeof h!="string"&&!(typeof Blob<"u"&&h instanceof Blob)&&!(h instanceof ArrayBuffer)&&!(typeof FormData<"u"&&h instanceof FormData)?p=JSON.stringify(h):p=h;let S=d;f&&(a=new AbortController,o=setTimeout(()=>a.abort(),f),d?(S=a.signal,l=()=>a.abort(),d.addEventListener("abort",l)):S=a.signal);const w=yield this.fetch(m.toString(),{method:u||"POST",headers:Object.assign(Object.assign(Object.assign({},g),this.headers),c),body:p,signal:S}).catch(N=>{throw new NS(N)}),C=w.headers.get("x-relay-error");if(C&&C==="true")throw new zu(w);if(!w.ok)throw new Hu(w);let T=((r=w.headers.get("Content-Type"))!==null&&r!==void 0?r:"text/plain").split(";")[0].trim().toLowerCase(),R;return T==="application/json"?R=yield w.json():T==="application/octet-stream"||T==="application/pdf"?R=yield w.blob():T==="text/event-stream"?R=w:T==="multipart/form-data"?R=yield w.formData():R=yield w.text(),{data:R,error:null,response:w}}catch(c){return{data:null,error:c,response:c instanceof Hu||c instanceof zu?c.context:void 0}}finally{o&&clearTimeout(o),l&&((s=i.signal)===null||s===void 0||s.removeEventListener("abort",l))}})}}var hr=class extends Error{constructor(n){super(n.message),this.name="PostgrestError",this.details=n.details,this.hint=n.hint,this.code=n.code}toJSON(){return{name:this.name,message:this.message,details:this.details,hint:this.hint,code:this.code}}};const Md=3,Vu=n=>Math.min(1e3*2**n,3e4),FS=[520,503],Td=["GET","HEAD","OPTIONS"];function os(n){"@babel/helpers - typeof";return os=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},os(n)}function BS(n,e){if(os(n)!="object"||!n)return n;var t=n[Symbol.toPrimitive];if(t!==void 0){var i=t.call(n,e);if(os(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(n)}function zS(n){var e=BS(n,"string");return os(e)=="symbol"?e:e+""}function HS(n,e,t){return(e=zS(e))in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function Gu(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);e&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),t.push.apply(t,i)}return t}function bi(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?Gu(Object(t),!0).forEach(function(i){HS(n,i,t[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):Gu(Object(t)).forEach(function(i){Object.defineProperty(n,i,Object.getOwnPropertyDescriptor(t,i))})}return n}function ju(n,e){return new Promise(t=>{if(e?.aborted){t();return}const i=setTimeout(()=>{e?.removeEventListener("abort",r),t()},n);function r(){clearTimeout(i),t()}e?.addEventListener("abort",r)})}function VS(n,e,t,i){return!(!i||t>=Md||!Td.includes(n)||!FS.includes(e))}async function Ad(n,e,t,i){let r=0;for(;;){const a=bi({},t.headers);r>0&&(a["X-Retry-Count"]=String(r));let l;try{l=await n(e,{method:t.method,headers:a,body:t.body,signal:t.signal})}catch(c){if(c?.name==="AbortError"||c?.code==="ABORT_ERR"||!Td.includes(t.method))throw c;if(i&&r<Md){const u=Vu(r);r++,await ju(u,t.signal);continue}throw c}if(VS(t.method,l.status,r,i)){var s,o;const c=(s=(o=l.headers)===null||o===void 0?void 0:o.get("Retry-After"))!==null&&s!==void 0?s:null,u=c!==null?Math.max(0,parseInt(c,10)||0)*1e3:Vu(r);await l.text(),r++,await ju(u,t.signal);continue}return l}}var GS=class{constructor(n){var e,t,i,r,s;this.shouldThrowOnError=!1,this.retryEnabled=!0,this.method=n.method,this.url=n.url,this.headers=new Headers(n.headers),this.schema=n.schema,this.body=n.body,this.shouldThrowOnError=(e=n.shouldThrowOnError)!==null&&e!==void 0?e:!1,this.signal=n.signal,this.isMaybeSingle=(t=n.isMaybeSingle)!==null&&t!==void 0?t:!1,this.shouldStripNulls=(i=n.shouldStripNulls)!==null&&i!==void 0?i:!1,this.urlLengthLimit=(r=n.urlLengthLimit)!==null&&r!==void 0?r:8e3,this.retryEnabled=(s=n.retry)!==null&&s!==void 0?s:!0,n.fetch?this.fetch=n.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}stripNulls(){if(this.headers.get("Accept")==="text/csv")throw new Error("stripNulls() cannot be used with csv()");return this.shouldStripNulls=!0,this}setHeader(n,e){return this.headers=new Headers(this.headers),this.headers.set(n,e),this}retry(n){return this.retryEnabled=n,this}then(n,e){var t=this;if(this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),this.method!=="GET"&&this.method!=="HEAD"&&this.headers.set("Content-Type","application/json"),this.shouldStripNulls){const o=this.headers.get("Accept");o==="application/vnd.pgrst.object+json"?this.headers.set("Accept","application/vnd.pgrst.object+json;nulls=stripped"):(!o||o==="application/json")&&this.headers.set("Accept","application/vnd.pgrst.array+json;nulls=stripped")}const i=this.fetch;let s=(async()=>{const o={};t.headers.forEach((l,c)=>{o[c]=l});const a=await Ad(i,t.url.toString(),{method:t.method,headers:o,body:JSON.stringify(t.body,(l,c)=>typeof c=="bigint"?c.toString():c),signal:t.signal},t.retryEnabled);return await t.processResponse(a)})();return this.shouldThrowOnError||(s=s.catch(o=>{var a;let l="",c="",u="";const h=o?.cause;if(h){var d,f,g,v;const M=(d=h?.message)!==null&&d!==void 0?d:"",S=(f=h?.code)!==null&&f!==void 0?f:"";l=`${(g=o?.name)!==null&&g!==void 0?g:"FetchError"}: ${o?.message}`,l+=`

Caused by: ${(v=h?.name)!==null&&v!==void 0?v:"Error"}: ${M}`,S&&(l+=` (${S})`),h?.stack&&(l+=`
${h.stack}`)}else{var m;l=(m=o?.stack)!==null&&m!==void 0?m:""}const p=this.url.toString().length;return o?.name==="AbortError"||o?.code==="ABORT_ERR"?(u="",c="Request was aborted (timeout or manual cancellation)",p>this.urlLengthLimit&&(c+=`. Note: Your request URL is ${p} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)):(h?.name==="HeadersOverflowError"||h?.code==="UND_ERR_HEADERS_OVERFLOW")&&(u="",c="HTTP headers exceeded server limits (typically 16KB)",p>this.urlLengthLimit&&(c+=`. Your request URL is ${p} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),{success:!1,error:{message:`${(a=o?.name)!==null&&a!==void 0?a:"FetchError"}: ${o?.message}`,details:l,hint:c,code:u},data:null,count:null,status:0,statusText:""}})),s.then(n,e)}async processResponse(n){var e=this;let t=null,i=null,r=null,s=n.status,o=n.statusText;if(n.ok){var a,l;if(e.method!=="HEAD"){var c;const f=await n.text();if(f!=="")if(e.headers.get("Accept")==="text/csv")i=f;else if(e.headers.get("Accept")&&(!((c=e.headers.get("Accept"))===null||c===void 0)&&c.includes("application/vnd.pgrst.plan+text")))i=f;else try{i=JSON.parse(f)}catch{if(t={message:f},i=null,e.shouldThrowOnError)throw new hr({message:f,details:"",hint:"",code:""})}}const h=(a=e.headers.get("Prefer"))===null||a===void 0?void 0:a.match(/count=(exact|planned|estimated)/),d=(l=n.headers.get("content-range"))===null||l===void 0?void 0:l.split("/");if(h&&d&&d.length>1&&(r=parseInt(d[1])),e.isMaybeSingle&&Array.isArray(i))if(i.length>1){if(t={code:"PGRST116",details:`Results contain ${i.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},i=null,r=null,s=406,o="Not Acceptable",e.shouldThrowOnError){var u;throw new hr(bi(bi({},t),{},{hint:(u=t.hint)!==null&&u!==void 0?u:""}))}}else i.length===1?i=i[0]:i=null}else{const h=await n.text();try{t=JSON.parse(h),Array.isArray(t)&&n.status===404&&(i=[],t=null,s=200,o="OK")}catch{n.status===404&&h===""?(s=204,o="No Content"):t={message:h}}if(t&&e.shouldThrowOnError)throw new hr(t)}return{success:t===null,error:t,data:i,count:r,status:s,statusText:o}}returns(){return this}overrideTypes(){return this}},jS=class extends GS{throwOnError(){return super.throwOnError()}select(n){let e=!1;const t=(n??"*").split("").map(i=>/\s/.test(i)&&!e?"":(i==='"'&&(e=!e),i)).join("");return this.url.searchParams.set("select",t),this.headers.append("Prefer","return=representation"),this}order(n,{ascending:e=!0,nullsFirst:t,foreignTable:i,referencedTable:r=i}={}){const s=r?`${r}.order`:"order",o=this.url.searchParams.get(s);return this.url.searchParams.set(s,`${o?`${o},`:""}${n}.${e?"asc":"desc"}${t===void 0?"":t?".nullsfirst":".nullslast"}`),this}limit(n,{foreignTable:e,referencedTable:t=e}={}){const i=typeof t>"u"?"limit":`${t}.limit`;return this.url.searchParams.set(i,`${n}`),this}range(n,e,{foreignTable:t,referencedTable:i=t}={}){const r=typeof i>"u"?"offset":`${i}.offset`,s=typeof i>"u"?"limit":`${i}.limit`;return this.url.searchParams.set(r,`${n}`),this.url.searchParams.set(s,`${e-n+1}`),this}abortSignal(n){return this.signal=n,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:n=!1,verbose:e=!1,settings:t=!1,buffers:i=!1,wal:r=!1,format:s="text"}={}){var o;const a=[n?"analyze":null,e?"verbose":null,t?"settings":null,i?"buffers":null,r?"wal":null].filter(Boolean).join("|"),l=(o=this.headers.get("Accept"))!==null&&o!==void 0?o:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${s}; for="${l}"; options=${a};`),s==="json"?this:this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(n){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${n}`),this}};const Wu=new RegExp("[,()]");var tr=class extends jS{throwOnError(){return super.throwOnError()}eq(n,e){return this.url.searchParams.append(n,`eq.${e}`),this}neq(n,e){return this.url.searchParams.append(n,`neq.${e}`),this}gt(n,e){return this.url.searchParams.append(n,`gt.${e}`),this}gte(n,e){return this.url.searchParams.append(n,`gte.${e}`),this}lt(n,e){return this.url.searchParams.append(n,`lt.${e}`),this}lte(n,e){return this.url.searchParams.append(n,`lte.${e}`),this}like(n,e){return this.url.searchParams.append(n,`like.${e}`),this}likeAllOf(n,e){return this.url.searchParams.append(n,`like(all).{${e.join(",")}}`),this}likeAnyOf(n,e){return this.url.searchParams.append(n,`like(any).{${e.join(",")}}`),this}ilike(n,e){return this.url.searchParams.append(n,`ilike.${e}`),this}ilikeAllOf(n,e){return this.url.searchParams.append(n,`ilike(all).{${e.join(",")}}`),this}ilikeAnyOf(n,e){return this.url.searchParams.append(n,`ilike(any).{${e.join(",")}}`),this}regexMatch(n,e){return this.url.searchParams.append(n,`match.${e}`),this}regexIMatch(n,e){return this.url.searchParams.append(n,`imatch.${e}`),this}is(n,e){return this.url.searchParams.append(n,`is.${e}`),this}isDistinct(n,e){return this.url.searchParams.append(n,`isdistinct.${e}`),this}in(n,e){const t=Array.from(new Set(e)).map(i=>typeof i=="string"&&Wu.test(i)?`"${i}"`:`${i}`).join(",");return this.url.searchParams.append(n,`in.(${t})`),this}notIn(n,e){const t=Array.from(new Set(e)).map(i=>typeof i=="string"&&Wu.test(i)?`"${i}"`:`${i}`).join(",");return this.url.searchParams.append(n,`not.in.(${t})`),this}contains(n,e){return typeof e=="string"?this.url.searchParams.append(n,`cs.${e}`):Array.isArray(e)?this.url.searchParams.append(n,`cs.{${e.join(",")}}`):this.url.searchParams.append(n,`cs.${JSON.stringify(e)}`),this}containedBy(n,e){return typeof e=="string"?this.url.searchParams.append(n,`cd.${e}`):Array.isArray(e)?this.url.searchParams.append(n,`cd.{${e.join(",")}}`):this.url.searchParams.append(n,`cd.${JSON.stringify(e)}`),this}rangeGt(n,e){return this.url.searchParams.append(n,`sr.${e}`),this}rangeGte(n,e){return this.url.searchParams.append(n,`nxl.${e}`),this}rangeLt(n,e){return this.url.searchParams.append(n,`sl.${e}`),this}rangeLte(n,e){return this.url.searchParams.append(n,`nxr.${e}`),this}rangeAdjacent(n,e){return this.url.searchParams.append(n,`adj.${e}`),this}overlaps(n,e){return typeof e=="string"?this.url.searchParams.append(n,`ov.${e}`):this.url.searchParams.append(n,`ov.{${e.join(",")}}`),this}textSearch(n,e,{config:t,type:i}={}){let r="";i==="plain"?r="pl":i==="phrase"?r="ph":i==="websearch"&&(r="w");const s=t===void 0?"":`(${t})`;return this.url.searchParams.append(n,`${r}fts${s}.${e}`),this}match(n){return Object.entries(n).filter(([e,t])=>t!==void 0).forEach(([e,t])=>{this.url.searchParams.append(e,`eq.${t}`)}),this}not(n,e,t){return this.url.searchParams.append(n,`not.${e}.${t}`),this}or(n,{foreignTable:e,referencedTable:t=e}={}){const i=t?`${t}.or`:"or";return this.url.searchParams.append(i,`(${n})`),this}filter(n,e,t){return this.url.searchParams.append(n,`${e}.${t}`),this}},WS=class{constructor(n,{headers:e={},schema:t,fetch:i,urlLengthLimit:r=8e3,retry:s}){this.url=n,this.headers=new Headers(e),this.schema=t,this.fetch=i,this.urlLengthLimit=r,this.retry=s}cloneRequestState(){return{url:new URL(this.url.toString()),headers:new Headers(this.headers)}}select(n,e){const{head:t=!1,count:i}=e??{},r=t?"HEAD":"GET";let s=!1;const o=(n??"*").split("").map(c=>/\s/.test(c)&&!s?"":(c==='"'&&(s=!s),c)).join(""),{url:a,headers:l}=this.cloneRequestState();return a.searchParams.set("select",o),i&&l.append("Prefer",`count=${i}`),new tr({method:r,url:a,headers:l,schema:this.schema,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}insert(n,{count:e,defaultToNull:t=!0}={}){var i;const r="POST",{url:s,headers:o}=this.cloneRequestState();if(e&&o.append("Prefer",`count=${e}`),t||o.append("Prefer","missing=default"),Array.isArray(n)){const a=n.reduce((l,c)=>l.concat(Object.keys(c)),[]);if(a.length>0){const l=[...new Set(a)].map(c=>`"${c}"`);s.searchParams.set("columns",l.join(","))}}return new tr({method:r,url:s,headers:o,schema:this.schema,body:n,fetch:(i=this.fetch)!==null&&i!==void 0?i:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}upsert(n,{onConflict:e,ignoreDuplicates:t=!1,count:i,defaultToNull:r=!0}={}){var s;const o="POST",{url:a,headers:l}=this.cloneRequestState();if(l.append("Prefer",`resolution=${t?"ignore":"merge"}-duplicates`),e!==void 0&&a.searchParams.set("on_conflict",e),i&&l.append("Prefer",`count=${i}`),r||l.append("Prefer","missing=default"),Array.isArray(n)){const c=n.reduce((u,h)=>u.concat(Object.keys(h)),[]);if(c.length>0){const u=[...new Set(c)].map(h=>`"${h}"`);a.searchParams.set("columns",u.join(","))}}return new tr({method:o,url:a,headers:l,schema:this.schema,body:n,fetch:(s=this.fetch)!==null&&s!==void 0?s:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}update(n,{count:e}={}){var t;const i="PATCH",{url:r,headers:s}=this.cloneRequestState();return e&&s.append("Prefer",`count=${e}`),new tr({method:i,url:r,headers:s,schema:this.schema,body:n,fetch:(t=this.fetch)!==null&&t!==void 0?t:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}delete({count:n}={}){var e;const t="DELETE",{url:i,headers:r}=this.cloneRequestState();return n&&r.append("Prefer",`count=${n}`),new tr({method:t,url:i,headers:r,schema:this.schema,fetch:(e=this.fetch)!==null&&e!==void 0?e:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};function $S(n,e){try{const o=JSON.parse(n);if(o&&typeof o=="object"&&!Array.isArray(o)){var t,i,r,s;return new hr({message:String((t=o.message)!==null&&t!==void 0?t:n),details:(i=o.details)!==null&&i!==void 0?i:"",hint:(r=o.hint)!==null&&r!==void 0?r:"",code:(s=o.code)!==null&&s!==void 0?s:""})}}catch{}return new hr({message:n||e,details:"",hint:"",code:""})}function $u(n,e,t){var i;const r=n;return{success:!1,error:new hr({message:`${(i=r?.name)!==null&&i!==void 0?i:"FetchError"}: ${r?.message}`,details:"",hint:"",code:""}),data:null,count:null,status:e,statusText:t}}var qS=class Rd{constructor(e,{headers:t={},schema:i,fetch:r,timeout:s,urlLengthLimit:o=8e3,retry:a}={}){this.url=e,this.headers=new Headers(t),this.schemaName=i,this.urlLengthLimit=o;const l=r??globalThis.fetch;s!==void 0&&s>0?this.fetch=(c,u)=>{const h=new AbortController,d=setTimeout(()=>h.abort(),s),f=u?.signal;if(f){if(f.aborted)return clearTimeout(d),l(c,u);const g=()=>{clearTimeout(d),h.abort()};return f.addEventListener("abort",g,{once:!0}),l(c,bi(bi({},u),{},{signal:h.signal})).finally(()=>{clearTimeout(d),f.removeEventListener("abort",g)})}return l(c,bi(bi({},u),{},{signal:h.signal})).finally(()=>clearTimeout(d))}:this.fetch=l,this.retry=a}from(e){if(!e||typeof e!="string"||e.trim()==="")throw new Error("Invalid relation name: relation must be a non-empty string.");return new WS(new URL(`${this.url}/${e}`),{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}schema(e){return new Rd(this.url,{headers:this.headers,schema:e,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}async getOpenApiSpec(){var e=this,t;const i=new Headers(e.headers);i.set("Accept","application/openapi+json"),e.schemaName&&i.set("Accept-Profile",e.schemaName);const r={};i.forEach((c,u)=>{r[u]=c});const s=(t=e.fetch)!==null&&t!==void 0?t:globalThis.fetch;let o;try{var a;o=await Ad(s,`${e.url}/`,{method:"GET",headers:r},(a=e.retry)!==null&&a!==void 0?a:!0)}catch(c){return $u(c,0,"")}let l;try{l=await o.text()}catch(c){return $u(c,o.status,o.statusText)}if(o.ok)try{return{success:!0,error:null,data:JSON.parse(l),count:null,status:o.status,statusText:o.statusText}}catch{}return{success:!1,error:$S(l,o.statusText),data:null,count:null,status:o.status,statusText:o.statusText}}rpc(e,t={},{head:i=!1,get:r=!1,count:s}={}){var o;let a;const l=new URL(`${this.url}/rpc/${e}`);let c;const u=f=>f!==null&&typeof f=="object"&&(!Array.isArray(f)||f.some(u)),h=i&&Object.values(t).some(u);h?(a="POST",c=t):i||r?(a=i?"HEAD":"GET",Object.entries(t).filter(([f,g])=>g!==void 0).map(([f,g])=>[f,Array.isArray(g)?`{${g.join(",")}}`:`${g}`]).forEach(([f,g])=>{l.searchParams.append(f,g)})):(a="POST",c=t);const d=new Headers(this.headers);return h?d.set("Prefer",s?`count=${s},return=minimal`:"return=minimal"):s&&d.set("Prefer",`count=${s}`),new tr({method:a,url:l,headers:d,schema:this.schemaName,body:c,fetch:(o=this.fetch)!==null&&o!==void 0?o:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};class XS{constructor(){}static detectEnvironment(){var e;if(typeof WebSocket<"u")return{type:"native",wsConstructor:WebSocket};const t=globalThis;if(typeof globalThis<"u"&&typeof t.WebSocket<"u")return{type:"native",wsConstructor:t.WebSocket};const i=typeof global<"u"?global:void 0;if(i&&typeof i.WebSocket<"u")return{type:"native",wsConstructor:i.WebSocket};if(typeof globalThis<"u"&&typeof t.WebSocketPair<"u"&&typeof globalThis.WebSocket>"u")return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if(typeof globalThis<"u"&&t.EdgeRuntime||typeof navigator<"u"&&(!((e=navigator.userAgent)===null||e===void 0)&&e.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};const r=globalThis.process;if(r){const s=r.versions;if(s&&s.node)return{type:"unsupported",error:"Node.js detected but native WebSocket not found.",workaround:"Ensure you are running Node.js 22+ or provide a WebSocket implementation via the transport option."}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const e=this.detectEnvironment();if(e.wsConstructor)return e.wsConstructor;let t=e.error||"WebSocket not supported in this environment.";throw e.workaround&&(t+=`

Suggested solution: ${e.workaround}`),new Error(t)}static isWebSocketSupported(){try{return this.detectEnvironment().type==="native"}catch{return!1}}}const KS="2.117.1",YS=`realtime-js/${KS}`,JS="1.0.0",Cd="2.0.0",ZS=Cd,QS=1e4,ew=15e3,tw=1e4,nw=100,ei={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},Pd={close:"phx_close",error:"phx_error",join:"phx_join",leave:"phx_leave",access_token:"access_token"},kl={connecting:"connecting",closing:"closing",closed:"closed"};class iw{constructor(e){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT="broadcast",this.allowedMetadataKeys=[],this.allowedMetadataKeys=e??[]}encode(e,t){if(e.event===this.BROADCAST_EVENT&&!(e.payload instanceof ArrayBuffer)&&typeof e.payload.event=="string")return t(this._binaryEncodeUserBroadcastPush(e));let i=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(i))}_binaryEncodeUserBroadcastPush(e){var t;return this._isArrayBuffer((t=e.payload)===null||t===void 0?void 0:t.payload)?this._encodeBinaryUserBroadcastPush(e):this._encodeJsonUserBroadcastPush(e)}_encodeBinaryUserBroadcastPush(e){var t,i;const r=(i=(t=e.payload)===null||t===void 0?void 0:t.payload)!==null&&i!==void 0?i:new ArrayBuffer(0);return this._encodeUserBroadcastPush(e,this.BINARY_ENCODING,r)}_encodeJsonUserBroadcastPush(e){var t,i;const r=(i=(t=e.payload)===null||t===void 0?void 0:t.payload)!==null&&i!==void 0?i:{},o=new TextEncoder().encode(JSON.stringify(r)).buffer;return this._encodeUserBroadcastPush(e,this.JSON_ENCODING,o)}_encodeUserBroadcastPush(e,t,i){var r,s;const o=new TextEncoder,a=o.encode(e.topic),l=o.encode((r=e.ref)!==null&&r!==void 0?r:""),c=o.encode((s=e.join_ref)!==null&&s!==void 0?s:""),u=o.encode(e.payload.event),h=this.allowedMetadataKeys?this._pick(e.payload,this.allowedMetadataKeys):{},d=o.encode(Object.keys(h).length===0?"":JSON.stringify(h));if(c.length>255)throw new Error(`joinRef length ${c.length} exceeds maximum of 255`);if(l.length>255)throw new Error(`ref length ${l.length} exceeds maximum of 255`);if(a.length>255)throw new Error(`topic length ${a.length} exceeds maximum of 255`);if(u.length>255)throw new Error(`userEvent length ${u.length} exceeds maximum of 255`);if(d.length>255)throw new Error(`metadata length ${d.length} exceeds maximum of 255`);const f=this.USER_BROADCAST_PUSH_META_LENGTH+c.length+l.length+a.length+u.length+d.length,g=new ArrayBuffer(this.HEADER_LENGTH+f),v=new DataView(g),m=new Uint8Array(g);let p=0;v.setUint8(p++,this.KINDS.userBroadcastPush),v.setUint8(p++,c.length),v.setUint8(p++,l.length),v.setUint8(p++,a.length),v.setUint8(p++,u.length),v.setUint8(p++,d.length),v.setUint8(p++,t),m.set(c,p),p+=c.length,m.set(l,p),p+=l.length,m.set(a,p),p+=a.length,m.set(u,p),p+=u.length,m.set(d,p),p+=d.length;var M=new Uint8Array(g.byteLength+i.byteLength);return M.set(new Uint8Array(g),0),M.set(new Uint8Array(i),g.byteLength),M.buffer}decode(e,t){if(this._isArrayBuffer(e)){let i=this._binaryDecode(e);return t(i)}if(typeof e=="string"){const i=JSON.parse(e),[r,s,o,a,l]=i;return t({join_ref:r,ref:s,topic:o,event:a,payload:l})}return t({})}_binaryDecode(e){const t=new DataView(e),i=t.getUint8(0),r=new TextDecoder;if(i===this.KINDS.userBroadcast)return this._decodeUserBroadcast(e,t,r)}_decodeUserBroadcast(e,t,i){const r=t.getUint8(1),s=t.getUint8(2),o=t.getUint8(3),a=t.getUint8(4);let l=this.HEADER_LENGTH+4;const c=i.decode(e.slice(l,l+r));l=l+r;const u=i.decode(e.slice(l,l+s));l=l+s;const h=i.decode(e.slice(l,l+o));l=l+o;const d=e.slice(l,e.byteLength),f=a===this.JSON_ENCODING?JSON.parse(i.decode(d)):d,g={type:this.BROADCAST_EVENT,event:u,payload:f};return o>0&&(g.meta=JSON.parse(h)),{join_ref:null,ref:null,topic:c,event:this.BROADCAST_EVENT,payload:g}}_isArrayBuffer(e){var t;return e instanceof ArrayBuffer||((t=e?.constructor)===null||t===void 0?void 0:t.name)==="ArrayBuffer"}_pick(e,t){return!e||typeof e!="object"?{}:Object.fromEntries(Object.entries(e).filter(([i])=>t.includes(i)))}}var at;(function(n){n.abstime="abstime",n.bool="bool",n.date="date",n.daterange="daterange",n.float4="float4",n.float8="float8",n.int2="int2",n.int4="int4",n.int4range="int4range",n.int8="int8",n.int8range="int8range",n.json="json",n.jsonb="jsonb",n.money="money",n.numeric="numeric",n.oid="oid",n.reltime="reltime",n.text="text",n.time="time",n.timestamp="timestamp",n.timestamptz="timestamptz",n.timetz="timetz",n.tsrange="tsrange",n.tstzrange="tstzrange"})(at||(at={}));const qu=(n,e,t={})=>{var i;const r=(i=t.skipTypes)!==null&&i!==void 0?i:[];return e?Object.keys(e).reduce((s,o)=>(s[o]=rw(o,n,e,r),s),{}):{}},rw=(n,e,t,i)=>{const r=e.find(a=>a.name===n),s=r?.type,o=t[n];return s&&!i.includes(s)?Id(s,o):Fl(o)},Id=(n,e)=>{if(n.charAt(0)==="_"){const t=n.slice(1,n.length);return lw(e,t)}switch(n){case at.bool:return sw(e);case at.float4:case at.float8:case at.int2:case at.int4:case at.int8:case at.numeric:case at.oid:return ow(e);case at.json:case at.jsonb:return aw(e);case at.timestamp:return cw(e);case at.abstime:case at.date:case at.daterange:case at.int4range:case at.int8range:case at.money:case at.reltime:case at.text:case at.time:case at.timestamptz:case at.timetz:case at.tsrange:case at.tstzrange:return Fl(e);default:return Fl(e)}},Fl=n=>n,sw=n=>{switch(n){case"t":return!0;case"f":return!1;default:return n}},ow=n=>{if(typeof n=="string"){const e=parseFloat(n);if(!Number.isNaN(e))return e}return n},aw=n=>{if(typeof n=="string")try{return JSON.parse(n)}catch{return n}return n},lw=(n,e)=>{if(typeof n!="string")return n;const t=n.length-1,i=n[t];if(n[0]==="{"&&i==="}"){let s;const o=n.slice(1,t);try{s=JSON.parse("["+o+"]")}catch{s=o?o.split(","):[]}return s.map(a=>Id(e,a))}return n},cw=n=>typeof n=="string"?n.replace(" ","T"):n,Ld=n=>{const e=new URL(n);return e.protocol=e.protocol.replace(/^ws/i,"http"),e.pathname=e.pathname.replace(/\/+$/,"").replace(/\/socket\/websocket$/i,"").replace(/\/socket$/i,"").replace(/\/websocket$/i,""),e.pathname===""||e.pathname==="/"?e.pathname="/api/broadcast":e.pathname=e.pathname+"/api/broadcast",e.href};var dr=n=>typeof n=="function"?n:function(){return n},uw=typeof self<"u"?self:null,nr=typeof window<"u"?window:null,mn=uw||nr||globalThis,hw="2.0.0",dw=1e4,fw=1e3,pw=100,_n={connecting:0,open:1,closing:2,closed:3},Ft={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},Nn={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},Bl={longpoll:"longpoll",websocket:"websocket"},mw={complete:4},zl="base64url.bearer.phx.",Zs=class{constructor(n,e,t,i){this.channel=n,this.event=e,this.payload=t||function(){return{}},this.receivedResp=null,this.timeout=i,this.timeoutTimer=null,this.recHooks=[],this.sent=!1,this.ref=void 0}resend(n){this.timeout=n,this.reset(),this.send()}send(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}receive(n,e){return this.hasReceived(n)&&e(this.receivedResp.response),this.recHooks.push({status:n,callback:e}),this}reset(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}destroy(){this.cancelRefEvent(),this.cancelTimeout()}matchReceive({status:n,response:e,_ref:t}){this.recHooks.filter(i=>i.status===n).forEach(i=>i.callback(e))}cancelRefEvent(){this.refEvent&&this.channel.off(this.refEvent)}cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}startTimeout(){this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,n=>{this.cancelRefEvent(),this.cancelTimeout(),this.receivedResp=n,this.matchReceive(n)}),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}hasReceived(n){return this.receivedResp&&this.receivedResp.status===n}trigger(n,e){this.channel.trigger(this.refEvent,{status:n,response:e})}},Dd=class{constructor(n,e){this.callback=n,this.timerCalc=e,this.timer=void 0,this.tries=0}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}},gw=class{constructor(n,e,t){this.state=Ft.closed,this.topic=n,this.params=dr(e||{}),this.socket=t,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new Zs(this,Nn.join,this.params,this.timeout),this.pushBuffer=[],this.stateChangeRefs=[],this.rejoinTimer=new Dd(()=>{this.socket.isConnected()&&this.rejoin()},this.socket.rejoinAfterMs),this.stateChangeRefs.push(this.socket.onError(()=>this.rejoinTimer.reset())),this.stateChangeRefs.push(this.socket.onOpen(()=>{this.rejoinTimer.reset(),this.isErrored()&&this.rejoin()})),this.joinPush.receive("ok",()=>{this.state=Ft.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(i=>i.send()),this.pushBuffer=[]}),this.joinPush.receive("error",i=>{this.state=Ft.errored,this.socket.hasLogger()&&this.socket.log("channel",`error ${this.topic}`,i),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.hasLogger()&&this.socket.log("channel",`close ${this.topic}`),this.state=Ft.closed,this.socket.remove(this)}),this.onError(i=>{this.socket.hasLogger()&&this.socket.log("channel",`error ${this.topic}`,i),this.isJoining()&&this.joinPush.reset(),this.state=Ft.errored,this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.joinPush.receive("timeout",()=>{this.socket.hasLogger()&&this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),new Zs(this,Nn.leave,dr({}),this.timeout).send(),this.state=Ft.errored,this.joinPush.reset(),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.on(Nn.reply,(i,r)=>{this.trigger(this.replyEventName(r),i)})}join(n=this.timeout){if(this.joinedOnce)throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");return this.timeout=n,this.joinedOnce=!0,this.rejoin(),this.joinPush}teardown(){this.pushBuffer.forEach(n=>n.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=Ft.closed,this.bindings=[]}onClose(n){this.on(Nn.close,n)}onError(n){return this.on(Nn.error,e=>n(e))}on(n,e){let t=this.bindingRef++;return this.bindings.push({event:n,ref:t,callback:e}),t}off(n,e){this.bindings=this.bindings.filter(t=>!(t.event===n&&(typeof e>"u"||e===t.ref)))}canPush(){return this.socket.isConnected()&&this.isJoined()}push(n,e,t=this.timeout){if(e=e||{},!this.joinedOnce)throw new Error(`tried to push '${n}' to '${this.topic}' before joining. Use channel.join() before pushing events`);let i=new Zs(this,n,function(){return e},t);return this.canPush()?i.send():(i.startTimeout(),this.pushBuffer.push(i)),i}leave(n=this.timeout){this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=Ft.leaving;let e=()=>{this.socket.hasLogger()&&this.socket.log("channel",`leave ${this.topic}`),this.trigger(Nn.close,"leave")},t=new Zs(this,Nn.leave,dr({}),n);return t.receive("ok",()=>e()).receive("timeout",()=>e()),t.send(),this.canPush()||t.trigger("ok",{}),t}onMessage(n,e,t){return e}filterBindings(n,e,t){return!0}isMember(n,e,t,i){return this.topic!==n?!1:i&&i!==this.joinRef()?(this.socket.hasLogger()&&this.socket.log("channel","dropping outdated message",{topic:n,event:e,payload:t,joinRef:i}),!1):!0}joinRef(){return this.joinPush.ref}rejoin(n=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=Ft.joining,this.joinPush.resend(n))}trigger(n,e,t,i){let r=this.onMessage(n,e,t,i);if(e&&!r)throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");let s=this.bindings.filter(o=>o.event===n&&this.filterBindings(o,e,t));for(let o=0;o<s.length;o++)s[o].callback(r,t,i||this.joinRef())}replyEventName(n){return`chan_reply_${n}`}isClosed(){return this.state===Ft.closed}isErrored(){return this.state===Ft.errored}isJoined(){return this.state===Ft.joined}isJoining(){return this.state===Ft.joining}isLeaving(){return this.state===Ft.leaving}},xo=class{static request(n,e,t,i,r,s,o){if(mn.XDomainRequest){let a=new mn.XDomainRequest;return this.xdomainRequest(a,n,e,i,r,s,o)}else if(mn.XMLHttpRequest){let a=new mn.XMLHttpRequest;return this.xhrRequest(a,n,e,t,i,r,s,o)}else{if(mn.fetch&&mn.AbortController)return this.fetchRequest(n,e,t,i,r,s,o);throw new Error("No suitable XMLHttpRequest implementation found")}}static fetchRequest(n,e,t,i,r,s,o){let a={method:n,headers:t,body:i},l=null;return r&&(l=new AbortController,setTimeout(()=>l.abort(),r),a.signal=l.signal),mn.fetch(e,a).then(c=>c.text()).then(c=>this.parseJSON(c)).then(c=>o&&o(c)).catch(c=>{c.name==="AbortError"&&s?s():o&&o(null)}),l}static xdomainRequest(n,e,t,i,r,s,o){return n.timeout=r,n.open(e,t),n.onload=()=>{let a=this.parseJSON(n.responseText);o&&o(a)},s&&(n.ontimeout=s),n.onprogress=()=>{},n.send(i),n}static xhrRequest(n,e,t,i,r,s,o,a){n.open(e,t,!0),n.timeout=s;for(let[l,c]of Object.entries(i))n.setRequestHeader(l,c);return n.onerror=()=>a&&a(null),n.onreadystatechange=()=>{if(n.readyState===mw.complete&&a){let l=this.parseJSON(n.responseText);a(l)}},o&&(n.ontimeout=o),n.send(r),n}static parseJSON(n){if(!n||n==="")return null;try{return JSON.parse(n)}catch{return console&&console.log("failed to parse JSON response",n),null}}static serialize(n,e){let t=[];for(var i in n){if(!Object.prototype.hasOwnProperty.call(n,i))continue;let r=e?`${e}[${i}]`:i,s=n[i];typeof s=="object"?t.push(this.serialize(s,r)):t.push(encodeURIComponent(r)+"="+encodeURIComponent(s))}return t.join("&")}static appendParams(n,e){if(Object.keys(e).length===0)return n;let t=n.match(/\?/)?"&":"?";return`${n}${t}${this.serialize(e)}`}},_w=n=>{let e="",t=new Uint8Array(n),i=t.byteLength;for(let r=0;r<i;r++)e+=String.fromCharCode(t[r]);return btoa(e)},Yi=class{constructor(n,e){e&&e.length===2&&e[1].startsWith(zl)&&(this.authToken=atob(e[1].slice(zl.length))),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.reqs=new Set,this.awaitingBatchAck=!1,this.currentBatch=null,this.currentBatchTimer=null,this.batchBuffer=[],this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(n),this.readyState=_n.connecting,setTimeout(()=>this.poll(),0)}normalizeEndpoint(n){return n.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+Bl.websocket),"$1/"+Bl.longpoll)}endpointURL(){return xo.appendParams(this.pollEndpoint,{token:this.token})}closeAndRetry(n,e,t){this.close(n,e,t),this.readyState=_n.connecting}ontimeout(){this.onerror("timeout"),this.closeAndRetry(1005,"timeout",!1)}isActive(){return this.readyState===_n.open||this.readyState===_n.connecting}poll(){const n={Accept:"application/json"};this.authToken&&(n["X-Phoenix-AuthToken"]=this.authToken),this.ajax("GET",n,null,()=>this.ontimeout(),e=>{if(e){var{status:t,token:i,messages:r}=e;if(t===410&&this.token!==null){this.onerror(410),this.closeAndRetry(3410,"session_gone",!1);return}this.token=i}else t=0;switch(t){case 200:r.forEach(s=>{setTimeout(()=>this.onmessage({data:s}),0)}),this.poll();break;case 204:this.poll();break;case 410:this.readyState=_n.open,this.onopen({}),this.poll();break;case 403:this.onerror(403),this.close(1008,"forbidden",!1);break;case 0:case 500:this.onerror(500),this.closeAndRetry(1011,"internal server error",500);break;default:throw new Error(`unhandled poll status ${t}`)}})}send(n){typeof n!="string"&&(n=_w(n)),this.currentBatch?this.currentBatch.push(n):this.awaitingBatchAck?this.batchBuffer.push(n):(this.currentBatch=[n],this.currentBatchTimer=setTimeout(()=>{this.batchSend(this.currentBatch),this.currentBatch=null},0))}batchSend(n,e=0){this.awaitingBatchAck=!0;const t=e+pw,i=n.slice(e,t);this.ajax("POST",{"Content-Type":"application/x-ndjson"},i.join(`
`),()=>this.onerror("timeout"),r=>{!r||r.status!==200?(this.awaitingBatchAck=!1,this.onerror(r&&r.status),this.closeAndRetry(1011,"internal server error",!1)):t<n.length?this.batchSend(n,t):this.batchBuffer.length>0?(this.batchSend(this.batchBuffer),this.batchBuffer=[]):this.awaitingBatchAck=!1})}close(n,e,t){for(let r of this.reqs)r.abort();this.readyState=_n.closed;let i=Object.assign({code:1e3,reason:void 0,wasClean:!0},{code:n,reason:e,wasClean:t});this.batchBuffer=[],clearTimeout(this.currentBatchTimer),this.currentBatchTimer=null,typeof CloseEvent<"u"?this.onclose(new CloseEvent("close",i)):this.onclose(i)}ajax(n,e,t,i,r){let s,o=()=>{this.reqs.delete(s),i()};s=xo.request(n,this.endpointURL(),e,t,this.timeout,o,a=>{this.reqs.delete(s),this.isActive()&&r(a)}),this.reqs.add(s)}},vw=class Vr{constructor(e,t={}){let i=t.events||{state:"presence_state",diff:"presence_diff"};this.state=Object.create(null),this.pendingDiffs=[],this.channel=e,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(i.state,r=>{let{onJoin:s,onLeave:o,onSync:a}=this.caller;this.joinRef=this.channel.joinRef(),this.state=Vr.syncState(this.state,r,s,o),this.pendingDiffs.forEach(l=>{this.state=Vr.syncDiff(this.state,l,s,o)}),this.pendingDiffs=[],a()}),this.channel.on(i.diff,r=>{let{onJoin:s,onLeave:o,onSync:a}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(r):(this.state=Vr.syncDiff(this.state,r,s,o),a())})}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}list(e){return Vr.list(this.state,e)}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}static syncState(e,t,i,r){let s=this.toNullProtoObj(this.clone(e));t=this.toNullProtoObj(t);let o=Object.create(null),a=Object.create(null);return this.map(s,(l,c)=>{t[l]||(a[l]=c)}),this.map(t,(l,c)=>{let u=s[l];if(u){let h=c.metas.map(v=>v.phx_ref),d=u.metas.map(v=>v.phx_ref),f=c.metas.filter(v=>d.indexOf(v.phx_ref)<0),g=u.metas.filter(v=>h.indexOf(v.phx_ref)<0);f.length>0&&(o[l]=c,o[l].metas=f),g.length>0&&(a[l]=this.clone(u),a[l].metas=g)}else o[l]=c}),this.syncDiff(s,{joins:o,leaves:a},i,r)}static syncDiff(e,t,i,r){e=this.toNullProtoObj(e);let{joins:s,leaves:o}=this.clone(t);return i||(i=function(){}),r||(r=function(){}),this.map(s,(a,l)=>{let c=e[a];if(e[a]=this.clone(l),c){let u=e[a].metas.map(d=>d.phx_ref),h=c.metas.filter(d=>u.indexOf(d.phx_ref)<0);e[a].metas.unshift(...h)}i(a,c,l)}),this.map(o,(a,l)=>{let c=e[a];if(!c)return;let u=l.metas.map(h=>h.phx_ref);c.metas=c.metas.filter(h=>u.indexOf(h.phx_ref)<0),r(a,c,l),c.metas.length===0&&delete e[a]}),e}static list(e,t){return t||(t=function(i,r){return r}),this.map(e,(i,r)=>t(i,r))}static map(e,t){return Object.getOwnPropertyNames(e).map(i=>t(i,e[i]))}static toNullProtoObj(e){if(Object.getPrototypeOf(e)===null)return e;let t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(i=>{t[i]=e[i]}),t}static clone(e){return JSON.parse(JSON.stringify(e))}},Qs={HEADER_LENGTH:1,META_LENGTH:4,KINDS:{push:0,reply:1,broadcast:2},encode(n,e){if(n.payload.constructor===ArrayBuffer)return e(this.binaryEncode(n));{let t=[n.join_ref,n.ref,n.topic,n.event,n.payload];return e(JSON.stringify(t))}},decode(n,e){if(n.constructor===ArrayBuffer)return e(this.binaryDecode(n));{let[t,i,r,s,o]=JSON.parse(n);return e({join_ref:t,ref:i,topic:r,event:s,payload:o})}},binaryEncode(n){let{join_ref:e,ref:t,event:i,topic:r,payload:s}=n,o=new TextEncoder,a=o.encode(e),l=o.encode(t),c=o.encode(r),u=o.encode(i);this.assertFieldSize(a.byteLength,"join_ref"),this.assertFieldSize(l.byteLength,"ref"),this.assertFieldSize(c.byteLength,"topic"),this.assertFieldSize(u.byteLength,"event");let h=this.META_LENGTH+a.byteLength+l.byteLength+c.byteLength+u.byteLength,d=new ArrayBuffer(this.HEADER_LENGTH+h),f=new Uint8Array(d),g=new DataView(d),v=0;g.setUint8(v++,this.KINDS.push),g.setUint8(v++,a.byteLength),g.setUint8(v++,l.byteLength),g.setUint8(v++,c.byteLength),g.setUint8(v++,u.byteLength),f.set(a,v),v+=a.byteLength,f.set(l,v),v+=l.byteLength,f.set(c,v),v+=c.byteLength,f.set(u,v),v+=u.byteLength;var m=new Uint8Array(d.byteLength+s.byteLength);return m.set(f,0),m.set(new Uint8Array(s),d.byteLength),m.buffer},assertFieldSize(n,e){if(n>255)throw new Error(`unable to convert ${e} to binary: must be less than or equal to 255 bytes, but is ${n} bytes`)},binaryDecode(n){let e=new DataView(n),t=e.getUint8(0),i=new TextDecoder;switch(t){case this.KINDS.push:return this.decodePush(n,e,i);case this.KINDS.reply:return this.decodeReply(n,e,i);case this.KINDS.broadcast:return this.decodeBroadcast(n,e,i)}},decodePush(n,e,t){let i=e.getUint8(1),r=e.getUint8(2),s=e.getUint8(3),o=this.HEADER_LENGTH+this.META_LENGTH-1,a=t.decode(n.slice(o,o+i));o=o+i;let l=t.decode(n.slice(o,o+r));o=o+r;let c=t.decode(n.slice(o,o+s));o=o+s;let u=n.slice(o,n.byteLength);return{join_ref:a,ref:null,topic:l,event:c,payload:u}},decodeReply(n,e,t){let i=e.getUint8(1),r=e.getUint8(2),s=e.getUint8(3),o=e.getUint8(4),a=this.HEADER_LENGTH+this.META_LENGTH,l=t.decode(n.slice(a,a+i));a=a+i;let c=t.decode(n.slice(a,a+r));a=a+r;let u=t.decode(n.slice(a,a+s));a=a+s;let h=t.decode(n.slice(a,a+o));a=a+o;let d=n.slice(a,n.byteLength),f={status:h,response:d};return{join_ref:l,ref:c,topic:u,event:Nn.reply,payload:f}},decodeBroadcast(n,e,t){let i=e.getUint8(1),r=e.getUint8(2),s=this.HEADER_LENGTH+2,o=t.decode(n.slice(s,s+i));s=s+i;let a=t.decode(n.slice(s,s+r));s=s+r;let l=n.slice(s,n.byteLength);return{join_ref:null,ref:null,topic:o,event:a,payload:l}}},yw=class{constructor(n,e={}){this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.fallbackRef=null,this.timeout=e.timeout||dw,this.transport=e.transport||mn.WebSocket||Yi,this.conn=void 0,this.primaryPassedHealthCheck=!1,this.longPollFallbackMs=e.longPollFallbackMs,this.fallbackTimer=null;let t=null;try{t=mn&&mn.sessionStorage}catch{}this.sessionStore=e.sessionStorage||t,this.establishedConnections=0,this.defaultEncoder=Qs.encode.bind(Qs),this.defaultDecoder=Qs.decode.bind(Qs),this.closeWasClean=!0,this.disconnecting=!1,this.binaryType=e.binaryType||"arraybuffer",this.connectClock=1,this.pageHidden=!1,this.encode=void 0,this.decode=void 0,this.transport!==Yi?(this.encode=e.encode||this.defaultEncoder,this.decode=e.decode||this.defaultDecoder):(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder);let i=null;nr&&nr.addEventListener&&(nr.addEventListener("pagehide",r=>{this.conn&&(this.disconnect(),i=this.connectClock)}),nr.addEventListener("pageshow",r=>{i===this.connectClock&&(i=null,this.connect())}),nr.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"?this.pageHidden=!0:(this.pageHidden=!1,!this.isConnected()&&!this.closeWasClean&&this.teardown(()=>this.connect()))})),this.heartbeatIntervalMs=e.heartbeatIntervalMs||3e4,this.autoSendHeartbeat=e.autoSendHeartbeat??!0,this.heartbeatCallback=e.heartbeatCallback??(()=>{}),this.rejoinAfterMs=r=>e.rejoinAfterMs?e.rejoinAfterMs(r):[1e3,2e3,5e3][r-1]||1e4,this.reconnectAfterMs=r=>e.reconnectAfterMs?e.reconnectAfterMs(r):[10,50,100,150,200,250,500,1e3,2e3][r-1]||5e3,this.logger=e.logger||null,!this.logger&&e.debug&&(this.logger=(r,s,o)=>{console.log(`${r}: ${s}`,o)}),this.longpollerTimeout=e.longpollerTimeout||2e4,this.params=dr(e.params||{}),this.endPoint=`${n}/${Bl.websocket}`,this.vsn=e.vsn||hw,this.heartbeatTimeoutTimer=null,this.heartbeatTimer=null,this.heartbeatSentAt=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new Dd(()=>{if(this.pageHidden){this.log("Not reconnecting as page is hidden!"),this.teardown();return}this.teardown(async()=>{e.beforeReconnect&&await e.beforeReconnect(),this.connect()})},this.reconnectAfterMs),this.authToken=e.authToken&&dr(e.authToken)}getLongPollTransport(){return Yi}replaceTransport(n){this.connectClock++,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.conn&&(this.conn.close(),this.conn=null),this.transport=n}protocol(){return location.protocol.match(/^https/)?"wss":"ws"}endPointURL(){let n=xo.appendParams(xo.appendParams(this.endPoint,this.params()),{vsn:this.vsn});return n.charAt(0)!=="/"?n:n.charAt(1)==="/"?`${this.protocol()}:${n}`:`${this.protocol()}://${location.host}${n}`}disconnect(n,e,t){this.connectClock++,this.disconnecting=!0,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.teardown(()=>{this.disconnecting=!1,n&&n()},e,t)}connect(n){n&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=dr(n)),!(this.conn&&!this.disconnecting)&&(this.longPollFallbackMs&&this.transport!==Yi?this.connectWithFallback(Yi,this.longPollFallbackMs):this.transportConnect())}log(n,e,t){this.logger&&this.logger(n,e,t)}hasLogger(){return this.logger!==null}onOpen(n){let e=this.makeRef();return this.stateChangeCallbacks.open.push([e,n]),e}onClose(n){let e=this.makeRef();return this.stateChangeCallbacks.close.push([e,n]),e}onError(n){let e=this.makeRef();return this.stateChangeCallbacks.error.push([e,n]),e}onMessage(n){let e=this.makeRef();return this.stateChangeCallbacks.message.push([e,n]),e}onHeartbeat(n){this.heartbeatCallback=n}ping(n){if(!this.isConnected())return!1;let e=this.makeRef(),t=Date.now();this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:e});let i=this.onMessage(r=>{r.ref===e&&(this.off([i]),n(Date.now()-t))});return!0}transportName(n){return n===Yi?"LongPoll":n.name}transportConnect(){this.connectClock++,this.closeWasClean=!1;let n;this.authToken&&(n=["phoenix",`${zl}${btoa(this.authToken()).replace(/=/g,"")}`]),this.conn=new this.transport(this.endPointURL(),n),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=()=>this.onConnOpen(),this.conn.onerror=e=>this.onConnError(e),this.conn.onmessage=e=>this.onConnMessage(e),this.conn.onclose=e=>this.onConnClose(e)}getSession(n){return this.sessionStore&&this.sessionStore.getItem(n)}storeSession(n,e){this.sessionStore&&this.sessionStore.setItem(n,e)}connectWithFallback(n,e=2500){clearTimeout(this.fallbackTimer);let t=!1,i=!0,r,s,o=this.transportName(n),a=l=>{this.log("transport",`falling back to ${o}...`,l),this.off([r,s]),i=!1,this.replaceTransport(n),this.transportConnect()};if(this.getSession(`phx:fallback:${o}`))return a("memorized");this.fallbackTimer=setTimeout(a,e),s=this.onError(l=>{this.log("transport","error",l),i&&!t&&(clearTimeout(this.fallbackTimer),a(l))}),this.fallbackRef&&this.off([this.fallbackRef]),this.fallbackRef=this.onOpen(()=>{if(t=!0,!i){let l=this.transportName(n);return this.primaryPassedHealthCheck||this.storeSession(`phx:fallback:${l}`,"true"),this.log("transport",`established ${l} fallback`)}clearTimeout(this.fallbackTimer),this.fallbackTimer=setTimeout(a,e),this.ping(l=>{this.log("transport","connected to primary after",l),this.primaryPassedHealthCheck=!0,clearTimeout(this.fallbackTimer)})}),this.transportConnect()}clearHeartbeats(){clearTimeout(this.heartbeatTimer),clearTimeout(this.heartbeatTimeoutTimer)}onConnOpen(){this.hasLogger()&&this.log("transport",`connected to ${this.endPointURL()}`),this.closeWasClean=!1,this.disconnecting=!1,this.establishedConnections++,this.flushSendBuffer(),this.reconnectTimer.reset(),this.autoSendHeartbeat&&this.resetHeartbeat(),this.triggerStateCallbacks("open")}heartbeatTimeout(){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.hasLogger()&&this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(n){this.log("error","error in heartbeat callback",n)}this.triggerChanError(new Error("heartbeat timeout")),this.closeWasClean=!1,this.teardown(()=>this.reconnectTimer.scheduleTimeout(),fw,"heartbeat timeout")}}resetHeartbeat(){this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,this.clearHeartbeats(),this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}teardown(n,e,t){if(!this.conn)return n&&n();const i=this.conn;this.waitForBufferDone(i,()=>{e?i.close(e,t||""):i.close(),this.waitForSocketClosed(i,()=>{this.conn===i&&(this.conn.onopen=function(){},this.conn.onerror=function(){},this.conn.onmessage=function(){},this.conn.onclose=function(){},this.conn=null),n&&n()})})}waitForBufferDone(n,e,t=1){if(t===5||!n.bufferedAmount){e();return}setTimeout(()=>{this.waitForBufferDone(n,e,t+1)},150*t)}waitForSocketClosed(n,e,t=1){if(t===5||n.readyState===_n.closed){e();return}setTimeout(()=>{this.waitForSocketClosed(n,e,t+1)},150*t)}onConnClose(n){this.conn&&(this.conn.onclose=()=>{}),this.hasLogger()&&this.log("transport","close",n),this.triggerChanError(n),this.clearHeartbeats(),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.triggerStateCallbacks("close",n)}onConnError(n){this.hasLogger()&&this.log("transport","error",n);let e=this.transport,t=this.establishedConnections;this.triggerStateCallbacks("error",n,e,t),(e===this.transport||t>0)&&this.triggerChanError(n)}triggerChanError(n){this.channels.forEach(e=>{e.isErrored()||e.isLeaving()||e.isClosed()||e.trigger(Nn.error,n)})}connectionState(){switch(this.conn&&this.conn.readyState){case _n.connecting:return"connecting";case _n.open:return"open";case _n.closing:return"closing";default:return"closed"}}isConnected(){return this.connectionState()==="open"}remove(n){this.off(n.stateChangeRefs),this.channels=this.channels.filter(e=>e!==n)}off(n){for(let e in this.stateChangeCallbacks)this.stateChangeCallbacks[e]=this.stateChangeCallbacks[e].filter(([t])=>n.indexOf(t)===-1)}channel(n,e={}){let t=new gw(n,e,this);return this.channels.push(t),t}push(n){if(this.hasLogger()){let{topic:e,event:t,payload:i,ref:r,join_ref:s}=n;this.log("push",`${e} ${t} (${s}, ${r})`,i)}this.isConnected()?this.encode(n,e=>this.conn.send(e)):this.sendBuffer.push(()=>this.encode(n,e=>this.conn.send(e)))}makeRef(){let n=this.ref+1;return n===this.ref?this.ref=0:this.ref=n,this.ref.toString()}sendHeartbeat(){if(!this.isConnected()){try{this.heartbeatCallback("disconnected")}catch(n){this.log("error","error in heartbeat callback",n)}return}if(this.pendingHeartbeatRef){this.heartbeatTimeout();return}this.pendingHeartbeatRef=this.makeRef(),this.heartbeatSentAt=Date.now(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(n){this.log("error","error in heartbeat callback",n)}this.heartbeatTimeoutTimer=setTimeout(()=>this.heartbeatTimeout(),this.heartbeatIntervalMs)}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(n=>n()),this.sendBuffer=[])}onConnMessage(n){this.decode(n.data,e=>{let{topic:t,event:i,payload:r,ref:s,join_ref:o}=e;if(s&&s===this.pendingHeartbeatRef){const a=this.heartbeatSentAt?Date.now()-this.heartbeatSentAt:void 0;this.clearHeartbeats();try{this.heartbeatCallback(r.status==="ok"?"ok":"error",a)}catch(l){this.log("error","error in heartbeat callback",l)}this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.autoSendHeartbeat&&(this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}this.hasLogger()&&this.log("receive",`${r.status||""} ${t} ${i} ${s&&"("+s+")"||""}`.trim(),r);for(let a=0;a<this.channels.length;a++){const l=this.channels[a];l.isMember(t,i,r,o)&&l.trigger(i,r,s,o)}this.triggerStateCallbacks("message",e)})}triggerStateCallbacks(n,...e){try{this.stateChangeCallbacks[n].forEach(([t,i])=>{try{i(...e)}catch(r){this.log("error",`error in ${n} callback`,r)}})}catch(t){this.log("error",`error triggering ${n} callbacks`,t)}}leaveOpenTopic(n){let e=this.channels.find(t=>t.topic===n&&(t.isJoined()||t.isJoining()));e&&(this.hasLogger()&&this.log("transport",`leaving duplicate topic "${n}"`),e.leave())}};class Yr{constructor(e,t){const i=ww(t);this.presence=new vw(e.getChannel(),i),this.presence.onJoin((r,s,o)=>{const a=Yr.onJoinPayload(r,s,o);e.getChannel().trigger("presence",a)}),this.presence.onLeave((r,s,o)=>{const a=Yr.onLeavePayload(r,s,o);e.getChannel().trigger("presence",a)}),this.presence.onSync(()=>{e.getChannel().trigger("presence",{event:"sync"})})}get state(){return Yr.transformState(this.presence.state)}static transformState(e){return e=Sw(e),Object.getOwnPropertyNames(e).reduce((t,i)=>{const r=e[i];return t[i]=fo(r),t},{})}static onJoinPayload(e,t,i){const r=Xu(t),s=fo(i);return{event:"join",key:e,currentPresences:r,newPresences:s}}static onLeavePayload(e,t,i){const r=Xu(t),s=fo(i);return{event:"leave",key:e,currentPresences:r,leftPresences:s}}}function fo(n){return n.metas.map(e=>{const t=Object.getOwnPropertyDescriptors(e),i=Object.defineProperties({},t);return i.presence_ref=i.phx_ref,delete i.phx_ref,delete i.phx_ref_prev,i})}function Sw(n){return JSON.parse(JSON.stringify(n))}function ww(n){return n?.events&&{events:n.events}}function Xu(n){return n?.metas?fo(n):[]}var Ku;(function(n){n.SYNC="sync",n.JOIN="join",n.LEAVE="leave"})(Ku||(Ku={}));class xw{get state(){return this.presenceAdapter.state}constructor(e,t){this.channel=e,this.presenceAdapter=new Yr(this.channel.channelAdapter,t)}}function bw(n){if(n instanceof Error)return n;if(typeof n=="string")return new Error(n);if(n&&typeof n=="object"){const e=n;if(typeof e.code=="number"){const t=typeof e.reason=="string"&&e.reason?` (${e.reason})`:"";return new Error(`socket closed: ${e.code}${t}`,{cause:n})}return new Error("channel error: transport failure",{cause:n})}return new Error("channel error: connection lost")}class Ew{constructor(e,t,i){const r=Mw(i);this.channel=e.getSocket().channel(t,r),this.socket=e}get state(){return this.channel.state}set state(e){this.channel.state=e}get joinedOnce(){return this.channel.joinedOnce}get joinPush(){return this.channel.joinPush}get rejoinTimer(){return this.channel.rejoinTimer}on(e,t){return this.channel.on(e,t)}off(e,t){this.channel.off(e,t)}subscribe(e){return this.channel.join(e)}unsubscribe(e){return this.channel.leave(e)}teardown(){this.channel.teardown()}onClose(e){this.channel.onClose(e)}onError(e){return this.channel.onError(e)}push(e,t,i){let r;try{r=this.channel.push(e,t,i)}catch{throw new Error(`tried to push '${e}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`)}if(this.channel.pushBuffer.length>nw){const s=this.channel.pushBuffer.shift();s.cancelTimeout(),this.socket.log("channel",`discarded push due to buffer overflow: ${s.event}`,s.payload())}return r}updateJoinPayload(e){const t=this.channel.joinPush.payload();this.channel.joinPush.payload=()=>Object.assign(Object.assign({},t),e)}canPush(){return this.socket.isConnected()&&this.state===ei.joined}isJoined(){return this.state===ei.joined}isJoining(){return this.state===ei.joining}isClosed(){return this.state===ei.closed}isLeaving(){return this.state===ei.leaving}updateFilterBindings(e){this.channel.filterBindings=e}updatePayloadTransform(e){this.channel.onMessage=e}getChannel(){return this.channel}}function Mw(n){return{config:Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},n.config)}}const Tw=/[,()"\\]/,Aw=n=>Tw.test(n)||n!==n.trim(),Rw=n=>`"${n.replace(/\\/g,"\\\\").replace(/"/g,'\\"')}"`,Yu=n=>{const e=n===null?"null":String(n);return Aw(e)?Rw(e):e},Cw=n=>n===null?"null":String(n),Pw=(n,e)=>{if(n==="in"){const t=Array.isArray(e)?e:[e];if(t.length===0)throw new Error("Realtime `in` filter requires at least one value.");return`in.(${Array.from(new Set(t)).map(r=>Yu(r)).join(",")})`}return n==="is"?`is.${Cw(e)}`:`${n}.${Yu(e)}`};class Iw{constructor(){this.filters=[]}add(e,t,i,r=!1){const s=r?"not.":"";return this.filters.push(`${e}=${s}${Pw(t,i)}`),this}eq(e,t){return this.add(e,"eq",t)}neq(e,t){return this.add(e,"neq",t)}gt(e,t){return this.add(e,"gt",t)}gte(e,t){return this.add(e,"gte",t)}lt(e,t){return this.add(e,"lt",t)}lte(e,t){return this.add(e,"lte",t)}in(e,t){return this.add(e,"in",t)}like(e,t){return this.add(e,"like",t)}ilike(e,t){return this.add(e,"ilike",t)}match(e,t){return this.add(e,"match",t)}imatch(e,t){return this.add(e,"imatch",t)}is(e,t){return this.add(e,"is",t)}isDistinct(e,t){return this.add(e,"isdistinct",t)}not(e,t,i){return this.add(e,t,i,!0)}build(){return this.filters.join(",")}toString(){return this.build()}}var Ju;(function(n){n.ALL="*",n.INSERT="INSERT",n.UPDATE="UPDATE",n.DELETE="DELETE"})(Ju||(Ju={}));var Si;(function(n){n.BROADCAST="broadcast",n.PRESENCE="presence",n.POSTGRES_CHANGES="postgres_changes",n.SYSTEM="system"})(Si||(Si={}));var kn;(function(n){n.SUBSCRIBED="SUBSCRIBED",n.TIMED_OUT="TIMED_OUT",n.CLOSED="CLOSED",n.CHANNEL_ERROR="CHANNEL_ERROR"})(kn||(kn={}));class Fn{get state(){return this.channelAdapter.state}set state(e){this.channelAdapter.state=e}get joinedOnce(){return this.channelAdapter.joinedOnce}get timeout(){return this.socket.timeout}get joinPush(){return this.channelAdapter.joinPush}get rejoinTimer(){return this.channelAdapter.rejoinTimer}constructor(e,t={config:{}},i){var r,s;if(this.topic=e,this.params=t,this.socket=i,this.bindings={},this.subTopic=e.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},t.config),this.channelAdapter=new Ew(this.socket.socketAdapter,e,this.params),this.presence=new xw(this),this._onClose(()=>{this.socket._remove(this)}),this._updateFilterTransform(),this.broadcastEndpointURL=Ld(this.socket.socketAdapter.endPointURL()),this.private=this.params.config.private||!1,!this.private&&(!((s=(r=this.params.config)===null||r===void 0?void 0:r.broadcast)===null||s===void 0)&&s.replay))throw new Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`)}subscribe(e,t=this.timeout){var i,r,s,o;if(this.socket.isConnected()||this.socket.connect(),this.channelAdapter.isClosed()){const{config:{broadcast:a,presence:l,private:c,postgres_changes_options:u}}=this.params,h=(r=(i=this.bindings.postgres_changes)===null||i===void 0?void 0:i.map(m=>m.filter))!==null&&r!==void 0?r:[],d=!!this.bindings[Si.PRESENCE]&&this.bindings[Si.PRESENCE].length>0||((s=this.params.config.presence)===null||s===void 0?void 0:s.enabled)===!0,f={},g=Object.assign({broadcast:a,presence:Object.assign(Object.assign({},l),{enabled:d}),postgres_changes:h,private:c},u?{postgres_changes_options:u}:{});this.socket.accessTokenValue&&(f.access_token=this.socket.accessTokenValue),this._onError(m=>{e?.(kn.CHANNEL_ERROR,bw(m))}),this._onClose(()=>e?.(kn.CLOSED)),this.updateJoinPayload(Object.assign({config:g},f)),this._updateFilterMessage();const v=u?.wait&&h.length>0?Math.max(t,((o=u.timeout)!==null&&o!==void 0?o:ew)+tw):t;this.channelAdapter.subscribe(v).receive("ok",async({postgres_changes:m})=>{if(this.socket._isManualToken()||this.socket.setAuth(),m===void 0){e?.(kn.SUBSCRIBED);return}this._updatePostgresBindings(m,e)}).receive("error",m=>{this.state=ei.errored;const p=Object.values(m).join(", ")||"error";e?.(kn.CHANNEL_ERROR,new Error(p,{cause:m}))}).receive("timeout",()=>{e?.(kn.TIMED_OUT)})}return this}_updatePostgresBindings(e,t){var i;const r=this.bindings.postgres_changes,s=(i=r?.length)!==null&&i!==void 0?i:0,o=[];for(let a=0;a<s;a++){const l=r[a],{filter:{event:c,schema:u,table:h,filter:d}}=l,f=e&&e[a];if(f&&f.event===c&&Fn.isFilterValueEqual(f.schema,u)&&Fn.isFilterValueEqual(f.table,h)&&Fn.isFilterValueEqual(f.filter,d))o.push(Object.assign(Object.assign({},l),{id:f.id}));else{this.unsubscribe(),this.state=ei.errored,t?.(kn.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=o,this.state!=ei.errored&&t&&t(kn.SUBSCRIBED)}presenceState(){return this.presence.state}async track(e,t={}){return await this.send({type:"presence",event:"track",payload:e},t)}async untrack(e={}){return await this.send({type:"presence",event:"untrack"},e)}on(e,t,i){const r=this.channelAdapter.isJoined()||this.channelAdapter.isJoining(),s=e===Si.PRESENCE||e===Si.POSTGRES_CHANGES;if(r&&s)throw this.socket.log("channel",`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`),new Error(`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`);return this._on(e,t,i)}async httpSend(e,t,i={}){var r;if(t==null)return Promise.reject(new Error("Payload is required for httpSend()"));const s=t instanceof ArrayBuffer||ArrayBuffer.isView(t),o={apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":s?"application/octet-stream":"application/json"};this.socket.accessTokenValue&&(o.Authorization=`Bearer ${this.socket.accessTokenValue}`);const a=new URL(this.broadcastEndpointURL);a.pathname+=`/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(e)}`,this.private&&a.searchParams.set("private","true");const l={method:"POST",headers:o,body:s?t:JSON.stringify(t)},c=await this._fetchWithTimeout(a.toString(),l,(r=i.timeout)!==null&&r!==void 0?r:this.timeout);if(c.status===202)return{success:!0};if(c.status===404)return Promise.reject(new Error("httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md"));let u=c.statusText;try{const h=await c.json();u=h.error||h.message||u}catch{}return Promise.reject(new Error(u))}async send(e,t={}){var i,r;if(!this.channelAdapter.canPush()&&e.type==="broadcast"){const s="Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.";this.socket.hasLogger()?this.socket.log("channel",s):console.warn(s);const{event:o,payload:a}=e,l={apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"};this.socket.accessTokenValue&&(l.Authorization=`Bearer ${this.socket.accessTokenValue}`);const c={method:"POST",headers:l,body:JSON.stringify({messages:[{topic:this.subTopic,event:o,payload:a,private:this.private}]})};try{const u=await this._fetchWithTimeout(this.broadcastEndpointURL,c,(i=t.timeout)!==null&&i!==void 0?i:this.timeout);return await((r=u.body)===null||r===void 0?void 0:r.cancel()),u.ok?"ok":"error"}catch(u){return u instanceof Error&&u.name==="AbortError"?"timed out":"error"}}else return new Promise(s=>{var o,a,l;const c=this.channelAdapter.push(e.type,e,t.timeout||this.timeout);e.type==="broadcast"&&!(!((l=(a=(o=this.params)===null||o===void 0?void 0:o.config)===null||a===void 0?void 0:a.broadcast)===null||l===void 0)&&l.ack)&&s("ok"),c.receive("ok",()=>s("ok")),c.receive("error",()=>s("error")),c.receive("timeout",()=>s("timed out"))})}updateJoinPayload(e){this.channelAdapter.updateJoinPayload(e)}async unsubscribe(e=this.timeout){return new Promise(t=>{this.channelAdapter.unsubscribe(e).receive("ok",()=>t("ok")).receive("timeout",()=>t("timed out")).receive("error",()=>t("error"))})}teardown(){this.channelAdapter.teardown()}async _fetchWithTimeout(e,t,i){const r=new AbortController,s=setTimeout(()=>r.abort(),i),o=await this.socket.fetch(e,Object.assign(Object.assign({},t),{signal:r.signal}));return clearTimeout(s),o}_on(e,t,i){var r;const s=e.toLocaleLowerCase(),o=t?.filter;if((o instanceof Iw||typeof o=="object"&&o!==null&&typeof o.build=="function")&&(t=Object.assign(Object.assign({},t),{filter:o.build()})),s===Si.POSTGRES_CHANGES&&((r=this.bindings[s])===null||r===void 0?void 0:r.find(u=>Fn.isSamePostgresFilter(u.filter,t))))return this.socket.log("error",`duplicate \`postgres_changes\` binding for ${this.topic} ignored`,t),this;const a=this.channelAdapter.on(e,i),l={type:s,filter:t,callback:i,ref:a};return this.bindings[s]?this.bindings[s].push(l):this.bindings[s]=[l],this._updateFilterMessage(),this}_onClose(e){this.channelAdapter.onClose(e)}_onError(e){this.channelAdapter.onError(e)}_updateFilterMessage(){this.channelAdapter.updateFilterBindings((e,t,i)=>{var r,s,o,a,l,c,u;const h=e.event.toLocaleLowerCase();if(this._notThisChannelEvent(h,i))return!1;const d=(r=this.bindings[h])===null||r===void 0?void 0:r.find(f=>f.ref===e.ref);if(!d)return!0;if(["broadcast","presence","postgres_changes"].includes(h))if("id"in d){const f=d.id,g=(s=d.filter)===null||s===void 0?void 0:s.event;return f&&((o=t.ids)===null||o===void 0?void 0:o.includes(f))&&(g==="*"||g?.toLocaleLowerCase()===((a=t.data)===null||a===void 0?void 0:a.type.toLocaleLowerCase()))}else{const f=(c=(l=d?.filter)===null||l===void 0?void 0:l.event)===null||c===void 0?void 0:c.toLocaleLowerCase();return f==="*"||f===((u=t?.event)===null||u===void 0?void 0:u.toLocaleLowerCase())}else return d.type.toLocaleLowerCase()===h})}_notThisChannelEvent(e,t){const{close:i,error:r,leave:s,join:o}=Pd;return t&&[i,r,s,o].includes(e)&&t!==this.joinPush.ref}_updateFilterTransform(){this.channelAdapter.updatePayloadTransform((e,t,i)=>{if(typeof t=="object"&&"ids"in t){const r=t.data,{schema:s,table:o,commit_timestamp:a,type:l,errors:c}=r;return Object.assign(Object.assign({},{schema:s,table:o,commit_timestamp:a,eventType:l,new:{},old:{},errors:c}),this._getPayloadRecords(r))}return t})}copyBindings(e){if(this.joinedOnce)throw new Error("cannot copy bindings into joined channel");for(const t in e.bindings)for(const i of e.bindings[t])this._on(i.type,i.filter,i.callback)}static isFilterValueEqual(e,t){return(e??void 0)===(t??void 0)}static isSamePostgresFilter(e,t){var i,r,s,o;const a=(r=(i=e?.select)===null||i===void 0?void 0:i.join())!==null&&r!==void 0?r:void 0,l=(o=(s=t?.select)===null||s===void 0?void 0:s.join())!==null&&o!==void 0?o:void 0;return e?.event===t?.event&&Fn.isFilterValueEqual(e?.schema,t?.schema)&&Fn.isFilterValueEqual(e?.table,t?.table)&&Fn.isFilterValueEqual(e?.filter,t?.filter)&&a===l}_getPayloadRecords(e){const t={new:{},old:{}};return(e.type==="INSERT"||e.type==="UPDATE")&&(t.new=qu(e.columns,e.record)),(e.type==="UPDATE"||e.type==="DELETE")&&(t.old=qu(e.columns,e.old_record)),t}}class Lw{constructor(e,t){this.socket=new yw(e,t)}get timeout(){return this.socket.timeout}get endPoint(){return this.socket.endPoint}get transport(){return this.socket.transport}get heartbeatIntervalMs(){return this.socket.heartbeatIntervalMs}get heartbeatCallback(){return this.socket.heartbeatCallback}set heartbeatCallback(e){this.socket.heartbeatCallback=e}get heartbeatTimer(){return this.socket.heartbeatTimer}get pendingHeartbeatRef(){return this.socket.pendingHeartbeatRef}get reconnectTimer(){return this.socket.reconnectTimer}get vsn(){return this.socket.vsn}get encode(){return this.socket.encode}get decode(){return this.socket.decode}get reconnectAfterMs(){return this.socket.reconnectAfterMs}get sendBuffer(){return this.socket.sendBuffer}get stateChangeCallbacks(){return this.socket.stateChangeCallbacks}connect(){this.socket.connect()}disconnect(e,t,i,r=1e4){return new Promise(s=>{setTimeout(()=>s("timeout"),r),this.socket.disconnect(()=>{e(),s("ok")},t,i)})}push(e){this.socket.push(e)}log(e,t,i){this.socket.log(e,t,i)}hasLogger(){return this.socket.hasLogger()}makeRef(){return this.socket.makeRef()}onOpen(e){this.socket.onOpen(e)}onClose(e){this.socket.onClose(e)}onError(e){this.socket.onError(e)}onMessage(e){this.socket.onMessage(e)}isConnected(){return this.socket.isConnected()}isConnecting(){return this.socket.connectionState()==kl.connecting}isDisconnecting(){return this.socket.connectionState()==kl.closing}connectionState(){return this.socket.connectionState()}endPointURL(){return this.socket.endPointURL()}sendHeartbeat(){this.socket.sendHeartbeat()}getSocket(){return this.socket}}const Zu={HEARTBEAT_INTERVAL:25e3},Dw=[1e3,2e3,5e3,1e4],Ow=1e4;function Uw(){const n=new Map;return{get length(){return n.size},clear(){n.clear()},getItem(e){return n.has(e)?n.get(e):null},key(e){var t;return(t=Array.from(n.keys())[e])!==null&&t!==void 0?t:null},removeItem(e){n.delete(e)},setItem(e,t){n.set(e,String(t))}}}function Nw(){try{if(typeof globalThis<"u"&&globalThis.sessionStorage)return globalThis.sessionStorage}catch{}return Uw()}const kw=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;class Fw{get endPoint(){return this.socketAdapter.endPoint}get timeout(){return this.socketAdapter.timeout}get transport(){return this.socketAdapter.transport}get heartbeatCallback(){return this.socketAdapter.heartbeatCallback}get heartbeatIntervalMs(){return this.socketAdapter.heartbeatIntervalMs}get heartbeatTimer(){return this.worker?this._workerHeartbeatTimer:this.socketAdapter.heartbeatTimer}get pendingHeartbeatRef(){return this.worker?this._pendingWorkerHeartbeatRef:this.socketAdapter.pendingHeartbeatRef}get reconnectTimer(){return this.socketAdapter.reconnectTimer}get vsn(){return this.socketAdapter.vsn}get encode(){return this.socketAdapter.encode}get decode(){return this.socketAdapter.decode}get reconnectAfterMs(){return this.socketAdapter.reconnectAfterMs}get sendBuffer(){return this.socketAdapter.sendBuffer}get stateChangeCallbacks(){return this.socketAdapter.stateChangeCallbacks}constructor(e,t){var i;if(this.channels=new Array,this.accessTokenValue=null,this.accessToken=null,this.apiKey=null,this.httpEndpoint="",this.headers={},this.params={},this.ref=0,this.serializer=new iw,this._manuallySetToken=!1,this._authPromise=null,this._authGeneration=0,this._workerHeartbeatTimer=void 0,this._pendingWorkerHeartbeatRef=null,this._pendingDisconnectTimer=null,this._disconnectOnEmptyChannelsAfterMs=0,this._resolveFetch=s=>s?(...o)=>s(...o):(...o)=>fetch(...o),!(!((i=t?.params)===null||i===void 0)&&i.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=t.params.apikey;const r=this._initializeOptions(t);this.socketAdapter=new Lw(e,r),this.httpEndpoint=Ld(e),this.fetch=this._resolveFetch(t?.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.isConnected())){this.accessToken&&!this._authPromise&&this._setAuthSafely("connect"),this._setupConnectionHandlers();try{this.socketAdapter.connect()}catch(e){const t=e.message;throw new Error(`WebSocket not available: ${t}`)}this._handleNodeJsRaceCondition()}}endpointURL(){return this.socketAdapter.endPointURL()}async disconnect(e,t){return this._cancelPendingDisconnect(),this.isDisconnecting()?"ok":await this.socketAdapter.disconnect(()=>{clearInterval(this._workerHeartbeatTimer),this._terminateWorker()},e,t)}getChannels(){return this.channels}async removeChannel(e){const t=await e.unsubscribe();return t==="ok"&&e.teardown(),t}async removeAllChannels(){const e=this.channels.map(async i=>{const r=await i.unsubscribe();return i.teardown(),r}),t=await Promise.all(e);return await this.disconnect(),t}log(e,t,i){this.socketAdapter.log(e,t,i)}hasLogger(){return this.socketAdapter.hasLogger()}connectionState(){return this.socketAdapter.connectionState()||kl.closed}isConnected(){return this.socketAdapter.isConnected()}isConnecting(){return this.socketAdapter.isConnecting()}isDisconnecting(){return this.socketAdapter.isDisconnecting()}channel(e,t={config:{}}){const i=`realtime:${e}`,r=this.getChannels().find(s=>s.topic===i);if(r)return r;{const s=new Fn(`realtime:${e}`,t,this);return this._cancelPendingDisconnect(),this.channels.push(s),s}}push(e){this.socketAdapter.push(e)}async setAuth(e=null){const t=++this._authGeneration,i=this._performAuth(e,t);t===this._authGeneration&&(this._authPromise=i);try{await i}finally{this._authPromise===i&&(this._authPromise=null)}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){this.socketAdapter.sendHeartbeat()}onHeartbeat(e){this.socketAdapter.heartbeatCallback=this._wrapHeartbeatCallback(e)}_makeRef(){return this.socketAdapter.makeRef()}_remove(e){this.channels=this.channels.filter(t=>t.topic!==e.topic),this.channels.length===0&&(this.log("transport","no channels remaining, scheduling disconnect"),this._schedulePendingDisconnect())}_schedulePendingDisconnect(){if(this._cancelPendingDisconnect(),this._disconnectOnEmptyChannelsAfterMs===0){this.log("transport","disconnecting immediately - no channels"),this.disconnect();return}this._pendingDisconnectTimer=setTimeout(()=>{this._pendingDisconnectTimer=null,this.channels.length===0&&(this.log("transport","deferred disconnect fired - no channels, disconnecting"),this.disconnect())},this._disconnectOnEmptyChannelsAfterMs),this.log("transport",`deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`)}_cancelPendingDisconnect(){this._pendingDisconnectTimer!==null&&(this.log("transport","pending disconnect cancelled - channel activity detected"),clearTimeout(this._pendingDisconnectTimer),this._pendingDisconnectTimer=null)}async _performAuth(e,t){let i,r=!1;if(e)i=e,r=!0;else if(this.accessToken)try{i=await this.accessToken()}catch(s){this.log("error","Error fetching access token from callback",s),i=this.accessTokenValue}else i=this.accessTokenValue;t===this._authGeneration&&(this.accessToken?this._manuallySetToken=!1:r&&(this._manuallySetToken=!0),this.accessTokenValue!=i&&(this.accessTokenValue=i,this.channels.forEach(s=>{const o={access_token:i,version:YS};s.updateJoinPayload(o),s.joinedOnce&&s.channelAdapter.isJoined()&&s.channelAdapter.push(Pd.access_token,{access_token:i})})))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e="general"){this._isManualToken()||this.setAuth().catch(t=>{this.log("error",`Error setting auth in ${e}`,t)})}_setupConnectionHandlers(){this.socketAdapter.onOpen(()=>{(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).catch(t=>{this.log("error","error waiting for auth on connect",t)}),this.worker&&!this.workerRef&&this._startWorkerHeartbeat()}),this.socketAdapter.onClose(()=>{this.worker&&this.workerRef&&this._terminateWorker()}),this.socketAdapter.onMessage(e=>{e.ref&&e.ref===this._pendingWorkerHeartbeatRef&&(this._pendingWorkerHeartbeatRef=null)})}_handleNodeJsRaceCondition(){this.socketAdapter.isConnected()&&this.socketAdapter.getSocket().onConnOpen()}_wrapHeartbeatCallback(e){return(t,i)=>{t!=="disconnected"&&(t=="sent"&&this._setAuthSafely(),e&&e(t,i))}}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=t=>{this.log("worker","worker error",t.message),this._terminateWorker(),this.disconnect()},this.workerRef.onmessage=t=>{t.data.event==="keepAlive"&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&(this.log("worker","terminating worker"),this.workerRef.terminate(),this.workerRef=void 0)}_workerObjectUrl(e){let t;if(e)t=e;else{const i=new Blob([kw],{type:"application/javascript"});t=URL.createObjectURL(i)}return t}_initializeOptions(e){var t,i,r,s,o,a,l,c,u,h,d,f;this.worker=(t=e?.worker)!==null&&t!==void 0?t:!1,this.accessToken=(i=e?.accessToken)!==null&&i!==void 0?i:null;const g={};g.timeout=(r=e?.timeout)!==null&&r!==void 0?r:QS,g.heartbeatIntervalMs=(s=e?.heartbeatIntervalMs)!==null&&s!==void 0?s:Zu.HEARTBEAT_INTERVAL,this._disconnectOnEmptyChannelsAfterMs=(o=e?.disconnectOnEmptyChannelsAfterMs)!==null&&o!==void 0?o:2*((a=e?.heartbeatIntervalMs)!==null&&a!==void 0?a:Zu.HEARTBEAT_INTERVAL),g.transport=(l=e?.transport)!==null&&l!==void 0?l:XS.getWebSocketConstructor(),g.params=e?.params,g.logger=e?.logger,g.heartbeatCallback=this._wrapHeartbeatCallback(e?.heartbeatCallback),g.sessionStorage=(c=e?.sessionStorage)!==null&&c!==void 0?c:Nw(),g.reconnectAfterMs=(u=e?.reconnectAfterMs)!==null&&u!==void 0?u:(M=>Dw[M-1]||Ow);let v,m;const p=(h=e?.vsn)!==null&&h!==void 0?h:ZS;switch(p){case JS:v=(M,S)=>S(JSON.stringify(M)),m=(M,S)=>S(JSON.parse(M));break;case Cd:v=this.serializer.encode.bind(this.serializer),m=this.serializer.decode.bind(this.serializer);break;default:throw new Error(`Unsupported serializer version: ${g.vsn}`)}if(g.vsn=p,g.encode=(d=e?.encode)!==null&&d!==void 0?d:v,g.decode=(f=e?.decode)!==null&&f!==void 0?f:m,g.beforeReconnect=this._reconnectAuth.bind(this),(e?.logLevel||e?.log_level)&&(this.logLevel=e.logLevel||e.log_level,g.params=Object.assign(Object.assign({},g.params),{log_level:this.logLevel})),this.worker){if(typeof window<"u"&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=e?.workerUrl,g.autoSendHeartbeat=!this.worker}return g}async _reconnectAuth(){await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()}}var as=class extends Error{constructor(n,e){super(n),this.name="IcebergError",this.status=e.status,this.icebergType=e.icebergType,this.icebergCode=e.icebergCode,this.details=e.details,this.isCommitStateUnknown=e.icebergType==="CommitStateUnknownException"||[500,502,504].includes(e.status)&&e.icebergType?.includes("CommitState")===!0}isNotFound(){return this.status===404}isConflict(){return this.status===409}isAuthenticationTimeout(){return this.status===419}};function Bw(n,e,t){const i=new URL(e,n);if(t)for(const[r,s]of Object.entries(t))s!==void 0&&i.searchParams.set(r,s);return i.toString()}async function zw(n){return!n||n.type==="none"?{}:n.type==="bearer"?{Authorization:`Bearer ${n.token}`}:n.type==="header"?{[n.name]:n.value}:n.type==="custom"?await n.getHeaders():{}}function Hw(n){const e=n.fetchImpl??globalThis.fetch;return{async request({method:t,path:i,query:r,body:s,headers:o}){const a=Bw(n.baseUrl,i,r),l=await zw(n.auth),c=await e(a,{method:t,headers:{...s?{"Content-Type":"application/json"}:{},...l,...o},body:s?JSON.stringify(s):void 0}),u=await c.text(),h=(c.headers.get("content-type")||"").includes("application/json"),d=h&&u?JSON.parse(u):u;if(!c.ok){const f=h?d:void 0,g=f?.error;throw new as(g?.message??`Request failed with status ${c.status}`,{status:c.status,icebergType:g?.type,icebergCode:g?.code,details:f})}return{status:c.status,headers:c.headers,data:d}}}}function eo(n){return n.join("")}var Vw=class{constructor(n,e=""){this.client=n,this.prefix=e}async listNamespaces(n){const e=n?{parent:eo(n.namespace)}:void 0;return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces`,query:e})).data.namespaces.map(i=>({namespace:i}))}async createNamespace(n,e){const t={namespace:n.namespace,properties:e?.properties};return(await this.client.request({method:"POST",path:`${this.prefix}/namespaces`,body:t})).data}async dropNamespace(n){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${eo(n.namespace)}`})}async loadNamespaceMetadata(n){return{properties:(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${eo(n.namespace)}`})).data.properties}}async namespaceExists(n){try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${eo(n.namespace)}`}),!0}catch(e){if(e instanceof as&&e.status===404)return!1;throw e}}async createNamespaceIfNotExists(n,e){try{return await this.createNamespace(n,e)}catch(t){if(t instanceof as&&t.status===409)return;throw t}}};function Ji(n){return n.join("")}var Gw=class{constructor(n,e="",t){this.client=n,this.prefix=e,this.accessDelegation=t}async listTables(n){return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${Ji(n.namespace)}/tables`})).data.identifiers}async createTable(n,e){const t={};return this.accessDelegation&&(t["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${Ji(n.namespace)}/tables`,body:e,headers:t})).data.metadata}async updateTable(n,e){const t=await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${Ji(n.namespace)}/tables/${n.name}`,body:e});return{"metadata-location":t.data["metadata-location"],metadata:t.data.metadata}}async dropTable(n,e){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${Ji(n.namespace)}/tables/${n.name}`,query:{purgeRequested:String(e?.purge??!1)}})}async loadTable(n){const e={};return this.accessDelegation&&(e["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${Ji(n.namespace)}/tables/${n.name}`,headers:e})).data.metadata}async tableExists(n){const e={};this.accessDelegation&&(e["X-Iceberg-Access-Delegation"]=this.accessDelegation);try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${Ji(n.namespace)}/tables/${n.name}`,headers:e}),!0}catch(t){if(t instanceof as&&t.status===404)return!1;throw t}}async createTableIfNotExists(n,e){try{return await this.createTable(n,e)}catch(t){if(t instanceof as&&t.status===409)return await this.loadTable({namespace:n.namespace,name:e.name});throw t}}},jw=class{constructor(n){let e="v1";n.catalogName&&(e+=`/${n.catalogName}`);const t=n.baseUrl.endsWith("/")?n.baseUrl:`${n.baseUrl}/`;this.client=Hw({baseUrl:t,auth:n.auth,fetchImpl:n.fetch}),this.accessDelegation=n.accessDelegation?.join(","),this.namespaceOps=new Vw(this.client,e),this.tableOps=new Gw(this.client,e,this.accessDelegation)}async listNamespaces(n){return this.namespaceOps.listNamespaces(n)}async createNamespace(n,e){return this.namespaceOps.createNamespace(n,e)}async dropNamespace(n){await this.namespaceOps.dropNamespace(n)}async loadNamespaceMetadata(n){return this.namespaceOps.loadNamespaceMetadata(n)}async listTables(n){return this.tableOps.listTables(n)}async createTable(n,e){return this.tableOps.createTable(n,e)}async updateTable(n,e){return this.tableOps.updateTable(n,e)}async dropTable(n,e){await this.tableOps.dropTable(n,e)}async loadTable(n){return this.tableOps.loadTable(n)}async namespaceExists(n){return this.namespaceOps.namespaceExists(n)}async tableExists(n){return this.tableOps.tableExists(n)}async createNamespaceIfNotExists(n,e){return this.namespaceOps.createNamespaceIfNotExists(n,e)}async createTableIfNotExists(n,e){return this.tableOps.createTableIfNotExists(n,e)}};function ls(n){"@babel/helpers - typeof";return ls=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ls(n)}function Ww(n,e){if(ls(n)!="object"||!n)return n;var t=n[Symbol.toPrimitive];if(t!==void 0){var i=t.call(n,e);if(ls(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(n)}function $w(n){var e=Ww(n,"string");return ls(e)=="symbol"?e:e+""}function qw(n,e,t){return(e=$w(e))in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function Qu(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);e&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),t.push.apply(t,i)}return t}function Ue(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?Qu(Object(t),!0).forEach(function(i){qw(n,i,t[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):Qu(Object(t)).forEach(function(i){Object.defineProperty(n,i,Object.getOwnPropertyDescriptor(t,i))})}return n}var zo=class extends Error{constructor(n,e="storage",t,i){super(n),this.__isStorageError=!0,this.namespace=e,this.name=e==="vectors"?"StorageVectorsError":"StorageError",this.status=t,this.statusCode=i}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}};function Ho(n){return typeof n=="object"&&n!==null&&"__isStorageError"in n}var Hl=class extends zo{constructor(n,e,t,i="storage",r){super(n,i,e,t),this.name=i==="vectors"?"StorageVectorsApiError":"StorageApiError",this.status=e,this.statusCode=t,this.code=r}toJSON(){return Ue(Ue({},super.toJSON()),{},{code:this.code})}},Od=class extends zo{constructor(n,e,t="storage"){super(n,t),this.name=t==="vectors"?"StorageVectorsUnknownError":"StorageUnknownError",this.originalError=e}};function bo(n,e,t){const i=Ue({},n),r=e.toLowerCase();for(const s of Object.keys(i))s.toLowerCase()===r&&delete i[s];return i[r]=t,i}function Xw(n){const e={};for(const[t,i]of Object.entries(n))e[t.toLowerCase()]=i;return e}const Kw=n=>n?(...e)=>n(...e):(...e)=>fetch(...e),Yw=n=>{if(typeof n!="object"||n===null)return!1;const e=Object.getPrototypeOf(n);return(e===null||e===Object.prototype||Object.getPrototypeOf(e)===null)&&!(Symbol.toStringTag in n)&&!(Symbol.iterator in n)},Vl=n=>{if(Array.isArray(n))return n.map(t=>Vl(t));if(typeof n=="function"||n!==Object(n))return n;const e={};return Object.entries(n).forEach(([t,i])=>{const r=t.replace(/([-_][a-z])/gi,s=>s.toUpperCase().replace(/[-_]/g,""));e[r]=Vl(i)}),e},Jw=n=>!n||typeof n!="string"||n.length===0||n.length>100||n.trim()!==n||n.includes("/")||n.includes("\\")?!1:/^[\w!.\*'() &$@=;:+,?-]+$/.test(n),Gl=n=>n.split("/").map(encodeURIComponent).join("/"),eh=n=>{if(typeof n=="object"&&n!==null){const e=n;if(typeof e.msg=="string")return e.msg;if(typeof e.message=="string")return e.message;if(typeof e.error_description=="string")return e.error_description;if(typeof e.error=="string")return e.error;if(typeof e.error=="object"&&e.error!==null){const t=e.error;if(typeof t.message=="string")return t.message}}return JSON.stringify(n)},Zw=async(n,e,t,i)=>{if(n!==null&&typeof n=="object"&&"json"in n&&typeof n.json=="function"){const r=n;let s=parseInt(String(r.status),10);Number.isFinite(s)||(s=500),r.json().then(o=>{const a=o?.statusCode||o?.code||s+"";e(new Hl(eh(o),s,a,i,o?.code))}).catch(()=>{const o=s+"";e(new Hl(r.statusText||`HTTP ${s} error`,s,o,i))})}else e(new Od(eh(n),n,i))},Qw=(n,e,t,i)=>{const r={method:n,headers:e?.headers||{}};if(n==="GET"||n==="HEAD"||!i)return Ue(Ue({},r),t);if(Yw(i)){var s;const o=e?.headers||{};let a;for(const[l,c]of Object.entries(o))l.toLowerCase()==="content-type"&&(a=c);r.headers=bo(o,"Content-Type",(s=a)!==null&&s!==void 0?s:"application/json"),r.body=JSON.stringify(i)}else r.body=i;return e?.duplex&&(r.duplex=e.duplex),Ue(Ue({},r),t)};async function Ur(n,e,t,i,r,s,o){return new Promise((a,l)=>{n(t,Qw(e,i,r,s)).then(c=>{if(!c.ok)throw c;if(i?.noResolveJson)return c;if(o==="vectors"){const u=c.headers.get("content-type");if(c.headers.get("content-length")==="0"||c.status===204)return{};if(!u||!u.includes("application/json"))return{}}return c.json()}).then(c=>a(c)).catch(c=>Zw(c,l,i,o))})}function Ud(n="storage"){return{get:async(e,t,i,r)=>Ur(e,"GET",t,i,r,void 0,n),post:async(e,t,i,r,s)=>Ur(e,"POST",t,r,s,i,n),put:async(e,t,i,r,s)=>Ur(e,"PUT",t,r,s,i,n),head:async(e,t,i,r)=>Ur(e,"HEAD",t,Ue(Ue({},i),{},{noResolveJson:!0}),r,void 0,n),remove:async(e,t,i,r,s)=>Ur(e,"DELETE",t,r,s,i,n)}}const ex=Ud("storage"),{get:fr,post:an,put:Eo,head:tx,remove:pr}=ex,$t=Ud("vectors");var Ar=class{constructor(n,e={},t,i="storage"){this.shouldThrowOnError=!1,this.url=n,this.headers=Xw(e),this.fetch=Kw(t),this.namespace=i}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(n,e){return this.headers=bo(this.headers,n,e),this}async handleOperation(n){var e=this;try{return{data:await n(),error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(Ho(t))return{data:null,error:t};throw t}}};let Nd;Nd=Symbol.toStringTag;var nx=class{constructor(n,e){this.downloadFn=n,this.shouldThrowOnError=e,this[Nd]="StreamDownloadBuilder",this.promise=null}then(n,e){return this.getPromise().then(n,e)}catch(n){return this.getPromise().catch(n)}finally(n){return this.getPromise().finally(n)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}async execute(){var n=this;try{return{data:(await n.downloadFn()).body,error:null}}catch(e){if(n.shouldThrowOnError)throw e;if(Ho(e))return{data:null,error:e};throw e}}};let kd;kd=Symbol.toStringTag;var ix=class{constructor(n,e){this.downloadFn=n,this.shouldThrowOnError=e,this[kd]="BlobDownloadBuilder",this.promise=null}asStream(){return new nx(this.downloadFn,this.shouldThrowOnError)}then(n,e){return this.getPromise().then(n,e)}catch(n){return this.getPromise().catch(n)}finally(n){return this.getPromise().finally(n)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}async execute(){var n=this;try{return{data:await(await n.downloadFn()).blob(),error:null}}catch(e){if(n.shouldThrowOnError)throw e;if(Ho(e))return{data:null,error:e};throw e}}};const Pa={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},th={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};var rx=class extends Ar{constructor(n,e={},t,i){super(n,e,i,"storage"),this.bucketId=t}async uploadOrUpdate(n,e,t,i){var r=this;return r.handleOperation(async()=>{let s;const o=Ue(Ue({},th),i);let a=Ue(Ue({},r.headers),n==="POST"&&{"x-upsert":String(o.upsert)});const l=o.metadata;if(typeof Blob<"u"&&t instanceof Blob?(s=new FormData,s.append("cacheControl",o.cacheControl),l&&s.append("metadata",r.encodeMetadata(l)),s.append("",t)):typeof FormData<"u"&&t instanceof FormData?(s=t,s.has("cacheControl")||s.append("cacheControl",o.cacheControl),l&&!s.has("metadata")&&s.append("metadata",r.encodeMetadata(l))):(s=t,a["cache-control"]=`max-age=${o.cacheControl}`,a["content-type"]=o.contentType,l&&(a["x-metadata"]=r.toBase64(r.encodeMetadata(l))),(typeof ReadableStream<"u"&&s instanceof ReadableStream||s&&typeof s=="object"&&"pipe"in s&&typeof s.pipe=="function")&&!o.duplex&&(o.duplex="half")),i?.headers)for(const[d,f]of Object.entries(i.headers))a=bo(a,d,f);const c=r._removeEmptyFolders(e),u=r._getFinalPath(c),h=await(n=="PUT"?Eo:an)(r.fetch,`${r.url}/object/${u}`,s,Ue({headers:a},o?.duplex?{duplex:o.duplex}:{}));return{path:c,id:h.Id,fullPath:h.Key}})}async upload(n,e,t){return this.uploadOrUpdate("POST",n,e,t)}async uploadToSignedUrl(n,e,t,i){var r=this;const s=r._removeEmptyFolders(n),o=r._getFinalPath(s),a=new URL(r.url+`/object/upload/sign/${o}`);return a.searchParams.set("token",e),r.handleOperation(async()=>{let l;const c=Ue(Ue({},th),i);let u=Ue(Ue({},r.headers),{"x-upsert":String(c.upsert)});const h=c.metadata;if(typeof Blob<"u"&&t instanceof Blob?(l=new FormData,l.append("cacheControl",c.cacheControl),h&&l.append("metadata",r.encodeMetadata(h)),l.append("",t)):typeof FormData<"u"&&t instanceof FormData?(l=t,l.has("cacheControl")||l.append("cacheControl",c.cacheControl),h&&!l.has("metadata")&&l.append("metadata",r.encodeMetadata(h))):(l=t,u["cache-control"]=`max-age=${c.cacheControl}`,u["content-type"]=c.contentType,h&&(u["x-metadata"]=r.toBase64(r.encodeMetadata(h))),(typeof ReadableStream<"u"&&l instanceof ReadableStream||l&&typeof l=="object"&&"pipe"in l&&typeof l.pipe=="function")&&!c.duplex&&(c.duplex="half")),i?.headers)for(const[d,f]of Object.entries(i.headers))u=bo(u,d,f);return{path:s,fullPath:(await Eo(r.fetch,a.toString(),l,Ue({headers:u},c?.duplex?{duplex:c.duplex}:{}))).Key}})}async createSignedUploadUrl(n,e){var t=this;return t.handleOperation(async()=>{let i=t._getFinalPath(n);const r=Ue({},t.headers);e?.upsert&&(r["x-upsert"]="true");const s=await an(t.fetch,`${t.url}/object/upload/sign/${i}`,{},{headers:r}),o=new URL(t.url+s.url),a=o.searchParams.get("token");if(!a)throw new zo("No token returned by API");return{signedUrl:o.toString(),path:n,token:a}})}async update(n,e,t){return this.uploadOrUpdate("PUT",n,e,t)}async move(n,e,t){var i=this;return i.handleOperation(async()=>await an(i.fetch,`${i.url}/object/move`,{bucketId:i.bucketId,sourceKey:n,destinationKey:e,destinationBucket:t?.destinationBucket,sourceVersionId:t?.sourceVersionId},{headers:i.headers}))}async copy(n,e,t){var i=this;return i.handleOperation(async()=>({path:(await an(i.fetch,`${i.url}/object/copy`,{bucketId:i.bucketId,sourceKey:n,destinationKey:e,destinationBucket:t?.destinationBucket,sourceVersionId:t?.sourceVersionId},{headers:i.headers})).Key}))}async createSignedUrl(n,e,t){var i=this;return i.handleOperation(async()=>{let r=i._getFinalPath(n);const s=typeof t?.transform=="object"&&t.transform!==null&&Object.keys(t.transform).length>0;let o=await an(i.fetch,`${i.url}/object/sign/${r}`,Ue(Ue({expiresIn:e},s?{transform:t.transform}:{}),t?.versionId!=null?{versionId:t.versionId}:{}),{headers:i.headers});const a=new URLSearchParams;t?.download&&a.set("download",t.download===!0?"":t.download),t?.cacheNonce!=null&&a.set("cacheNonce",String(t.cacheNonce));const l=a.toString();return{signedUrl:encodeURI(`${i.url}${o.signedURL}${l?`&${l}`:""}`)}})}async createSignedUrls(n,e,t){var i=this;return i.handleOperation(async()=>{const r=await an(i.fetch,`${i.url}/object/sign/${i.bucketId}`,{expiresIn:e,paths:n},{headers:i.headers}),s=new URLSearchParams;t?.download&&s.set("download",t.download===!0?"":t.download),t?.cacheNonce!=null&&s.set("cacheNonce",String(t.cacheNonce));const o=s.toString();return r.map(a=>Ue(Ue({},a),{},{signedUrl:a.signedURL?encodeURI(`${i.url}${a.signedURL}${o?`&${o}`:""}`):null}))})}download(n,e,t){const i=typeof e?.transform=="object"&&e.transform!==null&&Object.keys(e.transform).length>0?"render/image/authenticated":"object",r=new URLSearchParams;e?.transform&&this.applyTransformOptsToQuery(r,e.transform),e?.cacheNonce!=null&&r.set("cacheNonce",String(e.cacheNonce)),e?.versionId!=null&&r.set("versionId",String(e.versionId));const s=r.toString(),o=this._getFinalPath(n),a=()=>fr(this.fetch,`${this.url}/${i}/${o}${s?`?${s}`:""}`,{headers:this.headers,noResolveJson:!0},t);return new ix(a,this.shouldThrowOnError)}async info(n,e){var t=this;const i=t._getFinalPath(n),r=new URLSearchParams;e?.versionId!=null&&r.set("versionId",String(e.versionId));const s=r.toString();return t.handleOperation(async()=>Vl(await fr(t.fetch,`${t.url}/object/info/${i}${s?`?${s}`:""}`,{headers:t.headers})))}async exists(n){var e=this;const t=e._getFinalPath(n);try{return await tx(e.fetch,`${e.url}/object/${t}`,{headers:e.headers}),{data:!0,error:null}}catch(r){if(e.shouldThrowOnError)throw r;if(Ho(r)){var i;const s=r instanceof Hl?r.status:r instanceof Od?(i=r.originalError)===null||i===void 0?void 0:i.status:void 0;if(s!==void 0&&[400,404].includes(s))return{data:!1,error:r}}throw r}}getPublicUrl(n,e){const t=this._getFinalPath(n),i=new URLSearchParams;e?.download&&i.set("download",e.download===!0?"":e.download),e?.transform&&this.applyTransformOptsToQuery(i,e.transform),e?.cacheNonce!=null&&i.set("cacheNonce",String(e.cacheNonce)),e?.versionId!=null&&i.set("versionId",String(e.versionId));const r=i.toString(),s=typeof e?.transform=="object"&&e.transform!==null&&Object.keys(e.transform).length>0?"render/image":"object";return{data:{publicUrl:encodeURI(`${this.url}/${s}/public/${t}`)+(r?`?${r}`:"")}}}async remove(n){var e=this;return e.handleOperation(async()=>await pr(e.fetch,`${e.url}/object/${e.bucketId}`,{prefixes:n},{headers:e.headers}))}async purgeCache(n,e,t){var i=this;return i.handleOperation(async()=>{const r=Gl(i._getFinalPath(n)),s=new URLSearchParams;e?.transformations&&s.set("transformations","true");const o=s.toString();return await pr(i.fetch,`${i.url}/cdn/${r}${o?`?${o}`:""}`,{},{headers:i.headers},t)})}async list(n,e,t){var i=this;return i.handleOperation(async()=>{const r=e?.sortBy?Ue(Ue({},Pa.sortBy),e.sortBy):Pa.sortBy,s=Ue(Ue(Ue({},Pa),e),{},{sortBy:r,prefix:n||""});return await an(i.fetch,`${i.url}/object/list/${i.bucketId}`,s,{headers:i.headers},t)})}async listV2(n,e){var t=this;return t.handleOperation(async()=>{const i=Ue({},n);return await an(t.fetch,`${t.url}/object/list-v2/${t.bucketId}`,i,{headers:t.headers},e)})}encodeMetadata(n){return JSON.stringify(n)}toBase64(n){return typeof Buffer<"u"?Buffer.from(n).toString("base64"):btoa(n)}_getFinalPath(n){return`${this.bucketId}/${n.replace(/^\/+/,"")}`}_removeEmptyFolders(n){return n.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}applyTransformOptsToQuery(n,e){return e.width&&n.set("width",e.width.toString()),e.height&&n.set("height",e.height.toString()),e.resize&&n.set("resize",e.resize),e.format&&n.set("format",e.format),e.quality&&n.set("quality",e.quality.toString()),n}};const sx="2.117.1",_s={"X-Client-Info":`storage-js/${sx}`};var ox=class extends Ar{constructor(n,e={},t,i){const r=new URL(n);i?.useNewHostname&&/supabase\.(co|in|red)$/.test(r.hostname)&&!r.hostname.includes("storage.supabase.")&&(r.hostname=r.hostname.replace("supabase.","storage.supabase."));const s=r.href.replace(/\/$/,""),o=Ue(Ue({},_s),e);super(s,o,t,"storage")}async listBuckets(n){var e=this;return e.handleOperation(async()=>{const t=e.listBucketOptionsToQueryString(n);return await fr(e.fetch,`${e.url}/bucket${t}`,{headers:e.headers})})}async getBucket(n){var e=this;return e.handleOperation(async()=>await fr(e.fetch,`${e.url}/bucket/${n}`,{headers:e.headers}))}async createBucket(n,e={public:!1}){var t=this;return t.handleOperation(async()=>await an(t.fetch,`${t.url}/bucket`,{id:n,name:n,type:e.type,public:e.public,file_size_limit:e.fileSizeLimit,allowed_mime_types:e.allowedMimeTypes,versioning_status:e.versioningStatus},{headers:t.headers}))}async updateBucket(n,e){var t=this;return t.handleOperation(async()=>await Eo(t.fetch,`${t.url}/bucket/${n}`,{id:n,name:n,public:e.public,file_size_limit:e.fileSizeLimit,allowed_mime_types:e.allowedMimeTypes,versioning_status:e.versioningStatus},{headers:t.headers}))}async emptyBucket(n){var e=this;return e.handleOperation(async()=>await an(e.fetch,`${e.url}/bucket/${n}/empty`,{},{headers:e.headers}))}async deleteBucket(n){var e=this;return e.handleOperation(async()=>await pr(e.fetch,`${e.url}/bucket/${n}`,{},{headers:e.headers}))}async getBucketLifecycle(n){var e=this;return e.handleOperation(async()=>await fr(e.fetch,e.bucketLifecycleUrl(n),{headers:e.headers}))}async updateBucketLifecycle(n,e){var t=this;return t.handleOperation(async()=>await Eo(t.fetch,t.bucketLifecycleUrl(n),e,{headers:t.headers}))}async deleteBucketLifecycle(n){var e=this;return e.handleOperation(async()=>await pr(e.fetch,e.bucketLifecycleUrl(n),{},{headers:e.headers}))}async purgeBucketCache(n,e,t){var i=this;return i.handleOperation(async()=>{const r=new URLSearchParams;e?.transformations&&r.set("transformations","true");const s=r.toString();return await pr(i.fetch,`${i.url}/cdn/${Gl(n)}${s?`?${s}`:""}`,{},{headers:i.headers},t)})}bucketLifecycleUrl(n){return`${this.url}/bucket/${Gl(n)}/lifecycle`}listBucketOptionsToQueryString(n){const e={};return n&&("limit"in n&&(e.limit=String(n.limit)),"offset"in n&&(e.offset=String(n.offset)),n.search&&(e.search=n.search),n.sortColumn&&(e.sortColumn=n.sortColumn),n.sortOrder&&(e.sortOrder=n.sortOrder)),Object.keys(e).length>0?"?"+new URLSearchParams(e).toString():""}},ax=class extends Ar{constructor(n,e={},t){const i=n.replace(/\/$/,""),r=Ue(Ue({},_s),e);super(i,r,t,"storage")}async createBucket(n){var e=this;return e.handleOperation(async()=>await an(e.fetch,`${e.url}/bucket`,{name:n},{headers:e.headers}))}async listBuckets(n){var e=this;return e.handleOperation(async()=>{const t=new URLSearchParams;n?.limit!==void 0&&t.set("limit",n.limit.toString()),n?.offset!==void 0&&t.set("offset",n.offset.toString()),n?.sortColumn&&t.set("sortColumn",n.sortColumn),n?.sortOrder&&t.set("sortOrder",n.sortOrder),n?.search&&t.set("search",n.search);const i=t.toString(),r=i?`${e.url}/bucket?${i}`:`${e.url}/bucket`;return await fr(e.fetch,r,{headers:e.headers})})}async deleteBucket(n){var e=this;return e.handleOperation(async()=>await pr(e.fetch,`${e.url}/bucket/${n}`,{},{headers:e.headers}))}from(n){var e=this;if(!Jw(n))throw new zo("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");const t=new jw({baseUrl:this.url,catalogName:n,auth:{type:"custom",getHeaders:async()=>e.headers},fetch:this.fetch}),i=this.shouldThrowOnError;return new Proxy(t,{get(r,s){const o=r[s];return typeof o!="function"?o:async(...a)=>{try{return{data:await o.apply(r,a),error:null}}catch(l){if(i)throw l;return{data:null,error:l}}}}})}},lx=class extends Ar{constructor(n,e={},t){const i=n.replace(/\/$/,""),r=Ue(Ue({},_s),{},{"Content-Type":"application/json"},e);super(i,r,t,"vectors")}async createIndex(n){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/CreateIndex`,n,{headers:e.headers})||{})}async getIndex(n,e){var t=this;return t.handleOperation(async()=>await $t.post(t.fetch,`${t.url}/GetIndex`,{vectorBucketName:n,indexName:e},{headers:t.headers}))}async listIndexes(n){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/ListIndexes`,n,{headers:e.headers}))}async deleteIndex(n,e){var t=this;return t.handleOperation(async()=>await $t.post(t.fetch,`${t.url}/DeleteIndex`,{vectorBucketName:n,indexName:e},{headers:t.headers})||{})}},cx=class extends Ar{constructor(n,e={},t){const i=n.replace(/\/$/,""),r=Ue(Ue({},_s),{},{"Content-Type":"application/json"},e);super(i,r,t,"vectors")}async putVectors(n){var e=this;if(n.vectors.length<1||n.vectors.length>500)throw new Error("Vector batch size must be between 1 and 500 items");return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/PutVectors`,n,{headers:e.headers})||{})}async getVectors(n){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/GetVectors`,n,{headers:e.headers}))}async listVectors(n){var e=this;if(n.segmentCount!==void 0){if(n.segmentCount<1||n.segmentCount>16)throw new Error("segmentCount must be between 1 and 16");if(n.segmentIndex!==void 0&&(n.segmentIndex<0||n.segmentIndex>=n.segmentCount))throw new Error(`segmentIndex must be between 0 and ${n.segmentCount-1}`)}return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/ListVectors`,n,{headers:e.headers}))}async queryVectors(n){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/QueryVectors`,n,{headers:e.headers}))}async deleteVectors(n){var e=this;if(n.keys.length<1||n.keys.length>500)throw new Error("Keys batch size must be between 1 and 500 items");return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/DeleteVectors`,n,{headers:e.headers})||{})}},ux=class extends Ar{constructor(n,e={},t){const i=n.replace(/\/$/,""),r=Ue(Ue({},_s),{},{"Content-Type":"application/json"},e);super(i,r,t,"vectors")}async createBucket(n){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/CreateVectorBucket`,{vectorBucketName:n},{headers:e.headers})||{})}async getBucket(n){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/GetVectorBucket`,{vectorBucketName:n},{headers:e.headers}))}async listBuckets(n={}){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/ListVectorBuckets`,n,{headers:e.headers}))}async deleteBucket(n){var e=this;return e.handleOperation(async()=>await $t.post(e.fetch,`${e.url}/DeleteVectorBucket`,{vectorBucketName:n},{headers:e.headers})||{})}},hx=class extends ux{constructor(n,e={}){super(n,e.headers||{},e.fetch)}from(n){return new dx(this.url,this.headers,n,this.fetch)}async createBucket(n){var e=()=>super.createBucket,t=this;return e().call(t,n)}async getBucket(n){var e=()=>super.getBucket,t=this;return e().call(t,n)}async listBuckets(n={}){var e=()=>super.listBuckets,t=this;return e().call(t,n)}async deleteBucket(n){var e=()=>super.deleteBucket,t=this;return e().call(t,n)}},dx=class extends lx{constructor(n,e,t,i){super(n,e,i),this.vectorBucketName=t}async createIndex(n){var e=()=>super.createIndex,t=this;return e().call(t,Ue(Ue({},n),{},{vectorBucketName:t.vectorBucketName}))}async listIndexes(n={}){var e=()=>super.listIndexes,t=this;return e().call(t,Ue(Ue({},n),{},{vectorBucketName:t.vectorBucketName}))}async getIndex(n){var e=()=>super.getIndex,t=this;return e().call(t,t.vectorBucketName,n)}async deleteIndex(n){var e=()=>super.deleteIndex,t=this;return e().call(t,t.vectorBucketName,n)}index(n){return new fx(this.url,this.headers,this.vectorBucketName,n,this.fetch)}},fx=class extends cx{constructor(n,e,t,i,r){super(n,e,r),this.vectorBucketName=t,this.indexName=i}async putVectors(n){var e=()=>super.putVectors,t=this;return e().call(t,Ue(Ue({},n),{},{vectorBucketName:t.vectorBucketName,indexName:t.indexName}))}async getVectors(n){var e=()=>super.getVectors,t=this;return e().call(t,Ue(Ue({},n),{},{vectorBucketName:t.vectorBucketName,indexName:t.indexName}))}async listVectors(n={}){var e=()=>super.listVectors,t=this;return e().call(t,Ue(Ue({},n),{},{vectorBucketName:t.vectorBucketName,indexName:t.indexName}))}async queryVectors(n){var e=()=>super.queryVectors,t=this;return e().call(t,Ue(Ue({},n),{},{vectorBucketName:t.vectorBucketName,indexName:t.indexName}))}async deleteVectors(n){var e=()=>super.deleteVectors,t=this;return e().call(t,Ue(Ue({},n),{},{vectorBucketName:t.vectorBucketName,indexName:t.indexName}))}},px=class extends ox{constructor(n,e={},t,i){super(n,e,t,i)}from(n){return new rx(this.url,this.headers,n,this.fetch)}get vectors(){return new hx(this.url+"/vector",{headers:this.headers,fetch:this.fetch})}get analytics(){return new ax(this.url+"/iceberg",this.headers,this.fetch)}};const Fd="2.117.1",Bn=30*1e3,Gr=3,Ia=Gr*Bn,mx=2*Bn,gx="http://localhost:9999",_x="supabase.auth.token",vx={"X-Client-Info":`gotrue-js/${Fd}`},jl="X-Supabase-Api-Version",Bd={"2024-01-01":{timestamp:Date.parse("2024-01-01T00:00:00.0Z"),name:"2024-01-01"}},yx=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,Ei="sb_flow_id",Sx=5,wx=600*1e3;class cs extends Error{constructor(e,t,i){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=t,this.code=i}toJSON(){return{name:this.name,message:this.message,status:this.status,code:this.code}}}function ye(n){return typeof n=="object"&&n!==null&&"__isAuthError"in n}class xx extends cs{constructor(e,t,i){super(e,t,i),this.name="AuthApiError",this.status=t,this.code=i}}function nh(n){return ye(n)&&n.name==="AuthApiError"}class un extends cs{constructor(e,t){super(e),this.name="AuthUnknownError",this.originalError=t}}class Tn extends cs{constructor(e,t,i,r){super(e,i,r),this.name=t,this.status=i}}class bt extends Tn{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function to(n){return ye(n)&&n.name==="AuthSessionMissingError"}class Zi extends Tn{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class no extends Tn{constructor(e){super(e,"AuthInvalidCredentialsError",400,void 0)}}class io extends Tn{constructor(e,t=null){super(e,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}}function bx(n){return ye(n)&&n.name==="AuthImplicitGrantRedirectError"}class ih extends Tn{constructor(e,t=null){super(e,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}}class Ex extends Tn{constructor(){super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.","AuthPKCECodeVerifierMissingError",400,"pkce_code_verifier_not_found")}}class po extends Tn{constructor(e,t){super(e,"AuthRetryableFetchError",t,void 0)}}function ro(n){return ye(n)&&n.name==="AuthRetryableFetchError"}class rh extends Tn{constructor(e="Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)"){super(e,"AuthRefreshDiscardedError",409,void 0)}}function sh(n){return ye(n)&&n.name==="AuthRefreshDiscardedError"}class oh extends Tn{constructor(e,t,i){super(e,"AuthWeakPasswordError",t,"weak_password"),this.reasons=i}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reasons:this.reasons})}}class Mo extends Tn{constructor(e){super(e,"AuthInvalidJwtError",400,"invalid_jwt")}}const To="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),ah=` 	
\r=`.split(""),Mx=(()=>{const n=new Array(128);for(let e=0;e<n.length;e+=1)n[e]=-1;for(let e=0;e<ah.length;e+=1)n[ah[e].charCodeAt(0)]=-2;for(let e=0;e<To.length;e+=1)n[To[e].charCodeAt(0)]=e;return n})();function lh(n,e,t){if(n!==null)for(e.queue=e.queue<<8|n,e.queuedBits+=8;e.queuedBits>=6;){const i=e.queue>>e.queuedBits-6&63;t(To[i]),e.queuedBits-=6}else if(e.queuedBits>0)for(e.queue=e.queue<<6-e.queuedBits,e.queuedBits=6;e.queuedBits>=6;){const i=e.queue>>e.queuedBits-6&63;t(To[i]),e.queuedBits-=6}}function zd(n,e,t){const i=Mx[n];if(i>-1)for(e.queue=e.queue<<6|i,e.queuedBits+=6;e.queuedBits>=8;)t(e.queue>>e.queuedBits-8&255),e.queuedBits-=8;else{if(i===-2)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(n)}"`)}}function ch(n){const e=[],t=o=>{e.push(String.fromCodePoint(o))},i={utf8seq:0,codepoint:0},r={queue:0,queuedBits:0},s=o=>{Rx(o,i,t)};for(let o=0;o<n.length;o+=1)zd(n.charCodeAt(o),r,s);return e.join("")}function Tx(n,e){if(n<=127){e(n);return}else if(n<=2047){e(192|n>>6),e(128|n&63);return}else if(n<=65535){e(224|n>>12),e(128|n>>6&63),e(128|n&63);return}else if(n<=1114111){e(240|n>>18),e(128|n>>12&63),e(128|n>>6&63),e(128|n&63);return}throw new Error(`Unrecognized Unicode codepoint: ${n.toString(16)}`)}function Ax(n,e){for(let t=0;t<n.length;t+=1){let i=n.charCodeAt(t);if(i>55295&&i<=56319){const r=(i-55296)*1024&65535;i=(n.charCodeAt(t+1)-56320&65535|r)+65536,t+=1}Tx(i,e)}}function Rx(n,e,t){if(e.utf8seq===0){if(n<=127){t(n);return}for(let i=1;i<6;i+=1)if((n>>7-i&1)===0){e.utf8seq=i;break}if(e.utf8seq===2)e.codepoint=n&31;else if(e.utf8seq===3)e.codepoint=n&15;else if(e.utf8seq===4)e.codepoint=n&7;else throw new Error("Invalid UTF-8 sequence");e.utf8seq-=1}else if(e.utf8seq>0){if(n<=127)throw new Error("Invalid UTF-8 sequence");e.codepoint=e.codepoint<<6|n&63,e.utf8seq-=1,e.utf8seq===0&&t(e.codepoint)}}function mr(n){const e=[],t={queue:0,queuedBits:0},i=r=>{e.push(r)};for(let r=0;r<n.length;r+=1)zd(n.charCodeAt(r),t,i);return new Uint8Array(e)}function Cx(n){const e=[];return Ax(n,t=>e.push(t)),new Uint8Array(e)}function Mi(n){const e=[],t={queue:0,queuedBits:0},i=r=>{e.push(r)};return n.forEach(r=>lh(r,t,i)),lh(null,t,i),e.join("")}function Hd(n){return Math.round(Date.now()/1e3)+n}function Px(){return Symbol("auth-callback")}const Mt=()=>typeof window<"u"&&typeof document<"u",mi={tested:!1,writable:!1},Vd=()=>{if(!Mt())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(mi.tested)return mi.writable;const n=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(n,n),globalThis.localStorage.removeItem(n),mi.tested=!0,mi.writable=!0}catch{mi.tested=!0,mi.writable=!1}return mi.writable};function uh(n){const e={},t=new URL(n);if(t.hash&&t.hash[0]==="#")try{new URLSearchParams(t.hash.substring(1)).forEach((r,s)=>{e[s]=r})}catch{}return t.searchParams.forEach((i,r)=>{e[r]=i}),e}const Gd=n=>n?(...e)=>n(...e):(...e)=>fetch(...e),Ix=n=>typeof n=="object"&&n!==null&&"status"in n&&"ok"in n&&"json"in n&&typeof n.json=="function",zn=async(n,e,t)=>{await n.setItem(e,JSON.stringify(t))},Ct=async(n,e)=>{const t=await n.getItem(e);if(!t)return null;try{return JSON.parse(t)}catch{return null}},zt=async(n,e)=>{await n.removeItem(e)};class Vo{constructor(){this.promise=new Vo.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}}Vo.promiseConstructor=Promise;function so(n){const e=n.split(".");if(e.length!==3)throw new Mo("Invalid JWT structure");for(let i=0;i<e.length;i++)if(!yx.test(e[i]))throw new Mo("JWT not in base64url format");return{header:JSON.parse(ch(e[0])),payload:JSON.parse(ch(e[1])),signature:mr(e[2]),raw:{header:e[0],payload:e[1]}}}async function Lx(n){return await new Promise(e=>{setTimeout(()=>e(null),n)})}function Dx(n,e){return new Promise((i,r)=>{(async()=>{for(let s=0;s<1/0;s++)try{const o=await n(s);if(!e(s,null,o)){i(o);return}}catch(o){if(!e(s,o)){r(o);return}}})()})}function jd(n){return("0"+n.toString(16)).substr(-2)}function Ox(){const e=new Uint32Array(56);if(typeof crypto>"u"){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",i=t.length;let r="";for(let s=0;s<56;s++)r+=t.charAt(Math.floor(Math.random()*i));return r}return crypto.getRandomValues(e),Array.from(e,jd).join("")}async function Ux(n){const t=new TextEncoder().encode(n),i=await crypto.subtle.digest("SHA-256",t),r=new Uint8Array(i);return Array.from(r).map(s=>String.fromCharCode(s)).join("")}async function Nx(n){if(!(typeof crypto<"u"&&typeof crypto.subtle<"u"&&typeof TextEncoder<"u"))return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),n;const t=await Ux(n);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}const kx=/^[a-zA-Z0-9_-]{8,64}$/;function mo(n){return typeof n=="string"&&kx.test(n)?n:null}function Fx(){if(typeof crypto<"u"&&typeof crypto.getRandomValues=="function"){const e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e,jd).join("")}let n="";for(let e=0;e<32;e++)n+=Math.floor(Math.random()*16).toString(16);return n}const br=(n,e)=>`${n}-flow-${e}-code-verifier`,us=n=>`${n}-flows-code-verifier`;async function hc(n,e){const t=await Ct(n,us(e));return Array.isArray(t)?t.filter(i=>mo(i)!==null):[]}async function Bx(n,e,t,i,r){await zn(n,br(e,t),i);const s=(await hc(n,e)).filter(o=>o!==t);for(s.push(t);s.length>Sx;){const o=s.shift();await zt(n,br(e,o)),r?.(o)}await zn(n,us(e),s),await zn(n,`${e}-code-verifier`,i)}async function zx(n,e,t){if(t){const r=await Ct(n,br(e,t));return{verifier:typeof r=="string"?r:null,flowId:t}}const i=await Ct(n,`${e}-code-verifier`);return{verifier:typeof i=="string"?i:null,flowId:null}}async function on(n,e,t){const i=`${e}-code-verifier`;if(!t){await zt(n,i);return}const r=br(e,t),s=await Ct(n,r);await zt(n,r);const o=await hc(n,e),a=o.filter(l=>l!==t);a.length!==o.length&&(a.length>0?await zn(n,us(e),a):await zt(n,us(e))),s!=null&&s===await Ct(n,i)&&await zt(n,i)}async function Hx(n,e){const t=await hc(n,e);for(const i of t)await zt(n,br(e,i));await zt(n,us(e)),await zt(n,`${e}-code-verifier`)}function Vx(n,e){const t=n.indexOf("#");let i=t===-1?n:n.slice(0,t);const r=t===-1?"":n.slice(t),s=i.indexOf("?");if(s!==-1){const a=i.slice(0,s),l=i.slice(s+1).split("&").filter(c=>c!==""&&c!==Ei&&!c.startsWith(`${Ei}=`));i=l.length>0?`${a}?${l.join("&")}`:a}const o=i.includes("?")?"&":"?";return`${i}${o}${Ei}=${encodeURIComponent(e)}${r}`}async function Gx(n,e,t=!1,i){const r=Ox();let s=r;t&&(s+="/recovery");const o=Fx();await Bx(n,e,o,s,i);const a=await Nx(r);return[a,r===a?"plain":"s256",o]}const jx=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function Wx(n){const e=n.headers.get(jl);if(!e||!e.match(jx))return null;try{return new Date(`${e}T00:00:00.0Z`)}catch{return null}}function $x(n){if(!n)throw new Error("Missing exp claim");const e=Math.floor(Date.now()/1e3);if(n<=e)throw new Error("JWT has expired")}function qx(n){switch(n){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}const Xx=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function On(n){if(!Xx.test(n))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function Nr(n){if(!n.recoveryCodes)throw new Error("@supabase/auth-js: the MFA recovery codes API is experimental and disabled by default. Enable it by passing `auth: { experimental: { recoveryCodes: true } }` to createClient (or to the GoTrueClient constructor).")}function La(){const n={};return new Proxy(n,{get:(e,t)=>{if(t==="__isUserNotAvailableProxy")return!0;if(typeof t=="symbol"){const i=t.toString();if(i==="Symbol(Symbol.toPrimitive)"||i==="Symbol(Symbol.toStringTag)"||i==="Symbol(util.inspect.custom)")return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,t)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,t)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function Kx(n,e){return new Proxy(n,{get:(t,i,r)=>{if(i==="__isInsecureUserWarningProxy")return!0;if(typeof i=="symbol"){const s=i.toString();if(s==="Symbol(Symbol.toPrimitive)"||s==="Symbol(Symbol.toStringTag)"||s==="Symbol(util.inspect.custom)"||s==="Symbol(nodejs.util.inspect.custom)")return Reflect.get(t,i,r)}return!e.value&&typeof i=="string"&&(console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."),e.value=!0),Reflect.get(t,i,r)}})}function hh(n){return JSON.parse(JSON.stringify(n))}const _i=n=>{if(typeof n=="object"&&n!==null){const e=n;if(typeof e.msg=="string")return e.msg;if(typeof e.message=="string")return e.message;if(typeof e.error_description=="string")return e.error_description;if(typeof e.error=="string")return e.error}return JSON.stringify(n)},dh=[500,501,502,503,504,520,521,522,523,524,525,526,527,528,529,530];async function fh(n){var e;if(!Ix(n))throw new po(_i(n),0);let t;try{t=await n.json()}catch(s){throw dh.includes(n.status)?new po(n.statusText||`HTTP ${n.status}`,n.status):new un(_i(s),s)}if(dh.includes(n.status))throw new po(_i(t),n.status);let i;const r=Wx(n);if(r&&r.getTime()>=Bd["2024-01-01"].timestamp&&typeof t=="object"&&t&&typeof t.code=="string"?i=t.code:typeof t=="object"&&t&&typeof t.error_code=="string"&&(i=t.error_code),i){if(i==="weak_password")throw new oh(_i(t),n.status,((e=t.weak_password)===null||e===void 0?void 0:e.reasons)||[]);if(i==="session_not_found")throw new bt}else if(typeof t=="object"&&t&&typeof t.weak_password=="object"&&t.weak_password&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.reasons.reduce((s,o)=>s&&typeof o=="string",!0))throw new oh(_i(t),n.status,t.weak_password.reasons);throw new xx(_i(t),n.status||500,i)}const Yx=(n,e,t,i)=>{const r={method:n,headers:e?.headers||{}};return n==="GET"?r:(r.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},e?.headers),r.body=JSON.stringify(i),Object.assign(Object.assign({},r),t))};async function Ae(n,e,t,i){var r;const s=Object.assign({},i?.headers);s[jl]||(s[jl]=Bd["2024-01-01"].name),i?.jwt&&(s.Authorization=`Bearer ${i.jwt}`);const o=(r=i?.query)!==null&&r!==void 0?r:{};i?.redirectTo&&(o.redirect_to=i.redirectTo);const a=Object.keys(o).length?"?"+new URLSearchParams(o).toString():"",l=await Jx(n,e,t+a,{headers:s,noResolveJson:i?.noResolveJson},{},i?.body);return i?.xform?i?.xform(l):{data:Object.assign({},l),error:null}}async function Jx(n,e,t,i,r,s){const o=Yx(e,i,r,s);let a;try{a=await n(t,Object.assign({},o))}catch(l){throw new po(_i(l),0)}if(a.ok||await fh(a),i?.noResolveJson)return a;try{return await a.json()}catch(l){await fh(l)}}function Yt(n){var e;let t=null;eb(n)&&(t=Object.assign({},n),n.expires_at||(t.expires_at=Hd(n.expires_in)));const i=(e=n.user)!==null&&e!==void 0?e:typeof n?.id=="string"?n:null;return{data:{session:t,user:i},error:null}}function ph(n){const e=Yt(n);return!e.error&&n.weak_password&&typeof n.weak_password=="object"&&Array.isArray(n.weak_password.reasons)&&n.weak_password.reasons.length&&n.weak_password.message&&typeof n.weak_password.message=="string"&&n.weak_password.reasons.reduce((t,i)=>t&&typeof i=="string",!0)&&(e.data.weak_password=n.weak_password),e}function ti(n){var e;return{data:{user:(e=n.user)!==null&&e!==void 0?e:n},error:null}}function Zx(n){return{data:n,error:null}}function Qx(n){const{action_link:e,email_otp:t,hashed_token:i,redirect_to:r,verification_type:s}=n,o=Bo(n,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),a={action_link:e,email_otp:t,hashed_token:i,redirect_to:r,verification_type:s},l=Object.assign({},o);return{data:{properties:a,user:l},error:null}}function mh(n){return n}function eb(n){return!!n.access_token&&!!n.refresh_token&&!!n.expires_in}const Da=["global","local","others"];class tb{constructor({url:e="",headers:t={},fetch:i,experimental:r}){this.url=e,this.headers=t,this.fetch=Gd(i),this.experimental=r??{},this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)},this.customProviders={listProviders:this._listCustomProviders.bind(this),createProvider:this._createCustomProvider.bind(this),getProvider:this._getCustomProvider.bind(this),updateProvider:this._updateCustomProvider.bind(this),deleteProvider:this._deleteCustomProvider.bind(this)},this.passkey={listPasskeys:this._adminListPasskeys.bind(this),deletePasskey:this._adminDeletePasskey.bind(this)}}async signOut(e,t=Da[0]){if(Da.indexOf(t)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${Da.join(", ")}`);try{return await Ae(this.fetch,"POST",`${this.url}/logout?scope=${t}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(i){if(ye(i))return{data:null,error:i};throw i}}async inviteUserByEmail(e,t={}){try{return await Ae(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:ti})}catch(i){if(ye(i))return{data:{user:null},error:i};throw i}}async generateLink(e){try{const{options:t}=e,i=Bo(e,["options"]),r=Object.assign(Object.assign({},i),t);return"newEmail"in i&&(r.new_email=i?.newEmail,delete r.newEmail),await Ae(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:r,headers:this.headers,xform:Qx,redirectTo:t?.redirectTo})}catch(t){if(ye(t))return{data:{properties:null,user:null},error:t};throw t}}async createUser(e){try{return await Ae(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:ti})}catch(t){if(ye(t))return{data:{user:null},error:t};throw t}}async listUsers(e){var t,i,r,s,o,a,l;try{const c={nextPage:null,lastPage:0,total:0},u=await Ae(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(i=(t=e?.page)===null||t===void 0?void 0:t.toString())!==null&&i!==void 0?i:"",per_page:(s=(r=e?.perPage)===null||r===void 0?void 0:r.toString())!==null&&s!==void 0?s:""},xform:mh});if(u.error)throw u.error;const h=await u.json(),d=(o=u.headers.get("x-total-count"))!==null&&o!==void 0?o:0,f=(l=(a=u.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&l!==void 0?l:[];return f.length>0&&(f.forEach(g=>{const v=parseInt(g.split(";")[0].split("=")[1].substring(0,1)),m=JSON.parse(g.split(";")[1].split("=")[1]);c[`${m}Page`]=v}),c.total=parseInt(d)),{data:Object.assign(Object.assign({},h),c),error:null}}catch(c){if(ye(c))return{data:{users:[]},error:c};throw c}}async getUserById(e){On(e);try{return await Ae(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:ti})}catch(t){if(ye(t))return{data:{user:null},error:t};throw t}}async updateUserById(e,t){On(e);try{return await Ae(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:ti})}catch(i){if(ye(i))return{data:{user:null},error:i};throw i}}async deleteUser(e,t=!1){On(e);try{return await Ae(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:ti})}catch(i){if(ye(i))return{data:{user:null},error:i};throw i}}async _listFactors(e){On(e.userId);try{const{data:t,error:i}=await Ae(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:r=>({data:{factors:r},error:null})});return{data:t,error:i}}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _deleteFactor(e){On(e.userId),On(e.id);try{return{data:await Ae(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _listOAuthClients(e){var t,i,r,s,o,a,l;try{const c={nextPage:null,lastPage:0,total:0},u=await Ae(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(i=(t=e?.page)===null||t===void 0?void 0:t.toString())!==null&&i!==void 0?i:"",per_page:(s=(r=e?.perPage)===null||r===void 0?void 0:r.toString())!==null&&s!==void 0?s:""},xform:mh});if(u.error)throw u.error;const h=await u.json(),d=(o=u.headers.get("x-total-count"))!==null&&o!==void 0?o:0,f=(l=(a=u.headers.get("link"))===null||a===void 0?void 0:a.split(","))!==null&&l!==void 0?l:[];return f.length>0&&(f.forEach(g=>{const v=parseInt(g.split(";")[0].split("=")[1].substring(0,1)),m=JSON.parse(g.split(";")[1].split("=")[1]);c[`${m}Page`]=v}),c.total=parseInt(d)),{data:Object.assign(Object.assign({},h),c),error:null}}catch(c){if(ye(c))return{data:{clients:[]},error:c};throw c}}async _createOAuthClient(e){try{return await Ae(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _getOAuthClient(e){try{return await Ae(this.fetch,"GET",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _updateOAuthClient(e,t){try{return await Ae(this.fetch,"PUT",`${this.url}/admin/oauth/clients/${e}`,{body:t,headers:this.headers,xform:i=>({data:i,error:null})})}catch(i){if(ye(i))return{data:null,error:i};throw i}}async _deleteOAuthClient(e){try{return await Ae(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _regenerateOAuthClientSecret(e){try{return await Ae(this.fetch,"POST",`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _listCustomProviders(e){try{const t={};return e?.type&&(t.type=e.type),await Ae(this.fetch,"GET",`${this.url}/admin/custom-providers`,{headers:this.headers,query:t,xform:i=>{var r;return{data:{providers:(r=i?.providers)!==null&&r!==void 0?r:[]},error:null}}})}catch(t){if(ye(t))return{data:{providers:[]},error:t};throw t}}async _createCustomProvider(e){try{return await Ae(this.fetch,"POST",`${this.url}/admin/custom-providers`,{body:e,headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _getCustomProvider(e){try{return await Ae(this.fetch,"GET",`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _updateCustomProvider(e,t){try{return await Ae(this.fetch,"PUT",`${this.url}/admin/custom-providers/${e}`,{body:t,headers:this.headers,xform:i=>({data:i,error:null})})}catch(i){if(ye(i))return{data:null,error:i};throw i}}async _deleteCustomProvider(e){try{return await Ae(this.fetch,"DELETE",`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _adminListPasskeys(e){On(e.userId);try{return await Ae(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/passkeys`,{headers:this.headers,xform:t=>({data:t,error:null})})}catch(t){if(ye(t))return{data:null,error:t};throw t}}async _adminDeletePasskey(e){On(e.userId),On(e.passkeyId);try{return await Ae(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/passkeys/${e.passkeyId}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(t){if(ye(t))return{data:null,error:t};throw t}}}function gh(n={}){return{getItem:e=>n[e]||null,setItem:(e,t)=>{n[e]=t},removeItem:e=>{delete n[e]}}}globalThis&&Vd()&&globalThis.localStorage&&globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug");class nb extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}}function ib(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}function Wd(n){if(!/^0x[a-fA-F0-9]{40}$/.test(n))throw new Error(`@supabase/auth-js: Address "${n}" is invalid.`);return n.toLowerCase()}function rb(n){return parseInt(n,16)}function sb(n){const e=new TextEncoder().encode(n);return"0x"+Array.from(e,i=>i.toString(16).padStart(2,"0")).join("")}function ob(n){var e;const{chainId:t,domain:i,expirationTime:r,issuedAt:s=new Date,nonce:o,notBefore:a,requestId:l,resources:c,scheme:u,uri:h,version:d}=n;{if(!Number.isInteger(t))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${t}`);if(!i)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(o&&o.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${o}`);if(!h)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if(d!=="1")throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`);if(!((e=n.statement)===null||e===void 0)&&e.includes(`
`))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${n.statement}`)}const f=Wd(n.address),g=u?`${u}://${i}`:i,v=n.statement?`${n.statement}
`:"",m=`${g} wants you to sign in with your Ethereum account:
${f}

${v}`;let p=`URI: ${h}
Version: ${d}
Chain ID: ${t}${o?`
Nonce: ${o}`:""}
Issued At: ${s.toISOString()}`;if(r&&(p+=`
Expiration Time: ${r.toISOString()}`),a&&(p+=`
Not Before: ${a.toISOString()}`),l&&(p+=`
Request ID: ${l}`),c){let M=`
Resources:`;for(const S of c){if(!S||typeof S!="string")throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${S}`);M+=`
- ${S}`}p+=M}return`${m}
${p}`}class _t extends Error{constructor({message:e,code:t,cause:i,name:r}){var s;super(e,{cause:i}),this.__isWebAuthnError=!0,this.name=(s=r??(i instanceof Error?i.name:void 0))!==null&&s!==void 0?s:"Unknown Error",this.code=t}toJSON(){return{name:this.name,message:this.message,code:this.code}}}class Ao extends _t{constructor(e,t){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t,message:e}),this.name="WebAuthnUnknownError",this.originalError=t}}function ab({error:n,options:e}){var t,i,r;const{publicKey:s}=e;if(!s)throw Error("options was missing required publicKey property");if(n.name==="AbortError"){if(e.signal instanceof AbortSignal)return new _t({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:n})}else if(n.name==="ConstraintError"){if(((t=s.authenticatorSelection)===null||t===void 0?void 0:t.requireResidentKey)===!0)return new _t({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:n});if(e.mediation==="conditional"&&((i=s.authenticatorSelection)===null||i===void 0?void 0:i.userVerification)==="required")return new _t({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:n});if(((r=s.authenticatorSelection)===null||r===void 0?void 0:r.userVerification)==="required")return new _t({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:n})}else{if(n.name==="InvalidStateError")return new _t({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:n});if(n.name==="NotAllowedError")return new _t({message:n.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:n});if(n.name==="NotSupportedError")return s.pubKeyCredParams.filter(a=>a.type==="public-key").length===0?new _t({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:n}):new _t({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:n});if(n.name==="SecurityError"){const o=window.location.hostname;if($d(o)){if(s.rp.id!==o)return new _t({message:`The RP ID "${s.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:n})}else return new _t({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:n})}else if(n.name==="TypeError"){if(s.user.id.byteLength<1||s.user.id.byteLength>64)return new _t({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:n})}else if(n.name==="UnknownError")return new _t({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:n})}return new _t({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:n})}function lb({error:n,options:e}){const{publicKey:t}=e;if(!t)throw Error("options was missing required publicKey property");if(n.name==="AbortError"){if(e.signal instanceof AbortSignal)return new _t({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:n})}else{if(n.name==="NotAllowedError")return new _t({message:n.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:n});if(n.name==="SecurityError"){const i=window.location.hostname;if($d(i)){if(t.rpId!==i)return new _t({message:`The RP ID "${t.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:n})}else return new _t({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:n})}else if(n.name==="UnknownError")return new _t({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:n})}return new _t({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:n})}class cb{createNewAbortSignal(){if(this.controller){const t=new Error("Cancelling existing WebAuthn API call for new one");t.name="AbortError",this.controller.abort(t)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}}const Wl=new cb;function _h(n){if(!n)throw new Error("Credential creation options are required");if(typeof PublicKeyCredential<"u"&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON=="function")return PublicKeyCredential.parseCreationOptionsFromJSON(n);const{challenge:e,user:t,excludeCredentials:i}=n,r=Bo(n,["challenge","user","excludeCredentials"]),s=mr(e).buffer,o=Object.assign(Object.assign({},t),{id:mr(t.id).buffer}),a=Object.assign(Object.assign({},r),{challenge:s,user:o});if(i&&i.length>0){a.excludeCredentials=new Array(i.length);for(let l=0;l<i.length;l++){const c=i[l];a.excludeCredentials[l]=Object.assign(Object.assign({},c),{id:mr(c.id).buffer,type:c.type||"public-key",transports:c.transports})}}return a}function vh(n){if(!n)throw new Error("Credential request options are required");if(typeof PublicKeyCredential<"u"&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON=="function")return PublicKeyCredential.parseRequestOptionsFromJSON(n);const{challenge:e,allowCredentials:t}=n,i=Bo(n,["challenge","allowCredentials"]),r=mr(e).buffer,s=Object.assign(Object.assign({},i),{challenge:r});if(t&&t.length>0){s.allowCredentials=new Array(t.length);for(let o=0;o<t.length;o++){const a=t[o];s.allowCredentials[o]=Object.assign(Object.assign({},a),{id:mr(a.id).buffer,type:a.type||"public-key",transports:a.transports})}}return s}function yh(n){var e;if("toJSON"in n&&typeof n.toJSON=="function")return n.toJSON();const t=n;return{id:n.id,rawId:n.id,response:{attestationObject:Mi(new Uint8Array(n.response.attestationObject)),clientDataJSON:Mi(new Uint8Array(n.response.clientDataJSON))},type:"public-key",clientExtensionResults:n.getClientExtensionResults(),authenticatorAttachment:(e=t.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function Sh(n){var e;if("toJSON"in n&&typeof n.toJSON=="function")return n.toJSON();const t=n,i=n.getClientExtensionResults(),r=n.response;return{id:n.id,rawId:n.id,response:{authenticatorData:Mi(new Uint8Array(r.authenticatorData)),clientDataJSON:Mi(new Uint8Array(r.clientDataJSON)),signature:Mi(new Uint8Array(r.signature)),userHandle:r.userHandle?Mi(new Uint8Array(r.userHandle)):void 0},type:"public-key",clientExtensionResults:i,authenticatorAttachment:(e=t.authenticatorAttachment)!==null&&e!==void 0?e:void 0}}function $d(n){return n==="localhost"||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(n)}function Ro(){var n,e;return!!(Mt()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&typeof((n=navigator?.credentials)===null||n===void 0?void 0:n.create)=="function"&&typeof((e=navigator?.credentials)===null||e===void 0?void 0:e.get)=="function")}async function qd(n){try{const e=await navigator.credentials.create(n);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Ao("Browser returned unexpected credential type",e)}:{data:null,error:new Ao("Empty credential response",e)}}catch(e){return{data:null,error:ab({error:e,options:n})}}}async function Xd(n){try{const e=await navigator.credentials.get(n);return e?e instanceof PublicKeyCredential?{data:e,error:null}:{data:null,error:new Ao("Browser returned unexpected credential type",e)}:{data:null,error:new Ao("Empty credential response",e)}}catch(e){return{data:null,error:lb({error:e,options:n})}}}const ub={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"direct"},hb={userVerification:"preferred",hints:["security-key"],attestation:"direct"};function Co(...n){const e=r=>r!==null&&typeof r=="object"&&!Array.isArray(r),t=r=>r instanceof ArrayBuffer||ArrayBuffer.isView(r),i={};for(const r of n)if(r)for(const s in r){const o=r[s];if(o!==void 0)if(Array.isArray(o))i[s]=o;else if(t(o))i[s]=o;else if(e(o)){const a=i[s];e(a)?i[s]=Co(a,o):i[s]=Co(o)}else i[s]=o}return i}function db(n,e){return Co(ub,n,e||{})}function fb(n,e){return Co(hb,n,e||{})}class pb{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:"webauthn"}))}async _challenge({factorId:e,webauthn:t,friendlyName:i,signal:r},s){var o;try{const{data:a,error:l}=await this.client.mfa.challenge({factorId:e,webauthn:t});if(!a)return{data:null,error:l};const c=r??Wl.createNewAbortSignal();if(a.webauthn.type==="create"){const{user:u}=a.webauthn.credential_options.publicKey;if(!u.name){const h=i;if(h)u.name=`${u.id}:${h}`;else{const f=(await this.client.getUser()).data.user,g=((o=f?.user_metadata)===null||o===void 0?void 0:o.name)||f?.email||f?.id||"User";u.name=`${u.id}:${g}`}}u.displayName||(u.displayName=u.name)}switch(a.webauthn.type){case"create":{const u=db(a.webauthn.credential_options.publicKey,s?.create),{data:h,error:d}=await qd({publicKey:u,signal:c});return h?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:h}},error:null}:{data:null,error:d}}case"request":{const u=fb(a.webauthn.credential_options.publicKey,s?.request),{data:h,error:d}=await Xd(Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:u,signal:c}));return h?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:h}},error:null}:{data:null,error:d}}}}catch(a){return ye(a)?{data:null,error:a}:{data:null,error:new un("Unexpected error in challenge",a)}}}async _verify({challengeId:e,factorId:t,webauthn:i}){return this.client.mfa.verify({factorId:t,challengeId:e,webauthn:i})}async _authenticate({factorId:e,webauthn:{rpId:t=typeof window<"u"?window.location.hostname:void 0,rpOrigins:i=typeof window<"u"?[window.location.origin]:void 0,signal:r}={}},s){if(!t)return{data:null,error:new cs("rpId is required for WebAuthn authentication")};try{if(!Ro())return{data:null,error:new un("Browser does not support WebAuthn",null)};const{data:o,error:a}=await this.challenge({factorId:e,webauthn:{rpId:t,rpOrigins:i},signal:r},{request:s});if(!o)return{data:null,error:a};const{webauthn:l}=o;return this._verify({factorId:e,challengeId:o.challengeId,webauthn:{type:l.type,rpId:t,rpOrigins:i,credential_response:l.credential_response}})}catch(o){return ye(o)?{data:null,error:o}:{data:null,error:new un("Unexpected error in authenticate",o)}}}async _register({friendlyName:e,webauthn:{rpId:t=typeof window<"u"?window.location.hostname:void 0,rpOrigins:i=typeof window<"u"?[window.location.origin]:void 0,signal:r}={}},s){if(!t)return{data:null,error:new cs("rpId is required for WebAuthn registration")};try{if(!Ro())return{data:null,error:new un("Browser does not support WebAuthn",null)};const{data:o,error:a}=await this._enroll({friendlyName:e});if(!o)return await this.client.mfa.listFactors().then(u=>{var h;return(h=u.data)===null||h===void 0?void 0:h.all.find(d=>d.factor_type==="webauthn"&&d.friendly_name===e&&d.status==="unverified")}).then(u=>u?this.client.mfa.unenroll({factorId:u?.id}):void 0),{data:null,error:a};const{data:l,error:c}=await this._challenge({factorId:o.id,friendlyName:o.friendly_name,webauthn:{rpId:t,rpOrigins:i},signal:r},{create:s});return l?this._verify({factorId:o.id,challengeId:l.challengeId,webauthn:{rpId:t,rpOrigins:i,type:l.webauthn.type,credential_response:l.webauthn.credential_response}}):{data:null,error:c}}catch(o){return ye(o)?{data:null,error:o}:{data:null,error:new un("Unexpected error in register",o)}}}}ib();const mb={url:gx,storageKey:_x,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:vx,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1,lockAcquireTimeout:5e3,skipAutoInitialize:!1,experimental:{}},Qi={};let wh=!1;class hs{get jwks(){var e,t;return(t=(e=Qi[this.storageKey])===null||e===void 0?void 0:e.jwks)!==null&&t!==void 0?t:{keys:[]}}set jwks(e){Qi[this.storageKey]=Object.assign(Object.assign({},Qi[this.storageKey]),{jwks:e})}get jwks_cached_at(){var e,t;return(t=(e=Qi[this.storageKey])===null||e===void 0?void 0:e.cachedAt)!==null&&t!==void 0?t:Number.MIN_SAFE_INTEGER}set jwks_cached_at(e){Qi[this.storageKey]=Object.assign(Object.assign({},Qi[this.storageKey]),{cachedAt:e})}constructor(e){var t,i,r;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.autoRefreshTickTimeout=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.lastRefreshFailure=null,this._sessionRemovalEpoch=0,this.initializePromise=null,this._pendingInitNotifications=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lock=null,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;const s=Object.assign(Object.assign({},mb),e);if(this.storageKey=s.storageKey,this.instanceID=(t=hs.nextInstanceID[this.storageKey])!==null&&t!==void 0?t:0,hs.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!s.debug,typeof s.debug=="function"&&(this.logger=s.debug),this.instanceID>0&&Mt()){const o=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(o),this.logDebugMessages&&console.trace(o)}if(this.persistSession=s.persistSession,this.autoRefreshToken=s.autoRefreshToken,this.experimental=(i=s.experimental)!==null&&i!==void 0?i:{},this.admin=new tb({url:s.url,headers:s.headers,fetch:s.fetch,experimental:this.experimental}),this.url=s.url,this.headers=s.headers,this.fetch=Gd(s.fetch),this.detectSessionInUrl=s.detectSessionInUrl,this.flowType=s.flowType,this.hasCustomAuthorizationHeader=s.hasCustomAuthorizationHeader,this.throwOnError=s.throwOnError,this.lockAcquireTimeout=s.lockAcquireTimeout,s.lock!=null&&(this.lock=s.lock,wh||(wh=!0,console.warn(`${this._logPrefix()} The "lock" option is deprecated and will be removed in v3. The client now coordinates session refreshes without a lock, so most apps can drop the option. See https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/migrations/lockless-coordination.md`))),this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new pb(this),recoveryCodes:{getStatus:this._getRecoveryCodesStatus.bind(this),generate:this._generateRecoveryCodes.bind(this),verify:this._verifyRecoveryCode.bind(this),regenerate:this._regenerateRecoveryCodes.bind(this),unenroll:this._unenrollRecoveryCodes.bind(this)}},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.passkey={startRegistration:this._startPasskeyRegistration.bind(this),verifyRegistration:this._verifyPasskeyRegistration.bind(this),startAuthentication:this._startPasskeyAuthentication.bind(this),verifyAuthentication:this._verifyPasskeyAuthentication.bind(this),list:this._listPasskeys.bind(this),update:this._updatePasskey.bind(this),delete:this._deletePasskey.bind(this)},this.persistSession?(s.storage?this.storage=s.storage:Vd()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=gh(this.memoryStorage)),s.userStorage&&(this.userStorage=s.userStorage)):(this.memoryStorage={},this.storage=gh(this.memoryStorage)),Mt()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(o){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",o)}(r=this.broadcastChannel)===null||r===void 0||r.addEventListener("message",async o=>{this._debug("received broadcast notification from other tab or client",o),(o.data.event==="TOKEN_REFRESHED"||o.data.event==="SIGNED_IN")&&(this.lastRefreshFailure=null);try{await this._notifyAllSubscribers(o.data.event,o.data.session,!1)}catch(a){this._debug("#broadcastChannel","error",a)}})}s.skipAutoInitialize||this.initialize().catch(o=>{this._debug("#initialize()","error",o)})}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${Fd}) ${new Date().toISOString()}`}_debug(...e){return this.logDebugMessages&&this.logger(this._logPrefix(),...e),this}async initialize(){var e;if(this.initializePromise)return await this.initializePromise;this._pendingInitNotifications=[],this.initializePromise=(async()=>this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>await this._initialize()):await this._initialize())();const t=await this.initializePromise,i=(e=this._pendingInitNotifications)!==null&&e!==void 0?e:[];this._pendingInitNotifications=null;for(const r of i)await this._notifyAllSubscribers(r.event,r.session,r.broadcast);return t}async _initialize(){var e;try{let t={},i="none";if(Mt()&&(t=uh(window.location.href),this._isImplicitGrantCallback(t)?i="implicit":await this._isPKCECallback(t)&&(i="pkce")),Mt()&&this.detectSessionInUrl&&i!=="none"){const{data:r,error:s}=await this._getSessionFromURL(t,i);if(s){if(this._debug("#_initialize()","error detecting session from URL",s),bx(s)){const l=(e=s.details)===null||e===void 0?void 0:e.code;if(l==="identity_already_exists"||l==="identity_not_found"||l==="single_identity_not_deletable")return{error:s}}return{error:s}}const{session:o,redirectType:a}=r;return this._debug("#_initialize()","detected session in URL",o,"redirect type",a),await this._saveSession(o),setTimeout(async()=>{a==="recovery"?await this._notifyAllSubscribers("PASSWORD_RECOVERY",o):await this._notifyAllSubscribers("SIGNED_IN",o)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(t){return ye(t)?this._returnResult({error:t}):this._returnResult({error:new un("Unexpected error during initialization",t)})}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(e){var t,i,r;try{const s=await Ae(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:(i=(t=e?.options)===null||t===void 0?void 0:t.data)!==null&&i!==void 0?i:{},gotrue_meta_security:{captcha_token:(r=e?.options)===null||r===void 0?void 0:r.captchaToken}},xform:Yt}),{data:o,error:a}=s;if(a||!o)return this._returnResult({data:{user:null,session:null},error:a});const l=o.session,c=o.user;return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",l)),this._returnResult({data:{user:c,session:l},error:null})}catch(s){if(ye(s))return this._returnResult({data:{user:null,session:null},error:s});throw s}}async signUp(e){var t,i,r;let s=null;try{let o;if("email"in e){const{email:h,password:d,options:f}=e;let g=null,v=null;this.flowType==="pkce"&&([g,v,s]=await this._getCodeChallengeAndMethod()),o=await Ae(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(f?.emailRedirectTo,s),body:{email:h,password:d,data:(t=f?.data)!==null&&t!==void 0?t:{},gotrue_meta_security:{captcha_token:f?.captchaToken},code_challenge:g,code_challenge_method:v},xform:Yt})}else if("phone"in e){const{phone:h,password:d,options:f}=e;o=await Ae(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:h,password:d,data:(i=f?.data)!==null&&i!==void 0?i:{},channel:(r=f?.channel)!==null&&r!==void 0?r:"sms",gotrue_meta_security:{captcha_token:f?.captchaToken}},xform:Yt})}else throw new no("You must provide either an email or phone number and a password");const{data:a,error:l}=o;if(l||!a)return await on(this.storage,this.storageKey,s),this._returnResult({data:{user:null,session:null},error:l});const c=a.session,u=a.user;return a.session&&(await this._saveSession(a.session),await this._notifyAllSubscribers("SIGNED_IN",c)),this._returnResult({data:{user:u,session:c},error:null})}catch(o){if(await on(this.storage,this.storageKey,s),ye(o))return this._returnResult({data:{user:null,session:null},error:o});throw o}}async signInWithPassword(e){try{let t;if("email"in e){const{email:s,password:o,options:a}=e;t=await Ae(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:s,password:o,gotrue_meta_security:{captcha_token:a?.captchaToken}},xform:ph})}else if("phone"in e){const{phone:s,password:o,options:a}=e;t=await Ae(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:s,password:o,gotrue_meta_security:{captcha_token:a?.captchaToken}},xform:ph})}else throw new no("You must provide either an email or phone number and a password");const{data:i,error:r}=t;if(r)return this._returnResult({data:{user:null,session:null},error:r});if(!i||!i.session||!i.user){const s=new Zi;return this._returnResult({data:{user:null,session:null},error:s})}return i.session&&(await this._saveSession(i.session),await this._notifyAllSubscribers("SIGNED_IN",i.session)),this._returnResult({data:Object.assign({user:i.user,session:i.session},i.weak_password?{weakPassword:i.weak_password}:null),error:r})}catch(t){if(ye(t))return this._returnResult({data:{user:null,session:null},error:t});throw t}}async signInWithOAuth(e){var t,i,r,s;return await this._handleProviderSignIn(e.provider,{redirectTo:(t=e.options)===null||t===void 0?void 0:t.redirectTo,scopes:(i=e.options)===null||i===void 0?void 0:i.scopes,queryParams:(r=e.options)===null||r===void 0?void 0:r.queryParams,skipBrowserRedirect:(s=e.options)===null||s===void 0?void 0:s.skipBrowserRedirect})}async exchangeCodeForSession(e,t){return await this.initializePromise,this.lock!=null?this._acquireLock(this.lockAcquireTimeout,async()=>this._exchangeCodeForSession(e,t)):this._exchangeCodeForSession(e,t)}async signInWithWeb3(e){const{chain:t}=e;switch(t){case"ethereum":return await this.signInWithEthereum(e);case"solana":return await this.signInWithSolana(e);default:throw new Error(`@supabase/auth-js: Unsupported chain "${t}"`)}}async signInWithEthereum(e){var t,i,r,s,o,a,l,c,u,h,d;let f,g;if("message"in e)f=e.message,g=e.signature;else{const{chain:v,wallet:m,statement:p,options:M}=e;let S;if(Mt())if(typeof m=="object")S=m;else{const E=window;if("ethereum"in E&&typeof E.ethereum=="object"&&"request"in E.ethereum&&typeof E.ethereum.request=="function")S=E.ethereum;else throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")}else{if(typeof m!="object"||!M?.url)throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");S=m}const w=new URL((t=M?.url)!==null&&t!==void 0?t:window.location.href),C=await S.request({method:"eth_requestAccounts"}).then(E=>E).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!C||C.length===0)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const T=Wd(C[0]);let R=(i=M?.signInWithEthereum)===null||i===void 0?void 0:i.chainId;if(!R){const E=await S.request({method:"eth_chainId"});R=rb(E)}const N={domain:w.host,address:T,statement:p,uri:w.href,version:"1",chainId:R,nonce:(r=M?.signInWithEthereum)===null||r===void 0?void 0:r.nonce,issuedAt:(o=(s=M?.signInWithEthereum)===null||s===void 0?void 0:s.issuedAt)!==null&&o!==void 0?o:new Date,expirationTime:(a=M?.signInWithEthereum)===null||a===void 0?void 0:a.expirationTime,notBefore:(l=M?.signInWithEthereum)===null||l===void 0?void 0:l.notBefore,requestId:(c=M?.signInWithEthereum)===null||c===void 0?void 0:c.requestId,resources:(u=M?.signInWithEthereum)===null||u===void 0?void 0:u.resources};f=ob(N),g=await S.request({method:"personal_sign",params:[sb(f),T]})}try{const{data:v,error:m}=await Ae(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:f,signature:g},!((h=e.options)===null||h===void 0)&&h.captchaToken?{gotrue_meta_security:{captcha_token:(d=e.options)===null||d===void 0?void 0:d.captchaToken}}:null),xform:Yt});if(m)throw m;if(!v||!v.session||!v.user){const p=new Zi;return this._returnResult({data:{user:null,session:null},error:p})}return v.session&&(await this._saveSession(v.session),await this._notifyAllSubscribers("SIGNED_IN",v.session)),this._returnResult({data:Object.assign({},v),error:m})}catch(v){if(ye(v))return this._returnResult({data:{user:null,session:null},error:v});throw v}}async signInWithSolana(e){var t,i,r,s,o,a,l,c,u,h,d,f;let g,v;if("message"in e)g=e.message,v=e.signature;else{const{chain:m,wallet:p,statement:M,options:S}=e;let w;if(Mt())if(typeof p=="object")w=p;else{const T=window;if("solana"in T&&typeof T.solana=="object"&&("signIn"in T.solana&&typeof T.solana.signIn=="function"||"signMessage"in T.solana&&typeof T.solana.signMessage=="function"))w=T.solana;else throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")}else{if(typeof p!="object"||!S?.url)throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");w=p}const C=new URL((t=S?.url)!==null&&t!==void 0?t:window.location.href);if("signIn"in w&&w.signIn){const T=await w.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},S?.signInWithSolana),{version:"1",domain:C.host,uri:C.href}),M?{statement:M}:null));let R;if(Array.isArray(T)&&T[0]&&typeof T[0]=="object")R=T[0];else if(T&&typeof T=="object"&&"signedMessage"in T&&"signature"in T)R=T;else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");if("signedMessage"in R&&"signature"in R&&(typeof R.signedMessage=="string"||R.signedMessage instanceof Uint8Array)&&R.signature instanceof Uint8Array)g=typeof R.signedMessage=="string"?R.signedMessage:new TextDecoder().decode(R.signedMessage),v=R.signature;else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")}else{if(!("signMessage"in w)||typeof w.signMessage!="function"||!("publicKey"in w)||typeof w!="object"||!w.publicKey||!("toBase58"in w.publicKey)||typeof w.publicKey.toBase58!="function")throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");g=[`${C.host} wants you to sign in with your Solana account:`,w.publicKey.toBase58(),...M?["",M,""]:[""],"Version: 1",`URI: ${C.href}`,`Issued At: ${(r=(i=S?.signInWithSolana)===null||i===void 0?void 0:i.issuedAt)!==null&&r!==void 0?r:new Date().toISOString()}`,...!((s=S?.signInWithSolana)===null||s===void 0)&&s.notBefore?[`Not Before: ${S.signInWithSolana.notBefore}`]:[],...!((o=S?.signInWithSolana)===null||o===void 0)&&o.expirationTime?[`Expiration Time: ${S.signInWithSolana.expirationTime}`]:[],...!((a=S?.signInWithSolana)===null||a===void 0)&&a.chainId?[`Chain ID: ${S.signInWithSolana.chainId}`]:[],...!((l=S?.signInWithSolana)===null||l===void 0)&&l.nonce?[`Nonce: ${S.signInWithSolana.nonce}`]:[],...!((c=S?.signInWithSolana)===null||c===void 0)&&c.requestId?[`Request ID: ${S.signInWithSolana.requestId}`]:[],...!((h=(u=S?.signInWithSolana)===null||u===void 0?void 0:u.resources)===null||h===void 0)&&h.length?["Resources",...S.signInWithSolana.resources.map(R=>`- ${R}`)]:[]].join(`
`);const T=await w.signMessage(new TextEncoder().encode(g),"utf8");if(!T||!(T instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");v=T}}try{const{data:m,error:p}=await Ae(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:g,signature:Mi(v)},!((d=e.options)===null||d===void 0)&&d.captchaToken?{gotrue_meta_security:{captcha_token:(f=e.options)===null||f===void 0?void 0:f.captchaToken}}:null),xform:Yt});if(p)throw p;if(!m||!m.session||!m.user){const M=new Zi;return this._returnResult({data:{user:null,session:null},error:M})}return m.session&&(await this._saveSession(m.session),await this._notifyAllSubscribers("SIGNED_IN",m.session)),this._returnResult({data:Object.assign({},m),error:p})}catch(m){if(ye(m))return this._returnResult({data:{user:null,session:null},error:m});throw m}}async _exchangeCodeForSession(e,t){const i=t?.flowId!=null,r=i?mo(t?.flowId):Mt()?mo(uh(window.location.href)[Ei]):null;i&&!r&&this._debug("#_exchangeCodeForSession()","provided flowId is not a valid flow id",t?.flowId);const{verifier:s,flowId:o}=i&&!r?{verifier:null,flowId:null}:await zx(this.storage,this.storageKey,r),[a,l]=(s??"").split("/");try{if(!a&&this.flowType==="pkce")throw new Ex;const{data:c,error:u}=await Ae(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:a},xform:Yt});if(await on(this.storage,this.storageKey,o),u)throw u;if(!c||!c.session||!c.user){const h=new Zi;return this._returnResult({data:{user:null,session:null,redirectType:null},error:h})}return c.session&&(await this._saveSession(c.session),await this._notifyAllSubscribers(l==="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",c.session)),this._returnResult({data:Object.assign(Object.assign({},c),{redirectType:l??null}),error:u})}catch(c){if(await on(this.storage,this.storageKey,o),ye(c))return this._returnResult({data:{user:null,session:null,redirectType:null},error:c});throw c}}async signInWithIdToken(e){try{const{options:t,provider:i,token:r,access_token:s,nonce:o}=e,a=await Ae(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:i,id_token:r,access_token:s,nonce:o,gotrue_meta_security:{captcha_token:t?.captchaToken}},xform:Yt}),{data:l,error:c}=a;if(c)return this._returnResult({data:{user:null,session:null},error:c});if(!l||!l.session||!l.user){const u=new Zi;return this._returnResult({data:{user:null,session:null},error:u})}return l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers("SIGNED_IN",l.session)),this._returnResult({data:l,error:c})}catch(t){if(ye(t))return this._returnResult({data:{user:null,session:null},error:t});throw t}}async signInWithOtp(e){var t,i,r,s,o;let a=null;try{if("email"in e){const{email:l,options:c}=e;let u=null,h=null;this.flowType==="pkce"&&([u,h,a]=await this._getCodeChallengeAndMethod());const{error:d}=await Ae(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:l,data:(t=c?.data)!==null&&t!==void 0?t:{},create_user:(i=c?.shouldCreateUser)!==null&&i!==void 0?i:!0,gotrue_meta_security:{captcha_token:c?.captchaToken},code_challenge:u,code_challenge_method:h},redirectTo:this._maybeAppendFlowIdToRedirect(c?.emailRedirectTo,a)});return this._returnResult({data:{user:null,session:null},error:d})}if("phone"in e){const{phone:l,options:c}=e,{data:u,error:h}=await Ae(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:l,data:(r=c?.data)!==null&&r!==void 0?r:{},create_user:(s=c?.shouldCreateUser)!==null&&s!==void 0?s:!0,gotrue_meta_security:{captcha_token:c?.captchaToken},channel:(o=c?.channel)!==null&&o!==void 0?o:"sms"}});return this._returnResult({data:{user:null,session:null,messageId:u?.message_id},error:h})}throw new no("You must provide either an email or phone number.")}catch(l){if(await on(this.storage,this.storageKey,a),ye(l))return this._returnResult({data:{user:null,session:null},error:l});throw l}}async verifyOtp(e){var t,i;try{let r,s;"options"in e&&(r=(t=e.options)===null||t===void 0?void 0:t.redirectTo,s=(i=e.options)===null||i===void 0?void 0:i.captchaToken);const{data:o,error:a}=await Ae(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:s}}),redirectTo:r,xform:Yt});if(a)throw a;if(!o)throw new Error("An error occurred on token verification.");const l=o.session,c=o.user;return l?.access_token&&(await this._saveSession(l),await this._notifyAllSubscribers(e.type=="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",l)),this._returnResult({data:{user:c,session:l},error:null})}catch(r){if(ye(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithSSO(e){var t,i,r,s;let o=null;try{let a=null,l=null;this.flowType==="pkce"&&([a,l,o]=await this._getCodeChallengeAndMethod());const c=await Ae(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:this._maybeAppendFlowIdToRedirect((t=e.options)===null||t===void 0?void 0:t.redirectTo,o)}),!((i=e?.options)===null||i===void 0)&&i.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:a,code_challenge_method:l}),headers:this.headers,xform:Zx});return!((r=c.data)===null||r===void 0)&&r.url&&Mt()&&!(!((s=e.options)===null||s===void 0)&&s.skipBrowserRedirect)&&window.location.assign(c.data.url),this._returnResult(c)}catch(a){if(await on(this.storage,this.storageKey,o),ye(a))return this._returnResult({data:null,error:a});throw a}}async reauthenticate(){return await this.initializePromise,this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>await this._reauthenticate()):await this._reauthenticate()}async _reauthenticate(){try{return await this._useSession(async e=>{const{data:{session:t},error:i}=e;if(i)throw i;if(!t)throw new bt;const{error:r}=await Ae(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:t.access_token});return this._returnResult({data:{user:null,session:null},error:r})})}catch(e){if(ye(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){let t=null;try{const i=`${this.url}/resend`;if("email"in e){const{email:r,type:s,options:o}=e;let a=null,l=null;this.flowType==="pkce"&&([a,l,t]=await this._getCodeChallengeAndMethod());const{error:c}=await Ae(this.fetch,"POST",i,{headers:this.headers,body:{email:r,type:s,gotrue_meta_security:{captcha_token:o?.captchaToken},code_challenge:a,code_challenge_method:l},redirectTo:this._maybeAppendFlowIdToRedirect(o?.emailRedirectTo,t)});return c&&await on(this.storage,this.storageKey,t),this._returnResult({data:{user:null,session:null},error:c})}else if("phone"in e){const{phone:r,type:s,options:o}=e,{data:a,error:l}=await Ae(this.fetch,"POST",i,{headers:this.headers,body:{phone:r,type:s,gotrue_meta_security:{captcha_token:o?.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:a?.message_id},error:l})}throw new no("You must provide either an email or phone number and a type")}catch(i){if(await on(this.storage,this.storageKey,t),ye(i))return this._returnResult({data:{user:null,session:null},error:i});throw i}}async getSession(){return await this.initializePromise,this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>this._useSession(async e=>e)):await this._useSession(async e=>e)}async _acquireLock(e,t){this._debug("#_acquireLock","begin",e);try{if(this.lockAcquired){const i=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),r=(async()=>(await i,await t()))();return this.pendingInLock.push((async()=>{try{await r}catch{}})()),r}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const i=t();for(this.pendingInLock.push((async()=>{try{await i}catch{}})()),await i;this.pendingInLock.length;){const r=[...this.pendingInLock];await Promise.all(r),this.pendingInLock.splice(0,r.length)}return await i}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(e){this._debug("#_useSession","begin");try{const t=await this.__loadSession();return await e(t)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lock!=null&&!this.lockAcquired&&this._debug("#__loadSession()","used outside of an acquired lock!",new Error().stack);try{let e=null;const t=await Ct(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",t),t!==null&&(this._isValidSession(t)?e=t:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!e)return{data:{session:null},error:null};const i=e.expires_at?e.expires_at*1e3-Date.now()<Ia:!1;if(this._debug("#__loadSession()",`session has${i?"":" not"} expired`,"expires_at",e.expires_at),!i)return{data:{session:await this._hydrateSessionUser(e)},error:null};const{data:r,error:s}=await this._callRefreshToken(e.refresh_token);if(s){const o=await Ct(this.storage,this.storageKey);return o&&this._isValidSession(o)&&o.expires_at&&o.expires_at*1e3>Date.now()?this._returnResult({data:{session:await this._hydrateSessionUser(o)},error:null}):this._returnResult({data:{session:null},error:s})}return this._returnResult({data:{session:r},error:null})}finally{this._debug("#__loadSession()","end")}}async _hydrateSessionUser(e){if(this.userStorage){const t=await Ct(this.userStorage,this.storageKey+"-user");e.user=t?.user?t.user:La()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){const t={value:this.suppressGetSessionWarning};e.user=Kx(e.user,t),t.value&&(this.suppressGetSessionWarning=!0)}return e}async getUser(e){if(e)return await this._getUser(e);await this.initializePromise;let t;return this.lock!=null?t=await this._acquireLock(this.lockAcquireTimeout,async()=>await this._getUser()):t=await this._getUser(),t.data.user&&(this.suppressGetSessionWarning=!0),t}async _getUser(e){try{return e?await Ae(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:ti}):await this._useSession(async t=>{var i,r,s;const{data:o,error:a}=t;if(a)throw a;return!(!((i=o.session)===null||i===void 0)&&i.access_token)&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new bt}:await Ae(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:(s=(r=o.session)===null||r===void 0?void 0:r.access_token)!==null&&s!==void 0?s:void 0,xform:ti})})}catch(t){if(ye(t))return to(t)&&await this._removeSession(),this._returnResult({data:{user:null},error:t});throw t}}async updateUser(e,t={}){return await this.initializePromise,this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>await this._updateUser(e,t)):await this._updateUser(e,t)}async _updateUser(e,t={}){let i=null;try{return await this._useSession(async r=>{const{data:s,error:o}=r;if(o)throw o;if(!s.session)throw new bt;const a=s.session;let l=null,c=null;this.flowType==="pkce"&&e.email!=null&&([l,c,i]=await this._getCodeChallengeAndMethod());const{data:u,error:h}=await Ae(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t?.emailRedirectTo,i),body:Object.assign(Object.assign({},e),{code_challenge:l,code_challenge_method:c}),jwt:a.access_token,xform:ti});if(h)throw h;return a.user=u.user,await this._saveSession(a),await this._notifyAllSubscribers("USER_UPDATED",a),this._returnResult({data:{user:a.user},error:null})})}catch(r){if(await on(this.storage,this.storageKey,i),ye(r))return this._returnResult({data:{user:null},error:r});throw r}}async setSession(e){return await this.initializePromise,this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>await this._setSession(e)):await this._setSession(e)}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new bt;const t=Date.now()/1e3;let i=t,r=!0,s=null;const{payload:o}=so(e.access_token);if(o.exp&&(i=o.exp,r=i<=t),r){const{data:a,error:l}=await this._callRefreshToken(e.refresh_token);if(l)return this._returnResult({data:{user:null,session:null},error:l});if(!a)return{data:{user:null,session:null},error:null};s=a}else{const{data:a,error:l}=await this._getUser(e.access_token);if(l)return this._returnResult({data:{user:null,session:null},error:l});s={access_token:e.access_token,refresh_token:e.refresh_token,user:a.user,token_type:"bearer",expires_in:i-t,expires_at:i},await this._saveSession(s),await this._notifyAllSubscribers("SIGNED_IN",s)}return this._returnResult({data:{user:s.user,session:s},error:null})}catch(t){if(ye(t))return this._returnResult({data:{session:null,user:null},error:t});throw t}}async refreshSession(e){return await this.initializePromise,this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>await this._refreshSession(e)):await this._refreshSession(e)}async _refreshSession(e){try{return await this._useSession(async t=>{var i;if(!e){const{data:o,error:a}=t;if(a)throw a;e=(i=o.session)!==null&&i!==void 0?i:void 0}if(!e?.refresh_token)throw new bt;const{data:r,error:s}=await this._callRefreshToken(e.refresh_token);return s?this._returnResult({data:{user:null,session:null},error:s}):r?this._returnResult({data:{user:r.user,session:r},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(t){if(ye(t))return this._returnResult({data:{user:null,session:null},error:t});throw t}}async _getSessionFromURL(e,t){var i;try{if(!Mt())throw new io("No browser detected.");if(e.error||e.error_description||e.error_code)throw new io(e.error_description||"Error in URL with unspecified error_description",{error:e.error||"unspecified_error",code:e.error_code||"unspecified_code"});switch(t){case"implicit":if(this.flowType==="pkce")throw new ih("Not a valid PKCE flow url.");break;case"pkce":if(this.flowType==="implicit")throw new io("Not a valid implicit grant flow url.");break;default:}if(t==="pkce"){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!e.code)throw new ih("No code detected.");const{data:S,error:w}=await this._exchangeCodeForSession(e.code,{flowId:e[Ei]});if(w)throw w;const C=new URL(window.location.href);return C.searchParams.delete("code"),C.searchParams.delete(Ei),window.history.replaceState(window.history.state,"",C.toString()),{data:{session:S.session,redirectType:(i=S.redirectType)!==null&&i!==void 0?i:null},error:null}}const{provider_token:r,provider_refresh_token:s,access_token:o,refresh_token:a,expires_in:l,expires_at:c,token_type:u}=e;if(!o||!l||!a||!u)throw new io("No session defined in URL");const h=Math.round(Date.now()/1e3),d=parseInt(l);let f=h+d;c&&(f=parseInt(c));const g=f-h;g*1e3<=Bn&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${g}s, should have been closer to ${d}s`);const v=f-d;h-v>=120?console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",v,f,h):h-v<0&&console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",v,f,h);const{data:m,error:p}=await this._getUser(o);if(p)throw p;const M={provider_token:r,provider_refresh_token:s,access_token:o,expires_in:d,expires_at:f,refresh_token:a,token_type:u,user:m.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),this._returnResult({data:{session:M,redirectType:e.type},error:null})}catch(r){if(ye(r))return this._returnResult({data:{session:null,redirectType:null},error:r});throw r}}_isImplicitGrantCallback(e){return typeof this.detectSessionInUrl=="function"?this.detectSessionInUrl(new URL(window.location.href),e):!!(e.access_token||e.error||e.error_description||e.error_code)}async _isPKCECallback(e){if(!e.code)return!1;const t=mo(e[Ei]);return t&&await Ct(this.storage,br(this.storageKey,t))?!0:!!await Ct(this.storage,`${this.storageKey}-code-verifier`)}async signOut(e={scope:"global"}){return await this.initializePromise,this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>await this._signOut(e)):await this._signOut(e)}async _signOut({scope:e}={scope:"global"}){return await this._useSession(async t=>{var i;const r=async()=>{await this._removeSession()},{data:s,error:o}=t;if(o&&!to(o))return this._returnResult({error:o});const a=(i=s.session)===null||i===void 0?void 0:i.access_token;if(a){const{error:l}=await this.admin.signOut(a,e);if(l&&!(nh(l)&&(l.status===404||l.status===401||l.status===403)||to(l)))return e!=="others"&&await r(),this._returnResult({error:l})}return e!=="others"&&await r(),this._returnResult({error:null})})}onAuthStateChange(e){const t=Px(),i={id:t,callback:e,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",t),this.stateChangeEmitters.delete(t)}};return this._debug("#onAuthStateChange()","registered callback with id",t),this.stateChangeEmitters.set(t,i),(async()=>(await this.initializePromise,this.lock!=null?await this._acquireLock(this.lockAcquireTimeout,async()=>{this._emitInitialSession(t)}):await this._emitInitialSession(t)))(),{data:{subscription:i}}}async _emitInitialSession(e){return await this._useSession(async t=>{var i,r;try{const{data:{session:s},error:o}=t;if(o)throw o;await((i=this.stateChangeEmitters.get(e))===null||i===void 0?void 0:i.callback("INITIAL_SESSION",s)),this._debug("INITIAL_SESSION","callback id",e,"session",s)}catch(s){if(await((r=this.stateChangeEmitters.get(e))===null||r===void 0?void 0:r.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",e,"error",s),sh(s))return;to(s)||ro(s)||nh(s)&&(s.code==="refresh_token_not_found"||s.code==="refresh_token_already_used"||s.code==="session_expired")?console.warn(s):console.error(s)}})}async resetPasswordForEmail(e,t={}){let i=null,r=null,s=null;this.flowType==="pkce"&&([i,r,s]=await this._getCodeChallengeAndMethod(!0));try{return await Ae(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:i,code_challenge_method:r,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t.redirectTo,s)})}catch(o){if(await on(this.storage,this.storageKey,s),ye(o))return this._returnResult({data:null,error:o});throw o}}async getUserIdentities(){var e;try{const{data:t,error:i}=await this.getUser();if(i)throw i;return this._returnResult({data:{identities:(e=t.user.identities)!==null&&e!==void 0?e:[]},error:null})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async linkIdentity(e){return"token"in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){var t;let i=null;try{const{data:r,error:s}=await this._useSession(async o=>{var a,l,c,u,h;const{data:d,error:f}=o;if(f)throw f;const{url:g,flowId:v}=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:(a=e.options)===null||a===void 0?void 0:a.redirectTo,scopes:(l=e.options)===null||l===void 0?void 0:l.scopes,queryParams:(c=e.options)===null||c===void 0?void 0:c.queryParams,skipBrowserRedirect:!0});return i=v,await Ae(this.fetch,"GET",g,{headers:this.headers,jwt:(h=(u=d.session)===null||u===void 0?void 0:u.access_token)!==null&&h!==void 0?h:void 0})});if(s)throw s;return Mt()&&!(!((t=e.options)===null||t===void 0)&&t.skipBrowserRedirect)&&window.location.assign(r?.url),this._returnResult({data:{provider:e.provider,url:r?.url,flowId:i},error:null})}catch(r){if(ye(r))return this._returnResult({data:{provider:e.provider,url:null,flowId:i},error:r});throw r}}async linkIdentityIdToken(e){return await this._useSession(async t=>{var i;try{const{error:r,data:{session:s}}=t;if(r)throw r;const{options:o,provider:a,token:l,access_token:c,nonce:u}=e,h=await Ae(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:(i=s?.access_token)!==null&&i!==void 0?i:void 0,body:{provider:a,id_token:l,access_token:c,nonce:u,link_identity:!0,gotrue_meta_security:{captcha_token:o?.captchaToken}},xform:Yt}),{data:d,error:f}=h;return f?this._returnResult({data:{user:null,session:null},error:f}):!d||!d.session||!d.user?this._returnResult({data:{user:null,session:null},error:new Zi}):(d.session&&(await this._saveSession(d.session),await this._notifyAllSubscribers("USER_UPDATED",d.session)),this._returnResult({data:d,error:f}))}catch(r){if(await on(this.storage,this.storageKey,null),ye(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}})}async unlinkIdentity(e){try{return await this._useSession(async t=>{var i,r;const{data:s,error:o}=t;if(o)throw o;return await Ae(this.fetch,"DELETE",`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:(r=(i=s.session)===null||i===void 0?void 0:i.access_token)!==null&&r!==void 0?r:void 0})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _refreshAccessToken(e){const t="#_refreshAccessToken()";this._debug(t,"begin");try{const i=Date.now();return await Dx(async r=>(r>0&&await Lx(200*Math.pow(2,r-1)),this._debug(t,"refreshing attempt",r),await Ae(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:Yt})),(r,s)=>{const o=200*Math.pow(2,r);return s&&ro(s)&&Date.now()+o-i<Bn})}catch(i){if(this._debug(t,"error",i),ye(i))return this._returnResult({data:{session:null,user:null},error:i});throw i}finally{this._debug(t,"end")}}_isValidSession(e){return typeof e=="object"&&e!==null&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}async _handleProviderSignIn(e,t){const{url:i,flowId:r}=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return this._debug("#_handleProviderSignIn()","provider",e,"options",t,"url",i),Mt()&&!t.skipBrowserRedirect&&window.location.assign(i),{data:{provider:e,url:i,flowId:r},error:null}}async _recoverAndRefresh(){var e,t;const i="#_recoverAndRefresh()";this._debug(i,"begin");try{const r=await Ct(this.storage,this.storageKey);if(r&&this.userStorage){let o=await Ct(this.userStorage,this.storageKey+"-user");!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!o&&(o={user:r.user},await zn(this.userStorage,this.storageKey+"-user",o)),r.user=(e=o?.user)!==null&&e!==void 0?e:La()}else if(r&&!r.user&&!r.user){const o=await Ct(this.storage,this.storageKey+"-user");o&&o?.user?(r.user=o.user,await zt(this.storage,this.storageKey+"-user"),await zn(this.storage,this.storageKey,r)):r.user=La()}if(this._debug(i,"session from storage",r),!this._isValidSession(r)){this._debug(i,"session is not valid"),r!==null&&await this._removeSession();return}const s=((t=r.expires_at)!==null&&t!==void 0?t:1/0)*1e3-Date.now()<Ia;if(this._debug(i,`session has${s?"":" not"} expired with margin of ${Ia}s`),s){if(this.autoRefreshToken&&r.refresh_token){const{error:o}=await this._callRefreshToken(r.refresh_token);o&&(sh(o)?this._debug(i,"refresh discarded by commit guard",o):this._debug(i,"refresh failed",o))}}else if(r.user&&r.user.__isUserNotAvailableProxy===!0)try{const{data:o,error:a}=await this._getUser(r.access_token);!a&&o?.user?(r.user=o.user,await this._saveSession(r),await this._notifyAllSubscribers("SIGNED_IN",r)):this._debug(i,"could not get user data, skipping SIGNED_IN notification")}catch(o){console.error("Error getting user data:",o),this._debug(i,"error getting user data, skipping SIGNED_IN notification",o)}else await this._notifyAllSubscribers("SIGNED_IN",r)}catch(r){this._debug(i,"error",r),ro(r)?console.warn(r):console.error(r);return}finally{this._debug(i,"end")}}async _callRefreshToken(e){var t,i;if(!e)throw new bt;if(this.refreshingDeferred)return this.refreshingDeferred.promise;if(this.lastRefreshFailure&&this.lastRefreshFailure.refreshToken===e&&Date.now()<this.lastRefreshFailure.expiresAt)return this._debug("#_callRefreshToken()","returning cached failure (cooldown active)"),this.lastRefreshFailure.result;const r="#_callRefreshToken()";this._debug(r,"begin");try{this.refreshingDeferred=new Vo,this.refreshingDeferred.promise.then(void 0,()=>{});const s=await Ct(this.storage,this.storageKey),{data:o,error:a}=await this._refreshAccessToken(e);if(a)throw a;if(!o.session)throw new bt;const l=await Ct(this.storage,this.storageKey);if(s!==null&&(l===null||l.refresh_token!==s.refresh_token)){this._debug(r,"commit guard: storage changed since refresh started, discarding rotated tokens",{startedWith:"present",nowHolds:l?"replaced":"cleared"});const d={data:null,error:new rh};return this.refreshingDeferred.resolve(d),d}const u=this._sessionRemovalEpoch;if(await this._saveSession(o.session),this._sessionRemovalEpoch!==u){this._debug(r,"commit guard (post-save): _removeSession ran during _saveSession, undoing write"),await zt(this.storage,this.storageKey),this.userStorage&&await zt(this.userStorage,this.storageKey+"-user");const d={data:null,error:new rh};return this.refreshingDeferred.resolve(d),d}await this._notifyAllSubscribers("TOKEN_REFRESHED",o.session);const h={data:o.session,error:null};return this.lastRefreshFailure=null,this.refreshingDeferred.resolve(h),h}catch(s){if(this._debug(r,"error",s),ye(s)){const o={data:null,error:s};if(!ro(s)){const a=await Ct(this.storage,this.storageKey);!!(a?.expires_at&&a.expires_at*1e3>Date.now())?this._debug(r,"proactive refresh failed, access token still valid — preserving session"):await this._removeSession()}return this.lastRefreshFailure={refreshToken:e,result:o,expiresAt:Date.now()+mx},(t=this.refreshingDeferred)===null||t===void 0||t.resolve(o),o}throw(i=this.refreshingDeferred)===null||i===void 0||i.reject(s),s}finally{this.refreshingDeferred=null,this._debug(r,"end")}}async _notifyAllSubscribers(e,t,i=!0){if(this._pendingInitNotifications!==null&&i){this._pendingInitNotifications.push({event:e,session:t,broadcast:i});return}const r=`#_notifyAllSubscribers(${e})`;this._debug(r,"begin",t,`broadcast = ${i}`);try{this.broadcastChannel&&i&&this.broadcastChannel.postMessage({event:e,session:t});const s=[],o=Array.from(this.stateChangeEmitters.values()).map(async a=>{try{await a.callback(e,t)}catch(l){s.push(l)}});if(await Promise.all(o),s.length>0){for(let a=0;a<s.length;a+=1)console.error(s[a]);throw s[0]}}finally{this._debug(r,"end")}}async _saveSession(e){this._debug("#_saveSession()",e),this.suppressGetSessionWarning=!0;const t=Object.assign({},e),i=t.user&&t.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!i&&t.user&&await zn(this.userStorage,this.storageKey+"-user",{user:t.user});const r=Object.assign({},t);delete r.user;const s=hh(r);await zn(this.storage,this.storageKey,s)}else{const r=hh(t);await zn(this.storage,this.storageKey,r)}}async _removeSession(){this._sessionRemovalEpoch+=1,this._debug("#_removeSession()"),this.lastRefreshFailure=null,this.suppressGetSessionWarning=!1,await zt(this.storage,this.storageKey),await Hx(this.storage,this.storageKey),await zt(this.storage,this.storageKey+"-user"),this.userStorage&&await zt(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&Mt()&&window?.removeEventListener&&window.removeEventListener("visibilitychange",e)}catch(t){console.error("removing visibilitychange callback failed",t)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const e=setInterval(()=>this._autoRefreshTokenTick(),Bn);this.autoRefreshTicker=e,e&&typeof e=="object"&&typeof e.unref=="function"?e.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(e);const t=setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0);this.autoRefreshTickTimeout=t,t&&typeof t=="object"&&typeof t.unref=="function"?t.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(t)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e);const t=this.autoRefreshTickTimeout;this.autoRefreshTickTimeout=null,t&&clearTimeout(t)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async dispose(){var e;this._removeVisibilityChangedCallback(),await this._stopAutoRefresh(),(e=this.broadcastChannel)===null||e===void 0||e.close(),this.broadcastChannel=null,this.stateChangeEmitters.clear()}async _autoRefreshTokenTick(){if(this._debug("#_autoRefreshTokenTick()","begin"),this.lock!=null){try{await this._acquireLock(0,async()=>{try{const e=Date.now();try{return await this._useSession(async t=>{const{data:{session:i}}=t;if(!i||!i.refresh_token||!i.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const r=Math.floor((i.expires_at*1e3-e)/Bn);this._debug("#_autoRefreshTokenTick()",`access token expires in ${r} ticks, a tick lasts ${Bn}ms, refresh threshold is ${Gr} ticks`),r<=Gr&&await this._callRefreshToken(i.refresh_token)})}catch(t){console.error("Auto refresh tick failed with error. This is likely a transient error.",t)}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(e){if(e instanceof nb)this._debug("auto refresh token tick lock not available");else throw e}return}if(this.refreshingDeferred!==null){this._debug("#_autoRefreshTokenTick()","refresh already in flight, skipping");return}try{const e=Date.now();try{await this._useSession(async t=>{const{data:{session:i}}=t;if(!i||!i.refresh_token||!i.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const r=Math.floor((i.expires_at*1e3-e)/Bn);this._debug("#_autoRefreshTokenTick()",`access token expires in ${r} ticks, a tick lasts ${Bn}ms, refresh threshold is ${Gr} ticks`),r<=Gr&&await this._callRefreshToken(i.refresh_token)})}catch(t){console.error("Auto refresh tick failed with error. This is likely a transient error.",t)}}finally{this._debug("#_autoRefreshTokenTick()","end")}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!Mt()||!window?.addEventListener)return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>{try{await this._onVisibilityChanged(!1)}catch(e){this._debug("#visibilityChangedCallback","error",e)}},window?.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error("_handleVisibilityChange",e)}}async _onVisibilityChanged(e){const t=`#_onVisibilityChanged(${e})`;if(this._debug(t,"visibilityState",document.visibilityState),document.visibilityState==="visible"){if(this.autoRefreshToken&&this._startAutoRefresh(),!e)if(await this.initializePromise,this.lock!=null)await this._acquireLock(this.lockAcquireTimeout,async()=>{if(document.visibilityState!=="visible"){this._debug(t,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");return}await this._recoverAndRefresh()});else{if(document.visibilityState!=="visible"){this._debug(t,"visibilityState is no longer visible, skipping recovery");return}await this._recoverAndRefresh()}}else document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,t,i){let r=i?.redirectTo,s=null,o=null,a=null;this.flowType==="pkce"&&([s,o,a]=await this._getCodeChallengeAndMethod(),r=this._maybeAppendFlowIdToRedirect(r,a));const l=[`provider=${encodeURIComponent(t)}`];if(r&&l.push(`redirect_to=${encodeURIComponent(r)}`),i?.scopes&&l.push(`scopes=${encodeURIComponent(i.scopes)}`),s!=null&&o!=null){const c=new URLSearchParams({code_challenge:`${encodeURIComponent(s)}`,code_challenge_method:`${encodeURIComponent(o)}`});l.push(c.toString())}if(i?.queryParams){const c=new URLSearchParams(i.queryParams);l.push(c.toString())}return i?.skipBrowserRedirect&&l.push(`skip_http_redirect=${i.skipBrowserRedirect}`),{url:`${e}?${l.join("&")}`,flowId:a}}_maybeAppendFlowIdToRedirect(e,t){return!e||!t||!this.experimental.appendPkceFlowIdToRedirects?e??void 0:Vx(e,t)}async _getCodeChallengeAndMethod(e=!1){return Gx(this.storage,this.storageKey,e,t=>this._debug("#_getCodeChallengeAndMethod()","evicted oldest pending PKCE verifier slot",t))}async _unenroll(e){try{return await this._useSession(async t=>{var i;const{data:r,error:s}=t;return s?this._returnResult({data:null,error:s}):await Ae(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:(i=r?.session)===null||i===void 0?void 0:i.access_token})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _enroll(e){try{return await this._useSession(async t=>{var i,r;const{data:s,error:o}=t;if(o)return this._returnResult({data:null,error:o});const a=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType==="phone"?{phone:e.phone}:e.factorType==="totp"?{issuer:e.issuer}:{}),{data:l,error:c}=await Ae(this.fetch,"POST",`${this.url}/factors`,{body:a,headers:this.headers,jwt:(i=s?.session)===null||i===void 0?void 0:i.access_token});return c?this._returnResult({data:null,error:c}):(e.factorType==="totp"&&l.type==="totp"&&(!((r=l?.totp)===null||r===void 0)&&r.qr_code)&&(l.totp.qr_code=`data:image/svg+xml;utf-8,${l.totp.qr_code}`),this._returnResult({data:l,error:null}))})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _verify(e){const t=async()=>{try{return await this._useSession(async i=>{var r;const{data:s,error:o}=i;if(o)return this._returnResult({data:null,error:o});const a=Object.assign({challenge_id:e.challengeId},"webauthn"in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type==="create"?yh(e.webauthn.credential_response):Sh(e.webauthn.credential_response)})}:{code:e.code}),{data:l,error:c}=await Ae(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:a,headers:this.headers,jwt:(r=s?.session)===null||r===void 0?void 0:r.access_token});return c?this._returnResult({data:null,error:c}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+l.expires_in},l)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",l),this._returnResult({data:l,error:c}))})}catch(i){if(ye(i))return this._returnResult({data:null,error:i});throw i}};return this.lock!=null?this._acquireLock(this.lockAcquireTimeout,t):t()}async _challenge(e){const t=async()=>{try{return await this._useSession(async i=>{var r;const{data:s,error:o}=i;if(o)return this._returnResult({data:null,error:o});const a=await Ae(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:(r=s?.session)===null||r===void 0?void 0:r.access_token});if(a.error)return a;const{data:l}=a;if(l.type!=="webauthn")return{data:l,error:null};switch(l.webauthn.type){case"create":return{data:Object.assign(Object.assign({},l),{webauthn:Object.assign(Object.assign({},l.webauthn),{credential_options:Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:_h(l.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},l),{webauthn:Object.assign(Object.assign({},l.webauthn),{credential_options:Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:vh(l.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(i){if(ye(i))return this._returnResult({data:null,error:i});throw i}};return this.lock!=null?this._acquireLock(this.lockAcquireTimeout,t):t()}async _challengeAndVerify(e){const{data:t,error:i}=await this._challenge({factorId:e.factorId});return i?this._returnResult({data:null,error:i}):await this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})}async _listFactors(){var e;const{data:{user:t},error:i}=await this.getUser();if(i)return{data:null,error:i};const r={all:[],phone:[],totp:[],webauthn:[],recovery_code:[]};for(const s of(e=t?.factors)!==null&&e!==void 0?e:[])r.all.push(s),s.status==="verified"&&s.factor_type in r&&Array.isArray(r[s.factor_type])&&r[s.factor_type].push(s);return{data:r,error:null}}async _getAuthenticatorAssuranceLevel(e){var t,i,r,s;if(e)try{const{payload:f}=so(e);let g=null;f.aal&&(g=f.aal);let v=g;const{data:{user:m},error:p}=await this.getUser(e);if(p)return this._returnResult({data:null,error:p});((i=(t=m?.factors)===null||t===void 0?void 0:t.filter(w=>w.status==="verified"))!==null&&i!==void 0?i:[]).length>0&&(v="aal2");const S=f.amr||[];return{data:{currentLevel:g,nextLevel:v,currentAuthenticationMethods:S},error:null}}catch(f){if(ye(f))return this._returnResult({data:null,error:f});throw f}const{data:{session:o},error:a}=await this.getSession();if(a)return this._returnResult({data:null,error:a});if(!o)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:l}=so(o.access_token);let c=null;l.aal&&(c=l.aal);let u=c;((s=(r=o.user.factors)===null||r===void 0?void 0:r.filter(f=>f.status==="verified"))!==null&&s!==void 0?s:[]).length>0&&(u="aal2");const d=l.amr||[];return{data:{currentLevel:c,nextLevel:u,currentAuthenticationMethods:d},error:null}}async _getRecoveryCodesStatus(){Nr(this.experimental);try{return await this._useSession(async e=>{var t;const{data:i,error:r}=e;if(r)return this._returnResult({data:null,error:r});const{data:s,error:o}=await Ae(this.fetch,"GET",`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:(t=i?.session)===null||t===void 0?void 0:t.access_token});return o?this._returnResult({data:null,error:o}):this._returnResult({data:s,error:null})})}catch(e){if(ye(e))return this._returnResult({data:null,error:e});throw e}}async _generateRecoveryCodes(e){Nr(this.experimental);try{return await this._useSession(async t=>{var i;const{data:r,error:s}=t;if(s)return this._returnResult({data:null,error:s});const{data:o,error:a}=await Ae(this.fetch,"POST",`${this.url}/factors/recovery-codes`,{body:e?.friendlyName?{friendly_name:e.friendlyName}:void 0,headers:this.headers,jwt:(i=r?.session)===null||i===void 0?void 0:i.access_token});return a?this._returnResult({data:null,error:a}):this._returnResult({data:o,error:null})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _verifyRecoveryCode(e){Nr(this.experimental);const t=async()=>{try{return await this._useSession(async i=>{var r;const{data:s,error:o}=i;if(o)return this._returnResult({data:null,error:o});const{data:a,error:l}=await Ae(this.fetch,"POST",`${this.url}/factors/recovery-codes/verify`,{body:{code:e.code},headers:this.headers,jwt:(r=s?.session)===null||r===void 0?void 0:r.access_token});if(l)return this._returnResult({data:null,error:l});const c=Object.assign({expires_at:Hd(a.expires_in)},a);return await this._saveSession(c),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",c),this._returnResult({data:a,error:null})})}catch(i){if(ye(i))return this._returnResult({data:null,error:i});throw i}};return this.lock!=null?this._acquireLock(this.lockAcquireTimeout,t):t()}async _regenerateRecoveryCodes(){Nr(this.experimental);try{return await this._useSession(async e=>{var t;const{data:i,error:r}=e;if(r)return this._returnResult({data:null,error:r});const{data:s,error:o}=await Ae(this.fetch,"POST",`${this.url}/factors/recovery-codes/regenerate`,{headers:this.headers,jwt:(t=i?.session)===null||t===void 0?void 0:t.access_token});return o?this._returnResult({data:null,error:o}):this._returnResult({data:s,error:null})})}catch(e){if(ye(e))return this._returnResult({data:null,error:e});throw e}}async _unenrollRecoveryCodes(){Nr(this.experimental);try{return await this._useSession(async e=>{var t;const{data:i,error:r}=e;if(r)return this._returnResult({data:null,error:r});const{data:s,error:o}=await Ae(this.fetch,"DELETE",`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:(t=i?.session)===null||t===void 0?void 0:t.access_token});return o?this._returnResult({data:null,error:o}):this._returnResult({data:s,error:null})})}catch(e){if(ye(e))return this._returnResult({data:null,error:e});throw e}}async _getAuthorizationDetails(e){try{return await this._useSession(async t=>{const{data:{session:i},error:r}=t;return r?this._returnResult({data:null,error:r}):i?await Ae(this.fetch,"GET",`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:i.access_token,xform:s=>({data:s,error:null})}):this._returnResult({data:null,error:new bt})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _approveAuthorization(e,t){try{return await this._useSession(async i=>{const{data:{session:r},error:s}=i;if(s)return this._returnResult({data:null,error:s});if(!r)return this._returnResult({data:null,error:new bt});const o=await Ae(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:"approve"},xform:a=>({data:a,error:null})});return o.data&&o.data.redirect_url&&Mt()&&!t?.skipBrowserRedirect&&window.location.assign(o.data.redirect_url),o})}catch(i){if(ye(i))return this._returnResult({data:null,error:i});throw i}}async _denyAuthorization(e,t){try{return await this._useSession(async i=>{const{data:{session:r},error:s}=i;if(s)return this._returnResult({data:null,error:s});if(!r)return this._returnResult({data:null,error:new bt});const o=await Ae(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:"deny"},xform:a=>({data:a,error:null})});return o.data&&o.data.redirect_url&&Mt()&&!t?.skipBrowserRedirect&&window.location.assign(o.data.redirect_url),o})}catch(i){if(ye(i))return this._returnResult({data:null,error:i});throw i}}async _listOAuthGrants(){try{return await this._useSession(async e=>{const{data:{session:t},error:i}=e;return i?this._returnResult({data:null,error:i}):t?await Ae(this.fetch,"GET",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:t.access_token,xform:r=>({data:r,error:null})}):this._returnResult({data:null,error:new bt})})}catch(e){if(ye(e))return this._returnResult({data:null,error:e});throw e}}async _revokeOAuthGrant(e){try{return await this._useSession(async t=>{const{data:{session:i},error:r}=t;return r?this._returnResult({data:null,error:r}):i?(await Ae(this.fetch,"DELETE",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:i.access_token,query:{client_id:e.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new bt})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async fetchJwk(e,t={keys:[]}){let i=t.keys.find(a=>a.kid===e);if(i)return i;const r=Date.now();if(i=this.jwks.keys.find(a=>a.kid===e),i&&this.jwks_cached_at+wx>r)return i;const{data:s,error:o}=await Ae(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(o)throw o;return!s.keys||s.keys.length===0||(this.jwks=s,this.jwks_cached_at=r,i=s.keys.find(a=>a.kid===e),!i)?null:i}async getClaims(e,t={}){try{let i=e;if(!i){const{data:f,error:g}=await this.getSession();if(g||!f.session)return this._returnResult({data:null,error:g});i=f.session.access_token}const{header:r,payload:s,signature:o,raw:{header:a,payload:l}}=so(i);if(!t?.allowExpired)try{$x(s.exp)}catch(f){throw new Mo(f instanceof Error?f.message:"JWT validation failed")}const c=!r.alg||r.alg.startsWith("HS")||!r.kid||!("crypto"in globalThis&&"subtle"in globalThis.crypto)?null:await this.fetchJwk(r.kid,t?.keys?{keys:t.keys}:t?.jwks);if(!c){const{error:f}=await this.getUser(i);if(f)throw f;return{data:{claims:s,header:r,signature:o},error:null}}const u=qx(r.alg),h=await crypto.subtle.importKey("jwk",c,u,!0,["verify"]);if(!await crypto.subtle.verify(u,h,o,Cx(`${a}.${l}`)))throw new Mo("Invalid JWT signature");return{data:{claims:s,header:r,signature:o},error:null}}catch(i){if(ye(i))return this._returnResult({data:null,error:i});throw i}}async signInWithPasskey(e){var t,i,r,s;try{if(!Ro())return this._returnResult({data:null,error:new un("Browser does not support WebAuthn",null)});const{data:o,error:a}=await this._startPasskeyAuthentication({options:{captchaToken:(t=e?.options)===null||t===void 0?void 0:t.captchaToken}});if(a||!o)return this._returnResult({data:null,error:a});const l=vh(o.options),c=(r=(i=e?.options)===null||i===void 0?void 0:i.signal)!==null&&r!==void 0?r:Wl.createNewAbortSignal(),{data:u,error:h}=await Xd({publicKey:l,signal:c,mediation:(s=e?.options)===null||s===void 0?void 0:s.mediation});if(h||!u)return this._returnResult({data:null,error:h??new un("WebAuthn ceremony failed",null)});const d=Sh(u);return this._verifyPasskeyAuthentication({challengeId:o.challenge_id,credential:d})}catch(o){if(ye(o))return this._returnResult({data:null,error:o});throw o}}async registerPasskey(e){var t,i;try{if(!Ro())return this._returnResult({data:null,error:new un("Browser does not support WebAuthn",null)});const{data:r,error:s}=await this._startPasskeyRegistration();if(s||!r)return this._returnResult({data:null,error:s});const o=_h(r.options),a=(i=(t=e?.options)===null||t===void 0?void 0:t.signal)!==null&&i!==void 0?i:Wl.createNewAbortSignal(),{data:l,error:c}=await qd({publicKey:o,signal:a});if(c||!l)return this._returnResult({data:null,error:c??new un("WebAuthn ceremony failed",null)});const u=yh(l);return this._verifyPasskeyRegistration({challengeId:r.challenge_id,credential:u})}catch(r){if(ye(r))return this._returnResult({data:null,error:r});throw r}}async _startPasskeyRegistration(){try{return await this._useSession(async e=>{const{data:{session:t},error:i}=e;if(i)return this._returnResult({data:null,error:i});if(!t)return this._returnResult({data:null,error:new bt});const{data:r,error:s}=await Ae(this.fetch,"POST",`${this.url}/passkeys/registration/options`,{headers:this.headers,jwt:t.access_token,body:{}});return s?this._returnResult({data:null,error:s}):this._returnResult({data:r,error:null})})}catch(e){if(ye(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyRegistration(e){try{return await this._useSession(async t=>{const{data:{session:i},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!i)return this._returnResult({data:null,error:new bt});const{data:s,error:o}=await Ae(this.fetch,"POST",`${this.url}/passkeys/registration/verify`,{headers:this.headers,jwt:i.access_token,body:{challenge_id:e.challengeId,credential:e.credential}});return o?this._returnResult({data:null,error:o}):this._returnResult({data:s,error:null})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _startPasskeyAuthentication(e){var t;try{const{data:i,error:r}=await Ae(this.fetch,"POST",`${this.url}/passkeys/authentication/options`,{headers:this.headers,body:{gotrue_meta_security:{captcha_token:(t=e?.options)===null||t===void 0?void 0:t.captchaToken}}});return r?this._returnResult({data:null,error:r}):this._returnResult({data:i,error:null})}catch(i){if(ye(i))return this._returnResult({data:null,error:i});throw i}}async _verifyPasskeyAuthentication(e){try{const{data:t,error:i}=await Ae(this.fetch,"POST",`${this.url}/passkeys/authentication/verify`,{headers:this.headers,body:{challenge_id:e.challengeId,credential:e.credential},xform:Yt});return i?this._returnResult({data:null,error:i}):(t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers("SIGNED_IN",t.session)),this._returnResult({data:t,error:null}))}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _listPasskeys(){try{return await this._useSession(async e=>{const{data:{session:t},error:i}=e;if(i)return this._returnResult({data:null,error:i});if(!t)return this._returnResult({data:null,error:new bt});const{data:r,error:s}=await Ae(this.fetch,"GET",`${this.url}/passkeys`,{headers:this.headers,jwt:t.access_token,xform:o=>({data:o,error:null})});return s?this._returnResult({data:null,error:s}):this._returnResult({data:r,error:null})})}catch(e){if(ye(e))return this._returnResult({data:null,error:e});throw e}}async _updatePasskey(e){try{return await this._useSession(async t=>{const{data:{session:i},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!i)return this._returnResult({data:null,error:new bt});const{data:s,error:o}=await Ae(this.fetch,"PATCH",`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:i.access_token,body:{friendly_name:e.friendlyName}});return o?this._returnResult({data:null,error:o}):this._returnResult({data:s,error:null})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}async _deletePasskey(e){try{return await this._useSession(async t=>{const{data:{session:i},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!i)return this._returnResult({data:null,error:new bt});const{error:s}=await Ae(this.fetch,"DELETE",`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:i.access_token,noResolveJson:!0});return s?this._returnResult({data:null,error:s}):this._returnResult({data:null,error:null})})}catch(t){if(ye(t))return this._returnResult({data:null,error:t});throw t}}}hs.nextInstanceID={};const gb=hs,_b="2.117.1";let jr="",Po;if(typeof Deno<"u"){var Oa;jr="deno",Po=(Oa=Deno.version)===null||Oa===void 0?void 0:Oa.deno}else if(typeof document<"u")jr="web";else if(typeof navigator<"u"&&navigator.product==="ReactNative")jr="react-native";else{var Ua;jr="node";const n=globalThis.process;Po=n==null||(Ua=n.version)===null||Ua===void 0?void 0:Ua.replace(/^v/,"")}const Kd=[`runtime=${jr}`];Po&&Kd.push(`runtime-version=${Po}`);const vb={"X-Client-Info":`supabase-js/${_b}; ${Kd.join("; ")}`},yb={headers:vb},Sb={schema:"public"},wb={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},xb={},bb={enabled:!1,respectSamplingDecision:!0};function Eb(n){if(!n||typeof n!="string")return null;const e=n.split("-");if(e.length!==4)return null;const[t,i,r,s]=e;if(t.length!==2||i.length!==32||r.length!==16||s.length!==2)return null;const o=/^[0-9a-f]+$/i;return!o.test(t)||!o.test(i)||!o.test(r)||!o.test(s)||i==="00000000000000000000000000000000"||r==="0000000000000000"?null:{version:t,traceId:i,parentId:r,traceFlags:s,isSampled:(parseInt(s,16)&1)===1}}function Mb(n,e){if(!n||!e||e.length===0)return!1;let t;if(n instanceof URL)t=n;else try{t=new URL(n)}catch{return!1}for(const i of e)try{if(typeof i=="string"){if(Tb(t.hostname,i))return!0}else if(i instanceof RegExp){if(i.test(t.hostname))return!0}else if(typeof i=="function"&&i(t))return!0}catch{continue}return!1}function Tb(n,e){if(e===n)return!0;if(e.startsWith("*.")){const t=e.slice(2);if(n.endsWith(t)&&(n===t||n.endsWith("."+t)))return!0}return!1}function Ab(n){const e=[];try{const t=new URL(n);e.push(t.hostname)}catch{}return e.push("*.supabase.co","*.supabase.in"),e.push("localhost","127.0.0.1","[::1]"),e}function ds(n){"@babel/helpers - typeof";return ds=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ds(n)}function Rb(n,e){if(ds(n)!="object"||!n)return n;var t=n[Symbol.toPrimitive];if(t!==void 0){var i=t.call(n,e);if(ds(i)!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(n)}function Cb(n){var e=Rb(n,"string");return ds(e)=="symbol"?e:e+""}function Pb(n,e,t){return(e=Cb(e))in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function xh(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);e&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(n,r).enumerable})),t.push.apply(t,i)}return t}function pt(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?xh(Object(t),!0).forEach(function(i){Pb(n,i,t[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):xh(Object(t)).forEach(function(i){Object.defineProperty(n,i,Object.getOwnPropertyDescriptor(t,i))})}return n}const Ib=n=>n?(...e)=>n(...e):(...e)=>fetch(...e),Lb=()=>Headers,Yd=n=>n.startsWith("sb_publishable_")||n.startsWith("sb_secret_"),Db="sb_temp_",bh=new Set,Ob=n=>{var e,t;if(!n.startsWith("sb_")||Yd(n)||n.startsWith(Db))return;const i=(e=(t=n.match(/^sb_[a-zA-Z0-9]+_/))===null||t===void 0?void 0:t[0])!==null&&e!==void 0?e:"unknown";bh.has(i)||(bh.add(i),console.warn("@supabase/supabase-js: Unrecognized Supabase API key format. The client will proceed and send this key as-is; if you see authentication errors you may need to upgrade @supabase/supabase-js to a version that recognizes this key type."))},Eh=(n,e,t,i,r,s)=>{const o=Ib(i),a=Lb(),l=r?.enabled===!0,c=r?.respectSamplingDecision!==!1,u=l?Ab(e):null,h=!(s?.omitApiKeyAsBearer&&Yd(n));return async(d,f)=>{const g=await t();let v=new a(f?.headers);if(v.has("apikey")||v.set("apikey",n),!v.has("Authorization")){const m=g??(h?n:null);m&&v.set("Authorization",`Bearer ${m}`)}if(u){const m=Ub(d,u,c);m&&(m.traceparent&&!v.has("traceparent")&&v.set("traceparent",m.traceparent),m.tracestate&&!v.has("tracestate")&&v.set("tracestate",m.tracestate),m.baggage&&!v.has("baggage")&&v.set("baggage",m.baggage))}return o(d,pt(pt({},f),{},{headers:v}))}};let Mh=!1,Th=!1;function Ub(n,e,t){const i=DS();if(!i)return Mh||(Mh=!0,console.warn("@supabase/supabase-js: tracePropagation is enabled but the tracing runtime is not loaded, so trace headers will not be attached. Add `import '@supabase/supabase-js/tracing'` at your application entry point (requires the OpenTelemetry API package to be installed). The CDN/UMD build does not support trace propagation.")),null;if(!Mb(typeof n=="string"||n instanceof URL?n:n.url,e))return null;const r=i();if(!r||!r.traceparent){var s;if(!(r==null||(s=r.carrierKeys)===null||s===void 0)&&s.length&&!Th){Th=!0;const o=r.carrierKeys.includes("sentry-trace")?" Sentry detected: set `propagateTraceparent: true` in Sentry.init() to emit it.":" Configure your tracing SDK to emit W3C trace context on outgoing requests.";console.warn(`@supabase/supabase-js: tracePropagation is enabled and a tracing SDK is active, but its propagator wrote [${r.carrierKeys.join(", ")}] and no W3C traceparent header, so trace headers will not be attached.`+o)}return null}if(t){const o=Eb(r.traceparent);if(o&&!o.isSampled)return{traceparent:r.traceparent}}return r}function Ah(n){return typeof n=="boolean"?{enabled:n}:n}function Nb(n){return n.endsWith("/")?n:n+"/"}let Rh=!1;function kb(n){Rh||typeof n!="object"||n===null||!("schema"in n)||n.schema===void 0||(Rh=!0,console.warn(`@supabase/supabase-js: The "schema" option must be nested under "db", e.g. createClient(url, key, { db: { schema: 'myschema' } }). A top-level "schema" is ignored and queries go to the default schema.`))}function Fb(n,e){var t,i,r,s,o,a;const{db:l,auth:c,realtime:u,global:h}=n,{db:d,auth:f,realtime:g,global:v}=e,m=Ah(n.tracePropagation),p=Ah(e.tracePropagation),M={db:pt(pt({},d),l),auth:pt(pt({},f),c),realtime:pt(pt({},g),u),storage:{},global:pt(pt(pt({},v),h),{},{headers:pt(pt({},(t=v?.headers)!==null&&t!==void 0?t:{}),(i=h?.headers)!==null&&i!==void 0?i:{})}),tracePropagation:{enabled:(r=(s=m?.enabled)!==null&&s!==void 0?s:p?.enabled)!==null&&r!==void 0?r:!1,respectSamplingDecision:(o=(a=m?.respectSamplingDecision)!==null&&a!==void 0?a:p?.respectSamplingDecision)!==null&&o!==void 0?o:!0},accessToken:async()=>""};return n.accessToken?M.accessToken=n.accessToken:delete M.accessToken,M}function Bb(n){const e=n?.trim();if(!e)throw new Error("supabaseUrl is required.");if(!e.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(Nb(e))}catch{throw Error("Invalid supabaseUrl: Provided URL is malformed.")}}var zb=class extends gb{constructor(n){super(n)}},Hb=class{constructor(n,e,t){var i,r;this.supabaseUrl=n,this.supabaseKey=e;const s=Bb(n);if(!e)throw new Error("supabaseKey is required.");Ob(e),kb(t),this.realtimeUrl=new URL("realtime/v1",s),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",s),this.storageUrl=new URL("storage/v1",s),this.functionsUrl=new URL("functions/v1",s);const o=`sb-${s.hostname.split(".")[0]}-auth-token`,a={db:Sb,realtime:xb,auth:pt(pt({},wb),{},{storageKey:o}),global:yb,tracePropagation:bb},l=Fb(t??{},a);if(this.settings=l,this.storageKey=(i=l.auth.storageKey)!==null&&i!==void 0?i:"",this.headers=(r=l.global.headers)!==null&&r!==void 0?r:{},l.accessToken)this.accessToken=l.accessToken,this.auth=new Proxy({},{get:(u,h)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(h)} is not possible`)}});else{var c;this.auth=this._initSupabaseAuthClient((c=l.auth)!==null&&c!==void 0?c:{},this.headers,l.global.fetch)}this.fetch=Eh(e,n,this._getSessionToken.bind(this),l.global.fetch,l.tracePropagation),this.functionsFetch=Eh(e,n,this._getSessionToken.bind(this),l.global.fetch,l.tracePropagation,{omitApiKeyAsBearer:!0}),this.realtime=this._initRealtimeClient(pt({headers:this.headers,accessToken:this._getAccessToken.bind(this),fetch:this.fetch},l.realtime)),this.accessToken&&Promise.resolve(this.accessToken()).then(u=>this.realtime.setAuth(u)).catch(u=>console.warn("Failed to set initial Realtime auth token:",u)),this.rest=new qS(new URL("rest/v1",s).href,{headers:this.headers,schema:l.db.schema,fetch:this.fetch,timeout:l.db.timeout,urlLengthLimit:l.db.urlLengthLimit,retry:l.db.retry}),this.storage=new px(this.storageUrl.href,this.headers,this.fetch,t?.storage),l.accessToken||this._listenForAuthEvents()}get functions(){return new kS(this.functionsUrl.href,{headers:this.headers,customFetch:this.functionsFetch})}from(n){return this.rest.from(n)}schema(n){return this.rest.schema(n)}getOpenApiSpec(){return this.rest.getOpenApiSpec()}rpc(n,e={},t={head:!1,get:!1,count:void 0}){return this.rest.rpc(n,e,t)}channel(n,e={config:{}}){return this.realtime.channel(n,e)}getChannels(){return this.realtime.getChannels()}removeChannel(n){return this.realtime.removeChannel(n)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getSessionToken(){var n=this,e,t;if(n.accessToken)return await n.accessToken();const{data:i}=await n.auth.getSession();return(e=(t=i.session)===null||t===void 0?void 0:t.access_token)!==null&&e!==void 0?e:null}async _getAccessToken(){var n=this,e;return(e=await n._getSessionToken())!==null&&e!==void 0?e:n.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:n,persistSession:e,detectSessionInUrl:t,storage:i,userStorage:r,storageKey:s,flowType:o,lock:a,debug:l,throwOnError:c,experimental:u,lockAcquireTimeout:h,skipAutoInitialize:d},f,g){const v={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new zb({url:this.authUrl.href,headers:pt(pt({},v),f),storageKey:s,autoRefreshToken:n,persistSession:e,detectSessionInUrl:t,storage:i,userStorage:r,flowType:o,lock:a,debug:l,throwOnError:c,experimental:u,fetch:g,lockAcquireTimeout:h,skipAutoInitialize:d,hasCustomAuthorizationHeader:Object.keys(this.headers).some(m=>m.toLowerCase()==="authorization")})}_initRealtimeClient(n){return new Fw(this.realtimeUrl.href,pt(pt({},n),{},{params:pt(pt({},{apikey:this.supabaseKey}),n?.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((n,e)=>{this._handleTokenChanged(n,"CLIENT",e?.access_token)})}_handleTokenChanged(n,e,t){(n==="TOKEN_REFRESHED"||n==="SIGNED_IN"||n==="INITIAL_SESSION")&&this.changedAccessToken!==t?(this.changedAccessToken=t,this.realtime.setAuth(t)):n==="SIGNED_OUT"&&(this.realtime.setAuth(),e=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}};const Vb=(n,e,t)=>new Hb(n,e,t);function Gb(){if(typeof window<"u"||globalThis.Deno!==void 0)return!1;const n=globalThis.process;if(!n)return!1;const e=n.version;if(e==null)return!1;const t=e.match(/^v(\d+)\./);return t?parseInt(t[1],10)<=20:!1}Gb()&&console.warn("⚠️  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715");const jb={BASE_URL:"./",DEV:!1,MODE:"production",PROD:!0,SSR:!1,VITE_SUPABASE_PUBLISHABLE_KEY:"sb_publishable_MyDRvrK-XmjDkReV1g8iZA_wpZWNLJQ",VITE_SUPABASE_URL:"https://qjfpbxucrxrtpygusnuv.supabase.co"},Jd="qjfpbxucrxrtpygusnuv",Wb=`https://${Jd}.supabase.co`;function $b(n=jb){const e=n.VITE_SUPABASE_URL?.trim(),t=n.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();if(!e)throw new Error("Missing VITE_SUPABASE_URL.");if(!t)throw new Error("Missing VITE_SUPABASE_PUBLISHABLE_KEY.");let i;try{i=new URL(e)}catch{throw new Error("VITE_SUPABASE_URL must be a valid URL.")}if(i.protocol!=="https:"||i.origin!==Wb)throw new Error(`VITE_SUPABASE_URL must target the Ivanov Remonti Supabase project (${Jd}).`);if(!t.startsWith("sb_publishable_"))throw new Error("VITE_SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key, never a secret/service key.");return{url:i.origin,publishableKey:t}}function qb(n=$b()){return Vb(n.url,n.publishableKey)}const Ch="id, title, owner_user_id, status, schema_version, work_version, work_state, created_at, updated_at",Xb="id, title, status, schema_version, work_version, updated_at";function Kb(n,e){const t=en(e,"Owner user id");return{async create(i){const r=en(i.title,"Project title"),s=en(i.project.projectId,"Project id"),o=Sc(i.project),{data:a,error:l}=await n.from("projects").insert({id:s,title:r,owner_user_id:t,status:"draft",schema_version:gr,work_version:1,work_state:o}).select(Ch).single();if(l||!a)throw ln("Unable to create project.",l);return Ph(a)},async list(){const{data:i,error:r}=await n.from("projects").select(Xb).order("updated_at",{ascending:!1});if(r)throw ln("Unable to list projects.",r);return(i??[]).map(Zd)},async save(i){const r=en(i.projectId,"Project id");if(i.project.projectId!==r)throw new Dt("INVALID_INPUT","Save project id does not match the project state id.");const s=Zb(i.expectedWorkVersion),o=s+1;if(!Number.isSafeInteger(o))throw new Dt("INVALID_INPUT","Next work version would exceed the safe integer range.");const a=Sc(i.project),{data:l,error:c}=await n.from("projects").update({schema_version:gr,work_version:o,work_state:a}).eq("id",r).eq("owner_user_id",t).eq("work_version",s).select("id, work_version, updated_at").maybeSingle();if(c)throw ln("Unable to save project.",c);if(l)return Yb(l,r,o);const{data:u,error:h}=await n.from("projects").select("id, work_version").eq("id",r).maybeSingle();if(h)throw ln("Unable to verify project version after save conflict.",h);if(!u)throw new Dt("NOT_FOUND","Project was not found.");const d=Io(u.work_version,"Current project work version");throw d!==s?new Dt("STALE_WRITE",`Project changed since it was opened. Expected version ${s}, current version ${d}.`):ln("Project save matched no row even though the expected version is still current.")},async open(i){const r=en(i,"Project id"),{data:s,error:o}=await n.from("projects").select(Ch).eq("id",r).maybeSingle();if(o)throw ln("Unable to open project.",o);if(!s)throw new Dt("NOT_FOUND","Project was not found.");return Ph(s)}}}function Yb(n,e,t){const i=en(n.id,"Saved project id"),r=Io(n.work_version,"Saved project work version"),s=en(n.updated_at,"Saved project updated timestamp");if(i!==e)throw ln("Saved project id does not match the requested project.");if(r!==t)throw ln(`Saved project version is invalid. Expected ${t}, received ${r}.`);return{projectId:i,workVersion:r,updatedAt:s}}function Ph(n){try{const e=gf(n.work_state);return Of({...Zd(n),ownerUserId:en(n.owner_user_id,"Project owner user id"),createdAt:en(n.created_at,"Project created timestamp"),project:e})}catch(e){throw e instanceof Dt?e:ln("Stored project state is invalid.",e)}}function Zd(n){return{id:en(n.id,"Project id"),title:en(n.title,"Project title"),status:Jb(n.status),schemaVersion:Io(n.schema_version,"Project schema version"),workVersion:Io(n.work_version,"Project work version"),updatedAt:en(n.updated_at,"Project updated timestamp")}}function Jb(n){if(n==="draft"||n==="active"||n==="archived")return n;throw ln(`Stored project status is invalid: ${String(n)}.`)}function Io(n,e){if(!Number.isSafeInteger(n)||n<1)throw ln(`${e} must be a positive safe integer.`);return n}function en(n,e){const t=n.trim();if(!t)throw new Dt("INVALID_INPUT",`${e} must not be blank.`);return t}function Zb(n){if(!Number.isSafeInteger(n)||n<1)throw new Dt("INVALID_INPUT","Expected work version must be a positive safe integer.");return n}function ln(n,e){return new Dt("STORAGE_FAILURE",n,e===void 0?void 0:{cause:e})}const Qb={"room-1.wall-front":"Предна стена","room-1.wall-back":"Задна стена","room-1.wall-left":"Лява стена","room-1.wall-right":"Дясна стена"},eE=["room-1.wall-front","room-1.wall-back","room-1.wall-left","room-1.wall-right"];function Qd(n,e){return e==="room-1.wall-front"||e==="room-1.wall-back"?n.widthM:n.lengthM}function dc(n,e){const t=new Set,i=1e-9;for(const r of e){if(!r.id.trim())return"Отворът трябва да има стабилен ID.";if(t.has(r.id))return`Повтарящ се ID на отвор: ${r.id}.`;if(t.add(r.id),!Number.isFinite(r.widthM)||r.widthM<=0)return"Ширината на отвора трябва да е положително число.";if(!Number.isFinite(r.heightM)||r.heightM<=0)return"Височината на отвора трябва да е положително число.";if(!Number.isFinite(r.offsetM)||r.offsetM<0)return"Позицията на отвора не може да е отрицателна.";const s=r.kind==="door"?0:r.sillM??0;if(!Number.isFinite(s)||s<0)return"Височината от пода не може да е отрицателна.";const o=Qd(n,r.hostSurfaceId);if(r.offsetM+r.widthM>o+i)return"Отворът излиза извън ширината на избраната стена.";if(s+r.heightM>n.heightM+i)return"Отворът излиза над височината на стаята."}for(let r=0;r<e.length;r+=1)for(let s=r+1;s<e.length;s+=1){const o=e[r],a=e[s];if(o.hostSurfaceId!==a.hostSurfaceId)continue;const l=o.kind==="door"?0:o.sillM??0,c=a.kind==="door"?0:a.sillM??0,u=o.offsetM<a.offsetM+a.widthM-i&&a.offsetM<o.offsetM+o.widthM-i,h=l<c+a.heightM-i&&c<l+o.heightM-i;if(u&&h)return"Два отвора не могат да се застъпват върху една и съща стена."}return null}function tE(n,e,t){const i=e==="door"?.9:1.2,r=e==="door"?2.1:1.1,s=e==="window"?.9:void 0;if(r+(s??0)>n.room.heightM)return{ok:!1,message:e==="door"?"Стаята е твърде ниска за стандартната начална врата.":"Стаята е твърде ниска за стандартния начален прозорец."};const o=e==="door"?eE:["room-1.wall-right","room-1.wall-left","room-1.wall-front","room-1.wall-back"];for(const a of o){const l=Qd(n.room,a);if(l<i)continue;const c=l-i,u=[Math.min(.55,c),Math.max(0,c/2),Math.max(0,c-.3)];for(const h of u){const d={id:t,kind:e,hostSurfaceId:a,widthM:i,heightM:r,offsetM:h,...s===void 0?{}:{sillM:s}},f=[...n.room.openings,d];if(!dc(n.room,f))return{ok:!0,openings:f}}}return{ok:!1,message:"Няма свободно валидно място за този отвор."}}function Ih(n,e,t){const i=n.room.openings.findIndex(l=>l.id===e);if(i<0)return{ok:!1,message:"Отворът вече не съществува."};const r=n.room.openings[i],s={...r,...t,...r.kind==="door"?{sillM:void 0}:{}},o=n.room.openings.map((l,c)=>c===i?s:l),a=dc(n.room,o);return a?{ok:!1,message:a}:{ok:!0,openings:o}}function nE(n,e){const t=n.room.openings.filter(i=>i.id!==e);return t.length===n.room.openings.length?{ok:!1,message:"Отворът вече не съществува."}:{ok:!0,openings:t}}function iE(n,e){return dc(e,n.room.openings)}const ef={assignmentId:"assignment-gypsum-putty-1",serviceCode:"gypsum-putty",label:"Гипсова шпакловка",quantityRuleId:"wall-net-area-openings-v1",priceBookItemId:"dev-gypsum-putty",presentationMode:"highlight",allowedTargetKind:"wall",defaultTargetEntityIds:[...Jt],clientInfo:{what:"Гипсова шпакловка е подготвителен шпакловъчен слой, обичайно в 1–2 ръце според основата и избраната технология.",why:"Използва се за подготовка на повърхността преди фината полимерна шпакловка, когато конкретната основа и технология го изискват.",result:"Подготвена основа за следващия фин слой. При съществено криви стени изравняването е работа на мазилката, не на гипсовата шпакловка.",includes:"Гипсова шпакловка върху избраните повърхности. Грунд, мазилка, армиране, фина шпакловка, шлайфане и боя са отделни операции, когато са необходими."}},rE={assignmentId:"assignment-sanding-1",serviceCode:"sanding",label:"Шлайфане",quantityRuleId:"wall-net-area-openings-v1",priceBookItemId:"dev-sanding",presentationMode:"highlight",allowedTargetKind:"wall",defaultTargetEntityIds:[...Jt],clientInfo:{what:"Шлайфането премахва дребни неравности и следи от инструменти по шпаклованата повърхност.",why:"Прави основата гладка преди грундиране и боядисване.",result:"Гладка и подготвена повърхност за следващия довършителен етап.",includes:"Шлайфане на избраните стени. Грундът и боята са отделни операции."}},sE={assignmentId:"assignment-primer-1",serviceCode:"primer",label:"Грунд",quantityRuleId:"wall-net-area-openings-v1",priceBookItemId:"dev-primer",presentationMode:"highlight",allowedTargetKind:"wall",defaultTargetEntityIds:[...Jt],clientInfo:{what:"Грундът подготвя основата преди боядисване и уеднаквява попиването на повърхността.",why:"Помага следващото покритие да се нанесе равномерно върху правилно подготвената основа.",result:"Грундирана повърхност, готова за боядисване според избраната система.",includes:"Грундиране на избраните стени. Шлайфането, локалните ремонти и боята са отделни операции."}},oE={assignmentId:"assignment-paint-1",serviceCode:"paint",label:"Боядисване",quantityRuleId:"wall-net-area-openings-v1",priceBookItemId:"dev-paint",presentationMode:"highlight",allowedTargetKind:"wall",defaultTargetEntityIds:[...Jt],clientInfo:{what:"Боядисване с латекс върху подготвена и грундирана основа, стандартно в два слоя.",why:"Завършва стената с избраното крайно покритие и цвят.",result:"Завършени боядисани стени с равномерно покритие.",includes:"Боядисване на избраните стени. Подготовката, шпакловката, шлайфането и грундът остават отделни операции, когато са необходими."}};function Lo(n,e){return n.serviceAssignments.find(t=>t.id===e.assignmentId)}function aE(n,e){return Lo(n,e)?n:{...n,serviceAssignments:[...n.serviceAssignments,{id:e.assignmentId,serviceCode:e.serviceCode,label:e.label,targetEntityIds:[...e.defaultTargetEntityIds],included:!0,quantityRuleId:e.quantityRuleId,priceBookItemId:e.priceBookItemId,presentationMode:e.presentationMode,clientInfo:{...e.clientInfo}}]}}function lE(n,e,t){let i=!1;const r=n.serviceAssignments.map(s=>{if(s.id!==e)return s;if(i=!0,t&&s.targetEntityIds.length===0)throw new Error("An included service requires at least one target.");return{...s,included:t}});if(!i)throw new Error(`Missing service assignment: ${e}`);return{...n,serviceAssignments:r}}function cE(n,e,t){if(e.allowedTargetKind==="wall"&&t.some(i=>!Do(i)))throw new Error("This operation supports wall targets only.");return uE(n,e,i=>{if(i.included&&t.length===0)throw new Error("Choose at least one wall or exclude the operation first.");return{...i,targetEntityIds:[...t]}})}function uE(n,e,t){if(!Lo(n,e))throw new Error(`Missing operation assignment: ${e.assignmentId}`);return{...n,serviceAssignments:n.serviceAssignments.map(r=>r.id===e.assignmentId?t(r):r)}}class Na extends Error{constructor(e,t,i){super(t,i),this.code=e,this.name="WorkAuthBoundaryError"}code}async function tf(n){const{data:e,error:t}=await n.auth.getSession();if(t)throw new Na("SESSION_READ_FAILED","Unable to read the current Supabase auth session.",{cause:t});if(!e.session)return{status:"signed-out"};const{data:i,error:r}=await n.auth.getUser();if(r||!i.user)throw new Na("IDENTITY_VERIFICATION_FAILED","Unable to verify the authenticated Supabase user.",{cause:r??void 0});const{data:s,error:o}=await n.from("work_users").select("user_id, display_name, role").eq("user_id",i.user.id).eq("active",!0).maybeSingle();if(o)throw new Na("WORK_USER_LOOKUP_FAILED","Unable to verify Work App authorization.",{cause:o});return s?{status:"authorized",workUser:{userId:s.user_id,displayName:s.display_name,role:s.role}}:{status:"unauthorized",userId:i.user.id}}class Wr extends Error{constructor(e,t,i){super(t,i),this.code=e,this.name="WorkSignInError"}code}async function hE(n,e){const t=e.email.trim(),i=e.password;if(!t)throw new Wr("EMAIL_REQUIRED","Email is required.");if(!i)throw new Wr("PASSWORD_REQUIRED","Password is required.");const{data:r,error:s}=await n.auth.signInWithPassword({email:t,password:i});if(s)throw new Wr("SIGN_IN_FAILED","Unable to sign in with the supplied email and password.",{cause:s});if(!r.session||!r.user)throw new Wr("SIGN_IN_INCOMPLETE","Supabase sign-in completed without an authenticated session.");return tf(n)}function dE({mount:n,client:e,access:t,onAuthorized:i}){n.innerHTML=`
    <main class="work-login-shell">
      <section class="work-login-card" aria-labelledby="workLoginTitle">
        <div class="work-login-brand">
          <span class="work-login-mark" aria-hidden="true">IR</span>
          <div>
            <strong>IVANOV REMONTI</strong>
            <span>Smart Offer · Work</span>
          </div>
        </div>

        <div class="work-login-heading">
          <p class="work-login-kicker">ЧАСТЕН ДОСТЪП</p>
          <h1 id="workLoginTitle">Вход в Work</h1>
          <p>Влезте с разрешения служебен акаунт.</p>
        </div>

        <form id="workLoginForm" class="work-login-form" novalidate>
          <label for="workLoginEmail">
            Имейл
            <input
              id="workLoginEmail"
              name="email"
              type="email"
              inputmode="email"
              autocomplete="username"
              autocapitalize="none"
              spellcheck="false"
              required
            />
          </label>

          <label for="workLoginPassword">
            Парола
            <input
              id="workLoginPassword"
              name="password"
              type="password"
              autocomplete="current-password"
              required
            />
          </label>

          <button id="workLoginSubmit" class="primary work-login-submit" type="submit">
            Вход
          </button>

          <p id="workLoginStatus" class="work-login-status" role="status" aria-live="polite"></p>
        </form>

        <p class="work-login-footnote">
          Достъпът е само за предварително разрешени Work акаунти.
        </p>
      </section>
    </main>
  `;const r=Fr(n,"workLoginForm"),s=Fr(n,"workLoginEmail"),o=Fr(n,"workLoginPassword"),a=Fr(n,"workLoginSubmit"),l=Fr(n,"workLoginStatus");t.status==="unauthorized"&&kr(l,"Този акаунт няма разрешение за Work.","error"),r.addEventListener("submit",async c=>{c.preventDefault(),a.disabled=!0,kr(l,"Проверка на достъпа…","progress");try{const u=await hE(e,{email:s.value,password:o.value});if(u.status==="authorized"){o.value="",i();return}if(u.status==="unauthorized"){o.value="",kr(l,"Този акаунт няма разрешение за Work.","error");return}kr(l,"Входът не беше завършен.","error")}catch(u){kr(l,pE(u),"error")}finally{a.disabled=!1}})}function fE(n,e){console.error("Work Auth bootstrap failed",e),n.innerHTML=`
    <main class="work-login-shell">
      <section class="work-login-card work-login-card--error" role="alert">
        <div class="work-login-brand">
          <span class="work-login-mark" aria-hidden="true">IR</span>
          <div>
            <strong>IVANOV REMONTI</strong>
            <span>Smart Offer · Work</span>
          </div>
        </div>
        <div class="work-login-heading">
          <p class="work-login-kicker">WORK НЕДОСТЪПЕН</p>
          <h1>Не може да се стартира входът</h1>
          <p>Проверете Work конфигурацията и опитайте отново.</p>
        </div>
      </section>
    </main>
  `}function pE(n){if(!(n instanceof Wr))return"Входът не успя. Опитайте отново.";switch(n.code){case"EMAIL_REQUIRED":return"Въведете имейл.";case"PASSWORD_REQUIRED":return"Въведете парола.";case"SIGN_IN_FAILED":return"Невалиден имейл или парола.";case"SIGN_IN_INCOMPLETE":return"Входът не беше завършен. Опитайте отново."}}function kr(n,e,t){n.textContent=e,n.dataset.state=t}function Fr(n,e){const t=n.querySelector(`#${e}`);if(!t)throw new Error(`Missing #${e}`);return t}function mE(n,e,t){const i=Pt(n,"projectBarTitle"),r=Pt(n,"projectBarStatus"),s=Pt(n,"projectsButton"),o=Pt(n,"undoProjectButton"),a=Pt(n,"redoProjectButton"),l=Pt(n,"saveProjectButton"),c=Pt(n,"reloadProjectButton");i.textContent=e.title,i.title=e.title;const u=gE(e);r.textContent=u.text,r.dataset.state=u.state,r.title=e.lastError??"";const h=e.saveState==="saving",d=e.saveState==="conflict";s.disabled=!t.persistenceEnabled||h,s.onclick=t.onProjects,o.disabled=!t.canUndo||h||d,o.onclick=t.onUndo,a.disabled=!t.canRedo||h||d,a.onclick=t.onRedo,l.hidden=d,l.disabled=!t.persistenceEnabled||!Uh(e)||h,l.textContent=h?"Запазване…":"Запази",l.onclick=t.onSave,c.hidden=!d,c.disabled=!t.persistenceEnabled||h,c.onclick=t.onReloadLatest}function gE(n){switch(n.saveState){case"clean":return{text:`Запазено · v${n.workVersion}`,state:"clean"};case"dirty":return{text:`Има промени · v${n.workVersion}`,state:"dirty"};case"saving":return{text:`Запазване… · v${n.workVersion}`,state:"saving"};case"error":return{text:`Грешка — не е записано · v${n.workVersion}`,state:"error"};case"conflict":return{text:n.lastError==="Reload latest project failed."?"Конфликт — зареждането не успя":"Конфликт — има по-нова версия",state:"conflict"}}}async function fc(n){const{mount:e,repository:t,currentSession:i,onProjectReady:r,beforeProjectChange:s,requireSelection:o=!1,startInCreate:a=!1}=n;e.querySelector("#projectsDialog")?.remove();const c=document.createElement("dialog");c.id="projectsDialog",c.className="projects-dialog",c.setAttribute("aria-labelledby","projectsDialogTitle"),e.append(c);let u=n.initialProjects,h=a;const d=()=>{c.close(),c.remove()},f=()=>{c.innerHTML=`
      <div class="projects-dialog-card">
        <div class="projects-dialog-head">
          <div>
            <p class="projects-dialog-kicker">WORK ПРОЕКТИ</p>
            <h2 id="projectsDialogTitle">Проекти</h2>
          </div>
          ${o?"":'<button id="projectsDialogClose" class="dialog-icon-button" type="button" aria-label="Затвори">×</button>'}
        </div>

        <p id="projectsDialogStatus" class="projects-dialog-status" role="status" aria-live="polite"></p>

        <div id="projectsList" class="projects-list"></div>

        <div class="projects-dialog-actions">
          <button id="newProjectButton" class="primary" type="button">Нов проект</button>
        </div>

        <form id="newProjectForm" class="new-project-form" ${h?"":"hidden"}>
          <label for="newProjectTitle">
            Име на проекта
            <input
              id="newProjectTitle"
              name="title"
              type="text"
              autocomplete="off"
              maxlength="100"
              required
            />
          </label>
          <div class="new-project-actions">
            <button id="cancelNewProjectButton" type="button">Откажи</button>
            <button id="createProjectButton" class="primary" type="submit">Създай</button>
          </div>
        </form>
      </div>
    `;const g=Pt(c,"projectsDialogStatus"),v=Pt(c,"projectsList"),m=Pt(c,"newProjectButton"),p=Pt(c,"newProjectForm"),M=Pt(c,"newProjectTitle"),S=Pt(c,"cancelNewProjectButton");c.querySelector("#projectsDialogClose")?.addEventListener("click",d),c.addEventListener("cancel",C=>{if(o){C.preventDefault();return}d()},{once:!0}),vE(v,u??[],i,async C=>{if(!(s&&!await s())){oo(c,!0),Br(g,"Отваряне на проекта…","progress");try{const T=await t.open(C);d(),r(go(T))}catch(T){oo(c,!1),Br(g,"Проектът не можа да се отвори. Опитайте отново.","error"),console.error("Open project failed",T)}}}),u?.length||(v.innerHTML='<p class="projects-empty">Все още няма създадени проекти.</p>'),m.addEventListener("click",()=>{h=!0,p.hidden=!1,m.hidden=!0,M.focus()}),S.addEventListener("click",()=>{if(o&&!u?.length){M.value="",M.focus();return}h=!1,p.hidden=!0,m.hidden=!1,M.value=""}),p.addEventListener("submit",async C=>{C.preventDefault();const T=M.value.trim();if(!T){Br(g,"Въведете име на проекта.","error"),M.focus();return}if(!(s&&!await s())){oo(c,!0),Br(g,"Създаване на проекта…","progress");try{const R=await t.create(Lf(T));d(),r(go(R))}catch(R){oo(c,!1),Br(g,"Проектът не можа да се създаде. Опитайте отново.","error"),console.error("Create project failed",R)}}}),h&&(m.hidden=!0,queueMicrotask(()=>M.focus()))};if(u||(c.innerHTML=`
      <div class="projects-dialog-card">
        <p class="projects-dialog-status" data-state="progress">Зареждане на проектите…</p>
      </div>
    `),c.open||c.showModal(),!u)try{u=await t.list()}catch(g){c.innerHTML=`
        <div class="projects-dialog-card">
          <div class="projects-dialog-head">
            <div>
              <p class="projects-dialog-kicker">WORK ПРОЕКТИ</p>
              <h2 id="projectsDialogTitle">Проекти</h2>
            </div>
            ${o?"":'<button id="projectsDialogClose" class="dialog-icon-button" type="button" aria-label="Затвори">×</button>'}
          </div>
          <p class="projects-dialog-status" data-state="error">Проектите не могат да се заредят.</p>
          <button id="projectsRetryButton" class="primary" type="button">Опитай отново</button>
        </div>
      `,c.querySelector("#projectsDialogClose")?.addEventListener("click",d),Pt(c,"projectsRetryButton").addEventListener("click",()=>{d(),fc({...n,initialProjects:void 0})}),console.error("List projects failed",g);return}f()}function Lh(n){n.querySelector("#discardChangesDialog")?.remove();const t=document.createElement("dialog");return t.id="discardChangesDialog",t.className="projects-dialog discard-dialog",t.setAttribute("aria-labelledby","discardChangesTitle"),t.innerHTML=`
    <div class="projects-dialog-card">
      <div class="projects-dialog-head">
        <div>
          <p class="projects-dialog-kicker">НЕЗАПИСАНИ ПРОМЕНИ</p>
          <h2 id="discardChangesTitle">Промените ще бъдат загубени</h2>
        </div>
      </div>
      <p class="discard-dialog-copy">
        Има промени, които още не са записани. Ако продължите,
        те няма да бъдат запазени.
      </p>
      <div class="discard-dialog-actions">
        <button id="discardCancelButton" type="button">Откажи</button>
        <button id="discardContinueButton" class="primary" type="button">
          Продължи без запис
        </button>
      </div>
    </div>
  `,n.append(t),new Promise(i=>{let r=!1;const s=o=>{r||(r=!0,t.close(),t.remove(),i(o))};Pt(t,"discardCancelButton").addEventListener("click",()=>s(!1)),Pt(t,"discardContinueButton").addEventListener("click",()=>s(!0)),t.addEventListener("cancel",o=>{o.preventDefault(),s(!1)}),t.showModal()})}function $l(n,e="Зареждане на Work проект…"){n.innerHTML=`
    <div class="project-gate-shell">
      <header class="topbar">
        <div class="brand">
          <strong>IVANOV REMONTI · SMART OFFER</strong>
          <span>Work · Project access</span>
        </div>
      </header>
      <div class="project-bar">
        <div class="project-bar-current">
          <span class="project-bar-label">Текущ проект</span>
          <strong>Няма избран проект</strong>
          <span class="project-bar-status">—</span>
        </div>
      </div>
      <main class="project-gate-main">
        <p>${SE(e)}</p>
      </main>
    </div>
  `}function _E(n,e){$l(n,"Проектите не могат да се заредят. Проверете връзката и опитайте отново.");const t=n.querySelector(".project-gate-main");if(!t)throw new Error("Missing project gate main");const i=document.createElement("button");i.type="button",i.className="primary",i.textContent="Опитай отново",i.addEventListener("click",e),t.append(i)}function vE(n,e,t,i){n.replaceChildren();for(const r of e){const s=document.createElement("div");s.className="project-list-row",r.id===t?.projectId&&(s.dataset.current="true");const o=document.createElement("div");o.className="project-list-meta";const a=document.createElement("strong");a.textContent=r.title;const l=document.createElement("span");l.textContent=`v${r.workVersion} · ${yE(r.updatedAt)}`,o.append(a,l);const c=document.createElement("button");c.type="button",c.textContent=r.id===t?.projectId?"Текущ":"Отвори",c.disabled=r.id===t?.projectId,c.addEventListener("click",()=>i(r.id)),s.append(o,c),n.append(s)}}function oo(n,e){n.querySelectorAll("button, input").forEach(t=>{t.disabled=e}),n.setAttribute("aria-busy",String(e))}function Br(n,e,t){n.textContent=e,n.dataset.state=t}function yE(n){const e=new Date(n);return Number.isNaN(e.getTime())?"неизвестна дата":new Intl.DateTimeFormat("bg-BG",{dateStyle:"short",timeStyle:"short"}).format(e)}function SE(n){return n.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function Pt(n,e){const t=n.querySelector(`#${e}`);if(!t)throw new Error(`Missing #${e}`);return t}const nf=new URLSearchParams(window.location.search).get("preview")==="1",ka=[ef,rE,sE,oE];let Fa=null;rf();async function rf(){if(nf){fs({appEntry:"direct-client",project:pf(),session:null,repository:null});return}const n=document.querySelector("#app");if(!n)throw new Error("Missing #app");try{const e=qb(),t=await tf(e);if(t.status==="authorized"){await sf(n,e,t.workUser.userId);return}dE({mount:n,client:e,access:t,onAuthorized:()=>{rf()}})}catch(e){fE(n,e)}}async function sf(n,e,t){const i=Kb(e,t);$l(n);try{const r=await Uf(i);if(r.kind==="ready"){fs({appEntry:"work",project:r.session.project,session:r.session,repository:i});return}$l(n,r.kind==="new-project"?"Създайте първия Work проект.":"Изберете Work проект."),await fc({mount:n,repository:i,currentSession:null,initialProjects:r.kind==="choose-project"?r.projects:[],startInCreate:r.kind==="new-project",requireSelection:!0,onProjectReady:s=>{fs({appEntry:"work",project:s.project,session:s,repository:i})}})}catch(r){console.error("Work project bootstrap failed",r),_E(n,()=>{sf(n,e,t)})}}function fs(n){Fa?.dispose(),Fa=null;let e=Gf(n.project),t=Rn(e);const i=n.appEntry;let r=n.session?{...n.session,project:t}:null;const s=n.repository;let o=i==="direct-client";const a=t.serviceAssignments.find(B=>B.included);let l=a?Ki(a.id):Ca(),c=null,u=!0;const h=document.querySelector("#app");if(!h)throw new Error("Missing #app");const d=h;d.innerHTML=`
  <div class="app-shell${i==="work"&&r?" has-project-bar":""}" id="shell">
    <header class="topbar">
      <div class="brand">
        <strong>IVANOV REMONTI · SMART OFFER</strong>
        <span id="brandSubtitle">Vertical Slice v1 · Work / Client Preview</span>
      </div>
      <div class="mode-switch work-only">
        <button id="workModeBtn" class="active">Work Mode</button>
        <button id="previewModeBtn">Preview as Client</button>
      </div>
      <button id="exitPreviewBtn" class="preview-exit">Назад към Work</button>
    </header>

    ${i==="work"&&r?`
    <div class="project-bar work-only" id="projectBar">
      <div class="project-bar-current">
        <span class="project-bar-label">Текущ проект</span>
        <strong id="projectBarTitle"></strong>
        <span id="projectBarStatus" class="project-bar-status" aria-live="polite"></span>
      </div>
      <div class="project-bar-actions">
        <button id="projectsButton" type="button">Проекти</button>
        <button id="undoProjectButton" type="button" title="Отмени последната промяна">Отмени</button>
        <button id="redoProjectButton" type="button" title="Повтори отменената промяна">Повтори</button>
        <button id="saveProjectButton" type="button">Запази</button>
        <button id="reloadProjectButton" type="button" hidden>Зареди последната версия</button>
      </div>
    </div>
        `:""}

    <main class="workspace">
      <aside class="panel left">
        <h2>Работен проект</h2>

        <section class="section">
          <div class="section-title">Размери на стаята</div>
          <div class="dims">
            <label>Ширина, m<input id="widthInput" type="number" min="1" step="0.1"></label>
            <label>Дължина, m<input id="lengthInput" type="number" min="1" step="0.1"></label>
            <label>Височина, m<input id="heightInput" type="number" min="1" step="0.1"></label>
          </div>
        </section>

        <section class="section work-only openings-section">
          <div class="section-title">Отвори</div>
          <div id="openingsEditor"></div>
          <div class="opening-add-actions">
            <button id="addDoorButton" type="button">Добави врата</button>
            <button id="addWindowButton" type="button">Добави прозорец</button>
          </div>
          <p id="openingsStatus" class="opening-status" role="status" aria-live="polite"></p>
        </section>

        <section class="section">
          <div class="section-title">M² схема · същата геометрия</div>
          <div id="m2Schema"></div>
        </section>

        <section class="section work-only">
          <div class="section-title">Услуги за изпълнение</div>
          <div id="serviceScopeControls" class="service-scope-list"></div>
          <p class="service-scope-help">Само избраните услуги влизат в офертата и участват в общата сума.</p>
        </section>

        <section class="section work-only" id="finePuttyTargetsSection">
          <div class="section-title">Фина шпакловка · стени</div>
          <div id="wallTargets"></div>
        </section>

        <section class="section work-only" id="operationSettingsSection">
          <div class="section-title">Настройки на услуга</div>
          <div id="operationAuthoring"></div>
          <p id="operationStatus" class="opening-status" role="status" aria-live="polite"></p>
        </section>

      </aside>

      <section class="viewer-wrap">
        <div id="viewer" class="viewer"></div>

        <div class="viewer-toolbar">
          <button id="resetCameraBtn">Начален изглед</button>
          <button id="autoCutawayBtn" class="active">Авто скриване</button>
          <button id="showAllBtn">Покажи всички</button>
          <button data-wall="room-1.wall-left">Лява</button>
          <button data-wall="room-1.wall-right">Дясна</button>
          <button data-wall="room-1.wall-front">Предна</button>
          <button data-wall="room-1.wall-back">Задна</button>
          <button data-wall="room-1.ceiling">Таван</button>
        </div>

        <div class="viewer-note">
          <span class="viewer-help">Влачи: завъртане · колелце: мащаб · клик: избери повърхност</span>
          <div id="selectionChip"></div>
        </div>
      </section>

      <aside class="panel right">
        <h2>Smart Offer</h2>

        <div id="offerRows"></div>

        <section class="offer-summary" id="offerSummarySection">
          <div class="offer-summary-row">
            <span>Общо</span>
            <strong id="offerTotalKpi">—</strong>
          </div>
          <p id="offerTotalStatus"></p>
        </section>

        <section class="section" id="offerDetailsSection">
          <div class="section-title">Оферта</div>
          <div class="kpi"><span>Количество</span><strong id="quantityKpi">—</strong></div>
          <div class="kpi price-kpi">
            <span id="unitPriceLabel">Ед. цена</span>
            <label class="price-input-wrap work-only" id="unitPriceWorkControl">
              <input
                id="unitPriceInput"
                type="text"
                inputmode="decimal"
                placeholder="Въведи цена"
                aria-label="Единична цена в евро"
              />
              <span id="unitPriceSuffix">€/m²</span>
            </label>
            <strong id="unitPriceKpi" class="client-price-value">—</strong>
          </div>
          <div class="kpi"><span id="totalLabel">Сума</span><strong id="totalKpi">—</strong></div>
        </section>

        <div class="info-card" id="offerInfoCard">
          <h3><span class="info-glyph" aria-hidden="true">i</span> <span id="infoTitle"></span></h3>
          <b>Какво е</b><p id="infoWhat"></p>
          <b>Защо се прави</b><p id="infoWhy"></p>
          <b>Какво получавате</b><p id="infoResult"></p>
          <b>Какво включва тази позиция</b><p id="infoIncludes"></p>
        </div>

        <button id="showResultBtn" style="width:100%;margin-top:12px">Виж целия резултат</button>
      </aside>
    </main>
  </div>
`;const f=oe("viewer"),g=new TS({container:f,onEntitySelect:B=>{l=CS(t,B),ne(),Se()}});Fa=g,i==="work"&&r&&S();const v=oe("widthInput"),m=oe("lengthInput"),p=oe("heightInput");v.value=String(t.room.widthM),m.value=String(t.room.lengthM),p.value=String(t.room.heightM);for(const B of[v,m,p])B.addEventListener("change",te);W(),ze(),Xe(),Ye(),Nu(oe("m2Schema"),t),g.setProject(t),ne(),Se(),M(),$(o);function M(){oe("addDoorButton").addEventListener("click",()=>{_e("door")}),oe("addWindowButton").addEventListener("click",()=>{_e("window")}),oe("workModeBtn").addEventListener("click",()=>$(!1)),oe("previewModeBtn").addEventListener("click",()=>$(!0)),oe("exitPreviewBtn").addEventListener("click",()=>$(!1)),oe("resetCameraBtn").addEventListener("click",()=>g.resetCamera()),oe("autoCutawayBtn").addEventListener("click",()=>{u=!u,g.setAutoCutaway(u),oe("autoCutawayBtn").classList.toggle("active",u)}),oe("showAllBtn").addEventListener("click",()=>{g.showAll(),u=!1,oe("autoCutawayBtn").classList.remove("active"),document.querySelectorAll("[data-wall]").forEach(y=>y.classList.remove("active"))}),document.querySelectorAll("[data-wall]").forEach(y=>{y.addEventListener("click",()=>{const _=y.dataset.wall,L=!y.classList.contains("active");g.setManualVisibility(_,!L),y.classList.toggle("active",L)})});const B=oe("unitPriceInput");B.addEventListener("input",()=>{qe(B.value)}),B.addEventListener("change",()=>{tt(B)}),oe("offerRows").addEventListener("click",y=>{const _=y.target,O=(_ instanceof Element?_.closest("button[data-service-id]"):null)?.dataset.serviceId;O&&(l=Ki(O),ne(),Se())}),oe("showResultBtn").addEventListener("click",()=>{l=Ca(),ne(),Se()})}function S(){i!=="work"||!r||mE(d,r,{persistenceEnabled:s!==null,canUndo:$f(e),canRedo:qf(e),onProjects:()=>{w()},onUndo:R,onRedo:N,onSave:()=>{I()},onReloadLatest:()=>{V()}})}async function w(){!s||!r||await fc({mount:d,repository:s,currentSession:r,requireSelection:!1,beforeProjectChange:C,onProjectReady:B=>{fs({appEntry:"work",project:B.project,session:B,repository:s})}})}async function C(){return!r||!kf(r)?!0:Lh(d)}function T(B){e=Xf(e,B),t=Rn(e),i==="work"&&r&&(r=wc(r,t,xc(e))),b()}function R(){E("undo")}function N(){E("redo")}function E(B){if(!q().canAuthorProject||!r||r.saveState==="saving"||r.saveState==="conflict")return;const y=B==="undo"?Kf(e):Yf(e);y!==e&&(e=y,t=Rn(e),r=wc(r,t,xc(e)),Te("","idle"),b())}function b(){v.value=String(t.room.widthM),m.value=String(t.room.lengthM),p.value=String(t.room.heightM),W(),ze(),Xe(),Ye(),Nu(oe("m2Schema"),t),g.setProject(t),ne(),Se(),S()}async function I(){if(!s||!r)return;let B=!1,y=null;try{y=jf(e);const _=Ff(r);r=_.session,B=!0,S();const L=await s.save(_.input);r=Bf(r,L),e=Wf(e,y)}catch(_){B&&r&&r.saveState==="saving"?r=zf(r,_):console.error("Project save could not start",_)}S()}async function V(){if(!(!s||!r||!await Lh(d)))try{const y=await s.open(r.projectId),_=go(y);fs({appEntry:"work",project:_.project,session:_,repository:s})}catch(y){console.error("Reload latest project failed",y),r={...r,lastError:"Reload latest project failed."},S()}}function $(B){!B&&!q().canReturnToWork||(o=B,oe("shell").classList.toggle("preview-mode",o),oe("shell").classList.toggle("direct-client-entry",nf),oe("workModeBtn").classList.toggle("active",!o),oe("previewModeBtn").classList.toggle("active",o),oe("brandSubtitle").textContent=o?"Интерактивна оферта":"Vertical Slice v1 · Work / Client Preview",Se(),requestAnimationFrame(()=>window.dispatchEvent(new Event("resize"))))}function te(){if(!q().canAuthorProject){v.value=String(t.room.widthM),m.value=String(t.room.lengthM),p.value=String(t.room.heightM);return}const B=J(v.value,t.room.widthM),y=J(m.value,t.room.lengthM),_=J(p.value,t.room.heightM),L=B!==t.room.widthM||y!==t.room.lengthM||_!==t.room.heightM,O=iE(t,{widthM:B,lengthM:y,heightM:_});if(O){Te(O,"error"),v.value=String(t.room.widthM),m.value=String(t.room.lengthM),p.value=String(t.room.heightM);return}if(!L){v.value=String(t.room.widthM),m.value=String(t.room.lengthM),p.value=String(t.room.heightM);return}const j=Rn(e);j.room.widthM=B,j.room.lengthM=y,j.room.heightM=_,Te("","idle"),T(j)}function W(){const B=oe("openingsEditor");if(B.replaceChildren(),!t.room.openings.length){const y=document.createElement("p");y.className="opening-empty",y.textContent="Няма добавени врати или прозорци.",B.append(y);return}t.room.openings.forEach(y=>{const _=document.createElement("div");_.className="opening-card",_.dataset.openingId=y.id;const L=document.createElement("div");L.className="opening-card-head";const O=document.createElement("strong");O.textContent=y.kind==="door"?`Врата ${K(y,"door")}`:`Прозорец ${K(y,"window")}`;const j=document.createElement("button");j.type="button",j.className="opening-remove",j.textContent="Премахни",j.addEventListener("click",()=>{q().canAuthorProject&&we(nE(t,y.id))}),L.append(O,j),_.append(L);const F=document.createElement("div");F.className="opening-fields";const ce=document.createElement("select");ce.dataset.openingId=y.id,ce.dataset.openingField="hostSurfaceId";for(const re of Jt){const he=document.createElement("option");he.value=re,he.textContent=Qb[re],he.selected=re===y.hostSurfaceId,ce.append(he)}ce.addEventListener("change",()=>{if(!q().canAuthorProject){W();return}we(Ih(t,y.id,{hostSurfaceId:ce.value}))}),F.append(ee("Стена",ce)),F.append(G(y,"widthM","Ширина, m",y.widthM),G(y,"heightM","Височина, m",y.heightM),G(y,"offsetM","Позиция, m",y.offsetM)),y.kind==="window"&&F.append(G(y,"sillM","От пода, m",y.sillM??0)),_.append(F),B.append(_)})}function K(B,y){return t.room.openings.filter(_=>_.kind===y).findIndex(_=>_.id===B.id)+1}function ee(B,y){const _=document.createElement("label"),L=document.createElement("span");return L.textContent=B,_.append(L,y),_}function G(B,y,_,L){const O=document.createElement("input");return O.type="number",O.min="0",O.step="0.05",O.value=String(L),O.dataset.openingId=B.id,O.dataset.openingField=y,O.addEventListener("change",()=>{if(!q().canAuthorProject){W();return}const j=Number.parseFloat(O.value);we(Ih(t,B.id,{[y]:j}))}),ee(_,O)}function _e(B){if(!q().canAuthorProject)return;const y=`room-1.${B}-${crypto.randomUUID()}`;we(tE(t,B,y))}function we(B){if(!B.ok){Te(B.message,"error"),W();return}const y=Rn(e);y.room.openings=B.openings,Te("","idle"),T(y)}function Te(B,y){const _=oe("openingsStatus");_.textContent=B,_.dataset.state=y}function ze(){const B=oe("serviceScopeControls");B.replaceChildren();const y=[{assignmentId:Js,label:"Фина шпакловка"},{assignmentId:"assignment-laminate-flooring-1",label:"Ламинат"},...ka.map(_=>({assignmentId:_.assignmentId,label:_.label}))];for(const _ of y){const O=t.serviceAssignments.find(he=>he.id===_.assignmentId)?.included??!1,j=ka.find(he=>he.assignmentId===_.assignmentId),F=document.createElement("label");F.className="service-scope-toggle",F.classList.toggle("selected",O),F.dataset.serviceScopeId=_.assignmentId;const ce=document.createElement("input");ce.type="checkbox",ce.checked=O,ce.dataset.serviceInclude=_.assignmentId,ce.setAttribute("aria-label",`Включи ${_.label} в офертата`);const re=document.createElement("span");re.textContent=_.label,ce.addEventListener("change",()=>{if(!q().canAuthorProject){ze();return}let he=Rn(e);const be=he.serviceAssignments.find(X=>X.id===_.assignmentId);try{if(!be&&ce.checked&&j)he=aE(he,j);else if(be)he=lE(he,_.assignmentId,ce.checked);else{ze();return}ce.checked?(l=Ki(_.assignmentId),j&&(c=j.assignmentId)):(l.selectedServiceId===_.assignmentId&&(l=Ca()),c===_.assignmentId&&(c=null)),$e(""),T(he)}catch(X){$e(Y(X),"error"),ze()}}),F.append(ce,re),B.append(F)}}function Xe(){const B=oe("wallTargets");B.replaceChildren();const y=er(t);if(oe("finePuttyTargetsSection").hidden=!y.included,!y.included)return;const _={"room-1.wall-front":"Предна стена","room-1.wall-back":"Задна стена","room-1.wall-left":"Лява стена","room-1.wall-right":"Дясна стена"};Jt.forEach(L=>{const O=document.createElement("label");O.className="check-row";const j=document.createElement("input");j.type="checkbox",j.checked=er(t).targetEntityIds.includes(L),j.addEventListener("change",()=>{if(!q().canAuthorProject){j.checked=er(t).targetEntityIds.includes(L);return}const ce=er(t).targetEntityIds,re=new Set(ce);j.checked?re.add(L):re.delete(L);const he=Jt.filter(X=>re.has(X)),be=he.length!==ce.length||he.some((X,pe)=>X!==ce[pe]);if(l=Ki(Js),be){const X=Rn(e);er(X).targetEntityIds=he,T(X);return}ne(),Se()});const F=document.createElement("span");F.textContent=_[L],O.append(j,F),B.append(O)})}function Ye(){const B=oe("operationAuthoring");B.replaceChildren();const y=ka.map(O=>({definition:O,assignment:Lo(t,O)})).filter(O=>O.assignment?.included),_=oe("operationSettingsSection");if(y.length===0){c=null,_.hidden=!0;return}c&&!y.some(O=>O.definition.assignmentId===c)&&(c=null),_.hidden=!1;const L={"room-1.wall-front":"Предна стена","room-1.wall-back":"Задна стена","room-1.wall-left":"Лява стена","room-1.wall-right":"Дясна стена"};for(const{definition:O,assignment:j}of y){if(!j)continue;const F=document.createElement("div");F.className="operation-card";const ce=document.createElement("button");ce.type="button",ce.className="operation-summary",ce.dataset.operationSummary=O.assignmentId,O.assignmentId===ef.assignmentId?ce.id="gypsumPuttySummaryButton":ce.id=`operationSummary-${O.serviceCode}`;const re=c===O.assignmentId;ce.setAttribute("aria-expanded",String(re));const he=document.createElement("span");he.className="operation-summary-text";const be=document.createElement("strong");be.textContent=j.label;const X=document.createElement("span");X.className="operation-summary-meta";const pe=j.targetEntityIds.filter(se=>Jt.includes(se)).length;X.textContent=`${pe} ${pe===1?"стена":"стени"}`,he.append(be,X);const Oe=document.createElement("span");if(Oe.className="operation-chevron",Oe.setAttribute("aria-hidden","true"),Oe.textContent=re?"▴":"▾",ce.append(he,Oe),ce.addEventListener("click",()=>{c=re?null:O.assignmentId,l=Ki(O.assignmentId),Ye(),ne(),Se()}),F.append(ce),!re){B.append(F);continue}const Re=document.createElement("div");Re.className="operation-editor";const ve=document.createElement("div");ve.className="operation-target-title",ve.textContent="Избери стени",Re.append(ve);for(const se of Jt){const ge=document.createElement("label");ge.className="check-row";const Me=document.createElement("input");Me.type="checkbox",Me.dataset.operationTarget=se,Me.dataset.operationId=O.assignmentId,Me.checked=j.targetEntityIds.includes(se),Me.addEventListener("change",()=>{if(!q().canAuthorProject){Ye();return}const Q=Lo(t,O);if(!Q)return;const Pe=new Set(Q.targetEntityIds);Me.checked?Pe.add(se):Pe.delete(se);try{const He=cE(Rn(e),O,Jt.filter(nt=>Pe.has(nt)));l=Ki(O.assignmentId),$e(""),T(He)}catch(He){$e(Y(He),"error"),Ye()}});const le=document.createElement("span");le.textContent=L[se],ge.append(Me,le),Re.append(ge)}const Fe=document.createElement("div");Fe.className="operation-editor-footer";const P=document.createElement("span");P.className="operation-meta",P.textContent="m² · нето след отвори",Fe.append(P),Re.append(Fe),F.append(Re),B.append(F)}}function $e(B,y="idle"){const _=oe("operationStatus");_.textContent=B,_.dataset.state=y}function Y(B){return B instanceof Error?B.message:"Промяната не можа да се приложи."}function ne(){g.setHighlightedEntities(PS(t,l)),g.setLaminateFloorVisible(IS(t,l));const B=oe("selectionChip");if(l.selectedEntity){const y=t.room.surfaces.find(_=>_.id===l.selectedEntity)?.label;B.innerHTML=`<span class="focus-chip">Избрано: ${me(y??l.selectedEntity)}</span>`;return}if(l.selectedServiceId){const y=t.serviceAssignments.find(_=>_.id===l.selectedServiceId);if(y){B.innerHTML=`<span class="focus-chip">Фокус: ${me(y.label)}</span>`;return}}B.replaceChildren()}function Se(B=t,y){const _=rp(B),L=_.lines,O=new Set(Bu(B,l)),j=oe("offerRows");j.replaceChildren(),L.forEach(X=>{const pe=document.createElement("button");pe.type="button",pe.className="offer-row",pe.dataset.serviceId=X.assignmentId,pe.classList.toggle("selected",O.has(X.assignmentId)),X.assignmentId===Js?pe.id="serviceRow":X.assignmentId==="assignment-laminate-flooring-1"&&(pe.id="serviceRowLaminate");const Oe=document.createElement("strong");Oe.append(document.createTextNode(`${X.label} `));const Re=document.createElement("span");Re.className="info-glyph",Re.setAttribute("aria-label","Информация"),Re.textContent="i",Oe.append(Re);const ve=document.createElement("div");ve.className="offer-meta";const Fe=document.createElement("span");Fe.textContent=`${Z(X.quantity.value)} ${ie(X.quantity.unit)}`;const P=document.createElement("span");P.className="offer-total",P.classList.toggle("missing-price",X.priceStatus==="missing"),P.textContent=X.priceStatus==="missing"||X.totalEur===null?"Цена не е въведена":`${de(X.totalEur)} €`,X.assignmentId===Js?(Fe.id="quantityText",P.id="lineTotalText"):X.assignmentId==="assignment-laminate-flooring-1"&&(Fe.id="quantityTextLaminate",P.id="lineTotalTextLaminate"),ve.append(Fe,P),pe.append(Oe,ve),j.append(pe)}),De(_);const F=Ie(B,L),ce=oe("offerDetailsSection"),re=oe("offerInfoCard");if(!F){ce.hidden=!0,re.hidden=!0;return}ce.hidden=!1,re.hidden=!1;const he=ie(F.quantity.unit);oe("quantityKpi").textContent=`${Z(F.quantity.value)} ${he}`,oe("unitPriceLabel").textContent="Ед. цена",oe("totalLabel").textContent="Сума",oe("unitPriceSuffix").textContent=`€/${he}`;const be=oe("unitPriceInput");be.dataset.assignmentId=F.assignmentId,be.value=y??(F.unitPriceEur===null?"":ae(F.unitPriceEur)),be.setCustomValidity(""),oe("unitPriceKpi").textContent=F.unitPriceEur===null?"Цена не е въведена":`${de(F.unitPriceEur)} €/${he}`,oe("totalKpi").textContent=F.totalEur===null?"Цена не е въведена":`${de(F.totalEur)} €`,oe("infoTitle").textContent=F.label,oe("infoWhat").textContent=F.clientInfo.what,oe("infoWhy").textContent=F.clientInfo.why,oe("infoResult").textContent=F.clientInfo.result,oe("infoIncludes").textContent=F.clientInfo.includes}function De(B){const y=oe("offerTotalKpi"),_=oe("offerTotalStatus");if(B.lines.length===0){y.textContent="—",y.dataset.state="empty",_.textContent="Няма избрани услуги.",_.dataset.state="empty";return}if(B.complete){y.textContent=`${de(B.pricedSubtotalEur)} €`,y.dataset.state="complete",_.textContent="Всички включени позиции имат цена.",_.dataset.state="complete";return}const L=B.missingPriceAssignmentIds.length;y.textContent="Непълна оферта",y.dataset.state="incomplete",_.textContent=`${L} ${L===1?"позиция е":"позиции са"} без цена · Въведено до момента: ${de(B.pricedSubtotalEur)} €`,_.dataset.state="incomplete"}function Ie(B,y){if(l.selectedServiceId)return za(B,l.selectedServiceId)??null;if(l.selectedEntity){const _=Bu(B,l);return _.length!==1?null:za(B,_[0])??null}return y[0]??null}function qe(B){if(!q().canAuthorProject)return;const y=oe("unitPriceInput").dataset.assignmentId;if(!y)return;const _=A(B);if(_===void 0)return;const L=bc(t,y,_);Se(L,B)}function tt(B){if(!q().canAuthorProject){Se();return}const y=B.dataset.assignmentId;if(!y)return;const _=A(B.value);if(_===void 0){B.setCustomValidity("Въведете валидна цена в евро."),B.reportValidity(),Se();return}B.setCustomValidity("");const L=bc(Rn(e),y,_);T(L)}function A(B){const y=B.trim();if(y==="")return null;const _=Number(y.replace(",","."));if(!(!Number.isFinite(_)||_<0))return _}function ie(B){switch(B){case"m2":return"m²";case"lm":return"л.м.";case"count":return"бр.";case"point":return"точка";case"set":return"комплект";case"fixed":return"общо"}}function q(){return RS(o?"client":"work",i)}function J(B,y){const _=Number.parseFloat(B);return Number.isFinite(_)&&_>0?_:y}function Z(B){return new Intl.NumberFormat("bg-BG",{minimumFractionDigits:2,maximumFractionDigits:2}).format(B)}function de(B){return new Intl.NumberFormat("bg-BG",{minimumFractionDigits:2,maximumFractionDigits:2}).format(B)}function ae(B){return B.toFixed(2).replace(".",",")}function me(B){return B.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function oe(B){const y=document.getElementById(B);if(!y)throw new Error(`Missing #${B}`);return y}}
