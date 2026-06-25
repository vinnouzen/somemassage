/* ============================================================
   CONFESSION OF LOVE — script.js
   Pure Vanilla JavaScript (no frameworks)
   ============================================================ */

'use strict';

/* ============================================================
   SCENE MANAGER
   ============================================================ */
const scenes = {
  loading  : document.getElementById('loading-screen'),
  opening  : document.getElementById('opening-screen'),
  journey  : document.getElementById('journey-screen'),
  letter   : document.getElementById('letter-screen'),
  question : document.getElementById('question-screen'),
  closing  : document.getElementById('closing-screen'),
};

/** Switch active scene with a smooth crossfade */
function goToScene(name) {
  Object.values(scenes).forEach(el => el.classList.remove('active'));
  scenes[name].classList.add('active');
}

/* ============================================================
   SCENE 1 — LOADING SCREEN
   ============================================================ */
(function initLoading() {
  const bar  = document.getElementById('progress-bar');
  let progress = 0;
  const total  = 2800;   // ms total loading duration
  const step   = 30;     // update every 30 ms
  const inc    = (step / total) * 100;

  const timer = setInterval(() => {
    progress = Math.min(progress + inc + Math.random() * 0.4, 100);
    bar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(timer);
      // Brief pause then transition
      setTimeout(() => {
        goToScene('opening');
        initOpening();
      }, 400);
    }
  }, step);
})();

/* ============================================================
   SCENE 2 — OPENING (typing animation)
   ============================================================ */

