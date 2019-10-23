import React, { Component } from 'react';
import { Switch } from 'antd';
import Log from './utils/log';
import filterConfig from './filterConfig';
// const { Search } = Input;
// const { SubMenu } = Menu;

const log = Log.getLogger('FilterConnector');

// 连接器
const FILTER_CONNECTOR = filterConfig.connector;

const FILTER_CONNECTOR_SWITCH_MAP = {
  true: FILTER_CONNECTOR[0],
  false: FILTER_CONNECTOR[1]
};

const FILTER_CONNECTOR_SWITCH_MAP_REVERSE = {};
FILTER_CONNECTOR_SWITCH_MAP_REVERSE[FILTER_CONNECTOR[0].value] = true;
FILTER_CONNECTOR_SWITCH_MAP_REVERSE[FILTER_CONNECTOR[1].value] = false;

class FilterConnector extends Component {
    state = {
      connector: FILTER_CONNECTOR_SWITCH_MAP.true.value
    };

    constructor(props) {
      super();
      log.debug('constructor', props);
      if (props) this.state = { ...this.state, ...props };
    }

    static getDerivedStateFromProps(props, state) {
      return {
        ...state,
        ...props
      };
    }

    onChange = (tureOrFlase) => {
      this.setState({
        connector: FILTER_CONNECTOR_SWITCH_MAP[tureOrFlase].value
      });
      this.props.onChange && this.props.onChange(FILTER_CONNECTOR_SWITCH_MAP[tureOrFlase].value);
    }


    render() {
      return (
        <Switch checkedChildren={FILTER_CONNECTOR_SWITCH_MAP.true.name} unCheckedChildren={FILTER_CONNECTOR_SWITCH_MAP.false.name} checked={FILTER_CONNECTOR_SWITCH_MAP_REVERSE[this.state.connector]} onChange={this.onChange} style={{ marginTop: 5, marginBottom: 5 }} />
      );
    }
}

export default FilterConnector;
