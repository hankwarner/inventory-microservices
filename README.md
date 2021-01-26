# Description

Azure Function App containing microservices to get live inventory data for specific products and Ferguson locations.

## Prerequisites

In order to build the TypeScript compiler, ensure that you have Git and Node.js installed.

[Download Node.js here](https://nodejs.org/en/download/)


If this is your first time using TypeScript, install it globally so the `tsc` command can be used:

```
npm install -g typescript
```

[TypeScript documentation](https://www.typescriptlang.org/docs/)

[npm Typescript](https://www.npmjs.com/package/typescript)


## Setup

#### Install dependencies: 

```
npm install
```

#### Start Function App: 

```
npm start
```


## CI/CD workflow and Pull Request instructions

1. Create a new branch with a name suitable for the code being added/refactored.

2. Send initial pull request to the **test** branch. Once merged, a build & deploy action in **Debug** configuration will be triggered to the _inventory-microservice-test_ function app.

3. Once approved in test, the next pull request should be sent to the **staging** branch. Once merged, a build & deploy action in **Release** configuration will be triggered to the _inventory-microservice_ staging environment (a deployment slot in the production function app). 

4. Once approved in staging, the final pull request should be sent to the **master** branch. Once merged, a build & deploy action in **Release** configuration will be triggered to the _inventory-microservice_ production environment.


# Using with VS Code

### Recommended VS Code extensions: 

* [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
* [Azure App Service](https://code.visualstudio.com/docs/azure/remote-debugging)


### Debugging

* If you have the Azure App Service extention installed, follow the steps outlined in [this article](https://code.visualstudio.com/docs/azure/remote-debugging) to start a debugging session. 


* If you do not have the above extensions, add the following to a `launch.json` config file in your `.vscode/` folder.

```
{
    "version": "0.2.0",
    "configurations": [
        
        {
            "name": "Attach to Node Functions",
            "type": "node",
            "request": "attach",
            "port": 9229,
            "preLaunchTask": "func: host start"
        }
    ]
}
```


# Functions

## GetInventoryByMPN

Retrieves real-time inventory for a specified number of master product numbers from the Manhattan API service.


## Route

`https://inventory-microservice.azurewebsites.net/api/inventory`


### Accepts

`application/json`


### Returns

`application/json`


### Params

`code`: function or host key for authentication purposes.


### Request

Request body should be a JSON object with a `MasterProductNumbers` property containing an array of strings which represent valid MPN's. 

```
{
   "MasterProductNumbers": string[]
}
```

#### Example Request

```
{
   "MasterProductNumbers": ["7259992", "3521314"]
}
```


### Response

Returns a JSON object where MPN is the outer key, and value is a JSON object where branch number is the key, and value is the inventory quantity.

#### Example Response

```
{
    "7259988": {
        "192": 0,
        "196": 2,
        "215": 2,
        "226": 2,
        "227": 4,
        "228": 2,
        "321": 129,
        "361": 4,
        "400": 2,
        "423": 75,
        "454": 1,
    },
    "7259992": {
        "321": 62,
        "361": 3,
        "400": 2,
        "423": 77,
        "454": 0,
        "474": 44,
        "480": 2,
        "482": 0,
        "501": 6,
    }
}
```
