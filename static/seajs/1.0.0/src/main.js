define(function(require, exports, module){
    require('jquery');
    var util = require('./util');
    setInterval(function() {
        $('#box').css('background-color',util.randomColor());
    }, 1500);
});