import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import MainLayout from './MainLayout'
import Groups from './components/groups/Groups'
import GroupDetail from './components/groups/GroupDetail'
import PractiseBases from './components/practise-bases/PractiseBases'
import Specialties from './components/specialties/Specialties'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/groups" />} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="bases" element={<PractiseBases />} />
          <Route path="specialties" element={<Specialties />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
