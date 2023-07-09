import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Finance from './pages/Finance'
import Debts from './pages/Debts'
import Account from './pages/Account'
import Worksheet from './pages/Worksheet';
import Expenses from './pages/Expenses';

import PrivateRoutes from './utils/PrivateRoutes';
import LoggedOutRoutes from './utils/LoggedOutRoutes';

import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
        <ToastContainer />
        <AuthProvider>
          <Routes>
              <Route element={<PrivateRoutes />}>
                <Route element={<Home />} path='/' />
                <Route element={<Finance />} path='/payments' />
                <Route element={<Debts />} path='/debts' />
                <Route element={<Account />} path='/account' />
                <Route element={<Worksheet />} path='/worksheet' />
                <Route element={<Expenses />} path='/expenses' />
              </Route>
              <Route element={<LoggedOutRoutes />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
          </Routes>
        </AuthProvider>
    </div>
  )
}
export default App;