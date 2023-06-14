import { motion } from "framer-motion"

const Pricing = () => {
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
              <h1>How much does it cost?</h1>
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
            <p>Because the app is still in early development, there is no current charge. In the 
              future, we plan on keeping the basic features free, whilst charging a small fee for more 
              advanced features.
            </p>
          </div>
      </div>
      </motion.div>
    </div>
  )
}

export default Pricing