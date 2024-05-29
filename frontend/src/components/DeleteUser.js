import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"
import DeleteUserRow from "./DeleteUserRow"

function DeleteUser() {
    const [ulist, setUlist] = useState([])
    const nav = useNavigate()

    const delUser = (user) => {
        if(user) {
            let data = new FormData()
            data.append("userData", JSON.stringify(user))
            data.append("sid", sessionStorage.getItem("sid"))
            if (window.confirm("Are you sure to delete this user?")) {
                httpSrv.deleteUser(data).then(
                    res => {
                        if (res.data.logout) { // if session time out, jump to the login page
                            sessionStorage.removeItem("sid")
                            sessionStorage.removeItem("user")
                            sessionStorage.removeItem("type")
                            alert(res.data.logout)
                            nav("/")
                        } else if (res.data.message) { // if fail, show a message
                            alert(res.data.message)
                        } else if (res.data.success) {// if success, show a message and reload this page
                            alert(res.data.success)
                            window.location.reload()
                        }
                    },
                    rej => {
                        alert(rej);
                    }
                )
            } else {
                alert("This request was canceled.")
            }
        }
    }

    // load user data
    const loadUlist = () => {
        let data = new FormData()
        data.append("sid", sessionStorage.getItem("sid"))
        httpSrv.ulist(data).then(
            res => {
                if(res.data.message) { // if fail, show a message
                    alert(res.data.message)
                } else if(res.data.logout) { // if session time out, jump to the login page
                    alert(res.data.logout)
                    sessionStorage.removeItem("sid")
                    sessionStorage.removeItem("user")
                    sessionStorage.removeItem("type")
                    nav("/login")
                } else if (Array.isArray(res.data)) { // if success to load the data, show the data ona table
                    setUlist(res.data)
                }
            },
            rej => {
                alert(rej)
            }
        )
    }
    
    useEffect(() => {
        loadUlist()
    },[])

    return(
        <>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2">
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-primary text-center">
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>First name</th>
                                        <th>Last name</th>
                                        <th>Email</th>
                                        <th>User type</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ulist.map((user,idx) => {return(<DeleteUserRow key={idx} user={user} del={delUser} />)})}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteUser