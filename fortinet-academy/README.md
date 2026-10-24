# Moduł 01 — Wprowadzenie do cyberbezpieczeństwa

Adres publiczny: https://m-otleycrew.github.io/fortinet-academy/

## Zasady pracy w projekcie

Właściciel upoważnił do publikowania kolejnych iteracji bez dodatkowego potwierdzania. Każda iteracja powinna obejmować kilka spójnych kroków: implementację, odpowiednią weryfikację, publikację i sprawdzenie wdrożenia. Nie kończ etapu na samym przygotowaniu PR, gdy publikacja jest możliwa. Nie rozszerza to zakresu o inne repozytoria ani usługi.

Nie publikuj treści merytorycznej bez sprawdzonych źródeł. Nie usuwaj lokalnych postępów przy aktualizacjach modułu. Zmiany modelu zapisu wymagają zachowania kompatybilności lub migracji.

Niezależna, autorska pomoc edukacyjna. Nie jest oficjalnym kursem Fortinet.

## Uruchomienie

Z katalogu repozytorium: `python -m http.server 8000 --bind 127.0.0.1`, następnie otwórz `http://127.0.0.1:8000/fortinet-academy/`.

Pliki są statyczne, bez zależności, usług zewnętrznych, analityki i procesu budowania. Po scaleniu do main moduł korzysta z istniejącego wdrożenia GitHub Pages. Nie zmienia konfiguracji Pages ani strony portfolio.

## Zakres tej wersji

- Trzy lekcje, schemat CIA w HTML/CSS, autorskie przykłady.
- Interaktywny wybór trzech incydentów i odpowiedź o ransomware w details.
- Treść i nawigacja dostępne także bez JavaScript.
- Quiz: 5 autorskich pytań z wyjaśnieniami i powrotem do lekcji, próg zaliczenia 4/5.
- Kolejność odpowiedzi jest losowana przy każdym wyświetleniu pytania. Identyfikatory pytań, naliczanie EXP i istniejący zapis pozostają kompatybilne.
- Wynik pokazuje listę błędnie rozwiązanych zadań z wyjaśnieniami i odnośnikami do powtórki; lista dotyczy bieżącej próby i nie jest zapisywana.
- Trzy rozwijane fiszki CIA działają również bez JavaScript. Przycisk kontynuacji prowadzi do pierwszej nieukończonej lekcji, następnie quizu lub fiszek.
- EXP: 20 za oznaczenie każdej lekcji i pierwszą poprawną odpowiedź na każde pytanie; maksymalnie 160, bez powielania przy powtórkach.
- Postęp zapisany w localStorage pod kluczem `fortinet-academy:module-01:v1`. Zapisujemy identyfikatory ukończonych lekcji, opanowanych pytań i najlepszy wynik. Nie zapisujemy trwającej próby quizu.
- Moduł zaliczony po oznaczeniu trzech lekcji i uzyskaniu 4/5 w jednej próbie. Punkty EXP mogą pochodzić z wielu prób.
- Zapis wyłącznie w tej przeglądarce, bez konta i synchronizacji. Gdy zapis jest zablokowany, strona informuje o trybie pamięciowym. Uszkodzony zapis jest odrzucany. Reset usuwa postęp tylko tego modułu, zapisując stan pusty.

## Źródła

Zweryfikowano 24.10.2026. Linki i odniesienia przy twierdzeniach znajdują się na stronie.

- NIST CSRC, Information security: https://csrc.nist.gov/glossary/term/information_security
- NIST SP 1800-26, Executive Summary: https://www.nccoe.nist.gov/publication/1800-26/VolA/1800-26A.html
- Fortinet NSE Program Ordering Guide: https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/og-nse-program.pdf

Spis tematów dostarczony jako nse 1.txt służy wyłącznie ustaleniu kolejności. Nie publikujemy materiałów kursowych ani pytań egzaminacyjnych producenta.

## Ręczny odbiór

1. Otwórz moduł na szerokości 390 i 1440 px; sprawdź brak przewijania poziomego.
2. Przejdź klawiszem Tab przez odnośniki, przyciski i rozwijane wyjaśnienie. Fokus jest widoczny.
3. Wybierz każdy z trzech incydentów. Sprawdź odpowiednio C/I/A i dokładnie jeden przycisk z aria-pressed=true.
4. Wyłącz JS: lekcje, schemat, źródła i rozwijane wyjaśnienie nadal są dostępne; dodatkowa analiza jest w noscript.
5. Sprawdź powrót do portfolio i odnośniki sekcji.
6. Oznacz trzy lekcje, rozwiąż quiz, odśwież stronę. Sprawdź najlepszy wynik, EXP i zaliczenie.
7. Powtórz quiz: te same poprawne odpowiedzi nie zwiększają EXP. Gorsza próba nie obniża najlepszego wyniku.
8. Sprawdź wynik 3/5 (niezaliczony) i 4/5 (zaliczony), brak odpowiedzi i powtórne wysłanie.
9. Zablokuj localStorage lub zapisz w kluczu niepoprawny JSON. Strona i quiz nadal działają.
10. Wyzeruj postęp przez rozwijane potwierdzenie. Sprawdź 0 EXP również po odświeżeniu.
