import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Welcome from '../components/Welcome';
import Features from '../components/Features';
import Contact from '../components/Contact';

import { useState } from 'react';

const LoggedOutHome = () => {

  const [curtab, setCurtab] = useState(1)
  const [navopen, setNavopen] = useState(false)

  return (
    <div>
      <div className='lonav'>
        <div className='tablogo'>
          <div className='lobsterfont stlogo'>ServiceTrackr</div>
        </div>
        <div className='tabs'>
          <div className={curtab === 1 ? 'curtab navtab' : 'nocurtab navtab'} onClick={() => setCurtab(1)}>
            Welcome
          </div>
          <div className={curtab === 2 ? 'curtab navtab' : 'nocurtab navtab'} onClick={() => setCurtab(2)}>
            Features
          </div>
        </div>
        <div className='tabbtns'>
          <Button variant="outline-primary">
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="outline-primary">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>

      <div className='mintabs'>

        <div className='mintabtop'>
          <div className='mintablogo'>
            <div className='lobsterfont stlogo'>ServiceTrackr</div>
          </div>
          <div onClick={navopen ? () => setNavopen(false) : () => setNavopen(true)} className='burger'>
            <div className='burgerline'></div>
            <div className='burgerline'></div>
            <div className='burgerline'></div>
          </div>
        </div>

        <ul className={navopen ? 'mintabbtm' : 'mintabbtm mintabclose'}>
          <li onClick={() => {
              setCurtab(1);
              setNavopen(false);
            }}
          >Welcome</li>
          <li onClick={() => {
            setCurtab(2)
            setNavopen(false)
          }}>Features</li>

          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul> 

      </div>

      {curtab === 1 && <Welcome />}
      {curtab === 2 && <Features />}

    </div>
  );
};

export default LoggedOutHome;
