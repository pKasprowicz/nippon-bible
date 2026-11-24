# Scenes: money, counting things, telling the time, and the days of the week.
import math
from lib import *

# ---------- money ----------
bg = rect(0, 0, 800, 500, '#f4efe4', None)
M = []
def coin(cx, cy, r, face, rim, hole=False):
    c = circ(cx, cy, r, face) + circ(cx, cy, r - 5, 'none', rim, 2)
    if hole: c += circ(cx, cy, r * 0.22, '#f4efe4')
    return c
coins = [('ichien', '1円玉', 'いちえんだま', 'ichien-dama', '1-yen coin', 40, '#e4e6e8', '#b8bec6', False),
         ('goen', '5円玉', 'ごえんだま', 'goen-dama', '5-yen coin', 44, '#e2b94f', '#b08a2a', True),
         ('juuen', '10円玉', 'じゅうえんだま', 'jūen-dama', '10-yen coin', 47, '#c07a4a', '#8a5030', False),
         ('gojuuen', '50円玉', 'ごじゅうえんだま', 'gojūen-dama', '50-yen coin', 42, '#d6dadf', '#9aa3ad', True),
         ('hyakuen', '100円玉', 'ひゃくえんだま', 'hyakuen-dama', '100-yen coin', 45, '#d6dadf', '#9aa3ad', False),
         ('gohyakuen', '500円玉', 'ごひゃくえんだま', 'gohyakuen-dama', '500-yen coin', 53, '#d9c27a', '#a8904a', False)]
x = 70
for iid, ja, kana, ro, en, r, f, rim, hole in coins:
    M.append(it(iid, ja, kana, ro, en, coin(x, 110, r, f, rim, hole), (x, 186)))
    x += r + 70
notes = [('senensatsu', '千円札', 'せんえんさつ', 'sen\'en-satsu', '1,000-yen note', '#9ec0e0', '1000'),
         ('gosenensatsu', '五千円札', 'ごせんえんさつ', 'gosen\'en-satsu', '5,000-yen note', '#c9b2dc', '5000'),
         ('ichimanensatsu', '一万円札', 'いちまんえんさつ', 'ichiman\'en-satsu', '10,000-yen note', '#d9b98f', '10000')]
for k, (iid, ja, kana, ro, en, col, num) in enumerate(notes):
    x0 = 30 + k * 250
    M.append(it(iid, ja, kana, ro, en, rect(x0, 240, 220, 110, col, INK, 2, r=6) + ell(x0 + 160, 295, 36, 40, '#ffffff', None, op=0.55) + text(x0 + 16, 336, num, 26, INK, 800, 'start'), (x0 + 110, 372)))
wallet = rect(60, 400, 170, 80, '#7a4a2a', INK, 2, r=12) + rect(60, 400, 170, 30, '#8f5a36', INK, 2, r=12) + circ(210, 430, 7, '#e8c36a', INK, 1.4)
M.append(it('saifu', '財布', 'さいふ', 'saifu', 'wallet, purse', wallet, (145, 470)))
tray = ell(520, 448, 120, 30, '#5a6470') + ell(520, 444, 104, 22, '#7a8490', None) + coin(480, 440, 16, '#d6dadf', '#9aa3ad') + coin(520, 446, 14, '#c07a4a', '#8a5030') + coin(556, 438, 12, '#e4e6e8', '#b8bec6')
M.append(it('otsuri', 'お釣り', 'おつり', 'otsuri', 'change (money given back)', tray, (520, 410)))
scene('money', 'お金', 'Japanese money: six coins, three notes, a wallet and a tray with change', 800, 500, bg, M)

# ---------- counting things ----------
def tile(col, row, inner):
    x, y = 14 + col * 196, 14 + row * 206
    return rect(x, y, 184, 194, '#fffdf8', '#d6cfc2', 1.5, r=14) + g(inner, tf=f'translate({x},{y})'), (x + 92, y + 176)
