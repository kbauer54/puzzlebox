import { useState, useEffect, useCallback } from 'react';
import { getUserRank } from './LeaderboardDatabase';
import type { User } from '../types';


const WORDS = [
  'aback','abase','abash','abate','abbey','abbot','abhor','abide','abler','abode',
  'abort','about','above','abuse','abyss','acids','acorn','acres','acted','acute',
  'adage','adapt','adept','admit','adobe','adopt','adore','adorn','adult','affix',
  'afoot','after','again','agate','agave','agent','agile','aglow','agony','agree',
  'ahead','aided','aimed','aired','aisle','alarm','album','alert','algae','align',
  'allay','alley','allot','allow','alloy','aloft','aloof','altar','alter','amber',
  'amble','amend','amiss','amity','ample','amuse','angel','anger','angle','angst',
  'anime','ankle','annex','antic','anvil','aorta','apple','apply','apron','aptly',
  'arbor','ardor','arena','argue','arise','array','arrow','ashen','aside','asset',
  'atone','attic','audit','augur','avail','avert','avian','avoid','awake','award',
  'aware','awful','azure','bacon','badge','badly','bagel','baggy','baker','barge',
  'baron','basic','basil','basin','basis','batch','bathe','bayou','beach','beady',
  'beard','beast','beech','begin','beige','belle','below','bench','berth','berry',
  'birch','bison','biter','bland','blare','blaze','bleak','blend','bless','bliss',
  'bloat','block','blond','bloom','blown','blunt','blurb','blurt','blush','board',
  'boast','bogus','bolts','bonds','bonus','booby','booth','borax','bored','botch',
  'bower','brace','brash','brawl','brawn','braze','brink','briny','broil','brook',
  'broom','broth','brown','brush','brute','buddy','buggy','build','bulky','bully',
  'bunch','burly','burnt','burst','bused','bushy','butch','buyer','bylaw','cable',
  'cadet','camel','candy','cargo','carol','caste','catch','cater','cause','cedar',
  'cease','chaos','chafe','chalk','champ','chant','chard','chasm','cheek','cheep',
  'cheer','chess','chick','chide','chile','chill','chimp','chirp','choke','chomp',
  'chore','chose','civic','civil','clack','claim','clamp','clang','clank','clash',
  'clasp','clave','cling','clink','cloak','clone','close','cloth','cloud','clout',
  'clown','clung','clunk','coils','comet','comic','comma','conic','coral','corps',
  'couch','cough','could','count','coupe','court','coven','cover','covet','craft',
  'cramp','crane','crank','crash','creak','creed','creep','crest','crimp','crisp',
  'crook','cross','croup','crowd','crown','crumb','crush','crust','crypt','cubic',
  'cumin','cupid','curly','curry','curse','cutie','daily','dairy','daisy','dance',
  'darts','datum','daunt','dealt','decay','decoy','defer','delta','dense','depot',
  'derby','depth','devil','dirge','disco','ditch','ditty','dodge','dogma','dolly',
  'donor','dopey','doubt','dough','dowdy','dowel','dowry','draft','drain','drape',
  'drawl','drawn','dread','drier','drift','drink','drool','droop','drove','drown',
  'druid','drunk','dryer','duchy','dully','dumpy','dunce','duped','dwarf','dwell',
  'dwelt','dying','eager','eagle','easel','edged','eerie','eject','elect','elegy',
  'elite','email','ember','emote','endow','enemy','enjoy','epoch','equal','error',
  'essay','ethos','evade','every','evict','exist','exile','extra','fable','facet',
  'faint','fairy','false','farce','fatal','fated','feast','feral','fetch','fever',
  'fiber','fiend','fiery','filth','finch','finer','fishy','fizzy','flair','flank',
  'flaps','flare','flash','flask','flick','fling','flock','flora','floss','flour',
  'flout','flown','flung','flunk','flute','foamy','foggy','foray','forge','forte',
  'forum','found','frail','frame','franc','freak','freed','fresh','frisk','frond',
  'froth','frown','froze','fudge','fully','fungi','funky','funny','furor','furry',
  'gamma','gaudy','gauze','gawky','gecko','giddy','girth','gizmo','gland','glare',
  'gleam','glint','gloat','globe','gloss','glove','glyph','gnash','gnome','gorge',
  'gouge','gourd','grasp','graze','great','greed','greet','grief','grind','groan',
  'groom','gross','grout','grove','growl','gruel','gruff','grunt','guile','guise',
  'gulch','gully','gummy','gusto','gusty','gypsy','habit','hairy','harpy','harsh',
  'haste','hatch','haunt','haven','hazel','hedge','heist','hence','heron','hippo',
  'hitch','hoard','hoary','hobby','holly','homer','horde','hovel','hover','huffy',
  'human','humor','humus','hunch','hurry','husky','hydra','hyena','ideal','idiom',
  'igloo','inane','incur','indie','inert','infer','infra','ingot','inner','inter',
  'intro','ionic','irate','irony','itchy','ivory','jaunt','jazzy','jelly','jerky',
  'jiffy','jingo','jokey','joust','jumbo','jumpy','juror','junto','kayak','kebab',
  'karma','keyed','knack','knave','kneel','knife','knoll','kudos','lance','larva',
  'laser','latch','latte','layer','leapt','ledge','legal','leery','lemur','level',
  'liege','light','lilac','limbo','liner','liver','llama','lodge','lofty','logic',
  'lowly','lucid','lusty','lyric','maize','maker','mango','manly','manor','maple',
  'march','marsh','media','melee','melon','mercy','merge','merit','metal','micro',
  'might','milky','mimic','minor','minus','mirth','miser','model','mogul','moist',
  'molar','moldy','money','moody','moose','moral','mossy','motif','motor','motto',
  'mound','mourn','movie','muddy','mulch','mural','murky','music','musty','myrrh',
  'nadir','naive','nanny','naval','nerve','nervy','nifty','night','ninja','ninny',
  'noble','noise','noisy','north','notch','novel','nymph','oaken','oasis','ocean',
  'octet','offer','often','olive','onion','onset','optic','orbit','order','otter',
  'ought','ounce','outdo','outer','oxide','paint','panic','paper','party','pasta',
  'paste','patsy','pause','peace','peach','perch','pesky','petit','petty','phase',
  'piano','pilot','pinch','pitch','pixel','pixie','place','plain','plank','plant',
  'plate','plaza','plead','pluck','plume','plump','plunk','plush','poach','polar',
  'polka','porch','posse','pouch','pound','power','prank','prawn','price','pride',
  'prime','print','prior','prism','prize','privy','probe','prose','proud','prove',
  'prude','prune','psalm','pudgy','pulse','pulpy','punch','pupil','purer','purge',
  'purse','pygmy','qualm','quaff','quash','quasi','queen','quell','query','quest',
  'queue','quick','quiet','quill','quirk','quota','quote','rabid','radar','radio',
  'rally','ranch','range','rapid','raspy','ratio','raven','reach','react','realm',
  'rebel','rebus','recap','reedy','reign','relax','repel','repro','reply','rider',
  'ridge','risky','rival','river','rivet','roast','robin','robot','rocky','rogue',
  'rondo','roomy','roost','rouge','rough','route','rowdy','royal','ruler','rumen',
  'rupee','rural','rusty','sadly','saint','salad','sauce','saucy','scale','scald',
  'scalp','scant','scare','scarf','scary','scene','scone','scoop','scope','scorn',
  'scour','scowl','scram','scrub','screw','sedan','seize','sense','serum','setup',
  'seven','shake','shall','shame','shape','shark','shard','shave','shawl','sheen',
  'sheer','sheep','shelf','shell','shift','shiny','shirt','shirk','shock','shoal',
  'shone','shook','shoot','short','shout','shuck','siege','sight','sigma','silly',
  'silky','since','sinew','sixth','sixty','skill','skimp','skirt','skull','slant',
  'slash','slave','sleek','sleep','sleet','slept','slide','slick','slime','slimy',
  'sling','slink','slope','slosh','sloth','slunk','slurp','smack','smash','smart',
  'smear','smell','smile','smirk','smoke','smoky','snack','snail','snaky','snare',
  'sneak','snide','snoop','snore','snort','snowy','soapy','solar','solid','sonar',
  'sonic','sorry','south','space','spade','spank','spare','spark','spasm','speak',
  'speck','speed','spend','spice','spill','spine','spite','split','spook','sport',
  'spout','spree','sprig','squad','squat','squid','stack','stage','stain','stair',
  'stake','stale','stalk','stall','stamp','stand','stank','stare','stark','start',
  'stash','state','stead','steal','steam','steel','steep','steer','stern','stick',
  'stiff','still','stoic','stomp','stood','stock','stone','store','storm','story',
  'strap','stray','strut','stuck','study','stuff','stump','stung','stunk','stunt',
  'style','sugar','suite','sunny','super','surge','surly','sushi','swamp','swear',
  'sweat','sweep','swell','swept','swoop','sword','syrup','tabby','table','talon',
  'taste','taunt','tawny','teach','tepid','tense','terse','theme','thick','thing',
  'think','three','threw','throw','thumb','thong','thorn','those','thump','thunk',
  'tiara','tidal','tiger','timid','tinge','tipsy','titan','today','token','tonal',
  'topic','topaz','total','totem','touch','tough','tower','towel','toxic','trace',
  'track','trade','trail','train','trait','tramp','trash','trawl','tread','treat',
  'trend','tribe','tried','tripe','trite','troop','truck','trump','trunk','truss',
  'trust','tryst','truly','truth','tulip','tumor','tuner','turbo','tutor','twist',
  'tying','typed','udder','ulcer','ultra','umbra','uncle','under','undue','unify',
  'union','unite','unlit','until','unzip','upper','upset','urban','usage','usurp',
  'usual','utter','vague','valid','valor','valve','vaunt','video','vigor','vinyl',
  'viola','viral','visit','vista','vital','vivid','vixen','vocal','vodka','voice',
  'voter','vouch','vying','wacky','wages','waltz','waste','watch','water','waves',
  'waver','weary','weave','wedge','weedy','weigh','weird','welch','whelp','whale',
  'wheat','where','which','while','whack','whiff','white','whiny','whole','whirl',
  'whisk','whoop','whose','wider','witch','witty','woman','women','world','worse',
  'worst','worth','would','wrath','wring','wrong','wrote','yacht','years','yearn',
  'yield','young','youth','zappy','zebra','zesty','zilch','zippy','zonal','zoned',
  'abuzz','acrid','agist','agone','agora','alamo','aleph','alien','alpen','ambit',
  'amice','annul','apian','aping','apish','apnea','ariel','arson','askew','atoll',
  'atopy','avast','avens','awash','axiom','baler','balmy','bandy','banjo','barmy',
  'baste','batik','began','begun','bight','biome','bitty','bleat','bleed','blink',
  'bloke','bloop','bluff','boggy','bonce','boxer','breve','brill','brine','bruit',
  'bulge','bursa','busby','byway','cabal','cache','cairn','canny','caper','capon',
  'carve','caulk','china','chive','cleat','clime','coble','codex','codon','comfy',
  'compo','conch','condo','copse','corgi','corse','cosey','coyly','crave','crawl',
  'croak','croft','croon','cruel','cruse','cubby','curio','daffy','dandy','dated',
  'dauby','dazed','decal','decry','deify','delve','demur','deter','detox','deuce',
  'diary','dicot','dingo','dinky','ditzy','divvy','dizzy','dodgy','dosed','dowse',
  'droit','dross','dusky','dusty','duvet','ebony','egret','elbow','elder','elide',
  'elude','emcee','emery','empty','enema','ennui','ensue','envoy','equip','erupt',
  'evoke','exact','exert','expel','extol','fadge','faery','fagot','faith','fangs',
  'farcy','faugh','favor','fecal','felon','fetus','fibre','finky','flail','flaky',
  'flame','fleam','flesh','float','flume','folio','folly','frump','fugue','fussy',
  'gluer','golem','goody','gorse','haute','heady','heave','heavy','henna','herby',
  'icier','icily','icing','idler','idyll','imply','inept','infix','inlay','input',
  'inure','irked','labio','ladle','lairy','lapse','larch','lardy','lumen','mangy',
  'natch','piney','polis','polyp','poppy','pouty','primo','primp','proxy','savvy',
  'scaly','sedge','seedy','servo','shady','shaky','shaly','shtum','slump','soggy',
  'soppy','soupy','spiky','spiny','stave','stewy','stogy','sudsy','sulky','surfy',
  'swami','swipe','swirl','taboo','tally','taffy','tangy','tardy','tarty','tasty',
  'tatty','teary','teddy','tempt','tenth','testy','tinny','tippy','toffy','tolly',
  'tonic','tummy','tunic','tusky','twixt','typal','ulnar','unmet','unset','unwed',
  'vapid','vexed','vicar','vigil','viper','vowed','waged','wafer','waken','wally',
  'warty','waspy','wetly','whelk','wimpy','windy','wired','wispy','woken','wormy',
  'wordy','woven','yappy','yawny','yenta','yodel','yokel','yucky','yummy','zincy',
];

