# Draws the molecule diagrams of the cuisine handbook (cuisine/img/mol-*.svg).
# Structures come from PubChem (pubchem.json caches the records used); layout by RDKit.
# Run from the repository root:  pip install rdkit && python3 scripts/diagrams/draw.py
import json,re,os
HERE=os.path.dirname(os.path.abspath(__file__))
from rdkit import Chem
from rdkit.Chem import AllChem, rdDepictor
from rdkit.Chem.Draw import rdMolDraw2D
rdDepictor.SetPreferCoordGen(True)
P=json.load(open(os.path.join(HERE,'pubchem.json')))
OUT=os.path.join(HERE,'..','..','cuisine','img')+os.sep
HL=(1.0,0.82,0.45)  # amber highlight
FONT="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"

BL=30
def mol_svg(key,w,h,hl_smarts=None,hl_atoms=None):
    if key=='agarobiose': m=Chem.MolFromMolFile(os.path.join(HERE,'agarobiose.mol'))  # clash-free layout chosen by sampling
    else:
        m=Chem.MolFromSmiles(P[key]['SMILES']); rdDepictor.SetPreferCoordGen(True); rdDepictor.Compute2DCoords(m)
    d=rdMolDraw2D.MolDraw2DSVG(w,h)
    o=d.drawOptions(); o.clearBackground=False; o.bondLineWidth=2; o.minFontSize=13; o.maxFontSize=18
    o.padding=0.08; o.fixedBondLength=BL; o.addStereoAnnotation=False
    atoms=list(hl_atoms or [])
    if hl_smarts:
        for s in hl_smarts:
            for match in m.GetSubstructMatches(Chem.MolFromSmarts(s)): atoms+=match
    atoms=sorted(set(atoms))
    bonds=[b.GetIdx() for b in m.GetBonds() if b.GetBeginAtomIdx() in atoms and b.GetEndAtomIdx() in atoms]
    if atoms:
        d.DrawMolecule(m,highlightAtoms=atoms,highlightBonds=bonds,
            highlightAtomColors={a:HL for a in atoms},highlightBondColors={b:HL for b in bonds})
    else: d.DrawMolecule(m)
    d.FinishDrawing()
    s=d.GetDrawingText()
    s=re.sub(r'<\?xml[^>]*\?>','',s)
    s=re.sub(r'<rect style=[^>]*/>','',s,count=1)
    return s.strip()

def nest(svg,x,y,w,h):
    inner=re.sub(r'^<svg[^>]*>','',svg); inner=re.sub(r'</svg>\s*$','',inner)
    return f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{inner}</svg>'

def text(x,y,t,size=16,weight=400,anchor='middle',fill='#222',italic=False):
    st='font-style:italic;' if italic else ''
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" style="{FONT};{st}font-size:{size}px;font-weight:{weight};paint-order:stroke;stroke:#fff;stroke-width:5px;stroke-linejoin:round" fill="{fill}">{t}</text>'

def arrow(x1,y1,x2,y2,label=None,label2=None,dy=-10):
    s=f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#555" stroke-width="2.5" marker-end="url(#ah)"/>'
    mx=(x1+x2)/2; my=(y1+y2)/2
    if label: s+=text(mx,my+dy,label,13,600,fill='#7a3f05')
    if label2: s+=text(mx,my+dy+16 if dy<0 else my+dy+16,label2,12,fill='#555')
    return s

def page(W,H,title,desc,body):
    defs='<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="t d">'
            f'<title id="t">{title}</title><desc id="d">{desc}</desc>{defs}<rect width="{W}" height="{H}" fill="#ffffff"/>{body}</svg>')

def cap(k): return f"PubChem CID {P[k]['CID']} · "+sub(P[k]['MolecularFormula'])
def sub(f): return re.sub(r'(\d+)',r'<tspan baseline-shift="sub" style="font-size:75%">\1</tspan>',f)

files={}
# 1. umami trio
b=''; W=1020; H=340; cw=330
for i,(k,name,ab,note) in enumerate([("L-glutamic acid","L-Glutamic acid","glutamate","amino acid · kombu"),
                                     ("inosinic acid","Inosinic acid","IMP · inosinate","nucleotide · katsuobushi"),
                                     ("guanylic acid","Guanylic acid","GMP · guanylate","nucleotide · dried shiitake")]):
    x=10+i*(cw+10)
    b+=nest(mol_svg(k,cw,240,),x,40,cw,240)
    b+=text(x+cw/2,28,name,18,700)+text(x+cw/2,300,ab,15,600,fill='#7a3f05')+text(x+cw/2,320,cap(k),12,fill='#666')
files['mol-umami.svg']=page(W,H,'The three umami substances','Skeletal formulas of L-glutamic acid, inosinic acid (IMP) and guanylic acid (GMP). The side-chain carboxyl group of glutamic acid and the phosphate group of the two nucleotides are highlighted.',b)

