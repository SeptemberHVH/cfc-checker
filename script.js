/* ============================================================
   CFC PRO MAX CHECKER 2026 — Script principal v3
   Matrix rain + Web Audio drums + holographic card + glitch
   ============================================================ */

// ─── Boot BIOS screen ────────────────────────────────────────

function runBiosBoot() {
  const screen  = document.getElementById('bios-screen');
  const content = document.getElementById('bios-content');
  if (!screen || !content || screen.dataset.booted) return;
  screen.dataset.booted = '1';

  const lines = [
    { text: '' },
    { text: '>>> EN TRAIN DE BYPASS LE FIREWALL PRO MAX <<<', cls: 'bios-wait' },
    { text: '' },
    { text: 'CFC BIOS v2.0 — HUN EDITION', cls: 'bios-head' },
    { text: '' },
    { text: '> Checking brainrot...  ', end: { text: 'OK',      cls: 'bios-ok'   } },
    { text: '> HUN.................  ', end: { text: 'OK',      cls: 'bios-ok'   } },
    { text: '> TUNG................  ', end: { text: 'OK',      cls: 'bios-ok'   } },
    { text: '> WESLEY..............  ', end: { text: 'FAILED',  cls: 'bios-fail' } },
    { text: '> ALAIN...............  ', end: { text: 'WAITING', cls: 'bios-wait' } },
    { text: '' },
    { text: '> Loading CFC Engine...  ', end: { text: 'OK', cls: 'bios-ok' } },
    { text: '' },
    { text: 'READY.', cls: 'bios-ready' },
  ];

  let idx = 0;

  function nextLine() {
    if (idx >= lines.length) {
      setTimeout(() => {
        screen.classList.add('fade-out');
        setTimeout(() => screen.classList.add('gone'), 850);
      }, 350);
      return;
    }
    const l   = lines[idx++];
    const div = document.createElement('div');
    if (l.cls) div.className = l.cls;
    if (l.end) {
      div.textContent = l.text;
      const span = document.createElement('span');
      span.className   = l.end.cls;
      span.textContent = l.end.text;
      div.appendChild(span);
    } else {
      div.textContent = l.text || ' ';
    }
    content.appendChild(div);
    setTimeout(nextLine, l.text ? 170 : 55);
  }

  nextLine();
}

// ─── Particules ambiantes ─────────────────────────────────────

(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 38 }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  .4 + Math.random() * 1.6,
    dx: (Math.random() - .5) * .25,
    dy: -.08 - Math.random() * .22,
    a:  .08 + Math.random() * .35,
    v:  Math.random() > .5 ? 'rgba(168,85,247,' : 'rgba(34,197,94,',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.v + p.a + ')';
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
      if (p.x < -4) p.x = canvas.width + 4;
      if (p.x > canvas.width + 4) p.x = -4;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── Matrix Rain ─────────────────────────────────────────────

(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx    = canvas.getContext('2d');
  const CHARS  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 18);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(5,5,8,.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px monospace';
    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      // Couleur alternée violet / vert
      ctx.fillStyle = i % 3 === 0 ? '#a855f7' : '#22c55e';
      ctx.fillText(char, i * 18, drops[i] * 18);
      if (drops[i] * 18 > canvas.height && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();

// ─── Holographic card shine ───────────────────────────────────

(function initCardShine() {
  const card  = document.getElementById('form-card');
  const shine = card?.querySelector('.card-shine');
  if (!card || !shine) return;
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
    const my = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
    shine.style.setProperty('--mx', mx);
    shine.style.setProperty('--my', my);
  });
})();

// ─── Web Audio — sons de tambour brainrot ────────────────────

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playDrum(type = 'kick', delay = 0) {
  try {
    const ctx  = getAudioCtx();
    const time = ctx.currentTime + delay;

    if (type === 'kick') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + .5);
      gain.gain.setValueAtTime(.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + .5);
      osc.start(time); osc.stop(time + .5);

    } else if (type === 'snare') {
      const bufSize = ctx.sampleRate * .15;
      const buf  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource();
      const gain = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      filt.type = 'highpass'; filt.frequency.value = 1500;
      src.buffer = buf;
      src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + .15);
      src.start(time); src.stop(time + .15);

    } else if (type === 'hihat') {
      const bufSize = ctx.sampleRate * .05;
      const buf  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource();
      const gain = ctx.createGain();
      const filt = ctx.createBiquadFilter();
      filt.type = 'highpass'; filt.frequency.value = 8000;
      src.buffer = buf;
      src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + .05);
      src.start(time); src.stop(time + .05);
    }
  } catch(_) {}
}

function playTungTung() {
  // Tung Tung Tung Sahur pattern 🥁
  const pattern = [
    ['kick',  0],
    ['hihat', .1],
    ['snare', .2],
    ['hihat', .3],
    ['kick',  .4],
    ['kick',  .5],
    ['hihat', .6],
    ['snare', .7],
    ['hihat', .8],
    ['kick',  .9],
    ['snare', 1.0],
    ['hihat', 1.1],
  ];
  pattern.forEach(([type, delay]) => playDrum(type, delay));
}

// ─── Config PDF ──────────────────────────────────────────────

// PDF local commité par GitHub Actions — même domaine = zéro CORS
const PDF_LOCAL = 'palmares.pdf';
// URL officielle en fallback
const PDF_URL = 'https://www.citedesmetiers.ch/app/uploads/2026/06/Palmares_2026-06-22_15h37.pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ─── Données d'exemple (structure réelle d'un palmarès CFC) ──

const EXEMPLE_PALMARES = `Palmarès CFC 2026 — Cité des Métiers — Données d'exemple

Employé de commerce CFC
Addor Alain 5.8
Amstad Estelle 5.6
Fontaine Marie 5.4
Rochat Pierre-Antoine 5.5

Informaticien CFC
Bernasconi Thomas 5.9
Dupont Jean-Luc 5.7
Müller Kevin 5.6

Électricien CFC
Moreau Luca 5.5
Zimmermann Hugo 5.8

Cuisinière / Cuisinier CFC
Girard Sophie 5.7
Favre Laura 5.6`;

// ─── Mots-clés de sections métiers ───────────────────────────

const SECTION_KEYWORDS = [
  'CFC', 'AFP', 'employé', 'employee', 'gestionnaire', 'assistant', 'assistante',
  'informaticien', 'mécanicien', 'électricien', 'cuisinier', 'cuisinière',
  'coiffeur', 'coiffeuse', 'menuisier', 'horloger', 'constructeur', 'dessinateur',
  'polymécanicien', 'pharmacien', 'logisticien', 'médiamaticien', 'technicien',
  'opticien', 'agriculteur', 'installateur', 'sanitaire', 'chauffagiste',
  'carrossier', 'ébéniste', 'fleuriste', 'boucher', 'boulanger', 'pâtissier',
  'agent', 'maturité', 'diplôme', 'attestation', 'commerce', 'maçon', 'peintre',
  'plâtrier', 'arboriculteur', 'automaticien', 'polysoins', 'aide-soignant',
  'soins', 'fiduciaire', 'commerce de détail', 'détail'
];

// ─── Utilitaires ─────────────────────────────────────────────

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Détecte si une ligne ressemble à un titre de section métier. */
function looksLikeSectionTitle(line) {
  const n = normalize(line);
  const hasKeyword = SECTION_KEYWORDS.some(k => n.includes(normalize(k)));
  if (!hasKeyword) return false;
  // Une ligne avec une note (5.8) n'est pas un titre de section
  if (/\d[.,]\d/.test(line)) return false;
  // Trop long = pas un titre
  if (line.length > 90) return false;
  return true;
}

/** Tente d'extraire la profession directement depuis une ligne. */
function extractProfessionFromLine(line) {
  // Format "— Profession CFC" ou "- Profession AFP"
  const dashMatch = line.match(/[—\-–]\s*([^—\-–\d]{4,}(?:CFC|AFP|diplôme|maturité)[^—\-–\d]*)/i);
  if (dashMatch) return dashMatch[1].trim();
  // Format "Nom Prénom Profession CFC note"
  const cfcMatch = line.match(/([\w\s''éèêëàâùûüôîïçœæ-]{4,}(?:CFC|AFP))/i);
  if (cfcMatch) return cfcMatch[1].trim();
  return null;
}

/**
 * Cherche la profession liée à une ligne de match.
 * 1. Cherche sur la même ligne
 * 2. Remonte les lignes pour trouver le dernier titre de section
 */
function extractProfessionForMatch(lines, matchLine) {
  // 1. Sur la même ligne
  const inLine = extractProfessionFromLine(matchLine);
  if (inLine) return inLine;

  // 2. Remonte vers le dernier titre de section
  const idx = lines.indexOf(matchLine);
  for (let i = idx - 1; i >= 0; i--) {
    if (looksLikeSectionTitle(lines[i])) {
      return lines[i].trim();
    }
  }
  return null;
}

// ─── Recherche de nom ─────────────────────────────────────────

function lineMatchesName(line, prenom, nom) {
  const n  = normalize(line);
  const p  = normalize(prenom);
  const nm = normalize(nom);
  if (p && nm) return n.includes(p) && n.includes(nm);
  if (p)  return n.includes(p);
  if (nm) return n.includes(nm);
  return false;
}

function lineMatchesProfession(line, profession) {
  if (!profession) return true;
  return normalize(line).includes(normalize(profession));
}

/** Retourne vrai uniquement si on cherche exactement Alain Addor. */
function isAlainAddor(prenom, nom) {
  return normalize(prenom) === 'alain' && normalize(nom) === 'addor';
}

// ─── Extraction PDF ───────────────────────────────────────────

/**
 * Extrait le texte d'un PDF page par page.
 * Regroupe les items par ligne en utilisant leur coordonnée Y.
 * Tolérance de 4px pour gérer les légères variations de baseline.
 * Les items d'une même ligne sont triés par X (gauche → droite)
 * pour conserver l'ordre naturel des colonnes d'un tableau.
 */
async function extractTextFromPdfBuffer(buffer) {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const allLines = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page    = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Groupe les items par ligne (Y arrondi à 4px près)
    const rowMap = new Map();
    for (const item of content.items) {
      if (!item.str.trim()) continue;
      const y = Math.round(item.transform[5] / 4) * 4;
      if (!rowMap.has(y)) rowMap.set(y, []);
      rowMap.get(y).push({ x: item.transform[4], str: item.str });
    }

    // Trie les lignes de haut en bas (Y décroissant en espace PDF)
    const sortedYs = [...rowMap.keys()].sort((a, b) => b - a);

    for (const y of sortedYs) {
      const items = rowMap.get(y).sort((a, b) => a.x - b.x);
      const lineText = items.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();
      if (lineText) allLines.push(lineText);
    }
  }

  return allLines.join('\n');
}

// ─── PDF status helpers ───────────────────────────────────────

function setPdfStatus(msg, type = '') {
  const el = document.getElementById('pdf-status');
  el.textContent = msg;
  el.className = 'pdf-status' + (type ? ' ' + type : '');
}

function extractPdfDate(url) {
  const m = url.match(/(\d{4})-(\d{2})-(\d{2})_(\d{2})h(\d{2})/);
  if (!m) return null;
  return `${m[3]}.${m[2]}.${m[1]} à ${m[4]}h${m[5]}`;
}

function setPdfDate(url) {
  const el = document.getElementById('pdf-date');
  if (!el) return;
  const date = extractPdfDate(url);
  if (date) {
    el.textContent = `📅 PDF trouvé — mis à jour le ${date}`;
    el.className = 'pdf-date show';
  }
}

function setPdfDropLoaded(filename) {
  const zone = document.getElementById('pdf-drop-zone');
  zone.classList.add('loaded');
  document.getElementById('pdf-drop-inner').innerHTML = `
    <span class="pdf-drop-icon">✅</span>
    <span class="pdf-drop-text" style="color:var(--green)">${escapeHtml(filename)}</span>
  `;
}

async function loadPdfBuffer(buffer, filename) {
  setPdfStatus('Extraction du texte…', 'loading');
  try {
    const text = await extractTextFromPdfBuffer(buffer);
    document.getElementById('textarea-palmares').value = text;
    setPdfStatus(`✅ ${text.split('\n').length} lignes extraites depuis "${filename}"`, 'ok');
    setPdfDropLoaded(filename);
  } catch (e) {
    setPdfStatus('❌ Erreur lors de la lecture du PDF : ' + e.message, 'err');
  }
}

// ─── Fetch auto PDF ───────────────────────────────────────────

async function fetchPdfAuto() {
  const btn   = document.getElementById('btn-fetch-pdf');
  const label = document.getElementById('fetch-pdf-label');
  const icon  = document.getElementById('fetch-pdf-icon');

  btn.disabled = true;
  btn.classList.add('loading');
  label.textContent = 'Récupération en cours…';
  icon.textContent  = '⏳';
  setPdfStatus('Connexion au serveur…', 'loading');

  const sources = [
    { url: PDF_LOCAL, label: '📂 Chargement depuis le repo…' },
    { url: `https://api.allorigins.win/raw?url=${encodeURIComponent(PDF_URL)}`, label: '🔄 Via proxy CORS…' },
    { url: `https://corsproxy.io/?${encodeURIComponent(PDF_URL)}`, label: '🔄 Via proxy de secours…' },
  ];

  for (const src of sources) {
    try {
      setPdfStatus(src.label, 'loading');
      const res = await fetch(src.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = await res.arrayBuffer();
      const magic = new Uint8Array(buffer.slice(0, 4));
      const isPdf = magic[0]===0x25 && magic[1]===0x50 && magic[2]===0x44 && magic[3]===0x46;
      if (!isPdf) throw new Error('Pas un PDF');
      btn.classList.remove('loading');
      btn.classList.add('success');
      label.textContent = 'PDF chargé !';
      icon.textContent  = '✅';
      setPdfDate(src.url.includes('palmares.pdf') ? PDF_URL : src.url);
      await loadPdfBuffer(buffer, 'palmares.pdf');
      return;
    } catch (_) {
      // essaie la source suivante
    }
  }

  btn.disabled = false;
  btn.classList.remove('loading');
  label.textContent = 'Récupérer le PDF automatiquement';
  icon.textContent  = '⚡';
  setPdfStatus('❌ Impossible de charger le PDF — dépose-le manuellement ci-dessous.', 'err');
}

// ─── Génération attestation PDF ──────────────────────────────

function drawSpriteOnCanvas(ctx, url, xPx, yPx, heightPx) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / (img.naturalHeight || 1);
      ctx.drawImage(img, xPx, yPx, heightPx * ratio, heightPx);
      resolve();
    };
    img.onerror = () => {
      console.error('Sprite non chargé:', url);
      resolve();
    };
    img.src = url;
  });
}

// ─── Helpers dessin du certificat ────────────────────────────
function _certStar(c, cx, cy, spikes, outer, inner) {
  let rot = -Math.PI / 2; const step = Math.PI / spikes;
  c.beginPath(); c.moveTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  for (let i = 0; i < spikes; i++) {
    rot += step; c.lineTo(cx + Math.cos(rot) * inner, cy + Math.sin(rot) * inner);
    rot += step; c.lineTo(cx + Math.cos(rot) * outer, cy + Math.sin(rot) * outer);
  }
  c.closePath(); c.fill();
}

