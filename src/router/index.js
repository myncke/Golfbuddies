import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

// Contact
import ContactIndex from '../components/Contact/Index'

// Event
import Event from '../components/Event/Show'
import EventIndex from '../components/Event/Index'
import EventNew from '../components/Event/New'

// Group
import ClubsView from '../components/Group/ClubsView.vue'
import DetailView from '../components/Group/DetailView.vue'
import NewClubView from '../components/Group/New.vue'

// Setting
import SettingIndex from '../components/Setting/Index'

// Static
import Feedback from '../components/Static/Feedback'
import Help from '../components/Static/Help'

// User
import Signup from '../components/User/Signup'
import Profile from '../components/User/Profile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/events/new',
      name: 'newEvent',
      component: EventNew
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
      path: '/groups/new',
      name: 'newGroup',
      component: NewClubView
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
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    }
  ]
})
