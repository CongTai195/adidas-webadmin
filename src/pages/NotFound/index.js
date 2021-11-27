import React from 'react';
import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';

import { routes } from '../../constants';

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Rất tiếc, trang này không tồn tại."
      extra={<Link to={routes.HOME_REDIRECT.path}><Button type="primary">Quay về trang chủ</Button></Link>}
    />
  );
}

export default NotFound;
