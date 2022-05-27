import React from 'react'
import ReactDOM from 'react-dom'
import { Pane } from 'evergreen-ui'

import './index.css'
import { Splash } from './pages/Splash'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Navbar from './components/Navbar';

// function fakeLog() {
//   console.log("clicked logging button");
// }

ReactDOM.render(
  <React.StrictMode>
    <Pane padding={16}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="home" element={<Splash />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Pane>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
