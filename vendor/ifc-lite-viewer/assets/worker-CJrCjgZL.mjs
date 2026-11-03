async function Module(moduleArg={}){var Module=moduleArg;var ENVIRONMENT_IS_WEB=!!globalThis.window;var ENVIRONMENT_IS_WORKER=!!globalThis.WorkerGlobalScope;var ENVIRONMENT_IS_NODE=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer";if(ENVIRONMENT_IS_NODE){const{createRequire}=await import('node:module');var require=createRequire(import.meta.url);}var _scriptName=import.meta.url;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("node:fs");if(_scriptName.startsWith("file:")){scriptDirectory=require("node:path").dirname(require("node:url").fileURLToPath(_scriptName))+"/";}readBinary=filename=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename);return ret};readAsync=async(filename,binary=true)=>{filename=isFileURI(filename)?new URL(filename):filename;var ret=fs.readFileSync(filename,binary?undefined:"utf8");return ret};if(process.argv.length>1){process.argv[1].replace(/\\/g,"/");}process.argv.slice(2);}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){try{scriptDirectory=new URL(".",_scriptName).href;}catch{}{if(ENVIRONMENT_IS_WORKER){readBinary=url=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)};}readAsync=async url=>{var response=await fetch(url,{credentials:"same-origin"});if(response.ok){return response.arrayBuffer()}throw new Error(response.status+" : "+response.url)};}}else;console.log.bind(console);var err=console.error.bind(console);var wasmBinary;var ABORT=false;var isFileURI=filename=>filename.startsWith("file://");function updateMemoryViews(){var b=wasmMemory.buffer;HEAP8=new Int8Array(b);new Int16Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);new Uint16Array(b);new Int32Array(b);Module["HEAPU32"]=new Uint32Array(b);new Float32Array(b);new Float64Array(b);new BigInt64Array(b);new BigUint64Array(b);}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(onPreRuns);}function initRuntime(){wasmExports["c"]();}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(onPostRuns);}function abort(what){Module["onAbort"]?.(what);what=`Aborted(${what})`;err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var wasmBinaryFile;function findWasmBinary(){if(Module["locateFile"]){return locateFile("webp.wasm")}return new URL("webp.wasm",import.meta.url).href}function getBinarySync(file){if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}throw "both async and sync fetching of the wasm failed"}async function getWasmBinary(binaryFile){if(!wasmBinary){try{var response=await readAsync(binaryFile);return new Uint8Array(response)}catch{}}return getBinarySync(binaryFile)}async function instantiateArrayBuffer(binaryFile,imports){try{var binary=await getWasmBinary(binaryFile);var instance=await WebAssembly.instantiate(binary,imports);return instance}catch(reason){err(`failed to asynchronously prepare wasm: ${reason}`);abort(reason);}}async function instantiateAsync(binary,binaryFile,imports){if(!binary&&!ENVIRONMENT_IS_NODE){try{var response=fetch(binaryFile,{credentials:"same-origin"});var instantiationResult=await WebAssembly.instantiateStreaming(response,imports);return instantiationResult}catch(reason){err(`wasm streaming compile failed: ${reason}`);err("falling back to ArrayBuffer instantiation");}}return instantiateArrayBuffer(binaryFile,imports)}function getWasmImports(){var imports={a:wasmImports};return imports}async function createWasm(){function receiveInstance(instance,module){wasmExports=instance.exports;assignWasmExports(wasmExports);updateMemoryViews();return wasmExports}function receiveInstantiationResult(result){return receiveInstance(result["instance"])}var info=getWasmImports();if(Module["instantiateWasm"]){return new Promise((resolve,reject)=>{Module["instantiateWasm"](info,(inst,mod)=>{resolve(receiveInstance(inst));});})}wasmBinaryFile??=findWasmBinary();var result=await instantiateAsync(wasmBinary,wasmBinaryFile,info);var exports=receiveInstantiationResult(result);return exports}var HEAP8;var HEAPU8;var callRuntimeCallbacks=callbacks=>{while(callbacks.length>0){callbacks.shift()(Module);}};var onPostRuns=[];var addOnPostRun=cb=>onPostRuns.push(cb);var onPreRuns=[];var addOnPreRun=cb=>onPreRuns.push(cb);var stackRestore=val=>__emscripten_stack_restore(val);var stackSave=()=>_emscripten_stack_get_current();var getHeapMax=()=>2147483648;var alignMemory=(size,alignment)=>Math.ceil(size/alignment)*alignment;var growMemory=size=>{var oldHeapSize=wasmMemory.buffer.byteLength;var pages=(size-oldHeapSize+65535)/65536|0;try{wasmMemory.grow(pages);updateMemoryViews();return 1}catch(e){}};var _emscripten_resize_heap=requestedSize=>{var oldSize=HEAPU8.length;requestedSize>>>=0;var maxHeapSize=getHeapMax();if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignMemory(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=growMemory(newSize);if(replacement){return true}}return false};var getCFunc=ident=>{var func=Module["_"+ident];return func};var writeArrayToMemory=(array,buffer)=>{HEAP8.set(array,buffer);};var lengthBytesUTF8=str=>{var len=0;for(var i=0;i<str.length;++i){var c=str.charCodeAt(i);if(c<=127){len++;}else if(c<=2047){len+=2;}else if(c>=55296&&c<=57343){len+=4;++i;}else {len+=3;}}return len};var stringToUTF8Array=(str,heap,outIdx,maxBytesToWrite)=>{if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.codePointAt(i);if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}else {if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;i++;}}heap[outIdx]=0;return outIdx-startIdx};var stringToUTF8=(str,outPtr,maxBytesToWrite)=>stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite);var stackAlloc=sz=>__emscripten_stack_alloc(sz);var stringToUTF8OnStack=str=>{var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8(str,ret,size);return ret};var UTF8Decoder=globalThis.TextDecoder&&new TextDecoder;var findStringEnd=(heapOrArray,idx,maxBytesToRead,ignoreNul)=>{var maxIdx=idx+maxBytesToRead;while(heapOrArray[idx]&&!(idx>=maxIdx))++idx;return idx};var UTF8ArrayToString=(heapOrArray,idx=0,maxBytesToRead,ignoreNul)=>{var endPtr=findStringEnd(heapOrArray,idx,maxBytesToRead);if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}return str};var UTF8ToString=(ptr,maxBytesToRead,ignoreNul)=>ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):"";var ccall=(ident,returnType,argTypes,args,opts)=>{var toC={string:str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){ret=stringToUTF8OnStack(str);}return ret},array:arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i]);}else {cArgs[i]=args[i];}}}var ret=func(...cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret};var cwrap=(ident,returnType,argTypes,opts)=>{var numericArgs=!argTypes||argTypes.every(type=>type==="number"||type==="boolean");var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return (...args)=>ccall(ident,returnType,argTypes,args)};{if(Module["noExitRuntime"])Module["noExitRuntime"];if(Module["print"])Module["print"];if(Module["printErr"])err=Module["printErr"];if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];if(Module["arguments"])Module["arguments"];if(Module["thisProgram"])Module["thisProgram"];if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].shift()();}}}Module["cwrap"]=cwrap;var __emscripten_stack_restore,__emscripten_stack_alloc,_emscripten_stack_get_current,wasmMemory;function assignWasmExports(wasmExports){Module["_webp_encode_rgba"]=wasmExports["d"];Module["_webp_encode_lossless_rgba"]=wasmExports["e"];Module["_webp_encode_lossless_rgba_level"]=wasmExports["f"];Module["_webp_decode_rgba"]=wasmExports["g"];Module["_webp_free"]=wasmExports["h"];Module["_malloc"]=wasmExports["i"];Module["_free"]=wasmExports["j"];__emscripten_stack_restore=wasmExports["k"];__emscripten_stack_alloc=wasmExports["l"];_emscripten_stack_get_current=wasmExports["m"];wasmMemory=wasmExports["b"];wasmExports["__indirect_function_table"];}var wasmImports={a:_emscripten_resize_heap};async function run(){preRun();var setStatus=Module["setStatus"];if(setStatus){setStatus("Running...");await new Promise(resolve=>setTimeout(resolve,1));setTimeout(setStatus,1,"");}if(ABORT)return;initRuntime();Module["onRuntimeInitialized"]?.();postRun();}var wasmExports;wasmExports=await createWasm();await run();
return Module}

