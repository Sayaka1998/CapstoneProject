import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"

function DeleteAccount() {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [passconf, setConf] = useState("")
    const [show, setShow] = useState(false) // show password
    const [error, setError] = useState("")
    const nav = useNavigate()

    useEffect(() => {
        if (pass && passconf && pass !== passconf) { // show error message when password and confirmed password don't match
            setError("Passwords do not match")
        } else {
            setError("")
        }
    }, [pass, passconf])

    const submitHandle = (e) => {
        e.preventDefault(e.target)
        if (pass !== passconf) { // show error message and do not send the data when password and confirmed password don't match
            setError("Passwords do not match")
            return
        }
        setError("")
        let data = new FormData(e.target)
        data.append("sid", sessionStorage.getItem("sid"))
        if (window.confirm("Are you sure to delete your account?")) {
            httpSrv.deleteAccount(data).then(
                res => {
                    if (res.data.message) { // if it failed, show a message
                        alert(res.data.message)
                    } else if (res.data.success) { // if it successes, remove sid and user from session storage and jump to the home page
                        alert(res.data.success)
                        sessionStorage.removeItem("sid")
                        sessionStorage.removeItem("user")
                        sessionStorage.removeItem("type")
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
        } else {
            alert("Your request was canceled.")
        }
    }
    return (
        <>
            <h1 className="text-center fw-bolder mt-4 mb-3">Delete Account</h1>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2">
                    <div className="col-4">
                        <form onSubmit={submitHandle}>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type={show ? "text" : "password"} className="form-control" name="pass" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" required />
                                <label htmlFor="pass">Password</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type={show ? "text" : "password"} className="form-control" name="passconf" value={passconf} onChange={e => setConf(e.target.value)} placeholder="Password confirm" required />
                                <label htmlFor="passconf">Password confirm</label>
                            </div>
                            <div className="form-check mb-3">
                                <input type="checkbox" className="form-check-input" name="show" id="flexCheckDefault" checked={show} onChange={() => setShow(!show)} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">Show Password</label>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-delete">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteAccount