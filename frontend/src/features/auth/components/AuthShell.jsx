import { ArrowUpRight, Check, Code2, CornerDownRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../../../shared/components/Brand.jsx";

function ProductPreview() {
  return (
    <aside className="auth-preview" aria-label="ApiForge request workspace preview">
      <div className="preview-topline">
        <Brand compact />
        <span className="preview-label"><span className="live-dot" /> REQUEST WORKSPACE</span>
      </div>

      <div className="preview-copy">
        <p className="preview-kicker">BUILT FOR THE WAY YOU WORK</p>
        <h2>Make every request<br />count.</h2>
        <p>Keep your API work organized, readable, and close at hand.</p>
      </div>

      <div className="preview-window">
        <div className="window-toolbar">
          <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
          <span>My workspace</span>
          <button type="button" className="window-add" aria-label="New request preview" title="New request">
            <Plus size={15} />
          </button>
        </div>
        <div className="request-preview-heading">
          <div>
            <span className="request-caption">COLLECTION</span>
            <strong>Users API</strong>
          </div>
          <span className="collection-count">3 requests</span>
        </div>
        <div className="request-preview-row request-preview-selected">
          <span className="method-pill method-get">GET</span>
          <span className="request-path">/users</span>
          <Check size={15} className="request-check" />
        </div>
        <div className="request-preview-row">
          <span className="method-pill method-post">POST</span>
          <span className="request-path">/users</span>
          <ArrowUpRight size={14} className="row-arrow" />
        </div>
        <div className="request-preview-row">
          <span className="method-pill method-get">GET</span>
          <span className="request-path">/users/{"{id}"}</span>
          <ArrowUpRight size={14} className="row-arrow" />
        </div>
        <div className="preview-request-bar">
          <span className="method-get-text">GET</span>
          <span>api.example.com/users</span>
          <span className="preview-send"><CornerDownRight size={14} /> Send</span>
        </div>
        <div className="preview-response">
          <div className="response-status"><span className="live-dot" /> 200 OK <span>·</span> 184 ms</div>
          <pre>{'{\n  "data": [\n    { "id": 1, "name": "Avery" }\n  ]\n}'}</pre>
        </div>
      </div>

      <div className="preview-footer">
        <span><Code2 size={15} /> API work, in one place</span>
      </div>
    </aside>
  );
}

export default function AuthShell({ children, alternateLabel, alternateAction, alternateTo }) {
  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <header className="auth-header">
          <Brand />
          <p className="auth-alternate">
            {alternateLabel} <Link to={alternateTo}>{alternateAction}</Link>
          </p>
        </header>

        <div className="auth-content">
          <div className="auth-overline"><span /> API WORKSPACE ACCESS</div>
          {children}
        </div>

        <footer className="auth-footer">
          <span>© 2026 ApiForge</span>
          <span className="footer-separator" />
          <span>Made for better API work</span>
        </footer>
      </section>

      <ProductPreview />
    </main>
  );
}