import React, { Component } from 'react';
import { Input, AutoComplete, DatePicker } from 'antd';
// import InputValidator from './inputValidator';
// import filterConfig from "../filterConfig";
import Log from '../utils/log';
import _ from 'lodash';
import FilterModel from '../filterModel';

const log = Log.getLogger('TypeValidateInput');
const { Option } = AutoComplete;

/**
 * 校验输入
 */
class TypeValidateInput extends Component {
  constructor(props) {
    super(props);
    log.debug('constructor', props);
    this.state = {
      ...props
    };
  }

  state = {
    filterModel: new FilterModel()
  };

  // componentDidMount() {
  //   const { filterModel } = this.state;
  //   if (filterModel && filterModel.property && filterModel.property.isEnum) {
  //     const p = filterModel.setPropertyItems();
  //     p && p.then(() => this.setState({ ...this.state }));
  //   }
  // }
  onValueChange(value) {
    this.state.filterModel.setValue(value);
    this.state.filterModel.setDirty(true);
    this.setState({ ...this.state });
    _.debounce(() => {
      this.state.filterModel.validate();
      this.setState({ ...this.state });
      this.props.onChange && this.props.onChange(this.state.filterModel);
    }, 200)();
  }

    onInputChanage = (e) => {
      const { value } = e.target;
      this.onValueChange(value);
    };

    onSelectChange = (value) => {
      this.onValueChange(value);
    };

    onDateChange = (value) => {
      this.onValueChange(value);
    }

    /**
     * 输入一个值的情况
     */
    _oneInput(type) {
      // if (type === 'INT' || type === "STRING" || type === "LONG" || type === "DOUBLE") {

      // }
      const inputPorps = {
        onChange: this.onInputChanage
      };
      inputPorps.value = this.state.filterModel.value;
      return <Input {...inputPorps} />;
    }

    _filterOption = (inputValue, option) => {
      log.debug(option);
      if (option.props.children.toString().indexOf(inputValue.toString()) >= 0) return true;
    };

    _oneSelect(type, items) {
      if (items) {
        items.filter((i) => typeof i === 'number').forEach((v, i) => items[i] = v.toString());
      } else {
        items = [];
      }

      const selectProps = {
        showSearch: true,
        filterOption: this._filterOption,
        style: { width: '100%' },
        onChange: this.onSelectChange,
        allowClear: true
      };
      selectProps.value = this.state.filterModel.value;
      // if (this.state.filterModel.value) {
      // }


      return (
        <AutoComplete {...selectProps}>
          {
            items.map((i) => <Option key={i.value || i}>{i.name || i}</Option>)
          }
        </AutoComplete>
      );
    }

    _getDateInput(type) {
      const props = {
        placeholder: '请输入日期',
        onChange: this.onDateChange,
        style: { width: '100%' },
        value: this.state.filterModel.value,
        allowClear: true
      };
      if (type === 'DATETIME') {
        props.showTime = { format: 'HH:mm:ss' };
        props.format = 'YYYY-MM-DD HH:mm:ss';
      }
      return <DatePicker {...props} getCalendarContainer={(triggerNode) => triggerNode.parentNode} />;
    }

    _getTypeInput() {
      const { filterModel } = this.state;
      const { property } = filterModel;

      if (property.type === 'DATE' || property.type === 'DATETIME') {
        return this._getDateInput(property.type);
      }

      if (!property.isEnum) return this._oneInput(property.type);

      return this._oneSelect(property.type, property.items);
    }

    render() {
      log.debug('render', this.state);
      return (
        <>
          {this._getTypeInput()}
          <br />
        </>
      );
    }
}

export default TypeValidateInput;
