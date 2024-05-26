function DeleteUserRow(props) {

    const delUserHandler = () => { //set the user data as the deleting user
        props.del(props.user)
    }

    return(
        <>
            <tr>
                <td>{props.user.uid}</td>
                <td>{props.user.fname}</td>
                <td>{props.user.lname}</td>
                <td>{props.user.email}</td>
                <td>{props.user.type}</td>
                <td><button type="button" class="btn btn-outline-danger" onClick={delUserHandler}>Delete</button></td>
            </tr>
        </>
    )
}

export default DeleteUserRow