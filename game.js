const ROUND_DURATION = 60;
const MIN_FILLED_SCORE = 5;

const RELATIONSHIPS = [
  { name: "complementary", targets: [180], maxPoints: 50 },
  { name: "triadic", targets: [120, 240], maxPoints: 35 },
  { name: "analogous", targets: [30, 330], maxPoints: 20 },
];

const state = {
  principle: "Color",
  cumulativeScore: 0,
  timeRemaining: ROUND_DURATION,
  timerId: null,
  roundSubmitted: false,
  feedbackVisible: false,
  primaryHex: "#000000",
  secondaryHex: null,
  tertiaryHex: null,
  latestResult: null,
};

const elements = {
  principleName: document.querySelector("#principle-name"),
  timer: document.querySelector("#timer"),
  roundStatus: document.querySelector("#round-status"),
  roundScore: document.querySelector("#round-score"),
  roundScoreCaption: document.querySelector("#round-score-caption"),
  primaryShape: document.querySelector("#primary-shape"),
  primaryHex: document.querySelector("#primary-hex"),
  secondaryShape: document.querySelector("#secondary-shape"),
  secondaryHex: document.querySelector("#secondary-hex"),
  tertiaryShape: document.querySelector("#tertiary-shape"),
  tertiaryHex: document.querySelector("#tertiary-hex"),
  secondaryInput: document.querySelector("#secondary-input"),
  tertiaryInput: document.querySelector("#tertiary-input"),
  secondaryTrigger: document.querySelector("#secondary-trigger"),
  tertiaryTrigger: document.querySelector("#tertiary-trigger"),
  submitRound: document.querySelector("#submit-round"),
  toggleFeedback: document.querySelector("#toggle-feedback"),
  nextRound: document.querySelector("#next-round"),
  feedbackPanel: document.querySelector("#feedback-panel"),
  feedbackText: document.querySelector("#feedback-text"),
  cumulativeScore: document.querySelector("#cumulative-score"),
  skipRound: document.querySelector("#skip-round"),
  resetGame: document.querySelector("#reset-game"),
  aboutButton: document.querySelector("#about-button"),
  aboutDialog: document.querySelector("#about-dialog"),
};

function init() {
  wireEvents();
  startRound();
}

function wireEvents() {
  elements.secondaryTrigger.addEventListener("click", () => {
    if (!state.roundSubmitted) {
      elements.secondaryInput.click();
    }
  });

  elements.tertiaryTrigger.addEventListener("click", () => {
    if (!state.roundSubmitted) {
      elements.tertiaryInput.click();
    }
  });

  elements.secondaryInput.addEventListener("input", (event) => {
    applyPlayerColor("secondary", event.target.value);
  });

  elements.tertiaryInput.addEventListener("input", (event) => {
    applyPlayerColor("tertiary", event.target.value);
  });

  elements.submitRound.addEventListener("click", () => submitRound("manual"));
  elements.nextRound.addEventListener("click", () => startRound());
  elements.skipRound.addEventListener("click", () => skipRound());
  elements.resetGame.addEventListener("click", resetGame);

  elements.toggleFeedback.addEventListener("click", () => {
    state.feedbackVisible = !state.feedbackVisible;
    elements.feedbackPanel.hidden = !state.feedbackVisible;
    elements.toggleFeedback.textContent = state.feedbackVisible ? "Hide Feedback" : "View Feedback";
  });

  elements.aboutButton.addEventListener("click", () => {
    if (typeof elements.aboutDialog.showModal === "function") {
      elements.aboutDialog.showModal();
    }
  });
}

