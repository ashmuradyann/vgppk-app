import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

import Popup from './components/popup/Popup'
import Notification from './components/notification/Notification'
import CreateGroup from './components/popup/CreateGroup'
import AddStudent from './components/popup/AddStudent'
import AddSpecialty from './components/popup/AddSpecialty'
import SelectSpecialty from './components/popup/SelectSpecialty'
import AddPracticeBase from './components/popup/AddPracticeBase'
import AddPractice from './components/popup/AddPractice'

import { getGroups, getPracticeBases, getSpecialties } from './api/requests'

import { RootState } from './store/store'
import { setGroups } from './store/slices/groupsSlice'
import { setSpecialties } from './store/slices/specialtiesSlice'
import { setPracticeBases } from './store/slices/practiceBaseSlice'

import './style.css'

function App() {
  const dispatch = useDispatch()
  const {
    generalInfo: { isOpen: isPopupOpen, popupType }
  } = useSelector((state: RootState) => state.popups)

  const { isOpen: isNotificationOpen } = useSelector((state: RootState) => state.notifications)
  const { pathname } = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setGroups(await getGroups()))
        dispatch(setSpecialties(await getSpecialties()))
        dispatch(setPracticeBases(await getPracticeBases()))
      } catch (error) {
        console.error('Не удалось загрузить данные:', error)
      }
    }

    fetchData()
  }, [])

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
      {isPopupOpen && popupType === 'addingSpecialtyToGroup' && (
        <Popup>
          <SelectSpecialty />
        </Popup>
      )}
      {isPopupOpen && popupType === 'creatingPracticeBase' && (
        <Popup>
          <AddPracticeBase />
        </Popup>
      )}
      {isPopupOpen && popupType === 'creatingPractice' && (
        <Popup>
          <AddPractice />
        </Popup>
      )}
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
