import { Outlet, Link } from "react-router-dom";
import "./Layout.css";

function Layout() {
  
    return (
      <div>
        <nav>
            <div className="tit">ExcitingCoding</div>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="About">About</Link></li>
                <li><Link to="Flag">국기</Link></li>
            </ul>
            <div>#</div>
        </nav>
        <main>
            <Outlet />
        </main>
      </div>
    )
  }
  
  export default Layout