import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'

import {
  deletePractice,
  deleteStudent,
  destroyGroup,
  getGroupsById,
  getStudentDocumentsR
} from '@renderer/api/requests'

import styles from './groups.module.css'
import { closePopup, setPopupData } from '@renderer/store/slices/popupSlice'
import { useShowNotification } from '@renderer/utils/helpers'
import {
  removeStudentFromCurrent,
  setCurrentGroup,
  deleteGroup,
  removePracticeFromCurrent
} from '@renderer/store/slices/groupsSlice'
import { RootState } from '@renderer/store/store'

const GroupDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const showNotify = useShowNotification()
  const [isPracticesOpen, setIsPracticesOpen] = useState(false)
  const [isStudentsOpen, setIsStudentsOpen] = useState(false)

  const { currentGroup } = useSelector((state: RootState) => state.groups)
  const { specialties } = useSelector((state: RootState) => state.specialties)
  const { practiceBases } = useSelector((state: RootState) => state.practiceBases)

  const [loading, setLoading] = useState(!currentGroup || currentGroup.id !== Number(id))

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) return

      // if (currentGroup && currentGroup.id === Number(id)) {
      //   setLoading(false)
      //   return
      // }

      try {
        setLoading(true)
        const data = await getGroupsById(Number(id))
        dispatch(setCurrentGroup(data)) // Save to Redux
      } catch (error) {
        console.error('Ошибка загрузки:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [id]) // currentGroup is now a dependency

  const removeGroup = async () => {
    const confirmed = await window.api.confirmAction('Подтвердите действие')

    if (confirmed) {
      destroyGroup(Number(id)).then((res) => {
        showNotify(true, `Группа ${res.name} удалена!`)

        if (currentGroup !== null) {
          dispatch(deleteGroup(currentGroup.id))
        }

        dispatch(closePopup())

        navigate('/groups')
      })
    } else return
  }

  const handleCreateStudent = () => {
    dispatch(
      setPopupData({ isOpen: true, popupType: 'creatingStudent', popupName: 'Добавление студента' })
    )
  }

  const handleStudentDelete = async (studentId) => {
    const confirmed = await window.api.confirmAction('Подтвердите действие')
    if (confirmed) {
      deleteStudent(Number(studentId)).then((res) => {
        showNotify(true, `Студент ${res.name} удален!`)
        dispatch(removeStudentFromCurrent(studentId))
      })
    }
  }

  const handlePracticeDelete = async (student_group_id, practice_id, name) => {
    const confirmed = await window.api.confirmAction('Подтвердите действие')
    if (confirmed) {
      deletePractice(student_group_id, practice_id).then((res) => {
        showNotify(true, `Практика ${name} удалена!`)
        dispatch(removePracticeFromCurrent(practice_id))
      })
    }
  }

  const handleEditSpecialty = (id: number) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set('id', String(id))
      return prev
    })
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'addingSpecialtyToGroup',
        popupName: 'Изменение специальности',
        popupStatus: 'editing'
      })
    )
  }

  const handleAddingSpecialty = () => {
    if (!!currentGroup?.specialty?.id) {
      handleEditSpecialty(currentGroup.specialty.id)
      return
    }
    if (specialties?.length === 0) {
      showNotify(false, 'Сначала создайте специальность')
      return
    }
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'addingSpecialtyToGroup',
        popupName: 'Выбор специальности'
      })
    )
  }

  const handleCreatingPractice = () => {
    // if (practiceBases?.length === 0) {
    //   showNotify(false, 'Сначала создайте базу практики')
    //   return
    // }
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'creatingPractice',
        popupName: 'Создание практики'
      })
    )
  }

  const getStudentDocumentsFunc = async (student: any) => {
    await getStudentDocumentsR(
      student.id,
      student.full_name,
      currentGroup.name,
      currentGroup.specialty?.specialty,
      currentGroup.specialty?.qualification
    ).then((res) => {
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Kharakteristika_${student.full_name}_${Date.now()}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
  }

  const getPracticeTypeText = (type) => {
    if (type === 'up') {
      return 'Учебная практика'
    } else if (type === 'pp') {
      return 'Производственная практика'
    } else if (type === 'pdp') {
      return 'Производственная практика (преддипломная)'
    }
  }

  const handleEditPractice = (el) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set('id', el.id)
      prev.set('name', el.name)
      prev.set('start_date', el.start_date)
      prev.set('end_date', el.end_date)
      prev.set('type', el.type)
      return prev
    })
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'creatingPractice',
        popupName: 'Изменение практики',
        popupStatus: 'editing'
      })
    )
  }

  if (loading) return <div className={styles.loader}>Загрузка...</div>
  if (!currentGroup) return <div className={styles.error}>Группа не найдена</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.info}>
          <h1>Группа: {currentGroup.name}</h1>
          <p className={styles.subtitle}>
            <strong>Специальность:</strong>{' '}
            {currentGroup.specialty?.specialty || <span>Не выбрано</span>}
          </p>
          <p className={styles.subtitle}>
            <strong>Руководитель:</strong> {currentGroup.teacher_name}
          </p>
        </div>
        <div className={styles.actions}>
          <button className={clsx('btn-primary', styles.red)} onClick={removeGroup}>
            Удалить группу
          </button>
          <button className="btn-primary" onClick={handleCreateStudent}>
            Добавить студента
          </button>
          <button className="btn-primary" onClick={handleAddingSpecialty}>
            {!!currentGroup?.specialty?.id ? 'Изменить' : 'Выбрать'} специальность
          </button>
          <button className="btn-primary" onClick={handleCreatingPractice}>
            Новая практика
          </button>
        </div>
      </header>

      {/* Блок практик с возможностью сворачивания */}
      <section className={styles.tableCard}>
        <div className={styles.tableHeader} onClick={() => setIsPracticesOpen(!isPracticesOpen)}>
          <h3>Список практик</h3>
          <div className={styles.headerRight}>
            <span className={styles.count}>Всего: {currentGroup.practices?.length || 0}</span>
            <span className={styles.chevron}>{isPracticesOpen ? '▲' : '▼'}</span>
          </div>
        </div>

        <div
          className={clsx(
            styles.tableWrapper,
            isPracticesOpen ? styles.tableWrapperOpen : styles.tableWrapperClosed
          )}
        >
          <div className={styles.tableWrapperInner}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Тип</th>
                  <th>Дата начала</th>
                  <th>Дата окончания</th>
                  <th style={{ textAlign: 'right' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {currentGroup.practices && currentGroup.practices.length > 0 ? (
                  currentGroup.practices.map((el) => {
                    return (
                      <tr key={el.id}>
                        <td className={styles.nameCol}>{el.name}</td>
                        <td className={styles.nameCol}>{getPracticeTypeText(el.type)}</td>
                        <td className={styles.nameCol}>{String(el.start_date)}</td>
                        <td className={styles.nameCol}>{String(el.end_date)}</td>
                        <td className={styles.actionsCol}>
                          <button className={styles.editBtn} onClick={() => {}}>
                            Скачать договор
                          </button>
                          <button className={styles.editBtn} onClick={() => handleEditPractice(el)}>
                            Редактировать
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handlePracticeDelete(currentGroup.id, el.id, el.name)}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.emptyStateContainer}>
                      <div className={styles.emptyState}>Список практик пуст</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Блок студентов (всегда открыт) */}
      <section className={styles.tableCard}>
        <div className={styles.tableHeader} onClick={() => setIsStudentsOpen(!isStudentsOpen)}>
          <h3>Список студентов</h3>
          <div className={styles.headerRight}>
            <span className={styles.count}>Всего: {currentGroup.students?.length || 0}</span>
            <span className={styles.chevron}>{isStudentsOpen ? '▲' : '▼'}</span>
          </div>
        </div>

        <div
          className={clsx(
            styles.tableWrapper,
            isStudentsOpen ? styles.tableWrapperOpen : styles.tableWrapperClosed
          )}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>ФИО студента</th>
                <th style={{ textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {currentGroup.students?.map((student, index) => (
                <tr key={student.id}>
                  <td className={styles.indexCol}>{index + 1}</td>
                  <td className={styles.nameCol}>{student.full_name}</td>
                  <td className={styles.actionsCol}>
                    <span className={styles.filesBtn}>
                      Скачать
                      <div className={styles.files__wrapper}>
                        <button className={styles.editBtn}>Аттестационный лист</button>
                        <button className={styles.editBtn}>Направление</button>
                        <button className={styles.editBtn}>Отзыв</button>
                        <button className={styles.editBtn}>Характеристика</button>
                      </div>
                    </span>
                    <button className={styles.editBtn}>Редактировать</button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleStudentDelete(student.id)}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default GroupDetail
