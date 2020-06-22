import React, { Component } from 'react'
import { Layout, DatePicker, Select, Spin, Radio } from 'antd'
import '@/style/view-style/report.scss'
import locale from 'antd/es/date-picker/locale/zh_CN';
import debounce from 'lodash/debounce';
import BarEcharts from './Bar.jsx'
import PieEcharts from './Pie.jsx'

const { Option } = Select
const { RangePicker } = DatePicker;

export default class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
          fetching: false,
          engineerList: [],
        }
        this.fetchEngineer = debounce(this.fetchEngineer, 800);
    }

    componentDidMount() {
      
    }

    // 工程师select
    fetchEngineer = value => {
      console.log('fetching user', value);
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.setState({ data: [], fetching: true });
      fetch('https://randomuser.me/api/?results=5')
        .then(response => response.json())
        .then(body => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          const data = body.results.map(user => ({
            text: `${user.name.first} ${user.name.last}`,
            value: user.login.username,
          }));
          this.setState({ engineerList: data, fetching: false });
        });
    };

    repairPeopleChange = value => {
      this.setState({
        engineerValue: value,
        engineerList: [],
        fetching: false,
      });
    };

    // tab切换
    onTabChange= (e) => {
      console.log(e.target.value)
    }


   

    render() {
      const { engineerList, fetching, engineerValue } = this.state
      return (
          <Layout className='report animated fadeIn'>
              <div className='report-box'>
                  <div>
                      <label htmlFor="订单状态">工程师: </label>
                      <Select
                        mode="multiple"
                        placeholder='请输入报修人'
                        labelInValue
                        value={engineerValue}
                        notFoundContent={fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={this.fetchEngineer}
                        onChange={this.repairPeopleChange}
                      >
                        {engineerList.map(d => (
                          <Option key={d.value}>{d.text}</Option>
                        ))}
                      </Select>
                      <label htmlFor="订单状态">时间: </label>
                      <RangePicker showTime locale={locale}/>
                  </div>
                  <div>
                    <Radio.Group defaultValue="a" style={{ marginTop: 40 }} onChange={this.onTabChange}>
                      <Radio.Button value="a">维修单统计</Radio.Button>
                      <Radio.Button value="b">来源渠道统计</Radio.Button>
                      <Radio.Button value="c">平均响应时间统计</Radio.Button>
                      <Radio.Button value="d">平均完成时间统计</Radio.Button>
                      <Radio.Button value="e">评价率统计</Radio.Button>
                    </Radio.Group>
                  </div>
                  <div>
                    <BarEcharts />
                    <PieEcharts />
                  </div>
                  
                  
              </div>

          </Layout>
      )
    }
}
