import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Request from "../service/Request";
import Storage from "../util/Storage";
import NavCustom from "../component/NavCustom";
import API from "../service/API";
import history from "../util/History";
import HeaderCustom from "../component/HeaderCustom";
import Title from "antd/lib/typography/Title";


export default class Singin extends Component {

    constructor(props){
        super(props);
        this.state ={
            token:'',
            isLoading: true,
            isAuth:false,
            authFail: false,
        }
        this.onFinish = this.onFinish.bind(this);
        this.onFinishFailed = this.onFinishFailed.bind(this);
    }

    async onFinish (values){
        const data = {
            email: values.username,
            password: values.password
        }
        const res = await Request.post('api/v1/users/signin', data);
        if(res.code && res.code == 200){
            Storage.set('accessToken', res.data.accessToken);
            Request.setAccessToken(Storage.get('accessToken'));
            
            const res2 = await Request.get('api/v1/users/currents');
            this.setState({
                authFail:false
            })

            var role = await API.getCurrentRole();
            switch(String(role)){
                case 'ROLE_ADMIN' : history.push('/admins');
                break;
                case 'ROLE_MANAGER' : history.push('/managers');
                break;
                case 'ROLE_CUSTOMER' : history.push('/');
                break;
                case 'ROLE_SHIPPER' : history.push('/shippers');
                break;
                default : history.push('/shippers');
            }
        }
        else{
            this.onFinishFailed();
        }
      };
    
    onFinishFailed () {
        this.setState({
            authFail:true
        })
      };

    render() {
        const {authFail} = this.state;
        const authFailMess = authFail ? (<Form.Item style={{marginBottom:0}}><p style={{color:'red', textAlign:"center"}}>Email hoặc mật khẩu chưa chính xác</p></Form.Item>): '';
        return (
            <div>
                <HeaderCustom navbar ={<NavCustom />} />
            <div id= 'components-form-demo-normal-login' >
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Form.Item>
                    <Title level = {3} style={{textAlign:"center", marginTop:5,color:"#414141"}}>Đăng nhập</Title>
                    </Form.Item>
                    <Form.Item
                        name="username"
                        className="mt-24"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input tabIndex = {1} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input tabIndex={2}
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>
                    {authFailMess}
                    {/* <Form.Item>
                        <a className="login-form-forgot" href="">
                            Forgot password
        </a>
                    </Form.Item> */}

                    <Form.Item>
                        <Button tabIndex ={3} type="primary" htmlType="submit" className="login-form-button">
                            Đăng nhập
        </Button>
        hoặc <a href="">Đăng ký!</a>
                    </Form.Item>
                </Form>
            </div>
            </div>
           
        )
    }
}