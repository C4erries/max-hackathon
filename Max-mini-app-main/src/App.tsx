import { Spin, App as AntdApp } from 'antd'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { useAuth } from './hooks/useAuth'
import { useUserRole } from './lib/getUserRole'
import { EventsPage } from './pages/EventsPage'
import { EventDetailsPage } from './pages/EventDetailsPage'
import { ElectivePage } from './pages/ElectivePage'
import { RequestDetailPage } from './pages/RequestDetailPage'
import { ApprovalPage } from './pages/ApprovalPage'
import { ProfilePage } from './pages/ProfilePage'
import { LibraryPage } from './pages/LibraryPage'
import { DocumentFlowPage } from './pages/DocumentFlowPage'
import { BottomNavigation } from './components/shared/BottomNavigation'

function App() {
  const { isLoading } = useAuth()
  const userRole = useUserRole()

  if (isLoading) {
    return (
      <div className="app">
        <div className="app__loader">
          <Spin size="large" />
        </div>
      </div>
    )
  }

  return (
    <AntdApp>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />
            <Route path="/electives" element={<ElectivePage />} />
            <Route path="/approval" element={<ApprovalPage />} />
            <Route path="/my-requests" element={<ApprovalPage type="my" />} />
            <Route path="/requests/:requestId" element={<RequestDetailPage />} />
            <Route path="/my-requests/:requestId" element={<RequestDetailPage my />} />
            <Route path="/profile" element={<ProfilePage role={userRole} />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/document-flow" element={<DocumentFlowPage role={userRole} />} />
          </Routes>
          <BottomNavigation role={userRole} />
        </BrowserRouter>
      </div>
    </AntdApp>
  )
}

export default App
