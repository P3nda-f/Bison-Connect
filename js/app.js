/* =========================================================
   Bison Mentor Match — Main Application
   Vanilla JS SPA with hash-based routing
   Features: role select, multi-step quiz, Tinder-style swipe
   deck, mutual-match reveal, and chat.
   ========================================================= */

// Global app state
const AppState = {
  role: null,          // 'alumni' | 'student' | null
  quizData: null,      // collected user profile
  deck: [],            // ranked candidate matches to swipe through
  deckIndex: 0,        // current card index in the deck
  mutualMatches: [],   // candidates where both parties hearted
  chats: {},           // { candidateId: [ {from, text} ] }
  activeChatId: null,  // candidate id of the open chat
  quizStep: 1,         // current quiz step (1-4)
  form: {              // form values
    name: '',
    email: '',
    phone: '',
    graduationYear: '',
    major: '',
    currentJob: '',
    careerGoals: '',
    availability: '',
    interests: [],
    mentorshipFocus: [],
    homeState: '',
    currentState: '',
    hobbies: []
  },
  errors: {}
}

// ---- Constants ----

const MAJORS = [
  'Accounting', 'Architecture', 'Art', 'Biology', 'Business Administration',
  'Chemistry', 'Civil Engineering', 'Communications', 'Computer Science',
  'Criminal Justice', 'Economics', 'Education', 'Electrical Engineering',
  'Finance', 'History', 'Journalism', 'Marketing', 'Mathematics',
  'Mechanical Engineering', 'Music', 'Nursing', 'Philosophy', 'Physics',
  'Political Science', 'Psychology', 'Public Relations', 'Social Work',
  'Sociology', 'Theatre Arts', 'Other'
]

const INTEREST_OPTIONS = [
  'Software Engineering', 'Artificial Intelligence', 'Tech Entrepreneurship',
  'Product Management', 'UX Design', 'Finance', 'Investment Banking',
  'Corporate Strategy', 'Wealth Management', 'Startup Funding',
  'Venture Capital', 'Entrepreneurship', 'Law', 'Public Policy',
  'Civil Rights', 'Government', 'Medicine', 'Healthcare', 'Research',
  'Public Health', 'Mental Health', 'Psychology', 'Counseling', 'Marketing',
  'Digital Media', 'Music Industry', 'Brand Strategy', 'Public Relations',
  'Media', 'Engineering', 'Aerospace', 'Robotics', 'Project Management',
  'Education', 'Social Work', 'Nonprofit', 'Architecture', 'Art & Design'
]

const AVAILABILITY_OPTIONS = [
  { value: '1/week', label: 'Once a week', desc: 'Most engaged — weekly check-ins' },
  { value: '2/month', label: 'Twice a month', desc: 'Balanced — biweekly meetings' },
  { value: '1/month', label: 'Once a month', desc: 'Flexible — monthly guidance' }
]

const TOTAL_STEPS = 4

// ---- Router ----

function getRoute() {
  return window.location.hash.slice(1) || '/'
}

function navigate(path) {
  window.location.hash = path
}

function router() {
  const route = getRoute()
  const app = document.getElementById('app')
  updateRoleBadge()

  if (route === '/quiz') {
    if (!AppState.role) {
      navigate('/')
      return
    }
    app.innerHTML = renderQuiz()
    attachQuizHandlers()
  } else if (route === '/matches') {
    if (!AppState.quizData) {
      navigate('/')
      return
    }
    renderSwipe()
  } else if (route === '/connections') {
    if (!AppState.quizData) {
      navigate('/')
      return
    }
    renderConnections()
  } else {
    app.innerHTML = renderLanding()
    attachLandingHandlers()
  }
}

function updateRoleBadge() {
  const badge = document.getElementById('role-badge')
  if (AppState.role) {
    badge.textContent = AppState.role === 'alumni' ? 'Alumni' : 'Student'
    badge.style.display = 'block'
  } else {
    badge.style.display = 'none'
  }
}

// ---- Landing View ----

