// ============================================================
// services/grammarExercises.js
// Dynamic IELTS Exercise Generation & Deep Grammar Diagnostics
// ============================================================

const IELTS_TOPICS = [
  'technology', 'education', 'environment', 'economy',
  'urbanization', 'healthcare', 'globalization', 'society'
];

/**
 * Skill Template Generators for On-Demand Fresh IELTS Questions.
 * Generates brand new sentences every time the user starts a session!
 */
const SKILL_GENERATOR_TEMPLATES = {
  'sentence-structure': [
    {
      prompt: 'Arrange the word blocks to form a complex sentence with a dependent clause:',
      translation: 'Mặc dù tự động hóa làm tăng hiệu suất, nó cũng mang lại những thách thức về việc làm.',
      correct: ['Although', 'automation', 'increases', 'efficiency,', 'it', 'also', 'poses', 'employment', 'challenges.'],
      rule: 'Adversative subordinate clauses introduced by "Although" must be followed by a comma before the main clause.',
      tip: 'Using complex sentences with varied subordinate clauses boosts your Grammatical Range score to Band 7.0+.'
    },
    {
      prompt: 'Arrange the word blocks into a compound sentence using formal conjunctive adverbs:',
      translation: 'Nguồn năng lượng tái tạo đang trở nên rẻ hơn; do đó, các quốc gia đang đầu tư mạnh mẽ.',
      correct: ['Renewable', 'energy', 'is', 'becoming', 'cheaper;', 'consequently,', 'nations', 'are', 'investing', 'heavily.'],
      rule: 'Use a semicolon before conjunctive adverbs like "consequently" when joining independent clauses.',
      tip: 'Formal conjunctive adverbs demonstrate sophisticated cohesion in IELTS Writing Task 2.'
    },
    {
      prompt: 'Arrange the word blocks using an introductory participial clause:',
      translation: 'Nhận thức được tác động môi trường, các tập đoàn đã chọn sử dụng vật liệu xanh.',
      correct: ['Recognizing', 'environmental', 'impacts,', 'corporations', 'adopted', 'sustainable', 'materials.'],
      scrambled: ['corporations', 'adopted', 'Recognizing', 'impacts,', 'materials.', 'environmental', 'sustainable'],
      rule: 'Present participial phrases ("Recognizing...") modify the subject of the main clause ("corporations").',
      tip: 'Participial structures add variety and maturity to complex academic essays.'
    }
  ],
  'parts-of-speech': [
    {
      prompt: 'Arrange the word blocks using correct adjective and adverb positions:',
      translation: 'Chính quyền phải giải quyết triệt để sự thiếu hụt cơ sở hạ tầng.',
      correct: ['Authorities', 'must', 'thoroughly', 'address', 'the', 'critical', 'infrastructure', 'shortage.'],
      rule: 'Adverbs ("thoroughly") modify verbs ("address"), while adjectives ("critical") modify nouns ("shortage").',
      tip: 'Using accurate word families demonstrates strong Lexical Resource and Grammatical Accuracy.'
    },
    {
      prompt: 'Arrange the word blocks using nominalization for formal academic tone:',
      translation: 'Sự cắt giảm khí thải carbon đòi hỏi sự hợp tác quốc tế khẩn cấp.',
      correct: ['The', 'reduction', 'of', 'carbon', 'emissions', 'requires', 'urgent', 'international', 'cooperation.'],
      rule: 'Nominalization converts verbs into nouns ("reduction") to create objective academic statements.',
      tip: 'Nominalized structures are a hallmark of high-scoring IELTS Task 2 academic essays.'
    },
    {
      prompt: 'Arrange the word blocks with appropriate parallel grammatical structures:',
      translation: 'Dự án nhằm mục đích cải thiện giáo dục và thúc đẩy cơ hội việc làm.',
      correct: ['The', 'project', 'aims', 'to', 'improve', 'education', 'and', 'promote', 'job', 'opportunities.'],
      rule: 'Parallelism requires matching grammatical forms after conjunctions ("to improve... and promote...").',
      tip: 'Maintaining parallel structure prevents awkward syntax in long sentences.'
    }
  ],
  'basic-tenses': [
    {
      prompt: 'Arrange the word blocks using Present Perfect Continuous for ongoing trends:',
      translation: 'Các nhà nghiên cứu đã và đang phân tích dữ liệu đô thị hóa trong những năm gần đây.',
      correct: ['Researchers', 'have', 'been', 'analyzing', 'urbanization', 'data', 'in', 'recent', 'years.'],
      rule: 'Present Perfect Continuous ("have been analyzing") emphasizes duration extending into the present.',
      tip: 'Use Present Perfect Continuous when discussing trends in IELTS Writing Task 1 & Task 2.'
    },
    {
      prompt: 'Arrange the word blocks using Past Perfect for chronological clarity:',
      translation: 'Chính phủ đã thông qua đạo luật trước khi nền kinh tế bước vào suy thoái.',
      correct: ['The', 'government', 'had', 'passed', 'legislation', 'before', 'the', 'recession', 'began.'],
      rule: 'Past Perfect ("had passed") specifies an action completed prior to another past event ("began").',
      tip: 'Clear temporal sequencing using Past Perfect earns high marks in historical narrative prompts.'
    },
    {
      prompt: 'Arrange the word blocks using Future Perfect for milestone projections:',
      translation: 'Đến giữa thế kỷ này, nhiều quốc gia sẽ chuyển sang năng lượng mặt trời hoàn toàn.',
      correct: ['By', 'mid-century,', 'many', 'countries', 'will', 'have', 'transitioned', 'to', 'solar', 'energy.'],
      rule: 'Future Perfect ("will have transitioned") expresses completed actions at a future target time.',
      tip: 'Essential tense for Task 1 map/diagram projections and Task 2 future predictions.'
    }
  ],
  'articles-determiners': [
    {
      prompt: 'Arrange the word blocks with correct definite and zero articles:',
      translation: 'Trí tuệ nhân tạo đang thay đổi cuộc sống hàng ngày trên toàn thế giới.',
      correct: ['Artificial', 'intelligence', 'is', 'transforming', 'daily', 'life', 'across', 'the', 'globe.'],
      rule: 'Abstract concepts used generally ("Artificial intelligence") take zero article; "the globe" takes definite article.',
      tip: 'Article errors are the #1 reason students miss Band 7.0 in Grammatical Accuracy.'
    },
    {
      prompt: 'Arrange the word blocks using formal quantifiers:',
      translation: 'Rất ít sinh viên chọn ngành khoa học mà không có học bổng.',
      correct: ['Few', 'students', 'choose', 'science', 'majors', 'without', 'financial', 'scholarships.'],
      rule: '"Few" has a negative connotation ("almost none") used with countable plural nouns.',
      tip: 'Distinguish clearly between "few" (negative) and "a few" (positive) in IELTS writing.'
    },
    {
      prompt: 'Arrange the word blocks with distributive determiners:',
      translation: 'Mỗi ứng viên phải hoàn thành bài đánh giá ngôn ngữ toàn diện.',
      correct: ['Every', 'candidate', 'must', 'complete', 'a', 'comprehensive', 'language', 'assessment.'],
      rule: '"Every" is a distributive determiner followed by a singular countable noun ("candidate").',
      tip: 'Ensure singular verbs and nouns follow "every" and "each".'
    }
  ],
  'pronouns': [
    {
      prompt: 'Arrange the word blocks using non-defining relative pronouns:',
      translation: 'Năng lượng hạt nhân, vốn còn gây tranh cãi, cung cấp nguồn điện dồi dào.',
      correct: ['Nuclear', 'power,', 'which', 'remains', 'controversial,', 'provides', 'abundant', 'electricity.'],
      rule: 'Use "which" with commas for non-defining clauses adding extra background detail.',
      tip: 'Non-defining relative clauses showcase advanced complex sentence mechanics.'
    },
    {
      prompt: 'Arrange the word blocks using demonstrative pronoun reference:',
      translation: 'Những biện pháp này sẽ làm giảm ô nhiễm môi trường đáng kể.',
      correct: ['These', 'measures', 'will', 'significantly', 'reduce', 'environmental', 'pollution.'],
      rule: '"These" points back to previously mentioned plural nouns or ideas.',
      tip: 'Clear pronoun referencing improves Coherence and Cohesion in Task 2.'
    },
    {
      prompt: 'Arrange the word blocks using relative pronoun "whose" for possession:',
      translation: 'Các công ty có chiến lược đổi mới sẽ thu hút được tài năng hàng đầu.',
      correct: ['Companies', 'whose', 'strategies', 'embrace', 'innovation', 'attract', 'top', 'talent.'],
      rule: '"whose" indicates possession for both human and non-human nouns in formal English.',
      tip: 'Using "whose" avoids wordy phrases like "the strategies of which".'
    }
  ],
  'prepositions': [
    {
      prompt: 'Arrange the word blocks using dependent prepositions of cause:',
      translation: 'Tỷ lệ thất nghiệp tăng cao chủ yếu do biến động kinh tế.',
      correct: ['High', 'unemployment', 'is', 'largely', 'attributable', 'to', 'economic', 'instability.'],
      rule: 'Adjective "attributable" collocates strictly with preposition "to".',
      tip: 'Collocational accuracy with prepositions is heavily tested in IELTS academic vocabulary.'
    },
    {
      prompt: 'Arrange the word blocks using prepositions of contrast:',
      translation: 'Bất chấp những rào cản ban đầu, cuộc thử nghiệm đã mang lại kết quả tích cực.',
      correct: ['Despite', 'initial', 'obstacles,', 'the', 'trial', 'yielded', 'promising', 'results.'],
      rule: '"Despite" is a preposition followed directly by a noun phrase ("initial obstacles"), never "of".',
      tip: 'Never write "despite of" — use either "despite" or "in spite of".'
    },
    {
      prompt: 'Arrange the word blocks using prepositions of proportion:',
      translation: 'Tỷ lệ sinh đã giảm mạnh ở mức độ chưa từng có.',
      correct: ['Fertility', 'rates', 'declined', 'sharply', 'to', 'an', 'unprecedented', 'degree.'],
      rule: 'Preposition "to" collocates with "degree" or "extent" ("to an unprecedented degree").',
      tip: 'Essential phrasing for IELTS Task 1 trend descriptions.'
    }
  ],
  'questions-negatives': [
    {
      prompt: 'Arrange the word blocks into formal indirect embedded questions:',
      translation: 'Nghiên cứu điều tra xem liệu tiêu thụ đường có ảnh hưởng đến trí nhớ không.',
      correct: ['The', 'study', 'investigates', 'whether', 'sugar', 'consumption', 'affects', 'memory.'],
      rule: 'Embedded indirect questions use statement word order without auxiliary inversion.',
      tip: 'Embedded questions are a sophisticated alternative to direct question prompts.'
    },
    {
      prompt: 'Arrange the word blocks using negative adverbial opening with inversion:',
      translation: 'Chưa bao giờ nhu cầu về năng lượng sạch lại cấp thiết như bây giờ.',
      correct: ['Seldom', 'has', 'the', 'demand', 'for', 'clean', 'energy', 'been', 'so', 'urgent.'],
      rule: 'Fronted negative adverbs ("Seldom") require auxiliary inversion ("has the demand been").',
      tip: 'Inversion is a Band 8.0+ grammar structure when used naturally in essay conclusions.'
    },
    {
      prompt: 'Arrange the word blocks using formal double negation for hedging:',
      translation: 'Không phải là không thể giải quyết vấn đề rác thải nhựa.',
      correct: ['It', 'is', 'not', 'impossible', 'to', 'resolve', 'the', 'plastic', 'waste', 'crisis.'],
      rule: 'Double negation ("not impossible") hedges claims appropriately in academic writing.',
      tip: 'Hedging avoids overly dogmatic claims in IELTS Writing Task 2.'
    }
  ],
  'modals': [
    {
      prompt: 'Arrange the word blocks using past modal deduction:',
      translation: 'Chính quyền hẳn là đã lường trước được cuộc khủng hoảng giao thông.',
      correct: ['Authorities', 'must', 'have', 'anticipated', 'the', 'severe', 'traffic', 'congestion.'],
      rule: '"must have + past participle" expresses strong certainty about past events.',
      tip: 'Past modals demonstrate complex hypothetical reasoning in Task 2.'
    },
    {
      prompt: 'Arrange the word blocks using modal verbs for tentative recommendations:',
      translation: 'Các trường học nên tích hợp tư duy phản biện vào chương trình giảng dạy.',
      correct: ['Educational', 'institutions', 'should', 'integrate', 'critical', 'thinking', 'into', 'curricula.'],
      rule: '"should" expresses strong advice without sounding overly dictatorial.',
      tip: 'Ideal modal choice for proposal or recommendation body paragraphs.'
    },
    {
      prompt: 'Arrange the word blocks expressing theoretical possibility:',
      translation: 'Các công nghệ mới có thể mở ra những ngành công nghiệp hoàn toàn mới.',
      correct: ['Emerging', 'technologies', 'may', 'potentially', 'unlock', 'entirely', 'new', 'industries.'],
      rule: '"may" expresses academic possibility with appropriate tentative tone.',
      tip: 'Academic writing prefers "may/could" over definitive assertions like "will".'
    }
  ],
  'conditionals': [
    {
      prompt: 'Arrange the word blocks into a Third Conditional structure:',
      translation: 'Nếu thành phố đầu tư vào vận tải công cộng, ô nhiễm đã giảm đáng kể.',
      correct: ['If', 'the', 'city', 'had', 'invested', 'in', 'transit,', 'pollution', 'would', 'have', 'dropped.'],
      rule: 'Third Conditional formula: If + past perfect (had invested), would have + past participle (would have dropped).',
      tip: 'Third conditionals express unreal past situations and their past consequences.'
    },
    {
      prompt: 'Arrange the word blocks into a Mixed Conditional sentence:',
      translation: 'Nếu họ đã tiết kiệm tài nguyên năm ngoái, họ sẽ không phải đối mặt với tình trạng thiếu hụt bây giờ.',
      correct: ['If', 'they', 'had', 'conserved', 'resources,', 'they', 'would', 'not', 'face', 'shortages', 'now.'],
      rule: 'Mixed Conditional combines past condition ("had conserved") with present result ("would not face now").',
      tip: 'Mixed conditionals are high-level structures that impress IELTS examiners.'
    },
    {
      prompt: 'Arrange the word blocks using inverted conditional structure without "If":',
      translation: 'Nếu chính phủ can thiệp sớm hơn, cuộc khủng hoảng đã có thể tránh được.',
      correct: ['Had', 'the', 'government', 'intervened', 'earlier,', 'the', 'crisis', 'could', 'be', 'averted.'],
      rule: 'Inverted conditional omits "If" and fronting auxiliary "Had" ("Had the government intervened...").',
      tip: 'Inverted conditionals represent top-tier (Band 8.0-9.0) grammatical mastery.'
    }
  ],
  'passive': [
    {
      prompt: 'Arrange the word blocks using impersonal passive reporting:',
      translation: 'Người ta ước tính rằng dân số thế giới sẽ sớm đạt đỉnh.',
      correct: ['It', 'is', 'estimated', 'that', 'the', 'global', 'population', 'will', 'peak', 'soon.'],
      rule: 'Impersonal passive ("It is estimated that...") removes personal pronouns for objective writing.',
      tip: 'Standard structure for introducing data projections in Task 1 reports.'
    },
    {
      prompt: 'Arrange the word blocks using continuous passive voice:',
      translation: 'Các chính sách năng lượng mới đang được thảo luận tại nghị viện.',
      correct: ['New', 'energy', 'policies', 'are', 'currently', 'being', 'debated', 'in', 'parliament.'],
      rule: 'Present Continuous Passive: subject + am/is/are + being + past participle.',
      tip: 'Use continuous passive when describing ongoing processes or actions in progress.'
    },
    {
      prompt: 'Arrange the word blocks using modal passive voice:',
      translation: 'Tài nguyên thiên nhiên phải được bảo vệ cho các thế hệ tương lai.',
      correct: ['Natural', 'resources', 'must', 'be', 'safeguarded', 'for', 'future', 'generations.'],
      rule: 'Modal Passive formula: modal verb + be + past participle ("must be safeguarded").',
      tip: 'Crucial passive structure for solutions-oriented essay conclusions.'
    }
  ],
  'reported-speech': [
    {
      prompt: 'Arrange the word blocks with backshifting tense rules:',
      translation: 'Các nhà phân tích báo cáo rằng giá tiêu dùng đã tăng mạnh.',
      correct: ['Analysts', 'reported', 'that', 'consumer', 'prices', 'had', 'risen', 'sharply.'],
      rule: 'When main verb is past ("reported"), present perfect backshifts to past perfect ("had risen").',
      tip: 'Backshifting tense accuracy is essential when paraphrasing secondary research.'
    },
    {
      prompt: 'Arrange the word blocks reporting a recommendation using subjunctive clause:',
      translation: 'Ủy ban đề xuất rằng hội đồng thành phố nên nâng cấp hệ thống lọc nước.',
      correct: ['The', 'committee', 'recommended', 'that', 'the', 'council', 'upgrade', 'water', 'facilities.'],
      rule: 'Verbs of suggestion ("recommended that...") take base form subjunctive ("upgrade").',
      tip: 'Subjunctive reported speech avoids wordiness and highlights formal command of syntax.'
    },
    {
      prompt: 'Arrange the word blocks reporting a contrastive statement:',
      translation: 'Bản báo cáo khẳng định rằng mặc dù chi phí tăng, lợi nhuận vẫn dương.',
      correct: ['The', 'report', 'affirmed', 'that', 'despite', 'rising', 'costs,', 'profits', 'remained', 'positive.'],
      rule: 'Reported complex statements preserve subordinate clauses accurately.',
      tip: 'Accurate complex reporting verbs ("affirmed", "asserted") replace repetitive "said".'
    }
  ],
  'clauses': [
    {
      prompt: 'Arrange the word blocks using reduced participial clauses:',
      translation: 'Được thiết kế bởi các kiến trúc sư hàng đầu, tòa nhà sử dụng năng lượng tối thiểu.',
      correct: ['Designed', 'by', 'leading', 'architects,', 'the', 'building', 'uses', 'minimal', 'energy.'],
      rule: 'Past participial clause ("Designed by...") functions as a reduced passive relative clause.',
      tip: 'Reduced clauses make academic writing concise, punchy, and sophisticated.'
    },
    {
      prompt: 'Arrange the word blocks using a noun clause as subject complement:',
      translation: 'Thách thức chính là liệu các nước phát triển có giảm thải không.',
      correct: ['The', 'main', 'challenge', 'is', 'whether', 'developed', 'nations', 'will', 'cut', 'emissions.'],
      rule: 'Noun clause starting with "whether" completes the linking verb "is".',
      tip: 'Noun clauses enrich sentence complexity without creating fragment errors.'
    },
    {
      prompt: 'Arrange the word blocks using an adverbial clause of concession:',
      translation: 'Dù cho công nghệ phát triển nhanh, một số khu vực vẫn thiếu kết nối.',
      correct: ['Even', 'though', 'technology', 'advances', 'rapidly,', 'some', 'regions', 'lack', 'connectivity.'],
      rule: 'Concessive clauses ("Even though...") contrast two ideas while maintaining grammatical balance.',
      tip: 'Great clause structure for presenting balanced counter-arguments in Task 2.'
    }
  ],
  'gerunds-infinitives': [
    {
      prompt: 'Arrange the word blocks using gerunds after prepositions:',
      translation: 'Chính phủ đang tập trung vào việc giảm bớt rào cản quan liêu.',
      correct: ['The', 'government', 'is', 'focusing', 'on', 'reducing', 'bureaucratic', 'red', 'tape.'],
      rule: 'Prepositions ("on") must be followed by a gerund noun form ("reducing").',
      tip: 'Preposition + gerund is a foundational rule tested across all IELTS components.'
    },
    {
      prompt: 'Arrange the word blocks using passive infinitives:',
      translation: 'Những thay đổi này dự kiến sẽ được thực hiện vào năm tới.',
      correct: ['These', 'modifications', 'are', 'expected', 'to', 'be', 'implemented', 'next', 'year.'],
      rule: 'Passive Infinitive structure: to + be + past participle ("to be implemented").',
      tip: 'Passive infinitives express formal expectations in academic reports.'
    },
    {
      prompt: 'Arrange the word blocks with verb + object + bare infinitive:',
      translation: 'Chính sách mới đã giúp các hộ gia đình tiết kiệm chi phí sưởi ấm.',
      correct: ['The', 'new', 'policy', 'helped', 'households', 'save', 'on', 'heating', 'expenses.'],
      rule: 'The verb "help" can take a bare infinitive without "to" ("helped households save").',
      tip: 'Understanding bare vs full infinitive complements avoids grammatical slip-ups.'
    }
  ],
  'advanced-grammar': [
    {
      prompt: 'Arrange the word blocks using a Cleft Sentence for emphatic focus:',
      translation: 'Chính việc đầu tư vào nghiên cứu đã thúc đẩy sự bứt phá này.',
      correct: ['It', 'was', 'the', 'investment', 'in', 'research', 'that', 'drove', 'this', 'breakthrough.'],
      rule: 'It-cleft formula: It + be + emphasized element + that/who + clause.',
      tip: 'Cleft sentences provide powerful emphasis in persuasive Task 2 conclusions.'
    },
    {
      prompt: 'Arrange the word blocks using negative inversion for emphasis:',
      translation: 'Không những thành phố cắt giảm rác thải, mà còn mở rộng công viên.',
      correct: ['Not', 'only', 'did', 'the', 'city', 'reduce', 'waste,', 'but', 'it', 'also', 'expanded', 'parks.'],
      rule: '"Not only" at start causes auxiliary inversion ("did the city reduce") paired with "but also".',
      tip: '"Not only... but also" inversion is a guaranteed Band 8.0+ grammar showcase.'
    },
    {
      prompt: 'Arrange the word blocks using comparative inversion:',
      translation: 'Hệ thống mới xử lý dữ liệu nhanh hơn bất kỳ mô hình trước đó.',
      correct: ['The', 'new', 'system', 'processes', 'data', 'faster', 'than', 'did', 'any', 'previous', 'model.'],
      rule: 'Formal academic comparative inversion places auxiliary verb ("did") before subject noun phrase.',
      tip: 'Comparative inversion highlights ultimate mastery of formal English syntax.'
    }
  ]
};

/**
 * On-Demand Fresh IELTS Question Generator.
 * Generates a randomized 3-question lesson set on the fly every time training starts!
 */
function generateFreshIELTSExercises(skillKey) {
  const normalizedKey = skillKey.replace('grammar-train-', '');
  const templates = SKILL_GENERATOR_TEMPLATES[normalizedKey] || SKILL_GENERATOR_TEMPLATES['sentence-structure'];
  
  // Pick 3 fresh randomized items from templates
  const shuffled = [...templates].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 3).map((item, idx) => {
    // Dynamically scramble tokens
    const scrambled = [...item.correct].sort(() => 0.5 - Math.random());
    return {
      id: `${normalizedKey}-gen-${idx + 1}-${Date.now()}`,
      prompt: item.prompt,
      translation: item.translation,
      correctTokens: item.correct,
      scrambledTokens: scrambled,
      explanation: item.rule,
      tip: item.tip
    };
  });
}

window.GrammarExercisesService = {
  SKILL_GENERATOR_TEMPLATES,
  getExercisesForSkill: generateFreshIELTSExercises
};
