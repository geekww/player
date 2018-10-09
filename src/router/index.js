import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const Recommend = (resolve) => {
    import('@/components/recommend/recommend').then( (module) => {
        resolve(module)
    } )
}
const Singer = (resolve) => {
    import('@/components/singer/singer').then( (module) => {
        resolve(module)
    } )
}
const Rank = (resolve) => {
    import('@/components/rank/rank').then( (module) => {
        resolve(module)
    } )
}
const Search = (resolve) => {
    import('@/components/search/search').then( (module) => {
        resolve(module)
    } )
}
const SingerDetail = (resolve) => {
    import('@/components/singerDetail/singerDetail').then( (module) => {
        resolve(module)
    } )
}
const RecommendDetail = (resolve) => {
    import('@/components/recommendDetail/recommendDetail').then( (module) => {
        resolve(module)
    } )
}
const RankDetail = (resolve) => {
    import('@/components/rankDetail/rankDetail').then( (module) => {
        resolve(module)
    } )
}
const Login = (resolve) => {
    import('@/components/login/login').then( (module) => {
        resolve(module)
    } )
}
const Person = (resolve) => {
    import('@/components/person/person').then( (module) => {
        resolve(module)
    } )
}

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
    	path: '/recommend',
    	component: Recommend,
        meta: {
            index: 0
        },
        children: [
            {
                path: ':id',
                component: RecommendDetail
            },
            
        ]
    },
    {
    	path: '/singer',
    	component: Singer,
        meta: {
            index: 1
        },
        children: [
            {
                path: ':id',
                component: SingerDetail
            }
        ]
    },
    {
    	path: '/rank',
    	component: Rank,
         meta: {
            index: 2
        },
        children: [
            {
                path: ':id',
                component: RankDetail
            }        
        ]
    },
    {
    	path: '/search',
    	component: Search,
        meta: {
            index: 3
        },
        children: [
            {
                path: ':id',
                component: SingerDetail
            }
        ]
    },   
    {
        path: '*',
        redirect: '/recommend'
    },
    {
        path: '/login',
        component: Login
    },          
    {
        path: '/person',
        component: Person
    },
  ]
})
