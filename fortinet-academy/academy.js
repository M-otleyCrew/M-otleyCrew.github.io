'use strict';

// Autorskie przykłady. Postęp zapisujemy wyłącznie lokalnie, bez analityki.
const scenarios = {
  leak: {
    pillar: 'C / POUFNOŚĆ',
    title: 'Dane poznała nieuprawniona osoba.',
    explanation: 'Lista zamówień nadal działa i nie została zmieniona. W opisanej sytuacji naruszono poufność, bo ktoś bez zgody odczytał dane klientów.',
    question: 'kto powinien mieć dostęp do tej listy?'
  },
  change: {
    pillar: 'I / INTEGRALNOŚĆ',
    title: 'Plik jest dostępny, ale jego treść została podmieniona.',
    explanation: 'Ktoś bez zgody zmienił numer rachunku na fakturze. Naruszono integralność dokumentu. Sama możliwość otwarcia pliku nie oznacza, że można zaufać jego treści.',
    question: 'jak potwierdzisz, że zmiana numeru rachunku była uprawniona?'
  },
  outage: {
    pillar: 'A / DOSTĘPNOŚĆ',
    title: 'Uprawniony klient nie może skorzystać ze sklepu.',
    explanation: 'Awaria serwera uniemożliwia składanie zamówień. Naruszono dostępność usługi. W tym przykładzie nie stwierdzono ujawnienia ani zmiany danych.',
    question: 'jak szybko potrzebujesz przywrócić działanie sklepu?'
  }
};

const buttons = document.querySelectorAll('[data-scenario]');
for (const button of buttons) {
  button.addEventListener('click', () => {
    const scenario = scenarios[button.dataset.scenario];
    if (!scenario) return;
    for (const option of buttons) option.setAttribute('aria-pressed', String(option === button));
    document.getElementById('scenario-pillar').textContent = scenario.pillar;
    document.getElementById('scenario-title').textContent = scenario.title;
    document.getElementById('scenario-explanation').textContent = scenario.explanation;
    // Zachowujemy element strong, nie wstawiamy danych przez innerHTML.
    const question = document.getElementById('scenario-question');
    question.replaceChildren();
    const label = document.createElement('strong');
    label.textContent = 'Pytanie do analizy: ';
    question.append(label, scenario.question);
  });
}

// Stałe identyfikatory wiążą EXP z opanowanymi zadaniami, a nie liczbą kliknięć.
const questions = [
  { id: 'confidentiality', text: 'Osoba bez uprawnień odczytała listę klientów. Dane nadal są poprawne i dostępne. Co naruszono?', options: ['Dostępność', 'Poufność', 'Wyłącznie integralność'], correct: 1, explanation: 'Naruszono poufność: dane poznała osoba bez uprawnień. W tym scenariuszu nie opisano zmiany danych ani utraty dostępu.', lesson: 'lesson-3' },
  { id: 'integrity', text: 'Ktoś bez zgody podmienił numer rachunku na fakturze. Który filar naruszono?', options: ['Integralność', 'Tylko dostępność', 'Żaden, skoro plik się otwiera'], correct: 0, explanation: 'Nieuprawniona zmiana dokumentu narusza integralność. Możliwość odczytu nie potwierdza poprawności treści.', lesson: 'lesson-2' },
  { id: 'availability', text: 'Awaria zasilania wyłączyła sklep. Klienci nie mogą składać zamówień. Jaki jest bezpośredni problem?', options: ['Potwierdzona kradzież danych', 'Ujawnienie haseł', 'Brak dostępności usługi'], correct: 2, explanation: 'Naruszono dostępność. Awaria nie musi być atakiem. Sam przestój nie dowodzi wycieku danych.', lesson: 'lesson-2' },
  { id: 'authorized-change', text: 'Uprawniona księgowa poprawia fakturę zgodnie z zatwierdzoną procedurą. Czy sama ta zmiana narusza integralność?', options: ['Tak, każda zmiana jest naruszeniem', 'Nie, opisana zmiana jest uprawniona i prawidłowa', 'Tak, bo faktura jest cyfrowa'], correct: 1, explanation: 'Integralność nie oznacza zakazu edycji. Chronimy dane przed zmianą nieuprawnioną lub niewłaściwą.', lesson: 'lesson-3' },
  { id: 'ransomware', text: 'Napastnik zaszyfrował pliki i zablokował dostęp. Brak informacji o ich wykradzeniu. Co wynika z opisu?', options: ['Wyłącznie naruszenie poufności', 'Na pewno wykradziono wszystkie dane', 'Naruszono integralność i dostępność; kradzieży nie potwierdzono'], correct: 2, explanation: 'Nieautoryzowane szyfrowanie zmienia dane i blokuje korzystanie z nich. Naruszenie poufności wymaga dodatkowych ustaleń, np. potwierdzenia wykradzenia plików.', lesson: 'practice' }
];
const storageKey = 'fortinet-academy:module-01:v1';
const lessonIds = ['lesson-1', 'lesson-2', 'lesson-3'];
const emptyProgress = () => ({ version: 1, lessons: [], earned: [], best: 0 });
let progress = emptyProgress();
let storageAvailable = true;
let storageWarning = '';
try {
  const raw = localStorage.getItem(storageKey);
  if (raw) {
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 1 || !Array.isArray(saved.lessons) || !Array.isArray(saved.earned) || !Number.isInteger(saved.best) || saved.best < 0 || saved.best > questions.length) throw new Error('Invalid progress');
    progress = {
      version: 1,
      lessons: [...new Set(saved.lessons.filter(id => lessonIds.includes(id)))],
      earned: [...new Set(saved.earned.filter(id => questions.some(q => q.id === id)))],
      best: saved.best
    };
  }
} catch {
  storageWarning = 'Nie udało się odczytać postępu. Zaczynasz od zera; kolejny zapis spróbuje go odtworzyć.';
}