class WebPCodec {
    /**
     * URL to the webp.wasm file. Set this before any SOG read/write operations
     * in browser environments where the default path resolution doesn't work.
     * Must be set before the first `create()` call: the compiled module is
     * cached, so later changes have no effect.
     *
     * @example
     * import { WebPCodec } from '@playcanvas/splat-transform';
     * import wasmUrl from '@playcanvas/splat-transform/lib/webp.wasm?url';
     * WebPCodec.wasmUrl = wasmUrl;
     */
    static wasmUrl = null;
    static modulePromise = null;
    Module;
    /**
     * The effective webp.wasm location to hand to worker threads (which can't
     * resolve it from their own module URL). Returns `wasmUrl` verbatim when
     * set - exactly the value `locateFile` uses, so a Windows file path or a
     * URL both pass through unchanged - otherwise the default resolution
     * relative to this module.
     *
     * @returns The configured `wasmUrl`, or the default webp.wasm URL.
     * @ignore
     */
    static resolveWasmUrl() {
        return WebPCodec.wasmUrl ?? new URL('../lib/webp.wasm', import.meta.url).toString();
    }
    static async create() {
        // Compile/instantiate the wasm module once and share it across all
        // instances; per-call instantiation pays a fresh Emscripten heap each
        // time (readers like readLcc2 call create() once per chunk). Memoize
        // the promise so concurrent first calls share a single instantiation,
        // but reset on rejection so a failed load (e.g. wasmUrl set late in a
        // browser) can be retried.
        if (!WebPCodec.modulePromise) {
            const promise = Module({
                locateFile: (path) => {
                    if (path.endsWith('.wasm') && WebPCodec.wasmUrl) {
                        return WebPCodec.wasmUrl;
                    }
                    return new URL(`../lib/${path}`, import.meta.url).toString();
                }
            });
            promise.catch(() => {
                if (WebPCodec.modulePromise === promise) {
                    WebPCodec.modulePromise = null;
                }
            });
            WebPCodec.modulePromise = promise;
        }
        const instance = new WebPCodec();
        instance.Module = await WebPCodec.modulePromise;
        return instance;
    }
    /**
     * Encode RGBA pixels as a lossless WebP.
     *
     * @param rgba - Pixels, `height` rows of `stride` bytes.
     * @param width - Image width.
     * @param height - Image height.
     * @param stride - Row stride in bytes. Default: `width * 4`.
     * @param effort - Compression effort 0–9. Higher levels spend more time
     * trying to reduce file size. Omit to use the default libwebp lossless encoder.
     * Explicit levels also preserve RGB values in fully transparent pixels;
     * the default WebP encoder may discard those invisible values.
     * @returns The encoded WebP bytes.
     */
    encodeLosslessRGBA(rgba, width, height, stride = width * 4, effort) {
        const { Module } = this;
        if (effort !== undefined && (!Number.isInteger(effort) || effort < 0 || effort > 9)) {
            throw new Error(`WebP lossless effort must be an integer in [0, 9], got ${effort}`);
        }
        const inPtr = Module._malloc(rgba.length);
        const outPtrPtr = Module._malloc(4);
        const outSizePtr = Module._malloc(4);
        Module.HEAPU8.set(rgba, inPtr);
        const ok = effort === undefined
            ? Module._webp_encode_lossless_rgba(inPtr, width, height, stride, outPtrPtr, outSizePtr)
            : Module._webp_encode_lossless_rgba_level(inPtr, width, height, stride, effort, outPtrPtr, outSizePtr);
        if (!ok) {
            throw new Error('WebP lossless encode failed');
        }
        const outPtr = Module.HEAPU32[outPtrPtr >> 2];
        const outSize = Module.HEAPU32[outSizePtr >> 2];
        const bytes = Module.HEAPU8.slice(outPtr, outPtr + outSize);
        Module._webp_free(outPtr);
        Module._free(inPtr);
        Module._free(outPtrPtr);
        Module._free(outSizePtr);
        return bytes;
    }
    decodeRGBA(webp) {
        const { Module } = this;
        const input = webp;
        const inPtr = Module._malloc(input.length);
        const outPtrPtr = Module._malloc(4);
        const widthPtr = Module._malloc(4);
        const heightPtr = Module._malloc(4);
        Module.HEAPU8.set(input, inPtr);
        const ok = Module._webp_decode_rgba(inPtr, input.length, outPtrPtr, widthPtr, heightPtr);
        if (!ok) {
            Module._free(inPtr);
            Module._free(outPtrPtr);
            Module._free(widthPtr);
            Module._free(heightPtr);
            throw new Error('WebP decode failed');
        }
        const outPtr = Module.HEAPU32[outPtrPtr >> 2];
        const width = Module.HEAPU32[widthPtr >> 2];
        const height = Module.HEAPU32[heightPtr >> 2];
        const size = width * height * 4;
        const bytes = Module.HEAPU8.slice(outPtr, outPtr + size);
        Module._webp_free(outPtr);
        Module._free(inPtr);
        Module._free(outPtrPtr);
        Module._free(widthPtr);
        Module._free(heightPtr);
        return { rgba: bytes, width, height };
    }
}

/** Marks an unfilled neighbour slot (fewer than k non-self points available). */
const KNN_SENTINEL$1 = 0xffffffff;
/**
 * Exact k-nearest-neighbours of query points against a forest of flat KD
 * subtrees (each part's `nodeSplatIdx` holds GLOBAL splat ids; together the
 * parts cover the whole scene).
 *
 * The top-K state carries across parts: a part whose AABB is farther than
 * the carried worst is skipped outright (the near-path descent is otherwise
 * unconditional, so without this cull every part costs a full descent per
 * query); within a traversed part the standard "skip the far subtree" DFS
 * runs with the accumulated bound. The final top-K equals a single tree's
 * over the union — exact by construction, no halos, no verification.
 *
 * Engine-free (imported by worker tasks); mirrors the GpuKnn WGSL traversal.
 *
 * @param parts - The forest (global splat ids in `nodeSplatIdx`).
 * @param queryPos - Interleaved xyz query positions.
 * @param queryIds - Global splat id per query (self-exclusion).
 * @param count - Query count.
 * @param k - Neighbours per query.
 * @param out - Destination, `count * k` global ids (UNSORTED within a row),
 * {@link KNN_SENTINEL} filling surplus slots.
 */
