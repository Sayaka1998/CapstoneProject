import { useState, useEffect } from "react"
import { Outlet, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"

function Menu() {
    const [user, setUser] = useState(null)
    const nav = useNavigate()

    useEffect(() => {
        const username = sessionStorage.getItem("user")
        if (username) {
            setUser(JSON.parse(username))
        }
    }, [])

    const logout = () => {
        if (sessionStorage.getItem("sid")) {
            let data = new FormData()
            data.append("sid", sessionStorage.getItem("sid"))
            httpSrv.logout(data).then(
                res => {
                    if (res.data.message) { // if success to log out, jump to the home page
                        sessionStorage.removeItem("sid")
                        sessionStorage.removeItem("user")
                        sessionStorage.removeItem("type")
                        setUser(null)
                        alert(res.data.message)
                        if (window.location.pathname === "/") { // if the page is the home page, reload the page
                            window.location.reload()
                        } else { // if the page is not the home page, jump to the home page
                            nav("/")
                        }
                    } else if (res.data.logout) { // if session time out, jump to the login page
                        sessionStorage.removeItem("sid")
                        sessionStorage.removeItem("user")
                        sessionStorage.removeItem("type")
                        setUser(null)
                        alert(res.data.message)
                        nav("/login")
                    }
                },
                rej => {
                    alert(rej)
                }
            )
        }
    }
    return (
        <>
            <div className="entire-page">
                <header>
                    <nav className="navbar navbar-expand-lg">
                        <div className="container">
                            <a className="navbar-brand" href="/">Exhibition</a>
                            <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation"></button>
                            <div className="collapse navbar-collapse" id="collapsibleNavId">
                                <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                                    <li className="nav-item">
                                        <Link to="/" className="nav-link fw-bolder">Home</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: sessionStorage.getItem("sid") ? "block" : "none" }}>
                                        <Link to="/ticket" className="nav-link fw-bolder">Ticket</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: sessionStorage.getItem("type") == "Customer" ? "block" : "none" }}>
                                        <Link to="/history" className="nav-link fw-bolder">Order History</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: !(sessionStorage.getItem("sid")) ? "block" : "none" }}>
                                        <Link to="/login" className="nav-link fw-bolder">Log in</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: !(sessionStorage.getItem("sid")) ? "block" : "none" }}>
                                        <Link to="/registerAccount" className="nav-link fw-bolder">Account Registration</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: sessionStorage.getItem("sid") && (sessionStorage.getItem("type") == "Staff" || sessionStorage.getItem("type") == "Admin") ? "block" : "none" }}>
                                        <Link to="/registerStaff" className="nav-link fw-bolder">Staff Registration</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: sessionStorage.getItem("sid") ? "block" : "none" }}>
                                        <Link to="/change" className="nav-link fw-bolder">Change Password</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: sessionStorage.getItem("type") == "Customer" ? "block" : "none" }}>
                                        <Link to="/deleteAccount" className="nav-link fw-bolder">Delete Account</Link>
                                    </li>
                                    <li className="nav-item" style={{ display: sessionStorage.getItem("sid") && (sessionStorage.getItem("type") == "Staff" || sessionStorage.getItem("type") == "Admin") ? "block" : "none" }}>
                                        <Link to="/userList" className="nav-link fw-bolder">User List</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="username">
                                {user !== null ? <p>{user.fname} {user.lname}</p> : <p></p>}
                            </div>
                            <button type="button" className="logout-btn" onClick={logout} style={{ display: sessionStorage.getItem("sid") ? "block" : "none" }}>Log out</button>                            
                        </div>
                    </nav>
                </header>

                <main>
                    <Outlet />
                </main>

                <footer>
                    <p>&copy; 2024 Sayaka Maki</p>
                </footer>
            </div>
        </>
    )
}

export default Menu