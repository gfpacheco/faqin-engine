fuckin.EventDispatcher = function() {
    this.registrations = {};

    this.getListeners = function(type, useCapture) {
        var captype = (useCapture? '1' : '0') + type;
        if (!(captype in this.registrations))
            this.registrations[captype] = [];
        return this.registrations[captype];
    };
};

fuckin.EventDispatcher.prototype.addEventListener = function(type, listener, useCapture) {
    var listeners = this.getListeners(type, useCapture);
    var ix = listeners.indexOf(listener);
    if (ix === -1)
        listeners.push(listener);
};

fuckin.EventDispatcher.prototype.removeEventListener = function(type, listener, useCapture) {
    var listeners = this.getListeners(type, useCapture);
    var ix = listeners.indexOf(listener);
    if (ix !== -1)
        listeners.splice(ix, 1);
};

fuckin.EventDispatcher.prototype.dispatchEvent = function(evt) {
    var listeners = this.getListeners(evt.type, false).slice();
    for (var i = 0; i < listeners.length; i++)
        listeners[i].call(this, evt);
    return !evt.defaultPrevented;
};
