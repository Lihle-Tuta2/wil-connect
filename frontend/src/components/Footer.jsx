import { Link } from "react-router-dom";
import Brand from "./Brand";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <Brand />
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/opportunities">Opportunities</a>
          <Link to="/about">About</Link>
          <a href="/#contact">Contact</a>
        </nav>
        <div className="social-links" aria-label="Social media">
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">ig</a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
        </div>
      </div>
      <p className="footer-bottom">© 2026 WIL Connect. All rights reserved.</p>
    </footer>
  );
}

export default Footer;