// Storage keys
const LS_USERS_KEY = 'meuPersonalUsers';
const LS_LOGGED_USER_KEY = 'meuPersonalLoggedUser';

// Elements
const loginRegisterContainer = document.getElementById('login-register-container');
const appContainer = document.getElementById('app');
const authForm = document.getElementById('auth-form');
const toggleFormBtn = document.getElementById('toggle-form');
const formTitle = document.getElementById('form-title');
const errorMessage = document.getElementById('error-message');
const nameGroup = document.getElementById('name-group');
const inputName = document.getElementById('name');
const inputEmail = document.getElementById('email');
const inputPassword = document.getElementById('password');

const sidebarButtons = {
  gym: document.getElementById('menu-gym'),
  box: document.getElementById('menu-box'),
  trainings: document.getElementById('menu-trainings'),
  profile: document.getElementById('menu-profile'),
};

const sections = {
  gym: document.getElementById('section-gym'),
  box: document.getElementById('section-box'),
  trainings: document.getElementById('section-trainings'),
  profile: document.getElementById('section-profile'),
};

const appHeader = document.querySelector('header.app-header');

// Exercise forms and lists
const formAddGym = document.getElementById('form-add-exercise-gym');
const exerciseListGym = document.getElementById('exercise-list-gym');

const formAddBox = document.getElementById('form-add-exercise-box');
const exerciseListBox = document.getElementById('exercise-list-box');

const weeklySchedule = document.getElementById('weekly-schedule');
const progressSummary = document.getElementById('progress-summary');
const btnReset = document.getElementById('btn-reset');
const profileDiv = document.getElementById('profile');
const btnLogout = document.getElementById('btn-logout');

// State
let users = JSON.parse(localStorage.getItem(LS_USERS_KEY)) || {};
let loggedUser = JSON.parse(localStorage.getItem(LS_LOGGED_USER_KEY)) || null;
let currentMenu = 'gym';

// Utility: Save users and logged user to localStorage
function saveUsers() {
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
}
function saveLoggedUser() {
  localStorage.setItem(LS_LOGGED_USER_KEY, JSON.stringify(loggedUser));
}

// Switch form - login or register
let isLogin = true;
function updateFormUI() {
  if (isLogin) {
    formTitle.textContent = 'Login';
    nameGroup.style.display = 'none';
    authForm.querySelector('input[type="submit"]').value = 'Entrar';
    toggleFormBtn.textContent = 'Criar uma conta';
    toggleFormBtn.setAttribute('aria-expanded', 'false');
  } else {
    formTitle.textContent = 'Cadastro';
    nameGroup.style.display = 'block';
    authForm.querySelector('input[type="submit"]').value = 'Cadastrar';
    toggleFormBtn.textContent = 'Já tenho conta';
    toggleFormBtn.setAttribute('aria-expanded', 'true');
  }
  errorMessage.textContent = '';
  authForm.reset();
  inputEmail.focus();
}

toggleFormBtn.addEventListener('click', () => {
  isLogin = !isLogin;
  updateFormUI();
});

// Validate email format simple
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Authentication submit handler
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';

  const name = inputName.value.trim();
  const email = inputEmail.value.trim().toLowerCase();
  const password = inputPassword.value;

  if (!isValidEmail(email)) {
    errorMessage.textContent = 'E-mail inválido.';
    inputEmail.focus();
    return;
  }
  if (password.length < 6) {
    errorMessage.textContent = 'Senha deve ter ao menos 6 caracteres.';
    inputPassword.focus();
    return;
  }

  if (isLogin) {
    // Login flow
    if (!users[email]) {
      errorMessage.textContent = 'Usuário não encontrado.';
      inputEmail.focus();
      return;
    }
    if (users[email].password !== password) {
      errorMessage.textContent = 'Senha incorreta.';
      inputPassword.focus();
      return;
    }
    loggedUser = { email, name: users[email].name };
    saveLoggedUser();
    startApp();
  } else {
    // Register flow
    if (!name) {
      errorMessage.textContent = 'Nome é obrigatório.';
      inputName.focus();
      return;
    }
    if (users[email]) {
      errorMessage.textContent = 'E-mail já cadastrado.';
      inputEmail.focus();
      return;
    }
    users[email] = {
      name,
      password,
      exercises: {
        gym: [],
        box: []
      }
    };
    saveUsers();
    loggedUser = { email, name };
    saveLoggedUser();
    startApp();
  }
});

// Start app after login
function startApp() {
  loginRegisterContainer.style.display = 'none';
  appContainer.style.display = 'flex';
  updateSidebar();
  updateHeader();
  loadExercises('gym');
  loadExercises('box');
  showSection('gym');
  renderWeeklySchedule();
  renderProfile();
  // Focus content area for accessibility
  document.querySelector('main.content').focus();
}

