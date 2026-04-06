import { Outlet, NavLink, Link } from 'react-router'
import { TbTie } from "react-icons/tb"
import "../../styles/MainLayout.css"

const MainLayout = () => {

    const currentYear = new Date().getFullYear()

    return (
        <div className="app-container">
            <header className="navbar">
                <Link to="/" className="logo">
                    <TbTie className="logo-icon" /> The Suits 
                </Link>
                
                <nav className="nav-links">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/accessFiles" 
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        File Access
                    </NavLink>
                </nav>

                <div className="nav-meta">
                    <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>v1.0.0</span>
                </div>
            </header>

            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <Link to="/" className="logo">
                            <TbTie className="logo-icon" /> The Suits 
                        </Link>
                        <p>A project dedicated to the people who value productivity over distraction.</p>
                        <p>Built for teams who value the integrity of the written word over cheap talk.</p>
                    </div>
                    
                    <nav className="footer-nav">
                        <Link to="https://github.com/swayam9705">DEVELOPERS</Link>
                        <Link to="https://github.com/swayam9705/The-Suits">SOURCE CODE</Link>
                        <span className="copyright">© { currentYear }</span>
                    </nav>
                </div>
            </footer>

        </div>
    )
}

export default MainLayout