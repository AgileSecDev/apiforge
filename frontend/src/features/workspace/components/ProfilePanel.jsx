import { useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, CircleUserRound, Mail, Pencil, Save, X } from "lucide-react";
import { fetchProfile, updateProfile } from "../../auth/api/authApi.js";

function joinedDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(date);
}

export default function ProfilePanel({ accessToken, onClose, onProfileUpdated }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ username: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetchProfile(accessToken)
      .then((result) => {
        if (!active) return;
        setProfile(result);
        setForm({ username: result.username || "", email: result.email || "" });
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [accessToken]);

  function cancelEditing() {
    setForm({ username: profile?.username || "", email: profile?.email || "" });
    setError("");
    setIsEditing(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const updated = await updateProfile(accessToken, {
        username: form.username.trim(),
        email: form.email.trim(),
      });
      setProfile(updated);
      setForm({ username: updated.username, email: updated.email });
      setIsEditing(false);
      onProfileUpdated(updated);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="profile-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="profile-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <header className="profile-dialog-header">
          <div>
            <p className="page-eyebrow">ACCOUNT SETTINGS</p>
            <h2 id="profile-title">Your profile</h2>
          </div>
          <button className="profile-close icon-button" type="button" onClick={onClose} aria-label="Close profile">
            <X size={18} />
          </button>
        </header>

        {isLoading ? (
          <div className="profile-loading" role="status">Loading your account details...</div>
        ) : error && !profile ? (
          <div className="profile-error" role="alert">{error}</div>
        ) : (
          <>
            <div className="profile-identity">
              <span className="profile-avatar">{(profile?.username || "?").slice(0, 1).toUpperCase()}</span>
              <div><strong>{profile?.username}</strong><span><BadgeCheck size={14} /> ApiForge account</span></div>
            </div>

            {error && <div className="profile-error" role="alert">{error}</div>}

            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <label className="profile-field" htmlFor="profile-username">
                  <span>Username</span>
                  <span className="profile-input-wrap"><CircleUserRound size={16} /><input id="profile-username" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} required maxLength={150} /></span>
                </label>
                <label className="profile-field" htmlFor="profile-email">
                  <span>Email address</span>
                  <span className="profile-input-wrap"><Mail size={16} /><input id="profile-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required /></span>
                </label>
                <div className="profile-actions">
                  <button className="profile-secondary" type="button" onClick={cancelEditing} disabled={isSaving}>Cancel</button>
                  <button className="profile-save" type="submit" disabled={isSaving}><Save size={15} /> {isSaving ? "Saving..." : "Save changes"}</button>
                </div>
              </form>
            ) : (
              <>
                <div className="profile-details">
                  <div className="profile-detail-row"><span className="detail-icon"><CircleUserRound size={16} /></span><span><small>Username</small><strong>{profile?.username}</strong></span></div>
                  <div className="profile-detail-row"><span className="detail-icon"><Mail size={16} /></span><span><small>Email address</small><strong>{profile?.email || "No email added"}</strong></span></div>
                  <div className="profile-detail-row"><span className="detail-icon"><CalendarDays size={16} /></span><span><small>Member since</small><strong>{joinedDate(profile?.date_joined)}</strong></span></div>
                </div>
                <button className="profile-edit" type="button" onClick={() => setIsEditing(true)}><Pencil size={15} /> Edit profile</button>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}