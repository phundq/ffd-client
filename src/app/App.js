import React, { Component } from 'react';
import {  Switch, Route, BrowserRouter, Router } from 'react-router-dom';
import Admin from '../page/admin/Admin';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import Kind from '../page/admin/Kind';
import User from '../page/admin/User';
import LoadRoute from './LoadRouter';
import Routes from './Routes';
import NavCustom from '../component/NavCustom';
import Product from '../page/product/Product';
import 'antd/dist/antd.css';
import Bracnh from '../component/Branch';
import Wellcome from '../component/Wellcome';
import BranchDetails from '../component/BranchDetails';
import Test from '../component/Test';
import Invoice from '../component/Invoice';
import Singin from '../page/Singin';
import history from '../util/History';
import ManagerHomePage from '../component/ManagerHomePage';
import ShipperHomePage from '../component/ShipperHomePage';
import InvoiceHistory from '../component/InvoiceHistory';
import ItemDetails from '../component/ItemDetails';
import Search from '../component/Search';
import ManagerBranchsAndItems from '../component/ManagerBranchsAndItems';
import PurchaseCallback from '../component/PurchaseCallBack';
class App extends Component {
  render() {
    return (
      <div>
      <Router history = {history}>
       <div>          
          {/* <Route exact path="/" render = {props => <Product {...props} isAuth = {true} content = {<Wellcome />} />} /> */}
          <Route exact path="/" component={Wellcome} />
          <Route exact path="/branchs" component = {Bracnh} />
          <Route path="/branchs-details" component={BranchDetails} />
          <Route exact path="/invoices" component={Invoice} />
          <Route exact path="/invoices-history" component={InvoiceHistory} />
          <Route exact path="/admins" component={Admin} />
          <Route exact path="/singin" component={Singin} />
          <Route path="/managers" component={ManagerHomePage} />
          <Route path="/managers-branchs-items" component={ManagerBranchsAndItems} />
          <Route exact path="/shippers" component={ShipperHomePage} />
          <Route exact path="/items" component={ItemDetails} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/purchase-callback" component={PurchaseCallback} />
          
          {/* {Routes.map((route, i) =>
            <LoadRoute key={i} {...route} />
          )} */}
        
        </div>
      </Router>
      </div>
    );
  }
}
export default App;