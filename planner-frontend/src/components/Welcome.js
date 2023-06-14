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
          <div className="welcome-headers">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h1>Welcome To <span className="lobsterfont">ServiceTrackr</span></h1>
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
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
      <div className='welcome-content'>
          <p>We're here to help you streamline your service business operations and 
            enhance your customer management. With our simple and intuitive 
            interface, managing your customers, work orders, and finances has never been 
            easier. Focus on what you do best, and let us handle the rest!</p>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
          <div>
            <h3 style={{textDecoration: 'underline'}}>Key Features</h3>
            <ul className="welcome-features">
              <li><span className="keyspan">Customer Management:</span> Keep track of all your customers in one place. Store contact information, service history, and notes for personalized interactions.</li>
              <li><span className="keyspan">Work Order Tracking:</span> Create, assign, and track work orders efficiently. Stay organized and ensure timely completion of tasks.</li>
              <li><span className="keyspan">Financial Management:</span> Gain control over your business finances. Track invoices, expenses, and payments for accurate financial reporting.</li>
              <li><span className="keyspan">Scheduling and Planning:</span> Simplify your scheduling process and assign jobs to your planner with ease. Stay on top of your customer base.</li>
            </ul>
          </div>
          </motion.div>
      </div>
      </motion.div>
    </div>
  )
}

export default Welcome