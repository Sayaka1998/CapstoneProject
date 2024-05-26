import './css/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Menu from './components/Menu'
import Home from './components/Home'
import Login from './components/Login'
import RegisterAccount from './components/RegisterAccount'
import RegisterStaff from './components/RegisterStaff'
import Change from './components/Change'
import DeleteAccount from './components/DeleteAccount'
import DeleteUser from './components/DeleteUser'
import Ticket from './components/Ticket'
import History from './components/History'
import Nopage from './components/Nopage'

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Menu/>}>
                <Route path='/' element={<Home/>}/>
                <Route path='/ticket' element={<Ticket/>}/>
                <Route path='/history' element={<History/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/registerAccount' element={<RegisterAccount/>}/>
                <Route path='/registerStaff' element={<RegisterStaff/>} />
                <Route path='/change' element={<Change/>}/>
                <Route path='/deleteAccount' element={<DeleteAccount/>}/>
                <Route path='/deleteUser' element={<DeleteUser/>}/>
                <Route path='*' element={<Nopage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
