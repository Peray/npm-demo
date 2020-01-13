import React, { Component } from 'react';
import Datatist from '../../../src/index';//本地文件
// import Datatist from 'datatist-react';//测试包

const { DtFilter } = Datatist;
const { FilterListGroup, FilterListGroupModel } = DtFilter;

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      detailClosable: false, // 过滤标签是否可以删除
      mode: 'edit', // edit all detail,
      isInited: true, // 是否已经初始化完成
      level1List: [],
      level2List: [],
      propertyList: [],
      ...props
    };
  }

  render() {
    const { isInited, value, mode, detailClosable, level1List, level2List, propertyList } = this.state;
    let filterListGroupModel = new FilterListGroupModel();
    if (isInited) {
      filterListGroupModel = FilterListGroupModel.fromJson(value, propertyList);
      return (
        <div>
          <FilterListGroup
            mode={mode}
            detailClosable={detailClosable}
            level1List={level1List}
            level2List={level2List}
            propertyList={propertyList}
            filterListGroupModel={filterListGroupModel}
            onChange={this.onChange}
          />
        </div>
      )
    }
    return null;
  }
}
export default Filter;