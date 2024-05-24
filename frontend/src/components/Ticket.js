import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import httpSrv from "../services/httpSrv"
import TicketContent from './TicketContent'

function Ticket() {
    const [tickets, setTickets] = useState([])
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
                <div className="row justify-content-center align-items-center g-2">
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
            </div>

        </>
    )
}

export default Ticket