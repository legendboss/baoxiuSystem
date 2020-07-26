import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Popconfirm, Badge, message } from 'antd'
import '@/style/view-style/personManage.scss'
import axios from '@/api'
import { API } from '@/api/config'
const { Search } = Input

export default class PersonManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '', // 工程师
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            addEngineerVisible: false,
            sureLoading: false,
            reportVisible: false,
            reportData: {}
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        this.getFixUserList()
    }

    // 获取人员管理列表
    getFixUserList = () => {
        const { name, startPage, pageSize } = this.state
        const model = {
            name,
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${API}/fixUserList`, { params: model })
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
                this.setState({ listLoading: false })
            })
            .catch(err => {
                this.setState({ listLoading: false })
            })
    }

    // 人员管理列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getFixUserList()
            }
        )
    }

    onEngineerSearch = e => {
        this.setState(
            {
                name: e
            },
            () => {
                this.getFixUserList()
            }
        )
    }

    // 气泡确认
    onAbleUser = id => {
        axios
            .post(`${API}/delFixUser`, id)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('设置成功！')
                    this.getFixUserList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // model 确定
    arHandleOk = e => {
        this.setState({ sureLoading: true })
        axios
            .post(`${API}/addFixUser`, e)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('添加成功！')
                    this.onCloseResetModel()
                    this.getFixUserList()
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ sureLoading: false })
            })
            .catch(err => {
                this.setState({ sureLoading: false })
            })
    }

    // 关闭销毁弹窗
    onCloseResetModel = () => {
        this.setState({
            addEngineerVisible: false
        })
        this.formRef.current.resetFields()
    }

    // 查看月报
    onSeeReport = id => {
        this.setState({ reportVisible: true })
        axios
            .delete(`${API}/ShowMonthReport?uid=${id}`)
            .then(res => {
                if (res.data.code === 200) {
                    const newReportData = res.data.data
                    newReportData.addTime = newReportData.addTime.slice(0, 10)
                    this.setState({
                        reportData: newReportData
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const {
            startPage,
            listData,
            total,
            listLoading,
            addEngineerVisible,
            sureLoading,
            reportData,
            reportVisible
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
                title: '状态',
                render: (text, record) => (
                    <div>
                        {record.status === 1 ? (
                            <Badge status='processing' text='启用' />
                        ) : (
                            <Badge status='default' text='禁用' />
                        )}
                    </div>
                )
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Space>
                        {record.status === 1 ? (
                            <Popconfirm
                                title='确定禁用该用户吗？'
                                onConfirm={() => {
                                    this.onAbleUser(record.id)
                                }}
                                okText='确定'
                                cancelText='取消'>
                                <Button type='link' style={{ padding: '0' }}>
                                    禁用
                                </Button>
                            </Popconfirm>
                        ) : (
                            <Popconfirm
                                title='确定启用该用户吗？'
                                onConfirm={() => {
                                    this.onAbleUser(record.id)
                                }}
                                okText='确定'
                                cancelText='取消'>
                                <Button type='link' style={{ padding: '0' }}>
                                    启用
                                </Button>
                            </Popconfirm>
                        )}
                        {record.flag && (
                            <Button
                                type='link'
                                style={{ padding: '0' }}
                                onClick={() => {
                                    this.onSeeReport(record.id)
                                }}>
                                查看月报
                            </Button>
                        )}
                    </Space>
                )
            }
        ]

        return (
            <Layout className='personManage animated fadeIn'>
                <div className='personManage-box'>
                    <div>
                        <label htmlFor='工程师'>工程师: </label>
                        <Search placeholder='请输入工程师' onSearch={this.onEngineerSearch} />
                    </div>
                    <Button
                        className='add-engineer'
                        type='primary'
                        onClick={() => {
                            this.setState({ addEngineerVisible: true })
                        }}>
                        ＋ 添加工程师
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
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: [10, 24],
                            onChange: (page, pageSize) => this.handleTableChange(page, pageSize)
                        }}
                    />
                </div>
                <Modal
                    wrapClassName='add-engineer-modal'
                    title='添加工程师'
                    visible={addEngineerVisible}
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
                                    className='add-engineer-sure'
                                    loading={sureLoading}>
                                    确定
                                </Button>
                                <Button className='add-engineer-sure' onClick={this.onCloseResetModel}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>

                {/* 查看月报 */}
                <Modal
                    wrapClassName='report-detail-modal'
                    title='月报详情'
                    visible={reportVisible}
                    onCancel={() => {
                        this.setState({ reportVisible: false })
                    }}
                    footer={null}>
                    <div className='rd-box'>
                        <Row span={24}>
                            <Col span={24}>
                                <span>姓名：</span>
                                <span>{reportData.userName}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={24}>
                                <span>本月完成量：</span>
                                <span>{reportData.total}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={24}>
                                <span>自我评价：</span>
                                <span>{reportData.selfEvaluation}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={24}>
                                <span>日期：</span>
                                <span>{reportData.addTime}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={24}>
                                <span>外派记录：</span>
                                <span>{reportData.outReport}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={24}>
                                <span>问题难点分析：</span>
                                <span>{reportData.question}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={24}>
                                <span>经验分享：</span>
                                <span>{reportData.suggestion}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={24}>
                                <span>总结：</span>
                                <span>{reportData.summary}</span>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </Layout>
        )
    }
}
