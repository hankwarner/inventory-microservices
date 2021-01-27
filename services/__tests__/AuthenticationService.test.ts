import { requestNewApigeeToken } from '../AuthenticationService';

const config = require('../../local.settings.json');

// Assigns env variables in local.settings.json to process.env
beforeAll(() => {
    process.env = Object.assign(process.env, {...config.Values});
});

describe('Get Apigee credentials', () => {

    it('wiil get a new Apigee access token', async () => {
        let response =  await requestNewApigeeToken();

        expect(response.accessToken).not.toBeNull();
        expect(response.accessTokenExpiresAt).toBeGreaterThan(new Date().getSeconds());
    });

});