const panel = document.createElement('section');
panel.className = 'progress-panel';
panel.setAttribute('aria-label', 'Twój postęp w module');
panel.innerHTML = '<div><p class="eyebrow">TWÓJ POSTĘP</p><strong id="xp-total"></strong><p id="progress-summary"></p><progress id="module-progress" max="4" value="0" aria-label="Ukończone etapy modułu"></progress></div><div><p id="progress-badge"></p><p class="progress-note">20 EXP za każdą oznaczoną lekcję i pierwszą poprawną odpowiedź na każde pytanie. Maksymalnie 160 EXP. Powtórki nie dublują punktów.</p><p class="progress-note">Postęp zostaje tylko w tej przeglądarce. Usunięcie danych witryny go skasuje. Odpowiedzi w trwającej próbie quizu nie są zapisywane.</p><p id="storage-status" role="status"></p><details><summary>Wyzeruj postęp</summary><p>Usuniesz postęp, EXP i najlepszy wynik tego modułu z tej przeglądarki.</p><button type="button" id="reset-progress">Potwierdzam: wyzeruj moduł</button></details></div>';
document.querySelector('.course-layout').before(panel);
const quizLink = document.createElement('a');
quizLink.href = '#quiz';
quizLink.textContent = '04  Quiz i sprawdzenie wiedzy';
document.querySelector('.sidebar nav a[href="#sources"]').before(quizLink);

function showProgress() {
  document.getElementById('xp-total').textContent = `${(progress.lessons.length + progress.earned.length) * 20} / 160 EXP`;
  document.getElementById('progress-summary').textContent = `Lekcje: ${progress.lessons.length}/3 · Najlepszy quiz: ${progress.best}/5`;
  const complete = progress.lessons.length === 3 && progress.best >= 4;
  document.getElementById('progress-badge').textContent = complete ? '✓ Moduł zaliczony — Obrońca podstaw' : 'Cel: trzy lekcje i quiz minimum 4/5.';
  document.getElementById('module-progress').value = progress.lessons.length + Number(progress.best >= 4);
  document.getElementById('storage-status').textContent = storageWarning || (storageAvailable ? 'Zapis lokalny jest aktywny.' : 'Zapis jest niedostępny. Postęp zachowamy tylko do odświeżenia strony.');
  for (const id of lessonIds) {
    const button = document.querySelector(`[data-complete="${id}"]`);
    if (button) {
      const done = progress.lessons.includes(id);
      button.textContent = done ? '✓ Lekcja oznaczona jako ukończona' : 'Oznacz lekcję jako ukończoną · +20 EXP';
      button.disabled = done;
    }
  }
}
function saveProgress() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
    storageAvailable = true;
    storageWarning = '';
  } catch {
    storageAvailable = false;
    storageWarning = '';
  }
  showProgress();
}
for (const id of lessonIds) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'complete-lesson';
  button.dataset.complete = id;
  button.addEventListener('click', () => {
    if (!progress.lessons.includes(id)) progress.lessons.push(id);
    saveProgress();
  });
  document.getElementById(id).append(button);
}
// Próba zapisu wykrywa także przeglądarki, które pozwalają czytać, lecz blokują zapis.
try { localStorage.setItem(storageKey + ':probe', '1'); localStorage.removeItem(storageKey + ':probe'); }
catch { storageAvailable = false; storageWarning = ''; }
showProgress();

