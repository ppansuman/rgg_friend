export const TWIT_STYLE_OPTIONS = ['RT', '마음', '탐라대화', '인용', '일상', '수위', '타장르', '기타'];
export const MAIN_FOCUS_OPTIONS = ['글', '썰', '번역', '그림', '코스', '인형', '공예', '영상', '녹음', '소비', '구독', '기타'];
export const COUPLE_OPTIONS = ['HL', 'BL', 'GL', 'NCP/페어', 'ALL', '드림', '기타'];
export const FUB_FREE_OPTIONS = ['OK', 'X', '기타'];
export const BREAKUP_OPTIONS = ['언팔', '블락', '블언블', '기타'];
export const DISLIKE_OPTIONS = ['리버스', '스포일러', '타장르', '기타'];
export const CONSOLE_OPTIONS = ['PlayStation', 'Xbox', 'Steam', 'Nintendo Switch'];

export const ROWS = [
  { type: 'option', key: 'twitStyle', title: '트윗 성향', options: TWIT_STYLE_OPTIONS },
  { type: 'option', key: 'mainFocus', title: '주력', options: MAIN_FOCUS_OPTIONS },
  { type: 'option', key: 'couple', title: '커플 성향', options: COUPLE_OPTIONS },
  { type: 'option', key: 'fubFree', title: 'FUB FREE', options: FUB_FREE_OPTIONS, radioOptions: ['OK', 'X'] },
  { type: 'option', key: 'breakup', title: '이별 시', options: BREAKUP_OPTIONS },
  { type: 'option', key: 'dislike', title: '불호', options: DISLIKE_OPTIONS },
  { type: 'option', key: 'consoleUsed', title: '사용 콘솔', options: CONSOLE_OPTIONS },
  { type: 'free', key: 'favChar', title: '최애캐/컾' },
  { type: 'free', key: 'comment', title: '한마디', multiline: true },
];

export const LAYOUT = {
  startY: 430,
  rowGap: 65,
  titleX: 140,
  contentX: 337.7061,
};

export const FONT = {
  nickname: { size: 35, weight: 700, tracking: -25, x: 140, y: 350 },
  title: { size: 22, weight: 600, tracking: -25 },
  content: { size: 22, weight: 400, tracking: -25 },
  bartext: { size: 15, weight: 400, tracking: -25 },
  badge: { size: 16, weight: 400, tracking: -25 },
};

export const BACKGROUNDS = [
  { file: 'BG_2026_tojo.png', label: '동성회', accent: '#db7d7d', type: '트친소' },
  { file: 'BG_2026_omi.png', label: '오미연합', accent: '#cab366', type: '트친소' },
  { file: 'BG_2026_keisatsu.png', label: '경찰', accent: '#6ca3e1', type: '트친소' },
  { file: 'BG_2026_bengoshi.png', label: '변호사', accent: '#8ac2a3', type: '트친소' },
  { file: 'BG_2026_tojo2.png', label: '동성회', accent: '#db7d7d', type: '소개표' },
  { file: 'BG_2026_omi2.png', label: '오미연합', accent: '#cab366', type: '소개표' },
  { file: 'BG_2026_keisatsu2.png', label: '경찰', accent: '#6ca3e1', type: '소개표' },
  { file: 'BG_2026_bengoshi2.png', label: '변호사', accent: '#8ac2a3', type: '소개표' },
];

export const COLORS = {
  text: '#222222',
  barBackground: '#dddddd',
  waitingBadgeBg: '#eeeeee',
  waitingBadgeText: '#aaaaaa',
  badgeText: '#ffffff',
};

export const SPOILER = {
  labelX: 1200,
  barX1: 1365,
  barX2: 1810,
  barY: 330,
  thickness: 10,
};

export const GAME_STATES = ['완료', '플레이중', '구매완료', '대기'];

export const GAMES = [
  { key: 'strangerThanHeaven', title: '스트레인저 댄 헤븐' },
  { key: 'yakuza0', title: '용과 같이 0' },
  { key: 'yakuza1Kiwami', title: '용과 같이 1/극' },
  { key: 'yakuza2Kiwami', title: '용과 같이 2/극' },
  { key: 'yakuza3Kiwami', title: '용과 같이 3/극' },
  { key: 'yakuza3Gaiden', title: '용과 같이 3 외전' },
  { key: 'yakuza4', title: '용과 같이 4' },
  { key: 'yakuza5', title: '용과 같이 5' },
  { key: 'yakuza6', title: '용과 같이 6' },
  { key: 'yakuza7', title: '용과 같이 7' },
  { key: 'yakuza7Gaiden', title: '용과 같이 7 외전' },
  { key: 'yakuza8', title: '용과 같이 8' },
  { key: 'yakuza8Gaiden', title: '용과 같이 8 외전' },
  { key: 'yakuzaIshinKiwami', title: '용과 같이 유신!/극' },
  { key: 'yakuzaOnline', title: '용과 같이 온라인' },
  { key: 'yakuzaOTE', title: '용과 같이 OTE' },
  { key: 'yakuzaKenzan', title: '용과 같이 켄잔!' },
  { key: 'judgeEyes', title: '저지 아이즈' },
  { key: 'lostJudgment', title: '로스트 저지먼트' },
  { key: 'lostJudgmentDLC', title: '로스트 저지먼트 DLC' },
  { key: 'likeADragonHokuto', title: '북두와 같이' },
  { key: 'kurohyo1', title: '흑표 1' },
  { key: 'kurohyo2', title: '흑표 2' },
];

export const GAME_STATE_LABELS = {
  '완료': '완료',
  '플레이중': '플레이 중',
  '구매완료': '구매 완료',
  '대기': '대기',
};

export const GAME_STATE_GROUPS = [
  { state: '완료', title: '플레이 및 구매 완료' },
  { state: '플레이중', title: '플레이 중' },
  { state: '구매완료', title: '구매 완료' },
  { state: '대기', title: '플레이 및 구매 대기' },
];

export const GAME_SECTION = {
  x: 1200,
  y: 450,
  rowGap: 80,
  badgeGap: 10,
  badgeBottomMargin: 20,
  maxX: 1880,
};

export const HORIZONTAL_SCALE = 0.95;