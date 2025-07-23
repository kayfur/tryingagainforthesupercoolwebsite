// Animate all .orb elements with custom parameters from data attributes
(function wobbleAllOrbs() {
  const els = document.querySelectorAll('.orb');
  if (!els.length) return;
  let start = Date.now();
  function animate() {
    const t = (Date.now() - start) / 1000;
    els.forEach(el => {
      const baseX = parseFloat(el.dataset.baseX) || 50;
      const baseY = parseFloat(el.dataset.baseY) || 50;
      const r = parseFloat(el.dataset.radius) || 6;
      const speedX = parseFloat(el.dataset.speedX) || 1.2;
      const speedY = parseFloat(el.dataset.speedY) || 0.7;
      const tilt = parseFloat(el.dataset.tilt) || 2;
      const x = baseX + (r * Math.sin(t * speedX)) / window.innerWidth * 100;
      const y = baseY + (r * Math.cos(t * speedY)) / window.innerHeight * 100;
      const rotate = tilt * Math.sin(t * 1.5);
      el.style.top = `${y}%`;
      el.style.left = `${x}%`;
      el.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// Boot sequence typing effect
function typeBootSequence(lines, onDone) {
  const overlay = document.querySelector('.boot-overlay');
  if (!overlay) return;
  // Remove button if present
  const btn = overlay.querySelector('.boot-button');
  if (btn) btn.remove();
  // Create terminal text container
  let term = overlay.querySelector('.boot-terminal');
  if (!term) {
    term = document.createElement('pre');
    term.className = 'boot-terminal';
    overlay.appendChild(term);
  }
  let lineIdx = 0, charIdx = 0, text = '';
  function typeChar() {
    if (lineIdx >= lines.length) {
      if (onDone) { onDone(); }
      return;
    }
    const line = lines[lineIdx];
    if (charIdx <= line.length) {
      text = lines.slice(0, lineIdx).join('\n') + (lineIdx > 0 ? '\n' : '') + line.slice(0, charIdx) + '_';
      term.textContent = text;
      charIdx++;
      setTimeout(typeChar, 18 + Math.random() * 40);
    } else {
      charIdx = 0;
      lineIdx++;
      setTimeout(typeChar, 200);
    }
  }
  typeChar();
}

document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.querySelector('.boot-overlay');
  const btn = document.querySelector('.boot-button');
  const screen = document.getElementById('screen');
  const audio = document.getElementById('boot-sound'); // hard disk sound
  const bureauAudio = document.getElementById('the-bureau'); // The Bureau music
  const skipBtn = document.querySelector('.skip');

  let bootInProgress = false;
  let bootFinished = false;

  function finishBoot() {
    if (bootFinished) return;
    bootFinished = true;
    // Play The Bureau audio
    if (bureauAudio) {
      bureauAudio.currentTime = 0;
      bureauAudio.play();
    }
    overlay.classList.add('fade');
    screen.style.opacity = 1;
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 1200);
    window.removeEventListener('keydown', escListener);
    overlay.removeEventListener('click', finishBoot);
    if (skipBtn) skipBtn.removeEventListener('click', finishBoot);
  }

  function escListener(e) {
    if (e.key === 'Escape') finishBoot();
  }

  function startBootSequence() {
    if (bootInProgress) return;
    bootInProgress = true;
    // Boot sequence lines
    const bootLines = [
      '',
      'Kadyn BIOS v1.0',
      'Copyright 1985-2005 Kadyn Technologies Ltd.',
      'All Rights Reserved',
      '',
      'Detecting IDE drives ...',
      'Drive 1: OK',
      'Drive 2: OK',
      '',
      'Booting from disk ...',
      '',
      'Starting OS ...',
      '',
      'Welcome to INDEX OS',
      '',
      'Press any key to continue ...'
    ];
    typeBootSequence(bootLines, function() {
      // Enable skip button after typing
      if (skipBtn) {
        skipBtn.disabled = false;
        skipBtn.classList.add('active');
        skipBtn.style.display = 'block';
        skipBtn.addEventListener('click', finishBoot);
      }
      // Wait for any key or click or skip to trigger finishBoot
      window.addEventListener('keydown', finishBoot);
      overlay.addEventListener('click', finishBoot);
    });
    // Allow ESC to skip at any time
    window.addEventListener('keydown', escListener);
  }

  // Make orb images clickable and open links
  function addOrbImageLinks() {
    document.querySelectorAll('.orb img').forEach(img => {
      let url = null;
      if (img.getAttribute('href')) {
        url = img.getAttribute('href');
      } else if (img.dataset.href) {
        url = img.dataset.href;
      }
      if (url) {
        img.addEventListener('click', e => {
          window.open(url, '_blank');
          e.stopPropagation();
        });
        img.style.cursor = 'pointer';
      }
    });
  }

  if (btn && overlay && screen) {
    btn.addEventListener('click', function() {
      btn.classList.add('hidden');
      if (audio) {
        audio.currentTime = 0;
        audio.play();
      }
      startBootSequence();
      if (skipBtn) skipBtn.style.display = 'block';
    });
  }
  // Make skip button active after 1.5s (for initial state)
  if (skipBtn) {
    setTimeout(() => {
      skipBtn.classList.add('active');
    }, 1500);
  }
  addOrbImageLinks();
});
window.onload = function() {
  
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");
  
  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  };
};
