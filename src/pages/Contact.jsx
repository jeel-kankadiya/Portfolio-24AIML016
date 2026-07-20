import { useState } from 'react';
import './Contact.css';

const INITIAL = { name: '', email: '', message: '' };
const MAX_CHARS = 300;

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
        <div className="contact-success glass">
          <div className="success-icon">✅</div>
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