function renderLanding() {
  return `
    <div class="landing">
      <section class="landing-hero">
        <div class="landing-hero-content">
          <p class="landing-hero-eyebrow">Howard University</p>
          <h1 class="landing-hero-title">Bison Mentor Match</h1>
          <p class="landing-hero-subtitle">
            Connecting alumni and students through shared majors, interests,
            and career goals. Find your mentor. Pay it forward.
          </p>
        </div>
      </section>

      <section class="landing-choice">
        <div class="landing-choice-header">
          <div class="section-bar"></div>
          <h2>Get Started</h2>
          <p>Choose your role to begin matching.</p>
        </div>
        <div class="landing-cards">
          <button class="role-card role-card-burgundy" data-role="alumni">
            <div class="role-card-icon">
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 18L24 10L40 18L24 26L8 18Z" stroke-linejoin="round" />
                <path d="M14 21V31C14 31 18 35 24 35C30 35 34 31 34 31V21" stroke-linejoin="round" />
                <line x1="40" y1="18" x2="40" y2="28" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="role-card-title">I'm an Alumni</h3>
            <p class="role-card-desc">
              Mentor a current Howard student in your field. Share your
              experience and help guide the next generation of Bison.
            </p>
            <span class="role-card-cta">Start as Alumni &rarr;</span>
          </button>

          <button class="role-card role-card-navy" data-role="student">
            <div class="role-card-icon">
              <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 18L24 9L42 18L24 27L6 18Z" stroke-linejoin="round" />
                <path d="M12 21V30C12 30 17 34 24 34C31 34 36 30 36 30V21" stroke-linejoin="round" />
                <line x1="42" y1="18" x2="42" y2="30" stroke-linecap="round" />
                <line x1="24" y1="27" x2="24" y2="40" stroke-linecap="round" />
              </svg>
            </div>
            <h3 class="role-card-title">I'm a Student</h3>
            <p class="role-card-desc">
              Get matched with a Howard alum who shares your major, interests,
              and career goals. Take the next step in your journey.
            </p>
            <span class="role-card-cta">Start as Student &rarr;</span>
          </button>
        </div>
      </section>

      <section class="landing-how">
        <div class="section-bar"></div>
        <h2>How It Works</h2>
        <div class="how-steps">
          <div class="how-step">
            <div class="how-step-num">1</div>
            <h4>Choose Your Role</h4>
            <p>Select whether you're an alumni looking to mentor or a student seeking guidance.</p>
          </div>
          <div class="how-step">
            <div class="how-step-num">2</div>
            <h4>Take the Quiz</h4>
            <p>Share your major, goals, focus areas, location, hobbies, and availability.</p>
          </div>
          <div class="how-step">
            <div class="how-step-num">3</div>
            <h4>Swipe & Match</h4>
            <p>Heart or pass on suggested matches. When you both heart, you connect and can chat.</p>
          </div>
        </div>
      </section>
    </div>
  `
}

function attachLandingHandlers() {
  document.querySelectorAll('[data-role]').forEach((btn) => {
    btn.addEventListener('click', () => {
      AppState.role = btn.dataset.role
      resetForm()
      navigate('/quiz')
    })
  })
}

function resetForm() {
  AppState.quizStep = 1
  AppState.form = {
    name: '', email: '', phone: '', graduationYear: '',
    major: '', currentJob: '', careerGoals: '',
    availability: '', interests: [], mentorshipFocus: [],
    homeState: '', currentState: '', hobbies: []
  }
  AppState.errors = {}
}

// ---- Quiz View ----

