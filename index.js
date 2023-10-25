const { RuleEngine } = require("node-rules");
const { config:issuanceConfig } = require("./rules-config/issuance.config");

function checkOrgAllowedSchema(orgDid, schemaId) {
  return issuanceConfig[orgDid] != undefined ? 
  issuanceConfig[orgDid].some((data) => data == schemaId) 
  : false;
}

let fact = {
  orgDid: "",
  schemaId: "",
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

async function getOrgDid() {
  return new Promise((resolve, reject) => {
    resolve("def456");
  });
}

async function getSchemaId() {
  return new Promise((resolve, reject) => {
    resolve("schemaY");
  });
}

async function main() {
  fact.orgDid = await getOrgDid();
  fact.schemaId = await getSchemaId();
  R.execute(fact, function (data) {
    if (data.result !== false) {
      console.log("Valid issuance");
    } else {
      console.log("Blocked Reason:" + data.reason);
    }
  });
}

main();
