import React, { Component } from 'react';
import { FormControl, Navbar, Form, Nav } from 'react-bootstrap';
import './NavCustom.css';
import { Layout, Menu, Button, Row, Col } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import Storage from '../util/Storage';
import API from '../service/API';
import Request from '../service/Request';
import history from '../util/History';
const { Header, Content, Sider } = Layout;

class NavCustom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: '',
            user: '',
            loading: false
        }
    }
    async componentDidMount() {
        if (Storage.has('accessToken')) {
            Request.setAccessToken(Storage.get('accessToken'));
            const res = await API.getCurrentUser();
            console.log(res);
            if (res.code == 200) {
                this.setState({
                    role: res.data.role,
                    user: res.data.fullName,
                })
            }
        }

    }



    _handlerSingout() {
        Storage.remove('accessToken');
        Storage.remove('invoiceArray');
        Request.removeAccessToken();
        window.location.href='/';
        // history.push('/');
    }



    render() {
        const { role, user } = this.state;
        console.log(role + ' ' + user);

        var redirectName = '';
        var helloToUser = '';
        if (role) {
            switch (role) {
                case 'ROLE_MANAGER': redirectName = (<Menu.Item className="menu-item" key="3" style={{ float: 'right' }}><Link to='/managers'>Trang quản lý</Link></Menu.Item>);
                    break;
                case 'ROLE_ADMIN': redirectName = (<Menu.Item className="menu-item" key="3" style={{ float: 'right' }}><Link to='/admins'>Trang quản trị</Link></Menu.Item>);
                    break;
                case 'ROLE_CUSTOMER': redirectName = (<Menu.Item className="menu-item" key="3" style={{ float: 'right' }}><Link to='/invoices-history'>Lịch sử mua</Link></Menu.Item>);
                    break;
                case '': redirectName = '';
                    break;
                case 'ROLE_SHIPPER': redirectName = (<Menu.Item className="menu-item" key="3" style={{ float: 'right' }}><Link to='/shippers'>Trang quản lý</Link></Menu.Item>);
                    break;
                default: redirectName = '';
            }
        }
        if (user) helloToUser = 'Xin chào ' + user;


        const singinStatus = Storage.has('accessToken')
            ? (<Button onClick={() => this._handlerSingout()} >Đăng xuất</Button>)
            : (<Link to='/singin'><Button  >Đăng nhập</Button></Link>);
        return (
            <Row>
                <Col  xs ={0} md ={8}>
                <Menu className='font-size-menu' theme="dark" mode="horizontal">
                    <Menu.Item>{helloToUser}</Menu.Item>
                </Menu>
                </Col>
                
                <Col  xs ={24} md ={16}>
                    <Menu className='font-size-menu' theme="dark" mode="horizontal" defaultSelectedKeys={['3']}>

                        <Menu.Item style={{ float: 'right' }}>{singinStatus}</Menu.Item>
                        {redirectName}
                    </Menu>
                </Col>
            </Row>


        )
    }
}
export default NavCustom;