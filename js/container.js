var WidgetInitializer = (function () {
    function WidgetInitializer() {
    }
    WidgetInitializer.widgetInitialize = function (type, inParams, userOptions) {
        var params = WidgetInitializer.initParams(inParams);
        var options = WidgetInitializer.initOptions(userOptions);
        switch (type) {
            case 'mobile':
                WidgetInitializer.whWidgetObject = new WidgetSendButtonMobile(params, options);
                break;
            case 'container':
                WidgetInitializer.whWidgetObject = new WidgetSendButtonContainer(params, options);
                break;
            case 'desktop':
                WidgetInitializer.whWidgetObject = new WidgetSendButtonDesktop(params, options);
                break;
        }
        return WidgetInitializer.whWidgetObject;
    };
    WidgetInitializer.initParams = function (params) {
        var outParams = {
            wrapperId: params.wrapperId,
            clientHostname: params.clientHostname,
            proto: '',
            host: '',
            staticHost: '',
            showHelloPopup: !!params.showHelloPopup,
            parentWrapperId: params.parentWrapperId,
            isMobile: params.isMobile,
        };
        outParams.proto = params.proto === 'https:' ? 'https:' : 'http:';
        outParams.host = params.proto + '//' + params.host;
        outParams.staticHost = params.proto + '//static.' + params.host;
        return outParams;
    };
    WidgetInitializer.initOptions = function (options) {
        var outOptions;
        outOptions = options;
        if (WidgetInitializer.supportedPosition.indexOf(outOptions.position) === -1) {
            outOptions.position = WidgetInitializer.RIGHT_POSITION;
        }
        if (!outOptions.button_color) {
            outOptions.button_color = WidgetInitializer.DEFAULT_BUTTON_COLOR;
        }
        return outOptions;
    };
    return WidgetInitializer;
}());
WidgetInitializer.DEFAULT_BUTTON_COLOR = '#ff6550';
WidgetInitializer.LEFT_POSITION = 'left';
WidgetInitializer.RIGHT_POSITION = 'right';
WidgetInitializer.supportedPosition = [WidgetInitializer.LEFT_POSITION, WidgetInitializer.RIGHT_POSITION];
WidgetInitializer.whWidgetObject = null;
var WidgetSendButtonBase = (function () {
    function WidgetSendButtonBase(params, options, slider) {
        var _this = this;
        this.widgetState = null;
        this.animationControl = null;
        this.container = null;
        this.resize = function () {
            if (_this.params.parentWrapperId === null || _this.params.parentWrapperId === undefined) {
                return;
            }
            var size = WidgetSize.getSize(_this);
            if (size === null) {
                return;
            }
            ParentWindowHelper.resize(_this.params.parentWrapperId, size.width, size.height);
        };
        this.onClickButton = function (params) {
            if (_this.animationControl.isRunAnimation()) {
                return;
            }
            var button = params[0];
            if (_this.slider.isActivator(button)) {
                if (StateMashine.WIDGET_STATE_ACTIVATOR === _this.widgetState.getState()
                    || StateMashine.WIDGET_STATE_HELLO === _this.widgetState.getState()) {
                    if (_this.slider.isSingleMode()) {
                        _this.goState(StateMashine.WIDGET_STATE_BUTTON_ACTION, button);
                    }
                    else {
                        _this.goState(StateMashine.WIDGET_STATE_SLIDER);
                    }
                }
                else {
                    _this.goState(StateMashine.WIDGET_STATE_ACTIVATOR);
                }
            }
            else {
                _this.goState(StateMashine.WIDGET_STATE_BUTTON_ACTION, button);
            }
        };
        this.onMouseenterButton = function (params) {
            if (_this.animationControl.isRunAnimation()) {
                return;
            }
            var button = params[0];
            if (_this.slider.isActivator(button)) {
                if (StateMashine.WIDGET_STATE_ACTIVATOR === _this.widgetState.getState()
                    || StateMashine.WIDGET_STATE_HELLO === _this.widgetState.getState()) {
                    if (_this.slider.isSingleMode()) {
                        _this.goState(StateMashine.WIDGET_STATE_BUTTON_ACTION, button);
                    }
                    else {
                        _this.goState(StateMashine.WIDGET_STATE_SLIDER);
                    }
                }
            }
        };
        this.onClickClosePopup = function () {
            if (_this.animationControl.isRunAnimation()) {
                return;
            }
            _this.goState(StateMashine.WIDGET_STATE_ACTIVATOR);
        };
        this.goState = function (toState, button) {
            if (button === void 0) { button = null; }
            if (_this.animationControl.isRunAnimation()) {
                return;
            }
            var fromState = _this.widgetState.getState();
            if (!_this.widgetState.canGoState(fromState, toState)) {
                return;
            }
            _this.params.showHelloPopup = false;
            switch (fromState) {
                case StateMashine.WIDGET_STATE_HELLO:
                    EventManager.publish(EventManager.EVENT_CLOSE_POPUP);
                    break;
                case StateMashine.WIDGET_STATE_ACTIVATOR:
                    break;
                case StateMashine.WIDGET_STATE_BUTTON_ACTION:
                    _this.slider.goStateAsOpen();
                    EventManager.publish(EventManager.EVENT_CLOSE_POPUP);
                    break;
                case StateMashine.WIDGET_STATE_SLIDER:
                    _this.slider.goStateAsOpen();
                    break;
            }
            setTimeout(function () {
                _this.callbackGoToState(_this, toState, button);
            }, 100);
        };
        this.callbackGoToState = function (self, toState, button, countRun) {
            if (button === void 0) { button = null; }
            if (countRun === void 0) { countRun = 0; }
            if (countRun > 100) {
                return;
            }
            if (self.animationControl.isRunAnimation()) {
                setTimeout(function () {
                    self.callbackGoToState(self, toState, button, countRun + 1);
                }, 100);
            }
            else {
                switch (toState) {
                    case StateMashine.WIDGET_STATE_ACTIVATOR:
                        _this.slider.goStateAsOpen();
                        _this.widgetState.goState(StateMashine.WIDGET_STATE_ACTIVATOR);
                        break;
                    case StateMashine.WIDGET_STATE_BUTTON_ACTION:
                        if (button.isExistActionState()) {
                            _this.slider.goStateAsClose();
                        }
                        else {
                            _this.slider.goStateAsOpen();
                        }
                        button.runButtonAction();
                        if (button.isExistActionState()) {
                            _this.widgetState.goState(StateMashine.WIDGET_STATE_BUTTON_ACTION);
                        }
                        else {
                            _this.widgetState.goState(StateMashine.WIDGET_STATE_ACTIVATOR);
                        }
                        break;
                    case StateMashine.WIDGET_STATE_SLIDER:
                        _this.slider.goStateAsSlide();
                        _this.widgetState.goState(StateMashine.WIDGET_STATE_SLIDER);
                        break;
                }
            }
        };
        this.params = params;
        this.options = options;
        this.slider = slider;
        this.widgetState = new StateMashine(StateMashine.WIDGET_STATE_ACTIVATOR, this.params.isMobile);
        this.animationControl = new AnimationControl();
        this.buildWidget();
        this.container = document.getElementById(this.params.wrapperId);
        EventManager.subscribe(EventManager.EVENT_RESIZE_WIDGET, this.resize);
        EventManager.subscribe(EventManager.EVENT_MOUSEENTER_MSG_BUTTON, this.onMouseenterButton);
        EventManager.subscribe(EventManager.EVENT_CLICK_MSG_BUTTON, this.onClickButton);
        EventManager.subscribe(EventManager.EVENT_CLICK_CLOSE_POPUP, this.onClickClosePopup);
        this.resize();
    }
    WidgetSendButtonBase.prototype.reInitWidget = function (options) {
        this.options = WidgetInitializer.initOptions(options);
        this.reBuildWidget();
    };
    WidgetSendButtonBase.prototype.getContainer = function () {
        return this.container;
    };
    ;
    WidgetSendButtonBase.prototype.buildWidget = function () {
        var _this = this;
        this.widgetState.initJumpRules(this.slider.isSingleMode());
        this.slider.renderButtonList();
        if (typeof window.addEventListener != 'undefined') {
            window.addEventListener('message', function (ev) {
                var option = JSON.parse(ev.data);
                if (option) {
                    _this.reInitWidget(option);
                }
            }, false);
        }
    };
    ;
    WidgetSendButtonBase.prototype.reBuildWidget = function () {
        this.slider.setOptions(this.options);
        this.widgetState.initJumpRules(this.slider.isSingleMode());
        this.slider.renderButtonList();
        this.resize();
    };
    ;
    return WidgetSendButtonBase;
}());
var ParentWindowHelper = (function () {
    function ParentWindowHelper() {
    }
    ParentWindowHelper.resize = function (elementId, width, height) {
        var data = {
            name: 'wh-resize-widget',
            elemId: elementId,
            width: width,
            height: height
        };
        window.parent.postMessage(JSON.stringify(data), "*");
    };
    ;
    ParentWindowHelper.changeURL = function (url) {
        var data = {
            name: 'wh-change-url',
            url: url
        };
        window.parent.postMessage(JSON.stringify(data), "*");
    };
    ;
    return ParentWindowHelper;
}());
var WidgetSize = (function () {
    function WidgetSize() {
    }
    WidgetSize.getSize = function (modelWidget) {
        var container = modelWidget.getContainer();
        if (container === null) {
            return null;
        }
        return {
            width: container.clientWidth,
            height: container.clientHeight
        };
    };
    ;
    return WidgetSize;
}());
var Animates = (function () {
    function Animates(object, type, direction, status) {
        if (status === void 0) { status = ''; }
        this.object = object;
        this.type = type;
        this.direction = direction;
        if (status) {
            this.status = status;
        }
        else {
            this.status = Animates.ANIMATE_STATUS_RUNNING;
        }
    }
    Animates.prototype.isEqual = function (animate) {
        return (this.object === animate.object
            && this.type === animate.type
            && this.direction === animate.direction);
    };
    return Animates;
}());
Animates.ANIMATE_STATUS_RUNNING = 'animateStatusRunnig';
Animates.ANIMATE_STATUS_CLOSE = 'animateStatusClose';
var AnimationControl = (function () {
    function AnimationControl() {
        var _this = this;
        this.runningAnimates = [];
        this.onUpdateAnimates = function (params) {
            var animate = params[0];
            for (var i = 0; i < _this.runningAnimates.length; i++) {
                if (_this.runningAnimates[i].isEqual(animate)) {
                    if (animate.status === Animates.ANIMATE_STATUS_CLOSE) {
                        _this.runningAnimates.splice(i);
                    }
                    return;
                }
            }
            if (animate.status === Animates.ANIMATE_STATUS_RUNNING) {
                _this.runningAnimates.push(animate);
            }
        };
        this.isRunAnimation = function () {
            return _this.runningAnimates.length > 0;
        };
        EventManager.subscribe(EventManager.EVENT_UPDATE_ANIMATES_STATUS, this.onUpdateAnimates);
    }
    return AnimationControl;
}());
var StateMashine = (function () {
    function StateMashine(deaultState, isMobile) {
        if (deaultState === void 0) { deaultState = null; }
        if (isMobile === void 0) { isMobile = false; }
        var _this = this;
        this.state = StateMashine.WIDGET_STATE_ACTIVATOR;
        this.isMobile = false;
        this.stateJumps = {};
        this.getState = function () {
            return _this.state;
        };
        this.setState = function (state) {
            _this.state = state;
        };
        this.goState = function (toState) {
            if (_this.canGoState(_this.state, toState)) {
                _this.setState(toState);
                return true;
            }
            return false;
        };
        this.initJumpRules = function (isSingleMode) {
            _this.stateJumps = StateMashine.stateJumpRules(isSingleMode, _this.isMobile);
        };
        this.canGoState = function (fromState, toState) {
            if (_this.stateJumps[fromState]) {
                for (var i = 0; i < _this.stateJumps[fromState].length; i++) {
                    if (_this.stateJumps[fromState][i] === toState) {
                        return true;
                    }
                }
            }
            return false;
        };
        this.isMobile = isMobile;
        if (deaultState) {
            this.state = deaultState;
        }
        else {
            this.state = StateMashine.WIDGET_STATE_ACTIVATOR;
        }
    }
    StateMashine.stateJumpRules = function (isSingleMode, isMobile) {
        if (isMobile === void 0) { isMobile = false; }
        var stateJumps = {};
        stateJumps[StateMashine.WIDGET_STATE_ACTIVATOR] = [];
        stateJumps[StateMashine.WIDGET_STATE_SLIDER] = [
            StateMashine.WIDGET_STATE_ACTIVATOR,
            StateMashine.WIDGET_STATE_BUTTON_ACTION,
        ];
        stateJumps[StateMashine.WIDGET_STATE_BUTTON_ACTION] = [
            StateMashine.WIDGET_STATE_ACTIVATOR
        ];
        if (!isMobile) {
            stateJumps[StateMashine.WIDGET_STATE_HELLO] = [
                StateMashine.WIDGET_STATE_ACTIVATOR,
                StateMashine.WIDGET_STATE_BUTTON_ACTION,
            ];
        }
        if (isSingleMode) {
            stateJumps[StateMashine.WIDGET_STATE_ACTIVATOR].push(StateMashine.WIDGET_STATE_BUTTON_ACTION);
        }
        else {
            stateJumps[StateMashine.WIDGET_STATE_ACTIVATOR].push(StateMashine.WIDGET_STATE_SLIDER);
            if (!isMobile) {
                stateJumps[StateMashine.WIDGET_STATE_HELLO].push(StateMashine.WIDGET_STATE_SLIDER);
            }
        }
        return stateJumps;
    };
    ;
    return StateMashine;
}());
StateMashine.WIDGET_STATE_ACTIVATOR = 'widgetStateActivator';
StateMashine.WIDGET_STATE_HELLO = 'widgetStateHello';
StateMashine.WIDGET_STATE_SLIDER = 'widgetStateSlider';
StateMashine.WIDGET_STATE_BUTTON_ACTION = 'widgetStateButtonAction';

