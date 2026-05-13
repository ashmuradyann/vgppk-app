import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setPopupData } from '@renderer/store/slices/popupSlice'
import { removeSpecialty, setSpecialties } from '@renderer/store/slices/specialtiesSlice'
import { RootState } from '@renderer/store/store'
import { deleteSpecialty, getSpecialties } from '@renderer/api/requests'

import styles from './specialties.module.css'
import clsx from 'clsx'
import { useShowNotification } from '@renderer/utils/helpers'

const Specialties = () => {
  const showNotify = useShowNotification()
  const dispatch = useDispatch()
  const { specialties } = useSelector((state: RootState) => state.specialties)

  useEffect(() => {
    const fetchSpecialties = async () => {
      if (specialties && specialties.length > 0) {
        return
      }

      try {
        const response = await getSpecialties()
        dispatch(setSpecialties(response.data))
      } catch (error) {
        console.error('Не удалось загрузить специальности:', error)
      }
    }

    fetchSpecialties()
  }, [dispatch, specialties])

  const openSpecialtyPopup = () => {
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'creatingSpecialty',
        popupName: 'Создание специальности'
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

  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <h1>Специальности</h1>
        <button className="btn-primary" onClick={openSpecialtyPopup}>
          + Создать
        </button>
      </div>

      <div className={styles.bottom}>
        {/* Шапка таблицы с двумя колонками */}
        <div className={styles.headerRow}>
          <p>Код и название</p>
          <p>Квалификация</p>
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
                  onClick={(e) => {
                    e.preventDefault() // Чтобы не срабатывал переход по ссылке, если строка — ссылка
                    // ваша функция удаления, например: onDelete(el.id)
                  }}
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
