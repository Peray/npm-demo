import React, { Component } from 'react';
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import Datatist from 'datatist-react';// 测试包
import Filter from './components/Filter';
// import Datatist from '../../src/index';// 本地文件
import 'datatist-react/lib/main.min.css';

const { DtQuery, DtDatetimePicker, DtMonthPicker, DtDaterangePicker } = Datatist;

const table = [{
  name: '分群名称',
  propertyName: 'name',
  nodeType: 'input',
  operator: 'LIKE'
}, {
  name: '分群类型',
  propertyName: 'type',
  nodeType: 'select',
  options: [],
  operator: 'EQ'
}, {
  name: '状态',
  propertyName: 'status',
  nodeType: 'select',
  options: [],
  operator: 'EQ'
}, {
  name: '更新规则',
  propertyName: 'calcRule',
  nodeType: 'select',
  options: [],
  operator: 'EQ'
}, {
  name: '创建时间',
  propertyName: 'createTime',
  nodeType: 'dateRange',
  operator: 'DATE_BETWEEN'
}, {
  name: '创建账号',
  propertyName: 'user',
  nodeType: 'select',
  options: [],
  operator: 'EQ',
  disabledNode: 'userId'
}, {
  name: '最近计算时间',
  propertyName: 'lastCalcTime',
  nodeType: 'dateRange',
  operator: 'DATE_BETWEEN'
}, {
  name: '仅查看我创建的',
  propertyName: 'userId',
  nodeType: 'checkbox',
  operator: 'EQ',
  disabledNode: 'user'
}];

const model = {
  date: moment(),
  startDate: moment().subtract(7, 'days'),
  endDate: moment()
};

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: {
        date: moment(),
        startDate: moment().subtract(7, 'days'),
        endDate: moment()
      },
      month: {
        date: moment().subtract(1, 'month'),
        startDate: moment().subtract(1, 'month').startOf('month'),
        endDate: moment().subtract(1, 'month').endOf('month')
      },
      dataRange: {
        date: moment(),
        startDate: moment().subtract(7, 'days'),
        endDate: moment()
      }
    };

    this.queryData = this.queryData.bind(this);
    this.selectDateTime = this.selectDateTime.bind(this);
    this.selectMonth = this.selectMonth.bind(this);
    this.selecDateRange = this.selecDateRange.bind(this);
  }

  // 筛选组件方法
  queryData(value) {
    console.log(value);
  }

  // DtDatetimePicker出参
  selectDateTime(value) {
    this.setState({ datetime: value });
  }

  selectMonth(value) {
    this.setState({ month: value });
  }

  selecDateRange(value) {
    this.setState({ dataRange: value });
  }

  render() {
    const { datetime, month, dataRange } = this.state;
    const currentTime = `${moment(datetime.startDate).format('YYYY-MM-DD')} 至 ${moment(datetime.endDate).format('YYYY-MM-DD')}`;
    const currentMonth = (value) => `${moment(value.startDate).format('YYYY-MM')}`;
    const currentDateRange = (value) => value && value.startDate && value.endDate && `${moment(value.startDate).format('YYYY-MM-DD')} 至 ${moment(value.endDate).format('YYYY-MM-DD')}`;

    return (
      <div>
        <Row type="flex">
          <Col span={24}>
            <Card title="过滤组件">
              <Filter />
            </Card>
          </Col>

          <Col span={24}>
            <Card title="筛选组件">
              <DtQuery isFold config={table} grid={{ leftCol: 24, rightCol: 24, childCol: 12 }} queryData={this.queryData} />
            </Card>
          </Col>

          <Col span={8}>
            <Card title="日历组件" extra={currentTime}>
              {/* normal, selectEnd, selectStart, selectWeek */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DtDatetimePicker options={{ rangeMode: 'selectWeek', rangeSpan: 14 }} onModel={this.selectDateTime} />
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="月份组件" extra={currentMonth(month)}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DtMonthPicker onModel={this.selectMonth} />
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="日期范围" extra={currentDateRange(dataRange)}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <DtDaterangePicker model={model} onModel={this.selecDateRange} />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
