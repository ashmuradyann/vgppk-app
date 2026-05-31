import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setPopupData } from '@renderer/store/slices/popupSlice'
import { removeSpecialty } from '@renderer/store/slices/specialtiesSlice'
import { RootState } from '@renderer/store/store'
import { deleteSpecialty } from '@renderer/api/requests'

import styles from './specialties.module.css'
import clsx from 'clsx'
import { useShowNotification } from '@renderer/utils/helpers'
import { useSearchParams } from 'react-router-dom'

const Specialties = () => {
  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const [searchParams, setSearchParams] = useSearchParams()

  const { specialties } = useSelector((state: RootState) => state.specialties)

  const openSpecialtyPopup = (status: string) => {
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'creatingSpecialty',
        popupName: `${status === 'editing' ? 'Обновление' : 'Создание'} специальности`,
        popupStatus: status
      })
    )
  }

  const handleSpecialtyDelete = async (id: number) => {
    const confirmed = await window.api.confirmAction('Подтвердите действие')
    if (confirmed) {
      await deleteSpecialty(id).then((res) => {
        showNotify(true, `Специальность ${res.name} удален.`)
        dispatch(removeSpecialty(id))
      })
    }
  }

  const handleEdit = (el) => {
    setSearchParams((prev: URLSearchParams) => {
      prev.set('id', el.id)
      prev.set('code', el.code)
      prev.set('specialty', el.specialty)
      prev.set('qualification', el.qualification)
      return prev
    })
    openSpecialtyPopup('editing')
  }

  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <h1>Специальности</h1>
        <button className="btn-primary" onClick={() => openSpecialtyPopup('creating')}>
          Создать
        </button>
      </div>

      <div className={styles.bottom}>
        <div className={styles.headerRow}>
          <p>Код и наименование специальности, Квалификация</p>
        </div>

        {specialties && specialties.length > 0 ? (
          specialties.map((el) => (
            <div key={el.code} className={styles.groupRow}>
              <p className={styles.groupName}>
                <span style={{ color: '#718096', marginRight: '8px' }}>{el.code}</span>
                {el.specialty}
              </p>

              <p className={styles.teacherName}>{el.qualification}</p>

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
                  onClick={() => handleSpecialtyDelete(el.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>Список специальностей пуст</div>
        )}
      </div>
    </div>
  )
}

export default Specialties