const knnForestQuery = (parts, queryPos, queryIds, count, k, out) => {
    const topDist = new Float32Array(k);
    const topIdx = new Uint32Array(k);
    const stack = new Uint32Array(48);
    for (let q = 0; q < count; q++) {
        const qx = queryPos[q * 3];
        const qy = queryPos[q * 3 + 1];
        const qz = queryPos[q * 3 + 2];
        const qid = queryIds[q];
        topDist.fill(Infinity);
        topIdx.fill(KNN_SENTINEL$1);
        let worst = Infinity;
        let worstIdx = 0;
        for (const part of parts) {
            const { nodeSplatIdx, nodePositions, nodeChildren, aabb } = part;
            // Part-entry cull: skip when the AABB cannot improve the top-K.
            const ddx = Math.max(aabb[0] - qx, qx - aabb[3], 0);
            const ddy = Math.max(aabb[1] - qy, qy - aabb[4], 0);
            const ddz = Math.max(aabb[2] - qz, qz - aabb[5], 0);
            if (ddx * ddx + ddy * ddy + ddz * ddz >= worst)
                continue;
            // Stack packs axis (top 2 bits) with the node index, mirroring
            // the GPU kernel: axis cycles x→y→z with depth.
            let sp = 0;
            stack[sp++] = part.rootIdx;
            while (sp > 0) {
                const packed = stack[--sp];
                const nodeIdx = packed & 0x3fffffff;
                const axis = packed >>> 30;
                const np = nodeIdx * 3;
                const nx = nodePositions[np];
                const ny = nodePositions[np + 1];
                const nz = nodePositions[np + 2];
                const splatId = nodeSplatIdx[nodeIdx];
                if (splatId !== qid) {
                    const dx = nx - qx, dy = ny - qy, dz = nz - qz;
                    const d2 = dx * dx + dy * dy + dz * dz;
                    if (d2 < worst) {
                        topDist[worstIdx] = d2;
                        topIdx[worstIdx] = splatId;
                        let w = topDist[0];
                        let wi = 0;
                        for (let i = 1; i < k; i++) {
                            if (topDist[i] > w) {
                                w = topDist[i];
                                wi = i;
                            }
                        }
                        worst = w;
                        worstIdx = wi;
                    }
                }
                const qAxisVal = axis === 0 ? qx : axis === 1 ? qy : qz;
                const nAxisVal = axis === 0 ? nx : axis === 1 ? ny : nz;
                const delta = qAxisVal - nAxisVal;
                const nextAxis = axis + 1 >= 3 ? 0 : axis + 1;
                const nextAxisPacked = nextAxis << 30;
                const nc = nodeIdx * 2;
                const left = nodeChildren[nc];
                const right = nodeChildren[nc + 1];
                const near = delta < 0 ? left : right;
                const far = delta < 0 ? right : left;
                if (far !== KNN_SENTINEL$1 && delta * delta < worst) {
                    stack[sp++] = far | nextAxisPacked;
                }
                if (near !== KNN_SENTINEL$1) {
                    stack[sp++] = near | nextAxisPacked;
                }
            }
        }
        out.set(topIdx, q * k);
    }
};

/**
 * Merge/cost math for chunk-native decimation, generalized to n-ary groups.
 *
 * Engine-free: this module is imported by worker tasks, so it must not import
 * DataTable or playcanvas (see the note at the top of workers/tasks.ts).
 *
 * The n = 2 path of {@link mergeGroup} is arithmetic-identical to the legacy
 * `momentMatch` in the pre-3.0 `data-table/decimate.ts` (area·α weighted,
 * law-of-total-variance covariance, mass-conserving opacity capped at 1) —
 * enforced by test/moment-match.test.mjs against a verbatim reference copy.
 */
/** Covariance diagonal regularizer, matching legacy EPS_COV. */
const EPS_COV = 1e-8;
// ---------- sigmoid / logit ----------
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const logit = (p) => {
    p = Math.max(1e-7, Math.min(1 - 1e-7, p));
    return Math.log(p / (1 - p));
};
const quatToRotmat = (qw, qx, qy, qz, out, o) => {
    const xx = qx * qx, yy = qy * qy, zz = qz * qz;
    const wx = qw * qx, wy = qw * qy, wz = qw * qz;
    const xy = qx * qy, xz = qx * qz, yz = qy * qz;
    out[o] = 1 - 2 * (yy + zz);
    out[o + 1] = 2 * (xy - wz);
    out[o + 2] = 2 * (xz + wy);
    out[o + 3] = 2 * (xy + wz);
    out[o + 4] = 1 - 2 * (xx + zz);
    out[o + 5] = 2 * (yz - wx);
    out[o + 6] = 2 * (xz - wy);
    out[o + 7] = 2 * (yz + wx);
    out[o + 8] = 1 - 2 * (xx + yy);
};
const sigmaFromRotVar = (R, r, vx, vy, vz, out, o) => {
    const r00 = R[r], r01 = R[r + 1], r02 = R[r + 2];
    const r10 = R[r + 3], r11 = R[r + 4], r12 = R[r + 5];
    const r20 = R[r + 6], r21 = R[r + 7], r22 = R[r + 8];
    out[o] = r00 * r00 * vx + r01 * r01 * vy + r02 * r02 * vz;
    out[o + 1] = r00 * r10 * vx + r01 * r11 * vy + r02 * r12 * vz;
    out[o + 2] = r00 * r20 * vx + r01 * r21 * vy + r02 * r22 * vz;
    out[o + 3] = out[o + 1];
    out[o + 4] = r10 * r10 * vx + r11 * r11 * vy + r12 * r12 * vz;
    out[o + 5] = r10 * r20 * vx + r11 * r21 * vy + r12 * r22 * vz;
    out[o + 6] = out[o + 2];
    out[o + 7] = out[o + 5];
    out[o + 8] = r20 * r20 * vx + r21 * r21 * vy + r22 * r22 * vz;
};
const det3 = (A, o) => {
    return (A[o] * (A[o + 4] * A[o + 8] - A[o + 5] * A[o + 7]) -
        A[o + 1] * (A[o + 3] * A[o + 8] - A[o + 5] * A[o + 6]) +
        A[o + 2] * (A[o + 3] * A[o + 7] - A[o + 4] * A[o + 6]));
};
// Jacobi eigendecomposition for 3x3 symmetric matrix; caller-provided scratch,
// eigenvalues land on A's diagonal, eigenvectors in V's columns.
const eigenSymmetric3x3 = (Ain, A, V) => {
    A.set(Ain);
    V[0] = 1;
    V[1] = 0;
    V[2] = 0;
    V[3] = 0;
    V[4] = 1;
    V[5] = 0;
    V[6] = 0;
    V[7] = 0;
    V[8] = 1;
    for (let iter = 0; iter < 24; iter++) {
        let p = 0, q = 1;
        let maxAbs = Math.abs(A[1]);
        if (Math.abs(A[2]) > maxAbs) {
            p = 0;
            q = 2;
            maxAbs = Math.abs(A[2]);
        }
        if (Math.abs(A[5]) > maxAbs) {
            p = 1;
            q = 2;
            maxAbs = Math.abs(A[5]);
        }
        if (maxAbs < 1e-12)
            break;
        const pp = 3 * p + p, qq = 3 * q + q, pq = 3 * p + q;
        const app = A[pp], aqq = A[qq], apq = A[pq];
        const tau = (aqq - app) / (2 * apq);
        const t = Math.sign(tau) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;
        for (let k = 0; k < 3; k++) {
            if (k === p || k === q)
                continue;
            const kp = 3 * k + p, kq = 3 * k + q;
            const pk = 3 * p + k, qk = 3 * q + k;
            const akp = A[kp], akq = A[kq];
            A[kp] = c * akp - s * akq;
            A[pk] = A[kp];
            A[kq] = s * akp + c * akq;
            A[qk] = A[kq];
        }
        A[pp] = c * c * app - 2 * s * c * apq + s * s * aqq;
        A[qq] = s * s * app + 2 * s * c * apq + c * c * aqq;
        A[pq] = 0;
        A[3 * q + p] = 0;
        for (let k = 0; k < 3; k++) {
            const kp = 3 * k + p, kq = 3 * k + q;
            const vkp = V[kp], vkq = V[kq];
            V[kp] = c * vkp - s * vkq;
            V[kq] = s * vkp + c * vkq;
        }
    }
};
const rotmatToQuat = (R, o, out, oo) => {
    const m00 = R[o], m11 = R[o + 4], m22 = R[o + 8];
    const tr = m00 + m11 + m22;
    let qw, qx, qy, qz;
    if (tr > 0) {
        const S = Math.sqrt(tr + 1) * 2;
        qw = 0.25 * S;
        qx = (R[o + 7] - R[o + 5]) / S;
        qy = (R[o + 2] - R[o + 6]) / S;
        qz = (R[o + 3] - R[o + 1]) / S;
    }
    else if (R[o] > R[o + 4] && R[o] > R[o + 8]) {
        const S = Math.sqrt(1 + R[o] - R[o + 4] - R[o + 8]) * 2;
        qw = (R[o + 7] - R[o + 5]) / S;
        qx = 0.25 * S;
        qy = (R[o + 1] + R[o + 3]) / S;
        qz = (R[o + 2] + R[o + 6]) / S;
    }
    else if (R[o + 4] > R[o + 8]) {
        const S = Math.sqrt(1 + R[o + 4] - R[o] - R[o + 8]) * 2;
        qw = (R[o + 2] - R[o + 6]) / S;
        qx = (R[o + 1] + R[o + 3]) / S;
        qy = 0.25 * S;
        qz = (R[o + 5] + R[o + 7]) / S;
    }
    else {
        const S = Math.sqrt(1 + R[o + 8] - R[o] - R[o + 4]) * 2;
        qw = (R[o + 3] - R[o + 1]) / S;
        qx = (R[o + 2] + R[o + 6]) / S;
        qy = (R[o + 5] + R[o + 7]) / S;
        qz = 0.25 * S;
    }
    const n = Math.hypot(qw, qx, qy, qz);
    const inv = 1 / Math.max(n, 1e-12);
    out[oo] = qw * inv;
    out[oo + 1] = qx * inv;
    out[oo + 2] = qy * inv;
    out[oo + 3] = qz * inv;
};
// ---------- ellipsoid area (Knud Thomsen p=1.6075) ----------
const ELLIPSOID_P = 1.6075;
const ellipsoidArea = (sx, sy, sz) => {
    const a = Math.pow(sx * sy, ELLIPSOID_P);
    const b = Math.pow(sx * sz, ELLIPSOID_P);
    const c = Math.pow(sy * sz, ELLIPSOID_P);
    return 4 * Math.PI * Math.pow((a + b + c) / 3, 1 / ELLIPSOID_P);
};
const createMergeScratch = () => ({
    sigm: new Float64Array(9),
    sigI: new Float64Array(9),
    sigJ: new Float64Array(9),
    rI: new Float64Array(9),
    rJ: new Float64Array(9),
    sig: new Float64Array(9),
    rM: new Float64Array(9),
    eigA: new Float64Array(9),
    eigV: new Float64Array(9),
    weights: new Float64Array(8)
});
/**
 * Merge weight of one splat: area·α "ink" mass (+1e-30, the merge-path
 * epsilon; the cost-path cache uses +1e-12 — both match their legacy
 * counterparts exactly).
 * @param geo - Geometric-layer view (8 f32/splat).
 * @param i - Splat index.
 * @returns The merge weight.
 */
