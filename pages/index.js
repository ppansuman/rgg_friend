import { useEffect, useRef, useState, Fragment } from 'react';
import Twemoji from 'react-twemoji';
import Head from 'next/head';
import { version, lastUpdated } from '../package.json';

import {
  ROWS, IMAGE_SIZE, GAME_STATES, GAME_STATE_LABELS,
  GAME_STATE_GROUPS, GAMES, SITE_URL, DEFAULT_ACCENT, LS_KEYS, FAMILY_ICONS,
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


function PreviewCard({ data, accentColor, bgColor = '#ffffff', badgeTextCustom, familyIcon }) {
  const {
    nickname, twitterId, fubFree,
    selections, spoilerValue, spoilerOther,
    customTitle, customValue, gameStates,
  } = data;

  const familySrc =
    FAMILY_ICONS.find(i => i.key === familyIcon)?.src;

  const cardW = IMAGE_SIZE.vertical.width;
  const px = (n) => `${n}px`;
  const FONT_SCALE = (cardW / 620);
  const fs = (n) => px(Math.round(n * FONT_SCALE));

  const textColor = getLuminance(bgColor) > 128 ? '#1a1a1a' : '#f0f0f0';
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

  const isNearWhite = getLuminance(accentColor) > 230;
  const isNearBlack = getLuminance(accentColor) < 25;

  const toLinear = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  const getWcagText = (hexBg) => {
    const h = hexBg.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) || 0, g = parseInt(h.slice(2, 4), 16) || 0, b = parseInt(h.slice(4, 6), 16) || 0;
    const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    const contrastWhite = (1.05) / (L + 0.05);
    const contrastBlack = (L + 0.05) / (0.05);
    return contrastWhite > contrastBlack ? '#ffffff' : '#222222';
  };

  const badgeBgColor = isNearWhite ? '#e0e0e0' : isNearBlack ? '#444444' : accentColor;
  const badgeBorder = isNearWhite ? '#aaaaaa' : isNearBlack ? '#666666' : accentColor;
  const badgeText = badgeTextCustom
    ? badgeTextCustom
    : isNearWhite ? '#555555' : isNearBlack ? '#cccccc' : getWcagText(badgeBgColor);

  const PreviewBadge = ({ label }) => (
    <span style={{
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
                ? <span key="other" style={{ fontSize: fs(14), color: textColor }}>{otherText}</span>
                : <span key="other" style={{ fontSize: fs(14), color: textColor, marginBottom: fs(5) }}>{otherText}</span>;
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
      <div key={row.key} style={{ display: 'flex', alignItems: 'center', marginBottom: fs(12) }}>
        <span style={{ minWidth: fs(80), fontSize: fs(13), fontWeight: '800', color: subTextColor, flexShrink: 0 }}>
          {row.title}
        </span>
        <Twemoji options={{ className: 'twemoji' }}>
          <span style={{ fontSize: fs(14), color: textColor, whiteSpace: 'pre-wrap', flex: 1 }}>{text}</span>
        </Twemoji>
      </div>
    );
  };

  const renderCustomRow = () => {
    if (!customTitle.trim() || !customValue.trim()) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: fs(12) }}>
        <span style={{ minWidth: fs(80), fontSize: fs(13), fontWeight: '800', color: subTextColor, flexShrink: 0 }}>
          {customTitle}
        </span>
        <Twemoji options={{ className: 'twemoji' }}>
          <span style={{ fontSize: fs(14), color: textColor, flex: 1 }}>{customValue}</span>
        </Twemoji>
      </div>
    );
  };

  const SpoilerInline = () => (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: fs(6), width: fs(160) }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: fs(8) }}>
        <span style={{ fontSize: fs(13), fontWeight: '800', color: subTextColor, whiteSpace: 'nowrap' }}>스포일러</span>
        <span style={{ fontSize: fs(14), fontWeight: '800', color: isNearWhite ? '#777777' : isNearBlack ? '#888888' : accentDark }}>{spoilerLabel}</span>
      </div>
      <div style={{ width: '100%', height: fs(7), backgroundColor: getLuminance(bgColor) > 128 ? '#e8e8e8' : '#444444', borderRadius: '999px', overflow: 'hidden' }}>
        <div style={{ width: `${spoilerValue}%`, height: '100%', backgroundColor: isNearWhite ? '#aaaaaa' : isNearBlack ? '#666666' : accentColor, borderRadius: '999px' }} />
      </div>
      {spoilerOther.trim() && (
        <div style={{ fontSize: fs(10), color: textColor, textAlign: 'right' }}>{spoilerOther}</div>
      )}
    </div>
  );

  const GameSection = () => {
    const soloGroup = gameGroups.find(g => g.state === '완료');
    const colGroups = gameGroups.filter(g => g.state === '플레이중' || g.state === '구매완료');

    const GameBadge = ({ label }) => (
      <span style={{
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
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontSize: fs(13), fontWeight: '800', color: subTextColor, marginBottom: fs(8) }}>{group.title}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {group.games.map((gm) => <GameBadge key={gm.key} label={gm.title} />)}
        </div>
      </div>
    );

    return (
      <div style={{ marginBottom: fs(8), marginTop: fs(25) }}>
        <div style={{ fontSize: fs(15), fontWeight: '700', color: subTextColor, marginBottom: fs(8), paddingBottom: fs(8), borderBottom: `1.5px solid ${borderColor}` }}>
          게임 플레이 현황
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: fs(10) }}>
          {soloGroup && <GroupBlock group={soloGroup} />}
          {colGroups.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: fs(10) }}>
              {colGroups.map(g => <div key={g.state} style={{ flex: '0 0 auto' }}><GroupBlock group={g} /></div>)}
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
      <div style={{ marginTop: fs(10) }}>
        <div style={{ padding: `${fs(12)} ${fs(24)} ${fs(24)}`, backgroundColor: getLuminance(bgColor) > 128 ? '#f5f5f5' : '#2a2a2a', borderRadius: fs(8) }}>
          <div style={{ fontSize: fs(10), fontWeight: '800', color: subTextColor, marginBottom: fs(4) }}>{commentRow?.title}</div>
          <Twemoji options={{ className: 'twemoji' }}>
            <div style={{ fontSize: fs(14), color: textColor, whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{text}</div>
          </Twemoji>
        </div>
      </div>
    );
  };

  const padding = fs(40);
  const sectionGap = fs(20);

  return (
    <div style={{ width: px(cardW), backgroundColor: bgColor, fontFamily: 'Pretendard, sans-serif', boxSizing: 'border-box' }}>
      <div style={{ padding: padding, paddingBottom: fs(20), paddingTop: fs(25) }}>
        {/* 헤더 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: fs(20), alignItems: 'flex-end', marginBottom: sectionGap }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: fs(8), flexWrap: 'wrap' }}>

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
                  top: '20px',
                  filter: 'drop-shadow(0 2px 15px rgba(0,0,0,0.25))'
                }}
              />
            )}
            <Twemoji options={{ className: 'twemoji' }}>
              <span style={{ fontSize: fs(38), fontWeight: '700', color: textColor, lineHeight: 1.1 }}>
                {nickname || '닉네임'}
              </span>
            </Twemoji>

            <div style={{ display: 'flex', flexDirection: 'column', gap: fs(2), justifyContent: 'center' }}>
              {fubFree && (
                <span style={{
                  display: 'inline-block', alignSelf: 'flex-start',
                  fontSize: fs(11), fontWeight: '600',
                  backgroundColor: badgeBgColor,
                  color: badgeText,
                  border: `${fs(1)} solid ${badgeBorder}`,
                  padding: `${fs(3)} ${fs(10)}`, borderRadius: '999px', whiteSpace: 'nowrap'
                }}>
                  FUB FREE
                </span>
              )}

              <span style={{ fontSize: fs(14), color: isNearWhite ? '#777777' : isNearBlack ? '#888888' : accentDark, fontFamily: 'Inter, sans-serif', fontWeight: '400' }}>
                {twitterId || '@yourIDhere'}
              </span>

            </div>

          </div>
          {hasSpoiler && (
            <div style={{ minWidth: fs(160), marginBottom: fs(4) }}>
              <SpoilerInline />
            </div>
          )}
        </div>
        <div style={{ height: '1.5px', backgroundColor: borderColor, marginBottom: sectionGap }} />
        {ROWS.map((row) => {
          if (row.type === 'option') return renderOptionRow(row);
          if (row.type === 'free' && row.key !== 'comment') return renderFreeRow(row);
          if (row.type === 'custom') return renderCustomRow();
          return null;
        })}
        {hasGameSection && <GameSection />}
        <CommentBlock />
      </div>
      {/* 하단 사이트 정보 */}
      <div style={{ textAlign: 'center', paddingBottom: fs(20) }}>
        <span style={{ fontSize: fs(12), color: getLuminance(bgColor) > 128 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.15)' }}>
          용스튜 소개표 생성기 {SITE_URL}
        </span>
      </div>
    </div>
  );
}

