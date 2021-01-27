import { runStubFunctionFromBindings, createHttpTrigger } from 'stub-azure-function-context';
import { AzureFunction } from '@azure/functions';

// Mocks the Context object in an Azure HTTP function
export default async function mockedRequestFactory(azureFunc: AzureFunction, body) {
	return await runStubFunctionFromBindings(
		azureFunc,
		[
			{
				type: 'httpTrigger',
				name: 'req',
				direction: 'in',
				data: createHttpTrigger(
					'GET',
					'', // url
					{}, //headers
					{}, //params
					body, 
					{  } // query
				)
			},
			{ 
				type: 'http', 
				name: '$return', 
				direction: 'out' 
			}
		],
		new Date()
	)
}
