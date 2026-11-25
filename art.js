(() => {
  const tau = Math.PI * 2;
  function ribbon(ctx, w, h) {
    ctx.fillStyle = '#2347d3'; ctx.fillRect(0, 0, w, h);
    const scale = Math.min(w * .207, h * .276);
    const point = (t, strand) => {
      const r = 1.29 + .55 * Math.cos(3 * t);
      const x = r * Math.cos(2*t), y = r * Math.sin(2*t), z = .75 * Math.sin(3*t);
      const a = strand * .29, b = strand * .28 * Math.sin(3*t + .4);
      const xx = x + a*Math.cos(2*t), yy = y + a*Math.sin(2*t), zz = z + b;
      return [w*.51 + (xx*.96 - yy*.25)*scale, h*.50 + (xx*.14 + yy*.54 - zz*.85)*scale, yy*.83 + zz*.56];
    };
    const strips = [];
    for(let i=0;i<360;i++) {
      const t=i*tau/360, n=(i+1)*tau/360;
      strips.push({t,n,depth:point(t,0)[2]});
    }
    strips.sort((a,b)=>a.depth-b.depth);
    for(const {t,n,depth} of strips){
      const pts=[point(t,-1),point(n,-1),point(n,1),point(t,1)];
      ctx.beginPath(); pts.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();
      ctx.fillStyle='#2347d3';ctx.strokeStyle='#2347d3';ctx.lineWidth=.9;ctx.fill();ctx.stroke();
      ctx.beginPath();
      for(let j=0;j<=28;j++) {
        const a=point(t,j/14-1),b=point(n+.001,j/14-1);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);
      }
      ctx.strokeStyle=depth>0?'#eafaff':'#aabdf6';ctx.lineWidth=Math.max(.48,scale*.005);ctx.stroke();
    }
  }
  function road(ctx,w,h) {
    ctx.fillStyle='#203a31';ctx.fillRect(0,0,w,h);ctx.save();
    ctx.translate(w*.83,h*.49);ctx.rotate(-.39);
    const unit=Math.max(12,w*.035);
    for(let col=-12;col<15;col++) for(let row=-17;row<18;row++){
      const n=Math.sin(col*37.13+row*43.77);
      ctx.fillStyle=n>.2?'#2a4739':'#304d3e';
      ctx.fillRect(col*unit,row*unit,unit*(n>.4?.77:.89),unit*.86);
    }
    ctx.restore();
    const route=()=>{ctx.beginPath();ctx.moveTo(w*.49,h*1.2);ctx.bezierCurveTo(w*.45,h*.68,w*.85,h*.66,w*.72,h*.32);ctx.bezierCurveTo(w*.67,h*.12,w*.88,h*.13,w*.95,-h*.1);};
    route();ctx.lineWidth=Math.max(7,w*.019);ctx.strokeStyle='#132e25';ctx.stroke();
    route();ctx.lineWidth=Math.max(2,w*.006);ctx.strokeStyle='#f4ac70';ctx.stroke();
    ctx.fillStyle='#ffb67f';ctx.beginPath();ctx.arc(w*.72,h*.32,w*.013,0,tau);ctx.fill();
    ctx.strokeStyle='#ffb67f';ctx.lineWidth=1;ctx.beginPath();ctx.arc(w*.72,h*.32,w*.028,0,tau);ctx.stroke();
    const fade=ctx.createLinearGradient(w*.07,0,w*.6,0);fade.addColorStop(0,'#203a31');fade.addColorStop(1,'rgba(32,58,49,0)');ctx.fillStyle=fade;ctx.fillRect(0,0,w,h);
  }
  function rings(ctx,w,h) {
    ctx.fillStyle='#efe6d5';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(w*.98,h*.6);ctx.rotate(-.38);
    for(let i=1;i<75;i++) {
      const r=i*w*.009;ctx.beginPath();
      for(let j=0;j<=220;j++){const a=j/220*tau,irregular=1+.060*Math.sin(3*a+.5)+.038*Math.sin(8*a+i*.026)+.022*Math.sin(13*a+.8);
        const x=r*irregular*Math.cos(a),y=r*1.62*irregular*Math.sin(a);
        if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      ctx.strokeStyle=i%6===0?'#8b7861':'#b3a18a';ctx.lineWidth=i%6===0?1.4:.8;ctx.stroke();
    }ctx.restore();
  }
  const renderers={ribbon,map:road,rings};
  function paint(canvas){
    const {width:w,height:h}=canvas.getBoundingClientRect(); if(!w||!h)return;
    const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*ratio);canvas.height=Math.round(h*ratio);
    const ctx=canvas.getContext('2d');if(!ctx)return;ctx.scale(ratio,ratio);renderers[canvas.dataset.art](ctx,w,h);
  }
  document.querySelectorAll('canvas[data-art]').forEach(canvas=>{paint(canvas);if(window.ResizeObserver)new ResizeObserver(()=>paint(canvas)).observe(canvas);});
})();