/** Spawn CSS particles (small translucent circles) */
function spawnParticles() {
  const container = document.getElementById('particles-container');
  const colors = ['#F8C8DC', '#DCC6E0', '#E8B4B8', '#ffffff', '#f0c0d8'];
  const count  = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size    = 4 + Math.random() * 10;
    const left    = Math.random() * 100;
    const delay   = Math.random() * 8;
    const duration = 6 + Math.random() * 10;
    const color   = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      filter: blur(${Math.random() < 0.3 ? 1 : 0}px);
    `;
    container.appendChild(p);
  }
}

/** Type a string into an element character by character */
function typeText(element, text, speed = 55) {
  return new Promise(resolve => {
    let i = 0;
    element.textContent = '';
    const interval = setInterval(() => {
      element.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

/** Erase current text character by character */
function eraseText(element, speed = 30) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const t = element.textContent;
      if (t.length === 0) { clearInterval(interval); resolve(); return; }
      element.textContent = t.slice(0, -1);
    }, speed);
  });
}

const openingLines = [
  'Hi...',
  'Ada sesuatu yang sudah lama ingin kusampaikan.',
  'Semoga kamu bersedia membaca sampai selesai.',
];

async function initOpening() {
  spawnParticles();

  const el      = document.getElementById('typing-line');
  const btnMulai = document.getElementById('btn-mulai');

  for (let i = 0; i < openingLines.length; i++) {
    await typeText(el, openingLines[i], 60);
    await pause(1400);
    // Don't erase the last line
    if (i < openingLines.length - 1) {
      await eraseText(el, 28);
      await pause(300);
    }
  }

  // Show start button
  btnMulai.classList.remove('hidden');
  btnMulai.classList.add('fade-in');
  addRipple(btnMulai);

  btnMulai.addEventListener('click', () => {
    goToScene('journey');
    initJourney();
  }, { once: true });
}

/* ============================================================
   SCENE 3 — PERJALANAN PERASAAN
   ============================================================ */
const journeyLines = [
  'Aku tidak tahu sejak kapan semuanya dimulai.',
 "Awalnya kupikir ini cuma rasa kagum, but I was wrong... ternyata aku benar-benar jatuh hati.",
  "Sayangnya, aku juga orang yang pernah menyakitimu dan membuatmu menunggu terlalu lama. I'm really sorry.",
  "Semakin waktu berlalu, semakin aku sadar kalau perasaanku ke kamu nggak pernah benar-benar hilang.",
  "So... kalau masih ada sedikit kesempatan, izinkan aku memperbaiki semuanya dan mencintaimu dengan cara yang lebih baik."
];

let journeyIndex = 0;

function initJourney() {
  journeyIndex = 0;
  showJourneySentence();

  const btn = document.getElementById('btn-lanjut');
  addRipple(btn);
  btn.addEventListener('click', onJourneyNext);
}

function showJourneySentence() {
  const el  = document.getElementById('journey-sentence');
  const btn = document.getElementById('btn-lanjut');

  el.classList.remove('visible');

  setTimeout(() => {
    el.textContent = journeyLines[journeyIndex];
    el.classList.add('visible');
  }, 180);

  // Change button text on last slide
  if (journeyIndex >= journeyLines.length - 1) {
    btn.querySelector('.btn-text').textContent = 'Buka Surat 💌';
  } else {
    btn.querySelector('.btn-text').textContent = 'Lanjut →';
  }
}

function onJourneyNext() {
  journeyIndex++;
  if (journeyIndex < journeyLines.length) {
    showJourneySentence();
  } else {
    document.getElementById('btn-lanjut').removeEventListener('click', onJourneyNext);
    goToScene('letter');
    initLetter();
  }
}

/* ============================================================
   SCENE 4 — SURAT
   ============================================================ */

/** Letter paragraphs */
const letterParagraphs = [
  "Untukmu, seseorang yang pernah menjadi bagian terindah dalam hidupku. Terima kasih karena masih bersedia meluangkan waktu untuk membaca semua ini.",
  "Aku tahu mungkin semua ini datang terlambat. Bahkan mungkin setelah semua yang pernah terjadi, aku tidak lagi memiliki hak untuk meminta apa pun darimu. Namun ada satu hal yang selama ini terus memenuhi pikiranku, yaitu sebuah permintaan maaf yang belum pernah benar-benar kusampaikan.",
  "Maaf... atas semua luka yang pernah kuberikan. Maaf atas sikapku yang pernah membuatmu kecewa. Maaf karena pernah membuatmu menangis, merasa tidak dihargai, dan mempertanyakan arti kehadiranmu di hidupku. Aku sadar, semua itu adalah kesalahanku.",
 "Aku juga ingin meminta maaf karena telah membuatmu menunggu begitu lama. Menunggu penjelasan yang tidak pernah datang. Menunggu seseorang yang seharusnya lebih berani mengakui kesalahannya. Menunggu perubahan yang mungkin sudah terlalu lama kamu harapkan dariku.",
  "Selama ini aku memilih diam. Bukan karena aku sudah tidak peduli, tetapi karena aku terlalu takut menghadapi kenyataan bahwa akulah penyebab semua rasa sakit yang pernah kamu rasakan. Semakin lama aku diam, semakin besar rasa bersalah yang terus menghantuiku.",
  "Hari ini aku tidak datang untuk mencari pembenaran. Aku tidak ingin menghapus semua kesalahan hanya dengan kata 'maaf', karena aku tahu luka tidak akan hilang begitu saja. Aku hanya ingin bertanggung jawab atas semua yang pernah kulakukan.",
  "Ada satu hal yang selama ini juga kusadari. Di balik semua penyesalan itu, ternyata ada perasaan yang tidak pernah benar-benar pergi. Selama ini aku mencoba meyakinkan diriku bahwa semuanya sudah selesai. Namun semakin waktu berjalan, semakin aku sadar bahwa aku masih menyimpan rasa yang sama.",
"Aku masih mencintaimu. Bukan karena aku merasa kesepian, bukan juga karena aku takut kehilangan seseorang. Aku mencintaimu karena setelah semua waktu yang berlalu, namamulah yang masih selalu hadir di setiap doa dan harapanku.",
];

function initLetter() {
  const btnBuka = document.getElementById('btn-buka-surat');
  addRipple(btnBuka);

  btnBuka.addEventListener('click', async () => {
    btnBuka.classList.add('hidden');

    const card = document.getElementById('letter-card');
    card.classList.remove('hidden');
    setTimeout(() => card.classList.add('visible'), 30);

    // Type paragraphs one by one
    const body = document.getElementById('letter-body');
    body.innerHTML = '';

    for (const para of letterParagraphs) {
      const p = document.createElement('p');
      body.appendChild(p);
      await typeText(p, para, 20);
      await pause(200);
    }

    // Reveal "next" button
    const btnAfter = document.getElementById('btn-after-letter');
    btnAfter.classList.remove('hidden');
    addRipple(btnAfter);

    btnAfter.addEventListener('click', () => {
      goToScene('question');
      initQuestion();
    }, { once: true });

  }, { once: true });
}

/* ============================================================
   SCENE 5 — PERTANYAAN TERAKHIR
   ============================================================ */
function initQuestion() {
  addRipple(document.getElementById('btn-ya'));
  addRipple(document.getElementById('btn-jalani'));
  addRipple(document.getElementById('btn-teman'));

  document.getElementById('btn-ya').addEventListener('click', () => onAnswer('ya'),      { once: true });
  document.getElementById('btn-jalani').addEventListener('click', () => onAnswer('jalani'), { once: true });
  document.getElementById('btn-teman').addEventListener('click', () => onAnswer('teman'),  { once: true });
}

function onAnswer(choice) {
  // Disable all answer buttons
  ['btn-ya', 'btn-jalani', 'btn-teman'].forEach(id => {
    const btn = document.getElementById(id);
    btn.disabled = true;
    btn.style.opacity = '0.45';
    btn.style.pointerEvents = 'none';
  });

  const msgEl = document.getElementById('response-message');
  const btnClosing = document.getElementById('btn-to-closing');

  if (choice === 'ya') {
    msgEl.innerHTML = ' UDAH KETEBAK SI AWKOKAOWKAOW ❤️';
    launchFloatingHearts();
  } else if (choice === 'jalani') {
    msgEl.innerHTML = 'EMOH. 🌸';
  } else {
    msgEl.innerHTML = 'SEKAREPMU. 🤍';
  }

  msgEl.classList.remove('hidden');
  setTimeout(() => msgEl.classList.add('visible'), 20);

  btnClosing.classList.remove('hidden');
  addRipple(btnClosing);
  btnClosing.addEventListener('click', () => {
    goToScene('closing');
    initClosing();
  }, { once: true });
}

/* --- Floating hearts (CSS-only shapes spawned by JS) --- */
function launchFloatingHearts() {
  const container = document.getElementById('hearts-container');
  const count     = 22;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const wrap = document.createElement('div');
      wrap.className = 'float-heart';

      const size = 14 + Math.random() * 22;
      const left = 5 + Math.random() * 90;
      const duration = 2.5 + Math.random() * 3;
      const rot  = -20 + Math.random() * 40;
      const sc   = 0.6 + Math.random() * 0.8;

      // Build CSS heart via pseudo-elements through an inner element
      const heart = document.createElement('div');
      heart.style.cssText = `
        position: relative;
        width: ${size}px;
        height: ${size}px;
      `;

      // We'll fake a heart with a Unicode character — CSS shapes work too
      heart.innerHTML = `<span style="
        font-size: ${size * 1.3}px;
        line-height: 1;
        color: hsl(${340 + Math.random() * 20}deg, 80%, 65%);
        display: block;
        filter: drop-shadow(0 0 6px rgba(220,90,130,0.5));
      ">❤</span>`;

      wrap.appendChild(heart);

      wrap.style.cssText = `
        position: absolute;
        left: ${left}%;
        bottom: -60px;
        --rot: ${rot}deg;
        --sc: ${sc};
        animation: floatUp ${duration}s linear forwards;
      `;

      container.appendChild(wrap);
      setTimeout(() => wrap.remove(), duration * 1000 + 200);
    }, i * 120);
  }
}