const splatMass = (geo, i) => {
    const i8 = i * 8;
    const sx = Math.max(Math.exp(geo[i8 + 4]), 1e-12);
    const sy = Math.max(Math.exp(geo[i8 + 5]), 1e-12);
    const sz = Math.max(Math.exp(geo[i8 + 6]), 1e-12);
    return sigmoid(geo[i8 + 7]) * ellipsoidArea(sx, sy, sz) + 1e-30;
};
/**
 * n-ary moment match: merge `count` splats into one Gaussian. Weights are
 * area·α; merged covariance is the weighted sum of (δδᵀ + Σₖ) (law of total
 * variance); opacity is mass-conserving capped at 1; color/SH is the weighted
 * average. For n = 2 this is arithmetic-identical to the legacy pairwise
 * `momentMatch`.
 *
 * @param view - Splat columns.
 * @param members - Indices of the splats to merge.
 * @param count - Number of members.
 * @param out - Output splat (geo encoded ready-to-store: quat, log scales, logit opacity).
 * @param scratch - Reusable scratch from {@link createMergeScratch}.
 */
const mergeGroup = (view, members, count, out, scratch) => {
    const { pos, geo, color, colorDim } = view;
    // Per-member normalized weights, computed once — splatMass is
    // transcendental-heavy and was previously re-evaluated per loop (and per
    // coefficient in the color loop); caching the identical values is
    // bit-exact.
    let weights = scratch.weights;
    if (count > weights.length) {
        weights = scratch.weights = new Float64Array(count);
    }
    let W = 0;
    for (let m = 0; m < count; m++) {
        const mass = splatMass(geo, members[m]);
        weights[m] = mass;
        W += mass;
    }
    for (let m = 0; m < count; m++)
        weights[m] /= W;
    // Merged mean (weighted).
    let mux = 0, muy = 0, muz = 0;
    for (let m = 0; m < count; m++) {
        const i = members[m];
        const p = weights[m];
        mux += p * pos[i * 3];
        muy += p * pos[i * 3 + 1];
        muz += p * pos[i * 3 + 2];
    }
    // Merged covariance: Σ pₖ (δₖδₖᵀ + Σₖ), accumulated member-by-member.
    const Sig = scratch.sig;
    Sig.fill(0);
    const SigI = scratch.sigI;
    const Ri = scratch.rI;
    for (let m = 0; m < count; m++) {
        const i = members[m];
        const i8 = i * 8;
        const p = weights[m];
        let qw = geo[i8], qx = geo[i8 + 1], qy = geo[i8 + 2], qz = geo[i8 + 3];
        const qn = 1 / Math.max(Math.hypot(qw, qx, qy, qz), 1e-12);
        qw *= qn;
        qx *= qn;
        qy *= qn;
        qz *= qn;
        const sx = Math.max(Math.exp(geo[i8 + 4]), 1e-12);
        const sy = Math.max(Math.exp(geo[i8 + 5]), 1e-12);
        const sz = Math.max(Math.exp(geo[i8 + 6]), 1e-12);
        quatToRotmat(qw, qx, qy, qz, Ri, 0);
        sigmaFromRotVar(Ri, 0, sx * sx, sy * sy, sz * sz, SigI, 0);
        const dx = pos[i * 3] - mux, dy = pos[i * 3 + 1] - muy, dz = pos[i * 3 + 2] - muz;
        Sig[0] += p * (dx * dx + SigI[0]);
        Sig[1] += p * (dx * dy + SigI[1]);
        Sig[2] += p * (dx * dz + SigI[2]);
        Sig[4] += p * (dy * dy + SigI[4]);
        Sig[5] += p * (dy * dz + SigI[5]);
        Sig[8] += p * (dz * dz + SigI[8]);
    }
    Sig[3] = Sig[1];
    Sig[6] = Sig[2];
    Sig[7] = Sig[5];
    Sig[0] += EPS_COV;
    Sig[4] += EPS_COV;
    Sig[8] += EPS_COV;
    // Eigendecompose → scales (√λ, descending) + right-handed rotation → quat.
    const eigA = scratch.eigA;
    const eigV = scratch.eigV;
    eigenSymmetric3x3(Sig, eigA, eigV);
    const vecs = eigV;
    const v0 = eigA[0], v1 = eigA[4], v2 = eigA[8];
    let o0, o1, o2;
    if (v0 >= v1) {
        if (v1 >= v2) {
            o0 = 0;
            o1 = 1;
            o2 = 2;
        }
        else if (v0 >= v2) {
            o0 = 0;
            o1 = 2;
            o2 = 1;
        }
        else {
            o0 = 2;
            o1 = 0;
            o2 = 1;
        }
    }
    else {
        if (v0 >= v2) {
            o0 = 1;
            o1 = 0;
            o2 = 2;
        }
        else if (v1 >= v2) {
            o0 = 1;
            o1 = 2;
            o2 = 0;
        }
        else {
            o0 = 2;
            o1 = 1;
            o2 = 0;
        }
    }
    const ev0 = Math.max(eigA[3 * o0 + o0], 1e-18);
    const ev1 = Math.max(eigA[3 * o1 + o1], 1e-18);
    const ev2 = Math.max(eigA[3 * o2 + o2], 1e-18);
    const s0 = Math.sqrt(ev0);
    const s1 = Math.sqrt(ev1);
    const s2 = Math.sqrt(ev2);
    // Mass-conserving opacity, capped at 1 (no scale inflation).
    const alphaM = Math.min(1, W / Math.max(ellipsoidArea(s0, s1, s2), 1e-30));
    const Rm = scratch.rM;
    Rm[0] = vecs[o0];
    Rm[1] = vecs[o1];
    Rm[2] = vecs[o2];
    Rm[3] = vecs[3 + o0];
    Rm[4] = vecs[3 + o1];
    Rm[5] = vecs[3 + o2];
    Rm[6] = vecs[6 + o0];
    Rm[7] = vecs[6 + o1];
    Rm[8] = vecs[6 + o2];
    if (det3(Rm, 0) < 0) {
        Rm[2] *= -1;
        Rm[5] *= -1;
        Rm[8] *= -1;
    }
    rotmatToQuat(Rm, 0, out.geo, 0);
    out.pos[0] = mux;
    out.pos[1] = muy;
    out.pos[2] = muz;
    out.geo[4] = Math.log(s0);
    out.geo[5] = Math.log(s1);
    out.geo[6] = Math.log(s2);
    out.geo[7] = logit(Math.max(0, Math.min(1, alphaM)));
    // Color: weight-normalized (area·α weighted) average.
    for (let c = 0; c < colorDim; c++) {
        let acc = 0;
        for (let m = 0; m < count; m++) {
            acc += weights[m] * color[members[m] * colorDim + c];
        }
        out.color[c] = acc;
    }
};

