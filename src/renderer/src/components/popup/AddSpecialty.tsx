import React, { FormEvent, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { createSpecialty, updateSpecialty } from '@renderer/api/requests'

import { closePopup } from '@renderer/store/slices/popupSlice'

import { useShowNotification } from '@renderer/utils/helpers'
import { addSpecialty, editSpecialty } from '@renderer/store/slices/specialtiesSlice'
import { RootState } from '@renderer/store/store'
import { useSearchParams } from 'react-router-dom'

const AddSpecialty = () => {
  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const [searchParams, setSearchParams] = useSearchParams()

  const formRef = useRef<null | HTMLFormElement>(null)

  const {
    generalInfo: { popupStatus }
  } = useSelector((state: RootState) => state.popups)

  useEffect(() => {
    if (popupStatus === 'editing') {
      const editId = searchParams.get('id')
      if (editId && formRef.current) {
        const formData = new FormData()
        formData.set('code', decodeURIComponent(searchParams.get('code') || ''))
        formData.set('specialty', decodeURIComponent(searchParams.get('specialty') || ''))
        formData.set('qualification', decodeURIComponent(searchParams.get('qualification') || ''))

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
      const { code, specialty, qualification } = Object.fromEntries(formData.entries()) as {
        code: string
        specialty: string
        qualification: string
      }

      if (popupStatus === 'editing') {
        await updateSpecialty(
          Number(searchParams.get('id')),
          code,
          specialty,
          qualification
        ).then((res) => {
          showNotify(true, `Специальность ${res.data.specialty} обновлена`)
          dispatch(editSpecialty(res.data))
          dispatch(closePopup())
        })
      } else {
        await createSpecialty(code, specialty, qualification).then((res) => {
          showNotify(true, `Специальность ${res.data.specialty} создан`)
          dispatch(addSpecialty(res.data))
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
      <input name="code" type="text" placeholder="Код специальности" required />
      <input name="specialty" type="text" placeholder="Специальность" required />
      <input name="qualification" type="text" placeholder="Квалификация" required />
      <button type="submit">{popupStatus === "editing" ? "Обновить" : "Создать"}</button>
    </form>
  )
}

export default AddSpecialty
