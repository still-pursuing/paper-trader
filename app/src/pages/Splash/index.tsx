// import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './logo.svg'
import './Splash.css'

export function Splash() {

  return (
    <div className="Splash">
      <header className="Splash-header">
        {/* <img src={logo} className="Splash-logo" alt="logo" /> */}
        <p>
          Some of the top performing stocks our users own:
        </p>
        <p>
          Insert a table
        </p>
        <Link to="/login">Log In</Link>
      </header>
      <p>
        Deployed on Firebase.
      </p>
    </div>
  )
}