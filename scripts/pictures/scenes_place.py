# Scenes: where things are (positions) and finding the way (directions).
from lib import *

BOX, BOX_T, BOX_S = '#d9a066', '#e8b984', '#b98448'
BALL = '#e0533d'
WOOD, WOOD2 = '#c8925a', '#a8743f'

def cube(x, y, s=60, open_top=False):
    """A cardboard box: front face at (x, y), size s, with depth to the upper right."""
    d = s * 0.4
    p = poly([(x, y), (x + d, y - d), (x + s + d, y - d), (x + s, y)], '#6b4a2a' if open_top else BOX_T)
    p += poly([(x + s, y), (x + s + d, y - d), (x + s + d, y + s - d), (x + s, y + s)], BOX_S)
    return p

def cube_front(x, y, s=60, op=None):
    return rect(x, y, s, s, BOX, op=op)

def ball(cx, cy, r=14):
    return circ(cx, cy, r, BALL) + ell(cx - r * 0.35, cy - r * 0.4, r * 0.3, r * 0.18, '#f6a493', None)

def table(x, y, w=110):
    return rect(x, y, w, 10, WOOD) + rect(x + 8, y + 10, 9, 52, WOOD2, sw=1.6) + rect(x + w - 17, y + 10, 9, 52, WOOD2, sw=1.6)

def panel(col, row, inner):
    x, y = 14 + col * 196, 14 + row * 176
    return rect(x, y, 184, 164, '#fffdf8', '#d6cfc2', 1.5, r=14) + line(x + 16, y + 128, x + 168, y + 128, '#cfc6b6', 2) + g(inner, tf=f'translate({x},{y})')

# ---------- positions: 12 panels, the same box or table and a red ball ----------
P = []
def add(iid, ja, kana, ro, en, col, row, inner):
    x, y = 14 + col * 196, 14 + row * 176
    P.append(it(iid, ja, kana, ro, en, panel(col, row, inner), (x + 92, y + 148)))

add('ue', '上', 'うえ', 'ue', 'on, above', 0, 0, table(37, 66) + ball(92, 52))
add('shita', '下', 'した', 'shita', 'under, below', 1, 0, table(37, 66) + ball(92, 112))
add('naka', '中', 'なか', 'naka', 'inside, in', 2, 0, cube(62, 70, 60, True) + ball(92, 98, 13) + cube_front(62, 70, 60, op=0.55) + rect(62, 70, 60, 60, 'none'))
add('soto', '外', 'そと', 'soto', 'outside', 3, 0, cube(86, 70, 60, True) + cube_front(86, 70, 60) + ball(46, 116))
add('mae', '前', 'まえ', 'mae', 'in front of', 0, 1, cube(62, 58) + cube_front(62, 58) + ball(96, 112, 15))
add('ushiro', '後ろ', 'うしろ', 'ushiro', 'behind', 1, 1, ball(108, 34, 14) + cube(62, 66) + cube_front(62, 66))
add('migi', '右', 'みぎ', 'migi', 'right (of)', 2, 1, cube(46, 70) + cube_front(46, 70) + ball(148, 116) + arrow(120, 40, 160, 40, '#9aa3ad', 5, 12))
add('hidari', '左', 'ひだり', 'hidari', 'left (of)', 3, 1, cube(92, 70) + cube_front(92, 70) + ball(40, 116) + arrow(66, 40, 26, 40, '#9aa3ad', 5, 12))
add('aida', '間', 'あいだ', 'aida', 'between', 0, 2, cube(20, 80, 46) + cube_front(20, 80, 46) + cube(112, 80, 46) + cube_front(112, 80, 46) + ball(92, 116))
add('yoko', '横', 'よこ', 'yoko', 'beside, next to', 1, 2, cube(56, 70) + cube_front(56, 70) + ball(132, 116) + ball(32, 116) )
add('chikaku', '近く', 'ちかく', 'chikaku', 'near', 2, 2, cube(70, 70) + cube_front(70, 70) + ball(52, 116, 13))
add('tooku', '遠く', 'とおく', 'tōku', 'far (away)', 3, 2, cube(18, 70) + cube_front(18, 70) + ball(162, 104, 7) + line(100, 112, 150, 108, '#9aa3ad', 2, '4 5'))
scene('positions', '位置', 'Where things are: the same box or table and a red ball in twelve positions', 800, 540, '', P)

# ---------- directions: an intersection seen from above ----------
ROAD, WALK, GRASS = '#9da3ab', '#e3ded3', '#d5e8c4'
bg = rect(0, 0, 800, 560, GRASS, None)
bg += rect(0, 210, 800, 140, WALK, None) + rect(310, 0, 180, 560, WALK, None)
bg += rect(0, 230, 800, 100, ROAD, None) + rect(330, 0, 140, 560, ROAD, None)
for x in list(range(10, 300, 60)) + list(range(500, 800, 60)):
    bg += rect(x, 278, 34, 4, '#ffffff', None)
