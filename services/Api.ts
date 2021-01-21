import axios, { AxiosInstance } from 'axios';

const apigee = function(): AxiosInstance {
    var baseUrl = 'https://api2.ferguson.com/';

    return axios.create({
        baseURL: baseUrl,
        timeout: 10000,
    });
};

const microsoft = function(): AxiosInstance {
    var baseUrl = 'https://mydigitalspace.webhook.office.com/';

    return axios.create({
        baseURL: baseUrl,
        timeout: 20000,
    });
};

export { apigee, microsoft };
