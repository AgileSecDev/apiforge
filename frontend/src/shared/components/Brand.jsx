import { Boxes } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({ compact = false }) {
  return (
    <Link className={`brand${compact ? " brand-compact" : ""}`} to="/login" aria-label="ApiForge home">
      <span className="brand-mark" aria-hidden="true">
        <Boxes size={19} strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="brand-name">
          Api<span>Forge</span>
        </span>
      )}
    </Link>
  );
}