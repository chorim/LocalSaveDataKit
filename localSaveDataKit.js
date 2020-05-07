/**
 * LocalSaveDataKit.
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
    uniqueId: 'lsdk'
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
            t.cookie.set(t.options.uniqueId + '_scroll', parseInt($(window).scrollTop()), t.options.expireSeconds);
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
            // console.log('element', element);
            var value = tagName === "ul" ? e.find('li.localSaveData-selected a').data('value') : e.val();
            // console.log(tagName, value);
            if (value !== undefined && value !== '') {
                t.cookie.set(t.options.uniqueId + '_' + id, value, t.options.expireSeconds);
            }
        }
    });
};

LocalSaveDataKit.prototype.raw = function (id, value) {
    var t = this;
    t.cookie.set(t.options.uniqueId + '_' + id, value, t.options.expireSeconds);
};

LocalSaveDataKit.prototype.rawGet = function (id) {
    var t = this;
    return t.cookie.get(t.options.uniqueId + '_' + id);
}
LocalSaveDataKit.prototype.load = function (callback) {
    var t = this;
    $('.localSaveData').each(function (index, element) {
        var e = $(element);
        var id = e.attr('id');
        if (id !== undefined) {
            var value = t.cookie.get(t.options.uniqueId + '_' + id);
            if (value !== undefined && value !== '') {
                $('#' + id + '.localSaveData').val(value);
            }
        }
    });
    if (typeof callback == 'function') callback();
};
LocalSaveDataKit.prototype.loadScroll = function () {
    var t = this;
    var height = t.cookie.get(t.options.uniqueId + '_scroll');
    if (!height) return;
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