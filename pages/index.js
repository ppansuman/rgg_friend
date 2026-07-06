import { useEffect, useLayoutEffect, useRef, useState, Fragment } from 'react';
import Twemoji from 'react-twemoji';
import Head from 'next/head';
import { version, lastUpdated } from '../package.json';

import {
  ROWS, IMAGE_SIZE, GAME_STATES, GAME_STATE_LABELS,
  GAME_STATE_GROUPS, GAMES, SITE_URL, DEFAULT_ACCENT, LS_KEYS, FAMILY_ICONS,
  SUBSCRIBE_OPTIONS,
} from '../lib/constants';

import {
  cardStyle, labelStyle, inputStyle, h2Style, h3Style,
  guideStyle, linkStyle, footerTextStyle, getBadgeStyle,
  getLuminance, getTextOnAccent, darkenHex,
} from '../lib/styles';

function lsGet(key) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}
function lsSet(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
}
function lsRemove(key) {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
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
  return init;
}


// ─── 스티커 아이템 (바운딩박스 + 핸들)
function StickerItem({ s, cardW, selected, onMouseDown, isExporting }) {
  const handleSize = Math.max(10, cardW * 0.012);

  const getPoint = (e) => e.touches ? e.touches[0] : e;
  const wrap = (e, id, action) => {
    if (isExporting) return;
    const pt = getPoint(e);
    e.stopPropagation();
    onMouseDown({ clientX: pt.clientX, clientY: pt.clientY, preventDefault: () => e.preventDefault(), stopPropagation: () => { } }, id, action);
  };

  return (
    <div
      data-sticker-id={s.id}
      onMouseDown={isExporting ? undefined : (e) => wrap(e, s.id, 'move')}
      onTouchStart={isExporting ? undefined : (e) => wrap(e, s.id, 'move')}
      style={{
        position: 'absolute',
        left: `${s.x}%`,
        top: `${s.y}%`,
        width: `${s.width}%`,
        transform: `rotate(${s.rotation}deg)`,
        transformOrigin: 'center center',
        cursor: isExporting ? 'default' : 'move',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: s.layer === 'above' ? 10 : 1,
        outline: selected ? `${Math.max(1, cardW * 0.001)}px dashed rgba(100,140,255,0.8)` : 'none',
      }}
    >
      <img src={s.src} alt="" style={{ width: '100%', display: 'block', pointerEvents: 'none', userSelect: 'none' }} />
      {selected && !isExporting && (
        <>
          {[['nw', 'top', 'left'], ['ne', 'top', 'right'], ['sw', 'bottom', 'left'], ['se', 'bottom', 'right']].map(([dir, v, h]) => (
            <div key={dir}
              onMouseDown={(e) => { e.stopPropagation(); wrap(e, s.id, `resize-${dir}`); }}
              onTouchStart={(e) => { e.stopPropagation(); wrap(e, s.id, `resize-${dir}`); }}
              style={{ position: 'absolute', [v]: -handleSize / 2, [h]: -handleSize / 2, width: handleSize, height: handleSize, borderRadius: '50%', backgroundColor: '#4488ff', cursor: `${dir}-resize`, zIndex: 20, border: '2px solid white', touchAction: 'none' }} />
          ))}
          <div
            onMouseDown={(e) => { e.stopPropagation(); wrap(e, s.id, 'rotate'); }}
            onTouchStart={(e) => { e.stopPropagation(); wrap(e, s.id, 'rotate'); }}
            style={{ position: 'absolute', top: -handleSize * 2.5, left: '50%', transform: 'translateX(-50%)', width: handleSize, height: handleSize, borderRadius: '50%', backgroundColor: '#44cc88', cursor: 'grab', zIndex: 20, border: '2px solid white', touchAction: 'none' }} />
          <div
            onMouseDown={(e) => { e.stopPropagation(); wrap(e, s.id, 'delete'); }}
            onTouchStart={(e) => { e.stopPropagation(); wrap(e, s.id, 'delete'); }}
            style={{ position: 'absolute', top: -handleSize / 2, right: -handleSize * 1.8, width: handleSize * 1.4, height: handleSize * 1.4, borderRadius: '50%', backgroundColor: '#ff4444', cursor: 'pointer', zIndex: 20, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: handleSize * 0.8, fontWeight: 'bold', lineHeight: 1, touchAction: 'none' }}>×</div>
        </>
      )}
    </div>
  );
}

