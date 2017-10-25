/*
 HTCAP - beta 1
 Author: filippo.cavallarin@wearesegment.com

 This program is free software; you can redistribute it and/or modify it under
 the terms of the GNU General Public License as published by the Free Software
 Foundation; either version 2 of the License, or (at your option) any later
 version.
 */

// var system = require('system');
// var fs = require('fs');
var page = require('webpage')
    .create();

// window.page = page;
// window.fs = fs;


// phantom.injectJs('functions.js');
// phantom.injectJs('options.js');
// phantom.injectJs('constants.js');
// phantom.injectJs('probe.js');


// window.startTime = Date.now();

// window.response = null;

// var headers = {};

// var page_settings= {encoding: 'utf8'};
// var random = 'IsHOulDb34RaNd0MsTR1ngbUt1mN0t';

// var args = [];//getopt(system.args, 'A:R:x:ftX:HOPD:c:p:r:');

// args.opts.forEach(function(arg) {
//     switch (arg[0]) {

// case 'A': // -A <user agent> set user agent
//     options.userAgent = arg[1];
//     break;
// case 'R': // -R <string>     random string used to generate random values - the same random string will generate the same random values
//     options.random = arg[1];
//     break;
// case 'x': // -x <seconds>    maximum execution time
//     options.maxExecTime = parseInt(arg[1]) * 1000;
//     break;
//
// case 'f': // -f do NOT fill values in forms
//     options.fillValues = false;
//     break;
// case 't': // -t do NOT trigger events (onload only)
//     options.triggerEvents = false;
//     break;
// case 'X': // -X comma separated list of excluded urls
//     options.excludedUrls = arg[1].split(',');
//     break;
// case 'O': // -O do NOT override timeout functions
//     options.overrideTimeoutFunctions = false;
//     break;
//
// case 'c': // -c <path> set cookies from file (json)
//     try {
//         var cookie_file = fs.read(arg[1]);
//         options.cookies = JSON.parse(cookie_file);
//     } catch (e) {
//         console.log(e);
//         phantom.exit(1);
//     }
//     break;
//
// case 'r': // -r <url> set referer
//     options.referer = arg[1];
//     break;
//
// case 'p': // -p <user:pass>  http auth
//     var arr = arg[1].split(':');
//     options.httpAuth = [arr[0], arr.slice(1)
//         .join(':')];
//     break;

// case 'P': // -P load page with POST
//     page_settings.operation = 'POST';
//     break;
// case 'D': // -D POST data
//     page_settings.data = arg[1];
//     break;
//     }
// });

// var site = args.args[1];
//
// if (site.length < 4 || site.substring(0, 4)
//         .toLowerCase() !== 'http') {
//     site = 'http://' + site;
// }

// console.log('[');

/* maximum execution time */
setTimeout(execTimedOut, options.maxExecTime);


// phantom.onError = function(msg, trace) {
//     var msgStack = ['PHANTOM ERROR: ' + msg];
//     if (trace && trace.length) {
//         msgStack.push('TRACE:');
//         trace.forEach(function(t) {
//             msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function + ')' : ''));
//         });
//     }
//     console.error(msgStack.join('\n'));
//     phantom.exit(1);
// };


// page.onConsoleMessage = function(msg, lineNum, sourceId) {
// };
// page.onError = function(msg, lineNum, sourceId) {
// };
// page.onAlert = function(msg) {
// };

// page.settings.userAgent = options.userAgent;
// page.settings.loadImages = false;


// page.onResourceReceived = function(resource) {
//     if (window.response === null) {
//         window.response = resource;
//
//     }
// };


// page.onResourceRequested = function(requestData, networkRequest) {
//     //console.log(JSON.stringify(requestData))
// };

// to detect window.location= / document.location.href=
page.onNavigationRequested = function(url, type) {

    if (page.navigationLocked === true) {
        page.evaluate(function(url, type) {
            if (type === 'LinkClicked') {
                return;
            }

            if (type === 'Other' && url !== 'about:blank') {
                window.__PROBE__.printLink(url);
            }

        }, url, type);
    }


    // allow the navigation if only the hash is changed
    if (page.navigationLocked === true && compareUrls(url, site)) {
        page.navigationLocked = false;
        page.evaluate(function(url) {
            document.location.href = url;
        }, url);
    }

    page.navigationLocked = true;
};