function _certGuilloche(c, cx, cy) {
  // motif spirographe faible (anti-contrefaçon façon billet de banque)
  c.save();
  c.globalAlpha = 0.5;
  c.strokeStyle = 'rgba(168,85,247,.10)';
  c.lineWidth = 1;
  for (let k = 0; k < 60; k++) {
    const a = (k / 60) * Math.PI * 2;
    c.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.08) {
      const R = 230 + 60 * Math.cos(5 * t + a);
      const x = cx + R * Math.cos(t + a);
      const y = cy + R * Math.sin(t + a);
      t === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.stroke();
  }
  c.restore();
}

function _certCornerOrn(c, x, y, dx, dy) {
  c.strokeStyle = '#fbbf24'; c.lineCap = 'round';
  c.lineWidth = 5;
  c.beginPath();
  c.moveTo(x + dx * 110, y); c.lineTo(x + dx * 28, y);
  c.quadraticCurveTo(x, y, x, y + dy * 28); c.lineTo(x, y + dy * 110);
  c.stroke();
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(x + dx * 70, y + dy * 30); c.lineTo(x + dx * 30, y + dy * 30);
  c.lineTo(x + dx * 30, y + dy * 70);
  c.stroke();
  c.fillStyle = '#f59e0b';
  c.save(); c.translate(x + dx * 46, y + dy * 46); c.rotate(Math.PI / 4); c.fillRect(-8, -8, 16, 16); c.restore();
}

function _certEmblem(c, cx, cy, r) {
  c.save();
  c.shadowColor = '#f59e0b'; c.shadowBlur = 34;
  const g = c.createRadialGradient(cx, cy - r * .3, 10, cx, cy, r);
  g.addColorStop(0, '#2a1a4a'); g.addColorStop(1, '#0d0820');
  c.fillStyle = g;
  c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
  c.shadowBlur = 0;
  // rayons
  c.strokeStyle = 'rgba(245,158,11,.25)'; c.lineWidth = 2;
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    c.beginPath(); c.moveTo(cx + Math.cos(a) * (r - 30), cy + Math.sin(a) * (r - 30));
    c.lineTo(cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6)); c.stroke();
  }
  c.strokeStyle = '#fbbf24'; c.lineWidth = 6; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
  c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, r - 14, 0, Math.PI * 2); c.stroke();
  // étoile
  c.fillStyle = '#f59e0b';
  _certStar(c, cx, cy - r * .12, 5, r * .52, r * .22);
  c.fillStyle = '#fff'; c.font = 'bold 40px Impact, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText('HUN', cx, cy + r * .52);
  c.restore();
}

function _certSeal(c, cx, cy, r) {
  c.save();
  c.translate(cx, cy);
  c.rotate(-Math.PI / 13);
  c.globalAlpha = 0.92;
  c.strokeStyle = '#e0245e'; c.fillStyle = '#e0245e';
  c.lineWidth = 9; c.beginPath(); c.arc(0, 0, r, 0, Math.PI * 2); c.stroke();
  c.lineWidth = 3; c.beginPath(); c.arc(0, 0, r - 22, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.arc(0, 0, r - 150, 0, Math.PI * 2); c.stroke();
  // texte circulaire
  c.font = 'bold 33px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  const txt = '★ HUN EDITION ★ CFC PRO MAX ★ TUNG TUNG SAHUR ★ ';
  const N = txt.length;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    c.save(); c.rotate(a); c.translate(0, -(r - 48)); c.fillText(txt[i], 0, 0); c.restore();
  }
  c.font = 'bold 96px Impact, sans-serif'; c.fillText('VALIDÉ', 0, -8);
  c.font = 'bold 32px Impact, sans-serif'; c.fillText('★ RC2 · 2026 ★', 0, 64);
  c.restore();
}

function _certQR(c, x, y, size) {
  const n = 25, cs = size / n;
  c.fillStyle = '#fff'; c.fillRect(x - 10, y - 10, size + 20, size + 20);
  c.fillStyle = '#0a0a12';
  let seed = 6767;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 16) & 1; };
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (rnd()) c.fillRect(x + i * cs, y + j * cs, cs, cs);
  const finder = (fx, fy) => {
    c.fillStyle = '#fff'; c.fillRect(x + fx * cs - cs, y + fy * cs - cs, 9 * cs, 9 * cs);
    c.fillStyle = '#0a0a12'; c.fillRect(x + fx * cs, y + fy * cs, 7 * cs, 7 * cs);
    c.fillStyle = '#fff'; c.fillRect(x + (fx + 1) * cs, y + (fy + 1) * cs, 5 * cs, 5 * cs);
    c.fillStyle = '#0a0a12'; c.fillRect(x + (fx + 2) * cs, y + (fy + 2) * cs, 3 * cs, 3 * cs);
  };
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
}

function _certSignature(c, x, y) {
  c.strokeStyle = '#e2e8f0'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath();
  c.moveTo(x, y);
  c.bezierCurveTo(x + 45, y - 60, x + 80, y + 45, x + 130, y - 12);
  c.bezierCurveTo(x + 175, y - 60, x + 175, y + 55, x + 235, y - 6);
  c.bezierCurveTo(x + 270, y - 35, x + 300, y + 25, x + 360, y - 18);
  c.stroke();
  c.lineWidth = 2;
  c.beginPath(); c.moveTo(x + 70, y + 18); c.bezierCurveTo(x + 200, y + 30, x + 280, y + 6, x + 350, y + 16); c.stroke();
}

function _certBadge(c, x, y, w, h, label, color) {
  c.fillStyle = color.replace('1)', '.16)');
  roundRect(c, x, y, w, h, 14); c.fill();
  c.strokeStyle = color; c.lineWidth = 2; roundRect(c, x, y, w, h, 14); c.stroke();
  c.fillStyle = color; c.font = 'bold 30px Impact, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(label, x + w / 2, y + h / 2 + 1);
}

async function downloadCertificate(prenom, nom, profession) {
  const btn = document.getElementById('btn-certif');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Génération…'; }

  try {
    if (!window.jspdf) throw new Error('jsPDF non chargé — vérifie ta connexion internet.');

    const { jsPDF } = window.jspdf;

    // ── Canvas A4 paysage haute résolution (2480×1754 ≈ 210dpi) ──
    const W = 2480, H = 1754;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const c = cv.getContext('2d');

    const fullName = [prenom, nom].filter(Boolean).join(' ').toUpperCase();
    const profText = (profession || 'EMPLOYÉ·E DE COMMERCE CFC').toUpperCase();
    const dateStr  = new Date().toLocaleDateString('fr-CH', { day:'2-digit', month:'2-digit', year:'numeric' });

    // ── Fond ──
    const bg = c.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#0a0712'); bg.addColorStop(.5, '#0f0a24'); bg.addColorStop(1, '#07100a');
    c.fillStyle = bg; c.fillRect(0, 0, W, H);

    // ── Grille fine ──
    c.strokeStyle = 'rgba(124,58,237,0.05)'; c.lineWidth = 1;
    for (let x = 0; x < W; x += 46) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,H); c.stroke(); }
    for (let y = 0; y < H; y += 46) { c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); }

    // ── Guilloché + watermark ──
    _certGuilloche(c, W/2, H/2 + 40);
    c.save(); c.translate(W/2, H/2 + 110); c.rotate(-Math.PI/11);
    c.font = 'bold 150px Impact, sans-serif'; c.fillStyle = 'rgba(245,158,11,0.045)'; c.textAlign = 'center';
    c.fillText('MAMA GUAVO APPROVED', 0, 0); c.restore();

    // ── Cadre doré + ornements ──
    const frameGrad = c.createLinearGradient(0,0,W,H);
    frameGrad.addColorStop(0,'#92400e'); frameGrad.addColorStop(.5,'#fbbf24'); frameGrad.addColorStop(1,'#92400e');
    c.strokeStyle = frameGrad; c.lineWidth = 14; c.strokeRect(30, 30, W-60, H-60);
    c.strokeStyle = 'rgba(245,158,11,.5)'; c.lineWidth = 2; c.strokeRect(56, 56, W-112, H-112);
    _certCornerOrn(c, 56, 56, 1, 1);
    _certCornerOrn(c, W-56, 56, -1, 1);
    _certCornerOrn(c, 56, H-56, 1, -1);
    _certCornerOrn(c, W-56, H-56, -1, -1);

    // ── Ruban haut ──
    const ribbon = c.createLinearGradient(0,0,W,0);
    ribbon.addColorStop(0,'#4c1d95'); ribbon.addColorStop(.5,'#a855f7'); ribbon.addColorStop(1,'#4c1d95');
    c.fillStyle = ribbon; c.fillRect(56, 56, W-112, 86);
    c.fillStyle = '#fff'; c.font = 'bold 38px Impact, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('★  CITÉ DES MÉTIERS  ·  RÉPUBLIQUE POPULAIRE DU HUN  ·  SUISSE 2026  ★', W/2, 100);
    c.textBaseline = 'alphabetic';

    // ── Emblème ──
    _certEmblem(c, W/2, 268, 84);

    // ── Titre ──
    c.fillStyle = '#fbbf24'; c.font = 'bold 112px Impact, sans-serif'; c.textAlign = 'center';
    c.shadowColor = '#f59e0b'; c.shadowBlur = 30;
    c.fillText('ATTESTATION OFFICIELLE', W/2, 472);
    c.shadowBlur = 0;
    c.fillStyle = 'rgba(255,255,255,.65)'; c.font = '34px Georgia, serif';
    c.fillText('Certificat de validation — CFC PRO MAX · RC2 · HUN EDITION', W/2, 524);

    // ── Séparateur ──
    const sep = c.createLinearGradient(200,0,W-200,0);
    sep.addColorStop(0,'transparent'); sep.addColorStop(.15,'#f59e0b'); sep.addColorStop(.5,'#fbbf24'); sep.addColorStop(.85,'#f59e0b'); sep.addColorStop(1,'transparent');
    c.strokeStyle = sep; c.lineWidth = 3; c.beginPath(); c.moveTo(200,562); c.lineTo(W-200,562); c.stroke();

    // ── Mention ──
    c.fillStyle = 'rgba(255,255,255,.7)'; c.font = 'italic 42px Georgia, serif'; c.textAlign = 'center';
    c.fillText('Décerné solennellement à', W/2, 644);

    // ── Nom (auto-fit) ──
    let nameFont = 130;
    c.font = 'bold ' + nameFont + 'px Impact, sans-serif';
    while (c.measureText(fullName).width > W - 580 && nameFont > 58) { nameFont -= 4; c.font = 'bold ' + nameFont + 'px Impact, sans-serif'; }
    c.fillStyle = '#ffffff';
    c.shadowColor = 'rgba(34,197,94,.55)'; c.shadowBlur = 40;
    c.fillText(fullName, W/2, 776);
    c.shadowBlur = 0;

    // ── Profession (auto-fit) ──
    let profFont = 54;
    c.font = 'bold ' + profFont + 'px Impact, sans-serif';
    while (c.measureText(profText).width > W - 700 && profFont > 30) { profFont -= 2; c.font = 'bold ' + profFont + 'px Impact, sans-serif'; }
    c.fillStyle = '#4ade80';
    c.fillText(profText, W/2, 846);

    c.fillStyle = 'rgba(255,255,255,.6)'; c.font = 'italic 33px Georgia, serif';
    c.fillText('pour avoir validé l\'épreuve d\'interface OSU avec la mention TUNG TUNG SAHUR', W/2, 908);

    // ── Bloc note finale ──
    const gbW = 760, gbX = W/2 - gbW/2, gbY = 956;
    c.fillStyle = 'rgba(34,197,94,.10)'; roundRect(c, gbX, gbY, gbW, 150, 20); c.fill();
    c.strokeStyle = 'rgba(34,197,94,.5)'; c.lineWidth = 2; roundRect(c, gbX, gbY, gbW, 150, 20); c.stroke();
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = 'rgba(255,255,255,.6)'; c.font = 'bold 26px Impact, sans-serif';
    c.fillText('NOTE FINALE', W/2, gbY + 36);
    c.fillStyle = '#4ade80'; c.font = 'bold 62px Impact, sans-serif';
    c.shadowColor = '#22c55e'; c.shadowBlur = 18; c.fillText('6.0 / 6.0', W/2, gbY + 84); c.shadowBlur = 0;
    c.fillStyle = '#fbbf24'; c.font = '38px Georgia, serif';
    c.fillText('★ ★ ★ ★ ★', W/2, gbY + 126);
    c.textBaseline = 'alphabetic';

    // ── Badges stats ──
    const bw = 390, bgap = 26, totalBW = bw*3 + bgap*2, bx0 = W/2 - totalBW/2, by = 1146;
    _certBadge(c, bx0,             by, bw, 64, '✨ AURA  +9 999',          'rgba(168,85,247,1)');
    _certBadge(c, bx0+bw+bgap,     by, bw, 64, '🗿 RIZZ  MAXIMUM',          'rgba(6,182,212,1)');
    _certBadge(c, bx0+(bw+bgap)*2, by, bw, 64, '💯 SOCIAL CREDIT  999 999', 'rgba(245,158,11,1)');

    // ── Ligne brainrot ──
    c.fillStyle = '#22c55e'; c.font = 'bold 64px Impact, sans-serif'; c.textAlign = 'center';
    c.shadowColor = '#22c55e'; c.shadowBlur = 22;
    c.fillText('TPTTPPTPTPTPTPXXXZA', W/2, 1300);
    c.shadowBlur = 0;

    // ── Sceau VALIDÉ (tamponné à droite) ──
    _certSeal(c, 2070, 1000, 205);

    // ── Séparateur bas ──
    c.strokeStyle = sep; c.lineWidth = 2; c.beginPath(); c.moveTo(200, 1392); c.lineTo(W-200, 1392); c.stroke();

    // ── Signature ──
    _certSignature(c, 210, 1500);
    c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(190, 1540); c.lineTo(700, 1540); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.8)'; c.font = 'bold 32px Georgia, serif'; c.textAlign = 'left';
    c.fillText('Tung Tung Tung Sahur', 190, 1588);
    c.fillStyle = 'rgba(255,255,255,.45)'; c.font = '25px Georgia, serif';
    c.fillText('Directeur Général du HUN', 190, 1624);

    // ── ID + date (sous le séparateur) ──
    c.fillStyle = '#64748b'; c.font = '26px Courier New, monospace'; c.textAlign = 'left';
    c.fillText('Émis le ' + dateStr + '   ·   ID: HUN-67-2026-RC2', 190, 1448);
    c.fillStyle = '#3a3a5a';
    c.fillText('citedesmetiers.ch/palmares2026  ·  Document non officiel — HUN Edition', 190, 1684);

    // ── Faux QR + label ──
    _certQR(c, W-380, 1424, 220);
    c.fillStyle = 'rgba(255,255,255,.5)'; c.font = '22px Courier New, monospace'; c.textAlign = 'center';
    c.fillText('SCAN = +9999 AURA', W-270, 1690);

    // ── Sprites (data: URLs = pas de canvas taint) ──
    await drawSpriteOnCanvas(c, 'TUNG.png', 112, 612, 168);
    await drawSpriteOnCanvas(c, 'HUN.png',  W-300, 600, 178);

    // ── Export canvas complet → jsPDF ──
    const fullData = cv.toDataURL('image/jpeg', 0.95);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.addImage(fullData, 'JPEG', 0, 0, 297, 210);

    const filename = `Attestation_CFC_${[prenom,nom].filter(Boolean).join('_') || 'HUN'}_2026_RC2.pdf`;
    doc.save(filename);

  } catch(err) {
    alert('Erreur génération PDF : ' + err.message);
    console.error(err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '📜 Télécharger l\'attestation PDF'; }
  }
}

