import React, { Component } from "react";
import HeaderCustom from "./HeaderCustom";
import NavCustom from "./NavCustom";
import API from "../service/API";
import { Card, Row, Col, Descriptions, Input, Space, Button, Form, Rate, Divider, Tooltip, Comment, message, Modal } from "antd";
import Title from "antd/lib/typography/Title";
import { PlusCircleFilled, UserOutlined } from "@ant-design/icons";
import Storage from "../util/Storage";
import history from "../util/History";
import SubNavbar from "./SubNavBar";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";


export default class ItemDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: '',
            itemImage: null,
            itemCommentList: [],
            itemId: 0,
            userId: 0,
            rateValue: 0,
            rateSuccess: true,
            defaultCommentValue:'',
            commentSuccess: true,
            submitting: false,
            modal2Visible: false,

        }
    }
    async componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const id = query.get('id');
        if (id) {
            this._loadItem(id);
            const userId = await API.getCurrentId();
            this.setState({
                userId: userId,
                itemId: id,
            })
        }

    }

    async _loadItem(id) {
        const res = await API.getItemDetails(id);
        console.log(id)
        console.log(res)
        if (res != null) {
            this.setState({
                item: res,
                itemImage: res.image,
                itemCommentList: res.commentList,
                defaultCommentValue:""
            })
        }


    }

    async _handlerClickAddInvoice(value) {
        console.log(value)
        const { item } = this.state;
        Storage.addToInvoice(item.id, item.name, item.branchId, item.branchName, item.image.picByte, item.price, value.quantity);
        history.push('/invoices');
    }

    async _handlerSubmitComment(value) {
        console.log(this.state.userId)
        if(!value.comment){
            message.error("Vui lòng nhập nội dung bình luận!")
        }
        else if(this.state.userId === 0){
            message.error("Vui lòng đăng nhập để bình luận")
        }
        else{
            this.setState({
                submitting:true,
            })
            const res = await API.commentItem(this.state.item.id, this.state.userId, value.comment)

            if(res == null){
                message.error("Đã xảy ra lỗi, vui lòng thử lại!");
            }
            else {
                this._loadItem(this.state.item.id);
            }
            this.setState({
                submitting:false,
            })
            
        }
       
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
            const res = await API.rateItem(this.state.itemId, this.state.userId, this.state.rateValue);
            if(res != null){
                message.success("Thành công! Cảm ơn bạn đã đánh giá!");
                this._loadItem(this.state.item.id);
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
        const {userId, item, itemImage, itemCommentList, rateSuccess, rateValue } = this.state;
        console.log(item)
        console.log(item.name)

        let showRateResult = (rateSuccess == false) 
        ? (<span style={{color:'red'}}>đánh giá không thành công</span>) 
        :'';

        var showRateItem;
        if (userId != 0) {
            showRateItem = (
                <div>
                    <Button type="primary" ghost style={{float:"right"}} onClick={() => this.setModal2Visible(true)}>
                        Đánh giá
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
            showRateItem = '';
        }


        let showCommentList = (itemCommentList === '')
            ? ""
            : itemCommentList.map(itemComment => {
                return (
                    <div style={{ paddingLeft: "2.5rem" }}>
                        <Comment
                            author={<a>{itemComment.userName}</a>}
                            avatar='usercomment.png'
                            content={
                                <p>
                                    {itemComment.content}
                                </p>
                            }
                            datetime={
                                <Tooltip title={moment(itemComment.created).format('YYYY-MM-DD HH:mm:ss')}>
                                    <span>{moment(itemComment.created).fromNow()}</span>
                                </Tooltip>
                            }
                        />
                        <Divider></Divider>
                    </div>
                )
            })

        let showItemDetails = (item === '')
            ? ""
            : (
                <div style={{ margin: '0px 60px' }}>
                    <Row>
                        <Col xs={24} md={10}>
                            <Card cover={<img style={{ display: "block", width: '100%', height: '40vh' }} src={`data:image/jpg;base64,${item.image.picByte}`} />}>
                                <Descriptions title={item.name} style={{ padding: '0px 10px 0px 10px' }}>
                                    <Descriptions.Item label="giá">{item.price} đồng</Descriptions.Item>
                                    <Descriptions.Item label="cửa hàng" span={2}>{item.branchName}</Descriptions.Item>
                                    <Descriptions.Item label="mô tả" span={3}>{item.description}</Descriptions.Item>
                                    <Descriptions.Item label="thêm vào giỏ hàng" span={3}>
                                        <Form style={{ display: 'flex' }}
                                            initialValues={{ remember: true }}
                                            onFinish={(value) => this._handlerClickAddInvoice(value)}>
                                            <Space>
                                                <Form.Item name="quantity" rules={[{ required: true, message: 'Mời nhập số lượng!' }]} >
                                                    <Input type="number" max={99} min={1} style={{ width: 120 }}></Input>
                                                </Form.Item>
                                                <Form.Item>
                                                    <Button htmlType='submit' type="primary" shape="round" icon={<PlusCircleFilled style={{ display: 'inline-block', overflow: 'hidden' }} />}>Thêm</Button>
                                                </Form.Item>
                                            </Space>
                                        </Form>

                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>


                        </Col>
                        <Col xs={0} md={2}></Col>
                        <Col xs={24} md={12} style={{ paddingLeft: 30, paddingRight: 15 }}>
                            <Row>
                                <Col span={12}>
                                    <Rate value={item.totalEvaluation} disabled style={{ marginLeft: "2.5rem" }}></Rate>
                                    <span style={{ color: 'rgb(123, 121, 121)', marginLeft: 5, fontStyle: 'italic' }}>({item.numberOfEvaluations} đánh giá)</span>
                                </Col>
                                <Col span={12}>{showRateItem}</Col>
                            </Row>

                            <Divider orientation="left">Bình luận<span>     ({item.numberOfComments}):</span></Divider>
                            <Form  style = {{display: 'flex', width:'100%'}}
                            onFinish={(value)=> this._handlerSubmitComment(value) }>
                                <Form.Item 
                                style = {{ width:'85%'}} 
                                name = "comment" required={true}>
                                    <TextArea autoSize = {true} value= {this.state.defaultCommentValue} />
                                </Form.Item>
                                <Form.Item 
                                style = {{ width:'15%'}} >
                                    <Button htmlType="submit" loading={this.state.submitting} style = {{ width:'100%'}}   type="primary">
                                        Bình luận
      </Button>
                                </Form.Item>
                            </Form>
                            <div style ={{height:320, overflowY:'scroll'}}>
                            {showCommentList}
                            </div>

    

                        </Col>
                    </Row>
                </div>
            );



        return (
            <div>
                <HeaderCustom navbar={<NavCustom />} />
                <SubNavbar />
                {showItemDetails}
            </div>
        )
    }
}