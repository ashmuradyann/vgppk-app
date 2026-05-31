import React, { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx'

import { RootState } from '@renderer/store/store'
import { closePopup } from '@renderer/store/slices/popupSlice';

import closeIcon from '../../assets/close.svg'

import styles from './popup.module.css'

interface PopupProps {
  children: ReactNode
  onClose?: () => void
}

const Popup = ({ children }: PopupProps) => {
  const dispatch = useDispatch()
  const {
    popupInfo: { popupName }
  } = useSelector((state: RootState) => state.popups)
  const [searchParams, setSearchParams] = useSearchParams()

  const closePopupFunc = () => {
    dispatch(closePopup())
    setSearchParams({})
  }

  return (
    <div className={clsx(styles.popup, 'flex-center')}>
      <div className={clsx(styles.container, 'flex-column')}>
        <div className={clsx(styles.top, 'flex-between')}>
          <p>{popupName}</p>
          {/* Исправил src={closeIcon}, так как это переменная, а не строка */}
          <img src={closeIcon} alt="close" onClick={closePopupFunc} />
        </div>
        <div className={styles.bottom}>{children}</div>
      </div>
    </div>
  )
}

export default Popup
