import { useState } from 'react'
import './App.css'
import LandingPage from './LandingPage'
import BookingPage from './BookingPage'

function App() {
  const [page, setPage] = useState<'home' | 'booking'>('home')

  return page === 'booking'
    ? <BookingPage onBack={() => setPage('home')} />
    : <LandingPage onBook={() => setPage('booking')} />
}

export default App
