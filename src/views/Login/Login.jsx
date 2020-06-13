import React, { Component } from 'react'
import { Layout, Input, Form, Button, message } from 'antd'
// import { withRouter } from 'react-router-dom'
// import axios from '@/api'
// import { API } from '@/api/config'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '@/style/view-style/login.scss'

class Login extends Component {
    state = {
        loading: false
    }

    enterLoading = () => {
        this.setState({
            loading: true
        })
    }

    onFinish = e => {
        console.log(e)
       
        // let { username, password } = values
        // axios
        //     .post(`${API}/login`, { username, password })
        //     .then(res => {
        //         if (res.data.code === 0) {
        //             localStorage.setItem('user', JSON.stringify(res.data.data.user))
        //             localStorage.setItem('token', res.data.data.token)
        //             this.props.history.push('/')
        //             message.success('登录成功!')
        //         } else {
        //             // 这里处理一些错误信息
        //         }
        //     })
        //     .catch(err => {})

        // 这里可以做权限校验 模拟接口返回用户权限标识
        switch (e.username) {
            case 'admin':
                e.auth = 0
                break
            default:
                e.auth = 1
        }

        localStorage.setItem('user', JSON.stringify(e))
        this.enterLoading()
        this.timer = setTimeout(() => {
            message.success('登录成功!')
            this.props.history.push('/')
        }, 2000)
            
        
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }

    render() {
        // const { getFieldDecorator } = this.props.form
        return (
            <Layout className='login animated fadeIn'>
                <div className='model'>
                    <div className='login-form'>
                        <Form onFinish={this.onFinish}>
                            <Form.Item
                                name="username"
                                rules= {[{ required: true, message: '请输入账户名!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    placeholder='账户'
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules= {[{ required: true, message: '请输入密码！' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type='password'
                                    placeholder='密码'
                                    autoComplete="off"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='login-form-button'
                                    loading={this.state.loading}>
                                    登录
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Login
