import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import clsx from 'clsx'

import { RootState } from '@renderer/store/store'
import { setPopupData } from '@renderer/store/slices/popupSlice'
import { removePracticeBase } from '@renderer/store/slices/practiceBaseSlice'

import { deletePracticeBase } from '@renderer/api/requests'

import { useShowNotification } from '@renderer/utils/helpers'

import styles from './practice-bases.module.css'

const PracticeBases = () => {
  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const [searchParams, setSearchParams] = useSearchParams()

  const { practiceBases } = useSelector((state: RootState) => state.practiceBases)

  const openPracticeBasesPopup = (status: string) => {
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'creatingPracticeBase',
        popupName: `${status === 'editing' ? 'Обновление' : 'Создание'} базы практики`,
        popupStatus: status
      })
    )
  }

  const getSupervisorsText = (supervisors: string) =>
    supervisors
      ?.split(', ')
      ?.map((el: string) => {
        var supervisorSplited = el.split('-')
        return `${supervisorSplited[0]} (${!!supervisorSplited[1] ? supervisorSplited[1] : "должность не указан"})`
      })
      .join(', ')

  const handlePracticeBaseDelete = async (id) => {
    const confirmed = await window.api.confirmAction('Подтвердите действие')
    if (confirmed) {
      deletePracticeBase(Number(id)).then((res) => {
        showNotify(true, `Студент ${res.organisation} удален!`)
        dispatch(removePracticeBase(id))
      })
    }
  }

  const handleEdit = (el) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set('id', el.id)
      prev.set('organisation', el.organisation)
      prev.set('supervisors', el.supervisors)
      prev.set('address', el.address)
      return prev
    })
    openPracticeBasesPopup('editing')
  }

  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <h1>Базы практик</h1>
        <button className="btn-primary" onClick={() => openPracticeBasesPopup('creating')}>
          Создать
        </button>
      </div>

      <div className={styles.bottom}>
        <div className={styles.headerRow}>
          <p>Название базы практики, адрес, руководители</p>
        </div>

        {practiceBases && practiceBases.length > 0 ? (
          practiceBases.map((el: any) => (
            <div key={el.id} className={styles.groupRow}>
              <p className={styles.groupName}>
                <span style={{ color: '#718096', marginRight: '8px' }}>{el.organisation}</span>
                {el.address}
              </p>

              <p className={styles.teacherName}>{getSupervisorsText(el.supervisors)}</p>

              {/* Новая кнопка удаления */}
              <div className={styles.actions}>
                <button
                  className={clsx(styles.btn, styles.editBtn)}
                  onClick={(e) => handleEdit(el)}
                >
                  Редактировать
                </button>
                <button
                  className={clsx(styles.btn, styles.deleteBtn)}
                  onClick={() => handlePracticeBaseDelete(el.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>Список базы практик пуст</div>
        )}
      </div>
    </div>
  )
}

export default PracticeBases
