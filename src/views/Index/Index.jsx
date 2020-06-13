import React, { Component } from 'react'
import { Layout, Row, Col } from 'antd'
import screenfull from 'screenfull'
import '@/style/view-style/index.scss'

import aside1 from '../../assets/icon/aside1.svg'
import aside2 from '../../assets/icon/aside2.svg'
import aside3 from '../../assets/icon/aside3.svg'
import aside4 from '../../assets/icon/aside4.svg'
import aside5 from '../../assets/icon/aside5.svg'

class Index extends Component {
    fullToggle = () => {
        if (screenfull.isEnabled) {
            screenfull.request(document.getElementById('bar'))
        }
    }
    render() {
        return (
            <Layout className='index animated fadeIn'>
                <Row gutter={24} className='index-header'>
                    <Col span={6}>
                        <div className='base-style'>
                            <p>今日完成数</p>
                            <p>100</p>
                            <div className='line'></div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='base-style'>
                            <p>今日待完成数</p>
                            <p>77</p>
                            <div className='line'></div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='base-style'>
                            <p>今日总数</p>
                            <p>234</p>
                            <div className='line'></div>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className='base-style'>
                            <p>累计完成数</p>
                            <p>542</p>
                        </div>
                    </Col>
                </Row>

                <Row gutter={8} className='index-box'>
                    <Col>
                        <div className='items'>
                            <img src={aside1} alt=''/>
                            <p>维修单</p>
                            <span className='tip'>2</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <img src={aside4} alt=''/>
                            <p>知识库</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <img src={aside2} alt=''/>
                            <p>人员管理</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <img src={aside5} alt=''/>
                            <p>报表</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <img src={aside3} alt=''/>
                            <p>人员管理</p>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

export default Index
