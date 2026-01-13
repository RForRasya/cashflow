// Data Transaksi
let transactions = [
  // Gaji Januari 2025
  { id: 1, type: "income", description: "Gaji Periode 1", amount: 3000000, date: "2025-01-18" },
  // Contoh pengeluaran Januari
  { id: 2, type: "expense", description: "Makan & Minum", amount: 500000, date: "2025-01-19" },
  { id: 3, type: "expense", description: "Transport", amount: 200000, date: "2025-01-20" },
  { id: 4, type: "expense", description: "Pulsa & Internet", amount: 150000, date: "2025-01-21" },
]

// Data Event Cicilan HP - Feb 2025 s/d Jan 2027 (jatuh tempo tanggal 2)
let events = []

function generateCicilanHP() {
  const cicilanAmount = 500000 // Jumlah cicilan per bulan
  let id = 100

  // Feb 2025 - Jan 2027 (24 bulan)
  const bulanNama = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  // Mulai Feb 2025 (bulan 1 = Februari index 1) sampai Jan 2027
  for (let year = 2025; year <= 2027; year++) {
    const startMonth = year === 2025 ? 1 : 0 // Feb 2025 start
    const endMonth = year === 2027 ? 0 : 11 // Jan 2027 end

    for (let month = startMonth; month <= endMonth; month++) {
      if (year === 2027 && month > 0) break // Stop after Jan 2027

      const cicilanKe = (year - 2025) * 12 + month - 1 + 1
      if (cicilanKe > 24) break

      events.push({
        id: id++,
        title: `Cicilan HP ke-${cicilanKe}`,
        type: "installment",
        amount: cicilanAmount,
        dueDate: `${year}-${String(month + 1).padStart(2, "0")}-02`,
        paid: false,
        recurring: true,
      })
    }
  }
}

// Data Tabungan
let savings = []

// Event Wajib Nabung
const savingsTarget = 300000 // Minimum nabung per bulan

// Current Date untuk navigasi bulan
const currentDate = new Date(2025, 0, 18) // Mulai 18 Januari 2025

// Initialize app
function init() {
  updateTime()
  setInterval(updateTime, 1000)
  generateCicilanHP()

  addWajibNabungEvents()

  updateMonthDisplay()
  renderAll()
  updateNextSalary()
}

function addWajibNabungEvents() {
  let id = 500
  for (let year = 2025; year <= 2026; year++) {
    for (let month = 0; month < 12; month++) {
      events.push({
        id: id++,
        title: "Wajib Nabung",
        type: "savings_reminder",
        amount: savingsTarget,
        dueDate: `${year}-${String(month + 1).padStart(2, "0")}-28`,
        paid: false,
        recurring: true,
      })
    }
  }
}

// Update time display
function updateTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, "0")
  const minutes = now.getMinutes().toString().padStart(2, "0")
  document.getElementById("currentTime").textContent = `${hours}:${minutes}`
}

// Month navigation
function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta)
  updateMonthDisplay()
  renderAll()
}

function updateMonthDisplay() {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]
  document.getElementById("currentMonth").textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
}

// Tab switching
function switchTab(tab) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"))
  document.querySelectorAll(".content").forEach((c) => c.classList.add("hidden"))

  if (event && event.target) {
    event.target.classList.add("active")
  }
  document.getElementById(`${tab}Content`).classList.remove("hidden")

  // Update nav
  document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"))
}

