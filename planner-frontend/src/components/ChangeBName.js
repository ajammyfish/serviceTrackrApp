import { Form, Button, Card } from 'react-bootstrap'
import { useEffect, useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../context/AuthContext';

const ChangeBName = ({prof, setprof, show}) => {
    const { authTokens } = useContext(AuthContext);

    const [busName, setBusName] = useState(prof.business_name)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            business_name: busName,
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/change_business_name/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access),
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
            toast.success('Business Name Updated!', { position: toast.POSITION.TOP_CENTER });
            const data = await response.json();
            setprof(data.profile)
            localStorage.setItem('profile', JSON.stringify(data.profile))
            console.log(data)
            show(false)
            } else {
            const data = await response.json();
            throw new Error(data.detail);
            }
        } catch (error) {
            console.error('Error occured: ', error);
            toast.error('Error Occured. Please try again and contact support if error continues.', { position: toast.POSITION.TOP_CENTER });
        }
    }

    return (
    <div>
         <Card className='passwordreset'>
            <Card.Body>
                <h2 className='text-center mb-4'>Change Business Name</h2>
                <Form onSubmit={handleSubmit}>
                <Form.Group className='resetgroups' id="business-name">
                    <Form.Label>Business Name:</Form.Label>
                    <Form.Control type="text" required value={busName} onChange={(e) => setBusName(e.target.value)}/>
                </Form.Group>
                <Button className='w-100' type="submit">Save</Button>
                </Form>
            </Card.Body>
        </Card>
    </div>
  )
}

export default ChangeBName