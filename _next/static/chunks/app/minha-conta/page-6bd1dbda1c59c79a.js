(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[230],{4797:function(e,t,r){Promise.resolve().then(r.bind(r,1179))},4808:function(e,t,r){"use strict";r.d(t,{H:function(){return c},a:function(){return u}});var o=r(7437),a=r(2265),s=r(1872),i=r(5925),n=r(1490);let l=(0,a.createContext)(void 0);function c(e){let{children:t}=e,[r,c]=(0,a.useState)({user:null,isAuthenticated:!1});(0,a.useEffect)(()=>{let e=localStorage.getItem("auth"),t=n.Z.get("auth");if(e&&t&&c(JSON.parse(e)),0===JSON.parse(localStorage.getItem("users")||"[]").length){let e={id:(0,s.Z)(),email:"admin@admin.com",name:"Administrador",role:"MASTER",password:"admin123",createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};localStorage.setItem("users",JSON.stringify([e]))}},[]),(0,a.useEffect)(()=>{r.isAuthenticated?(localStorage.setItem("auth",JSON.stringify(r)),n.Z.set("auth","true",{expires:7})):(localStorage.removeItem("auth"),n.Z.remove("auth"))},[r]);let u=async(e,t)=>{let r=JSON.parse(localStorage.getItem("users")||"[]"),o=r.find(r=>r.email===e&&r.password===t);if(o){let e=r.map(e=>e.id===o.id?{...e,lastLogin:new Date().toISOString()}:e);localStorage.setItem("users",JSON.stringify(e));let t={user:{...o,lastLogin:new Date().toISOString()},isAuthenticated:!0};return c(t),localStorage.setItem("auth",JSON.stringify(t)),n.Z.set("auth","true",{expires:7}),i.toast.success("Login realizado com sucesso!"),!0}return i.toast.error("Email ou senha inv\xe1lidos"),!1},d=async e=>{let t=JSON.parse(localStorage.getItem("users")||"[]");if(t.some(t=>t.email===e.email))return i.toast.error("Email j\xe1 cadastrado"),!1;if("GESTOR"===e.role&&!e.teamId)return i.toast.error("ID da equipe \xe9 obrigat\xf3rio para Gestores"),!1;if("CORRETOR"===e.role&&!e.managerId)return i.toast.error("ID do gestor \xe9 obrigat\xf3rio para Corretores"),!1;if("CORRETOR"===e.role&&!t.some(t=>"GESTOR"===t.role&&t.id===e.managerId))return i.toast.error("Gestor n\xe3o encontrado"),!1;let r={id:(0,s.Z)(),...e,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};return t.push(r),localStorage.setItem("users",JSON.stringify(t)),i.toast.success("Usu\xe1rio registrado com sucesso!"),!0};return(0,o.jsx)(l.Provider,{value:{...r,login:u,logout:()=>{c({user:null,isAuthenticated:!1}),localStorage.removeItem("auth"),n.Z.remove("auth"),i.toast.success("Logout realizado com sucesso!")},register:d,getUsers:()=>{let e=JSON.parse(localStorage.getItem("users")||"[]");if(!r.user)return[];switch(r.user.role){case"MASTER":return e;case"GESTOR":return e.filter(e=>{var t;return"CORRETOR"===e.role&&e.managerId===(null===(t=r.user)||void 0===t?void 0:t.id)});default:return[]}},deleteUser:e=>{var t;if((null===(t=r.user)||void 0===t?void 0:t.role)!=="MASTER"){i.toast.error("Sem permiss\xe3o para excluir usu\xe1rios");return}let o=JSON.parse(localStorage.getItem("users")||"[]").filter(t=>t.id!==e);localStorage.setItem("users",JSON.stringify(o)),i.toast.success("Usu\xe1rio exclu\xeddo com sucesso!")},updateUser:(e,t)=>{var o,a,s;if((null===(o=r.user)||void 0===o?void 0:o.id)!==e&&(null===(a=r.user)||void 0===a?void 0:a.role)!=="MASTER"){i.toast.error("Sem permiss\xe3o para atualizar usu\xe1rios");return}let n=JSON.parse(localStorage.getItem("users")||"[]").map(r=>r.id===e?{...r,...t}:r);if(localStorage.setItem("users",JSON.stringify(n)),e===(null===(s=r.user)||void 0===s?void 0:s.id)){let t=n.find(t=>t.id===e);t&&c(e=>({...e,user:t}))}i.toast.success("Informa\xe7\xf5es atualizadas com sucesso!")}},children:t})}let u=()=>{let e=(0,a.useContext)(l);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},1179:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return l}});var o=r(7437),a=r(4808),s=r(2265),i=r(4033),n=r(5925);function l(){let{user:e,updateUser:t}=(0,a.a)();(0,i.useRouter)();let[r,l]=(0,s.useState)(!1),[c,u]=(0,s.useState)({name:(null==e?void 0:e.name)||"",email:(null==e?void 0:e.email)||"",teamId:(null==e?void 0:e.teamId)||""}),d=async()=>{try{if(null==e?void 0:e.id){var r;if("GESTOR"===e.role&&!(null===(r=e.teamId)||void 0===r?void 0:r.trim())){n.toast.error("ID da equipe \xe9 obrigat\xf3rio para Gestores");return}let o={name:c.name,email:c.email,teamId:"GESTOR"===e.role?e.teamId:c.teamId};await t(e.id,o),l(!1),n.toast.success("Informa\xe7\xf5es atualizadas com sucesso!")}}catch(e){n.toast.error("Erro ao atualizar informa\xe7\xf5es")}};return e?(0,o.jsx)("div",{className:"min-h-screen bg-[#373737] p-8",children:(0,o.jsx)("div",{className:"max-w-2xl mx-auto",children:(0,o.jsxs)("div",{className:"bg-[#938667] rounded-lg shadow-lg p-8",children:[(0,o.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,o.jsxs)("h1",{className:"text-2xl font-bold text-white flex items-center gap-3",children:[(0,o.jsx)("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,o.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"})}),"Minha Conta"]}),!r&&(0,o.jsx)("button",{onClick:()=>{l(!0)},className:"text-white hover:text-[#373737] transition-colors",children:(0,o.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,o.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"})})})]}),(0,o.jsx)("div",{className:"space-y-6",children:(0,o.jsxs)("div",{className:"bg-[#373737] rounded-lg p-6",children:[(0,o.jsxs)("div",{className:"space-y-4",children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm text-[#938667] mb-1",children:"Nome"}),r?(0,o.jsx)("input",{type:"text",value:c.name,onChange:e=>u({...c,name:e.target.value}),className:"w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"}):(0,o.jsx)("p",{className:"text-white text-lg",children:e.name})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm text-[#938667] mb-1",children:"E-mail"}),r?(0,o.jsx)("input",{type:"email",value:c.email,onChange:e=>u({...c,email:e.target.value}),className:"w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#938667]"}):(0,o.jsx)("p",{className:"text-white text-lg",children:e.email})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm text-[#938667] mb-1",children:"Cargo"}),(0,o.jsx)("p",{className:"text-white text-lg",children:(e=>{switch(e){case"MASTER":return"Administrador";case"GESTOR":return"Gestor";case"CORRETOR":return"Corretor";default:return e}})(e.role)})]}),"GESTOR"===e.role&&(0,o.jsxs)("div",{children:[(0,o.jsxs)("label",{className:"block text-sm text-[#938667] mb-1",children:["ID da Equipe",r&&(0,o.jsx)("span",{className:"text-xs text-[#938667]/70 ml-2",children:"(Somente administradores podem alterar)"})]}),r?(0,o.jsx)("input",{type:"text",value:e.teamId||"",disabled:!0,className:"w-full px-4 py-2 bg-[#2A2A2A] border border-[#938667] rounded-lg text-white/50 focus:outline-none cursor-not-allowed"}):(0,o.jsx)("p",{className:"text-white text-lg",children:e.teamId||"-"})]}),"CORRETOR"===e.role&&e.managerId&&(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm text-[#938667] mb-1",children:"ID do Gestor"}),(0,o.jsx)("p",{className:"text-white text-lg",children:e.managerId})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-sm text-[#938667] mb-1",children:"\xdaltimo Login"}),(0,o.jsx)("p",{className:"text-white text-lg",children:e.lastLogin?new Date(e.lastLogin).toLocaleString("pt-BR"):"N/A"})]})]}),r&&(0,o.jsxs)("div",{className:"flex gap-4 mt-6",children:[(0,o.jsx)("button",{onClick:d,className:"px-4 py-2 bg-[#938667] text-white rounded-lg hover:bg-[#7a6f55] transition-colors",children:"Salvar"}),(0,o.jsx)("button",{onClick:()=>{u({name:(null==e?void 0:e.name)||"",email:(null==e?void 0:e.email)||"",teamId:(null==e?void 0:e.teamId)||""}),l(!1)},className:"px-4 py-2 bg-[#373737] text-white rounded-lg hover:bg-[#373737]/80 transition-colors",children:"Cancelar"})]})]})})]})})}):null}},622:function(e,t,r){"use strict";var o=r(2265),a=Symbol.for("react.element"),s=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,n=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var o,s={},c=null,u=null;for(o in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(u=t.ref),t)i.call(t,o)&&!l.hasOwnProperty(o)&&(s[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===s[o]&&(s[o]=t[o]);return{$$typeof:a,type:e,key:c,ref:u,props:s,_owner:n.current}}t.Fragment=s,t.jsx=c,t.jsxs=c},7437:function(e,t,r){"use strict";e.exports=r(622)},4033:function(e,t,r){e.exports=r(5313)},1872:function(e,t,r){"use strict";let o;r.d(t,{Z:function(){return n}});var a={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let s=new Uint8Array(16),i=[];for(let e=0;e<256;++e)i.push((e+256).toString(16).slice(1));var n=function(e,t,r){if(a.randomUUID&&!t&&!e)return a.randomUUID();let n=(e=e||{}).random||(e.rng||function(){if(!o&&!(o="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return o(s)})();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=n[e];return t}return function(e,t=0){return i[e[t+0]]+i[e[t+1]]+i[e[t+2]]+i[e[t+3]]+"-"+i[e[t+4]]+i[e[t+5]]+"-"+i[e[t+6]]+i[e[t+7]]+"-"+i[e[t+8]]+i[e[t+9]]+"-"+i[e[t+10]]+i[e[t+11]]+i[e[t+12]]+i[e[t+13]]+i[e[t+14]]+i[e[t+15]]}(n)}},1490:function(e,t,r){"use strict";/*! js-cookie v3.0.5 | MIT */function o(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)e[o]=r[o]}return e}r.d(t,{Z:function(){return a}});var a=function e(t,r){function a(e,a,s){if("undefined"!=typeof document){"number"==typeof(s=o({},r,s)).expires&&(s.expires=new Date(Date.now()+864e5*s.expires)),s.expires&&(s.expires=s.expires.toUTCString()),e=encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var i="";for(var n in s)s[n]&&(i+="; "+n,!0!==s[n]&&(i+="="+s[n].split(";")[0]));return document.cookie=e+"="+t.write(a,e)+i}}return Object.create({set:a,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],o={},a=0;a<r.length;a++){var s=r[a].split("="),i=s.slice(1).join("=");try{var n=decodeURIComponent(s[0]);if(o[n]=t.read(i,n),e===n)break}catch(e){}}return e?o[e]:o}},remove:function(e,t){a(e,"",o({},t,{expires:-1}))},withAttributes:function(t){return e(this.converter,o({},this.attributes,t))},withConverter:function(t){return e(o({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(r)},converter:{value:Object.freeze(t)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})},5925:function(e,t,r){"use strict";let o,a;r.r(t),r.d(t,{CheckmarkIcon:function(){return Y},ErrorIcon:function(){return Z},LoaderIcon:function(){return q},ToastBar:function(){return en},ToastIcon:function(){return et},Toaster:function(){return ed},default:function(){return em},resolveValue:function(){return j},toast:function(){return _},useToaster:function(){return J},useToasterStore:function(){return D}});var s,i=r(2265);let n={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||n,c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,u=/\/\*[^]*?\*\/|  +/g,d=/\n+/g,m=(e,t)=>{let r="",o="",a="";for(let s in e){let i=e[s];"@"==s[0]?"i"==s[1]?r=s+" "+i+";":o+="f"==s[1]?m(i,s):s+"{"+m(i,"k"==s[1]?"":t)+"}":"object"==typeof i?o+=m(i,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=i&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=m.p?m.p(s,i):s+":"+i+";")}return r+(t&&a?t+"{"+a+"}":a)+o},p={},f=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+f(e[r]);return t}return e},g=(e,t,r,o,a)=>{var s;let i=f(e),n=p[i]||(p[i]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(i));if(!p[n]){let t=i!==e?e:(e=>{let t,r,o=[{}];for(;t=c.exec(e.replace(u,""));)t[4]?o.shift():t[3]?(r=t[3].replace(d," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(d," ").trim();return o[0]})(e);p[n]=m(a?{["@keyframes "+n]:t}:t,r?"":"."+n)}let l=r&&p.g?p.g:null;return r&&(p.g=p[n]),s=p[n],l?t.data=t.data.replace(l,s):-1===t.data.indexOf(s)&&(t.data=o?s+t.data:t.data+s),n},h=(e,t,r)=>e.reduce((e,o,a)=>{let s=t[a];if(s&&s.call){let e=s(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":m(e,""):!1===e?"":e}return e+o+(null==s?"":s)},"");function x(e){let t=this||{},r=e.call?e(t.p):e;return g(r.unshift?r.raw?h(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}x.bind({g:1});let v,y,b,w=x.bind({k:1});function S(e,t){let r=this||{};return function(){let o=arguments;function a(s,i){let n=Object.assign({},s),l=n.className||a.className;r.p=Object.assign({theme:y&&y()},n),r.o=/ *go\d+/.test(l),n.className=x.apply(r,o)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),b&&c[0]&&b(n),v(c,n)}return t?t(a):a}}var I=e=>"function"==typeof e,j=(e,t)=>I(e)?e(t):e,N=(o=0,()=>(++o).toString()),O=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},E=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return E(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},k=[],C={toasts:[],pausedAt:void 0},R=e=>{C=E(C,e),k.forEach(e=>{e(C)})},A={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(e={})=>{let[t,r]=(0,i.useState)(C),o=(0,i.useRef)(C);(0,i.useEffect)(()=>(o.current!==C&&r(C),k.push(r),()=>{let e=k.indexOf(r);e>-1&&k.splice(e,1)}),[]);let a=t.toasts.map(t=>{var r,o,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(o=e[t.type])?void 0:o.duration)||(null==e?void 0:e.duration)||A[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...t,toasts:a}},T=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||N()}),U=e=>(t,r)=>{let o=T(t,e,r);return R({type:2,toast:o}),o.id},_=(e,t)=>U("blank")(e,t);_.error=U("error"),_.success=U("success"),_.loading=U("loading"),_.custom=U("custom"),_.dismiss=e=>{R({type:3,toastId:e})},_.remove=e=>R({type:4,toastId:e}),_.promise=(e,t,r)=>{let o=_.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?j(t.success,e):void 0;return a?_.success(a,{id:o,...r,...null==r?void 0:r.success}):_.dismiss(o),e}).catch(e=>{let a=t.error?j(t.error,e):void 0;a?_.error(a,{id:o,...r,...null==r?void 0:r.error}):_.dismiss(o)}),e};var L=(e,t)=>{R({type:1,toast:{id:e,height:t}})},z=()=>{R({type:5,time:Date.now()})},$=new Map,M=1e3,P=(e,t=M)=>{if($.has(e))return;let r=setTimeout(()=>{$.delete(e),R({type:4,toastId:e})},t);$.set(e,r)},J=e=>{let{toasts:t,pausedAt:r}=D(e);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),o=t.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(r<0){t.visible&&_.dismiss(t.id);return}return setTimeout(()=>_.dismiss(t.id),r)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[t,r]);let o=(0,i.useCallback)(()=>{r&&R({type:6,time:Date.now()})},[r]),a=(0,i.useCallback)((e,r)=>{let{reverseOrder:o=!1,gutter:a=8,defaultPosition:s}=r||{},i=t.filter(t=>(t.position||s)===(e.position||s)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...o?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[t]);return(0,i.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)P(e.id,e.removeDelay);else{let t=$.get(e.id);t&&(clearTimeout(t),$.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:L,startPause:z,endPause:o,calculateOffset:a}}},G=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,B=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,F=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Z=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${G} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${B} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,H=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,q=S("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${H} 1s linear infinite;
`,V=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,W=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Y=S("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${W} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,K=S("div")`
  position: absolute;
`,Q=S("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,X=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=S("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${X} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,et=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return void 0!==t?"string"==typeof t?i.createElement(ee,null,t):t:"blank"===r?null:i.createElement(Q,null,i.createElement(q,{...o}),"loading"!==r&&i.createElement(K,null,"error"===r?i.createElement(Z,{...o}):i.createElement(Y,{...o})))},er=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,eo=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,ea=S("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,es=S("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ei=(e,t)=>{let r=e.includes("top")?1:-1,[o,a]=O()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[er(r),eo(r)];return{animation:t?`${w(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},en=i.memo(({toast:e,position:t,style:r,children:o})=>{let a=e.height?ei(e.position||t||"top-center",e.visible):{opacity:0},s=i.createElement(et,{toast:e}),n=i.createElement(es,{...e.ariaProps},j(e.message,e));return i.createElement(ea,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof o?o({icon:s,message:n}):i.createElement(i.Fragment,null,s,n))});s=i.createElement,m.p=void 0,v=s,y=void 0,b=void 0;var el=({id:e,className:t,style:r,onHeightUpdate:o,children:a})=>{let s=i.useCallback(t=>{if(t){let r=()=>{o(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return i.createElement("div",{ref:s,className:t,style:r},a)},ec=(e,t)=>{let r=e.includes("top"),o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:O()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...o}},eu=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ed=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:a,containerStyle:s,containerClassName:n})=>{let{toasts:l,handlers:c}=J(r);return i.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(r=>{let s=r.position||t,n=ec(s,c.calculateOffset(r,{reverseOrder:e,gutter:o,defaultPosition:t}));return i.createElement(el,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?eu:"",style:n},"custom"===r.type?j(r.message,r):a?a(r):i.createElement(en,{toast:r,position:s}))}))},em=_}},function(e){e.O(0,[971,938,744],function(){return e(e.s=4797)}),_N_E=e.O()}]);