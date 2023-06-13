import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


const localizer = momentLocalizer(moment)

const Worksheet = () => {

  const { authTokens, logoutUser, profile } = useContext(AuthContext);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState('')

  useEffect(() => {
    getWorksheet()
  }, [])

  useEffect(() => {
    setEvents(customers.map(customer => ({
      title: customer.address + ': £' + customer.price,
      start: new Date(moment(customer.worksheet_date).startOf('day')),
      end: new Date(moment(customer.worksheet_date).startOf('day')),
      resourceId: customer.id,
    })))
    setSelectedEvent(null)
    setSelectedCustomer('')
    setSelectedDate('')
    setPaymentMethods({})
    console.log(events)
  }, [customers])

  const getWorksheet = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_worksheet/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
        console.log(data)
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    console.log('Event clicked:', event.resourceId);
    const custy = customers.find((customer) => customer.id === event.resourceId)
    console.log(custy)
    setSelectedCustomer(custy)
    setSelectedDate(custy.worksheet_date)
  };

  const handleSlotSelect = (date) => {
    // Perform any action you want when a slot is selected (e.g., create a new event, open a form, etc.)
    const eventsOnDay = events.filter((event) =>
      moment(event.start).isSame(date, 'day')
    );
    console.log(eventsOnDay);
  };

  const view = {
    month: true,
    week: true,
    day: true,
    agenda: true
  }
  const defaultView = Views.WEEK;


  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setSelectedDate('')
    setPaymentMethods({})
  };

  useEffect(() => {
    setSelectedDate(selectedCustomer.worksheet_date)
    console.log(selectedCustomer)
    console.log(selectedDate)
  }, [selectedCustomer])

  const [paymentMethods, setPaymentMethods] = useState({});

  const [selectedDate, setSelectedDate] = useState('')

  const handlePaymentMethodChange = (customerId, method) => {
    // Update the payment method using API or any desired logic
    console.log(`---------Customer ${customerId} payment method changed to ${method}`);
    setPaymentMethods((prevMethods) => ({
      ...prevMethods,
      [customerId]: method,
    }));
  };

  const handleDateChanged = async (e) => {
    e.preventDefault()
    console.log(selectedDate)

    const data = {
      customerId: selectedCustomer.id,
      worksheetDate: selectedDate,
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/change_worksheet_date/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
        toast.success('Date Changed Successfully!', { position: toast.POSITION.TOP_CENTER });
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

  const handleSavePayment = async (e) => {
    e.preventDefault()
    console.log(paymentMethods[selectedCustomer.id])

    const data = {
      customerId: selectedCustomer.id,
      paymentMethod: paymentMethods[selectedCustomer.id],
      worksheetDate: selectedDate,
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/update_worksheet_job/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
        toast.success('Job Complete!', { position: toast.POSITION.TOP_CENTER });
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

  const handleRemoveEvent = async () => {
    console.log(selectedCustomer.id)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/delete_worksheet_job/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access),
          },
          body: JSON.stringify({customerId: selectedCustomer.id}),
      });
      if (response.ok) {
      toast.success('Job Removed from planner.', { position: toast.POSITION.TOP_CENTER });
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
    <div className="pagedivs">
      <Calendar
        messages={{agenda: 'Worksheets'}}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={events}
        defaultView={defaultView}
        views={view}
        selectable={true} // Enable selection of slots
        onSelectEvent={handleEventClick} // Event click handler
        onSelectSlot={(slotInfo) => handleSlotSelect(slotInfo.start)} // Slot select handler
      />

      {selectedEvent && (
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCustomer.address}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{textAlign: 'center'}}>
          {/* Render customer details here */}
          {selectedCustomer.name !== null && <p>Customer Name: {selectedCustomer.name}</p>}
          <p>Customer Address: {selectedCustomer.address}</p>
          <p>Price: {selectedCustomer.price}</p>
          {selectedCustomer.notes !== '' && <p>Notes: {selectedCustomer.notes}</p>}

          <Form style={{textAlign: 'center', marginBottom: '15px'}} onSubmit={handleDateChanged}>
            <Form.Group style={{marginBottom: '10px'}} id="date">
                <Form.Label>Date</Form.Label>
                <Form.Control type="date"  onChange={e => setSelectedDate(e.target.value)} value={selectedDate || ''} />
            </Form.Group>
            <Button type="submit">Save Date Change</Button>
          </Form>

          <Form style={{textAlign: 'center', marginBottom: '15px'}} onSubmit={handleSavePayment}>
            <Form.Group style={{marginBottom: '10px'}} controlId="payment">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                value={paymentMethods[selectedCustomer.id] || ''}
                onChange={e => handlePaymentMethodChange(selectedCustomer.id, e.target.value)}
              >
                <option disabled value="">--- Select ---</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="cheque">Cheque</option>
                <option value="unpaid">Unpaid</option>
              </Form.Control>
            </Form.Group>
            <Button disabled={!paymentMethods[selectedCustomer.id]} className='w-100' variant='success' type="submit">Complete</Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className='plannermf'>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleRemoveEvent}>Remove from planner</Button>
        </Modal.Footer>
      </Modal>
      )}
    </div>
  );
};

export default Worksheet