import React, { Component } from 'react'
import { Layout, Select, DatePicker, Button, Modal, Table, Form, Input, Row, Col, Rate, Upload, Spin  } from 'antd'
import '@/style/view-style/repairOrder.scss'
import locale from 'antd/es/date-picker/locale/zh_CN';
import { PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';

const { Option } = Select
const { RangePicker } = DatePicker;

export default class RepairOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
          addRepairVisible: false,
          repairPeopleValue: [],
          fetching: false,
          repairPeopleList: [],
          fileList: [],
          addEngineerVisible: false
        }
        this.fetchRepairPeople = debounce(this.fetchRepairPeople, 800);
    }

    componentDidMount() {
      
    }

    statusChange = (e) => {
      console.log(e)
    }

    // 添加维修单
    // 报修人select
    fetchRepairPeople = value => {
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
          this.setState({ repairPeopleList: data, fetching: false });
        });
    };

    repairPeopleChange = value => {
      this.setState({
        repairPeopleValue: value,
        repairPeopleList: [],
        fetching: false,
      });
    };

    // 上传
    handleUpChange = ({ fileList }) => this.setState({ fileList });

    // model 确定
    arHandleOk =(e)=> {
      console.log(e)
      
    }

    render() {
      const { addRepairVisible, repairPeopleValue, repairPeopleList, fetching, fileList, addEngineerVisible } = this.state

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

      const uploadButton = (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">上传</div>
        </div>
      );
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
                  <Button className='add-repair' type="primary" onClick={()=> {this.setState({addRepairVisible: true})}}>＋ 添加维修单</Button>
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
                  wrapClassName='add-repair-modal'
                  title="添加维修单"
                  visible={addRepairVisible}
                  onCancel={()=> { this.setState({addRepairVisible: false})}}
                  footer={null}
                  >
                  <div>
                      <Form
                        onFinish={this.arHandleOk}
                      >
                        <Row span={24}>
                          <Col span={12}>
                            <Form.Item label="报修人：">
                              <Select
                                mode="multiple"
                                placeholder='请输入报修人'
                                labelInValue
                                value={repairPeopleValue}
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={this.fetchRepairPeople}
                                onChange={this.repairPeopleChange}
                              >
                                {repairPeopleList.map(d => (
                                  <Option key={d.value}>{d.text}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="维修地址：" name="address">
                              <Input placeholder="请输入维修地址"  autoComplete="off"/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row span={24}>
                          <Col span={12}>
                            <Form.Item label="报修内容：" name="address2">
                              <Input placeholder="请输入报修内容" autoComplete="off"/>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item label="联系电话：" name="address3">
                              <Input placeholder="请输入联系电话" autoComplete="off"/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row span={24}>
                          <Form.Item label="用户评价：">
                            <Rate />
                          </Form.Item>
                        </Row>
                        <div style={{paddingLeft: '20px'}}>
                          <p>附件：</p>
                          <div>
                            <Upload
                              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                              listType="picture-card"
                              fileList={fileList}
                              onChange={this.handleUpChange}
                            >
                              {fileList.length >= 4 ? null : uploadButton}
                            </Upload>
                          </div>
                          <Button className='add-repair' type="primary" onClick={()=> {this.setState({addEngineerVisible: true})}}>＋ 添加工程师</Button>
                          {addEngineerVisible &&
                            <Row style={{marginTop: '23px'}}>
                              <Col span={18}>
                                <Form.Item label="添加工程师：">
                                  <Select
                                    mode="multiple"
                                    placeholder=''
                                    labelInValue
                                    value={repairPeopleValue}
                                    notFoundContent={fetching ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={this.fetchRepairPeople}
                                    onChange={this.repairPeopleChange}
                                  >
                                    {repairPeopleList.map(d => (
                                      <Option key={d.value}>{d.text}</Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                            </Row>
                          }
                        </div>
                        <Form.Item>
                          <Button
                            type='primary'
                            htmlType='submit'
                            className='add-repair-sure'
                            loading={this.state.loading}
                          >
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
