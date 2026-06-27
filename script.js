/* ============================================================
   CFC PRO MAX CHECKER 2026 — Script principal v3
   Matrix rain + Web Audio drums + holographic card + glitch
   ============================================================ */

// ─── Boot BIOS screen ────────────────────────────────────────

(function initBios() {
  const screen  = document.getElementById('bios-screen');
  const content = document.getElementById('bios-content');

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
})();

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

async function downloadCertificate(prenom, nom, profession) {
  const btn = document.getElementById('btn-certif');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Génération…'; }

  try {
    if (!window.jspdf) throw new Error('jsPDF non chargé — vérifie ta connexion internet.');

    const { jsPDF } = window.jspdf;

    // ── Canvas A4 paysage ~150dpi (1754×1240) ──
    // Les sprites sont dessinés sur le canvas (data: URLs ne taintent pas)
    const W = 1754, H = 1240;
    const cv = document.createElement('canvas');
    cv.width  = W;
    cv.height = H;
    const c = cv.getContext('2d');

    const fullName = [prenom, nom].filter(Boolean).join(' ').toUpperCase();
    const profText = (profession || 'EMPLOYÉ·E DE COMMERCE CFC').toUpperCase();
    const dateStr  = new Date().toLocaleDateString('fr-CH', { day:'2-digit', month:'2-digit', year:'numeric' });

    // ── Fond dégradé ──
    const bg = c.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#08080e'); bg.addColorStop(.5, '#0d0820'); bg.addColorStop(1, '#060e08');
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);

    // ── Grille déco ──
    c.strokeStyle = 'rgba(124,58,237,0.06)'; c.lineWidth = 1;
    for (let x = 0; x < W; x += 50) { c.beginPath(); c.moveTo(x,0); c.lineTo(x,H); c.stroke(); }
    for (let y = 0; y < H; y += 50) { c.beginPath(); c.moveTo(0,y); c.lineTo(W,y); c.stroke(); }

    // ── Bordures dorées ──
    c.strokeStyle = '#f59e0b'; c.lineWidth = 8;  c.strokeRect(24, 24, W-48, H-48);
    c.strokeStyle = '#fbbf24'; c.lineWidth = 2;  c.strokeRect(40, 40, W-80, H-80);

    // ── Barre top violette ──
    const topGrad = c.createLinearGradient(0,0,W,0);
    topGrad.addColorStop(0,'#5b21b6'); topGrad.addColorStop(.5,'#a855f7'); topGrad.addColorStop(1,'#5b21b6');
    c.fillStyle = topGrad; c.fillRect(40, 40, W-80, 100);
    c.fillStyle = '#fff'; c.font = 'bold 38px Impact, Arial Black, sans-serif'; c.textAlign = 'center';
    c.fillText('CITE DES METIERS  --  PALMARES CFC 2026  --  SUISSE', W/2, 108);

    // ── ATTESTATION OFFICIELLE ──
    c.fillStyle = '#f59e0b'; c.font = 'bold 88px Impact, Arial Black, sans-serif'; c.textAlign = 'center';
    c.shadowColor = '#f59e0b'; c.shadowBlur = 28;
    c.fillText('ATTESTATION OFFICIELLE', W/2, 260);
    c.shadowBlur = 0;

    // ── Trait séparateur ──
    const sep = c.createLinearGradient(120,0,W-120,0);
    sep.addColorStop(0,'transparent'); sep.addColorStop(.15,'#f59e0b'); sep.addColorStop(.85,'#f59e0b'); sep.addColorStop(1,'transparent');
    c.strokeStyle = sep; c.lineWidth = 3;
    c.beginPath(); c.moveTo(120,290); c.lineTo(W-120,290); c.stroke();

    // ── Nom ──
    c.fillStyle = '#ffffff'; c.font = 'bold 106px Impact, Arial Black, sans-serif'; c.textAlign = 'center';
    c.shadowColor = 'rgba(34,197,94,.5)'; c.shadowBlur = 36;
    c.fillText(fullName, W/2, 420);
    c.shadowBlur = 0;

    // ── Profession ──
    c.fillStyle = '#22c55e'; c.font = 'bold 50px Impact, Arial Black, sans-serif';
    c.fillText(profText, W/2, 500);

    // ── Badge RC2 ──
    c.fillStyle = 'rgba(124,58,237,.22)';
    roundRect(c, W/2-330, 528, 660, 72, 16); c.fill();
    c.strokeStyle = '#a855f7'; c.lineWidth = 2;
    roundRect(c, W/2-330, 528, 660, 72, 16); c.stroke();
    c.fillStyle = '#a855f7'; c.font = 'bold 36px Impact, Arial Black, sans-serif';
    c.fillText('CFC PRO MAX  -  RC2  -  HUN EDITION', W/2, 576);

    // ── TPTTPPTPTPTPTPXXXZA — centre du certificat ──
    c.fillStyle = '#22c55e'; c.font = 'bold 74px Impact, Arial Black, sans-serif'; c.textAlign = 'center';
    c.shadowColor = '#22c55e'; c.shadowBlur = 24;
    c.fillText('TPTTPPTPTPTPTPXXXZA', W/2, 690);
    c.shadowBlur = 0;

    // ── Watermark MAMA GUAVO ──
    c.save(); c.translate(W/2, H/2 + 100); c.rotate(-Math.PI/10);
    c.font = 'bold 128px Impact, Arial Black, sans-serif';
    c.fillStyle = 'rgba(245,158,11,0.05)'; c.textAlign = 'center';
    c.fillText('MAMA GUAVO APPROVED', 0, 0);
    c.restore();

    // ── Trait bas ──
    c.strokeStyle = sep; c.lineWidth = 2;
    c.beginPath(); c.moveTo(120, H-170); c.lineTo(W-120, H-170); c.stroke();

    // ── Textes bas ──
    c.fillStyle = '#64748b'; c.font = '26px Courier New, monospace'; c.textAlign = 'left';
    c.fillText('Emis le ' + dateStr, 120, H-130);
    c.fillText('citedesmetiers.ch/palmares2026', 120, H-90);
    c.fillStyle = '#f59e0b'; c.font = 'bold 28px Impact, Arial Black, sans-serif'; c.textAlign = 'center';
    c.fillText('TUNG TUNG AH MAMA GUAVO', W/2, H-112);
    c.fillStyle = '#3a3a5a'; c.font = '22px Courier New, monospace';
    c.fillText('Document non officiel -- usage interne HUN Edition uniquement', W/2, H-70);

    // ── Étoiles coins ──
    c.fillStyle = '#f59e0b'; c.font = '34px serif'; c.textAlign = 'center';
    [[80,80],[W-80,80],[80,H-80],[W-80,H-80]].forEach(([x,y]) => c.fillText('*', x, y+12));

    // ── Sprites dessinés sur le canvas — même domaine = pas de canvas taint ──
    const PX_PER_MM = W / 297;
    await drawSpriteOnCanvas(c, 'HUN.png',  Math.round(238 * PX_PER_MM), Math.round(148 * PX_PER_MM), Math.round(55 * PX_PER_MM));
    await drawSpriteOnCanvas(c, 'TUNG.png', Math.round(5   * PX_PER_MM), Math.round(155 * PX_PER_MM), Math.round(45 * PX_PER_MM));

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
    const res = await fetch('./OSU.MP3');
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
  if (!soundEnabled) stopVictoire();
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

// ─── Rendu des résultats ──────────────────────────────────────

/**
 * Affiche le résultat selon qui est trouvé.
 * Mode spécial uniquement pour Alain Addor.
 * Pour tout autre nom : affiche le nom recherché + profession détectée.
 */
function renderSuccess(matchResults, prenom, nom) {
  const zone = document.getElementById('result-zone');
  const first = matchResults[0];

  const displayName = [prenom, nom].filter(Boolean).join(' ').toUpperCase();

  const profDisplay = first.profession
    ? `<div class="result-profession">🎓 ${escapeHtml(first.profession)}</div>`
    : `<div class="result-profession muted">CFC / profession : non déterminé(e)</div>`;

  const rawLine = `<div class="result-lines">▸ ${escapeHtml(first.line)}</div>`;

  if (isAlainAddor(prenom, nom)) {
    // ── MODE BRAINROT SPÉCIAL ALAIN ADDOR ──
    zone.innerHTML = `
      <div class="result-success">
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
      </div>
    `;
    triggerGoldFlash();
    setTimeout(showAchievement, 600);
    setTimeout(showAlainRewards, 1800);
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

  playVictoire();
  launchConfetti();
  playTungTung();
  zone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderFail(prenom, nom) {
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

    // ── Bouton NON — lance le mini-jeu ──
    overlay.querySelector('#qcm-non').addEventListener('click', () => {
      overlay.classList.add('qcm-hide');
      setTimeout(() => {
        overlay.remove();
        showOsuGame().then(resolve);
      }, 300);
    });
  });
}

// ─── Mini-jeu OSU ────────────────────────────────────────────

function showOsuGame() {
  return new Promise(resolve => {
    // ── Phase 1 : logo OSUHUN ──
    const logoScreen = document.createElement('div');
    logoScreen.className = 'osu-logo-screen';
    logoScreen.innerHTML = `<img src="./OSUHUN.png" class="osu-logo-img" alt="HUN" />`;
    document.body.appendChild(logoScreen);

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
    }, 1200);
  });
}

