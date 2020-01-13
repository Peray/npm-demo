import React, { Component } from 'react'
import Filter from "./components/Filter";
import Datatist from '../../src/index';//本地文件
// import Datatist from 'datatist-react';//测试包
// import 'datatist-react/lib/main.min.css'

const { DtQuery } = Datatist;

const table = [{
  name: '分群名称',
  propertyName: 'name',
  nodeType: 'input',
  operator: 'LIKE'
}, {
  name: '分群类型',
  propertyName: 'type',
  nodeType: 'select',
  options: [],
  operator: 'EQ'
}, {
  name: '状态',
  propertyName: 'status',
  nodeType: 'select',
  options: [],
  operator: 'EQ'
}, {
  name: '更新规则',
  propertyName: 'calcRule',
  nodeType: 'select',
  options: [],
  operator: 'EQ'
}, {
  name: '创建时间',
  propertyName: 'createTime',
  nodeType: 'dateRange',
  operator: 'DATE_BETWEEN'
}, {
  name: '创建账号',
  propertyName: 'user',
  nodeType: 'select',
  options: [],
  operator: 'EQ',
  disabledNode: 'userId'
}, {
  name: '最近计算时间',
  propertyName: 'lastCalcTime',
  nodeType: 'dateRange',
  operator: 'DATE_BETWEEN'
}, {
  name: '仅查看我创建的',
  propertyName: 'userId',
  nodeType: 'checkbox',
  operator: 'EQ',
  disabledNode: 'user'
}];

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.queryData = this.queryData.bind(this);
  }

  queryData(value) {
    console.log(value)
  }
  render() {
    const grid = {
      leftCol: 24,
      rightCol: 24,
      childCol: 12
    }
    return (
      <div>
        <Filter />
        <DtQuery isFold={true} config={table} grid={grid} queryData={this.queryData} />
      </div>
    )
  }
}
