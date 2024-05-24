import { useState, useEffect } from "react"

function Home() {
    const [user, setUser] = useState(null)

    useEffect(()=>{
        if(sessionStorage.getItem("user")){
            setUser(JSON.parse(sessionStorage.getItem("user")))
        } 
    },[])    

    return(
        <>
            <h1>Home Page</h1>
            {user && <h3>Hello, {user.fname} {user.lname} </h3>}
        </>
    )
}

export default Home