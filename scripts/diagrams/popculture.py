# Draws the explanatory diagrams of the pop culture handbook (popculture/img/dia-*.svg).
# Every label restates a fact or figure cited in the chapter that uses the diagram.
# Run from the repository root:  python3 scripts/diagrams/popculture.py
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'popculture', 'img')
FONT = "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
INK, SOFT, ACC, ACC2, WARM, WARM2, LINE = '#222', '#555', '#a3385f', '#f8e6ee', '#1f6f8b', '#e3f1f6', '#bbb'

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

# 1. Overview timeline (start page)
ev = [('12th c.', 'Chōjū-giga', 'animal scrolls'), ('1814', 'Hokusai manga', 'vol. 1'), ('1917', 'first Japanese', 'animation'),
      ('1951', 'Rashomon:', 'Golden Lion'), ('1954', 'Godzilla', ''), ('1959', 'weekly boys’', 'manga magazines'),
      ('1963', 'Astro Boy', 'on TV'), ('1975', 'first', 'Comic Market'), ('1983', 'Famicom', ''), ('2002', '“Gross National', 'Cool”'),
      ('2007', 'Hatsune Miku', ''), ('2024', 'overseas: 56.5%', 'of anime market')]
b = text(500, 32, 'Pop culture in Japan: a timeline of this handbook', 19, 700)
b += f'<line x1="30" y1="120" x2="970" y2="120" stroke="{LINE}" stroke-width="4"/>'
for i, (d, a, c) in enumerate(ev):
    x = 62 + i * 80; col = WARM if i >= 9 else ACC
    b += f'<circle cx="{x}" cy="120" r="7" fill="{col}"/>'
    if i % 2 == 0: b += text(x, 98, d, 14, 700, fill=col) + lines(x, 58, [a, c], 11.5, fill=SOFT, gap=14)
    else: b += text(x, 150, d, 14, 700, fill=col) + lines(x, 172, [a, c], 11.5, fill=SOFT, gap=14)
page('dia-timeline.svg', 1000, 200, 'Timeline of Japanese pop culture',
     'From the twelfth-century Chōjū-giga scrolls and Hokusai manga (1814) through the first Japanese animation (1917), Rashomon’s Golden Lion (1951), Godzilla (1954), weekly boys’ manga magazines (1959), Astro Boy (1963), the first Comic Market (1975) and the Famicom (1983), to “Gross National Cool” (2002), Hatsune Miku (2007) and an anime market 56.5 per cent overseas (2024).', b)

# 2. Manga reading order (Chapter 2)
b = text(330, 32, 'Reading a manga page', 19, 700)
px, py, pw, ph = 70, 60, 300, 400
b += box(px, py, pw, ph, '#fff', '#888', 4)
panels = [(px + 160, py + 15, 125, 120, '1'), (px + 15, py + 15, 135, 120, '2'), (px + 15, py + 145, 270, 110, '3'), (px + 150, py + 265, 135, 120, '4'), (px + 15, py + 265, 125, 120, '5')]
for x, y, w, h, n in panels:
    b += box(x, y, w, h, ACC2, ACC, 4) + f'<circle cx="{x + w/2}" cy="{y + h/2}" r="22" fill="{ACC}"/>' + text(x + w/2, y + h/2 + 7, n, 20, 700, fill='#fff')
b += arrow(px + 200, py + 75, px + 112, py + 75, INK) + arrow(px + 60, py + 120, px + 120, py + 170, INK) + arrow(px + 230, py + 230, px + 230, py + 295, INK) + arrow(px + 190, py + 325, px + 112, py + 325, INK)
b += f'<rect x="{px + pw}" y="{py}" width="10" height="{ph}" fill="#666"/>' + text(px + pw + 18, py + ph/2, 'spine', 13, 600, 'start', SOFT)
b += lines(560, 120, ['Panels: right to left,', 'then top to bottom'], 17, 700, fill=ACC)
b += lines(560, 200, ['The book opens from what a', 'Western reader calls the back:', 'pages turn from left to right.'], 14, fill=SOFT)
b += lines(560, 300, ['Picture scrolls already unrolled', 'from right to left (Chapter 1).'], 14, fill=SOFT)
b += lines(560, 380, ['Readers abroad now prefer the', 'original “back-to-front” format.'], 14, fill=SOFT)
page('dia-reading.svg', 760, 490, 'How to read a manga page',
     'A page with five panels numbered in reading order: right to left along the top row, then the wide middle panel, then right to left along the bottom row. The spine is on the right; the book opens from what a Western reader calls the back.', b)

