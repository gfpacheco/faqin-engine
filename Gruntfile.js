module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['clean', 'coffee']);

    grunt.initConfig({
        watch: {
            files: 'faqin/**/*.coffee',
            tasks: 'default'
        },

        clean: ['faqin-engine.js'],

        coffee: {
            options: {
                join: true,
                bare: true
            },
            dist: {
                files: [
                    {
                        src: [
                            'faqin/faqin.coffee',
                            'faqin/helpers.coffee',
                            'faqin/event-dispatcher.coffee',
                            'faqin/vector.coffee',
                            'faqin/bitmap.coffee',
                            'faqin/solid.coffee',
                            'faqin/rect.coffee',
                            'faqin/viewport.coffee',
                            'faqin/engine.coffee'
                        ],
                        dest: 'faqin-engine.js'
                    }
                ]
            }
        }
    });

};
