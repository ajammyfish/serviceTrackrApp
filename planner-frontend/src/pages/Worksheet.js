import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const localizer = momentLocalizer(moment)

const Worksheet = () => {

  const { authTokens, logoutUser, profile } = useContext(AuthContext);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    getWorksheet()
  }, [])

  useEffect(() => {
    setEvents(customers.map(customer => ({
      title: customer.address,
      start: new Date(moment(customer.worksheet_date).format('YYYY-MM-DD')),
      end: new Date(moment(customer.worksheet_date).format('YYYY-MM-DD')),
      resourceId: customer.id,
    })))
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

  const formats = {
    dayFormat: 'dddd',
    dayHeaderFormat: (date, culture, localizer) =>
      localizer.format(date, 'dddd', culture), // Display only the day name in the header
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the selected event in state
    // Perform any action you want when an event is clicked (e.g., show details, open modal, etc.)
    console.log('Event clicked:', event);
  };

  const handleSlotSelect = (slotInfo) => {
    // Perform any action you want when a slot is selected (e.g., create a new event, open a form, etc.)
    console.log('Slot selected:', slotInfo);
  };

  return (
    <div className="pagedivs">
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={events}
        formats={formats}
        selectable={true} // Enable selection of slots
        onSelectEvent={handleEventClick} // Event click handler
        onSelectSlot={handleSlotSelect} // Slot select handler
        style={{ height: 500, width: 'fit-content', margin: 'auto', backgroundColor: 'white' }}
      />

      {selectedEvent && (
        <div>
          <h2>Selected Event:</h2>
          <p>Title: {selectedEvent.title}</p>
          {/* Render additional event details or actions */}
        </div>
      )}
    </div>
  );
};

export default Worksheet