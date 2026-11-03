import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { DetailPage } from './pages/DetailPage'
import { ListPage } from './pages/ListPage'

export default function App() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/item/:id" element={<DetailPage />} />
          <Route path="*" element={<DetailPage />} />
        </Routes>
      </main>
    </>
  )
}