function startRound() {
  stopTimer();

  state.timeRemaining = ROUND_DURATION;
  state.roundSubmitted = false;
  state.feedbackVisible = false;
  state.primaryHex = randomHexColor();
  state.secondaryHex = null;
  state.tertiaryHex = null;
  state.latestResult = null;

  elements.principleName.textContent = state.principle;
  elements.roundStatus.textContent = "Match the primary color with two supporting choices before the timer runs out.";
  elements.roundScore.textContent = "--";
  elements.roundScore.className = "";
  elements.roundScoreCaption.textContent = "Submit your colors to reveal the result.";
  elements.feedbackText.textContent = "";
  elements.feedbackPanel.hidden = true;
  elements.toggleFeedback.disabled = true;
  elements.toggleFeedback.textContent = "View Feedback";
  elements.nextRound.disabled = true;
  elements.submitRound.disabled = false;
  elements.skipRound.disabled = false;
  elements.secondaryTrigger.disabled = false;
  elements.tertiaryTrigger.disabled = false;
  elements.secondaryInput.value = "#7a8cff";
  elements.tertiaryInput.value = "#ff8f7a";

  updateTimerDisplay();
  renderPrimary();
  renderPlayerShape("secondary", null);
  renderPlayerShape("tertiary", null);

  state.timerId = window.setInterval(tickTimer, 1000);
}

function tickTimer() {
  state.timeRemaining -= 1;
  updateTimerDisplay();

  if (state.timeRemaining <= 0) {
    submitRound("timeout");
  }
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(state.timeRemaining / 60)).padStart(2, "0");
  const seconds = String(state.timeRemaining % 60).padStart(2, "0");
  elements.timer.textContent = `${minutes}:${seconds}`;
  elements.timer.classList.toggle("timer-urgent", state.timeRemaining <= 10);
}

function stopTimer() {
  if (state.timerId) {
    window.clearInterval(state.timerId);
    state.timerId = null;
  }
}

function renderPrimary() {
  elements.primaryShape.style.background = state.primaryHex;
  elements.primaryHex.textContent = state.primaryHex.toUpperCase();
}

function applyPlayerColor(slot, value) {
  const normalized = value.toUpperCase();
  if (slot === "secondary") {
    state.secondaryHex = normalized;
  } else {
    state.tertiaryHex = normalized;
  }

  renderPlayerShape(slot, normalized);
}

function renderPlayerShape(slot, value) {
  const shape = slot === "secondary" ? elements.secondaryShape : elements.tertiaryShape;
  const label = slot === "secondary" ? elements.secondaryHex : elements.tertiaryHex;

  if (!value) {
    shape.classList.add("shape--placeholder");
    if (slot === "secondary") {
      shape.style.background = "#3a4154";
    } else {
      shape.style.borderBottomColor = "#3a4154";
    }
    label.textContent = "Pick a color";
    return;
  }

  shape.classList.remove("shape--placeholder");
  if (slot === "secondary") {
    shape.style.background = value;
  } else {
    shape.style.borderBottomColor = value;
  }
  label.textContent = value;
}

function submitRound(reason) {
  if (state.roundSubmitted) {
    return;
  }

  stopTimer();
  state.roundSubmitted = true;

  const result = scoreRound();
  state.latestResult = result;
  state.cumulativeScore += result.total;

  elements.cumulativeScore.textContent = String(state.cumulativeScore);
  elements.roundScore.textContent = `${result.total}/100`;
  elements.roundScore.classList.add(result.total >= 70 ? "score-positive" : "score-neutral");
  elements.roundScoreCaption.textContent = reason === "timeout"
    ? "Time expired, so the round was submitted automatically."
    : "Round complete. Open feedback to see what your palette was doing.";
  elements.feedbackText.textContent = buildFeedback(result);
  elements.toggleFeedback.disabled = false;
  elements.nextRound.disabled = false;
  elements.submitRound.disabled = true;
  elements.skipRound.disabled = true;
  elements.secondaryTrigger.disabled = true;
  elements.tertiaryTrigger.disabled = true;
  elements.roundStatus.textContent = "Round locked. Review your result, then move into the next principle.";
}

function skipRound() {
  stopTimer();
  startRound();
}

function resetGame() {
  state.cumulativeScore = 0;
  elements.cumulativeScore.textContent = "0";
  startRound();
}

