import React from 'react';

export default function PlatformLogo({platform}) {
  return <span className={'platform-logo platform-logo--'+platform.toLowerCase()} aria-hidden="true">
    {platform === 'YouTube' ? <svg viewBox="0 0 32 32" fill="none"><rect x="2" y="6" width="28" height="20" rx="6" fill="#ff0033"/><path d="m13 11 9 5-9 5z" fill="white"/></svg>
    : platform === 'Instagram' ? <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.4"><rect x="5" y="5" width="22" height="22" rx="6"/><circle cx="16" cy="16" r="5.2"/><circle cx="23" cy="9.5" r="1.4" fill="currentColor" stroke="none"/></svg>
    : <svg viewBox="0 0 32 32" fill="none"><path d="M19 4v16a6 6 0 1 1-5-5.9M19 4c0 5 3 8 8 8" stroke="#25f4ee" strokeWidth="4.3" transform="translate(-1 1)"/><path d="M19 4v16a6 6 0 1 1-5-5.9M19 4c0 5 3 8 8 8" stroke="#fe2c55" strokeWidth="4.3" transform="translate(1 -0.5)"/><path d="M19 4v16a6 6 0 1 1-5-5.9M19 4c0 5 3 8 8 8" stroke="white" strokeWidth="3.3"/></svg>}
  </span>;
}
