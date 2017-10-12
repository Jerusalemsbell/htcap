/*
 HTCAP - beta 1
 Author: filippo.cavallarin@wearesegment.com

 This program is free software; you can redistribute it and/or modify it under
 the terms of the GNU General Public License as published by the Free Software
 Foundation; either version 2 of the License, or (at your option) any later
 version.
 */

// @todo error on Unknown option ds
function getopt(arguments, optstring) {
    var args = arguments.slice();
    var ret = {
        opts: [],
        args: args
    };

    var m = optstring.match(/[a-zA-Z]:*/g);
    for (var a = 0; a < m.length; a++) {
        var ai = args.indexOf("-" + m[a][0]);
        if (ai > -1) {
            if (m[a][1] == ":") {
                if (args[ai + 1]) {
                    ret.opts.push([m[a][0], args[ai + 1]]);
                    args.splice(ai, 2);
                } else {
                    // Error: log and kill
                    console.log("Error: " + args);
                    phantom.exit(-1);
                }
            } else {
                ret.opts.push([m[a][0]]);
                args.splice(ai, 1);
            }
        }
    }

    return ret;
}


function compareUrls(url1, url2, includeHash) {
    var a1 = document.createElement("a");
    var a2 = document.createElement("a");
    a1.href = url1;
    a2.href = url2;

    var eq = (a1.protocol === a2.protocol && a1.host === a2.host && a1.pathname === a2.pathname && a1.search === a2.search);

    if (includeHash) eq = eq && a1.hash === a2.hash;

    return eq;
}


function printCookies() {
    console.log('["cookies",' + JSON.stringify(phantom.cookies) + "],");
}


function printStatus(status, errcode, message, redirect) {
    var o = {status: status};
    if (status === "error") {
        o.code = errcode;
        switch (errcode) {
            case "load":
                break;
            case "contentType":
                o.message = message;
                break;
            case "requestTimeout":
                break;
            case "probe_timeout":
                break;
        }
    }
    if (redirect) o.redirect = redirect;
    o.time = Math.floor((Date.now() - window.startTime) / 1000);
    console.log(JSON.stringify(o));
    console.log("]")
}


function execTimedOut() {
    if (!response || response.headers.length === 0) {
        printStatus("error", "requestTimeout");
        phantom.exit(0);
    }
    printStatus("error", "probe_timeout");
    phantom.exit(0);

}

// generates PSEUDO random values. the same seed will generate the same values
function generateRandomValues(seed) {
    var values = {};
    var letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var numbers = "0123456789";
    var symbols = "!#&^;.,?%$*";
    var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var years = ["1982", "1989", "1990", "1994", "1995", "1996"];
    var names = ["james", "john", "robert", "michael", "william", "david", "richard", "charles", "joseph", "thomas", "christopher", "daniel", "paul", "mark", "donald", "george", "kenneth"];
    var surnames = ["anderson", "thomas", "jackson", "white", "harris", "martin", "thompson", "garcia", "martinez", "robinson", "clark", "rodriguez", "lewis", "lee", "walker", "hall"];
    var domains = [".com", ".org", ".net", ".it", ".tv", ".de", ".fr"];

    var randoms = [];
    var randoms_i = 0;

    for (var a = 0; a < seed.length; a++) {
        var i = seed[a].charCodeAt(0);
        randoms.push(i);
    }

    var rand = function (max) {
        var i = randoms[randoms_i] % max;
        randoms_i = (randoms_i + 1) % randoms.length;
        return i;
    };

    var randarr = function (arr, len) {
        var r;
        var ret = "";
        for (var a = 0; a < len; a++) {
            r = rand(arr.length - 1);
            ret += arr[r];
        }
        return ret;
    };

    var generators = {
        string: function () {
            return randarr(letters, 8);
        },
        number: function () {
            return randarr(numbers, 3);
        },
        month: function () {
            return randarr(months, 1);
        },
        year: function () {
            return randarr(years, 1);
        },
        date: function () {
            return generators.year() + "-" + generators.month() + "-" + generators.month();
        },
        color: function () {
            return "#" + randarr(numbers, 6);
        },
        week: function () {
            return generators.year() + "-W" + randarr(months.slice(0, 6), 1);
        },
        time: function () {
            return generators.month() + ":" + generators.month();
        },
        datetimeLocal: function () {
            return generators.date() + "T" + generators.time();
        },
        domain: function () {
            return randarr(letters, 12).toLowerCase() + randarr(domains, 1);
        },
        email: function () {
            return randarr(names, 1) + "." + generators.surname() + "@" + generators.domain();
        },
        url: function () {
            return "http://www." + generators.domain();
        },
        humandate: function () {
            return generators.month() + "/" + generators.month() + "/" + generators.year();
        },
        password: function () {
            return randarr(letters, 3) + randarr(symbols, 1) + randarr(letters, 2) + randarr(numbers, 3) + randarr(symbols, 2);
        },
        surname: function () {
            return randarr(surnames, 1);
        },
        firstname: function () {
            return randarr(names, 1);
        },
        tel: function () {
            return "+" + randarr(numbers, 1) + " " + randarr(numbers, 10)
        }
    };

    for (var type in generators) {
        values[type] = generators[type]();
    }

    return values;

}


