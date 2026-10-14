export const TWIT_STYLE_OPTIONS = ['RT', '마음', '탐라대화', '인용', '일상', '수위', '욕트', '스샷', '타장르', '기타'];
export const SUBSCRIBE_OPTIONS = ['FUB FREE', 'MUTUALS ONLY'];
export const MAIN_FOCUS_OPTIONS = ['글', '썰', '번역', '그림', '디자인', '코스', '인형', '공예', '영상', '녹음', '소비', '구독', '오시카츠', '기타'];
export const COUPLE_OPTIONS = ['HL', 'BL', 'GL', 'NCP/페어', 'ALL', '드림', '플라토닉', '가족', '기타'];
export const BREAKUP_OPTIONS = ['블언블', '언팔', '블락', '기타'];
export const DISLIKE_OPTIONS = ['리버스', '리버시블', '스포일러', '타장르', '기타'];
export const CONSOLE_OPTIONS = ['Steam', 'PlayStation', 'Xbox', 'Nintendo Switch'];

export const PLAY_STYLE_OPTIONS = ['스토리 본편', '서브 스토리', '달성 목록(콤플리트)', '트로피'];

export const ROWS = [
  { type: 'option', key: 'twitStyle', options: TWIT_STYLE_OPTIONS },
  { type: 'option', key: 'mainFocus', options: MAIN_FOCUS_OPTIONS },
  { type: 'option', key: 'couple', options: COUPLE_OPTIONS },
  { type: 'option', key: 'breakup', options: BREAKUP_OPTIONS },
  { type: 'option', key: 'dislike', options: DISLIKE_OPTIONS },
  { type: 'option', key: 'playStyle', options: PLAY_STYLE_OPTIONS },
  { type: 'option', key: 'consoleUsed', options: CONSOLE_OPTIONS },
  { type: 'free', key: 'favChar' },
  { type: 'custom', key: 'customField' },
  { type: 'free', key: 'comment', multiline: true },
];

// 이미지 크기 (세로형만)
export const IMAGE_SIZE = {
  vertical: { width: 1420, minHeight: 1420 },
};

export const GAME_STATES = ['완료', '플레이중', '구매완료', '대기'];

export const GAME_STATE_LABELS = {
  '완료': { ko: '완료', ja: '完了', en: 'Done' },
  '플레이중': { ko: '플레이 중', ja: 'プレイ中', en: 'Playing' },
  '구매완료': { ko: '구매 완료', ja: '購入済み', en: 'Owned' },
  '대기': { ko: '숨김', ja: '非表示', en: 'Hidden' },
};

export const GAME_STATE_GROUPS = [
  { state: '완료', title: { ko: '플레이 완료', ja: 'プレイ済み', en: 'Completed' } },
  { state: '플레이중', title: { ko: '플레이 중', ja: 'プレイ中', en: 'Currently Playing' } },
  { state: '구매완료', title: { ko: '구매 완료 및 플레이 대기', ja: '購入済み・プレイ待ち', en: 'Owned, Not Yet Played' } },
];

