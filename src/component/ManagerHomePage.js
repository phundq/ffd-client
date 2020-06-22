import React, { Component } from "react";
import NavCustom from "./NavCustom";
import HeaderCustom from "./HeaderCustom";
import { Menu, Layout, Table, Button, Space } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { LaptopOutlined, BranchesOutlined, MenuFoldOutlined, UserOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import User from "../page/admin/User";
import { Link } from "react-router-dom";
import Kind from "../page/admin/Kind";
import nProgress from "nprogress";
import history from "../util/History";
import API from "../service/API";
import moment from 'moment';
import Pagination from "./Pagination";
import { PAGE_SIZE_INVOICE } from "../constant/APIConstant";
import Title from "antd/lib/typography/Title";
const { Content, Sider } = Layout;

export default class ManagerHomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: [],
      filter: '',
      defaultIndexMenu: '2',
      collapsed: false,
    }
    this._onClickMenu = this._onClickMenu.bind(this);
    this._getAllInvoice = this._getAllInvoice.bind(this);
    this._handlerPagination = this._handlerPagination.bind(this);
    this._handlerClickCancelOrder = this._handlerClickCancelOrder.bind(this);
    this._handlerClickConfirm= this._handlerClickConfirm.bind(this);
    this._handlerClickSuccessInvoice= this._handlerClickSuccessInvoice.bind(this);
  }
  async componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const filter = query.get('filter');
    if (filter) {
      let index = '2';
      index = filter.toUpperCase() === 'ORDERED'
        ? '3'
        : filter.toUpperCase() === 'PREPARING'
          ? '4'
          : filter.toUpperCase() === 'DELIVERING'
            ? '5'
            : filter.toUpperCase() === 'SUCCESSFULLY'
              ? '6'
              : filter.toUpperCase() === 'FAILED'
                ? '7'
                : '2';
      this.setState({
        filter: filter.toUpperCase(),
        defaultIndexMenu: index,
      })
    }

    this._getAllInvoice();
  }

  async _getAllInvoice(page = 1) {
    const role = await API.getCurrentRole();
    if (role && role == 'ROLE_MANAGER') {
      const managerId = await API.getCurrentId();
      if (managerId) {
        const res = await API.getAllInvoiceManager(managerId, this.state.filter, page, PAGE_SIZE_INVOICE);
        this.setState({
          invoice: res,
        })
      }
    }
  }
  async _handlerPagination(page = 1) {
    this._getAllInvoice(page);

  }
  
  async _handlerClickConfirm(id) {
    const res = await API.confirmInvoiceCustomer(id);
    if(res!= null)
    this._getAllInvoice();

  }

  async _handlerClickCancelOrder(id) {
    const res = await API.setInvoiceFail(id);
    if(res!= null)
    this._getAllInvoice();

  }

  async _handlerClickSuccessInvoice(id) {
    const res = await API.setSuccessInvoiceCustomer(id);
    if(res!= null)
    this._getAllInvoice();

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

  async _onClickMenu(url) {
    window.location.href = url;
  }

  render() {
    const trigger = (this.state.collapsed)
      ? <Menu mode="inline" theme={'dark'}
        style={{ height: '100%', width: 80 }}>
        <MenuUnfoldOutlined
          className='trigger'
          onClick={()=> this.toggle()}
          style={{
            marginTop: 16,
            marginBottom: 'auto',
            marginLeft: 5,
            color: '#fff',
            fontSize: 30,
            display: 'block'
          }}

        />
      </Menu>


      : <Menu mode="inline" theme={'dark'}
        style={{ height: '100%', width: 80 }}>
        <MenuFoldOutlined
          className='trigger'
          onClick={()=> this.toggle()}
          style={{
            marginTop: 16,
            marginBottom: 'auto',
            marginLeft: 5,
            color: '#fff',
            fontSize: 30,
            display: 'block'
          }}

        />
      </Menu>


    // INVOICE

    const { invoice, filter, defaultIndexMenu } = this.state;
    console.log(filter +' '+ defaultIndexMenu)
    const columns = [
      {
        title: 'Khách hàng',
        dataIndex: "user",
        render: user => <span style={{ color: 'black' }}>{user.fullName}</span>
      },
      {
        title: 'Ngày đặt',
        dataIndex: 'created',
        render: created => moment(created).format("hh:mm DD-MM-yyyy")
      },
      {
        title: 'Id',
        dataIndex: 'id',
        className: 'hide'
      },

      {
        title: 'Món ăn',
        dataIndex: 'invoiceLines',
        render: (invoiceLines) => invoiceLines.map(invoiceLine => {
          return (<span><span style={{ color: 'black' }}>{invoiceLine.itemName}</span> ({invoiceLine.itemPrice} đồng) - Số lượng : <span style={{ color: 'black' }}>{invoiceLine.quantity}</span><br /></span>)
        }
        )
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: status =>
          status == 'ORDERED'
            ? <span style={{ color: 'red' }}>Đang chờ</span>
            : status == 'PREPARING'
              ? <span style={{ color: 'orange' }}>Đang chuẩn bị</span>
              : status == 'DELIVERING'
                ? <span style={{ color: 'blue' }}>Đang giao</span>
                : status == 'SUCCESSFULLY'
                  ? <span style={{ color: 'green' }}>Thành công</span>
                  : <span style={{ color: 'black' }}>Không thành công</span>
      },
      {
        title: 'Người giao hàng',
        dataIndex: 'shipper',
        render: shipper => (shipper == null)? 'Đang chờ': <span style={{color:'black'}}>{shipper.fullName}</span>,
      },
      {
        title: 'Thanh toán',
        dataIndex: 'purchaseDetail',
        render: purchaseDetail => (purchaseDetail == null)? 'Đang chờ': <span style={{color:'green'}}>{(purchaseDetail.status === 'PURCHASED')?"Đã thanh toán":purchaseDetail.status === 'REFUND'?"Đang hoàn tiền":''} ({purchaseDetail.method})</span>,
      },
      {
        title: 'Thao tác',
        dataIndex: 'status',
        render: (status, row) =>
          status == 'ORDERED'
            ? <Space><Button type='primary' onClick = {()=> this._handlerClickConfirm(row.id)}>Xác nhận</Button> <Button danger onClick = {()=> this._handlerClickCancelOrder(row.id)}>Hủy</Button></Space>
            : status == 'PREPARING'
              ? <Space><Button danger onClick = {()=> this._handlerClickCancelOrder(row.id)}>Hủy</Button></Space>
              : status == 'DELIVERING'
                ? <Space><Button type='primary' ghost onClick = {()=> this._handlerClickSuccessInvoice(row.id)}>Set đã giao</Button> <Button danger onClick = {()=> this._handlerClickCancelOrder(row.id)}>Hủy</Button></Space>
                : <Space><Button>Chi tiết</Button></Space>


      },



    ];























    return (
      <div>
        <HeaderCustom trigger={trigger} navbar={<NavCustom />} />

        <Layout className="main-layout" style={{ border: '4px #f0f2f5 solid' }}>
          <Sider theme='light' width={230} breakpoint='md' onBreakpoint={()=> this.toggle2()} trigger={null} collapsible collapsed={this.state.collapsed} className="site-layout-background">
            <Menu className="menu-custom"
              mode="inline"
              defaultOpenKeys={['sub1']}
              selectedKeys = {defaultIndexMenu}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                icon={<UserOutlined className='font-size-menu' />}
                title={
                  <span className='font-size-menu'>
                    Đơn Hàng 
                  </span>
                }
              >
                <Menu.Item onClick={() => this._onClickMenu('/managers')} className='font-size-sub-menu' key="2">Tất cả</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=ordered')} className='font-size-sub-menu' key="3">Đang chờ</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=preparing')} className='font-size-sub-menu' key="4">Đang chuẩn bị</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=delivering')} className='font-size-sub-menu' key="5">Đang giao</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=succesfully')} className='font-size-sub-menu' key="6">Thành công</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=failed')} className='font-size-sub-menu' key="7">Không thành công</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                icon={<LaptopOutlined className='font-size-menu' />}
                title={
                  <span className='font-size-menu'>
                    Món ăn
                  </span>
                }
              >
                <Menu.Item onClick={() => this._onClickMenu('/managers-branchs-items')} className='font-size-sub-menu' key="6">Cửa hàng</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers-branchs-items')} className='font-size-sub-menu' key="7">Sản phẩm</Menu.Item>
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
              <div style={{ border: '2px solid #fafafa', marginBottom: 24 }}>
                <Title style={{ textAlign: "center", color: 'rgb(117, 114, 114)', fontSize: 22, marginBottom: 13, marginTop: 13 }}>Tất cả đơn hàng</Title>
              </div>
              <Table columns={columns}
                dataSource={invoice.content}
                pagination={false}
              />
              <div>
                <Pagination current={invoice.page} total={invoice.total} pageSize={PAGE_SIZE_INVOICE}
                  onChange={(page) => this._handlerPagination(page)} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}