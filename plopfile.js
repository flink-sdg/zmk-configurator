const _ = require('lodash');

module.exports = function (plop) {
    plop.setHelper('pascalCase', (value) => {
        return _.upperFirst(_.camelCase(value));
    });
    plop.setHelper('kebabCase', (value) => {
        return _.kebabCase(value);
    });

    plop.setGenerator('Component', {
        description: 'Creates a component.', prompts: [{
            type: 'input', name: 'name', message: 'Component name:'
        }], actions: [{
            type: 'add', path: 'src/components/{{name}}.vue', templateFile: 'plop/component.hbs'
        }]
    });

    plop.setGenerator('View', {
        description: 'Creates a view.', prompts: [{
            type: 'input', name: 'name', message: 'View name:'
        }], actions: [{
            type: 'add', path: 'src/views/{{name}}.vue', templateFile: 'plop/view.hbs'
        }]
    });

    plop.setGenerator('Service: Singleton', {
        description: 'Creates a singleton service.', prompts: [{
            type: 'input', name: 'name', message: 'Singleton service name:'
        }], actions: [{
            type: 'add', path: 'src/services/{{name}}.service.ts', templateFile: 'plop/service.singleton.hbs'
        }, {
            type: 'append', path: 'src/services/index.ts', templateFile: 'plop/service.index.hbs'
        }]
    });

    plop.setGenerator('Service: General', {
        description: 'Creates a general service.', prompts: [{
            type: 'input', name: 'name', message: 'General service name:'
        }], actions: [{
            type: 'add', path: 'src/services/{{name}}.service.ts', templateFile: 'plop/service.general.hbs'
        }, {
            type: 'append', path: 'src/services/index.ts', templateFile: 'plop/service.index.hbs'
        }]
    });

    plop.setGenerator('Model', {
        description: 'Creates a simple model.', prompts: [{
            type: 'input', name: 'name', message: 'Model name:'
        }], actions: [{
            type: 'add', path: 'src/models/{{name}}.types.ts', templateFile: 'plop/model.hbs'
        }, {
            type: 'append', path: 'src/models/index.ts', templateFile: 'plop/model.index.hbs'
        }]
    });
};
