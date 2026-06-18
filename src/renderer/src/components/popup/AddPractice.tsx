import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'

import { createPractice, createStudent, updatePracticeR } from '@renderer/api/requests'

import { RootState } from '@renderer/store/store'

import { useShowNotification } from '@renderer/utils/helpers'
import { addPractice, addStudent, updatePracticeS } from '@renderer/store/slices/groupsSlice'
import clsx from 'clsx'

import styles from './popup.module.css'
import { closePopup } from '@renderer/store/slices/popupSlice'

// Тип для оригинальных данных
type OriginalPracticeData = {
  name: string
  start_date: string
  end_date: string
  type: string
}

const AddPractice = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const [searchParams, setSearchParams] = useSearchParams()

  const { currentGroup } = useSelector((state: RootState) => state.groups)
  const formRef = useRef<any>(null)

  const {
    generalInfo: { popupStatus }
  } = useSelector((state: RootState) => state.popups)

  const editId = searchParams.get('id')

  // Состояния для отслеживания оригинальных данных
  const [originalData, setOriginalData] = useState<OriginalPracticeData | null>(null)

  useEffect(() => {
    if (popupStatus === 'editing') {
      if (editId && formRef.current) {
        const name = decodeURIComponent(searchParams.get('name') || '')
        const start_date = decodeURIComponent(searchParams.get('start_date') || '')
        const end_date = decodeURIComponent(searchParams.get('end_date') || '')
        const type = decodeURIComponent(searchParams.get('type') || '')

        // Сохраняем оригинальные данные
        setOriginalData({
          name,
          start_date,
          end_date,
          type
        })

        // Заполняем форму
        if (formRef.current['practiceName']) {
          formRef.current['practiceName'].value = name
        }
        if (formRef.current['start_date']) {
          formRef.current['start_date'].value = start_date
        }
        if (formRef.current['end_date']) {
          formRef.current['end_date'].value = end_date
        }
        if (formRef.current['practice_type']) {
          formRef.current['practice_type'].value = type
        }
      }
    }
  }, [popupStatus, searchParams, editId])

  // Функция для проверки изменений
  const hasDataChanged = (currentData: {
    practiceName: string
    start_date: string
    end_date: string
    practice_type: string
  }): boolean => {
    if (!originalData) return false

    const nameChanged = currentData.practiceName !== originalData.name
    const startDateChanged = currentData.start_date !== originalData.start_date
    const endDateChanged = currentData.end_date !== originalData.end_date
    const typeChanged = currentData.practice_type !== originalData.type

    return nameChanged || startDateChanged || endDateChanged || typeChanged
  }

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

      if (!!currentGroup) {
        if (popupStatus === 'editing') {
          // Проверяем, были ли изменения
          if (!hasDataChanged({ practiceName, start_date, end_date, practice_type })) {
            showNotify(true, 'Нет изменений для сохранения')
            dispatch(closePopup())
            return
          }

          // Валидация ID
          if (!editId) {
            showNotify(false, 'ID практики не найден')
            return
          }

          await updatePracticeR(
            Number(editId),
            practiceName,
            start_date,
            end_date,
            practice_type,
            Number(currentGroup.id)
          ).then(({ practice: { id, name, student_group_id, type, start_date, end_date } }) => {
            console.log({ id, name, student_group_id, type, start_date, end_date })
            dispatch(updatePracticeS({ id, name, student_group_id, type, start_date, end_date }))
            showNotify(true, `Практика ${name} успешно обновлена`)
            dispatch(closePopup())
          })
        } else {
          // Создание новой практики
          await createPractice(
            practiceName,
            start_date,
            end_date,
            practice_type,
            Number(currentGroup.id)
          ).then(({ practice: { id, name, student_group_id, type, start_date, end_date } }) => {
            showNotify(true, `Практика ${name} добавлена в группу ${student_group_id}.`)
            dispatch(addPractice({ id, name, student_group_id, type, start_date, end_date }))
            dispatch(closePopup())
          })
        }
      } else {
        showNotify(false, 'Группа не найдена')
      }
    } catch (err) {
      showNotify(
        false,
        popupStatus === 'editing' ? 'Не удалось обновить практику' : 'Не удалось создать практику'
      )
      console.log(err)
    }
  }

  return (
    <form ref={formRef} onSubmit={formSubmit} className="flex-column">
      <textarea name="practiceName" placeholder="Наименование практики" required />
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
      <button type="submit">{popupStatus === 'editing' ? 'Изменить' : 'Создать'}</button>
    </form>
  )
}

export default AddPractice
