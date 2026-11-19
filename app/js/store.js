// PALM LINE store — progress lives in localStorage; export/import move it as JSON.
const PalmStore = (() => {
  const KEY = 'palm-line-progress-v1';
  let state = { earned: [], spoiler: false, counts: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = Object.assign(state, JSON.parse(raw));
  } catch (e) { /* fresh start on unreadable storage */ }
  const earnedSet = new Set(state.earned);

  function save() {
    state.earned = [...earnedSet];
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage full/blocked */ }
  }
  function isEarned(id) { return earnedSet.has(id); }
  function toggle(id, on) { if (on) earnedSet.add(id); else earnedSet.delete(id); save(); }
  function setCount(id, value) { state.counts[id] = Math.max(0, value | 0); save(); }
  function getCount(id) { return state.counts[id] || 0; }
  function setSpoiler(on) { state.spoiler = !!on; save(); }
  function getSpoiler() { return !!state.spoiler; }
  function reset() { earnedSet.clear(); state.counts = {}; save(); }
  function exportJson() { return JSON.stringify({ app: 'palm-line', version: 1, earned: [...earnedSet], counts: state.counts, spoiler: state.spoiler }, null, 1); }
  function importJson(text) {
    const data = JSON.parse(text);
    if (!data || !Array.isArray(data.earned)) throw new Error('not a PALM LINE export');
    earnedSet.clear();
    for (const id of data.earned) if (Number.isInteger(id)) earnedSet.add(id);
    state.counts = (data.counts && typeof data.counts === 'object') ? data.counts : {};
    state.spoiler = !!data.spoiler;
    save();
  }
  return { isEarned, toggle, setCount, getCount, setSpoiler, getSpoiler, reset, exportJson, importJson, earnedCount: () => earnedSet.size };
})();
