import { apigee } from './Api';
import { logToTeams } from './TeamsService';
import { Creds } from '../models/Creds';

const retry = require('async-retry');
const teamsUrl = process.env["ERROR_LOGS_URL"];

const requestNewApigeeToken = async (context): Promise<Creds> => {
    try {
        context.log('requestNewApigeeToken start');

        let params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', process.env["GRANT_USER"]);
        params.append('password', process.env["GRANT_PW"]);

        let config = {
            headers: {
                'Authorization': 'Basic ' + process.env["ENCODED_CREDS"],
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let apigeeResponse = await retry(async () => {
            return await apigee().post('v1/manh-idp/token', params, config);
        }, { retries: 5 });

        // Unix timestamp when the token was issued
        let accessTokenIssuedAt = new Date(parseInt(apigeeResponse.data.issued_at));

        // Add number of seconds that the token will expire in to the issuedAt date to get the time when the token will expire
        let accessTokenExpiresIn = apigeeResponse.data.expires_in;
        let accessTokenExpiresAt = accessTokenIssuedAt.setSeconds(accessTokenExpiresIn);

        context.log('requestNewApigeeToken finish');

        return {
            accessToken: apigeeResponse.data.access_token,
            accessTokenExpiresAt: accessTokenExpiresAt
        }
        
    } catch (e) {
        let title = 'Error in requestNewApigeeToken';
        context.log(`${title}: ${e}`);
        logToTeams(title, `${e.message}. Stacktrace: ${e.stack}`, 'red', teamsUrl);
        throw e;
    }
}

export { requestNewApigeeToken };
