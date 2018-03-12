/**
 * 预警模拟文件
 */
'use strict'
const moment = require('moment')
const Mock = require('mockjs')
let now = new Date().valueOf()
Mock.mock(`@increment(${now})`)

const jsonfile = require('jsonfile')
let realKData = null
jsonfile.readFile('./mock/data/NTES.json', function (err, obj) {
	realKData = obj
})

module.exports = {
	//分时数据
	'lineQuote': {
		response: function(req,res){
			return {
				'retcode':200,
				'retdesc':'',
				'data':{
					'result|200':[
						[
							'@increment(60000)',
							'@float(50,80,2,2)'
						]
					]
				}
			}
		}
	},

	//K线数据
	'kLineQuote': {
		response: function(req,res){
			return {
				'retcode':200,
				'retdesc':'',
				'data':{
					'version':'',
					'totalCount':0,
					'result': realKData
				}
			}
		}
	}
}