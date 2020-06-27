import React, { Component } from 'react'
import {
    Layout,
    Select,
    DatePicker,
    Button,
    Modal,
    Table,
    Form,
    Input,
    Row,
    Col,
    Upload,
    Spin,
    message,
    Badge
} from 'antd'
import '@/style/view-style/repairOrder.scss'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { PlusOutlined } from '@ant-design/icons'
import debounce from 'lodash/debounce'
import axios from '@/api'
import { API } from '@/api/config'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker

export default class RepairOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            orderStatus: '',
            type: '',
            dateTime: ['', ''],
            startPage: 1,
            pageSize: 10,
            listData: [],
            total: 0,
            listLoading: false,
            addRepairVisible: false,
            repairPeopleValue: [],
            fetching: false,
            repairPeopleList: [],
            fileList: [],
            showEngineer: false,
            sysType: '' // 系统类型
        }
        this.fetchRepairPeople = debounce(this.fetchRepairPeople, 800)
    }

    componentDidMount() {
        // 获取列表
        this.getRepairOrderList()
    }

    // 时间选择
    onRageChange = (dates, dateStrings) => {
        const dateTime = [moment(dateStrings[0]).valueOf(), moment(dateStrings[1]).valueOf()]
        this.setState(
            {
                dateTime
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 订单状态
    statusChange = e => {
        this.setState(
            {
                orderStatus: e
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 订单类型
    typeChange = e => {
        this.setState(
            {
                type: e
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 获取维修单列表
    getRepairOrderList = () => {
        const { dateTime, orderStatus, type, startPage, pageSize } = this.state
        const model = {
            contractPhone: '',
            fixId: '',
            orderStatus,
            type,
            begin: dateTime[0],
            end: dateTime[1],
            startPage,
            pageSize
        }
        console.log(model)
        this.setState({ listLoading: true })
        axios
            .get(`${API}/orderList`, { params: model })
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

    // 维修单列表分页
    handleTableChange = (page, pageSize) => {
        console.log(page, pageSize)
        this.setState(
            {
                startPage: page,
                pageSize: pageSize
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 添加维修单
    // 报修人select
    fetchRepairPeople = value => {
        console.log('fetching user', value)
        this.lastFetchId += 1
        const fetchId = this.lastFetchId
        this.setState({ data: [], fetching: true })
        fetch('https://randomuser.me/api/?results=5')
            .then(response => response.json())
            .then(body => {
                if (fetchId !== this.lastFetchId) {
                    // for fetch callback order
                    return
                }
                const data = body.results.map(user => ({
                    text: `${user.name.first} ${user.name.last}`,
                    value: user.login.username
                }))
                this.setState({ repairPeopleList: data, fetching: false })
            })
    }

    onSelectChange = e => {
        console.log(e)
        this.setState({
            sysType: e
        })
    }

    repairPeopleChange = value => {
        this.setState({
            repairPeopleValue: value,
            repairPeopleList: [],
            fetching: false
        })
    }

    // 上传
    handleUpChange = ({ fileList }) => this.setState({ fileList })

    // model 确定
    arHandleOk = e => {
        console.log(e)
    }

    render() {
        const {
            startPage,
            listData,
            total,
            listLoading,
            addRepairVisible,
            repairPeopleValue,
            repairPeopleList,
            fetching,
            fileList,
            showEngineer,
            sysType
        } = this.state

        const columns = [
            {
                title: '姓名',
                dataIndex: 'contractName'
            },
            {
                title: '时间',
                dataIndex: 'addTimeStr'
            },
            {
                title: '内容',
                dataIndex: 'content'
            },
            {
                title: '类型',
                render: (text, record) => (
                    <div>
                        {record.type === 1 ? (
                            <Badge status='processing' text={record.typeStr} />
                        ) : (
                            <Badge status='error' text={record.typeStr} />
                        )}
                    </div>
                )
            },
            {
                title: '状态',
                dataIndex: 'orderStatusStr',
                render: (text, record) => {
                    let statusStr = ''
                    // 0未接单 1已接单 2 已完成 3 已取消
                    switch (record.orderStatus) {
                        case 0:
                            statusStr = 'default'
                            break
                        case 1:
                            statusStr = 'processing'
                            break
                        case 2:
                            statusStr = 'success'
                            break
                        case 3:
                            statusStr = 'error'
                            break

                        default:
                            break
                    }
                    return <Badge status={statusStr} text={record.orderStatusStr} />
                }
            },
            {
                title: '维修人员',
                dataIndex: 'fixName'
            },
            {
                title: '操作',
                render: (text, record) => (
                    <Button type='link' style={{ padding: '0' }}>
                        详情
                    </Button>
                )
            }
        ]

        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className='ant-upload-text'>上传</div>
            </div>
        )
        return (
            <Layout className='repairOrder animated fadeIn'>
                <div className='repairOrder-box'>
                    <div>
                        {/* orderStatus 订单状态 0未接单 1已接单 2 已完成 3 已取消 */}
                        <label htmlFor='订单状态'>状态: </label>
                        <Select defaultValue='' style={{ width: 200 }} onChange={this.statusChange}>
                            <Option value=''>全部</Option>
                            <Option value='0'>未接单</Option>
                            <Option value='1'>已接单</Option>
                            <Option value='2'>已完成</Option>
                            <Option value='3'>已取消</Option>
                        </Select>
                        {/* 类型 0紧急 1一般 */}
                        <label htmlFor='类型'>类型: </label>
                        <Select defaultValue='' style={{ width: 200 }} onChange={this.typeChange}>
                            <Option value=''>全部</Option>
                            <Option value='0'>紧急</Option>
                            <Option value='1'>一般</Option>
                        </Select>
                        <label htmlFor='订单状态'>时间: </label>
                        <RangePicker format='YYYY-MM-DD' showTime locale={locale} onChange={this.onRageChange} />
                    </div>
                    <Button
                        className='add-repair'
                        type='primary'
                        onClick={() => {
                            this.setState({ addRepairVisible: true })
                        }}>
                        ＋ 添加维修单
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
                    wrapClassName='add-repair-modal'
                    title='添加维修单'
                    visible={addRepairVisible}
                    onCancel={() => {
                        this.setState({ addRepairVisible: false })
                    }}
                    footer={null}>
                    <div>
                        <Form onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label='报修人：'
                                        name='contractName'
                                        rules={[{ required: true, message: '请输入报修人!' }]}>
                                        <Select
                                            mode='multiple'
                                            placeholder='请输入报修人'
                                            labelInValue
                                            value={repairPeopleValue}
                                            notFoundContent={fetching ? <Spin size='small' /> : null}
                                            filterOption={false}
                                            onSearch={this.fetchRepairPeople}
                                            onChange={this.repairPeopleChange}>
                                            {repairPeopleList.map(d => (
                                                <Option key={d.value}>{d.text}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label='联系电话：'
                                        name='contractPhone'
                                        rules={[{ required: true, message: '请输入联系电话!' }]}>
                                        <Input placeholder='请输入联系电话' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label='报修内容：'
                                        name='content'
                                        rules={[{ required: true, message: '请输入报修内容!' }]}>
                                        <Input placeholder='请输入报修内容' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label='维修地址：'
                                        name='address'
                                        rules={[{ required: true, message: '请输入维修地址!' }]}>
                                        <Input placeholder='请输入维修地址' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item label='系统类型：' name='fixType'>
                                        <Select placeholder='请选择系统类型' onChange={this.onSelectChange}>
                                            <Option value='0'>系统</Option>
                                            <Option value='1'>硬件</Option>
                                            <Option value='2'>软件</Option>
                                            <Option value='3'>其他</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                {sysType === '2' && (
                                    <Col span={12}>
                                        <Form.Item
                                            label='软件名称：'
                                            name='softName'
                                            rules={[{ required: true, message: '请输入软件名称!' }]}>
                                            <Input placeholder='请输入软件名称' autoComplete='off' />
                                        </Form.Item>
                                    </Col>
                                )}
                            </Row>
                            {/* <Row span={24}>
                          <Form.Item label="用户评价：">
                            <Rate />
                          </Form.Item>
                        </Row> */}
                            <div style={{ paddingLeft: '20px' }}>
                                <p>附件：</p>
                                <div>
                                    <Upload
                                        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                                        listType='picture-card'
                                        fileList={fileList}
                                        onChange={this.handleUpChange}>
                                        {fileList.length >= 4 ? null : uploadButton}
                                    </Upload>
                                </div>
                                <Button
                                    className='add-repair'
                                    type='primary'
                                    onClick={() => {
                                        this.setState({ showEngineer: true })
                                    }}>
                                    ＋ 添加工程师
                                </Button>
                                {showEngineer && (
                                    <Row style={{ marginTop: '23px' }}>
                                        <Col span={18}>
                                            <Form.Item label='添加工程师：'>
                                                <Select
                                                    mode='multiple'
                                                    placeholder=''
                                                    labelInValue
                                                    value={repairPeopleValue}
                                                    notFoundContent={fetching ? <Spin size='small' /> : null}
                                                    filterOption={false}
                                                    onSearch={this.fetchRepairPeople}
                                                    onChange={this.repairPeopleChange}>
                                                    {repairPeopleList.map(d => (
                                                        <Option key={d.value}>{d.text}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )}
                            </div>
                            <Form.Item style={{ marginBottom: '0px' }}>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    className='add-repair-sure'
                                    loading={this.state.loading}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
            </Layout>
        )
    }
}
