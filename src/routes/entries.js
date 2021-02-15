var express = require('express');
var azure = require('../azure');
//const cache = require('../cache');
var router = express.Router();

const dnsResourceType = "Microsoft.Network/dnszones/"
const recordTypes = ["A", "NS", "CNAME"];

const dnsResourcePaths = function () {
    return recordTypes.map(recType => `${dnsResourceType}${recType}`);
}

async function dnsEntries(req, res, next) {
    let dnsRecords = [];

    try {
        dnsRecords = await azure.dnsClient.recordSets.listAllByDnsZone(process.env["AZURE_RESOURCE_GROUP"], process.env["AZURE_DNS_ZONE"])
        .then(result => {
            return result;
        })
        .catch(err => {
            console.error(err);
            throw err;
        });

        dnsRecords.flat();
    } catch (err) {
        throw new Error(err);
    } finally {
        req.dnsRecords = dnsRecords;

        next();
    }
}

router.use(dnsEntries);

// Filter only records we care about
async function filterDnsRecords(req, res, next) {
    let dnsRecords = req.dnsRecords;
    let filteredRecords = [];

    console.log(JSON.stringify(dnsResourcePaths()));

    try {
        filteredRecords = dnsRecords.filter(record => dnsResourcePaths().includes(record.type));

    } catch (err) {
        throw new Error(err);
    } finally {
        req.dnsRecords = filteredRecords;
        next();
    }
}

router.use(filterDnsRecords);

// Post-process the fqdn because it returns a period
async function postProcessDNS(req, res, next) {
    let dnsRecords = req.dnsRecords;
    let dnsMappings = [];

    try {
        console.debug(dnsRecords);
        dnsRecords.map(record => {
            if (record.fqdn.endsWith('.'))
                record.fqdn = record.fqdn.slice(0, record.fqdn.length-1);
        });

        for (const record of dnsRecords) {
            dnsMappings.push({
                name: record.name,
                fqdn: record.fqdn,
            });
        }
    } catch (err) {
        throw new Error(err);
    } finally {
        req.dnsRecords = dnsRecords;
        req.dnsMappings = dnsMappings;
        next();
    }
}

router.use(postProcessDNS);


/* GET home page. */
router.get('/', function(req, res, next) {
    res.json(req.dnsMappings);
});

module.exports = router;
