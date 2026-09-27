import logo from "../assets/logo.png";

function LogoMark({ className = "", alt = "WIL Connect" }) {
  return <img className={`logo-mark ${className}`.trim()} src={logo} alt={alt} />;
}

export default LogoMark;