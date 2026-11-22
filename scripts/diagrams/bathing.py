# Draws the explanatory diagrams of the bathing handbook (bathing/img/dia-*.svg).
# Every label restates a fact or figure cited in the chapter that uses the diagram.
# Run from the repository root:  python3 scripts/diagrams/bathing.py
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'bathing', 'img')
FONT = "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
INK, SOFT, ACC, ACC2, WARM, WARM2, LINE = '#222', '#555', '#1f6f8b', '#e3f1f6', '#b5502c', '#fbe9e1', '#bbb'

def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def text(x, y, s, size=15, weight=400, anchor='middle', fill=INK, italic=False):
    st = 'font-style:italic;' if italic else ''
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="{FONT};{st}font-size:{size}px;font-weight:{weight}" fill="{fill}">{esc(s)}</text>'
def lines(x, y, rows, size=14, weight=400, anchor='middle', fill=INK, gap=None):
    gap = gap or size + 5
    return ''.join(text(x, y + i * gap, r, size, weight, anchor, fill) for i, r in enumerate(rows))
def box(x, y, w, h, fill=ACC2, stroke=ACC, r=10, dash=False, sw=2):
    d = ' stroke-dasharray="6 5"' if dash else ''
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>'
def arrow(x1, y1, x2, y2, col=SOFT, w=2.5):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{w}" marker-end="url(#ah)"/>'
def page(name, W, H, title, desc, body):
    defs = f'<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{SOFT}"/></marker></defs>'
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="t d">'
           f'<title id="t">{esc(title)}</title><desc id="d">{esc(desc)}</desc>{defs}<rect width="{W}" height="{H}" fill="#fff"/>{body}</svg>')
    open(os.path.join(OUT, name), 'w').write(svg)
    print(name, len(svg))

# 1. Is it an onsen? (Chapter 1) — Hot Springs Act, art. 2 and table 1 (MoE).
W = 900
b = text(W/2, 32, 'Is it an onsen? The test of the Hot Springs Act (1948)', 19, 700)
b += box(300, 56, 300, 64, '#fff', INK) + lines(450, 82, ['Water, steam or gas springing', 'from underground'], 14, 600)
b += arrow(450, 122, 450, 150)
b += box(250, 150, 400, 56, ACC2, ACC) + lines(450, 174, ['At least 25 °C when taken from the source?'], 15, 700, fill=ACC) + text(450, 196, '(natural gas that is mainly hydrocarbons is excluded)', 12, fill=SOFT)
b += arrow(650, 178, 730, 178, ACC) + text(690, 170, 'yes', 13, 700, fill=ACC)
b += box(730, 140, 150, 76, ACC, ACC) + lines(805, 172, ['onsen', 'by law'], 17, 700, fill='#fff')
b += arrow(450, 208, 450, 246) + text(466, 232, 'no', 13, 700, 'start', SOFT)
b += box(150, 246, 600, 98, ACC2, ACC) + text(450, 272, 'Contains at least one of 19 substances in the legal amount?', 15, 700, fill=ACC)
b += lines(450, 296, ['e.g. dissolved solids ≥ 1,000 mg/kg · free carbon dioxide ≥ 250 mg', 'total sulphur ≥ 1 mg · metaboric acid ≥ 5 mg · radon ≥ 20 × 10⁻¹⁰ Ci', '(one is enough, even in cold water)'], 12.5, fill=SOFT, gap=17)
b += f'<path d="M 750 295 C 800 295, 805 260, 805 220" fill="none" stroke="{ACC}" stroke-width="2.5" marker-end="url(#ah)"/>' + text(790, 280, 'yes', 13, 700, 'start', ACC)
b += arrow(450, 346, 450, 382) + text(466, 370, 'no', 13, 700, 'start', SOFT)
b += box(300, 382, 300, 48, '#f4f4f4', '#999') + text(450, 412, 'not an onsen under the Act', 14, 600, fill=SOFT)
b += box(30, 140, 190, 92, WARM2, WARM, 8, True) + lines(125, 164, ['A stricter list defines a', '“therapeutic spring”', '(ryōyōsen): see', 'Chapter 3'], 12.5, fill=WARM, gap=17)
page('dia-definition.svg', W, 450, 'How the Hot Springs Act defines an onsen',
     'Water, steam or gas springing from underground is an onsen if it is at least 25 °C when taken from the source, or, if colder, if it contains at least one of 19 listed substances in the legal amount, such as 1,000 mg/kg of dissolved solids. A stricter list defines a therapeutic spring.', b)

