import React, { FormEvent, useState, ChangeEvent, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import * as XLSX from 'xlsx'
import { useSearchParams } from 'react-router-dom'

import { importStudents, updateGroupR } from '@renderer/api/requests'

import { RootState } from '@renderer/store/store'
import { closePopup } from '@renderer/store/slices/popupSlice'
import { createGroup, updateGroupS } from '@renderer/store/slices/groupsSlice'

import { isRussianFullName, useShowNotification } from '@renderer/utils/helpers'

import styles from './popup.module.css'

type OriginalPracticeData = {
  name: string
  course: number
  teacher_name: string
}

const CreateGroup = () => {
  const showNotify = useShowNotification()
  const dispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  const [originalData, setOriginalData] = useState<OriginalPracticeData | null>(null)

  const formRef = useRef<null | HTMLFormElement>(null)

  const {
    generalInfo: { popupStatus }
  } = useSelector((state: RootState) => state.popups)

  const editId = searchParams.get('id')

  useEffect(() => {
    if (popupStatus === 'editing') {
      if (editId && formRef.current) {
        const name = decodeURIComponent(searchParams.get('name') || '')
        const course = decodeURIComponent(searchParams.get('course') || '')
        const teacher_name = decodeURIComponent(searchParams.get('teacher_name') || '')

        // Сохраняем оригинальные данные
        setOriginalData({
          name,
          course: Number(course),
          teacher_name
        })

        // Заполняем форму
        if (formRef.current['group_name']) {
          formRef.current['group_name'].value = name
        }
        if (formRef.current['course']) {
          formRef.current['course'].value = course
        }
        if (formRef.current['teacher_name']) {
          formRef.current['teacher_name'].value = teacher_name
        }
      }
    }
  }, [popupStatus, searchParams, editId])

  const parseExcelFile = async (file: File) => {
    const data = await file.arrayBuffer()

    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    const result: string[] = []
    let row = 7 // start from B7

    while (true) {
      const cellAddress = `B${row}`
      const cell = worksheet[cellAddress]

      if (!cell || !cell.v) break // stop at first empty cell

      let fullName = String(cell.v).trim()
      if (isRussianFullName(fullName)) {
        result.push(fullName)
      } else return
      row++
    }
    return result
  }

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)

      // Fix: Check file condition properly
      if ((!file || file.size === 0) && popupStatus !== 'editing') {
        showNotify(false, 'Пожалуйста, выберите файл с данными студентов')
        return
      }

      console.log(1)

      // Fix: Only parse Excel file when not editing or when file exists
      let students: string[] | null | undefined = null
      if (popupStatus !== 'editing' && file && file.size > 0) {
        students = await parseExcelFile(file)

        if (!students || students.length === 0) {
          showNotify(false, 'Не удалось прочитать файл или файл не содержит данных')
          return
        }
      }

      const { group_name, course, teacher_name } = Object.fromEntries(formData.entries()) as {
        group_name: string
        course: string
        teacher_name: string
      }

      // Fix: Validate required fields
      if (!group_name || !teacher_name) {
        showNotify(false, 'Пожалуйста, заполните все обязательные поля')
        return
      }

      if (popupStatus === 'editing') {
        // Fix: Check if editId exists
        if (!editId) {
          showNotify(false, 'ID группы не найден')
          return
        }

        await updateGroupR(Number(editId), group_name, Number(course), teacher_name).then((res) => {
          showNotify(true, `Группа ${group_name} обновлена.`)
          dispatch(updateGroupS(res.group))
          dispatch(closePopup())
        })
      } else {
        // Fix: Check if students data exists for creation
        if (!students) {
          showNotify(false, 'Необходимо загрузить файл с данными студентов')
          return
        }

        await importStudents({
          name: group_name,
          course: Number(course),
          teacher_name: teacher_name,
          students
        }).then((res) => {
          showNotify(true, `Группа ${group_name} создана.`)
          dispatch(
            createGroup({
              id: res.group_id,
              name: res.group_name,
              course: res.course,
              teacher_name: res.teacher_name
            })
          )
          dispatch(closePopup())
        })
      }
    } catch (err) {
      showNotify(
        false,
        popupStatus === 'editing' ? 'Не удалось обновить группу' : 'Не удалось создать группу'
      )
      console.log(err)
    }
  }

  const resetFormFile = () => {
    setFile(null)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    e.target.files && e.target.files.length > 0 && setFile(e.target.files[0])

  return (
    <form ref={formRef} onSubmit={formSubmit} className="flex-column">
      <input name="group_name" type="number" placeholder="Номер группы" required />
      <input name="course" type="number" placeholder="Курс группы" required />
      <input name="teacher_name" type="text" placeholder="Руководитель группы" required />
      {popupStatus !== 'editing' &&
        (file !== null ? (
          <div className={clsx(styles.file__upload, 'flex-between')}>
            <p>{file.name}</p>
            <button type="button" onClick={resetFormFile}>
              Удалить
            </button>
          </div>
        ) : (
          <label htmlFor="file" className={styles.file__label}>
            Выбрать файл
            <input
              id="file"
              type="file"
              name="studentArrayFile"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
            />
          </label>
        ))}

      <button type="submit">{popupStatus === 'editing' ? 'Готово' : 'Создать'}</button>
    </form>
  )
}

export default CreateGroup
