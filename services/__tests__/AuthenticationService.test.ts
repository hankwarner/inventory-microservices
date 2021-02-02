import { requestNewApigeeToken } from '../AuthenticationService';

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

describe('Get Apigee credentials', () => {

    it('wiil get a new Apigee access token', async () => {
        let response =  await requestNewApigeeToken();

        expect(response.accessToken).not.toBeNull();
        expect(response.accessTokenExpiresAt).toBeGreaterThan(new Date().getSeconds());
    });

});