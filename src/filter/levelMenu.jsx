/* eslint-disable react/jsx-indent */
import React, { PureComponent } from 'react';
import { Menu, Dropdown, Icon, Input } from 'antd';
import Log from './utils/log';
import _ from 'lodash';
import './filter.scss';

// const { Search } = Input;
// const { SubMenu } = Menu;

const log = Log.getLogger('LevelMenu');
class LevelMenu extends PureComponent {
    state = {
      level1List: [],
      level2List: [],
      propertyList: [],
      search: null
    };

    constructor(props) {
      super();
      log.debug('constructor', props);
      if (props) this.state = { ...this.state, ...props };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      return {
        ...prevState,
        ...nextProps
      };
    }

    propertyMenu = (level1, level2) => {
      const { search } = this.state;
      return this.state.propertyList
        .filter((p) => p.level1 === level1 && p.level2 === level2)
        .filter((p) => !search || (search && (p.name.indexOf(search) >= 0 || p.value.indexOf(search) >= 0)))
        .map((p, i) => {
          return <Menu.Item key={p.value} onClick={this.onSelectProperty(p)}>
            {p.name}
            [
            {p.value}
            ]
          </Menu.Item>;
        });
    }

    level2Menu = (father) => {
      const menuList = this.state.level2List.filter((f) => f.father === father.value);
      return menuList.map((l, i) => {
        return (
          <Menu.ItemGroup title={l.name} key={i} style={{ listStyleType: 'none' }}>
            {this.propertyMenu(father.value, l.value)}
          </Menu.ItemGroup>
        );
      });
    };

    onSearch = (e) => {
      e.persist();
      _.debounce(() => {
        const { value } = e.target;
        this.setState({
          ...this.state,
          search: value
        });
      }, 200)();
    };

    onSelectProperty = (property) => {
      return (value) => {
        this.props.onSelectProperty && this.props.onSelectProperty(property);
      };
    };

    onAddFilter = () => {
      this.props.onAddFilter && this.props.onAddFilter();
    };

    menu = () => {
      return (
        <Menu style={{ height: 400, overflowY: 'scroll', width: 600, overflowX: 'hidden', transform: 'translateX(-130px)' }} className={!this.state.canAdd ? 'ant-dropdown-hidden' : ''}>
          <Menu.Item>
            <Input
              placeholder="输入属性进行搜索"
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} onClick={(e) => e.stopPropagation()} />}
              onChange={this.onSearch}
              onClick={(e) => e.stopPropagation()}
              ref={(input) => this.searchInput = input}
              onFocus={(event) => event.target.select()}
            />
          </Menu.Item>
          {this.propertyMenu('', '')}
          {
            this.state.level1List.map((l, i) => {
              return (
                <Menu.ItemGroup title={l.name} key={i}>
                  {this.level2Menu(l)}
                  {this.propertyMenu(l.value, '')}
                </Menu.ItemGroup>
              );
            })
          }
        </Menu>
      );
    };

    onMenuDropDown = () => {
      if (this.searchInput) { this.searchInput.focus(); }
    };

    render() {
      return (
      <Dropdown.Button className="addCondition" overlay={this.menu()} onClick={this.onAddFilter} disabled={!this.state.canAdd} onVisibleChange={this.onMenuDropDown} icon={<Icon type="down" />}>
            + 添加筛选条件
      </Dropdown.Button>
      );
    }
}

export default LevelMenu;
