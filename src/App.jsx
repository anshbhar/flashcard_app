import { useState, useEffect, useCallback } from 'react'

// ─── Constants ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'flashmind_cards'
const DEVELOPER_NAME = 'Ansh Bhardwaj'
const DEVELOPER_EMAIL = 'anshb120207@gmail.com'
const DH_URL = 'https://digitalheroesco.com'

const SAMPLE_CARDS = [
  {
    id: 'sample-1',
    question: 'What is Active Recall?',
    answer:
      'Active Recall is a learning strategy where you actively stimulate memory during study sessions by testing yourself on the material, rather than passively re-reading it. Research shows it significantly improves long-term retention.',
    createdAt: Date.now() - 3000,
  },
  {
    id: 'sample-2',
    question: 'What is the Spaced Repetition technique?',
    answer:
      'Spaced Repetition is a learning method that involves reviewing information at increasingly spaced intervals over time. By revisiting material just before you\'re about to forget it, you reinforce memory traces and drastically improve recall efficiency.',
    createdAt: Date.now() - 2000,
  },
  {
    id: 'sample-3',
    question: 'Explain the Feynman Technique.',
    answer:
      'The Feynman Technique is a four-step learning method: (1) Choose a concept, (2) Teach it in simple language as if to a child, (3) Identify gaps and return to the source material, (4) Simplify and use analogies. If you can\'t explain it simply, you don\'t understand it well enough.',
    createdAt: Date.now() - 1000,
  },
]