var WidgetSendButtonContainer = (function () {
    function WidgetSendButtonContainer(params, options) {
        var _this = this;
        this.container = null;
        this.onPostMessage = function (event) {
            if (event.origin.replace(/^https?:/, '') !== _this.params.host.replace(/^https?:/, '')) {
                return;
            }
            var data = JSON.parse(event.data);
            if (data.name === 'wh-resize-widget') {
                _this.onPostMessageResize(data);
            }
            if (data.name === 'wh-change-url') {
                _this.onPostMessageChangeUrl(data);
            }
        };
        this.params = params;
        this.options = options;
        this.addStyles();
        this.buildWidget();
        window.addEventListener("message", this.onPostMessage, false);
    }
    WidgetSendButtonContainer.prototype.reInitWidget = function (options) {
        this.options = WidgetInitializer.initOptions(options);
    };
    WidgetSendButtonContainer.prototype.getContainer = function () {
        return this.container;
    };
    ;
    WidgetSendButtonContainer.prototype.onPostMessageResize = function (data) {
        var el = document.getElementById(data.elemId);
        if (!el) {
            return;
        }
        el.style.width = data.width.toString() + 'px';
        el.style.height = data.height.toString() + 'px';
    };
    ;
    WidgetSendButtonContainer.prototype.onPostMessageChangeUrl = function (data) {
        if (!data.url) {
            return;
        }
        window.location.assign(data.url);
    };
    ;
    WidgetSendButtonContainer.prototype.clear = function () {
        var alreadyElem = document.getElementById(this.params.wrapperId);
        if (null !== alreadyElem) {
            var parent = alreadyElem.parentNode;
            parent.removeChild(alreadyElem);
        }
    };
    ;
    WidgetSendButtonContainer.prototype.buildWidget = function () {
        this.clear();
        var iframe = document.createElement('iframe');
        iframe.id = WidgetSendButtonContainer.getIframeId(this.params.wrapperId);
        iframe.setAttribute("src", this.getWidgetUrl());
        var wrapDiv = WidgetDOM.addDiv(this.params.wrapperId, iframe, false);
        WidgetDOM.setClass(wrapDiv, 'wh-widget-' + this.options.position);
        this.container = wrapDiv;
        if (this.params.isMobile && !WidgetDOM.isViewportExist()) {
            WidgetDOM.addMeta('wh-viewport');
        }
    };
    WidgetSendButtonContainer.getIframeId = function (idContainer) {
        return idContainer + '-iframe';
    };
    WidgetSendButtonContainer.prototype.getWidgetUrl = function () {
        var showHelloPopup = 0;
        if (!Cookie.check(WidgetSendButtonContainer.cookieName)) {
            showHelloPopup = 1;
            Cookie.set(WidgetSendButtonContainer.cookieName, "1", WidgetSendButtonContainer.cookieExpire);
        }
        var options = WidgetHelper.extend({}, this.options, {
            parentWrapperId: this.params.wrapperId,
            clientHostname: this.params.clientHostname,
            showHelloPopup: showHelloPopup,
            isMobile: this.params.isMobile ? 1 : 0,
        });
        return this.params.host + '/widget/wSendButton?' + WidgetHelper.encodeGetParams(options);
    };
    WidgetSendButtonContainer.prototype.addStyles = function () {
        WidgetDOM.addStyle(this.getStyles());
    };
    ;
    WidgetSendButtonContainer.prototype.getStyles = function () {
        return '\
    #' + this.params.wrapperId + ' {\
        margin: 0 !important;\
        padding: 0 !important;\
        position: fixed !important;\
        z-index: 16000160 !important;\
        bottom: 0 !important;\
        text-align: center !important;\
        height: 90px;\
        width: 60px;\
        visibility: visible;\
    }\
    #' + this.params.wrapperId + '.wh-widget-right {\
        right: 0;\
    }\
    #' + this.params.wrapperId + '.wh-widget-left {\
        left: 10px;\
    }\
    #' + this.params.wrapperId + ' iframe {\
        width: 100%;\
        height: 100%;\
        border: 0;\
    }\
div.clear {\
    clear: both;\
}\
';
    };
    return WidgetSendButtonContainer;
}());
WidgetSendButtonContainer.cookieName = 'wh-widget-cookie';
WidgetSendButtonContainer.cookieExpire = 1 * 24 * 60 * 60;
