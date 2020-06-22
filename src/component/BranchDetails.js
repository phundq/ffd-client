import React, { Component } from "react";
import { Row, Col, Card, Button, Tooltip, Space, Rate, Badge, message } from "antd";
import Meta from "antd/lib/card/Meta";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import { PAGE_SIZE_BRANCH_ITEMS } from "../constant/APIConstant";
import Request from "../service/Request";
import Pagination from "./Pagination";
import { EyeFilled, PlusCircleFilled } from '@ant-design/icons';
import SubNavbar from "./SubNavBar";
import NavCustom from "./NavCustom";
import Storage from "../util/Storage";
import history from "../util/History";
import HeaderCustom from "./HeaderCustom";
import Modal from "antd/lib/modal/Modal";
import API from "../service/API";

export default class BranchDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch: '',
            branchId: 0,
            branchImage: '',
            branchItems: [],
            page: 1,
            size: 5,
            total: 0,
            redirectPath: null,
            resStatus: null,
            modal2Visible: false,
            userId:0,
            rateValue: 0,
            rateSuccess: true,
        }
        this._getBranchItems = this._getBranchItems.bind(this);
        this._handlerPagination = this._handlerPagination.bind(this);
        this._getCurrentBranch = this._getCurrentBranch.bind(this);
        this._getBranchState =this._getBranchState.bind(this);
    }

    async _getBranchItems(id = 0,page = 1) {

        console.log(id)
        if(id != 0) {
            const res = await Request.get('api/v1/items/branchs/' + id.toLocaleString() + '', { page: page, size: PAGE_SIZE_BRANCH_ITEMS });
            console.log(res);
            this.setState({
                branchItems: res.data.content,
                page: res.data.page,
                pageSize: res.data.pageSize,
                total: res.data.total
            })
        }

       
    }
    async _getCurrentBranch(){
        const query = new URLSearchParams(this.props.location.search);
        const id = query.get('id');
        console.log(query.get('id'));

        const res1 = await Request.get('api/v1/branchs/'+id);
        this.setState({
            rateSuccess:true,
            branch : res1.data,
            branchId: res1.data.id,
            branchImage: res1.data.image
        })
        console.log(this.state.branch.image.name);
        this._getBranchItems(res1.data.id);

    }
    async componentDidMount() {
        this.setState({
            rateValue:0
        })
        this._getCurrentBranch();
        const userId = await API.getCurrentId();
        if(userId != null){
            this.setState({
                userId : userId
            })
        }
    }

    async _handlerPagination(branchId, page) {
        this._getBranchItems(branchId, page);
    }

    _handlerClickAddToInvoice(itemId,name, branchId, branchName, image, price, quantity = 1 ){
        var invoiceArray = [];
        let flag = 0;
        if(Storage.has('invoiceArray')){
            invoiceArray = Storage.get('invoiceArray');
        }
        invoiceArray.map(
            invoice => {
                console.log(invoice.invoiceLines)
                if(invoice.branchId == branchId){
                    flag = 1;
                    let flag2 = 0;
                    

                    invoice.invoiceLines.map(invoiceLine => {
                        if(invoiceLine.itemId && invoiceLine.itemId === itemId){
                            flag2 = 1;
                            invoiceLine.quantity += quantity;
                        }
                        
                    })
                    if(flag2 == 0){
                        var newInvoiceLine = {
                            itemId: itemId,
                            name: name,
                            branchId: branchId,
                            branchName: branchName,
                            image: image,
                            price: price,
                            quantity : quantity
                        }
                        invoice.invoiceLines.push(newInvoiceLine);
                    }
                }
            }
         )

        if(flag === 0){
            var newInvoice = {
                branchId: branchId,
                branchName: branchName,
                invoiceLines: [{
                    itemId: itemId,
                    name: name,
                    branchId: branchId,
                    branchName: branchName,
                    image: image,
                    price: price,
                    quantity : quantity
                }
            ]
            }
            invoiceArray.push(newInvoice)
        }

        flag = 0;

            

            localStorage.setItem('invoiceArray', JSON.stringify(invoiceArray));
         





        history.push('/invoices')
        // window.location.href = '/invoices';
    }

    _handlerClickViewItem(id){
        window.location.href = '/items?id=' + id;
    }

    _getBranchState(){
        return this.state.branch;
    }

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
      }

    _handlerClickChangeRate(value){
        this.setState({
            rateValue: value
        })
    }
    async _handlerClickSubmitRate(){
        console.log(this.state.itemId, this.state.userId, this.state.rateValue);
        if(this.state.rateValue != 0){
            const res = await API.rateBranch(this.state.branchId, this.state.userId, this.state.rateValue);
            if(res != null){
                message.success("Thành công! Cảm ơn bạn đã đánh giá!");
                this._getCurrentBranch();
            }
            else{
                message.error("Đánh giá không thành công! Vui lòng thử lại!")
            }
        }
        else{
            message.error("Vui lòng nhập chọn điểm đánh giá!")
        }
        this.setModal2Visible(false);
    }
    render() {
        const {branch, branchImage, branchId, userId, rateSuccess} = this.state;
        console.log(branch.totalEvaluation);

        let showRateResult = (rateSuccess == false) 
        ? (<span style={{color:'red'}}>đánh giá không thành công</span>) 
        :'';

        var showRateBranch;
        if (userId != 0) {
            showRateBranch = (
                <div>
                    <Button type="primary" onClick={() => this.setModal2Visible(true)}>
                        Đánh giá cửa hàng
                    </Button>
                    <Modal
                        title="Đánh giá cửa hàng"
                        centered
                        visible={this.state.modal2Visible}
                        onOk={() => this._handlerClickSubmitRate()}
                        onCancel={() => this.setModal2Visible(false)}
                    >
                        <Rate style={{margin:'auto', display:'block'}} onChange = {(value)=> this._handlerClickChangeRate(value)}></Rate>
                    </Modal>
                </div>
            );
        }else{
            showRateBranch = '';
        }

      
        let date = new Date();
        const timeOpen = moment('2020-5-19 ' + branch.timeOpen);
        const timeClose = moment('2020-5-19 ' + branch.timeClose);
        const now = new Date();
        const timeCurrent = moment('2020-5-19 ' + now.getHours().toLocaleString() + ':' + now.getMinutes().toLocaleString() + ':' + now.getSeconds().toLocaleString());
        console.log(timeOpen.format('hh mm ss'));
        var branchStatus = '';
        if (timeCurrent >= timeOpen) {
            if (timeCurrent < timeClose)
                branchStatus = (<span className="branch-status" style = {{fontSize:15}}><Badge status="success" />đang hoạt động</span>);
            else {
                branchStatus = (<span className="branch-status" style = {{fontSize:15}}><Badge status="default" />đang đóng cửa</span>);
            }
        }
        else {
            branchStatus = (<span className="branch-status" style = {{fontSize:15}}><Badge status="processing" />sắp mở cửa</span>);
        }


        const listBranchItems = this.state.branchItems.map(branchItems => {
            return (

                <Card.Grid style={{ width: '100%' }} key ={branchItems.id}>
                    <div style={{ display: "flex" }}>
                        <div style={{ width: "25%" }}>
                            <img style={{ width: 120, height: 70, display: "inline-block" }} src={`data:image/jpg;base64,${branchItems.image.picByte}`} />
                        </div>
                        <div style={{ width: "75%", paddingLeft: 20, paddingRight: 0 }}>

                            <Title style={{ fontSize: 18, marginBottom: 0 }}>{branchItems.name} <span style={{ float: "right", fontSize: 14, color: "green", fontStyle: "italic" }}>{(branchItems.status === 'ACTIVE') ? 'Còn sản phẩm' : 'Hết sản phẩm'}</span></Title>

                            <Title style={{ fontSize: 13, marginBottom: 5, marginTop: 5 }} type={"danger"}>Giá: {branchItems.price}</Title>
                            <Title style={{ fontSize: 13, margin: 0 }}>Mô tả: {branchItems.description.toLocaleString().substring(0, 10)}
                                <span style={{ float: 'right' }}>
                                    <Space>
                                        <Tooltip title='Xem'>
                                            <Button  onClick = {() => this._handlerClickViewItem(branchItems.id)}
                                            type="primary" size={'small'} shape="round" icon={<EyeFilled style={{ display: 'inline-block', overflow: 'hidden' }} />} >

                                            </Button>
                                        </Tooltip>
                                        <Tooltip title='Thêm vào giỏ'>
                                            <Button  onClick = {() => this._handlerClickAddToInvoice(branchItems.id,branchItems.name,branch.id, branch.name, branchItems.image.picByte, branchItems.price, 1)} 
                                            type="primary" size={'small'} shape="round" icon={<PlusCircleFilled style={{ display: 'inline-block', overflow: 'hidden' }} />} >

                                            </Button>
                                        </Tooltip>
                                    </Space>
                                </span>
                            </Title>
                        </div>
                    </div>
                </Card.Grid>

            )
        })


        // if (currentBranch.timeOpen < date.get) 
        return (
            <div>
                <HeaderCustom navbar ={<NavCustom />} />
                <SubNavbar />
                <Row>
                    <Col span={7} style={{ paddingLeft: 40, paddingRight: 30 }}><img width={"100%"} height={200} style={{ display: "block" }} src={`data:image/jpg;base64,${branchImage.picByte}`} />
                        <br />
                        <br />
                        <Title  style={{fontSize:14}}>Địa chỉ: {branch.address}</Title>
                        <Title  style={{fontSize:14}}>Liên hệ: {branch.phone}</Title>
                        <Title  style={{fontSize:14}}>Mô tả: {branch.description}</Title>


                    </Col>
                    <Col span={6}>
                        <Title  level={3} style={{marginBottom:0}}>{branch.name}</Title>
                        <Title level={4} type={'secondary'} style ={{marginTop:0, marginBottom:0}}>{branchStatus}</Title>
                        <Title level={4} style={{marginTop:5,color:'rgba(64, 63, 63, 0.85)'}}>{timeOpen.format('hh:mm A')} - {timeClose.format('hh:mm A')}</Title>
                        <Rate value = {branch.totalEvaluation} disabled style = {{marginBottom:30}}/><span style={{color:'rgb(123, 121, 121)', marginLeft:5, fontStyle:'italic'}}>({branch.numberOfEvaluations} đánh giá)</span>
                        
                        
                        {showRateBranch}
                        {showRateResult}
                    </Col>
                    <Col span={11} style={{ paddingRight: 40 }}>
                        <Card title='Sản phẩm'>
                            <div className='list-branch-item' style={{ overflowY: 'scroll', height: 365 }}>
                                {listBranchItems}
                            </div>
                        </Card>

                        <div>
                            <Pagination current={this.state.page} total={this.state.total} pageSize={PAGE_SIZE_BRANCH_ITEMS}
                                onChange={(page) => this._handlerPagination(branchId, page)} />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}