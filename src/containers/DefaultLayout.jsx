import React, { Component } from 'react'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Layout, BackTop, message, Modal, Input } from 'antd'
import routes from '@/routes'
import { menuToggleAction } from '@/store/actionCreators'
// import avatar from '@/assets/images/user.jpg'
import menu from './menu'
import '@/style/layout.scss'

import AppHeader from './AppHeader.jsx'
import AppAside from './AppAside.jsx'
import AppFooter from './AppFooter.jsx'
import AppDataShow from './AppDataShow.jsx'

const { Content } = Layout

class DefaultLayout extends Component {
    state = {
        // avatar,
        show: true,
        menu: [],
        dataShow: [100, 200, 300, 400],
        pwVisible: false,
        newPw: '',
        newSurePw: ''
    }

    isLogin = () => {
        if (!localStorage.getItem('user')) {
            this.props.history.push('/login')
        } else {
            this.setState({
                menu: this.getMenu(menu)
            })
        }
    }

    // loginOut = () => {
    //     localStorage.clear()
    //     this.props.history.push('/login')
    //     message.success('登出成功!')
    // }

    modifyPassword = () => {
        this.setState({
            pwVisible: true,
        });
    }
    
    getMenu = menu => {
        let newMenu,
            auth = JSON.parse(localStorage.getItem('user')).auth
        if (!auth) {
            return menu
        } else {
            newMenu = menu.filter(res => res.auth && res.auth.indexOf(auth) !== -1)
            return newMenu
        }
    }

    componentDidMount() {
        this.isLogin()
    }

    // 新密码输入
    onNewPwChange = (e) => {
        this.setState({newPw: e.target.value})
    }

    // 确认密码输入
    onNewSurePwChange = (e) => {
        this.setState({newSurePw: e.target.value})
    }

    // model 确认
    cpHandleOk= ()=> {
        const {newPw, newSurePw} = this.state
        console.log(newPw, newSurePw)
        if(newPw==='') {
            message.error('请输入密码!')
            return false
        }
        if(newSurePw==='') {
            message.error('请输入确认密码!')
            return false
        }
        if(newPw!==newSurePw) {
            message.error('两次输入的密码不一致，请重新输入!')
            return false
        }
        // TODO 掉接口
        this.setState({pwVisible: false})
    }


    render() {
        const {pwVisible, newPw, newSurePw} = this.state
        let { menuClick, menuToggle } = this.props
        let { auth } = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')) : ''
        return (
            <Layout className='app'>
                <BackTop />
                <AppAside menuToggle={menuToggle} menu={this.state.menu} />
                <Layout style={{ marginLeft: menuToggle ? '80px' : '200px', minHeight: '100vh' }}>
                    <AppHeader
                        menuToggle={menuToggle}
                        menuClick={menuClick}
                        avatar={this.state.avatar}
                        show={this.state.show}
                        loginOut={this.loginOut}
                        modifyPassword={this.modifyPassword}
                    />
                    <Content className='content'>
                        <AppDataShow dataShow={this.state.dataShow}/>
                        <Switch>
                            {routes.map(item => {
                                return (
                                    <Route
                                        key={item.path}
                                        path={item.path}
                                        exact={item.exact}
                                        render={props =>
                                            !auth ? (
                                                <item.component {...props} />
                                            ) : item.auth && item.auth.indexOf(auth) !== -1 ? (
                                                <item.component {...props} />
                                            ) : (
                                                // 这里也可以跳转到 403 页面
                                                <Redirect to='/404' {...props} />
                                            )
                                        }></Route>
                                )
                            })}
                            <Redirect to='/404' />
                        </Switch>
                    </Content>
                    <AppFooter />
                </Layout>
                <Modal
                    wrapClassName='change-password-modal'
                    title="修改密码"
                    visible={pwVisible}
                    onOk={this.cpHandleOk}
                    onCancel={()=> { this.setState({pwVisible: false})}}
                    >
                    <div>
                        <div style={{marginBottom: '25px'}}>
                            <label htmlFor="">新密码：</label>
                            <Input placeholder="请输入密码"  type='password' value={newPw} onChange={this.onNewPwChange}/>
                        </div>
                        <div>
                            <label htmlFor="">确认新密码：</label>
                            <Input placeholder="请输入密码"  type='password' value={newSurePw} onChange={this.onNewSurePwChange}/>
                        </div>
                    </div>
                </Modal>
            </Layout>
        )
    }
}

const stateToProp = state => ({
    menuToggle: state.menuToggle
})

const dispatchToProp = dispatch => ({
    menuClick() {
        dispatch(menuToggleAction())
    }
})

export default withRouter(
    connect(
        stateToProp,
        dispatchToProp
    )(DefaultLayout)
)
