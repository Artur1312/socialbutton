var Cookie = (function () {
    function Cookie() {
    }
    Cookie.set = function (name, value, expires, path, domain, secure) {
        if (expires === void 0) { expires = null; }
        if (path === void 0) { path = null; }
        if (domain === void 0) { domain = null; }
        if (secure === void 0) { secure = false; }
        var cookieStr = name + "=" + encodeURIComponent(value.toString()) + "; ";
        cookieStr += "path=" + (path ? path : '/') + "; ";
        if (expires) {
            if (typeof expires === 'string' || expires instanceof String) {
                cookieStr += "expires=" + expires + "; ";
            }
            else {
                var date = new Date();
                date.setTime(date.getTime() + expires * 1000);
                cookieStr += "expires=" + date.toUTCString() + "; ";
            }
        }
        if (domain) {
            cookieStr += "domain=" + domain + "; ";
        }
        if (secure) {
            cookieStr += "secure; ";
        }
        document.cookie = cookieStr;
    };
    Cookie.get = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return decodeURIComponent(c.substring(name.length, c.length));
            }
        }
        return null;
    };
    Cookie.check = function (name) {
        return this.get(name) !== null;
    };
    Cookie.remove = function (name) {
        this.set(name, "", 'Thu, 01 Jan 1970 00:00:01 GMT');
    };
    return Cookie;
}());

var WidgetDetect = (function () {
    function WidgetDetect() {
    }
    WidgetDetect.isIOS = function () {
        return (/ip(hone|od|ad)/i.test(WidgetDetect.getUserAgent()));
    };
    WidgetDetect.isAndroid = function () {
        return WidgetDetect.getUserAgent().indexOf('android') !== -1;
    };
    WidgetDetect.isMobile = function () {
        var isMobileVersion = (WidgetDetect.isIOS() || WidgetDetect.isAndroid());
        if (false === isMobileVersion) {
            var a = WidgetDetect.getUserAgent();
            isMobileVersion = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)));
        }
        return isMobileVersion;
    };
    WidgetDetect.getUserAgent = function () {
        return navigator.userAgent || navigator.vendor || window.opera;
    };
    return WidgetDetect;
}());
var WidgetDOM = (function () {
    function WidgetDOM() {
    }
    WidgetDOM.addStyle = function (styles) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = styles;
        document.body.insertBefore(style, document.body.getElementsByTagName('*')[0]);
    };
    WidgetDOM.addScript = function (src, cb) {
        if (cb === void 0) { cb = null; }
        var script = document.createElement('script');
        script.setAttribute('src', src);
        script.setAttribute('type', 'text/javascript');
        if (cb) {
            script.onload = cb;
        }
        document.body.appendChild(script);
    };
    WidgetDOM.addInlineScript = function (code, cb) {
        if (cb === void 0) { cb = null; }
        var script = document.createElement('script');
        script.innerHTML = code;
        script.setAttribute('type', 'text/javascript');
        if (cb) {
            script.onload = cb;
        }
        document.body.appendChild(script);
    };
    WidgetDOM.unsetClass = function (elem, className) {
        elem.className = (' ' + elem.className + ' ').replace(' ' + className + ' ', ' ').replace(/^ /, '').replace(/ $/, '');
        ;
    };
    ;
    WidgetDOM.hasClass = function (elem, className) {
        return (elem.className == className) || ((' ' + elem.className + ' ').indexOf(' ' + className + ' ') !== -1);
    };
    ;
    WidgetDOM.addMeta = function (id) {
        var viewPortTag = document.createElement('meta');
        viewPortTag.id = id;
        viewPortTag.name = "viewport";
        viewPortTag.content = "width=device-width, initial-scale=1.0";
        document.getElementsByTagName('head')[0].appendChild(viewPortTag);
    };
    WidgetDOM.isViewportExist = function () {
        var metaList = document.getElementsByTagName('meta');
        for (var i = 0; i < metaList.length; i++) {
            if ('viewport' === metaList[i].name) {
                return true;
            }
        }
        return false;
    };
    WidgetDOM.addLink = function (url) {
        var viewPortTag = document.createElement('link');
        viewPortTag.type = "text/css";
        viewPortTag.href = url;
        viewPortTag.rel = "stylesheet";
        document.getElementsByTagName('head')[0].appendChild(viewPortTag);
    };
    WidgetDOM.addDiv = function (divId, divContent, before) {
        if (before === void 0) { before = true; }
        var wrap = document.createElement('div');
        wrap.id = divId;
        if (typeof divContent === 'string' || divContent instanceof String) {
            wrap.innerHTML = divContent.toString();
        }
        else {
            wrap.appendChild(divContent);
        }
        if (before) {
            document.body.insertBefore(wrap, document.body.getElementsByTagName('*')[0]);
        }
        else {
            document.body.appendChild(wrap);
        }
        return wrap;
    };
    WidgetDOM.addDivClear = function (elem) {
        var divClear = document.createElement('div');
        WidgetDOM.setClass(divClear, 'clear');
        elem.appendChild(divClear);
        return elem;
    };
    WidgetDOM.addMetricsIframe = function (url, id) {
        var iframe = document.createElement('iframe');
        iframe.id = id;
        iframe.style.display = "none";
        iframe.setAttribute("src", url);
        document.body.appendChild(iframe);
    };
    return WidgetDOM;
}());
WidgetDOM.setClass = function (elem, className) {
    if (!WidgetDOM.hasClass(elem, className)) {
        elem.className += ' ' + className;
    }
};
WidgetDOM.toggleClass = function (elem, className) {
    if (WidgetDOM.hasClass(elem, className)) {
        WidgetDOM.unsetClass(elem, className);
    }
    else {
        WidgetDOM.setClass(elem, className);
    }
};
var WidgetHelper = (function () {
    function WidgetHelper() {
    }
    WidgetHelper.encodeGetParams = function (options) {
        var params = [];
        for (var i in options) {
            if (!options.hasOwnProperty(i)) {
                continue;
            }
            params.push(encodeURIComponent(i) + '=' + encodeURIComponent(options[i]));
        }
        if (params.length === 0) {
            return '';
        }
        return params.join('&');
    };
    WidgetHelper.extend = function () {
        var objs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objs[_i] = arguments[_i];
        }
        if (objs.length === 0) {
            return null;
        }
        if (objs.length === 1) {
            return objs[0];
        }
        var extendedObject = objs[0];
        for (var i = 1; i < objs.length; i++) {
            var currentObject = objs[i];
            for (var j in currentObject) {
                if (!currentObject.hasOwnProperty(j)) {
                    continue;
                }
                extendedObject[j] = currentObject[j];
            }
        }
        return extendedObject;
    };
    WidgetHelper.isArray = function (obj) {
        if (Array.isArray) {
            return Array.isArray(obj);
        }
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    ;
    WidgetHelper.isObject = function (value) {
        return value !== null && typeof value === 'object';
    };
    return WidgetHelper;
}());

