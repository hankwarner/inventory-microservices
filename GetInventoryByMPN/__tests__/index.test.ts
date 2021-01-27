import httpTrigger from '../index';
import mockedRequestFactory from '../utils/MockedRequestFactory';

const config = require('../../local.settings.json');

// Assigns env variables in local.settings.json to process.env
beforeAll(() => {
    process.env = Object.assign(process.env, {...config.Values});
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
