import React from 'react';
import { Layout, Spin } from 'antd';
import { push } from 'connected-react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch, Redirect } from 'react-router-dom';
import { MenuOutlined, LoadingOutlined } from '@ant-design/icons';

import 'antd/dist/antd.css';

import LoginPage from './pages/LoginPage';
import AppSideBar from './components/AppSideBar';

import './App.css';
import styles from './App.module.css';
import { history } from './redux/store';
import * as ActionTypes from './redux/actionTypes';
import { routes, sideMenuItems } from './constants';

const { Content, Header } = Layout;

const loadingIcon = <LoadingOutlined spin className={styles.loadingIcon} />;

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.app.user);

  const loading = useSelector((state) => state.app.loading);

  const collapsed = useSelector((state) => state.app.collapsed);

  React.useEffect(() => {
    dispatch({ type: ActionTypes.CHECK_LOGIN });
  }, [dispatch])

  const onClickToggle = React.useCallback(() => {
    dispatch({ type: ActionTypes.TOGGLE_SIDEBAR });
  }, [dispatch]);

  const onClickMenuItem = React.useCallback((item) => {
    if (item.action) {
      dispatch({ type: item.action });
      return;
    }

    dispatch(push(item.path));
  }, [dispatch]);

  const renderRouteItem = React.useCallback((key) => {
    let route = routes[key];

    if (typeof route === 'function') {
      route = route();
    }

    const routeProps = {
      key: key,
      path: route.path,
      exact: route.exact,
    }

    const isBuiltComponent = React.isValidElement(route.component);

    if (isBuiltComponent) {
      routeProps.children = route.component;
    } else {
      routeProps.component = route.component;
    }

    return (
      <Route
        {...routeProps}
      />
    )
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin indicator={loadingIcon} />
      </div>
    )
  }

  if (!user) {
    return (
      <ConnectedRouter history={history}>
        <Redirect to="/" />
        <LoginPage />
      </ConnectedRouter>
    )
  }

  return (
    <ConnectedRouter history={history}>
      <Layout className={styles.layoutContainer}>
        {/* LEFT SIDE BAR */}
        <AppSideBar
          collapsed={collapsed}
          sideMenuItems={sideMenuItems}
          onClickMenuItem={onClickMenuItem}
        />

        <Layout className={styles.layoutContainer}>
          <Header className={styles.header}>
            <MenuOutlined
              className={styles.toggleMenuIcon}
              onClick={onClickToggle}
            />
          </Header>
          <Content className={styles.content}>
            <Switch>
              {Object.keys(routes).map(renderRouteItem)}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </ConnectedRouter>
  );
}

export default App;