let questionIndex = 0;
let score = 0;
let checked = false;
const form = document.getElementById('quiz-form');
const feedback = document.getElementById('quiz-feedback');
const nextButton = document.getElementById('quiz-next');
const result = document.getElementById('quiz-result');
document.getElementById('quiz-app').hidden = false;
function renderQuestion(focus = true) {
  checked = false;
  form.hidden = false;
  result.hidden = true;
  nextButton.hidden = true;
  feedback.replaceChildren();
  const question = questions[questionIndex];
  document.getElementById('quiz-counter').textContent = `PYTANIE ${questionIndex + 1} / ${questions.length}`;
  const legend = document.getElementById('quiz-question');
  legend.textContent = question.text;
  const options = document.getElementById('quiz-options');
  options.replaceChildren();
  question.options.forEach((text, index) => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'answer'; input.value = String(index); input.required = true;
    label.append(input, document.createTextNode(text));
    options.append(label);
  });
  document.getElementById('quiz-check').disabled = false;
  if (focus) legend.focus();
}
form.addEventListener('submit', event => {
  event.preventDefault();
  if (checked) return;
  const answer = form.querySelector('input:checked');
  if (!answer) { form.reportValidity(); return; }
  checked = true;
  const question = questions[questionIndex];
  const correct = Number(answer.value) === question.correct;
  if (correct) {
    score++;
    if (!progress.earned.includes(question.id)) progress.earned.push(question.id);
    saveProgress();
  }
  for (const input of form.querySelectorAll('input')) input.disabled = true;
  document.getElementById('quiz-check').disabled = true;
  const title = document.createElement('strong');
  title.textContent = correct ? 'Dobra odpowiedź.' : `Tym razem nie. Poprawna odpowiedź: ${question.options[question.correct]}.`;
  const explanation = document.createElement('p'); explanation.textContent = question.explanation;
  const link = document.createElement('a'); link.href = `#${question.lesson}`; link.textContent = 'Wróć do wyjaśnienia w lekcji →';
  feedback.append(title, explanation, link);
  nextButton.textContent = questionIndex === questions.length - 1 ? 'Zobacz wynik →' : 'Następne pytanie →';
  nextButton.hidden = false;
  nextButton.focus();
});
nextButton.addEventListener('click', () => {
  if (!checked) return;
  if (questionIndex < questions.length - 1) { questionIndex++; renderQuestion(); return; }
  progress.best = Math.max(progress.best, score);
  saveProgress();
  form.hidden = true; nextButton.hidden = true; result.hidden = false;
  document.getElementById('quiz-result-title').textContent = `${score}/5 — ${score >= 4 ? 'quiz zaliczony!' : 'czas na krótką powtórkę.'}`;
  document.getElementById('quiz-result-text').textContent = score >= 4 ? 'Dobra robota. Oznacz też przeczytane lekcje, aby ukończyć cały moduł. Możesz powtórzyć quiz; EXP za to samo pytanie nie naliczy się ponownie.' : 'Wróć do wyjaśnień i spróbuj jeszcze raz. Najlepszy wynik zostaje; kolejna próba może go poprawić.';
  result.focus();
});
function restartQuiz() { questionIndex = 0; score = 0; renderQuestion(); }
document.getElementById('quiz-retry').addEventListener('click', restartQuiz);
document.getElementById('reset-progress').addEventListener('click', () => {
  progress = emptyProgress();
  saveProgress();
  restartQuiz();
  document.getElementById('reset-progress').closest('details').open = false;
});
renderQuestion(false);
