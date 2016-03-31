var Cli = module.exports,
    colors = require('colors'),
    optimist = require('optimist')
    settings = require('../package.json');

Cli.run = function run(processArgv) {
    console.log('in Cli.run');

    var argv = optimist(processArgv.slice(2)).argv;

    if ((argv.version || argv.v) && !argv._.length) {
        return Cli.version();
    }

    if (argv.help || argv.h) {
        return Cli.printHelpLines();
    }

    var taskSetting = Cli.tryBuildingTask(argv);
    if (!taskSetting) {
        return Cli.printAvailableTasks();
    }



};

Cli.printMo = function printMo() {
    var w = function(s) {
        process.stdout.write(s);
    };

    w('  _             _     \n');
    w(' (_)           (_)     \n');
    w('  _  ___  _ __  _  ___ \n');
    w(' | |/ _ \\| \'_ \\| |/ __|\n');
    w(' | | (_) | | | | | (__ \n');
    w(' |_|\\___/|_| |_|_|\\___|  CLI v'+ settings.version + '\n');
};

Cli.printAvailableTasks = function printAvailableTasks() {
    Cli.printMo();

    process.stderr.write('\nUsage: ionic task args\n\n=======================\n\n');

    if (process.argv.length > 2) {
        process.stderr.write((process.argv[2] + ' is not a valid task\n\n').bold.red);
    }

    process.stderr.write('Available tasks: '.bold);
    process.stderr.write('(use --help or -h for more info)\n\n');

    // TODO print task info

    process.stderr.write('\n');
    Cli.processExit(1);
};

Cli.version = function version() {
    console.log(settings.version + '\n');
};

Cli.printHelpLines = function printHelpLines() {
    Cli.printMo();

    process.stderr.write('\n=======================\n');
};

Cli.tryBuildingTask = function tryBuildingTask(argv) {
    if (argv._.length === 0) {
        return false;
    }
    var task_name = argv._[0];
    console.log('Task Name is ' + task_name);
    return true;
};

Cli.processExit = function processExit(code) {
    // TODO 这块是干啥的,我也没弄明白哈
};