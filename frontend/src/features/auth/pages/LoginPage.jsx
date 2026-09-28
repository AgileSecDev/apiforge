import { useState } from "react";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { FormField, FormNotice, PasswordField } from "../components/FormField.jsx";
import { login, saveSession } from "../api/authApi.js";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const tokens = await login({ username: username.trim(), password });
      saveSession(tokens, username.trim());
      navigate(location.state?.from?.pathname || "/app", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      alternateLabel="New to ApiForge?"
      alternateAction="Create account"
      alternateTo="/register"
    >
      <div className="auth-heading">
        <h1>Welcome back</h1>
        <p>Sign in to pick up where your API work left off.</p>
      </div>

      <FormNotice tone="success">{location.state?.notice}</FormNotice>
      <FormNotice>{error}</FormNotice>

      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField
          id="username"
          label="Username"
          icon={UserRound}
          type="text"
          autoComplete="username"
          placeholder="Your username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoFocus
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          required
        />
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>

      <p className="form-footnote"><LockKeyhole size={14} /> Your connection is protected with JWT authentication.</p>
    </AuthShell>
  );
}