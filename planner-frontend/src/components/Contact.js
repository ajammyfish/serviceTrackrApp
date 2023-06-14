import { motion } from "framer-motion"

const Contact = () => {
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
              <h1>Get in touch</h1>
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
            <p>servicetrackrapp@gmail.com</p>
            <p>07990685250</p>
          </div>
      </div>
      </motion.div>
    </div>
  )
}

export default Contact