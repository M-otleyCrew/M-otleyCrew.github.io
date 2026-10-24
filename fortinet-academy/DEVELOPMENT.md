# Rozwój i publikowanie akademii

Właściciel upoważnił do publikacji iteracji bez kolejnych potwierdzeń. Iteracja obejmuje implementację kilku spójnych zmian, testy, publikację i sprawdzenie wdrożenia. Upoważnienie dotyczy tego repozytorium.

## Układ

- `index.html`, `hub.js`: mapa, słownik, wyszukiwanie, wspólne sesje i kopie postępów.
- `podstawy/index.html`: zachowany i przeniesiony pierwszy moduł.
- `course-content.js`: autorska treść modułów 2 i 3 z przypisami do źródeł.
- `catalog.js`: wygenerowany katalog trzech modułów i bank pytań; dane pierwszego modułu są zachowane przez generator.
- `academy.js`: wspólny silnik quizów, EXP i oznaczania lekcji.
- `progress-store.js`: walidacja i format postępu zgodny ze starą wersją.
- `../scripts/build-course.cjs`: generowanie statycznych stron. Moduły czyta się bez JS; interakcje wymagają JS.

## Szablon modułu

Cel nauki → trzy lekcje → autorski przykład → schemat/model analizy → ćwiczenie decyzji → fiszki → pięć pytań z wyjaśnieniami → źródła i data weryfikacji. Oddzielaj źródła od fikcyjnych scenariuszy. Nie używaj pytań z egzaminów ani nie deklaruj pełnego pokrycia NSE bez mapowania do oficjalnego programu.

## Sprawdzenie przed publikacją

Z katalogu repozytorium:

```sh
node scripts/build-course.cjs
node scripts/check-course.cjs
node scripts/browser-check.cjs
```

Test przeglądarkowy wymaga zainstalowanego Playwright i Chromium. Opcjonalnie ustaw `PLAYWRIGHT_MODULE_PATH` na katalog modułu Playwright oraz `CHROME_PATH` na plik wykonywalny Chrome. Test korzysta z przechwyconych żądań pod domeną testową, nie łączy się z internetem. Nie zapisuje danych prawdziwego użytkownika.

GitHub Actions uruchamia generowanie oraz kontrole kodu, odnośników i kompatybilności zapisu przy push i PR. Nie wprowadza ochrony gałęzi. Przed bezpośrednią publikacją należy uruchomić testy lokalnie. Istniejący mechanizm GitHub Pages publikuje main.

## Postępy

Klucze: `fortinet-academy:module-01:v1` do `module-03:v1`. Pierwszy nie zmienił nazwy. Stare rekordy bez `review` są czytane z pustą listą powtórek. Identyfikatory pięciu starych pytań zachowano. Odpowiedzi w trwającej próbie nie są zapisywane. Każdy moduł: 60 EXP za lekcje, 100 za pierwsze poprawne odpowiedzi; razem 480 EXP.

Import pliku JSON waliduje strukturę przed zapisem i łączy osiągnięcia, nie obniżając wyniku. W razie błędu zapisu podejmuje próbę odtworzenia poprzednich wartości. Eksport jest przerywany, jeśli nie można odczytać pełnego postępu. Nie usuwaj wyników przy aktualizacjach. Eksportuj postęp przed czyszczeniem danych witryny.

## Granice

Brak kont, synchronizacji i uczciwego publicznego rankingu. Powtórki błędów są trwałe, lecz nie są jeszcze algorytmem powtórek rozłożonych w czasie. Kontrola zewnętrznych źródeł wymaga okresowej weryfikacji; automatyczne testy sprawdzają lokalne odnośniki, nie dostępność zewnętrznych serwisów. Audyt WCAG i testy wszystkich przeglądarek nie zostały wykonane.