// ─── Utility: Generate unique ID ────────────────────────────────────────────
const genId = () => `card-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

// ─── Utility: Load cards from localStorage ──────────────────────────────────
const loadCards = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return null
  } catch {
    return null
  }
}

// ─── Utility: Save cards to localStorage ────────────────────────────────────
const saveCards = (cards) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SVG Icons
// ═══════════════════════════════════════════════════════════════════════════
const IconBrain = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2C7.6 2 6 3.7 6 5.7c0 .5.1 1 .3 1.4C4.9 7.8 4 9.2 4 10.8c0 1.3.5 2.4 1.3 3.3-.2.5-.3 1-.3 1.6C5 17.7 6.5 19.3 8.4 19.6V21h7v-1.4c1.9-.3 3.4-1.9 3.4-3.9 0-.6-.1-1.1-.3-1.6.8-.9 1.3-2 1.3-3.3 0-1.6-.9-3-2.3-3.7.2-.4.3-.9.3-1.4C17.8 3.7 16.4 2 14.5 2c-.9 0-1.7.3-2.3.8-.6-.5-1.4-.8-2.2-.8z"/>
  </svg>
)

const IconPlus = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const IconTrash = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

const IconRotate = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.27"/>
  </svg>
)

const IconCheck = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconX = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const IconArrow = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IconStar = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const IconBook = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
)

const IconTrophy = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/>
    <path d="M5 7H3v-2h2v2zm14 0h2v-2h-2v2z"/>
    <path d="M5 7c0 5.5 3 8 7 9s7-3.5 7-9H5z"/>
  </svg>
)

const IconGlobe = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const IconMail = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconUser = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

// ═══════════════════════════════════════════════════════════════════════════
// HEADER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function Header({ mode, onModeChange, totalCards }) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
              <IconBrain />
            </div>
            <span className="font-display font-bold text-xl text-gradient hidden sm:block">
              FlashMind
            </span>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/8" role="navigation" aria-label="App modes">
            <button
              id="nav-study"
              className={`nav-tab ${mode === 'study' || mode === 'summary' ? 'nav-tab-active' : 'nav-tab-inactive'}`}
              onClick={() => onModeChange('study')}
              aria-label="Study mode"
            >
              📖 Study
            </button>
            <button
              id="nav-manage"
              className={`nav-tab ${mode === 'manage' ? 'nav-tab-active' : 'nav-tab-inactive'}`}
              onClick={() => onModeChange('manage')}
              aria-label="Manage deck"
            >
              🗂 Manage
            </button>
          </nav>

          {/* Card count badge */}
          <div className="shrink-0">
            <span className="badge bg-primary-900/60 text-primary-300 border border-primary-700/40">
              <IconBook />
              {totalCards} card{totalCards !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FLASHCARD 3D COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function FlashCard({ card, isFlipped, onFlip }) {
  return (
    <div
      className="perspective-1000 w-full"
      style={{ height: '320px' }}
      role="button"
      aria-label={isFlipped ? 'Card showing answer. Click to flip back.' : 'Card showing question. Click to reveal answer.'}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFlip(); }}}
      onClick={onFlip}
    >
      <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* FRONT — Question */}
        <div className="card-face card-front select-none">
          <div className="flex flex-col items-center gap-6 w-full h-full justify-center">
            <span className="badge bg-primary-900/60 text-primary-300 border border-primary-600/30 mb-2">
              Question
            </span>
            <p className="font-display font-semibold text-xl sm:text-2xl text-slate-100 text-center leading-relaxed max-w-prose">
              {card.question}
            </p>
            <p className="text-slate-500 text-sm mt-auto flex items-center gap-1.5">
              <span className="animate-bounce inline-block">👆</span>
              Click to reveal answer
            </p>
          </div>
        </div>

        {/* BACK — Answer */}
        <div className="card-face card-back select-none">
          <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
            <span className="badge bg-emerald-900/60 text-emerald-300 border border-emerald-600/30 mb-2">
              Answer
            </span>
            <p className="font-display font-medium text-lg sm:text-xl text-slate-100 text-center leading-relaxed max-w-prose overflow-y-auto" style={{ maxHeight: '220px' }}>
              {card.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STUDY MODE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function StudyMode({ cards, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [results, setResults] = useState({})
  const [isTransitioning, setIsTransitioning] = useState(false)

  const totalCards = cards.length
  const completedCount = Object.keys(results).length
  const progress = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0
  const currentCard = cards[currentIndex]

  const handleFlip = useCallback(() => {
    if (!isTransitioning) setIsFlipped((f) => !f)
  }, [isTransitioning])

  const handleAnswer = useCallback((correct) => {
    if (isTransitioning || !isFlipped) return
    setIsTransitioning(true)

    const newResults = { ...results, [currentCard.id]: correct ? 'correct' : 'review' }
    setResults(newResults)

    // Flip back first, then advance
    setIsFlipped(false)
    setTimeout(() => {
      if (currentIndex + 1 >= totalCards) {
        onComplete(newResults)
      } else {
        setCurrentIndex((i) => i + 1)
        setIsTransitioning(false)
      }
    }, 700)
  }, [isTransitioning, isFlipped, results, currentCard, currentIndex, totalCards, onComplete])

  if (!currentCard) return null

  return (
    <section className="flex flex-col gap-6 animate-slide-up" aria-label="Study mode">
      {/* Progress */}
      <div className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 font-medium text-sm">
            Card <span className="text-white font-bold">{currentIndex + 1}</span> of{' '}
            <span className="text-white font-bold">{totalCards}</span>
          </span>
          <span className="badge bg-primary-900/50 text-primary-300 border border-primary-700/40 font-bold">
            {progress}% Complete
          </span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-4 mt-3">
          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <IconCheck /> {Object.values(results).filter((r) => r === 'correct').length} Got It
          </span>
          <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
            <IconRotate /> {Object.values(results).filter((r) => r === 'review').length} Review
          </span>
        </div>
      </div>

      {/* Flashcard */}
      <FlashCard card={currentCard} isFlipped={isFlipped} onFlip={handleFlip} />

      {/* Action buttons — only visible when flipped */}
      <div
        className={`transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-live="polite"
      >
        <div className="grid grid-cols-2 gap-4">
          <button
            id="btn-got-it-right"
            className="btn-success flex items-center justify-center gap-2 py-4 text-base"
            onClick={() => handleAnswer(true)}
            disabled={!isFlipped || isTransitioning}
            aria-label="Mark as got it right"
          >
            <IconCheck />
            Got It Right
          </button>
          <button
            id="btn-need-review"
            className="btn-danger flex items-center justify-center gap-2 py-4 text-base"
            onClick={() => handleAnswer(false)}
            disabled={!isFlipped || isTransitioning}
            aria-label="Mark as need to review"
          >
            <IconRotate />
            Need to Review
          </button>
        </div>
        <p className="text-slate-500 text-xs text-center mt-3">
          Rate your recall to track performance — this drives your review list.
        </p>
      </div>

      {/* Instruction when not flipped */}
      {!isFlipped && (
        <p className="text-center text-slate-500 text-sm animate-fade-in">
          Read the question carefully, then click the card to reveal the answer.
        </p>
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SESSION SUMMARY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function SessionSummary({ cards, results, onReset }) {
  const total = cards.length
  const correctCount = Object.values(results).filter((r) => r === 'correct').length
  const reviewCount = Object.values(results).filter((r) => r === 'review').length
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const reviewCards = cards.filter((c) => results[c.id] === 'review')

  const scoreColor =
    scorePercent >= 80
      ? 'text-emerald-400'
      : scorePercent >= 50
      ? 'text-amber-400'
      : 'text-red-400'

  const scoreLabel =
    scorePercent >= 90
      ? '🏆 Outstanding!'
      : scorePercent >= 75
      ? '🌟 Great Work!'
      : scorePercent >= 50
      ? '📈 Keep Going!'
      : '💪 Keep Practising!'

  return (
    <section className="flex flex-col gap-6 animate-slide-up" aria-label="Session summary">
      {/* Score hero */}
      <div className="glass rounded-2xl p-6 sm:p-8 text-center glow-indigo">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-900/60 flex items-center justify-center border border-primary-600/30">
            <IconTrophy />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
              Session Complete!
            </h2>
            <p className="text-slate-400 text-sm">Here's how you performed this round.</p>
          </div>

          {/* Score ring */}
          <div className="relative flex items-center justify-center mt-2" style={{ width: 140, height: 140 }}>
            <svg viewBox="0 0 140 140" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
              <circle
                cx="70" cy="70" r="58"
                fill="none"
                stroke={scorePercent >= 80 ? '#10b981' : scorePercent >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="12"
                strokeDasharray={`${(scorePercent / 100) * 364.4} 364.4`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease-out' }}
              />
            </svg>
            <div className="flex flex-col items-center z-10">
              <span className={`font-display font-black text-4xl ${scoreColor}`}>{scorePercent}%</span>
              <span className="text-slate-400 text-xs mt-0.5">Score</span>
            </div>
          </div>

          <p className="font-semibold text-lg">{scoreLabel}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="glass rounded-xl p-4 text-center border border-white/8">
          <p className="font-display font-black text-3xl text-white">{total}</p>
          <p className="text-slate-400 text-xs mt-1">Total</p>
        </div>
        <div className="glass rounded-xl p-4 text-center border border-emerald-800/30 bg-emerald-900/10">
          <p className="font-display font-black text-3xl text-emerald-400">{correctCount}</p>
          <p className="text-slate-400 text-xs mt-1">Got It Right</p>
        </div>
        <div className="glass rounded-xl p-4 text-center border border-amber-800/30 bg-amber-900/10">
          <p className="font-display font-black text-3xl text-amber-400">{reviewCount}</p>
          <p className="text-slate-400 text-xs mt-1">Need Review</p>
        </div>
      </div>

      {/* Review list */}
      {reviewCards.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-amber-800/20">
          <h3 className="font-display font-bold text-lg text-amber-300 mb-4 flex items-center gap-2">
            <IconRotate />
            Cards to Review ({reviewCards.length})
          </h3>
          <ul className="flex flex-col gap-3" role="list">
            {reviewCards.map((card, idx) => (
              <li key={card.id} className="card-list-item border-amber-800/20">
                <span className="badge bg-amber-900/50 text-amber-400 border border-amber-700/30 shrink-0 text-xs">
                  {idx + 1}
                </span>
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-slate-200 font-medium text-sm leading-snug">{card.question}</p>
                  <p className="text-slate-400 text-xs leading-snug truncate">{card.answer}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {reviewCards.length === 0 && (
        <div className="glass rounded-2xl p-6 text-center border border-emerald-800/30">
          <p className="text-emerald-400 font-semibold text-lg">🎉 Perfect Round!</p>
          <p className="text-slate-400 text-sm mt-1">You got every card right. Incredible!</p>
        </div>
      )}

      {/* Reset button */}
      <button
        id="btn-reset-session"
        className="btn-primary flex items-center justify-center gap-2 w-full py-4 text-base"
        onClick={onReset}
        aria-label="Reset and restart the study session"
      >
        <IconRotate />
        Reset &amp; Restart Session
      </button>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MANAGE DECK COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function ManageDeck({ cards, onAdd, onDelete }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [errors, setErrors] = useState({})
  const [justAdded, setJustAdded] = useState(false)

  const validate = () => {
    const e = {}
    if (!question.trim()) e.question = 'Question cannot be empty.'
    if (!answer.trim()) e.answer = 'Answer cannot be empty.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onAdd({ id: genId(), question: question.trim(), answer: answer.trim(), createdAt: Date.now() })
    setQuestion('')
    setAnswer('')
    setErrors({})
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2500)
  }

  return (
    <section className="flex flex-col gap-6 animate-slide-up" aria-label="Manage deck">
      {/* Add card form */}
      <div className="glass rounded-2xl p-5 sm:p-6">
        <h2 className="font-display font-bold text-xl text-white mb-1">Add a New Card</h2>
        <p className="text-slate-400 text-sm mb-5">Create flashcards to grow your study deck.</p>

        <form onSubmit={handleSubmit} noValidate aria-label="Add flashcard form">
          {/* Question */}
          <div className="mb-4">
            <label htmlFor="input-question" className="block text-sm font-medium text-slate-300 mb-2">
              Question / Term <span className="text-primary-400">*</span>
            </label>
            <input
              id="input-question"
              type="text"
              className={`input-field ${errors.question ? 'border-red-500/60 ring-1 ring-red-500/40' : ''}`}
              placeholder="e.g. What is photosynthesis?"
              value={question}
              onChange={(e) => { setQuestion(e.target.value); if (errors.question) setErrors((err) => ({ ...err, question: '' })) }}
              maxLength={200}
              aria-required="true"
              aria-describedby={errors.question ? 'err-question' : undefined}
            />
            {errors.question && (
              <p id="err-question" className="text-red-400 text-xs mt-1.5 flex items-center gap-1" role="alert">
                <IconX /> {errors.question}
              </p>
            )}
          </div>

          {/* Answer */}
          <div className="mb-5">
            <label htmlFor="input-answer" className="block text-sm font-medium text-slate-300 mb-2">
              Answer / Definition <span className="text-primary-400">*</span>
            </label>
            <textarea
              id="input-answer"
              className={`input-field resize-none ${errors.answer ? 'border-red-500/60 ring-1 ring-red-500/40' : ''}`}
              placeholder="e.g. Photosynthesis is the process by which plants convert sunlight into food..."
              value={answer}
              onChange={(e) => { setAnswer(e.target.value); if (errors.answer) setErrors((err) => ({ ...err, answer: '' })) }}
              rows={4}
              maxLength={1000}
              aria-required="true"
              aria-describedby={errors.answer ? 'err-answer' : undefined}
            />
            {errors.answer && (
              <p id="err-answer" className="text-red-400 text-xs mt-1.5 flex items-center gap-1" role="alert">
                <IconX /> {errors.answer}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            id="btn-add-card"
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
            aria-label="Add flashcard to deck"
          >
            <IconPlus />
            Add Card to Deck
          </button>

          {justAdded && (
            <p className="text-emerald-400 text-sm text-center mt-3 flex items-center justify-center gap-1.5 animate-fade-in" role="status">
              <IconCheck /> Card added successfully!
            </p>
          )}
        </form>
      </div>

      {/* Card list */}
      <div className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl text-white">
            Your Deck
          </h2>
          <span className="badge bg-primary-900/50 text-primary-300 border border-primary-700/40">
            {cards.length} card{cards.length !== 1 ? 's' : ''}
          </span>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No cards yet. Add your first one above!</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1" role="list" aria-label="Card list">
            {cards.map((card, idx) => (
              <li key={card.id} className="card-list-item">
                <span className="badge bg-primary-900/40 text-primary-400 border border-primary-700/30 shrink-0 text-xs min-w-[32px] justify-center">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 font-medium text-sm leading-snug truncate">{card.question}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-snug line-clamp-1">{card.answer}</p>
                </div>
                <button
                  id={`btn-delete-${card.id}`}
                  className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                  onClick={() => onDelete(card.id)}
                  aria-label={`Delete card: ${card.question}`}
                >
                  <IconTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="mt-auto w-full" role="contentinfo">
      <div className="glass border-t border-white/8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          {/* Top row: dev info + DH badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Developer metadata — MANDATORY */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                <IconUser />
                <span className="text-slate-200 font-semibold text-sm" id="developer-name">
                  Developer: <span className="text-white font-bold">{DEVELOPER_NAME}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                <IconMail />
                <a
                  href={`mailto:${DEVELOPER_EMAIL}`}
                  className="text-primary-300 hover:text-primary-200 font-semibold text-sm transition-colors duration-200"
                  id="developer-email"
                  aria-label={`Contact developer at ${DEVELOPER_EMAIL}`}
                >
                  {DEVELOPER_EMAIL}
                </a>
              </div>
            </div>

            {/* Digital Heroes badge — MANDATORY */}
            <a
              id="btn-digital-heroes"
              href={DH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="dh-badge"
              aria-label="Built for Digital Heroes — opens in new tab"
            >
              <IconStar />
              Built for Digital Heroes
              <IconArrow />
            </a>
          </div>

          {/* Bottom row: app info */}
          <div className="mt-4 pt-4 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-slate-500 text-xs text-center sm:text-left">
              FlashMind — Active Recall Flashcard App · Zero cost · 100% localStorage persistence
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-slate-500 text-xs">Live · ₹0 Spent</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY DECK PROMPT
// ═══════════════════════════════════════════════════════════════════════════
function EmptyDeckPrompt({ onGoToManage }) {
  return (
    <div className="glass rounded-2xl p-8 text-center animate-slide-up glow-indigo">
      <p className="text-5xl mb-4">🃏</p>
      <h2 className="font-display font-bold text-2xl text-white mb-2">Your deck is empty</h2>
      <p className="text-slate-400 mb-6">Add some flashcards to get started with your study session.</p>
      <button
        id="btn-go-create-cards"
        className="btn-primary inline-flex items-center gap-2"
        onClick={onGoToManage}
      >
        <IconPlus />
        Create Your First Card
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [cards, setCards] = useState(() => {
    const stored = loadCards()
    return stored ?? SAMPLE_CARDS
  })
  const [mode, setMode] = useState('study') // 'study' | 'manage' | 'summary'
  const [sessionResults, setSessionResults] = useState(null) // null = no session yet

  // Persist cards to localStorage whenever they change
  useEffect(() => {
    saveCards(cards)
  }, [cards])

  // Save initial sample cards if localStorage was empty
  useEffect(() => {
    const stored = loadCards()
    if (!stored) saveCards(cards)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleAddCard = useCallback((newCard) => {
    setCards((prev) => [...prev, newCard])
  }, [])

  const handleDeleteCard = useCallback((id) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const handleStudyComplete = useCallback((results) => {
    setSessionResults(results)
    setMode('summary')
  }, [])

  const handleReset = useCallback(() => {
    setSessionResults(null)
    setMode('study')
  }, [])

  const handleModeChange = useCallback((newMode) => {
    if (newMode === 'study') {
      setSessionResults(null)
    }
    setMode(newMode)
  }, [])

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <Header mode={mode} onModeChange={handleModeChange} totalCards={cards.length} />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-0">
        {/* ── Study Mode ── */}
        {mode === 'study' && cards.length === 0 && (
          <EmptyDeckPrompt onGoToManage={() => setMode('manage')} />
        )}

        {mode === 'study' && cards.length > 0 && (
          <StudyMode
            key={sessionResults === null ? 'fresh' : 'reset'}
            cards={cards}
            onComplete={handleStudyComplete}
          />
        )}

        {/* ── Summary Mode ── */}
        {mode === 'summary' && sessionResults && (
          <SessionSummary
            cards={cards}
            results={sessionResults}
            onReset={handleReset}
          />
        )}

        {/* ── Manage Mode ── */}
        {mode === 'manage' && (
          <ManageDeck
            cards={cards}
            onAdd={handleAddCard}
            onDelete={handleDeleteCard}
          />
        )}
      </main>

      <Footer />
    </div>
  )
}
