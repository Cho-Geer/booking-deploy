/* eslint-disable no-console */
({
  loadContact: function (cmp, event) {
    event.preventDefault();
    console.log("lastName", cmp.find("lastName").get("v.value"));
    console.log("firstName", cmp.find("firstName").get("v.value"));
    cmp.find("accountId").set("v.value", cmp.get("v.recordId"));
  },
  handleSuccess: function (c, e, h) {
    let obj = {};
    let intMo = [1,2,3,4,5];
    for(let key of intMo){
      obj = h.addParamDyna(obj, key);
    }
    console.log(obj);
    $A.get("e.force:refreshView").fire();
  }
});