function _startOsuGame(resolve) {
    const game = document.createElement('div');
    game.className = 'osu-overlay';
    game.innerHTML = `
      <div class="osu-container">
        <div class="osu-header">
          <span class="osu-title">INTERFACE TEST</span>
          <span class="osu-sub">CLIQUEZ LES CERCLES</span>
        </div>
        <div class="osu-field" id="osu-field"></div>
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

    const field = game.querySelector('#osu-field');

    const CIRCLES = [
      { x: 22, y: 38 },
      { x: 68, y: 22 },
      { x: 48, y: 68 },
    ];
    let step = 0;

    function spawnCircle(idx) {
      if (idx >= CIRCLES.length) { showSlider(); return; }
      const { x, y } = CIRCLES[idx];
      const el = document.createElement('div');
      el.className = 'osu-circle';
      el.style.left = x + '%';
      el.style.top  = y + '%';
      el.innerHTML  = `<span class="osu-num">${idx + 1}</span><span class="osu-ring"></span>`;
      field.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('osu-circle-in')));

      function hit(e) {
        e.preventDefault();
        e.stopPropagation();
        el.removeEventListener('click', hit);
        el.removeEventListener('touchstart', hit);
        _playClickBeep();
        el.classList.add('osu-hit');
        setTimeout(() => el.remove(), 350);
        step++;
        setTimeout(() => spawnCircle(step), 280);
      }
      el.addEventListener('click', hit);
      el.addEventListener('touchstart', hit, { passive: false });
    }

    function showSlider() {
      field.innerHTML = `
        <div class="osu-slider-wrap">
          <div class="osu-slider-hint">→ FAITES GLISSER →</div>
          <div class="osu-slider-track" id="osu-track">
            <div class="osu-slider-prog" id="osu-prog"></div>
            <div class="osu-slider-knob" id="osu-knob"></div>
          </div>
        </div>
      `;
      const track = field.querySelector('#osu-track');
      const prog  = field.querySelector('#osu-prog');
      const knob  = field.querySelector('#osu-knob');
      let dragging = false, done = false;

      function setPos(clientX) {
        const r = track.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        knob.style.left  = (p * 100) + '%';
        prog.style.width = (p * 100) + '%';
        if (p >= .92 && !done) { done = true; completeGame(); }
      }

      knob.addEventListener('pointerdown', e => { dragging = true; knob.setPointerCapture(e.pointerId); });
      knob.addEventListener('pointermove', e => { if (dragging) setPos(e.clientX); });
      knob.addEventListener('pointerup',   () => { dragging = false; });
      // mobile touch fallback on track
      track.addEventListener('touchmove', e => {
        e.preventDefault();
        setPos(e.touches[0].clientX);
      }, { passive: false });
    }

    function completeGame() {
      stopOsuMusic();
      field.style.opacity = '0';
      setTimeout(() => {
        field.style.display = 'none';
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
              setTimeout(() => { game.remove(); resolve(); }, 450);
            }, 900);
          }
        }, 18);
      }, 200);
    }

    setTimeout(() => spawnCircle(0), 350);
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
  { text: 'Searching Wesley...', status: 'ERROR', sc: 'term-err' },
  { text: 'Searching Wesley (2nd try)...', status: 'ERROR', sc: 'term-err' },
  { text: 'Searching Wesley (3rd try)...', status: 'TOO RETARDED', sc: 'term-err' },
  { text: 'Cancelling Wesley...' },
  { text: 'Loading HUN Search Engine...', status: '✔ READY', sc: 'term-ok' },
  null, // easter egg slot 2
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
      if (!body) return;
      const cursor = body.querySelector('.term-cursor');
      if (cursor) cursor.remove();

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

window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});
