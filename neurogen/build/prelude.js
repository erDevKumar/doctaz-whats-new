// --- NeuroGen x Doctaz deck factory -------------------------------------------------
// Penpot paints appended children in inverted order, and no heuristic fixes it, so every
// shape records an explicit z and we bringToFront() in ascending z at the end of the board.
const C = {
  brand:'#0D9488', brandDark:'#0B7A70', brandDarker:'#095E57', brandSoft:'#CCFBF1',
  ink:'#111827', inkSoft:'#1F2937', muted:'#6B7280',
  surface:'#FFFFFF', surfaceAlt:'#F9FAFB', pageBg:'#F1F3F7', border:'#E5E7EB',
  rose:'#E11D48', white:'#FFFFFF', navy:'#0B1220'
};
const W = 1600, H = 900;
let _z = [];
function board(name, x, y, bg) {
  const b = penpot.createBoard();
  b.name = name; b.x = x; b.y = y; b.resize(W, H);
  b.fills = [{ fillColor: bg || C.surface }];
  _z = [];
  return b;
}
function rect(p, x, y, w, h, fill, rad, z) {
  const r = penpot.createRectangle();
  p.appendChild(r);
  r.x = p.x + x; r.y = p.y + y; r.resize(w, h);
  r.fills = fill ? [{ fillColor: fill }] : [];
  if (rad) r.borderRadius = rad;
  _z.push([z || 0, r]);
  return r;
}
function imgRect(p, x, y, w, h, media, rad, z) {
  const r = penpot.createRectangle();
  p.appendChild(r);
  r.x = p.x + x; r.y = p.y + y; r.resize(w, h);
  r.fills = [{ fillImage: media }];
  if (rad) r.borderRadius = rad;
  _z.push([z || 0, r]);
  return r;
}
function txt(p, s, x, y, w, size, color, weight, z, align) {
  if (!s) return null;                       // createText('') returns null
  const t = penpot.createText(String(s));
  p.appendChild(t);
  t.x = p.x + x; t.y = p.y + y;
  t.resize(w, Math.max(size * 1.4, 10));
  t.growType = 'auto-height';
  t.fontFamily = 'Roboto'; t.fontId = 'gfont-roboto';
  t.fontSize = String(size);
  t.fontWeight = String(weight || 400);
  t.lineHeight = 1.3;
  t.align = align || 'left';
  t.fills = [{ fillColor: color || C.ink }];
  _z.push([z || 0, t]);
  return t;
}
function applyZ() {
  _z.sort((a, b) => a[0] - b[0]).forEach(p => { try { p[1].bringToFront(); } catch (e) {} });
}
// shared slide furniture
function chrome(b, eyebrow, n) {
  rect(b, 0, 0, W, 10, C.brand, 0, 0);
  if (eyebrow) txt(b, eyebrow.toUpperCase(), 90, 70, 900, 20, C.brand, 700, 5);
  if (n) txt(b, n, W - 160, 70, 70, 20, C.muted, 500, 5, 'right');
  txt(b, 'NeuroGen x Doctaz', 90, H - 34, 600, 15, '#9AA3AE', 400, 5);
}
function scenario(name, px, py, num, title, sub, steps) {
  const b = board(name, px, py, C.surface);
  chrome(b, 'Scenario ' + num, '0' + (5 + Number(num)));
  txt(b, title, 90, 130, 1300, 46, C.ink, 700, 5);
  txt(b, sub, 90, 188, 1340, 24, C.muted, 400, 5);
  const n = steps.length;
  const gap = 24, pw = Math.floor((W - 180 - gap * (n - 1)) / n);
  steps.forEach(function (s, i) {
    const x = 90 + i * (pw + gap), y = 280;
    rect(b, x, y, pw, 500, C.surfaceAlt, 16, 1);
    if (s[2]) imgRect(b, x + 14, y + 52, pw - 28, 400, M[s[2]], 10, 3);
    rect(b, x + 14, y + 14, 30, 30, C.brand, 15, 2);
    txt(b, String(i + 1), x + 23, y + 18, 20, 16, C.white, 700, 6);
    txt(b, s[0], x + 52, y + 18, pw - 70, 17, C.ink, 700, 6);
    txt(b, s[1], x + 14, y + 464, pw - 28, 15, C.muted, 400, 6);
  });
  return b;
}
function node(p, kind, label, sub, x, y, w, h) {
  const map = { start:[C.brand,C.white], step:[C.surface,C.ink], auto:[C.brandSoft,C.brandDarker],
                dec:['#FEF3C7','#92400E'], end:[C.brandDarker,C.white], note:[C.surfaceAlt,C.muted] };
  const col = map[kind] || map.step;
  const r = rect(p, x, y, w, h, col[0], kind === 'dec' ? 8 : 14, 2);
  if (kind === 'step' || kind === 'note') r.strokes = [{ strokeColor: C.border, strokeWidth: 2 }];
  txt(p, label, x + 16, y + (sub ? 16 : (h - 20) / 2), w - 32, 17, col[1], 700, 5, 'center');
  if (sub) txt(p, sub, x + 16, y + 58, w - 32, 13, kind === 'step' ? C.muted : col[1], 400, 5, 'center');
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
    rect(b, 90, y - 26, 1420, 160, li % 2 ? C.surfaceAlt : C.surface, 12, 0);
    txt(b, lane.who, 104, y - 16, 200, 14, C.brand, 700, 5);
    lane.nodes.forEach(function (n, i) {
      const w = 200, gap = 54, x = 300 + i * (w + gap);
      node(b, n[0], n[1], n[2], x, y + 4, w, 100);
      if (i < lane.nodes.length - 1) arrow(b, x + w + 6, y + 54, x + w + gap - 6, y + 54, 1);
    });
  });
  return b;
}
