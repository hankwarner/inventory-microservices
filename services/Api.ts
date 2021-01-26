import axios from 'axios';

const apigee = function() {
    var baseUrl = 'https://api2.ferguson.com/';

    return axios.create({
        baseURL: baseUrl,
        timeout: 20000,
    });
};

const microsoft = function() {
    var baseUrl = 'https://mydigitalspace.webhook.office.com/';

    return axios.create({
        baseURL: baseUrl,
        timeout: 20000,
    });
};

export { apigee, microsoft };
