import {Link} from "react-router-dom";

import "./Navigation.scss"
import logo from '../images/logo.png'

const Navigation = () => (
  <nav id="Navigation">
    <ul>
      <li>
        <Link to="/">
          <img src={logo} alt=''/>
          Support children
        </Link>
      </li>
      <li>
        <Link to="/explore">Explore</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
    </ul>
  </nav>
)

export default Navigation;
