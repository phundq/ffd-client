import React, { Component } from "react";
import NavCustom from "./NavCustom";
import HeaderCustom from "./HeaderCustom";
import { Menu, Layout, Table, Button, Space, Drawer, Input, Col, Row, Form, message, Select } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import { LaptopOutlined, BranchesOutlined, MenuFoldOutlined, UserOutlined, MenuUnfoldOutlined, PlusOutlined } from "@ant-design/icons";
import User from "../page/admin/User";
import { Link } from "react-router-dom";
import Kind from "../page/admin/Kind";
import nProgress from "nprogress";
import history from "../util/History";
import API from "../service/API";
import moment from 'moment';
import Pagination from "./Pagination";
import { PAGE_SIZE_INVOICE } from "../constant/APIConstant";
import Title from "antd/lib/typography/Title";
import { Option } from "antd/lib/mentions";
const { Content, Sider } = Layout;

export default class ManagerBranchsAndItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      listBranch:[],
      listKind:[],
      pageSize: 1,
      filter: '',
      defaultIndexMenu: '9',
      collapsed: false,
      visible: false,
      name:'',
      address:'',
      phone:'',
      description:'',
      timeOpen:'',
      timeClose:'',
      image:'',
      price:'',
      branchId:'',
      kindId:''
    }
    this._onClickMenu = this._onClickMenu.bind(this);
    this._loadComponent = this._loadComponent.bind(this);
    this._getAllBranchs = this._getAllBranchs.bind(this);
    this._getAllItems = this._getAllItems.bind(this);
    this._handlerPagination = this._handlerPagination.bind(this);
  }
  async componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const filter = query.get('filter');
    if (filter) {
      let index = '9';
      index = filter === 'branchs'
        ? '8' : '9'
      this.setState({
        filter: filter,
        defaultIndexMenu: index,
      })
    }

    this._loadComponent();
  }



  async _loadComponent(page = 1) {
    const role = await API.getCurrentRole();
    if (role && role == 'ROLE_MANAGER') {
      const managerId = await API.getCurrentId();
      if (managerId && this.state.filter !== '') {
        if (this.state.filter === 'items') {
          this._getAllItems(managerId, page);
        }
        if (this.state.filter === 'branchs') {
          this._getAllBranchs(managerId, page);
        }

      }
    }
  }

  async _getAllBranchs(managerId, page = 1) {
    const res = await API.getBranchByManagerId(managerId, page)
    if (res != null) {
      this.setState({
        content: res,
        pageSize: res.pageSize
      })
    }
  }

  async _getAllItems(managerId, page = 1) {
    const res = await API.getItemByManagerId(managerId, page)
    const res2 = await API.getBranchByManagerIdForSelect(managerId)
    const res3 = await API.getAllKindForSelect()
    if (res != null) {
      this.setState({
        content: res,
        pageSize: res.pageSize,
        listBranch:res2,
        listKind: res3
      })
    }
    console.log(res2)
  }

  async _handlerPagination(page = 1) {
    this._loadComponent(page);

  }


  async _handlerClickDeleteBranch(id) {
    const res = await API.deleteBranch(id);
    if (res != null)
      this._loadComponent();
      console.log(res)

  }

  async _handlerClickDeleteItem(id) {
   

  }

  toggle() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  toggle2() {
    console.log(window.innerWidth)
    if (window.innerWidth < 638) {
      this.setState({
        collapsed: true,
      });
    }
    else {
      this.setState({
        collapsed: false,
      });
    }

  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onSubmitNewBranch(e) {
    console.log(e.image.target.files[0]);
  }

  async _onClickMenu(url) {
    window.location.href = url;
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'file' ? event.target.files[0] : target.value;
    const name = target.id;
    this.setState({
        [name]: value,
    });
    console.log(name +"  "+ value)
};
  handleSelectChangeBranch = (event) => {
    
    this.setState({
      branchId: event
    })
    console.log(event)
};
  handleSelectChangeKind = (event) => {
    this.setState({
      kindId: event
    })
  
    console.log(event)
};

  async submitAddBranch()
  {
    const {name, address, phone, description, timeOpen, timeClose, image} = this.state;
    const managerId = await API.getCurrentId();
    const res = await API.addNewBranch(name, address, description, phone, timeOpen, timeClose, image, managerId);
    if(res != null){
      message.success('Tạo mới cửa hàng thành công');
      this._loadComponent()
    }
    else {
      message.error('Tạo mới cửa hàng không thành công');
    }

  }

  async submitAddItem()
  {
    const {name, price, branchId, kindId, description, image} = this.state;
    const res = await API.addNewItem(name, price, branchId, kindId, description, image);
    if(res != null){
      message.success('Tạo mới sản phẩm thành công');
      this._loadComponent();
    }
    else {
      message.error('Tạo mới sản phẩm không thành công');
    }
    

  }
  render() {
    const trigger = (this.state.collapsed)
      ? <Menu mode="inline" theme={'dark'}
        style={{ height: '100%', width: 80 }}>
        <MenuUnfoldOutlined
          className='trigger'
          onClick={() => this.toggle()}
          style={{
            marginTop: 16,
            marginBottom: 'auto',
            marginLeft: 5,
            color: '#fff',
            fontSize: 30,
            display: 'block'
          }}

        />
      </Menu>


      : <Menu mode="inline" theme={'dark'}
        style={{ height: '100%', width: 80 }}>
        <MenuFoldOutlined
          className='trigger'
          onClick={() => this.toggle()}
          style={{
            marginTop: 16,
            marginBottom: 'auto',
            marginLeft: 5,
            color: '#fff',
            fontSize: 30,
            display: 'block'
          }}

        />
      </Menu>


    // Content

    const { content, pageSize, filter, defaultIndexMenu, listBranch, listKind } = this.state;
    console.log(content.pageSize)

    const addItem = (filter === 'branchs')
      ? (
        <div style={{ float: 'right', position: 'absolute', top: 10, right: 7 }}>
          <Button type="primary" onClick={this.showDrawer}>
            <PlusOutlined /> Thêm cửa hàng
        </Button>
          <Drawer
            title="Thêm mới cửa hàng"
            width={720}
            onClose={this.onClose}
            visible={this.state.visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                  Hủy
              </Button>
                <Button  form="addBranch"   type="primary" htmlType="submit">
                  Tạo
              </Button>
              </div>
            }
          >
            <Form id = "addBranch" layout="vertical" enctype="multipart/form-data" hideRequiredMark onFinish={()=>this.submitAddBranch()} >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng' }]}
                  >
                    <Input placeholder="Nhập tên cửa hàng" 
                    onChange={this.handleInputChange}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="address"
                    label="Địa chỉ"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                  >
                    <Input placeholder="Nhập địa chỉ"
                    onChange={this.handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                  >
                    <Input placeholder="Nhập số điện thoại" 
                    onChange={this.handleInputChange}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                  >
                    <Input placeholder="Nhập mô tả"
                    onChange={this.handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="timeOpen"
                    label="Thời gian mở cửa"
                    rules={[{ required: true, message: "Vui lòng nhập thời gian mở cửa" }]}
                  >
                    <Input type={'time'} placeholder="Nhập thời gian mở cửa" 
                    onChange={this.handleInputChange}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="timeClose"
                    label="Thời gian đóng cửa"
                    rules={[{ required: true, message: 'Vui lòng nhập thời gian đóng cửa' }]}
                  >
                    <Input type={'time'} placeholder="Nhập thời gian đóng cửa"
                    onChange={this.handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="image"
                    label="Ảnh đại diện"
                    rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện' }]}
                  >
                    <Input onChange={this.handleInputChange}
                     type={'file'} placeholder="Chọn ảnh đại diện"
                    />
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </Drawer>
        </div>
      ) : (
        <div style={{ float: 'right', position: 'absolute', top: 10, right: 7 }}>
          <Button type="primary" onClick={this.showDrawer}>
            <PlusOutlined /> Thêm món mới
        </Button>
          <Drawer
            title="Thêm món mới"
            width={720}
            onClose={this.onClose}
            visible={this.state.visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                  Hủy
              </Button>
                <Button  form="addItem"   type="primary" htmlType="submit">
                  Tạo
              </Button>
              </div>
            }
          >
            <Form id = "addItem" layout="vertical" enctype="multipart/form-data" hideRequiredMark onFinish={()=>this.submitAddItem()} >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Tên"
                    rules={[{ required: true, message: 'Please enter  name' }]}
                  >
                    <Input placeholder="Vui lòng nhập tên sản phẩm" 
                    onChange={this.handleInputChange}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="Giá"
                    rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
                  >
                    <Input placeholder="Nhập giá sản phẩm" type = "number"
                    onChange={this.handleInputChange}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="branchId"
                    label="Cửa hàng"
                    rules={[{ required: true, message: "Vui lòng chọn cửa hàng" }]}
                  >
                    <Select name="branchId"
                    onChange={this.handleSelectChangeBranch}
                    placeholder="Chọn cửa hàng">
                    {listBranch.map(branch=>(
                       <Option  value={branch.id}>{branch.name}</Option>
                    ))}
                  </Select>                    
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="kindId"
                    label="Loại sản phẩm"
                    rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                  >
                    <Select name="kindId"
                    onChange={this.handleSelectChangeKind}
                    placeholder="Chọn loại sản phẩm">
                    {listKind.map(kind=>(
                       <Option  value={kind.id}>{kind.name}</Option>
                    ))}
                  </Select>       
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập tên mô tả" }]}
                  >
                    <Input type={'text'} placeholder="Nhập mô tả sản phẩm" 
                    onChange={this.handleInputChange}/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                <Form.Item
                    name="image"
                    label="Ảnh đại diện"
                    rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện' }]}
                  >
                    <Input onChange={this.handleInputChange}
                     type={'file'} placeholder="Chọn ảnh đại diện"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>
        </div>
      )








    const title = (filter === 'branchs')
      ? 'Tất cả cửa hàng'
      : 'Tất cả sản phẩm';
    const columns = (filter === 'branchs')
      ? [
        {
          title: 'Ngày tạo',
          dataIndex: 'created',
          render: created => moment(created).format("hh:mm DD-MM-yyyy")
        },
        {
          title: 'Ngày sửa',
          dataIndex: 'modified',
          render: modified => moment(modified).format("hh:mm DD-MM-yyyy")
        },
        {
          title: 'Id',
          dataIndex: 'id',
          className: 'hide'
        },

        {
          title: 'Tên cửa hàng',
          dataIndex: 'name',
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status'
        },

        {
          title: 'Thao tác',
          dataIndex: 'id',
          render: (id) =>
            <Space> <Button danger onClick={() => this._handlerClickDeleteBranch(id)}>Xóa</Button></Space>

        },



      ]

      : [
        {
          title: 'Ngày tạo',
          dataIndex: 'created',
          render: created => moment(created).format("hh:mm DD-MM-yyyy")
        },
        {
          title: 'Ngày sửa',
          dataIndex: 'modified',
          render: modified => moment(modified).format("hh:mm DD-MM-yyyy")
        },
        {
          title: 'Id',
          dataIndex: 'id',
          className: 'hide'
        },

        {
          title: 'Tên sản phẩm',
          dataIndex: 'name',
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status'
        },

        {
          title: 'Thao tác',
          dataIndex: 'status',
          render: (row) =>
            <Space> <Button danger disabled onClick={() => this._handlerClickDeleteItem(row.id)}>Xóa</Button></Space>

        },



      ];




















    return (
      <div>
        <HeaderCustom trigger={trigger} navbar={<NavCustom />} />

        <Layout className="main-layout" style={{ border: '4px #f0f2f5 solid' }}>
          <Sider theme='light' width={230} breakpoint='md' onBreakpoint={() => this.toggle2()} trigger={null} collapsible collapsed={this.state.collapsed} className="site-layout-background">
            <Menu className="menu-custom"
              mode="inline"
              defaultOpenKeys={["sub2"]}

              selectedKeys={defaultIndexMenu}
              style={{ height: '100%', borderRight: 0 }}
            >
              <SubMenu
                key="sub1"
                icon={<UserOutlined className='font-size-menu' />}
                title={
                  <span className='font-size-menu'>
                    Đơn Hàng
                  </span>
                }
              >
                <Menu.Item onClick={() => this._onClickMenu('/managers')} className='font-size-sub-menu' key="2">Tất cả</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=ordered')} className='font-size-sub-menu' key="3">Đang chờ</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=preparing')} className='font-size-sub-menu' key="4">Đang chuẩn bị</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=delivering')} className='font-size-sub-menu' key="5">Đang giao</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=succesfully')} className='font-size-sub-menu' key="6">Thành công</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers?filter=failed')} className='font-size-sub-menu' key="7">Không thành công</Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                icon={<LaptopOutlined className='font-size-menu' />}
                title={
                  <span className='font-size-menu'>
                    Món ăn
                  </span>
                }
              >
                <Menu.Item onClick={() => this._onClickMenu('/managers-branchs-items?filter=branchs')} className='font-size-sub-menu' key="8">Cửa hàng</Menu.Item>
                <Menu.Item onClick={() => this._onClickMenu('/managers-branchs-items?filter=items')} className='font-size-sub-menu' key="9">Sản phẩm</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout style={{ padding: 0 }} className="site-layout">
            <Content
              className="site-layout-background"
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <div style={{ border: '2px solid #fafafa', marginBottom: 24, position: 'relative' }}>
                <Title style={{ textAlign: "center", color: 'rgb(117, 114, 114)', fontSize: 22, marginBottom: 13, marginTop: 13 }}>{title}</Title>
                {addItem}
              </div>
              <Table columns={columns}
                dataSource={content.content}
                pagination={false}
              />
              <div>
                <Pagination current={content.page} total={content.total} pageSize={pageSize}
                  onChange={(page) => this._handlerPagination(page)} />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}