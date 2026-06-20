// #region Functions
import { useEffect, useRef, useState, Fragment } from 'react';
import Head from 'next/head';
import { parse } from 'twemoji-parser';
import { version, lastUpdated } from '../package.json';

import {
  ROWS,
  LAYOUT,
  FONT,
  BACKGROUNDS,
  COLORS,
  SPOILER,
  GAME_STATES,
  GAMES,
  GAME_STATE_LABELS,
  GAME_STATE_GROUPS,
  GAME_SECTION,
  HORIZONTAL_SCALE,
} from '../lib/constants';

import {
  cardStyle,
  labelStyle,
  inputStyle,
  h2Style,
  h3Style,
  guideStyle,
  linkStyle,
  footerTextStyle,
} from '../lib/styles';

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
    } else if (row.type === 'free') {
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
  const [cardType, setCardTypeState] = useState('트친소');

  const setCardType = (value) => {
    setCardTypeState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_cardType', value);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCardType = localStorage.getItem('rgg_cardType');
    if (savedCardType) {
      setCardTypeState(savedCardType);
    }

    const savedBgLabel = localStorage.getItem('rgg_selectedBgLabel');
    if (savedBgLabel) {
      setSelectedBgLabelState(savedBgLabel);
    }
  }, []);

  const [selectedBgLabel, setSelectedBgLabelState] = useState('동성회');

  const setSelectedBgLabel = (value) => {
    setSelectedBgLabelState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_selectedBgLabel', value);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('rgg_selectedBgLabel');
    if (saved) setSelectedBgLabelState(saved);
  }, []);

  const currentBg = BACKGROUNDS.find(bg => bg.type === cardType && bg.label === selectedBgLabel);
  const bgIndex = BACKGROUNDS.indexOf(currentBg);
  const [nickname, setNicknameState] = useState('');
  const [twitterId, setTwitterIdState] = useState('');
  const [fubFree, setFubFreeState] = useState(false);
  const [customTitle, setCustomTitleState] = useState('');
  const [customValue, setCustomValueState] = useState('');

  const setFubFree = (value) => {
    setFubFreeState(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('rgg_fubFree', String(value));
    }
  };

  const setCustomTitle = (value) => {
    setCustomTitleState(value);
    if (typeof window !== 'undefined') localStorage.setItem('rgg_customTitle', value);
  };

  const setCustomValue = (value) => {
    setCustomValueState(value);
    if (typeof window !== 'undefined') localStorage.setItem('rgg_customValue', value);
  };
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
      fubFree: localStorage.getItem('rgg_fubFree'),
      customTitle: localStorage.getItem('rgg_customTitle'),
      customValue: localStorage.getItem('rgg_customValue'),
      selections: localStorage.getItem('rgg_selections'),
      spoilerValue: localStorage.getItem('rgg_spoilerValue'),
      spoilerOther: localStorage.getItem('rgg_spoilerOther'),
      gameStates: localStorage.getItem('rgg_gameStates'),
    };

    if (saved.nickname) setNicknameState(saved.nickname);
    if (saved.twitterId) setTwitterIdState(saved.twitterId);
    if (saved.fubFree) setFubFreeState(saved.fubFree === 'true');
    if (saved.customTitle) setCustomTitleState(saved.customTitle);
    if (saved.customValue) setCustomValueState(saved.customValue);
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
  }, [nickname, twitterId, selections, spoilerValue, spoilerOther, gameStates, bgLoaded, accentColor, fubFree, customTitle, customValue]);

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
    const selected = selections[row.key]
      .filter((opt) => row.options.includes(opt))
      .sort((a, b) => a === '기타' ? 1 : b === '기타' ? -1 : 0);
    if (selected.length === 0) return false;

    ctx.fillStyle = COLORS.text;
    applyTextStyle(ctx, FONT.title);
    fillTextCompressed(ctx, row.title, LAYOUT.titleX, y);

    const otherText = selections[row.key + 'Other'] || '';
    const { height, sizePx } = measureBadge(ctx, '');
    const badgeTop = y + LAYOUT.contentOffsetY - height / 2 - sizePx * 0.35;

    let x = LAYOUT.contentX;
    const hasOtherOnly = selected.length === 1 && selected[0] === '기타';

    selected.forEach((opt) => {
      if (opt === '기타') {
        if (otherText.trim() === '') return;
        const text = otherText;
        ctx.fillStyle = COLORS.text;
        if (hasOtherOnly) {
          applyTextStyle(ctx, FONT.content);
          fillTextWithEmoji(ctx, text, x, y + LAYOUT.contentOffsetY, FONT.content.size * (96 / 72));
          x += ctx.measureText(text).width * HORIZONTAL_SCALE + GAME_SECTION.badgeGap;
        } else if (row.otherInline || (row.otherInlineAuto && selected.filter(o => o !== '기타').length <= 3)) {
          applyTextStyle(ctx, FONT.other);
          const otherSizePx = FONT.other.size * (96 / 72);
          fillTextWithEmoji(ctx, text, x, y + LAYOUT.contentOffsetY, otherSizePx);
          x += ctx.measureText(text).width * HORIZONTAL_SCALE + GAME_SECTION.badgeGap;
        } else {
          ctx.font = `${FONT.other.weight} ${FONT.other.size}pt Pretendard`;
          ctx.fontKerning = 'normal';
          const otherSizePx = FONT.other.size * (96 / 72);
          ctx.letterSpacing = `${(FONT.other.tracking / 1000) * otherSizePx}px`;
          fillTextWithEmoji(ctx, text, LAYOUT.contentX, y + LAYOUT.otherWithBadgeOffsetY, otherSizePx);
        }
      } else {
        const { width } = drawBadge(ctx, opt, x, badgeTop, accentColor, COLORS.badgeText);
        x += width + GAME_SECTION.badgeGap;
      }
    });

    ctx.fillStyle = COLORS.text;
    const isInline = row.otherInline || (row.otherInlineAuto && selected.filter(o => o !== '기타').length <= 3);
    const hasBadgeAndOther = !hasOtherOnly && !isInline && selected.includes('기타') && otherText.trim();
    return { drawn: true, extraGap: hasBadgeAndOther ? LAYOUT.otherWithBadgeRowGap : 0 };
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
      const maxWidth = LAYOUT.maxContentWidth; // constants에 추가
      let lineIndex = 0;

      text.split('\n').forEach((paragraph) => {
        const words = paragraph.split('');
        let currentLine = '';

        words.forEach((char) => {
          const testLine = currentLine + char;
          const testWidth = ctx.measureText(testLine).width * HORIZONTAL_SCALE;
          if (testWidth > maxWidth && currentLine !== '') {
            fillTextWithEmoji(ctx, currentLine, LAYOUT.contentX, y + LAYOUT.contentOffsetY + lineIndex * lineHeight, fontSizePx);
            currentLine = char;
            lineIndex++;
          } else {
            currentLine = testLine;
          }
        });
        fillTextWithEmoji(ctx, currentLine, LAYOUT.contentX, y + LAYOUT.contentOffsetY + lineIndex * lineHeight, fontSizePx);
        lineIndex++;
      });
    } else {
      fillTextWithEmoji(ctx, text, LAYOUT.contentX, y + LAYOUT.contentOffsetY, fontSizePx);
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
      ctx.font = `${FONT.other.weight} ${FONT.other.size}pt Pretendard`;
      ctx.fontKerning = 'normal';
      const sizePx = FONT.other.size * (96 / 72);
      ctx.letterSpacing = `${(FONT.other.tracking / 1000) * sizePx}px`;
      fillTextWithEmoji(ctx, spoilerOther, barX1, barY + SPOILER.otherTextOffsetY, sizePx);
    }
  }

  function drawGameGroups(ctx, startY = GAME_SECTION.y) {
    let y = startY;

    GAME_STATE_GROUPS.forEach((group) => {
      if (group.state === '대기') return;
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
    ctx.font = `${FONT.twitterId.weight} ${FONT.twitterId.size}pt ${FONT.twitterId.family}`;
    ctx.fontVariationSettings = `"opsz" ${FONT.twitterId.opsz}`;
    ctx.fontKerning = 'normal';
    const twitterIdSizePx = FONT.twitterId.size * (96 / 72);
    ctx.letterSpacing = `${(FONT.twitterId.tracking / 1000) * twitterIdSizePx}px`;
    fillTextCompressed(ctx, twitterId, FONT.nickname.x + nicknameWidth + 20, FONT.nickname.y);
    if (fubFree) {
      const idWidth = ctx.measureText(twitterId).width * HORIZONTAL_SCALE;
      const badgeX = FONT.nickname.x + nicknameWidth + 20 + idWidth + 16;
      drawBadge(ctx, 'FUB FREE', badgeX, FONT.nickname.y - FONT.twitterId.size * (96 / 72) * 0.8, accentColor, COLORS.badgeText);
    }

    let currentY = LAYOUT.startY;

    ROWS.forEach((row) => {
      if (row.type === 'option') {
        const result = drawOptionRow(ctx, row, currentY);
        if (result?.drawn) currentY += LAYOUT.rowGap + result.extraGap;
      } else if (row.type === 'custom') {
        if (customTitle.trim() && customValue.trim()) {
          ctx.fillStyle = COLORS.text;
          applyTextStyle(ctx, FONT.title);
          fillTextCompressed(ctx, customTitle, LAYOUT.titleX, currentY);
          applyTextStyle(ctx, FONT.content);
          fillTextWithEmoji(ctx, customValue, LAYOUT.contentX, currentY + LAYOUT.contentOffsetY, FONT.content.size * (96 / 72));
          currentY += LAYOUT.rowGap;
        }
      } else {
        const wasDrawn = drawFreeTextRow(ctx, row, currentY);
        if (wasDrawn) currentY += LAYOUT.rowGap;
      }
    });

    if (spoilerValue > 0) {
      drawSpoiler(ctx);
    }

    const gameStartY = spoilerValue > 0
      ? GAME_SECTION.yWithSpoiler + (spoilerOther.trim() ? SPOILER.otherOffsetY : SPOILER.gameOffsetY)
      : GAME_SECTION.y;
    drawGameGroups(ctx, gameStartY);
  }

  function handleDownloadImage() {
    const canvas = canvasRef.current;

    canvas.toBlob(
      (blob) => {
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
      },
      'image/png',
      1 // 품질
    );
  }

  function handleResetAll() {
    const shouldReset = typeof window !== 'undefined'
      ? window.confirm('모든 설정을 삭제하시겠습니까?') !== false
      : true;

    if (!shouldReset) return;

    setCardTypeState('트친소');
    setSelectedBgLabelState('동성회');
    setNicknameState('');
    setTwitterIdState('');
    setSelectionsState(buildInitialSelections());
    setSpoilerValueState(0);
    setSpoilerOtherState('');
    const init = {};
    GAMES.forEach((g) => { init[g.key] = '대기'; });
    setGameStatesState(init);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('rgg_cardType');
      localStorage.removeItem('rgg_selectedBgLabel');
      localStorage.removeItem('rgg_nickname');
      localStorage.removeItem('rgg_twitterId');
      setFubFreeState(false);
      localStorage.removeItem('rgg_fubFree');
      setCustomTitleState('');
      setCustomValueState('');
      localStorage.removeItem('rgg_customTitle');
      localStorage.removeItem('rgg_customValue');
      localStorage.removeItem('rgg_selections');
      localStorage.removeItem('rgg_spoilerValue');
      localStorage.removeItem('rgg_spoilerOther');
      localStorage.removeItem('rgg_gameStates');
    }
  }

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

  const [canvasHeight, setCanvasHeight] = useState(540);

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasHeight(canvasRef.current.offsetHeight);
    }
    window.addEventListener('resize', () => {
      if (canvasRef.current) {
        setCanvasHeight(canvasRef.current.offsetHeight);
      }
    });
  }, []);

  return (
    // #endregion
    <>
      <Head>
        <title>용스튜 트친소/소개표 생성기</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400&display=swap" />
      </Head>

      <div style={{ backgroundColor: '#151515', minHeight: '100vh', color: '#e0e0e0' }}>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: '#0f0f0f', paddingBottom: '20px', paddingTop: '20px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
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
                backgroundColor: '#1a1a1a',
              }}
            />
          </div>
        </div>

        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '20px',
          paddingTop: '40px',
          marginTop: `${canvasHeight}px`
        }}>
          {/* 폼 요소들 */}
          <div style={{ maxWidth: 540, margin: '0 auto' }}>

            <div style={{ ...cardStyle, backgroundColor: 'rgba(42, 42, 42, 0.3)', border: '1px solid rgba(64, 64, 64, 0.8)', boxShadow: 'none', padding: '12px 16px', marginBottom: '24px' }}>
              <p style={{ ...guideStyle, color: '#ffffff' }}  >
                <b>TIP1: 체크한 항목 순서대로 표시됩니다.</b>
              </p>
              <p style={{ ...guideStyle, color: '#ffffff' }}  >
                <b>TIP2: 체크하지 않은 섹션은 이미지에 표시되지 않습니다.</b>
              </p>
              <p style={{ ...guideStyle, color: '#ffffff' }}  >
                <b>TIP3: 모든 내용은 기기에 자동으로 저장됩니다.</b>
              </p>
              <p style={{ ...guideStyle, color: '#ffffff' }}  >
                <b>TIP4: 기능이 잘 작동하지 않으면, 브라우저 캐시 삭제 후 사용해 주세요.</b>
              </p>
              <p style={{ ...guideStyle, paddingTop: 8 }}>
                PC와 모바일 모두 구글 크롬을 기준으로 제작되었으며,
              </p>
              <p style={guideStyle}>
                X(트위터) 인앱 브라우저에서 잘 작동되지 않을 수 있습니다.
              </p>
              <p style={{ ...guideStyle, paddingTop: 8 }}>
                오류나 건의 제보: <b>#용스튜소개표_제보</b> 또는 하단 메일 주소로 제보
              </p>
              <p style={{ ...guideStyle }}>
                공지사항 및 업데이트 내역은 하단 GitHub 링크의 Readme 참고
              </p>
            </div>

            <div style={cardStyle}>
              <h2 style={h2Style}>카드 타입</h2>
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

              <h2 style={h2Style}>배경 선택</h2>
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
              <h2 style={h2Style}>기본 정보</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>닉네임</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    suppressHydrationWarning
                    style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>트위터 아이디</label>
                  <input
                    type="text"
                    value={twitterId}
                    onChange={(e) => setTwitterId(e.target.value)}
                    placeholder="@yourIDhere"
                    suppressHydrationWarning
                    style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={fubFree}
                    onChange={(e) => setFubFree(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                    suppressHydrationWarning
                  />
                  <span style={labelStyle}>FUB FREE</span>
                </label>
              </div>
            </div>


            {ROWS.map((row) => {
              if (row.type === 'option') {
                return (
                  <div key={row.key} style={cardStyle}>
                    <h3 style={h3Style}>
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
                        style={{ ...inputStyle, marginTop: '12px', width: '100%', width: '100%' }}
                      />
                    )}
                  </div>
                );
              } else if (row.type === 'custom') {
                return (
                  <div key={row.key} style={cardStyle}>
                    <h3 style={h3Style}>자유 기입 항목(선택)</h3>
                    <input
                      type="text"
                      placeholder="제목 입력"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      suppressHydrationWarning
                      style={{ ...inputStyle, width: '30%', marginBottom: '8px', fontWeight: '600' }}
                    />
                    <input
                      type="text"
                      placeholder="내용 입력"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      suppressHydrationWarning
                      style={{ ...inputStyle, width: '100%' }}
                    />
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
              <h3 style={h3Style}>스포일러</h3>
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
              <h2 style={h2Style}>게임 체크리스트</h2>
              <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '134px 45px 45px 45px 45px',
                    gap: '4px 4px',
                    alignItems: 'center',
                  }}
                >
                  <div></div>
                  {GAME_STATES.map((state) => (
                    <div key={state} style={{ fontWeight: '600', textAlign: 'center', fontSize: '10px', color: '#b0b0b0' }}>
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


            </div>
          </div>

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

            <div style={{ textAlign: 'center' }}></div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #282828',
          marginTop: '40px',
          paddingTop: '24px',
          paddingBottom: '40px',
          textAlign: 'center',
          color: '#808080',
          backgroundColor: '#181818',
          fontSize: '12px',
        }}>
          <div style={{ color: '#a0a0a0' }}>
            <a href="https://twitter.com/ppansuman" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              사이트 제작: 빤수맨 X: @ppansuman
            </a>
          </div>
          <div style={{ color: '#a0a0a0', marginBottom: '12px' }}>
            <a href="mailto:ppansuman@gmail.com" style={linkStyle}>
              이용 문의 및 건의사항: ppansuman@gmail.com
            </a>
            {' | '}
            <a href="https://github.com/ppansuman/rgg_friend" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              GitHub
            </a>
            {' | '}
            <a href="https://x.com/ppansuman/status/1727017805470638231?s=20" target="_blank" rel="noopener noreferrer" style={linkStyle}>
              이전 트친소표
            </a>
          </div>

          <div style={{ marginBottom: '12px', fontSize: '12px', color: '#707070' }}>
            마지마코 / 이시오다 / 하루카를 그려주시면 제작자가 기뻐합니다...💕
          </div>

          <div style={{ ...footerTextStyle, padding: '0 16px' }}>
            <div style={{ marginBottom: '8px' }}>
              본 사이트는 용과 같이(Like a Dragon) 시리즈의 팬이 개인적으로 제작한 비상업적 트친소 및 소개표 생성기입니다.
            </div>
            <div style={{ marginBottom: '8px' }}>
              RGG Studio / SEGA와 공식적인 관련이 없으며, 수익을 목적으로 하지 않습니다.
            </div>
            <div style={{ marginBottom: '8px' }}>
              용과 같이 시리즈 및 관련 소재의 저작권은 © RGG Studio / SEGA에 있습니다.
            </div>
            <div style={{ paddingTop: '12px' }}>
              v{version} · Last Updated: {lastUpdated}</div>
          </div>
        </div>
      </div>
    </>
  );
}