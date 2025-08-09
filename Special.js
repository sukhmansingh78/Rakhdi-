// script.js - page logic, confetti, audio, customize & download
(function(){
  // Pages
  const pages = Array.from(document.querySelectorAll('.page'));
  const dots  = Array.from(document.querySelectorAll('.dot'));
  const timings = [3500, 3200, 3200, 3800]; // ms per page
  let idx = 0;
  function show(i){
    pages.forEach((p,pi)=> p.classList.toggle('visible', pi===i));
    dots.forEach((d,di)=> d.classList.toggle('active', di===i));
  }
  // cycle pages
  function startCycle(){
    setTimeout(function cycle(){
      idx = (idx+1) % pages.length;
      show(idx);
      setTimeout(cycle, timings[idx]);
    }, timings[0]);
  }
  // small startup delay for header animations
  setTimeout(startCycle, 900);

  // confetti pieces
  const colors = ['#ff5e5e','#ffd166','#06d6a0','#4d96ff','#b388ff'];
  for (let i=0;i<28;i++){
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = (Math.random()*100) + 'vw';
    el.style.width = (Math.random()*10 + 8) + 'px';
    el.style.height = (Math.random()*18 + 10) + 'px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.opacity = (Math.random()*0.6 + 0.5).toFixed(2);
    el.style.top = (-Math.random()*20 - 5) + 'vh';
    el.style.animationDuration = (Math.random()*2 + 3.5).toFixed(2) + 's';
    el.style.animationDelay = (Math.random()*1.8).toFixed(2) + 's';
    document.querySelector('.card').appendChild(el);
  }

  // Audio & Mute button
  const song = document.getElementById('bgSong');
  const muteBtn = document.getElementById('muteBtn');
  // Start muted so autoplay works in browsers; user can unmute
  song.muted = true;
  let muted = true;
  function updateBtn(){
    muteBtn.textContent = muted ? '🔇' : '🔊';
    muteBtn.classList.toggle('muted', muted);
    muteBtn.setAttribute('aria-pressed', String(!muted));
  }
  updateBtn();

  muteBtn.addEventListener('click', ()=>{
    muted = !muted;
    song.muted = muted;
    if(!muted){
      // try to play if browser paused it
      song.play().catch(()=>{});
    }
    updateBtn();
  });

  // Keyboard accessibility: press "M" to toggle
  document.addEventListener('keydown', (e)=>{
    if(e.key && e.key.toLowerCase()==='m') muteBtn.click();
  });

  // Customize modal: simple in-page prompt to change messages
  const customBtn = document.getElementById('customBtn');
  customBtn.addEventListener('click', ()=>{
    const pageTexts = pages.map(p => {
      const title = p.querySelector('.title').innerText;
      const body  = p.querySelector('.body').innerText;
      return {title, body};
    });

    // allow user to change the first page body quickly (can be extended)
    const newFirstBody = prompt('Edit first message body:', pageTexts[0].body);
    if(newFirstBody !== null){
      pages[0].querySelector('.body').innerText = newFirstBody;
    }
    // update names in last page
    const bro = prompt('Brother name (will replace on last page):', 'Sukhman Singh');
    const sis = prompt('Sister name (will replace header):', 'Samreet Didi');
    if(bro !== null){
      pages[pages.length-1].querySelector('.body').innerText = bro + ' ❤️';
    }
    if(sis !== null){
      document.querySelector('.header-text h1').innerText = 'For ' + sis;
    }
    alert('Customization saved in this session. Use Download to save the HTML.');
  });

  // Download: create single-file HTML (inlined CSS + JS) to download locally
  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.addEventListener('click', async ()=>{
    // Build a self-contained HTML for download (but audio won't be embedded here)
    // We'll create an HTML with relative audio reference to veera_best_part.mp3
    const docTitle = document.title || 'rakhi';
    // gather current HTML of messages
    const currentHTML = document.querySelector('.card').outerHTML;
    // read CSS and JS by fetching the current linked files (they exist locally in this package)
    const cssResponse = await fetch('style.css').then(r=>r.text());
    const jsResponse  = await fetch('script.js').then(r=>r.text());
    const single = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${docTitle}</title>
<style>${cssResponse}</style>
</head>
<body>
${currentHTML}
<audio id="bgSong" loop playsinline>
  <source src="veera_best_part.mp3" type="audio/mpeg">
</audio>
<script>${jsResponse}</script>
</body>
</html>`;
    // create blob and download
    const blob = new Blob([single], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rakhi_page.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // Try to play audio (may be blocked until user interacts)
  window.addEventListener('load', ()=>{
    song.play().catch(()=>{});
  });

})();
