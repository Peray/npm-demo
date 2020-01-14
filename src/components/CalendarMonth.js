import moment from 'moment';
import 'moment/locale/zh-cn';

export default class CalendarMonth {
  constructor(year = moment().year(), month = moment().month(), maxDate = moment().subtract(10, 'year'), minDate = moment().subtract(1, 'month')) {
    this.first = moment({ year, month, day: 1 });
    this.maxDate = maxDate;
    this.minDate = minDate;
    this.data = null;
    this.update();
  }

  // 更新成上一年的日历
  prev() {
    if (this.minDate.valueOf('month') < this.first.valueOf('month')) {
      this.first = moment(this.first.subtract(1, 'year'));
      this.update();
    }
  }

  // 更新成下一年的日历
  next() {
    if (this.maxDate.valueOf('month') > this.last.valueOf('month')) {
      this.first = moment(this.first.add(1, 'year'));
      this.update();
    }
  }

  // 根据年份更新日历
  update() {
    this.updating = true;
    this.last = moment(this.first).endOf('month');
    let data = []; // month
    for (let i = 0; i < 12; i++) {
      let month = moment({ year: this.first.year(), month: i, day: 1 });
      data[i] = month;
    }
    this.data = data;
    this.updating = false;
  }
}
