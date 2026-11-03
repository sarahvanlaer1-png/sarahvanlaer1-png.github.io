import{r as G,R as St}from"./index-2-cAkVtQ.js";import{R as Tt,T as Ft,a as bt,b as se,M as ce,P as ve}from"./Triangle-BAC_Ahr_.js";const _e={swell:{scale:1.5,speed:.6,direction:250,chop:.55,stretch:0,glint:.7,contrast:1.25,perspective:.55,fog:.55},tide:{scale:1.3,speed:.5,direction:262,chop:.2,stretch:.12,glint:.45,contrast:1.1,perspective:.5,fog:.4},storm:{scale:.55,speed:1.6,direction:236,chop:1,stretch:.3,glint:1.3,contrast:1.8,perspective:.8,fog:.35},signal:{scale:.85,speed:1.2,direction:180,chop:.6,stretch:.85,glint:.25,contrast:1.2,perspective:0,fog:0}},X=96,Ct=16,fe=6900,Ae=3,Et=15e5,c=(I,T,y)=>Math.min(Math.max(I,T),y),de=(I,T)=>{try{const y=document.createElement("canvas").getContext("2d");if(!y)return T;y.fillStyle="#000000",y.fillStyle=I;const R=y.fillStyle;if(R.startsWith("#")){const U=parseInt(R.slice(1),16);return[(U>>16&255)/255,(U>>8&255)/255,(U&255)/255,1]}const w=R.match(/[\d.]+/g);return!w||w.length<3?T:[Number(w[0])/255,Number(w[1])/255,Number(w[2])/255,w[3]?Number(w[3]):1]}catch{return T}},Be=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Pt=`#version 300 es
in vec2 position;
uniform vec2 uTexel;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = position * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(position, 0.0, 1.0);
}
`,E=`#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`,Rt=`${E}
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec2 uPoint;
uniform vec3 uValue;
uniform float uRadius;
void main() {
  vec2 offset = vUv - uPoint;
  offset.x *= uAspect;
  float falloff = exp(-dot(offset, offset) / uRadius);
  fragColor = vec4(texture(uTarget, vUv).xyz + uValue * falloff, 1.0);
}
`,Mt=`${E}
uniform sampler2D uVelocity;
void main() {
  float left = texture(uVelocity, vL).y;
  float right = texture(uVelocity, vR).y;
  float top = texture(uVelocity, vT).x;
  float bottom = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
}
`,Vt=`${E}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uSwirl;
uniform float uDt;
void main() {
  float left = texture(uCurl, vL).x;
  float right = texture(uCurl, vR).x;
  float top = texture(uCurl, vT).x;
  float bottom = texture(uCurl, vB).x;
  float middle = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(top) - abs(bottom), abs(right) - abs(left));
  force = force / (length(force) + 0.0001) * uSwirl * middle;
  force.y = -force.y;
  vec2 velocity = texture(uVelocity, vUv).xy + force * uDt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}
`,Dt=`${E}
uniform sampler2D uVelocity;
void main() {
  vec2 middle = texture(uVelocity, vUv).xy;
  float left = vL.x < 0.0 ? -middle.x : texture(uVelocity, vL).x;
  float right = vR.x > 1.0 ? -middle.x : texture(uVelocity, vR).x;
  float top = vT.y > 1.0 ? -middle.y : texture(uVelocity, vT).y;
  float bottom = vB.y < 0.0 ? -middle.y : texture(uVelocity, vB).y;
  fragColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}
`,kt=`${E}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((left + right + top + bottom - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`,Lt=`${E}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(right - left, top - bottom);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`,zt=`${E}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uFade;
void main() {
  vec2 from = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  fragColor = texture(uSource, from) / (1.0 + uFade * uDt);
}
`,Gt=`${E}
uniform sampler2D uSource;
uniform float uValue;
void main() {
  fragColor = texture(uSource, vUv) * uValue;
}
`,It=`#version 300 es
precision highp float;
uniform vec2 uSize;
uniform vec4 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSlat;
uniform float uTime;
uniform float uScale;
uniform float uDirection;
uniform float uChop;
uniform float uStretch;
uniform float uGlint;
uniform float uContrast;
uniform float uPerspective;
uniform float uFog;
uniform float uIntro;
uniform sampler2D tVelocity;
uniform sampler2D tInk;
uniform vec2 uFluidTexel;
uniform float uFluid;
uniform float uInk;
uniform float uLean;
out vec4 fragColor;

const float TURN[4] = float[4](0.0, -0.95, 0.78, 1.62);
const float LENGTH[4] = float[4](2.6, 1.7, 1.12, 0.76);
const float HEIGHT[4] = float[4](1.0, 0.75, 0.5, 0.3);
const float SHIFT[4] = float[4](0.0, 2.3, 4.1, 1.1);

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float row = uGrid.y - 1.0 - cell.y;
  vec2 center = uOrigin + vec2(cell.x, row) * uGrid.zw + uSlat * 0.5;
  float v = clamp(center.y / uSize.y, 0.0, 1.0);

  vec2 flow = vec2(0.0);
  float ink = 0.0;
  if (uFluid > 0.5) {
    vec2 fluidUv = clamp(vec2(center.x / uSize.x, 1.0 - center.y / uSize.y), 0.0, 1.0);
    flow = texture(tVelocity, fluidUv).xy * uFluidTexel * uSize;
    ink = texture(tInk, fluidUv).x;
  }

  float horizon = mix(8.0, 0.5, uPerspective);
  float depth = (1.0 + horizon) / (v + horizon);
  vec2 world = vec2((center.x - uSize.x * 0.5) / uSize.y * depth, (depth - 1.0) * horizon * 2.2);
  world -= flow * 0.00018 * depth;
  world /= max(uScale, 0.05);

  float meander = 0.55 * sin(dot(world, vec2(0.23, 0.41)) * 0.9 + uTime * 0.13)
    + 0.3 * sin(dot(world, vec2(-0.37, 0.19)) * 1.4 - uTime * 0.09);

  float steep = uChop * 0.45;
  float height = 0.0;
  float total = 0.0;
  for (int i = 0; i < 4; i++) {
    float angle = uDirection + TURN[i];
    vec2 heading = vec2(cos(angle), sin(angle));
    float k = 6.2831853 / LENGTH[i];
    float omega = sqrt(9.81 * k) * 0.35;
    float theta = k * dot(world, heading) - omega * uTime + SHIFT[i] + meander * (0.6 + 0.3 * float(i));
    height += HEIGHT[i] * (cos(theta) + steep * cos(2.0 * theta));
    total += HEIGHT[i] * (1.0 + steep);
  }
  float level = clamp(0.5 + 0.5 * height / (total * 0.85), 0.0, 1.0);
  float crest = smoothstep(0.6, 1.0, level);
  float glint = crest * crest * uGlint;

  float haze = mix(1.0, 1.0 - uFog, pow(1.0 - v, 1.4));
  float light = (pow(level, uContrast) + glint * 0.8) * haze;
  float glow = 1.0 - exp(-max(ink, 0.0) * uInk * 1.6);
  light = 1.0 - (1.0 - clamp(light, 0.0, 1.0)) * (1.0 - glow);

  float front = uIntro * 1.35;
  float reveal = 1.0 - smoothstep(front - 0.35, front, v);
  float sweep = exp(-pow((v - front + 0.22) / 0.07, 2.0)) * (1.0 - uIntro);
  light = (light + sweep * 0.8) * reveal;
  light = max(light, 0.045 * reveal);
  float span = mix(1.0 - uStretch, 1.0, level) + glow * 0.3;
  span = clamp(span, 0.08, 1.0) * mix(0.1, 1.0, reveal);
  float tint = clamp(max(glint * 1.4, glow * 0.9) + sweep, 0.0, 1.0);
  float lean = clamp(flow.x / 1400.0, -1.0, 1.0) * uLean * reveal;

  fragColor = vec4(clamp(light, 0.0, 1.0), span, tint, 0.5 + 0.5 * lean);
}
`,Ut=`#version 300 es
precision highp float;
uniform sampler2D tField;
uniform vec2 uSize;
uniform float uDpr;
uniform vec4 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSlat;
uniform float uRound;
uniform float uTilt;
uniform vec3 uColor;
uniform vec3 uGlintColor;
uniform vec4 uBackground;
out vec4 fragColor;

float pill(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 local = p - uOrigin;
  vec2 cell = floor(local / uGrid.zw);
  vec4 background = vec4(uBackground.rgb * uBackground.a, uBackground.a);
  vec4 slat = vec4(0.0);
  int reach = uTilt > 0.0 ? 1 : 0;
  for (int dx = -1; dx <= 1; dx++) {
    if (abs(dx) > reach) continue;
    vec2 neighbour = cell + vec2(float(dx), 0.0);
    if (neighbour.x < 0.0 || neighbour.y < 0.0 || neighbour.x >= uGrid.x || neighbour.y >= uGrid.y) continue;
    vec4 field = texelFetch(tField, ivec2(int(neighbour.x), int(uGrid.y - 1.0 - neighbour.y)), 0);
    vec2 offset = local - neighbour * uGrid.zw - uSlat * 0.5;
    float angle = (field.a - 0.5) * 2.0 * uTilt;
    float c = cos(angle);
    float s = sin(angle);
    vec2 turned = vec2(c * offset.x + s * offset.y, c * offset.y - s * offset.x);
    vec2 halfSize = vec2(uSlat.x * 0.5, uSlat.y * 0.5 * field.g);
    float radius = uRound * min(halfSize.x, halfSize.y);
    float alpha = clamp(0.5 - pill(turned, halfSize, radius) * uDpr, 0.0, 1.0) * field.r;
    if (alpha > slat.a) slat = vec4(mix(uColor, uGlintColor, field.b) * alpha, alpha);
  }
  fragColor = slat + background * (1.0 - slat.a);
}
`,Bt=({preset:I="swell",color:T="#A855F7",glintColor:y="#ffffff",backgroundColor:R="#000000",slatWidth:w=10,slatHeight:U=25,gap:He=3,roundness:Ne=.75,scale:Oe,speed:We,direction:qe,chop:$e,stretch:Xe,glint:je,contrast:Ye,perspective:Qe,fog:Je,interactive:Ze=!0,cursorStrength:Ke=1,cursorSize:et=40,swirl:tt=0,trail:ot=1.4,lean:rt=0,intro:it=!0,introDuration:ut=1.5,paused:lt=!1,className:at="",style:nt})=>{const me=G.useRef(null),_=G.useRef(null),j=G.useRef(null),st=_e[I]||_e.swell,S=(d,p)=>d??st[p],ct=G.useMemo(()=>({color:de(T,[.66,.33,.97,1]),glintColor:de(y,[1,1,1,1]),backgroundColor:de(R,[0,0,0,1])}),[T,y,R]);return G.useEffect(()=>{_.current={...ct,slatWidth:w,slatHeight:U,gap:He,roundness:Ne,scale:S(Oe,"scale"),speed:S(We,"speed"),direction:S(qe,"direction"),chop:S($e,"chop"),stretch:S(Xe,"stretch"),glint:S(je,"glint"),contrast:S(Ye,"contrast"),perspective:S(Qe,"perspective"),fog:S(Je,"fog"),interactive:Ze,cursorStrength:Ke,cursorSize:et,swirl:tt,trail:ot,lean:rt,intro:it,introDuration:ut,paused:lt},j.current?.()}),G.useEffect(()=>{const d=me.current;if(!d)return;const p=new Tt({alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),r=p.gl;if(!p.isWebgl2){r.getExtension("WEBGL_lose_context")?.loseContext();return}r.clearColor(0,0,0,0);const F=r.canvas;F.style.display="block",F.style.width="100%",F.style.height="100%",F.setAttribute("aria-hidden","true"),d.appendChild(F);const Y=new Ft(r),s=new bt(r),vt=!!(r.getExtension("EXT_color_buffer_float")||r.getExtension("EXT_color_buffer_half_float")),M=e=>{r.deleteFramebuffer(e.buffer),r.deleteTexture(e.texture.texture)};let b=new se(r,{width:1,height:1,depth:!1,minFilter:r.NEAREST,magFilter:r.NEAREST});const n={uSize:{value:[1,1]},uGrid:{value:[1,1,1,1]},uOrigin:{value:[0,0]},uSlat:{value:[1,1]},uTime:{value:0},uScale:{value:1},uDirection:{value:0},uChop:{value:.5},uStretch:{value:.3},uGlint:{value:1},uContrast:{value:1},uPerspective:{value:.7},uFog:{value:.5},uIntro:{value:0},tVelocity:{value:s},tInk:{value:s},uFluidTexel:{value:[1,1]},uFluid:{value:0},uInk:{value:1},uLean:{value:.5}},ft=new ce(r,{geometry:Y,program:new ve(r,{vertex:Be,fragment:It,uniforms:n,depthTest:!1,depthWrite:!1})}),f={tField:{value:b.texture},uSize:{value:[1,1]},uDpr:{value:1},uGrid:{value:[1,1,1,1]},uOrigin:{value:[0,0]},uSlat:{value:[1,1]},uRound:{value:1},uTilt:{value:0},uColor:{value:[1,1,1]},uGlintColor:{value:[1,1,1]},uBackground:{value:[0,0,0,1]}},dt=new ce(r,{geometry:Y,program:new ve(r,{vertex:Be,fragment:Ut,uniforms:f,depthTest:!1,depthWrite:!1})}),Q={value:[1,1]},C=(e,t)=>new ce(r,{geometry:Y,program:new ve(r,{vertex:Pt,fragment:e,uniforms:{uTexel:Q,...t},depthTest:!1,depthWrite:!1})}),pe=C(Rt,{uTarget:{value:s},uAspect:{value:1},uPoint:{value:[0,0]},uValue:{value:[0,0,0]},uRadius:{value:.01}}),ge=C(Mt,{uVelocity:{value:s}}),he=C(Vt,{uVelocity:{value:s},uCurl:{value:s},uSwirl:{value:20},uDt:{value:.016}}),xe=C(Dt,{uVelocity:{value:s}}),J=C(kt,{uPressure:{value:s},uDivergence:{value:s}}),Z=C(Lt,{uPressure:{value:s},uVelocity:{value:s}}),K=C(zt,{uVelocity:{value:s},uSource:{value:s},uDt:{value:.016},uFade:{value:1}}),V=C(Gt,{uSource:{value:s},uValue:{value:0}}),A=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1;let g=1,m=1,B=0,ee=performance.now(),ye=0,O=0,P=!0,te=!0,i=null,we=0,W=!1,Se=0;const D=[],h={x:0,y:0,tracked:!1},x=(e,t)=>p.render({scene:e,target:t,clear:!1}),q=(e,t)=>new se(r,{width:e,height:t,depth:!1,type:r.HALF_FLOAT,format:r.RGBA,internalFormat:r.RGBA16F,minFilter:r.LINEAR,magFilter:r.LINEAR}),oe=(e,t)=>({read:q(e,t),write:q(e,t),swap(){const o=this.read;this.read=this.write,this.write=o}}),Te=()=>{i&&([i.velocity,i.ink,i.pressure].forEach(e=>{M(e.read),M(e.write)}),M(i.divergence),M(i.curl),i=null)},mt=()=>{if(!vt)return;const e=g/m,t=Math.max(8,Math.round(e>=1?X*e:X)),o=Math.max(8,Math.round(e>=1?X:X/e));i&&i.width===t&&i.height===o||(Te(),i={width:t,height:o,velocity:oe(t,o),ink:oe(t,o),pressure:oe(t,o),divergence:q(t,o),curl:q(t,o)},Q.value=[1/t,1/o])},Fe=()=>{g=Math.max(1,d.clientWidth),m=Math.max(1,d.clientHeight),p.dpr=Math.min(window.devicePixelRatio||1,1.5,Math.sqrt(Et/(g*m))),p.setSize(g,m),mt(),N()},pt=e=>{const t=c(e.slatWidth,1,64),o=c(e.slatHeight,2,240),l=c(e.gap,0,64),u=t+l,a=o+l,v=Math.min(2048,Math.ceil((g+l)/u)+1),k=Math.min(2048,Math.ceil((m+l)/a)+1),L=(g-(v*u-l))/2,ie=(m-(k*a-l))/2;(b.width!==v||b.height!==k)&&(M(b),b=new se(r,{width:v,height:k,depth:!1,minFilter:r.NEAREST,magFilter:r.NEAREST}),f.tField.value=b.texture);const z=Math.min(.42,Math.asin(c((u*1.5-t*.5)/(o*.5),0,1)));return{slatW:t,slatH:o,tilt:z,grid:[v,k,u,a],origin:[L,ie]}},H=(e,t,o,l)=>{const u=pe.program.uniforms;u.uTarget.value=e.read.texture,u.uAspect.value=g/m,u.uPoint.value=t,u.uValue.value=o,u.uRadius.value=l,x(pe,e.write),e.swap()},gt=(e,t,o)=>{if(o.swirl>0){ge.program.uniforms.uVelocity.value=e.velocity.read.texture,x(ge,e.curl);const a=he.program.uniforms;a.uVelocity.value=e.velocity.read.texture,a.uCurl.value=e.curl.texture,a.uSwirl.value=c(o.swirl,0,2)*40,a.uDt.value=t,x(he,e.velocity.write),e.velocity.swap()}xe.program.uniforms.uVelocity.value=e.velocity.read.texture,x(xe,e.divergence),V.program.uniforms.uSource.value=e.pressure.read.texture,V.program.uniforms.uValue.value=.8,x(V,e.pressure.write),e.pressure.swap(),J.program.uniforms.uDivergence.value=e.divergence.texture;for(let a=0;a<Ct;a++)J.program.uniforms.uPressure.value=e.pressure.read.texture,x(J,e.pressure.write),e.pressure.swap();Z.program.uniforms.uPressure.value=e.pressure.read.texture,Z.program.uniforms.uVelocity.value=e.velocity.read.texture,x(Z,e.velocity.write),e.velocity.swap();const l=1/c(o.trail,.1,10),u=K.program.uniforms;u.uDt.value=t,u.uVelocity.value=e.velocity.read.texture,u.uSource.value=e.velocity.read.texture,u.uFade.value=l*1.4,x(K,e.velocity.write),e.velocity.swap(),u.uVelocity.value=e.velocity.read.texture,u.uSource.value=e.ink.read.texture,u.uFade.value=l,x(K,e.ink.write),e.ink.swap()},ht=e=>{V.program.uniforms.uValue.value=0,[e.velocity,e.ink,e.pressure].forEach(t=>{V.program.uniforms.uSource.value=t.read.texture,x(V,t.write),t.swap()})},be=e=>{if(B=0,!te||!P||document.hidden)return;const t=_.current,o=Math.min(.05,Math.max(0,(e-ee)/1e3));if(ee=e,!t)return;!t.paused&&!A&&(ye+=o*t.speed),O=t.intro&&!A?O+o/Math.max(.2,t.introDuration):1;const l=Math.min(O,1),u=l<.5?4*l*l*l:1-Math.pow(-2*l+2,3)/2;if(i&&D.length){const L=Math.pow(c(t.cursorSize,4,600)/m,2)*.35,ie=g/m;for(const[z,$,xt,yt,Le]of D){if(Le===null){H(i.velocity,[z,$],[xt*fe,yt*fe,0],L),H(i.ink,[z,$],[.13,0,0],L);continue}const ue=L*.55,ze=Math.sqrt(ue*.5)*1.9,Ge=fe*.08;for(let le=0;le<Ae;le++){const Ie=Le+le/Ae*Math.PI*2,ae=Math.cos(Ie),ne=Math.sin(Ie),Ue=[z+ae*ze/ie,$+ne*ze],wt=[(ae-ne)*Math.SQRT1_2*Ge,(ne+ae)*Math.SQRT1_2*Ge,0];H(i.velocity,Ue,wt,ue),H(i.ink,Ue,[.75,0,0],ue)}H(i.ink,[z,$],[.45,0,0],L)}D.length=0,W=!0}const a=i!==null&&e<we;i&&(a?gt(i,Math.min(Math.max(o,1/240),1/30),t):W&&(ht(i),W=!1));const v=pt(t);n.uSize.value=[g,m],n.uGrid.value=v.grid,n.uOrigin.value=v.origin,n.uSlat.value=[v.slatW,v.slatH],n.uTime.value=ye,n.uScale.value=t.scale,n.uDirection.value=t.direction*Math.PI/180,n.uChop.value=c(t.chop,0,1.5),n.uStretch.value=c(t.stretch,0,.95),n.uGlint.value=Math.max(0,t.glint),n.uContrast.value=c(t.contrast,.2,4),n.uPerspective.value=c(t.perspective,0,1),n.uFog.value=c(t.fog,0,1),n.uIntro.value=u,n.uFluid.value=a?1:0,n.tVelocity.value=i?i.velocity.read.texture:s,n.tInk.value=i?i.ink.read.texture:s,n.uFluidTexel.value=Q.value,n.uInk.value=c(t.cursorStrength,0,3),n.uLean.value=c(t.lean,0,1),p.render({scene:ft,target:b}),f.uSize.value=[g,m],f.uDpr.value=p.dpr,f.uGrid.value=v.grid,f.uOrigin.value=v.origin,f.uSlat.value=[v.slatW,v.slatH],f.uRound.value=c(t.roundness,0,1),f.uTilt.value=a&&t.lean>0?v.tilt:0,f.uColor.value=t.color.slice(0,3),f.uGlintColor.value=t.glintColor.slice(0,3),f.uBackground.value=t.backgroundColor,p.render({scene:dt});const k=!t.paused&&!A&&t.speed!==0||O<1;P&&(k||a||W)&&(B=requestAnimationFrame(be))},N=()=>{B||!P||!te||document.hidden||(ee=performance.now(),B=requestAnimationFrame(be))},Ce=e=>{const t=d.getBoundingClientRect(),o=e.clientX-t.left,l=e.clientY-t.top,u=Math.max(1,t.width),a=Math.max(1,t.height);return{x:o,y:l,u:o/u,v:1-l/a,h:a,inside:o>=0&&l>=0&&o<=u&&l<=a}},Ee=(e,t,o,l,u)=>{D.length>32&&D.shift(),D.push([e,t,o,l,u]);const a=_.current;we=performance.now()+Math.max(1.5,(a?a.trail:1.4)*5)*1e3,N()},Pe=e=>{if(!P||document.hidden)return;const t=_.current,o=Ce(e);if(!i||!t||!t.interactive||A||!o.inside){h.tracked=!1;return}h.tracked&&(o.x!==h.x||o.y!==h.y)&&Ee(o.u,o.v,(o.x-h.x)/o.h,(h.y-o.y)/o.h,null),h.x=o.x,h.y=o.y,h.tracked=!0},Re=e=>{if(!P||document.hidden)return;const t=_.current,o=Ce(e);!i||!t||!t.interactive||A||!o.inside||(Se+=2.39996,Ee(o.u,o.v,0,0,Se))},re=()=>{h.tracked=!1},Me=e=>{e.relatedTarget||re()},Ve=()=>{document.hidden||N()};window.addEventListener("pointermove",Pe,{passive:!0}),window.addEventListener("pointerdown",Re,{passive:!0}),window.addEventListener("pointerout",Me,{passive:!0}),window.addEventListener("blur",re),document.addEventListener("visibilitychange",Ve);const De=new ResizeObserver(Fe);De.observe(d);const ke=new IntersectionObserver(([e])=>{P=e.isIntersecting,N()});return ke.observe(d),j.current=N,Fe(),()=>{te=!1,P=!1,cancelAnimationFrame(B),De.disconnect(),ke.disconnect(),window.removeEventListener("pointermove",Pe),window.removeEventListener("pointerdown",Re),window.removeEventListener("pointerout",Me),window.removeEventListener("blur",re),document.removeEventListener("visibilitychange",Ve),j.current=null,Te(),M(b),r.getExtension("WEBGL_lose_context")?.loseContext(),F.parentNode&&F.parentNode.removeChild(F)}},[]),St.createElement("div",{ref:me,className:`micro-slats ${at}`.trim(),style:nt})};export{Bt as default};
