import React, { Component } from 'react';
import { Tag } from 'antd';
import Log from './utils/log';
import FilterList from './filterList';

import filterConfig from './filterConfig';

import LevelMenu from './levelMenu';
import FilterModel from './filterModel';
import FilterListGroupModel from './filterListGroupModel';
import FilterConnector from './filterConnector';
// import { bold } from "ansi-colors";
import './filterListGroup.scss';

// 操作符map
const OPERATOR_MAP = filterConfig.operatorList.reduce((map, obj) => {
  map[obj.operator] = obj;
  return map;
}, {});

// 操作符map
const CONNECTOR_MAP = filterConfig.connector.reduce((map, obj) => {
  map[obj.value] = obj;
  return map;
}, {});

const log = Log.getLogger('FilterListGroup');


class FilterListGroup extends Component {
  state = {
    level1List: [],
    level2List: [],
    propertyList: [],
    mode: 'all', // edit all
    // 过滤标签是否可以删除
    detailClosable: true,
    filterListGroupModel: new FilterListGroupModel()
  };

  constructor(props) {
    super(props);
    this.state = { ...this.state, ...this.props };
    log.debug('constructort', props);
  }


  static getDerivedStateFromProps(props, state) {
    log.debug('getDerivedStateFromProps', props);
    return {
      ...state,
      ...props
    };
  }

  handleChange() {
    this.setState({
      ...this.state
    });
    this.props.onChange && this.props.onChange(this.state.filterListGroupModel);
  }

  /**
   * 处理变化
   */
  onChange(id) {
    return (filterListModel) => {
      this.state.filterListGroupModel.changeFilterListModel(filterListModel);
      this.handleChange();
    };
  }

  onDelete(id) {
    return () => {
      this.state.filterListGroupModel.deleteFilterList(id);
      this.setState({
        ...this.state
      });
      this.handleChange();
    };
  }

  onConnectorChange = (value) => {
    this.state.filterListGroupModel.setFilterConnector(value);
    this.setState({
      ...this.state
    });
    this.handleChange();
  };

  getFilterListComponent(filterListModel, nextFilterListModel) {
    log.debug('getFilterListComponent', filterListModel);
    const nextFilterConnector = () => {
      if (nextFilterListModel) {
        return <FilterConnector connector={nextFilterListModel.connector} onChange={this.onConnectorChange} />;
      }
    };

    const { level1List, level2List, propertyList } = this.state;
    return (
      <React.Fragment key={filterListModel.id}>
        <div style={{ padding: '10px 0 10px 20px', margin: '5px', border: '1px dashed #ccc', borderRadius: '10px' }}>
          <FilterList
            filterListModel={filterListModel}
            level1List={level1List}
            level2List={level2List}
            propertyList={propertyList}
            onChange={this.onChange(filterListModel.id)}
            onDeleteAllSub={this.onDeleteAllSub(filterListModel.id)}
            canAdd={this.state.filterListGroupModel.canAdd()}
            onSelectProperty={this.onSelectProperty}
          />
        </div>
        <div style={{ minHeight: 20 }}>
          {nextFilterConnector()}
        </div>
      </React.Fragment>
    );
  }

  onDeleteAllSub(id) {
    return () => {
      const { filterListGroupModel } = this.state;
      filterListGroupModel.deleteFilterList(id);
      this.setState({
        ...this.state
      });
      this.handleChange(filterListGroupModel);
    };
  }

  onSelectProperty = (property) => {
    const filter = this.fromPropertyToFilter(property);
    this.state.filterListGroupModel.addFilterListWithFilter(filter, this.state.filterListGroupModel.getFilterConnector());
    this.setState({
      ...this.state
    });
    this.handleChange();
  }

  fromPropertyToFilter(property) {
    log.debug('fromPropertyToFilter', property);
    const filter = new FilterModel(property, null, null, null);

    if (!filter) {
      log.error('没有找到对应的property', property, this.state.propertyList);
      return;
    }
    return filter;
  }

  onDetailClose = (fatherId, filterId) => () => {
    this.state.filterListGroupModel.deleteFilter(fatherId, filterId);
    this.setState({ ...this.state });
    this.handleChange();
  };

  onAddFilterGroup = () => {
    this.state.filterListGroupModel.addFilterListWithFilter(null, this.state.filterListGroupModel.getFilterConnector());
    this.setState({ ...this.state });
    this.handleChange();
  }

  // 获详情起组件
  getFilterListComponentDetail(filterListModel, nextFilterListModel) {
    if (!filterListModel || !filterListModel.isValid()) return;

    const getTag = (f) => {
      log.debug('getTag', f);
      if (!f || !f.property || !f.operator || !f.isValid()) return;
      const { name } = f.property;
      const operator = OPERATOR_MAP[f.operator] ? OPERATOR_MAP[f.operator].name : '';
      const value = f.getShowValue();
      const tagText = `${name} ${operator} ${value}`;
      return <Tag className="filterTag" color="magenta" closable={this.state.detailClosable} onClose={this.onDetailClose(filterListModel.id, f.id)}>
        {tagText}
      </Tag>;
    };

    const getConnector = (nextFilter) => {
      if (nextFilter && CONNECTOR_MAP[nextFilter.connector]) {
        return <Tag>{CONNECTOR_MAP[nextFilter.connector].name}</Tag>;
      }
    };

    return (
      <div key={filterListModel.id} className="clearfix" style={{ float: 'left' }}>
        <div className={`${filterListModel.filterList.length >= 2 && 'moreThanOne'} filterTagBox`} style={{ backgroundColor: '#eee', borderRadius: '15px', padding: '5px 0 5px 5px', float: 'left', color: '#999', marginBottom: '5px' }}>
          {filterListModel.filterList.length >= 2 && '[' }
          {
            filterListModel.filterList.map((f, i) => {
              return (
                <React.Fragment key={f.id}>
                  {getTag(f)}
                  {getConnector(filterListModel.filterList[i + 1])}
                </React.Fragment>
              );
            })
          }
          {filterListModel.filterList.length >= 2 && <span className="bracketRigth">]</span>}
        </div>
        <div style={{ float: 'left', padding: '5px', marginLeft: '8px' }}>
          {getConnector(nextFilterListModel)}
        </div>
      </div>
    );
  }

  render() {
    log.debug('render', this.state);
    const { mode } = this.state;

    const getTagComp = () => {
      if (mode === 'detail' || mode === 'all') {
        return <div className="clearfix">
          {this.state.filterListGroupModel.filterListGroup.map((f, i) => this.getFilterListComponentDetail(f, this.state.filterListGroupModel.filterListGroup[i + 1]))}
        </div>;
      }
    };

    const getEditComp = () => {
      if (mode === 'edit' || mode === 'all') {
        return <div>
          <div className="mostAdd" style={{ marginBottom: 20, fontWeight: 700 }}>
            标签规则 (最多添加
            {this.state.filterListGroupModel.getFilterCount()}
            /
            {this.state.filterListGroupModel.getMaxSize()}
            条)
          </div>
          {this.state.filterListGroupModel.filterListGroup.map((f, i) => this.getFilterListComponent(f, this.state.filterListGroupModel.filterListGroup[i + 1]))}
          <LevelMenu
            level1List={this.state.level1List}
            level2List={this.state.level2List}
            propertyList={this.state.propertyList}
            onAddFilter={this.onAddFilterGroup}
            canAdd={this.state.filterListGroupModel.canAdd()}
            onSelectProperty={this.onSelectProperty}
          />
        </div>;
      }
    };
    return (
      <div>
        {getTagComp()}
        {getEditComp()}
      </div>
    );
  }
}

export default FilterListGroup;
