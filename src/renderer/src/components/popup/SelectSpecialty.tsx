import React, { FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closePopup } from '@renderer/store/slices/popupSlice'
import { useShowNotification } from '@renderer/utils/helpers'
import { RootState } from '@renderer/store/store'

import styles from './popup.module.css'
import clsx from 'clsx'
import { useParams, useSearchParams } from 'react-router-dom'
import { addSpecialtyToGroupRequest } from '@renderer/api/requests'
import { addSpecialtyToGroupStore } from '@renderer/store/slices/groupsSlice'

const SelectSpecialty = () => {
  const { id } = useParams()
  const { specialties } = useSelector((state: RootState) => state.specialties)
  const {
    generalInfo: { popupStatus }
  } = useSelector((state: RootState) => state.popups)
  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedSpec, setSelectedSpec] = useState<any>(null)
  const dispatch = useDispatch()
  const showNotify = useShowNotification()

  useEffect(() => {
    if (popupStatus === 'editing') {
      const editId = searchParams.get('id')
      if (editId) {
        const matchedSpecialty = specialties?.find(specialty => specialty.id === Number(editId))
        setSelectedSpec(matchedSpecialty)
      }
    }
  }, [popupStatus, searchParams])

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedSpec.id) return showNotify(false, 'Выберите специальность')

    try {
      await addSpecialtyToGroupRequest(Number(id), selectedSpec.id).then((res) => {
        showNotify(true, 'Специальность добавлен в группу')
        dispatch(addSpecialtyToGroupStore(selectedSpec))
        dispatch(closePopup())
      })
    } catch (err) {
      showNotify(false, 'Не удалось добавить студента')
      console.log(err)
    }
  }

  return (
    <form onSubmit={formSubmit} className="flex-column">
      <div className={styles.radios__wrapper}>
        {specialties?.length === 0 ? <div className={styles.emptyState}>Список практик пуст</div> : specialties?.map((el: any, i: number) => (
          <label
            key={i}
            className={clsx(styles.radio__card, selectedSpec?.id === el.id && styles.active)}
          >
            <input
              type="radio"
              name="specialty"
              value={el.id}
              onChange={() => setSelectedSpec(el)}
              checked={selectedSpec?.id === el.id}
            />
            <div className={styles.radio__custom}></div>
            <div className={styles.radio__content}>
              <span className={styles.spec__code}>{el.code}</span>
              <p className={styles.spec__name}>{el.specialty}</p>
              <small className={styles.spec__qual}>{el.qualification}</small>
            </div>
          </label>
        ))}
      </div>
      <button type="submit" disabled={!selectedSpec?.id}>
        {popupStatus === 'editing' ? "Изменить" : "Выбрать"}
      </button>
    </form>
  )
}

export default SelectSpecialty