# 2. ATP breakdown: 2 rows of 3
steps=[("adenosine triphosphate","ATP",['P(=O)(O)OP(=O)(O)O[CH2]'.replace('[CH2]','')],"adenosine triphosphate"),
       ("adenosine diphosphate","ADP",None,"adenosine diphosphate"),
       ("adenosine monophosphate","AMP",None,"adenosine monophosphate"),
       ("inosinic acid","IMP",None,"inosine monophosphate (inosinate)"),
       ("inosine","HxR",None,"inosine"),
       ("hypoxanthine","Hx",None,"hypoxanthine")]
# highlight the part that changes in the NEXT step
hl={"adenosine triphosphate":['OP(=O)(O)OP(=O)(O)[OH]'],
    "adenosine diphosphate":['OP(=O)(O)[OH]'] ,
    "adenosine monophosphate":['c[NH2]'],
    "inosinic acid":['COP(=O)(O)O'],
    "inosine":['[CH2]([OH])[CH]1O[CH][CH]([OH])[CH]1[OH]'],
    "hypoxanthine":None}
def hl_atoms(k):
    m=Chem.MolFromSmiles(P[k]['SMILES']); pats=hl[k]
    if not pats: return []
    if k=="adenosine triphosphate":  # terminal phosphate only
        pat=Chem.MolFromSmarts('[O]P(=O)([OH])[OH]')
    elif k=="adenosine diphosphate":
        pat=Chem.MolFromSmarts('[O;D2]P(=O)([OH])[OH]')
    else: pat=Chem.MolFromSmarts(pats[0])
    ms=m.GetSubstructMatches(pat)
    if k in("adenosine triphosphate","adenosine diphosphate"):
        # choose the phosphate furthest from ring (terminal): P with two OH
        ms=[t for t in ms]; t=ms[-1]; return list(t[1:])  # P and its O's (exclude bridging O)
    return list(ms[0]) if ms else []
labels=["−phosphate","−phosphate","NH₂ → O","−phosphate","−ribose"]
W=1060; cw=320; ch=250; b=''
pos=[(20,50),(370,50),(720,50),(720,420),(370,420),(20,420)]
for i,(k,ab,_,full) in enumerate(steps):
    x,y=pos[i]
    b+=nest(mol_svg(k,cw,ch,hl_atoms=hl_atoms(k)),x,y,cw,ch)
    b+=text(x+cw/2,y-16,f'{ab}',20,700)+text(x+cw/2,y+ch+20,full,14,fill='#333')+text(x+cw/2,y+ch+38,cap(k),12,fill='#666')
b+=arrow(338,175,372,175,labels[0],dy=-14)+arrow(688,175,722,175,labels[1],dy=-14)
b+=arrow(880,346,880,384,None)+text(895,370,labels[2],13,600,'start','#7a3f05')
b+=arrow(722,545,688,545,labels[3],dy=-14)+arrow(372,545,338,545,labels[4],dy=-14)
b+=text(530,770,'Highlighted: the part removed or changed in the next step. IMP is umami; inosine and hypoxanthine are not.',14,fill='#333')
files['mol-atp-breakdown.svg']=page(W,790,'ATP breakdown in fish muscle after death','Six skeletal formulas in sequence: ATP, ADP, AMP, IMP, inosine and hypoxanthine, with arrows labelled by the change at each step.',b)

# 3. glutamine fates
W=1000;H=500;b=''
b+=nest(mol_svg("L-glutamine",300,240,hl_smarts=['C(=O)[NH2]']),20,130,300,240)
b+=text(170,120,'L-Glutamine',18,700)+text(170,392,cap("L-glutamine"),12,fill='#666')
b+=nest(mol_svg("L-glutamic acid",300,190,hl_smarts=['[CH2]C(=O)[OH]']),660,40,300,190)
b+=text(810,28,'L-Glutamic acid (glutamate)',17,700)+text(810,246,'umami · '+cap("L-glutamic acid"),12,fill='#666')
b+=nest(mol_svg("L-pyroglutamic acid",300,150,hl_smarts=['C(=O)N']),660,300,300,150)
b+=text(810,290,'L-Pyroglutamic acid (pyroglutamate)',17,700)+text(810,466,'not umami · '+cap("L-pyroglutamic acid"),12,fill='#666')
b+=arrow(330,220,650,140,'glutaminase (kōji enzyme)','works best early, at pH 6–7',dy=-55)
b+=arrow(330,290,650,370,'no enzyme: the chain closes into a ring','if glutamine is not converted in time',dy=50)
b+=text(500,494,'Highlighted: the amide group of glutamine and the groups it becomes.',13,fill='#333')
files['mol-glutamine.svg']=page(W,H+10,'Two fates of free glutamine in soy-sauce moromi','Glutamine is converted by glutaminase to glutamic acid, or cyclises without an enzyme to pyroglutamic acid. The amide group of glutamine and the matching groups in the products are highlighted.',b)

# 4. vinegar chain
W=1000;H=320;b=''
for i,(k,name) in enumerate([("alpha-D-glucose","Glucose"),("ethanol","Ethanol"),("acetic acid","Acetic acid")]):
    x=20+i*340; w=280 if i==0 else 220
    b+=nest(mol_svg(k,w,200),x,50,w,200)
    b+=text(x+w/2,36,name,18,700)+text(x+w/2,272,cap(k),12,fill='#666')
