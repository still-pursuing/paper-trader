import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './Splash.css'

export function Splash() {
  const [text, setText] = useState('')

  useEffect(() => {
    fetchText(setText)
  }, [text])

  return (
    <div className="Splash">
      <header className="Splash-header">
        <img src={logo} className="Splash-logo" alt="logo" />
        <p>
          Edit <code>src/Splash.tsx</code> and save to reload.
        </p>
        <p>{text}</p>
        <a
          className="Splash-link"
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
