# Scenes: a street of buildings, a Japanese-style room, and the toilet and bath.
import math
from lib import *

# ---------- the town: twelve buildings with picture signs, no words ----------
bg = rect(0, 0, 800, 600, '#e6f0f6', None) + rect(0, 268, 800, 24, '#cfc8bb', None) + rect(0, 560, 800, 40, '#cfc8bb', None)
TW = []
def bldg(x, base, w, h, col, roof=None):
    b = rect(x, base - h, w, h, col, INK, 2, r=3)
    if roof: b += poly([(x - 8, base - h), (x + w / 2, base - h - 30), (x + w + 8, base - h)], roof)
    return b
def sign(x, y, inner, col='#ffffff'):
    return circ(x, y, 22, col, INK, 2) + inner
def win(x, y, n, w=22):
    return ''.join(rect(x + k * (w + 10), y, w, 22, '#cfe0ef', INK, 1.4) for k in range(n))
row1, row2 = 268, 560
TW.append(it('eki', '駅', 'えき', 'eki', 'station', bldg(10, row1, 180, 130, '#e8e2d6') + rect(10, row1 - 34, 180, 34, '#c9d6e3', INK, 2) + rect(30, row1 - 30, 140, 24, '#5b8fc9', INK, 1.6, r=6) + win(34, row1 - 26, 4, 22) + sign(100, row1 - 100, rect(88, row1 - 110, 24, 18, '#2f7d4f', None, r=4) + circ(93, row1 - 89, 3, INK, None) + circ(107, row1 - 89, 3, INK, None)), (100, row1 - 150)))
TW.append(it('ginkoo', '銀行', 'ぎんこう', 'ginkō', 'bank', bldg(205, row1, 120, 160, '#dde2e8') + ''.join(rect(215 + k * 26, row1 - 110, 14, 100, '#f4f4f4', INK, 1.4) for k in range(4)) + poly([(200, row1 - 112), (265, row1 - 150), (330, row1 - 112)], '#cfd6dc') + sign(265, row1 - 128, text(265, row1 - 120, '¥', 22, INK)), (265, row1 - 180)))
TW.append(it('yuubinkyoku', '郵便局', 'ゆうびんきょく', 'yūbinkyoku', 'post office', bldg(340, row1, 130, 120, '#f6efe1') + win(352, row1 - 100, 3, 26) + sign(405, row1 - 50, text(405, row1 - 42, '〒', 24, '#c0392b')) + rect(480, row1 - 54, 22, 54, '#c0392b', INK, 2, r=6), (410, row1 - 140)))
TW.append(it('byooin', '病院', 'びょういん', 'byōin', 'hospital', bldg(520, row1, 150, 200, '#f4f4f4') + ''.join(win(532, row1 - 180 + k * 40, 4, 24) for k in range(3)) + sign(595, row1 - 40, rect(589, row1 - 54, 12, 28, '#c0392b', None) + rect(581, row1 - 46, 28, 12, '#c0392b', None)), (595, row1 - 220)))
TW.append(it('kooban', '交番', 'こうばん', 'kōban', 'police box', bldg(690, row1, 100, 110, '#e8e2d6') + rect(705, row1 - 60, 30, 60, '#9aa3ad', INK, 1.6) + circ(760, row1 - 92, 8, '#c0392b', INK, 1.4) + sign(760, row1 - 50, path(f'M748,{row1 - 54} q12,-12 24,0 l-2,8 l-20,0z', '#2f4f7a', INK, 1.4)), (740, row1 - 130)))
TW.append(it('konbini2', 'コンビニ', 'コンビニ', 'konbini', 'convenience store', bldg(10, row2, 160, 110, '#ffffff') + rect(10, row2 - 110, 160, 22, '#4fa36b', INK, 2) + rect(10, row2 - 92, 160, 8, '#f2a65a', None) + rect(24, row2 - 74, 132, 62, '#cfe0ef', INK, 1.6), (90, row2 - 128)))
TW.append(it('yakkyoku', '薬局', 'やっきょく', 'yakkyoku', 'pharmacy', bldg(185, row2, 110, 110, '#eef6f0') + rect(195, row2 - 74, 90, 62, '#cfe0ef', INK, 1.6) + sign(240, row2 - 90, ell(240, row2 - 90, 14, 7, '#ffffff', INK, 1.4, rot=-30) + path(f'M228,{row2 - 84} l12,-6 l7,12 l-12,6z', '#e0533d', None)), (240, row2 - 128)))
TW.append(it('jinja', '神社', 'じんじゃ', 'jinja', 'Shinto shrine', rect(320, row2 - 100, 12, 100, '#d8322a', INK, 1.6) + rect(388, row2 - 100, 12, 100, '#d8322a', INK, 1.6) + path(f'M300,{row2 - 112} Q360,{row2 - 124} 420,{row2 - 112} L420,{row2 - 102} Q360,{row2 - 112} 300,{row2 - 102}z', '#d8322a') + rect(314, row2 - 86, 92, 9, '#d8322a', INK, 1.6), (360, row2 - 140)))
TW.append(it('otera', 'お寺', 'おてら', 'otera', 'Buddhist temple', rect(450, row2 - 60, 110, 60, '#e3d6bf', INK, 2) + poly([(430, row2 - 60), (505, row2 - 100), (580, row2 - 60)], '#5a6470') + rect(470, row2 - 104, 70, 20, '#e3d6bf', INK, 1.6) + poly([(456, row2 - 104), (505, row2 - 130), (554, row2 - 104)], '#5a6470') + rect(492, row2 - 40, 26, 40, '#8a5a3b', INK, 1.4), (505, row2 - 150)))
TW.append(it('basutei', 'バス停', 'バスてい', 'basutei', 'bus stop', rect(598, row2 - 120, 8, 120, '#9aa3ad', INK, 1.4) + circ(602, row2 - 130, 22, '#ffffff', INK, 2) + rect(590, row2 - 140, 24, 16, '#5b8fc9', INK, 1.2, r=3) + rect(582, row2 - 100, 40, 50, '#ffffff', INK, 1.4), (602, row2 - 168)))
TW.append(it('kooen', '公園', 'こうえん', 'kōen', 'park', tree(660, row2 - 10, 0.75, '#7fb069') + tree(740, row2 - 10, 0.9, '#6aa84f') + rect(670, row2 - 30, 60, 8, '#a8743f', INK, 1.4) + rect(676, row2 - 22, 6, 18, '#8a5a3b', None) + rect(718, row2 - 22, 6, 18, '#8a5a3b', None), (700, row2 - 128)))
TW.append(it('toire', 'トイレ', 'トイレ', 'toire', 'toilet(s)', rect(690, 300, 90, 70, '#ffffff', INK, 2, r=6) + circ(715, 318, 7, '#3d6fa5', None) + rect(708, 328, 14, 26, '#3d6fa5', None, r=3) + circ(755, 318, 7, '#c0392b', None) + poly([(755, 326), (745, 352), (765, 352)], '#c0392b', None), (735, 390)))
scene('town', '町', 'A town street: twelve buildings and places, each with a picture sign', 800, 600, bg, TW)

