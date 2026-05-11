import React, { FormEvent, useState, ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import * as XLSX from 'xlsx'

import { importStudents } from '@renderer/api/requests'

import { isRussianFullName, useShowNotification } from '@renderer/utils/helpers'
import { closePopup } from '@renderer/store/slices/popupSlice'
import { createGroup } from '@renderer/store/slices/groupsSlice'

const CreateGroup = () => {
  const showNotify = useShowNotification()
  const dispatch = useDispatch()
  const [file, setFile] = useState<File | null>(null)

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

      if (!file || file.size === 0) return

      const students = await parseExcelFile(file)

      if (!students) {
        showNotify(false, 'Не удалось создать группу')
        return
      }

      const { group_name, teacher_name, studyPeriod } = Object.fromEntries(formData.entries()) as {
        group_name: string
        teacher_name: string
        studyPeriod: string
      }

      await importStudents({
        name: group_name,
        teacher_name: teacher_name,
        academic_year: studyPeriod,
        specialty: '',
        students
      }).then((res) => {
        showNotify(true, `Группа ${group_name} создана.`)

        dispatch(closePopup())
        dispatch(
          createGroup({
            id: res.group_id,
            name: res.group_name,
            teacher_name: res.teacher_name
          })
        )
      })
    } catch (err) {
      showNotify(false, 'Не удалось создать группу')
      console.log(err)
    }
  }

  const resetFormFile = () => {
    setFile(null)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    e.target.files && e.target.files.length > 0 && setFile(e.target.files[0])

  return (
    <form onSubmit={formSubmit} className="flex-column">
      <input name="group_name" type="number" placeholder="Номер группы" required />
      <input name="teacher_name" type="text" placeholder="Руководитель группы" required />
      <input
        name="studyPeriod"
        type="text"
        placeholder="Периоды обучения: формат (2025/2026)"
        required
      />

      {file !== null ? (
        <div className="flex-between">
          <p>{file.name}</p>
          <button type="button" onClick={resetFormFile}>
            Удалить
          </button>
        </div>
      ) : (
        <input
          type="file"
          name="studentArrayFile"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
        />
      )}

      <button type="submit">Создать</button>
    </form>
  )
}

export default CreateGroup
