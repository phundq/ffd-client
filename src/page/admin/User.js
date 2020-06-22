import React, { Component, useState } from 'react';
import Request from '../../service/Request';
import Pagination from '../../component/Pagination';
import { Table } from 'antd';
const PAGE_SIZE = 5;

export default class User extends Component{
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            page : 1,
            size : 5,
            total : 0,
            isLoading: true,
            resStatus: null
        }
        this._getUsers = this._getUsers.bind(this);
    }
    async _getUsers(page = 1){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': true,
            },
            mode: 'cors'
        };

        const res = await Request.get('api/v1/users',{page: page, size: PAGE_SIZE});
        console.log(res);
        this.setState({
            users: res.data.content,
            page : res.data.page,
            pageSize : res.data.pageSize,
            total : res.data.total
        })
    }

    async componentDidMount() {
        this._getUsers();
    }

    async _handlerPagination(page){
        this._getUsers(page);
    }
    render(){
        const columns = [
            {
                title: 'Tên',
                dataIndex: 'fullName',
            },
            {
                title: 'Email',
                dataIndex: 'email',
            },
            {
                title: 'Ngày sinh',
                dataIndex: 'dob',
            },
            {
                title: 'Thời gian tạo',
                dataIndex: 'created',
            },
            {
                title: 'Thời gian chỉnh sửa',
                dataIndex: 'modified',
            },
        ];
        const users = this.state.users;
        const {page = 1, total} = this.state;
        console.log(page)


        return(
            <div>
                <Table
                        columns={columns}
                        dataSource={users}
                        pagination = {false}
                    />

                    <div>
                        <Pagination current={page} total={total} pageSize={PAGE_SIZE}
                        onChange = {(page) => this._handlerPagination(page)}/>
                    </div>
            </div>
        )
    }
    
}