// Logout function
btnLogout.addEventListener('click', () => {
  loggedUser = null;
  saveLoggedUser();
  appContainer.style.display = 'none';
  loginRegisterContainer.style.display = 'block';
  isLogin = true;
  updateFormUI();
  inputEmail.focus();
});

// Sidebar menu click handlers
Object.entries(sidebarButtons).forEach(([key, btn]) => {
  btn.addEventListener('click', () => {
    showSection(key);
    updateSidebar(key);
    if (key === 'gym' || key === 'box') {
      loadExercises(key);
    } else if (key === 'trainings') {
      renderWeeklySchedule();
    } else if (key === 'profile') {
      renderProfile();
    }
  });
});

function updateSidebar(activeKey = currentMenu) {
  currentMenu = activeKey;
  for (const key in sidebarButtons) {
    const btn = sidebarButtons[key];
    const selected = key === activeKey;
    btn.classList.toggle('active', selected);
    btn.setAttribute('aria-selected', selected ? 'true' : 'false');
  }
}

function showSection(key) {
  for (const secKey in sections) {
    const sec = sections[secKey];
    if (secKey === key) {
      sec.hidden = false;
      sec.classList.add('visible');
    } else {
      sec.hidden = true;
      sec.classList.remove('visible');
    }
  }
}

function updateHeader() {
  if (loggedUser && loggedUser.name) {
    appHeader.textContent = `Olá, ${loggedUser.name}!`;
  } else {
    appHeader.textContent = '';
  }
}

// Exercise management
// Load exercises from user data and render
function loadExercises(type) {
  if (!loggedUser) return;
  const userData = users[loggedUser.email];
  if (!userData || !userData.exercises) return;

  const exercises = userData.exercises[type] || [];

  if (type === 'gym') {
    renderExerciseList(exerciseListGym, exercises, type);
  } else if (type === 'box') {
    renderExerciseList(exerciseListBox, exercises, type);
  }
}

// Render exercise list with toggle complete and delete buttons
function renderExerciseList(container, exercises, type) {
  if (exercises.length === 0) {
    container.innerHTML = '<p>Nenhum exercício cadastrado.</p>';
    return;
  }
  const ul = document.createElement('ul');
  exercises.forEach((ex, idx) => {
    const li = document.createElement('li');
    li.className = ex.completed ? 'completed' : '';
    li.setAttribute('data-idx', idx);
    li.setAttribute('data-type', type);

    const infoSpan = document.createElement('span');
    infoSpan.className = 'info';
    infoSpan.textContent = `${ex.name} — ${ex.duration} — ${ex.day}`;

    const btnToggle = document.createElement('button');
    btnToggle.className = 'toggle-complete';
    btnToggle.title = ex.completed ? 'Marcar como não concluído' : 'Marcar como concluído';
    btnToggle.setAttribute('aria-label', btnToggle.title);
    btnToggle.textContent = ex.completed ? '✅' : '⬜';
    btnToggle.addEventListener('click', toggleExerciseComplete);

    const btnDelete = document.createElement('button');
    btnDelete.className = 'delete-exercise';
    btnDelete.title = 'Excluir exercício';
    btnDelete.setAttribute('aria-label', 'Excluir exercício');
    btnDelete.textContent = '🗑️';
    btnDelete.addEventListener('click', deleteExercise);

    li.appendChild(infoSpan);
    li.appendChild(btnToggle);
    li.appendChild(btnDelete);
    ul.appendChild(li);
  });
  container.innerHTML = '';
  container.appendChild(ul);
}

// Toggle exercise completion
function toggleExerciseComplete(e) {
  const btn = e.currentTarget;
  const li = btn.parentElement;
  const idx = Number(li.getAttribute('data-idx'));
  const type = li.getAttribute('data-type');

  const userData = users[loggedUser.email];
  if (!userData) return;

  const exercises = userData.exercises[type];
  if (!exercises || idx < 0 || idx >= exercises.length) return;

  exercises[idx].completed = !exercises[idx].completed;
  saveUsers();
  loadExercises(type);
  renderWeeklySchedule();
}

// Delete exercise
function deleteExercise(e) {
  if (!confirm('Tem certeza que deseja excluir este exercício?')) return;

  const btn = e.currentTarget;
  const li = btn.parentElement;
  const idx = Number(li.getAttribute('data-idx'));
  const type = li.getAttribute('data-type');

  const userData = users[loggedUser.email];
  if (!userData) return;

  const exercises = userData.exercises[type];
  if (!exercises || idx < 0 || idx >= exercises.length) return;

  exercises.splice(idx, 1);
  saveUsers();
  loadExercises(type);
  renderWeeklySchedule();
}

