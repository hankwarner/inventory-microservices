import httpTrigger from '../index';
import mockedRequestFactory from '../utils/MockedRequestFactory';

// Assigns env variables in local.settings.json to process.env
let configValues;
if(process.env.NODE_ENV == 'test'){
    configValues = require('../../local.settings.json').Values;

} else { // use values set in Github secrets
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
