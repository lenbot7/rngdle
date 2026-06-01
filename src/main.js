import './style.css'

const STORAGE_KEY = 'rngdle-unlimited-v1'
const MAX_ROLLS = 200

const BADGES = [
  {
    id: 'million',
    name: 'Millionaire',
    emoji: '💎',
    rarity: 'mythic',
    points: 500,
    description: 'Roll exactly 1,000,000.',
    check: ({ number }) => number === 1000000,
  },
  {
    id: 'palindrome',
    name: 'Mirror Mirror',
    emoji: '🪞',
    rarity: 'legendary',
    points: 120,
    description: 'Digits read the same forward and backward.',
    check: ({ digitString }) => digitString === reverseString(digitString),
  },
  {
    id: 'all-same',
    name: 'Monochrome',
    emoji: '🧬',
    rarity: 'legendary',
    points: 150,
    description: 'Every digit is the same.',
    check: ({ uniqueCount }) => uniqueCount === 1,
  },
  {
    id: 'straight-up',
    name: 'Straight Up',
    emoji: '📈',
    rarity: 'epic',
    points: 90,
    description: 'Digits count upward in order.',
    check: ({ digits }) => isSequential(digits, 1),
  },
  {
    id: 'straight-down',
    name: 'Straight Down',
    emoji: '📉',
    rarity: 'epic',
    points: 90,
    description: 'Digits count downward in order.',
    check: ({ digits }) => isSequential(digits, -1),
  },
  {
    id: 'prime',
    name: 'Prime Time',
    emoji: '🧮',
    rarity: 'epic',
    points: 80,
    description: 'Your roll is a prime number.',
    check: ({ number }) => isPrime(number),
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Flow',
    emoji: '🌀',
    rarity: 'rare',
    points: 60,
    description: 'Your roll is a Fibonacci number.',
    check: ({ number }) => isFibonacci(number),
  },
  {
    id: 'power-two',
    name: 'Power Surge',
    emoji: '⚡',
    rarity: 'rare',
    points: 55,
    description: 'Your roll is a power of two.',
    check: ({ number }) => isPowerOfTwo(number),
  },
  {
    id: 'mirror-halves',
    name: 'Twin Mirrors',
    emoji: '🪞',
    rarity: 'rare',
    points: 45,
    description: 'First half matches the last half.',
    check: ({ digitString }) => isMirrorHalves(digitString),
  },
  {
    id: 'repeater',
    name: 'Pattern Locked',
    emoji: '🔁',
    rarity: 'rare',
    points: 40,
    description: 'Digits repeat a short pattern.',
    check: ({ digitString }) => isRepeatingPattern(digitString),
  },
  {
    id: 'full-house',
    name: 'Full House',
    emoji: '🏠',
    rarity: 'rare',
    points: 40,
    description: 'A triple and a pair show up together.',
    check: ({ counts }) => isFullHouse(counts),
  },
  {
    id: 'double-pair',
    name: 'Double Pair',
    emoji: '🎯',
    rarity: 'uncommon',
    points: 25,
    description: 'At least two different pairs appear.',
    check: ({ counts }) => countPairs(counts) >= 2,
  },
  {
    id: 'all-unique',
    name: 'Rainbow Digits',
    emoji: '🌈',
    rarity: 'uncommon',
    points: 25,
    description: 'All digits are different.',
    check: ({ uniqueCount, digitString }) => uniqueCount === digitString.length,
  },
  {
    id: 'all-even',
    name: 'Even Stevens',
    emoji: '🟦',
    rarity: 'uncommon',
    points: 20,
    description: 'Every digit is even.',
    check: ({ digits }) => digits.every((digit) => digit % 2 === 0),
  },
  {
    id: 'all-odd',
    name: 'Odd Squad',
    emoji: '🟥',
    rarity: 'uncommon',
    points: 20,
    description: 'Every digit is odd.',
    check: ({ digits }) => digits.every((digit) => digit % 2 === 1),
  },
  {
    id: 'quad-streak',
    name: 'Quad Streak',
    emoji: '🧊',
    rarity: 'rare',
    points: 35,
    description: 'Four identical digits in a row.',
    check: ({ digits }) => hasConsecutive(digits, 4),
  },
  {
    id: 'triple-streak',
    name: 'Triple Streak',
    emoji: '🔥',
    rarity: 'uncommon',
    points: 18,
    description: 'Three identical digits in a row.',
    check: ({ digits }) => hasConsecutive(digits, 3),
  },
  {
    id: 'double-streak',
    name: 'Double Streak',
    emoji: '✨',
    rarity: 'common',
    points: 10,
    description: 'Two identical digits in a row.',
    check: ({ digits }) => hasConsecutive(digits, 2),
  },
  {
    id: 'lucky-7',
    name: 'Lucky Seven',
    emoji: '🎰',
    rarity: 'common',
    points: 8,
    description: 'At least one 7 shows up.',
    check: ({ digitString }) => digitString.includes('7'),
  },
  {
    id: 'nice',
    name: 'Nice Roll',
    emoji: '😎',
    rarity: 'common',
    points: 6,
    description: 'You hit a 69 or 420 pattern.',
    check: ({ digitString }) =>
      digitString.includes('69') || digitString.includes('420'),
  },
  {
    id: 'low-roll',
    name: 'Pocket Change',
    emoji: '🪙',
    rarity: 'rare',
    points: 40,
    description: 'Roll 1,000 or lower.',
    check: ({ number }) => number <= 1000,
  },
  {
    id: 'high-roll',
    name: 'Sky High',
    emoji: '🚀',
    rarity: 'rare',
    points: 40,
    description: 'Roll 999,000 or higher.',
    check: ({ number }) => number >= 999000,
  },
  {
    id: 'zero-hero',
    name: 'Zero Hero',
    emoji: '🧊',
    rarity: 'uncommon',
    points: 18,
    description: 'Three zeros in a row.',
    check: ({ digitString }) => digitString.includes('000'),
  },
]

