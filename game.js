// ── Color Engine ──────────────────────────────────────────

function hslToHex(h, s, l) {
  const sat = s / 100;
  const light = l / 100;
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const hPrime = h / 60;
  const x = chroma * (1 - Math.abs((hPrime % 2) - 1));
  let r = 0, g = 0, b = 0;

  if (hPrime < 1)      { r = chroma; g = x; }
  else if (hPrime < 2) { r = x; g = chroma; }
  else if (hPrime < 3) { g = chroma; b = x; }
  else if (hPrime < 4) { g = x; b = chroma; }
  else if (hPrime < 5) { r = x; b = chroma; }
  else                 { r = chroma; b = x; }

  const m = light - chroma / 2;
  const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function hexToHsl(hex) {
  const n = hex.replace('#', '');
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      default: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function complementHsl(h, s, l) {
  return { h: (h + 180) % 360, s, l };
}

function hueDiff(a, b) {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function randomVividColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 26);  // 60–85%
  const l = 45 + Math.floor(Math.random() * 16);  // 45–60%
  return hslToHex(h, s, l);
}

// ── Constants ─────────────────────────────────────────────

const TOTAL_ROUNDS    = 5;
const ROUND_DURATION  = 60;
const MAX_POSSIBLE    = 570; // 5 rounds all-Excellent with full streak progression

// ── State ─────────────────────────────────────────────────

const state = {
  round:         1,
  givenHex:      null,
  correctHex:    null,
  playerHex:     null,
  timeRemaining: ROUND_DURATION,
  timerId:       null,
  hintUsed:      false,
  submitted:     false,
  pickerTempHex: null,
  score:         0,
  streak:        0,
  maxStreak:     0,
  bestRound:     0,
  roundScores:   [],
};

// ── DOM refs ──────────────────────────────────────────────

const el = {
  timer:           document.getElementById('timer'),
  leftHex:         document.getElementById('left-hex'),
  rightHex:        document.getElementById('right-hex'),
  canvas:          document.getElementById('split-circle'),
  pickTrigger:     document.getElementById('pick-trigger'),
  accuracyWrap:    document.getElementById('accuracy-wrap'),
  accuracyFill:    document.getElementById('accuracy-fill'),
  accuracyLabel:   document.getElementById('accuracy-label'),
  feedbackSection: document.getElementById('feedback-section'),
  hintInfo:        document.getElementById('hint-info'),
  hintText:        document.getElementById('hint-text'),
  submitInfo:      document.getElementById('submit-info'),
  tierLabel:       document.getElementById('tier-label'),
  pointsEarned:    document.getElementById('points-earned'),
  correctReveal:   document.getElementById('correct-reveal'),
  streakBadge:     document.getElementById('streak-badge'),
  hintBtn:         document.getElementById('hint-btn'),
  submitBtn:       document.getElementById('submit-btn'),
  nextBtn:         document.getElementById('next-btn'),
  scoreDisplay:    document.getElementById('score-display'),
  roundDisplay:    document.getElementById('round-display'),
  streakDisplay:   document.getElementById('streak-display'),
  bestDisplay:     document.getElementById('best-display'),
  pickerOverlay:   document.getElementById('picker-popup'),
  colorPicker:     document.getElementById('color-picker'),
  hexInput:        document.getElementById('hex-input'),
  pickerPreview:   document.getElementById('picker-preview'),
  pickerCancel:    document.getElementById('picker-cancel'),
  pickerUse:       document.getElementById('picker-use'),
  resultsOverlay:  document.getElementById('results-overlay'),
  resultsGrade:    document.getElementById('results-grade'),
  resultsScore:    document.getElementById('results-score'),
  resultsAccuracy: document.getElementById('results-accuracy'),
  resultsBest:     document.getElementById('results-best'),
  resultsStreak:   document.getElementById('results-streak'),
  playAgain:       document.getElementById('play-again'),
};

// ── Canvas drawing ────────────────────────────────────────

function drawCircle(leftHex, rightHex) {
  const ctx  = el.canvas.getContext('2d');
  const w    = el.canvas.width;
  const h    = el.canvas.height;
  const cx   = w / 2;
  const r    = cx - 1;

  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.clip();

  // Left half — target color
  ctx.fillStyle = leftHex;
  ctx.fillRect(0, 0, cx, h);

  // Right half — player pick or placeholder
  ctx.fillStyle = rightHex || '#2E2E2E';
  ctx.fillRect(cx, 0, cx, h);

  // Divider
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h);
  ctx.stroke();

  ctx.restore();

  // "?" placeholder on right half when no pick
  if (!rightHex) {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = 'bold 52px DM Sans, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', cx + cx / 2, cx);
  }
}

