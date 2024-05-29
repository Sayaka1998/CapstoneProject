function TicketRow(props) {

    const delTckHandler = () => { //set the ticket data as the deleting ticket
        props.del(props.ticket)
    }

    return(
        <>
            <tr>
                <td>{props.ticket.tid}</td>
                <td>{props.ticket.type}</td>
                <td>{props.ticket.price}</td>
                <td><button type="button" className="btn btn-delete" onClick={delTckHandler}>Delete</button>
                </td>
            </tr>
        </>
    )
}

export default TicketRow