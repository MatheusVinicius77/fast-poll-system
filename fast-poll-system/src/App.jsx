import { useState } from 'react'
import './App.css'
import Home from './pages/home'
import PollContainer from './components/PollContainer/PollContainer'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <>
      <div>
          <Home/>
      </div>
    </>
  )
}

export default App
