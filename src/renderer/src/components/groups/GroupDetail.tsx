import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'

import { deleteStudent, destroyGroup, getGroupsById } from '@renderer/api/requests'

import styles from './groups.module.css'
import { closePopup, setPopupData } from '@renderer/store/slices/popupSlice'
import { useShowNotification } from '@renderer/utils/helpers'
import {
  removeStudentFromCurrent,
  setCurrentGroup,
  deleteGroup
} from '@renderer/store/slices/groupsSlice'
import { RootState } from '@renderer/store/store'

const GroupDetail = () => {
  const { currentGroup } = useSelector((state: RootState) => state.groups)
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const showNotify = useShowNotification()

  const [loading, setLoading] = useState(!currentGroup || currentGroup.id !== Number(id))

  useEffect(() => {
    const fetchGroup = async () => {
      if (!id) return

      // GUARD: If we already have THIS group in Redux, don't fetch
      if (currentGroup && currentGroup.id === Number(id)) {
        setLoading(false)
        return
      }

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
  }, [id, dispatch, currentGroup]) // currentGroup is now a dependency

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

  // Use currentGroup for rendering
  const group = currentGroup

  if (loading) return <div className={styles.loader}>Загрузка...</div>
  if (!group) return <div className={styles.error}>Группа не найдена</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.info}>
          <h1>Группа: {group.name}</h1>
          <p className={styles.subtitle}>
            <strong>Специальность:</strong> {group.specialty?.name || 'Не указана'}
          </p>
          <p className={styles.subtitle}>
            <strong>Руководитель:</strong> {group.teacher_name}
          </p>
        </div>
        <div className={styles.actions}>
          <button className={clsx('btn-primary', styles.red)} onClick={removeGroup}>
            Удалить группу
          </button>
        </div>
      </header>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Список студентов</h3>
          <span className={styles.count}>Всего: {group.students?.length || 0}</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>ФИО студента</th>
                <th style={{ textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {group.students?.map((student: any, index: number) => (
                <tr key={student.id}>
                  <td className={styles.indexCol}>{index + 1}</td>
                  <td className={styles.nameCol}>{student.full_name}</td>
                  <td className={styles.actionsCol}>
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

      <footer className={styles.footerButtons}>
        <button className="btn-primary" onClick={handleCreateStudent}>
          + Добавить студента
        </button>
      </footer>
    </div>
  )
}

export default GroupDetail
