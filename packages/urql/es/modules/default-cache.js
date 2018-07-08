export var defaultCache = function defaultCache(store) {
  return {
    invalidate: function invalidate(hash) {
      return new Promise(function (resolve) {
        delete store[hash];
        resolve(hash);
      });
    },
    invalidateAll: function invalidateAll() {
      return new Promise(function (resolve) {
        store = {};
        resolve();
      });
    },
    read: function read(hash) {
      return new Promise(function (resolve) {
        resolve(store[hash] || null);
      });
    },
    update: function update(callback) {
      return new Promise(function (resolve) {
        if (typeof callback === 'function') {
          Object.keys(store).forEach(function (key) {
            callback(store, key, store[key]);
          });
        }

        resolve();
      });
    },
    write: function write(hash, data) {
      return new Promise(function (resolve) {
        store[hash] = data;
        resolve(hash);
      });
    }
  };
};