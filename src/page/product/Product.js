import React, { Component } from "react"
import { render } from "@testing-library/react"
import NavCustom from "../../component/NavCustom";
import Axios from "axios";
import { Layout, Menu, Button, Input, Row, Col } from "antd";
import Search from "antd/lib/input/Search";
import Wellcome from "../../component/Wellcome";
import nProgress from 'nprogress';
import 'nprogress/nprogress.css'
import Bracnh from "../../component/Branch";
import BranchDetails from "../../component/BranchDetails";
import { Link } from "react-router-dom";
import SubNavbar from "../../component/SubNavBar";
const { Header } = Layout;


export default class Product extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            isLoading: true,
            resStatus: null,
            contents: <Wellcome />
        }
    }

    async _onClickMenu(Comp) {
        nProgress.start();
        this.setState({
            contents: <Comp />
        })
        nProgress.done();
    }

    async componentDidMount() {
        if(localStorage && localStorage.getItem('currentBranch')){
            console.log(localStorage.getItem('currentBranch'));
            this.setState({
                contents: <BranchDetails />
            })
        }
    }
    render() {
        const contents = this.state.contents;
        const {isAuth, content} = this.props;
        return (
            <div>
                <SubNavbar />
                <div>
                    {content}
                </div>
                

            </div>);
    }
}