function renderQuiz() {
  const step = AppState.quizStep
  const isAlumni = AppState.role === 'alumni'
  const errors = AppState.errors
  const f = AppState.form

  // Progress dots
  let dotsHtml = ''
  for (let s = 1; s <= TOTAL_STEPS; s++) {
    let cls = 'quiz-progress-dot'
    if (s === step) cls += ' active'
    if (s < step) cls += ' done'
    dotsHtml += `<div class="${cls}">${s < step ? '\u2713' : s}</div>`
  }

  let stepHtml = ''

  // Step 1: Contact info
  if (step === 1) {
    stepHtml = `
      <div class="quiz-step">
        <div class="section-bar"></div>
        <h2>Let's Get to Know You</h2>
        <p class="quiz-step-desc">${isAlumni
          ? 'Alumni — share your contact info so students can reach out.'
          : 'Student — share your contact info so alumni can connect with you.'}</p>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input id="name" type="text" value="${esc(f.name)}"
            placeholder="e.g. Camille Johnson"
            class="${errors.name ? 'input-error' : ''}" />
          ${errors.name ? `<span class="error-msg">${errors.name}</span>` : ''}
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input id="email" type="email" value="${esc(f.email)}"
            placeholder="e.g. you@email.com"
            class="${errors.email ? 'input-error' : ''}" />
          ${errors.email ? `<span class="error-msg">${errors.email}</span>` : ''}
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input id="phone" type="tel" value="${esc(f.phone)}"
            placeholder="e.g. (202) 555-0100"
            class="${errors.phone ? 'input-error' : ''}" />
          ${errors.phone ? `<span class="error-msg">${errors.phone}</span>` : ''}
        </div>

        <div class="quiz-nav">
          <div></div>
          <button type="button" class="btn btn-primary" id="next-btn">Next &rarr;</button>
        </div>
      </div>
    `
  }

  // Step 2: Academic & career
  if (step === 2) {
    const majorOptions = MAJORS.map((m) =>
      `<option value="${m}" ${f.major === m ? 'selected' : ''}>${m}</option>`
    ).join('')

    stepHtml = `
      <div class="quiz-step">
        <div class="section-bar"></div>
        <h2>Academic & Career Info</h2>
        <p class="quiz-step-desc">${isAlumni
          ? 'Tell us about your time at Howard and where you are now.'
          : 'Tell us about your studies at Howard and where you want to go.'}</p>

        <div class="form-group">
          <label for="graduationYear">${isAlumni ? 'Graduation Year' : 'Expected Graduation Year'}</label>
          <input id="graduationYear" type="text" value="${esc(f.graduationYear)}"
            placeholder="${isAlumni ? 'e.g. 2015' : 'e.g. 2028'}"
            class="${errors.graduationYear ? 'input-error' : ''}" />
          ${errors.graduationYear ? `<span class="error-msg">${errors.graduationYear}</span>` : ''}
        </div>

        <div class="form-group">
          <label for="major">Major</label>
          <select id="major" class="${errors.major ? 'input-error' : ''}">
            <option value="">Select your major...</option>
            ${majorOptions}
          </select>
          ${errors.major ? `<span class="error-msg">${errors.major}</span>` : ''}
        </div>

        ${isAlumni ? `
          <div class="form-group">
            <label for="currentJob">Current Job / Title</label>
            <input id="currentJob" type="text" value="${esc(f.currentJob)}"
              placeholder="e.g. Senior Engineer at Google"
              class="${errors.currentJob ? 'input-error' : ''}" />
            ${errors.currentJob ? `<span class="error-msg">${errors.currentJob}</span>` : ''}
          </div>
        ` : `
          <div class="form-group">
            <label for="careerGoals">Career Goals</label>
            <textarea id="careerGoals" rows="3"
              placeholder="e.g. I want to become a software engineer at a major tech company..."
              class="${errors.careerGoals ? 'input-error' : ''}">${esc(f.careerGoals)}</textarea>
            ${errors.careerGoals ? `<span class="error-msg">${errors.careerGoals}</span>` : ''}
          </div>
        `}

        <div class="quiz-nav">
          <button type="button" class="btn btn-secondary" id="back-btn">&larr; Back</button>
          <button type="button" class="btn btn-primary" id="next-btn">Next &rarr;</button>
        </div>
      </div>
    `
  }

  // Step 3: Mentorship focus + location
  if (step === 3) {
    const focusChips = window.MENTORSHIP_FOCUS_OPTIONS.map((focus) => {
      const selected = f.mentorshipFocus.includes(focus)
      return `<button type="button" class="interest-chip ${selected ? 'selected' : ''}"
        data-focus="${focus}">${focus}</button>`
    }).join('')

    const stateOptions = (selected) => window.US_STATES.map((s) =>
      `<option value="${s}" ${selected === s ? 'selected' : ''}>${s}</option>`
    ).join('')

    stepHtml = `
      <div class="quiz-step">
        <div class="section-bar"></div>
        <h2>Focus & Location</h2>
        <p class="quiz-step-desc">${isAlumni
          ? 'What do you want to help students with, and where are you based?'
          : 'What do you want help with, and where are you based?'}</p>

        <div class="form-group">
          <label>${isAlumni ? 'What do you want to help with?' : 'What do you want help with?'}</label>
          <p class="form-hint">Select all that apply.</p>
          <div class="interest-grid" id="focus-grid">
            ${focusChips}
          </div>
          ${errors.mentorshipFocus ? `<span class="error-msg">${errors.mentorshipFocus}</span>` : ''}
        </div>

        <div class="form-group">
          <label for="homeState">Home State</label>
          <select id="homeState" class="${errors.homeState ? 'input-error' : ''}">
            <option value="">Select your home state...</option>
            ${stateOptions(f.homeState)}
          </select>
          ${errors.homeState ? `<span class="error-msg">${errors.homeState}</span>` : ''}
        </div>

        <div class="form-group">
          <label for="currentState">Current State</label>
          <select id="currentState" class="${errors.currentState ? 'input-error' : ''}">
            <option value="">Select where you live now...</option>
            ${stateOptions(f.currentState)}
          </select>
          ${errors.currentState ? `<span class="error-msg">${errors.currentState}</span>` : ''}
        </div>

        <div class="quiz-nav">
          <button type="button" class="btn btn-secondary" id="back-btn">&larr; Back</button>
          <button type="button" class="btn btn-primary" id="next-btn">Next &rarr;</button>
        </div>
      </div>
    `
  }

  // Step 4: Interests, hobbies & availability
  if (step === 4) {
    const interestChips = INTEREST_OPTIONS.map((interest) => {
      const selected = f.interests.includes(interest)
      return `<button type="button" class="interest-chip ${selected ? 'selected' : ''}"
        data-interest="${interest}">${interest}</button>`
    }).join('')

    const hobbyChips = window.HOBBY_OPTIONS.map((hobby) => {
      const selected = f.hobbies.includes(hobby)
      return `<button type="button" class="interest-chip ${selected ? 'selected' : ''}"
        data-hobby="${hobby}">${hobby}</button>`
    }).join('')

    const availabilityCards = AVAILABILITY_OPTIONS.map((opt) => {
      const selected = f.availability === opt.value
      return `
        <button type="button" class="availability-card ${selected ? 'selected' : ''}"
          data-availability="${opt.value}">
          <div class="availability-radio">
            <div class="availability-radio-dot"></div>
          </div>
          <div>
            <div class="availability-label">${opt.label}</div>
            <div class="availability-desc">${opt.desc}</div>
          </div>
        </button>
      `
    }).join('')

    stepHtml = `
      <div class="quiz-step">
        <div class="section-bar"></div>
        <h2>Interests, Hobbies & Availability</h2>
        <p class="quiz-step-desc">Tell us what you're into and how often you can meet.</p>

        <div class="form-group">
          <label>Professional Interest Areas</label>
          <p class="form-hint">Select all that apply — this drives your matches.</p>
          <div class="interest-grid" id="interest-grid">
            ${interestChips}
          </div>
          ${errors.interests ? `<span class="error-msg">${errors.interests}</span>` : ''}
        </div>

        <div class="form-group">
          <label>Hobbies</label>
          <p class="form-hint">Shared hobbies make for better connections.</p>
          <div class="interest-grid" id="hobby-grid">
            ${hobbyChips}
          </div>
          ${errors.hobbies ? `<span class="error-msg">${errors.hobbies}</span>` : ''}
        </div>

        <div class="form-group">
          <label>Availability to Meet</label>
          <p class="form-hint">How often can you connect with your mentor/mentee?</p>
          <div class="availability-options">
            ${availabilityCards}
          </div>
          ${errors.availability ? `<span class="error-msg">${errors.availability}</span>` : ''}
        </div>

        <div class="quiz-nav">
          <button type="button" class="btn btn-secondary" id="back-btn">&larr; Back</button>
          <button type="button" class="btn btn-primary" id="submit-btn">Find My Matches</button>
        </div>
      </div>
    `
  }

  return `
    <div class="quiz-page">
      <div class="quiz-container">
        <div class="quiz-progress">${dotsHtml}</div>
        <div class="quiz-card card">
          ${stepHtml}
        </div>
      </div>
    </div>
  `
}

