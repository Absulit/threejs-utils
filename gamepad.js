/**
 * @author Sebastián Sanabria Díaz
 * Gamepad controls loosely based on this MDN link:
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 */

/*global THREE, TWEEN, ABSULIT, Stats, camera, scene, loader, console, window, document */

var ABSULIT = ABSULIT || {};
ABSULIT.gamepad = ABSULIT.gamepad || (function () {
    'use strict';
    var object = {},
        gamepad = null,
        gamepads = {},
        gamepadConnected = false;

    var events = {
            A: 'A',
            B: 'B',
            X: 'X',
            Y: 'Y',

            LB: 'LB',
            RB: 'RB',
            LT: 'LT',
            RT: 'RT',

            VIEW: 'VIEW',
            MENU: 'MENU',

            LJB: 'LJB',
            RJB: 'RJB',

            UP: 'UP',
            DOWN: 'DOWN',
            LEFT: 'LEFT',
            RIGHT: 'RIGHT',

            LJX: 'LJX',
            RJX: 'RJX',

        },
        onGamepadPressedLocal;

    object.events = events;

    object.init = function (onGamepadPressed) {
        onGamepadPressedLocal = onGamepadPressed;

        window.addEventListener("gamepadconnected", function(e) {
            gamepads = getGamepads();
            gamepad = getController(gamepads, 'xbox');
            gamepadConnected = !!gamepad;
        });

        window.addEventListener("gamepaddisconnected", function(e) {
          console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);

            gamepadConnected = false;
        });

        gamepads = getGamepads();
        gamepad = getController(gamepads, 'xbox');
        gamepadConnected = !!gamepad;
        console.log("---- gamepadConnected: ", gamepadConnected);

        window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
        window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
    };

    /* -------------------- */


    function gamepadHandler(event, connecting) {
      var gamepad = event.gamepad;
      // Note:
      // gamepad === navigator.getGamepads()[gamepad.index]

      if (connecting) {
        gamepads[gamepad.index] = gamepad;
      } else {
        delete gamepads[gamepad.index];
      }
    }
    /* -------------------- */
    var buttons = {
        /*A:{},
        B:{},
        X:{},
        Y:{},

        LB:{},*/

    };

    function getGamepads(){
        return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    }

    function getController(gamepads, id){
        var gp, gpindex;
        for(gpindex in gamepads){
            gp = gamepads[gpindex];
            if((typeof gp == "object") && (gp.id.toLowerCase().indexOf(id) !== -1)){
                break;
            }
        }
        return gp;
    }



    object.update = function () {
        //gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        gamepads = getGamepads();
        /* -------------------- */
        gamepad = getController(gamepads, 'xbox');
        if(gamepadConnected){
            //console.log(gamepad.buttons[15]);
            buttons.A = gamepad.buttons[0] ;
            buttons.B = gamepad.buttons[1] ;
            buttons.X = gamepad.buttons[2] ;
            buttons.Y = gamepad.buttons[3] ;

            buttons.LB = gamepad.buttons[4] ;
            buttons.RB = gamepad.buttons[5] ;
            buttons.LT = gamepad.buttons[6] ;
            buttons.RT = gamepad.buttons[7] ;

            buttons.VIEW = gamepad.buttons[8] ;
            buttons.MENU = gamepad.buttons[9] ;

            buttons.LJB = gamepad.buttons[10] ;
            buttons.RJB = gamepad.buttons[11] ;

            buttons.UP = gamepad.buttons[12] ;
            buttons.DOWN = gamepad.buttons[13] ;
            buttons.LEFT = gamepad.buttons[14] ;
            buttons.RIGHT = gamepad.buttons[15] ;

            buttons.LJX = {x: gamepad.axes[0], y: gamepad.axes[1]};
            buttons.RJX = {x: gamepad.axes[2], y: gamepad.axes[3]};


            buttons.LJX.pressed = (Math.abs(buttons.LJX.x) > .1) || (Math.abs(buttons.LJX.y) > .1);
            buttons.RJX.pressed = (Math.abs(buttons.RJX.x) > .1) || (Math.abs(buttons.RJX.y) > .1);

            buttons.LJX.angle = Math.atan2(buttons.LJX.y, buttons.LJX.x);
            buttons.RJX.angle = Math.atan2(buttons.RJX.y, buttons.RJX.x);

            onGamepadPressedLocal(buttons);
        }


        /* -------------------- */
    };

    return object;

})();