C = []
def add(iid, ja, kana, ro, en, col, row, inner):
    svg, tag = tile(col, row, inner); C.append(it(iid, ja, kana, ro, en, svg, tag))
apple = lambda x, y: circ(x, y, 20, '#d8322a') + path(f'M{x},{y - 20} q2,-10 8,-12', 'none', '#6b4a2a', 3) + ell(x + 8, y - 26, 7, 4, '#6aa84f', INK, 1.2)
add('mittsu', '三つ', 'みっつ', 'mittsu', 'three (things)', 0, 0, apple(52, 110) + apple(92, 110) + apple(132, 110))
add('nimai', '二枚', 'にまい', 'nimai', 'two (flat things: tickets, sheets)', 1, 0, rect(40, 70, 90, 50, '#f7e7c4', INK, 1.8, r=3) + rect(60, 96, 90, 50, '#f7e7c4', INK, 1.8, r=3))
add('sanbon', '三本', 'さんぼん', 'sanbon', 'three (long things: bottles, pens)', 2, 0, bottle(46, 150, 26, 80, '#6a8f3a', '#e8c36a') + bottle(80, 150, 26, 80, '#6a8f3a', '#e8c36a') + bottle(114, 150, 26, 80, '#6a8f3a', '#e8c36a'))
add('futari', '二人', 'ふたり', 'futari', 'two people', 3, 0, person(64, 156, 0.6, '#e0533d') + person(122, 156, 0.6, '#5b8fc9'))
cat = lambda x, y, c: ell(x, y, 26, 20, c) + circ(x - 24, y - 18, 14, c) + poly([(x - 34, y - 26), (x - 32, y - 40), (x - 24, y - 30)], c, INK, 1.6) + poly([(x - 20, y - 30), (x - 14, y - 40), (x - 12, y - 26)], c, INK, 1.6) + path(f'M{x + 24},{y - 4} q22,-10 14,-30', 'none', INK, 4)
add('ippiki', '一匹', 'いっぴき', 'ippiki', 'one (small animal)', 0, 1, cat(100, 120, '#f2b45a'))
add('nisatsu', '二冊', 'にさつ', 'nisatsu', 'two (books)', 1, 1, rect(40, 70, 60, 84, '#5b8fc9', INK, 2, r=3) + rect(46, 70, 6, 84, '#3d6fa5', None) + rect(90, 66, 60, 88, '#e0533d', INK, 2, r=3) + rect(96, 66, 6, 88, '#b5332e', None))
add('ichidai', '一台', 'いちだい', 'ichidai', 'one (machine, vehicle)', 2, 1, path('M30,130 L36,104 Q42,90 60,90 L120,90 Q138,90 146,104 L156,130z', '#5b8fc9') + rect(54, 98, 34, 22, '#d6ecfa', INK, 1.4, r=3) + rect(96, 98, 34, 22, '#d6ecfa', INK, 1.4, r=3) + circ(64, 134, 14, '#3b3631') + circ(126, 134, 14, '#3b3631'))
add('yonko', '四個', 'よんこ', 'yonko', 'four (small objects)', 3, 1, ''.join(ell(54 + (k % 2) * 50 + (k // 2) * 26, 92 + (k // 2) * 40, 18, 24, '#fbf2dc') for k in range(4)))
scene('counters', '数え方', 'Counting things: what is counted with tsu, mai, hon, nin, hiki, satsu, dai and ko', 800, 426, '', C)

# ---------- telling the time ----------
def clock(cx, cy, h, m, r=58):
    c = circ(cx, cy, r, '#ffffff', INK, 3) + ''.join(line(cx + (r - 8) * math.sin(k * math.pi / 6), cy - (r - 8) * math.cos(k * math.pi / 6), cx + (r - 3) * math.sin(k * math.pi / 6), cy - (r - 3) * math.cos(k * math.pi / 6), INK, 3) for k in range(12))
    ha = (h % 12 + m / 60) * math.pi / 6; ma = m * math.pi / 30
    c += line(cx, cy, cx + r * 0.5 * math.sin(ha), cy - r * 0.5 * math.cos(ha), INK, 5) + line(cx, cy, cx + r * 0.78 * math.sin(ma), cy - r * 0.78 * math.cos(ma), '#c0392b', 3) + circ(cx, cy, 4, INK, None)
    return c
TM = []
times = [('ichiji', '一時', 'いちじ', 'ichiji', "one o'clock", 1, 0), ('yoji', '四時', 'よじ', 'yoji', "four o'clock", 4, 0), ('shichiji', '七時', 'しちじ', 'shichiji', "seven o'clock", 7, 0),
         ('kuji', '九時', 'くじ', 'kuji', "nine o'clock", 9, 0), ('sanjihan', '三時半', 'さんじはん', 'sanji han', 'half past three', 3, 30), ('juujijuugofun', '十時十五分', 'じゅうじじゅうごふん', 'jūji jūgofun', 'a quarter past ten', 10, 15)]
for k, (iid, ja, kana, ro, en, h, m) in enumerate(times):
    cx = 75 + k * 130
    TM.append(it(iid, ja, kana, ro, en, clock(cx, 90, h, m), (cx, 174)))
y0 = 200

TM.append(it('gozen', '午前', 'ごぜん', 'gozen', 'a.m., morning', rect(40, y0 + 70, 360, 36, '#f6e3a8', INK, 2, r=8), (220, y0 + 88)))
TM.append(it('gogo', '午後', 'ごご', 'gogo', 'p.m., afternoon', rect(400, y0 + 70, 360, 36, '#c9d6ea', INK, 2, r=8), (580, y0 + 88)))
sun = lambda x, y, r, c: circ(x, y, r, c) + ''.join(line(x + (r + 4) * math.cos(a), y + (r + 4) * math.sin(a), x + (r + 12) * math.cos(a), y + (r + 12) * math.sin(a), '#e0a020', 3) for a in [k * math.pi / 4 for k in range(8)])
TM.append(it('asa', '朝', 'あさ', 'asa', 'morning', rect(40, y0 + 130, 170, 110, '#fdf0c8', INK, 2, r=10) + sun(125, y0 + 200, 18, '#f6c040') + rect(40, y0 + 214, 170, 26, '#cfe8b8', None, r=0), (125, y0 + 152)))
TM.append(it('hiru', '昼', 'ひる', 'hiru', 'noon, daytime', rect(225, y0 + 130, 170, 110, '#d6ecfa', INK, 2, r=10) + sun(310, y0 + 180, 22, '#f6d43c'), (310, y0 + 222)))
TM.append(it('yuugata', '夕方', 'ゆうがた', 'yūgata', 'early evening', rect(410, y0 + 130, 170, 110, '#f6c9a0', INK, 2, r=10) + path(f'M455,{y0 + 214} a40,40 0 0,1 80,0z', '#e0533d', None) + rect(410, y0 + 214, 170, 26, '#b98448', None), (495, y0 + 152)))
TM.append(it('yoru', '夜', 'よる', 'yoru', 'night', rect(595, y0 + 130, 165, 110, '#2f3b5f', INK, 2, r=10) + path(f'M690,{y0 + 160} a24,24 0 1,0 18,40 a18,18 0 1,1 -18,-40z', '#f6e3a8', None) + ''.join(circ(620 + dx, y0 + 150 + dy, 2.4, '#ffffff', None) for dx, dy in [(0, 10), (30, 50), (110, 20), (130, 70)]), (677, y0 + 222)))
scene('clock', '時間', 'Telling the time: six clocks, a.m. and p.m., and the times of day', 800, 460, '', TM)

# ---------- days of the week ----------
W = []
days = [('getsuyoobi', '月曜日', 'げつようび', 'getsuyōbi', 'Monday', '#f6e3a8'), ('kayoobi', '火曜日', 'かようび', 'kayōbi', 'Tuesday', '#f6c9a0'),
        ('suiyoobi', '水曜日', 'すいようび', 'suiyōbi', 'Wednesday', '#cfe6f6'), ('mokuyoobi', '木曜日', 'もくようび', 'mokuyōbi', 'Thursday', '#d5e8c4'),
        ('kinyoobi', '金曜日', 'きんようび', 'kin\'yōbi', 'Friday', '#f6e7b8'), ('doyoobi', '土曜日', 'どようび', 'doyōbi', 'Saturday', '#e6d3bf'),
        ('nichiyoobi', '日曜日', 'にちようび', 'nichiyōbi', 'Sunday', '#f9d3cf')]
icons = [lambda x, y: path(f'M{x},{y - 24} a24,24 0 1,0 18,40 a18,18 0 1,1 -18,-40z', '#f2c94c'),
         lambda x, y: path(f'M{x},{y - 26} q22,22 10,44 q-10,8 -20,0 q-12,-22 10,-44z', '#e0533d') + path(f'M{x},{y} q8,8 2,16 q-6,4 -10,0 q-4,-8 8,-16z', '#f6c040', None),
         lambda x, y: path(f'M{x},{y - 26} q20,26 14,38 q-14,14 -28,0 q-6,-12 14,-38z', '#5b9bd5'),
         lambda x, y: tree(x, y + 30, 0.55),
         lambda x, y: circ(x, y, 22, '#e2b94f') + circ(x, y, 16, 'none', '#b08a2a', 2),
         lambda x, y: path(f'M{x - 28},{y + 20} q28,-50 56,0z', '#a8743f') + ''.join(circ(x - 12 + k * 10, y + 10 - (k % 2) * 8, 3, '#7a4a2a', None) for k in range(3)),
         lambda x, y: circ(x, y, 18, '#f6c040') + ''.join(line(x + 22 * math.cos(a), y + 22 * math.sin(a), x + 30 * math.cos(a), y + 30 * math.sin(a), '#e0a020', 3) for a in [k * math.pi / 4 for k in range(8)])]
for k, (iid, ja, kana, ro, en, col) in enumerate(days):
    x0 = 16 + k * 110
    W.append(it(iid, ja, kana, ro, en, rect(x0, 110, 100, 150, col, INK, 2, r=10) + icons[k](x0 + 50, 175), (x0 + 50, 240)))
W.append(it('kinoo', '昨日', 'きのう', 'kinō', 'yesterday', path('M181,96 L181,74 L235,74', 'none', '#7a8490', 4) + poly([(181, 104), (174, 92), (188, 92)], '#7a8490', None), (205, 56)))
W.append(it('kyoo', '今日', 'きょう', 'kyō', 'today', rect(232, 106, 108, 158, 'none', '#c0392b', 5, r=12), (286, 56)))
W.append(it('ashita', '明日', 'あした', 'ashita', 'tomorrow', path('M337,74 L391,74 L391,96', 'none', '#7a8490', 4) + poly([(391, 104), (384, 92), (398, 92)], '#7a8490', None), (367, 56)))
W.append(it('shuumatsu', '週末', 'しゅうまつ', 'shūmatsu', 'weekend', path('M566,286 L566,300 L784,300 L784,286', 'none', '#2f7d4f', 4), (675, 324)))
W.append(it('maishuu', '毎週', 'まいしゅう', 'maishū', 'every week', path('M40,290 Q400,350 760,290', 'none', '#7b4b94', 3, ) + poly([(764, 288), (750, 284), (756, 298)], '#7b4b94', None), (400, 350)))
scene('week', '曜日', 'The days of the week, each with the picture behind its first kanji, and today, yesterday, tomorrow and the weekend', 800, 380, '', W)
