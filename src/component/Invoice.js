import React, { Component } from 'react';
import SubNavbar from './SubNavBar';
import { Card, Button, Tooltip, Space, Table, Input } from 'antd';
import Request from '../service/Request';
import Title from 'antd/lib/skeleton/Title';
import { EyeFilled, PlusCircleFilled, MinusCircleOutlined, MinusCircleFilled, DeleteFilled, DeleteTwoTone } from '@ant-design/icons';
import NavCustom from './NavCustom';
import Storage from '../util/Storage';
import HeaderCustom from './HeaderCustom';
import API from '../service/API';
import history from '../util/History';

export default class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoiceStorage: [],
            userId: 0,
            resStatus: ''
        }
        this._loadItem = this._loadItem.bind(this);
        this._changeQuantity = this._changeQuantity.bind(this);
        this._handlerClickDelete = this._handlerClickDelete.bind(this);
        this._handlerClickBuy = this._handlerClickBuy.bind(this);
    }

    componentDidMount() {
        this._loadItem();


    }

    async _loadItem(id) {
        if (Storage.has('invoiceArray')) {
            var data = Storage.get('invoiceArray');
            this.setState({
                invoiceStorage: data
            })

        }
       
    }

    _changeQuantity(id, quantity) {
        console.log(id);
        console.log(quantity);
        var invoiceLineUpdate = this.state.invoiceStorage;
        invoiceLineUpdate.map(
            invoice => {
                invoice.invoiceLines.map(invoiceLine => {
                    if (invoiceLine.itemId && invoiceLine.itemId === id) {
                        invoiceLine.quantity = quantity;
                    }

                })
            }
        )

        console.log(invoiceLineUpdate);

        localStorage.setItem('invoiceArray', JSON.stringify(invoiceLineUpdate));

        this._loadItem();


    }

    _handlerClickDelete(id) {
        var invoiceArrayUpdate = this.state.invoiceStorage;
        invoiceArrayUpdate.map((invoice, index) => {
            invoice.invoiceLines.map((invoiceLine, index) => {
                if (invoiceLine.itemId && invoiceLine.itemId === id) {
                    invoice.invoiceLines.splice(index, 1);
                }
            })
            if (!invoice.invoiceLines.length) {
                invoiceArrayUpdate.splice(index, 1);
            }
        })

        if (!invoiceArrayUpdate.length) {
            Storage.remove('invoiceArray');
        }

        localStorage.setItem('invoiceArray', JSON.stringify(invoiceArrayUpdate));



        this._loadItem();
    }

    async _handlerClickBuy(branchId = 0, invoiceLines = []){
        const userId = await API.getCurrentId();
        let data ={
            invoiceLineRequestDTOList: [],
            userId: userId
        }
        invoiceLines.map(invoiceLine =>{
            let line = {
                itemId: invoiceLine.itemId,
                quantity: invoiceLine.quantity
            }
            data.invoiceLineRequestDTOList.push(line);
        })

        console.log(data);
        const res = await API.createInvoiceCustomer(data);
        if(res != null){
            console.log('dat thanh cong')
            Storage.removeBranchInvoice(branchId);
            Storage.set('successBuying', true);
            history.push('invoices-history');

        }
        else console.log('dat that bai')
        console.log(res);
        this._loadItem();

    }

    render() {

        var { invoiceStorage } = this.state;
        console.log(invoiceStorage);

        const columns = [
            {
                title: '',
                dataIndex: "image",
                render: image => <img style={{ width: 100, height: 50, display: "inline-block" }} src={`data:image/jpg;base64,${image}`} />
            },
            {
                title: 'Sản phẩm',
                dataIndex: 'name',
            },

            {
                title: 'Giá',
                dataIndex: 'price',
            },
            {
                title: 'Cửa hàng',
                dataIndex: 'branchName',
            },
            {
                title: 'Số lượng',
                dataIndex: 'quantity',
                render: (quantity, row) =>
                    <Input
                        type={'number'} min={1} max={99}
                        // addonBefore={<MinusCircleFilled style={{ display: 'inline-block', overflow: 'hidden', color:'#007bff' }}/>} 
                        // addonAfter={<PlusCircleFilled style={{ display: 'inline-block', overflow: 'hidden', color:'#007bff' }} />} 
                        defaultValue={quantity} style={{ width: 70 }}
                        onChange={value => this._changeQuantity(row.itemId, Number(value.target.value))}
                    />
            },
            {
                title: '',
                dataIndex: 'itemId',
                render: (itemId) =>
                    <Button
                        onClick={() => this._handlerClickDelete(itemId)}
                        icon={<DeleteTwoTone style={{ display: 'inline-block', overflow: 'hidden', color: '#007bff' }} />}></Button>

            },

        ];


        const listInvoiceView = invoiceStorage.map(invoiceStorage => {
            let totalPay = 0;
            totalPay = invoiceStorage.invoiceLines.map(invoiceStorage => invoiceStorage.price* invoiceStorage.quantity).reduce((totalPay, current)=> totalPay + current, 0);
            return <div>
                <Card.Grid
                    style={{ width: '100%' }}
                    key={invoiceStorage.branchId}>
                    <p>cửa hàng: <b>{invoiceStorage.branchName}</b></p>
                    <Table columns={columns}
                        dataSource={invoiceStorage.invoiceLines}
                        pagination={false} />
                    
                    <Space style={{ float: 'right', marginTop:10}}>
                        <p style ={{margin:'auto'}}><b>Tổng: <span style = {{color:'red'}}>{totalPay}</span> đồng</b></p>
                    <Button
                        type="primary" size={'middle'} shape="round"
                        onClick = { () => this._handlerClickBuy(invoiceStorage.branchId, invoiceStorage.invoiceLines)}  >
                        Đặt hàng
                            </Button>
                    </Space>
                </Card.Grid>
            </div>
        })

        return (
            <div>
                <HeaderCustom navbar ={<NavCustom />} />
                <SubNavbar />
                <div style={{ paddingLeft: 60, paddingRight: 60 }}>
                    <Card>
                        {listInvoiceView}

                    </Card>


                </div>
            </div>
        )
    }
}