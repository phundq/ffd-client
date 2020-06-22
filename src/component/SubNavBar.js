import React, { Component } from "react";
import { Layout, Menu, Button, Input, Row, Col } from "antd";
import { Link } from "react-router-dom";
import Text from "antd/lib/typography/Text";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Search from "antd/lib/input/Search";
import history from "../util/History";
const { Header } = Layout;

class SubNavbar extends Component {

    onSearch(name){
       window.location.href = '/search?name='+name;
    }

    render() {
        return (
            <div>
               <div>
                   <Row className  = "subnavbar-custom">
                       <Col xs = {0} md = {3} className = "bg-subnavbar">
                       </Col>
                       <Col xs = {24} md = {9}>
                       <Menu style = {{width:"100%", paddingRight:"2.5rem", paddingLeft:"2.5rem"}} className='font-size-menu bg-subnavbar' theme="dark" mode="horizontal" defaultSelectedKeys={['1']} >
                            <Menu.Item style = {{width:"25%"}} className="menu-item" key="1"><Link to ='/branchs'>Cửa hàng</Link></Menu.Item>
                            <Menu.Item style = {{width:"25%"}} className="menu-item" key="2"><Link to ='/'>Nổi bật</Link></Menu.Item>
                            {/* <Menu.Item style = {{width:"25%"}} className="menu-item" key="3"><Link to ='/invoices'>Giảm giá</Link></Menu.Item> */}
                            <Menu.Item style = {{width:"25%"}} className="menu-item" key="4"> <Link to ='/invoices'>Giỏ hàng</Link></Menu.Item>
                        </Menu>
                       </Col>
                       <Col xs = {24} md = {9}>
                       <Menu style = {{width:"100%", paddingLeft:"1.5rem", paddingRight:"1.5rem"}} className='font-size-menu bg-subnavbar' theme="dark" mode="horizontal" >
                            <Menu.Item style = {{width:"100%"}} className="menu-item"  >
                                <Search
                                    placeholder="tìm kiếm"
                                    onSearch={value => this.onSearch(value)}
                                    style={{ width: '100%', paddingLeft: 15}}
                                />
                            </Menu.Item>
                        </Menu>
                       </Col>
                       <Col xs = {0} md = {3} className = "bg-subnavbar">

                       </Col>
                   </Row>
                </div>
                <div style={{ paddingTop: 100 }}></div>
            </div>
        )
    }
}
export default SubNavbar;