# 3. Production committee (Chapter 3)
W = 1000
b = text(W/2, 32, 'How a TV anime series is financed: the production committee', 19, 700)
mem = ['publisher', 'animation studio', 'video company', 'music company', 'game company', 'toy company', 'ad agency']
for i, m in enumerate(mem):
    x = 22 + i * 138; b += box(x, 56, 128, 44, '#fff', ACC, 8) + text(x + 64, 84, m, 14, 600)
    b += arrow(x + 64, 102, 500 + (x + 64 - 500) * 0.35, 146, ACC, 2)
b += f'<rect x="452" y="112" width="96" height="18" fill="#fff"/>' + text(W/2, 126, 'invest money', 13, 600, fill=ACC)
b += box(250, 150, 500, 92, ACC2, ACC, 12) + text(500, 180, 'Production committee (seisaku iinkai)', 17, 700, fill=ACC)
b += lines(500, 204, ['a voluntary partnership (Civil Code art. 668): shares the copyright,', 'divides revenue by each member’s share of the investment'], 13, fill=SOFT, gap=17)
b += arrow(260, 245, 140, 300) + box(30, 300, 230, 96, WARM2, WARM, 10) + lines(145, 326, ['TV station'], 15, 700, fill=WARM) + lines(145, 350, ['the committee buys the', 'broadcast slot: no income'], 12.5, fill=SOFT, gap=16)
b += arrow(500, 245, 500, 300) + box(330, 300, 340, 96, '#fff', INK, 10) + lines(500, 326, ['Prime contractor (animation studio)'], 15, 700) + lines(500, 350, ['receives the production order; works with', 'specialist companies and freelancers'], 12.5, fill=SOFT, gap=16)
b += arrow(700, 245, 800, 300) + box(740, 300, 230, 96, '#fff', ACC, 10) + lines(855, 326, ['“Windows” (madoguchi)'], 15, 700, fill=ACC) + lines(855, 350, ['broadcasting, merchandise,', 'overseas sales, streaming'], 12.5, fill=SOFT, gap=16)
b += f'<path d="M 972 340 C 1000 260, 900 196, 754 196" fill="none" stroke="{ACC}" stroke-width="2.5" stroke-dasharray="7 5" marker-end="url(#ah)"/>' + text(870, 282, 'revenue flows back', 13, 600, 'middle', ACC)
b += box(330, 420, 340, 54, '#fffaf0', '#c9a227', 8) + lines(500, 442, ['≥ ¥25 million per episode · ≥ ¥300 million per project', 'quality risk falls on the studio'], 12.5, fill=INK, gap=17)
page('dia-committee.svg', W, 490, 'The production committee system',
     'Publishers, animation studios, video, music, game and toy companies and advertising agencies invest in a production committee, a voluntary partnership that shares the copyright. It buys a broadcast slot from a TV station, orders the animation from a prime contractor studio, and earns revenue through windows for broadcasting, merchandise, overseas sales and streaming. A project needs at least 25 million yen per episode and 300 million yen in total.', b)

# 4. Anime market, domestic and overseas, 2018–2024 (Chapter 3)
data = [(2018, 2180.7, 1009.2), (2019, 2514.5, 1200.9), (2020, 2419.9, 1239.4), (2021, 2742.2, 1313.4), (2022, 2927.7, 1459.2), (2023, 3346.5, 1722.2), (2024, 3840.7, 2170.2)]
W, H, X0, Y0, ch = 760, 440, 90, 380, 300
mx = 4000; sc = ch / mx
b = text(W/2, 30, 'Japan’s anime market (billion yen): domestic and overseas', 18, 700)
for v in range(0, 4001, 1000):
    y = Y0 - v * sc; b += f'<line x1="{X0}" y1="{y}" x2="{W - 30}" y2="{y}" stroke="#e6e6e6"/>' + text(X0 - 10, y + 5, f'{v:,}', 12, anchor='end', fill=SOFT)