function scoreRound() {
  const primaryHue = hexToHsl(state.primaryHex).h;
  const secondaryResult = scoreColorChoice(primaryHue, state.secondaryHex);
  const tertiaryResult = scoreColorChoice(primaryHue, state.tertiaryHex);

  return {
    total: secondaryResult.points + tertiaryResult.points,
    secondary: secondaryResult,
    tertiary: tertiaryResult,
  };
}

function scoreColorChoice(primaryHue, selectedHex) {
  if (!selectedHex) {
    return {
      points: 0,
      relationship: "unfilled",
      hueDistance: null,
      improvement: "Pick a color before submitting to score this slot.",
    };
  }

  const selectedHue = hexToHsl(selectedHex).h;
  const hueDistance = directedHueDistance(primaryHue, selectedHue);
  let bestMatch = null;

  for (const relationship of RELATIONSHIPS) {
    for (const target of relationship.targets) {
      const delta = Math.abs(hueDistance - target);
      if (delta <= 2) {
        const tapered = Math.round(relationship.maxPoints - ((relationship.maxPoints - MIN_FILLED_SCORE) * (delta / 2)));
        const candidate = {
          points: tapered,
          relationship: relationship.name,
          hueDistance,
          delta,
          target,
        };

        if (!bestMatch || candidate.points > bestMatch.points) {
          bestMatch = candidate;
        }
      }
    }
  }

  if (bestMatch) {
    return {
      ...bestMatch,
      improvement: bestMatch.delta === 0
        ? `You hit the ${bestMatch.relationship} target exactly.`
        : `A slight hue shift toward ${bestMatch.target} degrees of separation would raise the score.`,
    };
  }

  return {
    points: MIN_FILLED_SCORE,
    relationship: "no match",
    hueDistance,
    improvement: "Aim closer to analogous, triadic, or complementary spacing on the color wheel.",
  };
}

function buildFeedback(result) {
  const secondarySummary = describeSlot("secondary", result.secondary);
  const tertiarySummary = describeSlot("tertiary", result.tertiary);
  const supportLine = result.total >= 70
    ? "Together, those picks support the Color principle with a clear sense of intentional relationship."
    : "Together, the palette feels less intentional, so the Color principle reads more weakly this round.";
  const suggestion = result.secondary.points < result.tertiary.points
    ? result.secondary.improvement
    : result.tertiary.improvement;

  return `${secondarySummary} ${tertiarySummary} ${supportLine} Suggestion: ${suggestion}`;
}

function describeSlot(slotName, slotResult) {
  const label = slotName === "secondary" ? "Your secondary color" : "Your tertiary color";

  if (slotResult.relationship === "unfilled") {
    return `${label} was left empty, so it scored 0 points.`;
  }

  if (slotResult.relationship === "no match") {
    return `${label} landed ${slotResult.hueDistance} degrees away from the primary, which did not align with the target relationships and scored ${slotResult.points} points.`;
  }

  return `${label} most closely matched a ${slotResult.relationship} relationship at ${slotResult.hueDistance} degrees and scored ${slotResult.points} points.`;
}

function randomHexColor() {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.floor(Math.random() * 21);
  const lightness = 45 + Math.floor(Math.random() * 11);
  return hslToHex(hue, saturation, lightness);
}

function directedHueDistance(primaryHue, selectedHue) {
  return (selectedHue - primaryHue + 360) % 360;
}

function hexToHsl(hex) {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        hue = ((b - r) / delta + 2) * 60;
        break;
      default:
        hue = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

function hslToHex(h, s, l) {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = h / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (huePrime >= 0 && huePrime < 1) {
    r1 = chroma;
    g1 = x;
  } else if (huePrime < 2) {
    r1 = x;
    g1 = chroma;
  } else if (huePrime < 3) {
    g1 = chroma;
    b1 = x;
  } else if (huePrime < 4) {
    g1 = x;
    b1 = chroma;
  } else if (huePrime < 5) {
    r1 = x;
    b1 = chroma;
  } else {
    r1 = chroma;
    b1 = x;
  }

  const match = lightness - chroma / 2;
  const toHex = (value) => Math.round((value + match) * 255).toString(16).padStart(2, "0");

  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`.toUpperCase();
}

init();
