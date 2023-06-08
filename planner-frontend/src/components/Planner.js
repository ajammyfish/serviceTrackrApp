import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'

import { Form, Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Planner = ( {update, close} ) => {

  let { authTokens } = useContext(AuthContext)

  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [due_date, setDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
        address: address,
        price: price,
        due_date: due_date,
        name: name,
        email: email,
        phone: phone,
        notes: notes,
        schedule: schedule,
    };

    console.log(address, price, due_date);

    try {
        const response = await fetch('http://127.0.0.1:8000/api/new_customer/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          toast.success('Customer saved successfully!', { position: toast.POSITION.TOP_CENTER });
          const data = await response.json();

          console.log(data)
  
          setAddress('')
          setPrice('')
          setDate('')
          setName('')
          setEmail('')
          setPhone('')
          setNotes('')
          setSchedule('')

          update()
        } else {
          const data = await response.json();
          throw new Error(data.detail);
        }
      } catch (error) {
        console.error('Error occured: ', error);
        toast.error('Error occured: ', error.message, { position: toast.POSITION.TOP_CENTER });
      }
  }

  return (
    <div>
      <Card style={{border: 'none'}} className='new-custy m-auto'>
        <Card.Body>
          <h2 className='text-center mb-4 lobsterfont'>Add New Customer</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="name">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" onChange={(e) => setName(e.target.value)} value={name} />
            </Form.Group>
            <Form.Group id="address">
              <Form.Label>Address:</Form.Label>
              <Form.Control type="text" onChange={(e) => setAddress(e.target.value)} value={address} required />
            </Form.Group>
            <Form.Group id="price">
              <Form.Label>Price:</Form.Label>
              <Form.Control type="number" onChange={(e) => setPrice(e.target.value)} value={price} required />
            </Form.Group>
            <Form.Group id="date">
              <Form.Label>Due date:</Form.Label>
              <Form.Control type="date" onChange={(e) => setDate(e.target.value)} value={due_date} required />
            </Form.Group>
            <Form.Group id="email">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="text" onChange={(e) => setEmail(e.target.value)} value={email} />
            </Form.Group>
            <Form.Group id="phone">
              <Form.Label>Phone:</Form.Label>
              <Form.Control type="number" onChange={(e) => setPhone(e.target.value)} value={phone} />
            </Form.Group>
            <Form.Group id="notes">
              <Form.Label>Notes:</Form.Label>
              <Form.Control type="text" onChange={(e) => setNotes(e.target.value)} value={notes} />
            </Form.Group>

            <Form.Group id="editSchedule">
                <Form.Label>Schedule (Leave blank to apply default scheduling)</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setSchedule(e.target.value)}
                  value={schedule}
                />
              </Form.Group>

            <Button style={{marginTop: '10px'}}  className='w-100' type="submit">Save!</Button>
            <Button style={{marginTop: '10px'}} className='w-100' variant='danger' onClick={() => close(false)}>Close</Button>
          </Form>
        </Card.Body>
      </Card>

    </div>
  )
}

export default Planner