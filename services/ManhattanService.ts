import { apigee } from './Api';
import { logToTeams } from './TeamsService';

const teamsUrl = process.env["ERROR_LOGS_URL"];

const getInventoryData = async (context, accessToken, mpns) => {
    try {
        context.log('getInventoryData start');

        let config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Content-Length': 'application/json'
            }
        };
        let body = {
            Items: mpns,
            ViewName: 'Supply~Website'
        };

        let invResponse = await apigee()
            .post('v1.1/dom/inventory/api/availability/location/availabilitydetail', body, config);

        context.log(`Response status: ${invResponse.data.statusCode}`);
        context.log('getInventoryData finish');

        return invResponse.data.data;

    } catch (e) {
        let title = 'Error in getInventoryData';
        context.log(`${title}: ${e}`);
        logToTeams(title, `${e.message}. Stacktrace: ${e.stack}`, 'red', teamsUrl);
        throw e;
    }
}

const parseInventoryResponse = async (inventoryResponse, mpns) => {
    let inventory = {};

    // Add mpns to inventory object
    mpns.forEach(mpn => inventory[mpn] = {});
    
    // ItemId = mpn, LocationId split on ~
    inventoryResponse.forEach(invLine => {
        let mpn = invLine.ItemId;
        let branch = parseLocationId(invLine.LocationId);
        let qty = parseInt(invLine.Quantity);

        inventory[mpn][branch] = qty;
    });
    
    return inventory;
}

// Parses the LocationId in format 'TR~W~####' and returns the branch number
const parseLocationId = (locationId) => {
    var loctionArr = locationId.split('~');

    return loctionArr[loctionArr.length - 1];
}

export { getInventoryData, parseInventoryResponse };