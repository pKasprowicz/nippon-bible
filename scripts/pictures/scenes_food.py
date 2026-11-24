# Scenes: a set meal tray, a bowl of ramen, a sushi counter, and tastes.
import math
from lib import *

WOOD, WOOD2, LACQ = '#c8925a', '#a8743f', '#7a2a22'

def wavy(x0, y0, x1, amp, n, col, sw):
    pts, steps = [], 24
    for k in range(steps + 1):
        x = x0 + (x1 - x0) * k / steps
        pts.append(f'{x:.1f},{y0 + amp * math.sin(k / steps * n * 2 * math.pi):.1f}')
    return f'<polyline points="{" ".join(pts)}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>'

# ---------- set meal (teishoku), from above ----------
bg = rect(0, 0, 800, 520, '#efe4d0', None)
T = []
T.append(it('obon', 'お盆', 'おぼん', 'obon', 'tray', rect(110, 50, 560, 410, WOOD, r=22) + rect(126, 66, 528, 378, '#d6a26a', None, r=14), (390, 80)))
T.append(it('chawan', '茶碗', 'ちゃわん', 'chawan', 'rice bowl', circ(240, 330, 76, '#e9e1cf') + circ(240, 330, 76, 'none', '#3c5a8a', 5), (150, 270)))
grains = ''.join(ell(240 + 40 * math.cos(a) * r, 330 + 40 * math.sin(a) * r, 5, 3, '#ffffff', '#e6e0d2', 0.8, rot=int(a * 57)) for a in [0.3, 1.2, 2.0, 2.9, 3.8, 4.6, 5.5] for r in (0.4, 0.85))
T.append(it('gohan', 'ご飯', 'ごはん', 'gohan', 'cooked rice; a meal', circ(240, 330, 60, '#fdfcf7', '#d9d3c4', 1.5) + grains, (240, 330)))
soup = circ(420, 330, 72, LACQ) + circ(420, 330, 60, '#b8833f', None) + rect(395, 305, 14, 14, '#fbf5e6', '#d9cfb8', 1) + rect(430, 335, 14, 14, '#fbf5e6', '#d9cfb8', 1) + path('M390,345 q10,-12 22,0 q10,12 22,0', 'none', '#3d6b35', 5) + circ(450, 310, 5, '#6aa84f', None) + circ(405, 360, 5, '#6aa84f', None)
T.append(it('misoshiru', '味噌汁', 'みそしる', 'misoshiru', 'miso soup', soup, (420, 254)))
T.append(it('sara', '皿', 'さら', 'sara', 'plate, dish', ell(500, 170, 140, 72, '#ffffff') + ell(500, 170, 140, 72, 'none', '#6f8fbf', 4), (360, 170)))
fish = path('M410,170 Q470,120 560,160 L600,135 L592,170 L600,205 L560,180 Q470,220 410,170z', '#c98a4b') + circ(428, 164, 4, INK, None) + ''.join(line(460 + k * 22, 152, 452 + k * 22, 188, '#8a5a2b', 2) for k in range(4)) + ell(612, 205, 12, 7, '#e5e6d0', INK, 1.2)
T.append(it('yakizakana', '焼き魚', 'やきざかな', 'yakizakana', 'grilled fish', fish, (510, 118)))
pick = circ(250, 160, 46, '#ffffff') + path('M222,150 a14,14 0 1,0 28,0z', '#f2d24b', INK, 1.4) + path('M248,170 a14,14 0 1,0 28,0z', '#f2d24b', INK, 1.4) + circ(262, 142, 10, '#7fb069', INK, 1.4)
T.append(it('tsukemono', '漬物', 'つけもの', 'tsukemono', 'pickles', pick, (250, 228)))
T.append(it('yunomi', '湯呑み', 'ゆのみ', 'yunomi', 'teacup', circ(590, 330, 46, '#6b8e7b'), (590, 392)))
T.append(it('ocha', 'お茶', 'おちゃ', 'ocha', '(green) tea', circ(590, 330, 36, '#b6c25a', '#59704e', 1.5), (590, 330)))
T.append(it('hashioki', '箸置き', 'はしおき', 'hashioki', 'chopstick rest', rect(190, 410, 34, 16, '#9fc3d8', INK, 1.6, r=8), (207, 488)))
T.append(it('hashi', '箸', 'はし', 'hashi', 'chopsticks', rect(180, 404, 380, 7, '#8a5a3b', INK, 1.4, r=3) + rect(180, 418, 380, 7, '#8a5a3b', INK, 1.4, r=3), (480, 444)))
T.append(it('shooyu', '醤油', 'しょうゆ', 'shōyu', 'soy sauce', bottle(700, 300, 46, 110, '#5a2a1a', '#e0533d', '#f1e6cc'), (723, 330)))
T.append(it('oshibori', 'おしぼり', 'おしぼり', 'oshibori', 'wet hand towel', rect(690, 380, 80, 30, '#ffffff', INK, 1.8, r=14) + path('M700,388 q30,8 60,0', 'none', '#cfcfcf', 1.6), (730, 430)))
scene('teishoku', '定食', 'A set meal on a tray, seen from above', 800, 520, bg, T)