const BASE_LEADERBOARD = [
  { name: 'StarCaster', points: 12600 },
  { name: 'NovaDice', points: 11240 },
  { name: 'EntropyElla', points: 10320 },
  { name: 'LuckyLoop', points: 9150 },
  { name: 'SevenSage', points: 8720 },
  { name: 'ZeroZen', points: 7950 },
  { name: 'PrimePilot', points: 7425 },
  { name: 'BadgeBard', points: 6910 },
]

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <div class="logo">🎲</div>
        <div>
          <p class="eyebrow">RNGdle Unlimited</p>
          <h1>Roll random numbers, earn badges, stack entropy.</h1>
        </div>
      </div>
      <div class="topbar-actions">
        <div class="pill">📅 <span id="today-date"></span></div>
        <label class="name-field">
          Display name
          <input id="display-name" type="text" maxlength="20" />
        </label>
        <button id="reset-btn" class="btn ghost">Reset</button>
      </div>
    </header>

    <main class="main-grid">
      <section class="panel roll-panel">
        <div class="panel-header">
          <div>
            <h2>Daily roll, unlimited plays</h2>
            <p>Original RNGdle limits you to one roll a day. This clone removes that limit.</p>
          </div>
          <div class="pill accent">Unlimited</div>
        </div>

        <div class="roll-display">
          <div class="roll-number" id="roll-number">—</div>
          <div class="roll-meta">
            <span id="roll-entropy">0 EP</span>
            <span id="roll-badge-count">0 badges</span>
            <span id="roll-time">No rolls yet</span>
          </div>
        </div>

        <div class="roll-actions">
          <button id="roll-btn" class="btn primary">Roll now</button>
          <button id="share-btn" class="btn ghost">Share</button>
        </div>

        <div class="roll-badges" id="roll-badges"></div>
        <p class="roll-status" id="roll-status">Press roll to generate a number between 0 and 1,000,000.</p>
      </section>

      <section class="panel stats-panel">
        <div class="panel-header">
          <div>
            <h2>Your stats</h2>
            <p>Entropy points add up across unlimited rolls.</p>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <span>Total rolls</span>
            <strong id="stat-rolls">0</strong>
          </div>
          <div class="stat-card">
            <span>Total EP</span>
            <strong id="stat-entropy">0</strong>
          </div>
          <div class="stat-card">
            <span>Badges earned</span>
            <strong id="stat-badges">0</strong>
          </div>
          <div class="stat-card">
            <span>Best roll EP</span>
            <strong id="stat-best">0</strong>
          </div>
        </div>
      </section>
    </main>

    <section class="panel badge-panel">
      <div class="panel-header">
        <div>
          <h2>Badge cabinet</h2>
          <p>All badges available in this RNGdle clone.</p>
        </div>
        <div class="pill">Total badges: ${BADGES.length}</div>
      </div>
      <div class="badge-grid" id="badge-gallery"></div>
    </section>

    <section class="panel history-panel">
      <div class="panel-header">
        <div>
          <h2>Roll history</h2>
          <p>Last 10 rolls with their earned badges.</p>
        </div>
      </div>
      <div class="history-list" id="history-list"></div>
    </section>

    <section class="panel leaderboard-panel">
      <div class="panel-header">
        <div>
          <h2>Leaderboard</h2>
          <p>Local leaderboard seeded with sample players.</p>
        </div>
      </div>
      <div class="leaderboard-list" id="leaderboard-list"></div>
    </section>

    <section class="panel rules-panel">
      <div class="panel-header">
        <div>
          <h2>How to play</h2>
          <p>Rules pulled from rngdle.com/about (daily roll) with unlimited play enabled.</p>
        </div>
      </div>
      <ul class="rules-list">
        <li>Roll a random number between 0 and 1,000,000.</li>
        <li>Each roll is analyzed for number patterns (palindromes, primes, repeats, sequences).</li>
        <li>Earn badges and entropy points (EP) based on the patterns found.</li>
        <li>Compare your total EP on the leaderboard.</li>
        <li>This clone removes the daily roll limit: roll as much as you want.</li>
      </ul>
    </section>

    <div class="toast" id="toast"></div>
  </div>
