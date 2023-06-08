import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Modal, Card, Form } from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Planner from '../components/Planner';


const Round = () => {

  const [customers, setCustomers] = useState([]);
  const { authTokens, logoutUser, profile } = useContext(AuthContext);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [show, setShow] = useState([])
  const [pages, setPages] = useState(0)

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showDelete, setShowDelete] = useState(false)

  const [newcust, setNewcust] = useState(false)


  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_customers/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        setShow(data.slice(page, perPage))
        setPages(
          Math.ceil(data.length / perPage) -1
        )
        console.log(data)
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handlePaymentMethodChange = (customerId, method) => {
    // Update the payment method using API or any desired logic
    console.log(`---------Customer ${customerId} payment method changed to ${method}`);
    setPaymentMethods((prevMethods) => ({
      ...prevMethods,
      [customerId]: method,
    }));
  };

  const handleSave = async (customerId) => {
    const paymentMethod = paymentMethods[customerId];
    console.log(`Customer ${customerId} payment method saved to ${paymentMethod}`);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/update_job/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
        body: JSON.stringify({ customerId, paymentMethod }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setCustomers(data);
        setPaymentMethods((prevMethods) => ({
          ...prevMethods,
          [customerId]: null,
        }));

      } else {
        logoutUser();
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

  const curItems = () => {
    if (page === 0) {
      setShow(customers.slice(page, perPage))
    } else {
      setShow(customers.slice((page*perPage), ((page*perPage) + perPage)))
    }
  }

  const showPrevious = () => {
    setPage(page-1)
  }

  const showNext = () => {
    setPage(page+1)
  }

  useEffect(() => {
    curItems();
  }, [page, customers]);

  const editCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
    console.log(customer)
    console.log(selectedCustomer)
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  }
  
  const deleteCustomer = (customer) => {
    console.log(customer)
    setSelectedCustomer(customer);
    setShowDelete(true)
  }

  const handleDelete = async (e) => {
    e.preventDefault()

    const customerId = selectedCustomer.id;

      const data = {
          customerId: customerId
      };

      try {
          const response = await fetch('http://127.0.0.1:8000/api/delete_customer/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + String(authTokens.access),
              },
              body: JSON.stringify(data),
          });
          if (response.ok) {
          toast.success('Customer deleted successfully!', { position: toast.POSITION.TOP_CENTER });
          const data = await response.json();

          console.log(data)
          setCustomers(data);
          setShowDelete(false)
          setSelectedCustomer(null);
          } else {
          const data = await response.json();
          throw new Error(data.detail);
          }
      } catch (error) {
          console.error('Error occured: ', error);
          toast.error('Error occured: ', error.message, { position: toast.POSITION.TOP_CENTER });
      }
  }

  const handleCloseDelete = () => {
    setShowDelete(false)
    setSelectedCustomer(null);
  }

  const [editAddress, setEditAddress] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editSchedule, setEditSchedule] = useState('')

  useEffect(() => {
    setEditAddress(selectedCustomer ? selectedCustomer.address : '')
    setEditPrice(selectedCustomer ? selectedCustomer.price : '')
    setEditDate(selectedCustomer ? selectedCustomer.due_date : '')
    setEditName(selectedCustomer && selectedCustomer.name ? selectedCustomer.name : '')
    setEditPhone(selectedCustomer && selectedCustomer.phone ? selectedCustomer.phone : '')
    setEditEmail(selectedCustomer && selectedCustomer.email ? selectedCustomer.email : '')
    setEditNotes(selectedCustomer && selectedCustomer.notes ? selectedCustomer.notes : '')
    setEditSchedule(selectedCustomer ? (selectedCustomer.schedule === 0) ? '' : selectedCustomer.schedule : '')

  }, [selectedCustomer])
  
  const handleEditSubmit = async (e) => {
      e.preventDefault()
      console.log('submitting....')

      const customerId = selectedCustomer.id;

      const data = {
          customerId: customerId,
          address: editAddress,
          price: editPrice,
          due_date: editDate,
          name: editName,
          phone: editPhone,
          email: editEmail,
          notes: editNotes,
          schedule: editSchedule,
      };

      try {
          const response = await fetch('http://127.0.0.1:8000/api/edit_customer/', {
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
          setShowModal(false)
          setCustomers(data);

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
    <div className='pagedivs'>
      <h1>Round: {profile.business_name}</h1>
      <div className='table-container'>
        <Table className='transactionsTable' bordered>
          <thead>
            <tr>
              <th>Address</th>
              <th>Price</th>
              <th>Due Date</th>
              <th>Payment Method</th>
              <th>Complete</th>
              <th>Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {show.map(customer => (
              <tr key={customer.id}>
                <td>{customer.address}</td>
                <td>{customer.price}</td>
                <td>{customer.due_date}</td>
                <td>
                  <select
                    value={paymentMethods[customer.id] || ''}
                    onChange={e =>
                      handlePaymentMethodChange(customer.id, e.target.value)
                    }
                  >
                    <option disabled value="">--- Select ---</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="cheque">Cheque</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </td>
                <td style={{textAlign: 'center'}}>
                  <Button className='b-ed' disabled={paymentMethods[customer.id] == null} onClick={(e) => handleSave(customer.id)}>Save</Button>
                </td>
                <td style={{display: 'flex', justifyContent: 'space-between'}}>
                  <Button onClick={() => editCustomer(customer)} className='btn-success b-ed'>Edit</Button>
                  <Button onClick={() => deleteCustomer(customer)} className='btn-danger b-ed'>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      
      
      <div className='page-buttons'>
        {page > 0 && <Button onClick={showPrevious}>Previous</Button>}
        {page < pages && <Button onClick={showNext}>Next</Button> }
      </div>

      <h2 className='lobsterfont'>Page: {page + 1}</h2>

      <Modal show={showModal}>
        {showModal && 
          <Card>
          <Card.Body>
              <h2 className='text-center mb-4'>Edit Customer</h2>
              <Form onSubmit={handleEditSubmit}>
              <Form.Group id="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text"  onChange={(e) => setEditName(e.target.value)} value={editName} />
              </Form.Group>
              <Form.Group id="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text"  onChange={(e) => setEditAddress(e.target.value)} value={editAddress} required />
              </Form.Group>
              <Form.Group id="price">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number"  onChange={(e) => setEditPrice(e.target.value)} value={editPrice} required />
              </Form.Group>
              <Form.Group id="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control type="date"  onChange={(e) => setEditDate(e.target.value)} value={editDate} required />
              </Form.Group>
              <Form.Group id="phone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="number"  onChange={(e) => setEditPhone(e.target.value)} value={editPhone} />
              </Form.Group>
              <Form.Group id="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email"  onChange={(e) => setEditEmail(e.target.value)} value={editEmail} />
              </Form.Group>
              <Form.Group id="notes">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control type="text"  onChange={(e) => setEditNotes(e.target.value)} value={editNotes} />
              </Form.Group>

              <Form.Group id="editSchedule">
                <Form.Label>Schedule (Leave blank to apply default scheduling)</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setEditSchedule(e.target.value)}
                  value={editSchedule}
                />
              </Form.Group>

              <Button className='w-100' type="submit">Save Changes</Button>
              </Form>
          </Card.Body>
          </Card>
        }
        <Button variant="danger m-auto" onClick={handleCloseModal}>
            Close
        </Button>
      </Modal>

      
      <Modal show={showDelete}>
          <Card>
            <Card.Body>
              <h5>Are you sure you want to delete?</h5>
              <Form onSubmit={handleDelete}>
                <p>Customer: {selectedCustomer && selectedCustomer.address}</p>
                <Button variant='success' className='w-50' type='submit'>Yes</Button>
                <Button variant='danger' className='w-50' onClick={handleCloseDelete}>Cancel</Button>
              </Form>
            </Card.Body>
          </Card>
        </Modal>

        <Card className='newcustybtn'>
          <Card.Body>
            <h1>New Customer?</h1>
            <Button variant='primary' onClick={() => {
              setNewcust(true)
            }}>Add New Customer</Button>
          </Card.Body>
        </Card>
        <Modal show={newcust}>
          <Planner close={setNewcust} update={getCustomers} />
        </Modal>

    </div>
  );
};

export default Round;