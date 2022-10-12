var paths = {
    /* TODO: register all AMD modules by providing CamelCase aliases, exceptions are RequireJS plugins and named AMD modules, whose names are fixed */
    /* follow files dictionary order */
    'jquery': 'jquery',
    'knockout': 'knockout',
    "flyweight": "flyweight",
};

require.config({
    paths: paths,
    shim: {
        'flyweight': {
            deps: ['jquery', 'knockout']
        }
    },
    waitSeconds: 150
});
