import React, { Component } from 'react';
import Log from './utils/log';
import TypeValidateInput from './input/typeValidateInput';
import TypeBetweenValidateInput from './input/typeBetweenValidateInput';
import TypeTagValidateInput from './input/typeTagValidateInput';
import FilterModel from './filterModel';

// import './filter.scss';

const log = Log.getLogger('FilterValue');
// Log.logConfig['FilterValue'] = {level: 'info'};

class FilterValue extends Component {
    state = {
      filterModel: new FilterModel()
    };

    constructor(props) {
      super();
      log.debug('constructor', props);
      if (props) this.state = { ...props };
      // this.__initState();
    }

    static getDerivedStateFromProps(props, state) {
      return {
        ...state,
        ...props
      };
    }

    /**
     * 主方法
     * 返回渲染组件
     */
    filterValue = () => {
      switch (this.state.filterModel.operator) {
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
          return <TypeValidateInput {...this.state} type="updata" />;
        case 'BETWEEN':
          return <TypeBetweenValidateInput {...this.state} />;
        case 'IN':
        case 'NOT_IN':
          return <TypeTagValidateInput {...this.state} />;
        case 'IS_NOT_NULL':
        case 'IS_NULL':
          return <span />;

        default:
          return <div>操作符不能识别</div>;
      }
    };


    render() {
      log.debug('render', this.state);
      return (
        <div className={(this.state.filterModel.isDirty || this.state.filterModel.isSubmitted) && this.state.filterModel.getValueErrorMessage() ? 'has-error' : ''}>
          {this.filterValue()}
        </div>
      );
    }
}

export default FilterValue;
