import React, { Component } from 'react'
import { Layout, Button, Modal, Table, Form, Input, Row, Col, Space, Select } from 'antd'
import '@/style/view-style/solution.scss'

export default class Solution extends Component {
    constructor(props) {
        super(props)
        this.state = {
          addUseCasesVisible: false,
          
        }
    }

    formRef = React.createRef();

    componentDidMount() {
      
    }

    // 提交打开model
    onOpenSubmit = (e) => {
      this.setState({
        addUseCasesVisible: true
      })
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
          title: '工程师姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '类型',
          dataIndex: 'age',
          key: 'age',
          align: 'left'
        },
        {
          title: '软件名',
          dataIndex: 'age',
          key: 'age',
          align: 'left'
        },
        {
          title: '解决方案',
          dataIndex: 'address',
          key: 'age',
          align: 'left'
        },
        {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <Space>
              <Button type="link" style={{padding: '0'}} onClick={()=> {this.onOpenSubmit(text)}}>提交</Button>
              <Button type="link" style={{padding: '0'}}>忽略</Button>
            </Space>
            
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
          <Layout className='solution animated fadeIn'>
              <div className='solution-box'>
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
                  title="解决方案"
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
