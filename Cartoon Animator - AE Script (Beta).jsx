/**
 * Cartoon Animator - AE Script
 * @author Reallusion Inc.
 * @Copyright©2020 Reallusion Inc.
 * {@link https://www.reallusion.com/}
 * @namespace
 * @member of Reallusion Inc.
 * @license GPL-3.0
 * Cartoon Animator - AE Script is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Cartoon Animator - AE Script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Cartoon Animator - AE Script. If not, see {@link http://www.gnu.org/licenses/}.
*/
( function( thisObj ) {

    // ========================= | CTASystem | ==========================
    var CTASystem = {};
    CTASystem.debug = false;

    // for test
    CTASystem.Test = {};
    CTASystem.Test.active = false;
    CTASystem.Test.filePath = File( $.fileName ).parent.absoluteURI + "/ScriptTest/CTAExaminator.jsxinc";
    if ( CTASystem.Test.active ) {

        $.evalFile( CTASystem.Test.filePath );
    }
    CTASystem.Test.show = false;
    CTASystem.Test.ui = null;


    // ====================== | CTAScene Data  | ========================
    var CTAScene = {};

    CTAScene.version = 0.0;
    CTAScene.name = "";
    CTAScene.width = 0;
    CTAScene.height = 0;
    CTAScene.fps = 0;
    CTAScene.smartType = false;
    CTAScene.preMulti = false;
    CTAScene.loadBgm = false;
    CTAScene.Create = {};
    CTAScene.Update = {};

    CTAScene.loaded = false;

    function sceneObject() {

        this.startFrame = 0;
        this.endFrame = 0;
        this.sceneRatio = 0;
        this.camera = {}
        this.compList = [];
    }

    function camera( camLens ) {

        this.camLens = parseInt( camLens, 10 );
        this.rotObjs = [];
        this.posObjs = [];
    }

    function camRotObject( time, value ) {

        this.time = parseFloat( time / 1000 );
        this.value = parseFloat( value );
    }

    function camPosObject( time, x, y, z ) {

        this.time = parseFloat( time / 1000 );
        this.x =  parseFloat( x );
        this.y =  parseFloat( y );
        this.z =  parseFloat( z );
    }

    function composition( name, replaceTgt, isThreeD, hasAudio ) {

        this.name = name;
        this.replaceTgt = replaceTgt;
        this.isThreeD = isThreeD;
        this.hasAudio = hasAudio;
        this.compScale;
        this.compDepth = [];
        this.compObj = [];
        this.layerObjs = [];
    }

    function compObject( name, count ) {

        this.fileName = name;
        this.count = parseInt( count, 10 );
        this.pivot = [];
        this.rotObjs = [];
        this.posObjs = [];
        this.scaleObjs = [];
        this.depth = [];
    }

    function scaleValue( scaleX, scaleY, scaleZ ) {

        this.scaleX =  parseFloat( scaleX );
        this.scaleY =  parseFloat( scaleY );
        this.scaleZ =  parseFloat( scaleZ );
    }

    function layerObject( name, count, pivot ) {

        this.fileName = name;
        this.count = parseInt( count, 10 );
        this.pivotX = parseFloat( pivot.x );
        this.pivotY = parseFloat( pivot.y );
        this.posObjs = [];
        this.depth = [];
    }

    function rotObject( time, x, y, z ) {

        this.time = parseFloat( time / 1000 );
        this.x =  parseFloat( x );
        this.y =  parseFloat( y );
        this.z =  parseFloat( z );
    }

    function posObject( time, x, y, z ) {

        this.time = parseFloat( time / 1000 );
        this.x =  parseFloat( x );
        this.y =  parseFloat( y );
        this.z =  parseFloat( z );
    }

    function scaleObject( time, x, y, z ) {

        this.time = parseFloat( time / 1000 );
        this.x =  parseFloat( x );
        this.y =  parseFloat( y );
        this.z =  parseFloat( z );
    }

    function depthObject( time, value ) {

        this.time = parseFloat( time / 1000 );
        this.value = parseFloat( value );
    }

    function pivotObject( time, x, y ) {

        this.time = parseFloat( time / 1000 );
        this.x = x;
        this.y = y;
    }

    function backgroundObject( name, hasAudio, count ) {

        this.fileName = name;
        this.hasAudio = hasAudio;
        this.count = parseInt( count, 10 );
    }

    function isEmptyObject( object ) {

        for ( var key in object ) {

            return false;
        }
        return true;
    }


    CTAScene.loadJsonFile = function ( path ) {

        CTAScene.loaded = false;

        var jsonObj = CTAScene.JsPass.parseJson( path );
        if ( jsonObj == '' )  {
            return;
        }

        CTAScene.name = jsonObj.name;
        CTAScene.version = jsonObj.version;
        CTAScene.width = parseInt( jsonObj.width, 10 );
        CTAScene.height = parseInt( jsonObj.height, 10 );
        CTAScene.fps = parseFloat( jsonObj.fps );
        CTAScene.smartType = jsonObj.smartType;
        CTAScene.preMulti = jsonObj.preMulti;
        CTAScene.loadBgm = jsonObj.loadBgm;

        CTAScene.viewCornerLT = [ jsonObj.viewCornerLT.x, jsonObj.viewCornerLT.y, jsonObj.viewCornerLT.z ];
        CTAScene.viewCornerRB = [ jsonObj.viewCornerRB.x, jsonObj.viewCornerRB.y, jsonObj.viewCornerRB.z ];
        // ========================= version 1.0 ============================ //

        CTAScene.Create = new sceneObject();
        CTAScene.loadSceneData( CTAScene.Create, jsonObj.Create );

        // debug
        if ( CTASystem.Test.active ) {

            CTAScene.TestString = jsonObj.Test;
        }

        CTAScene.loaded = true;
    }

    CTAScene.loadSceneData = function ( scene, jsonScene ) {

        if ( !jsonScene ) {

            return;
        }

        scene.startFrame = parseInt( jsonScene.startFrame, 10 );
        scene.endFrame = parseInt( jsonScene.endFrame, 10 );
        scene.sceneRatio = parseFloat( jsonScene.sceneRatio );

        var i = 0;
        /////////////////////////////////////////////////
        if ( !isEmptyObject( jsonScene.camera ) ) {

            scene.camera = new camera( jsonScene.camera.camLens );

            for ( i = 0; i < jsonScene.camera.rotObjs.length; ++i ) {

                var rotObj = new camRotObject( jsonScene.camera.rotObjs[ i ].time,
                                               jsonScene.camera.rotObjs[ i ].value );
                scene.camera.rotObjs.push( rotObj );
            }

            for ( i = 0; i < jsonScene.camera.posObjs.length; ++i ) {

                var posObj = new camPosObject( jsonScene.camera.posObjs[ i ].time,
                                               jsonScene.camera.posObjs[ i ].x,
                                               jsonScene.camera.posObjs[ i ].y,
                                               jsonScene.camera.posObjs[ i ].z );
                scene.camera.posObjs.push( posObj );
            }
            // ======================= version 1.0 ========================== //
        }

        /////////////////////////////////////////////////
        scene.compList = [];

        for ( i = 0; i < jsonScene.comps.length; ++i ) {

            var comp = new composition( jsonScene.comps[ i ].name,
                                        jsonScene.comps[ i ].replaceTgt,
                                        jsonScene.comps[ i ].isThreeD,
                                        jsonScene.comps[ i ].hasAudio );

            comp.compScale = new scaleValue( jsonScene.comps[ i ].compScale.scaleX,
                                             jsonScene.comps[ i ].compScale.scaleY,
                                             jsonScene.comps[ i ].compScale.scaleZ );
            // compObj
            comp.compObj = new compObject( jsonScene.comps[ i ].compObj.fileName,
                                           jsonScene.comps[ i ].compObj.count );

            var j = 0;
            for ( j = 0; j < jsonScene.comps[ i ].compObj.pivot.length; ++j ) {

                var pivotObj = new pivotObject( jsonScene.comps[ i ].compObj.pivot[ j ].time,
                                                jsonScene.comps[ i ].compObj.pivot[ j ].x,
                                                jsonScene.comps[ i ].compObj.pivot[ j ].y );
                comp.compObj.pivot.push( pivotObj );
            }

            for ( j = 0; j < jsonScene.comps[ i ].compObj.rotObjs.length; ++j ) {

                var rotObj = new rotObject( jsonScene.comps[ i ].compObj.rotObjs[ j ].time,
                                            jsonScene.comps[ i ].compObj.rotObjs[ j ].x,
                                            jsonScene.comps[ i ].compObj.rotObjs[ j ].y,
                                            jsonScene.comps[ i ].compObj.rotObjs[ j ].z );
                comp.compObj.rotObjs.push( rotObj );
            }

            for ( j = 0; j < jsonScene.comps[ i ].compObj.posObjs.length; ++j ) {

                var posObj = new posObject( jsonScene.comps[ i ].compObj.posObjs[ j ].time,
                                            jsonScene.comps[ i ].compObj.posObjs[ j ].x,
                                            jsonScene.comps[ i ].compObj.posObjs[ j ].y,
                                            jsonScene.comps[ i ].compObj.posObjs[ j ].z );
                comp.compObj.posObjs.push( posObj );
            }

            for ( j = 0; j < jsonScene.comps[ i ].compObj.scaleObjs.length; ++j ) {

                var scaleObj = new scaleObject( jsonScene.comps[ i ].compObj.scaleObjs[ j ].time,
                                                jsonScene.comps[ i ].compObj.scaleObjs[ j ].x,
                                                jsonScene.comps[ i ].compObj.scaleObjs[ j ].y,
                                                jsonScene.comps[ i ].compObj.scaleObjs[ j ].z );
                comp.compObj.scaleObjs.push( scaleObj );
            }

            for ( j = 0; j < jsonScene.comps[ i ].compObj.depth.length; ++j ) {

                var depthLayer = new depthObject( jsonScene.comps[ i ].compObj.depth[ j ].time,
                                                  jsonScene.comps[ i ].compObj.depth[ j ].value );
                comp.compObj.depth.push( depthLayer );
            }

            // ======================= version 1.0 ========================== //

            scene.compList.push( comp );
        }

        scene.background = new backgroundObject( jsonScene.background.filename, jsonScene.background.hasAudio, jsonScene.background.count );
        // ========================= version 1.0 ============================ //
    }


    // ==================== | CTAScene Json Pass  | =====================
    CTAScene.JsPass = {};

    CTAScene.JsPass.readFile = function ( file,encoding ) {
        if ( typeof encoding === 'undefined' ) encoding = 'UTF-8';

        //open and parse file
    	file.encoding = encoding;
    	if ( !file.open( 'r' ) ) {

            return '';
         }

        var data = file.read();
    	file.close();
    	return data;
    }

    CTAScene.JsPass.parseJson = function ( file ) {
    	//open and parse file
    	var json = CTAScene.JsPass.readFile( file, 'UTF-8' );
    	if ( json == '' ) {

            return null;
         }

        var data = {};
    	try {

            data = CTAScene.JSON.parse( json );
        }
        catch ( e ) {

            if ( CTASystem.debug ) alert( e.description + '\n\nJSON DATA:\n\n' + json );
        }
    	return data;
    }


    // ================== | Third Party JSON Moudle | ==================
    /**
     * JSON parser.
     * @name JSON
     * @see {@link http://www.JSON.org/js.html|Json2}
     * @license Public-Domain
     */

    // We include JSON in the CTAScene Object to not share it globally
    CTAScene.JSON = {};

    (function () {
        "use strict";

        var rx_one = /^[\],:{}\s]*$/;
        var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
        var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

        function f(n) {
            // Format integers to have at least two digits.
            return (n < 10)
                ? "0" + n
                : n;
        }

        function this_value() {
            return this.valueOf();
        }

        if (typeof Date.prototype.toJSON !== "function") {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf())
                    ? (
                        this.getUTCFullYear()
                        + "-"
                        + f(this.getUTCMonth() + 1)
                        + "-"
                        + f(this.getUTCDate())
                        + "T"
                        + f(this.getUTCHours())
                        + ":"
                        + f(this.getUTCMinutes())
                        + ":"
                        + f(this.getUTCSeconds())
                        + "Z"
                    )
                    : null;
            };

            Boolean.prototype.toJSON = this_value;
            Number.prototype.toJSON = this_value;
            String.prototype.toJSON = this_value;
        }

        var gap;
        var indent;
        var meta;
        var rep;


        function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

            rx_escapable.lastIndex = 0;
            return rx_escapable.test(string)
                ? "\"" + string.replace(rx_escapable, function (a) {
                    var c = meta[a];
                    return typeof c === "string"
                        ? c
                        : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                }) + "\""
                : "\"" + string + "\"";
        }


        function str(key, holder) {

    // Produce a string from holder[key].

            var i;          // The loop counter.
            var k;          // The member key.
            var v;          // The member value.
            var length;
            var mind = gap;
            var partial;
            var value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

            if (
                value
                && typeof value === "object"
                && typeof value.toJSON === "function"
            ) {
                value = value.toJSON(key);
            }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

            if (typeof rep === "function") {
                value = rep.call(holder, key, value);
            }

    // What happens next depends on the value's type.

            switch (typeof value) {
            case "string":
                return quote(value);

            case "number":

    // JSON numbers must be finite. Encode non-finite numbers as null.

                return (isFinite(value))
                    ? String(value)
                    : "null";

            case "boolean":
            case "null":

    // If the value is a boolean or null, convert it to a string. Note:
    // typeof null does not produce "null". The case is included here in
    // the remote chance that this gets fixed someday.

                return String(value);

    // If the type is "object", we might be dealing with an object or an array or
    // null.

            case "object":

    // Due to a specification blunder in ECMAScript, typeof null is "object",
    // so watch out for that case.

                if (!value) {
                    return "null";
                }

    // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

    // Is the value an array?

                if (Object.prototype.toString.apply(value) === "[object Array]") {

    // The value is an array. Stringify every element. Use null as a placeholder
    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || "null";
                    }

    // Join all of the elements together, separated with commas, and wrap them in
    // brackets.

                    v = partial.length === 0
                        ? "[]"
                        : gap
                            ? (
                                "[\n"
                                + gap
                                + partial.join(",\n" + gap)
                                + "\n"
                                + mind
                                + "]"
                            )
                            : "[" + partial.join(",") + "]";
                    gap = mind;
                    return v;
                }

    // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === "object") {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === "string") {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap)
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                } else {

    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (
                                    (gap)
                                        ? ": "
                                        : ":"
                                ) + v);
                            }
                        }
                    }
                }

    // Join all of the member texts together, separated with commas,
    // and wrap them in braces.

                v = partial.length === 0
                    ? "{}"
                    : gap
                        ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}"
                        : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
            }
        }

    // If the JSON object does not yet have a stringify method, give it one.

        if (typeof CTAScene.JSON.stringify !== "function") {
            meta = {    // table of character substitutions
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                "\"": "\\\"",
                "\\": "\\\\"
            };
            CTAScene.JSON.stringify = function (value, replacer, space) {

    // The stringify method takes a value and an optional replacer, and an optional
    // space parameter, and returns a JSON text. The replacer can be a function
    // that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided. Use of the space parameter can
    // produce text that is more easily readable.

                var i;
                gap = "";
                indent = "";

    // If the space parameter is a number, make an indent string containing that
    // many spaces.

                if (typeof space === "number") {
                    for (i = 0; i < space; i += 1) {
                        indent += " ";
                    }

    // If the space parameter is a string, it will be used as the indent string.

                } else if (typeof space === "string") {
                    indent = space;
                }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.

                rep = replacer;
                if (replacer && typeof replacer !== "function" && (
                    typeof replacer !== "object"
                    || typeof replacer.length !== "number"
                )) {
                    throw new Error("JSON.stringify");
                }

    // Make a fake root object containing our value under the key of "".
    // Return the result of stringifying the value.

                return str("", {"": value});
            };
        }


    // If the JSON object does not yet have a parse method, give it one.

        if (typeof CTAScene.JSON.parse !== "function") {
            CTAScene.JSON.parse = function (text, reviver) {

    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

                var j;

                function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

                    var k;
                    var v;
                    var value = holder[key];
                    if (value && typeof value === "object") {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

                text = String(text);
                rx_dangerous.lastIndex = 0;
                if (rx_dangerous.test(text)) {
                    text = text.replace(rx_dangerous, function (a) {
                        return (
                            "\\u"
                            + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                        );
                    });
                }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with "()" and "new"
    // because they can cause invocation, and "=" because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
    // replace all simple value tokens with "]" characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or "]" or
    // "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

                if (
                    rx_one.test(
                        text
                            .replace(rx_two, "@")
                            .replace(rx_three, "]")
                            .replace(rx_four, "")
                    )
                ) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The "{" operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

                    j = eval("(" + text + ")");

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

                    return (typeof reviver === "function")
                        ? walk({"": j}, "")
                        : j;
                }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

                throw new SyntaxError("JSON.parse");
            };
        }
    }());

    // ======================== | CTALaunch | ========================
    var CTALaunch = {};

    CTALaunch.version = 0.0;
    CTALaunch.scriptName = "Cartoon Animator - AE Script (Beta)";
    CTALaunch.about = "In order to link an animated project into AE, kindly import the Cartoon Animator JSON file.";
    CTALaunch.linkInfo = "This script works with Cartoon Animator. If you haven’t installed Cartoon Animator yet. The free trial version is available here.";
    CTALaunch.linkAlert = "Please tick the \"Allow Scripts to Write Files and Access Network\" in Preferences > ";
    CTALaunch.trialUrl = "https://www.reallusion.com/linkcount/linkcount.aspx?lid=CA4en80";
    CTALaunch.resrcUrl = "https://www.reallusion.com/linkcount/linkcount.aspx?lid=CA4en81";
    CTALaunch.versionAlert = "Failed to load file. The file may have been saved in a newer version; please update your Cartoon Animator / After Effect Script to the latest version.";
    CTALaunch.importLog = [];

    // function
    CTALaunch.UI = {};
    CTALaunch.Import = {};
    CTALaunch.Create = {};
    CTALaunch.Comp = {};
    CTALaunch.Comp.Add = {};
    CTALaunch.Camera = {};
    CTALaunch.Audio = {};
    CTALaunch.Audio.Project = {};
    CTALaunch.Layer = {};
    CTALaunch.ImageLayer = {};
    CTALaunch.Background = {};
    CTALaunch.Source = {};

    // parameter
    CTALaunch.jsonType = { none: 0, basic: 1, smart: 2 };
    CTALaunch.radian = 57.29577951;
    CTALaunch.depthCapacity = 10;
    CTALaunch.cameraFLM = 53.33333334;
    CTALaunch.standardZinCTACam = -2099.2021484375;
    CTALaunch.standardFps = 29.97;
    CTALaunch.projectAudio = [ "Music", "Sound_FX1", "Sound_FX2" ];
    CTALaunch.cameraName = "CTACamera";
    CTALaunch.composition = {};
    CTALaunch.folder = {};


    // ======================= | User Interface | ======================
    CTALaunch.UI.Create = function ( thisObj, scriptName ) {

        var myPanel = ( thisObj instanceof Panel ) ? thisObj : new Window( "palette", scriptName, undefined, { resizeable: true, closeButton: true } );

        if ( myPanel == null ) throw "Failed to create UI";

        myPanel.margins = [ 15, 15, 15, 15];
        myPanel.spacing = 0;

        res = "group { orientation: 'column',\
                       alignment: [ 'fill', 'fill' ],\
                       spacing: '5',\
                       splashGroup: Group { orientation: 'column',\
                                            alignment: [ 'fill', 'top' ],\
                                            logoImage : Image { alignment: [ 'left', 'top' ] },\
                                            logoText: StaticText { text: '',\
                                                                   alignment: [ 'fill', 'top' ],\
                                                                   properties:{ multiline:true }\
                                                                 }\
                                          },\
                       importGroup: Group { orientation: 'column',\
                                            alignment: [ 'fill', 'top' ],\
                                            spacing: '0',\
                                            importButton: Button { text: 'Import Project (JSON)',\
                                                                   preferredSize: [ 250, 30 ],\
                                                                   alignment: [ 'fill', 'top' ],\
                                                                   helpTip: 'Import Project (JSON)'\
                                                                 },\
                                            versionText: StaticText { text: '', alignment: 'right' },\
                                          },\
                       logGroup: Group { orientation: 'row',\
                                         margins: [ 0, 10, 0, 10 ],\
                                         alignment: [ 'fill', 'fill' ],\
                                         panel: Panel { orientation: 'row',\
                                                        alignment: [ 'fill', 'fill' ],\
                                                        margins: [ 5, 5, 5, 5 ],\
                                                        printGroup: Group { orientation: 'column',\
                                                                            spacing: '0',\
                                                                            alignment: [ 'right', 'fill' ]\
                                                                          },\
                                                        scrollbar: Scrollbar { alignment: [ 'right', 'fill'],\
                                                                               preferredSize: [ 15, 100 ],\
                                                                               maxvalue: 100,\
                                                                               stepdelta: 1,\
                                                                             }\
                                                      },\
                                       },\
                       infoGroup: Group { orientation: 'column',\
                                          alignment: [ 'fill', 'bottom' ],\
                                          infoText: StaticText { text: '',\
                                                                 alignment: [ 'fill', 'bottom' ],\
                                                                 properties:{ multiline: true }\
                                                               },\
                                          linkGroup: Group { orientation: 'row',\
                                                             spacing: '5',\
                                                             alignment: [ 'fill', 'bottom' ],\
                                                             resrcButton: Button { text: 'Learning Resource',\
                                                                                   preferredSize: [ 120, 30 ],\
                                                                                   alignment: [ 'fill', 'bottom' ],\
                                                                                   helpTip: 'Learning resource'\
                                                                                 },\
                                                             trialButton: Button { text: 'Free Trial',\
                                                                                   preferredSize: [ 120, 30 ],\
                                                                                   alignment: [ 'fill', 'bottom' ],\
                                                                                   helpTip: 'Free trial',\
                                                                                 }\
                                                           }\
                                        }\
                     }";

         myPanel.grp = myPanel.add( res );

         myPanel.grp.splashGroup.logoText.text = CTALaunch.about;
         myPanel.grp.splashGroup.logoImage.image = CTALaunch.UI.logoImage;
         myPanel.grp.splashGroup.logoImage.size = [ 190, 30 ];

         myPanel.grp.importGroup.versionText.text = "Beta 1.0";

         setupMaxScreenSize();
         myPanel.grp.logGroup.panel.printGroup.maximumSize = [ CTALaunch.maxScreenWidth, CTALaunch.maxScreenHeight ];

         myPanel.grp.infoGroup.infoText.text = CTALaunch.linkInfo;

         Image.prototype.onDraw = function() {
             // written by Marc Autret
             // "this" is the container; "this.image" is the graphic
             if ( !this.image ) return;
             var WH = this.size,
             wh = this.image.size,
             k = Math.min( WH[ 0 ] / wh[ 0 ], WH[ 1 ] / wh[ 1 ] ),
             xy;
             // Resize proportionally:
             wh = [ k * wh[ 0 ], k * wh[ 1 ] ];
             // Center:
             xy = [ ( WH[ 0 ] - wh[ 0 ] ) / 2, ( WH[ 1 ] - wh[ 1 ] ) / 2 ];
             this.graphics.drawImage( this.image, xy[ 0 ], xy[ 1 ], wh[ 0 ], wh[ 1 ] );
             WH = wh = xy = null;
         }

         myPanel.grp.importGroup.importButton.onClick = function () {

             importButtonClicked();
         }

         myPanel.grp.infoGroup.linkGroup.trialButton.onClick = function () {

             trialButtonClicked();
         }

         myPanel.grp.infoGroup.linkGroup.resrcButton.onClick = function () {

             resrcButtonClicked();
         }

         myPanel.grp.logGroup.panel.scrollbar.onChanging = function () {

             scrollbarValueChange();
         }

         myPanel.onShow = function() {

             CTALaunch.UI.UpdateScrollbar();

             myPanel.layout.layout( true );
             myPanel.layout.resize();
         }

         myPanel.onResizing = myPanel.onResize = function () {

             CTALaunch.UI.UpdateScrollbar();

             myPanel.layout.resize();

             if ( CTALaunch.mainUI.grp.logGroup.panel.scrollbar.enabled ) {

                 scrollbarValueChange();
             }
         }

         // for test
         myPanel.grp.importGroup.versionText.addEventListener( "click", function(e) { if ( CTASystem.Test.active ) { showTestUI(); } } );
         myPanel.onClose = function () {

             if ( CTASystem.Test.ui ) {

                 CTAExaminator.UI.Close( CTASystem.Test.ui );
                 CTASystem.Test.ui = null;
             }
         }

         myPanel.layout.layout( true );
         myPanel.layout.resize();

         CTALaunch.mainUI = myPanel;
    }

    CTALaunch.UI.Show = function ( thisObj ) {

        CTALaunch.UI.Create( thisObj, CTALaunch.scriptName );

        if ( CTALaunch.mainUI != null && CTALaunch.mainUI instanceof Window ) {

            CTALaunch.mainUI.center();
            CTALaunch.mainUI.show();
        }
    }

    CTALaunch.UI.UpdateScrollbar = function () {

        var logPanel = CTALaunch.mainUI.grp.logGroup.panel;
        // 16 = text height, 5 = margin
        var totalTxtHeight = CTALaunch.importLog.length * 16 + 5;

        if ( logPanel.size.height > totalTxtHeight ) {

            logPanel.scrollbar.enabled = false;
            logPanel.scrollbar.value = 0;
        }
        else {

            logPanel.scrollbar.enabled = true;
        }
    }

    CTALaunch.UI.UpdateImportLog = function ( logString ) {

        CTALaunch.importLog.push( logString );

        var logPanel = CTALaunch.mainUI.grp.logGroup.panel;

        var text = logPanel.printGroup.add ( 'statictext', undefined, logString );
        text.alignment = [ 'left', 'top' ];

        CTALaunch.UI.UpdateScrollbar();

        CTALaunch.mainUI.layout.layout( true );
        CTALaunch.mainUI.layout.resize();

        var buffer = Math.floor( logPanel.size.height / 16 );
        if ( CTALaunch.importLog.length > buffer ) {

            logPanel.scrollbar.value = logPanel.scrollbar.maxvalue;
            logPanel.printGroup.location.y = -1 * ( CTALaunch.importLog.length - buffer ) * 16;
        }

        // update can only work in window
        if ( CTALaunch.mainUI instanceof Window ) {

            CTALaunch.mainUI.update();
        }
    }

    CTALaunch.UI.ResetLog = function () {

        var logTxtLength = CTALaunch.importLog.length;
        if ( logTxtLength == 0 ) {

            return;
        }
        CTALaunch.importLog = [];

        var logPanel = CTALaunch.mainUI.grp.logGroup.panel;

        while ( logPanel.printGroup.children.length > 0 ) {

            logPanel.printGroup.remove( logPanel.printGroup.children[ 0 ] );
        }

        CTALaunch.UI.UpdateScrollbar();

        CTALaunch.mainUI.layout.layout( true );
        CTALaunch.mainUI.layout.resize();
    }

    CTALaunch.UI.PreSettings = function () {

        var logPanel = CTALaunch.mainUI.grp.logGroup.panel;
        var currentSize = logPanel.size;

        logPanel.maximumSize = currentSize;
        logPanel.printGroup.alignment = [ 'left', 'top' ];
    }

    CTALaunch.UI.PostSettings = function () {

        var logPanel = CTALaunch.mainUI.grp.logGroup.panel;

        logPanel.maximumSize = [ CTALaunch.maxScreenWidth, CTALaunch.maxScreenHeight ];
        logPanel.printGroup.alignment = [ 'left', 'fill' ];
    }

    function setupMaxScreenSize() {

        var allScreens = $.screens;
        var screenWidth = 0;
        var screenHeight = 0;

        for ( var i = 0; i < allScreens.length; ++i ) {

            screenWidth = screenWidth + Math.abs( allScreens[ i ].right - allScreens[ i ].left );
            screenHeight = screenHeight + Math.abs( allScreens[ i ].top - allScreens[ i ].bottom );
        }

        CTALaunch.maxScreenWidth = screenWidth;
        CTALaunch.maxScreenHeight = screenHeight;
    }

    function importButtonClicked() {

        // select Json file
        var file = File.openDialog( "Select the CTA .json file.", 'JSON files:*.json, All files:*.*', false );
        if ( !file ) {

            return;
        }

        app.beginUndoGroup( "import Json" );

            CTALaunch.Import.Start( file );

        app.endUndoGroup;
    }

    function trialButtonClicked() {

        if ( false == networkAccessCheck() ) {

            return;
        }
        openUrl( CTALaunch.trialUrl );
    }

    function resrcButtonClicked() {

        if ( false == networkAccessCheck() ) {

            return;
        }
        openUrl( CTALaunch.resrcUrl );
    }

    function scrollbarValueChange() {

        if ( CTALaunch.importLog.length < 1 ) {

            return;
        }

        var logPanel = CTALaunch.mainUI.grp.logGroup.panel;
        var buffer = Math.floor( logPanel.size.height / 16 );
        var panelLocation = ( ( CTALaunch.importLog.length - buffer ) * 16 / ( logPanel.scrollbar.maxvalue ) ) * logPanel.scrollbar.value;
        logPanel.printGroup.location.y = -1 * panelLocation;
    }

    function networkAccessCheck() {

        if ( app.preferences.getPrefAsLong( "Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY" ) != 1 ) {

            var appVersion = parseFloat( app.version );
            var commandID = appVersion >= 16.1 ? 3131 : 2359;
            var preferenceTabName = appVersion >= 16.1 ? 'Scripting & Expressions' : 'General';

            alert( CTALaunch.linkAlert + preferenceTabName );
            app.executeCommand( commandID );

            return false;
        }

        return true;
    }

    function openUrl( url ) {

        var osString = $.os;
        var osVersion = ( osString.indexOf( "Windows" ) != -1 ) ? "Win" : "Mac";

        if ( osVersion == "Win" ) {

            system.callSystem("cmd.exe /c Start " + url );
        }
        else {

            system.callSystem("open " + url );
        }
    }


    // ========================== | Import | ===========================
    CTALaunch.Import.Start = function( file ) {

        CTALaunch.UI.PreSettings();
        CTALaunch.UI.ResetLog();

        var isImportSuccess = CTALaunch.Import.CreateJson( file );
        if ( isImportSuccess ) {

            CTALaunch.Create.Start();
            // wait fo AE view create finished
            $.sleep( 300 );

            CTALaunch.UI.UpdateImportLog( "Import project success!" );
            alert( "Import project completed!" );
        }
        else {

            CTALaunch.UI.UpdateImportLog( "Import project failed." );
        }

        CTALaunch.UI.PostSettings();
    }

    CTALaunch.Import.CreateJson = function ( file ) {

        try {

            CTAScene.loadJsonFile( file );
        }
        catch ( e ) {

            // data error while loading
            CTALaunch.UI.UpdateImportLog( "Load json file failed." );
            return false;
        }

        CTAScene.filePath = file.parent.absoluteURI;

        if ( false == CTALaunch.Import.VersionCheck()
          || false == CTALaunch.Import.ProjectNameCheck( file ) ) {

            return false;
        }

        CTALaunch.UI.UpdateImportLog( "Load json file completed." );
        return true;
    }

    CTALaunch.Import.SetType = function () {

        var jsonType = CTAScene.smartType ? CTALaunch.jsonType.smart : CTALaunch.jsonType.basic;
        CTALaunch.importType = jsonType;
    }

    CTALaunch.Import.VersionCheck = function () {

        if ( CTALaunch.version != CTAScene.version ) {

            alert( CTALaunch.versionAlert );
            return false;
        }

        return true;
    }

    CTALaunch.Import.ProjectNameCheck = function ( file ) {

        var fileName = ( file.name ).split( "." )[ 0 ];

        var mainFolder = getCTAMainFolder();
        if ( mainFolder ) {

            // for test
            if ( CTASystem.Test.active ) {

                return true;
            }

            CTALaunch.UI.UpdateImportLog( "Already exists an CTA_" + fileName + " project." );
            alert( "Already exists an CTA_" + fileName +  " project." );

            return false;
        }

        return true;
    }


    // ===========================| Create |============================
    CTALaunch.Create.Start = function () {

        var createScene = CTAScene.Create;
        CTALaunch.Create.Initial( createScene );
        CTALaunch.Create.Setup( createScene );

        CTALaunch.Comp.Create( createScene );
        CTALaunch.Comp.Select();
    }

    CTALaunch.Create.Initial = function ( importScene ) {

        var name        = CTAScene.name;
        var width       = CTAScene.width;
        var height      = CTAScene.height;
        var pixelAspect = 1;
        var duration    = ( importScene.endFrame - importScene.startFrame ) / CTALaunch.standardFps ;
        var frameRate   = CTAScene.fps;

        var mainFolder = app.project.items.addFolder( "CTA_" + CTAScene.name );
        var mainComp = app.project.items.addComp( name, width, height, pixelAspect, duration, frameRate );
        mainComp.parentFolder = mainFolder;

        name = "Scene";
        // Scene
        var sceneFolder = app.project.items.addFolder( "Scene" );
        sceneFolder.parentFolder = mainFolder;
        var sceneComp = sceneFolder.items.addComp( name, width, height, pixelAspect, duration, frameRate );
        mainComp.layers.add( sceneComp );

        // convert scene composition to 3D
        mainComp.layers[ 1 ].threeDLayer = true;

        // Content
        var contentFolder = app.project.items.addFolder( "Content" );
        contentFolder.parentFolder = mainFolder;

        // Audio
        var audioFolder = app.project.items.addFolder( "Audio" );
        audioFolder.parentFolder = mainFolder;

        CTALaunch.SetProject( { main: mainComp, scene: sceneComp },
                                { main: mainFolder, content: contentFolder, audio: audioFolder } );

        CTALaunch.UI.UpdateImportLog( "Build AE project success.\n" );
    }

    CTALaunch.Create.Setup = function ( importScene ) {

        CTALaunch.Import.SetType();
        CTALaunch.SetSceneRatio( importScene );
        CTALaunch.SetCameraRatio( importScene );
        CTALaunch.SetTimeShift();
    }


    // ========================| Composition |==========================
    CTALaunch.Comp.Create = function ( importScene ) {

        var sceneComp = CTALaunch.composition.scene;

        // background
        CTALaunch.Comp.Add.Background( importScene, sceneComp );
        CTALaunch.Comp.Add.ProjectAudio( sceneComp );

        // Layers
        CTALaunch.Comp.Add.Layer( importScene, sceneComp );

        // Camera
        if ( CTALaunch.importType == CTALaunch.jsonType.smart ) {

            CTALaunch.Comp.Add.Camera( importScene, sceneComp );
        }
    }

    CTALaunch.Comp.Select = function () {

        function unSelectItem( folder ) {

            for ( var i = 1; i <= folder.numItems; ++i ) {

                folder.items[ i ].selected = false;
            }
        }

        var mainComp = CTALaunch.composition.main;

        unSelectItem( CTALaunch.folder.content );
        unSelectItem( CTALaunch.folder.audio );

        mainComp.selected = true;
        mainComp.openInViewer();
    }

    CTALaunch.Comp.MoveScene = function () {

        var mainComp = CTALaunch.composition.main;
        for ( var i = 1; i <= mainComp.numLayers; ++i ) {

            var layer = mainComp.layers[ i ];
            if ( layer instanceof AVLayer ) {

                if ( layer.source instanceof CompItem && layer.source.name == "Scene" ) {

                    layer.position.setValue( [ CTAScene.width / 2, CTAScene.height / 2 ] );
                    break;
                }
            }
        }
    }

    // add
    CTALaunch.Comp.Add.Layer = function ( importScene, sceneComp ) {

        for ( var i = 0; i < importScene.compList.length; ++i ) {

            var jsonComp = importScene.compList[ i ];
            if ( jsonComp.hasAudio ) {

                CTALaunch.Audio.Create( jsonComp.name, sceneComp );
            }

            // check for image exists
            if ( jsonComp.compObj.count ) {

                if ( jsonComp.isThreeD ) {

                    CTALaunch.Layer.Create( jsonComp, sceneComp );
                }
                else {

                    CTALaunch.ImageLayer.Create( jsonComp, sceneComp );
                }
            }
        }
    }

    CTALaunch.Comp.Add.ProjectAudio = function ( sceneComp ) {

        if ( CTAScene.loadBgm ) {

            CTALaunch.Audio.Project.Create( sceneComp );
        }
    }

    CTALaunch.Comp.Add.Camera = function ( importScene, sceneComp ) {

        var jsonCamera = importScene.camera;
        if ( isEmptyObject( jsonCamera ) ) {

            return;
        }

        CTALaunch.Camera.Create( jsonCamera, sceneComp );
    }

    CTALaunch.Comp.Add.Background = function ( importScene, sceneComp ) {

        if ( isEmptyObject( importScene.background ) ) {

            return;
        }

        var jsonBackground = importScene.background;
        if ( jsonBackground.hasAudio ) {

            var audioName = "Background";
            CTALaunch.Audio.Create( audioName, sceneComp );
        }

        CTALaunch.Background.Create( jsonBackground, sceneComp );
    }


    // ========================= | Source | ============================
    CTALaunch.Source.LoadImage = function ( jsonCompObj, layerName ) {

        // check for sequence image
        var isSequence = ( jsonCompObj.count > 1 ) ? true : false;
        var imageSource = null;

        var folderPath = CTAScene.filePath + '/' + layerName;
        var imagePath = folderPath + '/' + jsonCompObj.fileName;
        var image = new File( imagePath );

        try {

            var importOptions = new ImportOptions( image );
            importOptions.sequence = isSequence;
            importOptions.importAs = ImportAsType.FOOTAGE;

            var imageSource = app.project.importFile( importOptions );
            if ( isSequence ) {

                imageSource.mainSource.conformFrameRate = CTAScene.fps;
            }

            imageSource.name = layerName;
        }
        catch ( e ) {

            CTALaunch.UI.UpdateImportLog( "Load " + jsonCompObj.fileName + " source file failed." );
            return;
        }

        if ( imageSource.mainSource.hasAlpha ) {

            imageSource.mainSource.alphaMode = CTAScene.preMulti ? AlphaMode.PREMULTIPLIED : AlphaMode.STRAIGHT;
        }

        return imageSource;
    }

    CTALaunch.Source.LoadAudio = function ( layerName ) {

        var folderPath = CTAScene.filePath + '/' + 'Audio';

        var audioPath = folderPath + '/' + layerName + '.wav';
        var audioFile = new File( audioPath );

        var audioSource = null;
        // audio file does not descripe in json, need to verify it first
        if ( audioFile.exists ) {

            try {

                var importOptions = new ImportOptions( audioFile );
                audioSource = app.project.importFile( importOptions );
                audioSource.name = layerName;
            }
            catch ( e ) {

                CTALaunch.UI.UpdateImportLog( "Load " + layerName + " audio file failed." );
                return;
            }
        }

        return audioSource;
    }


    // ========================= | Camera | ============================
    CTALaunch.Camera.Create = function ( jsonCamera, sceneComp ) {

        var aeCamera = sceneComp.layers.addCamera( CTALaunch.cameraName, [ CTAScene.width / 2, CTAScene.height / 2 ] );

        // set value zoom by focal length
        var value = jsonCamera.camLens * CTALaunch.cameraFLM;
        aeCamera.zoom.setValue( value );
        aeCamera.focusDistance.setValue( value );

        CTALaunch.Camera.SetProperty( aeCamera, jsonCamera );
        CTALaunch.UI.UpdateImportLog( "Create camera layer completed.")
    }

    CTALaunch.Camera.SetProperty = function ( aeCamera, jsonCamera ) {

        if ( false == ( CTALaunch.Camera.Add.PositionKey( aeCamera, jsonCamera )
                     && CTALaunch.Camera.Add.RotateKey( aeCamera, jsonCamera ) ) ) {

            CTALaunch.UI.UpdateImportLog( "Set camera layer properties failed.")
        }
        else {

            CTALaunch.UI.UpdateImportLog( "Set camera layer properties completed.")
        }
    }

    // add
    CTALaunch.Camera.Add = {};

    CTALaunch.Camera.Add.PositionKey = function ( aeCamera, jsonCamera ) {

        var cameraPos = aeCamera.position;
        var cameraPOI = aeCamera.pointOfInterest;

        var posKeys = CTALaunch.Camera.Calculate.Position( jsonCamera );

        for ( var i = 0; i < posKeys.length; ++i ) {

            var pos = jsonCamera.posObjs[ i ];

            var xTrans = posKeys[ i ].x;
            var yTrans = posKeys[ i ].y;
            var zTrans = posKeys[ i ].z;

            var keyTime = posKeys[ i ].time;

            try {

                var index = cameraPos.addKey( keyTime );
                cameraPOI.addKey( keyTime );

                cameraPos.setValueAtKey( index, [ xTrans, yTrans, zTrans ] );
                cameraPOI.setValueAtKey( index, [ xTrans, yTrans, 0 ] );
            }
            catch ( e ) {

				//alert( e.message );
                return false;
            }
        }

        return true;
    }

    CTALaunch.Camera.Add.RotateKey = function ( aeCamera, jsonCamera ) {

        var jsonCamRotCount = jsonCamera.rotObjs.length;
        var cameraRot = aeCamera.zRotation;

        var rotKeys = CTALaunch.Camera.Calculate.Rotation( jsonCamera );

        for ( var i = 0; i < rotKeys.length; ++i ) {

            var zRot = rotKeys[ i ].value;
            var keyTime = rotKeys[ i ].time;

            try {

                var index = cameraRot.addKey( keyTime );
                cameraRot.setValueAtKey( index, zRot );
            }
            catch ( e ) {

                //alert( e.message );
                return false;
            }
        }

        return true;
    }

    // calculate
    CTALaunch.Camera.Calculate = {};

    CTALaunch.Camera.Calculate.Position = function ( cameraData ) {

        var keys = [];
        var posLength = cameraData.posObjs.length;

        var camRatio = CTALaunch.cameraRatio;
        var fps = CTAScene.fps;
        var transFactorX = CTALaunch.sceneRatio.width / CTALaunch.sceneRatio.scene;
        var transFactorY = CTALaunch.sceneRatio.height / CTALaunch.sceneRatio.scene;

        for ( var i = 0; i < posLength; ++i ) {

            var pos = cameraData.posObjs[ i ];

            var xValue = pos.x * transFactorX;
            var yValue = -pos.z * transFactorY;
            var zValue = pos.y * camRatio;
            var keyTime = Math.round( ( pos.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "x": xValue, "y": yValue, "z": zValue } );
        }

        return keys;
    }

    CTALaunch.Camera.Calculate.Rotation = function ( cameraData ) {

        var keys = [];
        var fps = CTAScene.fps;

        var rotLength = cameraData.rotObjs.length;
        for ( var i = 0; i < rotLength; ++i ) {

            var rot = cameraData.rotObjs[ i ];

            var value = -rot.value;
            var keyTime = Math.round( ( rot.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "value": value } );
        }

        return keys;
    }


    // ======================== | Layer |  =============================
    CTALaunch.Layer.Create = function ( jsonComp, sceneComp ) {

        var imageSource = CTALaunch.Source.LoadImage( jsonComp.compObj, jsonComp.name );
        if ( imageSource ) {

            imageSource.parentFolder = CTALaunch.folder.content;
            sceneComp.layers.add( imageSource );

            var currentLayer = sceneComp.layers[ 1 ];
            currentLayer.threeDLayer = true;
            currentLayer.selected = false;

            CTALaunch.Layer.SetProperty( currentLayer, jsonComp );
            CTALaunch.UI.UpdateImportLog( "Create \"" + jsonComp.name + "\" object layer completed." );
        }
        else {

            CTALaunch.UI.UpdateImportLog( "Create \"" + jsonComp.name + "\" object layer failed." );
        }
    }

    CTALaunch.Layer.SetProperty = function ( layer, jsonComp ) {

        switch ( CTALaunch.importType ) {

            case CTALaunch.jsonType.basic: {

                // setup layer order
                if ( false == CTALaunch.Layer.Add.PositionKeyByDepth( layer, jsonComp.compObj.depth ) ) {

                    CTALaunch.UI.UpdateImportLog( "Set \"" + jsonComp.name + "\" layer properties failed." );
                    return;
                }
                break;
            }
            case CTALaunch.jsonType.smart: {

                if ( false == ( CTALaunch.Layer.Add.PositionKey( layer, jsonComp )
                             && CTALaunch.Layer.Add.AnchorPointKey( layer, jsonComp )
                             && CTALaunch.Layer.Add.ScaleKey( layer, jsonComp )
                             && CTALaunch.Layer.Add.RotationKey( layer, jsonComp ) ) ) {

                    CTALaunch.UI.UpdateImportLog( "Set \"" + jsonComp.name + "\" layer properties failed." );
                    return;
                }
                break;
            }
            case CTALaunch.jsonType.none:
            default:
                return;
        }

        CTALaunch.UI.UpdateImportLog( "Set \"" + jsonComp.name + "\" layer properties completed." );
    }

    // add
    CTALaunch.Layer.Add = {};

    CTALaunch.Layer.Add.PositionKeyByDepth = function ( layer, depth ) {

        var layerPos = layer.position;
        layerPos.dimensionsSeparated = true;

        var zPos = layerPos.getSeparationFollower( 2 );

        var depthCap = CTALaunch.depthCapacity;
        var fps = CTAScene.fps;

        for ( var i = 0; i < depth.length; ++i ) {

            var zValue = depth[ i ].value / depthCap;
            var keyTime = Math.round( ( depth[ i ].time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            try {

                var index = zPos.addKey( keyTime );
                zPos.setValueAtKey( index, zValue );
                zPos.setInterpolationTypeAtKey( index, KeyframeInterpolationType.HOLD );
            }
            catch ( e ) {

				//alert( e.message );
                return false;
            }
        }

        return true;
    }

    CTALaunch.Layer.Add.PositionKey = function ( layer, jsonComp ) {

        var layerPos = layer.position;
        var posKeys = CTALaunch.Layer.Calculate.Position( jsonComp.compObj );

        // add keys
        for ( var i = 0; i < posKeys.length; ++i ) {

            var keyTime = posKeys[ i ].time;
            var xTrans = posKeys[ i ].x;
            var yTrans = posKeys[ i ].y;
            var zTrans = posKeys[ i ].z;

            try {

                var index = layerPos.addKey( keyTime );
                layerPos.setValueAtKey( index, [ xTrans, yTrans, zTrans ] );
            }
            catch ( e ) {

                //alert( e.message );
                return false;
            }
        }

        // set spatial interpolation to linear
        for ( var j = 1; j <= layerPos.numKeys; ++j ) {

            try {

                layerPos.setSpatialTangentsAtKey( j, [ 0, 0, 0 ], [ 0, 0, 0 ] );
            }
            catch ( e ) {

                //alert( e.message );
                return false;
            }
        }

        return true;
    }

    CTALaunch.Layer.Add.AnchorPointKey = function ( layer, jsonComp ) {

        var layerAnchor = layer.anchorPoint;

        // AE default anchor point is in the middle of image
        var imageCenter = { "x": layer.source.width / 2, "y": layer.source.height / 2 };
        var anchorKeys = CTALaunch.Layer.Calculate.AnchorPoint( jsonComp.compObj, imageCenter );

        // add keys
        for ( var i = 0; i < anchorKeys.length; ++i ) {

            var pivotOffsetX = anchorKeys[ i ].x;
            var pivotOffsetY = anchorKeys[ i ].y;
            var keyTime = anchorKeys[ i ].time;

            try {

                var index = layerAnchor.addKey( keyTime );
                layerAnchor.setValueAtKey( index, [ pivotOffsetX, pivotOffsetY ] );
                layerAnchor.setInterpolationTypeAtKey( index, KeyframeInterpolationType.HOLD );
            }
            catch ( e ) {

				//alert( e.message );
                return false;
            }
        }

        return true;
    }

    CTALaunch.Layer.Add.ScaleKey = function ( layer, jsonComp ) {

        var layerScale = layer.scale;
        var compScale = { "x": jsonComp.compScale.scaleX, "y": jsonComp.compScale.scaleZ };
        var scaleKeys = CTALaunch.Layer.Calculate.Scale( jsonComp.compObj, compScale );

        for ( var i = 0; i < scaleKeys.length; ++i ) {

            var xScale = scaleKeys[ i ].x;
            var yScale = scaleKeys[ i ].y;
            var zScale = scaleKeys[ i ].z;
            var keyTime = scaleKeys[ i ].time;

            try {

                var index = layerScale.addKey( keyTime );
                layerScale.setValueAtKey( index, [ xScale, yScale, zScale ] );
            }
            catch ( e ) {

				//alert( e.message );
                return false;
            }
        }

        return true;
    }

    CTALaunch.Layer.Add.RotationKey = function ( layer, jsonComp ) {

        var layerRot = layer.rotation;
        var rotKeys = CTALaunch.Layer.Calculate.Rotation( jsonComp.compObj );

        for ( var i = 0; i < rotKeys.length; ++i ) {

            var rotate = rotKeys[ i ].value;
            var keyTime = rotKeys[ i ].time;

            try {

                var index = layerRot.addKey( keyTime );
                layerRot.setValueAtKey( index, rotate );
            }
            catch ( e ) {

				//alert( e.message );
                return false;
            }
        }

        return true;
    }

    // calculate
    CTALaunch.Layer.Calculate = {};

    CTALaunch.Layer.Calculate.Position = function ( compObj ) {

        var keys = [];
        var jsonCompPosCount = compObj.posObjs.length;

        var camRatio = CTALaunch.cameraRatio;
        var fps = CTAScene.fps;
        var transFactorX = CTALaunch.sceneRatio.width / CTALaunch.sceneRatio.scene;
        var transFactorY = CTALaunch.sceneRatio.height / CTALaunch.sceneRatio.scene;

        for ( var i = 0; i < jsonCompPosCount; ++i ) {

            var pos = compObj.posObjs[ i ];

            var xValue = pos.x * transFactorX;
            var yValue = -pos.z * transFactorY;
            var zValue = pos.y * camRatio;
            var keyTime = Math.round( ( pos.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "x": xValue, "y": yValue, "z": zValue } );
        }

        return keys;
    }

    CTALaunch.Layer.Calculate.AnchorPoint = function ( compObj, imageCenter ) {

        var keys = [];
        var jsonPivotCount = compObj.pivot.length;

        var sceneRatio = CTALaunch.sceneRatio.scene;
        var fps = CTAScene.fps;

        for ( var i = 0; i < jsonPivotCount; ++i ) {

            var pivot = compObj.pivot[ i ];

            var xValue = imageCenter.x - pivot.x / sceneRatio;
            var yValue = imageCenter.y + pivot.y / sceneRatio;
            var keyTime = Math.round( ( pivot.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "x": xValue, "y": yValue } );
        }

        return keys;
    }

    CTALaunch.Layer.Calculate.Scale = function ( compObj, compScale ) {

        var keys = [];

        var scaleFactorX = compScale.x * CTALaunch.sceneRatio.width * 100;
        var scaleFactorY = compScale.y * CTALaunch.sceneRatio.height * 100;
        var fps = CTAScene.fps;

        var jsonComScaleCount = compObj.scaleObjs.length;
        for ( var i = 0; i < jsonComScaleCount; ++i ) {

            var scale = compObj.scaleObjs[ i ];

            var xValue = scale.x * scaleFactorX;
            var yValue = scale.z * scaleFactorY;
            var zValue = 100;
            var keyTime = Math.round( ( scale.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "x": xValue, "y": yValue, "z": zValue } );
        }

        return keys;
    }

    CTALaunch.Layer.Calculate.Rotation = function ( compObj ) {

        var keys = [];
        var radian = CTALaunch.radian;
        var fps = CTAScene.fps;

        var jsonComRotCount = compObj.rotObjs.length;
        for ( var i = 0; i < jsonComRotCount; ++i ) {

            var rot = compObj.rotObjs[ i ];

            var value = rot.y * radian;
            var keyTime = Math.round( ( rot.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "value": value } );
        }

        return keys;
    }


    // ====================== | Image Layer |  =========================
    CTALaunch.ImageLayer.Create = function ( jsonComp, sceneComp ) {

        var imageSource = CTALaunch.Source.LoadImage( jsonComp.compObj, jsonComp.name );
        if ( imageSource ) {

            imageSource.parentFolder = CTALaunch.folder.content;
            sceneComp.layers.add( imageSource );

            var currentLayer = sceneComp.layers[ 1 ];
            currentLayer.selected = false;

            CTALaunch.ImageLayer.SetProperty( currentLayer, jsonComp );
            CTALaunch.UI.UpdateImportLog( "Create \"" + jsonComp.name + "\" image layer completed." );
        }
        else {

            CTALaunch.UI.UpdateImportLog( "Create \"" + jsonComp.name + "\" image layer failed." );
        }
    }

    CTALaunch.ImageLayer.SetProperty = function ( layer, jsonComp ) {

        switch ( CTALaunch.importType ) {

            case CTALaunch.jsonType.basic: {

                // setup layer order
                if ( false == CTALaunch.Layer.Add.PositionKeyByDepth( layer, jsonComp.compObj.depth ) ) {

                    CTALaunch.UI.UpdateImportLog( "Set \"" + jsonComp.name + "\" layer properties failed." );
                    return;
                }
                break;
            }
            case CTALaunch.jsonType.smart: {

                if ( false == ( CTALaunch.ImageLayer.Add.PositionKey( layer, jsonComp )
                             && CTALaunch.ImageLayer.Add.ScaleKey( layer, jsonComp ) ) ) {

                    CTALaunch.UI.UpdateImportLog( "Set \"" + jsonComp.name + "\" layer properties failed." );
                    return;
                }
                break;
            }
            case CTALaunch.jsonType.none:
            default:
                return;
        }

        CTALaunch.UI.UpdateImportLog( "Set \"" + jsonComp.name + "\" layer properties completed." );
    }

    // add
    CTALaunch.ImageLayer.Add = {};

    CTALaunch.ImageLayer.Add.PositionKey = function ( layer, jsonComp ) {

        var layerPos = layer.position;
        var posKeys = CTALaunch.ImageLayer.Calculate.Position( jsonComp.compObj );

        for ( var i = 0; i < posKeys.length; ++i ) {

            var xTrans = posKeys[ i ].x;
            var yTrans = posKeys[ i ].y
            var keyTime = posKeys[ i ].time;

            try {

                var index = layerPos.addKey( keyTime );
                layerPos.setValueAtKey( index, [ xTrans, yTrans ] );
            }
            catch ( e ) {

                //alert( e.message );
                return false;
            }
        }

        // set spatial interpolation to linear
        for ( var j = 1; j <= layerPos.numKeys; ++j ) {

            try {

                layerPos.setSpatialTangentsAtKey( j, [ 0, 0, 0 ], [ 0, 0, 0 ] );
            }
            catch ( e ) {

                //alert( e.message );
                return false;
            }
        }

        return true;
    }

    CTALaunch.ImageLayer.Add.ScaleKey = function ( layer, jsonComp ) {

        var layerScale = layer.scale;
        var compScale = { "x": jsonComp.compScale.scaleX, "y": jsonComp.compScale.scaleZ };
        var scaleKeys = CTALaunch.ImageLayer.Calculate.Scale( jsonComp.compObj, compScale );

        for ( var i = 0; i < scaleKeys.length; ++i ) {

            var xScale = scaleKeys[ i ].x;
            var yScale = scaleKeys[ i ].y;
            var keyTime = scaleKeys[ i ].time;

            try {

                var index = layerScale.addKey( keyTime );
                layerScale.setValueAtKey( index, [ xScale, yScale ] );
            }
            catch ( e ) {

                //alert( e.message );
                return false;
            }
        }

        return true;
    }

    // calculate
    CTALaunch.ImageLayer.Calculate = {};

    CTALaunch.ImageLayer.Calculate.Position = function ( objData ) {

        var keys = [];
        var posLength = objData.posObjs.length;

        var fps = CTAScene.fps;
        var transFactorX = CTALaunch.sceneRatio.width / CTALaunch.sceneRatio.scene;
        var transFactorY = CTALaunch.sceneRatio.height / CTALaunch.sceneRatio.scene;

        for ( var i = 0; i < posLength; ++i ) {

            var pos = objData.posObjs[ i ];

            var xValue = pos.x * transFactorX + CTAScene.width / 2;
            var yValue = -pos.z * transFactorY + CTAScene.height / 2;
            var keyTime = Math.round( ( pos.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "x": xValue, "y": yValue } );
        }

        return keys;
    }

    CTALaunch.ImageLayer.Calculate.Scale = function ( objData, compScale ) {

        var keys = [];
        var scaleLength = objData.scaleObjs.length;

        var scaleFactorX = compScale.x * CTALaunch.sceneRatio.width * 100;
        var scaleFactorY = compScale.y * CTALaunch.sceneRatio.height * 100;
        var fps = CTAScene.fps;

        for ( var i = 0; i < scaleLength; ++i ) {

            var scale = objData.scaleObjs[ i ];

            var xValue = scale.x * scaleFactorX;
            var yValue = scale.z * scaleFactorY;
            var keyTime = Math.round( ( scale.time - CTALaunch.timeShift ) * fps * 1000 ) / 1000;
            keyTime = Math.round( keyTime ) / fps;

            keys.push( { "time": keyTime, "x": xValue, "y": yValue } );
        }

        return keys;
    }


    // ======================= | Background |  =========================
    CTALaunch.Background.Create = function ( jsonBackground, sceneComp ) {

        var bGFolderName = "Background";
        var imageSource = CTALaunch.Source.LoadImage( jsonBackground, bGFolderName );
        if ( imageSource ) {

            imageSource.parentFolder = CTALaunch.folder.content;
            sceneComp.layers.add( imageSource );

            var currentLayer = sceneComp.layers[ 1 ];
            currentLayer.selected = false;

            CTALaunch.Background.SetProperty( currentLayer );
            CTALaunch.UI.UpdateImportLog( "Create background layer completed." );
        }
        else {

            CTALaunch.UI.UpdateImportLog( "Create background layer failed." );
        }
    }

    CTALaunch.Background.SetProperty = function ( layer ) {

        switch ( CTALaunch.importType ) {

            case CTALaunch.jsonType.smart: {

                if ( false == CTALaunch.Background.Add.ScaleKey( layer ) ) {

                    CTALaunch.UI.UpdateImportLog( "Set background layer properties failed" );
                    return;
                }
                break;
            }
            case CTALaunch.jsonType.basic:
            case CTALaunch.jsonType.none:
            default:
                return;
        }

        CTALaunch.UI.UpdateImportLog( "Set background layer properties completed" );
    }

    // add
    CTALaunch.Background.Add = {};

    CTALaunch.Background.Add.ScaleKey = function ( layer ) {

        var layerScale = layer.scale;

        var scaleFactorX = CTALaunch.sceneRatio.width * 100;
        var scaleFactorY = CTALaunch.sceneRatio.height * 100;

        var xScale = 1 * scaleFactorX;
        var yScale = 1 * scaleFactorY;

        try {

            layerScale.setValue( [ xScale, yScale ] );
        }
        catch ( e ) {

            //alert( e.message );
            return false;
        }

        return true;
    }


    // ========================= | Audio | =============================
    CTALaunch.Audio.Create = function ( audioName, sceneComp ) {

        var audioSource = CTALaunch.Source.LoadAudio( audioName );
        if ( audioSource ) {

            audioSource.parentFolder = CTALaunch.folder.audio;
            sceneComp.layers.add( audioSource );
            sceneComp.layers[ 1 ].selected = false;

            CTALaunch.UI.UpdateImportLog( "Create \"" + audioName + "\" audio layer completed." );
        }
        else {

            CTALaunch.UI.UpdateImportLog( "Create \"" + audioName + "\" audio layer failed." );
        }
    }

    CTALaunch.Audio.Project.Create = function ( sceneComp ) {

        var bgmLength = CTALaunch.projectAudio.length;
        for ( var i = 0; i < bgmLength; ++i ) {

            var audio = CTALaunch.Source.LoadAudio( CTALaunch.projectAudio[ i ] );
            if ( audio ) {

                audio.parentFolder = CTALaunch.folder.audio;
                sceneComp.layers.add( audio );

                CTALaunch.UI.UpdateImportLog( "Create \"" + CTALaunch.projectAudio[ i ] + "\" audio layer completed." );
            }
            else {

                CTALaunch.UI.UpdateImportLog( "Create \"" + CTALaunch.projectAudio[ i ] + "\" audio layer failed." );
            }
        }
    }


    // ======================== | Settings | ===========================
    CTALaunch.SetProject = function ( composition, folder ) {

        CTALaunch.composition = composition;
        CTALaunch.folder = folder;
    }

    CTALaunch.SetSceneRatio = function ( importScene ) {

        CTALaunch.sceneRatio.scene = importScene.sceneRatio;

        var sceneWidth = Math.abs( CTAScene.viewCornerLT[ 0 ] - CTAScene.viewCornerRB[ 0 ] ) / importScene.sceneRatio;
        var sceneHeight = Math.abs( CTAScene.viewCornerLT[ 2 ] - CTAScene.viewCornerRB[ 2 ] ) / importScene.sceneRatio;
        var widthRatio = CTAScene.width / sceneWidth;
        var heightRatio = CTAScene.height / sceneHeight;

        CTALaunch.sceneRatio.width = widthRatio;
        CTALaunch.sceneRatio.height = heightRatio;
    }

    CTALaunch.SetCameraRatio = function ( importScene ) {

        var value = importScene.camera.camLens * CTALaunch.cameraFLM;
        CTALaunch.cameraRatio = Math.abs( value / CTALaunch.standardZinCTACam );
    }

    CTALaunch.SetTimeShift = function () {

        // AE startTime is zero, CTA is 1
        // CTA's key time does not change by fps, so the devide value must be the default value 30
        CTALaunch.timeShift = Math.round( ( ( CTAScene.Create.startFrame - 1 ) / 30 ) * 1000 ) / 1000;
    }

    CTALaunch.Init = function() {

        CTALaunch.sceneRatio = { scene: 1, width: 1, height: 1 };
        CTALaunch.cameraRatio = 1;
        CTALaunch.timeDev = 0;
        CTALaunch.timeShift = 0;
        CTALaunch.importType = 0;
        CTALaunch.fullyUpdate = false;
        CTALaunch.ratioUpdate = false;
        CTALaunch.maxScreenWidth = 9999;
        CTALaunch.maxScreenHeight = 9999;

        CTALaunch.composition.main = null;
        CTALaunch.composition.scene = null;
        CTALaunch.folder.main = null;
        CTALaunch.folder.content = null;
        CTALaunch.folder.audio = null;

        // png binary
        CTALaunch.UI.logoImage = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x01|\x00\x00\x00<\b\x06\x00\x00\x00e\u00C8\x01\x12\x00\x00\x00\x01sRGB\x00\u00AE\u00CE\x1C\u00E9\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008F\x0B\u00FCa\x05\x00\x00\x00\tpHYs\x00\x00\x0E\u00C3\x00\x00\x0E\u00C3\x01\u00C7o\u00A8d\x00\x00RlIDATx^\u00ED}\x07\u0080U\u00D5\u0099\u00FFw\u00CE\u00BD\u00F7\u00F57\u00BD230\u00C0\f\x1D\u0094*\u008A\"\"\u00A2\x18[\x12\u0089Y5YK\u00A2n\u008C\u0089n\\\u0093\u0098d]w\x13\u0093\u00FF\u00A6'\u009A5\u00A6\u00ACF\x137v\rJ\x14Q\u0090\u00DE\u00CB\u00C0\x00\u00C3\f\u00C3\u00F4\u00DE_\x7F\u00EF\u00DE\u00F3\u00FF}wfp\x1Ci*\u00B0\u00C9\u00FA~z\u0098w\u00DB\u00E9\u00E7\u00F7\u0095s\u00EE\u00B9\u00A2y\u00AEO\u00D1\u00C7\x05\u008Av\u00C6\u0085u\x7FD\u0085\u00D6\u0095n\u00A2>\u00FBL\x12I$\u0091\u00C4\u00C7\x04r\u00E0\u00EF\u00FFy\u00E8\u0082\u00C8\u0085\u00D2\u00D6'\u0088\u00FE\u00ADc\u00E0d\x12I$\u0091\u00C4\u00C7\b\x1F\x1B\u00C2\x1F\u0084\u0089\u00D0\u00D9\u00FF3\u0089$\u0092H\u00E2c\u0085SK\u00F8J\x11YV\x7F\u00E0\u00DFI$\u0091D\x12I\u00FC\u00CD\u00E0\u0094\x12\u00BEp\u00B8Hd\u00E4\u0090H\u00CD r\u00BAA\u00FA \u00FE$\u0092H\"\u0089$\u00FE&p\u00EA\b\x1F\x1A\u00BD6v2\u00F9\u00BF\u00FC\x1F\u00E4\u00FD\u00C27\u00C9u\u00C1'\u00FA\u0089?9/\u009AD\x12I$\u00F17\u0081SF\u00F8\u00CAL\u0090\u00F4\u00F8\u00C8y\u00EE\u00A5\u00E4\u00B9\u00FA\x16\u009B\u00F4\u00DDW\u00DED\u00E4`M\x7F\u00F0&\u00FC\x18\fI$\u0091D\x12I\u009CQ|8\u00C2?\ni\x0B!\u00C8jo\u00A4\u00D8\u00B6U\u00A4\u00E2Q\u00D2\u008B\u00C7\u0093\u00F3\u00FCKI\u00E6\x16\u00E2\"\u00DFo\u0091\u00D0\f\u0092n\x1F\u0091\x0BB\u0080\u0091$\u00FE$\u0092H\"\u00893\u0086\u0093#|&f\u009E\u00885\u00CD~\u00E2\u00D6u\u009B\u00BCm\u00BA\u0086fO\x16\u00CE\u0083\u00F0\u00CD\u00FAj\n\u00FC\u00EE\x07\x14~\u00F9\t\u00FB1\u00E1M#\u00E1\u00F1\u00E3\u0092F\u00C2\u009FA\u00C6\u00B49\u00E4\\\u00F2\x0F\u00E4^\u00F8)\u00D2F\u0095\"\x0E=I\u00FAI$\u0091D\x12g\b'A\u00F8\n\u00C4\u00CC\u0084\u009DF2;\u008F\u00B4\u0091\u00A5\u00A4\u009F5\u008F\u00F4\x19\u00F3\u00C8\x18;\u0099d\u00DEH\u0092Y\u00F9\u00B6\u00BF^\t\u00DC\u00DD\u00DDA\u00CA\u008C\u00F7?\nM\u009F\u00C2A\x12\x19\u00D9\u00E4\u00BE\u00E6f\u00F2\u00DD\u00FDC\u00F2}\u00E1\u009B\u00E4\u00FD\u00A7\x07\u00C8w\u00F3\u00D7I\u008E\x18e\x0B\u008A$\u0092H\"\u0089$N?N\u00F0\u00A6-.9=\u00A4\u0097N%\u00D7y\u008B\u00C9\u00988\x1D\u00A4_D\u00C2\u00E5\u00C25A*\x1E#\x15\t\u0091\u00D5\u00DEDf]\x15\u00C5\u00F7m'J\u00C4\u00C9}\u00DD\u009DdL\u009EE\u0091\u0095/P\u00DF\u00CF\u00BFI\u008E\u00B9\u0097\u0090\x1F$\u00AFA0P<B\u00E4p\u0091\u00D5\u00DDN\u00C1'\x7FB\u00A1g~\u00DD/\x18N3\u00F1\u00F3\u008BW\u00B0'v\u00EE\u0089[\u00F7\x7F\u00AF;\u00B4nye\u00F2M\u00DB$\u0092H\u00E2\u00E3\u0085c\x13\u00BE\u0082f\u00EFM!\u00E7\u00FC+\u00C9\u00FD\u00A9[\u00C9\x18=\u00BE\x7F\u00A9\u00A5e\u00DAD\u00CF\x10\x12\x06\u0082\u00EE\x18p\u00F7$H\x05\u00C1\u00A1<y\u009B3\u0082\u00AC\u008E\x16\u00DB\u00BD\u00938\u00B0\u0083|w~\u0097\x1C\u00B3\x17\u0090Y[I\u00D1\u009Dk\u00C9Q2\u0095D\u00C1h\u008A\u00AEy\u008D\x02?\u00FAg\b\u008D Gf\u00C7y\u00BA\u0090$\u00FC$\u0092H\u00E2\u00E3\u008E\u00A3\x13>\u00FB\u00D55\u009D\x1C\u00E7.&\u00FF]\u00DF%}\u00D48\u0090r\u0098b{\u00B7Qb\u00C7;d6\u00D6\u0090\u00A5,\u00D2\u00DC>\u00D2F\u0095\u0090\u00CC-\u00B2'ieV^\u00FF\u00A4\u00AC\u00A6Q|\u00D7z\u00EA\u00FD\u00F9\u00FDdL\u009BK\u00FE\u00DB\u00BFC*\x1C\u00A2\u00D0\u009F\x1F\u00A6\u00E8;\u00CB`1\u009CmO\u00E6&\x0E\u00EE\u00A2\u00F8\u00D6U\u00A4\x12\u0089\u00A4\u0086\u009FD\x12I$q\u009Aqt\u00C2\u0087\u0096\u00AE\u008F\x1AO\u009E;\x1E \u00F7\u00C5\u009F\u00B45\u00F7\u00F0\u00AA\u0097(\u00FC\u00CC\u00AF\u00C9l\u00AE\x01\u00F9G\u00EC\u00DB\u0084\u00AE\u0091p{\u0089\f'\u00C9\u00D4,\u00D2\u00D8\u00F53\u00EBB\u0092\u0085c)\u00BE\u00E9M\u008A\u00EEX\x07\u0081\u00F1\x1Fd\u008C;\u008B\u00A2[WS\u00DF\u00F7\u00EF\u0082\u00B0\u00A8&ryI\u00EA:\u00A9X\x04!j\u00C7u\u00BA\u0091$\u00FC$\u0092H\u00E2\u00E3\u008E\u00A3\u00FAQ\u0094e\u0091\u00C8\u00CC!\u00C7\u00D496)G\u00D7\u00FF\u0095BO\u00FE\u008C\u00E2\x07v\u00D8\u0093\u00B2\x14\r\u00DB\u0081\x05\u0081\u00D5\u00D6DVC5\u00C5\u00F7o\u00A5\u00E8\u009B\u00CFR\u00DF\u00AF\x1E\u00A0\u00C0CwRd\u00DD_\u00C9(\u009DBZQ\u00A9\u00ED\u00F2Q\u009D\u00ADd\u00F6\u00E0Y^\u00D1\x13\u00C6s}]\u00A4\u00A2\u00FD\u0082#\u0089$\u0092H\"\u0089\u00D3\u008Fc8\u00CE\x15\t\u0097\u0087\u00B4\u008C<R\u00BD\u009D\x14\u00DF\u00B9\u008E\u00CC\u009AJ\u00B2\u009D.R\u00EBw\u00BF\u00D8\x01\u008F\u00F3\u00B1\u00A6\u00E3\x10\x7F\u00C3!\u00B2\u009Aj(V\u00B9\u009B\x12\u0087\u00F6\u00DA>{\u00B3\u00AA\x1C\u00F7A\u00BB.\x1EoO\u00E4\n\u00DD@$\x03\u00CF&W\u00E8$\u0091D\x12I\u009C1\x1C\x7F\u00A6\u0094\u00F9\u00D84\u00C9\u00B25q\u00F6~\u009C\u0080\u00A0\u0099\u00C0y\t'\x0B\x01\u00F6\u00F9o_M\u00C1g\x1F%\u00B3\u00AD\u0099\u00B4\u0082\u00D1\u00E4\u009C\u00BD\u0090\x14\u00AF\u00BDO\"\u0089$\u0092H\u00E2\u008C\u00E3\x18\u0084/H\u0085\u0083d\u00B6\u00D6\u00D9/N\u00E9#\u008A\u0089\u008C\x0FN\u00D4V\u00A0\u0097\x12\u00FB\u00B6R\u00BC|\x1B\t\u00AF\u009F\u008C\u0092\u00C9\u00FD\u00C2 \u00E9:O\"\u0089$\u00928\u00E38*\u00E1\u00F3rK^'\u009F\u00A8(\u00B3_\u00B8r\u00CC\u00B8\u0090\u00F4\u00D2\u00B3p7n\u00E7%\u0098'\t\u00C1\u0082#\x18 \u00AB\u00B9\u00B6\u00FF\u00D8\u00E9\u00ECO1\u00C9\u00F7I$\u0091D\x12g\x1CG\u00D7\u00F0\u00A1\u0085\u009B-\r\x14\u00DD\u00F0&Q4D\u00FA\u0094Y\u00E4\u00F9\u00EC\u0097I/\u0099zd-\u00FE\u0089\u00F7\u00BCW\u00B8l\u0091\u00F0\u00F9I\u00B2\u0085\u00C0g,\u00DCo%\u00FD\u00F6I$\u0091D\x12\u00FF\x1B8:\u00E1\u00B3/>\x1C\u00A0\u00D8\u00F6U\x14^\u00F1\x023\u00B5\u00BD\u00DD1o\u0089\u00E0^x\u008D\u00BD\u00DE\u009E\u0089\u00DC\u009E\u0080\u00C55{\u008F\x1D\x16\x00v\u00E8\u00DFoGA\u00BB\u0097\u00B0\x0E\u008CI\u00B3\u00C81m.\u00CE)\u00B2:Z\x119\u00EE9U\u009C\u00CF\x02\u0084\u0085\x0E\u00CB\u009D\x0F`y$\u0091D\x12I|\x1C\u00A1\u00DD[\u00E8\u00F8\u00B7\u0081\u00DF\u00C3\x00V\u00EE\u00EB\u00B55}&n\u00ADh\f\u00E9#\u00C7\u0083\u00C0g\u00921\u00F5\x1C\u00D2\u00B2\x0B\u0088\u00DF\u00B2eb\x17\x0EG\u00FF\u00C7O\u00DCn\x12.\x1F\u0084A\n\u00E9\u0085c\u00C8u\u00D15\u00E4\u00BE\u00FAf\u00FB\u00B7\u00D9\\K\u00917\u009E\u00A1\u00F8\u00BE\x1D\u00FD\u00E4\u00FCQW\u00E8\u00F0\u00E3^X\x0F\u00F9#I\u00A6\u00E5\u0080\u00F4!hx\u008B\x06\x16\x00G\u0089[\u00E2\x14\u00A4[s\u00AB\u00A5V\u00AE\u0089\u00C4\u00EB*;\u00A9\u00FFu\u00E1$\u0092\u00F8\u00FB\x00wjV\u00D0\u0086\x07>\u00FF\u00FE\x0E\u009FD\x12G\u00C1\u00F1\u00F7\u00D2a\u0097\foi\\4\u0096\\\x17\x7F\u008A\\\u008B\u00AF#-\u009F\u00B7;\u00D6\u00ECI]\u00D5\u00D7M*\x12 \u008B\x05CSM?\u0091C\bh\u0099\u00D9$3r@\u00C4\u00D9\u00F6\u00A6jVg\x0B\u0085\u0097=E\u00E1\u00E7~m\u00FF\u00FE\u00C8\u00FD\x13\u009A\u00BD\u00C8\u00C8$\u00F7\u00A5\u00D7\u0093\u00EB\u00D2k\u00EDe\u00A1\u00F1\u00AD\u00AB)\u00F8\u00E7\u00FF\"\u00AB\u00B5~\u00E0\u00A6\u00F7\u00E2\f\u00BCx58\u00F0\u0086\u0086\u00A1\x18L\u008BM\x11\u00FE}*\u00D3>\u00D3xO\x19\x1Fx\u00E0\x01\u00F5\u00E0\u0083\x0F\u00FE\u00BD\u0097\u00E9o\x19\u00DA/J2\u00BCNCz\u0083\u00A6\u0092\x14\x1A8\x0B\x18^\u00A1\u0094\x19\u0089w\u00A4\x06\u0082\x0Fn#^N\u00974u\u00938&N\u00B0y\x1A\x00\u008D\u0099w\u00C1\u0094\u00FE\f\u00D2K\u00A6\u0090s\u00CEEdL;\u0087\u008C1\u0093\u00FA\u00F7\u00B5\u00B7\u00F7\u00D2a\u00ED\x1A\n\u00F3\u00E0~8\u00BA\x01\u008D\u00DFi\u008F~\u00AB\u00E6\x00\u0085\u00FF\u00F2$\u0085_\u00FF3\u0099m\u008DP\u00BE\x07\u00EE\u00F9(@\u009E\u00F4\x19\u00F3)\u00F5[\u008F\u0090^0\u00DA>e6\u00D5R\u00F0\x0F?\u00A1\u00F0kO\x11\u00F12\u00D2aZ\u00FEi$|NH[\u00BAt\u00A9k\u00F1\u00E2\u00C5\u00DE\u00AC\u00AC,\u009F\u00A6i.!\u0084.%\u00DB\x15\u00A8\x03\u00CBR\u00F1x\u00DC4\f#z\u00F8\u00F0\u00E1`EEE\u00E0\u0097\u00BF\u00FCe\x18\u0097\x12\b\x7Fo$)@\u00F0\u00CE\u00C9\u0093'\u00A7\u00A5\u00A4\u00A4\u00F8\u009CN'\u00F5\u00F4\u00F4\u0084^{\u00ED\u00B5\u00EE\u00C7\x1E{\u008C\u00CB\u0094$\u00FDS\x0BySqZ\u00CA\u00BFf'\u00A6\u00A5JQ\x12\u0084\x1D\u00CD\u009D\u00A6\x1F\x16\u00B9\x04\u0099\x18Q]\u00B5a\u00DA\u00F3tG\u00E0\u00D0O\u00EB\u0089\u00DB\u00E0o\x01\u00DC\u00F7\u0093}\u00E1o\f'&\u00FCA\u0080\u00D4\u0085\x04e\u00A6e\u0080\u00FC\u00D3\u00ED\u00AD\u0092\u00F5Q\x13H\u00CB\x19A\u00C2\u0097\n\u00AD>\u0097DJ\u009A\u00BD\x14\u0093\u00C9\u00DF1g!\t\u00C3a\u00BBq\x02\u00BF\u00FE.\u0099\u00ED\u00CD0\f\u00B8\x0F\u00D8\x1C\u00F8\u00E1\u00C1\x02\b\x02\u00C5\u00B5\u00E0jJ\u00B9\u00FFa\u00FB+[\u00F6\u00E9`\x0F\x05\u009F}\u008C\u00C2O\u00FC\u0088\u00ACp\x00\u00C9\u00BCW\u00B0\u009C\x06\u00C2\u00E7\u0082\x18\u00F7\u00DCs\u008Fo\u00D1\u00A2EY\u00B9\u00B9\u00B9\x05c\u00C7\u008E\x1D\u009D\u0096\u0096\u00C63\u00D49\b\x1E\u0084\u00C1L@\"R\x14\u00C4\u00DF\x19\u0089Djjkk\u00AB\u00F6\u00EE\u00DD[[VV\u00D6\u00FA\u00EC\u00B3\u00CF\x06\u00CA\u00CB\u00CBy?\u00E9\u00BF\u0097\u00C1\u00A1\u00AD_\u00BF>o\u00CE\u009C9\u00F3 \u00D8 \u00F5\u0089\u00D7\u00D9VVUU\u00AD\u00FB\u00CF\u00FF\u00FC\u00CF\x1A\u0090\u00FE\u00C0\u00DE\u00D8I\u009C\"8\u00FF2\u00D9;aa\u00AA\u00B8\u00D6\x104/f\n\u00FF\x11\x15^Z\n\u00FD\u00DAr\u0093\u00D6\u00DC`\u009A/\u00BD\u00DCK\x7F\u00BD\u00B3<\u00C8&\u00F4\u00FFf_\u00D2\x16`\\\u00CC\u00C9\"\u00A3\u00DB \u00B3b<\u00C5V\u00AD\u00B2\u00FB\x7F\u0092\u00FC\u00FF\x06p\x1C\x1F\u00FE0\u00D8\x04\u008A6\x0B\x05Iu\u00B5\u00D9>y\u00AB\u00A6\u0082\x12\u00FBwR\u00ACl\u00A3\u00BDWNl\u00C3\n\u008A\u00AD\x7F\u009D\x12\u0087\u00CAm\u00DF:[\x01\u00AA\u00AB\u0095\u00A2\u00AB\u00FFB\x14\u0081\x1D\u00FAQ\u00FD\u00F6\f\u00C4!\u00EC\u00CF)z\u00ED7wev\u00BE\u00CD\u00BC\u00BC\u00A1[\u00F4\u00F5g(^\u00BD\u009FU\u00EA\u00F7\u00A5u\u008A}\u00F8\u00F2\u00AA\u00AB\u00AE\u00F2=\u00F8\u00E0\u0083E\u00D7\\s\u00CD\u00AC\u00D9\u00B3g_ZPPp\u0099\u00CB\u00E5\u00BA\x10\u00D7\u00CEA8\x0Ba\x02\u00C28\u0084\u00D2\u0081\u00BF\u00E3\u00A0\u00F5\u0097B\u00CB/\u0085\x15P2n\u00DC\u00B8\u00FCQ\u00A3F9 $\u00CCP(\x14\u00AB\u00AC\u00AC\u00FC\u00BB\u00D0\u00F6g\u00CE\u009C\u00A9_~\u00F9\u00E5E#G\u008E\u00FC\x04\x0E/C`\u00D2\u0097\u0081@\u00A0r\u00E5\u00CA\u0095\u00CD;w\u00EE|W\x01M\u00E2\u00A3B\u0094ddx\u00BE\u0094m\u009D\u0093\u00E6\u00A0+,\u00A5fB\u009A\x16Z\u0082r\u00ED@\"\x17jX\u008E\u0094V\u00BA\u00B2DW\u00B7\u00A5\u00AAv\u00B7\u00C4;\u00DA\u00FA\x15\u008C3\u008E\u00A5D\u008E/\u008E\u00F2d\u00DF<\u00D6\x18;+\u00CBQ:\u00DD\u00E3\u00CA\u00C9\u00E9q\u00E9\x13T4\u00BE.\u00F4wi\u00CD\u00FE\u009F\u00C3\u00C9\x13\u00BE\r\u00B0&\x13\u00A9\u0094\u00F8\u00C3\u00FB\u00E1G\u00FB}\u00F9\u00C1^R\u00BD]\u00A4\u00BA\u00DB\u00C9\u00EA\u00ED\u00B0\u00CF\u00B1\x0F\u009F\u00B7Df\u008D\u00DC\u00AC(#\u00AB\u00F90\u0088\x18\u00ED}*H\x1F\u00FD\u00C6\u00EA\u00E9$\x15\u008B\u0091s\u00D6|\u00A2\u0084I\u00D1w^\u00A5\u00C8kO#mX\x18GI\u00E3\x14\x12\u00BE\u00F6\u00F9\u00CF\x7F>\u00FD\u00DE{\u00EF\u009D\u00B4p\u00E1\u00C2K@\u00DEW\u00A2.PP\u009A\u008AP\u0088\u0090\u008A\u00E0@`\fj6\u00FC\u00D6\x1A\x7FD \x05!\x1B\u00A1HJY\u009C\u0091\u0091Q4~\u00FC\u00F8\u00D4\u0089\x13'\u00C6RRR\x02\x1B6l\u00E0<\u00FDM\u00FB`\u00D3\u00D3\u00D3\u00F5+\u00AE\u00B8\u00A2\x00\u0084\u00CFe\u009E\u008E\u00C0ejoii\u00D9\u00B1y\u00F3\u00E6\u0086m\u00DB\u00B6%5\u00FCS\x07\u00ED\u00C64W\u00CE%\u00E9\u00D6\"\u00A7\u0090\x0B\u00A2\u008Ar\x13\u008A\x1C\u00E8T::\u0089\u008E\u008E\u00A5cH\u00E9\u00E8a\u00FC\u00FEz\u00D8R\u00B2\u00AA\u00CE\u00E9\u00A9\u00DF\u00D9=\u00B0\u00BB\u00E1\u0099\u0085\u00F6\u009D)\u00EE\u00FC+3\u00B4\x0B\u008A\u009D\u00EA\u00EA\x1C!/\u00CEw\u00D0Y\u00E3\x1C\u0094\u009E\u00E6\u00D5\u00FB2T\u00BC{}\u0090>.}\u00E3T\u0090\u00DCi\u00C1{\u00FD\x1E\x1F\x14\u00AC\u00F5\u00F3\u00CBX\u00F6~:\x1Ct\x12\u00BA\u0083\u00AC\u00BE\x1E\u00FB\u00A5-\u00D5\u00D3mO\u00DC\u00EASf\u0093bw\u00D0\u00A9\x02\u00D2U\u00E1\u0080\u00BD_\u008F\u00D5\u00DBM*\u00D4Gf\u00FDA\u00B2\u0082\u00DD\u00B6\u00809\u008D\u00D0\u00BE\u00F9\u00CDof|\u00FB\u00DB\u00DF\u009E\x01\u00AD\u00FE\x1A]\u00D7?\u008Ds\x17 \u00B0\x1B\u0087\t=\u0080\x00\u00C9F\u00BB\x11\u00D6#\u00BC5\x10\u00D6 lG\u00A8B@&m\u00810\n\u00E1|\u0087\u00C3\u00F1i\u00C4\u00B5\u00F4\u00B6\u00DBn\u009B\u00F3\u009F\u00FF\u00F9\u009FY8w\n+\u00EA\u00D4\u00A3\u00BC\u00BC\u009C\u0085=wh\u00EE;\u00EC\u00CE\u00E1\u00C0\u00BF\u00FFf;\u00F9\u00DF1\u008CO\u00A4&\n\u00DD\u009A(\u0085\u00DA\u0094\tr\u00D7@\u00F6\u00BC\x10:\u0086\u00DF\x1C\u00F8\u00B7\u0088\t\u00E1\x10R+\u00CE\u00D4E\u00C9\x04O\u0084\x05\u00F0G\x1B\u00D7\x1F\x0E\u00C64\u008F^\u009C\u00A6\u00D1E\u00E8\x10\u0097\u00C6\u0094\u00BA\ba\u00B1GZW\u008Cw\u00C9\u00993\u00D3<\u00AC\b\u00FD_\u00ED#\\.\x1E\x07\u00C6m\u00F9\u00E4\u00B9o\x1E\u00F9\u00FE\u00BB\u009F\x0F\u00FE7\u00DA\u00E1\u00B88-\x19\x12\u00E8\u0086f[=%\x0E\u00EE\u00B6\u0097h\x1A%S\u00ECe\u009B\u00A7\x12\u00FC\x16\u00AF\u00ED\u00CFg\u00F7\rw\u00FB\x04+\x0F\\\u00EF\u00A7\u00ADO\u00C9[o\u00BD5\u00F5s\u009F\u00FB\u00DC\u00D9\u00A5\u00A5\u00A5W\u00E3\u0098\u00DD\x19\x13\x11\u00BC\b0+h\x1F\u00C2\u00EB]]]\u008F\u00D7\u00D4\u00D4\u00FC\u00F2\u00E0\u00C1\u0083\u008FTTT\u00FCz\u00EF\u00DE\u00BD\u008F\u00E2\u00EF\u00AF\u00AA\u00AB\u00AB\x1Fnkk{\u00CC\u00B2\u00AC\u0097q\u00DF.\u0084\x0E\x04\u00FE\u009A;\u00BB{\x16\u008F\x1B7\u00EE\u00EA\u00CF|\u00E63\u00D3\x1Fz\u00E8!\x1E\x18\x7Fs\x1De(\u00C2\u00E1\u00F7\u00CF\x0BF\u00A3gf\u009B\u00EB\u008F\x11\u00C4\u00A5\u0085)\u009Eq^*\u00D5\u00859&A\u00C2\u00CD\u00E4\u00AE\tJ(\u00A5Z\x10\u00DA\u00A4\u00A9b\u00DC\u00DBM\u008Bt\u008C\u00B9L\u008F\u00B0\u00C6\u00CF\u00D2D\u00C1\u00B9D\u00CE\u00FE(\u00CE(d\x06\u0089\x14]\u00C8\u00DC8\u0089\u008C\b\t\x7FT\u0089\x14MR~\u008A\u00A4\u00DC\f\u00A7\u00C5y:m\u0083\u00F3\x7F\x0B3g\u0092\u00F1\u008D\u00D4\u00D4\u00B4\u009F\u008Dq\x15<3\u0095&|!\u00CF7\u00EBn\u00E5\u009B>kfj\u00C1=\u00FF;\u00EDp\\|@\u0097\u00CE\u00C9\u0082\u00C9\x18\u0091g\u00E5\u0093c\x06\u00BB\\\x12\x14\u00DF\u00B7\u008D\u00CC\u00D6\x06\x12\u00F6\u008BY\u00B8\u00F8\u00BE\u0080\u00C7\u00F8\u00EF\u00C0\u00E3'\u00EA\x1BL\u00F4\u00BC\u00BE\u00DF}\u00E5\u00E7l\u009F}|\u00C7:\u008AW\u00ECD\u00EFG\u00FC\u00A7\u00DE\u00A5#\u00BE\u00F4\u00A5/y\u00EF\u00B8\u00E3\u008EI\u0093'Of\x17\u00CE\u00C58\u00C7\u00CB\u0083\u0098\u0098\u009B\x116uvv\u00FE\x05\u00C4\u00FE\u00FA[o\u00BD\u00B5\u00E1\u008D7\u00DE([\u00BDz\u00F5\u00A1u\u00EB\u00D6\u00D5m\u00DA\u00B4\u00A9\x1E\u00E7j\u00D7\u00ACYs\u00B8\u00BE\u00BE\u00FE\x10\u00EE\u00ADv:\u009D\u008D>\u009F\u008F\u00CDn&|&x\x0E\u00BE\u00B4\u00B4\u00B4`fff\u00CD\u00AAU\u00AB\u00BA!\x1C\u00D8\x1Dt4p\u00E1\u0086j\u00D6C\u00C3\u00F0\u0082\u00F3\u00F1\u00B1\u00AE1\u0086_\u00E3\u00BF\x1C\u0086\u00C6?x\u008E\u00C1\u00C7\u00FA\r7\u00DC\u0090?v\u00ECX\u009E\u00AB(\x198W\u008B\u00B2m}\u00FA\u00E9\u00A7\u00EB\x0F\x1F>|\"\x1F\u00FE\u00F0\u00F8\u0087\u0086\u00A1i}\x18\u00F0\u00B3\u0083q\u009DL\u00FD\x1C\x0F\u0083q\r\x7F\u0086\u008F\u008F\u0095\u00FFS\t\u00ED\u00C6\x14\u00E7\u0088y\x19\u00D6%N!\u00CE\x03yf`t\b\u00A7P\u0081\u00F6\x04m7Iu\u00F8\f\u0091\u00AEH\u00F0\u00E2\x00\u00D6\x7F\u0084A**HV\u0087\u00C9U\u00BB:\x10;\u00D3\u00ABu\u00B4[\n\x1CYi\u0086Y\u00AC\u0091\u00C8\x11\u008A\u00A4.D\x006\x7FU\u00AF\x14\x1B\u00F7\u00F4\u00D2\u00BE\u00E7;\u00E2\u00BCP\u00E2\u00FF\x12\u00E4\u00A3.o\u00D6\u0095\u0085\u00D6\u00D93\u00FD\u00FAE\u00E3]\u008E\u008B\u008B\\4?U\u00AAB\u008BDO\u00ABt5\u00BF\u00DA\u00F3\u00B7\u00A5\t\u009D\u00FC*\u009D\x0F\u0084~[\u00D3y\u00C1\x12J\u00FF\u00EE\x13dEB\x14\u00FA\u00D3/(\u00FC\u00D2\u00EFmN\x17:{-0n\x06\u0087\u0092\u00AD\u00A4CCg\x1B5\x11\u0085\u008D\u009A\u00E8?\u00B6\u00EF\x19>\u00DE\x00\u008EDj\u00E4\u009C\x7F\x05\u00A5\u00FE\u00DBo\u00C9\u00EA\u00EB\u00A4\u00C0\x7F=H\u0091\x15\u00CF\x1F\u00F3\u00FB\u00B8\x1Fq\u0095\u008E\u00F1\u00F2\u00CB/\u008F\u00BA\u00F8\u00E2\u008B\u00AF\u00F2z\u00BDKq<\x19\u0081\x07<o\x12\u00F4\u00CE\u00FE\u00FD\u00FB\u00DFX\u00BE|\u00F9\u008E\r\x1B6\u00F0\u00AA\x1B&r&\u00EB\u00A3\u00C5\u00AD\u009D{\u00EE\u00B9\u008EO|\u00E2\x13\x19W^y\u00E5\u0084\u0092\u0092\u0092\u008B<\x1E\u00CF\"\u009C\x1F\u0089\u00C0\u00AB+^\x03q\u00FE\u00F9\u00B6\u00DBn;\u0080\u00F8\u0086w\x14Y\\\\\u00EC\u00C05?\u00AC\x01?,\x05\u0097\u00C3\u00E1\u00D0\f\u00C3\u00A0x<N\u00B1X\u00CC\u008CD\"a<\u00DF\x0B\u00E1\x12\u00C0\u00F3\u00E6\u00BD\u00F7\u00DE\u00EB\u00BC\u00E0\u0082\x0B|}}}\u0086\u00942\u00BE}\u00FB\u00F6\u00C0\u008F~\u00F4#{\u00E9\u00E4]w\u00DD\u00E5\u00982e\u008A\x1F\u00E5qA;\u00B7Z[[\u00C3o\u00BF\u00FDv\f\x02\u008D\u0097\\\u00FAsrr\u00DCHC\"\u00DEX0\x18\f\x1C8p \n\u0092w\u00B4\u00B7\u00B7{g\u00CF\u009E=i\u00C1\u0082\x057k\x1A/\u00C8\u00B0\u00EBa\u00F3\u0096-[\u009Ex\u00F3\u00CD7\u00B7\u008C\x1E=:\u0080\u00E7\u00C2\x10x\u0081a+v\u00C4\u00A4I\u0093\u008C\u00A5K\u0097\u00FAP\u008E\u0094\u00D4\u00D4T7\u00F2\u00A4s\u00FE\x11?\u00E9:\u00BB\u00A4)\u00D6\u00D0\u00D0\x10\u00D8\u00B1cG\u00DF\u00EF\x7F\u00FF{\u00CE\u00E7\u00B1\u00EAq8\u00B8\u00C1\u00ED\u00A5\u00B1\u0097]vYJzz\u00BA\x0F\u00F1\x19\u00A8\x0F\u0089\u00F2\u00A1\u00BB(\x15\b\x04\u00CCD\"\x11\u00DA\u00B3gO\u00EF+\u00AF\u00BC\x12<\u00C1\u00CA(\u00FD\u008F\x7F\u00FC\u00A3\x1Fy\u00F3\u0084B!\u00B6^\u00B8,\u00A1m\u00DB\u00B6\u00D1\u00DDw\u00DF\u00EDE\u00BD\u00A5fddx\x06\u00F3\u00CF\u00F1\u00E3\u00BExGGG\u00A0\u00AC\u00AC\u00AC\u00E7W\u00BF\u00FA\u00D5`\u00DE?4\u00F2\u0089<OM\u00F3\u00CD\u009D\u00E5\u00A5\u00DB\u0091\u00CD\u00C51%RQJ\u00D3%U\u00DD\u0081\x10=\x0FBUc<\u00EA2K\u00C9\u00F1qE\x0E(4\u00A6G\x13\u00F5\u00BD\t\u00F5\u00E4\u00CA\x16\u00F1\u00D4\u00E7\u00AA\u00FB\u00D8}\u00F8Q'\u00D0\x07\x07\x12\u00FF\u00E5\u00BA:^[h\u008F\u008Fs\u00E7]\u0090\u00A1\u009D\u0093\u00AD\u0089\u00F3\u00DD\u00C2,R\u00A6`'\u00EB\u00CE\u00F2\u0090Z\u00FD\u00A7]\u00A1\x03\u008F\u00D1\u00D07\b\u008E\u008B\x0F\u0092.\u00E3\u0083\u00DE\x7F4\u00F0\u00B3\u0083\u00F1\f\u00E2Dq\x19\u009B\u00A6{'M\u00F1\u0088O9\u00C8\u00BA8n\u00C9Q\u00A0%n\u008B\u00B2\u00C6\u0098z\u00FC\u00BF\x0F\u008B7\x1El\t\u00B4\u00E1\u00BE\u0093\u00CD\u00CF\u00F0<|\u00D8\u00B2\x1C\r\u00E2\x01\u0084\u00D3D\u00F8\u00C8e<F\u00C6\u00E4\u0099\u0094\u00FA\u00CDG\u00EC\u00F5\u00FB\u00B1\u008A\u00DD\x14\u00DB\u00BA\u009A\u00B4\u009C\x02\u00D2r\x0B\u00A1\u00AA\u00B8\u00D8\x17\u00CCY\u0080^\x12&\u00AB\u00BD\u0099\u00CC\u00CE62\x0F\u0095S\u00ACr/Y\u00F5\u0095d\u0085\u0082\u00A0\x00\u00F0\u00A7\u00ED\u00A9\x1C\u00A2@\u00C1\u0086\u0095\u0099\u00D9\u00E4\u00B9\u00EE\u00CB\u00E4\u00BD\u00F1nJ\u00D4TP\u00CF\u00F7\u00BFJf\u00F9&\f>\u00DC\u00FB\u00BEv\u00FBH\u0084/\u00BE\u00FE\u00F5\u00AF\u00A7\u00DCz\u00EB\u00AD\u00E7\u0097\u0096\u0096\u00DE\u008Cc\u0098,\u00F6De\x13\u0088m%\u0088\u00F0\u0085\u00A7\u009Ezj\u00DBC\x0F=\u00C4.\u009A\u0093\x1D`\u00DA\u00F5\u00D7_\u009F\u00F2\u00C5/~q\u00FC\u00FC\u00F9\u00F3/\x06qL\u00C1\u00B9\u00BA\u00E6\u00E6\u00E6U+V\u00AC\u00D8\u00FA\u0097\u00BF\u00FC\u00A5\x03\u0082c\u00900l\u00A2\u00BC\u00FA\u00EA\u00ABS\x17-ZT4}\u00FA\u00F4\u0089 \u00CB\u00F1x\u0086\u0097~\u00F6\x7FM\u00BE\x7F\u00A27\x02Bk\u00EE\u00EA\u00EA\u00DA\x0Fb\u00DF\x0F+\u00A3\u00F3s\u009F\u00FB\\\u00E6T\x00\u00C4\u009C\u008E\u00EB\u00ED\u00B0Bv\u00FD\u00E2\x17\u00BF\u00A8\x06\x19\u00C7\x1E|\u00F0\u00C1|\u00A4=\x0B\u00E7\u008BP\u008Ehccc-\u00C8\u00B0\x1Be\u00CC\x1B5j\u00D4x\x10f\x01\u00AE\u00F1\u00C7\x0B\u00DA\u00C0\u00F9\u00FB\u009B\u009A\u009A\u009A\u00F3\u00F3\u00F3s\u00C1m#@\u0080#SRR\u00E6\u00E1\u00DAx\x04n\u0098j\x10\u00EAz\\\u00AB\u00F6\u00FB\u00FD\u00BC\u00F4\u00F4 \u00AC\u009B=\u00C8o;\u00AEq9\u00F4o|\u00E3\x1B\u00FE\u00F3\u00CE;o\x04\u00F2?\u00BE\u00B0\u00B0\u0090W0q\u00FCC\u0097\u00AEr\u00DDu!\u00EEC\x10\u00A0\u00FB@\u00FA\u00D5\u00B0\x18\u00DAP\x0E&O.\u00DF\u00B1 g\u00CE\u009C\u00E9\u00FA\u00CAW\u00BE\u0092\u0085\u00A2\u008EF]M\u0086\x055\x16\u00E7\u00D3\x10\x06\u00E7C\u00F8\u00F9\x10\u00CA\u0089b6\u0096#\u00EE\n\b\u00B7\u00A6\u009F\u00FE\u00F4\u00A7\u00EC\u008A\x1B\u00DEf\u00FC\u009EA\u00EA\u00B7\u00BF\u00FD\u00ED\u0099\u00A8\x03\u00CE\u00A7\x05!W\u00FE\u00BB\u00DF\u00FD\u00AE\x1A\x16\u0098s\u00E1\u00C2\u0085\u00E3!\u00D4\u00A6\u00E0Z\x11\u00AE\r\u00E6\u009F\u00CB\u00D8\u0087\u00F8\u00ABv\x01\x10|\x07\u00EE\u00BB\u00EF>\u00EE\x0FC\x05\u00DE\x07\u0081\u00B8\u00C0\u00E7\u00CB\u00FA\u00E3\x14\u00BA6S\u00A8[\u00C1\u0092S,%\u009C\u00E8\u00C3\x11I\u00D6\u00B6]\x01z\"\u00A2Ddv\n]\u00A7)\u009A\x0Fa\u00E0GGVnI}\tE\x7F=\x10Q\u00BF\u00F9U\u00A3o\u00C3\u0093--\x18@G\x05\u00F7\x19A\x0B\u0090\u00F7U\u00F8\u00C5b{\u0095=\x16\x06\u00EBYLB\u00DDM\u00CE&\u00C7\u00F4L\u00BF\u0093\x12J\u00F6\u00C6\u00B4\u00C4\u008AxOt\u00DBxX\u00C6\u00C7Xf\u0089g\x1C\u009F\u00CCtg\u00CF\u00CE0\ns\u00DCfz\x18\u00AA[y\u00AFh\u00DC\x11\u00E8k\u00F8};q^\x06\x07\u00A7D\u009AbH\u00DA|\u009E\u00E3\u00E3k\u00FA\u00E2\\P\u0087\u0091\u00E2\u00CCvYZ4\"\u00CD\r\u00F1\u00DE\u00E8\x1B\x13):,]\u00BB\f\u009C\u00CF\u00B9YY\u00CE\x12g\u00D4An%[\x13z\u00BC\u00F2pwl\x19\u0098\x03\u00D7\u008F\u009A\u00CF\x01\u00D8\u00F9\u00C0\u00F3Z!\u00D2\u009B\u00E1Lu8\r\u00D3\u00F0:\u00DD\u00D2\x11\x16\u00AA.\x126\x0F\u00C6\u00FB\u00A2\u00AF\u00B4#\u00DD\u00FE>\u00C2\u00F1\u00BC'm\x04\u00D7\u00CA\u00E9\u00BEYg{\u00D4\u00CDN\u00A2\u00C51S\u00E4\u00F06d\u00E0\u00A0m\u00B5a\u00ED\u00F7\u00BF\u00A93\u0097?\u00DC\x1EjG\x19\u00AD!\u00F5;<?\u00DC\x0E\u00DA\u0082U\u00A4\u008FKOwN\u00C9\u008C;\"\x0E\u00B7\x16\u00970\u00E5\u00BA\u00C2\u0089\r\u00B1\u00BE\u00E8\u00AA6\u00BB,\u00C3\u00F30\x14vY\u008EU\u00A70\u00C3\u008D\u0085\u00E9\u00E4\u00BA1\u0093\x1C\u00A7\u009E\u00F0\u00A1}\u00DB\u00FB\u00E8x}\u00E4\u0098\u00B5\u0080\u00BC\u00B7|\u0083\u008C\u00F1g\u00A1\u00EA\u00A1\u00B5\u0087\x02h\x1Ep\u0088\u00EE\x00\x7F\u00F38\u00E9O\u00DA&\u00E98\u00CA\u0083\u00BF\u00BC\u00C2\u0087\u00BF\u0086e\u00D6VQt\u00F3J\u008AmF+\u00B7\u00D4\u00D9\u00FB\u00EB\x13\u00D4\x1A\u00FB\x11MG\x0B\u00CD'\u00FF]\u00DF\u00830\u0099D\u00D1\u00B5\u00CB\u00A9\u00EF\x07_!\u00AB\u00AB\x15\u00F7\f\x11\fC\u00F0\x11\b\u00DF\x00\x01\x17/^\u00BC\u00F8Zh\u00D47\u00E0\u0098\u00C9\u00845\u0095\r\u0087\x0F\x1F~\x12\u00DA\u00DC\u00EA\x1F\u00FE\u00F0\u0087,\u00C5\u00B9s}\x10H\x10\u008B\u00EF\u00DAk\u00AF-\u009E0a\u00C2\u0088\u00DA\u00DA\u00DA\u008E?\u00FF\u00F9\u00CF\u0087Ap]\u00ABV\u00AD\x1A$!\x01\u008B\u00C0\u00F5\u00D5\u00AF~u\x04\u00FE\u00CE\x189r\u00E4y8\u00C7\u00AB\u0081\u0098l\u00D8\r4`*\u00D9\u00E5`r\u00E1\t\u00E1\u00C3 \u00E8\u00DD\x15\x15\x15{@\u00BE~\u009077?\u0093k\x154\u00FD\u00E7_|\u00F1\u00C5\u00B5H7\u00B8l\u00D9\u00B2\u00A9\u00D0\u00E4o\u00C2\u00F9\x19\bQ<s\u00C84\u00CD\u00A0\u00DB\u00ED\u00E6\u00B8\u00C7 d\"0\x1A\x10\u00D6CX\u00D4B\u00AB\u009D\u0086\u00DF<o\u00C1\x02\u0084'\u0098\u00FD\b\u009C>\x0Ff&w\u009E\u00B4\u00E6\r\u0093VWUU\u00BD\x04+\u00E2`MM\r[\x13\u00D9\u0097\\r\u00C9T\x10\u00E5\u00F9\x10Tg\u00E3:Org \u00F0\u00E45?\u00CF\u00E0\x0E\u00CA\u00F5\u00DA\u0084p\x10\u00C4\u00BF\x05\u0082k\u00E33\u00CF<S\u00F1\u00B3\u009F\u00FD\u008C\u0089\u0099\u00AF\x0F\u0087d\u008B\u00E7\u00BA\u00EB\u00AE\x1B;w\u00EE\u00DCsa-\u00CD\u00C19\x16BP\u0090\u00DF#L\u00B8~x\u00D0t!\x1C\x021\u00EFF\u00FE6\u00AC]\u00BBv\x17\x04ukee%_\x1B\u00EC\x0B\u00F2\u0091G\x1E)\u00F8\u00D2\u0097\u00BE\u00F49\u00FC^\u008C`\u00F5\u00F6\u00F6\u00AE\u00820\u00AC@}\u008D\u0086\u00B0e!\u00C9Km\u00B9~X \x0E\u00E6\u009F-;\u00CE\u00FB\u00AE\u0096\u0096\u0096\u0095\u00CF=\u00F7\u00DC\u0086/\x7F\u00F9\u00CB\u008D8\u00FE0\u00A4o\u00FCh\u00A4\u00AF\u00F4\u00E6|\u00FA\u00A2[\u00A7\u00A5A\u008B\u00F2a\u00FC\n\x10z\u00AF)h\u00D9\u00CA^\u00F5xE_\u00AC\u00EF\u00B6\x1C\u00E7\r.\u0083>\x1D\u00B6(\u00CFT$\rA1\u00AF\u00A4\u00BD\r\t\u00FA\u00ED\u00F3}\u00EA\u0085\u00FB\u008E\u00B1&\x7F\u00E9$r\\N\u00DE\f\u00A7\x16O\u0093!\u00D2\u00A1\u0091Z\u00BD\u0086\fnn\u008Et\u00AF\u00D6\u00C8\u00BA=\u00C3\u009D2\u0082d\u00D6H/e\u00E5\u00E9\"S\x1A\u00CA\x11\u008E\u008BPKT\u00B4U\x07D\u00F3\u00DA\x18u\u00FC.\u00B7\u00B7\u008F\u00B6\u00BD\u00A7l\u00E2\u00DE\u00DC\\O^FO\u0096\u0096\u0088\u00A4'\u00E2n\u00A7\u00CB\x14\u00A6\u00A9\u0087\u00FA\u00BA\u00E2)m\x0F\u00D6\u00F7\u00F6\u00E0\x1E\u00F5\u008B\u0092\f_\u00B6\x1E\u00CA\u00D0\x12\u0096'\u00E2!\u00A9\u00FAD\u00AC\u009E\u00F4\u009EM}\u00C1\u00D0\u00B8\u0088\u00CF=\u00AD\u00982G\u00EB\u0094\u009B\u00A7S\u0096\u00E1P\u00AEpL\u0084;Mj\u00AB\u00E8\u0091M/[\u00B2\u00ED\u00A5\u00C3\u00DD\u00DC\u00C7,\u009E\u00A7\u00B8b\u0094'm\u00BC_d\u008Fr\u00E9\u00B9)\u009A\u0099\u00E9\x14J\u008B$d_3\u00EE/\x0F\u00C8\u0096\u00B7\u00DBe\u00C7\u00B3]]\u00DC7\u0087\nu(Pd\\\u00D5\u0090\u00EA\u00CD\u00F2DS\u00C6\u00F8\u00B5\u00B4l\u008FH\u00F7K3\u00DD\u00E7\u0090\u00A9\u0086\x10\x0EI\u00C2\u008C\u00C5\u00ADPS\u0082\u00DA\u009B\u00C3\u00C1\u00962\u00F2\u00B47\x1D\bu\u00C3B\u00E16V\x184\u00CE\u00D9\u00C5\u00DE\u00B4\u0090&\u00B2\u00CE\u00F6\u00AA\x19\u0093\\t\u00AD[\u00A3yq\x12i\x18\u0090\t\u00CB\u00A4\u00BD5f\u00E2\u0085\u00CD\x1D\u00895\u0086\u0090]^\b\x01\u00E1\u0093\u00C1\u00FD\r\u0091\u00F6\x07\u00DB\u00EC\u00B1\u00C2m\u00C2D\u00ECXZ\u00E0\u00F7\x15\u00A7\u00C7\u00D2F\u00EAZ\x06\x06DN\u009E\x1B\u00F5-\u00A43\u00A6\u00C8\u008C\u00C00\u00ED\u0088\u00AA\u008E\u00FAP\u00B0\u00ED\u0090rw\u00EC\u00EA\n\u00F7<\u00DBf\u00BFX7\u0094k\u00C4\x0Fs\u00C9\u0093\u0093\u00E9\u00CA\u00F4\u00C6,\x7F\b\u00FDD\x19\"\x16\u0088\u00E8\u00BD\x7F\u00E8\r\u0086.\u00D6\u00C9=-\u00CD\u00C8\x1B\u00EB\u0094\x05\u00D9\u0086\u00C88\u00B5>|\u0090=\x13\u00B9\u0096?\u00CA\u00DEC\u00C7\u00F3\x0Fw\u0092^4\x06\u00D5\u00A7\u00C8\u008A\u0086\u00C8\u00EA\u00EE$\u00F3\u00C0Nh\u00FAoS\u00BC|\u008B\u00ED\u00D7\u00E7\u00908\u00B8\x07\u00D7\u00DAl\u008D_\u00A4d\x10/\u00E9\u00D4F\u0095\u00921qz\u00FF\u0084\u00AF2\u00C9jk\u0084<\u00B0\u00EC/q\u00F1\u0086l\u00BE\x1B\u00BFj\u00BF\u00F1k\u00B56P\u00F8\u00A5\u00C7\u00EDx\u008E\u00B7G\u00CF\u0087\u00F5\u00E1\u00DFs\u00CF=\u00CE\u008B.\u00BAh\"\u00B4\u00DB%8d\u00C2\u00E3\u0089\u0098Zh\u00B1+\u00D6\u00ACY\u00F3\x16\u00C8\u0098\x07\u00F5\u00D0\x0Eu\u00B2P\u00D0\u00B4\u00E3\u00E1p\u00B8\x1B\x1Ad\u00D3k\u00AF\u00BD\u00D6\u00F4\u00BD\u00EF}\u00AF\x0FBd\u00B01m\u00B2\u00FF\u00DA\u00D7\u00BE6\n\u00C2fAnn\u00EEU8\u00C7\u00E4\u00CDd\u00C3\u00DA+\x17\u0094\u00B5\x0F\u00EE\u0084\u009C>\u0093'\u009F\x1F\x01\u008D\u00BE\b\u00DAh>\u00B4\u00D0Q.\u0097kP@\u00C4`\x01\u00EC\u0083\x02Z\r+ ~\u00F1\u00C5\x17\u008F\u00CE\u00C9\u00C9\u00E12\u00F1\u00D2\u00CA|<\u0093g\x18\x06\u00FB\u00E490\u00A1\u00B3\u00AB\u0086\x07tKww\u00F7\x1E\u00E43\f\u00F9\u00C1\x1A/\u00CF]p:L\u00A8LxL\u00AA\u009C\x17\u00BE\u009F\u00F3\u00C0\u009D\u00B9\x01\x02b\x1F\x04X\x0F\u00883\u00E7\u008A+\u00AE8\x0F\u0082\u00E7j\u00B4/\u00BB\u00AF\u00D8\x1D\u00C6\u00C2\u0082\u00EF\u00E76\u00E0\u00FC3\u0099s\\,@\u00D8r)B\u00DE\u00F3\x0B\n\n<yyy\u0081\u00F4\u00F4\u00F4\x1E\u0090\u00F3PRf\u00C8\u00BB\u00EF\u00BE;\u00E5\u00F3\u009F\u00FF\u00FC\u00B49s\u00E6\\\u0085r^\u0081s\u00B3\x11xi,\u00E7\u008D\u00E3\u00E4\u00C1\u00C1\u00CFq\u00FE\u00F8\x1C\u0097\u00AB\x00\u00F9\x18\u0099\u0099\u0099\u0099\u0085\u00F8M\u00E4\u00AB\x1B\x16Ep\u00C8\u009C\u0089\\\u00B0`A\u00E6\u00BCy\u00F3x\u009E\u0086W`\u00E5A\x18\x1Ah\u00FF\u00D1(\u00FF\u00F98fk\u008C\u0085-\u00D79\u0093\x0F\u00E7\u009F\u00EB`0\u00EF\x05>\u009F/\r\u00F1\u00F6!\u00FE\u00D6\u00D7_\x7F\u009D\u00F3\u00F0>\u00D2=\x0ED6\u0091\u00FB;\u00C5\u00CE\u00E9\x19N\u00B5\x18Cj|B\t\u0098\u00C3dy$\u00B5\u00F7Z\u00F4\u00F6[\u009Dr\u00CD\u00AB\u0081p\u00FB\u0095\u00E9\u00AE\x1C\u00AFP\u00A5h\u00A4L$\u00A0\u00F3\u00F0q(%I\u0089\u00A6\u00A60\x1D|\u00A9#\u00DE\u0089\u00F8\u0086\x0BJ\u00F9\u00EDt\x7F\u00DAu\u00D9\u008E\u00F9g\u00BB\u00E9\u0093\u00E3\u00BCr\u00E1\u00C4T}\u00F6\x18\u00B7\u00C8u\u00EBN1\u00D7c\u00E5.Iw\\0\u00C5\u00AB\u0096\u00E49ha\u008A&\u00E6\u00B9\x04\u00CD\u00C6\u00DF\u00B3\x0B\x1C4y\u009C_\x15Mt\u00931.\u00E8\tU\u00B5G\u00C2H\u00C0\u008E\u009F'/\u00FF\u00D5-G]\u0091\u00A1-\u009C\u00E5w,\u0099\u00EE\x13\u00E7\u00CDM\x153\u00E6\u00A4\x1A\u00F9\x13\u00BC\"T\x1C\u00F6u-\x0F\u0087\u00E9\u00D1Ib\u00C2\u00B9>\u00C7'J=r\u00C9\x04\u008F\u009C7\u00CD''\u008D4\u00C8\r\u00FD\u00DA\u00BB8_\u009E=\u00C7K\u0097\x16\u00E8t\u0089\u00DF\u00A0\x0B<\u0082\u00E6\u00A4!\u00DD\\\u009D&\u008EKU\u00B9S\u00A4\u00A9\u00B4\x14=,cn\u00E3k\u00A3\u008C1\u009F\u00C8\u00D6\u00E6Oq\u00D3\u0092,\u00DD\u00BC8E\u008A\u00F3|d\u00CDL\u00D1\b\u00F9T\x13\u00C6\u00B9\u00AD\u00EC\x12\u008F\u00A5\u008A\u00DCFh\u00F5\u00D9\u00F1\b\x1D\x1E\u00A8\u0087\x05\u00A4\u00FF&\u00EC\u00CE\u00BB\u00AC@\u00CE8/M.,\u00F5\u00D1\u00E2\\\u0087\u00B5 \u00C3\u0090\u00F3\u00D2\u00A4\u009A\u00E3$1\u00D3\u00858<B\u009C\ra7\u00AD\u00C4\u00AB\u008F\u009Bh\u00C8\u008C\u00ACl\u0097\u0099m8C\x1B{\u00A3\u00D6C\u00D3\u00DC\u00D9We\x1B\u00F3\u00CE\u00F5\u00D3\u0095\u00D9\u009AZ \u0095\u009A\byk\u00B7\u0081\u00856@g\u00D3\u00D3$eL\u00F6\u00EA\x13\u00A6\u00A4\u008993}\u00FA\u00EC\u00A9\x1E\u00CA\u00CEMsu<R\x17c\u00A5\u0083n\u00C8\u00C8\u00F0\u00DF9Z+^\u0094N\u00E7\u00CCp\u008B\u008B\u00C7\u00E8\u00E2\u0092<\u0087\u00B8\u00D0%\u00D5\u00B9h\u00ECY~i\u009D\u00ED\x13\u00E2\u00AC\x11\u00BA\u009AV\u00EA6\u00C6Mp\u0089\u00ACR\u009FK\u0096\u00A6\u00E9\u00D1\u00DA\u00F687\u00EC`\u00BBj\u00BF\x1C\u00EB/\u00BE(M^1\u00D1\u00AF]5\u00CE/\u00E7\u009D\u00ED\u0096\x13\u00F2<\u009A7\u0097L\u00CFEi\u008E\u00B3f\u00A7jKr\x1Cr\u00B1\x12t\u00DE)%|\u0098\u00F4\u00A4\u008D,!\u00CF\u008D\u00F7\u0090\u00FB\u00F2\x1B@\u00FC#A\u00D4\u00CD\x14]\u00F3*E^z\u0082B/\u00FC\x1A\u00BF\u0097\u00D9\u00AE\u009D\u00F8\u00AE\r\u00EF\r[VSt\u00FD\u00EB\x14\u00DB\u00B6\u00C6&q\u00DE\u009A\u0081]?6\u00F1\u0097L%\u0091S@2-\u008B\\\u00F3\u00AF$\u00CF\u00A7\u00BF`\u00EF\u00C0\u00A9\"!\u008A\u00BD\u00FD\x12\u0085\u0097=I*\x00\x05\u00E2\x18d\u00CF\u00F8\u00B0\u0084\x7F\u00E9\u00A5\u0097\u00FA@\u00BCgA\u00B3\u00BB\x04\u0087\u00BC\u0094\u0092I\u00B0\f\x1A\u00F4\u00AB\u00BF\u00FE\u00F5\u00AF\u00F7\u0096\u0095\u0095\u009D\u00AC_\u00F2hP\u00FC\u00A2\x12\u00B4\u00ED\u00D8\u00C6\u008D\x1B9\u00DE#\u00C40i\u00D2$\u00C7\u00B7\u00BE\u00F5\u00AD\u0091\u008B\x16-\u00BA\bi3\u00D9\u00B3\u00F6\u00CAD\u00C9$\u00CFZ\u00F7\x1Eh\u00AA\u009BC\u00A1\u00D0\x16\u00D4\u00FB~\x10$[\x19LB\u00EC\u00E6\u00C9`\x02\u0087E\u0092\x0Fr\u00E3g\u0098L[\u00A1\u00E1\u00EF\u00846[\x05\x12\u008A]y\u00E5\u0095E 1&4\u00B6Xx\u00A5\x11\x07\x16fLb5\b{\x07\u00C2\x16\u0094q#\u00F8\u00BE\x1D\u00F7\u00B3E\u00C1\u00E5e\u00EB\u0088\u00D3\x19$V\u00D6\u00EEy\u0095\u00D2~\u0084\n\u0084\u00DD;v\u00EC\u00A8D\u009E\u009C\u009F\u00FD\u00ECg\u00E7\u008E\x181\u0082\u00F3\u00CFi\u00B1\u00A5\u00C1e\u00E4\u0089\u00EEr\u00E4\x7FK \x10\u00D8\u008A\u00DF\x07q\u00EF\u00A0K\u008C\u0085\x06\u00BB\u00CC\u00B28\u00EF\x10t\x1A\u00D2\u00EDhhh\u00E8:p\u00E0\u00C0\u00A0F)\u0096.]\u00EA\u00BD\u00E5\u0096[&\u00CD\u009C9\u00F3*\u0094\u00F3r\u009Cca\u00C4\u0093\u00E0\u00ACIV#\u00EC\u0084\u0095\u00B0\x19\u00F9\u00DE\u00E5t:a\"\u00DA\u00E4\u00CF\u00C4\u00CC\u00E5d\u00EB\"\u00C7\u00EB\u00F5\u00B2\u00BF\u009F]1mo\u00BD\u00F5\x16_\u00E7\u00B2H\u00D4M\u00DA\u00EC\u00D9\u00B3\u00E7!}\x16\u00F0)x>\x05i\u00F0<\x0B\u00D7%kh\x07\u00F0\u00CC\u0086`0\u00B8\x11\u00F5\u00BF\x1B\u00D7\u009Ap/?\u00CB\u00A4\u00CFB%\x1D\u00A4o\u00C2\u00E2\u00A8\x07Z\u00D1W\x06\u00F3}2\u0090\u0097ey2>\u0099\x03\u00B2\u00D5\u00C5E1~\u00B9\n\u00C3\u008A\u00B5wCQE[L\u00BE\u00F1f\x1D\u00EDz\u00BE;\x16\u00BC1\u00CF\u00E5M\u00D3\u00CC\x124J\u0091I\u00C2\u0089\u008A\x05\u00DD\x10\u008C(\u00EAs\bY\x15\u0088\u00F9\x1A\u00CA\u00C2\u00E1\u00E1sA\u0094\u00AE\x19\u00FE\u00C5\u0099\u00E6E\x0E%>\t\u008B\u0081\u00D7L\u0097\u00C4,3\u00D5%E\u00EAx\u00B71#C\u00B7\x16\u00E9\u00A4\u009D\u0083\u0096\x1Ao)Ud*Q\u0080\u00A1]\x04\u00E3\u00B9\x18\x1Dit\u0096f\u00E5\u00E1\u0087\u00CAq\u00BB;\u0097\u00E5E\x03\u00D4FVS\x13\x19\u00B7\u00E7;\u00C7f\x19j\u0089N\u00D6\u00A5J\u0089\u00E9\u009A\u0094%\u00BA$\u00A3O\u00A9\u009A:e\u00D5\u00BC\u00DC\u0099j\u00DD3\u00C2\u009A\u0096&\x12W*!/\"KM6-*\u0088\b\u00E9\u00C9\u00D1\u00A8x\u0084n]\u00E8\u0091\u00F2|!-\u009CW\u00C5\x16\u00D2\u0085\x14\x1EHW\u008CL\u00D1dj\u0086\"5#5\u009Esn\u00BAX\u0090\u00A3\u008BOh\u00D0\u008B\u0090\u00CF\t\u00C8\u00E7H\u0093d\u00A1Ej$\u00AA`\u0094[\u00D0\u00A8L\u0087J\x19\u00A9Q \u00AB\u00D3\u00D5\u00B1\u00BA\u0083}\u00C3D\u00F7\u0086\u00C9\u00FD\x0F\u00B9\u00AE)\u0085\u0086\u00B8\u00DA-\u00D5ePQg\u0080\x1BJQo\u0085J\u0088\x1Ce\u0089lPE.T\u00D4\x02\u009C+Fe\u008E\u00F1\u00E842\u00CFa\u00F9!HBq\u00D3\u00D17\u00D1/3J\x1Cj\u00BEK\u00DA+\u00F5\u00A6&\u0084\u00CCB>\x07\u00ADU\u00F6]8a&d\x1B\u0092F\x1BR\u0096:\u00A4\x18\u0083\u009EeuFD\u00F9\u00C3M\u00B1\u00A6\u00A5\u0085\u00E4\u00BB=O\u009F2\u00C7G\u0097\u00E5\x1A\u00EA\x13\u0086\x14\u00F3\u0091\u0087\u00B3P\u00C7cP\u0096\x11\u0088\"\x07c:\x0F\u00F1\x14\u00A0A\u0091\x071\x16m3\x1A\u0082/\u00B7D\u00D7\u00B4\u00FC\x14G\u00B0\u00AF=\x16<\u00DC\u00AF\u00E9k\u00FFX\u00A4\u0095\u00E6;\u00E45\u00E0\u00BFK-KMB\u00BD\u00E5\u0087\u0095\u00E5\u00CEt\u00C8\u00C2\x11.9\u00DF)\u00B4\u00F9P\x03&\u00A2\u008F\x14\u009D:\u00C2W\x16I_*\u00B9\x16}\x1A\u0084|\u009B\u00BD\x1C3\u00BE}\r\x05\u009F\u00FC)E\u00FE\u00FA?\x14\u00DF\u00BB\u0085\u00CC\u0086\u00C3\u00A4z:\u00ECu\u00F3\u00EF\t\u00FC\u00E2\x16\u00CE\u00F3\u00F6\x0B\u008A?\u0088~p7\u00C5wo\u00B4?\u0090\u00AEe\u00E6\u00C0J(!c\u00CCdrL\u0099\r\u00A2?\u0097dn\x11)X\x0B\u0091\u00D5\u00AFP\u00E8\u00F9\u00DF\u0090\u00E2\u008D\u00DBP[\u00A7\u0081\u00F0%\u00BFd5k\u00D6\u00AC\x19\x18\u00D4\u00EC\u00B3\u00E6\x01\u00DF\u00C3D\x0B\u0082~\x0B\u0084\u00CC\u00C4;\u00A8\x19\u009EJh\x0F=\u00F4P\u00E6\u0085\x17^x.\u00B4p^\x02\u00CA\u009A+\u0093 \u0093\u00E2Vh\u00E8\u00AF566\u00BE\x01k`\u00CD\u00EE\u00DD\u00BB\u00B7\u00D6\u00D5\u00D5\u00ED\x01\u00F1\u00ECG\u00BEj@b!\u0090\x0F\x131\x13&k\u00E2L\u00E2LFM \u00BF\x1D \u009FJ\u00E4=v\u00CD5\u00D7\x14\u0082H\u00B9L,\u00C4\u00B8\u00B3r9Z\x10\u00C7;\u0088{YMM\u00CDJ\u00C4\u00B9\t\x7Fw\u00BE\u00F1\u00C6\x1B\u00BC\u00BA\u00A8\x1Du\u00D0X[[{\x10\x1A\x7FkVVV\x0E\u00E2\u00CF\u00C5y\u008E\u00FB@uu\u00F52\x10\u00F2\x1B\u00EC\u008A\u00D9\u00B7o\u00DF\x01h\u00E4\u00E1\u00AB\u00AF\u00BEzbii\u00E9 \u00D9\u00B3\u00F6\u00CB\u0082\u00A2\f\u00F1\u00FE\x15\u00F1.\u00C73\u00EF\u00E0\u0099-\x1D\x1D\x1D\u009C\u00FF}x\u00B6&%%\u0085\x07&\u00932\u00E7=\x1Di\u00F8P\u00A6 \u0088\u00B9\t\u00D6I\u00EF\u0080&\u00EE\u00F8\u00FA\u00D7\u00BF^\x04\u00CB\u00E7R\u00901\u00BF\u00F1\u00CBK[\x07'\u00D1W\u00B5\u00B6\u00B6.C\u00DCo\"\u00EE\r\u00F8\u00BB\x03\u00F9-\u0087\u0096~\x10\u00F9o\u0087\x15\u00C3B\u008B\u00E3\u00B6\u00E3Gz:\u0084J\x0B\x04N+\u00EA\u0085\u00C9Q,Y\u00B2\u0084\t\u00FF\\\fv\u00D6\u00E6y\u00EF\x0E\x16$\x1C\x7F\u009Di\u009Ao\u0081\u00C4\u00FFR^^\u00FE\x16\u0084\u00F5\x16\u00A4\u00B1\u00A7\u00A7\u00A7\u00E7 \u00EEm\u0085`\u00E6|s9mw\x1B\u00AC\u008E\u00C3\x10h\u0087\u0096/_\u00CE\u00C2\u00E4d\u00E1x`\u00841f\u0092_.\u00C6\u00E0\u009F\x19\u00B7l!B\x1E\u00A1\x02aE\u00EB*\u00FA\u00C4\u009B\x7Fl\u00EC\u00AB\u00AB_@\u00B1I\u00CD\x0E9)\u0095\u00A0 \u00CB\x124B\n\x02\u00BA\u00B8\x10\u00D0P\u00C1\u00B7\u00AA\u00A6;\x14\u00AFz\u00A3/\u00C1\x02\u00FC\u0088\"\x01\u0088@0\u00EE\u00FA\u0087|\u00C7,C\u0093\u00E7\u0085,\u00CA\u008D&\u00C8\u009DP\u00D2\u00EB\u0096T\u00E0\x051H\x01\u00A2\x15\u00CA0I%@\x1E\u00907JK\u0090t\u00C5Ix@\u00FE) \u00F1,\u009F\u00B0\\\u00A9\u009A\u00D9\u0096\u00D2\u00E6jY\u00DB\u00BF\"H\u00BB5\u00DFQ\u0094\u00A2\u00ABs,KL\u008E\u0090\u00C8\u00C0\u0083FB\u00A9\u00F6n\u00A5\u00ED\u00DE\u00D8\u00A7\u00AA\u00DE\u00EA\u00EE\u008E\u00DFY\u00A8\u008FqY\u00FA\u00DC\x18Y%\x11%Rc\u00B0^0l\u00D3\u00F1\x1CH\u008D\u008AA\u00D8\u009E\u00B8\u00E2\u00A5\u00A7\x02I\u0093\u009E\u0080M\u009F\u00B0\u0084\x1B\u008D\u009E\u00E6\x10*\x07\u009A\x7F^\u00AE\u00AEMJ\x174W\x134\x16\u00E7\u009D\t\u00DC\x0FbT\u00B8\u00D7\u00C1\u00F7\u00E3y\u00AF%D:\u00CA\u0093\u00E14D\\\x17Z\u00C3\u00DB\u00CD\u00D1\u00CE^(\x14>_\u00AE\u00B1$=6*\x15\u00DA<\x1E)ea\u009A\u0080\u00BA\u0088\u00F6k7Mj\x01Mt@\u00C0D!\x04%\u00E2\u00F2\"\u00AE\x14\u00A1(\u00D3\t\u00E5\x03\x05\x07g\u008A\u00D6x\u00D4R%~1\x16\u00D5\\\x1A7)\re0\u0090W\u00EE\x1F\u00FD\f$\u00C8\u00C4\u008F\x18\u00AE\u00C7H*\x13\u00F9F\u00BF\u0092\u0087k\x12\u00B4}c\u009F\u00A3\u00E7\u00C1\"k\u00F2T\u00AFq\u0095O\u00A3%\t\u008B\u00CE\u008A+\u00C1oM\x1B\u009A\x10P\u00A6T'\u00B8\u00AA\x0B\u0084\x15\u00E4\n\u00C0y7\u00AE\u00A7\u0082\u00DE\u00B2p\u00C3\b\u008FF\x19\u0090\x04Q\u008F\u00EE\u00EEX\u00D6\x0Ba\u008B\u00D4n.\u00D0Ge\b9\x1Fe\u0099\x1C\u00B2\u0084?B\u00CAP\u00A6\u00F2\u00FA49\u00DA!h\u00A2eR\u00B6%\u00C9\u0081\u00B2\u00C8SG\u00F8\u0088\u0095\u00B7P\u00F6^{;\u00E9c'Rb\u00F7&{\x0F\u009D\u00D8\u00B6U\u00F6\u00F6\n|]\u00F0\u00CBY,\u00FF\u00D8\u00CF><\u00E0\u00BC\u00ED\u00D7g\x7F~8@&\u00C8>Q\u00BD\u009F\u00CC\u00E6:{\u009F\x1E\u008E\u009B\u00F7\u00EC\u00E1\x0F\u00B2D\u00D7\u00BCF\u00C1\u00E7a-\u00BC\u00FE\fY\rUx\u00E4\u00F8d\u00CF\u00F8\u00B0\u0084\x7F\u00F3\u00CD7g\u0080\u00B4\u00CE\x02Q0\u00E9\u00F2@n\u00C5\u00A0\u00DF\u00B0y\u00F3\u00E6\u00AD/\u00BD\u00F4\x12\u009BgC\x07\u00D3)\x01\u00BBrn\u00BB\u00ED\u00B6q\u00C0\u00958\u00E4Ib\u00F6\x173\u00D9\u00AF9t\u00E8\u00D0K/\u00BF\u00FC\u00F2\u00CA\u00A7\u009F~z\u00CF3\u00CF<\u00D3\u00F0\u00FD\u00EF\x7F\u00BF}\u00FB\u00F6\u00ED\u00ED\u009B6mj\u0082\x06_\u008B|6\u0083\u00C4\u00E2 B~\u0086\u00B5M&s\u00D6\u009C\u008FG\u00F8\u00DCY\u00D9O\u00BE\x03\x04\u00F9\u00E2SO=\u00F5\u00D6#\u008F<\u00B2\x7F\u00FD\u00FA\u00F5\rk\u00D6\u00ACionn\x0E=\u00F8\u00E0\u0083<\u00A8;\u0090n\u00EB\u00D8\u00B1c\x05\u00F26\x19d\u00CC\u00BEx\u00AE\u00F8\n\u0090\u00FC\u00F2G\x1F}t\u00D3o\x7F\u00FB\u00DB:\u00C4\u00DF\x07-9\u00F7\u00BC\u00F3\u00CE\u00BB\x14\x03\u0089-#v\u00B3p\u00E7\u00DC\nr\x7F\x19\u00DA\u00F4\u00EB\u0088g\x17\x04I-\u00D2j{\u00FE\u00F9\u00E7[\u00F7\u00EF\u00DF\u00DF\u0080tj\u00FD~\x7F[vv6\u00BA\u0082d-\u009C\x03k\u00D7\x02\u00A4\u00CF\u00C2\u00B5i\u00E5\u00CA\u0095\u00B1{\u00EE\u00B9'\u00E5\u00FA\u00EB\u00AF\u009F\u009D\u0091\u0091\u00C1\u00F5\u00C3\u00DBXp\x19k\x12\u0089\u00C4\x1B \u00E1\u0097_x\u00E1\u0085\u00B5\u0088\u00FF\u00E0\u00AAU\u00AB\u009AQG\u00ED\x07\x0F\x1ElA\u00B9\u00EAp\u00BD\x1E\u00F1\u00F7\"01\u00B3\u00F0\u00B6]Siii\u00BDn\u00B7\u00BBn\u00CB\u0096-\u00BC\x1CV\r#|\x16\u009E\\\x7F\r\u00A8\u00BF\u00D7Q\u00B6\x17\u00FF\u00FC\u00E7?ox\u00EC\u00B1\u00C7j~\u00F2\u0093\u009Ft \u00EF]\u00DB\u00B6mk\u00C3\u00BDm\x13'N4\x06\u00E6@\u0098\u00F4\u00A1\u00E0\u00CAZ\x10\u00FEA\u0094\u0091\u00E7VX0\u009E\bb&\u00A5{o)Vs2\rZ\x04\u00ADu\f\x06\u00BC\u00BD\x02\u00C7\u00A5\u0089\u0096\u00CE\u0084|\u00F3\u00F5h|\u00FD\u00E3\u00ED\u0089.vQ\u00C4M\u00A7\u00BA$\u00DB\u00CA\u00F1\u00E9\u00A2\x14\u00B1g#\x01\u0083I\u00DF\u00A9\u0094\u00D4\u0085l\u008D\x18\u00AAr}K\u00A2\x1D\u0089s\u00FE\x07!\u00DC\u0094\u00E2\u00BA\u00A5H\u00CCp\tkV\u00CC\x12i`K\x1E\x1E.$\u0094\x02\u00ADT\u0080g\x1A\u00E2\u00A6\u00D8\x1D1iO\\\u0088\u00C3\u00FC\u00C1S\u0090\u0091\x0B\u00A4\u00E3\x02\u00C1:@\u00A6.\u00A7&=\u00D0b\u00BB-\u009D\x0E\u00FFOk\u009C\u00C7\u0081\u00FCb\u00BE\u00A3 S\u00D2\f<_\u0092P\u00C2\u0083!\t\u00F9\u00A0\x1A\u00C3\t\u00B9coHU\u00BE\u00D5\x1D\u008F~&\u00DB\u0091\u0097\u00E1\u00A0)\u0088\u00AB\x18\u00F7\u00B0 \u00D5a\u00B9\u00F8\u009C $\u00A4\u00DC\x0E!P\x16\u008C\u00D3NS\u008AZC\u0088\x182\u00E6\u0082\x15\u00E0\u00B2\u00CB\x06\u00E1\u00AF\x0B\u00CAuKQ\u00A8k\u00E4\x03U4\x07M\u00B1#\u00AC\u00C4n\u00D4U\u00B3C\bD\u00AB<\\g,l\b\u00F1\u0083\u00A8-]ZM)\u00BA\u00A3~Ew<X\x15\f\u00D2\u00D2\f\u00A7\u00B3\u00C0-\u00FD(v$`RYwB\u00BE\u00DD\x16\x13\u00ABZ\u00E3jm\u008BE\u009B\u0083\u0096\u00D8'I\u00F5!}/\u00E2K\u00E1w $\u0084\bS\u008C_\u008A\u0096\u00A6D\u00AC%\u00CB\u00AD\u009B8\x17\x0B$D\x04\u00B4\x06NG~@\u00FA\u00E0\x18$O\x1D\x10\x04\u00A8;m;\u00EA\u00AB\\S\u00B4\x1F\u00F5\u00B8k{\u008FU9\u00C3ge\u009C\u00E7s\\\u00E6\u0083u\u0081\u00BA\x1F\x07\x0B\u00CE\u0087\u00B4\u00E2\u00B0\u009C\x0E\u0087L\u00B1\u00AE\u00C3\u0094o\u00B4\u009A\u00F4v\u00B7%\u00B6#\u00B9V\x17\x04/\b\u00C6\u00CF\u00C2\x07u\u00E0\u0083\u00A5\u0097\u00EE\u00D3,G\u008A\u008B:\u00B3=\u008E\u0096\u00D5]\u00B1\u00F8\u00AD\x05zA\u0096&\u00E7\"\u00AD\x12\u0090\u00BA\x01a\u00A9C\x18\u00FA\u00F0`\x06\u00EA\u00CF!t\u00D1\u00A3)\u00AB\tR\u00B4\u00F1\u0094\x11\u00BE2\x13\u00F6j\x1C\u00EF\u00F5_%\x05R\u008E\u0080\u008C\u00A3o\u00BD@\u00C4oy3\u00D1\u009F\u0080\u0090\u008F\u0080\u00EF\u0083\x00\x00\u0099\u00E0\u00D9\u00A0\u00BDG\u008E\x15\x0E\u00D9~{\u00E9tQt\u00D3[\x14\u00FC\u00DDC\x14/\u00DB\bY\u00C8\u009E\u0084\u0081gN\u0080\x0FI\u00F8\u00DA-\u00B7\u00DC\u0092ZTT4\x15\u00A4\u00C3\u0093\u009B\u00F6\u00EA\x1Ch\u00A3\u009B\u00F7\u00EE\u00DD\u00BB\x07\u00C4\u00FBA\u0096v\u009E,\u00E4W\u00BF\u00FA\u00D5t\u0090\u00FE\x1C\x10\x13\u009B\u008C\u00ECr\u00E1\u00BCn\u0087V\u00FC\u00E2\u00EF~\u00F7\u00BBw\u00BE\u00F1\u008Do\u00D4\u0083\u00D8\u0082\x03k\u00DE-\u00D6z\u00AB\u00AA\u00AA\u00E2o\u00BE\u00F9f\b\u00A4\u00D6Y\\\\\u00DC\u0097\u0097\u0097\u00E7\x07\u00E1\u00C0<\u00B45D&\u009B\u00E3\x11>W`#\u00CA\u00F5\u00E6\u00BAu\u00EB\u00DE\u00BA\u00FD\u00F6\u00DBk\x11w\x18Zl\x02\u00C1D\u00E02Z\x10r&\x04\u008E\u00FA\u00C2\x17\u00BE\u0090\x05\u00D2g\x01\u00C8\u00F3\t\u00FC\u00ECah\u00D1\x1B\u0096-[V\r2\u008F\u0080\u00EC=W\\q\u00C5Y\u0099\u0099\u0099\u00ECja\u00D2\u00E4{\u00CA\u0091\u00CFW^|\u00F1\u00C57o\u00BC\u00F1\u00C6C W{\u00D38\u00CE{gg'\u00A7\x11\u00C3\u00B3A\u0098\u00B2\u009D\u0088;\x00\u00CB\u0086\u00EB\u009A'_Y\u00C8\x1A\u00AC\u009D\u00C3\u00FA8\u00BCb\u00C5\u008A\x00\u009E\u00CFC\u00FD\\\u0086\u00F2\u00F1\u00DEE,\u00D8\u00DA \u0084W2\u00D9\u0083\u00E8\u00B7\u00FF\u00FB\u00BF\u00FF{\x1B\u00E2\u008BVVV\u009A\x1C?~'`qDP\u00A6\x1E\x10r\u00C7\u00C8\u0091#\u00E3\x10 yx\u008E-\x14/\u00E2\u00B1\u00A0\u00E1W\u00C3\u00C2\u00A8\u00E7y\u0095a\u0084\u00CF\u00AE+v\x13m@\x1D\u00BF\u00F8\u008B_\u00FCb\u00EB\u00C3\x0F?\u00DC\x01-\u009F\u00DD4\\\u00AFVKKK\x02!\u0082g\x04\u00FAJ\u00C9\u0080 44MkF\x1C\x07`1\u00B5p\x1Ep\u00EED\u00D0\u00AE\x1F\u00ED\u00CA\u00B9,\u00CDZ\u00E4$9\x1F\td1\u0081C\u00A3\u008E\u009AJ\u00ED\u00AF\u008F$V\u00BET\x13\u00D9\u00B7'f\u00CF\x1B\u0088\u00EAXL|\"Uy\u00F2\x1Cz\u0089Nj\x14k\u00B7\u00A8h\u00F6\"\x0BH\u00C0\u0088\u0086[,\u00E9\u00AA]\u00DB\u00D7\u00EF\u00CE\x18\u0080H!\u00A7\u00FB\u00B6B\u009A\u00E9\u0092j\x16\u0088(\r,\u00C9\u009B\u00D8\u00F2:\u00FE0\u00B4\u00CA\u00DD \u00BFe\u00FB\x13\u00E2\u00AF-\u00F1\u00C4\u00FA\u00C6@l\u00B7%\u008D&\u00AF\u00AE< \u00A5l\u00A8m.\u00E8W\x1A\b\x0E\u00E5\u0093=\u00A0\u00BDJ_\u00D4\u00D3\u00B4.\x121m\u00C2\u00D7h\x06\u0086c\t\u00EE\u00F3\u00B0\u00A0\x02\x077\u0086\u00ADw\t\u00FF\x1Fs\\\u00B9\u0099\u00BA\u009A\n\x012\u0096\t\f\x1DK\u0082\u00BC\u00E3\u00C8tU\u00B7Io\u00EC\x0B\u0088e\u0087#\u00D6\u009A\u00FAXl\u008FS\u00D3:\u00BC .\u00E8\u0081Y\u009C.\u00EEE\u0091\u0084\u00C3^\bK\u00EA\x00\u00C8\u00F9\u00D5\u00F2>\u00F5\u00DA\u00BE\u0088\u00B5\u00B1\u00DD\x12\u00FB\u00FD\u00B0\u0082\\R\u00A6!\u00DDt\x16LL\u00C0\x1AY\u00CA\u00A5d\u0093&d\u00C5\x13\u00AD\u00B6\u00FF\u00DC\u009A\u00EA\u00F6D\u00FD.\u00B3\u00A3W\u00D1\u0081\u00BD}\u00DA\u0096\u00D7:\u00C5\u00D6?\u00D7Yek\u00BB\u00B5\u0083\u00CB:D\u00D5\u00E6\u00CE@\u008D\u00D7itgi\u00CA\u00EF\u0080V\u008D\u00BC\u00F9\u0090W\u00DD@s\u0083\u00D1[Z\u0085c\u00DF\u00B6\x16y\u00A8IK\u00D4\bS\x06\u00FCR\u00E5\u00A2\u008DrQ\u008D\u0090\u0083v\u009F8\u00DC\u0096\x10+\u00F6F\u00AC\u00E5\u00AD\u00A6\u00DA\u00D8\x16\u00A5\u009D\u00951y\u00A0&*\x12\x17\u00A6\u00D0\u00ACL\u00C3Z\x02a7\u0099\u00C9\x1E\u00EDe\u0082\x1Dk@\u00F6oV\u0084\u00AC\u0097^\u00ED\b\u00AE^\u00DE\u00ED\u00D8\u00B9;l\x1Dp[\u00B2\u00DE\u00AFS\u00CC\u00AD\u0089\fX\x0B\u00E9l\r!n\x14Q\u00BA}\u009A\bj\u0096U\u00F7dk\u00BC\x1B\u0084\u009F\u009F\r\u00C2\u00C7\u00B5\x12\u00B4\r[\x1B\u0092\u00F7<\u00E0z\u00D5\u0094\u00AA\nX\u00D6\u00EA\u0086\u00B8X\x0Eq\u00F868\u00F0\u00D4A\u00F2\u00D6\n\u00BCer\"AV(\x00\u00CD\x1B}\u00FC\u00A3\u00A4\u00C0[6D\x02\u00948\u00B0\u009D\u00E2\x07\u00CB\u00C0\u00AC\u00DC\u0097%\u0099Mu\u00FC\u00BA'\u00EBP\u00E8\u00BE\u00CC%\u00A7\x17\u00A8\u00E0\u0081_6\u00B9\u00C7\u0081\b\x13\u00C9\u00C0\u00F1)\u00C5\u00CC\u00993\u00B5\x0B/\u00BC\x10Jn6oJ\u00C6>o\u00D6\u00BE\u0099\u008C7\u00BC\u00F3\u00CE;\u00DB\u00BF\u00F7\u00BD\u00EF\u00F1\u00CA\u008Bc\t+\u00F3\u00F1\u00C7\x1F\u00EF}\u00EE\u00B9\u00E7*@n\u00BC\u00B5\u00C3A\x04\u00F6\u00B9\u009F(\u009F\\\u0096v\x10\u00D3\x01\x10>\u00FB\u00D7\u008F+\fA\u009A\x03\u00BF\u00DE\x05,\n\x1A1\u0082\u00E5\x0B\u00C9K.\u00B9$\u00B5\u00A0\u00A0\u0080W\u00CB\u00B00a\u0097R;\u00FB\u00D3\u0081\r c\u00F6\u00A73\x01\x1D-O&4\u00E7.\u0090v\x19\u00BB{p\\\u0089\u00C0D\u0099\u00E5r\u00B9&!\u00FE\u0082\u00F3\u00CF?\u00DF;a\u00C2\u0084\\\x104\x0BB\u00D6\u00D2\u0099x\x0F\u0082\u0080\u00D7B\u00E0\u0094\u00FD\u00F8\u00C7?\u00E6A\u00CD\u00E5\x19\x0E\u00B5a\u00C3\u0086\u00C8\x1Dw\u00DCQ\x0F+a3\x04\u00E3\x0E\u009Cc\u00AB\u0089\x07\u00D1\u00A8\u00F4\u00F4\u00F4\u0091\u00BC\u00B55~\x0F\u00ED\u00B1\u009CG\u008E\u00AB\u00A3\u00AB\u00ABk\u00C7\u00DBo\u00BF]\u00FE\u0087?\u00FC\u0081\u00C9\u009F\x07\u00F5P\u00A8\u00DD\u00BBwG\x11o\x13\u00FA\x06\u00CF\u00A5p\u009Ex\u00DE$\x0B\u0082*m\u00D6\u00ACY\u00ECF:\x19\x18\u008B\u009Df\x014\u00D5\x12\u008B\u00CCL\u00B0\x1A\u00B7\u00BD\u0092J%z\u00E2\u00AA\u00BD\"\"\u00A2#2\x1DY\u00FF1\u00CA5\u00F2\u0087\u00E3SG~\u00A3\u00D0\u0099\u00B7;\n\u0081\x1F\u00B3\u00BA\u00A1JG0\x14\u00F0\u0088\u009D\u00B8CJU\f\x15o\\v\u00AA`+\u00EF\u0084\u00A3\u0090W\u0097H!\u00EA\u00BA\u00E2\u00B4jUw\u00F4\u00B5\u00FF\u00E8\u00D4\u00D6\u00FC\u00EB\u00AE\u00C8\u00B6{;\x13\u009B\u009Fn\x0B\u00BC\u00D9\x13\u00A7\u00B5\x18\u008E\u00F5R(.\u009B\u00C0?\u00CC\u00BB\u00B9>\u00A7\u00CA\u00CBO\u008Bq\x1D\u009E\u00D4@\u00B4@\u0088\u00D0x\u008F|\u00E8\x14\u009A\u00A8\x052\u00EB\f*\u00DA\u00B2\u00B3O,\u00FFI\u008Dx\u00E7\u00FF\u00ED\x0F\u00EF\u00F8V[b\u00D3\u00AB]bE\u00AF)6\u00E2\u009E6h\u00F6P\u00DAQ\x10\u008B}\x00\u00AA\u00AD\u00CB\x14\x1B\u00D6\u00F4\u00AA\x15\u00DF/wl\u00F8\u00FA\u00FE\u00F0\u00CE\u00FB{B\x1Bv\u0084\u00B47\u00A3\u008A\u00B6\u00A2\u00B0] }6\u00FC5\b\u0096tC\u00A8<e\u0098l\u00D5q\u00B2\u00D6\u00FA\u00C3\u00DD}?\u00DE\x14\u00AC\u00B8\u00BF\u00D2\u00BD\u00ED\u009B\r\u00F2\u00E0\u00CAN\u00AB\u00AFp\u0084\u00E987-\u009AvM~4{\u008C\u008FR\x1A\u00D1a[\x13\u00A2\x1B\u0082%\u00C2i\"q\t\u00AD1\u00DDK\u00D6\u0088TR\u00C6\u0097j{\u009A\u00EF\u00D8\x15\u00DE\u00DF)U%\u00F4\u0085Nh\u00E90\u0094\u00EC\u008AV(_(\u00AED\u00ED\u008Avk\u00CFM-\u00E1\u009D\u00DF\u00D9\x1D\u00DEuYc\u00A0f\u0082\u00CF\u00F2\u00E48i\u009A\x12\u00B2$n\u00D9\x1A;\u00EA]\u00F5\u00C0\n*\u00AB\f\u0089\u00B7\x7FsXn\u00F9N\x0E\u00D5\u00FEws\u00A0\u00FD\u00E1\u00BAP\u00F3\u00BD\u00AD\u00C6\u009E\u00DD\x01\u00F1vT\u00A9\u008D\u00A8\u00A3V\u00C4kB\u0083\u00D7-\u00D3\u00CA\u0095\u00A65y\u0084!\u008BG{\u00BDn\u0094\u00F9H\u00DD\u00DBu\u00C4\u0081\u0085\u00A8\x10\u00D5\u009D\u008A^\u00DF\u00DACO?z\u0098\u009Eo\u0088E\u00FEr\u00C2\u008Ep\u00B2`\u008D\u00DCdWLS\u008D\u00FD\u00E1sc\u00C2\u00D9$\u00D3s\u00D9\u0099\u0088\\\x1Cml\u009F\fP\u00DDx^\x18.{\u00ABe\u00BB\u00A9\u00D9]\u00C8\u00EA\u00FA\x19 z@\u00A1\u00DD\u00ED\u00BF\x03\u0081\u00A1Csc\u00D3\u009D\u00EB\u00EE\u0094g\u0082\u0097\u00CDC\u00FB\u00CC\x00\u00A1\u00B1\u0096\u00C8.\x07&\u009CFh\u0097e/\u00BC\u00F0\x02/\u00FB\u00E3\x01w<X/\u00BD\u00F4R\x0F\b\u00FF 4b\u009EH\u00E5\u0095\x1AG#\u00C0Ap\u00B9\u0098T\u00FBz{{;\u00CA\u00CA\u00CA\u00D8u\u00F3\u00A1\x1A\f\x02\u0083\u00FFH\u008F\u00C7\u00E3\u0087\x00`\u00B2g\u00ED\u009B\u00D1\nB\u00DE\u00B3j\u00D5\u00AA:\u00FC}\u00DF$\u00E20\u0098\x7F\u00FA\u00D3\u009F\u00BAv\u00ED\u00DA\u00B5\x0FZ;\x0B\u00AC\u00C1\t\u00E2\x02\u0090gfnn\u00AE\u00AF\u00B0\u00B0\u0090%\x0B\u00BBM\u0098T{a\u00B9\u00ECA\u00FD\u0094?\u00F1\u00C4\x13\u00EC:9QY\u00A3\x10\u009C\r\u00D0\u00C8y{\x0B\x16>\\v?\u00E2\u00CE\u0083 ak\u0082Iv(\u00F8z;\u00EA\u00A6\x16`a\u00C2\u00C7G\u0083\u00FD\u00F2\x1A\u00C6\x01O\u00EAr\x1Bq\u00FF\u00E0\t_/\u0084\u00F5\u00F08\u008F\x06{+\u0085\u00B1^\u00ABT's44Z\u00F6[s\u00FF\x12`\x12]\u00972\x7F\u00A6_,\u00FCj\u008E~\u00C3-y\u00F2\u00A6\x1B\u00D3\u00E27\u00DDY\u00A0}\u00FE\u009AT\u00E7\x15\x1E\u008D5;\u00E5\x1C\x1Cf\u00F8+!\x00\u00D2a\u00BA\u008C\u009F\u00A9[#?\u0097\u009B\u00CB\u00F5wLp\" \u00948\u00CC\u0088\u009A\u00BA\u00A8\u00D8\u00F5l\u00C4]\u00B3\u00EApw\u00CF\x06\u00A8U\u00E5m\x14\u00FC\u00EF\b5\u00B7+Ya\u009A\u00D4\u0088\u0082p\u00FBqJ<\n\u00FD\u00BA\u00B0R\u00BD1\u00CB\u00B0m\u00B1\u0093\u00C4`e\u00B0\u0080B\x1C\u00A6e\u0089\u008EPLU\x1C\b&\u00AA\u0097\u00F5\u00F5u\r\u00A6\u00FB\u00DD*\u00AD\u00A1\u00CBRU \u00C46\x164\u00B8WA\u00F7b\u00B7{K_B\x1E\u00D8\u00D7&jWQwo=\u00EE/\u00AB\u00A5\u009E\u00A7Z\u00CD\u00AA\u00EED\u00BC\x02z`7\u00D2\u00B0\u0085r\u0082\u0094\u0093\u00EB\u0092\"\u00EA\u0088\u00D0}\x16\u00F1\u0094!\u00FF\x05YA\u00FF\u00D72\u00A3c~1\u009E\u00E6\u00DD\u009B\u00AE]s\u00D3\b\u00E3\u0096\u009B\u00B2\u00F5\u00AF|s\u0094\u00F7+7f\u00BB\u00FE\u00B1\u00D8)\u00A05\u008Btvy\u00E11\u00DE1\u00C6\u00A94\u00E1\u00D5\u0085\x1DW\x02\x03+\u00EA\x162\u00A6Ii\"_G\u00C6\fd\x18*\u0084\u00E2\u00E9\u0096\x1Eij\u00A2\u00F0*Vp\u00DA\u00C8J\u0097\"C'9\u00CA2)\x03qj,\u00F8\u00F0P{\u00AF)\u00CB\u00AAI\u00ED\x7F2\x10\u00E8\x1AX\u00EA\u00CAqY\u0095\u009D\u009D\u0081\u00B7\u00A3VUs\u0082vXB\u00D4\u00B3\u00C6\u00CE\u00F1\u00E3\u00B7\x13\u00BAuN\u00AAC\x15\\\u0093\x1E\u00F4\u00C7b\u0089\u00F7\u00F28\u00D7\u00AB\u00A2\u009E\b\u0099{*\x03b\u00F5\u00F7\x0FDv\u00FEWg\u00B8\u00F1\u00822\b\u00C2\u0081[>:Pb\u008B?|\u00BEq\u00A5}\u00E8\u009C\u00BB\u0088\u00DCKo'-\x17J*\u00EF\u00E5\u0087\u00DA:y\u00E2\u00C7}L\u00EE\bZV\x1E9\u00CF\u00BB\u0094\u008C\u00893\u00C0\u00BE\x11J\u00D4\u00B1\u00CF\x1Eq\u009D\x19\u00C2\u00A7\bLU\u00FC\u00E1\u008A\u00E6\u00BF\\_>h\u009BYyyy'\u00AD\u00D5|\x10\u00B4\u00B7\u00B7K\u0090\x0F\u00FB\u008D\u00D9\x7F\u00CDi\u00F0\x00k\u00EB\u00EC\u00ECl\u00DD\u00B9s\u00E7\u00B14\u00E3\u00F7\u0080\u00B7Z\u00AE\u00A9\u00A9\u00E9\u00EC\u00E8\u00E8\u00E0\u00D56\u00C7#\u00A9A\u00F0\u00F50\x04Y455u\u00B8\u00F6\u00FAA!\f\x03\x12\u00BA?\u00FF\u00ACUq\u00DDuBp\u00B6 Olm\u009C0~\b\u00AB8\u00EA\u00A1\x13D\u00CE\u009F/c\u008D\u009A\u00EB\u00D9\u0083\u00FC\u00B9srr<>\u009F\u008F5{v\u00F90w\x04\u00A1}Wo\u00DD\u00BA\u00B5\x19\u00CF\u009D\u008C\u009B\u00CE\u00820\u00E9c\u00D7\x16\x04\"\x0BP.\u00BB\x13u\u009E\u0085\u00B8S\u00A7M\u009B\u00A6\u00A1\u00CD\u00ED\x1B\x07`\u00E7\x1F\u00C2\u00A7\x1B\u00A4o\x0F\u00B8c@\u00A1_X\u00B0\x069\x0F\x1C'\u00E7\u0099?\u0084\u00E3\u0084\u0090:\u0099~\u00A2\u0081]2Rt\x1A\u008Fg\nyWL>\u00C9\u008DmZ\u00C2\x01Mp|\u00A6N\u0097\u00A7\u00EA\u00F4Y\u009FF\u00D7\u0083\u00E4\u00AFO\u00D1\u00E8\x1F\u00B2\x1C\u00EAS\x1EK\u009C\x15\u0087\u009A\u0085[\u00EDt\u00F0\u008C\u0088(r9,Q2\u00D2A\u00A5c2\x03G\u00AE\x1D\x03J\u0092\x00\u00EF\u008A\u009E@\\u\u00B5\u00D7\u00F7\x0E\u00EDg\u00AA\u00BD\x1D\u00E5\u00B1$\x04\u00AF\u00E8C$\u00FD}\u00C9\u00D6*ybW\x1AV*\x1E\u00FF\x00\x18*\u0091\u00F1 \u00B3B\x18\x02\u00AA\x0Fd\u00C8\u00E9\x0E\u00F6\x0F\u00D5C=1pW\u00AFT\"\u0080\u00F4P%\u00C8\x01\u00D8T)\x15\f+\u00D5\u00D5\u00E7\t\rUN\u00D4\x0B\u00ED\u00AE\u00A0Iz\u008F4\u0085\u00BD\u00C7\x10\u0083\u00B9\u009Au\u00C6x\u00BFQ\u00CA\u00A7\u00B5\u00EBG\u00A6\u00A6~g\u008Ag\u00D2\u00D7R\u00E4\u0095W\u00E6\u00D0\x17\u00C6:\u00AD\u00DB\u00FCB\u00DD\u00E4\u00D2\u00AC\u00EB\fK\u00FB\u00A4K\u00D0U~\u008D.qIk\u00AA\u00B0D*\x12\u0090\b\u00C2\x14B\u009A\u00A0v\u00A1\u00BF[\u0097\u0083\u00B3\u00F9\u00C3kwP\u00A8\r@\u00DCZH.^\u00AA)\u0084JC=s\u00DB\nHL\x0Bb\u00A4\u00AB/\u00A1j\u00B6D\u00EC\u0095n\u00C3\u00C7\u00A9\u00F5\u00F3\u00EA`o{X\u00D4\u00C3\"h\x16JA\u0099\u00C7I\x0B\u00F9\u00B1\u00C8\u00E3\x12*}\u0094\u00D7\u00EB\u0081\x1CzO\u00EA\x10$,Jz\x02\x11UY\x1EJTC\u0080\u00B2\u00D2dW\u00FB\u00A9#|\u0081\u008A\u00EDh\u00A6\u00C8\u008Ag)\u00BEc\u00AD=\u00C1\u00EA\u00B9\u00EA\u00F3\u00E4\u00BD\u00FD_\u00C91\u00FB\"\u00FB\u00E3(\u00F6\u00D7\u00B1\u0098\u00A8\x07?z>(\x04\u00EC\u0080\u00DF\x03\u00E7\u00EC\u00AFb9\\\u00A4\u008F\x18C\u00EE\u00ABo\"\u00F7\u00A7\u00BE@25\u009D\u00CC\u00AAr\u008A\u00AD\x7F\u0083\x04\u00BB$\u0087U\u00F0i\u0082\x05\u00F2\f\x07\x02\u00BC\u00E6\u00D3&^N\u0095'\x11\u00F3\u00A0\u00B9\u00F1 :u\u00F57\u0080\u00F4\u00F4t\u00B4\u00AB\u00ADA\u00D8\u009D\x02\u0081?\u009C\u00D2\u00CBn$h\u00CE\u0083\u0083\u00E1DP \u00A8\x18\x027\u00F4\u00D0At,\u00F0\u00F58\u00D29\u00D9\u00F8\u008F\u008BX,\u00C6\u00FD\u009D]9\u00FC\u0097;q\x1F\u00CE\u00F1\u00E0\x1C:\u00D6O\x04&\u00D7\u00C1\u00FCs?\u00E7m$\\YYY.\x10?\x0B\u00C4\u00C1\u00FAA1\u00CD\x00\u00C8\u009E\u00E3?\u00A9\u00FCo\u00D8\u00B0!q\u00E8\u00D0\u00A1\x1E&\x0E\x1Cr\u00DC\\\u00DF~\b;wqq\u00B1\u00DD\u00A6l\u00B1\x02|\u008D\u00F3\x1CL$\x12\\\u00FF||\"p\x1E8p\x04\x12\u00F1\u00B0\x00\u00B7#;\x1Ef\u00A2<\u00F33\u00AC\u0091\u00BA\x14cM\u008B\u00D8\u00AF>\u00C8\x19\u009C\u00A6\u00D0\u0084H\x01)\u008F\x001\u008E\u0084\u00D5{$\u00E0R!\u00E9\"\rZ-\u00C6\u00F9\u00BB\u0080\u00EA\u00A8k\u00BA\x1A\u00E1\u00D2\u00C5\u00B8\u00A9\u00E6\x11k\u00E8\u0098`m\u00DB!\u0084\u00E9v\nsL\x7F\u009A\u00EF\u0081\u00B4\x04\u0084\x19\u00BB_\u00FA\u00AF1\u0089r\u00C0\b\x10v\x0B}\x04@\x1BU\u0086nY<\u00E9:pj\x10\nL\u008B\u00EA\u00E0U8\x03m\u008B;P\u00A7\u00A6\u00AED\x02\u00C2qX{k\u0096\u0090\x1A\u00E8\u0090\x15\u00E7\x01\u00BC\u00F7\x0E\u00F9O#SS\u00BE\u0094n\u009E=?U|:KX7j$\u00AE\u00C2\u00DD\u00E7\u0083r\u00C6)!SL\u00B2X\u00C8t#\u0082\x0E\u00A4\u00D4-\u00A5\u008A\u00E1\u00F7\u00F0|}`\u008CI\u00F3\x1A\u00C2P\x1E\u008C0'\u00B2\u00C4\x02\u00C4\x16v\u0092d\u00B8G\u00C8\u00EE_\u00F6\x04\u00B8\u00FF\x1E\rfB\u0097Ae\u00A9>\u00A8\u00EDQ~\u00C6\u0096\u00CEBih\x7F\u0087n*\u00FCo\u00F7\u00B5#\u00C0\x01,!\x11M\u00E8ZOL\u00D3\u00B8\u008F\x1F\u00A9\u0085SGX\u00DCc\u00CC\u0084\u00BD\u00FC2\u00F8\u00E4O(\u00BE{\u0093\u00BDn\u00DE}\u00C9\u00A7\u00C9\u00FF\u00D5\x1F\u0090\u00EF+? \u00D7\u00C2kH\x1B3\u0099dF\x16\x04B\n\t\x0F8\u00D3\t\x19\u00E9r\u00E1\u00B7\x0F:J*\u00C9\u00F4\x1C\u00D2\u00C7\u009FE\u009EO~\u0091|\u00F7\u00FD\u008C<\u009F\u00F9'{=\u00BF\u00D9TO\u00A1\u00E5\u00FFC\u0089\u00AA=\u00B6\u00E6o\x17\u00EB\u00F4CuwwG\u0082\u00C1 \u00BBE80\t1\u00D9\x14\u0082\x18\u008A\u00AE\u00BF\u00FE\u00FAA\u00BF\u00E0G\u00C5\u00918\u00C6\u008C\x19\u0083\u00C6\u0092\\@&\x1A\u00EE\x17\u00BC\u00DA\u0083\u00DDH\u00B2\u00BC\u00BC\u009Co9)\u0084B!\x1E\x18\u00DC\u00BE\x1C\u00F7\u00F1\u00F2\u00C8ip0!\u00C4x\x02\u00F8#wnh\u00BA\x1C\x07\u0097a0.d\u00A5\u009FAO\x16\u00D0\u00A6\u00A1r2\u00BF\x1C\u00C9;\x0B1\u00FEX\f\u00C7;4n;r\u00D4\u00D1\x07\u00E9\u00CB\u00C2\u00EDv\u0083b\u00EC\u00F8\x07aB\x00\u00F0[\u00B5\u00C3\u00CB\u00CFi\u00F1\u00B6\x151X(\u00FC\u00FB\u0083\u00C0\u00AE{\u00C4\u00D9\x7Ftl\u0088\x1C\u009F\u00CF[\u00EA\u00A6\t\u00BA\u00A6\u00C6\u00C2D\u00E0\u009D1\u00F9a\u00A5\t\u008A9Hu\x1A\u009Aj\u00D2\x05\u00D9\x01\u009A\u00E1\u0091\u00C0\u00C7\u00F65Rm\u00BAPC-(\x197\u00AD\x14\u00AF\u00B0JK\u00BDr\u00D4\u00D21\u00E9\u00EF\u009Fx\x19\u008E\x13\u00B4\u00D0\x07j\u00C0S\x04H\u00F5\u00F7\u00F5Ga/\u00CBc\u00F0\u00F4\u00C4\u00C9a\u0080\x14\x1DKS\u00E3c&y\u00C4%`\u009C\u00CBbB\u009C\x1D\u00B6\u0097Dr\u00D9T]\u008C\u00ACw:\u0095\u00FC\u009F\u00BA\u0098\u00F6hyH<\u00DC\x10S\x7F\u00C1\u00B5\x06\x03B\u00E7#\u0097\u009Di\x17\r\u008B\u00AE\n9\u00F9n\u0099\u00F8\u00872\u00F1\u00A7\u00ED\u00FD\u00E5\x1C\x00\u00CF\x1F@\u00DAr\x16\u00FB\x1B\u0097\x03\u00DF\u009C\x10Ri\x14\u00E7>\u00F2\u009EgY\u00F7f:F\u00DF\u00B0\u008Ca\u00D7N\x1D\u00E13\u009C\x1E{\u008F\x1C\u00B3\u00A5\u0091\x125\x07\u00C8\u008A\u00C6\u0088\u00B7E\u00D6G\u008F'\u00F7\u00A2k\u00C9\u00F7\u00A5\x7F\u00A3\u00B4\x07\x1E\u00A3\u00D4\x7F\x7F\u009C\u00FCw\u00FF?\u00F2~\u00F1[\u00E4\u0081\x06\u00EF\u00BD\u00F6\x0E\u00FC\u00FE\x0E\u00F9\u00BF\u00F6cJ\u00FD\u00FE\u0093\u0094\u00F2\u00ADG\u00C9\u00FB\u00F9\x7F&\u00D7\u009C\u008B \x1Crl\u0082OT\u00EE\u00A6\u00F8\u00BA\u00E5\u00F6Flg\u00B2\u00EBm\u00DE\u00BC\u0099\u00DF\u0086\u00E5\u0089L^\u008B\u00CE\x1A'k\u0096\u00A3'L\u00980\u00E3\u00AA\u00AB\u00AE*())\u00E1\u00E3\x0F\x0B\u00DE'\u00C7q\u00EF\u00BD\u00F7z\u00F8/\u008EeSS\x13\u00AB\u00AC\u00EC\x16\u00E0.b\u00BB\x1B\x10\u00D2@\u00F8\u00DE\u00A5K\u0097\x0E%\u00A8\u00E3A\u0082\u00BC\u00DD\u00D0\u0088\u00EDe\u0087|l\u009F=68\u009Dp$\x12\u0089C\u0090\u00F5\u009F\u00F9\u00F0P\u00D0\u00E6Y0\x0Etq[\u00B3LE~|~\u00BF\u00FF\u0088\x1F\u00F5\x04\x10999\u00ECf\x19\u00CC?\u00C3\u009E,omm\u00E5\u0095Hlq\r\u0092\u009B\x01\x01\u0093>q\u00E2D\u009Ep=\u0099\u00FA\x11h7\u00E7\u00F8\u00F1\u00E3sP?\u00EC\u00B3\u00E7\u00BA\u00E1\u00FC\u00F6\u00C0\u0092\x0B\x1E8p\u0080\u00E3\x1C\u008A\x04\x04\x03\u00CFo\x04q}\u00F8\u00B5S\x05}I\x06e{4\x1A\x07M:\x0FY\u00B4\u00B5q\fZS#\u00D5\x12!\u00B5\u00BA-*\u009F\u00EEQ\u00E2\u0089\u00E0\u00B0\u00C0\u00E7\u00BAb\u00E2\u00C9>\u0093\u0096A\u00ED;\b[\"\u00C2\x05\u00C2(\x17Qt\x03M\u008A\u00D1i\u00865\u00F6\u0082h\u00E4\u00B4X\u00A4\x7F/0\u00A1\u00FF,\u00CDt\u00A7\u008C\u00F5\u0088I\x1E\u0095\u0098\x13\u00B7\u00D4\x18\u00B0\u0093\x17L\x12O(:\u00D8\u009E\u00A0\u0097w\u0086\u00E8\u0089\u00D5\u00AD\u00D6S\u00FF\u00DD\u0090x\u00E6\u00FE\u009A\u00C0K\x1Dqk#,\u0080\u00F6\u00A1\u00FE\u00F9\u0093\x02j\x19\u00F1\u008A\u00B8\u0087\u00B9\u00BD\x1F\u0087\u00E2\u00C1x\u0082D\x18\u00FC\u00CB\u00EE&\u00FB\x02:\x13\u00AF#\u00F5\u00A4\b\u00CA\u00BCc\u00AC\u00EFX\u00CA\u00A3\u00A1\u00C5M?\u00D4\u00F84p\u00BE\u00EDF\u0086y\x00\u00CBG\u00D8\x1C\x11$g4a;\x1FN\x0E\u00A7\u00A6\x03 \u00D7\"-\u009B\\\u008B?C\u00BE\x7F\u00F99\u00A5\u00FE\u00CB\u008F\u00C85\u00EF2\u0082-k\u00EFo\x13\u00DB\u00BE\u0096\u00AC\u0096:\u00D2\u00B2\x0BH/\u009Dj\x7F\u00EF\u00D6\x05\x01\u00E0\u00BE\u00E2s\u00E4\u00F9\u00DC\u00DD\u00E4\u00F9\u00EC\u0097\u00C9}\u00E5\u008D\u00E4\u00BA\u00F8S\u00E48\u00FB|\u00D2K&Cp8 4\x0E\u00DA\x1FS\u00E1Za7\x10/\u00F7<Z\u008D\u009CN\u00ACZ\u00B5\u008Aw\u0099l\u00C2\u0080\u00DF\u0083C&~n|~\u008B\u00F5\u009Cs\u00CF=w\u00E6\u00DDw\u00DF\u00CD\u00CB\u00FB>\f\u00E9\u00DB\u009FI\u00FC\u00C3\x1F\u00FE0\u00E6\u00FE\u00FB\u00EF\u009F\u00FE\u00E8\u00A3\u008F\u0096\u00F0V\x01\x1B7n\x14\x100,X8-&5\x1E\u00FC9#F\u008C(\u00CA\u00CC\u00CC<\u00A9A\u008B|\x19\x10H\u00D9iii\u00BCM\x02O\u009C\x1E\u008Fh\u00B9<L\u00F8Q\x10)//\u00FC`\u009D\u00FB\u00FDP\u00C8?\u00E7\u009B\u00F3\u00CF\u00AA-\u0093p6\u00C8\u00BE\u0090\u00BF\u00EE5p|\\\x14\x16\x16\x1AYYY\u00D9\u00A8\u00E3\u00C1=\u0083\u0098h{\u00A0\x1D\x05\x1A\x1A\x1A\u0082 }\u008E\u009B-.\u00CE\u00B7?##\u00A3t\u00C6\u008C\x19\x05W\\q\x05\x0B\u00C7\x13A\u00CE\u00993'\u00AD\u00B4\u00B4\u0094W\x11\u00F1*(\u00AE\u009B0\u0084T\u00EB\u00A1C\u0087\u00BA!p\x13\x10 |\u00DF \u00CCh4\x1A\u00EE\u00E9\u00E9\u0089._\u00BE\u00FCt\x10\u00BE\u0098\u0094M\u00CEyYb\f\u00C8},\u00CC\u008C\x14tw\u009E\x10U\u00D0\u00EC\u00A3&\u0089\u008A\u00FA\u00B0\u00F6\u00DA_z\u00B4\u00A7\u0097\u0087\u00C4\x1FW\x0F\x0B\u00EB\x10\u009E\u00EB\u00A4?m\t&\u009E\u008B\u0093\u00DA\x0E\u00AD\u008E\u00FD\u00ECv\x1BB\x0FF][\u00BC\u00FD\u00C2\u00B8R\u00AF\u00C8_\u00F0\u00E1\u00FA\u00E9\u00FF\t\u0084e\\[\u0098\u00A6\u00A5\u00BB\u0084\x18cj\u00B2\u00C0T\u0082\u00FDs0\u00EA\u00A8\u009B\u00D7\u00FDo\x0F\u00C8\u0095\u00F7W\u00EA\u00EBo<\x14<\u00F0\u00BD\u00C6p\u00E3\x1B\u009D\u00D4\u00EB -.\u00C4\x10\u00F7\u00D0\u00B10\u00F4\x0E\u00FEm\t\u00C3\x12\u00CA\u00E51,\u00EE[6e\u00BD\x12\u00A5X\u008F\u00A9\u00BA\u0091^\u008F\u00D0\x14\u00935\x14{\u0092\u009A\u00A2\u00CC\f\u009DJ\x16\u00B9\x15\u00F3\u00C8p\u00B7\u009B\u00F6\u00DDq\u00EE\u00F4Qn9\x1Af\u00FE\b^\u009A\u00CA\u0091A\x11H\u0080\u00FC{\u00A0Q\u00B5\u00EE\u0082\x1A\u00E27\u00F8\x03h'\u0087\u008FN\u00F8\u00EC^\u00F1\u00F8\u00EC\u0089U\u00EF?\u00FE\u00B3\u00ED\u00C21f\u00CE'\u0091\u0099K\u0089\u00FAj\n\u00BD\u00FC8\u00F5\u00FD\u00F8\u009F\u00A9\u00F7\u00A7\u00F7Qd\u00ED\u00AB\u00F6\u00FD*\x16!~\u00A1\u00CA<\u00B4\u008F\u00CC\u00C6:J4TS\u00A2\u00B6\u008A\u00AC^\x1E\u00C3\u00A8\u00AF\u00EEv\n=\u00F7\x18\x05~\u00FB\x10Y\u00FC\u008DZ\u00A9\u0091VPL\u00DAX\b\x02^\u00AA\u00C9\x02\u00E0\u00CC\u00C1z\u00E6\u0099g:\u009B\u009B\u009B\x07\u00B7\x1A\u00E0\u0095 \u00ACuN\x1E9r\u00E4\u00E2\u00CB/\u00BF\u00FC\u009C\u009F\u00FD\u00ECg\u00DCXL6'+\u008Fx\u00B7\u00CC\u00D4\u00FB\u00EE\u00BBo\u00F2\u00CC\u00993\u00AFNOO\u00BF\u00E9\u0082\x0B.\u00F8\u00CC\x1Dw\u00DC1}\u00F1\u00E2\u00C5\u00DE\u00AD[\u00B7v\u00F6\u00F5\u00F5\u00F1\n\x15\u009E\u00C8\u00E16*\x1A5j\u00D4\u009CO\x7F\u00FA\u00D3c\u00E6\u00CD\u009Bw\"7\u0092\u00B1p\u00E1\u00C2,X\x1E\x13\u00A5\u0094\u00BC\u00DD\x00k\u00C9'jg\u00EE0&O:\u00F6\x1F~8\f,\u00CB\u00B4jkk{\u00BB\u00BB\u00BByI%\x133\u00C7\u0099[PP0\x03\u00F9*Y\u00B2d\u00C9\u0089\u00F2\u00CF[J\u00E4N\u009F>}*\u00F2\u00CF\x02\u008B\u00EF\u00E7\u0097\u00B6\u00AAQ'\u00AD\u00BC}ruu5O\u00B6\u00F2\u0092 \x16,>\u00DC7\x05\u0096\u00C9\u00B4\u00B9s\u00E7\u00F2\u00E7#\u0087\x0F\u009A\u00A1\u0090\x10:\u009E\u00F3\u00CF?\u00BF\u00D8\u00E7\u00F3\u00F1&nL\u00F8\u009C\u0097vh\u00EF\u00F5555G[rI\u00B0\u00AExz\u00E3tu:1Ay\u00FC\u00B9.k\u00BCA\u00A28\u008EA=\u0098\x01CQ\x18\u00C3\u00E5@u@\u00EE\u00BA\u00E7`w\u00C5m\u00BB\u00FA\u00AA\x7F8,|\x16\u00E1\u00DE\u00CA@\u00E5\u00E3\u00CDr\x0FX\u00A4\\\u0093V\x1B\x13\u00C2@\x142\u00AE\u0084\u00CF\u00A5Qia\u00AA\x1C3\u00BD0e\u00D0Z\u00FA\u00D8\u00C1$\u00B7\u00C8\u00D65\u0097S7\u00FD&\u00BF@&\u00C0\u009B\u00BC.\u00C4~\u00CB\u0087:k\u00E2\u00AAsCo/\u00F7'v\u00A5\x1A\u00FF1&%'\u00D5A\u0085BI?Z\u00FE\u0098\u00FD\u00D5\u00B2\u00C8\u00D24\u00D47O\u0094\u00F21\u00845~\u00F8\x1D\x1A\u008D\u00C8\"\u0099E\u00D9\u00E4\u0081\u00CD\u00EClC\x1C}\u0096\u00EA\u00B0\u00A4\u00A8\u00D5L{\u00D9\u00A8i\u00DF+T\u00B6W\u00B7\u00CE\x1A\u00ED\u00A0\u00A9w\x15\u00B8\u00B9\u00FF2\u008F\u00B0R\u00A4\u009F\x0Beg\u00A6.'d8\u00D5,)U\x01\x1A\x15\u00F2\x1C\u008A\u0080R\x01$W\u00D7\x13\u00B7j\u009FlJ\t\u00C0\\8\u00E9\u00BE\u00F9\u00D1\t\x1F%\u00D6s\n\u00A0\u00B1\x7F\u00CA\u00DE\x02AA\x13\u008F\u00EF\u00DFE\u00E1\u0097\u009F\u00A0\u00DE\x1F\u00FD3\u0085\u009E\u00FD\u00B5\u00BDU\x02\u00EF\u009F\x13]\u00F7\x06)\u00FE2U$B\u00B1\roP\u00CF\u008F\u00EF\u00A5\u00BE\x1F\u00DCE}\u00DF\u00FF2\x05\x1F\u00FE\x16\u00C56\u00BFe\u00C7G\u00BC\x1A\x07\u00DA}\u00BCl\x13\u00C5\u00F6o\u0087\x1E\u0097 \u00ADh,\u00B9.\u00BA\u00C6\x16.g\u0098\u00F0\u00D5+\u00AF\u00BC\x12\u0082\u00E6}\u00B0\u00AB\u00ABk\x1D\u008E\u0099\u00C8XBs\u00E3\u009C;z\u00F4\u00E8\u00AB@\u00C4\x17\u00FC\u00EEw\u00BF+>\u00E7\u009CsX\x03g\u00C2\u00E1z\u00E5N2<h &\u00D7=\u00F7\u00DC\u0093\u00870\x0B\u00F7\x7F\n\u00E7>\u0089p)\u00C2'@F\x17~\u00FE\u00F3\u009F\u00CF\x05\u00E1\u00F7\u0082\u00D8\x0E\u00E0\\5\x02O\u0089e\x1B\u00861\x17d\u00BF\u00E0\u00DE{\u00EF\x1D\u008B\u00BF\u0083\u00EE\u008B\u00A1qs\u009A\u008E\x07\x1Ex \u00FB\u0086\x1Bn\u0098\t\u0082]\u0088c&L\u00F6\u00DD\u00F2\u00F5\x13\u0081\u00F7t\x1F\u00F8\u00F9\u0091\u00A0\u00D6\u00AE]\u00DB\x0Bm\u0099\x05\x16\x07&k^Q3\x03V\u00C7\u00F9w\u00DEyg\u00E9\u00A2E\u008B\u00F8xP\u00FB\x19\u009A\x7F\u00E7\u008F\x7F\u00FC\u00E3\u00DCK/\u00BDtvnn\u00EEE8\u00E6];\u00F9Z3,\u00AC\u00B2}\u00FB\u00F6\u00D5\u00C3\u00E2\nWVV\u00B6\u00C2\u008A`\u00E1\u00CB\u00ABx\u00F8\u00FA\u0098\u00FC\u00FC\u00FC\u008B\u00AE\u00BD\u00F6\u00DA\u00D9\x10\x16<A\u00C9\u0083fx\x1B\u00E8H\u00D7\u008F\u00FA)\u0099={\u00F6\u0085\x10\x12\u00BCi\x1C[\x0FlM\u00ED\u00870\u00A9\u0086\u00A0\u00E2\n8\u00A3\u009D\x0B0>\u0099M\u00F9\x1E)\u00C6\u00A1\u00E7\u00E7\u0080\x04lk\f\u0084\u0090\u00D05j\u008F)q\u00A8^\u00D3Ypr?\u0088o\x1B\x16\u00F8\x1C\u0087M2\u00DC\u00D3\u0091P\u00FBM%\x0F\u00E9B\u0085\u00B9\u00C0\\\x10\x10\u00BE\x03\x02`t\u00A6N\u00E3\u00F2E/;\u00BD\u00B9\u00DF|\u00EC\u00E0\u0084\u00EC\u00EC\u00B3\x12\t\u00CB\u0094<)k\u00AF\u0099G\x0F\x11\u009A\u0090\u00BET!\u008A&\u00BA\u00C5\u00D8\x7F)L)\u00BA-\u00DFU\u00F0\u00B3\u00D14\u00EE\u008ALs^\u00B6\u00A1\u00E6\u00A2\u00E7\u00F0\x07\u00E3\u00EDI\u00D6\u00A3\u00C0\u008A[f8nQ/\u00E4\u0087\u00FD\x1E\x04k\u00ED8\u009F\u0095\"\u00D5\u00D93\u00DDj\u00EEo3\u00F4\u00B3\x1E\u0099\u00E2\u0099\u00B2\"\u00CFWX\x11\u00D2\u00FA:\u00C2\u00B4[j\u00A2\u00CA\u00D1?\u00DFB\t\bd\u008D\u00E4\u0094\"C.\u00FEl\u008Ev\u00FE\x0F\u00C6\u00D0\u00B8\u00AF\u00E7\u00B9\u008A\u00BE=\u009A\u00C6~k\u00B2w\u00F64?]\n\u00B5\u00FE\u009C\x04\u0089,\u00D0\u009E0$E5!\u00EA\x03J\u00ED*\u008B\u00C5kaDG\u009D\x1F\u0080\u00F0\u008Fg\u00EA\x7F0X,\x18\u00995\u00FA(\u00B6n9\u0085^{\u009A\u00CC\u0096Z\x12\t\x0B\u00B5\u00AA\u00DB\u00EB\u00E7\u00CD\u00FAJR\u00BD=$\u009Cn\u00D4L\u0082\u00AC\u00AA\u00BDdE\u00FB'\u00A7ej\x16\x19S\u00AB\u00EC\u00F3<y\u00AB\u008F\u0099L\u0091U/St\u00E3\nr\u0082\u00E8\u00B5\u00EC|\u00FB\u00A3\u00E8\u00C6\u0096U\x10\f+A\u00B9\u00E8\u00FF\u00F6\u009C\u00E4\x19\u0081\u00F9\u00E8\u00A3\u008F\u00B6A\u00A3\u00DF\u00C4{\u00BA;\x1C\x0E&,&S^}|Aaaa\u00EAg?\u00FB\u00D9Qg\u009F}\u00F6\u00B6\u009D;w\x1E\u00865\u00D0}\u00F0\u00E0\u00C1h0\x18\u00B45\u00AD\u00BC\u00BC<\x19\u008DF\x1Dx\u00DE;y\u00F2\u00E4\\h\u0098\u00D3\u00B2\u00B2\u00B2x\u00E7\u00C5\u00C1\u00DD\x1D\u00B9 \u00BC|R\u00D3u]\u00ED\u00DF\u00BF?\u0084\u00E7+\u00C7\u008C\x19\u00B3\x19i\u00F1\u00A6]\u00FCF\u00EBX\u00B7\u00DB}\x19\u00A0\u00A5\u00A4\u00A4\u00ACy\u00E7\u009Dw\x0E\u00B7\u00B6\u00B6\u00F6\u00ED\u00DE\u00BD;\x01\u00CDZ\"\u00B8\x10w\u00D6\u0085\x17^8\x15\u00DA=oi\u00C0[)\u00B3P:\u00D3\x03\\=\u00F9\u00E4\u0093\x11\u0090k\u00CD\u00B8q\u00E3\u00B6@\u0093\u00E6\x17\u00A4x\u00C7\u00CEQ\u00F8}\u00C9E\x17]\u00A4gff\u00AE\x05\u00A9W\u0095\u0095\u0095\u00F5\u009A\u00A6\x19\u00870\u00E3\u00FC\u00BBKKK\u00B3p\u00FD,X3,\x00\u00F9\u008BZl\u009D\u00B0\u00D9\u00B7\x1BuZ\u00B6b\u00C5\n~Q*\x06\u00D2\u00EF\u00826\u00BFc\u00C6\u008C\x19\x1C/\u00B7\x01\u00BB\u00AD\u00E6@`\u00C6o\u00BB\u00ED6\u00F7\u00C4\u0089\x13w\u00EE\u00DA\u00B5\u00AB\u008DW\u00EE@sW\u00A8G\u0083\u00DBh\u00FE\u00FC\u00F9\u00C5\u00D3\u00A6M\u009B\u00EF\u00F1xx\u00BB\x07\u00DE\u00F5\u0093\u0095\u00E9C\x10&\x1B!\u00A4\x0E\u00FD\u00E8G?:yg\u00E8\u00A9\u0081\u0098\u0099\u009E\u00EE\u009A\u00E2\u008E\u0097h\u00CA\x1A\u00A3\u0094\u00805c\u00CFn+\x03#&J\u00F2pg\u008C\x0EU\u00B7+\x16J\u00EF\u00B3<\u0086@\u00B5\u008D\u00A4\u00E8\u00DA\x0E\u00AD\u00AA0/Q\u00E9\u00D6\u00F4\u0099q\u00A1|\u00D0dy\u00BD\u008A\u00A6\u0094\u0096\u00E9\u00904nf\u0096\u00AF 7\u00E6m\u00A6\u0096c,\b9\x15\u00A2\u008E{\u00DB\x07\u008C\u00E7LtP\x074\u00F1\u00BD1\u00BD\u00E722\x1B\u00DD\u0082\u00BAb\u008A\nQ?N\u0090y\u00AA\u00CB\u00A0\x19\u00D3%\u00A9\u00D2|k\u00B2%\u00B4\u00A8[\u00FAs\u00FDRM\x02\u00CFO\u0088+\u00E5c\x1D\u0094\x1B\u0085\u00A14\x12\u00E1\u00D8\x11e\u00CBlUf\u00F7D\u00A57\u0080\u00C4\u00BB\u00A1\u00B9\u00E7\u00E3V\u00C3\u00E4O=J\u009A>\u00DAI\u00FE\u00B1^W\u00A3GX=\u00A8\u0093\u00DD\x1DJ\u00AD_\u00DF\x1B\u00DB\u00BD\u00D8\u00E1\x18\u00E5\u00D3e\u0086RV\t[tQ\u00A5\u00F2\u009C\u009A\u00B8p\u009CSe\u008D\u00CE\u00F4\x1E4\u00B3\x15H\u00D2\u00CB\u00F6v\u00B1C\x13\u0093\u00D1\u0086#\x11/\x7F\x0F!\u00E6\u0094V\u00A3IrK]Dly\u00B9\u00CE\x03E \u00D6O\u00BC'\u0089\u008FN\u00F8RR\u00A2\u00A5\u00DE\u00DE\u00E9\u00D2\u0098~\u00BE-\n-h\u00E8\x16\u00CE\t\u00AE)~\x1B\x16\u00E0\x05W\n\u009A=o\u0094\u00C6K4\u00B54\u008CQ\x03F\u00AC\t\x05\u0085k3\u00D4c\x7F\u00A2\u0090w\u00BD\u0094\u00E9\u00D9\u00A4O:\u009BdF\x1E\u0099\u00D5\u00FB)\n\u00CD\u00DF}\u00E9u\u00A4\u008D\x1Cg\u00AF\u00ED\u00A7x\u009C\u00E2\u00BB7 >\u009E\x17<3\u00E0\u00B74\x7F\u00FB\u00DB\u00DF\x1E\u00F2\u00FB\u00FD+\u00CE:\u00EB,\x17\u0088\u0099\x1B\u009CI\u00835J\u00DE\u008B\u00BD\b\x044\x1D\u0084R\u00D9\u00DD\u00DD\u00CD\u00EE\u0087fh\u00A1\u00BC\u009CO\u00E1^gzzz&\u00C2(\x10\u00F8\x18\u0090\u00B1M\u00E0\b\u00ACq\u00B1P`Mu34\u00CC\u00CD\u00AF\u00BD\u00F6Z3k\u00B1\u00D0\u00D0\x1BAR\u00EB\u00A6O\u009F\u00CE\u00EE\"v*\u00B3?{\u00AA\u00CB\u00E5\u00F2/X\u00B0`,\u00B4\u00D4=\u009D\u009D\u009D\u0087au\u00F49\u009DN\x074\u00E2|\b\u0082qH\u008B\u00B7\x1F\u00E6\u00B7ty\u00AD:\x0F=\u00EE\x10\u00A7b(\x7F\x10X\x7F\u00FC\u00E3\x1F;\u00C6\u008E\x1D\u00BB\x05VL\x01\u00F2\u00C4\x02\u0092\u00B5\u00F5)\u00A8\u00A74\u0090u)\u0084\u00E3\x1E\u00908\u00D7S\x0F\u00F2\u00CFk\u00D5\u00F3\u00BD^o\u00C9@\u00FEy\u00CF}^\u00C7\u00CFD\u00B7\u00AB\u00AD\u00AD\u00ED\u00ED7\u00DF|\u00B3b\u00E0+X\u00EA\u00D9g\u009F\rC8T\u00A2~\u00DE\u00C9\u00C9\u00C9\u00E1\u00FA\u00E1\u009DD\u00B9\x1D.\u0084P\u00CD\u00BE\u00EE\u00BA\u00EB\u00CE\u0082@9\u00D8\u00D1\u00D1\u00C1\u00DB`\u00C4!\\\u00D3\x10\u00FF\x18\u00D4=\u00D7\x0Bo\u0097\u00C0/\u0085q\u00DF\u00E7\u00FDwV\u00C3z\u00DB\u00F4\u00C8#\u008F\u00F0>\u00FE\u00DC\x16gR@\u00CAE.J-4h\u00BCa\u008A\u0091aa\u00EFx\u00C9L\u00A2@\u00D0\u00A1\u0080\u00A5*\u00AB\x03z\u00CD\u00CA\u00CE\u00CE\x13/|\u00DCF\u0089\u00E7\u00FD\u00D4\u00FE\u00C9<\u00ED\u00A0[XM\u00E0%\u00DE\u00C1\u00D1\u00DEA3f)\u00B7\x13|6Z\u00AA\u00D2[=\u0081\x03\x0F\u0091\u00B4\x15\x11\x14\u0094\u00DF\n\u00B5\u00FB\x06\u0094]\u00DBqq\u00EC\u00A5<\t\x1E\u00DB\u00F6\x7F\u00BC*\x04\u00B7Z\u00B0B,\u009DW\u0098p\u00EF\u00E4%\r\u00DC\x12\u00B8\u00C6q!n\x0B\u00C3\u00DA2\u00D8q\u00A2\u00BD\u00DB\u00FF\u00ECu\u00EB W\x04\x0B\u00BA \u00AF&\x01\u00C7\u0082\u00D2\u00EC\x1C\u00BD\x1F|\x1A&\u00B3\u00C2_{\u00D5\t\u00A2\u00B28\x1F\u009C\x07\u00D6\u0090\u0086C\u00C3\r<\u00C9*A\u00F0\u00B8OB\u0085W\u009A\u00A9\u0094S\x18\u00D6oj\u00A8\u00FB\u00FA\fm\x7F\u008A;\u00B1\u00C7%EN\u00D4Ry\u00A8#(\u00CD\x04\x05\u009BR2\u00A0\u0095C\u00DC&\x1C\u00D2\u00F4\b%\u00DD1\x13\u00EA\u00A7\u00A2\x1EM\u00B2KA\u00E0\x11\u00E4\u00D7Tz:\u00A2\u009B\u0094MFy\x1B\u00C5W\u00F6\u00B8\u00BA&:\u00AD\u008A\u00B1\u0092*\u00A5Ty\u00CA\u00A2\f\u00E4UG\u00FA9\u0086Fi\u0086P\u00D0\u00C0E[\\\u00A3X\u009E\u00A1\u00B6\u00FE\u00FBaGu\u0091G\u00AC\u009C\u00EA\u00B7\x1Cn\u008D\x12\u00C8\u009B=yl\u0081\u00F4\x1D\x10>\x0E\u008D\u00A6\"\x0F\u00DC\u00DE:\u00F4Y?\u00E2b\u0097\u00A6\u00E6\x003\u00C2*h\u008C[bcu\u0098^_\x1BQ{^\u00EA\u00B6\u00BF\r \x13\u00B8Is\u00F2\u00EB\t\u009A]?\u00DC\x7F p\u0094n\u00BDo\u0099\u00AB\u00ADY~4\u00B0\u0096\u00CDZ\u00FD\u008Eu\x14}\u00FB\x15\u008A\u00AC\u00FF+E\u00B7\u00AE\u00C1\x05\u00AE\u00A3\u00A1\u00D1\u00A3\u00B6@\u00D0\t\u00FE\u0098\t\u00AC\x01n\u0095w\u0081k\u00C8\u00B5\u00D9TK\u0089\u0083\u00FDK\x0F\x1D\x13g\u0092\u00F7\u0086\u00BBQ\x12\u009D\"\u00CB\u00FFD\u0089\u00FD;\u00EC\u00CD\u00D7\u009C\u00B3\u00E6\u00DB\u00AB}<W\u00FF#nBO;s\u00EE\x1D\x05\x12\x0B<\u00F7\u00DCs{\u00A1=\u00FE\x05D\u00F1\n\u00CE\u00EDF`\u009F>\u00F7c\u00DE\u00B1q!\b\u00EB3 \u0098\u009BG\u008F\x1E}\u00FB\u00A4I\u0093n\u0087\x00\u00E0\u00BF\u00B7\u00E5\u00E7\u00E7\u00DF\n\u00B2\u00BE\x01d\u00CF\u00BB;\u00B2\u00FF\u0098\u00B5Wn0vM\u00BC\x06\u008D\u00FE\u00C5\x17^xa\u00EB\u00B2e\u00CB\u00EC\u00B7E\u0091V\x10\u00C4\u00B6\u00AF\u00AA\u00AA\u00EA\u00AF8~\x0B\u00E10\x02\u0093\u00D18\u00C4q)\x04\u00CF\u008D\u00D0\u0084\u00BF\x00\u00E2\u00BC\x1D\x1A\u00ED\x17322nB\u00DA\u009F\u00C6u\u00D6\u008C\u0099`\u00DB,\u00CB\u00E2g\u00D8/mk\x01\x1A\u00EFi4\x00\u00FC\u00E6\u008A\x1B\x1A \x7F\r\u0082\x16~\u00DC\nEY\u00ECO*\x02|\x1Fk\u009DG\u009E\x1F\x02\u00C5_\u00AA\u00FA\u00D5\u00AF~\u0085\u00ECW\u00F1\u009Bx\u00FC\x1D\x1EvOq\u00A33\u00F1/B]\\_\\\\\u00FC\u00C5\u00A9S\u00A7\u00DE\x01K\u00E0\u00F6\u00D4\u00D4T\u00CE?\u00BB\u00B88\u00FFL\u00F6\\\x0F\u00DB \u00D0^\u0085f\u00BF\u00FE\u00A7?\u00FD\u00E9 !3L\u009EW\u0081\x10\u00D8\u00C8\u00D7q\u00BC\r\u0081\u00CB\u00C9\u00CF\u00CD\u00E1x\u00B8\r\u00A0\u00F1\u00DF\x01\u0081\u00F9OEEE_\x04\u00D9_\u008Fk\u00BC\x1F?\x0BZ\x16\u00D6\u00FCR\u00DA\u00CA\u00BD{\u00F7\u00AE\u0080 \u00AFd\u0081\u008E\u00E3#@\x1D\x0F\u0096\u008B\x05\u00F6\u00F0\u00F2\x1D\x15\u00A8?^R\u00CB?\u008F<\u00CB\x01\u0082\u0098\u00CF\u00BD\x0F\x0B\u00F0\u00C8\x15\u00D9f~\u008A\u00AE\u00C6@\x7FH\u00E3'Aj&$QL'\u00D1\x1CTt\u00B0LF[1\"\x06\u00CB}<\u00A8U}}\u00A1\u009A\x18U\u0098\u0096\u00A8tJ\u00D5\x07\x021A\u008C\u00BC\u00A4Pxt\u0091\u009Fm\u00881S\u0094L\u00F7a\u00F4!\u0084\u009DRt\u00E1\u00BE\x0E\u0087fuxt\u00AB\u00D3-\u00CC\x00\u00AC\f\u00DE\x1Bbxy\u0095\u00CB%`\u0089Q\u009F\u00D3\u00A0N\u00B7\u00C4\u00FD\u0092:<B\u00EB\x06\u00C1D\u00BC1{kh\u0085<\u00C7\u00DDJ\x05\u00DCB\u00D9\u00F7\u00B8\u00A5\u00E8pI\u00AD\u00D7'U\u00D4\u00AF\u00F5\u00DFcX T!\u0082.\u00F0\u00F5\u00C0=\u00B8W\u00EB\u00F1\n=\u0082\u00FC\u00BE?]C\u00C4pO\u00AF[\x13\u009D.\u00E4\u00D3%\u00A9\u00D3a\u0088>'Yq\u00E4\x7F\u00E8\u00FD\u00F8\u00DD\u00A6\u00DC\u00CA\u008A\u00BAI\u00F4\u00B8\u0085\u00B0\u00CB\u00E5&\u00AB\x13y\x0E\u00F8\u00DD\"\u00DEC=\u00E1m}\u00B1\u00FD\r1Z\x01*_\u00E3\u00D1\u00ACJ\u00E4\u00A3\x13-\x1DG\u00BD{\fM\u00E6:\u0095\u00CA\u00E6\u0099m\u00C8\u0088\u00CAn2Wc\u00E0lr\t\u00AA\u00E5\u00F2r\u00B9|\u00BA\u008Ad:5\u00FDJ\x7F:\x0F&\u00F5_\u00B5=\u0081\x03q\u00DA\u00D7m\u008Aw\u00A4\x10\u00DB]R\u00D5\u00E3\u00BEn\u00D4{\u0084_UPJj\u00DCx\u0096)L\u009FE\u00E6[\u00C1`\u00CF+mb\u00F7\u00DE\u0080|\u00B9'N\u00CFcH\u00AE\u0085t\u00A9\x02\u00A1\u00F3[\u00B0L\u008B)\u00A0\u00CDl\u0084t\u00F4R\u00CD\x10V\u00AFG\u00AAj\x10\u00F8\u0086>)_\u00A8\f\u00ABgW\x06\u00CD\u008DO\u00ED\x0B\r\u00BE\u00A8\u00A5\\\u00BA\u0088;I\u00F4\u00A1~:\u00B9\u00CC.%:\u009DB\u00F5\u00F8\u00C8\n{\u00A3\u00FD\u00F5\u008E`\u00E3\x14m\u009E\u0086.\x05\u00CD=\x01\r\u009D_\u00BA\u00B2\u00EA*QcH\u0087\u0087\u00D5  \u00FA$\u00B4z\u00D7\u009C\u0085\u00F6\x07Rx\u00C2\u0096\u00AD\x02b\u009F>k\u00F8(\u00A1\n\u00F6\u00A1\u00FB\u00F4\u00921y\u0096\u00BD\x1E_f\u00E5\u0091\u00D5\u00DED\u00B1\r\u00AF\u00C3vj$}d\t\u00C9\u00CC\\\u0092\u00D9#H\u00F1w\\\u00D7`\u00AC\u00C3\u009A8bo\x1D\x07\u00BC\u00EC\x01\x15\u00FA\u0081\u00F7\u00C3\x1F\x06\u00F6O\u00F3s\u00DDiii- \u00A9N\u00B7\u00DB\u00CD\u0095\u00CE\u008D\u00CF\x1A#O\u008A\u00F1\u00E8fW\n\u00CF`\u00B2&\u00C9V\x00\u00AFu\u00E4\tB&$\u00BE\u008FM\x13\u00D6\u00EA\u00B7\u00F4\u00F6\u00F6.\u0087\x00Y\u00F1\u0087?\u00FCa\u00F7\x03\x0F<\u00D0y\u00F8\u00DD\u008F\u0080\u00DBi\u0081\u00AC\u00BAA\u00EE\u00DD\u00D9\u00D9\u00D9\tH~\u00D6\u00A58\u00B0\x0F\u009F\u00DD\x18\u0083ip\x18\u009C8f\u00ADx\x1F\u00AC\u008C\u00F5\u00C1`\u00B0\x06\x1A5\u00E7\u0089\u00D3l2Ms\u00C7\u00EE\u00DD\u00BB\x0F\u00ED\u00D8\u00B1#z\u00ED\u00B5\u00D7\u00E6!N\u00DE\x10\u008E-\x01^MS\x0E\u008Ba\x17H\u00BA}`\u009F\u00A0\u00A3\x02\u00CFh\u009F\u00F9\u00CCg\u00B2F\u008C\x18\u00C1{\u00C5s\u0099\u00B8>\u00AA@\u00BC[_}\u00F5\u00D5\u0086!\u009B\u0084\u00A9\u00B2\u00B22\u00DE\u00B5\u00B3\x17\u00D6J\x0F\b8\u008A\u00FC\u00F3X\u00E2<r\u009E8\u00FF\u00EC\u008Ea\u0097\x15[/\u00BC\u0091\x19\x0BN\u008E\u008Fw\u00C6\u00DC\u0088|\u00BC\x06R\x7F\u00E7\u00FE\u00FB\u00EF\u00AF;t\u00E8\u00D0{\u00DA\x0By\u00B5\u009A\u009A\u009AB\u00C8O'\u00B4\u00F7>X\x07\u00DC\x06\x1C7\u00C7\u00C1\u00BEy\u00D6\u00F8\u00D9]\u00C6u\u00C3\u00F9\x1C\u00DCS\u0086\x15\u00C3}\u00B1X\u00EC\u008D}\u00FB\u00F6\u00BD\u00FA\u00D8c\u008F\u0095=\u00FE\u00F8\u00E3,,\x06\x07\u0085\u00BC\u00FC\u00F2\u00CBS\u00E6\u00CC\u0099\u00C3>~n;\u00DE.aWOOO\u00D9o~\u00F3\x1Bv/\u00F1\x00:\x1A\u00C4\u0085\x17^\u00E8[\u00B4h\x11[(l\u00C1q\u009D7B8n>p\u00E0@\u00C5\u00CB/\u00BF<\\K\x17\u00E3r\u00C9yw\u009E^\u00EA\u00D6\u00E4\x14\x10\u0084\x1F\u00CAK\u00D0\x10\u00D4\u00E5\u00D7E\u008B\u00A5\u00E4\u00F6\u00A6\u0098\u00B5jy\u00B3\u00A7jG(t\u00B2\u00AE&\u00AB\x146\u00FF\u00DCT-\u00CB+\u00AD\f\x16\x1C(p\u00B7[R\u00B7.D7\u00B4\u00C7\u00C3\u00E4\u00D6\x0E\u00BE\u00DEK]\u00B7dY^C\u00B3(f\u0089\x06J\u0088\u0083\x18C\x07L\x12;\x1B@^\r\u0085\u00B1\u00CEmMC\u00CA9\u0089\u00E4\x17\x13\x0EW\u00A6\u0083\\B\u0089@\u00DC\u00B2\u0085\u00E5A\u00A9Dy\u00D0\u0094;w\u00C4\u00E5\u00E1\u00D7\u00DAc\u0091/\u00E58]\u00E9.\u00E1\u0082f\x19\u008C(\u00AA\x15BUhB\u0094u'D\u00D9\u0081p\u00A0qy'\u00C5\u00FF)\u00DF\u00E9\u00CCv\x13\u00EF\u00BC\x19J\u0098T\u008B2\x1F\u0084\u00B6_\x16Dw\u00D9\x1Ft\u00D4/\u00EB\u008A\f-\u00AB\u00FC\u00E7\x11\x0E\u008F\u00C7\u0080\u00A5\u00A2Tw\u00C2\x12\u0087QO\x15xvWGT\u00ED9\u00D4\u00DD\u00DB\u00B6:`\u00CFa\fB\u00DE]\u00E0\u00F4\u00F9\fr\u00C4-\u00D5n%D\u00A5\u00D0E\x05\x1AvgCP\u00DF\u00FB\u00FB\u00D6hgUg\"\\\u0098\u00A1w\x1AJ\u00B4h\u009Ah\u0083\u00F5\u00D0\u00A5\u0093\u00E4-\u0089[@\u00CF\u00F5\u0096&\u00F6\u0087\x14m\u00AA\u008F\u00AB7+\"r\u00BDGP\u00BD\u00DF\u00A0\x1EeR\x03\u00D2=\bR\u00DF\x1B\u00B2\u00E4^\u00B3\u00C5\u00D1\u00F2,\u00ACG\u00A4i9(\x16I\u00D1\u008CN\u008F\u00A1\u00DA\u009C\x10H\x06\u0089.\u00A9\u00AB6K\u0089&\u00C8\u00A4\x1A\u0088\u00A5}1im\u00AD\u008DZ\u00FB\x1EoItm\b\u00C4\"\u00B1\u00B8\u00AF\u00CB\u00EF\u00B2\u00DD3\\\x07u0\u009FZ\u00A0\u00D2w\u00A0\u00AF\u00B5CP4#4\u00A0M*c\u00A6\u00D8\x1ETruk\u009C\u00DE,\x0F\u00A8w\u009E\u00E8\u00D4\u00F7\u00FD`T\u00B0\u00B3\u00E9\u00F0\x11%@\u00DE\u0096\u00E5v\u00E58y\x07m\u00D1\x0B:=$4u\x10\u00F1\u00EC\u00E95\t\u0082%T\u00F3j\u00CF\u00BB\u00AF\u00C6\u009D\x1A\u00C2g\u00C2\u00E5O\x18\u00F6t\u0092\u00EA\u0085bf[@\u00C3H\x18Z\u00BD\u009E?\u0092\u009C\u0097|\u00C6\u00DE\u00E3>^YN\u00B1uo\u00E0\u00B9A\u00C2GH\u00C4\u00C8ji\x02\u00E9\u0087\u00ED/e\u00F1\x1E\u00F9\u00B1\u00FD;\u00A1\u00DDo'\u00B3\u00AE\u008A\x12\u00F5\u0087H\u00EA:\u00AC\u0081\x18\u00C5w\u00AE\u00A3\u00D8\u00CE\u00F5v\u00BA\u00EFK\u00EB(8E\u0084\u00CFP\u00DB\u00B6m\u008Ba\x10w\u0083@\x1B\u00A1\u00BD\u00D5A\u00B3\u00AB\u0087\u00C6\u00CA\x1A)W,wXv=\u00F0o\u00EE\x10\u009C\x0E\u00FFfm\u009E7\u00D6\u00E2\u0089L\u00FEx\u00C6\u00CA\u00BA\u00BA\u00BA\x15\u00EB\u00D7\u00AF\u00DF\u00F0\u00E4\u0093O\x1Ez\u00F4\u00D1G\u0099\u00A8\u0087\x13\u00AD\x05\u00ED62 X\u009A\x10\u009AAl\u009C\x0E\u00C7\u00C9q\x0F\u00A6\u00C5\x02\u0084%>\x7F|dmCC\u00C3\u00F2u\u00EB\u00D6\u00AD\u0085Pj\u0082\u00E6\u00CFD\u00C6D\u00B5\x1F$\u00B7s\u00E3\u00C6\u008D\u00F5k\u00D6\u00AC\u0089]\x7F\u00FD\u00F5\x1E\u0090%\x13#O\x1E\u00B1A\u00BE\x03\u00A4z\x00\u00D7y\x1F\u009Ec\u0091\x1AM\u009E<Y\u00CC\u009F?\u00DF5r\u00E4H\x16l\u00DC\u00E9x?\u009A\u00DD \u00E0\u00DD+W\u00AEl\x07\u00E1\x0F-\x03oX\x16\u0085v\u00DD\u008924A\u00F64#0\u00E1r\u009E\u00B9\fC\u00F3\u00CF\u00E5b\"\u00D9\u0086\u00BAYQ[[\u00CB\x1F\u0086\u00DFr\u00D3M75@x\u00F1\u00BDG\u00B4\u0094A\u00D4\u00D7\u00D7\u009B\u00B0\u00B8\x02%%%\u00AD\u0099\u0099\u0099\u008D\x10.\u00ADh\x0B\u008Ek0n\u00AEw>\u00E6\u00BA\u00E5\u00BA\u00E7\x0F\u0097\u00BC\u0083\u00BC.\u00DF\u00BAu\u00EB[\u00BF\u00FF\u00FD\u00EF\u00F7\u00A3\u00DE\u0087\u00AF\u00CC\x11\u00BC\u00BCs\u00F6\u00EC\u00D9\u0083.1\u00DEc\x7F\u00C7\u00FE\u00FD\u00FB+ \u0094\u00B9\r\u00DF\u0097\u008F\x01\u0088y\u00F3\u00E6\u00F1\u00C40\u00D7)\u0093=[${\u00C3\u00E1\u00F0vXo\u00F5/\u00BE\u00F8\u00E2Pb\u00B21#Hb\u00C1(\x17EL\u00EA\u00EC1\u00C5\u009E\u00F6\x18m\nXb}D\u0089\u00F5]\u0096\u00B5nw\u008FU\u00FE\u00C6\u00D8\u00DE\u00EE\u00C3\u0083_k:\ttw'b\u00E7e\u00E9}\u00A6\x10\u0087{\u00E2b[OBl\x04\u00E1n\u0084\u00B4\u00DD\x14Nh;\u00DB:\u00B4\u00C3O5\u00F7\u00F4\u009E?B\u00EF\u00EB\u0089\u0088\u009A\u0096\u0098U\u00D6\u009EP;\u00BA\x12jgWT\u00DBW\u00E1\u00EEk\u00FE\u00D6\x16\u00BB\u00EE\u00DE-g\x1B\u00A9EE\u00B1\u0098\x19rvt\u00C5\u00CC\u008A\u00E6\u00B8\u00B5\u00AB5\u00AEv\u00F4h\u00B4\u00AB\u00BD\u00D3\u00AC\u00AA\u00B7\u0082\u00DD \u00F3\u00C4\u00C2\u00C2X\\D\u009C\u00EDM1\u00B3\u00B2\x15\u00F7\u00B4'hG\u00AB\u00A0=\r\u00AD\u00AA\u00B67=\u00DE\u00B7\u00AC\u0089\u00CC\x0BFE\u00E3Z\u00D0\u00D9\u00D9\x115\x0F\"\u009E\u00DD\u00ED&\u00EDh\u008B\u008B=\rA\u00AA\u00F9\u00B3\u00DE\u00DBW\u00DE\u00F6\u009E1\u00A0\u0096Hw4\u00ACQkc\u00C2\u00DA\u00DF\x1E\u00B5vu!\u00CE\u00A6\u0098\u00DC[\u00ED\u0094\roO\u008B\x05\u00CB\u00CB\u00DF\u00D3\x1Ej\u0089\u00CB\x11\u0085\u00F0hl\u008D\u0099{\u00DB\u00B8\\\u00C8gKX\u00DB\u00B7\u00B7\u00D9\u00D1\u00FC\n\x04':\u0081\u00D93)\x11\u00AAn\u00F5\u00B5\u0084L:\u00AC\u0099\u00E2`P\u0099{z\x13r[W\\lnI\u00D0\u00C6\u008A\x10m\\VO\u00BB\u0097\u0099\u00A1\u009A4\u00A95\u00EAqQ\u00DDaZem\\\u009E\u00B0\u00D8S\u00D3Ku\u00AF\u00E6v\x07 \x14\u00ED\u00BC\u00EE\x0ERbk[\u00AC7\u00CDp4\u00C6\x12\u00C6\u00E1\u00902\u00F7\x05\u00A2rW\u00B7I[\u00BB\u00E3rs\u0087F\u009Bk\u0082roYS\u00A8\u00E5\u00B5\u0090\u00DD7\u00AD\u00B2p8V\u00D6\x1A\u00EBiuy\x1B\u00FA\x12\u00B1C\u0089\u0098q0JVy\u00C0\u0094\u00A8\x0F\u00DA\x1A0\u00C5\u00E6nKm\u00ACNh\x1B6\x05\u00C5\u0096\u00E5\x1D\u00A2\u00FCg\u0095\u0081\u00A6\u0095\u00BD(\u00DE{\u00FB\u0083\u00BA$\u00E6\u008Dk\u00BA\u00D5\u00DEl\u009A\x07Z\u00E2\u00D6\u00CE\x16\u0094\u00B9=Je\u00EDA:\u00F4[\x19\u00EF\x05\u00D7\r\n\x07\u0088\u0092\u00D3\u00F4\x11\u00F3\u00F7\x01\u0084\u00CF\u009A\u00BD\u00EB\x1F\u00BEB\u00CE\tgSx\u00F9\u00FFP\u00F8\u00D5?\u00D8\u00FE\u00F8\u00F7\x12\u00B6\"\u00E1M%\u00BD\u0098=$\u0092\u00CC\u00E6\x1A\x18e\x18;&\u00F4\x0F\x03Fc\u00CEH\u00D2\u00BC~\u00FB\u0093\u0088fG\x0Bn?\u00B9\u00EC\u00B3\u00C7\x1D\u00A3\u00F0\u00C3|\u00D3\u00F6x\u00D0\u0096.]\u00EA^\u00B2dI\u00FA\u00DC\u00B9s\x0B\u00D2\u00D3\u00D3\x0Ba\u00FEg\u0080\u0098\u00FD \x1E\u00D6b\u00ED%\u00820\u00F3c\u0081@\u00805\u00C5\u00DEP(\u00D4\u00D9\u00DE\u00DE\u00DE\bM\u00BBq\u00D3\u00A6M]\u00BF\u00FC\u00E5/\u0099p\u008F4\u00C81\u00C0\u009F\u00DDs\\}\u00F5\u00D5\u00E9\u00F8[\b\u008D\u00B6\x10i\u00A4%\x12\t\u00D6\u0098\u00B9\u00F2\u00D8\u00ED\x10\x05\u00BAZZZ\u00EA^x\u00E1\u0085Fh\u00F1\u00C1;\u00EE\u00B8#u\u00C6\u008C\x19\u009C'/\u00EE\rTVV\u00D6\u00FD\u00FC\u00E7?o\u009F4iR\x02\u0084\u0096:}\u00FA\u00F4bM\u00D32@\u0082qh\u00B0\u00CD\u00D0\u00C8\x1B\u00A1\u00BD3A\x1E\u00AF^\u00C4K/\u00BD\u00E4\u00C3\u00B3E o\u00D6\u00A2E$\x12\u00E9x\u00E7\u009Dw\u00EA***z\x1E|\u00F0\u00C1\u00A3\u0091\u0093@\u00BE\u009D\u00A8\u00AB\u00B4s\u00CE9g\x04\x04M\x01\x04e\x06\u00F2\u00C4\u00D6\u00CA`\u00E3C~\u009A\u0081\u00BE\u00BE\u00BE&\b\u00D4:\b\u00AC\u00B6\u0093\u00AC\x1B\u0086~\u00DBm\u00B7y?\u00F5\u00A9Oe\u0083\u00FCG\u00FA|\u00BE<~Q\r\u00E7y=%\u00BF\u0085\u00CB\u00DB\x1F\u00C7P\u00F7]\u00B0\nja95<\u00FC\u00F0\u00C3\u00DD\u00A8\u008F\u00A3\n\x12\u00C4\u00E5\u0081U1j`\x0Be\x05K\u00A3\x01\u00D6K\u00E3\u00BF\u00FC\u00CB\u00BF\x1Cw\x15\u00CF]w\u00DD\u00E5\u00BC\u00F3\u00CE;G\u00C0\"+@\u00FA\u00D0bU/\u0084z\u00ED}\u00F7\u00DD\u00D7\u00BE\u00EA\u00DD\u00EF\x14\x0F\u0085\u00F8\u00C5\x12r\u0084\x0E\u00A4\u00BBZb\u00A66\u00E8\u00F8qA-\u00AC\x0B;\u00E2\u00E5\u0093\u00DB\"\u00AB\u008E\u00F1\u00C1\u00F0\u00E3@<P\u00CC\u0096N\u009A+\u00D5c\u00C9\x1E\u00B6#\u0081T\u00D8:q\u00D3\x11\u00AF\u00F2\u00B5G\x1E\u00DBF\u00E6\u0082\x05$\u008BW\u0091\x0E\u00B3\u00C7\u00AE\x7F\u00FB\u00B6Id>[n\u00D7\u00F7\u00D1\u00DAP.\u009D\u0084!TN\x1A\u009BM\fHnux\x01%\u00DEF\x1E\x11\u0089z\x00\u00F7\u0094\u00E3\x1Eo9\ft\u00C4\u00BB\x11\u00F7\u00A4!.HtsU\u00BF2\u00C3\u00E5\u00B0\u00E3\x19~\u00CF\u009C\x05d\u00FE\u00DB@<8u\x04K\u00D1\u0086h\x04^\u00A6$9]\u00BE\x7F\x16\u00EE\u00C7q\u00E2\u00D9\u00FE8\u00DF\x03\u00BE\u00FF\x02\u00DC_\u008D\u00FB\u00F9\u00F88\u00E5\u00E2rk\u00F7\x14\u0092aDHoH\u00CB\x10\x05\u00DDRu\x1B\u0086\u00B9\u00B6\u00A9)1\u00C4\u008D&\u00EF\u00C2}\u00E0\x0E9\u0098W\u00DFR\u00A4\u00FD\u00EC\u00FB\u00D3\x06\u00E4\x12\u008C\u00F9\u00AC\u00DC\\=\u00DF4eC\u009Ae\u00C7\u00E9F\u009C\u00E5\u0088\x13\u00F9=V\u00DDj\u00EC\u00DE\u009B\u0094M\u00BA/#K4\u0098xN\u0093*\u00D0\u00D9\u00AEB^J<^\u008C\u00E7\u008E\u00D3\x0F\u00B8\u00DEQF\u00FD\r\u00B4\r\u00EF\u0091\u00CC@BV\x06\u00EA\u00E7\u00C1w\u00EB\u00DD\u00C6\u0099#|\x10\u00B3\u00D0\r\u00DB%\u00C3\u00ABp \u008F\u00C8\u00EAae\u00EF(\u00C9\u00F3d/\u00AF\u00EF\x17l\u00A5\u00E3/\u00AF\u00BDg0\u00B9\u00DB\u00D7\u00F0\u00D7V\u00D9\x07\u00CE\u009F\x04N\x13\u00E1\x0FB\x03\u00A1\x190\u00E9\x1D\x18\u00EC\x0Eh\u00B3\u00AE\u00A2\u00A2\"\x174[;\u0083\x18\u00F8\t\f\u00FC\bH\u009F\u00B7U\u00B6\u00B5~\x10#\u00FF=Z\u00A79\x1E$4^\x07H\u00DC\x01-X\u0083F\u00CB\u009D\u00D6\x06,\f\u00C5\u00EE \u0090v\f\u009A1\u00C7\u00AD\u0090'\u00ED\u00AA\u00AB\u00AE2\x1A\x1B\x1B%\u00C8\u00D4\u0082\x10\u0088\u00BF\u00FD\u00F6\u00DBP\u00FE\u0084\u00E2\u00B7vA\u00FC\x06\u00C7\u00D3\u00DB\u00DB\u00AB\u00F2\u00F3\u00F3\x13\u00C8\u00D3\u00B1:\u00E4pH\b9c\u00CE\u009C9v\u00F9\u00A01\u009B\u00B0$\u00E2\u00C7 \u00FB\u00A1\u00B0\u009Fc\u00E1\u0085z\u00D2!(XX\u00D8e\u00E0\u00FC\u00C3\x02\u00E1\u00FD\u00F6\u00E3\u008F=\u00F6\x18\x13\u00F11;\u00F81`\x0F`\u0090\u00B5\u0083W\u00E5p\u00DD\x0F\u008D\u00FB(\u00F5s\u00BC\u00BC\u00F2W\u00AF\x1C\u0083\u00E5\x03\u00B8n\u00EC:\u00ED?<:\u00D0\u00CE\u00E2\u00F6\u00DBo\u00D7Q\u0097\\\u00AFb\u00B0\u00CE\u008FA\u00F6I$q\u00C6q\u00E6\b\u009F\u00C1D\u00CDD\u00CE\x7FyB\u00F7=\x13\u00B7\u00A7\x17\u00A7\u0099\u00F0\u0087\u0083\x0B&g\u00CE\u009Ci\x13\x0E4VN\u0087\t\u00E6d\u00C84\u0089$\u0092H\u00E2\u00B4\u00E0\u00CC1.\u0083]7\u00AC\u0095\u00DB\x06\u00D2\u0099M\u00FA\f\u0083\u0089=\x01\u00A2\u008Fs\u00E0\u00DF\x03\u00E7\u0092H\"\u0089$\u00FE\u00D7\u00F0\x7F\u009Au\u0093H\"\u0089$\u0092x\x17I\u00C2O\"\u0089$\u0092\u00F8\u0098\u00E0cG\u00F8<\x0B\u00C7\u008B\u00E1\u0093H\"\u0089$>n\u00F8\u00D8\x10>\x7F\x1F-b\x11\u00E5\u00EBDw\u00F1+?I$\u0091D\x12\x1F+\x10\u00FD\x7F\u009A\u008D\u00EE\u0088\u00D5h\u00C4_\x00\x00\x00\x00IEND\u00AEB`\u0082";
    }

    CTALaunch.Main = function () {

        CTALaunch.Init();
        CTALaunch.UI.Show( thisObj );
    }


    // ===========================| Global |============================
    function getCTAMainFolder() {

        var folder;
        var compName =  "CTA_" + CTAScene.name;

        for ( var i = 1; i <= app.project.numItems; ++i ) {

            var item = app.project.items[ i ];
            if ( item instanceof FolderItem && item.name == compName ) {

                folder = item;
                break;
            }
        }

        return folder;
    }

    function isImageLayer( layer ) {

        // no camera
        if ( layer instanceof AVLayer ) {

            // no composition
            if ( layer.source instanceof FootageItem ) {

                if ( false == layer.source.hasAudio ) {

                    return true;
                }
            }
        }

        return false;
    }

    function isAudioLayer( layer ) {

        // no camera
        if ( layer instanceof AVLayer ) {

            // no composition
            if ( layer.source instanceof FootageItem ) {

                if ( layer.source.hasAudio ) {

                    return true;
                }
            }
        }

        return false;
    }

    function isCameraLayer( layer ) {

        // no camera
        if ( layer instanceof CameraLayer ) {

            return true;
        }

        return false;
    }


    // ===========================| Test |==============================
    function getMainObj() {

        return CTALaunch;
    }

    function getSceneObj() {

        return CTAScene;
    }

    function showTestUI() {

        var myKeyState = ScriptUI.environment.keyboardState;

        if ( false == myKeyState.ctrlKey ) {

            return;
        }

        var showTestUI = !CTASystem.Test.show;
        CTASystem.Test.show = showTestUI;
        if ( showTestUI ) {

            CTASystem.Test.ui = CTAExaminator.UI.Create();
            CTAExaminator.UI.Show( CTASystem.Test.ui );
        }
        else {

            CTAExaminator.UI.Close( CTASystem.Test.ui );
            CTASystem.Test.ui = null;
        }
    }


    //=============================| Main |=============================
    CTALaunch.Main();


} ) ( this )
