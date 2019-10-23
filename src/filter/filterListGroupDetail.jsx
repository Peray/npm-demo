// import React, { Component } from "react";
// import FilterList from './filterList';
// // import Filter from './filter';
// import Log from 'utils/log';
// import LevelMenu from './levelMenu';
// import FilterModel from './filterModel';
// // import FilterListModel from './filterListModel';
// import FilterListGroupModel from './filterListGroupModel';
// import FilterConnector from './filterConnector';

// const log = Log.getLogger("FilterListGroupDetail");


// class FilterListGroupDetail extends Component {
// 	state = {
// 		filterListGroupModel: new FilterListGroupModel()
// 	};

// 	constructor(props) {
// 		super(props);
// 		this.state = {...this.state, ...this.props};
// 	// }

// 	handleChange() {
// 		this.props.onChange && this.props.onChange(this.state.filterListGroupModel);
// 	}

// 	/**
// 	 * 处理变化
// 	 */
// 	onChange(id) {
// 		return (filterListModel) => {
// 			this.state.filterListGroupModel.changeFilterListModel(filterListModel);
// 			this.handleChange();
// 		};
// 	}

// 	onDelete (id) {
// 		return () => {
// 			this.state.filterListGroupModel.deleteFilterList(id);
// 			this.setState({
// 				...this.state
// 			})
// 		};
// 	}

// 	onConnectorChange  = (value) => {
// 		this.state.filterListGroupModel.setFilterConnector(value);
// 		this.setState({
// 			...this.state
// 		});
// 	};

// 	getFilterListComponent(filterListModel, nextFilterListModel) {
// 		log.debug("getFilterListComponent", filterListModel);
// 		const nextFilterConnector = () => {
// 			if (nextFilterListModel) {
// 				return <FilterConnector connector={nextFilterListModel.connector} onChange={this.onConnectorChange} />;
// 			}
// 		};

// 		const {level1List, level2List, propertyList} = this.state;
// 		return (
// 			<React.Fragment key={filterListModel.id}>
// 				<div style={{padding: "10px 0 10px 20px", margin: "5px", border: "1px dashed #ccc", "borderRadius": "10px"}}>
// 					<FilterList filterListModel={filterListModel} level1List={level1List} level2List={level2List} propertyList={propertyList} onChange={this.onChange(filterListModel.id)} onDeleteAllSub={this.onDeleteAllSub(filterListModel.id)} onSelectProperty={this.onSelectProperty}>
// 					</FilterList>
// 				</div>
// 				<div style={{minHeight: 20}}>
// 						{nextFilterConnector()}
// 				</div>
// 			</React.Fragment>
// 		);
// 	}

// 	onDeleteAllSub(id) {
// 		return () => {
// 			const {filterListGroupModel} = this.state;
// 			filterListGroupModel.deleteFilterList(id);
// 			this.setState({
// 				...this.state,
// 			});
// 			this.handleChange(filterListGroupModel);
// 		};
// 	}

// 	onSelectProperty = (property) => {
// 		const filter = this.fromPropertyToFilter(property);
// 		this.state.filterListGroupModel.addFilterListWithFilter(filter, this.state.filterListGroupModel.getFilterConnector());
// 		this.setState({
// 			...this.state
// 		});
// 	}

// 	fromPropertyToFilter(property) {
// 		const filter = new FilterModel(property, null, null, null);
// 		console.log(this.state.filterListGroupModel.getFilterConnector());

// 		if (!filter) {
// 			log.error("没有找到对应的property", property, this.state.propertyList);
// 			return;
// 		}
// 		return filter;
// 	}

// 	render() {
// 		return (
// 			<React.Fragment>
// 				{this.state.filterListGroupModel.filterListGroup.map((f, i) => this.getFilterListComponent(f, this.state.filterListGroupModel.filterListGroup[i+1]))}
// 				<LevelMenu level1List={this.state.level1List} level2List={this.state.level2List} propertyList={this.state.propertyList} canAdd={this.state.filterListGroupModel.canAdd()} onSelectProperty={this.onSelectProperty}>
// 				</LevelMenu>
// 			</React.Fragment>
// 		);
// 	};
// }

// export default FilterListGroupDetail;
