export const TWIT_STYLE_OPTIONS = ['RT', '마음', '탐라대화', '인용', '일상', '수위', '욕트', '스샷', '타장르', '기타'];
export const SUBSCRIBE_OPTIONS = ['FUB FREE', 'MUTUALS ONLY'];
export const MAIN_FOCUS_OPTIONS = ['글', '썰', '번역', '그림', '디자인', '코스', '인형', '공예', '영상', '녹음', '소비', '구독', '기타'];
export const COUPLE_OPTIONS = ['HL', 'BL', 'GL', 'NCP/페어', 'ALL', '드림', '기타'];
export const BREAKUP_OPTIONS = ['언팔', '블락', '블언블', '기타'];
export const DISLIKE_OPTIONS = ['리버스', '리버시블', '스포일러', '타장르', '기타'];
export const CONSOLE_OPTIONS = ['Steam', 'PlayStation', 'Xbox', 'Nintendo Switch'];

export const ROWS = [
  { type: 'option', key: 'twitStyle', title: '트윗 성향', options: TWIT_STYLE_OPTIONS, otherInlineAuto: true },
  { type: 'option', key: 'mainFocus', title: '주력', options: MAIN_FOCUS_OPTIONS, otherInlineAuto: true },
  { type: 'option', key: 'couple', title: '커플 성향', options: COUPLE_OPTIONS, otherInlineAuto: true },
  { type: 'option', key: 'breakup', title: '이별 시', options: BREAKUP_OPTIONS, otherInline: true },
  { type: 'option', key: 'dislike', title: '불호', options: DISLIKE_OPTIONS, otherInlineAuto: true },
  { type: 'option', key: 'consoleUsed', title: '사용 콘솔', options: CONSOLE_OPTIONS },
  { type: 'free', key: 'favChar', title: '최애캐/컾' },
  { type: 'custom', key: 'customField' },
  { type: 'free', key: 'comment', title: '한마디', multiline: true },
];

// 이미지 크기 (세로형만)
export const IMAGE_SIZE = {
  vertical: { width: 1420, minHeight: 1420 },
};

export const GAME_STATES = ['완료', '플레이중', '구매완료', '대기'];

export const GAME_STATE_LABELS = {
  '완료': '완료',
  '플레이중': '플레이 중',
  '구매완료': '구매 완료',
  '대기': '숨김',
};

