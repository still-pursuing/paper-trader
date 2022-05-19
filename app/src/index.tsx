import React from 'react'
import ReactDOM from 'react-dom'
import { Menu, Pane } from 'evergreen-ui'

import './index.css'
import { Splash } from './pages/Splash'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NotFound } from './pages/NotFound'
import Login from './pages/Login'

function fakeLog() {
  console.log("clicked logging button");
}

ReactDOM.render(
  <React.StrictMode>
    <Pane display="flex" padding={16} background="tint2" borderRadius={3}>
      <Pane >
        <Menu>
          <Menu.Group>
            <Menu.Item onSelect={fakeLog} >Login</Menu.Item>
            <Menu.Item>Home</Menu.Item>
            <Menu.Item>Profile</Menu.Item>
          </Menu.Group>
          <Menu.Divider />
          <Menu.Group>
            <Menu.Item intent="danger" onSelect={fakeLog} >Logout</Menu.Item>
          </Menu.Group>
        </Menu>
      </Pane>
    </Pane>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
