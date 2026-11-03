import React, {useCallback, useEffect, useRef, useState} from 'react';

// Independent CSS carousel inspired by the supplied reference image.
export default function VideoReel({items}) {
  const [step,setStep]=useState(0);
  const [dragX,setDragX]=useState(0);
  const [dragging,setDragging]=useState(false);
  const [visible,setVisible]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const root=useRef(null),stage=useRef(null),drag=useRef(null),ignoreClick=useRef(false),wheelLock=useRef(0),resetClick=useRef(null);
  const count=items.length, active=((step%count)+count)%count;
  const move=useCallback(n=>setStep(i=>i+n),[]);
  useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(m.matches);m.addEventListener('change',update);return()=>m.removeEventListener('change',update);},[]);
  useEffect(()=>{if(!('IntersectionObserver' in window)){setVisible(true);return;}const o=new IntersectionObserver(e=>setVisible(e[0].isIntersecting),{threshold:.1});if(root.current)o.observe(root.current);return()=>o.disconnect();},[]);
  useEffect(()=>{if(reduced||hovered||focused||!visible)return;const id=setInterval(()=>{if(!document.hidden)move(1);},4500);return()=>clearInterval(id);},[reduced,hovered,focused,visible,move]);
  useEffect(()=>{const element=stage.current;if(!element)return;const onWheel=e=>{const delta=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(!delta)return;e.preventDefault();const now=performance.now();if(now-wheelLock.current<580)return;wheelLock.current=now;move(delta>0?1:-1);};element.addEventListener('wheel',onWheel,{passive:false});return()=>element.removeEventListener('wheel',onWheel);},[move]);
  useEffect(()=>()=>clearTimeout(resetClick.current),[]);
  const pointerDown=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;drag.current={x:e.clientX,id:e.pointerId,captured:false};};
  const pointerMove=e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x;if(Math.abs(dx)>8&&!d.captured){d.captured=true;setDragging(true);e.currentTarget.setPointerCapture(e.pointerId);}if(d.captured)setDragX(Math.max(-180,Math.min(180,dx)));};
  const pointerUp=e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x;drag.current=null;setDragging(false);setDragX(0);if(d.captured){ignoreClick.current=true;if(Math.abs(dx)>35)move(dx<0?1:-1);clearTimeout(resetClick.current);resetClick.current=setTimeout(()=>{ignoreClick.current=false;},300);}};
  const slots=Array.from({length:count*3},(_,i)=>{const n=count*3;let offset=((i-step+Math.floor(n/2))%n+n)%n-Math.floor(n/2);return {key:i,item:items[i%count],offset};});
  return <div className="video-reel" ref={root} aria-label="视频作品画廊" onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false);}}>
    <div ref={stage} role="region" aria-label="视频作品画廊，使用左右方向键切换" tabIndex={0} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}}} className={'video-reel-stage '+(dragging?'is-dragging':'')} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={e=>{drag.current=null;setDragging(false);setDragX(0);}} onPointerEnter={e=>{if(e.pointerType==='mouse')setHovered(true);}} onPointerLeave={()=>setHovered(false)}>
      {slots.map(({key,item,offset})=>{const hidden=Math.abs(offset)>2;return <button key={key} type="button" className={'reel-card '+(offset===0?'is-front':'')+(hidden?' is-hidden':'')} style={{'--reel-x':(offset*110)+'%','--reel-z':(Math.abs(offset)*70)+'px','--reel-rotate':(offset*-18)+'deg','--reel-scale':1+Math.abs(offset)*0.08,'--drag-x':dragX+'px'}} aria-label={offset===0?'观看 '+item.title:'切换到 '+item.title} aria-hidden={hidden?'true':undefined} tabIndex={offset===0?0:-1} onClick={()=>{if(ignoreClick.current){ignoreClick.current=false;return;}if(offset!==0)move(offset);else window.open('https://www.youtube.com/watch?v='+item.id,'_blank','noopener,noreferrer');}}>
        <img src={'https://i.ytimg.com/vi/'+item.id+'/hqdefault.jpg'} alt="" loading="lazy" decoding="async" draggable="false" onError={e=>{e.currentTarget.style.opacity=0;}}/><span className="reel-card-overlay"/><span className="reel-card-indicator" aria-hidden="true">▶</span>
      </button>;})}
    </div>
    <div className="reel-navigation"><div className="reel-metrics"><strong>{items[active].title}</strong><p><span>{items[active].views} 次观看</span></p><small>YouTube 观看量含广告投流 · 数据截至 2026.11.02</small></div></div>
  </div>;
}
