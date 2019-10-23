## 安装 ##
    npm install datatist-react
## 使用 ##
    import Filter from 'datatist-react';//测试包
	//import 'datatist-react/lib/main.min.css';//测试包

	const { FilterListGroup, FilterListGroupModel } = Filter;

	<FilterListGroup
	    mode={mode}//'edit', 'all', 'detail'
	    detailClosable={detailClosable} //boolean
	    level1List={level1List} //Arrary
	    level2List={level2List} //Arrary
	    propertyList={propertyList} //Arrary
	    filterListGroupModel={filterListGroupModel}
	    onChange={this.onChange}/>

## 属性 ##
    mode:  <string>  'edit'|'detail'|'all'    编辑|详情|所有
	detailClosable  <boolean>  mode为detail时标签是有删除icon
	level1List  <arrary可选>  [{name: "", value: ""}]  一级菜单
	level2List  <arrary必选>  [{ather: "", name: "", value: ""}]  二级菜单

	propertyList  <arrary必选> 属性列表
	[
		{
			createTime: 1566755764000
			id: 140
			isEnum: true
			level1: ""
			level2: ""
			name: "事件时间"
			tableId: 2,
			items: [{name:'' ,value:''}]//isEnum为true时存在
			tableSchemaId: 137
			type: "DATETIME"
			updateTime: 1566755764000
			value: "event_time"	
		}
	]
	
	onChange <function> 过滤组件操作方法