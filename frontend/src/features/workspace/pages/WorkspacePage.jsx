import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, ArrowUpRight, Braces, Check, Clock3, FolderKanban, LogOut, Play, Save, UserRound } from "lucide-react";
import { clearSession, getSession, updateSessionProfile } from "../../auth/api/authApi.js";
import Brand from "../../../shared/components/Brand.jsx";
import ProfilePanel from "../components/ProfilePanel.jsx";
import { createCollection, fetchCollections, saveRequest } from "../api/collectionsApi.js";

const workspaceSections = [
  { label: "Collections", icon: FolderKanban },
  { label: "Environments", icon: Braces },
  { label: "History", icon: Clock3 },
];

const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

function CollectionsPage({ accessToken }) {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [response, setResponse] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchCollections(accessToken)
      .then((result) => {
        setCollections(result);
        if (result[0]) setSelectedCollectionId(String(result[0].id));
      })
      .catch(() => setCollections([]))
      .finally(() => setIsLoadingCollections(false));
  }, [accessToken]);

  async function sendRequest(event) {
    event.preventDefault();
    setIsSending(true);
    setResponse(null);
    const startedAt = performance.now();

    try {
      const result = await fetch(url.trim(), { method });
      const contentType = result.headers.get("content-type") || "";
      const body = contentType.includes("json") ? await result.json() : await result.text();
      setResponse({
        ok: result.ok,
        status: result.status,
        statusText: result.statusText,
        duration: Math.round(performance.now() - startedAt),
        body,
        contentType: contentType || "Not provided",
      });
    } catch (requestError) {
      setResponse({ error: requestError.message, duration: Math.round(performance.now() - startedAt) });
    } finally {
      setIsSending(false);
    }
  }

  async function handleSaveRequest() {
    setIsSaving(true);
    setSaveMessage("");
    try {
      let collectionId = selectedCollectionId;
      let nextCollections = collections;
      if (!collectionId) {
        const collection = await createCollection(accessToken, { name: "My requests" });
        nextCollections = [collection, ...collections];
        setCollections(nextCollections);
        collectionId = String(collection.id);
        setSelectedCollectionId(collectionId);
      }
      await saveRequest(accessToken, {
        collection: Number(collectionId),
        name: `${method} ${new URL(url).pathname || "/"}`,
        method,
        url: url.trim(),
      });
      setSaveMessage("Request saved");
    } catch (requestError) {
      setSaveMessage(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="collections-page">
      <div className="collections-heading">
        <div>
          <p className="page-eyebrow">API COLLECTIONS</p>
          <h1>Send a request</h1>
          <p>Enter an endpoint, choose a method, and inspect the response below.</p>
        </div>
        <span className="collection-status"><Check size={14} /> Ready</span>
      </div>

      <section className="request-composer" aria-label="API request composer">
        <form onSubmit={sendRequest}>
          <div className="request-controls">
            <label className="method-select">
              <span className="sr-only">HTTP method</span>
              <select value={method} onChange={(event) => setMethod(event.target.value)}>
                {methods.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="url-input">
              <span className="sr-only">Request URL</span>
              <input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://api.example.com/users" required aria-label="Request URL" />
            </label>
            <button className="send-request-button" type="submit" disabled={isSending}>
              <Play size={15} fill="currentColor" /> {isSending ? "Sending..." : "Send"}
            </button>
          </div>
          <div className="request-options">
            <div className="collection-picker"><label htmlFor="request-collection">Collection</label><select id="request-collection" value={selectedCollectionId} onChange={(event) => setSelectedCollectionId(event.target.value)} disabled={isLoadingCollections}><option value="">Create new collection on save</option>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select></div>
            <button className="save-request-button" type="button" onClick={handleSaveRequest} disabled={isSaving || !url.trim()}><Save size={14} /> {isSaving ? "Saving..." : "Save request"}</button>
            {saveMessage && <span className="save-message">{saveMessage}</span>}
          </div>
          <p className="request-helper">Public endpoints can be tested directly from the browser. Authentication and headers can be added next.</p>
        </form>
      </section>

      {collections.length > 0 && <section className="saved-collections" aria-label="Saved collections"><div className="saved-collections-heading"><p className="page-eyebrow">SAVED REQUESTS</p><span>{collections.length} collection{collections.length === 1 ? "" : "s"}</span></div>{collections.map((collection) => <div className="saved-collection-row" key={collection.id}><strong>{collection.name}</strong><span>{collection.requests?.length || 0} request{collection.requests?.length === 1 ? "" : "s"}</span></div>)}</section>}

      <section className="response-panel" aria-live="polite" aria-label="API response">
        <header className="response-panel-header">
          <div><p className="page-eyebrow">RESPONSE</p><h2>{response ? "Latest response" : "Response output"}</h2></div>
          {response && !response.error && <div className={response.ok ? "response-meta response-success" : "response-meta response-failure"}><span>{response.status} {response.statusText}</span><span>{response.duration} ms</span></div>}
        </header>
        {!response ? (
          <div className="response-empty"><span className="response-empty-icon"><Play size={16} /></span><p>Your response will appear here</p><span>Send a request to see the status and returned data.</span></div>
        ) : response.error ? (
          <div className="response-error"><strong>Request failed</strong><span>{response.error}</span></div>
        ) : (
          <>
            <div className="response-details"><span>Content-Type <strong>{response.contentType}</strong></span><span>Request time <strong>{response.duration} ms</strong></span></div>
            <pre className="response-body">{typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2)}</pre>
          </>
        )}
      </section>
    </div>
  );
}

export default function WorkspacePage() {
  const navigate = useNavigate();
  const session = getSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
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
          <button className={`workspace-nav-item ${activeSection === "Overview" ? "nav-item-active" : "nav-item-muted"}`} type="button" onClick={() => setActiveSection("Overview")}>
            <Activity size={17} /> Overview
          </button>
          <span className="nav-section-label nav-section-spaced">YOUR DATA</span>
          {workspaceSections.map(({ label, icon: Icon }) => (
            <button className={`workspace-nav-item ${activeSection === label ? "nav-item-active" : "nav-item-muted"}`} type="button" key={label} onClick={() => setActiveSection(label)}>
              <Icon size={17} /> {label}
            </button>
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
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activeSection}</strong></div>
          <div className="topbar-state"><span className="live-dot" /> API session active</div>
        </header>
        <div className="workspace-content" id="overview">
          {activeSection === "Collections" ? <CollectionsPage accessToken={session?.access} /> : (
          <>
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
          </>
          )}
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