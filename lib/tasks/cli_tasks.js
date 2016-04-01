/**
 * Created by puras on 16/4/1.
 */

var tasks = [
    {
        title: 'start',
        name: 'start',
        summary: 'Starts a new Mo project in the specified PATH',
        args: {
            '[options]': 'any flags for the command',
            '<PATH>': 'directory for the new project',
            '[template]': 'template'
        },
        options: {
            '--sass|-s': {
                title: 'Setup the project to use Sass CSS precompiling',
                boolean: true
            },
            '--list|-l': {
                title: 'List starter templates available',
                boolean: true
            }
        },
        module: './mo/start'
    },
    {
        title: 'serve',
        name: 'serve',
        summary: 'Start a local development server for app dev/testing',
        args: {
            '[options]': ''
        },
        options: {},
        module: './mo/serve'
    }
];

module.exports = tasks;