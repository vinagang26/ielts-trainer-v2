// ============================================================
// services/grammarAgent.js
// Modular On-Demand Agent & Sub-agent Engine for Grammar Skills
// ============================================================
// Design Guarantee: Fully decoupled & reversible.
// Does NOT mutate any global state or break existing routing.

/**
 * Registry of On-Demand Sub-Agents for each of the 14 Grammar Skills.
 * Each sub-agent is lightweight and activated ONLY when requested.
 */
const GRAMMAR_SUBAGENTS = {
  'sentence-structure': {
    name: 'Sentence Structure Sub-agent',
    focus: 'Simple, compound, and complex sentence formation in IELTS writing.',
    modelTier: 'flash'
  },
  'parts-of-speech': {
    name: 'Parts of Speech Sub-agent',
    focus: 'Nouns, adjectives, adverbs, and word family transformations.',
    modelTier: 'flash'
  },
  'basic-tenses': {
    name: 'Basic Tenses Sub-agent',
    focus: 'Present simple, past simple, and present perfect accuracy.',
    modelTier: 'flash'
  },
  'articles-determiners': {
    name: 'Articles & Determiners Sub-agent',
    focus: 'Definite (the) vs indefinite (a/an) articles and quantifiers.',
    modelTier: 'flash'
  },
  'pronouns': {
    name: 'Pronouns Sub-agent',
    focus: 'Subject, object, possessive, and relative pronouns.',
    modelTier: 'flash'
  },
  'prepositions': {
    name: 'Prepositions Sub-agent',
    focus: 'Prepositions of time, place, and dependent prepositions.',
    modelTier: 'flash'
  },
  'questions-negatives': {
    name: 'Questions & Negatives Sub-agent',
    focus: 'Inversion, indirect questions, and negative structures.',
    modelTier: 'flash'
  },
  'modals': {
    name: 'Modals Sub-agent',
    focus: 'Modal verbs for possibility, obligation, and academic hedging.',
    modelTier: 'flash'
  },
  'conditionals': {
    name: 'Conditionals Sub-agent',
    focus: 'Zero, 1st, 2nd, 3rd, and mixed conditionals for IELTS Band 7+.',
    modelTier: 'flash'
  },
  'passive': {
    name: 'Passive Voice Sub-agent',
    focus: 'Passive constructions for formal and objective academic writing.',
    modelTier: 'flash'
  },
  'reported-speech': {
    name: 'Reported Speech Sub-agent',
    focus: 'Tense shifting and reporting verbs in formal contexts.',
    modelTier: 'flash'
  },
  'clauses': {
    name: 'Clauses Sub-agent',
    focus: 'Relative, adverbial, and noun clauses for sentence complexity.',
    modelTier: 'flash'
  },
  'gerunds-infinitives': {
    name: 'Gerunds & Infinitives Sub-agent',
    focus: 'Verb patterns following gerunds vs infinitives.',
    modelTier: 'flash'
  },
  'advanced-grammar': {
    name: 'Advanced Grammar Sub-agent',
    focus: 'Inversion, cleft sentences, and advanced discourse markers.',
    modelTier: 'flash'
  }
};

/**
 * Retrieves the specialized on-demand sub-agent configuration for a skill.
 * @param {string} skillKey - e.g. 'conditionals' or 'basic-tenses'
 */
function getGrammarSubAgent(skillKey) {
  const normalizedKey = skillKey.replace('grammar-train-', '');
  return GRAMMAR_SUBAGENTS[normalizedKey] || {
    name: 'General Grammar Sub-agent',
    focus: 'General IELTS grammar practice.',
    modelTier: 'flash'
  };
}

/**
 * Orchestrator Agent logic for "Start Daily Grammar Training".
 * Selects 2-3 active skills dynamically instead of loading all 14.
 * @param {Array<string>} [availableSkillKeys] 
 */
function orchestrateDailyTrainingMix(availableSkillKeys = Object.keys(GRAMMAR_SUBAGENTS)) {
  // Pick 3 random or targeted skills for the daily mix
  const shuffled = [...availableSkillKeys].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);
  
  return {
    masterAgent: 'IELTS Daily Grammar Orchestrator',
    activeSubAgents: selected.map(key => getGrammarSubAgent(key))
  };
}

// Expose globally for browser usage (no-build standard)
window.GrammarAgentService = {
  getGrammarSubAgent,
  orchestrateDailyTrainingMix,
  GRAMMAR_SUBAGENTS
};