// ── Round lifecycle ───────────────────────────────────────

function startRound() {
  stopTimer();

  const gsl  = hexToHsl(randomVividColor());
  const comp = complementHsl(gsl.h, gsl.s, gsl.l);

  state.givenHex      = hslToHex(gsl.h, gsl.s, gsl.l);
  state.correctHex    = hslToHex(comp.h, comp.s, comp.l);
  state.playerHex     = null;
  state.timeRemaining = ROUND_DURATION;
  state.hintUsed      = false;
  state.submitted     = false;

  el.leftHex.textContent  = state.givenHex;
  el.rightHex.textContent = '?';
  el.roundDisplay.textContent = `${state.round} / ${TOTAL_ROUNDS}`;

  el.accuracyWrap.hidden    = true;
  el.feedbackSection.hidden = true;
  el.hintInfo.hidden        = true;
  el.submitInfo.hidden      = true;
  el.streakBadge.hidden     = true;

  el.hintBtn.disabled   = false;
  el.submitBtn.disabled = false;
  el.nextBtn.disabled   = true;
  el.nextBtn.textContent = 'Next Round';
  el.pickTrigger.disabled = false;

  drawCircle(state.givenHex, null);
  updateTimerDisplay();

  state.timerId = setInterval(tickTimer, 1000);
}

function tickTimer() {
  state.timeRemaining--;
  updateTimerDisplay();
  if (state.timeRemaining <= 0) {
    stopTimer();
    if (!state.playerHex) {
      state.playerHex = state.givenHex; // no pick → auto-fail
    }
    doSubmit();
  }
}

function updateTimerDisplay() {
  const m = String(Math.floor(state.timeRemaining / 60)).padStart(2, '0');
  const s = String(state.timeRemaining % 60).padStart(2, '0');
  el.timer.textContent = `${m}:${s}`;
  el.timer.classList.toggle('timer--urgent', state.timeRemaining <= 10);
}

function stopTimer() {
  clearInterval(state.timerId);
  state.timerId = null;
}

// ── Scoring ───────────────────────────────────────────────

function doSubmit() {
  if (state.submitted) return;
  stopTimer();
  state.submitted = true;

  el.hintBtn.disabled     = true;
  el.submitBtn.disabled   = true;
  el.pickTrigger.disabled = true;

  const playerHsl  = hexToHsl(state.playerHex);
  const correctHsl = hexToHsl(state.correctHex);
  const diff       = hueDiff(playerHsl.h, correctHsl.h);

  let tier, base;
  if      (diff <= 5)  { tier = 'Excellent'; base = 100; }
  else if (diff <= 15) { tier = 'Good';      base = 70;  }
  else if (diff <= 30) { tier = 'Close';     base = 40;  }
  else                 { tier = 'Miss';      base = 10;  }

  // Streak
  if (tier === 'Miss') {
    state.streak = 0;
  } else {
    state.streak++;
  }

  // Bonus applied using the streak *after* this round
  let roundScore;
  if (tier === 'Miss') {
    roundScore = base;
  } else if (state.streak >= 3) {
    roundScore = Math.round(base * 1.20);
  } else if (state.streak >= 2) {
    roundScore = Math.round(base * 1.10);
  } else {
    roundScore = base;
  }

  if (state.hintUsed) roundScore = Math.max(0, roundScore - 5);

  if (state.streak > state.maxStreak) state.maxStreak = state.streak;
  if (roundScore > state.bestRound)   state.bestRound  = roundScore;
  state.roundScores.push(roundScore);
  state.score += roundScore;

  // Accuracy %: map diff 0–180 → 100–0
  const accuracyPct = Math.max(0, Math.round((1 - diff / 180) * 100));

  // Reveal correct color on right side
  drawCircle(state.givenHex, state.correctHex);
  el.rightHex.textContent = state.correctHex;

  // Accuracy bar
  el.accuracyFill.style.width = '0';
  el.accuracyWrap.hidden = false;
  const tierColors = { Excellent: '#3DDC84', Good: '#6FD89A', Close: '#F5A623', Miss: '#FF6B6B' };
  el.accuracyFill.style.background = tierColors[tier];
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.accuracyFill.style.width = `${accuracyPct}%`;
  }));
  el.accuracyLabel.textContent = `${accuracyPct}% accuracy — ${diff}° off`;

  // Feedback
  el.tierLabel.textContent  = tier;
  el.tierLabel.className    = `tier-label tier-label--${tier.toLowerCase()}`;
  el.pointsEarned.textContent = `+${roundScore} pts`;
  el.correctReveal.textContent = `Correct: ${state.correctHex}`;

  if (state.streak >= 2) {
    const bonus = state.streak >= 3 ? '+20%' : '+10%';
    el.streakBadge.textContent = `${state.streak}x streak — ${bonus} bonus applied`;
    el.streakBadge.hidden = false;
  }

  el.submitInfo.hidden      = false;
  el.feedbackSection.hidden = false;

  // Bottom bar
  el.scoreDisplay.textContent  = String(state.score);
  el.streakDisplay.textContent = String(state.streak);
  el.bestDisplay.textContent   = state.bestRound > 0 ? String(state.bestRound) : '—';

  if (state.round >= TOTAL_ROUNDS) {
    el.nextBtn.textContent = 'See Results';
  }
  el.nextBtn.disabled = false;
}