`

const displayNameInput = document.getElementById('display-name')
const rollButton = document.getElementById('roll-btn')
const shareButton = document.getElementById('share-btn')
const resetButton = document.getElementById('reset-btn')
const rollNumber = document.getElementById('roll-number')
const rollEntropy = document.getElementById('roll-entropy')
const rollBadgeCount = document.getElementById('roll-badge-count')
const rollTime = document.getElementById('roll-time')
const rollBadges = document.getElementById('roll-badges')
const rollStatus = document.getElementById('roll-status')
const badgeGallery = document.getElementById('badge-gallery')
const historyList = document.getElementById('history-list')
const leaderboardList = document.getElementById('leaderboard-list')
const toast = document.getElementById('toast')

const state = loadState()

displayNameInput.value = state.displayName
document.getElementById('today-date').textContent = new Date().toLocaleDateString(
  undefined,
  { weekday: 'short', month: 'short', day: 'numeric' },
)

displayNameInput.addEventListener('input', (event) => {
  state.displayName = event.target.value.trim().slice(0, 20) || 'You'
  saveState()
  renderLeaderboard()
})

rollButton.addEventListener('click', () => {
  const nextRoll = createRoll()
  state.rolls.unshift(nextRoll)
  state.rolls = state.rolls.slice(0, MAX_ROLLS)
  saveState()
  renderAll()
})

shareButton.addEventListener('click', () => {
  const current = state.rolls[0]
  if (!current) {
    showToast('Roll first to share your result.')
    return
  }
  const shareText = formatShareText(current)
  navigator.clipboard
    ?.writeText(shareText)
    .then(() => showToast('Copied results to clipboard.'))
    .catch(() => showToast('Copy failed. Your browser may block clipboard access.'))
})

resetButton.addEventListener('click', () => {
  if (!confirm('Clear all roll history and stats?')) return
  state.rolls = []
  saveState()
  renderAll()
})

renderAll()

function renderAll() {
  renderCurrentRoll()
  renderStats()
  renderBadges()
  renderHistory()
  renderLeaderboard()
}

function renderCurrentRoll() {
  const current = state.rolls[0]
  if (!current) {
    rollNumber.textContent = '—'
    rollEntropy.textContent = '0 EP'
    rollBadgeCount.textContent = '0 badges'
    rollTime.textContent = 'No rolls yet'
    rollBadges.innerHTML = ''
    rollStatus.textContent =
      'Press roll to generate a number between 0 and 1,000,000.'
    return
  }
  rollNumber.textContent = current.display
  rollEntropy.textContent = `${current.entropy.toLocaleString()} EP`
  rollBadgeCount.textContent = `${current.badges.length} badges`
  rollTime.textContent = new Date(current.timestamp).toLocaleTimeString()
  rollBadges.innerHTML = current.badges
    .map((badgeId) => {
      const badge = getBadge(badgeId)
      return `<span class="badge-chip rarity-${badge.rarity}">${badge.emoji} ${badge.name}</span>`
    })
    .join('')
  rollStatus.textContent =
    current.badges.length === 0
      ? 'No badges this time — roll again!'
      : `Nice! You earned ${current.badges.length} badge${
          current.badges.length === 1 ? '' : 's'
        } for this roll.`
}

function renderStats() {
  const totalRolls = state.rolls.length
  const totalEntropy = state.rolls.reduce((sum, roll) => sum + roll.entropy, 0)
  const uniqueBadges = new Set(state.rolls.flatMap((roll) => roll.badges)).size
  const bestRoll = state.rolls.reduce(
    (best, roll) => (!best || roll.entropy > best.entropy ? roll : best),
    null,
  )

  document.getElementById('stat-rolls').textContent = totalRolls
  document.getElementById('stat-entropy').textContent =
    totalEntropy.toLocaleString()
  document.getElementById('stat-badges').textContent = uniqueBadges
  document.getElementById('stat-best').textContent = bestRoll
    ? bestRoll.entropy.toLocaleString()
    : '0'
}

function renderBadges() {
  const badgeCounts = countBadges(state.rolls)
  badgeGallery.innerHTML = BADGES.map((badge) => {
    const count = badgeCounts[badge.id] || 0
    const lockedClass = count === 0 ? 'locked' : ''
    return `
      <article class="badge-card ${lockedClass}">
        <div class="badge-emoji">${badge.emoji}</div>
        <div class="badge-info">
          <div class="badge-title">
            <h3>${badge.name}</h3>
            <span class="pill rarity-${badge.rarity}">${badge.rarity}</span>
          </div>
          <p>${badge.description}</p>
          <div class="badge-footer">
            <span>${badge.points} EP</span>
            <span class="badge-count">${count}×</span>
          </div>
        </div>
      </article>
    `
  }).join('')
}

function renderHistory() {
  const latest = state.rolls.slice(0, 10)
  historyList.replaceChildren()
  if (latest.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'empty-state'
    empty.textContent = 'No rolls yet.'
    historyList.append(empty)
    return
  }

  latest.forEach((roll) => {
    const item = document.createElement('div')
    item.className = 'history-item'

    const left = document.createElement('div')
    const number = document.createElement('strong')
    number.textContent = roll.display
    const badges = document.createElement('span')
    badges.textContent =
      roll.badges.length === 0
        ? 'No badges'
        : roll.badges.map((id) => getBadge(id).emoji).join(' ')
    left.append(number, badges)

    const meta = document.createElement('div')
    meta.className = 'history-meta'
    const entropy = document.createElement('span')
    entropy.textContent = `${roll.entropy} EP`
    const time = document.createElement('span')
    time.textContent = new Date(roll.timestamp).toLocaleTimeString()
    meta.append(entropy, time)

    item.append(left, meta)
    historyList.append(item)
  })
}

function renderLeaderboard() {
  const totalEntropy = state.rolls.reduce((sum, roll) => sum + roll.entropy, 0)
  const entries = [
    ...BASE_LEADERBOARD,
    { name: state.displayName, points: totalEntropy, isYou: true },
  ]
  entries.sort((a, b) => b.points - a.points)
  leaderboardList.replaceChildren()
  entries.slice(0, 8).forEach((entry, index) => {
    const item = document.createElement('div')
    item.className = `leaderboard-item${entry.isYou ? ' you' : ''}`

    const rank = document.createElement('span')
    rank.className = 'rank'
    rank.textContent = `#${index + 1}`

    const name = document.createElement('span')
    name.className = 'name'
    name.textContent = `${entry.name}${entry.isYou ? ' (You)' : ''}`

    const points = document.createElement('span')
    points.className = 'points'
    points.textContent = `${entry.points.toLocaleString()} EP`

    item.append(rank, name, points)
    leaderboardList.append(item)
  })
}