// ─── 폼 패널 (외부 컴포넌트 — 재마운트 방지) ──────────────────
function FormPanel({
  accentColor, setAccentColor,
  bgColor, setBgColor,
  badgeTextCustom, setBadgeTextCustom,
  familyIcon, setFamilyIcon,
  nickname, setNickname, twitterId, setTwitterId,
  fubFree, setFubFree,
  selections, toggleOption, setFieldText,
  customTitle, setCustomTitle, customValue, setCustomValue,
  spoilerValue, setSpoilerValue, spoilerOther, setSpoilerOther,
  gameStates, setGameState,
  handleDownloadImage, handleResetAll,
  isMobile,
}) {
  const [hexInput, setHexInput] = useState(accentColor);

  useEffect(() => { setHexInput(accentColor); }, [accentColor]);

  function handleHexChange(val) {
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setAccentColor(val);
    }
  }

  const isNearWhiteAccent = getLuminance(accentColor) > 230;
  const isNearBlackAccent = getLuminance(accentColor) < 25;

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
          <div style={{ borderTop: '1px solid rgba(64,64,64,0.5)', paddingTop: '10px' }}>
            <p style={{ ...guideStyle, color: '#ffffff' }}><b>- 체크한 항목 순서대로 표시됩니다.</b></p>
            <p style={{ ...guideStyle, color: '#ffffff' }}><b>- 체크하지 않은 섹션은 이미지에 표시되지 않습니다.</b></p>
            <p style={{ ...guideStyle, color: '#ffffff' }}><b>- 모든 내용은 기기에 자동으로 저장됩니다.</b></p>
            <p style={{ ...guideStyle, color: '#ffffff' }}><b>- 오류가 있는 경우엔 브라우저 캐시 삭제 후 사용해 주세요.</b></p>
            <p style={{ ...guideStyle, paddingTop: 8 }}>PC와 모바일 모두 구글 크롬을 기준으로 제작되었으며,</p>
            <p style={guideStyle}>X(트위터) 인앱 브라우저에서 잘 작동되지 않을 수 있습니다.</p>
            <p style={{ ...guideStyle, paddingTop: 8 }}>오류나 건의 제보: <b>#용스튜소개표_제보</b> 또는 하단 메일 주소로 제보</p>
            <p style={guideStyle}>업데이트 내역은 하단 GitHub 링크의 Readme 참고</p>
          </div>
        )}
      </div>

      {/* 색상 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>색상</h2>

        {/* 1행: 배경 칩 + 포인트컬러 프리셋 4종 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          {/* 배경 */}
          <div>
            <div style={{ ...labelStyle, fontSize: '11px', color: '#808080', marginBottom: '6px' }}>배경</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[['#ffffff', '밝은 배경', '3px solid #cccccc'], ['#1a1a1a', '어두운 배경', '3px solid #555555']].map(([color, title, selBorder]) => (
                <button key={color} onClick={() => setBgColor(color)} title={title}
                  style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: color, border: bgColor === color ? selBorder : '2px solid transparent', outline: bgColor === color ? '2px solid #888' : 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
              ))}
            </div>
          </div>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#404040' }} />
          {/* 포인트컬러 프리셋 */}
          <div>
            <div style={{ ...labelStyle, fontSize: '11px', color: '#808080', marginBottom: '6px' }}>포인트컬러</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                ['#e29898', '동성회'], ['#cbbc8b', '오미연합'], ['#84b7f0', '경찰'], ['#9fd1b5', '변호사'],
              ].map(([color, title]) => (
                <button key={color} onClick={() => setAccentColor(color)} title={title}
                  style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: color, border: accentColor === color ? '3px solid #ffffff' : '2px solid transparent', outline: accentColor === color ? `2px solid ${color}` : 'none', cursor: 'pointer', padding: 0, flexShrink: 0, transition: 'all 0.15s' }} />
              ))}
            </div>
          </div>
        </div>

        {/* 2행: 커스텀 포인트컬러 + 글자색 나란히 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
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
            <span style={{ ...labelStyle, fontSize: '11px', color: '#808080' }}>뱃지 글자 (기본값: #1a1a1a)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="color" value={badgeTextCustom} onChange={(e) => setBadgeTextCustom(e.target.value)}
                style={{ width: 28, height: 28, border: 'none', borderRadius: '50%', cursor: 'pointer', padding: 0, backgroundColor: 'transparent', flexShrink: 0 }} />
              <input type="text" value={badgeTextCustom} onChange={(e) => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setBadgeTextCustom(e.target.value); }}
                maxLength={7} placeholder="#1a1a1a"
                style={{ ...inputStyle, width: '100px', fontFamily: 'inherit', fontSize: '13px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>기본 정보</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
          <div>
            <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>닉네임</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" suppressHydrationWarning style={inputStyle} />
          </div>
          <div>
            <label style={{ ...labelStyle, display: 'block', marginBottom: '6px' }}>트위터 아이디</label>
            <input type="text" value={twitterId} onChange={(e) => setTwitterId(e.target.value)} placeholder="@yourIDhere" suppressHydrationWarning style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <div>
            <label style={{ ...labelStyle, display: 'block', marginBottom: '6px', fontSize: '12px', color: '#808080' }}>소속 아이콘</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {familyIcon && familyIcon !== 'none' && (
                <img src={FAMILY_ICONS.find(f => f.key === familyIcon)?.src || ''} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />
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
        </div>
        <div style={{ marginTop: '8px' }}>
          <button onClick={() => setFubFree(!fubFree)} style={getBadgeStyle(fubFree, accentColor)}>
            FUB FREE
          </button>
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
        <input type="text" placeholder="추가 내용 (선택사항, 최대 22자)" value={spoilerOther} onChange={(e) => setSpoilerOther(e.target.value.slice(0, 22))} suppressHydrationWarning style={inputStyle} />
      </div>

      {/* ROWS */}
      {ROWS.map((row) => {
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
      })}

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
        style={{ backgroundColor: (isNearWhiteAccent || isNearBlackAccent) ? (isNearWhiteAccent ? '#e8e8e8' : '#333333') : accentColor, color: (isNearWhiteAccent || isNearBlackAccent) ? (isNearWhiteAccent ? '#555555' : '#cccccc') : getTextOnAccent(accentColor), border: isNearWhiteAccent ? '1.5px solid #aaaaaa' : isNearBlackAccent ? '1.5px solid #666666' : 'none', borderRadius: '4px', padding: '10px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s', width: '100%', marginBottom: '12px' }}>
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
    </div>
  );
}

