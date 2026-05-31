import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PracticeBase {
  id: number
  organisation: string
  supervisors: string
  address: string
}

export interface PracticeBaseState {
  practiceBases: PracticeBase[]
}

const initialState: PracticeBaseState = {
  practiceBases: []
}

const practiceBasesSlice = createSlice({
  name: 'practiceBases',
  initialState,
  reducers: {
    createPracticeBase: (state, action: PayloadAction<PracticeBase>) => {
      state.practiceBases.push(action.payload)
    },
    setPracticeBases: (state, action: PayloadAction<PracticeBase[]>) => {
      state.practiceBases = action.payload
    },
    addPracticeBase: (state, action: PayloadAction<PracticeBase>) => {
      state.practiceBases.unshift(action.payload)
    },
    editPracticeBase: (state, action: PayloadAction<PracticeBase>) => {
      state.practiceBases = state.practiceBases.filter((el) => el.id !== action.payload.id)
      state.practiceBases.unshift(action.payload)
    },
    removePracticeBase: (state, action: PayloadAction<number>) => {
      state.practiceBases = state.practiceBases.filter((el) => el.id !== action.payload)
    }
  }
})

export const {
  createPracticeBase,
  setPracticeBases,
  addPracticeBase,
  editPracticeBase,
  removePracticeBase
} = practiceBasesSlice.actions
export default practiceBasesSlice.reducer
