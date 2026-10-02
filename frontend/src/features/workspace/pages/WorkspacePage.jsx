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
const emptyRow = () => ({ enabled: true, key: "", value: "", description: "" });
const rowsFromValue = (value) => Array.isArray(value)
  ? [...value.map((row) => ({ ...emptyRow(), ...row })), emptyRow()]
  : [...Object.entries(value || {}).map(([key, item]) => ({ ...emptyRow(), key, value: String(item) })), emptyRow()];
const valueFromRows = (rows) => Object.fromEntries(rows.filter((row) => row.enabled && row.key.trim()).map((row) => [row.key.trim(), row.value]));

function KeyValueEditor({ title, rows, onChange }) {
  function updateRow(index, field, value) {
    onChange(rows.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: value } : row));
  }
  return <div className="kv-editor"><div className="kv-title">{title}</div><div className="kv-header"><span /><span>Key</span><span>Value</span><span>Description</span></div>{rows.map((row, index) => <div className="kv-row" key={index}><input aria-label="Enable row" type="checkbox" checked={row.enabled} onChange={(event) => updateRow(index, "enabled", event.target.checked)} /><input aria-label={`${title} key ${index + 1}`} placeholder="Key" value={row.key} onChange={(event) => updateRow(index, "key", event.target.value)} /><input aria-label={`${title} value ${index + 1}`} placeholder="Value" value={row.value} onChange={(event) => updateRow(index, "value", event.target.value)} /><input aria-label={`${title} description ${index + 1}`} placeholder="Description" value={row.description} onChange={(event) => updateRow(index, "description", event.target.value)} /></div>)}</div>;
}

