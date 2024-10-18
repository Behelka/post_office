import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navBar/navBar';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Shop from './components/Shop/Shop';
import Profile from './components/Profile/Profile';
import AboutUs from './components/AboutUs/AboutUs';
import TrackingHistory from './components/TrackingHistory/TrackingHistory';
import PackagePortal from './components/PackagePortal/PackagePortal';
import ManagerPortal from './components/ManagerPortal/ManagerPortal';
import Reports from './components/Reports/Reports';
import AddDepartment from './components/AddDepartment/AddDepartment';
import AddLocation from './components/AddLocation/AddLocation';
import Dashboard from './components/Dashboard/Dashboard';



const App = ()  =>{
let links = [["", "Home"],["Login","Login/Register"],["Shop","Shop"], ["AboutUs", "About/Contact Us"]];

var user = "admin"; // This is to see different roles

if (user === "employee") {
  links = [["", "Home"], ["PackagePortal", "Package Portal"], ["TrackingHistory", "Tracking History"], ["Profile", "Profile"]];
}

if (user === "manager") {
  links = [["", "Home"], ["PackagePortal", "Package Portal"], ["TrackingHistory", "Tracking History"], ["ManagerPortal", "Manager Portal"], ["Profile", "Profile"]];
}

if (user === "customer") {
  links = [["", "Home"], ["Dashboard", "Dashboard"], ["TrackingHistory", "Tracking History"], ["Reports", "Reports"], ["Shop","Shop"], ["AboutUs", "About/Contact Us"], ["Profile", "Profile"]];
}

if (user === "admin") {
  links = [["", "Home"], ["PackagePortal", "Package Portal"], ["TrackingHistory", "Tracking History"], ["Reports", "Reports"], ["ManagerPortal", "Manager Portal"], 
           ["AddDepartment", "Add Department"], ["AddLocation", "Add Location"], ["Profile", "Profile"]];
}



  return (
    <Router>
      <Navbar links={links}/>
     <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="Login" element={<Login/>}/>
      <Route path="Shop" element={<Shop/>}/>
      <Route path="PackagePortal" element={<PackagePortal/>}/>
      <Route path="AboutUs" element={<AboutUs/>}/>
      <Route path="TrackingHistory" element={<TrackingHistory/>}/>
      <Route path="Profile" element={<Profile/>}/>
      <Route path="ManagerPortal" element={<ManagerPortal/>}/>
      <Route path="Dashboard" element={<Dashboard/>}/>
      <Route path="Reports" element={<Reports/>}/>
      <Route path="AddDepartment" element={<AddDepartment/>}/>
      <Route path="AddLocation" element={<AddLocation/>}/>
      
      </Routes>
    </Router>
  );
}

export default App;
