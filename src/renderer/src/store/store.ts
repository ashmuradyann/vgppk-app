import { configureStore } from '@reduxjs/toolkit'

import popupSlice from './slices/popupSlice'
import groupsSlice from './slices/groupsSlice'
import notificationSlice from './slices/notificationSlice'
import specialtiesSlice from './slices/specialtiesSlice'

const store = configureStore({
  reducer: {
    popups: popupSlice,
    notifications: notificationSlice,
    groups: groupsSlice,
    specialties: specialtiesSlice
  }
})

export type RootState = ReturnType<typeof store.getState>

export default store