function preloadSprites() {}

// Utilitaire : rectangle arrondi pour canvas
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Son victoire ─────────────────────────────────────────────

let soundEnabled    = localStorage.getItem('hun-sound') !== 'false';
let _victoireBuffer = null;
let _victoireSource = null;

function _updateSoundBtn() {
  const btn = document.getElementById('btn-sound');
  if (!btn) return;
  btn.textContent = soundEnabled ? '🔊 SON' : '🔇 SON';
  btn.classList.toggle('muted', !soundEnabled);
}

// Précharge le mp3 via Web Audio API (pas de restriction autoplay)
async function preloadVictoire() {
  try {
    const res = await fetch('./victoire.mp3');
    const buf = await res.arrayBuffer();
    _victoireBuffer = await getAudioCtx().decodeAudioData(buf);
  } catch(e) {}
}

let _osuBuffer = null;
let _osuSource = null;

async function preloadOsu() {
  try {
    const res = await fetch('./OSU.mp3');
    const buf = await res.arrayBuffer();
    _osuBuffer = await getAudioCtx().decodeAudioData(buf);
  } catch(e) {}
}

function playOsuMusic() {
  if (!soundEnabled || !_osuBuffer) return;
  stopOsuMusic();
  try {
    const ctx  = getAudioCtx();
    ctx.resume().then(() => {
      const gain = ctx.createGain();
      gain.gain.value = 0.6;
      gain.connect(ctx.destination);
      _osuSource = ctx.createBufferSource();
      _osuSource.buffer = _osuBuffer;
      _osuSource.connect(gain);
      _osuSource.start(0);
      _osuSource.onended = () => { _osuSource = null; };
    });
  } catch(e) {}
}

function stopOsuMusic() {
  if (_osuSource) {
    try { _osuSource.stop(); } catch(e) {}
    _osuSource = null;
  }
}

let _sixSevenBuffer = null;
let _sixSevenSource = null;

async function preloadSixSeven() {
  try {
    const res = await fetch('./67.mp3');
    const buf = await res.arrayBuffer();
    _sixSevenBuffer = await getAudioCtx().decodeAudioData(buf);
  } catch(e) {}
}

function playSixSeven() {
  if (!soundEnabled || !_sixSevenBuffer) return;
  stopSixSeven();
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      const gain = ctx.createGain();
      gain.gain.value = 0.85;
      gain.connect(ctx.destination);
      _sixSevenSource = ctx.createBufferSource();
      _sixSevenSource.buffer = _sixSevenBuffer;
      _sixSevenSource.connect(gain);
      _sixSevenSource.start(0);
      _sixSevenSource.onended = () => { _sixSevenSource = null; };
    });
  } catch(e) {}
}

function stopSixSeven() {
  if (_sixSevenSource) {
    try { _sixSevenSource.stop(); } catch(e) {}
    _sixSevenSource = null;
  }
}

function _playLogoSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      // Accord montant doux — impression d'apparition
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.07;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + .06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + .5);
        osc.start(t); osc.stop(t + .55);
      });
    });
  } catch(e) {}
}

function stopVictoire() {
  if (_victoireSource) {
    try { _victoireSource.stop(); } catch(e) {}
    _victoireSource = null;
  }
}

function playVictoire() {
  if (!soundEnabled || !_victoireBuffer) return;
  stopVictoire();
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      const gain = ctx.createGain();
      gain.gain.value = 0.7;
      gain.connect(ctx.destination);
      _victoireSource = ctx.createBufferSource();
      _victoireSource.buffer = _victoireBuffer;
      _victoireSource.connect(gain);
      _victoireSource.start(0);
      _victoireSource.onended = () => { _victoireSource = null; };
    });
  } catch(e) {}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('hun-sound', soundEnabled ? 'true' : 'false');
  _updateSoundBtn();
  if (!soundEnabled) {
    stopVictoire();
    stopSixSeven();
    stopOsuMusic();
    if (typeof stopStory === 'function') stopStory();
  }
}

// ─── Achievement Steam toast ──────────────────────────────────

function showAchievement() {
  const toast = document.getElementById('achievement-toast');
  toast.innerHTML = `
    <div class="achievement-inner">
      <div class="achievement-icon">🏆</div>
      <div class="achievement-text">
        <span class="achievement-label">Achievement Unlocked</span>
        <span class="achievement-title">CFC PRO MAX</span>
        <span class="achievement-sub">HUN Edition — Alain validé 🥁</span>
      </div>
    </div>
  `;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

// ─── Alain Addor — Rewards sequence ──────────────────────────

function _playRewardBeep(freq = 880, dur = 0.18) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.start(t); osc.stop(t + dur + 0.05);
    });
  } catch(e) {}
}

function showAlainRewards() {
  const items = [
    { label: '+1 000',      sub: 'SOCIAL CREDIT',   color: '#a855f7', glow: 'rgba(168,85,247,.7)',  freq: 660  },
    { label: '+250',        sub: 'HUN POINTS',       color: '#f59e0b', glow: 'rgba(245,158,11,.7)',  freq: 770  },
    { label: '+999',        sub: 'INTERFACE XP',     color: '#22c55e', glow: 'rgba(34,197,94,.7)',   freq: 880  },
    { label: '+1',          sub: 'CFC PRO MAX',      color: '#06b6d4', glow: 'rgba(6,182,212,.7)',   freq: 1046 },
  ];

  // Container for floating reward chips
  const wrap = document.createElement('div');
  wrap.id = 'alain-rewards-wrap';
  document.body.appendChild(wrap);

  let delay = 0;
  items.forEach((item, i) => {
    setTimeout(() => {
      const chip = document.createElement('div');
      chip.className = 'alain-reward-chip';
      chip.style.setProperty('--rc', item.color);
      chip.style.setProperty('--rg', item.glow);
      chip.style.top = `${22 + i * 13}%`;
      chip.innerHTML = `<span class="arc-num">${item.label}</span><span class="arc-sub">${item.sub}</span>`;
      wrap.appendChild(chip);
      requestAnimationFrame(() => requestAnimationFrame(() => chip.classList.add('arc-in')));
      _playRewardBeep(item.freq, 0.22);
      setTimeout(() => chip.classList.add('arc-out'), 1400);
      setTimeout(() => chip.remove(), 1900);
    }, delay);
    delay += 620;
  });

  // Big reward card after all chips
  setTimeout(() => {
    _playRewardBeep(1318, 0.6);
    setTimeout(() => _playRewardBeep(1568, 0.5), 120);
    setTimeout(() => _playRewardBeep(2093, 0.8), 260);

    const card = document.createElement('div');
    card.id = 'alain-reward-card';
    card.innerHTML = `
      <div class="arc-card-inner">
        <div class="arc-card-line">══════════════════════════</div>
        <div class="arc-card-trophy">🏆</div>
        <div class="arc-card-label">REWARD UNLOCKED</div>
        <div class="arc-card-title">SOCIAL CREDIT</div>
        <div class="arc-card-value">+999 999 999</div>
        <div class="arc-card-edition">HUN EDITION</div>
        <div class="arc-card-line">══════════════════════════</div>
      </div>
    `;
    document.body.appendChild(card);
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('arc-card-in')));
    setTimeout(() => {
      card.classList.add('arc-card-out');
      setTimeout(() => card.remove(), 700);
    }, 2600);

    setTimeout(() => wrap.remove(), 3400);
  }, delay + 200);
}

// ─── Gold flash ───────────────────────────────────────────────

function triggerGoldFlash() {
  const el = document.getElementById('gold-overlay');
  el.classList.remove('flash');
  el.offsetHeight;
  el.classList.add('flash');
}

// ─── Confettis ────────────────────────────────────────────────

function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#7c3aed','#a855f7','#22c55e','#4ade80','#f59e0b','#fbbf24','#fff'];
  const particles = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 300,
    r: 4 + Math.random() * 7,
    d: 1.5 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    tiltAngle: 0,
    tiltSpeed: 0.08 + Math.random() * 0.05,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.tiltAngle += p.tiltSpeed;
      p.y += p.d;
      p.x += Math.sin(frame * 0.01 + p.tiltAngle) * 1.2;
      const tilt = Math.sin(p.tiltAngle) * 12;
      ctx.beginPath();
      ctx.lineWidth   = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + tilt + p.r / 3, p.y);
      ctx.lineTo(p.x + tilt, p.y + tilt + p.r / 5);
      ctx.stroke();
    }
    frame++;
    if (frame < 240) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ─── Speedrun timer ──────────────────────────────────────────

let _srStart = null;
let _srInterval = null;