export const GAMES = [
  { key: 'strangerThanHeaven', title: { ko: '스트레인저 댄 헤븐', ja: 'STRANGER THAN HEAVEN', en: 'Stranger Than Heaven' } },
  { key: 'yakuza0', title: { ko: '용과 같이 0', ja: '龍が如く0', en: 'Yakuza 0' } },
  { key: 'yakuza1Kiwami', title: { ko: '용과 같이 1/극', ja: '龍が如く/極', en: 'Yakuza Kiwami' } },
  { key: 'yakuza2Kiwami', title: { ko: '용과 같이 2/극', ja: '龍が如く2/極', en: 'Yakuza Kiwami 2' } },
  { key: 'yakuza3Kiwami', title: { ko: '용과 같이 3/극', ja: '龍が如く3/極', en: 'Yakuza 3' } },
  { key: 'yakuza3Gaiden', title: { ko: '용과 같이 3 외전', ja: '3外伝 Dark Ties', en: 'Yakuza 3 Gaiden: Dark Ties' } },
  { key: 'yakuza4', title: { ko: '용과 같이 4', ja: '龍が如く4', en: 'Yakuza 4' } },
  { key: 'yakuza5', title: { ko: '용과 같이 5', ja: '龍が如く5', en: 'Yakuza 5' } },
  { key: 'yakuza6', title: { ko: '용과 같이 6', ja: '龍が如く6', en: 'Yakuza 6: The Song of Life' } },
  { key: 'yakuza7', title: { ko: '용과 같이 7', ja: '龍が如く7', en: 'Yakuza: Like a Dragon' } },
  { key: 'yakuza7Gaiden', title: { ko: '용과 같이 7 외전', ja: '7外伝 名を消した男', en: 'Gaiden: The Man Who Erased His Name' } },
  { key: 'yakuza8', title: { ko: '용과 같이 8', ja: '龍が如く8', en: 'Like a Dragon: Infinite Wealth' } },
  { key: 'yakuza8Gaiden', title: { ko: '용과 같이 8 외전', ja: '8外伝 Pirates in Hawaii', en: 'Gaiden: Pirates in Hawaii' } },
  { key: 'yakuzaIshinKiwami', title: { ko: '용과 같이 유신!/극', ja: '龍が如く維新!/極', en: 'Like a Dragon: Ishin!' } },
  { key: 'yakuzaOnline', title: { ko: '용과 같이 온라인', ja: '龍が如く ONLINE', en: 'Yakuza Online' } },
  { key: 'yakuzaWars', title: { ko: '야쿠자 워즈', ja: '龍が如く覇道', en: 'Like a Dragon: Yakuza Wars' } },
  { key: 'yakuzaOTE', title: { ko: '용과 같이 OTE', ja: '龍が如く OF THE END', en: 'Yakuza: Dead Souls' } },
  { key: 'yakuzaKenzan', title: { ko: '용과 같이 켄잔!', ja: '龍が如く見参!', en: 'Yakuza: Kenzan!' } },
  { key: 'judgeEyes', title: { ko: '저지 아이즈', ja: 'JUDGE EYES', en: 'Judgment' } },
  { key: 'lostJudgment', title: { ko: '로스트 저지먼트', ja: 'LOST JUDGMENT', en: 'Lost Judgment' } },
  { key: 'lostJudgmentDLC', title: { ko: '로스트 저지먼트 DLC', ja: '海藤正治の事件簿', en: 'Lost Judgment: The Kaito Files' } },
  { key: 'likeADragonHokuto', title: { ko: '북두와 같이', ja: '北斗が如く', en: 'Fist of the North Star: Lost Paradise' } },
  { key: 'kurohyo1', title: { ko: '흑표 1', ja: 'クロヒョウ', en: 'Kurohyo' } },
  { key: 'kurohyo2', title: { ko: '흑표 2', ja: 'クロヒョウ2', en: 'Kurohyo 2' } },
];
export const FAMILY_ICONS = [
  { key: 'tojo', label: { ko: '동성회', ja: '東城会', en: 'Tojo Clan' }, src: '/family/tojo.png' },
  { key: 'omi', label: { ko: '오미연합', ja: '近江連合', en: 'Omi Alliance' }, src: '/family/omi.png' },
  { key: 'police', label: { ko: '경찰', ja: '警察', en: 'Police' }, src: '/family/police.png' },
  { key: 'bengoshi', label: { ko: '변호사', ja: '弁護士', en: 'Lawyer' }, src: '/family/bengoshi.png' },
  { key: 'geomijul', label: { ko: '거미줄', ja: 'コミジュル', en: "Spider's Web" }, src: '/family/geomijul.png' },
  { key: 'goro', label: { ko: '고로 해적단', ja: 'ゴロー海賊団', en: 'Goro Pirates' }, src: '/family/goro1.png', srcDark: '/family/goro2.png' },
  { key: 'kijin', label: { ko: '귀인회', ja: '鬼人会', en: 'Kijin Society' }, src: '/family/kijin.png' },
  { key: 'asagao', label: { ko: '나팔꽃', ja: 'あさがお', en: 'Morning Glory' }, src: '/family/asagao.png' },
  { key: 'nishikiyama', label: { ko: '니시키야마조', ja: '錦山組', en: 'Nishikiyama Family' }, src: '/family/nishikiyama.png' },
  { key: 'dych', label: { ko: '다이너체어', ja: 'ダイナチェア', en: 'Dynachair' }, src: '/family/dych1.png', srcDark: '/family/dych2.png' },
  { key: 'dojima', label: { ko: '도지마조', ja: '堂島組', en: 'Dojima Family' }, src: '/family/dojima.png' },
  { key: 'ryudoikka', label: { ko: '류도일가', ja: '琉道一家', en: 'Ryudo Family' }, src: '/family/ryudoikka.png' },
  { key: 'ryudo', label: { ko: '류도회', ja: '龍童会', en: 'Ryudo Clan' }, src: '/family/ryudo.png' },
  { key: 'majima', label: { ko: '마지마조', ja: '真島組', en: 'Majima Family' }, src: '/family/majima.png' },
  { key: 'mjmken', label: { ko: '마지마건설', ja: '真島建設', en: 'Majima Construction' }, src: '/family/mjmken.png' },
  { key: 'mjmken_sym', label: { ko: '마지마건설 심볼', ja: '真島建設(シンボル)', en: 'Majima Construction (Symbol)' }, src: '/family/mjmken_sym.png' },
  { key: 'matsugane', label: { ko: '마츠가네조', ja: '松金組', en: 'Matsugane Family' }, src: '/family/matsugane.png' },
  { key: 'barracuda', label: { ko: '바라쿠다', ja: 'バラクーダ', en: 'Barracuda' }, src: '/family/barracuda1.png', srcDark: '/family/barracuda2.png' },
  { key: 'hakuho', label: { ko: '백봉회', ja: '白峯会', en: 'Hakuho Clan' }, src: '/family/hakuho.png' },
  { key: 'bj', label: { ko: '블리치 재팬', ja: 'Bleach Japan', en: 'Bleach Japan' }, src: '/family/bj1.png', srcDark: '/family/bj2.png' },
  { key: 'saejima', label: { ko: '사에지마조', ja: '冴島組', en: 'Saejima Family' }, src: '/family/saejima.png' },
  { key: 'someya', label: { ko: '소메야 일가', ja: '染谷一家', en: 'Someya Family' }, src: '/family/someya.png' },
  { key: 'sky', label: { ko: '스카이파이낸스', ja: 'スカイファイナンス', en: 'Sky Finance' }, src: '/family/sky.png' },
  { key: 'stardust', label: { ko: '스타더스트', ja: 'Stardust', en: 'Stardust' }, src: '/family/stardust.png' },
  { key: 'shibusawa', label: { ko: '시부사와조', ja: '渋澤組', en: 'Shibusawa Group' }, src: '/family/shibusawa.png' },
  { key: 'shinsengumi', label: { ko: '신선조', ja: '新選組', en: 'Shinsengumi' }, src: '/family/shinsengumi.png' },
  { key: 'arakawa', label: { ko: '아라카와조', ja: '荒川組', en: 'Arakawa Family' }, src: '/family/arakawa.png' },
  { key: 'haruka', label: { ko: '아이돌', ja: 'アイドル', en: 'Idol' }, src: '/family/idol.png' },
  { key: 'akame', label: { ko: '아카메 네트워크', ja: '赤目ネットワーク', en: 'Akame Network' }, src: '/family/akame.png' },
  { key: 'yamai', label: { ko: '야마이 일파', ja: '山井一派', en: 'Yamai Group' }, src: '/family/yamai1.png', srcDark: '/family/yamai2.png' },
  { key: 'osakaent', label: { ko: '오사카흥업', ja: '逢坂興業', en: 'Osaka Entertainment' }, src: '/family/osakaent.png' },
  { key: 'watase', label: { ko: '와타세조', ja: '渡瀬組', en: 'Watase Family' }, src: '/family/watase.png' },
  { key: 'youtian', label: { ko: '우천반점', ja: '佑天飯店', en: 'Youtian Restaurant' }, src: '/family/youtian.png' },
  { key: 'ishioda', label: { ko: '이시오다조', ja: '石尾田組', en: 'Ishioda Family' }, src: '/family/ishioda.png' },
  { key: 'ichiban', label: { ko: '이치반 홀딩스', ja: '一番製菓', en: 'Ichiban Holdings' }, src: '/family/ichiban1.png', srcDark: '/family/ichiban2.png' },
  { key: 'nikkyo', label: { ko: '일협연합', ja: '日侠連', en: 'Nikkyo Alliance' }, src: '/family/nikkyo.png' },
  { key: 'kazama', label: { ko: '카자마조', ja: '風間組', en: 'Kazama Family' }, src: '/family/kazama.png' },
  { key: 'kenno', label: { ko: '쿠제 권왕회', ja: '久瀬拳王会', en: "Kuze's Kenno Society" }, src: '/family/kenno.png' },
  { key: 'teihei', label: { ko: '태평일가', ja: '泰平一家', en: 'Taihei Clan' }, src: '/family/taihei.png' },
  { key: 'palekana', label: { ko: '팔레카나', ja: 'パレカナ', en: 'Palekana' }, src: '/family/palekana1.png', srcDark: '/family/palekana2.png' },
  { key: 'goryu', label: { ko: '향룡회', ja: '郷龍会', en: 'Goryu Society' }, src: '/family/goryu.png' },
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
  ['vertical', { ko: '세로', ja: '縦', en: 'Vertical' }],
  ['horizontal', { ko: '가로', ja: '横', en: 'Horizontal' }],
];

export const BG_COLOR_PRESETS = [
  ['#ffffff', { ko: '밝은 배경', ja: '明るい背景', en: 'Light Background' }, '3px solid #cccccc'],
  ['#1a1a1a', { ko: '어두운 배경', ja: '暗い背景', en: 'Dark Background' }, '3px solid #555555'],
];

// 배경(밝음/어둠)에 따른 포인트컬러 프리셋. 동일 인덱스끼리 밝음↔어둠 짝을 이룬다.
export const ACCENT_PRESETS = [
  { light: '#e29898', dark: '#7b4747', label: { ko: '동성회', ja: '東城会', en: 'Tojo Clan' } },
  { light: '#cab366', dark: '#7b692d', label: { ko: '오미연합', ja: '近江連合', en: 'Omi Alliance' } },
  { light: '#6ca3e1', dark: '#2a4f79', label: { ko: '경찰', ja: '警察', en: 'Police' } },
  { light: '#8ac2a3', dark: '#3c7260', label: { ko: '변호사', ja: '弁護士', en: 'Lawyer' } },
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
  'rgg_gameStates', 'rgg_headerImage', 'rgg_language',
];
