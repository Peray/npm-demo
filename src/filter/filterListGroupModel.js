import Log from './utils/log';
import FilterListModel from './filterListModel';
import filterConfig from './filterConfig';
import FilterModel from './filterModel';

const log = Log.getLogger('FilterListGroupModel');
const MAX_SIZE = 10;

class FilterListGroupModel {
  constructor() {
    this.filterListGroup = [];
  }

  addFilterList(filterList) {
    if (!this.canAdd()) { return; }
    this.filterListGroup.push(filterList);
  }

  addFilterListWithFilter(filterModel, connector) {
    log.debug('addFilterListWithFilter', filterModel);
    const filterListModel = new FilterListModel(null, connector);
    if (!filterModel) {
      filterModel = new FilterModel();
    }
    filterListModel.addFilterModel(filterModel);
    this.addFilterList(filterListModel);
  }

  deleteFilterList(id) {
    this.filterListGroup = this.filterListGroup.filter((f) => f.id !== id);
  }

  deleteFilter(fatherId, filterId) {
    this.filterListGroup
      .filter((f) => f.id === fatherId)
      .forEach((f) => {
        f.deleteFilter(filterId);
      });
    this.filterListGroup = this.filterListGroup.filter((f) => f.filterList.length > 0);
  }

  changeFilterListModel(filterListModel) {
    this.filterListGroup.filter((f) => f.id === filterListModel.id).map((f) => filterListModel);
  }

  /**
     * 获得过滤器组的连接器
     */
  getFilterConnector() {
    const { filterListGroup } = this;
    if (filterListGroup.length > 0) {
      return filterListGroup[0].connector;
    }
    return filterConfig.connector[0].value;
  }

  setFilterConnector(connector) {
    this.filterListGroup.forEach((f) => f.connector = connector);
  }

  canAdd() {
    return this.getFilterCount() < MAX_SIZE;
  }

  getFilterCount() {
    return this.filterListGroup.map((f) => f.filterList.length).reduce((a, b) => a + b, 0);
  }

  isValid() {
    return this.filterListGroup
      .map((f) => f.isValid())
      .reduce((a, b) => a && b, true);
  }

  submit() {
    this.filterListGroup.forEach((f) => f.filterList.forEach((ff) => ff.isSubmitted = true));
    if (!this.isValid()) { return false; }
    return this.toJson();
  }

  toJson() {
    return this.filterListGroup
      .map((f) => {
        return {
          connector: f.connector,
          filters: f.filterList.map((ff) => {
            return ff.toJson();
          })
        };
      });
  }

  static fromJson(json, propertyList) {
    log.debug('fromJson', json);
    const ret = new FilterListGroupModel();
    if (!Array.isArray(json)) { return ret; }
    ret.filterListGroup = json.map((f) => {
      return new FilterListModel(
        f.filters.map((ff) => {
          return FilterModel.fromJson(ff, propertyList);
        }),
        f.connector
      );
    });
    log.debug('fromJson', json, ret);
    return ret;
  }

  getMaxSize() {
    return MAX_SIZE;
  }
}

export default FilterListGroupModel;
