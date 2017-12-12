import indexPage from '../views/indexPage/indexPage.vue'
import doctorPage from '../views/doctorPage/doctorPage.vue'
import teacherPage from '../views/teacherPage/teacherPage.vue'
import studentPage from '../views/studentPage/studentPage.vue'
import treat from '../views/doctorPage/treat.vue'

export default [{
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
  component: doctorPage
},
{
  name: 'treat',
  path: '/treat',
  component: treat
}
]
