import filterConfig from './filterConfig';

const MAX_SIZE = 10;

class FilterListModel {
    static counter = 0;

    constructor(filterList, connector) {
      this.id = FilterListModel.counter++;
      this.filterList = Array.isArray(filterList) ? filterList : [];
      this.connector = connector || filterConfig.connector[0].value;
    }

    addFilterModel(filterModel) {
      const {
        filterList
      } = this;
      filterList.push(filterModel);
    }

    /**
     * 获得过滤器组的连接器
     * @return {[type]} [description]
     */
    getFilterConnector() {
      const {
        filterList
      } = this;
      if (filterList.length > 0) { return filterList[0].connector; }
      return filterConfig.connector[0].value;
    }

    setFilterConnector(connector) {
      this.filterList.forEach((f) => f.connector = connector);
    }

    deleteFilter(id) {
      this.filterList = this.filterList.filter((f) => f.id !== id);
    }

    changeFilter(filter) {
      this.filterList.filter((f) => f.id === filter.id).map((f) => filter);
    }

    isEmpty() {
      return this.filterList.length === 0;
    }

    canAdd() {
      return this.filterList.length < MAX_SIZE;
    }

    isValid() {
      return this.filterList.map((f) => f.isValid()).reduce((a, b) => a && b, true);
    }
}

export default FilterListModel;
