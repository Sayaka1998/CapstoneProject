function HistoryRow(props) {
    return(
        <>
            <tr>
                <td>{props.order.oid}</td>
                <td>{props.order.bdate}</td>
                <td>{props.order.type}</td>
                <td>{props.order.number}</td>
                <td>{props.order.total}</td>
            </tr>
        </>
    )
}

export default HistoryRow