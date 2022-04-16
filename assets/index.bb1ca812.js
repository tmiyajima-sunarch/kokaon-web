var x=Object.defineProperty,y=Object.defineProperties;var S=Object.getOwnPropertyDescriptors;var d=Object.getOwnPropertySymbols;var f=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var h=(u,e,r)=>e in u?x(u,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):u[e]=r,F=(u,e)=>{for(var r in e||(e={}))f.call(e,r)&&h(u,r,e[r]);if(d)for(var r of d(e))b.call(e,r)&&h(u,r,e[r]);return u},B=(u,e)=>y(u,S(e));var A=(u,e)=>{var r={};for(var o in u)f.call(u,o)&&e.indexOf(o)<0&&(r[o]=u[o]);if(u!=null&&d)for(var o of d(u))e.indexOf(o)<0&&b.call(u,o)&&(r[o]=u[o]);return r};import{r as i,j as c,a,q as R,s as v,t as w,u as I}from"./index.36e39575.js";import{F as T,a as j,I as H,b as q,c as L,u as O,d as $,e as N,f as P}from"./toast.1647e11e.js";import{u as W,M as _,a as z,b as G,c as J,d as K,e as Q,f as U}from"./index.esm.60198a8c.js";import{B as k}from"./chakra-ui-button.esm.97670fe3.js";function V(o){var s=o,{onSubmit:u,onClose:e}=s,r=A(s,["onSubmit","onClose"]);var E;const{handleSubmit:m,register:C,reset:t,formState:{errors:n,isSubmitting:l,isSubmitted:D}}=W(),g=i.exports.useCallback(async M=>{await u(M)},[u]),p=i.exports.useCallback(()=>{t(),e()},[e,t]);return c(_,B(F({},r),{onClose:p,children:[a(z,{}),c(G,{children:[a(J,{children:"\u30EB\u30FC\u30E0\u3092\u4F5C\u308B"}),a(K,{}),c("form",{onSubmit:m(g),children:[a(Q,{children:c(T,{isInvalid:n.name!==void 0,children:[a(j,{htmlFor:"input-room-name",children:"\u30EB\u30FC\u30E0\u306E\u540D\u524D"}),a(H,F({id:"input-room-name",autoFocus:!0,disabled:l},C("name",{required:"\u5FC5\u9808\u5165\u529B\u3067\u3059"}))),((E=n.name)==null?void 0:E.message)&&D?a(q,{children:n.name.message}):a(L,{children:"\u4F5C\u6210\u3059\u308B\u30EB\u30FC\u30E0\u306E\u540D\u524D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"})]})}),a(U,{children:c(R,{children:[a(k,{variant:"ghost",onClick:p,children:"\u30AD\u30E3\u30F3\u30BB\u30EB"}),a(k,{colorScheme:"blue",type:"submit",isLoading:l,children:"\u4F5C\u6210\u3059\u308B"})]})})]})]})]}))}function X(){const u=O();return i.exports.useCallback(async r=>{try{return await $(async()=>{const{roomId:o,passcode:s}=await u.createRoom(r.name);return{ok:!0,roomId:o,passcode:s}},{retries:4})}catch(o){return console.error(o),o instanceof v?{ok:!1,reason:"other-error"}:o instanceof w?{ok:!1,reason:"connection-error"}:{ok:!1,reason:"other-error"}}},[u])}function ou(){const u=I(),e=X(),r=i.exports.useCallback(()=>{u("/",{replace:!0})},[u]),o=N(),s=P(),m=i.exports.useCallback(async C=>{const t=await e(C);if(t.ok){const{roomId:n,passcode:l}=t;o({description:"\u30EB\u30FC\u30E0\u304C\u4F5C\u6210\u3055\u308C\u307E\u3057\u305F"}),u(`/enter?r=${n}&p=${l}`,{replace:!0})}else switch(t.reason){case"connection-error":s({description:"\u63A5\u7D9A\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3057\u3070\u3089\u304F\u7D4C\u3063\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002"});break;case"other-error":s({description:"\u4E0D\u660E\u306A\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u3057\u3070\u3089\u304F\u7D4C\u3063\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002"});break}},[e,o,u,s]);return a(V,{isOpen:!0,onClose:r,onSubmit:m})}export{ou as default};
