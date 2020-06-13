import React, { Component } from 'react'
import { Layout, Select, DatePicker, Button, Table } from 'antd'
import '@/style/view-style/repairOrder.scss'
import locale from 'antd/es/date-picker/locale/zh_CN';

const { Option } = Select
const { RangePicker } = DatePicker;

export default class RepairOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentDidMount() {
      
    }

    statusChange = (e) => {
      console.log(e)
    }

    render() {
      const columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '时间',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '内容',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '类型',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '状态',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '维修人员',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Button type="link" style={{padding: '0'}}>详情</Button>
          ),
        },
      ];
      
      const data = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park'
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 1 Lake Park'
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park'
        },
      ];
        return (
            <Layout className='repairOrder animated fadeIn'>
                <div className='repairOrder-box'>
                    <div>
                        {/* orderStatus 订单状态 0未接单 1已接单 2 已完成 3 已取消 */}
                        <label htmlFor="订单状态">状态: </label>
                        <Select defaultValue='0' style={{ width: 200 }} onChange={this.statusChange}>
                            <Option value='0'>未接单</Option>
                            <Option value='1'>已接单</Option>
                            <Option value='2'>已完成</Option>
                            <Option value='3'>已取消</Option>
                        </Select>
                        {/* 类型 0紧急 1一般 */}
                        <label htmlFor="类型">类型: </label>
                        <Select defaultValue='0' style={{ width: 200 }} onChange={this.typeChange}>
                            <Option value='0'>紧急</Option>
                            <Option value='1'>一般</Option>
                        </Select>
                        <label htmlFor="订单状态">时间: </label>
                        <RangePicker showTime locale={locale}/>
                    </div>
                    <Button className='add-repair' type="primary" >＋ 添加维修单</Button>
                    <Table
                      columns={columns}
                      dataSource={data} 
                      loading={false}
                      pagination={{
                          showQuickJumper: true,
                          current: 1,
                          total: 500,
                          pageSize: [10],
                          onChange : (page) => this.handleTableChange(page),
                        }
                      }
                    />
                </div>
            </Layout>
        )
    }
}
