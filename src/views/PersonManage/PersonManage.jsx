import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Popconfirm, Badge   } from 'antd'
import '@/style/view-style/personManage.scss'

export default class PersonManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
          addEngineerVisible: false,
         
        }
    }

    formRef = React.createRef();

    componentDidMount() {
      
    }

    onEngineerBlur = (e) => {
      console.log(e.target.value)
    }

    // 气泡确认
    confirm = (e)=> {
      console.log(e)
    }

    // model 确定
    arHandleOk =(e)=> {
      console.log(e)
      
    }

    // 关闭销毁弹窗
    onCloseResetModel = () => {
      this.setState({
        addEngineerVisible: false
      })
      this.formRef.current.resetFields();
    };

    checkPhoneNub(value) {
      var regu = "^1[0-9]{10}$";//手机号码验证regEx:第一位数字必须是1，11位数字
      var re = new RegExp(regu);
      if ( re.test(value)) {
        return{};
      }else {
        return '请正确输入手机号！';
      }
    }  

    render() {
      const { addEngineerVisible} = this.state

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
          title: '状态',
          dataIndex: 'address',
          render: (text, record) => (
            <div>
              {record.age>33
              ?(<Badge status="processing" text="启用" />)
              :(<Badge status="default" text="禁用" />)
              }
            </div>
          ),
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Space>
              <Popconfirm
                title="确定启用该用户吗？"
                onConfirm={this.confirm}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" style={{padding: '0'}}>启用</Button>
              </Popconfirm>
              <Popconfirm
                title="确定禁用该用户吗？"
                onConfirm={this.confirm}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link" style={{padding: '0'}}>禁用</Button>
              </Popconfirm>
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
          <Layout className='personManage animated fadeIn'>
              <div className='personManage-box'>
                  <div>
                      <label htmlFor="工程师">工程师: </label>
                      <Input
                        placeholder="请输入工程师"
                        autoComplete="off"
                        onBlur={ this.onEngineerBlur }
                      />
                  </div>
                  <Button className='add-engineer' type="primary" onClick={()=> {this.setState({addEngineerVisible: true})}}>＋ 添加工程师</Button>
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
                  wrapClassName='add-engineer-modal'
                  title="添加工程师"
                  visible={addEngineerVisible}
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
                            className='add-engineer-sure'
                            loading={this.state.loading}
                          >
                            确定
                          </Button>
                          <Button
                            className='add-engineer-sure'
                            onClick={this.onCloseResetModel}
                          >
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
