/**
 * Created by puras on 16/4/1.
 */
var Task = require('./task').Task;

var MoTask = function() {};
MoTask.prototype = new Task();

MoTask.prototype.run = function run(mo, argv) {
    mo.printHelpLines();

    if (argv.list || argv.l) {
        console.log('List starter templates available');
        return;
    }

    if (argv._.length < 2) {
        return mo.fail('Invalid command', 'start');
    }

    if (argv._[1] == '.') {
        console.log('Please name your Mo project something meaningful other than \'.\''.red);
        return;
    }
};

exports.MoTask = MoTask;