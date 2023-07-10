import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Form, Button, Card, InputGroup } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import CsvLayout from '../imgs/csvlayout.png'

function FileUpload({close, refresh, resetPage}) {
    const { authTokens, logoutUser, profile } = useContext(AuthContext);

    const [file, setFile] = useState(null);

    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData(); 
        formData.append('file', file);

        try {
            const response = await fetch('https://jdfban.pythonanywhere.com/api/upload_customers/', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + String(authTokens.access),
                },
                body: formData,
            });
            if (response.ok) {
            const data = await response.json();
    
            toast.success('Customers added successfully!', { position: toast.POSITION.TOP_CENTER });
            refresh()
            resetPage(0)

            } else {
            const data = await response.json();
            throw new Error(data.detail);
            }
        } catch (error) {
            console.error('Error occured: ', error);
            toast.error('Error occured with upload: ', error.message, { position: toast.POSITION.TOP_CENTER });

        }
        setFile(null)
        close(false)
    };

    return (
        <div>
            <Card className='upload_customers_card new-custy m-auto' style={{border: 'none'}} >
                <Card.Body className='upload_customers_body'>
                    <h2 className='text-center mb-4'>Upload your customers via CSV file:</h2>
                    <div className='upload-img-container'>
                        <img src={CsvLayout} alt='Layout CSV' />
                    </div>
                    <div className='upload-inputs'>
                        <input className='file-upload' type="file" onChange={onFileChange} />
                        <Button disabled={file == null} onClick={onFileUpload}>Upload!</Button>
                    </div>
                </Card.Body>
                <Button className='w-50 m-auto mb-5' variant='danger' onClick={() => close(false)}>Close</Button>
            </Card>
        </div>
    );
}

export default FileUpload;
