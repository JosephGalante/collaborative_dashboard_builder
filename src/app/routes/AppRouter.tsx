import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CreateDashboardPage from './CreateDashboardPage'
import DashboardPage from './DashboardPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/dashboards/new" />} />
        <Route path="/dashboards/new" element={<CreateDashboardPage />} />
        <Route path="/dashboards/:dashboardId" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}
