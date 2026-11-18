# Draws the explanatory diagrams of the folklore handbook (folklore/img/dia-*.svg).
# Every label restates a fact cited in the chapter that uses the diagram.
# Run from the repository root:  python3 scripts/diagrams/folklore.py
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'folklore', 'img')
FONT = "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
INK, SOFT, ACC, ACC2, WARM, LINE = '#222', '#555', '#5b4a8a', '#ebe6f6', '#94530f', '#bbb'

def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def text(x, y, s, size=15, weight=400, anchor='middle', fill=INK, italic=False):
    st = 'font-style:italic;' if italic else ''
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="{FONT};{st}font-size:{size}px;font-weight:{weight}" fill="{fill}">{esc(s)}</text>'
def lines(x, y, rows, size=14, weight=400, anchor='middle', fill=INK, gap=None):
    gap = gap or size + 5
    return ''.join(text(x, y + i * gap, r, size, weight, anchor, fill) for i, r in enumerate(rows))
def box(x, y, w, h, fill=ACC2, stroke=ACC, r=10, dash=False):
    d = ' stroke-dasharray="6 5"' if dash else ''
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="2"{d}/>'
def arrow(x1, y1, x2, y2, col=SOFT, w=2.5):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{w}" marker-end="url(#ah)"/>'
def page(name, W, H, title, desc, body):
    defs = f'<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{SOFT}"/></marker></defs>'
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="t d">'
           f'<title id="t">{esc(title)}</title><desc id="d">{esc(desc)}</desc>{defs}<rect width="{W}" height="{H}" fill="#fff"/>{body}</svg>')
    open(os.path.join(OUT, name), 'w').write(svg)
    print(name, len(svg))

# 1. Yomi: the usual three-layer reading against Kōnoshi's reading (Chapter 2)
b = text(250, 34, 'The usual reading', 18, 700) + text(750, 34, 'Kōnoshi’s reading of the Kojiki', 18, 700)
for i, (name, sub, col) in enumerate([('Takamanohara', 'high plain of heaven', '#f3eefc'), ('Ashihara no Nakatsukuni', 'the human world', '#eef6ee'), ('Yomotsukuni', 'land of Yomi, underground', '#efe9e1')]):
    y = 60 + i * 105
    b += box(70, y, 360, 85, col, LINE) + text(250, y + 38, name, 17, 700) + text(250, y + 62, sub, 14, fill=SOFT)
b += text(250, 415, 'three layers, one above the other', 14, fill=SOFT, italic=True)
b += box(560, 300, 120, 50, '#efe9e1', LINE) + text(620, 331, 'Yomi', 16, 700)
b += '<path d="M640 298 L720 150 L800 150 L880 298" fill="none" stroke="#8a7a5a" stroke-width="3"/>'
b += text(760, 136, 'Yomotsu Hirasaka (the pass)', 14, 600, fill=WARM)
b += f'<circle cx="880" cy="282" r="16" fill="#9a9a9a"/>' + text(856, 287, 'boulder', 13, anchor='end', fill=SOFT)
b += arrow(784, 176, 846, 262, WARM) + text(770, 225, 'flees down', 13, 600, 'end', WARM)
b += box(800, 310, 180, 62, '#eef6ee', LINE) + text(890, 337, 'Ashihara no', 14, 700) + text(890, 356, 'Nakatsukuni', 14, 700)
b += text(890, 390, 'the human world', 13, fill=SOFT)
b += text(750, 415, 'Yomi not necessarily underground; no three-layer world', 14, fill=SOFT, italic=True)
page('dia-yomi.svg', 1000, 432, 'Two readings of the Land of Yomi',
     'Left: the common interpretation of three layers, heaven, the human world and an underground Yomi. Right: Kōnoshi Takamitsu’s reading, in which Izanagi flees down from the pass Yomotsu Hirasaka and blocks it with a boulder at its foot.', b)

