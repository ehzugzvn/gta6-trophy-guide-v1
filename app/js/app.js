// PALM LINE app — wires the store, filters, roadmap, guide and audit together,
// renders the trophy list rows (with citation markers visible in the rows) and
// handles export / import / spoiler / reset.
(async () => {
  const doc = await (await fetch('data/trophies.json')).json();
  const trophies = doc.trophies;
  let selectedId = 2; // Just Like Paradise opens the cover view

  const listEl = document.getElementById('trophy-list');
  const emptyEl = document.getElementById('list-empty');
  const detailEl = document.getElementById('detail');
  const barEl = document.getElementById('progress-bar');
  const countEl = document.getElementById('progress-count');
  const spoilerBtn = document.getElementById('spoiler-btn');

  function fmt(n) { return n.toLocaleString('en-US'); }

  function renderProgress() {
    const n = PalmStore.earnedCount();
    const pct = Math.round((n / trophies.length) * 100);
    barEl.style.width = pct + '%';
    countEl.textContent = n + '/' + trophies.length + ' · ' + pct + '% to Platinum';
  }

  function rowFor(t) {
    const spoilerOn = PalmStore.getSpoiler();
    const earned = PalmStore.isEarned(t.id);
    const masked = PalmFilters.isMasked(t, spoilerOn, earned);
    const li = document.createElement('li');
    li.className = 'row' + (t.id === selectedId ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox'; box.checked = earned;
    box.setAttribute('aria-label', 'Mark earned');
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => { PalmStore.toggle(t.id, box.checked); renderAll(); });
    li.append(box);
    const body = document.createElement('div'); body.className = 'body';
    const name = document.createElement('div'); name.className = 'name';
    name.textContent = masked ? 'Hidden trophy — earn it to reveal' : t.name;
    const desc = document.createElement('div'); desc.className = 'desc';
    desc.textContent = masked ? 'Name and description covered by spoiler mode.' : t.description;
    body.append(name, desc);
    const meta = document.createElement('div'); meta.className = 'meta';
    const grade = document.createElement('span');
    grade.className = 'chip-grade g-' + t.grade; grade.textContent = t.grade;
    meta.append(grade);
    const kind = document.createElement('span'); kind.className = 'badge';
    kind.textContent = t.kind === 'coop' ? 'co-op / online' : t.kind;
    meta.append(kind);
    if (t.missable && t.missable.verdict === 'missable') {
      const b = document.createElement('span'); b.className = 'badge miss'; b.textContent = 'MISSABLE';
      meta.append(b);
    } else if (t.missable && t.missable.verdict === 'possibly') {
      const b = document.createElement('span'); b.className = 'badge poss'; b.textContent = 'possibly missable';
      meta.append(b);
    }
    if (t.count) {
      const c = document.createElement('span'); c.className = 'count';
      const input = document.createElement('input');
      input.type = 'number'; input.min = '0'; input.max = String(t.count.need);
      input.value = String(PalmStore.getCount(t.id));
      input.setAttribute('aria-label', 'Your count for ' + t.name);
      input.addEventListener('click', (e) => e.stopPropagation());
      input.addEventListener('change', () => {
        PalmStore.setCount(t.id, Number(input.value));
        // Reaching the target count means the trophy is earned — tick it automatically.
        if (Number(input.value) >= t.count.need && !PalmStore.isEarned(t.id)) {
          PalmStore.toggle(t.id, true);
          renderAll();
          return;
        }
        renderProgress();
      });
      c.append(input, document.createTextNode(' / ' + fmt(t.count.need) + ' ' + t.count.unit));
      meta.append(c);
    }
    if (!masked) {
      const cites = document.createElement('span'); cites.className = 'cites';
      const nums = [...new Set((t.steps || []).flatMap((s) => s.s || []))].sort((a, b) => a - b);
      cites.textContent = 'guide cited ' + PalmGuide.citeMarks(nums);
      meta.append(cites);
    }
    body.append(meta);
    li.append(body);
    li.addEventListener('click', () => { selectedId = t.id; renderAll(); });
    return li;
  }

  function renderList() {
    const spoilerOn = PalmStore.getSpoiler();
    listEl.replaceChildren();
    let shown = 0;
    for (const t of trophies) {
      if (!PalmFilters.matches(t, spoilerOn, PalmStore.isEarned(t.id))) continue;
      listEl.append(rowFor(t)); shown += 1;
    }
    emptyEl.hidden = shown > 0;
  }

  function renderDetail() {
    const t = trophies.find((x) => x.id === selectedId) || trophies[0];
    const masked = PalmFilters.isMasked(t, PalmStore.getSpoiler(), PalmStore.isEarned(t.id));
    PalmGuide.renderDetail(detailEl, doc, t, masked);
  }

  function renderRoadmap() {
    PalmRoadmap.render(document.getElementById('roadmap-chips'), trophies,
      (id) => PalmStore.isEarned(id), PalmFilters.state.stage,
      (stage) => { PalmFilters.state.stage = stage; renderAll(); });
  }

  function renderSources() {
    const ol = document.getElementById('sources-list');
    ol.replaceChildren();
    for (const s of doc.sources || []) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = s.url; a.textContent = s.name; a.target = '_blank'; a.rel = 'noopener';
      li.append(a);
      ol.append(li);
    }
  }

  function syncSpoilerBtn() {
    const on = PalmStore.getSpoiler();
    spoilerBtn.textContent = 'Spoiler: ' + (on ? 'on' : 'off');
    spoilerBtn.setAttribute('aria-pressed', String(on));
  }

  function renderAll() { renderProgress(); renderRoadmap(); renderList(); renderDetail(); syncSpoilerBtn(); }

  document.getElementById('filter-chips').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    PalmFilters.state.category = btn.dataset.filter;
    for (const b of document.querySelectorAll('#filter-chips button')) b.classList.toggle('on', b === btn);
    renderAll();
  });
  document.getElementById('grade-select').addEventListener('change', (e) => { PalmFilters.state.grade = e.target.value; renderAll(); });
  document.getElementById('search-box').addEventListener('input', (e) => { PalmFilters.state.query = e.target.value.trim().toLowerCase(); renderList(); });
  spoilerBtn.addEventListener('click', () => { PalmStore.setSpoiler(!PalmStore.getSpoiler()); renderAll(); });
  document.getElementById('reset-btn').addEventListener('click', () => { PalmStore.reset(); renderAll(); });
  document.getElementById('export-btn').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([PalmStore.exportJson()], { type: 'application/json' }));
    a.download = 'palm-line-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById('import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try { PalmStore.importJson(await file.text()); renderAll(); }
    catch (err) { countEl.textContent = 'Import failed: not a PALM LINE progress file.'; }
    e.target.value = '';
  });

  PalmAudit.render(document.getElementById('audit-strip'), doc);
  renderSources();
  renderAll();
})();
