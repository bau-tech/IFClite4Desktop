import{Bo as e,Vo as t,zo as n,__tla as __tla_0}from"./exporters-CHnH0f59.js";import{xa as r,__tla as __tla_1}from"./sandbox-BWnpgIZ-.js";let yt,_,Ie,g,Hn,Le,Yn,gp,Vn,Xa,Pa,ja,Wr,Gr,hp,Q,aa,pp,Ou,Da,mp,to,Tp,Z,er,_t,Un,Gn;let __tla=Promise.all([(()=>{try{return __tla_0}catch{}})(),(()=>{try{return __tla_1}catch{}})()]).then(async()=>{var i=64;function a(t,r=t){if(!e.enabled)return t;s(t,r);let a=t.createBuffer.bind(t);t.createBuffer=e=>(n(`gpu.buffers`),n(`gpu.bufferBytes`,e.size),e.mappedAtCreation&&n(`gpu.mappedUploadBytes`,e.size),a(e));let o=t.queue,c=o.writeBuffer.bind(o);return o.writeBuffer=((e,t,r,a,o)=>{let s=ArrayBuffer.isView(r)&&`BYTES_PER_ELEMENT`in r?r.BYTES_PER_ELEMENT:1,l=r.byteLength-(a??0)*s,u=o===void 0?l:o*s;n((e.usage&i)===0?`gpu.writeBytes`:`gpu.uniformWriteBytes`,u),c(e,t,r,a,o)}),t}var o=new WeakMap;function s(e,t){let r=(o.get(t)??0)+1;o.set(t,r),n(`gpu.devices`),e.lost?.then(e=>{o.get(t)===r&&(e.reason??`unknown`)!==`destroyed`&&n(`gpu.deviceLost`)}),typeof e.addEventListener==`function`&&e.addEventListener(`uncapturederror`,()=>n(`gpu.uncapturedErrors`))}var c=class{adapter=null;device=null;context=null;format=`bgra8unorm`;canvas=null;lastWidth=0;lastHeight=0;contextConfigured=!1;frameCount=0;_uncapturedErrorCount=0;_lastUncapturedError=``;deviceLostHandler=null;deviceLostFired=!1;deviceLifetime=0;adapterInfoSnapshot=null;async init(e){let t=++this.deviceLifetime;if(this.deviceLostFired=!1,!navigator.gpu)throw Error(`WebGPU not available`);if(this.adapter=await navigator.gpu.requestAdapter(),!this.adapter)throw Error(`Failed to get GPU adapter`);this.adapterInfoSnapshot=null;try{let e=this.adapter.info;if(e){let t={};typeof e.vendor==`string`&&(t.vendor=e.vendor),typeof e.architecture==`string`&&(t.architecture=e.architecture),this.adapterInfoSnapshot=t}}catch(e){console.warn(`[WebGPU] adapter.info read threw; loss telemetry will omit adapter identity:`,e)}let n=this.adapter.limits,r={};n?.maxBufferSize&&(r.maxBufferSize=n.maxBufferSize),n?.maxStorageBufferBindingSize&&(r.maxStorageBufferBindingSize=n.maxStorageBufferBindingSize);let i=[];this.adapter.features?.has(`timestamp-query`)&&i.push(`timestamp-query`);let o=null;try{o=await this.adapter.requestDevice({requiredLimits:r,requiredFeatures:i})}catch(e){i.length>0&&console.warn(`[WebGPU] requestDevice() rejected the request carrying requiredFeatures; retrying with the buffer limits alone (GPU timestamp queries unavailable):`,e)}if(!o&&i.length>0)try{o=await this.adapter.requestDevice({requiredLimits:r})}catch(e){console.warn(`[WebGPU] requestDevice() also rejected the limits-only request:`,e)}if(o||=(console.warn(`[WebGPU] falling back to a default device with no required limits — a large model may exceed the default maxBufferSize and fail to render.`),await this.adapter.requestDevice()),this.device=a(o,this),this.format=navigator.gpu.getPreferredCanvasFormat(),this.canvas=e,this.context=e.getContext(`webgpu`),!this.context)throw Error(`Failed to get WebGPU context`);this.device.onuncapturederror=e=>{let t=e.error?.message??String(e);console.error(`[WebGPU] Uncaptured error:`,t),this._lastUncapturedError=t,this._uncapturedErrorCount++};let s=this.device;s.lost&&s.lost.then(e=>{if(t!==this.deviceLifetime)return;let n=e.reason??`unknown`;console.warn(`[WebGPU] Device lost:`,e.message,`(reason: ${n})`),this.contextConfigured=!1,n!==`destroyed`&&!this.deviceLostFired&&(this.deviceLostFired=!0,this.deviceLostHandler?.({message:e.message,reason:n}))}),this.configureContext()}configureContext(){if(this.context&&this.device&&this.canvas){this.lastWidth=this.canvas.width,this.lastHeight=this.canvas.height;try{this.context.configure({device:this.device,format:this.format,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC,alphaMode:`premultiplied`}),this.contextConfigured=!0}catch(e){console.warn(`[WebGPU] Failed to configure context:`,e),this.contextConfigured=!1}}}needsReconfigure(){return this.canvas?!this.contextConfigured||this.canvas.width!==this.lastWidth||this.canvas.height!==this.lastHeight:!1}invalidateContext(){this.contextConfigured=!1}ensureContext(){return!this.context||!this.device||!this.canvas?!1:(this.needsReconfigure()&&this.configureContext(),this.contextConfigured)}getCurrentTexture(){if(!this.context||!this.contextConfigured)return null;try{let e=this.context.getCurrentTexture();return this.frameCount++,e}catch{return this.contextConfigured=!1,null}}getDevice(){if(!this.device)throw Error(`Device not initialized`);return this.device}onDeviceLost(e){this.deviceLostHandler=e}getMaxTextureDimension(){return this.device?.limits?.maxTextureDimension2D??8192}getAdapterInfo(){return this.adapterInfoSnapshot}hasTimestampQueryFeature(){return this.device?.features?.has(`timestamp-query`)??!1}getContext(){if(!this.context)throw Error(`Context not initialized`);return this.context}getFormat(){return this.format}isInitialized(){return this.device!==null&&this.context!==null}destroy(){if(this.deviceLifetime++,this.device)try{this.device.destroy()}catch(e){console.warn(`[WebGPU] device.destroy() threw during teardown:`,e)}this.device=null,this.context=null,this.adapter=null,this.contextConfigured=!1}},l=`
        fn srgbToLinear(c: vec3<f32>) -> vec3<f32> {
          let lo = c / 12.92;
          let hi = pow((max(c, vec3<f32>(0.0)) + 0.055) / 1.055, vec3<f32>(2.4));
          return select(hi, lo, c <= vec3<f32>(0.04045));
        }

        fn linearToSrgb(c: vec3<f32>) -> vec3<f32> {
          let lo = c * 12.92;
          let hi = 1.055 * pow(max(c, vec3<f32>(0.0)), vec3<f32>(1.0 / 2.4)) - 0.055;
          return select(hi, lo, c <= vec3<f32>(0.0031308));
        }

        fn neutralCompress(cIn: vec3<f32>) -> vec3<f32> {
          let startCompression = 0.76;
          let desaturation = 0.15;
          let c = max(cIn, vec3<f32>(0.0));
          let peak = max(c.r, max(c.g, c.b));
          if (peak < startCompression) { return c; }
          let d = 1.0 - startCompression;
          let newPeak = 1.0 - d * d / (peak + d - startCompression);
          let g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
          return mix(c * (newPeak / peak), vec3<f32>(newPeak), g);
        }
`,u=`
        fn rtePosition(local: vec3<f32>) -> vec4<f32> {
          let linear = (uniforms.model * vec4<f32>(local, 0.0)).xyz;
          return rteWorldPosition(linear, RteDrawableUniform(
            uniforms.drawableDeltaHigh,
            uniforms.drawableDeltaLow,
          ));
        }
        fn rteInstancePosition(local: vec3<f32>, anchorHigh: vec3<f32>, anchorLow: vec3<f32>) -> vec4<f32> {
          return rteWorldPosition(local, RteDrawableUniform(
            vec4<f32>(anchorHigh, 0.0),
            vec4<f32>(anchorLow, 0.0),
          ));
        }`,d=`
        @binding(1) @group(1) var shadowMap: texture_depth_2d;
        @binding(2) @group(1) var shadowCmp: sampler_comparison;
        struct Shadow { lightViewProj: mat4x4<f32>, params: vec4<f32>, params2: vec4<f32>, }
        @binding(3) @group(1) var<uniform> shadowU: Shadow;
        const SHADOW_POISSON = array<vec2<f32>, 12>(
          vec2<f32>(-0.326, -0.406), vec2<f32>(-0.840, -0.074), vec2<f32>(-0.696,  0.457),
          vec2<f32>(-0.203,  0.621), vec2<f32>( 0.962, -0.195), vec2<f32>( 0.473, -0.480),
          vec2<f32>( 0.519,  0.767), vec2<f32>( 0.185, -0.893), vec2<f32>( 0.507,  0.064),
          vec2<f32>( 0.896,  0.412), vec2<f32>(-0.322, -0.933), vec2<f32>(-0.792, -0.598),
        );
        fn sunShadowFactor(eyePos: vec3<f32>, N: vec3<f32>, fragCoord: vec2<f32>) -> f32 {
          if (shadowU.params.y < 0.5) { return 1.0; }
          let L = normalize(env.sunDirection);
          let Ns = N * select(-1.0, 1.0, dot(N, L) >= 0.0);
          let biased = eyePos + Ns * shadowU.params.z;
          let clip = shadowU.lightViewProj * vec4<f32>(biased, 1.0);
          let ndc = clip.xyz / clip.w;
          let uv = vec2<f32>(ndc.x * 0.5 + 0.5, ndc.y * -0.5 + 0.5);
          let inBounds = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0 && ndc.z > 0.0;
          if (!inBounds) { return 1.0; }
          let NdotL = max(dot(Ns, L), 0.0);
          let slope = clamp(sqrt(max(1.0 - NdotL * NdotL, 0.0)) / max(NdotL, 0.1), 1.0, 12.0);
          let refDepth = ndc.z + shadowU.params2.x * slope * (1.0 + shadowU.params.w);
          let radius = shadowU.params.x * shadowU.params.w;
          let ign = fract(52.9829189 * fract(dot(fragCoord, vec2<f32>(0.06711056, 0.00583715))));
          let ang = ign * 6.2831853;
          let cr = cos(ang); let sr = sin(ang); var sum = 0.0;
          for (var i = 0; i < 12; i = i + 1) {
            let p = SHADOW_POISSON[i];
            let off = vec2<f32>(p.x * cr - p.y * sr, p.x * sr + p.y * cr) * radius;
            sum = sum + textureSampleCompareLevel(shadowMap, shadowCmp, uv + off, refDepth);
          }
          return mix(1.0, sum / 12.0, smoothstep(0.0, 0.3, NdotL));
        }`,f=1e-12;function p(e){return Number.isFinite(e)?e:0}var m=3402823466385289e23;function h(e){return e>m?m:e<-3402823466385289e23?-3402823466385289e23:e}g=function(e,t,n){let r=p(e.x),i=p(e.y),a=p(e.z),o=p(t.x),s=p(t.y),c=p(t.z),l=p(n.x),u=p(n.y),d=p(n.z),m=r-o,h=i-s,g=a-c,_=m*m+h*h+g*g;_>0&&_<1/0||(m=0,h=0,g=1,_=1);let v=1/Math.sqrt(_),y=m*v,b=h*v,x=g*v,S=u*x-d*b,C=d*y-l*x,w=l*b-u*y,T=S*S+C*C+w*w,E=l*l+u*u+d*d;if(!(T>f*E&&T<1/0)){let e=+(Math.abs(b)<.5),t=e===1?0:-1;S=e*x-t*b,C=t*y,w=-e*y,T=S*S+C*C+w*w}let D=1/Math.sqrt(T),O=S*D,k=C*D,A=w*D,j=b*A-x*k,M=x*O-y*A,N=y*k-b*O;return{eye:{x:r,y:i,z:a},right:{x:O,y:k,z:A},up:{x:j,y:M,z:N},forward:{x:-y,y:-b,z:-x}}};let v,y,b,x,S;_=class{static identity(){let e=new Float32Array(16);return e[0]=1,e[5]=1,e[10]=1,e[15]=1,{m:e}}static perspective(e,t,n,r){let i=1/Math.tan(e/2),a=1/(n-r),o=new Float32Array(16);return o[0]=i/t,o[5]=i,o[10]=(r+n)*a,o[11]=-1,o[14]=2*r*n*a,{m:o}}static orthographicReverseZ(e,t,n,r,i,a){let o=new Float32Array(16),s=1/(e-t),c=1/(n-r),l=1/(a-i);return o[0]=-2*s,o[5]=-2*c,o[10]=l,o[12]=(e+t)*s,o[13]=(r+n)*c,o[14]=a*l,o[15]=1,{m:o}}static perspectiveReverseZ(e,t,n,r){let i=1/Math.tan(e/2),a=new Float32Array(16);return a[0]=i/t,a[5]=i,a[10]=0,a[11]=-1,a[14]=n,{m:a}}static lookAt(e,t,n){let r=g(e,t,n),i=r.eye.x,a=r.eye.y,o=r.eye.z,s=r.right.x,c=r.right.y,l=r.right.z,u=r.up.x,d=r.up.y,f=r.up.z,p=-r.forward.x,m=-r.forward.y,_=-r.forward.z,v=new Float32Array(16);return v[0]=s,v[1]=u,v[2]=p,v[3]=0,v[4]=c,v[5]=d,v[6]=m,v[7]=0,v[8]=l,v[9]=f,v[10]=_,v[11]=0,v[12]=h(-(s*i+c*a+l*o)),v[13]=h(-(u*i+d*a+f*o)),v[14]=h(-(p*i+m*a+_*o)),v[15]=1,{m:v}}static multiply(e,t){let n=new Float32Array(16),r=e.m[0],i=e.m[1],a=e.m[2],o=e.m[3],s=e.m[4],c=e.m[5],l=e.m[6],u=e.m[7],d=e.m[8],f=e.m[9],p=e.m[10],m=e.m[11],h=e.m[12],g=e.m[13],_=e.m[14],v=e.m[15],y=t.m[0],b=t.m[1],x=t.m[2],S=t.m[3],C=t.m[4],w=t.m[5],T=t.m[6],E=t.m[7],D=t.m[8],O=t.m[9],k=t.m[10],A=t.m[11],j=t.m[12],M=t.m[13],N=t.m[14],P=t.m[15];return n[0]=y*r+b*s+x*d+S*h,n[1]=y*i+b*c+x*f+S*g,n[2]=y*a+b*l+x*p+S*_,n[3]=y*o+b*u+x*m+S*v,n[4]=C*r+w*s+T*d+E*h,n[5]=C*i+w*c+T*f+E*g,n[6]=C*a+w*l+T*p+E*_,n[7]=C*o+w*u+T*m+E*v,n[8]=D*r+O*s+k*d+A*h,n[9]=D*i+O*c+k*f+A*g,n[10]=D*a+O*l+k*p+A*_,n[11]=D*o+O*u+k*m+A*v,n[12]=j*r+M*s+N*d+P*h,n[13]=j*i+M*c+N*f+P*g,n[14]=j*a+M*l+N*p+P*_,n[15]=j*o+M*u+N*m+P*v,{m:n}}static invert(e){let t=e.m,n=new Float32Array(16),r=t[0],i=t[1],a=t[2],o=t[3],s=t[4],c=t[5],l=t[6],u=t[7],d=t[8],f=t[9],p=t[10],m=t[11],h=t[12],g=t[13],_=t[14],v=t[15],y=r*c-i*s,b=r*l-a*s,x=r*u-o*s,S=i*l-a*c,C=i*u-o*c,w=a*u-o*l,T=d*g-f*h,E=d*_-p*h,D=d*v-m*h,O=f*_-p*g,k=f*v-m*g,A=p*v-m*_,j=y*A-b*k+x*O+S*D-C*E+w*T;return j?(j=1/j,n[0]=(c*A-l*k+u*O)*j,n[1]=(a*k-i*A-o*O)*j,n[2]=(g*w-_*C+v*S)*j,n[3]=(p*C-f*w-m*S)*j,n[4]=(l*D-s*A-u*E)*j,n[5]=(r*A-a*D+o*E)*j,n[6]=(_*x-h*w-v*b)*j,n[7]=(d*w-p*x+m*b)*j,n[8]=(s*k-c*D+u*T)*j,n[9]=(i*D-r*k-o*T)*j,n[10]=(h*C-g*x+v*y)*j,n[11]=(f*x-d*C-m*y)*j,n[12]=(c*E-s*O-l*T)*j,n[13]=(r*O-i*E+a*T)*j,n[14]=(g*b-h*S-_*y)*j,n[15]=(d*S-f*b+p*y)*j,{m:n}):null}static transformPoint(e,t){let n=e.m[0]*t.x+e.m[4]*t.y+e.m[8]*t.z+e.m[12],r=e.m[1]*t.x+e.m[5]*t.y+e.m[9]*t.z+e.m[13],i=e.m[2]*t.x+e.m[6]*t.y+e.m[10]*t.z+e.m[14],a=e.m[3]*t.x+e.m[7]*t.y+e.m[11]*t.z+e.m[15];return{x:n/a,y:r/a,z:i/a}}static subtract(e,t){return{x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}}static normalize(e){let t=Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z);return Number.isFinite(t)&&t>1e-10?{x:e.x/t,y:e.y/t,z:e.z/t}:{x:0,y:0,z:0}}static dot(e,t){return e.x*t.x+e.y*t.y+e.z*t.z}static cross(e,t){return{x:e.y*t.z-e.z*t.y,y:e.z*t.x-e.x*t.z,z:e.x*t.y-e.y*t.x}}};v=`
struct RteFrameUniform {
  // Camera translation is intentionally absent. This projects positions
  // returned by rteWorldPosition, which are already relative to the eye.
  viewProj: mat4x4<f32>,
}

struct RteDrawableUniform {
  // CPU computes (drawable origin - camera origin) in f64 and splits it.
  // This data must be refreshed whenever the RTE camera frame changes.
  drawableDeltaHigh: vec4<f32>,
  drawableDeltaLow: vec4<f32>,
}

fn rteWorldPosition(
  local: vec3<f32>,
  drawable: RteDrawableUniform,
) -> vec4<f32> {
  // Do not subtract a camera origin here: this delta was formed in CPU f64.
  let highDelta = drawable.drawableDeltaHigh.xyz;
  let lowDelta = drawable.drawableDeltaLow.xyz;
  // A drawable template can span kilometres. Keep local with high first;
  // The local-plus-(high-plus-low) association is not equivalent in f32.
  return vec4<f32>((local + highDelta) + lowDelta, 1.0);
}
`;y={frame:[{name:`viewProj`,type:`mat4x4<f32>`,byteOffset:0,byteSize:64}],drawable:[{name:`drawableDeltaHigh`,type:`vec4<f32>`,byteOffset:0,byteSize:16},{name:`drawableDeltaLow`,type:`vec4<f32>`,byteOffset:16,byteSize:16}]};b=1e9;x=1e6;S=8192;function C(e){if(!Number.isFinite(e))throw RangeError(`RTE origins must be finite f64 coordinates; received ${e}.`);if(Math.abs(e)>1e9)throw RangeError(`RTE origin ${e} exceeds the supported \xb1${b} m source envelope.`);let t=Math.fround(e);if(!Number.isFinite(t))throw RangeError(`RTE origin ${e} exceeds the finite f32 GPU range.`);return[t,Math.fround(e-t)]}function w(e){for(let t=0;t<3;t++)C(e[t])}function T(e,t){for(let n=0;n<3;n++){let r=e[n]-t[n];if(!Number.isFinite(r)||Math.abs(r)>1e6)return n}return-1}function E(e,t,n,r){return w(e),w(t),T(e,t)>=0?!1:(O([e[0]-t[0],e[1]-t[1],e[2]-t[2]],n,r),!0)}function D(e,t,n,r){if(!E(e,t,n,r))throw RangeError(`RTE drawable origin exceeds the \xb1${x} m camera-relative envelope on axis ${T(e,t)}.`)}function O(e,t,n=0){if(t.length<n+8)throw RangeError(`RTE origin needs 8 floats at offset ${n}.`);for(let r=0;r<3;r++){let[i,a]=C(e[r]);t[n+r]=i,t[n+4+r]=a}t[n+3]=0,t[n+7]=0}function k(e,t){let n=new Float32Array(t.m);return n[12]=0,n[13]=0,n[14]=0,_.multiply(e,{m:n})}var A=class{cameraWorld=[0,0,0];viewProj=_.identity();renderEpoch=0;available=!0;invalidationEpoch=0;invalidate(){this.available=!1,this.renderEpoch++,this.invalidationEpoch++}isAvailable(){return this.available}getInvalidationEpoch(){return this.invalidationEpoch}requireAvailable(){if(!this.available)throw RangeError(`RTE camera frame is outside the supported envelope.`)}update(e,t,n){let r=[e.x,e.y,e.z];w(r);let i=k(t,n);if(!i.m.every(Number.isFinite))throw RangeError(`RTE matrix must be finite.`);this.cameraWorld=r,this.viewProj=i,this.available=!0,this.renderEpoch++}getCameraWorld(){return this.requireAvailable(),[...this.cameraWorld]}getViewProjection(){return this.requireAvailable(),{m:new Float32Array(this.viewProj.m)}}getRenderEpoch(){return this.renderEpoch}snapshot(){return this.requireAvailable(),new j(this.renderEpoch,this.cameraWorld,this.viewProj)}packUniforms(e,t=0){if(this.requireAvailable(),e.length<t+16)throw RangeError(`RTE frame needs 16 floats at offset ${t}.`);e.set(this.viewProj.m,t+y.frame[0].byteOffset/4)}packDrawableOrigin(e,t,n=0){this.requireAvailable(),D(e,this.cameraWorld,t,n)}tryPackDrawableOrigin(e,t,n=0){return this.requireAvailable(),E(e,this.cameraWorld,t,n)}worldToRelative(e){return this.requireAvailable(),[e[0]-this.cameraWorld[0],e[1]-this.cameraWorld[1],e[2]-this.cameraWorld[2]]}},j=class{renderEpoch;cameraWorld;viewProj;constructor(e,t,n){this.renderEpoch=e,this.cameraWorld=[...t],this.viewProj={m:new Float32Array(n.m)}}getCameraWorld(){return[...this.cameraWorld]}getViewProjection(){return{m:new Float32Array(this.viewProj.m)}}packDrawableOrigin(e,t,n=0){D(e,this.cameraWorld,t,n)}tryPackDrawableOrigin(e,t,n=0){return E(e,this.cameraWorld,t,n)}worldToRelative(e){return[e[0]-this.cameraWorld[0],e[1]-this.cameraWorld[1],e[2]-this.cameraWorld[2]]}};function M(e,t,n){return e-(n[0]*t[0]+n[1]*t[1]+n[2]*t[2])}function N(e,t,n,r){if(!e||e.enabled===!1)return n.fill(0,r,r+8),!1;for(let i=0;i<3;i++)n[r+i]=e.min[i]-t[i],n[r+4+i]=e.max[i]-t[i];return n[r+3]=0,n[r+7]=0,!0}var P=32*Float32Array.BYTES_PER_ELEMENT,F=new Float32Array(1),ee=new Uint32Array(F.buffer);function I(e,t,n){ee[0]=n,e[t]=F[0]}function te(e,t,n,r){let i=Math.min(e?.length??0,7);if(!e||i===0){n[r]=0,n[r+1]=0;return}I(n,r,i);let a=0;for(let o=0;o<i;o++){let i=e[o],s=r+4+o*4;n[s]=i.normal[0],n[s+1]=i.normal[1],n[s+2]=i.normal[2],n[s+3]=t?M(i.distance,i.normal,t):i.distance,i.flipped&&(a|=1<<o)}I(n,r+1,a)}var L=`
        struct ExtraClip {
          planeInfo: vec4<u32>,            // x = plane count, y = flipped bit mask
          planes: array<vec4<f32>, 7>, // xyz = normal, w = distance
        }

        // True when p is on the removed side of ANY extra plane.
        fn extraClipClipped(clip: ExtraClip, p: vec3<f32>) -> bool {
          for (var i = 0u; i < clip.planeInfo.x; i = i + 1u) {
            let side = select(1.0, -1.0, ((clip.planeInfo.y >> i) & 1u) == 1u);
            if ((dot(p, clip.planes[i].xyz) - clip.planes[i].w) * side > 0.0) { return true; }
          }
          return false;
        }
`;function R(e,t,n,r){if(!e)return!1;let i=Math.min(e.length,7);for(let a=0;a<i;a++){let i=e[a],o=i.flipped?-1:1;if((t*i.normal[0]+n*i.normal[1]+r*i.normal[2]-i.distance)*o>0)return!0}return!1}function z(e,t){let n=t.flipped?-1:1,[r,i,a]=t.normal,o=r*n>=0?e.min.x:e.max.x,s=i*n>=0?e.min.y:e.max.y,c=a*n>=0?e.min.z:e.max.z;return(o*r+s*i+c*a-t.distance)*n>0}function B(e,t,n,r,i){let a=[];e?.sectionPlane&&a.push(e.sectionPlane),e?.extraPlanes&&a.push(...e.extraPlanes.slice(0,7));for(let e of a){let a=e.flipped?-1:1,[o,s,c]=e.normal,l=(t.x*o+t.y*s+t.z*c-e.distance)*a,u=(n.x*o+n.y*s+n.z*c)*a;if(Math.abs(u)<1e-12){if(l>0)return null}else{let e=-l/u;if(u>0){if(r>e)return null;i>e&&(i=e)}else{if(i<e)return null;r<e&&(r=e)}}if(i<r)return null}return{tmin:r,tmax:i}}var ne=96,V=ne+32,re=V*Float32Array.BYTES_PER_ELEMENT,H={viewProj:0,model:16,baseColor:32,metallicRoughness:36,sectionPlane:40,flags:44,clipBoxMin:48,quantParams:56,rteViewProj:60,drawableDelta:76,rteCameraOrigin:84,overrideParams:92,extraClip:ne},U=65536,W=H.flags*Float32Array.BYTES_PER_ELEMENT;function ie(e,t){let n=H.sectionPlane;t[n]=e?.normal[0]??0,t[n+1]=e?.normal[1]??0,t[n+2]=e?.normal[2]??0,t[n+3]=e?.distance??0}function ae(e,t,n,r,i){if(r.length<V)throw RangeError(`Mesh RTE uniform needs ${V} floats.`);let a=e.getCameraWorld(),o=H.sectionPlane;if(t?.enabled){let[e,n,i]=t.normal;r[o]=e,r[o+1]=n,r[o+2]=i,r[o+3]=M(t.distance,t.normal,a)}else r.fill(0,o,o+4);let s=H.clipBoxMin;N(n,a,r,s),te(i,a,r,H.extraClip)}function oe(e,t){if(t.length<V)throw RangeError(`Mesh RTE uniform needs ${V} floats.`);O(e.getCameraWorld(),t,H.rteCameraOrigin)}var G=`
        ${L}
        struct Uniforms {
          viewProj: mat4x4<f32>,
          model: mat4x4<f32>,
          baseColor: vec4<f32>,
          metallicRoughness: vec2<f32>, // x = metallic, y = roughness (mesh-material.ts)
          transmission: vec2<f32>,      // x = 1: authored translucent, drawn as glass; y = pad
          sectionPlane: vec4<f32>,      // xyz = plane normal, w = plane distance
          flags: vec4<u32>,             // x = isSelected, y = section/clip bits; z, w unused (0) since #5746 dropped the derivative edges
          clipBoxMin: vec4<f32>,        // xyz = clip-box min corner (world), w = pad
          clipBoxMax: vec4<f32>,        // xyz = clip-box max corner (world), w = pad
          quantParams: vec4<f32>, // local min xyz, lattice step w
          rteViewProj: mat4x4<f32>, // appended frame; bit 16 selects it
          drawableDeltaHigh: vec4<f32>,
          drawableDeltaLow: vec4<f32>,
          rteCameraHigh: vec4<f32>,
          rteCameraLow: vec4<f32>,
          overrideParams: vec4<u32>, // x = draw's id anchor, y = OVERRIDE_* bits (entity-color-table.ts, #6076)
          extraClip: ExtraClip,      // cutting planes beyond sectionPlane (#7545); count 0 = none
        }
        @binding(0) @group(0) var<uniform> uniforms: Uniforms;
        const RTE_DRAWABLE_FLAG: u32 = ${U}u;

        // The fragment position the section/crop tests run in: camera-relative
        // for RTE drawables (the packer writes plane and box in that frame),
        // world space otherwise.
        fn clipSpacePos(worldPos: vec3<f32>, eyePos: vec3<f32>) -> vec3<f32> {
          return select(worldPos, eyePos, (uniforms.flags.x & RTE_DRAWABLE_FLAG) != 0u);
        }

        // True when p is cut away: ABOVE the section plane (flags.y bit 0 =
        // enabled, bit 1 = flipped), on the removed side of any extra plane
        // (extraClip, #7545) or OUTSIDE the clip box (bit 2).
        fn sectionClipped(p: vec3<f32>) -> bool {
          if ((uniforms.flags.y & 1u) == 1u) {
            let side = select(1.0, -1.0, (uniforms.flags.y & 2u) == 2u);
            if ((dot(p, uniforms.sectionPlane.xyz) - uniforms.sectionPlane.w) * side > 0.0) { return true; }
          }
          if (extraClipClipped(uniforms.extraClip, p)) { return true; }
          if ((uniforms.flags.y & 4u) != 0u) {
            if (any(p < uniforms.clipBoxMin.xyz) || any(p > uniforms.clipBoxMax.xyz)) { return true; }
          }
          return false;
        }
`,K=`
        const MIN_SPECULAR_ROUGHNESS: f32 = 0.045;
        const DIELECTRIC_F0: f32 = 0.04;
        const PI: f32 = 3.14159265;

        fn fresnelSchlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
          return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
        }

        fn distributionGGX(NdotH: f32, roughness: f32) -> f32 {
          let a = roughness * roughness;
          let a2 = a * a;
          let NdotH2 = NdotH * NdotH;
          let denomBase = (NdotH2 * (a2 - 1.0) + 1.0);
          return a2 / max(PI * denomBase * denomBase, 0.0000001);
        }

        fn geometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
          let r = (roughness + 1.0);
          let k = (r * r) / 8.0;
          return NdotV / max(NdotV * (1.0 - k) + k, 0.0000001);
        }

        fn geometrySmith(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
          return geometrySchlickGGX(NdotL, roughness) * geometrySchlickGGX(NdotV, roughness);
        }

        // Split-sum environment BRDF, analytic fit (Karis 2014).
        fn envBrdfApprox(F0: vec3<f32>, roughness: f32, NdotV: f32) -> vec3<f32> {
          let r = roughness * vec4<f32>(-1.0, -0.0275, -0.572, 0.022) + vec4<f32>(1.0, 0.0425, 1.04, -0.04);
          let a004 = min(r.x * r.x, exp2(-9.28 * NdotV)) * r.x + r.y;
          let ab = vec2<f32>(-1.04, 1.04) * a004 + r.zw;
          return F0 * ab.x + ab.y;
        }

        struct SurfaceSpecular {
          // Reflected light, in lightTerm units (unexposed, uncalibrated).
          light: vec3<f32>,
          // Directional albedo of the specular lobe for this view.
          reflectance: vec3<f32>,
        }

        // N and V are unit vectors; V points from the surface to the eye.
        // sunLight is the sun's diffuse-equivalent intensity: sunColor *
        // sunIntensity * sunShadow, exactly what scales the diffuse sun term.
        fn surfaceSpecular(
          N: vec3<f32>,
          V: vec3<f32>,
          albedo: vec3<f32>,
          metallic: f32,
          roughnessIn: f32,
          sunLight: vec3<f32>,
        ) -> SurfaceSpecular {
          var out: SurfaceSpecular;
          let NdotV = dot(N, V);
          // A face turned away from the eye is its back side: nothing it
          // reflects can reach the eye, and its diffuse keeps full weight.
          if (NdotV <= 0.0) {
            out.light = vec3<f32>(0.0);
            out.reflectance = vec3<f32>(0.0);
            return out;
          }
          let roughness = clamp(roughnessIn, MIN_SPECULAR_ROUGHNESS, 1.0);
          let F0 = mix(vec3<f32>(DIELECTRIC_F0), albedo, metallic);

          let L = env.sunDirection;
          let rawNdotL = dot(N, L);
          let NdotL = max(rawNdotL, 0.0);
          // A face the sun is behind (rawNdotL <= 0) contributes nothing to
          // the direct lobe anyway (NdotL clamps it to 0 below), but V + L
          // can be exactly zero there — the sun exactly opposite the eye
          // reflection, e.g. N = V = (0,-1,0), sun = (0,1,0), both satisfy
          // NdotV > 0 above. normalize(vec3(0)) is NaN in WGSL, and NaN * 0
          // is NaN, not 0, so it would poison sun and everything summed with
          // it instead of being multiplied away. Skip the half-vector
          // entirely in that case rather than relying on the NdotL factor.
          var sun = vec3<f32>(0.0);
          if (rawNdotL > 0.0) {
            let H = normalize(V + L);
            let D = distributionGGX(max(dot(N, H), 0.0), roughness);
            let G = geometrySmith(NdotV, NdotL, roughness);
            let F = fresnelSchlick(max(dot(V, H), 0.0), F0);
            // BRDF * NdotL * (pi * intensity); the NdotL cancels the BRDF's.
            sun = F * (D * G * PI / (4.0 * NdotV)) * sunLight;
          }

          // The hemisphere ambient, looked up along the reflection. A rough
          // lobe gathers from around the normal, so lean the lookup toward N.
          let R = reflect(-V, N);
          let Rd = normalize(mix(R, N, roughness * roughness));
          let sky = mix(env.groundColor, env.skyColor, Rd.y * 0.5 + 0.5) * env.ambientIntensity;
          let reflectance = envBrdfApprox(F0, roughness, NdotV);

          out.light = sun + sky * reflectance;
          out.reflectance = reflectance;
          return out;
        }
`,se=0xffffffff,q=16,ce=20,le=0x1000000,ue=0x8000000;function de(e){let t=e>>>0;return t^=t>>>16,t=Math.imul(t,0x85ebca6b)>>>0,t^=t>>>13,t=Math.imul(t,0xc2b2ae35)>>>0,t^=t>>>16,t>>>0}var fe={words:new Uint32Array(4),capacity:0,count:0,maxProbe:0,dropped:0};function pe(e){return Number.isInteger(e)&&e>=0&&e<0xffffffff}function me(e,t){let n=q;for(;n<e*2;)n*=2;for(;n>q&&16+n*ce>t;)n/=2;return n}function J(e,t=ue){let n=0;for(let t of e.keys())pe(t)&&n++;if(n===0)return fe;let r=me(n,t),i=Math.min(n,r/2),a=4+r,o=new Uint32Array(a+r*4),s=new Float32Array(o.buffer);o.fill(se,4,a);let c=r-1,l=0,u=0;for(let[t,n]of e){if(l===i)break;if(!pe(t))continue;let e=de(t)&c,r=0;for(;o[4+e]!==se;)e=e+1&c,r++;o[4+e]=t,s.set([n[0],n[1],n[2],n[3]],a+e*4),r>u&&(u=r),l++}return o[0]=r,o[1]=u,o[2]=l,o[3]=a,{words:o,capacity:r,count:l,maxProbe:u,dropped:n-l}}function he(e){if(e.length===0)return null;let t=1/0,n=-1/0;for(let r=0;r<e.length;r++){let i=e[r];if(!pe(i))return null;i<t&&(t=i),i>n&&(n=i)}return n-t<0x1000000?t:null}function ge(e,t){let n=Math.floor(e/le);return n>0?`p${n}~${t}`:t}var _e=new WeakMap;function ve(e){let t=_e.get(e);return t===void 0&&(t=he(e.expressIds),_e.set(e,t)),t}var ye=new WeakMap;function be(e,t,n){if(!t||t.size===0)return!1;let r=ye.get(e);if(r&&r.generation===n)return r.has;let i=e.expressIds.some(e=>t.has(e));return ye.set(e,{generation:n,has:i}),i}function xe(e,t,n,r){n&&t!==null?(e[0]=t,e[1]=1|(r?2:0)):(e[0]=0,e[1]=0),e[2]=0,e[3]=0}var Se=class{image=fe;buffer=null;bufferDevice=null;bufferBytes=0;uploadedBytes=0;warnedDropped=!1;write(e,t){let n=e.limits,r=Math.min(n?.maxStorageBufferBindingSize??ue,n?.maxBufferSize??ue);this.image=J(t,r),this.image.dropped>0&&!this.warnedDropped&&(this.warnedDropped=!0,console.warn(`[EntityColorTable] ${this.image.dropped} colour overrides exceed the device's storage-buffer limit and are not painted.`));let i=this.image.words.byteLength;(!this.buffer||this.bufferDevice!==e||this.bufferBytes<i)&&(this.buffer?.destroy(),this.bufferBytes=Math.max(i,16),this.buffer=e.createBuffer({label:`entity-color-table`,size:this.bufferBytes,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.bufferDevice=e),e.queue.writeBuffer(this.buffer,0,this.image.words),this.uploadedBytes=i}clear(){this.image=fe,this.uploadedBytes=0,this.buffer&&this.bufferDevice&&(this.bufferDevice.queue.writeBuffer(this.buffer,0,fe.words),this.uploadedBytes=fe.words.byteLength)}releaseGpu(){this.buffer?.destroy(),this.buffer=null,this.bufferDevice=null,this.bufferBytes=0}getBuffer(){return this.buffer}getImage(){return this.image}getLastUploadBytes(){return this.uploadedBytes}},Ce=`
        @binding(5) @group(1) var<storage, read> entityColorTable: array<u32>;
        const ENTITY_COLOR_EMPTY: u32 = ${se}u;
        const ENTITY_COLOR_HEADER: u32 = 4u;
        const OVERRIDE_PAINT: u32 = 1u;
        const OVERRIDE_EMPHASIZE: u32 = 2u;

        fn entityColorSlotHash(key: u32) -> u32 {
          var h = key;
          h = h ^ (h >> 16u);
          h = h * 0x85ebca6bu;
          h = h ^ (h >> 13u);
          h = h * 0xc2b2ae35u;
          h = h ^ (h >> 16u);
          return h;
        }

        // Full scene id behind a 24-bit lane, given the draw's smallest id.
        fn resolveLaneEntityId(anchor: u32, lane: u32) -> u32 {
          return anchor + ((lane - anchor) & 0x00FFFFFFu);
        }

        // The override colour for this fragment's entity; alpha < 0 = none.
        fn entityOverrideColor(lane: u32) -> vec4<f32> {
          let none = vec4<f32>(0.0, 0.0, 0.0, -1.0);
          if ((uniforms.overrideParams.y & OVERRIDE_PAINT) == 0u || entityColorTable[2] == 0u) {
            return none;
          }
          let capacity = entityColorTable[0];
          let maxProbe = entityColorTable[1];
          let colorBase = entityColorTable[3];
          let id = resolveLaneEntityId(uniforms.overrideParams.x, lane);
          let mask = capacity - 1u;
          var slot = entityColorSlotHash(id) & mask;
          for (var i = 0u; i <= maxProbe && i < capacity; i = i + 1u) {
            let key = entityColorTable[ENTITY_COLOR_HEADER + slot];
            if (key == id) {
              let c = colorBase + slot * 4u;
              return vec4<f32>(
                bitcast<f32>(entityColorTable[c]),
                bitcast<f32>(entityColorTable[c + 1u]),
                bitcast<f32>(entityColorTable[c + 2u]),
                bitcast<f32>(entityColorTable[c + 3u])
              );
            }
            if (key == ENTITY_COLOR_EMPTY) {
              break;
            }
            slot = (slot + 1u) & mask;
          }
          return none;
        }

        // Composite an override over the fragment's own encoded colour exactly
        // as the retired equal-depth overlay pass blended it (src-alpha over
        // the base draw): the override albedo lit by the same irradiance, no
        // specular, the same roll-off and edge darkening, mixed by its alpha.
        // Emphasized overrides are unlit, faintly faceted and opaque (#1277).
        fn paintEntityOverride(base: vec4<f32>, ov: vec4<f32>, irradiance: vec3<f32>, N: vec3<f32>) -> vec4<f32> {
          let albedo = srgbToLinear(ov.rgb);
          var lit = albedo * irradiance;
          var a = ov.a;
          if ((uniforms.overrideParams.y & OVERRIDE_EMPHASIZE) != 0u) {
            lit = albedo * (0.85 + 0.15 * abs(dot(N, normalize(vec3<f32>(0.3, 1.0, 0.2)))));
            a = 1.0;
          }
          let encoded = linearToSrgb(clamp(neutralCompress(lit), vec3<f32>(0.0), vec3<f32>(1.0)));
          return vec4<f32>(mix(base.rgb, encoded, a), a + (1.0 - a) * base.a);
        }
`,we=1e-6,Te=8*2**-24,Ee=.025,De=5e-5,Oe=`
        const ORTHOGRAPHIC_DEPTH_NUDGE_PER_LEVEL: f32 = ${Te};
        const ORTHOGRAPHIC_MAX_DEPTH_NUDGE_METRES: f32 = ${Ee};
        const MAX_DEPTH_NUDGE_HASH: f32 = 255.0;

        // An orthographic view-projection leaves w at 1: its bottom row is exactly
        // (0, 0, 0, 1), because the projection's and the view's bottom rows are
        // both (0, 0, 0, 1). A perspective one copies the forward axis into that
        // row, a unit vector, so it is never zero. Every caller passes the
        // camera's world view-projection, which each draw packs whether or not
        // it renders camera-relative.
        fn isOrthographicProjection(viewProj: mat4x4<f32>) -> bool {
          return viewProj[0][3] == 0.0 && viewProj[1][3] == 0.0 && viewProj[2][3] == 0.0 && viewProj[3][3] == 1.0;
        }

        // Orthographic only: how many hash levels fit the metre bound. The z row
        // of the view-projection has length 1 / (far - near).
        fn orthographicNudgeLevels(viewProj: mat4x4<f32>) -> u32 {
          let depthRange = 1.0 / length(vec3<f32>(viewProj[0][2], viewProj[1][2], viewProj[2][2]));
          let steps = ORTHOGRAPHIC_MAX_DEPTH_NUDGE_METRES / (depthRange * ORTHOGRAPHIC_DEPTH_NUDGE_PER_LEVEL);
          return u32(clamp(floor(steps), 0.0, MAX_DEPTH_NUDGE_HASH)) + 1u;
        }

        // Orthographic only: clip z moved \`ndcOffset\` toward the camera without
        // changing which side of a clip plane the vertex is on. A vertex beyond
        // either plane, or exactly on the far plane, stays where it is.
        fn orthographicOffsetInsideDepthRange(clip: vec4<f32>, ndcOffset: f32) -> f32 {
          if (!(clip.z > 0.0 && clip.z < clip.w)) { return clip.z; }
          return min(clip.z + ndcOffset * clip.w, clip.w);
        }
`,ke=`
        ${Oe}
        const PERSPECTIVE_DEPTH_NUDGE_PER_STEP: f32 = ${we};

        // Clip-space z with the entity's depth nudge applied (depth-nudge.wgsl.ts).
        fn nudgedClipZ(clip: vec4<f32>, zHash: u32, viewProj: mat4x4<f32>) -> f32 {
          if (isOrthographicProjection(viewProj)) {
            let level = (zHash * orthographicNudgeLevels(viewProj)) >> 8u;
            return orthographicOffsetInsideDepthRange(clip, f32(level) * ORTHOGRAPHIC_DEPTH_NUDGE_PER_LEVEL);
          }
          return clip.z * (1.0 + f32(zHash) * PERSPECTIVE_DEPTH_NUDGE_PER_STEP);
        }
`,Ae=`
        ${Oe}
        const PERSPECTIVE_OVERLAY_DEPTH_LIFT: f32 = ${De};

        // Clip-space z raised above any nudged mesh face (depth-nudge.wgsl.ts).
        // A multiple of clip.w is a constant NDC offset after the w-divide, which
        // under reverse-Z reads as "slightly closer". Orthographic keeps at least
        // the perspective lift, and two levels above the highest nudge level
        // when that is more (all 256 levels in use), so the text pipeline's
        // constant depthBias of -4 units is covered too.
        fn overlayLiftedClipZ(clip: vec4<f32>, viewProj: mat4x4<f32>) -> f32 {
          if (isOrthographicProjection(viewProj)) {
            let levelsLift = f32(orthographicNudgeLevels(viewProj) + 1u) * ORTHOGRAPHIC_DEPTH_NUDGE_PER_LEVEL;
            return orthographicOffsetInsideDepthRange(clip, max(PERSPECTIVE_OVERLAY_DEPTH_LIFT, levelsLift));
          }
          return clip.z + PERSPECTIVE_OVERLAY_DEPTH_LIFT * clip.w;
        }
`,je=`
        ${G}
        ${ke}
        ${v}
        ${u}
        // Shared group(1) lighting; packing matches packEnvironmentUniforms().
        struct Environment {
          sunDirection: vec3<f32>,      // unit vector TOWARD the sun
          sunIntensity: f32,
          sunColor: vec3<f32>,
          ambientIntensity: f32,
          skyColor: vec3<f32>,          // hemisphere-ambient sky tint
          exposure: f32,
          groundColor: vec3<f32>,       // hemisphere-ambient ground tint
          fillIntensity: f32,
          rimIntensity: f32,
          sunSoftness: f32,
          _pad1: f32,
          _pad2: f32,
        }
        @binding(0) @group(1) var<uniform> env: Environment;
        // Selection highlight tint (#5484), set by Renderer.setOverlayTheme via
        // updateSelectionColor — written only on theme change, never per frame.
        // TRUE LINEAR-LIGHT RGB: re-lit by lightTerm below exactly like the WGSL
        // constant it replaces, then ACES-tonemapped + gamma-encoded on output.
        @binding(4) @group(1) var<uniform> selectionColor: vec4<f32>;
        const IRRADIANCE_CALIBRATION: f32 = 1.82;
        const TRANSLUCENT_OPACITY_SCALE: f32 = 0.7;
        ${l}
        ${K}
        ${Ce}

        ${d}

        struct VertexInput {
          @location(0) position: vec3<f32>,
          @location(1) normal: vec3<f32>,
          @location(2) entityId: u32,
        }

        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0) worldPos: vec3<f32>,
          @location(1) normal: vec3<f32>,
          @location(2) @interpolate(flat) entityId: u32,
          // Per-draw albedo carried from the vertex stage so the fragment shader
          // is shared by the flat path (vs_main writes uniforms.baseColor — the
          // per-batch colour) AND the instanced path
          // (vs_instanced writes the per-occurrence colour from the instance
          // buffer). For the flat path this is identical to reading
          // uniforms.baseColor directly (the value is constant across the draw).
          @location(4) color: vec4<f32>,
          // Per-occurrence selection flag for the instanced path (bit 0 = selected).
          // vs_main writes 0 (the flat path selects via uniforms.flags.x instead);
          // vs_instanced writes the per-instance flag from the instance buffer, so a
          // single selected occurrence highlights without re-drawing.
          @location(5) @interpolate(flat) instSelected: u32,
          // Camera-relative position for fragment operations that compare
          // geometry to section/crop boundaries or take derivatives. This is
          // intentionally separate from worldPos: shadow maps still consume
          // their established world-space light matrix until their depth pass
          // is migrated as one transaction.
          @location(6) eyePos: vec3<f32>,
        }

        // Per-instance vertex-buffer inputs (slot 1, stepMode 'instance') used by
        // vs_instanced. The mat4 arrives as four COLUMN vec4s (WGSL mat4x4 is
        // column-major), matching composeInstanceMatrix's column-major output +
        // the pipeline's slot-1 attribute offsets (0/16/32/48).
        //
        // Location namespaces: vertex-INPUT @location (this struct + VertexInput)
        // and inter-stage @location (VertexOutput) are INDEPENDENT in WGSL, so
        // InstanceInput.m1 @location(4) does NOT collide with VertexOutput.color
        // @location(4) — exactly as VertexInput.entityId and VertexOutput.entityId
        // already BOTH use @location(2). Within the INPUT namespace the per-vertex
        // inputs (0..2) and per-instance inputs (3..8) stay distinct.
        struct InstanceInput {
          @location(3) m0: vec4<f32>,
          @location(4) m1: vec4<f32>,
          @location(5) m2: vec4<f32>,
          @location(6) m3: vec4<f32>,
          @location(7) instEntityId: u32,
          @location(8) instColor: vec4<f32>,
          @location(9) instSelected: u32,
          @location(10) anchorHigh: vec4<f32>,
          @location(11) anchorLow: vec4<f32>,
        }

        // 12-byte quantized vertex (issue #1682 phase 6): uint16x4 (lattice
        // position xyz + packed octahedral normal in w as (u8x << 8 | u8y))
        // followed by the u32 entityId lane. Dequantization is BIT-EXACT for
        // the 2^-10 lattice: quantMin and q*step are both (integer)\xb72^-10,
        // so coincident points across batches stay coincident (the shared-
        // origin z-fight guarantee survives quantization).
        struct QuantizedVertexInput {
          @location(0) q: vec4<u32>,     // uint16x4: x, y, z, packedOct
          @location(2) entityId: u32,
        }

        fn octDecodeN(packed: u32) -> vec3<f32> {
          let ox = (f32((packed >> 8u) & 255u) / 255.0) * 2.0 - 1.0;
          let oy = (f32(packed & 255u) / 255.0) * 2.0 - 1.0;
          var n = vec3<f32>(ox, oy, 1.0 - abs(ox) - abs(oy));
          if (n.z < 0.0) {
            let tx = (1.0 - abs(oy)) * select(-1.0, 1.0, ox >= 0.0);
            let ty = (1.0 - abs(ox)) * select(-1.0, 1.0, oy >= 0.0);
            n = vec3<f32>(tx, ty, n.z);
          }
          return normalize(n);
        }

        // Shared flat-path vertex shading — vs_main and vs_main_quantized
        // differ ONLY in how position/normal are sourced.
        fn shadeFlatVertex(localPos: vec3<f32>, localNormal: vec3<f32>, entityId: u32) -> VertexOutput {
          var output: VertexOutput;
          let worldPos = uniforms.model * vec4<f32>(localPos, 1.0);
          let eyePos = rtePosition(localPos).xyz;
          let rte = (uniforms.flags.x & RTE_DRAWABLE_FLAG) != 0u;
          output.position = select(uniforms.viewProj * worldPos, uniforms.rteViewProj * vec4<f32>(eyePos, 1.0), rte);
          // Anti z-fighting depth nudge — see vs_main's comment.
          let colorSalt = (entityId >> 24u) * 2654435761u;
          let zHash = (((entityId & 0x00FFFFFFu) ^ colorSalt) * 2654435761u) & 255u;
          output.position.z = nudgedClipZ(output.position, zHash, uniforms.viewProj);
          output.worldPos = worldPos.xyz;
          output.normal = normalize((uniforms.model * vec4<f32>(localNormal, 0.0)).xyz);
          output.entityId = entityId;
          output.color = uniforms.baseColor;
          output.instSelected = 0u;
          output.eyePos = eyePos;
          return output;
        }

        @vertex
        fn vs_main_quantized(input: QuantizedVertexInput) -> VertexOutput {
          let p = uniforms.quantParams.xyz
            + vec3<f32>(f32(input.q.x), f32(input.q.y), f32(input.q.z)) * uniforms.quantParams.w;
          return shadeFlatVertex(p, octDecodeN(input.q.w), input.entityId);
        }

        @vertex
        fn vs_main(input: VertexInput, @builtin(instance_index) instanceIndex: u32) -> VertexOutput {
          var output: VertexOutput;
          let worldPos = uniforms.model * vec4<f32>(input.position, 1.0);
          let eyePos = rtePosition(input.position).xyz;
          let rte = (uniforms.flags.x & RTE_DRAWABLE_FLAG) != 0u;
          output.position = select(uniforms.viewProj * worldPos, uniforms.rteViewProj * vec4<f32>(eyePos, 1.0), rte);
          // Anti z-fighting: deterministic depth nudge.
          // Knuth multiplicative hash spreads sequential IDs across 0-255 so
          // coplanar faces from different entities always get distinct depths.
          // Material-layer walls slice into one closed solid per layer, all
          // sharing the PARENT wall's expressId, so adjacent layers' coincident
          // interface caps would get the same entity nudge and z-fight into a
          // flickering comb ("see inside the wall"). To separate them we fold in
          // an 8-bit MATERIAL-COLOUR salt that mergeGeometry/interleaveTextured
          // baked into the HIGH 8 bits of the entityId lane (low 24 = picking id,
          // masked off by encodeId24). Crucially the salt comes from the mesh's
          // OWN colour, NOT the per-draw baseColor uniform — so every redraw of
          // the same geometry with a different draw colour (the selection
          // highlight's greater-equal pass) computes the SAME nudge as its
          // batch. The step size per projection is in depth-nudge.wgsl.ts.
          let colorSalt = (input.entityId >> 24u) * 2654435761u;
          let zHash = (((input.entityId & 0x00FFFFFFu) ^ colorSalt) * 2654435761u) & 255u;
          output.position.z = nudgedClipZ(output.position, zHash, uniforms.viewProj);
          output.worldPos = worldPos.xyz;
          output.normal = normalize((uniforms.model * vec4<f32>(input.normal, 0.0)).xyz);
          output.entityId = input.entityId;
          output.color = uniforms.baseColor;
          output.instSelected = 0u;  // flat path selects via uniforms.flags.x
          output.eyePos = eyePos;
          return output;
        }

        // Instanced vertex entry — one template's geometry drawn once per
        // occurrence. The per-instance mat4 already folds SWAP * rel_k * T(origin)
        // (composed CPU-side, see instanced-render.ts), so it maps the template's
        // LOCAL vertex straight to WebGL Y-up world space — no uniforms.model.
        // rel_k and SWAP are rigid (no scale), so the same matrix transforms
        // normals. entityId + colour come per-occurrence from the instance buffer.
        @vertex
        fn vs_instanced(input: VertexInput, inst: InstanceInput) -> VertexOutput {
          var output: VertexOutput;
          let instMat = mat4x4<f32>(inst.m0, inst.m1, inst.m2, inst.m3);
          let worldPos = instMat * vec4<f32>(input.position, 1.0);
          let linearLocal = (instMat * vec4<f32>(input.position, 0.0)).xyz;
          let eyePos = rteInstancePosition(linearLocal, inst.anchorHigh.xyz, inst.anchorLow.xyz).xyz;
          output.position = uniforms.rteViewProj * vec4<f32>(eyePos, 1.0);
          // Same per-entity depth nudge as vs_main. No colour salt here: the
          // instanced path never redraws an occurrence with a second draw
          // colour, so the raw picking id is enough to separate coplanar entities.
          let zHash = ((inst.instEntityId & 0x00FFFFFFu) * 2654435761u) & 255u;
          output.position.z = nudgedClipZ(output.position, zHash, uniforms.viewProj);
          output.worldPos = worldPos.xyz;
          output.normal = normalize((instMat * vec4<f32>(input.normal, 0.0)).xyz);
          output.entityId = inst.instEntityId;
          output.color = inst.instColor;
          output.instSelected = inst.instSelected;
          output.eyePos = eyePos;
          return output;
        }

        fn encodeId24(id: u32) -> vec4<f32> {
          let r = f32((id >> 16u) & 255u) / 255.0;
          let g = f32((id >> 8u) & 255u) / 255.0;
          let b = f32(id & 255u) / 255.0;
          return vec4<f32>(r, g, b, 1.0);
        }

        struct FragmentOutput {
          @location(0) color: vec4<f32>,
          @location(1) objectIdEncoded: vec4<f32>,
        }

        @fragment
        fn fs_main(input: VertexOutput) -> FragmentOutput {
          // The flat/quantized/textured mesh paths submit this in one
          // camera-relative frame. Do all camera-local fragment arithmetic in
          // that frame; otherwise the RTE vertex precision is thrown away at
          // section/crop/derivative ingress. Instanced geometry is not yet
          // anchored, so its worldPos remains the authoritative input.
          let fragmentPos = clipSpacePos(input.worldPos, input.eyePos);
          // Per-instance hide/isolate: bit 1 of the instance flags lane marks a hidden
          // occurrence. Discard it so it neither draws nor writes depth (and the pick
          // pass applies the same discard, so it isn't pickable). vs_main writes
          // instSelected=0u for flat geometry, so this never affects the flat path.
          if ((input.instSelected & 2u) != 0u) {
            discard;
          }
          // Per-instance opacity routing (instanced passes only — flags.x bit 2). The
          // opaque instanced pass draws fully-opaque (or selected) occurrences; the
          // transparent instanced sub-pass (bit 3, alpha-blended) draws the rest. Discard
          // the occurrences belonging to the OTHER pass so each is drawn exactly once.
          // Lens-ghost / x-ray / compare write a low per-instance alpha into input.color.a.
          if ((uniforms.flags.x & 4u) != 0u) {
            let occOpaque = input.color.a >= 0.99 || (input.instSelected & 1u) != 0u;
            let transparentPass = (uniforms.flags.x & 8u) != 0u;
            if (transparentPass) {
              if (occOpaque) { discard; }
            } else {
              if (!occOpaque) { discard; }
            }
          }
          // Section plane / clip box (mesh-uniforms.wgsl.ts, shared with the
          // selection mask so an outline is cut where its surface is).
          if (sectionClipped(fragmentPos)) { discard; }

          // Compute normal via derivative-based flat shading.
          //
          // Industry-standard solution for BIM/CAD viewers — what
          // Three.js (material.flatShading = true), Autodesk Forge,
          // Speckle, and xeokit all do for opaque surfaces. Rationale:
          //
          //   * BIM geometry is overwhelmingly flat surfaces (walls,
          //     slabs, roofs, beams), and CSG operations (opening
          //     subtraction, layer slicing) emit those surfaces as
          //     dense strips of coplanar triangles. Per-vertex normal
          //     averaging gives a SLIGHTLY-different normal at each
          //     vertex due to f32 noise from boolean output; the
          //     boundary between strips then reads as a visible darker/
          //     brighter scar line — the horizontal striations on
          //     walls, stripes on roofs, visible triangulation reports
          //     across every CSG kernel we have tried (legacy BSP,
          //     Manifold).
          //   * cross(dpdx, dpdy) of world position evaluates to the
          //     EXACT face normal in the fragment shader. Every
          //     fragment on a flat face — across an arbitrarily-fine
          //     triangulation — gets the IDENTICAL normal, so coplanar
          //     splits become invisible by construction. No CPU-side
          //     welding, smooth-grouping, or coplanar-face merging
          //     fixes the symptom as cleanly.
          //
          // Trade-off: genuinely curved surfaces (cylinder tessellations,
          // BSpline approximations) shade with visible facets. For BIM
          // that's acceptable — curved surfaces are < 5 % of typical
          // model triangle count and the faceting matches CAD-tool
          // (Revit, ArchiCAD) on-screen behaviour at default quality.
          //
          // We still fall back to the vertex normal when derivatives
          // are unavailable (extreme polygon degeneracy where dpdx /
          // dpdy collapse to zero — practically never on real geometry).
          let faceN = cross(dpdx(fragmentPos), dpdy(fragmentPos));
          let fLen2 = dot(faceN, faceN);
          var N: vec3<f32>;
          if (fLen2 > 1e-10) {
            N = faceN * inverseSqrt(fLen2);
          } else {
            // Degenerate derivative — fall back to the vertex normal
            // if it's populated, else +Y.
            N = input.normal;
            let nLen2 = dot(N, N);
            if (nLen2 > 1e-6) {
              N = N * inverseSqrt(nLen2);
            } else {
              N = vec3<f32>(0.0, 1.0, 0.0);
            }
          }

          // Stabilize the SIGN of the derivative face normal with the vertex
          // normal. The screen-space cross product gives the exact face
          // normal DIRECTION for coplanar strips (the scar-line fix), but at
          // grazing angles its SIGN becomes numerically unstable per quad —
          // hemisphere/rim lighting then band-flips across large regions of
          // flat walls/slabs (diagonal lighter/darker bands). The interpolated
          // vertex normal is quad-noise-free, so use it only to orient N.
          // Guard: skip when the vertex normal is missing or nearly
          // perpendicular to the face normal (unreliable witness).
          let vN = input.normal;
          let alignDot = dot(N, vN);
          if (alignDot * alignDot > 0.03 * dot(vN, vN)) {
            N = N * sign(alignDot);
          }

          // Lighting environment — sun/hemisphere/exposure come from the
          // global env uniform. The fill follows the sun (it bounces in from
          // the opposite side); the rim stays fixed in world space as a
          // stylistic shaping light.
          let sunLight = env.sunDirection;
          // Horizontal mirror of the sun, lifted slightly. An overhead sun
          // leaves (0, 0.25, 0), which normalizes to straight up.
          let fillLight = normalize(vec3<f32>(-sunLight.x, 0.25, -sunLight.z));
          let rimLight = normalize(vec3<f32>(0.0, 0.2, -1.0));  // Rim light for edge definition

          // Hemisphere ambient. This, not the sun, keeps faces turned away
          // from the sun readable (I-beam webs and flange undersides, #5382).
          let hemisphereFactor = N.y * 0.5 + 0.5;
          let ambient = mix(env.groundColor, env.skyColor, hemisphereFactor) * env.ambientIntensity;

          // One-sided sun, so a building has a lit side and a shaded side.
          // sunSoftness is the diffuse wrap (env uniform): 0 = crisp
          // terminator (hard shadows), larger = softer wrap-around (overcast).
          let NdotL = dot(N, sunLight);
          let wrap = env.sunSoftness;
          let diffuseSun = max((NdotL + wrap) / (1.0 + wrap), 0.0) * env.sunIntensity;

          // Fill light, one-sided like the sun.
          let NdotFill = max(dot(N, fillLight), 0.0);
          let diffuseFill = NdotFill * env.fillIntensity;

          // Rim light for edge definition
          let NdotRim = max(dot(N, rimLight), 0.0);
          let rim = pow(NdotRim, 4.0) * env.rimIntensity;

          // The authored colour is display-referred sRGB; light it in linear.
          // (textured.wgsl.ts anchors on the first line to multiply in the texel.)
          var baseColor = input.color.rgb;
          baseColor = srgbToLinear(baseColor);

          // Combine all lighting. Only the DIRECT sun term is occluded by cast
          // shadows (#2670); ambient/fill/rim are indirect and stay unshadowed.
          // Exposure scales the light, so the selection shade below and every
          // later stage see one exposed irradiance.
          let sunShadow = sunShadowFactor(input.eyePos, N, input.position.xy);
          let lightTerm = ambient + env.sunColor * (diffuseSun * sunShadow) + vec3<f32>(diffuseFill + rim);
          let irradiance = lightTerm * (env.exposure * IRRADIANCE_CALIBRATION);
          var color = baseColor * irradiance;

          // flags.x bit 0 (value 1) = isSelected → selection highlight, forced opaque.
          // bit 1 (value 2) = isOverlay → legacy overlay pipeline callers;
          // preserve alpha and skip specular for their blended draw.
          // Selected via the per-draw flag (flat path) OR the per-occurrence flag
          // (instanced path — vs_instanced reads it from the instance buffer).
          let isSelected = ((uniforms.flags.x & 1u) == 1u) || ((input.instSelected & 1u) == 1u);
          let isOverlay = (uniforms.flags.x & 2u) == 2u;

          // Selection highlight — a blue albedo RE-LIT by the scene lighting.
          //
          // We override the material albedo with selection-blue and re-light
          // it with the SAME lightTerm used for unselected surfaces, then
          // skip the view-dependent (specular) term below. Two requirements
          // are in tension and this satisfies both:
          //
          //   * No base-material bleed-through. The old fresnel-glow mix left
          //     ~80 % of the lit object colour visible at face centres (the
          //     green-site / red-roof wash-out). Here the base colour never
          //     enters the result — only lightTerm (geometry/light, colour-
          //     independent) modulates the constant blue albedo.
          //   * Facet/crease structure must survive. A single FLAT colour
          //     (the previous fix) collapsed every face to the same blue, so
          //     internal edges — which read as the per-face shading STEP, not
          //     just the faint screen-space edge line — disappeared on
          //     selection. Re-lighting keeps that per-face brightness step, so
          //     creases read on the highlight exactly as they do unselected.
          //
          // The luminance of the exposed irradiance is used as a multiplicative
          // gain (which preserves the per-face brightness RATIOS, so creases
          // read as strongly as on the unselected surface). The calibration
          // puts a sunlit face at 1.0, i.e. full selection-blue, and the
          // floor/ceiling clamp keeps shadowed faces only dimmed and bright
          // scenes from washing out.
          if (isSelected) {
            let shadeLum = dot(irradiance, vec3<f32>(0.299, 0.587, 0.114));
            let shade = clamp(shadeLum, 0.45, 1.2);
            // selectionColor is already linear-light (set by Renderer.setOverlayTheme
            // from the app theme, #5484) — no srgbToLinear here, unlike the constant
            // it replaces.
            color = selectionColor.rgb * shade;
          }

          // Public getOverlayPipeline() callers can still use the emphasized
          // overlay bit even though internal colour overrides now use a table.
          let emphasizedOverlay = isOverlay && (uniforms.flags.x & 32u) != 0u;
          if (emphasizedOverlay) {
            let facet = 0.85 + 0.15 * abs(dot(N, normalize(vec3<f32>(0.3, 1.0, 0.2))));
            color = baseColor * facet;
          }

          // Selected objects and emphasized overlays draw fully opaque.
          var finalAlpha = select(input.color.a, 1.0, isSelected || emphasizedOverlay);

          // Specular (#5386; specular.wgsl.ts), after the diffuse above. Not
          // on the selection highlight or legacy overlay (it would wash out
          // their colours); a table override is composited without it below. The
          // sun lobe is scaled exactly like the diffuse sun term, and both
          // terms like irradiance, so a preset's highlights and diffuse move together.
          if (!isSelected && !isOverlay) {
            // Glass is an authored translucent material (mesh-material.ts
            // also gives it its smooth roughness). An X-Ray or compare fade
            // only lowers the alpha and stays a fade. Instanced occurrences
            // are never authored translucent: prepareInstancedRender routes
            // those to the flat path, so the per-pass lane is ignored there.
            let instancedPass = (uniforms.flags.x & 4u) != 0u;
            let translucent = finalAlpha < 0.99;
            let glass = translucent && uniforms.transmission.x > 0.5 && !instancedPass;
            // #5984: an instanced occurrence's own authored finish rides its
            // flags lane (instanced-render.ts packInstanceFinish); the pass's
            // uniform row is the shared default.
            var metallicRoughness = vec2<f32>(uniforms.metallicRoughness.x, uniforms.metallicRoughness.y);
            if (instancedPass && (input.instSelected & 4u) != 0u) {
              metallicRoughness.x = f32((input.instSelected >> 16u) & 255u) / 255.0;
            }
            if (instancedPass && (input.instSelected & 8u) != 0u) {
              metallicRoughness.y = f32((input.instSelected >> 24u) & 255u) / 255.0;
            }
            let metallic = clamp(metallicRoughness.x, 0.0, 1.0);
            let spec = surfaceSpecular(
              N,
              normalize(-input.eyePos),
              baseColor,
              metallic,
              metallicRoughness.y,
              env.sunColor * (env.sunIntensity * sunShadow),
            );
            // What the lobe reflects is not there to diffuse; a metal has no
            // diffuse at all.
            let diffuse = color * (1.0 - spec.reflectance) * (1.0 - metallic);
            let reflected = spec.light * (env.exposure * IRRADIANCE_CALIBRATION);
            if (translucent) {
              finalAlpha = finalAlpha * TRANSLUCENT_OPACITY_SCALE;
            }
            if (glass) {
              // The transparent pipelines blend straight alpha:
              // out = c * a + behind * (1 - a). A pane passes what is behind
              // it except what its body absorbs and its surface reflects, and
              // its reflection is not dimmed by the body's opacity, so solve
              // for (c, a). The reflectance rising at grazing angles is what
              // makes glass more opaque there; a bright sun glint raises the
              // alpha further so it is not clipped to the body's opacity.
              let body = finalAlpha;
              let reflectance = dot(spec.reflectance, vec3<f32>(0.299, 0.587, 0.114));
              let premultiplied = diffuse * body + reflected;
              let peak = max(premultiplied.r, max(premultiplied.g, premultiplied.b));
              finalAlpha = clamp(max(body + reflectance * (1.0 - body), peak), 0.0, 1.0);
              color = premultiplied / max(finalAlpha, 0.0001);
            } else {
              color = diffuse + reflected;
            }
          }

          // Hue-preserving highlight roll-off (color-transfer.wgsl.ts). No
          // contrast curve and no saturation boost: an authored colour lit at
          // unit irradiance leaves here unchanged unless it is brighter than
          // the roll-off threshold.
          color = neutralCompress(color);

          color = linearToSrgb(clamp(color, vec3<f32>(0.0), vec3<f32>(1.0)));

          var out: FragmentOutput;
          out.color = vec4<f32>(color, finalAlpha);
          // Colour override from the per-entity table (#6076): only draws the
          // renderer marks (overrideParams.y), i.e. depth-writing opaque ones.
          let entityOverride = entityOverrideColor(input.entityId);
          if (entityOverride.a >= 0.0 && !isSelected) {
            out.color = paintEntityOverride(out.color, entityOverride, irradiance, N);
          }
          out.objectIdEncoded = encodeId24(input.entityId);
          return out;
        }
      `;function Me(e,t,n){let r=e.indexOf(t);if(r===-1)throw Error(`ghost.wgsl: anchor "${n}" not found — main.wgsl.ts changed; update the ghost-shader derivation.`);if(e.indexOf(t,r+t.length)!==-1)throw Error(`ghost.wgsl: anchor "${n}" is not unique — tighten the derivation.`);return r}var Ne=`          var color = baseColor * irradiance;
          var ghost: FragmentOutput;
          ghost.color = vec4<f32>(
            linearToSrgb(clamp(neutralCompress(color), vec3<f32>(0.0), vec3<f32>(1.0))),
            input.color.a * TRANSLUCENT_OPACITY_SCALE,
          );
          ghost.objectIdEncoded = encodeId24(input.entityId);
          return ghost;
`;function Pe(e){let t=Me(e,`let sunShadow = sunShadowFactor(input.eyePos, N, input.position.xy);`,`sun shadow`),n=e.slice(0,t)+`let sunShadow = 1.0;`+e.slice(t+68),r=Me(n,`          var color = baseColor * irradiance;
`,`diffuse colour`),i=n.lastIndexOf(`
        }`);if(i<r||n.slice(r,i).includes(`
        fn `))throw Error(`ghost.wgsl: fs_main is no longer the last function in main.wgsl.ts; update the ghost-shader derivation.`);return n.slice(0,r)+Ne+n.slice(i+1)}let Fe,Re;Fe=Pe(je);Ie=.99;Le=.12;Re=.2;function ze(e,t,n,r){if(!(e<.99||t>.01))return!1;if(r!=null){let e=r.get(n);if(e!=null&&e[3]>=Re)return!1}return!0}function Be(e,t,n){if(e>=.99)return!1;if(n==null||n.size===0||t.length===0)return!0;for(let e of t){let t=n.get(e);if(t==null||t[3]<Re)return!0}return!1}function Ve(e,t){if(t==null||t.size===0)return null;let n=new Set,r=new Set;for(let i of e){let e=t.get(i);e!=null&&e[3]>=Re?n.add(i):r.add(i)}return n.size===0?null:{promoted:n,remaining:r}}var He={m:new Float32Array([1,0,0,0,0,0,-1,0,0,1,0,0,0,0,0,1])},Ue=0xffff000c;function We(e,t){let n=e=>Math.round(Math.min(1,Math.max(0,e))*255),r=0;return e!==void 0&&Number.isFinite(e)&&(r|=4|n(e)<<16),t!==void 0&&Number.isFinite(t)&&(r|=8|n(t)<<24),r>>>0}function Ge(e){let t=new Float32Array(16);for(let n=0;n<4;n++)for(let r=0;r<4;r++)t[r*4+n]=e[n*4+r];return{m:t}}function Ke(e,t){let n=Ge(e),r=_.identity();return r.m[12]=t[0],r.m[13]=t[1],r.m[14]=t[2],_.multiply(He,_.multiply(n,r)).m}function qe(e,t){let n=e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3],r=e[4]*t[0]+e[5]*t[1]+e[6]*t[2]+e[7];return[n,e[8]*t[0]+e[9]*t[1]+e[10]*t[2]+e[11],-r]}function Je(e,t,n,r,i,a=0){for(let r=0;r<16;r++)e.setFloat32(t+r*4,n[r],!0);e.setUint32(t+64,r>>>0,!0);for(let n=0;n<4;n++)e.setFloat32(t+68+n*4,i[n],!0);e.setUint32(t+84,a>>>0,!0)}function Ye(e){let t=e.templates.map(()=>[]);for(let n of e.instances){if(n.color[3]<.99)continue;let e=t[n.templateIndex];e&&e.push(n)}let n=[];for(let r=0;r<e.templates.length;r++){let i=e.templates[r],a=t[r];if(!a||a.length===0)continue;let o=new ArrayBuffer(a.length*88),s=new DataView(o),c=new Uint32Array(a.length),l=new Float64Array(a.length*3),u=new Float32Array(a.length*3),d=e.carriesItemIds?new Uint32Array(a.length):void 0;for(let e=0;e<a.length;e++){let t=a[e],n=Ke(t.transform,i.origin),r=qe(t.transform,i.origin),o=We(t.metallic,t.roughness);Je(s,e*88,n,t.entityId,t.color,o),c[e]=t.entityId>>>0,l.set(r,e*3),u.set([n[12],n[13],n[14]],e*3),d&&(d[e]=(t.itemId??0)>>>0)}n.push({templateIndex:r,positions:i.positions,normals:i.normals,indices:i.indices,origin:i.origin,instanceBuffer:o,instanceCount:a.length,entityIds:c,itemIds:d,canonicalAnchors:l,canonicalMatrixTranslations:u})}return n}function Xe(e,t){if(e.maxOccRadius===1/0)return;let n=t.maxX-t.minX,r=t.maxY-t.minY,i=t.maxZ-t.minZ,a=.5*Math.sqrt(n*n+r*r+i*i);if(!Number.isFinite(a)||!Number.isFinite(t.minX+t.minY+t.minZ)||!Number.isFinite(t.maxX+t.maxY+t.maxZ)){e.bounds=null,e.maxOccRadius=1/0;return}a>e.maxOccRadius&&(e.maxOccRadius=a);let o=e.bounds;o?(t.minX<o.min[0]&&(o.min[0]=t.minX),t.minY<o.min[1]&&(o.min[1]=t.minY),t.minZ<o.min[2]&&(o.min[2]=t.minZ),t.maxX>o.max[0]&&(o.max[0]=t.maxX),t.maxY>o.max[1]&&(o.max[1]=t.maxY),t.maxZ>o.max[2]&&(o.max[2]=t.maxZ)):e.bounds={min:[t.minX,t.minY,t.minZ],max:[t.maxX,t.maxY,t.maxZ]}}var Ze=8;function Qe(e,t){return{buffer:e.createBuffer({label:`instanced-rte-deltas`,size:Math.max(1,t)*32,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),scratch:new Float32Array(t*Ze),camera:null,runs:[]}}function $e(e){e.camera=null}var et=(e,t)=>e!==null&&e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2];function tt(e,t,n){return t.map(t=>{if(t.canonicalAnchors.length!==t.instanceCount*3)throw RangeError(`Instanced RTE anchors do not match the instance-buffer record count.`);let r=t.rteDeltas;if(et(r.camera,n))return r.runs;let i=t.canonicalAnchors,a=nt(t.instanceCount,e=>{let t=e*3;return E([i[t],i[t+1],i[t+2]],n,r.scratch,e*Ze)});if(a.length>0){let t=a[0].first,n=a[a.length-1],i=n.first+n.count;e.queue.writeBuffer(r.buffer,t*32,r.scratch.subarray(t*Ze,i*Ze))}return r.camera=[n[0],n[1],n[2]],r.runs=a,a})}function nt(e,t){let n=[],r=-1;for(let i=0;i<e;i++)t(i)?r<0&&(r=i):r>=0&&(n.push({first:r,count:i-r}),r=-1);return r>=0&&n.push({first:r,count:e-r}),n}function rt(e,t,n){for(let r of n)e.drawIndexed(t,r.count,0,0,r.first);return n.length}var it=[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`uint32`}]},{arrayStride:88,stepMode:`instance`,attributes:[{shaderLocation:3,offset:0,format:`float32x4`},{shaderLocation:4,offset:16,format:`float32x4`},{shaderLocation:5,offset:32,format:`float32x4`},{shaderLocation:6,offset:48,format:`float32x4`},{shaderLocation:7,offset:64,format:`uint32`},{shaderLocation:8,offset:68,format:`float32x4`},{shaderLocation:9,offset:84,format:`uint32`}]},{arrayStride:32,stepMode:`instance`,attributes:[{shaderLocation:10,offset:0,format:`float32x4`},{shaderLocation:11,offset:16,format:`float32x4`}]}];function at(e,t,n,r){let i=e.indexOf(t);if(i===-1)throw Error(`textured.wgsl: anchor "${r}" not found — main.wgsl.ts changed; update the textured-shader derivation.`);if(e.indexOf(t,i+t.length)!==-1)throw Error(`textured.wgsl: anchor "${r}" is not unique — tighten the derivation.`);return e.slice(0,i)+n+e.slice(i+t.length)}function ot(){let e=je;return e=at(e,`@binding(0) @group(0) var<uniform> uniforms: Uniforms;`,`@binding(0) @group(0) var<uniform> uniforms: Uniforms;
        @binding(1) @group(0) var albedoTex: texture_2d<f32>;
        @binding(2) @group(0) var albedoSampler: sampler;`,`uniform binding`),e=at(e,`          @location(2) entityId: u32,
        }

        struct VertexOutput {`,`          @location(2) entityId: u32,
          @location(12) uv: vec2<f32>,
        }

        struct VertexOutput {`,`VertexInput uv`),e=at(e,`          @location(6) eyePos: vec3<f32>,
        }`,`          @location(6) eyePos: vec3<f32>,
          @location(7) uv: vec2<f32>,
        }`,`VertexOutput uv`),e=at(e,`          output.entityId = input.entityId;`,`          output.entityId = input.entityId;
          output.uv = input.uv;`,`vs_main uv passthrough`),e=at(e,`var baseColor = input.color.rgb;`,`let albedoTexel = textureSample(albedoTex, albedoSampler, input.uv);
          if (albedoTexel.a < 0.004) { discard; }
          var baseColor = albedoTexel.rgb * input.color.rgb;`,`albedo sample`),e}var st=ot();function ct(e,t,n){let r=n+4;return e?.enabled?(t[n]=e.min[0],t[n+1]=e.min[1],t[n+2]=e.min[2],t[n+3]=0,t[r]=e.max[0],t[r+1]=e.max[1],t[r+2]=e.max[2],t[r+3]=0,4):(t[n]=0,t[n+1]=0,t[n+2]=0,t[n+3]=0,t[r]=0,t[r+1]=0,t[r+2]=0,t[r+3]=0,0)}function lt(e,t=1,n){let r=t<Ie,i=H.metallicRoughness;e[i]=n?.metallic??0,e[i+1]=n?.roughness??(r?.05:.9),e[i+2]=+!!r,e[i+3]=0}var ut=(()=>{let e=Math.hypot(-.45,1,.6);return[-.45/e,1/e,.6/e]})();function dt(e){let t=Math.hypot(e[0],e[1],e[2]);return Number.isFinite(t)&&t>1e-6?[e[0]/t,e[1]/t,e[2]/t]:[...ut]}function ft(e,t,n){return e+(t-e)*n}function pt(e,t,n){return[ft(e[0],t[0],n),ft(e[1],t[1],n),ft(e[2],t[2],n)]}function mt(e,t,n){let r=Math.min(1,Math.max(0,(e-t)/(n-t)));return r*r*(3-2*r)}function ht(e){return Number.isFinite(e)?Math.min(1,Math.max(0,e)):0}function gt(e){let t={zenith:[.012,.016,.035],horizon:[.03,.04,.07],ground:[.015,.015,.02]},n={zenith:[.07,.08,.18],horizon:[.45,.22,.18],ground:[.05,.04,.05]},r={zenith:[.18,.32,.56],horizon:[.95,.55,.28],ground:[.176,.168,.168]},i={zenith:[.18,.4,.78],horizon:[.66,.78,.9],ground:[.252,.261,.27]},a=mt(e,-.21,-.02),o=mt(e,-.02,.17),s=mt(e,.17,.35),c=t;return c={zenith:pt(c.zenith,n.zenith,a),horizon:pt(c.horizon,n.horizon,a),ground:pt(c.ground,n.ground,a)},c={zenith:pt(c.zenith,r.zenith,o),horizon:pt(c.horizon,r.horizon,o),ground:pt(c.ground,r.ground,o)},c={zenith:pt(c.zenith,i.zenith,s),horizon:pt(c.horizon,i.horizon,s),ground:pt(c.ground,i.ground,s)},c}_t=function(e){let t=dt(e?.sunDirection??ut),n=gt(t[1]);return{sunDirection:t,sunColor:e?.sunColor??[1,1,1],sunIntensity:e?.sunIntensity??.4,skyColor:e?.skyColor??[.34,.35,.36],groundColor:e?.groundColor??[.24,.2,.17],ambientIntensity:e?.ambientIntensity??.775,fillIntensity:e?.fillIntensity??.1,rimIntensity:e?.rimIntensity??.05,sunSoftness:ht(e?.sunSoftness??.3),exposure:e?.exposure??.85,skyEnabled:e?.skyEnabled??!1,sky:{zenith:e?.sky?.zenith??n.zenith,horizon:e?.sky?.horizon??n.horizon,ground:e?.sky?.ground??n.ground}}};function vt(e,t){let n=t??new Float32Array(20);return n[0]=e.sunDirection[0],n[1]=e.sunDirection[1],n[2]=e.sunDirection[2],n[3]=e.sunIntensity,n[4]=e.sunColor[0],n[5]=e.sunColor[1],n[6]=e.sunColor[2],n[7]=e.ambientIntensity,n[8]=e.skyColor[0],n[9]=e.skyColor[1],n[10]=e.skyColor[2],n[11]=e.exposure,n[12]=e.groundColor[0],n[13]=e.groundColor[1],n[14]=e.groundColor[2],n[15]=e.fillIntensity,n[16]=e.rimIntensity,n[17]=e.sunSoftness,n[18]=0,n[19]=0,n}let bt,xt,St,Ct,Y,wt,X,Tt;yt={selection:[.07323895587840543,.31854677812509186,1,1],sectionPlane:[.012,.663,.957,1],overlayLine:[0,0,0,1],clashA:[140/255,108/255,62/255,1],clashB:[0,113/255,151/255,1],clashOverlap:[245/255,42/255,101/255,1]};bt=class{buffer;device;constructor(e){this.device=e,this.buffer=e.createBuffer({label:`selection-color-uniform`,size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.buffer,0,new Float32Array(yt.selection))}update(e){this.device.queue.writeBuffer(this.buffer,0,new Float32Array(e))}destroy(){this.buffer.destroy()}};xt=class{theme=yt;clashLinesFollowTheme=!1;themedClashSolid=null;get current(){return this.theme}set(e,t,n,r=null){this.theme=e,n?.setOverlayLineColor(e.overlayLine),t?.setPlaneColor(e.sectionPlane),this.clashLinesFollowTheme&&n?.setClashBoxLineColor(e.clashOverlap),this.themedClashSolid&&r?.upload(this.clashSolid(this.themedClashSolid))}reapply(e,t){t.setOverlayLineColor(this.theme.overlayLine),e.setPlaneColor(this.theme.sectionPlane),this.clashLinesFollowTheme&&t.setClashBoxLineColor(this.theme.clashOverlap)}clashLineColor(e){return this.clashLinesFollowTheme=e===void 0,e??this.theme.clashOverlap}clashSolid(e){if(this.themedClashSolid=e&&e.color===void 0?e:null,!e)return null;let[t,n,r,i]=e.color??this.theme.clashOverlap;return{...e,color:[t,n,r,i]}}};St=96;Ct=class{device;webgpuDevice;pipeline;instancedPipeline;instancedTransparentPipeline=null;makeInstancedTransparentPipeline=null;makeQuantizedPipelineAsync=null;quantizedPipelines={};makeGhostPipelineAsync=null;ghostPipelines=new Map;instancedTransparentPipelineTried=!1;selectionPipeline;transparentPipeline;overlayPipeline=null;makeOverlayPipeline;emptyEntityColorTable;entityColorTableBuffer;texturedPipeline;texturedBindGroupLayout;depthTexture;depthTextureView;depthOnlyTextureView;stencilTextureView;objectIdTexture;objectIdTextureView;depthFormat=`depth24plus-stencil8`;colorFormat;objectIdFormat=`rgba8unorm`;multisampleTexture=null;multisampleTextureView=null;sampleCount=4;uniformBuffer;bindGroup;bindGroupLayout;environmentBuffer;environmentBindGroup;environmentBindGroupLayout;environmentScratch=new Float32Array(20);shadowSampler;shadowUniformBuffer;dummyShadowTexture;dummyShadowView;currentShadowView;selectionColorUniform;currentWidth;currentHeight;constructor(e,t=1,n=1){this.currentWidth=t,this.currentHeight=n,this.webgpuDevice=e,this.device=e.getDevice(),this.colorFormat=e.getFormat();let r=this.device.limits?.maxSampleCount??4;this.sampleCount=Math.min(4,r),this.depthTexture=this.device.createTexture({size:{width:t,height:n},format:this.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,sampleCount:this.sampleCount>1?this.sampleCount:1}),this.depthTextureView=this.depthTexture.createView(),this.depthOnlyTextureView=this.depthTexture.createView({aspect:`depth-only`}),this.stencilTextureView=this.depthTexture.createView({aspect:`stencil-only`}),this.objectIdTexture=this.device.createTexture({size:{width:t,height:n},format:this.objectIdFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,sampleCount:this.sampleCount>1?this.sampleCount:1}),this.objectIdTextureView=this.objectIdTexture.createView(),this.sampleCount>1&&(this.multisampleTexture=this.device.createTexture({size:{width:t,height:n},format:this.colorFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT,sampleCount:this.sampleCount}),this.multisampleTextureView=this.multisampleTexture.createView()),this.uniformBuffer=this.device.createBuffer({size:this.getUniformBufferSize(),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroupLayout=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]}),this.environmentBindGroupLayout=this.device.createBindGroupLayout({label:`environment-bgl`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`depth`}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:`comparison`}},{binding:3,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}},{binding:4,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}},{binding:5,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`read-only-storage`}}]}),this.environmentBuffer=this.device.createBuffer({label:`environment-uniforms`,size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.selectionColorUniform=new bt(this.device),this.shadowSampler=this.device.createSampler({label:`shadow-cmp-sampler`,compare:`greater-equal`,magFilter:`linear`,minFilter:`linear`}),this.shadowUniformBuffer=this.device.createBuffer({label:`shadow-uniforms`,size:St,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.dummyShadowTexture=this.device.createTexture({label:`shadow-dummy-depth`,size:{width:1,height:1},format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.dummyShadowView=this.dummyShadowTexture.createView(),this.currentShadowView=this.dummyShadowView,this.emptyEntityColorTable=this.device.createBuffer({label:`entity-color-table-empty`,size:16,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.entityColorTableBuffer=this.emptyEntityColorTable,this.environmentBindGroup=this.buildEnvironmentBindGroup(),this.updateEnvironment();let i=this.device.createShaderModule({code:je}),a=this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout,this.environmentBindGroupLayout]}),o={layout:a,vertex:{module:i,entryPoint:`vs_main`,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`uint32`}]}]},fragment:{module:i,entryPoint:`fs_main`,targets:[{format:this.colorFormat},{format:`rgba8unorm`}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:this.depthFormat,depthWriteEnabled:!0,depthCompare:`greater`},multisample:{count:this.sampleCount}};this.pipeline=this.device.createRenderPipeline(o);let s={module:i,entryPoint:`vs_instanced`,buffers:it};this.instancedPipeline=this.device.createRenderPipeline({...o,vertex:s});let c=s,l={layout:a,vertex:{module:i,entryPoint:`vs_main`,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`uint32`}]}]},fragment:{module:i,entryPoint:`fs_main`,targets:[{format:this.colorFormat},{format:`rgba8unorm`}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:this.depthFormat,depthWriteEnabled:!1,depthCompare:`greater-equal`,depthBias:0,depthBiasSlopeScale:0},multisample:{count:this.sampleCount}};this.selectionPipeline=this.device.createRenderPipeline(l);let u={layout:a,vertex:{module:i,entryPoint:`vs_main`,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`uint32`}]}]},fragment:{module:i,entryPoint:`fs_main`,targets:[{format:this.colorFormat,blend:{color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`}}},{format:this.objectIdFormat}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:this.depthFormat,depthWriteEnabled:!1,depthCompare:`greater`},multisample:{count:this.sampleCount}};this.transparentPipeline=this.device.createRenderPipeline(u),this.makeInstancedTransparentPipeline=()=>this.device.createRenderPipeline({...u,vertex:c});let d={layout:a,vertex:{module:i,entryPoint:`vs_main`,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`uint32`}]}]},fragment:{module:i,entryPoint:`fs_main`,targets:[{format:this.colorFormat,blend:{color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`}}},{format:`rgba8unorm`}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:this.depthFormat,depthWriteEnabled:!1,depthCompare:`equal`},multisample:{count:this.sampleCount}};this.makeOverlayPipeline=()=>this.device.createRenderPipeline(d);let f={module:i,entryPoint:`vs_main_quantized`,buffers:[{arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:`uint16x4`},{shaderLocation:2,offset:8,format:`uint32`}]}]};this.makeQuantizedPipelineAsync=e=>{let t=e===`opaque`?o:u;return this.device.createRenderPipelineAsync({...t,vertex:f})},this.makeGhostPipelineAsync=e=>this.device.createRenderPipelineAsync({...u,...e&&{vertex:f},fragment:{...u.fragment,module:this.device.createShaderModule({code:Fe})}}),this.texturedBindGroupLayout=this.device.createBindGroupLayout({label:`textured-bgl`,entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`float`}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:`filtering`}}]});let p=this.device.createShaderModule({label:`textured-shader`,code:st});this.texturedPipeline=this.device.createRenderPipeline({label:`textured-pipeline`,layout:this.device.createPipelineLayout({bindGroupLayouts:[this.texturedBindGroupLayout,this.environmentBindGroupLayout]}),vertex:{module:p,entryPoint:`vs_main`,buffers:[{arrayStride:36,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`uint32`},{shaderLocation:12,offset:28,format:`float32x2`}]}]},fragment:{module:p,entryPoint:`fs_main`,targets:[{format:this.colorFormat},{format:this.objectIdFormat}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:this.depthFormat,depthWriteEnabled:!0,depthCompare:`greater`},multisample:{count:this.sampleCount}}),this.bindGroup=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}updateUniforms(e,t,n,r,i,a,o){let s=new Float32Array(V),c=new Uint32Array(s.buffer,W,4);s.set(e,0),s.set(t,16),n?s.set(n,32):s.set([1,1,1,1],32),lt(s,n?.[3],r),i&&(s[40]=i.normal[0],s[41]=i.normal[1],s[42]=i.normal[2],s[43]=i.distance);let l=ct(o,s,48);c[0]=+!!a,c[1]=+!!i?.enabled|(i?.flipped?2:0)|l,c[2]=0,c[3]=0,this.device.queue.writeBuffer(this.uniformBuffer,0,s)}async ensureQuantizedPipelines(){let e=this.makeQuantizedPipelineAsync;if(!e)return!1;let t=[`opaque`,`transparent`];try{for(let n of t)this.quantizedPipelines[n]||(this.quantizedPipelines[n]=await e(n));return!0}catch(e){return console.warn(`[Pipeline] quantized pipeline validation failed; staying on f32 vertices:`,e),this.makeQuantizedPipelineAsync=null,!1}}getQuantizedPipelineVariant(e){return this.quantizedPipelines[e]??null}writeRawUniforms(e,t=0){if(this.device.queue.writeBuffer(this.uniformBuffer,0,e),t!==0){let n=new Uint32Array(e.buffer,e.byteOffset+W,1)[0];this.device.queue.writeBuffer(this.uniformBuffer,W,new Uint32Array([n|t]))}}updateEnvironment(e){vt(_t(e),this.environmentScratch),this.device.queue.writeBuffer(this.environmentBuffer,0,this.environmentScratch)}getEnvironmentBindGroup(){return this.environmentBindGroup}buildEnvironmentBindGroup(){return this.device.createBindGroup({label:`environment-bg`,layout:this.environmentBindGroupLayout,entries:[{binding:0,resource:{buffer:this.environmentBuffer}},{binding:1,resource:this.currentShadowView},{binding:2,resource:this.shadowSampler},{binding:3,resource:{buffer:this.shadowUniformBuffer}},{binding:4,resource:{buffer:this.selectionColorUniform.buffer}},{binding:5,resource:{buffer:this.entityColorTableBuffer}}]})}setEntityColorTableBuffer(e){let t=e??this.emptyEntityColorTable;t!==this.entityColorTableBuffer&&(this.entityColorTableBuffer=t,this.environmentBindGroup=this.buildEnvironmentBindGroup())}setShadowDepthView(e){let t=e??this.dummyShadowView;t!==this.currentShadowView&&(this.currentShadowView=t,this.environmentBindGroup=this.buildEnvironmentBindGroup())}updateShadowUniform(e){this.device.queue.writeBuffer(this.shadowUniformBuffer,0,e)}needsResize(e,t){return this.currentWidth!==e||this.currentHeight!==t}resize(e,t){if(e<=0||t<=0)return;let n=this.device.limits.maxTextureDimension2D;e=Math.min(e,n),t=Math.min(t,n),this.currentWidth=e,this.currentHeight=t,this.depthTexture.destroy(),this.objectIdTexture.destroy(),this.depthTexture=this.device.createTexture({size:{width:e,height:t},format:this.depthFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,sampleCount:this.sampleCount>1?this.sampleCount:1}),this.depthTextureView=this.depthTexture.createView(),this.depthOnlyTextureView=this.depthTexture.createView({aspect:`depth-only`}),this.stencilTextureView=this.depthTexture.createView({aspect:`stencil-only`}),this.objectIdTexture=this.device.createTexture({size:{width:e,height:t},format:this.objectIdFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING,sampleCount:this.sampleCount>1?this.sampleCount:1}),this.objectIdTextureView=this.objectIdTexture.createView(),this.multisampleTexture&&this.multisampleTexture.destroy(),this.sampleCount>1?(this.multisampleTexture=this.device.createTexture({size:{width:e,height:t},format:this.colorFormat,usage:GPUTextureUsage.RENDER_ATTACHMENT,sampleCount:this.sampleCount}),this.multisampleTextureView=this.multisampleTexture.createView()):(this.multisampleTexture=null,this.multisampleTextureView=null)}getPipeline(){return this.pipeline}getInstancedPipeline(){return this.instancedPipeline}getInstancedTransparentPipeline(){if(!this.instancedTransparentPipeline&&!this.instancedTransparentPipelineTried&&this.makeInstancedTransparentPipeline){this.instancedTransparentPipelineTried=!0,this.device.pushErrorScope(`validation`);try{this.instancedTransparentPipeline=this.makeInstancedTransparentPipeline()}catch(e){console.warn(`[RenderPipeline] transparent instanced pipeline unavailable; instanced overlays will not blend:`,e),this.instancedTransparentPipeline=null}this.device.popErrorScope().then(e=>{e&&(console.warn(`[RenderPipeline] transparent instanced pipeline failed validation; instanced overlays will not blend:`,e.message),this.instancedTransparentPipeline=null)}).catch(()=>{})}return this.instancedTransparentPipeline}getSelectionPipeline(){return this.selectionPipeline}getTransparentPipeline(){return this.transparentPipeline}getGhostPipeline(e,t){return this.ghostPipelines.has(e)||(this.ghostPipelines.set(e,null),this.makeGhostPipelineAsync?.(e).then(n=>{this.ghostPipelines.set(e,n),t()},e=>console.warn(`[Pipeline] ghost pipeline build failed; X-Ray ghosts stay on the transparent pipeline:`,e))),this.ghostPipelines.get(e)??null}getOverlayPipeline(){return this.overlayPipeline??=this.makeOverlayPipeline()}getTexturedPipeline(){return this.texturedPipeline}createTexturedBindGroup(e,t,n){return this.device.createBindGroup({layout:this.texturedBindGroupLayout,entries:[{binding:0,resource:{buffer:e}},{binding:1,resource:t},{binding:2,resource:n}]})}getDepthTextureView(){return this.depthTextureView}getDepthOnlyTextureView(){return this.depthOnlyTextureView}getStencilTextureView(){return this.stencilTextureView}getDepthFormat(){return this.depthFormat}getObjectIdTextureView(){return this.objectIdTextureView}getMultisampleTextureView(){return this.multisampleTextureView}getSampleCount(){return this.sampleCount}getBindGroup(){return this.bindGroup}getBindGroupLayout(){return this.bindGroupLayout}getUniformBufferSize(){return re}destroyed=!1;destroy(){this.destroyed||(this.destroyed=!0,this.depthTexture.destroy(),this.objectIdTexture.destroy(),this.multisampleTexture?.destroy(),this.multisampleTexture=null,this.multisampleTextureView=null,this.uniformBuffer.destroy(),this.environmentBuffer.destroy(),this.shadowUniformBuffer.destroy(),this.selectionColorUniform.destroy(),this.dummyShadowTexture.destroy(),this.emptyEntityColorTable.destroy())}};Y={DAMPING_FACTOR:.92,MIN_VELOCITY_THRESHOLD:.001,FIRST_PERSON_SPEED:.1,ORBIT_SENSITIVITY:.01,PAN_SPEED_MULTIPLIER:.001,ZOOM_SENSITIVITY:.001,MAX_ZOOM_DELTA:.1,MIN_PERSPECTIVE_DISTANCE:1e-5,DEFAULT_POSITION:{x:50,y:50,z:100},DEFAULT_TARGET:{x:0,y:0,z:0},DEFAULT_UP:{x:0,y:1,z:0},DEFAULT_FOV:Math.PI/4,DEFAULT_NEAR:.1,DEFAULT_FAR:1e5,MAX_NEAR_FAR_RATIO:1e4,NEAR_DISTANCE_FACTOR:.001,FAR_DISTANCE_MULTIPLIER:10,MIN_PHI:.01,MAX_PHI:Math.PI-.01,POLE_THRESHOLD:.05,DEFAULT_ANIMATION_DURATION:500,QUICK_ANIMATION_DURATION:300,FIT_DISTANCE_MULTIPLIER:2,FRAME_PADDING_MULTIPLIER:1.2,ZOOM_EXTENT_PADDING:1.5,ISOMETRIC_OFFSET:{right:.6,up:.5,front:.6}};wt={UNIFORM_BUFFER_SIZE:336,FLAGS_BYTE_OFFSET:176,DEFAULT_SAMPLE_COUNT:4,DEPTH_FORMAT:`depth24plus-stencil8`};X={BUFFER_SIZE_SAFETY_FACTOR:.9,FALLBACK_MAX_BUFFER_SIZE:0x10000000,BYTES_PER_VERTEX:28,BYTES_PER_INDEX:4};Tt=.01;function Et(e,t){return Number.isFinite(e)&&e>=t}function Dt(e){return Number.isFinite(e.x)&&Number.isFinite(e.y)&&Number.isFinite(e.z)}function Ot(e){return Number.isFinite(e)?Math.max(Tt,e):null}function kt(...e){for(let t of e)if(!Number.isFinite(t))return!1;return!0}function At(e,t,n,r){return kt(e,t,n,r)&&n>0&&r>0}function jt(e,t){return kt(e.x,e.y,e.z,t.x,t.y,t.z)&&t.x>=e.x&&t.y>=e.y&&t.z>=e.z}function Mt(e,t){let n=_.cross(e,t),r=Math.sqrt(n.x*n.x+n.y*n.y+n.z*n.z),i=1/r;return Number.isFinite(r)&&r>1e-10?{x:n.x*i,y:n.y*i,z:n.z*i}:{x:0,y:0,z:0}}function Nt(e){let t=[e.position.x,e.position.y,e.position.z,e.target.x,e.target.y,e.target.z];return t.every(Number.isFinite)?Math.max(...t.map(Math.abs)):1/0}function Pt(e,t){let n=Nt(e);return n<=1e9||Number.isFinite(n)&&Number.isFinite(Nt(t))&&n<Nt(t)}function Ft(e,t){return{position:{...e.camera.position},target:{...e.camera.target},orthoSize:e.orthoSize,pivot:t?{...t}:null}}function It(e,t,n){return Pt(e.camera,n)||e.projectionMode===`orthographic`&&Number.isFinite(Nt(e.camera))&&[`x`,`y`,`z`].every(t=>e.camera.position[t]===n.position[t]&&e.camera.target[t]===n.target[t])?!0:(Object.assign(e.camera.position,n.position),Object.assign(e.camera.target,n.target),e.orthoSize=n.orthoSize,t&&n.pivot&&Object.assign(t,n.pivot),!1)}function Lt(e,t,n){e.orthoSize=n,e.camera.position.x=e.camera.target.x+t.x,e.camera.position.y=e.camera.target.y+t.y,e.camera.position.z=e.camera.target.z+t.z}function Rt(e,t,n,r,i,a){let o=n*(1-i),s=a?o:o*.5,c=a?n:Math.max(Y.MIN_PERSPECTIVE_DISTANCE,n-o*.5),l={x:r.x*s,y:r.y*s,z:r.z*s};for(let n of t?[e.camera.target,t]:[e.camera.target])n.x+=l.x,n.y+=l.y,n.z+=l.z;let u=e.camera.target;Object.assign(e.camera.position,{x:u.x-r.x*c,y:u.y-r.y*c,z:u.z-r.z*c})}function zt(e,t,n,r,i,a,o,s,c){if(!Dt(e.camera.up))return;let l=a/s*2-1,u=1-o/c*2,d=Mt(r,e.camera.up),f=_.cross(d,r),p=e.projectionMode===`orthographic`?e.orthoSize:n*Math.tan(e.camera.fov/2),m=p*e.camera.aspect,h=e.camera.target,g={x:h.x+d.x*l*m+f.x*u*p,y:h.y+d.y*l*m+f.y*u*p,z:h.z+d.z*l*m+f.z*u*p},v=1-i;h.x+=(g.x-h.x)*v,h.y+=(g.y-h.y)*v,h.z+=(g.z-h.z)*v}function Bt(e,t){return{x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}}function Vt(e){return Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z)}function Ht(e,t){return{x:e.x*t,y:e.y*t,z:e.z*t}}function Ut(e){let t=Vt(e);return Number.isFinite(t)&&t>1e-10?Ht(e,1/t):{x:0,y:0,z:0}}function Wt(e,t){return{x:e.y*t.z-e.z*t.y,y:e.z*t.x-e.x*t.z,z:e.x*t.y-e.y*t.x}}function Gt(e,t){return e.x*t.x+e.y*t.y+e.z*t.z}function Kt(e,t,n){let r=Math.cos(n),i=Math.sin(n),a=Gt(t,e),o=Wt(t,e);return{x:e.x*r+o.x*i+t.x*a*(1-r),y:e.y*r+o.y*i+t.y*a*(1-r),z:e.z*r+o.z*i+t.z*a*(1-r)}}var qt=Math.cos(.01);function Jt(e){let t=Vt(e);if(t<1e-10)return e;let n=e.y/t;if(Math.abs(n)<=qt)return e;let r=Math.sign(n)*qt,i=e.x*e.x+e.z*e.z;if(i<1e-20)return e;let a=t*Math.sqrt(1-r*r)/Math.sqrt(i);return{x:e.x*a,y:r*t,z:e.z*a}}function Yt(e,t){e.x+=t.x,e.y+=t.y,e.z+=t.z}function Xt(e,t){e.x=t.x,e.y=t.y,e.z=t.z}function Zt(e,t){let n=Math.acos(Math.max(-1,Math.min(1,e.y/t)));return{theta:Math.sin(n)>Y.POLE_THRESHOLD?Math.atan2(e.x,e.z):0,phi:n}}function Qt(e,t,n,r){let i=Math.sin(r);return{x:e.x+t*i*Math.sin(n),y:e.y+t*Math.cos(r),z:e.z+t*i*Math.cos(n)}}function $t(e){return Math.max(Y.MIN_PHI,Math.min(Y.MAX_PHI,e))}var en=class{state;updateMatrices;orbitCenter=null;interactionMode=`all`;constructor(e,t){this.state=e,this.updateMatrices=t}setInteractionMode(e){this.interactionMode=e}setOrbitCenter(e){this.orbitCenter=e?{...e}:null}orbit(e,t){if(!kt(e,t)||this.interactionMode===`pan`||this.interactionMode===`none`)return!1;this.state.camera.up={x:0,y:1,z:0};let n=-e*Y.ORBIT_SENSITIVITY,r=-t*Y.ORBIT_SENSITIVITY,i=Bt(this.state.camera.target,this.state.camera.position),a=Vt(i),o=a>1e-6&&Math.abs(i.y)/a>.99?this.state.camera.target:this.orbitCenter;if(o!==null)this.orbitAroundExternalPivot(o,n,r);else{let e=this.rotateAroundPivot(this.state.camera.position,this.state.camera.target,n,r);Xt(this.state.camera.position,e)}return this.updateMatrices(),!0}rotateAroundPivot(e,t,n,r){let i=Bt(e,t),a=Vt(i);if(!Et(a,1e-6))return{...e};let{theta:o,phi:s}=Zt(i,a);return Qt(t,a,o+n,$t(s+r))}orbitAroundExternalPivot(e,t,n){let r=Bt(this.state.camera.position,e),i=Vt(r);if(!Et(i,1e-6))return;let a=Bt(this.state.camera.target,this.state.camera.position);if(!Et(Vt(a),0))return;let o={x:0,y:1,z:0};r=Kt(r,o,t),a=Kt(a,o,t);let s=Ht(r,1/i),c=Math.acos(Math.max(-1,Math.min(1,s.y))),l=$t(c+n)-c;if(Math.abs(l)>1e-10){let e=Ut({x:r.z,y:0,z:-r.x});r=Kt(r,e,l),a=Kt(a,e,l)}a=Jt(a);let u={x:e.x+r.x,y:e.y+r.y,z:e.z+r.z};Xt(this.state.camera.position,u),Xt(this.state.camera.target,{x:u.x+a.x,y:u.y+a.y,z:u.z+a.z})}pan(e,t){if(!kt(e,t)||this.interactionMode===`orbit`||this.interactionMode===`none`)return!1;let n=Bt(this.state.camera.position,this.state.camera.target),r=Vt(n);if(!Et(r,0))return!1;let i=n.x*n.x+n.z*n.z,a;if(i>1e-12)a={x:0,y:1,z:0};else{let e=this.state.camera.up,t=Math.sqrt(e.x*e.x+e.z*e.z);a=Dt(e)&&t>1e-6?{x:e.x/t,y:0,z:e.z/t}:{x:0,y:0,z:1}}let o=Ut(Wt(n,a)),s=Ut(Wt(o,n)),c=r*Y.PAN_SPEED_MULTIPLIER,l={x:(o.x*e+s.x*t)*c,y:(o.y*e+s.y*t)*c,z:(o.z*e+s.z*t)*c};return this.translateAll(l),this.updateMatrices(),!0}zoom(e,t,n,r,i,a){if(!Number.isFinite(e)||this.interactionMode!==`all`)return!1;let o=Bt(this.state.camera.position,this.state.camera.target),s=Vt(o);if(!Et(s,Y.MIN_PERSPECTIVE_DISTANCE))return!1;let c=1+Math.sign(e)*Math.min(Math.abs(e)*Y.ZOOM_SENSITIVITY,Y.MAX_ZOOM_DELTA),l=Ht(o,-1/s),u=t!==void 0&&n!==void 0&&r!==void 0&&i!==void 0&&At(t,n,r,i)?{mouseX:t,mouseY:n,canvasWidth:r,canvasHeight:i}:null,d=Ft(this.state,this.orbitCenter);if(this.state.projectionMode===`orthographic`){let e=Ot(this.state.orthoSize*c);if(e===null)return!1;let t=e/this.state.orthoSize;u&&zt(this.state,o,s,l,t,u.mouseX,u.mouseY,u.canvasWidth,u.canvasHeight),Lt(this.state,o,e)}else u&&zt(this.state,o,s,l,c,u.mouseX,u.mouseY,u.canvasWidth,u.canvasHeight),Rt(this.state,this.orbitCenter,s,l,c,a);return It(this.state,this.orbitCenter,d)?(this.updateMatrices(),!0):!1}translateAll(e){Yt(this.state.camera.target,e),Yt(this.state.camera.position,e),this.orbitCenter&&Yt(this.orbitCenter,e)}};function tn(e,t){return{x:(e.x+t.x)/2,y:(e.y+t.y)/2,z:(e.z+t.z)/2}}function nn(e){let t=e.camera.aspect;return Number.isFinite(t)&&t>0?t:1}function rn(e){let t=tn(e.min,e.max),n=[];for(let r of[e.min.x,e.max.x])for(let i of[e.min.y,e.max.y])for(let a of[e.min.z,e.max.z])n.push({x:r-t.x,y:i-t.y,z:a-t.z});return n}function an(e,t){return Math.max(t.x-e.x,t.y-e.y,t.z-e.z)}function on(e,t,n){let r=0;for(let i of rn(e)){let e=Math.abs(_.dot(i,t.right)),a=Math.abs(_.dot(i,t.up));r=Math.max(r,a,e/n)}return r}function sn(e,t,n,r){if(e.projectionMode===`orthographic`)return Math.max(.01,on(t,n,nn(e)))*r}function cn(e,t,n,r){let i=Math.tan(e.camera.fov/2),a=nn(e)*i,o=0;for(let e of rn(t)){let t=_.dot(e,n.forward),r=Math.abs(_.dot(e,n.right))/a,s=Math.abs(_.dot(e,n.up))/i;o=Math.max(o,r-t,s-t)}return o*r}function ln(e,t,n,r){let i=Math.tan(e.camera.fov/2),a=nn(e)*i,o=0;for(let e of rn(t)){let t=_.dot(e,n.forward),s=Math.abs(_.dot(e,n.right))/a,c=Math.abs(_.dot(e,n.up))/i;o=Math.max(o,r*s-t,r*c-t)}return o}function un(e,t,n,r,i=!1){let a=g(e.camera.position,e.camera.target,e.camera.up),o=i&&e.projectionMode===`perspective`?ln(e,t,a,r):cn(e,t,a,r);return{position:{x:n.x-a.forward.x*o,y:n.y-a.forward.y*o,z:n.z-a.forward.z*o},target:n,orthoSize:sn(e,t,a,r),fitDistance:o}}function dn(e,t){if(!kt(t.x,t.y,t.z))return null;let n={x:e.camera.position.x-e.camera.target.x,y:e.camera.position.y-e.camera.target.y,z:e.camera.position.z-e.camera.target.z};return{position:{x:t.x+n.x,y:t.y+n.y,z:t.z+n.z},target:t}}function fn(e,t,n,r){if(!jt(t,n))return null;let i=tn(t,n);if(an(t,n)<1e-6)return dn(e,i);let a=r!==void 0&&Number.isFinite(r)&&r>=1,o=a?r:Y.FRAME_PADDING_MULTIPLIER;return un(e,{min:t,max:n},i,o,a)}function pn(e,t,n){if(!jt(t,n))return null;let r=tn(t,n),i=an(t,n),a=Math.sqrt((e.camera.position.x-e.camera.target.x)**2+(e.camera.position.y-e.camera.target.y)**2+(e.camera.position.z-e.camera.target.z)**2);if(i<1e-6&&Et(a,1e-10)){let t=dn(e,r);if(t)return{...t,fitDistance:a}}return un(e,{min:t,max:n},r,Y.ZOOM_EXTENT_PADDING)}var mn=Math.sin(.01),hn=Math.cos(.01);function gn(e){let t={x:e.camera.position.x-e.camera.target.x,y:e.camera.position.y-e.camera.target.y,z:e.camera.position.z-e.camera.target.z},n=Math.sqrt(t.x*t.x+t.y*t.y+t.z*t.z)/2;return{min:{x:e.camera.target.x-n,y:e.camera.target.y-n,z:e.camera.target.z-n},max:{x:e.camera.target.x+n,y:e.camera.target.y+n,z:e.camera.target.z+n}}}function _n(e,t){let n=t||gn(e);return jt(n.min,n.max)?n:(console.warn(`[Camera] Non-finite bounds for setPresetView; keeping current view`),null)}function vn(e,t,n,r,i){let a=tn(n.min,n.max),o,s={x:0,y:1,z:0},c=Number.isFinite(i)?i:0,l=c===0?1:Math.cos(c),u=c===0?0:Math.sin(c);switch(t){case`top`:{let e=mn,t=hn,n=([0,Math.PI/2,Math.PI,-Math.PI/2][r]??0)+c;o={x:e*Math.sin(n),y:t,z:e*Math.cos(n)},s={x:0,y:1,z:0};break}case`bottom`:{let e=mn,t=hn,n=([Math.PI,Math.PI/2,0,-Math.PI/2][r]??0)+c;o={x:e*Math.sin(n),y:-t,z:e*Math.cos(n)},s={x:0,y:1,z:0};break}case`front`:o={x:u,y:0,z:l},s={x:0,y:1,z:0};break;case`back`:o={x:-u,y:0,z:-l},s={x:0,y:1,z:0};break;case`left`:o={x:-l,y:0,z:u},s={x:0,y:1,z:0};break;case`right`:o={x:l,y:0,z:-u},s={x:0,y:1,z:0}}let d=g(o,{x:0,y:0,z:0},s),f=cn(e,n,d,Y.ZOOM_EXTENT_PADDING);return{position:{x:a.x-d.forward.x*f,y:a.y-d.forward.y*f,z:a.z-d.forward.z*f},target:a,up:s}}function yn(e,t,n,r,i,a){e.camera.position={...t},e.camera.target={...n},r&&(e.camera.up={...r});let o=i===void 0?null:Ot(i);o!==null&&(e.orthoSize=o),a()}var bn=1e3/60;function xn(e,t){let n=(Number.isFinite(e)&&e>0?Math.min(e,100):bn)/bn,r=t**n;return{travel:t===1?n:(1-r)/(1-t),decay:r}}var Sn=class{state;updateMatrices;controls;projection;velocity={orbit:{x:0,y:0},pan:{x:0,y:0},zoom:0};damping=.92;minVelocity=.001;animationStartTime=0;animationDuration=0;animationStartPos=null;animationStartTarget=null;animationEndPos=null;animationEndTarget=null;animationStartUp=null;animationEndUp=null;animationStartOrthoSize=null;animationEndOrthoSize=null;animationEasing=null;lastPresetView=null;presetViewRotation=0;constructor(e,t,n,r){this.state=e,this.updateMatrices=t,this.controls=n,this.projection=r}addOrbitVelocity(e,t){kt(e,t)&&(this.velocity.orbit.x+=e*.001,this.velocity.orbit.y+=t*.001)}addPanVelocity(e,t,n){kt(e,t,n)&&(this.velocity.pan.x+=e*n*.1,this.velocity.pan.y+=t*n*.1)}addZoomVelocity(e){Number.isFinite(e)&&(this.velocity.zoom+=e*.1)}resetPresetTracking(){this.lastPresetView=null,this.presetViewRotation=0}update(e){let t=xn(e,this.damping),n=!1;if(this.animationStartTime>0&&this.animationDuration>0){let e=Date.now()-this.animationStartTime,t=Math.min(e/this.animationDuration,1);if(t<1&&this.animationStartPos&&this.animationEndPos&&this.animationStartTarget&&this.animationEndTarget&&this.animationEasing){let e=this.animationEasing(t);if(this.state.camera.position.x=this.animationStartPos.x+(this.animationEndPos.x-this.animationStartPos.x)*e,this.state.camera.position.y=this.animationStartPos.y+(this.animationEndPos.y-this.animationStartPos.y)*e,this.state.camera.position.z=this.animationStartPos.z+(this.animationEndPos.z-this.animationStartPos.z)*e,this.state.camera.target.x=this.animationStartTarget.x+(this.animationEndTarget.x-this.animationStartTarget.x)*e,this.state.camera.target.y=this.animationStartTarget.y+(this.animationEndTarget.y-this.animationStartTarget.y)*e,this.state.camera.target.z=this.animationStartTarget.z+(this.animationEndTarget.z-this.animationStartTarget.z)*e,this.animationStartOrthoSize!==null&&this.animationEndOrthoSize!==null){let t=Ot(this.animationStartOrthoSize+(this.animationEndOrthoSize-this.animationStartOrthoSize)*e);t!==null&&(this.state.orthoSize=t)}if(this.animationStartUp&&this.animationEndUp){let t=this.animationStartUp.x+(this.animationEndUp.x-this.animationStartUp.x)*e,n=this.animationStartUp.y+(this.animationEndUp.y-this.animationStartUp.y)*e,r=this.animationStartUp.z+(this.animationEndUp.z-this.animationStartUp.z)*e,i=Math.sqrt(t*t+n*n+r*r);i>1e-4&&(this.state.camera.up.x=t/i,this.state.camera.up.y=n/i,this.state.camera.up.z=r/i)}this.updateMatrices(),n=!0}else{if(this.animationEndPos&&(this.state.camera.position.x=this.animationEndPos.x,this.state.camera.position.y=this.animationEndPos.y,this.state.camera.position.z=this.animationEndPos.z),this.animationEndTarget&&(this.state.camera.target.x=this.animationEndTarget.x,this.state.camera.target.y=this.animationEndTarget.y,this.state.camera.target.z=this.animationEndTarget.z),this.animationEndUp&&(this.state.camera.up.x=this.animationEndUp.x,this.state.camera.up.y=this.animationEndUp.y,this.state.camera.up.z=this.animationEndUp.z),this.animationEndOrthoSize!==null){let e=Ot(this.animationEndOrthoSize);e!==null&&(this.state.orthoSize=e)}this.updateMatrices(),this.animationStartTime=0,this.animationDuration=0,this.animationStartPos=null,this.animationEndPos=null,this.animationStartTarget=null,this.animationEndTarget=null,this.animationStartUp=null,this.animationEndUp=null,this.animationStartOrthoSize=null,this.animationEndOrthoSize=null,this.animationEasing=null}}return(Math.abs(this.velocity.orbit.x)>this.minVelocity||Math.abs(this.velocity.orbit.y)>this.minVelocity)&&(this.controls.orbit(this.velocity.orbit.x*100*t.travel,this.velocity.orbit.y*100*t.travel)?(this.resetPresetTracking(),this.velocity.orbit.x*=t.decay,this.velocity.orbit.y*=t.decay,n=!0):(this.velocity.orbit.x=0,this.velocity.orbit.y=0)),(Math.abs(this.velocity.pan.x)>this.minVelocity||Math.abs(this.velocity.pan.y)>this.minVelocity)&&(this.controls.pan(this.velocity.pan.x*1e3*t.travel,this.velocity.pan.y*1e3*t.travel)?(this.velocity.pan.x*=t.decay,this.velocity.pan.y*=t.decay,n=!0):(this.velocity.pan.x=0,this.velocity.pan.y=0)),Math.abs(this.velocity.zoom)>this.minVelocity&&(this.controls.zoom(this.velocity.zoom*1e3*t.travel)?(this.velocity.zoom*=t.decay,n=!0):this.velocity.zoom=0),n}async framePoint(e,t=300){let n=dn(this.state,e);if(n)return this.animateTo(n.position,n.target,t,n.orthoSize)}async frameBounds(e,t,n=300,r){let i=fn(this.state,e,t,r);if(i)return this.animateTo(i.position,i.target,n,i.orthoSize)}async zoomExtent(e,t,n=300){let r=pn(this.state,e,t);if(r)return this.projection.updateNearFarPlanes(r.fitDistance),this.animateTo(r.position,r.target,n,r.orthoSize)}setPresetView(e,t,n){let r=_n(this.state,t);if(!r)return;this.lastPresetView===e?this.presetViewRotation=(this.presetViewRotation+1)%4:(this.lastPresetView=e,this.presetViewRotation=0);let i=vn(this.state,e,r,this.presetViewRotation,n);this.animateToWithUp(i.position,i.target,i.up,300)}async animateTo(e,t,n=500,r){if(n<=0)this.reset(),yn(this.state,e,t,null,r,this.updateMatrices);else return this.animationStartPos={...this.state.camera.position},this.animationStartTarget={...this.state.camera.target},this.animationEndPos=e,this.animationEndTarget=t,this.animationStartUp=null,this.animationEndUp=null,r===void 0?(this.animationStartOrthoSize=null,this.animationEndOrthoSize=null):(this.animationStartOrthoSize=this.state.orthoSize,this.animationEndOrthoSize=r),this.animationDuration=n,this.animationStartTime=Date.now(),this.animationEasing=this.easeOutCubic,new Promise(e=>{let t=()=>{this.animationStartTime===0?e():requestAnimationFrame(t)};t()})}async animateToWithUp(e,t,n,r=500){if(r<=0)this.reset(),yn(this.state,e,t,n,void 0,this.updateMatrices);else return this.velocity.orbit.x=0,this.velocity.orbit.y=0,this.velocity.pan.x=0,this.velocity.pan.y=0,this.velocity.zoom=0,this.animationStartPos={...this.state.camera.position},this.animationStartTarget={...this.state.camera.target},this.animationStartUp={...this.state.camera.up},this.animationEndPos=e,this.animationEndTarget=t,this.animationEndUp=n,this.animationStartOrthoSize=null,this.animationEndOrthoSize=null,this.animationDuration=r,this.animationStartTime=Date.now(),this.animationEasing=this.easeOutCubic,new Promise(e=>{let t=()=>{this.animationStartTime===0?e():requestAnimationFrame(t)};t()})}easeOutCubic(e){return 1-(1-e)**3}stopInertia(){this.velocity.orbit.x=0,this.velocity.orbit.y=0,this.velocity.pan.x=0,this.velocity.pan.y=0,this.velocity.zoom=0}reset(){this.stopInertia(),this.animationStartTime=0,this.animationDuration=0,this.animationStartPos=null,this.animationStartTarget=null,this.animationEndPos=null,this.animationEndTarget=null,this.animationStartUp=null,this.animationEndUp=null,this.animationStartOrthoSize=null,this.animationEndOrthoSize=null,this.animationEasing=null,this.lastPresetView=null,this.presetViewRotation=0}};function Cn(e){if(!e.isAvailable())return()=>null;let t=e.snapshot(),n=t.getViewProjection().m,r=e=>({z:n[2]*e[0]+n[6]*e[1]+n[10]*e[2]+n[14],w:n[3]*e[0]+n[7]*e[1]+n[11]*e[2]+n[15]});return(e,n)=>{let i=t.worldToRelative([e.x,e.y,e.z]),a=t.worldToRelative([n.x,n.y,n.z]);if(![...i,...a].every(Number.isFinite))return null;let o=r(i),s=r(a);if(![o.z,o.w,s.z,s.w].every(Number.isFinite))return null;let c=0,l=1;for(let[e,t]of[[o.w,s.w],[o.w+o.z,s.w+s.z],[o.w-o.z,s.w-s.z]]){let n=t-e;if(n===0){if(e<0)return null;continue}let r=-e/n;if(n>0?c=Math.max(c,r):l=Math.min(l,r),c>l)return null}return o.w+(s.w-o.w)*((c+l)/2)>0?[c,l]:null}}function wn(e,t,n,r){return!(Number.isFinite(t)&&t>0)||!Number.isFinite(e)?r+n/2:e/t*n+r}var Tn=class{state;updateMatrices;relativeToEyeFrame;constructor(e,t,n){this.state=e,this.updateMatrices=t,this.relativeToEyeFrame=n}projectToScreen(e,t,n){if(!this.relativeToEyeFrame.isAvailable())return null;let[r,i,a]=this.relativeToEyeFrame.worldToRelative([e.x,e.y,e.z]);if(![r,i,a,t,n].every(Number.isFinite))return null;let o=this.relativeToEyeFrame.getViewProjection().m,s=o[0]*r+o[4]*i+o[8]*a+o[12],c=o[1]*r+o[5]*i+o[9]*a+o[13],l=o[2]*r+o[6]*i+o[10]*a+o[14],u=o[3]*r+o[7]*i+o[11]*a+o[15];if(u<=0)return null;let d=s/u,f=c/u,p=l/u;return p<-1||p>1?null:{x:(d+1)*.5*t,y:(1-f)*.5*n}}unprojectToRay(e,t,n,r){let i=wn(e,n,2,-1),a=wn(t,r,-2,1),o=g(this.state.camera.position,this.state.camera.target,this.state.camera.up);if(this.state.projectionMode===`orthographic`){let e=Number.isFinite(this.state.orthoSize)?this.state.orthoSize:50,t=e*(Number.isFinite(this.state.camera.aspect)?this.state.camera.aspect:1);return{origin:{x:o.eye.x+o.right.x*i*t+o.up.x*a*e,y:o.eye.y+o.right.y*i*t+o.up.y*a*e,z:o.eye.z+o.right.z*i*t+o.up.z*a*e},direction:o.forward}}if(!this.relativeToEyeFrame.isAvailable())return{origin:{...o.eye},direction:o.forward};let s=_.invert(this.relativeToEyeFrame.getViewProjection());if(!s)return{origin:{...o.eye},direction:o.forward};let c=_.transformPoint(s,{x:i,y:a,z:.5}),[l,u,d]=this.relativeToEyeFrame.getCameraWorld(),f={x:l,y:u,z:d},p=_.normalize(c);return p.x===0&&p.y===0&&p.z===0?{origin:f,direction:o.forward}:{origin:f,direction:p}}fitToBounds(e,t){if(!jt(e,t))return;let n={x:(e.x+t.x)/2,y:(e.y+t.y)/2,z:(e.z+t.z)/2},r={x:t.x-e.x,y:t.y-e.y,z:t.z-e.z},i=Math.max(r.x,r.y,r.z)*2;this.state.camera.target=n,this.state.camera.position={x:n.x+i*.6,y:n.y+i*.5,z:n.z+i*.6},this.updateMatrices()}updateNearFarPlanes(e){}},En=class{state;updateMatrices;isFirstPersonMode=!1;walkVelocity={x:0,z:0};constructor(e,t){this.state=e,this.updateMatrices=t}setEnabled(e){this.isFirstPersonMode=e,e||this.stop()}stop(){this.walkVelocity.x=0,this.walkVelocity.z=0}move(e,t,n){if(!this.isFirstPersonMode||!kt(e,t))return;let r={x:this.state.camera.target.x-this.state.camera.position.x,z:this.state.camera.target.z-this.state.camera.position.z},i=Math.sqrt(r.x*r.x+r.z*r.z);if(!Et(i,1e-10))return;let a=r.x/i,o=r.z/i,s=-o,c=a,l=a*e+s*t,u=o*e+c*t;this.walkVelocity.x+=(l-this.walkVelocity.x)*.15,this.walkVelocity.z+=(u-this.walkVelocity.z)*.15;let d={x:this.state.camera.position.x-this.state.camera.target.x,y:this.state.camera.position.y-this.state.camera.target.y,z:this.state.camera.position.z-this.state.camera.target.z},f=Math.sqrt(d.x*d.x+d.y*d.y+d.z*d.z);if(!Et(f,0))return;let p=Math.max(.02,f*.004),m=this.walkVelocity.x*p,h=this.walkVelocity.z*p;this.state.camera.position.x+=m,this.state.camera.position.z+=h,this.state.camera.target.x+=m,this.state.camera.target.z+=h,this.updateMatrices()}};function Dn(e,t){let n=g(e.camera.position,e.camera.target,e.camera.up).eye;[n.x,n.y,n.z].some(e=>!Number.isFinite(e)||Math.abs(e)>1e9)||!e.projMatrix.m.every(Number.isFinite)||!e.viewMatrix.m.every(Number.isFinite)?t.invalidate():t.update(n,e.projMatrix,e.viewMatrix)}function On(e){let t=e.camera.position.x-e.camera.target.x,n=e.camera.position.y-e.camera.target.y,r=e.camera.position.z-e.camera.target.z,i=Math.sqrt(t*t+n*n+r*r),a=Number.isFinite(i)?i:1;if(e.viewMatrix=_.lookAt(e.camera.position,e.camera.target,e.camera.up),e.projectionMode===`orthographic`){let t=kn(e,a);e.camera.near=t.near,e.camera.far=t.far;let n=Ot(e.orthoSize)??50,r=n*e.camera.aspect;e.projMatrix=_.orthographicReverseZ(-r,r,-n,n,e.camera.near,e.camera.far)}else e.camera.near=Math.max(.01,a*.001),e.camera.far=Math.max(a*10,1e3),e.projMatrix=_.perspectiveReverseZ(e.camera.fov,e.camera.aspect,e.camera.near,e.camera.far);e.viewProjMatrix=_.multiply(e.projMatrix,e.viewMatrix)}function kn(e,t){let n=e.sceneBounds;if(!n)return{near:-Math.max(t,500),far:Math.max(t,500)};let r=(n.min.x+n.max.x)/2,i=(n.min.y+n.max.y)/2,a=(n.min.z+n.max.z)/2,o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.max.z-n.min.z,l=Math.sqrt(o*o+s*s+c*c)/2,u=e.camera.position,d=e.camera.target.x-u.x,f=e.camera.target.y-u.y,p=e.camera.target.z-u.z,m=Math.sqrt(d*d+f*f+p*p),h=l*.1+1,g,_;if(Number.isFinite(m)&&m>1e-8){d/=m,f/=m,p/=m;let e=(r-u.x)*d+(i-u.y)*f+(a-u.z)*p;g=e-l-h,_=e+l+h}else{let e=Math.sqrt((r-u.x)*(r-u.x)+(i-u.y)*(i-u.y)+(a-u.z)*(a-u.z))+l+h;g=-e,_=e}if(_-g<1&&(g-=.5,_+=.5),!Number.isFinite(g)||!Number.isFinite(_)){let e=Math.max(Number.isFinite(t)?t:0,500);return{near:-e,far:e}}return{near:g,far:_}}var An=class{state;animator;updateMatrices;constructor(e,t,n){this.state=e,this.animator=t,this.updateMatrices=n}getDistance(){let e={x:this.state.camera.position.x-this.state.camera.target.x,y:this.state.camera.position.y-this.state.camera.target.y,z:this.state.camera.position.z-this.state.camera.target.z};return Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z)}getRotation(){let e={x:this.state.camera.position.x-this.state.camera.target.x,y:this.state.camera.position.y-this.state.camera.target.y,z:this.state.camera.position.z-this.state.camera.target.z},t=Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z);if(!Et(t,1e-6))return{azimuth:0,elevation:0};let n=Math.asin(Math.max(-1,Math.min(1,e.y/t)))*180/Math.PI,r=this.state.camera.up.x,i=this.state.camera.up.y,a=this.state.camera.up.z,o=Math.sqrt(r*r+a*a),s;return o>.01?(s=(Math.atan2(-r,-a)*180/Math.PI+360)%360,n<-80&&i<0&&(s=(s+180)%360)):s=(Math.atan2(e.x,e.z)*180/Math.PI+360)%360,{azimuth:s,elevation:n}}setRotation(e,t){if(!kt(e,t))return;let n=this.state.camera.target,r={x:this.state.camera.position.x-n.x,y:this.state.camera.position.y-n.y,z:this.state.camera.position.z-n.z},i=Math.sqrt(r.x*r.x+r.y*r.y+r.z*r.z),a=Et(i,1e-6)?i:1;if(!kt(n.x,n.y,n.z))return;this.animator.reset();let o=(e%360+360)%360*Math.PI/180,s=Y.MIN_PHI,c=Math.max(s,Math.min(Math.PI-s,(90-t)*Math.PI/180)),l=Math.sin(c);this.state.camera.position={x:n.x+a*l*Math.sin(o),y:n.y+a*Math.cos(c),z:n.z+a*l*Math.cos(o)},this.state.camera.up={x:0,y:1,z:0},this.updateMatrices()}},jn=50,Mn=100,Nn=20*Math.PI/180,Pn=640;function Fn(e,t){let n={x:(e.min.x+e.max.x)/2,y:(e.min.y+e.max.y)/2,z:(e.min.z+e.max.z)/2},r=e.max.x-e.min.x,i=e.max.y-e.min.y,a=e.max.z-e.min.z,o=Math.max(r,i,a),s=Math.min(r,i,a),c=o/Math.max(s,o*1e-6),l=t.linearAspectThreshold??jn,u=t.linearMinLongest??Mn;if(c<=l||o<u){let e=o*2;return{kind:`compact`,aspect:c,target:n,position:{x:n.x+e*.6,y:n.y+e*.5,z:n.z+e*.6},up:{x:0,y:1,z:0},distance:e}}let d=In(r,i,a),f=t.viewportShortPx??Pn,p=Math.max(s,o*.01),m=Math.tan(t.fovY/2),h=p*f/(32*m),g=o*.05/Math.max(m,.05),_=o*.3,v=Ln(h,Math.min(g,_),_),y={x:0,y:1,z:0},b=d,x=Math.cos(Nn),S=Math.sin(Nn),C=Math.abs(b.y)>.5?{x:0,y:0,z:1}:y,w={x:b.x*x-C.x*S,y:b.y*x-C.y*S,z:b.z*x-C.z*S};return{kind:`linear`,aspect:c,target:n,position:{x:n.x-w.x*v,y:n.y-w.y*v,z:n.z-w.z*v},up:y,distance:v}}function In(e,t,n){return e>=t&&e>=n?{x:1,y:0,z:0}:n>=t?{x:0,y:0,z:1}:{x:0,y:1,z:0}}function Ln(e,t,n){return!Number.isFinite(e)||n<t?t:Math.min(Math.max(e,t),n)}var Rn=.02;function zn(e,t,n){let{position:r,target:i}=e;if(![t.x,t.y,t.z].every(Number.isFinite)||!(n>0&&n<1))return null;let a=i.x-r.x,o=i.y-r.y,s=i.z-r.z,c=Math.hypot(a,o,s);if(!(c>0)||!Number.isFinite(c))return null;let l={x:a/c,y:o/c,z:s/c},u=t.x-r.x,d=t.y-r.y,f=t.z-r.z,p=Math.hypot(u,d,f),m=u*l.x+d*l.y+f*l.z;if(!(p>0)||!(m>0))return null;let h=Math.max(p*(1-n),Rn*p/m),g=h<p?1-h/p:0,_={x:r.x+u*g,y:r.y+d*g,z:r.z+f*g},v=m*(1-g);return{position:_,target:{x:_.x+l.x*v,y:_.y+l.y*v,z:_.z+l.z*v}}}var Bn=class{state;controls;animator;projection;firstPerson;orientation;relativeToEyeFrame=new A;interactionMode=`all`;constructor(){this.state={camera:{position:{x:50,y:50,z:100},target:{x:0,y:0,z:0},up:{x:0,y:1,z:0},fov:Math.PI/4,aspect:1,near:.1,far:1e5},viewMatrix:_.identity(),projMatrix:_.identity(),viewProjMatrix:_.identity(),projectionMode:`perspective`,orthoSize:50,sceneBounds:null,orbitAnchorBounds:null};let e=()=>this.updateMatrices();this.controls=new en(this.state,e),this.projection=new Tn(this.state,e,this.relativeToEyeFrame),this.animator=new Sn(this.state,e,this.controls,this.projection),this.firstPerson=new En(this.state,e),this.orientation=new An(this.state,this.animator,e),this.updateMatrices()}updateMatrices(){On(this.state),Dn(this.state,this.relativeToEyeFrame)}setAspect(e){!Number.isFinite(e)||e<=0||e!==this.state.camera.aspect&&(this.state.camera.aspect=e,this.updateMatrices())}setPosition(e,t,n){this.state.camera.position={x:e,y:t,z:n},this.updateMatrices()}setTarget(e,t,n){this.state.camera.target={x:e,y:t,z:n},this.updateMatrices()}setUp(e,t,n){this.state.camera.up={x:e,y:t,z:n},this.updateMatrices()}setFOV(e){Number.isFinite(e)&&(this.state.camera.fov=Math.max(.01,Math.min(Math.PI-.01,e)),this.updateMatrices())}setOrbitCenter(e){this.controls.setOrbitCenter(e)}setInteractionMode(e){this.interactionMode=e,this.controls.setInteractionMode(e)}orbit(e,t,n=!1){this.controls.orbit(e,t)&&(this.animator.resetPresetTracking(),n&&this.animator.addOrbitVelocity(e,t))}pan(e,t,n=!1){let r=this.getDistance();this.controls.pan(e,t)&&n&&Et(r,0)&&this.animator.addPanVelocity(e,t,r*.001)}zoom(e,t=!1,n,r,i,a,o,s){if(Number.isFinite(e)&&!(s&&e<0&&!o&&this.zoomTowardSurface(e,s))&&this.controls.zoom(e,n,r,i,a,o)&&t){let t=Math.sign(e)*Math.min(Math.abs(e)*.001,.1);this.animator.addZoomVelocity(t)}}zoomTowardSurface(e,t){if(this.interactionMode!==`all`||this.state.projectionMode!==`perspective`)return!1;let n=Math.min(Math.abs(e)*Y.ZOOM_SENSITIVITY,Y.MAX_ZOOM_DELTA),r=zn(this.state.camera,t,n);return r?(Pt(r,this.state.camera)&&(Object.assign(this.state.camera.position,r.position),Object.assign(this.state.camera.target,r.target),this.updateMatrices()),!0):!1}fitToBounds(e,t){this.projection.fitToBounds(e,t)}update(e){return this.animator.update(e)}async framePoint(e,t=300){return this.animator.framePoint(e,t)}async frameBounds(e,t,n=300,r){return this.animator.frameBounds(e,t,n,r)}async zoomExtent(e,t,n=300){return this.animator.zoomExtent(e,t,n)}snapToFitPolicy(e){this.state.camera.position={...e.position},this.state.camera.target={...e.target},this.state.camera.up={...e.up},this.updateMatrices()}async applyFitPolicy(e,t=500){return this.animator.animateToWithUp({...e.position},{...e.target},{...e.up},t)}fitBoundsAdaptive(e,t){if(!jt(e.min,e.max))return{kind:`compact`,aspect:1,target:{...this.state.camera.target},position:{...this.state.camera.position},up:{...this.state.camera.up},distance:this.getDistance()};let n=Fn(e,{fovY:this.state.camera.fov,viewportShortPx:t?.viewportShortPx});return t?.animate?this.applyFitPolicy(n,t.duration??500):this.snapToFitPolicy(n),n}async animateTo(e,t,n=500){return this.animator.animateTo(e,t,n)}async animateToWithUp(e,t,n,r=500){return this.animator.animateToWithUp(e,t,n,r)}enableFirstPersonMode(e){this.firstPerson.setEnabled(e)}moveFirstPerson(e,t,n){this.firstPerson.move(e,t,n)}setPresetView(e,t,n){this.animator.setPresetView(e,t,n)}stopInertia(){this.animator.stopInertia()}reset(){this.controls.setOrbitCenter(null),this.animator.reset(),this.firstPerson.stop(),this.state.orbitAnchorBounds=null}getViewProjMatrix(){return{m:new Float32Array(this.state.viewProjMatrix.m)}}getProjMatrix(){return{m:new Float32Array(this.state.projMatrix.m)}}getRelativeToEyeFrame(){return this.relativeToEyeFrame}getPosition(){return{...this.state.camera.position}}getTarget(){return{...this.state.camera.target}}getUp(){return{...this.state.camera.up}}getFOV(){return this.state.camera.fov}getAspect(){return this.state.camera.aspect}getDistance(){return this.orientation.getDistance()}getRotation(){return this.orientation.getRotation()}setRotation(e,t){this.orientation.setRotation(e,t)}unprojectToRay(e,t,n,r){return this.projection.unprojectToRay(e,t,n,r)}projectToScreen(e,t,n){return this.projection.projectToScreen(e,t,n)}setProjectionMode(e){if(this.state.projectionMode!==e){if(e===`orthographic`){let e=Ot(this.getDistance()*Math.tan(this.state.camera.fov/2));e!==null&&(this.state.orthoSize=e)}this.state.projectionMode=e,this.updateMatrices()}}toggleProjectionMode(){this.setProjectionMode(this.state.projectionMode===`perspective`?`orthographic`:`perspective`)}getProjectionMode(){return this.state.projectionMode}getOrthoSize(){return this.state.orthoSize}setOrthoSize(e){let t=Ot(e);t!==null&&(this.state.orthoSize=t,this.updateMatrices())}setSceneBounds(e){this.state.sceneBounds=e,this.updateMatrices()}getSceneBounds(){return this.state.sceneBounds}setOrbitAnchorBounds(e){this.state.orbitAnchorBounds=e}getOrbitAnchorBounds(){return this.state.orbitAnchorBounds}};Vn=function(e,t){let n=e.appearanceSource;if(!n||n.kind!==`canonical-item`||n.indices!==e.indices||e.indices.length%3!=0||n.sourceIndices.length%3!=0||!Number.isSafeInteger(t)||t<0||t*3+2>=e.indices.length||n.cornerIndices&&n.cornerIndices.length!==e.indices.length)return;let r=t*3,i=[0,1,2].map(e=>n.cornerIndices?.[r+e]??r+e);if(i.some(e=>!Number.isSafeInteger(e)||e<0||e>=n.sourceIndices.length))return;let a=Math.floor(i[0]/3);if(!(i.some(e=>Math.floor(e/3)!==a)||new Set(i.map(e=>e%3)).size!==3))return a};Hn=function(e,t,n,r,i,a){let o=e.appearanceSource;if(!o||o.kind!==`canonical-item`||o.indices!==e.indices||e.geometryItemId===void 0||e.entityIds||e.indices.length%3!=0||t.length!==o.sourceIndices.length||n.length!==o.sourceIndices.length*2||r.length!==o.sourceIndices.length||i.length!==o.sourceIndices.length*3||(o.cornerIndices?o.cornerIndices.length!==e.indices.length:e.indices.length!==o.sourceIndices.length))throw Error(`Appearance preview requires matching canonical corner provenance. Reload the IFC model.`);for(let e=0;e<t.length;e++)if(t[e]!==o.sourceIndices[e])throw Error(`Appearance canonical source topology changed`);if(!Number.isSafeInteger(a)||a<=0||a>0x100000000)throw Error(`Appearance target vertex pool is invalid`);for(let e=0;e<r.length;e++)if(!Number.isSafeInteger(r[e])||r[e]<0||r[e]>=a)throw Error(`Appearance target topology is invalid`);let s=r instanceof Uint32Array?r:Uint32Array.from(r),c=e.indices.length,l=new Float32Array(c*3),u=new Float32Array(c*3),d=new Uint32Array(c),f=new Float32Array(c*2);for(let t=0;t<c;t++){let r=o.cornerIndices?.[t]??t,a=e.indices[t];if(r>=o.sourceIndices.length||a*3+2>=e.positions.length||a*3+2>=e.normals.length)throw Error(`Appearance source corner index is out of range`);for(let n=0;n<3;n++)if(l[t*3+n]=e.positions[a*3+n],u[t*3+n]=i[r*3+n],!Number.isFinite(u[t*3+n]))throw Error(`Appearance normals exceed the finite renderer range`);if(d[t]=t,f[t*2]=n[r*2],f[t*2+1]=n[r*2+1],!Number.isFinite(f[t*2])||!Number.isFinite(f[t*2+1]))throw Error(`Appearance UVs exceed the finite renderer range`)}return{...e,positions:l,normals:u,indices:d,uvs:f,appearanceSource:{...o,indices:d,sourceIndices:s}}};Un=function(e,t,n={}){for(let n of[`origin`,`localToWorld`]){let r=e[n],i=t[n];if(r===void 0||i===void 0){if(r!==i)return!1}else if(r.length!==i.length||r.some((e,t)=>e!==i[t]))return!1}if(e.positions===t.positions&&(n.allowNormalChanges||e.normals===t.normals)&&e.indices===t.indices)return!0;if(!e.appearanceSource||!t.appearanceSource||e.appearanceSource.indices!==e.indices||t.appearanceSource.indices!==t.indices||e.indices.length!==t.indices.length||e.appearanceSource.sourceIndices.length!==t.appearanceSource.sourceIndices.length)return!1;for(let r=0;r<e.indices.length;r++){if((e.appearanceSource.cornerIndices?.[r]??r)!==(t.appearanceSource.cornerIndices?.[r]??r))return!1;for(let i=0;i<3;i++){let a=e.indices[r]*3+i,o=t.indices[r]*3+i;if(a>=e.positions.length||o>=t.positions.length||a>=e.normals.length||o>=t.normals.length||e.positions[a]!==t.positions[o]||!n.allowNormalChanges&&e.normals[a]!==t.normals[o])return!1}}return!0};function Wn(e,t){if(e===void 0||t===void 0)return e===t;if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}Gn=function(e,t){return e.length===t.length&&e.every((e,n)=>{let r=t[n];return e.expressId===r.expressId&&(e.modelIndex??0)===(r.modelIndex??0)&&e.geometryItemId===r.geometryItemId&&!e.entityIds&&!r.entityIds&&[`positions`,`normals`,`indices`,`localToWorld`,`shadingColor`].every(t=>Wn(e[t],r[t]))&&Wn(e.origin??[0,0,0],r.origin??[0,0,0])&&e.color.every((e,t)=>e===r.color[t])&&e.texture===r.texture&&e.textureRef===r.textureRef&&e.textureBitmap===r.textureBitmap&&e.uvs===r.uvs})};function Kn(e){return Object.freeze({...e,positions:e.positions.slice(),normals:e.normals.slice(),indices:e.indices.slice(),color:[...e.color],...e.shadingColor?{shadingColor:[...e.shadingColor]}:{},...e.origin?{origin:[...e.origin]}:{},...e.localToWorld?{localToWorld:[...e.localToWorld]}:{}})}var qn=class{records=new Map;get(e){let t=this.records.get(e.expressId);if(t&&t.owner.modelIndex!==e.modelIndex)throw Error(`Companion model ownership changed.`);return t}capture(e,t,n,r,i=!1){let a=this.get(e),o=0,s=0;if(t.length>1e4)throw Error(`Companion geometry exceeds its snapshot budget.`);for(let e of t)if(o+=e.positions.length/3,s+=e.indices.length,!Number.isSafeInteger(o)||o>2e6||s>15e5||e.positions.length/3>1e6)throw Error(`Companion geometry exceeds its snapshot budget.`);if(!t.length||t.some(t=>t.expressId!==e.expressId||(t.modelIndex??0)!==e.modelIndex||!t.geometryItemId||t.entityIds||!t.positions.length||!t.indices.length||t.texture||t.textureRef||t.textureBitmap||t.uvs))throw Error(`Companion removal requires original untextured owner geometry.`);if(a){if(!Gn(t,a.originals)||(a.absent?n?.length:n?.length?!Gn(n,a.originals):!a.hidden))throw Error(`Companion geometry changed since preparation.`)}else{if(!n?.length&&!i||n?.length&&!Gn(n,t))throw Error(`Companion original geometry is missing or changed.`);let o=n?.length?n:t,s=o.map(Kn),c=o.map((e,t)=>{let n=r(e);return n===e?s[t]:Kn(n)});a={owner:Object.freeze({...e}),originals:Object.freeze(s),sources:Object.freeze(c),absent:!1,hidden:i,drafts:0,history:0},this.records.set(e.expressId,a)}return a.hidden=i&&!n?.length,a.drafts++,a}validate(e,t){let n=this.get(e);if(n&&(n.absent?t?.length:t?.length?!Gn(t,n.originals):!n.hidden))throw Error(`Companion geometry changed during the appearance transaction.`)}install(e,t){let n=this.get(e);if(n){if(t.length&&!Gn(t,n.originals))throw Error(`Companion restoration changed its original geometry.`);n.absent=!t.length}}finish(e,t){let n=this.get(e);!n||t&&n!==t||(n.drafts=Math.max(0,n.drafts-1),this.collect(n))}retain(e){let t=this.get(e);if(!t)return()=>{};t.history++;let n=!1;return()=>{n||(n=!0,t.history--,this.collect(t))}}collect(e){!e.drafts&&!e.history&&this.records.get(e.owner.expressId)===e&&this.records.delete(e.owner.expressId)}retained(e,t){let n=new Map;for(let t of e){let e=n.get(t.expressId)??[];e.push(t),n.set(t.expressId,e)}return new Set([...this.records].filter(([e,r])=>r.history>0&&t.has(r.owner.modelIndex)&&(r.absent?!n.get(e)?.length:Gn(n.get(e)??[],r.sources))).map(([e])=>e))}forget(e){e===void 0?this.records.clear():this.records.delete(e)}forgetExcept(e){for(let t of this.records.keys())e.has(t)||this.records.delete(t)}},Jn=5e5;Yn=function(e){return{...e,before:e.after,after:e.before}};function Xn(e){let t=e=>Object.freeze(e.map(e=>Object.freeze({partId:e.partId,geometryItemId:e.geometryItemId,triangles:Object.freeze([...e.triangles])})));return Object.freeze({sourceGeometryItemId:e.sourceGeometryItemId,triangleCount:e.triangleCount,before:t(e.before),after:t(e.after)})}function Zn(e,t){for(let n of[`origin`,`localToWorld`]){let r=e[n],i=t[n];if(r===void 0||i===void 0){if(r!==i)return!1}else if(r.length!==i.length||r.some((e,t)=>e!==i[t]))return!1}return!0}function Qn(e,t,n,r,i){if(!e.length||e.length!==t.length)throw Error(`Appearance partition ${n} does not name every part`);let a=new Set,o=0;if(e.forEach((e,s)=>{if(!Number.isSafeInteger(e.partId)||e.partId<0||a.has(e.partId)||!Number.isSafeInteger(e.geometryItemId)||e.geometryItemId<=0||t[s].geometryItemId!==e.geometryItemId)throw Error(`Appearance partition ${n} item identity does not match its part`);if(a.add(e.partId),e.triangles.length*3!==t[s].indices.length)throw Error(`Appearance partition ${n} triangle count does not match its part`);let c=t[s].appearanceSource;if(!c||c.indices!==t[s].indices||c.sourceIndices.length!==r*3||c.cornerIndices&&c.cornerIndices.length!==t[s].indices.length)throw Error(`Appearance partition ${n} has invalid full-surface provenance`);if(!e.triangles.length||e.triangles.length>r-o)throw Error(`Appearance partition ${n} exceeds its triangle work budget`);o+=e.triangles.length,e.triangles.forEach((e,t)=>{if(!Number.isSafeInteger(e)||e<0||e>=r)throw Error(`Appearance partition ${n} names an invalid triangle`);for(let r=0;r<3;r++){let a=e*3+r;if((c.cornerIndices?.[t*3+r]??t*3+r)!==a||c.sourceIndices[a]!==i[a])throw Error(`Appearance partition ${n} part identity does not match its canonical triangles`)}})}),o!==r)throw Error(`Appearance partition ${n} does not cover the full surface`)}function $n(e,t,n,r,i){let a=i??new Float32Array(r*9),o=new Uint8Array(r*3);if(e.forEach((e,r)=>{let s=t[r];e.triangles.forEach((e,t)=>{for(let r=0;r<3;r++){let c=e*3+r;if(o[c])throw Error(`Appearance partition ${n} names a triangle twice`);o[c]=1;let l=s.indices[t*3+r]*3;if(l+2>=s.positions.length)throw Error(`Appearance partition ${n} part index is out of range`);let u=c*3;for(let e=0;e<3;e++){let t=s.positions[l+e];if(i&&i[u+e]!==t)throw Error(`Appearance partition changes triangle geometry`);a[u+e]=t}}})}),o.some(e=>e!==1))throw Error(`Appearance partition ${n} does not provide complete coverage`);return a}er=function(e,t,n){if(!Number.isSafeInteger(e.sourceGeometryItemId)||e.sourceGeometryItemId<=0||!Number.isSafeInteger(e.triangleCount)||e.triangleCount<=0||e.triangleCount>Jn||e.before.length>e.triangleCount||e.after.length>e.triangleCount)throw Error(`Appearance partition full-surface identity is invalid`);let r=(t.every(t=>t.geometryItemId===e.sourceGeometryItemId)?t:n.every(t=>t.geometryItemId===e.sourceGeometryItemId)?n:void 0)?.[0].appearanceSource?.sourceIndices;if(!r||r.length!==e.triangleCount*3)throw Error(`Appearance partition full-surface provenance does not match its source item`);Qn(e.before,t,`original`,e.triangleCount,r),Qn(e.after,n,`replacement`,e.triangleCount,r);let i=t[0];for(let e of[...t,...n]){if(e.expressId!==i.expressId||(e.modelIndex??0)!==(i.modelIndex??0)||e.entityIds||!Zn(e,i))throw Error(`Appearance partition cannot change ownership or placement`);if(e.normals.length!==e.positions.length||!e.normals.every(Number.isFinite))throw Error(`Appearance partition part normals are invalid`)}let a=$n(e.before,t,`original`,e.triangleCount);$n(e.after,n,`replacement`,e.triangleCount,a)};var tr=class{adapter;drafts=new Map;issued=new WeakSet;constructor(e){this.adapter=e}begin(e,t){if(this.drafts.has(e.expressId))throw Error(`An appearance preview already owns this entity`);if(t?.companionHidden&&!t.companionOriginals)throw Error(`Hidden companion preparation requires canonical originals`);let n=this.adapter.capture(e,t?.materializedOriginals,t?.companionOriginals,t?.companionHidden);try{let r=t?.geometryItemRemaps??[],i=n.companionOriginals??t?.companionOriginals;if(i&&(!i.length||r.length||t?.materializedOriginals||n.parts.length&&!Gn(n.parts,i)))throw Error(`Invalid companion presence transition`);if(r.length>n.parts.length)throw Error(`Appearance item remap exceeds the original part count`);let a=new Set(n.parts.map(e=>e.geometryItemId)),o=t?.partition&&Xn(t.partition);if(o){let e=new Set(o.after.map(e=>e.partId));if(r.length||i||o.before.length!==n.parts.length||o.before.some((e,t)=>e.geometryItemId!==n.parts[t].geometryItemId)||e.size!==o.after.length||o.after.some(e=>!Number.isSafeInteger(e.geometryItemId)||e.geometryItemId<=0||a.has(e.geometryItemId)))throw Error(`Invalid appearance partition`)}let s=new Set,c=new Set;for(let e of r){if(!Number.isSafeInteger(e.from)||!Number.isSafeInteger(e.to)||e.from<=0||e.to<=0||e.from===e.to||!a.has(e.from)||s.has(e.from)||c.has(e.to)||a.has(e.to))throw Error(`Invalid occurrence geometry item remap`);s.add(e.from),c.add(e.to)}let l=Object.freeze(r.map(e=>Object.freeze({...e}))),u=Object.freeze({owner:Object.freeze({...e})}),d=Object.freeze(n.parts.map(e=>Object.freeze({...e})));return this.issued.add(u),this.drafts.set(e.expressId,{token:u,before:d,original:n.resources,after:d,current:n.resources,geometryItemRemaps:l,companionOriginals:i&&Object.freeze(i.map(e=>Object.freeze({...e}))),...o?{partition:o}:{}}),u}catch(e){throw n.abandon?.(),e}}getParts(e){return this.adapter.parts?.(e)}retainSource(e){return this.adapter.retainSource?.(e)??(()=>{})}draft(e){let t=this.drafts.get(e.owner.expressId);if(!t||t.token!==e)throw Error(`Stale or foreign appearance preview token`);return t}update(e,t){let n=this.draft(e);if(this.adapter.validate?.(e.owner),n.companionOriginals){if(t.length&&!Gn(t,n.companionOriginals))throw Error(`Companion preview can only restore exact original geometry`);let e=Object.freeze(t.map(e=>Object.freeze({...e})));this.installDraft(n,e);return}if(n.partition)er(n.partition,n.before,t);else if(t.length!==n.before.length)throw Error(`Appearance preview requires every original mesh part`);let r=new Map;for(let e of n.before)e.textureRef&&r.set(e.textureRef.textureId,e.textureBitmap);for(let e of n.after)e.textureRef&&r.set(e.textureRef.textureId,e.textureBitmap);if(!n.partition)for(let e=0;e<t.length;e++){let r=t[e],i=n.before[e];if(r.expressId!==i.expressId||r.modelIndex!==i.modelIndex||!Un(r,i,{allowNormalChanges:!0})||r.entityIds!==i.entityIds||r.geometryItemId!==(n.geometryItemRemaps.find(e=>e.from===i.geometryItemId)?.to??i.geometryItemId)||r.normals.length!==r.positions.length||!r.normals.every(Number.isFinite))throw Error(`Appearance preview cannot change geometry or ownership`)}for(let e of t){if(!e.texture&&e.textureRef&&e.textureBitmap&&r.has(e.textureRef.textureId)&&r.get(e.textureRef.textureId)!==e.textureBitmap)throw Error(`A replacement bitmap needs a new texture identity`);if(e.textureRef&&r.set(e.textureRef.textureId,e.textureBitmap),(e.texture||e.textureRef||e.textureBitmap)&&(!e.uvs||e.uvs.length!==e.positions.length/3*2||!e.uvs.every(Number.isFinite)||!(e.texture||e.textureRef&&e.textureBitmap)))throw Error(`Appearance preview requires finite UVs and a resolved image for every part`)}let i=Object.freeze(t.map((e,t)=>Object.freeze({...n.before[n.partition?0:t],geometryItemId:e.geometryItemId,positions:e.positions,normals:e.normals,indices:e.indices,appearanceSource:e.appearanceSource,color:e.color,shadingColor:e.shadingColor,uvs:e.uvs,texture:e.texture,textureRef:e.textureRef,textureBitmap:e.textureBitmap})));this.installDraft(n,i)}installDraft(e,t){let n=this.adapter.stage(t);try{this.adapter.install(e.token.owner,t,n)}catch(e){throw this.adapter.release(n),e}e.current!==e.original&&this.adapter.release(e.current),e.after=t,e.current=n}cancel(e){if(!this.issued.has(e))throw Error(`Foreign appearance preview token`);if(this.drafts.get(e.owner.expressId)?.token!==e)return;let t=this.draft(e);this.adapter.validate?.(e.owner),this.adapter.install(e.owner,t.before,t.original),t.current!==t.original&&this.adapter.release(t.current),this.drafts.delete(e.owner.expressId),this.finished(e.owner)}commit(e){return this.prepareCommit([e])()[0]}prepareCommit(e){if(new Set(e).size!==e.length)throw Error(`Appearance commit repeats a token`);let t=e.map(e=>{let t=this.draft(e);return this.adapter.validate?.(e.owner),{draft:t,current:t.current,after:t.after}}),n=t.map(({draft:e,after:t})=>Object.freeze({owner:e.token.owner,before:e.before,after:t,...e.companionOriginals?{companionOriginals:e.companionOriginals}:{},...this.adapter.instanced?.(e.token.owner,e.before)?{beforeInstanced:!0}:{},...this.adapter.instanced?.(e.token.owner,t)?{afterInstanced:!0}:{},...e.geometryItemRemaps.length?{geometryItemRemaps:e.geometryItemRemaps}:{},...e.partition?{partition:e.partition}:{}})),r=!1;return()=>{if(r)return n;for(let{draft:e,current:n,after:r}of t)if(this.adapter.validate?.(e.token.owner),this.draft(e.token)!==e||e.current!==n||e.after!==r)throw Error(`Appearance changed after preparing the commit`);for(let{draft:e}of t)this.drafts.delete(e.token.owner.expressId);r=!0;for(let{draft:e,current:n}of t)if(n!==e.original)try{this.adapter.release(e.original)}catch(e){console.warn(`[Appearance] failed to release committed preview resources`,e)}for(let{draft:e}of t)this.finished(e.token.owner);return n}}finished(e){try{this.adapter.finished?.(e)}catch(e){console.warn(`[Appearance] batch restoration failed; split geometry remains active`,e)}}owns(e){return this.drafts.has(e)}hasActiveDrafts(){return this.drafts.size>0}prepareRebuild(e,t){for(let e of[...this.drafts.values()])this.cancel(e.token);return this.adapter.prepareRebuild?.(e,t)??new Set}finishRebuild(e){this.adapter.finishRebuild?.(e)}discardedForRebuild(e){return this.adapter.discardedForRebuild?.(e)??[]}cancelFor(e){let t=this.drafts.get(e);t&&this.cancel(t.token)}forget(e){this.adapter.forget?.(e);for(let[t,n]of this.drafts)(e===void 0||e===t)&&(n.current!==n.original&&this.adapter.release(n.original),this.drafts.delete(t))}},nr=48,rr=`
struct Uniforms {
  viewProj: mat4x4<f32>,
  rteViewProj: mat4x4<f32>,
  clipOrigin: vec4<f32>,
  originHigh: vec4<f32>,
  originLow: vec4<f32>,
  settings: vec4<f32>,
}
@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var raster: texture_2d<f32>;
@group(0) @binding(2) var rasterSampler: sampler;
struct Vertex { @builtin(position) position: vec4<f32>, @location(0) uv: vec2<f32> }
@vertex fn vs(@location(0) position: vec3<f32>, @location(1) uv: vec2<f32>) -> Vertex {
  var out: Vertex;
  let global = u.viewProj * vec4<f32>(position, 0.0) + u.clipOrigin;
  let relative = position + u.originHigh.xyz + u.originLow.xyz;
  let rte = u.rteViewProj * vec4<f32>(relative, 1.0);
  out.position = select(global, rte, u.originHigh.w == 1.0);
  out.uv = uv; return out;
}
@fragment fn fs(v: Vertex) -> @location(0) vec4<f32> {
  let pixel = textureSample(raster, rasterSampler, v.uv);
  let alpha = pixel.a * u.settings.x;
  if (alpha < 0.001) { discard; }
  return vec4<f32>(pixel.rgb * alpha, alpha);
}`,ir=class{device;pipeline;sampler;constructor(e,t,n){this.device=e;let r=e.createShaderModule({label:`reference-image`,code:rr});this.pipeline=e.createRenderPipeline({label:`reference-image`,layout:`auto`,vertex:{module:r,entryPoint:`vs`,buffers:[{arrayStride:20,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x2`}]}]},fragment:{module:r,entryPoint:`fs`,targets:[{format:t,blend:{color:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}}},{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`greater-equal`},multisample:{count:n}}),this.sampler=e.createSampler({minFilter:`linear`,magFilter:`linear`,addressModeU:`clamp-to-edge`,addressModeV:`clamp-to-edge`})}upload(e){let{device:t}=this;if(!e.id||!Number.isFinite(e.opacity)||e.opacity<0||e.opacity>1||e.corners.length!==4||e.corners.some(e=>e.length!==3||e.some(e=>!Number.isFinite(e))))throw Error(`Reference image requires a stable ID, four finite corners and opacity between zero and one.`);if(e.bitmap.width<1||e.bitmap.height<1||Math.max(e.bitmap.width,e.bitmap.height)>t.limits.maxTextureDimension2D)throw Error(`Reference image exceeds this GPU’s image dimensions. Choose a lower raster resolution.`);let n=e.corners[0],r=[[0,0],[1,0],[1,1],[0,1]],i=new Float32Array([0,1,2,0,2,3].flatMap(t=>[e.corners[t][0]-n[0],e.corners[t][1]-n[1],e.corners[t][2]-n[2],...r[t]]));if(i.some(e=>!Number.isFinite(e)))throw Error(`Reference dimensions exceed the renderable coordinate range.`);let a=[];try{let r=t.createTexture({label:`reference-image`,size:[e.bitmap.width,e.bitmap.height],format:`rgba8unorm`,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});a.push(r),t.queue.copyExternalImageToTexture({source:e.bitmap},{texture:r},[e.bitmap.width,e.bitmap.height]);let o=t.createBuffer({size:i.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});a.push(o),t.queue.writeBuffer(o,0,i);let s=t.createBuffer({size:192,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});a.push(s);let c=t.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:s}},{binding:1,resource:r.createView()},{binding:2,resource:this.sampler}]}),l=new Float32Array(nr),u=!1;return{input:e,draw:(r,i,a,d)=>{if(!u&&e.visible&&e.opacity!==0){l.fill(0),l.set(i,0);for(let e=0;e<4;e++)l[32+e]=i[e]*n[0]+i[4+e]*n[1]+i[8+e]*n[2]+i[12+e];if(a&&d){if(l.set(a,16),!E(n,d,l,36))return;l[39]=1}l[44]=e.opacity,t.queue.writeBuffer(s,0,l),r.setPipeline(this.pipeline),r.setBindGroup(0,c),r.setVertexBuffer(0,o),r.draw(6)}},destroy:()=>{if(!u){u=!0;for(let e of a)e.destroy()}}}}catch(e){for(let e of a)e.destroy();throw e}}},ar=(e,t)=>[e[0]-t[0],e[1]-t[1],e[2]-t[2]],or=(e,t)=>[e[1]*t[2]-e[2]*t[1],e[2]*t[0]-e[0]*t[2],e[0]*t[1]-e[1]*t[0]],sr=(e,t)=>e[0]*t[0]+e[1]*t[1]+e[2]*t[2];function cr(e,t,n,r){let i=[n.origin.x,n.origin.y,n.origin.z],a=[n.direction.x,n.direction.y,n.direction.z],o=null;for(let n of[[0,1,2],[0,2,3]]){let s=t[n[0]],c=ar(t[n[1]],s),l=ar(t[n[2]],s),u=or(a,l),d=sr(c,u);if(!Number.isFinite(d)||Math.abs(d)<=2**-52*Math.hypot(...c)*Math.hypot(...l))continue;let f=ar(i,s),p=sr(f,u)/d;if(p<0||p>1)continue;let m=or(f,c),h=sr(a,m)/d;if(h<0||p+h>1)continue;let g=sr(l,m)/d;!Number.isFinite(g)||g<0||g>=r||(r=g,o={referenceId:e,distance:g,point:[i[0]+a[0]*g,i[1]+a[1]*g,i[2]+a[2]*g]})}return o}var lr=class{host;images=new Map;jobs=new Map;pipeline=null;device=null;format=`bgra8unorm`;sampleCount=1;constructor(e){this.host=e}hasImages(){return this.images.size>0||this.jobs.size>0}init(e,t,n){this.destroy(),this.device=e,this.format=t,this.sampleCount=n}async set(e,t){let n=this.device;if(!n)throw Error(`The renderer is not ready for reference images.`);if(t?.aborted)return;let r=this.images.get(e.id)?.input;if(r?.bitmap===e.bitmap&&r.visible===e.visible&&r.locked===e.locked&&r.opacity===e.opacity&&r.corners.every((t,n)=>t.every((t,r)=>t===e.corners[n][r]))){this.jobs.delete(e.id);return}let i={...e,corners:[[...e.corners[0]],[...e.corners[1]],[...e.corners[2]],[...e.corners[3]]]},a=Symbol(e.id);this.jobs.set(e.id,a),n.pushErrorScope(`out-of-memory`),n.pushErrorScope(`validation`);let o,s;try{this.pipeline??=new ir(n,this.format,this.sampleCount),o=this.pipeline.upload(i)}catch(e){s=e}let c=n.popErrorScope(),l=n.popErrorScope();try{let[e,t]=await Promise.all([c,l]);(e||t)&&(s??=Error(`Reference image upload failed: ${(e??t).message}`))}catch(e){s??=e}if(s||t?.aborted||this.jobs.get(e.id)!==a||this.device!==n){if(o?.destroy(),s&&this.device===n&&(this.pipeline=null),this.jobs.get(e.id)===a&&this.jobs.delete(e.id),s)throw s}else{if(this.jobs.delete(e.id),!o)throw Error(`Reference image upload produced no resource.`);this.images.get(e.id)?.destroy(),this.images.set(e.id,o),this.host.requestRender()}}remove(e){this.jobs.delete(e),this.images.get(e)?.destroy(),this.images.delete(e),this.host.requestRender()}clear(){this.jobs.clear();for(let e of this.images.values())e.destroy();this.images.clear(),this.host.requestRender()}destroy(){this.clear(),this.pipeline=null,this.device=null}draw(e,t,n,r){if(!this.images.size)return;let i=e=>{let i=e.input.corners,a=(i[0][0]+i[2][0])/2,o=(i[0][1]+i[2][1])/2,s=(i[0][2]+i[2][2])/2;if(n&&r){let e=a-r[0],t=o-r[1],i=s-r[2];return(n[2]*e+n[6]*t+n[10]*i+n[14])/(n[3]*e+n[7]*t+n[11]*i+n[15])}let c=t,l=a,u=o,d=s;return(c[2]*l+c[6]*u+c[10]*d+c[14])/(c[3]*l+c[7]*u+c[11]*d+c[15])};for(let a of[...this.images.values()].sort((e,t)=>i(e)-i(t)))a.draw(e,t,n,r)}async pick(e,t,n){if(!this.images.size)return null;let r=this.host.ray(e,t);if(!r)return null;let i=new Map([...this.images].filter(([,e])=>e.input.visible&&!e.input.locked&&e.input.opacity>0&&cr(e.input.id,e.input.corners,r,1/0)!==null));if(!i.size)return null;let a=await this.host.sceneDistance(e,t,r,n),o=null;for(let e of i.values()){let{input:t}=e;if(this.images.get(t.id)!==e||!t.visible||t.locked||t.opacity===0)continue;let n=cr(t.id,t.corners,r,a);n&&(o=n,a=n.distance)}return o}};function ur(e){return new lr({requestRender:()=>e.requestRender(),ray:(t,n)=>{if(e.isDeviceLost())return null;let r=e.getCanvas(),i=r.getBoundingClientRect();return i.width<=0||i.height<=0||t<0||n<0||t>i.width||n>i.height?null:e.getCamera().unprojectToRay(t*r.width/i.width,n*r.height/i.height,r.width,r.height)},sceneDistance:async(t,n,r,i)=>{let a=await e.pick(t,n,i);return a?a.worldXYZ?Math.hypot(a.worldXYZ.x-r.origin.x,a.worldXYZ.y-r.origin.y,a.worldXYZ.z-r.origin.z):e.raycastScene(t,n,{...i,isolatedIds:new Set([a.expressId])})?.intersection.distance??0:1/0}})}function dr(e,t,n,r,i=2,a){if(!Number.isFinite(e)||!Number.isFinite(t)||e<=0||t<=0)return null;let o=Number.isFinite(n)&&n>0?n:1,s=Number.isFinite(r)&&r>=1?r:8192,c=Number.isFinite(i)&&i>0?i:2,l=Math.min(o,c,typeof a==`number`&&Number.isFinite(a)&&a>0?a:c,s/e,s/t),u=Math.min(s,Math.max(1,Math.round(e*l)));return{width:u,height:Math.min(s,Math.max(1,Math.round(t*l))),pixelRatio:u/e}}function fr(e,t,n,r){let i=e.getBoundingClientRect(),a=typeof window<`u`?window.devicePixelRatio:1;return dr(i.width,i.height,a,t,n,r)}function pr(e,t,n,r){!Number.isFinite(n)||!Number.isFinite(r)||n<=0||r<=0||(e.width=n,e.height=r,t.setAspect(n/r))}function mr(e,t){let n=e.entityIds;if(n){for(let e=0;e<n.length;e++)if(n[e]!==t)return}return e.geometryItemId}function hr(e,t){return t[e.meshIndexPlusOne-1]}function gr(e,t){return e.kind===`none`?null:e.kind===`point`?e.pointExpressId:e.kind===`instanced`?e.instanceExpressId:hr(e,t)?.expressId??null}function _r(e,t,n,r){let i=gr(e,t);if(i===null)return null;let a=r??void 0;if(e.kind===`point`)return{expressId:i,modelIndex:n?.find(e=>e.expressId>>>0===i)?.modelIndex,worldXYZ:a};if(e.kind===`instanced`)return{expressId:i,modelIndex:void 0,worldXYZ:a};let o=hr(e,t);return o?{expressId:i,modelIndex:o.modelIndex,worldXYZ:a,...o.geometryItemId===void 0?{}:{geometryItemId:o.geometryItemId}}:null}var vr=`
    ${v}
    ${L}
    struct PointUniforms {
      viewProj: mat4x4<f32>,
      model: mat4x4<f32>,
      drawableDeltaHigh: vec4<f32>,
      drawableDeltaLow: vec4<f32>,
      colorOverride: vec4<f32>,
      // x = colorMode, y = pointSizePx, z = heightMin, w = heightMax
      colorModeAndExtras: vec4<f32>,
      // x = sizeMode, y = worldRadius (m), z = viewportWidth, w = viewportHeight
      sizing: vec4<f32>,
      sectionPlane: vec4<f32>,
      // x = assetExpressId (federation-aware globalId), y = sectionEnabled,
      // z = roundShape, w = reserved (was the 32-bit class mask before
      // classMask below took over the full 0..255 LAS range, #1783)
      flags: vec4<u32>,
      // x = previewStride (1 = render every point, N = render every
      // Nth instance — used by the section-plane drag preview path).
      // yzw reserved for future per-frame state.
      extras: vec4<u32>,
      // x = deviation centerOffset (m), y = deviation halfRange (m).
      // Used by colorMode 5 (BIM↔scan deviation heatmap).
      deviationRange: vec4<f32>,
      // 256-bit LAS class-visibility bitmask packed as 8 u32 words
      // (two vec4s). Bit (i % 32) of word (i / 32) set → class i shown.
      classMask: array<vec4<u32>, 2>,
      // Eye-relative crop bounds; flags.w enables this branch.
      cropBoxMin: vec4<f32>,
      cropBoxMax: vec4<f32>,
      // Cutting planes beyond sectionPlane (#7545), eye-relative like it.
      extraClip: ExtraClip,
    }
    @binding(0) @group(0) var<uniform> uniforms: PointUniforms;

    struct VertexInput {
      @location(0) position: vec3<f32>,
      @location(1) rgbAndClass: vec4<f32>,   // unorm8x4 → 0..1 each
      @location(2) intensityPacked: u32,     // low 16 bits = intensity
      @location(3) entityId: u32,
      // BIM↔scan signed distance, populated by the deviation compute
      // pass. Zero when the user hasn't computed yet (or when no
      // mesh is loaded). Bound from a separate vertex buffer so the
      // existing 24-byte-per-point layout stays unchanged.
      @location(4) deviation: f32,
    }

    struct VertexOutput {
      @builtin(position) position: vec4<f32>,
      @location(0) color: vec4<f32>,
      @location(1) worldPos: vec3<f32>,
      @location(2) @interpolate(flat) entityId: u32,
      @location(3) quadUv: vec2<f32>,
    }

    fn classification_color(class_id: u32) -> vec3<f32> {
      switch (class_id) {
        case 0u, 1u: { return vec3<f32>(0.65, 0.65, 0.65); }
        case 2u:     { return vec3<f32>(0.55, 0.40, 0.25); }
        case 3u:     { return vec3<f32>(0.55, 0.85, 0.45); }
        case 4u:     { return vec3<f32>(0.30, 0.75, 0.30); }
        case 5u:     { return vec3<f32>(0.10, 0.45, 0.15); }
        case 6u:     { return vec3<f32>(0.95, 0.55, 0.20); }
        case 7u:     { return vec3<f32>(0.95, 0.20, 0.20); }
        case 8u:     { return vec3<f32>(0.20, 0.85, 0.95); }
        case 9u:     { return vec3<f32>(0.20, 0.40, 0.95); }
        case 10u:    { return vec3<f32>(0.55, 0.20, 0.85); }
        case 11u:    { return vec3<f32>(0.30, 0.30, 0.30); }
        case 13u:    { return vec3<f32>(0.95, 0.85, 0.20); }
        case 14u:    { return vec3<f32>(0.95, 0.95, 0.50); }
        case 15u:    { return vec3<f32>(0.20, 0.20, 0.55); }
        case 16u:    { return vec3<f32>(0.30, 0.65, 0.65); }
        case 17u:    { return vec3<f32>(0.85, 0.70, 0.50); }
        case 18u:    { return vec3<f32>(0.95, 0.20, 0.20); }
        default:     { return vec3<f32>(0.65, 0.65, 0.65); }
      }
    }

    // Diverging blue → white → red ramp for the BIM↔scan deviation
    // heatmap. t is in [-1, 1] where −1 = scan-far on the negative
    // side of the surface, 0 = exactly on surface, +1 = scan-far on
    // the positive (outward-normal) side. Negative side (typically
    // "inside" / "before" the wall) is blue; positive ("outside" /
    // "past" the wall) is red.
    fn deviation_ramp(t: f32) -> vec3<f32> {
      let s = clamp(t, -1.0, 1.0);
      if (s < 0.0) {
        // Cool side: deep blue → white as |t| → 0.
        let k = s + 1.0;       // [-1..0] → [0..1]
        return mix(vec3<f32>(0.10, 0.30, 0.85), vec3<f32>(0.95, 0.95, 0.95), k);
      }
      // Warm side: white → red as t → 1.
      return mix(vec3<f32>(0.95, 0.95, 0.95), vec3<f32>(0.85, 0.20, 0.10), s);
    }

    fn height_ramp(t: f32) -> vec3<f32> {
      let s = clamp(t, 0.0, 1.0);
      if (s < 0.25) {
        let k = s / 0.25;
        return mix(vec3<f32>(0.10, 0.20, 0.85), vec3<f32>(0.10, 0.85, 0.85), k);
      } else if (s < 0.5) {
        let k = (s - 0.25) / 0.25;
        return mix(vec3<f32>(0.10, 0.85, 0.85), vec3<f32>(0.20, 0.85, 0.20), k);
      } else if (s < 0.75) {
        let k = (s - 0.5) / 0.25;
        return mix(vec3<f32>(0.20, 0.85, 0.20), vec3<f32>(0.95, 0.95, 0.20), k);
      } else {
        let k = (s - 0.75) / 0.25;
        return mix(vec3<f32>(0.95, 0.95, 0.20), vec3<f32>(0.95, 0.20, 0.10), k);
      }
    }

    @vertex
    fn vs_main(
      input: VertexInput,
      @builtin(vertex_index) vId: u32,
      @builtin(instance_index) iId: u32,
    ) -> VertexOutput {
      // Preview-density stride cull. UI sets extras.x to e.g. 4
      // while the user drags a section-plane slider so we render
      // every 4th point and the drag stays responsive on huge scans.
      // stride <= 1 is the no-op default.
      let stride = max(1u, uniforms.extras.x);
      if (stride > 1u && (iId % stride) != 0u) {
        var skipped: VertexOutput;
        // Push behind the near plane so the rasteriser drops it.
        skipped.position = vec4<f32>(0.0, 0.0, -2.0, 1.0);
        skipped.color = vec4<f32>(0.0);
        skipped.worldPos = vec3<f32>(0.0);
        skipped.entityId = 0u;
        skipped.quadUv = vec2<f32>(0.0);
        return skipped;
      }

      // Quad corners (two triangles, CCW) in unit disc coords:
      //   tri 1: (-1,-1)(1,-1)(1,1)
      //   tri 2: (-1,-1)(1, 1)(-1,1)
      var corners = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0, -1.0),
        vec2<f32>( 1.0,  1.0),
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 1.0,  1.0),
        vec2<f32>(-1.0,  1.0),
      );
      let corner = corners[vId];

      let localWorld = (uniforms.model * vec4<f32>(input.position, 1.0)).xyz;
      // The CPU forms this delta in f64, then splits it. Never subtract two
      // independently rounded map-grid origins in the point shader.
      let drawable = RteDrawableUniform(
        uniforms.drawableDeltaHigh,
        uniforms.drawableDeltaLow,
      );
      let worldPos = rteWorldPosition(localWorld, drawable).xyz;
      var clipPos = uniforms.viewProj * vec4<f32>(worldPos, 1.0);

      // Compute splat half-extent in pixels for the active size mode.
      let sizeMode = u32(uniforms.sizing.x);
      let worldRadius = uniforms.sizing.y;
      let viewport = uniforms.sizing.zw;
      let pointSizePx = uniforms.colorModeAndExtras.y;

      // halfPx is the splat RADIUS in pixels. The user-facing
      // pointSizePx is the diameter ("8 px point"), so divide by 2
      // when feeding it to the pipeline. Without this the fixed and
      // attenuated branches render splats at ~2x their requested size.
      var halfPx: f32;
      if (sizeMode == 0u) {
        halfPx = max(0.5, pointSizePx * 0.5);
      } else {
        // Project a world-radius offset to clip space, take pixel delta.
        // worldRadius is already a radius — no /2 needed here.
        let edgePos = uniforms.viewProj * vec4<f32>(worldPos + vec3<f32>(worldRadius, 0.0, 0.0), 1.0);
        let centerNdcX = clipPos.x / max(abs(clipPos.w), 1e-6);
        let edgeNdcX = edgePos.x / max(abs(edgePos.w), 1e-6);
        let projectedPx = abs(edgeNdcX - centerNdcX) * 0.5 * viewport.x;
        if (sizeMode == 2u) {
          halfPx = clamp(projectedPx, 0.5, max(0.5, pointSizePx * 0.5));
        } else {
          halfPx = max(0.5, projectedPx);
        }
      }

      // Convert pixel offset to clip-space offset. Multiply by clipPos.w
      // because the GPU divides by w during the perspective divide.
      let halfClip = vec2<f32>(halfPx) / max(viewport, vec2<f32>(1.0)) * 2.0 * abs(clipPos.w);
      clipPos.x = clipPos.x + corner.x * halfClip.x;
      clipPos.y = clipPos.y + corner.y * halfClip.y;

      // Color selection
      let mode = u32(uniforms.colorModeAndExtras.x);
      let intensity01 = f32(input.intensityPacked & 0xffffu) / 65535.0;
      let classId = u32(round(input.rgbAndClass.a * 255.0));

      // Per-class visibility — classMask is a 256-bit mask covering
      // every LAS classification code, including user-defined 64..255
      // (#1783). Hidden classes get pushed behind the near plane via a
      // degenerate clipPos so they're culled before rasterisation;
      // cheaper than fragment-stage discard.
      let maskWordIdx = classId >> 5u;  // classId is 0..255 → word 0..7
      let maskWord = uniforms.classMask[maskWordIdx >> 2u][maskWordIdx & 3u];
      if (((maskWord >> (classId & 31u)) & 1u) == 0u) {
        var output: VertexOutput;
        output.position = vec4<f32>(0.0, 0.0, -2.0, 1.0);  // outside [0,1] reverse-Z → culled
        output.color = vec4<f32>(0.0);
        output.worldPos = vec3<f32>(0.0);
        output.entityId = 0u;
        output.quadUv = vec2<f32>(0.0);
        return output;
      }
      let heightT =
        (worldPos.y - uniforms.colorModeAndExtras.z) /
        max(1e-6, uniforms.colorModeAndExtras.w - uniforms.colorModeAndExtras.z);

      var rgb: vec3<f32>;
      switch (mode) {
        case 0u: { rgb = input.rgbAndClass.rgb; }
        case 1u: { rgb = classification_color(classId); }
        case 2u: { rgb = vec3<f32>(intensity01, intensity01, intensity01); }
        case 3u: { rgb = height_ramp(heightT); }
        case 4u: { rgb = uniforms.colorOverride.rgb; }
        case 5u: {
          // Deviation: shift by centerOffset so a non-zero baseline
          // can be re-zeroed (handy when a scan has a global offset
          // from the model). halfRange = 0 falls through to white.
          let center = uniforms.deviationRange.x;
          let half = max(uniforms.deviationRange.y, 1e-6);
          let dt = (input.deviation - center) / half;
          rgb = deviation_ramp(dt);
        }
        default: { rgb = input.rgbAndClass.rgb; }
      }

      var output: VertexOutput;
      output.position = clipPos;
      output.color = vec4<f32>(rgb, 1.0);
      output.worldPos = worldPos;
      output.entityId = input.entityId;
      output.quadUv = corner;
      return output;
    }

    struct FragmentOutput {
      @location(0) color: vec4<f32>,
      @location(1) objectId: vec4<f32>,
    }

    @fragment
    fn fs_main(input: VertexOutput) -> FragmentOutput {
      // Round shape — discard corners outside the unit disc.
      if (uniforms.flags.z == 1u) {
        if (dot(input.quadUv, input.quadUv) > 1.0) {
          discard;
        }
      }

      // Section-plane clipping
      if (uniforms.flags.y == 1u) {
        let d = dot(uniforms.sectionPlane.xyz, input.worldPos) - uniforms.sectionPlane.w;
        if (d > 0.0) {
          discard;
        }
      }

      if (extraClipClipped(uniforms.extraClip, input.worldPos)) {
        discard;
      }

      if (uniforms.flags.w == 1u) {
        if (any(input.worldPos < uniforms.cropBoxMin.xyz) || any(input.worldPos > uniforms.cropBoxMax.xyz)) {
          discard;
        }
      }

      var output: FragmentOutput;
      output.color = input.color;
      // Prefer the asset-level expressId from the uniform when it's set
      // (federation needs to relabel post-stream, so we can't rely on
      // the per-vertex attribute that was baked at upload time).
      // flags.x == 0 → fall back to per-vertex value to preserve the
      // legacy contract during the upload-only rendering window.
      let id = select(input.entityId, uniforms.flags.x, uniforms.flags.x != 0u);
      output.objectId = vec4<f32>(
        f32((id >> 0u) & 0xffu) / 255.0,
        f32((id >> 8u) & 0xffu) / 255.0,
        f32((id >> 16u) & 0xffu) / 255.0,
        f32((id >> 24u) & 0xffu) / 255.0,
      );
      return output;
    }
`,yr=336+P,br=class{device;pipeline;bindGroupLayout;constructor(e,t,n,r){this.device=e,this.bindGroupLayout=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});let i=e.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),a=e.createShaderModule({code:vr});this.pipeline=e.createRenderPipeline({layout:i,vertex:{module:a,entryPoint:`vs_main`,buffers:[{arrayStride:24,stepMode:`instance`,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`unorm8x4`},{shaderLocation:2,offset:16,format:`uint32`},{shaderLocation:3,offset:20,format:`uint32`}]},{arrayStride:4,stepMode:`instance`,attributes:[{shaderLocation:4,offset:0,format:`float32`}]}]},fragment:{module:a,entryPoint:`fs_main`,targets:[{format:t},{format:`rgba8unorm`}]},primitive:{topology:`triangle-list`},depthStencil:{format:n,depthWriteEnabled:!0,depthCompare:`greater`},multisample:{count:r}})}getPipeline(){return this.pipeline}getBindGroupLayout(){return this.bindGroupLayout}createUniformBuffer(){return this.device.createBuffer({size:yr,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}createBindGroup(e){return this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:e}}]})}},xr=0x80000000,Sr=0x7fffffff,Cr=0x3fffffff;function wr(e){return e===0?{meshIndexPlusOne:0,pointExpressId:0,instanceExpressId:0,kind:`none`}:(e&xr)===0?e&0x40000000?{meshIndexPlusOne:0,pointExpressId:0,instanceExpressId:e&Cr,kind:`instanced`}:{meshIndexPlusOne:e,pointExpressId:0,instanceExpressId:0,kind:`mesh`}:{meshIndexPlusOne:0,pointExpressId:e&Sr,instanceExpressId:0,kind:`point`}}var Tr=64,Er=256+P,Dr=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),Or=class{device;pipeline;bindGroupLayout;uniforms=[];uniformScratch=new Float32Array(Er/4);uniformU32=new Uint32Array(this.uniformScratch.buffer);destroyed=!1;constructor(e){this.device=e.getDevice(),this.bindGroupLayout=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});let t=this.device.createShaderModule({code:`
${v}
${L}
struct U {
  viewProj: mat4x4<f32>,
  viewport: vec4<f32>,        // x, y = w, h; z, w = unused
  sizing: vec4<f32>,          // x = sizeMode, y = worldRadius,
                              // z = pointSizePx, w = clickToleranceExtraPx
  // x = assetExpressId override (federation-aware globalId);
  // 0 means "use the per-vertex entityId attribute".
  // y = sectionEnabled (0/1), z = sectionFlipped (0/1).
  entityIdOverride: vec4<u32>,
  section: vec4<f32>,         // xyz = plane normal, w = plane distance
  model: mat4x4<f32>,
  drawableDeltaHigh: vec4<f32>,
  drawableDeltaLow: vec4<f32>,
  clipBoxMin: vec4<f32>,
  clipBoxMax: vec4<f32>,
  extraClip: ExtraClip,       // cutting planes beyond the first (#7545), eye-relative like section
}
@binding(0) @group(0) var<uniform> u: U;

struct VIn {
  @location(0) position: vec3<f32>,
  @location(1) entityId: u32,
}

struct VOut {
  @builtin(position) pos: vec4<f32>,
  @location(0) @interpolate(flat) entityId: u32,
  @location(1) quadUv: vec2<f32>,
  @location(2) worldPos: vec3<f32>,
}

@vertex
fn vs_main(input: VIn, @builtin(vertex_index) vId: u32) -> VOut {
  var corners = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
  );
  let corner = corners[vId];

  let absoluteWorld = u.model * vec4<f32>(input.position, 1.0);
  // Flag w selects the canonical RTE projection. The CPU formed the
  // drawable-camera delta in f64; this shader never subtracts two rounded
  // map-grid origins.
  let rteWorld = rteWorldPosition(absoluteWorld.xyz, RteDrawableUniform(
    u.drawableDeltaHigh,
    u.drawableDeltaLow,
  ));
  let useRte = (u.entityIdOverride.w & 1u) != 0u;
  let world = select(absoluteWorld, rteWorld, useRte);
  var clip = u.viewProj * world;

  let sizeMode = u32(u.sizing.x);
  let worldRadius = u.sizing.y;
  let pointSizePx = u.sizing.z;
  let extraPx = u.sizing.w;
  let viewport = u.viewport.xy;

  // halfPx is the RADIUS; pointSizePx is the user-facing diameter, so /2.
  var halfPx: f32;
  if (sizeMode == 0u) {
    halfPx = max(0.5, pointSizePx * 0.5);
  } else {
    let edgePos = u.viewProj * vec4<f32>(world.xyz + vec3<f32>(worldRadius, 0.0, 0.0), 1.0);
    let centerNdcX = clip.x / max(abs(clip.w), 1e-6);
    let edgeNdcX = edgePos.x / max(abs(edgePos.w), 1e-6);
    let projectedPx = abs(edgeNdcX - centerNdcX) * 0.5 * viewport.x;
    if (sizeMode == 2u) {
      halfPx = clamp(projectedPx, 0.5, max(0.5, pointSizePx * 0.5));
    } else {
      halfPx = max(0.5, projectedPx);
    }
  }
  // Extra click-tolerance pixels on every side.
  halfPx = halfPx + extraPx;

  let halfClip = vec2<f32>(halfPx) / max(viewport, vec2<f32>(1.0)) * 2.0 * abs(clip.w);
  clip.x = clip.x + corner.x * halfClip.x;
  clip.y = clip.y + corner.y * halfClip.y;

  var o: VOut;
  o.pos = clip;
  o.entityId = input.entityId;
  o.quadUv = corner;
  o.worldPos = world.xyz;
  return o;
}

@fragment
fn fs_main(input: VOut) -> @location(0) u32 {
  // Round mask — picking ignores the corner area outside the unit disc
  // so users can't accidentally select a point by clicking 1.4 splat-
  // radii away from its centre.
  if (dot(input.quadUv, input.quadUv) > 1.0) {
    discard;
  }
  // Section plane: a point the section tool cut away is unpickable (mirrors the
  // point RENDER discard so selection matches what's visible).
  if (u.entityIdOverride.y != 0u) {
    let side = select(1.0, -1.0, u.entityIdOverride.z != 0u);
    let d = (dot(u.section.xyz, input.worldPos) - u.section.w) * side;
    if (d > 0.0) {
      discard;
    }
  }
  if (extraClipClipped(u.extraClip, input.worldPos)) {
    discard;
  }
  // Crop uses the same eye-relative frame as the RTE position. Without this
  // point click and marquee selection can return points the colour pass cut.
  if ((u.entityIdOverride.w & 2u) != 0u) {
    if (any(input.worldPos < u.clipBoxMin.xyz) || any(input.worldPos > u.clipBoxMax.xyz)) {
      discard;
    }
  }
  // Prefer the asset-level expressId override when set (federation
  // relabels apply post-stream so the per-vertex attribute can go
  // stale). Fallback to the per-vertex value when no override is set.
  let id = select(input.entityId, u.entityIdOverride.x, u.entityIdOverride.x != 0u);
  return 0x80000000u | (id & 0x7FFFFFFFu);
}
`});this.pipeline=this.device.createRenderPipeline({layout:this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),vertex:{module:t,entryPoint:`vs_main`,buffers:[{arrayStride:24,stepMode:`instance`,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:20,format:`uint32`}]}]},fragment:{module:t,entryPoint:`fs_main`,targets:[{format:`r32uint`}]},primitive:{topology:`triangle-list`},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`greater`}})}drawIntoPass(e,t,n,r,i,a,o,s,c){if(!(this.destroyed||t.length===0)){e.setPipeline(this.pipeline);for(let[l,u]of t.entries()){let t=this.uniforms[l];if(!t){let e=this.device.createBuffer({size:Er,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});t={buffer:e,bindGroup:this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:e}}]})},this.uniforms.push(t)}if(this.writeUniforms(t.buffer,u,n,r,i,u.expressId>>>0,a,o,s,c)){e.setBindGroup(0,t.bindGroup);for(let t of u.chunks)t.pointCount!==0&&(e.setVertexBuffer(0,t.vertexBuffer),e.draw(6,t.pointCount,0,0))}}}}writeUniforms(e,t,n,r,i,a,o,s,c,l){let u=this.uniformScratch,d=this.uniformU32;u.set((s?.getViewProjection().m??n).subarray(0,16),0),u[16]=Math.max(1,r.width),u[17]=Math.max(1,r.height),u[18]=0,u[19]=0,u[20]=i.sizeMode,u[21]=i.worldRadius,u[22]=i.pointSizePx,u[23]=i.clickTolerancePx,d[24]=a>>>0,d[25]=+!!o,d[26]=+!!o?.flipped,d[27]=+!!s|(c?.enabled?2:0),u[28]=o?o.normal[0]:0,u[29]=o?o.normal[1]:0,u[30]=o?o.normal[2]:0;let f=s?.getCameraWorld();if(u[31]=o?o.distance-(f?o.normal[0]*f[0]+o.normal[1]*f[1]+o.normal[2]*f[2]:0):0,u.set(t.model??Dr,32),s){if(u[44]=0,u[45]=0,u[46]=0,!s.tryPackDrawableOrigin(t.rteOrigin??[t.model?.[12]??0,t.model?.[13]??0,t.model?.[14]??0],u,48))return!1}else u.fill(0,48,56);return N(c,s?.getCameraWorld()??[0,0,0],u,56),te(l,f??null,u,Tr),this.device.queue.writeBuffer(e,0,u.buffer,u.byteOffset,Er),!0}destroy(){if(!this.destroyed){this.destroyed=!0;for(let{buffer:e}of this.uniforms)e.destroy();this.uniforms=[]}}};function kr(e,t,n,r,i,a){if(!Number.isFinite(a)||a<=0)return null;let o=(t+.5)/r*2-1,s=1-(n+.5)/i*2,c=_.invert({m:e});return c?_.transformPoint(c,{x:o,y:s,z:a}):null}function Ar(e,t){if(!e)return null;let n=t.getCameraWorld();return{x:e.x+n[0],y:e.y+n[1],z:e.z+n[2]}}function jr(e,t,n,r=16){let i=ct(e?.clipBox,t,r),a=e?.sectionPlane;a?(t[r+8]=a.normal[0],t[r+9]=a.normal[1],t[r+10]=a.normal[2],t[r+11]=a.distance,i|=1,a.flipped&&(i|=2)):t.fill(0,r+8,r+12),n[0]=i,n[1]=0,n[2]=0,n[3]=0}function Mr(e,t,n,r){n.set(e.subarray(0,16),0),jr(t,n,r)}function Nr(e,t,n,r,i,a){n.fill(0),n.set(i,0),n[16]=1,n[21]=1,n[26]=1,n[31]=1,jr(a,n,r,32),e.queue.writeBuffer(t,0,n)}function Pr(e,t,n,r,i,a,o,s){if(n.fill(0),!a.tryPackDrawableOrigin(i.rteOrigin??[i.transform.m[12],i.transform.m[13],i.transform.m[14]],n,48))return!1;n.set(a.getViewProjection().m,0),n.set(i.transform.m,16),jr(o,n,r,32);let c=a.getCameraWorld();return N(o?.clipBox,c,n,32),o?.sectionPlane&&(n[43]=M(o.sectionPlane.distance,o.sectionPlane.normal,c)),e.queue.writeBuffer(t,s*256,n),!0}function Fr(e,t,n,r,i,a){Mr(i.getViewProjection().m,a,n,r);let o=i.getCameraWorld();N(a?.clipBox,o,n,16),a?.sectionPlane&&(n[27]=M(a.sectionPlane.distance,a.sectionPlane.normal,o)),O(o,n,32),n[35]=0,n[39]=0,e.queue.writeBuffer(t,0,n)}function Ir(e){return typeof e==`object`&&!!e&&e.name===`AbortError`}function Lr(...e){for(let t of e)try{t.destroy()}catch(e){console.warn(`[Picker] failed to release a readback buffer during teardown`,e)}}var Rr=class{pending=new Set;deviceLost=!1;constructor(e){e.lost&&typeof e.lost.then==`function`&&e.lost.then(()=>{this.deviceLost=!0,this.destroy()})}track(...e){for(let t of e)this.pending.add(t)}release(...e){for(let t of e)this.pending.delete(t)&&Lr(t)}destroy(){this.release(...this.pending)}},zr=class{device;pipeline;constructor(e){this.device=e,this.pipeline=e.createComputePipeline({layout:`auto`,compute:{module:e.createShaderModule({code:`
          @group(0) @binding(0) var depth: texture_depth_2d;
          @group(0) @binding(1) var<uniform> texel: vec2<u32>;
          @group(0) @binding(2) var<storage, read_write> result: f32;
          @compute @workgroup_size(1)
          fn main() {
            result = textureLoad(depth, vec2<i32>(texel), 0);
          }
        `}),entryPoint:`main`}})}encode(e,t,n,r,i,a){let o=this.device.createBuffer({size:8,usage:GPUBufferUsage.UNIFORM,mappedAtCreation:!0}),s;try{new Uint32Array(o.getMappedRange()).set([n,r]),o.unmap(),s=this.device.createBuffer({size:4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC});let c=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:t.createView({aspect:`depth-only`})},{binding:1,resource:{buffer:o}},{binding:2,resource:{buffer:s}}]}),l=e.beginComputePass();return l.setPipeline(this.pipeline),l.setBindGroup(0,c),l.dispatchWorkgroups(1),l.end(),e.copyBufferToBuffer(s,0,i,a,4),[o,s]}catch(e){throw Lr(o,...s?[s]:[]),e}}},Br=`
        ${v}
        ${L}
        struct Uniforms {
          viewProj: mat4x4<f32>, // translation-free RTE projection
          model: mat4x4<f32>,    // linear transform; translation lives in originHigh/Low
          clipBoxMin: vec4<f32>,   // xyz = min corner (world), w = pad
          clipBoxMax: vec4<f32>,   // xyz = max corner (world), w = pad
          sectionPlane: vec4<f32>, // xyz = plane normal, w = plane distance
          clipFlags: vec4<u32>,    // x: bit0 sectionEnabled, bit1 flipped, bit2 clipBox
          originHigh: vec4<f32>,
          originLow: vec4<f32>,
        }
        @binding(0) @group(0) var<uniform> uniforms: Uniforms;
        @binding(1) @group(0) var<storage, read> expressIds: array<u32>;
        @binding(2) @group(0) var<uniform> extraClip: ExtraClip;

        struct VertexInput {
          @location(0) position: vec3<f32>,
          @location(1) normal: vec3<f32>,
        }

        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0) @interpolate(flat) objectId: u32,
          @location(1) worldPos: vec3<f32>,
        }

        @vertex
        fn vs_main(input: VertexInput, @builtin(instance_index) instanceIndex: u32) -> VertexOutput {
          var output: VertexOutput;
          let linear = (uniforms.model * vec4<f32>(input.position, 0.0)).xyz;
          let relative = rteWorldPosition(linear, RteDrawableUniform(uniforms.originHigh, uniforms.originLow)).xyz;
          output.position = uniforms.viewProj * vec4<f32>(relative, 1.0);
          output.worldPos = relative;
          // Look up expressId from storage buffer using instance index
          output.objectId = expressIds[instanceIndex];
          return output;
        }

        @fragment
        fn fs_main(input: VertexOutput) -> @location(0) u32 {
          // Mirror the main render's clip discards so a click can't select a
          // fragment the user has sectioned or cropped out of view.
          if ((uniforms.clipFlags.x & 1u) != 0u) {  // section plane enabled
            let flipped = (uniforms.clipFlags.x & 2u) != 0u;
            let side = select(1.0, -1.0, flipped);
            let distToPlane = (dot(input.worldPos, uniforms.sectionPlane.xyz) - uniforms.sectionPlane.w) * side;
            if (distToPlane > 0.0) {
              discard;
            }
          }
          if (extraClipClipped(extraClip, input.worldPos)) {  // cutting planes beyond the first (#7545)
            discard;
          }
          if ((uniforms.clipFlags.x & 4u) != 0u) {  // clip box enabled
            let p = input.worldPos;
            if (any(p < uniforms.clipBoxMin.xyz) || any(p > uniforms.clipBoxMax.xyz)) {
              discard;
            }
          }
          return input.objectId;
        }
      `,Vr=`
        ${v}
        ${L}
        struct Uniforms {
          viewProj: mat4x4<f32>,
          clipBoxMin: vec4<f32>,   // xyz = min corner (world), w = pad
          clipBoxMax: vec4<f32>,   // xyz = max corner (world), w = pad
          sectionPlane: vec4<f32>, // xyz = plane normal, w = plane distance
          clipFlags: vec4<u32>,    // x: bit0 sectionEnabled, bit1 flipped, bit2 clipBox
          cameraHigh: vec4<f32>,
          cameraLow: vec4<f32>,
        }
        @binding(0) @group(0) var<uniform> uniforms: Uniforms;
        @binding(1) @group(0) var<uniform> extraClip: ExtraClip;
        struct VertexInput { @location(0) position: vec3<f32> }
        struct InstanceInput {
          @location(3) m0: vec4<f32>,
          @location(4) m1: vec4<f32>,
          @location(5) m2: vec4<f32>,
          @location(6) m3: vec4<f32>,
          @location(7) instEntityId: u32,
          @location(9) instFlags: u32,
          @location(10) anchorHigh: vec4<f32>,
          @location(11) anchorLow: vec4<f32>,
        }
        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0) @interpolate(flat) objectId: u32,
          @location(1) @interpolate(flat) instFlags: u32,
          @location(2) worldPos: vec3<f32>,
        }
        @vertex
        fn vs_main(input: VertexInput, inst: InstanceInput) -> VertexOutput {
          var output: VertexOutput;
          let m = mat4x4<f32>(inst.m0, inst.m1, inst.m2, inst.m3);
          let linear = (m * vec4<f32>(input.position, 0.0)).xyz;
          let relative = rteWorldPosition(linear, RteDrawableUniform(inst.anchorHigh, inst.anchorLow)).xyz;
          output.position = uniforms.viewProj * vec4<f32>(relative, 1.0);
          output.worldPos = relative;
          // bit 30 = instanced marker; express id in the low 30 bits.
          output.objectId = 0x40000000u | (inst.instEntityId & 0x3FFFFFFFu);
          output.instFlags = inst.instFlags;
          return output;
        }
        @fragment
        fn fs_main(input: VertexOutput) -> @location(0) u32 {
          // Hidden occurrences (flags bit 1) are not pickable — mirror the render-pass
          // discard so a hidden instanced element can't be selected through the picker.
          if ((input.instFlags & 2u) != 0u) {
            discard;
          }
          // Mirror the main render's section + crop-box discards for occurrences.
          if ((uniforms.clipFlags.x & 1u) != 0u) {  // section plane enabled
            let flipped = (uniforms.clipFlags.x & 2u) != 0u;
            let side = select(1.0, -1.0, flipped);
            let distToPlane = (dot(input.worldPos, uniforms.sectionPlane.xyz) - uniforms.sectionPlane.w) * side;
            if (distToPlane > 0.0) {
              discard;
            }
          }
          if (extraClipClipped(extraClip, input.worldPos)) {  // cutting planes beyond the first (#7545)
            discard;
          }
          if ((uniforms.clipFlags.x & 4u) != 0u) {  // clip box enabled
            let p = input.worldPos;
            if (any(p < uniforms.clipBoxMin.xyz) || any(p > uniforms.clipBoxMax.xyz)) {
              discard;
            }
          }
          return input.objectId;
        }
      `,Hr=class{device;webgpuDevice;pipeline;instancedPickPipeline=null;instancedPickBindGroup=null;instancedUniformBuffer;extraClipBuffer;extraClipScratch=new Float32Array(32);depthTexture;depthSample;colorTexture;uniformBuffer;expressIdBuffer;bindGroup;maxMeshes=1e5;destroyed=!1;readbacks;pointPicker=null;uniformScratch=new Float32Array(64);clipFlags=new Uint32Array(this.uniformScratch.buffer,176,4);instancedUniformScratch=new Float32Array(40);instancedClipFlags=new Uint32Array(this.instancedUniformScratch.buffer,112,4);constructor(e,t=1,n=1){this.webgpuDevice=e,this.device=e.getDevice(),this.readbacks=new Rr(this.device),this.depthSample=new zr(this.device),this.colorTexture=this.device.createTexture({size:{width:t,height:n},format:`r32uint`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}),this.depthTexture=this.device.createTexture({size:{width:t,height:n},format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),this.uniformBuffer=this.device.createBuffer({size:this.maxMeshes*256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.extraClipBuffer=this.device.createBuffer({size:P,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.instancedUniformBuffer=this.device.createBuffer({size:160,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.expressIdBuffer=this.device.createBuffer({size:this.maxMeshes*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});let r=this.device.createShaderModule({code:Br});this.pipeline=this.device.createRenderPipeline({layout:this.device.createPipelineLayout({bindGroupLayouts:[this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`,hasDynamicOffset:!0,minBindingSize:224}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:`read-only-storage`}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`,minBindingSize:P}}]})]}),vertex:{module:r,entryPoint:`vs_main`,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`}]}]},fragment:{module:r,entryPoint:`fs_main`,targets:[{format:`r32uint`}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`greater`}}),this.bindGroup=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer,size:224}},{binding:1,resource:{buffer:this.expressIdBuffer}},{binding:2,resource:{buffer:this.extraClipBuffer}}]});let i=this.device.createShaderModule({code:Vr});try{this.instancedPickPipeline=this.device.createRenderPipeline({layout:`auto`,vertex:{module:i,entryPoint:`vs_main`,buffers:it},fragment:{module:i,entryPoint:`fs_main`,targets:[{format:`r32uint`}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:`depth32float`,depthWriteEnabled:!0,depthCompare:`greater`}}),this.instancedPickBindGroup=this.device.createBindGroup({layout:this.instancedPickPipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.instancedUniformBuffer}},{binding:1,resource:{buffer:this.extraClipBuffer}}]})}catch(e){console.warn(`[Picker] instanced pick pipeline unavailable; instanced occurrences fall back to other pick paths:`,e),this.instancedPickPipeline=null,this.instancedPickBindGroup=null}}async pick(e,t,n,r,i,a,o,s,c,l,u){if(this.destroyed||this.readbacks.deviceLost)return null;let d=this.renderPickPass(n,r,i,a,o,s,c,l,u),f=Math.max(0,Math.min(n-1,Math.floor(e))),p=Math.max(0,Math.min(r-1,Math.floor(t))),m=this.device.createBuffer({size:256,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});this.readbacks.track(m);let h=[],g,_;try{if(d.copyTextureToBuffer({texture:this.colorTexture,origin:{x:f,y:p,z:0}},{buffer:m,bytesPerRow:256,rowsPerImage:1},{width:1,height:1}),h=this.depthSample.encode(d,this.depthTexture,f,p,m,4),this.readbacks.track(...h),this.device.queue.submit([d.finish()]),await m.mapAsync(GPUMapMode.READ),this.destroyed||this.readbacks.deviceLost)return null;let e=m.getMappedRange();g=new Uint32Array(e,0,1)[0],_=new Float32Array(e,4,1)[0]}catch(e){if(!this.readbacks.deviceLost&&!Ir(e))throw e;return null}finally{this.readbacks.release(m,...h)}let v=wr(g);if(v.kind===`none`)return null;let y=v.kind===`mesh`||v.kind===`point`||v.kind===`instanced`,b=kr(y&&u?u.getViewProjection().m:a,f,p,n,r,_);return _r(v,i,o,y&&u?Ar(b,u):b)}updateUniforms(e,t){Nr(this.device,this.uniformBuffer,this.uniformScratch,this.clipFlags,e,t)}async pickRect(e,t,n,r,i,a,o,s,c,l,u,d,f){if(this.destroyed||this.readbacks.deviceLost)return new Set;let p=Math.max(0,Math.floor(Math.min(e,n))),m=Math.max(0,Math.floor(Math.min(t,r))),h=Math.min(i-1,Math.floor(Math.max(e,n))),g=Math.min(a-1,Math.floor(Math.max(t,r))),_=h-p+1,v=g-m+1;if(_<=0||v<=0)return new Set;let y=this.renderPickPass(i,a,o,s,c,l,u,d,f),b=_*4,x=Math.ceil(b/256)*256,S=this.device.createBuffer({size:x*v,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});this.readbacks.track(S);try{if(y.copyTextureToBuffer({texture:this.colorTexture,origin:{x:p,y:m,z:0}},{buffer:S,bytesPerRow:x,rowsPerImage:v},{width:_,height:v}),this.device.queue.submit([y.finish()]),await S.mapAsync(1),this.destroyed||this.readbacks.deviceLost)return new Set;let e=new Uint32Array(S.getMappedRange()),t=new Set,n=x/4;for(let r=0;r<v;r++){let i=r*n;for(let n=0;n<_;n++){let r=e[i+n];if(r===0)continue;let a=gr(wr(r),o);a!==null&&t.add(a)}}return t}catch(e){if(!this.readbacks.deviceLost&&!Ir(e))throw e;return new Set}finally{this.readbacks.release(S)}}renderPickPass(e,t,n,r,i,a,o,s,c){(this.colorTexture.width!==e||this.colorTexture.height!==t)&&(this.colorTexture.destroy(),this.depthTexture.destroy(),this.colorTexture=this.device.createTexture({size:{width:e,height:t},format:`r32uint`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC}),this.depthTexture=this.device.createTexture({size:{width:e,height:t},format:`depth32float`,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}));let l=this.colorTexture.createView(),u=this.depthTexture.createView(),d=this.device.createCommandEncoder(),f=d.beginRenderPass({colorAttachments:[{view:l,loadOp:`clear`,clearValue:{r:0,g:0,b:0,a:0},storeOp:`store`}],depthStencilAttachment:{view:u,depthClearValue:0,depthLoadOp:`clear`,depthStoreOp:`store`}});n.length>this.maxMeshes&&this.resizeExpressIdBuffer(n.length);let p=new Uint32Array(n.length);for(let e=0;e<n.length;e++)n[e]&&(p[e]=e+1);this.device.queue.writeBuffer(this.expressIdBuffer,0,p),te(s?.extraPlanes,c?.getCameraWorld()??null,this.extraClipScratch,0),this.device.queue.writeBuffer(this.extraClipBuffer,0,this.extraClipScratch),f.setPipeline(this.pipeline);for(let e=0;e<n.length;e++){let t=n[e];if(t){if(c){if(!Pr(this.device,this.uniformBuffer,this.uniformScratch,this.clipFlags,t,c,s,e))continue}else Nr(this.device,this.uniformBuffer,this.uniformScratch,this.clipFlags,r,s);f.setBindGroup(0,this.bindGroup,[e*256]),f.setVertexBuffer(0,t.vertexBuffer),f.setIndexBuffer(t.indexBuffer,`uint32`),f.drawIndexed(t.indexCount,1,0,0,e)}}if(o&&o.length>0&&this.instancedPickPipeline&&this.instancedPickBindGroup&&c){let e=tt(this.device,o,c.getCameraWorld());Fr(this.device,this.instancedUniformBuffer,this.instancedUniformScratch,this.instancedClipFlags,c,s),f.setPipeline(this.instancedPickPipeline),f.setBindGroup(0,this.instancedPickBindGroup);for(let[t,n]of o.entries())f.setVertexBuffer(0,n.vertexBuffer),f.setVertexBuffer(1,n.instanceBuffer),f.setVertexBuffer(2,n.rteDeltas.buffer),f.setIndexBuffer(n.indexBuffer,`uint32`),rt(f,n.indexCount,e[t])}if(i&&i.length>0){this.pointPicker||=new Or(this.webgpuDevice);let n=a??{sizeMode:0,worldRadius:.02,pointSizePx:4};this.pointPicker.drawIntoPass(f,i,r,{width:e,height:t},{sizeMode:n.sizeMode,worldRadius:n.worldRadius,pointSizePx:n.pointSizePx,clickTolerancePx:n.clickTolerancePx??2},s?.sectionPlane??null,c,s?.clipBox??null,s?.extraPlanes??null)}return f.end(),d}resizeExpressIdBuffer(e){this.expressIdBuffer.destroy(),this.uniformBuffer.destroy(),this.maxMeshes=Math.ceil(e*1.5),this.expressIdBuffer=this.device.createBuffer({size:this.maxMeshes*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),this.uniformBuffer=this.device.createBuffer({size:this.maxMeshes*256,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroup=this.device.createBindGroup({layout:this.pipeline.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:this.uniformBuffer,size:224}},{binding:1,resource:{buffer:this.expressIdBuffer}},{binding:2,resource:{buffer:this.extraClipBuffer}}]})}destroy(){this.destroyed||(this.destroyed=!0,this.readbacks.destroy(),this.colorTexture.destroy(),this.depthTexture.destroy(),this.uniformBuffer.destroy(),this.instancedUniformBuffer.destroy(),this.extraClipBuffer.destroy(),this.expressIdBuffer.destroy(),this.pointPicker?.destroy(),this.pointPicker=null)}};function Ur(){return{tangent:[0,0,-1],bitangent:[1,0,0]}}Wr=function(e){let t=Math.hypot(e[0],e[1],e[2]);if(!(t>0&&t<1/0))return Ur();let n=e[0]/t,r=e[1]/t,i=e[2]/t,a=n!==0||i!==0,o=+!a,s=+!!a,c=r*0-i*s,l=i*o-n*0,u=n*s-r*o,d=Math.hypot(c,l,u);d>0||(c=0,l=0,u=-1,d=1),c/=d,l/=d,u/=d;let f=l*i-u*r,p=u*n-c*i,m=c*r-l*n,h=Math.hypot(f,p,m)||1;return f/=h,p/=h,m/=h,{tangent:[c,l,u],bitangent:[f,p,m]}};Gr=function(e){let t=Math.abs(e[0]),n=Math.abs(e[1]),r=Math.abs(e[2]);return n>=t&&n>=r?{axis:`down`,flipped:e[1]<0}:t>=r?{axis:`side`,flipped:e[0]<0}:{axis:`front`,flipped:e[2]<0}};function Kr(e,t,n,r,i){let{min:a,max:o}=n,s=1.1,c=(o.x-a.x)*s,l=(o.y-a.y)*s,u=(o.z-a.z)*s,d=(a.x+o.x)/2,f=(a.y+o.y)/2,p=(a.z+o.z)/2,m=t/100,h=e===`side`?`x`:e===`down`?`y`:`z`,g=r??a[h],_=i??o[h];if(e===`side`){let e=g+m*(_-g),t=l/2,n=u/2;return new Float64Array([e,f-t,p-n,0,0,e,f+t,p-n,1,0,e,f+t,p+n,1,1,e,f-t,p-n,0,0,e,f+t,p+n,1,1,e,f-t,p+n,0,1])}if(e===`down`){let e=g+m*(_-g),t=c/2,n=u/2;return new Float64Array([d-t,e,p-n,0,0,d+t,e,p-n,1,0,d+t,e,p+n,1,1,d-t,e,p-n,0,0,d+t,e,p+n,1,1,d-t,e,p+n,0,1])}let v=g+m*(_-g),y=c/2,b=l/2;return new Float64Array([d-y,f-b,v,0,0,d+y,f-b,v,1,0,d+y,f+b,v,1,1,d-y,f-b,v,0,0,d+y,f+b,v,1,1,d-y,f+b,v,0,1])}function qr(e,t,n){let[r,i,a]=e,o=Math.hypot(r,i,a);if(!(o>=1e-6&&o<1/0))return new Float64Array(30);r/=o,i/=o,a/=o;let s=t/o,{min:c,max:l}=n,u=(c.x+l.x)/2,d=(c.y+l.y)/2,f=(c.z+l.z)/2,p=s-(u*r+d*i+f*a),m=u+r*p,h=d+i*p,g=f+a*p,{tangent:_,bitangent:v}=Wr([r,i,a]),y=.55*Math.hypot(l.x-c.x,l.y-c.y,l.z-c.z),b=[m-_[0]*y-v[0]*y,h-_[1]*y-v[1]*y,g-_[2]*y-v[2]*y],x=[m+_[0]*y-v[0]*y,h+_[1]*y-v[1]*y,g+_[2]*y-v[2]*y],S=[m+_[0]*y+v[0]*y,h+_[1]*y+v[1]*y,g+_[2]*y+v[2]*y],C=[m-_[0]*y+v[0]*y,h-_[1]*y+v[1]*y,g-_[2]*y+v[2]*y];return new Float64Array([...b,0,0,...x,1,0,...S,1,1,...b,0,0,...S,1,1,...C,0,1])}var Jr={rteViewProj:0,planeColor:16,drawableDelta:20},Yr=28,Xr=class{device;bindGroupLayout=null;previewPipeline=null;cutPipeline=null;vertexBuffer=null;uniformBuffer=null;bindGroup=null;format;sampleCount;initialized=!1;planeColor=[.012,.663,.957,1];constructor(e,t,n=4){this.device=e,this.format=t,this.sampleCount=n}setPlaneColor(e){this.planeColor=e}init(){if(this.initialized)return;this.bindGroupLayout=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});let e=this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),t=this.device.createShaderModule({code:`${v}
        struct Uniforms {
          rteFrame: RteFrameUniform,
          planeColor: vec4<f32>,
          drawable: RteDrawableUniform,
        }
        @binding(0) @group(0) var<uniform> uniforms: Uniforms;

        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0) uv: vec2<f32>,
        }

        @vertex
        fn vs_main(@location(0) position: vec3<f32>, @location(1) uv: vec2<f32>) -> VertexOutput {
          var output: VertexOutput;
          output.position = uniforms.rteFrame.viewProj * rteWorldPosition(position, uniforms.drawable);
          output.uv = uv;
          return output;
        }

        // Two outputs so the pipeline matches the main pass's two colour
        // attachments. objectId is masked off at the pipeline level.
        struct FragOut {
          @location(0) color:    vec4<f32>,
          @location(1) objectId: vec4<f32>,
        }

        @fragment
        fn fs_main(input: VertexOutput) -> FragOut {
          // Create fine grid pattern
          let gridSize = 0.01;           // Fine grid cells (100 divisions)
          let lineWidth = 0.001;         // Very thin lines
          let majorGridSize = 0.1;       // Major grid every 10 cells
          let majorLineWidth = 0.002;    // Slightly thicker major lines

          // Minor grid
          let gridX = abs(fract(input.uv.x / gridSize + 0.5) - 0.5);
          let gridY = abs(fract(input.uv.y / gridSize + 0.5) - 0.5);
          let isMinorGridLine = min(gridX, gridY) < lineWidth;

          // Major grid (every 10 cells)
          let majorX = abs(fract(input.uv.x / majorGridSize + 0.5) - 0.5);
          let majorY = abs(fract(input.uv.y / majorGridSize + 0.5) - 0.5);
          let isMajorGridLine = min(majorX, majorY) < majorLineWidth;

          // Soft edge fade
          let edgeDist = min(input.uv.x, min(input.uv.y, min(1.0 - input.uv.x, 1.0 - input.uv.y)));
          let edgeFade = smoothstep(0.0, 0.08, edgeDist);

          // Subtle border
          let borderGlow = 1.0 - smoothstep(0.0, 0.03, edgeDist);

          var color = uniforms.planeColor;

          // Layered rendering: base fill + minor grid + major grid + border
          if (isMajorGridLine) {
            // Major grid lines - subtle white
            color = vec4<f32>(1.0, 1.0, 1.0, color.a * 1.5);
          } else if (isMinorGridLine) {
            // Minor grid lines - slightly brighter
            color = vec4<f32>(color.rgb * 1.3, color.a * 1.2);
          }

          // Add subtle border
          color = vec4<f32>(
            mix(color.rgb, vec3<f32>(1.0, 1.0, 1.0), borderGlow * 0.3),
            color.a + borderGlow * 0.2
          );

          // Apply edge fade
          color.a *= edgeFade;

          // Clamp alpha
          color.a = min(color.a, 0.5);

          var out: FragOut;
          out.color    = color;
          out.objectId = vec4<f32>(0.0, 0.0, 0.0, 0.0);
          return out;
        }
      `}),n={layout:e,vertex:{module:t,entryPoint:`vs_main`,buffers:[{arrayStride:20,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x2`}]}]},fragment:{module:t,entryPoint:`fs_main`,targets:[{format:this.format,blend:{color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}}},{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`triangle-list`,cullMode:`none`},multisample:{count:this.sampleCount}};this.previewPipeline=this.device.createRenderPipeline({...n,depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`greater`}}),this.cutPipeline=this.device.createRenderPipeline({...n,depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`always`}}),this.vertexBuffer=this.device.createBuffer({size:120,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.uniformBuffer=this.device.createBuffer({size:Yr*4,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroup=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]}),this.initialized=!0}draw(e,t){if(this.init(),!this.previewPipeline||!this.cutPipeline||!this.vertexBuffer||!this.uniformBuffer||!this.bindGroup)return;let{axis:n,position:r,bounds:i,relativeToEyeFrame:a,viewProj:o,isPreview:s,min:c,max:l,normal:u,distance:d}=t;if(!s||!a&&!o)return;let f=u!==void 0&&d!==void 0&&Number.isFinite(d)?qr(u,d,i):Kr(n,r,i,c,l),p=[f[0],f[1],f[2]],m=new Float32Array(f.length);if(a)for(let e=0;e<f.length;e+=5)m[e]=f[e]-p[0],m[e+1]=f[e+1]-p[1],m[e+2]=f[e+2]-p[2],m[e+3]=f[e+3],m[e+4]=f[e+4];else m.set(f);this.device.queue.writeBuffer(this.vertexBuffer,0,m);let h=new Float32Array(Yr);if(a){if(a.packUniforms(h,Jr.rteViewProj),!a.tryPackDrawableOrigin(p,h,Jr.drawableDelta))return}else h.set(o,Jr.rteViewProj);h[Jr.planeColor]=this.planeColor[0],h[Jr.planeColor+1]=this.planeColor[1],h[Jr.planeColor+2]=this.planeColor[2],h[Jr.planeColor+3]=.25,this.device.queue.writeBuffer(this.uniformBuffer,0,h),e.setPipeline(this.previewPipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.draw(6)}destroy(){this.vertexBuffer?.destroy(),this.vertexBuffer=null,this.uniformBuffer?.destroy(),this.uniformBuffer=null,this.initialized=!1}};function Zr(e,t,n,r){let i=e.createBuffer({label:`symbolic-fill-vbuf`,size:n.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),a;try{e.queue.writeBuffer(i,0,n),a=e.createBuffer({label:`symbolic-fill-partition-camera`,size:160,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let o=e.createBindGroup({label:`symbolic-fill-partition-bg`,layout:t,entries:[{binding:0,resource:{buffer:a}}]});r(i,a,o)}catch(e){throw i.destroy(),a?.destroy(),e}}var Qr=1024,$r=48,ei=14;function ti(e,t,n,r){let i=6/r;return{qx0:t-6,qyBottom:n-6,widthAtlas:e.widthPx+12,heightGlyphAtlas:e.heightPx+12,uvBounds:[e.u0-i,e.v0-i,e.u1+i,e.v1+i]}}var ni=`"Inter", "Helvetica Neue", "Segoe UI", system-ui, -apple-system, sans-serif`,ri=class{canvas;atlasSize;glyphPx;rowHeight;baselinePx;ctx;glyphs=new Map;cursorX=ei;cursorY=ei;version=0;constructor(e={}){this.atlasSize=e.atlasSize??Qr,this.glyphPx=e.glyphPx??$r,this.rowHeight=this.glyphPx+28,this.baselinePx=Math.round(this.glyphPx*.8),this.canvas=document.createElement(`canvas`),this.canvas.width=this.atlasSize,this.canvas.height=this.atlasSize;let t=this.canvas.getContext(`2d`,{willReadFrequently:!1});if(!t)throw Error(`SymbolicTextAtlas: 2D canvas context unavailable`);this.ctx=t,this.ctx.font=`${this.glyphPx}px ${e.fontFamily??ni}`,this.ctx.textBaseline=`alphabetic`,this.ctx.fillStyle=`white`,this.ctx.clearRect(0,0,this.atlasSize,this.atlasSize)}getVersion(){return this.version}getOrAddGlyph(e){let t=this.glyphs.get(e);if(t)return t;let n=this.ctx.measureText(e),r=n.actualBoundingBoxAscent??this.baselinePx,i=n.actualBoundingBoxDescent??this.glyphPx-this.baselinePx,a=Math.max(1,Math.ceil(n.width)),o=Math.max(1,Math.ceil(r+i));return this.cursorX+a+ei>this.atlasSize&&(this.cursorX=ei,this.cursorY+=this.rowHeight),this.cursorY+o+ei>this.atlasSize?null:(this.ctx.fillText(e,this.cursorX,this.cursorY+r),t={u0:this.cursorX/this.atlasSize,v0:this.cursorY/this.atlasSize,u1:(this.cursorX+a)/this.atlasSize,v1:(this.cursorY+o)/this.atlasSize,widthPx:a,heightPx:o,advancePx:n.width,baselinePx:r},this.glyphs.set(e,t),this.cursorX+=a+ei,this.version++,t)}layoutString(e){let t=[],n=0;for(let r of e){let e=this.getOrAddGlyph(r);e?(t.push({xOffsetPx:n,glyph:e}),n+=e.advancePx):n+=this.glyphPx*.5}return{glyphs:t,totalAdvancePx:n}}},ii=`
struct Camera {
  viewProj: mat4x4<f32>,
  rteViewProj: mat4x4<f32>,
  originHigh: vec4<f32>,
  originLow: vec4<f32>,
};

@group(0) @binding(0) var<uniform> camera: Camera;

struct VsIn {
  @location(0) position: vec3<f32>,
  @location(1) color:    vec4<f32>,
};

struct VsOut {
  @builtin(position) clipPos: vec4<f32>,
  @location(0)        color:  vec4<f32>,
};

@vertex
fn vs_main(in: VsIn) -> VsOut {
  var out: VsOut;
  let global = camera.viewProj * vec4<f32>(in.position, 1.0);
  let relative = (in.position + camera.originHigh.xyz) + camera.originLow.xyz;
  out.clipPos = select(global, camera.rteViewProj * vec4<f32>(relative, 1.0), camera.originHigh.w == 1.0);
  out.color   = in.color;
  return out;
}

@fragment
fn fs_main(in: VsOut) -> @location(0) vec4<f32> {
  // Premultiply alpha so the standard "src * 1 + dst * (1-src.a)" blend
  // produces the correct composite on top of the existing scene.
  return vec4<f32>(in.color.rgb * in.color.a, in.color.a);
}
`,ai=`
${Ae}
struct Camera {
  viewProj: mat4x4<f32>,
  // Legacy labels keep using viewProj. Anchored labels select this
  // translation-free eye-relative matrix per instance.
  rteViewProj: mat4x4<f32>,
  // x = viewport width in physical pixels, y = viewport height
  // z = target glyph cap-height in screen pixels, w = padding
  viewportAndTarget: vec4<f32>,
  // Screen-aligned camera basis (world space). xyz = direction, w = padding.
  // Used by billboarded glyphs (grid tags) so they always face the camera —
  // critical for top-down/ground views where world-up upAxis collapses to
  // zero screen extent and the tag becomes invisible.
  cameraRight: vec4<f32>,
  cameraUp:    vec4<f32>,
  // Retained for the 208-byte symbolic-text uniform ABI. RTE text now packs
  // its drawable-minus-camera delta on the CPU rather than subtracting these
  // independently rounded absolute values in WGSL.
  cameraHigh: vec4<f32>,
  cameraLow:  vec4<f32>,
};

@group(0) @binding(0) var<uniform> camera: Camera;
@group(0) @binding(1) var atlasTex: texture_2d<f32>;
@group(0) @binding(2) var atlasSamp: sampler;

// Per-vertex (corner of the glyph quad).
struct VsIn {
  // Bit-packed corner index 0..3. The vertex buffer is just [0u, 1u, 2u, 3u].
  @location(0) corner: u32,
};

// Per-instance attributes — one record per glyph.
struct InstIn {
  // World-space origin of the glyph (bottom-left, after alignment + rotation).
  @location(1) origin: vec3<f32>,
  // Right axis in world space — encodes both glyph width and baseline rotation.
  @location(2) rightAxis: vec3<f32>,
  // Up axis in world space — encodes glyph height and baseline rotation.
  @location(3) upAxis: vec3<f32>,
  // Atlas UV bounds: (u0, v0, u1, v1).
  @location(4) uvBounds: vec4<f32>,
  // Glyph tint (sRGB straight-alpha).
  @location(5) color: vec4<f32>,
  // Shared text-label anchor (every glyph in the same label uses the same
  // anchor). Lets the shader compute one screen-space scale per label and
  // apply it uniformly to every glyph offset so row spacing stays in sync.
  @location(6) anchor: vec3<f32>,
  // Authored cap height in world units. Same value for every glyph in the
  // label; used to convert "target pixels" into a scale factor.
  @location(7) capHeight: f32,
  // Billboard flag (1.0 = use camera-aligned axes, 0.0 = use authored
  // rightAxis/upAxis). Only the grid-tag emission path sets this to 1.0.
  @location(8) billboard: f32,
  // Per-glyph baseline-relative offset + size in WORLD units. Only used
  // when billboard=1 (the authored origin bakes the offset along the
  // floor-plane basis, which is the wrong direction for camera-aligned
  // text). For non-billboard glyphs these are written too but the shader
  // picks the authored path. World units = atlas-pixel * wScale.
  //   .xy = (offsetX, offsetY) from anchor to glyph BL
  //   .zw = (width, height) of the glyph quad
  @location(9) glyphOffsetSize: vec4<f32>,
  // Per-instance target cap height in screen pixels. 0 = fall back to
  // the renderer global default (viewportAndTarget.z). Grid bubble
  // glyphs override with a larger value so the bubble stays proportional
  // to the tag at every zoom level.
  @location(10) targetPxOverride: f32,
  // CPU-packed drawable-minus-camera delta. deltaHigh.w == 1 selects the
  // RTE route; deltaLow.w marks an anchor-local static glyph origin for the
  // legacy projection path too.
  @location(11) deltaHigh: vec4<f32>,
  @location(12) deltaLow: vec4<f32>,
};

struct VsOut {
  @builtin(position) clipPos: vec4<f32>,
  @location(0) uv:    vec2<f32>,
  @location(1) color: vec4<f32>,
};

fn rteClipPosition(
  local: vec3<f32>, high: vec3<f32>, low: vec3<f32>, viewProj: mat4x4<f32>,
) -> vec4<f32> {
  // Do not first reconstruct a million-metre f32 position: that addition can
  // discard centimetre local lanes before projection. Transform high and the
  // combined local/low term independently, then combine in clip space where projection has
  // reduced or cancelled the coordinate scale. A final raw f32 eye vector
  // still cannot represent a sub-ULP residual at the \xb11,000,000 m boundary.
  return viewProj * vec4<f32>(high, 1.0) + viewProj * vec4<f32>(local + low, 0.0);
}

@vertex
fn vs_main(in: VsIn, inst: InstIn) -> VsOut {
  // Map corner index to (u, v) in [0, 1] — the four quad corners.
  //   0 = bottom-left, 1 = bottom-right, 2 = top-left, 3 = top-right.
  let u = f32((in.corner & 1u));      // 0,1,0,1
  let v = f32((in.corner >> 1u) & 1u); // 0,0,1,1

  // ── Screen-space text scaling (projection-agnostic) ──
  // For non-billboard glyphs measure world-Y → screen pixels (matches the
  // authored upAxis convention). For billboard glyphs measure cameraUp →
  // screen pixels — that axis ALWAYS spans the full viewport height
  // regardless of view angle, so screen-space scaling stays correct in
  // top-down / ground / oblique views.
  let isBillboard = inst.billboard > 0.5;
  let isRte = inst.deltaHigh.w == 1.0;
  let hasLocalOrigin = inst.deltaLow.w == 1.0;
  // The f64 CPU path has already formed the drawable-camera delta. Project
  // split terms independently so projection can retain low residuals.
  let scaleProbeAxis = select(vec3<f32>(0.0, 1.0, 0.0), camera.cameraUp.xyz, isBillboard);
  let aClip = select(
    camera.viewProj * vec4<f32>(inst.anchor, 1.0),
    rteClipPosition(vec3<f32>(0.0), inst.deltaHigh.xyz, inst.deltaLow.xyz, camera.rteViewProj),
    isRte,
  );
  let bClip = select(
    camera.viewProj * vec4<f32>(inst.anchor + scaleProbeAxis, 1.0),
    rteClipPosition(scaleProbeAxis, inst.deltaHigh.xyz, inst.deltaLow.xyz, camera.rteViewProj),
    isRte,
  );
  let aNdc = aClip.xy / max(abs(aClip.w), 1e-4);
  let bNdc = bClip.xy / max(abs(bClip.w), 1e-4);
  let unitYPx = length(bNdc - aNdc) * camera.viewportAndTarget.y * 0.5;

  let safeCap = max(inst.capHeight, 1e-4);
  let currentPx = safeCap * unitYPx;
  // Per-instance target overrides the uniform default (used by grid bubble
  // glyphs to render at a larger on-screen size than the inscribed tag).
  let targetPx = select(camera.viewportAndTarget.z, inst.targetPxOverride, inst.targetPxOverride > 0.0);
  // Clamp to (0.02, 1.0]: never grow text beyond authored size; never
  // shrink below ~2%.
  let scale = clamp(
    targetPx / max(currentPx, 1e-2),
    0.02,
    1.0,
  );

  // ── Position the glyph quad in world space ──
  // Non-billboard: authored axes (text lies in the floor plane of its
  // annotation — IFC convention). Billboard: camera-aligned axes (text
  // always faces the camera — grid-tag convention).
  // Anchored producers retain a small glyph-local origin; legacy producers
  // retain the original absolute origin and derive its local offset here.
  let authoredLocalOffset = select(inst.origin - inst.anchor, inst.origin, hasLocalOrigin);
  let authoredLocalPos =
      authoredLocalOffset * scale
    + inst.rightAxis * scale * u
    + inst.upAxis    * scale * v;

  // Billboard: rebuild the quad in screen-aligned camera basis. glyphOffsetSize
  // carries the same 2D atlas-pixel layout the upload computed, just in
  // world units — re-project onto (cameraRight, cameraUp) so it tracks the
  // viewer's eye in every orientation.
  let bbOffsetX = inst.glyphOffsetSize.x;
  let bbOffsetY = inst.glyphOffsetSize.y;
  let bbWidth   = inst.glyphOffsetSize.z;
  let bbHeight  = inst.glyphOffsetSize.w;
  let billboardLocalPos =
      (camera.cameraRight.xyz * bbOffsetX + camera.cameraUp.xyz * bbOffsetY) * scale
    + (camera.cameraRight.xyz * bbWidth   * u
     + camera.cameraUp.xyz    * bbHeight  * v) * scale;

  let glyphLocalPos = select(authoredLocalPos, billboardLocalPos, isBillboard);
  let worldPos = inst.anchor + glyphLocalPos;

  // UV: lerp atlas bounds. Note v inverted (atlas top is v=0).
  let uMix = mix(inst.uvBounds.x, inst.uvBounds.z, u);
  let vMix = mix(inst.uvBounds.w, inst.uvBounds.y, v);

  var out: VsOut;
  let clip = select(
    camera.viewProj * vec4<f32>(worldPos, 1.0),
    rteClipPosition(glyphLocalPos, inst.deltaHigh.xyz, inst.deltaLow.xyz, camera.rteViewProj),
    isRte,
  );
  // Reverse-Z decal nudge for text coplanar with model faces (issue #812
  // follow-up: "30", "1.49" etc. flickering against the terrain). The
  // pipeline-level depthBiasSlopeScale collapses to ~0 for billboard
  // glyphs — the quad faces the camera, so depth slope across the quad
  // is zero — leaving only a tiny -4 constant that MSAA jitter beats.
  // Lift it in clip space instead, the same way the line pipeline does,
  // above MSAA jitter and the mesh depth nudge.
  out.clipPos = vec4<f32>(clip.x, clip.y, overlayLiftedClipZ(clip, camera.viewProj), clip.w);
  out.uv      = vec2<f32>(uMix, vMix);
  out.color   = inst.color;
  return out;
}

// Halo (#5388): labels sit over model geometry as often as over the empty
// backdrop, so no single ink is legible on both. Every glyph gets a thin
// contrasting outline: the glyph coverage dilated by HALO_TEXELS, drawn under
// the glyph in black (light text) or white (dark text). The quad and its UVs
// were widened by the same margin on upload, and the atlas packs glyphs far
// enough apart that the taps never reach a neighbour.
const HALO_TEXELS: f32 = 6.0;
const HALO_OPACITY: f32 = 0.8;
const HALO_DIRS = array<vec2<f32>, 8>(
  vec2<f32>(1.0, 0.0), vec2<f32>(-1.0, 0.0), vec2<f32>(0.0, 1.0), vec2<f32>(0.0, -1.0),
  vec2<f32>(0.7071, 0.7071), vec2<f32>(-0.7071, 0.7071), vec2<f32>(0.7071, -0.7071), vec2<f32>(-0.7071, -0.7071),
);

@fragment
fn fs_main(in: VsOut) -> @location(0) vec4<f32> {
  // The atlas was rasterised with white glyphs on a transparent background,
  // so atlas.a is the coverage.
  let coverage = textureSample(atlasTex, atlasSamp, in.uv).a;
  let texel = 1.0 / vec2<f32>(textureDimensions(atlasTex));
  var dilated = coverage;
  // Two rings (full and half radius) so thin strokes and counters fill in.
  for (var i = 0u; i < 8u; i = i + 1u) {
    let d = HALO_DIRS[i] * texel * HALO_TEXELS;
    dilated = max(dilated, textureSample(atlasTex, atlasSamp, in.uv + d).a);
    dilated = max(dilated, textureSample(atlasTex, atlasSamp, in.uv + d * 0.5).a);
  }
  let luminance = dot(in.color.rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
  let haloRgb = select(vec3<f32>(1.0), vec3<f32>(0.0), luminance > 0.5);
  // Glyph over halo, premultiplied for the standard composite.
  let glyphA = coverage * in.color.a;
  let haloA = dilated * HALO_OPACITY * in.color.a * (1.0 - glyphA);
  return vec4<f32>(in.color.rgb * glyphA + haloRgb * haloA, glyphA + haloA);
}
`;function oi(e,t,n){return nt(e.length,r=>{let i=r*8,a=e[r],o=!0;return a&&t?(o=E(a,t,n,i),o&&(n[i+3]=1)):n.fill(0,i,i+8),a&&(n[i+7]=1),o})}var si=1e-12;function ci(e,t,n){let r=t.x-e.x,i=t.z-e.z,a=n.x-e.x,o=n.z-e.z,s=r*o-i*a,c=Math.hypot(r,i)*Math.hypot(a,o);return Math.abs(s)<=si*c?0:s>0?1:-1}function li(e,t,n,r){return ci(n,r,e)*ci(n,r,t)<0&&ci(e,t,n)*ci(e,t,r)<0}function ui(e,t,n,r){if(ci(t,n,e)!==0)return!1;let i=(n.x-t.x)**2+(n.z-t.z)**2;if(i===0)return r&&e.x===t.x&&e.z===t.z;let a=((e.x-t.x)*(n.x-t.x)+(e.z-t.z)*(n.z-t.z))/i;return r?a>=-1e-12&&a<=1.000000000001:a>si&&a<.999999999999}function di(e){let t=1/0,n=-1/0,r=1/0,i=-1/0;for(let a of e)a.x<t&&(t=a.x),a.x>n&&(n=a.x),a.z<r&&(r=a.z),a.z>i&&(i=a.z);let a=Math.max(n-t,i-r);return Number.isFinite(a)&&a>0?a:1}function fi(e,t,n){let r=si*n;return Math.abs(e.x-t.x)<=r&&Math.abs(e.z-t.z)<=r}function pi(e,t,n,r){let i=e[n],a=t[r];for(let t=0;t<e.length;t++){let r=(t+1)%e.length;if(t!==n&&r!==n&&li(i,a,e[t],e[r])||t!==n&&ui(e[t],i,a,!1))return!1}for(let e=0;e<t.length;e++){let n=(e+1)%t.length;if(e!==r&&n!==r&&li(i,a,t[e],t[n])||e!==r&&ui(t[e],i,a,!1))return!1}return!0}function mi(e,t,n){if(e.length===0)return-1;let r=t[n];if(r===void 0)return-1;let i=e.map((e,t)=>({i:t,right:e.x>r.x,d:(e.x-r.x)**2+(e.z-r.z)**2})).sort((e,t)=>e.right===t.right?e.d-t.d:e.right?-1:1);for(let r of i)if(pi(e,t,r.i,n))return r.i;return i[0].i}function hi(e){let t=0;for(let n=0;n<e.length;n++){let r=e[n],i=e[(n+1)%e.length];t+=r.x*i.z-i.x*r.z}return t/2}function gi(e,t){let n=!1;for(let r=0,i=t.length-1;r<t.length;i=r++){let a=t[r],o=t[i];a.z>e.z!=o.z>e.z&&e.x<(o.x-a.x)*(e.z-a.z)/(o.z-a.z)+a.x&&(n=!n)}return n}function _i(e,t){for(let n=0,r=t.length-1;n<t.length;r=n++)if(ui(e,t[n],t[r],!0))return!0;return!1}function vi(e,t){for(let n of e)if(!_i(n,t))return gi(n,t);return!1}function yi(e){let t=e.filter(e=>e.length>=3).map(e=>e.slice()),n=t.map((e,n)=>t.reduce((t,r,i)=>i!==n&&vi(e,r)?t+1:t,0)),r=[];for(let e=0;e<t.length;e++){if(n[e]%2!=0)continue;let i=[];for(let r=0;r<t.length;r++)r!==e&&n[r]===n[e]+1&&vi(t[r],t[e])&&i.push(t[r]);r.push({outer:t[e],holes:i})}return r}function bi(e){return hi(e)>=0?e:e.slice().reverse()}function xi(e){return hi(e)<=0?e:e.slice().reverse()}function Si(e,t){if(t.length===0)return e;let n=t.filter(e=>e.length>=3).map(e=>xi(e)).map(e=>{let t=0;for(let n=1;n<e.length;n++)e[n].x>e[t].x&&(t=n);return{ring:e,startIdx:t,startX:e[t].x}}).sort((e,t)=>t.startX-e.startX),r=bi(e).slice();for(let{ring:e,startIdx:t}of n){let n=mi(r,e,t);if(n<0)continue;let i=[...e.slice(t),...e.slice(0,t)];r=[...r.slice(0,n+1),...i,i[0],r[n],...r.slice(n+1)]}return r}function Ci(e,t,n,r){let i=(e.x-r.x)*(t.z-r.z)-(t.x-r.x)*(e.z-r.z),a=(e.x-t.x)*(n.z-t.z)-(n.x-t.x)*(e.z-t.z),o=(e.x-n.x)*(r.z-n.z)-(r.x-n.x)*(e.z-n.z);return!((i<0||a<0||o<0)&&(i>0||a>0||o>0))}function wi(e){let t=e.length;if(t<3)return[];let n=di(e),r=0;for(let n=0;n<t;n++){let i=e[n],a=e[(n+1)%t];r+=i.x*a.z-a.x*i.z}let i=[];for(let e=0;e<t;e++)i.push(r>0?e:t-1-e);let a=[],o=i.length*i.length;for(;i.length>3&&o-- >0;){let t=!1;for(let r=0;r<i.length;r++){if(!Ti(e,i,r,n))continue;let o=i.length;a.push([i[(r+o-1)%o],i[r],i[(r+1)%o]]),i.splice(r,1),t=!0;break}if(t)continue;let r=Ei(e,i);if(r<0)break;i.splice(r,1)}return i.length===3&&a.push([i[0],i[1],i[2]]),a}function Ti(e,t,n,r){let i=t.length,a=t[(n+i-1)%i],o=t[n],s=t[(n+1)%i],c=e[a],l=e[o],u=e[s];if(ci(c,l,u)<=0)return!1;for(let n=0;n<i;n++){let d=t[n];if(d===a||d===o||d===s)continue;let f=e[d];if(fi(f,c,r)||fi(f,l,r)||fi(f,u,r))continue;let p=e[t[(n+i-1)%i]],m=e[t[(n+1)%i]];if(!(ci(p,f,m)>0)&&Ci(f,c,l,u))return!1}return!0}function Ei(e,t){let n=t.length;for(let r=0;r<n;r++){let i=e[t[(r+n-1)%n]],a=e[t[r]],o=e[t[(r+1)%n]];if(ci(i,a,o)===0)return r}return-1}function Di(e){let t=[],n=[];for(let r of yi(e)){let e=r.holes.length===0?r.outer:Si(r.outer,r.holes),i=wi(e);if(i.length===0)continue;let a=t.length;for(let n of e)t.push(n);for(let[e,t,r]of i)n.push([a+e,a+t,a+r])}return{points:t,triangles:n}}function Oi(e){let t=e.toLowerCase().trim();if(t===``)return{horizontal:0,vertical:-1};let n=t.split(`-`),r=n.length>=2?n[0]:t,i=n.length>=2?n[1]:t,a=r.includes(`top`)?0:r.includes(`middle`)||r.includes(`center`)?-.5:-1;return{horizontal:i.includes(`right`)?-1:i.includes(`middle`)||i.includes(`center`)?-.5:0,vertical:a}}function ki(e,t){let{points:n,holesOffsets:r,worldY:i,color:a}=t;if(n.length<6)return;let o=n.length/2,s=[0,...Array.from(r),o],c=[];for(let e=0;e<s.length-1;e++){let t=s[e],r=s[e+1];if(r-t<3)continue;let i=[];for(let e=t;e<r;e++)i.push({x:n[e*2],z:n[e*2+1]});c.push(i)}if(c.length===0)return;let{points:l,triangles:u}=Di(c);for(let t of u)for(let n of t){let t=l[n];e.push(t.x,i,t.z,a[0],a[1],a[2],a[3])}}var Ai=28,ji=27,Mi=108,Ni=208,Pi=14,Fi=class{device;format;sampleCount;pipeline=null;bindGroupLayout=null;partitions=[];constructor(e,t,n=1){this.device=e,this.format=t,this.sampleCount=n}init(){if(this.pipeline)return;this.bindGroupLayout=this.device.createBindGroupLayout({label:`symbolic-fill-bgl`,entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:`uniform`}}]});let e=this.device.createShaderModule({label:`symbolic-fill-shader`,code:ii});this.pipeline=this.device.createRenderPipeline({label:`symbolic-fill-pipeline`,layout:this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),vertex:{module:e,entryPoint:`vs_main`,buffers:[{arrayStride:Ai,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x4`}]}]},fragment:{module:e,entryPoint:`fs_main`,targets:[{format:this.format,blend:{color:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}},writeMask:GPUColorWrite.ALL},{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`greater-equal`,depthBias:-4,depthBiasSlopeScale:-.5,depthBiasClamp:0},multisample:{count:this.sampleCount}})}upload(e){this.init();for(let e of this.partitions)e.vertexBuffer.destroy(),e.uniformBuffer.destroy();if(this.partitions=[],e.length===0)return;let t=[];for(let n of e){let e=[];ki(e,n),n.origin?this.addPartition(e,n.origin):t.push(...e)}this.addPartition(t)}hasGeometry(){return this.partitions.length>0}addPartition(e,t){if(e.length===0||!this.bindGroupLayout)return;let n=new Float32Array(e);Zr(this.device,this.bindGroupLayout,n,(e,r,i)=>{this.partitions.push({vertexBuffer:e,uniformBuffer:r,bindGroup:i,vertexCount:n.length/(Ai/4),origin:t})})}render(e,t,n,r){if(this.pipeline){e.setPipeline(this.pipeline);for(let i of this.partitions){let a=new Float32Array(40);if(a.set(t),i.origin&&n&&r){if(a.set(n,16),!E(i.origin,r,a,32))continue;a[35]=1}this.device.queue.writeBuffer(i.uniformBuffer,0,a),e.setBindGroup(0,i.bindGroup),e.setVertexBuffer(0,i.vertexBuffer),e.draw(i.vertexCount)}}}destroy(){for(let e of this.partitions)e.vertexBuffer.destroy(),e.uniformBuffer.destroy();this.partitions=[],this.bindGroupLayout=null,this.pipeline=null}},Ii=class{device;format;sampleCount;atlas;pipeline=null;bindGroupLayout=null;uniformBuffer=null;cornerBuffer=null;instanceBuffer=null;rteDeltaBuffer=null;atlasTexture=null;atlasView=null;sampler=null;bindGroup=null;instanceCount=0;rteDeltaData=null;instanceAnchors=[];uploadedAtlasVersion=-1;constructor(e,t,n=1,r){this.device=e,this.format=t,this.sampleCount=n,this.atlas=r??new ri}getAtlas(){return this.atlas}init(){if(this.pipeline)return;this.bindGroupLayout=this.device.createBindGroupLayout({label:`symbolic-text-bgl`,entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:`uniform`}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`float`}},{binding:2,visibility:GPUShaderStage.FRAGMENT,sampler:{type:`filtering`}}]});let e=this.device.createShaderModule({label:`symbolic-text-shader`,code:ai});this.pipeline=this.device.createRenderPipeline({label:`symbolic-text-pipeline`,layout:this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),vertex:{module:e,entryPoint:`vs_main`,buffers:[{arrayStride:4,stepMode:`vertex`,attributes:[{shaderLocation:0,offset:0,format:`uint32`}]},{arrayStride:Mi,stepMode:`instance`,attributes:[{shaderLocation:1,offset:0,format:`float32x3`},{shaderLocation:2,offset:12,format:`float32x3`},{shaderLocation:3,offset:24,format:`float32x3`},{shaderLocation:4,offset:36,format:`float32x4`},{shaderLocation:5,offset:52,format:`float32x4`},{shaderLocation:6,offset:68,format:`float32x3`},{shaderLocation:7,offset:80,format:`float32`},{shaderLocation:8,offset:84,format:`float32`},{shaderLocation:9,offset:88,format:`float32x4`},{shaderLocation:10,offset:104,format:`float32`}]},{arrayStride:32,stepMode:`instance`,attributes:[{shaderLocation:11,offset:0,format:`float32x4`},{shaderLocation:12,offset:16,format:`float32x4`}]}]},fragment:{module:e,entryPoint:`fs_main`,targets:[{format:this.format,blend:{color:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}},writeMask:GPUColorWrite.ALL},{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`triangle-strip`,cullMode:`none`},depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`greater-equal`,depthBias:-4,depthBiasSlopeScale:-.5,depthBiasClamp:0},multisample:{count:this.sampleCount}});let t=new Uint32Array([0,1,2,3]);this.cornerBuffer=this.device.createBuffer({label:`symbolic-text-corner`,size:t.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.device.queue.writeBuffer(this.cornerBuffer,0,t),this.uniformBuffer=this.device.createBuffer({label:`symbolic-text-camera`,size:Ni,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.sampler=this.device.createSampler({label:`symbolic-text-sampler`,magFilter:`linear`,minFilter:`linear`,mipmapFilter:`linear`,addressModeU:`clamp-to-edge`,addressModeV:`clamp-to-edge`})}syncAtlasTexture(){this.uploadedAtlasVersion===this.atlas.getVersion()&&this.atlasTexture||(this.atlasTexture&&(this.atlasTexture.destroy(),this.atlasTexture=null,this.atlasView=null),this.atlasTexture=this.device.createTexture({label:`symbolic-text-atlas`,size:{width:this.atlas.atlasSize,height:this.atlas.atlasSize,depthOrArrayLayers:1},format:`rgba8unorm`,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT}),this.device.queue.copyExternalImageToTexture({source:this.atlas.canvas,flipY:!1},{texture:this.atlasTexture},{width:this.atlas.atlasSize,height:this.atlas.atlasSize}),this.atlasView=this.atlasTexture.createView(),this.uploadedAtlasVersion=this.atlas.getVersion(),this.bindGroup=null)}ensureBindGroup(){this.bindGroup||this.bindGroupLayout&&this.uniformBuffer&&this.atlasView&&this.sampler&&(this.bindGroup=this.device.createBindGroup({label:`symbolic-text-bg`,layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}},{binding:1,resource:this.atlasView},{binding:2,resource:this.sampler}]}))}upload(e){if(this.init(),this.instanceBuffer&&=(this.instanceBuffer.destroy(),null),this.rteDeltaBuffer&&=(this.rteDeltaBuffer.destroy(),null),this.instanceCount=0,this.rteDeltaData=null,this.instanceAnchors=[],e.length===0)return;let t=[];for(let n of e){let e=this.atlas.layoutString(n.content);if(e.glyphs.length===0)continue;let r=n.color??[.05,.05,.05,1],i=n.height,a=this.atlas.glyphPx,o=Math.hypot(n.dirX,n.dirZ)||1,s=n.dirX/o,c=n.dirZ/o,l=Oi(n.alignment),u=l.vertical*this.atlas.glyphPx,d=l.horizontal*e.totalAdvancePx,f=l.horizontal===-.5,p=l.vertical===-.5,m=e.totalAdvancePx;if(f&&e.glyphs.length>0){let t=e.glyphs[0],n=e.glyphs[e.glyphs.length-1],r=t.xOffsetPx;m=n.xOffsetPx+n.glyph.widthPx-r}for(let o of e.glyphs){let e=o.glyph,{qx0:l,qyBottom:h,widthAtlas:g,heightGlyphAtlas:_,uvBounds:v}=ti(e,f?o.xOffsetPx-m*.5:o.xOffsetPx+d,p?-e.heightPx*.5:-u-(e.heightPx-e.baselinePx),this.atlas.atlasSize),y=i/a,b=g*y,x=_*y,S=n.origin!==void 0,C=S?n.origin[0]+n.worldPos[0]:n.worldPos[0],w=S?n.origin[1]+n.worldPos[1]:n.worldPos[1],T=S?n.origin[2]+n.worldPos[2]:n.worldPos[2],E=S?s*l*y:C+s*l*y,D=S?h*y:w+h*y,O=S?c*l*y:T+c*l*y;t.push({origin:[E,D,O],rightAxis:[s*b,0,c*b],upAxis:[0,x,0],uvBounds:v,color:r,anchor:[C,w,T],capHeight:i,billboard:+!!n.billboard,glyphOffsetSize:[l*y,h*y,g*y,_*y],targetPxOverride:n.targetPx??0,rteAnchor:S?[C,w,T]:null})}}if(t.length===0)return;let n=ji,r=new Float32Array(t.length*n),i=0;for(let e of t)r[i+0]=e.origin[0],r[i+1]=e.origin[1],r[i+2]=e.origin[2],r[i+3]=e.rightAxis[0],r[i+4]=e.rightAxis[1],r[i+5]=e.rightAxis[2],r[i+6]=e.upAxis[0],r[i+7]=e.upAxis[1],r[i+8]=e.upAxis[2],r[i+9]=e.uvBounds[0],r[i+10]=e.uvBounds[1],r[i+11]=e.uvBounds[2],r[i+12]=e.uvBounds[3],r[i+13]=e.color[0],r[i+14]=e.color[1],r[i+15]=e.color[2],r[i+16]=e.color[3],r[i+17]=e.anchor[0],r[i+18]=e.anchor[1],r[i+19]=e.anchor[2],r[i+20]=e.capHeight,r[i+21]=e.billboard,r[i+22]=e.glyphOffsetSize[0],r[i+23]=e.glyphOffsetSize[1],r[i+24]=e.glyphOffsetSize[2],r[i+25]=e.glyphOffsetSize[3],r[i+26]=e.targetPxOverride,this.instanceAnchors.push(e.rteAnchor),i+=n;this.instanceBuffer=this.device.createBuffer({label:`symbolic-text-instances`,size:r.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.device.queue.writeBuffer(this.instanceBuffer,0,r),this.rteDeltaData=new Float32Array(t.length*8),this.rteDeltaBuffer=this.device.createBuffer({label:`symbolic-text-rte-deltas`,size:this.rteDeltaData.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.device.queue.writeBuffer(this.rteDeltaBuffer,0,this.rteDeltaData),this.instanceCount=t.length}updateRteInstanceDeltas(e){if(!this.rteDeltaBuffer||!this.rteDeltaData||this.instanceAnchors.length===0)return[{first:0,count:this.instanceCount}];let t=oi(this.instanceAnchors,e,this.rteDeltaData);return this.device.queue.writeBuffer(this.rteDeltaBuffer,0,this.rteDeltaData),t}hasGeometry(){return this.instanceCount>0}render(e,t,n,r,i,a,o=Pi,s,c){if(!this.pipeline||!this.uniformBuffer||!this.cornerBuffer||!this.instanceBuffer||!this.rteDeltaBuffer||this.instanceCount===0||(this.syncAtlasTexture(),this.ensureBindGroup(),!this.bindGroup))return;let l=new Float32Array(Ni/4);if(l.set(t,0),l.set(s??t,16),l[32]=n,l[33]=r,l[34]=o,l[35]=0,l[36]=i[0],l[37]=i[1],l[38]=i[2],l[39]=0,l[40]=a[0],l[41]=a[1],l[42]=a[2],l[43]=0,c)for(let e=0;e<3;e++){let t=Math.fround(c[e]);l[44+e]=t,l[48+e]=Math.fround(c[e]-t)}let u=this.updateRteInstanceDeltas(s&&c?c:void 0);this.device.queue.writeBuffer(this.uniformBuffer,0,l),e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.cornerBuffer),e.setVertexBuffer(1,this.instanceBuffer),e.setVertexBuffer(2,this.rteDeltaBuffer);for(let t of u)e.draw(4,t.count,0,t.first)}destroy(){this.instanceBuffer&&this.instanceBuffer.destroy(),this.rteDeltaBuffer&&this.rteDeltaBuffer.destroy(),this.cornerBuffer&&this.cornerBuffer.destroy(),this.uniformBuffer&&this.uniformBuffer.destroy(),this.atlasTexture&&this.atlasTexture.destroy(),this.instanceBuffer=null,this.rteDeltaBuffer=null,this.rteDeltaData=null,this.instanceAnchors=[],this.cornerBuffer=null,this.uniformBuffer=null,this.atlasTexture=null,this.atlasView=null,this.sampler=null,this.bindGroup=null,this.bindGroupLayout=null,this.pipeline=null,this.instanceCount=0,this.uploadedAtlasVersion=-1}},Li={solid:0,diagonal:1,crossHatch:2,horizontal:3,vertical:4,concrete:5,brick:6,insulation:7},Ri={fillColor:[.92,.88,.78,1],strokeColor:[.1,.1,.1,1],pattern:`diagonal`,spacingPx:8,angleRad:Math.PI/4,widthPx:1,secondaryAngleRad:-Math.PI/4};function zi(e,t,n,r,i){let a={module:n,entryPoint:`vs_main`,buffers:[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x4`}]}]},o={topology:`triangle-list`,cullMode:`none`},s={format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`greater-equal`},c={count:i},l={format:`rgba8unorm`,writeMask:0};return{fill:e.createRenderPipeline({layout:t,vertex:a,fragment:{module:n,entryPoint:`fs_main`,targets:[{format:r,blend:{color:{srcFactor:`src-alpha`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}}},l]},primitive:o,depthStencil:s,multisample:c}),depth:e.createRenderPipeline({layout:t,vertex:a,fragment:{module:n,entryPoint:`fs_main`,targets:[{format:r,writeMask:0},l]},primitive:o,depthStencil:{...s,depthWriteEnabled:!0},multisample:c})}}var Bi={viewProj:0,planeOffset:16,capFillColor:20,capStrokeColor:24,params:28,params2:32,lineColor:36,rteViewProj:40,originDeltaHigh:56,originDeltaLow:60},Vi={sectionCut:0,annotation:1,alignment:257,grid:513,dxf:769,terrain:1025,centreline:1281,clashBox:1537,extraCap:1793},Hi=1800;function Ui(e){let t=e.limits?.minUniformBufferOffsetAlignment??256,n=Number.isFinite(t)&&t>0?t:256;return Math.ceil(256/n)*n}var Wi=`
        ${L}
        struct Uniforms {
          viewProj:       mat4x4<f32>,
          planeOffset:    vec4<f32>,    // Small offset to render slightly in front of section plane
          capFillColor:   vec4<f32>,
          capStrokeColor: vec4<f32>,
          // x=patternId, y=spacingPx, z=angleRad, w=widthPx
          params:         vec4<f32>,
          // x=secondaryAngleRad, y,z,w reserved
          params2:        vec4<f32>,
          lineColor:       vec4<f32>,
          rteViewProj:     mat4x4<f32>,
          originDeltaHigh: vec4<f32>,
          originDeltaLow:  vec4<f32>,
        }
        @binding(0) @group(0) var<uniform> uniforms: Uniforms;
        // The cutting planes that remove this cap's fragments (#7545): every other plane,
        // in the frame clipPos is expressed in. Count 0 = nothing to clip against.
        @binding(0) @group(1) var<uniform> extraClip: ExtraClip;

        struct VertexInput {
          @location(0) position: vec3<f32>,
          @location(1) color:    vec4<f32>,
        }

        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0)       color:    vec4<f32>,
          @location(1)       clipPos:  vec3<f32>,
        }

        @vertex
        fn vs_main(input: VertexInput) -> VertexOutput {
          var output: VertexOutput;
          let offsetPos = input.position + uniforms.planeOffset.xyz;
          let global = uniforms.viewProj * vec4<f32>(offsetPos, 1.0);
          let relative = (offsetPos + uniforms.originDeltaHigh.xyz) + uniforms.originDeltaLow.xyz;
          output.position = select(global, uniforms.rteViewProj * vec4<f32>(relative, 1.0), uniforms.originDeltaHigh.w == 1.0);
          output.color = input.color;
          output.clipPos = relative;
          return output;
        }

        // Screen-space hatch pattern helpers (ported from section-cap.wgsl).
        fn lineMask(u: f32, s: f32, w: f32) -> f32 {
          let f = fract(u / s) * s;
          let d = min(f, s - f);
          return 1.0 - smoothstep(w * 0.5, w * 0.5 + 1.0, d);
        }
        fn rotate(p: vec2<f32>, a: f32) -> vec2<f32> {
          let c = cos(a);
          let s = sin(a);
          return vec2<f32>(c * p.x - s * p.y, s * p.x + c * p.y);
        }
        fn hatchIntensity(fragCoord: vec2<f32>, patternId: u32, spacing: f32, angle: f32, width: f32, angle2: f32) -> f32 {
          let p = fragCoord;
          if (patternId == 0u) { return 0.0; }          // solid
          if (patternId == 1u) {                         // diagonal
            let r = rotate(p, angle);
            return lineMask(r.x, spacing, width);
          }
          if (patternId == 2u) {                         // cross-hatch
            let r  = rotate(p, angle);
            let r2 = rotate(p, angle2);
            return max(lineMask(r.x, spacing, width), lineMask(r2.x, spacing, width));
          }
          if (patternId == 3u) { return lineMask(p.y, spacing, width); }    // horizontal
          if (patternId == 4u) { return lineMask(p.x, spacing, width); }    // vertical
          if (patternId == 5u) {
            // Concrete (ISO 128-50): clean regular dot grid. The previous
            // version layered dashes on top which looked noisy and broken.
            // Dots sit at every grid intersection; radius scales with
            // stroke width so the user's width slider works consistently.
            let gx = p.x - round(p.x / spacing) * spacing;
            let gy = p.y - round(p.y / spacing) * spacing;
            let d = sqrt(gx * gx + gy * gy);
            let radius = max(1.0, width * 1.2);
            return 1.0 - smoothstep(radius, radius + 1.0, d);
          }
          if (patternId == 6u) {                         // brick
            let bandH = spacing;
            let band = floor(p.y / bandH);
            // Signed parity. p is @builtin(position) today, so it is a
            // framebuffer coordinate and never negative — but u32() of a
            // negative float is an out-of-range conversion in WGSL, and the
            // moment this hatch is fed anything but fragCoord (a world- or
            // drawing-space variant) the running bond would break across
            // y = 0 in a backend-dependent way. i32(-1) & 1 is 1, so the
            // parity alternates correctly in both directions.
            let offset = select(0.0, bandH, (i32(band) & 1) == 1);
            let horiz = lineMask(p.y, bandH, width);
            let vertPos = p.x + offset * 0.5;
            let vert = step(fract(vertPos / (bandH * 2.0)), 0.02);
            return max(horiz, vert);
          }
          if (patternId == 7u) {                         // insulation
            let y = spacing * 0.5 * sin(p.x * 6.2831853 / spacing) + p.y;
            return lineMask(y, spacing, width);
          }
          return 0.0;
        }

        struct FragOut {
          @location(0) color:    vec4<f32>,
          @location(1) objectId: vec4<f32>,
        }

        @fragment
        fn fs_main(input: VertexOutput) -> FragOut {
          if (extraClipClipped(extraClip, input.clipPos)) { discard; }
          let patternId = u32(uniforms.params.x + 0.5);
          let spacing   = max(2.0, uniforms.params.y);
          let angle     = uniforms.params.z;
          let width     = max(1.0, uniforms.params.w);
          let angle2    = uniforms.params2.x;

          let h = hatchIntensity(input.position.xy, patternId, spacing, angle, width, angle2);
          // Per-polygon colour (a material-layer slab fills with its own
          // IfcMaterial RGBA) overrides the uniform cap fill when present.
          // Polygons without a colour carry the sentinel alpha -1 and fall back
          // to the user's cap style, byte-identically. Hatch + stroke apply over
          // whichever base is chosen, so the architectural hatch still works.
          let useVertex = input.color.a >= 0.0;
          let baseFill = select(uniforms.capFillColor, input.color, useVertex);
          let rgb = mix(baseFill.rgb, uniforms.capStrokeColor.rgb, h * uniforms.capStrokeColor.a);
          let a   = max(baseFill.a, h * uniforms.capStrokeColor.a);

          var out: FragOut;
          out.color    = vec4<f32>(rgb, a);
          out.objectId = vec4<f32>(0.0, 0.0, 0.0, 0.0);
          return out;
        }
      `;function Gi(e){return`
        // Mirrors the fill shader's uniform layout so both pipelines can share
        // one buffer; the line shader only reads viewProj, planeOffset and the
        // appended lineColor (byte offset 144). capFillColor/… are unused here but
        // declared for correct field offsets.
        struct Uniforms {
          viewProj: mat4x4<f32>,
          planeOffset: vec4<f32>,
          capFillColor: vec4<f32>,
          capStrokeColor: vec4<f32>,
          params: vec4<f32>,
          params2: vec4<f32>,
          lineColor: vec4<f32>,
          rteViewProj: mat4x4<f32>,
          originDeltaHigh: vec4<f32>,
          originDeltaLow: vec4<f32>,
        }
        @binding(0) @group(0) var<uniform> uniforms: Uniforms;
        ${e?`${L}
        @binding(0) @group(1) var<uniform> extraClip: ExtraClip;`:``}
        ${Ae}

        struct VertexInput {
          @location(0) position: vec3<f32>,
        }

        struct VertexOutput {
          @builtin(position) position: vec4<f32>,${e?`
          @location(0) clipPos: vec3<f32>,`:``}
        }

        @vertex
        fn vs_main(input: VertexInput) -> VertexOutput {
          var output: VertexOutput;
          let offsetPos = input.position + uniforms.planeOffset.xyz;
          let global = uniforms.viewProj * vec4<f32>(offsetPos, 1.0);
          let relative = (offsetPos + uniforms.originDeltaHigh.xyz) + uniforms.originDeltaLow.xyz;
          let clip = select(global, uniforms.rteViewProj * vec4<f32>(relative, 1.0), uniforms.originDeltaHigh.w == 1.0);
          // Reverse-Z decal lift for lines coplanar with model faces
          // (issue #812). WebGPU forbids depthStencil.depthBias on non-
          // triangle topologies, so we do the equivalent in clip space —
          // enough to beat MSAA jitter and the mesh depth nudge on annotation
          // lines that ride exactly on a wall/floor.
          output.position = vec4<f32>(clip.x, clip.y, overlayLiftedClipZ(clip, uniforms.viewProj), clip.w);${e?`
          output.clipPos = relative;`:``}
          return output;
        }

        struct FragOutLine {
          @location(0) color:    vec4<f32>,
          @location(1) objectId: vec4<f32>,
        }

        @fragment
        fn fs_main(input: VertexOutput) -> FragOutLine {
          ${e?`if (extraClipClipped(extraClip, input.clipPos)) { discard; }`:``}
          var out: FragOutLine;
          out.color    = uniforms.lineColor;  // consumer-themeable (defaults black)
          out.objectId = vec4<f32>(0.0, 0.0, 0.0, 0.0);
          return out;
        }
      `}var Ki=Gi(!1),qi=Gi(!0);function Ji(e,t,n,r,i=!1,a){if(a){let n=a.origin,r=a.tangent,i=a.bitangent;return[n[0]+r[0]*e+i[0]*t,n[1]+r[1]*e+i[1]*t,n[2]+r[2]*e+i[2]*t]}let o=i?-e:e;switch(n){case`down`:return[o,r,t];case`front`:return[o,t,r];case`side`:return[r,t,o]}}function Yi(e,t,n=!1,r){return(i,a)=>Ji(i,a,e,t,n,r)}function Xi(e,t,n){let r=[],i=[],a=0;for(let o of e){let e=o.polygon.outer;if(e.length<3)continue;let s=o.color??[0,0,0,-1],{points:c,triangles:l}=Di([e.map(e=>({x:e.x,z:e.y})),...o.polygon.holes.filter(e=>e.length>=3).map(e=>e.map(e=>({x:e.x,z:e.y})))]);if(l.length===0)continue;let u=a;for(let e of c){let[i,o,c]=t(e.x,e.z);r.push(n?i-n[0]:i,n?o-n[1]:o,n?c-n[2]:c,s[0],s[1],s[2],s[3]),a++}for(let[e,t,n]of l)i.push(u+e,u+t,u+n)}return r.length===0?null:{vertices:new Float32Array(r),indices:new Uint32Array(i)}}function Zi(e,t,n,r){let i=[];for(let t of e){let e=t.polygon.outer;for(let t=0;t<e.length;t++){let a=e[t],o=e[(t+1)%e.length],[s,c,l]=n(a.x,a.y),[u,d,f]=n(o.x,o.y);i.push(r?s-r[0]:s,r?c-r[1]:c,r?l-r[2]:l,r?u-r[0]:u,r?d-r[1]:d,r?f-r[2]:f)}for(let e of t.polygon.holes)for(let t=0;t<e.length;t++){let a=e[t],o=e[(t+1)%e.length],[s,c,l]=n(a.x,a.y),[u,d,f]=n(o.x,o.y);i.push(r?s-r[0]:s,r?c-r[1]:c,r?l-r[2]:l,r?u-r[0]:u,r?d-r[1]:d,r?f-r[2]:f)}}for(let e of t){let[t,a,o]=n(e.line.start.x,e.line.start.y),[s,c,l]=n(e.line.end.x,e.line.end.y);i.push(r?t-r[0]:t,r?a-r[1]:a,r?o-r[2]:o,r?s-r[0]:s,r?c-r[1]:c,r?l-r[2]:l)}return i.length===0?null:new Float32Array(i)}var Qi=class{fillVertexBuffer=null;fillIndexBuffer=null;fillIndexCount=0;lineVertexBuffer=null;lineVertexCount=0;anchor=null;has(){return this.fillIndexCount>0||this.lineVertexCount>0}clear(){this.fillVertexBuffer?.destroy(),this.fillIndexBuffer?.destroy(),this.lineVertexBuffer?.destroy(),this.fillVertexBuffer=null,this.fillIndexBuffer=null,this.lineVertexBuffer=null,this.fillIndexCount=0,this.lineVertexCount=0,this.anchor=null}upload(e,t,n,r,i,a,o){this.clear();let s=Yi(r,i,a,o),c=o?[...o.origin]:r===`side`?[i,0,0]:r===`down`?[0,i,0]:[0,0,i],l=t.find(e=>e.polygon.outer.length>0)?.polygon.outer[0]??n[0]?.line.start,u=l?s(l.x,l.y):c,d=Xi(t,s,u);d&&(this.fillVertexBuffer=e.createBuffer({size:d.vertices.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.fillVertexBuffer,0,d.vertices),this.fillIndexBuffer=e.createBuffer({size:d.indices.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.fillIndexBuffer,0,d.indices),this.fillIndexCount=d.indices.length);let f=Zi(t,n,s,u);f&&(this.lineVertexBuffer=e.createBuffer({size:f.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),e.queue.writeBuffer(this.lineVertexBuffer,0,f),this.lineVertexCount=f.length/3),this.anchor=u}},$i=class{primary=new Qi;extras=new Map;uniforms=new Float32Array(64);clipScratch=new Float32Array(32);has(){return this.primary.has()}hasExtras(){for(let e of this.extras.values())if(e.has())return!0;return!1}extraKeys(){return[...this.extras.keys()]}upload(e,t,...n){if(t===null){this.primary.upload(e,...n);return}if(!this.extras.has(t)&&this.extras.size>=7)return;let r=this.extras.get(t);r||(r=new Qi,this.extras.set(t,r)),r.upload(e,...n)}clear(e){e===null?this.primary.clear():(this.extras.get(e)?.clear(),this.extras.delete(e))}clearExtrasExcept(e){for(let t of[...this.extras.keys()])e.has(t)||this.clear(t)}dispose(){this.primary.clear();for(let e of this.extras.values())e.clear();this.extras.clear()}draw(e,t,n,r){this.drawOne(e,t,n,this.primary,Vi.sectionCut,0,r)}drawExtras(e,t,n,r){let i=this.extraKeys();for(let a of r){let r=this.extras.get(a.key);if(!r?.has())continue;let o=i.indexOf(a.key);this.drawOne(e,t,n,r,Vi.extraCap+o,1+o,a.clippedBy)}}drawOne(e,t,n,r,i,a,o){if(!r.has())return;let{viewProj:s}=n,c=r.anchor,l=n.rteViewProj,u=n.rteCamera,d=c!==null&&l!==void 0&&u!==void 0,f=c===null||d?[0,0,0]:c,p=Bi,m=this.uniforms;if(m.fill(0),m.set(s,p.viewProj),d){if(m.set(l,p.rteViewProj),!E(c,u,m,p.originDeltaHigh))return;m[p.originDeltaHigh+3]=1}m.set(t.lineColor,p.lineColor),m[p.planeOffset+0]=f[0],m[p.planeOffset+1]=f[1],m[p.planeOffset+2]=f[2];let h=n.capStyle;h?(m.set(h.fillColor,p.capFillColor),m.set(h.strokeColor,p.capStrokeColor),m[p.params+0]=h.patternId,m[p.params+1]=h.spacingPx,m[p.params+2]=h.angleRad,m[p.params+3]=h.widthPx,m[p.params2+0]=h.secondaryAngleRad):(m.set([.92,.88,.78,1],p.capFillColor),m.set([.1,.1,.1,1],p.capStrokeColor),m[p.params+0]=0,m[p.params+1]=8,m[p.params+2]=Math.PI/4,m[p.params+3]=1,m[p.params2+0]=-Math.PI/4),te(o,d?u:null,this.clipScratch,0);let g=a*t.clipStride;t.device.queue.writeBuffer(t.clipBuffer,g,this.clipScratch);let _=i*t.uniformStride;t.device.queue.writeBuffer(t.uniformBuffer,_,m),n.showFills===!0&&n.capStyle&&r.fillVertexBuffer&&r.fillIndexBuffer&&r.fillIndexCount>0&&(e.setPipeline(t.fillPipeline),e.setBindGroup(0,t.bindGroup,[_]),e.setBindGroup(1,t.clipBindGroup,[g]),e.setVertexBuffer(0,r.fillVertexBuffer),e.setIndexBuffer(r.fillIndexBuffer,`uint32`),e.drawIndexed(r.fillIndexCount),e.setPipeline(t.fillDepthPipeline),e.drawIndexed(r.fillIndexCount)),n.showOutlines!==!1&&r.lineVertexBuffer&&r.lineVertexCount>0&&(e.setPipeline(t.outlinePipeline),e.setBindGroup(0,t.bindGroup,[_]),e.setBindGroup(1,t.clipBindGroup,[g]),e.setVertexBuffer(0,r.lineVertexBuffer),e.draw(r.lineVertexCount))}};function ea(e){return e instanceof Float32Array?e.length:`localVertices`in e?e.localVertices.length:e.reduce((e,t)=>e+t.localVertices.length,0)}let ta,na,ra,ia;ta=6;na=class{uniformSlot;partitions=[];constructor(e){this.uniformSlot=e}upload(e,t){this.clear();let n=t instanceof Float32Array?[{localVertices:t,origin:null}]:Array.isArray(t)?t:[t];if(n.length>256)throw RangeError(`RTE line overlay has ${n.length} anchors; at most 256 partitions fit in one render pass.`);for(let t of n){let n=t.origin,r=t.localVertices;if(n){for(let e=0;e<3;e++)C(n[e]);for(let e=0;e<r.length;e++){let t=r[e];if(!Number.isFinite(t)||Math.abs(t)>8192)throw RangeError(`RTE local line coordinate ${t} exceeds the \xb1${S} m precision envelope; partition the line overlay into smaller anchored batches.`)}}let i=Math.floor(r.length/ta)*ta;if(i===0)continue;let a=i===r.length?r:r.subarray(0,i),o=e.createBuffer({size:a.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});try{e.queue.writeBuffer(o,0,a),this.partitions.push({buffer:o,count:i/3,anchor:n})}catch(e){throw o.destroy(),e}}}clear(){for(let e of this.partitions)e.buffer.destroy();this.partitions=[]}has(){return this.partitions.length>0}get vertexCount(){return this.partitions.reduce((e,t)=>e+t.count,0)}draw(e,t,n,r,i,a){for(let o=0;o<this.partitions.length;o++){let s=this.partitions[o],c=(this.uniformSlot+o)*t.uniformStride,l=new Float32Array(64);if(l.set(n,Bi.viewProj),s.anchor&&i&&a){if(l.set(i,Bi.rteViewProj),!E(s.anchor,a,l,Bi.originDeltaHigh))continue;l[Bi.originDeltaHigh+3]=1}l.set(r,Bi.lineColor),t.device.queue.writeBuffer(t.uniformBuffer,c,l),e.setPipeline(t.pipeline),e.setBindGroup(0,t.bindGroup,[c]),e.setVertexBuffer(0,s.buffer),e.draw(s.count)}}};ra=[`annotation`,`alignment`,`grid`,`dxf`,`terrain`,`centreline`];ia=class{device;fillPipeline=null;fillDepthPipeline=null;linePipeline=null;centrelinePipeline=null;linePipelineDescriptor=null;bindGroupLayout=null;uniformBuffer=null;bindGroup=null;capLinePipeline=null;clipBindGroup=null;clipBuffer=null;clipStride=0;uniformStride=0;format;sampleCount;initialized=!1;overlayLineColor=[0,0,0,1];caps=new $i;lineOverlays={annotation:new na(Vi.annotation),alignment:new na(Vi.alignment),grid:new na(Vi.grid),dxf:new na(Vi.dxf),terrain:new na(Vi.terrain),centreline:new na(Vi.centreline)};clashBoxLines=new na(Vi.clashBox);clashBoxLineColor=[1,0,1,1];constructor(e,t,n=4){this.device=e,this.format=t,this.sampleCount=n}init(){if(this.initialized)return;this.bindGroupLayout=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{type:`uniform`,hasDynamicOffset:!0,minBindingSize:256}}]});let e=this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),t=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`,hasDynamicOffset:!0,minBindingSize:P}}]}),n=this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout,t]}),r=this.device.createShaderModule({code:Wi}),i=this.device.createShaderModule({code:Ki}),a=zi(this.device,n,r,this.format,this.sampleCount);this.fillPipeline=a.fill,this.fillDepthPipeline=a.depth,this.linePipelineDescriptor={layout:e,vertex:{module:i,entryPoint:`vs_main`,buffers:[{arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:`float32x3`}]}]},fragment:{module:i,entryPoint:`fs_main`,targets:[{format:this.format},{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`line-list`,cullMode:`none`},depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`greater-equal`},multisample:{count:this.sampleCount}},this.linePipeline=this.device.createRenderPipeline(this.linePipelineDescriptor);let o=this.device.createShaderModule({code:qi});this.capLinePipeline=this.device.createRenderPipeline({...this.linePipelineDescriptor,layout:n,vertex:{...this.linePipelineDescriptor.vertex,module:o},fragment:{...this.linePipelineDescriptor.fragment,module:o}}),this.uniformStride=Ui(this.device),this.uniformBuffer=this.device.createBuffer({size:this.uniformStride*Hi,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroup=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer,offset:0,size:256}}]});let s=this.device.limits?.minUniformBufferOffsetAlignment??256;this.clipStride=Math.ceil(P/(Number.isFinite(s)&&s>0?s:256))*(Number.isFinite(s)&&s>0?s:256),this.clipBuffer=this.device.createBuffer({size:this.clipStride*8,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.clipBindGroup=this.device.createBindGroup({layout:t,entries:[{binding:0,resource:{buffer:this.clipBuffer,offset:0,size:P}}]}),this.initialized=!0}capResources(){return!this.fillPipeline||!this.fillDepthPipeline||!this.capLinePipeline||!this.uniformBuffer||!this.bindGroup||!this.clipBindGroup||!this.clipBuffer?null:{device:this.device,fillPipeline:this.fillPipeline,fillDepthPipeline:this.fillDepthPipeline,outlinePipeline:this.capLinePipeline,bindGroup:this.bindGroup,uniformBuffer:this.uniformBuffer,uniformStride:this.uniformStride,clipBindGroup:this.clipBindGroup,clipBuffer:this.clipBuffer,clipStride:this.clipStride,lineColor:this.overlayLineColor}}lineResources(e=this.linePipeline){return!e||!this.uniformBuffer||!this.bindGroup?null:{device:this.device,pipeline:e,bindGroup:this.bindGroup,uniformBuffer:this.uniformBuffer,uniformStride:this.uniformStride}}uploadDrawing(e,t,n,r,i=!1,a){this.init(),this.caps.upload(this.device,null,e,t,n,r,i,a)}uploadExtraDrawing(e,t,n,r,i,a=!1,o){this.init(),this.caps.upload(this.device,e,t,n,r,i,a,o)}clearExtraGeometry(e=new Set){this.caps.clearExtrasExcept(e)}extraGeometryKeys(){return this.caps.extraKeys()}clearGeometry(){this.caps.clear(null)}setOverlayLineColor(e){this.overlayLineColor=e}setLineOverlay(e,t){t===null?this.lineOverlays[e].clear():(this.init(),this.lineOverlays[e].upload(this.device,t))}hasLineOverlay(e){return this.lineOverlays[e].has()}drawLineOverlay(e,t,n,r,i){this.init(),n===`centreline`&&this.lineOverlays.centreline.has()&&!this.centrelinePipeline&&this.linePipelineDescriptor&&(this.centrelinePipeline=this.device.createRenderPipeline({...this.linePipelineDescriptor,depthStencil:{...this.linePipelineDescriptor.depthStencil,depthCompare:`always`}}));let a=this.lineResources(n===`centreline`?this.centrelinePipeline:this.linePipeline);a&&this.lineOverlays[n].draw(e,a,t,this.overlayLineColor,r,i)}setClashBoxLineColor(e){this.clashBoxLineColor=e}uploadClashBoxLines3D(e){this.init(),this.clashBoxLines.upload(this.device,e)}clearClashBoxLines3D(){this.clashBoxLines.clear()}hasClashBoxLines3D(){return this.clashBoxLines.has()}drawClashBoxLines3D(e,t,n,r){this.init();let i=this.lineResources();i&&this.clashBoxLines.draw(e,i,t,this.clashBoxLineColor,n,r)}hasGeometry(){return this.caps.has()}hasExtraGeometry(){return this.caps.hasExtras()}draw(e,t,n=[]){this.init();let r=this.capResources();r&&this.caps.has()&&this.caps.draw(e,r,t,n)}drawExtras(e,t,n){this.init();let r=this.capResources();r&&this.caps.hasExtras()&&this.caps.drawExtras(e,r,t,n)}dispose(){this.caps.dispose();for(let e of ra)this.lineOverlays[e].clear();this.clearClashBoxLines3D(),this.uniformBuffer&&=(this.uniformBuffer.destroy(),null),this.clipBuffer&&=(this.clipBuffer.destroy(),null),this.clipBindGroup=null,this.capLinePipeline=null,this.fillPipeline=null,this.fillDepthPipeline=null,this.linePipeline=null,this.centrelinePipeline=null,this.linePipelineDescriptor=null,this.bindGroupLayout=null,this.bindGroup=null,this.uniformStride=0,this.initialized=!1}};aa=class{epsilon=1e-7;raycast(e,t,n){let r=null,i=1/0;for(let a=0;a<t.length;a++){let o=t[a],s=this.raycastMesh(e,o,a,n);s&&s.distance<i&&(i=s.distance,r=s)}return r}raycastMesh(e,t,n,r){let i=t.positions,a=t.indices;if(!a||a.length===0||!i||i.length===0)return null;let o=t.origin,s=o?{origin:{x:e.origin.x-o[0],y:e.origin.y-o[1],z:e.origin.z-o[2]},direction:e.direction}:e;if(a.length%3!=0)return console.warn(`Invalid index count for mesh ${t.expressId}: ${a.length}`),null;let c=null,l=1/0;for(let e=0;e<a.length;e+=3){let u=a[e],d=a[e+1],f=a[e+2],p=i.length/3-1;if(u>p||d>p||f>p)continue;let m=u*3,h=d*3,g=f*3,_={x:i[m],y:i[m+1],z:i[m+2]},v={x:i[h],y:i[h+1],z:i[h+2]},y={x:i[g],y:i[g+1],z:i[g+2]};if(!isFinite(_.x)||!isFinite(_.y)||!isFinite(_.z)||!isFinite(v.x)||!isFinite(v.y)||!isFinite(v.z)||!isFinite(y.x)||!isFinite(y.y)||!isFinite(y.z))continue;let b=this.intersectTriangle(s,_,v,y);if(b&&b.distance<l){let i=this.calculateTriangleNormal(_,v,y),a=o?{x:b.point.x+o[0],y:b.point.y+o[1],z:b.point.z+o[2]}:b.point,s=mr(t,t.expressId),u=s===void 0?void 0:Vn(t,e/3),d={point:a,normal:i,distance:b.distance,meshIndex:n,triangleIndex:e/3,expressId:t.expressId,modelIndex:t.modelIndex??0,...s===void 0?{}:{geometryItemId:s},...u===void 0?{}:{sourceTriangleIndex:u},barycentricCoord:b.barycentricCoord};(!r||r(d,t))&&(l=b.distance,c=d)}}return c}intersectTriangle(e,t,n,r){let i=this.subtract(n,t),a=this.subtract(r,t),o=this.cross(e.direction,a),s=this.dot(i,o);if(Math.abs(s)<this.epsilon)return null;let c=1/s,l=this.subtract(e.origin,t),u=c*this.dot(l,o);if(u<0||u>1)return null;let d=this.cross(l,i),f=c*this.dot(e.direction,d);if(f<0||u+f>1)return null;let p=c*this.dot(a,d);return p<this.epsilon?null:{point:{x:e.origin.x+e.direction.x*p,y:e.origin.y+e.direction.y*p,z:e.origin.z+e.direction.z*p},distance:p,barycentricCoord:{u,v:f,w:1-u-f}}}calculateTriangleNormal(e,t,n){let r=this.subtract(t,e),i=this.subtract(n,e),a=this.cross(r,i);return this.normalize(a)}subtract(e,t){return{x:e.x-t.x,y:e.y-t.y,z:e.z-t.z}}cross(e,t){return{x:e.y*t.z-e.z*t.y,y:e.z*t.x-e.x*t.z,z:e.x*t.y-e.y*t.x}}dot(e,t){return e.x*t.x+e.y*t.y+e.z*t.z}normalize(e){let t=Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z);return t===0?{x:0,y:0,z:1}:{x:e.x/t,y:e.y/t,z:e.z/t}}length(e){return Math.sqrt(e.x*e.x+e.y*e.y+e.z*e.z)}closestPointOnSegment(e,t,n){let r=this.subtract(n,t),i=this.subtract(e,t),a=Math.max(0,Math.min(1,this.dot(i,r)/this.dot(r,r)));return{x:t.x+r.x*a,y:t.y+r.y*a,z:t.z+r.z*a}}distance(e,t){return this.length(this.subtract(e,t))}};function oa(e,t){let n=e.x-t.x,r=e.y-t.y,i=e.z-t.z;return Math.sqrt(n*n+r*r+i*i)}function sa(e,t,n=1e-4){return Math.abs(e.x-t.x)<n&&Math.abs(e.y-t.y)<n&&Math.abs(e.z-t.z)<n}function ca(e,t,n){let r=n.x-t.x,i=n.y-t.y,a=n.z-t.z,o=r*r+i*i+a*a;if(o<1e-7)return{point:t,distance:oa(e,t),t:0};let s=Math.max(0,Math.min(1,((e.x-t.x)*r+(e.y-t.y)*i+(e.z-t.z)*a)/o)),c={x:t.x+r*s,y:t.y+i*s,z:t.z+a*s};return{point:c,distance:oa(e,c),t:s}}function la(e,t,n,r){let i=2*t*Math.tan(n/2);return e/r*i}var ua=1/4194304,da=1/65536;function fa(e){let t=0;for(let n=0;n<e.length;n++){let r=Math.abs(e[n]);isFinite(r)&&r>t&&(t=r)}return Math.max(da,t*ua)}function pa(e,t,n,r,i){let a=Math.floor(e.length/3),o=new Int32Array(a).fill(-1),s=[],c=new Float64Array(a),l=new Float64Array(a),u=new Float64Array(a),d=[];for(let i=0;i<a;i++){let a=e[i*3]+t,o=e[i*3+1]+n,s=e[i*3+2]+r;isFinite(a)&&isFinite(o)&&isFinite(s)&&(c[i]=a,l[i]=o,u[i]=s,d.push(i))}d.sort((e,t)=>c[e]-c[t]||l[e]-l[t]||u[e]-u[t]);let f=2*i,p=i*i,m=new Map;for(let e of d){let t=c[e],n=l[e],r=u[e],a=Math.floor((t-i)/f),d=Math.floor((t+i)/f),h=Math.floor((n-i)/f),g=Math.floor((n+i)/f),_=Math.floor((r-i)/f),v=Math.floor((r+i)/f),y=-1,b=1/0;for(let e=a;e<=d;e++)for(let i=h;i<=g;i++)for(let a=_;a<=v;a++){let o=m.get(`${e}_${i}_${a}`);if(o)for(let e of o){let i=s[e],a=i.x-t,o=i.y-n,c=i.z-r,l=a*a+o*o+c*c;l>p||(l<b||l===b&&e<y)&&(y=e,b=l)}}if(y>=0){o[e]=y;continue}let x=s.length;s.push({x:t,y:n,z:r}),o[e]=x;let S=`${Math.floor(t/f)}_${Math.floor(n/f)}_${Math.floor(r/f)}`,C=m.get(S);C?C.push(x):m.set(S,[x])}return{ids:o,points:s}}function ma(e,t){return e.x===t.x?e.y===t.y?e.z===t.z?0:e.z<t.z?-1:1:e.y<t.y?-1:1:e.x<t.x?-1:1}function ha(e,t,n){let r=e.x-t.x,i=e.y-t.y,a=e.z-t.z,o=r*n.x+i*n.y+a*n.z,s=r-o*n.x,c=i-o*n.y,l=a-o*n.z;return Math.sqrt(s*s+c*c+l*l)}function ga(e,t,n){let r=new Map,i=(e,t)=>{let n=r.get(e);n?n.push(t):r.set(e,[t])};for(let t of e)i(t.a,t.b),i(t.b,t.a);let a=new Map;for(let[e,i]of r){let r=t[e],o=[];for(let e of i){let i=t[e],a=i.x-r.x,s=i.y-r.y,c=i.z-r.z,l=Math.sqrt(a*a+s*s+c*c);if(l<=n)continue;let u={x:a/l,y:s/l,z:c/l},d=!1;for(let e of o){let t=u.y*e.dir.z-u.z*e.dir.y,r=u.z*e.dir.x-u.x*e.dir.z,i=u.x*e.dir.y-u.y*e.dir.x;if(Math.sqrt(t*t+r*r+i*i)*Math.min(l,e.len)<=n){d=!0;break}}d||o.push({dir:u,len:l})}a.set(e,o.length)}return a}function _a(e,t,n){let r=e.filter(e=>e.a!==e.b&&t[e.a]!==void 0&&t[e.b]!==void 0).map(e=>ma(t[e.a],t[e.b])<=0?{a:e.a,b:e.b}:{a:e.b,b:e.a});r.sort((e,n)=>{let r=ma(t[e.a],t[n.a]);return r===0?ma(t[e.b],t[n.b]):r});let i=ga(r,t,n),a=new Map;r.forEach((e,t)=>{for(let n of[e.a,e.b]){let e=a.get(n);e?e.push(t):a.set(n,[t])}});let o=new Uint8Array(r.length),s=[];for(let e=0;e<r.length;e++){if(o[e])continue;let c=t[r[e].a],l=t[r[e].b],u=l.x-c.x,d=l.y-c.y,f=l.z-c.z,p=Math.sqrt(u*u+d*d+f*f);if(p<=n){o[e]=1;continue}let m={x:u/p,y:d/p,z:f/p};o[e]=1;let h=[e],g=[e];for(;g.length>0;){let e=g.pop();for(let i of[r[e].a,r[e].b])for(let e of a.get(i)??[])o[e]||ha(t[r[e].a],c,m)>n||ha(t[r[e].b],c,m)>n||(o[e]=1,h.push(e),g.push(e))}let _=e=>{let n=t[e];return(n.x-c.x)*m.x+(n.y-c.y)*m.y+(n.z-c.z)*m.z},v=[],y=new Map;for(let e of h){let{a:t,b:n}=r[e],i=_(t),a=_(n);y.set(t,i),y.set(n,a),v.push(i<=a?{t0:i,t1:a,v0:t,v1:n}:{t0:a,t1:i,v0:n,v1:t})}v.sort((e,t)=>e.t0-t.t0||e.t1-t.t1);let b=[],x=v[0];for(let e=1;e<v.length;e++){let t=v[e];t.t0<=x.t1+n?t.t1>x.t1&&(x={t0:x.t0,t1:t.t1,v0:x.v0,v1:t.v1}):(b.push(x),x=t)}b.push(x);for(let e of b){let r=t[e.v0],a=t[e.v1],o=i.get(e.v0)??0,c=i.get(e.v1)??0,l=ma(r,a)>0;l&&([r,a]=[a,r],[o,c]=[c,o]);let u=e.t1-e.t0,d=[];for(let[r,a]of y){if(a<=e.t0+n||a>=e.t1-n)continue;let o=i.get(r)??0;if(o<2)continue;let s=u>0?(a-e.t0)/u:0;d.push({point:t[r],valence:o,t:l?1-s:s})}d.sort((e,t)=>e.t-t.t);let f=a.x-r.x,p=a.y-r.y,m=a.z-r.z;s.push({v0:r,v1:a,index:s.length,length:Math.sqrt(f*f+p*p+m*m),v0Valence:o,v1Valence:c,junctions:d})}}return s}var va=1-1e-6,ya={vertices:[],edges:[]};function ba(e){let t=e.positions;if(!t||t.length===0)return{...ya};let n=e.origin?e.origin[0]:0,r=e.origin?e.origin[1]:0,i=e.origin?e.origin[2]:0,a=fa(t),{ids:o,points:s}=pa(t,n,r,i,a),c=e.indices;if(!c)return{vertices:s,edges:[]};let l=new Map;for(let e=0;e<c.length;e+=3){let n=Sa(t,c,e);if(!n)continue;let r=o[c[e]],i=o[c[e+1]],a=o[c[e+2]];if(!(r<0||i<0||a<0)&&r!==i&&i!==a&&a!==r)for(let[e,t]of[[r,i],[i,a],[a,r]]){let r=e<t?`${e}_${t}`:`${t}_${e}`,i=l.get(r);i?i.normals.push(n):l.set(r,{segment:{a:e,b:t},normals:[n]})}}let u=[];for(let[,e]of l)xa(e.normals)&&u.push(e.segment);return{vertices:s,edges:_a(u,s,a)}}function xa(e){if(e.length!==2)return!0;let[t,n]=e;return Math.abs(t.x*n.x+t.y*n.y+t.z*n.z)<=va}function Sa(e,t,n){let r=t[n]*3,i=t[n+1]*3,a=t[n+2]*3,o=e[i]-e[r],s=e[i+1]-e[r+1],c=e[i+2]-e[r+2],l=e[a]-e[r],u=e[a+1]-e[r+1],d=e[a+2]-e[r+2],f=s*d-c*u,p=c*l-o*d,m=o*u-s*l,h=Math.sqrt(f*f+p*p+m*m);return!(h>0)||!isFinite(h)?null:{x:f/h,y:p/h,z:m/h}}var Ca=.08;function wa(e,t,n,r){let i=[];t<Ca&&i.push({vertex:e.v0,valence:e.v0Valence,atEndpoint:!0}),t>.92&&i.push({vertex:e.v1,valence:e.v1Valence,atEndpoint:!0});for(let n of e.junctions)Math.abs(t-n.t)<Ca&&i.push({vertex:n.point,valence:n.valence,atEndpoint:!1});let a=null,o=1/0,s=null,c=1/0;for(let e of i){let t=oa(r,e.vertex);t<c&&(s=e,c=t),e.valence>=2&&t<o&&(a=e,o=t)}return a||(a=s,o=c),a?{isCorner:o<n&&a.valence>=2,valence:a.valence,vertex:a.vertex,atEndpoint:a.atEndpoint}:{isCorner:!1,valence:0,vertex:null,atEndpoint:!1}}function Ta(e,t){if(e.distance!==t.distance)return e.distance-t.distance;let n=e.t>0&&e.t<1;if(n!==(t.t>0&&t.t<1))return n?-1:1;if(e.edge.length!==t.edge.length)return t.edge.length-e.edge.length;let r=ma(e.edge.v0,t.edge.v0);return r===0?ma(e.edge.v1,t.edge.v1):r}function Ea(e){let t=null;for(let n of e)(t===null||Ta(n,t)<0)&&(t=n);return t}let Oa,ka,Aa;Da=function(e){return e.VERTEX=`vertex`,e.EDGE=`edge`,e.FACE=`face`,e.FACE_CENTER=`face_center`,e.POINT_CLOUD=`point_cloud`,e}({});Oa={EDGE_ATTRACTION_MULTIPLIER:3,CORNER_ATTRACTION_MULTIPLIER:2,CORNER_CONFIDENCE_BOOST:.15,EDGE_ESCAPE_MULTIPLIER:2.5,CORNER_ESCAPE_MULTIPLIER:3.5,LOCK_STRENGTH_GROWTH:.05,MAX_LOCK_STRENGTH:1.5};ka=class{raycaster=new aa;defaultOptions={snapToVertices:!0,snapToEdges:!0,snapToFaces:!0,snapRadius:.1,screenSnapRadius:20};geometryCache=new Map;detectSnapTarget(e,t,n,r,i,a={},o){let s={...this.defaultOptions,...a};if(!n)return null;let c=[],l=oa(r.position,n.point),u=la(s.screenSnapRadius,l,r.fov,i),d=t[n.meshIndex];return d&&(s.snapToVertices&&c.push(...this.findVertices(d,n.point,u)),s.snapToEdges&&c.push(...this.findEdges(d,n.point,u)),s.snapToFaces&&c.push(...this.findFaces(d,n,u))),this.getBestSnapTarget(o?c.filter(o):c)}detectMagneticSnap(e,t,n,r,i,a,o={}){let s={...this.defaultOptions,...o};if(!n)return{snapTarget:null,edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}};let c=oa(r.position,n.point),l=la(s.screenSnapRadius,c,r.fov,i),u=t[n.meshIndex];if(!u)return{snapTarget:null,edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}};let d=this.getGeometryCache(u);if(!s.snapToEdges){let e=[];return s.snapToFaces&&e.push(...this.findFaces(u,n,l)),s.snapToVertices&&e.push(...this.findVertices(u,n.point,l)),{snapTarget:this.getBestSnapTarget(e),edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}}}let f=!1;if(a.edge&&a.meshExpressId===u.expressId){let e=this.maintainEdgeLock(n.point,a,d,l,u.expressId);if(!e.edgeLock.shouldRelease)return e;f=!0}let p=l*Oa.EDGE_ATTRACTION_MULTIPLIER,m=p*Oa.CORNER_ATTRACTION_MULTIPLIER,h={x:n.point.x-r.position.x,y:n.point.y-r.position.y,z:n.point.z-r.position.z},g=Math.sqrt(h.x*h.x+h.y*h.y+h.z*h.z);g>0&&(h.x/=g,h.y/=g,h.z/=g);let _=[];for(let e of d.edges){let t=ca(n.point,e.v0,e.v1);if(t.distance<p){let r={x:t.point.x-n.point.x,y:t.point.y-n.point.y,z:t.point.z-n.point.z};r.x*n.normal.x+r.y*n.normal.y+r.z*n.normal.z<=p*.5&&_.push({edge:e,closestPoint:t.point,distance:t.distance,t:t.t})}}if(_.length===0){let e=[];return s.snapToFaces&&e.push(...this.findFaces(u,n,l)),s.snapToVertices&&e.push(...this.findVertices(u,n.point,l)),{snapTarget:this.getBestSnapTarget(e),edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:f,isCorner:!1,cornerValence:0}}}let v=Ea(_),y=wa(v.edge,v.t,m,n.point),b;b=y.isCorner&&y.vertex?{type:`vertex`,position:y.vertex,expressId:u.expressId,confidence:Math.min(1,.99+y.valence*Oa.CORNER_CONFIDENCE_BOOST),metadata:{vertices:[v.edge.v0,v.edge.v1]}}:{type:`edge`,position:v.closestPoint,expressId:u.expressId,confidence:.999*(1-v.distance/p),metadata:{vertices:[v.edge.v0,v.edge.v1],edgeIndex:v.edge.index}};let x=y.isCorner&&y.atEndpoint;return{snapTarget:b,edgeLock:{edge:{v0:v.edge.v0,v1:v.edge.v1},meshExpressId:u.expressId,edgeT:v.t,shouldLock:!0,shouldRelease:!1,isCorner:x,cornerValence:x?y.valence:0}}}maintainEdgeLock(e,t,n,r,i){if(!t.edge)return{snapTarget:null,edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}};let{v0:a,v1:o}=t.edge,s=ca(e,a,o),c=s.distance;if(c>r*(Oa.EDGE_ESCAPE_MULTIPLIER*(1+t.lockStrength*.5)))return{snapTarget:null,edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}};let l=Math.max(0,Math.min(1,s.t)),u=r*Oa.EDGE_ATTRACTION_MULTIPLIER*Oa.CORNER_ATTRACTION_MULTIPLIER,d=n.edges.find(e=>sa(e.v0,a)&&sa(e.v1,o)||sa(e.v0,o)&&sa(e.v1,a)),f=d!==void 0&&!sa(d.v0,a),p=wa(d?f?{...d,v0:d.v1,v1:d.v0,v0Valence:d.v1Valence,v1Valence:d.v0Valence,junctions:d.junctions.map(e=>({...e,t:1-e.t})).reverse()}:d:{v0:a,v1:o,index:-1,length:oa(a,o),v0Valence:0,v1Valence:0,junctions:[]},l,u,e),m={x:a.x+(o.x-a.x)*l,y:a.y+(o.y-a.y)*l,z:a.z+(o.z-a.z)*l},h,g;if(p.isCorner&&p.vertex)h=`vertex`,g=Math.min(1,.99+p.valence*Oa.CORNER_CONFIDENCE_BOOST),m.x=p.vertex.x,m.y=p.vertex.y,m.z=p.vertex.z;else{h=`edge`;let e=.999*(1-c/(r*Oa.EDGE_ATTRACTION_MULTIPLIER));g=Math.max(0,Math.min(1,e))}let _=p.isCorner&&p.atEndpoint;return{snapTarget:{type:h,position:m,expressId:i,confidence:g,metadata:{vertices:[a,o]}},edgeLock:{edge:{v0:a,v1:o},meshExpressId:i,edgeT:l,shouldLock:!0,shouldRelease:!1,isCorner:_,cornerValence:_?p.valence:0}}}getGeometryCache(e){let t=this.cacheKeyFor(e),n=this.geometryCache.get(t);if(n)return n;let r=ba(e);return this.geometryCache.set(t,r),r}cacheKeyFor(e){if(e.occurrenceKey!==void 0)return e.occurrenceKey;let t=e.positions,n=t.length,r=e.origin,i=r?r[0]:0,a=r?r[1]:0,o=r?r[2]:0,s=n>=3?Math.floor(n/6)*3:0;return`${e.expressId}:${n}:${e.indices?.length??0}:${i},${a},${o}:${t[0]},${t[1]},${t[2]}:${t[s]},${t[s+1]},${t[s+2]}:${t[n-3]},${t[n-2]},${t[n-1]}`}findVertices(e,t,n){let r=[],i=this.getGeometryCache(e);for(let a of i.vertices){let i=oa(a,t);i<n*.2&&r.push({type:`vertex`,position:a,expressId:e.expressId,confidence:.95-i/(n*.2)})}return r}findEdges(e,t,n){let r=[],i=this.getGeometryCache(e),a=n*3;for(let n of i.edges){let i=this.raycaster.closestPointOnSegment(t,n.v0,n.v1),o=oa(i,t);o<a&&r.push({type:`edge`,position:i,expressId:e.expressId,confidence:.999*(1-o/a),metadata:{vertices:[n.v0,n.v1],edgeIndex:n.index}})}return r}clearCache(){this.geometryCache.clear()}findFaces(e,t,n){let r=[];r.push({type:`face`,position:t.point,normal:t.normal,expressId:e.expressId,confidence:.5,metadata:{faceIndex:t.triangleIndex}});let i=e.positions,a=e.indices,o=e.origin?e.origin[0]:0,s=e.origin?e.origin[1]:0,c=e.origin?e.origin[2]:0;if(a){let l=t.triangleIndex*3,u=a[l]*3,d=a[l+1]*3,f=a[l+2]*3,p={x:i[u]+o,y:i[u+1]+s,z:i[u+2]+c},m={x:i[d]+o,y:i[d+1]+s,z:i[d+2]+c},h={x:i[f]+o,y:i[f+1]+s,z:i[f+2]+c},g={x:(p.x+m.x+h.x)/3,y:(p.y+m.y+h.y)/3,z:(p.z+m.z+h.z)/3},_=oa(g,t.point);_<n&&r.push({type:`face_center`,position:g,normal:t.normal,expressId:e.expressId,confidence:.7*(1-_/n),metadata:{faceIndex:t.triangleIndex}})}return r}getBestSnapTarget(e){if(e.length===0)return null;let t={vertex:4,edge:3,face_center:2,face:1,point_cloud:0};return e.sort((e,n)=>{let r=t[n.type]-t[e.type];return r===0?n.confidence-e.confidence:r}),e[0]}};Aa=class{root=null;maxMeshesPerLeaf=8;meshAABBs=null;build(e){if(e.length===0){this.root=null,this.meshAABBs=null;return}let t=new Float32Array(e.length*6);for(let n=0;n<e.length;n++){let r=e[n].positions,i=1/0,a=1/0,o=1/0,s=-1/0,c=-1/0,l=-1/0;for(let e=0;e<r.length;e+=3){let t=r[e],n=r[e+1],u=r[e+2];i=Math.min(i,t),a=Math.min(a,n),o=Math.min(o,u),s=Math.max(s,t),c=Math.max(c,n),l=Math.max(l,u)}let u=e[n].origin,d=u?u[0]:0,f=u?u[1]:0,p=u?u[2]:0,m=n*6;t[m]=i+d,t[m+1]=a+f,t[m+2]=o+p,t[m+3]=s+d,t[m+4]=c+f,t[m+5]=l+p}this.meshAABBs=t;let n=e.map((e,t)=>t);this.root=this.buildNode(n)}getMeshesForRay(e,t){if(!this.root)return t.map((e,t)=>t);let n=[];return this.traverseRay(this.root,e,n),n}buildNode(e){let t=this.unionCachedBounds(e);if(e.length<=this.maxMeshesPerLeaf)return{bounds:t,meshIndices:e,isLeaf:!0};let n=this.getLongestAxis(t),r=n===`x`?0:n===`y`?1:2,i=[...e].sort((e,t)=>this.cachedCenter(e,r)-this.cachedCenter(t,r)),a=Math.floor(i.length/2),o=i.slice(0,a),s=i.slice(a);return{bounds:t,meshIndices:[],left:this.buildNode(o),right:this.buildNode(s),isLeaf:!1}}traverseRay(e,t,n){this.rayIntersectsAABB(t,e.bounds)&&(e.isLeaf?n.push(...e.meshIndices):(e.left&&this.traverseRay(e.left,t,n),e.right&&this.traverseRay(e.right,t,n)))}rayIntersectsAABB(e,t){let{origin:n,direction:r}=e,{min:i,max:a}=t,o=-1/0,s=1/0;for(let e of[`x`,`y`,`z`])if(Math.abs(r[e])<1e-7){if(n[e]<i[e]||n[e]>a[e])return!1}else{let t=1/r[e],c=(i[e]-n[e])*t,l=(a[e]-n[e])*t;if(c>l&&([c,l]=[l,c]),o=Math.max(o,c),s=Math.min(s,l),o>s)return!1}return s>=0}unionCachedBounds(e){let t=this.meshAABBs,n={min:{x:1/0,y:1/0,z:1/0},max:{x:-1/0,y:-1/0,z:-1/0}};for(let r of e){let e=r*6;n.min.x=Math.min(n.min.x,t[e]),n.min.y=Math.min(n.min.y,t[e+1]),n.min.z=Math.min(n.min.z,t[e+2]),n.max.x=Math.max(n.max.x,t[e+3]),n.max.y=Math.max(n.max.y,t[e+4]),n.max.z=Math.max(n.max.z,t[e+5])}return n}cachedCenter(e,t){let n=this.meshAABBs,r=e*6;return(n[r+t]+n[r+3+t])/2}getLongestAxis(e){let t=e.max.x-e.min.x,n=e.max.y-e.min.y,r=e.max.z-e.min.z;return t>n&&t>r?`x`:n>r?`y`:`z`}};ja=function(e){let t=e.entityIds;if(!t)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e.expressId)return!0;return!1};let Ma,Na;Ma=2e9;Na=1e6;Pa=new class{modelRanges=new Map;sortedRanges=[];nextOffset=0;registerModel(e,t){let n=this.modelRanges.get(e);if(n)return n.offset;let r=this.reserveModel(e,t);return this.publishRange(e,0,t),r}reserveModel(e,t){if(!e||typeof e!=`string`)throw Error(`[FederationRegistry] Invalid modelId: ${e}`);if(typeof t!=`number`||!Number.isFinite(t)||t<0)throw Error(`[FederationRegistry] Invalid reservedMaxExpressId: ${t} for model ${e}`);if(this.modelRanges.has(e)){let t=this.modelRanges.get(e);return console.warn(`[FederationRegistry] Model ${e} already registered with offset ${t.offset}`),t.offset}if(this.nextOffset+t>Ma)throw Error(`[FederationRegistry] Cannot register model: would exceed safe ID limit. Current offset: ${this.nextOffset}, reserved model max ID: ${t}. Please unload some models first.`);let n=this.nextOffset,r={modelId:e,offset:n,maxExpressId:-1,reservedMaxExpressId:t,publishedStart:null};return this.modelRanges.set(e,r),this.sortedRanges.push(r),this.sortedRanges.sort((e,t)=>e.offset-t.offset),this.nextOffset=n+t+1+Na,n}publishRange(e,t,n){let r=this.modelRanges.get(e);if(!r)throw Error(`[FederationRegistry] Cannot publish unknown model ${e}`);if(!Number.isInteger(t)||!Number.isInteger(n)||t<0||n<t||n>r.reservedMaxExpressId)throw Error(`[FederationRegistry] Invalid published range ${t}..${n} for ${e}`);if(r.publishedStart===null)r.publishedStart=t;else if(t!==r.maxExpressId+1)throw Error(`[FederationRegistry] Published IDs for ${e} must be contiguous and source ordered`);r.maxExpressId=n}publishOverlayRange(e,t,n){let r=this.modelRanges.get(e);if(!r)throw Error(`[FederationRegistry] Cannot publish unknown model ${e}`);let i=r.reservedMaxExpressId+Na;if(!Number.isInteger(t)||!Number.isInteger(n)||t<r.reservedMaxExpressId+1||n<t||n>i)throw Error(`[FederationRegistry] Invalid overlay range ${t}..${n} for ${e}`);if(t!==r.maxExpressId+1)throw Error(`[FederationRegistry] Overlay IDs for ${e} must extend published ownership contiguously`);r.maxExpressId=n}previewOverlayGlobalId(e,t,n,r){let i=this.modelRanges.get(e);if(!i)throw Error(`[FederationRegistry] Cannot preview unknown model ${e}`);let a=i.reservedMaxExpressId+Na;if(!Number.isInteger(t)||!Number.isInteger(n)||!Number.isInteger(r)||t<i.reservedMaxExpressId+1||n<t||n>a||r<t||r>n)throw Error(`[FederationRegistry] Invalid overlay preview ${t}..${n} for ${e}`);if(t!==i.maxExpressId+1)throw Error(`[FederationRegistry] Overlay preview for ${e} must extend published ownership contiguously`);return i.offset+r}unregisterModel(e){this.modelRanges.get(e)?(this.modelRanges.delete(e),this.sortedRanges=this.sortedRanges.filter(t=>t.modelId!==e)):console.warn(`[FederationRegistry] Cannot unregister unknown model: ${e}`)}toGlobalId(e,t){let n=this.modelRanges.get(e);if(!n)return t;if(!this.isPublished(n,t))throw Error(`[FederationRegistry] Local ID ${t} is not published for model ${e}`);return t+n.offset}fromGlobalId(e){if(this.sortedRanges.length===0)return null;let t=this.binarySearchRange(e);if(!t)return null;let n=e-t.offset;return this.isPublished(t,n)?{modelId:t.modelId,expressId:n}:null}getModelForGlobalId(e){return this.fromGlobalId(e)?.modelId??null}getOffset(e){return this.modelRanges.get(e)?.offset??null}hasModel(e){return this.modelRanges.has(e)}getModelIds(){return Array.from(this.modelRanges.keys())}getModelCount(){return this.modelRanges.size}getGlobalIdRange(e){let t=this.modelRanges.get(e);return!t||t.publishedStart===null?null:{start:t.offset+t.publishedStart,end:t.offset+t.maxExpressId}}isInModel(e,t){let n=this.modelRanges.get(t);if(!n)return!1;let r=e-n.offset;return this.isPublished(n,r)}clear(){this.modelRanges.clear(),this.sortedRanges=[],this.nextOffset=0}isPublished(e,t){return e.publishedStart!==null&&Number.isInteger(t)&&t>=e.publishedStart&&t<=e.maxExpressId}binarySearchRange(e){let t=this.sortedRanges;if(t.length===0||e<t[0].offset)return null;let n=0,r=t.length-1;for(;n<r;){let i=Math.floor((n+r+1)/2);t[i].offset<=e?n=i:r=i-1}return t[n]}};function Fa(e,t){if(!e||!(e.pixelRadius>0))return 0;if(!t)return e.pixelRadius;let n=e.interactingPixelRadius??e.pixelRadius;return Math.max(e.pixelRadius,n)}function Ia(e,t,n,r){if(!Number.isFinite(n))return 1/0;let i=r.viewportHeightPx*.5;if(!(i>0))return 1/0;if(r.mode===`orthographic`)return r.orthoHalfHeight>0?n/r.orthoHalfHeight*i:1/0;let a=r.viewDir.x*r.viewDir.x+r.viewDir.y*r.viewDir.y+r.viewDir.z*r.viewDir.z;if(!(a>.5)||!Number.isFinite(a))return 1/0;let o=r.viewDir.x>=0?e[0]:t[0],s=r.viewDir.y>=0?e[1]:t[1],c=r.viewDir.z>=0?e[2]:t[2],l=(o-r.eye.x)*r.viewDir.x+(s-r.eye.y)*r.viewDir.y+(c-r.eye.z)*r.viewDir.z;if(!(l>n))return 1/0;let u=Math.tan(r.fovYRadians*.5);return u>0?n/(l*u)*i:1/0}function La(e,t,n){let r=t[0]-e[0],i=t[1]-e[1],a=t[2]-e[2],o=.5*Math.sqrt(r*r+i*i+a*a);if(!Number.isFinite(o))return 1/0;let s=n.viewportHeightPx*.5;if(!(s>0))return 1/0;if(n.mode===`orthographic`)return n.orthoHalfHeight>0?o/n.orthoHalfHeight*s:1/0;let c=(e[0]+t[0])*.5-n.eye.x,l=(e[1]+t[1])*.5-n.eye.y,u=(e[2]+t[2])*.5-n.eye.z,d=n.viewDir.x*n.viewDir.x+n.viewDir.y*n.viewDir.y+n.viewDir.z*n.viewDir.z;if(!(d>.5)||!Number.isFinite(d))return 1/0;let f=c*n.viewDir.x+l*n.viewDir.y+u*n.viewDir.z;if(f<=o)return 1/0;let p=Math.tan(n.fovYRadians*.5);return p>0?o/(f*p)*s:1/0}function Ra(e,t){let n=e.origin,r=n?n[0]:0,i=n?n[1]:0,a=n?n[2]:0,o=e.positions.length>=3,s=r+(o?e.positions[0]:0),c=i+(o?e.positions[1]:0),l=a+(o?e.positions[2]:0),u=Math.floor(s/t),d=Math.floor(c/t),f=Math.floor(l/t);return!Number.isFinite(u)||!Number.isFinite(d)||!Number.isFinite(f)?`nan`:`${u},${d},${f}`}function za(e,t){let n=`${Math.round(e[0]*1e3)}|${Math.round(e[1]*1e3)}|${Math.round(e[2]*1e3)}|${Math.round(e[3]*1e3)}`;return t?.metallic===void 0&&t?.roughness===void 0?n:`${n}|${t.metallic===void 0?``:Math.round(t.metallic*1e3)}|${t.roughness===void 0?``:Math.round(t.roughness*1e3)}`}function Ba(e,t,n){return n?`${Ra(e,n.cellSize)}~${t}`:t}function Va(e,t,n,r,i=30){let a=t-n;if(a<=0)return[];let o=e.filter(e=>r-e.lastDrawnFrame>=i).sort((e,t)=>e.lastDrawnFrame-t.lastDrawnFrame),s=[];for(let e of o){if(a<=0)break;s.push(e.key),a-=e.bytes}return s}var Ha=.02,Ua=2**24-1;function Wa(e,t,n,r){if((n.length/3|0)<500||!(r>0)||!Number.isFinite(r))return null;let i=t>0?e.length/t|0:0,a=new Int32Array(i).fill(-1),o=new Map,s,c=t>6?new Uint32Array(e.buffer,e.byteOffset,e.length):null,l=n=>{let i=a[n];if(i!==-1)return i;let l=n*t,u=Math.floor(e[l]/r),d=Math.floor(e[l+1]/r),f=Math.floor(e[l+2]/r),p=c?c[l+6]:0,m;if(Number.isSafeInteger(u)&&Number.isSafeInteger(d)&&Number.isSafeInteger(f)){s??=[u,d,f];let e=u-s[0],t=d-s[1],n=f-s[2];m=e>=-64&&e<64&&t>=-64&&t<64&&n>=-64&&n<64?p*2097152+(e+64)*16384+(t+64)*128+n+64:`${u},${d},${f},${p}`}else m=`${u},${d},${f},${p}`;let h=o.get(m),g;if(h===void 0){if(g=n,o.size>=Ua)return-1;o.set(m,n)}else g=h;return a[n]=g,g},u=new Uint32Array(n.length),d=0;for(let e=0;e<n.length;e+=3){let t=l(n[e]),r=l(n[e+1]),i=l(n[e+2]);if(t<0||r<0||i<0)return null;t!==r&&r!==i&&t!==i&&(u[d]=t,u[d+1]=r,u[d+2]=i,d+=3)}return d>=n.length*.75||d===0?null:u.slice(0,d)}function Ga(e,t){let n=t[0]-e[0],r=t[1]-e[1],i=t[2]-e[2];return Math.sqrt(n*n+r*r+i*i)*Ha}Z=1/1024;65535*Z;function Ka(e,t,n){let r=Math.abs(e)+Math.abs(t)+Math.abs(n),i,a;if(r<1e-12)i=0,a=0;else if(i=e/r,a=t/r,n<0){let e=(1-Math.abs(a))*(i>=0?1:-1),t=(1-Math.abs(i))*(a>=0?1:-1);i=e,a=t}return[Math.max(0,Math.min(255,Math.round((i*.5+.5)*255))),Math.max(0,Math.min(255,Math.round((a*.5+.5)*255)))]}function qa(e,t){let n=e.length/t|0;if(n===0)return{vertexData:new ArrayBuffer(0),quantMin:[0,0,0],step:Z};let r=1/0,i=1/0,a=1/0,o=-1/0,s=-1/0,c=-1/0;for(let l=0;l<n;l++){let n=l*t,u=e[n],d=e[n+1],f=e[n+2];if(!Number.isFinite(u)||!Number.isFinite(d)||!Number.isFinite(f))return null;u<r&&(r=u),u>o&&(o=u),d<i&&(i=d),d>s&&(s=d),f<a&&(a=f),f>c&&(c=f)}let l=Math.floor(r/Z)*Z,u=Math.floor(i/Z)*Z,d=Math.floor(a/Z)*Z;if(o-l>63.9990234375||s-u>63.9990234375||c-d>63.9990234375)return null;let f=new ArrayBuffer(n*12),p=new Uint16Array(f),m=new Uint32Array(f),h=new Uint32Array(e.buffer,e.byteOffset,e.length);for(let r=0;r<n;r++){let n=r*t,i=Math.round((e[n]-l)/Z),a=Math.round((e[n+1]-u)/Z),o=Math.round((e[n+2]-d)/Z),[s,c]=Ka(e[n+3],e[n+4],e[n+5]),f=r*6;p[f]=Math.min(65535,Math.max(0,i)),p[f+1]=Math.min(65535,Math.max(0,a)),p[f+2]=Math.min(65535,Math.max(0,o)),p[f+3]=s<<8|c,m[r*3+2]=h[n+6]}return{vertexData:f,quantMin:[l,u,d],step:Z}}var Ja=e=>e.vertexBuffer.size+e.indexBuffer.size+(e.uniformBuffer?.size??0)+(e.lod1IndexBuffer?.size??0);function Ya(e){let t=0;for(let n of e.batches)t+=Ja(n);for(let n of e.partialBatches)t+=Ja(n);let n=0;for(let t of e.meshes)n+=Ja(t);let r=0;for(let t of e.textured)r+=Ja(t),r+=t.texture.width*t.texture.height*t.texture.depthOrArrayLayers*4;let i=0;for(let t of e.instanced)i+=t.vertexBuffer.size+t.indexBuffer.size+t.instanceBuffer.size+(t.rteDeltas?.buffer.size??0);return{batches:t,meshes:n,textured:r,instanced:i,total:t+n+r+i}}Q=function(e,t,n){return!(t!=null&&t.has(e)||n!=null&&!n.has(e))};Xa=.9;function Za(e,t=new Float32Array(16)){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=e?e[0]:0,t[13]=e?e[1]:0,t[14]=e?e[2]:0,t[15]=1,t}function Qa(e,t){if(!t)return!0;let{hiddenIds:n,isolatedIds:r}=t;for(let t of e)if(Q(t,n,r))return!0;return!1}function $a(e,t,n){if((t==null||t.size===0)&&n==null)return{kind:`all`};let r=new Set;for(let i of e)Q(i,t,n)&&r.add(i);return r.size===0?{kind:`none`}:r.size===e.length?{kind:`all`}:{kind:`partial`,visibleIds:r}}function eo(e,t,n){let r=[],i=n?.minCastAlpha??.9;for(let n of e.batches){if(n.gpuResident===!1||!n.vertexBuffer||!n.indexBuffer||n.indexCount<=0||n.color[3]<i||!Qa(n.expressIds,t))continue;let e=n.quantized;r.push({kind:e?`quantized`:`flat`,vertexBuffer:n.vertexBuffer,indexBuffer:n.indexBuffer,indexCount:n.indexCount,model:Za(n.origin),origin:n.origin,quantParams:e?[e.min[0],e.min[1],e.min[2],e.step]:void 0})}for(let t of e.instanced)!t.vertexBuffer||!t.indexBuffer||t.indexCount<=0||t.instanceCount<=0||r.push({kind:`instanced`,vertexBuffer:t.vertexBuffer,indexBuffer:t.indexBuffer,indexCount:t.indexCount,instanceBuffer:t.instanceBuffer,instanceCount:t.instanceCount,canonicalAnchors:t.canonicalAnchors,rteDeltas:t.rteDeltas});for(let n of e.textured)!n.vertexBuffer||!n.indexBuffer||n.indexCount<=0||n.color[3]<i||Qa([n.expressId],t)&&r.push({kind:`textured`,vertexBuffer:n.vertexBuffer,indexBuffer:n.indexBuffer,indexCount:n.indexCount,model:Za(n.origin),origin:n.origin});for(let n of e.meshes??[])n.hydrated||!n.vertexBuffer||!n.indexBuffer||n.indexCount<=0||n.color[3]<i||Qa([n.expressId],t)&&r.push({kind:`flat`,vertexBuffer:n.vertexBuffer,indexBuffer:n.indexBuffer,indexCount:n.indexCount,model:n.transform.m,origin:n.rteOrigin??[n.transform.m[12],n.transform.m[13],n.transform.m[14]]});return r}to=class{version=0;hiddenSnapshot=null;isolatedSnapshot=null;update(e,t){let n=e&&e.size>0?e:null,r=t??null,i=!no(n,this.hiddenSnapshot),a=!no(r,this.isolatedSnapshot);return(i||a)&&(this.version++,i&&(this.hiddenSnapshot=n?new Set(n):null),a&&(this.isolatedSnapshot=r?new Set(r):null)),this.version}getVersion(){return this.version}};function no(e,t){if(e===t)return!0;if(e===null||t===null||e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}Object.freeze({count:0,min:null,median:null,p95:null,max:null,mean:null});function ro(e,t){let n=t-e;return n<0n?0:Number(n)/1e6}function io(e){let t=Object.create(null);for(let n of e){let e=ro(n.startNs,n.endNs);t[n.label]=(t[n.label]??0)+e}return t}function ao(e){return e?.has(`timestamp-query`)??!1}var oo=8;function so(e){return e*2*oo}function co(e,t){return e+1>=t*2?null:{beginningOfPassWriteIndex:e,endOfPassWriteIndex:e+1,nextQueryIndex:e+2}}function lo(e,t){let n=[];for(let r=0;r<e.length&&!(r*2+1>=t.length);r++)n.push({label:e[r],startNs:t[r*2],endNs:t[r*2+1]});return n}var uo=class e{maxPasses;querySet;resolveBuffer;readbackBuffer;labels=[];nextQueryIndex=0;resolved=!1;reading=!1;destroyed=!1;constructor(e,t,n,r){this.maxPasses=e,this.querySet=t,this.resolveBuffer=n,this.readbackBuffer=r}static create(t,n=8){if(!Number.isInteger(n)||n<1||n>2048)throw RangeError(`maxPasses must be an integer from 1 to 2048`);if(!ao(t.features))return null;let r=t.createQuerySet({type:`timestamp`,count:n*2,label:`frame-timing-queries`}),i=null,a=null;try{return i=t.createBuffer({size:so(n),usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC,label:`frame-timing-resolve`}),a=t.createBuffer({size:so(n),usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ,label:`frame-timing-readback`}),new e(n,r,i,a)}catch(e){throw a?.destroy(),i?.destroy(),r.destroy(),e}}beginPass(e){if(this.destroyed||this.reading||this.resolved)return null;let t=co(this.nextQueryIndex,this.maxPasses);return t===null?null:(this.nextQueryIndex=t.nextQueryIndex,this.labels.push(e),{querySet:this.querySet,beginningOfPassWriteIndex:t.beginningOfPassWriteIndex,endOfPassWriteIndex:t.endOfPassWriteIndex})}endFrame(e){this.destroyed||this.reading||this.resolved||this.nextQueryIndex===0||(e.resolveQuerySet(this.querySet,0,this.nextQueryIndex,this.resolveBuffer,0),e.copyBufferToBuffer(this.resolveBuffer,0,this.readbackBuffer,0,this.nextQueryIndex*oo),this.resolved=!0)}async readback(){if(this.destroyed||this.reading||!this.resolved)return null;this.reading=!0;let e=[...this.labels],t=this.nextQueryIndex*oo;try{if(await this.readbackBuffer.mapAsync(GPUMapMode.READ,0,t),this.destroyed)return null;let n=this.readbackBuffer.getMappedRange(0,t);return lo(e,new BigInt64Array(n.slice(0)))}finally{this.readbackBuffer.unmap(),this.reading=!1,this.resolved=!1}}beginFrame(){return this.destroyed||this.reading||this.resolved?!1:(this.labels=[],this.nextQueryIndex=0,!0)}destroy(){this.destroyed||(this.destroyed=!0,this.readbackBuffer.unmap(),this.querySet.destroy(),this.resolveBuffer.destroy(),this.readbackBuffer.destroy())}};function fo(e){return!!(e&&(e.sectionPlane||e.extraPlanes?.length||e.clipBox?.enabled))}function po(e,t,n,r){let i=e?.sectionPlane;if(i){let e=i.flipped?-1:1;if((t*i.normal[0]+n*i.normal[1]+r*i.normal[2]-i.distance)*e>0)return!0}if(R(e?.extraPlanes,t,n,r))return!0;let a=e?.clipBox;return!!(a?.enabled&&(t<a.min[0]||n<a.min[1]||r<a.min[2]||t>a.max[0]||n>a.max[1]||r>a.max[2]))}function mo(e,t){let n=e?.sectionPlane;if(n&&z(t,n)||e?.extraPlanes?.some(e=>z(t,e)))return!0;let r=e?.clipBox;return!!(r?.enabled&&(t.max.x<r.min[0]||t.min.x>r.max[0]||t.max.y<r.min[1]||t.min.y>r.max[1]||t.max.z<r.min[2]||t.min.z>r.max[2]))}function ho(e,t,n,r){let i=[r.min,r.max],a=-1/0,o=1/0;if(isFinite(t.x))a=(i[n[0]].x-e.x)*t.x,o=(i[1-n[0]].x-e.x)*t.x;else if(e.x<r.min.x||e.x>r.max.x)return!1;if(isFinite(t.y)){let r=(i[n[1]].y-e.y)*t.y,s=(i[1-n[1]].y-e.y)*t.y;if(a>s||r>o)return!1;r>a&&(a=r),s<o&&(o=s)}else if(e.y<r.min.y||e.y>r.max.y)return!1;if(isFinite(t.z)){let r=(i[n[2]].z-e.z)*t.z,s=(i[1-n[2]].z-e.z)*t.z;if(a>s||r>o)return!1;r>a&&(a=r),s<o&&(o=s)}else if(e.z<r.min.z||e.z>r.max.z)return!1;return o>=0}function go(e,t,n,r){let i=[r.min,r.max],a=-1/0,o=1/0;if(isFinite(t.x)){let r=(i[n[0]].x-e.x)*t.x,s=(i[1-n[0]].x-e.x)*t.x;a=r,o=s}else if(e.x<r.min.x||e.x>r.max.x)return null;if(isFinite(t.y)){let r=(i[n[1]].y-e.y)*t.y,s=(i[1-n[1]].y-e.y)*t.y;if(a>s||r>o)return null;r>a&&(a=r),s<o&&(o=s)}else if(e.y<r.min.y||e.y>r.max.y)return null;if(isFinite(t.z)){let r=(i[n[2]].z-e.z)*t.z,s=(i[1-n[2]].z-e.z)*t.z;if(a>s||r>o)return null;r>a&&(a=r),s<o&&(o=s)}else if(e.z<r.min.z||e.z>r.max.z)return null;return o<0?null:a<0?0:a}function _o(e,t,n,r){let i=[r.min,r.max],a=-1/0,o=1/0,s=[`x`,`y`,`z`];for(let c=0;c<3;c++){let l=s[c];if(isFinite(t[l])){let r=(i[n[c]][l]-e[l])*t[l],s=(i[1-n[c]][l]-e[l])*t[l];r>a&&(a=r),s<o&&(o=s)}else if(e[l]<r.min[l]||e[l]>r.max[l])return null}return o<a||o<0?null:{tmin:a,tmax:o}}function vo(e,t,n,r,i,a){let o=i,s=a?.clipBox;if(s?.enabled){let e={x:Math.max(i.min.x,s.min[0]),y:Math.max(i.min.y,s.min[1]),z:Math.max(i.min.z,s.min[2])},t={x:Math.min(i.max.x,s.max[0]),y:Math.min(i.max.y,s.max[1]),z:Math.min(i.max.z,s.max[2])};if(e.x>t.x||e.y>t.y||e.z>t.z)return null;o={min:e,max:t}}let c=_o(e,n,r,o);if(!c)return null;let{tmin:l,tmax:u}=c,d=B(a,e,t,l,u);return d?({tmin:l,tmax:u}=d,l<0?0:l):null}function yo(e,t,n,r,i){let a=1e-7,o=_.subtract(r,n),s=_.subtract(i,n),c=_.cross(t,s),l=_.dot(o,c);if(l>-1e-7&&l<a)return null;let u=1/l,d=_.subtract(e,n),f=u*_.dot(d,c);if(f<0||f>1)return null;let p=_.cross(d,o),m=u*_.dot(t,p);if(m<0||f+m>1)return null;let h=u*_.dot(s,p);return h>a?h:null}function bo(e){let t={x:e.x===0?1/0:1/e.x,y:e.y===0?1/0:1/e.y,z:e.z===0?1/0:1/e.z};return{rayDirInv:t,rayDirSign:[+(t.x<0),+(t.y<0),+(t.z<0)]}}function xo(e,t,n,r,i,a,o,s){let c=null,l=1/0,u=fo(s);for(let[d,f]of i){if(a?.has(d)||o!=null&&!o.has(d))continue;let i=u?vo(e,t,n,r,f,s):go(e,n,r,f);i!==null&&i<l&&(l=i,c={expressId:d,distance:i})}return c}function So(e,t,n,r,i,a,o,s,c){let l=null,u=1/0,d=fo(c),f=[];for(let t of i.keys()){if(o?.has(t)||s!=null&&!s.has(t))continue;let i=a(t);i&&(d&&mo(c,i)||ho(e,n,r,i)&&f.push(t))}for(let n of f){let r=i.get(n);if(r)for(let i of r){let r=i.positions,a=i.indices,o=i.entityIds,s=mr(i,n),f=i.origin,p=f?{x:e.x-f[0],y:e.y-f[1],z:e.z-f[2]}:e;for(let f=0;f<a.length;f+=3){if(o&&o[a[f]]!==n)continue;let m=a[f]*3,h=a[f+1]*3,g=a[f+2]*3,_=yo(p,t,{x:r[m],y:r[m+1],z:r[m+2]},{x:r[h],y:r[h+1],z:r[h+2]},{x:r[g],y:r[g+1],z:r[g+2]});if(_!==null&&_<u){if(d&&po(c,e.x+_*t.x,e.y+_*t.y,e.z+_*t.z))continue;u=_,l={expressId:n,distance:_,modelIndex:i.modelIndex,geometryItemId:s}}}}}return l}var Co=2*Math.PI,wo=32;function To(e){let t=[],n=e.sectionPlane;if(n){let e=n.flipped?-1:1;t.push({n:[n.normal[0]*e,n.normal[1]*e,n.normal[2]*e],limit:n.distance*e})}for(let n of e.extraPlanes??[]){let e=n.flipped?-1:1;t.push({n:[n.normal[0]*e,n.normal[1]*e,n.normal[2]*e],limit:n.distance*e})}let r=e.clipBox;if(r?.enabled)for(let e=0;e<3;e++){let n=[0,0,0],i=[0,0,0];n[e]=1,i[e]=-1,t.push({n,limit:r.max[e]},{n:i,limit:-r.min[e]})}return t}function Eo(e,t){return e.x*t[0]+e.y*t[1]+e.z*t[2]}function Do(e,t){let n=e.pointAt(0),r=e.pointAt(1);if(!n||!r)return[];let i=0,a=1;for(let e of t){let t=Eo(n,e.n)-e.limit,o=Eo(r,e.n)-Eo(n,e.n);if(Math.abs(o)<1e-15){if(t>0)return[];continue}let s=-t/o;if(o>0?a=Math.min(a,s):i=Math.max(i,s),i>a)return[]}return[[Math.max(0,i),Math.min(1,a)]]}function Oo(e,t,n,r,i){let a=Eo(t,e.n)-e.limit,o=Eo(n,e.n),s=Eo(r,e.n),c=Math.hypot(o,s);if(!(c>0)||Math.abs(a)>c)return[];let l=Math.atan2(s,o),u=Math.acos(Math.max(-1,Math.min(1,-a/c))),d=[],f=Math.min(0,i),p=Math.max(0,i);for(let e of[l-u,l+u]){let t=Math.ceil((f-e)/Co),n=Math.floor((p-e)/Co);if(!(n-t>512))for(let r=t;r<=n;r++){let t=(e+Co*r)/i;t>0&&t<1&&d.push(t)}}return d}function ko(e,t,n){t.sort((e,t)=>e-t);let r=[];for(let i=0;i+1<t.length;i++){let a=t[i],o=t[i+1];if(o-a<=1e-14)continue;let s=e.pointAt((a+o)/2);s&&!po(n,s.x,s.y,s.z)&&r.push([a,o])}return r}function Ao(e,t,n){let r=Array.from({length:33},(t,n)=>e.pointAt(n/wo)),i=[0,1];for(let n of t)for(let t=0;t<wo;t++){let a=r[t],o=r[t+1];if(!a||!o)continue;let s=Eo(a,n.n)-n.limit,c=Eo(o,n.n)-n.limit;if(!Number.isFinite(s)||!Number.isFinite(c))continue;let l=t/wo,u=(t+1)/wo;if(s===0&&i.push(l),c===0&&i.push(u),s===0||c===0||Math.sign(s)===Math.sign(c))continue;let d=l,f=u,p=!0;for(let t=0;t<40;t++){let t=(d+f)/2,r=e.pointAt(t);if(!r){p=!1;break}let i=Eo(r,n.n)-n.limit;if(!Number.isFinite(i)){p=!1;break}Math.sign(i)===Math.sign(s)?(d=t,s=i):f=t}p&&i.push((d+f)/2)}return ko(e,i,n)}function jo(e,t,n){let r=e.sweepAngle;if(!r||!Number.isFinite(r))return[];let i=e.pointAt(0),a=e.pointAt(Math.PI/(2*r)),o=e.pointAt(Math.PI/r);if(!i||!a||!o)return[];let s={x:(i.x+o.x)/2,y:(i.y+o.y)/2,z:(i.z+o.z)/2},c={x:i.x-s.x,y:i.y-s.y,z:i.z-s.z},l={x:a.x-s.x,y:a.y-s.y,z:a.z-s.z};return ko(e,[0,1,...t.flatMap(e=>Oo(e,s,c,l,r))],n)}function Mo(e,t){if(!t||!t.sectionPlane&&!t.extraPlanes?.length&&!t.clipBox?.enabled)return[[0,1]];let n=To(t);return e.affineDisplayFrame===!1?Ao(e,n,t):e.kind===`line`?Do(e,n):jo(e,n,t)}function No(e,t,n,r,i,a){let o=e.bounds;if(!o)return!0;let s={x:o.center.x-t.origin.x,y:o.center.y-t.origin.y,z:o.center.z-t.origin.z},c=s.x*t.direction.x+s.y*t.direction.y+s.z*t.direction.z;if(c+o.radius<0)return!1;let l=Math.sqrt(Math.max(0,s.x**2+s.y**2+s.z**2-c**2)),u=a===null?la(n,Math.max(0,c+o.radius),r,i):n*2*a/i;return l<=o.radius+u}function Po(e,t,n,r,i){if(!t||t.type===Da.FACE||t.type===Da.FACE_CENTER)return!0;let a=i(t.position);return e.screenDistance+.5<(a?Math.hypot(a.x-n,a.y-r):1/0)}function Fo(e,t,n,r,i,a,o,s,c,l,u){let d=Io(e,n,r,i,a,o,s,c,l,u);return d&&Po(d,t,n,r,a)?d.target:null}function Io(e,t,n,r,i,a,o,s,c,l){if(!(Number.isFinite(r)&&r>0))return null;let u=s?.snapToVertices??!0,d=s?.snapToEdges??!0;if(!u&&!d)return null;let f=null;for(let s of e){if(c&&!c(s))continue;let e=e=>{let r=s.pointAt(e);if(!r||![r.x,r.y,r.z].every(Number.isFinite)||po(o,r.x,r.y,r.z)||!a(s,r))return{distanceSquared:1/0,point:null};let c=i(r);return c?{distanceSquared:(c.x-t)**2+(c.y-n)**2,point:r}:{distanceSquared:1/0,point:null}},p=(t,n)=>{for(let r=0;r<24;r++){let r=(t+n)/2;e(r).distanceSquared<1/0?t=r:n=r}return t},m=null;if(l&&s.kind===`line`&&s.affineDisplayFrame!==!1){let e=s.pointAt(0),t=s.pointAt(1);if(!e||!t||(m=l(e,t),!m))continue}let h=0,g={distanceSquared:1/0,point:null};for(let[t,n]of Mo(s,o)){let r=m?Math.max(t,m[0]):t,i=m?Math.min(n,m[1]):n;if(r>i)continue;if(!d){for(let t of[0,1])if(t>=r&&t<=i){let n=e(t);n.distanceSquared<g.distanceSquared&&(h=t,g=n)}continue}let a=s.kind===`arc`||s.affineDisplayFrame===!1,o=!a&&i>r&&e(r).distanceSquared===1/0&&e(i).distanceSquared===1/0,c=a||o,l=o?64:c?Math.min(256,Math.max(32,Math.ceil(Math.abs(s.sweepAngle??0)*(i-r)/(Math.PI/32)))):1,u=[];for(let t=0;t<=l;t++){let n=r+(i-r)*t/l,a=e(n);u.push(a.distanceSquared),a.distanceSquared<g.distanceSquared&&(h=n,g=a)}for(let t=0;t<=l;t++){if(c&&(u[t]>(u[t-1]??1/0)||u[t]>(u[t+1]??1/0))||u[t]===1/0)continue;let n=c?r+(i-r)*Math.max(0,t-1)/l:r,a=c?r+(i-r)*Math.min(l,t+1)/l:i;if(o){let o=r+(i-r)*t/l;t>0&&u[t-1]===1/0&&(n=p(o,n)),t<l&&u[t+1]===1/0&&(a=p(o,a));for(let t of[n,a]){let n=e(t);n.distanceSquared<g.distanceSquared&&(h=t,g=n)}}for(let t=0;t<30;t++){let t=n+(a-n)*.3819660112501051,r=a-(a-n)*.3819660112501051,i=e(t).distanceSquared,o=e(r).distanceSquared;if(i===1/0&&o===1/0){if(e(a).distanceSquared<1/0)n=r;else if(e(n).distanceSquared<1/0)a=t;else break}else i<=o?a=r:n=t}let s=(n+a)/2,d=e(s);if(d.distanceSquared<g.distanceSquared&&(h=s,g=d),!c)break}}if(!g.point||g.distanceSquared>r*r)continue;let _=Math.sqrt(g.distanceSquared);if(f&&_>=f.screenDistance)continue;let v=h<=1e-7||h>=1-1e-7;(d||v&&u)&&(f={screenDistance:_,target:{type:v&&u?Da.VERTEX:Da.EDGE,position:g.point,expressId:s.globalId,confidence:1-_/r,metadata:{sourceCurve:{...s.identity,kind:s.kind,length:s.length,t:h}}}})}return f}function Lo(e,t,n,r,i,a,o,s,c){if(e.length===0)return null;let l=s?.snapOptions?.screenSnapRadius??20,u=Cn(n.getRelativeToEyeFrame()),d=n.getProjectionMode()===`orthographic`?n.getOrthoSize():null,f=n.getFOV();return Fo(e,t,i,a,l,e=>n.projectToScreen(e,o.width,o.height),e=>Q(e.globalId,s?.hiddenIds,s?.isolatedIds),c,s?.snapOptions,e=>No(e,r,l,f,o.height,d),u)}var Ro=.5,zo=3e7,Bo=2**24,Vo=Bo-(1<<20),Ho=65536,Uo=Ho*2,Wo=8192,Go=Math.sqrt(3);function Ko(e){return e<-65536?-65536:e>=Ho?65535:e}function qo(e,t){if(!e)return!0;let n=e[t>>5];return n===void 0||(n>>>(t&31)&1)==1}function Jo(e,t,n){let r=-1/0,i=1/0;for(let a of[`x`,`y`,`z`]){let o=e[a],s=t[a];if(Math.abs(s)<1e-12){if(o<n.min[a]||o>n.max[a])return null;continue}let c=(n.min[a]-o)/s,l=(n.max[a]-o)/s;if(c>l){let e=c;c=l,l=e}if(c>r&&(r=c),l<i&&(i=l),r>i)return null}return i<0?null:{tMin:r,tMax:i}}var Yo=class{cellSize;maxIndexedPoints;maxIndexedCells;cells=new Map;chunks=[];total=0;cellsExhausted=!1;minX=1/0;minY=1/0;minZ=1/0;maxX=-1/0;maxY=-1/0;maxZ=-1/0;cellOriginX=0;cellOriginY=0;cellOriginZ=0;hasCellOrigin=!1;packKey(e,t,n){let r=Ko(e-this.cellOriginX)+Ho,i=Ko(t-this.cellOriginY)+Ho,a=Ko(n-this.cellOriginZ)+Ho;return(r*Uo+i)*Uo+a}constructor(e=Ro,t=zo,n=Vo){this.cellSize=e>0&&Number.isFinite(e)?e:Ro,this.maxIndexedPoints=t>0&&Number.isFinite(t)?Math.floor(t):zo;let r=n>0&&Number.isFinite(n)?Math.floor(n):Vo;this.maxIndexedCells=Math.min(r,Bo-1)}get pointCount(){return this.total}get cellCount(){return this.cells.size}get cellCapacity(){return this.maxIndexedCells}get capReason(){return this.cellsExhausted?`cells`:this.total>=this.maxIndexedPoints?`points`:null}get isCapped(){return this.capReason!==null}reportCapIfBound(){let e=this.capReason;e&&console.warn(`[PointCloudSpatialIndex] measure-snap index closed at its ${e} limit (${this.total} points in ${this.cells.size} cells, cell size ${this.cellSize} m). Later points still render, but the measure tool cannot snap to them.`)}insertRange(e,t,n){if(t<=0||this.isCapped)return;let r=Math.min(t,this.maxIndexedPoints-this.total),i=this.total,a=r;for(let t=0;t<r;t++){let n=t*3,r=e[n],o=e[n+1],s=e[n+2];if(!Number.isFinite(r)||!Number.isFinite(o)||!Number.isFinite(s))continue;let c=Math.floor(r/this.cellSize),l=Math.floor(o/this.cellSize),u=Math.floor(s/this.cellSize);this.hasCellOrigin||=(this.cellOriginX=c,this.cellOriginY=l,this.cellOriginZ=u,!0);let d=this.packKey(c,l,u),f=this.cells.get(d);if(!f){if(this.cells.size>=this.maxIndexedCells){this.cellsExhausted=!0,a=t;break}f=[],this.cells.set(d,f)}r<this.minX&&(this.minX=r),r>this.maxX&&(this.maxX=r),o<this.minY&&(this.minY=o),o>this.maxY&&(this.maxY=o),s<this.minZ&&(this.minZ=s),s>this.maxZ&&(this.maxZ=s),f.push(i+t)}if(a<=0){this.reportCapIfBound();return}let o=a<t;this.chunks.push({positions:o?e.slice(0,a*3):e,classifications:n?o?n.slice(0,a):n:null,count:a,startId:i}),this.total+=a,this.reportCapIfBound()}getBounds(){return this.total===0||!Number.isFinite(this.minX)?null:{min:{x:this.minX,y:this.minY,z:this.minZ},max:{x:this.maxX,y:this.maxY,z:this.maxZ}}}chunkFor(e){let t=this.chunks,n=0,r=t.length-1;for(;n<r;){let i=n+r+1>>1;t[i].startId<=e?n=i:r=i-1}let i=t[n];return i&&e>=i.startId&&e<i.startId+i.count?i:null}testPoint(e,t,n,r,i){let a=e.x-t.x,o=e.y-t.y,s=e.z-t.z,c=a*n.x+o*n.y+s*n.z;if(c<0||c>r)return null;let l=t.x+n.x*c,u=t.y+n.y*c,d=t.z+n.z*c,f=e.x-l,p=e.y-u,m=e.z-d;return Math.sqrt(f*f+p*p+m*m)>i(c)?null:{position:e,distance:c}}testCellNeighborhood(e,t,n,r,i,a,o,s,c,l,u,d=-1,f=1){let p=r,m=f*p,h=d===0?m:-p,g=d===0?m:p,_=d===1?m:-p,v=d===1?m:p,y=d===2?m:-p,b=d===2?m:p;for(let r=h;r<=g;r++)for(let f=_;f<=v;f++)for(let p=y;p<=b;p++){let m=this.packKey(e+r,t+f,n+p);if(d===-1){if(l.has(m))continue;l.add(m)}let h=this.cells.get(m);if(h)for(let e of h){let t=this.chunkFor(e);if(!t)continue;let n=e-t.startId;if(!qo(c,t.classifications?t.classifications[n]:0))continue;let r=n*3,l={x:t.positions[r],y:t.positions[r+1],z:t.positions[r+2]},d=this.testPoint(l,i,a,o,s);d&&(!u.hit||d.distance<u.hit.distance)&&(u.hit=d)}}}queryRay(e,t,n,r,i){if(this.total===0||n<=0)return null;let a=this.getBounds();if(!a)return null;let o=this.cellSize,s=4*o,c=Jo(e,t,{min:{x:a.min.x-s,y:a.min.y-s,z:a.min.z-s},max:{x:a.max.x+s,y:a.max.y+s,z:a.max.z+s}});if(!c)return null;let l=Math.max(0,c.tMin),u=Math.min(n,c.tMax);if(u<l)return null;let d=e.x+t.x*l,f=e.y+t.y*l,p=e.z+t.z*l,m=Math.floor(d/o),h=Math.floor(f/o),g=Math.floor(p/o),_=t.x>0?1:t.x<0?-1:0,v=t.y>0?1:t.y<0?-1:0,y=t.z>0?1:t.z<0?-1:0,b=(e,t,n)=>t===0?1/0:((t>0?(n+1)*o:n*o)-e)/t,x=e=>e===0?1/0:Math.abs(o/e),S=b(e.x,t.x,m),C=b(e.y,t.y,h),w=b(e.z,t.z,g),T=x(t.x),E=x(t.y),D=x(t.z),O={hit:null},k=new Set,A=l,j=1,M=Math.min(Wo,8+Math.ceil((u-l)/o)*3),N=-1,P=1,F=0;for(let n=0;n<M&&A<=u;n++){let n=r(Math.max(0,A)),a=Math.min(4,Math.max(1,Math.ceil(n/o)));a>j&&(j=a);let s=a===F?N:-1;this.testCellNeighborhood(m,h,g,a,e,t,u,r,i,k,O,s,P),F=a;let c=(j+1)*o*Go;if(O.hit&&A>O.hit.distance+c)break;S<C?S<w?(A=S,m+=_,S+=T,N=0,P=_<0?-1:1):(A=w,g+=y,w+=D,N=2,P=y<0?-1:1):C<w?(A=C,h+=v,C+=E,N=1,P=v<0?-1:1):(A=w,g+=y,w+=D,N=2,P=y<0?-1:1)}return O.hit}dispose(){this.cells.clear(),this.chunks=[],this.total=0,this.cellsExhausted=!1,this.minX=this.minY=this.minZ=1/0,this.maxX=this.maxY=this.maxZ=-1/0,this.cellOriginX=this.cellOriginY=this.cellOriginZ=0,this.hasCellOrigin=!1}};function Xo(e,t){e.keyedIndexes??=new Map;let n=e.keyedIndexes.get(t);return n||(n=new Yo,e.keyedIndexes.set(t,n)),n}function Zo(e,t){let n=0,r=[];for(let i of e.chunks)i.key===t?(i.vertexBuffer.destroy(),i.deviationBuffer.destroy(),n+=i.pointCount):r.push(i);e.chunks=r,e.pointCount-=n;let i=e.keyedIndexes?.get(t);return i&&(i.dispose(),e.keyedIndexes?.delete(t)),n}function Qo(e){if(e.keyedIndexes){for(let t of e.keyedIndexes.values())t.dispose();e.keyedIndexes.clear()}}function $o(e){if(!e||e.length!==16)return!1;for(let t=0;t<16;t++)if(!Number.isFinite(e[t]))return!1;return!0}function es(e,t){if(!$o(t))return e;let n=[1/0,1/0,1/0],r=[-1/0,-1/0,-1/0];for(let i=0;i<8;i++){let a=i&1?e.max[0]:e.min[0],o=i&2?e.max[1]:e.min[1],s=i&4?e.max[2]:e.min[2],c=t[0]*a+t[4]*o+t[8]*s+t[12],l=t[1]*a+t[5]*o+t[9]*s+t[13],u=t[2]*a+t[6]*o+t[10]*s+t[14];c<n[0]&&(n[0]=c),l<n[1]&&(n[1]=l),u<n[2]&&(n[2]=u),c>r[0]&&(r[0]=c),l>r[1]&&(r[1]=l),u>r[2]&&(r[2]=u)}return{min:n,max:r}}function ts(e,t,n){let r=t.createUniformBuffer();return{meta:n,uniformBuffer:r,bindGroup:t.createBindGroup(r),chunks:[],bounds:{min:[1/0,1/0,1/0],max:[-1/0,-1/0,-1/0]},pointCount:0,spatialIndex:new Yo}}var ns=3,rs=0;function is(e,t,n,r){let i=n.pointCount;if(i<=0)return;(r===void 0?t.spatialIndex:Xo(t,r)).insertRange(n.positions,i,n.classifications??null);let a=Math.min(e.limits.maxBufferSize,e.limits.maxStorageBufferBindingSize),o=Math.floor(a*.95/24),s=e.limits.maxComputeWorkgroupsPerDimension*64,c=Math.max(1,Math.min(o,s));for(let a=0;a<i;a+=c)as(e,t,n,a,Math.min(c,i-a),r)}function as(e,t,n,r,i,a){let o=new ArrayBuffer(i*24),s=new Float32Array(o),c=new Uint8Array(o),l=new Uint32Array(o),u=n.positions,d=n.colors,f=n.classifications,p=n.intensities,m=t.meta.expressId>>>0;for(let e=0;e<i;e++){let t=r+e,n=e*6;s[n]=u[t*3],s[n+1]=u[t*3+1],s[n+2]=u[t*3+2];let i=e*24+12;d?(c[i]=ls(d[t*3])*255,c[i+1]=ls(d[t*3+1])*255,c[i+2]=ls(d[t*3+2])*255):(c[i]=200,c[i+1]=200,c[i+2]=200),c[i+3]=f?f[t]:0,l[e*6+4]=p?p[t]&65535:0,l[e*6+5]=m}if(rs<ns&&f){rs++;let e=[];for(let t=0;t<Math.min(8,i);t++)e.push(c[t*24+15]);console.log(`[pointcloud-debug] vertex-buffer chunk #${rs}: packed class bytes (offset +15) first8=[${e.join(`,`)}]`)}let h=e.createBuffer({size:o.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST|GPUBufferUsage.STORAGE});e.queue.writeBuffer(h,0,o);let g;try{g=e.createBuffer({size:i*4,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST|GPUBufferUsage.COPY_SRC})}catch(e){try{h.destroy()}catch(e){console.warn(`[PointCloud] failed to release vertexBuffer after a paired allocation failure`,e)}throw e}e.queue.writeBuffer(g,0,new Float32Array(i)),t.chunks.push({vertexBuffer:h,deviationBuffer:g,pointCount:i,bbox:n.bbox,...a===void 0?{}:{key:a}}),t.pointCount+=i,cs(t.bounds,n.bbox)}function os(e,t,n){let r=ts(e,t,{expressId:n.expressId,ifcType:n.ifcType,modelIndex:n.modelIndex});return is(e,r,{positions:n.chunk.positions,colors:n.chunk.colors,classifications:n.chunk.classifications,intensities:n.chunk.intensities,pointCount:n.chunk.pointCount,bbox:n.chunk.bbox}),r}function ss(e){for(let t of e.chunks)t.vertexBuffer.destroy(),t.deviationBuffer.destroy();e.uniformBuffer.destroy(),e.chunks=[],e.pointCount=0,e.spatialIndex.dispose(),Qo(e)}function cs(e,t){t.min[0]<e.min[0]&&(e.min[0]=t.min[0]),t.min[1]<e.min[1]&&(e.min[1]=t.min[1]),t.min[2]<e.min[2]&&(e.min[2]=t.min[2]),t.max[0]>e.max[0]&&(e.max[0]=t.max[0]),t.max[1]>e.max[1]&&(e.max[1]=t.max[1]),t.max[2]>e.max[2]&&(e.max[2]=t.max[2])}function ls(e){return e<0?0:e>1?1:e}function us(e,t,n){for(let[r,i]of e)(n===void 0||t.get(r)===n)&&(ss(i),e.delete(r),t.delete(r));n===void 0&&t.clear()}function ds(e,t){let n=[];for(let r of e){let e=r.keyedIndexes?[r.spatialIndex,...r.keyedIndexes.values()]:[r.spatialIndex];for(let i of e)i.pointCount!==0&&n.push({expressId:r.meta.expressId,modelIndex:r.meta.modelIndex,index:i,model:r.placement??r.model,classMask:t})}return n}function fs(e){let t=Math.hypot(e[0],e[1],e[2]),n=Math.hypot(e[4],e[5],e[6]),r=Math.hypot(e[8],e[9],e[10]),i=(t+n+r)/3;return i>1e-12?i:1}function ps(e){for(let t=0;t<16;t++){let n=+(t%5==0);if(Math.abs(e[t]-n)>1e-6)return!1}return!0}function ms(e,t,n){if(!$o(n)||ps(n))return null;let r=n[0]*(n[5]*n[10]-n[9]*n[6])-n[4]*(n[1]*n[10]-n[9]*n[2])+n[8]*(n[1]*n[6]-n[5]*n[2]);if(!Number.isFinite(r)||Math.abs(r)<=1e-18)return null;let i=1/r,a=(n[5]*n[10]-n[9]*n[6])*i,o=(n[8]*n[6]-n[4]*n[10])*i,s=(n[4]*n[9]-n[8]*n[5])*i,c=(n[9]*n[2]-n[1]*n[10])*i,l=(n[0]*n[10]-n[8]*n[2])*i,u=(n[8]*n[1]-n[0]*n[9])*i,d=(n[1]*n[6]-n[5]*n[2])*i,f=(n[4]*n[2]-n[0]*n[6])*i,p=(n[0]*n[5]-n[4]*n[1])*i,m=n[12],h=n[13],g=n[14],_=-(a*m+o*h+s*g),v=-(c*m+l*h+u*g),y=-(d*m+f*h+p*g),b=a*e.x+o*e.y+s*e.z+_,x=c*e.x+l*e.y+u*e.z+v,S=d*e.x+f*e.y+p*e.z+y,C=a*t.x+o*t.y+s*t.z,w=c*t.x+l*t.y+u*t.z,T=d*t.x+f*t.y+p*t.z,E=Math.hypot(C,w,T);if(!(E>1e-12))return null;let D=n;return{origin:{x:b,y:x,z:S},direction:{x:C/E,y:w/E,z:T/E},distanceScale:fs(D),toWorld:e=>({x:D[0]*e.x+D[4]*e.y+D[8]*e.z+D[12],y:D[1]*e.x+D[5]*e.y+D[9]*e.z+D[13],z:D[2]*e.x+D[6]*e.y+D[10]*e.z+D[14]})}}var hs=8;function gs(e,t){return t.orthoHalfHeight!==void 0&&t.orthoHalfHeight!==null?hs/t.canvasHeightPx*(2*t.orthoHalfHeight):la(hs,e,t.fov,t.canvasHeightPx)}function _s(e,t,n,r){let i=t.position,a=(i.x-n.origin.x)*n.direction.x+(i.y-n.origin.y)*n.direction.y+(i.z-n.origin.z)*n.direction.z;return e.distance+gs(e.distance,r)<a}function vs(e){return e?e.snapToPointClouds===void 0?(e.snapToVertices??!0)||(e.snapToEdges??!0)||(e.snapToFaces??!0):e.snapToPointClouds:!0}function ys(e,t,n,r,i){if(!e||r<=0)return null;let a=e();if(a.length===0)return null;let o=e=>gs(e,n),s=null,c,l=null,u=!1;for(let e of a){if(i?.hiddenIds?.has(e.expressId)||i?.isolatedIds!==null&&i?.isolatedIds!==void 0&&!i.isolatedIds.has(e.expressId))continue;let n=s?Math.min(r,s.distance):r;(!u||e.model!==c)&&(l=ms(t.origin,t.direction,e.model),c=e.model,u=!0);let a=l;if(!a){let r=e.index.queryRay(t.origin,t.direction,n,o,e.classMask);r&&(!s||r.distance<s.distance)&&(s={position:r.position,expressId:e.expressId,modelIndex:e.modelIndex,distance:r.distance});continue}let d=a.distanceScale,f=e.index.queryRay(a.origin,a.direction,n/d,e=>o(e*d)/d,e.classMask);if(f){let t=f.distance*d;(!s||t<s.distance)&&(s={position:a.toWorld(f.position),expressId:e.expressId,modelIndex:e.modelIndex,distance:t})}}return s}function bs(e){let{pointHit:t,meshSnapTarget:n,meshIntersectionDistance:r,camera:i}=e;if(!n||r===null)return!0;let a=gs(t.distance,i);return t.distance<r-a}function xs(){return{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}}var Ss=class{camera;scene;canvas;raycaster;snapDetector;bvh;pointCloudProvider=null;sourceSnapCurves=[];bvhCache=null;BVH_THRESHOLD=100;constructor(e,t,n){this.camera=e,this.scene=t,this.canvas=n,this.raycaster=new aa,this.snapDetector=new ka,this.bvh=new Aa}rayHitsBounds(e,t){let n=[e.origin.x,e.origin.y,e.origin.z],r=[e.direction.x,e.direction.y,e.direction.z],i=[t.min.x,t.min.y,t.min.z],a=[t.max.x,t.max.y,t.max.z],o=-1/0,s=1/0;for(let e=0;e<3;e++)if(Math.abs(r[e])<1e-12){if(n[e]<i[e]||n[e]>a[e])return!1}else{let t=1/r[e],c=(i[e]-n[e])*t,l=(a[e]-n[e])*t;if(c>l){let e=c;c=l,l=e}if(c>o&&(o=c),l<s&&(s=l),o>s)return!1}return s>=Math.max(o,0)}collectVisibleMeshData(e,t){let n=[],r=this.scene.getMeshes(),i=this.scene.getBatchedMeshes(),a=new Set,o=new Set,s=new Set,c=(t,r)=>{let i=`${t}:${r??`any`}`;if(a.has(i))return;a.add(i);let s=this.scene.getMeshDataPieces(t,r);if(s)for(let t of s)Q(t.expressId,e?.hiddenIds,e?.isolatedIds)&&(o.has(t)||(o.add(t),n.push(t)))};for(let e of r)c(e.expressId,e.modelIndex);for(let e of this.scene.getTexturedMeshes?.()??[])c(e.expressId,e.modelIndex);for(let e of i)for(let t=0;t<e.expressIds.length;t++)c(e.expressIds[t],e.modelIndices?.[t]);if(t)for(let r of this.scene.getInstancedEntityIds()){if(!Q(r,e?.hiddenIds,e?.isolatedIds))continue;let i=this.scene.getInstancedEntityBounds(r);if(!i||!this.rayHitsBounds(t,i))continue;let a=this.scene.getInstancedMeshDataPieces(r);if(a)for(let e=0;e<a.length;e++){let t=a[e],r=`${t.expressId}:inst:${e}`;s.has(r)||(s.add(r),n.push(t))}}return n}filterWithBVH(e,t){return e.length<=this.BVH_THRESHOLD?e:((!this.bvhCache||!this.bvhCache.isBuilt||this.bvhCache.meshCount!==e.length||this.bvhCache.meshData.some((t,n)=>t!==e[n]))&&(this.bvh.build(e),this.bvhCache={meshCount:e.length,meshData:e,isBuilt:!0}),this.bvh.getMeshesForRay(t,e).map(t=>e[t]))}cssViewport(){let e=this.canvas.getBoundingClientRect();return e.width===0||e.height===0?null:{width:e.width,height:e.height}}raycastScene(e,t,n,r){try{let i=this.cssViewport();if(!i)return null;let a=this.camera.unprojectToRay(e,t,i.width,i.height),o=this.collectVisibleMeshData(n,a);if(o.length===0)return null;let s=this.filterWithBVH(o,a),c=this.raycaster.raycast(a,s,e=>!po(r,e.point.x,e.point.y,e.point.z));if(!c)return null;let l;if(n?.snapOptions){let e=this.camera.getPosition(),t=this.camera.getFOV();l=this.snapDetector.detectSnapTarget(a,s,c,{position:e,fov:t},i.height,n.snapOptions,e=>!po(r,e.position.x,e.position.y,e.position.z))||void 0}return{intersection:c,snap:l}}catch(e){return console.error(`Raycast error:`,e),null}}raycastSceneMagnetic(e,t,n,r,i){try{let a=this.cssViewport();if(!a)return{intersection:null,snapTarget:null,edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}};let o=this.camera.unprojectToRay(e,t,a.width,a.height),s=this.collectVisibleMeshData(r,o),c=this.camera.getPosition(),l=this.camera.getFOV(),u=null,d={snapTarget:null,edgeLock:xs()};if(s.length>0){let e=this.filterWithBVH(s,o);u=this.raycaster.raycast(o,e),d=this.snapDetector.detectMagneticSnap(o,e,u,{position:c,fov:l},a.height,n,r?.snapOptions||{})}let f=Lo(this.sourceSnapCurves,d.snapTarget,this.camera,o,e,t,a,r,i);f&&(d={snapTarget:f,edgeLock:xs()});let p={fov:l,canvasHeightPx:a.height,orthoHalfHeight:this.camera.getProjectionMode()===`orthographic`?this.camera.getOrthoSize():null},m=u?u.distance:1/0,h=vs(r?.snapOptions)?ys(this.pointCloudProvider,o,p,m,r):null;if(h){let e=d.snapTarget?.metadata?.sourceCurve?d.snapTarget:null;(e?_s(h,e,o,p):bs({pointHit:h,meshSnapTarget:d.snapTarget,meshIntersectionDistance:u?u.distance:null,camera:p}))&&(d={snapTarget:{type:Da.POINT_CLOUD,position:h.position,expressId:h.expressId,confidence:1},edgeLock:xs()})}return{intersection:u,...d}}catch(e){return console.error(`Magnetic raycast error:`,e),{intersection:null,snapTarget:null,edgeLock:{edge:null,meshExpressId:null,edgeT:0,shouldLock:!1,shouldRelease:!0,isCorner:!1,cornerValence:0}}}}invalidateBVHCache(){this.bvhCache=null}getRaycaster(){return this.raycaster}getSnapDetector(){return this.snapDetector}setPointCloudProvider(e){this.pointCloudProvider=e}setSourceSnapCurves(e){this.sourceSnapCurves=[...e]}clearCaches(){this.invalidateBVHCache(),this.snapDetector.clearCache()}};function Cs(e){let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0;for(let s of e){let e=s.positions,c=s.origin?.[0]??0,l=s.origin?.[1]??0,u=s.origin?.[2]??0;for(let s=0;s<e.length;s+=3){let d=e[s]+c,f=e[s+1]+l,p=e[s+2]+u;d<t&&(t=d),f<n&&(n=f),p<r&&(r=p),d>i&&(i=d),f>a&&(a=f),p>o&&(o=p)}}return{minX:t,minY:n,minZ:r,maxX:i,maxY:a,maxZ:o}}function ws(e){let{minX:t,minY:n,minZ:r,maxX:i,maxY:a,maxZ:o}=Cs(e);return Number.isFinite(t)?[(t+i)/2,(n+a)/2,(r+o)/2]:[0,0,0]}function Ts(e,t){let n=(e,t,n,r,i,a,o,s,c)=>{let l=r-e,u=i-t,d=a-n,f=o-e,p=s-t,m=c-n,h=u*m-d*p,g=d*f-l*m,_=l*p-u*f;return h*h+g*g+_*_};for(let r of e){let e=r.positions,i=(r.origin?.[0]??0)-t[0],a=(r.origin?.[1]??0)-t[1],o=(r.origin?.[2]??0)-t[2];for(let t=0;t+2<r.indices.length;t+=3){let s=r.indices[t]*3,c=r.indices[t+1]*3,l=r.indices[t+2]*3,u=n(e[s],e[s+1],e[s+2],e[c],e[c+1],e[c+2],e[l],e[l+1],e[l+2]);if(!(Number.isFinite(u)&&u>0))continue;let d=n(Math.fround(e[s]+i),Math.fround(e[s+1]+a),Math.fround(e[s+2]+o),Math.fround(e[c]+i),Math.fround(e[c+1]+a),Math.fround(e[c+2]+o),Math.fround(e[l]+i),Math.fround(e[l+1]+a),Math.fround(e[l+2]+o));if(!(Number.isFinite(d)&&d>0))return!1}}return!0}function Es(e,t,n,r=void 0){for(let i of[t,n,r])if(i&&Ts(e,i))return i;let i=ws(e);if(Ts(e,i))return i;let a=e[0]?.origin??[0,0,0];return a.every(e=>Number.isFinite(Math.fround(e)))&&Ts(e,a)?a:void 0}function Ds(e){if(!e||e.length===0)return null;let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=!1;for(let c of e){let e=c.positions,l=c.origin?c.origin[0]:0,u=c.origin?c.origin[1]:0,d=c.origin?c.origin[2]:0;for(let c=0;c+2<e.length;c+=3){let f=e[c]+l,p=e[c+1]+u,m=e[c+2]+d;Number.isFinite(f)&&Number.isFinite(p)&&Number.isFinite(m)&&(s=!0,f<t&&(t=f),p<n&&(n=p),m<r&&(r=m),f>i&&(i=f),p>a&&(a=p),m>o&&(o=m))}}return s?{min:{x:t,y:n,z:r},max:{x:i,y:a,z:o}}:null}var Os=0xffffff,ks=!1;function As(e){if(!e)return 0;let t=(Math.round((e[0]??0)*255)&255)>>>0,n=(Math.round((e[1]??0)*255)&255)>>>0,r=(Math.round((e[2]??0)*255)&255)>>>0;return(Math.imul(t,0x466f45d)^Math.imul(n,0x127409f)^Math.imul(r,0x4f9ffb7))>>>0&255}function js(e,t){return(e>>>0&0xffffff|(t&255)<<24)>>>0}function $(e){e.vertexBuffer.destroy(),e.indexBuffer.destroy(),e.uniformBuffer&&e.uniformBuffer.destroy(),e.lod1IndexBuffer&&e.lod1IndexBuffer.destroy()}function Ms(e,n){let r=0,i=0;for(let t of e)r+=t.positions.length/3,i+=t.indices.length;t(`render.mergeGeometry`,r,`vertices`);let a=new ArrayBuffer(r*7*4),o=new Float32Array(a),s=new Uint32Array(a),c=new Uint32Array(i),{minX:l,minY:u,minZ:d,maxX:f,maxY:p,maxZ:m}=Cs(e),h=n??(Number.isFinite(l)?[(l+f)/2,(u+p)/2,(d+m)/2]:[0,0,0]),g=0,_=0;for(let t of e){let e=t.positions,n=t.normals,r=e.length/3,i=(t.origin?t.origin[0]:0)-h[0],a=(t.origin?t.origin[1]:0)-h[1],l=(t.origin?t.origin[2]:0)-h[2],u=_*7,d=t.entityIds,f=t.expressId>>>0;!d&&f>Os&&(ks||(ks=!0,console.warn(`[Renderer] expressId exceeds 24-bit seam-ID encoding range; seam lines may collide.`)),f&=Os);let p=As(t.color),m=n.length>0;for(let t=0;t<r;t++){let r=t*3;o[u++]=e[r]+i,o[u++]=e[r+1]+a,o[u++]=e[r+2]+l,o[u++]=m?n[r]:0,o[u++]=m?n[r+1]:0,o[u++]=m?n[r+2]:0,s[u++]=js(d?d[t]:f,p)}let v=t.indices,y=v.length;for(let e=0;e<y;e++)c[g+e]=v[e]+_;_+=r,g+=y}return{vertexData:o,indices:c,bounds:{min:[l,u,d],max:[f,p,m]},origin:h}}function Ns(e,t){let n=0,r=0;for(let t of e)n+=t.positions.length/3*X.BYTES_PER_VERTEX,r+=t.indices.length*X.BYTES_PER_INDEX;if(n<=t&&r<=t)return[e];let i=[],a=[],o=0,s=0;for(let n of e){let e=n.positions.length/3*X.BYTES_PER_VERTEX,r=n.indices.length*X.BYTES_PER_INDEX;a.length>0&&(o+e>t||s+r>t)&&(i.push(a),a=[],o=0,s=0),a.push(n),o+=e,s+=r}return a.length>0&&i.push(a),i}function Ps(e,t,n){let r=n.get(e);if(r)return r;let i=Ds(t);return i&&n.set(e,i),i}var Fs=[0,0,0];function Is(e,t){return!e&&!t?!0:!e||!t?!1:e.angle===t.angle&&e.px===t.px&&e.pz===t.pz}function Ls(e,t){if(!Number.isSafeInteger(e)||e<0||t.length!==3||!t.every(e=>Number.isFinite(e)&&Number.isFinite(Math.fround(e))))throw Error(`Model translation requires a model index and three finite coordinates.`)}function Rs(e,t){return[e[0]+t[0],e[1]+t[1],e[2]+t[2]]}function zs(e,t){return[e[0]-t[0],e[1]-t[1],e[2]-t[2]]}function Bs(e,t){return{min:Rs(e.min,t),max:Rs(e.max,t)}}var Vs=class{authored=new WeakMap;offsets=new Map;yaws=new Map;meshes=new WeakMap;batches=new WeakMap;instances=new WeakMap;releasedBounds=new WeakMap;releasedEntities=new Map;get(e=0){return this.offsets.get(e)??Fs}set(e,t){return Ls(e,t),!this.get(e).every((e,n)=>e===t[n])&&(this.offsets.set(e,[...t]),!0)}getYaw(e=0){let t=this.yaws.get(e);return t?{...t}:null}setYaw(e,t){if(t&&(!Number.isFinite(t.angle)||!Number.isFinite(t.px)||!Number.isFinite(Math.fround(t.px))||!Number.isFinite(t.pz)||!Number.isFinite(Math.fround(t.pz))))throw Error(`Model rotation requires a finite angle and pivot.`);let n=t&&t.angle!==0?{angle:t.angle,px:t.px,pz:t.pz}:null;return!Is(this.getYaw(e),n)&&(n?this.yaws.set(e,n):this.yaws.delete(e),!0)}placeMesh(e){let t=this.meshes.get(e);t||(t={source:e,placed:{...e}},this.meshes.set(e,t),this.meshes.set(t.placed,t));let n=this.get(t.source.modelIndex);t.placed.origin=Rs(t.source.origin??Fs,n),t.source.localToWorld&&(t.placed.localToWorld=t.source.localToWorld.map((e,t)=>t===3?e+n[0]:t===7?e+n[1]:t===11?e+n[2]:e));let r=t.source.geometryAabb;return r&&(t.placed.geometryAabb={...r,min:Rs(r.min,n),max:Rs(r.max,n)}),t.placed}placeAuthoredMesh(e){if(e.hydrated)return;let t=this.get(e.modelIndex),n=e.transform.m,r=this.authored.get(e);if(!r){let t=[n[12],n[13],n[14]];r={base:t,written:[...t],offset:Fs,bounds:e.bounds?Bs(e.bounds,Fs):void 0,writtenBounds:e.bounds?Bs(e.bounds,Fs):void 0},this.authored.set(e,r)}if(!r.offset.every((e,n)=>e===t[n])){for(let e=0;e<3;e++)r.base[e]+=n[12+e]-r.written[e],n[12+e]=r.base[e]+t[e],r.written[e]=n[12+e];if(!e.bounds)r.bounds=void 0;else if(!r.bounds||!r.writtenBounds)r.bounds=Bs(e.bounds,r.offset.map(e=>-e));else for(let t of[`min`,`max`])for(let n=0;n<3;n++)r.bounds[t][n]+=e.bounds[t][n]-r.writtenBounds[t][n];r.bounds&&(e.bounds=Bs(r.bounds,t)),r.writtenBounds=e.bounds?Bs(e.bounds,Fs):void 0,r.offset=t}}sourceFromPlaced(e){let t=this.meshes.get(e);if(t)return t.source;let n=this.get(e.modelIndex),r={...e,origin:zs(e.origin??Fs,n)};e.localToWorld&&(r.localToWorld=e.localToWorld.map((e,t)=>t===3?e-n[0]:t===7?e-n[1]:t===11?e-n[2]:e)),e.geometryAabb&&(r.geometryAabb={...e.geometryAabb,min:zs(e.geometryAabb.min,n),max:zs(e.geometryAabb.max,n)});let i={source:r,placed:e};return this.meshes.set(r,i),this.meshes.set(e,i),r}sourceMesh(e){return this.meshes.get(e)?.source??e}forgetEntityBounds(e){this.releasedEntities.delete(e)}clearFlatBounds(){this.releasedEntities.clear(),this.releasedBounds=new WeakMap}retainEntityBounds(e){for(let[t,n]of e){let e=new Map;for(let t of n){let n=this.sourceMesh(t),r=n.modelIndex??0,i=e.get(r)??[];i.push(n),e.set(r,i)}let r=new Map;for(let[t,n]of e){let e=Ds(n);e&&r.set(t,e)}this.releasedEntities.set(t,r)}}releasedEntityIds(e){return[...this.releasedEntities].filter(([,t])=>t.has(e)).map(([e])=>e)}releasedEntityBounds(e){let t={min:{x:1/0,y:1/0,z:1/0},max:{x:-1/0,y:-1/0,z:-1/0}};for(let[n,r]of this.releasedEntities.get(e)??[]){let e=this.get(n);for(let[n,i]of[[`x`,0],[`y`,1],[`z`,2]])t.min[n]=Math.min(t.min[n],r.min[n]+e[i]),t.max[n]=Math.max(t.max[n],r.max[n]+e[i])}return Number.isFinite(t.min.x)?t:void 0}sourceDrawableBounds(e){return this.batches.get(e)?.bounds??e.bounds}placeReleasedBounds(e,t,n){let r=this.releasedBounds.get(e)??{min:zs([e.min.x,e.min.y,e.min.z],t),max:zs([e.max.x,e.max.y,e.max.z],t)},i=Bs(r,this.get(n)),a={min:{x:i.min[0],y:i.min[1],z:i.min[2]},max:{x:i.max[0],y:i.max[1],z:i.max[2]}};return this.releasedBounds.set(a,r),a}frameOrigin(e,t=0){return e?Rs(e,this.get(t)):void 0}registerDrawable(e,t){let n=this.get(t);return this.batches.set(e,{modelIndex:t,origin:zs(e.origin??Fs,n),bounds:e.bounds?Bs(e.bounds,[-n[0],-n[1],-n[2]]):void 0}),e}moveDrawable(e){let t=this.batches.get(e);if(!t)return;let n=this.get(t.modelIndex);e.origin=Rs(t.origin,n),t.bounds&&(e.bounds=Bs(t.bounds,n))}placeInstances(e,t,n,r,i){let a=this.get(t),o=this.getYaw(t),s=e.byteLength/n,c=new DataView(e),l=this.instances.get(e);if(!l){let t=new Float64Array(s*12),i=new Float32Array(s*12);for(let e=0;e<s;e++)for(let r=0;r<4;r++)for(let a=0;a<3;a++){let o=e*12+r*3+a;t[o]=i[o]=c.getFloat32(e*n+r*16+a*4,!0)}l={base:t,written:i,...r?.length===s*3?{anchorBase:r.slice(),writtenAnchors:r.slice()}:{},offset:Fs,yaw:null},this.instances.set(e,l)}if(l.offset.every((e,t)=>e===a[t])&&Is(l.yaw,o))return!1;let u=l.yaw?Math.cos(l.yaw.angle):1,d=l.yaw?Math.sin(l.yaw.angle):0,f=o?Math.cos(o.angle):1,p=o?Math.sin(o.angle):0,m=o?.px??0,h=o?.pz??0;for(let e=0;e<s;e++){let t=e*12,g=e*n+48,_=c.getFloat32(g,!0)-l.written[t+9],v=c.getFloat32(g+4,!0)-l.written[t+10],y=c.getFloat32(g+8,!0)-l.written[t+11];l.base[t+9]+=_*u-y*d,l.base[t+10]+=v,l.base[t+11]+=_*d+y*u;for(let r=0;r<3;r++){let i=t+r*3,a=l.base[i],s=l.base[i+1],u=l.base[i+2],d=o?a*f+u*p:a,m=o?-a*p+u*f:u,h=e*n+r*16;c.setFloat32(h,d,!0),c.setFloat32(h+4,s,!0),c.setFloat32(h+8,m,!0),l.written[i]=d,l.written[i+1]=s,l.written[i+2]=m}let b=l.base[t+9],x=l.base[t+10],S=l.base[t+11],C=b-m,w=S-h,T=(o?m+C*f+w*p:b)+a[0],E=x+a[1],D=(o?h-C*p+w*f:S)+a[2];c.setFloat32(g,T,!0),c.setFloat32(g+4,E,!0),c.setFloat32(g+8,D,!0);let O=e*3,k=l.anchorBase,A=l.writtenAnchors;if(k&&A&&r&&i&&r.length===s*3&&i.length===s*3){let e=r[O]-A[O],t=r[O+1]-A[O+1],n=r[O+2]-A[O+2];k[O]+=e*u-n*d,k[O+1]+=t,k[O+2]+=e*d+n*u;let s=k[O]-m,c=k[O+2]-h,l=(o?m+s*f+c*p:k[O])+a[0],g=k[O+1]+a[1],_=(o?h-s*p+c*f:k[O+2])+a[2];r[O]=l,r[O+1]=g,r[O+2]=_,i[O]=T,i[O+1]=E,i[O+2]=D,A[O]=l,A[O+1]=g,A[O+2]=_}l.written[t+9]=T,l.written[t+10]=E,l.written[t+11]=D}return l.offset=a,l.yaw=o,!0}clear(){this.offsets.clear(),this.yaws.clear(),this.authored=new WeakMap,this.meshes=new WeakMap,this.batches=new WeakMap,this.instances=new WeakMap,this.releasedBounds=new WeakMap,this.releasedEntities.clear()}},Hs=class{next;constructor(e=1){this.next=e}allocate(){return this.next++}current(){return this.next}},Us=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],Ws=class{placements=new WeakMap;entry(e){let t=this.placements.get(e);return t||(t={baseline:new Float64Array(e.placement??e.model??Us),translation:[0,0,0]},this.placements.set(e,t)),t}align(e,t){if(t&&(t.length!==16||!t.every(Number.isFinite)))throw Error(`Pointcloud placement needs a finite 4\xd74 matrix.`);let n={...this.entry(e),baseline:new Float64Array(t??Us)};this.apply(e,n),this.placements.set(e,n)}translate(e,t){if(t.length!==3||!t.every(Number.isFinite))throw Error(`Pointcloud translation needs three finite coordinates.`);let n={...this.entry(e),translation:[...t]};this.apply(e,n),this.placements.set(e,n)}validateTranslation(e,t){this.matrix({...this.entry(e),translation:t})}apply(e,t){let n=this.matrix(t);e.placement=n,e.rteOrigin=[n[12],n[13],n[14]],e.model=new Float32Array(n)}matrix(e){let t=new Float64Array(e.baseline);for(let n=0;n<3;n++)t[12+n]=e.baseline[12+n]+e.translation[n];if(!t.every(Number.isFinite)||!new Float32Array(t).every(Number.isFinite))throw Error(`Pointcloud placement exceeds the renderable coordinate range.`);return t}};function Gs(e){return e?.placement?new Float64Array(e.placement):void 0}function Ks(e){let t=[1/0,1/0,1/0],n=[-1/0,-1/0,-1/0];for(let r of e){if(!r||r.pointCount===0)continue;let e=es(r.bounds,r.placement??r.model);if([...e.min,...e.max].every(Number.isFinite))for(let r=0;r<3;r++)t[r]=Math.min(t[r],e.min[r]),n[r]=Math.max(n[r],e.max[r])}return Number.isFinite(t[0])?{min:t,max:n}:null}var qs=class{values=new Map;add(e){this.values.set(e,!0)}remove(e){this.values.delete(e)}clear(){this.values.clear()}visible(e){return this.values.get(e)!==!1}set(e,t,n){return!n||this.visible(e)===t?!1:(this.values.set(e,t),!0)}};function Js(e){let t=[];for(let n of e)n.pointCount!==0&&t.push({expressId:n.meta.expressId,modelIndex:n.meta.modelIndex,model:n.model,rteOrigin:n.rteOrigin,chunks:n.chunks.map(e=>({vertexBuffer:e.vertexBuffer,pointCount:e.pointCount}))});return t}function Ys(e,t){for(let[n,r]of e)if(r.meta.expressId>>>0==t>>>0)return{handle:{id:n},meta:r.meta};return null}function Xs(e){return!e||!e.enabled?{normal:[0,1,0],distance:0,enabled:!1}:e.flipped?{normal:[-e.normal[0],-e.normal[1],-e.normal[2]],distance:-e.distance,enabled:!0}:{normal:e.normal,distance:e.distance,enabled:!0}}function Zs(e){let t=new Uint32Array(8).fill(0xffffffff);if(e===void 0)return t;if(typeof e==`number`)return t[0]=Number.isFinite(e)?e>>>0:0xffffffff,t;for(let n=0;n<8&&n<e.length;n++){let r=e[n];Number.isFinite(r)&&(t[n]=r>>>0)}return t}var Qs={rgb:0,classification:1,intensity:2,height:3,fixed:4,deviation:5},$s={"fixed-px":0,"adaptive-world":1,attenuated:2};function ec(e,t,n,r,i){let a=t,o=n;a.set(i.viewProj.subarray(0,16),0);let s=[0,0,0];if($o(r.model)?(a.set(r.model,16),s=r.rteOrigin??[r.model[12],r.model[13],r.model[14]]):(a.fill(0,16,32),a[16]=1,a[21]=1,a[26]=1,a[31]=1),a[28]=0,a[29]=0,a[30]=0,a[31]=1,!i.relativeToEyeFrame.tryPackDrawableOrigin(s,a,32))return!1;let c=i.relativeToEyeFrame.getCameraWorld();a[40]=i.fixedColor[0],a[41]=i.fixedColor[1],a[42]=i.fixedColor[2],a[43]=i.fixedColor[3],a[44]=Qs[i.colorMode],a[45]=i.pointSize,a[46]=i.heightMin-c[1],a[47]=i.heightMax-c[1],a[48]=$s[i.sizeMode],a[49]=i.worldRadius,a[50]=i.viewportW,a[51]=i.viewportH,a[52]=i.sectionNormal[0],a[53]=i.sectionNormal[1],a[54]=i.sectionNormal[2],a[55]=M(i.sectionDist,i.sectionNormal,c),o[56]=r.meta.expressId>>>0,o[57]=+!!i.sectionEnabled,o[58]=+!!i.roundShape,o[59]=+!!i.clipBox?.enabled,o[60]=i.previewStride>>>0,o[61]=0,o[62]=0,o[63]=0,a[64]=i.deviationCenterOffset,a[65]=i.deviationHalfRange,a[66]=0,a[67]=0;for(let e=0;e<8;e++)o[68+e]=i.classMask[e]??0xffffffff;return N(i.clipBox,c,a,76),te(i.extraPlanes,c,a,84),e.queue.writeBuffer(r.uniformBuffer,0,a,0,yr/4),!0}var tc=class{device;pipeline;placements=new Ws;modelTranslations=new Map;nodes=new Map;nodeOwners=new Map;visibility=new qs;handleIds;uniformScratch=new Float32Array(yr/4);uniformScratchU32=new Uint32Array(this.uniformScratch.buffer);options={colorMode:`rgb`,fixedColor:[1,1,1,1],pointSize:4,sizeMode:`attenuated`,worldRadius:.02,roundShape:!0,classMask:Zs(void 0),previewStride:1,deviationRange:{centerOffset:0,halfRange:.05}};constructor(e,t,n,r,i=1){this.device=e,this.pipeline=new br(e,t,n,r),this.handleIds=new Hs(i)}setOptions(e){if(e.colorMode!==void 0&&(this.options.colorMode=e.colorMode),e.fixedColor!==void 0&&(this.options.fixedColor=e.fixedColor),e.pointSize!==void 0&&(this.options.pointSize=e.pointSize),e.sizeMode!==void 0&&(this.options.sizeMode=e.sizeMode),e.worldRadius!==void 0&&(this.options.worldRadius=e.worldRadius),e.roundShape!==void 0&&(this.options.roundShape=e.roundShape),e.classMask!==void 0&&(this.options.classMask=Zs(e.classMask)),e.previewStride!==void 0){let t=Math.max(1,Math.min(256,Math.floor(e.previewStride)||1));this.options.previewStride=t}if(e.deviationRange!==void 0){let t=e.deviationRange;this.options.deviationRange={centerOffset:Number.isFinite(t.centerOffset)?t.centerOffset:0,halfRange:Number.isFinite(t.halfRange)&&t.halfRange>0?t.halfRange:1e-6}}}getOptions(){return{...this.options,classMask:this.options.classMask.slice()}}setAssets(e){this.clearOwner(`ifcx`);for(let t of e)t.chunk.pointCount!==0&&this.addAsset(t)}addAsset(e){let t=os(this.device,this.pipeline,e),n=this.handleIds.allocate();return this.nodes.set(n,t),this.nodeOwners.set(n,`ifcx`),this.visibility.add(n),this.placements.translate(t,this.modelTranslations.get(e.modelIndex??0)??[0,0,0]),{id:n}}beginAsset(e){let t=ts(this.device,this.pipeline,e),n=this.handleIds.allocate();return this.nodes.set(n,t),this.nodeOwners.set(n,`streamed`),this.visibility.add(n),{id:n}}appendChunk(e,t,n){let r=this.nodes.get(e.id);r?is(this.device,r,t,n):console.warn(`[PointCloudRenderer] appendChunk: no node for handle ${e.id}`)}removeChunk(e,t){let n=this.nodes.get(e.id);return n?Zo(n,t):0}endAsset(e){}removeAsset(e){let t=this.nodes.get(e.id);t&&(ss(t),this.nodes.delete(e.id),this.nodeOwners.delete(e.id),this.visibility.remove(e.id))}relabelAsset(e,t,n){let r=this.nodes.get(e.id);r&&(r.meta.expressId=t>>>0,n!==void 0&&(r.meta.modelIndex=n))}setAssetTransform(e,t){let n=this.nodes.get(e.id);n&&this.placements.align(n,t)}setAssetTranslation(e,t){let n=this.nodes.get(e.id);n&&this.placements.translate(n,t)}setAssetVisible(e,t){return this.visibility.set(e.id,t,this.nodes.has(e.id))}validateModelTranslation(e,t){Ls(e,t);for(let[n,r]of this.nodes)this.nodeOwners.get(n)===`ifcx`&&(r.meta.modelIndex??0)===e&&this.placements.validateTranslation(r,t)}setModelTranslation(e,t){this.validateModelTranslation(e,t),this.modelTranslations.set(e,[...t]);for(let[n,r]of this.nodes)this.nodeOwners.get(n)===`ifcx`&&(r.meta.modelIndex??0)===e&&this.placements.translate(r,t)}getAssetTransform(e){let t=this.nodes.get(e.id)?.model;return t?new Float32Array(t):void 0}getAssetPlacement(e){return Gs(this.nodes.get(e.id))}getPlacementBounds(e,t){return Ks(t?this.visibility.visible(t.id)?[this.nodes.get(t.id)]:[]:[...this.nodes].filter(([t,n])=>this.visibility.visible(t)&&this.nodeOwners.get(t)===`ifcx`&&(n.meta.modelIndex??0)===e).map(([,e])=>e))}clear(){us(this.nodes,this.nodeOwners),this.visibility.clear()}clearOwner(e){for(let[t,n]of this.nodeOwners)n===e&&this.visibility.remove(t);us(this.nodes,this.nodeOwners,e)}hasAssets(){return this.nodes.size>0}getNodeCount(){return this.nodes.size}getInternalNodes(){return this.nodes.values()}getPointCount(){let e=0;for(let t of this.nodes.values())e+=t.pointCount;return e}getBounds(){return Ks(this.visibleNodes())}draw(e,t){if(this.nodes.size===0)return;e.setPipeline(this.pipeline.getPipeline());let{normal:n,distance:r,enabled:i}=Xs(t.sectionPlane),a=this.getBounds(),o=a?a.min[1]:0,s=a?a.max[1]:1,c=Math.max(1,t.viewport?.width??1),l=Math.max(1,t.viewport?.height??1);for(let[a,u]of this.nodes)if(this.visibility.visible(a)&&ec(this.device,this.uniformScratch,this.uniformScratchU32,u,{viewProj:t.viewProj,relativeToEyeFrame:t.relativeToEyeFrame,fixedColor:this.options.fixedColor,colorMode:this.options.colorMode,sizeMode:this.options.sizeMode,pointSize:this.options.pointSize,worldRadius:this.options.worldRadius,roundShape:this.options.roundShape,sectionNormal:n,sectionDist:r,sectionEnabled:i,clipBox:t.clipBox,extraPlanes:t.extraPlanes,heightMin:o,heightMax:s,viewportW:c,viewportH:l,classMask:this.options.classMask,previewStride:this.options.previewStride,deviationCenterOffset:this.options.deviationRange.centerOffset,deviationHalfRange:this.options.deviationRange.halfRange})){e.setBindGroup(0,u.bindGroup);for(let t of u.chunks)e.setVertexBuffer(0,t.vertexBuffer),e.setVertexBuffer(1,t.deviationBuffer),e.draw(6,t.pointCount,0,0)}}resolvePick(e){return Ys(this.nodes.entries(),e)}getPickNodes(){return Js(this.visibleNodes())}getRayQuerySources(){return ds(this.visibleNodes(),this.options.classMask)}*visibleNodes(){for(let[e,t]of this.nodes)this.visibility.visible(e)&&(yield t)}};function nc(e,t,n,r){let i={x:1/0,y:1/0,z:1/0},a={x:-1/0,y:-1/0,z:-1/0},o=e=>{e&&e.min.every(Number.isFinite)&&e.max.every(Number.isFinite)&&(i.x=Math.min(i.x,e.min[0]),i.y=Math.min(i.y,e.min[1]),i.z=Math.min(i.z,e.min[2]),a.x=Math.max(a.x,e.max[0]),a.y=Math.max(a.y,e.max[1]),a.z=Math.max(a.z,e.max[2]))};for(let t of e.getBatchedMeshes())(t.modelIndices?.[0]??0)===n&&o(t.bounds);for(let t of e.getMeshes())!t.hydrated&&(t.modelIndex??0)===n&&o(t.bounds);for(let t of e.getInstancedTemplates())t.modelIndex===n&&o(t.bounds);for(let t of e.getTexturedMeshes())(t.modelIndex??0)===n&&o(t.bounds);return o(t?.getPlacementBounds(n,r)),Number.isFinite(i.x)?{min:i,max:a}:null}function rc(e){let t=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=!1;for(let c of[...e.getBatchedMeshes(),...e.getTexturedMeshes(),...e.getInstancedTemplates(),...e.getMeshes().filter(e=>!e.hydrated)])c.bounds&&c.bounds.min.every(Number.isFinite)&&c.bounds.max.every(Number.isFinite)&&(s=!0,c.bounds.min[0]<t&&(t=c.bounds.min[0]),c.bounds.min[1]<n&&(n=c.bounds.min[1]),c.bounds.min[2]<r&&(r=c.bounds.min[2]),c.bounds.max[0]>i&&(i=c.bounds.max[0]),c.bounds.max[1]>a&&(a=c.bounds.max[1]),c.bounds.max[2]>o&&(o=c.bounds.max[2]));return s?{min:{x:t,y:n,z:r},max:{x:i,y:a,z:o}}:null}var ic=256,ac=16,oc=new WeakMap,sc=new WeakMap,cc=()=>({mode:`disabled`,epoch:0,sampled:0,skipped:0,overwritten:0,errors:0,frames:[]});function lc(e,t){let n=(oc.get(e)?.snapshot.epoch??0)+1;uc(e),oc.set(e,{enabled:t,device:null,recorder:null,pending:!1,snapshot:{...cc(),epoch:n}})}function uc(e){let t=oc.get(e);t&&(t.recorder?.destroy(),t.recorder=null,t.device=null,t.pending=!1,t.snapshot={...cc(),epoch:t.snapshot.epoch+1})}function dc(e){let t=oc.get(e)?.snapshot;return t?{...t,frames:t.frames.map(e=>({timestamp:e.timestamp,passesMs:{...e.passesMs}}))}:cc()}function fc(e,t,n){let r=oc.get(e);r?.enabled&&(r.device!==t&&(uc(e),r.device=t,r.recorder=uo.create(t,ac),r.snapshot.mode=r.recorder?`gpu-queries`:`unsupported`),r.recorder&&(r.pending||!r.recorder.beginFrame()?r.snapshot.skipped++:sc.set(n,{recorder:r.recorder,state:r,complete:!0})))}function pc(e,t){let n=sc.get(e);if(!n)return;let r=n.recorder.beginPass(t);return!r&&n.complete&&(n.complete=!1,n.state.snapshot.errors++,console.warn(`[Renderer] GPU timing pass budget exceeded; discarding incomplete frame`)),r??void 0}function mc(e,t,n){sc.get(n)?.recorder.endFrame(n),t.queue.submit([n.finish()]),hc(e,n)}function hc(e,t){let n=sc.get(t),r=n?.recorder;sc.delete(t);let i=oc.get(e);if(!r||!i||r!==i.recorder)return;i.pending=!0;let a=performance.now();r.readback().then(e=>{if(e&&i.recorder===r&&n?.complete){if(e.some(e=>e.endNs<e.startNs))throw Error(`GPU timing contains a non-monotonic timestamp pair`);i.snapshot.frames.length===ic&&(i.snapshot.frames.shift(),i.snapshot.overwritten++),i.snapshot.frames.push({timestamp:a,passesMs:io(e)}),i.snapshot.sampled++}}).catch(e=>{i.recorder===r&&(i.snapshot.errors++,console.warn(`[Renderer] GPU frame timing readback failed:`,e))}).finally(()=>{i.recorder===r&&(i.pending=!1)})}function gc(e){e.vertexBuffer.destroy(),e.indexBuffer.destroy(),e.instanceBuffer.destroy(),e.rteDeltas.buffer.destroy()}function _c(e,t,n){let r=[];for(let i of t){let t=n[i.templateIndex];if(!t||t.positions.length===0)continue;let a=new DataView(t.instanceData),o=i.byteOffset,s=a.getFloat32(o+0,!0),c=a.getFloat32(o+4,!0),l=a.getFloat32(o+8,!0),u=a.getFloat32(o+16,!0),d=a.getFloat32(o+20,!0),f=a.getFloat32(o+24,!0),p=a.getFloat32(o+32,!0),m=a.getFloat32(o+36,!0),h=a.getFloat32(o+40,!0),g=o/88*3,_=a.getFloat32(o+48,!0),v=a.getFloat32(o+52,!0),y=a.getFloat32(o+56,!0),b=t.canonicalAnchors,x=t.canonicalMatrixTranslations,S=b&&x&&_===x[g]&&v===x[g+1]&&y===x[g+2],C=S?b[g]:_,w=S?b[g+1]:v,T=S?b[g+2]:y,E=t.positions.length,D=new Float32Array(E),O=new Float32Array(t.normals.length);for(let e=0;e<E;e+=3){let n=t.positions[e],r=t.positions[e+1],i=t.positions[e+2];if(D[e]=s*n+u*r+p*i,D[e+1]=c*n+d*r+m*i,D[e+2]=l*n+f*r+h*i,e+2<t.normals.length){let n=t.normals[e],r=t.normals[e+1],i=t.normals[e+2],a=s*n+u*r+p*i,o=c*n+d*r+m*i,g=l*n+f*r+h*i,_=Math.hypot(a,o,g)||1;a/=_,o/=_,g/=_,O[e]=a,O[e+1]=o,O[e+2]=g}}let k=[...i.originalColor],A=`${e}:inst:${i.templateIndex}:${i.byteOffset}`,j=i.itemId===void 0?{}:{geometryItemId:i.itemId},M=t.indices;r.push({expressId:e,modelIndex:t.modelIndex,positions:D,normals:O,indices:M,color:k,origin:[C,w,T],occurrenceKey:A,...j,appearanceSource:{kind:`canonical-item`,indices:M,sourceIndices:M}})}return r.length>0?r:void 0}var vc=class{changed;entries=new Map;constructor(e){this.changed=e}*suppressedIds(){for(let[e,t]of this.entries)t.suppressed&&(yield e)}owns(e){return this.entries.has(e)}get retained(){return this.entries.size>0}has(e){return this.entries.get(e)?.suppressed===!0}acquire(e,t){if(this.entries.has(e))throw Error(`An appearance operation already retains this occurrence`);let n={suppressed:!1,modelIndex:t};this.entries.set(e,n);let r=()=>this.entries.get(e)===n;return Object.freeze({expressId:e,modelIndex:t,get valid(){return r()},setSuppressed:t=>{if(!r())throw Error(`The retained occurrence is stale`);if(n.suppressed!==t){n.suppressed=t;try{this.changed(e)}catch(r){throw n.suppressed=!t,this.changed(e),r}}},release:()=>{if(r()){if(n.suppressed){n.suppressed=!1;try{this.changed(e)}catch(t){throw n.suppressed=!0,this.changed(e),t}}this.entries.delete(e)}}})}restore(e){let t=[...this.entries].filter(([t])=>!e?.has(t)),n=t.filter(([,e])=>e.suppressed);for(let[,e]of n)e.suppressed=!1;try{for(let[e]of n)this.changed(e)}catch(e){for(let[,e]of n)e.suppressed=!0;let t=[e];for(let[e]of n)try{this.changed(e)}catch(e){t.push(e)}throw t.length>1?AggregateError(t,`Occurrence restoration and rollback failed`):e}for(let[e]of t)this.entries.delete(e)}forget(e){e===void 0?this.entries.clear():this.entries.delete(e)}forgetModel(e){for(let[t,n]of this.entries)n.modelIndex===e&&this.entries.delete(t)}};function yc(e,n,r){let i=ArrayBuffer.isView(n)?new Uint8Array(n.buffer,n.byteOffset,n.byteLength):new Uint8Array(n),a=bc(i.byteLength),o=e.createBuffer({size:a,usage:r|GPUBufferUsage.COPY_DST});if(i.byteLength===0)return o;try{let n=i.byteLength===a?i:xc(i,a);e.queue.writeBuffer(o,0,n),t(`gpu.staticUpload`,n.byteLength)}catch(e){throw o.destroy(),e}return o}function bc(e){return Math.max(4,Math.ceil(e/4)*4)}function xc(e,t){let n=new Uint8Array(t);return n.set(e),n}function Sc(e,t,n,r,i,a){let o=Ms(e,i.origin),s=e.map(e=>e.expressId),c=e.map(e=>e.modelIndex),l=[],u=e=>(l.push(e),e);try{let l,d,f=i.quantized===`off`?null:qa(o.vertexData,X.BYTES_PER_VERTEX/4);!f&&i.quantized===`required`&&console.warn(`[Scene] derived batch ${i.colorKey} could not inherit its source batch's quantization; its partial-batch depth will not match the base geometry (#4832).`),f?(d=u(yc(n,f.vertexData,GPUBufferUsage.VERTEX)),l={min:f.quantMin,step:f.step}):d=u(yc(n,o.vertexData,GPUBufferUsage.VERTEX));let p=u(yc(n,o.indices,GPUBufferUsage.INDEX)),m=u(n.createBuffer({size:r.getUniformBufferSize(),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),h=n.createBindGroup({layout:r.getBindGroupLayout(),entries:[{binding:0,resource:{buffer:m}}]}),g,_;if(i.lod&&a!==void 0&&o.bounds&&o.indices.length>=1500){let e=Ga(o.bounds.min,o.bounds.max),t=Wa(o.vertexData,X.BYTES_PER_VERTEX/4,o.indices,e);t&&(g=u(yc(n,t,GPUBufferUsage.INDEX)),_=t.length)}return{id:i.id,colorKey:i.colorKey,vertexBuffer:d,indexBuffer:p,indexCount:o.indices.length,color:t,...e[0]?.material?{finish:e[0].material}:{},expressIds:s,bindGroup:h,uniformBuffer:m,bounds:o.bounds,modelIndices:c,origin:o.origin,...g?{lod1IndexBuffer:g,lod1IndexCount:_}:{},...l?{quantized:l}:{}}}catch(e){for(let e of l)try{e.destroy()}catch(e){console.warn(`[Scene] batch rollback disposal failed`,e)}throw e}}function Cc(e,t,n,r){let i=Ms(e,t.origin);return{id:n,colorKey:r,vertexBuffer:t.vertexBuffer,indexBuffer:t.indexBuffer,indexCount:i.indices.length,color:e[0].color,...e[0]?.material?{finish:e[0].material}:{},expressIds:e.map(e=>e.expressId),modelIndices:e.map(e=>e.modelIndex),bounds:i.bounds,origin:i.origin,gpuResident:!1}}function wc(e,t,n,r){if(t>=e.length)return{queue:e,readIndex:t,processed:0};let i=r.deterministicUploads,a=i?512:4096,o=i?1:512,s=performance.now(),c=0,l=0;for(;t<e.length&&c<a;){if(c>0){if(i){if(!(l+e[t].indices.length<=r.maxIndicesPerAppend))break}else if(performance.now()-s>=r.budgetMs)break}let u=Math.min(e.length,t+o,t+a-c),d=Tc(t=>e[t].indices.length,t,u,r.maxIndicesPerAppend);if(d===t)break;let f=e.slice(t,d);t=d,n(f,t),c+=f.length,i&&(l+=f[0].indices.length)}return t>=e.length?(e.length=0,t=0):t>=8192&&t*2>=e.length&&(e=e.slice(t),t=0),c>0&&r.trace?.enabled&&r.trace.record(`scene.flushPending`,s,performance.now(),{meshes:c,queued:e.length-t,...i?{uploadMode:`count`}:{}}),{queue:e,readIndex:t,processed:c}}function Tc(e,t,n,r){let i=t,a=0;for(;i<n;){let n=e(i);if(!Number.isFinite(n)){i===t&&i++;break}if(i>t&&!(a+n<=r))break;a+=n,i++}return i}function Ec(e,t){if(e.expressId!==t.expressId||e.geometryItemId!==t.geometryItemId||e.indices.length!==t.indices.length)return!1;for(let n=0;n<e.indices.length;n++){let r=e.indices[n]*3,i=t.indices[n]*3;for(let n=0;n<3;n++){let a=e.positions[r+n]+(e.origin?.[n]??0),o=t.positions[i+n]+(t.origin?.[n]??0);if(!Number.isFinite(a)||!Number.isFinite(o)||Math.abs(a-o)>8*2**-23*Math.max(1,Math.abs(a),Math.abs(o)))return!1}}return!0}var Dc=class{access;records=new Map;constructor(e){this.access=e}retainedOwners(e){return new Set([...this.records].filter(([,t])=>t.history>0&&t.lease.valid&&e(t)).map(([e])=>e))}forgetExcept(e){for(let t of this.records.keys())e.has(t)||this.forget(t)}discardedFlatOwners(e){return[...this.records].filter(([t,n])=>!e.has(t)&&!n.active&&n.lease.valid).map(([e])=>e)}get(e){let t=this.records.get(e.expressId);if(t){if(t.owner.modelIndex!==e.modelIndex||!t.lease.valid)throw Error(`The original occurrence is no longer available.`);return t}}capture(e,t){let n=this.get(e);if(!n&&this.access.has(e.expressId)){let r=this.access.capacity(e.expressId);if(!t||t.length!==1||r.parts!==1||r.vertices>1e6||r.corners>15e5)throw Error(`Instance appearance requires one bounded canonical native source mesh.`);let i=t[0];if(i.expressId!==e.expressId||i.modelIndex!==e.modelIndex||i.appearanceSource?.kind!==`canonical-item`||i.appearanceSource.indices!==i.indices||i.entityIds||i.localToWorld||i.texture||i.textureRef||i.uvs)throw Error(`Invalid native occurrence source ownership or provenance.`);let a=this.access.acquire(e);try{let r=this.access.pieces(e.expressId);if(r?.length!==1||!Ec(i,r[0]))throw Error(`The rendered occurrence moved or changed since native preparation.`);n={owner:Object.freeze({...e}),originals:Object.freeze(t.map(e=>Object.freeze({...e}))),lease:a,active:!0,drafts:0,history:0},this.records.set(e.expressId,n)}catch(e){throw a.release(),e}}else if(t&&!n)throw Error(`The target is no longer a GPU instance.`);return n&&n.drafts++,n}isOriginal(e,t){return t.length===e.originals.length&&t.every((t,n)=>{let r=e.originals[n];return t.geometryItemId===r.geometryItemId&&!t.texture&&!t.textureRef&&!t.uvs&&t.color.every((e,t)=>e===r.color[t])&&Un(t,r)})}activate(e,t){this.get(e.owner),e.lease.setSuppressed(!t),e.active=t}finish(e,t){let n=this.records.get(e.expressId);!n||n.owner.modelIndex!==e.modelIndex||t&&n!==t||(n.drafts=Math.max(0,n.drafts-1),this.collect(n))}retain(e){let t=this.get(e);if(!t)return()=>{};t.history++;let n=!1;return()=>{if(!n){t.history--;try{this.collect(t)}catch(e){throw t.history++,e}n=!0}}}collect(e){e.drafts||e.history||this.records.get(e.owner.expressId)!==e||(e.lease.valid&&(e.active?e.lease.release():this.access.remove(e.owner.expressId)),this.records.delete(e.owner.expressId))}forget(e){for(let[t,n]of this.records)(e===void 0||e===t)&&(n.lease.release(),this.records.delete(t))}},Oc=e=>!!(e.uvs&&(e.texture||e.textureRef&&e.textureBitmap));function kc(e,t,n){for(let r of n)try{r.kind===`textured`?e.release(r.mesh):t.release(r.flat)}catch(e){console.warn(`[Appearance] resource disposal failed`,e)}}function Ac(e,t,n){let r=e.meshes(),i=r.length,a=[];try{let o=[];return n.forEach((t,n)=>{if(Oc(t)){let n=r.length;if(e.upload(t),r.length!==n+1)throw Error(`The new textured geometry is invalid.`)}else o.push(n)}),a.push(...r.splice(i).map(e=>({kind:`textured`,mesh:e}))),a.push(...t.stage(n,o).map(e=>({kind:`flat`,flat:e}))),a}catch(n){throw a.push(...r.splice(i).map(e=>({kind:`textured`,mesh:e}))),kc(e,t,a),n}}var jc=e=>`${e.modelIndex}:${e.expressId}:`,Mc=e=>({expressId:e.expressId,modelIndex:e.modelIndex??0}),Nc=e=>e.positions.length/3*X.BYTES_PER_VERTEX,Pc=class{parts;sequence=0;slots=new Map;buckets=new WeakMap;cohorts=new Set;constructor(e){this.parts=e}slot(e){let t=this.parts(e.expressId)?.indexOf(e)??-1;if(t<0)throw Error(`Appearance batch lost its source part identity`);return jc(Mc(e))+t}register(e){if(this.buckets.has(e))return;let t=e.meshData.map(e=>this.slot(e)),n={id:++this.sequence,live:new Set([e]),slots:new Set(t),active:new Set,vertexLimit:e.meshData.reduce((e,t)=>e+Nc(t),0),indexLimit:e.meshData.reduce((e,t)=>e+t.indices.byteLength,0)};for(let e of t)this.slots.set(e,n);this.buckets.set(e,n),this.cohorts.add(n)}inherit(e,t){let n=this.buckets.get(e);n&&this.buckets.set(t,n)}group(e,t){return this.slots.get(jc(Mc(e))+t)}assign(e,t){t&&this.buckets.set(e,t)}attach(e){this.buckets.get(e)?.live.add(e)}detach(e){this.buckets.get(e)?.live.delete(e)}begin(e){let t=jc(e);for(let[e,n]of this.slots)e.startsWith(t)&&n.active.add(t)}finish(e,t){let n=jc(e),r=new Set;for(let[e,t]of this.slots)e.startsWith(n)&&(t.active.delete(n),r.add(t));for(let e of r){if(e.active.size||e.live.size<2)continue;let n=new Map;for(let t of e.live){let e=t.meshData[0].color.join(`,`),r=n.get(e)??[];r.push(t),n.set(e,r)}for(let r of n.values()){let n=r.flatMap(e=>e.meshData);if(r.length<2||n.reduce((e,t)=>e+Nc(t),0)>e.vertexLimit||n.reduce((e,t)=>e+t.indices.byteLength,0)>e.indexLimit)continue;let i=t(r,n);for(let t of r)e.live.delete(t);this.buckets.set(i,e),e.live.add(i)}}}forget(e){if(e===void 0)this.slots.clear(),this.cohorts.clear(),this.buckets=new WeakMap;else{for(let[t,n]of this.slots)Number(t.split(`:`)[1])===e&&(this.slots.delete(t),n.slots.delete(t),n.active.delete(t.slice(0,t.lastIndexOf(`:`)+1)));for(let t of this.cohorts){for(let n of t.live)n.meshData.some(t=>t.expressId===e)&&(this.buckets.delete(n),t.live.delete(n));t.slots.size||this.cohorts.delete(t)}}}},Fc=class{access;sequence=0;cohorts;constructor(e,t){this.access=e,this.cohorts=new Pc(t)}create(e,t){let n=`appearance#${++this.sequence}`;return{bucket:{key:n,meshData:e,batchedMesh:this.access.create(e,n),vertexBytes:e.reduce((e,t)=>e+t.positions.length/3*X.BYTES_PER_VERTEX,0)},partIndices:t}}capture(e){let t=new Map;e.forEach((e,n)=>{let r=this.access.reverse().get(e);if(r){if(!r.batchedMesh||r.batchedMesh.gpuResident===!1)throw Error(`Appearance requires resident finalized geometry`);let e=t.get(r)??[];e.push(n),t.set(r,e)}});let n=[],r=[];try{for(let[i,a]of t){this.cohorts.register(i);let t=new Set(a.map(t=>e[t])),o=this.create(a.map(t=>e[t]),a);r.push(o);let s=i.meshData.filter(e=>!t.has(e)),c=s.length?this.create(s,[]):void 0;c&&r.push(c),n.push({old:i,owned:o,rest:c})}}catch(e){for(let e of r)this.release(e);throw e}for(let{old:e,owned:t,rest:r}of n)this.cohorts.inherit(e,t.bucket),r&&this.cohorts.inherit(e,r.bucket);for(let{old:e,owned:t,rest:r}of n){this.cohorts.detach(e),this.access.buckets.delete(e.key),this.access.changed(e.key);for(let e of[t,...r?[r]:[]])this.attach(e,e.bucket.meshData)}this.access.refresh();for(let{old:e}of n)e.batchedMesh&&this.dispose(e.batchedMesh);return n.map(e=>e.owned)}stage(e,t){let n=new Map;for(let r of t){let t=this.cohorts.group(e[r],r),i=`${e[r].color.join(`,`)}#${t?.id??`new`}`,a=n.get(i)??[];a.push(r),n.set(i,a)}let r=[];try{for(let t of n.values()){let n=this.create(t.map(t=>e[t]),t);r.push(n),this.cohorts.assign(n.bucket,this.cohorts.group(e[t[0]],t[0]))}return r}catch(e){for(let e of r)this.release(e);throw e}}detach(e){for(let[t,n]of this.access.buckets)if(n.meshData.some(t=>t.expressId===e)){if(n.meshData.some(t=>t.expressId!==e))throw Error(`Appearance owner was not isolated`);this.cohorts.detach(n),this.access.buckets.delete(t);for(let e of n.meshData)this.access.reverse().delete(e);this.access.changed(t)}}attach(e,t){e.bucket.meshData=t,this.cohorts.attach(e.bucket),this.access.buckets.set(e.bucket.key,e.bucket);for(let n of t)this.access.reverse().set(n,e.bucket);this.access.changed(e.bucket.key)}refresh(){this.access.refresh()}begin(e){this.cohorts.begin(e)}finish(e){this.cohorts.finish(e,(e,t)=>{let n=this.create(t,[]);for(let t of e)this.access.buckets.delete(t.key),this.access.changed(t.key);this.attach(n,t),this.access.refresh();for(let t of e)t.batchedMesh&&this.dispose(t.batchedMesh);return n.bucket})}forget(e){this.cohorts.forget(e)}dispose(e){try{this.access.release(e)}catch(e){console.warn(`[Appearance] flat resource disposal failed`,e)}}release(e){e.bucket.batchedMesh&&this.dispose(e.bucket.batchedMesh)}};function Ic(e,t){if(!e)return t;let n=e.buckets;return Object.assign(e,t,{buckets:n}),Object.assign(n,t.buckets),e}function Lc(e,t=new Fc(e.buckets,t=>e.data.get(t))){let n=new Dc(e.instances),r=new qn;return new tr({validate:t=>r.validate(t,e.data.get(t.expressId)),prepareRebuild(t,i){let a=new Map;for(let e of t){let t=a.get(e.expressId)??[];t.push(e),a.set(e.expressId,t)}let o=n.retainedOwners(t=>{if(!i.has(t.owner.modelIndex))return!1;let n=a.get(t.owner.expressId)??[];if(t.active)return n.length===0;let r=e.data.get(t.owner.expressId)?.map(t=>e.source(t))??t.flatSources;return!!r&&r.length===n.length&&r.every((e,r)=>{let i=n[r];return(i.modelIndex??0)===t.owner.modelIndex&&i.geometryItemId===e.geometryItemId&&Un(i,e)&&i.color.every((t,n)=>t===e.color[n])&&i.texture===e.texture&&i.textureRef===e.textureRef&&i.textureBitmap===e.textureBitmap&&i.uvs===e.uvs&&i.shadingColor===e.shadingColor})});for(let e of r.retained(t,i))o.add(e);return o},finishRebuild(e){n.forgetExcept(e),r.forgetExcept(e),t.forget()},discardedForRebuild:e=>n.discardedFlatOwners(e),instanced(e,t){let r=n.get(e);return!!r&&n.isOriginal(r,t)},parts(t){let i=n.get(t);return e.data.get(t.expressId)??(i?.active?i.originals:r.get(t)?r.get(t).absent?[]:r.get(t).originals:void 0)},retainSource:e=>{let t=n.retain(e),i=r.retain(e);return()=>{t(),i()}},capture(i,a,o,s){if(!e.ready())throw Error(`Appearance requires finalized resident geometry.`);if(o&&(a||e.instances.has(i.expressId)))throw Error(`Instanced companions are not supported.`);let c=o?r.capture(i,o,e.data.get(i.expressId),t=>e.source(t),s):void 0;if(c&&(c.absent||c.hidden))return{parts:c.absent?[]:c.originals,resources:[],companionOriginals:c.originals,abandon:()=>r.finish(i,c)};let l=n.capture(i,a);if(l?.active)return{parts:l.originals,resources:[{kind:`instance`,record:l}],abandon:()=>n.finish(i,l)};try{let a=e.data.get(i.expressId),o=e.meshes().filter(e=>e.expressId===i.expressId);if(!e.ready()||!a?.length||e.instances.has(i.expressId)&&!l||o.length!==a.filter(Oc).length||a.some(t=>(t.modelIndex??0)!==i.modelIndex||t.entityIds||t.positions.length===0||t.indices.length===0||!Oc(t)&&!e.buckets.reverse().has(t)))throw Error(`Appearance preview requires finalized, resident, non-instanced geometry`);let s=o.map(e=>({kind:`textured`,mesh:e}));return s.push(...t.capture(a).map(e=>({kind:`flat`,flat:e}))),t.begin(i),{parts:c?.originals??a,resources:s,companionOriginals:c?.originals,abandon:()=>{t.finish(i),n.finish(i,l),r.finish(i,c)}}}catch(e){throw n.finish(i,l),r.finish(i,c),e}},stage(i){if(!i.length||r.get({expressId:i[0].expressId,modelIndex:i[0].modelIndex??0})?.hidden)return[];let a=n.get({expressId:i[0].expressId,modelIndex:i[0].modelIndex??0});return a&&n.isOriginal(a,i)?[{kind:`instance`,record:a}]:Ac(e,t,i)},install(i,a,o){let s=e.meshes(),c=a.map(t=>e.adopt({...t})),l=o.map(e=>e.kind===`flat`?e.flat.partIndices.map(e=>c[e]):void 0),u=o.find(e=>e.kind===`instance`),d=n.get(i),f=d&&!u?Object.freeze(c.map(t=>Object.freeze({...e.source(t)}))):void 0;d&&n.activate(d,!!u),t.detach(i.expressId);for(let e=s.length-1;e>=0;e--)s[e].expressId===i.expressId&&s.splice(e,1);o.forEach((e,n)=>{e.kind===`textured`?s.push(e.mesh):e.kind===`flat`&&t.attach(e.flat,l[n])}),t.refresh(),u||r.get(i)?.hidden?e.data.delete(i.expressId):e.data.set(i.expressId,c),d&&(d.flatSources=f),r.install(i,a),e.invalidate(i.expressId)},finished(e){try{t.finish(e)}finally{n.finish(e),r.finish(e)}},forget(e){n.forget(e),r.forget(e),t.forget(e)},release:n=>kc(e,t,n.filter(e=>e.kind!==`instance`))})}var Rc=class{active=new Set;track(e){let t={commit:()=>{try{e.commit()}finally{this.active.delete(t)}},dispose:()=>{try{e.dispose()}finally{this.active.delete(t)}}};return this.active.add(t),t}invalidate(){let e=[...this.active];this.active.clear();for(let t of e)t.dispose()}};function zc(e){if(!e.length)throw Error(`A new owner requires geometry.`);let t=e[0];for(let n of e){let e=n.positions.length/3;if(n.expressId!==t.expressId||(n.modelIndex??0)!==(t.modelIndex??0)||n.entityIds||!Number.isSafeInteger(n.expressId)||n.expressId<=0||!e||!Number.isInteger(e)||n.normals.length!==n.positions.length||!n.indices.length||n.indices.length%3||n.indices.some(t=>t>=e)||n.positions.some(e=>!Number.isFinite(e))||n.normals.some(e=>!Number.isFinite(e))||n.color.length!==4||n.color.some(e=>!Number.isFinite(e)||e<0||e>1)||n.origin&&(n.origin.length!==3||n.origin.some(e=>!Number.isFinite(e))))throw Error(`A new owner requires valid geometry parts with one model and object identity.`);if((n.texture||n.textureRef||n.textureBitmap||n.uvs)&&(!Oc(n)||n.uvs.length!==e*2||n.uvs.some(e=>!Number.isFinite(e))))throw Error(`Textured geometry requires a retained image and complete UV coordinates.`)}}function Bc(e,t,n,r){zc(n);let i=n[0].expressId,a=()=>{if(r(),e.data.has(i)||e.instances.has(i))throw Error(`The new geometry owner already exists or was claimed while preparing.`)};a();let o=n.map(t=>e.adopt({...t,color:[...t.color],origin:t.origin&&[...t.origin]})),s=o.map(e=>[...e.origin??[0,0,0]]),c=Ac(e,t,o),l=c.map(e=>e.kind===`flat`?e.flat.partIndices.map(e=>o[e]):void 0),u=!1,d=!1;return{commit(){if(d)throw Error(`The prepared geometry was released.`);if(!u){try{a();for(let[t,n]of o.entries())if((e.adopt(n).origin??[0,0,0]).some((e,n)=>e!==s[t][n]))throw Error(`The model placement changed while preparing the object.`)}catch(n){throw d=!0,kc(e,t,c),n}c.forEach((n,r)=>{n.kind===`textured`?e.meshes().push(n.mesh):t.attach(n.flat,l[r])}),e.data.set(i,o),t.refresh(),e.invalidate(i),u=!0}},dispose(){d||u||(d=!0,kc(e,t,c))}}}function Vc(e){let t=e.uvs;if(!(e.texture||e.textureRef&&e.textureBitmap)||!t)return null;let n=e.positions,r=e.normals,i=n.length/3;if(i===0||e.indices.length===0)return null;let a=new ArrayBuffer(i*36),o=new Float32Array(a),s=new Uint32Array(a),c=e.entityIds,l=As(e.color);for(let a=0;a<i;a++){let i=a*9;o[i]=n[a*3],o[i+1]=n[a*3+1],o[i+2]=n[a*3+2],o[i+3]=r[a*3]??0,o[i+4]=r[a*3+1]??0,o[i+5]=r[a*3+2]??0,s[i+6]=js(c?c[a]:e.expressId,l),o[i+7]=t[a*2]??0,o[i+8]=t[a*2+1]??0}return a}var Hc=class{entries=new WeakMap;owners=new Map;acquire(e,t){let{rgba:n,width:r,height:i}=e,a=this.entries.get(n)??[],o=a.find(e=>e.width===r&&e.height===i);if(!o){let e=t.createTexture({size:{width:r,height:i},format:`rgba8unorm`,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST});try{t.queue.writeTexture({texture:e},n,{bytesPerRow:r*4,rowsPerImage:i},{width:r,height:i})}catch(t){throw e.destroy(),t}o={texture:e,width:r,height:i,refs:0},a.push(o),this.entries.set(n,a),this.owners.set(e,{siblings:a,entry:o})}return o.refs++,o.texture}release(e){let t=this.owners.get(e);if(!t)return!1;if(--t.entry.refs===0){let n=t.siblings;n.splice(n.indexOf(t.entry),1),this.owners.delete(e),e.destroy()}return!0}clear(){for(let e of this.owners.keys())e.destroy();this.owners.clear(),this.entries=new WeakMap}};function Uc(e,t,n){let r=e.positions.byteLength+e.normals.byteLength;if(e.indices.length<=t&&r<=n)return[e];let i=Math.max(3,Math.floor(t/3)*3),a=[],o=e.appearanceSource,s=o?.indices===e.indices&&(!o.cornerIndices||o.cornerIndices.length===e.indices.length)?o:void 0;for(let t=0;t<e.indices.length;t+=i){let n=Math.min(t+i,e.indices.length),r=e.indices.subarray(t,n),c=new Map,l=[],u=[],d=[],f=[],p=new Uint32Array(r.length);for(let t=0;t<r.length;t++){let n=r[t],i=c.get(n);if(i===void 0){i=c.size,c.set(n,i),e.uvs&&d.push(e.uvs[n*2],e.uvs[n*2+1]),e.entityIds&&f.push(e.entityIds[n]);let t=n*3;l.push(e.positions[t],e.positions[t+1],e.positions[t+2]),u.push(e.normals[t],e.normals[t+1],e.normals[t+2])}p[t]=i}a.push({...e,...e.uvs?{uvs:new Float32Array(d)}:{},...e.entityIds?{entityIds:new Uint32Array(f)}:{},positions:new Float32Array(l),normals:new Float32Array(u),indices:p,...o?{appearanceSource:s?{...s,indices:p,cornerIndices:Uint32Array.from(r,(e,n)=>s.cornerIndices?.[t+n]??t+n)}:void 0}:{}})}return a}var Wc=new Uint8Array([0,1,2,3,4,5,6,7,0,2,1,3,4,6,5,7,0,4,1,5,2,6,3,7]);function Gc(e,t,n,r,i,a,o,s,c){let l=new Set;if(!(r>0)||!(i>0))return l;let u=Math.min(n.x0,n.x1),d=Math.max(n.x0,n.x1),f=Math.min(n.y0,n.y1),p=Math.max(n.y0,n.y1),m=fo(s),h=t,g=new Float64Array(8),_=new Float64Array(8),v=new Float64Array(8),y=new Float64Array(8),b=new Float64Array(8);for(let[t,n]of e){if(a?.has(t)||o!=null&&!o.has(t)||m&&mo(s,n))continue;let e=!0;for(let t=0;t<8;t++){let r=(t&1?n.max.x:n.min.x)-(c?.cameraWorld[0]??0),i=(t&2?n.max.y:n.min.y)-(c?.cameraWorld[1]??0),a=(t&4?n.max.z:n.min.z)-(c?.cameraWorld[2]??0),o=h[3]*r+h[7]*i+h[11]*a+h[15],s=h[2]*r+h[6]*i+h[10]*a+h[14];g[t]=o,_[t]=h[0]*r+h[4]*i+h[8]*a+h[12],v[t]=h[1]*r+h[5]*i+h[9]*a+h[13];let l=o-s;y[t]=l,b[t]=s,(l<0||s<0)&&(e=!1)}let x=1/0,S=1/0,C=-1/0,w=-1/0,T=!1;if(e)for(let e=0;e<8;e++){let t=g[e];if(!(t>1e-6))continue;let n=(_[e]/t*.5+.5)*r,a=(.5-v[e]/t*.5)*i;n<x&&(x=n),n>C&&(C=n),a<S&&(S=a),a>w&&(w=a),T=!0}else for(let e=0;e<Wc.length;e+=2){let t=Wc[e],n=Wc[e+1],a=0,o=1,s=!1;for(let e=0;e<2&&!s;e++){let r=e===0?y:b,i=r[t],c=r[n]-i;if(c===0)i<0&&(s=!0);else if(c>0){let e=-i/c;e>a&&(a=e)}else{let e=-i/c;e<o&&(o=e)}}if(!(s||a>o))for(let e=0;e<2;e++){let s=e===0?a:o,c=g[t]+(g[n]-g[t])*s;if(!(c>1e-6))continue;let l=_[t]+(_[n]-_[t])*s,u=v[t]+(v[n]-v[t])*s,d=(l/c*.5+.5)*r,f=(.5-u/c*.5)*i;d<x&&(x=d),d>C&&(C=d),f<S&&(S=f),f>w&&(w=f),T=!0}}T&&(C<u||x>d||w<f||S>p||l.add(t))}return l}function Kc(e,t,n){let r=e.activeKeys.get(t)??t,i=e.buckets.get(r),a=n.positions.length/3*X.BYTES_PER_VERTEX,o=i?.frameOrigin??i?.batchedMesh?.origin,s=(i?.vertexBytes??0)>0&&o!==void 0&&!Ts([n],o),c=(i?.vertexBytes??0)>0&&(i?.vertexBytes??0)+a>e.maxBufferSize;(i&&e.coldKeys.has(r)||c||s)&&(r=e.nextSplitKey(),e.activeKeys.set(t,r));let l=e.buckets.get(r);if(!l){let t=Es([n],void 0,e.sharedOrigin);if(!t)throw Error(`Unable to resolve a topology-safe GPU frame for mesh geometry.`);l={key:r,meshData:[],batchedMesh:null,vertexBytes:0,frameOrigin:t},e.buckets.set(r,l)}return l.vertexBytes+=a,r}function qc(e,t,n){return t?[e[0],e[1],e[2],n]:[e[0],e[1],e[2],e[3]]}function Jc(e,t,n,r,i){for(let a of t){let t=n[a.templateIndex]?.instanceBuffer;if(!t)continue;let o=a.originalColor;e.queue.writeBuffer(t,a.byteOffset+r,new Float32Array([o[0],o[1],o[2],i]))}}function Yc(e,t){return e?t?t.quantized?`required`:`off`:`auto`:`off`}function Xc(e){let t=new Map;for(let[n,r]of e)t.set(n,[r[0],r[1],r[2],r[3]]);return t}function Zc(e,t){let n=(e,t)=>e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3],r=t.filter(([e,t])=>!n(e,t));if(r.length===0)return null;let i=!1,a=new Map;for(let[t,o]of e){let e=r.find(([e])=>n(e,o));e&&(i=!0);let s=e?e[1]:o;a.set(t,[s[0],s[1],s[2],s[3]])}return i?a:null}function Qc(e){let{ghostExceptIds:t,selectedIds:n,instancedIds:r,current:i,ghostAlpha:a,lastGhostAlpha:o,dirty:s}=e,c=new Set;if(t!=null)for(let e of r)!t.has(e)&&!n?.has(e)&&c.add(e);let l=c.size>0&&a!==o,u=s||l;if(!u&&c.size===i.size){let e=!0;for(let t of c)if(!i.has(t)){e=!1;break}if(e)return{next:c,toFade:[],toRestore:[],changed:!1}}let d=[];for(let e of i)c.has(e)||d.push(e);let f=[];for(let e of c)(u||!i.has(e))&&f.push(e);return{next:c,toFade:f,toRestore:d,changed:!0}}function $c(e,t,n){let r=e.translations.get(t);if(!e.translations.set(t,n))return!1;let i=new Set(e.translations.releasedEntityIds(t));for(let n of e.batches)if((n.modelIndices?.[0]??0)===t)for(let e of n.expressIds)i.add(e);for(let n of[...e.textured,...e.meshes])(n.modelIndex??0)===t&&i.add(n.expressId);for(let n of i){if(e.pieces.has(n))continue;let i=e.bounds.get(n),a=e.translations.releasedEntityBounds(n);a?e.bounds.set(n,a):i&&e.bounds.set(n,e.translations.placeReleasedBounds(i,r,t)),e.evictHighlight(n)}let a=new Set;for(let[n,r]of e.pieces){if(!r.some(e=>(e.modelIndex??0)===t))continue;e.bounds.delete(n),e.evictHighlight(n);for(let t of r)a.has(t)||(a.add(t),e.translations.placeMesh(t));let i=Ds(r);i&&e.bounds.set(n,i)}for(let t of e.meshes)e.translations.placeAuthoredMesh(t);for(let t of e.textured)e.translations.moveDrawable(t);for(let t of e.batches)e.translations.moveDrawable(t);return e.clearPartial(),el(e,t),!0}function el(e,t){for(let n=0;n<e.templates.length;n++){let r=e.templates[n],i=e.cpu[n];r&&i&&r.modelIndex===t&&(e.translations.placeInstances(i.instanceData,t,88,i.canonicalAnchors,i.canonicalMatrixTranslations)&&(e.device?.queue.writeBuffer(r.instanceBuffer,0,i.instanceData),$e(r.rteDeltas)),r.bounds=null,r.maxOccRadius!==1/0&&(r.maxOccRadius=0))}for(let[n,r]of e.occurrences){if(!r.some(n=>e.templates[n.templateIndex]?.modelIndex===t))continue;let i=e.pieces.has(n)?Ds(e.pieces.get(n)):e.translations.releasedEntityBounds(n);i?e.bounds.set(n,i):e.bounds.delete(n),e.evictHighlight(n);for(let i of r){let r=e.templates[i.templateIndex],a=e.cpu[i.templateIndex];if(!r||!a)continue;let o=e.unionBounds(n,new DataView(a.instanceData),i.byteOffset,a.canonicalAnchors,a.localMin,a.localMax);r.modelIndex===t&&Xe(r,o)}}}function tl(e,t,n){return e.translations.setYaw(t,n)?(el(e,t),!0):!1}function nl(e){for(let t of e)t&&(t.positions=new Float32Array,t.normals=new Float32Array,t.indices=new Uint32Array)}function rl(e,t,n){let r=Ds([n]);t.bounds=r?{min:[r.min.x,r.min.y,r.min.z],max:[r.max.x,r.max.y,r.max.z]}:void 0,e.registerDrawable(t,t.modelIndex??0)}function il(e,t,n,r,i,a,o,s,c,l,u){let d=n.getFloat32(r,!0),f=n.getFloat32(r+4,!0),p=n.getFloat32(r+8,!0),m=n.getFloat32(r+16,!0),h=n.getFloat32(r+20,!0),g=n.getFloat32(r+24,!0),_=n.getFloat32(r+32,!0),v=n.getFloat32(r+36,!0),y=n.getFloat32(r+40,!0),b=r/88*3,x=i[b],S=i[b+1],C=i[b+2],w=1/0,T=1/0,E=1/0,D=-1/0,O=-1/0,k=-1/0;for(let e=0;e<8;e++){let t=e&1?c:a,n=e&2?l:o,r=e&4?u:s,i=d*t+m*n+_*r+x,b=f*t+h*n+v*r+S,A=p*t+g*n+y*r+C;w=Math.min(w,i),T=Math.min(T,b),E=Math.min(E,A),D=Math.max(D,i),O=Math.max(O,b),k=Math.max(k,A)}let A=e.get(t);return A?(A.min.x=Math.min(A.min.x,w),A.min.y=Math.min(A.min.y,T),A.min.z=Math.min(A.min.z,E),A.max.x=Math.max(A.max.x,D),A.max.y=Math.max(A.max.y,O),A.max.z=Math.max(A.max.z,k)):e.set(t,{min:{x:w,y:T,z:E},max:{x:D,y:O,z:k}}),{minX:w,minY:T,minZ:E,maxX:D,maxY:O,maxZ:k}}function al(e,t){let n=e.entityIds,r=e.positions,i=e.normals,a=e.indices,o=n.length,s=new Uint8Array(o),c=0;for(let e=0;e<o;e++)n[e]===t&&(s[e]=1,c++);if(c===0)return;let l=new Uint32Array(o),u=0;for(let e=0;e<o;e++)s[e]&&(l[e]=u++);let d=new Float32Array(c*3),f=new Float32Array(c*3),p=0;for(let e=0;e<o;e++){if(!s[e])continue;let t=e*3;d[p]=r[t],d[p+1]=r[t+1],d[p+2]=r[t+2],f[p]=i[t],f[p+1]=i[t+1],f[p+2]=i[t+2],p+=3}let m=[];for(let e=0;e<a.length;e+=3){let t=a[e],n=a[e+1],r=a[e+2];s[t]&&s[n]&&s[r]&&m.push(l[t],l[n],l[r])}if(m.length!==0)return{expressId:t,modelIndex:e.modelIndex,positions:d,normals:f,indices:new Uint32Array(m),color:e.color,origin:e.origin}}var ol=class{sources=new WeakMap;sourceFor(e){let t=e,n;for(;n=this.sources.get(t);)t=n;return t}placedSourceFor(e,t){return t.placeMesh(this.sourceFor(e))}extract(e,t){let n=al(e,t);return n&&this.sources.set(n,this.sourceFor(e)),n}remember(e,t){this.sources.set(e,this.sourceFor(t))}};function sl(e,t,n){if(e.pendingKeys.size===0)return;let r=[];try{for(let i of e.pendingKeys){let a=e.buckets.get(i);!a||a.meshData.length===0?r.push({key:i,bucket:a}):r.push({key:i,bucket:a,replacement:e.create(a.meshData,a.meshData[0].color,t,n,i)})}}catch(e){for(let e of r)e.replacement&&$(e.replacement);throw e}for(let{key:t,bucket:n,replacement:i}of r)!n||!i?(n?.batchedMesh&&(e.dropPartial(n.batchedMesh),$(n.batchedMesh)),e.buckets.delete(t)):(n.batchedMesh&&(e.dropPartial(n.batchedMesh),$(n.batchedMesh)),n.batchedMesh=i,n.frameOrigin=i.origin);e.pendingKeys.clear()}function cl(e,t){let n=new Set([...e.keys()].map(e=>/^model(\d+)~/.exec(e)?.[1]));for(let e of t.keys())e!==0&&!n.has(String(e))&&t.delete(e)}function ll(e){let t=new Map(e.activeBucketKey),n=new Set(e.pendingBatchKeys),r=new Set(e.streamedBucketKeys),i=[],a=[],o=[];for(let t of e.streamedBucketKeys){let n=e.buckets.get(t);if(n&&!(e.coldBuckets.has(t)&&n.meshData.length===0)){e.buckets.delete(t),e.pendingBatchKeys.delete(t),i.push([t,n]),n.batchedMesh&&a.push(n.batchedMesh);for(let e of n.meshData)o.push(e)}}e.streamedBucketKeys.clear();let s=new Map;for(let[t,n]of e.buckets)s.set(t,n.vertexBytes);let c=new Map,l=new Set,u=new Map,d=()=>{let t=new Set(o),a=new Map(i);for(let[n,r]of c){let{bucket:i}=r,o=i.meshData.filter(e=>!t.has(e));if(i.meshData.splice(0,i.meshData.length,...o),i.vertexBytes=r.bytesBefore+Math.max(0,i.vertexBytes-r.bytesAfter),!r.created||e.buckets.get(n)!==i)continue;let s=a.get(n);if((o.length===0||s)&&e.buckets.delete(n),s&&o.length>0){for(let t of o)s.meshData.push(t),e.meshDataBucket.set(t,s);s.vertexBytes+=i.vertexBytes-r.bytesBefore}}for(let[t,n]of i){e.buckets.set(t,n);for(let t of n.meshData)e.meshDataBucket.set(t,n)}for(let[t,n]of u)e.activeBucketKey.get(t)===n.after&&(n.before===void 0?e.activeBucketKey.delete(t):e.activeBucketKey.set(t,n.before));for(let t of l)e.pendingBatchKeys.delete(t);for(let t of n)e.pendingBatchKeys.add(t);for(let t of r)e.streamedBucketKeys.add(t)};try{for(let t of o){let n=e.resolveActiveBucket(e.bucketBaseKey(t),t),r=e.buckets.get(n);r||(r=e.createBucket(n),e.buckets.set(n,r)),c.has(n)||c.set(n,{bucket:r,bytesBefore:s.get(n)??0,bytesAfter:0,created:!s.has(n)}),r.meshData.push(t),e.meshDataBucket.set(t,r),e.pendingBatchKeys.has(n)||l.add(n),e.pendingBatchKeys.add(n)}}catch(e){throw f(),d(),e}return f(),{retired:a,rollback:d};function f(){for(let e of c.values())e.bytesAfter=e.bucket.vertexBytes;for(let[n,r]of e.activeBucketKey){let e=t.get(n);e!==r&&u.set(n,{before:e,after:r})}}}var ul=1e3;function dl(e){return`:x${e}`}var fl=/:x\d+(?::|$)/,pl=class{active;overrides;ghostExcept;ghostAlpha;selected;batchCache=new WeakMap;ghostCache=new WeakMap;constructor(e,t){let n=e.transparencyOverrides;this.overrides=n!=null&&n.size>0?new Map(n):null,this.ghostExcept=e.ghostExceptIds==null?null:new Set(e.ghostExceptIds),this.ghostAlpha=e.ghostAlpha??.12,this.selected=new Set(t),this.active=this.overrides!=null||this.ghostExcept!=null}forEntity(e,t){if(!this.active||this.selected.has(e))return t;let n=this.overrides?.get(e);return n===void 0?this.ghostExcept!=null&&!this.ghostExcept.has(e)?this.ghostAlpha:t:n}forBatch(e,t){return this.active?this.resolve(e,t).alpha:t}isGhostBatch(e){if(this.ghostExcept==null)return!1;let t=this.ghostCache.get(e);if(t===void 0){t=e.expressIds.length>0;for(let n of e.expressIds)if(this.ghostExcept.has(n)||this.selected.has(n)||this.overrides?.has(n)){t=!1;break}this.ghostCache.set(e,t)}return t}groupsForBatch(e,t){return this.active?this.resolve(e,t).groups:null}groupsForIds(e,t){return this.active?ml(e,e=>this.forEntity(e,t)):null}resolve(e,t){let n=this.batchCache.get(e);if(n!==void 0)return n;let r=1/0,i=0,a=!1,o=null;for(let n of e.expressIds){let e=t;if(!this.selected.has(n)){let t=this.overrides?.get(n);t===void 0?this.ghostExcept!=null&&!this.ghostExcept.has(n)&&(e=this.ghostAlpha,this.ghostAlpha<r&&(r=this.ghostAlpha)):(e=t,t<r&&(r=t))}let s=Math.round(e*ul);a?s!==i&&(o===null?o=[s]:o.length<8&&!o.includes(s)&&o.push(s)):(i=s,a=!0)}let s=o!==null&&o.length<8,c={alpha:r===1/0?t:r,groups:s?ml(e.expressIds,e=>this.forEntity(e,t)):null};return this.batchCache.set(e,c),c}};function ml(e,t){let n=new Map;for(let r of e){let e=t(r),i=Math.round(e*ul),a=n.get(i);if(a)a.ids.add(r),e<a.alpha&&(a.alpha=e);else{if(n.size>=8)return null;n.set(i,{alpha:e,ids:new Set([r])})}}return n.size<2?null:[...n.values()].sort((e,t)=>e.alpha-t.alpha)}var hl=class{version=0;overrides=null;ghostExcept=null;ghostAlpha=Le;selected=new Set;update(e,t=gl){let n=e.transparencyOverrides,r=n!=null&&n.size>0?n:null,i=e.ghostExceptIds??null,a=e.ghostAlpha??.12,o=r!=null||i!=null,s=!vl(t,this.selected),c=!_l(r,this.overrides)||!vl(i,this.ghostExcept)||a!==this.ghostAlpha||o&&s;return s&&(this.selected=new Set(t)),c&&(this.version++,this.overrides=r?new Map(r):null,this.ghostExcept=i?new Set(i):null,this.ghostAlpha=a),this.version}getVersion(){return this.version}},gl=new Set;function _l(e,t){if(e===t)return!0;if(e===null||t===null||e.size!==t.size)return!1;for(let[n,r]of e)if(t.get(n)!==r)return!1;return!0}function vl(e,t){if(e===t)return!0;if(e===null||t===null||e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}function yl(e,t){let n=e.keys.get(t);if(n!==void 0){let t=e.batches.get(n);t&&($(t),e.batches.delete(n))}e.keys.delete(t),e.versions.delete(t)}function bl(e,t){let n=`${t.colorKey}:${t.id}`;for(let t of e.keys.keys())t.startsWith(n)&&yl(e,t)}function xl(e){if(e.batches.size!==0||e.keys.size!==0||e.versions.size!==0){for(let t of e.batches.values())$(t);e.batches.clear(),e.keys.clear(),e.versions.clear()}}function Sl(e,t){if(e.keys.size===0)return;let n=null;for(let r of e.keys.keys())fl.test(r)&&(t.has(r)||(n??=[]).push(r));if(n!==null)for(let t of n)yl(e,t)}function Cl(e,t,n){let r=new DataView(e.instanceData),i=new Float32Array([r.getFloat32(t+48,!0)+n[0],r.getFloat32(t+52,!0)+n[1],r.getFloat32(t+56,!0)+n[2]]);r.setFloat32(t+48,i[0],!0),r.setFloat32(t+52,i[1],!0),r.setFloat32(t+56,i[2],!0);let a=t/88*3;for(let t=0;t<3;t++)e.canonicalAnchors[a+t]+=n[t];return e.canonicalMatrixTranslations?.set(i,a),i}function wl(e){let t=e.batchedMeshes.filter(e=>e.gpuResident!==!1),n=e.texturedMeshes.slice(),r=e.instancedTemplates.slice(),i=[...e.sharedTextures.values()].map(e=>e.texture);return()=>{for(let e of t)$(e);for(let e of n)e.vertexBuffer.destroy(),e.indexBuffer.destroy(),e.uniformBuffer.destroy();for(let e of i)e.destroy();for(let e of r)e&&gc(e)}}function Tl(e){if(!e.streamingFragments.length)return!0;if(!e.streamedBucketKeys.size)return!1;let t=new Map([...e.meshDataMap].map(([e,t])=>[e,new Set(t)])),n=new Set(e.batchedMeshes),r=new Map,i=0,a=0;for(let n of e.buckets.values())for(let a of n.meshData){if(e.meshDataBucket.get(a)!==n||!t.get(a.expressId)?.has(a))return!1;let o=JSON.stringify([a.modelIndex??0,a.expressId]);r.set(o,(r.get(o)??0)+1),i+=a.indices.length}for(let t of e.streamingFragments){if(!n.has(t)||!Number.isSafeInteger(t.indexCount)||t.indexCount<=0)return!1;a+=t.indexCount;for(let e=0;e<t.expressIds.length;e++){let n=JSON.stringify([t.modelIndices?.[e]??0,t.expressIds[e]]),i=r.get(n)??0;if(!i)return!1;r.set(n,i-1)}}return Number.isSafeInteger(i)&&Number.isSafeInteger(a)&&i>=a}function El(e){let t=Object.entries(e),n=t.map(([,e])=>Array.isArray(e)?e.slice():null);return()=>{let r=Object.entries(e);return r.length===t.length&&t.every(([e,t],i)=>{if(r[i][0]!==e||r[i][1]!==t)return!1;let a=n[i];return!a||Array.isArray(t)&&t.length===a.length&&a.every((e,n)=>Object.is(e,t[n]))})}}function Dl(e){let t=[...e].map(([e,t])=>({key:e,array:t,values:t.slice()}));return n=>n===e&&n.size===t.length&&t.every(({key:e,array:t,values:r})=>n.get(e)===t&&t.length===r.length&&r.every((e,n)=>t[n]===e))}function Ol(e){let t=new Map;for(let n of e.buckets.values())for(let e of n.meshData)t.set(e,(t.get(e)??0)+1);return t}function kl(e,t){let n=Ol(t);return n.size===e.size&&[...e].every(([e,t])=>n.get(e)===t)}function Al(e){let t=e.buckets,n=e.meshDataBucket,r=[...t].map(([e,t])=>({key:e,bucket:t,array:t.meshData,pieces:t.meshData.slice()}));return()=>e.buckets===t&&e.meshDataBucket===n&&t.size===r.length&&r.every(({key:e,bucket:r,array:i,pieces:a})=>t.get(e)===r&&r.meshData===i&&i.length===a.length&&a.every((e,t)=>i[t]===e&&n.get(e)===r))}function jl(e){if(!e.streamingFragments.length&&!e.streamedBucketKeys.size&&e.meshQueueReadIndex>=e.meshQueue.length)return null;let t=e.meshQueue,n=e.meshQueueReadIndex,r=t.slice(),i=Ol(e),a=Dl(e.meshDataMap),o=Dl(e.instancedEntityMap),s=e.instancedTemplateCpu,c=s.slice(),l=new Set([...i.keys(),...r]),u=e.modelTranslations,d=new Set;for(let e of l)d.add(e.modelIndex??0);for(let e of s)e&&d.add(e.modelIndex);let f=[...d].map(e=>({index:e,offset:[...u.get(e)],yaw:u.getYaw(e)})),p=()=>e.modelTranslations===u&&f.every(({index:e,offset:t,yaw:n})=>{let r=u.get(e),i=u.getYaw(e);return t.every((e,t)=>Object.is(e,r[t]))&&n?.angle===i?.angle&&n?.px===i?.px&&n?.pz===i?.pz}),m=[...l].map(El);for(let e of s)e&&m.push(El(e));for(let t of e.instancedEntityMap.values())for(let e of t)m.push(El(e));let h=e.authoredGeneration,g=e.streamingFragments,_=g.slice(),v=Al(e),y=e.meshes,b=y.slice(),x=()=>e.authoredGeneration===h&&!e.geometryReleased&&!e.ephemeralStreamingMode&&!e.finalizeInProgress&&!e.pendingBatchKeys.size&&!e.appearanceController?.hasActiveDrafts()&&p()&&a(e.meshDataMap)&&o(e.instancedEntityMap)&&e.instancedTemplateCpu===s&&s.length===c.length&&c.every((e,t)=>s[t]===e)&&m.every(e=>e())&&e.meshQueue===t&&e.meshQueueReadIndex===n&&e.meshes===y&&y.length===b.length&&b.every((e,t)=>y[t]===e)&&t.length>=r.length&&r.every((e,n)=>t[n]===e),S=()=>x()&&v()&&e.streamingFragments===g&&g.length===_.length&&_.every((e,t)=>g[t]===e);return{valid:S,discarded(){return e.authoredGeneration!==h+1||e.streamingFragments.length||e.meshes.length?!1:(h++,g=e.streamingFragments,_=[],y=e.meshes,b=[],S())},restored(){return!x()||!kl(i,e)?!1:(v=Al(e),S())}}}function Ml(e){return e.geometryReleased||e.ephemeralStreamingMode?{ok:!1,reason:`cpu-geometry-released`}:e.finalizeInProgress||!Tl(e)||e.pendingBatchKeys.size>0||e.appearanceController?.hasActiveDrafts()?{ok:!1,reason:`scene-not-settled`}:e.meshes.some(e=>!e.hydrated)?{ok:!1,reason:`unsupported-authored-meshes`}:null}function Nl(e){return Ml(e)||{ok:!0}}function Pl(e){e.authoredGeneration++,e.authoredPreparations.invalidate();let t=new Set;for(let n of e.buckets.values())n.batchedMesh?.gpuResident===!1&&t.add(n.batchedMesh);for(let t of e.meshes)$(t);e.meshes=[];for(let n of e.batchedMeshes)t.has(n)||$(n);e.batchedMeshes=[...t],e.streamingFragments=[];for(let n of e.buckets.values())(!n.batchedMesh||!t.has(n.batchedMesh))&&(n.batchedMesh=null);e.dropAllPartialCaches(),e.releaseColorOverrideGpu();for(let t of e.texturedMeshes)t.vertexBuffer.destroy(),t.indexBuffer.destroy(),t.uniformBuffer.destroy(),e.releaseTexturedMeshTexture(t);e.texturedMeshes=[];for(let t of e.sharedTextures.values())t.texture.destroy();e.sharedTextures.clear(),e.rgbaTexturePool.clear(),e.texturedDevice=void 0;for(let t of e.instancedTemplates)t&&gc(t);e.instancedTemplates=Array(e.instancedTemplateCpu.length),e.liveInstancedTemplates=[],e.instancedDevice=void 0,e.cachedMaxBufferSize=0,e.lastDrawnFrame.clear(),e.residencyRestoreQueue.clear()}var Fl=e=>e.reduce((e,t)=>e+t.positions.length/3*X.BYTES_PER_VERTEX,0);function Il(e,t){let n;do n=`${t}#${e.nextSplitId++}`;while(e.buckets.has(n));return n}function Ll(e,t,n,r){let i=Ns(n.meshData,e.cachedMaxBufferSize);if(i.length<=1)return[t];let a=t.lastIndexOf(`#`),o=a>=0?t.slice(0,a):t,s=[],c=[];e.buckets.delete(t);let l=e.streamedBucketKeys.delete(t);for(let t=0;t<i.length;t++){let a=Il(e,o),u=i[t],d=t===0?n:{key:a,meshData:[],batchedMesh:null,vertexBytes:0},f=e.modelTranslations.registerDrawable(Cc(u,r,e.nextBatchId++,a),u[0].modelIndex??0);d.key=a,d.meshData=u,d.batchedMesh=f,d.vertexBytes=Fl(u),e.buckets.set(a,d),l&&e.streamedBucketKeys.add(a);for(let t of u)e.meshDataBucket.set(t,d);s.push(f),c.push(a)}let u=e.batchedMeshes.indexOf(r);return u>=0?e.batchedMeshes.splice(u,1,...s):e.batchedMeshes.push(...s),e.lastDrawnFrame.delete(r.id),e.activeBucketKey.set(o,c.at(-1)),e.appearanceBuckets?.forget(),c}function Rl(e,t,n){let r=Math.floor((t.limits?.maxBufferSize??X.FALLBACK_MAX_BUFFER_SIZE)*X.BUFFER_SIZE_SAFETY_FACTOR);e.cachedMaxBufferSize=r;let i=[];e.batchedMeshes=i;let a=!1,o=Array.from(e.buckets);for(let[s,c]of o){if(c.meshData.length===0){c.batchedMesh?.gpuResident===!1&&i.push(c.batchedMesh);continue}let o=Ns(c.meshData,r);if(o.length===1){if(c.batchedMesh?.gpuResident===!1)i.push(c.batchedMesh);else{let r=e.createBatchedMesh(o[0],o[0][0].color,t,n,s);c.batchedMesh=r,i.push(r)}continue}a=!0;let l=c.batchedMesh?.gpuResident===!1,u=c.batchedMesh,d=e.dirtyBuckets.has(s),f=s.lastIndexOf(`#`),p=f>=0?s.slice(0,f):s,m=[];try{for(let r of o){let i=Il(e,p),a=l?e.modelTranslations.registerDrawable(Cc(r,u,e.nextBatchId++,i),r[0].modelIndex??0):e.createBatchedMesh(r,r[0].color,t,n,i);m.push({key:i,parts:r,batch:a})}}catch(e){if(!l)for(let e of m)$(e.batch);throw e}e.buckets.delete(s),e.dirtyBuckets.delete(s);let h=e.streamedBucketKeys.delete(s);for(let t=0;t<m.length;t++){let{key:n,parts:r,batch:a}=m[t],o=t===0?c:{key:n,meshData:[],batchedMesh:null,vertexBytes:0};o.key=n,o.meshData=r,o.vertexBytes=Fl(r),o.batchedMesh=a,e.buckets.set(n,o);for(let t of r)e.meshDataBucket.set(t,o);d&&e.dirtyBuckets.add(n),h&&e.streamedBucketKeys.add(n),i.push(a)}e.activeBucketKey.set(p,m.at(-1).key)}a&&e.appearanceBuckets?.forget()}function zl(e,t){e.instancedDevice=t,e.instancedTemplates=Array(e.instancedTemplateCpu.length);for(let n=0;n<e.instancedTemplateCpu.length;n++){let r=e.instancedTemplateCpu[n];if(!r)continue;e.modelTranslations.placeInstances(r.instanceData,r.modelIndex,88,r.canonicalAnchors,r.canonicalMatrixTranslations);let i,a,o,s;try{let c=new ArrayBuffer(r.positions.length/3*28),l=new Float32Array(c);for(let e=0;e<r.positions.length/3;e++){let t=e*7;l[t]=r.positions[e*3],l[t+1]=r.positions[e*3+1],l[t+2]=r.positions[e*3+2],l[t+3]=r.normals[e*3]??0,l[t+4]=r.normals[e*3+1]??0,l[t+5]=r.normals[e*3+2]??0}i=yc(t,c,GPUBufferUsage.VERTEX),a=yc(t,r.indices,GPUBufferUsage.INDEX),o=yc(t,r.instanceData,GPUBufferUsage.VERTEX);let u=r.instanceData.byteLength/88;s=Qe(t,u),e.instancedTemplates[n]={modelIndex:r.modelIndex,vertexBuffer:i,indexBuffer:a,indexCount:r.indices.length,instanceBuffer:o,instanceCount:u,canonicalAnchors:r.canonicalAnchors,rteDeltas:s,bounds:null,maxOccRadius:0,selectedCount:0}}catch(e){throw i?.destroy(),a?.destroy(),o?.destroy(),s?.buffer.destroy(),e}}for(let[t,n]of e.instancedEntityMap)if(!e.instanceSuppression.has(t))for(let r of n){let n=e.instancedTemplateCpu[r.templateIndex],i=e.instancedTemplates[r.templateIndex];n&&i&&Number.isFinite(n.localMin[0])&&(Xe(i,e.unionInstancedWorldAabb(t,new DataView(n.instanceData),r.byteOffset,n.canonicalAnchors,n.localMin[0],n.localMin[1],n.localMin[2],n.localMax[0],n.localMax[1],n.localMax[2])),e.instancedSelected.has(t)&&i.selectedCount++)}e.refreshLiveInstancedTemplates()}function Bl(e){return!!e.uvs&&!!(e.texture||e.textureRef&&e.textureBitmap)}function Vl(e,t){for(let n of e.instancedEntityMap.keys()){e.writeInstanceFlags(t,n);let r=e.instancedOverrideColors?.get(n);r?e.writeInstanceColor(t,n,qc(r,e.instancedGhosted.has(n),e.lastGhostAlpha)):e.instancedGhosted.has(n)&&e.writeOriginalInstanceColors(t,n,e.lastGhostAlpha)}}function Hl(e,t,n){try{e.appearanceAccessState&&e.bindAppearanceAccess(t,n),Rl(e,t,n);let r=new Set;for(let t of e.meshDataMap.values())for(let e of t)Bl(e)&&r.add(e);for(let i of r)e.createTexturedMesh(i,t,n);if(zl(e,t),e.colorOverrides){let r=e.instancedOverrideColors,i=e.instancedOverridden,a=e.instancedHasTransparent;e.setColorOverrides(Xc(e.colorOverrides),t,n),e.instancedOverrideColors=r,e.instancedOverridden=i,e.instancedHasTransparent=a}Vl(e,t)}catch(t){throw Pl(e),t}}var Ul=[],Wl=class r{meshes=[];batchedMeshes=[];buckets=new Map;meshDataBucket=new Map;derivedMeshProvenance=new ol;modelTranslations=new Vs;meshDataMap=new Map;boundingBoxes=new Map;texturedMeshes=[];texturedSourcePositions=new WeakMap;sharedTextures=new Map;rgbaTexturePool=new Hc;appearanceController;appearanceBuckets;appearanceAccessState;authoredGeneration=0;authoredPreparations=new Rc;appearanceAccess(e,t){return{meshes:()=>this.texturedMeshes,data:this.meshDataMap,instances:{has:e=>this.instancedEntityMap.has(e),acquire:e=>this.retainInstancedOccurrence(e.expressId,e.modelIndex),pieces:e=>this.getInstancedMeshDataPieces(e),remove:e=>{this.removeInstancedEntity(e)},capacity:e=>{let t=this.instancedEntityMap.get(e)??[];return{parts:t.length,vertices:t.reduce((e,t)=>e+(this.instancedTemplateCpu[t.templateIndex]?.positions.length??0)/3,0),corners:t.reduce((e,t)=>e+(this.instancedTemplateCpu[t.templateIndex]?.indices.length??0),0)}}},source:e=>this.modelTranslations.sourceFromPlaced(e),ready:()=>!this.geometryReleased&&!this.finalizeInProgress&&!this.pendingBatchKeys.size&&!this.streamingFragments.length,buckets:{buckets:this.buckets,reverse:()=>this.meshDataBucket,create:(n,r)=>this.createBatchedMesh(n,n[0].color,e,t,r),release:e=>{this.dropPartialCacheForBatch(e),this.lastDrawnFrame.delete(e.id),$(e)},changed:e=>this.markBucketDirty(e),refresh:()=>{this.batchedMeshes=[...this.buckets.values()].flatMap(e=>e.batchedMesh?[e.batchedMesh]:[])}},adopt:e=>this.modelTranslations.placeMesh(this.modelTranslations.sourceFromPlaced(e)),upload:n=>this.createTexturedMesh(n,e,t),release:e=>{e.vertexBuffer.destroy(),e.indexBuffer.destroy(),e.uniformBuffer.destroy(),this.releaseTexturedMeshTexture(e)},invalidate:e=>{this.boundingBoxes.delete(e),this.evictHighlightMeshes(e),this.instanceSuppression.has(e)||this.recomputeInstancedBounds(e)}}}bindAppearanceAccess(e,t){return this.appearanceAccessState=Ic(this.appearanceAccessState,this.appearanceAccess(e,t))}sharedAppearanceBuckets(e){return this.appearanceBuckets??=new Fc(e.buckets,e=>this.meshDataMap.get(e))}appearancePreview(e,t){let n=this.bindAppearanceAccess(e,t);return this.appearanceController??=Lc(n,this.sharedAppearanceBuckets(n))}placeAppearanceSource(e){return this.modelTranslations.placeMesh(e)}appearanceSourceMesh(e){return this.modelTranslations.sourceFromPlaced(e)}prepareAuthoredOwner(e,t,n){let r=this.bindAppearanceAccess(t,n),i=this.authoredGeneration;return this.authoredPreparations.track(Bc(r,this.sharedAppearanceBuckets(r),e,()=>{if(i!==this.authoredGeneration)throw Error(`The scene changed while preparing the object.`)}))}prepareTexturedOwner(e,t,n){if(!r.hasRenderableTexture(e))throw Error(`A new textured owner requires an image and UVs.`);return this.prepareAuthoredOwner([e],t,n)}texturedDevice;instancedTemplates=[];liveInstancedTemplates=[];instancedVisible=!0;instancedEntityMap=new Map;instancedTemplateCpu=[];instancedDevice;instancedSelected=new Set;instancedSelectedItemExpressId;instancedSelectedItemId;instanceSuppression=new vc(e=>{this.instancedDevice&&this.writeInstanceFlags(this.instancedDevice,e),this.boundingBoxes.delete(e),this.instanceSuppression.has(e)||this.recomputeInstancedBounds(e),this.evictHighlightMeshes(e)});instancedHidden=new Set;instancedOverridden=new Set;instancedGhosted=new Set;instancedOverrideColors=null;lastGhostAlpha=1;instancedGhostDirty=!1;instancedHasTransparent=!1;instancedGhostTransparent=!1;instancedVisibilityEpochs=new to;lastInstancedVisibilityVersion=-1;instancedVisibilityDirty=!1;activeBucketKey=new Map;spatialChunking=null;gpuBudgetBytes=null;residencyFrame=0;lastDrawnFrame=new Map;residencyRestoreQueue=new Set;residencyOverBudgetWarned=!1;coldProvider=null;hostBudgetBytes=null;coldBuckets=new Set;dirtyBuckets=new Set;coldRestoresInFlight=new Map;hostOverBudgetWarned=!1;hostEnforceCountdown=0;lodBuildsEnabled=!1;quantizedBatchesEnabled=!1;finalizeInProgress=!1;nextSplitId=0;nextBatchId=0;sharedFrameOrigins=new Map;cachedMaxBufferSize=0;static STREAMING_FRAGMENT_MAX_INDICES=18e4;static STREAMING_FRAGMENT_MAX_VERTEX_BYTES=8388608;partialBatchCache=new Map;partialBatchCacheKeys=new Map;partialBatchCacheVersions=new Map;partialCaches={batches:this.partialBatchCache,keys:this.partialBatchCacheKeys,versions:this.partialBatchCacheVersions};entityColorTable=new Se;colorOverrides=null;colorOverrideGeneration=0;pendingBatchKeys=new Set;streamingFragments=[];streamedBucketKeys=new Set;meshQueue=[];meshQueueReadIndex=0;geometryReleased=!1;ephemeralStreamingMode=!1;prepareDeviceRecovery(){return Nl(this)}discardGpuResourcesForRecovery(){Pl(this)}restoreGpuResourcesAfterRecovery(e,t){Hl(this,e,t)}addMesh(e){this.modelTranslations.placeAuthoredMesh(e),this.meshes.push(e)}getMeshes(){return this.meshes}getBatchedMeshes(){return this.batchedMeshes}getSharedFrameOrigin(e=0,t){let n=t?this.derivedMeshProvenance.placedSourceFor(t,this.modelTranslations):void 0,r=n?this.meshDataBucket.get(n):void 0;return r?.batchedMesh?.origin??r?.frameOrigin??this.modelTranslations.frameOrigin(this.sharedFrameOrigins.get(e)??null,e)??null}setSpatialChunking(e){e&&!(Number.isFinite(e.cellSize)&&e.cellSize>0)?console.warn(`[Scene] ignoring invalid spatial chunking cellSize:`,e.cellSize):this.spatialChunking=e}getSpatialChunking(){return this.spatialChunking}setGpuResidencyBudget(e){e!==null&&!(Number.isFinite(e)&&e>0)?console.warn(`[Scene] ignoring invalid GPU residency budget:`,e):(this.gpuBudgetBytes=e,this.residencyOverBudgetWarned=!1)}getGpuResidencyBudget(){return this.gpuBudgetBytes}beginResidencyFrame(){this.residencyFrame++}recordBatchDrawn(e){this.gpuBudgetBytes!==null&&this.lastDrawnFrame.set(e.id,this.residencyFrame)}requestBatchResidency(e){let t=this.buckets.get(e.colorKey);t&&t.batchedMesh===e&&(t.meshData.length>0||this.coldBuckets.has(t.key))&&this.residencyRestoreQueue.add(t.key)}hasResidencyRestoreWork(){return this.residencyRestoreQueue.size>0}processResidencyRestores(e,t,n=6){if(this.residencyRestoreQueue.size===0)return 0;let r=performance.now(),i=0;for(let a of this.residencyRestoreQueue){this.residencyRestoreQueue.delete(a);let o=this.buckets.get(a),s=o?.batchedMesh;if(!o||!s||s.gpuResident!==!1)continue;if(o.meshData.length===0){this.coldBuckets.has(a)&&this.startColdRestore(a);continue}let c=this.createBatchedMesh(o.meshData,o.meshData[0].color,e,t,a);o.batchedMesh=c,o.frameOrigin=c.origin;let l=this.batchedMeshes.indexOf(s);if(l>=0?this.batchedMeshes[l]=c:this.batchedMeshes.push(c),this.lastDrawnFrame.delete(s.id),this.lastDrawnFrame.set(c.id,this.residencyFrame),i++,performance.now()-r>=n)break}return i}setColdGeometryProvider(e){this.coldProvider=e}setLodBuildsEnabled(e){this.lodBuildsEnabled=e}setQuantizedBatches(e){this.quantizedBatchesEnabled=e}getTexturedDrawOrigin(e){let t=this.derivedMeshProvenance.placedSourceFor(e,this.modelTranslations).positions,n=this.texturedMeshes.find(n=>n.expressId===e.expressId&&this.texturedSourcePositions.get(n)===t);return n?n.origin:null}getIndividualMeshFrame(e){let t=this.getTexturedDrawOrigin(e);return t?{sharedOrigin:t,quantized:!1}:{sharedOrigin:this.getSharedFrameOrigin(e.modelIndex,e),quantized:this.isMeshQuantized(e)}}isMeshQuantized(e){let t=this.derivedMeshProvenance.placedSourceFor(e,this.modelTranslations);return Yc(this.quantizedBatchesEnabled,this.meshDataBucket.get(t)?.batchedMesh)!==`off`}setHostResidencyBudget(e){e!==null&&!(Number.isFinite(e)&&e>0)?console.warn(`[Scene] ignoring invalid host residency budget:`,e):(this.hostBudgetBytes=e,this.hostOverBudgetWarned=!1)}getResidentCpuBytes(){let e=0;for(let t of this.buckets.values())for(let n of t.meshData)e+=n.positions.byteLength+n.normals.byteLength+n.indices.byteLength;return e}markBucketDirty(e){this.dirtyBuckets.add(e)}enforceHostBudget(){let e=this.hostBudgetBytes;if(e===null||!this.coldProvider||this.geometryReleased||this.ephemeralStreamingMode||this.streamingFragments.length>0)return;let t=this.getResidentCpuBytes();if(t<=e)return;let n=[];for(let e of this.buckets.values()){let t=e.batchedMesh;if(!t||t.gpuResident!==!1||e.meshData.length===0||e.key.includes(`#`)||this.dirtyBuckets.has(e.key))continue;let r=!1,i=0;for(let t of e.meshData){if(t.entityIds&&t.entityIds.length>0){r=!0;break}i+=t.positions.byteLength+t.normals.byteLength+t.indices.byteLength}r||n.push({key:e.key,bytes:i,lastDrawnFrame:this.lastDrawnFrame.get(t.id)??-1})}let r=Va(n,t,e,this.residencyFrame),i=0;for(let e of r){let t=this.buckets.get(e);if(t&&t.meshData.length!==0){for(let e of t.meshData){i+=e.positions.byteLength+e.normals.byteLength+e.indices.byteLength,this.meshDataBucket.delete(e);let t=this.meshDataMap.get(e.expressId);if(t){let n=t.indexOf(e);n>=0&&t.splice(n,1),t.length===0&&this.meshDataMap.delete(e.expressId)}}t.meshData=[],t.vertexBytes=0,this.coldBuckets.add(e)}}t-i>e&&!this.hostOverBudgetWarned&&(this.hostOverBudgetWarned=!0,console.warn(`[Scene] host residency budget ${(e/1048576).toFixed(0)}MB exceeded (${((t-i)/1048576).toFixed(0)}MB CPU resident) — remaining buckets are hot, dirty, or overflow sub-buckets. Rendering is unaffected.`))}async drainColdTier(){if(this.coldBuckets.size!==0){for(let e of Array.from(this.coldBuckets))this.startColdRestore(e);await Promise.all(Array.from(this.coldRestoresInFlight.values()))}}startColdRestore(e){if(this.geometryReleased||this.ephemeralStreamingMode||this.coldRestoresInFlight.has(e))return;let t=this.buckets.get(e),n=t?.batchedMesh,r=this.coldProvider;if(!t||!n||!n.bounds||!r)return;let i=this.modelTranslations.sourceDrawableBounds(n),a=r.loadMeshesInBounds(i.min,i.max).then(r=>{let i=this.buckets.get(e);if(!i||i!==t||!this.coldBuckets.has(e))return;let a=this.baseColorKey(e),o=new Set(n.expressIds),s=r.filter(e=>o.has(e.expressId)&&this.bucketBaseKey(e)===a);for(let e of s){let n=this.modelTranslations.placeMesh(e);t.meshData.push(n),t.vertexBytes+=n.positions.length/3*X.BYTES_PER_VERTEX,this.meshDataBucket.set(n,t),this.addMeshData(n)}if(s.length>0){this.coldBuckets.delete(e);for(let r of Ll(this,e,t,n))this.residencyRestoreQueue.add(r)}else console.warn(`[Scene] cold restore for ${e} found no members — bucket stays a shell`)}).catch(e=>{console.warn(`[Scene] cold restore failed (bucket stays cold, will retry on demand):`,e)}).finally(()=>{this.coldRestoresInFlight.delete(e)});this.coldRestoresInFlight.set(e,a)}restoreAllEvicted(e,t){if(this.geometryReleased||this.ephemeralStreamingMode)return 0;let n=0;for(let r of this.buckets.values()){let i=r.batchedMesh;if(!i||i.gpuResident!==!1||r.meshData.length===0)continue;let a=this.createBatchedMesh(r.meshData,r.meshData[0].color,e,t,r.key);r.batchedMesh=a,r.frameOrigin=a.origin;let o=this.batchedMeshes.indexOf(i);o>=0?this.batchedMeshes[o]=a:this.batchedMeshes.push(a),this.lastDrawnFrame.delete(i.id),this.lastDrawnFrame.set(a.id,this.residencyFrame),this.residencyRestoreQueue.delete(r.key),n++}return n}enforceGpuBudget(){this.hostBudgetBytes!==null&&--this.hostEnforceCountdown<=0&&(this.hostEnforceCountdown=120,this.enforceHostBudget());let e=this.gpuBudgetBytes;if(e===null||this.geometryReleased||this.ephemeralStreamingMode||this.streamingFragments.length>0)return;let t=0,n=[];for(let e of this.buckets.values()){let r=e.batchedMesh;if(!r||r.gpuResident===!1)continue;let i=r.vertexBuffer.size+r.indexBuffer.size+(r.uniformBuffer?.size??0)+(r.lod1IndexBuffer?.size??0);t+=i;let a=this.lastDrawnFrame.get(r.id)??-1;a!==this.residencyFrame&&e.meshData.length!==0&&(e.meshData.some(e=>this.appearanceController?.owns(e.expressId))||n.push({key:e.key,bytes:i,lastDrawnFrame:a}))}if(t<=e)return;let r=Va(n,t,e,this.residencyFrame),i=0;for(let e of r){let t=this.buckets.get(e),n=t?.batchedMesh;t&&n&&n.gpuResident!==!1&&($(n),n.gpuResident=!1,i+=n.vertexBuffer.size+n.indexBuffer.size+(n.uniformBuffer?.size??0)+(n.lod1IndexBuffer?.size??0),this.lastDrawnFrame.delete(n.id),this.dropPartialCacheForBatch(n))}t-i>e&&!this.residencyOverBudgetWarned&&(this.residencyOverBudgetWarned=!0,console.warn(`[Scene] GPU residency budget ${(e/1048576).toFixed(0)}MB exceeded by the recently-drawn set (${((t-i)/1048576).toFixed(0)}MB resident) — nothing old enough to evict. Rendering is unaffected.`))}dropPartialCacheForBatch(e){bl(this.partialCaches,e)}dropAllPartialCaches(){xl(this.partialCaches)}retireUnusedAlphaSlots(e){Sl(this.partialCaches,e)}disposeHydratedMeshesExcept(e,t,n,r){if(this.meshes.length===0)return 0;let i=[],a=0;for(let o of this.meshes){let s=e.has(o.expressId)&&(t===void 0||o.modelIndex===t)&&(n===void 0||o.expressId!==n||o.geometryItemId===r);o.hydrated&&!s?($(o),a++):i.push(o)}return a>0&&(this.meshes=i),a}bucketBaseKey(e,t){let n=this.modelTranslations.sourceMesh(e),r=ge(n.expressId,Ba(n,this.colorKey(t??e.color,e.material),this.spatialChunking));return n.modelIndex?`model${n.modelIndex}~${r}`:r}addMeshData(e){if(e=this.modelTranslations.placeMesh(e),e.entityIds&&e.entityIds.length>0){let t=new Set;for(let n=0;n<e.entityIds.length;n++){let r=e.entityIds[n];if(t.has(r))continue;t.add(r);let i=this.meshDataMap.get(r);i?i.push(e):this.meshDataMap.set(r,[e])}return}let t=this.meshDataMap.get(e.expressId);t?t.push(e):this.meshDataMap.set(e.expressId,[e])}getMeshData(e,t){let n=this.meshDataMap.get(e);if(!n||n.length===0||t!==void 0&&(n=n.filter(e=>e.modelIndex===t),n.length===0))return;if(n.length===1){let t=n[0];return t.entityIds?this.derivedMeshProvenance.extract(t,e):t}if(n.some(e=>e.entityIds)){let t=[];for(let r of n)if(r.entityIds){let n=this.derivedMeshProvenance.extract(r,e);n&&t.push(n)}else t.push(r);if(t.length===0)return;if(t.length===1)return t[0];n=t}let r=n[0].origin,i=this.derivedMeshProvenance.placedSourceFor(n[0],this.modelTranslations),a=this.meshDataBucket.get(i),o=n.every(e=>this.meshDataBucket.get(this.derivedMeshProvenance.placedSourceFor(e,this.modelTranslations))===a),s=n.every(e=>e.origin?.[0]===r?.[0]&&e.origin?.[1]===r?.[1]&&e.origin?.[2]===r?.[2]),c=o||!a&&s,l=c?a?.batchedMesh?.origin??a?.frameOrigin??r??[0,0,0]:void 0,u=n[0].color,d=.01;if(!n.every(e=>{let t=e.color;return Math.abs(t[0]-u[0])<d&&Math.abs(t[1]-u[1])<d&&Math.abs(t[2]-u[2])<d&&Math.abs(t[3]-u[3])<d}))return n[0];let f=0,p=0;for(let e of n)f+=e.positions.length,p+=e.indices.length;let m=new Float32Array(f),h=new Float32Array(f),g=new Uint32Array(p),_=0,v=0,y=0;for(let e of n){if(l){let t=(e.origin?.[0]??0)-l[0],n=(e.origin?.[1]??0)-l[1],r=(e.origin?.[2]??0)-l[2];for(let i=0;i<e.positions.length;i+=3)m[_+i]=e.positions[i]+t,m[_+i+1]=e.positions[i+1]+n,m[_+i+2]=e.positions[i+2]+r}else m.set(e.positions,_);h.set(e.normals,_);for(let t=0;t<e.indices.length;t++)g[v+t]=e.indices[t]+y;_+=e.positions.length,v+=e.indices.length,y+=e.positions.length/3}let b={expressId:e,modelIndex:n[0].modelIndex,positions:m,normals:h,indices:g,color:u,ifcType:n[0].ifcType,...l?{origin:l}:{}};return a&&c&&this.derivedMeshProvenance.remember(b,i),b}hasMeshData(e,t){let n=this.meshDataMap.get(e);return!n||n.length===0?!1:t===void 0||n.some(e=>e.modelIndex===t)}visibleMeshDataEntitiesExceed(e,t,n){let r=0;for(let i of this.meshDataMap.keys())if(Q(i,t,n)&&++r>e)return!0;return!1}forEachMeshData(e){let t=new Set;for(let n of this.meshDataMap.values())for(let r of n)t.has(r)||(t.add(r),e(r));if(!this.geometryReleased)for(let t of this.getAllInstancedMeshData())e(t)}getMeshDataPieces(e,t,n){let r=this.meshDataMap.get(e);if(r&&r.length!==0&&!(t!==void 0&&(r=r.filter(e=>e.modelIndex===t),r.length===0))&&(n!==void 0&&(r=r.filter(e=>e.geometryItemId===n)),r.length!==0)){if(r.some(e=>e.entityIds)){let t=[];for(let n of r)if(n.entityIds){let r=this.derivedMeshProvenance.extract(n,e);r&&t.push(r)}else t.push(n);return t.length>0?t:void 0}return r}}colorKey(e,t){return za(e,t)}appendToBatches(e,t,n,i=!1){e=e.map(e=>this.modelTranslations.placeMesh(e));for(let t of e){let e=t.modelIndex??0,n=this.modelTranslations.frameOrigin(this.sharedFrameOrigins.get(e)??null,e);if(!Es([t],void 0,n))throw Error(`Unable to resolve a topology-safe GPU frame for mesh geometry.`)}if(this.appearanceController)for(let t of e)this.appearanceController.cancelFor(t.expressId);this.cachedMaxBufferSize===0&&(this.cachedMaxBufferSize=this.getMaxBufferSize(t));let a=!(i&&this.ephemeralStreamingMode),o=e;if(e.some(e=>r.hasRenderableTexture(e))){o=[];for(let i of e)r.hasRenderableTexture(i)?(this.createTexturedMesh(i,t,n),this.addMeshData(i)):o.push(i)}for(let e of o){let t=this.bucketBaseKey(e),n=this.resolveActiveBucket(t,e),r=this.buckets.get(n);if(r&&this.meshDataBucket.set(e,r),a||!i){let t=this.buckets.get(n);t||(t={key:n,meshData:[],batchedMesh:null,vertexBytes:0},this.buckets.set(n,t)),t.meshData.push(e),this.meshDataBucket.set(e,t),this.addMeshData(e),i?this.streamedBucketKeys.add(n):this.pendingBatchKeys.add(n)}}i?this.createStreamingFragments(o,t,n):this.rebuildPendingBatches(t,n)}rebuildPendingBatches(e,t){this.pendingBatchKeys.size!==0&&(sl({pendingKeys:this.pendingBatchKeys,buckets:this.buckets,create:(e,t,n,r,i)=>this.createBatchedMesh(e,t,n,r,i),dropPartial:e=>this.dropPartialCacheForBatch(e)},e,t),this.batchedMeshes=[...this.buckets.values()].flatMap(e=>e.batchedMesh?[e.batchedMesh]:[]),this.pendingBatchKeys.clear(),cl(this.buckets,this.sharedFrameOrigins))}hasPendingBatches(){return this.pendingBatchKeys.size>0}removeMeshesForEntity(e){this.appearanceController?.forget(e),this.modelTranslations.forgetEntityBounds(e);let t=this.meshDataMap.get(e);if(!t||t.length===0)return this.boundingBoxes.delete(e),this.removeInstancedEntity(e);let n=new Set,r=!1;for(let e of t){if(ja(e))continue;r=!0;let t=this.meshDataBucket.get(e);if(t){let r=t.meshData.indexOf(e);if(r>=0){t.meshData.splice(r,1);let n=e.positions.byteLength+e.normals.byteLength;t.vertexBytes=Math.max(0,t.vertexBytes-n)}n.add(t.key),this.markBucketDirty(t.key)}this.meshDataBucket.delete(e)}this.meshDataMap.delete(e),this.boundingBoxes.delete(e);for(let t=this.texturedMeshes.length-1;t>=0;t--){let n=this.texturedMeshes[t];n.expressId===e&&(n.vertexBuffer.destroy(),n.indexBuffer.destroy(),n.uniformBuffer.destroy(),this.releaseTexturedMeshTexture(n),this.texturedMeshes.splice(t,1),r=!0)}for(let e of n)this.pendingBatchKeys.add(e);return this.evictHighlightMeshes(e),this.removeInstancedEntity(e)&&(r=!0),r}removeInstancedEntity(e){if(!this.instancedEntityMap.has(e))return!1;let t=this.instancedDevice;return t&&!this.instanceSuppression.has(e)&&(this.instancedHidden.add(e),this.writeInstanceFlags(t,e)),this.instancedSelected.has(e)&&this.bumpTemplateSelectedCount(e,-1),this.instanceSuppression.forget(e),this.instancedEntityMap.delete(e),this.instancedSelected.delete(e),this.instancedHidden.delete(e),this.instancedOverridden.delete(e),this.boundingBoxes.delete(e),!0}removeMeshesForEntities(e){let t=0;for(let n of e)this.removeMeshesForEntity(n)&&t++;return t}translateMeshesForEntity(e,t){this.appearanceController?.cancelFor(e);let n=this.translateFlatMeshesForEntity(e,t),r=this.translateInstancedEntity(e,t);return n||r}rebucketMovedMesh(e,t){let n=this.meshDataBucket.get(e);if(n&&(t.add(n.key),this.markBucketDirty(n.key)),!this.spatialChunking||!n)return;let r=this.bucketBaseKey(e);if(this.baseColorKey(n.key)===r)return;let i=this.resolveActiveBucket(r,e);this.markBucketDirty(i);let a=n.meshData.indexOf(e);if(a>=0){let e=n.meshData.length-1;a!==e&&(n.meshData[a]=n.meshData[e]),n.meshData.pop()}let o=e.positions.length/3*X.BYTES_PER_VERTEX;n.vertexBytes=Math.max(0,n.vertexBytes-o);let s=this.buckets.get(i);s.meshData.push(e),this.meshDataBucket.set(e,s),t.add(i)}translateFlatMeshesForEntity(e,t){let n=this.meshDataMap.get(e);if(!n||n.length===0)return!1;let[i,a,o]=t;if(i===0&&a===0&&o===0)return!1;let s=new Set,c=!1;for(let t of n){if(t.entityIds&&t.entityIds.length>0){let n=!1;for(let r=0;r<t.entityIds.length;r++)if(t.entityIds[r]!==e){n=!0;break}if(n)continue}let n=t.positions;for(let e=0;e<n.length;e+=3)n[e]+=i,n[e+1]+=a,n[e+2]+=o;this.rebucketMovedMesh(t,s),c=!0}if(!c)return!1;if(this.texturedDevice&&this.texturedMeshes.length>0){let t=n.filter(e=>r.hasRenderableTexture(e));if(t.length>0){let n=this.texturedMeshes.filter(t=>t.expressId===e);for(let e=0;e<n.length&&e<t.length;e++){let r=Vc(t[e]);r&&(this.texturedDevice.queue.writeBuffer(n[e].vertexBuffer,0,r),rl(this.modelTranslations,n[e],t[e]))}}}this.boundingBoxes.delete(e),this.evictHighlightMeshes(e);for(let e of s)this.pendingBatchKeys.add(e);return!0}translateInstancedEntity(e,t){let n=this.instancedEntityMap.get(e);if(!n||n.length===0)return!1;let[r,i,a]=t;if(r===0&&i===0&&a===0)return!1;let o=this.instancedDevice,s=!1;for(let e of n){let t=this.instancedTemplateCpu[e.templateIndex];if(!t)continue;let n=e.byteOffset,c=Cl(t,n,[r,i,a]),l=this.instancedTemplates[e.templateIndex];l&&$e(l.rteDeltas),o&&l&&o.queue.writeBuffer(l.instanceBuffer,n+48,c),s=!0}return s?(this.recomputeInstancedBounds(e),!0):!1}recomputeInstancedBounds(e){let t=this.instancedEntityMap.get(e);if(t&&t.length!==0){this.boundingBoxes.delete(e);for(let n of t){let t=this.instancedTemplateCpu[n.templateIndex];if(!t)continue;let r=new DataView(t.instanceData),i=this.unionInstancedWorldAabb(e,r,n.byteOffset,t.canonicalAnchors,t.localMin[0],t.localMin[1],t.localMin[2],t.localMax[0],t.localMax[1],t.localMax[2]),a=this.instancedTemplates[n.templateIndex];a&&Xe(a,i)}this.instanceSuppression.has(e)&&this.boundingBoxes.delete(e)}}evictHighlightMeshes(e,t=!1){if(this.meshes.length===0)return;let n=[];for(let r of this.meshes)r.expressId===e&&(!t||r.hydrated)?$(r):n.push(r);this.meshes=n}translationScope(){let e=this.finalizeInProgress?[...new Set([...this.batchedMeshes,...[...this.buckets.values()].flatMap(e=>e.batchedMesh?[e.batchedMesh]:[])])]:this.batchedMeshes;return{translations:this.modelTranslations,pieces:this.meshDataMap,bounds:this.boundingBoxes,batches:e,meshes:this.meshes,textured:this.texturedMeshes,templates:this.instancedTemplates,cpu:this.instancedTemplateCpu,occurrences:this.instancedEntityMap,device:this.instancedDevice,evictHighlight:e=>this.evictHighlightMeshes(e,!0),clearPartial:()=>this.dropAllPartialCaches(),unionBounds:(e,t,n,r,i,a)=>this.unionInstancedWorldAabb(e,t,n,r,...i,...a)}}dropOrphanedSuppressedBounds(){for(let e of this.instanceSuppression.suppressedIds())this.meshDataMap.has(e)||this.boundingBoxes.delete(e)}getModelTranslation(e){return this.modelTranslations.get(e)}setModelTranslation(e,t){let n=$c(this.translationScope(),e,t);return this.dropOrphanedSuppressedBounds(),n}getModelRotation(e){return this.modelTranslations.getYaw(e)}setModelRotation(e,t,n){let r=t===0?null:{angle:t,px:n[0],pz:n[2]},i=tl(this.translationScope(),e,r);return this.dropOrphanedSuppressedBounds(),i}translateMeshesForEntities(e){let t=0;for(let[n,r]of e)this.translateMeshesForEntity(n,r)&&t++;return t}rotateMeshesForEntity(e,t,n){this.appearanceController?.cancelFor(e);let i=this.meshDataMap.get(e);if(!i||i.length===0||t===0)return!1;let a=Math.cos(t),o=Math.sin(t),s=new Set,c=!1;for(let t of i){if(t.entityIds&&t.entityIds.length>0){let n=!1;for(let r=0;r<t.entityIds.length;r++)if(t.entityIds[r]!==e){n=!0;break}if(n)continue}let r=n[0]-(t.origin?.[0]??0),i=n[2]-(t.origin?.[2]??0),l=t.positions;for(let e=0;e<l.length;e+=3){let t=l[e]-r,n=l[e+2]-i;l[e]=r+t*a+n*o,l[e+2]=i-t*o+n*a}let u=t.normals;if(u)for(let e=0;e<u.length;e+=3){let t=u[e],n=u[e+2];u[e]=t*a+n*o,u[e+2]=-t*o+n*a}this.rebucketMovedMesh(t,s),c=!0}if(!c)return!1;if(this.texturedDevice&&this.texturedMeshes.length>0){let t=i.filter(e=>r.hasRenderableTexture(e));if(t.length>0){let n=this.texturedMeshes.filter(t=>t.expressId===e);for(let e=0;e<n.length&&e<t.length;e++){let r=Vc(t[e]);r&&(this.texturedDevice.queue.writeBuffer(n[e].vertexBuffer,0,r),rl(this.modelTranslations,n[e],t[e]))}}}this.boundingBoxes.delete(e),this.evictHighlightMeshes(e);for(let e of s)this.pendingBatchKeys.add(e);return!0}rotateMeshesForEntities(e){let t=0;for(let[n,{angle:r,pivot:i}]of e)this.rotateMeshesForEntity(n,r,i)&&t++;return t}queueMeshes(e){for(let t=0;t<e.length;t++){let n=this.splitMeshForStreaming(e[t]);for(let e=0;e<n.length;e++)this.meshQueue.push(n[e])}}hasQueuedMeshes(){return this.meshQueueReadIndex<this.meshQueue.length}hasStreamingFragments(){return this.streamingFragments.length>0||this.streamedBucketKeys.size>0}isFinalizeInProgress(){return this.finalizeInProgress}isEphemeralStreaming(){return this.ephemeralStreamingMode}setEphemeralStreamingMode(e){this.ephemeralStreamingMode=e}flushPending(e,t,n=12,i,a=!1){let o=wc(this.meshQueue,this.meshQueueReadIndex,(n,r)=>{this.meshQueueReadIndex=r,this.appendToBatches(n,e,t,!0)},{budgetMs:n,trace:i,deterministicUploads:a,maxIndicesPerAppend:r.STREAMING_FRAGMENT_MAX_INDICES});return this.meshQueue=o.queue,this.meshQueueReadIndex=o.readIndex,o.processed>0}createStreamingFragments(e,t,n){if(e.length===0)return;let r=new Map;for(let t of e){let e=this.meshDataBucket.get(t)?.key??this.bucketBaseKey(t);for(let n of this.splitMeshForStreaming(t)){let t=r.get(e);t||(t=[],r.set(e,t)),t.push(n)}}for(let[e,i]of r){let r=this.splitMeshDataForBufferLimit(i,this.cachedMaxBufferSize);for(let i of r){let r=i[0].color,a=this.createBatchedMesh(i,r,t,n,void 0,void 0,this.buckets.get(e)?.frameOrigin);this.batchedMeshes.push(a),this.streamingFragments.push(a)}}}splitMeshForStreaming(e){return Uc(e,r.STREAMING_FRAGMENT_MAX_INDICES,r.STREAMING_FRAGMENT_MAX_VERTEX_BYTES)}finalizeStreaming(e,t){if(this.hasStreamingFragments()){this.finalizeInProgress=!0;try{this.finalizeStreamingInner(e,t)}finally{this.finalizeInProgress=!1}}}regroupStreamed(){return ll({buckets:this.buckets,meshDataBucket:this.meshDataBucket,activeBucketKey:this.activeBucketKey,coldBuckets:this.coldBuckets,pendingBatchKeys:this.pendingBatchKeys,streamedBucketKeys:this.streamedBucketKeys,bucketBaseKey:e=>this.bucketBaseKey(e),resolveActiveBucket:(e,t)=>this.resolveActiveBucket(e,t),createBucket:e=>({key:e,meshData:[],batchedMesh:null,vertexBytes:0})})}retireFinalizedBatches(e){for(let t of e)this.dropPartialCacheForBatch(t),this.lastDrawnFrame.delete(t.id),$(t)}finalizeStreamingInner(r,i){let a=this.streamingFragments;t(`render.finalize`,a.length,`fragments`);let o=this.batchedMeshes,s=new Set(a),c=new Set(o),l=null,u=!1;try{this.streamingFragments=[],l=this.regroupStreamed(),this.batchedMeshes=[],this.rebuildPendingBatches(r,i),u=!0}finally{if(!u){for(let e of this.batchedMeshes)!c.has(e)&&!s.has(e)&&$(e);l?.rollback(),this.streamingFragments=a,this.batchedMeshes=o}}this.retireFinalizedBatches(a),this.retireFinalizedBatches(l?.retired??[]),e.enabled&&n(`render.finalize.batches`,this.batchedMeshes.filter(e=>!c.has(e)).length)}finalizeStreamingAsync(e,r,i=8,a){let o=a?.enabled?a.begin(`scene.finalize`,{fragments:this.streamingFragments.length,ephemeral:this.ephemeralStreamingMode}):-1;if(this.ephemeralStreamingMode)return this.finishEphemeralStreaming(),a?.end(o),Promise.resolve();if(!this.hasStreamingFragments())return a?.end(o),Promise.resolve();this.finalizeInProgress=!0;let s=this,c=this.streamingFragments;t(`render.finalize`,c.length,`fragments`);let l=this.batchedMeshes,u=new Set(c),d=new Set(l);return new Promise((t,f)=>{let p=[],m=[],h=null,g=[],_=0,v=0;function y(){for(let{bucket:e,previous:t,previousFrameOrigin:n,batch:r}of p)e.batchedMesh===r&&(e.batchedMesh=t,e.frameOrigin=n),!d.has(r)&&!u.has(r)&&$(r);h?.rollback(),s.streamingFragments=[...c,...s.streamingFragments],s.batchedMeshes=l,s.finalizeInProgress=!1}function b(){try{let l=performance.now();for(v++;_<g.length;){let t=g[_++],n=s.buckets.get(t);if(!n||n.meshData.length===0){m.push(t);continue}let a=n.meshData[0].color,o=n.batchedMesh,c=n.frameOrigin,u=s.createBatchedMesh(n.meshData,a,e,r,t);if(n.batchedMesh=u,n.frameOrigin=u.origin,p.push({bucket:n,previous:o,previousFrameOrigin:c,batch:u}),performance.now()-l>=i){setTimeout(b,0);return}}let u=[...c,...h?.retired??[]];for(let{previous:e}of p)e&&u.push(e);for(let e of m){let t=s.buckets.get(e)?.batchedMesh;t&&u.push(t),s.buckets.delete(e)}s.batchedMeshes=[...[...s.buckets.values()].flatMap(e=>e.batchedMesh?[e.batchedMesh]:[]),...s.streamingFragments],s.retireFinalizedBatches(u),n(`render.finalize.batches`,p.length),s.finalizeInProgress=!1,a?.end(o,{batches:p.length,chunks:v}),t()}catch(e){y(),a?.end(o,{error:!0}),f(e)}}try{s.streamingFragments=[];let e=performance.now();h=s.regroupStreamed(),a?.enabled&&a.record(`scene.finalize.regroup`,e,performance.now(),void 0,o),g=Array.from(s.pendingBatchKeys),s.pendingBatchKeys.clear()}catch(e){y(),a?.end(o,{error:!0}),f(e);return}b()})}finishEphemeralStreaming(){if(this.streamingFragments.length===0)this.ephemeralStreamingMode=!1;else{for(let[e,t]of this.meshDataMap)Ps(e,t,this.boundingBoxes);this.modelTranslations.retainEntityBounds(this.meshDataMap),this.streamingFragments=[],this.buckets.clear(),this.meshDataBucket=new Map,this.meshDataMap.clear(),nl(this.instancedTemplateCpu),this.activeBucketKey.clear(),this.lastDrawnFrame.clear(),this.residencyRestoreQueue.clear(),this.coldBuckets.clear(),this.dirtyBuckets.clear(),this.pendingBatchKeys.clear(),this.streamedBucketKeys.clear(),this.dropAllPartialCaches(),this.geometryReleased=!0,this.ephemeralStreamingMode=!1}}releaseGeometryData(){if(!this.geometryReleased){if(this.instanceSuppression.retained)console.warn(`[Appearance] Retained occurrence history still needs CPU geometry`);else if(this.pendingBatchKeys.size>0||this.streamingFragments.length>0)console.warn(`[Scene] releaseGeometryData() called with ${this.pendingBatchKeys.size} pending batches and ${this.streamingFragments.length} streaming fragments still in-flight. Call finalizeStreaming()/rebuildPendingBatches() first.`);else{this.authoredGeneration++,this.authoredPreparations.invalidate(),this.appearanceController?.forget();for(let[e,t]of this.meshDataMap)Ps(e,t,this.boundingBoxes);this.modelTranslations.retainEntityBounds(this.meshDataMap),this.meshDataMap.clear(),nl(this.instancedTemplateCpu);for(let e of this.buckets.values())e.meshData=[];this.meshDataBucket=new Map,this.activeBucketKey.clear(),this.lastDrawnFrame.clear(),this.residencyRestoreQueue.clear(),this.coldBuckets.clear(),this.dirtyBuckets.clear(),this.dropAllPartialCaches(),this.geometryReleased=!0,console.log(`[Scene] Released JS geometry data. ${this.boundingBoxes.size} bounding boxes cached. ${this.batchedMeshes.length} GPU batches retained.`)}}}isGeometryDataReleased(){return this.geometryReleased}updateMeshColors(e,t,n){if(e.size===0)return;if(this.geometryReleased){console.warn(`[Scene] updateMeshColors called after geometry data was released — skipping.`);return}this.cachedMaxBufferSize===0&&(this.cachedMaxBufferSize=this.getMaxBufferSize(t));let r=new Set,i=new Set;for(let[t,n]of e){this.appearanceController?.cancelFor(t);let e=this.meshDataMap.get(t);if(e)for(let t of e){let e=this.bucketBaseKey(t,n),a=this.meshDataBucket.get(t),o=a?.key??this.bucketBaseKey(t);if(this.baseColorKey(o)!==e){let s=this.resolveActiveBucket(e,t);if(r.add(o),i.add(s),this.markBucketDirty(o),this.markBucketDirty(s),a){let e=a.meshData.indexOf(t);if(e>=0){let t=a.meshData.length-1;e!==t&&(a.meshData[e]=a.meshData[t]),a.meshData.pop()}}let c=t.positions.length/3*X.BYTES_PER_VERTEX;a&&(a.vertexBytes=Math.max(0,a.vertexBytes-c)),t.color=n;let l=this.buckets.get(s);l||(l={key:s,meshData:[],batchedMesh:null,vertexBytes:0},this.buckets.set(s,l)),l.meshData.push(t),this.meshDataBucket.set(t,l)}}}for(let e of r)this.pendingBatchKeys.add(e);for(let e of i)this.pendingBatchKeys.add(e);this.pendingBatchKeys.size>0&&this.rebuildPendingBatches(t,n)}createBatchedMesh(e,t,n,r,i,a=this.quantizedBatchesEnabled?`auto`:`off`,o){let s=e[0]?.modelIndex??0,c=this.modelTranslations.get(s),l=Es(e,o??this.meshDataBucket.get(e[0])?.batchedMesh?.origin,this.modelTranslations.frameOrigin(this.sharedFrameOrigins.get(s)??null,s),this.meshDataBucket.get(e[0])?.frameOrigin);if(!l)throw Error(`Unable to resolve a topology-safe GPU frame for mesh geometry.`);let u=Sc(e,t,n,r,{id:this.nextBatchId,colorKey:i??this.colorKey(t,e[0]?.material),origin:l,quantized:a,lod:this.lodBuildsEnabled},i);return this.nextBatchId++,!this.sharedFrameOrigins.has(s)&&u.origin&&this.sharedFrameOrigins.set(s,[u.origin[0]-c[0],u.origin[1]-c[1],u.origin[2]-c[2]]),this.modelTranslations.registerDrawable(u,s)}getMaxBufferSize(e){let t=e.limits?.maxBufferSize??X.FALLBACK_MAX_BUFFER_SIZE;return Math.floor(t*X.BUFFER_SIZE_SAFETY_FACTOR)}splitMeshDataForBufferLimit(e,t){return Ns(e,t)}resolveActiveBucket(e,t){let n=t.modelIndex??0;return Kc({buckets:this.buckets,activeKeys:this.activeBucketKey,coldKeys:this.coldBuckets,maxBufferSize:this.cachedMaxBufferSize,sharedOrigin:this.modelTranslations.frameOrigin(this.sharedFrameOrigins.get(n)??null,n),nextSplitKey:()=>`${e}#${this.nextSplitId++}`},e,t)}baseColorKey(e){let t=e.lastIndexOf(`#`);return t>=0?e.substring(0,t):e}canPartitionBatch(e){if(this.geometryReleased)return!1;let t=this.buckets.get(e.colorKey);if(!t||t.batchedMesh!==e||t.meshData.length===0)return!1;for(let e of t.meshData)if(e.entityIds&&e.entityIds.length>0)return!1;return!0}getOrCreatePartialBatch(e,t,n,r,i,a){if(this.geometryReleased)return;if(a!==void 0&&this.partialBatchCacheVersions.get(e)===a){let t=this.partialBatchCacheKeys.get(e);if(t!==void 0){let e=this.partialBatchCache.get(t);if(e)return e}}let o=Array.from(n).sort((e,t)=>e-t),s=0x811c9dc5;for(let e of o)s^=e,s=Math.imul(s,0x1000193),s>>>=0;let c=`${e}:${`${o.length}:${s.toString(16)}`}`,l=this.partialBatchCacheKeys.get(e);if(l===c){let t=this.partialBatchCache.get(c);if(t)return a!==void 0&&this.partialBatchCacheVersions.set(e,a),t}if(l&&l!==c){let e=this.partialBatchCache.get(l);e&&($(e),this.partialBatchCache.delete(l))}let u=this.buckets.get(t),d=this.baseColorKey(t),f=[];for(let e of n)for(let t of this.meshDataMap.get(e)??[])(u?this.meshDataBucket.get(t)===u:this.bucketBaseKey(t)===d)&&f.push(t);if(f.length===0)return;let p=f[0].color,m=this.createBatchedMesh(f,p,r,i,void 0,Yc(this.quantizedBatchesEnabled,u?.batchedMesh),u?.batchedMesh?.origin);return this.partialBatchCache.set(c,m),this.partialBatchCacheKeys.set(e,c),a!==void 0&&this.partialBatchCacheVersions.set(e,a),m}setColorOverrides(e,t,n){this.colorOverrideGeneration++,e.size===0?this.clearColorOverrideState():(this.colorOverrides=Xc(e),this.entityColorTable.write(t,this.colorOverrides),this.setInstancedColorOverrides(e))}clearColorOverrides(){this.colorOverrideGeneration++,this.clearColorOverrideState()}clearColorOverrideState(){this.colorOverrides=null,this.entityColorTable.clear(),this.setInstancedColorOverrides(null)}getColorOverrideGeneration(){return this.colorOverrideGeneration}getEntityColorTable(){return this.entityColorTable}getColorOverrides(){return this.colorOverrides}releaseColorOverrideGpu(){this.entityColorTable.releaseGpu()}getTexturedMeshes(){return this.texturedMeshes}getResidentGpuBytes(){return Ya({batches:this.batchedMeshes.filter(e=>e.gpuResident!==!1),partialBatches:this.partialBatchCache.values(),meshes:this.meshes,textured:this.texturedMeshes,instanced:this.liveInstancedTemplates})}setInstancedVisible(e){this.instancedVisible=e}getInstancedTemplates(){return this.instancedVisible?this.liveInstancedTemplates:Ul}refreshLiveInstancedTemplates(){let e=[];for(let t of this.instancedTemplates)t&&e.push(t);this.liveInstancedTemplates=e}getInstancedModelIndices(){let e=new Set;for(let t of this.instancedTemplates)t&&e.add(t.modelIndex);return[...e]}removeInstancedTemplatesForModel(e){this.instanceSuppression.forgetModel(e);let t=new Set;for(let n=0;n<this.instancedTemplates.length;n++){let r=this.instancedTemplates[n];r&&r.modelIndex===e&&(gc(r),this.instancedTemplates[n]=void 0,this.instancedTemplateCpu[n]=void 0,t.add(n))}if(t.size===0)return 0;for(let[e,n]of this.instancedEntityMap){let r=n.filter(e=>!t.has(e.templateIndex));r.length!==n.length&&(r.length>0?(this.instancedEntityMap.set(e,r),this.recomputeInstancedWorldAabb(e,r)):(this.instancedEntityMap.delete(e),this.instancedSelected.delete(e),this.instancedHidden.delete(e),this.instancedOverridden.delete(e),this.meshDataMap.has(e)||this.boundingBoxes.delete(e)))}return this.refreshLiveInstancedTemplates(),this.lastInstancedVisibilityVersion=-1,this.instancedVisibilityDirty=!0,t.size}recomputeInstancedWorldAabb(e,t){let n=1/0,r=1/0,i=1/0,a=-1/0,o=-1/0,s=-1/0,c=!1;for(let e of t){let t=this.instancedTemplateCpu[e.templateIndex];if(!t||!Number.isFinite(t.localMin[0]))continue;let l=new DataView(t.instanceData),[u,d,f]=t.localMin,[p,m,h]=t.localMax,g=e.byteOffset,_=l.getFloat32(g+0,!0),v=l.getFloat32(g+4,!0),y=l.getFloat32(g+8,!0),b=l.getFloat32(g+16,!0),x=l.getFloat32(g+20,!0),S=l.getFloat32(g+24,!0),C=l.getFloat32(g+32,!0),w=l.getFloat32(g+36,!0),T=l.getFloat32(g+40,!0),E=l.getFloat32(g+48,!0),D=l.getFloat32(g+52,!0),O=l.getFloat32(g+56,!0);for(let e=0;e<8;e++){let t=e&1?p:u,c=e&2?m:d,l=e&4?h:f,g=_*t+b*c+C*l+E,k=v*t+x*c+w*l+D,A=y*t+S*c+T*l+O;g<n&&(n=g),k<r&&(r=k),A<i&&(i=A),g>a&&(a=g),k>o&&(o=k),A>s&&(s=A)}c=!0}c?this.boundingBoxes.set(e,{min:{x:n,y:r,z:i},max:{x:a,y:o,z:s}}):this.boundingBoxes.delete(e)}addInstancedShard(e,t,n=0){if(t.instances.some(e=>this.instanceSuppression.owns(e.entityId)))throw Error(`Cannot append geometry to a retained appearance occurrence`);this.instancedDevice=e;let r=Ye(t),i=new Set,a=new Set;for(let t of r){let r=Math.floor(t.positions.length/3);if(r===0||t.indices.length===0||t.instanceCount===0)continue;let o=new ArrayBuffer(r*28),s=new Float32Array(o);for(let e=0;e<r;e++){let n=e*7;s[n+0]=t.positions[e*3+0],s[n+1]=t.positions[e*3+1],s[n+2]=t.positions[e*3+2],s[n+3]=e*3+0<t.normals.length?t.normals[e*3+0]:0,s[n+4]=e*3+1<t.normals.length?t.normals[e*3+1]:0,s[n+5]=e*3+2<t.normals.length?t.normals[e*3+2]:0}let c=yc(e,o,GPUBufferUsage.VERTEX),l=yc(e,t.indices,GPUBufferUsage.INDEX);this.modelTranslations.placeInstances(t.instanceBuffer,n,88,t.canonicalAnchors,t.canonicalMatrixTranslations);let u=t.instanceCount*88,d=yc(e,new Uint8Array(t.instanceBuffer,0,u),GPUBufferUsage.VERTEX),f;try{f=Qe(e,t.instanceCount)}catch(e){throw c.destroy(),l.destroy(),d.destroy(),e}let p=this.instancedTemplates.length,m={modelIndex:n,vertexBuffer:c,indexBuffer:l,indexCount:t.indices.length,instanceBuffer:d,instanceCount:t.instanceCount,canonicalAnchors:t.canonicalAnchors,rteDeltas:f,bounds:null,maxOccRadius:0,selectedCount:0};this.instancedTemplates[p]=m;let h=1/0,g=1/0,_=1/0,v=-1/0,y=-1/0,b=-1/0;for(let e=0;e<t.positions.length;e+=3){let n=t.positions[e],r=t.positions[e+1],i=t.positions[e+2];n<h&&(h=n),r<g&&(g=r),i<_&&(_=i),n>v&&(v=n),r>y&&(y=r),i>b&&(b=i)}this.instancedTemplateCpu[p]={modelIndex:n,positions:t.positions,normals:t.normals,indices:t.indices,instanceData:t.instanceBuffer,canonicalAnchors:t.canonicalAnchors,canonicalMatrixTranslations:t.canonicalMatrixTranslations,localMin:[h,g,_],localMax:[v,y,b]};let x=new DataView(t.instanceBuffer),S=Number.isFinite(h);for(let e=0;e<t.instanceCount;e++){let n=e*88,r=t.entityIds[e],o=[x.getFloat32(n+68,!0),x.getFloat32(n+68+4,!0),x.getFloat32(n+68+8,!0),x.getFloat32(n+68+12,!0)],s=this.instancedEntityMap.get(r);s||(s=[],this.instancedEntityMap.set(r,s)),s.push({templateIndex:p,byteOffset:n,originalColor:o,itemId:t.itemIds?.[e]||void 0,finishBits:(x.getUint32(n+84,!0)&Ue)>>>0}),this.instancedSelected.has(r)&&(m.selectedCount++,i.add(r)),this.instancedOverrideColors?.has(r)&&a.add(r),S&&Xe(m,this.unionInstancedWorldAabb(r,x,n,t.canonicalAnchors,h,g,_,v,y,b))}}this.refreshLiveInstancedTemplates();for(let t of i)this.writeInstanceFlags(e,t);for(let t of a){let n=this.instancedOverrideColors?.get(t);n&&this.writeInstanceColor(e,t,qc(n,this.instancedGhosted.has(t),this.lastGhostAlpha))}this.instancedVisibilityDirty=!0,this.instancedGhostDirty=!0}unionInstancedWorldAabb(e,t,n,r,i,a,o,s,c,l){return il(this.boundingBoxes,e,t,n,r,i,a,o,s,c,l)}getInstancedTemplatesOf(e,t){return this.instancedVisible?[...new Set((this.instancedEntityMap.get(e)??[]).map(e=>e.templateIndex))].flatMap(e=>{let n=this.instancedTemplates[e];return n&&(t===void 0||n.modelIndex===t)?[n]:[]}):[]}isInstancedEntity(e){return this.instancedEntityMap.has(e)}retainInstancedOccurrence(e,t){let n=this.instancedEntityMap.get(e);if(this.geometryReleased||this.finalizeInProgress||this.streamingFragments.length||this.pendingBatchKeys.size||!n?.length||n.some(e=>this.instancedTemplates[e.templateIndex]?.modelIndex!==t||!this.instancedTemplateCpu[e.templateIndex]?.positions.length))throw Error(`Appearance requires resident instances owned by the specified model`);return this.instanceSuppression.acquire(e,t)}*getInstancedEntityIds(){for(let e of this.instancedEntityMap.keys())this.instanceSuppression.has(e)||(yield e)}getInstancedEntityCount(){return this.instancedEntityMap.size}getAllInstancedMeshData(){let e=[];for(let t of this.instancedEntityMap.keys()){let n=this.getInstancedMeshDataPieces(t);n&&e.push(...n)}return e}getInstancedEntityBounds(e){return!this.instancedEntityMap.has(e)||this.instanceSuppression.has(e)?null:this.boundingBoxes.get(e)??null}getInstancedMeshDataPieces(e){let t=this.instancedEntityMap.get(e);if(t&&t.length!==0&&!this.instanceSuppression.has(e))return _c(e,t,this.instancedTemplateCpu)}setInstancedSelection(e,t,n){let r=this.instancedDevice;if(!r||this.instancedTemplates.length===0)return;let i=e.size!==this.instancedSelected.size;if(!i){for(let t of e)if(!this.instancedSelected.has(t)){i=!0;break}}let a=t!==this.instancedSelectedItemExpressId||n!==this.instancedSelectedItemId;if(!i&&!a)return;let o=this.instancedSelected;this.instancedSelected=new Set(e);let s=this.instancedSelectedItemExpressId;this.instancedSelectedItemExpressId=t,this.instancedSelectedItemId=n;for(let t of o)e.has(t)||(this.writeInstanceFlags(r,t),this.bumpTemplateSelectedCount(t,-1));for(let t of e)o.has(t)||(this.writeInstanceFlags(r,t),this.bumpTemplateSelectedCount(t,1));if(a){let n=[s,t].filter(e=>e!==void 0);for(let t of new Set(n))o.has(t)===e.has(t)&&e.has(t)&&this.writeInstanceFlags(r,t)}}bumpTemplateSelectedCount(e,t){let n=this.instancedEntityMap.get(e);if(n)for(let e of n){let n=this.instancedTemplates[e.templateIndex];n&&(n.selectedCount=Math.max(0,n.selectedCount+t))}}setInstancedVisibility(e,t){let n=this.instancedDevice;if(!n||this.instancedTemplates.length===0)return;let r=this.instancedVisibilityEpochs.update(e,t);if(!this.instancedVisibilityDirty&&r===this.lastInstancedVisibilityVersion)return;this.instancedVisibilityDirty=!1,this.lastInstancedVisibilityVersion=r;let i=new Set;for(let n of this.instancedEntityMap.keys())Q(n,e,t)||i.add(n);let a=i.size!==this.instancedHidden.size;if(!a){for(let e of i)if(!this.instancedHidden.has(e)){a=!0;break}}if(!a)return;let o=this.instancedHidden;this.instancedHidden=i;for(let e of o)i.has(e)||this.writeInstanceFlags(n,e);for(let e of i)o.has(e)||this.writeInstanceFlags(n,e)}setInstancedColorOverrides(e){let t=this.instancedDevice;if(!t||this.instancedTemplates.length===0)return;let n=e??new Map;for(let e of this.instancedOverridden)n.has(e)||this.restoreInstanceColor(t,e);let r=!1;for(let[e,i]of n)this.writeInstanceColor(t,e,qc(i,this.instancedGhosted.has(e),this.lastGhostAlpha)),i[3]<.99&&(r=!0);this.instancedOverridden=new Set(n.keys()),this.instancedOverrideColors=n.size>0?n:null,this.instancedHasTransparent=r,this.instancedGhostDirty=!0}hasTransparentInstances(){return this.instancedHasTransparent||this.instancedGhostTransparent}setInstancedGhosting(e,t,n){let r=this.instancedDevice;if(!r||this.instancedTemplates.length===0)return;let{next:i,toFade:a,toRestore:o,changed:s}=Qc({ghostExceptIds:e,selectedIds:t,instancedIds:this.instancedEntityMap.keys(),current:this.instancedGhosted,ghostAlpha:n,lastGhostAlpha:this.lastGhostAlpha,dirty:this.instancedGhostDirty});if(s){for(let e of o){let t=this.instancedOverrideColors?.get(e);t?this.writeInstanceColor(r,e,t):this.restoreInstanceColor(r,e)}for(let e of a){let t=this.instancedOverrideColors?.get(e);t?this.writeInstanceColor(r,e,[t[0],t[1],t[2],n]):this.writeOriginalInstanceColors(r,e,n)}this.instancedGhosted=i,this.lastGhostAlpha=n,this.instancedGhostDirty=!1,this.instancedGhostTransparent=i.size>0&&n<.99}}writeInstanceFlags(e,t){let n=this.instancedEntityMap.get(t);if(!n)return;let r=this.instancedHidden.has(t)||this.instanceSuppression.has(t)?2:0,i=this.instancedSelected.has(t),a=i&&t===this.instancedSelectedItemExpressId;for(let t of n){let n=a?+(t.itemId===this.instancedSelectedItemId):+!!i,o=this.instancedTemplates[t.templateIndex]?.instanceBuffer;o&&e.queue.writeBuffer(o,t.byteOffset+84,new Uint32Array([(n|r|(t.finishBits??0))>>>0]))}}writeInstanceColor(e,t,n){let r=this.instancedEntityMap.get(t);if(!r)return;let i=new Float32Array([n[0],n[1],n[2],n[3]]);for(let t of r){let n=this.instancedTemplates[t.templateIndex]?.instanceBuffer;n&&e.queue.writeBuffer(n,t.byteOffset+68,i)}}restoreInstanceColor(e,t){let n=this.instancedEntityMap.get(t);if(n)for(let t of n){let n=this.instancedTemplates[t.templateIndex]?.instanceBuffer;n&&e.queue.writeBuffer(n,t.byteOffset+68,new Float32Array(t.originalColor))}}writeOriginalInstanceColors(e,t,n){Jc(e,this.instancedEntityMap.get(t)??[],this.instancedTemplates,68,n)}static hasRenderableTexture(e){return!!e.uvs&&!!(e.texture||e.textureRef&&e.textureBitmap)}createTexturedMesh(e,t,n){let r=e.texture,i=e.textureRef,a=e.textureBitmap,o=Vc(e);if(!o||!(r||i&&a))return;this.texturedDevice=t;let s,c,l,u,d;try{if(s=t.createBuffer({size:o.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),t.queue.writeBuffer(s,0,o),c=t.createBuffer({size:e.indices.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST}),t.queue.writeBuffer(c,0,e.indices),r)u=this.rgbaTexturePool.acquire(r,t);else{let e=i.textureId,n=a,r=this.sharedTextures.get(e);if(!r){let i=t.createTexture({size:{width:n.width,height:n.height},format:`rgba8unorm`,usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT});u=i,t.queue.copyExternalImageToTexture({source:n},{texture:i},{width:n.width,height:n.height}),r={texture:i,refs:0},this.sharedTextures.set(e,r)}r.refs++,u=r.texture,d=e}let f=r?r.repeatS:i.repeatS,p=r?r.repeatT:i.repeatT,m=e=>e?`repeat`:`clamp-to-edge`,h=t.createSampler({addressModeU:m(f),addressModeV:m(p),magFilter:`linear`,minFilter:`linear`,mipmapFilter:`linear`});l=t.createBuffer({size:n.getUniformBufferSize(),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let g=n.createTexturedBindGroup(l,u.createView(),h),_=Ds([e]),v=this.modelTranslations.registerDrawable({expressId:e.expressId,modelIndex:e.modelIndex,bounds:_?{min:[_.min.x,_.min.y,_.min.z],max:[_.max.x,_.max.y,_.max.z]}:void 0,vertexBuffer:s,indexBuffer:c,indexCount:e.indices.length,uniformBuffer:l,texture:u,sampler:h,bindGroup:g,color:e.color,...e.material?{finish:e.material}:{},origin:e.origin?[e.origin[0],e.origin[1],e.origin[2]]:[0,0,0],...d===void 0?{}:{sharedTextureKey:d}},e.modelIndex??0);this.texturedMeshes.push(v),this.texturedSourcePositions.set(v,e.positions)}catch(e){throw s?.destroy(),c?.destroy(),l?.destroy(),u&&this.releaseTexturedMeshTexture({texture:u,sharedTextureKey:d}),e}}releaseTexturedMeshTexture(e){if(e.sharedTextureKey===void 0){this.rgbaTexturePool.release(e.texture)||e.texture.destroy();return}let t=this.sharedTextures.get(e.sharedTextureKey);t&&(t.refs--,t.refs<=0&&(this.sharedTextures.delete(e.sharedTextureKey),t.texture.destroy()))}destroyAllInstancedTemplates(){for(let e of this.instancedTemplates)e&&gc(e);this.instancedTemplates=[],this.liveInstancedTemplates=[],this.instancedTemplateCpu=[],this.instanceSuppression.forget(),this.instancedEntityMap.clear(),this.instancedSelected.clear(),this.instancedSelectedItemExpressId=this.instancedSelectedItemId=void 0,this.instancedHidden.clear(),this.instancedOverridden.clear(),this.instancedGhosted.clear(),this.instancedGhostDirty=!1,this.instancedOverrideColors=null,this.instancedHasTransparent=!1,this.instancedGhostTransparent=!1,this.lastInstancedVisibilityVersion=-1,this.instancedVisibilityDirty=!1,this.instancedDevice=void 0}clear(){this.modelTranslations.clear(),this.destroyAllInstancedTemplates(),this.clearFlatGeometry()}clearFlatGeometry(){this.authoredGeneration++,this.authoredPreparations.invalidate(),this.instanceSuppression.restore(),this.appearanceController?.forget(),this.clearFlatBuffers()}clearFlatGeometryForRebuild(e,t,n=e){this.authoredGeneration++,this.authoredPreparations.invalidate();let r=this.appearanceController?.prepareRebuild(n,t)??new Set,i=this.appearanceController?.discardedForRebuild(r)??[];this.instanceSuppression.restore(new Set([...r,...i]));for(let e of i)this.removeInstancedEntity(e);this.appearanceController?.finishRebuild(r),this.clearFlatBuffers()}clearFlatBuffers(){for(let e of this.meshes)$(e);for(let e of this.batchedMeshes)$(e);for(let e of this.texturedMeshes)e.vertexBuffer.destroy(),e.indexBuffer.destroy(),e.uniformBuffer.destroy(),this.releaseTexturedMeshTexture(e);this.texturedMeshes=[];for(let e of this.sharedTextures.values())e.texture.destroy();this.sharedTextures.clear(),this.rgbaTexturePool.clear(),this.dropAllPartialCaches(),this.colorOverrideGeneration++,this.streamingFragments=[],this.colorOverrides=null,this.entityColorTable.clear(),this.entityColorTable.releaseGpu(),this.sharedFrameOrigins.clear(),this.meshes=[],this.batchedMeshes=[],this.buckets.clear(),this.meshDataBucket=new Map,this.meshDataMap.clear(),this.modelTranslations.clearFlatBounds(),this.boundingBoxes.clear();for(let e of this.instancedEntityMap.keys())this.recomputeInstancedBounds(e);this.activeBucketKey.clear(),this.lastDrawnFrame.clear(),this.residencyRestoreQueue.clear(),this.coldBuckets.clear(),this.dirtyBuckets.clear(),this.cachedMaxBufferSize=0,this.pendingBatchKeys.clear(),this.streamedBucketKeys.clear(),this.meshQueue=[],this.meshQueueReadIndex=0,this.geometryReleased=!1,this.ephemeralStreamingMode=!1}getBounds(){if(this.geometryReleased){if(this.boundingBoxes.size===0)return null;let e=1/0,t=1/0,n=1/0,r=-1/0,i=-1/0,a=-1/0;for(let o of this.boundingBoxes.values())o.min.x<e&&(e=o.min.x),o.min.y<t&&(t=o.min.y),o.min.z<n&&(n=o.min.z),o.max.x>r&&(r=o.max.x),o.max.y>i&&(i=o.max.y),o.max.z>a&&(a=o.max.z);return{min:{x:e,y:t,z:n},max:{x:r,y:i,z:a}}}if(this.meshDataMap.size===0)return null;let e=1/0,t=1/0,n=1/0,r=-1/0,i=-1/0,a=-1/0,o=!1;for(let s of this.meshDataMap.values())for(let c of s){let s=c.positions,l=c.origin?c.origin[0]:0,u=c.origin?c.origin[1]:0,d=c.origin?c.origin[2]:0;for(let c=0;c<s.length;c+=3){let f=s[c]+l,p=s[c+1]+u,m=s[c+2]+d;Number.isFinite(f)&&Number.isFinite(p)&&Number.isFinite(m)&&(o=!0,f<e&&(e=f),p<t&&(t=p),m<n&&(n=m),f>r&&(r=f),p>i&&(i=p),m>a&&(a=m))}}return o?{min:{x:e,y:t,z:n},max:{x:r,y:i,z:a}}:null}getAllMeshDataExpressIds(){if(this.geometryReleased)return Array.from(this.boundingBoxes.keys());let e=new Set(this.meshDataMap.keys());for(let t of this.getInstancedEntityIds())e.add(t);return Array.from(e)}getEntityBoundingBox(e){return this.instanceSuppression.has(e)&&!this.meshDataMap.has(e)?null:Ps(e,this.meshDataMap.get(e),this.boundingBoxes)}getEntityLocalBounds(e){let t=this.meshDataMap.get(e);if(t&&t.length>0){let e=1/0,n=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=!1;for(let c of t){let t=c.localBounds;t&&(s=!0,t.min[0]<e&&(e=t.min[0]),t.min[1]<n&&(n=t.min[1]),t.min[2]<r&&(r=t.min[2]),t.max[0]>i&&(i=t.max[0]),t.max[1]>a&&(a=t.max[1]),t.max[2]>o&&(o=t.max[2]))}return s?{min:[e,n,r],max:[i,a,o]}:null}let n=this.instancedEntityMap.get(e);if(n&&n.length>0){let e=1/0,t=1/0,r=1/0,i=-1/0,a=-1/0,o=-1/0,s=!1;for(let c of n){let n=this.instancedTemplateCpu[c.templateIndex];n&&Number.isFinite(n.localMin[0])&&(s=!0,n.localMin[0]<e&&(e=n.localMin[0]),n.localMin[1]<t&&(t=n.localMin[1]),n.localMin[2]<r&&(r=n.localMin[2]),n.localMax[0]>i&&(i=n.localMax[0]),n.localMax[1]>a&&(a=n.localMax[1]),n.localMax[2]>o&&(o=n.localMax[2]))}return s?{min:[e,t,r],max:[i,a,o]}:null}return null}getEntityTransform(e){let t=this.meshDataMap.get(e);if(t&&t.length>0){for(let e of t)if(e.localToWorld&&e.localToWorld.length===16)return new Float64Array(e.localToWorld);return null}let n=this.instancedEntityMap.get(e);if(n&&n.length>0){let{templateIndex:e,byteOffset:t}=n[0],r=this.instancedTemplateCpu[e];if(!r)return null;let i=new DataView(r.instanceData),a=new Float64Array(16);for(let e=0;e<4;e++)for(let n=0;n<4;n++)a[e*4+n]=i.getFloat32(t+(n*4+e)*4,!0);return a}return null}raycast(e,t,n,r,i){let{rayDirInv:a,rayDirSign:o}=bo(t);if(this.geometryReleased)return xo(e,t,a,o,this.boundingBoxes,n,r,i);let s=So(e,t,a,o,this.meshDataMap,e=>this.getEntityBoundingBox(e),n,r,i),c=null;if(this.instancedEntityMap.size>0){let s=new Map;for(let t of this.instancedEntityMap.keys()){if(!Q(t,n,r))continue;let i=this.getInstancedEntityBounds(t);if(!i||!ho(e,a,o,i))continue;let c=this.getInstancedMeshDataPieces(t);c&&c.length>0&&s.set(t,c)}s.size>0&&(c=So(e,t,a,o,s,e=>this.getInstancedEntityBounds(e),n,r,i))}return s&&c?c.distance<s.distance?c:s:s??c}selectRect(e,t,n,r,i,a,o,s,c,l,u){if(!this.geometryReleased)for(let e of this.getAllMeshDataExpressIds())this.getEntityBoundingBox(e);return Gc(this.boundingBoxes,o,{x0:e,y0:t,x1:n,y1:r},i,a,s,c,l,u)}};function Gl(e){return r.fromViewProjMatrix(e.getViewProjection().m)}function Kl(e,t,n){return r.isAABBVisible(e,{min:[t.min[0]-n[0],t.min[1]-n[1],t.min[2]-n[2]],max:[t.max[0]-n[0],t.max[1]-n[1],t.max[2]-n[2]]})}function ql(e,t){return{planes:e.planes.map(e=>({normal:[...e.normal],distance:e.distance-e.normal[0]*t[0]-e.normal[1]*t[1]-e.normal[2]*t[2]}))}}function Jl(e){let t=e.m;return{depth:[t[10],t[11],t[14],t[15]],xy:[t[0],t[5],t[12],t[13]]}}function Yl(e,t){return .5*t*e.m[5]}var Xl={low:{resolutionDivisor:2,samples:12,spiralTurns:5},high:{resolutionDivisor:1,samples:16,spiralTurns:7}},Zl={min:.05,max:10},Ql=.15,$l=.1,eu=.04,tu=.85;function nu(e,t,n){let r=Xl[n].resolutionDivisor;return{width:Math.max(1,Math.ceil(e/r)),height:Math.max(1,Math.ceil(t/r))}}function ru(e,t){if(!Number.isInteger(e)||e<1||e>16)throw RangeError(`AO sample count must be an integer in [1, 16], got ${e}`);let n=new Float32Array(32);for(let r=0;r<e;r++){let i=(r+.5)/e,a=i*t*2*Math.PI;n[r*2]=i*Math.cos(a),n[r*2+1]=i*Math.sin(a)}return n}var iu={low:ru(Xl.low.samples,Xl.low.spiralTurns),high:ru(Xl.high.samples,Xl.high.spiralTurns)},au={depthParams:0,xyParams:4,viewport:8,ao:12,misc:16,kernel:20},ou=(au.kernel+32)*4;function su(e,t){let n=Xl[t.quality],r=Jl(t.projection),i=au;e.set(r.depth,i.depthParams),e.set(r.xy,i.xyParams),e[i.viewport]=t.width,e[i.viewport+1]=t.height,e[i.viewport+2]=1/t.width,e[i.viewport+3]=1/t.height,e[i.ao]=t.radius,e[i.ao+1]=Yl(t.projection,t.height),e[i.ao+2]=Ql*t.height,e[i.ao+3]=t.intensity,e[i.misc]=n.resolutionDivisor,e[i.misc+1]=n.samples,e[i.misc+2]=$l,e[i.misc+3]=eu,e.set(iu[t.quality],i.kernel)}var cu={min:1,max:3};function lu(e,t,n,r){return e===void 0||!Number.isFinite(e)?t:Math.min(r,Math.max(n,e))}var uu=class{state={enabled:!0,contactShading:{quality:`off`,intensity:.8,radius:1},separationLines:{enabled:!0,quality:`low`,intensity:.5,radius:1}};resolve(e){if(!e)return this.state;let t=this.state,n={enabled:e.enabled??t.enabled,contactShading:{quality:e.contactShading?.quality??t.contactShading.quality,intensity:lu(e.contactShading?.intensity,t.contactShading.intensity,0,1),radius:lu(e.contactShading?.radius,t.contactShading.radius,Zl.min,Zl.max)},separationLines:{enabled:e.separationLines?.enabled??t.separationLines.enabled,quality:e.separationLines?.quality??t.separationLines.quality,intensity:lu(e.separationLines?.intensity,t.separationLines.intensity,0,1),radius:lu(e.separationLines?.radius,t.separationLines.radius,cu.min,cu.max)}};return this.state=n,n}};function du(e,t){let n=t&&e.enabled,r=e.contactShading.quality;return{ambientOcclusion:n&&r!==`off`?r:null,edges:n&&e.separationLines.enabled&&e.separationLines.quality!==`off`}}function fu(e,t,n){let r=1/0,i=-1/0;for(let a of[e.x,t.x])for(let o of[e.y,t.y])for(let s of[e.z,t.z]){let e=a*n[0]+o*n[1]+s*n[2];e<r&&(r=e),e>i&&(i=e)}return{min:r,max:i}}function pu(e,t,n,r){let i=e.normal,a=e.distance,o=i!==void 0&&a!==void 0&&Number.isFinite(a)&&Number.isFinite(i[0])&&Number.isFinite(i[1])&&Number.isFinite(i[2]),s,c;if(o){let e=i[0],t=i[1],n=i[2],r=Math.sqrt(e*e+t*t+n*n);Number.isFinite(r)&&r>1e-6?(s=[e/r,t/r,n/r],c=a/r):(s=[0,1,0],c=a)}else{if(s=[0,0,0],e.axis===`side`?s[0]=1:e.axis===`down`?s[1]=1:s[2]=1,r!==void 0&&r!==0&&Number.isFinite(r)){let e=Math.cos(r),t=Math.sin(r),n=s[0],i=s[2];s[0]=n*e-i*t,s[2]=n*t+i*e;let a=Math.sqrt(s[0]*s[0]+s[1]*s[1]+s[2]*s[2]);a>1e-4&&(s[0]/=a,s[1]/=a,s[2]/=a)}let i=fu(t,n,s),a=i.min,o=i.max,l=e.axis===`side`?0:e.axis===`down`?1:2,u=Math.abs(s[l]-1)<=1e-6&&Math.abs(s[(l+1)%3])<=1e-6&&Math.abs(s[(l+2)%3])<=1e-6,d=e.min,f=e.max;u&&Number.isFinite(d)&&Number.isFinite(f)&&f-d>1e-6&&d>=a-.001&&f<=o+.001&&(a=d,o=f);let p=o-a;c=a+e.position/100*p}return{normal:s,distance:c,explicit:o}}function mu(e,t,n,r,i){let a=[];for(let o of e??[]){if(!o.enabled)continue;if(a.length>=i)break;let{normal:e,distance:s}=pu(o,t,n,r);a.push({normal:e,distance:s,flipped:o.flipped===!0,...o.id===void 0?{}:{id:o.id}})}return a}function hu(e,t,n){let[r,i,a]=e,{min:o,max:s}=n,c=(o.x+s.x)/2,l=(o.y+s.y)/2,u=(o.z+s.z)/2,d=t-(c*r+l*i+u*a),f=[c+r*d,l+i*d,u+a*d],{tangent:p,bitangent:m}=Wr([r,i,a]),h=.55*Math.hypot(s.x-o.x,s.y-o.y,s.z-o.z),g=(e,t)=>[f[0]+p[0]*h*e+m[0]*h*t,f[1]+p[1]*h*e+m[1]*h*t,f[2]+p[2]*h*e+m[2]*h*t];return{anchor:f,corners:[g(-1,-1),g(1,-1),g(1,1),g(-1,1)]}}function gu(e){let t=[],n=(n,r)=>{let{normal:i,distance:a}=pu(n,e.bounds.min,e.bounds.max,e.buildingRotation);t.push({id:n.id??null,primary:r,enabled:n.enabled,flipped:n.flipped===!0,normal:i,distance:a,...hu(i,a,e.bounds)})};e.primary&&n(e.primary,!0);for(let t of e.extras.slice(0,7))n(t,!1);return t}var _u=class{host;fillPipeline=null;textPipeline=null;constructor(e){this.host=e}hasGeometry(){return(this.fillPipeline?.hasGeometry()??!1)||(this.textPipeline?.hasGeometry()??!1)}init(e,t,n){this.fillPipeline=new Fi(e,t,n),this.textPipeline=new Ii(e,t,n)}destroy(){this.fillPipeline?.destroy(),this.fillPipeline=null,this.textPipeline?.destroy(),this.textPipeline=null}drawFills(e,t,n,r){this.fillPipeline?.hasGeometry()&&this.fillPipeline.render(e,t,n,r)}drawTexts(e,t,n,r,i,a,o){if(!this.textPipeline?.hasGeometry())return;let s=g(i.getPosition(),i.getTarget(),i.getUp());this.textPipeline.render(e,t,n,r,[s.right.x,s.right.y,s.right.z],[s.up.x,s.up.y,s.up.z],void 0,a,o)}uploadFills(e){if(!this.fillPipeline)return;this.fillPipeline.upload(e);let t=!1;for(let n of e){let e=n.points;if(e.length===0||n.definesExtent===!1)continue;let r=new Float32Array(e.length/2*3);for(let t=0,i=0;t<e.length;t+=2,i+=3)r[i]=e[t],r[i+1]=n.worldY,r[i+2]=e[t+1];n.origin?this.host.expandModelBoundsWithAnchoredLineVertices(r,n.origin,3):this.host.expandModelBoundsWithFlatVertices(r,3),t=!0}t&&this.host.syncCameraSceneBounds(),this.host.requestRender()}uploadTexts(e){if(!this.textPipeline)return;if(this.textPipeline.upload(e),e.length===0){this.host.requestRender();return}let t=new Float32Array(e.length*3),n=0,r=!1;for(let i of e){if(i.definesExtent===!1)continue;if(i.origin){this.host.expandModelBoundsWithAnchoredLineVertices(new Float32Array(i.worldPos),i.origin,3),r=!0;continue}let[e,a,o]=i.worldPos;t[n*3+0]=e,t[n*3+1]=a,t[n*3+2]=o,n++}n>0&&(this.host.expandModelBoundsWithFlatVertices(t.subarray(0,n*3),3),r=!0),r&&this.host.syncCameraSceneBounds(),this.host.requestRender()}},vu=28;function yu(e,t){let{positions:n,indices:r,color:i}=e,a=Math.floor(r.length/3),o=new Float32Array(a*3*7),s=0;for(let e=0;e<a;e+=1)for(let a=0;a<3;a+=1){let c=r[e*3+a]*3;o[s++]=n[c]-(t?.[0]??0),o[s++]=n[c+1]-(t?.[1]??0),o[s++]=n[c+2]-(t?.[2]??0),o[s++]=i[0],o[s++]=i[1],o[s++]=i[2],o[s++]=i[3]}return o}var bu=class{device;format;sampleCount;pipeline=null;bindGroupLayout=null;uniformBuffer=null;bindGroup=null;vertexBuffer=null;vertexCount=0;origin;constructor(e,t,n=1){this.device=e,this.format=t,this.sampleCount=n}init(){if(this.pipeline)return;this.bindGroupLayout=this.device.createBindGroupLayout({label:`clash-solid-bgl`,entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:`uniform`}}]});let e=this.device.createShaderModule({label:`clash-solid-shader`,code:ii});this.pipeline=this.device.createRenderPipeline({label:`clash-solid-pipeline`,layout:this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),vertex:{module:e,entryPoint:`vs_main`,buffers:[{arrayStride:vu,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x4`}]}]},fragment:{module:e,entryPoint:`fs_main`,targets:[{format:this.format,blend:{color:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`,operation:`add`}},writeMask:GPUColorWrite.ALL},{format:`rgba8unorm`,writeMask:0}]},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!0,depthCompare:`greater`,depthBias:-2,depthBiasSlopeScale:-.25,depthBiasClamp:0},multisample:{count:this.sampleCount}}),this.uniformBuffer=this.device.createBuffer({label:`clash-solid-camera`,size:160,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroup=this.device.createBindGroup({label:`clash-solid-bg`,layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]})}upload(e){if(this.init(),this.vertexBuffer&&=(this.vertexBuffer.destroy(),null),this.vertexCount=0,this.origin=void 0,!e||e.indices.length===0)return;let t=!e.origin&&e.positions instanceof Float64Array&&e.positions.length>=3?[e.positions[0],e.positions[1],e.positions[2]]:void 0,n=yu(e,t);n.length!==0&&(this.vertexBuffer=this.device.createBuffer({label:`clash-solid-vbuf`,size:n.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),this.device.queue.writeBuffer(this.vertexBuffer,0,n),this.vertexCount=n.length/(vu/4),this.origin=e.origin??t)}hasGeometry(){return this.vertexCount>0}render(e,t,n,r){if(!this.pipeline||!this.uniformBuffer||!this.bindGroup||!this.vertexBuffer||this.vertexCount===0)return;let i=new Float32Array(40);if(i.set(t,0),this.origin&&n&&r){if(i.set(n,16),!E(this.origin,r,i,32))return;i[35]=1}this.device.queue.writeBuffer(this.uniformBuffer,0,i),e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.setVertexBuffer(0,this.vertexBuffer),e.draw(this.vertexCount)}destroy(){this.vertexBuffer&&this.vertexBuffer.destroy(),this.uniformBuffer&&this.uniformBuffer.destroy(),this.vertexBuffer=null,this.uniformBuffer=null,this.bindGroup=null,this.bindGroupLayout=null,this.pipeline=null,this.vertexCount=0,this.origin=void 0}};function xu(e,t){let[n,r,i]=e,[a,o,s]=t,c=[[n,r,i],[a,r,i],[a,o,i],[n,o,i],[n,r,s],[a,r,s],[a,o,s],[n,o,s]],l=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],u=new Float32Array(l.length*2*3),d=0;for(let[e,t]of l)u[d++]=c[e][0],u[d++]=c[e][1],u[d++]=c[e][2],u[d++]=c[t][0],u[d++]=c[t][1],u[d++]=c[t][2];return u}function Su(e,t){let n=[e[0],e[1],e[2]];return{localVertices:xu([0,0,0],[t[0]-n[0],t[1]-n[1],t[2]-n[2]]),origin:n}}function Cu(e,t,n,r,i,a,o,s,c,l){let u=(t,o)=>n===void 0?e.uploadDrawing(r,i,a,t,c,o):e.uploadExtraDrawing(n,r,i,a,t,c,o);if(l)return u(0,l),!0;let d=a===`side`?[1,0,0]:a===`down`?[0,1,0]:[0,0,1];if((s?.min===void 0||s?.max===void 0)&&!t)return!1;let f=t?fu(t.min,t.max,d):null,p=s?.min??f.min,m=s?.max??f.max;return u(p+o/100*(m-p)),!0}function wu(e,t,n,r){let{options:i,viewProj:a,modelBounds:o}=r,s=r.extraPlanes??[];if(i.sectionPlane&&t&&o&&(i.sectionPlane.showGizmo!==!1&&t.draw(e,{axis:i.sectionPlane.axis,position:i.sectionPlane.position,bounds:o,relativeToEyeFrame:r.relativeToEyeFrame,viewProj:a,isPreview:!i.sectionPlane.enabled,min:i.sectionPlane.min,max:i.sectionPlane.max,normal:i.sectionPlane.normal,distance:i.sectionPlane.distance}),i.sectionPlane.enabled&&n?.hasGeometry())){let t=i.sectionPlane,c=t.showCap!==!1,l=t.showOutlines!==!1,u={...Ri,...t.capStyle};n.draw(e,{axis:t.axis,position:t.position,bounds:o,viewProj:a,rteViewProj:r.rteViewProj,rteCamera:r.rteCamera,min:t.min,max:t.max,showFills:c,showOutlines:l,capStyle:c?Tu(u,r.pixelRatio):void 0},s)}if(n?.hasExtraGeometry()&&o){let t=i.sectionPlane,c=t?.showCap!==!1,l={...Ri,...t?.capStyle},u=r.primaryPlane??null;n.drawExtras(e,{axis:t?.axis??`down`,position:t?.position??0,bounds:o,viewProj:a,rteViewProj:r.rteViewProj,rteCamera:r.rteCamera,showFills:c,showOutlines:t?.showOutlines!==!1,capStyle:c?Tu(l,r.pixelRatio):void 0},s.flatMap(e=>e.id===void 0?[]:[{key:e.id,clippedBy:[...u?[u]:[],...s.filter(t=>t!==e)]}]))}}function Tu(e,t=1){return{fillColor:e.fillColor,strokeColor:e.strokeColor,patternId:Li[e.pattern],spacingPx:e.spacingPx*t,angleRad:e.angleRad,widthPx:e.widthPx*t,secondaryAngleRad:e.secondaryAngleRad}}var Eu={annotation:!0,alignment:!0,grid:!1,dxf:!1,terrain:!0,centreline:!1},Du=class{host;sectionPlaneRenderer=null;section2DOverlayRenderer=null;themeApplier=new xt;symbolic;clashSolidPipeline=null;constructor(e){this.host=e,this.symbolic=new _u(e)}recoveryOmissions(){let e=[],t=this.section2DOverlayRenderer;return t?.hasGeometry()&&e.push(`section-2d-overlay`),t&&(ra.some(e=>t.hasLineOverlay(e))||t.hasClashBoxLines3D()||(this.clashSolidPipeline?.hasGeometry()??!1))&&e.push(`line-overlays`),this.symbolic.hasGeometry()&&e.push(`symbolic-overlays`),e}init(e,t,n){this.sectionPlaneRenderer=new Xr(e,t,n),this.section2DOverlayRenderer=new ia(e,t,n),this.themeApplier.reapply(this.sectionPlaneRenderer,this.section2DOverlayRenderer),this.symbolic.init(e,t,n),this.clashSolidPipeline=new bu(e,t,n)}destroy(){this.sectionPlaneRenderer?.destroy(),this.sectionPlaneRenderer=null,this.section2DOverlayRenderer?.dispose(),this.section2DOverlayRenderer=null,this.symbolic.destroy(),this.clashSolidPipeline?.destroy(),this.clashSolidPipeline=null}draw(e,t){let{viewProj:n,camera:r}=t;wu(e,this.sectionPlaneRenderer,this.section2DOverlayRenderer,t),this.symbolic.drawFills(e,n,t.rteViewProj,t.rteCamera);let i=this.section2DOverlayRenderer;if(i){for(let r of ra)i.hasLineOverlay(r)&&i.drawLineOverlay(e,n,r,t.rteViewProj,t.rteCamera);i.hasClashBoxLines3D()&&i.drawClashBoxLines3D(e,n,t.rteViewProj,t.rteCamera)}this.clashSolidPipeline?.hasGeometry()&&this.clashSolidPipeline.render(e,n,t.rteViewProj,t.rteCamera),this.symbolic.drawTexts(e,n,t.canvasWidth,t.canvasHeight,r,t.rteViewProj,t.rteCamera)}uploadSection2DOverlay(e,t,n,r,i,a=!1,o,s){let c=this.section2DOverlayRenderer;c&&Cu(c,this.host.getModelBounds(),s,e,t,n,r,i,a,o)&&this.host.requestRender()}clearSection2DOverlay(e){let t=this.section2DOverlayRenderer;t&&(e===void 0?t.clearGeometry():t.clearExtraGeometry(new Set(t.extraGeometryKeys().filter(t=>t!==e))),this.host.requestRender())}clearSection2DExtraOverlays(e=[]){let t=this.section2DOverlayRenderer;t&&t.extraGeometryKeys().length!==0&&(t.clearExtraGeometry(new Set(e)),this.host.requestRender())}setTheme(e){this.themeApplier.set(e,this.sectionPlaneRenderer,this.section2DOverlayRenderer,this.clashSolidPipeline),this.host.requestRender()}setLineOverlay(e,t){if(this.section2DOverlayRenderer){if(this.section2DOverlayRenderer.setLineOverlay(e,t),Eu[e]&&t){if(t instanceof Float32Array)this.host.expandModelBoundsWithFlatVertices(t,3);else if(`localVertices`in t)this.host.expandModelBoundsWithAnchoredLineVertices(t.localVertices,t.origin,3);else for(let e of t)this.host.expandModelBoundsWithAnchoredLineVertices(e.localVertices,e.origin,3);this.host.syncCameraSceneBounds()}this.host.requestRender()}}setClashOverlapBox(e){this.section2DOverlayRenderer&&(e?(this.section2DOverlayRenderer.setClashBoxLineColor(this.themeApplier.clashLineColor(e.color)),this.section2DOverlayRenderer.uploadClashBoxLines3D(Su(e.min,e.max)),this.host.requestRender()):(this.section2DOverlayRenderer.clearClashBoxLines3D(),this.host.requestRender()))}setClashContactLines(e){this.section2DOverlayRenderer&&(!e||ea(e.vertices)===0?(this.section2DOverlayRenderer.clearClashBoxLines3D(),this.host.requestRender()):(this.section2DOverlayRenderer.setClashBoxLineColor(this.themeApplier.clashLineColor(e.color)),this.section2DOverlayRenderer.uploadClashBoxLines3D(e.vertices),this.host.requestRender()))}setClashIntersectionSolid(e){this.clashSolidPipeline&&(this.clashSolidPipeline.upload(this.themeApplier.clashSolid(e)),this.host.requestRender())}uploadAnnotationFills3D(e){this.symbolic.uploadFills(e)}uploadAnnotationTexts3D(e){this.symbolic.uploadTexts(e)}hasSection2DOverlay(){return this.section2DOverlayRenderer?.hasGeometry()??!1}};Ou=function(e){let{options:t,batchedMeshes:n,meshes:r,pointCloudBounds:i}=e,a;if(t.terrainClipY!==void 0&&!t.sectionPlane?.enabled&&(a={normal:[0,-1,0],distance:-t.terrainClipY,enabled:!0}),!t.sectionPlane&&!t.extraSectionPlanes?.length)return{sectionPlaneData:a,bounds:null,extraPlanes:[]};let o={x:1/0,y:1/0,z:1/0},s={x:-1/0,y:-1/0,z:-1/0};for(let e of n)e.bounds&&(o.x=Math.min(o.x,e.bounds.min[0]),o.y=Math.min(o.y,e.bounds.min[1]),o.z=Math.min(o.z,e.bounds.min[2]),s.x=Math.max(s.x,e.bounds.max[0]),s.y=Math.max(s.y,e.bounds.max[1]),s.z=Math.max(s.z,e.bounds.max[2]));if(i&&(o.x=Math.min(o.x,i.min[0]),o.y=Math.min(o.y,i.min[1]),o.z=Math.min(o.z,i.min[2]),s.x=Math.max(s.x,i.max[0]),s.y=Math.max(s.y,i.max[1]),s.z=Math.max(s.z,i.max[2])),!Number.isFinite(o.x))for(let e of r)e.bounds&&(o.x=Math.min(o.x,e.bounds.min[0]),o.y=Math.min(o.y,e.bounds.min[1]),o.z=Math.min(o.z,e.bounds.min[2]),s.x=Math.max(s.x,e.bounds.max[0]),s.y=Math.max(s.y,e.bounds.max[1]),s.z=Math.max(s.z,e.bounds.max[2]));if(Number.isFinite(o.x)||(o.x=o.y=o.z=-100,s.x=s.y=s.z=100),!t.sectionPlane?.enabled&&t.terrainClipY!==void 0&&(a={normal:[0,-1,0],distance:-t.terrainClipY,enabled:!0}),t.sectionPlane?.enabled){let{normal:r,distance:i,explicit:c}=pu(t.sectionPlane,o,s,t.buildingRotation);a={normal:r,distance:i,enabled:!0},e.logSectionBounds&&(e.spendLogLatch(),console.info(`[Section] Y-up bounds used for clip:`,{mode:c?`explicit`:`axis-aligned`,axis:t.sectionPlane.axis,bounds:{min:{x:o.x,y:o.y,z:o.z},max:{x:s.x,y:s.y,z:s.z}},normal:r,distance:i,position:t.sectionPlane.position,batchedMeshCount:n.length}))}return{sectionPlaneData:a,bounds:{min:o,max:s},extraPlanes:mu(t.extraSectionPlanes,o,s,t.buildingRotation,7)}};function ku(e){return e.getRelativeToEyeFrame?.().isAvailable?.()!==!1}function Au(e){return e.getRelativeToEyeFrame?.().getInvalidationEpoch?.()}function ju(e){return e.getRelativeToEyeFrame?.().snapshot()}function Mu(e,t){let n=e.getRelativeToEyeFrame?.();return!n||n.getRenderEpoch()===t.renderEpoch}var Nu=500;function Pu(e){return`${e.expressId}:${e.modelIndex??`any`}`}function Fu(e,t){let n=e.getMeshes();if(e.visibleMeshDataEntitiesExceed(n.length+Nu,t?.hiddenIds,t?.isolatedIds))return{overBudget:!0,visibleExpressIds:[],existingPieceCounts:new Map};let r=new Set(e.getAllMeshDataExpressIds()),i=new Map;for(let e of n){let t=Pu(e);i.set(t,(i.get(t)??0)+1)}let a=new Map,o=[];for(let n of r){if(!Q(n,t?.hiddenIds,t?.isolatedIds))continue;o.push(n);let r=e.getMeshDataPieces(n);if(r)for(let e of r){let t=Pu(e);a.set(t,(a.get(t)??0)+1)}}let s=0;for(let[e,t]of a){let n=i.get(e)??0;t>n&&(s+=t-n)}return{overBudget:s>Nu||o.length>0&&a.size===0,visibleExpressIds:o,existingPieceCounts:i}}var Iu=class{camera;scene;picker;pickerEpoch=0;canvas;createMeshFromDataFn;pointPickProvider=null;constructor(e,t,n,r,i){this.camera=e,this.scene=t,this.picker=n,this.canvas=r,this.createMeshFromDataFn=i}pickViewport(){let e=this.canvas.getBoundingClientRect(),t=dr(e.width,e.height,1,8192);return t?{width:t.width,height:t.height,scaleX:t.width/e.width,scaleY:t.height/e.height}:null}isPickRequestCurrent(e,t,n){let r=this.pickViewport();return ku(this.camera)&&Au(this.camera)===n&&this.pickerEpoch===t&&r!==null&&r.width===e.width&&r.height===e.height&&r.scaleX===e.scaleX&&r.scaleY===e.scaleY}setPointPickProvider(e){this.pointPickProvider=e}setPicker(e){this.picker!==e&&this.pickerEpoch++,this.picker=e}prepareBatchedPick(e){if(this.scene.getBatchedMeshes().length===0&&this.scene.getTexturedMeshes().length===0)return`gpu`;if(this.scene.isGeometryDataReleased())return`cpu`;let{overBudget:t,visibleExpressIds:n,existingPieceCounts:r}=Fu(this.scene,e);if(t)return`cpu`;let i=new Map(r),a=new Map,o=!1;for(let e of n){let t=this.scene.getMeshDataPieces(e);if(t)for(let e of t){let t=Pu(e),n=a.get(t)??0;a.set(t,n+1),!(n<(i.get(t)??0))&&(this.createMeshFromDataFn(e).ok||(o=!0))}}return o?`cpu`:`gpu`}async pick(e,t,n,r){if(!this.picker||!ku(this.camera))return null;let i=this.picker,a=this.pickerEpoch,o=Au(this.camera),s=this.pickViewport();if(!s)return null;let c=e*s.scaleX,l=t*s.scaleY;if(n?.isStreaming)return null;if(this.prepareBatchedPick(n)===`cpu`){let e=this.camera.unprojectToRay(c,l,s.width,s.height),t=this.scene.raycast(e.origin,e.direction,n?.hiddenIds,n?.isolatedIds,r);return t?{expressId:t.expressId,modelIndex:t.modelIndex,...t.geometryItemId===void 0?{}:{geometryItemId:t.geometryItemId}}:null}let u=this.scene.getMeshes();u=u.filter(e=>Q(e.expressId,n?.hiddenIds,n?.isolatedIds));let d=this.camera.getViewProjMatrix().m,f=this.pointPickProvider?.()??null,p=f?.nodes??void 0,m=f?.sizing??void 0,h=ju(this.camera),g=await i.pick(c,l,s.width,s.height,u,d,p,m,this.scene.getInstancedTemplates(),r,h);return!this.isPickRequestCurrent(s,a,o)||h&&!Mu(this.camera,h)?null:g}async pickRect(e,t,n,r,i,a){if(!this.picker||!ku(this.camera))return new Set;let o=this.picker,s=this.pickerEpoch,c=Au(this.camera),l=this.pickViewport();if(!l)return new Set;let u=e*l.scaleX,d=t*l.scaleY,f=n*l.scaleX,p=r*l.scaleY;if(i?.isStreaming)return new Set;if(this.prepareBatchedPick(i)===`cpu`){let e=this.scene.selectRect(u,d,f,p,l.width,l.height,this.camera.getRelativeToEyeFrame().getViewProjection().m,i?.hiddenIds,i?.isolatedIds,a,{cameraWorld:this.camera.getRelativeToEyeFrame().getCameraWorld()}),t=this.pointPickProvider?.()??null;if(!t||t.nodes.length===0)return e;let n,r=ju(this.camera);try{n=await o.pickRect(u,d,f,p,l.width,l.height,[],this.camera.getViewProjMatrix().m,t.nodes,t.sizing,void 0,a,r)}catch(t){return console.warn(`[PickingManager] point-cloud rect pick failed; returning current-viewport bounding-box hits only:`,t),this.isPickRequestCurrent(l,s,c)?e:new Set}if(!this.isPickRequestCurrent(l,s,c))return new Set;if(r&&!Mu(this.camera,r))return e;for(let t of n)e.add(t);return e}let m=this.scene.getMeshes();m=m.filter(e=>Q(e.expressId,i?.hiddenIds,i?.isolatedIds));let h=this.camera.getViewProjMatrix().m,g=this.pointPickProvider?.()??null,_=ju(this.camera),v=await o.pickRect(u,d,f,p,l.width,l.height,m,h,g?.nodes??void 0,g?.sizing??void 0,this.scene.getInstancedTemplates(),a,_);return!this.isPickRequestCurrent(l,s,c)||_&&!Mu(this.camera,_)?new Set:v}},Lu=class{reported=!1;note(e,t,n){return this.reported||e<16?null:(this.reported=!0,{consecutiveDegradedFrames:e,detail:t,origin:n})}};function Ru(e,t,n=0){return`
        @group(${n}) @binding(${e}) var depthTex: ${t?`texture_depth_multisampled_2d`:`texture_depth_2d`};

        fn loadDepth(ip: vec2<i32>) -> f32 {
          let dims = vec2<i32>(textureDimensions(depthTex));
          return textureLoad(depthTex, clamp(ip, vec2<i32>(0), dims - 1), 0);
        }
`}var zu=`
        // Reverse-Z clears to 0, so anything at or below this is background.
        const BACKGROUND_DEPTH: f32 = 1e-7;

        fn viewZFromDepth(d: f32, dp: vec4<f32>) -> f32 {
          return (dp.z - d * dp.w) / (d * dp.y - dp.x);
        }

        fn clipWFromViewZ(z: f32, dp: vec4<f32>) -> f32 {
          return dp.y * z + dp.w;
        }

        // Pixel centre to NDC (y up), for a buffer whose texel size is invDims.
        fn ndcFromPixel(ip: vec2<i32>, invDims: vec2<f32>) -> vec2<f32> {
          let uv = (vec2<f32>(ip) + 0.5) * invDims;
          return vec2<f32>(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
        }

        fn viewPositionFromDepth(ndc: vec2<f32>, d: f32, dp: vec4<f32>, xy: vec4<f32>) -> vec3<f32> {
          let z = viewZFromDepth(d, dp);
          let w = clipWFromViewZ(z, dp);
          return vec3<f32>((ndc.x * w - xy.z) / xy.x, (ndc.y * w - xy.w) / xy.y, z);
        }

        // Normal facing the camera, from a position and its four pixel
        // neighbours. On each axis it takes the neighbour with the smaller
        // depth step, so a pixel on a silhouette or a crease uses the side
        // on its own surface instead of averaging across the edge.
        fn normalFromNeighbours(
          p: vec3<f32>, right: vec3<f32>, left: vec3<f32>, down: vec3<f32>, up: vec3<f32>,
        ) -> vec3<f32> {
          let dxR = right - p;
          let dxL = p - left;
          let dx = select(dxR, dxL, abs(dxL.z) < abs(dxR.z));
          let dyD = down - p;
          let dyU = p - up;
          let dy = select(dyD, dyU, abs(dyU.z) < abs(dyD.z));
          // Pixel +x is view +x and pixel +y is view -y, so dy x dx faces +z.
          return normalize(cross(dy, dx));
        }
`;function Bu(e){return`
        struct AoParams {
          depthParams: vec4<f32>,  // m10, m11, m14, m15
          xyParams: vec4<f32>,     // m0, m5, m12, m13
          viewport: vec4<f32>,     // full-res width, height, 1/width, 1/height
          ao: vec4<f32>,           // radius (world), px per world unit at w=1, max radius px, intensity
          misc: vec4<f32>,         // resolution divisor, samples, cosine bias, depth tolerance
          kernel: array<vec4<f32>, 8>, // 16 unit-disk offsets, two per vec4
        }

        ${Ru(0,e)}
        @group(0) @binding(1) var<uniform> params: AoParams;
        @group(0) @binding(2) var aoIn: texture_2d<f32>;

        ${zu}

        const TAU: f32 = 6.28318530718;
        const AO_GAIN: f32 = ${2..toFixed(3)};
        const AO_MAX_DARKEN: f32 = ${tu.toFixed(3)};

        struct VsOut {
          @builtin(position) pos: vec4<f32>,
        }

        @vertex
        fn vs_fullscreen(@builtin(vertex_index) v: u32) -> VsOut {
          var p = array<vec2<f32>, 3>(
            vec2<f32>(-1.0, -3.0),
            vec2<f32>(-1.0,  1.0),
            vec2<f32>( 3.0,  1.0)
          );
          var o: VsOut;
          o.pos = vec4<f32>(p[v], 0.0, 1.0);
          return o;
        }

        fn viewPosAt(ip: vec2<i32>, d: f32) -> vec3<f32> {
          return viewPositionFromDepth(ndcFromPixel(ip, params.viewport.zw), d, params.depthParams, params.xyParams);
        }

        // A neighbour for the normal. Background pushes it far away, so
        // normalFromNeighbours takes the other side.
        fn neighbourPos(ip: vec2<i32>, center: vec3<f32>) -> vec3<f32> {
          let d = loadDepth(ip);
          if (d <= BACKGROUND_DEPTH) {
            return center - vec3<f32>(0.0, 0.0, 1e6);
          }
          return viewPosAt(ip, d);
        }

        fn kernelTap(i: u32) -> vec2<f32> {
          let v = params.kernel[i / 2u];
          return select(v.xy, v.zw, (i & 1u) == 1u);
        }

        // Interleaved gradient noise (Jimenez 2014): a per-pixel rotation the
        // 9-tap blur removes without a visible pattern.
        fn interleavedGradientNoise(p: vec2<f32>) -> f32 {
          return fract(52.9829189 * fract(dot(p, vec2<f32>(0.06711056, 0.00583715))));
        }

        @fragment
        fn fs_ao(@builtin(position) fragPos: vec4<f32>) -> @location(0) vec4<f32> {
          let divisor = i32(params.misc.x);
          let p = vec2<i32>(fragPos.xy) * divisor;
          let dims = vec2<i32>(params.viewport.xy);
          let d = loadDepth(p);
          if (d <= BACKGROUND_DEPTH) {
            return vec4<f32>(0.0, 0.0, 0.0, 0.0);
          }
          let P = viewPosAt(p, d);
          let N = normalFromNeighbours(
            P,
            neighbourPos(p + vec2<i32>(1, 0), P),
            neighbourPos(p - vec2<i32>(1, 0), P),
            neighbourPos(p + vec2<i32>(0, 1), P),
            neighbourPos(p - vec2<i32>(0, 1), P),
          );
          let depthKey = -P.z;

          let radius = params.ao.x;
          let w = clipWFromViewZ(P.z, params.depthParams);
          let radiusPx = min(radius * params.ao.y / w, params.ao.z);
          if (radiusPx < 1.0) {
            // Smaller than a pixel: nothing to resolve at this distance.
            return vec4<f32>(0.0, depthKey, 0.0, 0.0);
          }

          let angle = interleavedGradientNoise(fragPos.xy) * TAU;
          let rot = vec2<f32>(cos(angle), sin(angle));
          let invR2 = 1.0 / (radius * radius);
          let bias = params.misc.z;
          let samples = u32(params.misc.y);
          var occlusion = 0.0;
          for (var i = 0u; i < samples; i = i + 1u) {
            let k = kernelTap(i);
            let offset = vec2<f32>(k.x * rot.x - k.y * rot.y, k.x * rot.y + k.y * rot.x) * radiusPx;
            let q = p + vec2<i32>(round(offset));
            if (any(q < vec2<i32>(0)) || any(q >= dims)) {
              continue;
            }
            let dq = loadDepth(q);
            if (dq <= BACKGROUND_DEPTH) {
              continue;
            }
            let v = viewPosAt(q, dq) - P;
            let vv = dot(v, v);
            // Range check: taps beyond the world radius do not occlude.
            let falloff = max(1.0 - vv * invR2, 0.0);
            let cosine = dot(v, N) * inverseSqrt(vv + 1e-8);
            occlusion = occlusion + falloff * max(cosine - bias, 0.0);
          }
          occlusion = occlusion / (f32(samples) * (1.0 - bias));
          return vec4<f32>(occlusion, depthKey, 0.0, 0.0);
        }

        // Relative depth closeness in [0, 1]: 1 on the same surface, 0 across
        // a step larger than the tolerance.
        fn depthWeight(key: f32, centerKey: f32) -> f32 {
          return max(0.0, 1.0 - abs(key - centerKey) / (centerKey * params.misc.w));
        }

        fn bilateralBlur(t: vec2<i32>, dir: vec2<i32>) -> vec4<f32> {
          let center = textureLoad(aoIn, t, 0);
          if (center.y <= 0.0) {
            return center;
          }
          let dims = vec2<i32>(textureDimensions(aoIn));
          // Gaussian, sigma ~2 texels. A var: it is indexed at runtime.
          var gauss = array<f32, 5>(0.2270, 0.1945, 0.1216, 0.0540, 0.0162);
          var sum = center.x * gauss[0];
          var wsum = gauss[0];
          for (var i = 1; i <= 4; i = i + 1) {
            for (var s = -1; s <= 1; s = s + 2) {
              let q = t + dir * (i * s);
              if (any(q < vec2<i32>(0)) || any(q >= dims)) {
                continue;
              }
              let tap = textureLoad(aoIn, q, 0);
              if (tap.y <= 0.0) {
                continue;
              }
              let wgt = gauss[i] * depthWeight(tap.y, center.y);
              sum = sum + tap.x * wgt;
              wsum = wsum + wgt;
            }
          }
          return vec4<f32>(sum / wsum, center.y, 0.0, 0.0);
        }

        @fragment
        fn fs_blur_h(@builtin(position) fragPos: vec4<f32>) -> @location(0) vec4<f32> {
          return bilateralBlur(vec2<i32>(fragPos.xy), vec2<i32>(1, 0));
        }

        @fragment
        fn fs_blur_v(@builtin(position) fragPos: vec4<f32>) -> @location(0) vec4<f32> {
          return bilateralBlur(vec2<i32>(fragPos.xy), vec2<i32>(0, 1));
        }

        // Joint bilateral upsample: the (up to) four AO texels around this
        // pixel, weighted bilinearly and by depth closeness. When none is on
        // this pixel's surface, the closest in depth wins.
        fn upsampledOcclusion(p: vec2<i32>, key: f32) -> f32 {
          let divisor = params.misc.x;
          if (divisor <= 1.0) {
            return textureLoad(aoIn, p, 0).x;
          }
          let dims = vec2<i32>(textureDimensions(aoIn));
          // AO texel t was computed at full-res pixel t * divisor.
          let f = vec2<f32>(p) / divisor;
          let base = vec2<i32>(floor(f));
          let fr = f - floor(f);
          var sum = 0.0;
          var wsum = 0.0;
          var nearest = 0.0;
          var nearestDiff = 1e30;
          for (var j = 0; j < 4; j = j + 1) {
            let o = vec2<i32>(j & 1, j >> 1u);
            let q = clamp(base + o, vec2<i32>(0), dims - 1);
            let tap = textureLoad(aoIn, q, 0);
            let bw = select(1.0 - fr.x, fr.x, o.x == 1) * select(1.0 - fr.y, fr.y, o.y == 1);
            let wgt = bw * depthWeight(tap.y, key);
            sum = sum + tap.x * wgt;
            wsum = wsum + wgt;
            let diff = abs(tap.y - key);
            if (diff < nearestDiff) {
              nearestDiff = diff;
              nearest = tap.x;
            }
          }
          return select(nearest, sum / wsum, wsum > 1e-3);
        }

        @fragment
        fn fs_composite(@builtin(position) fragPos: vec4<f32>) -> @location(0) vec4<f32> {
          let p = vec2<i32>(fragPos.xy);
          let d = loadDepth(p);
          if (d <= BACKGROUND_DEPTH) {
            return vec4<f32>(0.0, 0.0, 0.0, 0.0);
          }
          let key = -viewZFromDepth(d, params.depthParams);
          let occlusion = upsampledOcclusion(p, key);
          let darken = clamp(occlusion * AO_GAIN * params.ao.w, 0.0, AO_MAX_DARKEN);
          return vec4<f32>(0.0, 0.0, 0.0, darken);
        }
`}var Vu=`rg16float`,Hu=class{device;uniformBuffer;uniformScratch=new Float32Array(ou/4);aoLayout;filterLayout;aoPipeline;blurHPipeline;blurVPipeline;compositePipeline;targets=null;bindGroups=null;destroyed=!1;constructor(e,t,n){this.device=e,this.uniformBuffer=e.createBuffer({label:`ao-uniforms`,size:ou,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let r={binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`depth`,viewDimension:`2d`,multisampled:n>1}},i={binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}};this.aoLayout=e.createBindGroupLayout({label:`ao-bgl`,entries:[r,i]}),this.filterLayout=e.createBindGroupLayout({label:`ao-filter-bgl`,entries:[r,i,{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`unfilterable-float`}}]});let a=e.createShaderModule({label:`ao-shader`,code:Bu(n>1)}),o=(t,n,r,i)=>e.createRenderPipeline({label:t,layout:e.createPipelineLayout({bindGroupLayouts:[n]}),vertex:{module:a,entryPoint:`vs_fullscreen`},fragment:{module:a,entryPoint:r,targets:[i]},primitive:{topology:`triangle-list`,cullMode:`none`}});this.aoPipeline=o(`ao-pipeline`,this.aoLayout,`fs_ao`,{format:Vu}),this.blurHPipeline=o(`ao-blur-h-pipeline`,this.filterLayout,`fs_blur_h`,{format:Vu}),this.blurVPipeline=o(`ao-blur-v-pipeline`,this.filterLayout,`fs_blur_v`,{format:Vu}),this.compositePipeline=o(`ao-composite-pipeline`,this.filterLayout,`fs_composite`,{format:t,blend:{color:{srcFactor:`zero`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`zero`,dstFactor:`one`}}})}encode(e){if(this.destroyed)return;let{width:t,height:n}=nu(e.params.width,e.params.height,e.params.quality),r=this.ensureTargets(t,n),i=this.ensureBindGroups(r,e.depthView);su(this.uniformScratch,e.params),this.device.queue.writeBuffer(this.uniformBuffer,0,this.uniformScratch);let a=(t,n,r,i,a)=>{let o=e.encoder.beginRenderPass({label:t,timestampWrites:pc(e.encoder,t),colorAttachments:[{view:n,loadOp:a,storeOp:`store`,clearValue:{r:0,g:0,b:0,a:0}}]});o.setPipeline(r),o.setBindGroup(0,i),o.draw(3,1,0,0),o.end()};a(`ao`,r.aoView,this.aoPipeline,i.ao,`clear`),a(`ao-blur-h`,r.scratchView,this.blurHPipeline,i.blurH,`clear`),a(`ao-blur-v`,r.aoView,this.blurVPipeline,i.blurV,`clear`),a(`ao-composite`,e.targetView,this.compositePipeline,i.composite,`load`)}ensureTargets(e,t){let n=this.targets;if(n&&n.width===e&&n.height===t)return n;this.releaseTargets();let r=n=>this.device.createTexture({label:n,size:{width:e,height:t},format:Vu,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=r(`ao-target`),a=r(`ao-scratch`);return this.targets={width:e,height:t,ao:i,scratch:a,aoView:i.createView(),scratchView:a.createView()},this.targets}ensureBindGroups(e,t){let n=this.bindGroups;if(n&&n.depthView===t)return n;let r={binding:1,resource:{buffer:this.uniformBuffer}},i={binding:0,resource:t},a=(e,t)=>this.device.createBindGroup({label:e,layout:this.filterLayout,entries:[i,r,{binding:2,resource:t}]});return this.bindGroups={depthView:t,ao:this.device.createBindGroup({label:`ao-bg`,layout:this.aoLayout,entries:[i,r]}),blurH:a(`ao-blur-h-bg`,e.aoView),blurV:a(`ao-blur-v-bg`,e.scratchView),composite:a(`ao-composite-bg`,e.aoView)},this.bindGroups}releaseTargets(){this.targets?.ao.destroy(),this.targets?.scratch.destroy(),this.targets=null,this.bindGroups=null}destroy(){this.destroyed||(this.destroyed=!0,this.releaseTargets(),this.uniformBuffer.destroy())}},Uu={low:{directions:4},high:{directions:8}},Wu=Math.cos(25*Math.PI/180),Gu=.01,Ku=.35,qu={depthParams:0,xyParams:4,viewport:8,edge:12},Ju=(qu.edge+4)*4;function Yu(e,t){let n=Jl(t.projection),r=qu;e.set(n.depth,r.depthParams),e.set(n.xy,r.xyParams),e[r.viewport]=t.width,e[r.viewport+1]=t.height,e[r.viewport+2]=1/t.width,e[r.viewport+3]=1/t.height,e[r.edge]=Math.max(1,t.radiusPx),e[r.edge+1]=t.intensity,e[r.edge+2]=+(Uu[t.quality].directions===8),e[r.edge+3]=0}var Xu=[.3,.62,1],Zu=[.3,.62,1],Qu=.9,$u=.35,ed=.5,td=1.5,nd={viewport:0,selectionColor:4,hoverColor:8},rd=(nd.hoverColor+4)*4;function id(e,t){let n=nd;e[n.viewport]=t.width,e[n.viewport+1]=t.height,e[n.viewport+2]=0,e[n.viewport+3]=0,e.set([...Xu,Qu],n.selectionColor),e.set([...Zu,ed],n.hoverColor)}function ad(e){let t=e?`@group(0) @binding(1) var idTex: texture_multisampled_2d<f32>;`:`@group(0) @binding(1) var idTex: texture_2d<f32>;`;return`
        struct EdgeParams {
          depthParams: vec4<f32>,  // m10, m11, m14, m15
          xyParams: vec4<f32>,     // m0, m5, m12, m13
          viewport: vec4<f32>,     // full-res width, height, 1/width, 1/height
          edge: vec4<f32>,         // tap radius px, intensity, highQuality (0/1), _pad
        }

        ${Ru(0,e)}
        ${t}
        @group(0) @binding(2) var<uniform> params: EdgeParams;

        ${zu}

        const EDGE_CREASE_COS: f32 = ${Wu.toFixed(6)};
        const EDGE_SILHOUETTE_REL: f32 = ${Gu.toFixed(6)};
        const EDGE_MAX_DARKEN: f32 = ${Ku.toFixed(3)};

        struct VsOut {
          @builtin(position) pos: vec4<f32>,
        }

        @vertex
        fn vs_fullscreen(@builtin(vertex_index) v: u32) -> VsOut {
          var p = array<vec2<f32>, 3>(
            vec2<f32>(-1.0, -3.0),
            vec2<f32>(-1.0,  1.0),
            vec2<f32>( 3.0,  1.0)
          );
          var o: VsOut;
          o.pos = vec4<f32>(p[v], 0.0, 1.0);
          return o;
        }

        fn decodeId24(encoded: vec4<f32>) -> u32 {
          let r = u32(round(encoded.r * 255.0)) & 255u;
          let g = u32(round(encoded.g * 255.0)) & 255u;
          let b = u32(round(encoded.b * 255.0)) & 255u;
          return (r << 16u) | (g << 8u) | b;
        }

        fn loadId(ip: vec2<i32>, dims: vec2<i32>) -> u32 {
          let c = clamp(ip, vec2<i32>(0), dims - 1);
          return decodeId24(textureLoad(idTex, c, 0));
        }

        fn viewPosAt(ip: vec2<i32>, d: f32) -> vec3<f32> {
          return viewPositionFromDepth(ndcFromPixel(ip, params.viewport.zw), d, params.depthParams, params.xyParams);
        }

        // One tap direction's edge vote in [0, 1]: 1 if the id changes, the
        // local normal creases past the angle threshold, or the view-space
        // depth steps past the silhouette threshold.
        fn tapVote(p: vec2<i32>, q: vec2<i32>, dims: vec2<i32>, centerId: u32, centerP: vec3<f32>, centerN: vec3<f32>) -> f32 {
          let qc = clamp(q, vec2<i32>(0), dims - 1);
          let dq = loadDepth(qc);
          if (dq <= BACKGROUND_DEPTH) {
            return 0.0;
          }
          let neighbourId = loadId(qc, dims);
          let idVote = f32(neighbourId != centerId && neighbourId != 0u && centerId != 0u);

          let Pq = viewPosAt(qc, dq);
          let depthRef = max(-centerP.z, 1e-4);
          let silhouetteVote = f32(abs(Pq.z - centerP.z) / depthRef > EDGE_SILHOUETTE_REL);

          // Neighbour normal from ITS OWN neighbours (not just the two
          // points), so a grazing coplanar surface (large positional slope,
          // near-zero normal change) does not misread as a crease.
          let dLeft = loadDepth(clamp(qc + vec2<i32>(-1, 0), vec2<i32>(0), dims - 1));
          let dRight = loadDepth(clamp(qc + vec2<i32>(1, 0), vec2<i32>(0), dims - 1));
          let dUp = loadDepth(clamp(qc + vec2<i32>(0, -1), vec2<i32>(0), dims - 1));
          let dDown = loadDepth(clamp(qc + vec2<i32>(0, 1), vec2<i32>(0), dims - 1));
          let Nq = normalFromNeighbours(
            Pq,
            select(centerP, viewPosAt(qc + vec2<i32>(1, 0), dRight), dRight > BACKGROUND_DEPTH),
            select(centerP, viewPosAt(qc + vec2<i32>(-1, 0), dLeft), dLeft > BACKGROUND_DEPTH),
            select(centerP, viewPosAt(qc + vec2<i32>(0, 1), dDown), dDown > BACKGROUND_DEPTH),
            select(centerP, viewPosAt(qc + vec2<i32>(0, -1), dUp), dUp > BACKGROUND_DEPTH),
          );
          let creaseVote = f32(dot(centerN, Nq) < EDGE_CREASE_COS);

          return max(idVote, max(creaseVote, silhouetteVote));
        }

        @fragment
        fn fs_edges(@builtin(position) fragPos: vec4<f32>) -> @location(0) vec4<f32> {
          let dims = vec2<i32>(params.viewport.xy);
          let p = vec2<i32>(fragPos.xy);
          let d = loadDepth(p);
          if (d <= BACKGROUND_DEPTH) {
            return vec4<f32>(0.0, 0.0, 0.0, 0.0);
          }
          let centerId = loadId(p, dims);
          let centerP = viewPosAt(p, d);
          let centerN = normalFromNeighbours(
            centerP,
            viewPosAt(clamp(p + vec2<i32>(1, 0), vec2<i32>(0), dims - 1), loadDepth(p + vec2<i32>(1, 0))),
            viewPosAt(clamp(p - vec2<i32>(1, 0), vec2<i32>(0), dims - 1), loadDepth(p - vec2<i32>(1, 0))),
            viewPosAt(clamp(p + vec2<i32>(0, 1), vec2<i32>(0), dims - 1), loadDepth(p + vec2<i32>(0, 1))),
            viewPosAt(clamp(p - vec2<i32>(0, 1), vec2<i32>(0), dims - 1), loadDepth(p - vec2<i32>(0, 1))),
          );

          let r = i32(round(params.edge.x));
          var votes = 0.0;
          votes = votes + tapVote(p, p + vec2<i32>( r,  0), dims, centerId, centerP, centerN);
          votes = votes + tapVote(p, p + vec2<i32>(-r,  0), dims, centerId, centerP, centerN);
          votes = votes + tapVote(p, p + vec2<i32>( 0,  r), dims, centerId, centerP, centerN);
          votes = votes + tapVote(p, p + vec2<i32>( 0, -r), dims, centerId, centerP, centerN);
          var directions = 4.0;

          if (params.edge.z > 0.5) {
            votes = votes + tapVote(p, p + vec2<i32>( r,  r), dims, centerId, centerP, centerN);
            votes = votes + tapVote(p, p + vec2<i32>(-r,  r), dims, centerId, centerP, centerN);
            votes = votes + tapVote(p, p + vec2<i32>( r, -r), dims, centerId, centerP, centerN);
            votes = votes + tapVote(p, p + vec2<i32>(-r, -r), dims, centerId, centerP, centerN);
            directions = 8.0;
          }

          let coverage = votes / directions;
          let darken = clamp(coverage * params.edge.y, 0.0, EDGE_MAX_DARKEN);
          return vec4<f32>(0.0, 0.0, 0.0, darken);
        }
`}function od(){return`
        struct OutlineParams {
          viewport: vec4<f32>,       // width, height, unused, unused
          selectionColor: vec4<f32>, // rgb, visible alpha
          hoverColor: vec4<f32>,     // rgb, visible alpha
        }

        @group(0) @binding(0) var maskVisible: texture_2d<f32>;
        @group(0) @binding(1) var maskAll: texture_2d<f32>;
        @group(0) @binding(2) var<uniform> params: OutlineParams;

        const SELECTION_HIDDEN_ALPHA: f32 = ${$u.toFixed(3)};

        struct VsOut {
          @builtin(position) pos: vec4<f32>,
        }

        @vertex
        fn vs_fullscreen(@builtin(vertex_index) v: u32) -> VsOut {
          var p = array<vec2<f32>, 3>(
            vec2<f32>(-1.0, -3.0),
            vec2<f32>(-1.0,  1.0),
            vec2<f32>( 3.0,  1.0)
          );
          var o: VsOut;
          o.pos = vec4<f32>(p[v], 0.0, 1.0);
          return o;
        }

        fn loadClamped(tex: texture_2d<f32>, ip: vec2<i32>, dims: vec2<i32>) -> vec4<f32> {
          return textureLoad(tex, clamp(ip, vec2<i32>(0), dims - 1), 0);
        }

        const OUTLINE_SEARCH_RADIUS: i32 = 2;
        const OUTLINE_WIDTH_PX: f32 = ${td.toFixed(3)};

        // Ring coverage astride the mask boundary (outline-params.ts's
        // outlineCoverage): distance to the nearest pixel whose channel
        // differs from this one, full within OUTLINE_WIDTH_PX, 0 one pixel on.
        fn boundaryCoverage(tex: texture_2d<f32>, channel: u32, p: vec2<i32>, dims: vec2<i32>) -> f32 {
          let center = loadClamped(tex, p, dims)[channel] > 0.5;
          var nearest = 1e4;
          for (var dy = -OUTLINE_SEARCH_RADIUS; dy <= OUTLINE_SEARCH_RADIUS; dy = dy + 1) {
            for (var dx = -OUTLINE_SEARCH_RADIUS; dx <= OUTLINE_SEARCH_RADIUS; dx = dx + 1) {
              if ((loadClamped(tex, p + vec2<i32>(dx, dy), dims)[channel] > 0.5) != center) {
                nearest = min(nearest, length(vec2<f32>(f32(dx), f32(dy))));
              }
            }
          }
          return clamp(OUTLINE_WIDTH_PX + 0.5 - nearest, 0.0, 1.0);
        }

        @fragment
        fn fs_outline(@builtin(position) fragPos: vec4<f32>) -> @location(0) vec4<f32> {
          let dims = vec2<i32>(params.viewport.xy);
          let p = vec2<i32>(fragPos.xy);

          let visibleCoverage = boundaryCoverage(maskVisible, 0u, p, dims);
          let allCoverage = boundaryCoverage(maskAll, 0u, p, dims);
          let hoverCoverage = boundaryCoverage(maskVisible, 1u, p, dims);

          // The "hidden" ring is the silhouette of the unoccluded shape
          // (maskAll) wherever this pixel is not itself part of the visible
          // selection — so it does not double up with the solid ring.
          let centerVisible = loadClamped(maskVisible, p, dims).r;
          let hiddenCoverage = allCoverage * (1.0 - centerVisible);

          let selectionAlpha = clamp(
            max(visibleCoverage * params.selectionColor.a, hiddenCoverage * SELECTION_HIDDEN_ALPHA),
            0.0, 1.0,
          );
          if (selectionAlpha > 0.001) {
            return vec4<f32>(params.selectionColor.rgb * selectionAlpha, selectionAlpha);
          }

          let hoverAlpha = clamp(hoverCoverage * params.hoverColor.a, 0.0, 1.0);
          return vec4<f32>(params.hoverColor.rgb * hoverAlpha, hoverAlpha);
        }
`}var sd=class{device;uniformBuffer;uniformScratch=new Float32Array(Ju/4);layout;pipeline;cachedDepthView=null;cachedObjectIdView=null;cachedBindGroup=null;outlineUniformBuffer;outlineUniformScratch=new Float32Array(rd/4);outlineLayout;outlinePipeline;cachedMask=null;cachedOutlineBindGroup=null;destroyed=!1;constructor(e,t,n){this.device=e;let r=n>1;this.uniformBuffer=e.createBuffer({label:`edge-uniforms`,size:Ju,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.layout=e.createBindGroupLayout({label:`edge-bgl`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`depth`,viewDimension:`2d`,multisampled:r}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`unfilterable-float`,viewDimension:`2d`,multisampled:r}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});let i=e.createShaderModule({label:`edge-shader`,code:ad(r)});this.pipeline=e.createRenderPipeline({label:`edge-pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[this.layout]}),vertex:{module:i,entryPoint:`vs_fullscreen`},fragment:{module:i,entryPoint:`fs_edges`,targets:[{format:t,blend:{color:{srcFactor:`zero`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`zero`,dstFactor:`one`}}}]},primitive:{topology:`triangle-list`,cullMode:`none`}}),this.outlineUniformBuffer=e.createBuffer({label:`outline-uniforms`,size:rd,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.outlineLayout=e.createBindGroupLayout({label:`outline-bgl`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`unfilterable-float`}},{binding:1,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`unfilterable-float`}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});let a=e.createShaderModule({label:`outline-shader`,code:od()});this.outlinePipeline=e.createRenderPipeline({label:`outline-pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[this.outlineLayout]}),vertex:{module:a,entryPoint:`vs_fullscreen`},fragment:{module:a,entryPoint:`fs_outline`,targets:[{format:t,blend:{color:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`one`,dstFactor:`one-minus-src-alpha`}}}]},primitive:{topology:`triangle-list`,cullMode:`none`}})}encode(e){if(this.destroyed)return;Yu(this.uniformScratch,e.params),this.device.queue.writeBuffer(this.uniformBuffer,0,this.uniformScratch),(this.cachedDepthView!==e.depthView||this.cachedObjectIdView!==e.objectIdView||this.cachedBindGroup===null)&&(this.cachedBindGroup=this.device.createBindGroup({label:`edge-bg`,layout:this.layout,entries:[{binding:0,resource:e.depthView},{binding:1,resource:e.objectIdView},{binding:2,resource:{buffer:this.uniformBuffer}}]}),this.cachedDepthView=e.depthView,this.cachedObjectIdView=e.objectIdView);let t=e.encoder.beginRenderPass({timestampWrites:pc(e.encoder,`edges`),label:`edges`,colorAttachments:[{view:e.targetView,loadOp:`load`,storeOp:`store`}]});t.setPipeline(this.pipeline),t.setBindGroup(0,this.cachedBindGroup),t.draw(3,1,0,0),t.end()}encodeOutline(e){if(this.destroyed)return;id(this.outlineUniformScratch,e.params),this.device.queue.writeBuffer(this.outlineUniformBuffer,0,this.outlineUniformScratch),(this.cachedMask!==e.mask||this.cachedOutlineBindGroup===null)&&(this.cachedOutlineBindGroup=this.device.createBindGroup({label:`outline-bg`,layout:this.outlineLayout,entries:[{binding:0,resource:e.mask.visibleView},{binding:1,resource:e.mask.allView},{binding:2,resource:{buffer:this.outlineUniformBuffer}}]}),this.cachedMask=e.mask);let t=e.encoder.beginRenderPass({timestampWrites:pc(e.encoder,`selection-outline`),label:`selection-hover-outline`,colorAttachments:[{view:e.targetView,loadOp:`load`,storeOp:`store`}]});t.setPipeline(this.outlinePipeline),t.setBindGroup(0,this.cachedOutlineBindGroup),t.draw(3,1,0,0),t.end()}destroy(){this.destroyed||(this.destroyed=!0,this.uniformBuffer.destroy(),this.cachedBindGroup=null,this.cachedDepthView=null,this.cachedObjectIdView=null,this.outlineUniformBuffer.destroy(),this.cachedOutlineBindGroup=null,this.cachedMask=null)}},cd=class{device;colorFormat;isMultisampled;uniformBuffer;uniformStaging=new Float32Array(4);bindGroupLayout;pipeline;cachedBindGroup=null;cachedDepthView=null;destroyed=!1;constructor(e,t){this.device=e.getDevice(),this.colorFormat=e.getFormat(),this.isMultisampled=t>1,this.uniformBuffer=this.device.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroupLayout=this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:`depth`,viewDimension:`2d`,multisampled:this.isMultisampled}},{binding:1,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});let n=this.isMultisampled?`@group(0) @binding(0) var depthTex: texture_depth_multisampled_2d;`:`@group(0) @binding(0) var depthTex: texture_depth_2d;`;this.isMultisampled;let r=this.device.createShaderModule({code:`
struct Params {
  strength: f32,
  radiusPx: f32,
  highQuality: f32,
  _pad: f32,
}

${n}
@group(0) @binding(1) var<uniform> params: Params;

struct VsOut {
  @builtin(position) pos: vec4<f32>,
}

@vertex
fn vs_main(@builtin(vertex_index) v: u32) -> VsOut {
  // Standard fullscreen triangle (covers viewport, no UVs needed since
  // the fragment shader reads from textureLoad with @builtin(position)).
  var p = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -3.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 3.0,  1.0)
  );
  var o: VsOut;
  o.pos = vec4<f32>(p[v], 0.0, 1.0);
  return o;
}

fn sampleDepthClamped(ip: vec2<i32>, dims: vec2<i32>) -> f32 {
  let c = vec2<i32>(clamp(ip.x, 0, dims.x - 1), clamp(ip.y, 0, dims.y - 1));
  return textureLoad(depthTex, c, 0);
}

@fragment
fn fs_main(@builtin(position) fragPos: vec4<f32>) -> @location(0) vec4<f32> {
  let dimsU = textureDimensions(depthTex);
  let dims = vec2<i32>(i32(dimsU.x), i32(dimsU.y));
  let p = vec2<i32>(i32(fragPos.x), i32(fragPos.y));

  let center = sampleDepthClamped(p, dims);
  // Reverse-Z: 0 = far plane (no geometry written here), so skip.
  if (center <= 1e-5) {
    return vec4<f32>(0.0, 0.0, 0.0, 0.0);
  }

  let r = max(1, i32(params.radiusPx));
  let logCenter = log(center);

  var accum = 0.0;
  var count = 0.0;

  // Cardinal taps
  let neighbourOffsets4 = array<vec2<i32>, 4>(
    vec2<i32>( r,  0),
    vec2<i32>(-r,  0),
    vec2<i32>( 0,  r),
    vec2<i32>( 0, -r),
  );
  for (var i = 0; i < 4; i = i + 1) {
    let dn = sampleDepthClamped(p + neighbourOffsets4[i], dims);
    if (dn > 1e-5) {
      // log(centre) - log(dn) > 0 when neighbour is further (smaller depth)
      // → darken silhouette edges.
      accum = accum + max(0.0, logCenter - log(dn));
      count = count + 1.0;
    }
  }

  if (params.highQuality > 0.5) {
    let neighbourOffsets8 = array<vec2<i32>, 4>(
      vec2<i32>( r,  r),
      vec2<i32>(-r,  r),
      vec2<i32>( r, -r),
      vec2<i32>(-r, -r),
    );
    for (var i = 0; i < 4; i = i + 1) {
      let dn = sampleDepthClamped(p + neighbourOffsets8[i], dims);
      if (dn > 1e-5) {
        accum = accum + max(0.0, logCenter - log(dn));
        count = count + 1.0;
      }
    }
  }

  let meanLog = accum / max(count, 1.0);
  // exp(-300 * meanLog * strength) — 300 matches Potree's default sensitivity.
  // Output (1 - shade) as alpha; the blend mode multiplies dst by (1 - alpha).
  let shade = exp(-300.0 * meanLog * params.strength);
  let darken = clamp(1.0 - shade, 0.0, 0.85);
  return vec4<f32>(0.0, 0.0, 0.0, darken);
}
`});this.pipeline=this.device.createRenderPipeline({layout:this.device.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),vertex:{module:r,entryPoint:`vs_main`},fragment:{module:r,entryPoint:`fs_main`,targets:[{format:this.colorFormat,blend:{color:{srcFactor:`zero`,dstFactor:`one-minus-src-alpha`},alpha:{srcFactor:`zero`,dstFactor:`one`}}}]},primitive:{topology:`triangle-list`}})}apply(e,t,n){if(this.destroyed)return;(this.cachedBindGroup===null||this.cachedDepthView!==t.depthView)&&(this.cachedBindGroup=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:t.depthView},{binding:1,resource:{buffer:this.uniformBuffer}}]}),this.cachedDepthView=t.depthView),this.uniformStaging[0]=n.strength,this.uniformStaging[1]=n.radiusPx,this.uniformStaging[2]=+!!n.highQuality,this.uniformStaging[3]=0,this.device.queue.writeBuffer(this.uniformBuffer,0,this.uniformStaging);let r=e.beginRenderPass({timestampWrites:pc(e,`eye-dome-lighting`),colorAttachments:[{view:t.targetView,loadOp:`load`,storeOp:`store`}]});r.setPipeline(this.pipeline),r.setBindGroup(0,this.cachedBindGroup),r.draw(3,1,0,0),r.end()}destroy(){this.destroyed||(this.destroyed=!0,this.uniformBuffer.destroy(),this.cachedBindGroup=null,this.cachedDepthView=null)}};function ld(e){return e?`
        @group(1) @binding(0) var<uniform> maskHover: vec4<u32>;
        // bit 0 = selected, bit 1 = hidden (instanced-vertex-layout.ts).
        fn isSelectedOccurrence(input: MaskInput) -> bool { return (input.instSelected & 3u) == 1u; }
        fn isHoveredOccurrence(input: MaskInput) -> bool {
          return (input.instSelected & 2u) == 0u && input.entityId == maskHover.x;
        }`:`
        fn isSelectedOccurrence(input: MaskInput) -> bool { return true; }
        fn isHoveredOccurrence(input: MaskInput) -> bool { return true; }`}function ud(e=!1){return`
        ${G}

        // The subset of the vertex stage's VertexOutput the mask reads (locations match).
        struct MaskInput {
          @builtin(position) fragPos: vec4<f32>,
          @location(0) worldPos: vec3<f32>,
          @location(6) eyePos: vec3<f32>,${e?`
          @location(2) @interpolate(flat) entityId: u32,
          @location(5) @interpolate(flat) instSelected: u32,`:``}
        }
        ${ld(e)}

        fn isCut(input: MaskInput) -> bool {
          return sectionClipped(clipSpacePos(input.worldPos, input.eyePos));
        }

        @fragment
        fn fs_mask_selected_visible(input: MaskInput) -> @location(0) vec4<f32> {
          if (!isSelectedOccurrence(input) || isCut(input)) { discard; }
          return vec4<f32>(1.0, 0.0, 0.0, 0.0);
        }

        @fragment
        fn fs_mask_hover_visible(input: MaskInput) -> @location(0) vec4<f32> {
          if (!isHoveredOccurrence(input) || isCut(input)) { discard; }
          return vec4<f32>(0.0, 1.0, 0.0, 0.0);
        }

        @fragment
        fn fs_mask_selected_all(input: MaskInput) -> @location(0) vec4<f32> {
          if (!isSelectedOccurrence(input) || isCut(input)) { discard; }
          return vec4<f32>(1.0, 0.0, 0.0, 0.0);
        }
`}var dd=`rg8unorm`,fd=`r8unorm`,pd={color:{srcFactor:`one`,dstFactor:`one`},alpha:{srcFactor:`one`,dstFactor:`one`}},md={selectedVisible:{label:`selected-visible`,entryPoint:`fs_mask_selected_visible`,format:dd},hoverVisible:{label:`hover-visible`,entryPoint:`fs_mask_hover_visible`,format:dd},selectedAll:{label:`selected-all`,entryPoint:`fs_mask_selected_all`,format:fd}};function hd(e,t,n,r,i,a){let o=o=>{let s=md[o];return e.createRenderPipeline({label:`${t}-${s.label}`,layout:n,vertex:r,fragment:{module:i,entryPoint:s.entryPoint,targets:[{format:s.format,blend:pd}]},primitive:{topology:`triangle-list`,cullMode:`none`},...o===`selectedAll`?{}:{depthStencil:{format:wt.DEPTH_FORMAT,depthWriteEnabled:!1,depthCompare:`greater-equal`},multisample:{count:a}}})};return{selectedVisible:o(`selectedVisible`),hoverVisible:o(`hoverVisible`),selectedAll:o(`selectedAll`)}}function gd(e){return!e||e.selected.length===0&&e.hovered.length===0}var _d=class{device;pipelines;meshBindGroupLayout;meshUniform=null;hoverBuffer;hoverBindGroup;hoverScratch=new Uint32Array(4);runs=new Map;constructor(e,t,n){this.device=e,this.meshBindGroupLayout=t;let r=e.createBindGroupLayout({label:`selection-mask-instanced-hover-bgl`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]}),i=[];i[0]=t,i[1]=r;let a=e.createPipelineLayout({label:`selection-mask-instanced-layout`,bindGroupLayouts:i}),o={module:e.createShaderModule({label:`selection-mask-instanced-vs`,code:je}),entryPoint:`vs_instanced`,buffers:it},s=e.createShaderModule({label:`selection-mask-instanced-fs`,code:ud(!0)});this.pipelines=hd(e,`selection-mask-instanced`,a,o,s,n),this.hoverBuffer=e.createBuffer({label:`selection-mask-instanced-hover`,size:this.hoverScratch.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.hoverBindGroup=e.createBindGroup({layout:r,entries:[{binding:0,resource:{buffer:this.hoverBuffer}}]})}prepare(e){let{uniforms:t}=e;if(!this.meshUniform||this.meshUniform.buffer.size<t.byteLength){this.meshUniform?.buffer.destroy();let e=this.device.createBuffer({label:`selection-mask-instanced-uniforms`,size:t.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),n=this.device.createBindGroup({layout:this.meshBindGroupLayout,entries:[{binding:0,resource:{buffer:e}}]});this.meshUniform={buffer:e,bindGroup:n}}this.device.queue.writeBuffer(this.meshUniform.buffer,0,t),this.hoverScratch[0]=e.hoveredId>>>0,this.device.queue.writeBuffer(this.hoverBuffer,0,this.hoverScratch);let n=[...new Set([...e.selected,...e.hovered])],r=tt(this.device,n,e.rteCamera);this.runs=new Map(n.map((e,t)=>[e,r[t]]))}draw(e,t,n){if(n.length!==0&&this.meshUniform){e.setPipeline(this.pipelines[t]),e.setBindGroup(0,this.meshUniform.bindGroup),e.setBindGroup(1,this.hoverBindGroup);for(let t of n)e.setVertexBuffer(0,t.vertexBuffer),e.setVertexBuffer(1,t.instanceBuffer),e.setVertexBuffer(2,t.rteDeltas.buffer),e.setIndexBuffer(t.indexBuffer,`uint32`),rt(e,t.indexCount,this.runs.get(t)??[])}}destroy(){this.meshUniform?.buffer.destroy(),this.meshUniform=null,this.runs.clear(),this.hoverBuffer.destroy()}},vd=[{arrayStride:28,attributes:[{shaderLocation:0,offset:0,format:`float32x3`},{shaderLocation:1,offset:12,format:`float32x3`},{shaderLocation:2,offset:24,format:`uint32`}]}],yd=class{device;meshBindGroupLayout;sampleCount;pipelines;instanced=null;targets=null;hoverUniforms=[];destroyed=!1;constructor(e,t,n){this.device=e.getDevice(),this.meshBindGroupLayout=t,this.sampleCount=n;let r=this.device.createPipelineLayout({bindGroupLayouts:[this.meshBindGroupLayout]}),i=this.device.createShaderModule({label:`selection-mask-vs`,code:je}),a=this.device.createShaderModule({label:`selection-mask-fs`,code:ud()}),o={module:i,entryPoint:`vs_main`,buffers:vd};this.pipelines=hd(this.device,`selection-mask`,r,o,a,n)}static isEmpty(e){return e.selected.length===0&&e.hovered.length===0&&gd(e.instanced)}encode(e){let t=this.ensureTargets(e.width,e.height),n=e.instanced&&!gd(e.instanced)?e.instanced:null,r=n?this.ensureInstanced():null;r&&n&&r.prepare(n);let i=new Set,a=(a,o,s)=>{let c=i.has(a)?`load`:`clear`;i.add(a);let l=o!==`selectedAll`,u=e.encoder.beginRenderPass({timestampWrites:pc(e.encoder,`selection-${o}`),colorAttachments:[{view:l?t.multisampledVisibleView??a:a,...l&&t.multisampledVisibleView?{resolveTarget:a}:{},loadOp:c,storeOp:`store`,clearValue:{r:0,g:0,b:0,a:0}}],...l?{depthStencilAttachment:{view:e.depthView,depthReadOnly:!0,stencilReadOnly:!0}}:{}});u.setPipeline(this.pipelines[o]);for(let e of s)u.setBindGroup(0,e.bindGroup),u.setVertexBuffer(0,e.vertexBuffer),u.setIndexBuffer(e.indexBuffer,`uint32`),u.drawIndexed(e.indexCount,1,0,0,0);r&&n&&r.draw(u,o,o===`hoverVisible`?n.hovered:n.selected),u.end()};return a(t.visibleView,`selectedVisible`,e.selected),(e.hovered.length>0||(n?.hovered.length??0)>0)&&a(t.visibleView,`hoverVisible`,e.hovered.map((e,t)=>({vertexBuffer:e.vertexBuffer,indexBuffer:e.indexBuffer,indexCount:e.indexCount,bindGroup:this.hoverGroup(e,t)}))),a(t.allView,`selectedAll`,e.selected),t.views}ensureInstanced(){return this.instanced??=new _d(this.device,this.meshBindGroupLayout,this.sampleCount),this.instanced}hoverGroup(e,t){if(e.bindGroup)return e.bindGroup;let{uniforms:n}=e,r=this.hoverUniforms[t];if(!r||r.buffer.size<n.byteLength){r?.buffer.destroy();let e=this.device.createBuffer({label:`selection-mask-hover-uniforms`,size:n.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});r={buffer:e,bindGroup:this.device.createBindGroup({layout:this.meshBindGroupLayout,entries:[{binding:0,resource:{buffer:e}}]})},this.hoverUniforms[t]=r}return this.device.queue.writeBuffer(r.buffer,0,n),r.bindGroup}ensureTargets(e,t){let n=this.targets;if(n&&n.width===e&&n.height===t)return n;this.releaseTargets();let r=(n,r,i=1)=>this.device.createTexture({label:n,size:{width:e,height:t},format:r,sampleCount:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),i=r(`selection-mask-visible`,dd),a=r(`selection-mask-all`,fd),o=this.sampleCount>1?r(`selection-mask-visible-msaa`,dd,this.sampleCount):null,s=o?.createView()??null,c=i.createView(),l=a.createView();return this.targets={width:e,height:t,visible:i,all:a,visibleView:c,allView:l,multisampledVisible:o,multisampledVisibleView:s,views:{visibleView:c,allView:l}},this.targets}releaseTargets(){this.targets?.visible.destroy(),this.targets?.all.destroy(),this.targets?.multisampledVisible?.destroy(),this.targets=null}destroy(){if(!this.destroyed){this.destroyed=!0,this.releaseTargets();for(let e of this.hoverUniforms)e.buffer.destroy();this.hoverUniforms=[],this.instanced?.destroy(),this.instanced=null}}},bd=class{device;sampleCount;meshBindGroupLayout;ao=null;edges=null;edl=null;selectionMask=null;failed=new Set;constructor(e,t,n){this.device=e,this.sampleCount=t,this.meshBindGroupLayout=n}encode(e){let t=e.enhancement,n=du(t,e.effectsLive);this.ao&&(!t.enabled||t.contactShading.quality===`off`)&&(this.ao.destroy(),this.ao=null),n.ambientOcclusion!==null&&(this.ao??=this.build(`ambient occlusion`,()=>new Hu(this.device.getDevice(),this.device.getFormat(),this.sampleCount)),this.ao?.encode({encoder:e.encoder,targetView:e.targetView,depthView:e.depthView,params:{projection:e.projection,width:e.width,height:e.height,quality:n.ambientOcclusion,radius:t.contactShading.radius,intensity:t.contactShading.intensity}}));let r=e.selectionOutline!==null&&!yd.isEmpty(e.selectionOutline);if((n.edges||r)&&(this.edges??=this.build(`edges`,()=>new sd(this.device.getDevice(),this.device.getFormat(),this.sampleCount))),n.edges&&this.edges?.encode({encoder:e.encoder,targetView:e.targetView,depthView:e.depthView,objectIdView:e.objectIdView,params:{projection:e.projection,width:e.width,height:e.height,quality:t.separationLines.quality===`high`?`high`:`low`,radiusPx:t.separationLines.radius*e.pixelRatio,intensity:t.separationLines.intensity}}),r&&e.selectionOutline){this.selectionMask??=this.build(`selection outline`,()=>new yd(this.device,this.meshBindGroupLayout,this.sampleCount));let t=this.selectionMask?.encode({encoder:e.encoder,width:e.width,height:e.height,depthView:e.maskDepthView,selected:e.selectionOutline.selected,hovered:e.selectionOutline.hovered,instanced:e.selectionOutline.instanced});t&&this.edges?.encodeOutline({encoder:e.encoder,targetView:e.targetView,mask:t,params:{width:e.width,height:e.height}})}e.edl&&(this.edl??=this.build(`eye-dome lighting`,()=>new cd(this.device,this.sampleCount)),this.edl?.apply(e.encoder,{targetView:e.targetView,depthView:e.depthView},{...e.edl,radiusPx:e.edl.radiusPx*e.pixelRatio}))}build(e,t){if(this.failed.has(e))return null;try{return t()}catch(t){return this.failed.add(e),console.warn(`[Renderer] ${e} pass unavailable; rendering without it:`,t),null}}destroy(){this.ao?.destroy(),this.ao=null,this.edges?.destroy(),this.edges=null,this.edl?.destroy(),this.edl=null,this.selectionMask?.destroy(),this.selectionMask=null}};function xd(e,t,n){return e.expressId===t&&(n===void 0||e.modelIndex===n)}function Sd(e){return e.bindGroup?{vertexBuffer:e.vertexBuffer,indexBuffer:e.indexBuffer,indexCount:e.indexCount,bindGroup:e.bindGroup}:null}var Cd={m:new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])};function wd(e){let t=new Float32Array(e.uniformBufferSize/4);t.set(e.viewProj,0),t.set(Cd.m,H.model),e.relativeToEyeFrame.packUniforms(t,H.rteViewProj);let n=ct(e.clipBox,t,H.clipBoxMin);ae(e.relativeToEyeFrame,e.section,e.clipBox,t,e.extraPlanes);let r=new Uint32Array(t.buffer,W,2);return r[0]=U,r[1]=+!!e.section?.enabled|(e.sectionFlipped?2:0)|n,t}function Td(e,t){let n=wd(e);n.set(t.transform.m,H.model);let r=t.rteOrigin??[t.transform.m[12],t.transform.m[13],t.transform.m[14]];return e.relativeToEyeFrame.packDrawableOrigin(r,n,H.drawableDelta),n}function Ed(e){let t=(e.instancedTemplates??[]).filter(e=>e.selectedCount>0),n=e.hoveredId==null?[]:e.instancedHovered??[];return t.length===0&&n.length===0?null:{uniforms:wd(e),rteCamera:e.relativeToEyeFrame.getCameraWorld(),selected:t,hovered:n,hoveredId:e.hoveredId??0}}function Dd(e){let t=[];for(let n of e.selectedMeshes){let e=Sd(n);e&&t.push(e)}let n=[];if(e.hoveredId!=null){let t=e.hoveredId,r=e.selectedMeshes.filter(n=>xd(n,t,e.selectedModelIndex));if(r.length>0)for(let e of r){let t=Sd(e);t&&n.push(t)}else for(let t of e.hoverPieces)n.push({vertexBuffer:t.vertexBuffer,indexBuffer:t.indexBuffer,indexCount:t.indexCount,uniforms:Td(e,t)})}return{selected:t,hovered:n,instanced:Ed(e)}}var Od=0xffffff,kd=!1;function Ad(e,t,n){let r=t.positions.length/3,i=new ArrayBuffer(r*7*4),a=new Float32Array(i),o=new Uint32Array(i),s=t.origin,c=n.sharedOrigin,l=s?s[0]:0,u=s?s[1]:0,d=s?s[2]:0,f=Math.fround,p=c?l-c[0]:l,m=c?u-c[1]:u,h=c?d-c[2]:d,g=n.quantized?e=>Math.round(e*1024)/1024:e=>e,v=t.positions;for(let e=0;e<r;e++){let n=e*7,r=e*3;a[n]=g(c?f(v[r]+p):v[r]),a[n+1]=g(c?f(v[r+1]+m):v[r+1]),a[n+2]=g(c?f(v[r+2]+h):v[r+2]);let i=t.normals.length>0;a[n+3]=i?t.normals[r]:0,a[n+4]=i?t.normals[r+1]:0,a[n+5]=i?t.normals[r+2]:0;let s=t.expressId>>>0;s>Od&&(kd||(kd=!0,console.warn(`[Renderer] expressId exceeds 24-bit seam-ID encoding range; seam lines may collide.`)),s&=Od),o[n+6]=js(s,As(t.color))}let y=e.createBuffer({size:a.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(y,0,a);let b=e.createBuffer({size:t.indices.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});e.queue.writeBuffer(b,0,t.indices);let x=_.identity();return x.m[12]=c?c[0]:l,x.m[13]=c?c[1]:u,x.m[14]=c?c[2]:d,{vertexBuffer:y,indexBuffer:b,indexCount:t.indices.length,transform:x,rteOrigin:c?[c[0],c[1],c[2]]:[l,u,d]}}var jd=class{key=null;pieces=[];resolve(e,t,n,r,i){let a=`${n??`any`}:${t}`;return a===this.key||(this.release(),this.key=a,this.pieces=(r()??[]).map(t=>Ad(e,t,i(t)))),this.pieces}release(){for(let e of this.pieces)e.vertexBuffer.destroy(),e.indexBuffer.destroy();this.pieces=[],this.key=null}},Md=250,Nd=24,Pd=8,Fd=6,Id=1.6,Ld=4,Rd=17,zd=3e3,Bd=6e4,Vd=30,Hd=class{lastInteractiveTs=null;deltas=[];degraded=!1;strikes=0;lastStrikeTs=-1/0;cleanStreak=0;frame(e,t,n=!1,r=0){if(!e)return this.lastInteractiveTs=null,!0;let i=this.lastInteractiveTs;if(this.lastInteractiveTs=t,i===null||t-i>Md){if(this.deltas.length=0,this.cleanStreak=0,this.degraded){let e=Math.min(zd*2**Math.max(0,this.strikes-1),Bd);t-this.lastStrikeTs>=e&&(this.degraded=!1)}return!this.degraded}if(n)return this.deltas.length=0,this.cleanStreak=0,!this.degraded;let a=t-i;if(!this.degraded){this.deltas.push(a),this.deltas.length>Nd&&this.deltas.shift();let e=1/0;for(let t of this.deltas)t<e&&(e=t);let n=Math.max(Math.min(Math.max(e,Ld),Rd),r)*Id;if(this.deltas.length>=Pd){let e=0;for(let t of this.deltas)t>n&&e++;e>=Fd?(this.degraded=!0,this.strikes++,this.lastStrikeTs=t,this.deltas.length=0,this.cleanStreak=0):(this.cleanStreak++,this.cleanStreak>=Vd&&this.strikes>0&&(this.strikes=0))}}return!this.degraded}},Ud=class{sources;bounds=null;constructor(e){this.sources=e}get(){return this.bounds}set(e){this.bounds=e}recompute(){let e=this.sources.meshBounds(),t=this.sources.pointCloudBounds();!e&&!t?this.bounds=null:(this.bounds=e??{min:{x:t.min[0],y:t.min[1],z:t.min[2]},max:{x:t.max[0],y:t.max[1],z:t.max[2]}},e&&t&&this.expandForPointClouds())}expandForPointClouds(){let e=this.sources.pointCloudBounds();if(!e)return;if(!this.bounds){this.bounds={min:{x:e.min[0],y:e.min[1],z:e.min[2]},max:{x:e.max[0],y:e.max[1],z:e.max[2]}};return}let t=this.bounds;t.min.x=Math.min(t.min.x,e.min[0]),t.min.y=Math.min(t.min.y,e.min[1]),t.min.z=Math.min(t.min.z,e.min[2]),t.max.x=Math.max(t.max.x,e.max[0]),t.max.y=Math.max(t.max.y,e.max[1]),t.max.z=Math.max(t.max.z,e.max[2])}updateFromMeshes(e,t){this.bounds||={min:{x:1/0,y:1/0,z:1/0},max:{x:-1/0,y:-1/0,z:-1/0}};for(let n of e){let e=n.positions,r=n.origin,i=t?.(n.modelIndex??0),a=(r?.[0]??0)+(i?.[0]??0),o=(r?.[1]??0)+(i?.[1]??0),s=(r?.[2]??0)+(i?.[2]??0);for(let t=0;t<e.length;t+=3){let n=e[t]+a,r=e[t+1]+o,i=e[t+2]+s;Number.isFinite(n)&&Number.isFinite(r)&&Number.isFinite(i)&&(this.bounds.min.x=Math.min(this.bounds.min.x,n),this.bounds.min.y=Math.min(this.bounds.min.y,r),this.bounds.min.z=Math.min(this.bounds.min.z,i),this.bounds.max.x=Math.max(this.bounds.max.x,n),this.bounds.max.y=Math.max(this.bounds.max.y,r),this.bounds.max.z=Math.max(this.bounds.max.z,i))}}}expandWithFlatVertices(e,t){this.expandWithVertices(e.length,t,(t,n)=>e[t+n])}expandWithAnchoredVertices(e,t,n){this.expandWithVertices(e.length,n,(n,r)=>e[n+r]+t[r])}expandWithVertices(e,t,n){if(e===0)return;(!this.bounds||(e=>e.min.x===-100&&e.min.y===-100&&e.min.z===-100&&e.max.x===100&&e.max.y===100&&e.max.z===100)(this.bounds))&&(this.bounds={min:{x:1/0,y:1/0,z:1/0},max:{x:-1/0,y:-1/0,z:-1/0}});let r=!1;for(let i=0;i+2<e;i+=t){let e=n(i,0),t=n(i,1),a=n(i,2);Number.isFinite(e)&&Number.isFinite(t)&&Number.isFinite(a)&&(e<this.bounds.min.x&&(this.bounds.min.x=e),t<this.bounds.min.y&&(this.bounds.min.y=t),a<this.bounds.min.z&&(this.bounds.min.z=a),e>this.bounds.max.x&&(this.bounds.max.x=e),t>this.bounds.max.y&&(this.bounds.max.y=t),a>this.bounds.max.z&&(this.bounds.max.z=a),r=!0)}if(r)for(let e of[`x`,`y`,`z`])this.bounds.max[e]-this.bounds.min[e]<.001&&(this.bounds.max[e]+=.5,this.bounds.min[e]-=.5)}},Wd=28,Gd=class{device;pipeline;uniformBuffer;bindGroup;scratch=new Float32Array(Wd);destroyed=!1;constructor(e,t,n){this.device=e,this.uniformBuffer=e.createBuffer({label:`sky-uniforms`,size:112,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let r=e.createBindGroupLayout({label:`sky-bgl`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]});this.bindGroup=e.createBindGroup({layout:r,entries:[{binding:0,resource:{buffer:this.uniformBuffer}}]});let i=e.createShaderModule({label:`sky-shader`,code:n});this.pipeline=e.createRenderPipeline({label:`sky-pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[r]}),vertex:{module:i,entryPoint:`vs_main`},fragment:{module:i,entryPoint:`fs_main`,targets:[{format:t.colorFormat},{format:t.objectIdFormat}]},primitive:{topology:`triangle-list`},depthStencil:{format:t.depthFormat,depthWriteEnabled:!1,depthCompare:`greater-equal`},multisample:{count:t.sampleCount}})}draw(e,t,n){if(this.destroyed)return;let r=Math.tan(t.fovY/2),i=r*t.aspect,a=this.scratch;a[0]=t.right[0],a[1]=t.right[1],a[2]=t.right[2],a[3]=i,a[4]=t.up[0],a[5]=t.up[1],a[6]=t.up[2],a[7]=r,a[8]=t.forward[0],a[9]=t.forward[1],a[10]=t.forward[2],a[11]=n.exposure,a[12]=n.sunDirection[0],a[13]=n.sunDirection[1],a[14]=n.sunDirection[2],a[15]=n.sunIntensity,a[16]=n.sky.zenith[0],a[17]=n.sky.zenith[1],a[18]=n.sky.zenith[2],a[19]=0,a[20]=n.sky.horizon[0],a[21]=n.sky.horizon[1],a[22]=n.sky.horizon[2],a[23]=0,a[24]=n.sky.ground[0],a[25]=n.sky.ground[1],a[26]=n.sky.ground[2],a[27]=0,this.device.queue.writeBuffer(this.uniformBuffer,0,a),e.setPipeline(this.pipeline),e.setBindGroup(0,this.bindGroup),e.draw(3)}destroy(){this.destroyed||(this.destroyed=!0,this.uniformBuffer.destroy())}},Kd=`
        struct SkyUniforms {
          camRight: vec3<f32>,
          tanHalfFovX: f32,
          camUp: vec3<f32>,
          tanHalfFovY: f32,
          camForward: vec3<f32>,
          exposure: f32,
          sunDirection: vec3<f32>,
          sunIntensity: f32,
          zenithColor: vec3<f32>,
          _pad0: f32,
          horizonColor: vec3<f32>,
          _pad1: f32,
          groundColor: vec3<f32>,
          _pad2: f32,
        }
        @binding(0) @group(0) var<uniform> sky: SkyUniforms;

        struct VertexOutput {
          @builtin(position) position: vec4<f32>,
          @location(0) ndc: vec2<f32>,
        }

        @vertex
        fn vs_main(@builtin(vertex_index) vi: u32) -> VertexOutput {
          // Fullscreen triangle: (-1,-1), (3,-1), (-1,3).
          let x = f32((vi << 1u) & 2u) * 2.0 - 1.0;
          let y = f32(vi & 2u) * 2.0 - 1.0;
          var out: VertexOutput;
          // z = 0 is the far plane under reverse-Z, so any geometry drawn
          // later wins the depth test without the sky writing depth.
          out.position = vec4<f32>(x, y, 0.0, 1.0);
          out.ndc = vec2<f32>(x, y);
          return out;
        }

        ${l}

        struct FragmentOutput {
          @location(0) color: vec4<f32>,
          // Matches the pass's object-id attachment clear value so the sky
          // never registers as a pickable entity.
          @location(1) objectIdEncoded: vec4<f32>,
        }

        @fragment
        fn fs_main(input: VertexOutput) -> FragmentOutput {
          // Per-pixel view ray from the camera basis. Used for orthographic
          // cameras too — parallel rays would collapse the sky to a single
          // colour, so a perspective-style fan reads better in both modes.
          let dir = normalize(
            sky.camForward
            + input.ndc.x * sky.tanHalfFovX * sky.camRight
            + input.ndc.y * sky.tanHalfFovY * sky.camUp
          );
          let elevation = dir.y;

          // Horizon → zenith gradient with a slow falloff near the horizon.
          let zenithMix = pow(clamp(elevation, 0.0, 1.0), 0.45);
          var color = mix(sky.horizonColor, sky.zenithColor, zenithMix);

          // Below the horizon: fade gradually into the ground colour. The
          // falloff spans elevation -0.5..0 (rather than a near-instant
          // -0.1..0) so the ordinary downward-pitched BIM camera sees a
          // gradient from the horizon tone into the ground tone instead of
          // an abrupt flat-colour wall a few degrees below the horizon
          // (#5583); only a near-vertical look-down reaches pure groundColor.
          // WGSL requires smoothstep's low < high, so express the
          // downward ramp (0 at the horizon → 1 at elevation -0.5) as the
          // complement of an ascending smoothstep rather than passing
          // reversed edges, which Tint rejects as a shader-compile error
          // (low 0.0 not less than high -0.5) — that invalidated the whole
          // sky pipeline and blanked the frame on strict drivers.
          let groundMix = 1.0 - smoothstep(-0.5, 0.0, elevation);
          color = mix(color, sky.groundColor, groundMix);

          // Sun disc + glow. The disc is slightly oversized vs the real
          // ~0.53\xb0 sun so it stays visible at typical canvas resolutions.
          let cosSun = dot(dir, sky.sunDirection);
          let disc = smoothstep(0.99985, 0.99995, cosSun);
          let glow = pow(max(cosSun, 0.0), 350.0) * 0.5
                   + pow(max(cosSun, 0.0), 24.0) * 0.12;
          // Hide the disc once the sun sets, and never draw it on the ground.
          let sunVisible = smoothstep(-0.06, 0.02, sky.sunDirection.y) * (1.0 - groundMix);
          let sunTint = vec3<f32>(1.0, 0.92, 0.78);
          color += (disc * 6.0 + glow) * max(sky.sunIntensity, 0.0) * sunVisible * sunTint;

          // Match the geometry pipeline: exposure → highlight roll-off → sRGB.
          color *= sky.exposure;
          color = linearToSrgb(clamp(neutralCompress(color), vec3<f32>(0.0), vec3<f32>(1.0)));

          var out: FragmentOutput;
          out.color = vec4<f32>(color, 1.0);
          out.objectIdEncoded = vec4<f32>(0.0, 0.0, 0.0, 0.0);
          return out;
        }
      `,qd=`
        ${v}
${L}
        struct Light {
          lightViewProj: mat4x4<f32>,
          cameraHigh: vec4<f32>,
          cameraLow: vec4<f32>,
        }
        @binding(0) @group(0) var<uniform> light: Light;

        struct Draw {
          model: mat4x4<f32>,
          // xyz = lattice-aligned quantMin (batch-origin-relative), w = step.
          // Read only by vs_shadow_quantized; zero for the other paths.
          quantParams: vec4<f32>,
          originHigh: vec4<f32>,
          originLow: vec4<f32>,
        }
        @binding(1) @group(0) var<uniform> draw: Draw;

        struct Clip {
          // xyz = plane normal, w = plane distance (world space).
          sectionPlane: vec4<f32>,
          clipBoxMin: vec4<f32>,
          clipBoxMax: vec4<f32>,
          // x packs: bit 0 = section enabled, bit 1 = section flipped,
          //          bit 2 = clip box enabled. Mirrors main.wgsl's flags.y.
          flags: vec4<u32>,
          extra: ExtraClip,  // cutting planes beyond the first (#7545), eye-relative
        }
        @binding(2) @group(0) var<uniform> clip: Clip;

        struct FlatIn {
          @location(0) position: vec3<f32>,
        }

        struct QuantIn {
          @location(0) q: vec4<u32>,   // uint16x4: lattice x, y, z, packedOct
        }

        struct InstanceIn {
          @location(3) m0: vec4<f32>,
          @location(4) m1: vec4<f32>,
          @location(5) m2: vec4<f32>,
          @location(6) m3: vec4<f32>,
          // Per-occurrence flags lane (bit 1 = hidden), same instance buffer the
          // colour pass reads. Locations 7 (entityId) and 8 (rgba) are in the
          // shared layout but unused by the depth pass.
          @location(9) flags: u32,
          // Split drawable-minus-camera delta from the slot-2 delta stream.
          @location(10) anchorHigh: vec4<f32>,
          @location(11) anchorLow: vec4<f32>,
        }

        struct ShadowOut {
          @builtin(position) position: vec4<f32>,
          @location(0) worldPos: vec3<f32>,
        }

        fn emit(eyePos: vec4<f32>) -> ShadowOut {
          var out: ShadowOut;
          out.position = light.lightViewProj * eyePos;
          out.worldPos = eyePos.xyz;
          return out;
        }

        @vertex
        fn vs_shadow_flat(input: FlatIn) -> ShadowOut {
          let linear = (draw.model * vec4<f32>(input.position, 0.0)).xyz;
          return emit(rteWorldPosition(linear, RteDrawableUniform(draw.originHigh, draw.originLow)));
        }

        @vertex
        fn vs_shadow_quantized(input: QuantIn) -> ShadowOut {
          let p = draw.quantParams.xyz
            + vec3<f32>(f32(input.q.x), f32(input.q.y), f32(input.q.z)) * draw.quantParams.w;
          let linear = (draw.model * vec4<f32>(p, 0.0)).xyz;
          return emit(rteWorldPosition(linear, RteDrawableUniform(draw.originHigh, draw.originLow)));
        }

        @vertex
        fn vs_shadow_instanced(input: FlatIn, inst: InstanceIn) -> ShadowOut {
          // A hidden / isolation-excluded occurrence (flags bit 1) must not cast:
          // the colour pass discards it in fs_main, so collapse it to a zero-area
          // triangle here (every vertex to one clip point) — the rasterizer drops
          // it and it writes no depth. Mirrors main.wgsl's instSelected & 2u check.
          if ((inst.flags & 2u) != 0u) {
            var out: ShadowOut;
            out.position = vec4<f32>(0.0, 0.0, 0.0, 1.0);
            out.worldPos = vec3<f32>(0.0, 0.0, 0.0);
            return out;
          }
          let instMat = mat4x4<f32>(inst.m0, inst.m1, inst.m2, inst.m3);
          // Keep the local placement from the V1 matrix and add the shared
          // CPU-packed drawable-minus-camera delta. The light projection uses
          // the same RTE frame as the colour and picker submissions.
          let linear = (instMat * vec4<f32>(input.position, 0.0)).xyz;
          return emit(rteWorldPosition(linear, RteDrawableUniform(
            inst.anchorHigh, inst.anchorLow,
          )));
        }

        @vertex
        fn vs_shadow_textured(input: FlatIn) -> ShadowOut {
          let linear = (draw.model * vec4<f32>(input.position, 0.0)).xyz;
          return emit(rteWorldPosition(linear, RteDrawableUniform(draw.originHigh, draw.originLow)));
        }

        // Clipped variant: discard before the depth write, so a clipped-away
        // occluder leaves the shadow map untouched. Kept byte-for-byte in step
        // with the fs_main section/clip-box branches.
        @fragment
        fn fs_shadow_clip(@location(0) worldPos: vec3<f32>) {
          if ((clip.flags.x & 1u) == 1u) {
            let side = select(1.0, -1.0, (clip.flags.x & 2u) == 2u);
            let distToPlane = (dot(worldPos, clip.sectionPlane.xyz) - clip.sectionPlane.w) * side;
            if (distToPlane > 0.0) {
              discard;
            }
          }
          if (extraClipClipped(clip.extra, worldPos)) {
            discard;
          }
          if ((clip.flags.x & 4u) != 0u) {
            if (any(worldPos < clip.clipBoxMin.xyz) || any(worldPos > clip.clipBoxMax.xyz)) {
              discard;
            }
          }
        }
`;function Jd(e,t){let n=Number.isFinite(t)&&t>=1024?t:2048;return e&&e>0?Math.max(256,Math.floor(Math.min(e,n))):n>=8192?4096:n>=4096?2048:1024}var Yd=112,Xd=64+P,Zd=`depth32float`,Qd=class{device;resolution;depthTexture;depthTextureView;bindGroupLayout;pipelines;clipPipelines=null;shaderModule;pipelineLayout;lightBuffer;lightScratch=new Float32Array(24);clipBuffer;clipScratch=new Float32Array(Xd/4);clipFlags=new Uint32Array(this.clipScratch.buffer);drawBuffer;drawBufferSlots;drawStride;drawBindGroup;drawScratch;destroyed=!1;constructor(e,t){this.device=e,this.resolution=Math.max(256,Math.floor(t));let n=e.limits.minUniformBufferOffsetAlignment||256;this.drawStride=Math.ceil(Yd/n)*n,this.depthTexture=this.createDepthTexture(this.resolution),this.depthTextureView=this.depthTexture.createView(),this.lightBuffer=e.createBuffer({label:`shadow-light-uniform`,size:96,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.clipBuffer=e.createBuffer({label:`shadow-clip-uniform`,size:Xd,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),this.bindGroupLayout=e.createBindGroupLayout({label:`shadow-bgl`,entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:`uniform`}},{binding:1,visibility:GPUShaderStage.VERTEX,buffer:{type:`uniform`,hasDynamicOffset:!0,minBindingSize:Yd}},{binding:2,visibility:GPUShaderStage.FRAGMENT,buffer:{type:`uniform`}}]}),this.drawBufferSlots=256,this.drawBuffer=this.createDrawBuffer(this.drawBufferSlots),this.drawScratch=new Float32Array(this.drawStride/4*this.drawBufferSlots),this.drawBindGroup=this.createDrawBindGroup(),this.shaderModule=e.createShaderModule({label:`shadow-shader`,code:qd}),this.pipelineLayout=e.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]}),this.pipelines=this.createPipelineSet(!1)}createPipelineSet(e){let t=(t,n)=>this.createPipeline(this.shaderModule,this.pipelineLayout,t,n,e);return{flat:t(`vs_shadow_flat`,[this.posBuffer(28)]),textured:t(`vs_shadow_textured`,[this.posBuffer(36)]),quantized:t(`vs_shadow_quantized`,[this.quantBuffer()]),instanced:t(`vs_shadow_instanced`,it)}}getDepthTextureView(){return this.depthTextureView}getResolution(){return this.resolution}setResolution(e){let t=Math.max(256,Math.floor(e));t===this.resolution||this.destroyed||(this.resolution=t,this.depthTexture.destroy(),this.depthTexture=this.createDepthTexture(t),this.depthTextureView=this.depthTexture.createView())}render(e,t,n,r,i){if(this.destroyed)return;this.lightScratch.set(t.m,0),O(i?.cameraWorld??[0,0,0],this.lightScratch,16),this.device.queue.writeBuffer(this.lightBuffer,0,this.lightScratch);let a=this.writeClipUniform(r,i);a&&!this.clipPipelines&&(this.clipPipelines=this.createPipelineSet(!0));let o=a&&this.clipPipelines?this.clipPipelines:this.pipelines,s=Array(n.length).fill(!0),c=Array(n.length);for(let e=0;e<n.length;e++){let t=n[e];t.kind===`instanced`&&t.instanceBuffer&&t.instanceCount&&t.canonicalAnchors&&t.rteDeltas&&(c[e]=tt(this.device,[{instanceCount:t.instanceCount,canonicalAnchors:t.canonicalAnchors,rteDeltas:t.rteDeltas}],i?.cameraWorld??[0,0,0])[0])}if(n.length>this.drawBufferSlots){let e=this.drawBufferSlots;for(;e<n.length;)e*=2;this.drawBufferSlots=e,this.drawBuffer.destroy(),this.drawBuffer=this.createDrawBuffer(e),this.drawScratch=new Float32Array(this.drawStride/4*e),this.drawBindGroup=this.createDrawBindGroup()}let l=this.drawStride/4;for(let e=0;e<n.length;e++){let t=n[e],r=e*l;t.model&&this.drawScratch.set(t.model,r),this.drawScratch[r+12]=0,this.drawScratch[r+13]=0,this.drawScratch[r+14]=0,this.drawScratch[r+15]=1;let a=t.quantParams;if(this.drawScratch[r+16]=a?a[0]:0,this.drawScratch[r+17]=a?a[1]:0,this.drawScratch[r+18]=a?a[2]:0,this.drawScratch[r+19]=a?a[3]:0,t.kind!==`instanced`){let n=t.origin??[t.model?.[12]??0,t.model?.[13]??0,t.model?.[14]??0],a=i?.cameraWorld??[0,0,0];s[e]=E(n,a,this.drawScratch,r+20)}}n.length>0&&this.device.queue.writeBuffer(this.drawBuffer,0,this.drawScratch.buffer,this.drawScratch.byteOffset,n.length*this.drawStride);let u=e.beginRenderPass({label:`shadow-depth-pass`,timestampWrites:pc(e,`shadow-depth`),colorAttachments:[],depthStencilAttachment:{view:this.depthTextureView,depthClearValue:0,depthLoadOp:`clear`,depthStoreOp:`store`}});for(let e=0;e<n.length;e++){let t=n[e];if(s[e]){if(u.setPipeline(o[t.kind]),u.setBindGroup(0,this.drawBindGroup,[e*this.drawStride]),u.setVertexBuffer(0,t.vertexBuffer),u.setIndexBuffer(t.indexBuffer,`uint32`),t.kind===`instanced`){let n=c[e];if(!n||!t.instanceBuffer||!t.rteDeltas)continue;u.setVertexBuffer(1,t.instanceBuffer),u.setVertexBuffer(2,t.rteDeltas.buffer),rt(u,t.indexCount,n)}else u.drawIndexed(t.indexCount)}}u.end()}destroy(){this.destroyed||(this.destroyed=!0,this.depthTexture.destroy(),this.lightBuffer.destroy(),this.drawBuffer.destroy(),this.clipBuffer.destroy())}writeClipUniform(e,t){let n=e?.section,r=e?.box;if(!n&&!r&&!e?.extraPlanes?.length)return!1;let i=this.clipScratch,a=t?.cameraWorld??[0,0,0];return i.fill(0),n&&(i[0]=n.normal[0],i[1]=n.normal[1],i[2]=n.normal[2],i[3]=M(n.distance,n.normal,a)),N(r,a,i,4),te(e?.extraPlanes,a,i,16),this.clipFlags[12]=+!!n|(n?.flipped?2:0)|(r?4:0),this.device.queue.writeBuffer(this.clipBuffer,0,i),!0}createDepthTexture(e){return this.device.createTexture({label:`shadow-depth`,size:[e,e,1],format:Zd,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING})}createDrawBuffer(e){return this.device.createBuffer({label:`shadow-per-draw-uniform`,size:e*this.drawStride,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}createDrawBindGroup(){return this.device.createBindGroup({label:`shadow-bg`,layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.lightBuffer}},{binding:1,resource:{buffer:this.drawBuffer,size:Yd}},{binding:2,resource:{buffer:this.clipBuffer}}]})}posBuffer(e){return{arrayStride:e,attributes:[{shaderLocation:0,offset:0,format:`float32x3`}]}}quantBuffer(){return{arrayStride:12,attributes:[{shaderLocation:0,offset:0,format:`uint16x4`}]}}createPipeline(e,t,n,r,i){return this.device.createRenderPipeline({label:`shadow-pipeline-${n}${i?`-clipped`:``}`,layout:t,vertex:{module:e,entryPoint:n,buffers:r},...i?{fragment:{module:e,entryPoint:`fs_shadow_clip`,targets:[]}}:{},primitive:{topology:`triangle-list`,cullMode:`none`},depthStencil:{format:Zd,depthWriteEnabled:!0,depthCompare:`greater-equal`,depthBias:-1,depthBiasSlopeScale:-2,depthBiasClamp:-.004}})}},$d={x:0,y:1,z:0},ef=.25;function tf(e,t){return!Number.isFinite(e)||!Number.isFinite(t)?0:Math.min(Math.max(e,0)*(2+Math.max(t,0)),ef)}function nf(e){let t=e[0],n=e[1],r=e[2],i=t*t+n*n+r*r;if(!(i>1e-12&&i<1/0))return $d;let a=1/Math.sqrt(i);return{x:t*a,y:n*a,z:r*a}}function rf(e,t){let n=[];for(let r=0;r<8;r++)n.push({x:r&1?t[0]:e[0],y:r&2?t[1]:e[1],z:r&4?t[2]:e[2]});return n}function af(e,t){return{x:e[0]*t.x+e[4]*t.y+e[8]*t.z+e[12],y:e[1]*t.x+e[5]*t.y+e[9]*t.z+e[13],z:e[2]*t.x+e[6]*t.y+e[10]*t.z+e[14]}}function of(e){let t=nf(e.sunDirection),n=rf(e.boundsMin,e.boundsMax),r=e.focusCorners&&e.focusCorners.length>=4?e.focusCorners:n,i=0,a=0,o=0;for(let e of r)i+=e.x,a+=e.y,o+=e.z;let s=r.length,c={x:i/s,y:a/s,z:o/s},l={x:c.x+t.x,y:c.y+t.y,z:c.z+t.z},u=Math.abs(t.y)>.99?{x:0,y:0,z:1}:{x:0,y:1,z:0},d=_.lookAt(l,c,u),f=d.m,p=1/0,m=-1/0,h=1/0,g=-1/0;for(let e of r){let t=af(f,e);t.x<p&&(p=t.x),t.x>m&&(m=t.x),t.y<h&&(h=t.y),t.y>g&&(g=t.y)}let v=1/0,y=-1/0;for(let e of n){let t=f[2]*e.x+f[6]*e.y+f[10]*e.z+f[14];t<v&&(v=t),t>y&&(y=t)}let b=Math.min(Math.max(e.lateralPadding??.05,0),1),x=Math.max((m-p)*.5,1e-4),S=Math.max((g-h)*.5,1e-4),C=(p+m)*.5,w=(h+g)*.5,T=x*(1+b),E=S*(1+b),D=C-T,O=C+T,k=w-E,A=w+E,j=Math.max((y-v)*.001,.001),M=-y-j,N=-v+j,P=_.orthographicReverseZ(D,O,k,A,M,N);return{lightViewProj:_.multiply(P,d),lightView:d,orthoHalfWidth:T,orthoHalfHeight:E,depthRange:N-M}}function sf(e){let t=rf(e.boundsMin,e.boundsMax),n=1/0,r=-1/0;for(let i of t){let t=(i.x-e.eye.x)*e.forward.x+(i.y-e.eye.y)*e.forward.y+(i.z-e.eye.z)*e.forward.z;t<n&&(n=t),t>r&&(r=t)}if(!(r>.001))return null;n=Math.max(n,.01);let i=Math.min(Math.max(e.margin??.15,0),2),a=t=>{let n=(e.ortho?e.orthoHalfHeight:t*Math.tan(e.fovY/2))*(1+i);return{w:n*e.aspect,h:n}},o=[];for(let t of[n,r]){let{w:n,h:r}=a(t);for(let i of[-1,1])for(let a of[-1,1]){let s=e.eye.x+e.forward.x*t+e.right.x*(i*n)+e.up.x*(a*r),c=e.eye.y+e.forward.y*t+e.right.y*(i*n)+e.up.y*(a*r),l=e.eye.z+e.forward.z*t+e.right.z*(i*n)+e.up.z*(a*r);o.push({x:Math.min(Math.max(s,e.boundsMin[0]),e.boundsMax[0]),y:Math.min(Math.max(c,e.boundsMin[1]),e.boundsMax[1]),z:Math.min(Math.max(l,e.boundsMin[2]),e.boundsMax[2])})}}return o}function cf(e,t){t.color[3]<.9||(t.gpuResident===!1?e.requestBatchResidency(t):e.recordBatchDrawn(t))}function lf(e,t,n,r,i,a){let o=e.getBatchedMeshes();if(!r){for(let t of o)cf(e,t);return o}let s=[];for(let r of o){let o=$a(r.expressIds,t.hiddenIds,t.isolatedIds);if(o.kind===`none`)continue;if(o.kind===`all`){cf(e,r),s.push(r);continue}if(r.color[3]<.9||!i)continue;cf(e,r);let c=e.getOrCreatePartialBatch(`${r.colorKey}:${r.id}`,r.colorKey,o.visibleIds,n,i,a);c&&c.indexCount>0&&s.push(c)}return s}async function uf(e,t){if(!e.isInitialized())return null;try{return await e.getDevice().queue.onSubmittedWorkDone(),t.toDataURL(`image/png`)}catch(e){return console.error(`[Renderer] Screenshot capture failed:`,e),null}}var df=512,ff=4,pf=256,mf=3,hf=new WeakMap;function gf(e,t){let n=Math.min(e,df),r=Math.min(t,df);return{x:Math.floor((e-n)/2),y:Math.floor((t-r)/2),width:n,height:r}}function _f(e,t,n,r,i,a){let o=gf(r,i),s=Math.ceil(o.width*ff/pf)*pf,c=e.createBuffer({size:s*o.height,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{t.copyTextureToBuffer({texture:n,origin:{x:o.x,y:o.y,z:0}},{buffer:c,bytesPerRow:s,rowsPerImage:o.height},{width:o.width,height:o.height,depthOrArrayLayers:1})}catch(e){throw c.destroy(),e}return{buffer:c,width:o.width,height:o.height,bytesPerRow:s,bgra:a.startsWith(`bgra`)}}async function vf(e){let t=!1;try{await e.buffer.mapAsync(1),t=!0;let n=new Uint8Array(e.buffer.getMappedRange()),r=new Uint8ClampedArray(e.width*e.height*ff);for(let t=0;t<e.height;t++)for(let i=0;i<e.width;i++){let a=t*e.bytesPerRow+i*ff,o=(t*e.width+i)*ff;r[o]=e.bgra?n[a+2]:n[a],r[o+1]=n[a+1],r[o+2]=e.bgra?n[a]:n[a+2],r[o+3]=n[a+3]}return{width:e.width,height:e.height,rgba:r}}catch(e){return console.warn(`[Renderer] Color-frame readback failed:`,e),null}finally{t&&e.buffer.unmap(),e.buffer.destroy()}}function yf(e,t,n){if(!t)return Promise.resolve(null);let r=hf.get(e);if(r)return r.promise;let i,a=new Promise(e=>{i=e});hf.set(e,{encoded:!1,skippedFrames:0,promise:a,resolve:i});try{n()}catch(t){return hf.delete(e),i(null),Promise.reject(t)}return a}function bf(e){let t=hf.get(e);t&&(hf.delete(e),t.resolve(null))}function xf(e,t){let n=hf.get(e);n&&!n.encoded&&(n.skippedFrames>=mf?bf(e):(n.skippedFrames++,t()))}function Sf(e,t,n,r,i){let a=hf.get(e);return!a||a.encoded?null:{pending:a,sourceTexture:t,width:n,height:r,format:i}}function Cf(e,t,n){let r=_f(e,t,n.sourceTexture,n.width,n.height,n.format);return n.pending.encoded=!0,r}function wf(e,t,n){vf(n).then(n=>{hf.get(e)===t.pending&&(hf.delete(e),t.pending.resolve(n))})}function Tf(e){e?.buffer.destroy()}var Ef=class{colorOverrides;xray;canPartition;items=[];constructor(e,t,n){this.colorOverrides=e,this.xray=t,this.canPartition=n}requestedKeys(){let e=new Set;for(let t of this.items)e.add(t.sourceBatchKey);return e}pushVisible(e,t,n,r=``){let i=`${e.colorKey}:${e.id}${r}`,a=(t,n)=>{this.items.push({sourceBatchKey:t,colorKey:e.colorKey,visibleIds:n,color:e.color})};if(!n){a(i,t);return}let o=Ve(t,this.colorOverrides);o==null||o.remaining.size===0?a(i,t):(a(`${i}:promoted`,o.promoted),a(`${i}:remaining`,o.remaining))}pushAlphaSplit(e,t){if(!this.xray.active)return!1;let n=t?this.xray.groupsForIds(t,e.color[3]):this.xray.groupsForBatch(e,e.color[3]);if(n==null||!this.canPartition(e))return!1;for(let t=0;t<n.length;t++){let r=n[t];this.pushVisible(e,r.ids,r.alpha<Ie,dl(t))}return!0}};function Df(){let e=Error(`GPU device was lost before the renderer became ready`);return e.name=`RendererDeviceLostError`,e}function Of(t){if(t.recovery.inFlight)return t.recovery.inFlight;if(!t.deviceLost)return Promise.resolve({ok:!1,reason:`not-lost`});if(t.destroyed)return Promise.resolve({ok:!1,reason:`renderer-destroyed`});let r=++t.initGeneration;t.ready=!1,t.deviceLostGeneration=r,t.rejectReadyWaiters(Df()),n(`gpu.recovery.attempts`);let i=t.initChain.then(()=>kf(t,r),()=>kf(t,r));t.initChain=i.then(()=>void 0,()=>void 0),t.recovery.inFlight=i;let a=t=>{n(`gpu.recovery.outcome.${t}`),e.enabled&&console.info(`[Renderer] Device recovery outcome:`,t)};i.then(e=>a(e.ok?`restored`:e.reason),()=>a(`rejected`));let o=()=>{t.recovery.inFlight===i&&(t.recovery.inFlight=null)};return i.then(o,o),i}async function kf(e,t){let r=e.deviceLossSequence;if(t!==e.initGeneration||e.destroyed)return{ok:!1,reason:`renderer-destroyed`};let i;try{i=e.scene.prepareDeviceRecovery()}catch(e){return console.error(`[Renderer] Failed to prepare the CPU scene for device recovery:`,e),{ok:!1,reason:`cold-restore-failed`,error:e}}if(!i.ok)return i;if(t!==e.initGeneration||e.destroyed)return{ok:!1,reason:`renderer-destroyed`};let a=e.scene,o=a,s=jl(o),l=null,u=()=>e.scene===a&&(!s||s.valid()),d=()=>(e.deviceLost=!0,e.ready=!1,l?.(),e.teardown(!1),{ok:!1,reason:`scene-not-settled`});for(let t of e.overlays.recoveryOmissions())e.recovery.omissions.add(t);e.recovery.lostReferenceImages&&e.recovery.omissions.add(`reference-images`),e.pointCloudRenderer?.hasAssets()&&e.recovery.omissions.add(`point-clouds`);let f=e.pointCloudRenderer?.getOptions()??e.recovery.pointCloudOptions;e.recovery.pointCloudOptions=f??null;let p=`scene`;try{if(!u()||(a.discardGpuResourcesForRecovery(),s&&!s.discarded()))return d();if(e.teardown(!1),e.device=new c,n(`gpu.deviceReplacements`),p=`device`,await e.initOnce(t,{clearDeviceLost:!1,publishReady:!1}),f&&e.pointCloudRenderer?.setOptions(f),t!==e.initGeneration||e.destroyed)return e.teardown(!0),{ok:!1,reason:`renderer-destroyed`};if(e.deviceLossSequence!==r)throw Error(`Replacement GPU device was lost during initialization`);if(!u())return d();let i=e.scene.prepareDeviceRecovery();if(!i.ok)return e.deviceLost=!0,e.ready=!1,e.teardown(!1),i;if(e.recovery.quantizedBatchesRequested&&e.pipeline){let t=await e.pipeline.ensureQuantizedPipelines();if(!u())return d();e.scene.setQuantizedBatches(t)}if(p=`scene`,!e.pipeline)throw Error(`Replacement render pipeline was not initialized`);if(!u()||(e.scene.restoreGpuResourcesAfterRecovery(e.device.getDevice(),e.pipeline),l=wl(o),s&&!s.restored()))return d();if(await Promise.resolve(),t!==e.initGeneration||e.destroyed)return e.teardown(!0),{ok:!1,reason:`renderer-destroyed`};if(e.deviceLossSequence!==r)throw Error(`Replacement GPU device was lost during scene restore`);if(!u())return d();let m=e.scene.prepareDeviceRecovery();if(!m.ok)return e.deviceLost=!0,e.ready=!1,l?.(),e.teardown(!1),m;if(e.refreshPlacementBounds(),!u())return d();e.deviceLost=!1,e.deviceLostInfo=null,e.recovery.lostReferenceImages=!1,e.recovery.pointCloudOptions=null;let h=[...e.recovery.omissions];return e.recovery.omissions.clear(),e.markReady(t),e.requestRender(),{ok:!0,omissions:h}}catch(t){console.error(`[Renderer] Device recovery failed during ${p} restore:`,t),e.deviceLost=!0,e.ready=!1;try{l?.(),e.teardown(!1)}catch(e){console.warn(`[Renderer] Failed to dispose a partial recovery attempt:`,e)}return{ok:!1,reason:p===`device`?`device-init-failed`:`scene-restore-failed`,error:t}}}function Af(e,t){if(e.deviceLost)throw Df();if(!e.pointCloudRenderer)throw Error(`Renderer not initialized. Call init() first.`);let n=e.pointCloudRenderer.beginAsset(t);return e.pointCloudStreamEpochs.set(n.id,e.pointCloudStreamEpoch),n}function jf(e,t){if(e.deviceLost||!e.pointCloudRenderer||e.pointCloudStreamEpochs.get(t.id)!==e.pointCloudStreamEpoch)throw Df();return e.pointCloudRenderer}function Mf(e,t,n,r){jf(e,t).appendChunk(t,n,r),e.modelBoundsTracker.expandForPointClouds(),e.camera.setSceneBounds(e.modelBounds),e.requestRender()}function Nf(e,t,n){if(e.deviceLost||!e.pointCloudRenderer||e.pointCloudStreamEpochs.get(t.id)!==e.pointCloudStreamEpoch)return 0;let r=e.pointCloudRenderer.removeChunk(t,n);return r>0&&e.requestRender(),r}function Pf(e,t){jf(e,t).endAsset(t),e.requestRender()}function Ff(e,t){e.pointCloudStreamEpochs.delete(t.id)&&(e.pointCloudRenderer?.removeAsset(t),e.refreshPlacementBounds())}var If=`
struct BvhNode {
  aabbMinX: f32, aabbMinY: f32, aabbMinZ: f32,
  // High bit: leaf flag. Low 31 bits: leaf=triStart, internal=leftChildIdx.
  leafOrLeft: u32,
  aabbMaxX: f32, aabbMaxY: f32, aabbMaxZ: f32,
  // Leaf=triCount, internal=rightChildIdx.
  countOrRight: u32,
}

struct DeviationParams {
  // Per-asset model matrix (column-major) applied to each chunk-space
  // point BEFORE the BVH query. The BVH triangles live in WORLD (viewer)
  // space; a point cloud aligned via IfcMapConversion (issue #1804)
  // stores decode-shifted residual positions and carries its world
  // placement in this matrix — identical to the splat shader's
  // uniforms.model. Identity for unaligned assets.
  model: mat4x4<f32>,
  pointCount: u32,
  pointStrideF32: u32,    // floats between successive points in positions buffer
  positionOffsetF32: u32, // float offset of vec3 position within a point
  // Optional clip range — when nonzero, signs above + below are kept
  // but values past \xb1maxRange are clamped (saves shader work for
  // points far outside the model).
  maxRange: f32,
}

@group(0) @binding(0) var<storage, read> bvhNodes: array<BvhNode>;
@group(0) @binding(1) var<storage, read> triangles: array<f32>;
@group(0) @binding(2) var<storage, read> positions: array<f32>;
@group(0) @binding(3) var<storage, read_write> deviations: array<f32>;
@group(0) @binding(4) var<uniform> params: DeviationParams;

const LEAF_FLAG: u32 = 0x80000000u;
const STACK_SIZE: u32 = 64u;

// Squared distance from point p to AABB [aabbMin, aabbMax].
// Returns 0 if p is inside the box.
fn distSqPointAabb(
  px: f32, py: f32, pz: f32,
  ax: f32, ay: f32, az: f32,
  bx: f32, by: f32, bz: f32,
) -> f32 {
  let dx = max(max(ax - px, 0.0), px - bx);
  let dy = max(max(ay - py, 0.0), py - by);
  let dz = max(max(az - pz, 0.0), pz - bz);
  return dx * dx + dy * dy + dz * dz;
}

struct ClosestResult {
  point: vec3<f32>,
  distSq: f32,
}

// Ericson, Real-Time Collision Detection \xa75.1.5: closest point on
// a triangle to an arbitrary point in space. Branches over the
// Voronoi regions of the triangle (3 verts, 3 edges, interior).
fn closestPointOnTriangle(p: vec3<f32>, a: vec3<f32>, b: vec3<f32>, c: vec3<f32>) -> ClosestResult {
  let ab = b - a;
  let ac = c - a;
  let ap = p - a;
  let d1 = dot(ab, ap);
  let d2 = dot(ac, ap);
  if (d1 <= 0.0 && d2 <= 0.0) {
    let diff = p - a;
    return ClosestResult(a, dot(diff, diff));
  }
  let bp = p - b;
  let d3 = dot(ab, bp);
  let d4 = dot(ac, bp);
  if (d3 >= 0.0 && d4 <= d3) {
    let diff = p - b;
    return ClosestResult(b, dot(diff, diff));
  }
  let vc = d1 * d4 - d3 * d2;
  if (vc <= 0.0 && d1 >= 0.0 && d3 <= 0.0) {
    let v = d1 / (d1 - d3);
    let q = a + v * ab;
    let diff = p - q;
    return ClosestResult(q, dot(diff, diff));
  }
  let cp = p - c;
  let d5 = dot(ab, cp);
  let d6 = dot(ac, cp);
  if (d6 >= 0.0 && d5 <= d6) {
    let diff = p - c;
    return ClosestResult(c, dot(diff, diff));
  }
  let vb = d5 * d2 - d1 * d6;
  if (vb <= 0.0 && d2 >= 0.0 && d6 <= 0.0) {
    let w = d2 / (d2 - d6);
    let q = a + w * ac;
    let diff = p - q;
    return ClosestResult(q, dot(diff, diff));
  }
  let va = d3 * d6 - d5 * d4;
  if (va <= 0.0 && (d4 - d3) >= 0.0 && (d5 - d6) >= 0.0) {
    let w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
    let q = b + w * (c - b);
    let diff = p - q;
    return ClosestResult(q, dot(diff, diff));
  }
  // Inside the face: barycentric (v, w).
  let denom = 1.0 / (va + vb + vc);
  let v = vb * denom;
  let w = vc * denom;
  let q = a + ab * v + ac * w;
  let diff = p - q;
  return ClosestResult(q, dot(diff, diff));
}

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) gid: vec3<u32>) {
  let pi = gid.x;
  if (pi >= params.pointCount) {
    return;
  }
  let posOff = pi * params.pointStrideF32 + params.positionOffsetF32;
  let rawP = vec3<f32>(positions[posOff], positions[posOff + 1u], positions[posOff + 2u]);
  // World-space point: same transform the splat vertex shader applies,
  // so deviations are measured in the frame the user actually sees.
  let p = (params.model * vec4<f32>(rawP, 1.0)).xyz;

  // Best squared distance across all triangles. Stored squared so
  // we can prune AABBs without taking sqrt every step.
  var bestDistSq: f32 = 1.0e30;
  var bestPoint: vec3<f32> = vec3<f32>(0.0);
  var bestNormal: vec3<f32> = vec3<f32>(0.0, 1.0, 0.0);

  // Stack-based BVH descent. Workgroup-uniform stack would let
  // siblings cooperate; for v1 a per-thread stack in private memory
  // is simpler and fast enough.
  var stack: array<u32, STACK_SIZE>;
  var sp: u32 = 0u;
  stack[sp] = 0u;
  sp = sp + 1u;

  loop {
    if (sp == 0u) { break; }
    sp = sp - 1u;
    let nodeIdx = stack[sp];
    let node = bvhNodes[nodeIdx];

    let aabbDistSq = distSqPointAabb(
      p.x, p.y, p.z,
      node.aabbMinX, node.aabbMinY, node.aabbMinZ,
      node.aabbMaxX, node.aabbMaxY, node.aabbMaxZ,
    );
    if (aabbDistSq >= bestDistSq) {
      continue;
    }

    let leafFlag = node.leafOrLeft & LEAF_FLAG;
    if (leafFlag != 0u) {
      let triStart = node.leafOrLeft & (~LEAF_FLAG);
      let triCount = node.countOrRight;
      var i: u32 = 0u;
      loop {
        if (i >= triCount) { break; }
        let triOff = (triStart + i) * 12u;
        let v0 = vec3<f32>(triangles[triOff],      triangles[triOff + 1u],  triangles[triOff + 2u]);
        let v1 = vec3<f32>(triangles[triOff + 3u], triangles[triOff + 4u],  triangles[triOff + 5u]);
        let v2 = vec3<f32>(triangles[triOff + 6u], triangles[triOff + 7u],  triangles[triOff + 8u]);
        let n  = vec3<f32>(triangles[triOff + 9u], triangles[triOff + 10u], triangles[triOff + 11u]);
        let res = closestPointOnTriangle(p, v0, v1, v2);
        if (res.distSq < bestDistSq) {
          bestDistSq = res.distSq;
          bestPoint = res.point;
          bestNormal = n;
        }
        i = i + 1u;
      }
    } else {
      // Internal node: push both children. Sibling that's closer to
      // p first (top of stack) so we hit the tighter bound earlier.
      let leftIdx = node.leafOrLeft;
      let rightIdx = node.countOrRight;
      let lNode = bvhNodes[leftIdx];
      let rNode = bvhNodes[rightIdx];
      let lDist = distSqPointAabb(
        p.x, p.y, p.z,
        lNode.aabbMinX, lNode.aabbMinY, lNode.aabbMinZ,
        lNode.aabbMaxX, lNode.aabbMaxY, lNode.aabbMaxZ,
      );
      let rDist = distSqPointAabb(
        p.x, p.y, p.z,
        rNode.aabbMinX, rNode.aabbMinY, rNode.aabbMinZ,
        rNode.aabbMaxX, rNode.aabbMaxY, rNode.aabbMaxZ,
      );
      // Push the farther child first → closer popped first.
      if (sp + 2u <= STACK_SIZE) {
        if (lDist < rDist) {
          stack[sp] = rightIdx; sp = sp + 1u;
          stack[sp] = leftIdx;  sp = sp + 1u;
        } else {
          stack[sp] = leftIdx;  sp = sp + 1u;
          stack[sp] = rightIdx; sp = sp + 1u;
        }
      }
    }
  }

  // Signed distance: project (p - closestPoint) onto the closest
  // triangle's normal. Positive means p is on the outward side.
  //
  // sign() returns 0 when (p - closestPoint) is perpendicular to the
  // normal -- i.e. the point is COPLANAR with the triangle but its closest
  // feature is an edge/vertex (a point beside a wall, an open door swung
  // into a wall's plane, a floor point laterally past the nearest floor
  // tri). That multiplied a genuinely large dist by 0 and painted far
  // points at the ramp centre (white). Treat the in-plane case as the
  // outward side so the magnitude still flags them.
  let toPoint = p - bestPoint;
  let dist = sqrt(bestDistSq);
  let nd = dot(toPoint, bestNormal);
  let s = select(-1.0, 1.0, nd >= 0.0);
  var signed: f32 = s * dist;

  // Optional clip: keeps the histogram + ramp focused on near-surface
  // points. Past \xb1maxRange the value pegs at the edge.
  if (params.maxRange > 0.0) {
    let mr = params.maxRange;
    if (signed > mr) { signed = mr; }
    if (signed < -mr) { signed = -mr; }
  }

  deviations[pi] = signed;
}
`,Lf=32,Rf=48,zf=80,Bf=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]),Vf=class{device;pipeline;bindGroupLayout;bvhNodesBuffer=null;trianglesBuffer=null;bvhTriangleCount=0;bvhNodeCount=0;bvhBounds=null;transientParamsBuffers=[];constructor(e){this.device=e,this.bindGroupLayout=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:`read-only-storage`}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:`storage`}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:`uniform`}}]});let t=e.createPipelineLayout({bindGroupLayouts:[this.bindGroupLayout]});this.pipeline=e.createComputePipeline({layout:t,compute:{module:e.createShaderModule({code:If}),entryPoint:`cs_main`}})}uploadBvh(e){if(this.disposeBvh(),e.triangleCount===0){this.bvhNodeCount=0,this.bvhTriangleCount=0,this.bvhBounds=e.bounds;return}let t=this.device.createBuffer({size:e.nodeCount*Lf,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});this.device.queue.writeBuffer(t,0,e.nodes.subarray(0,e.nodeCount*Lf/4));let n;try{n=this.device.createBuffer({size:e.triangleCount*Rf,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST})}catch(e){try{t.destroy()}catch(e){console.warn(`[DeviationPipeline] failed to release nodeBuf after a paired allocation failure`,e)}throw e}this.device.queue.writeBuffer(n,0,e.triangles.subarray(0,e.triangleCount*Rf/4)),this.bvhNodesBuffer=t,this.trianglesBuffer=n,this.bvhNodeCount=e.nodeCount,this.bvhTriangleCount=e.triangleCount,this.bvhBounds=e.bounds}hasBvh(){return this.bvhNodesBuffer!==null&&this.trianglesBuffer!==null&&this.bvhTriangleCount>0}getBvhStats(){return{nodeCount:this.bvhNodeCount,triangleCount:this.bvhTriangleCount,bounds:this.bvhBounds}}dispatch(e,t){if(!this.bvhNodesBuffer||!this.trianglesBuffer)return!1;if(t.pointCount===0)return!0;let n=this.device.createBuffer({size:zf,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});this.transientParamsBuffers.push(n);let r=new Uint32Array(zf/4),i=new Float32Array(r.buffer),a=t.model&&t.model.length===16?t.model:Bf;i.set(a,0),r[16]=t.pointCount,r[17]=6,r[18]=0,i[19]=Math.max(0,t.maxRange),this.device.queue.writeBuffer(n,0,r.buffer,0,zf);let o=this.device.createBindGroup({layout:this.bindGroupLayout,entries:[{binding:0,resource:{buffer:this.bvhNodesBuffer}},{binding:1,resource:{buffer:this.trianglesBuffer}},{binding:2,resource:{buffer:t.positionsBuffer}},{binding:3,resource:{buffer:t.deviationsBuffer}},{binding:4,resource:{buffer:n}}]}),s=e.beginComputePass();s.setPipeline(this.pipeline),s.setBindGroup(0,o);let c=Math.ceil(t.pointCount/64);return s.dispatchWorkgroups(c),s.end(),!0}disposeBvh(){this.bvhNodesBuffer?.destroy(),this.trianglesBuffer?.destroy(),this.bvhNodesBuffer=null,this.trianglesBuffer=null}releaseTransientParams(){for(let e of this.transientParamsBuffers)e.destroy();this.transientParamsBuffers=[]}destroy(){this.disposeBvh(),this.releaseTransientParams()}},Hf=0x80000000;function Uf(e,t={}){let n=t.maxTrisPerLeaf??16,r=Wf(e),i=new Float32Array(r*12),a=new Float32Array(r*3),o=new Float32Array(r*6),s=0,c=1/0,l=1/0,u=1/0,d=-1/0,f=-1/0,p=-1/0;for(let t of e){let e=t.positions,n=t.indices;if(!e||e.length===0)continue;let r=t.origin?t.origin[0]:0,m=t.origin?t.origin[1]:0,h=t.origin?t.origin[2]:0,g=n?n.length:e.length/3;for(let t=0;t+2<g;t+=3){let g=n?n[t]*3:t*3,_=n?n[t+1]*3:(t+1)*3,v=n?n[t+2]*3:(t+2)*3,y=e[g]+r,b=e[g+1]+m,x=e[g+2]+h,S=e[_]+r,C=e[_+1]+m,w=e[_+2]+h,T=e[v]+r,E=e[v+1]+m,D=e[v+2]+h,O=s*12;i[O]=y,i[O+1]=b,i[O+2]=x,i[O+3]=S,i[O+4]=C,i[O+5]=w,i[O+6]=T,i[O+7]=E,i[O+8]=D;let k=S-y,A=C-b,j=w-x,M=T-y,N=E-b,P=D-x,F=A*P-j*N,ee=j*M-k*P,I=k*N-A*M,te=Math.hypot(F,ee,I);te>1e-12?(F/=te,ee/=te,I/=te):(F=0,ee=1,I=0),i[O+9]=F,i[O+10]=ee,i[O+11]=I;let L=(y+S+T)/3,R=(b+C+E)/3,z=(x+w+D)/3;a[s*3]=L,a[s*3+1]=R,a[s*3+2]=z;let B=Math.min(y,S,T),ne=Math.min(b,C,E),V=Math.min(x,w,D),re=Math.max(y,S,T),H=Math.max(b,C,E),U=Math.max(x,w,D);o[s*6]=B,o[s*6+1]=ne,o[s*6+2]=V,o[s*6+3]=re,o[s*6+4]=H,o[s*6+5]=U,B<c&&(c=B),ne<l&&(l=ne),V<u&&(u=V),re>d&&(d=re),H>f&&(f=H),U>p&&(p=U),s++}}let m=new Uint32Array(s);for(let e=0;e<s;e++)m[e]=e;let h=Math.max(1,2*s-1),g=new Float32Array(h*8),_=new Uint32Array(g.buffer),v=0,y=()=>v++,b=(e,t,n)=>{let r=e*8;g[r]=t[0],g[r+1]=t[1],g[r+2]=t[2],g[r+4]=n[0],g[r+5]=n[1],g[r+6]=n[2]},x=(e,t,n)=>{let r=e*8;_[r+3]=Hf|t>>>0,_[r+7]=n>>>0},S=(e,t,n)=>{let r=e*8;_[r+3]=t>>>0,_[r+7]=n>>>0},C=[];for(s>0?C.push({start:0,end:s,nodeIdx:y()}):(y(),b(0,[0,0,0],[0,0,0]),x(0,0,0));C.length>0;){let{start:e,end:t,nodeIdx:r}=C.pop(),i=t-e,s=1/0,c=1/0,l=1/0,u=-1/0,d=-1/0,f=-1/0,p=1/0,h=1/0,g=1/0,_=-1/0,v=-1/0,w=-1/0;for(let n=e;n<t;n++){let e=m[n],t=e*6,r=e*3;o[t]<s&&(s=o[t]),o[t+1]<c&&(c=o[t+1]),o[t+2]<l&&(l=o[t+2]),o[t+3]>u&&(u=o[t+3]),o[t+4]>d&&(d=o[t+4]),o[t+5]>f&&(f=o[t+5]),a[r]<p&&(p=a[r]),a[r+1]<h&&(h=a[r+1]),a[r+2]<g&&(g=a[r+2]),a[r]>_&&(_=a[r]),a[r+1]>v&&(v=a[r+1]),a[r+2]>w&&(w=a[r+2])}if(b(r,[s,c,l],[u,d,f]),i<=n){x(r,e,i);continue}let T=_-p,E=v-h,D=w-g,O=T>E&&T>D?0:E>D?1:2,k=Array.from(m.subarray(e,t));k.sort((e,t)=>a[e*3+O]-a[t*3+O]);for(let t=0;t<k.length;t++)m[e+t]=k[t];let A=e+(i>>1);if(A===e||A===t){x(r,e,i);continue}let j=y(),M=y();S(r,j,M),C.push({start:A,end:t,nodeIdx:M}),C.push({start:e,end:A,nodeIdx:j})}let w=new Float32Array(s*12);for(let e=0;e<s;e++){let t=m[e]*12,n=e*12;for(let e=0;e<12;e++)w[n+e]=i[t+e]}return{nodes:g.subarray(0,v*8),triangles:w,triangleCount:s,nodeCount:v,meshCount:e.length,bounds:{min:s>0?[c,l,u]:[0,0,0],max:s>0?[d,f,p]:[0,0,0]}}}function Wf(e){let t=0;for(let n of e){let e=n.positions;if(!e||e.length===0)continue;let r=n.indices,i=r?r.length:e.length/3;t+=Math.floor(i/3)}return t}var Gf=0x7fffffff,Kf=0x7f800000,qf=65536,Jf=65535,Yf=65536,Xf=8;function Zf(){return new Promise(e=>{let t=new MessageChannel;t.port1.onmessage=()=>{t.port1.close(),t.port2.close(),e()},t.port2.postMessage(null)})}async function Qf(e,t,n){await Zf(),n?.throwIfAborted();let r=performance.now();for(let i of t){for(let t=0;t<e;){let a=Math.min(e,t+Yf);i.scan(t,a),t=a,performance.now()-r>=Xf&&(await Zf(),n?.throwIfAborted(),r=performance.now())}i.done?.()}}function $f(e,t){if(t&&t.length!==e.length)throw RangeError(`deviation statistics: mask length ${t.length} != values length ${e.length}`)}function ep(e){if(!(e>=0)||!Number.isFinite(e))throw RangeError(`deviation statistics: tolerance must be a finite value ≥ 0, got ${e}`)}function tp(e){return new Uint32Array(e.buffer,e.byteOffset,e.length)}var np=new Uint32Array(1),rp=new Float32Array(np.buffer);function ip(e){return np[0]=e,rp[0]}var ap=class{values;tolerance;valid;count=0;constructor(e,t,n){this.values=e,this.tolerance=t,this.valid=n,$f(e,n),ep(t)}scan(e,t){let{values:n,tolerance:r,valid:i}=this,a=0;for(let o=e;o<t;o++)Math.abs(n[o])<=r&&(!i||i[o]!==0)&&a++;this.count+=a}},op=class{histogram;last;constructor(e){let{center:t,halfRange:n,bins:r}=e;if(!(n>0)||!Number.isFinite(n)||!Number.isFinite(t))throw RangeError(`deviation histogram: halfRange must be finite and > 0, got ${n}`);if(!Number.isInteger(r)||r<1)throw RangeError(`deviation histogram: bins must be a positive integer, got ${r}`);this.histogram={min:t-n,max:t+n,binWidth:2*n/r,counts:Array(r).fill(0),below:0,above:0},this.last=r-1}add(e){let t=this.histogram;e<t.min?t.below++:e>t.max?t.above++:t.counts[Math.min(this.last,Math.floor((e-t.min)/t.binWidth))]++}},sp=class{values;valid;binner;constructor(e,t,n){this.values=e,this.valid=n,$f(e,n),this.binner=new op(t)}scan(e,t){let{values:n,valid:r,binner:i}=this;for(let a=e;a<t;a++){let e=n[a];Number.isFinite(e)&&(!r||r[a]!==0)&&i.add(e)}}},cp=class{sum=0;compensation=0;add(e){let t=this.sum+e;Math.abs(this.sum)>=Math.abs(e)?this.compensation+=this.sum-t+e:this.compensation+=e-t+this.sum,this.sum=t}value(){return this.sum+this.compensation}};function lp(e,t){return Math.min(t-1,Math.max(0,Math.ceil(e*t/100)-1))}var up=[50,95,99],dp=class{values;options;phases;n=0;within=0;clipped=0;min=1/0;max=-1/0;maxAbs=0;mean=0;sum=new cp;sumAbs=new cp;sumSq=new cp;residual=new cp;binner;percentiles=[];bits;high=new Uint32Array(qf);clipAt;targets=[];constructor(e,t){this.values=e,this.options=t,$f(e,t.valid),t.tolerance!==void 0&&ep(t.tolerance),this.binner=t.histogram?new op(t.histogram):null,this.clipAt=t.clipRange===void 0?void 0:Math.fround(t.clipRange),this.bits=tp(e),this.phases=[{scan:(e,t)=>this.scanMoments(e,t),done:()=>this.plan()},{scan:(e,t)=>this.scanResiduals(e,t),done:()=>this.resolve()}]}scanMoments(e,t){let{values:n,bits:r,high:i,binner:a,sum:o,sumAbs:s,sumSq:c,clipAt:l}=this,{valid:u}=this.options,d=this.options.tolerance??NaN,f=l??1/0,{n:p,min:m,max:h,maxAbs:g,within:_,clipped:v}=this;for(let l=e;l<t;l++){let e=r[l]&Gf;if(e>=Kf||u&&u[l]===0)continue;let t=n[l],y=Math.abs(t);p++,i[e>>>16]++,o.add(t),s.add(y),c.add(t*t),t<m&&(m=t),t>h&&(h=t),y>g&&(g=y),y<=d&&_++,y>=f&&v++,a?.add(t)}Object.assign(this,{n:p,min:m,max:h,maxAbs:g,within:_,clipped:v})}plan(){let e=this.n;if(e===0)return;this.mean=this.sum.value()/e;let t=new Map,n=0,r=0;for(let i of up){let a=lp(i,e);for(;r+this.high[n]<=a;)r+=this.high[n++];let o=t.get(n);o||t.set(n,o=new Uint32Array(qf)),this.targets.push({bucket:n,rank:a-r,low:o})}}scanResiduals(e,t){if(this.n===0)return;let{values:n,bits:r,residual:i,mean:a}=this,{valid:o}=this.options,[s,c,l]=[0,1,2].map(e=>this.targets[e]),u=s.bucket,d=c.bucket===u?-1:c.bucket,f=l.bucket===u||l.bucket===c.bucket?-1:l.bucket,p=s.low,m=c.low,h=l.low;for(let s=e;s<t;s++){let e=r[s]&Gf;if(e>=Kf||o&&o[s]===0)continue;let t=n[s]-a;i.add(t*t);let c=e>>>16;c===u?p[e&Jf]++:c===d?m[e&Jf]++:c===f&&h[e&Jf]++}}resolve(){for(let{bucket:e,rank:t,low:n}of this.targets){let r=0,i=0;for(;r+n[i]<=t;)r+=n[i++];this.percentiles.push(ip(e<<16|i))}}};function fp(e,t,n){let{n:r}=e,i=n===void 0?null:{tolerance:n,count:e.within,share:r>0?e.within/r:null},a=e.binner?.histogram??null;if(r===0)return{count:t,validCount:0,clippedCount:0,min:null,max:null,mean:null,meanAbs:null,rms:null,stdDev:null,p50Abs:null,p95Abs:null,p99Abs:null,maxAbs:null,withinTolerance:i,histogram:a};let[o,s,c]=e.percentiles;return{count:t,validCount:r,clippedCount:e.clipped,min:e.min,max:e.max,mean:e.mean,meanAbs:e.sumAbs.value()/r,rms:Math.sqrt(e.sumSq.value()/r),stdDev:Math.sqrt(e.residual.value()/r),p50Abs:o,p95Abs:s,p99Abs:c,maxAbs:e.maxAbs,withinTolerance:i,histogram:a}}pp=async function(e,t={}){let n=new dp(e,t);return await Qf(e.length,n.phases,t.signal),fp(n,e.length,t.tolerance)};mp=async function(e,t,n={}){let r=new ap(e,t,n.valid);return await Qf(e.length,[r],n.signal),r.count};hp=async function(e,t,n={}){let r=new sp(e,t,n.valid);return await Qf(e.length,[r],n.signal),r.binner.histogram};gp=async function(e,t={}){let n=[];for(let r of e.assets)n.push({expressId:r.expressId,modelIndex:r.modelIndex,statistics:await pp(e.values.subarray(r.offset,r.offset+r.count),t)});return n};async function _p(e,t,n){let r=[],i=[],a=0;for(let e of t){let t=e.chunks.filter(e=>e.pointCount>0&&n(e.deviationBuffer)),o=t.reduce((e,t)=>e+t.pointCount,0);o!==0&&(r.push({expressId:e.meta.expressId,modelIndex:e.meta.modelIndex??0,offset:a,count:o}),i.push(t),a+=o)}let o=new Float32Array(a),s=0;for(let t of i)for(let n of t){let t=n.pointCount*Float32Array.BYTES_PER_ELEMENT,r=e.createBuffer({size:t,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ}),i=!1;try{let a=e.createCommandEncoder({label:`deviation-readback`});a.copyBufferToBuffer(n.deviationBuffer,0,r,0,t),e.queue.submit([a.finish()]),await r.mapAsync(GPUMapMode.READ),i=!0,o.set(new Float32Array(r.getMappedRange(),0,n.pointCount),s),s+=n.pointCount}finally{try{i&&r.unmap()}finally{r.destroy()}}}return{values:o,assets:r}}async function vp(e,t,n){return(await gp(await _p(e,t,n))).map(({expressId:e,modelIndex:t,statistics:n})=>({expressId:e,modelIndex:t,pointsProcessed:n.count,finitePoints:n.validCount,minimumDeviation:n.min,maximumDeviation:n.max,meanDeviation:n.mean,statistics:n}))}function yp(e){let t=[String(e.length)];for(let n of e){let e=n.expressId??-1,r=n.modelIndex??-1,i=n.positions?.length??0,a=n.indices?.length??0;t.push(`${e}:${r}:${i}:${a}:${n.origin?.join(`,`)??``}:${n.positions[0]},${n.positions[1]},${n.positions[2]}`)}return t.join(`|`)}function bp(e){let t=[];return e.forEachMeshData(e=>{e.positions&&e.positions.length>0&&t.push(e)}),t}var xp=class{pipeline=null;computedBuffers=null;bvhFingerprint=null;init(e){this.pipeline?.destroy(),this.pipeline=new Vf(e),this.bvhFingerprint=null,this.computedBuffers=null}async readAssetStats(e){return this.readComputed(e,vp)}async readDistances(e){return this.readComputed(e,_p)}async readComputed(e,t){let n=this.computedBuffers;if(!n||!e.pointCloudRenderer)throw Error(`No completed deviation run to read back.`);let r=await t(e.device.getDevice(),e.pointCloudRenderer.getInternalNodes(),e=>n.has(e));if(this.computedBuffers!==n)throw Error(`Deviation results changed during readback. Recompute and try again.`);return r}async compute(e,t){if(!this.pipeline||!t.pointCloudRenderer)throw Error(`Renderer not initialised — call init() first.`);this.computedBuffers=null;let n=bp(t.scene),r=yp(n);if(e.forceRebuild||r!==this.bvhFingerprint){let e=Uf(n);this.pipeline.uploadBvh(e),this.bvhFingerprint=r}let i=this.pipeline.getBvhStats(),a=e.maxRange??1,o=t.device.getDevice().createCommandEncoder({label:`pointcloud-deviation`}),s=0,c=0,l=new WeakSet,u=t.pointCloudRenderer.getInternalNodes();for(let e of u)for(let t of e.chunks)this.pipeline.dispatch(o,{positionsBuffer:t.vertexBuffer,deviationsBuffer:t.deviationBuffer,pointCount:t.pointCount,maxRange:a,model:e.model})&&(s++,c+=t.pointCount,l.add(t.deviationBuffer));t.device.getDevice().queue.submit([o.finish()]);try{await t.device.getDevice().queue.onSubmittedWorkDone()}finally{this.pipeline.releaseTransientParams()}this.computedBuffers=l,t.requestRender();let d=i.bounds,f=d?Math.max(.01,Math.max(d.max[0]-d.min[0],d.max[1]-d.min[1],d.max[2]-d.min[2])/1e3):.05;return{bvhTriangles:i.triangleCount,bvhNodes:i.nodeCount,chunksProcessed:s,pointsProcessed:c,bounds:i.bounds,suggestedHalfRange:f}}destroy(){this.pipeline?.destroy(),this.pipeline=null,this.bvhFingerprint=null,this.computedBuffers=null}};function Sp(e){return typeof DOMException<`u`&&e instanceof DOMException}function Cp(e,t,n){if(e())return{ok:!1,reason:`device-lost`};try{return{ok:!0,value:t()}}catch(t){return Sp(t)&&n?.(t),{ok:!1,reason:`error`,error:t,deviceLostAtTime:e()}}}function wp(){let e=Error(`Renderer was destroyed before it became ready`);return e.name=`RendererDestroyedError`,e}Tp=class{device;pipeline=null;camera;scene;picker=null;canvas;overlayTheme=yt;overlays=new Du({getModelBounds:()=>this.getModelBounds(),expandModelBoundsWithFlatVertices:(e,t)=>this.modelBoundsTracker.expandWithFlatVertices(e,t),expandModelBoundsWithAnchoredLineVertices:(e,t,n)=>this.modelBoundsTracker.expandWithAnchoredVertices(e,t,n),syncCameraSceneBounds:()=>{this.modelBounds&&this.camera.setSceneBounds(this.modelBounds)},requestRender:()=>this.requestRender()});referenceImages=ur(this);getReferenceImages(){return this.referenceImages}postPasses=null;hoverMeshes=new jd;pixelRatio=1;maxPixelRatio=2;interactionEffects=new Hd;skyPass=null;shadowPass=null;shadowsWired=!1;shadowScratch=new Float32Array(24);edlOptions={enabled:!1,strength:1,radiusPx:1,highQuality:!0};pointCloudRenderer=null;pointCloudStreamEpoch=0;pointCloudStreamEpochs=new Map;pointCloudNextHandleId=1;ready=!1;readyWaiters=[];destroyed=!1;initChain=Promise.resolve();initGeneration=0;deviceLost=!1;deviceLostGeneration=null;deviceLostInfo=null;deviceLostListeners=new Set;deviceLossSequence=0;recovery={inFlight:null,lostReferenceImages:!1,quantizedBatchesRequested:!1,omissions:new Set,pointCloudOptions:null};deviationComputer=new xp;visualEnhancementResolver=new uu;modelBoundsTracker=new Ud({meshBounds:()=>this.computeMeshBounds(),pointCloudBounds:()=>this.pointCloudRenderer?.getBounds()??null});get modelBounds(){return this.modelBoundsTracker.get()}pickingManager;raycastEngine;lastRenderErrorTime=-1/0;RENDER_ERROR_THROTTLE_MS=1e3;consecutiveDegradedFrames=0;MAX_DEGRADED_SELF_RETRIES=3;renderDegradation=new Lu;persistentDegradationListeners=new Set;frameContainedThrow=!1;_renderCallCount=0;_renderSkipCount=0;_lastFrameStats=null;_renderErrorCount=0;_lastRenderError=``;_renderRequested=!1;_visibilityEpochs=new to;_xrayEpochs=new hl;_visibilityVersion=0;_partialBatchEpoch=0;_xrayAlpha=null;_xrayAlphaEpoch=-1;_lastColorOverrideGen=-1;_xrayVersion=0;_lastHadPartialSources=!1;_batchVisibilityEpoch=-1;_batchVisibilityCache=new WeakMap;_prevHydratedSelection=new Set;_prevHydratedSelectionModelIndex=void 0;_prevHydratedSelectionItemExpressId;_prevHydratedSelectionItemId;_loggedSectionBounds=!1;uniformScratch=new Float32Array(V);uniformScratchU32=new Uint32Array(this.uniformScratch.buffer,W,4);uniformOverrideU32=new Uint32Array(this.uniformScratch.buffer,H.overrideParams*4,4);_activePickSection=null;_activePickClipBox=null;_activePickExtraPlanes=null;_sectionFrameInput=null;constructor(e){this.canvas=e,this.device=new c,this.camera=new Bn,this.scene=new Wl,this.pickingManager=new Iu(this.camera,this.scene,null,this.canvas,e=>this.createMeshFromData(e)),this.raycastEngine=new Ss(this.camera,this.scene,this.canvas)}async init(){let e=++this.initGeneration;this.ready=!1,this.destroyed=!1;let t=this.initChain.then(()=>this.initOnce(e),()=>this.initOnce(e));return this.initChain=t.then(()=>void 0,()=>void 0),t}async initOnce(e,t={}){this.pipeline!==null&&this.teardown(),t.clearDeviceLost!==!1&&(this.deviceLost=!1);let n=this.device;if(n.onDeviceLost(e=>{this.device===n&&this.handleDeviceLost(e,{fromDevicePromise:!0})}),await n.init(this.canvas),e!==this.initGeneration){this.device.destroy();return}let r=this.device.getMaxTextureDimension(),i=fr(this.canvas,r,this.maxPixelRatio);this.pixelRatio=i?.pixelRatio??1;let a=Math.max(1,Math.min(i?.width??this.canvas.width,r)),o=Math.max(1,Math.min(i?.height??this.canvas.height,r));(!this.canvas.width||!this.canvas.height||this.canvas.width!==a||this.canvas.height!==o)&&(this.canvas.width=a,this.canvas.height=o),this.pipeline=new Ct(this.device,a,o),this.pipeline.selectionColorUniform.update(this.overlayTheme.selection),this.picker=new Hr(this.device,a,o),this.overlays.init(this.device.getDevice(),this.device.getFormat(),this.pipeline.getSampleCount()),this.referenceImages.init(this.device.getDevice(),this.device.getFormat(),this.pipeline.getSampleCount()),this.pointCloudRenderer=new tc(this.device.getDevice(),this.device.getFormat(),`depth24plus-stencil8`,this.pipeline.getSampleCount(),this.pointCloudNextHandleId),this.deviationComputer.init(this.device.getDevice()),this.camera.setAspect(a/o),this.pickingManager.setPicker(this.picker),this.pickingManager.setPointPickProvider(()=>{let e=this.pointCloudRenderer;if(!e||!e.hasAssets())return null;let t=e.getOptions(),n=t.sizeMode===`fixed-px`?0:t.sizeMode===`adaptive-world`?1:2;return{nodes:e.getPickNodes(),sizing:{sizeMode:n,worldRadius:t.worldRadius,pointSizePx:t.pointSize,clickTolerancePx:2}}}),this.raycastEngine.setPointCloudProvider(()=>this.pointCloudRenderer?.getRayQuerySources()??[]),t.publishReady!==!1&&this.markReady(e)}whenReady(){return this.deviceLost&&this.deviceLostGeneration===this.initGeneration?Promise.reject(Df()):this.ready?Promise.resolve():this.destroyed?Promise.reject(wp()):new Promise((e,t)=>{this.readyWaiters.push({resolve:e,reject:t})})}markReady(e){if(e!==this.initGeneration)return;this.ready=!0;let t=this.readyWaiters;this.readyWaiters=[];for(let e of t)e.resolve()}rejectReadyWaiters(e){let t=this.readyWaiters;this.readyWaiters=[];for(let n of t)n.reject(e)}onDeviceLost(e){if(this.deviceLostListeners.add(e),this.deviceLost&&this.deviceLostInfo!==null)try{e(this.deviceLostInfo)}catch(e){console.error(`[Renderer] onDeviceLost listener threw:`,e)}return()=>this.deviceLostListeners.delete(e)}onPersistentRenderDegradation(e){return this.persistentDegradationListeners.add(e),()=>this.persistentDegradationListeners.delete(e)}isDeviceLost(){return this.deviceLost}recoverDevice(){return Of(this)}reportUploadLoss(e){this.handleDeviceLost({message:e instanceof Error?e.message:String(e),reason:`gpu-upload-exception`})}handleDeviceLost(e,t={}){if(this.deviceLost)t.fromDevicePromise&&this.deviceLossSequence++;else{this.deviceLossSequence++,this.deviceLost=!0,bf(this),uc(this),this.recovery.lostReferenceImages=this.referenceImages.hasImages(),this.referenceImages.destroy(),this.deviceLostGeneration=this.initGeneration,this.deviceLostInfo=e,console.warn(`[Renderer] GPU device lost — halting rendering until re-init:`,e.message),this.rejectReadyWaiters(Df());for(let t of this.deviceLostListeners)try{t(e)}catch(e){console.error(`[Renderer] onDeviceLost listener threw:`,e)}}}containFrameThrow(e,t){this.frameContainedThrow=!0,this._renderErrorCount++;let n=e instanceof Error?e.message:String(e);if(this._lastRenderError=n,Sp(e)){console.error(`[Renderer] Frame threw a DOMException (${t}) — treating as device loss:`,e),this.handleDeviceLost({message:n,reason:t===`encode`?`render-encode-exception`:`render-exception`});return}this.device.invalidateContext(),++this.consecutiveDegradedFrames<=this.MAX_DEGRADED_SELF_RETRIES&&this.requestRender(),this.notePersistentDegradation(n,t);let r=performance.now();r-this.lastRenderErrorTime>this.RENDER_ERROR_THROTTLE_MS&&(this.lastRenderErrorTime=r,console.warn(`[Renderer] Frame threw in ${t} (device assumed alive; context will be reconfigured):`,e))}notePersistentDegradation(e,t){let n=this.renderDegradation.note(this.consecutiveDegradedFrames,e,t);if(n){console.warn(`[Renderer] ${n.consecutiveDegradedFrames} consecutive frames degraded without one completing — the viewport is not updating.`);for(let e of this.persistentDegradationListeners)try{e(n)}catch(e){console.error(`[Renderer] onPersistentRenderDegradation listener threw:`,e)}}}setPointClouds(e){if(!this.pointCloudRenderer)throw Error(`Renderer not initialized. Call init() first.`);for(let t of e)this.pointCloudRenderer.setModelTranslation(t.modelIndex??0,this.scene.getModelTranslation(t.modelIndex??0));this.pointCloudRenderer.setAssets(e),this.refreshPlacementBounds()}addPointClouds(e){if(!this.pointCloudRenderer)throw Error(`Renderer not initialized. Call init() first.`);for(let t of e)this.pointCloudRenderer.setModelTranslation(t.modelIndex??0,this.scene.getModelTranslation(t.modelIndex??0)),this.pointCloudRenderer.addAsset(t);this.modelBoundsTracker.expandForPointClouds(),this.camera.setSceneBounds(this.modelBounds),this.requestRender()}getPointCloudAssetCount(){return this.pointCloudRenderer?.getNodeCount()??0}getPointCloudPointCount(){return this.pointCloudRenderer?.getPointCount()??0}clearPointClouds(){this.pointCloudRenderer?.clear(),this.refreshPlacementBounds()}beginPointCloudStream(e){return Af(this,e)}appendPointCloudChunk(e,t,n){Mf(this,e,t,n)}removePointCloudChunk(e,t){return Nf(this,e,t)}endPointCloudStream(e){Pf(this,e)}removePointCloudAsset(e){Ff(this,e)}relabelPointCloudAsset(e,t,n){this.pointCloudRenderer?.relabelAsset(e,t,n),this.requestRender()}computeMeshBounds(){return rc(this.scene)}setPointCloudOptions(e){this.pointCloudRenderer?.setOptions(e),this.requestRender()}getModelPlacementBounds(e,t){return nc(this.scene,this.pointCloudRenderer,e,t)}setModelTranslation(e,t){this.pointCloudRenderer?.validateModelTranslation(e,t),this.scene.setModelTranslation(e,t),this.pointCloudRenderer?.setModelTranslation(e,t),this.clearCaches(),this.refreshPlacementBounds()}setModelRotation(e,t,n){return this.scene.setModelRotation(e,t,n)?(this.clearCaches(),this.refreshPlacementBounds(),!0):!1}setPointCloudTranslation(e,t){this.pointCloudRenderer?.setAssetTranslation(e,t),this.clearCaches(),this.refreshPlacementBounds()}setPointCloudVisibility(e,t){this.pointCloudRenderer?.setAssetVisible(e,t)&&(this.clearCaches(),this.refreshPlacementBounds())}refreshPlacementBounds(){this.modelBoundsTracker.recompute(),this.camera.setSceneBounds(this.modelBounds),this.requestRender()}getPointCloudTransform(e){return this.pointCloudRenderer?.getAssetTransform(e)}getPointCloudPlacement(e){return this.pointCloudRenderer?.getAssetPlacement(e)}setPointCloudTransform(e,t){this.pointCloudRenderer?.setAssetTransform(e,t),this.refreshPlacementBounds()}async computeDeviations(e={}){return this.deviationComputer.compute(e,this.deviationContext())}async readDeviationAssetStats(){return this.deviationComputer.readAssetStats(this.deviationContext())}async readDeviationDistances(){return this.deviationComputer.readDistances(this.deviationContext())}deviationContext=()=>({device:this.device,scene:this.scene,pointCloudRenderer:this.pointCloudRenderer,requestRender:()=>this.requestRender()});setEdlOptions(e){e.enabled!==void 0&&(this.edlOptions.enabled=e.enabled),e.strength!==void 0&&(this.edlOptions.strength=Math.max(0,Math.min(3,e.strength))),e.radiusPx!==void 0&&(this.edlOptions.radiusPx=Math.max(1,Math.min(4,e.radiusPx))),e.highQuality!==void 0&&(this.edlOptions.highQuality=e.highQuality),this.requestRender()}loadGeometry(e){if(this.isDeviceLost())return{ok:!1,reason:`device-lost`};if(!this.device.isInitialized()||!this.pipeline)throw Error(`Renderer not initialized. Call init() first.`);let t=Array.isArray(e)?e:e.meshes;if(t.length===0)return console.warn(`[Renderer] loadGeometry called with empty mesh array`),{ok:!0,value:void 0};let n=this.pipeline;return Cp(()=>this.isDeviceLost(),()=>{let e=this.device.getDevice();this.scene.appendToBatches(t,e,n,!1),this.modelBoundsTracker.updateFromMeshes(t,e=>this.scene.getModelTranslation(e)),console.log(`[Renderer] Loaded ${t.length} meshes`),this.camera.setSceneBounds(this.modelBounds)},e=>this.reportUploadLoss(e))}addMeshes(e,t=!1){if(this.isDeviceLost())return{ok:!1,reason:`device-lost`};if(!this.device.isInitialized()||!this.pipeline)throw Error(`Renderer not initialized. Call init() first.`);if(e.length===0)return{ok:!0,value:void 0};let n=this.pipeline;return Cp(()=>this.isDeviceLost(),()=>{let r=this.device.getDevice();this.scene.appendToBatches(e,r,n,t),this.modelBoundsTracker.updateFromMeshes(e,e=>this.scene.getModelTranslation(e)),this.camera.setSceneBounds(this.modelBounds)},e=>this.reportUploadLoss(e))}fitToView(){if(!this.modelBounds){console.warn(`[Renderer] fitToView called but no geometry loaded`);return}let{min:e,max:t}=this.modelBounds,n={x:(e.x+t.x)/2,y:(e.y+t.y)/2,z:(e.z+t.z)/2},r=Math.max(t.x-e.x,t.y-e.y,t.z-e.z)*1.5;this.camera.setPosition(n.x+r*.5,n.y+r*.5,n.z+r),this.camera.setTarget(n.x,n.y,n.z)}addMesh(e){if(!this.pipeline)return{ok:!0,value:void 0};let t=this.pipeline,n=!e.uniformBuffer&&!this.isDeviceLost()&&this.device.isInitialized()?Cp(()=>this.isDeviceLost(),()=>{let n=this.device.getDevice();e.uniformBuffer=n.createBuffer({size:t.getUniformBufferSize(),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),e.bindGroup=n.createBindGroup({layout:t.getBindGroupLayout(),entries:[{binding:0,resource:{buffer:e.uniformBuffer}}]})},e=>this.reportUploadLoss(e)):{ok:!0,value:void 0};return this.scene.addMesh(e),n}ensureMeshResources(){if(!this.pipeline||!this.device.isInitialized())return{ok:!0,value:void 0};let e=this.pipeline;return Cp(()=>this.isDeviceLost(),()=>{let t=this.device.getDevice();for(let n of this.scene.getMeshes())n.uniformBuffer||(n.uniformBuffer=t.createBuffer({size:e.getUniformBufferSize(),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),n.bindGroup=t.createBindGroup({layout:e.getBindGroupLayout(),entries:[{binding:0,resource:{buffer:n.uniformBuffer}}]}))},e=>this.reportUploadLoss(e))}getModelBounds(){return this.modelBounds}setModelBounds(e){this.modelBoundsTracker.set(e)}shadowOccluderBatches(e,t,n){return lf(this.scene,e,t,n,this.pipeline,this._partialBatchEpoch)}createMeshFromData(e){return Cp(()=>this.isDeviceLost(),()=>this.createMeshFromDataUnguarded(e),e=>this.reportUploadLoss(e))}individualMeshFrame(e){return this.scene.getIndividualMeshFrame(e)}createMeshFromDataUnguarded(e){if(!this.device.isInitialized())return;let{vertexBuffer:t,indexBuffer:n,indexCount:r,transform:i,rteOrigin:a}=Ad(this.device.getDevice(),e,this.individualMeshFrame(e));this.scene.addMesh({expressId:e.expressId,modelIndex:e.modelIndex,geometryItemId:mr(e,e.expressId),vertexBuffer:t,indexBuffer:n,indexCount:r,transform:i,rteOrigin:a,color:e.color,...e.material?{finish:e.material}:{},hydrated:!0})}syncHydratedSelectionMeshes(e,t,n,r){let i=this._prevHydratedSelection,a=e.size!==i.size||t!==this._prevHydratedSelectionModelIndex||n!==this._prevHydratedSelectionItemExpressId||r!==this._prevHydratedSelectionItemId;if(!a){for(let t of e)if(!i.has(t)){a=!0;break}}a&&(this._prevHydratedSelection=new Set(e),this._prevHydratedSelectionModelIndex=t,this._prevHydratedSelectionItemExpressId=n,this._prevHydratedSelectionItemId=r,this.scene.disposeHydratedMeshesExcept(e,t,n,r))}drainErrorScope(e){e.popErrorScope().then(e=>{if(e){let t=e.message||String(e);console.error(`[WebGPU] Validation error in render pass:`,t),this.device._lastUncapturedError=`VALIDATION: ${t}`,this.device._uncapturedErrorCount++}}).catch(e=>{this.device.invalidateContext();let t=performance.now();t-this.lastRenderErrorTime>this.RENDER_ERROR_THROTTLE_MS&&(this.lastRenderErrorTime=t,console.warn(`[WebGPU] popErrorScope rejected (device likely lost):`,e))})}getDiagnostics(){let e=this.camera.getPosition(),t=this.camera.getTarget(),n=this.modelBounds;return{calls:this._renderCallCount,skips:this._renderSkipCount,errors:this._renderErrorCount,lastError:this._lastRenderError,batches:this.scene.getBatchedMeshes().length,meshes:this.scene.getMeshes().length,contextOk:this.device.isInitialized(),gpuErrors:this.device._uncapturedErrorCount,lastGpuError:this.device._lastUncapturedError??``,camPos:`${e.x.toFixed(1)},${e.y.toFixed(1)},${e.z.toFixed(1)}`,camTgt:`${t.x.toFixed(1)},${t.y.toFixed(1)},${t.z.toFixed(1)}`,bounds:n?`${n.min.x.toFixed(0)}..${n.max.x.toFixed(0)} ${n.min.y.toFixed(0)}..${n.max.y.toFixed(0)} ${n.min.z.toFixed(0)}..${n.max.z.toFixed(0)}`:`none`}}setGpuFrameTiming(e){lc(this,e)}getGpuFrameTiming(){return dc(this)}getFrameStats(){return this._lastFrameStats}getAdapterInfo(){return this.device.getAdapterInfo()}async enableQuantizedBatches(){if(this.recovery.quantizedBatchesRequested=!0,!this.pipeline)return!1;let e=await this.pipeline.ensureQuantizedPipelines();return e&&this.scene.setQuantizedBatches(!0),e}render(e={}){this.renderWithResult(e)}renderWithResult(e={}){if(this._renderCallCount++,this.deviceLost)return this._renderSkipCount++,bf(this),!1;try{this.frameContainedThrow=!1;let t=this.renderFrame(e);return this.frameContainedThrow||(this.consecutiveDegradedFrames=0),xf(this,()=>this.requestRender()),t}catch(e){return this._renderSkipCount++,this.containFrameThrow(e,`frame`),bf(this),!1}}renderFrame(e){if(!this.device.isInitialized()||!this.pipeline)return this._renderSkipCount++,!1;let t=fr(this.canvas,this.device.getMaxTextureDimension(),this.maxPixelRatio,e.maxPixelRatio);if(!t||t.height<10)return this._renderSkipCount++,!1;let{width:n,height:r}=t;if(this.pixelRatio=t.pixelRatio,(this.canvas.width!==n||this.canvas.height!==r)&&(this.canvas.width=n,this.canvas.height=r,this.camera.setAspect(n/r),this.device.configureContext(),this.pipeline.resize(n,r)),this.canvas.width===0||this.canvas.height===0||!this.device.ensureContext())return this._renderSkipCount++,!1;let i=this.device.getDevice(),a=this.camera.getViewProjMatrix().m,o=this.camera.getRelativeToEyeFrame(),s=Gl(o),c=o.getCameraWorld(),l=ql(s,c),u=0,d=0,f=0,p=0,m=0,h=0,_=0,v=0,y=0;this.scene.beginResidencyFrame(),e.restoreEvictedForCapture&&this.pipeline&&this.scene.restoreAllEvicted(i,this.pipeline);let b=this.visualEnhancementResolver.resolve(e.visualEnhancement),x=e.isInteracting===!0,S=e.isStreaming===!0||this.scene.hasQueuedMeshes(),C=this.interactionEffects.frame(x,performance.now(),S,e.interactionFrameIntervalMs??0),w=du(b,C).edges,T=e.hiddenIds&&e.hiddenIds.size>0,E=e.isolatedIds!==null&&e.isolatedIds!==void 0,D=T||E,O=e.selectedId,k=e.selectedIds,A=e.selectedModelIndex,j=new Set;if(O!=null&&j.add(O),k)for(let e of k)j.add(e);let M=e.selectedItemId!==void 0&&O!=null?O:void 0,N=M===void 0?void 0:e.selectedItemId,P=this._visibilityEpochs.update(e.hiddenIds,e.isolatedIds),F=P!==this._visibilityVersion;this._visibilityVersion=P;let ee=this.scene.getColorOverrideGeneration(),I=this._xrayEpochs.update(e,j),te=F||ee!==this._lastColorOverrideGen||I!==this._xrayVersion;te&&(this._lastColorOverrideGen=ee,this._xrayVersion=I,this._partialBatchEpoch++);let L=(e.transparencyOverrides?.size??0)>0||e.ghostExceptIds!=null,R=D||L;this._lastHadPartialSources&&!R&&this.scene.dropAllPartialCaches(),this._lastHadPartialSources=R,this.syncHydratedSelectionMeshes(j,A,M,N);let z=this.scene.getMeshes();this.scene.setInstancedSelection(j,M,N),this.scene.setInstancedVisibility(e.hiddenIds,e.isolatedIds);let B=e.ghostAlpha??.12;this.scene.setInstancedGhosting(e.ghostExceptIds??null,j,B),(this._xrayAlpha===null||this._xrayAlphaEpoch!==this._partialBatchEpoch)&&(this._xrayAlpha=new pl(e,j),this._xrayAlphaEpoch=this._partialBatchEpoch);let ne=this._xrayAlpha,V=(e,t)=>ne.forEntity(e,t),re=(e,t)=>ne.forBatch(e,t),W=this.scene.getColorOverrides();if(this.ensureMeshResources(),e.enableFrustumCulling&&e.spatialIndex)try{let t=new Set(e.spatialIndex.queryFrustum(l));z=z.filter(e=>t.has(e.expressId))}catch(e){console.warn(`Frustum culling failed:`,e)}(e.hiddenIds&&e.hiddenIds.size>0||e.isolatedIds!=null)&&(z=z.filter(t=>Q(t.expressId,e.hiddenIds,e.isolatedIds))),this.pipeline.needsResize(this.canvas.width,this.canvas.height)&&this.pipeline.resize(this.canvas.width,this.canvas.height);let G=this._renderCallCount<=5,K=!1;G&&(i.pushErrorScope(`validation`),K=!0);let se=this.device.getCurrentTexture();if(!se)return K&&(K=!1,this.drainErrorScope(i)),!1;let q=null,ce=null;try{let t=e.clearColor?Array.isArray(e.clearColor)?{r:e.clearColor[0],g:e.clearColor[1],b:e.clearColor[2],a:e.clearColor[3]}:e.clearColor:{r:.1,g:.1,b:.1,a:1};q=Sf(this,se,this.canvas.width,this.canvas.height,this.device.getFormat());let n=se.createView(),r=this.pipeline.getObjectIdTextureView(),l=[],S=[];for(let e of z)ze(V(e.expressId,e.color[3]),e.material?.transparency??0,e.expressId,W)?S.push(e):l.push(e);S.length>0&&S.sort((e,t)=>t.expressId-e.expressId);let T=[...l,...S],P=Ou({options:e,batchedMeshes:this.scene.getBatchedMeshes(),meshes:z,pointCloudBounds:this.pointCloudRenderer?.getBounds()??null,logSectionBounds:!this._loggedSectionBounds,spendLogLatch:()=>{this._loggedSectionBounds=!0}}),F=P.sectionPlaneData,I=P.extraPlanes,{bounds:L}=P;if(this._sectionFrameInput=L&&{primary:e.sectionPlane??null,extras:e.extraSectionPlanes??[],bounds:L,buildingRotation:e.buildingRotation},P.bounds){let{min:e,max:t}=P.bounds;this.setModelBounds({min:e,max:t}),this.camera.setSceneBounds({min:e,max:t})}this._activePickSection=F?.enabled?{normal:[...F.normal],distance:F.distance,flipped:!!e.sectionPlane?.flipped}:null,this._activePickExtraPlanes=I.length>0?I.map(e=>({normal:[...e.normal],distance:e.distance,flipped:e.flipped})):null,this._activePickClipBox=e.clipBox?.enabled?{enabled:!0,min:[...e.clipBox.min],max:[...e.clipBox.max]}:null;let R=new Set,B=this.uniformScratch,G=this.uniformScratchU32;for(let t of T)if(t.uniformBuffer){B.set(a,0),o.packUniforms(B,H.rteViewProj),oe(o,B),B.set(t.transform.m,16);let n=t.expressId===O,r=A===void 0||t.modelIndex===A,s=O!=null&&n&&r||k!==void 0&&k.has(t.expressId);B[32]=t.color[0],B[33]=t.color[1],B[34]=t.color[2],B[35]=s?t.color[3]:V(t.expressId,t.color[3]),lt(B,t.color[3],t.finish??t.material),ie(F,B);let c=ct(e.clipBox,B,48);G[0]=+!!s,G[1]=+!!F?.enabled|(e.sectionPlane?.flipped?2:0)|c,G[2]=0,G[3]=0,ae(o,F,e.clipBox,B,I);let l=t.rteOrigin??[t.transform.m[12],t.transform.m[13],t.transform.m[14]];if(!o.tryPackDrawableOrigin(l,B,H.drawableDelta)){R.add(t);continue}G[0]|=U,i.queue.writeBuffer(t.uniformBuffer,0,B)}let le=i.createCommandEncoder();fc(this,i,le);let ue=e.sunShadows,de=!1;if(ue?.enabled){let t=this.getModelBounds();if(t){let n=Jd(ue.resolution,i.limits.maxTextureDimension2D);this.shadowPass?this.shadowPass.setResolution(n):this.shadowPass=new Qd(i,n);let r=o.getCameraWorld(),a=[t.min.x,t.min.y,t.min.z],s=[t.max.x,t.max.y,t.max.z],c=[t.min.x-r[0],t.min.y-r[1],t.min.z-r[2]],l=[t.max.x-r[0],t.max.y-r[1],t.max.z-r[2]],u;if(!x){let e=this.camera.getPosition(),t=g(e,this.camera.getTarget(),this.camera.getUp());u=sf({eye:e,forward:t.forward,right:t.right,up:t.up,fovY:this.camera.getFOV(),aspect:this.canvas.height>0?this.canvas.width/this.canvas.height:1,ortho:this.camera.getProjectionMode()===`orthographic`,orthoHalfHeight:this.camera.getOrthoSize(),boundsMin:a,boundsMax:s})?.map(e=>({x:e.x-r[0],y:e.y-r[1],z:e.z-r[2]}))}let d=_t(e.environment).sunDirection,f=of({sunDirection:d,boundsMin:c,boundsMax:l,focusCorners:u}),p=eo({batches:this.shadowOccluderBatches(e,i,D),instanced:this.scene.getInstancedTemplates(),textured:this.scene.getTexturedMeshes(),meshes:this.scene.getMeshes()},{hiddenIds:e.hiddenIds,isolatedIds:e.isolatedIds??void 0});this.shadowPass.render(le,f.lightViewProj,p,{section:F?.enabled?{normal:F.normal,distance:F.distance,flipped:e.sectionPlane?.flipped===!0}:null,box:e.clipBox?.enabled?{min:e.clipBox.min,max:e.clipBox.max}:null,extraPlanes:I},{cameraWorld:r});let m=2*f.orthoHalfWidth/n,h=ue.sunAngleDeg??.53,_=Math.min(Math.max(h*3,.75),8),v=tf(m,_),y=this.shadowScratch;y.set(f.lightViewProj.m,0),y[16]=1/n,y[17]=1,y[18]=v,y[19]=_,y[20]=6e-4,y[21]=0,y[22]=0,y[23]=0,this.pipeline.updateShadowUniform(y),this.pipeline.setShadowDepthView(this.shadowPass.getDepthTextureView()),this.shadowsWired=!0,de=!0}}!de&&(this.shadowsWired||this.shadowPass)&&(this.shadowScratch[17]=0,this.pipeline.updateShadowUniform(this.shadowScratch),this.pipeline.setShadowDepthView(null),this.shadowsWired=!1,this.shadowPass?.destroy(),this.shadowPass=null);let fe=this.pipeline.getMultisampleTextureView(),pe=fe!==null&&this.pipeline.getSampleCount()>1,me=[{view:pe?fe:n,resolveTarget:pe?n:void 0,loadOp:`clear`,clearValue:t,storeOp:pe?`discard`:`store`}];me.push({view:r,loadOp:`clear`,clearValue:{r:0,g:0,b:0,a:0},storeOp:w?`store`:`discard`});let J=le.beginRenderPass({timestampWrites:pc(le,`main`),colorAttachments:me,depthStencilAttachment:{view:this.pipeline.getDepthTextureView(),depthClearValue:0,depthLoadOp:`clear`,depthStoreOp:`store`,stencilClearValue:0,stencilLoadOp:`clear`,stencilStoreOp:`store`}}),he=_t(e.environment);if(this.pipeline.updateEnvironment(e.environment),he.skyEnabled){this.skyPass||=new Gd(i,{colorFormat:this.device.getFormat(),objectIdFormat:`rgba8unorm`,depthFormat:this.pipeline.getDepthFormat(),sampleCount:this.pipeline.getSampleCount()},Kd);let e=g(this.camera.getPosition(),this.camera.getTarget(),this.camera.getUp());this.skyPass.draw(J,{forward:[e.forward.x,e.forward.y,e.forward.z],right:[e.right.x,e.right.y,e.right.z],up:[e.up.x,e.up.y,e.up.z],fovY:this.camera.getFOV(),aspect:this.canvas.height>0?this.canvas.width/this.canvas.height:1},he)}J.setPipeline(this.pipeline.getPipeline()),this.pipeline.setEntityColorTableBuffer(this.scene.getEntityColorTable().getBuffer()),J.setBindGroup(1,this.pipeline.getEnvironmentBindGroup());let ge=[],_e=this.scene.getBatchedMeshes();if(_e.length>0||this.scene.getTexturedMeshes().length>0||this.scene.getInstancedTemplates().length>0){let t=s,n=Fa(e.contributionCull,x),r=e.lod&&e.lod.screenPx>0?e.lod.screenPx:0,l=new Set,g=null;if(n>0||r>0){let e=this.camera.getPosition(),t=this.camera.getTarget(),n=t.x-e.x,r=t.y-e.y,i=t.z-e.z,a=Math.sqrt(n*n+r*r+i*i);g={eye:e,viewDir:a>0?{x:n/a,y:r/a,z:i/a}:{x:0,y:0,z:0},mode:this.camera.getProjectionMode(),fovYRadians:this.camera.getFOV(),orthoHalfHeight:this.camera.getOrthoSize(),viewportHeightPx:this.canvas.height/this.pixelRatio}}this._batchVisibilityEpoch!==this._visibilityVersion&&(this._batchVisibilityCache=new WeakMap,this._batchVisibilityEpoch=this._visibilityVersion);let b=this._batchVisibilityCache,C=t=>{let n=b.get(t);if(n)return n;let r=t.expressIds.length,i=new Set;for(let n of t.expressIds){let t=e.hiddenIds?.has(n)??!1,r=!E||e.isolatedIds.has(n);!t&&r&&i.add(n)}let a=i.size===r;return n={visible:i.size>0,fullyVisible:a,visibleIds:a?void 0:i},b.set(t,n),n},w=[],T=[],O=new Ef(W,ne,e=>this.scene.canPartitionBatch(e)),k=O.items,P=O.pushVisible.bind(O),L=O.pushAlphaSplit.bind(O);for(let e of _e){if(e.bounds){if(!Kl(t,{min:e.bounds.min,max:e.bounds.max},c)){f++;continue}if(g){let t=La(e.bounds.min,e.bounds.max,g);if(n>0&&t<n){p++;continue}r>0&&t<r&&e.lod1IndexBuffer&&l.add(e.id)}}let i=re(e,e.color[3]),a=i<.99;if(D){let t=C(e);if(!t.visible)continue;if(!t.fullyVisible){let n=t.visibleIds;n&&n.size>0&&!L(e,n)&&P(e,n,a),e.gpuResident===!1&&this.scene.requestBatchResidency(e);continue}}if(e.gpuResident===!1)this.scene.requestBatchResidency(e),m++;else if(this.scene.recordBatchDrawn(e),!L(e,null)){if(a){let t=Ve(e.expressIds,W);if(t!=null&&t.remaining.size>0){P(e,new Set(e.expressIds),!0);continue}}Be(i,e.expressIds,W)?T.push(e):w.push(e)}}te&&this.scene.retireUnusedAlphaSlots(O.requestedKeys());let R=this.uniformScratch,z=this.uniformScratchU32;R.set(a,0),o.packUniforms(R,H.rteViewProj),oe(o,R),R[16]=1,R[17]=0,R[18]=0,R[19]=0,R[20]=0,R[21]=1,R[22]=0,R[23]=0,R[24]=0,R[25]=0,R[26]=1,R[27]=0,R[28]=0,R[29]=0,R[30]=0,R[31]=1,lt(R),ie(F,R);let B=ct(e.clipBox,R,48);z[0]=0,z[1]=+!!F?.enabled|(e.sectionPlane?.flipped?2:0)|B,z[2]=0,z[3]=0,ae(o,F,e.clipBox,R,I);let G=(t,n=!1)=>{if(!t.bindGroup||!t.uniformBuffer)return;R[32]=t.color[0],R[33]=t.color[1],R[34]=t.color[2],R[35]=re(t,t.color[3]),lt(R,t.color[3],t.finish);let r=t.origin;if(R[28]=r?r[0]:0,R[29]=r?r[1]:0,R[30]=r?r[2]:0,!o.tryPackDrawableOrigin(r??[0,0,0],R,H.drawableDelta))return;z[0]|=U;let a=t.quantized;R[56]=a?a.min[0]:0,R[57]=a?a.min[1]:0,R[58]=a?a.min[2]:0,R[59]=a?a.step:0;let s=n&&be(t,W,ee);xe(this.uniformOverrideU32,s?ve(t):null,s,e.emphasizeOverrides===!0),i.queue.writeBuffer(t.uniformBuffer,0,R),this.uniformOverrideU32.fill(0);let c=t.lod1IndexBuffer&&t.lod1IndexCount&&l.has(t.id);J.setBindGroup(0,t.bindGroup),J.setVertexBuffer(0,t.vertexBuffer),c?(J.setIndexBuffer(t.lod1IndexBuffer,`uint32`),J.drawIndexed(t.lod1IndexCount),h++):(J.setIndexBuffer(t.indexBuffer,`uint32`),J.drawIndexed(t.indexCount)),u++,d++},K=(e,t)=>{let n=t===`transparent`&&ne.isGhostBatch(e)?this.pipeline.getGhostPipeline(!!e.quantized,()=>this.requestRender()):null;if(n)return n;let r=t===`opaque`?this.pipeline.getPipeline():this.pipeline.getTransparentPipeline();return e.quantized?this.pipeline.getQuantizedPipelineVariant(t)??r:r};J.setPipeline(this.pipeline.getPipeline());for(let e of w)J.setPipeline(K(e,`opaque`)),G(e,!0);J.setPipeline(this.pipeline.getPipeline());let se=this.scene.getInstancedTemplates(),q=se;if(se.length>0){let e=[];for(let r of se){if(r.bounds){if(!Kl(t,r.bounds,c)){v++;continue}if(n>0&&g&&r.selectedCount===0&&Ia(r.bounds.min,r.bounds.max,r.maxOccRadius,g)<n){y++;continue}}e.push(r)}q=e}let ce=[];if(q.length>0){ce=tt(i,q,o.getCameraWorld()),this.pipeline.writeRawUniforms(R,U|4),J.setPipeline(this.pipeline.getInstancedPipeline()),J.setBindGroup(0,this.pipeline.getBindGroup()),J.setBindGroup(1,this.pipeline.getEnvironmentBindGroup());for(let[e,t]of q.entries()){J.setVertexBuffer(0,t.vertexBuffer),J.setVertexBuffer(1,t.instanceBuffer),J.setVertexBuffer(2,t.rteDeltas.buffer),J.setIndexBuffer(t.indexBuffer,`uint32`);let n=ce[e];u+=rt(J,t.indexCount,n),n.length>0&&_++}J.setPipeline(this.pipeline.getPipeline())}let le=this.scene.getTexturedMeshes();if(le.length>0){J.setPipeline(this.pipeline.getTexturedPipeline());for(let t of le){if(D&&(e.hiddenIds?.has(t.expressId)||E&&!e.isolatedIds.has(t.expressId)))continue;let n=re({expressIds:[t.expressId],color:t.color},t.color[3]);if(n<=.01)continue;let r=W?.get(t.expressId);R[28]=t.origin[0],R[29]=t.origin[1],R[30]=t.origin[2],o.tryPackDrawableOrigin(t.origin,R,H.drawableDelta)&&(z[0]|=U,R[32]=r?r[0]:t.color[0],R[33]=r?r[1]:t.color[1],R[34]=r?r[2]:t.color[2],R[35]=n,lt(R,t.color[3],t.finish??t.material),i.queue.writeBuffer(t.uniformBuffer,0,R),J.setBindGroup(0,t.bindGroup),J.setVertexBuffer(0,t.vertexBuffer),J.setIndexBuffer(t.indexBuffer,`uint32`),J.drawIndexed(t.indexCount),u++)}J.setPipeline(this.pipeline.getPipeline())}let ue=[];if(k.length>0){let e=[];for(let{sourceBatchKey:t,colorKey:n,visibleIds:r,color:a}of k){let o=this.scene.getOrCreatePartialBatch(t,n,r,i,this.pipeline,this._partialBatchEpoch);if(o){if(Be(re(o,a[3]),o.expressIds,W)){e.push(o);continue}J.setPipeline(K(o,`opaque`)),ue.push(o),G(o,!0)}}for(let t of e)J.setPipeline(K(t,`transparent`)),G(t);J.setPipeline(this.pipeline.getPipeline())}let de=new Set;for(let t of j)e.hiddenIds?.has(t)||(!E||e.isolatedIds.has(t))&&de.add(t);if(de.size>0){let e=this.scene.getMeshes(),t=new Map;for(let n of e){let e=`${n.expressId}:${n.modelIndex??`any`}`;t.set(e,(t.get(e)??0)+1)}for(let e of de){let n=e===M?N:void 0,r=this.scene.getMeshDataPieces(e,A,n);if(!r||r.length===0)continue;let i=new Map;for(let e of r){let n=`${e.expressId}:${e.modelIndex??`any`}`,r=i.get(n)??0;i.set(n,r+1),!(r<(t.get(n)??0))&&this.createMeshFromData(e)}}}let fe=de.size>0?this.scene.getMeshes().filter(e=>!(!de.has(e.expressId)||A!==void 0&&e.modelIndex!==A||e.expressId===M&&e.geometryItemId!==N)):[];ge=fe;let pe=this.pipeline.getInstancedTransparentPipeline();if(q.length>0&&this.scene.hasTransparentInstances()&&pe!==null){this.pipeline.writeRawUniforms(R,U|12),J.setPipeline(pe),J.setBindGroup(0,this.pipeline.getBindGroup()),J.setBindGroup(1,this.pipeline.getEnvironmentBindGroup());for(let[e,t]of q.entries())J.setVertexBuffer(0,t.vertexBuffer),J.setVertexBuffer(1,t.instanceBuffer),J.setVertexBuffer(2,t.rteDeltas.buffer),J.setIndexBuffer(t.indexBuffer,`uint32`),u+=rt(J,t.indexCount,ce[e]);J.setPipeline(this.pipeline.getPipeline())}if(T.length>0){J.setPipeline(this.pipeline.getTransparentPipeline());for(let e of T)J.setPipeline(K(e,`transparent`)),G(e)}if(S.length>0){J.setPipeline(this.pipeline.getTransparentPipeline());for(let t of S){if(!t.bindGroup||!t.uniformBuffer)continue;R.set(a,0),R.set(t.transform.m,16),R[32]=t.color[0],R[33]=t.color[1],R[34]=t.color[2],R[35]=V(t.expressId,t.color[3]),lt(R,t.color[3],t.finish??t.material),ie(F,R),z[0]=0,z[1]=+!!F?.enabled|(e.sectionPlane?.flipped?2:0)|B,z[2]=0,z[3]=0,ae(o,F,e.clipBox,R,I);let n=t.rteOrigin??[t.transform.m[12],t.transform.m[13],t.transform.m[14]];o.tryPackDrawableOrigin(n,R,H.drawableDelta)&&(z[0]|=U,i.queue.writeBuffer(t.uniformBuffer,0,R),J.setBindGroup(0,t.bindGroup),J.setVertexBuffer(0,t.vertexBuffer),J.setIndexBuffer(t.indexBuffer,`uint32`),J.drawIndexed(t.indexCount,1,0,0,0),u++)}}for(let e of fe)!e.uniformBuffer&&this.pipeline&&(e.uniformBuffer=i.createBuffer({size:this.pipeline.getUniformBufferSize(),usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),e.bindGroup=i.createBindGroup({layout:this.pipeline.getBindGroupLayout(),entries:[{binding:0,resource:{buffer:e.uniformBuffer}}]}));for(let t of fe){if(!t.bindGroup||!t.uniformBuffer)continue;R.set(a,0),R.set(t.transform.m,16),R[32]=t.color[0],R[33]=t.color[1],R[34]=t.color[2],R[35]=t.color[3],lt(R,t.color[3],t.finish??t.material),ie(F,R),z[0]=1,z[1]=+!!F?.enabled|(e.sectionPlane?.flipped?2:0)|B,z[2]=0,z[3]=0,ae(o,F,e.clipBox,R,I);let n=t.rteOrigin??[t.transform.m[12],t.transform.m[13],t.transform.m[14]];o.tryPackDrawableOrigin(n,R,H.drawableDelta)&&(z[0]|=U,i.queue.writeBuffer(t.uniformBuffer,0,R),J.setPipeline(this.pipeline.getSelectionPipeline()),J.setBindGroup(0,t.bindGroup),J.setVertexBuffer(0,t.vertexBuffer),J.setIndexBuffer(t.indexBuffer,`uint32`),J.drawIndexed(t.indexCount,1,0,0,0),u++)}}else{for(let e of l)R.has(e)||(e.bindGroup?J.setBindGroup(0,e.bindGroup):J.setBindGroup(0,this.pipeline.getBindGroup()),J.setVertexBuffer(0,e.vertexBuffer),J.setIndexBuffer(e.indexBuffer,`uint32`),J.drawIndexed(e.indexCount,1,0,0,0),u++);if(S.length>0){J.setPipeline(this.pipeline.getTransparentPipeline());for(let e of S)R.has(e)||(e.bindGroup?J.setBindGroup(0,e.bindGroup):J.setBindGroup(0,this.pipeline.getBindGroup()),J.setVertexBuffer(0,e.vertexBuffer),J.setIndexBuffer(e.indexBuffer,`uint32`),J.drawIndexed(e.indexCount,1,0,0,0),u++)}}this.pointCloudRenderer&&this.pointCloudRenderer.hasAssets()&&this.pointCloudRenderer.draw(J,{viewProj:o.getViewProjection().m,relativeToEyeFrame:o,sectionPlane:F?{...F,flipped:e.sectionPlane?.flipped===!0}:null,clipBox:e.clipBox,extraPlanes:I,viewport:{width:this.canvas.width/this.pixelRatio,height:this.canvas.height/this.pixelRatio}}),this.referenceImages.draw(J,a,o.getViewProjection().m,o.getCameraWorld()),this.overlays.draw(J,{options:e,viewProj:a,modelBounds:this.getModelBounds(),camera:this.camera,canvasWidth:this.canvas.width/this.pixelRatio,canvasHeight:this.canvas.height/this.pixelRatio,pixelRatio:this.pixelRatio,relativeToEyeFrame:o,rteViewProj:o.getViewProjection().m,rteCamera:o.getCameraWorld(),extraPlanes:I,primaryPlane:F&&e.sectionPlane?.enabled?{...F,flipped:e.sectionPlane.flipped===!0}:null}),J.end();let ye=e.hoverOutline,Se=ye&&!e.hiddenIds?.has(ye.id)&&(!E||e.isolatedIds.has(ye.id))?ye.id:null,Ce=ye?.modelIndex,we=Se!=null&&!ge.some(e=>xd(e,Se,Ce))?this.hoverMeshes.resolve(i,Se,Ce,()=>this.scene.getMeshDataPieces(Se,Ce),e=>this.individualMeshFrame(e)):(this.hoverMeshes.release(),[]),Te=Dd({uniformBufferSize:this.pipeline.getUniformBufferSize(),viewProj:a,relativeToEyeFrame:o,section:F,sectionFlipped:e.sectionPlane?.flipped,clipBox:e.clipBox,extraPlanes:I,selectedMeshes:ge,hoverPieces:we,hoveredId:Se,selectedModelIndex:Ce,instancedTemplates:this.scene.getInstancedTemplates(),instancedHovered:Se==null?[]:this.scene.getInstancedTemplatesOf(Se,Ce)});return this.postPasses??=new bd(this.device,this.pipeline.getSampleCount(),this.pipeline.getBindGroupLayout()),this.postPasses.encode({encoder:le,targetView:n,width:this.canvas.width,height:this.canvas.height,depthView:this.pipeline.getDepthOnlyTextureView(),maskDepthView:this.pipeline.getDepthTextureView(),objectIdView:r,projection:this.camera.getProjMatrix(),enhancement:b,effectsLive:C,pixelRatio:this.pixelRatio,edl:this.edlOptions.enabled&&this.pointCloudRenderer?.hasAssets()?this.edlOptions:null,selectionOutline:Te}),ce=q&&Cf(i,le,q),mc(this,i,le),ce&&q&&(wf(this,q,ce),q=null,ce=null),this._lastFrameStats={drawCalls:u,batchesDrawn:d,batchesFrustumCulled:f,batchesContributionCulled:p,batchesNotResident:m,batchesAtLod1:h,instancedDrawn:_,instancedFrustumCulled:v,instancedContributionCulled:y,timestamp:performance.now()},this.scene.enforceGpuBudget(),K&&(K=!1,this.drainErrorScope(i)),!0}catch(e){return uc(this),Tf(ce),K&&(K=!1,this.drainErrorScope(i)),this.containFrameThrow(e,`encode`),bf(this),!1}}async pick(e,t,n){return this.pickPathAlive()?this.pickingManager.pick(e,t,n,this.activePickClip()):null}pickPathAlive(){return!this.deviceLost&&this.device.isInitialized()}activePickClip(){return{sectionPlane:this._activePickSection,extraPlanes:this._activePickExtraPlanes,clipBox:this._activePickClipBox}}async pickRect(e,t,n,r,i){return this.pickPathAlive()?this.pickingManager.pickRect(e,t,n,r,i,this.activePickClip()):new Set}hasActiveClipping(){return this._activePickSection!==null||this._activePickExtraPlanes!==null||this._activePickClipBox!==null}raycastScene(e,t,n){return this.raycastEngine.raycastScene(e,t,n,this.activePickClip())}raycastSceneMagnetic(e,t,n,r){return this.raycastEngine.raycastSceneMagnetic(e,t,n,r,this.activePickClip())}setSourceSnapCurves(e){this.raycastEngine.setSourceSnapCurves(e)}invalidateBVHCache(){this.raycastEngine.invalidateBVHCache()}clearCaches(){this.raycastEngine.clearCaches()}requestRender(){this._renderRequested=!0}peekRenderRequest(){return this._renderRequested}consumeRenderRequest(){return this._renderRequested?(this._renderRequested=!1,!0):!1}resize(e,t){pr(this.canvas,this.camera,e,t)}setMaxPixelRatio(e){this.maxPixelRatio=e,this.requestRender()}prepareAuthoredOwner(e){if(this.deviceLost||!this.device.isInitialized()||!this.pipeline)throw this.deviceLost?Df():Error(`Renderer is not initialized.`);let t=this.scene.prepareAuthoredOwner(e,this.device.getDevice(),this.pipeline);return{commit:()=>{t.commit(),this.refreshPlacementBounds(),this.invalidateBVHCache(),this.requestRender()},dispose:t.dispose}}prepareTexturedOwner(e){if(!e.uvs||!(e.texture||e.textureRef&&e.textureBitmap))throw Error(`A new textured owner requires an image and UVs.`);return this.prepareAuthoredOwner([e])}getAppearancePreview(){if(!this.pipeline)throw Error(`Renderer must be initialized before previewing appearance`);return this.scene.appearancePreview(this.device.getDevice(),this.pipeline)}getCamera(){return this.camera}getScene(){return this.scene}uploadSection2DOverlay(e,t,n,r,i,a=!1,o,s){this.overlays.uploadSection2DOverlay(e,t,n,r,i,a,o,s)}clearSection2DOverlay(e){this.overlays.clearSection2DOverlay(e)}getSectionPlaneFrames(e){let t=this._sectionFrameInput;return t?gu(e?{...t,...e}:t):[]}clearSection2DExtraOverlays(e=[]){this.overlays.clearSection2DExtraOverlays(e)}setOverlayTheme(e){let t=this.overlayTheme;this.overlayTheme=e,this.pipeline?.selectionColorUniform.update(e.selection),this.overlays.setTheme(e);let n=this.scene.getColorOverrides(),r=n&&Zc(n,[[t.clashA,e.clashA],[t.clashB,e.clashB]]),i=this.getGPUDevice();r&&i&&this.pipeline&&(this.scene.setColorOverrides(r,i,this.pipeline),this.requestRender())}setLineOverlay(e,t){this.overlays.setLineOverlay(e,t)}setClashOverlapBox(e){this.overlays.setClashOverlapBox(e)}setClashContactLines(e){this.overlays.setClashContactLines(e)}setClashIntersectionSolid(e){this.overlays.setClashIntersectionSolid(e)}uploadAnnotationFills3D(e){this.overlays.uploadAnnotationFills3D(e)}uploadAnnotationTexts3D(e){this.overlays.uploadAnnotationTexts3D(e)}hasSection2DOverlay(){return this.overlays.hasSection2DOverlay()}getPipeline(){return this.pipeline}isReady(){return this.ready&&!this.deviceLost&&this.device.isInitialized()&&this.pipeline!==null}getGPUDevice(){return!this.device.isInitialized()||this.deviceLost?null:this.device.getDevice()}captureScreenshot(){return uf(this.device,this.canvas)}captureColorFrame(){return yf(this,!this.destroyed&&!this.deviceLost&&this.device.isInitialized(),()=>this.requestRender())}destroy(){this.initGeneration++,this.destroyed=!0,bf(this),this.teardown(),this.rejectReadyWaiters(wp())}teardown(e=!0){this.ready=!1,bf(this),e&&(this.scene.clear(),this._loggedSectionBounds=!1),uc(this),this.pipeline?.destroy(),this.pipeline=null,this.picker?.destroy(),this.picker=null,this.pickingManager.setPicker(null),this.postPasses?.destroy(),this.postPasses=null,this.hoverMeshes.release(),this.skyPass?.destroy(),this.skyPass=null,this.shadowPass?.destroy(),this.shadowPass=null,this.overlays.destroy(),this.referenceImages.destroy(),this.pointCloudNextHandleId=this.pointCloudRenderer?.handleIds?.current()??this.pointCloudNextHandleId,this.pointCloudStreamEpoch++,this.pointCloudStreamEpochs.clear(),this.pointCloudRenderer?.clear(),this.pointCloudRenderer=null,this.deviationComputer.destroy(),this.raycastEngine.clearCaches(),this.device.destroy()}getCanvas(){return this.canvas}}});export{yt as C,_ as D,Ie as E,g as O,Hn as S,Le as T,Yn as _,gp as a,Vn as b,Xa as c,Pa as d,ja as f,Wr as g,Gr as h,hp as i,Q as l,aa as m,pp as n,Ou as o,Da as p,mp as r,to as s,Tp as t,Z as u,er as v,_t as w,Un as x,Gn as y,__tla};