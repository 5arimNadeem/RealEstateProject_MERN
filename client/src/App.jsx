import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        {/* it is making the profile section secure only when the sign-in will be made the profile section will be displayed otherwise these are not going to be displayed */}
        <Route element={<PrivateRoute />} >
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App