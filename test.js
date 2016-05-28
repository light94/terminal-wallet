/* global t */
import test from 'ava';

test('files are created', t => {
	var fileExists = require('file-exists');
	var xdgBasedir = require('xdg-basedir');
	var expensesFilepath = xdgBasedir.data + '/wallet/expenses.csv';
	require('./setup-files.js');
	return fileExists(expensesFilepath);
});

test('wrong date is not allowed', t => {
	var module = require('./');

	var input = ["credit", 3000, "From ATM"];
	var opts = {};

	module(input, opts);

	input = ["debit", 50, "Coffee and mufin - one more time"];
	opts = {d: "2015-5-5"};

	t.throws(function() {
		module(input, opts);
	}, "Given date is not formatted as yyyy-mm-dd");
});
