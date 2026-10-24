'use strict';
// Stare zakładki do sekcji pierwszego modułu zachowują znaczenie.
const legacyAnchors = new Set(['lesson-1','lesson-2','lesson-3','flashcards','quiz','sources','source-nist','source-cia','practice','practice-title','title-1','title-2','title-3','quiz-title','scenario-result','quiz-app']);
function redirectLegacyAnchor() { if (legacyAnchors.has(location.hash.slice(1))) location.replace(`podstawy/${location.hash}`); }
redirectLegacyAnchor(); window.addEventListener('hashchange',redirectLegacyAnchor);
const catalog = AcademyCatalog;
const store = AcademyStore;
const $ = id => document.getElementById(id);
const pageText = html => { const template=document.createElement('template'); template.innerHTML=html; return template.content.textContent.replace(/\s+/g,' ').trim(); };
function updateHub() {
  let xp=0, completed=0, resume=null; const warnings=[];
  for (const module of catalog) {
    const loaded=store.read(module), data=loaded.data;
    if(loaded.warning)warnings.push(module.title);
    xp+=store.xp(data); if(store.complete(data))completed++; else if(!resume)resume=module;
    document.querySelector(`[data-card="${module.id}"] .module-state`).textContent=`${store.complete(data)?'✓ Zaliczony':'Dostępny'} · ${store.xp(data)}/160 EXP · Quiz ${data.best}/5`;
  }
  $('total-xp').textContent=`${xp} / 480 EXP`;
  $('total-modules').textContent=`Zaliczone moduły: ${completed}/3`;
  $('total-progress').value=completed;
  $('hub-continue').href=resume?`${resume.slug}/`:'#review';
  $('hub-continue').textContent=resume?`Kontynuuj: ${resume.title} →`:'Wróć na sesję powtórkową →';
  $('hub-storage-status').textContent=warnings.length?'Nie odczytano zapisu: '+warnings.join(', '):'Wyniki wczytane z tej przeglądarki.';
}
updateHub(); window.addEventListener('focus',updateHub); window.addEventListener('storage',updateHub);
const terms=[
 ['Poufność','Dostęp do danych zgodny z uprawnieniami.','podstawy/#lesson-3'],
 ['Integralność','Ochrona przed niewłaściwą lub nieuprawnioną zmianą danych.','podstawy/#lesson-3'],
 ['Dostępność','Możliwość skorzystania z informacji lub usługi na czas przez uprawnioną osobę.','podstawy/#lesson-3'],
 ['Zagrożenie','Okoliczność lub zdarzenie mogące wyrządzić szkodę.','zagrozenia/#lesson-2'],
 ['Podatność','Słabość możliwa do wykorzystania.','zagrozenia/#lesson-2'],
 ['Ryzyko','Ocena uwzględniająca prawdopodobieństwo i wpływ.','zagrozenia/#lesson-2'],
 ['Phishing','Podszywanie się i nakłanianie odbiorcy do niebezpiecznego działania.','socjotechnika/#lesson-1'],
 ['Backup','Kopia wymaga możliwości skutecznego odtworzenia; sama nie usuwa przyczyny incydentu.','podstawy/#lesson-3']
];
const searchIndex=[...terms.map(([title,text,href])=>({title,text,href})),...catalog.flatMap(m=>m.lessons.map((lesson,i)=>({title:`${m.title}: ${lesson.title}`,text:pageText(lesson.body),href:`${m.slug}/#lesson-${i+1}`})))];
const fold=s=>s.toLocaleLowerCase('pl').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l');
function search() {
  const query=fold($('search-input').value.trim());
  const matches=query?searchIndex.filter(item=>fold(item.title+' '+item.text).includes(query)):searchIndex.slice(0,8);
  $('search-results').replaceChildren();
  $('search-status').textContent=query?`Wyniki: ${matches.length}`:'Słownik podstawowych pojęć. Wpisz hasło, aby przeszukać także lekcje.';
  for(const item of matches.slice(0,20)) {
    const article=document.createElement('article'),link=document.createElement('a'),p=document.createElement('p');
    link.href=item.href;link.textContent=item.title;p.textContent=item.text.slice(0,220)+(item.text.length>220?'…':'');article.append(link,p);$('search-results').append(article);
  }
}
$('search-input').addEventListener('input',search);search();
function shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
const bank=catalog.flatMap(m=>m.questions.map(q=>({...q,module:m})));
let session=[],position=0,score=0,answered=false;
function startSession(errorsOnly) {
  const candidates=errorsOnly?bank.filter(q=>store.read(q.module).data.review.includes(q.id)):bank;
  if(!candidates.length){$('mixed-app').hidden=true;$('practice-status').textContent='Brak zapisanych błędów. Rozwiąż quiz modułu albo uruchom sesję mieszaną.';return;}
  // Sesja mieszana zawsze zawiera przynajmniej jedno pytanie z każdego modułu.
  session=errorsOnly?shuffle(candidates).slice(0,6):shuffle([...catalog.map(m=>shuffle(bank.filter(q=>q.module.id===m.id))[0])]);
  if(!errorsOnly){const selected=new Set(session.map(q=>q.module.id+q.id));session=shuffle([...session,...shuffle(bank.filter(q=>!selected.has(q.module.id+q.id))).slice(0,3)]);}
  position=0;score=0;$('mixed-app').hidden=false;$('practice-status').textContent=errorsOnly?'Powtórka zapisanych błędów.':'Sesja mieszana ze wszystkich trzech modułów.';showMixed();
}
function showMixed() {
  answered=false;$('mixed-form').hidden=false;$('mixed-next').hidden=true;$('mixed-check').disabled=false;$('mixed-feedback').replaceChildren();
  const q=session[position];$('mixed-counter').textContent=`${position+1}/${session.length} · ${q.module.title}`;$('mixed-question').textContent=q.text;$('mixed-options').replaceChildren();
  for(const index of shuffle(q.options.map((_,i)=>i))){const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='mixed';input.value=String(index);input.required=true;label.append(input,document.createTextNode(q.options[index]));$('mixed-options').append(label);}
  $('mixed-question').focus();
}
$('start-mixed').addEventListener('click',()=>startSession(false));$('start-errors').addEventListener('click',()=>startSession(true));
$('mixed-form').addEventListener('submit',event=>{
  event.preventDefault();if(answered)return;const selected=$('mixed-form').querySelector('input:checked');if(!selected){$('mixed-form').reportValidity();return;}answered=true;
  const q=session[position],correct=Number(selected.value)===q.correct,loaded=store.read(q.module),data=loaded.data;
  if(correct){score++;data.review=data.review.filter(id=>id!==q.id);}else if(!data.review.includes(q.id))data.review.push(q.id);
  const saved=!loaded.warning&&store.write(q.module,data);if(!saved)$('practice-status').textContent='Odpowiedź sprawdzona, ale lista błędów nie została zapisana. Sprawdź dostęp do poprawnego zapisu.';
  for(const input of $('mixed-form').querySelectorAll('input'))input.disabled=true;$('mixed-check').disabled=true;
  const title=document.createElement('strong'),p=document.createElement('p'),link=document.createElement('a');title.textContent=correct?'Dobra odpowiedź.':`Poprawna odpowiedź: ${q.options[q.correct]}`;p.textContent=q.explanation;link.href=`${q.module.slug}/#${q.lesson}`;link.textContent='Przypomnij sobie lekcję →';$('mixed-feedback').append(title,p,link);$('mixed-next').hidden=false;$('mixed-next').textContent=position===session.length-1?'Zakończ sesję':'Dalej →';$('mixed-next').focus();
});
$('mixed-next').addEventListener('click',()=>{if(!answered)return;if(position<session.length-1){position++;showMixed();}else{$('mixed-form').hidden=true;$('mixed-next').hidden=true;$('practice-status').textContent=`Sesja zakończona: ${score}/${session.length}. EXP i zaliczenia modułów bez zmian.`;updateHub();}});

