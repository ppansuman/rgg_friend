import { useEffect, useRef, useState, Fragment } from 'react';
import Head from 'next/head';
import { parse } from 'twemoji-parser';

const TWIT_STYLE_OPTIONS = ['RT', '마음', '탐라대화', '인용', '일상', '수위', '타장르', '기타'];
const MAIN_FOCUS_OPTIONS = ['글&썰', '그림', '코스', '인형/공예', '번역', '소비', '구독', '기타'];
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
  { file: 'BG_2026_tojo.png', label: '동성회', accent: '#dc737c' },
  { file: 'BG_2026_omi.png', label: '오미연합', accent: '#c9a227' },
  { file: 'BG_2026_keisatsu.png', label: '경찰', accent: '#4a7fd6' },
  { file: 'BG_2026_bengoshi.png', label: '변호사', accent: '#4a9d6f' },
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

// 이모지 이미지 캐시 (한 번 불러온 건 재사용)
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
  return init;
}

export default function Home() {
  const canvasRef = useRef(null);
  const bgImageRef = useRef(null);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [nickname, setNickname] = useState('빤수맨');
  const [twitterId, setTwitterId] = useState('@example');
  const [selections, setSelections] = useState(buildInitialSelections);
  const [spoilerValue, setSpoilerValue] = useState(50);
  const [gameStates, setGameStates] = useState(() => {
    const init = {};
    GAMES.forEach((g) => {
      init[g.key] = '대기';
    });
    return init;
  });

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
  }, [nickname, twitterId, selections, spoilerValue, gameStates, bgLoaded, accentColor]);

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

  // 텍스트 안의 이모지를 Twemoji 이미지로 바꿔서 그림
  // ctx.font / fillStyle은 이 함수 호출 전에 미리 설정해두어야 함
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
    ctx.fillStyle = COLORS.text;
    applyTextStyle(ctx, FONT.title);
    fillTextCompressed(ctx, row.title, LAYOUT.titleX, y);

    const otherText = selections[row.key + 'Other'] || '';
    const selected = row.options.filter((opt) => selections[row.key].includes(opt));
    if (selected.length === 0) return;

    const { height, sizePx } = measureBadge(ctx, '');
    const badgeTop = y - height / 2 - sizePx * 0.35;

    let x = LAYOUT.contentX;
    selected.forEach((opt) => {
      if (opt === '기타') {
        if (otherText.trim() === '') return;
        const text = `기타: ${otherText}`;
        ctx.fillStyle = COLORS.text;
        applyTextStyle(ctx, FONT.badge);
        fillTextWithEmoji(ctx, text, x, y, sizePx);
        x += ctx.measureText(text).width * HORIZONTAL_SCALE + GAME_SECTION.badgeGap;
      } else {
        const { width } = drawBadge(ctx, opt, x, badgeTop, accentColor, COLORS.badgeText);
        x += width + GAME_SECTION.badgeGap;
      }
    });

    ctx.fillStyle = COLORS.text;
  }

  function drawFreeTextRow(ctx, row, y) {
    ctx.fillStyle = COLORS.text;
    applyTextStyle(ctx, FONT.title);
    fillTextCompressed(ctx, row.title, LAYOUT.titleX, y);

    applyTextStyle(ctx, FONT.content);
    const text = selections[row.key] || '';
    const fontSizePx = FONT.content.size * (96 / 72);

    if (row.multiline) {
      const lineHeight = fontSizePx * 1.3;
      text.split('\n').forEach((line, i) => {
        fillTextWithEmoji(ctx, line, LAYOUT.contentX, y + i * lineHeight, fontSizePx);
      });
    } else {
      fillTextWithEmoji(ctx, text, LAYOUT.contentX, y, fontSizePx);
    }
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
  }

  function drawGameGroups(ctx) {
    let y = GAME_SECTION.y;

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

    ROWS.forEach((row, index) => {
      const y = LAYOUT.startY + index * LAYOUT.rowGap;
      if (row.type === 'option') {
        drawOptionRow(ctx, row, y);
      } else {
        drawFreeTextRow(ctx, row, y);
      }
    });

    drawSpoiler(ctx);
    drawGameGroups(ctx);
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </Head>

      <div style={{ maxWidth: 1920, margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            border: '1px solid black',
          }}
        />

        <div style={{ padding: 20 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>배경</p>
          {BACKGROUNDS.map((bg, i) => (
            <label key={bg.file} style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="background"
                checked={bgIndex === i}
                onChange={() => setBgIndex(i)}
              />
              {' ' + bg.label}
            </label>
          ))}
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          <label>닉네임: </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <label style={{ marginLeft: 16 }}>트위터 아이디: </label>
          <input
            type="text"
            value={twitterId}
            onChange={(e) => setTwitterId(e.target.value)}
          />
        </div>

        {ROWS.map((row) =>
          row.type === 'option' ? (
            <div key={row.key} style={{ padding: '0 20px 12px' }}>
              <p style={{ margin: '0 0 4px', fontWeight: 'bold' }}>{row.title}</p>
              {row.options.map((option) => {
                const isRadio = row.radioOptions && row.radioOptions.includes(option);
                return (
                  <label key={option} style={{ marginRight: 12 }}>
                    <input
                      type={isRadio ? 'radio' : 'checkbox'}
                      name={isRadio ? `${row.key}-radio` : undefined}
                      checked={selections[row.key].includes(option)}
                      onChange={() => toggleOption(row, option)}
                    />
                    {' ' + option}
                  </label>
                );
              })}
              {row.options.includes('기타') && selections[row.key].includes('기타') && (
                <input
                  type="text"
                  placeholder="기타 내용 입력"
                  value={selections[row.key + 'Other']}
                  onChange={(e) => setFieldText(row.key + 'Other', e.target.value)}
                  style={{ marginLeft: 8 }}
                />
              )}
            </div>
          ) : (
            <div key={row.key} style={{ padding: '0 20px 12px' }}>
              <label style={{ fontWeight: 'bold' }}>{row.title}: </label>
              {row.multiline ? (
                <textarea
                  value={selections[row.key]}
                  onChange={(e) => setFieldText(row.key, e.target.value)}
                  rows={3}
                  style={{ width: 300, verticalAlign: 'top' }}
                />
              ) : (
                <input
                  type="text"
                  value={selections[row.key]}
                  onChange={(e) => setFieldText(row.key, e.target.value)}
                />
              )}
            </div>
          )
        )}

        <div style={{ padding: '0 20px 12px' }}>
          <label style={{ fontWeight: 'bold' }}>스포일러: </label>
          <input
            type="range"
            min="0"
            max="100"
            value={spoilerValue}
            onChange={(e) => setSpoilerValue(Number(e.target.value))}
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
            style={{ width: 60, marginLeft: 8 }}
          />
          <span> %</span>
        </div>

        <div style={{ padding: '0 20px 12px' }}>
          <p style={{ fontWeight: 'bold' }}>게임 체크리스트 (기본값: 대기)</p>
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
              <div key={state} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 13 }}>
                {GAME_STATE_LABELS[state]}
              </div>
            ))}

            {GAMES.map((game) => (
              <Fragment key={game.key}>
                <div>{game.title}</div>
                {GAME_STATES.map((state) => (
                  <div key={state} style={{ textAlign: 'center' }}>
                    <input
                      type="radio"
                      name={`game-${game.key}`}
                      checked={gameStates[game.key] === state}
                      onChange={() => setGameState(game.key, state)}
                    />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}