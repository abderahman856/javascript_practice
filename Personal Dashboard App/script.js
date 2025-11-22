/* ============================
   Personal Dashboard - script.js
   Implements Navigation, Theme, Weather, To-Do, Notes, Calculator
   ============================ */

/* -------------------------
   Global DOM selections
   ------------------------- */
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel');
const toggleThemeBtn = document.getElementById('toggleTheme');

// WEATHER DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherError = document.getElementById('weatherError');
const weatherResult = document.getElementById('weatherResult');
const cityNameEl = document.getElementById('cityName');
const weatherIconEl = document.getElementById('weatherIcon');
const temperatureEl = document.getElementById('temperature');
const conditionEl = document.getElementById('condition');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');

// TODO DOM
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoListEl = document.getElementById('todoList');

// NOTES DOM
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const notesContainer = document.getElementById('notesContainer');

// CALCULATOR DOM
const calcDisplay = document.getElementById('calcDisplay');
const keysContainer = document.querySelector('.keys');
const equalBtn = document.getElementById('equal');

/* -------------------------
   Constants & State
   ------------------------- */
const WEATHER_API_KEY = 'af571b6ed1a88be489cd41bda46d2f54'; 
const WEATHER_BASE = 'https://api.openweathermap.org/data/2.5/weather';

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];

/* ============================
   TASK 1: Navigation / Panels
   ============================ */
function showSection(sectionId) {
  // remove active from nav
  navItems.forEach(n => n.classList.remove('active'));
  // hide all panels
  panels.forEach(p => p.classList.add('hidden'));

  // mark the nav item active
  const nav = [...navItems].find(n => n.dataset.section === sectionId);
  if (nav) nav.classList.add('active');

  // show the requested panel
  const panel = document.getElementById(sectionId);
  if (panel) panel.classList.remove('hidden');
}

// init default section: weather
showSection('weather');

// navigation event delegation
document.querySelector('.sidebar ul').addEventListener('click', (e) => {
  const li = e.target.closest('.nav-item');
  if (!li) return;

  // Toggle theme button is a nav-item with id toggleTheme: handled separately
  if (li.id === 'toggleTheme') {
    toggleTheme();
    return;
  }

  const section = li.dataset.section;
  if (section) showSection(section);
});

/* ============================
   TASK 2: Dark / Light Theme
   - Save in localStorage
   - Add class to <body>
   - Update icon text
   ============================ */
function applyTheme(theme) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  localStorage.setItem('theme', theme);
  // update toggle button text/icon
  toggleThemeBtn.textContent = theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode';
}

// read saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

function toggleTheme() {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ============================
   TASK 3: Weather App (API)
   - Fetch API
   - Error handling
   - UI update
   - Display weather + icon
   ============================ */
function showWeatherError(msg) {
  weatherError.textContent = msg;
  weatherError.classList.remove('hidden');
  weatherResult.classList.add('hidden');
}

function showWeatherData(data) {
  weatherError.classList.add('hidden');
  weatherResult.classList.remove('hidden');

  cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
  temperatureEl.textContent = `${Math.round(data.main.temp)} °C`;
  conditionEl.textContent = data.weather[0].description;
  humidityEl.textContent = data.main.humidity;
  windEl.textContent = data.wind.speed;

  const icon = data.weather[0].icon; // e.g., "04d"
  weatherIconEl.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIconEl.alt = data.weather[0].description;
}

async function fetchWeather(city) {
  if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY_HERE') {
    showWeatherError('Please set your OpenWeatherMap API key in script.js');
    return;
  }

  try {
    weatherError.classList.add('hidden');
    weatherResult.classList.add('hidden');

    const url = `${WEATHER_BASE}?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      // HTTP error like 404 (city not found)
      throw new Error('City not found or API error');
    }

    const data = await res.json();
    showWeatherData(data);
  } catch (err) {
    showWeatherError('Could not load weather. Check city name or your API key.');
    console.error('Weather fetch error:', err);
  }
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city === '') {
    showWeatherError('Please enter a city name');
    return;
  }
  fetchWeather(city);
});

/* ============================
   TASK 4: To-Do App
   - Add/Delete/Edit/Complete/Save/Filter/Search
   ============================ */

// We will add a small search input above the list programmatically to satisfy filter/search requirement
(function addTodoSearchField() {
  const container = document.querySelector('#todo .todo-input');
  const search = document.createElement('input');
  search.placeholder = 'Search tasks...';
  search.id = 'todoSearch';
  search.style.padding = '8px';
  search.style.flex = '1';
  search.style.maxWidth = '200px';
  search.addEventListener('input', renderTodos);
  container.appendChild(search);
})();

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  const searchTerm = (document.getElementById('todoSearch').value || '').toLowerCase();
  todoListEl.innerHTML = '';

  todos.forEach((t, index) => {
    // filter by search term
    if (searchTerm && !t.text.toLowerCase().includes(searchTerm)) return;

    const li = document.createElement('li');
    li.dataset.index = index;
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.gap = '10px';

    const left = document.createElement('div');
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '10px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completed || false;
    checkbox.addEventListener('change', () => {
      t.completed = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    const span = document.createElement('span');
    span.textContent = t.text;
    if (t.completed) {
      span.style.textDecoration = 'line-through';
      span.style.opacity = '0.6';
    }

    left.appendChild(checkbox);
    left.appendChild(span);

    const actions = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.marginRight = '6px';
    editBtn.addEventListener('click', () => startEditTodo(index));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
      if (confirm('Delete this task?')) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      }
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);
    todoListEl.appendChild(li);
  });
}

function startEditTodo(index) {
  const t = todos[index];
  const newText = prompt('Edit task', t.text);
  if (newText !== null) {
    todos[index].text = newText.trim();
    saveTodos();
    renderTodos();
  }
}

addTodoBtn.addEventListener('click', () => {
  const text = todoInput.value.trim();
  if (text === '') return alert('Please enter a task');
  todos.push({ text, completed: false, createdAt: Date.now() });
  todoInput.value = '';
  saveTodos();
  renderTodos();
});

// render initial todos
renderTodos();

/* ============================
   TASK 5: Notes App
   - Save/Delete/List/Date/Search
   ============================ */

function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes(filter = '') {
  const q = (filter || '').toLowerCase();
  notesContainer.innerHTML = '';

  notes.forEach((n, idx) => {
    if (q && !n.text.toLowerCase().includes(q)) return;

    const noteEl = document.createElement('div');
    noteEl.className = 'note';
    const created = new Date(n.date).toLocaleString();

    noteEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; gap:10px;">
        <strong>${created}</strong>
        <div>
          <button data-index="${idx}" class="delete-note">Delete</button>
        </div>
      </div>
      <p style="margin-top:8px;">${escapeHtml(n.text)}</p>
    `;
    notesContainer.appendChild(noteEl);
  });
}

