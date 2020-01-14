import React, { Component } from 'react';
import './monthPicker.scss';
import { Button, Row, Col } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import CalendarMonth from '../components/CalendarMonth.js';

const dtOptions = {
  needNext: true,
  needPrev: true,
  viewDate: moment(),
  minDate: moment().subtract(10, 'year'),
  maxDate: moment()
};

class DtMonthPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendar: new CalendarMonth(),
      model: {
        date: moment(),
        startDate: moment().startOf('month'),
        endDate: moment().endOf('month')
      },
      isDisabledprev: null,
      isDisabledNext: null
    };

    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  /* life circle */
  componentDidMount() {
    this.createCalendar();
    this.getPrevType();
    this.getNextType();
  }

  /* methods */
  createCalendar() {
    const { model } = this.state;
    const year = dtOptions.viewDate.year();
    const month = dtOptions.viewDate.month();

    this.setState({ calendar: new CalendarMonth(year, month, dtOptions.maxDate, dtOptions.minDate) });
    this.selectedMonth(model.date);
  }

  prev() {
    const { calendar } = this.state;
    calendar.prev();
    this.setState({ calendar }, () => {
      this.getPrevType();
      this.getNextType();
    });
  }

  next() {
    const { calendar } = this.state;
    calendar.next();
    this.setState({ calendar }, () => {
      this.getPrevType();
      this.getNextType();
    });
  }

  getPrevType() {
    const { calendar } = this.state;
    if (calendar.updating || dtOptions.minDate.valueOf('month') >= calendar.first.valueOf('month')) {
      this.setState({ isDisabledprev: true });
    } else {
      this.setState({ isDisabledprev: false });
    }
  }

  getNextType() {
    const { calendar } = this.state;
    if (calendar.updating || dtOptions.maxDate.valueOf('month') <= calendar.last.valueOf('month')) {
      this.setState({ isDisabledNext: true });
    } else {
      this.setState({ isDisabledNext: false });
    }
  }

  selectedMonth(month) {
    const { model: defaultModel } = this.state;
    if (month.startOf('month').valueOf() <= dtOptions.maxDate.startOf('month').valueOf() && month.startOf('month').valueOf() >= dtOptions.minDate.startOf('month').valueOf()) {
      const model = { ...defaultModel, date: month, startDate: month.startOf('month'), endDate: month.endOf('month') };
      this.setState({ model }, () => {
        this.props.onModel(model);
      });
    }
  }

  render() {
    const { calendar, isDisabledprev, isDisabledNext, model } = this.state;
    const currentYear = calendar.first.format('YYYY年');

    /* 是否是当前月 */
    const monthIsCurrent = (month) => {
      if (!month) return;
      return model.date != null && month.endOf('month').valueOf() === model.date.endOf('month').valueOf();
    };

    /* 是否禁用某一月 */
    const monthIsDisabled = (month) => {
      if (!month) return;
      return month.startOf('month').valueOf() < dtOptions.minDate.startOf('month').valueOf() || month.startOf('month').valueOf() > dtOptions.maxDate.startOf('month').valueOf();
    };

    /* 获取所有月份 */
    const months = calendar.data.map((month, key) => {
      return <Col span={6} className="daypad" key={key}>
        <span onClick={() => this.selectedMonth(month)} className={`${monthIsCurrent(month) ? 'active' : monthIsDisabled(month) ? 'disabled' : null}`}>{`${month.month() + 1}月`}</span>
      </Col>;
    });

    /** 渲染前进后退按钮 */
    let buttonPrev;
    let buttonNext;
    if (dtOptions.needPrev) {
      buttonPrev = <Button type="primary" shape="circle" icon="left" onClick={this.prev} disabled={isDisabledprev} />;
    }
    if (dtOptions.needNext) {
      buttonNext = <Button type="primary" shape="circle" icon="right" onClick={this.next} disabled={isDisabledNext} />;
    }

    return (
      <div className="dc-event-datatime-months">
        <Row className="header">
          <Col span={8} className="text-align">{buttonPrev}</Col>
          <Col span={8} className="text-align current-datetime">{currentYear}</Col>
          <Col span={8} className="text-align">{buttonNext}</Col>
        </Row>
        <Row className="section">{months}</Row>
      </div>
    );
  }
}

export default DtMonthPicker;
