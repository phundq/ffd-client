import React, { Component, useState } from 'react';
import { Table, Radio, Divider, Button, Space, Collapse, Popover, Input } from 'antd';
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import Axios from 'axios';
import ButtonGroup from 'antd/lib/button/button-group';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import Pagination from '../../component/Pagination';
import Request from '../../service/Request';

const PAGE_SIZE = 5;
export default class Kind extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kinds: [],
            page : 1,
            size : 5,
            total : 0,
            isLoading: true,
            resStatus: null
        }
        this._getKinds = this._getKinds.bind(this);
    }

    async _getKinds(page = 1){
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': true,
            },
            mode: 'cors'
        };

        const res = await Request.get('api/v1/kinds',{page: page, size: PAGE_SIZE});
        console.log(res);
        this.setState({
            kinds: res.data.content,
            page : res.data.page,
            pageSize : res.data.pageSize,
            total : res.data.total
        })
    }

    async componentDidMount() {
        this._getKinds();
    }

    async _handlerPagination(page){
        this._getKinds(page);
    }
    
    render() {
        const columns = [
            {
                title: 'Tên',
                dataIndex: 'name',
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
        const kinds = this.state.kinds;

        // rowSelection object indicates the need for row selection
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };

        const Demo = () => {
            const [selectionType, setSelectionType] = useState('checkbox');
            const addContent = (<div>
                <br/>
                <Form initialValues={{ remember: true }}>
                    <FormItem
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên loại!' }]}
                    >
                        <Input />
                    </FormItem>
                    <FormItem>
                    <Button htmlType="submit" type="primary" style={{marginLeft :'92px' }}>Lưu</Button>
                    </FormItem>
                    
                </Form>
            </div>)

            const {page, total} = this.state;

            return (
                <div>
                    <Radio.Group
                        onChange={({ target: { value } }) => {
                            setSelectionType(value);
                        }}
                        value={selectionType}
                    >
                        <Radio value="checkbox">Checkbox</Radio>
                        <Radio value="radio">radio</Radio>
                    </Radio.Group>
                    <ButtonGroup style={{ float: 'right' }}>
                        <Space>
                            <Popover placement="bottomLeft" content={addContent}>
                                <Button type="primary">Tạo mới loại</Button>
                            </Popover>


                            <Button type="dashed">Xóa</Button>
                        </Space>
                    </ButtonGroup>


                    <Divider />

                    <Table
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={kinds}
                        pagination = {false}
                    />

                    <div>
                        <Pagination defaultCurrent={page} total={total} pageSize={PAGE_SIZE}
                        onChange = {(page) => this._handlerPagination(page)}/>
                    </div>
                </div>
            );
        };


        return (
            <Demo />
        )
    }

}