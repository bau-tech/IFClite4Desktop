function e(e,t){if(e===void 0)return t;if(typeof e!=`number`||!Number.isSafeInteger(e)||e<1)throw Error(`maxOutputTokens must be a positive safe integer`);return Math.min(e,t)}var t=8192,n=8192,r=32e3;function i(e,t=!1){if(e=t?e.replace(/\r\n?/g,`
`):e.replace(/\r\n/g,`
`).replace(/\r(?!$)/g,`
`),t){let t=e.trim();return{events:t?t.split(`

`).filter(Boolean):[],remainder:``}}let n=e.split(`

`);return{events:n.slice(0,-1).filter(Boolean),remainder:n.at(-1)??``}}async function a(e,t,n,r){let a=e.getReader(),o=()=>{a.cancel(t?.reason).catch(e=>console.debug(`[sse] cancellation failed`,e))};t?.aborted?o():t?.addEventListener(`abort`,o,{once:!0});let s=new TextDecoder,c=``,l=e=>{for(let t of e){let e=t.split(`
`).filter(e=>e.startsWith(`data:`)).map(e=>{let t=e.slice(5);return t.startsWith(` `)?t.slice(1):t}),r=e.join(`
`);if(e.length&&r!==`[DONE]`)try{n(r)}catch(e){console.debug(`[sse] skipped event`,e)}}};try{for(;;){let{done:e,value:n}=await a.read();if(t?.aborted)return!1;if(e)break;c+=s.decode(n,{stream:!0});let r=i(c);c=r.remainder,l(r.events)}return c+=s.decode(),l(i(c,!0).events),!0}catch(e){return t?.aborted||r(e instanceof Error?e:Error(String(e))),!1}finally{t?.removeEventListener(`abort`,o),a.releaseLock()}}function o(e){if(e)return e.length<4096?e:(typeof console<`u`&&console.debug&&console.debug(`[ext:prompt-cache] wrapping ${e.length}-char system prompt in ephemeral cache block`),[{type:`text`,text:e,cache_control:{type:`ephemeral`}}])}function s(e){if(!e)return;let t=e.cache_creation_input_tokens??0,n=e.cache_read_input_tokens??0;(t!==0||n!==0)&&typeof console<`u`&&console.debug&&console.debug(`[ext:prompt-cache] cache_read=${n} cache_creation=${t}`)}export{n as a,r as i,s as n,t as o,a as r,e as s,o as t};