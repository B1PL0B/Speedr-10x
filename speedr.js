// ==UserScript==
// @name            Speedr 10x
// @version         1.0.0
// @description     Speeds up page timers by 10x to skip ads, accelerate videos, and bypass waiting times
// @include         *
// @require         
// @author          B1PL0B (Based on TimerHooker by Tiger 27)
// @match           http://*/*
// @match           https://*/*
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-or-later
// @namespace       https://github.com/B1PL0B/Speedr-10x
// ==/UserScript==

window.isDOMLoaded = false;
window.isDOMRendered = false;

document.addEventListener('readystatechange', function () {
    if (document.readyState === "interactive" || document.readyState === "complete") {
        window.isDOMLoaded = true;
    }
});

~function (global) {
    var extraElements = [];

    var helper = function (eHookContext, timerContext, util) {
        return {
            applyUI: function () {
                var style = '._10x-container{position:fixed;top:20px;right:20px;z-index:100000;background-color:rgba(127,255,212,0.7);padding:10px;border-radius:5px;font-size:14px;font-weight:bold;cursor:pointer;box-shadow:-3px 4px 12px -5px black;user-select:none;transition:all 0.3s}._10x-container:hover{background-color:rgba(127,255,212,0.9)}._10x-active{color:#fff;background-color:#5fb492 !important}._10x-status{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;background-color:#ccc}._10x-active ._10x-status{background-color:#00ff00}';

                // Add a button in the top right corner
                var html = '<div class="_10x-container" id="speed-toggle">\n' +
                    '    <span class="_10x-status"></span>\n' +
                    '    10x Speed: OFF\n' +
                    '</div>';

                var stylenode = document.createElement('style');
                stylenode.setAttribute("type", "text/css");
                if (stylenode.styleSheet) {// IE
                    stylenode.styleSheet.cssText = style;
                } else {// w3c
                    var cssText = document.createTextNode(style);
                    stylenode.appendChild(cssText);
                }
                
                var node = document.createElement('div');
                node.innerHTML = html;

                if (!global.isDOMLoaded) {
                    document.addEventListener('readystatechange', function () {
                        if ((document.readyState === "interactive" || document.readyState === "complete") && !global.isDOMRendered) {
                            document.head.appendChild(stylenode);
                            document.body.appendChild(node);
                            global.isDOMRendered = true;
                            console.log('10x Speed Booster is ready!');
                            
                            // Add click event
                            document.getElementById('speed-toggle').addEventListener('click', function() {
                                if (timerContext._percentage === 1) {
                                    timerContext.enable10xSpeed();
                                } else {
                                    timerContext.disableSpeedUp();
                                }
                            });
                        }
                    });
                } else {
                    document.head.appendChild(stylenode);
                    document.body.appendChild(node);
                    global.isDOMRendered = true;
                    console.log('10x Speed Booster is ready!');
                    
                    // Add click event
                    document.getElementById('speed-toggle').addEventListener('click', function() {
                        if (timerContext._percentage === 1) {
                            timerContext.enable10xSpeed();
                        } else {
                            timerContext.disableSpeedUp();
                        }
                    });
                }
            },
            applyHooking: function () {
                var _this = this;
                // Hijack the loop timer
                eHookContext.hookReplace(window, 'setInterval', function (setInterval) {
                    return _this.getHookedTimerFunction('interval', setInterval);
                });
                // Hijack a single timer
                eHookContext.hookReplace(window, 'setTimeout', function (setTimeout) {
                    return _this.getHookedTimerFunction('timeout', setTimeout)
                });
                // Hijack the clear methods
                eHookContext.hookBefore(window, 'clearInterval', function (method, args) {
                    _this.redirectNewestId(args);
                });
                eHookContext.hookBefore(window, 'clearTimeout', function (method, args) {
                    _this.redirectNewestId(args);
                });
                
                // Hook Date constructor
                var newFunc = this.getHookedDateConstructor();
                eHookContext.hookClass(window, 'Date', newFunc, '_innerDate', ['now']);
                Date.now = function () {
                    return new Date().getTime();
                };
                
                eHookContext.hookedToString(timerContext._Date.now, Date.now);
                var objToString = Object.prototype.toString;

                Object.prototype.toString = function toString() {
                    'use strict';
                    if (this instanceof timerContext._mDate) {
                        return '[object Date]';
                    } else {
                        return objToString.call(this);
                    }
                };

                eHookContext.hookedToString(objToString, Object.prototype.toString);
                eHookContext.hookedToString(timerContext._setInterval, setInterval);
                eHookContext.hookedToString(timerContext._setTimeout, setTimeout);
                eHookContext.hookedToString(timerContext._clearInterval, clearInterval);
                timerContext._mDate = window.Date;
                this.hookShadowRoot();
            },
            getHookedDateConstructor: function () {
                return function () {
                    if (arguments.length === 1) {
                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: new timerContext._Date(arguments[0]),
                            writable: false
                        });
                        return;
                    } else if (arguments.length > 1) {
                        var definedValue;
                        switch (arguments.length) {
                            case 2:
                                definedValue = new timerContext._Date(arguments[0], arguments[1]);
                                break;
                            case 3:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2]);
                                break;
                            case 4:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3]);
                                break;
                            case 5:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                                break;
                            case 6:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                                break;
                            default:
                            case 7:
                                definedValue = new timerContext._Date(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
                                break;
                        }

                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: definedValue,
                            writable: false
                        });
                        return;
                    }
                    var now = timerContext._Date.now();
                    var passTime = now - timerContext.__lastDatetime;
                    var hookPassTime = passTime * (1 / timerContext._percentage);
                    
                    Object.defineProperty(this, '_innerDate', {
                        configurable: false,
                        enumerable: false,
                        value: new timerContext._Date(timerContext.__lastMDatetime + hookPassTime),
                        writable: false
                    });
                };
            },
            getHookedTimerFunction: function (type, timer) {
                var property = '_' + type + 'Ids';
                return function () {
                    var uniqueId = timerContext.genUniqueId();
                    var callback = arguments[0];
                    if (typeof callback === 'string') {
                        callback += ';timer.notifyExec(' + uniqueId + ')';
                        arguments[0] = callback;
                    }
                    if (typeof callback === 'function') {
                        arguments[0] = function () {
                            var returnValue = callback.apply(this, arguments);
                            timerContext.notifyExec(uniqueId);
                            return returnValue;
                        }
                    }
                    // save the original time interval
                    var originMS = arguments[1];
                    // Get variable speed interval
                    arguments[1] *= timerContext._percentage;
                    var resultId = timer.apply(window, arguments);
                    // Save the id and parameters obtained
                    timerContext[property][resultId] = {
                        args: arguments,
                        originMS: originMS,
                        originId: resultId,
                        nowId: resultId,
                        uniqueId: uniqueId,
                        oldPercentage: timerContext._percentage,
                        exceptNextFireTime: timerContext._Date.now() + originMS
                    };
                    return resultId;
                };
            },
            redirectNewestId: function (args) {
                var id = args[0];
                if (timerContext._intervalIds[id]) {
                    args[0] = timerContext._intervalIds[id].nowId;
                    delete timerContext._intervalIds[id];
                }
                if (timerContext._timeoutIds[id]) {
                    args[0] = timerContext._timeoutIds[id].nowId;
                    delete timerContext._timeoutIds[id];
                }
            },
            percentageChangeHandler: function (percentage) {
                // Change all loop timings
                util.ergodicObject(timerContext, timerContext._intervalIds, function (idObj, id) {
                    idObj.args[1] = Math.floor((idObj.originMS || 1) * percentage);
                    // End the original timer
                    this._clearInterval.call(window, idObj.nowId);
                    // start a new timer
                    idObj.nowId = this._setInterval.apply(window, idObj.args);
                });
                // Change all delay timings
                util.ergodicObject(timerContext, timerContext._timeoutIds, function (idObj, id) {
                    var now = this._Date.now();
                    var exceptTime = idObj.exceptNextFireTime;
                    var oldPercentage = idObj.oldPercentage;
                    var time = exceptTime - now;
                    if (time < 0) {
                        time = 0;
                    }
                    var changedTime = Math.floor(percentage / oldPercentage * time);
                    idObj.args[1] = changedTime;
                    // Reschedule the next execution time
                    idObj.exceptNextFireTime = now + changedTime;
                    idObj.oldPercentage = percentage;
                    // end the original timer
                    this._clearTimeout.call(window, idObj.nowId);
                    // start a new timer
                    idObj.nowId = this._setTimeout.apply(window, idObj.args);
                });
            },
            hookShadowRoot: function () {
                var origin = Element.prototype.attachShadow;
                eHookContext.hookAfter(Element.prototype, 'attachShadow',
                    function (m, args, result) {
                        extraElements.push(result);
                        return result;
                    }, false);
                eHookContext.hookedToString(origin, Element.prototype.attachShadow);
            },
            hookDefine: function () {
                const _this = this;
                eHookContext.hookBefore(Object, 'defineProperty', function (m, args) {
                    var option = args[2];
                    var ele = args[0];
                    var key = args[1];
                    var afterArgs = _this.hookDefineDetails(ele, key, option);
                    afterArgs.forEach((arg, i) => {
                        args[i] = arg;
                    });
                });
                eHookContext.hookBefore(Object, 'defineProperties', function (m, args) {
                    var option = args[1];
                    var ele = args[0];
                    if (ele && ele instanceof Element) {
                        Object.keys(option).forEach(key => {
                            var o = option[key];
                            var afterArgs = _this.hookDefineDetails(ele, key, o);
                            args[0] = afterArgs[0];
                            delete option[key];
                            option[afterArgs[1]] = afterArgs[2];
                        });
                    }
                });
            },
            hookDefineDetails: function (target, key, option) {
                if (option && target && target instanceof Element && typeof key === 'string' && key.indexOf('on') >= 0) {
                    option.configurable = true;
                }
                if (target instanceof HTMLVideoElement && key === 'playbackRate') {
                    option.configurable = true;
                    console.warn('[10x Speed Booster]', 'Video playback rate control hooked');
                    key = 'playbackRate_hooked';
                }
                return [target, key, option];
            },
            changePlaybackRate: function (ele, rate) {
                delete ele.playbackRate;
                delete ele.playbackRate;
                delete ele.playbackRate;
                ele.playbackRate = rate;
                if (rate !== 1) {
                    timerContext.defineProperty.call(Object, ele, 'playbackRate', {
                        configurable: true,
                        get: function () {
                            return 1;
                        },
                        set: function () {
                        }
                    });
                }
            }
        };
    };

    var normalUtil = {
        isInIframe: function () {
            let is = global.parent !== global;
            try {
                is = is && global.parent.document.body.tagName !== 'FRAMESET';
            } catch (e) {
                // ignore
            }
            return is;
        },
        listenParentEvent: function (handler) {
            global.addEventListener('message', function (e) {
                var data = e.data;
                var type = data.type || '';
                if (type === 'changePercentage') {
                    handler(data.percentage || 0);
                }
            });
        },
        sentChangesToIframe: function (percentage) {
            var iframes = document.querySelectorAll('iframe') || [];
            var frames = document.querySelectorAll('frame');
            if (iframes.length) {
                for (var i = 0; i < iframes.length; i++) {
                    iframes[i].contentWindow.postMessage(
                        {type: 'changePercentage', percentage: percentage}, '*');
                }
            }
            if (frames.length) {
                for (var j = 0; j < frames.length; j++) {
                    frames[j].contentWindow.postMessage(
                        {type: 'changePercentage', percentage: percentage}, '*');
                }
            }
        }
    };

    var querySelectorAll = function (ele, selector, includeExtra) {
        var elements = ele.querySelectorAll(selector);
        elements = Array.prototype.slice.call(elements || []);
        if (includeExtra) {
            extraElements.forEach(function (element) {
                elements = elements.concat(querySelectorAll(element, selector, false));
            });
        }
        return elements;
    };

    var generate = function () {
        return function (util) {
            var eHookContext = this;
            var timerHooker = {
                // Used to store the id and parameters of the timer
                _intervalIds: {},
                _timeoutIds: {},
                _auoUniqueId: 1,
                // timer rate
                __percentage: 1.0,
                // Original method before hijacking
                _setInterval: window['setInterval'],
                _clearInterval: window['clearInterval'],
                _clearTimeout: window['clearTimeout'],
                _setTimeout: window['setTimeout'],
                _Date: window['Date'],
                __lastDatetime: new Date().getTime(),
                __lastMDatetime: new Date().getTime(),
                videoSpeedInterval: 1000,
                defineProperty: Object.defineProperty,
                defineProperties: Object.defineProperties,
                genUniqueId: function () {
                    return this._auoUniqueId++;
                },
                notifyExec: function (uniqueId) {
                    var _this = this;
                    if (uniqueId) {
                        // clear timeout stored records
                        var timeoutInfos = Object.values(this._timeoutIds).filter(
                            function (info) {
                                return info.uniqueId === uniqueId;
                            }
                        );
                        timeoutInfos.forEach(function (info) {
                            _this._clearTimeout.call(window, info.nowId);
                            delete _this._timeoutIds[info.originId];
                        });
                    }
                },
                /**
                 * initialization method
                 */
                init: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);

                    h.hookDefine();
                    h.applyHooking();

                    // Set the callback when the percentage property is modified
                    Object.defineProperty(timerContext, '_percentage', {
                        get: function () {
                            return timerContext.__percentage;
                        },
                        set: function (percentage) {
                            if (percentage === timerContext.__percentage) {
                                return percentage;
                            }
                            h.percentageChangeHandler(percentage);
                            timerContext.__percentage = percentage;
                            return percentage;
                        }
                    });

                    if (!normalUtil.isInIframe()) {
                        console.log('[10x Speed Booster]', 'Loading outer window...');
                        h.applyUI();
                        
                        // Register keyboard shortcut (Press Alt+X to toggle)
                        document.addEventListener('keydown', function(e) {
                            if (e.altKey && e.key === 'x') {
                                if (timerContext._percentage === 1) {
                                    timerContext.enable10xSpeed();
                                } else {
                                    timerContext.disableSpeedUp();
                                }
                            }
                        });
                    } else {
                        console.log('[10x Speed Booster]', 'Loading inner window...');
                        normalUtil.listenParentEvent((function (percentage) {
                            console.log('[10x Speed Booster]', 'Inner Changed', percentage);
                            this.change(percentage);
                        }).bind(this));
                    }
                    
                    // Set up a check for videos being added to the page
                    this._setInterval.call(window, function() {
                        if (timerContext._percentage !== 1) {
                            timerContext.changeVideoSpeed();
                        }
                    }, 1000);
                },
                
                /**
                 * Enable 10x speed function
                 */
                enable10xSpeed: function() {
                    this.change(0.1); // 10x speed (0.1 = 1/10th of the normal time)
                    var btn = document.getElementById('speed-toggle');
                    if (btn) {
                        btn.innerHTML = '<span class="_10x-status"></span>10x Speed: ON';
                        btn.classList.add('_10x-active');
                    }
                },
                
                /**
                 * Disable speed up function
                 */
                disableSpeedUp: function() {
                    this.change(1); // normal speed
                    var btn = document.getElementById('speed-toggle');
                    if (btn) {
                        btn.innerHTML = '<span class="_10x-status"></span>10x Speed: OFF';
                        btn.classList.remove('_10x-active');
                    }
                },
                
                /**
                 * Call this method to change the timer rate
                 * @param percentage
                 */
                change: function (percentage) {
                    this.__lastMDatetime = this._mDate.now();
                    this.__lastDatetime = this._Date.now();
                    this._percentage = percentage;
                    this.changeVideoSpeed();
                    normalUtil.sentChangesToIframe(percentage);
                },
                
                changeVideoSpeed: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);
                    // If speed is 10x, video playback rate should be 10
                    var rate = this._percentage === 0.1 ? 10 : 1;
                    var videos = querySelectorAll(document, 'video', true) || [];
                    if (videos.length) {
                        for (var i = 0; i < videos.length; i++) {
                            h.changePlaybackRate(videos[i], rate);
                        }
                    }
                }
            };
            // default initialization
            timerHooker.init();
            return timerHooker;
        };
    };

    if (global.eHook) {
        global.eHook.plugins({
            name: '10xSpeedBooster',
            /**
             * Plugin loading
             * @param util
             */
            mount: generate()
        });
    }
}(window);