export const GAME_STATE_GROUPS = [
  { state: '완료', title: '플레이 완료' },
  { state: '플레이중', title: '플레이 중' },
  { state: '구매완료', title: '구매 완료 및 플레이 대기' },
];

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
  { key: 'yakuzaWars', title: '야쿠자 워즈' },
  { key: 'yakuzaOTE', title: '용과 같이 OTE' },
  { key: 'yakuzaKenzan', title: '용과 같이 켄잔!' },
  { key: 'judgeEyes', title: '저지 아이즈' },
  { key: 'lostJudgment', title: '로스트 저지먼트' },
  { key: 'lostJudgmentDLC', title: '로스트 저지먼트 DLC' },
  { key: 'likeADragonHokuto', title: '북두와 같이' },
  { key: 'kurohyo1', title: '흑표 1' },
  { key: 'kurohyo2', title: '흑표 2' },
];
export const FAMILY_ICONS = [
  { key: 'tojo', label: '동성회', src: '/family/tojo.png' },
  { key: 'omi', label: '오미연합', src: '/family/omi.png' },
  { key: 'police', label: '경찰', src: '/family/police.png' },
  { key: 'bengoshi', label: '변호사', src: '/family/bengoshi.png' },
  { key: 'geomijul', label: '거미줄', src: '/family/geomijul.png' },
  { key: 'goro', label: '고로 해적단', src: '/family/goro1.png', srcDark: '/family/goro2.png' },
  { key: 'kijin', label: '귀인회', src: '/family/kijin.png' },
  { key: 'asagao', label: '나팔꽃', src: '/family/asagao.png' },
  { key: 'nishikiyama', label: '니시키야마조', src: '/family/nishikiyama.png' },
  { key: 'dych', label: '다이너체어', src: '/family/dych1.png', srcDark: '/family/dych2.png' },
  { key: 'dojima', label: '도지마조', src: '/family/dojima.png' },
  { key: 'ryudoikka', label: '류도일가', src: '/family/ryudoikka.png' },
  { key: 'ryudo', label: '류도회', src: '/family/ryudo.png' },
  { key: 'majima', label: '마지마조', src: '/family/majima.png' },
  { key: 'matsugane', label: '마츠가네조', src: '/family/matsugane.png' },
  { key: 'barracuda', label: '바라쿠다', src: '/family/barracuda1.png', srcDark: '/family/barracuda2.png' },
  { key: 'hakuho', label: '백봉회', src: '/family/hakuho.png' },
  { key: 'bj', label: '블리치 재팬', src: '/family/bj1.png', srcDark: '/family/bj2.png' },
  { key: 'saejima', label: '사에지마조', src: '/family/saejima.png' },
  { key: 'someya', label: '소메야 일가', src: '/family/someya.png' },
  { key: 'sky', label: '스카이파이낸스', src: '/family/sky.png' },
  { key: 'stardust', label: '스타더스트', src: '/family/stardust.png' },
  { key: 'shibusawa', label: '시부사와조', src: '/family/shibusawa.png' },
  { key: 'shinsengumi', label: '신선조', src: '/family/shinsengumi.png' },
  { key: 'arakawa', label: '아라카와조', src: '/family/arakawa.png' },
  { key: 'haruka', label: '아이돌', src: '/family/idol.png' },
  { key: 'akame', label: '아카메 네트워크', src: '/family/akame.png' },
  { key: 'yamai', label: '야마이 일파', src: '/family/yamai1.png', srcDark: '/family/yamai2.png' },
  { key: 'osakaent', label: '오사카흥업', src: '/family/osakaent.png' },
  { key: 'watase', label: '와타세조', src: '/family/watase.png' },
  { key: 'youtian', label: '우천반점', src: '/family/youtian.png' },
  { key: 'ishioda', label: '이시오다조', src: '/family/ishioda.png' },
  { key: 'ichiban', label: '이치반 홀딩스', src: '/family/ichiban1.png', srcDark: '/family/ichiban2.png' },
  { key: 'nikkyo', label: '일협연합', src: '/family/nikkyo.png' },
  { key: 'kazama', label: '카자마조', src: '/family/kazama.png' },
  { key: 'kenno', label: '쿠제 권왕회', src: '/family/kenno.png' },
  { key: 'teihei', label: '태평일가', src: '/family/taihei.png' },
  { key: 'palekana', label: '팔레카나', src: '/family/palekana1.png', srcDark: '/family/palekana2.png' },
  { key: 'goryu', label: '향룡회', src: '/family/goryu.png' },
];

// 사이트 설정
export const SITE_URL = 'rgg-friend.vercel.app';
export const DEFAULT_ACCENT = '#e29898';

export const FONT_OPTIONS = [
  { value: 'Pretendard', label: 'Pretendard (기본)' },
  { value: "'JoseonGulim', sans-serif", label: '조선굴림체' },
  { value: "'MaruBuri', serif", label: '마루 부리' },
  { value: "'ChosunIlboMyungjo', serif", label: '조선일보명조체' },
  { value: "'KyoboHandwriting2019', sans-serif", label: '교보손글씨 2019' },
  { value: "'Galmuri11', sans-serif", label: '갈무리11' },
];

export const LAYOUT_OPTIONS = [
  ['vertical', '세로'],
  ['horizontal', '가로'],
];

export const BG_COLOR_PRESETS = [
  ['#ffffff', '밝은 배경', '3px solid #cccccc'],
  ['#1a1a1a', '어두운 배경', '3px solid #555555'],
];

// 배경(밝음/어둠)에 따른 포인트컬러 프리셋. 동일 인덱스끼리 밝음↔어둠 짝을 이룬다.
export const ACCENT_PRESETS = [
  { light: '#e29898', dark: '#7b4747', label: '동성회' },
  { light: '#cab366', dark: '#7b692d', label: '오미연합' },
  { light: '#6ca3e1', dark: '#2a4f79', label: '경찰' },
  { light: '#8ac2a3', dark: '#3c7260', label: '변호사' },
];

export const STICKER_MAX_SIZE_BYTES = 500 * 1024; // 500KB
export const HEADER_IMAGE_MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB
export const HEADER_IMAGE_DEFAULT = { zoom: 1, offsetXPct: 0, offsetYPct: 0, rotation: 0 };

export const LS_KEYS = [
  'rgg_accentColor', 'rgg_bgColor', 'rgg_badgeTextCustom',
  'rgg_familyIcon',
  'rgg_nickname', 'rgg_twitterId', 'rgg_subscribeFollow', 'rgg_commentNarrow',
  'rgg_customTitle', 'rgg_customValue',
  'rgg_selections', 'rgg_spoilerValue', 'rgg_spoilerOther',
  'rgg_gameStates', 'rgg_headerImage',
];