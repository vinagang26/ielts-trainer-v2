// ============================================================
// Grammar Page: Skill hub with lazy-loaded image thumbnails
// ============================================================

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
      <div class="grammar-skills-container">
        <h1 class="grammar-page-title">Grammar</h1>
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