type TileState = 'correct' | 'present' | 'absent' | 'filled' | 'empty';
type GameStatus = 'playing' | 'won' | 'lost';
interface TileResult { letter: string; state: TileState; }

const WORD_LENGTH  = 5;
const MAX_GUESSES  = 6;
const WIN_MESSAGES = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
const SCORE_MAP: Record<number, number> = { 1: 600, 2: 500, 3: 400, 4: 300, 5: 200, 6: 100 };

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

const TILE_BG: Record<TileState, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c', filled: 'transparent', empty: 'transparent',
};
const TILE_BORDER: Record<TileState, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c', filled: '#565758', empty: '#3a3a3c',
};
const KEY_BG: Record<string, string> = {
  correct: '#538d4e', present: '#b59f3b', absent: '#3a3a3c',
};

function pickRandom(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
}

function evaluateGuess(guess: string, answer: string): TileResult[] {
  const result: TileResult[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    letter: guess[i], state: 'absent' as TileState,
  }));
  const remaining = answer.split('');
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) { result[i].state = 'correct'; remaining[i] = ''; }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].state === 'correct') continue;
    const idx = remaining.indexOf(guess[i]);
    if (idx !== -1) { result[i].state = 'present'; remaining[idx] = ''; }
  }
  return result;
}

interface WordleGameProps {
  user: User | null;
  onScoreUpdate?: (score: number) => void;
  onNavigate: (page: string) => void;
  /** Called when a guest clicks Register after winning — passes the score so it can be saved immediately on account creation */
  onRegisterWithScore: (score: number, puzzleId: string) => void;
}