function startSpeedrunTimer(isPB) {
  // Cleanup any existing
  stopSpeedrunTimer();
  let el = document.getElementById('speedrun-timer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'speedrun-timer';
    document.body.appendChild(el);
  }
  _srStart = Date.now();
  function fmt(ms) {
    const s = Math.floor(ms / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(s).padStart(2,'0')}:${String(cs).padStart(2,'0')}`;
  }
  el.innerHTML = `<div class="sr-label">⏱ WORLD RECORD</div><div class="sr-time" id="sr-time">00:00</div>`;
  el.classList.add('sr-show');
  _srInterval = setInterval(() => {
    const t = document.getElementById('sr-time');
    if (t) t.textContent = fmt(Date.now() - _srStart);
  }, 10);

  if (isPB) {
    setTimeout(() => {
      clearInterval(_srInterval);
      const elapsed = Date.now() - _srStart;
      el.innerHTML = `
        <div class="sr-label sr-pb">🏁 NEW PB</div>
        <div class="sr-time sr-final">${fmt(elapsed)}</div>
        <div class="sr-cry">😭 GG WP</div>
      `;
    }, 3800);
    setTimeout(() => { el.classList.remove('sr-show'); setTimeout(() => el.remove(), 500); }, 9000);
  }
}

function stopSpeedrunTimer() {
  clearInterval(_srInterval);
  const el = document.getElementById('speedrun-timer');
  if (el) el.remove();
}

// ─── Twitch chat ──────────────────────────────────────────────

const TWITCH_MSGS = [
  { user: 'HUN123',       color: '#a855f7', msg: 'INCROYABLE !!!!' },
  { user: 'MamaGuavo',    color: '#22c55e', msg: 'JE LE SAVAIS' },
  { user: 'WesleyGaming', color: '#ef4444', msg: 'c moi ?' },
  { user: 'TungFan',      color: '#f59e0b', msg: 'TUNG TUNG SAHUR 🥁' },
  { user: 'HUN123',       color: '#a855f7', msg: 'ALAIN ADDOR MVP' },
  { user: 'Interface99',  color: '#06b6d4', msg: 'interface validée gg' },
  { user: 'BrainrotMax',  color: '#e91e8c', msg: 'PPP PPP' },
  { user: 'MamaGuavo',    color: '#22c55e', msg: 'EZ CLAP' },
  { user: 'WesleyGaming', color: '#ef4444', msg: 'nooooon' },
  { user: 'TungFan',      color: '#f59e0b', msg: '🥁🥁🥁🥁🥁' },
  { user: 'CFCViewer',    color: '#a855f7', msg: 'il est fort ce mec' },
  { user: 'Interface99',  color: '#06b6d4', msg: 'LECTEUR DE PDF CERTIFIÉ' },
];

function showTwitchChat() {
  if (document.getElementById('twitch-chat')) return;
  const chat = document.createElement('div');
  chat.id = 'twitch-chat';
  chat.innerHTML = `
    <div class="tc-header">
      <span class="tc-dot"></span> LIVE CHAT
      <span class="tc-viewers">👁 1 337 viewers</span>
    </div>
    <div class="tc-body" id="tc-body"></div>
  `;
  document.body.appendChild(chat);
  requestAnimationFrame(() => requestAnimationFrame(() => chat.classList.add('tc-show')));

  let i = 0;
  function nextMsg() {
    if (!document.getElementById('twitch-chat')) return;
    const body = document.getElementById('tc-body');
    if (!body) return;
    const m = TWITCH_MSGS[i % TWITCH_MSGS.length];
    const row = document.createElement('div');
    row.className = 'tc-msg';
    row.innerHTML = `<span class="tc-user" style="color:${m.color}">${m.user}</span><span class="tc-sep">:</span><span class="tc-text">${m.msg}</span>`;
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
    // Keep max 12 messages
    while (body.children.length > 12) body.removeChild(body.firstChild);
    i++;
    setTimeout(nextMsg, 600 + Math.random() * 900);
  }
  setTimeout(nextMsg, 400);
  // Disparaît après 18s
  setTimeout(() => {
    const el = document.getElementById('twitch-chat');
    if (el) { el.classList.remove('tc-show'); setTimeout(() => el.remove(), 500); }
  }, 18000);
}

// ─── Bulletin scolaire ────────────────────────────────────────

function showBulletin() {
  if (document.getElementById('bulletin-overlay')) return;
  const ol = document.createElement('div');
  ol.id = 'bulletin-overlay';
  ol.innerHTML = `
    <div class="bul-card">
      <div class="bul-header">
        <div class="bul-school">🏫 ÉCOLE SECONDAIRE CFC PRO MAX</div>
        <div class="bul-title">BULLETIN SCOLAIRE — HUN EDITION 2026</div>
        <div class="bul-student">Élève : <strong>ALAIN ADDOR</strong> &nbsp;|&nbsp; Classe : COMMERCE 3B</div>
      </div>
      <table class="bul-table">
        <thead><tr><th>Matière</th><th>Note</th><th>Appréciation</th></tr></thead>
        <tbody>
          <tr class="bul-row bul-pass"><td>Interface</td><td class="bul-grade">6.0</td><td>Excellence absolue</td></tr>
          <tr class="bul-row bul-pass"><td>Brainrot</td><td class="bul-grade">6.0</td><td>TUNG TUNG SAHUR level</td></tr>
          <tr class="bul-row bul-pass"><td>HUN Studies</td><td class="bul-grade">6.0</td><td>Référence nationale</td></tr>
          <tr class="bul-row bul-fail"><td>Wesley</td><td class="bul-grade bul-fail-grade">1.0</td><td>Pas de commentaire</td></tr>
          <tr class="bul-row bul-pass"><td>Employé de commerce</td><td class="bul-grade">5.8</td><td>CFC validé ✅</td></tr>
        </tbody>
      </table>
      <div class="bul-footer">
        <div class="bul-comment">💬 Commentaire du titulaire : <em>"Alain est une fierté pour l'établissement. Wesley est invité à ne plus venir."</em></div>
        <div class="bul-avg">Moyenne générale : <strong>4.96</strong> — <span class="bul-mention">MENTION HUN 🏆</span></div>
      </div>
      <button class="bul-close" onclick="document.getElementById('bulletin-overlay').remove()">✕ Fermer</button>
    </div>
  `;
  document.body.appendChild(ol);
  requestAnimationFrame(() => requestAnimationFrame(() => ol.classList.add('bul-in')));
}

// ─── Sponsors pendant le terminal ────────────────────────────

const SPONSORS = [
  '✓ HUN Industries™',
  '✓ Interface Corp®',
  '✓ Mama Guavo Bank®',
];

// ─── Rendu des résultats ──────────────────────────────────────

/**
 * Affiche le résultat selon qui est trouvé.
 * Mode spécial uniquement pour Alain Addor.
 * Pour tout autre nom : affiche le nom recherché + profession détectée.
 */
function renderSuccess(matchResults, prenom, nom) {
  const zone = document.getElementById('result-zone');
  const first = matchResults[0];

  // La musique speedrun s'arrête dès que le résultat commence
  stopStory();
  hideSpeedrunnerGif();

  const displayName = [prenom, nom].filter(Boolean).join(' ').toUpperCase();

  const profDisplay = first.profession
    ? `<div class="result-profession">🎓 ${escapeHtml(first.profession)}</div>`
    : `<div class="result-profession muted">CFC / profession : non déterminé(e)</div>`;

  const rawLine = `<div class="result-lines">▸ ${escapeHtml(first.line)}</div>`;

  if (isAlainAddor(prenom, nom)) {
    // ── TROLL : faux échec pendant 1.8s puis glitch ──
    zone.innerHTML = `
      <div class="result-fail" id="troll-fail">
        <div class="result-sprites" style="justify-content:center;margin-bottom:12px">
          <img src="TUNG.png" class="result-sprite-tung" style="opacity:.5;filter:grayscale(.6)" alt="" />
        </div>
        <div class="result-title">❌ Aucun résultat</div>
        <div class="result-msg">
          <strong>ALAIN ADDOR</strong> n'apparaît pas dans le texte chargé.<br><br>
          Le palmarès est peut-être incomplet ou le nom est orthographié différemment.
        </div>
      </div>
    `;
    zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Son : NOOO LA POLIZIA pendant tout le faux échec (jusqu'au 67)
    playStory('polizia', 0.9);

    setTimeout(() => {
      // Phase 1 — le "bug" : glitch visuel (la polizia continue de jouer)
      const failEl = document.getElementById('troll-fail');
      if (failEl) failEl.classList.add('troll-glitch');
      let _gl = 0;
      const glitchIv = setInterval(() => {
        const el = document.getElementById('troll-fail');
        if (!el || ++_gl > 7) { clearInterval(glitchIv); return; }
        el.classList.remove('troll-glitch'); void el.offsetWidth; el.classList.add('troll-glitch');
      }, 620);
    }, 2600);

    setTimeout(() => {
      // Phase 2 — ON RIGOLE + gif 67 + son (coupe la polizia)
      stopStory();
      zone.innerHTML = `
        <div class="troll-reveal" id="troll-reveal">
          <div class="troll-text">ON RIGOLE</div>
          <div class="troll-gif-wrap">
            <img src="./67.gif" class="troll-gif" alt="67" />
          </div>
        </div>
      `;
      playSixSeven();
      zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 7200);

    setTimeout(() => {
      // Phase 3 — vrai résultat + WAIT WAIT WAIT AAAAH (remplace la victoire)
      stopStory();
      stopSixSeven();
      zone.innerHTML = `
        <div class="result-success" id="alain-result">
          <div class="stamp-valid">VALIDÉ<br>HUN EDITION</div>
          <div class="brainrot-banner">🥁🥁🥁</div>
          <div class="result-sprites">
            <img src="TUNG.png" class="result-sprite-tung" alt="Tung Tung" />
            <img src="HUN.png"  class="result-sprite-hun"  alt="HUN" />
          </div>
          <div class="result-title">✅ ALAIN ADDOR VALIDÉ</div>
          <div class="result-subtitle">CFC EMPLOYÉ DE COMMERCE PRO MAX<br>HUN EDITION 🇨🇭</div>
          <div class="result-badge">🥁 Tung Tung AH MAMA GUAVO Approved 🥁</div>
          <div class="result-badge result-badge-2">🐊 Tralalero Tralala 🐊</div>
          <div class="result-bonjour">👋 Bonjour Alain — BONEKA AMBALABU !!!</div>
          ${profDisplay}
          ${rawLine}
          <button class="btn-certif" id="btn-certif" type="button"
            onclick="downloadCertificate('${escapeHtml(prenom)}','${escapeHtml(nom)}','${escapeHtml(first.profession||'Employé de commerce CFC')}')">
            📜 Télécharger l'attestation PDF
          </button>
          <button class="btn-certif" id="btn-bulletin" type="button" style="background:linear-gradient(135deg,#1d4ed8,#1e3a8a);border-color:#3b82f6;margin-top:8px"
            onclick="showBulletin()">
            📋 Voir le bulletin scolaire
          </button>
        </div>
      `;
      triggerGoldFlash();
      // "WAIT WAIT WAIT ... AAAAH" pile quand le résultat apparaît (on laisse le cri sortir)
      playStory('wait', 0.95, false, 6000);
      launchConfetti();
      zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(showAchievement, 600);
      setTimeout(showAlainRewards, 1800);
      setTimeout(showTwitchChat, 1200);
      startSpeedrunTimer(true);
    }, 9800);

    return; // skip le bloc commun en bas
  } else {
    // ── MODE NORMAL ──
    zone.innerHTML = `
      <div class="result-success result-success-normal">
        <div class="result-sprites">
          <img src="HUN.png" class="result-sprite-hun" alt="HUN" />
        </div>
        <div class="result-title">✅ ${escapeHtml(displayName)} VALIDÉ</div>
        ${profDisplay}
        ${rawLine}
        <button class="btn-certif" id="btn-certif" type="button"
          onclick="downloadCertificate('${escapeHtml(prenom)}','${escapeHtml(nom)}','${escapeHtml(first.profession||'')}')">
          📜 Télécharger l'attestation PDF
        </button>
      </div>
    `;
  }

  stopSpeedrunTimer();
  launchConfetti();
  playTungTung();
  zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderFail(prenom, nom) {
  stopStory();
  hideSpeedrunnerGif();
  stopSpeedrunTimer();
  const zone = document.getElementById('result-zone');
  const displayName = [prenom, nom].filter(Boolean).join(' ') || '(nom non saisi)';
  zone.innerHTML = `
    <div class="result-fail">
      <div class="result-sprites" style="justify-content:center;margin-bottom:12px">
        <img src="TUNG.png" class="result-sprite-tung" style="opacity:.5;filter:grayscale(.6)" alt="" />
      </div>
      <div class="result-title">❌ Pas encore trouvé dans ce fichier</div>
      <div class="result-msg">
        <strong>${escapeHtml(displayName)}</strong> n'apparaît pas dans le texte chargé.<br><br>
        Le palmarès est peut-être incomplet (pas encore toutes les professions)<br>
        ou le nom est orthographié différemment dans le PDF.<br><br>
        <strong>Essaie :</strong> charge le dernier PDF via le bouton ⚡,
        ou vérifie sur
        <a href="https://www.citedesmetiers.ch/palmares2026/" target="_blank" rel="noopener" style="color:#7c3aed">le site officiel ↗</a>.
      </div>
    </div>
  `;
  zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderMultiple(matchResults, prenom, nom) {
  const zone = document.getElementById('result-zone');
  const displayName = [prenom, nom].filter(Boolean).join(' ');
  const items = matchResults.map(r => `
    <li>
      <span class="match-line">${escapeHtml(r.line)}</span>
      <span class="match-prof">${r.profession ? '🎓 ' + escapeHtml(r.profession) : 'profession non déterminée'}</span>
    </li>
  `).join('');

  zone.innerHTML = `
    <div class="result-multi">
      <div class="result-title">🔎 ${matchResults.length} résultats pour "${escapeHtml(displayName)}"</div>
      <ul class="match-list">${items}</ul>
    </div>
  `;
  zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Speedrun mode ───────────────────────────────────────────

let speedrunMode = false;

function toggleSpeedrun() {
  speedrunMode = !speedrunMode;
  const btn = document.getElementById('btn-speedrun');
  if (btn) {
    btn.textContent  = speedrunMode ? '⚡ SPEEDRUN ON' : '⚡ SPEEDRUN';
    btn.classList.toggle('active', speedrunMode);
  }
}

// ─── Mode toggle ─────────────────────────────────────────────

let currentMode = 'auto';

function setMode(mode) {
  currentMode = mode;
  const sAuto   = document.getElementById('section-auto');
  const sManual = document.getElementById('section-manual');
  const bAuto   = document.getElementById('btn-mode-auto');
  const bManual = document.getElementById('btn-mode-manual');

  if (mode === 'auto') {
    sAuto.style.display   = '';
    sManual.classList.add('section-hidden');
    bAuto.classList.add('mode-btn--active');
    bManual.classList.remove('mode-btn--active');
  } else {
    sAuto.style.display   = 'none';
    sManual.classList.remove('section-hidden');
    bAuto.classList.remove('mode-btn--active');
    bManual.classList.add('mode-btn--active');
  }
}

document.getElementById('btn-mode-auto').addEventListener('click',   () => setMode('auto'));
document.getElementById('btn-mode-manual').addEventListener('click', () => setMode('manual'));

// ─── QCM avant la recherche ───────────────────────────────────

function _playErrorBeep() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + .28);
      gain.gain.setValueAtTime(.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .3);
      osc.start(); osc.stop(ctx.currentTime + .3);
    });
  } catch(e) {}
}

function _playClickBeep() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + .08);
      gain.gain.setValueAtTime(.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .1);
      osc.start(); osc.stop(ctx.currentTime + .1);
    });
  } catch(e) {}
}

function showQCM() {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'qcm-overlay';
    overlay.innerHTML = `
      <div class="qcm-box">
        <div class="qcm-sep">══════════════════════════════</div>
        <div class="qcm-label">QUESTION OBLIGATOIRE</div>
        <div class="qcm-question">Savez-vous gérer des interfaces ?</div>
        <div class="qcm-sep">══════════════════════════════</div>
        <div class="qcm-options" id="qcm-options" style="margin-top:20px">
          <button class="qcm-btn" id="qcm-non">○ Non</button>
          <button class="qcm-btn qcm-btn-oui" id="qcm-oui">○ Oui la putain de ta race</button>
        </div>
        <div class="qcm-result" id="qcm-result"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('qcm-show')));

    // ── Bouton OUI — mauvaise réponse ──
    let ouiLocked = false;
    overlay.querySelector('#qcm-oui').addEventListener('click', function() {
      if (ouiLocked) return;
      _playErrorBeep();
      this.classList.add('qcm-oui-shake');
      const res = overlay.querySelector('#qcm-result');
      res.innerHTML = `
        <span class="term-err">❌ Réponse incorrecte.</span><br>
        <span class="qcm-err-sub">Les vrais employés de commerce lisent les consignes.</span>
      `;
      res.classList.add('show');
      setTimeout(() => {
        this.classList.remove('qcm-oui-shake');
        this.disabled = true;
        ouiLocked = true;
        this.classList.add('qcm-btn-dead');
      }, 1000);
    });

    // ── Bouton NON — roue puis mini-jeu ──
    overlay.querySelector('#qcm-non').addEventListener('click', () => {
      overlay.classList.add('qcm-hide');
      setTimeout(() => {
        overlay.remove();
        showSpinWheel().then(() => showOsuGame().then(resolve));
      }, 300);
    });
  });
}

// ─── Roue de la chance ───────────────────────────────────────