$('export-progress').addEventListener('click',()=>{
  const modules={};for(const module of catalog){const loaded=store.read(module);if(loaded.warning){$('backup-status').textContent='Nie można odczytać wszystkich wyników. Eksport przerwany, aby nie utworzyć niepełnej kopii.';return;}modules[module.id]=loaded.data;}
  const file={format:'fortinet-academy-progress',version:1,exportedAt:new Date().toISOString(),modules};
  const url=URL.createObjectURL(new Blob([JSON.stringify(file,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='fortinet-academy-postepy.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('backup-status').textContent='Kopia została przygotowana do pobrania.';
});
let pendingImport=null,importSequence=0;
$('import-file').addEventListener('change',async()=>{
  const sequence=++importSequence;pendingImport=null;$('import-confirm').hidden=true;$('import-preview').textContent='';const file=$('import-file').files[0];if(!file)return;
  try{
    if(file.size>100000)throw Error('Plik jest za duży (maksymalnie 100 KB).');const parsed=JSON.parse(await file.text());if(sequence!==importSequence)return;
    if(parsed.format!=='fortinet-academy-progress'||parsed.version!==1||!parsed.modules||typeof parsed.modules!=='object'||Array.isArray(parsed.modules))throw Error('To nie jest obsługiwana kopia akademii.');
    const keys=Object.keys(parsed.modules);if(keys.length!==catalog.length||keys.some(id=>!catalog.some(m=>m.id===id)))throw Error('Kopia musi zawierać dokładnie trzy znane moduły.');
    const validated={};let xp=0;for(const module of catalog){validated[module.id]=store.normalize(parsed.modules[module.id],module);xp+=store.xp(validated[module.id]);}
    pendingImport=validated;$('import-preview').textContent=`Poprawny plik: 3 moduły, ${xp} EXP w kopii. Połączenie zachowa także Twój obecny postęp.`;$('import-confirm').hidden=false;
  }catch(error){if(sequence!==importSequence)return;$('backup-status').textContent='Import odrzucony: '+error.message;}
});
$('import-confirm').addEventListener('click',()=>{
  if(!pendingImport)return;const snapshots=[];
  try{
    // Wszystkie dane walidujemy przed pierwszym zapisem. Błąd zapisu wycofuje zmiany.
    const merged=catalog.map(module=>{const loaded=store.read(module);if(loaded.warning)throw Error('Najpierw rozwiąż problem z obecnym zapisem: '+module.title);const old=loaded.data,next=pendingImport[module.id];snapshots.push([store.key(module.id),localStorage.getItem(store.key(module.id))]);return [module,{version:1,lessons:[...new Set([...old.lessons,...next.lessons])],earned:[...new Set([...old.earned,...next.earned])],best:Math.max(old.best,next.best),review:[...new Set([...old.review,...next.review])]}];});
    for(const [module,data] of merged)if(!store.write(module,data))throw Error('Przeglądarka zablokowała zapis.');
    pendingImport=null;$('import-confirm').hidden=true;$('import-file').value='';$('import-preview').textContent='';$('backup-status').textContent='Postępy połączone. Wyniki są zapisane w tej przeglądarce.';updateHub();
  }catch(error){let rollback=true;for(const [key,raw] of snapshots){try{if(raw===null)localStorage.removeItem(key);else localStorage.setItem(key,raw);}catch{rollback=false;}}$('backup-status').textContent=`Nie zaimportowano: ${error.message}${rollback?'':' Nie udało się potwierdzić pełnego wycofania zapisu; zachowaj plik kopii.'}`;}
});
