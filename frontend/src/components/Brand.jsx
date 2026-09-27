import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Brand({ className = "" }) {
  return (
    <Link className={`brand ${className}`.trim()} to="/" aria-label="WIL Connect home">
      <img src={logo} alt="" />
    </Link>
  );
}

export default Brand;