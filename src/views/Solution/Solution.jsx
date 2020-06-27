import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Select, message } from 'antd'
import axios from '@/api'
import { API } from '@/api/config'
import '@/style/view-style/solution.scss'

export default class Solution extends Component {
    constructor(props) {
        super(props)
        this.state = {
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            addUseCasesVisible: false
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        this.getFixList()
    }

    // 获取解决方案列表
    getFixList = () => {
        const { startPage, pageSize } = this.state
        const model = {
            startPage,
            pageSize
        }
        this.setState({ listLoading: true })
        axios
            .get(`${API}/fixList`, { params: model })
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

    // 解决方案列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getFixList()
            }
        )
    }

    // 提交打开model
    onOpenSubmit = e => {
        this.setState({
            addUseCasesVisible: true
        })
    }

    // model 确定
    arHandleOk = e => {
        console.log(e)
    }

    // 关闭销毁弹窗
    onCloseResetModel = () => {
        this.setState({
            addUseCasesVisible: false
        })
        this.formRef.current.resetFields()
    }

    render() {
        const { startPage, listData, total, listLoading, addUseCasesVisible } = this.state

        const columns = [
            {
                title: '工程师姓名',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '类型',
                dataIndex: 'age',
                key: 'age',
                align: 'left'
            },
            {
                title: '软件名',
                dataIndex: 'age',
                key: 'age',
                align: 'left'
            },
            {
                title: '解决方案',
                dataIndex: 'address',
                key: 'age',
                align: 'left'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <Space>
                        <Button
                            type='link'
                            style={{ padding: '0' }}
                            onClick={() => {
                                this.onOpenSubmit(text)
                            }}>
                            提交
                        </Button>
                        <Button type='link' style={{ padding: '0' }}>
                            忽略
                        </Button>
                    </Space>
                )
            }
        ]

        return (
            <Layout className='solution animated fadeIn'>
                <div className='solution-box'>
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
                    wrapClassName='add-useCases-modal'
                    title='解决方案'
                    visible={addUseCasesVisible}
                    onCancel={this.onCloseResetModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={21}>
                                    <Form.Item
                                        label='类型：'
                                        name='mType'
                                        rules={[{ required: true, message: '请输入类型!' }]}>
                                        <Input placeholder='请输入类型' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='关键字：'
                                        name='mKeyword'
                                        rules={[{ required: true, message: '请输入关键字!' }]}>
                                        <Select mode='tags' style={{ width: '300px' }}></Select>
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='解决方法：'
                                        name='mSolveWay'
                                        rules={[{ required: true, message: '请输入解决方法!' }]}>
                                        <Input.TextArea />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-engineer-sure'
                                    loading={this.state.loading}>
                                    确定
                                </Button>
                                <Button className='add-engineer-sure' onClick={this.onCloseResetModel}>
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
