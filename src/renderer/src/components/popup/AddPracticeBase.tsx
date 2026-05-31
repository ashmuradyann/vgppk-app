import React, { FormEvent, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { createPracticeBase, updatePracticeBase } from '@renderer/api/requests'

import { closePopup } from '@renderer/store/slices/popupSlice'

import { useShowNotification } from '@renderer/utils/helpers'
import { addPracticeBase, editPracticeBase } from '@renderer/store/slices/practiceBaseSlice'
import { useSearchParams } from 'react-router-dom'
import { RootState } from '@renderer/store/store'

const AddPracticeBase = () => {
  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const [searchParams, setSearchParams] = useSearchParams()

  const formRef = useRef(null)

  const {
    generalInfo: { popupStatus }
  } = useSelector((state: RootState) => state.popups)

  useEffect(() => {
    if (popupStatus === 'editing') {
      const editId = searchParams.get('id')
      if (editId && formRef.current) {
        const formData = new FormData()
        formData.set('organisation', decodeURIComponent(searchParams.get('organisation') || ''))
        formData.set('supervisors', decodeURIComponent(searchParams.get('supervisors') || ''))
        formData.set('address', decodeURIComponent(searchParams.get('address') || ''))

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
      const { organisation, supervisors, address } = Object.fromEntries(formData.entries()) as {
        organisation: string
        supervisors: string
        address: string
      }

      if (popupStatus === 'editing') {
        await updatePracticeBase(
          Number(searchParams.get('id')),
          organisation,
          supervisors,
          address
        ).then((res) => {
          showNotify(true, `База практики ${res.data.organisation} обновлена`)
          dispatch(editPracticeBase(res.data))
          dispatch(closePopup())
        })
      } else {
        await createPracticeBase(organisation, supervisors, address).then((res) => {
          showNotify(true, `База практики ${res.data.organisation} создана`)
          dispatch(addPracticeBase(res.data))
          dispatch(closePopup())
        })
      }
    } catch (err) {
      showNotify(
        false,
        `Не удалось ${popupStatus === 'editing' ? 'обновить' : 'создать'} базу практики`
      )
      console.log(err)
    }
  }

  return (
    <form ref={formRef} onSubmit={formSubmit} className="flex-column">
      <input name="organisation" type="text" placeholder="Наименование базы практики" required />
      <input name="supervisors" type="text" placeholder="ФИО-должность, ФИО-должность" required />
      <input name="address" type="text" placeholder="Адрес базы практики" required />
      <button type="submit">{popupStatus === "editing" ? "Обновить" : "Создать"}</button>
    </form>
  )
}

export default AddPracticeBase
