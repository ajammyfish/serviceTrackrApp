import { motion } from "framer-motion"

const Features = () => {
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
              <h1>What can you do with ServiceTrackr?</h1>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
      <div className='welcome-content'>
          <div>
            <ul className="welcome-features">
              <h4 style={{fontWeight: 'bold', textAlign: 'center'}}>The current features of ServiceTrackr are as follows:</h4>
              <li>Set up your business account with a round name and default scheduling</li>
              <li>Add customers to your round with detailed information</li>
              <li>View all customers via the customer page</li>
              <li>Select a date and customer to add to your planner, to build a worksheet</li>
              <li>Mark customers as complete and save payment method once work is carried out</li>
              <li>View entire payment history and financial breakdown</li>
              <li>View debts</li>
              <p className="my-5">More features are coming soon, as the app is still in early development.</p>

            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
          <p>We've purposely made the user experience as straight forward and simple as possible, 
            so you don't have to waste any time learning or getting used to the functionality!
          </p>
          </motion.div>
      </div>
      </motion.div>
    </div>
  )
}

export default Features