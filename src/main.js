import {
    ping
} from './services';
import { getDefaultObject, extendObject, checkForExtension } from './helpers';
import { createHederaObject, checkTransaction } from './mps';

const supportedAPI = ['init', 'test', 'createhederaobject', 'checktransaction','createcontractobject']; // enlist all methods supported by API (e.g. `mw('event', 'user-login');`)
/**
 The main entry of the application
 */
const production = true;

function app(window) {
    console.log(ping);
    console.log('MPS-JS starting');
    let configurations = getDefaultObject(production);
    // all methods that were called till now and stored in queue
    // needs to be called now
    let globalObject = window[window['MPS-JS']];
    let queue = globalObject.q;
    console.log('aaaaaaaaaa', queue);
    if (queue) {
        for (var i = 0; i < queue.length; i++) {
            console.log('queue:');
            console.log(queue[i]);
            if (typeof queue[i][0] !== 'undefined' && queue[i][0].toLowerCase() == 'init') {
                console.log(queue[i][1]);
                configurations = extendObject(configurations, queue[i][1]);
                createHederaObject(configurations);
                console.log('MPS-JS started', configurations);
                checkForExtension(configurations)
            } else if(typeof queue[i][0] !== 'undefined' && queue[i][0].toLowerCase() == 'createcontractobject') {
                configurations = extendObject(configurations, queue[i][1]);
                apiHandler(configurations, queue[i][0], queue[i][1], queue[i][2]);
                checkForExtension(configurations)
            }else{
                console.log(queue);
                configurations = extendObject(configurations, queue[i][1]);
                apiHandler(configurations, queue[i][0], queue[i][1], queue[i][2]);
            }
        }
    }
    // override temporary (until the app loaded) handler
    // for widget's API calls
    globalObject = apiHandler;
    globalObject.configurations = configurations;
}

/**
 Method that handles all API calls
 */
export function apiHandler(configuration, api, params, callback = null) {
    console.log('call this');
    if (!api) throw Error('API method required');
    api = api.toLowerCase();
    if (supportedAPI.indexOf(api) === -1) throw Error(`Method ${api} is not supported`);
    console.log(`Handling API call ${api}`, params);
    switch (api) {
        // TODO: add API implementation

        case 'createhederaobject':
            return createHederaObject(params);

        case 'checktransaction':
            return checkTransaction({configuration, params}, callback);

        case 'createcontractobject':
            return createContractObject({configuration, params}, callback);

        case 'test':
            return params;
        default:
            console.warn(`No handler defined for ${api}`);
    }
}

function createContractObject(params) {
    let __construct = ['contractid', 'maximum', 'paymentserver', 'params', 'memo', 'abi','redirect','extensionid'];
    let object = {
        contractid: '0.0.1111',
        maximum: '422342343',
        paymentserver: params.configuration.paymentserver,
        params: ["869", "100000000", "216", "253", "27", "0x226b08976ad0dd982aeb6b21a44f3eacae579569c34e71725aff801a2fe68739", "0x333f991fa3a870575f819569e9f72a771ea790078d448cc8789120ee14abf3c5"],
        memo: 'a4a7c4329aab4b1fac474ff6f93d858c',
        abi: JSON.stringify({
            "constant": false,
            "inputs": [{"name": "propertyID", "type": "uint24"}, {"name": "amount", "type": "uint256"}, {
                "name": "x",
                "type": "uint16"
            }, {"name": "y", "type": "uint16"}, {"name": "v", "type": "uint8"}, {
                "name": "r",
                "type": "bytes32"
            }, {"name": "s", "type": "bytes32"}],
            "name": "buyProperty",
            "outputs": [{"name": "", "type": "string"}],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        }),
        redirect: JSON.stringify({
            "nonPayingAccount": "/insufficient-amount/",
            "noAccount": "/account-not-paired",
            "homePage": "/"
        }),
        extensionid: 'niajdeokpngbpgpmaolodhlgobpllajp',
    };
    let extended = extendObject(object, params.params);
    console.log(extended);
    let Contractobject = '<hedera-contract ';
    for (var i in __construct) {
        let node = __construct[i];
        if (extended.hasOwnProperty(node)) {
            Contractobject += "data-" + node + "= '" + extended[node] + "' , " + "\n";
        }
    }
    Contractobject += '></hedera-contract>';
    console.log(Contractobject);

    var body = document.getElementById(extended['attrID']);
    body.innerHTML += Contractobject;
    //console.log((Hederaobject))
    return Contractobject;
    //callback(Hederaobject);
}

app(window);

