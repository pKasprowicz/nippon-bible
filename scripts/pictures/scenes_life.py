# Scenes: a convenience store, a restaurant, a station and a hotel lobby.
from lib import *

WALL, FLOOR = '#f3efe6', '#ddd3c2'

# ---------- convenience store ----------
bg = rect(0, 0, 800, 540, WALL, None) + rect(0, 420, 800, 120, FLOOR, None) + line(0, 420, 800, 420, '#c9bfae', 2)
K = []
fridge = rect(20, 90, 170, 330, '#cfd8de', INK, 2, r=6) + rect(30, 100, 150, 310, '#e9f3f8', '#9fb3bf', 1.6, r=4)
for r, y in enumerate((170, 250, 330, 405)):
    fridge += line(32, y, 178, y, '#9fb3bf', 2)
    for k in range(5):
        fridge += bottle(38 + k * 28, y - 2, 20, 50, ['#7fb3e0', '#f2a65a', '#9fcf6a', '#e86f9a', '#f4f4f4'][(k + r) % 5], '#3b3631')
K.append(it('nomimono', '飲み物', 'のみもの', 'nomimono', 'drinks', fridge, (105, 70)))
shelf = rect(220, 230, 200, 190, '#e7d8bd', INK, 2, r=4) + line(220, 320, 420, 320)
oni = ''.join(poly([(240 + k * 44, 312), (258 + k * 44, 280), (276 + k * 44, 312)], '#ffffff') + rect(250 + k * 44, 298, 16, 14, '#26302a', None) for k in range(4))
K.append(it('onigiri', 'おにぎり', 'おにぎり', 'onigiri', 'rice ball', shelf + oni, (320, 210)))
bento = ''.join(rect(232 + k * 64, 360, 56, 46, '#ffffff', INK, 1.8, r=4) + rect(236 + k * 64, 364, 22, 38, '#fdfcf7', '#ddd', 1) + rect(260 + k * 64, 364, 24, 18, '#e0533d', None) + rect(260 + k * 64, 384, 24, 18, '#9fcf6a', None) for k in range(3))
K.append(it('obentoo', 'お弁当', 'おべんとう', 'obentō', 'boxed meal', bento, (320, 440)))
K.append(it('tenin', '店員', 'てんいん', 'ten\'in', 'shop assistant', person(600, 400, 1.05, '#4fa36b', '#3d4a5c', apron='#ffffff'), (600, 205)))
counter = rect(440, 330, 330, 90, '#e8e2d6', INK, 2, r=4) + rect(440, 330, 330, 14, '#b8bec6', INK, 2)
K.append(it('reji', 'レジ', 'レジ', 'reji', 'checkout, till', counter + rect(470, 280, 70, 50, '#5a6470', r=4) + rect(478, 288, 54, 22, '#9fd8e8', None) + rect(475, 318, 60, 12, '#3b3631', None), (505, 380)))
K.append(it('reshiito', 'レシート', 'レシート', 'reshīto', 'receipt', path('M540,300 L572,300 L572,336 L566,332 L560,336 L554,332 L548,336 L540,332z', '#ffffff') + line(546, 310, 566, 310, '#bbb', 1.5) + line(546, 318, 566, 318, '#bbb', 1.5), (585, 276)))
K.append(it('rejibukuro', 'レジ袋', 'レジぶくろ', 'reji-bukuro', 'plastic shopping bag', path('M680,330 L672,270 L748,270 L740,330z', '#ffffff') + path('M690,272 q8,-26 16,0 M714,272 q8,-26 16,0', 'none', INK, 2.4), (712, 300)))
K.append(it('denshirenji', '電子レンジ', 'でんしレンジ', 'denshi renji', 'microwave oven', rect(650, 150, 120, 74, '#f4f4f4', INK, 2, r=6) + rect(660, 162, 72, 50, '#4a5058', None, r=4) + circ(752, 175, 6, '#c0392b', INK, 1.2) + circ(752, 198, 6, '#b8bec6', INK, 1.2), (710, 130)))
K.append(it('gomibako', 'ごみ箱', 'ごみばこ', 'gomibako', 'rubbish bin', ''.join(rect(30 + k * 48, 440, 42, 72, c, INK, 2, r=4) + circ(51 + k * 48, 458, 8, '#3b3631', None) for k, c in enumerate(['#7fb3e0', '#f2d24b', '#9fcf6a'])), (100, 425)))
K.append(it('atm', 'ATM', 'エーティーエム', 'ētīemu', 'cash machine', rect(250, 60, 120, 150, '#d6dde3', INK, 2, r=8) + rect(268, 76, 84, 56, '#3d6fa5', None, r=4) + rect(276, 146, 68, 8, '#3b3631', None) + rect(276, 166, 68, 30, '#b8bec6', INK, 1.4, r=3), (310, 40)))
scene('konbini', 'コンビニ', 'Inside a convenience store: drinks, rice balls and boxed meals, the checkout and the shop assistant', 800, 540, bg, K)

