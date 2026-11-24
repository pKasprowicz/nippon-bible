# Builds the picture dictionary: pictures/img/<scene>.svg, pictures/scenes.json, and the word
# table under each ```picture block in pictures/*.md (between <!-- words:ID --> and <!-- /words -->).
# Run from the repository root:  python3 scripts/pictures/build.py
import glob, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from lib import SCENES, render
import scenes_place  # noqa: F401
for mod in ('scenes_food', 'scenes_life', 'scenes_body', 'scenes_time', 'scenes_town'):
    if os.path.exists(os.path.join(HERE, mod + '.py')): __import__(mod)

ROOT = os.path.join(HERE, '..', '..')
OUT = os.path.join(ROOT, 'pictures', 'img')
os.makedirs(OUT, exist_ok=True)
data = {}
for sid, sc in SCENES.items():
    open(os.path.join(OUT, sid + '.svg'), 'w').write(render(sc))
    data[sid] = {'title': sc['title'], 'en': sc['en'], 'w': sc['w'], 'h': sc['h'],
                 'items': [{k: i[k] for k in ('id', 'ja', 'kana', 'ro', 'en')} | {'tag': [round(i['tag'][0]), round(i['tag'][1])]} for i in sc['items']]}
json.dump(data, open(os.path.join(ROOT, 'pictures', 'scenes.json'), 'w'), ensure_ascii=False, indent=0)

def table(sid):
    rows = ['| Japanese | Kana | Romaji | Meaning |', '|---|---|---|---|']
    for i in SCENES[sid]['items']:
        rows.append(f"| {i['ja']} | {i['kana']} | *{i['ro']}* | {i['en']} |")
    return '\n'.join(rows)

for f in glob.glob(os.path.join(ROOT, 'pictures', '*.md')):
    t = open(f).read()
    t2 = re.sub(r'<!-- words:([\w-]+) -->\n[\s\S]*?<!-- /words -->', lambda m: f'<!-- words:{m.group(1)} -->\n{table(m.group(1))}\n<!-- /words -->', t)
    if t2 != t: open(f, 'w').write(t2)
# Warn about labels that overlap or run off the picture, at a desktop page width (735 px).
for sid, sc in SCENES.items():
    u, boxes = sc['w'] / 735, []
    for i in sc['items']:
        w, h = (len(i['ja']) * 15 + 16) * u, 24 * u
        x, y = i['tag']; boxes.append((i['ja'], x - w / 2, y - h / 2, x + w / 2, y + h / 2))
    for k, A in enumerate(boxes):
        if A[1] < 0 or A[3] > sc['w'] or A[2] < 0 or A[4] > sc['h']: print(f'warning: {sid}: label {A[0]} runs off the picture')
        for B in boxes[k + 1:]:
            if A[1] < B[3] and B[1] < A[3] and A[2] < B[4] and B[2] < A[4]: print(f'warning: {sid}: labels {A[0]} and {B[0]} overlap')
print(len(SCENES), 'scenes,', sum(len(s['items']) for s in SCENES.values()), 'items')
