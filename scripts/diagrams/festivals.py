# Draws the explanatory diagrams of the festivals handbook (festivals/img/dia-*.svg).
# Every label restates a fact or figure cited in the chapter that uses the diagram.
# Run from the repository root:  python3 scripts/diagrams/festivals.py
import math, os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'festivals', 'img')
os.makedirs(OUT, exist_ok=True)
FONT = "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
INK, SOFT, ACC, ACC2, WARM, WARM2, LINE = '#222', '#555', '#b3412f', '#fbe7e2', '#2d6a4f', '#e3f1e8', '#bbb'

def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
def text(x, y, s, size=15, weight=400, anchor='middle', fill=INK, italic=False):
    st = 'font-style:italic;' if italic else ''
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" style="{FONT};{st}font-size:{size}px;font-weight:{weight}" fill="{fill}">{esc(s)}</text>'
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

MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

# 1. The year (start page): events by month, from the chapters.
ev = {0: ['New Year (1–3)', 'seven herbs (7)', 'mirror cakes (11)', 'little New Year (15)'],
      1: ['setsubun (3)', 'risshun (4)', 'Snow Festival'],
      2: ['Girls’ Festival (3)', 'spring higan', 'cherry blossom'],
      3: ['cherry blossom', 'moves north', 'Golden Week'],
      4: ['Children’s Day (5)', 'Aoi Matsuri (15)', 'Kanda (odd years)'],
      5: ['Sannō (even years)', 'rainy season'],
      6: ['Tanabata (7)', 'Gion Matsuri', 'Tenjin (24–25)', 'fireworks'],
      7: ['Nebuta (2–7)', 'Sendai Tanabata', 'Bon (13–16)', 'Awa Odori'],
      8: ['chrysanthemum (9)', 'harvest moon', 'autumn higan'],
      9: ['harvest moon', 'Jidai Matsuri (22)', 'red leaves begin'],
      10: ['Culture Day (3)', 'Shichi-Go-San (15)', 'red leaves'],
      11: ['red leaves', 'winter solstice', 'New Year’s Eve (31)']}
W, H = 1000, 380
b = text(W / 2, 30, 'A year of Japanese festivals and seasons', 19, 700)
# winter Dec–Feb, spring Mar–May, summer Jun–Aug, autumn Sep–Nov
season = ['#e4ecf7', '#e4ecf7', WARM2, WARM2, WARM2, '#fdf1d8', '#fdf1d8', '#fdf1d8', ACC2, ACC2, ACC2, '#e4ecf7']
for i, m in enumerate(MONTHS):
    x = 12 + (i % 6) * 164; y = 48 + (i // 6) * 160
    b += box(x, y, 156, 150, season[i], '#ccc', 8, sw=1) + text(x + 78, y + 24, m, 16, 700)
    b += lines(x + 78, y + 50, ev[i], 12.5, fill=INK, gap=19)
for k, (lab, col) in enumerate([('winter', '#e4ecf7'), ('spring', WARM2), ('summer', '#fdf1d8'), ('autumn', ACC2)]):
    x = 300 + k * 110
    b += f'<rect x="{x}" y="362" width="16" height="12" rx="2" fill="{col}" stroke="#ccc"/>' + text(x + 22, 372, lab, 12, anchor='start', fill=SOFT)
page('dia-year.svg', W, H, 'A year of Japanese festivals and seasons',
     'Month by month: New Year, seven-herb porridge and the little New Year in January; setsubun and the Snow Festival in February; the Girls’ Festival and cherry blossom in March and April; Golden Week, Children’s Day and the Aoi and Kanda festivals in May; Sannō in June; Tanabata, Gion, Tenjin and fireworks in July; Nebuta, Sendai Tanabata, Bon and Awa Odori in August; the harvest moon and higan in September; the Jidai Matsuri and red leaves in October; Shichi-Go-San in November; the solstice and New Year’s Eve in December.', b)

# 2. The calendar switch (Chapter 1) — NDL 2016a/b.
W, H = 820, 210
b = text(W / 2, 30, 'The switch to the solar calendar', 19, 700)
b += box(30, 60, 300, 90, '#f4f4f4', '#777') + lines(180, 92, ['Meiji 5 (1872)', '12th month, 2nd day', 'last day of the old calendar'], 14, fill=INK, gap=20)
b += arrow(340, 105, 478, 105, ACC, 3)
b += text(409, 92, 'next day', 12.5, 600, fill=ACC)
b += box(490, 60, 300, 90, ACC2, ACC) + lines(640, 92, ['Meiji 6 (1873)', '1 January', 'first day of the solar calendar'], 14, 700, fill=ACC, gap=20)
b += text(W / 2, 185, 'The 3rd day of the 12th month of Meiji 5 became 1 January of Meiji 6: the rest of the old 12th month was skipped.', 13, fill=SOFT)
page('dia-calendar-switch.svg', W, H, 'The calendar switch of 1872–1873',
     'The second day of the twelfth month of Meiji 5 (1872) was the last day of the old calendar. The next day, which would have been the third day of the twelfth month, became 1 January of Meiji 6 (1873), the first day of the solar calendar.', b)

# 3. The 24 solar terms (Chapter 2) — NDL 2016b dates, NAOJ solar longitude.
terms = [('risshun', '立春', '4 Feb', 315), ('usui', '雨水', '19 Feb', 330), ('keichitsu', '啓蟄', '5 Mar', 345), ('shunbun', '春分', '21 Mar', 0),
         ('seimei', '清明', '5 Apr', 15), ('kokuu', '穀雨', '20 Apr', 30), ('rikka', '立夏', '5 May', 45), ('shōman', '小満', '21 May', 60),
         ('bōshu', '芒種', '6 Jun', 75), ('geshi', '夏至', '21 Jun', 90), ('shōsho', '小暑', '7 Jul', 105), ('taisho', '大暑', '23 Jul', 120),
         ('risshū', '立秋', '8 Aug', 135), ('shosho', '処暑', '23 Aug', 150), ('hakuro', '白露', '8 Sep', 165), ('shūbun', '秋分', '23 Sep', 180),
         ('kanro', '寒露', '8 Oct', 195), ('sōkō', '霜降', '24 Oct', 210), ('rittō', '立冬', '7 Nov', 225), ('shōsetsu', '小雪', '22 Nov', 240),
         ('taisetsu', '大雪', '7 Dec', 255), ('tōji', '冬至', '21 Dec', 270), ('shōkan', '小寒', '5 Jan', 285), ('daikan', '大寒', '21 Jan', 300)]
W, H, cx, cy, R = 760, 760, 380, 395, 250
b = text(W / 2, 34, 'The 24 solar terms', 20, 700)
cols = {0: WARM, 1: ACC, 2: '#a0522d', 3: '#2d5f9a'}  # spring, summer, autumn, winter
for i, (ro, ja, d, lon) in enumerate(terms):
    a = math.radians(-90 + i * 15)
    a0, a1 = math.radians(-97.5 + i * 15), math.radians(-82.5 + i * 15)
    col = cols[i // 6]
    p0 = (cx + 150 * math.cos(a0), cy + 150 * math.sin(a0)); p1 = (cx + R * math.cos(a0), cy + R * math.sin(a0))
    p2 = (cx + R * math.cos(a1), cy + R * math.sin(a1)); p3 = (cx + 150 * math.cos(a1), cy + 150 * math.sin(a1))
    fill = ['#e3f1e8', '#fbe7e2', '#f6e7da', '#e4ecf7'][i // 6]
    b += f'<path d="M{p0[0]:.1f},{p0[1]:.1f} L{p1[0]:.1f},{p1[1]:.1f} A{R},{R} 0 0 1 {p2[0]:.1f},{p2[1]:.1f} L{p3[0]:.1f},{p3[1]:.1f} A150,150 0 0 0 {p0[0]:.1f},{p0[1]:.1f} z" fill="{fill}" stroke="#fff" stroke-width="2"/>'
    tx, ty = cx + 200 * math.cos(a), cy + 200 * math.sin(a)
    b += text(tx, ty - 6, ja, 15, 700, fill=col) + text(tx, ty + 10, ro, 10.5, fill=INK) + text(tx, ty + 23, d, 10, fill=SOFT)
    ox, oy = cx + (R + 18) * math.cos(a), cy + (R + 18) * math.sin(a)
    b += text(ox, oy + 4, f'{lon}°', 10.5, fill=SOFT)
for k, (lab, ang) in enumerate([('SPRING', -52.5), ('SUMMER', 37.5), ('AUTUMN', 127.5), ('WINTER', 217.5)]):
    a = math.radians(ang)
    b += text(cx + 110 * math.cos(a), cy + 110 * math.sin(a) + 5, lab, 13, 700, fill=cols[k])
b += text(cx, cy - 6, 'Sun’s longitude', 12, fill=SOFT) + text(cx, cy + 12, 'in steps of 15°', 12, fill=SOFT)
b += text(W / 2, H - 12, 'Dates are approximate and move by about a day from year to year.', 12, fill=SOFT)
page('dia-sekki.svg', W, H, 'The 24 solar terms',
     'The year divided into 24 solar terms at 15-degree steps of the Sun’s longitude, starting with risshun (beginning of spring, about 4 February, 315 degrees), through shunbun (spring equinox, 21 March, 0 degrees), geshi (summer solstice, 21 June), shūbun (autumn equinox, 23 September, 180 degrees) and tōji (winter solstice, 21 December), to daikan (great cold, 21 January).', b)

# 4. Rokuyō (Chapter 2) — NDL 2016c.
ro = [('先勝', 'senshō', ['morning lucky,', 'afternoon unlucky']), ('友引', 'tomobiki', ['good for celebrations,', 'funerals avoided']),
      ('先負', 'senbu', ['morning unlucky,', 'afternoon lucky']), ('仏滅', 'butsumetsu', ['unlucky for', 'everything']),
      ('大安', 'taian', ['lucky for everything,', 'esp. weddings']), ('赤口', 'shakkō', ['unlucky;', 'noon is lucky'])]
W, H = 960, 200
b = text(W / 2, 30, 'Rokuyō: the six-day cycle', 19, 700)
for i, (ja, r, m) in enumerate(ro):
    x = 20 + i * 158
    good = r in ('taian',); bad = r in ('butsumetsu', 'shakkō')
    b += box(x, 50, 138, 120, WARM2 if good else ('#f4f4f4' if bad else '#fff'), WARM if good else ('#777' if bad else ACC), 10)
    b += text(x + 69, 84, ja, 22, 700, fill=WARM if good else INK) + text(x + 69, 104, r, 13, 600, fill=SOFT) + lines(x + 69, 128, m, 12, gap=16)
    if i < 5: b += arrow(x + 140, 110, x + 156, 110, LINE, 1.6)
b += text(W / 2, 190, 'Then the cycle starts again. Meanings vary; these are the usual ones.', 12, fill=SOFT)
page('dia-rokuyo.svg', W, H, 'The six days of rokuyō',
     'The six days in order: senshō (morning lucky, afternoon unlucky), tomobiki (good for celebrations, funerals avoided), senbu (morning unlucky, afternoon lucky), butsumetsu (unlucky for everything), taian (lucky for everything, especially weddings) and shakkō (unlucky, noon is lucky).', b)

# 5. Holidays of 2026 (Chapter 3) — Cabinet Office 2026a.
import datetime as dt
hol = {(1, 1): 'h', (1, 12): 'h', (2, 11): 'h', (2, 23): 'h', (3, 20): 'h', (4, 29): 'h', (5, 3): 'h', (5, 4): 'h', (5, 5): 'h', (5, 6): 'x',
       (7, 20): 'h', (8, 11): 'h', (9, 21): 'h', (9, 22): 'x', (9, 23): 'h', (10, 12): 'h', (11, 3): 'h', (11, 23): 'h'}
W, H = 1000, 352
b = text(W / 2, 30, 'National holidays and days off, 2026', 19, 700)
for m in range(12):
    y = 52 + m * 22
    b += text(48, y + 14, MONTHS[m], 12.5, 700, 'end')
    d = dt.date(2026, m + 1, 1)
    while d.month == m + 1:
        x = 56 + (d.day - 1) * 30
        k = hol.get((d.month, d.day)); wk = d.weekday() >= 5
        fill = ACC if k == 'h' else (WARM if k == 'x' else ('#ddd' if wk else '#f6f6f6'))
        b += f'<rect x="{x}" y="{y}" width="27" height="18" rx="3" fill="{fill}"/>'
        if k: b += text(x + 13.5, y + 13.5, str(d.day), 10.5, 700, fill='#fff')
        d += dt.timedelta(days=1)
y = 52 + 12 * 22 + 14
b += f'<rect x="56" y="{y}" width="18" height="12" rx="2" fill="{ACC}"/>' + text(80, y + 10, 'national holiday', 12, anchor='start')
b += f'<rect x="220" y="{y}" width="18" height="12" rx="2" fill="{WARM}"/>' + text(244, y + 10, 'substitute or sandwich holiday', 12, anchor='start')
b += f'<rect x="470" y="{y}" width="18" height="12" rx="2" fill="#ddd"/>' + text(494, y + 10, 'Saturday or Sunday', 12, anchor='start')
page('dia-holidays.svg', W, H, 'National holidays of 2026',
     'A strip calendar of 2026. National holidays: 1 and 12 January, 11 and 23 February, 20 March, 29 April, 3, 4 and 5 May, 20 July, 11 August, 21 and 23 September, 12 October, 3 and 23 November. Extra days off: 6 May (substitute) and 22 September (sandwiched). With weekends, they make long breaks in early May and late September.', b)

# 6. Cherry blossom by city (Chapter 6) — JMA 2026a/b normals 1991–2020.
cities = [('Naha*', (1, 16), (2, 4)), ('Fukuoka', (3, 22), (3, 31)), ('Tokyo', (3, 24), (3, 31)), ('Kyoto', (3, 26), (4, 4)),
          ('Osaka', (3, 27), (4, 4)), ('Sendai', (4, 8), (4, 13)), ('Sapporo', (5, 1), (5, 6))]
W, H = 900, 340
b = text(W / 2, 30, 'Cherry blossom: normal opening and full-bloom dates', 19, 700)
def doy(md): return (dt.date(2026, *md) - dt.date(2026, 1, 1)).days
x0, x1 = 120, 870; d0, d1 = 0, doy((5, 20))
X = lambda d: x0 + (d - d0) / (d1 - d0) * (x1 - x0)
for mm in range(1, 6):
    xx = X(doy((mm, 1)))
    b += f'<line x1="{xx:.1f}" y1="52" x2="{xx:.1f}" y2="286" stroke="#eee" stroke-width="1"/>' + text(xx + 4, 300, MONTHS[mm - 1] + ' 1', 11, anchor='start', fill=SOFT)
for i, (c, o, f) in enumerate(cities):
    y = 62 + i * 32
    b += text(x0 - 10, y + 15, c, 13.5, 700, 'end')
    xa, xb = X(doy(o)), X(doy(f))
    b += f'<rect x="{xa:.1f}" y="{y + 3}" width="{max(xb - xa, 4):.1f}" height="16" rx="4" fill="#f3b6c3"/>'
    b += f'<circle cx="{xa:.1f}" cy="{y + 11}" r="5" fill="{ACC}"/><circle cx="{xb:.1f}" cy="{y + 11}" r="5" fill="#c2185b"/>'
    b += text(xb + 10, y + 15, f'{o[1]} {MONTHS[o[0]-1]} → {f[1]} {MONTHS[f[0]-1]}', 11.5, anchor='start', fill=SOFT)
b += f'<circle cx="200" cy="321" r="5" fill="{ACC}"/>' + text(210, 325, 'opening day', 11.5, anchor='start', fill=SOFT)
b += f'<circle cx="310" cy="321" r="5" fill="#c2185b"/>' + text(320, 325, 'full bloom', 11.5, anchor='start', fill=SOFT)
b += text(410, 325, '* Naha: hikan-zakura; elsewhere mainly Somei-yoshino. 1991–2020 normals.', 11.5, anchor='start', fill=SOFT)
page('dia-sakura.svg', W, H, 'Normal cherry-blossom dates by city',
     'Normal opening and full-bloom dates, 1991–2020: Naha 16 January to 4 February (hikan-zakura); Fukuoka 22 to 31 March; Tokyo 24 to 31 March; Kyoto 26 March to 4 April; Osaka 27 March to 4 April; Sendai 8 to 13 April; Sapporo 1 to 6 May.', b)

# 7. The pattern of a shrine festival (Chapter 9) — JNTO n.d.-a, Kyoto City 2019, Satō 2016.
W, H = 960, 264
b = text(W / 2, 30, 'The pattern of a shrine festival', 19, 700)
steps = [('Shrine', ['the kami’s', 'home'], '#f4f4f4', '#777'), ('Into the mikoshi', ['the kami is moved', 'into a portable shrine'], ACC2, ACC),
         ('Going out', ['shinkōsai: through the', 'parish, with floats'], ACC2, ACC), ('Otabisho', ['temporary', 'lodging'], WARM2, WARM),
         ('Return', ['kankōsai: round the', 'parish and back'], ACC2, ACC)]
for i, (h, r, f, s) in enumerate(steps):
    x = 20 + i * 188
    b += box(x, 70, 168, 110, f, s, 10) + text(x + 84, 104, h, 15, 700, fill=s) + lines(x + 84, 132, r, 12.5, gap=17)
    if i < 4: b += arrow(x + 170, 125, x + 186, 125, SOFT, 2)
b += f'<path d="M 860 186 C 860 240, 104 240, 104 186" fill="none" stroke="{SOFT}" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#ah)"/>'
b += text(W / 2, 252, 'back to the shrine', 12, fill=SOFT)
page('dia-matsuri.svg', W, H, 'The pattern of a shrine festival',
     'The kami is moved from the shrine into a mikoshi, goes out through the parish with the floats (shinkōsai), stays at a temporary lodging (otabisho), and is carried round the parish again and back to the shrine (kankōsai).', b)
