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
    message,
    Badge,
    Rate,
    Divider,
    Space,
    Popconfirm
} from 'antd'
import '@/style/view-style/repairOrder.scss'
import locale from 'antd/es/date-picker/locale/zh_CN'
import { PlusOutlined } from '@ant-design/icons'
import axios from '@/api'
import { API } from '@/api/config'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker
const { Search, TextArea } = Input

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

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
            engineerList: [],
            fileList: [],
            showEngineer: false,
            sysType: '', // 系统类型
            repairSureLoading: false,
            repairDetailVisible: false, // 详情model
            orderDetailInfo: {},
            contractVo: { photo: [] },
            fixVo: { photos: [] },
            userDevice: {},
            previewVisible: false,
            previewImage: '',
            softNameList: [],
            contractPhone: '',
            score: 0,
            comment: '',
            ifEvaluate: false,
            evaluateSureLoading: false
        }
    }

    formRef = React.createRef()

    componentDidMount() {
        // 获取列表
        this.getRepairOrderList()
        this.getSoftNameList()
        this.fetchEngineer()
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

    // 分机号码
    contractPhoneChange = e => {
        this.setState(
            {
                contractPhone: e.target.value
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 获取维修单列表
    getRepairOrderList = () => {
        const { dateTime, orderStatus, type, startPage, pageSize, contractPhone } = this.state
        const model = {
            contractPhone,
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
                this.setState({ listLoading: false })
            })
            .catch(err => {
                this.setState({ listLoading: false })
            })
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

    // 刷新
    onRefresh = () => {
        this.setState(
            {
                startPage: 1,
                pageSize: 10
            },
            () => {
                this.getRepairOrderList()
            }
        )
    }

    // 添加维修单
    // 电话输入搜索
    onPhoneChange = e => {
        const model = {
            phone: e,
            role: 2
        }
        axios
            .get(`${API}/UserListMenu`, { params: model })
            .then(res => {
                const Data = res.data.data
                if (res.data.code === 200) {
                    // 回显地址
                    this.formRef.current.setFieldsValue({
                        address: Data.length > 0 ? Data[0].address : ''
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 系统类型 选择select
    onSelectChange = e => {
        this.setState({
            sysType: e
        })
    }

    // 上传
    handleUpChange = ({ fileList }) => this.setState({ fileList })

    // 工程师select
    fetchEngineer = () => {
        const model = {
            role: 1
        }
        axios
            .get(`${API}/UserListMenu`, { params: model })
            .then(res => {
                const Data = res.data.data
                if (res.data.code === 200) {
                    this.setState({ engineerList: Data })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // model 确定
    arHandleOk = e => {
        const { fileList } = this.state
        console.log(e)
        console.log(fileList)
        const photo = []
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i].status !== 'done') {
                message.error('请先等待图片上传完成！')
                return false
            } else {
                photo.push(fileList[i].response.data)
            }
        }
        this.setState({ repairSureLoading: true })
        const model = {
            address: e.address,
            applicationPhoto: photo,
            content: e.content,
            contractPhone: e.contractPhone,
            contractName: e.contractName,
            fixId: e.engineerName ? e.engineerName.key[0] : '', // 工程师
            fixName: e.engineerName ? e.engineerName.key[1] : '',
            fixType: e.fixType,
            softName: e.softName || '',
            source: 0,
            type: e.type
        }
        axios
            .post(`${API}/addOrder`, model)
            .then(res => {
                if (res.data.code === 200) {
                    this.onCloseResetModel()
                    this.getRepairOrderList()
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ repairSureLoading: false })
            })
            .catch(err => {
                this.setState({ repairSureLoading: false })
            })
    }

    // 关闭添加维修单 销毁弹窗
    onCloseResetModel = () => {
        this.setState({
            addRepairVisible: false,
            fileList: []
        })
        this.formRef.current.resetFields()
    }

    // 详情
    onOrderDetail = id => {
        this.setState({ repairDetailVisible: true })
        const model = { id }
        axios
            .get(`${API}/orderInfo`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    this.setState({
                        orderDetailInfo: res.data.data,
                        contractVo: res.data.data.contractVo,
                        fixVo: res.data.data.fixVo,
                        userDevice: res.data.data.contractVo.userDevice
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    // 回访打开
    onEvaluate = id => {
        this.setState(
            {
                ifEvaluate: true
            },
            () => {
                this.onOrderDetail(id)
            }
        )
    }

    handleScoreChange = e => {
        this.setState({
            score: e
        })
    }

    handleCommentChange = e => {
        console.log(e.target.value)
        this.setState({
            comment: e.target.value
        })
    }

    // 回访确定
    onEvaluateSure = () => {
        const { score, comment, orderDetailInfo } = this.state
        if (score < 1) {
            message.error('请评分！')
            return false
        }
        if (comment === '') {
            message.error('请填写回访记录！')
            return false
        }

        this.setState({ evaluateSureLoading: true })
        const model = {
            id: orderDetailInfo.id,
            comment,
            score
        }
        axios
            .post(`${API}/scoreFinishOrder`, model)
            .then(res => {
                if (res.data.code === 200) {
                    this.getRepairOrderList()
                    this.onCloseDetailModel()
                } else {
                    message.error(res.data.msg)
                }
                this.setState({ evaluateSureLoading: false })
            })
            .catch(err => {
                this.setState({ evaluateSureLoading: false })
            })
    }

    //
    onCloseDetailModel = () => {
        this.setState({
            repairDetailVisible: false,
            ifEvaluate: false,
            score: 0,
            comment: ''
        })
    }

    // 图片预览
    handlePreview = async file => {
        console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        })
    }

    // 普通图片预览
    onPreviewImage = url => {
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }

    // 获取软件名称列表
    getSoftNameList = () => {
        axios
            .get(`${API}/softNameList`, {})
            .then(res => {
                const data = res.data.data
                if (res.data.code === 200) {
                    this.setState({
                        softNameList: data
                    })
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    onDeleteOrder = id => {
        axios
            .delete(`${API}/delOrder?id=${id}`)
            .then(res => {
                if (res.data.code === 200) {
                    message.success('删除成功！')
                    this.getRepairOrderList()
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
            addRepairVisible,
            fileList,
            showEngineer,
            sysType,
            repairSureLoading,
            repairDetailVisible,
            orderDetailInfo,
            contractVo,
            fixVo,
            userDevice,
            previewVisible,
            previewImage,
            softNameList,
            engineerList,
            contractPhone,
            score,
            comment,
            ifEvaluate,
            evaluateSureLoading
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
                title: '联系电话',
                dataIndex: 'contractPhone'
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
                    // 0未接单 1已接单 2 已完成 3 已取消 4 已回仿
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
                        case 4:
                            statusStr = 'success'
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
                    <Space>
                        <Button
                            type='link'
                            style={{ padding: '0' }}
                            onClick={() => {
                                this.onOrderDetail(record.id)
                            }}>
                            详情
                        </Button>
                        {record.orderStatus !== 2 && (
                            <Popconfirm
                                title='确定删除吗？'
                                onConfirm={() => {
                                    this.onDeleteOrder(record.id)
                                }}
                                okText='确定'
                                cancelText='取消'>
                                <Button type='link' style={{ padding: '0' }}>
                                    删除
                                </Button>
                            </Popconfirm>
                        )}
                        {record.orderStatus === 2 && (
                            <Button
                                type='link'
                                style={{ padding: '0' }}
                                onClick={() => {
                                    this.onEvaluate(record.id)
                                }}>
                                回访
                            </Button>
                        )}
                    </Space>
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
                            <Option value='4'>已回访</Option>
                        </Select>
                        {/* 类型 0紧急 1一般 */}
                        <label htmlFor='类型'>类型: </label>
                        <Select defaultValue='' style={{ width: 200 }} onChange={this.typeChange}>
                            <Option value=''>全部</Option>
                            <Option value='0'>紧急</Option>
                            <Option value='1'>一般</Option>
                        </Select>
                        <div style={{ display: 'inline-block', marginTop: '20px' }}>
                            <label htmlFor='订单状态'>时间: </label>
                            <RangePicker format='YYYY-MM-DD' showTime locale={locale} onChange={this.onRageChange} />
                        </div>
                        <div style={{ display: 'inline-block', marginTop: '20px' }}>
                            <label htmlFor='分机号' style={{ width: '70px' }}>
                                分机号:{' '}
                            </label>
                            <Input
                                style={{ width: 200 }}
                                placeholder='请输入分机号'
                                type='text'
                                value={contractPhone}
                                onChange={this.contractPhoneChange}
                            />
                            <Button
                                type='primary'
                                onClick={() => {
                                    this.onRefresh()
                                }}>
                                刷新
                            </Button>
                        </div>
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
                            showTotal: total => `共 ${total} 条`,
                            pageSizeOptions: [10, 20],
                            onChange: (page, pageSize) => this.handleTableChange(page, pageSize)
                        }}
                    />
                </div>
                <Modal
                    wrapClassName='add-repair-modal'
                    title='添加维修单'
                    visible={addRepairVisible}
                    onCancel={this.onCloseResetModel}
                    footer={null}>
                    <div>
                        <Form ref={this.formRef} onFinish={this.arHandleOk}>
                            <Row span={24}>
                                <Col span={12}>
                                    <Form.Item
                                        label='报修人：'
                                        name='contractName'
                                        rules={[{ required: true, message: '请输入报修人!' }]}>
                                        <Input placeholder='请输入报修人' autoComplete='off' />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label='联系电话：'
                                        name='contractPhone'
                                        rules={[{ required: true, message: '请输入联系电话!' }]}>
                                        <Search
                                            placeholder='请输入联系电话'
                                            autoComplete='off'
                                            onSearch={this.onPhoneChange}
                                        />
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
                                    <Form.Item
                                        label='系统类型：'
                                        name='fixType'
                                        rules={[{ required: true, message: '请选择系统类型!' }]}>
                                        <Select placeholder='请选择系统类型' onChange={this.onSelectChange}>
                                            <Option value='0'>系统</Option>
                                            <Option value='1'>硬件</Option>
                                            <Option value='2'>软件</Option>
                                            <Option value='3'>其他</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label='类型：'
                                        name='type'
                                        rules={[{ required: true, message: '请选择类型!' }]}>
                                        <Select placeholder='请选择类型'>
                                            <Option value='0'>紧急</Option>
                                            <Option value='1'>一般</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {sysType === '2' && (
                                <Row span={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            label='软件名称：'
                                            name='softName'
                                            rules={[{ required: true, message: '请选择软件名称!' }]}>
                                            <Select>
                                                {softNameList.map((item, index) => {
                                                    return (
                                                        <Option key={index} value={item}>
                                                            {item}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                            <div style={{ paddingLeft: '20px' }}>
                                <p>附件：</p>
                                <div>
                                    <Upload
                                        accept='image/*'
                                        action={`${API}/upLoadPhoto`}
                                        method='post'
                                        listType='picture-card'
                                        fileList={fileList}
                                        onPreview={this.handlePreview}
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
                                            <Form.Item
                                                label='添加工程师：'
                                                name='engineerName'
                                                rules={[{ required: true, message: '请选择工程师!' }]}>
                                                <Select placeholder='请选择工程师' labelInValue>
                                                    {engineerList.map(item => {
                                                        return (
                                                            <Option key={item.id} value={[item.id, item.name]}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    })}
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
                                    disabled={repairSureLoading}
                                    loading={repairSureLoading}>
                                    确定
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Modal>
                {/* 详情 */}
                <Modal
                    wrapClassName='repair-detail-modal'
                    title={`${ifEvaluate ? '回访' : '详情'}`}
                    visible={repairDetailVisible}
                    onCancel={() => {
                        this.onCloseDetailModel()
                    }}
                    footer={
                        <div>
                            {ifEvaluate ? (
                                <Button
                                    type='primary'
                                    className='add-repair-sure'
                                    disabled={evaluateSureLoading}
                                    loading={evaluateSureLoading}
                                    onClick={this.onEvaluateSure}>
                                    确定
                                </Button>
                            ) : null}
                        </div>
                    }>
                    <div className='rd-box'>
                        <Row span={24}>
                            <Col span={12}>
                                <span>报修人：</span>
                                <span>{contractVo.contractName}</span>
                            </Col>
                            <Col span={12}>
                                <span>联系电话：</span>
                                <span>{contractVo.contractPhone}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={12}>
                                <span>报修内容：</span>
                                <span>{contractVo.content}</span>
                            </Col>
                            <Col span={12}>
                                <span>维修地址：</span>
                                <span>{contractVo.address}</span>
                            </Col>
                        </Row>
                        <Row span={24}>
                            <Col span={12}>
                                <span>系统类型：</span>
                                <span>
                                    {contractVo.fixType === 0
                                        ? '系统'
                                        : contractVo.fixType === 1
                                        ? '硬件'
                                        : contractVo.fixType === 2
                                        ? '软件'
                                        : contractVo.fixType === 3
                                        ? '其他'
                                        : ''}
                                </span>
                            </Col>
                            <Col span={12}>
                                <span>类型：</span>
                                <span>{contractVo.typeStr}</span>
                            </Col>
                        </Row>
                        {contractVo.fixType === 2 && (
                            <Row span={24}>
                                <Col span={12}>
                                    <span>软件名称：</span>
                                    <span>{contractVo.softName}</span>
                                </Col>
                            </Row>
                        )}
                        {orderDetailInfo.orderStatus === 2 && ifEvaluate && (
                            <div>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>用户评价：</span>
                                        <Rate
                                            value={score}
                                            onChange={this.handleScoreChange}
                                            defaultValue={contractVo.score}
                                        />
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={20}>
                                        <span>回访记录：</span>
                                        <TextArea
                                            value={comment}
                                            onChange={this.handleCommentChange}
                                            rows={6}></TextArea>
                                    </Col>
                                </Row>
                            </div>
                        )}
                        {orderDetailInfo.orderStatus === 4 && (
                            <div>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>用户评价：</span>
                                        <Rate disabled defaultValue={contractVo.score} />
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={24}>
                                        <span>回访记录：</span>
                                        <span style={{ width: '450px' }}>{contractVo.comment || '无'}</span>
                                    </Col>
                                </Row>
                            </div>
                        )}
                        <Row span={24}>
                            <span>附件：</span>
                            <div className='img-box'>
                                {contractVo.photo.length > 0 ? (
                                    <div>
                                        {contractVo.photo.map((item, index) => {
                                            return (
                                                <img
                                                    key={index}
                                                    src={item}
                                                    alt=''
                                                    onClick={() => {
                                                        this.onPreviewImage(item)
                                                    }}
                                                />
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <span>无</span>
                                )}
                            </div>
                        </Row>
                        {fixVo !== null && (
                            <div>
                                <Divider />
                                <Row span={24}>
                                    <Col span={24}>
                                        <span>维修方案：</span>
                                        <span style={{ width: '450px' }}>{fixVo.fixContent || '无'}</span>
                                    </Col>
                                </Row>
                                <Divider />
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>工程师：</span>
                                        <span>{fixVo.fixName}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>订单状态：</span>
                                        <span>
                                            {orderDetailInfo.orderStatus === 1
                                                ? '已接单'
                                                : orderDetailInfo.orderStatus === 0
                                                ? '未接单'
                                                : orderDetailInfo.orderStatus === 2
                                                ? '已完成'
                                                : orderDetailInfo.orderStatus === 3
                                                ? '已取消'
                                                : ''}
                                        </span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <span>附件：</span>
                                    <div className='img-box'>
                                        {fixVo.photos.length > 0 ? (
                                            <div>
                                                {fixVo.photos.map((item2, index2) => {
                                                    return (
                                                        <img
                                                            key={index2}
                                                            src={item2}
                                                            alt=''
                                                            onClick={() => {
                                                                this.onPreviewImage(item2)
                                                            }}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <span>无</span>
                                        )}
                                    </div>
                                </Row>
                            </div>
                        )}
                        {userDevice !== null && (
                            <div>
                                <Divider />
                                <p>设备详情:</p>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>CPU：</span>
                                        <span>{userDevice.cpu}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>硬盘：</span>
                                        <span>{userDevice.system}</span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>打印机：</span>
                                        <span>{userDevice.printer}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>内存：</span>
                                        <span>{userDevice.hardDisk}</span>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={12}>
                                        <span>显卡：</span>
                                        <span>{userDevice.videoCard}</span>
                                    </Col>
                                    <Col span={12}>
                                        <span>主板：</span>
                                        <span>{userDevice.mainBoard}</span>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </div>
                </Modal>
                {/* 普通图片预览 */}
                <Modal
                    width={800}
                    visible={previewVisible}
                    title='预览'
                    footer={null}
                    className='preview-image-modal'
                    onCancel={() => {
                        this.setState({ previewVisible: false })
                    }}>
                    <img alt='example' className='preview-image' src={previewImage} />
                </Modal>
            </Layout>
        )
    }
}
