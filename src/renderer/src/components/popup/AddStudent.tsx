import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'

import { createStudent, updateStudentR } from '@renderer/api/requests'

import { closePopup } from '@renderer/store/slices/popupSlice'
import { addStudent, updateStudentS } from '@renderer/store/slices/groupsSlice'
import { RootState } from '@renderer/store/store'

import { useShowNotification } from '@renderer/utils/helpers'

import styles from './popup.module.css'

type PracticeRadio = {
  id: number | null
  studentId?: number
  supervisor?: string
}

// Add type for original data
type OriginalData = {
  student_name: string
  practice_base_id: number | null
  practice_supervisor: string
}

const AddStudent = () => {
  const { id } = useParams()

  const dispatch = useDispatch()
  const showNotify = useShowNotification()

  const [searchParams, setSearchParams] = useSearchParams()

  const [selectedBase, setSelectedBase] = useState<PracticeRadio | null>(null)
  const [originalData, setOriginalData] = useState<OriginalData | null>(null)
  const [originalStudentName, setOriginalStudentName] = useState<string>('')

  const {
    generalInfo: { popupStatus }
  } = useSelector((state: RootState) => state.popups)
  const { practiceBases } = useSelector((state: RootState) => state.practiceBases)

  const [searchedBases, setSearchedBases] = useState(practiceBases)

  const formRef = useRef<any>(null)

  const studentName = decodeURIComponent(searchParams.get('student_name') || '')

  useEffect(() => {
    if (popupStatus === 'editing') {
      const editId = searchParams.get('id')
      if (editId && formRef.current) {
        const studentNameInput = formRef.current['student_name']
        if (studentNameInput) {
          studentNameInput.value = studentName
          setOriginalStudentName(studentName) // Store original name
        }

        const practice_base_id = decodeURIComponent(searchParams.get('practice_base_id') || '')
        const practice_supervisor = decodeURIComponent(
          searchParams.get('practice_supervisor') || ''
        )

        const baseId = Number(practice_base_id) || null

        // Store original data for comparison
        setOriginalData({
          student_name: studentName,
          practice_base_id: baseId,
          practice_supervisor: practice_supervisor
        })

        if (!!Number(practice_base_id)) {
          setSelectedBase({
            id: baseId,
            supervisor: practice_supervisor,
            studentId: Number(editId)
          })
        } else {
          setSelectedBase({
            id: null,
            supervisor: '',
            studentId: Number(editId)
          })
        }
      }
    }
  }, [popupStatus, searchParams])

  // Function to check if data has changed
  const hasDataChanged = (currentStudentName: string): boolean => {
    if (!originalData) return false

    const currentBaseId = selectedBase?.id || null
    const currentSupervisor = selectedBase?.supervisor || ''

    const nameChanged = currentStudentName !== originalData.student_name
    const baseChanged = currentBaseId !== originalData.practice_base_id
    const supervisorChanged = currentSupervisor !== originalData.practice_supervisor

    return nameChanged || baseChanged || supervisorChanged
  }

  const formSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const formData = new FormData(e.currentTarget)
      const { student_name } = Object.fromEntries(formData.entries()) as {
        student_name: string
      }

      if (popupStatus === 'editing') {
        // Check if any data has changed
        // if (!hasDataChanged(student_name) || student_name === studentName) {
        //   dispatch(closePopup())
        //   return
        // }

        // Validate required fields
        if (!selectedBase?.studentId) {
          showNotify(false, 'ID студента не найден')
          return
        }

        // Prepare update data
        const updateData = {
          student_name: student_name,
          practice_base_id: selectedBase?.id || null,
          practice_supervisor: selectedBase?.supervisor || ''
        }

        // Call API with proper parameters
        await updateStudentR(
          selectedBase.studentId,
          updateData.student_name,
          Number(updateData.practice_base_id),
          updateData.practice_supervisor
        ).then((res) => {
          showNotify(true, 'Данные студента обновлены')
          dispatch(
            updateStudentS({
              id: res.id,
              full_name: res.full_name,
              practice_supervisor: res.practice_supervisor,
              practice_base_id: res.practice_base_id
            })
          )
          dispatch(closePopup())
        })
      } else {
        // Create new student
        await createStudent({
          name: student_name,
          group_id: Number(id)
        }).then((res) => {
          showNotify(true, `Студент ${res.student_name} добавлен в группу ${res.group_id}.`)
          dispatch(
            addStudent({ id: res.id, full_name: res.full_name, student_group_id: res.group_id })
          )
          dispatch(closePopup())
        })
      }
    } catch (err) {
      showNotify(
        false,
        popupStatus === 'editing'
          ? 'Не удалось обновить данные студента'
          : 'Не удалось создать студента'
      )
      console.log(err)
    }
  }

  const getSupervisorsText = (supervisors: string) => {
    if (!supervisors) return ''

    return supervisors
      ?.split(', ')
      ?.map((el: string) => {
        var supervisorSplited = el.split('-')
        return `${supervisorSplited[0]} (${!!supervisorSplited[1] ? supervisorSplited[1] : 'должность не указана'})`
      })
      .join(', ')
  }

  const handleSearchBase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchedBases(
      practiceBases.filter((el: any) => el.organisation.toLowerCase().includes(value.toLowerCase()))
    )
  }

  const getSupervisorsForUse = () => {
    if (!selectedBase?.id) return []

    const foundBase = searchedBases.find((base) => base.id === selectedBase.id)
    if (!foundBase || !foundBase.supervisors) return []

    return foundBase.supervisors.split(', ')
  }

  const handleBaseSelection = (el: any) => {
    const supervisorsArray = el.supervisors?.split(', ') || []

    setSelectedBase({
      studentId: selectedBase?.studentId,
      id: el.id,
      supervisor: supervisorsArray.length === 1 ? supervisorsArray[0] : ''
    })
  }

  const supervisorsForUse = getSupervisorsForUse()

  return (
    <form
      ref={formRef}
      onSubmit={formSubmit}
      className={clsx(styles.select__practice, 'flex-column')}
    >
      <input name="student_name" type="text" placeholder="ФИО" required />

      {popupStatus === 'editing' && (
        <>
          <input
            type="text"
            className={styles.search}
            placeholder="Поиск базы практики"
            onChange={handleSearchBase}
          />

          <div className={styles.radio__wrapper}>
            {searchedBases.length !== 0 ? (
              searchedBases.map((el: any) => (
                <label
                  key={el.id}
                  className={clsx(styles.radio__card, selectedBase?.id === el.id && styles.active)}
                >
                  <input
                    type="radio"
                    name="practiceBase"
                    value={el.id}
                    onChange={() => handleBaseSelection(el)}
                    checked={selectedBase?.id === el.id}
                  />
                  <div className={styles.radio__custom}></div>
                  <div className={clsx(styles.radio__content, 'flex-column')}>
                    <div className="flex-center">
                      <span className={styles.spec__code}>{el.organisation}</span>
                      <span className={styles.spec__qual}>{el.address}</span>
                    </div>
                    <div>
                      <p className={styles.spec__name}>{getSupervisorsText(el.supervisors)}</p>
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <div className={styles.emptyState}>Список базы практик пуст</div>
            )}
          </div>

          {supervisorsForUse.length > 1 && selectedBase?.id != null && (
            <div className={styles.select__supervisor}>
              <p>Выбор руководителя</p>
              {supervisorsForUse.map((supervisor: any) => (
                <label
                  key={supervisor}
                  className={clsx(
                    styles.radio__card,
                    selectedBase.supervisor === supervisor && styles.active
                  )}
                >
                  <input
                    type="radio"
                    name={`practiceBase-${selectedBase.id}`}
                    value={supervisor}
                    onChange={() => setSelectedBase((prev: any) => ({ ...prev, supervisor }))}
                    checked={selectedBase?.supervisor === supervisor}
                  />
                  <div className={styles.radio__custom}></div>
                  <div className={clsx(styles.radio__content, 'flex-column')}>{supervisor}</div>
                </label>
              ))}
            </div>
          )}
        </>
      )}

      <button
        type="submit"
        // disabled={selectedBase?.supervisor === ''}
      >
        {popupStatus === 'editing' ? 'Готово' : 'Создать'}
      </button>
    </form>
  )
}

export default AddStudent
