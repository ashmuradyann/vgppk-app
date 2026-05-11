import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isOpen: false,
  success: false,
  text: ''
}

const notificationSlice = createSlice({
  name: 'popup',
  initialState: initialState,
  reducers: {
    setNotification: (state, action) => {
      state.isOpen = true
      state.success = action.payload.success
      state.text = action.payload.text
    },
    closeNotification: (state) => {
      state.isOpen = false
    }
  }
})

export const { setNotification, closeNotification } = notificationSlice.actions

export default notificationSlice.reducer