/**
 * KD-tree over raw column arrays: a pointer-node tree for CPU queries
 * (`KdTree`), and a direct-to-flat builder (`buildFlatKdTree`) emitting the
 * GPU traversal layout without intermediate node objects.
 *
 * Engine-free by contract: worker tasks build trees off-thread, and the
 * worker bundle inlines its whole import graph — an engine import here would
 * embed playcanvas into dist/worker.mjs (see the note atop workers/tasks.ts).
 *
 * `KdTree` dimensionality is the number of columns: 3 for spatial consumers,
 * arbitrary for k-means centroid assignment. `buildFlatKdTree` is 3D only.
 */
const nthElement = (arr, lo, hi, k, values) => {
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        const va = values[arr[lo]], vb = values[arr[mid]], vc = values[arr[hi]];
        let pivotIdx;
        if ((vb - va) * (vc - vb) >= 0)
            pivotIdx = mid;
        else if ((va - vb) * (vc - va) >= 0)
            pivotIdx = lo;
        else
            pivotIdx = hi;
        const pivotVal = values[arr[pivotIdx]];
        // 3-way (Dutch National Flag) partition around pivotVal:
        //   [lo..lt-1] < pivot, [lt..gt] == pivot, [gt+1..hi] > pivot.
        // The 2-way Lomuto partition this replaces moved only strictly-less
        // elements, so an all-equal range shrank by one per pass and degenerated
        // to O(N^2) — fatal for inputs where many points share a coordinate
        // (e.g. a splat with every gaussian at the origin).
        let lt = lo, gt = hi, i = lo;
        let tmp;
        while (i <= gt) {
            const v = values[arr[i]];
            if (v < pivotVal) {
                tmp = arr[i];
                arr[i] = arr[lt];
                arr[lt] = tmp;
                lt++;
                i++;
            }
            else if (v > pivotVal) {
                tmp = arr[i];
                arr[i] = arr[gt];
                arr[gt] = tmp;
                gt--;
            }
            else {
                i++;
            }
        }
        if (k < lt)
            hi = lt - 1;
        else if (k > gt)
            lo = gt + 1;
        else
            return; // k within the equal block; arr[k] is the order statistic
    }
};
/**
 * Build a 3D kd-tree directly into the flat GPU layout — no intermediate
 * pointer-node graph (which costs ~50-80 B/node of JS objects and GC
 * pressure, prohibitive at part-scale point counts).
 *
 * Same structure as `KdTree`'s build: median split via `nthElement`, axis
 * cycling x→y→z by depth, two-point ranges ordered so the smaller value is
 * the node and the larger its right child. Nodes are emitted in pre-order
 * DFS (left subtree before right), root at index 0. Recursion depth is
 * bounded by the median split (≈ log2 n).
 *
 * @param x - Point x column.
 * @param y - Point y column.
 * @param z - Point z column.
 * @returns The flat tree over all points.
 */
const buildFlatKdTree = (x, y, z) => {
    const n = x.length;
    const cols = [x, y, z];
    const indices = new Uint32Array(n);
    for (let i = 0; i < n; i++)
        indices[i] = i;
    const nodeSplatIdx = new Uint32Array(n);
    const nodePositions = new Float32Array(n * 3);
    const nodeChildren = new Uint32Array(n * 2).fill(0xffffffff);
    let cursor = 0;
    const emit = (splat) => {
        const t = cursor++;
        nodeSplatIdx[t] = splat;
        const t3 = t * 3;
        nodePositions[t3] = x[splat];
        nodePositions[t3 + 1] = y[splat];
        nodePositions[t3 + 2] = z[splat];
        return t;
    };
    const build = (lo, hi, depth) => {
        const count = hi - lo + 1;
        if (count === 1)
            return emit(indices[lo]);
        const values = cols[depth % 3];
        if (count === 2) {
            if (values[indices[lo]] > values[indices[hi]]) {
                const tmp = indices[lo];
                indices[lo] = indices[hi];
                indices[hi] = tmp;
            }
            const t = emit(indices[lo]);
            nodeChildren[t * 2 + 1] = emit(indices[hi]);
            return t;
        }
        const mid = lo + (count >> 1);
        nthElement(indices, lo, hi, mid, values);
        const t = emit(indices[mid]);
        nodeChildren[t * 2] = build(lo, mid - 1, depth + 1);
        nodeChildren[t * 2 + 1] = build(mid + 1, hi, depth + 1);
        return t;
    };
    if (n > 0)
        build(0, n - 1, 0);
    return { nodeSplatIdx, nodePositions, nodeChildren, rootIdx: 0 };
};
class KdTree {
    root;
    colData;
    numRows;
    constructor(colData) {
        const numCols = colData.length;
        const numRows = colData[0].length;
        const indices = new Uint32Array(numRows);
        for (let i = 0; i < indices.length; ++i) {
            indices[i] = i;
        }
        const build = (lo, hi, depth) => {
            const count = hi - lo + 1;
            if (count === 1) {
                return { index: indices[lo], count: 1 };
            }
            const values = colData[depth % numCols];
            if (count === 2) {
                if (values[indices[lo]] > values[indices[hi]]) {
                    const tmp = indices[lo];
                    indices[lo] = indices[hi];
                    indices[hi] = tmp;
                }
                return {
                    index: indices[lo],
                    count: 2,
                    right: { index: indices[hi], count: 1 }
                };
            }
            const mid = lo + (count >> 1);
            nthElement(indices, lo, hi, mid, values);
            const left = build(lo, mid - 1, depth + 1);
            const right = build(mid + 1, hi, depth + 1);
            return {
                index: indices[mid],
                count: 1 + left.count + right.count,
                left,
                right
            };
        };
        this.colData = colData;
        this.numRows = numRows;
        this.root = build(0, indices.length - 1, 0);
    }
    findNearest(point, filterFunc) {
        const colData = this.colData;
        const numCols = colData.length;
        let mind = Infinity;
        let mini = -1;
        let cnt = 0;
        const recurse = (node, axis) => {
            const distance = point[axis] - colData[axis][node.index];
            const next = distance > 0 ? node.right : node.left;
            const nextAxis = axis + 1 < numCols ? axis + 1 : 0;
            cnt++;
            if (next) {
                recurse(next, nextAxis);
            }
            if (!filterFunc || filterFunc(node.index)) {
                let thisd = 0;
                for (let c = 0; c < numCols; c++) {
                    const v = colData[c][node.index] - point[c];
                    thisd += v * v;
                }
                if (thisd < mind) {
                    mind = thisd;
                    mini = node.index;
                }
            }
            if (distance * distance < mind) {
                const other = next === node.right ? node.left : node.right;
                if (other) {
                    recurse(other, nextAxis);
                }
            }
        };
        recurse(this.root, 0);
        return { index: mini, distanceSqr: mind, cnt };
    }
    findKNearest(point, k, filterFunc) {
        if (k <= 0) {
            return { indices: new Int32Array(0), distances: new Float32Array(0) };
        }
        k = Math.min(k, this.numRows);
        const colData = this.colData;
        const numCols = colData.length;
        // Bounded max-heap: stores (distance, index) pairs sorted so the
        // farthest element is at position 0, enabling O(1) pruning bound.
        const heapDist = new Float32Array(k).fill(Infinity);
        const heapIdx = new Int32Array(k).fill(-1);
        let heapSize = 0;
        const heapPush = (dist, idx) => {
            if (heapSize < k) {
                let pos = heapSize++;
                heapDist[pos] = dist;
                heapIdx[pos] = idx;
                while (pos > 0) {
                    const parent = (pos - 1) >> 1;
                    if (heapDist[parent] < heapDist[pos]) {
                        const td = heapDist[parent];
                        heapDist[parent] = heapDist[pos];
                        heapDist[pos] = td;
                        const ti = heapIdx[parent];
                        heapIdx[parent] = heapIdx[pos];
                        heapIdx[pos] = ti;
                        pos = parent;
                    }
                    else {
                        break;
                    }
                }
            }
            else if (dist < heapDist[0]) {
                heapDist[0] = dist;
                heapIdx[0] = idx;
                let pos = 0;
                for (;;) {
                    const left = 2 * pos + 1;
                    const right = 2 * pos + 2;
                    let largest = pos;
                    if (left < k && heapDist[left] > heapDist[largest])
                        largest = left;
                    if (right < k && heapDist[right] > heapDist[largest])
                        largest = right;
                    if (largest === pos)
                        break;
                    const td = heapDist[pos];
                    heapDist[pos] = heapDist[largest];
                    heapDist[largest] = td;
                    const ti = heapIdx[pos];
                    heapIdx[pos] = heapIdx[largest];
                    heapIdx[largest] = ti;
                    pos = largest;
                }
            }
        };
        const recurse = (node, axis) => {
            const distance = point[axis] - colData[axis][node.index];
            const next = distance > 0 ? node.right : node.left;
            const nextAxis = axis + 1 < numCols ? axis + 1 : 0;
            if (next) {
                recurse(next, nextAxis);
            }
            if (!filterFunc || filterFunc(node.index)) {
                let thisd = 0;
                for (let c = 0; c < numCols; c++) {
                    const v = colData[c][node.index] - point[c];
                    thisd += v * v;
                }
                heapPush(thisd, node.index);
            }
            const bound = heapSize < k ? Infinity : heapDist[0];
            if (distance * distance < bound) {
                const other = next === node.right ? node.left : node.right;
                if (other) {
                    recurse(other, nextAxis);
                }
            }
        };
        recurse(this.root, 0);
        // Extract results sorted by distance (ascending)
        const resultIndices = new Int32Array(heapSize);
        const resultDist = new Float32Array(heapSize);
        for (let i = 0; i < heapSize; i++) {
            resultIndices[i] = heapIdx[i];
            resultDist[i] = heapDist[i];
        }
        // Simple insertion sort by distance (k is small)
        for (let i = 1; i < heapSize; i++) {
            const d = resultDist[i];
            const idx = resultIndices[i];
            let j = i - 1;
            while (j >= 0 && resultDist[j] > d) {
                resultDist[j + 1] = resultDist[j];
                resultIndices[j + 1] = resultIndices[j];
                j--;
            }
            resultDist[j + 1] = d;
            resultIndices[j + 1] = idx;
        }
        return { indices: resultIndices, distances: resultDist };
    }
}