function attachQuizHandlers() {
  const step = AppState.quizStep
  const isAlumni = AppState.role === 'alumni'

  // Read current form values from DOM into state
  function readForm() {
    const el = (id) => document.getElementById(id)
    if (el('name')) AppState.form.name = el('name').value
    if (el('email')) AppState.form.email = el('email').value
    if (el('phone')) AppState.form.phone = el('phone').value
    if (el('graduationYear')) AppState.form.graduationYear = el('graduationYear').value
    if (el('major')) AppState.form.major = el('major').value
    if (el('currentJob')) AppState.form.currentJob = el('currentJob').value
    if (el('careerGoals')) AppState.form.careerGoals = el('careerGoals').value
    if (el('homeState')) AppState.form.homeState = el('homeState').value
    if (el('currentState')) AppState.form.currentState = el('currentState').value
  }

  function validate(currentStep) {
    const errs = {}
    readForm()
    const f = AppState.form

    if (currentStep === 1) {
      if (!f.name.trim()) errs.name = 'Name is required'
      if (!f.email.trim()) {
        errs.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
        errs.email = 'Please enter a valid email'
      }
      if (!f.phone.trim()) {
        errs.phone = 'Phone number is required'
      } else if (!/^[\d\s()+-]+$/.test(f.phone)) {
        errs.phone = 'Please enter a valid phone number'
      }
    }
    if (currentStep === 2) {
      if (!f.graduationYear.trim()) {
        errs.graduationYear = 'Graduation year is required'
      } else if (!/^\d{4}$/.test(f.graduationYear)) {
        errs.graduationYear = 'Enter a 4-digit year'
      }
      if (!f.major) errs.major = 'Please select your major'
      if (isAlumni && !f.currentJob.trim()) {
        errs.currentJob = 'Current job is required'
      }
      if (!isAlumni && !f.careerGoals.trim()) {
        errs.careerGoals = 'Career goals are required'
      }
    }
    if (currentStep === 3) {
      if (f.mentorshipFocus.length === 0) {
        errs.mentorshipFocus = 'Select at least one focus area'
      }
      if (!f.homeState) errs.homeState = 'Please select your home state'
      if (!f.currentState) errs.currentState = 'Please select your current state'
    }
    if (currentStep === 4) {
      if (f.interests.length === 0) {
        errs.interests = 'Select at least one interest area'
      }
      if (f.hobbies.length === 0) {
        errs.hobbies = 'Select at least one hobby'
      }
      if (!f.availability) {
        errs.availability = 'Please select your availability'
      }
    }
    return errs
  }

  function rerender() {
    document.getElementById('app').innerHTML = renderQuiz()
    attachQuizHandlers()
  }

  // Generic chip toggle helper
  function wireChips(dataAttr, formKey) {
    document.querySelectorAll('[' + dataAttr + ']').forEach((chip) => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute(dataAttr)
        const arr = AppState.form[formKey]
        const idx = arr.indexOf(val)
        if (idx > -1) {
          arr.splice(idx, 1)
          chip.classList.remove('selected')
        } else {
          arr.push(val)
          chip.classList.add('selected')
        }
      })
    })
  }

  wireChips('data-interest', 'interests')
  wireChips('data-focus', 'mentorshipFocus')
  wireChips('data-hobby', 'hobbies')

  // Availability selection
  document.querySelectorAll('[data-availability]').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('[data-availability]').forEach((c) => c.classList.remove('selected'))
      card.classList.add('selected')
      AppState.form.availability = card.dataset.availability
    })
  })

  // Next button
  const nextBtn = document.getElementById('next-btn')
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const errs = validate(step)
      if (Object.keys(errs).length > 0) {
        AppState.errors = errs
        rerender()
        return
      }
      AppState.errors = {}
      AppState.quizStep = step + 1
      rerender()
    })
  }

  // Back button
  const backBtn = document.getElementById('back-btn')
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      readForm()
      AppState.errors = {}
      AppState.quizStep = step - 1
      rerender()
    })
  }

  // Submit button
  const submitBtn = document.getElementById('submit-btn')
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const errs = validate(TOTAL_STEPS)
      if (Object.keys(errs).length > 0) {
        AppState.errors = errs
        rerender()
        return
      }

      const f = AppState.form
      const userProfile = {
        name: f.name,
        email: f.email,
        phone: f.phone,
        graduationYear: f.graduationYear,
        major: f.major,
        currentJob: isAlumni ? f.currentJob : '',
        careerGoals: isAlumni ? '' : f.careerGoals,
        interests: f.interests,
        mentorshipFocus: f.mentorshipFocus,
        homeState: f.homeState,
        currentState: f.currentState,
        hobbies: f.hobbies,
        availability: f.availability
      }

      const pool = isAlumni ? window.STUDENT_PROFILES : window.ALUMNI_PROFILES
      const results = window.computeMatches(userProfile, pool)

      AppState.quizData = userProfile
      AppState.deck = results
      AppState.deckIndex = 0
      AppState.mutualMatches = []
      AppState.chats = {}
      navigate('/matches')
    })
  }
}