function CollectionsPage({ accessToken }) {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [description, setDescription] = useState("");
  const [queryRows, setQueryRows] = useState([emptyRow()]);
  const [headerRows, setHeaderRows] = useState([emptyRow()]);
  const [formRows, setFormRows] = useState([emptyRow()]);
  const [body, setBody] = useState("");
  const [binaryFile, setBinaryFile] = useState(null);
  const [bodyMode, setBodyMode] = useState("none");
  const [rawLanguage, setRawLanguage] = useState("json");
  const [authType, setAuthType] = useState("none");
  const [authConfig, setAuthConfig] = useState({ token: "", username: "", password: "", key: "", value: "", add_to: "header" });
  const [scripts, setScripts] = useState({ pre_request: "", tests: "" });
  const [scriptKind, setScriptKind] = useState("pre_request");
  const [settings, setSettings] = useState({ follow_redirects: true, timeout: 30 });
  const [activeTab, setActiveTab] = useState("Params");
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
      const queryParams = valueFromRows(queryRows);
      const headers = valueFromRows(headerRows);
      const requestUrl = new URL(url.trim());
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value) !== "") requestUrl.searchParams.set(key, String(value));
      });
      if (authType === "bearer" && authConfig.token) headers.Authorization = `Bearer ${authConfig.token}`;
      if (authType === "basic" && authConfig.username) headers.Authorization = `Basic ${btoa(`${authConfig.username}:${authConfig.password || ""}`)}`;
      if (authType === "api_key" && authConfig.key) {
        if (authConfig.add_to === "query") requestUrl.searchParams.set(authConfig.key, authConfig.value || "");
        else headers[authConfig.key] = authConfig.value || "";
      }
      let requestBody;
      if (!["GET", "HEAD"].includes(method) && bodyMode === "binary" && binaryFile) requestBody = binaryFile;
      if (!["GET", "HEAD"].includes(method) && (bodyMode === "form-data" || bodyMode === "x-www-form-urlencoded")) {
        if (bodyMode === "form-data" || bodyMode === "x-www-form-urlencoded") {
          if (bodyMode === "form-data") {
            requestBody = new FormData();
            formRows.filter((row) => row.enabled && row.key.trim()).forEach((row) => requestBody.append(row.key.trim(), row.value));
          } else {
            requestBody = new URLSearchParams(valueFromRows(formRows));
            headers["Content-Type"] = "application/x-www-form-urlencoded";
          }
        } else {
          requestBody = body;
          const contentTypes = { json: "application/json", javascript: "application/javascript", text: "text/plain", html: "text/html", xml: "application/xml" };
          headers["Content-Type"] ||= contentTypes[rawLanguage];
        }
      }
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), Math.max(1, Number(settings.timeout) || 30) * 1000);
      let result;
      try {
        result = await fetch(requestUrl, { method, headers, body: requestBody, signal: controller.signal, redirect: settings.follow_redirects ? "follow" : "manual" });
      } finally {
        window.clearTimeout(timeoutId);
      }
      const contentType = result.headers.get("content-type") || "";
      const responseBody = contentType.includes("json") ? await result.json() : await result.text();
      setResponse({
        ok: result.ok,
        status: result.status,
        statusText: result.statusText,
        duration: Math.round(performance.now() - startedAt),
        body: responseBody,
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
        description,
        query_params: queryRows.filter((row) => row.enabled && row.key.trim()),
        headers: headerRows.filter((row) => row.enabled && row.key.trim()),
        body: bodyMode === "form-data" || bodyMode === "x-www-form-urlencoded" ? JSON.stringify(formRows) : body,
        body_mode: bodyMode,
        raw_language: rawLanguage,
        auth_type: authType,
        auth_config: authConfig,
        scripts,
        settings,
      });
      setCollections(await fetchCollections(accessToken));
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
          <div className="request-editor-tabs" role="tablist" aria-label="Request options">{["Docs", "Params", "Authorization", "Headers", "Body", "Scripts", "Settings"].map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? "request-tab active" : "request-tab"} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
          <div className="request-tab-panel">
            {activeTab === "Docs" && <label className="editor-field">Request documentation<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what this request does" /></label>}
            {activeTab === "Params" && <KeyValueEditor title="Query Params" rows={queryRows} onChange={setQueryRows} />}
            {activeTab === "Authorization" && <div className="auth-editor"><label className="editor-field">Auth Type<select value={authType} onChange={(event) => setAuthType(event.target.value)}><option value="none">No Auth</option><option value="bearer">Bearer Token</option><option value="basic">Basic Auth</option><option value="api_key">API Key</option></select></label>{authType === "bearer" && <label className="editor-field">Token<input type="password" value={authConfig.token} onChange={(event) => setAuthConfig({ ...authConfig, token: event.target.value })} /></label>}{authType === "basic" && <div className="editor-grid"><label className="editor-field">Username<input value={authConfig.username} onChange={(event) => setAuthConfig({ ...authConfig, username: event.target.value })} /></label><label className="editor-field">Password<input type="password" value={authConfig.password} onChange={(event) => setAuthConfig({ ...authConfig, password: event.target.value })} /></label></div>}{authType === "api_key" && <div className="editor-grid"><label className="editor-field">Key<input value={authConfig.key} onChange={(event) => setAuthConfig({ ...authConfig, key: event.target.value })} /></label><label className="editor-field">Value<input type="password" value={authConfig.value} onChange={(event) => setAuthConfig({ ...authConfig, value: event.target.value })} /></label><label className="editor-field">Add to<select value={authConfig.add_to} onChange={(event) => setAuthConfig({ ...authConfig, add_to: event.target.value })}><option value="header">Header</option><option value="query">Query Params</option></select></label></div>}</div>}
            {activeTab === "Headers" && <KeyValueEditor title="Headers" rows={headerRows} onChange={setHeaderRows} />}
            {activeTab === "Body" && <><div className="body-mode-tabs" role="radiogroup" aria-label="Body type">{[["none", "none"], ["form-data", "form-data"], ["x-www-form-urlencoded", "x-www-form-urlencoded"], ["raw", "raw"], ["binary", "binary"]].map(([value, label]) => <label key={value}><input type="radio" name="body-mode" value={value} checked={bodyMode === value} onChange={() => setBodyMode(value)} />{label}</label>)}</div>{bodyMode === "raw" && <label className="editor-field raw-format">Format<select value={rawLanguage} onChange={(event) => setRawLanguage(event.target.value)}>{["json", "javascript", "text", "html", "xml"].map((format) => <option key={format}>{format}</option>)}</select></label>}{bodyMode === "binary" ? <label className="editor-field">Choose file<input type="file" onChange={(event) => setBinaryFile(event.target.files?.[0] || null)} /></label> : bodyMode === "raw" ? <label className="editor-field"><textarea className="raw-body-input" value={body} onChange={(event) => setBody(event.target.value)} placeholder={rawLanguage === "json" ? '{\n  "name": "Ada"\n}' : "Enter request body"} /></label> : bodyMode === "form-data" || bodyMode === "x-www-form-urlencoded" ? <KeyValueEditor title="Body fields" rows={formRows} onChange={setFormRows} /> : <p className="muted-editor-note">This request does not have a body.</p>}</>}
            {activeTab === "Scripts" && <div className="scripts-editor"><div className="script-switch"><button type="button" className={scriptKind === "pre_request" ? "selected" : ""} onClick={() => setScriptKind("pre_request")}>Pre-request</button><button type="button" className={scriptKind === "tests" ? "selected" : ""} onClick={() => setScriptKind("tests")}>Post-response</button></div><textarea value={scripts[scriptKind]} onChange={(event) => setScripts({ ...scripts, [scriptKind]: event.target.value })} placeholder="Write JavaScript for this script stage" /><small>Scripts are saved with this request.</small></div>}
            {activeTab === "Settings" && <div className="settings-editor"><label><input type="checkbox" checked={settings.follow_redirects} onChange={(event) => setSettings({ ...settings, follow_redirects: event.target.checked })} /> Follow redirects</label><label>Request timeout (seconds)<input type="number" min="1" max="300" value={settings.timeout} onChange={(event) => setSettings({ ...settings, timeout: Number(event.target.value) })} /></label></div>}
          </div>
          <div className="request-options">
            <div className="collection-picker"><label htmlFor="request-collection">Collection</label><select id="request-collection" value={selectedCollectionId} onChange={(event) => setSelectedCollectionId(event.target.value)} disabled={isLoadingCollections}><option value="">Create new collection on save</option>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select></div>
            <button className="save-request-button" type="button" onClick={handleSaveRequest} disabled={isSaving || !url.trim()}><Save size={14} /> {isSaving ? "Saving..." : "Save request"}</button>
            {saveMessage && <span className="save-message">{saveMessage}</span>}
          </div>
          <p className="request-helper">Scripts and settings are saved with the request. Body fields use JSON objects for form-data and URL encoded modes.</p>
        </form>
      </section>

      {collections.length > 0 && <section className="saved-collections" aria-label="Saved collections"><div className="saved-collections-heading"><p className="page-eyebrow">COLLECTIONS</p><span>{collections.length} collection{collections.length === 1 ? "" : "s"}</span></div>{collections.map((collection) => <div className="saved-collection-group" key={collection.id}><div className="saved-collection-row"><strong>{collection.name}</strong><span>{collection.requests?.length || 0} requests</span></div>{collection.requests?.map((saved) => <button type="button" className="saved-request-button" key={saved.id} onClick={() => { setSelectedCollectionId(String(collection.id)); setMethod(saved.method); setUrl(saved.url); setDescription(saved.description || ""); setQueryRows(rowsFromValue(saved.query_params)); setHeaderRows(rowsFromValue(saved.headers)); setBodyMode(saved.body_mode || "none"); setRawLanguage(saved.raw_language || "json"); setAuthType(saved.auth_type || "none"); setAuthConfig({ token: "", username: "", password: "", key: "", value: "", add_to: "header", ...(saved.auth_config || {}) }); setScripts({ pre_request: "", tests: "", ...(saved.scripts || {}) }); setSettings({ follow_redirects: true, timeout: 30, ...(saved.settings || {}) }); if (["form-data", "x-www-form-urlencoded"].includes(saved.body_mode)) { try { setFormRows(rowsFromValue(JSON.parse(saved.body || "[]"))); } catch { setFormRows([emptyRow()]); } setBody(""); } else { setBody(saved.body || ""); } setActiveTab("Params"); }}> <span className={`saved-method method-${saved.method.toLowerCase()}`}>{saved.method}</span><span>{saved.name}</span></button>)}</div>)}</section>}

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
