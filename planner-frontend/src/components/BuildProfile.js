import { Form, Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRef, useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'

const BuildProfile = () => {

  let { setProfile, authTokens } = useContext(AuthContext);

  const nameRef = useRef();

  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [schedule, setSchedule] = useState('');

  useEffect(() => {
    nameRef.current.focus();
  }, [])


  const handleSetup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/api/activate/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
        },
        body: JSON.stringify({name, business, schedule}),
      });
      if (response.ok) {
        toast.success('Account setup successful!', { position: toast.POSITION.TOP_CENTER });
        const data = await response.json();

        console.log(data)
        setProfile(data.profile)
        localStorage.setItem('profile', JSON.stringify(data.profile))

        setName('')
        setBusiness('')
        setSchedule('')

      } else {
        setName('')
        setBusiness('')
        setSchedule('')
        const data = await response.json();
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error('Error occured: ', error);
      toast.error('Error occured: ', error.message, { position: toast.POSITION.TOP_CENTER });
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Set Up Your Account!</h2>
          <Form onSubmit={handleSetup}>
            <Form.Group id="name">
              <Form.Label>Business Name</Form.Label>
              <Form.Control type="text" ref={nameRef} onChange={(e) => setName(e.target.value)} value={name} required />
            </Form.Group>
            <Form.Group id="business">
              <Form.Label>Business Industry</Form.Label>
              <Form.Control type="text" onChange={(e) => setBusiness(e.target.value)} value={business} required />
            </Form.Group>
            <Form.Group id="schedule">
              <Form.Label>Default Scheduling(weeks)</Form.Label>
              <Form.Control type="number" onChange={(e) => setSchedule(e.target.value)} value={schedule} required />
            </Form.Group>
            <Button className='w-100' type="submit">Save Setup!</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default BuildProfile