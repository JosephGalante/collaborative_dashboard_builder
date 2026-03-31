import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './DashboardPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboards/local-demo" />} />
        <Route path="/dashboards/:dashboardId" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
