import { useState, useEffect } from "react"

function TicketContent(props) {
    const [num, setNum] = useState(0)
    
    useEffect(() => { // whenever the number of tickets changes, change the number and the total price
        const total = props.ticket.price * num
        const newTicket = { ...props.ticket, number: num, total:total};
        props.add(newTicket);
    }, [num]);

    return (
        <>
            <div className="row">
                <label className="col-7 col-form-label">{props.ticket.type} - ${props.ticket.price}</label>
                <div className="col-2">
                    <input type="number" className="form-control" name="num" value={num} onChange={e => setNum(e.target.value)} min={0} max={9} placeholder='0' />
                </div>
            </div>
        </>
    )
}

export default TicketContent