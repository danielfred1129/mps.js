export function getDefaultObject(production = true) {
    return {
        paymentserver: production ? "https://mps.hashingsystems.com" : 'http://localhost:9999',
        extensionid: "ligpaondaabclfigagcifobaelemiena",
        error: "/no-extension",
        type: "article",
        time: Date.now(),
        redirect: '{"nonPayingAccount": "/insufficient-amount/", "noAccount": "/account-not-paired/", "homePage": "/"}',
        // this might make a good default id for the content
        id: "/",
        submissionnode: "0.0.11",
        memo: Date.now(),
        //redirect:'{ "nonPayingAccount": "/insufficient-amount/", "noAccount": "/account-not-paired/", "homePage": "/" }',
    };
}

export function extendObject(a, b) {
    for (var key in b)
        if (b.hasOwnProperty(key)) a[key] = b[key];
    return a;
}

// checkForExtension handles 3 scenarios
// returns true (hedera-micropayment tag is present and extension is installed)
// returns false (hedera-micropayment tag is present but extension is NOT installed)
// return null (hedera-micropayment is not present because this website does not implement hedera-micropayment)
export function checkForExtension(configurations) {
    if (!isChrome()) {
        redirectToError('/isnotChrome');
    } else {
        let tags = configurations;
        // if tags.amount is null or undefined, we should assume that this is a free page and do nothing more
        if (tags.amount === null) return null;
        console.log(tags.amount);
        const EXTENSION_ID = tags.extensionid;

        detect(EXTENSION_ID, function () {
            redirectToError(tags.error);
        }, function (response) {
            console.log('detect: user has extension installed');
            // recordResponse(response);
        });

        //console.log(chrome.runtime.connect(EXTENSION_ID,'version'));
        /*chrome.runtime.sendMessage(EXTENSION_ID, 'version', response => {
            console.log(response)
            return;
            if (!response) {
                redirectToError(tags.error);
            } else {
                recordResponse(response);
            }
        })*/
    }
}

function detect(extensionId, notInstalledCallback, installedCallback) {
    var img = new Image();
    img.onerror = notInstalledCallback;
    img.onload = installedCallback('installed');
    img.src = 'chrome-extension://' + extensionId + '/icons/icon16.png';
}

function recordResponse(res) {
    if (typeof res != 'undefined') {
        var body = document.getElementsByTagName('body');
        body.innerHTML += '<div style="width:100%;height:5%;opacity:0.3;z-index:100;background:yellow;">' + res + '</div>';
        return true;
    }
    return false;
}

function redirectToError(err) {
    if (window.location.pathname != err) {
        window.location.replace(window.origin + err);
    }
}

function isChrome() {
    return 'chrome' in window
}
