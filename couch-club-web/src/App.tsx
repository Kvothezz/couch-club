import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyLists from '../src/pages/MyLists/MyLists';
import './index.css';


import Login from './pages/Login/Login'; 
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Match from './pages/Match/Match';
import Register from './pages/Register/Register';

const AppLayout = () => (
  <>
    <Navbar />
    <main className="app-content">
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />
          
          <Route path="my-lists" element={<MyLists />} />
          <Route path="match" element={<Match />} /> </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;