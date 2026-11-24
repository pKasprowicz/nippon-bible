# Scenes: the body (front view) and a pharmacy.
from lib import *

SKIN, SKIN2, SHIRT, SHORTS, HAIR = '#f2c9a0', '#e3b48a', '#8fb7de', '#3d4a5c', '#3b2a20'

# ---------- the body: each part is its own shape ----------
B = []
cx = 300
# Drawing order matters: back parts first.
B.append(it('ashi', '足', 'あし', 'ashi', 'leg; foot', rect(258, 420, 34, 170, SKIN, r=12) + rect(308, 420, 34, 170, SKIN, r=12) + ell(268, 596, 26, 12, SKIN) + ell(332, 596, 26, 12, SKIN), (210, 560)))
B.append(it('hiza', '膝', 'ひざ', 'hiza', 'knee', ell(275, 505, 15, 12, SKIN2, INK, 1.6) + ell(325, 505, 15, 12, SKIN2, INK, 1.6), (395, 505)))
B.append(it('ude', '腕', 'うで', 'ude', 'arm', rect(196, 210, 34, 150, SKIN, r=16) + rect(370, 210, 34, 150, SKIN, r=16), (150, 270)))
B.append(it('te', '手', 'て', 'te', 'hand', ell(212, 380, 22, 26, SKIN), (160, 395)))
fingers = ell(388, 380, 22, 26, SKIN) + ''.join(rect(372 + k * 9, 392, 8, 28, SKIN, INK, 1.6, r=4) for k in range(4)) + rect(404, 366, 9, 24, SKIN, INK, 1.6, r=4)
B.append(it('yubi', '指', 'ゆび', 'yubi', 'finger', fingers, (450, 410)))
B.append(it('koshi', '腰', 'こし', 'koshi', 'hips; lower back', rect(240, 390, 120, 50, SHORTS, r=10), (450, 440)))
B.append(it('onaka', 'お腹', 'おなか', 'onaka', 'stomach, belly', rect(236, 300, 128, 96, SHIRT, r=8) + circ(cx, 350, 3, INK, None), (cx, 350)))
B.append(it('mune', '胸', 'むね', 'mune', 'chest', rect(230, 200, 140, 104, SHIRT, r=22), (cx, 252)))
B.append(it('kata', '肩', 'かた', 'kata', 'shoulder', circ(232, 218, 22, SHIRT) + circ(368, 218, 22, SHIRT), (440, 205)))
B.append(it('kubi', '首', 'くび', 'kubi', 'neck', rect(280, 160, 40, 46, SKIN, r=6), (190, 180)))
B.append(it('nodo', '喉', 'のど', 'nodo', 'throat', ell(cx, 188, 10, 8, SKIN2, INK, 1.4), (cx, 214)))
B.append(it('mimi', '耳', 'みみ', 'mimi', 'ear', ell(244, 110, 11, 17, SKIN) + ell(356, 110, 11, 17, SKIN), (420, 110)))
B.append(it('kao', '顔', 'かお', 'kao', 'face', ell(cx, 110, 56, 62, SKIN), (160, 120)))
B.append(it('atama', '頭', 'あたま', 'atama', 'head', path('M244,104 Q244,36 300,38 Q356,36 356,104 Q350,70 300,66 Q250,70 244,104z', HAIR), (cx, 22)))
B.append(it('me', '目', 'め', 'me', 'eye', ell(279, 104, 9, 6, '#ffffff', INK, 1.6) + circ(279, 104, 3.5, INK, None) + ell(321, 104, 9, 6, '#ffffff', INK, 1.6) + circ(321, 104, 3.5, INK, None), (440, 70)))
B.append(it('hana', '鼻', 'はな', 'hana', 'nose', path('M300,112 L294,132 Q300,136 306,132', SKIN2, INK, 1.8), (440, 132)))
B.append(it('kuchi', '口', 'くち', 'kuchi', 'mouth', path('M284,148 Q300,162 316,148 Q300,154 284,148z', '#c0392b', INK, 1.6), (160, 160)))
scene('body', '体', 'The human body, front view', 600, 620, '', B)

# ---------- pharmacy ----------
bg = rect(0, 0, 800, 540, '#f2f5f3', None) + rect(0, 440, 800, 100, '#d8ddd8', None)
bg += rect(20, 40, 460, 400, '#e3d6bf', INK, 2, r=4) + ''.join(line(20, y, 480, y, INK, 2) for y in (170, 300))
Ph = []
def box(x, y, w, h, col, icon):
    return rect(x, y, w, h, col, INK, 2, r=4) + rect(x + 6, y + 6, w - 12, 26, '#ffffff', None, r=3) + icon