/* ============================================================
   SCENE 6 — PENUTUP
   ============================================================ */
const closingTexts = [
  'Perasaan ini akhirnya berhasil kusampaikan.',
  'Terima kasih sudah meluangkan waktumu.',
  'hope your day is a beautiful as your smile.',
];

function initClosing() {
  const container = document.getElementById('closing-lines');
  container.innerHTML = '';

  closingTexts.forEach((text, i) => {
    const p = document.createElement('p');
    p.textContent = text;
    container.appendChild(p);

    setTimeout(() => p.classList.add('visible'), 300 + i * 600);
  });

  // Reveal "Made with ❤️" after all lines
  const madeWith = document.querySelector('.made-with');
  setTimeout(() => {
    madeWith.classList.add('visible');
  }, 300 + closingTexts.length * 600 + 400);
}

/* ============================================================
   UTILITIES
   ============================================================ */

/** Promise-based pause */
function pause(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Attach ripple effect to a button */
function addRipple(btn) {
  btn.addEventListener('click', function(e) {
    const ripple = this.querySelector('.btn-ripple');
    if (!ripple) return;

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x    = e.clientX - rect.left - size / 2;
    const y    = e.clientY - rect.top  - size / 2;

    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      animation: rippleEffect 0.6s ease-out forwards;
    `;

    // Reset to allow re-triggering
    ripple.addEventListener('animationend', () => {
      ripple.style.animation = 'none';
    }, { once: true });
  });
}

/* ============================================================
   MUSIC — All Too Well (Taylor Swift)
   Menggunakan HTML5 <audio> + SoundCloud stream embed
   ============================================================ */
(function initMusic() {
  const btn = document.getElementById('music-toggle');
  let isPlaying = false;

  // Buat elemen audio HTML5 — SoundCloud widget via iframe tersembunyi
  // Fallback: embed iframe SoundCloud yang bisa di-control via postMessage
  const iframe = document.createElement('iframe');
  iframe.id = 'sc-player';
  iframe.allow = 'autoplay';
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;border:none;';
  // All Too Well (Taylor's Version) di SoundCloud
  iframe.src = 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/taylor-swift-official/all-too-well-taylors-version&color=%23C9788A&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false';
  document.body.appendChild(iframe);

  // SoundCloud Widget API via postMessage
  function scMsg(method, value) {
    const msg = JSON.stringify({ method: method, value: value });
    iframe.contentWindow.postMessage(msg, 'https://w.soundcloud.com');
  }

  // Tunggu iframe siap lalu set volume
  iframe.addEventListener('load', () => {
    setTimeout(() => scMsg('setVolume', 70), 500);
  });

  function play() {
    scMsg('play');
    isPlaying = true;
    btn.classList.add('playing');
  }

  function pause() {
    scMsg('pause');
    isPlaying = false;
    btn.classList.remove('playing');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    isPlaying ? pause() : play();
  });

  // Auto-play saat pertama kali user klik di mana saja
  let autoStarted = false;
  document.addEventListener('click', function autoPlay(e) {
    if (autoStarted || e.target === btn) return;
    autoStarted = true;
    play();
  }, { capture: true });
})();

/* ============================================================
   GLOBAL AMBIENT HEART PARTICLES
   ============================================================ */
(function initAmbientHearts() {
  const container = document.getElementById('global-hearts');
  const emojis = ['❤️', '🩷', '💕', '💗', '💖', '💓', '🫀'];

  function spawnHeart() {
    const el = document.createElement('div');
    el.className = 'ambient-heart';

    const size   = 10 + Math.random() * 14;
    const left   = 2 + Math.random() * 96;
    const dur    = 7 + Math.random() * 8;
    const delay  = Math.random() * 3;
    const drift  = (-40 + Math.random() * 80) + 'px';
    const emoji  = emojis[Math.floor(Math.random() * emojis.length)];

    el.textContent = emoji;
    el.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      --drift: ${drift};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay) * 1000 + 300);
  }

  // Spawn one heart every ~1.5s
  setInterval(spawnHeart, 1500);
  // Seed a few immediately (staggered)
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnHeart, i * 400);
  }
})();

/* ============================================================
   FIREWORK BURST — fires on scene transitions
   ============================================================ */
function launchFirework(x, y) {
  const colors = ['#F8C8DC', '#DCC6E0', '#E8B4B8', '#C9788A', '#ffffff', '#f0c0d8'];
  const count  = 18;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'firework-particle';

    const angle = (360 / count) * i * (Math.PI / 180);
    const dist  = 60 + Math.random() * 80;
    const fx    = Math.cos(angle) * dist + 'px';
    const fy    = Math.sin(angle) * dist + 'px';
    const size  = 4 + Math.random() * 6;
    const dur   = 0.55 + Math.random() * 0.35;
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      --fx: ${fx};
      --fy: ${fy};
      animation-duration: ${dur}s;
    `;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}

// Patch goToScene to also fire a small firework burst at center
const _origGoToScene = goToScene;  // eslint-disable-line no-undef
// Override after original is defined — wait a tick
setTimeout(() => {
  const origFn = window.goToScene || goToScene;
  window.goToSceneWithFx = function(name) {
    origFn(name);
    launchFirework(window.innerWidth / 2, window.innerHeight / 2);
  };
}, 0);