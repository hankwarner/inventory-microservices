import { apigee } from './Api';
import { logToTeams } from './TeamsService';
import { Creds } from '../models/Creds';

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

        let response = await apigee().post('v1/manh-idp/token', params, config);

        // Unix timestamp when the token was issued
        let accessTokenIssuedAt = new Date(parseInt(response.data.issued_at));

        // Add number of seconds that the token will expire in to the issuedAt date to get the time when the token will expire
        let accessTokenExpiresIn = response.data.expires_in;
        let accessTokenExpiresAt = accessTokenIssuedAt.setSeconds(accessTokenExpiresIn);

        context.log('requestNewApigeeToken finish');
        return {
            accessToken: response.data.access_token,
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
