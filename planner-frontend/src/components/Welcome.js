import Card from "react-bootstrap/esm/Card"

const Welcome = () => {
  return (
    <div className='tabcontent'>
        <Card className='welcomeContent'>
        <Card.Body>
          <h1>Welcome To ServiceTrackr</h1>
          <p>We're here to help you streamline your service business operations and 
            enhance your customer management. With our simple and intuitive 
            interface, managing your customers, work orders, and finances has never been 
            easier. Focus on what you do best, and let us handle the rest!</p>
          <div>
            <h3 className="lobsterfont" style={{textDecoration: 'underline'}}>Key Features</h3>
            <ul className="welcomefeatures">
              <li><span className="keyspan">Customer Management:</span> Keep track of all your customers in one place. Store contact information, service history, and notes for personalized interactions.</li>
              <li><span className="keyspan">Work Order Tracking:</span> Create, assign, and track work orders efficiently. Stay organized and ensure timely completion of tasks.</li>
              <li><span className="keyspan">Financial Management:</span> Gain control over your business finances. Track invoices, expenses, and payments for accurate financial reporting.</li>
              <li><span className="keyspan">Scheduling and Dispatch:</span> Simplify your scheduling process and assign jobs to your team members with ease. Stay on top of your service appointments.</li>
              <li><span className="keyspan">Analytics and Reports:</span> Access insightful analytics and generate reports to gain valuable insights into your business performance and make data-driven decisions.</li>
            </ul>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Welcome