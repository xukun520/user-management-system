import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import UserManagement from './pages/UserManagement';
import './App.less';

const { Header, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo">用户管理系统</div>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Switch>
              <Route path="/" exact component={UserManagement} />
              <Route path="/users" component={UserManagement} />
            </Switch>
          </div>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;