// ── Results screen ────────────────────────────────────────

function showResults() {
  const pct = Math.round((state.score / MAX_POSSIBLE) * 100);
  let grade;
  if      (pct >= 90) grade = 'S';
  else if (pct >= 75) grade = 'A';
  else if (pct >= 60) grade = 'B';
  else if (pct >= 45) grade = 'C';
  else                grade = 'D';

  el.resultsGrade.textContent    = grade;
  el.resultsScore.textContent    = String(state.score);
  el.resultsAccuracy.textContent = `${pct}%`;
  el.resultsBest.textContent     = String(state.bestRound);
  el.resultsStreak.textContent   = String(state.maxStreak);
  el.resultsOverlay.hidden = false;
}

function resetGame() {
  state.round        = 1;
  state.score        = 0;
  state.streak       = 0;
  state.maxStreak    = 0;
  state.bestRound    = 0;
  state.roundScores  = [];

  el.scoreDisplay.textContent  = '0';
  el.streakDisplay.textContent = '0';
  el.bestDisplay.textContent   = '—';
  el.resultsOverlay.hidden = true;

  startRound();
}

// ── Color picker ──────────────────────────────────────────

function openPicker() {
  const initial = state.playerHex || '#FFFFFF';
  state.pickerTempHex      = initial;
  el.colorPicker.value     = initial;
  el.hexInput.value        = initial;
  el.pickerPreview.style.background = initial;
  el.pickerOverlay.hidden  = false;
}

function updatePickerPreview(hex) {
  state.pickerTempHex = hex;
  el.pickerPreview.style.background = hex;
  if (!state.submitted) {
    drawCircle(state.givenHex, hex);
  }
}

function closePicker(commit) {
  el.pickerOverlay.hidden = true;
  if (commit && state.pickerTempHex) {
    state.playerHex = state.pickerTempHex.toUpperCase();
    el.rightHex.textContent = state.playerHex;
    drawCircle(state.givenHex, state.playerHex);
  } else {
    // Revert canvas preview to committed color (or no-pick)
    drawCircle(state.givenHex, state.playerHex || null);
  }
}

// ── Event wiring ──────────────────────────────────────────

function wireEvents() {
  // Open picker by clicking right half of circle
  el.pickTrigger.addEventListener('click', () => {
    if (!state.submitted) openPicker();
  });

  // Native color input sync
  el.colorPicker.addEventListener('input', e => {
    const hex = e.target.value.toUpperCase();
    el.hexInput.value = hex;
    updatePickerPreview(hex);
  });

  // Hex text input sync
  el.hexInput.addEventListener('input', e => {
    const val = e.target.value.trim();
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      const upper = val.toUpperCase();
      el.colorPicker.value = upper;
      updatePickerPreview(upper);
    }
  });

  el.pickerCancel.addEventListener('click', () => closePicker(false));
  el.pickerUse.addEventListener('click', () => closePicker(true));

  // Click outside picker card closes without committing
  el.pickerOverlay.addEventListener('click', e => {
    if (e.target === el.pickerOverlay) closePicker(false);
  });

  // Hint button
  el.hintBtn.addEventListener('click', () => {
    if (state.hintUsed || state.submitted) return;
    state.hintUsed = true;
    el.hintBtn.disabled = true;
    const cHsl = hexToHsl(state.correctHex);
    el.hintText.textContent = `Hint: approximate complement hue ~ ${cHsl.h}°  (−5 pts)`;
    el.hintInfo.hidden = false;
    el.feedbackSection.hidden = false;
  });

  // Submit button
  el.submitBtn.addEventListener('click', () => {
    if (state.submitted) return;
    if (!state.playerHex) state.playerHex = state.givenHex;
    doSubmit();
  });

  // Next round / see results
  el.nextBtn.addEventListener('click', () => {
    if (state.round >= TOTAL_ROUNDS) {
      showResults();
    } else {
      state.round++;
      startRound();
    }
  });

  // Play again
  el.playAgain.addEventListener('click', resetGame);
}

// ── Boot ──────────────────────────────────────────────────

wireEvents();
startRound();
