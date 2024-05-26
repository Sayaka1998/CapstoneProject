import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"
import TicketContent from './TicketContent'
import TicketRow from './TicketRow'

function Ticket() {
    const [tickets, setTickets] = useState([])
    const [type, setType] = useState("")
    const [price, setPrice] = useState(0)
    const [cart, setCart] = useState([])
    const [total, setTotal] = useState(0)
    const nav = useNavigate()

    const addCart = (newTicket) => { // add tickets the user wants to buy
        setCart(prevCart => {
            const tckIdx = prevCart.findIndex(t => t.type === newTicket.type)
            if (tckIdx !== -1) { //if the tickets already exists in a cart, just change the number of tickets
                const updatedCart = [...prevCart]
                updatedCart[tckIdx] = newTicket
                return updatedCart
            } else { // if the tickets don't exists in a cart, add in to the cart
                return [...prevCart, newTicket]
            }
        })
    }

    useEffect(() => {// whenever the number of tickets in a cart changes, calculate the total price
        calTotal()
    }, [cart])

    const calTotal = () => { // calculate the total price of all tickets in a cart
        let sum = 0
        for (let tck of cart) {
            sum += tck.total
        }
        setTotal(sum)
    }

    const buyHander = () => {
        if(cart.length !== 0) {
            for(let i = 0; i < cart.length; i++) {
                if(cart[i].number == 0) {
                    cart.splice(i--,1)
                }
            }
            if(cart.length !== 0) {
                let data = new FormData()
                data.append("ticket",JSON.stringify(cart))
                data.append("sid", sessionStorage.getItem("sid"))
                for(let i of data) {
                    console.log(i)
                }
                httpSrv.buy(data).then(
                    res => {
                        if(res.data.message){
                            alert(res.data.message)
                        } else if (res.data.success) {
                            alert(res.data.success)
                            nav("/history")
                        } else if (res.data.logout) {
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
                alert("You don't choose any ticket.")
            }
        }
    }

    const addTicket = (e) => { // add new ticket data
        e.preventDefault()
        let data = new FormData(e.target)
        data.append("sid", sessionStorage.getItem("sid"))
        httpSrv.addTickets(data).then(
            res =>{
                if(res.data.success) { // if success, show a message amd reload this page
                    alert(res.data.success) 
                    window.location.reload()
                } else if (res.data.message) { //if fail, show a message
                    alert(res.data.message)
                } else if(res.data.logout) { // if session time out, remove sid, type and user data, and jump to the login page
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

    const delTicket = (ticket) => { // delete ticket data
        if(ticket) {
            let data = new FormData()
            data.append("ticketData",JSON.stringify(ticket))
            data.append("sid", sessionStorage.getItem("sid")) 
            if(window.confirm("Are you sure to delete this ticket data?")) {
                httpSrv.deleteTickets(data).then(
                    res => {
                        if(res.data.success) { // if success to delete, show a message and reload this page
                            alert(res.data.success)
                            window.location.reload()
                        } else if(res.data.message) { // if fail,  show a message
                            alert(res.data.message) 
                        } else if(res.data.logout) { //if session timeout, show a message, remove sid, userdata, type from the session storage and jump to the login page
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
    }

    const loadTickets = () => { // load tickets data
        if (tickets.length === 0) { // if the page doesn't have the tickets data, load it
            let data = new FormData()
            data.append("sid", sessionStorage.getItem("sid"))
            httpSrv.ticket(data).then(
                res => {
                    if (res.data.message) { // if fail to load the data, show a message
                        alert(res.data.message)
                    } else if (res.data.logout) {// if session time out, remove sid and the user data from session storage and jump to the login page
                        alert(res.data.logout)
                        sessionStorage.removeItem("sid")
                        sessionStorage.removeItem("user")
                        nav("/login")
                    } else if (Array.isArray(res.data)) { // if success to load the tickets data, set the data 
                        setTickets(res.data)
                        setCart([])
                    }
                },
                rej => {
                    alert(rej)
                }
            )
        }
    }
    loadTickets()

    return (
        <>
            <h1 className="text-center fw-bolder mb-3">Ticket</h1>
            <div className="container-fluid">
                <div className="row justify-content-center align-items-center g-2" style={{display: sessionStorage.getItem("type") == "Customer" ? "block" : "none"}}>
                    <div className="col-12 text-center mb-3">
                        <div className="form-group">
                            {tickets.map((ticket, idx) => { return (<TicketContent key={idx} ticket={ticket} add={addCart}/>) })}
                        </div>
                        <p>Total : ${total}</p>
                    </div>
                    <div className='col text-center'>
                        <button type="button" className="btn btn-outline-primary" onClick={buyHander}>Buy</button>
                    </div>
                </div>

                <div className="row justify-content-center align-items-center g-2" style={{display: !(sessionStorage.getItem("type") == "Customer") ? "block" : "none"}}>
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-primary">
                                <thead>
                                    <tr>
                                        <th>Ticket ID</th>
                                        <th>Type</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tickets.map((ticket, idx) => {return(<TicketRow key={idx} ticket={ticket} del={delTicket}/>)})}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='col'>
                        <form onSubmit={addTicket}>
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" name="type" value={type} onChange={e => setType(e.target.value)} placeholder="Ticket Type"/>
                                <label htmlFor="type">Type</label>
                            </div>
                            <div class="form-floating mb-3">
                                <input type="number" class="form-control" name="price" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price"/>
                                <label htmlFor="price">Price</label>
                            </div>
                            <button type="submit" class="btn btn-primary">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Ticket