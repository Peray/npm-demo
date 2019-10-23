import React, { Component } from 'react';
import { Row, Col, Select, Alert, Typography } from 'antd';
import Log from './utils/log';
import FilterValue from './filterValue';
import filterConfig from './filterConfig';
import FilterModel from './filterModel';

const { Option } = Select;
const { Text } = Typography;

// 操作符map
const OPERATOR_MAP = filterConfig.operatorList.reduce((map, obj) => {
  map[obj.operator] = obj;
  return map;
}, {});

const TYPE_OPERATOR_MAP = filterConfig.typeOperator;

// const FILTER_CONNECTOR = filterConfig.connector;

const log = Log.getLogger('Filter');
// Log.logConfig['Filter'] = {level: 'info'};

class Filter extends Component {
    state = {
      filterModel: new FilterModel(),
      level1: null,
      level2: null,
      level1List: [],
      level2List: [],
      propertyList: []
    };

    constructor(props) {
      super(props);
      this.state = { ...this.state, ...props };
      this.__initState();
      const newState = this.createComponentState(this.state);
      this.state = { ...this.state, ...newState };
      this.onChange();
    }

    static getDerivedStateFromProps(props, state) {
      log.debug('getDerivedStateFromProps', props, state);
      // 为filterModel重新赋值，解决items的问题
      const propsFilterModel = props.filterModel;
      const stateFilterModel = state.filterModel;
      if (propsFilterModel && propsFilterModel.property) {
        if (stateFilterModel.property && stateFilterModel.property.items) {
          propsFilterModel.property.items = stateFilterModel.property.items;
        }
      }

      return {
        ...state,
        ...props
      };
    }

    // 初始化组件，默认显示
    createComponentState(state) {
      log.debug('createComponentState', state);
      // 设置初始值
      const newState = {
        level1: state.level1 ? state.level1 : '',
        level2: state.level2 ? state.level2 : '',
        filterModel: state.filterModel
      };

      if (state.filterModel && newState.filterModel.property) {
        newState.level1 = newState.filterModel.property.level1;
        newState.level2 = newState.filterModel.property.level2;
        if (!newState.filterModel.operator) {
          newState.filterModel.changeOperator(TYPE_OPERATOR_MAP[this.getPropertyByLevelAndValue(newState.level1, newState.level2, newState.filterModel.property.value).type][0]);
        }
      }
      // else {
      //     if (!state.level1 && this.state.level1List.length > 0) {
      //         newState.level1 = this.state.level1List[0].value;
      //     }

      //     if (newState.level1 && !state.level2) {
      //         const level2BaseLevel1 = this.state.level2List.filter(l => l.father === newState.level1)
      //         if (level2BaseLevel1.length > 0) {
      //             newState.level2 = level2BaseLevel1[0].value;
      //         }
      //     }

      //     if (newState.level1 && !state.filterModel.property && this.state.propertyList.length >0) {
      //         const propertyListBaseLevel12 = this.state.propertyList.filter(p => p.level1 === newState.level1 && p.level2 === newState.level2);
      //         // 如果level2找到了
      //         if (propertyListBaseLevel12.length >0) {
      //             newState.filterModel.changeProperty(propertyListBaseLevel12[0]);
      //         }
      //     }

      //     if (newState.filterModel.property) {
      //         newState.filterModel.changeOperator(TYPE_OPERATOR_MAP[this.propertyMap[newState.filterModel.property.value].type][0]);
      //     }
      // }

      return newState;
    }

    getPropertyByLevelAndValue(level1, level2, propertyValue) {
      const findList = this.state.propertyList.filter((p) => p.level1 === level1 && p.level2 === level2 && p.value === propertyValue);
      if (findList.length > 0) return findList[0];
    }

    // 初始化状态
    __initState() {
      log.debug('__initState', this.state);
      // this.propertyMap = this.state.propertyList.reduce(function(map, obj) {
      //     map[obj.value] = obj;
      //     return map;
      // }, {});
      // log.debug("this.propertyMap", this.propertyMap);
    }

    filterOption = (inputValue, option) => {
      // log.debug(option);
      if (option.props.children.indexOf(inputValue) >= 0) return true;
    };

    onSelectLevel1 = (value) => {
      this.state.filterModel.clearProperty();
      // const state = this.createComponentState({
      //     level1: value,
      //     level2: "",
      //     filterModel: this.state.filterModel
      // });
      this.setState({
        ...this.state,
        level1: value,
        level2: '',
        value: null
      });
      this.onChange();
    }

    onSelectLevel2 = (value) => {
      this.state.filterModel.clearProperty();
      // const state = this.createComponentState({
      //     level2: value,
      //     filterModel: this.state.filterModel
      // });
      this.setState({
        ...this.state,
        level2: value,
        value: null
      });
      this.onChange();
    };

    onSelectProperty = (value) => {
      const { level1, level2 } = this.state;
      const property = this.getPropertyByLevelAndValue(level1, level2, value);
      this.state.filterModel.changeProperty(property);
      this.setState({
        ...this.state,
        level1: property.level1,
        level2: property.level2,
        value: null
      });
      this.onChange();
    };

    onSelectOperator = (value) => {
      // console.log(this.state.filterModel, value);
      this.state.filterModel.changeOperator(value);
      this.setState({
        ...this.state,
        value: null
      });
      this.onChange();
    }

    onChange() {
      this.props.onChange && this.props.onChange(this.state.filterModel);
    }

    onFilterValueChange = (filter) => {
      this.setState({
        ...this.state
      });
      this.onChange();
    }

    // onConnectorChnage = value => {
    //     this.setState({
    //         ...this.state,
    //         connector: value
    //     });

    //     this.props.onConnectorChnage && this.props.onConnectorChnage(value?1:0);
    // }

    render() {
      log.debug('reader', this.state);
      // 一级分类
      const level1Col = (span) => {
        if (!this.state.level1List || this.state.level1List.length <= 0) {
          return;
        }
        const selectProps = {
          placeholder: '选择分类',
          showSearch: true,
          filterOption: this.filterOption,
          style: { width: '100%' },
          onChange: this.onSelectLevel1
          // allowClear: true
        };

        if (this.state.level1) {
          selectProps.value = this.state.level1;
        } else if (this.state.level1List.length > 0) {
          selectProps.defaultalue = this.state.level1List[0].value;
        }
        // <Switch checkedChildren={FILTER_CONNECTOR[0].name} unCheckedChildren={FILTER_CONNECTOR[1].name} checked={this.state.connector === 1} onChange={this.onConnectorChnage} style={{marginTop: 5, marginBottom: 5}} />
        return <Col span={span}>
          <Select {...selectProps} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
            {this.state.level1List.map((level) => <Option
              key={level.value}
              value={level.value}
            >
              {level.name}
            </Option>)}
          </Select>
        </Col>;
      };

      // 二级分类
      const level2Col = (span) => {
        const selectProps = {
          placeholder: '选择分类',
          showSearch: true,
          filterOption: this.filterOption,
          style: { width: '100%' },
          onChange: this.onSelectLevel2
          // allowClear: true
        };

        const level2Iterms = this.state.level2List.filter(
          (level) => level.father === this.state.level1
        );
        if (this.state.level2) selectProps.value = this.state.level2;

        if (level2Iterms && level2Iterms.length > 0) {
          return (
            <Col span={span}>
              <Select {...selectProps} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                {level2Iterms.map((level) => <Option key={level.value} value={level.value}>
                  {level.name}
                </Option>)}
              </Select>
            </Col>
          );
        }
      };

      // 属性
      const propertyCol = (span) => {
        const { filterModel } = this.state;
        const propertyItems = this.state.propertyList.filter(
          (property) => property.level1 === this.state.level1 && property.level2 === this.state.level2
        );

        const selectProps = {
          placeholder: '选择属性',
          showSearch: true,
          filterOption: this.filterOption,
          style: { width: '100%' },
          onChange: this.onSelectProperty
          // allowClear: true
        };

        if (filterModel.property) {
          selectProps.value = filterModel.property.value;
        } else {
          selectProps.value = null;
        }

        // if (this.state.property) {
        //   selectProps.value = this.state.property;
        // }

        if (propertyItems && propertyItems.length > 0) {
          return (
            <Col span={span}>
              <Select {...selectProps} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                {propertyItems.map((level) => <Option key={level.value} value={level.value}>
                  {level.name}
                </Option>)}
              </Select>
            </Col>
          );
        }
      };

      // 操作符
      const operatorCol = (span) => {
        const { filterModel, level1, level2 } = this.state;
        if (!filterModel.property) return;
        const selProperty = this.getPropertyByLevelAndValue(level1, level2, filterModel.property.value);
        if (!selProperty) {
          return (
            <Col span={3}>
              <Alert
                message="操作符不存在"
                type="error"
                banner
              />
            </Col>
          );
        }

        const operatorItems = TYPE_OPERATOR_MAP[selProperty.type];
        log.debug('operatorItems', operatorItems);

        const selectPorps = {
          placeholder: '选择操作符',
          showSearch: true,
          filterOption: this.filterOption,
          style: { width: '100%' },
          onChange: this.onSelectOperator
          // allowClear: true
        };

        selectPorps.value = filterModel.operator;

        if (operatorItems && operatorItems.length > 0) {
          return (
            <Col span={span}>
              <Select {...selectPorps} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                {operatorItems
                  .map((o) => OPERATOR_MAP[o])
                  .map((operator) => <Option
                    key={operator.operator}
                    value={operator.operator}
                  >
                    {operator.name}
                  </Option>)}
              </Select>
            </Col>
          );
        }
      };

      // 输入值
      const filterValueCol = (span) => {
        const { filterModel } = this.state;
        if (filterModel.property && filterModel.operator) {
          return (
            <Col span={span}>
              <FilterValue filterModel={filterModel} onChange={this.onFilterValueChange} />
            </Col>
          );
        }
      };

      const errorComp = () => {
        let errorMessage = '';
        // if (!this.state.level1) {
        //     errorMessage = "请选择分类";
        // }
        // else if (!this.state.level2) {
        //     errorMessage = "请选择分类";
        // }
        if (!this.state.filterModel.property) {
          errorMessage = '请选择属性';
        } else if (!this.state.filterModel.operator) {
          errorMessage = '请选择操作符';
        } else if (this.state.filterModel.isDirty || this.state.filterModel.isSubmitted) {
          errorMessage = this.state.filterModel.getValueErrorMessage();
        }

        log.debug('errorComp', errorMessage);
        if (errorMessage) return <Text type="danger">{errorMessage}</Text>;
      };

      return (
        <Row gutter={16} type="flex" align="top">
          {level1Col(3)}
          {level2Col(3)}
          {propertyCol(6)}
          {operatorCol(3)}
          {filterValueCol(6)}
          <Col span={4} style={{ paddingTop: 4 }}>
            {this.props.children}
            {errorComp()}
          </Col>
        </Row>
      );
    }
}

export default Filter;