# 2. Heat at depth (Chapter 2) — GSJ: ~3 °C per 100 m; 20 °C at surface, ~50 °C at 1,000 m, >100 °C at 3,000 m.
W, H = 760, 470
b = text(W/2, 32, 'Why there is hot water even far from volcanoes', 19, 700)
X0, Y0, ch = 120, 70, 360
b += f'<rect x="{X0}" y="{Y0}" width="240" height="{ch}" fill="url(#g)"/>'
b = b.replace('<rect x', '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf3e7"/><stop offset="1" stop-color="#e8a27f"/></linearGradient></defs><rect x', 1)
for d, t in ((0, '≈ 20 °C (surface)'), (1000, '≈ 50 °C'), (3000, 'over 100 °C')):
    y = Y0 + d / 3000 * (ch - 30)
    b += f'<line x1="{X0 - 8}" y1="{y}" x2="{X0 + 240}" y2="{y}" stroke="{LINE}" stroke-dasharray="4 4"/>' + text(X0 - 14, y + 5, f'{d:,} m', 13, anchor='end', fill=SOFT) + text(X0 + 256, y + 5, t, 14, 600, 'start', WARM)
b += f'<line x1="{X0 + 120}" y1="{Y0 + 330}" x2="{X0 + 120}" y2="{Y0 + 4}" stroke="{ACC}" stroke-width="7"/>' + text(X0 + 120, Y0 + ch + 22, 'a deep well', 13, 600, fill=ACC)
b += lines(560, 110, ['The ground warms by', 'about 3 °C every 100 m.'], 16, 700, 'middle', ACC)
b += lines(560, 190, ['Under the plains of southern', 'Kantō lies “deep hot water”', '(shinsō netsusui). Deep wells', 'reach it: that is where central', 'Tokyo’s onsen come from.'], 13.5, fill=SOFT)
b += lines(560, 330, ['Near young volcanoes, magma', 'a few to about 10 km down', 'heats water far more strongly.'], 13.5, fill=SOFT)
page('dia-heat.svg', W, H, 'Temperature rising with depth',
     'A column of ground warming by about 3 °C per 100 metres: about 20 °C at the surface, about 50 °C at 1,000 m and over 100 °C at 3,000 m. Deep wells reach the deep hot water under the southern Kantō plain; near young volcanoes magma heats water more strongly.', b)

# 3. Reading a spring label (Chapter 3) — MoE analysis guidelines (2014).
W = 980
b = text(W/2, 32, 'The four scales on an onsen analysis sheet', 19, 700)
def scale(y, title, cuts, names, cols):
    s = text(30, y - 12, title, 15, 700, 'start', INK)
    x0, x1 = 30, W - 30; n = len(names); w = (x1 - x0) / n
    for i, nm in enumerate(names):
        s += f'<rect x="{x0 + i * w}" y="{y}" width="{w - 3}" height="40" rx="6" fill="{cols[i]}"/>' + text(x0 + i * w + w / 2, y + 25, nm, 13.5, 600, fill=INK)
    for i, c in enumerate(cuts):
        s += text(x0 + (i + 1) * w - 1.5, y + 58, c, 12.5, 600, fill=SOFT)
    return s