# ---------- a Japanese-style room ----------
bg = rect(0, 0, 800, 540, '#efe6d0', None)
J = []
J.append(it('tatami', '畳', 'たたみ', 'tatami', 'tatami mat', rect(0, 360, 800, 180, '#cfd59a', None) + ''.join(line(x, 360, x - 60, 540, '#a8ae6e', 3) for x in (200, 420, 640)) + line(0, 450, 800, 450, '#a8ae6e', 3) + rect(0, 356, 800, 8, '#3d5a3d', None), (300, 510)))
J.append(it('fusuma', '襖', 'ふすま', 'fusuma', 'sliding paper door (opaque)', rect(20, 60, 230, 300, '#f2ead6', INK, 2) + line(135, 60, 135, 360, INK, 2) + path('M40,300 q40,-60 80,-20 q40,40 100,-30', 'none', '#9fb37a', 4) + circ(118, 210, 6, '#b8a070', INK, 1.4) + circ(152, 210, 6, '#b8a070', INK, 1.4), (135, 40)))
J.append(it('tokonoma', '床の間', 'とこのま', 'tokonoma', 'alcove for a scroll and flowers', rect(270, 60, 200, 300, '#e6d6b4', INK, 2) + rect(270, 330, 200, 30, '#a8743f', INK, 2) + bottle(420, 330, 26, 40, '#5a6470', '#5a6470') + path('M433,288 q-14,-30 -4,-50 M433,288 q10,-26 22,-36', 'none', '#6aa84f', 3) + circ(421, 236, 6, '#e86f9a', None) + circ(455, 250, 6, '#e86f9a', None), (370, 40)))
J.append(it('kakejiku', '掛け軸', 'かけじく', 'kakejiku', 'hanging scroll', rect(320, 90, 70, 200, '#fbf6ea', INK, 2) + rect(316, 86, 78, 8, '#8a5a3b', INK, 1.4) + rect(316, 288, 78, 8, '#8a5a3b', INK, 1.4) + path('M335,130 q20,40 40,10 M340,200 q10,30 30,40', 'none', '#3b3631', 3), (355, 316)))
J.append(it('shooji', '障子', 'しょうじ', 'shōji', 'sliding paper screen', rect(490, 60, 290, 300, '#fbf8f0', INK, 2) + ''.join(line(490 + k * 36, 60, 490 + k * 36, 360, '#a8743f', 2) for k in range(1, 9)) + ''.join(line(490, 60 + k * 50, 780, 60 + k * 50, '#a8743f', 2) for k in range(1, 6)), (635, 40)))
J.append(it('zataku', '座卓', 'ざたく', 'zataku', 'low table', rect(150, 380, 260, 24, '#7a4a2a', INK, 2, r=4) + rect(166, 404, 16, 34, '#5a341c', INK, 1.4) + rect(378, 404, 16, 34, '#5a341c', INK, 1.4) + circ(280, 376, 12, '#6b8e7b', INK, 1.6), (280, 452)))
J.append(it('zabuton', '座布団', 'ざぶとん', 'zabuton', 'floor cushion', ell(120, 470, 60, 18, '#a33d4a') + ell(440, 470, 60, 18, '#a33d4a'), (60, 440)))
J.append(it('futon', '布団', 'ふとん', 'futon', 'futon (bedding)', rect(520, 410, 260, 80, '#f4f4f4', INK, 2, r=12) + rect(520, 410, 200, 80, '#8fb7de', INK, 2, r=12) + ''.join(line(540 + k * 34, 418, 540 + k * 34, 482, '#6b9fd9', 2) for k in range(5)), (620, 515)))
J.append(it('makura', '枕', 'まくら', 'makura', 'pillow', ell(752, 450, 24, 30, '#ffffff'), (765, 395)))
J.append(it('yukata', '浴衣', 'ゆかた', 'yukata', 'cotton kimono for the room and bath', rect(500, 500, 90, 32, '#ffffff', INK, 2, r=4) + ''.join(line(506 + k * 12, 504, 506 + k * 12, 528, '#3d6fa5', 2) for k in range(7)) + rect(500, 510, 90, 8, '#2f4f7a', None), (460, 516)))
J.append(it('surippa', 'スリッパ', 'スリッパ', 'surippa', 'slippers', ell(40, 520, 18, 9, '#8fb7de', INK, 1.6, rot=-10) + ell(72, 524, 18, 9, '#8fb7de', INK, 1.6, rot=10), (56, 498)))
scene('washitsu', '和室', 'A Japanese-style room: tatami, sliding doors and screens, the alcove, a low table, and a futon laid out', 800, 540, bg, J)