/** Marks an unfilled neighbour slot (fewer than k non-self points available). */
const KNN_SENTINEL = 0xffffffff;
/**
 * Exact k-nearest-neighbours for the owned prefix of a local point set.
 *
 * Engine-free (imported by worker tasks). Builds a {@link KdTree} over
 * all `n` local points (owned first, then halo) and queries the first
 * `ownedCount`. Output `out[q * k + s]` is a LOCAL index into `positions`,
 * sorted ascending by distance, excluding the query itself, with
 * {@link KNN_SENTINEL} filling surplus slots — the same contract as the
 * legacy CPU KNN loop.
 *
 * @param positions - Interleaved xyz for all local points (owned + halo).
 * @param ownedCount - Number of owned points at the front; only these are queried.
 * @param k - Neighbours per query.
 * @returns Local neighbour indices, `ownedCount * k` long.
 */
const knnQueryBlock = (positions, ownedCount, k) => {
    const n = positions.length / 3;
    const x = new Float32Array(n);
    const y = new Float32Array(n);
    const z = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        x[i] = positions[i * 3];
        y[i] = positions[i * 3 + 1];
        z[i] = positions[i * 3 + 2];
    }
    const tree = new KdTree([x, y, z]);
    const out = new Uint32Array(ownedCount * k).fill(KNN_SENTINEL);
    const q = new Float32Array(3);
    for (let i = 0; i < ownedCount; i++) {
        q[0] = x[i];
        q[1] = y[i];
        q[2] = z[i];
        // Request k+1 because the tree returns the query itself (distance 0).
        const res = tree.findKNearest(q, k + 1);
        let outPos = 0;
        for (let m = 0; m < res.indices.length && outPos < k; m++) {
            const j = res.indices[m];
            if (j === i)
                continue;
            out[i * k + outPos] = j;
            outPos++;
        }
    }
    return out;
};

