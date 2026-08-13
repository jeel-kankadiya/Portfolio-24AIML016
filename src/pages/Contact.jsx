import { useState } from 'react';
import './Contact.css';

const INITIAL = { name: '', email: '', message: '' };
const MAX_CHARS = 300;

const CONTACT_INFO = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
    label: 'Email',
    value: 'jeelkankadiya567@gmail.com',
    href: 'mailto:jeelkankadiya567@gmail.com',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    label: 'GitHub',
    value: 'jeel-kankadiya',
    href: 'https://github.com/jeel-kankadiya',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: 'LinkedIn',
    value: 'Connect',
    href: 'https://linkedin.com/',
  },
];

const Contact = () => {
  const [form, setForm]       = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())               e.name    = 'Name is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email  = 'Enter a valid email.';
    if (form.message.trim().length < 10)  e.message = 'Message must be at least 10 characters.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_CHARS) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitted(true);
  };

  const handleReset = () => { setForm(INITIAL); setSubmitted(false); setErrors({}); };

  if (submitted) {
    return (
      <main className="page fade-in">
        <div className="contact-success glass scale-in">
          <div className="success-checkmark">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="30" stroke="var(--accent)" strokeWidth="3" className="check-circle" />
              <path d="M20 33l8 8 16-16" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="check-path" />
            </svg>
          </div>
          <h2>Message Sent!</h2>
          <p>Thanks <strong>{form.name}</strong>, I'll get back to you at <em>{form.email}</em>.</p>
          <button className="btn" onClick={handleReset}>Send Another</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page fade-in">
      <h1 className="section-title">Contact Me</h1>

      {/* Contact info cards */}
      <div className="contact-info-row">
        {CONTACT_INFO.map(({ icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="contact-info-card glass"
          >
            <div className="contact-info-icon">{icon}</div>
            <span className="contact-info-label">{label}</span>
            <span className="contact-info-value">{value}</span>
          </a>
        ))}
      </div>

      <div className="contact-layout">
        {/* Form */}
        <form className="contact-form glass" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="message">
              Message
              <span className="char-count">{form.message.length} / {MAX_CHARS}</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Write your message…"
              value={form.message}
              onChange={handleChange}
              className={errors.message ? 'input-error' : ''}
            />
            {errors.message && <span className="error-msg">{errors.message}</span>}
          </div>

          <button type="submit" className="btn submit-btn">Send Message</button>
        </form>

        {/* Live Preview */}
        <div className="contact-preview glass">
          <h3>Live Preview</h3>
          <p><span className="preview-label">Name:</span> {form.name || <em>—</em>}</p>
          <p><span className="preview-label">Email:</span> {form.email || <em>—</em>}</p>
          <div className="preview-message">
            <span className="preview-label">Message:</span>
            <p>{form.message || <em>Start typing…</em>}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
