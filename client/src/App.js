import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar/navBar';
import Home from './components/Home/Home';
import Login from './components/Login/Loign';
import Shop from './components/Shop/Shop';



const App = ()  =>{


let links = [["", "Home"],["Login","Login"],["Shop","Shop"]];


  return (
    <Router>
      <Navbar links={links}/>
     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="Login" element={<Login/>}/>
      <Route path="Shop" element={<Shop/>}/>
      
      </Routes>
    </Router>
  );
}

export default App;
