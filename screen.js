/**
 * Screen to add messages in front of the canvas
 * @author Sebastián Sanabria Díaz
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.screen = ABSULIT.screen || (function () {
    'use strict';
    var object = {},
        container,
        id = 'absulit.screen';

    object.material = null;
    object.init = function (html) {
        container = document.createElement('div');
        html = html || '';
        container.id = id;
        container.style.position = 'absolute';
        //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        container.style.width = '100%';
        container.style.height = '100%';
        //container.style.backgroundColor = 'rgba(225, 225, 225, .8)';
        container.innerHTML = html;
        document.body.appendChild(container);
    };

    object.remove = function () {
        document.getElementById(id).outerHTML = '';
    };

    object.update = function () {

    };

    return object;

})();
