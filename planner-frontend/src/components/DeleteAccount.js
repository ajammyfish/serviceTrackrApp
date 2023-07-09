import { Form, Button, Card } from 'react-bootstrap'
import { useEffect, useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';


const DeleteAccount = ({show}) => {
    const { authTokens, logoutUser } = useContext(AuthContext);

    const [del, setDel] = useState('')

    useEffect(() => {
        if (del.length === 0) {
            setPasswordClassName('')
            setValid(false)
        }
        else if (del !== 'delete') {
          setPasswordClassName('pwd')
          setValid(false)
        }
        else {
          setPasswordClassName('pwdvalid')
          setValid(true)
        }
    }, [del])

    const [valid, setValid] = useState(false)
    const [passwordClassName, setPasswordClassName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (valid) {
            try {
                const response = await fetch('https://jdfban.pythonanywhere.com/api/delete_account/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + String(authTokens.access),
                    },
                });
                if (response.ok) {
                toast.success('Account Deleted.', { position: toast.POSITION.TOP_CENTER });
                const data = await response.json();
                logoutUser()
                console.log(data)
                show(false)
                } else {
                const data = await response.json();
                throw new Error(data.detail);
                }
            } catch (error) {
                console.error('Error occured: ', error);
                toast.error('Error Occured. Please try again and contact support if error continues.', { position: toast.POSITION.TOP_CENTER });
                setDel('')
            }
        }
    }
    
    return (
      <>
        <Card className='passwordreset'>
            <Card.Body>
                <h2 className='text-center mb-4'>Delete Account</h2>
                <Form onSubmit={handleSubmit}>
                <Form.Group className='resetgroups' id="current-password">
                    <Form.Label>Type 'delete' and press confirm to permanently delete your account.</Form.Label>
                    <Form.Control className={passwordClassName} type="text" required value={del} onChange={(e) => setDel(e.target.value)}/>
                </Form.Group>
                <Button className='w-100' type="submit">Delete</Button>
                </Form>
            </Card.Body>
        </Card>

      </>
    )
}

export default DeleteAccount