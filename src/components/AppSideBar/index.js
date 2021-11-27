import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { Layout, Menu, Avatar, Typography } from 'antd';

import styles from './styles.module.css';

const { Sider } = Layout;

const AppSideBar = ({
  user,
  collapsed,
  sideMenuItems,
  onClickMenuItem: onClickMenuItemProps,
}) => {
  const location = useLocation();

  const onClickMenuItem = React.useCallback((item) => () => {
    onClickMenuItemProps(item);
  }, [onClickMenuItemProps]);

  const renderMenuItem = React.useCallback((item) => (
    <Menu.Item
      key={item.path || item.action}
      icon={item.icon}
      onClick={onClickMenuItem(item)}
    >
      {item.title}
    </Menu.Item>
  ), [onClickMenuItem]);

  return (
    <Sider collapsible collapsed={collapsed} trigger={null}>
      <div className={styles.logoContainer}>
        <Avatar size={collapsed ? 36 : 128} src={user.avatar || "https://picsum.photos/200"} />
        {!collapsed && <Typography.Title level={4} className={styles.username}>{user.name}</Typography.Title>}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        selectedKeys={[location.pathname]}
      >
        {sideMenuItems.map(renderMenuItem)}
      </Menu>
    </Sider>
  );
}

AppSideBar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  user: PropTypes.instanceOf(Object).isRequired,
  sideMenuItems: PropTypes.instanceOf(Array).isRequired,
}

export default AppSideBar;