for y in list(range(10, 200, 60)) + list(range(370, 560, 60)):
    bg += rect(398, y, 4, 34, '#ffffff', None)
bg += rect(20, 30, 250, 160, '#e9e2d0', INK, 1.6, r=6) + rect(40, 50, 60, 50, '#cfe0ef', None) + rect(120, 50, 60, 50, '#cfe0ef', None)
bg += rect(20, 380, 250, 160, '#efe6d6', INK, 1.6, r=6) + tree(160, 520, 0.9)
D = []
D.append(it('koosaten', '交差点', 'こうさてん', 'kōsaten', 'intersection, crossing',
            rect(330, 230, 140, 100, '#8d939b', None) + rect(336, 236, 128, 88, 'none', '#ffffff', 2, r=4), (400, 262)))
cw = ''.join(rect(x, 340, 14, 26, '#ffffff', None) for x in range(336, 466, 22))
D.append(it('oodanhodoo', '横断歩道', 'おうだんほどう', 'ōdan hodō', 'pedestrian crossing', rect(330, 336, 140, 34, '#9da3ab', None) + cw, (400, 357)))
sig = rect(486, 356, 10, 80, '#4a4f57', sw=1.4) + rect(474, 300, 34, 62, '#2f3338', r=6) + circ(491, 316, 9, '#e0533d', sw=1) + circ(491, 345, 9, '#57b36a', sw=1)
D.append(it('shingoo', '信号', 'しんごう', 'shingō', 'traffic light', sig, (540, 318)))
corner = rect(520, 20, 260, 180, '#f2d7a6', INK, 2, r=6) + rect(520, 20, 260, 34, '#e0533d', INK, 2, r=6) + rect(540, 80, 70, 100, '#cfe0ef') + rect(630, 80, 60, 60, '#cfe0ef') + rect(700, 80, 60, 60, '#cfe0ef')
D.append(it('kado', '角', 'かど', 'kado', 'corner', corner + circ(520, 200, 12, '#ffd34d'), (650, 170)))
D.append(it('michi', '道', 'みち', 'michi', 'road, street, way', rect(30, 238, 260, 34, ROAD, None) + line(40, 255, 280, 255, '#c7ccd2', 3, '18 14'), (150, 300)))
me = circ(400, 500, 16, '#4c7fd1') + circ(400, 474, 10, '#f2c9a0')
D.append(it('massugu', 'まっすぐ', 'まっすぐ', 'massugu', 'straight on', arrow(420, 455, 420, 120, '#2f7d4f', 9, 22), (430, 92)))
D.append(it('migi-magaru', '右に曲がる', 'みぎにまがる', 'migi ni magaru', 'turn right', path('M380,450 L380,300 Q380,280 400,280 L560,280', 'none', '#c0392b', 8) + arrow(540, 280, 600, 280, '#c0392b', 8, 22), (640, 250)))
D.append(it('hidari-magaru', '左に曲がる', 'ひだりにまがる', 'hidari ni magaru', 'turn left', path('M360,450 L360,320 Q360,300 340,300 L230,300', 'none', '#7b4b94', 8) + arrow(250, 300, 190, 300, '#7b4b94', 8, 22), (150, 340)))
D.append(it('modoru', '戻る', 'もどる', 'modoru', 'go back', path('M445,470 L445,420 Q445,395 470,395 Q495,395 495,420 L495,500', 'none', '#b07a1a', 7) + arrow(495, 490, 495, 540, '#b07a1a', 7, 18) + me, (560, 520)))
comp = circ(700, 470, 46, '#ffffff', INK, 2)
D.append(it('kita', '北', 'きた', 'kita', 'north', comp + poly([(700, 418), (690, 468), (710, 468)], '#c0392b', INK, 1.4), (700, 404)))
D.append(it('minami', '南', 'みなみ', 'minami', 'south', poly([(700, 522), (690, 472), (710, 472)], '#9aa3ad', INK, 1.4), (700, 540)))
D.append(it('higashi', '東', 'ひがし', 'higashi', 'east', poly([(752, 470), (702, 460), (702, 480)], '#9aa3ad', INK, 1.4), (775, 470)))
D.append(it('nishi', '西', 'にし', 'nishi', 'west', poly([(648, 470), (698, 460), (698, 480)], '#9aa3ad', INK, 1.4), (625, 470)))
scene('directions', '道案内', 'Finding the way: an intersection seen from above, with arrows for straight on, right, left and back, and a compass', 800, 560, bg, D)
