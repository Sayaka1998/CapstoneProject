import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"

function Change() {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [newPassConf, setNewConf] = useState("")
    const [show, setShow] = useState(false) // show password
    const [error, setError] = useState("")
    const nav = useNavigate()

    useEffect(() => {
        if (newPass && newPassConf && newPass !== newPassConf) { // show error message when new password and confirmed new password don't match
            setError("Passwords do not match")
        } else {
            setError("")
        }
    }, [newPass, newPassConf])

    const submitHandle = (e) => {
        e.preventDefault()
        if (newPass !== newPassConf) {
            setError("Passwords do not match")
            return
        }
        setError("")
        let data = new FormData(e.target)
        data.append("sid", sessionStorage.getItem("sid"))
        httpSrv.change(data).then(
            res => {
                if (res.data.message) { // if it failed, show a message 
                    alert(res.data.message)
                } else if (res.data.success) { // if it successes, jump to the home page
                    alert(res.data.success)
                    nav("/")
                } else if (res.data.logout) { // if session time out, remove sid and user from session storage and jump to the log in page
                    alert(res.data.logout)
                    sessionStorage.removeItem("sid")
                    sessionStorage.removeItem("user")
                    sessionStorage.removeItem("type")
                    nav("/login")
                }
            },
            rej => {
                alert(rej)
            }
        )
    }

    return (
        <>
            <h1 className="text-center fw-bolder mb-3">Change Password</h1>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2">
                    <div className="col-4">
                        <form onSubmit={submitHandle}>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type={show ? "text" : "password"} className="form-control" name="pass" value={pass} onChange={e => setPass(e.target.value)} placeholder="Current Password" required />
                                <label htmlFor="pass">Current Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type={show ? "text" : "password"} className="form-control" name="newPass" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="New Password" required />
                                <label htmlFor="newPass">New Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type={show ? "text" : "password"} className="form-control" name="newPassConf" value={newPassConf} onChange={e => setNewConf(e.target.value)} placeholder="New Password Confirm" required />
                                <label htmlFor="newPassConf">New Password Confirm</label>
                            </div>
                            <div className="form-check mb-3">
                                <input type="checkbox" className="form-check-input" name="show" id="flexCheckDefault" checked={show} onChange={() => setShow(!show)} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">Show Password</label>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-outline-primary">Change</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Change