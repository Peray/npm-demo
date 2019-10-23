export default {
  operatorList: [{
    name: '等于',
    operator: 'EQ'
  }, {
    name: '不等于',
    operator: 'NE'
  }, {
    name: '大于',
    operator: 'GT'
  }, {
    name: '大于等于',
    operator: 'GTE'
  }, {
    name: '小于',
    operator: 'LT'
  }, {
    name: '小于等于',
    operator: 'LTE'
  }, {
    name: '范围',
    operator: 'BETWEEN'
  }, {
    name: '包含',
    operator: 'IN'
  }, {
    name: '不包含',
    operator: 'NOT_IN'
  }, {
    name: '有值',
    operator: 'IS_NOT_NULL'
  }, {
    name: '空值',
    operator: 'IS_NULL'
  }, {
    name: '匹配',
    operator: 'LIKE'
  }, {
    name: '不匹配',
    operator: 'NOT_LIKE'
  }, {
    name: '开头匹配',
    operator: 'START_WITH'
  }, {
    name: '开头不匹配',
    operator: 'NOT_START_WITH'
  }, {
    name: '结尾匹配',
    operator: 'END_WITH'
  }, {
    name: '结尾不匹配',
    operator: 'NOT_END_WITH'
  }],
  typeOperator: {
    INT: ['EQ', 'NE', 'IS_NOT_NULL', 'IS_NULL', 'GT', 'GTE', 'LT', 'LTE', 'BETWEEN', 'IN', 'NOT_IN'],
    LONG: ['EQ', 'NE', 'IS_NOT_NULL', 'IS_NULL', 'GT', 'GTE', 'LT', 'LTE', 'BETWEEN', 'IN', 'NOT_IN'],
    DOUBLE: ['EQ', 'NE', 'IS_NOT_NULL', 'IS_NULL', 'GT', 'GTE', 'LT', 'LTE', 'BETWEEN', 'IN', 'NOT_IN'],
    DATE: ['EQ', 'NE', 'IS_NOT_NULL', 'IS_NULL', 'GT', 'GTE', 'LT', 'LTE', 'BETWEEN'],
    DATETIME: ['EQ', 'NE', 'IS_NOT_NULL', 'IS_NULL', 'GT', 'GTE', 'LT', 'LTE', 'BETWEEN'],
    STRING: ['EQ', 'NE', 'IS_NOT_NULL', 'IS_NULL', 'LIKE', 'NOT_LIKE', 'START_WITH', 'NOT_START_WITH', 'END_WITH', 'NOT_END_WITH', 'IN', 'NOT_IN']
  },
  connector: [{
    name: '且',
    value: 'AND'
  }, {
    name: '或',
    value: 'OR'
  }],
  validator: {
    STRING: {
      option: {
        required: true,
        maxLen: 50
      },
      message: {
        required: '请输入',
        maxLen: '最大输入50个字符'
      }
    },
    INT: {
      option: {
        required: true,
        maxLen: 11,
        regex: '^\\d*$'
      },
      message: {
        required: '请输入',
        maxLen: '最大长度11个字符',
        regex: '请输入数字'
      }
    },
    LONG: {
      option: {
        required: true,
        maxLen: 20,
        regex: '^\\d*$'
      },
      message: {
        required: '请输入',
        maxLen: '最大长度20个字符',
        regex: '请输入数字'
      }
    },
    DOUBLE: {
      option: {
        required: true,
        regex: '^\\d*[.]?\\d*$',
        maxLen: 20
      },
      message: {
        required: '请输入',
        maxLen: '最大长度20个字符',
        regex: '请输入浮点数字'
      }
    },
    DATETIME: {
      option: {
        required: true
      },
      message: {
        required: '请输入日期时间'
      }
    },
    DATE: {
      option: {
        required: true
      },
      message: {
        required: '请输入日期'
      }
    }
  }
};
