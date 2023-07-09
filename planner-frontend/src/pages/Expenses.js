import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Expenses = () => {

  const { authTokens, logoutUser, profile } = useContext(AuthContext);

  const [expenseCategory, setExpenseCategory] = useState('')
  const [expenseName, setExpenseName] = useState('')
  const [expenseDate, setExpenseDate] = useState('')
  const [expenseCost, setExpenseCost] = useState('')

  const [allExpenses, setAllExpenses] = useState([])

  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = async () => {
    try {
      const response = await fetch('https://jdfban.pythonanywhere.com/api/get_expenses/', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
      },
      });

      if (response.ok) {
      const data = await response.json();
      console.log(data)
      setExpenses(data)
      setAllExpenses(data)
      } else {
      logoutUser();
      }
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
  };


  const handleNewExpense = async (e) => {
    e.preventDefault()
    

    const data = {
      date: expenseDate,
      expense_category: expenseCategory,
      expense_name: expenseName,
      cost: expenseCost,
    };

    try {
      const response = await fetch('https://jdfban.pythonanywhere.com/api/add_expense/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setExpenses(data)


        setExpenseCategory('')
        setExpenseName('')
        setExpenseDate('')
        setExpenseCost('')
      } else {
        logoutUser();
      }
    } catch(error) {
      console.error('Error fetching expenses:', error)
    }
  }

  let [totalExpenses, setTotalExpenses] = useState(0)
  useEffect(() => {
    let total = 0;
  
    expenses.forEach((expense) => {
      total += expense.cost;
    });
  
    setTotalExpenses(total);
  }, [expenses]);

  useEffect(() => {
    console.log(expenses)
  }, [expenses])


  const calculateChartData = (expenses) => {
    let vehicle_total = 0;
    let fuel_total = 0;
    let water_total = 0;
    let bus_total = 0;
    let other_total = 0;
  
    expenses.forEach((expense) => {
      if (expense.expense_category === 'Vehicle Costs') {
        vehicle_total += expense.cost;
      } else if (expense.expense_category === 'Fuel') {
        fuel_total += expense.cost;
      } else if (expense.expense_category === 'Water') {
        water_total += expense.cost;
      } else if (expense.expense_category === 'Business Equipment') {
        bus_total += expense.cost;
      } else if (expense.expense_category === 'Other...') {
        other_total += expense.cost;
      }
    });

      return {
        labels: ['Vehicle Costs', 'Fuel', 'Water', 'Business Equipment', 'Other...'],
        datasets: [
          {
            label: 'Total Costs (£)',
            data: [vehicle_total, fuel_total, water_total, bus_total, other_total],
            backgroundColor: [
              'rgba(255, 99, 132, 0.4)',
              'rgba(54, 162, 235, 0.4)',
              'rgba(255, 206, 86, 0.4)',
              'rgba(199, 144, 199, 0.4)',
              'rgba(155, 200, 22, 0.4)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(199, 144, 199, 1)',
              'rgba(155, 200, 22, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
  }

  const chartData = calculateChartData(expenses)

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Total Expenses: £${totalExpenses}`,
      },
    },
  };

  const applyFilters = (event) => {
    event.preventDefault()
    let filteredResults = allExpenses;

    if (startDate) {
      filteredResults = filteredResults.filter((item) => item.date >= startDate);
    }
  
    // Apply the end date filter
    if (endDate) {
      filteredResults = filteredResults.filter((item) => item.date <= endDate);
    }

    const updatedChartData = calculateChartData(filteredResults);
    setFilteredData(filteredResults);

    console.log(filteredData)
    setExpenses(filteredResults)
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };


  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [filteredExpenses, setFilteredExpenses] = useState([])


  return (
    <div className="pagedivs">
        <h1>Expenses</h1>

        <div className='expenses-container'>
          <Bar className='expenses-chart' options={options} data={chartData} />
        </div>

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

          <Button className='filterbtn' variant="primary" type="submit">
            Apply Filters
          </Button>
        </Form>

        <Card className='expenses-card'>
            <Card.Body>
              <h5>Add a new expense</h5>
              <Form onSubmit={handleNewExpense}>
                <Form.Group id="expense_category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select 
                        value={expenseCategory === '' ? '' : expenseCategory}
                        onChange={e => setExpenseCategory(e.target.value)
                        }
                    >
                        <option value='' disabled>---Select Options---</option>
                        <option value="fuel">Fuel</option>
                        <option value="business_equipment">Business Equipment</option>
                        <option value="water">Water</option>
                        <option value="vehicle_costs">Vehicle Expenditure</option>
                        <option value="other">Other</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group id="expense_name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text"
                     value={expenseName === '' ? '' : expenseName}
                     onChange={e => setExpenseName(e.target.value)
                     }
                     />
                </Form.Group>
                <Form.Group id="cost">
                    <Form.Label>Cost</Form.Label>
                    <Form.Control type="number" 
                    value={expenseCost === '' ? '' : expenseCost}
                    onChange={e => setExpenseCost(e.target.value)
                    }
                    />
                </Form.Group>
                <Form.Group id="expense_name">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" 
                    value={expenseDate === '' ? '' : expenseDate}
                    onChange={e => setExpenseDate(e.target.value)
                    }
                    />
                </Form.Group>
                <Button variant='primary' type='submit' onClick={handleNewExpense}>Save</Button>
              </Form>
            </Card.Body>
          </Card>
          {expenses.length !== 0 &&
          <div className='table-container'>
            <Table bordered hover
                style={{'textAlign': 'center'}}
                className='transactionsTable'
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Cost</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>
                    <td>{expense.expense_category}</td>
                    <td>{expense.expense_name}</td>
                    <td>{expense.cost}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          }

    </div>
  )
}

export default Expenses