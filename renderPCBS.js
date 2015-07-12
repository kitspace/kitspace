var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/pcbs/bus-pirate/images/top.svg', function(err, data) {
    parser.parseString(data, function (err, result) {
        var props = result.svg.$;
        console.log(parseFloat(props.width)/parseFloat(props.height));
    });
});
