import React, { Component } from 'react';
import './Admin.css'
import { Layout, Breadcrumb, Menu, Button } from 'antd';
import Icon, { LaptopOutlined, BranchesOutlined, MenuUnfoldOutlined, MenuFoldOutlined, StepForwardOutlined, UserOutlined } from '@ant-design/icons';
import Kind from './Kind';
import User from './User';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css'
import NavCustom from '../../component/NavCustom';
import 'antd/dist/antd.css';
import Test from '../../component/Test';
import HeaderCustom from '../../component/HeaderCustom';
const SubMenu = Menu.SubMenu;
const { Content, Sider } = Layout;

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents: <User />,
      collapsed: false,
    }
    this._onClickMenu = this._onClickMenu.bind(this);
  }
  componentDidMount() {
    this.setState({
      contents: <User />
    })
  }

  toggle(){
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  toggle2(){
      console.log(window.innerWidth)
      if(window.innerWidth < 638){
        this.setState({
          collapsed: true,
        });
      }
      else{
        this.setState({
          collapsed: false,
        });
      }

  };

  async _onClickMenu(Comp) {
    nProgress.start();
    this.setState({
      contents: <Comp />
    })
    nProgress.done();
  }


  render() {
    const contents = this.state.contents;
    console.log(contents);
    const trigger = (this.state.collapsed)
      ? <Menu mode="inline" theme = {'dark'}
      style={{height:'100%', width:80}}>
        <MenuUnfoldOutlined
        className='trigger'
        onClick={()=>this.toggle()}
        style={{
          marginTop: 16,
          marginBottom:'auto',
          marginLeft:5,
          color:'#fff',
          fontSize:30,
          display: 'block'
        }}

      />
    </Menu> 
      
      
      : <Menu mode="inline" theme = {'dark'}
      style={{height:'100%',width:80}}>
        <MenuFoldOutlined
        className='trigger'
        onClick={()=>this.toggle()}
        style={{
          marginTop: 16,
          marginBottom:'auto',
          marginLeft:5,
          color:'#fff',
          fontSize:30,
          display: 'block'
        }}

      />
    </Menu> 
    return (
      <div>
        <HeaderCustom trigger={trigger} navbar={<NavCustom />} />

        <Layout className="main-layout" style={{ border: '4px #f0f2f5 solid' }}>
          <Sider theme ='light' width={230} breakpoint='md' onBreakpoint={()=>this.toggle2()} trigger={null} collapsible collapsed={this.state.collapsed} className="site-layout-background">
            <Menu className="menu-custom"
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu onTitleClick={() => this._onClickMenu(User)}
                key="sub1"
                icon={<UserOutlined className='font-size-menu' />}
                title={
                  <span className='font-size-menu'>
                    Người dùng
              </span>
                }
              >
                <Menu.Item className='font-size-sub-menu' key="1">

                  <Link to='/'>Tất cả</Link></Menu.Item>
                <Menu.Item className='font-size-sub-menu' key="2">Bị khóa</Menu.Item>
                <Menu.Item className='font-size-sub-menu' key="3">Quản lý</Menu.Item>
                <Menu.Item className='font-size-sub-menu' key="4">Người giao hàng</Menu.Item>
                <Menu.Item className='font-size-sub-menu' key="5">Khách hàng</Menu.Item>
              </SubMenu>
              <SubMenu onTitleClick={() => this._onClickMenu(Kind)}
                key="sub2"
                icon={<LaptopOutlined className='font-size-menu' />}
                title={
                  <span className='font-size-menu'>
                    Loại sản phẩm
              </span>
                }
              >
                <Menu.Item className='font-size-sub-menu' key="6">Tất cả</Menu.Item>
                <Menu.Item className='font-size-sub-menu' key="67">Bị Khóa</Menu.Item>
              </SubMenu>
              <SubMenu onTitleClick={() => this._onClickMenu(User)}
                key="sub3"
                icon={<BranchesOutlined className='font-size-menu' style={{ marginBottom: '2px' }} />}
                title={
                  <span className='font-size-menu'>

                    Cửa hàng
              </span>
                }
              >
                <Menu.Item className='font-size-sub-menu' key="8">Tất cả</Menu.Item>
                <Menu.Item className='font-size-sub-menu' key="9">Nổi bật</Menu.Item>
                <Menu.Item className='font-size-sub-menu' key="10">Bị Khóa</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: 0 }} className="site-layout">
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              {contents}
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
export default Admin;