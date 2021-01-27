import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { requestNewApigeeToken } from '../services/AuthenticationService';
import { getInventoryData, parseInventoryResponse, Inventory } from '../services/ManhattanService';
import { ApigeeCreds } from '../models/ApigeeCreds';
import { logToTeams } from '../services/TeamsService';

let creds = new ApigeeCreds();
const teamsUrl = process.env["ERROR_LOGS_URL"];

interface Response {
    status: number;
    headers?: {
      [key: string]: string
    }
    body: Inventory | string;
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<Response> {
    try {
        context.log('request body ' + JSON.stringify(req.body));
        let mpns: string[] = req.body.MasterProductNumbers;

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
        const inventoryResponse = await getInventoryData(creds.accessToken, validMPNs, context);

        // // Parse response into JS object
        const inventory = await parseInventoryResponse(inventoryResponse, validMPNs);
        context.log('inventory response' + JSON.stringify(inventory));

        return {
            body: inventory,
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (e) {
        let title = 'Error in GetInventoryByMPN';
        context.log.error(`${title}: ${e}`);
        logToTeams(title, `${e.message}. Stacktrace: ${e.stack}`, 'red', teamsUrl);

        return {
            status: 500,
            body: 'Failure'
        };
    }
};

export default httpTrigger;
