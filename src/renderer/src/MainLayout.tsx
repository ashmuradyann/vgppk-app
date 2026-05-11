import { Outlet, Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

import Popup from './components/popup/Popup'
import Notification from './components/notification/Notification'

import './style.css'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import CreateGroup from './components/popup/CreateGroup'
import Quiz from './components/popup/Quiz'
import AddStudent from './components/popup/AddStudent'
import AddSpecialty from './components/popup/AddSpecialty'

function App() {
  const {
    generalInfo: { isOpen: isPopupOpen, popupType }
  } = useSelector((state: RootState) => state.popups)

  const { isOpen: isNotificationOpen } = useSelector((state: RootState) => state.notifications)
  const { pathname } = useLocation()

  return (
    <>
      {isPopupOpen && popupType === 'creatingGroup' && (
        <Popup>
          <CreateGroup />
        </Popup>
      )}
      {isPopupOpen && popupType === 'creatingStudent' && (
        <Popup>
          <AddStudent />
        </Popup>
      )}
      {isPopupOpen && popupType === 'creatingSpecialty' && (
        <Popup>
          <AddSpecialty />
        </Popup>
      )}
      {/* {isPopupOpen && popupType === 'quiz' && (
        <Popup>
          <Quiz />
        </Popup>
      )} */}
      {isNotificationOpen && <Notification />}
      <div className="wrapper">
        <aside className="sidebar">
          <div className="user-profile">
            <span>Администратор</span>
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/groups" className={clsx(pathname.includes('/groups') && 'active')}>
                  📂 Группы
                </Link>
              </li>
              <li>
                <Link to="/bases" className={clsx(pathname.includes('/bases') && 'active')}>
                  🔧 Базы практик
                </Link>
              </li>
              <li>
                <Link
                  to="/specialties"
                  className={clsx(pathname.includes('/specialties') && 'active')}
                >
                  🧑‍💻 Специальности
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Основной контент */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default App
