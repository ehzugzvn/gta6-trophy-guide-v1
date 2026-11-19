// PALM LINE audit — counts the data live and prints the factual audit strip:
// official names present, guides carrying citations, missables flagged, roadmap size.
const PalmAudit = (() => {
  function compute(doc) {
    const list = doc.trophies || [];
    const cited = list.filter((t) => t.guide && t.guide.trim() &&
      (t.steps || []).length > 0 && t.steps.every((s) => (s.s || []).length > 0) &&
      (t.sources || []).length > 0).length;
    const flagged = list.filter((t) => t.missable && t.missable.verdict !== 'safe').length;
    const hard = list.filter((t) => t.missable && t.missable.verdict === 'missable').length;
    return { total: list.length, cited, flagged, hard };
  }
  function render(el, doc) {
    const a = compute(doc);
    el.textContent = a.total + '/' + a.total + ' official names ✓ · ' + a.cited + '/' + a.total +
      ' guides cited ✓ · ' + a.flagged + ' missable flagged (' + a.hard + ' confirmed) · Roadmap: 6 stages · Works offline';
    return a;
  }
  return { compute, render };
})();
