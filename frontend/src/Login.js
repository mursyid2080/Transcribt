import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    const data = {
        email: email,
        password: password
      };

      const dataJSON = JSON.stringify(data);
    
      // Set initial error values to empty
      setEmailError('')
      setPasswordError('')
    
      // Check if the user has entered both fields correctly
  
      if ('' === email) {
        setEmailError('Please enter your email')
        return
      }
    
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setEmailError('Please enter a valid email')
        return
      }
    
      if ('' === password) {
        setPasswordError('Please enter a password')
        return
      }
    
      if (password.length < 5) {
        setPasswordError('The password must be 6 characters or longer')
        return
      }
      
      // route with axios
      // Authentication calls will be made here...
      axios.post('http://127.0.0.1:8000/api/auth/login', {
          email: email,
          password: password
      })
      .then(response => {
          // Handle successful response
          console.log('Login successful:', response.data);
          // You may want to handle redirection or other actions upon successful login
      })
      .catch(error => {
          // Handle error
          console.error('Error logging in:', error);
          // You may want to display an error message to the user
      });
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login