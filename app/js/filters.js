// PALM LINE filters — category chips, grade select, search, and the spoiler mask rule.
const PalmFilters = (() => {
  const state = { category: 'all', grade: 'all', query: '', stage: null };

  function matchesCategory(t) {
    switch (state.category) {
      case 'all': return true;
      case 'story': return t.kind === 'story';
      case 'missable': return t.missable && t.missable.verdict !== 'safe';
      case 'collectibles': return t.kind === 'collectibles';
      case 'activities': return t.kind === 'activities';
      case 'coop': return t.kind === 'coop';
      default: return true;
    }
  }
  function matches(t, spoilerOn, isEarned) {
    if (state.stage && t.stage !== state.stage) return false;
    if (!matchesCategory(t)) return false;
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.query) {
      const masked = spoilerOn && t.hidden && !isEarned;
      const hay = masked ? '' : (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.kind + ' ' + t.grade).toLowerCase();
      if (!hay.includes(state.query)) return false;
    }
    return true;
  }
  // Spoiler rule: with spoiler mode on, an unearned hidden trophy shows no name or description.
  function isMasked(t, spoilerOn, isEarned) { return spoilerOn && t.hidden && !isEarned; }
  return { state, matches, isMasked };
})();
