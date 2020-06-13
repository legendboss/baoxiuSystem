import React from 'react'
import PropTypes from 'prop-types'
import { Layout, Row, Col } from 'antd'

const AppDataShow = props => {
  let { dataShow } = props
  return (
    <Layout className='data-show animated fadeIn'>
      <Row gutter={24} className='index-header'>
          <Col span={6}>
              <div className='base-style'>
                  <p>今日完成数</p>
                  <p>{dataShow[0]}</p>
                  <div className='line'></div>
              </div>
          </Col>
          <Col span={6}>
              <div className='base-style'>
                  <p>今日待完成数</p>
                  <p>{dataShow[1]}</p>
                  <div className='line'></div>
              </div>
          </Col>
          <Col span={6}>
              <div className='base-style'>
                  <p>今日总数</p>
                  <p>{dataShow[2]}</p>
                  <div className='line'></div>
              </div>
          </Col>
          <Col span={6}>
              <div className='base-style'>
                  <p>累计完成数</p>
                  <p>{dataShow[3]}</p>
              </div>
          </Col>
      </Row>
    </Layout>
  )
}

AppDataShow.propTypes = {
  dataShow: PropTypes.array,
}

export default AppDataShow
