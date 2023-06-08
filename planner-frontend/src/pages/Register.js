import 'bootstrap/dist/css/bootstrap.min.css'
import RegForm from '../components/RegForm'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { BsFillArrowLeftSquareFill } from "react-icons/bs"

const Register = () => {

  return (
    <div className='logReg'>
      <h1><Link to="/"><BsFillArrowLeftSquareFill style={{color: 'white'}} /></Link></h1>
      <Container>
        <RegForm />
      </Container>
      </div>
  )
}

export default Register