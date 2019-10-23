import Log from './utils/log';
import moment from 'moment';
import _ from 'lodash';
import InputValidator from './input/inputValidator';
import filterConfig from './filterConfig';

const log = Log.getLogger('FilterModel');

// 连接器
const FILTER_CONNECTOR = filterConfig.connector;

class FilterModel {
    static counter = 0;

    constructor(property, operator, value, connector) {
      // log.debug('constructor', property, operator, value, connector);
      this.id = ++FilterModel.counter;
      this.property = property;
      this.operator = operator;
      this.value = value;
      this.connector = connector || FILTER_CONNECTOR[0].value;
      this.isDirty = false;

      this.validator = false;
      if (property && operator) {
        this.__validate(property.type, value, operator);
      }

      // 是否被提交
      this.isSubmitted = false;
      // this.setPropertyItems();
      log.debug('constructor', this.property, this.operator, this.value, this.connector);
    }

    /**
     * 从property的dataProvider中获取数据然后设置到items上，用于显示枚举
     */
    // async setPropertyItems() {
    //   if (this.property && this.property.dataProvider && !this.property.items) {
    //     const items = await this.property.dataProvider();
    //     if (Array.isArray(items)) {
    //       this.property.items = items.filter((i) => i !== null && i !== '' && i !== undefined);
    //       log.debug('setPropertyItems', this.property.items);
    //     }
    //   }
    // }

    setDirty(isDirty) {
      this.isDirty = isDirty;
    }

    validate() {
      this.__validate(this.property.type, this.value, this.operator);
    }

    __validate(type, value, operator) {
      // log.debug('__validate', type, value, operator);
      const validator = {};
      if (!type) {
        validator.type = '没有操作符';
      }

      if (!operator) {
        validator.operator = '请输入操作符';
      }

      if (operator !== 'IS_NULL' & operator !== 'IS_NOT_NULL') {
        const typeValidator = filterConfig.validator[type];
        if (Array.isArray(value)) {
          if (value.length === 0) {
            validator.value = InputValidator.valid(false, typeValidator, value);
          } else {
            for (let i = 0; i < value.length; i++) {
              const valueValidator = InputValidator.valid(false, typeValidator, value[i]);
              if (valueValidator !== true) {
                validator.value = valueValidator;
                break;
              }
            }
          }
        } else {
          const validRsult = InputValidator.valid(false, typeValidator, value);
          if (validRsult !== true) {
            validator.value = validRsult;
          }
        }
      }

      // log.debug('__validate result', validator);
      if (!validator.value && !validator.operator && !validator.operator) {
        this.validator = true;
      } else { this.validator = validator; }
      // log.debug('__validate result', this.validator);
    }

    isValid() {
      return this.validator === true;
    }

    setValue(value) {
      log.debug('setValue', value);
      if (this.operator && this.operator === 'BETWEEN') {
        const initValue = [null, null];
        if (Array.isArray(value)) {
          initValue[0] = value[0];
          initValue[1] = value[1];
        }
        value = initValue;
      }
      this.value = value;
      // this.__validate(this.property.type, value, this.operator);
    }

    getValue() {
      return this.value;
    }

    changeProperty(property) {
      log.debug('changeProperty', property);
      this.property = property;
      this.operator = null;
      this.value = null;
      this.isDirty = false;
    }

    changeOperator(operator) {
      log.debug('changeOperator', operator);
      this.operator = operator;
      this.value = null;
      this.isDirty = false;

      this.__validate(this.property.type, this.value, this.operator);
    }

    clearProperty() {
      log.debug('clearProperty');
      this.property = null;
      this.operator = null;
      this.value = null;
      this.validator = false;
      this.isDirty = false;
    }

    getErrorMessage() {
      const { validator } = this;

      if (validator !== true && validator) {
        if (validator.type) { return validator.type; }

        if (validator.operator) { return validator.operator; }

        if (validator.value) {
          for (let k in validator.value) {
            if ({}.hasOwnProperty.call(validator.value, k)) {
              return validator.value[k];
            }
          }
        }
      }
    }

    getValueErrorMessage() {
      const { validator } = this;
      if (validator.value) {
        for (let k in validator.value) {
          if ({}.hasOwnProperty.call(validator.value, k)) {
            return validator.value[k];
          }
        }
      }
      return null;
    }

    __getOneShowValue(value) {
      const { isEnum, items } = this.property;
      if (isEnum && items && items.length > 0 && items[0].name && items[0].value) {
        const kv = _.find(items, (v) => v.value === value);
        if (kv && kv.name) {
          return kv.name;
        }
        return kv || '';
      }

      return value || '';
    }

    getShowValue() {
      const { value, operator } = this;
      const { type } = this.property;

      if (!value) { return ''; }

      switch (operator) {
        case 'EQ':
        case 'NE':
        case 'GT':
        case 'GTE':
        case 'LT':
        case 'LTE':
        case 'LIKE':
        case 'NOT_LIKE':
        case 'START_WITH':
        case 'NOT_START_WITH':
        case 'END_WITH':
        case 'NOT_END_WITH':
          if (type === 'DATE') {
            return `${value.format('YYYY-MM-DD')}`;
          } else if (type === 'DATETIME') {
            return `${value.format('YYYY-MM-DD HH:mm:ss')}`;
          }
          return this.__getOneShowValue(value);
        case 'BETWEEN':
          if (type === 'DATE') {
            return `[${value[0].format('YYYY-MM-DD')} - ${value[1].format('YYYY-MM-DD')}]`;
          } else if (type === 'DATETIME') {
            return `[${value[0].format('YYYY-MM-DD HH:mm:ss')} - ${value[1].format('YYYY-MM-DD  HH:mm:ss')}]`;
          }

          return `[${this.__getOneShowValue(value[0])}-${this.__getOneShowValue(value[1])}]`;
        case 'IN':
        case 'NOT_IN':
          return `[${value.map((v) => this.__getOneShowValue(v))}]`;
        case 'IS_NOT_NULL':
        case 'IS_NULL':
          return '';
        default:
          return '';
      }
    }

    toJson() {
      let { value } = this;

      if (this.property.type === 'DATETIME' || this.property.type === 'DATE') {
        if (Array.isArray(value)) {
          value = value.map((v) => v.valueOf());
        } else if (value) {
          value = value.valueOf();
        }
      }

      return {
        level1: this.property.level1,
        level2: this.property.level2,
        tableId: this.property.tableId,
        fieldName: this.property.name,
        field: this.property.value,
        fieldType: this.property.type,
        value,
        operator: this.operator,
        connector: this.connector
      };
    }

    static fromJson(filter, propertyList) {
      let { value } = filter;

      const property = {
        level1: filter.level1,
        level2: filter.level2,
        tableId: filter.tableId,
        name: filter.fieldName,
        value: filter.field,
        type: filter.fieldType
      };

      if (Array.isArray(propertyList)) {
        const { level1, level2 } = filter;
        const findProperty = propertyList.filter((p) => p.level1 === level1 && p.level2 === level2 && p.value === property.value)[0];
        if (findProperty && findProperty.isEnum) {
          property.isEnum = findProperty.isEnum;
          property.items = findProperty.items;
        }
      }

      if ((property.type === 'DATETIME' || property.type === 'DATE') && value) {
        if (Array.isArray(value)) {
          value = value.map((v) => moment(v));
        } else {
          value = moment(value);
        }
      }
      // console.log('-----------', value);

      const filterModel = new FilterModel(
        property,
        filter.operator,
        value,
        filter.connector
      );
      return filterModel;
    }
}

export default FilterModel;
