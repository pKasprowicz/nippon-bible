# Drawing helpers for the picture dictionary (pictures/img/*.svg).
# A scene is a background plus labelled items; each item is an SVG group that the app makes
# tappable. Coordinates are in the scene's viewBox units.
import math

INK = '#3b3631'
SW = 2.2  # default outline width

def _a(fill, stroke, sw, extra=''):
    s = f' fill="{fill}"'
    if stroke: s += f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"'
    return s + extra

def rect(x, y, w, h, fill, stroke=INK, sw=SW, r=0, op=None):
    o = f' opacity="{op}"' if op is not None else ''
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{r}"{_a(fill, stroke, sw, o)}/>'

def circ(cx, cy, r, fill, stroke=INK, sw=SW, op=None):
    o = f' opacity="{op}"' if op is not None else ''
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}"{_a(fill, stroke, sw, o)}/>'

def ell(cx, cy, rx, ry, fill, stroke=INK, sw=SW, rot=0, op=None):
    t = f' transform="rotate({rot} {cx:.1f} {cy:.1f})"' if rot else ''
    o = f' opacity="{op}"' if op is not None else ''
    return f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}"{_a(fill, stroke, sw, t + o)}/>'

def poly(pts, fill, stroke=INK, sw=SW, op=None):
    o = f' opacity="{op}"' if op is not None else ''
    return f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}"{_a(fill, stroke, sw, o)}/>'

def path(d, fill='none', stroke=INK, sw=SW, op=None):
    o = f' opacity="{op}"' if op is not None else ''
    return f'<path d="{d}"{_a(fill, stroke, sw, o)}/>'

def line(x1, y1, x2, y2, stroke=INK, sw=SW, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round"{d}/>'

def text(x, y, s, size=16, fill=INK, weight=700, anchor='middle', family="system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"):
    s = s.replace('&', '&amp;').replace('<', '&lt;')
    return f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{anchor}" font-family="{family}" font-size="{size}" font-weight="{weight}" fill="{fill}">{s}</text>'

def arrow(x1, y1, x2, y2, col, sw=7, head=16):
    """A thick arrow from (x1,y1) to (x2,y2)."""
    a = math.atan2(y2 - y1, x2 - x1)
    bx, by = x2 - head * math.cos(a), y2 - head * math.sin(a)
    l = line(x1, y1, bx, by, col, sw)
    p1 = (x2, y2)
    p2 = (bx + head * 0.7 * math.cos(a + math.pi / 2), by + head * 0.7 * math.sin(a + math.pi / 2))
    p3 = (bx + head * 0.7 * math.cos(a - math.pi / 2), by + head * 0.7 * math.sin(a - math.pi / 2))
    return l + poly([p1, p2, p3], col, col, 1)

def g(*parts, tf=None):
    t = f' transform="{tf}"' if tf else ''
    return f'<g{t}>' + ''.join(parts) + '</g>'

# ---------- reusable figures ----------
def person(cx, base, s=1.0, shirt='#5b8fc9', trousers='#3d4a5c', skin='#f2c9a0', hair='#3b2a20', apron=None, hat=None):
    """A standing person, front view; base = y of the feet."""
    h = 170 * s
    top = base - h
    p = ''
    p += rect(cx - 20 * s, base - 62 * s, 16 * s, 62 * s, trousers, sw=1.6)
    p += rect(cx + 4 * s, base - 62 * s, 16 * s, 62 * s, trousers, sw=1.6)
    p += rect(cx - 30 * s, top + 44 * s, 60 * s, 72 * s, shirt, r=12 * s)
    if apron: p += rect(cx - 22 * s, top + 70 * s, 44 * s, 52 * s, apron, sw=1.6, r=4)
    p += rect(cx - 42 * s, top + 48 * s, 13 * s, 58 * s, shirt, r=6 * s)
    p += rect(cx + 29 * s, top + 48 * s, 13 * s, 58 * s, shirt, r=6 * s)
    p += circ(cx - 35.5 * s, top + 110 * s, 7 * s, skin, sw=1.4) + circ(cx + 35.5 * s, top + 110 * s, 7 * s, skin, sw=1.4)
    p += circ(cx, top + 24 * s, 22 * s, skin)
    p += path(f'M{cx - 22 * s:.1f},{top + 22 * s:.1f} Q{cx:.1f},{top - 6 * s:.1f} {cx + 22 * s:.1f},{top + 22 * s:.1f} Q{cx:.1f},{top + 8 * s:.1f} {cx - 22 * s:.1f},{top + 22 * s:.1f}z', hair, sw=1.4)
    p += circ(cx - 8 * s, top + 26 * s, 2.2 * s, INK, None) + circ(cx + 8 * s, top + 26 * s, 2.2 * s, INK, None)
    p += path(f'M{cx - 6 * s:.1f},{top + 34 * s:.1f} Q{cx:.1f},{top + 39 * s:.1f} {cx + 6 * s:.1f},{top + 34 * s:.1f}', sw=1.6)
    if hat: p += rect(cx - 20 * s, top - 2 * s, 40 * s, 14 * s, hat, sw=1.6, r=4)
    return p

def bottle(x, base, w, h, body, cap, label=None):
    p = rect(x, base - h, w, h, body, r=w * 0.25)
    p += rect(x + w * 0.3, base - h - h * 0.22, w * 0.4, h * 0.25, body, sw=1.6)
    p += rect(x + w * 0.25, base - h - h * 0.32, w * 0.5, h * 0.12, cap, sw=1.6, r=2)
    if label: p += rect(x + 3, base - h * 0.65, w - 6, h * 0.3, label, sw=1.2)
    return p

def tree(cx, base, s=1.0, leaf='#7fb069'):
    return rect(cx - 6 * s, base - 40 * s, 12 * s, 40 * s, '#8a5a3b', sw=1.6) + circ(cx, base - 62 * s, 32 * s, leaf) + circ(cx - 22 * s, base - 48 * s, 20 * s, leaf, sw=0) + circ(cx + 22 * s, base - 48 * s, 20 * s, leaf, sw=0)

# ---------- scene registry ----------
SCENES = {}

def scene(sid, title, en, w, h, bg, items, note=''):
    """items: list of dicts with id, ja, kana, ro, en, svg, tag=(x, y)."""
    ids = [i['id'] for i in items]
    assert len(ids) == len(set(ids)), sid
    SCENES[sid] = dict(id=sid, title=title, en=en, w=w, h=h, bg=bg, items=items, note=note)

def it(iid, ja, kana, ro, en, svg, tag):
    return dict(id=iid, ja=ja, kana=kana, ro=ro, en=en, svg=svg, tag=tag)

def render(sc):
    w, h = sc['w'], sc['h']
    body = sc['bg'] + ''.join(f'<g class="pic-item" data-id="{i["id"]}">{i["svg"]}</g>' for i in sc['items'])
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" role="img" aria-label="{sc["en"]}">'
            f'<rect width="{w}" height="{h}" fill="#fbf7ee"/>{body}</svg>')
