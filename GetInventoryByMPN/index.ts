import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { requestNewApigeeToken } from '../services/AuthenticationService';
import { getInventoryData, parseInventoryResponse } from '../services/ManhattanService';
import { Creds } from '../models/Creds';
import { logToTeams } from '../services/TeamsService';

let creds = new Creds();
const teamsUrl = process.env["ERROR_LOGS_URL"];

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Context["res"]> {
    try {
        context.log('req body ' + JSON.stringify(req.body));
        let mpns = req.body.MasterProductNumbers;

        if(typeof mpns != 'object'){
            return {
                status: 400,
                body: 'MasterProductNumbers must be an array'
            };
        }

        // Remove empty strings and duplicates
        let validMPNs = mpns.filter((mpn, i) => mpn.length && mpns.indexOf(mpn) == i);

        // Handle missing MPNs
        if(!validMPNs.length){
            return {
                status: 400,
                body: 'MasterProductNumbers array is required'
            };
        }

        // Request new token if the current one is expired
        if (!creds.accessToken || new Date().getSeconds() > creds.accessTokenExpiresAt){
            creds = await requestNewApigeeToken(context);
        }

        // Send inventory request to Manhattan
        const inventoryResponse = await getInventoryData(context, creds.accessToken, validMPNs);

        // // Parse response into JS object
        const inventory = await parseInventoryResponse(inventoryResponse, validMPNs);
        context.log('inventory response' + JSON.stringify(inventory));

        return {
            body: inventory,
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (e) {
        let title = 'Error in GetInventoryByMPN';
        context.log(`${title}: ${e}`);
        logToTeams(title, `${e.message}. Stacktrace: ${e.stack}`, 'red', teamsUrl);

        return {
            status: 500,
            body: 'Failure'
        };
    }
};

export default httpTrigger;