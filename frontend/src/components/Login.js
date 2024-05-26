import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"

function Login() {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [show, setShow] = useState(false) // show password
    const [sid, setSid] = useState("")
    const [user, setUser] = useState([])
    const [type, setType] = useState("")
    const nav = useNavigate()

    useEffect(() => {
        if (sid) { // if session id is set, set session id ,type and user data to session storage
            sessionStorage.setItem("sid", sid)
            sessionStorage.setItem("user", user)
            sessionStorage.setItem("type", type)
            nav("/");
        }
    }, [sid, user, nav]);

    const submitHandle = (e) => {
        e.preventDefault()
        let data = new FormData(e.target)
        httpSrv.login(data).then( // send the user email and password to backend
            res => {
                if (res.data.message) { // if it's wrong, show a message
                    alert(res.data.message)
                } else { // set the data to session id and user data
                    setSid(res.data.sid)
                    setUser(JSON.stringify(res.data.user))
                    setType(res.data.type)
                }
            },
            rej => {
                alert(rej)
            }
        )
    }

    return (
        <>
            <h1 className="text-center fw-bolder mb-3">Log in</h1>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2">
                    <div className="col-4">
                        <form onSubmit={submitHandle}>
                            <div className="form-floating mb-3">
                                <select className="form-select form-select-lg" name="type">
                                    <option defaultValue>Customer</option>
                                    <option>Staff</option>
                                    <option>Admin</option>
                                </select>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type={show ? "text" : "password"} className="form-control" name="pass" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" required />
                                <label htmlFor="pass">Password</label>
                            </div>
                            <div className="form-check mb-3">
                                <input type="checkbox" className="form-check-input" name="show" id="flexCheckDefault" checked={show} onChange={() => setShow(!show)} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">Show Password</label>
                            </div>
                            <button type="submit" className="btn btn-outline-primary">Log in</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login