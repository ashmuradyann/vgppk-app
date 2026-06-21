import axios from 'axios'

// const DEV_URL = 'http://127.0.0.1:8000/api'
const DEV_URL = 'https://muradyan.studio-av.ru/api'

export const $api = axios.create({
  baseURL: DEV_URL,
  timeout: 10000,
  withCredentials: true
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

export const updateGroupR = (id: number, name: string, course: number, teacher_name: string) =>
  $api
    .put(`/groups/${id}`, {
      name,
      course,
      teacher_name
    })
    .then((res) => res.data)
    .catch((err) => console.log(err))

type importStudentsT = {
  name: string
  course: number
  teacher_name: string
  students: string[]
}

export const importStudents = (studentsData: importStudentsT) =>
  $api
    .post(`/groups/import`, studentsData)
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const addSpecialtyToGroupRequest = (group_id: number, specialty_id: number) =>
  $api
    .post(`/groups/addSpecialty`, { group_id, specialty_id })
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

export const updateStudentR = (
  id: number,
  full_name: string,
  inner_supervisor: string,
  practice_base_id: number,
  practice_supervisor: string
) =>
  $api
    .put(`/students/update/${id}`, {
      full_name,
      inner_supervisor,
      practice_base_id,
      practice_supervisor
    })
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

export const updateSpecialty = (
  id: number,
  code: string,
  specialty: string,
  qualification: string
): Promise<any> =>
  $api
    .put(`/specialties`, {
      id,
      code,
      specialty,
      qualification
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const deleteSpecialty = (id: number): Promise<any> =>
  $api
    .delete(`/specialties/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getPracticeBases = () =>
  $api
    .get('/practice_bases')
    .then((res) => res.data)
    .catch((err) => console.log(err))

export const createPracticeBase = (organisation: string, supervisors: string): Promise<any> =>
  $api
    .post(`/practice_bases`, {
      organisation,
      supervisors
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const updatePracticeBase = (
  id: number,
  organisation: string,
  supervisors: string
): Promise<any> =>
  $api
    .put(`/practice_bases`, {
      id,
      organisation,
      supervisors
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const deletePracticeBase = (id: number): Promise<any> =>
  $api
    .delete(`/practice_bases/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const createPractice = (
  name: string,
  start_date: string,
  end_date: string,
  type: string,
  student_group_id: number
): Promise<any> =>
  $api
    .post(`/groups/${student_group_id}/practices`, {
      name,
      start_date,
      end_date,
      type
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const updatePracticeR = (
  id: number,
  name: string,
  start_date: string,
  end_date: string,
  type: string,
  student_group_id: number
): Promise<any> =>
  $api
    .put(`/groups/${student_group_id}/practices/${id}`, {
      name,
      start_date,
      end_date,
      type
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const deletePractice = (student_group_id: number, practice_id: number): Promise<any> =>
  $api
    .delete(`/groups/${student_group_id}/practices/${practice_id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getStudentCharacteristicR = (
  student_id: number,
  group_id: number,
  practice_id: number
): Promise<any> =>
  $api
    .post(
      `/student_characteristic`,
      {
        student_id,
        group_id,
        practice_id
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getCharacteristicGroupR = (group_id: number, practice_id: number): Promise<any> =>
  $api
    .post(
      `/characteristic_group`,
      {
        group_id,
        practice_id
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getStudentCertificatSheetR = (
  student_id: number,
  group_id: number,
  practice_id: number
): Promise<any> =>
  $api
    .post(
      `/student_certificat_sheet`,
      {
        student_id,
        group_id,
        practice_id
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getCertificatSheetGroupR = (group_id: number, practice_id: number): Promise<any> =>
  $api
    .post(
      `/certificat_sheet_group`,
      {
        group_id,
        practice_id
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getOrderingDocumentR = (group_id: number, practice_id: number): Promise<any> =>
  $api
    .post(
      `/ordering_document`,
      {
        group_id,
        practice_id
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getReviewDocumentR = (
  student_id: number,
  group_id: number,
  practice_id: number
): Promise<any> =>
  $api
    .post(
      `/review_document`,
      {
        student_id,
        group_id,
        practice_id
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getAgreementDocumentR = (
  basesIds: number[],
  group_id: number,
  selectedPracticeId: number
): Promise<any> =>
  $api
    .post(
      `/agreement_document`,
      {
        basesIds: JSON.stringify(basesIds),
        group_id,
        selectedPracticeId
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getDirectionDocumentR = (
  group_id: number,
  practice_id: number,
  student_id: number
): Promise<any> =>
  $api
    .post(
      `/direction_document`,
      {
        group_id,
        practice_id,
        student_id
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })

export const getDirectionGroupDocumentR = (
  group_id: number,
  selectedPracticeId: number
): Promise<any> =>
  $api
    .post(
      `/direction_group_document`,
      {
        group_id,
        practice_id: selectedPracticeId
      },
      {
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw err
    })
