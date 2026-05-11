import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'

import { setPopupData } from '@renderer/store/slices/popupSlice'
import { RootState } from '@renderer/store/store'
import { setGroups } from '@renderer/store/slices/groupsSlice'

import styles from './groups.module.css'
import { Link } from 'react-router-dom'
import { getGroups } from '@renderer/api/requests'

const Groups = () => {
  const dispatch = useDispatch()
  const { groups } = useSelector((state: RootState) => state.groups)

  useEffect(() => {
    const fetchGroups = async () => {
      if (groups && groups.length > 0) {
        return
      }

      try {
        dispatch(setGroups(await getGroups()))
      } catch (error) {
        console.error('Не удалось загрузить специальности:', error)
      }
    }

    fetchGroups()
  }, [dispatch])

  const createGroup = () => {
    dispatch(
      setPopupData({
        isOpen: true,
        popupType: 'creatingGroup',
        popupName: 'Импорт группы'
      })
    )
  }

  return (
    <div className={styles.content}>
      <div className={styles.top}>
        <h1>Учебные группы</h1>
        <button className="btn-primary" onClick={createGroup}>
          + Импорт группы
        </button>
      </div>

      <div className={styles.bottom}>
        <div className={styles.headerRow}>
          <p>Номер группы</p>
          <p>Руководитель</p>
        </div>

        {groups && groups.length > 0 ? (
          groups.map((el: any) => (
            <Link to={`/groups/${el.id}`} key={el.id} className={styles.groupRow}>
              <p className={styles.groupName}>{el?.groupNumber || el?.name}</p>
              <p className={styles.teacherName}>{el?.teacher_name || 'Не назначен'}</p>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>Список групп пуст</div>
        )}
      </div>
    </div>
  )
}

export default Groups