# ---------- ramen, from above ----------
bg = rect(0, 0, 800, 560, '#e9dfcf', None)
R = []
rim = circ(400, 280, 230, '#c0392b') + circ(400, 280, 214, 'none', '#f6e6c4', 6) + ''.join(rect(400 + 222 * math.cos(a) - 5, 280 + 222 * math.sin(a) - 5, 10, 10, '#f6e6c4', None) for a in [k * math.pi / 12 for k in range(24)])
R.append(it('donburi', '丼', 'どんぶり', 'donburi', 'large bowl', rim, (400, 36)))
R.append(it('suupu', 'スープ', 'スープ', 'sūpu', 'soup, broth', circ(400, 280, 200, '#d8a14f', '#a86f2a', 2) + circ(330, 210, 6, '#f1c27a', None) + circ(470, 380, 5, '#f1c27a', None), (520, 440)))
noodles = ''.join(wavy(250, 300 + k * 13, 470, 5, 4, '#f3dd8a', 5) for k in range(7))
R.append(it('men', '麺', 'めん', 'men', 'noodles', noodles + ''.join(wavy(250, 300 + k * 13, 470, 5, 4, '#c9ab55', 1) for k in range(7)), (360, 400)))
chashu = circ(300, 205, 50, '#d99a8a') + circ(300, 205, 50, 'none', '#7a3e2a', 6) + circ(345, 175, 42, '#d99a8a') + circ(345, 175, 42, 'none', '#7a3e2a', 6)
R.append(it('chaashuu', 'チャーシュー', 'チャーシュー', 'chāshū', 'sliced roast pork', chashu, (300, 140)))
egg = ell(500, 230, 46, 34, '#fbf6ea') + ell(500, 232, 24, 18, '#f0a030', '#c77a12', 1.4) + ell(520, 300, 40, 30, '#fbf6ea', rot=20) + ell(522, 302, 20, 15, '#f0a030', '#c77a12', 1.4)
R.append(it('nitamago', '煮卵', 'にたまご', 'nitamago', 'marinated soft-boiled egg', egg, (575, 245)))
R.append(it('negi', 'ネギ', 'ネギ', 'negi', 'spring onion', ''.join(circ(380 + dx, 250 + dy, 7, '#a7d47c', '#5d8f3a', 2) for dx, dy in [(0, 0), (20, 10), (-15, 20), (10, 28), (35, -8), (-30, -5)]), (395, 248)))
R.append(it('nori', '海苔', 'のり', 'nori', 'dried seaweed', rect(380, 88, 70, 96, '#26302a', INK, 1.6, r=3) + rect(440, 96, 70, 96, '#2f3b33', INK, 1.6, r=3), (445, 140)))
R.append(it('menma', 'メンマ', 'メンマ', 'menma', 'seasoned bamboo shoots', ''.join(rect(255 + k * 16, 340 + (k % 2) * 8, 12, 46, '#b07a3a', '#6f4a1e', 1.4, r=3) for k in range(5)), (255, 420)))
renge = ell(690, 400, 40, 30, '#ffffff', rot=-30) + rect(700, 300, 18, 90, '#ffffff', INK, 2, r=8)
R.append(it('renge', 'れんげ', 'れんげ', 'renge', 'Chinese soup spoon', renge, (700, 470)))
scene('ramen', 'ラーメン', 'A bowl of ramen seen from above, with its toppings', 800, 560, bg, R)

