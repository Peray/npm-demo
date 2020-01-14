import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import DtDatetimePicker from '../datetimePicker/DatetimePicker';
import './daterangePicker.scss';

const leftOptions = {
  viewDate: moment().subtract(1, 'month'),
  needNext: false,
  rangeMode: ''
};

const rightOptions = {
  viewDate: moment(),
  needPrev: false,
  rangeMode: ''
};

class DtDaterangePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  selectType(type) {
    if (type === 'prev') {
      this.leftChild.prev();
      this.rightChild.prev();
    } else if (type === 'next') {
      this.leftChild.next();
      this.rightChild.next();
    }
  }

  select(date) {
    this.leftChild.select(date);
    this.rightChild.select(date);
  }

  render() {
    const { dateRange } = this.props;

    return (
      <div className="datetimePicker">
        <Row type="flex">
          <Col span={12}>
            <DtDatetimePicker options={leftOptions} dateRange={dateRange} onModel={(value) => this.props.onModel(value)} selectType={(type) => this.selectType(type)} parentSelect={(date) => this.select(date)} ref={(ref) => this.leftChild = ref} />
          </Col>
          <Col span={12}>
            <DtDatetimePicker options={rightOptions} dateRange={dateRange} onModel={(value) => this.props.onModel(value)} selectType={(type) => this.selectType(type)} parentSelect={(date) => this.select(date)} ref={(ref) => this.rightChild = ref} />
          </Col>
        </Row>
      </div>
    );
  }
}

DtDaterangePicker.propTypes = {
  dateRange: PropTypes.object
};

export default DtDaterangePicker;
