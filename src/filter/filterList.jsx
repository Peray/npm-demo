import React, { Component } from 'react';
import { Button, Row, Col, Icon } from 'antd';
import Log from './utils/log';
import Filter from './filter';
import LevelMenu from './levelMenu';
import FilterModel from './filterModel';
import FilterListModel from './filterListModel';
import FilterConnector from './filterConnector';

const log = Log.getLogger('FilterList');

class FilterList extends Component {
  state = {
    level1List: [],
    level2List: [],
    propertyList: [],
    canAdd: true,
    filterListModel: new FilterListModel()
  }

  constructor(props) {
    super(props);
    this.state = { ...this.state, ...this.props };
  }

  static getDerivedStateFromProps(props, state) {
    log.debug('getDerivedStateFromProps', props);
    return {
      ...state,
      ...props
    };
  }

  onChange(id) {
    return (filter) => {
      log.debug('onChange', id, filter);
      this.state.filterListModel.changeFilter(filter);
      this.setState({ ...this.state });
      this.props.onChange && this.props.onChange(this.state.filterListModel);
    };
  }

  onDelete(id) {
    return () => {
      const { filterListModel } = this.state;
      filterListModel.deleteFilter(id);
      this.setState({
        ...this.state
      });
      // 全删干净，把整个组件移除
      if (filterListModel.isEmpty()) this.props.onDeleteAllSub && this.props.onDeleteAllSub();
      this.props.onChange && this.props.onChange(this.state.filterListModel);
    };
  }

  onConnectorChange = (value) => {
    this.state.filterListModel.setFilterConnector(value);
    this.setState({
      ...this.state
    });
    this.props.onChange && this.props.onChange(this.state.filterListModel);
  };

  getFilterComponent(filter, nextFilter) {
    log.debug('getFilterComponent', filter, nextFilter);
    const nextFilterConnector = () => {
      if (nextFilter) {
        return <FilterConnector connector={nextFilter.connector} onChange={this.onConnectorChange} />;
      }
    };

    // const errorComp = () => {
    //   const errorMessage = filter.getErrorMessage();
    //   // if (errorMessage && filter.isDirty)
    //   log.debug('errorComp', errorMessage);
    //   if (errorMessage) { return <Badge status="error" text={errorMessage} />; }
    // };
    //   <Col span={4} offset={filter.property && filter.property.level2 ? 10 : 6}>
    //     {errorComp()}
    //   </Col>;

    return (
      <React.Fragment key={filter.id}>
        <Filter level1List={this.state.level1List} level2List={this.state.level2List} propertyList={this.state.propertyList} filterModel={filter} onChange={this.onChange(filter.id)}>
          <Button onClick={this.onDelete(filter.id)} style={{ marginRight: 10, border: 'none', marginTop: '-4px' }}><Icon type="close-circle" theme="filled" /></Button>
        </Filter>
        <Row gutter={16} type="flex" align="top" style={{ minHeight: 20 }}>
          <Col span={4}>
            {nextFilterConnector()}
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  onAddFilter = () => {
    this.state.filterListModel.addFilterModel(new FilterModel());
    this.setState({ ...this.state });
  };

  onSelectProperty = (property) => {
    if (!this.state.filterListModel.canAdd()) return;
    const filterModel = new FilterModel(property, null, null, this.state.filterListModel.getFilterConnector());
    this.state.filterListModel.addFilterModel(filterModel);
    this.setState({
      ...this.state
    });

    this.props.onChange && this.props.onChange(this.state.filterListModel);
  }

  render() {
    return (
      <>
        {this.state.filterListModel.filterList.map((f, i) => this.getFilterComponent(f, this.state.filterListModel.filterList[i + 1]))}
        <LevelMenu
          level1List={this.state.level1List}
          level2List={this.state.level2List}
          propertyList={this.state.propertyList}
          onAddFilter={this.onAddFilter}
          canAdd={this.state.canAdd}
          onSelectProperty={this.onSelectProperty}
        />

      </>
    );
  }
}

export default FilterList;
