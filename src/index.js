const Helper = require('./helpers');
const MPS = require('./mps');

function sumTest(a, b) {
    return a + b;
};

function getDefaultInitObject(production = true) {
    return Helper.getDefaultObject(production);
};

function MPSInit (params, production = true) {
    return MPS.init(params, production);
}

function MPSCheckTransaction (params) {
    return MPS.checkTransaction(
        { 
            configuration: getDefaultInitObject(),
            params,
        }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }});
}

module.exports = {
    sumTest,
    getDefaultInitObject,
    MPSInit,
    MPSCheckTransaction
};