bw = 62
for i, (yr, tot, ov) in enumerate(data):
    x = X0 + 25 + i * 90; dom = tot - ov
    b += f'<rect x="{x}" y="{Y0 - dom * sc}" width="{bw}" height="{dom * sc}" fill="{WARM}"/>'
    b += f'<rect x="{x}" y="{Y0 - tot * sc}" width="{bw}" height="{ov * sc}" fill="{ACC}"/>'
    b += text(x + bw/2, Y0 - tot * sc - 8, f'{tot:,.0f}', 12, 600) + text(x + bw/2, Y0 + 20, str(yr), 13)
b += f'<rect x="{X0 + 10}" y="52" width="14" height="14" fill="{ACC}"/>' + text(X0 + 30, 64, 'overseas', 13, anchor='start')
b += f'<rect x="{X0 + 110}" y="52" width="14" height="14" fill="{WARM}"/>' + text(X0 + 130, 64, 'domestic', 13, anchor='start')
b += text(W - 30, 64, 'overseas > domestic from 2023', 13, 600, 'end', ACC)
b += text(W/2, H - 18, 'Source: Association of Japanese Animations, Anime Industry Report 2025 (summary)', 12, fill=SOFT, italic=True)
page('dia-anime-market.svg', W, H, 'Anime market 2018 to 2024',
     'Stacked bars of the Japanese anime market in billion yen, split into domestic and overseas: 2,181 in 2018 rising to 3,841 in 2024, with the overseas share (2,170 in 2024) larger than the domestic share since 2023.', b)

# 5. Manga marks (manpu) (Chapter 4)
def face(cx, cy):
    return (f'<circle cx="{cx}" cy="{cy}" r="58" fill="#fff8f0" stroke="{INK}" stroke-width="3"/>'
            f'<circle cx="{cx - 20}" cy="{cy - 6}" r="5" fill="{INK}"/><circle cx="{cx + 20}" cy="{cy - 6}" r="5" fill="{INK}"/>')
b = text(500, 32, 'Manga marks (manpu) used on the Waseda robot face', 19, 700)
labels = [('Anger', 'a bulging blood-vessel mark'), ('Sadness', 'a tear mark'), ('Disgust', 'wrinkle marks'), ('Fear', 'face colour and hanging lines')]
for i, (n, d) in enumerate(labels):
    cx = 130 + i * 247; cy = 140; b += face(cx, cy)
    if n == 'Anger':
        import math
        vx, vy, R = cx + 30, cy - 34, 15
        for a in (45, 135, 225, 315):
            p1 = (vx + R * math.cos(math.radians(a - 32)), vy + R * math.sin(math.radians(a - 32)))
            p2 = (vx + R * math.cos(math.radians(a + 32)), vy + R * math.sin(math.radians(a + 32)))
            q = (vx + 3 * math.cos(math.radians(a)), vy + 3 * math.sin(math.radians(a)))
            b += f'<path d="M {p1[0]:.1f} {p1[1]:.1f} Q {q[0]:.1f} {q[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}" fill="none" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>'
        b += f'<path d="M {cx - 30} {cy - 20} l 18 6 M {cx + 30} {cy - 20} l -18 6" stroke="{INK}" stroke-width="3"/><path d="M {cx - 18} {cy + 28} q 18 -12 36 0" fill="none" stroke="{INK}" stroke-width="3"/>'
    if n == 'Sadness':
        b += f'<path d="M {cx - 20} {cy + 4} q -9 16 0 24 q 9 -8 0 -24 z" fill="#5dade2" stroke="#2e86c1" stroke-width="2"/><path d="M {cx - 18} {cy + 34} q 18 -12 36 0" fill="none" stroke="{INK}" stroke-width="3" transform="rotate(180 {cx} {cy + 30})"/>'
    if n == 'Disgust':
        b += ''.join(f'<path d="M {cx - 14 + k * 7} {cy - 30} l 0 -10" stroke="{INK}" stroke-width="2.5"/>' for k in range(5))
        b += f'<path d="M {cx - 18} {cy + 28} l 36 4" stroke="{INK}" stroke-width="3"/>'
    if n == 'Fear':
        b += f'<rect x="{cx - 48}" y="{cy - 56}" width="96" height="40" fill="#7f9cc9" opacity="0.55"/>' + ''.join(f'<path d="M {cx - 36 + k * 12} {cy - 52} l 0 30" stroke="#2c3e70" stroke-width="2.5"/>' for k in range(7))
        b += f'<ellipse cx="{cx}" cy="{cy + 30}" rx="10" ry="7" fill="none" stroke="{INK}" stroke-width="3"/>'
    b += text(cx, 232, n, 17, 700, fill=ACC) + text(cx, 256, d, 13, fill=SOFT)
