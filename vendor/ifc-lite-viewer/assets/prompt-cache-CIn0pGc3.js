function e(e,t=!1){if(e=t?e.replace(/\r\n?/g,`
`):e.replace(/\r\n/g,`
`).replace(/\r(?!$)/g,`
`),t){let t=e.trim();return{events:t?t.split(`

`).filter(Boolean):[],remainder:``}}let n=e.split(`

`);return{events:n.slice(0,-1).filter(Boolean),remainder:n.at(-1)??``}}async function t(t,n,r,i){let a=t.getReader(),o=()=>{a.cancel(n?.reason).catch(e=>console.debug(`[sse] cancellation failed`,e))};n?.aborted?o():n?.addEventListener(`abort`,o,{once:!0});let s=new TextDecoder,c=``,l=e=>{for(let t of e){let e=t.split(`
`).filter(e=>e.startsWith(`data:`)).map(e=>{let t=e.slice(5);return t.startsWith(` `)?t.slice(1):t}),n=e.join(`
`);if(e.length&&n!==`[DONE]`)try{r(n)}catch(e){console.debug(`[sse] skipped event`,e)}}};try{for(;;){let{done:t,value:r}=await a.read();if(n?.aborted)return!1;if(t)break;c+=s.decode(r,{stream:!0});let i=e(c);c=i.remainder,l(i.events)}return c+=s.decode(),l(e(c,!0).events),!0}catch(e){return n?.aborted||i(e instanceof Error?e:Error(String(e))),!1}finally{n?.removeEventListener(`abort`,o),a.releaseLock()}}function n(e){if(e)return e.length<4096?e:(typeof console<`u`&&console.debug&&console.debug(`[ext:prompt-cache] wrapping ${e.length}-char system prompt in ephemeral cache block`),[{type:`text`,text:e,cache_control:{type:`ephemeral`}}])}function r(e){if(!e)return;let t=e.cache_creation_input_tokens??0,n=e.cache_read_input_tokens??0;(t!==0||n!==0)&&typeof console<`u`&&console.debug&&console.debug(`[ext:prompt-cache] cache_read=${n} cache_creation=${t}`)}export{r as n,t as r,n as t};