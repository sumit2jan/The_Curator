//import './style.css'
//import './App.css'
import './index.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Navbar from './components/layout/Navbar';
import SIGNUP from './pages/Signup';
import PROFILE from './pages/Profile';


function App() {

  return (
    <>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
          toastClassName="!bg-[#111111] !text-white !border !border-white/10 !rounded-xl"
          bodyClassName="text-sm font-medium"
          progressClassName="!bg-white"
        />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/signup' element={<SIGNUP />} />
          <Route path='/profile' element={<PROFILE />} />
        </Routes>
      </BrowserRouter>
    </>

  );

}

export default App