b += text(500, 300, 'Japanese viewers recognised the six basic emotions on the robot at over 90% on average; German viewers found the faces harder to read.', 13, fill=SOFT, italic=True)
page('dia-manpu.svg', 1000, 320, 'Manga marks for emotions',
     'Four simple faces show the manga marks used on the KOBIAN robot: a bulging blood-vessel mark for anger, a tear for sadness, wrinkle marks for disgust, and a change of face colour with vertical hanging lines for fear.', b)

# 6. Cinema admissions 1955-2025 (Chapter 5)
ADM = {1955: 868.9, 1956: 993.9, 1957: 1098.9, 1958: 1127.5, 1959: 1088.1, 1960: 1014.4, 1961: 863.4, 1962: 662.3, 1963: 511.1, 1964: 431.5, 1965: 372.7, 1966: 345.8, 1967: 335.1, 1968: 313.4, 1969: 284.0, 1970: 254.8, 1971: 216.8, 1972: 187.4, 1973: 185.3, 1974: 185.7, 1975: 174.0, 1976: 171.0, 1977: 165.2, 1978: 166.0, 1979: 165.1, 1980: 164.4, 1981: 149.4, 1982: 155.3, 1983: 170.4, 1984: 150.5, 1985: 155.1, 1986: 160.8, 1987: 143.9, 1988: 144.8, 1989: 143.6, 1990: 146.0, 1991: 138.3, 1992: 125.6, 1993: 130.7, 1994: 123.0, 1995: 127.0, 1996: 119.6, 1997: 140.7, 1998: 153.1, 1999: 144.8, 2000: 135.4, 2001: 163.3, 2002: 160.8, 2003: 162.3, 2004: 170.1, 2005: 160.5, 2006: 164.6, 2007: 163.2, 2008: 160.5, 2009: 169.3, 2010: 174.4, 2011: 144.7, 2012: 155.2, 2013: 155.9, 2014: 161.1, 2015: 166.6, 2016: 180.2, 2017: 174.5, 2018: 169.2, 2019: 194.9, 2020: 106.1, 2021: 114.8, 2022: 152.0, 2023: 155.5, 2024: 144.4, 2025: 188.8}
W, H, X0, Y0, ch = 900, 420, 80, 350, 280
x_of = lambda y: X0 + (y - 1955) * (W - X0 - 40) / 70
y_of = lambda v: Y0 - v * ch / 1200
b = text(W/2, 30, 'Cinema admissions in Japan, 1955–2025 (millions)', 18, 700)
for v in range(0, 1201, 200):
    b += f'<line x1="{X0}" y1="{y_of(v)}" x2="{W - 40}" y2="{y_of(v)}" stroke="#e6e6e6"/>' + text(X0 - 10, y_of(v) + 5, str(v), 12, anchor='end', fill=SOFT)
