import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

// Contact
import ContactIndex from '../components/Contact/Index'

// Event
import Event from '../components/Event/Show'
import EventIndex from '../components/Event/Index'

// Group

// Setting
import SettingIndex from '../components/Setting/Index'

// Static
import Feedback from '../components/Static/Feedback'
import Help from '../components/Static/Help'

// User
import Signup from '../components/User/Signup'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/events/:id',
      name: 'event',
      component: Event
    },
    {
      path: '/events',
      name: 'events',
      component: EventIndex
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactIndex
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingIndex
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback
    },
    {
      path: '/help',
      name: 'help',
      component: Help
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    }
  ]
})
