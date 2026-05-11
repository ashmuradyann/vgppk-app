import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '@renderer/store/store'

import styles from './notification.module.css'
import clsx from 'clsx'

const Notification = () => {
  const { success, text } = useSelector((state: RootState) => state.notifications)

  return (
    <div className={clsx(styles.notification, success && styles.success)}>
      {success ? <p>Успешно:</p> : <p>Ошибка:</p>}
      <p>{text}</p>
    </div>
  )
}

export default Notification
