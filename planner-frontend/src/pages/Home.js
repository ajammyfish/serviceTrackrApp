import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import Round from '../pages/Round'
import BuildProfile from '../components/BuildProfile'

const Home = () => {
  let { profile } = useContext(AuthContext)

  if (profile.is_account_setup) {
    return (  
      <div>
        <Round />
      </div>
    )
  } else {
    return (
      <div>
        <h1>Account not activated!</h1>
        <BuildProfile />
      </div>
    )
  }

}

export default Home