var express = require('express');
var router = express.Router();

const { DefaultAzureCredential } = require("@azure/identity");
const { DnsManagementClient } = require("@azure/arm-dns");

// TODO: Determine get/post

//console.log('JavaScript HTTP trigger function processed a request.');

//let outputText = 'Hi!     -The API';

// when deployed to an azure host the default azure credential will authenticate the specified user assigned managed identity
const credential = new DefaultAzureCredential();
const dnsClient = new DnsManagementClient(credential, process.env["AZURE_SUBSCRIPTION_ID"]);

const recordTypes = ["A", "NS", "CNAME"];

async function dnsEntries(req, res, next) {
    let dnsMappings = [{
        "name": "stub",
        "type": "stub",
    }];
    try {
        for (const recordType of recordTypes) {
            const results = await dnsClient.recordSets.listByType(process.env["AZURE_RESOURCE_GROUP"], process.env["AZURE_DNS_ZONE"], recordType)
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(err => {
                console.error(err);
                throw err;
            });

            for (const result of results) {
                dnsMappings.push({
                    name: result.name,
                    fqdn: result.fqdn,
                });
            }
        }
    } catch (err) {
        throw new Error(err);
    } finally {
        req.dnsMappings = dnsMappings;
        next();
    }
}

router.use(dnsEntries);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(req.dnsMappings);
});

module.exports = router;
