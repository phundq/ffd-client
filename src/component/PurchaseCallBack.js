import React, { Component } from "react";
import NavCustom from "./NavCustom";
import HeaderCustom from "./HeaderCustom";
import SubNavbar from "./SubNavBar";
import API from "../service/API";
import { Result, Button } from "antd";
import history from "../util/History";

export default class PurchaseCallback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPurchaseSuccess: false,
            appTransId: ''
        }
    }

    async componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        const amount = query.get('amount');
        const discountamount = query.get('discountamount');
        const appid = query.get('appid');
        const checksum = query.get('checksum');
        const apptransid = query.get('apptransid');
        const pmcid = query.get('pmcid');
        const bankcode = query.get('bankcode');
        const status = query.get('status');


        console.log(amount);
        console.log(discountamount);
        console.log(appid);
        console.log(checksum);
        console.log(apptransid);
        console.log(pmcid);
        console.log(bankcode);
        console.log(status);

        const res = await API.checksum(amount, discountamount, appid, checksum, apptransid, pmcid, bankcode, status);

        if (res != null) {
            console.log(res)
            if(res.data == true){
                this.setState({
                    isPurchaseSuccess: true,
                    appTransId: apptransid
                })
            }
        }

    }
    render() {
        const { isPurchaseSuccess,appTransId } = this.state;
        let showResult = (isPurchaseSuccess == true)
            ? (
                <div>
                    <Result
                        status="success"
                        title="Thanh toán thành công!"
                        subTitle= {"mã giao dịch: "+appTransId+". Cảm ơn bạn đã sử dụng dịch vụ!"}
                        extra={[
                            <Button onClick ={()=> history.push('/invoices-history')} type="primary">
                                Xem lại lịch sử
                            </Button>,
                            <Button onClick ={()=> history.push('/')}>Về trang chủ</Button>,
                        ]}
                    />

                </div>
            )
            : (
                <div>
                    <Result
                        status="error"
                        title="Thanh toán thất bại!"
                        subTitle= {"Đã xảy ra lỗi!"}
                        extra={[
                            <Button onClick ={()=> history.push('/invoices-history')} type="primary">
                                Xem lịch sử
                            </Button>,
                            <Button onClick ={()=> history.push('/')}>Về trang chủ</Button>,
                        ]}
                    />

                </div>
            );

        return (
            <div>
                <HeaderCustom navbar={<NavCustom />} />
                <SubNavbar />
                {showResult}
            </div>
        )
    }
}