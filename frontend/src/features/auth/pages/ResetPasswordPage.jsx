import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { FormNotice, PasswordField } from "../components/FormField.jsx";
import { confirmPasswordReset } from "../api/authApi.js";

export default function ResetPasswordPage() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    if (password !== passwordConfirm) {
      setError("The passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmPasswordReset({ uid, token, password, password_confirm: passwordConfirm });
      navigate("/login", { replace: true, state: { notice: "Your password has been reset. Sign in with your new password." } });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell alternateLabel="Remembered your password?" alternateAction="Sign in" alternateTo="/login">
      <div className="auth-heading"><h1>Choose a new password</h1><p>Make it unique and at least 8 characters long.</p></div>
      <FormNotice>{error}</FormNotice>
      <form className="auth-form register-form" onSubmit={handleSubmit}>
        <PasswordField id="password" label="New password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} visible={showPassword} onToggle={() => setShowPassword((current) => !current)} required minLength={8} autoFocus />
        <PasswordField id="passwordConfirm" name="passwordConfirm" label="Confirm password" autoComplete="new-password" placeholder="Enter your password again" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} visible={showPassword} onToggle={() => setShowPassword((current) => !current)} required minLength={8} />
        <button className="primary-button" type="submit" disabled={isSubmitting}><span>{isSubmitting ? "Updating password..." : "Update password"}</span>{!isSubmitting && <ArrowRight size={17} />}</button>
      </form>
      <p className="form-footnote"><Link className="forgot-password-link" to="/login">Back to sign in</Link></p>
    </AuthShell>
  );
}