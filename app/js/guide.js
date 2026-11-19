// PALM LINE guide — renders one trophy's detail panel: official text, our guide,
// numbered steps with [n] citation markers, the Sources box and missable banner.
const PalmGuide = (() => {
  function citeMarks(nums) {
    return nums.map((n) => '[' + n + ']').join('');
  }
  function sourceName(doc, n) {
    const s = (doc.sources || []).find((x) => x.n === n);
    return s ? s.name : 'Source ' + n;
  }
  function renderDetail(el, doc, t, masked) {
    el.replaceChildren();
    const title = document.createElement('h3');
    title.textContent = masked ? 'Hidden trophy — earn it to reveal' : t.name;
    el.append(title);
    const official = document.createElement('p');
    official.className = 'official';
    official.textContent = masked
      ? 'Spoiler mode is on: this trophy\u2019s name and official description stay covered until you earn it.'
      : '\u201C' + t.description + '\u201D — official ' + t.grade + ' trophy';
    el.append(official);
    if (t.missable && t.missable.verdict !== 'safe') {
      const banner = document.createElement('p');
      banner.className = 'miss-banner';
      banner.textContent = (t.missable.verdict === 'missable' ? 'MISSABLE — ' : 'Possibly missable — ') + t.missable.window;
      el.append(banner);
    }
    if (masked) {
      const p = document.createElement('p');
      p.textContent = 'Roadmap stage and category stay visible so you can plan around it; the guide itself unlocks with the trophy.';
      el.append(p);
      return;
    }
    const gh = document.createElement('h4'); gh.textContent = 'Guide — in our own words'; el.append(gh);
    const guide = document.createElement('p'); guide.textContent = t.guide; el.append(guide);
    const sh = document.createElement('h4'); sh.textContent = 'Steps'; el.append(sh);
    const ol = document.createElement('ol');
    for (const step of t.steps || []) {
      const li = document.createElement('li');
      li.textContent = step.t + ' ';
      const sup = document.createElement('sup');
      sup.className = 'cite';
      sup.textContent = citeMarks(step.s || []);
      li.append(sup);
      ol.append(li);
    }
    el.append(ol);
    const box = document.createElement('div');
    box.className = 'sources-box';
    const bh = document.createElement('strong'); bh.textContent = 'Sources for this trophy'; box.append(bh);
    const ul = document.createElement('ul');
    ul.style.margin = '4px 0 0'; ul.style.paddingLeft = '18px';
    for (const n of t.sources || []) {
      const li = document.createElement('li');
      const s = (doc.sources || []).find((x) => x.n === n);
      if (s) {
        const a = document.createElement('a');
        a.href = s.url; a.textContent = '[' + n + '] ' + s.name; a.target = '_blank'; a.rel = 'noopener';
        li.append(a);
      } else li.textContent = '[' + n + ']';
      ul.append(li);
    }
    box.append(ul);
    el.append(box);
    if (t.note) {
      const note = document.createElement('p');
      note.className = 'note';
      note.textContent = 'Where sources stand: ' + t.note;
      el.append(note);
    }
  }
  return { renderDetail, citeMarks };
})();
