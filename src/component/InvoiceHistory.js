import React, { Component } from 'react';
import SubNavbar from './SubNavBar';
import { Card, Button, Tooltip, Space, Table, Input, Alert } from 'antd';
import Request from '../service/Request';
import Title from 'antd/lib/skeleton/Title';
import { EyeFilled, PlusCircleFilled, MinusCircleOutlined, MinusCircleFilled, DeleteFilled, DeleteTwoTone } from '@ant-design/icons';
import NavCustom from './NavCustom';
import Storage from '../util/Storage';
import HeaderCustom from './HeaderCustom';
import moment from 'moment';
import API from '../service/API';
import history from '../util/History';
import { PAGE_SIZE_INVOICE } from '../constant/APIConstant';
import Pagination from './Pagination';

export default class InvoiceHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceHistory: [],
      userId: 0,
      resStatus: '',
      isBuySuccess: false,
    }
    this._loadItem = this._loadItem.bind(this);
    this._handlerClickPurchase = this._handlerClickPurchase.bind(this);
    this._handlerClickCancelOrder = this._handlerClickCancelOrder.bind(this);
  }

  async componentDidMount() {
    this._loadItem(1,5);
    if(Storage.has('successBuying') && Storage.get('successBuying') == true)
      this.setState({
        isBuySuccess: true
      })
      Storage.remove('successBuying');

  }

  async _loadItem(page =1, size =5) {
    if (await API.isCustomer() != true) {
      history.push('/')
    }
    else {
      const res = await API.getAllInvoiceCustomer(await API.getCurrentId(), page, size);
      console.log(res)
      this.setState({
        invoiceHistory: res
      })
    }

  }

  _handlerPagination(page =1, size = 5){
    this._loadItem(page, size);
  }

  async _handlerClickPurchase(id){
    const res = await API.createOrder(id);
    if(res!= null)
    console.log(res)
    window.location.href = res.order_url;
  }

  async _handlerClickCancelOrder(id){

    const res = await API.cancelInvoiceCustomer(id);
    if(res!= null)
    this._loadItem()

  }


  render() {
    var { invoiceHistory, isBuySuccess } = this.state;
    console.log(isBuySuccess)
    var alert = (isBuySuccess == true) ? (
      <Alert
          className ='fixed-100'
          message="Đặt hàng thành công"
          description='đơn hàng đã lưu vào hệ thống'
          type="success"
          showIcon
          closable
        />
    )
    : '';
    const columns = [
      {
        title: 'Cửa hàng',
        dataIndex: "branchName",
        render: branchName => <span style={{ color: 'black' }}>{branchName}</span>
      },
      {
        title: 'Id',
        dataIndex: "id",
        className: 'hide'
      },
      {
        title: 'Ngày đặt',
        dataIndex: 'created',
        render: created => moment(created).format("hh:mm DD-MM-yyyy")
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
              ? <span style={{ color: 'orange' }}> Đang chuẩn bị</span>
              : status == 'DELIVERING'
                ? <span style={{ color: 'blue' }}>Đang giao</span>
                : status == 'SUCCESSFULLY'
                  ? <span style={{ color: 'green' }}>Thành công</span>
                  : <span style={{ color: 'black' }}>Không thành công</span>
      },
      {
        title: 'Thanh toán',
        dataIndex: 'purchaseDetail',
        render: purchaseDetail => (purchaseDetail == null)? 'Đang chờ': <span style={{color:'green'}}>{(purchaseDetail.status === 'PURCHASED')?"Đã thanh toán":purchaseDetail.status === 'REFUND'?"Đang hoàn tiền":''} ({purchaseDetail.method})</span>,
      },
      {
        title: 'Thao tác',
        dataIndex: 'status',
        render:( (status, row) =>{
          let disabled = false;
          if(row.purchaseDetail != null && row.purchaseDetail.status !== 'WAITING'){
            disabled = true;
          }
        
          return status == 'ORDERED'
            ? <Space><Button disabled = {disabled} danger onClick = {()=> this._handlerClickCancelOrder(row.id)}>Hủy</Button> <Button disabled = {disabled} onClick = {()=> this._handlerClickPurchase(row.id)} ghost type='primary'>Thanh toán</Button></Space>
            : status == 'PREPARING'
              ? <Space><Button danger disabled>Hủy</Button> <Button disabled = {disabled} ghost onClick = {()=> this._handlerClickPurchase(row.id)}  type='primary'>Thanh toán</Button></Space>
              : status == 'DELIVERING'
                ? <Space><Button danger disabled>Hủy</Button><Button  ghost onClick = {()=> this._handlerClickPurchase(row.id)}  type='primary'>Thanh toán</Button></Space>
                : <Space><Button >Chi tiết</Button></Space>
        }
        )
      },



    ];




    return (
      <div>
        <HeaderCustom navbar={<NavCustom />} />
        <SubNavbar />
        <div style={{ paddingLeft: 60, paddingRight: 60 }}>
          <Card>
            <Table columns={columns}
              dataSource={invoiceHistory.content}
              pagination ={false} />
            <div>
                <Pagination current={invoiceHistory.page} total={invoiceHistory.total} pageSize={5}
                  onChange={(page) => this._handlerPagination(page,5)} />
              </div>
          </Card>
          


        </div>
        {alert}
      </div>
    )
  }
}