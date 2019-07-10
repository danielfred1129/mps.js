import { getDefaultObject, extendObject, checkForExtension } from './helpers';

export function init(params, production = true) {
    const configurations = extendObject(getDefaultObject(production), params);
    createHederaObject(configurations);
    checkForExtension(configurations);
}

export function createHederaObject(params) {
    console.log('run createhedera', params);
    let object = ['submissionnode', 'paymentserver', 'recipientlist', 'contentid', 'type', 'memo', 'extensionid', 'redirect', 'time'];
    console.log(object);
    let Hederaobject = '<hedera-micropayment ';
    for (var i in object) {
        let node = object[i];
        if (params.hasOwnProperty(node)) {
            Hederaobject += "data-" + node + "= '" + params[node] + "' , " + "\n";
        }
    }
    Hederaobject += '></hedera-micropayment>';
    console.log(Hederaobject);

    var body = document.getElementById(params['attrID']);
    body.innerHTML += Hederaobject;
    //console.log((Hederaobject))
    return Hederaobject;
    //callback(Hederaobject);
}

export function checkTransaction(params, callback, production = true) {

    console.log("in check trans")
    let memo_id = params.configuration.memo;
    let url = production ? "https://mps.hashingsystems.com" : 'http://localhost:9999';
    let structure = {
        baseurl: url,
        memo_id: memo_id,
        receiver_id: '',
        success: '/success',
        failure: '/payment-failed',
        timeout: 3000,
        limit:1
    };

    for (var key in params.params) {
        if (params.params.hasOwnProperty(key) && params.params[key]) {
            structure[key] = params.params[key];
        }
    }

    if (structure.receiver_id && structure.memo_id) {
        URL = structure.baseurl + "/check/" + structure.receiver_id + "/" + structure.memo_id
    } else {
        URL = structure.baseurl + "/memo/" + structure.memo_id+'?limit='+structure.limit;
    }
    console.log(structure.timeout);
    //setTimeout(performRequest(structure), structure.timeout)
    setTimeout(function () {
        performRequest(structure);
    }, structure.timeout);
}

var performRequest = function (structure) {
    console.log(structure)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let response = JSON.parse(this.response);
                console.log(response);
                if (response.response.length > 0) {
                    /*window.open(
                        window.origin + structure.success,
                        '_blank'
                    );*/
                    //window.location.replace(window.origin + structure.success);
                } else {
                    //window.location.replace(window.origin + structure.failure);
                }
                //window.location.replace(window.origin + structure.success);
                //callback(null, this.response);
            } else {
                //callback({error: true, data: this.response}, null);
                window.location.replace(window.origin + structure.failure);
            }
        }
    };
    xhttp.open("GET", URL, true);
    xhttp.send();
};

