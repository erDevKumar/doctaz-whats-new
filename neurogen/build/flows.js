// Second page: the three journeys as process flows (start/step/decision/end + numbered badges)
let pg = penpot.currentFile.pages.find(p => p.name === '02 Journey flows');
if (!pg) { pg = penpot.currentFile.createPage(); pg.name = '02 Journey flows'; }
penpot.openPage(pg);
// clear anything previously generated
penpot.currentPage.findShapes().filter(s => /^fl /.test(s.name || '')).forEach(s => { try { s.remove(); } catch (e) {} });

function node(p, kind, label, sub, x, y, w, h) {
  const map = { start:[C.brand,C.white], step:[C.surface,C.ink], auto:[C.brandSoft,C.brandDarker],
                dec:['#FEF3C7','#92400E'], end:[C.brandDarker,C.white], note:[C.surfaceAlt,C.muted] };
  const col = map[kind] || map.step;
  const r = rect(p, x, y, w, h, col[0], kind === 'dec' ? 8 : 14, 2);
  if (kind === 'step' || kind === 'note') r.strokes = [{ strokeColor: C.border, strokeWidth: 2 }];
  txt(p, label, x + 16, y + (sub ? 16 : (h - 20) / 2), w - 32, 17, col[1], 700, 5, 'center');
  if (sub) txt(p, sub, x + 16, y + 44, w - 32, 13, kind === 'step' ? C.muted : col[1], 400, 5, 'center');
  return r;
}
function arrow(p, x1, y1, x2, y2, z) {
  // horizontal connector with a head; kept as plain rects so it survives export
  rect(p, x1, y1 - 2, Math.max(x2 - x1, 2), 4, C.brand, 0, z || 1);
  rect(p, x2 - 12, y1 - 7, 14, 14, C.brand, 7, z || 1);
}
function down(p, x, y1, y2, z) {
  rect(p, x - 2, y1, 4, Math.max(y2 - y1, 2), C.brand, 0, z || 1);
  rect(p, x - 7, y2 - 12, 14, 14, C.brand, 7, z || 1);
}
function flowBoard(name, px, py, title, sub, lanes) {
  const b = board(name, px, py, C.surface);
  chrome(b, 'Journey flow', '');
  txt(b, title, 90, 130, 1340, 40, C.ink, 700, 5);
  txt(b, sub, 90, 180, 1340, 20, C.muted, 400, 5);
  lanes.forEach(function (lane, li) {
    const y = 270 + li * 180;
    rect(b, 90, y - 26, 1420, 150, li % 2 ? C.surfaceAlt : C.surface, 12, 0);
    txt(b, lane.who, 104, y - 16, 200, 14, C.brand, 700, 5);
    lane.nodes.forEach(function (n, i) {
      const w = 200, gap = 54, x = 300 + i * (w + gap);
      node(b, n[0], n[1], n[2], x, y + 8, w, 86);
      if (i < lane.nodes.length - 1) arrow(b, x + w + 6, y + 51, x + w + gap - 6, y + 51, 1);
    });
  });
  return b;
}
