import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'
import HomePage from './HomePage'
import Transcribe from './TranscribeModule/Transcribe'
import Dashboard from './Dashboard'
import ProfilePage from './ProfilePage'
import { MantineProvider } from '@mantine/core'




import './App.css'
import React, { useEffect, useState } from 'react'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className="App">   
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/transcribe" element={<Transcribe />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route exact path="/profile" component={ProfilePage} />
          {/* <Route path="/authentication" element={<AuthenticationForm />} /> */}
        </Routes>
      </BrowserRouter>
      

    </div>
  )
}

export default App