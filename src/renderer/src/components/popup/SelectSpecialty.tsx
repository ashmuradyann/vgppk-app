import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closePopup } from '@renderer/store/slices/popupSlice'
import { useShowNotification } from '@renderer/utils/helpers'
import { RootState } from '@renderer/store/store'

import styles from './popup.module.css'
import clsx from 'clsx'
import { useParams } from 'react-router-dom'
import { addSpecialtyToGroupRequest } from '@renderer/api/requests'
import { addSpecialtyToGroupStore } from '@renderer/store/slices/groupsSlice'

const SelectSpecialty = () => {
  const { id } = useParams()
  const { specialties } = useSelector((state: RootState) => state.specialties)
  const [selectedSpec, setSelectedSpec] = useState<any>(null)
  const dispatch = useDispatch()
  const showNotify = useShowNotification()

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedSpec.id) return showNotify(false, 'Выберите специальность')

    try {
      // dispatch(createStudent(...))
      await addSpecialtyToGroupRequest(Number(id), selectedSpec.id).then(res => {
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
        {specialties.map((el, i) => (
          <label key={i} className={clsx(styles.radio__card, selectedSpec?.id === el.id && styles.active)}>
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
        Добавить
      </button>
    </form>
  )
}

export default SelectSpecialty
