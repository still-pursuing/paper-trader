import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [text, setText] = useState('')

  useEffect(() => {
    fetchText(setText)
  }, [text])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>{text}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

async function fetchText(
  setText: React.Dispatch<React.SetStateAction<string>>
) {
  const response = await fetch('/test')
  const test = (await response.json())['test']
  setText(test)
}

export default App