// Add exercise form handlers
formAddGym.addEventListener('submit', function (e) {
  e.preventDefault();
  addExercise('gym', formAddGym);
});
formAddBox.addEventListener('submit', function (e) {
  e.preventDefault();
  addExercise('box', formAddBox);
});

// Função para adicionar exercício corrigida
function addExercise(type, form) {
  const inputs = form.querySelectorAll('input[type="text"]');
  const daySelect = form.querySelector('select');

  if (inputs.length < 2) return;

  const name = inputs[0].value.trim();
  const duration = inputs[1].value.trim();
  const day = daySelect.value;

  if (!name || !duration || !day) {
    alert('Preencha todos os campos.');
    return;
  }

  const userData = users[loggedUser.email];
  if (!userData) return;

  if (!userData.exercises[type]) userData.exercises[type] = [];

  userData.exercises[type].push({
    name,
    duration,
    day,
    completed: false
  });
  saveUsers();
  loadExercises(type);
  renderWeeklySchedule();
  form.reset();
  inputs[0].focus();
}

// Weekly schedule rendering - exercises separated by type per day
const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

function renderWeeklySchedule() {
  if (!loggedUser) return;
  const userData = users[loggedUser.email];
  if (!userData) return;

  weeklySchedule.innerHTML = '';
  let totalExercises = 0;
  let completedExercises = 0;

  daysOfWeek.forEach(day => {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-card';

    const dayHeader = document.createElement('div');
    dayHeader.className = 'day-header';
    dayHeader.textContent = day;
    dayCard.appendChild(dayHeader);

    const gymExercises = (userData.exercises.gym || []).filter(ex => ex.day === day);
    const boxExercises = (userData.exercises.box || []).filter(ex => ex.day === day);

    totalExercises += gymExercises.length + boxExercises.length;
    completedExercises += gymExercises.filter(ex => ex.completed).length + boxExercises.filter(ex => ex.completed).length;

    if (gymExercises.length === 0 && boxExercises.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'Nenhum treino.';
      dayCard.appendChild(p);
    } else {
      if (gymExercises.length > 0) {
        const gymTitle = document.createElement('h4');
        gymTitle.textContent = '🏋️ Academia';
        dayCard.appendChild(gymTitle);

        const ulGym = document.createElement('ul');
        gymExercises.forEach(ex => {
          const li = document.createElement('li');
          li.className = ex.completed ? 'completed' : '';
          li.textContent = `${ex.name} — ${ex.duration} (${ex.completed ? '✅ Concluído' : '⬜ Pendente'})`;
          ulGym.appendChild(li);
        });
        dayCard.appendChild(ulGym);
      }

      if (boxExercises.length > 0) {
        const boxTitle = document.createElement('h4');
        boxTitle.textContent = '🥊 Boxe';
        dayCard.appendChild(boxTitle);

        const ulBox = document.createElement('ul');
        boxExercises.forEach(ex => {
          const li = document.createElement('li');
          li.className = ex.completed ? 'completed' : '';
          li.textContent = `${ex.name} — ${ex.duration} (${ex.completed ? '✅ Concluído' : '⬜ Pendente'})`;
          ulBox.appendChild(li);
        });
        dayCard.appendChild(ulBox);
      }
    }
    weeklySchedule.appendChild(dayCard);
  });

  progressSummary.textContent = totalExercises > 0
    ? `Progresso semanal: ${completedExercises} de ${totalExercises} treinos concluídos.`
    : 'Nenhum treino cadastrado ainda.';
}

// Reset all exercises completion status
btnReset.addEventListener('click', () => {
  if (!loggedUser) return;
  if (!confirm('Tem certeza que deseja redefinir todos os treinos?')) return;

  const userData = users[loggedUser.email];
  if (!userData) return;

  ['gym', 'box'].forEach(type => {
    if (userData.exercises[type]) {
      userData.exercises[type].forEach(ex => ex.completed = false);
    }
  });
  saveUsers();
  loadExercises('gym');
  loadExercises('box');
  renderWeeklySchedule();
});

// Render profile info
function renderProfile() {
  if (!loggedUser) return;
  profileDiv.innerHTML = `
    <p><strong>Nome:</strong> ${loggedUser.name}</p>
    <p><strong>E-mail:</strong> ${loggedUser.email}</p>
  `;
}

// On page load, check if user logged in
if (loggedUser && users[loggedUser.email]) {
  startApp();
} else {
  updateFormUI();
}