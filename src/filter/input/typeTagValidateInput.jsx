import React, { Component } from 'react';
import { Select } from 'antd';
import Log from '../utils/log';
import FilterModel from '../filterModel';

const { Option } = Select;
const log = Log.getLogger('TypeTagValidateInput');

/**
 * 校验输入
 */
class TypeTagValidateInput extends Component {
    state = {
      filterModel: new FilterModel()
    };

    constructor(props) {
      super(props);
      log.debug('constructor', props);
      this.state = { ...props };
    }

    // // 获得校验器
    // _getTypeValidtorState() {
    //     return filterConfig.validator[this.state.type];
    // }

    /**
     * 校验输入值
     * @return validator
     */
    // validValue(isInit, value) {
    //     const validSate = this._getTypeValidtorState();
    //     if (Array.isArray(value)) {
    //         if (value.length === 0) {
    //             return InputValidator.valid(isInit, validSate, null);
    //         }
    //         for (let i=0; i< value.length; i++) {
    //             let validator = InputValidator.valid(isInit, validSate, value[i]);
    //             if (validator !== true)
    //                 return validator;
    //         }
    //         return true;
    //     } else {
    //         return InputValidator.valid(isInit, validSate, value);
    //     }
    // }

    onSelectChange = (value) => {
      this.state.filterModel.setValue(value);
      this.state.filterModel.setDirty(true);
      this.state.filterModel.validate();
      // console.log(this.state.filterModel);
      this.setState({
        ...this.state
      });
      this.props.onChange && this.props.onChange(value);
    };

    _filterOption = (inputValue, option) => {
      log.debug(option);
      if (option.props.children.toString().indexOf(inputValue.toString()) >= 0) return true;
    };

    _getTypeInput() {
      // filterModel.setPropertyItems();
      const { filterModel } = this.state;
      const { property, operator, value } = filterModel;
      const { items = [] } = property;

      const selectProps = {
        showSearch: true,
        mode: (operator === 'NOT_IN' || operator === 'IN') ? 'multiple' : 'tags',
        filterOption: this._filterOption,
        style: { width: '100%' },
        onChange: this.onSelectChange,
        allowClear: true,
        maxTagCount: 10
      };
      selectProps.value = value;
      if (!value) selectProps.value = [];
      // let selectItems;
      // if (operator === 'NOT_IN' || operator === 'IN') {
      //   console.log(value);
      //   if (value) selectItems = items.filter((o) => !value.includes(o));
      // }

      return (
        <Select {...selectProps} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
          { items.map((item) => <Option
            key={item.value ? item.value : item}
            value={item.value ? item.value : item}
          >
            {item.name ? item.name : item}
          </Option>)}
        </Select>
      );
    }

    render() {
      return (
        <>
          {this._getTypeInput()}
          <br />
        </>
      );
    }
}

export default TypeTagValidateInput;
