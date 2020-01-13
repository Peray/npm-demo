import React, { Component } from 'react';
import './Query.scss';
import { Button, Row, Col, Input, Select, DatePicker, Checkbox } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import ArrayUtil from './utils/arrayUtil';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 数组转key:value对象
function arrToObj(arr, propertyName) {
  if ((!Array.isArray(arr)) || !arr.length || !propertyName) return;
  let obj = {};
  arr.forEach((v) => {
    switch (v.nodeType) {
      case 'input':
        obj[v[propertyName]] = '';
        break;
      case 'select':
        obj[v[propertyName]] = undefined;
        break;
      case 'dateRange':
        obj[v[propertyName]] = [null, null];
        break;
      case 'checkbox':
        obj[v[propertyName]] = false;
        break;
      default:
        break;
    }
  });
  return obj;
}

export default class Query extends Component {
  constructor(props) {
    super(props);
    this.state = arrToObj(this.props.config, 'propertyName');

    this.clear = this.clear.bind(this);
    this.query = this.query.bind(this);
  }

  handleInput(e, propertyName) {
    this.setState({ [propertyName]: e.target.value });
  }

  handleSelect(value, propertyName) {
    this.setState({ [propertyName]: value });
  }

  handleDateRange(value, propertyName) {
    const startTime = value[0] ? moment(value[0]).startOf('day').valueOf() : null;
    const endTime = value[1] ? moment(value[1]).endOf('day').valueOf() : null;
    this.setState({
      [propertyName]: [startTime, endTime]
    });
  }

  handleCheckbox(e, propertyName) {
    this.setState({ [propertyName]: e.target.checked });
  }

  // 清除
  clear() {
    const emptyState = arrToObj(this.props.config, 'propertyName');
    this.setState({
      ...emptyState
    }, () => {
      this.props.queryData(ArrayUtil.changeArrFormat(this.state, this.props.config));
    });
  }

  // 查询
  query() {
    this.props.queryData(ArrayUtil.changeArrFormat(this.state, this.props.config));
  }

  render() {
    const { isFold, config, grid } = this.props;
    const { leftCol, rightCol, childCol } = grid;

    // 数据类型渲染
    const handleOption = (values) => _.map(values, (v, i) => <Option key={i} value={v.value}>{v.name}</Option>);

    const formatDateRange = (value) => {
      if (!value) return;
      return [value[0] && moment(value[0]), value[1] && moment(value[1])];
    };

    return (
      <div className={`query ${!isFold ? 'fold' : null}`}>
        <Row gutter={24}>
          <Col span={leftCol} className="left">
            <Row gutter={24}>
              {
                _.map(config, (v, i) => {
                  return <Col span={childCol || 8} key={i} className={v.nodeType === 'dateRange' ? 'data-range' : null}>
                    {v.nodeType === 'checkbox' ? null : <span>
                      {v.name}
                    </span>}
                    {
                      v.nodeType === 'input'
                        ? <Input
                          placeholder="请输入"
                          onChange={(e) => this.handleInput(e, v.propertyName)}
                          value={this.state[v.propertyName]}
                        />
                        : v.nodeType === 'select'
                          ? <Select
                            allowClear
                            showSearch
                            placeholder="请选择"
                            optionFilterProp="children"
                            onChange={(value) => this.handleSelect(value, v.propertyName)}
                            value={this.state[v.propertyName]}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            disabled={!!this.state[v.disabledNode]}
                          >
                            {handleOption(v.options)}
                          </Select>
                          : v.nodeType === 'dateRange'
                            ? <RangePicker
                              onChange={(value) => this.handleDateRange(value, v.propertyName)}
                              value={formatDateRange(this.state[v.propertyName])}
                            />
                            : v.nodeType === 'checkbox'
                              ? <Checkbox
                                checked={this.state[v.propertyName]}
                                onChange={(e) => this.handleCheckbox(e, v.propertyName)}
                                disabled={!!this.state[v.disabledNode]}
                              >
                                {v.name}
                              </Checkbox>
                              : null
                    }
                  </Col>;
                })
              }
            </Row>
          </Col>
          <Col span={rightCol} className="right" style={{ padding: rightCol === 24 ? 16 : null }}>
            <Button className="DTButton" type="primary" onClick={this.query}>查询</Button>
            <Button onClick={this.clear}>清空</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
