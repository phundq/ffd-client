import lodash from 'lodash'
import Axios from 'axios';
import { API_BASE_URL } from '../constant/APIConstant';
let accessToken = null;

class Request {

  static setAccessToken(token) {
    accessToken = token;
  }

  static getAccessToken() {
    return accessToken;
  }

  static removeAccessToken() {
    accessToken = null;
  }

  static async get(url, params) {
    url = API_BASE_URL + url;
    const config = {
      headers: {
        'Access-Control-Allow-Origin': true,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors'
    };

    if (params) {
      url += this._getQueryString(params);
    }

    if(accessToken){
      this._authorization = `Bearer ${accessToken}`;
    }

    if (this._authorization) {
      config.headers.Authorization = this._authorization;
    }

    const res = await fetch(url, config);
    if (!res.ok) {
      throw res
    }

    const text = await res.text()

    try {
      const responseData = text !== '' ? JSON.parse(text) : ''
      return responseData
    } catch (error) {
      throw error
    }
  }

  static async post(url, data = null, params) {
    url = API_BASE_URL + url;
    const config = {
      method: 'post',
      headers: {
        'Access-Control-Allow-Origin': true,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    };

    if (params) {
      url += this._getQueryString(params);
    }
    if(data != null){
      config.body = JSON.stringify(data);
    }
    const res = await fetch(url, config);

    const text = await res.text()

    try {
      const responseData = text !== '' ? JSON.parse(text) : ''
      return responseData
    } catch (error) {
      return error
    }
  }


  static async postOrder(url, data = null, params) {
        const config = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json'
      }
    };

    if (params) {
      url += this._getQueryString(params);
    }
    if(data != null){
      config.body = JSON.stringify(data);
    }
    const res = await fetch(url, config);

    const text = await res.text()

    try {
      const responseData = text !== '' ? JSON.parse(text) : ''
      return responseData
    } catch (error) {
      return error
    }
  }

  static async postFormData(url, data = null, params) {
    url = API_BASE_URL + url;
    const config = {
      method: 'post'
    };

    if (params) {
      url += this._getQueryString(params);
    }
    if(data != null){
      config.body = data;
    }
    const res = await fetch(url, config);

    const text = await res.text()

    try {
      const responseData = text !== '' ? JSON.parse(text) : ''
      return responseData
    } catch (error) {
      return error
    }
  }

  static async put(url, data, params) {
    url = API_BASE_URL + url;
    const config = {
      method: 'put',
      headers: {
        'Access-Control-Allow-Origin': true,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    };

    if (params) {
      url += this._getQueryString(params);
    }
    config.body = JSON.stringify(data);
    const res = await fetch(url, config);

    const text = await res.text()

    try {
      const responseData = text !== '' ? JSON.parse(text) : ''
      return responseData
    } catch (error) {
      return error
    }
  }

  static async delete(url, data, params) {
    url = API_BASE_URL + url;
    const config = {
      method: 'delete',
      headers: {
        'Access-Control-Allow-Origin': true,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
    };

    if (params) {
      url += this._getQueryString(params);
    }
    config.body = JSON.stringify(data);
    const res = await fetch(url, config);

    const text = await res.text()

    try {
      const responseData = text !== '' ? JSON.parse(text) : ''
      return responseData
    } catch (error) {
      return error
    }
  }


  static _getQueryString(params) {
    const parts = []

    lodash.forEach(params, (value, key) => {
      const values = lodash.isArray(value) ? value : [value]
      const operator = lodash.isArray(value) ? '[]=' : '='

      lodash.forEach(values, (v) => {
        parts.push(key + operator + encodeURIComponent(v))
      })
    })

    const queryString = parts.join('&')

    return queryString ? `?${queryString}` : ''
  }

}
export default Request;