for yr in range(1955, 2026, 10): b += text(x_of(yr), Y0 + 22, str(yr), 12, fill=SOFT)
pts = ' '.join(f'{x_of(y):.1f},{y_of(v):.1f}' for y, v in sorted(ADM.items()))
b += f'<polyline points="{pts}" fill="none" stroke="{ACC}" stroke-width="3"/>'
for yr, lab, dx, dy, anc in [(1958, '1958: 1,127.5 — the peak', 12, -6, 'start'), (1963, '1963: 511 — television spreads', 12, 4, 'start'), (1996, '1996: 119.6 — the low', 0, 30, 'middle'), (2020, '2020: 106.1 — pandemic', -10, 24, 'end'), (2025, '2025: 188.8', -6, -14, 'end')]:
    b += f'<circle cx="{x_of(yr)}" cy="{y_of(ADM[yr])}" r="5" fill="{WARM}"/>' + text(x_of(yr) + dx, y_of(ADM[yr]) + dy, lab, 13, 600, anc, WARM)
b += text(W/2, H - 18, 'Source: Motion Picture Producers Association of Japan (Eiren), industry statistics', 12, fill=SOFT, italic=True)
page('dia-admissions.svg', W, H, 'Cinema admissions in Japan 1955 to 2025',
     'A line chart of annual cinema admissions: a peak of 1,127.5 million in 1958, a halving to 511 million by 1963 as television spread, a low of 119.6 million in 1996, 106.1 million in the pandemic year 2020, and 188.8 million in 2025.', b)

# 7. Time scaling of a falling fragment (Chapter 6)
b = text(500, 32, 'Why a miniature must be filmed fast', 19, 700)
b += box(30, 60, 300, 270, '#fff', INK, 10) + text(180, 88, 'Real building', 16, 700)
b += f'<rect x="80" y="110" width="60" height="200" fill="#ccc"/><rect x="200" y="140" width="14" height="10" fill="#777"/>' + arrow(207, 152, 207, 300, INK) + text(150, 322, '', 1)
b += lines(260, 200, ['2 m fragment', 'falls 40 m', 'in ≈ 3 s'], 14, 600, fill=INK)
b += box(350, 60, 300, 270, '#fff', ACC, 10) + text(500, 88, '1/20 scale model', 16, 700, fill=ACC)
b += f'<rect x="420" y="250" width="16" height="60" fill="#ccc"/><rect x="470" y="256" width="5" height="4" fill="#777"/>' + arrow(473, 262, 473, 300, ACC)
b += lines(560, 200, ['10 cm fragment', 'falls 2 m', 'in ≈ 0.6 s'], 14, 600, fill=ACC)
b += lines(500, 135, ['filmed at 24 frames/s:', 'the audience sees a model'], 13, fill=SOFT)
b += box(670, 60, 300, 270, WARM2, WARM, 10) + text(820, 88, 'The fix', 16, 700, fill=WARM)
b += text(820, 140, 'P′ / P = √(L / L′)', 20, 700, fill=WARM)
b += lines(820, 180, ['film the model at', '24 × √20 ≈ 107 frames/s,', 'project at 24 frames/s:', 'the fall lasts ≈ 3 s again'], 14, fill=INK)
b += arrow(652, 195, 668, 195)
b += text(500, 360, 'Gamera 3 (Shibuya scene): explosion filmed at 240 frames/s, lights at 90, the monster at 72', 13, fill=SOFT, italic=True)
page('dia-sfx.svg', 1000, 380, 'Time scaling for miniatures',
     'A 2-metre fragment falling 40 metres takes about 3 seconds; in a 1/20 model it falls in about 0.6 seconds. Filming speed must scale with the square root of the scale: film at about 107 frames per second and project at 24, and the fall lasts about 3 seconds again.', b)

