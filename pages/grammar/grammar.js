// ============================================================
// Grammar Page: Dashboard + Skill hub with lazy-loaded thumbnails
// ============================================================

// ------------------------------------------------------------
// STUB — NOT REAL DATA.
// This represents the user's assessment state. It is a visual
// foundation only. Whoever owns assessment/session logic must
// replace this object and wire real values into it. Contract:
//   hasCompletedAssessment: boolean
//   bandScore: number if hasCompletedAssessment, else null
//   maxBandScore: number — the scale's ceiling used to compute
//     the ring's fill percentage. Defaulted to 9 here (IELTS
//     band scale) as a VISUAL PLACEHOLDER ONLY — confirm the
//     real scale with whoever owns scoring logic before relying
//     on this default.
// Do not delete this stub without providing a real data source —
// renderProgressRing() depends on this exact shape.
// ------------------------------------------------------------
const userAssessmentState = {
  hasCompletedAssessment: false,
  bandScore: null,
  maxBandScore: 9
};

// ------------------------------------------------------------
// Gauge geometry helpers.
// Angle convention: 0deg = top (12 o'clock), increasing clockwise.
// ------------------------------------------------------------
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 0) * Math.PI / 180;
  return {
    x: cx + r * Math.sin(rad),
    y: cy - r * Math.cos(rad)
  };
}

function describeArcPath(cx, cy, r, startAngleDeg, sweepDeg) {
  const endAngleDeg = startAngleDeg + sweepDeg;
  const start = polarToCartesian(cx, cy, r, startAngleDeg);
  const end = polarToCartesian(cx, cy, r, endAngleDeg);
  const largeArcFlag = sweepDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

// Gauge shape constants — gap sits at the bottom (6 o'clock),
// arc sweeps clockwise from bottom-left, over the top, to bottom-right.
const GAUGE_GAP_DEGREES = 40;
const GAUGE_START_ANGLE = 180 + GAUGE_GAP_DEGREES / 2; // bottom-left edge of gap
const GAUGE_TOTAL_SWEEP = 360 - GAUGE_GAP_DEGREES;

/**
 * Renders the gauge-style progress ring.
 * @param {number|null} value - current score, or null if no assessment yet.
 * @param {number} maxValue - the scale's maximum (see ARCHITECT.md note on this assumption).
 * @param {boolean} hasAssessment - whether the user has completed assessment.
 * @returns {string} SVG markup as a string.
 */
function renderProgressRing(value, maxValue, hasAssessment) {
  const size = 168;
  const strokeWidth = 14;
  const inset = 5;
  const center = size / 2;
  const radius = center - inset - strokeWidth / 2;

  if (!hasAssessment || value === null || value === undefined) {
    // First-time state: no ring line drawn at all, per spec.
    return `<svg class="grammar-ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"></svg>`;
  }

  const pct = Math.max(0, Math.min(100, (value / maxValue) * 100));
  const sweep = GAUGE_TOTAL_SWEEP * (pct / 100);

  if (sweep <= 0) {
    return `<svg class="grammar-ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"></svg>`;
  }

  const pathD = describeArcPath(center, center, radius, GAUGE_START_ANGLE, sweep);

  return `
    <svg class="grammar-ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <path
        class="grammar-ring-progress-arc"
        d="${pathD}"
        fill="none"
        stroke-width="${strokeWidth}"
        stroke-linecap="round"
      />
    </svg>
  `;
}

function renderGrammarDashboard() {
  const { hasCompletedAssessment, bandScore, maxBandScore } = userAssessmentState;
  const ringSvg = renderProgressRing(bandScore, maxBandScore, hasCompletedAssessment);
  const valueLabelClass = hasCompletedAssessment
    ? 'grammar-ring-value'
    : 'grammar-ring-value grammar-ring-value-na';
  const valueLabelText = hasCompletedAssessment ? bandScore : 'N/A';

  return `
    <div class="grammar-dashboard">
      <div class="grammar-dashboard-top">
        <div class="grammar-dashboard-left">
          <div class="grammar-placeholder-box"></div>
          <button class="grammar-start-btn" id="startDailyGrammarBtn" type="button">
            Start Daily Grammar Training
          </button>
        </div>
        <div class="grammar-dashboard-right">
          <div class="grammar-ring-wrapper">
            ${ringSvg}
            <div class="${valueLabelClass}">${valueLabelText}</div>
          </div>
          <div class="grammar-ring-label">Estimated grammar band score</div>
          <button class="grammar-detail-btn" id="grammarDetailBtn" type="button">
            Detail
          </button>
        </div>
      </div>
    </div>
  `;
}

const GRAMMAR_SKILLS = [
  { key: 'sentence-structure', label: 'Sentence Structure' },
  { key: 'parts-of-speech', label: 'Parts of Speech' },
  { key: 'basic-tenses', label: 'Basic Tenses' },
  { key: 'articles-determiners', label: 'Articles & Determiners' },
  { key: 'pronouns', label: 'Pronouns' },
  { key: 'prepositions', label: 'Prepositions' },
  { key: 'questions-negatives', label: 'Questions & Negatives' },
  { key: 'modals', label: 'Modals' },
  { key: 'conditionals', label: 'Conditionals' },
  { key: 'passive', label: 'Passive Voice' },
  { key: 'reported-speech', label: 'Reported Speech' },
  { key: 'clauses', label: 'Clauses' },
  { key: 'gerunds-infinitives', label: 'Gerunds & Infinitives' },
  { key: 'advanced-grammar', label: 'Advanced Grammar' }
];

function initGrammarPage() {
  const grammarView = document.getElementById('view-grammar');
  if (!grammarView) return;

  grammarView.innerHTML = `
    <div class="grammar-page">
      <h1 class="grammar-page-title">Grammar</h1>
      ${renderGrammarDashboard()}
      <div class="grammar-skills-container">
        <div class="skill-cards-grid" id="skillCardsGrid"></div>
      </div>
    </div>
  `;

  const skillCardsGrid = document.getElementById('skillCardsGrid');
  
  // Build skill cards
  GRAMMAR_SKILLS.forEach((skill, index) => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.id = `skill-card-${skill.key}`;
    
    card.innerHTML = `
      <div class="skill-card-image-wrapper">
        <img 
          class="skill-card-image loading" 
          data-src="images/grammar/${skill.key}.png"
          alt="${skill.label}"
          loading="lazy"
        />
        <div class="skill-card-image-placeholder" style="display: none;">
          Image placeholder: ${skill.label}
        </div>
      </div>
      <div class="skill-card-content">
        <h2 class="skill-card-title">${skill.label}</h2>
        <button class="skill-train-button" data-skill="${skill.key}">Train</button>
      </div>
    `;
    
    skillCardsGrid.appendChild(card);
  });

  // Set up lazy loading with IntersectionObserver
  setupLazyLoading();
  
  // Set up train button handlers
  setupTrainButtons();

  // Set up dashboard button handlers (visual foundation only —
  // destinations are not yet decided; see contract notes)
  setupDashboardButtons();
}

