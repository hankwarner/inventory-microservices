import { requestNewApigeeToken } from '../AuthenticationService';

// Assigns env variables in local.settings.json to process.env
if(process.env.NODE_ENV == 'test'){
    let configValues = require('../../local.settings.json').Values;

    beforeAll(() => {
        process.env = Object.assign(process.env, configValues);
    });
}

describe('Get Apigee credentials', () => {

    it('wiil get a new Apigee access token', async () => {
        let response =  await requestNewApigeeToken();

        expect(response.accessToken).not.toBeNull();
        expect(response.accessTokenExpiresAt).toBeGreaterThan(new Date().getSeconds());
    });

});