function startProbe(random) {
    // generate a static map of random values using a "static" seed for input fields
    // the same seed generates the same values
    // generated values MUST be the same for all analyze.js call othewise the same form will look different
    // for example if a page sends a form to itself with input=random1,
    // the same form on the same page (after first post) will became input=random2
    // => form.data1 != form.data2 => form.data2 is considered a different request and it'll be crawled.
    // this process will lead to and infinite loop!
    var inputValues = generateRandomValues(random);

    // adding constants to page
    page.evaluate(function (__HTCAP) {
        window.__HTCAP = __HTCAP;
    }, window.__HTCAP);

    page.evaluate(initProbe, options, inputValues);

    page.evaluate(function (options) {

        Node.prototype.__originalAddEventListener = Node.prototype.addEventListener;
        Node.prototype.addEventListener = function () {
            if (arguments[0] !== "DOMContentLoaded") { // is this ok???
                window.__PROBE__.addEventToMap(this, arguments[0]);
            }
            this.__originalAddEventListener.apply(this, arguments);
        };

        window.__originalAddEventListener = window.addEventListener;
        window.addEventListener = function () {
            if (arguments[0] !== "load") { // is this ok???
                window.__PROBE__.addEventToMap(this, arguments[0]);
            }
            window.__originalAddEventListener.apply(this, arguments);
        };

        XMLHttpRequest.prototype.__originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {

            var _url = window.__PROBE__.removeUrlParameter(url, "_");
            this.__request = new window.__PROBE__.Request("xhr", method, _url);

            // adding XHR listener
            this.addEventListener('readystatechange', function () {
                // if not finish, it's open
                // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/readyState
                if (this.readyState >= 1 && this.readyState < 4) {
                    window.__PROBE__.eventLoopManager.sentXHR(this);
                } else if (this.readyState === 4) {
                    // /!\ DONE means that the XHR finish but could have FAILED
                    window.__PROBE__.eventLoopManager.doneXHR(this);
                }
            });
            this.addEventListener('error', function () {
                window.__PROBE__.eventLoopManager.inErrorXHR(this);
            });
            this.addEventListener('abort', function () {
                window.__PROBE__.eventLoopManager.inErrorXHR(this);
            });
            this.addEventListener('timeout', function () {
                window.__PROBE__.eventLoopManager.inErrorXHR(this);
            });

            this.timeout = options.XHRTimeout;

            return this.__originalOpen(method, url, async, user, password);
        };

        XMLHttpRequest.prototype.__originalSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function (data) {
            this.__request.data = data;
            this.__request.triggerer = window.__PROBE__.getLastTriggerPageEvent();

            var absurl = window.__PROBE__.getAbsoluteUrl(this.__request.url);
            for (var a = 0; a < options.excludedUrls.length; a++) {
                if (absurl.match(options.excludedUrls[a])) {
                    this.__skipped = true;
                }
            }

            // check if request has already been sent
            var requestKey = this.__request.key;
            if (window.__PROBE__.sentXHRs.indexOf(requestKey) !== -1) {
                return;
            }

            window.__PROBE__.sentXHRs.push(requestKey);
            window.__PROBE__.addToRequestToPrint(this.__request);

            if (!this.__skipped)
                return this.__originalSend(data);
        };

        Node.prototype.__originalAppendChild = Node.prototype.appendChild;
        Node.prototype.appendChild = function (node) {
            window.__PROBE__.printJSONP(node);
            return this.__originalAppendChild(node);
        };

        Node.prototype.__originalInsertBefore = Node.prototype.insertBefore;
        Node.prototype.insertBefore = function (node, element) {
            window.__PROBE__.printJSONP(node);
            return this.__originalInsertBefore(node, element);
        };

        Node.prototype.__originalReplaceChild = Node.prototype.replaceChild;
        Node.prototype.replaceChild = function (node, oldNode) {
            window.__PROBE__.printJSONP(node);
            return this.__originalReplaceChild(node, oldNode);
        };

        window.WebSocket = (function (WebSocket) {
            return function (url) {
                window.__PROBE__.printWebsocket(url);
                return WebSocket.prototype;
            }
        })(window.WebSocket);

        if (options.overrideTimeoutFunctions) {
            window.__originalSetTimeout = window.setTimeout;
            window.setTimeout = function () {
                // Forcing a delay of 0
                arguments[1] = 0;
                return window.__originalSetTimeout.apply(this, arguments);
            };

            window.__originalSetInterval = window.setInterval;
            window.setInterval = function () {
                // Forcing a delay of 0
                arguments[1] = 0;
                return window.__originalSetInterval.apply(this, arguments);
            };

        }

        HTMLFormElement.prototype.__originalSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function () {
            window.__PROBE__.addToRequestToPrint(window.__PROBE__.getFormAsRequest(this));
            return this.__originalSubmit();
        };

        // prevent window.close
        window.close = function () {
        };

        window.open = function (url) {
            window.__PROBE__.printLink(url);
        };

        // create an observer instance for DOM changes
        var observer = new WebKitMutationObserver(function (mutations) {
            window.__PROBE__.eventLoopManager.nodeMutated(mutations);
        });
        var eventAttributeList = ['src', 'href'];
        window.__HTCAP.mappableEvents.forEach(function (event) {
            eventAttributeList.push('on' + event);
        });
        // observing for any change on document and its children
        observer.observe(document.documentElement, {
            childList: true,
            attributes: true,
            characterData: false,
            subtree: true,
            characterDataOldValue: false,
            attributeFilter: eventAttributeList
        });

    }, options);

}


function assertContentTypeHtml(response) {
    if (response.contentType.toLowerCase().split(";")[0] !== "text/html") {
        printStatus("error", "contentType", "content type is " + response.contentType); // escape response.contentType???
        phantom.exit(0);
    }
}
