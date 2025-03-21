(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[933],{616:function(e,t,r){Promise.resolve().then(r.bind(r,6961))},4808:function(e,t,r){"use strict";r.d(t,{H:function(){return c},a:function(){return d}});var o=r(7437),s=r(2265),a=r(1872),i=r(5925),n=r(1490);let l=(0,s.createContext)(void 0);function c(e){let{children:t}=e,[r,c]=(0,s.useState)({user:null,isAuthenticated:!1});(0,s.useEffect)(()=>{let e=localStorage.getItem("auth"),t=n.Z.get("auth");if(e&&t&&c(JSON.parse(e)),0===JSON.parse(localStorage.getItem("users")||"[]").length){let e={id:(0,a.Z)(),email:"admin@admin.com",name:"Administrador",role:"MASTER",password:"admin123",createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};localStorage.setItem("users",JSON.stringify([e]))}},[]),(0,s.useEffect)(()=>{r.isAuthenticated?(localStorage.setItem("auth",JSON.stringify(r)),n.Z.set("auth","true",{expires:7})):(localStorage.removeItem("auth"),n.Z.remove("auth"))},[r]);let d=async(e,t)=>{let r=JSON.parse(localStorage.getItem("users")||"[]"),o=r.find(r=>r.email===e&&r.password===t);if(o){let e=r.map(e=>e.id===o.id?{...e,lastLogin:new Date().toISOString()}:e);localStorage.setItem("users",JSON.stringify(e));let t={user:{...o,lastLogin:new Date().toISOString()},isAuthenticated:!0};return c(t),localStorage.setItem("auth",JSON.stringify(t)),n.Z.set("auth","true",{expires:7}),i.toast.success("Login realizado com sucesso!"),!0}return i.toast.error("Email ou senha inv\xe1lidos"),!1},u=async e=>{let t=JSON.parse(localStorage.getItem("users")||"[]");if(t.some(t=>t.email===e.email))return i.toast.error("Email j\xe1 cadastrado"),!1;if("GESTOR"===e.role&&!e.teamId)return i.toast.error("ID da equipe \xe9 obrigat\xf3rio para Gestores"),!1;if("CORRETOR"===e.role&&!e.managerId)return i.toast.error("ID do gestor \xe9 obrigat\xf3rio para Corretores"),!1;if("CORRETOR"===e.role&&!t.some(t=>"GESTOR"===t.role&&t.id===e.managerId))return i.toast.error("Gestor n\xe3o encontrado"),!1;let r={id:(0,a.Z)(),...e,createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};return t.push(r),localStorage.setItem("users",JSON.stringify(t)),i.toast.success("Usu\xe1rio registrado com sucesso!"),!0};return(0,o.jsx)(l.Provider,{value:{...r,login:d,logout:()=>{c({user:null,isAuthenticated:!1}),localStorage.removeItem("auth"),n.Z.remove("auth"),i.toast.success("Logout realizado com sucesso!")},register:u,getUsers:()=>{let e=JSON.parse(localStorage.getItem("users")||"[]");if(!r.user)return[];switch(r.user.role){case"MASTER":return e;case"GESTOR":return e.filter(e=>{var t;return"CORRETOR"===e.role&&e.managerId===(null===(t=r.user)||void 0===t?void 0:t.id)});default:return[]}},deleteUser:e=>{var t;if((null===(t=r.user)||void 0===t?void 0:t.role)!=="MASTER"){i.toast.error("Sem permiss\xe3o para excluir usu\xe1rios");return}let o=JSON.parse(localStorage.getItem("users")||"[]").filter(t=>t.id!==e);localStorage.setItem("users",JSON.stringify(o)),i.toast.success("Usu\xe1rio exclu\xeddo com sucesso!")},updateUser:(e,t)=>{var o,s,a;if((null===(o=r.user)||void 0===o?void 0:o.id)!==e&&(null===(s=r.user)||void 0===s?void 0:s.role)!=="MASTER"){i.toast.error("Sem permiss\xe3o para atualizar usu\xe1rios");return}let n=JSON.parse(localStorage.getItem("users")||"[]").map(r=>r.id===e?{...r,...t}:r);if(localStorage.setItem("users",JSON.stringify(n)),e===(null===(a=r.user)||void 0===a?void 0:a.id)){let t=n.find(t=>t.id===e);t&&c(e=>({...e,user:t}))}i.toast.success("Informa\xe7\xf5es atualizadas com sucesso!")}},children:t})}let d=()=>{let e=(0,s.useContext)(l);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},6961:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return l}});var o=r(7437),s=r(4808),a=r(4033),i=r(2265),n=r(5925);function l(){let{user:e,getUsers:t,deleteUser:r,updateUser:l}=(0,s.a)(),c=(0,a.useRouter)(),[d,u]=(0,i.useState)([]);(0,i.useEffect)(()=>{if(!e||"MASTER"!==e.role&&"GESTOR"!==e.role){c.push("/");return}let r=t();"GESTOR"===e.role?u(r.filter(t=>"CORRETOR"===t.role&&t.managerId===e.id)):u(r)},[e,c,t]);let m=e=>{switch(e){case"MASTER":return"Administrador";case"GESTOR":return"Gestor";case"CORRETOR":return"Corretor";default:return e}},p=o=>{if(window.confirm("Tem certeza que deseja excluir este usu\xe1rio?")){r(o);let s=t();(null==e?void 0:e.role)==="GESTOR"?u(s.filter(t=>"CORRETOR"===t.role&&t.managerId===e.id)):u(s),n.toast.success("Usu\xe1rio exclu\xeddo com sucesso!")}};return(0,o.jsx)("div",{className:"min-h-screen bg-[#373737] p-8",children:(0,o.jsx)("div",{className:"max-w-6xl mx-auto",children:(0,o.jsxs)("div",{className:"bg-[#938667] rounded-lg shadow-lg p-8",children:[(0,o.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,o.jsxs)("h1",{className:"text-2xl font-bold text-white flex items-center gap-3",children:[(0,o.jsx)("svg",{className:"w-8 h-8",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,o.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"})}),(null==e?void 0:e.role)==="GESTOR"?"Gerenciar Corretores":"Gerenciar Usu\xe1rios"]}),(null==e?void 0:e.role)==="MASTER"&&(0,o.jsxs)("button",{onClick:()=>c.push("/register"),className:"px-4 py-2 bg-[#373737] text-white rounded-lg hover:bg-[#373737]/80 transition-colors flex items-center gap-2",children:[(0,o.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,o.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4v16m8-8H4"})}),"Adicionar Usu\xe1rio"]})]}),(0,o.jsx)("div",{className:"bg-[#373737] rounded-lg overflow-hidden",children:(0,o.jsxs)("table",{className:"w-full text-white",children:[(0,o.jsx)("thead",{className:"bg-[#373737]/50",children:(0,o.jsxs)("tr",{children:[(0,o.jsx)("th",{className:"px-6 py-3 text-left text-sm font-medium",children:"Nome"}),(0,o.jsx)("th",{className:"px-6 py-3 text-left text-sm font-medium",children:"Email"}),(0,o.jsx)("th",{className:"px-6 py-3 text-left text-sm font-medium",children:"Cargo"}),(null==e?void 0:e.role)==="MASTER"&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("th",{className:"px-6 py-3 text-left text-sm font-medium",children:"ID da Equipe"}),(0,o.jsx)("th",{className:"px-6 py-3 text-left text-sm font-medium",children:"ID do Gestor"})]}),(0,o.jsx)("th",{className:"px-6 py-3 text-left text-sm font-medium",children:"\xdaltimo Login"}),(0,o.jsx)("th",{className:"px-6 py-3 text-left text-sm font-medium",children:"A\xe7\xf5es"})]})}),(0,o.jsx)("tbody",{className:"divide-y divide-[#938667]/20",children:d.map(t=>(0,o.jsxs)("tr",{className:"hover:bg-[#938667]/10",children:[(0,o.jsx)("td",{className:"px-6 py-4 text-sm",children:t.name}),(0,o.jsx)("td",{className:"px-6 py-4 text-sm",children:t.email}),(0,o.jsx)("td",{className:"px-6 py-4 text-sm",children:m(t.role)}),(null==e?void 0:e.role)==="MASTER"&&(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("td",{className:"px-6 py-4 text-sm",children:t.teamId||"-"}),(0,o.jsx)("td",{className:"px-6 py-4 text-sm",children:t.managerId||"-"})]}),(0,o.jsx)("td",{className:"px-6 py-4 text-sm",children:t.lastLogin?new Date(t.lastLogin).toLocaleString("pt-BR"):"-"}),(0,o.jsx)("td",{className:"px-6 py-4 text-sm",children:((null==e?void 0:e.role)==="MASTER"&&"MASTER"!==t.role||(null==e?void 0:e.role)==="GESTOR"&&"CORRETOR"===t.role&&t.managerId===e.id)&&(0,o.jsx)("button",{onClick:()=>p(t.id),className:"text-red-500 hover:text-red-700",children:(0,o.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,o.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})})})})]},t.id))})]})})]})})})}},622:function(e,t,r){"use strict";var o=r(2265),s=Symbol.for("react.element"),a=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,n=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(e,t,r){var o,a={},c=null,d=null;for(o in void 0!==r&&(c=""+r),void 0!==t.key&&(c=""+t.key),void 0!==t.ref&&(d=t.ref),t)i.call(t,o)&&!l.hasOwnProperty(o)&&(a[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===a[o]&&(a[o]=t[o]);return{$$typeof:s,type:e,key:c,ref:d,props:a,_owner:n.current}}t.Fragment=a,t.jsx=c,t.jsxs=c},7437:function(e,t,r){"use strict";e.exports=r(622)},4033:function(e,t,r){e.exports=r(5313)},1872:function(e,t,r){"use strict";let o;r.d(t,{Z:function(){return n}});var s={randomUUID:"undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};let a=new Uint8Array(16),i=[];for(let e=0;e<256;++e)i.push((e+256).toString(16).slice(1));var n=function(e,t,r){if(s.randomUUID&&!t&&!e)return s.randomUUID();let n=(e=e||{}).random||(e.rng||function(){if(!o&&!(o="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return o(a)})();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(let e=0;e<16;++e)t[r+e]=n[e];return t}return function(e,t=0){return i[e[t+0]]+i[e[t+1]]+i[e[t+2]]+i[e[t+3]]+"-"+i[e[t+4]]+i[e[t+5]]+"-"+i[e[t+6]]+i[e[t+7]]+"-"+i[e[t+8]]+i[e[t+9]]+"-"+i[e[t+10]]+i[e[t+11]]+i[e[t+12]]+i[e[t+13]]+i[e[t+14]]+i[e[t+15]]}(n)}},1490:function(e,t,r){"use strict";/*! js-cookie v3.0.5 | MIT */function o(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)e[o]=r[o]}return e}r.d(t,{Z:function(){return s}});var s=function e(t,r){function s(e,s,a){if("undefined"!=typeof document){"number"==typeof(a=o({},r,a)).expires&&(a.expires=new Date(Date.now()+864e5*a.expires)),a.expires&&(a.expires=a.expires.toUTCString()),e=encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape);var i="";for(var n in a)a[n]&&(i+="; "+n,!0!==a[n]&&(i+="="+a[n].split(";")[0]));return document.cookie=e+"="+t.write(s,e)+i}}return Object.create({set:s,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var r=document.cookie?document.cookie.split("; "):[],o={},s=0;s<r.length;s++){var a=r[s].split("="),i=a.slice(1).join("=");try{var n=decodeURIComponent(a[0]);if(o[n]=t.read(i,n),e===n)break}catch(e){}}return e?o[e]:o}},remove:function(e,t){s(e,"",o({},t,{expires:-1}))},withAttributes:function(t){return e(this.converter,o({},this.attributes,t))},withConverter:function(t){return e(o({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(r)},converter:{value:Object.freeze(t)}})}({read:function(e){return'"'===e[0]&&(e=e.slice(1,-1)),e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}},{path:"/"})},5925:function(e,t,r){"use strict";let o,s;r.r(t),r.d(t,{CheckmarkIcon:function(){return Y},ErrorIcon:function(){return Z},LoaderIcon:function(){return V},ToastBar:function(){return en},ToastIcon:function(){return et},Toaster:function(){return eu},default:function(){return em},resolveValue:function(){return O},toast:function(){return _},useToaster:function(){return P},useToasterStore:function(){return A}});var a,i=r(2265);let n={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||n,c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,m=(e,t)=>{let r="",o="",s="";for(let a in e){let i=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+i+";":o+="f"==a[1]?m(i,a):a+"{"+m(i,"k"==a[1]?"":t)+"}":"object"==typeof i?o+=m(i,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=i&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=m.p?m.p(a,i):a+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+o},p={},f=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+f(e[r]);return t}return e},h=(e,t,r,o,s)=>{var a;let i=f(e),n=p[i]||(p[i]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(i));if(!p[n]){let t=i!==e?e:(e=>{let t,r,o=[{}];for(;t=c.exec(e.replace(d,""));)t[4]?o.shift():t[3]?(r=t[3].replace(u," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(u," ").trim();return o[0]})(e);p[n]=m(s?{["@keyframes "+n]:t}:t,r?"":"."+n)}let l=r&&p.g?p.g:null;return r&&(p.g=p[n]),a=p[n],l?t.data=t.data.replace(l,a):-1===t.data.indexOf(a)&&(t.data=o?a+t.data:t.data+a),n},g=(e,t,r)=>e.reduce((e,o,s)=>{let a=t[s];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":m(e,""):!1===e?"":e}return e+o+(null==a?"":a)},"");function x(e){let t=this||{},r=e.call?e(t.p):e;return h(r.unshift?r.raw?g(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}x.bind({g:1});let y,v,b,S=x.bind({k:1});function w(e,t){let r=this||{};return function(){let o=arguments;function s(a,i){let n=Object.assign({},a),l=n.className||s.className;r.p=Object.assign({theme:v&&v()},n),r.o=/ *go\d+/.test(l),n.className=x.apply(r,o)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),b&&c[0]&&b(n),y(c,n)}return t?t(s):s}}var E=e=>"function"==typeof e,O=(e,t)=>E(e)?e(t):e,j=(o=0,()=>(++o).toString()),I=()=>{if(void 0===s&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");s=!e||e.matches}return s},N=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return N(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},R=[],C={toasts:[],pausedAt:void 0},k=e=>{C=N(C,e),R.forEach(e=>{e(C)})},T={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},A=(e={})=>{let[t,r]=(0,i.useState)(C),o=(0,i.useRef)(C);(0,i.useEffect)(()=>(o.current!==C&&r(C),R.push(r),()=>{let e=R.indexOf(r);e>-1&&R.splice(e,1)}),[]);let s=t.toasts.map(t=>{var r,o,s;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(o=e[t.type])?void 0:o.duration)||(null==e?void 0:e.duration)||T[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...t,toasts:s}},D=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||j()}),U=e=>(t,r)=>{let o=D(t,e,r);return k({type:2,toast:o}),o.id},_=(e,t)=>U("blank")(e,t);_.error=U("error"),_.success=U("success"),_.loading=U("loading"),_.custom=U("custom"),_.dismiss=e=>{k({type:3,toastId:e})},_.remove=e=>k({type:4,toastId:e}),_.promise=(e,t,r)=>{let o=_.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?O(t.success,e):void 0;return s?_.success(s,{id:o,...r,...null==r?void 0:r.success}):_.dismiss(o),e}).catch(e=>{let s=t.error?O(t.error,e):void 0;s?_.error(s,{id:o,...r,...null==r?void 0:r.error}):_.dismiss(o)}),e};var L=(e,t)=>{k({type:1,toast:{id:e,height:t}})},M=()=>{k({type:5,time:Date.now()})},$=new Map,z=1e3,G=(e,t=z)=>{if($.has(e))return;let r=setTimeout(()=>{$.delete(e),k({type:4,toastId:e})},t);$.set(e,r)},P=e=>{let{toasts:t,pausedAt:r}=A(e);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),o=t.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(r<0){t.visible&&_.dismiss(t.id);return}return setTimeout(()=>_.dismiss(t.id),r)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[t,r]);let o=(0,i.useCallback)(()=>{r&&k({type:6,time:Date.now()})},[r]),s=(0,i.useCallback)((e,r)=>{let{reverseOrder:o=!1,gutter:s=8,defaultPosition:a}=r||{},i=t.filter(t=>(t.position||a)===(e.position||a)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...o?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+s,0)},[t]);return(0,i.useEffect)(()=>{t.forEach(e=>{if(e.dismissed)G(e.id,e.removeDelay);else{let t=$.get(e.id);t&&(clearTimeout(t),$.delete(e.id))}})},[t]),{toasts:t,handlers:{updateHeight:L,startPause:M,endPause:o,calculateOffset:s}}},J=S`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=S`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,B=S`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Z=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${J} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
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
    animation: ${B} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,H=S`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,V=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${H} 1s linear infinite;
`,q=S`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,W=S`
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
}`,Y=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${q} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,K=w("div")`
  position: absolute;
`,Q=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,X=S`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${X} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,et=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return void 0!==t?"string"==typeof t?i.createElement(ee,null,t):t:"blank"===r?null:i.createElement(Q,null,i.createElement(V,{...o}),"loading"!==r&&i.createElement(K,null,"error"===r?i.createElement(Z,{...o}):i.createElement(Y,{...o})))},er=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,eo=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,es=w("div")`
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
`,ea=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ei=(e,t)=>{let r=e.includes("top")?1:-1,[o,s]=I()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[er(r),eo(r)];return{animation:t?`${S(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${S(s)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},en=i.memo(({toast:e,position:t,style:r,children:o})=>{let s=e.height?ei(e.position||t||"top-center",e.visible):{opacity:0},a=i.createElement(et,{toast:e}),n=i.createElement(ea,{...e.ariaProps},O(e.message,e));return i.createElement(es,{className:e.className,style:{...s,...r,...e.style}},"function"==typeof o?o({icon:a,message:n}):i.createElement(i.Fragment,null,a,n))});a=i.createElement,m.p=void 0,y=a,v=void 0,b=void 0;var el=({id:e,className:t,style:r,onHeightUpdate:o,children:s})=>{let a=i.useCallback(t=>{if(t){let r=()=>{o(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return i.createElement("div",{ref:a,className:t,style:r},s)},ec=(e,t)=>{let r=e.includes("top"),o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:I()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...o}},ed=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,eu=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:s,containerStyle:a,containerClassName:n})=>{let{toasts:l,handlers:c}=P(r);return i.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...a},className:n,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(r=>{let a=r.position||t,n=ec(a,c.calculateOffset(r,{reverseOrder:e,gutter:o,defaultPosition:t}));return i.createElement(el,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?ed:"",style:n},"custom"===r.type?O(r.message,r):s?s(r):i.createElement(en,{toast:r,position:a}))}))},em=_}},function(e){e.O(0,[971,938,744],function(){return e(e.s=616)}),_N_E=e.O()}]);