# 2. Katashiro year (Chapter 3)
steps = [('1. Made', ['priest cuts paper figures:', 'white for men, red for women']), ('2. Taken home', ['parishioner writes name', 'and age on it']),
         ('3. Charged', ['breathes on it, rubs it', 'over the body']), ('4. Returned', ['placed in a box at', 'the shrine offering bin']),
         ('5. Purified', ['New Year’s Eve, 7 p.m.:', 'Great Purification prayer']), ('6. Sent away', ['floated off on the water', '“to oblivion”'])]
b = text(500, 34, 'The paper substitute (katashiro): one shrine’s year-end rite', 19, 700)
for i, (h, rows) in enumerate(steps):
    x = 30 + (i % 3) * 325; y = 70 + (i // 3) * 150
    b += box(x, y, 290, 110) + text(x + 145, y + 34, h, 17, 700, fill=ACC) + lines(x + 145, y + 62, rows, 14)
    if i % 3 < 2: b += arrow(x + 292, y + 55, x + 323, y + 55)
b += arrow(905, 182, 905, 218) if False else ''
b += f'<path d="M 790 182 C 790 200, 175 200, 175 218" fill="none" stroke="{SOFT}" stroke-width="2.5" marker-end="url(#ah)"/>'
b += box(30, 380, 455, 70, '#fff4ea', WARM) + text(257, 410, 'December: fire is the purifying medium', 15, 700, fill=WARM) + text(257, 434, 'old amulets, rakes, daruma and ropes are burned', 13, fill=SOFT)
b += box(515, 380, 455, 70, '#eaf3fb', '#3b6f9a') + text(742, 410, 'June: the same rite with clear water', 15, 700, fill='#3b6f9a') + text(742, 434, '“Winter is the fire season, summer the water season”', 13, fill=SOFT)
page('dia-katashiro.svg', 1000, 465, 'The katashiro purification rite',
     'Six steps: the priest makes paper figures, parishioners write their names on them, breathe on them, return them to the shrine, the priest purifies them on New Year’s Eve, and they are floated away. Fire purifies in December, water in June.', b)

# 3. Timeline of kami and buddhas (Chapter 5)
ev = [('538 / 552', 'Buddhism formally reaches', 'the court (two datings)'), ('712 · 720', 'Kojiki and Nihon shoki', 'compiled'),
      ('8th c.', 'kami need salvation: sutras,', 'stupas for kami'), ('863', 'first goryō ceremony', 'at the palace'),
      ('mid-10th c.', 'honji suijaku: kami as', 'forms of buddhas'), ('12th c.', 'combination fully developed;', 'Shugendō'),
      ('14th c.', 'the reading “shintō”', 'appears in initiations'), ('early 19th c.', 'kami initiations in', 'Buddhism most widespread'),
      ('1868', 'Separation Orders:', 'shinbutsu bunri'), ('1981', '93.8% of funerals', 'still Buddhist')]
W = 1000; b = text(500, 34, 'Kami and buddhas: a thousand years together, then separation', 19, 700)
b += f'<line x1="40" y1="120" x2="960" y2="120" stroke="{LINE}" stroke-width="4"/>'
for i, (d, a, c) in enumerate(ev):
    x = 92 + i * 91.5; col = WARM if d in ('1868', '1981') else ACC
    b += f'<circle cx="{x}" cy="120" r="8" fill="{col}"/>'
    if i % 2 == 0:
        b += text(x, 98, d, 14, 700, fill=col) + lines(x, 56, [a, c], 11, fill=SOFT, gap=14)
    else:
        b += text(x, 150, d, 14, 700, fill=col) + lines(x, 172, [a, c], 11, fill=SOFT, gap=14)
b += f'<rect x="200" y="215" width="600" height="10" rx="5" fill="{ACC2}" stroke="{ACC}"/>' + text(500, 248, 'combined worship (shinbutsu shūgō)', 14, 600, fill=ACC)
b += f'<rect x="815" y="215" width="150" height="10" rx="5" fill="#fff4ea" stroke="{WARM}"/>' + text(890, 248, 'after 1868', 14, 600, fill=WARM)
page('dia-timeline.svg', W, 270, 'Timeline of kami and buddhas',
     'From the arrival of Buddhism (538 or 552) through the Kojiki and Nihon shoki (712, 720), the first goryō ceremony (863), honji suijaku (mid-10th century), the reading shintō (14th century) and kami initiations (early 19th century) to the Separation Orders of 1868 and the 1981 survey showing 93.8 per cent Buddhist funerals.', b)

# 4. From death to ancestor (Chapter 6)
b = text(500, 34, 'From death to ancestor (Ooms’s village study)', 19, 700)
st = [('Death', ['tablet (ihai) on a low', 'stand below the altar']), ('49th day', ['tablet joins the ancestors;', 'soul leaves for the grave']),
      ('Memorial years', ['e.g. 1, 3, 7, 13, 17, 23 …', 'customarily to the 33rd']), ('Final memorial', ['tomurai-age: the person', 'fades as an individual']),
      ('Ancestors', ['one tablet for “all', 'generations of this house”'])]
for i, (h, rows) in enumerate(st):
    x = 20 + i * 196
    b += box(x, 70, 172, 110, '#f3eefc' if i < 4 else '#e6f1e6', ACC if i < 4 else '#3f7a3f') + text(x + 86, 102, h, 16, 700, fill=ACC if i < 4 else '#3f7a3f') + lines(x + 86, 132, rows, 12.5)
    if i < 4: b += arrow(x + 174, 125, x + 194, 125)
b += box(20, 230, 450, 92, '#fff4ea', WARM, dash=True) + text(245, 262, 'First Bon: shinmō, the newly dead', 15, 700, fill=WARM) + lines(245, 288, ['pacified and sent off with special rites', '(Shima region: pole torch, nenbutsu)'], 13, fill=SOFT)
b += box(530, 230, 450, 92, '#f2f2f2', '#888', dash=True) + text(755, 262, 'No one to tend the grave', 15, 700, fill='#666') + lines(755, 288, ['the dead may lapse into muenbotoke,', '“forgotten souls”'], 13, fill=SOFT)
b += arrow(140, 182, 200, 228, WARM) + arrow(510, 182, 690, 228, '#888')
page('dia-ancestors.svg', 1000, 340, 'From death to ancestor',
     'Death, the 49th day when the tablet joins the ancestors, memorial years up to the 33rd, the final memorial, and the anonymous ancestors. Side paths: the first Bon of the newly dead, and the forgotten dead (muenbotoke) when no one tends the grave.', b)

# 5. Goryō: Kuroda's three steps (Chapter 7)
b = text(500, 34, 'How a vengeful spirit becomes a god (Kuroda Toshio)', 19, 700)
st = [('1. Angry spirit', ['= roaming', '= fear'], '#fdecec', '#a33'), ('2. Goryō ceremony', ['= pacification', '= prevention of disasters'], '#fff4ea', WARM),
      ('3. Goryō belief', ['= enshrinement', '= call for divine favour'], '#e6f1e6', '#3f7a3f')]
for i, (h, rows, f, s) in enumerate(st):
    x = 30 + i * 330
    b += box(x, 70, 280, 120, f, s) + text(x + 140, 108, h, 18, 700, fill=s) + lines(x + 140, 140, rows, 15)
    if i < 2: b += arrow(x + 283, 130, x + 327, 130)
b += lines(500, 230, ['Example: six people who died after false accusations were honoured at the first goryō ceremony in 863;',
                      'Sugawara no Michizane became Tenjin; Gozu Tennō, a deity of epidemics, was worshipped at Gion.'], 14, fill=SOFT)
page('dia-goryo.svg', 1000, 265, 'How a vengeful spirit becomes a god',
     'Kuroda Toshio’s three steps: angry spirit (roaming, fear), goryō ceremony (pacification, prevention of disasters), goryō belief (enshrinement, call for divine favour).', b)

# 6. Kami–yōkai continuum (Chapter 10)
b = text(500, 34, 'Kami and yōkai: two ends of one line (Komatsu Kazuhiko)', 19, 700)
b += '<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#e6f1e6"/><stop offset="1" stop-color="#fdecec"/></linearGradient></defs>'
b += f'<rect x="60" y="70" width="880" height="56" rx="28" fill="url(#g)" stroke="{LINE}"/>'
b += text(130, 105, 'KAMI', 20, 800, fill='#3f7a3f') + text(870, 105, 'YŌKAI', 20, 800, fill='#a33')
b += lines(200, 160, ['benevolent toward humans', 'worshipped'], 14, anchor='start', fill=SOFT) + lines(800, 160, ['malevolent or neutral', 'not worshipped'], 14, anchor='end', fill=SOFT)
b += f'<path d="M 720 222 C 600 262, 400 262, 280 222" fill="none" stroke="#3f7a3f" stroke-width="2.5" marker-end="url(#ah)"/>' + text(500, 280, 'honoured and pacified: a vengeful spirit becomes a goryō, then a kami', 14, 600, fill='#3f7a3f')
b += f'<path d="M 280 312 C 400 352, 600 352, 720 312" fill="none" stroke="#a33" stroke-width="2.5" marker-end="url(#ah)"/>' + text(500, 372, 'turned hostile toward humans: a kami moves to the yōkai end (e.g. the kappa, often explained as a degraded water deity)', 14, 600, fill='#a33')
page('dia-continuum.svg', 1000, 395, 'The kami–yōkai continuum',
     'A horizontal line with kami (benevolent, worshipped) at one end and yōkai (malevolent or neutral, not worshipped) at the other. Arrows show movement both ways: pacified spirits become kami, offended kami slide toward yōkai.', b)

# 7. Naming (Chapter 10)
b = text(500, 34, 'How naming made new yōkai: azuki-arai, “the bean-washer”', 19, 700)
b += text(250, 76, 'Before (ancient and medieval)', 16, 700, fill=SOFT) + text(750, 76, 'After (Edo period)', 16, 700, fill=ACC)
b += box(150, 95, 200, 60, '#f2f2f2', '#888') + text(250, 131, 'a strange sound', 16, 700)
b += box(40, 210, 200, 70, '#fff4ea', WARM) + lines(140, 240, ['a dead young', 'monk’s spirit'], 14) + box(260, 210, 200, 70, '#fff4ea', WARM) + lines(360, 240, ['a fox or', 'tanuki'], 14)
b += arrow(140, 208, 210, 158) + arrow(360, 208, 290, 158) + text(250, 310, 'explained by a few known causes', 14, fill=SOFT, italic=True)
b += box(650, 95, 200, 60, ACC2, ACC) + text(750, 131, 'azuki-arai', 17, 700, fill=ACC)
b += box(650, 220, 200, 60, '#f2f2f2', '#888') + text(750, 256, 'the sound “azuki-arai”', 15, 700)
b += arrow(750, 157, 750, 216) + text(765, 192, 'makes', 13, 600, 'start', ACC) + text(750, 310, 'the name becomes a being of its own', 14, fill=SOFT, italic=True)
b += f'<line x1="500" y1="70" x2="500" y2="320" stroke="{LINE}" stroke-width="2" stroke-dasharray="6 6"/>'
page('dia-naming.svg', 1000, 335, 'How naming made new yōkai',
     'Before: a strange sound was explained as the spirit of a dead young monk or the work of a fox or tanuki. After naming in the Edo period: a being called azuki-arai makes the sound called azuki-arai.', b)