# ---------- toilet and bath ----------
bg = rect(0, 0, 800, 520, '#eef3f6', None) + rect(0, 0, 330, 520, '#f4f1ea', None) + rect(0, 430, 800, 90, '#d6dde3', None) + line(330, 0, 330, 520, INK, 2)
TB = []
toilet = rect(110, 230, 90, 120, '#ffffff', INK, 2, r=10) + path('M70,350 Q70,300 140,300 L220,300 Q240,300 236,330 L220,400 Q210,430 170,430 L130,430 Q100,430 96,400z', '#ffffff') + ell(160, 304, 74, 12, '#e9eef2')
TB.append(it('toire2', 'トイレ', 'トイレ', 'toire', 'toilet', toilet, (150, 470)))
TB.append(it('nagasu', '流す', 'ながす', 'nagasu', 'flush', rect(196, 250, 30, 10, '#b8bec6', INK, 1.6, r=4) + circ(200, 255, 6, '#9aa3ad', INK, 1.4), (200, 222)))
TB.append(it('dai', '大', 'だい', 'dai', 'big (full flush)', arrow(226, 250, 250, 236, '#3d6fa5', 4, 10), (270, 236)))
TB.append(it('shoo', '小', 'しょう', 'shō', 'small (half flush)', arrow(226, 262, 250, 276, '#c0392b', 4, 10), (270, 280)))
TB.append(it('toiretto-peepaa', 'トイレットペーパー', 'トイレットペーパー', 'toiretto pēpā', 'toilet paper', rect(30, 250, 40, 8, '#9aa3ad', INK, 1.4) + circ(50, 276, 22, '#ffffff') + circ(50, 276, 7, '#d6dde3', INK, 1.4) + rect(28, 276, 22, 40, '#ffffff', INK, 1.6), (90, 216)))
TB.append(it('yubune', '湯船', 'ゆぶね', 'yubune', 'bathtub', rect(560, 300, 220, 130, '#8fc3dd', INK, 2, r=10) + rect(560, 300, 220, 20, '#d6ecfa', INK, 2, r=8) + ''.join(path(f'M{x},290 q-8,-14 0,-28 q8,-14 0,-28', 'none', '#b6c8d4', 3) for x in (620, 660, 700)), (670, 380)))
TB.append(it('shawaa', 'シャワー', 'シャワー', 'shawā', 'shower', path('M400,80 L400,180 Q400,200 420,200', 'none', '#9aa3ad', 6) + rect(380, 60, 40, 24, '#b8bec6', INK, 1.6, r=8) + ''.join(line(390 + k * 8, 90, 386 + k * 8, 140, '#7fb3e0', 2, '4 6') for k in range(4)), (440, 60)))
TB.append(it('jaguchi', '蛇口', 'じゃぐち', 'jaguchi', 'tap, faucet', rect(410, 250, 50, 14, '#b8bec6', INK, 1.6, r=4) + rect(450, 250, 14, 28, '#b8bec6', INK, 1.6, r=4) + rect(400, 242, 18, 30, '#e0533d', INK, 1.4, r=4), (430, 300)))
TB.append(it('oke', '桶', 'おけ', 'oke', 'washbowl', path('M380,400 L392,440 L448,440 L460,400z', '#ffffff') + ell(420, 400, 40, 9, '#e8e2d6'), (420, 466)))
TB.append(it('isu2', '風呂椅子', 'ふろいす', 'furo-isu', 'bath stool', rect(480, 404, 70, 14, '#ffffff', INK, 2, r=4) + rect(486, 418, 12, 22, '#ffffff', INK, 1.6) + rect(532, 418, 12, 22, '#ffffff', INK, 1.6), (515, 470)))
TB.append(it('sekken', '石鹸', 'せっけん', 'sekken', 'soap', ell(370, 330, 22, 10, '#f6d04d'), (370, 356)))
TB.append(it('shanpuu', 'シャンプー', 'シャンプー', 'shanpū', 'shampoo', bottle(470, 340, 28, 56, '#7fb3e0', '#3b3631', '#ffffff'), (484, 360)))
TB.append(it('taoru', 'タオル', 'タオル', 'taoru', 'towel', rect(610, 90, 150, 8, '#9aa3ad', INK, 1.4) + rect(630, 98, 70, 110, '#f2a65a', INK, 2, r=4) + ''.join(line(634, 190 + k * 6, 696, 190 + k * 6, '#ffffff', 2) for k in range(2)), (665, 230)))
TB.append(it('kagami', '鏡', 'かがみ', 'kagami', 'mirror', rect(470, 80, 110, 140, '#dceaf2', INK, 2, r=8) + line(490, 110, 530, 90, '#ffffff', 4) + line(500, 140, 560, 110, '#ffffff', 3), (525, 60)))
scene('bath', 'トイレとお風呂', 'A toilet with its flush lever, and a Japanese bathroom with a tub, shower, stool and washbowl', 800, 520, bg, TB)
