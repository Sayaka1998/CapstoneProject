import './css/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from './components/Menu';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Change from './components/Change';
import Delete from './components/Delete';
import Ticket from './components/Ticket';
import History from './components/History';
import Nopage from './components/Nopage';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Menu/>}>
                <Route path='/' element={<Home/>}/>
                <Route path='/ticket' element={<Ticket/>}/>
                <Route path='/history' element={<History/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/change' element={<Change/>}/>
                <Route path='/delete' element={<Delete/>}/>
                <Route path='*' element={<Nopage/>}/>
            </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