function createRoll() {
  const number = Math.floor(Math.random() * 1000001)
  const digitString = formatDigits(number)
  const digits = digitString.split('').map(Number)
  const counts = digits.reduce((acc, digit) => {
    acc[digit] = (acc[digit] || 0) + 1
    return acc
  }, {})
  const uniqueCount = Object.keys(counts).length

  const context = { number, digitString, digits, counts, uniqueCount }
  const badges = BADGES.filter((badge) => badge.check(context)).map(
    (badge) => badge.id,
  )
  const entropy = badges.reduce(
    (sum, badgeId) => sum + getBadge(badgeId).points,
    0,
  )
  return {
    id: `${Date.now()}-${Math.round(Math.random() * 100000)}`,
    number,
    display: formatDisplay(number, digitString),
    digitString,
    badges,
    entropy,
    timestamp: Date.now(),
  }
}

function formatDigits(number) {
  if (number === 1000000) return '1000000'
  return number.toString().padStart(6, '0')
}

function formatDisplay(number, digitString) {
  if (number === 1000000) return '1,000,000'
  return digitString.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function countBadges(rolls) {
  return rolls.reduce((acc, roll) => {
    roll.badges.forEach((badgeId) => {
      acc[badgeId] = (acc[badgeId] || 0) + 1
    })
    return acc
  }, {})
}

function getBadge(id) {
  return BADGES.find((badge) => badge.id === id)
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && Array.isArray(saved.rolls)) {
      return { rolls: saved.rolls, displayName: saved.displayName || 'You' }
    }
  } catch (error) {
    console.warn('Failed to load state', error)
  }
  return { rolls: [], displayName: 'You' }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function showToast(message) {
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function formatShareText(roll) {
  const badgeNames =
    roll.badges.length === 0
      ? 'No badges'
      : roll.badges.map((id) => getBadge(id).name).join(', ')
  return [
    'RNGdle Unlimited',
    `Roll: ${roll.display}`,
    `Badges: ${badgeNames}`,
    `Entropy: ${roll.entropy} EP`,
  ].join('\n')
}

function hasConsecutive(digits, length) {
  let streak = 1
  for (let i = 1; i < digits.length; i += 1) {
    if (digits[i] === digits[i - 1]) {
      streak += 1
      if (streak >= length) return true
    } else {
      streak = 1
    }
  }
  return false
}

function isSequential(digits, step) {
  if (digits.length < 2) return false
  for (let i = 1; i < digits.length; i += 1) {
    if (digits[i] - digits[i - 1] !== step) {
      return false
    }
  }
  return true
}

function isPrime(number) {
  if (number < 2) return false
  if (number % 2 === 0) return number === 2
  const limit = Math.floor(Math.sqrt(number))
  for (let i = 3; i <= limit; i += 2) {
    if (number % i === 0) return false
  }
  return true
}

function isFibonacci(number) {
  const isPerfectSquare = (value) => {
    const root = Math.sqrt(value)
    return Number.isInteger(root)
  }
  return isPerfectSquare(5 * number * number + 4) || isPerfectSquare(5 * number * number - 4)
}

function isPowerOfTwo(number) {
  return number > 0 && (number & (number - 1)) === 0
}

function reverseString(value) {
  return value.split('').reverse().join('')
}

function isMirrorHalves(digitString) {
  if (digitString.length < 6) return false
  const left = digitString.slice(0, 3)
  const right = digitString.slice(-3)
  return left === right
}

function isRepeatingPattern(digitString) {
  const length = digitString.length
  const patterns = [2, 3]
  return patterns.some((size) => {
    if (length % size !== 0) return false
    const pattern = digitString.slice(0, size)
    return pattern.repeat(length / size) === digitString
  })
}

function countPairs(counts) {
  return Object.values(counts).filter((count) => count >= 2).length
}

function isFullHouse(counts) {
  const values = Object.values(counts)
  return values.includes(3) && values.includes(2)
}
