'use strict';

// Autorskie, uproszczone przykłady. Brak analityki i zapisu danych użytkownika.
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
