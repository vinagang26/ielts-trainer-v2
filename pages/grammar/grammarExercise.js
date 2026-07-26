// ============================================================
// pages/grammar/grammarExercise.js
// Duolingo-style Word Block Component with Progress Bar & Self-Redemption
// ============================================================

function mountGrammarExercise(containerId, skillKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const exercises = window.GrammarExercisesService
    ? window.GrammarExercisesService.getExercisesForSkill(skillKey)
    : [];

  if (!exercises || !exercises.length) {
    container.innerHTML = `<p>No exercises available for this skill.</p>`;
    return;
  }

  const subAgent = window.GrammarAgentService
    ? window.GrammarAgentService.getGrammarSubAgent(skillKey)
    : { name: 'Grammar Expert', focus: 'IELTS Grammar' };

  let currentQuestionIndex = 0;
  const totalQuestions = exercises.length;
  let activeExercise = null;
  let selectedTokens = [];
  let availableTokens = [];
  let isLessonComplete = false;

  function loadQuestion(index) {
    if (index >= totalQuestions) {
      isLessonComplete = true;
      renderCompletionUI();
      return;
    }

    isLessonComplete = false;
    currentQuestionIndex = index;
    activeExercise = exercises[currentQuestionIndex];
    selectedTokens = [];
    availableTokens = [...activeExercise.scrambledTokens];
    renderExerciseUI();
  }

  function renderExerciseUI() {
    const progressPct = Math.round((currentQuestionIndex / totalQuestions) * 100);

    container.innerHTML = `
      <div class="duo-exercise-card">
        <!-- Duolingo Progress Bar Header -->
        <div class="duo-progress-container">
          <a href="#grammar" class="duo-close-btn" data-nav="grammar">&times;</a>
          <div class="duo-progress-bar-bg">
            <div class="duo-progress-bar-fill" style="width: ${progressPct}%;"></div>
          </div>
          <div class="duo-q-count">${currentQuestionIndex + 1} / ${totalQuestions}</div>
        </div>

        <div class="duo-header">
          <div class="duo-agent-pill">
            🤖 <span>${subAgent.name}</span>
          </div>
          <div class="duo-subtext">${subAgent.focus}</div>
        </div>

        <div class="duo-prompt-box">
          <p class="duo-prompt-text">${activeExercise.prompt}</p>
          <div class="duo-translation">💡 Translation: <em>"${activeExercise.translation}"</em></div>
        </div>

        <!-- Answer Slot Drop Zone -->
        <div class="duo-answer-zone" id="duoAnswerZone">
          ${selectedTokens.length === 0 ? '<span class="duo-placeholder-text">Tap word blocks below to construct your sentence...</span>' : ''}
          ${selectedTokens.map((word, idx) => `
            <button type="button" class="duo-word-chip selected" data-index="${idx}">${word}</button>
          `).join('')}
        </div>

        <!-- Word Bank Options -->
        <div class="duo-word-bank" id="duoWordBank">
          ${availableTokens.map((word, idx) => `
            <button type="button" class="duo-word-chip bank-item" data-index="${idx}">${word}</button>
          `).join('')}
        </div>

        <!-- Actions & Controls -->
        <div class="duo-actions">
          <button type="button" class="duo-btn duo-btn-reset" id="duoResetBtn" ${selectedTokens.length === 0 ? 'disabled' : ''}>Reset</button>
          <button type="button" class="duo-btn duo-btn-check" id="duoCheckBtn" ${selectedTokens.length === 0 ? 'disabled' : ''}>Check Answer</button>
        </div>

        <!-- Feedback Box -->
        <div class="duo-feedback-box" id="duoFeedbackBox" style="display: none;"></div>
      </div>
    `;

    bindEvents();
  }

  function renderCompletionUI() {
    container.innerHTML = `
      <div class="duo-exercise-card duo-completion-card">
        <!-- 100% Filled Progress Bar -->
        <div class="duo-progress-container">
          <div class="duo-progress-bar-bg">
            <div class="duo-progress-bar-fill" style="width: 100%;"></div>
          </div>
          <div class="duo-q-count">100%</div>
        </div>

        <div class="duo-celebration-box">
          <div class="duo-trophy-icon">🏆</div>
          <h2 class="duo-complete-title">Lesson Complete!</h2>
          <p class="duo-complete-subtitle">
            You mastered all ${totalQuestions} exercises for <strong>${subAgent.name}</strong>!
          </p>

          <div class="duo-redemption-card" id="redemptionCard">
            <div class="duo-redemption-icon">📊</div>
            <div class="duo-redemption-info">
              <strong>Band Score Boost:</strong> 7.5 / 9.0
              <p>Self-redeem your progress to update your Grammar Dashboard Ring Gauge.</p>
            </div>
            <button type="button" class="duo-btn duo-btn-redeem" id="redeemProgressBtn">
              🏆 Claim Progress & Update Band Score
            </button>
          </div>

          <div class="duo-completion-actions">
            <button type="button" class="duo-btn duo-btn-return" id="returnHubBtn">
              &larr; Return to Grammar Dashboard
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind redemption button
    const redeemBtn = container.querySelector('#redeemProgressBtn');
    const returnHubBtn = container.querySelector('#returnHubBtn');

    if (redeemBtn) {
      redeemBtn.addEventListener('click', () => {
        // Self-redemption: Update userAssessmentState if defined in window
        if (window.userAssessmentState) {
          window.userAssessmentState.hasCompletedAssessment = true;
          window.userAssessmentState.bandScore = 7.5;
        }

        const redemptionCard = container.querySelector('#redemptionCard');
        redemptionCard.innerHTML = `
          <div class="duo-redemption-success">
            ✅ <strong>Progress Redeemed!</strong><br/>
            Estimated Grammar Band Score updated to <strong>7.5</strong> on your Dashboard!
          </div>
        `;
      });
    }

    if (returnHubBtn) {
      returnHubBtn.addEventListener('click', () => {
        if (typeof window.showView === 'function') {
          window.showView('grammar');
        } else {
          location.hash = '#grammar';
        }
      });
    }
  }

  function bindEvents() {
    // Exit button
    const closeBtn = container.querySelector('.duo-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof window.showView === 'function') {
          window.showView('grammar');
        } else {
          location.hash = '#grammar';
        }
      });
    }

    // Click word in Word Bank -> move to Answer Zone
    const bankItems = container.querySelectorAll('.duo-word-chip.bank-item');
    bankItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const [moved] = availableTokens.splice(idx, 1);
        selectedTokens.push(moved);
        renderExerciseUI();
      });
    });

    // Click word in Answer Zone -> return to Word Bank
    const selectedItems = container.querySelectorAll('.duo-word-chip.selected');
    selectedItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        const [returned] = selectedTokens.splice(idx, 1);
        availableTokens.push(returned);
        renderExerciseUI();
      });
    });

    // Reset button
    const resetBtn = container.querySelector('#duoResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        availableTokens = [...activeExercise.scrambledTokens];
        selectedTokens = [];
        renderExerciseUI();
      });
    }

    // Check Answer button
    const checkBtn = container.querySelector('#duoCheckBtn');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        const userSentence = selectedTokens.join(' ');
        const correctSentence = activeExercise.correctTokens.join(' ');
        const feedbackBox = container.querySelector('#duoFeedbackBox');
        
        feedbackBox.style.display = 'block';

        const isCorrect = userSentence === correctSentence;
        const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
        const nextButtonText = isLastQuestion ? '🏆 Finish Lesson & Self-Redeem &rarr;' : 'Continue &rarr;';

        if (isCorrect) {
          feedbackBox.className = 'duo-feedback-box duo-feedback-success';
          feedbackBox.innerHTML = `
            <div class="duo-feedback-title">🎉 Excellent Job! Band 7+ Precision!</div>
            <div class="duo-feedback-body">${activeExercise.explanation}</div>
            ${activeExercise.tip ? `<div class="duo-ielts-tip">🎯 <strong>IELTS Tip:</strong> ${activeExercise.tip}</div>` : ''}
            <div class="duo-next-row">
              <button type="button" class="duo-btn duo-btn-next" id="duoNextBtn">${nextButtonText}</button>
            </div>
          `;
        } else {
          feedbackBox.className = 'duo-feedback-box duo-feedback-error';
          feedbackBox.innerHTML = `
            <div class="duo-feedback-title">❌ Grammar Analysis & Correction</div>
            <div class="duo-feedback-body">
              <div class="duo-diff-row">
                <div class="duo-diff-item duo-diff-wrong">
                  <strong>Your Order:</strong> "${userSentence}"
                </div>
                <div class="duo-diff-item duo-diff-correct">
                  <strong>Correct Order:</strong> "${correctSentence}"
                </div>
              </div>
              <div class="duo-analysis-card">
                <div class="duo-analysis-heading">📚 <em>${subAgent.name} Rule Analysis:</em></div>
                <p class="duo-analysis-text">${activeExercise.explanation}</p>
                ${activeExercise.tip ? `
                  <div class="duo-ielts-tip">
                    🎯 <strong>IELTS Examiner Tip:</strong> ${activeExercise.tip}
                  </div>
                ` : ''}
              </div>
            </div>
            <div class="duo-next-row">
              <button type="button" class="duo-btn duo-btn-next" id="duoNextBtn">${nextButtonText}</button>
            </div>
          `;
        }

        // Attach Next Question handler
        const nextBtn = feedbackBox.querySelector('#duoNextBtn');
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            loadQuestion(currentQuestionIndex + 1);
          });
        }
      });
    }
  }

  loadQuestion(0);
}

window.GrammarExerciseUI = {
  mountGrammarExercise
};
