function stashUnstash (arg, value) {
  var clc = require('cli-color');
  var Configstore = require('configstore');
  var pkg = require('./package.json');
  var logSymbols = require('log-symbols');

  var conf = new Configstore(pkg.name);

  if (arg === 'stash') {
    require('./stats-module.js').getBalance(function (err, balance) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      if (balance - value < 0) {
        console.log(logSymbols.error + clc.red(" You don't have that much in your wallet!"));
        console.log(clc.green('Credit into the wallet, before stashing away.'));
      } else {
        conf.set('stashed', conf.get('stashed') === undefined ? 0 : conf.get('stashed') + value);
        var expenseObject = {
          reason: 'Credit into stash',
          category: 'Stash',
          credit: '',
          debit: value
        };
        console.log(logSymbols.success + clc.green(' Stashed'));
        require('./file-module.js').writeExpense(expenseObject);
      }
    });
  } else if (arg === 'unstash') {
    if (conf.get('stashed')) {
      if ((conf.get('stashed') - value) < 0) {
        console.log(logSymbols.error + clc.red(" You don't have that much in your stash!"));
      } else {
        conf.set('stashed', conf.get('stashed') - value);
        console.log(logSymbols.success + clc.green(' Withdrawn from stash, credited into the wallet!'));
        var expenseObject = {
          reason: 'Withdrawn from stash',
          category: 'Stash',
          credit: value,
          debit: ''
        };
        require('./file-module.js').writeExpense(expenseObject);
      }
    } else {
      console.log(logSymbols.error + clc.red(" You don't have that much in your stash!"));
    }
  }
}

exports.stashUnstash = stashUnstash;
