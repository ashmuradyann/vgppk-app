import React, { FormEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { createStudent } from '@renderer/api/requests'

import { closePopup } from '@renderer/store/slices/popupSlice'

import { useShowNotification } from '@renderer/utils/helpers'
import { addStudent } from '@renderer/store/slices/groupsSlice'

const AddStudent = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const { student_name } = Object.fromEntries(formData.entries()) as {
        student_name: string
      }

      await createStudent({
        name: student_name,
        group_id: Number(id)
      }).then((res) => {
        showNotify(true, `Студент ${res.student_name} добавлен в группу ${res.group_id}.`)
        dispatch(addStudent({ id: res.id, full_name: res.full_name, group_id: res.group_id }))
      })

      dispatch(closePopup())
    } catch (err) {
      showNotify(false, 'Не удалось создать группу')
      console.log(err)
    }
  }

  return (
    <form onSubmit={formSubmit} className="flex-column">
      <input name="student_name" type="text" placeholder="ФИО" required />
      <button type="submit">Создать</button>
    </form>
  )
}

export default AddStudent
