import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar/navBar';
import Home from './components/Home/Home';
import Login from './components/Login/Loign';
import Shop from './components/Shop/Shop';
import Profile from './components/Profile/Profile';
import aboutUs from './components/aboutUs/aboutUs';
import trackingHistory from './components/trackingHistory/trackingHistory';
import packagePortal from './components/packagePortal/packagePortal';
import managerPortal from './components/managerPortal/managerPortal';
import Reports from './components/Reports/Reports';
import addDepartment from './components/addDepartment/addDepartment';
import addLocation from './components/addLocation/addLocation';
import Dashboard from './components/Dashboard/Dashboard';



const App = ()  =>{
let links = [["", "Home"],["Login","Login/Register"],["Shop","Shop"], ["aboutUs", "About/Contact Us"]];

var user = "admin"; // This is to see different roles

if (user === "employee") {
  links = [["", "Home"], ["packagePortal", "Package Portal"], ["trackingHistory", "Tracking History"], ["Profile", "Profile"]];
}

if (user === "manager") {
  links = [["", "Home"], ["packagePortal", "Package Portal"], ["trackingHistory", "Tracking History"], ["managerPortal", "Manager Portal"], ["Profile", "Profile"]];
}

if (user === "customer") {
  links = [["", "Home"], ["Dashboard", "Dashboard"], ["trackingHistory", "Tracking History"], ["Reports", "Reports"], ["Shop","Shop"], ["aboutUs", "About/Contact Us"], ["Profile", "Profile"]];
}

if (user === "admin") {
  links = [["", "Home"], ["packagePortal", "Package Portal"], ["trackingHistory", "Tracking History"], ["Reports", "Reports"], ["managerPortal", "Manager Portal"], 
           ["addDepartment", "Add Department"], ["addLocation", "Add Location"], ["Profile", "Profile"]];
}



  return (
    <Router>
      <Navbar links={links}/>
     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="Login" element={<Login/>}/>
      <Route path="Shop" element={<Shop/>}/>
      <Route path="packagePortal" element={<packagePortal/>}/>
      <Route path="aboutUs" element={<aboutUs/>}/>
      <Route path="trackingHistory" element={<trackingHistory/>}/>
      <Route path="Profile" element={<Profile/>}/>
      <Route path="managerPortal" element={<managerPortal/>}/>
      <Route path="Dashboard" element={<Dashboard/>}/>
      <Route path="Reports" element={<Reports/>}/>
      <Route path="addDepartment" element={<addDepartment/>}/>
      <Route path="addLocation" element={<addLocation/>}/>
      
      </Routes>
    </Router>
  );
}

export default App;
