const { DefaultAzureCredential } = require("@azure/identity");
const { DnsManagementClient } = require("@azure/arm-dns");

// when deployed to an azure host the default azure credential will authenticate the specified user assigned managed identity
const credential = new DefaultAzureCredential();

module.exports.dnsClient = new DnsManagementClient(credential, process.env["AZURE_SUBSCRIPTION_ID"]);
module.exports.azureDefaultCredential = credential;