b+=arrow(300,150,350,150,'yeast',dy=-12)+arrow(590,150,690,150,'acetic-acid','bacteria (oxidation)',dy=-26)
b+=text(20,306,'Kōji first turns rice starch into sugar. Glucose is drawn as the representative sugar.',13,'400','start','#333')
files['mol-vinegar.svg']=page(W,H,'The two fermentations of rice vinegar','Glucose is fermented by yeast to ethanol, which acetic-acid bacteria oxidise to acetic acid.',b)

# 5. starch linkages
def glyc(k,ring6):
    m=Chem.MolFromSmiles(P[k]['SMILES'])
    pat='[CH1;R](O;R)[O;!R][CH1;R]' if not ring6 else '[CH1;R]([O;R])[O;!R][CH2;!R]'
    t=m.GetSubstructMatches(Chem.MolFromSmarts(pat.replace('(O;R)','([O;R])')))[0]
    return [t[0],t[2],t[3]]
W=1000;H=600;b=''
b+=nest(mol_svg("maltose",440,260,hl_atoms=glyc("maltose",False)),20,40,440,260)
b+=nest(mol_svg("isomaltose",440,260,hl_atoms=glyc("isomaltose",True)),540,40,440,260)
b+=text(240,30,'α-1,4 link (as in maltose)',17,700)+text(760,30,'α-1,6 link (as in isomaltose)',17,700)
b+=text(240,316,'the chain link · '+cap("maltose"),12,fill='#666')
b+=text(760,316,'the branch link · '+cap("isomaltose"),12,fill='#666')
def dots(pts,col):
    return ''.join(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="7" fill="{col}"/>' for x,y in pts)
def chain(pts,col):
    return '<polyline points="'+' '.join(f'{x:.0f},{y:.0f}' for x,y in pts)+f'" fill="none" stroke="{col}" stroke-width="2"/>'+dots(pts,col)
lin=[(60+i*24,460) for i in range(16)]
b+=chain(lin,'#94530f')
b+=text(240,380,'Amylose: mostly linear',16,700)+text(240,540,'mostly α-1,4 links, a few long branches',13,fill='#333')
import math
def seg(x,y,n,ang): return [(x+i*22*math.cos(ang),y+i*22*math.sin(ang)) for i in range(n)]
main=seg(560,470,18,-0.04); b+=chain(main,'#2f6f8f')
for j,sgn,n in [(3,-1,4),(7,1,3),(11,-1,4),(15,1,3),(5,-1,3),(13,1,4)]:
    x,y=main[j]; b+=chain(seg(x,y,n,-0.04+sgn*1.0),'#2f6f8f')
b+=text(760,380,'Amylopectin: highly branched',16,700)+text(760,540,'α-1,4 chains joined by α-1,6 branch points',13,fill='#333')
b+=text(500,580,'Schematic: each dot is one glucose unit. Not to scale: amylopectin molecules are about 100 times heavier than amylose.',12,fill='#666')
files['mol-starch.svg']=page(W,H,'Amylose and amylopectin: the two links','Skeletal formulas of maltose and isomaltose showing the alpha-1,4 and alpha-1,6 glycosidic links, above schematic drawings of a linear amylose chain and a branched amylopectin molecule.',b)

# 6. GDL
W=900;H=290;b=''
b+=nest(mol_svg("glucono-delta-lactone",300,210,hl_smarts=['C(=O)O']),20,40,300,210)
b+=nest(mol_svg("D-gluconic acid",380,210,hl_smarts=['C(=O)[OH]']),500,40,380,210)
b+=text(170,30,'Glucono-δ-lactone (GDL)',18,700)+text(690,30,'Gluconic acid',18,700)
b+=text(170,272,cap("glucono-delta-lactone"),12,fill='#666')+text(690,272,cap("D-gluconic acid"),12,fill='#666')
b+=arrow(340,145,490,145,'+ water, slowly','ring opens',dy=-26)
files['mol-gdl.svg']=page(W,H,'Glucono-delta-lactone becomes gluconic acid','In water, the ring of glucono-delta-lactone opens to give gluconic acid, which releases hydrogen ions that set tofu.',b)

# 7. agarobiose
W=760;H=330;b=''
b+=nest(mol_svg("agarobiose",560,250),100,40,560,250)
b+=text(380,30,'Agarobiose: the repeating unit of agar',18,700)
b+=text(380,306,'Right: β-D-galactose. Left: 3,6-anhydro-α-L-galactose, whose ring is bridged by an extra oxygen.',13,fill='#333')
b+=text(380,324,cap("agarobiose"),12,fill='#666')
files['mol-agarobiose.svg']=page(W,H+6,'Agarobiose, the repeating unit of agar','Skeletal formula of agarobiose: a galactose ring linked to a 3,6-anhydro-galactose ring, which has an internal oxygen bridge.',b)

for f,s in files.items(): open(OUT+f,'w').write(s); print(f,len(s))
