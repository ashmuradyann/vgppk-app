import React from 'react'

import styles from './popup.module.css'
import clsx from 'clsx'
import { useShowNotification } from '@renderer/utils/helpers'
import { useDispatch } from 'react-redux'
import { closePopup } from '@renderer/store/slices/popupSlice'

const Quiz = ({ action }) => {
  const dispatch = useDispatch()
  const showNotify = useShowNotification()
  const handleConfirm = () => {
    action()
    showNotify(true, 'Подтверждено!')
    dispatch(closePopup())
  }
  return (
    <div className={clsx(styles.quiz__wrapper, 'flex-center')}>
      <button className="btn-primary" onClick={handleConfirm}>
        Да
      </button>
    </div>
  )
}

export default Quiz
