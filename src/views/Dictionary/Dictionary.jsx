import React, { Component } from 'react'
import { Layout, Button, Input, Table, Popconfirm, Modal, Form, Row, Col, Select, message } from 'antd'
import axios from '@/api'
import { API } from '@/api/config'
import '@/style/view-style/dictionary.scss'

const { Option } = Select

class Dictionary extends Component {
    state = {
        dadDir: [],
        listLoading: false,
        listData: [],
        addZdVisible: false,
        addZdSureLoading: false
    }

    formRef = React.createRef()

    componentDidMount() {
        this.getAllDirectoryList()
        this.getDirectoryList()
    }

    // 全部字典列表
    getAllDirectoryList = () => {
        this.setState({ listLoading: true })
        axios
            .get(`${API}/allDirectoryList`, {})
            .then(res => {
                const data = res.data.data
                if (res.data.code === 200) {
                    this.setState({
                        listData: data
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

    // 父字典列表
    getDirectoryList = () => {
        axios
            .get(`${API}/directoryList`, {})
            .then(res => {
                const data = res.data.data
                if (res.data.code === 200) {
                    this.setState({
                        dadDir: data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 关闭销毁添加字典弹窗
    onCloseResetModel = () => {
        this.setState({
            addZdVisible: false
        })
        this.formRef.current.resetFields()
    }

    // 添加字典
    arHandleOk = e => {
        console.log(e)
        const model = {
            name: e.name,
            parentId: e.parentId || ''
        }
        this.setState({ addZdSureLoading: true })
        axios
            .get(`${API}/addDirectory`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    message.success('添加成功！')
                    this.onCloseResetModel()
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ addZdSureLoading: false })
            })
            .catch(err => {
                this.setState({ addZdSureLoading: false })
            })
    }

    // 删除字典
    onDeleteDirectory = e => {
        console.log(e)
        axios
            .delete(`${API}/delDirectory?id=${e}`)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('删除成功！')
                    this.getAllDirectoryList()
                    this.getDirectoryList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const { dadDir, listLoading, listData, addZdVisible, addZdSureLoading } = this.state
        const columns = [
            {
                title: '类别',
                dataIndex: 'name',
                width: '80%'
            },
            {
                title: '操作',
                dataIndex: 'age',
                width: '20%',
                render: (text, record) => (
                    <Popconfirm
                        title='确定删除该数据吗？'
                        onConfirm={() => {
                            this.onDeleteDirectory(record.id)
                        }}
                        okText='确定'
                        cancelText='取消'>
                        <Button type='link' style={{ padding: '0' }}>
                            删除
                        </Button>
                    </Popconfirm>
                )
            }
        ]

        return (
            <Layout className='dictionary animated fadeIn'>
                <div className='dictionary-box'>
                    <Button
                        className='add-user'
                        type='primary'
                        onClick={() => {
                            this.setState({ addZdVisible: true })
                        }}>
                        ＋ 添加字典
                    </Button>
                    <Table
                        rowKey='id'
                        columns={columns}
                        dataSource={listData}
                        loading={listLoading}
                        expandRowByClick
                        pagination={false}
                    />
                </div>

                <Modal
                    wrapClassName='add-zd-modal'
                    title='添加字典'
                    visible={addZdVisible}
                    onCancel={this.onCloseResetModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={21}>
                                    <Form.Item label='父级：' name='parentId'>
                                        <Select>
                                            {dadDir.map(item => {
                                                return (
                                                    <Option key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='数值：'
                                        name='name'
                                        rules={[{ required: true, message: '请输入数值!' }]}>
                                        <Input placeholder='请输入数值' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-user-sure'
                                    loading={addZdSureLoading}>
                                    确定
                                </Button>
                                <Button className='add-user-sure' onClick={this.onCloseResetModel}>
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

export default Dictionary
