import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Specialty {
  id: number,
  code: string
  specialty: string
  qualification: string
}

export interface SpecialtyState {
  specialties: Specialty[]
}

const initialState: SpecialtyState = {
  specialties: []
}

const specialtiesSlice = createSlice({
  name: 'specialties',
  initialState,
  reducers: {
    createSpecialty: (state, action: PayloadAction<Specialty>) => {
      state.specialties.push(action.payload)
    },
    setSpecialties: (state, action: PayloadAction<Specialty[]>) => {
      state.specialties = action.payload
    },
    addSpecialty: (state, action: PayloadAction<Specialty>) => {
      state.specialties.push(action.payload)
    },
    removeSpecialty: (state, action: PayloadAction<number>) => {
      state.specialties = state.specialties.filter(el => el.id !== action.payload)
    }
  }
})

export const { createSpecialty, setSpecialties, addSpecialty, removeSpecialty } = specialtiesSlice.actions
export default specialtiesSlice.reducer
