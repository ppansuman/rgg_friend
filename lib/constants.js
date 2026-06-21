export const TWIT_STYLE_OPTIONS = ['RT', '마음', '탐라대화', '인용', '일상', '수위', '욕트', '스샷', '타장르', '기타'];
export const MAIN_FOCUS_OPTIONS = ['글', '썰', '번역', '그림', '디자인', '코스', '인형', '공예', '영상', '녹음', '소비', '구독', '기타'];
export const COUPLE_OPTIONS = ['HL', 'BL', 'GL', 'NCP/페어', 'ALL', '드림', '기타'];
export const BREAKUP_OPTIONS = ['언팔', '블락', '블언블', '기타'];
export const DISLIKE_OPTIONS = ['리버스', '리버시블', '스포일러', '타장르', '기타'];
export const CONSOLE_OPTIONS = ['Steam', 'PlayStation', 'Xbox', 'Nintendo Switch'];

export const ROWS = [
  { type: 'option', key: 'twitStyle',   title: '트윗 성향', options: TWIT_STYLE_OPTIONS,  otherInlineAuto: true },
  { type: 'option', key: 'mainFocus',   title: '주력',      options: MAIN_FOCUS_OPTIONS,  otherInlineAuto: true },
  { type: 'option', key: 'couple',      title: '커플 성향', options: COUPLE_OPTIONS,       otherInlineAuto: true },
  { type: 'option', key: 'breakup',     title: '이별 시',   options: BREAKUP_OPTIONS,      otherInline: true },
  { type: 'option', key: 'dislike',     title: '불호',      options: DISLIKE_OPTIONS,      otherInlineAuto: true },
  { type: 'option', key: 'consoleUsed', title: '사용 콘솔', options: CONSOLE_OPTIONS },
  { type: 'free',   key: 'favChar',     title: '최애캐/컾' },
  { type: 'custom', key: 'customField' },
  { type: 'free',   key: 'comment',     title: '한마디', multiline: true },
];

// 이미지 크기 (세로형만)
export const IMAGE_SIZE = {
  vertical: { width: 1420, minHeight: 1420 },
};

export const GAME_STATES = ['완료', '플레이중', '구매완료', '대기'];

export const GAME_STATE_LABELS = {
  '완료':    '완료',
  '플레이중': '플레이 중',
  '구매완료': '구매 완료',
  '대기':    '숨김',
};

export const GAME_STATE_GROUPS = [
  { state: '완료',    title: '플레이 완료' },
  { state: '플레이중', title: '플레이 중' },
  { state: '구매완료', title: '구매 완료 및 플레이 대기' },
];

export const GAMES = [
  { key: 'strangerThanHeaven',  title: '스트레인저 댄 헤븐' },
  { key: 'yakuza0',             title: '용과 같이 0' },
  { key: 'yakuza1Kiwami',       title: '용과 같이 1/극' },
  { key: 'yakuza2Kiwami',       title: '용과 같이 2/극' },
  { key: 'yakuza3Kiwami',       title: '용과 같이 3/극' },
  { key: 'yakuza3Gaiden',       title: '용과 같이 3 외전' },
  { key: 'yakuza4',             title: '용과 같이 4' },
  { key: 'yakuza5',             title: '용과 같이 5' },
  { key: 'yakuza6',             title: '용과 같이 6' },
  { key: 'yakuza7',             title: '용과 같이 7' },
  { key: 'yakuza7Gaiden',       title: '용과 같이 7 외전' },
  { key: 'yakuza8',             title: '용과 같이 8' },
  { key: 'yakuza8Gaiden',       title: '용과 같이 8 외전' },
  { key: 'yakuzaIshinKiwami',   title: '용과 같이 유신!/극' },
  { key: 'yakuzaOnline',        title: '용과 같이 온라인' },
  { key: 'yakuzaOTE',           title: '용과 같이 OTE' },
  { key: 'yakuzaKenzan',        title: '용과 같이 켄잔!' },
  { key: 'judgeEyes',           title: '저지 아이즈' },
  { key: 'lostJudgment',        title: '로스트 저지먼트' },
  { key: 'lostJudgmentDLC',     title: '로스트 저지먼트 DLC' },
  { key: 'likeADragonHokuto',   title: '북두와 같이' },
  { key: 'kurohyo1',            title: '흑표 1' },
  { key: 'kurohyo2',            title: '흑표 2' },
];
export const FAMILY_ICONS = [
  { key: 'tojo',     label: '동성회',  src: '/family/tojo.png' },
  { key: 'omi',      label: '오미연합', src: '/family/omi.png' },
  { key: 'police',   label: '경찰',    src: '/family/police.png' },
  { key: 'bengoshi', label: '변호사',  src: '/family/bengoshi.png' },
];

// 사이트 설정
export const SITE_URL = 'rgg-friend.vercel.app';
export const DEFAULT_ACCENT = '#e29898';
export const LS_KEYS = [
  'rgg_accentColor', 'rgg_bgColor', 'rgg_badgeTextCustom',
  'rgg_familyIcon',
  'rgg_nickname', 'rgg_twitterId', 'rgg_fubFree',
  'rgg_customTitle', 'rgg_customValue',
  'rgg_selections', 'rgg_spoilerValue', 'rgg_spoilerOther',
  'rgg_gameStates',
];