import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Popconfirm, Select, Tooltip } from 'antd'
import '@/style/view-style/knowledgeBase.scss'
const { Option } = Select;

export default class KnowledgeBase extends Component {
    constructor(props) {
        super(props)
        this.state = {
          addUseCasesVisible: false,
          
        }
    }

    formRef = React.createRef();

    componentDidMount() {
      
    }

    // 类型select
    typeChange = (e) => {
      console.log(e)
    }

    // 解决办法
    keyWordChange= (e) => {
      console.log(e)
    }


    // 确定删除该用例吗？ 气泡确认
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
        addUseCasesVisible: false
      })
      this.formRef.current.resetFields();
    };

    render() {
      const { addUseCasesVisible } = this.state

      const columns = [
        {
          title: '类型',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '关键字',
          dataIndex: 'age',
          key: 'age',
          align: 'left'
        },
        {
          title: '解决方法',
          dataIndex: 'address',
          width: '400px',
          render: (text, record) => (
            <Tooltip title={text}>
              <div className='solve-way-text'>{text}</div>
            </Tooltip>
          ),
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Popconfirm
              title="确定删除该用例吗？"
              onConfirm={this.confirm}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" style={{padding: '0'}}>删除</Button>
            </Popconfirm>
          ),
        },
      ];
      
      const data = [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake ParkNew York No. 1 Lake Park'
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
          <Layout className='knowledgeBase animated fadeIn'>
              <div className='knowledgeBase-box'>
                  <div>
                      <label htmlFor="类型">类型: </label>
                      <Select defaultValue='0' style={{ width: 200 }} onChange={this.typeChange}>
                          <Option value='0'>系统</Option>
                          <Option value='1'>硬件</Option>
                          <Option value='2'>软件</Option>
                      </Select>
                      <label htmlFor="关键字" style={{width: '65px'}}>关键字: </label>
                      <Select mode="tags" style={{ width: '300px' }}  onChange={this.keyWordChange}></Select>
                  </div>
                  <Button className='add-useCases' type="primary" onClick={()=> {this.setState({addUseCasesVisible: true})}}>＋ 添加用例</Button>
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
                  wrapClassName='add-useCases-modal'
                  title="添加用例"
                  visible={addUseCasesVisible}
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
                              label="类型："
                              name="mType"
                              rules={[{ required: true, message: '请输入类型!' }]}
                            >
                              <Input placeholder="请输入类型" autoComplete="off"/>
                            </Form.Item>
                          </Col>
                          <Col span={21}>
                            <Form.Item
                              label="关键字："
                              name="mKeyword"
                              rules= {[{ required: true, message: '请输入关键字!' }]}
                            >
                              <Select mode="tags" style={{ width: '300px' }}></Select>
                            </Form.Item>
                          </Col>
                          <Col span={21}>
                            <Form.Item
                              label="解决方法："
                              name="mSolveWay"
                              rules= {[{ required: true, message: '请输入解决方法!' }]}
                            >
                              <Input.TextArea />
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
