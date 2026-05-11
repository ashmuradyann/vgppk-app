import { useDispatch } from 'react-redux'
import { closeNotification, setNotification } from '@renderer/store/slices/notificationSlice'

export const useShowNotification = () => {
  const dispatch = useDispatch()

  const showNotify = (success: boolean, text: string) => {
    dispatch(setNotification({ success, text }))

    setTimeout(() => {
      dispatch(closeNotification())
    }, 3000)
  }

  return showNotify
}

export const isRussianFullName = (str: string): boolean => {
  const trimmed = str.trim()
  const words = trimmed.split(/\s+/)
  return (
    /^[А-ЯЁа-яё\s-]+$/u.test(trimmed) && words.length >= 2 && words.every((word) => word.length > 0)
  )
}
