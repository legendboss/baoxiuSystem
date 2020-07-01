import React, { Component } from 'react'
import { Layout, DatePicker, Select, Spin, Radio, message } from 'antd'
import '@/style/view-style/report.scss'
import locale from 'antd/es/date-picker/locale/zh_CN'
import debounce from 'lodash/debounce'
import BarEcharts from './Bar.jsx'
import PieEcharts from './Pie.jsx'
import axios from '@/api'
import { API } from '@/api/config'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker

export default class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dateTime: ['', ''],
            orderStatus: '',
            fetching: false,
            engineerList: []
        }
        this.fetchEngineer = debounce(this.fetchEngineer, 800)
    }

    componentDidMount() {
        this.getFixOrderReport()
    }

    // 工程师select
    fetchEngineer = value => {
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
                this.setState({ engineerList: data, fetching: false })
            })
    }

    repairPeopleChange = value => {
        this.setState({
            engineerValue: value,
            engineerList: [],
            fetching: false
        })
    }

    // 时间选择
    onRageChange = (dates, dateStrings) => {
        const dateTime = [moment(dateStrings[0]).valueOf(), moment(dateStrings[1]).valueOf()]
        this.setState({
            dateTime
        })
    }

    // 订单状态
    statusChange = e => {
        this.setState({
            orderStatus: e
        })
    }

    // tab切换
    onTabChange = e => {
        console.log(e.target.value)
    }

    // 维修单统计报表
    getFixOrderReport = () => {
        const { dateTime, orderStatus } = this.state
        const model = {
            start: dateTime[0],
            end: dateTime[1],
            orderStatus,
            fixId: ''
        }
        axios
            .get(`${API}/fixOrderCount`, { params: model })
            .then(res => {
                if (res.data.code === 200) {
                    this.getKnowledgeList()
                } else {
                    message.error(res.data.msg)
                }
            })
            .catch(err => {})
    }

    render() {
        const { engineerList, fetching, engineerValue } = this.state
        return (
            <Layout className='report animated fadeIn'>
                <div className='report-box'>
                    <div>
                        <label htmlFor='工程师'>工程师: </label>
                        <Select
                            mode='multiple'
                            placeholder='请输入工程师'
                            labelInValue
                            value={engineerValue}
                            notFoundContent={fetching ? <Spin size='small' /> : null}
                            filterOption={false}
                            onSearch={this.fetchEngineer}
                            onChange={this.repairPeopleChange}>
                            {engineerList.map(d => (
                                <Option key={d.value}>{d.text}</Option>
                            ))}
                        </Select>
                        <label htmlFor='时间'>时间: </label>
                        <RangePicker format='YYYY-MM-DD' showTime locale={locale} onChange={this.onRageChange} />
                        <label htmlFor='订单状态'>订单状态: </label>
                        <Select defaultValue='' style={{ width: 200 }} onChange={this.statusChange}>
                            <Option value=''>全部</Option>
                            <Option value='0'>未接单</Option>
                            <Option value='1'>已接单</Option>
                            <Option value='2'>已完成</Option>
                            <Option value='3'>已取消</Option>
                        </Select>
                    </div>
                    <div>
                        <Radio.Group defaultValue='a' style={{ marginTop: 40 }} onChange={this.onTabChange}>
                            <Radio.Button value='a'>维修单统计</Radio.Button>
                            <Radio.Button value='b'>来源渠道统计</Radio.Button>
                            <Radio.Button value='c'>平均响应时间统计</Radio.Button>
                            <Radio.Button value='d'>平均完成时间统计</Radio.Button>
                            <Radio.Button value='e'>评价率统计</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div>
                        <BarEcharts />
                    </div>
                    <div>
                        <PieEcharts />
                    </div>
                </div>
            </Layout>
        )
    }
}
