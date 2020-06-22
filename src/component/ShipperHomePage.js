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

export default class ShipperHomePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      invoice: [],
      invoiceAll: false,
      defaultIndexMenu: '2',
      collapsed: true,
    }
    this._onClickMenu = this._onClickMenu.bind(this);
    this._getAllInvoiceOfShipper = this._getAllInvoiceOfShipper.bind(this);
    this._handlerPagination = this._handlerPagination.bind(this);
    this._handlerClickCancelOrder = this._handlerClickCancelOrder.bind(this);
    this._handlerClickConfirm= this._handlerClickConfirm.bind(this);
    this._handlerClickPurchaseSuccess= this._handlerClickPurchaseSuccess.bind(this);
    this._getAllInvoicePreparingForShipper = this._getAllInvoicePreparingForShipper.bind(this);
  }
  async componentDidMount() {
    this._getAllInvoiceOfShipper();
  }

  async _getAllInvoiceOfShipper(page = 1) {
    const role = await API.getCurrentRole();
    if (role && role == 'ROLE_SHIPPER') {
      const id = await API.getCurrentId();
      if (id) {
        const res = await API.getAllInvoiceOfShipper(id, page, PAGE_SIZE_INVOICE);
        this.setState({
          invoice: res,
          invoiceAll: false,
        })
      }
    }
  }
  async _getAllInvoicePreparingForShipper(page = 1) {
    const role = await API.getCurrentRole();
    if (role && role == 'ROLE_SHIPPER') {
      const id = await API.getCurrentId();
      if (id) {
        const res = await API.getAllInvoicePreparingForShipper(page, PAGE_SIZE_INVOICE);
        this.setState({
          invoice: res,
          invoiceAll: true
        })
      }
    }
  }

  async _handlerPagination(page = 1) {
      if(this.state.invoiceAll == true){
        this._getAllInvoicePreparingForShipper(page);
      }
    else{
        this._getAllInvoiceOfShipper(page);
    }

  }

  async _handlerClickConfirm(id) {
    const shipperId = await API.getCurrentId();
    if(shipperId){
        const res = await API.confirmInvoiceByShipper(id, shipperId);
    }
    this._getAllInvoiceOfShipper();

  }

  async _handlerClickCancelOrder(id) {
    const res = await API.setInvoiceFail(id);
    if(res!= null)
    this._getAllInvoiceOfShipper();

  }

  async _handlerClickPurchaseSuccess(id) {
    const res = await API.setSuccessInvoiceCustomer(id);
    if(res!= null)
    this._getAllInvoiceOfShipper();

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
        title: 'Cửa hàng',
        dataIndex: "branchName",
        render: branchName => <span style={{ color: 'black' }}>{branchName}</span>
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
            status == 'PREPARING'
              ? <span style={{ color: 'orange' }}>{status}</span>
              : status == 'DELIVERING'
                ? <span style={{ color: 'blue' }}>{status}</span>
                : status == 'SUCCESSFULLY'
                  ? <span style={{ color: 'green' }}>{status}</span>
                  : <span style={{ color: 'black' }}>{status}</span>
      },
      {
        title: 'Thanh toán',
        dataIndex: 'purchaseDetail',
        render: purchaseDetail => (purchaseDetail == null)? 'Đang chờ': <span style={{color:'green'}}>{purchaseDetail.status} ({purchaseDetail.method})</span>,
      },
      {
        title: 'Thao tác',
        dataIndex: 'status',
        render: (status, row) =>
          status =='PREPARING'
              ? <Space><Button danger onClick = {()=> this._handlerClickConfirm(row.id)}>Nhận</Button></Space>
              : status == 'DELIVERING'
                ? <Space><Button type='primary' ghost onClick = {()=> this._handlerClickPurchaseSuccess(row.id)}>Đã giao thành công ?</Button> <Button danger onClick = {()=> this._handlerClickCancelOrder(row.id)}>Không thành công ?</Button></Space>
                : <Space><Button>Chi tiết</Button></Space>


      },



    ];























    return (
      <div>
        <HeaderCustom trigger={trigger} navbar={<NavCustom />} />

               <div style ={{width:'100%', display:'inline-block'}}>
               <Space style = {{ marginTop:10, marginBottom:5,marginRight:10, float:'right'}}> 
                   <Button ghost type='primary' onClick = {()=> this._getAllInvoicePreparingForShipper()}>Đơn hàng có sẵn</Button> 
                   <Button type = 'primary' onClick = {()=> this._getAllInvoiceOfShipper()}>Đơn hàng đang giao</Button> 
               </Space>
               </div>
              <div style={{marginRight:10,marginLeft:10}}>
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
              </div>
         
      </div>
    );
  }
}