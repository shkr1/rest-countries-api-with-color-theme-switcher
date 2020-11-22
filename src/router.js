import Vue from 'vue'
import Router from 'vue-router'

import Countries from './views/Countries'
import Country from './views/Country'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '*', redirect: { name: 'countries' } },
        {
            path: '/',
            name: 'countries',
            component: Countries
        },
        {
            path: '/countries/:id',
            name: 'country',
            component: Country
        }
    ]
});

export default router;