cold = box(40, 80, 100, 88, '#7fb3e0', circ(90, 128, 20, '#f2c9a0', INK, 1.6) + ''.join(circ(118 + dx, 120 + dy, 3, '#5b8fc9', None) for dx, dy in [(0, 0), (6, 8), (-2, 14)]))
Ph.append(it('kazegusuri', '風邪薬', 'かぜぐすり', 'kazegusuri', 'cold medicine', cold, (90, 60)))
head = box(160, 80, 100, 88, '#e0533d', circ(210, 128, 20, '#f2c9a0', INK, 1.6) + path('M226,104 l-8,12 l8,0 l-8,12', 'none', '#f2d24b', 3))
Ph.append(it('zutsuuyaku', '頭痛薬', 'ずつうやく', 'zutsūyaku', 'headache medicine', head, (210, 60)))
stom = box(280, 80, 100, 88, '#9fcf6a', path('M314,112 q-10,30 16,36 q26,4 22,-20 q-4,-18 -16,-6 q-10,10 -14,-10z', '#f4a9a0', INK, 1.6))
Ph.append(it('igusuri', '胃薬', 'いぐすり', 'igusuri', 'stomach medicine', stom, (330, 60)))
Ph.append(it('megusuri', '目薬', 'めぐすり', 'megusuri', 'eye drops', rect(406, 110, 30, 58, '#ffffff', INK, 2, r=6) + rect(412, 92, 18, 20, '#5b8fc9', INK, 1.6, r=4) + path('M450,128 q-8,12 0,18 q8,-6 0,-18z', '#7fb3e0', INK, 1.4), (430, 74)))
Ph.append(it('bansookoo', '絆創膏', 'ばんそうこう', 'bansōkō', 'sticking plaster', ''.join(rect(40 + k * 20, 232 + k * 14, 90, 24, '#f0c9a0', INK, 1.6, r=10) + rect(70 + k * 20, 236 + k * 14, 30, 16, '#fbe9d6', None, r=3) for k in range(3)), (100, 196)))
Ph.append(it('masuku', 'マスク', 'マスク', 'masuku', 'face mask', path('M190,230 Q240,214 290,230 L284,280 Q240,296 196,280z', '#ffffff') + line(198, 248, 282, 248, '#d0d0d0', 1.6) + line(198, 262, 282, 262, '#d0d0d0', 1.6) + path('M190,236 q-18,10 6,40 M290,236 q18,10 -6,40', 'none', INK, 2), (240, 196)))
Ph.append(it('taionkei', '体温計', 'たいおんけい', 'taionkei', 'thermometer', rect(320, 250, 130, 18, '#ffffff', INK, 2, r=9) + rect(336, 254, 40, 10, '#9fd8e8', None, r=2) + circ(446, 259, 7, '#b8bec6', INK, 1.4), (385, 220)))
Ph.append(it('shippu', '湿布', 'しっぷ', 'shippu', 'medicated (pain-relief) patch', ''.join(rect(60 + k * 14, 330 + k * 10, 120, 80, '#f7f3e8', INK, 1.8, r=6) for k in range(3)) + rect(96, 356, 60, 34, '#e9e2cf', None, r=4), (130, 425)))
Ph.append(it('yakuzaishi', '薬剤師', 'やくざいし', 'yakuzaishi', 'pharmacist', person(640, 400, 1.05, '#ffffff', '#3d4a5c'), (640, 205)))
Ph.append(it('kauntaa2', 'カウンター', 'カウンター', 'kauntā', 'counter', rect(520, 340, 260, 100, '#cfe0d6', INK, 2, r=4) + rect(520, 330, 260, 14, '#9fb8a8', INK, 2), (650, 400)))
Ph.append(it('shohoosen', '処方箋', 'しょほうせん', 'shohōsen', 'prescription', rect(560, 296, 50, 36, '#ffffff', INK, 1.8, r=2) + ''.join(line(566, 306 + k * 7, 604, 306 + k * 7, '#bbb', 1.4) for k in range(3)) + circ(598, 322, 5, 'none', '#c0392b', 1.6), (585, 276)))
scene('pharmacy', '薬局', 'A pharmacy: medicines on the shelves and the pharmacist at the counter', 800, 540, bg, Ph)