// The histogram + DP core over sorted finite values: returns up to kTarget
// centroids, sorted ascending.
const quantizeFinite = (sortedData, N, kTarget, alpha) => {
    const vMin = sortedData[0];
    const vMax = sortedData[N - 1];
    // build histogram using blended uniform/quantile bin positions
    const H = Math.min(1024, N);
    const vRange = vMax - vMin;
    // adaptive blend ratio: when outliers are extreme (IQR << range), lean
    // strongly toward quantile to give the dense center adequate bins; when
    // the distribution has moderate tails (IQR ~ range), reduce quantile
    // bias somewhat, but keep at least 50% quantile to preserve density
    const iqr = sortedData[Math.floor(N * 0.75)] - sortedData[Math.floor(N * 0.25)];
    const beta = Math.max(0.5, Math.min(0.999, 1 - iqr / vRange));
    const counts = new Float64Array(H);
    const sums = new Float64Array(H);
    for (let i = 0; i < N; ++i) {
        const uniformPos = (sortedData[i] - vMin) / vRange;
        const quantilePos = i / N;
        const bin = Math.min(H - 1, Math.floor(H * (beta * quantilePos + (1 - beta) * uniformPos)));
        counts[bin]++;
        sums[bin] += sortedData[i];
    }
    const centers = new Float64Array(H);
    for (let i = 0; i < H; ++i) {
        centers[i] = counts[i] > 0 ? sums[i] / counts[i] : vMin + ((i + 0.5) / H) * vRange;
    }
    // compute weights: w = count^alpha (sub-linear density weighting)
    const weights = new Float64Array(H);
    for (let i = 0; i < H; ++i) {
        weights[i] = counts[i] > 0 ? Math.pow(counts[i], alpha) : 0;
    }
    // prefix sums for O(1) range cost queries
    //   cost(a,b) = sum_wxx - sum_wx^2 / sum_w
    //   centroid(a,b) = sum_wx / sum_w
    const prefW = new Float64Array(H + 1);
    const prefWX = new Float64Array(H + 1);
    const prefWXX = new Float64Array(H + 1);
    for (let i = 0; i < H; ++i) {
        prefW[i + 1] = prefW[i] + weights[i];
        prefWX[i + 1] = prefWX[i] + weights[i] * centers[i];
        prefWXX[i + 1] = prefWXX[i] + weights[i] * centers[i] * centers[i];
    }
    const rangeCost = (a, b) => {
        const w = prefW[b + 1] - prefW[a];
        if (w <= 0)
            return 0;
        const wx = prefWX[b + 1] - prefWX[a];
        const wxx = prefWXX[b + 1] - prefWXX[a];
        return wxx - (wx * wx) / w;
    };
    const rangeMean = (a, b) => {
        const w = prefW[b + 1] - prefW[a];
        if (w <= 0)
            return (centers[a] + centers[b]) * 0.5;
        return (prefWX[b + 1] - prefWX[a]) / w;
    };
    const nonEmpty = counts.reduce((n, c) => n + (c > 0 ? 1 : 0), 0);
    const effectiveK = Math.min(kTarget, nonEmpty);
    // DP: dp[m][j] = min weighted SSE of quantizing bins 0..j into m centroids
    // Use two rows to save memory (only need previous row)
    const INF = 1e30;
    let dpPrev = new Float64Array(H).fill(INF);
    let dpCurr = new Float64Array(H).fill(INF);
    const splitTable = new Array(effectiveK + 1);
    // base case: m = 1
    const split1 = new Int32Array(H);
    for (let j = 0; j < H; ++j) {
        dpPrev[j] = rangeCost(0, j);
        split1[j] = -1;
    }
    splitTable[1] = split1;
    // fill DP for m = 2..effectiveK
    for (let m = 2; m <= effectiveK; ++m) {
        dpCurr.fill(INF);
        const splitM = new Int32Array(H);
        for (let j = m - 1; j < H; ++j) {
            let bestCost = INF;
            let bestS = m - 2;
            for (let s = m - 2; s < j; ++s) {
                const cost = dpPrev[s] + rangeCost(s + 1, j);
                if (cost < bestCost) {
                    bestCost = cost;
                    bestS = s;
                }
            }
            dpCurr[j] = bestCost;
            splitM[j] = bestS;
        }
        splitTable[m] = splitM;
        // swap rows
        const tmp = dpPrev;
        dpPrev = dpCurr;
        dpCurr = tmp;
    }
    // backtrack to find centroid values
    const centroidValues = new Float32Array(effectiveK);
    let j = H - 1;
    for (let m = effectiveK; m >= 1; --m) {
        const s = m > 1 ? splitTable[m][j] : -1;
        centroidValues[m - 1] = rangeMean(s + 1, j);
        j = s;
    }
    // sort centroids (should already be sorted, but ensure)
    centroidValues.sort();
    return centroidValues;
};
/**
 * Optimal 1D quantization using dynamic programming on a histogram.
 *
 * Pools all columns into a single 1D dataset, sorts the values, bins them
 * using a blend of uniform and quantile positioning, then uses DP to find k
 * centroids that minimize weighted sum-of-squared-errors (SSE).
 *
 * Bin positions are an adaptive blend of uniform (value-space) and
 * quantile (rank-space) positioning. The blend ratio is computed from
 * the data's IQR-to-range ratio: extreme outlier distributions (small
 * IQR relative to range) use near-pure quantile to give the dense
 * center adequate bins, while moderate-tail distributions reduce
 * quantile bias (but keep at least 50% quantile weighting).
 *
 * Bin weights use sub-linear density weighting: weight = count^alpha.
 * With alpha < 1, sparse tail regions earn meaningful influence on
 * centroid placement.
 *
 * Non-finite values: `±Infinity` is a valid pipeline value (`scale_*` may be
 * `-Infinity` for flat splats, `opacity` `+Infinity` — see `filterNaN`), but a
 * single one pooled into the histogram poisons vMin/vRange and NaN-cascades
 * into an all-NaN codebook (serialized as JSON nulls). So the histogram/DP
 * runs over the finite values only, and each infinity present earns a
 * dedicated end centroid at a finite sentinel 20 units outside the finite
 * range — JSON-safe, and far enough that log-scale consumers decode
 * exp(-20) ≈ 2e-9x the nearest finite value, i.e. effectively flat. NaN
 * contributes nothing to the codebook and labels arbitrarily (in range).
 *
 * @param columns - Named columns pooled into 1D.
 * @param k - Number of codebook entries (default 256).
 * @param alpha - Density weight exponent. 0 = uniform (each bin equal),
 * 0.5 = sqrt (balanced), 1.0 = standard MSE (dense regions dominate).
 * Default 0.5.
 * @returns Object with `centroids` (k Float32 values, sorted ascending) and
 * `labels` (same column layout as input, each holding Uint8Array indices
 * into the codebook).
 */
const quantize1dColumns = (columns, k = 256, alpha = 0.5) => {
    const numColumns = columns.length;
    const numRows = numColumns > 0 ? columns[0].data.length : 0;
    // pool all columns into a flat 1D array
    const N = numRows * numColumns;
    if (N === 0) {
        return {
            centroids: new Float32Array(k),
            labels: columns.map((c) => ({ name: c.name, data: new Uint8Array(numRows) }))
        };
    }
    const data = new Float32Array(N);
    for (let i = 0; i < numColumns; ++i) {
        data.set(columns[i].data, i * numRows);
    }
    // gather the finite values for histogram binning (keep original for label
    // assignment), noting any infinities for the reserved end slots
    const sortedData = new Float32Array(N);
    let numFinite = 0;
    let hasNegInf = false;
    let hasPosInf = false;
    for (let i = 0; i < N; ++i) {
        const v = data[i];
        if (isFinite(v)) {
            sortedData[numFinite++] = v;
        }
        else if (v === -Infinity) {
            hasNegInf = true;
        }
        else if (v === Infinity) {
            hasPosInf = true;
        }
    }
    const finite = sortedData.subarray(0, numFinite);
    finite.sort();
    const INF_MARGIN = 20;
    const loSlots = hasNegInf ? 1 : 0;
    const hiSlots = hasPosInf ? 1 : 0;
    const negInfCentroid = (numFinite > 0 ? finite[0] : 0) - INF_MARGIN;
    const posInfCentroid = (numFinite > 0 ? finite[numFinite - 1] : 0) + INF_MARGIN;
    const vMin = finite[0];
    const vMax = finite[numFinite - 1];
    // handle degenerate case where all values are identical
    if (loSlots === 0 && hiSlots === 0 && vMax - vMin < 1e-20) {
        const centroids = new Float32Array(k);
        centroids.fill(vMin);
        return {
            centroids,
            labels: columns.map((c) => ({ name: c.name, data: new Uint8Array(numRows) }))
        };
    }
    // centroid budget for the finite values (end slots reserved for infinities)
    const kFinite = Math.max(0, k - loSlots - hiSlots);
    let centroidValues;
    if (numFinite === 0 || kFinite === 0) {
        // no finite values at all (±Infinity/NaN-only input): sentinels only
        centroidValues = new Float32Array(0);
    }
    else if (vMax - vMin < 1e-20) {
        // all finite values identical, with infinities alongside (the all-finite
        // case returned above): a single centroid represents them
        centroidValues = Float32Array.of(vMin);
    }
    else {
        centroidValues = quantizeFinite(finite, numFinite, kFinite, alpha);
    }
    const effectiveK = centroidValues.length;
    // compose the final codebook, ascending: [-Inf sentinel][finite centroids,
    // padded with the last][+Inf sentinel]
    const finalCentroids = new Float32Array(k);
    finalCentroids.set(centroidValues, loSlots);
    const padValue = effectiveK > 0 ? centroidValues[effectiveK - 1] : hasNegInf ? negInfCentroid : posInfCentroid;
    for (let i = loSlots + effectiveK; i < k - hiSlots; ++i) {
        finalCentroids[i] = padValue;
    }
    if (loSlots) {
        finalCentroids[0] = negInfCentroid;
    }
    if (hiSlots) {
        finalCentroids[k - 1] = posInfCentroid;
    }
    // assign each data point to nearest centroid via binary search
    const labels = new Uint8Array(N);
    for (let i = 0; i < N; ++i) {
        const v = data[i];
        // binary search for nearest centroid
        let lo = 0;
        let hi = k - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            // compare against midpoint between centroids mid and mid+1
            if (v < (finalCentroids[mid] + finalCentroids[mid + 1]) * 0.5) {
                hi = mid;
            }
            else {
                lo = mid + 1;
            }
        }
        labels[i] = lo;
    }
    return {
        centroids: finalCentroids,
        labels: columns.map((c, i) => ({
            name: c.name,
            data: labels.slice(i * numRows, (i + 1) * numRows)
        }))
    };
};

