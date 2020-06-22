import axios from 'axios';

const client = (token = null) => {
    const defaultOptions = {
        headers: {
            Authorization: token ? `Token ${token}` : '',
        },
    };

    return {
        get: (url, options = {}) => axios.get(url, { ...defaultOptions, ...options }),
        post: (url, data, options = {}) => axios.post(url, data, { ...defaultOptions, ...options }),
        put: (url, data, options = {}) => axios.put(url, data, { ...defaultOptions, ...options }),
        delete: (url, options = {}) => axios.delete(url, { ...defaultOptions, ...options }),
    };
};

const request = client('MY SECRET TOKEN');

request.get(PAGES_URL);