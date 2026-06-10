import { s } from '../styles/authStyles';

export default function Brand() {
  return (
    <div style={s.brand}>
      <div style={s.logoIcon}>
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <path d="M14 3L3 9v10l11 6 11-6V9L14 3z" fill="#1A6B3C"/>
          <path d="M14 3L3 9l11 6 11-6L14 3z" fill="#2E8B57" opacity="0.5"/>
          <path d="M9 13l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span style={s.brandName}>EduAlerta</span>
    </div>
  );
}