export default function WordleGame({ user, onScoreUpdate, onNavigate, onRegisterWithScore }: WordleGameProps) {
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer]         = useState(pickRandom);
  const [guesses, setGuesses]       = useState<TileResult[][]>([]);
  const [current, setCurrent]       = useState('');
  const [status, setStatus]         = useState<GameStatus>('playing');
  const [revealRow, setRevealRow]   = useState<number | null>(null);
  const [shakeRow, setShakeRow]     = useState(false);
  const [toast, setToast]           = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [userRank, setUserRank]     = useState<number | null>(null);

  const isGuest = !user;

  // If the user registers after winning, fetch their rank immediately
  useEffect(() => {
    if (user && status === 'won' && userRank === null) {
      const rank = getUserRank(user.uid, 'wordle');
      setUserRank(rank);
    }
  }, [user, status, userRank]);

  const showToast = (msg: string, ms = 1800) => {
    setToast(msg); setTimeout(() => setToast(''), ms);
  };

  const keyStates = guesses.reduce<Record<string, TileState>>((acc, row) => {
    row.forEach(({ letter, state }) => {
      const prev = acc[letter];
      if (prev === 'correct') return;
      if (prev === 'present' && state !== 'correct') return;
      acc[letter] = state;
    });
    return acc;
  }, {});

  const submitGuess = useCallback(() => {
    if (current.length !== WORD_LENGTH) {
      setShakeRow(true); setTimeout(() => setShakeRow(false), 500);
      showToast('Not enough letters'); return;
    }
    if (!WORDS.includes(current.toLowerCase())) {
      setShakeRow(true); setTimeout(() => setShakeRow(false), 500);
      showToast('Not in word list'); return;
    }

    const result     = evaluateGuess(current, answer);
    const newGuesses = [...guesses, result];
    setGuesses(newGuesses);
    setRevealRow(newGuesses.length - 1);
    setCurrent('');

    const won = result.every(t => t.state === 'correct');

    if (won) {
      const score = SCORE_MAP[newGuesses.length] ?? 100;
      setFinalScore(score);
      setTimeout(() => {
        setStatus('won');
        showToast(WIN_MESSAGES[newGuesses.length - 1] ?? 'Nice!', 2000);
        if (!isGuest) {
          onScoreUpdate?.(score);
          setTimeout(() => {
            if (user) setUserRank(getUserRank(user.uid, 'wordle'));
          }, 100);
        }
      }, WORD_LENGTH * 350 + 300);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(() => {
        setStatus('lost');
        showToast(answer, 3500);
      }, WORD_LENGTH * 350 + 300);
    }
  }, [current, guesses, answer, isGuest, user, onScoreUpdate]);

  const handleKey = useCallback((key: string) => {
    if (status !== 'playing') return;
    if (key === 'ENTER')                                           { submitGuess(); }
    else if (key === 'BACKSPACE' || key === '⌫')                   { setCurrent(g => g.slice(0, -1)); }
    else if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) { setCurrent(g => g + key); }
  }, [status, current, submitGuess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  const reset = () => {
    setAnswer(pickRandom()); setGuesses([]); setCurrent('');
    setStatus('playing'); setRevealRow(null); setToast('');
    setFinalScore(0); setUserRank(null);
  };

  return (
    <div style={s.page}>
      <div style={s.breadcrumb} onClick={() => onNavigate('home')}>← Home</div>

      <div style={s.gameArea}>
        <div style={s.header}>
          <h1 style={s.title}>WORDLE</h1>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'monospace' }}>
            <button
              onClick={() => setShowHint(h => !h)}
              style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text-muted)', fontSize: 10, cursor: 'pointer', padding: '2px 7px', marginRight: 6 }}
            >
              {showHint ? 'hide' : '🛠 hint'}
            </button>
            {showHint && <>answer: <strong style={{ color: 'var(--yellow)' }}>{answer}</strong></>}
          </div>          
          <div style={s.divider} />
        </div>

        <div style={{ ...s.toast, opacity: toast ? 1 : 0 }}>{toast}</div>

        <div style={s.grid}>
          {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => {
            const isCurrent   = rowIdx === guesses.length && status === 'playing';
            const completed   = guesses[rowIdx];
            const isRevealing = revealRow === rowIdx;
            const doShake     = isCurrent && shakeRow;
            return (
              <div key={rowIdx} style={{ ...s.row, animation: doShake ? 'wShake 0.5s ease' : undefined }}>
                {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => {
                  let letter = ''; let state: TileState = 'empty';
                  if (completed) { letter = completed[colIdx].letter; state = completed[colIdx].state; }
                  else if (isCurrent) { letter = current[colIdx] ?? ''; state = letter ? 'filled' : 'empty'; }
                  const delay = isRevealing ? `${colIdx * 350}ms` : '0ms';
                  return (
                    <div key={colIdx} style={{
                      ...s.tile,
                      background:  completed ? TILE_BG[state] : 'transparent',
                      borderColor: TILE_BORDER[state],
                      transform:   (!completed && letter) ? 'scale(1.06)' : 'scale(1)',
                      transition:  'transform 0.08s ease',
                      animation:   isRevealing ? `wFlip 0.6s ease ${delay} forwards` : undefined,
                    }}>
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={s.keyboard}>
          {KEYBOARD_ROWS.map((row, ri) => (
            <div key={ri} style={s.keyRow}>
              {row.map(key => {
                const wide = key === 'ENTER' || key === '⌫';
                const bg   = KEY_BG[keyStates[key]] ?? '#818384';
                return (
                  <button key={key} onClick={() => handleKey(key)}
                    style={{ ...s.key, ...(wide ? s.keyWide : {}), background: bg, fontSize: key === 'ENTER' ? 10 : 14 }}>
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {status !== 'playing' && (
          <div style={s.overlay}>
            <div style={s.endPanel} className="pop-in">

              {status === 'won' && (
                <>
                  <div style={s.endEmoji}>🏆</div>
                  <div style={s.endScore}>{finalScore} pts</div>
                  <div style={s.endSub}>
                    Solved in {guesses.length} {guesses.length === 1 ? 'guess' : 'guesses'}
                  </div>
                  {!isGuest && (
                    <div style={s.rankRow}>
                      <span style={s.rankLabel}>Your Wordle Rank</span>
                      <span style={s.rankValue}>
                        {userRank !== null ? `#${userRank}` : '…'}
                      </span>
                    </div>
                  )}
                  {isGuest && (
                    <div style={s.guestNudge}>
                      <p style={s.nudgeText}>
                        Register to save your <strong style={{ color: 'var(--yellow)' }}>{finalScore} pts</strong> and appear on the leaderboard!
                      </p>
                      <button style={s.nudgeBtn} onClick={() => onRegisterWithScore(finalScore, 'wordle')}>
                        Register &amp; Save Score →
                      </button>
                    </div>
                  )}
                </>
              )}

              {status === 'lost' && (
                <>
                  <div style={s.endEmoji}>😔</div>
                  <div style={{ ...s.endScore, fontSize: 22 }}>Better luck next time</div>
                  <div style={s.endSub}>
                    The word was <strong style={{ color: 'var(--yellow)' }}>{answer}</strong>
                  </div>
                  {isGuest && (
                    <div style={s.guestNudge}>
                      <p style={s.nudgeText}>
                        Register free to track your progress and compete on the leaderboard.
                      </p>
                      <button style={s.nudgeBtn} onClick={() => onRegisterWithScore(0, 'wordle')}>
                        Register Free →
                      </button>
                    </div>
                  )}
                </>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'center' }}>
                <button style={s.btnGhost} onClick={() => onNavigate('leaderboard')}>Leaderboard</button>
                <button style={s.btnPrimary} onClick={reset}>Play Again →</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes wFlip {
          0%   { transform: rotateX(0deg); }
          49%  { transform: rotateX(-90deg); }
          50%  { transform: rotateX(-90deg); }
          100% { transform: rotateX(0deg); }
        }
        @keyframes wShake {
          0%, 100% { transform: translateX(0); }
          15%      { transform: translateX(-5px); }
          45%      { transform: translateX(5px); }
          75%      { transform: translateX(-3px); }
          90%      { transform: translateX(3px); }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: 520, margin: '0 auto', padding: '24px 16px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  breadcrumb: { alignSelf: 'flex-start', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', marginBottom: 16 },
  gameArea: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
  header: { textAlign: 'center', width: '100%', maxWidth: 360, marginBottom: 8 },
  title: { fontSize: 28, fontWeight: 700, letterSpacing: '0.3rem', color: 'var(--text)', fontFamily: 'Inter, sans-serif', marginBottom: 12 },
  divider: { width: '100%', height: 1, background: 'var(--border)' },
  toast: { background: '#fff', color: '#121213', fontWeight: 700, fontSize: 13, padding: '9px 20px', borderRadius: 6, margin: '10px 0', transition: 'opacity 0.2s', pointerEvents: 'none', minHeight: 36, display: 'flex', alignItems: 'center' },
  grid: { display: 'flex', flexDirection: 'column', gap: 5, margin: '8px 0 20px' },
  row: { display: 'flex', gap: 5 },
  tile: { width: 58, height: 58, border: '2px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', color: '#fff', borderRadius: 2, fontFamily: 'Inter, sans-serif' },
  keyboard: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 },
  keyRow: { display: 'flex', gap: 5, justifyContent: 'center' },
  key: { height: 54, minWidth: 40, borderRadius: 4, border: 'none', color: '#fff', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', fontFamily: 'Inter, sans-serif', transition: 'background 0.1s', WebkitTapHighlightColor: 'transparent' },
  keyWide: { minWidth: 62, fontSize: 10 },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(14,14,14,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', zIndex: 10, borderRadius: 8 },
  endPanel: { textAlign: 'center', padding: '28px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, width: '100%', maxWidth: 320, margin: '0 16px' },
  endEmoji: { fontSize: 40, marginBottom: 10 },
  endScore: { fontFamily: "'Playfair Display', serif", fontSize: 30, color: 'var(--yellow)', fontWeight: 700, marginBottom: 4 },
  endSub: { fontSize: 13, color: 'var(--text-dim)', marginBottom: 14 },
  rankRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', marginBottom: 14 },
  rankLabel: { fontSize: 12, color: 'var(--text-muted)' },
  rankValue: { fontSize: 20, fontWeight: 700, color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace" },
  guestNudge: { background: 'rgba(200,168,75,0.08)', border: '1px solid var(--yellow-dim)', borderRadius: 8, padding: '12px 16px', marginBottom: 14 },
  nudgeText: { fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: 10 },
  nudgeBtn: { background: 'var(--yellow)', color: '#111', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%' },
  btnPrimary: { background: '#538d4e', color: '#fff', border: 'none', borderRadius: 6, padding: '11px 22px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
  btnGhost: { background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 18px', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' },
};