# ---------- restaurant ----------
bg = rect(0, 0, 800, 540, '#f6efe1', None) + rect(0, 430, 800, 110, '#cdb995', None) + rect(0, 60, 170, 370, '#e8dcc6', INK, 2)
Rs = []
noren = ''.join(rect(14 + k * 50, 70, 46, 120, '#2f4f7a', INK, 1.8) for k in range(3)) + rect(10, 64, 154, 8, '#8a5a3b', INK, 1.6)
Rs.append(it('noren', 'のれん', 'のれん', 'noren', 'shop curtain at the entrance', noren, (88, 130)))
Rs.append(it('shokkenki', '食券機', 'しょっけんき', 'shokkenki', 'meal-ticket machine', rect(185, 160, 110, 220, '#e6e9ec', INK, 2, r=6) + ''.join(rect(197 + (k % 3) * 30, 178 + (k // 3) * 26, 26, 20, ['#f2d24b', '#9fcf6a', '#7fb3e0'][k % 3], INK, 1.2, r=3) for k in range(12)) + rect(207, 300, 66, 10, '#3b3631', None) + rect(207, 330, 66, 30, '#b8bec6', INK, 1.4, r=3), (240, 140)))
Rs.append(it('teeburu', 'テーブル', 'テーブル', 'tēburu', 'table', rect(360, 340, 300, 16, '#a8743f') + rect(380, 356, 14, 90, '#8a5a3b', sw=1.6) + rect(626, 356, 14, 90, '#8a5a3b', sw=1.6), (510, 470)))
Rs.append(it('isu', '椅子', 'いす', 'isu', 'chair', rect(676, 250, 14, 190, '#8a5a3b', sw=1.6) + rect(670, 360, 64, 14, '#a8743f') + rect(722, 374, 10, 70, '#8a5a3b', sw=1.6) + rect(674, 374, 10, 70, '#8a5a3b', sw=1.6), (690, 230)))
Rs.append(it('menyuu', 'メニュー', 'メニュー', 'menyū', 'menu', poly([(390, 336), (420, 300), (490, 300), (470, 336)], '#fbf3dc') + line(425, 312, 470, 312, '#c0392b', 2) + line(420, 322, 462, 322, '#bbb', 2), (440, 280)))
Rs.append(it('ohiya', 'お冷', 'おひや', 'ohiya', 'glass of (free) water', poly([(520, 296), (548, 296), (544, 338), (524, 338)], '#d6ecfa') + rect(526, 302, 12, 10, '#ffffff', '#8ab8d8', 1, r=2), (534, 270)))
Rs.append(it('oshibori', 'おしぼり', 'おしぼり', 'oshibori', 'wet hand towel', rect(560, 326, 50, 12, '#ffffff', INK, 1.6, r=6), (590, 308)))
Rs.append(it('yobidashi', '呼び出しボタン', 'よびだしボタン', 'yobidashi botan', 'call button', rect(622, 318, 26, 20, '#3b3631', INK, 1.4, r=4) + circ(635, 326, 6, '#e0533d', None), (640, 380)))
Rs.append(it('tenin2', '店員', 'てんいん', 'ten\'in', 'member of staff', person(335, 430, 1.0, '#3b3631', '#3b3631', apron='#2f4f7a'), (335, 245)))
Rs.append(it('okaikei', 'お会計', 'おかいけい', 'okaikei', 'the bill, paying', rect(748, 200, 52, 230, '#d9c7a6', INK, 2) + rect(740, 140, 60, 60, '#e8e2d6', INK, 2, r=4) + rect(748, 110, 46, 32, '#5a6470', r=4) + rect(753, 116, 36, 12, '#9fd8e8', None), (760, 90)))
scene('restaurant', '飲食店', 'A restaurant: the curtain at the entrance, the meal-ticket machine, a table set with a menu and water, and the staff', 800, 540, bg, Rs)

# ---------- station ----------
bg = rect(0, 0, 800, 560, '#eef0f2', None) + rect(0, 0, 800, 250, '#dfe4ea', None) + rect(0, 250, 800, 310, '#e6e2da', None)
St = []
train = rect(260, 60, 520, 120, '#f4f4f4', INK, 2, r=18) + rect(260, 130, 520, 16, '#2f7d4f', None) + ''.join(rect(290 + k * 90, 78, 60, 40, '#a9c4d8', INK, 1.6, r=4) for k in range(5)) + rect(470, 74, 36, 100, '#cfd6dc', INK, 1.6)
St.append(it('densha', '電車', 'でんしゃ', 'densha', 'train', train, (520, 40)))
St.append(it('hoomu', 'ホーム', 'ホーム', 'hōmu', 'platform', rect(0, 200, 800, 50, '#c9c2b6', None) + rect(0, 200, 800, 8, '#f2d24b', None) + ''.join(rect(20 + k * 36, 214, 24, 4, '#a9a296', None) for k in range(22)), (140, 228)))
St.append(it('senro', '線路', 'せんろ', 'senro', 'railway track', rect(0, 180, 250, 20, '#8f8678', None) + line(0, 184, 250, 184, '#5a5a5a', 3) + line(0, 196, 250, 196, '#5a5a5a', 3), (120, 166)))
St.append(it('bansen', '1番線', 'いちばんせん', 'ichi-bansen', 'track 1, platform 1', rect(50, 70, 90, 60, '#2f4f7a', INK, 2, r=6) + text(95, 113, '1', 38, '#ffffff'), (95, 52)))
St.append(it('jikokuhyoo', '時刻表', 'じこくひょう', 'jikokuhyō', 'timetable', rect(40, 270, 110, 140, '#ffffff', INK, 2, r=4) + ''.join(line(52, 290 + k * 14, 138, 290 + k * 14, '#9aa3ad', 2) for k in range(8)), (95, 430)))
St.append(it('kenbaiki', '券売機', 'けんばいき', 'kenbaiki', 'ticket machine', ''.join(rect(180 + k * 74, 290, 64, 150, '#e6e9ec', INK, 2, r=6) + rect(188 + k * 74, 302, 48, 40, '#3d6fa5', None, r=3) + rect(194 + k * 74, 360, 36, 6, '#3b3631', None) for k in range(2)), (250, 270)))
St.append(it('kippu', '切符', 'きっぷ', 'kippu', 'ticket', rect(204, 456, 60, 30, '#f7e7c4', INK, 1.8, r=3) + line(212, 466, 250, 466, '#c9a96b', 2) + rect(212, 474, 30, 4, '#3b3631', None), (234, 506)))
gates = ''
for k in range(4):
    x = 360 + k * 90
    gates += rect(x, 330, 26, 140, '#d6dde3', INK, 2, r=6) + rect(x + 4, 340, 18, 12, '#57b36a', None, r=2)
    if k < 3: gates += rect(x + 26, 380, 30, 10, '#c0392b', INK, 1.2, r=3) + rect(x + 34, 380, 30, 10, '#c0392b', INK, 1.2, r=3)
St.append(it('kaisatsu', '改札', 'かいさつ', 'kaisatsu', 'ticket gates', gates, (540, 500)))
St.append(it('ic', 'ICカード', 'アイシーカード', 'aishī kādo', 'IC card (travel card)', rect(454, 318, 42, 28, '#7fb069', INK, 1.8, r=4) + circ(475, 312, 18, 'none', '#57b36a', 2), (475, 290)))
St.append(it('ekiin', '駅員', 'えきいん', 'ekiin', 'station staff', person(730, 470, 0.95, '#2f4f7a', '#2f4f7a', hat='#2f4f7a'), (730, 286)))
St.append(it('deguchi', '出口', 'でぐち', 'deguchi', 'exit', rect(560, 262, 170, 46, '#f2d24b', INK, 2, r=4) + arrow(580, 285, 630, 285, '#3b3631', 6, 14), (660, 248)))
scene('station', '駅', 'A station: ticket machines, ticket gates, the exit sign, and a train at the platform beyond', 800, 560, bg, St)

# ---------- hotel lobby ----------
bg = rect(0, 0, 800, 540, '#f4eee3', None) + rect(0, 420, 800, 120, '#cdbfa6', None)
H = []
H.append(it('sutaffu', 'スタッフ', 'スタッフ', 'sutaffu', 'staff', person(410, 380, 0.9, '#2f3b4f', '#2f3b4f'), (410, 200)))
H.append(it('furonto', 'フロント', 'フロント', 'furonto', 'front desk, reception', rect(250, 300, 320, 120, '#a8743f', INK, 2, r=4) + rect(240, 290, 340, 16, '#8a5a3b', INK, 2, r=4), (410, 380)))
H.append(it('kagi', '鍵', 'かぎ', 'kagi', 'key', rect(300, 274, 36, 22, '#e8e8e8', INK, 1.6, r=3) + rect(306, 282, 14, 6, '#c0392b', None), (290, 255)))
H.append(it('pasupooto', 'パスポート', 'パスポート', 'pasupōto', 'passport', rect(500, 268, 30, 40, '#7a1f2a', INK, 1.6, r=3) + circ(515, 286, 7, 'none', '#e8c36a', 1.6), (540, 236)))
H.append(it('yobirin', '呼び鈴', 'よびりん', 'yobirin', 'desk bell', path('M450,290 a14,14 0 0,1 28,0z', '#e8c36a') + rect(446, 288, 36, 5, '#b8bec6', INK, 1.2) + circ(464, 274, 3, '#e8c36a', INK, 1), (452, 256)))
H.append(it('nimotsu', '荷物', 'にもつ', 'nimotsu', 'luggage', rect(190, 330, 80, 110, '#c0392b', INK, 2, r=10) + rect(215, 310, 30, 22, 'none', INK, 4, r=6) + circ(205, 444, 6, INK, None) + circ(255, 444, 6, INK, None), (230, 470)))
H.append(it('erebeetaa', 'エレベーター', 'エレベーター', 'erebētā', 'lift, elevator', rect(620, 150, 150, 270, '#d6dde3', INK, 2) + line(695, 150, 695, 420, INK, 2) + rect(780, 260, 14, 30, '#b8bec6', INK, 1.4, r=3) + poly([(787, 266), (783, 272), (791, 272)], INK, None) + poly([(787, 284), (783, 278), (791, 278)], INK, None), (695, 130)))
stairs = ''.join(rect(10 + k * 22, 420 - (k + 1) * 26, 160 - k * 22, 26, '#e3d6bf', INK, 1.6) for k in range(6))
H.append(it('kaidan', '階段', 'かいだん', 'kaidan', 'stairs', stairs, (60, 240)))
H.append(it('hijooguchi', '非常口', 'ひじょうぐち', 'hijōguchi', 'emergency exit', rect(40, 70, 90, 50, '#2f9a5a', INK, 2, r=4) + circ(70, 84, 5, '#ffffff', None) + path('M70,90 l-6,14 m6,-14 l8,8 l8,-4 m-16,-4 l-2,16 l-10,6', 'none', '#ffffff', 3.4) + rect(104, 80, 18, 30, '#ffffff', None), (85, 50)))
H.append(it('sofaa', 'ソファー', 'ソファー', 'sofā', 'sofa', rect(330, 476, 200, 44, '#5b8fc9', INK, 2, r=12) + rect(340, 450, 180, 34, '#6b9fd9', INK, 2, r=12), (430, 496)))
scene('hotel', 'ホテル', 'A hotel lobby: the front desk with a key, a passport and a bell, the luggage, stairs and the lift', 800, 540, bg, H)