# ---------- sushi counter ----------
bg = rect(0, 0, 800, 520, '#f1e7d6', None) + rect(0, 0, 800, 240, '#e7d8bd', None) + rect(0, 228, 800, 12, '#a8743f', None)
S = []
S.append(it('itamae', '板前', 'いたまえ', 'itamae', 'sushi chef', person(400, 290, 1.25, '#ffffff', '#ffffff', hair='#2a2a2a', hat='#ffffff'), (480, 70)))
S.append(it('kauntaa', 'カウンター', 'カウンター', 'kauntā', 'counter', rect(0, 290, 800, 230, '#d9b07a', None) + rect(0, 290, 800, 18, '#b88a52', None), (100, 490)))
S.append(it('geta', '下駄', 'げた', 'geta', 'wooden serving board', rect(90, 340, 520, 90, '#e3c08f', INK, 2, r=6) + rect(120, 430, 30, 14, '#b88a52', INK, 1.6) + rect(550, 430, 30, 14, '#b88a52', INK, 1.6), (350, 470)))
def nigiri(cx, top, extra=''):
    return ell(cx, 400, 34, 18, '#fdfcf7') + top + extra
S.append(it('maguro', 'マグロ', 'マグロ', 'maguro', 'tuna', nigiri(150, ell(150, 388, 40, 16, '#c8354a')), (150, 322)))
salmon = ell(235, 388, 40, 16, '#f28c5a') + ''.join(line(218 + k * 12, 378, 226 + k * 12, 398, '#fde0cc', 2.4) for k in range(4))
S.append(it('saamon', 'サーモン', 'サーモン', 'sāmon', 'salmon', nigiri(235, salmon), (235, 322)))
ebi = ell(320, 388, 40, 15, '#fbe2cf') + ''.join(line(298 + k * 11, 378, 298 + k * 11, 398, '#f07a3a', 4) for k in range(5)) + poly([(358, 380), (372, 372), (366, 392)], '#e0533d', INK, 1.4)
S.append(it('ebi', 'エビ', 'エビ', 'ebi', 'shrimp, prawn', nigiri(320, ebi), (320, 322)))
S.append(it('ika', 'イカ', 'イカ', 'ika', 'squid', nigiri(405, ell(405, 388, 40, 16, '#f4f1ea') + line(380, 390, 430, 386, '#dcd5c6', 1.5)), (405, 322)))
S.append(it('tamago', '玉子', 'たまご', 'tamago', 'sweet omelette', nigiri(490, rect(452, 374, 76, 24, '#f6d04d', INK, 2, r=4) + rect(482, 372, 16, 46, '#26302a', INK, 1.4)), (490, 322)))
ikura = rect(540, 372, 56, 44, '#26302a', INK, 2, r=6) + ''.join(circ(548 + (k % 4) * 13, 372 + (k // 4) * 9, 6, '#f2662a', '#b3361a', 1) for k in range(8))
S.append(it('ikura', 'いくら', 'いくら', 'ikura', 'salmon roe', ikura, (568, 322)))
S.append(it('gari', 'ガリ', 'ガリ', 'gari', 'pickled ginger', ''.join(ell(650 + dx, 395 + dy, 20, 11, '#f7c3c3', '#d98b8b', 1.4, rot=dx) for dx, dy in [(0, 0), (8, -8), (-6, -12)]), (640, 460)))
S.append(it('wasabi', 'わさび', 'わさび', 'wasabi', 'wasabi', path('M684,408 q16,-38 36,0 z', '#9fcf6a'), (716, 430)))
S.append(it('shooyu-zara', '醤油皿', 'しょうゆざら', 'shōyu-zara', 'small dish for soy sauce', ell(720, 350, 40, 16, '#ffffff') + ell(720, 350, 30, 10, '#4a2414', None), (720, 322)))
scene('sushi', '寿司', 'A sushi counter: the chef, and pieces of sushi on a wooden board', 800, 520, bg, S)

# ---------- tastes ----------
def tile(col, row, inner):
    x, y = 14 + col * 196, 14 + row * 206
    return rect(x, y, 184, 194, '#fffdf8', '#d6cfc2', 1.5, r=14) + g(inner, tf=f'translate({x},{y})'), (x + 92, y + 176)
TS = []
def add(iid, ja, kana, ro, en, col, row, inner):
    svg, tag = tile(col, row, inner); TS.append(it(iid, ja, kana, ro, en, svg, tag))
add('amai', '甘い', 'あまい', 'amai', 'sweet', 0, 0, poly([(40, 80), (60, 60), (60, 100)], '#f4a9c0') + poly([(144, 80), (124, 60), (124, 100)], '#f4a9c0') + ell(92, 80, 36, 26, '#e86f9a') + path('M74,72 q18,-10 36,0', 'none', '#fbd1e0', 4))
add('karai', '辛い', 'からい', 'karai', 'hot, spicy', 1, 0, path('M60,50 Q140,40 130,120 Q120,150 90,140 Q120,110 100,70 Q90,58 60,62z', '#d8322a') + path('M56,56 q-10,-14 6,-22', 'none', '#3d7d36', 6))
add('shoppai', 'しょっぱい', 'しょっぱい', 'shoppai', 'salty', 2, 0, rect(66, 60, 52, 80, '#ffffff', r=10) + rect(70, 40, 44, 26, '#b8bec6', r=8) + ''.join(circ(80 + k * 8, 50, 2, INK, None) for k in range(4)) + ''.join(circ(140 + dx, 110 + dy, 3, '#ffffff', '#b8bec6', 1) for dx, dy in [(0, 0), (10, 12), (-4, 22)]))
add('suppai', '酸っぱい', 'すっぱい', 'suppai', 'sour', 3, 0, circ(92, 94, 50, '#f6d43c') + circ(92, 94, 40, '#fff4b8', '#e2bf2a', 2) + ''.join(line(92, 94, 92 + 38 * math.cos(k * math.pi / 4), 94 + 38 * math.sin(k * math.pi / 4), '#e2bf2a', 2) for k in range(8)))
add('nigai', '苦い', 'にがい', 'nigai', 'bitter', 0, 1, rect(58, 70, 60, 64, '#ffffff', r=8) + path('M118,84 q24,0 24,18 q0,18 -24,18', 'none', INK, 4) + ell(88, 72, 28, 7, '#4a2c1a') + ell(88, 140, 46, 8, '#ffffff'))
add('atsui', '熱い', 'あつい', 'atsui', 'hot (to the touch)', 1, 1, rect(56, 84, 72, 54, '#e0533d', r=10) + ''.join(path(f'M{x},74 q-10,-14 0,-28 q10,-14 0,-28', 'none', '#e57d6e', 4) for x in (74, 92, 110)))
add('tsumetai', '冷たい', 'つめたい', 'tsumetai', 'cold (to the touch)', 2, 1, poly([(60, 50), (124, 50), (116, 150), (68, 150)], '#d6ecfa') + rect(70, 66, 22, 22, '#ffffff', '#8ab8d8', 1.6, r=4) + rect(94, 84, 22, 22, '#ffffff', '#8ab8d8', 1.6, r=4) + rect(76, 104, 22, 22, '#ffffff', '#8ab8d8', 1.6, r=4))
add('oishii', 'おいしい', 'おいしい', 'oishii', 'delicious', 3, 1, circ(92, 96, 50, '#ffd34d') + path('M70,86 q8,-10 16,0', 'none', INK, 4) + path('M98,86 q8,-10 16,0', 'none', INK, 4) + path('M70,108 q22,26 44,0z', '#c0392b') + path('M108,116 q4,10 -6,14', 'none', '#e86f9a', 4))
scene('tastes', '味', 'Tastes and temperatures: eight pictures', 800, 426, '', TS)
