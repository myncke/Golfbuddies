import Vue from 'vue'
import Router from 'vue-router'

// Contact
import ContactIndex from '../components/Contact/Index'

// Event
import Event from '../components/Event/Show'
import EventIndex from '../components/Event/Index'
import EventNew from '../components/Event/New'

// Group
import Group from '../components/Group/Show'
import GroupIndex from '../components/Group/Index'
import GroupNew from '../components/Group/New'

// Setting
import SettingIndex from '../components/Setting/Index'

// Static
import Feedback from '../components/Static/Feedback'
import Help from '../components/Static/Help'

// User
import Profile from '../components/User/Profile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: EventIndex
    },
    {
      path: '/event/new',
      name: 'newEvent',
      component: EventNew
    },
    {
      path: '/event/:id',
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
      component: GroupIndex
    },
    {
      path: '/group/new',
      name: 'newGroup',
      component: GroupNew
    },
    {
      path: '/group/:id',
      name: 'group',
      component: Group
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
      path: '/profile/:id?',
      name: 'profile',
      component: Profile
    }
  ]
})
