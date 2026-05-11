import React, { FormEvent } from 'react'
import { useDispatch } from 'react-redux'

import { createSpecialty } from '@renderer/api/requests'

import { closePopup } from '@renderer/store/slices/popupSlice'

import { useShowNotification } from '@renderer/utils/helpers'
import { addSpecialty } from '@renderer/store/slices/specialtiesSlice'

const AddSpecialty = () => {
  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const { code, specialty, qualification } = Object.fromEntries(formData.entries()) as {
        code: string
        specialty: string
        qualification: string
      }

      await createSpecialty(code, specialty, qualification).then((res) => {
        showNotify(true, `Специальность ${res.data.specialty} создан`)
        dispatch(addSpecialty(res.data))
      })

      dispatch(closePopup())
    } catch (err) {
      showNotify(false, 'Не удалось создать группу')
      console.log(err)
    }
  }

  return (
    <form onSubmit={formSubmit} className="flex-column">
      <input name="code" type="text" placeholder="Код специальности" required />
      <input name="specialty" type="text" placeholder="Специальность" required />
      <input name="qualification" type="text" placeholder="Квалификация" required />
      <button type="submit">Создать</button>
    </form>
  )
}

export default AddSpecialty
