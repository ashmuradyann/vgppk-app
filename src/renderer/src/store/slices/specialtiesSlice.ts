import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Specialty {
  id: number
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
    editSpecialty: (state, action: PayloadAction<Specialty>) => {
      state.specialties = state.specialties.filter((el: any) => el.id !== action.payload.id)
      state.specialties.unshift(action.payload)
    },
    removeSpecialty: (state, action: PayloadAction<number>) => {
      state.specialties = state.specialties.filter((el: any) => el.id !== action.payload)
    }
  }
})

export const { createSpecialty, setSpecialties, addSpecialty, editSpecialty, removeSpecialty } =
  specialtiesSlice.actions
export default specialtiesSlice.reducer
