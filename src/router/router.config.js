import indexPage from '../views/indexPage/indexPage.vue'
import doctorPage from '../views/doctorPage/doctorPage.vue'
import teacherPage from '../views/teacherPage/teacherPage.vue'
import studentPage from '../views/studentPage/studentPage.vue'
import drugEntry from '../views/doctorPage/drug-entry/drug-entry.vue'

export default [
  {
    name: 'index',
    path: '/',
    component: indexPage
  },
  {
    name: 'teacherPage',
    path: '/teacherPage',
    component: teacherPage
  },
  {
    name: 'studentPage',
    path: '/studentPage',
    component: studentPage
  },

  {
    name: 'doctorPage',
    path: '/doctorPage',
    component: doctorPage,
    children: [
      {
        name: 'drugEntry',
        path: '/doctorPage/drugEntry',
        component: drugEntry
      }
    ]
  }
]
