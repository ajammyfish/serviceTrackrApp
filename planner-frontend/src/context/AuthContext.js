import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('userId') ? localStorage.getItem('userId') : null);
  const [authTokens, setAuthTokens] = useState({ access: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null, refresh: localStorage.getItem('refreshToken') ? localStorage.getItem('refreshToken') : null });
  const [profile, setProfile] = useState(localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')) : null)
  let [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  let logoutUser = () => {
    setUser(null);
    setAuthTokens({ access: null, refresh: null });
    setProfile(null)

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('profile');

    navigate('/');
  }

  let updateToken = async () => {
    console.log(authTokens.access)
    try {
      const response = await fetch('https://jdfban.pythonanywhere.com/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });
      if (response.status === 200) {
        const data = await response.json();
        console.dir(data)

        let atoken = data.access;

        setAuthTokens(prevTokens => ({ ...prevTokens, access: atoken }));
        console.log('done')
        localStorage.setItem('accessToken', data.access);

      } else {
        const data = await response.json();
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error('Error occured: ', error);
      logoutUser()
    }
  }

  useEffect(() => {
    updateToken()
  }, [])

  //Refresh access token
  useEffect(() => {
    let interval = setInterval(() => {
      if (authTokens.access) {
        updateToken()
      }
    }, 240000);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, authTokens, setAuthTokens, logoutUser, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  )
}


export default AuthContext;