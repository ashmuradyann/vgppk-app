import React, { FormEvent, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import { createPractice, createStudent } from '@renderer/api/requests'

import { RootState } from '@renderer/store/store'

import { useShowNotification } from '@renderer/utils/helpers'
import { addPractice, addStudent } from '@renderer/store/slices/groupsSlice'
import clsx from 'clsx'

import styles from './popup.module.css'
import { closePopup } from '@renderer/store/slices/popupSlice'

const AddPractice = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const [searchParams, setSearchParams] = useSearchParams()

  const { practiceBases } = useSelector((state: RootState) => state.practiceBases)

  const { currentGroup } = useSelector((state: RootState) => state.groups)
  const formRef = useRef(null)

  const {
    generalInfo: { popupStatus }
  } = useSelector((state: RootState) => state.popups)

  useEffect(() => {
    if (popupStatus === 'editing') {
      const editId = searchParams.get('id')
      if (editId && formRef.current) {
        const formData = new FormData()
        formData.set('practiceName', decodeURIComponent(searchParams.get('name') || ''))
        formData.set('start_date', decodeURIComponent(searchParams.get('start_date') || ''))
        formData.set('end_date', decodeURIComponent(searchParams.get('end_date') || ''))
        formData.set('practice_type', decodeURIComponent(searchParams.get('type') || ''))

        for (let [key, value] of formData.entries()) {
          if (formRef.current[key]) {
            formRef.current[key].value = value
          }
        }
      }
    }
  }, [popupStatus, searchParams])

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const { practiceName, start_date, end_date, practice_type } = Object.fromEntries(
        formData.entries()
      ) as {
        practiceName: string
        start_date: string
        end_date: string
        practice_type: string
      }
      console.log(practiceName, start_date, end_date, practice_type)

      if (!!currentGroup) {
        await createPractice(
          practiceName,
          start_date,
          end_date,
          practice_type,
          currentGroup.id
        ).then(({ practice: { id, name, student_group_id, type, start_date, end_date } }) => {
          showNotify(true, `Практика ${name} добавлен в группу ${student_group_id}.`)
          dispatch(addPractice({ id, name, student_group_id, type, start_date, end_date }))
          console.log(currentGroup)
          dispatch(closePopup())
        })
      }
    } catch (err) {
      showNotify(false, 'Не удалось создать группу')
      console.log(err)
    }
  }

  return (
    <form ref={formRef} onSubmit={formSubmit} className="flex-column">
      <textarea name="practiceName" type="text" placeholder="Наименование практики" required />
      <div className={clsx(styles.date__wrapper, 'flex-between')}>
        <label htmlFor="">
          Дата начала
          <input type="date" name="start_date" required />
        </label>
        <label htmlFor="">
          Дата окончания
          <input type="date" name="end_date" required />
        </label>
      </div>
      <div className="select-wrapper">
        <select className="custom-select" name="practice_type" id="practice_type">
          <option value="up">Учебная практика</option>
          <option value="pp">Производственная практика</option>
          <option value="pdp">Производственная преддипломная практика</option>
        </select>
      </div>
      {/* <div className={styles.practice__bases_select}>
        <input type="text" placeholder="Поиск базы практик" />
        <div className={styles.bases__radios}></div>
      </div> */}
      <button type="submit">Создать</button>
    </form>
  )
}

export default AddPractice
