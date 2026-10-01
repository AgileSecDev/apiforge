import { useState } from "react";
import { ArrowRight, AtSign } from "lucide-react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { FormField, FormNotice } from "../components/FormField.jsx";
import { requestPasswordReset } from "../api/authApi.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell alternateLabel="Remembered your password?" alternateAction="Sign in" alternateTo="/login">
      <div className="auth-heading">
        <h1>Reset your password</h1>
        <p>Enter your account email and we’ll send a secure reset link.</p>
      </div>
      <FormNotice>{error}</FormNotice>
      {sent ? (
        <FormNotice tone="success">If an account matches that email, a reset link has been sent. Check your inbox.</FormNotice>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField id="email" label="Email address" icon={AtSign} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
          <button className="primary-button" type="submit" disabled={isSubmitting}><span>{isSubmitting ? "Sending link..." : "Send reset link"}</span>{!isSubmitting && <ArrowRight size={17} />}</button>
        </form>
      )}
      <p className="form-footnote"><Link className="forgot-password-link" to="/login">Back to sign in</Link></p>
    </AuthShell>
  );
}