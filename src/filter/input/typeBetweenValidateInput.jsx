import React, { Component } from 'react';
import { Row, Col, Input, DatePicker } from 'antd';
// import filterConfig from "../filterConfig";
import Log from '../utils/log';
import _ from 'lodash';
import FilterModel from '../filterModel';

const { RangePicker } = DatePicker;

const InputGroup = Input.Group;

const log = Log.getLogger('TypeBetweenValidateInput');

/**
 * 单独一个输入
 * this.value1 this.value2
 */
class TypeBetweenValidateInput extends Component {
    state = {
      filterModel: new FilterModel()
    };

    constructor(props) {
      super(props);
      this.state = { ...props };
    }

    onChangeValue1 = (e) => {
      log.debug('onChangeValue1', e);
      const { value } = e.target;
      const stateValue = Array.isArray(this.state.filterModel.value) ? this.state.filterModel.value : [];
      stateValue[0] = value;

      this.state.filterModel.setValue(stateValue);
      this.state.filterModel.setDirty(true);
      this.setState({ ...this.state });
      _.debounce(() => {
        this.state.filterModel.validate();
        this.setState({ ...this.state });
        this.props.onChange && this.props.onChange(this.state.filterModel);
      }, 200)();

      this.props.onChange && this.props.onChange(this.state.filterModel);
    }

    onChangeValue2 = (e) => {
      log.debug('onChangeValue2', e);
      const { value } = e.target;
      const stateValue = Array.isArray(this.state.filterModel.value) ? this.state.filterModel.value : [];
      stateValue[1] = value;

      this.state.filterModel.setValue(stateValue);
      this.state.filterModel.setDirty(true);
      this.state.filterModel.validate();
      this.setState({ ...this.state });
      _.debounce(() => {
        this.state.filterModel.validate();
        this.setState({ ...this.state });
        this.props.onChange && this.props.onChange(this.state.filterModel);
      }, 200)();

      this.props.onChange && this.props.onChange(this.state.filterModel);
    }

    onDateChange = (value) => {
      log.debug('onDateChange', value);
      console.log('value', value);
      this.state.filterModel.setValue(value);
      this.state.filterModel.setDirty(true);
      this.state.filterModel.validate();
      this.setState({ ...this.state });
      this.props.onChange && this.props.onChange(this.state.filterModel);
    }

    // 获得校验器
    // _getTypeValidtorState() {
    //     return filterConfig.validator[this.state.type];
    // }

    createInputComp() {
      const value = ['', ''];
      const { filterModel } = this.state;
      if (filterModel.value && Array.isArray(filterModel.value) && filterModel.value.length > 0) {
        value[0] = filterModel.value[0];
      }
      if (filterModel.value && Array.isArray(filterModel.value) && filterModel.value.length > 1) {
        value[1] = filterModel.value[1];
      }
      return (
        <InputGroup size>
          <Row gutter={2} type="flex" justify="space-around" align="top">
            <Col span={11}>
              <Input value={value[0]} onChange={this.onChangeValue1} />
            </Col>
            <Col span={2} style={{ textAlign: 'center', marginTop: 5 }}>
              至
            </Col>
            <Col span={11}>
              <Input value={value[1]} onChange={this.onChangeValue2} />
            </Col>
          </Row>
        </InputGroup>
      );
    }

    createDatePicker() {
      let props = {
      };

      const { filterModel } = this.state;
      const { property } = filterModel;
      if (property.type === 'DATETIME') {
        props = {
          // ...this.props,
          showTime: { format: 'HH:mm:ss' },
          format: 'YYYY-MM-DD HH:mm:ss',
          placeholder: ['开始时间', '结束时间'],
          onOk: this.onDateChange,
          onChange: this.onDateChange,
          style: { width: '100%' }
        };
      } else {
        props = {
          // ...this.props,
          format: 'YYYY-MM-DD',
          placeholder: ['开始日期', '结束日期'],
          onChange: this.onDateChange,
          style: { width: '100%' }
        };
      }
      if (filterModel.value) props.value = filterModel.value;

      return (<RangePicker {...props} />);
    }

    createComp = () => {
      const { filterModel } = this.state;
      const { property } = filterModel;
      if (property.type === 'INT' || property.type === 'LONG' || property.type === 'DOUBLE') {
        return this.createInputComp();
      } else if (property.type === 'DATE' || property.type === 'DATETIME') {
        return this.createDatePicker();
      }
      return <div>
        {property.type}
        not implement
      </div>;
    };

    render() {
      log.debug('render', this.state);
      return (
        <>
          {this.createComp()}
        </>
      );
    }
}

export default TypeBetweenValidateInput;
