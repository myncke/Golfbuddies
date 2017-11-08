import Vue from 'vue'
import Router from 'vue-router'

// Contact
import ContactIndex from '../components/Contact/Index'

// Event
import Event from '../components/Event/Show'
import EventIndex from '../components/Event/Index'
import EventNew from '../components/Event/New'
import EventHistory from '../components/Event/History'

// Group
import Group from '../components/Group/Show'
import GroupIndex from '../components/Group/Index'
import GroupNew from '../components/Group/New'

// LocationBroadcast
import LocationBroadcast from '../components/LocationBroadcast/Show'
import LocationBroadcastNew from '../components/LocationBroadcast/New'

// Setting
import SettingIndex from '../components/Setting/Index'

// Static
import Feedback from '../components/Static/Feedback'
import Help from '../components/Static/Help'

// User
import Profile from '../components/User/Show'
import Feed from '../components/Main/Feed'

// Main
import GeneralCalendarView from '../components/Main/GeneralCalendarView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/event/new',
      name: 'newEvent',
      component: EventNew
    },
    {
      path: '/event/edit/:id',
      name: 'editEvent',
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
      path: '/history',
      name: 'history',
      component: EventHistory
    },
    {
      path: '/groups/:type?',
      name: 'groups',
      component: GroupIndex
    },
    {
      path: '/group/new',
      name: 'newGroup',
      component: GroupNew
    },
    {
      path: '/group/edit/:id',
      name: 'editGroup',
      component: GroupNew
    },
    {
      path: '/group/:id',
      name: 'group',
      component: Group
    },
    {
      path: '/locationBroadcast/new',
      name: 'newLocationBroadcast',
      component: LocationBroadcastNew
    },
    {
      path: '/locationBroadcast/:id',
      name: 'locationBroadcast',
      component: LocationBroadcast
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
    },
    {
      path: '/feed',
      name: 'feed',
      component: Feed
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: GeneralCalendarView
    },
    {
      path: '/',
      name: 'root',
      component: Feed
    }
  ]
})