# 8. What makes something kawaii (Chapter 9)
b = text(500, 32, 'What makes an object look kawaii: laboratory results', 19, 700)
rows = [('Shape', 'straight lines', 'curves'), ('Colour', 'the five basic hues', 'in-between hues'), ('Brightness', 'dull, dark', 'lighter, more saturated'), ('Size', 'large', 'small (up to a point)')]
b += text(420, 70, 'less kawaii', 14, 700, fill=SOFT) + text(780, 70, 'more kawaii', 14, 700, fill=ACC)
for i, (n, a, c) in enumerate(rows):
    y = 90 + i * 95
    b += text(120, y + 50, n, 17, 700, 'start') + arrow(560, y + 42, 640, y + 42)
    if n == 'Shape':
        b += f'<rect x="380" y="{y + 12}" width="60" height="60" fill="#d9d9d9" stroke="#888"/>' + f'<rect x="740" y="{y + 12}" width="60" height="60" rx="30" fill="#f5b7c8" stroke="{ACC}"/>'
    if n == 'Colour':
        b += ''.join(f'<circle cx="{345 + k * 30}" cy="{y + 42}" r="12" fill="{c_}"/>' for k, c_ in enumerate(['#d62728', '#e6c700', '#2ca02c', '#1f77b4', '#7b3fa0']))
        b += f'<circle cx="755" cy="{y + 42}" r="16" fill="#f39c4a"/><circle cx="795" cy="{y + 42}" r="16" fill="#c2457a"/>'
    if n == 'Brightness':
        b += f'<circle cx="410" cy="{y + 42}" r="26" fill="#7a5a63"/><circle cx="770" cy="{y + 42}" r="26" fill="#ff8fb4"/>'
    if n == 'Size':
        b += f'<circle cx="410" cy="{y + 42}" r="38" fill="#f5b7c8" opacity="0.8"/><circle cx="770" cy="{y + 42}" r="18" fill="#f5b7c8"/>'
    b += text(410, y + 92, a, 12.5, fill=SOFT) + text(770, y + 92, c, 12.5, fill=SOFT)
page('dia-kawaii.svg', 1000, 480, 'What makes an object kawaii',
     'Four comparisons from laboratory experiments: curved shapes are more kawaii than straight ones; in-between hues such as yellow-red and red-purple more than the five basic hues; lighter, more saturated colours more than dull ones; and smaller objects, up to a point, more than large ones.', b)

# 9. Cool Japan timeline (Chapter 12)
ev = [('2001', 'METI media and', 'content division'), ('2002', 'McGray: “Gross', 'National Cool”'), ('2009', 'pop culture', 'envoys (MOFA)'), ('2010', 'Cool Japan', 'office in METI'),
      ('2012', 'Minister for', 'Cool Japan'), ('2013', 'Cool Japan Fund', '¥37.5 bn'), ('2019', 'Cabinet Office', 'review'), ('2023', 'anime: overseas', '> domestic'),
      ('2024', 'New Cool Japan', 'Strategy'), ('2033', 'target: ¥20 tn', 'overseas revenue')]
b = text(500, 32, 'Cool Japan: from a magazine article to national strategy', 19, 700)
b += f'<line x1="40" y1="120" x2="960" y2="120" stroke="{LINE}" stroke-width="4"/>'
for i, (d, a, c) in enumerate(ev):
    x = 75 + i * 94; col = WARM if d == '2033' else ACC
    b += f'<circle cx="{x}" cy="120" r="7" fill="{col}"/>'
    if i % 2 == 0: b += text(x, 98, d, 14, 700, fill=col) + lines(x, 58, [a, c], 11.5, fill=SOFT, gap=14)
    else: b += text(x, 150, d, 14, 700, fill=col) + lines(x, 172, [a, c], 11.5, fill=SOFT, gap=14)
page('dia-cooljapan.svg', 1000, 200, 'Timeline of Cool Japan',
     'METI’s content division (2001), McGray’s “Gross National Cool” (2002), pop culture envoys (2009), the Cool Japan office (2010), a minister for Cool Japan (2012), the Cool Japan Fund with 37.5 billion yen (2013), the Cabinet Office review (2019), overseas anime revenue overtaking domestic (2023), the New Cool Japan Strategy (2024) and its target of 20 trillion yen in overseas content revenue by 2033.', b)