var WhWidgetSendButton = (function () {
    function WhWidgetSendButton() {
    }
    WhWidgetSendButton.getMetricsIframeId = function () {
        return 'iframe-metrics-' + WhWidgetSendButton.widgetWrapperId;
    };
    ;
    WhWidgetSendButton.checkParams = function (host, proto, options) {
        if (!host || (String)(host).length === 0) {
            return false;
        }
        if (!proto || (String)(proto).length === 0) {
            return false;
        }
        return true;
    };
    ;
    WhWidgetSendButton.checkDocumentIsLoading = function () {
        return document.readyState === "loading";
    };
    WhWidgetSendButton.addMetricsIframe = function (host, proto, options) {
        var metricsOptions = {
            'page_id': options.facebook,
            'source': window.location.hostname,
            'referrer': window.document.referrer
        };
        WidgetDOM.addMetricsIframe(proto + '//' + host + '/widget/metrics?' + WidgetHelper.encodeGetParams(metricsOptions), WhWidgetSendButton.getMetricsIframeId());
    };
    ;
    WhWidgetSendButton.clear = function () {
        var alreadyIframe = document.getElementById(WhWidgetSendButton.getMetricsIframeId());
        if (null !== alreadyIframe) {
            var parentIframe = alreadyIframe.parentNode;
            parentIframe.removeChild(alreadyIframe);
        }
    };
    ;
    WhWidgetSendButton.init = function (host, proto, options) {
        if (!WhWidgetSendButton.checkParams(host, proto, options)) {
            return;
        }
        if (WhWidgetSendButton.checkDocumentIsLoading()) {
            document.addEventListener("DOMContentLoaded", function () {
                WhWidgetSendButton.init(host, proto, options);
            });
            return;
        }
        WhWidgetSendButton.clear();
        var url = proto + '//static.' + host + '/widget-send-button/js/container.js';
        var isMobile = WidgetDetect.isMobile();
        WidgetDOM.addScript(url, function () {
            var params = {
                wrapperId: WhWidgetSendButton.widgetWrapperId,
                host: host,
                proto: proto,
                clientHostname: location.hostname,
                isMobile: isMobile,
            };
            WidgetInitializer.widgetInitialize('container', params, options);
        });
        WhWidgetSendButton.addMetricsIframe(host, proto, options);
    };
    return WhWidgetSendButton;
}());
WhWidgetSendButton.widgetWrapperId = 'wh-widget-send-button';
