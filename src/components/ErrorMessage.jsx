/* ErrorMessage.jsx – displays a styled error banner */
const ErrorMessage = ({ message }) => (
  <div className="error-message glass" role="alert">
    <span className="error-icon">⚠️</span>
    <p>{message || 'Something went wrong. Please try again.'}</p>
  </div>
);

export default ErrorMessage;
