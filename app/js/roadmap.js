// PALM LINE roadmap — the six platinum stages, in play order, with per-stage earned counts.
const PalmRoadmap = (() => {
  const STAGES = [
    { id: 'S1', name: 'Prologue & Ch. 1', hint: 'Story opens · first meditation!' },
    { id: 'S2', name: 'Chapter 2', hint: 'Heist · strands open' },
    { id: 'S3', name: 'Chapter 3', hint: 'Strand finals' },
    { id: 'S4', name: 'Chapter 4', hint: 'Late story · 8 strands done' },
    { id: 'S5', name: 'The Final', hint: 'Final mission · choices count' },
    { id: 'S6', name: 'Post-game 100%', hint: 'Counters, collectibles, platinum' },
  ];
  function stageOf(t) { return STAGES.find((s) => s.id === t.stage) || STAGES[5]; }
  function counts(trophies, isEarned) {
    const map = {};
    for (const s of STAGES) map[s.id] = { earned: 0, total: 0 };
    for (const t of trophies) {
      const st = map[t.stage] || map.S6;
      st.total += 1;
      if (isEarned(t.id)) st.earned += 1;
    }
    return map;
  }
  function render(container, trophies, isEarned, activeStage, onPick) {
    const map = counts(trophies, isEarned);
    container.replaceChildren();
    for (const s of STAGES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'stage-chip' + (activeStage === s.id ? ' on' : '');
      const title = document.createElement('b');
      title.textContent = s.name + ' — ' + map[s.id].earned + '/' + map[s.id].total;
      const hint = document.createElement('span');
      hint.textContent = s.hint;
      b.append(title, hint);
      b.addEventListener('click', () => onPick(activeStage === s.id ? null : s.id));
      container.append(b);
    }
  }
  return { STAGES, stageOf, render };
})();
