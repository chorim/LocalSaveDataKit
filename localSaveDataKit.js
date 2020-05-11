/**
 * LocalSaveDataKit.
 *
 * @ref https://github.com/chorim/LocalSaveDataKit/blob/master/README.md
 *
 * @class
 *
 * @param {Object} options Object with options.
 *
 */
function LocalSaveDataKit(options) {
    var t = this;
    // Extend options
    t.options = $.extend({}, t.options, options);
}
LocalSaveDataKit.prototype.options = {
    scroll: false,
    expireSeconds: 30,
    uniqueId: 'lsdk',
    activeClass: 'on'
};

// 라이브러리 내에서 사용될 변수
LocalSaveDataKit.prototype.vars = {
    isScrollLock: true, // 스크롤 위치 저장 락. loadScroll 호출이 되어야 스크롤 위치를 저장합니다.
    ulTypes: 0 // ul > li > a 가 1번, ul > li 가 2번
};
/**
 * Init library
 *
 * @param {Function} loadMapCallback When loaded a save data, execute a callback.
 * @return {Void}
 */
LocalSaveDataKit.prototype.init = function (loadMapCallback) {
    var t = this;
    t.load(function () {
        if (typeof loadMapCallback == 'function') loadMapCallback();
    });
    if (t.options.scroll) {
        $(window).scroll($.throttle(1000, function () {
            if (!t.vars.isScrollLock) t.cookie.set(t.options.uniqueId + '_scroll', parseInt($(window).scrollTop()), t.options.expireSeconds);
        }));
    }
};
/**
 * Store a data at cookie container
 *
 * @return {Void}
 */
LocalSaveDataKit.prototype.save = function () {
    var t = this;
    $('.localSaveData').each(function (index, element) {
        var e = $(element);
        var id = e.attr('id');
        if (id !== undefined) {
            var tagName = e.prop('tagName').toLowerCase();
            var type = e.attr('type');
            var value = e.val();

            switch (tagName) {
                case "ul":
                    // li 안에 a 태그를 사용중인지, li 만 사용중인지 체크.
                    // 사이트 내에서 li > a 아니면 li만 사용하고 있음.
                    var selectedElement = e.find('li.localSaveData-selected a');
                    value = selectedElement.length >= 1 ?
                        selectedElement.data('value') :
                        e.find('li.localSaveData-selected').data('value');
                    if (value === undefined || value === '') return true;
                    break;
                case "input":
                    if (type === "checkbox") value = e.is(":checked");
                    else if (type === "text") value = e.val();
                    break;
                default:
                    if (value === undefined || value === '') return true;
                    break;
            }
            t.cookie.set(t.options.uniqueId + '_' + id, value, t.options.expireSeconds);
        }
    });
};

/**
 * 수동으로 쿠키를 저장합니다
 * 
 * @deprecated
 */
LocalSaveDataKit.prototype.raw = function (id, value) {
    this.setCookie(id, value);
};

LocalSaveDataKit.prototype.setCookie = function (id, value) {
    var t = this;
    t.cookie.set(t.options.uniqueId + '_' + id, value, t.options.expireSeconds);
}

/**
 * 수동으로 쿠키를 가져옵니다
 * 
 * @deprecated
 */
LocalSaveDataKit.prototype.rawGet = function (id) {
    return this.getCookie(id);
}

LocalSaveDataKit.prototype.getCookie = function (id) {
    var t = this;
    return t.cookie.get(t.options.uniqueId + '_' + id);
}


LocalSaveDataKit.prototype.load = function (callback) {
    var t = this;
    $('.localSaveData').each(function (index, element) {
        var e = $(element);
        var id = e.attr('id');
        if (id === undefined) return true;
        
        var tagName = e.prop('tagName').toLowerCase();
        var type = e.attr('type');
        var value = t.cookie.get(t.options.uniqueId + '_' + id);
        if (value === undefined || value === '') return true;
        var target = $('#' + id + '.localSaveData');
        switch (tagName) {
            case 'ul':
                t.ulTypes = target.find('li.localSaveData-selected a').length >= 1 ? 1 : 2;
                $('#' + id).find('li').removeClass(t.options.activeClass + ' localSaveData-selected');
                if (t.ulTypes === 1) $('#' + id).find('li a[data-value="' + value + '"]').parent().addClass(t.options.activeClass + ' localSaveData-selected');
                else if (t.ulTypes === 2) $('#' + id).find('li[data-value="' + value + '"]').addClass(t.options.activeClass + ' localSaveData-selected');
                break;
            case 'input':
                if (type === "checkbox") target.prop("checked", value === "true");
                else if (type === "text") target.val(value);
                break;
            default:
                target.val(value);
        }
        
    });
    if (typeof callback == 'function') callback();
};
LocalSaveDataKit.prototype.loadScroll = function () {
    var t = this;
    var height = t.cookie.get(t.options.uniqueId + '_scroll');
    if (!height) return;
    t.vars.isScrollLock = false;
    $(window).scrollTop(height);
};

LocalSaveDataKit.prototype.cookie = {
    set: function (name, value, expire) {
        var date = new Date();
        date.setTime(date.getTime() + (expire * 1000));
        document.cookie = name + '=' + value + ';expires=' + date.toGMTString() + ';path=/';
    },
    get: function (name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return value? value[2] : "";
    },
    del: function (name) {
        var date = new Date();
        document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
    },
    add: function (name) {}
};