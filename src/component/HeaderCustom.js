import React, { Component } from 'react';
import { Layout, Row, Col } from "antd";
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
const { Header } = Layout;

export default class HeaderCustom extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { trigger, navbar } = this.props;

        var showHeader = trigger
        ? (<div>
            <Header className="header pl-0 pr-0 nav-custom" style={{}} >
                <Row style ={{height:'100%'}}>
                    <Col span ={2} style ={{height:'100%'}}>
                    {trigger}
                    </Col>
                    <Col xs = {10} md ={5} style ={{height:'100%'}}><div className="logo"><Link to='/'><Text className="logo-title" style={{ fontSize: 26}}>FFD - Client</Text></Link></div></Col>
                    <Col xs ={12} md ={17}>
                    {navbar}
                    </Col>
                </Row>
            </Header>
            <div className="main"></div>

        </div>)
        : (<div>
            <Header className="header pl-0 pr-0 nav-custom" style={{}} >
                <Row style ={{height:'100%'}}>
                    <Col xs = {10} md ={5} style ={{height:'100%'}}><div className="logo"><Link to='/'><Text className="logo-title" style={{ fontSize: 26}}>FFD - Client</Text></Link></div></Col>
                    <Col xs ={14} md ={19}>
                    {navbar}
                    </Col>
                </Row>
            </Header>
            <div className="main"></div>

        </div>);

        return (<div>
            {showHeader}
        </div>
            
        )
    }
}