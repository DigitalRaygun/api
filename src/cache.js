// Currently unused
module.exports = (function() {
    var dnsCache = null;

    return {
        GetDnsCache: function () {
            console.log(`GetDnsCache called: ${dnsCache}`);
            return dnsCache;
        },
        WriteDnsCache: function (data) {
            console.log(`WriteDnsCache called`); //: dnsCache: ${dnsCache} data: ${data}`);
            dnsCache = data;
        }
    }

}());