import Request from "./Request";
import { data } from "jquery";

export default class API{
    static async getCurrentUser(){
        return await Request.get('api/v1/users/currents');
    }

    static async getCurrentRole(){
        const res = await Request.get('api/v1/users/currents');
        if(res.code && res.code == 200)
        return res.data.role;
        return null;
    }
    static async isCustomer(){
        const res = await Request.get('api/v1/users/currents');
        if(res.code && res.code == 200)
        return res.data.role === 'ROLE_CUSTOMER';
        return false;
    }
    

    static async getCurrentId(){
        const res = await Request.get('api/v1/users/currents');
        if(res.code && res.code == 200)
        return res.data.id;
        return null;
    }

    static async getAllInvoiceManager(id, filter = '', page = 1, size = 5){
        const res = await Request.get('api/v1/invoices/managers/'+id, {page: page, filter: filter, size: size});
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async getAllInvoiceCustomer(id, page = 1, size = 5){
        const res = await Request.get('api/v1/invoices/users/'+id, {page: page, size: size});
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async getAllInvoicePreparingForShipper(page = 1, size = 5){
        const res = await Request.get('api/v1/invoices/preparing', {page: page, size: size});
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }
    static async getAllInvoiceOfShipper(id, page = 1, size = 5){
        const res = await Request.get('api/v1/invoices/shippers/'+id, {page: page, size: size});
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async createInvoiceCustomer(data){
        const res = await Request.post('api/v1/invoices',data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async cancelInvoiceCustomer(id){
        let data = {
            id: id,
            status: "FAILED"
        }
        const res = await Request.put('api/v1/invoices/changeStatus',data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }
    static async setInvoiceFail(id){
        const res = await Request.put('api/v1/invoices/fail/'+id);
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async confirmInvoiceCustomer(id){
        let data = {
            id: id,
            status: "PREPARING"
        }
        const res = await Request.put('api/v1/invoices/changeStatus',data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async confirmInvoiceByShipper(invoiceId, shipperId ){
        let data = {
            id: invoiceId,
            shipperId: shipperId,
            status: "DELIVERING"
        }
        const res = await Request.put('api/v1/invoices/changeStatusByShipper',data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async setSuccessInvoiceCustomer(id){
        let data = {
            id: id,
            status: "SUCCESSFULLY"
        }
        const res = await Request.put('api/v1/invoices/changeStatus',data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }
    static async purchaseSuccessInvoiceCustomer(id){
        let data = {
            id: id,
            method: "ZALOPAY"
        }
        const res = await Request.put('api/v1/invoices/success',data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async rateBranch(branchId, userId, evaluate){
        const res = await Request.post('api/v1/branchs/evaluation', null, {branchId: branchId, userId: userId, evaluate: evaluate});
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async rateItem(itemId, userId, evaluate){
        const res = await Request.post('api/v1/items/evaluation', null, {itemId: itemId, userId: userId, evaluate: evaluate});
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async commentItem(itemId, userId, content){
        const res = await Request.post('api/v1/items/comment', null, {itemId: itemId, userId: userId, content: content});
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async getItemDetails(id){
        const res = await Request.get('api/v1/items/'+id);
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async getTopItems(){
        const res = await Request.get('api/v1/items/tops');
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async searchItems(name = '', page = 1, size = 20){
        const res = await Request.get('api/v1/items/search',{name: name, page: page, size: size});
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async getLastModifiedBranchs(){
        const res = await Request.get('api/v1/branchs');
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async getBranchByManagerId(id, page = 1){
        const res = await Request.get('api/v1/branchs/managers/'+id, {page:page});
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }
    static async getBranchByManagerIdForSelect(id){
        const res = await Request.get('api/v1/branchs/managers/v2/'+id);
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async getAllKindForSelect(id){
        const res = await Request.get('api/v1/kinds/v2/');
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async getItemByManagerId(id, page = 1){
        const res = await Request.get('api/v1/items/managers/'+id, {page:page});
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }
    static async testUpload(file){
        const formData = new FormData();
        formData.append('image',file)
        const res = await Request.postFormData('api/v1/items/upload', formData);
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async addNewBranch(name, address, description, phone, timeOpen, timeClose, image, managerId){
        const formData = new FormData();
        formData.append('name',name)
        formData.append('address',address)
        formData.append('description',description)
        formData.append('phone',phone)
        formData.append('timeOpen',timeOpen)
        formData.append('timeClose',timeClose)
        formData.append('image',image)
        formData.append('managerId',managerId)
        const res = await Request.postFormData('api/v1/branchs', formData);
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }

    static async addNewItem(name, price, branchId, kindId, description, image){
        const formData = new FormData();
        formData.append('name',name)
        formData.append('price',price)
        formData.append('branchId',branchId)
        formData.append('kindId',kindId)
        formData.append('description',description)
        formData.append('image',image)
        const res = await Request.postFormData('api/v1/items', formData);
        if(res.code && res.code == 200)
        return res.data;
        return null;
    }
    static async deleteBranch(id){
        let data = {
            ids: [id]
        }
        const res = await Request.delete('api/v1/branchs/',data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }

    static async createOrder(id){
        const res = await Request.get('api/v1/invoices/orders/'+id);
        if(res.code && res.code == 200)
        {
            let data = res.data;
            console.log(data)
            const res2 = await Request.postOrder('https://sb-openapi.zalopay.vn/v2/create', data)
            return res2;
        }
        return null;
       
    }

    static async checksum(amount, discountamount, appid, checksum, apptransid, pmcid, bankcode, status ){
        let data = {
            amount : amount,
            discountamount : discountamount,
            app_id : appid,
            checksum : checksum,
            app_trans_id : apptransid,
            pmcid : pmcid,
            bank_code : bankcode,
            status : status

        }
        const res = await Request.post('api/v1/invoices/orders/',null, data);
        if(res.code && res.code == 200)
        return res;
        return null;
    }


}