// ---- Swipe Deck View ----

function renderSwipe() {
  const app = document.getElementById('app')
  const isAlumni = AppState.role === 'alumni'
  const otherLabel = isAlumni ? 'Student' : 'Alumni'
  const deck = AppState.deck
  const index = AppState.deckIndex

  // End of deck
  if (index >= deck.length) {
    app.innerHTML = `
      <div class="swipe-page">
        <div class="swipe-container">
          ${renderSwipeHeader(otherLabel)}
          <div class="deck-empty card">
            <div class="deck-empty-icon">&#127881;</div>
            <h2>You're all caught up!</h2>
            <p>You've gone through every suggested ${otherLabel.toLowerCase()} match.</p>
            <p class="deck-empty-count">
              ${AppState.mutualMatches.length} connection${AppState.mutualMatches.length === 1 ? '' : 's'} made.
            </p>
            <div class="deck-empty-actions">
              <button class="btn btn-primary" id="view-connections-btn">View My Connections</button>
              <button class="btn btn-secondary" id="restart-deck-btn">Start Over</button>
            </div>
          </div>
        </div>
      </div>
    `
    document.getElementById('view-connections-btn').addEventListener('click', () => navigate('/connections'))
    document.getElementById('restart-deck-btn').addEventListener('click', () => {
      AppState.deckIndex = 0
      navigate('/matches')
      renderSwipe()
    })
    return
  }

  const match = deck[index]
  const scorePct = Math.min(100, match.matchScore * 2)

  const reasonTags = (match.matchReasons || [])
    .map((r) => `<span class="match-reason-tag">${esc(r)}</span>`)
    .join('')

  const interestChips = (match.interests || [])
    .map((i) => `<span class="swipe-chip swipe-chip-burgundy">${esc(i)}</span>`)
    .join('')

  const focusChips = (match.mentorshipFocus || [])
    .map((i) => `<span class="swipe-chip swipe-chip-navy">${esc(i)}</span>`)
    .join('')

  const hobbyChips = (match.hobbies || [])
    .map((i) => `<span class="swipe-chip swipe-chip-outline">${esc(i)}</span>`)
    .join('')

  const jobOrGoal = match.currentJob
    ? `<p class="swipe-job"><strong>${isAlumni ? 'Career Goal' : 'Currently'}:</strong> ${esc(match.currentJob)}</p>`
    : match.careerGoals
      ? `<p class="swipe-job"><strong>${isAlumni ? 'Career Goal' : 'Currently'}:</strong> ${esc(match.careerGoals)}</p>`
      : ''

  app.innerHTML = `
    <div class="swipe-page">
      <div class="swipe-container">
        ${renderSwipeHeader(otherLabel)}

        <div class="swipe-deck">
          <div class="swipe-card card" id="swipe-card">
            <div class="swipe-card-banner">
              <div class="swipe-avatar">${esc(match.name.charAt(0))}</div>
              <div class="swipe-score">
                <span class="swipe-score-pct">${scorePct}%</span>
                <span class="swipe-score-label">Match</span>
              </div>
            </div>

            <div class="swipe-card-body">
              <h2 class="swipe-name">${esc(match.name)}</h2>
              <p class="swipe-subline">${otherLabel} &middot; Class of ${esc(String(match.graduationYear))}</p>
              <p class="swipe-major"><strong>Major:</strong> ${esc(match.major)}</p>
              ${jobOrGoal}
              <p class="swipe-location">
                <strong>From</strong> ${esc(match.homeState)} &middot; <strong>Now in</strong> ${esc(match.currentState)}
              </p>

              <div class="swipe-section">
                <span class="swipe-section-label">${isAlumni ? 'Can help with' : 'Looking for help with'}</span>
                <div class="swipe-chips">${focusChips}</div>
              </div>

              <div class="swipe-section">
                <span class="swipe-section-label">Interests</span>
                <div class="swipe-chips">${interestChips}</div>
              </div>

              <div class="swipe-section">
                <span class="swipe-section-label">Hobbies</span>
                <div class="swipe-chips">${hobbyChips}</div>
              </div>

              <div class="swipe-section">
                <span class="swipe-section-label">Why you match</span>
                <div class="match-reasons-inline">${reasonTags}</div>
              </div>

              <p class="swipe-availability-note">Availability: <strong>${esc(match.availability)}</strong></p>
            </div>
          </div>
        </div>

        <div class="swipe-actions">
          <button class="swipe-btn swipe-btn-nope" id="nope-btn" title="Pass">&#10005;</button>
          <button class="swipe-btn swipe-btn-like" id="like-btn" title="Heart to match">&#10084;</button>
        </div>
        <p class="swipe-hint">Heart to request a match, X to pass. You both have to heart to connect.</p>
      </div>
    </div>
  `

  // Wire header connections link
  const connLink = document.getElementById('header-connections-btn')
  if (connLink) connLink.addEventListener('click', () => navigate('/connections'))

  const card = document.getElementById('swipe-card')

  document.getElementById('nope-btn').addEventListener('click', () => {
    card.classList.add('swipe-out-left')
    setTimeout(() => advanceDeck(false), 280)
  })

  document.getElementById('like-btn').addEventListener('click', () => {
    card.classList.add('swipe-out-right')
    setTimeout(() => advanceDeck(true), 280)
  })
}

