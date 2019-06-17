(function (_h, a, s, h, g, ra, ph) {
    _h['MPS-JS'] = h;
    _h[h] = _h[h] || function () {
        (_h[h].q = _h[h].q || []).push(arguments)
    };
    ra = a.createElement(s),
        ph = a.getElementsByTagName(s)[0];
    ra.id = h;
    ra.src = g;
    ra.async = 1;
    console.log(ra);
    console.log(ph);
    ph.parentNode.insertBefore(ra, ph);
}(window, document, 'script', 'mw', '/javascripts/widget.js'));

mw('init',
    {
        submissionnode: "0.0.11",
        recipientlist: '[{ "to": "0.0.1761", "tinybars": "4666667" }]',
        contentid: '79',
        type: 'article',
        memo: '1275,79',
        redirect: '{ "nonPayingAccount": "/insufficient-amount/", "noAccount": "/account-not-paired/", "homePage": "/" }',
        time: "1559313345",
        attrID: 'feature-4',
    }
);