// ─── 메인 ─────────────────────────────────────────────────────
export default function Home() {
  const previewRef = useRef(null);
  const previewWrapRef = useRef(null);

  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);
  const [bgColor, setBgColorState] = useState('#ffffff');
  const [badgeTextCustom, setBadgeTextCustomState] = useState('#1a1a1a');
  const [familyIcon, setFamilyIconState] = useState('tojo');
  const [nickname, setNicknameState] = useState('');
  const [twitterId, setTwitterIdState] = useState('');
  const [fubFree, setFubFreeState] = useState(false);
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
    const n = lsGet('rgg_nickname'); if (n) setNicknameState(n);
    const t = lsGet('rgg_twitterId'); if (t) setTwitterIdState(t);
    const f = lsGet('rgg_fubFree'); if (f) setFubFreeState(f === 'true');
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
  const setNickname = (v) => { setNicknameState(v); lsSet('rgg_nickname', v); };
  const setTwitterId = (v) => { setTwitterIdState(v); lsSet('rgg_twitterId', v); };
  const setFubFree = (v) => { setFubFreeState(v); lsSet('rgg_fubFree', String(v)); };
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

  const cardW = IMAGE_SIZE.vertical.width;

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
    const t = setTimeout(update, 100);
    window.addEventListener('resize', update);
    return () => { clearTimeout(t); window.removeEventListener('resize', update); };
  }, [isMobile]);

  async function handleDownloadImage() {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: bgColor || '#ffffff',
        logging: false,
        width: cardW,
        height: previewRef.current.scrollHeight,
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
    setNicknameState('');
    setTwitterIdState('');
    setFubFreeState(false);
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

  const previewData = { nickname, twitterId, fubFree, selections, spoilerValue, spoilerOther, customTitle, customValue, gameStates };

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
      {/* 저장용 원본 — 화면 밖에 숨김 */}
      <div ref={previewRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: `${cardW}px`, pointerEvents: 'none', zIndex: -1 }}>
        <PreviewCard data={previewData} accentColor={accentColor} bgColor={bgColor} badgeTextCustom={badgeTextCustom} familyIcon={familyIcon} />
      </div>
      {/* 미리보기 — zoom 적용 */}
      <div style={{
        zoom: zoom,
        borderRadius: `${8 / zoom}px`,
        border: `${1 / zoom}px solid #333`,
        overflow: 'hidden',
        flexShrink: 0,
        maxWidth: '100%',
        width: `${cardW}px`,
      }}>
        <PreviewCard data={previewData} accentColor={accentColor} bgColor={bgColor} badgeTextCustom={badgeTextCustom} familyIcon={familyIcon} />
      </div>
    </div>
  );

  const formProps = {
    accentColor, setAccentColor,
    bgColor, setBgColor,
    badgeTextCustom, setBadgeTextCustom,
    familyIcon, setFamilyIcon,
    nickname, setNickname, twitterId, setTwitterId,
    fubFree, setFubFree,
    selections, toggleOption, setFieldText,
    customTitle, setCustomTitle, customValue, setCustomValue,
    spoilerValue, setSpoilerValue, spoilerOther, setSpoilerOther,
    gameStates, setGameState,
    handleDownloadImage, handleResetAll,
    isMobile,
  };

  return (
    <>
      <Head>
        <title>용스튜 소개표 생성기</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600&display=swap" />
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