const taskHandlers = {
    quantize1d: (args) => {
        const result = quantize1dColumns(args.columns, args.k, args.alpha);
        return {
            result,
            transfer: [
                result.centroids.buffer,
                ...result.labels.map((c) => c.data.buffer)
            ]
        };
    },
    encodeWebp: async (args) => {
        // create() memoizes the wasm module per realm (each worker compiles
        // its own copy on first use)
        const codec = await WebPCodec.create();
        const webp = codec.encodeLosslessRGBA(args.rgba, args.width, args.height, args.width * 4, args.effort);
        return { result: webp, transfer: [webp.buffer] };
    },
    // Build one forest part: a flat KD-tree over the part's position columns
    // whose node splat ids are remapped to GLOBAL ids, plus the part's point
    // AABB (the query-side part-entry cull). With `shared`, the flat arrays
    // move to SharedArrayBuffers so knnForest query tasks read them without
    // copies (structured clone shares SABs).
    buildKdForestPart: (args) => {
        const { x, y, z, ids } = args;
        const flat = buildFlatKdTree(x, y, z);
        const splatIdx = flat.nodeSplatIdx;
        for (let t = 0; t < splatIdx.length; t++)
            splatIdx[t] = ids[splatIdx[t]];
        const aabb = new Float32Array([Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]);
        for (let i = 0; i < x.length; i++) {
            if (x[i] < aabb[0])
                aabb[0] = x[i];
            if (y[i] < aabb[1])
                aabb[1] = y[i];
            if (z[i] < aabb[2])
                aabb[2] = z[i];
            if (x[i] > aabb[3])
                aabb[3] = x[i];
            if (y[i] > aabb[4])
                aabb[4] = y[i];
            if (z[i] > aabb[5])
                aabb[5] = z[i];
        }
        if (args.shared && typeof SharedArrayBuffer !== 'undefined') {
            const shareU32 = (a) => {
                const s = new Uint32Array(new SharedArrayBuffer(a.byteLength));
                s.set(a);
                return s;
            };
            const shareF32 = (a) => {
                const s = new Float32Array(new SharedArrayBuffer(a.byteLength));
                s.set(a);
                return s;
            };
            return {
                result: {
                    nodeSplatIdx: shareU32(flat.nodeSplatIdx),
                    nodePositions: shareF32(flat.nodePositions),
                    nodeChildren: shareU32(flat.nodeChildren),
                    rootIdx: flat.rootIdx,
                    aabb
                },
                transfer: []
            };
        }
        return {
            result: { ...flat, aabb },
            transfer: [
                flat.nodeSplatIdx.buffer,
                flat.nodePositions.buffer,
                flat.nodeChildren.buffer,
                aabb.buffer
            ]
        };
    },
    // Decimation CPU-fallback KNN: exact forest k-NN for a slice of queries,
    // as global ids. Part arrays are SAB-backed (shared, no copies).
    knnForest: (args) => {
        const count = args.queryIds.length;
        const out = new Uint32Array(count * args.k);
        knnForestQuery(args.parts, args.queryPos, args.queryIds, count, args.k, out);
        return { result: out, transfer: [out.buffer] };
    },
    // Build + flatten a KD-tree over interleaved LOCAL positions (the
    // `--decimate` GPU path: node splat ids stay local and the
    // flattened arrays upload straight into that path's GpuKnn). Serves
    // decimate-uniform/ — see its README before changing either handler.
    flattenKdTree: (args) => {
        const n = args.positions.length / 3;
        const x = new Float32Array(n);
        const y = new Float32Array(n);
        const z = new Float32Array(n);
        for (let i = 0; i < n; i++) {
            x[i] = args.positions[i * 3];
            y[i] = args.positions[i * 3 + 1];
            z[i] = args.positions[i * 3 + 2];
        }
        const flat = buildFlatKdTree(x, y, z);
        return {
            result: flat,
            transfer: [flat.nodeSplatIdx.buffer, flat.nodePositions.buffer, flat.nodeChildren.buffer]
        };
    },
    // `--decimate` CPU-fallback block KNN: exact k-NN of the owned
    // prefix within the local point set, as local indices. Frozen.
    knnBlock: (args) => {
        const result = knnQueryBlock(args.positions, args.ownedCount, args.k);
        return { result, transfer: [result.buffer] };
    },
    // Decimation merge stream: n-ary moment match of packed member-major
    // groups. Inputs are member-major (pos 3 / geo 8 / color colorDim floats
    // per member, groups back to back per `sizes`); outputs are group-major.
    // `other` columns (when present) copy from the dominant-mass member.
    mergeGroups: (args) => {
        const { sizes, colorDim } = args;
        const g = sizes.length;
        const otherDim = args.otherDim ?? 0;
        const view = { pos: args.pos, geo: args.geo, color: args.color, colorDim };
        const outPos = new Float32Array(g * 3);
        const outGeo = new Float32Array(g * 8);
        const outColor = new Float32Array(g * colorDim);
        const outOther = args.other && otherDim > 0 ? new Uint32Array(g * otherDim) : undefined;
        const merged = {
            pos: new Float64Array(3),
            geo: new Float64Array(8),
            color: new Float64Array(colorDim)
        };
        const scratch = createMergeScratch();
        const members = [];
        let base = 0;
        for (let gi = 0; gi < g; gi++) {
            const size = sizes[gi];
            members.length = size;
            for (let m = 0; m < size; m++)
                members[m] = base + m;
            mergeGroup(view, members, size, merged, scratch);
            outPos.set(merged.pos, gi * 3);
            outGeo.set(merged.geo, gi * 8);
            outColor.set(merged.color, gi * colorDim);
            if (outOther) {
                let dominant = base, best = -Infinity;
                for (let m = 0; m < size; m++) {
                    const mass = splatMass(args.geo, base + m);
                    if (mass > best) {
                        best = mass;
                        dominant = base + m;
                    }
                }
                for (let c = 0; c < otherDim; c++) {
                    outOther[gi * otherDim + c] = args.other[dominant * otherDim + c];
                }
            }
            base += size;
        }
        const transfer = [
            outPos.buffer,
            outGeo.buffer,
            outColor.buffer
        ];
        if (outOther)
            transfer.push(outOther.buffer);
        return { result: { pos: outPos, geo: outGeo, color: outColor, other: outOther }, transfer };
    }
};

/**
 * Worker-side entry point, built and shipped as `dist/worker.mjs` (see
 * rollup.config.mjs) and spawned by WorkerQueue from a URL. Runs one task at a
 * time and posts the result back with its buffers transferred.
 */
const bind = (post, listen) => {
    listen(async (message) => {
        if (message.type === 'init') {
            // resolved host-side and handed in, so the worker uses the same
            // wasm location as the host regardless of its own module URL
            WebPCodec.wasmUrl = message.wasmUrl;
            return;
        }
        try {
            const { result, transfer } = await taskHandlers[message.task](message.args);
            post({ type: 'result', result }, transfer);
        }
        catch (err) {
            post({
                type: 'error',
                message: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack : undefined
            }, []);
        }
    });
    // unprompted readiness signal: lets the host distinguish "environment
    // cannot run workers" (no ready, fall back inline) from a task crashing
    // a live worker
    post({ type: 'ready' }, []);
};
// same guard as WorkerQueue's isNode: a real worker_threads worker, not an
// Electron renderer (where process.versions.node is present but messaging goes
// through the Web Worker scope)
if (typeof process !== 'undefined' &&
    !!process.versions?.node &&
    process.type !== 'renderer') {
    // node MessagePorts buffer messages until a listener attaches, so the
    // host's init message survives this async import
    import('node:worker_threads').then(({ parentPort }) => {
        bind((message, transfer) => parentPort.postMessage(message, transfer), (handler) => parentPort.on('message', handler));
    });
}
else {
    // dom lib types globalThis as Window; the options form of postMessage is
    // valid on both Window and the dedicated worker scope
    bind((message, transfer) => globalThis.postMessage(message, { transfer }), (handler) => {
        globalThis.onmessage = (event) => handler(event.data);
    });
}
//# sourceMappingURL=worker.mjs.map
