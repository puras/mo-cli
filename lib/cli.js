var Cli = module.exports,
    colors = require('colors'),
    optimist = require('optimist'),
    settings = require('../package.json'),
    Tasks = require('./tasks/cli_tasks');

Cli.Tasks = TASKS = Tasks;

Cli.run = function run(processArgv) {
    try {
        var argv = optimist(processArgv.slice(2)).argv;

        Cli.setUpConsoleLoggingHelpers();

        if ((argv.version || argv.v) && !argv._.length) {
            return Cli.version();
        }

        if (argv.help || argv.h) {
            return Cli.printHelpLines();
        }

        var task_setting = Cli.tryBuildingTask(argv);
        if (!task_setting) {
            return Cli.printAvailableTasks();
        }

        var bool_opts = Cli.getBooleanOptionsForTask(task_setting);

        // TODO slice的作用
        argv = optimist(processArgv.slice(2)).boolean(bool_opts).argv;

        var module = Cli.lookupTask(task_setting.module);
        var instance = new module();
        var promise = instance.run(Cli, argv);
        return promise;
    } catch (ex) {
        console.log(ex);
        // return Utils.fail(ex);
    }
};

Cli.setUpConsoleLoggingHelpers = function setUpConsoleLoggingHelpers() {
    colors.setTheme({
        silly: 'rainbow',
        input: 'grey',
        small: 'grey',
        verbose: 'cyan',
        prompt: ['yellow', 'bold'],
        info: 'white',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    });

    var console_info = console.info;
    console.info = function() {
        if (arguments.length === 1 && !arguments[0]) return;
        var msg = '';
        for (var n in arguments) {
            msg += arguments[n] + ' ';
        }
        console_info.call(console, msg.blue.bold);
    };

    var console_error = console.error;
    console.error = function() {
        if (arguments.length === 1 && !arguments[0]) return;
        var msg = ' ✗';
        for (var n in arguments) {
            msg +=  ' ' + arguments[n];
        }
        console_error.call(console, msg.red.bold);
    };
    console.success = function() {
        if (arguments.length === 1 && !arguments[0]) return;
        var msg = ' ✓';
        for (var n in arguments) {
            msg +=  ' ' + arguments[n];
        }
        console.log(msg.green.bold);
    };
};

Cli.printMo = function printMo() {
    var w = function(s) {
        process.stdout.write(s.green);
    };

    w(' ██████          ██████   ██████████████\n');
    w(' ██  ██████████████  ██   ██          ██\n');
    w(' ██                  ██   ██  ██████  ██\n');
    w(' ██  ██████  ██████  ██   ██  ██  ██  ██\n');
    w(' ██  ██  ██  ██  ██  ██   ██  ██  ██  ██\n');
    w(' ██  ██  ██  ██  ██  ██   ██  ██  ██  ██\n');
    w(' ██  ██  ██████  ██  ██   ██  ██  ██  ██\n');
    w(' ██  ██          ██  ██   ██  ██  ██  ██\n');
    w(' ██  ██          ██  ██   ██  ██████  ██\n');
    w(' ██  ██          ██  ██   ██          ██\n');
    w(' ██████          ██████   ██████████████  CLI v'+ settings.version + '\n');
};

Cli.printAvailableTasks = function printAvailableTasks() {
    Cli.printMo();

    process.stderr.write('\nUsage: mo task args\n\n=======================\n\n');

    if (process.argv.length > 2) {
        process.stderr.write((process.argv[2] + ' is not a valid task\n\n').bold.red);
    }

    process.stderr.write('Available tasks: '.bold);
    process.stderr.write('(use --help or -h for more info)\n\n');

    // TODO print task info
    for (var i = 0; i < Cli.Tasks.length; i++) {
        var task = Cli.Tasks[i];
        if (task.summary) {
            var name = '   ' + task.name + '   ';
            var dots = '';
            while ((name + dots).length < 20) {
                dots += '.';
            }
            process.stderr.write(name.green.bold + dots.grey + '  ' + task.summary.bold + '\n');
        }
    }

    process.stderr.write('\n');
    Cli.processExit(1);
};

Cli.version = function version() {
    console.log(settings.version + '\n');
};

Cli.printHelpLines = function printHelpLines() {
    Cli.printMo();

    process.stderr.write('\n=======================\n\n');
};

Cli.tryBuildingTask = function tryBuildingTask(argv) {
    if (argv._.length === 0) {
        return false;
    }
    var task_name = argv._[0];

    return Cli.getTaskWithName(task_name);
};

Cli.getTaskWithName = function getTaskWithName(name) {
    for (var i = 0; i < Cli.Tasks.length; i++) {
        var t = Cli.Tasks[i];
        if (t.name === name) {
            return t;
        }
        if (t.alt) { // task alt = 简写,如list alt is ls
            for (var j = 0; j < t.alt.length; j++) {
                var alt = t.alt[j];
                if (alt === name) {
                    return t;
                }
            }
        }
    }
};

Cli.getBooleanOptionsForTask = function getBooleanOptionsForTask(task) {
    var available_task_opts = task.options;
    var bool_opts = [];

    if (available_task_opts) {
        for (var key in available_task_opts) {
            if (typeof available_task_opts[key] == 'string') {
                continue;
            }
            var opt_with_pipe = key;
            var opts_split = opt_with_pipe.split('|');
            bool_opts.push(opts_split[0].substring(2));
            if (opts_split.length == 2) {
                bool_opts.push(opts_split[1].substring(1));
            }
        }
    }
    return bool_opts;
};

Cli.lookupTask = function lookupTask(module) {
    try {
        var task = require(module).MoTask;
        return task;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
};

Cli.processExit = function processExit(code) {
    // TODO 这块是干啥的,我也没弄明白哈
};

Cli.fail = function fail(err, help) {
    console.error('An error->' + err);
    console.success('An error->' + err);
    process.exit(1);
    return '';
};