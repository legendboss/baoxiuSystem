import React, { Component } from 'react'
import { Layout, Button, Input, Table, Popconfirm, Modal, Form, Row, Col, Select } from 'antd'
import '@/style/view-style/dictionary.scss'

const { Search } = Input
const { Option } = Select

class Dictionary extends Component {
    state = {
        name: '',
        addZdVisible: true,
        addZdSureLoading: false
    }

    formRef = React.createRef()

    componentDidMount() {}

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

    // 关闭销毁添加字典弹窗
    onCloseResetModel = () => {
        this.setState({
            addZdVisible: false
        })
        this.formRef.current.resetFields()
    }

    render() {
        const { addZdVisible, addZdSureLoading } = this.state
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
                        title='确定删除该用例吗？'
                        onConfirm={() => {
                            this.onDeleteCases(record.id)
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

        const data = [
            {
                key: 1,
                name: '系统',
                children: [
                    {
                        key: 11,
                        name: '系统1'
                    },
                    {
                        key: 12,
                        name: '系统2'
                    },
                    {
                        key: 13,
                        name: '系统3'
                    }
                ]
            },
            {
                key: 2,
                name: '软件名',
                children: [
                    {
                        key: 131,
                        name: '软件名1'
                    }
                ]
            }
        ]

        return (
            <Layout className='dictionary animated fadeIn'>
                <div className='dictionary-box'>
                    <div>
                        <label htmlFor='名称'>名称: </label>
                        <Search placeholder='请输入名称' onSearch={this.onNameSearch} />
                    </div>
                    <Button
                        className='add-user'
                        type='primary'
                        onClick={() => {
                            this.setState({ addZdVisible: true })
                        }}>
                        ＋ 添加字典
                    </Button>
                    <Table columns={columns} dataSource={data} />
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
                                    <Form.Item
                                        label='父级：'
                                        name='name'
                                        rules={[{ required: true, message: '请输入姓名!' }]}>
                                        <Select>
                                            <Option value='0'>系统</Option>
                                            <Option value='1'>硬件</Option>
                                            <Option value='2'>软件</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={21}>
                                    <Form.Item
                                        label='数值：'
                                        name='phone'
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
