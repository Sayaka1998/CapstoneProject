import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"

function RegisterStaff() {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
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
        e.preventDefault()
        if (pass !== passconf) { // show error message and do not send the data when password and confirmed password don't match
            setError("Passwords do not match")
            return
        }
        setError("")
        let data = new FormData(e.target)
        httpSrv.registerStaff(data).then(
            res => {
                if (res.data.success) { // if success to register, jump to the log in page
                    alert(res.data.success)
                    window.location.reload();
                } else if (res.data.message) { // if fail to register, show the error message
                    alert(res.data.message)
                } else if (res.data.logout) { //if session time out, jump to the login page
                    alert(res.data.logout)
                    sessionStorage.getItem("sid")
                    sessionStorage.getItem("user")
                    sessionStorage.getItem("type")
                    nav("/login")
                }
            },
            rej => {
                alert(rej)
            }
        )
    }
    return(
        <>
            <h1 className="text-center fw-bolder mb-3">Staff Registration</h1>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2">
                    <div className="col-4">
                        <form onSubmit={submitHandle}>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" name="fname" value={fname} onChange={e => setFname(e.target.value)} placeholder="Firstname" required />
                                <label htmlFor="fname">Firstname</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" className="form-control" name="lname" value={lname} onChange={e => setLname(e.target.value)} placeholder="Lastname" required />
                                <label htmlFor="lname">Lastname</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
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
                            <button type="submit" className="btn btn-outline-primary">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterStaff