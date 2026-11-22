# Fills terms/substances.json from terms/substances-src.json: for each substance, PubChem's
# compound number, IUPAC name, formula and first description (with the description's source),
# and the Polish title of the English Wikipedia article (its language link), for the Polish name.
# Hand-written fields in terms/substances.json (abstract, ch) are kept.
# Run from the repository root: python3 scripts/terms/fetch-substances.py
import json, re, time, os, urllib.request, urllib.parse
UA = {'User-Agent': 'NipponBibleTerms/1.0 (educational static site; low volume)'}
def get(u):
    for a in range(5):
        try: return json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60))
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            time.sleep(3 * (a + 1))
        except Exception: time.sleep(3 * (a + 1))
    return None
PC = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/'
src = json.load(open('terms/substances-src.json'))
old = {e['en']: e for e in json.load(open('terms/substances.json'))} if os.path.exists('terms/substances.json') else {}
out = []
for s in src:
    e = {'en': s['en'], 'alias': s['alias'], 'url': s['wiki']}
    if s['q']:
        r = get(PC + 'name/' + urllib.parse.quote(s['q']) + '/cids/JSON')
        cid = r and r.get('IdentifierList', {}).get('CID', [None])[0]
        if cid:
            e['cid'] = cid
            p = get(PC + f'cid/{cid}/property/IUPACName,MolecularFormula/JSON')
            if p: pr = p['PropertyTable']['Properties'][0]; e['iupac'] = pr.get('IUPACName'); e['formula'] = pr.get('MolecularFormula')
            d = get(PC + f'cid/{cid}/description/JSON')
            infos = (d or {}).get('InformationList', {}).get('Information', [])
            infos.sort(key=lambda i: 0 if i.get('DescriptionSourceName') == 'ChEBI' else 1)
            for info in infos:
                if info.get('Description'):
                    sent = re.split(r'(?<=[.])\s+(?=[A-Z])', info['Description'])
                    e['abstract'] = ' '.join(sent[:2]); e['abstractSrc'] = 'PubChem / ' + info.get('DescriptionSourceName', '')
                    break
        time.sleep(0.4)
    t = urllib.parse.unquote(s['wiki'].split('/wiki/')[1]).replace('_', ' ')
    w = get('https://en.wikipedia.org/w/api.php?' + urllib.parse.urlencode({'action': 'query', 'titles': t, 'redirects': 1, 'prop': 'langlinks', 'lllang': 'pl', 'format': 'json', 'formatversion': 2}))
    pg = (w or {}).get('query', {}).get('pages', [{}])[0]
    pl = (pg.get('langlinks') or [{}])[0].get('title')
    if pl: e['pl'] = pl; e['plUrl'] = 'https://pl.wikipedia.org/wiki/' + urllib.parse.quote(pl.replace(' ', '_'))
    for k in ('abstract', 'abstractSrc', 'ch', 'pl', 'plUrl'):
        if old.get(s['en'], {}).get(k) and not e.get(k) or (k in ('abstract', 'abstractSrc', 'ch') and old.get(s['en'], {}).get('manual') and old[s['en']].get(k)):
            e[k] = old[s['en']][k]
    if old.get(s['en'], {}).get('manual'): e['manual'] = True
    out.append(e)
    print(e['en'], '|', e.get('cid'), '|', e.get('pl'), '|', (e.get('abstract') or '')[:70])
json.dump(out, open('terms/substances.json', 'w'), ensure_ascii=False, indent=1)
