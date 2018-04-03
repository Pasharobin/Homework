function HashStorage() {
    var self = this;
    var storage = {};
    self.addValue = function (k, v) {
        storage[k] = v;
    }
    self.getValue = function (k) {
        return (k in storage) ? storage[k] : false;
    }
    self.deleteValue = function (k) {
        if (k in storage) {
          delete storage[k];
          return true;
        } else return false;
    }
    self.getKeys = function () {
        var arr = [];
        for (var n in storage) {
            arr.push(" " + n);
        }
        return arr;
    } 
}
