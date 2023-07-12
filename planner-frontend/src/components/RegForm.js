import { Form, Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegForm = () => {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [valid, setValid] = useState(false)
  const [passwordClassName, setPasswordClassName] = useState('');
  const [errormsg, setErrormsg] = useState('')

  const [regcomplete, setRegcomplete] = useState('')

  const handleRegistration = async (e) => {
    e.preventDefault();

    if (!valid) {
      setErrormsg('Password must be over 6 characters with a number OR special character.')
    }

    else {
      try {
        const response = await fetch('https://jdfban.pythonanywhere.com/api/register/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password }),
        });
        if (response.ok) {
          toast.success('Account created successfully!', { position: toast.POSITION.TOP_CENTER });
          setEmail('')
          setUsername('')
          setPassword('')
          setRegcomplete('Account created successfully!')
          navigate('/login')
        } else {
          setEmail('')
          setUsername('')
          setPassword('')
          const data = await response.json();
          const usernameEr = data.username || [];
          const emailEr = data.email || [];
          var errString = ''
          if (usernameEr !== '') {
            errString+=' '
            errString+=usernameEr
          }
          if (emailEr !== '') {
            errString+=' '
            errString+=emailEr
            setErrormsg(errString)
          }
          throw new Error(data.detail);
        }
      } catch (error) {
        toast.error(`Error occurred: ${errString}`, error.message, { position: toast.POSITION.TOP_CENTER });
        errString = ''
      }
    }
    }

  useEffect(() => {
    setErrormsg('')
    if (password.length === 0) {
      setPasswordClassName('')
      setValid(false)
    }
    else if (password.length < 7 || !/[0-9\W]/.test(password) || !/[a-zA-Z]/.test(password)) {
      setPasswordClassName('pwd')
      setValid(false)
    }
    else {
      setPasswordClassName('pwdvalid')
      setValid(true)
    }
  }, [password])

  return (
    <>
      <Card className='logregform'>
        <Card.Body>
          <h2 className='text-center mb-4'>Sign Up</h2>
          <p>{regcomplete}</p>
          <Form onSubmit={handleRegistration}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
            </Form.Group>
            <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.currentTarget.value)} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control className={passwordClassName} onChange={(e) => setPassword(e.currentTarget.value)} type="password" value={password} required />
            </Form.Group>
            <p className='pwdmsg'>{errormsg}</p>
            <Button className='w-100' type="submit">Register</Button>
          </Form>
        </Card.Body>
      </Card>
      <div className='w-100 text-center mt-2'>
        <Link style={{color: 'white'}} to="/login">
          Already have an account? Sign in.
        </Link>
      </div>
    </>
  )
}

export default RegForm