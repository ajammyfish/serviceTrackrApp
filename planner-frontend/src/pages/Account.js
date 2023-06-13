import ResetPassword from "../components/ResetPassword"
import DeleteAccount from "../components/DeleteAccount";
import ChangeBName from "../components/ChangeBName";
import ChangeBType from "../components/ChangeBType";
import ChangeSchedule from "../components/ChangeSchedule";

import { Modal, Button } from 'react-bootstrap';
import { useState, useContext, useEffect } from 'react'

import AuthContext from '../context/AuthContext';

const Account = () => {
  const { profile, setProfile } = useContext(AuthContext);



  const [showReset, setShowReset] = useState(false)
  const [showAccountDelete, setShowAccountDelete] = useState(false)
  const [showName, setShowName] = useState(false)
  const [showType, setShowType] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)

  useEffect(() => {
    console.log(profile)
  }, [])

  return (
    <div className='pagedivs'>
      <h1 className="actset">
        Account Settings
      </h1>

      <div className="business-settings">
        <p>Business Name: {profile.business_name}</p>
        <Button variant="success" onClick={() => setShowName(true)}>Change</Button>
      </div>
      <div className="business-settings">
        <p>Business Type: {profile.business_type}</p>
        <Button variant="success" onClick={() => setShowType(true)}>Change</Button>
      </div>
      <div className="business-settings">
        <p>Round Schedule: {profile.round_schedule} weeks</p>
        <Button variant="success" onClick={() => setShowSchedule(true)}>Change</Button>
      </div>

      <div className="reset-delete">
        <Button onClick={() => setShowReset(true)}>Reset Password</Button>
        <Button variant="danger" onClick={() => setShowAccountDelete(true)}>Delete Account</Button>
      </div>
     
      <Modal show={showReset}>
        <ResetPassword show={setShowReset} />
        <Button className="w-50 m-auto my-1" variant="danger" onClick={() => setShowReset(false)}>Close</Button>
      </Modal>

      <Modal show={showAccountDelete}>
        <DeleteAccount show={setShowAccountDelete} />
        <Button className="w-50 m-auto my-1" variant="danger" onClick={() => setShowAccountDelete(false)}>Close</Button>
      </Modal>

      <Modal show={showName}>
        <ChangeBName show={setShowName} prof={profile} setprof={setProfile} />
        <Button className="w-50 m-auto my-1" variant="danger" onClick={() => setShowName(false)}>Close</Button>
      </Modal>
      <Modal show={showType}>
        <ChangeBType show={setShowType} prof={profile} setprof={setProfile} />
        <Button className="w-50 m-auto my-1" variant="danger" onClick={() => setShowType(false)}>Close</Button>
      </Modal>
      <Modal show={showSchedule}>
        <ChangeSchedule show={setShowSchedule} prof={profile} setprof={setProfile} />
        <Button className="w-50 m-auto my-1" variant="danger" onClick={() => setShowSchedule(false)}>Close</Button>
      </Modal>


    </div>
  )
}

export default Account