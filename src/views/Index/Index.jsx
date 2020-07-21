import React, { Component } from 'react'
import { Layout, Row, Col } from 'antd'
import screenfull from 'screenfull'
import '@/style/view-style/index.scss'

import aside1 from '@/assets/icon/aside1.svg'
import aside2 from '@/assets/icon/aside2.svg'
import aside3 from '@/assets/icon/aside3.svg'
import aside4 from '@/assets/icon/aside4.svg'
import aside5 from '@/assets/icon/aside5.svg'
import aside6 from '@/assets/icon/aside6.svg'

const wsNewOrder = new WebSocket(`ws://qikeqike.qicp.vip/newOrder`)

class Index extends Component {
    state = {
        newOrderNum: 0
    }

    componentDidMount() {
        wsNewOrder.onopen = function(e) {
            console.log('连接上 wsNewOrder 服务端了')
            wsNewOrder.send({})
        }
        wsNewOrder.onmessage = msg => {
            console.log('接收服务端发过来的消息wsNewOrder: ', msg)
            document.getElementById('bgm').play()
            this.setState({
                newOrderNum: msg.data
            })
        }
        wsNewOrder.onclose = function(e) {
            console.log('wsNewOrder 连接关闭了')
            console.log(e)
        }
    }

    fullToggle = () => {
        if (screenfull.isEnabled) {
            screenfull.request(document.getElementById('bar'))
        }
    }

    render() {
        const { newOrderNum } = this.state
        return (
            <Layout className='index animated fadeIn'>
                <audio id='bgm'>
                    <source src='http://downsc.chinaz.net/Files/DownLoad/sound1/201706/8855.mp3' type='audio/mpeg' />
                </audio>
                <Row gutter={8} className='index-box'>
                    <Col>
                        <div className='items'>
                            <a href='#/repairOrder'>
                                <img src={aside1} alt='' />
                            </a>
                            <p>维修单</p>
                            <span className='tip'>{newOrderNum}</span>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/personManage'>
                                <img src={aside3} alt='' />
                            </a>
                            <p>人员管理</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/userManage'>
                                <img src={aside2} alt='' />
                            </a>
                            <p>用户管理</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/knowledgeBase'>
                                <img src={aside4} alt='' />
                            </a>
                            <p>知识库</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/about'>
                                <img src={aside5} alt='' />
                            </a>
                            <p>报表</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/solution'>
                                <img src={aside6} alt='' />
                            </a>
                            <p>解决方案管理</p>
                        </div>
                    </Col>
                    <Col>
                        <div className='items'>
                            <a href='#/dictionary'>
                                <img src={aside6} alt='' />
                            </a>
                            <p>字典</p>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

export default Index
