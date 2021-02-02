import { getInventoryData, parseLocationId, parseInventoryResponse, Inventory } from '../ManhattanService';
import { requestNewApigeeToken } from '../AuthenticationService';

const mpns = ['789420'];

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

describe('Get inventory data by branch number', () => {
    it('will parse a branch number from locationId string.', () => {
        let locationId = 'TR~W~311';

        let branch = parseLocationId(locationId);

        expect(branch).toEqual('311');
    });

    it('will create an inventory dictionary from array of item data.', async () => {
        let locationId = '311';
        let qty = 64209;
        let itemData = [
            {
                ItemId: mpns[0],
                LocationId: locationId,
                Quantity: qty
            }
        ];

        let inventory = await parseInventoryResponse(itemData, mpns);

        expect(inventory[mpns[0]][locationId]).toEqual(qty);
    });
    
    it('will retrieve inventory data from Manhattan API with an active access token.', async () => {
        let creds = await requestNewApigeeToken();

        let inventoryResponse = await getInventoryData(creds.accessToken, mpns);
        
        inventoryResponse.forEach(invLine => {
            expect(invLine.ItemId).toEqual(mpns[0]);
        });
    });
});
