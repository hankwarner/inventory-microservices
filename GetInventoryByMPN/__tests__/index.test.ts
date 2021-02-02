import httpTrigger from '../index';
import mockedRequestFactory from '../utils/MockedRequestFactory';

let configValues;
console.log(process.env.NODE_ENV);
console.log(process.env.CONFIG_VALUES);

// Assigns env variables in local.settings.json to process.env
if(process.env.NODE_ENV == 'test'){
    const config = require('../../local.settings.json');
    configValues = config.Values;

} else {
    configValues = process.env.CONFIG_VALUES;
}
console.log(configValues);
beforeAll(() => {
    process.env = Object.assign(process.env, configValues);
});

describe('Get inventory by Master Product Number', () => {
    it('fails if no MPNs provided.', async () => {
        let body = {
            MasterProductNumbers: []
        };

        const res = await mockedRequestFactory(httpTrigger, body);

        expect(res.status).toEqual(400);
        expect(res.body).toEqual('MasterProductNumbers array is required');
    });

    it('succeeds if valid MPNs are provided.', async () => {
        let body = {
            MasterProductNumbers: ["7259988", "7259992", "3521314"]
        };

        const res = await mockedRequestFactory(httpTrigger, body);

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual('object');
        expect(Object.keys(res.body).length).toEqual(body.MasterProductNumbers.length);
    });
});