// page.onConfirm = function() {
//     return true;
// }; // recently changed

/*
 phantomjs issue #11684 workaround
 https://github.com/ariya/phantomjs/issues/11684
 */
// var isPageInitialized = false;
// page.onInitialized = function() {
//     if (isPageInitialized) {
//         return;
//     }
//     isPageInitialized = true;

// // try to hide phantomjs
// page.evaluate(function() {
//     window.__callPhantom = window.callPhantom;
//     delete window.callPhantom;
// });

// startProbe(options.random);

// };


// page.onCallback = function(data) {
//     switch (data.cmd) {
//         case 'print':
//             console.log(data.argument);
//             break;
//
//         case 'end':
//             page.evaluate(function() {
//                 window.__PROBE__.printRequests();
//             });
//
//             printStatus('ok');
//             phantom.exit(0);
//             break;
//     }
// };

// if (options.httpAuth) {
//     headers['Authorization'] = 'Basic ' + btoa(options.httpAuth[0] + ':' + options.httpAuth[1]);
// }

if (options.referer) {
    headers['Referer'] = options.referer;
}

// page.customHeaders = headers;


// for (var a = 0; a < options.setCookies.length; a++) {
//     // maybe this is wrogn acconding to rfc .. but phantomjs cannot set cookie witout a domain...
//     if (!options.setCookies[a].domain) {
//         var purl = document.createElement('a');
//         purl.href = site;
//         options.setCookies[a].domain = purl.hostname;
//     }
//     if (options.setCookies[a].expires) {
//         options.setCookies[a].expires *= 1000;
//     }
//
//     phantom.addCookie(options.setCookies[a]);
//
// }

// page.viewportSize = {
//     width: 1920,
//     height: 1080,
// };

// page.open(site, page_settings, function(status) {
//     var response = window.response; // just to be clear
//     if (status !== 'success') {
// var mess = '';
// var out = {response: response};
// if (!response || response.headers.length === 0) {
//     printStatus('error', 'load');
//     phantom.exit(1);
// }

// check for redirect first
// for (var a = 0; a < response.headers.length; a++) {
//     if (response.headers[a].name.toLowerCase() === 'location') {
//
//         printCookies();
//         printStatus('ok', null, null, response.headers[a].value);
//         phantom.exit(0);
//     }
// }

// assertContentTypeHtml(response);
//
// phantom.exit(1);
}


// printCookies();
//
// assertContentTypeHtml(response);

// page.evaluate(function() {
//     // console.log('startAnalysis');
//     // starting page analysis
//     // console.log('page initialized ');
//
//     window.__PROBE__.startAnalysis();
// });


// });

function compareUrls(url1, url2, includeHash) {
    var a1 = document.createElement('a');
    var a2 = document.createElement('a');
    a1.href = url1;
    a2.href = url2;

    var eq = (a1.protocol === a2.protocol && a1.host === a2.host && a1.pathname === a2.pathname && a1.search === a2.search);

    if (includeHash) {
        eq = eq && a1.hash === a2.hash;
    }

    return eq;
}


// function printCookies() {
// console.log('["cookies",' + JSON.stringify(phantom.cookies) + '],');
// }


// function printStatus(status, errcode, message, redirect) {
//     var o = {status: status};
//     if (status === 'error') {
//         o.code = errcode;
//         switch (errcode) {
//             case 'load':
//                 break;
//             case 'contentType':
//                 o.message = message;
//                 break;
//             case 'requestTimeout':
//                 break;
//             case 'probe_timeout':
//                 break;
//         }
//     }
//     if (redirect) {
//         o.redirect = redirect;
//     }
//     // o.time = Math.floor((Date.now() - window.startTime) / 1000);
//     console.log(JSON.stringify(o));
//     // console.log(']');
// }


function execTimedOut() {
    if (!response || response.headers.length === 0) {
        printStatus('error', 'requestTimeout');
        phantom.exit(0);
    }
    printStatus('error', 'probe_timeout');
    phantom.exit(0);

}


// function assertContentTypeHtml(response) {
//     if (response.contentType.toLowerCase()
//             .split(';')[0] !== 'text/html') {
//         printStatus('error', 'contentType', 'content type is ' + response.contentType); // escape response.contentType???
//         phantom.exit(0);
//     }
// }
