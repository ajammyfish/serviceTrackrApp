import 'bootstrap/dist/css/bootstrap.min.css'
import LoginForm from '../components/LoginForm'
import { Container } from 'react-bootstrap'
import { BsFillArrowLeftSquareFill } from "react-icons/bs"
import { Link } from 'react-router-dom'

const Login = () => {

  return (
      <div className='logReg'>
        <h1><Link to="/"><BsFillArrowLeftSquareFill style={{color: 'white'}} /></Link></h1>
        <Container>
          <LoginForm />
        </Container>
      </div>
  )
}

export default Login