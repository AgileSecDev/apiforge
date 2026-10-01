import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowUpRight, Braces, Clock3, FolderKanban, LogOut, UserRound } from "lucide-react";
import { clearSession, getSession, updateSessionProfile } from "../../auth/api/authApi.js";
import Brand from "../../../shared/components/Brand.jsx";
import ProfilePanel from "../components/ProfilePanel.jsx";

const workspaceSections = [
  { label: "Collections", icon: FolderKanban },
  { label: "Environments", icon: Braces },
  { label: "History", icon: Clock3 },
];

export default function WorkspacePage() {
  const navigate = useNavigate();
  const session = getSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState(session?.username || "developer");
  const username = session?.username || "developer";

  function handleProfileUpdated(profile) {
    setProfileName(profile.username);
    updateSessionProfile(profile);
  }

  function handleSignOut() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <main className="workspace-shell">
      <aside className="workspace-sidebar">
        <div className="sidebar-brand"><Brand /></div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">{username.slice(0, 1).toUpperCase()}</span>
          <span className="workspace-switcher-copy"><strong>Personal workspace</strong><small>Free workspace</small></span>
          <ArrowUpRight size={15} />
        </div>
        <nav className="workspace-nav" aria-label="Workspace navigation">
          <span className="nav-section-label">WORKSPACE</span>
          <a className="workspace-nav-item nav-item-active" href="#overview" aria-current="page">
            <Activity size={17} /> Overview
          </a>
          <span className="nav-section-label nav-section-spaced">YOUR DATA</span>
          {workspaceSections.map(({ label, icon: Icon }) => (
            <span className="workspace-nav-item nav-item-muted" key={label}>
              <Icon size={17} /> {label}
            </span>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="account-row">
            <button className="profile-trigger" type="button" onClick={() => setIsProfileOpen(true)} aria-label="Open your profile details">
              <span className="account-avatar">{profileName.slice(0, 1).toUpperCase()}</span>
              <span className="account-name">{profileName}<small>View profile</small></span>
              <UserRound className="profile-trigger-icon" size={15} />
            </button>
            <button className="icon-button" type="button" onClick={handleSignOut} aria-label="Sign out" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <section className="workspace-main">
        <header className="workspace-topbar">
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>Overview</strong></div>
          <div className="topbar-state"><span className="live-dot" /> API session active</div>
        </header>
        <div className="workspace-content" id="overview">
          <div className="workspace-page-heading">
            <div>
              <p className="page-eyebrow">PERSONAL WORKSPACE</p>
              <h1>Good to have you, {username}.</h1>
              <p>Your ApiForge account is connected and ready for API work.</p>
            </div>
            <div className="date-stamp">API CLIENT <span>·</span> 01</div>
          </div>

          <section className="workspace-welcome" aria-labelledby="welcome-title">
            <div className="welcome-copy">
              <span className="welcome-icon"><Braces size={20} /></span>
              <p className="page-eyebrow">WORKSPACE STATUS</p>
              <h2 id="welcome-title">Your account is connected.</h2>
              <p>Collections, saved requests, and environments will be organized here as you build them.</p>
              <div className="welcome-session"><span className="live-dot" /> Signed in as <strong>{username}</strong></div>
            </div>
            <div className="welcome-art" aria-hidden="true">
              <div className="art-grid" />
              <div className="art-terminal">
                <div className="terminal-head"><span /><span /><span /><i>request.json</i></div>
                <pre><b>GET</b> <span>https://api.example.com/v1</span>{"\n"}<i>Accept</i>: application/json{"\n"}<i>Authorization</i>: Bearer ••••••••</pre>
                <div className="terminal-result"><span className="live-dot" /> Ready for your next request</div>
              </div>
            </div>
          </section>

          <section className="workspace-lower" aria-label="Workspace overview">
            <div className="lower-heading"><div><h2>Start with a clear workspace</h2><p>Your saved API work will appear in these areas.</p></div></div>
            <div className="workspace-empty-grid">
              {workspaceSections.map(({ label, icon: Icon }) => (
                <article className="empty-area" key={label}>
                  <span className="empty-area-icon"><Icon size={18} /></span>
                  <h3>{label}</h3>
                  <p>No {label.toLowerCase()} yet</p>
                  <span className="empty-area-state">Ready when you are</span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
      {isProfileOpen && (
        <ProfilePanel
          accessToken={session?.access}
          onClose={() => setIsProfileOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </main>
  );
}