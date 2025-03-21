"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[304],{7304:function(e,t,n){n.r(t),n.d(t,{default:function(){return en}});/*! @license DOMPurify 3.2.4 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.4/LICENSE */let{entries:o,setPrototypeOf:r,isFrozen:i,getPrototypeOf:a,getOwnPropertyDescriptor:l}=Object,{freeze:c,seal:s,create:u}=Object,{apply:m,construct:p}="undefined"!=typeof Reflect&&Reflect;c||(c=function(e){return e}),s||(s=function(e){return e}),m||(m=function(e,t,n){return e.apply(t,n)}),p||(p=function(e,t){return new e(...t)});let f=R(Array.prototype.forEach),d=R(Array.prototype.lastIndexOf),h=R(Array.prototype.pop),g=R(Array.prototype.push),T=R(Array.prototype.splice),y=R(String.prototype.toLowerCase),E=R(String.prototype.toString),_=R(String.prototype.match),A=R(String.prototype.replace),b=R(String.prototype.indexOf),N=R(String.prototype.trim),S=R(Object.prototype.hasOwnProperty),w=R(RegExp.prototype.test),v=(Z=TypeError,function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return p(Z,t)});function R(e){return function(t){for(var n=arguments.length,o=Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return m(e,t,o)}}function C(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:y;r&&r(e,null);let o=t.length;for(;o--;){let r=t[o];if("string"==typeof r){let e=n(r);e!==r&&(i(t)||(t[o]=e),r=e)}e[r]=!0}return e}function L(e){let t=u(null);for(let[n,r]of o(e))S(e,n)&&(Array.isArray(r)?t[n]=function(e){for(let t=0;t<e.length;t++)S(e,t)||(e[t]=null);return e}(r):r&&"object"==typeof r&&r.constructor===Object?t[n]=L(r):t[n]=r);return t}function O(e,t){for(;null!==e;){let n=l(e,t);if(n){if(n.get)return R(n.get);if("function"==typeof n.value)return R(n.value)}e=a(e)}return function(){return null}}let k=c(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),D=c(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),x=c(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),I=c(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),M=c(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),U=c(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),z=c(["#text"]),P=c(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),H=c(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),F=c(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),W=c(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),G=s(/\{\{[\w\W]*|[\w\W]*\}\}/gm),B=s(/<%[\w\W]*|[\w\W]*%>/gm),Y=s(/\$\{[\w\W]*/gm),j=s(/^data-[\-\w.\u00B7-\uFFFF]+$/),q=s(/^aria-[\-\w]+$/),X=s(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),$=s(/^(?:\w+script|data):/i),K=s(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),V=s(/^html$/i);var Z,J=Object.freeze({__proto__:null,ARIA_ATTR:q,ATTR_WHITESPACE:K,CUSTOM_ELEMENT:s(/^[a-z][.\w]*(-[.\w]+)+$/i),DATA_ATTR:j,DOCTYPE_NAME:V,ERB_EXPR:B,IS_ALLOWED_URI:X,IS_SCRIPT_OR_DATA:$,MUSTACHE_EXPR:G,TMPLIT_EXPR:Y});let Q={element:1,text:3,progressingInstruction:7,comment:8,document:9},ee=function(e,t){if("object"!=typeof e||"function"!=typeof e.createPolicy)return null;let n=null,o="data-tt-policy-suffix";t&&t.hasAttribute(o)&&(n=t.getAttribute(o));let r="dompurify"+(n?"#"+n:"");try{return e.createPolicy(r,{createHTML:e=>e,createScriptURL:e=>e})}catch(e){return console.warn("TrustedTypes policy "+r+" could not be created."),null}},et=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};var en=function e(){let t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"undefined"==typeof window?null:window,r=t=>e(t);if(r.version="3.2.4",r.removed=[],!n||!n.document||n.document.nodeType!==Q.document||!n.Element)return r.isSupported=!1,r;let{document:i}=n,a=i,l=a.currentScript,{DocumentFragment:s,HTMLTemplateElement:m,Node:p,Element:R,NodeFilter:G,NamedNodeMap:B=n.NamedNodeMap||n.MozNamedAttrMap,HTMLFormElement:Y,DOMParser:j,trustedTypes:q}=n,$=R.prototype,K=O($,"cloneNode"),Z=O($,"remove"),en=O($,"nextSibling"),eo=O($,"childNodes"),er=O($,"parentNode");if("function"==typeof m){let e=i.createElement("template");e.content&&e.content.ownerDocument&&(i=e.content.ownerDocument)}let ei="",{implementation:ea,createNodeIterator:el,createDocumentFragment:ec,getElementsByTagName:es}=i,{importNode:eu}=a,em=et();r.isSupported="function"==typeof o&&"function"==typeof er&&ea&&void 0!==ea.createHTMLDocument;let{MUSTACHE_EXPR:ep,ERB_EXPR:ef,TMPLIT_EXPR:ed,DATA_ATTR:eh,ARIA_ATTR:eg,IS_SCRIPT_OR_DATA:eT,ATTR_WHITESPACE:ey,CUSTOM_ELEMENT:eE}=J,{IS_ALLOWED_URI:e_}=J,eA=null,eb=C({},[...k,...D,...x,...M,...z]),eN=null,eS=C({},[...P,...H,...F,...W]),ew=Object.seal(u(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ev=null,eR=null,eC=!0,eL=!0,eO=!1,ek=!0,eD=!1,ex=!0,eI=!1,eM=!1,eU=!1,ez=!1,eP=!1,eH=!1,eF=!0,eW=!1,eG=!0,eB=!1,eY={},ej=null,eq=C({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),eX=null,e$=C({},["audio","video","img","source","image","track"]),eK=null,eV=C({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),eZ="http://www.w3.org/1998/Math/MathML",eJ="http://www.w3.org/2000/svg",eQ="http://www.w3.org/1999/xhtml",e0=eQ,e1=!1,e2=null,e3=C({},[eZ,eJ,eQ],E),e9=C({},["mi","mo","mn","ms","mtext"]),e4=C({},["annotation-xml"]),e8=C({},["title","style","font","a","script"]),e7=null,e5=["application/xhtml+xml","text/html"],e6=null,te=null,tt=i.createElement("form"),tn=function(e){return e instanceof RegExp||e instanceof Function},to=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!te||te!==e){if(e&&"object"==typeof e||(e={}),e=L(e),e6="application/xhtml+xml"===(e7=-1===e5.indexOf(e.PARSER_MEDIA_TYPE)?"text/html":e.PARSER_MEDIA_TYPE)?E:y,eA=S(e,"ALLOWED_TAGS")?C({},e.ALLOWED_TAGS,e6):eb,eN=S(e,"ALLOWED_ATTR")?C({},e.ALLOWED_ATTR,e6):eS,e2=S(e,"ALLOWED_NAMESPACES")?C({},e.ALLOWED_NAMESPACES,E):e3,eK=S(e,"ADD_URI_SAFE_ATTR")?C(L(eV),e.ADD_URI_SAFE_ATTR,e6):eV,eX=S(e,"ADD_DATA_URI_TAGS")?C(L(e$),e.ADD_DATA_URI_TAGS,e6):e$,ej=S(e,"FORBID_CONTENTS")?C({},e.FORBID_CONTENTS,e6):eq,ev=S(e,"FORBID_TAGS")?C({},e.FORBID_TAGS,e6):{},eR=S(e,"FORBID_ATTR")?C({},e.FORBID_ATTR,e6):{},eY=!!S(e,"USE_PROFILES")&&e.USE_PROFILES,eC=!1!==e.ALLOW_ARIA_ATTR,eL=!1!==e.ALLOW_DATA_ATTR,eO=e.ALLOW_UNKNOWN_PROTOCOLS||!1,ek=!1!==e.ALLOW_SELF_CLOSE_IN_ATTR,eD=e.SAFE_FOR_TEMPLATES||!1,ex=!1!==e.SAFE_FOR_XML,eI=e.WHOLE_DOCUMENT||!1,ez=e.RETURN_DOM||!1,eP=e.RETURN_DOM_FRAGMENT||!1,eH=e.RETURN_TRUSTED_TYPE||!1,eU=e.FORCE_BODY||!1,eF=!1!==e.SANITIZE_DOM,eW=e.SANITIZE_NAMED_PROPS||!1,eG=!1!==e.KEEP_CONTENT,eB=e.IN_PLACE||!1,e_=e.ALLOWED_URI_REGEXP||X,e0=e.NAMESPACE||eQ,e9=e.MATHML_TEXT_INTEGRATION_POINTS||e9,e4=e.HTML_INTEGRATION_POINTS||e4,ew=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&tn(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ew.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&tn(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ew.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(ew.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),eD&&(eL=!1),eP&&(ez=!0),eY&&(eA=C({},z),eN=[],!0===eY.html&&(C(eA,k),C(eN,P)),!0===eY.svg&&(C(eA,D),C(eN,H),C(eN,W)),!0===eY.svgFilters&&(C(eA,x),C(eN,H),C(eN,W)),!0===eY.mathMl&&(C(eA,M),C(eN,F),C(eN,W))),e.ADD_TAGS&&(eA===eb&&(eA=L(eA)),C(eA,e.ADD_TAGS,e6)),e.ADD_ATTR&&(eN===eS&&(eN=L(eN)),C(eN,e.ADD_ATTR,e6)),e.ADD_URI_SAFE_ATTR&&C(eK,e.ADD_URI_SAFE_ATTR,e6),e.FORBID_CONTENTS&&(ej===eq&&(ej=L(ej)),C(ej,e.FORBID_CONTENTS,e6)),eG&&(eA["#text"]=!0),eI&&C(eA,["html","head","body"]),eA.table&&(C(eA,["tbody"]),delete ev.tbody),e.TRUSTED_TYPES_POLICY){if("function"!=typeof e.TRUSTED_TYPES_POLICY.createHTML)throw v('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if("function"!=typeof e.TRUSTED_TYPES_POLICY.createScriptURL)throw v('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');ei=(t=e.TRUSTED_TYPES_POLICY).createHTML("")}else void 0===t&&(t=ee(q,l)),null!==t&&"string"==typeof ei&&(ei=t.createHTML(""));c&&c(e),te=e}},tr=C({},[...D,...x,...I]),ti=C({},[...M,...U]),ta=function(e){let t=er(e);t&&t.tagName||(t={namespaceURI:e0,tagName:"template"});let n=y(e.tagName),o=y(t.tagName);return!!e2[e.namespaceURI]&&(e.namespaceURI===eJ?t.namespaceURI===eQ?"svg"===n:t.namespaceURI===eZ?"svg"===n&&("annotation-xml"===o||e9[o]):!!tr[n]:e.namespaceURI===eZ?t.namespaceURI===eQ?"math"===n:t.namespaceURI===eJ?"math"===n&&e4[o]:!!ti[n]:e.namespaceURI===eQ?(t.namespaceURI!==eJ||!!e4[o])&&(t.namespaceURI!==eZ||!!e9[o])&&!ti[n]&&(e8[n]||!tr[n]):"application/xhtml+xml"===e7&&!!e2[e.namespaceURI])},tl=function(e){g(r.removed,{element:e});try{er(e).removeChild(e)}catch(t){Z(e)}},tc=function(e,t){try{g(r.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){g(r.removed,{attribute:null,from:t})}if(t.removeAttribute(e),"is"===e){if(ez||eP)try{tl(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}}},ts=function(e){let n=null,o=null;if(eU)e="<remove></remove>"+e;else{let t=_(e,/^[\r\n\t ]+/);o=t&&t[0]}"application/xhtml+xml"===e7&&e0===eQ&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");let r=t?t.createHTML(e):e;if(e0===eQ)try{n=new j().parseFromString(r,e7)}catch(e){}if(!n||!n.documentElement){n=ea.createDocument(e0,"template",null);try{n.documentElement.innerHTML=e1?ei:r}catch(e){}}let a=n.body||n.documentElement;return(e&&o&&a.insertBefore(i.createTextNode(o),a.childNodes[0]||null),e0===eQ)?es.call(n,eI?"html":"body")[0]:eI?n.documentElement:a},tu=function(e){return el.call(e.ownerDocument||e,e,G.SHOW_ELEMENT|G.SHOW_COMMENT|G.SHOW_TEXT|G.SHOW_PROCESSING_INSTRUCTION|G.SHOW_CDATA_SECTION,null)},tm=function(e){return e instanceof Y&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||!(e.attributes instanceof B)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes)},tp=function(e){return"function"==typeof p&&e instanceof p};function tf(e,t,n){f(e,e=>{e.call(r,t,n,te)})}let td=function(e){let t=null;if(tf(em.beforeSanitizeElements,e,null),tm(e))return tl(e),!0;let n=e6(e.nodeName);if(tf(em.uponSanitizeElement,e,{tagName:n,allowedTags:eA}),e.hasChildNodes()&&!tp(e.firstElementChild)&&w(/<[/\w]/g,e.innerHTML)&&w(/<[/\w]/g,e.textContent)||e.nodeType===Q.progressingInstruction||ex&&e.nodeType===Q.comment&&w(/<[/\w]/g,e.data))return tl(e),!0;if(!eA[n]||ev[n]){if(!ev[n]&&tg(n)&&(ew.tagNameCheck instanceof RegExp&&w(ew.tagNameCheck,n)||ew.tagNameCheck instanceof Function&&ew.tagNameCheck(n)))return!1;if(eG&&!ej[n]){let t=er(e)||e.parentNode,n=eo(e)||e.childNodes;if(n&&t){let o=n.length;for(let r=o-1;r>=0;--r){let o=K(n[r],!0);o.__removalCount=(e.__removalCount||0)+1,t.insertBefore(o,en(e))}}}return tl(e),!0}return e instanceof R&&!ta(e)||("noscript"===n||"noembed"===n||"noframes"===n)&&w(/<\/no(script|embed|frames)/i,e.innerHTML)?(tl(e),!0):(eD&&e.nodeType===Q.text&&(t=e.textContent,f([ep,ef,ed],e=>{t=A(t,e," ")}),e.textContent!==t&&(g(r.removed,{element:e.cloneNode()}),e.textContent=t)),tf(em.afterSanitizeElements,e,null),!1)},th=function(e,t,n){if(eF&&("id"===t||"name"===t)&&(n in i||n in tt))return!1;if(eL&&!eR[t]&&w(eh,t));else if(eC&&w(eg,t));else if(!eN[t]||eR[t]){if(!(tg(e)&&(ew.tagNameCheck instanceof RegExp&&w(ew.tagNameCheck,e)||ew.tagNameCheck instanceof Function&&ew.tagNameCheck(e))&&(ew.attributeNameCheck instanceof RegExp&&w(ew.attributeNameCheck,t)||ew.attributeNameCheck instanceof Function&&ew.attributeNameCheck(t))||"is"===t&&ew.allowCustomizedBuiltInElements&&(ew.tagNameCheck instanceof RegExp&&w(ew.tagNameCheck,n)||ew.tagNameCheck instanceof Function&&ew.tagNameCheck(n))))return!1}else if(eK[t]);else if(w(e_,A(n,ey,"")));else if(("src"===t||"xlink:href"===t||"href"===t)&&"script"!==e&&0===b(n,"data:")&&eX[e]);else if(eO&&!w(eT,A(n,ey,"")));else if(n)return!1;return!0},tg=function(e){return"annotation-xml"!==e&&_(e,eE)},tT=function(e){tf(em.beforeSanitizeAttributes,e,null);let{attributes:n}=e;if(!n||tm(e))return;let o={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:eN,forceKeepAttr:void 0},i=n.length;for(;i--;){let{name:a,namespaceURI:l,value:c}=n[i],s=e6(a),u="value"===a?c:N(c);if(o.attrName=s,o.attrValue=u,o.keepAttr=!0,o.forceKeepAttr=void 0,tf(em.uponSanitizeAttribute,e,o),u=o.attrValue,eW&&("id"===s||"name"===s)&&(tc(a,e),u="user-content-"+u),ex&&w(/((--!?|])>)|<\/(style|title)/i,u)){tc(a,e);continue}if(o.forceKeepAttr||(tc(a,e),!o.keepAttr))continue;if(!ek&&w(/\/>/i,u)){tc(a,e);continue}eD&&f([ep,ef,ed],e=>{u=A(u,e," ")});let m=e6(e.nodeName);if(th(m,s,u)){if(t&&"object"==typeof q&&"function"==typeof q.getAttributeType){if(l);else switch(q.getAttributeType(m,s)){case"TrustedHTML":u=t.createHTML(u);break;case"TrustedScriptURL":u=t.createScriptURL(u)}}try{l?e.setAttributeNS(l,a,u):e.setAttribute(a,u),tm(e)?tl(e):h(r.removed)}catch(e){}}}tf(em.afterSanitizeAttributes,e,null)},ty=function e(t){let n=null,o=tu(t);for(tf(em.beforeSanitizeShadowDOM,t,null);n=o.nextNode();)tf(em.uponSanitizeShadowNode,n,null),td(n),tT(n),n.content instanceof s&&e(n.content);tf(em.afterSanitizeShadowDOM,t,null)};return r.sanitize=function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=null,i=null,l=null,c=null;if((e1=!e)&&(e="<!-->"),"string"!=typeof e&&!tp(e)){if("function"==typeof e.toString){if("string"!=typeof(e=e.toString()))throw v("dirty is not a string, aborting")}else throw v("toString is not a function")}if(!r.isSupported)return e;if(eM||to(n),r.removed=[],"string"==typeof e&&(eB=!1),eB){if(e.nodeName){let t=e6(e.nodeName);if(!eA[t]||ev[t])throw v("root node is forbidden and cannot be sanitized in-place")}}else if(e instanceof p)(i=(o=ts("<!---->")).ownerDocument.importNode(e,!0)).nodeType===Q.element&&"BODY"===i.nodeName?o=i:"HTML"===i.nodeName?o=i:o.appendChild(i);else{if(!ez&&!eD&&!eI&&-1===e.indexOf("<"))return t&&eH?t.createHTML(e):e;if(!(o=ts(e)))return ez?null:eH?ei:""}o&&eU&&tl(o.firstChild);let u=tu(eB?e:o);for(;l=u.nextNode();)td(l),tT(l),l.content instanceof s&&ty(l.content);if(eB)return e;if(ez){if(eP)for(c=ec.call(o.ownerDocument);o.firstChild;)c.appendChild(o.firstChild);else c=o;return(eN.shadowroot||eN.shadowrootmode)&&(c=eu.call(a,c,!0)),c}let m=eI?o.outerHTML:o.innerHTML;return eI&&eA["!doctype"]&&o.ownerDocument&&o.ownerDocument.doctype&&o.ownerDocument.doctype.name&&w(V,o.ownerDocument.doctype.name)&&(m="<!DOCTYPE "+o.ownerDocument.doctype.name+">\n"+m),eD&&f([ep,ef,ed],e=>{m=A(m,e," ")}),t&&eH?t.createHTML(m):m},r.setConfig=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};to(e),eM=!0},r.clearConfig=function(){te=null,eM=!1},r.isValidAttribute=function(e,t,n){return te||to({}),th(e6(e),e6(t),n)},r.addHook=function(e,t){"function"==typeof t&&g(em[e],t)},r.removeHook=function(e,t){if(void 0!==t){let n=d(em[e],t);return -1===n?void 0:T(em[e],n,1)[0]}return h(em[e])},r.removeHooks=function(e){em[e]=[]},r.removeAllHooks=function(){em=et()},r}()}}]);