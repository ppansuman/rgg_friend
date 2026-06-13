import { useEffect, useRef, useState, Fragment } from 'react';
import Head from 'next/head';
import { parse } from 'twemoji-parser';

const TWIT_STYLE_OPTIONS = ['RT', '마음', '탐라대화', '인용', '일상', '수위', '타장르', '기타'];
const MAIN_FOCUS_OPTIONS = ['글', '썰', '번역', '그림', '코스', '인형', '공예', '영상', '녹음', '소비', '구독', '기타'];
const COUPLE_OPTIONS = ['HL', 'BL', 'GL', 'NCP/페어', 'ALL', '드림', '기타'];
const FUB_FREE_OPTIONS = ['OK', 'X', '기타'];
const BREAKUP_OPTIONS = ['언팔', '블락', '블언블', '기타'];
const DISLIKE_OPTIONS = ['리버스', '스포일러', '타장르', '기타'];
const CONSOLE_OPTIONS = ['PlayStation', 'Xbox', 'Steam', 'Nintendo Switch'];

const ROWS = [
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

const LAYOUT = {
  startY: 430,
  rowGap: 65,
  titleX: 140,
  contentX: 337.7061,
};

const FONT = {
  nickname: { size: 35, weight: 700, tracking: -25, x: 140, y: 350 },
  title: { size: 22, weight: 600, tracking: -25 },
  content: { size: 22, weight: 400, tracking: -25 },
  bartext: { size: 15, weight: 400, tracking: -25 },
  badge: { size: 16, weight: 400, tracking: -25 },
};

const BACKGROUNDS = [
  { file: 'BG_2026_tojo.png', label: '동성회', accent: '#db7d7d', type: '트친소' },
  { file: 'BG_2026_omi.png', label: '오미연합', accent: '#cab366', type: '트친소' },
  { file: 'BG_2026_keisatsu.png', label: '경찰', accent: '#6ca3e1', type: '트친소' },
  { file: 'BG_2026_bengoshi.png', label: '변호사', accent: '#8ac2a3', type: '트친소' },
  { file: 'BG_2026_tojo2.png', label: '동성회', accent: '#db7d7d', type: '소개표' },
  { file: 'BG_2026_omi2.png', label: '오미연합', accent: '#cab366', type: '소개표' },
  { file: 'BG_2026_keisatsu2.png', label: '경찰', accent: '#6ca3e1', type: '소개표' },
  { file: 'BG_2026_bengoshi2.png', label: '변호사', accent: '#8ac2a3', type: '소개표' },
];

const COLORS = {
  text: '#222222',
  barBackground: '#dddddd',
  waitingBadgeBg: '#eeeeee',
  waitingBadgeText: '#aaaaaa',
  badgeText: '#ffffff',
};

const SPOILER = {
  labelX: 1220,
  barX1: 1365,
  barX2: 1810,
  barY: 330,
  thickness: 10,
};

const GAME_STATES = ['완료', '플레이중', '구매완료', '대기'];

const GAMES = [
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

const GAME_STATE_LABELS = {
  '완료': '완료',
  '플레이중': '플레이 중',
  '구매완료': '구매 완료',
  '대기': '대기',
};

const GAME_STATE_GROUPS = [
  { state: '완료', title: '플레이 및 구매 완료' },
  { state: '플레이중', title: '플레이 중' },
  { state: '구매완료', title: '구매 완료' },
  { state: '대기', title: '플레이 및 구매 대기' },
];

const GAME_SECTION = {
  x: 1220,
  y: 450,
  rowGap: 80,
  badgeGap: 10,
  badgeBottomMargin: 20,
  maxX: 1880,
};

const HORIZONTAL_SCALE = 0.95;

const emojiImageCache = {};

function getEmojiImage(url, onLoad) {
  if (emojiImageCache[url]) return emojiImageCache[url];
  const img = new Image();
  img.onload = onLoad;
  img.src = url;
  emojiImageCache[url] = img;
  return img;
}

function buildInitialSelections() {
  const init = {};
  ROWS.forEach((row) => {
    if (row.type === 'option') {
      init[row.key] = [];
      init[row.key + 'Other'] = '';
    } else {
      init[row.key] = '';
    }
  });
  init['spoilerOther'] = '';
  return init;
}

export default function Home() {
  const canvasRef = useRef(null);
  const bgImageRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [cardType, setCardType] = useState('트친소');
  const [selectedBgLabel, setSelectedBgLabel] = useState('동성회'); // 배경 이름만 저장

  // 현재 배경 파일 결정
  const currentBg = BACKGROUNDS.find(bg => bg.type === cardType && bg.label === selectedBgLabel);
  const bgIndex = BACKGROUNDS.indexOf(currentBg);
  const [nickname, setNicknameState] = useState('닉네임');
  const [twitterId, setTwitterIdState] = useState('@twitterID');
  const [selections, setSelectionsState] = useState(buildInitialSelections);
  const [spoilerValue, setSpoilerValueState] = useState(0);
  const [spoilerOther, setSpoilerOtherState] = useState('');
  const [gameStates, setGameStatesState] = useState(() => {
    const init = {};
    GAMES.forEach((g) => { init[g.key] = '대기'; });
    return init;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = {
      nickname: localStorage.getItem('rgg_nickname'),
      twitterId: localStorage.getItem('rgg_twitterId'),
      selections: localStorage.getItem('rgg_selections'),
      spoilerValue: localStorage.getItem('rgg_spoilerValue'),
      spoilerOther: localStorage.getItem('rgg_spoilerOther'),
      gameStates: localStorage.getItem('rgg_gameStates'),
    };
    
    if (saved.nickname) setNicknameState(saved.nickname);
    if (saved.twitterId) setTwitterIdState(saved.twitterId);
    if (saved.selections) setSelectionsState(JSON.parse(saved.selections));
    if (saved.spoilerValue) setSpoilerValueState(Number(saved.spoilerValue));
    if (saved.spoilerOther) setSpoilerOtherState(saved.spoilerOther);
    if (saved.gameStates) setGameStatesState(JSON.parse(saved.gameStates));
  }, []);

  const setNickname = (value) => {
    setNicknameState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_nickname', value);
    }
  };

  const setTwitterId = (value) => {
    setTwitterIdState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_twitterId', value);
    }
  };

  const setSelections = (value) => {
    const newValue = typeof value === 'function' ? value(selections) : value;
    setSelectionsState(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_selections', JSON.stringify(newValue));
    }
  };

  const setSpoilerValue = (value) => {
    setSpoilerValueState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_spoilerValue', String(value));
    }
  };

  const setSpoilerOther = (value) => {
    setSpoilerOtherState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_spoilerOther', value);
    }
  };

  const setGameStates = (value) => {
    const newValue = typeof value === 'function' ? value(gameStates) : value;
    setGameStatesState(newValue);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_gameStates', JSON.stringify(newValue));
    }
  };

  const accentColor = BACKGROUNDS[bgIndex].accent;

  useEffect(() => {
    setBgLoaded(false);
    const img = new Image();
    img.src = `/${BACKGROUNDS[bgIndex].file}`;
    img.onload = () => {
      bgImageRef.current = img;
      setBgLoaded(true);
    };
  }, [bgIndex]);

  useEffect(() => {
    document.fonts.ready.then(() => draw());
  }, []);

  useEffect(() => {
    draw();
  }, [nickname, twitterId, selections, spoilerValue, spoilerOther, gameStates, bgLoaded, accentColor]);

  function applyTextStyle(ctx, font) {
    ctx.font = `${font.weight} ${font.size}pt Pretendard`;
    ctx.fontKerning = 'normal';
    const sizePx = font.size * (96 / 72);
    ctx.letterSpacing = `${(font.tracking / 1000) * sizePx}px`;
  }

  function fillTextCompressed(ctx, text, x, y, scaleX = HORIZONTAL_SCALE) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, 1);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  function fillTextWithEmoji(ctx, text, x, y, fontSizePx, scaleX = HORIZONTAL_SCALE) {
    const emojis = parse(text, {
      assetType: 'png',
      buildUrl: (codepoints) =>
        `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/72x72/${codepoints}.png`,
    });

    if (emojis.length === 0) {
      fillTextCompressed(ctx, text, x, y, scaleX);
      return;
    }

    let cursorX = x;
    let lastIndex = 0;

    const drawSegment = (segment) => {
      if (!segment) return;
      fillTextCompressed(ctx, segment, cursorX, y, scaleX);
      cursorX += ctx.measureText(segment).width * scaleX;
    };

    emojis.forEach((e) => {
      const [start, end] = e.indices;
      drawSegment(text.slice(lastIndex, start));

      const img = getEmojiImage(e.url, () => draw());
      if (img.complete) {
        ctx.drawImage(img, cursorX, y - fontSizePx * 0.85, fontSizePx, fontSizePx);
      }
      cursorX += fontSizePx + 2;

      lastIndex = end;
    });

    drawSegment(text.slice(lastIndex));
  }

  function toggleOption(row, value) {
    setSelections((prev) => {
      const current = prev[row.key];
      let next;
      if (row.radioOptions && row.radioOptions.includes(value)) {
        const others = current.filter((v) => !row.radioOptions.includes(v));
        next = current.includes(value) ? others : [...others, value];
      } else {
        next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
      }
      return { ...prev, [row.key]: next };
    });
  }

  function setFieldText(rowKey, value) {
    setSelections((prev) => ({ ...prev, [rowKey]: value }));
  }

  function setGameState(key, state) {
    setGameStates((prev) => ({ ...prev, [key]: state }));
  }

  function measureBadge(ctx, text) {
    applyTextStyle(ctx, FONT.badge);
    const sizePx = FONT.badge.size * (96 / 72);
    const textWidth = ctx.measureText(text).width * HORIZONTAL_SCALE;
    const paddingX = 16;
    return { width: textWidth + paddingX * 2, height: sizePx * 1.6, paddingX, sizePx };
  }

  function drawBadge(ctx, text, x, y, bgColor, textColor) {
    const { width, height, paddingX, sizePx } = measureBadge(ctx, text);
    const radius = height / 2;

    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fill();

    ctx.fillStyle = textColor;
    applyTextStyle(ctx, FONT.badge);
    const baselineY = y + height / 2 + sizePx * 0.35;
    fillTextCompressed(ctx, text, x + paddingX, baselineY);

    return { width, height };
  }
