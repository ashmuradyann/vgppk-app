import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Student {
  id: number // Changed to number to match your component logic
  full_name: string
  student_group_id: number
  practice_base_id: number
  practice_supervisor: string
}

interface Specialty {
  id: number | null
  specialty: string
  qualification: string
  code: string
}

interface Practice {
  id: number
  student_group_id: number
  name: string
  start_date: Date
  end_date: Date
  type: string
}

export interface Group {
  id: number | null
  course: number | null
  name: string
  teacher_name: string
  students?: Student[]
  specialty?: Specialty
  practices?: Practice[]
}

export interface GroupsState {
  groups: Group[]
  currentGroup: Group | null
}

const initialState: GroupsState = {
  groups: [],
  currentGroup: {
    id: null,
    course: null,
    name: '',
    teacher_name: '',
    students: [],
    specialty: {
      id: null,
      specialty: '',
      qualification: '',
      code: ''
    },
    practices: []
  }
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
    createGroup: (
      state,
      action: PayloadAction<{ id: number; name: string; course: number; teacher_name: string }>
    ) => {
      state.groups.push(action.payload)
    },
    addStudent: (state, action: PayloadAction<any>) => {
      if (state.currentGroup && state.currentGroup.id === action.payload.student_group_id) {
        state.currentGroup.students?.push(action.payload)
      }
    },
    updateStudentS: (state, action: PayloadAction<any>) => {
      if (state.currentGroup) {
        state.currentGroup.students = state.currentGroup.students?.map((el: any) =>
          el.id === action.payload.id ? { ...el, ...action.payload } : el
        )
      }
    },
    deleteGroup: (state, action: PayloadAction<number>) => {
      state.groups = state.groups.filter((el: any) => el.id !== action.payload)
      if (state.currentGroup?.id === action.payload) {
        state.currentGroup = null
      }
    },
    updateGroupS: (
      state,
      action: PayloadAction<{ id: number; name: string; course: number; teacher_name: string }>
    ) => {
      state.currentGroup = { ...state.currentGroup, ...action.payload }
      state.groups = state.groups.map((el: any) =>
        el.id === action.payload.id ? { ...el, ...action.payload } : el
      )
    },
    removeStudentFromCurrent: (state, action: PayloadAction<number>) => {
      if (state.currentGroup && state.currentGroup.students) {
        state.currentGroup.students = state.currentGroup.students.filter(
          (s) => s.id !== action.payload
        )
      }
    },
    removePracticeFromCurrent: (state, action: PayloadAction<number>) => {
      if (state.currentGroup && state.currentGroup.practices) {
        state.currentGroup.practices = state.currentGroup.practices.filter(
          (s) => s.id !== action.payload
        )
      }
    },
    addSpecialtyToGroupStore: (state, action: PayloadAction<Specialty>) => {
      if (state.currentGroup !== null) {
        state.currentGroup.specialty = action.payload
      }
    },
    addPractice: (state, action: PayloadAction<Practice>) => {
      if (state.currentGroup !== null) {
        if (!state.currentGroup.practices) {
          state.currentGroup.practices = []
        }
        state.currentGroup.practices.push(action.payload)
      }
    },
    updatePracticeS: (state, action: PayloadAction<Practice>) => {
      if (state.currentGroup) {
        state.currentGroup.practices = state.currentGroup.practices?.map((el: any) =>
          el.id === action.payload.id ? { ...el, ...action.payload } : el
        )
      }
    }
  }
})

export const {
  setGroups,
  setCurrentGroup,
  removeStudentFromCurrent,
  removePracticeFromCurrent,
  createGroup,
  deleteGroup,
  addStudent,
  addSpecialtyToGroupStore,
  addPractice,
  updateStudentS,
  updatePracticeS,
  updateGroupS
} = groupsSlice.actions

export default groupsSlice.reducer
