import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import BuildProfile from '../components/BuildProfile';

const Debts = () => {
  const [unpaid, setUnpaid] = useState([]);
  const { authTokens, logoutUser, profile } = useContext(AuthContext);
  const [paymentMethods, setPaymentMethods] = useState({});

  const navigate = useNavigate()

  useEffect(() => {
    if (!profile.is_account_setup) {
      console.log('head to setup');
      navigate('/')
    }
  }, [])


  useEffect(() => {
    getUnpaid();
  }, []);

  const getUnpaid = async () => {
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
      const unpaidData = data.filter(customer => customer.payment_method === 'unpaid');
      setUnpaid(unpaidData)
      } else {
      logoutUser();
      }
  } catch (error) {
      console.error('Error fetching unpaid customers:', error);
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
      const response = await fetch('http://127.0.0.1:8000/api/unpaid/', {
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
        await getUnpaid()
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

  
  if (!profile.is_account_setup) {
    return (
      <>
        <BuildProfile />
      </>
    )
  }

  return (
    <div className='pagedivs'>
      <h1>Unpaid Transactions</h1>

      {unpaid.length === 0 ? (
        <h2>No unpaid customers to display</h2>
      ) : (

      <Table className='transactionsTable' striped bordered>
        <thead>
          <tr>
            <th>Address</th>
            <th>Price</th>
            <th>Date</th>
            <th>Complete</th>
          </tr>
        </thead>
        <tbody>
          {unpaid.map(customer => (
            <tr key={customer.id}>
              <td>{customer.customer.address}</td>
              <td>{customer.payment_amount}</td>
              <td>{customer.date}</td>
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
                </select>
              </td>
              <td>
                <Button disabled={paymentMethods[customer.id] == null} onClick={(e) => handleSave(customer.id)}>Save</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
    </div>
  );
};
export default Debts