function drawOptionRow(ctx, row, y) {
    const selected = row.options.filter((opt) => selections[row.key].includes(opt));
    if (selected.length === 0) return false;

    ctx.fillStyle = COLORS.text;
    applyTextStyle(ctx, FONT.title);
    fillTextCompressed(ctx, row.title, LAYOUT.titleX, y);

    const otherText = selections[row.key + 'Other'] || '';
    const { height, sizePx } = measureBadge(ctx, '');
    const badgeTop = y - height / 2 - sizePx * 0.35;

    let x = LAYOUT.contentX;
    selected.forEach((opt) => {
      if (opt === '기타') {
        if (otherText.trim() === '') return;
        const text = otherText;
        ctx.fillStyle = COLORS.text;
        applyTextStyle(ctx, FONT.content);
        fillTextWithEmoji(ctx, text, x, y, FONT.content.size * (96 / 72));
        x += ctx.measureText(text).width * HORIZONTAL_SCALE + GAME_SECTION.badgeGap;
      } else {
        const { width } = drawBadge(ctx, opt, x, badgeTop, accentColor, COLORS.badgeText);
        x += width + GAME_SECTION.badgeGap;
      }
    });

    ctx.fillStyle = COLORS.text;
    return true;
  }

  function drawFreeTextRow(ctx, row, y) {
    const text = selections[row.key] || '';
    if (!text.trim()) return false;

    ctx.fillStyle = COLORS.text;
    applyTextStyle(ctx, FONT.title);
    fillTextCompressed(ctx, row.title, LAYOUT.titleX, y);

    applyTextStyle(ctx, FONT.content);
    const fontSizePx = FONT.content.size * (96 / 72);

    if (row.multiline) {
      const lineHeight = fontSizePx * 1.3;
      text.split('\n').forEach((line, i) => {
        fillTextWithEmoji(ctx, line, LAYOUT.contentX, y + i * lineHeight, fontSizePx);
      });
    } else {
      fillTextWithEmoji(ctx, text, LAYOUT.contentX, y, fontSizePx);
    }

    return true;
  }

  function drawSpoiler(ctx) {
    ctx.fillStyle = COLORS.text;
    applyTextStyle(ctx, FONT.title);
    fillTextCompressed(ctx, '스포일러', SPOILER.labelX, FONT.nickname.y);

    const { barX1, barX2, barY, thickness } = SPOILER;
    const radius = thickness / 2;

    ctx.fillStyle = COLORS.barBackground;
    ctx.beginPath();
    ctx.roundRect(barX1, barY - radius, barX2 - barX1, thickness, radius);
    ctx.fill();

    const fillWidth = (barX2 - barX1) * (spoilerValue / 100);
    if (fillWidth > 0) {
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.roundRect(barX1, barY - radius, fillWidth, thickness, radius);
      ctx.fill();
    }

    ctx.fillStyle = COLORS.text;
    applyTextStyle(ctx, FONT.bartext);
    const midX = (barX1 + barX2) / 2;
    const labelY = barY + 30;
    fillTextCompressed(ctx, '약', barX1, labelY);
    fillTextCompressed(ctx, '중', midX - 12, labelY);
    fillTextCompressed(ctx, '강', barX2 - 24, labelY);

    if (spoilerOther.trim()) {
      ctx.fillStyle = COLORS.text;
      const spoilerOtherSize = 18;
      ctx.font = `${FONT.content.weight} ${spoilerOtherSize}pt Pretendard`;
      ctx.fontKerning = 'normal';
      const sizePx = spoilerOtherSize * (96 / 72);
      ctx.letterSpacing = `${(FONT.content.tracking / 1000) * sizePx}px`;
      fillTextWithEmoji(ctx, spoilerOther, barX1, barY + 62, sizePx);
    }
  }

  function drawGameGroups(ctx, startY = GAME_SECTION.y) {
    let y = startY;

    GAME_STATE_GROUPS.forEach((group) => {
      const games = GAMES.filter((g) => gameStates[g.key] === group.state);
      if (games.length === 0) return;

      ctx.fillStyle = COLORS.text;
      applyTextStyle(ctx, FONT.title);
      fillTextCompressed(ctx, group.title, GAME_SECTION.x, y);

      let x = GAME_SECTION.x;
      let badgeY = y + 15;
      let extraHeight = 0;
      const isWaiting = group.state === '대기';

      games.forEach((game) => {
        const { width, height } = measureBadge(ctx, game.title);

        if (x + width > GAME_SECTION.maxX) {
          x = GAME_SECTION.x;
          badgeY += height + GAME_SECTION.badgeGap;
          extraHeight += height + GAME_SECTION.badgeGap;
        }

        const bg = isWaiting ? COLORS.waitingBadgeBg : accentColor;
        const fg = isWaiting ? COLORS.waitingBadgeText : COLORS.badgeText;
        drawBadge(ctx, game.title, x, badgeY, bg, fg);

        x += width + GAME_SECTION.badgeGap;
      });

      y += GAME_SECTION.rowGap + extraHeight + GAME_SECTION.badgeBottomMargin;
    });
  }

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = COLORS.text;

    applyTextStyle(ctx, FONT.nickname);
    fillTextCompressed(ctx, nickname, FONT.nickname.x, FONT.nickname.y);

    const nicknameWidth = ctx.measureText(nickname).width * HORIZONTAL_SCALE;
    applyTextStyle(ctx, FONT.content);
    fillTextCompressed(ctx, twitterId, FONT.nickname.x + nicknameWidth + 20, FONT.nickname.y);

    let currentY = LAYOUT.startY;
    
    ROWS.forEach((row) => {
      if (row.type === 'option') {
        const wasDrawn = drawOptionRow(ctx, row, currentY);
        if (wasDrawn) currentY += LAYOUT.rowGap;
      } else {
        const wasDrawn = drawFreeTextRow(ctx, row, currentY);
        if (wasDrawn) currentY += LAYOUT.rowGap;
      }
    });

    if (spoilerValue > 0) {
      drawSpoiler(ctx);
    }

    const gameStartY = spoilerValue > 0 ? GAME_SECTION.y : (GAME_SECTION.y - 100);
    drawGameGroups(ctx, gameStartY);
  }

  function handleDownloadImage() {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `friend-card_${year}${month}${day}_${hours}${minutes}${seconds}.png`;
      a.download = fileName;

      a.click();
      URL.revokeObjectURL(url);
    });
  }
  
  function handleResetAll() {
    if (!window.confirm('모든 설정을 삭제하시겠습니까?')) return;
    setNicknameState('닉네임');
    setTwitterIdState('@twitterID');
    setSelectionsState(buildInitialSelections());
    setSpoilerValueState(0);
    setSpoilerOtherState('');
    const init = {};
    GAMES.forEach((g) => { init[g.key] = '대기'; });
    setGameStatesState(init);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rgg_nickname');
      localStorage.removeItem('rgg_twitterId');
      localStorage.removeItem('rgg_selections');
      localStorage.removeItem('rgg_spoilerValue');
      localStorage.removeItem('rgg_spoilerOther');
      localStorage.removeItem('rgg_gameStates');
    }
  }

  const cardStyle = {
    backgroundColor: '#2a2a2a',
    border: '1px solid #404040',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  };

  const labelStyle = {
    color: '#e0e0e0',
    fontSize: '14px',
  };

  const inputStyle = {
    backgroundColor: '#1a1a1a',
    color: '#e0e0e0',
    border: '1px solid #404040',
    borderRadius: '4px',
    padding: '8px 12px',
    fontSize: '14px',
    fontFamily: 'inherit',
  };

  const buttonStyle = {
    backgroundColor: accentColor,
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </Head>

      <div style={{ backgroundColor: '#0f0f0f', minHeight: '100vh', color: '#e0e0e0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px' }}>
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxWidth: '960px',
              border: '2px solid #404040',
              borderRadius: '8px',
              marginBottom: '24px',
              backgroundColor: '#1a1a1a',
            }}
          />

          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>카드 타입</h2>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="cardType"
                    checked={cardType === '트친소'}
                    onChange={() => setCardType('트친소')}
                    style={{ cursor: 'pointer' }}
                    suppressHydrationWarning
                  />
                  <span style={labelStyle}>트친소</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="cardType"
                    checked={cardType === '소개표'}
                    onChange={() => setCardType('소개표')}
                    style={{ cursor: 'pointer' }}
                    suppressHydrationWarning
                  />
                  <span style={labelStyle}>소개표</span>
                </label>
              </div>

              <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>배경 선택</h2>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {['동성회', '오미연합', '경찰', '변호사'].map((label) => (
                  <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="background"
                      checked={selectedBgLabel === label}
                      onChange={() => setSelectedBgLabel(label)}
                      style={{ cursor: 'pointer' }}
                      suppressHydrationWarning
                    />
                    <span style={labelStyle}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>기본 정보</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>닉네임</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    suppressHydrationWarning
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>트위터 아이디</label>
                  <input
                    type="text"
                    value={twitterId}
                    onChange={(e) => setTwitterId(e.target.value)}
                    suppressHydrationWarning
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {ROWS.map((row) => {
              if (row.type === 'option') {
                return (
                  <div key={row.key} style={cardStyle}>
                    <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                      {row.title}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                      {row.options.map((option) => {
                        const isRadio = row.radioOptions && row.radioOptions.includes(option);
                        return (
                          <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                              type={isRadio ? 'radio' : 'checkbox'}
                              name={isRadio ? `${row.key}-radio` : undefined}
                              checked={selections[row.key].includes(option)}
                              onChange={() => toggleOption(row, option)}
                              style={{ cursor: 'pointer' }}
                              suppressHydrationWarning
                            />
                            <span style={labelStyle}>{option}</span>
                          </label>
                        );
                      })}
                    </div>
                    {row.options.includes('기타') && selections[row.key].includes('기타') && (
                      <input
                        type="text"
                        placeholder="기타 내용 입력"
                        value={selections[row.key + 'Other']}
                        onChange={(e) => setFieldText(row.key + 'Other', e.target.value)}
                        suppressHydrationWarning
                        style={{ ...inputStyle, marginTop: '12px', width: '100%', maxWidth: '300px' }}
                      />
                    )}
                  </div>
                );
              } else {
                return (
                  <div key={row.key} style={cardStyle}>
                    <label style={{ ...labelStyle, display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                      {row.title}
                    </label>
                    {row.multiline ? (
                      <textarea
                        value={selections[row.key]}
                        onChange={(e) => setFieldText(row.key, e.target.value)}
                        rows={3}
                        suppressHydrationWarning
                        style={{ ...inputStyle, width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={selections[row.key]}
                        onChange={(e) => setFieldText(row.key, e.target.value)}
                        suppressHydrationWarning
                        style={{ ...inputStyle, width: '100%' }}
                      />
                    )}
                  </div>
                );
              }
            })}

            <div style={cardStyle}>
              <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>스포일러</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={spoilerValue}
                  onChange={(e) => setSpoilerValue(Number(e.target.value))}
                  suppressHydrationWarning
                  style={{ flex: 1, height: '6px', borderRadius: '3px', cursor: 'pointer' }}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={spoilerValue}
                  onChange={(e) => {
                    const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                    setSpoilerValue(v);
                  }}
                  suppressHydrationWarning
                  style={{ ...inputStyle, width: '70px', textAlign: 'center' }}
                />
                <span style={labelStyle}>%</span>
              </div>
              <input
                type="text"
                placeholder="추가 내용 (선택사항)"
                value={spoilerOther}
                onChange={(e) => setSpoilerOther(e.target.value)}
                suppressHydrationWarning
                style={{ ...inputStyle, width: '100%' }}
              />
            </div>

            <div style={cardStyle}>
              <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>게임 체크리스트</h2>
              <div style={{ display: 'flex', justifyContent: 'flex-start', overflowX: 'auto', paddingLeft: '40px' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 60px 60px 60px 60px',
                    gap: '4px 4px',
                    alignItems: 'center',
                  }}
                >
                  <div></div>
                  {GAME_STATES.map((state) => (
                    <div key={state} style={{ fontWeight: '600', textAlign: 'center', fontSize: '12px', color: '#b0b0b0' }}>
                      {GAME_STATE_LABELS[state]}
                    </div>
                  ))}

                  {GAMES.map((game, idx) => (
                    <Fragment key={game.key}>
                      {idx > 0 && idx % 5 === 0 && (
                        <>
                          <div style={{ gridColumn: '1 / -1', height: '1px', backgroundColor: '#404040', margin: '8px 0' }}></div>
                        </>
                      )}
                      <div style={{ fontSize: '13px', color: '#c0c0c0', textAlign: 'right', paddingRight: '16px' }}>{game.title}</div>
                      {GAME_STATES.map((state) => (
                        <div key={state} style={{ textAlign: 'center' }}>
                          <input
                            type="radio"
                            name={`game-${game.key}`}
                            checked={gameStates[game.key] === state}
                            onChange={() => setGameState(game.key, state)}
                            style={{ cursor: 'pointer' }}
                            suppressHydrationWarning
                          />
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDownloadImage}
                onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.target.style.opacity = '1')}
                style={{ ...buttonStyle, marginTop: '16px', width: '100%' }}
              >
                이미지로 저장하기
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={handleResetAll}
                  onMouseEnter={(e) => (e.target.style.opacity = '0.7')}
                  onMouseLeave={(e) => (e.target.style.opacity = '0.5')}
                  style={{ 
                    width: '120px',
                    backgroundColor: '#505050',
                    color: '#a0a0a0',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    opacity: '0.5',
                    transition: 'opacity 0.2s',
                  }}
                >
                  모든 설정 해제하기
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'center'}}></div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #404040',
          marginTop: '40px',
          paddingTop: '24px',
          paddingBottom: '40px',
          textAlign: 'center',
          color: '#808080',
          fontSize: '12px',
        }}>
          <div style={{ marginBottom: '8px' }}>
            사이트 제작: 빤수맨 X:{' '}
            <a href="https://twitter.com/ppansuman" target="_blank" rel="noopener noreferrer" style={{ color: '#a0a0a0', textDecoration: 'none' }}>
              @ppansuman
            </a>
          </div>
          <div style={{ marginBottom: '8px' }}>
            이용 문의:{' '}
            <a href="mailto:ppansuman@gmail.com" style={{ color: '#a0a0a0', textDecoration: 'none' }}>
              ppansuman@gmail.com
            </a>
          </div>
          <div>
            <a href="https://github.com/ppansuman" target="_blank" rel="noopener noreferrer" style={{ color: '#a0a0a0', textDecoration: 'none' }}>
              github.com/ppansuman
            </a>
          </div>
        </div>
      </div>
    </>
  );
}