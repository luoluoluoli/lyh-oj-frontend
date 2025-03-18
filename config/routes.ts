export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  { path: '/welcome', icon: 'smile', component: './Welcome', name: '欢迎页' },
  {
    path: '/problemAll',
    component: './Problem/ProblemAll',
    name: '题目列表',
  },
  {
    name: '题目详情',
    path: '/problemset/:id',
    component: './Problem/ProblemDetail',
    hideInMenu: true
  },
  {
    name: '题目详情',
    path: '/problemset/default',
    redirect: '/problemset/1891125985743486978',
    component: './Problem/ProblemDetail',// 重定向到默认 ID
    hideInMenu: false // 保持显示在菜单
  },
  // {
  //   path: '/problemset',
  //   routes: [
  //     { name: '题目详情', path: '/problemset/:id', component: './Problem/ProblemDetail', hideInMenu: true},
  //   ],
  // },

  {
    path: '/AIDateAnalyze',
    component: './testPage',
    name: '数据智能分析',
  },







  {
    path: '/admin',
    icon: 'crown',
    name: '题目管理页',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user' },
      { icon: 'table', path: '/admin/user', component: './Admin/User', name: '用户管理' },
    ],
  },

  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
