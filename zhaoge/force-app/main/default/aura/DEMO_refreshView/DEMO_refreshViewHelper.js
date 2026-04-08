({
  addParamDyna: function (obj, key) {
    obj[`${key}_Answer`] = `${key + 10}`;
    return obj;
  }
});