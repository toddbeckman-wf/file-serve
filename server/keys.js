module.exports = {
  keys: [],
  addkey: function (name, job) {
    var key = Math.floor(Math.random()*100000);
    keys[key] = {
      name: name,
      job: job
    };
    return key;
  },
  read: function (key) {
    return keys[key];
  },
  remove: function (key) {
    delete keys[key];
  }
};