function PreviewCard({ data, accentColor, bgColor = '#ffffff', badgeTextCustom, familyIcon, selectedFont, stickers = [], selectedStickerId, onStickerMouseDown, isExporting = false, layout = 'vertical' }) {
  const {
    nickname, twitterId, subscribeFollow,
    selections, spoilerValue, spoilerOther,
    customTitle, customValue, gameStates,
  } = data;

  const isHorizontal = layout === 'horizontal';
  const familyIconData = FAMILY_ICONS.find(i => i.key === familyIcon);
  const familySrc = familyIconData
    ? (getLuminance(bgColor) > 128
      ? familyIconData.src
      : (familyIconData.srcDark || familyIconData.src))
    : null;

  const cardW = isHorizontal ? 1920 : IMAGE_SIZE.vertical.width;
  const px = (n) => `${n}px`;
  const FONT_SCALE = isHorizontal ? (cardW / 900) : (cardW / 620);
  const fs = (n) => px(Math.round(n * FONT_SCALE));

  const leftItemsRef = useRef(null);
  const rightColRef = useRef(null);
  const [commentPlacement, setCommentPlacement] = useState('left'); // 'left' | 'full'

  useLayoutEffect(() => {
    if (!isHorizontal) return undefined;

    const countRowsOf = (elements) => {
      const tops = [];
      elements.forEach((el) => {
        const top = Math.round(el.offsetTop);
        if (!tops.some((t) => Math.abs(t - top) < 4)) tops.push(top);
      });
      return tops.length;
    };

    const measure = () => {
      if (!rightColRef.current || !leftItemsRef.current) {
        setCommentPlacement('left');
        return;
      }

      const selectedGroupCount = GAME_STATE_GROUPS.filter(
        (g) => GAMES.some((gm) => gameStates[gm.key] === g.state)
      ).length;

      if (selectedGroupCount === 0) {
        setCommentPlacement('left');
        return;
      }

      // 오른쪽: 그룹(완료/플레이중/구매완료)별로 각각 줄 수를 센 뒤 합산한다.
      // 완료는 단독으로 쌓이고, 플레이중/구매완료는 나란히(병렬로) 배치되므로
      // 그 둘은 더하지 않고 더 긴 쪽(max)만 반영한다.
      const countRowsIn = (state) => {
        const container = rightColRef.current.querySelector(`[data-group-state="${state}"]`);
        if (!container) return 0;
        return countRowsOf(container.querySelectorAll('[data-game-badge]'));
      };

      const completeRows = countRowsIn('완료');
      const playingRows = countRowsIn('플레이중');
      const purchasedRows = countRowsIn('구매완료');
      const badgeRows = completeRows + Math.max(playingRows, purchasedRows);

      // 그룹 제목(플레이 완료/플레이 중/구매 완료)도 한 줄만큼의 무게로 취급한다.
      const rightWeight = badgeRows + selectedGroupCount;

      // 왼쪽: 실제 렌더링된 줄 수(뱃지 줄바꿈 포함)를 그대로 센다.
      const leftRows = countRowsOf(leftItemsRef.current.querySelectorAll('[data-left-item]'));

      setCommentPlacement(leftRows >= rightWeight ? 'full' : 'left');
    };

    measure(); // 페인트 전에 즉시 계산 → 깜빡임/점프 없음

    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    if (leftItemsRef.current) ro.observe(leftItemsRef.current);
    if (rightColRef.current) ro.observe(rightColRef.current);
    return () => ro.disconnect();
  }, [isHorizontal, selections, gameStates, customTitle, customValue]);

  const textColor = getLuminance(bgColor) > 128 ? '#1a1a1a' : '#ebebeb';
  const subTextColor = getLuminance(bgColor) > 128 ? '#555555' : '#aaaaaa';
  const borderColor = `${accentColor}33`;

  const accentDark = getLuminance(accentColor) > 160 ? darkenHex(accentColor, 50) : accentColor;

  const spoilerLabel = spoilerValue === 0 ? null
    : spoilerValue < 34 ? '약'
      : spoilerValue < 67 ? '중' : '강';

  const gameGroups = GAME_STATE_GROUPS.map((g) => ({
    ...g,
    games: GAMES.filter((gm) => gameStates[gm.key] === g.state),
  })).filter((g) => g.games.length > 0);

  const hasGameSection = gameGroups.length > 0;
  const hasSpoiler = spoilerValue > 0;


  const badgeBgColor = accentColor;
  const badgeBorder = accentColor;
  const badgeText = badgeTextCustom || '#ffffff';

  const PreviewBadge = ({ label }) => (
    <span data-left-item style={{
      display: 'inline-block',
      padding: `${fs(0)} ${fs(8)}`,
      borderRadius: '999px',
      backgroundColor: badgeBgColor,
      color: badgeText,
      border: `${fs(1.5)} solid ${badgeBorder}`,
      fontSize: fs(12),
      fontWeight: '600',
      marginRight: fs(5),
      marginBottom: fs(3),
      lineHeight: '1.4',
    }}>
      {label}
    </span>
  );

  const renderOptionRow = (row) => {
    const rawSelected = selections[row.key] || [];
    const selected = [
      ...rawSelected.filter(o => o !== '기타'),
      ...rawSelected.filter(o => o === '기타'),
    ];
    if (selected.length === 0) return null;
    const otherText = selections[row.key + 'Other'] || '';
    const hasOtherOnly = selected.length === 1 && selected[0] === '기타';
    const hasOtherBadges = selected.length > 1; // 기타 외 다른 뱃지가 함께 있는지
    const otherFontSize = hasOtherBadges ? 10 : 13;
    return (
      <div key={row.key} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: fs(9) }}>
        <span style={{ minWidth: fs(80), fontSize: fs(13), fontWeight: '800', color: subTextColor, flexShrink: 0, paddingTop: fs(3) }}>
          {row.title}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', flex: 1 }}>
          {selected.map((opt) => {
            if (opt === '기타') {
              if (!otherText.trim()) return null;
              return hasOtherOnly
                ? <Twemoji key="other" options={{ className: 'twemoji' }}><span data-left-item style={{ fontSize: fs(otherFontSize), color: textColor, display: 'inline-block', paddingTop: fs(3) }}>{otherText}</span></Twemoji>
                : <Twemoji key="other" options={{ className: 'twemoji' }}><span data-left-item style={{ fontSize: fs(otherFontSize), color: textColor, display: 'inline-block' }}>{otherText}</span></Twemoji>;
            }
            return <PreviewBadge key={opt} label={opt} />;
          })}
        </div>
      </div>
    );
  };


  const renderFreeRow = (row) => {
    const text = selections[row.key] || '';
    if (!text.trim()) return null;
    return (
      <div key={row.key} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: fs(12) }}>
        <div style={{ minWidth: fs(80), flexShrink: 0, paddingTop: fs(3) }}>
          <span style={{ fontSize: fs(13), fontWeight: '800', color: subTextColor }}>{row.title}</span>
        </div>
        <div style={{ flex: 1, paddingTop: fs(3) }}>
          <Twemoji options={{ className: 'twemoji' }}>
            <span data-left-item style={{ fontSize: fs(13), color: textColor, whiteSpace: 'pre-wrap' }}>{text}</span>
          </Twemoji>
        </div>
      </div>
    );
  };

  const renderCustomRow = () => {
    if (!customTitle.trim() || !customValue.trim()) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: fs(12) }}>
        <div style={{ width: fs(80), flexShrink: 0, paddingTop: fs(3) }}>
          <Twemoji options={{ className: 'twemoji' }}>
            <span style={{ fontSize: fs(13), fontWeight: '800', color: subTextColor, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{customTitle}</span>
          </Twemoji>
        </div>
        <div style={{ flex: 1, paddingTop: fs(3) }}>
          <Twemoji options={{ className: 'twemoji' }}>
            <span data-left-item style={{ fontSize: fs(13), color: textColor }}>{customValue}</span>
          </Twemoji>
        </div>
      </div>
    );
  };

  const SpoilerInline = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: fs(4), width: fs(120) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: fs(8) }}>
        <span style={{ fontSize: fs(13), fontWeight: '800', color: subTextColor, whiteSpace: 'nowrap' }}>스포일러</span>
        <span style={{ fontSize: fs(13), fontWeight: '800', color: accentDark }}>{spoilerLabel}</span>
      </div>
      <div style={{ width: '100%', height: fs(4), backgroundColor: getLuminance(bgColor) > 128 ? '#e8e8e8' : '#444444', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: `${spoilerValue}%`, height: '100%', backgroundColor: accentColor, borderRadius: '999px' }} />
      </div>
      {spoilerOther.trim() && (
        <Twemoji options={{ className: 'twemoji' }}>
          <div style={{ fontSize: fs(10), color: textColor, textAlign: 'right' }}>{spoilerOther}</div>
        </Twemoji>
      )}
    </div>
  );

  const GameSection = () => {
    const soloGroup = gameGroups.find(g => g.state === '완료');
    const colGroups = gameGroups.filter(g => g.state === '플레이중' || g.state === '구매완료');

    const GameBadge = ({ label }) => (
      <span data-game-badge style={{
        display: 'inline-block',
        padding: `${fs(0)} ${fs(8)}`,
        borderRadius: '999px',
        backgroundColor: badgeBgColor,
        color: badgeText,
        border: `${fs(1.5)} solid ${badgeBorder}`,
        fontSize: fs(12),
        fontWeight: '600',
        marginRight: fs(4),
        marginBottom: fs(8),
        lineHeight: '1.4',
      }}>
        {label}
      </span>
    );

    const GroupBlock = ({ group }) => (
      <div data-group-state={group.state} style={{ minWidth: 0 }}>
        <div style={{ fontSize: fs(10), fontWeight: '800', color: subTextColor, marginBottom: fs(8) }}>{group.title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {group.games.map((gm) => <GameBadge key={gm.key} label={gm.title} />)}
        </div>
      </div>
    );

    return (
      <div style={{ marginBottom: isHorizontal ? 0 : fs(8), marginTop: isHorizontal ? 0 : fs(25) }}>
        <div style={{ fontSize: fs(13), fontWeight: '800', color: subTextColor, marginBottom: fs(8), paddingBottom: isHorizontal ? 0 : fs(8), borderBottom: isHorizontal ? 'none' : `1.5px solid ${borderColor}` }}>
          게임 플레이 현황
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: fs(4) }}>
          {soloGroup && <GroupBlock group={soloGroup} />}
          {colGroups.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: fs(40), rowGap: fs(4), alignItems: 'flex-start' }}>
              {colGroups.map((g, i) => (
                <div key={g.state} style={{ flex: i === 0 ? '0 1 auto' : '1 1 auto', minWidth: 0 }}>
                  <GroupBlock group={g} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const CommentBlock = () => {
    const commentRow = ROWS.find(r => r.key === 'comment');
    const text = selections['comment'] || '';
    if (!text.trim()) return null;
    return (
      <div style={{ paddingTop: isHorizontal ? fs(10) : fs(5) }}>
        <div style={{ padding: `${fs(12)} ${fs(24)} ${fs(24)}`, backgroundColor: getLuminance(bgColor) > 128 ? '#f5f5f5' : '#2a2a2a', borderRadius: fs(8) }}>
          <div style={{ fontSize: fs(10), fontWeight: '800', color: subTextColor, marginBottom: fs(4) }}>{commentRow?.title}</div>
          <Twemoji options={{ className: 'twemoji' }}>
            <div style={{ fontSize: fs(13), color: textColor, whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{text}</div>
          </Twemoji>
        </div>
      </div>
    );
  };

  const padding = fs(40);
  const sectionGap = fs(20);

  return (
    <div style={{ width: px(cardW), backgroundColor: bgColor, fontFamily: selectedFont || 'Pretendard, sans-serif', boxSizing: 'border-box', position: 'relative', zIndex: 0 }}>
      {/* 스티커 — 텍스트 아래 레이어 */}
      {stickers.filter(s => s.layer === 'below').map(s => (
        <StickerItem key={s.id} s={s} cardW={cardW} selected={!isExporting && selectedStickerId === s.id} onMouseDown={onStickerMouseDown} isExporting={isExporting} />
      ))}
      <div style={{ padding: padding, paddingBottom: fs(10), paddingTop: fs(15), position: 'relative', zIndex: 2 }}>
        {/* 헤더 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: fs(20), alignItems: 'flex-end', marginBottom: sectionGap }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: fs(8), flexWrap: 'nowrap', minWidth: 0 }}>

            {familySrc && (
              <img
                src={familySrc}
                alt=""
                style={{
                  width: fs(56),
                  height: fs(56),
                  objectFit: 'contain',
                  flexShrink: 0,
                  position: 'relative',
                  top: fs(10),
                }}
              />
            )}
            {(() => {
              const len = (nickname || '닉네임').length;
              const nicknameFontSize = len <= 6 ? 38 : len <= 9 ? 30 : len <= 14 ? 22 : 18;
              const nicknameOffset = len <= 6 ? 0 : len <= 9 ? 2 : len <= 14 ? 7 : 7;
              return (
                <div style={{ minWidth: 0, flexShrink: 1, overflow: 'hidden' }}>
                  <Twemoji options={{ className: 'twemoji' }}>
                    <span style={{
                      fontSize: fs(nicknameFontSize),
                      fontWeight: '700',
                      color: textColor,
                      lineHeight: 1.1,
                      display: 'block',
                      whiteSpace: 'nowrap',
                      marginBottom: fs(nicknameOffset),
                    }}>
                      {nickname || '닉네임'}
                    </span>
                  </Twemoji>
                </div>
              );
            })()}

            <div style={{ display: 'flex', flexDirection: 'column', gap: fs(2), justifyContent: 'center', position: 'relative', top: fs(-5), flexShrink: 0 }}>
              {(subscribeFollow || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: fs(4), justifyContent: 'flex-start' }}>
                  {subscribeFollow.map((opt) => (
                    <span key={opt} style={{
                      display: 'inline-block', alignSelf: 'flex-start',
                      fontSize: fs(11), fontWeight: '600',
                      backgroundColor: badgeBgColor,
                      color: badgeText,
                      border: `${fs(1)} solid ${badgeBorder}`,
                      padding: `${fs(0)} ${fs(8)}`, borderRadius: '999px', whiteSpace: 'nowrap'
                    }}>
                      {opt}
                    </span>
                  ))}
                </div>
              )}

              <Twemoji options={{ className: 'twemoji' }}>
                <span style={{ fontSize: fs(12), color: textColor, fontFamily: 'Inter, sans-serif', fontWeight: '400', whiteSpace: 'nowrap' }}>
                  {twitterId || '@yourIDhere'}
                </span>
              </Twemoji>

            </div>

          </div>
          {hasSpoiler && (
            <div style={{ minWidth: fs(120), marginBottom: fs(4) }}>
              <SpoilerInline />
            </div>
          )}
        </div>
        <div style={{ height: '1.5px', backgroundColor: borderColor, marginBottom: sectionGap }} />
        {isHorizontal ? (
          /* ─── 가로형 레이아웃 ─── */
          (() => {
            const rightWidth = `${Math.round(cardW / 3)}px`;
            const leftWidth = `calc(100% - ${rightWidth} - ${fs(40)})`;
            if (!hasGameSection) {
              return (
                <>
                  <div style={{ width: leftWidth, maxWidth: '100%' }}>
                    {ROWS.map((row) => {
                      if (row.type === 'option') return renderOptionRow(row);
                      if (row.type === 'free' && row.key !== 'comment') return renderFreeRow(row);
                      if (row.type === 'custom') return renderCustomRow();
                      return null;
                    })}
                  </div>
                  <CommentBlock />
                </>
              );
            }
            return (
              <div style={{ display: 'grid', gridTemplateColumns: `${leftWidth} ${rightWidth}`, columnGap: fs(40), rowGap: 0, alignItems: 'flex-start' }}>
                {/* 왼쪽 2/3 */}
                <div style={{ minWidth: 0 }}>
                  <div ref={leftItemsRef}>
                    {ROWS.map((row) => {
                      if (row.type === 'option') return renderOptionRow(row);
                      if (row.type === 'free' && row.key !== 'comment') return renderFreeRow(row);
                      if (row.type === 'custom') return renderCustomRow();
                      return null;
                    })}
                  </div>
                  {/* 한마디 — 왼쪽이 더 짧을 때 여기 표시 */}
                  {commentPlacement === 'left' && <CommentBlock />}
                </div>
                {/* 오른쪽 1/3 */}
                <div ref={rightColRef} style={{ minWidth: 0, display: 'flow-root', position: 'relative', top: fs(-4) }}>
                  <GameSection />
                </div>
                {/* 한마디 — 왼쪽이 더 길면 grid 전체 너비 */}
                {commentPlacement === 'full' && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <CommentBlock />
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          /* ─── 세로형 레이아웃 (기존) ─── */
          <>
            {ROWS.map((row) => {
              if (row.type === 'option') return renderOptionRow(row);
              if (row.type === 'free' && row.key !== 'comment') return renderFreeRow(row);
              if (row.type === 'custom') return renderCustomRow();
              return null;
            })}
            {hasGameSection && <GameSection />}
            <CommentBlock />
          </>
        )}
      </div>
      {/* 하단 사이트 정보 */}
      <div style={{ textAlign: 'center', paddingBottom: fs(10), fontFamily: 'Pretendard, sans-serif' }}>
        <span style={{ fontSize: fs(8), color: getLuminance(bgColor) > 128 ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.22)' }}>
          용스튜 소개표 생성기 {SITE_URL} v{version}
        </span>
      </div>
      {/* 스티커 — 텍스트 위 레이어 */}
      {stickers.filter(s => s.layer === 'above').map(s => (
        <StickerItem key={s.id} s={s} cardW={cardW} selected={!isExporting && selectedStickerId === s.id} onMouseDown={onStickerMouseDown} isExporting={isExporting} />
      ))}
    </div>
  );
}

// ─── 폼 패널
function FormPanel({
  accentColor, setAccentColor,
  bgColor, setBgColor,
  badgeTextCustom, setBadgeTextCustom,
  familyIcon, setFamilyIcon,
  selectedFont, setSelectedFont,
  selectedLayout, setSelectedLayout,
  nickname, setNickname, twitterId, setTwitterId,
  subscribeFollow, toggleSubscribeFollow,
  selections, toggleOption, setFieldText,
  customTitle, setCustomTitle, customValue, setCustomValue,
  spoilerValue, setSpoilerValue, spoilerOther, setSpoilerOther,
  gameStates, setGameState,
  handleDownloadImage, handleResetAll,
  stickers = [], selectedStickerId, setSelectedStickerId, handleAddSticker,
  isMobile,
}) {
  const [hexInput, setHexInput] = useState(accentColor);
  const [colorCustomOpen, setColorCustomOpen] = useState(false);

  useEffect(() => { setHexInput(accentColor); }, [accentColor]);

  function handleHexChange(val) {
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setAccentColor(val);
    }
  }


  const [noticeOpen, setNoticeOpen] = useState(true);

  return (
    <div style={{
      width: '100%',
      flexShrink: 0,
      backgroundColor: '#151515',
      borderTop: isMobile ? '1px solid #282828' : 'none',
      padding: isMobile ? '16px' : '0',
    }}>
      {/* 안내 */}
      <div style={{ ...cardStyle, backgroundColor: 'rgba(42, 42, 42, 0.3)', border: '1px solid rgba(64, 64, 64, 0.8)', boxShadow: 'none', padding: '12px 16px', marginBottom: '24px' }}>
        {/* 제목 + 접기 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: noticeOpen ? '10px' : '0' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
              용스튜 소개표 생성기 <span style={{ fontSize: '11px', fontWeight: '400', color: '#888888', marginLeft: '6px' }}>v{version}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#bdbdbd' }}>
              #용스튜_트친소 #용과같이_트친소 #저지아이즈_트친소
            </div>
          </div>
          <button
            onClick={() => setNoticeOpen(o => !o)}
            style={{ backgroundColor: 'transparent', border: '1px solid #404040', borderRadius: '4px', color: '#888888', fontSize: '11px', cursor: 'pointer', padding: '3px 8px', flexShrink: 0, marginLeft: '8px' }}
          >
            {noticeOpen ? '접기' : '펼치기'}
          </button>
        </div>
        {/* 접히는 내용 */}
        {noticeOpen && (
          <div style={{ borderTop: '1px solid rgba(64,64,64,0.5)', paddingTop: '4px' }}>

            <p style={{ ...guideStyle, paddingTop: 8 }}>RGG Studio 게임 유저들을 위한 트친소/소개표/성향표 생성기입니다.</p>

            <ul style={{ paddingLeft: '20px', paddingTop: 12 }}>
              <li style={{ ...guideStyle, color: '#ffffff' }}>선택한 항목 순서대로 표시됩니다.</li>
              <li style={{ ...guideStyle, color: '#ffffff' }}>선택하지 않은 섹션은 이미지에 표시되지 않습니다.</li>
              <li style={{ ...guideStyle, color: '#ffffff' }}>모든 내용은 기기에 자동으로 저장됩니다.</li>
              <li style={{ ...guideStyle, color: '#ffffff' }}>오류가 있는 경우엔 브라우저 캐시 삭제 후 사용해 주세요.</li>
            </ul>

            <p style={{ ...guideStyle, paddingTop: 12 }}>PC와 모바일 모두 구글 크롬을 기준으로 제작되었으며,</p>
            <p style={guideStyle}>X(트위터) 인앱 브라우저에서 잘 작동되지 않을 수 있습니다.</p>
            <p style={{ ...guideStyle, paddingTop: 8 }}>오류나 건의 제보: <b>#용스튜소개표_제보</b> 또는 하단 메일 주소로 제보</p>
            <p style={guideStyle}>업데이트 내역은 하단 GitHub 링크의 Readme 참고</p>
          </div>
        )}
      </div>

      {/* 스타일 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>스타일</h2>

        {/* 레이아웃 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ ...labelStyle, fontSize: '12px', color: '#808080', marginBottom: '8px' }}>레이아웃</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[['vertical', '세로'], ['horizontal', '가로']].map(([val, lbl]) => (
              <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: selectedLayout === val ? '#ffffff' : '#b0b0b0' }}>
                <input
                  type="radio"
                  name="layout"
                  value={val}
                  checked={selectedLayout === val}
                  onChange={() => setSelectedLayout(val)}
                  style={{ accentColor: accentColor, cursor: 'pointer' }}
                />
                {lbl}
              </label>
            ))}
          </div>
        </div>
        <div style={{ height: '1px', backgroundColor: '#404040', marginBottom: '12px' }} />

        {/* 색상 */}
        <div style={{ marginBottom: colorCustomOpen ? '16px' : '12px' }}>
          <div style={{ ...labelStyle, fontSize: '12px', color: '#808080', marginBottom: '10px' }}>색상</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: colorCustomOpen ? '12px' : '0', flexWrap: 'wrap' }}>
            <div>
              <div style={{ ...labelStyle, fontSize: '11px', color: '#808080', marginBottom: '6px' }}>배경</div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  ['#ffffff', '밝은 배경', '3px solid #cccccc'],
                  ['#1a1a1a', '어두운 배경', '3px solid #555555'],
                ].map(([color, title, selBorder]) => (
                  <button key={color} onClick={() => {
                    setBgColor(color);
                    setBadgeTextCustom(color === '#1a1a1a' ? '#ebebeb' : '#1a1a1a');
                    if (!colorCustomOpen) {
                      const lightPresets = ['#e29898', '#cab366', '#6ca3e1', '#8ac2a3'];
                      const darkPresets = ['#7b4747', '#7b692d', '#2a4f79', '#3c7260'];
                      const lightIdx = lightPresets.indexOf(accentColor);
                      const darkIdx = darkPresets.indexOf(accentColor);
                      if (color === '#1a1a1a' && lightIdx !== -1) setAccentColor(darkPresets[lightIdx]);
                      if (color === '#ffffff' && darkIdx !== -1) setAccentColor(lightPresets[darkIdx]);
                    }
                  }} title={title}
                    style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: color, border: bgColor === color ? selBorder : '2px solid transparent', outline: bgColor === color ? '2px solid #888' : 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
                ))}
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#404040' }} />
            <div>
              <div style={{ ...labelStyle, fontSize: '11px', color: '#808080', marginBottom: '6px' }}>포인트컬러</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {(bgColor === '#1a1a1a'
                  ? [['#7b4747', '동성회'], ['#7b692d', '오미연합'], ['#2a4f79', '경찰'], ['#3c7260', '변호사']]
                  : [['#e29898', '동성회'], ['#cab366', '오미연합'], ['#6ca3e1', '경찰'], ['#8ac2a3', '변호사']]
                ).map(([color, title]) => (
                  <button key={color} onClick={() => { setAccentColor(color); setColorCustomOpen(false); setBadgeTextCustom(bgColor === '#1a1a1a' ? '#ebebeb' : '#1a1a1a'); }} title={title}
                    style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: color, border: accentColor === color && !colorCustomOpen ? '3px solid #ffffff' : '2px solid transparent', outline: accentColor === color && !colorCustomOpen ? `2px solid ${color}` : 'none', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'all 0.15s' }} />
                ))}
                <button
                  onClick={() => {
                    const next = !colorCustomOpen;
                    setColorCustomOpen(next);
                    if (!next) setBadgeTextCustom(bgColor === '#1a1a1a' ? '#ebebeb' : '#1a1a1a');
                  }}
                  style={{ ...getBadgeStyle(colorCustomOpen, accentColor), fontSize: '11px', padding: '3px 10px' }}
                >
                  컬러커스텀
                </button>
              </div>
            </div>
          </div>
          {colorCustomOpen && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap', paddingTop: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ ...labelStyle, fontSize: '11px', color: '#808080' }}>포인트</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
                    style={{ width: 28, height: 28, border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 0, backgroundColor: 'transparent', flexShrink: 0 }} />
                  <input type="text" value={hexInput} onChange={(e) => handleHexChange(e.target.value)}
                    maxLength={7} placeholder="#e29898"
                    style={{ ...inputStyle, width: '100px', fontFamily: 'inherit', fontSize: '13px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ ...labelStyle, fontSize: '11px', color: '#808080' }}>뱃지 글자</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="color" value={badgeTextCustom} onChange={(e) => setBadgeTextCustom(e.target.value)}
                    style={{ width: 28, height: 28, border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 0, backgroundColor: 'transparent', flexShrink: 0 }} />
                  <input type="text" value={badgeTextCustom} onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBadgeTextCustom(e.target.value); }}
                    maxLength={7} placeholder="#1a1a1a"
                    style={{ ...inputStyle, width: '100px', fontFamily: 'inherit', fontSize: '13px' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <div style={{ height: '1px', backgroundColor: '#404040', marginBottom: '12px' }} />

        {/* 폰트 */}
        <div>
          <div style={{ ...labelStyle, fontSize: '12px', color: '#808080', marginBottom: '8px' }}>폰트</div>
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            suppressHydrationWarning
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {[
              { value: 'Pretendard', label: 'Pretendard (기본)' },
              { value: "'JoseonGulim', sans-serif", label: '조선굴림체' },
              { value: "'MaruBuri', serif", label: '마루 부리' },
              { value: "'ChosunIlboMyungjo', serif", label: '조선일보명조체' },
              { value: "'KyoboHandwriting2019', sans-serif", label: '교보손글씨 2019' },
              { value: "'Galmuri11', sans-serif", label: '갈무리11' },
            ].map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>

        {/* 구분선 */}
        <div style={{ height: '1px', backgroundColor: '#404040', margin: '12px 0' }} />

        {/* 스티커 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ ...labelStyle, fontSize: '12px', color: '#808080' }}>스티커</div>
            <span style={{ fontSize: '11px', color: '#606060' }}>PNG · 개당 500KB 이하</span>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <button onClick={handleAddSticker}
              style={{ ...getBadgeStyle(true, accentColor), cursor: 'pointer', fontSize: '12px', padding: '4px 12px' }}>
              + 이미지 추가
            </button>
          </div>
          {stickers.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {stickers.map(s => (
                <div key={s.id} onClick={() => setSelectedStickerId(s.id === selectedStickerId ? null : s.id)}
                  style={{ width: 40, height: 40, borderRadius: '4px', border: s.id === selectedStickerId ? `2px solid ${accentColor}` : '2px solid #404040', cursor: 'pointer', overflow: 'hidden', flexShrink: 0, backgroundColor: '#1a1a1a' }}>
                  <img src={s.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 기본 정보 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>기본 정보</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
          <div>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              닉네임
              <span style={{ fontSize: '11px', color: '#808080', fontWeight: '400' }}>(최대 14자)</span>
            </label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value.slice(0, 14))} maxLength={14} placeholder="닉네임" suppressHydrationWarning style={inputStyle} />
          </div>
          <div>
            <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>트위터 아이디</label>
            <input type="text" value={twitterId} onChange={(e) => setTwitterId(e.target.value)} placeholder="@yourIDhere" suppressHydrationWarning style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginTop: '12px' }}>
          {/* 소속 아이콘 */}
          <div>
            <label style={{ ...labelStyle, display: 'block', marginBottom: '6px', fontSize: '12px', color: '#808080' }}>소속 아이콘</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {familyIcon && familyIcon !== 'none' && (
                <img src={(() => { const ic = FAMILY_ICONS.find(f => f.key === familyIcon); return (ic?.srcDark || ic?.src) || ''; })()} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              )}
              <select
                value={familyIcon}
                onChange={(e) => setFamilyIcon(e.target.value)}
                suppressHydrationWarning
                style={{ ...inputStyle, width: 'auto', paddingRight: '28px', cursor: 'pointer' }}
              >
                {FAMILY_ICONS.map(f => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>
          {/* 구독 및 팔로우 */}
          <div>
            <label style={{ ...labelStyle, display: 'block', marginBottom: '6px', paddingTop: '2px', fontSize: '12px', color: '#808080' }}>구독 및 팔로우</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUBSCRIBE_OPTIONS.map((option) => (
                <button key={option} onClick={() => toggleSubscribeFollow(option)}
                  style={{ ...getBadgeStyle((subscribeFollow || []).includes(option), accentColor), position: 'relative', top: '2px' }}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 스포일러 */}
      <div style={cardStyle}>
        <h3 style={h3Style}>스포일러</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <input
            type="range" min="0" max="100" value={spoilerValue}
            onChange={(e) => setSpoilerValue(Number(e.target.value))}
            suppressHydrationWarning
            style={{ flex: 1, accentColor: accentColor, height: '4px' }}
          />
          <input
            type="number" min="0" max="100" value={spoilerValue}
            onChange={(e) => setSpoilerValue(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            suppressHydrationWarning
            style={{ ...inputStyle, width: '70px', textAlign: 'center' }}
          />
          <span style={labelStyle}>%</span>
        </div>
        <input type="text" placeholder="추가 내용 (선택사항, 공백 포함 최대 15자)" value={spoilerOther} onChange={(e) => setSpoilerOther(e.target.value.slice(0, 15))} suppressHydrationWarning style={inputStyle} />
      </div>

      {/* ROWS */}
      {
        ROWS.map((row) => {
          if (row.type === 'option') {
            return (
              <div key={row.key} style={cardStyle}>
                <h3 style={h3Style}>{row.title}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: row.key === 'consoleUsed' ? '4px' : '8px' }}>
                  {row.options.map((option) => (
                    <button key={option} onClick={() => toggleOption(row, option)}
                      style={getBadgeStyle(selections[row.key].includes(option), accentColor)}>
                      {option}
                    </button>
                  ))}
                </div>
                {row.options.includes('기타') && selections[row.key].includes('기타') && (
                  <textarea
                    placeholder="기타 내용 입력"
                    value={selections[row.key + 'Other']}
                    onChange={(e) => { setFieldText(row.key + 'Other', e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                    suppressHydrationWarning rows={1}
                    style={{ ...inputStyle, marginTop: '12px', resize: 'none', overflow: 'hidden' }}
                  />
                )}
              </div>
            );
          } else if (row.type === 'custom') {
            return (
              <div key={row.key} style={cardStyle}>
                <h3 style={h3Style}>자유 기입 항목 (선택)</h3>
                <input type="text" placeholder="제목 입력" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} suppressHydrationWarning style={{ ...inputStyle, marginBottom: '8px', fontWeight: '600' }} />
                <input type="text" placeholder="내용 입력" value={customValue} onChange={(e) => setCustomValue(e.target.value)} suppressHydrationWarning style={inputStyle} />
              </div>
            );
          } else {
            return (
              <div key={row.key} style={cardStyle}>
                <label style={{ ...labelStyle, display: 'block', marginBottom: '8px', fontWeight: '600' }}>{row.title}</label>
                {row.multiline ? (
                  <textarea value={selections[row.key]}
                    onChange={(e) => { setFieldText(row.key, e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                    rows={3} suppressHydrationWarning
                    style={{ ...inputStyle, resize: 'vertical', overflow: 'hidden', fontFamily: 'inherit' }} />
                ) : (
                  <input type="text" value={selections[row.key]} onChange={(e) => setFieldText(row.key, e.target.value)} suppressHydrationWarning style={inputStyle} />
                )}
              </div>
            );
          }
        })
      }

      {/* 게임 체크리스트 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>게임 체크리스트</h2>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 45px 45px 45px 45px', gap: '4px', alignItems: 'center', minWidth: '360px' }}>
            <div />
            {GAME_STATES.map((state) => (
              <div key={state} style={{ fontWeight: '600', textAlign: 'center', fontSize: '10px', color: '#b0b0b0' }}>{GAME_STATE_LABELS[state]}</div>
            ))}
            {GAMES.map((game, idx) => (
              <Fragment key={game.key}>
                {idx > 0 && idx % 5 === 0 && <div style={{ gridColumn: '1 / -1', height: '1px', backgroundColor: '#404040', margin: '6px 0' }} />}
                <div style={{ fontSize: '12px', color: '#c0c0c0', textAlign: 'right', paddingRight: '12px' }}>{game.title}</div>
                {GAME_STATES.map((state) => (
                  <div key={state} style={{ textAlign: 'center' }}>
                    <input type="radio" name={`game-${game.key}`} checked={gameStates[game.key] === state} onChange={() => setGameState(game.key, state)} style={{ cursor: 'pointer', accentColor }} suppressHydrationWarning />
                  </div>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 저장 */}
      <button
        onClick={handleDownloadImage}
        onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.target.style.opacity = '1')}
        style={{ backgroundColor: accentColor, color: getTextOnAccent(accentColor), border: 'none', borderRadius: '4px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s', width: '100%', marginBottom: '12px' }}>
        이미지로 저장하기
      </button>

      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <button onClick={handleResetAll} style={{ backgroundColor: 'transparent', color: '#606060', border: 'none', fontSize: '12px', cursor: 'pointer', padding: '6px 12px', opacity: '0.6' }} onMouseEnter={(e) => (e.target.style.opacity = '1')} onMouseLeave={(e) => (e.target.style.opacity = '0.8')}>
          모든 설정 초기화
        </button>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #282828', paddingTop: '20px', paddingBottom: '20px', textAlign: 'center', fontSize: '11px' }}>
        <div style={{ color: '#a0a0a0' }}>
          <a href="https://twitter.com/ppansuman" target="_blank" rel="noopener noreferrer" style={linkStyle}>사이트 제작: 빤수맨 X: @ppansuman</a>
        </div>
        <div style={{ color: '#a0a0a0', marginBottom: '12px' }}>
          <a href="mailto:ppansuman@gmail.com" style={linkStyle}>이용 문의 및 건의사항: ppansuman@gmail.com</a>
          {' | '}
          <a href="https://github.com/ppansuman/rgg_friend" target="_blank" rel="noopener noreferrer" style={linkStyle}>GitHub</a>
          {' | '}
          <a href="https://x.com/ppansuman/status/1727017805470638231?s=20" target="_blank" rel="noopener noreferrer" style={linkStyle}>이전 트친소표</a>
        </div>
        <div style={{ color: '#606060', marginBottom: '6px' }}>마지마코 / 이시오다 / 하루카를 그려주시면 제작자가 기뻐합니다...💕</div>
        <div style={{ ...footerTextStyle, fontSize: '10px', color: '#505050' }}>
          <div>본 사이트는 용과 같이(Like a Dragon) 시리즈의 팬이 개인적으로 제작한 비상업적 트친소 및 소개표 생성기입니다.</div>
          <div>RGG Studio / SEGA와 공식적인 관련이 없으며 수익을 목적으로 하지 않습니다.</div>
          <div>용과 같이 시리즈 및 관련 소재의 저작권은 © RGG Studio / SEGA에 있습니다.</div>
          <div style={{ paddingTop: '8px' }}>v{version} · Last Updated: {lastUpdated}</div>
        </div>
      </div>
    </div >
  );
}

// ─── 메인 
export default function Home() {
  const previewRef = useRef(null);
  const previewWrapRef = useRef(null);

  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);
  const [bgColor, setBgColorState] = useState('#ffffff');
  const [badgeTextCustom, setBadgeTextCustomState] = useState('#1a1a1a');
  const [familyIcon, setFamilyIconState] = useState('tojo');
  const [selectedFont, setSelectedFontState] = useState('Pretendard');
  const [selectedLayout, setSelectedLayoutState] = useState('vertical');
  const [stickers, setStickers] = useState([]);
  const [selectedStickerId, setSelectedStickerId] = useState(null);
  const [stickerLayer, setStickerLayer] = useState('above');
  const dragRef = useRef(null);
  const previewInnerRef = useRef(null);
  const stickerFileInputRef = useRef(null);
  const [nickname, setNicknameState] = useState('');
  const [twitterId, setTwitterIdState] = useState('');
  const [subscribeFollow, setSubscribeFollowState] = useState([]);
  const [customTitle, setCustomTitleState] = useState('');
  const [customValue, setCustomValueState] = useState('');
  const [selections, setSelectionsState] = useState(buildInitialSelections);
  const [spoilerValue, setSpoilerValueState] = useState(0);
  const [spoilerOther, setSpoilerOtherState] = useState('');
  const [gameStates, setGameStatesState] = useState(() => {
    const init = {};
    GAMES.forEach((g) => { init[g.key] = '대기'; });
    return init;
  });
  const [zoom, setZoom] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ac = lsGet('rgg_accentColor'); if (ac) setAccentColorState(ac);
    const bg = lsGet('rgg_bgColor'); if (bg) setBgColorState(bg);
    const tc = lsGet('rgg_badgeTextCustom'); if (tc) setBadgeTextCustomState(tc);
    const fi = lsGet('rgg_familyIcon'); setFamilyIconState(fi || 'tojo');
    const sf = lsGet('rgg_selectedFont'); if (sf) setSelectedFontState(sf);
    const sl = lsGet('rgg_selectedLayout'); if (sl) setSelectedLayoutState(sl);
    try { const st = lsGet('rgg_stickers'); if (st) setStickers(JSON.parse(st)); } catch (e) { }
    const n = lsGet('rgg_nickname'); if (n) setNicknameState(n);
    const t = lsGet('rgg_twitterId'); if (t) setTwitterIdState(t);
    const sf2 = lsGet('rgg_subscribeFollow'); if (sf2) { try { setSubscribeFollowState(JSON.parse(sf2)); } catch (e) { } }
    const ct = lsGet('rgg_customTitle'); if (ct) setCustomTitleState(ct);
    const cv = lsGet('rgg_customValue'); if (cv) setCustomValueState(cv);
    const s = lsGet('rgg_selections'); if (s) setSelectionsState(JSON.parse(s));
    const sv = lsGet('rgg_spoilerValue'); if (sv) setSpoilerValueState(Number(sv));
    const so = lsGet('rgg_spoilerOther'); if (so) setSpoilerOtherState(so);
    const gs = lsGet('rgg_gameStates'); if (gs) setGameStatesState(JSON.parse(gs));
  }, []);

  const setAccentColor = (v) => { setAccentColorState(v); lsSet('rgg_accentColor', v); };
  const setBgColor = (v) => { setBgColorState(v); lsSet('rgg_bgColor', v); };
  const setBadgeTextCustom = (v) => { setBadgeTextCustomState(v); lsSet('rgg_badgeTextCustom', v); };
  const setFamilyIcon = (v) => { setFamilyIconState(v); lsSet('rgg_familyIcon', v); };
  const setSelectedFont = (v) => { setSelectedFontState(v); lsSet('rgg_selectedFont', v); };
  const setSelectedLayout = (v) => { setSelectedLayoutState(v); lsSet('rgg_selectedLayout', v); };

  const saveStickers = (arr) => {
    setStickers(arr);
    try { lsSet('rgg_stickers', JSON.stringify(arr)); } catch (e) { }
  };

  const handleAddSticker = () => {
    stickerFileInputRef.current?.click();
  };

  const handleStickerFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) { alert('이미지는 500KB 이하만 가능합니다.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newS = { id: Date.now(), src: ev.target.result, x: 30, y: 10, width: 20, rotation: 0, layer: stickerLayer };
      const next = [...stickers, newS];
      saveStickers(next);
      setSelectedStickerId(newS.id);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleStickerMouseDown = (e, id, action) => {
    if (action === 'delete') { saveStickers(stickers.filter(s => s.id !== id)); setSelectedStickerId(null); return; }
    e.preventDefault();
    e.stopPropagation();
    setSelectedStickerId(id);
    const s = stickers.find(st => st.id === id);
    if (!s || !previewInnerRef.current) return;

    const rect = previewInnerRef.current.getBoundingClientRect();
    // 브라우저별로 CSS zoom이 getBoundingClientRect에 반영되는 정도가 달라
    // rect.width를 직접 신뢰하지 않고 cardW * zoom으로 항상 동일하게 계산한다
    const displayW = cardW * zoom;
    const cx = rect.left + displayW * (s.x / 100) + displayW * (s.width / 100) / 2;
    const cy = rect.top + displayW * (s.y / 100) + displayW * (s.width / 100) / 2;

    dragRef.current = { action, id, startX: e.clientX, startY: e.clientY, origS: { ...s }, cx, cy, displayW };

    const onMove = (me) => {
      if (!dragRef.current) return;
      const { action, origS, startX, startY, displayW, cx, cy } = dragRef.current;
      const pt = me.touches ? me.touches[0] : me;
      const dxPct = (pt.clientX - startX) / displayW * 100;
      const dyPct = (pt.clientY - startY) / displayW * 100;

      setStickers(prev => prev.map(st => {
        if (st.id !== id) return st;
        if (action === 'move') return {
          ...st,
          x: Math.min(95, origS.x + dxPct),
          y: Math.min(95, origS.y + dyPct),
        };
        if (action === 'rotate') {
          const angle = Math.atan2(pt.clientY - cy, pt.clientX - cx) * (180 / Math.PI);
          return { ...st, rotation: Math.round(angle + 90) };
        }
        if (action.startsWith('resize')) {
          const dw = action.includes('e') ? dxPct : -dxPct;
          return { ...st, width: Math.max(3, Math.min(100, origS.width + dw)) };
        }
        return st;
      }));
    };
    const onUp = () => {
      setStickers(prev => { try { lsSet('rgg_stickers', JSON.stringify(prev)); } catch (e) { } return prev; });
      dragRef.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  };
  const setNickname = (v) => { setNicknameState(v); lsSet('rgg_nickname', v); };
  const setTwitterId = (v) => { setTwitterIdState(v); lsSet('rgg_twitterId', v); };
  const setSubscribeFollow = (v) => { setSubscribeFollowState(v); lsSet('rgg_subscribeFollow', JSON.stringify(v)); };
  const toggleSubscribeFollow = (option) => {
    // FUB FREE / MUTUALS ONLY는 서로 배타적: 하나만 선택되거나 둘 다 선택 안 될 수 있음
    setSubscribeFollow(
      (subscribeFollow || []).includes(option) ? [] : [option]
    );
  };
  const setCustomTitle = (v) => { setCustomTitleState(v); lsSet('rgg_customTitle', v); };
  const setCustomValue = (v) => { setCustomValueState(v); lsSet('rgg_customValue', v); };
  const setSpoilerValue = (v) => { setSpoilerValueState(v); lsSet('rgg_spoilerValue', String(v)); };
  const setSpoilerOther = (v) => { setSpoilerOtherState(v); lsSet('rgg_spoilerOther', v); };

  const setSelections = (value) => {
    const nv = typeof value === 'function' ? value(selections) : value;
    setSelectionsState(nv);
    lsSet('rgg_selections', JSON.stringify(nv));
  };

  const setGameStates = (value) => {
    const nv = typeof value === 'function' ? value(gameStates) : value;
    setGameStatesState(nv);
    lsSet('rgg_gameStates', JSON.stringify(nv));
  };

  function toggleOption(row, value) {
    setSelections((prev) => {
      const current = prev[row.key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [row.key]: next };
    });
  }

  function setFieldText(rowKey, value) {
    setSelections((prev) => ({ ...prev, [rowKey]: value }));
  }

  function setGameState(key, state) {
    setGameStates((prev) => ({ ...prev, [key]: state }));
  }

  const cardW = selectedLayout === 'horizontal' ? 1920 : IMAGE_SIZE.vertical.width;

  useEffect(() => {
    function update() {
      if (!previewWrapRef.current) return;
      const mobile = window.innerWidth < 1180;
      setIsMobile(mobile);
      const wrapW = previewWrapRef.current.offsetWidth;
      if (!wrapW) return;
      const usableW = wrapW - (mobile ? 32 : 48);
      const wrapH = previewWrapRef.current.offsetHeight - (mobile ? 32 : 48);
      const scaleByW = usableW / cardW;
      const scaleByH = mobile ? Infinity : wrapH / IMAGE_SIZE.vertical.minHeight;
      setZoom(Math.min(scaleByW, scaleByH, 0.5));
    }
    update();
    window.addEventListener('resize', update);

    let ro;
    if (previewWrapRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(previewWrapRef.current);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (ro) ro.disconnect();
    };
  }, [isMobile, cardW]);

  async function handleDownloadImage() {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 1, useCORS: true, allowTaint: true,
        backgroundColor: bgColor || '#ffffff', logging: false,
        width: cardW, height: previewRef.current.scrollHeight,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const now = new Date();
        const ts = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0'), String(now.getHours()).padStart(2, '0'), String(now.getMinutes()).padStart(2, '0'), String(now.getSeconds()).padStart(2, '0')].join('');
        a.download = `rgg-friend_${ts}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (e) {
      console.error('이미지 저장 실패:', e);
      alert('이미지 저장에 실패했습니다.');
    }
  }

  function handleResetAll() {
    if (!window.confirm('모든 설정을 초기화하시겠습니까?')) return;
    setAccentColorState(DEFAULT_ACCENT);
    setBgColorState('#ffffff');
    setBadgeTextCustomState('#1a1a1a');
    setFamilyIconState('tojo');
    setSelectedFontState('Pretendard');
    setSelectedLayoutState('vertical');
    saveStickers([]);
    setSelectedStickerId(null);
    setNicknameState('');
    setTwitterIdState('');
    setSubscribeFollowState([]);
    setCustomTitleState('');
    setCustomValueState('');
    setSelectionsState(buildInitialSelections());
    setSpoilerValueState(0);
    setSpoilerOtherState('');
    const init = {};
    GAMES.forEach((g) => { init[g.key] = '대기'; });
    setGameStatesState(init);
    LS_KEYS.forEach(lsRemove);
  }

  const previewData = { nickname, twitterId, subscribeFollow, selections, spoilerValue, spoilerOther, customTitle, customValue, gameStates };

  const PreviewArea = (
    <div ref={previewWrapRef} style={{
      flex: isMobile ? 'none' : 1,
      minWidth: 0,
      height: isMobile ? 'auto' : '100%',
      backgroundColor: '#0f0f0f',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: isMobile ? '16px' : '24px',
      overflowY: isMobile ? 'visible' : 'auto',
      overflowX: 'hidden',
    }}>
      {/* 숨김 파일 input — 스티커 추가용 */}
      <input ref={stickerFileInputRef} type="file" accept="image/png,image/gif,image/webp" onChange={handleStickerFile} style={{ display: 'none' }} />
      {/* 저장용 원본 — 화면 밖에 숨김 */}
      <div ref={previewRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: `${cardW}px`, pointerEvents: 'none', zIndex: -1 }}>
        <PreviewCard data={previewData} accentColor={accentColor} bgColor={bgColor} badgeTextCustom={badgeTextCustom} familyIcon={familyIcon} selectedFont={selectedFont} layout={selectedLayout} stickers={stickers} isExporting={true} />
      </div>
      {/* 미리보기 — zoom 적용 */}
      <div ref={previewInnerRef} data-preview-inner style={{
        zoom: zoom,
        borderRadius: `${8 / zoom}px`,
        border: `${1 / zoom}px solid #333`,
        overflow: 'hidden',
        maxWidth: '100%',
        width: `${cardW}px`,
      }}>
        <PreviewCard data={previewData} accentColor={accentColor} bgColor={bgColor} badgeTextCustom={badgeTextCustom} familyIcon={familyIcon} selectedFont={selectedFont} layout={selectedLayout} stickers={stickers} selectedStickerId={selectedStickerId} onStickerMouseDown={handleStickerMouseDown} />
      </div>
    </div>
  );

  const formProps = {
    accentColor, setAccentColor,
    bgColor, setBgColor,
    badgeTextCustom, setBadgeTextCustom,
    familyIcon, setFamilyIcon,
    selectedFont, setSelectedFont,
    selectedLayout, setSelectedLayout,
    nickname, setNickname, twitterId, setTwitterId,
    subscribeFollow, toggleSubscribeFollow,
    selections, toggleOption, setFieldText,
    customTitle, setCustomTitle, customValue, setCustomValue,
    spoilerValue, setSpoilerValue, spoilerOther, setSpoilerOther,
    gameStates, setGameState,
    handleDownloadImage, handleResetAll,
    stickers, selectedStickerId, setSelectedStickerId, handleAddSticker,
    isMobile,
  };

  return (
    <>
      <Head>
        <title>용스튜 소개표 생성기</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/galmuri@latest/dist/galmuri.css" />
        <style>{`
          @font-face { font-family: 'Galmuri11'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/2506-1@1.0/Galmuri11-Bold.woff2') format('woff2'); font-weight: 700; font-display: swap; }
          @font-face { font-family: 'ChosunIlboMyungjo'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff') format('woff'); font-weight: normal; font-display: swap; }
          @font-face { font-family: 'MaruBuri'; src: url('https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Regular.woff2'); font-weight: 400; font-display: swap; }
          @font-face { font-family: 'MaruBuri'; src: url('https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-SemiBold.woff2'); font-weight: 600; font-display: swap; }
          @font-face { font-family: 'MaruBuri'; src: url('https://hangeul.pstatic.net/hangeul_static/webfont/MaruBuri/MaruBuri-Bold.woff2'); font-weight: 700; font-display: swap; }
          @font-face { font-family: 'JoseonGulim'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGu.woff') format('woff'); font-weight: normal; font-display: swap; }
          @font-face { font-family: 'KyoboHandwriting2019'; src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff') format('woff'); font-weight: normal; font-display: swap; }
        `}</style>
        <style>{`.twemoji{height:1em!important;width:1em!important;display:inline!important;vertical-align:-0.1em!important}`}</style>
      </Head>

      <div style={{ backgroundColor: '#151515', color: '#e0e0e0' }}>
        {isMobile ? (
          /* 모바일: 이미지 상단, 폼 아래 — 전체 스크롤 (이미지도 같이 올라감) */
          <div style={{ minHeight: '100vh' }}>
            {PreviewArea}
            <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
              <FormPanel {...formProps} />
            </div>
          </div>
        ) : (
          /* 데스크탑: 이미지 왼쪽 최대 50%, 폼 오른쪽 */
          <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* 왼쪽: 이미지 — 남은 공간 모두 */}
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              {PreviewArea}
            </div>
            {/* 오른쪽: 폼 — 고정 너비 */}
            <div style={{ width: '480px', flexShrink: 0, overflowY: 'auto', backgroundColor: '#151515', borderLeft: '1px solid #282828' }}>
              <div style={{ padding: '24px' }}>
                <FormPanel {...formProps} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}