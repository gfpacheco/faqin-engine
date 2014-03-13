module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('default', ['clean', 'coffee']);

    grunt.initConfig({
        clean: ['fuckin-engine.js'],

        coffee: {
            options: {
                join: true,
                bare: true
            },
            dist: {
                files: [
                    {
                        src: [
                            'fuckin/fuckin.coffee',
                            'fuckin/helpers.coffee',
                            'fuckin/event-dispatcher.coffee',
                            'fuckin/vector.coffee',
                            'fuckin/bitmap.coffee',
                            'fuckin/solid.coffee',
                            'fuckin/rect.coffee',
                            'fuckin/viewport.coffee',
                            'fuckin/engine.coffee'
                        ],
                        dest: 'fuckin-engine.js'
                    }
                ]
            }
        }
    });

};
