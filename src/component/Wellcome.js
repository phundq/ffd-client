import React, { Component } from "react"
import { render } from "@testing-library/react"
import Axios from "axios";
import { Row, Col, Card, Carousel, Divider } from "antd";
import Title from "antd/lib/typography/Title";
import NavCustom from "./NavCustom";
import SubNavbar from "./SubNavBar";
import HeaderCustom from "./HeaderCustom";
import API from "../service/API";
import OwlCarousel from "react-owl-carousel";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Item from "antd/lib/list/Item";
import history from "../util/History";
import { Button } from "react-bootstrap";
export default class Wellcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            branchs: [],
            isLoading: true,
            resStatus: null
        }
        this.loadComponent = this.loadComponent.bind(this);
        this._onClickBranch = this._onClickBranch.bind(this);
        this._onClickItem = this._onClickItem.bind(this);
    }

    async loadComponent() {
        const items = await API.getTopItems();
        const branchs = await API.getLastModifiedBranchs();

        this.setState({
            items: items,
            branchs: branchs.content
        })
    }

    async componentDidMount() {
        this.loadComponent();

    }

    _onClickItem(id){
        history.push('/items?id='+id);
    }
    _onClickBranch(id){
        history.push('/branchs-details?id='+id);
    }
    async testOrder(id){
        const res = await API.createOrder(id);
        console.log(res)
    }
    render() {
        // const showImage = <img style={{width:200,height:130}} src={`data:image/jpg;base64,${image.picByte}`} />
        const { items, branchs } = this.state;
        console.log(items)
        console.log(branchs)

        let showOwlCarouselBranchs = '';
        if (branchs.length != 0) {
            showOwlCarouselBranchs = (
                <OwlCarousel
                    className="owl-theme"
                    loop
                    items={3} margin={8} autoplay={true} autoplayTimeout={3000}
                >
                    {branchs.map(branch => (
                        <div className="item" key={branch.id}>
                            <Card hoverable onClick = {() => this._onClickBranch(branch.id)}
                                cover={<img style={{ width: "100%", height: 130 }} src={`data:image/jpg;base64,${branch.image.picByte}`} />}
                            >
                                {branch.name}
                            </Card>
                        </div>
                    ))}
                </OwlCarousel>
            )
        }

        let showOwlCarouselItems = '';
        if (items.length != 0) {
            showOwlCarouselItems = (
                <OwlCarousel
                    className="owl-theme"
                    loop
                    items={2} margin={8} autoplay={true} autoplayTimeout={5000}
                    dots={false}
                >
                    {items.map(item => (
                        <div className="item" key={item.id}>
                            <img onClick = {() => this._onClickItem(item.id)} style={{ width: "100%", height: 150 }} src={`data:image/jpg;base64,${item.image.picByte}`} />
                        </div>
                    ))}
                </OwlCarousel>

            )
        }





        return (
            <div>
                <HeaderCustom navbar={<NavCustom />} />
                <SubNavbar />
                <div style={{ textAlign: "center" }}>
                    <Row>
                        <Col xs = {0} md ={1} ></Col>
                        <Col xs = {24} md ={10}>
                            <div>
                                <Title style={{ fontSize: 40 }} >FAST FOOD DELIVERY</Title>
                                <br />
                                <span style ={{color:"black", textShadow: '6px 2px 8px rgba(15,206,145,0.39)', fontSize:'5em', fontFamily:"'Roboto Mono', monospace"}}>FFD</span>
                                <br />
                                <br />
                                <br />
                                <Title style={{ fontSize: 18 }} > HỆ THỐNG DỊCH VỤ THỨC ĂN NHANH PHẠM VI TT - HUẾ</Title>
                                <br />
                                <Title style={{ fontSize: 15 }} > Hỗ trợ: 0*** *** ***</Title>
                            </div>
                        </Col>
                        <Col xs = {0} md ={1} ></Col>
                        <Col xs = {24} md ={10}>
                            <Row>
                                <Divider orientation="left" style={{marginTop:0}}>Cửa hàng</Divider>
                                {showOwlCarouselBranchs}

                            </Row>
                            <Row>
                            <Divider orientation="left">Món được yêu thích</Divider>
                                <Col style={{ width: '100%' }}>
                                    {showOwlCarouselItems}
                                </Col>
                            </Row>

                        </Col>
                        <Col xs = {0} md ={2} ></Col>

                    </Row>


                </div>

            </div>
        );
    }
}