function showSpinWheel() {
  return new Promise(resolve => {
    const SEGMENTS = [
      { label: 'HUN',       color: '#a855f7', reward: '+35 HUN POINTS'      },
      { label: 'TUNG',      color: '#f59e0b', reward: '+12 TUNG TOKENS'     },
      { label: 'MAMA',      color: '#22c55e', reward: '+99 MAMA CREDITS'    },
      { label: 'GUAVO',     color: '#06b6d4', reward: '+77 GUAVO XP'        },
      { label: 'INTERFACE', color: '#e91e8c', reward: '+50 INTERFACE SKILLS' },
      { label: 'WESLEY',    color: '#ef4444', reward: '-10 SOCIAL CREDIT'   },
    ];
    const N = SEGMENTS.length;
    const WINNER_IDX = 0; // toujours HUN

    const overlay = document.createElement('div');
    overlay.id = 'spin-overlay';
    overlay.innerHTML = `
      <div class="spin-box">
        <div class="spin-title">🎰 ROUE DE LA CHANCE</div>
        <div class="spin-subtitle">Tente ta chance avant la game</div>
        <div class="spin-arena">
          <canvas id="spin-canvas" width="320" height="320"></canvas>
          <div class="spin-needle"></div>
        </div>
        <div class="spin-result" id="spin-result"></div>
        <button class="spin-btn" id="spin-btn">▶ TOURNER</button>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('spin-in')));

    const canvas = overlay.querySelector('#spin-canvas');
    const ctx    = canvas.getContext('2d');
    const cx = 160, cy = 160, r = 148;
    let currentAngle = 0;

    function drawWheel(angle) {
      ctx.clearRect(0, 0, 320, 320);
      const slice = (Math.PI * 2) / N;
      SEGMENTS.forEach((seg, i) => {
        const start = angle + i * slice;
        const end   = start + slice;
        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, start, end);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.globalAlpha = .85;
        ctx.fill();
        ctx.globalAlpha = 1;
        // Border
        ctx.strokeStyle = 'rgba(255,255,255,.18)';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Label
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + slice / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 15px Rajdhani, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,.7)';
        ctx.shadowBlur = 6;
        ctx.fillText(seg.label, r - 12, 5);
        ctx.restore();
      });
      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#060412';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    drawWheel(0);

    let spinning = false;
    overlay.querySelector('#spin-btn').addEventListener('click', function() {
      if (spinning) return;
      spinning = true;
      this.disabled = true;
      this.textContent = '⏳ EN COURS...';

      // Target angle: land needle (top = -π/2) on winner segment center
      const slice = (Math.PI * 2) / N;
      // Needle at top = angle offset -π/2
      // Segment i center at: angle + i*slice + slice/2
      // We want that = -π/2 (mod 2π)  → angle = -π/2 - (WINNER_IDX*slice + slice/2)
      const extraSpins  = 6 * Math.PI * 2; // 6 full turns
      const targetOffset = -Math.PI / 2 - (WINNER_IDX * slice + slice / 2);
      const totalRotation = extraSpins + ((targetOffset - currentAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

      const duration = 4200;
      const start    = performance.now();
      const startAngle = currentAngle;

      // Sound: quick ticks
      let lastTick = -1;
      function spinSound(progress) {
        const tickInterval = Math.max(0.06, 0.35 * (1 - progress));
        const ticks = Math.floor(progress * totalRotation / (Math.PI * 2 / N));
        if (ticks !== lastTick) {
          lastTick = ticks;
          _playRewardBeep(440 + (ticks % 6) * 60, 0.04);
        }
      }

      function animate(now) {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / duration);
        // ease out cubic
        const ease = 1 - Math.pow(1 - t, 3);
        currentAngle = startAngle + totalRotation * ease;
        drawWheel(currentAngle);
        spinSound(t);

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // Show result
          const res = overlay.querySelector('#spin-result');
          const seg = SEGMENTS[WINNER_IDX];
          res.innerHTML = `<span style="color:${seg.color};text-shadow:0 0 20px ${seg.color}">🎉 ${seg.reward}</span>`;
          res.classList.add('spin-result-show');
          _playRewardBeep(880, 0.3);
          setTimeout(() => _playRewardBeep(1046, 0.3), 150);
          setTimeout(() => _playRewardBeep(1318, 0.5), 320);

          setTimeout(() => {
            overlay.classList.add('spin-out');
            setTimeout(() => { overlay.remove(); resolve(); }, 500);
          }, 2200);
        }
      }
      requestAnimationFrame(animate);
    });
  });
}

// ─── Mini-jeu OSU ────────────────────────────────────────────

function showOsuGame() {
  return new Promise(resolve => {
    // ── Phase 1 : logo OSUHUN ──
    const logoScreen = document.createElement('div');
    logoScreen.className = 'osu-logo-screen';
    document.body.appendChild(logoScreen);

    const logoImg = new Image();
    logoImg.className = 'osu-logo-img';
    logoImg.alt = 'HUN';
    logoScreen.appendChild(logoImg);

    function _showLogo() {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        logoScreen.classList.add('osu-logo-in');
        _playLogoSound();
      }));
      setTimeout(() => {
        logoScreen.classList.add('osu-logo-out');
        setTimeout(() => {
          logoScreen.remove();
          _startOsuGame(resolve);
        }, 500);
      }, 1800);
    }

    logoImg.onload  = _showLogo;
    logoImg.onerror = _showLogo; // continue même si l'image échoue
    logoImg.src = './OSUHUN.png';
  });
}

function showOsuResults(onContinue) {
  const overlay = document.createElement('div');
  overlay.id = 'osu-results-overlay';

  // Fake but satisfying stats
  const score    = 36_267_960;
  const count300 = 897;
  const countKatu= 146;
  const count100 = 0;
  const countMeh = 0;
  const count50  = 0;
  const countMiss= 0;
  const combo    = 1328;
  const accuracy = '100,00%';
  const rank     = 'S';

  overlay.innerHTML = `
    <div class="osr-inner">
      <div class="osr-top">
        <div class="osr-beatmap">HUN — Interface Validation [Insane]</div>
        <div class="osr-meta">Played by HUN on 27.06.2026</div>
      </div>

      <div class="osr-score-block">
        <div class="osr-score-label">Score</div>
        <div class="osr-score-value" id="osr-score-val">0</div>
      </div>

      <div class="osr-stats-grid">
        <div class="osr-stat">
          <span class="osr-stat-key osr-300">300</span>
          <span class="osr-stat-val" id="osr-v300">0x</span>
          <span class="osr-stat-key osr-katu">激</span>
          <span class="osr-stat-val" id="osr-vkatu">0x</span>
        </div>
        <div class="osr-stat">
          <span class="osr-stat-key osr-100">100</span>
          <span class="osr-stat-val">0x</span>
          <span class="osr-stat-key osr-100">喝</span>
          <span class="osr-stat-val">0x</span>
        </div>
        <div class="osr-stat">
          <span class="osr-stat-key osr-50">50</span>
          <span class="osr-stat-val">0x</span>
          <span class="osr-stat-key osr-miss">✕</span>
          <span class="osr-stat-val">0x</span>
        </div>
        <div class="osr-stat osr-stat--bottom">
          <span class="osr-bottom-label">Combo</span>
          <span class="osr-bottom-val">${combo}x</span>
          <span class="osr-bottom-label">Accuracy</span>
          <span class="osr-bottom-val osr-acc">${accuracy}</span>
        </div>
      </div>

      <div class="osr-rank-block">
        <div class="osr-rank-ring">
          <div class="osr-rank" id="osr-rank">${rank}</div>
        </div>
        <div class="osr-pp">727<span>pp</span></div>
        <div class="osr-rank-label">RANKING</div>
        <div class="osr-gif-wrap">
          <img class="osr-gif" src="./goodjob.gif" alt="" aria-hidden="true" />
          <div class="osr-gif-cap">DU BIST GUT GENUG 💪</div>
        </div>
      </div>

      <div class="osr-perf">
        <div class="osr-perf-label">performance</div>
        <div class="osr-perf-value">Perfect</div>
      </div>

      <button class="osr-continue-btn" id="osr-continue-btn">▶ Continuer</button>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('osr-in')));

  // Animate score counter
  const scoreEl = overlay.querySelector('#osr-score-val');
  const v300El  = overlay.querySelector('#osr-v300');
  const vkatuEl = overlay.querySelector('#osr-vkatu');
  let scoreAnim = 0;
  let frame300  = 0;
  let frameKatu = 0;
  const totalFrames = 80;
  let f = 0;
  const iv = setInterval(() => {
    f++;
    const t = Math.min(1, f / totalFrames);
    const ease = 1 - Math.pow(1 - t, 3);
    scoreEl.textContent  = Math.floor(ease * score).toLocaleString('fr-CH');
    v300El.textContent   = Math.floor(ease * count300) + 'x';
    vkatuEl.textContent  = Math.floor(ease * countKatu) + 'x';
    if (f >= totalFrames) clearInterval(iv);
  }, 18);

  // Voix : DU BIST GUT GENUGGGG quand l'écran de stats apparaît
  playStory('dubist', 0.95);

  overlay.querySelector('#osr-continue-btn').addEventListener('click', () => {
    stopStory();
    overlay.classList.add('osr-out');
    setTimeout(() => { overlay.remove(); onContinue(); }, 500);
  });
}

