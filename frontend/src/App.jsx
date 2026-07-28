import { BrowserRouter } from 'react-router-dom'
import Dashboard from './views/Dashboard' 
export default function App() {
  return (
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  )
}