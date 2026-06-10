import { s } from '../styles/authStyles';

export default function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label htmlFor={htmlFor} style={s.label}>{label}</label>
        {hint && !error && <span style={s.hint}>{hint}</span>}
      </div>
      {children}
      {error && <span style={s.fieldError}>{error}</span>}
    </div>
  );
}