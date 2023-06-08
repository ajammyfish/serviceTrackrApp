import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import BuildProfile from '../components/BuildProfile'

ChartJS.register(ArcElement, Tooltip, Legend);

const Finance = () => {

  const { authTokens, logoutUser, profile } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState(null)

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterPayments, setFilterPayments] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [show, setShow] = useState([])
  const [pages, setPages] = useState(0)


  useEffect(() => {
      getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/history/', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
      },
      });

      if (response.ok) {
      const data = await response.json();
      const paidData = data.filter((item) => item.payment_method !== 'unpaid')

      setChartData(calculateChartData(paidData))
      setHistory(paidData)
      setFilteredData(paidData);

      setShow(paidData.slice(page, perPage))
      setPages(
        Math.ceil(paidData.length / perPage) -1
      )
      console.log(data)
      } else {
      logoutUser();
      }
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
  };

  const calculateChartData = (filteredResults) => {
    let cashTotal = 0;
    let cardTotal = 0;
    let chequeTotal = 0;
  
    filteredResults.forEach((payment) => {
      if (payment.payment_method === 'cash') {
        cashTotal += payment.payment_amount;
      } else if (payment.payment_method === 'card') {
        cardTotal += payment.payment_amount;
      } else if (payment.payment_method === 'cheque') {
        chequeTotal += payment.payment_amount;
      }
    });
  
    return {
      labels: ['Cash', 'Card', 'Cheque'],
      datasets: [
        {
          label: 'Total Earnings (£)',
          data: [cashTotal, cardTotal, chequeTotal],
          backgroundColor: [
            'rgba(255, 99, 132, 0.4)',
            'rgba(54, 162, 235, 0.4)',
            'rgba(255, 206, 86, 0.4)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };
  

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  useEffect(() => {
    console.log(filterPayments);
  }, [filterPayments]);
  

  const handlePaymentMethodChange = (e) => {
    const selectedPaymentMethod = e.target.value;
    if (filterPayments.includes(selectedPaymentMethod)) {
      setFilterPayments((prevFilterPayments) =>
        prevFilterPayments.filter((method) => method !== selectedPaymentMethod)
      );
    } else {
      setFilterPayments((prevFilterPayments) => [...prevFilterPayments, selectedPaymentMethod]);
    }
  };
  
  

  const applyFilters = (event) => {
    event.preventDefault()
    let filteredResults = history;

    if (startDate) {
      filteredResults = filteredResults.filter((item) => item.date >= startDate);
    }
  
    // Apply the end date filter
    if (endDate) {
      filteredResults = filteredResults.filter((item) => item.date <= endDate);
    }
  
    // Apply the payment method filter
    if (filterPayments.length > 0) {
      filteredResults = filteredResults.filter((item) =>
        filterPayments.includes(item.payment_method)
      );
    }

    const updatedChartData = calculateChartData(filteredResults);
    setChartData(updatedChartData);

    console.log(filteredResults)
    setFilteredData(filteredResults);
    setPages(
      Math.ceil(filteredResults.length / perPage) -1
    )
    setPage(0)
  }

  const curItems = () => {
    if (page === 0) {
      setShow(filteredData.slice(page, perPage))
    } else {
      setShow(filteredData.slice((page*perPage), ((page*perPage) + perPage)))
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
  }, [page, filteredData]);

  if (!profile.is_account_setup) {
    return (
      <>
        <BuildProfile />
      </>
    )
  }

  return (
    <div className='pagedivs'>
        <h1>Your Financial Data</h1>

        <Form onSubmit={applyFilters} className="mb-3 paymentfilters col-10 rounded text-light">
          <div className='datepickers'>
            <Form.Group controlId="startDate" className="mr-3" style={{margin: '15px'}}>
              <Form.Label>Start Date:</Form.Label>
              <Form.Control type="date" value={startDate} onChange={handleStartDateChange} />
            </Form.Group>
            <Form.Group controlId="endDate" className="mr-3" style={{margin: '15px'}}>
              <Form.Label>End Date:</Form.Label>
              <Form.Control type="date" value={endDate} onChange={handleEndDateChange} />
            </Form.Group>
          </div>
          <Form.Group controlId="paymentMethod">
            <Form.Label>Payment Method:</Form.Label>
            <div className='pmethods'>
              <Form.Check
                inline
                label="Cash"
                type="checkbox"
                value="cash"
                checked={filterPayments.includes('cash')}
                onChange={handlePaymentMethodChange}
              />
              <Form.Check
                inline
                label="Card"
                type="checkbox"
                value="card"
                checked={filterPayments.includes('card')}
                onChange={handlePaymentMethodChange}
              />
              <Form.Check
                inline
                label="Cheque"
                type="checkbox"
                value="cheque"
                checked={filterPayments.includes('cheque')}
                onChange={handlePaymentMethodChange}
              />
            </div>
          </Form.Group>

          <Button className='filterbtn' variant="primary" type="submit">
            Apply Filters
          </Button>
        </Form>



        <div className='earningspie'>
          <h3>Total Earnings By Payment Method</h3>
        {chartData && <Pie data={chartData} />}
        </div>

        <div className='table-container'>
          <Table bordered hover
              style={{'textAlign': 'center'}}
              className='transactionsTable'
          >
          <thead>
            <tr>
              <th>Date</th>
              <th>Address</th>
              <th>Price</th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {show.map(customer => (
              <tr key={customer.id}>
                <td>{customer.date}</td>
                <td>{customer.customer.address}</td>
                <td>{customer.payment_amount}</td>
                <td>{customer.payment_method}</td>
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
    </div>
  )
}

export default Finance