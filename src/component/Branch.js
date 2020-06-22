import React, { Component } from "react";
import { PAGE_SIZE_BRANCH } from "../constant/APIConstant";
import { Table, Row, Col, Card } from "antd";
import Request from "../service/Request";
import Pagination from "./Pagination";
import { Meta } from "antd/lib/list/Item";
import { Redirect } from "react-router";
import NavCustom from "./NavCustom";
import SubNavbar from "./SubNavBar";
import HeaderCustom from "./HeaderCustom";

export default class Bracnh extends Component{

    constructor(props) {
        super(props);
        this.state = {
            branchs: [],
            page : 1,
            size : 5,
            total : 0,
            redirectPath: null,
            resStatus: null
        }
        this._getBranchs = this._getBranchs.bind(this);
        this._handlerClickBranch = this._handlerClickBranch.bind(this);
        this._handlerPagination = this._handlerPagination.bind(this);
    }
    async _getBranchs(page = 1){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': true,
            },
            mode: 'cors'
        };

        const res = await Request.get('api/v1/branchs',{page: page, size: PAGE_SIZE_BRANCH});
        console.log(res);
        this.setState({
            branchs: res.data.content,
            page : res.data.page,
            pageSize : res.data.pageSize,
            total : res.data.total
        })
    }

    async componentDidMount() {
        this._handlerPagination(1);
    }

    async _handlerPagination(page){
        this._getBranchs(page);
    }

    _handlerClickBranch(id){
        window.location.href = '/branchs-details?id='+id+'';
        console.log(id);
        
    }

    render(){
        const {redirectPath} = this.state;
        if(redirectPath){
            return <Redirect to={redirectPath} />
        }
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
            },
           
            {
                title: 'Created',
                dataIndex: 'created',
            },
            {
                title: 'Modified',
                dataIndex: 'modified',
            },
        ];
        const branchs = this.state.branchs;
        const {page = 1, total} = this.state;
        console.log(page)

        const listBranch = branchs.map(branch => {
            return (
                    <Col span = {6} key = {branch.id}>
                    
                    <Card hoverable
                    onClick = {()=> this._handlerClickBranch(branch.id)}
                     style ={{width:"70%", margin: "auto", marginBottom: 40 }}
                   // width = {"80%"}
                    cover ={<img style = {{width:'100%', height: '20vh'}} src={`data:image/jpg;base64,${branch.image.picByte}`} />}>
                        <Meta title = {branch.name} />

                    </Card>
                    </Col>
            )
        }) 

    
        console.log(listBranch);
        return(
            <div>
                <HeaderCustom navbar ={<NavCustom />} />
                <SubNavbar />
                <Row>{listBranch}</Row>
                    <div>
                        <Pagination current ={page} total={total} pageSize={PAGE_SIZE_BRANCH}
                        onChange = {(page) => this._handlerPagination(page)}/>
                    </div>
            </div>
        )
    }
}