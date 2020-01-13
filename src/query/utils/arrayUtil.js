class ArrayUtil {
  /**
     * 从数组删除某个对象
     * @param  {array} arr
     * @param  {object} element
     * @return {array}         删除后的数组
     */
  static remove(arr, element) {
    let index = arr.indexOf(element);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }

  // 只能查找基本数据类型
  /**
     * 找到一个数组，满足property=value
     * @param  {array} arr
     * @param  {string} property
     * @param  {string|number} value
     * @return {array}          新数组
     */
  static findObjectByProperty(arr, property, value) {
    if (!arr) { return null; }
    let ret = [];
    for (let i = 0; i < arr.length; i++) {
      let fValue = arr[i] && arr[i][property];
      // FIXME: 注意 ==
      if (value === fValue) { ret.push(arr[i]); }
    }
    return ret;
  }

  /**
     * 从数组找到第一个满足property=value的数据
     */
  static findOneObjectByProperty(arr, property, value) {
    let ret = ArrayUtil.findObjectByProperty(arr, property, value);
    if (ret && ret.length) { return ret[0]; }
  }

  static ensureUnique(arr, flag) {
    flag = flag || '$';
    let s = arr.join(flag) + flag;
    let unique = 1;
    for (let i = 0; i < arr.length; i++) {
      if (s.replace(arr[i] + flag, '').indexOf(arr[i] + flag) > -1) { unique = 0; }
    }
    return unique;
  }

  /**
   *给数据指定属性赋值
   * @param {array原数组} arr
   * @param {string条件名} prop1
   * @param {string条件值} value1
   * @param {string结果名} prop2
   * @param {array结果值} value2
   * @return {array}
   */
  static toArrByPropAndValue(arr, prop1, value1, prop2, value2) {
    if (!Array.isArray(arr) || !prop1 || !value1 || !prop2) return;
    let otherArr = [];
    arr.forEach((v) => {
      if (v[prop1] === value1) {
        v[prop2] = value2 || [];
      }
      otherArr.push(v);
    });
    return otherArr;
  }

  /**
   *改变数组为指定key数组
   * @static
   * @param {array原数组} arr
   * @param {string目标key} prop1
   * @param {string目标value} value1
   * @param {string原始key} prop2
   * @param {string原始value} value2
   * @returns {array}
   * @memberof ArrayUtil
   */
  static changeArrByKey(arr, prop1, value1, prop2, value2) {
    if (!Array.isArray(arr) || !prop1 || !value1 || !prop2 || !value2) return;
    const otherArr = [];
    arr.forEach((v) => {
      otherArr.push({
        [prop1]: v[value1],
        [prop2]: v[value2]
      });
    });
    return otherArr;
  }

  static changeArrFormat(obj, arr) {
    let otherArr = [];
    if (Object.prototype === obj.__proto__ || Array.isArray(arr)) {
      for (let key in obj) {
        arr.forEach((item) => {
          if (item.propertyName === key) {
            switch (item.operator) {
              case 'EQ':
              case 'LIKE':
                item.value = obj[key];
                break;
              case 'DATE_BETWEEN':
                item.value = !obj[key][0] || !obj[key][1] ? '' : obj[key].join(',');
                break;
              default:
                break;
            }
            otherArr.push({
              operator: item.operator,
              propertyName: item.propertyName,
              value: item.value
            });
          }
        });
      }
      return otherArr;
    }
  }
}

export default ArrayUtil;
