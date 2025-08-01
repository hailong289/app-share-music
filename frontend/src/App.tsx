import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div data-theme="forest" className="App">
      <Outlet />
    </div>
  )
}

export default App
