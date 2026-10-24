'use strict';
// Jeden format dla starych i nowych modułów. Nie zmieniamy klucza module-01.
globalThis.AcademyStore = (() => {
  const empty = () => ({version:1,lessons:[],earned:[],best:0,review:[]});
  const key = id => `fortinet-academy:${id}:v1`;
  function normalize(value, module) {
    if (!value || value.version !== 1 || !Array.isArray(value.lessons) || !Array.isArray(value.earned) || !Number.isInteger(value.best) || value.best < 0 || value.best > 5) throw Error('Niepoprawny format postępu.');
    const unique = (values, valid) => [...new Set(values.filter(id => typeof id === 'string' && valid.includes(id)))];
    const ids = module.questions.map(q=>q.id);
    return {version:1,lessons:unique(value.lessons,['lesson-1','lesson-2','lesson-3']),earned:unique(value.earned,ids),best:value.best,review:unique(Array.isArray(value.review)?value.review:[],ids)};
  }
  function read(module) {
    try { const raw=localStorage.getItem(key(module.id)); return {data:raw?normalize(JSON.parse(raw),module):empty(),warning:''}; }
    catch { return {data:empty(),warning:'Nie można odczytać zapisu. Postęp tego modułu nie został wczytany.'}; }
  }
  function write(module,data) { try {localStorage.setItem(key(module.id),JSON.stringify(normalize(data,module)));return true;}catch{return false;} }
  const xp = data => (data.lessons.length+data.earned.length)*20;
  const complete = data => data.lessons.length===3 && data.best>=4;
  return {empty,key,normalize,read,write,xp,complete};
})();
