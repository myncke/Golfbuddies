import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Event from '../components/Event'

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
    }
  ]
})
