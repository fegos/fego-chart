//将csv转化为json脚本
let fs = require('fs');
let parse = require('csv-parse');
let jsonfile = require('jsonfile')

function writeJSON(name){
	let csvData = [];
	fs.createReadStream(name+'.csv')
	.pipe(parse({ delimiter: ':' }))
	.on('data', function (csvrow) {
		let row = csvrow[0].split(',');
		row[0] = new Date(row[0]).valueOf()
		csvData.push(row)
	})
	.on('end', function () {
		csvData.shift(0)
		// csvData = JSON.stringify(csvData)
		let outputFile = name + '.json'
		jsonfile.writeFile(outputFile,csvData,(err)=>{
			console.log(err)
		})
	});
}

function readJSON(inputFile){
	jsonfile.readFile(inputFile, function (err, obj) {
		console.dir(obj)
	})
}

// writeJSON('NTES')
// readJSON('NTES.json')