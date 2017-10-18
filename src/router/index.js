import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

// Contact
import ContactIndex from '../components/Contact/Index'

// Event
import Event from '../components/Event/Show'
import EventIndex from '../components/Event/Index'

// Group
import ClubsView from '../components/Group/ClubsView.vue'
import DetailView from '../components/Group/DetailView.vue'

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
      path: '/groups',
      name: 'groups',
      component: ClubsView
    },
    {
      path: '/group/:clubId',
      name: 'groupDetails',
      component: DetailView
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
