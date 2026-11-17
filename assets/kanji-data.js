/* Kanji data for the Kanji course: the ~95 kanji most often met on signs in stations,
   restaurants, shops, toilets, onsen and other public places.
   Each entry: kanji, main reading (romaji, as used on signs), other accepted readings,
   reading in kana (for audio), meaning, unit, memory aid built from the kanji's parts,
   and look-alikes. */
(function (root) {
  'use strict';

  // [kanji, reading, kana, other readings, meaning, memory aid, look-alikes]
  var UNITS = {
    1: [ // numbers and prices
      ['一', 'ichi', 'いち', '', 'one', 'One horizontal stroke: one.', '二'],
      ['二', 'ni', 'に', '', 'two', 'Two strokes: two.', '三一'],
      ['三', 'san', 'さん', '', 'three', 'Three strokes: three.', '二'],
      ['四', 'yon', 'よん', 'shi', 'four', 'A room seen from above with two curtains hanging inside: four walls.', '西'],
      ['五', 'go', 'ご', '', 'five', 'A bar on top, a zig-zag through the middle and a base: like a squared-off 5.', '六'],
      ['六', 'roku', 'ろく', 'mu', 'six', 'A lid with two little legs spreading out below.', '八'],
      ['七', 'nana', 'なな', 'shichi', 'seven', 'An upside-down 7 with a bar through it.', '十'],
      ['八', 'hachi', 'はち', 'ya', 'eight', 'Two strokes fanning out, like a roof or an opening fan.', '入人'],
      ['九', 'kyū', 'きゅう', 'ku', 'nine', 'A shape like a 9 with a long hooked tail.', '力'],
      ['十', 'jū', 'じゅう', 'ji', 'ten', 'A cross: like the Roman ten, X, turned upright.', '千七'],
      ['百', 'hyaku', 'ひゃく', 'byaku, pyaku', 'hundred', '一 (one) on top of 白 (white): one hundred.', '日'],
      ['千', 'sen', 'せん', 'zen', 'thousand', '十 (ten) with a slash on top: ten times more.', '十'],
      ['万', 'man', 'まん', 'ban', 'ten thousand', 'A bar and a hooked "ma": 万 is the Japanese unit of 10,000. 1万円 = ¥10,000.', '方'],
      ['円', 'en', 'えん', '', 'yen', 'A cash drawer with a divider: the yen. You see it on every price tag.', '内']
    ],
    2: [ // entrances, exits and directions
      ['入', 'iri', 'いり', 'nyū, hairu, iru', 'enter', 'A person stepping in: two legs, the left one longer, walking inside. (八 spreads apart instead.)', '人八'],
      ['出', 'de', 'で', 'shutsu, deru', 'go out, exit', 'Two mountains stacked on top of each other: climb up and out.', '山'],
      ['口', 'kuchi', 'くち', 'guchi, kō', 'mouth, opening', 'An open mouth: a square opening. 入口 = enter + opening = entrance.', '日回'],
      ['上', 'ue', 'うえ', 'jō, nobori', 'up, above', 'A line pointing up from the ground.', '下止'],
      ['下', 'shita', 'した', 'ka, ge, kudari', 'down, below', 'A line hanging down below the ground.', '上'],
      ['左', 'hidari', 'ひだり', 'sa', 'left', 'A hand (ナ) holding a carpenter\'s square (工): the left hand holds the tool.', '右'],
      ['右', 'migi', 'みぎ', 'u, yū', 'right', 'A hand (ナ) over a mouth (口): the right hand brings food to the mouth.', '左石'],
      ['東', 'higashi', 'ひがし', 'tō', 'east', 'The sun (日) rising behind a tree (木): east.', '車束'],
      ['西', 'nishi', 'にし', 'sei, sai', 'west', 'A bird settling into its nest at sunset: west.', '四'],
      ['南', 'minami', 'みなみ', 'nan', 'south', 'A warm tent with a cross on top, facing the sun: south.', ''],
      ['北', 'kita', 'きた', 'hoku', 'north', 'Two people sitting back to back, turning away from the cold north.', '比'],
      ['中', 'naka', 'なか', 'chū, jū', 'middle, inside, in progress', 'A line through the middle of a box. On signs 〜中 means "in progress": 営業中 = open now.', '申口']
    ],
    3: [ // stations and trains
      ['駅', 'eki', 'えき', '', 'station', 'A horse (馬) on the left: post stations were where horses were changed.', ''],
      ['電', 'den', 'でん', '', 'electricity', 'Rain (雨) over a field with lightning striking down: electricity, as in 電車 (electric train).', '雨'],
      ['車', 'sha', 'しゃ', 'kuruma', 'vehicle, car', 'A cart seen from above: two wheels joined by an axle.', '東'],
      ['線', 'sen', 'せん', '', 'line, track', 'Thread (糸) on the left: a long line, like a railway track.', ''],
      ['番', 'ban', 'ばん', '', 'number (in order)', 'A field (田) with seeds sown in rows: one after another, numbered. 1番線 = platform 1.', ''],
      ['方', 'hō', 'ほう', 'kata, pō', 'direction, side', 'A pointing hand on a signpost: which direction?', '万'],
      ['面', 'men', 'めん', 'omote', 'face, side', 'A face with a nose in the middle: the side you face. 方面 = "towards".', ''],
      ['行', 'iki', 'いき', 'yuki, kō, gyō, iku', 'go, bound for', 'Two people walking at a crossroads: going. On trains, 〜行き = bound for 〜.', ''],
      ['乗', 'jō', 'じょう', 'no, nori, noru', 'ride, board', 'A person climbing up into a tree: getting on.', ''],
      ['場', 'ba', 'ば', 'jō', 'place', 'Earth (土) on the left, sun shining on it: an open place. 乗り場 = boarding place.', '湯'],
      ['切', 'kiru', 'きる', 'ki, kip, kit, setsu', 'cut', 'Seven (七) and a knife (刀): cut. Tickets were cut (punched) at the gate.', '七'],
      ['符', 'fu', 'ふ', 'pu', 'token, ticket', 'Bamboo (⺮) on top: tickets were once bamboo tallies. 切符 = ticket.', ''],
      ['改', 'kai', 'かい', '', 'check, change', 'A coiled 己 being struck by a hand (攵): inspect, change.', ''],
      ['札', 'satsu', 'さつ', 'fuda', 'tag, card, banknote', 'Wood (木) with a hook: a wooden tag. 改札 = ticket gates, where tags are checked.', '木']
    ],
    4: [ // restaurants and food
      ['食', 'shoku', 'しょく', 'ta, taberu, jiki', 'eat, food', 'A roof over a full bowl: a meal.', '飲'],
      ['飲', 'nomi', 'のみ', 'no, in, nomu', 'drink', '食 (food) on the left and a person with an open mouth (欠): drinking.', '食'],
      ['水', 'mizu', 'みず', 'sui', 'water, Wednesday', 'A central stream with water splashing to both sides.', '氷木'],
      ['茶', 'cha', 'ちゃ', 'sa', 'tea', 'Plants (艹) on top, a person among trees below: tea leaves.', ''],
      ['肉', 'niku', 'にく', '', 'meat', 'A slab of meat with marbling lines inside.', '内'],
      ['牛', 'gyū', 'ぎゅう', 'ushi', 'cow, beef', 'A cow\'s head from the front, one horn sticking up.', '午生'],
      ['豚', 'buta', 'ぶた', 'ton', 'pig, pork', 'Meat (月) next to a pig (豕): pork.', ''],
      ['魚', 'sakana', 'さかな', 'gyo, uo', 'fish', 'A fish standing on its tail: head on top, body in the middle, fins (灬) at the bottom.', ''],
      ['生', 'nama', 'なま', 'sei, shō, ikiru', 'raw, fresh, draught', 'A plant sprouting from the ground: alive and fresh. 生ビール = draught beer.', '牛'],
      ['定', 'tei', 'てい', 'jō', 'fixed, set', 'A roof (宀) over a correct foot (正): fixed in place. 定食 = set meal.', ''],
      ['券', 'ken', 'けん', '', 'ticket, voucher', 'Two hands holding a piece cut with a knife (刀): a ticket. 食券 = meal ticket.', ''],
      ['物', 'mono', 'もの', 'butsu', 'thing', 'A cow (牛) on the left and a flag: things, goods. 飲み物 = drinks.', '']
    ],
    5: [ // shops and money
      ['店', 'mise', 'みせ', 'ten', 'shop', 'A shelter (广) over a fortune-teller\'s stall (占): a shop.', ''],
      ['売', 'uri', 'うり', 'u, bai, uru', 'sell', 'A scholar (士) over a crown and legs: things going out to buyers.', ''],
      ['税', 'zei', 'ぜい', '', 'tax', 'Grain (禾) on the left: taxes were once paid in rice.', ''],
      ['込', 'komi', 'こみ', 'kome', 'included', 'Something entering (入) along a road (辶): put in, included. 税込 = tax included.', '入'],
      ['抜', 'nuki', 'ぬき', 'nuku', 'left out, excluded', 'A hand (扌) pulling something out: taken out. 税抜 = tax excluded.', ''],
      ['割', 'wari', 'わり', 'katsu', 'divide, discount (10%)', 'A knife (刂) on the right cutting: cut the price. 2割引 = 20% off.', ''],
      ['引', 'hiki', 'ひき', 'biki, piki, in, hiku', 'pull, discount', 'A bow (弓) with its string pulled. On doors: pull. On price tags: discount.', ''],
      ['現', 'gen', 'げん', '', 'actual, present', 'A jewel (王) and an eye that sees (見): what\'s really in your hand. 現金 = cash.', ''],
      ['金', 'kin', 'きん', 'kane, gane, kon', 'money, gold, Friday', 'A roof over gold nuggets buried in the earth: gold, money.', '全']
    ],
    6: [ // opening hours, days and time
      ['日', 'nichi', 'にち', 'hi, bi, jitsu, ka, ni', 'day, sun, Sunday', 'The sun: a circle drawn square, with a line across.', '目白曰'],
      ['月', 'getsu', 'げつ', 'tsuki, gatsu', 'moon, month, Monday', 'A crescent moon standing upright.', '日用'],
      ['火', 'ka', 'か', 'hi', 'fire, Tuesday', 'A flame with sparks flying to both sides.', ''],
      ['木', 'moku', 'もく', 'ki, boku', 'tree, Thursday', 'A tree: a trunk, branches spreading and roots below.', '本水'],
      ['土', 'do', 'ど', 'tsuchi, to', 'earth, Saturday', 'A sprout coming out of the ground.', '士上'],
      ['曜', 'yō', 'よう', '', 'day of the week', 'The sun (日) on the left, and feathered birds: the days going by. 月曜日 = Monday.', ''],
      ['時', 'ji', 'じ', 'toki', 'hour, o\'clock, time', 'The sun (日) next to a temple (寺): temple bells told the time.', ''],
      ['分', 'fun', 'ふん', 'pun, bun, wakeru', 'minute, part', 'A knife (刀) splitting something in two (八): divide. Divided hours are minutes.', ''],
      ['営', 'ei', 'えい', '', 'run (a business)', 'Sparks over a roof and a busy building: a business that\'s running. 営業中 = open.', ''],
      ['業', 'gyō', 'ぎょう', '', 'business, work', 'A tall, busy scaffold: work, business.', ''],
      ['休', 'kyū', 'きゅう', 'yasumi, yasu', 'rest, closed, holiday', 'A person (亻) resting against a tree (木).', '体'],
      ['本', 'hon', 'ほん', 'bon, pon, moto', 'origin, main, book', 'A tree (木) with a mark at its root: the origin. 日本 = Japan, "origin of the sun".', '木']
    ],
    7: [ // toilets, onsen and hotels
      ['男', 'otoko', 'おとこ', 'dan', 'man, men', 'A rice field (田) over strength (力): men working the fields.', ''],
      ['女', 'onna', 'おんな', 'jo, nyo', 'woman, women', 'A kneeling figure with crossed arms.', ''],
      ['手', 'te', 'て', 'shu', 'hand', 'A hand with fingers spread.', ''],
      ['洗', 'arai', 'あらい', 'sen, arau', 'wash', 'Water (氵) on the left: washing. お手洗い = toilet (literally "hand-washing").', ''],
      ['使', 'shi', 'し', 'tsukau', 'use', 'A person (亻) with an official\'s tool: someone using something.', ''],
      ['用', 'yō', 'よう', '', 'use, business', 'A fence or a bucket: something to use. 使用中 = in use, occupied.', '月'],
      ['空', 'aki', 'あき', 'kū, sora, aku, kara', 'empty, vacant, sky', 'A hole (穴) on top of 工: an empty space. 空き = vacant.', ''],
      ['湯', 'yu', 'ゆ', 'tō', 'hot water, bath', 'Water (氵) and the sun (日) warming it: hot water. On onsen curtains: 男湯 / 女湯.', '場温'],
      ['温', 'on', 'おん', 'atataka', 'warm', 'Water (氵) and the sun (日) over a dish: warm water.', '湯'],
      ['泉', 'sen', 'せん', 'izumi', 'spring (of water)', 'White (白) water (水) bubbling up from the ground: a spring. 温泉 = hot spring.', '']
    ],
    8: [ // safety, rules and doors
      ['禁', 'kin', 'きん', '', 'forbidden', 'Two trees (林) above an altar (示): a sacred grove where entry is forbidden.', ''],
      ['止', 'shi', 'し', 'to, tome, tomaru', 'stop', 'A footprint: feet standing still. 止まれ = STOP.', '上正'],
      ['煙', 'en', 'えん', 'kemuri', 'smoke', 'Fire (火) on the left: smoke. 禁煙 = no smoking.', ''],
      ['注', 'chū', 'ちゅう', '', 'pour, pay attention', 'Water (氵) and a lamp: pour carefully, pay attention.', ''],
      ['意', 'i', 'い', '', 'mind, intention', 'A sound (音) over the heart (心): what\'s on your mind. 注意 = caution.', ''],
      ['危', 'ki', 'き', 'abunai', 'danger', 'A person crouching on the edge of a cliff.', ''],
      ['険', 'ken', 'けん', '', 'steep, risky', 'A hill (阝) on the left: steep and risky. 危険 = danger.', ''],
      ['非', 'hi', 'ひ', '', 'not, un-', 'Two wings back to back, pointing apart: opposite, not.', ''],
      ['常', 'jō', 'じょう', 'tsune', 'usual, normal', 'A roof over a cloth (巾): everyday things. 非常 = not normal, emergency.', ''],
      ['押', 'osu', 'おす', 'o, ō', 'push', 'A hand (扌) pressing down on a shell (甲). On doors: push.', ''],
      ['開', 'kai', 'かい', 'hiraku, aku, hira', 'open', 'A gate (門) with its bolt pulled back: open. On lift buttons: ◀▶ 開.', '閉'],
      ['閉', 'hei', 'へい', 'shimaru, tojiru, shime', 'close', 'A gate (門) with a bar (才) across it: closed. On lift buttons: ▶◀ 閉.', '開']
    ]
  };

  var LABELS = {
    1: 'Numbers and prices', 2: 'Entrances and directions', 3: 'Stations and trains', 4: 'Restaurants and food',
    5: 'Shops and money', 6: 'Opening hours and days', 7: 'Toilets, onsen and hotels', 8: 'Safety and rules'
  };

  var KANJI = [], BY_CHAR = {}, UNIT_CHARS = {};
  Object.keys(UNITS).forEach(function (u) {
    var unit = Number(u);
    UNIT_CHARS[unit] = [];
    UNITS[u].forEach(function (row) {
      var e = {
        k: row[0], r: row[1], say: row[2],
        alt: row[3] ? row[3].split(',').map(function (s) { return s.trim(); }) : [],
        meaning: row[4], m: row[5], look: Array.from(row[6] || ''),
        unit: unit, set: 'u' + unit
      };
      KANJI.push(e); BY_CHAR[e.k] = e; UNIT_CHARS[unit].push(e.k);
    });
  });

  root.NB_KANJI = {
    name: 'kanji', Name: 'Kanji', list: KANJI, byChar: BY_CHAR, unitChars: UNIT_CHARS,
    exclude: [], gojuon: [],
    sets: Object.keys(LABELS).map(function (u) { return { set: 'u' + u, label: 'Unit ' + u + ': ' + LABELS[u], wide: true }; }),
    // Kanji have meanings as well as readings: reviews and games ask both.
    hasMeaning: true,
    reviewModes: { weak: ['meaning', 'find', 'see'], mid: ['meaning', 'find', 'type', 'listen'], strong: ['type', 'find', 'meaning', 'type'] }
  };
})(typeof window !== 'undefined' ? window : globalThis);
