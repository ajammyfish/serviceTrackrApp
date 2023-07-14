import { motion } from "framer-motion"
import Typewriter from 'typewriter-effect';

const Welcome = () => {
  return (
    <div className='tabcontent'>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="welcome-top">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h1><span className="lobsterfont">ServiceTrackr</span></h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <h2>
              <Typewriter
                options={{
                  strings: ['...Customer Management', '...Work order tracking', '...Financial management', '...Scheduling and Organising'],
                  autoStart: true,
                  loop: true,
                }}
              />
              </h2>
            </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
      <div className='welcome-content'>
          <h2 style={{fontWeight: 'bold'}}>An app for service business owners.</h2>
      </div>
      </motion.div>

      <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
          <div className="cube-container">
            <div className="cube-face front">
              <h3>Customer Tracking & Scheduling</h3>
            </div>
            <div className="cube-face back">
              <h3>Financial Management</h3>
            </div>
            <div className="cube-face right">
              <h3>Route Optimisation</h3>
            </div>
            <div className="cube-face left">
              <h3>Powerful Data Analytics</h3>
            </div>
            <div className="cube-face top">
            </div>
            <div className="cube-face bottom">
            </div>
        </div>
          </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
      <div className="welcome-info">
        <div className="info1">
          <p>
            Welcome to <b style={{color: '#0066ff', textDecoration: 'underline'}}>ServiceTrackr</b>, the all-in-one business management tool for service business owners.
          </p>
          <p>
            Being the owner of an Exterior Cleaning Business myself, I noticed the 
            lack of reasonably priced, straightforward, functional software on the market, 
            which is what lead me to developing ServiceTrackr.
          </p>
          <p>
            My aim was to create the type of app that I myself would like to use, and that meant keeping it simple, 
            easy to use, and including all the functionalities I need to manage my business. 
          </p>
        </div>
        <div className="info2">
          <ul>
            <li>
              <span className="info2span">Customer Management:</span><br />
            </li>
            <li>
              <span className="info2span">Financial Tracking:</span><br />
            </li>
            <li>
              <span className="info2span">Data Analytics:</span><br />
            </li>
            <li>
              <span className="info2span">Route Optimisation:</span><br />
            </li>
          </ul>
        </div>
      </div>
      </motion.div>

      




    </div>
  )
}

export default Welcome