// basic HTML escape to avoid injecting HTML
function escapeHtml(str) {
  return str.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

saveNoteBtn.addEventListener('click', () => {
  const text = noteText.value.trim();
  if (!text) return alert('Please write a note');
  notes.unshift({ text, date: Date.now() }); // add newest first
  noteText.value = '';
  saveNotes();
  renderNotes();
});

// delete using event delegation
notesContainer.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete-note');
  if (!btn) return;
  const index = Number(btn.dataset.index);
  if (confirm('Delete this note?')) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  }
});

// optional: add search for notes by adding an input dynamically
(function addNotesSearch() {
  const container = document.getElementById('notes');
  const input = document.createElement('input');
  input.placeholder = 'Search notes...';
  input.style.display = 'block';
  input.style.marginBottom = '10px';
  input.addEventListener('input', () => renderNotes(input.value));
  container.insertBefore(input, notesContainer);
})();

renderNotes();

/* ============================
   TASK 6: Calculator
   - numbers, operators, clear, evaluate
   - prevent invalid expressions
   ============================ */

function isOperator(ch) {
  return ['+', '-', '*', '/'].includes(ch);
}

keysContainer.addEventListener('click', (e) => {
  const key = e.target.closest('.key');
  if (!key) return;

  const value = key.textContent.trim();

  // If value is operator and last char is operator -> ignore
  const display = calcDisplay.value || '';
  const lastChar = display[display.length - 1];

  if (isOperator(value)) {
    if (display === '' && value !== '-') return; // don't start with + * /
    if (isOperator(lastChar)) return; // prevent 5++ or 5+-*
    calcDisplay.value = display + value;
    return;
  }

  // dot: prevent multiple dots in same number
  if (value === '.') {
    // split by operators to find current number
    const parts = display.split(/[\+\-\*\/]/);
    const current = parts[parts.length - 1];
    if (current.includes('.')) return;
    calcDisplay.value = display + '.';
    return;
  }

  // number
  calcDisplay.value = display + value;
});

// equal button evaluate safely
equalBtn.addEventListener('click', () => {
  const expr = calcDisplay.value;
  if (!expr) return;
  const lastChar = expr[expr.length - 1];
  if (isOperator(lastChar)) return alert('Incomplete expression');

  try {
    // eslint-disable-next-line no-eval
    const result = eval(expr);
    if (result === Infinity || Number.isNaN(result)) throw new Error('Invalid math');
    calcDisplay.value = String(result);
  } catch (err) {
    alert('Invalid expression');
  }
});

// Add clear via double click on display
calcDisplay.addEventListener('dblclick', () => (calcDisplay.value = ''));

/* ============================
   Final: small helpers & init
   ============================ */

// make sure panels are correct on load (weather visible)
showSection('weather');

// ensure todos/notes loaded into UI
renderTodos();
renderNotes();

// Expose some functions for debugging (optional)
window._app = {
  todos,
  notes,
  fetchWeather,
  showSection,
};
