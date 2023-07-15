import { motion } from "framer-motion"
import Setup from '../imgs/screenshots/setupcomplete.png'
import Upload from '../imgs/screenshots/uploadcsv.png'
import NewCustomer from '../imgs/screenshots/newcustomerfilled.png'
import Customers from '../imgs/screenshots/customerpayment.png'
import Details from '../imgs/screenshots/customerdetails.png'
import AddPlanner from '../imgs/screenshots/addplanner.png'
import PlannerDay from '../imgs/screenshots/plannerday.png'
import PlannerExpand from '../imgs/screenshots/plannerexpand.png'
import Payments from '../imgs/screenshots/paymenthistory.png'
import Payments2 from '../imgs/screenshots/paymenthistory2.png'
import ExpenseTable from '../imgs/screenshots/expensetable.png'
import ExpenseChart from '../imgs/screenshots/expensechart.png'
import Debts from '../imgs/screenshots/debts.png'
import Download from '../imgs/screenshots/donwloadtable.png'

const Features = () => {
  return (
    <div className='tabcontent'>


        <div className="features-headers">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <h1>What can you do with ServiceTrackr?</h1>
          </motion.div>
        </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <div className="welcome-features">
          <div className="features-card">
            <li>Set up your account with your business information</li>
            <img src={Setup}></img>
          </div>
          <div className="features-card">
            <li>Add/import customers to your round</li>
            <img src={Upload}></img>
            <img src={NewCustomer}></img>
          </div>
          <div className="features-card">
            <li>Download customer base via PDF</li>
            <img src={Download}></img>
          </div>
          <div className="features-card">
            <li>View a date-ordered table of customers, with the ability to edit, delete, or mark work as complete</li>
            <img src={Customers}></img>
            <img src={Details}></img>
          </div>
          <div className="features-card">
            <li>Select a date and customer to add to your planner, to build a worksheet</li>
            <img src={AddPlanner}></img>
            <img src={PlannerDay}></img>
            <img src={PlannerExpand}></img>
          </div>
          <div className="features-card">
            <li>View entire payment history and full financial breakdown</li>
            <img src={Payments}></img>
          </div>
          <div className="features-card">
            <li>Track expenses and view a full breakdown</li>
            <img src={ExpenseTable}></img>
            <img src={ExpenseChart}></img>
          </div>
          <div className="features-card">
            <li>Track unpaid customers and update their payment methods</li>
            <img src={Debts}></img>
          </div>
          <div className="features-card">
            <li>Plan routes using route optimisation technology</li>
          </div>
          <div className="features-card">
            <li>View powerful business data via the dashboard</li>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Features