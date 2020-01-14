import moment from 'moment';

export default class Calendar {
  constructor(year, month, maxDate, minDate, first) {
    this.first = first || moment({ year, month, day: 1 });
    this.maxDate = maxDate;
    this.minDate = minDate;
    this.header = this.first.localeData()._weekdaysMin;
    this.data = null;
    this.update();
  }

  // 更新成上个月的日历
  prev() {
    if (this.minDate.valueOf('day') < this.first.valueOf('day')) {
      this.first = moment(this.first.subtract(1, 'month'));
      this.update();
    }
  }

  // 更新成下个月的日历
  next() {
    if (this.maxDate.valueOf('day') > this.last.valueOf('day')) {
      this.first = moment(this.first.add(1, 'month'));
      this.update();
    }
  }

  // 根据月份更新日历
  update() {
    this.updating = true;
    this.last = moment(this.first).endOf('month');
    let data = []; // week
    for (let i = 0; i < 6; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        week.push(i + j);
      }
      data.push(week);
    }
    for (let i = 0; i < this.first.daysInMonth(); i++) {
      let day = moment({
        year: this.first.year(),
        month: this.first.month(),
        day: i + 1
      });
      // track flag
      day.trackFlag = `${moment().valueOf()}-${i}`;
      let index = i + this.first.weekday() + 1;// ？
      let row = parseInt(index / 7);// 获取当前行
      if (this.first.weekday() === 6) {
        row--;
      }
      let col = index % 7;// 获取当前列
      data[row][col] = day;
    }
    this.data = data;
    this.updating = false;
  }
}
