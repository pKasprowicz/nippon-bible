# Draws the explanatory diagrams of the railways handbook (railways/img/dia-*.svg).
# Every label restates a fact or figure cited in the chapter that uses the diagram.
# Run from the repository root:  python3 scripts/diagrams/railways.py
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'railways', 'img')
FONT = "font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"
INK, SOFT, ACC, ACC2, WARM, WARM2, LINE = '#222', '#555', '#2d5f9a', '#e4ecf7', '#b8412f', '#fbe7e2', '#bbb'

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

# 1. Timeline (start page)
ev = [('1872', 'Shinbashi–', 'Yokohama'), ('1906', 'main private', 'lines nationalised'), ('1910', 'Kobayashi’s', 'Takarazuka line'), ('1927', 'first subway:', 'Ueno–Asakusa'),
      ('1933', 'Osaka’s first', 'subway'), ('1949', 'JNR founded', ''), ('1964', 'Tōkaidō', 'Shinkansen'), ('1987', 'JNR split', 'into JR'),
      ('2004', 'Tokyo Metro', 'founded'), ('2013', 'IC cards work', 'nationwide'), ('2024', 'Shinkansen', 'to Tsuruga')]
b = text(500, 32, 'Japan’s railways: a timeline of this handbook', 19, 700)
b += f'<line x1="30" y1="120" x2="970" y2="120" stroke="{LINE}" stroke-width="4"/>'
for i, (d, a, c) in enumerate(ev):
    x = 64 + i * 87; col = WARM if i >= 7 else ACC
    b += f'<circle cx="{x}" cy="120" r="7" fill="{col}"/>'
    if i % 2 == 0: b += text(x, 98, d, 14, 700, fill=col) + lines(x, 58, [a, c], 11.5, fill=SOFT, gap=14)
    else: b += text(x, 150, d, 14, 700, fill=col) + lines(x, 172, [a, c], 11.5, fill=SOFT, gap=14)
page('dia-timeline.svg', 1000, 200, 'Timeline of Japan’s railways',
     'From the first railway between Shinbashi and Yokohama (1872), nationalisation (1906), the Takarazuka line (1910) and the first subways in Tokyo (1927) and Osaka (1933), through JNR (1949) and the Tōkaidō Shinkansen (1964), to the split of JNR into the JR companies (1987), Tokyo Metro (2004), nationwide IC cards (2013) and the Shinkansen to Tsuruga (2024).', b)

# 2. The JNR split, 1987 (Chapter 4) — MLIT reform documents.
W = 1000
b = text(W/2, 32, 'April 1987: Japanese National Railways is split up', 19, 700)
b += box(380, 52, 240, 64, '#f4f4f4', '#777') + lines(500, 78, ['JNR (1949–1987)', 'debt ¥37.1 trillion'], 15, 700, fill=INK, gap=20)
cos = ['JR Hokkaidō', 'JR East', 'JR Central', 'JR West', 'JR Shikoku', 'JR Kyūshū']
for i, c in enumerate(cos):
    x = 30 + i * 118; island = c in ('JR Hokkaidō', 'JR Shikoku', 'JR Kyūshū')
    b += box(x, 180, 110, 56, WARM2 if island else ACC2, WARM if island else ACC, 8) + text(x + 55, 213, c, 13.5, 700, fill=WARM if island else ACC)
    b += arrow(500, 118, x + 55, 178, LINE, 1.6)
