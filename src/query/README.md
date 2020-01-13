**参数**

    isFold: boolean,//是否打开（入参）
    config: Array//配置项（入参）
    queryData: Function //查询（出参）
    grid: Object//栅格配置{leftCol:Number, rightCol:Number, childCol: Number}


**config数组格式如下**

    // 数据表
    export const queryConfig = [{
      name: '分群名称',
      propertyName: 'name',
      nodeType: 'input',
      operator: 'LIKE'
    }, {
      name: '分群类型',
      propertyName: 'type',
      nodeType: 'select',
      options: typeList,
      operator: 'EQ'
    }, {
      name: '状态',
      propertyName: 'status',
      nodeType: 'select',
      options: statusList,
      operator: 'EQ'
    }, {
      name: '更新规则',
      propertyName: 'calcRule',
      nodeType: 'select',
      options: ruleList,
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
      options: ruleList,
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

	参数说明
	name： 属性显示名
	propertyName： 属性名
	nodeType：节点名
	operator：操作符
	options：nodeType为select时存在，array类型,[{name:'',value:''}]
    disabledNode: 当该节点有值或为true时禁用的节点

	*operator*
    /**
     * EQ(“等于”)
     * NE(“不等于”)
     * LIKE(“匹配”)
     * NOT_LIKE(“不匹配”)
     * START_WITH(“开头匹配”)
     * NOT_START_WITH(“开头不匹配”)
     * END_WITH(“结尾匹配”)
     * NOT_END_WITH(“结尾不匹配”)
     * IS_NOT_NULL(“非空”)
     * IS_NULL(“为空”)
     * DATE_BETWEEN(“时间范围”)
     * DATE_BETWEEN的用法比较特殊，功能是时间范围，需要传入两个时间戳，如"1573975851353,1574839851353", 表示一个时间范围，如果传入的是",1574839851353", 表示只考虑结束时间；"1573975851353,"表示只考虑开始时间
     */

**使用**

	npm install datatist-react
    import { DtQuery } from 'datatist-react';
    <DtQuery isFold={isFold} config={table} queryData={this.queryData} />