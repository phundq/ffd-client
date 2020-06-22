import React, { Component } from "react";
import history from "../util/History";
import NavCustom from "./NavCustom";
import SubNavbar from "./SubNavBar";
import { Row, Col, Card, Divider, Empty } from "antd";
import API from "../service/API";
import HeaderCustom from "./HeaderCustom";
import Pagination from "./Pagination";

export default class Search extends Component{
    constructor(props){
        super(props);
        this.state ={
            name: '',
            items:'',
            content :[],
            total:0,
            page:1,
            size:20,
            isLoading:false

        }
        this._loadComponent = this._loadComponent.bind(this);
        this._handlerClickItem = this._handlerClickItem.bind(this);
    }

    async componentDidMount(){
        const query = new URLSearchParams(this.props.location.search);
        const name = query.get('name');
        if(name){
            this._loadComponent(name);
            this.setState({
                name:name
            })
        }
        else{
            this._loadComponent(this.state.name);
        }
       
        

    }

    async _loadComponent(name = '', page = 1, size = 20){
        const res = await API.searchItems(name, page, size );
        if(res!= null){
            this.setState({
                items:res,
                content:res.content,
                total:res.total,
                page:res.page,
                size:res.pageSize
            })
        }

    }

    async _handlerPagination(name = '', page = 1){
        this._loadComponent(name, page)
    }

    _handlerClickItem(id){
        history.push('/items?id='+id);
    }
    render(){
        const {items,content, total, page, size, name} = this.state;
        console.log(items.content)
        let showItems = (<Row><Empty style = {{width:'100%', height:'auto', marginTop:30}} /></Row>);
        if (content.length) {
            showItems = (
                <Row style={{padding:'0px 30px'}}>
                    {items.content.map(item => (
                        <Col xs={8} md = {4} key={item.id} style={{padding:15}}>
                            <Card hoverable onClick = {() => this._handlerClickItem(item.id)}
                                cover={<img style={{ width: "100%", height: "20vh" }} src={`data:image/jpg;base64,${item.image.picByte}`} />}
                            >
                                {item.name}
                            </Card>
                        </Col>
                    ))}

                </Row>
            )
        }

        return (
            <div>
                <HeaderCustom navbar = {<NavCustom />}/>
                <SubNavbar/>
        <Divider  style = {{marginTop:0}}>Kết quả tìm kiếm cho "{name}":</Divider>
                {showItems}
                <div>
                        <Pagination current ={page} total={total} pageSize={size}
                        onChange = {(page) => this._handlerPagination(name, page)}/>
                </div>
            </div>
        )
    }
}