blue = ['#d9edf5', '#b9dceb', '#94c8de', '#6fb2d0', '#4f9bbd']
warm = ['#e3f1f6', '#f6e3d3', '#f1c9a8', '#e8a27f']
b += scale(80, 'Temperature at the source', ['25 °C', '34 °C', '42 °C'], ['cold spring', 'low-temperature', 'warm', 'high-temperature'], warm)
b += scale(180, 'Acidity (pH)', ['3', '6', '7.5', '8.5'], ['acidic', 'weakly acidic', 'neutral', 'weakly alkaline', 'alkaline'], ['#f6d6c4', '#f8e6d8', '#eeeeee', '#d9edf5', '#b9dceb'])
b += scale(280, 'Tonicity (dissolved solids per kg)', ['8,000 mg', '10,000 mg'], ['hypotonic', 'isotonic', 'hypertonic'], blue[:3])
b += text(30, 368, 'Spring type (the posted name)', 15, 700, 'start')
types = ['simple spring', 'chloride', 'hydrogen-carbonate', 'sulphate', 'carbon dioxide', 'iron', 'acidic', 'iodine', 'sulphur', 'radioactive']
for i, t in enumerate(types):
    x = 30 + (i % 5) * 186; y = 380 + (i // 5) * 46
    b += box(x, y, 178, 38, ACC2 if i < 4 else WARM2, ACC if i < 4 else WARM, 8) + text(x + 89, y + 25, t, 13.5, 600)
b += text(W/2, 490, 'Blue: by main dissolved salt (or below 1,000 mg/kg: “simple”) · orange: named after a special component', 12.5, fill=SOFT, italic=True)
page('dia-label.svg', W, 505, 'Scales and spring types on an analysis sheet',
     'Temperature at the source: cold below 25 °C, low 25–34, warm 34–42, high 42 and above. pH: acidic below 3, weakly acidic 3–6, neutral 6–7.5, weakly alkaline 7.5–8.5, alkaline 8.5 and above. Tonicity: hypotonic below 8,000 mg/kg, isotonic to 10,000, hypertonic above. Ten posted spring types: simple, chloride, hydrogen-carbonate, sulphate, carbon dioxide, iron, acidic, iodine, sulphur and radioactive.', b)

# 4. Plan of an Edo bathhouse (Chapter 5) — Morisada mankō as summarised by Kobayashi 2021; zakuroguchi (Kawabata 2006).
W, H = 900, 470
b = text(W/2, 32, 'An Edo bathhouse (yuya), after the Morisada mankō', 19, 700)
b += box(40, 380, 820, 46, '#f4f4f4', '#999', 4) + text(450, 409, 'entrance from the street (doma, earth-floored)', 14, 600, fill=SOFT)
b += box(390, 300, 120, 64, WARM2, WARM, 6) + lines(450, 326, ['takaza', '(the “bandai”)'], 13.5, 700, fill=WARM, gap=18)
b += box(40, 210, 340, 154, '#fff', INK, 4) + lines(210, 280, ['men’s changing room'], 15, 600)
b += box(520, 210, 340, 154, '#fff', INK, 4) + lines(690, 280, ['women’s changing room'], 15, 600)
b += box(40, 110, 340, 100, ACC2, ACC, 4) + text(210, 165, 'washing area', 15, 600, fill=ACC)
b += box(520, 110, 340, 100, ACC2, ACC, 4) + text(690, 165, 'washing area', 15, 600, fill=ACC)
b += box(40, 56, 340, 54, ACC, ACC, 4) + text(210, 89, 'tub, behind the zakuroguchi', 14, 700, fill='#fff')
b += box(520, 56, 340, 54, ACC, ACC, 4) + text(690, 89, 'tub, behind the zakuroguchi', 14, 700, fill='#fff')
b += f'<line x1="40" y1="108" x2="380" y2="108" stroke="{WARM}" stroke-width="6"/><line x1="520" y1="108" x2="860" y2="108" stroke="{WARM}" stroke-width="6"/>'
b += lines(450, 140, ['zakuroguchi:', 'a low board', 'over the tub', 'front; stoop', 'to pass. It', 'kept the heat', 'and steam in.'], 12.5, 600, fill=WARM, gap=16)
page('dia-edo-yuya.svg', W, 450, 'Plan of an Edo bathhouse',
     'From the street entrance the bather paid at the raised takaza, then turned left for the men’s side or right for the women’s side. Each side had a changing room, a washing area, and a tub behind the zakuroguchi, a low board over the tub front that kept heat and steam in.', b)

# 5. Sentō numbers (Chapter 6) — Machida 2017 (1908 Tokyo, 1968 peak), MHLW (2024).
W, H = 760, 420
b = text(W/2, 30, 'Public bathhouses (sentō) in Japan', 19, 700)
pts = [(1968, 18325, 'peak: 18,325 (1968)'), (2024, 2847, '2,847 (March 2024)')]
X0, Y0, cw, chh = 110, 350, 580, 270
def px(y): return X0 + (y - 1960) / (2030 - 1960) * cw
def py(v): return Y0 - v / 20000 * chh
for v in range(0, 20001, 5000):
    b += f'<line x1="{X0}" y1="{py(v)}" x2="{X0 + cw}" y2="{py(v)}" stroke="#e6e6e6"/>' + text(X0 - 10, py(v) + 5, f'{v:,}', 12, anchor='end', fill=SOFT)
for yr in range(1960, 2031, 10): b += text(px(yr), Y0 + 22, str(yr), 12.5, fill=SOFT)
b += f'<line x1="{px(1968)}" y1="{py(18325)}" x2="{px(2024)}" y2="{py(2847)}" stroke="{ACC}" stroke-width="3" stroke-dasharray="8 6"/>'
for yr, v, lab in pts:
    b += f'<circle cx="{px(yr)}" cy="{py(v)}" r="8" fill="{ACC}"/>' + text(px(yr) + (14 if yr < 2000 else -14), py(v) + (-14 if yr < 2000 else 5), lab, 14, 700, 'start' if yr < 2000 else 'end', ACC)
b += lines(px(1984), py(6500), ['Homes got their own baths:', 'by 2008, 95.5% of homes had one.'], 13.5, fill=SOFT)
b += text(W/2, H - 18, 'Two data points; the dashed line does not show the path between them.', 12, fill=SOFT, italic=True)
page('dia-sento.svg', W, H, 'Number of sentō, 1968 and 2024',
     'Japan had 18,325 public bathhouses at the peak in 1968 and 2,847 at the end of March 2024. By 2008, 95.5 per cent of homes had their own bath.', b)

# 6. Steps of a bath (Chapter 9) — JNTO, JTA ryokan Q&A, MoE 2014.
steps = [('1', 'Shoes off', ['before the changing', 'room; lockers are', 'provided']),
         ('2', 'Undress fully', ['clothes in a basket', 'or locker; no', 'swimsuit']),
         ('3', 'Wash first', ['at a washing place;', 'rinse off the soap']),
         ('4', 'Kakeyu', ['pour hot water over', 'yourself to get used', 'to the heat']),
         ('5', 'Soak quietly', ['towel out of the', 'water; long hair', 'tied up']),
         ('6', 'Rest', ['pat dry, keep warm,', 'rest and drink a', 'glass of water'])]
W = 1000
b = text(W/2, 32, 'A bath, step by step', 19, 700)
for i, (n, t, rows) in enumerate(steps):
    x = 20 + i * 163
    b += box(x, 56, 150, 160, ACC2 if i % 2 == 0 else '#fff', ACC, 12)
    b += f'<circle cx="{x + 75}" cy="88" r="20" fill="{ACC}"/>' + text(x + 75, 95, n, 18, 700, fill='#fff')
    b += text(x + 75, 136, t, 15, 700) + lines(x + 75, 160, rows, 12, fill=SOFT, gap=15)
    if i < 5: b += arrow(x + 151, 131, x + 162, 131, ACC, 2)
b += text(W/2, 244, 'Throughout: no photographs, no loud talk, no swimming; drink water before and after.', 13.5, 600, fill=WARM)
page('dia-steps.svg', W, 262, 'The steps of a Japanese bath',
     'Six steps: take off your shoes; undress fully, without a swimsuit; wash at a washing place and rinse off the soap; pour hot water over yourself (kakeyu); soak quietly with the towel out of the water and long hair tied up; afterwards pat dry, keep warm, rest and drink a glass of water. No photographs, loud talk or swimming; drink water before and after.', b)
