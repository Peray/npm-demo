import React, { Component } from 'react';
import './datetimePicker.scss';
import { Button } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PropTypes from 'prop-types';
import Calendar from '../components/Calendar.js';

class DtDatetimePicker extends Component {
  constructor(props) {
    super(props);
    const defaultOptions = {
      viewDate: moment(),
      needNext: true,
      needPrev: true,
      minDate: moment().subtract(1, 'year'),
      maxDate: moment().subtract(1, 'days'),
      maxSelectDays: undefined, // undefine 不使用
      // 选择区间的模式
      // normal 普通模式
      // selectEnd 选择最后的时间 开始时间是选择的时间-rangeSpan
      // selectStart 选择开始的时间 结束时间是+rangeSpan
      // selectWeek 选择自然周整周,不需要指定rangeSpan
      rangeMode: 'selectStart', // normal, selectEnd, selectStart, selectWeek
      rangeSpan: 7,
      ...props.options
    };
    this.state = {
      model: {
        date: moment(),
        startDate: moment().subtract(7, 'days'),
        endDate: moment(),
        selectMaxDate: null,
        ...props.dateRange
      },
      dtOptions: defaultOptions,
      calendar: new Calendar(),
      isDisabledprev: false,
      isDisabledNext: false
    };

    this.getPrevType = this.getPrevType.bind(this);
    this.getNextType = this.getNextType.bind(this);
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
  prev() {
    this.state.calendar.prev();
    this.setState({ calendar: this.state.calendar });
    this.getPrevType();
    this.getNextType();
  }

  next() {
    this.state.calendar.next();
    this.setState({ calendar: this.state.calendar });
    this.getPrevType();
    this.getNextType();
  }

  createCalendar() {
    const { dtOptions } = this.state;
    const year = dtOptions.viewDate.year();
    const month = dtOptions.viewDate.month();
    this.setState({ calendar: new Calendar(year, month, dtOptions.maxDate, dtOptions.minDate) });
  }

  getPrevType() {
    if (this.state.calendar.updating || this.state.dtOptions.minDate.valueOf('day') >= this.state.calendar.first.valueOf('day')) {
      this.setState({ isDisabledprev: true });
    } else {
      this.setState({ isDisabledprev: false });
    }
  }

  getNextType() {
    if (this.state.calendar.updating || this.state.dtOptions.maxDate.valueOf('day') < this.state.calendar.last.valueOf('day')) {
      this.setState({ isDisabledNext: true });
    } else {
      this.setState({ isDisabledNext: false });
    }
  }

  select(date) {
    const { dtOptions, model: defaultModel, calendar } = this.state;
    const { startDate, endDate } = defaultModel;

    // 超出时间范围
    if (typeof date !== 'object' || !dtOptions.minDate || !dtOptions.maxDate || date.startOf('day').valueOf() < dtOptions.minDate.startOf('day').valueOf() || date.startOf('day').valueOf() > dtOptions.maxDate.startOf('day').valueOf()) {
      return;
    }

    // range mode是selectStart, selectEnd
    if (dtOptions.rangeMode === 'selectStart') {
      const model = { ...defaultModel, startDate: date, endDate: date.clone().add(dtOptions.rangeSpan - 1, 'days') };
      this.setState({ model }, () => {
        this.props.onModel(model);
      });
      return;
    }

    if (dtOptions.rangeMode === 'selectEnd') {
      const model = { ...defaultModel, startDate: date.clone().subtract(dtOptions.rangeSpan - 1, 'days'), endDate: date };
      this.setState({ model }, () => {
        this.props.onModel(model);
      });
      return;
    }

    if (dtOptions.rangeMode === 'selectWeek') {
      const model = { ...defaultModel, startDate: date.clone().startOf('week'), endDate: date.clone().endOf('week') };
      this.setState({ model }, () => {
        this.props.onModel(model);
      });
      return;
    }

    // borth
    if (!startDate || (date.startOf('day').valueOf() < startDate.startOf('day').valueOf()) || (startDate && endDate)) {
      const selectMaxDate = (dtOptions.maxSelectDays != null && date.add(dtOptions.maxSelectDays - 1, 'days')) || null;
      const model = { ...defaultModel, startDate: date, endDate: null, selectMaxDate };
      this.setState({ model }, () => {
        this.props.onModel(model);
      });
      if (typeof dtOptions.selectStartDate === 'function') dtOptions.selectStartDate(dtOptions, date, calendar);
    } else {
      const model = { ...defaultModel, endDate: date, selectMaxDate: null };
      this.setState({ model }, () => {
        this.props.onModel(model);
      });
      if (typeof dtOptions.selectEndDate === 'function') dtOptions.selectEndDate(dtOptions, date, calendar);
    }
  }

  render() {
    const { dtOptions, calendar, isDisabledprev, isDisabledNext, model } = this.state;
    const currentDate = calendar.first.format('YYYY年 MM月');
    const weekday = calendar.header.map((value) => <td key={value.toString()}>{value}</td>);

    /**
     * 输入日期是否是开始时间
     * @param  {moment} day
     */
    const dayIsStart = (day) => {
      if (typeof day === 'number') return;
      return model.startDate != null && day.startOf('day').valueOf() === model.startDate.startOf('day').valueOf();
    };

    /**
     * 输入的日期是否是结束时间
     * @param  {moment} day
     */
    const dayIsEnd = (day) => {
      if (typeof day === 'number') return;
      return model.endDate != null && day.startOf('day').valueOf() === model.endDate.startOf('day').valueOf();
    };

    /**
     * 输入的日期是否是选择范围内的日期
     * @param  {moment} day
     */
    const dayIsRanged = (day) => {
      if (typeof day === 'number') return;
      return model.startDate != null && model.endDate != null && day.startOf('day').valueOf() > model.startDate.startOf('day').valueOf() && day.startOf('day').valueOf() < model.endDate.startOf('day').valueOf();
    };

    /**
     * 输入日期是否是无效的
     * @param  {moment} day
     */
    const isOverMaxSeletDate = (day) => {
      if (dtOptions.maxSelectDays == null || !model.selectMaxDate) return false;
      return day.startOf('day').valueOf() > model.selectMaxDate.startOf('day').valueOf();
    };

    const dayIsDisabled = (day) => {
      if (typeof day === 'number') return;
      return day.startOf('day').valueOf() < dtOptions.minDate.startOf('day').valueOf() || day.startOf('day').valueOf() > dtOptions.maxDate.startOf('day').valueOf() || isOverMaxSeletDate(day);
    };

    /** 渲染日期 */
    const getDay = (v) => v.map((item, number) => {
      return this.props.parentSelect
        ? <td key={number} className={`${dayIsStart(item) ? 'start' : dayIsEnd(item) ? 'end' : dayIsRanged(item) ? 'ranged' : dayIsDisabled(item) ? 'disabled' : null}`} onClick={() => this.props.parentSelect(item)}>{typeof item === 'object' ? item.date() : null}</td>
        : <td key={number} className={`${dayIsStart(item) ? 'start' : dayIsEnd(item) ? 'end' : dayIsRanged(item) ? 'ranged' : dayIsDisabled(item) ? 'disabled' : null}`} onClick={() => this.select(item)}>{typeof item === 'object' ? item.date() : null}</td>;
    });

    /** 渲染前进后退按钮 */
    let buttonPrev;
    let buttonNext;
    if (dtOptions.needPrev) {
      buttonPrev = this.props.selectType
        ? <Button type="primary" shape="circle" icon="left" onClick={() => this.props.selectType('prev')} disabled={isDisabledprev} />
        : <Button type="primary" shape="circle" icon="left" onClick={this.prev} disabled={isDisabledprev} />;
    }
    if (dtOptions.needNext) {
      buttonNext = this.props.selectType
        ? <Button type="primary" shape="circle" icon="right" onClick={() => this.props.selectType('next')} disabled={isDisabledNext} />
        : <Button type="primary" shape="circle" icon="right" onClick={this.next} disabled={isDisabledNext} />;
    }


    return (
      <div className="dtDatetimePicker">
        <table>
          <thead>
            <tr>
              <td colSpan="2">{buttonPrev}</td>
              <td colSpan="3">{currentDate}</td>
              <td colSpan="2">{buttonNext}</td>
            </tr>
            <tr>{weekday}</tr>
          </thead>
          <tbody>
            {
                calendar.data.map((item, index) => {
                  return (
                    <tr key={index}>{getDay(item)}</tr>
                  );
                })
            }
          </tbody>
        </table>
      </div>
    );
  }
}

DtDatetimePicker.propTypes = {
  options: PropTypes.object
};

export default DtDatetimePicker;
