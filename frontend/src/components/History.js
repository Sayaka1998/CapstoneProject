import { useState} from "react"
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"
import HistoryRow from "./HistoryRow"

function History() {
    const [order, setOrder] = useState([])
    const nav = useNavigate()

    const loadOrder = () => {
        if(order.length == 0) { // if the variable order doesn't have data, load the data from the backend
            let data = new FormData()
            data.append("sid", sessionStorage.getItem("sid"))
            httpSrv.history(data).then(
                res => {
                    if(res.data.message){ // if fail to load the data, show a message
                        alert(res.data.message)
                    } else if (res.data.logout) { // if session time out, remove sid and user data and jump to the login page
                        alert(res.data.logout)
                        sessionStorage.removeItem("sid")
                        sessionStorage.removeItem("user")
                        nav("/login")
                    } else if (Array.isArray(res.data)) { // if success, set the data as order
                        setOrder(res.data)
                    } 
                }, 
                rej => {
                    alert(rej)
                }
            )
        }
    }
    loadOrder()

    return(
        <>
        <div className="container-fluid">
            <div className="row justify-content-center align-items-center g-2">
                <div className="col">
                    <div className="table-responsive">
                        <table className="table table-primary">
                            <thead>
                                <tr>
                                    <th>Order Number</th>
                                    <th>Purchase Date</th>
                                    <th>Ticket Type</th>
                                    <th>Number of tickets</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.length !== 0 ? (order.map((order, idx) => {return(<HistoryRow key={idx} order={order}/>)})) : (<tr><td colSpan="5">No order</td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default History