b += text(384, 253, 'six passenger companies', 12.5, 600, fill=SOFT)
b += box(745, 180, 115, 56, '#fff', INK, 8) + lines(802, 204, ['JR Freight', 'one, nationwide'], 12.5, 700, gap=16) + arrow(500, 118, 802, 178, LINE, 1.6)
b += box(872, 180, 110, 56, '#f4f4f4', '#777', 8) + lines(927, 204, ['Settlement', 'Corporation'], 12.5, 700, fill=SOFT, gap=16) + arrow(500, 118, 927, 178, LINE, 1.6)
b += box(30, 266, 590, 70, ACC2, ACC, 8, True) + lines(325, 290, ['Honshū companies + JR Freight + Shinkansen Holding Corp.: ¥11.6 trillion of debt', 'Hokkaidō, Shikoku, Kyūshū: no debt, but ¥1.3 trillion stabilisation funds'], 13, fill=INK, gap=20)
b += box(640, 266, 342, 70, '#f4f4f4', '#777', 8, True) + lines(811, 290, ['¥25.5 trillion, to be repaid by', 'selling land and JR shares'], 13, fill=INK, gap=20)
page('dia-jnr-split.svg', W, 354, 'The division of JNR in 1987',
     'In April 1987 JNR, with debts of 37.1 trillion yen, was split into six regional passenger companies (Hokkaidō, East, Central, West, Shikoku and Kyūshū), one nationwide freight company and a settlement corporation. The Honshū companies, JR Freight and the Shinkansen holding corporation took 11.6 trillion yen of debt; the three island companies took none and received stabilisation funds; 25.5 trillion yen went to the settlement corporation.', b)

# 3. Tokyo–Shin-Osaka travel time (Chapter 3) — JR Central Fact Sheets 2025.
W, H = 800, 330
b = text(W/2, 30, 'Fastest Tōkaidō Shinkansen, Tokyo – Shin-Osaka', 19, 700)
rows = [('FY1964', 240, 'Series 0, 210 km/h'), ('FY1965', 190, ''), ('March 2025', 141, 'N700S, 285 km/h')]
for i, (yr, mins, note) in enumerate(rows):
    y = 70 + i * 80; w = mins * 2.0
    b += text(120, y + 30, yr, 15, 700, 'end') + f'<rect x="135" y="{y}" width="{w}" height="44" rx="6" fill="{ACC if i < 2 else WARM}"/>'
    b += text(135 + w - 12, y + 29, f'{mins // 60} h {mins % 60:02d} min', 15, 700, 'end', '#fff') + text(135 + w + 12, y + 29, note, 13, anchor='start', fill=SOFT)
page('dia-shinkansen.svg', W, H, 'Tokyo–Shin-Osaka travel times',
     'The fastest train from Tokyo to Shin-Osaka took 4 hours in fiscal 1964 with Series 0 trains at 210 km/h, 3 hours 10 minutes in fiscal 1965, and 2 hours 21 minutes in March 2025 with trains at 285 km/h.', b)

# 4. How a JR ticket is built (Chapter 9) — JR West FAQ.
W = 900
b = text(W/2, 32, 'What you pay for a JR limited express or Shinkansen', 19, 700)
parts = [('乗車券', 'basic fare ticket', 'by distance: always needed', ACC2, ACC),
         ('特急券', 'limited express ticket', 'reserved or non-reserved seat', WARM2, WARM),
         ('グリーン券 / 寝台券', 'Green car / sleeper', 'optional upgrade', '#fff', INK)]
x = 30
for i, (ja, en, d, f, s) in enumerate(parts):
    b += box(x, 60, 260, 120, f, s, 12) + text(x + 130, 98, ja, 20, 700, fill=s) + text(x + 130, 128, en, 15, 700) + text(x + 130, 154, d, 13, fill=SOFT)
    if i < 2: b += text(x + 280, 128, '+', 30, 700, fill=SOFT)
    x += 300
b += lines(W/2, 212, ['Local and rapid trains need only the basic fare ticket.', 'Children aged 6 to 11 pay half, but Green and sleeper charges are the same as for adults.'], 13.5, fill=SOFT)
page('dia-ticket.svg', W, 250, 'The parts of a JR fare',
     'A limited express or Shinkansen journey needs a basic fare ticket (乗車券), charged by distance, plus a limited express ticket (特急券) for a reserved or non-reserved seat, plus optionally a Green car or sleeper ticket. Local and rapid trains need only the basic fare ticket. Children aged 6 to 11 pay half, except for Green and sleeper charges.', b)

# 5. Tokyo's subway compared (Chapter 6) — MLIT 2020 council document.
data = [('Tokyo Metro', 195.0, 755, WARM), ('Toei Subway', 109.0, 283, WARM), ('New York', 378.0, 473, ACC), ('London', 408.0, 379, ACC), ('Paris', 215.9, 422, ACC)]
W, H = 860, 400
b = text(W/2, 30, 'Route length and riders per day', 19, 700)
b += text(215, 62, 'route length (km)', 14, 700, fill=SOFT) + text(645, 62, 'riders per day (10,000s)', 14, 700, fill=SOFT)
for i, (n, km, r, col) in enumerate(data):
    y = 82 + i * 50
    b += text(W/2, y + 24, n, 14, 700)
    b += f'<rect x="{370 - km * 0.75}" y="{y + 6}" width="{km * 0.75}" height="26" rx="4" fill="{col}" opacity=".85"/>' + text(370 - km * 0.75 - 8, y + 25, f'{km:g}', 13, anchor='end')
    b += f'<rect x="490" y="{y + 6}" width="{r * 0.42}" height="26" rx="4" fill="{col}" opacity=".85"/>' + text(490 + r * 0.42 + 8, y + 25, f'{r}', 13, anchor='start')
b += text(W/2, H - 46, 'Tokyo Metro and Toei: 2019 · New York and Paris: 2017 · London: 2019', 12, fill=SOFT, italic=True)
b += text(W/2, H - 26, 'Source: MLIT Railway Bureau (2020), from Japan Subway Association data', 12, fill=SOFT, italic=True)
page('dia-subways.svg', W, H, 'Tokyo subways compared with New York, London and Paris',
     'Tokyo Metro has 195 km of route and 7.55 million riders a day (2019); Toei 109 km and 2.83 million. New York has 378 km and 4.73 million (2017), London 408 km and 3.79 million (2019), Paris 215.9 km and 4.22 million (2017).', b)

# 6. Local lines (Chapter 10) — MLIT 2023.
W, H = 760, 330
b = text(W/2, 30, 'JR passenger lines carrying fewer than 2,000 people a day', 18, 700)
b += text(W/2, 52, '(share of route length; “density” = average passengers per km per day)', 12.5, fill=SOFT)
for i, (yr, pct) in enumerate([('FY1987', 16), ('FY2019', 31), ('FY2020', 38)]):
    x = 150 + i * 200; h = pct * 4.6
    b += f'<rect x="{x}" y="{280 - h}" width="110" height="{h}" rx="6" fill="{WARM if i else ACC}"/>' + text(x + 55, 270 - h, f'{pct}%', 20, 700, fill=WARM if i else ACC) + text(x + 55, 304, yr, 14, 700)
page('dia-local.svg', W, H, 'Share of JR lines with low traffic',
     'The share of JR passenger companies’ route length with a traffic density below 2,000 passengers per day rose from 16 per cent in fiscal 1987 to 31 per cent in fiscal 2019 and 38 per cent in fiscal 2020.', b)

# 7. Freight CO2 (Chapter 11) — MLIT 2025.
W, H = 760, 260
b = text(W/2, 30, 'CO₂ to carry one tonne one kilometre (fiscal 2023)', 18, 700)
for i, (n, g, col) in enumerate([('commercial truck', 207, '#888'), ('coastal ship', 42, ACC), ('freight train', 19, WARM)]):
    y = 62 + i * 56
    b += text(180, y + 27, n, 15, 700, 'end') + f'<rect x="195" y="{y}" width="{g * 2.2}" height="38" rx="6" fill="{col}"/>' + text(195 + g * 2.2 + 10, y + 26, f'{g} g', 15, 700, 'start')
b += text(W/2, H - 18, 'One freight train carries up to 650 tonnes: 65 ten-tonne trucks.', 13.5, 600, fill=SOFT)
page('dia-freight.svg', W, H, 'Carbon dioxide per tonne-kilometre',
     'In fiscal 2023 a commercial truck emitted 207 g of CO2 per tonne-kilometre, a coastal ship 42 g and a freight train 19 g, about one eleventh of the truck. One freight train carries up to 650 tonnes, the load of 65 ten-tonne trucks.', b)
