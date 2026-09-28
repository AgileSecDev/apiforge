import { Eye, EyeOff } from "lucide-react";

export function FormField({ id, label, icon: Icon, ...inputProps }) {
  return (
    <label className="form-field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <span className="input-frame">
        {Icon && <Icon className="field-icon" size={17} aria-hidden="true" />}
        <input id={id} name={id} {...inputProps} />
      </span>
    </label>
  );
}

export function PasswordField({ id, label, visible, onToggle, ...inputProps }) {
  const VisibilityIcon = visible ? EyeOff : Eye;

  return (
    <label className="form-field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <span className="input-frame">
        <input id={id} name={id} type={visible ? "text" : "password"} {...inputProps} />
        <button
          className="visibility-button"
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
        >
          <VisibilityIcon size={17} />
        </button>
      </span>
    </label>
  );
}

export function FormNotice({ children, tone = "error" }) {
  if (!children) return null;

  return (
    <div className={`form-notice notice-${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}