function setupDashboardButtons() {
  const startBtn = document.getElementById('startDailyGrammarBtn');
  const detailBtn = document.getElementById('grammarDetailBtn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      // No route/logic defined yet. Intentionally a no-op.
      console.log('[grammar dashboard] Start Daily Grammar Training clicked — no route wired yet.');
    });
  }

  if (detailBtn) {
    detailBtn.addEventListener('click', () => {
      // No route/logic defined yet. Intentionally a no-op.
      console.log('[grammar dashboard] Detail clicked — no route wired yet.');
    });
  }
}

function setupLazyLoading() {
  const imageWrappers = document.querySelectorAll('.skill-card-image-wrapper');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target.querySelector('.skill-card-image');
        const placeholder = entry.target.querySelector('.skill-card-image-placeholder');
        
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('loading');
          
          // Hide placeholder once image loads
          img.onload = () => {
            if (placeholder) placeholder.style.display = 'none';
          };
          
          // Keep placeholder visible if image fails to load
          img.onerror = () => {
            img.style.display = 'none';
            if (placeholder) placeholder.style.display = 'block';
          };
          
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    rootMargin: '50px' // Start loading 50px before card enters viewport
  });

  imageWrappers.forEach(wrapper => imageObserver.observe(wrapper));
}

function setupTrainButtons() {
  const trainButtons = document.querySelectorAll('.skill-train-button');
  trainButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const skillKey = e.target.dataset.skill;
      // Redirect to training page for this skill
      // For now, this is a placeholder — routes will be defined as features are built
      window.location.hash = `#grammar-train/${skillKey}`;
    });
  });
}

// Call init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGrammarPage);
} else {
  initGrammarPage();
}