// Modal functions
function openModal(type) {
  const overlay = document.getElementById("modalOverlay")
  const title = document.getElementById("modalTitle")
  const content = document.getElementById("modalContent")

  overlay.classList.add("active")

  if (type === "transaction") {
    title.textContent = "Tambah Transaksi"
    content.innerHTML = `
            <form onsubmit="addTransaction(event)">
                <div class="form-group">
                    <label>Tipe Transaksi</label>
                    <div class="type-selector">
                        <button type="button" class="type-btn income active" onclick="selectType('income', this)">Pemasukan</button>
                        <button type="button" class="type-btn expense" onclick="selectType('expense', this)">Pengeluaran</button>
                    </div>
                    <input type="hidden" id="transactionType" value="income">
                </div>
                <div class="form-group">
                    <label>Deskripsi</label>
                    <input type="text" id="transactionDesc" placeholder="Contoh: Gaji, Makan, dll" required>
                </div>
                <div class="form-group">
                    <label>Jumlah (Rp)</label>
                    <input type="number" id="transactionAmount" placeholder="0" required>
                </div>
                <div class="form-group">
                    <label>Tanggal</label>
                    <input type="date" id="transactionDate" value="${formatDateInput(currentDate)}" required>
                </div>
                <button type="submit" class="submit-btn">Simpan Transaksi</button>
            </form>
        `
  } else if (type === "event") {
    title.textContent = "Tambah Event"
    content.innerHTML = `
            <form onsubmit="addEvent(event)">
                <div class="form-group">
                    <label>Nama Event</label>
                    <input type="text" id="eventTitle" placeholder="Contoh: Cicilan Motor" required>
                </div>
                <div class="form-group">
                    <label>Jumlah (Rp)</label>
                    <input type="number" id="eventAmount" placeholder="0" required>
                </div>
                <div class="form-group">
                    <label>Tanggal Jatuh Tempo</label>
                    <input type="date" id="eventDueDate" required>
                </div>
                <button type="submit" class="submit-btn">Simpan Event</button>
            </form>
        `
  } else if (type === "savings") {
    title.textContent = "Tambah Tabungan"
    content.innerHTML = `
            <form onsubmit="addSavings(event)">
                <div class="form-group">
                    <label>Catatan (Opsional)</label>
                    <input type="text" id="savingsNote" placeholder="Contoh: Tabungan mingguan">
                </div>
                <div class="form-group">
                    <label>Jumlah (Rp)</label>
                    <input type="number" id="savingsAmount" placeholder="Minimum 300.000" required>
                </div>
                <div class="form-group">
                    <label>Tanggal</label>
                    <input type="date" id="savingsDate" value="${formatDateInput(currentDate)}" required>
                </div>
                <button type="submit" class="submit-btn" style="background: var(--success)">Simpan Tabungan</button>
            </form>
        `
  }
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active")
}

function selectType(type, btn) {
  document.querySelectorAll(".type-btn").forEach((b) => b.classList.remove("active"))
  btn.classList.add("active")
  document.getElementById("transactionType").value = type
}

function formatDateInput(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// CRUD Operations
function addTransaction(e) {
  e.preventDefault()

  const transaction = {
    id: Date.now(),
    type: document.getElementById("transactionType").value,
    description: document.getElementById("transactionDesc").value,
    amount: Number.parseInt(document.getElementById("transactionAmount").value),
    date: document.getElementById("transactionDate").value,
  }

  transactions.push(transaction)
  closeModal()
  renderAll()
}

function addEvent(e) {
  e.preventDefault()

  const newEvent = {
    id: Date.now(),
    title: document.getElementById("eventTitle").value,
    type: "custom",
    amount: Number.parseInt(document.getElementById("eventAmount").value),
    dueDate: document.getElementById("eventDueDate").value,
    paid: false,
  }

  events.push(newEvent)
  closeModal()
  renderAll()
}

function addSavings(e) {
  e.preventDefault()

  const saving = {
    id: Date.now(),
    note: document.getElementById("savingsNote").value || "Tabungan",
    amount: Number.parseInt(document.getElementById("savingsAmount").value),
    date: document.getElementById("savingsDate").value,
  }

  savings.push(saving)
  closeModal()
  renderAll()
}

function payEvent(eventId) {
  const eventIndex = events.findIndex((e) => e.id === eventId)
  if (eventIndex !== -1) {
    events[eventIndex].paid = true

    if (events[eventIndex].type === "savings_reminder") {
      savings.push({
        id: Date.now(),
        note: "Wajib Nabung Bulanan",
        amount: events[eventIndex].amount,
        date: new Date().toISOString().split("T")[0],
      })
    } else {
      // Add as expense transaction untuk cicilan
      transactions.push({
        id: Date.now(),
        type: "expense",
        description: events[eventIndex].title,
        amount: events[eventIndex].amount,
        date: new Date().toISOString().split("T")[0],
      })
    }

    renderAll()
  }
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id)
  renderAll()
}

function deleteEvent(id) {
  events = events.filter((e) => e.id !== id)
  renderAll()
}

function deleteSavings(id) {
  savings = savings.filter((s) => s.id !== id)
  renderAll()
}

// Render functions
function renderAll() {
  renderTransactions()
  renderEvents()
  renderSavings()
  updateBalance()
}

