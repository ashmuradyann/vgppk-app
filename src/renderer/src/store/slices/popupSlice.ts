import { createSlice } from '@reduxjs/toolkit'

const popupsState = {
  generalInfo: {
    isOpen: false,
    popupType: '',
    popupStatus: ''
  },
  popupInfo: {
    popupName: ''
  }
}

const popupSlice = createSlice({
  name: 'popup',
  initialState: popupsState,
  reducers: {
    setPopupData: (state, action) => {
      state.generalInfo.isOpen = action.payload.isOpen
      state.generalInfo.popupType = action.payload.popupType
      state.generalInfo.popupStatus = action.payload.popupStatus

      state.popupInfo.popupName = action.payload.popupName
    },
    closePopup: (state) => {
      state.generalInfo.isOpen = false
      state.generalInfo.popupType = ''
      state.popupInfo.popupName = ''
    }
  }
})

export const { setPopupData, closePopup } = popupSlice.actions

export default popupSlice.reducer
