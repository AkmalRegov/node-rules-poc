const { RuleEngine } = require("node-rules");
const { config:issuanceConfig } = require("./rules-config/issuance.config");

function checkOrgAllowedSchema(orgDid, schemaId) {
  return issuanceConfig[orgDid] != undefined ? 
  issuanceConfig[orgDid].some((data) => data == schemaId) 
  : false;
}

fact = {
  orgDid: "def456",
  schemaId: "schemaX",
};

var R = new RuleEngine();

var issuanceRule = {
  condition: function (R, fact) {
    R.when(checkOrgAllowedSchema(fact.orgDid, fact.schemaId) == false);
  },
  consequence: function (R, fact) {
    fact.result = false;
    fact.reason = `The issuance was blocked as orgDid ${fact.orgDid} does not have the permission to use schemaId ${fact.schemaId}`;
    R.stop();
  },
};

R.register(issuanceRule);

R.execute(fact, function (data) {
  if (data.result !== false) {
    console.log("Valid issuance");
  } else {
    console.log("Blocked Reason:" + data.reason);
  }
});
