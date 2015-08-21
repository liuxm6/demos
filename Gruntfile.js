module.exports = function (grunt) {
  'use strict';
  var configBridge = grunt.file.readJSON('./grunt/configBridge.json', { encoding: 'utf8' });
  //配置
  grunt.initConfig({
    // 信息.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under the <%= pkg.license %> license\n' +
            ' */\n',
    // 清理.
    clean: {
      assets: 'apps/assets',
      modules: 'modules/<%= pkg.name %>',
      apps: 'modules/apps'
    },
    // 合并
    concat: {
      options: {
        banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
        stripBanners: false
      },
      demos: {
        src: [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js'
        ],
        dest: 'modules/<%= pkg.name %>/<%= pkg.version %>/<%= pkg.name %>.js'
      },
      seajs: {
        src: [
          'static/seajs/<%= pkg.version %>/dist/util.js',
          'static/seajs/<%= pkg.version %>/dist/main.js'
        ],
        dest: 'static/seajs/<%= pkg.version %>/dist/main.dist.js'
      }
    },
    // JS压缩
    uglify: {
      options: {
        compress: {
          warnings: false
        },
        mangle: true,
        preserveComments: 'some'
      },
      core: {
        src: '<%= concat.demos.dest %>',
        dest: 'modules/<%= pkg.name %>/<%= pkg.version %>/<%= pkg.name %>.min.js'
      },
      seajs: {
        src: '<%= concat.seajs.dest %>',
        dest: 'modules/apps/seajs/<%= pkg.version %>/main.js'
      }
    },
    // less
    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>.css.map',
          sourceMapFilename: 'apps/assets/css/<%= pkg.name %>.css.map'
        },
        src: 'less/<%= pkg.name %>.less',
        dest: 'apps/assets/css/<%= pkg.name %>.css'
      },
      compileTheme: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: '<%= pkg.name %>-theme.css.map',
          sourceMapFilename: 'apps/assets/css/<%= pkg.name %>-theme.css.map'
        },
        src: 'less/theme.less',
        dest: 'apps/assets/css/<%= pkg.name %>-theme.css'
      }
    },
    // 浏览器前缀处理
    autoprefixer: {
      options: {
        browsers: configBridge.config.autoprefixerBrowsers
      },
      core: {
        options: {
          map: true
        },
        src: 'apps/assets/css/<%= pkg.name %>.css'
      },
      theme: {
        options: {
          map: true
        },
        src: 'apps/assets/css/<%= pkg.name %>-theme.css'
      }
    },
    // 排序
    csscomb: {
      options: {
        config: 'less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'apps/assets/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'apps/assets/css/'
      }
    },
    // 语法检查
    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      dist: [
        'apps/assets/css/<%= pkg.name %>.css',
        'apps/assets/css/<%= pkg.name %>-theme.css'
      ]
    },
    // CSS压缩
    cssmin: {
      options: {
        compatibility: 'ie8',
        keepSpecialComments: '*',
        advanced: false
      },
      minifyCore: {
        src: 'apps/assets/css/<%= pkg.name %>.css',
        dest: 'apps/assets/css/<%= pkg.name %>.min.css'
      },
      minifyTheme: {
        src: 'apps/assets/css/<%= pkg.name %>-theme.css',
        dest: 'apps/assets/css/<%= pkg.name %>-theme.min.css'
      }
    },
    // 具名
    transport: {
        seajs: {
            options: {
                relative: true,
                format: 'apps/seajs/<%= pkg.version %>/{{filename}}'
            },
            files: [{
                'cwd':'static/seajs/<%= pkg.version %>/src/',
                'src':['main.js', 'util.js'],
                'dest':'static/seajs/<%= pkg.version %>/dist/'
            }]
        }
    },
    // 复制
    copy: {
      fonts: {
        expand: true,
        src: 'fonts/*',
        dest: 'apps/assets/'
      },
      js: {
        expand: true,
        src: 'modules/**',
        dest: 'apps/assets/'
      }
    },
    // 打包
    compress: {
      main: {
        options: {
          archive: '<%= pkg.name %>-<%= pkg.version %>.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'apps',
            src: ['**'],
            dest: '<%= pkg.name %>-<%= pkg.version %>'
          }
        ]
      }
    }
  });

  //插件检测
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  var runSubset = function (subset) {
    return !process.env.TWBS_TEST || process.env.TWBS_TEST === subset;
  };
  var isUndefOrNonZero = function (val) {
    return val === undefined || val !== '0';
  };

  // CSS处理
  grunt.registerTask('less-compile', ['less:compileCore', 'less:compileTheme']);
  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:core', 'autoprefixer:theme','csscomb:dist','cssmin:minifyCore', 
  'cssmin:minifyTheme']);
  // JS处理
  grunt.registerTask('dist-js', ['concat:demos', 'uglify:core','transport:seajs','concat:seajs','uglify:seajs']);
  // 默认任务
  grunt.registerTask('default', ['clean:assets','clean:modules','clean:apps']);
  // 生成生产环境
  grunt.registerTask('dist', ['clean:assets','clean:modules','clean:apps','dist-css', 'copy:fonts', 'dist-js','copy:js','csslint:dist']);
  // 测试
  grunt.registerTask('test',['csslint:dist']);
  // 打包项目
  grunt.registerTask('zip',['compress']);
};
