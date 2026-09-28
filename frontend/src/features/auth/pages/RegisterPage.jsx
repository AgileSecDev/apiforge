import { useState } from "react";
import { ArrowRight, AtSign, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { FormField, FormNotice, PasswordField } from "../components/FormField.jsx";
import { register } from "../api/authApi.js";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "", passwordConfirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        password_confirm: form.passwordConfirm,
      });
      navigate("/login", {
        replace: true,
        state: { notice: "Account created. Sign in to open your workspace." },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      alternateLabel="Already have an account?"
      alternateAction="Sign in"
      alternateTo="/login"
    >
      <div className="auth-heading">
        <h1>Create your account</h1>
        <p>A clear workspace for everything you build with APIs.</p>
      </div>

      <FormNotice>{error}</FormNotice>

      <form className="auth-form register-form" onSubmit={handleSubmit}>
        <FormField
          id="username"
          label="Username"
          icon={UserRound}
          type="text"
          autoComplete="username"
          placeholder="Choose a username"
          value={form.username}
          onChange={updateField}
          required
          maxLength={150}
          autoFocus
        />
        <FormField
          id="email"
          label="Email address"
          icon={AtSign}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={updateField}
          required
        />
        <PasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={updateField}
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          required
          minLength={8}
        />
        <PasswordField
          id="passwordConfirm"
          name="passwordConfirm"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Enter your password again"
          value={form.passwordConfirm}
          onChange={updateField}
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          required
          minLength={8}
        />
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
          {!isSubmitting && <ArrowRight size={17} />}
        </button>
      </form>

      <p className="form-footnote">By creating an account, you agree to use ApiForge responsibly.</p>
    </AuthShell>
  );
}