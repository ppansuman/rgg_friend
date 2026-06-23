export const cardStyle = {
  backgroundColor: '#2a2a2a',
  border: '1px solid #404040',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};

export const labelStyle = {
  color: '#e0e0e0',
  fontSize: '14px',
};

export const inputStyle = {
  backgroundColor: '#1a1a1a',
  color: '#e0e0e0',
  border: '1px solid #404040',
  borderRadius: '4px',
  padding: '8px 12px',
  fontSize: '14px',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
};

export const h2Style = {
  margin: '0 0 16px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#ffffff'
};

export const h3Style = {
  margin: '0 0 12px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#ffffff'
};

export const guideStyle = {
  margin: '0',
  fontSize: '13px',
  color: 'rgb(164, 164, 164)',
  lineHeight: '1.6',
  textAlign: 'left'
};

export const linkStyle = {
  color: '#a0a0a0',
  textDecoration: 'none'
};

export const footerTextStyle = {
  fontSize: '11px',
  color: '#606060',
  lineHeight: '1.0'
};

/* ─── 뱃지 버튼 ─── */
export const getBadgeStyle = (selected, accentColor) => {
  const r = parseInt((accentColor || '#888888').slice(1, 3), 16) || 0;
  const g = parseInt((accentColor || '#888888').slice(3, 5), 16) || 0;
  const b = parseInt((accentColor || '#888888').slice(5, 7), 16) || 0;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const isNearWhite = lum > 230;
  const isNearBlack = lum < 25;

  const toLinear = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  const L = 0.2126*toLinear(r) + 0.7152*toLinear(g) + 0.0722*toLinear(b);
  const textOnAccent = (1.05/(L+0.05)) > ((L+0.05)/0.05) ? '#ffffff' : '#222222';

  const borderColor = selected
    ? isNearWhite ? '#aaaaaa' : isNearBlack ? '#666666' : accentColor
    : '#505050';
  const bgColor = selected
    ? isNearWhite ? '#e0e0e0' : isNearBlack ? '#444444' : accentColor
    : 'transparent';
  const textColor = selected
    ? isNearWhite ? '#555555' : isNearBlack ? '#cccccc' : textOnAccent
    : '#b0b0b0';

  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '5px 14px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: selected ? '600' : '400',
    cursor: 'pointer',
    border: `1.5px solid ${borderColor}`,
    backgroundColor: bgColor,
    color: textColor,
    transition: 'all 0.15s',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  };
};
/* ─── 색상 유틸 ─── */
export function getLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function getTextOnAccent(hex) {
  return getLuminance(hex) > 160 ? '#333333' : '#ffffff';
}

export function darkenHex(hex, amount = 40) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}