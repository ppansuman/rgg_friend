export const TWIT_STYLE_OPTIONS = ['RT', '마음', '탐라대화', '인용', '일상', '수위', '욕트', '스샷', '타장르', '기타'];
export const MAIN_FOCUS_OPTIONS = ['글', '썰', '번역', '그림', '디자인', '코스', '인형', '공예', '영상', '녹음', '소비', '구독', '기타'];
export const COUPLE_OPTIONS = ['HL', 'BL', 'GL', 'NCP/페어', 'ALL', '드림', '기타'];
export const FUB_FREE_OPTIONS = ['OK', 'X', '기타'];
export const BREAKUP_OPTIONS = ['언팔', '블락', '블언블', '기타'];
export const DISLIKE_OPTIONS = ['리버스', '리버시블', '스포일러', '타장르', '기타'];
export const CONSOLE_OPTIONS = ['Steam', 'PlayStation', 'Xbox', 'Nintendo Switch'];

export const ROWS = [
  { type: 'option', key: 'twitStyle', title: '트윗 성향', options: TWIT_STYLE_OPTIONS, otherSmall: true, otherInlineAuto: true },
  { type: 'option', key: 'mainFocus', title: '주력', options: MAIN_FOCUS_OPTIONS, otherSmall: true, otherInlineAuto: true },
  { type: 'option', key: 'couple', title: '커플 성향', options: COUPLE_OPTIONS, otherSmall: true, otherInlineAuto: true },
  { type: 'option', key: 'breakup', title: '이별 시', options: BREAKUP_OPTIONS, otherSmall: true, otherInline: true },
  { type: 'option', key: 'dislike', title: '불호', options: DISLIKE_OPTIONS, otherSmall: true, otherInlineAuto: true },
  { type: 'option', key: 'consoleUsed', title: '사용 콘솔', options: CONSOLE_OPTIONS },
  { type: 'free', key: 'favChar', title: '최애캐/컾' },
  { type: 'custom', key: 'customField' },
  { type: 'free', key: 'comment', title: '한마디', multiline: true },
];

export const LAYOUT = {
  startY: 430,
  rowGap: 58,
  titleX: 140,
  contentX: 338,
  contentOffsetY: 1,
  otherWithBadgeOffsetY: 38,  // 배지+기타 함께일 때 기타 텍스트 Y offset
  otherWithBadgeRowGap: 30,   // 배지+기타 함께일 때 추가 여백
  maxContentWidth: 1450,  // 한마디 여백 한계
};

export const FONT = {
  nickname: { size: 43, weight: 700, tracking: -25, x: 140, y: 350 },
  twitterId: { size: 26, weight: 400, tracking: 0, family: 'Inter', opsz: 32 },
  title: { size: 22, weight: 600, tracking: -25 },
  content: { size: 22, weight: 400, tracking: -25 },
  bartext: { size: 15, weight: 400, tracking: -25 },
  badge: { size: 16, weight: 400, tracking: -25 },
  other: { size: 18, weight: 400, tracking: -25 }
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

export const RIGHT_SECTION_X = 1180
export const RIGHT_SECTION_X_barx1 = RIGHT_SECTION_X + 130
export const RIGHT_SECTION_X_barx2 = RIGHT_SECTION_X_barx1 + 445

export const SPOILER = {
  labelX: RIGHT_SECTION_X,
  barX1: RIGHT_SECTION_X_barx1,
  barX2: RIGHT_SECTION_X_barx2,
  barY: 330,
  thickness: 10,
  otherTextOffsetY: 62,  // 텍스트 위치 (barY 기준)
  otherOffsetY: 80,      // 기타 텍스트O 게임섹션 여백 
  gameOffsetY: 50,       // 기타 텍스트X 게임섹션 여백
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
  '대기': '숨김',
};

export const GAME_STATE_GROUPS = [
  { state: '완료', title: '플레이 및 구매 완료' },
  { state: '플레이중', title: '플레이 중' },
  { state: '구매완료', title: '구매 완료 및 플레이 대기' },
  { state: '대기', title: '플레이 및 구매 대기' },
];

export const GAME_SECTION = {
  x: RIGHT_SECTION_X,
  y: 350,        // 스포일러 없을 때
  yWithSpoiler: 370,   // 스포일러 있을 때
  rowGap: 80,
  badgeGap: 10,
  badgeBottomMargin: 20,
  maxX: 1820,
};

export const HORIZONTAL_SCALE = 0.95;