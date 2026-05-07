import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Navbar from './components/layout/Navbar';
import SIGNUP from './pages/Signup';
import PROFILE from './pages/Profile';
import CREATEBLOG from './pages/Blog';
import BLOGSPREVIEW from './pages/BlogPreview';
import BLOGSPREVIEWSLUG from './pages/BlogPreviewSlug';
import BLOGSFEED from './pages/BlogFeed';
// import PrivateRoute from "./middleware/privateRoute";


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
          <Route path='*' element={<p>404 Not Found</p>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/signup' element={<SIGNUP />} />
          <Route path='/profile' element={<PROFILE />} />
          <Route path='/profile/:id' element={<PROFILE />} />     {/*to show user profile to other*/}
          <Route path='/createblog' element={<CREATEBLOG />} />
          <Route path='/blogsfeed' element={<BLOGSFEED />} />
          <Route path='/updateblog/:id' element={<CREATEBLOG />} />
          <Route path='/previewblog/:id' element={<BLOGSPREVIEW />} />

          <Route path='/blog/:slug' element={<BLOGSPREVIEWSLUG />} />

          {/* <Route element={<PrivateRoute />}></Route> */}

        </Routes>
      </BrowserRouter >
    </>

  );

}

export default App
