import { Form, Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import { useRef, useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from 'jwt-decode';

const LoginForm = () => {

  const { setUser, setAuthTokens, setProfile, profile } = useContext(AuthContext);

  const usernameRef = useRef();
  const errRef = useRef();

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    usernameRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [username, pwd])

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://jdfban.pythonanywhere.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, pwd }),
      });
      if (response.ok) {
        toast.success('Login successful!', { position: toast.POSITION.TOP_CENTER });
        const data = await response.json();
        const decodedToken = jwt_decode(data.access);

        let rtoken = data.refresh;
        let atoken = data.access;
        let uid = decodedToken.user_id;


        setUser(uid);
        setAuthTokens({access: atoken, refresh: rtoken});
        setProfile(data.profile)

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userId', decodedToken.user_id);
        localStorage.setItem('profile', JSON.stringify(data.profile))


        setUsername('');
        setPwd('');
      } else {
        setPwd('')
        const data = await response.json();
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error('Error occured: ', error);
      toast.error('Username or password not correct, please try again.', { position: toast.POSITION.TOP_CENTER });
    }
  }

  return (
    <>
      <Card className='logregform'>
        <Card.Body>
          <h2 className='text-center mb-4'>Sign In</h2>
          <Form onSubmit={handleLogin}>
            <Form.Group id="email">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} onChange={(e) => setUsername(e.target.value)} value={username} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
            </Form.Group>
            <p ref={errRef} aria-live="assertive">{errMsg}</p>
            <Button className='w-100' type="submit">Sign In</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Link style={{color: 'white'}} to="/register">
          Don't have an account? Register.
        </Link>
      </div>
    </>
  )
}

export default LoginForm