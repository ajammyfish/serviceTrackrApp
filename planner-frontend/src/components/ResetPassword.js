import { Form, Button, Card } from 'react-bootstrap'
import { useEffect, useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';

const ResetPassword = ({show}) => {
    const { authTokens } = useContext(AuthContext);

    const [curPassword, setCurPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        setErrormsg('')
        if (newPassword.length === 0) {
          setPasswordClassName('')
          setValid(false)
        }
        else if (newPassword.length < 7 || !/[0-9\W]/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
          setPasswordClassName('pwd')
          setValid(false)
        }
        else {
          setPasswordClassName('pwdvalid')
          setValid(true)
        }
    }, [newPassword])

    const [valid, setValid] = useState(false)
    const [passwordClassName, setPasswordClassName] = useState('');
    const [errormsg, setErrormsg] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!valid) {
            setErrormsg('Password must be over 6 characters with a number OR special character.')
        }
        else {

            const data = {
                curPassword: curPassword,
                newPassword: newPassword,
            }

            if (newPassword == confirmPassword) {

                try {
                    const response = await fetch('https://jdfban.pythonanywhere.com/api/reset_password/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + String(authTokens.access),
                        },
                        body: JSON.stringify(data),
                    });
                    if (response.ok) {
                    toast.success('Password reset successful!', { position: toast.POSITION.TOP_CENTER });
                    const data = await response.json();
                    console.log(data)
                    show(false)
                    } else {
                    const data = await response.json();
                    throw new Error(data.detail);
                    }
                } catch (error) {
                    console.error('Error occured: ', error);
                    toast.error('Incorrect Password.', { position: toast.POSITION.TOP_CENTER });
                    setCurPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                }
                } else {
                    toast.error('Passwords do not match.', { position: toast.POSITION.TOP_CENTER });
                }
            }
        }

    return (
      <>
        <Card className='passwordreset'>
            <Card.Body>
                <h2 className='text-center mb-4'>Change Password</h2>
                <Form onSubmit={handleSubmit}>
                <Form.Group className='resetgroups' id="current-password">
                    <Form.Label>Current Password:</Form.Label>
                    <Form.Control type="password" required value={curPassword} onChange={(e) => setCurPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className='resetgroups' id="new-password">
                    <Form.Label>New Password:</Form.Label>
                    <Form.Control className={passwordClassName} type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </Form.Group>
                <p className='pwdmsg'>{errormsg}</p>
                <Form.Group className='resetgroups' id="repeat-password">
                    <Form.Label>Confirim New Password:</Form.Label>
                    <Form.Control type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </Form.Group>
                <Button className='w-100' type="submit">Reset</Button>
                </Form>
            </Card.Body>
        </Card>

      </>
    )
  }

export default ResetPassword