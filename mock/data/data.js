/**
 * 预警模拟文件
 */
'use strict'
const moment = require('moment')
const Mock = require('mockjs')
const jsonfile = require('jsonfile')

let realKData = null
jsonfile.readFile('./mock/data/NTES.json', function (err, obj) {
	realKData = obj
})

let now;
now = new Date(2017,8,1,5,59,0).valueOf()
Mock.mock(`@increment(${now})`)

module.exports = {
	//分时数据
	'lineQuote': {
		response: function (req, res) {
			return {
				'retcode': 200,
				'retdesc': '',
				'data': {
					'version': '1234567890',
					'preClosedPrice': '60',
					'totalCount': '200',
					'result|200': [
						[
							'@increment(60000)',
							'@float(50,80,2,2)',
							'@float(55,75,2,2)'
						]
					]
				}
			}
		}
	},

	//K线数据
	'kLineQuote': {
		response: function (req, res) {
			return {
				'retcode': 200,
				'retdesc': '',
				'data': {
					'version': '',
					'totalCount': 0,
					'result': realKData
				}
			}
		}
	},

	//五日分时数据
	'fiveDayQuote': {
		response: function (req, res) {
			return {
				'retcode': 200,
				'retdesc': '',
				'data': {
					"result":[
						{
							"lastClosePrice|500-600.2":1,
							"totalCount":1320,
							"version":"",
							"result|1320":[[
								'@increment(60000)',
								'@float(500,600,2,2)',
								'@float(500,600,2,2)',
								'@float(0,50,2,2)',
								'',
								0
							]]
						},
						{
							"lastClosePrice|500-600.2":1,
							"totalCount":1320,
							"version":"",
							"result|1320":[[
								'@increment(60000)',
								'@float(500,600,2,2)',
								'@float(500,600,2,2)',
								'@float(0,50,2,2)',
								'',
								0
							]]
						},
						{
							"lastClosePrice|500-600.2":1,
							"totalCount":1320,
							"version":"",
							"result|1320":[[
								'@increment(60000)',
								'@float(500,600,2,2)',
								'@float(500,600,2,2)',
								'@float(0,50,2,2)',
								'',
								0
							]]
						},
						{
							"lastClosePrice|500-600.2":1,
							"totalCount":1320,
							"version":"",
							"result|1320":[[
								'@increment(60000)',
								'@float(500,600,2,2)',
								'@float(500,600,2,2)',
								'@float(0,50,2,2)',
								'',
								0
							]]
						},
						{
							"lastClosePrice|500-600.2":1,
							"totalCount":1320,
							"version":"",
							"result|1-1320":[[
								'@increment(60000)',
								'@float(500,600,2,2)',
								'@float(500,600,2,2)',
								'@float(0,50,2,2)',
								'',
								0
							]]
						}
					]
				}
			}

		}
	}
}