function renderSwipeHeader(otherLabel) {
  const count = AppState.mutualMatches.length
  return `
    <div class="swipe-header">
      <div>
        <div class="section-bar"></div>
        <h1>Find Your ${otherLabel} Match</h1>
        <p class="swipe-header-sub">Card ${Math.min(AppState.deckIndex + 1, AppState.deck.length)} of ${AppState.deck.length}</p>
      </div>
      <button class="btn btn-secondary connections-pill" id="header-connections-btn">
        &#128172; Connections${count > 0 ? ' (' + count + ')' : ''}
      </button>
    </div>
  `
}

// Advance deck; if liked, simulate the other side's decision for a mutual match
function advanceDeck(liked) {
  const match = AppState.deck[AppState.deckIndex]

  if (liked && match) {
    // Simulate the other party's decision. Higher match score = more likely to heart back.
    const likelihood = Math.min(0.95, 0.4 + match.matchScore / 120)
    const heartsBack = Math.random() < likelihood

    if (heartsBack) {
      AppState.mutualMatches.push(match)
      AppState.chats[match.id] = [
        { from: 'them', text: greetingFor(match) }
      ]
      showMatchModal(match)
      return
    }
  }

  AppState.deckIndex++
  renderSwipe()
}

function greetingFor(match) {
  const isAlumni = AppState.role === 'alumni'
  if (isAlumni) {
    return `Hi! Thanks for connecting. I'd love your guidance as I work toward my goals.`
  }
  return `Hi ${firstName(AppState.quizData.name)}! Happy to connect and help however I can.`
}

