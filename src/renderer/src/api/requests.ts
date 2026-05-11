import axios from 'axios'

const DEV_URL = 'vgppk-server.onrender.com'

export const $api = axios.create({
  baseURL: `https://${DEV_URL}/`,
  timeout: 10000
})

export const getGroups = () =>
  $api
    .get('/groups')
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const getGroupsById = (id: number) =>
  $api
    .get(`/groups/${id}`)
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const destroyGroup = (id: number) =>
  $api
    .delete(`/groups/${id}`)
    .then((res) => res.data)
    .catch((err) => console.log(err))

type importStudentsT = {
  name: string
  teacher_name: string
  academic_year: string
  students: string[]
  specialty: string
}

export const importStudents = (studentsData: importStudentsT) =>
  $api
    .post(`/groups/import`, studentsData)
    .then((res) => res.data)
    .catch((err) => console.log(err))

type studentT = {
  name: string
  group_id: number
}

export const createStudent = (studentT: studentT) =>
  $api
    .post(`/students/create`, studentT)
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const deleteStudent = (id: number) =>
  $api
    .delete(`/students/${id}`)
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const getSpecialties = () =>
  $api
    .get('/specialties')
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const createSpecialty = (
  code: string,
  specialty: string,
  qualification: string
): Promise<any> =>
  $api
    .post(`/specialties`, {
      code,
      specialty,
      qualification
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })
