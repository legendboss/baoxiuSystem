import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Divider } from 'antd'
import '@/style/view-style/userManage.scss'
const { Search } = Input;

export default class UserManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
          addUserVisible: false,
          repairHistoryVisible: false
         
        }
    }

    formRef = React.createRef();

    componentDidMount() {
      
    }

    onNameSearch = (e) => {
      console.log(e.target.value)
    }

    // 添加用户 model 确定
    arHandleOk =(e)=> {
      console.log(e)
      
    }

    // 关闭销毁添加用户弹窗
    onCloseResetModel = () => {
      this.setState({
        addUserVisible: false
      })
      this.formRef.current.resetFields();
    }

    onRepairHistory = () => {
      this.setState({
        repairHistoryVisible: true
      })
    }

    render() {
      const { addUserVisible, repairHistoryVisible } = this.state

      const columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '添加时间',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '手机号',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Space>
              <Button type="link" style={{padding: '0'}} onClick={this.onRepairHistory}>报修历史</Button>
              <Button type="link" style={{padding: '0'}}>设备管理</Button>
            </Space>
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
          <Layout className='userManage animated fadeIn'>
              <div className='userManage-box'>
                  <div>
                      <label htmlFor="姓名">姓名: </label>
                      <Search
                        placeholder="请输入姓名"
                        onSearch={this.onNameSearch}
                      />
                  </div>
                  <Button className='add-user' type="primary" onClick={()=> {this.setState({addUserVisible: true})}}>＋ 添加用户</Button>
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
              <Modal
                  wrapClassName='add-user-modal'
                  title="添加用户"
                  visible={addUserVisible}
                  onCancel={this.onCloseResetModel}
                  footer={null}
                  >
                  <div>
                      <Form
                        ref={this.formRef}
                        onFinish={this.arHandleOk}
                      >
                        <Row span={24}>
                          <Col span={21}>
                            <Form.Item 
                              label="姓名："
                              name="name"
                              rules={[{ required: true, message: '请输入姓名!' }]}
                            >
                              <Input placeholder="请输入姓名" autoComplete="off"/>
                            </Form.Item>
                          </Col>
                          <Col span={21}>
                            <Form.Item
                              label="手机号："
                              name="phone"
                              rules= {[{ required: true, message: '请输入正确手机号!' }, {pattern: /^1[3|4|5|7|8][0-9]\d{8}$/, message: '请输入正确手机号'}]}
                            >
                              <Input placeholder="请输入手机号" autoComplete="off"/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Form.Item style={{marginBottom: '0px'}}>
                          <Button
                            type='primary'
                            htmlType='submit'
                            className='add-user-sure'
                            loading={this.state.loading}
                          >
                            确定
                          </Button>
                          <Button
                            className='add-user-sure'
                            onClick={this.onCloseResetModel}
                          >
                            取消
                          </Button>
                        </Form.Item>
                      </Form>
                  </div>
              </Modal>
          
              {/* 报修历史 */}
              <Modal
                  wrapClassName='repair-history-modal'
                  title="报修历史"
                  visible={repairHistoryVisible}
                  onCancel={()=> {this.setState({repairHistoryVisible: false})}}
                  footer={null}
                  >
                  <div className='rh-box'>
                      <div>
                        <p>报修时间：2020.03.02</p>
                        <p>报修内容：电脑坏了</p>
                        <p>保修附件：</p>
                        <div className='img-box'>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                        </div>
                        <Divider />
                      </div>
                      <div>
                        <p>报修时间：2020.03.02</p>
                        <p>报修内容：电脑坏了</p>
                        <p>报修附件：</p>
                        <div className='img-box'>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                          <img src="https://test.ezrpro.com:8444/img/13/01542bab5496b0.jpg?size=320x210s" alt=""/>
                        </div>
                        <Divider />
                      </div>
                  </div>
              </Modal>
          </Layout>
      )
    }
}
