import { API_BASE_URL, ACCESS_TOKEN, PAGE_SIZE, PAGE_NO } from '../constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function get(url, page, size) {
    page = page || PAGE_NO;
    size = size || PAGE_SIZE;

    return request({
        url: API_BASE_URL + url + "?page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function post(url, data) {
    page = page || PAGE_NO;
    size = size || PAGE_SIZE;

    return request({
        url: API_BASE_URL + url + "?page=" + page + "&size=" + size,
        method: 'POST',
        body: JSON.stringify(data)  
    });
}

export function put(url, data) {
    page = page || PAGE_NO;
    size = size || PAGE_SIZE;

    return request({
        url: API_BASE_URL + url + "?page=" + page + "&size=" + size,
        method: 'PUT',
        body: JSON.stringify(data)  
    });
}

export function put(url, data) {
    page = page || PAGE_NO;
    size = size || PAGE_SIZE;

    return request({
        url: API_BASE_URL + url + "?page=" + page + "&size=" + size,
        method: 'PUT',
        body: JSON.stringify(data)  
    });
}