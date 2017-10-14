import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Event from '../components/Event/Show'
import EventIndex from '../components/Event/Index'
import ContactIndex from '../components/Contact/Index'
import SettingIndex from '../components/Setting/Index'
import Feedback from '../components/Static/Feedback'
import Help from '../components/Static/Help'

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
    }
  ]
})
