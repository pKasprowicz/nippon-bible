# Collects every English Wikipedia link in the pages and asks the Wikipedia API for
# the article's Japanese title (language link), its Polish title, and its short description,
# which is used only to sort the link into a type (person, place, work, ...).
# Writes terms/entities.json. Run from the repository root: python3 scripts/terms/fetch-entities.py
import json, re, glob, time, urllib.request, urllib.parse
UA = {'User-Agent': 'NipponBibleTerms/1.0 (educational static site; low volume)'}
DIRS = ['lessons', 'hiragana', 'katakana', 'kanji', 'cuisine', 'folklore', 'popculture', 'bathing', 'railways', 'festivals', 'pictures']
urls = {}
for d in DIRS:
    for f in sorted(glob.glob(d + '/*.md')):
        for text, u in re.findall(r'\[([^\]]+)\]\((https://en\.wikipedia\.org/wiki/(?:[^()\s]|\([^()\s]*\))+)\)', open(f).read()):
            urls.setdefault(u, text)
def api(params):
    q = 'https://en.wikipedia.org/w/api.php?' + urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    for a in range(6):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(q, headers=UA), timeout=60))
        except Exception as e: time.sleep(5 * (a + 1))
    raise SystemExit('API failed')
def kind(desc, title):
    d = (desc or '').lower()
    if re.search(r'\b(chemical compound|amino acid|nucleotide|sugar|ion\b|salt\b|acid\b|enzyme|protein|polysaccharide|alkaloid|chemical element|mineral)', d): return 'substance'
    if re.search(r'\(\d{3,4}\s*[–-]\s*\d{2,4}\)|\(born \d{4}\)|\b(born|died)\b|\b(writer|artist|painter|director|actor|actress|poet|monk|priest|scholar|emperor|empress|shogun|samurai|engineer|businessman|politician|composer|singer|novelist|mangaka|illustrator|animator|philosopher|daimyō|daimyo|ruler|general|statesman|chef)\b', d): return 'person'
    if re.search(r'\b(film|novel|manga|anime|book|scroll|series|video game|game|song|album|painting|poem|play|opera|television|tv|magazine|collection|chronicle|text|story|tale|franchise|print|artwork|handscroll)\b', d): return 'work'
    if re.search(r'\b(company|corporation|organi[sz]ation|agency|museum|university|studio|association|group|ministry|government|publisher|railway company|band|school|party|council|bureau|festival committee)\b', d): return 'organisation'
    if re.search(r'\b(city|town|village|prefecture|province|mountain|volcano|river|island|station|shrine|temple|district|ward|area|region|neighbo(u)?rhood|street|lake|bay|castle|park|hot spring|onsen|country|capital|peninsula|building|bridge|tunnel|line\b|road)\b', d): return 'place'
    if re.search(r'\b(period|era|war|battle|rebellion|incident|event|festival|disaster|earthquake|restoration|reform)\b', d): return 'event'
    return 'topic'
out = []
items = list(urls.items())
for i in range(0, len(items), 40):
    chunk = items[i:i + 40]
    titles = [urllib.parse.unquote(u.split('/wiki/', 1)[1]).replace('_', ' ').split('#')[0] for u, _ in chunk]
    r = api({'action': 'query', 'titles': '|'.join(titles), 'redirects': 1, 'prop': 'langlinks|pageprops|description',
             'lllimit': 'max', 'lllang': 'ja', 'ppprop': 'wikibase-shortdesc'})
    rp = api({'action': 'query', 'titles': '|'.join(titles), 'redirects': 1, 'prop': 'langlinks', 'lllimit': 'max', 'lllang': 'pl'})
    plt = {p['title']: (p.get('langlinks') or [{}])[0].get('title') for p in rp['query']['pages']}
    q = r['query']; norm = {n['from']: n['to'] for n in q.get('normalized', [])}
    redir = {n['from']: n['to'] for n in q.get('redirects', [])}
    pages = {p['title']: p for p in q['pages']}
    for (u, text), t in zip(chunk, titles):
        t2 = redir.get(norm.get(t, t), norm.get(t, t)); p = pages.get(t2, {})
        ll = {l['lang']: l['title'] for l in p.get('langlinks', [])}; ll['pl'] = plt.get(t2)
        desc = p.get('description') or p.get('pageprops', {}).get('wikibase-shortdesc', '')
        out.append({'url': u, 'title': t2, 'text': text, 'ja': ll.get('ja'), 'pl': ll.get('pl'), 'type': kind(desc, t2),
                    'missing': 'missing' in p})
    time.sleep(1)
json.dump(out, open('terms/entities.json', 'w'), ensure_ascii=False, indent=1)
import collections
print(len(out), collections.Counter(e['type'] for e in out), sum(1 for e in out if e['missing']), 'missing')