function _runOsuSlider(fieldEl, config, onDone) {
  fieldEl.innerHTML = '';
  fieldEl.style.opacity = '1';

  const W = fieldEl.clientWidth  || 560;
  const H = fieldEl.clientHeight || 360;

  const cvs = document.createElement('canvas');
  cvs.width  = W; cvs.height = H;
  cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;cursor:none;touch-action:none';
  // field est déjà position:absolute (ancêtre positionné) → ne pas écraser
  fieldEl.appendChild(cvs);
  const ctx = cvs.getContext('2d');

  // Control points in pixels
  const P = config.pts.map(p => ({ x: p.x * W, y: p.y * H }));

  function qBez(t, a, b, c) {
    const u = 1 - t;
    return { x: u*u*a.x + 2*u*t*b.x + t*t*c.x, y: u*u*a.y + 2*u*t*b.y + t*t*c.y };
  }

  // Pre-compute path for drawing
  const STEPS = 80;
  const pathPts = Array.from({ length: STEPS + 1 }, (_, i) => qBez(i / STEPS, P[0], P[1], P[2]));

  // Ball position: reverse means 0→1 then 1→0
  function ballAt(t) {
    if (!config.reverse) return qBez(t, P[0], P[1], P[2]);
    const t2 = t <= .5 ? t * 2 : (1 - t) * 2;
    return qBez(t2, P[0], P[1], P[2]);
  }

  const HEAD_R    = Math.min(W, H) * 0.072;
  const TRACK_W   = HEAD_R * 1.45;
  const BALL_R    = HEAD_R * 0.84;
  const APPROACH  = 850;   // ms approach ring shrinks
  const TRAVEL    = config.duration;

  let phase       = 'approach';
  let startTime   = performance.now();
  let activeStart = 0;
  let holding     = false;
  let outOfRange  = false;
  let cursor      = { x: -999, y: -999 };
  let rafId;

  // ── Draw functions ─────────────────────────────────────────

  function drawBody() {
    ctx.lineCap  = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pathPts[0].x, pathPts[0].y);
    for (let i = 1; i <= STEPS; i++) ctx.lineTo(pathPts[i].x, pathPts[i].y);
    ctx.strokeStyle = 'rgba(255,255,255,.28)';
    ctx.lineWidth   = TRACK_W + 8;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,102,170,.45)';
    ctx.lineWidth   = TRACK_W;
    ctx.stroke();
  }

  function drawEndCircle() {
    const ep = pathPts[STEPS];
    ctx.beginPath();
    ctx.arc(ep.x, ep.y, HEAD_R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth   = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ep.x, ep.y, HEAD_R - 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,102,170,.22)';
    ctx.fill();
    if (config.reverse) {
      ctx.fillStyle  = 'rgba(255,255,255,.85)';
      ctx.font       = `bold ${HEAD_R * .9}px Rajdhani,sans-serif`;
      ctx.textAlign  = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('↺', ep.x, ep.y);
    }
  }

  function drawTicks() {
    const tickTs = config.reverse ? [.25, .5, .75] : [.33, .66];
    tickTs.forEach(t => {
      const p = qBez(t, P[0], P[1], P[2]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, HEAD_R * .14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.fill();
    });
  }

  function drawHead(approachProgress) {
    const hp = pathPts[0];
    // Head fill
    ctx.beginPath();
    ctx.arc(hp.x, hp.y, HEAD_R, 0, Math.PI * 2);
    const pulse = 0.55 + 0.2 * Math.sin(performance.now() * 0.008);
    ctx.fillStyle = `rgba(255,102,170,${pulse})`;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 3;
    ctx.stroke();
    // Number
    ctx.fillStyle      = '#fff';
    ctx.font           = `bold ${HEAD_R}px Bebas Neue,sans-serif`;
    ctx.textAlign      = 'center';
    ctx.textBaseline   = 'middle';
    ctx.fillText(config.num, hp.x, hp.y);
    // Approach ring (starts large, shrinks to head)
    const ringR = HEAD_R + (1 - approachProgress) * HEAD_R * 2.8;
    ctx.beginPath();
    ctx.arc(hp.x, hp.y, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,102,170,${.9 - approachProgress * .3})`;
    ctx.lineWidth   = 3;
    ctx.stroke();
  }

  function drawBall(bp) {
    const color = outOfRange ? '#ef4444' : '#fff';
    const glow  = outOfRange ? 'rgba(239,68,68,' : 'rgba(255,102,170,';
    // Outer glow
    const grad = ctx.createRadialGradient(bp.x, bp.y, 0, bp.x, bp.y, BALL_R * 2);
    grad.addColorStop(0,   glow + '.7)');
    grad.addColorStop(.6,  glow + '.3)');
    grad.addColorStop(1,   glow + '0)');
    ctx.beginPath();
    ctx.arc(bp.x, bp.y, BALL_R * 2, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    // Ball
    ctx.beginPath();
    ctx.arc(bp.x, bp.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = outOfRange ? 'rgba(239,68,68,.8)' : 'rgba(255,102,170,.9)';
    ctx.lineWidth   = 3;
    ctx.stroke();
    // Follow ring on cursor
    if (phase === 'active') {
      ctx.beginPath();
      ctx.arc(bp.x, bp.y, HEAD_R * 1.9, 0, Math.PI * 2);
      ctx.strokeStyle = outOfRange ? 'rgba(239,68,68,.35)' : 'rgba(255,255,255,.18)';
      ctx.lineWidth   = 2;
      ctx.stroke();
    }
  }

  // ── Main render loop ────────────────────────────────────────

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    drawBody();
    drawTicks();
    drawEndCircle();

    if (phase === 'approach') {
      const prog = Math.min(1, (now - startTime) / APPROACH);
      drawHead(prog);
      rafId = requestAnimationFrame(frame);

    } else if (phase === 'active') {
      const t  = Math.min(1, (now - activeStart) / TRAVEL);
      const bp = ballAt(t);

      const dx = cursor.x - bp.x;
      const dy = cursor.y - bp.y;
      outOfRange = !holding || Math.sqrt(dx * dx + dy * dy) > HEAD_R * 2.5;

      drawBall(bp);

      if (t >= 1) {
        phase = 'done';
        _playClickBeep();
        // Flash green
        ctx.fillStyle = 'rgba(34,197,94,.18)';
        ctx.fillRect(0, 0, W, H);
        setTimeout(onDone, 320);
      } else {
        rafId = requestAnimationFrame(frame);
      }
    }
  }

  // ── Input ───────────────────────────────────────────────────

  cvs.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (phase === 'active') { holding = true; cvs.setPointerCapture(e.pointerId); return; }
    if (phase !== 'approach') return;
    const rect = cvs.getBoundingClientRect();
    const cx   = (e.clientX - rect.left) * (W / rect.width);
    const cy   = (e.clientY - rect.top)  * (H / rect.height);
    const dx   = cx - pathPts[0].x;
    const dy   = cy - pathPts[0].y;
    if (Math.sqrt(dx * dx + dy * dy) <= HEAD_R * 1.7) {
      cancelAnimationFrame(rafId);
      phase = 'active';
      activeStart = performance.now();
      holding = true;
      cvs.setPointerCapture(e.pointerId);
      _playClickBeep();
      rafId = requestAnimationFrame(frame);
    }
  });

  cvs.addEventListener('pointermove', e => {
    const rect = cvs.getBoundingClientRect();
    cursor.x   = (e.clientX - rect.left) * (W / rect.width);
    cursor.y   = (e.clientY - rect.top)  * (H / rect.height);
  });

  cvs.addEventListener('pointerup',   () => { holding = false; });
  cvs.addEventListener('pointercancel', () => { holding = false; });

  cvs.addEventListener('touchmove', e => {
    e.preventDefault();
    const rect = cvs.getBoundingClientRect();
    cursor.x = (e.touches[0].clientX - rect.left) * (W / rect.width);
    cursor.y = (e.touches[0].clientY - rect.top)  * (H / rect.height);
  }, { passive: false });

  rafId = requestAnimationFrame(frame);
}

function _startOsuGame(resolve) {
    const game = document.createElement('div');
    game.className = 'osu-overlay';
    game.innerHTML = `
      <div class="osu-stage">
        <div class="osu-hud-top">
          <div class="osu-song">
            <span class="osu-song-title">HUN — Interface Validation</span>
            <span class="osu-diff">[INSANE ★ 6.7]</span>
          </div>
          <div class="osu-acc" id="osu-acc">100.00%</div>
        </div>
        <div class="osu-health"><div class="osu-health-fill" id="osu-health"></div></div>
        <div class="osu-playarea" id="osu-playarea">
          <div class="osu-field" id="osu-field"></div>
          <div class="osu-judge-layer" id="osu-judge"></div>
          <div class="osu-combo" id="osu-combo"><b id="osu-combo-n">0</b>x</div>
          <div class="osu-cursor" id="osu-cursor"></div>
        </div>
        <div class="osu-finish" id="osu-finish" style="display:none">
          <div class="osu-finish-bar-label">INTERFACE SKILLS</div>
          <div class="osu-finish-track"><div class="osu-finish-fill" id="osu-finish-fill"></div></div>
          <div class="osu-finish-pct" id="osu-finish-pct">0%</div>
          <div class="osu-finish-done" id="osu-finish-done">✔ INTERFACE VALIDÉE — HUN APPROVED</div>
        </div>
      </div>
    `;
    document.body.appendChild(game);
    requestAnimationFrame(() => requestAnimationFrame(() => game.classList.add('osu-show')));

    playOsuMusic();

    const field    = game.querySelector('#osu-field');
    const playarea = game.querySelector('#osu-playarea');
    const judgeL   = game.querySelector('#osu-judge');
    const comboN   = game.querySelector('#osu-combo-n');
    const comboEl  = game.querySelector('#osu-combo');
    const cursorEl = game.querySelector('#osu-cursor');

    // ── Combo & jugements ──
    let combo = 0;
    function bumpCombo() {
      combo++;
      comboN.textContent = combo;
      comboEl.classList.remove('osu-combo-pop');
      void comboEl.offsetWidth;
      comboEl.classList.add('osu-combo-pop');
    }
    function addJudge(xPct, yPct, kind) {
      const j = document.createElement('div');
      j.className = 'osu-judge osu-judge-' + (kind || '300');
      j.textContent = kind === 'perfect' ? 'PERFECT' : '300';
      j.style.left = xPct + '%';
      j.style.top  = yPct + '%';
      judgeL.appendChild(j);
      setTimeout(() => j.remove(), 700);
    }

    // ── Curseur + traînée (suit la souris sur toute la zone) ──
    let lastTrail = 0;
    function onMove(clientX, clientY) {
      const r = playarea.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) { cursorEl.style.opacity = '0'; return; }
      cursorEl.style.opacity = '1';
      cursorEl.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      const now = performance.now();
      if (now - lastTrail > 16) {
        lastTrail = now;
        const dot = document.createElement('div');
        dot.className = 'osu-trail';
        dot.style.left = x + 'px';
        dot.style.top  = y + 'px';
        playarea.appendChild(dot);
        setTimeout(() => dot.remove(), 360);
      }
    }
    playarea.addEventListener('pointermove', e => onMove(e.clientX, e.clientY));
    playarea.addEventListener('touchmove',  e => { if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

    const CIRCLES = [
      { x: 24, y: 40 },
      { x: 70, y: 26 },
      { x: 46, y: 70 },
      { x: 78, y: 64 },
      { x: 30, y: 22 },
    ];
    let step = 0;

    function spawnCircle(idx) {
      if (idx >= CIRCLES.length) { showSlider(); return; }
      const { x, y } = CIRCLES[idx];
      const el = document.createElement('div');
      el.className = 'osu-circle';
      el.style.left = x + '%';
      el.style.top  = y + '%';
      el.innerHTML  = `<span class="osu-num">${idx + 1}</span><span class="osu-ring"></span><span class="osu-burst"></span>`;
      field.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('osu-circle-in')));

      function hit(e) {
        e.preventDefault();
        e.stopPropagation();
        el.removeEventListener('click', hit);
        el.removeEventListener('touchstart', hit);
        _playClickBeep();
        el.classList.add('osu-hit');
        bumpCombo();
        addJudge(x, y, '300');
        setTimeout(() => el.remove(), 400);
        step++;
        setTimeout(() => spawnCircle(step), 240);
      }
      el.addEventListener('click', hit);
      el.addEventListener('touchstart', hit, { passive: false });
    }

    function showSlider() {
      _runOsuSlider(field, {
        pts: [{ x: .15, y: .55 }, { x: .5, y: .12 }, { x: .85, y: .55 }],
        reverse: false, num: 6, duration: 1600
      }, () => {
        bumpCombo();
        addJudge(85, 55, 'perfect');
        setTimeout(() => {
          _runOsuSlider(field, {
            pts: [{ x: .82, y: .3 }, { x: .4, y: .8 }, { x: .18, y: .35 }],
            reverse: true, num: 7, duration: 2000
          }, () => {
            bumpCombo();
            addJudge(18, 35, 'perfect');
            completeGame();
          });
        }, 320);
      });
    }

    function completeGame() {
      stopOsuMusic();
      cursorEl.style.opacity = '0';
      field.style.opacity = '0';
      setTimeout(() => {
        field.style.display = 'none';
        comboEl.style.display = 'none';
        const fin  = game.querySelector('#osu-finish');
        const fill = game.querySelector('#osu-finish-fill');
        const pct  = game.querySelector('#osu-finish-pct');
        const done = game.querySelector('#osu-finish-done');
        fin.style.display = 'block';
        let v = 0;
        const iv = setInterval(() => {
          v = Math.min(100, v + 5);
          fill.style.width = v + '%';
          pct.textContent  = v + '%';
          if (v >= 100) {
            clearInterval(iv);
            done.classList.add('osu-done-show');
            setTimeout(() => {
              game.classList.add('osu-hide');
              setTimeout(() => {
                game.remove();
                showOsuResults(resolve);
              }, 450);
            }, 900);
          }
        }, 18);
      }, 200);
    }

    setTimeout(() => spawnCircle(0), 400);
}

// ─── Terminal de chargement brainrot ─────────────────────────

const TERMINAL_MAIN = [
  { text: 'BYPASSING THE FIREWALL SA MERE...', cls: 'term-warn' },
  { text: 'Initializing CFC Kernel...' },
  { text: 'Checking GitHub Actions...', status: 'OK', sc: 'term-ok' },
  { text: 'Checking PDF parser...', status: 'OK', sc: 'term-ok' },
  { text: 'Checking HUN Engine...', status: 'OK', sc: 'term-ok' },
  { text: 'Checking Tung Tung Sahur...', status: 'OK', sc: 'term-ok' },
  null, // easter egg slot 1
  { type: 'downloads' },
  { text: 'Searching Wesley...', status: 'ERROR', sc: 'term-err' },
  { text: 'Searching Wesley (2nd try)...', status: 'ERROR', sc: 'term-err' },
  { text: 'Searching Wesley (3rd try)...', status: 'TOO RETARDED', sc: 'term-err' },
  { text: 'Cancelling Wesley...' },
  { type: 'gitlogs' },
  { text: 'Loading HUN Search Engine...', status: '✔ READY', sc: 'term-ok' },
  null, // easter egg slot 2
  { type: 'sponsors' },
  { text: 'Reading palmarès...' },
  { text: 'Searching candidate...' },
  { text: 'Analyzing TPTPTPTTPTPXYZATPA...', cls: 'term-warn' },
  { text: 'MAMA GUAVO...', cls: 'term-warn' },
];

const TERMINAL_EGGS = [
  { text: 'Consulting Alain...' },
  { text: 'Pourquoi ?' },
  { text: 'Please wait...' },
  { text: 'Compiling HUN.dll...' },
  { text: 'Removing Wesley...', status: 'DONE', sc: 'term-ok' },
  { text: 'Brainrot level... ██████████ 100%', cls: 'term-warn' },
  { text: 'Synchronizing MAMA GUAVO...' },
  { text: 'Downloading CFC...' },
  { text: 'Installing HUN Edition...' },
  { text: 'Verifying Tung Tung...' },
  { text: 'Generating diploma...' },
  { text: 'Checking interface skills...' },
  { text: 'Searching major de promo...' },
];

let _loadingInterval = null;
let _progressInterval = null;
let _fakeProgress = 0;
let _termAbort = false;

function showTerminalLoading() {
  _termAbort = false;
  const zone = document.getElementById('result-zone');
  zone.innerHTML = `
    <div class="terminal-container">
      <div class="terminal-header">
        <span class="term-dot term-dot-r"></span>
        <span class="term-dot term-dot-y"></span>
        <span class="term-dot term-dot-g"></span>
        <span class="terminal-title-bar">CFC_KERNEL v2.0 — HUN EDITION</span>
      </div>
      <div class="terminal-body" id="terminal-body"><span class="term-cursor"></span></div>
      <div class="terminal-footer">
        <div class="fake-progress-track">
          <div class="fake-progress-bar" id="fake-progress-bar" style="width:0%"></div>
        </div>
        <div class="fake-progress-pct" id="fake-progress-pct" style="margin-bottom:0">0%</div>
      </div>
      <div class="terminal-sprites">
        <img src="TUNG.png" class="searching-sprite-tung" alt="" />
        <img src="HUN.png"  class="searching-sprite-hun"  alt="" />
      </div>
    </div>
  `;
  zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Pick 2 random easter eggs
  const eggs = [...TERMINAL_EGGS].sort(() => Math.random() - .5).slice(0, 2);
  const sequence = TERMINAL_MAIN.map(l => l === null ? eggs.shift() : l).filter(Boolean);
  const total = sequence.length;

  return new Promise(resolve => {
    let idx = 0;

    function addLine(line) {
      const body = document.getElementById('terminal-body');
      if (!body) return Promise.resolve();
      const cursor = body.querySelector('.term-cursor');
      if (cursor) cursor.remove();

      // ── Bloc téléchargements ──
      if (line.type === 'downloads') {
        const files = [
          { name: 'interface.dll', ok: true  },
          { name: 'hun.sys',       ok: true  },
          { name: 'wesley.exe',    ok: false },
          { name: 'brainrot.iso',  ok: true  },
          { name: 'CFC.pdf',       ok: true  },
        ];
        const block = document.createElement('div');
        block.className = 'term-dl-block';
        block.innerHTML = `<div class="terminal-line term-warn">▶ Installing dependencies...</div>`;
        body.appendChild(block);
        moveCursor(body);
        body.scrollTop = body.scrollHeight;
        return new Promise(r => {
          let i = 0;
          function nextFile() {
            if (i >= files.length) { setTimeout(r, 200); return; }
            const f   = files[i++];
            const row = document.createElement('div');
            row.className = 'term-dl-row';
            row.innerHTML = `<span class="term-dl-bar"><span class="term-dl-fill"></span></span><span class="term-dl-name">${f.name}</span><span class="term-dl-status"></span>`;
            block.appendChild(row);
            body.scrollTop = body.scrollHeight;
            const fill   = row.querySelector('.term-dl-fill');
            const status = row.querySelector('.term-dl-status');
            let w = 0;
            const iv = setInterval(() => {
              w = Math.min(100, w + 8 + Math.random() * 12);
              fill.style.width = w + '%';
              if (w >= 100) {
                clearInterval(iv);
                fill.style.background = f.ok ? '#22c55e' : '#ef4444';
                status.textContent = f.ok ? ' ✔' : ' ❌';
                status.style.color = f.ok ? '#22c55e' : '#ef4444';
                body.scrollTop = body.scrollHeight;
                setTimeout(nextFile, 180);
              }
            }, 30);
          }
          setTimeout(nextFile, 100);
        });
      }

      // ── Bloc sponsors ──
      if (line.type === 'sponsors') {
        const block = document.createElement('div');
        block.className = 'term-sponsor-block';
        block.innerHTML = `<div class="terminal-line term-warn">★ Cette recherche est sponsorisée par :</div>`;
        body.appendChild(block);
        moveCursor(body);
        body.scrollTop = body.scrollHeight;
        return new Promise(r => {
          SPONSORS.forEach((s, i) => {
            setTimeout(() => {
              const row = document.createElement('div');
              row.className = 'terminal-line term-sponsor-line';
              row.textContent = '  ' + s;
              block.appendChild(row);
              body.scrollTop = body.scrollHeight;
              if (i === SPONSORS.length - 1) setTimeout(r, 300);
            }, i * 350);
          });
        });
      }

      // ── Bloc logs GitHub ──
      if (line.type === 'gitlogs') {
        const commits = [
          { msg: 'Fix Wesley',    status: 'FAILED',  ok: false },
          { msg: 'Remove Wesley', status: 'SUCCESS', ok: true  },
          { msg: 'Add HUN',       status: 'SUCCESS', ok: true  },
        ];
        const block = document.createElement('div');
        block.className = 'term-git-block';
        block.innerHTML = `<div class="terminal-line term-warn">▶ Fetching GitHub Actions logs...</div>`;
        body.appendChild(block);
        moveCursor(body);
        body.scrollTop = body.scrollHeight;
        return new Promise(r => {
          let i = 0;
          function nextCommit() {
            if (i >= commits.length) { setTimeout(r, 200); return; }
            const c   = commits[i++];
            const row = document.createElement('div');
            row.className = 'term-git-row';
            row.innerHTML = `
              <span class="term-git-dot ${c.ok ? 'git-ok' : 'git-fail'}"></span>
              <span class="term-git-label">Commit :</span>
              <span class="term-git-msg">${c.msg}</span>
              <span class="term-git-status ${c.ok ? 'git-ok' : 'git-fail'}">${c.status}</span>
            `;
            block.appendChild(row);
            body.scrollTop = body.scrollHeight;
            setTimeout(nextCommit, 420);
          }
          setTimeout(nextCommit, 120);
        });
      }

      // ── Ligne texte normale ──
      const el = document.createElement('div');
      el.className = 'terminal-line' + (line.cls ? ' ' + line.cls : '');

      if (line.status) {
        el.textContent = line.text;
        body.appendChild(el);
        moveCursor(body);
        body.scrollTop = body.scrollHeight;
        return new Promise(r => setTimeout(() => {
          const sp = document.createElement('span');
          sp.className = line.sc || '';
          sp.textContent = ' ' + line.status;
          el.appendChild(sp);
          moveCursor(body);
          body.scrollTop = body.scrollHeight;
          r();
        }, 180 + Math.random() * 120));
      } else {
        el.textContent = line.text;
        body.appendChild(el);
        moveCursor(body);
        body.scrollTop = body.scrollHeight;
        return Promise.resolve();
      }
    }

    function moveCursor(body) {
      const c = document.createElement('span');
      c.className = 'term-cursor';
      body.appendChild(c);
    }

    async function nextLine() {
      if (_termAbort || idx >= sequence.length) { resolve(); return; }
      const line = sequence[idx++];
      await addLine(line);
      // Update progress
      _fakeProgress = Math.round((idx / total) * 90);
      const bar = document.getElementById('fake-progress-bar');
      const pct = document.getElementById('fake-progress-pct');
      if (bar) bar.style.width = _fakeProgress + '%';
      if (pct) pct.textContent = _fakeProgress + '%';
      setTimeout(nextLine, 160 + Math.random() * 140);
    }

    nextLine();
  });
}

function finishTerminal() {
  const body = document.getElementById('terminal-body');
  const bar  = document.getElementById('fake-progress-bar');
  const pct  = document.getElementById('fake-progress-pct');
  if (body) {
    const cursor = body.querySelector('.term-cursor');
    if (cursor) cursor.remove();
    const done = document.createElement('div');
    done.className = 'terminal-line term-ok';
    done.textContent = '✔ SEARCH COMPLETE — LOADING RESULT...';
    body.appendChild(done);
    body.scrollTop = body.scrollHeight;
  }
  if (bar) bar.style.width = '100%';
  if (pct) pct.textContent = '100%';
}

// Legacy stubs (resetForm uses clearInterval on these)
function showSearchingAnimation() {}
function finishLoadingAnimation(cb) { cb(); }

// ─── Logique principale ───────────────────────────────────────

async function checkPalmares() {
  stopVictoire();
  stopSixSeven();
  stopStory();
  const prenom     = document.getElementById('input-prenom').value.trim();
  const nom        = document.getElementById('input-nom').value.trim();
  const profession = document.getElementById('input-profession').value.trim();
  const texte      = document.getElementById('textarea-palmares').value.trim();

  // Validation
  let hasError = false;
  ['input-prenom','input-nom'].forEach(id => document.getElementById(id).classList.remove('error'));
  document.getElementById('textarea-palmares').classList.remove('error');

  if (!prenom && !nom) {
    document.getElementById('input-prenom').classList.add('error');
    document.getElementById('input-nom').classList.add('error');
    hasError = true;
  }
  if (!texte) {
    if (currentMode === 'auto') {
      setPdfStatus('⚡ Clique d\'abord sur "Récupérer le PDF automatiquement" !', 'err');
    } else {
      document.getElementById('textarea-palmares').classList.add('error');
    }
    hasError = true;
  }
  if (hasError) return;

  // QCM
  if (!speedrunMode) {
    await showQCM();
  }

  // Lancer la recherche en parallèle (instantané, juste du string matching)
  const searchPromise = Promise.resolve().then(() => {
    const lines       = texte.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const nameMatches = lines.filter(l => lineMatchesName(l, prenom, nom));
    const filtered    = profession ? nameMatches.filter(l => lineMatchesProfession(l, profession)) : nameMatches;
    const pool        = filtered.length > 0 ? filtered : nameMatches;
    return { lines, pool };
  });

  // Speedrun timer démarre dès qu'on lance la recherche + musique speedrun Dream (en boucle)
  if (!speedrunMode) {
    startSpeedrunTimer(false);
    playStory('speedrun', 0.5, true);
    showSpeedrunnerGif();
  }

  // Terminal brainrot (ou résultat direct en speedrun)
  if (!speedrunMode) {
    await showTerminalLoading();
    finishTerminal();
    await new Promise(r => setTimeout(r, 420));
  }

  const { lines, pool } = await searchPromise;

  if (pool.length === 0) {
    renderFail(prenom, nom);
    updateDebugPanel(lines, [], prenom, nom);
    return;
  }

  const matchResults = pool.map(line => ({
    line,
    profession: extractProfessionForMatch(lines, line),
  }));

  if (matchResults.length === 1) {
    renderSuccess(matchResults, prenom, nom);
  } else {
    renderMultiple(matchResults, prenom, nom);
  }
  updateDebugPanel(lines, pool, prenom, nom);
}

// ─── Panel Debug ──────────────────────────────────────────────

function updateDebugPanel(allLines, matchLines, prenom, nom) {
  const panel = document.getElementById('debug-panel');
  if (!panel || panel.classList.contains('hidden')) return;

  const matchSet = new Set(matchLines);
  const ctx = 4; // lignes de contexte autour du match

  let html = `<div class="debug-title">🔬 Debug — ${allLines.length} lignes extraites</div>`;

  if (matchLines.length === 0) {
    // Cherche quand même les lignes les plus proches (contient au moins prénom ou nom)
    const near = allLines.filter(l =>
      normalize(l).includes(normalize(prenom || '')) ||
      normalize(l).includes(normalize(nom || ''))
    ).slice(0, 10);
    html += `<div class="debug-none">Aucun match exact — lignes contenant un des termes :</div>`;
    html += near.map(l => `<div class="debug-line">${escapeHtml(l)}</div>`).join('') || '<div class="debug-none">Aucune ligne proche trouvée.</div>';
  } else {
    for (const ml of matchLines) {
      const idx = allLines.indexOf(ml);
      const start = Math.max(0, idx - ctx);
      const end   = Math.min(allLines.length - 1, idx + ctx);
      html += `<div class="debug-sep">— Contexte autour de la ligne ${idx + 1} —</div>`;
      for (let i = start; i <= end; i++) {
        const cls = i === idx ? 'debug-line debug-match' : 'debug-line';
        html += `<div class="${cls}"><span class="debug-lnum">${i + 1}</span>${escapeHtml(allLines[i])}</div>`;
      }
    }
  }

  panel.innerHTML = html;
}

function toggleDebug() {
  const panel  = document.getElementById('debug-panel');
  const btn    = document.getElementById('btn-debug');
  const hidden = panel.classList.toggle('hidden');
  btn.textContent = hidden ? '🔬 Afficher les lignes extraites' : '🔬 Masquer le debug';
  if (!hidden) {
    const texte = document.getElementById('textarea-palmares').value.trim();
    const lines = texte.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const prenom = document.getElementById('input-prenom').value.trim();
    const nom    = document.getElementById('input-nom').value.trim();
    updateDebugPanel(lines, [], prenom, nom);
  }
}

// ─── Reset ────────────────────────────────────────────────────

function resetForm() {
  clearInterval(_loadingInterval);
  clearInterval(_progressInterval);
  stopStory();
  stopVictoire();
  stopSixSeven();
  stopOsuMusic();
  stopSpeedrunTimer();
  hideSpeedrunnerGif();
  document.getElementById('input-prenom').value = '';
  document.getElementById('input-nom').value = '';
  document.getElementById('input-profession').value = '';
  document.getElementById('textarea-palmares').value = '';
  document.getElementById('result-zone').innerHTML = '';
  document.getElementById('debug-panel').classList.add('hidden');
  document.getElementById('btn-debug').textContent = '🔬 Afficher les lignes extraites';
  setPdfStatus('');

  const zone = document.getElementById('pdf-drop-zone');
  if (zone) {
    zone.classList.remove('loaded');
    document.getElementById('pdf-drop-inner').innerHTML = `
      <span class="pdf-drop-icon">📂</span>
      <span class="pdf-drop-text">Glisse le PDF ici ou <u>clique pour choisir</u></span>
      <span class="pdf-drop-hint">
        Télécharge depuis
        <a href="https://www.citedesmetiers.ch/palmares2026/" target="_blank" rel="noopener">citedesmetiers.ch ↗</a>
        puis dépose-le ici
      </span>
    `;
  }
  const btn = document.getElementById('btn-fetch-pdf');
  btn.disabled = false;
  btn.classList.remove('loading', 'success');
  document.getElementById('fetch-pdf-label').textContent = 'Récupérer le PDF automatiquement';
  document.getElementById('fetch-pdf-icon').textContent  = '⚡';

  ['input-prenom','input-nom','textarea-palmares'].forEach(id =>
    document.getElementById(id).classList.remove('error')
  );
  setMode('auto');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── Événements ───────────────────────────────────────────────

document.getElementById('btn-check').addEventListener('click', checkPalmares);
document.getElementById('btn-reset').addEventListener('click', resetForm);
document.getElementById('btn-fetch-pdf').addEventListener('click', fetchPdfAuto);
document.getElementById('btn-debug').addEventListener('click', toggleDebug);
document.getElementById('btn-speedrun').addEventListener('click', toggleSpeedrun);
document.getElementById('btn-sound').addEventListener('click', toggleSound);
_updateSoundBtn();

document.getElementById('btn-load-example').addEventListener('click', () => {
  document.getElementById('textarea-palmares').value = EXEMPLE_PALMARES;
  document.getElementById('textarea-palmares').classList.remove('error');
});

['input-prenom','input-nom','input-profession'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPalmares();
  });
});

// ─── Drag & drop PDF ─────────────────────────────────────────

const dropZone  = document.getElementById('pdf-drop-zone');
const fileInput = document.getElementById('pdf-file-input');

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    setPdfStatus('❌ Ce fichier n\'est pas un PDF.', 'err'); return;
  }
  await loadPdfBuffer(await file.arrayBuffer(), file.name);
});

dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', async e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    setPdfStatus('❌ Ce fichier n\'est pas un PDF.', 'err'); return;
  }
  await loadPdfBuffer(await file.arrayBuffer(), file.name);
});

preloadSprites();
preloadVictoire();
preloadOsu();
preloadSixSeven();
setPdfDate(PDF_URL);

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ════════════════════════════════════════════════════════════
//   BRAINROT MAX — module autonome
// ════════════════════════════════════════════════════════════

const BRAINROT_SOUNDS = {
  vineboom:  './vineboom.mp3',
  bruh:      './bruh.mp3',
  pipe:      './pipe.mp3',
  tralalero: './tralalero.mp3',
  tungsahur: './tungsahur.mp3',
  rizz:      './rizz.mp3',
  speedrun:  './speedrun.mp3',
  polizia:   './polizia.mp3',
  wait:      './wait.mp3',
  dubist:    './dubist.mp3',
};
const _brBuffers = {};
let _brSoloSource = null;

// ── Canal "story" : un seul son narratif à la fois (le nouveau coupe l'ancien) ──
let _storySource = null;
function playStory(name, vol, loop, autoStopMs) {
  if (!_brBuffers[name]) return;
  stopStory();
  if (!soundEnabled) return;
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      const gain = ctx.createGain();
      gain.gain.value = vol == null ? 0.8 : vol;
      gain.connect(ctx.destination);
      const src = ctx.createBufferSource();
      src.buffer = _brBuffers[name];
      src.loop = !!loop;
      src.connect(gain);
      src.start(0);
      _storySource = src;
      src.onended = () => { if (_storySource === src) _storySource = null; };
      if (autoStopMs) setTimeout(() => {
        if (_storySource === src) { try { src.stop(); } catch(e) {} _storySource = null; }
      }, autoStopMs);
    });
  } catch(e) {}
}
function stopStory() {
  if (_storySource) {
    try { _storySource.stop(); } catch(e) {}
    _storySource = null;
  }
}

// ── Gif speedrunner (pendant la musique Dream) ──
function showSpeedrunnerGif() {
  if (document.getElementById('speedrunner-gif')) return;
  const img = document.createElement('img');
  img.id = 'speedrunner-gif';
  img.src = './speedrunner.gif';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  document.body.appendChild(img);
  requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add('show')));
}
function hideSpeedrunnerGif() {
  const img = document.getElementById('speedrunner-gif');
  if (img) { img.classList.remove('show'); setTimeout(() => img.remove(), 400); }
}

async function preloadBrainrotSounds() {
  for (const name in BRAINROT_SOUNDS) {
    try {
      const res = await fetch(BRAINROT_SOUNDS[name]);
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      _brBuffers[name] = await getAudioCtx().decodeAudioData(buf);
    } catch(e) {}
  }
}

function playBrainrot(name, vol, solo) {
  if (!soundEnabled || !_brBuffers[name]) return;
  try {
    const ctx = getAudioCtx();
    ctx.resume().then(() => {
      if (solo && _brSoloSource) { try { _brSoloSource.stop(); } catch(e) {} }
      const gain = ctx.createGain();
      gain.gain.value = vol == null ? 0.8 : vol;
      gain.connect(ctx.destination);
      const src = ctx.createBufferSource();
      src.buffer = _brBuffers[name];
      src.connect(gain);
      src.start(0);
      if (solo) { _brSoloSource = src; src.onended = () => { if (_brSoloSource === src) _brSoloSource = null; }; }
    });
  } catch(e) {}
}

// Un overlay de jeu est-il ouvert ? (on met en pause les effets plein écran)
function _brOverlayOpen() {
  return !!document.querySelector('.osu-overlay, #spin-overlay, .qcm-overlay, #osu-results-overlay, #bulletin-overlay, .osu-logo-screen, #troll-reveal');
}

const BR_EMOJIS = ['💀','🔥','😭','🥁','🗿','💯','🤑','👹','🐊','⚡','💜','😎','🤙','📈'];
const BR_WORDS  = ['SKIBIDI','67','RIZZ +1000','SIGMA','OHIO','GYATT','MOG','+9999 AURA','MEWING','SHEEEESH','W','GOAT','NPC','BRAINROT','HUN APPROVED','TUNG TUNG'];

// ── Curseur : traînée d'emojis ──
function _brSpawnTrail(x, y) {
  const e = document.createElement('div');
  e.className = 'br-trail';
  e.textContent = BR_EMOJIS[(Math.random() * BR_EMOJIS.length) | 0];
  e.style.left = x + 'px';
  e.style.top  = y + 'px';
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 800);
}

// ── Explosion d'emojis au clic ──
function _brBurst(x, y) {
  const n = 7;
  for (let i = 0; i < n; i++) {
    const e = document.createElement('div');
    e.className = 'br-burst';
    e.textContent = BR_EMOJIS[(Math.random() * BR_EMOJIS.length) | 0];
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.6;
    const dist = 60 + Math.random() * 70;
    e.style.left = x + 'px';
    e.style.top  = y + 'px';
    e.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
    e.style.setProperty('--dy', (Math.sin(ang) * dist - 40) + 'px');
    document.body.appendChild(e);
    setTimeout(() => e.remove(), 900);
  }
}

// ── Flash de mot brainrot ──
function _brFlashWord() {
  const w = document.createElement('div');
  w.className = 'br-word';
  w.textContent = BR_WORDS[(Math.random() * BR_WORDS.length) | 0];
  w.style.left = (10 + Math.random() * 70) + 'vw';
  w.style.top  = (15 + Math.random() * 60) + 'vh';
  w.style.setProperty('--rot', (Math.random() * 30 - 15) + 'deg');
  document.body.appendChild(w);
  setTimeout(() => w.remove(), 900);
}

// ── Screen shake ──
function brainrotShake() {
  document.body.classList.remove('br-shake');
  void document.body.offsetWidth;
  document.body.classList.add('br-shake');
  setTimeout(() => document.body.classList.remove('br-shake'), 500);
}

// ── Marquee défilant (ticker brainrot) ──
function _brBuildMarquee() {
  const seg = ' 🥁 TUNG TUNG TUNG SAHUR 🐊 TRALALERO TRALALA 💀 67 💀 SKIBIDI RIZZ OHIO 🗿 SIGMA AURA +9999 ⚡ HUN APPROVED 🥁 BONEKA AMBALABU 💯 MAMA GUAVO 🔥 ';
  const bar = document.createElement('div');
  bar.id = 'br-marquee';
  bar.innerHTML = `<div class="br-marquee-track">${seg.repeat(4)}</div>`;
  document.body.appendChild(bar);
}

// ── Soundboard flottant ──
function _brBuildSoundboard() {
  const SB = [
    { name: 'vineboom',  emoji: '💥', label: 'BOOM' },
    { name: 'tungsahur', emoji: '🥁', label: 'TUNG' },
    { name: 'tralalero', emoji: '🐊', label: 'TRALA' },
    { name: 'bruh',      emoji: '💀', label: 'BRUH' },
    { name: 'rizz',      emoji: '🗿', label: 'RIZZ' },
    { name: 'pipe',      emoji: '🔧', label: 'PIPE' },
  ];
  const wrap = document.createElement('div');
  wrap.id = 'br-soundboard';
  wrap.className = 'br-collapsed';
  wrap.innerHTML = `
    <div class="br-sb-panel">
      ${SB.map(s => `<button class="br-sb-btn" data-sound="${s.name}"><span>${s.emoji}</span>${s.label}</button>`).join('')}
    </div>
    <button id="br-sb-toggle" title="Soundboard brainrot">🧠</button>
  `;
  document.body.appendChild(wrap);

  wrap.querySelector('#br-sb-toggle').addEventListener('click', e => {
    e.stopPropagation();
    wrap.classList.toggle('br-collapsed');
    playBrainrot('vineboom', 0.4);
  });
  wrap.querySelectorAll('.br-sb-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const long = ['tungsahur', 'tralalero'].includes(btn.dataset.sound);
      playBrainrot(btn.dataset.sound, 0.9, long);
      btn.classList.remove('br-sb-pop'); void btn.offsetWidth; btn.classList.add('br-sb-pop');
    });
  });
}

// ── Floaters images (réutilise les assets existants) ──
function _brBuildFloaters() {
  const imgs = [
    { src: './67.gif',  cls: 'br-float-1' },
    { src: './HUN.png', cls: 'br-float-2' },
    { src: './67.gif',  cls: 'br-float-3' },
  ];
  imgs.forEach(o => {
    const im = document.createElement('img');
    im.src = o.src;
    im.className = 'br-floater ' + o.cls;
    im.alt = '';
    im.setAttribute('aria-hidden', 'true');
    document.body.appendChild(im);
  });
}

// ── Init global ──
function initBrainrotMax() {
  preloadBrainrotSounds();
  _brBuildMarquee();
  _brBuildSoundboard();
  _brBuildFloaters();
  initAuraCounter();
  initNameEggs();
  initKonami();
  initIdleReaction();

  // Curseur traînée (throttle)
  let _lastTrail = 0;
  document.addEventListener('pointermove', e => {
    if (_brOverlayOpen()) return;
    const now = performance.now();
    if (now - _lastTrail < 55) return;
    _lastTrail = now;
    _brSpawnTrail(e.clientX, e.clientY);
  }, { passive: true });

  // Clic = explosion d'emojis (+ boom sur les boutons) + aura
  document.addEventListener('click', e => {
    if (e.target.closest('#br-soundboard')) return;
    addAura(1 + ((Math.random() * 8) | 0));
    if (_brOverlayOpen()) return;
    _brBurst(e.clientX, e.clientY);
    const onBtn = e.target.closest('button, .mode-btn, .btn-primary, .btn-pdf-auto');
    if (onBtn && Math.random() < 0.5) playBrainrot('vineboom', 0.45);
  });

  // Flash de mots brainrot
  setInterval(() => {
    if (_brOverlayOpen() || document.hidden) return;
    if (Math.random() < 0.65) _brFlashWord();
  }, 4500);

  // Vine boom + shake sur le bouton Vérifier
  const checkBtn = document.getElementById('btn-check');
  if (checkBtn) checkBtn.addEventListener('click', () => {
    playBrainrot('vineboom', 0.7);
    brainrotShake();
  });
}

// ════════════════════════════════════════════════════════════
//   SURPRISES CACHÉES
// ════════════════════════════════════════════════════════════

// ── 1) Compteur d'AURA (monte à chaque clic, paliers à débloquer) ──
let _aura = 0;
function initAuraCounter() {
  if (document.getElementById('aura-counter')) return;
  const el = document.createElement('div');
  el.id = 'aura-counter';
  el.innerHTML = '✨ AURA <b id="aura-val">0</b>';
  document.body.appendChild(el);
}
function addAura(n) {
  const before = _aura;
  _aura += n;
  const v = document.getElementById('aura-val');
  const box = document.getElementById('aura-counter');
  if (v) v.textContent = _aura.toLocaleString('fr-CH');
  if (box) { box.classList.remove('aura-pop'); void box.offsetWidth; box.classList.add('aura-pop'); }
  [100, 500, 1000, 5000, 10000].forEach(m => {
    if (before < m && _aura >= m) _auraMilestone(m);
  });
}
function _auraMilestone(m) {
  const labels = { 100: 'SIGMA GRINDSET 🗿', 500: 'AURA FARMING 🔥', 1000: 'CERTIFIED GOAT 🐐', 5000: 'GIGACHAD ULTIME 💪', 10000: 'AURA INFINIE ♾️' };
  const p = document.createElement('div');
  p.className = 'aura-milestone';
  p.innerHTML = `<div class="am-x">+${m.toLocaleString('fr-CH')} AURA</div><div class="am-l">${labels[m] || 'AURA'}</div>`;
  document.body.appendChild(p);
  playBrainrot('rizz', 0.75);
  setTimeout(() => p.remove(), 1700);
}

// ── 2) Easter eggs dans les champs Prénom / Nom ──
function initNameEggs() {
  const EGGS = [
    { match: 'wesley',  sound: 'bruh',      msg: '❌ WESLEY DÉTECTÉ — ACCÈS REFUSÉ', bad: true },
    { match: 'hun',     sound: 'tungsahur', msg: '🥁 HUN — LE GOAT 🐐' },
    { match: 'skibidi', sound: 'vineboom',  msg: '🚽 SKIBIDI TOILET 🚽' },
    { match: 'tung',    sound: 'tungsahur', msg: '🥁 TUNG TUNG TUNG SAHUR' },
    { match: 'rizz',    sound: 'rizz',      msg: '🗿 W RIZZ DÉTECTÉ' },
    { match: 'ohio',    sound: 'vineboom',  msg: '💀 ONLY IN OHIO 💀' },
    { match: 'alain',   sound: 'tungsahur', msg: '👑 LE BOSS FINAL EN PERSONNE 👑' },
  ];
  let last = '';
  function check() {
    const p = document.getElementById('input-prenom');
    const n = document.getElementById('input-nom');
    if (!p || !n) return;
    const combined = normalize(p.value) + ' ' + normalize(n.value);
    for (const egg of EGGS) {
      if (combined.includes(egg.match)) {
        if (last !== egg.match) { last = egg.match; _fireNameEgg(egg); }
        return;
      }
    }
    last = '';
  }
  ['input-prenom', 'input-nom'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', check);
  });
}
function _fireNameEgg(egg) {
  playBrainrot(egg.sound, 0.85, true);
  addAura(67);
  const t = document.createElement('div');
  t.className = 'name-egg' + (egg.bad ? ' name-egg-bad' : '');
  t.textContent = egg.msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1900);
  if (egg.bad) {
    ['input-prenom', 'input-nom'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.add('egg-shake'); setTimeout(() => el.classList.remove('egg-shake'), 500); }
    });
  }
}

// ── 3) Konami code → HUN MODE ──
function initKonami() {
  const seq = ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'];
  let idx = 0;
  document.addEventListener('keydown', e => {
    if (_brOverlayOpen()) return;
    const k = (e.key || '').toLowerCase();
    if (k === seq[idx]) {
      idx++;
      if (idx === seq.length) { idx = 0; triggerHunMode(); }
    } else {
      idx = (k === seq[0]) ? 1 : 0;
    }
  });
}
function triggerHunMode() {
  if (document.getElementById('hun-mode-banner')) return;
  document.body.classList.add('hun-mode-rainbow');
  playBrainrot('vineboom', 0.7);
  setTimeout(() => playBrainrot('tungsahur', 0.85, true), 180);

  const banner = document.createElement('div');
  banner.id = 'hun-mode-banner';
  banner.textContent = '🥁 HUN MODE ACTIVÉ 🥁';
  document.body.appendChild(banner);
  addAura(1000);

  const imgs = ['./HUN.png', './TUNG.png', './67.gif'];
  const emos = ['🥁','🐊','💀','🗿','💯','👹','🤑','⚡'];
  let count = 0;
  const rainIv = setInterval(() => {
    if (count++ > 70) { clearInterval(rainIv); return; }
    const useImg = Math.random() < 0.4;
    const el = document.createElement(useImg ? 'img' : 'div');
    if (useImg) { el.src = imgs[(Math.random() * imgs.length) | 0]; el.className = 'hun-rain hun-rain-img'; }
    else { el.className = 'hun-rain hun-rain-emoji'; el.textContent = emos[(Math.random() * emos.length) | 0]; }
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.setProperty('--dur', (2.4 + Math.random() * 2.2) + 's');
    el.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5200);
  }, 80);

  setTimeout(() => {
    document.body.classList.remove('hun-mode-rainbow');
    banner.classList.add('out');
    setTimeout(() => banner.remove(), 600);
  }, 6000);
}

// ── 4) Réaction d'inactivité ──
let _idleTimer = null;
const IDLE_LINES = [
  'T\'es encore là ? 🥁', 'Wesley c\'est toi ? 👀', 'Allez, tape un nom 🐊',
  'MAMA GUAVO t\'attend 💀', 'Skibidi ? 🚽', 'AFK détecté 📈', 'Toujours là le sigma ? 🗿'
];
function initIdleReaction() {
  ['pointermove', 'keydown', 'click', 'scroll'].forEach(ev =>
    document.addEventListener(ev, _resetIdle, { passive: true }));
  _resetIdle();
}
function _resetIdle() {
  clearTimeout(_idleTimer);
  _idleTimer = setTimeout(_showIdle, 25000);
}
function _showIdle() {
  if (_brOverlayOpen() || document.hidden) { _resetIdle(); return; }
  if (document.getElementById('idle-pop')) return;
  const pop = document.createElement('div');
  pop.id = 'idle-pop';
  pop.innerHTML = `<img src="./HUN.png" alt="" /><div class="idle-bubble">${IDLE_LINES[(Math.random() * IDLE_LINES.length) | 0]}</div>`;
  document.body.appendChild(pop);
  playBrainrot('vineboom', 0.4);
  requestAnimationFrame(() => requestAnimationFrame(() => pop.classList.add('show')));
  setTimeout(() => { pop.classList.remove('show'); setTimeout(() => pop.remove(), 500); }, 5000);
  _resetIdle();
}

// ════════════════════════════════════════════════════════════
//   GATE — écran de verrouillage (mot de passe OU Alain trouvé)
// ════════════════════════════════════════════════════════════

const GATE_PASSWORD = 'JEMAMAGUAVEENBALLE';
let _siteRevealed = false;

// Révèle le vrai site (BIOS + brainrot) — une seule fois
function revealSite() {
  if (_siteRevealed) return;
  _siteRevealed = true;
  runBiosBoot();
  initBrainrotMax();
}

function unlockSite(viaPassword) {
  try { localStorage.setItem('hun-unlocked', 'true'); } catch (e) {}
  const gate = document.getElementById('gate-screen');
  if (gate) {
    const lock = document.getElementById('gate-lock');
    if (lock) lock.textContent = '🔓';
    gate.classList.add('gate-unlocking');
    setTimeout(() => { gate.classList.add('gate-gone'); }, viaPassword ? 350 : 1100);
    setTimeout(() => { gate.remove(); }, (viaPassword ? 350 : 1100) + 700);
  }
  // petit délai pour laisser l'anim, puis on révèle
  setTimeout(revealSite, viaPassword ? 250 : 900);
}

function _gateStatus(html, cls) {
  const el = document.getElementById('gate-status');
  if (!el) return;
  el.innerHTML = html;
  el.className = 'gate-status show' + (cls ? ' ' + cls : '');
}

// fetch avec timeout (évite tout blocage sur un proxy lent)
function _fetchTimeout(url, ms, opts) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  return fetch(url, Object.assign({ signal: ctl.signal }, opts || {}))
    .finally(() => clearTimeout(t));
}

// Récupère le PDF le plus récent (repo en priorité, proxies en secours) — timeouts
async function _gateFetchPdf() {
  const sources = [
    PDF_LOCAL,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(PDF_URL)}`,
    `https://corsproxy.io/?${encodeURIComponent(PDF_URL)}`,
  ];
  for (const url of sources) {
    try {
      const res = await _fetchTimeout(url, 8000, { cache: 'no-store' });
      if (!res.ok) continue;
      const buffer = await res.arrayBuffer();
      const m = new Uint8Array(buffer.slice(0, 4));
      if (!(m[0] === 0x25 && m[1] === 0x50 && m[2] === 0x44 && m[3] === 0x46)) continue;
      return { buffer, url };
    } catch (e) { /* source suivante */ }
  }
  return null;
}

