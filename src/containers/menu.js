import aside1 from '@/assets/icon/aside1.svg'
import aside2 from '@/assets/icon/aside2.svg'
import aside3 from '@/assets/icon/aside3.svg'
import aside4 from '@/assets/icon/aside4.svg'
import aside5 from '@/assets/icon/aside5.svg'

const menu = [
    {   
        title: '维修单',
        key: '/repairOrder',
        icon: aside1,
        auth: [1]
    },
    {
        title: '人员管理',
        key: '/personManage',
        icon: aside3,
        auth: [1]
    },
    {
        title: '用户管理',
        key: '/userManage',
        icon: aside2,
        auth: [1]
    },
    {
        title: '知识库',
        key: '/knowledgeBase',
        icon: aside4,
        auth: [1]
    },
    {
        title: '报表',
        key: '/about',
        icon: aside5,
        auth: [1]
    }
]

export default menu
