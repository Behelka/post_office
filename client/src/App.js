import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import cougarlogo from "./assets/cougarlogo.jpg"
import './App.css'
import Navbar from './components/navBar/navBar';



function Home() {
  return(
    <div className="container">
      <div className="color-bar"/>
      <div className="image-container">
        <img src={cougarlogo} alt="logo"/>
      </div>
    </div>
  );
}


const App = ()  =>{


const authToken=true; 
let links = [["", "Home"]];


  return (
    <Router>
      <Navbar links={links}/>
     <Routes>
      <Route path="/" element={<Home/>} />
      
      </Routes>
    </Router>
  );
}

export default App;