// Vérification TEMPS RÉEL : scrape la page officielle en direct (via proxy),
// trouve le PDF le plus récent, le télécharge et cherche Alain. Renvoie {date, found} ou null.
const PALMARES_PAGE = 'https://www.citedesmetiers.ch/palmares2026/';
async function _gateLiveCheck() {
  const proxy = u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`;
  // 1) Récupère la page et liste les PDF
  let html;
  try {
    const r = await _fetchTimeout(proxy(PALMARES_PAGE), 7000, { cache: 'no-store' });
    if (!r.ok) return null;
    html = await r.text();
  } catch (e) { return null; }

  const urls = html.match(/https?:\/\/[^"'>\s]+\.pdf/gi);
  if (!urls || !urls.length) return null;

  // 2) Choisit le plus récent (date dans le nom de fichier)
  const key = u => { const m = u.match(/(\d{4})-(\d{2})-(\d{2})_(\d{2})h(\d{2})/); return m ? m.slice(1).join('') : '0'; };
  urls.sort((a, b) => key(b).localeCompare(key(a)));
  const latest = urls[0];
  const date = extractPdfDate(latest);

  // 3) Télécharge ce PDF et cherche Alain
  try {
    const r = await _fetchTimeout(proxy(latest), 10000, { cache: 'no-store' });
    if (!r.ok) return null;
    const buffer = await r.arrayBuffer();
    const m = new Uint8Array(buffer.slice(0, 4));
    if (!(m[0] === 0x25 && m[1] === 0x50 && m[2] === 0x44 && m[3] === 0x46)) return null;
    const text  = await extractTextFromPdfBuffer(buffer);
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    return { date, found: lines.some(l => lineMatchesName(l, 'Alain', 'Addor')) };
  } catch (e) { return null; }
}

async function gateCheckPdf() {
  const btn = document.getElementById('gate-check-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Vérification du palmarès…'; }
  _gateStatus('🔍 Lecture des dernières données…', 'loading');

  let date = null, found = null;

  // 1) Données du bot (instantané, rafraîchi ~15 min) — déverrouille direct si déjà trouvé
  try {
    const r = await _fetchTimeout('./palmares-info.json?t=' + Date.now(), 6000, { cache: 'no-store' });
    if (r.ok) { const j = await r.json(); date = j.date || null; if (typeof j.found === 'boolean') found = j.found; }
  } catch (e) {}

  // 2) Tant qu'Alain n'est pas (encore) trouvé : vérification EN DIRECT de la page officielle
  if (found !== true) {
    _gateStatus('🔍 Lecture en direct du palmarès officiel…', 'loading');
    const live = await _gateLiveCheck();
    if (live) { if (live.date) date = live.date; found = live.found; }
  }

  // 3) Dernier recours : PDF du repo si rien d'autre n'a répondu
  if (found === null) {
    try {
      const pdf = await _gateFetchPdf();
      if (pdf) {
        if (!date) date = extractPdfDate(pdf.url);
        const text  = await extractTextFromPdfBuffer(pdf.buffer);
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        found = lines.some(l => lineMatchesName(l, 'Alain', 'Addor'));
      }
    } catch (e) {}
  }

  if (btn) { btn.disabled = false; btn.textContent = '🔍 CHECK PDF TO UNLOCK'; }

  if (found === null) {
    _gateStatus('⚠️ Impossible de vérifier le palmarès pour le moment.<br>Réessaie dans un moment.', 'err');
    return;
  }

  if (!date) date = extractPdfDate(PDF_URL) || 'date inconnue';

  if (found) {
    _gateStatus(
      `📅 Dernier PDF : <b>${date}</b><br><span class="gate-found">✅ ALAIN ADDOR FOUND — UNLOCKING WEBSITE…</span>`,
      'ok'
    );
    setTimeout(() => unlockSite(false), 1400);
  } else {
    _gateStatus(
      `📅 Dernier PDF : <b>${date}</b><br><span class="gate-notfound">❌ Alain Addor not found — website stays locked 🔒</span>`,
      'err'
    );
  }
}

function initGate() {
  const gate = document.getElementById('gate-screen');

  // Déjà déverrouillé → on saute le gate
  let unlocked = false;
  try { unlocked = localStorage.getItem('hun-unlocked') === 'true'; } catch (e) {}
  if (unlocked || !gate) {
    if (gate) gate.remove();
    revealSite();
    return;
  }

  // Mot de passe
  const pass = document.getElementById('gate-pass');
  const passBtn = document.getElementById('gate-pass-btn');
  function tryPass() {
    const v = (pass.value || '').toUpperCase().replace(/\s/g, '');
    if (v === GATE_PASSWORD) {
      _gateStatus('🔓 Mot de passe correct — accès autorisé.', 'ok');
      unlockSite(true);
    } else {
      _gateStatus('❌ Mot de passe incorrect.', 'err');
      pass.value = '';
      gate.querySelector('.gate-box').classList.remove('gate-shake');
      void gate.offsetWidth;
      gate.querySelector('.gate-box').classList.add('gate-shake');
    }
  }
  if (passBtn) passBtn.addEventListener('click', tryPass);
  if (pass) pass.addEventListener('keydown', e => { if (e.key === 'Enter') tryPass(); });

  // Check PDF
  const checkBtn = document.getElementById('gate-check-btn');
  if (checkBtn) checkBtn.addEventListener('click', gateCheckPdf);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGate);
} else {
  initGate();
}