function renderTransactions() {
  const list = document.getElementById("transactionsList")
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const filtered = transactions
    .filter((t) => {
      const d = new Date(t.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  if (filtered.length === 0) {
    list.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <p>Belum ada transaksi bulan ini</p>
            </div>
        `
    return
  }

  list.innerHTML = filtered
    .map(
      (t) => `
        <div class="transaction-item">
            <div class="transaction-icon ${t.type}">
                ${t.type === "income" ? '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 19V5m0 0l-7 7m7-7l7 7" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' : '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 5v14m0 0l7-7m-7 7l-7-7" stroke="#f87171" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'}
            </div>
            <div class="transaction-info">
                <h4>${t.description}</h4>
                <span>${formatDate(t.date)}</span>
            </div>
            <span class="transaction-amount ${t.type}">
                ${t.type === "income" ? "+" : "-"} ${formatCurrency(t.amount)}
            </span>
            <button class="delete-btn" onclick="deleteTransaction(${t.id})">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </div>
    `,
    )
    .join("")
}

function renderEvents() {
  const list = document.getElementById("eventsList")
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const filtered = events
    .filter((e) => {
      const d = new Date(e.dueDate)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

  if (filtered.length === 0) {
    list.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p>Tidak ada event bulan ini</p>
            </div>
        `
    return
  }

  list.innerHTML = filtered
    .map(
      (e) => `
        <div class="event-item ${e.paid ? "paid" : ""} ${e.type === "savings_reminder" ? "savings-event" : ""}">
            <div class="event-header">
                <span class="event-title">
                    ${e.type === "savings_reminder" ? '<svg viewBox="0 0 24 24" width="18" height="18" style="margin-right:6px;vertical-align:middle"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/></svg>' : '<svg viewBox="0 0 24 24" width="18" height="18" style="margin-right:6px;vertical-align:middle"><rect x="2" y="6" width="20" height="12" rx="2" stroke="#ff9500" stroke-width="2" fill="none"/><path d="M6 10h4M14 10h4M6 14h12" stroke="#ff9500" stroke-width="2" stroke-linecap="round"/></svg>'}
                    ${e.title}
                </span>
                <span class="event-badge ${e.paid ? "paid" : "pending"}">
                    ${e.paid ? "Lunas" : "Belum Bayar"}
                </span>
            </div>
            <div class="event-details">
                <span>Jatuh tempo: ${formatDate(e.dueDate)}</span>
            </div>
            <div class="event-amount">${formatCurrency(e.amount)}</div>
            <div style="display: flex; gap: 8px;">
                <button class="event-btn ${e.type === "savings_reminder" ? "savings-btn-style" : ""}" onclick="payEvent(${e.id})" ${e.paid ? "disabled" : ""}>
                    ${e.paid ? "Sudah Dibayar" : e.type === "savings_reminder" ? "Nabung Sekarang" : "Bayar Sekarang"}
                </button>
                <button class="delete-btn" onclick="deleteEvent(${e.id})" style="padding: 12px 16px;">
                    <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

function renderSavings() {
  const list = document.getElementById("savingsList")
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const filtered = savings
    .filter((s) => {
      const d = new Date(s.date)
      return d.getMonth() === month && d.getFullYear() === year
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const totalSavings = filtered.reduce((sum, s) => sum + s.amount, 0)
  const target = savingsTarget
  const percentage = Math.min((totalSavings / target) * 100, 100)

  document.getElementById("currentSavings").textContent = formatCurrency(totalSavings)
  document.getElementById("savingsPercentage").textContent = `${Math.round(percentage)}%`
  document.getElementById("savingsProgress").style.width = `${percentage}%`

  if (filtered.length === 0) {
    list.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p>Belum ada tabungan bulan ini</p>
            </div>
        `
    return
  }

  list.innerHTML = filtered
    .map(
      (s) => `
        <div class="savings-item">
            <div class="savings-item-icon">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1" stroke="#4ade80" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
            </div>
            <div class="savings-item-info">
                <h4>${s.note}</h4>
                <span>${formatDate(s.date)}</span>
            </div>
            <span class="savings-item-amount">+${formatCurrency(s.amount)}</span>
            <button class="delete-btn" onclick="deleteSavings(${s.id})">
                <svg viewBox="0 0 24 24" width="14" height="14"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
        </div>
    `,
    )
    .join("")
}

function updateBalance() {
  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() === month && d.getFullYear() === year
  })

  const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expense = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expense

  document.getElementById("currentBalance").textContent = formatCurrency(balance)
  document.getElementById("totalIncome").textContent = formatCurrency(income)
  document.getElementById("totalExpense").textContent = formatCurrency(expense)
}

function updateNextSalary() {
  const today = new Date()
  const nextSalary = new Date(today)

  const currentDay = today.getDate()

  if (currentDay < 3) {
    nextSalary.setDate(3)
  } else if (currentDay < 18) {
    nextSalary.setDate(18)
  } else {
    nextSalary.setMonth(nextSalary.getMonth() + 1)
    nextSalary.setDate(3)
  }

  document.getElementById("nextSalary").textContent =
    `Gaji berikutnya: ${formatDate(nextSalary.toISOString().split("T")[0])}`
}

// Utility functions
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  const options = { day: "numeric", month: "long", year: "numeric" }
  return new Date(dateStr).toLocaleDateString("id-ID", options)
}

// Initialize on load
document.addEventListener("DOMContentLoaded", init)
