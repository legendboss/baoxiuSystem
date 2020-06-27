import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Divider, message } from 'antd'
import '@/style/view-style/userManage.scss'
import axios from '@/api'
import { API } from '@/api/config'
const { Search } = Input

export default class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '', // 用户
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            addUserVisible: false,
            addUserSureLoading: false,
            repairHistoryVisible: false,
            deviceManageVisible: false
        }
    }

    formRef = React.createRef()
    formDeviceRef = React.createRef()

    componentDidMount() {
        this.getUserList()
    }

    // 获取用户管理列表
    getUserList = () => {
        const { name, startPage, pageSize } = this.state
        const model = {
            name,
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${API}/UserList`, { params: model })
            .then(res => {
                const data = res.data.data
                if (res.data.code === 200) {
                    this.setState({
                        listData: data.list,
                        total: data.total
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})

        this.setState({ listLoading: false })
    }

    // 用户管理列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getUserList()
            }
        )
    }

    onNameSearch = e => {
        this.setState(
            {
                name: e
            },
            () => {
                this.getUserList()
            }
        )
    }

    // 添加用户 model 确定
    arHandleOk = e => {
        this.setState({ addUserSureLoading: true })
        axios
            .post(`${API}/addUser`, e)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('添加成功！')
                    this.onCloseResetModel()
                    this.getUserList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
        this.setState({ addUserSureLoading: false })
    }

    // 关闭销毁添加用户弹窗
    onCloseResetModel = () => {
        this.setState({
            addUserVisible: false
        })
        this.formRef.current.resetFields()
    }

    // 报修历史打开
    onRepairHistory = () => {
        this.setState({
            repairHistoryVisible: true
        })
    }

    // 设备管理打开
    onDeviceManage = () => {
        this.setState({
            deviceManageVisible: true
        })
    }

    // 关闭销毁设备管理弹窗
    onCloseResetDeviceModel = () => {
        this.setState({
            deviceManageVisible: false
        })
        this.formDeviceRef.current.resetFields()
    }

    render() {
        const {
            startPage,
            listData,
            total,
            listLoading,
            addUserVisible,
            addUserSureLoading,
            repairHistoryVisible,
            deviceManageVisible
        } = this.state

        const columns = [
            {
                title: '姓名',
                dataIndex: 'userName'
            },
            {
                title: '添加时间',
                dataIndex: 'addTimeStr'
            },
            {
                title: '手机号',
                dataIndex: 'phone'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Space>
                        <Button type='link' style={{ padding: '0' }} onClick={this.onRepairHistory}>
                            报修历史
                        </Button>
                        <Button type='link' style={{ padding: '0' }} onClick={this.onDeviceManage}>
                            设备管理
                        </Button>
                    </Space>
                )
            }
        ]

        return (
            <Layout className='userManage animated fadeIn'>
                <div className='userManage-box'>
                    <div>
                        <label htmlFor='姓名'>姓名: </label>
                        <Search placeholder='请输入姓名' onSearch={this.onNameSearch} />
                    </div>
                    <Button
                        className='add-user'
                        type='primary'
                        onClick={() => {
                            this.setState({ addUserVisible: true })
                        }}>
                        ＋ 添加用户
                    </Button>
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={listData}
                        loading={listLoading}
                        pagination={{
                            showQuickJumper: true,
                            current: startPage,
                            total: total,
                            pageSize: [10],
                            onChange: page => this.handleTableChange(page)
                        }}
                    />
                </div>
                <Modal
                    wrapClassName='add-user-modal'
                    title='添加用户'
                    visible={addUserVisible}
                    onCancel={this.onCloseResetModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={21}>
                                    <Form.Item
                                        label='姓名：'
                                        name='name'
                                        rules={[{ required: true, message: '请输入姓名!' }]}>
                                        <Input placeholder='请输入姓名' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='手机号：'
                                        name='phone'
                                        rules={[
                                            { required: true, message: '请输入正确手机号!' },
                                            { pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确手机号' }
                                        ]}>
                                        <Input placeholder='请输入手机号' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-user-sure'
                                    loading={addUserSureLoading}>
                                    确定
                                </Button>
                                <Button className='add-user-sure' onClick={this.onCloseResetModel}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>

                {/* 报修历史 */}
                <Modal
                    wrapClassName='repair-history-modal'
                    title='报修历史'
                    visible={repairHistoryVisible}
                    onCancel={() => {
                        this.setState({ repairHistoryVisible: false })
                    }}
                    footer={null}>
                    <div className='rh-box'>
                        <div>
                            <p>报修时间：2020.03.02</p>
                            <p>报修内容：电脑坏了</p>
                            <p>保修附件：</p>
                            <div className='img-box'>
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                            </div>
                            <Divider />
                        </div>
                        <div>
                            <p>报修时间：2020.03.02</p>
                            <p>报修内容：电脑坏了</p>
                            <p>报修附件：</p>
                            <div className='img-box'>
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                                <img
                                    src='https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s'
                                    alt=''
                                />
                            </div>
                            <Divider />
                        </div>
                    </div>
                </Modal>

                {/* 设备管理 */}
                <Modal
                    wrapClassName='device-manage-modal'
                    title='设备管理'
                    visible={deviceManageVisible}
                    onCancel={this.onCloseResetDeviceModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formDeviceRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item label='CPU：' name='CPU'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='硬盘：' name='yp'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item label='打印机：' name='dyj'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='内存：' name='nc'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item label='显卡：' name='xk'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='主板：' name='zb'>
                                        <Input placeholder='请输入' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-user-sure'
                                    loading={this.state.loading}>
                                    确定
                                </Button>
                                <Button className='add-user-sure' onClick={this.onCloseResetDeviceModel}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </Layout>
        )
    }
}