function firstName(full) {
  if (!full) return 'there'
  return full.split(' ')[0]
}

// ---- Match Modal (mutual match reveal) ----

function showMatchModal(match) {
  const isAlumni = AppState.role === 'alumni'
  const otherLabel = isAlumni ? 'student' : 'alum'

  const overlay = document.createElement('div')
  overlay.className = 'match-modal-overlay'
  overlay.innerHTML = `
    <div class="match-modal">
      <div class="match-modal-hearts">&#10084;</div>
      <h2 class="match-modal-title">It's a Match!</h2>
      <p class="match-modal-sub">You and ${esc(match.name)} both hearted each other.</p>

      <div class="match-modal-avatars">
        <div class="match-modal-avatar you">${esc(firstName(AppState.quizData.name).charAt(0))}</div>
        <div class="match-modal-heart">&#10084;</div>
        <div class="match-modal-avatar them">${esc(match.name.charAt(0))}</div>
      </div>

      <div class="match-modal-contact">
        <p class="match-modal-contact-note">Now that you've both matched, here's how to reach this ${otherLabel}:</p>
        <div class="match-modal-contact-row">
          <span class="match-detail-label">Email</span>
          <span>${esc(match.email)}</span>
        </div>
        <div class="match-modal-contact-row">
          <span class="match-detail-label">Phone</span>
          <span>${esc(match.phone)}</span>
        </div>
      </div>

      <div class="match-modal-actions">
        <button class="btn btn-primary" id="modal-chat-btn">Start Chatting</button>
        <button class="btn btn-secondary" id="modal-keep-btn">Keep Swiping</button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)

  document.getElementById('modal-chat-btn').addEventListener('click', () => {
    overlay.remove()
    AppState.activeChatId = match.id
    AppState.deckIndex++
    navigate('/connections')
  })

  document.getElementById('modal-keep-btn').addEventListener('click', () => {
    overlay.remove()
    AppState.deckIndex++
    renderSwipe()
  })
}

// ---- Connections + Chat View ----

function renderConnections() {
  const app = document.getElementById('app')
  const isAlumni = AppState.role === 'alumni'
  const otherLabel = isAlumni ? 'Student' : 'Alumni'
  const matches = AppState.mutualMatches

  if (matches.length === 0) {
    app.innerHTML = `
      <div class="connections-page">
        <div class="connections-container">
          <div class="section-bar"></div>
          <h1>Your Connections</h1>
          <div class="no-matches card">
            <p>No connections yet.</p>
            <p>Head back to swiping and heart some matches to connect.</p>
            <button class="btn btn-primary" id="back-swipe-btn">Back to Swiping</button>
          </div>
        </div>
      </div>
    `
    document.getElementById('back-swipe-btn').addEventListener('click', () => navigate('/matches'))
    return
  }

  // Default active chat to first connection
  if (!AppState.activeChatId || !matches.find((m) => m.id === AppState.activeChatId)) {
    AppState.activeChatId = matches[0].id
  }

  const activeMatch = matches.find((m) => m.id === AppState.activeChatId)

  // Connection list
  const listHtml = matches.map((m) => {
    const active = m.id === AppState.activeChatId
    return `
      <button class="conn-item ${active ? 'active' : ''}" data-conn="${m.id}">
        <div class="conn-item-avatar">${esc(m.name.charAt(0))}</div>
        <div class="conn-item-info">
          <span class="conn-item-name">${esc(m.name)}</span>
          <span class="conn-item-major">${esc(m.major)}</span>
        </div>
      </button>
    `
  }).join('')

  // Chat messages
  const messages = AppState.chats[activeMatch.id] || []
  const messagesHtml = messages.map((msg) => {
    const cls = msg.from === 'me' ? 'chat-bubble-me' : 'chat-bubble-them'
    return `<div class="chat-bubble ${cls}">${esc(msg.text)}</div>`
  }).join('')

  app.innerHTML = `
    <div class="connections-page">
      <div class="connections-container">
        <div class="connections-head">
          <div>
            <div class="section-bar"></div>
            <h1>Your Connections</h1>
            <p class="connections-sub">${matches.length} matched ${otherLabel.toLowerCase()}${matches.length === 1 ? '' : 's'}. Chat and share details.</p>
          </div>
          <button class="btn btn-secondary" id="back-swipe-btn">&larr; Back to Swiping</button>
        </div>

        <div class="connections-layout card">
          <aside class="conn-list">
            ${listHtml}
          </aside>

          <section class="chat-panel">
            <div class="chat-header">
              <div class="chat-header-avatar">${esc(activeMatch.name.charAt(0))}</div>
              <div class="chat-header-info">
                <span class="chat-header-name">${esc(activeMatch.name)}</span>
                <span class="chat-header-detail">${esc(activeMatch.major)} &middot; Class of ${esc(String(activeMatch.graduationYear))}</span>
              </div>
            </div>

            <div class="chat-contact-bar">
              <span>&#9993; ${esc(activeMatch.email)}</span>
              <span>&#128222; ${esc(activeMatch.phone)}</span>
            </div>

            <div class="chat-messages" id="chat-messages">
              ${messagesHtml}
            </div>

            <form class="chat-input-bar" id="chat-form">
              <input type="text" id="chat-input" placeholder="Type a message..." autocomplete="off" />
              <button type="submit" class="btn btn-primary">Send</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  `

  document.getElementById('back-swipe-btn').addEventListener('click', () => navigate('/matches'))

  // Connection switching
  document.querySelectorAll('[data-conn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      AppState.activeChatId = btn.dataset.conn
      renderConnections()
    })
  })

  // Scroll chat to bottom
  const msgContainer = document.getElementById('chat-messages')
  if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight

  // Chat form submit
  const chatForm = document.getElementById('chat-form')
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.getElementById('chat-input')
    const text = input.value.trim()
    if (!text) return

    AppState.chats[activeMatch.id].push({ from: 'me', text })
    input.value = ''
    renderConnections()

    // Simulated reply after a short delay
    setTimeout(() => {
      const replies = [
        'That sounds great!',
        'Happy to talk more about that.',
        "Let's set up a time to connect.",
        'Good question — let me share what worked for me.',
        'Absolutely, I can help with that.'
      ]
      const reply = replies[Math.floor(Math.random() * replies.length)]
      if (!AppState.chats[activeMatch.id]) AppState.chats[activeMatch.id] = []
      AppState.chats[activeMatch.id].push({ from: 'them', text: reply })
      if (AppState.activeChatId === activeMatch.id && getRoute() === '/connections') {
        renderConnections()
      }
    }, 900)
  })

  // Focus input
  const input = document.getElementById('chat-input')
  if (input) input.focus()
}

// ---- Utility ----

function esc(str) {
  const div = document.createElement('div')
  div.textContent = str == null ? '' : str
  return div.innerHTML
}

// ---- Init ----

window.addEventListener('hashchange', router)
window.addEventListener('DOMContentLoaded', router)
