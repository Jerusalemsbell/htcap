(function() {
    'use strict';

    exports.messageEvent = {
        eventLoopReady: {
            from: 'htcap',
            name: 'event-loop-ready',
        },
    };

    exports.eventLoop = {
        bufferCycleSize: 100, // number of event loop cycle between every new action proceed in the eventLoop
        afterEventTriggeredTimeout: 1, // after triggering an event, time in ms to wait before requesting another eventLoop cycle
        afterDoneXHRTimeout: 10, // after a done XHR, time in ms to before requesting another eventLoop cycle
    };

    exports.mappableEvents = [
        'abort', 'autocomplete', 'autocompleteerror', 'beforecopy', 'beforecut', 'beforepaste', 'blur',
        'cancel', 'canplay', 'canplaythrough', 'change', 'click', 'close', 'contextmenu', 'copy', 'cuechange',
        'cut', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',
        'durationchange', 'emptied', 'ended', 'error', 'focus', 'input', 'invalid', 'keydown', 'keypress',
        'keyup', 'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'mousedown', 'mouseenter',
        'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'paste', 'pause',
        'play', 'playing', 'progress', 'ratechange', 'reset', 'resize', 'scroll', 'search', 'seeked',
        'seeking', 'select', 'selectstart', 'show', 'stalled', 'submit', 'suspend', 'timeupdate', 'toggle',
        'volumechange', 'waiting', 'webkitfullscreenchange', 'webkitfullscreenerror', 'wheel',
    ];

    /* always trigger these events since event delegation mays "confuse" the triggering of mapped events */
    exports.triggerableEvents = {
        'button': ['click', 'keyup', 'keydown'],
        'select': ['change', 'click', 'keyup', 'keydown'],
        'input': ['change', 'click', 'blur', 'focus', 'keyup', 'keydown'],
        'a': ['click', 'keyup', 'keydown'],
        'textarea': ['change', 'click', 'blur', 'focus', 'keyup', 'keydown'],
        'span': ['click'],
        'td': ['click'],
    };

    // map input names to string generators. see generateRandomValues to see all available generators
    exports.inputNameMatchValue = [ // regexps NEED to be string to get passed to phantom page
        {name: 'mail', value: 'email'},
        {name: '((number)|(phone))|(^tel)', value: 'number'},
        {name: '(date)|(birth)', value: 'humandate'},
        {name: '((month)|(day))|(^mon$)', value: 'month'},
        {name: 'year', value: 'year'},
        {name: 'url', value: 'url'},
        {name: 'firstname', value: 'firstname'},
        {name: '(surname)|(lastname)', value: 'surname'},
    ];

    exports.XHRTimeout = 5000;

    exports.viewport = {width: 1920, height: 1080};

})();