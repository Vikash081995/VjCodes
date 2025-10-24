import { Link } from "react-router";
import { NavbarConst } from "../constants/Navbar-Const";

const Navbar = () => {
  return (
    <div>
        {NavbarConst.map((item)=>
        <Link to={item.path}>{item.name}</Link>
        )}
    </div>
  )
}

export default Navbar