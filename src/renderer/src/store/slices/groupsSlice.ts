import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Student {
  id: number // Changed to number to match your component logic
  full_name: string
  group_id: number
}

interface Specialty {
  specialty: string
  qualification: string
  code: string
}

interface Group {
  id: number
  name: string
  teacher_name: string
  students?: Student[]
  specialty: Specialty
}

export interface GroupsState {
  groups: Group[]
  currentGroup: Group | null
}

const initialState: GroupsState = {
  groups: [],
  currentGroup: null
}

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload
    },
    setCurrentGroup: (state, action: PayloadAction<Group | null>) => {
      state.currentGroup = action.payload
    },
    createGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload)
    },
    // FIX 1: state.groups is an ARRAY. You must find the specific group first.
    // Or, more commonly, add the student to the currentGroup being viewed.
    addStudent: (state, action: PayloadAction<Student>) => {
      if (state.currentGroup && state.currentGroup.id === action.payload.group_id) {
        state.currentGroup.students?.push(action.payload)
      }
    },
    deleteGroup: (state, action: PayloadAction<number>) => {
      state.groups = state.groups.filter((el) => el.id !== action.payload)
      if (state.currentGroup?.id === action.payload) {
        state.currentGroup = null
      }
    },
    removeStudentFromCurrent: (state, action: PayloadAction<number>) => {
      if (state.currentGroup && state.currentGroup.students) {
        state.currentGroup.students = state.currentGroup.students.filter(
          (s) => s.id !== action.payload
        )
      }
    },
    addSpecialtyToGroupStore: (state, action: PayloadAction<Specialty>) => {
      if (state.currentGroup !== null) {
        state.currentGroup.specialty = action.payload
      }
    }
  }
})

export const {
  setGroups,
  setCurrentGroup,
  removeStudentFromCurrent,
  createGroup,
  deleteGroup,
  addStudent,
  addSpecialtyToGroupStore
} = groupsSlice.actions

export default groupsSlice.reducer
