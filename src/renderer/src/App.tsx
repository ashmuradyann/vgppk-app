import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './MainLayout'
import Groups from './components/groups/Groups'
import GroupDetail from './components/groups/GroupDetail'
import PracticeBases from './components/practice-bases/PracticeBases'
import Specialties from './components/specialties/Specialties'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/groups" />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="bases" element={<PracticeBases />} />
          <Route path="specialties" element={<Specialties />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
