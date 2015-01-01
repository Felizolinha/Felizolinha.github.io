// ==UserScript==
// @name	   	 TGB's Extensions
// @version		 1.0
// @author		 TheGameBuilder on Scratch
// @description  Make good use of them! :D
// @namespace  	 http://felizolinha.github.io
// @icon         http://felizolinha.github.io/Icon.png
// @grant 		 GM_setClipboard
// @grant 		 unsafeWindow
// @require      https://felizolinha.github.io/TGB/Plugins/math.min.js
// @require      http://felizolinha.github.io/TGB/Plugins/sweet-alert.min.js
//               https://cdn.rawgit.com/jquery/jquery-color/master/jquery.color.js
//       		 https://cdn.rawgit.com/AndreasSoiron/Color_mixer/master/color_mixer.js
//               http://www.youtube.com/player_api
// @match		 *://scratch.mit.edu/projects/*
// A huge thanks to the creators of ScratchExt, some block ideas came from their extension! I found out about Javascript extensions through GrannyCookies, without him this wouldn't be possible :)
// If you want to check out ScratchExt too: http://www.stefanbates.com/bookmarklet.html
// ==/UserScript==
//Variables///////////////////////////////////////////////////////////////////////////////////
var wait = 2.5,
    TGB = {},
	scratcher,
    user_language,
    keysPressed = [],
    keyDetection = false,
    online,
    storage,
    fail,
    uid;

waitfor(isDataDefined, true, 100, function() {
    is_creator = data.user.username == data.project.creator;
    shared = !data.project.isPrivate;
    project_id = data.project.id;
    remixed = data.project.parentId != null;
});

waitfor(isScratchDefined, true, 100, function() {
    admin = Scratch.INIT_DATA.ADMIN;
    notes = Scratch.INIT_DATA.PROJECT.model.notes;
});
    
console.log("                                                                                      \n                                                                                      \n.---.--..--. .       .-.           .     .      .---.     .                           \n  |:    |   \)|      \(   \)         _|_    |      |        _|_               o          \n  || --.|--:  .--.   `-. .-.--.-.  |  .-.|--.   |--- -. ,-|  .-..--. .--.  .  .-..--. \n  |:   ||   \) `--.  \(   |  | \(   \) | \(   |  |   |      :  | \(.-'|  | `--.  | \(   \)  | \n  ' `--''--'  `--'   `-' `-'  `-'`-`-'`-''  `-  '---'-' `-`-'`--'  `-`--'-' `-`-''  `-\n                                                                                      \n                                                                                      ");
commentAddition = ["Please read the instructions before commenting! Thanks :)", "Please use the forum to post your scores!", "Feel free to make your requests here!", "Please use my profile to make requests! Thanks :)", "Thanks for commenting! :)"];

//Check if the data object is defined to avoid loading errors/////////////////////////////////

function isDataDefined() {
    try {
    	return data != undefined;
    } catch(e) {
        return false;
    }
}

function isScratchDefined() {
    try {
    	return Scratch != undefined;
    } catch(e) {
        return false;
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

var link = window.document.createElement('link'),
    installCSS = function(url) {
        link.href = url;
        document.getElementsByTagName("HEAD")[0].appendChild(link);
    };
link.rel = 'stylesheet';

installCSS('http://felizolinha.github.io/TGB/Plugins/sweet-alert.css');

//Youtube/////////////////////////////////////////////////////////////////////////////////////
//Block is not working, so I'll leave this disabled for now.
/*window.YT_style = function(x, y){
    if(isNaN(x)) {
        x = 0;
    }
    if(isNaN) {
        y = 0;
    }
    $("#YTplayer").css(
    {
        'position': 'absolute',
        'bottom': 14 + y + 'px',
        'left': 15 + x + 'px'
    });
};

// Autoplay video
function onPlayerReady(event) {
    event.target.playVideo();
}

// When video ends
function onPlayerStateChange(event) {        
    if(event.data === 0) {            
        $("#YTplayer").remove();
    }
}*/

//Local Storage Check///////////////////////////////////////////////////////////////////////

try {
  uid = new Date;
  (storage = window.localStorage).setItem(uid, uid);
  fail = storage.getItem(uid) != uid;
  storage.removeItem(uid);
  fail && (storage = false);
  storage['!Cookie'] = 1; //Just a little Easter Egg :p
} catch (exception) {}

//Esrever/////////////////////////////////////////////////////////////////////////////////////

var regexSymbolWithCombiningMarks = /([\0-\u02FF\u0370-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uDC00-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF])([\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g,
	regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

var reverse = function(string) {
    // Step 1: deal with combining marks and astral symbols (surrogate pairs)
    string = string
    // Swap symbols with their combining marks so the combining marks go first
    .replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
        // Reverse the combining marks so they will end up in the same order
        // later on (after another round of reversing)
        return reverse($2) + $1;
    })
    // Swap high and low surrogates so the low surrogates go first
    .replace(regexSurrogatePair, '$2$1');
    // Step 2: reverse the code units in the string
    var result = '';
    var index = string.length;
    while (index--) {
        result += string.charAt(index);
    }
    return result;
};

//Semi-fix for sharing projects with extensions!//////////////////////////////////////////////

try {
    Scratch.Project.ShareBar.prototype.shareProject = function() {
        this.model.share();
    };
} catch(e) {}

//Wait for a condition to be true/////////////////////////////////////////////////////////////

function waitfor(test, expectedValue, msec, callback) {
    while (test() !== expectedValue) {
        setTimeout(function() {
            waitfor(test, expectedValue, msec, callback);
        }, msec);
        return;
    }
    callback();
}

//Checking if user is a New Scratcher/////////////////////////////////////////////////////////

$.get( "http://scratch.mit.edu/internalapi/swf-settings/", function(data) {
	scratcher = JSON.parse(data);
    scratcher = scratcher.user_groups.indexOf('Scratchers') > -1;
});

//String Manipulation Functions///////////////////////////////////////////////////////////////

capitalizeFirstLetter = function (string) {
    var n = string.search(/\w/);
    var a = string.charAt(n).toUpperCase();
    var b = string.slice(n + 1);
    return (n > 0) ? string.substr(0, n) + a + b: a + b;
};

contains = function (a, str){
	return a.indexOf(str) > -1;
};
    
startsWith = function (a, str){
	return a.slice(0, str.length) == str;
};
    
endsWith = function (a, str) {
	return a.slice(-str.length) == str;
};
    
capitalize = function(b, str) {
	return b.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
    
shuffle = function (k, str) {
	var a = k.split(""),
    n = a.length;
        
	for(var i = n - 1; i > 0; i--) {
    	var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
	}
    return a.join("");
};

//Net Checker/////////////////////////////////////////////////////////////////////////////////

if(contains(navigator.userAgent, "Firefox")) {
	function serverReachable() {
        // Thanks to Louis-Rémi!
        var x = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" ),
            s;
        x.open(
            // append a random string to the current hostname,
            // to make sure we're not hitting the cache
            "//" + window.location.hostname + "/?rand=" + Math.random(),
            // make a synchronous request
            false
        );
        try {
            x.send();
            s = x.status;
            // Make sure the server is reachable
            return ( s >= 200 && s < 300 || s === 304 );
            // catch network & other problems
        } catch (e) {
            return false;
        }
            
        setInterval(function() {online = serverReachable();}, 3000);
    }
}

//TGBox///////////////////////////////////////////////////////////////////////////////////////

create_TGBox = function(title, description) {
    var src = $('.user-icon').attr('src').replace("32x32","50x50");
    ca = (title.length > 16) ? title.substring(0,15) + "..." : title;
    ca = capitalizeFirstLetter(ca);
    cb = (description.length > 45) ? description.substring(0,44) + "..." : description;
    cb = capitalizeFirstLetter(cb);
    $("body").append('<div id="TGBox"><div id="TGB_bg2"></div><div id="TGB_bg"></div><img id="profile_pic" src="' + src + '"/><b><p id="TitleGB">' + ca + '</p></b><p id="TextGB">' + cb + '</p></div>');
    $("#TGBox").css(
    {
        "height":"75px",
        "width":"200px",
        "position":"fixed",
        "background-color":"#0f8bc0",
        "bottom":"55px",
        "left":"-247px",
        "opacity":"0",
        "z-index":"11",
    });
    $("#profile_pic").css(
    {
        "position":"absolute",
        "top":"13px",
        "border-radius":"100%",
        "right":"-25px"
    });
    $("#TGB_bg").css(
    {
        "position":"absolute",
        "width":"75px",
        "height":"100%",
        "border-radius":"100%",
        "background-color":"#049ad6",
        "right":"-37px"
    });
    $("#TGB_bg2").css(
    {
        "position":"absolute",
        "width":"75px",
        "height":"100%",
        "border-radius":"100%",
        "background-color":"rgb(59, 167, 213)",
        "right":"-44px"
    });
    $("#TitleGB").css(
    {
        "color":"#fff",
        "position":"absolute",
        "right":"17px",
        "top":"15px",
        "text-shadow":"0 1px rgba(0,0,0,0.4)",
        "font-size":"12px",
        "text-align":"center",
        "width":"100%",
    });
    $("#TextGB").css(
    {
        "color":"#fff",
        "margin-left":"25px",
        "margin-top":"35px",
        "text-align":"center",
        "text-shadow":"0 1px rgba(0,0,0,0.4)",
        "font-size":"11px",
        "max-width":"120px",
        "line-height":"1",
        "word-wrap": "break-word",
    });
};

TGBox_out = function() {
    $("#TGBox").animate(
    {
    	opacity: 0,
    	left:-247,
    }, 1500);
};

TGBox_in_helper = function(a, b) {
    ca = (a.length > 16) ? a.substring(0,15) + "..." : a;
    ca = capitalizeFirstLetter(ca);
    $("#TitleGB").html(ca);
    cb = (b.length > 45) ? b.substring(0,44) + "..." : b;
    cb = capitalizeFirstLetter(cb);
    $("#TextGB").html(cb);
    $("#TGBox").animate(
    {
        opacity: 1,
        left:0,
    }, 1500);
};

//Reports the wait to user////////////////////////////////////////////////////////////////////

console.log('Waiting ' + wait + ' secs...');

//Extensions//////////////////////////////////////////////////////////////////////////////////
//TODO: Include pages to explain each Extension.

TGB.installExtensionOperators = function () {
	(function(ext) {
        
		ext._shutdown = function() {};

		// Status reporting code
		// Use this to report missing hardware, plugin or unsupported browser
		ext._getStatus = function() {return {status: 2, msg: 'Installed'};};
        
        // Block and block menu descriptions
		var descriptor = {
			blocks: [
				['r', '%n ^ %n', 'power', '', ''],
				['r', '%n v%n', 'nth_root', '', ''],
                ['r', 'evaluate %s', 'evaluate', '5.08 cm to inch'],
                ['r', 'atan2 of x:%n y:%n', 'atan2', 1, 1],
                ['-'],
                ['b', '%s %m.compare %s', 'compare', 1, '?', 1],
                ['b', 'Case sense %s = %s', 'equals_to', 'A', 'a'],
                ['b', '%b xor %b', 'xor'],
                ['-'],
                ['b', 'true', 'b_true'],
                ['b', 'false', ''],
                ['b', '%n % chance of true', 'random_bool', 50],
                ['b', '%s as a boolean', 'as_bool', Math.round(Math.random())],
				['b', 'is %s a %m.data_types ?', 'type_of', 10, 'number'],
				['r', 'if%b then %s else %s', 'reporter_if', '', 'hello', 'world'],
                ['-'],
				['r', '%m.constants', 'constants', 'Pi'],
                ['r', 'round %n to %n decimal places', 'round_places', 1.23, 1],
                ['-'],
                ['r', '%n within %n and %n', 'within', 11, 1, 10],
                ['-'],
                ['r', '%n %m.radgrees to %m.radgrees', 'radgrees', 180, 'Degrees', 'Radians'],
                ['r', '%n %m.degrees to %m.degrees', 'degrees', 0, 'K', '°C']
			],
			
			menus: {
                compare: ["=", "=", "?"],
				constants: ["Pi", "Phi"],
				data_types: ["number", "string", "boolean"],
            	radgrees: ["Degrees", "Radians"],
            	degrees: ["°C", "°F", "K"],
            }
		};
		
		// Blocks
     
		ext.power = function(base, exponent) {
			return Math.pow(base, exponent);
		};
	
		ext.nth_root = function(n, x) {
            if(!(isNaN(n) || isNaN(x))) {
                if(n === Infinity || x === Infinity) {
                    return Infinity;
                } else if(n === -Infinity || x === -Infinity) {
                    return -Infinity;
                } else {
                    try {
                        var negate = n % 2 == 1 && x < 0;
                        if(negate) {
                            x = -x;
                        }
                        var possible = Math.pow(x, 1 / n);
                        n = Math.pow(possible, n);
                        if(Math.abs(x - n) < 1 && (x > 0 == n > 0))
                            return negate ? -possible : possible;
                    } catch(e){return NaN;}
                }
            } else {
                return NaN;
            }
		};
    
        ext.evaluate = function(s) {
          return math.format(math.eval(s), 16);
        };
        
        ext.atan2 = function(x, y) {
          return Math.atan2(x, y) * 180 / Math.PI;
        };
        
        ext.compare = function(a, type, b) {
          
          switch(type) {
            case "?":
              return a != b;
            case "=":
              return a <= b;
            case "=":
              return a >= b;
          }
        };
        
		ext.equals_to = function(a, b) {
        	var c = Number(a);
            var d = Number(b);
            if (isNaN(c) || isNaN(d)) {
				return (a === b) ? true : false;
            } else {
                return (c === d) ? true : false;
            }
		};
    
        ext.xor = function(a,b){
          return Boolean(a ^ b);
        };
        
        ext.b_true = function() {
          return true;
        };
    
        ext.as_bool = function(b) {
            return isNaN(b) ? !!b : !!Number(b);
        };
        
        ext.random_bool = function(n) {
            return math.random(0, 100) < n;
        };
    
		ext.type_of = function(a, b) {
			switch(b) {
				case "number":
                    if(!isNaN(a)) {
                        if((a == Infinity && !(a === Infinity)) || (a == -Infinity && !(a === -Infinity))) {
                            return false;
                        }
                        return true;
                    } else {return false;}
          					break;
				case "string":
					return (isNaN(a) || a == "Infinity") ? true : false;
				case "boolean":
					return (typeof(a) == "boolean") ? true : false;
			}
		};
    
		ext.reporter_if = function(b, opt1, opt2) {
			return b ? opt1 : opt2;
		};

		ext.constants = function(p) {
			return (p=="Pi") ? Math.PI : (1 + Math.sqrt(5))/2;
		};
    
        ext.round_places = function(n, places) {
          places = Math.round(places);
          n = Number(n);
            return math.round(n, places);
        };
        
        ext.within = function(n, a, b) {
          if(isNaN(n) || isNaN(a) || isNaN(b)) {
            return "NaN";
          } else {
            if (a === b) {
              return a;
            }
            var max = (a > b) ? a : b;
            var min = (a < b) ? a : b;
            if (n >= max) {
              return max;
            }
            else if (n <= min) {
              return min;
            } else {
              return n;
            }
          }
        };
    
        ext.radgrees = function(n, type1, type2) {
          if(type1 == "Degrees") {
            return (type2 == "Radians") ? n * Math.PI / 180 : n;
          } else {
            return (type2 == "Degrees") ? n * 180 / Math.PI : n;
          }
        };
            
        ext.degrees = function(n, degrees_from, degrees_to) {
          //C / 5 = (F - 32) / 9 = (K - 273.15) / 5
          switch(degrees_from) {
            case "K":
              switch(degrees_to) {
                case "°C":
                  return n - 273.15;
                case "°F":
                  return ((n - 273.15) * 9 / 5) + 32;
                case "K":
                  return n;
              }
              break;
            case "°C":
              switch(degrees_to) {
                case "K":
                  return n + 273.15;
                case "°F":
                  return (n * 9 / 5) + 32;
                case "°C":
                  return n;
              }
              break;
            case "°F":
              switch(degrees_to) {
                case "°C":
                  return (n - 32) * 5 / 9;
                case "K":
                  return ((n - 32) * 5 / 9) + 273.15;
                case "°F":
                  return n;
              }
              break;
          }
        };
		// Name of Scratch Extension goes here
    ScratchExtensions.register('Operators', descriptor, ext);
	})({});
}

TGB.installExtensionUI = function () {
	(function(ext) {
		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 1, msg: 'Prompt and Confirm shouldn\'t be used inside other UI blocks and Clipboard blocks. A workaround for this is to use variables(or counters) to store their values.'};
		};

		var descriptor = {
			blocks: [
                ['w', 'TGB?x ?????:%s ??s????????:%s', 'TGBox_in', 'Coolness +1!', 'Installed TGB\'s extensions!'],
                ['-'],
                ['w', 'Alert ?????:%s ??s????????:%s %m.alerts', 'SweetAlert', 'Congratulations!', 'You leveled up your programming skills!', 'success'],
                //['R', 'Prompt ?????:%s ??s????????:%s ???????????:%s ???????:%s', 'SweetPrompt', 'Hi!', 'How are you?', 'Write your mood here!', 'I\'m feeling AWESOME!'], Disabled for now. Prompt version of SweetAlert needs a redo.
                ['R', 'Confirm ?????:%s ??s????????:%s ??s:%s ??:%s %m.confirm', 'SweetConfirm', 'Attention!', 'Do you really want to do this?', 'Yes', 'No', 'warning'],
                ['-'],
                [' ', 'Alert %s', 'alert', 'Imagine, Create, Share!'],
                ['r', 'Prompt %s', 'prompt', 'How are you?'],
                ['b', 'Confirm %s', 'confirm', 'Are you sure?']
			],
           	menus: {
                alerts: ['', 'success', 'error', 'warning', 'info'],
            	confirm: ['warning', 'info', '']
            }
		};
		
        ext.TGBox_in = function(title, description, callback) {
            if($("#TGBox").length) {
                if ($("#TGBox").css("left") !== "-247px") {
                    TGBox_out();
                }
                if ($("#TGBox").css("left") == "0px") {
                    setTimeout(function() {
                        TGBox_in_helper(title, description);
                    }, 1500);
                } else {
                    TGBox_in_helper(title, description);
                }
            } else {
                create_TGBox(title, description);
                TGBox_in_helper(title, description);
            }
            callback();
            $("#TGBox").click(function() {
                TGBox_out();
            });
        };
        
        ext.SweetAlert = function(title, description, type, callback) {
            swal({
                title: title,
                text: description,
                type: type,
                confirmButtonText: "Ok",
                confirmButtonColor: "#DD6B55"
            },
            function() {
            	callback();
            });
        };
    
        /*ext.SweetPrompt = function(title, description, placeholder, dflt, callback) {
            swal({
                type: "prompt",
                title: title,
                text: description,
                promptPlaceholder: placeholder,
                confirmButtonColor: "#DD6B55",
                promptDefaultValue: dflt
            }, function(value){
                callback(value);
            });
        };*/
    
    	ext.SweetConfirm = function(title, description, yes, no, type, callback) {
            swal({
                title: title,
                text: description,
                type: type,
                showCancelButton: true,
                confirmButtonText: yes,
                cancelButtonText: no,
                confirmButtonColor: "#DD6B55"
            }, function(isConfirm){
                  if (isConfirm) {
                      callback(true);
                  } else {
                  	  callback(false);
                  }
            });
        };
        
        ext.alert = function(str) {
            alert(str);
        };
        
        ext.prompt = function(str) {
            return prompt(str);
        };
        
        ext.confirm = function(str) {
            return confirm(str);
        };
	 
		ScratchExtensions.register('UI', descriptor, ext);
	})({});
}

TGB.installExtensionProgram = function () {
	(function(ext) {

		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 2, msg: 'Installed'};
		};

		var descriptor = {
			blocks: [
                ['r', 'Project Title', 'proj_title'],
            	['r', 'Project ID', 'proj_id'],
                ['r', 'Instructions', 'info'],
                ['r', 'Notes and Credits', 'notes'],
                ['-'],
                ['b', 'Shared?', 'shared'],
                ['b', 'Remix?', 'remixed'],
                ['-'],
            	['r', 'Amount of Sprites', 'sprites'],
            	['r', 'Amount of Scripts', 'scripts'],
                ['r', 'Amount of Comments', 'comments', ''],
            	['-'],
                ['r', 'View Mode', 'mode'],
            	[' ', 'Switch to %m.views mode', 'switch_to', 'Player'], 
                [' ', 'Fullscreen Switch', 'fullscreen'],
            	['-'],
            	['w', 'Set clipboard to %s', 's_clip', 'Support!'],
                //['r', 'Clipboard Data', 'r_clip'], Possibly impossible feature, make a pull request if you have any idea on how to do it!
            	['-'],
                ['r', 'Tab Title', 'title'],
                [' ', 'Set Tab Title to %s', 'set_tab', document.title],
                ['-'],
                ['w', 'Open %m.open %s', 'TGB_open', 'user profile of', data.project.creator],
                //[' ', 'Open Youtube video with ID:%s at x:%s y:%s', 'youtube', '0Bmhjf0rKe8', 0, 0], Disabled due to some strange bug that makes it not show the player.
            	['-'],
            	['h', 'when %b is true', 'whentrue'],
                [' ', '%s', '', 'Comment'],
                ['l', '%s', '', 'Comment']
			],
            
            menus: {
            	open: ["user profile of", "Project", "Discussion"],
            	views: ["Fullscreen", "Player", "Editor"],
        	},
		};

            ext.proj_title = function() {
                return (is_creator) ? document.getElementsByName("title")[0].value : document.getElementById("title").innerHTML;
            };
    
            ext.proj_id = function() {
                return project_id;
            };
    
            ext.info = function() {
                return Scratch.INIT_DATA.PROJECT.model.credits;
            };
    
            ext.notes = function() {
                return notes;
            };
            
            ext.shared = function() {
                return shared;
            };
        
            ext.remixed = function() {
                return remixed;
            };
    
            ext.sprites = function() {
                return $("#sprite-count").html();
            };
            
            ext.scripts = function() {
                return $("#script-count").html();
            };
        
            ext.comments = function() {
                n = $("h4:contains('Comments')").html();
                return n.substring(n.lastIndexOf("(")+1,n.lastIndexOf(")"));
            };
            
    		ext.mode = function() {
                var a = document.URL;
                var b = a.substr((a.length - 7), (a.length - 1));
                switch(b) {
                    case "lscreen":
                        return "Fullscreen";
                    case "#editor":
                        return "Editor";
                    default:
                        return "Player";
                }
    		};
    
            ext.switch_to = function(mode) {
                var url = document.URL;
                var hash = window.location.hash.toLowerCase();
                mode = mode.toLowerCase();
                
                if(mode == "fullscreen" || mode == "player" || mode == "editor") {
                    if(hash != "") {
                        window.location = url.replace(hash, '#' + mode);
                    } else {
                        window.location = url + '#' + mode;
                    }
                }
            };
    
            ext.fullscreen = function() {
                var url = document.URL;
                var hash = window.location.hash.toLowerCase();
                
                if(hash == "#player") {
                    window.location = url.replace(hash, '#fullscreen');
                }
                else if(hash == "#fullscreen") {
                	window.location = url.replace(hash, "#player");
                }
                else if (hash !== "#editor"){
                	window.location = url + "#fullscreen";
                }
            };
    
            ext.s_clip = function(str, callback) {
                swal({
                      title: "Clipboard",
                      text: "Do you want to copy '" + str + "' to your clipboard?",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Yes, copy it!"
                }, function(isConfirm){
                    if (isConfirm) {
                        GM_setClipboard(str);
                        callback();
                    } else {
                    	callback();
                    }
                });
            };
            
    		// I couldn't find a solution to read the clipboard without a paste event in Chrome, so I'll leave it disabled.
            /*ext.r_clip = function() {
                console.log(unsafeWindow.clipboardData.getData("Text"));
            	return unsafeWindow.clipboardData.getData("Text");
            }*/
        
            ext.title = function() {
                return document.title;
            };
            
            ext.set_tab = function(str) {
                document.title = str;
            };
        
            ext.TGB_open = function(type, src, callback) {
                switch(type) {
                    case "user profile of":
                        var new_type = "users";
                        break;
                    case "Project":
                        if(isNaN(src)) {
                            callback();
                        	return;
                        }
                        new_type = "projects";
                        break;
                    case "Discussion":
                        if(isNaN(src)) {
                            callback();
                        	return;
                        }
                        new_type = "discuss/topic";
                        break;
                }
                swal({
                      title: "Open" + (type == 'user profile of') ? 'User Profile' : type,
                      text: "Do you want to open '" + src + "' in a new tab?",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Yes, open it!"
                }, function(isConfirm){
                    if (isConfirm) {
                        window.open('http://scratch.mit.edu/' + new_type + '/' + src);
                        callback();
                    } else {
                    	callback();
                    }
                });
        	};
    
        	/*YTplayer;
            ext.youtube = function(videoID, x, y) {
                $("#YTplayer").remove();
                $(".stage").append('<div id="YTplayer"></div>');
                YT_style(x, y);
                YTplayer = new YT.Player('YTplayer', {
                    height: '360',
                    width: '480',
                    videoId: videoID,
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            };*/
            
            ext.when_true = function(bool) {return bool;};
     
		ScratchExtensions.register('Program & Web', descriptor, ext);
	})({});
}

TGB.installExtensionColor = function () {
	(function(ext) {

		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 2, msg: 'Installed'};
		};

		var descriptor = {
			blocks: [
                //['r', 'mix %c and %c', 'mix'], Needs a way to correctly convert scratch colors to other types.
            	//['r', '%m.rgb of %c', 'color2rgb', 'Red'], Needs a way to correctly convert scratch colors to other types.
                //['r', '%c', 'color'], No use for it until I manage to convert scratch colors to other formats successfully.
                ['r', 'Hex%s to color', 'hex2color', '#ffffff'],
                ['r', 'R:%s G:%s B:%s', 'rgb2color', 255, 255, 255],
			],
            
            menus: {
                rgb: ["Red", "Green", "Blue"],
        	},
		};
    		/*ext.color = function(a) {return a};
            //256^2*r + 256*g + b = RGB Integer
            ext.color2rgb = function(rgb,  integer) {
        		integer = (integer >= 0) ? integer : integer * -1;
                switch(rgb) {
                    case "Blue":
                        //return 16777216 - integer;
                        return integer >> 16;
                        //Math.floor(integer / 65536)
                        break;
                    case "Green":
                        return (integer - 16711680) >> 16;     //integer % 256;
                        break;
                    case "Red":
                        return integer >> 8;
                        //Math.floor(integer / 256) % 256;
                        break;
                }
            }*/
                
            ext.hex2color = function(s) {
                if(s.charAt(0) != '#') {
                    s = '#' + s;
                }
                if(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(s)) {
                    var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
                    var matches = patt.exec(s);
                    return 65536*parseInt(matches[1], 16) + 256*parseInt(matches[2], 16) + parseInt(matches[3], 16);
                } else {
                	console.log('Invalid hex color:' + s);
                }
            };
                
            ext.rgb2color = function(r, g ,b) {
                r = Number(r);
                g = Number(g);
                b = Number(b);
                if(r < 256 && g < 256 && b < 256) {
            		return 65536*r + 256*g + b;
                } else {
                    console.log('Invalid rgb color: rgb(' + r + ', ' + g + ', ' + b + ').');
                }
            };

            /*ext.mix = function(color1, color2) {
                //color_1 = $.Color(color2hex(color1));
				//color_2 = $.Color(color2hex(color2));
                //return hex2color(Color_mixer.mix(color_1, color_2));
                return ;
            };*/
     
		ScratchExtensions.register('Color', descriptor, ext);
	})({});
}

TGB.installExtensionUser = function () {
	(function(ext) {

		ext._shutdown = function() {};
        
		ext._getStatus = function() {
            return {status: 2, msg: 'Installed'};
		};

		var descriptor = {
			blocks: [
                ['r', 'User Language', 'get_lang', ''],
				['r', 'Unread Notifications', 'get_notifications'],
                ['-'],
                ['b', 'New Scratcher?', 'new_scratcher'],
                ['b', 'Creator?', 'creator'],
                ['b', 'Admin?', 'admin'],
                ['-'],
                ['b', 'Online?', 'online']
			],
		};

        ext.get_lang = function(callback) {
            return getCookie("scratchlanguage");
        };
        
        ext.get_notifications = function() {
            return $(".notificationsCount").html();
            // Old way. It was able to return if the user had a new message even before he knew it through the Scratch website,
            // but I don't think the potential extra load on Scratch Servers is not even close to be worth it.
        	/*$.get( "http://scratch.mit.edu/messages/ajax/get-message-count/", function(data) {
        		notifications = data.msg_count;
        		callback(notifications);
        	});*/
        };
                
        ext.new_scratcher = function() {
        	return !scratcher;
        };
        
        ext.creator = function() {
            return is_creator;
        }
                
        ext.admin = function() {
        	return admin;
        };
        
        ext.online = function() {
            if(contains(navigator.userAgent, "Firefox")) {
            	return online;
            } else {
            	return window.navigator.onLine;
            }
        };
	 
		ScratchExtensions.register('User', descriptor, ext);
	})({});
}

TGB.installExtensionSpeech = function () {
	(function(ext) {
		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 2, msg: 'Installed'};
		};

		var descriptor = {
			blocks: [
				['r', 'Voice', 'voice_lang'],
            	['-'],
				[' ', 'Set voice to %m.voices', 'set_voice', 'Google US English'],
            	[' ', 'Set voice to %n', 'set_voice'],
				[' ', 'Speak %s', 'speak_text', 'You are ' + data.user.username],
            	['-'],
            	[' ', 'Pause speech', 'pause_voice'],
                [' ', 'Resume speech', 'resume_voice'],
                [' ', 'Cancel speech', 'cancel_voice']
			],

			menus: {
				voices: _get_voices(),
			}
		};
     
        //This script was started by Sayamindu, I finished and improved it!
        lang = "Google US English";
        ext.voice_lang = function() {
            return lang;
        };
    
        ext.speak_text = function (text) {
            var say = new SpeechSynthesisUtterance(text.toString()),
            	voices = window.speechSynthesis.getVoices();
            say.voice = voices.filter(function(voice) { return voice.name == lang; })[0];
            speechSynthesis.speak(say);
        };
    
        ext.set_voice = function(gname) {
            var g = parseInt(gname, 10),
            	voices = speechSynthesis.getVoices();
            lang = (isNaN(g) === false) ? ((0 < g <= voices.length) ? voices[g - 1].name : console.log("Voice #" + g + " not found.")) : lang = gname;
        };
    
    	ext.pause_voice = function () {
            speechSynthesis.pause();
        };
        
        ext.resume_voice = function () {
            speechSynthesis.resume();
        };
        
        ext.cancel_voice = function () {
            speechSynthesis.cancel();
        };
        
        function _get_voices() {
            var ret = [];
            var voices = speechSynthesis.getVoices();
                
            for(var i = 0; i < voices.length; i++ ) {
                 ret.push(voices[i].name);
            }
            
            return ret;
        }
	 
		ScratchExtensions.register('Speech', descriptor, ext);
	})({});
}

TGB.installExtensionStrings = function () {
	(function(ext) {
        
		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 2, msg: 'Installed'};
		};

		var descriptor = {
			blocks: [
                ['r', 'Substring of %s starting at %n to %n', 'sub_string', 'Constructor', 1, 9],
                ['-'],
                ['b', '%s %m.str_checks %s', 'string_checks', 'Car Jack', 'contains', 'Jack'],
                ['r', '%m.str_functions %s', 'string_functions', 'Capitalize', 'scratch'],
                ['-'],
                //['r', 'Place %n that %s is in %s', 'nth_occurence', '2', 'can', 'Can a can can a can?'], "ToDo" block.
                ['r', 'Times %s is in %s', 'times_is_in', 'can', 'Can a can can a can?'],
                ['r', '%s find %s starting at position %n', 'find_starting_at', 'Apple', 'p', 3],
                ['-'],
                ['r', 'Replace letters %n to %n of %s with %s', 'replace_substr', 1, 5, "Hello World", "Hi"],
                ['r', 'Replace every %s with %s in %s', 'replace_every', 'u', 'a', 'cut'],
                ['r', 'Repeat %s %n times separated by %s', 'repeat', 'Scratch', 2],
                ['r', 'Pad %s with %s until it has length %n', 'pad', 1, 0, 2],
                ['-'],
                ['r', 'Word %n of %s', 'word', 2, 'Good Morning!'],
                ['r', 'Words in %s', 'word_amount', 'Scratch Day'],
                ['r', '# of word %s in %s', 'word_pos', 'year!', 'Happy new year!'],
                ['-'],
                ['r', 'Unicode of letter %n of %s', 'to_unicode', 1, 'Unicode'],
                ['r', 'Unicode %s as letter', 'from_unicode', 49],
                ['r', 'Binary of %s', 'toBinary', 'Scratch'],
                ['r', 'ASCII of %s', 'toAscii', '01000001']
			],

			menus: {
                str_checks: ["contains", "starts with", "ends with"],
            	str_functions: ["Capitalize", "Capitalize All Of", "Uppercase", "Lowercase", "Reverse", "Shuffle", "Trim blanks of"],
			}
		};

        ext.string_checks = function(str1, type, str2) {
            switch(type) {
                case "contains":
					return contains(str1, str2);
                case "starts with":
                    return startsWith(str1, str2);
                case "ends with":
                    return endsWith(str1, str2);
            }
        };
    
        ext.string_functions = function(type, str) {
           switch(type) {
               case "Capitalize":
                   return capitalizeFirstLetter(str);
               case "Capitalize All Of":
                   return capitalize(str);
               case "Uppercase":
                   return str.toUpperCase();
               case "Lowercase":
                   return str.toLowerCase();
               case "Reverse":
                   return reverse(str);
               case "Shuffle":
                   return shuffle(str);
               case "Trim blanks of":
                   return str.trim();
            }
        };
    
        ext.times_is_in = function(a, b) {
            return b.match(new RegExp(a, "g")).length;
        };
        
        ext.find_starting_at = function (a, b, c) {
            return a.indexOf(b, parseInt(c) - 1) + 1;
        };
    
        ext.sub_string = function(a, b, c) {
            return a.substring((b - 1), c);
        };
    
        ext.replace_substr = function(a, b, str, sub_string) {
            return str.substr(0, a - 1) + sub_string + str.substr(b);
        };
    
        ext.replace_every = function(a, b, str) {
            return str.split(a).join(b);
        };
    
        ext.repeat = function (str, times, sep) {
            if(times > 0) {
                times = Math.round(times);
                var result = str;
                for(i = 1; i < times; i++) {
                    result += sep + str;
                }
                return result;
            } else {
                return "";
            }
        };
    
    	//Chance.js Function
    	ext.pad = function (number, pad, width) {
            // Default pad to 0 if none provided
            pad = pad || '0';
            // Convert number to a string
            number = number + "";
            return number.length >= width ? number : new Array(width - number.length + 1).join(pad) + number;
   		 };
    
        ext.word = function(n, str) {
            if(!isNaN(n)) {
                n = Math.round(n);
                var words = str.split(" ");
                return words[n - 1];
            } else {
                return "";
            }
        };
        
        ext.word_amount = function(str) {
            return str.split(" ").length;
        };
        
        ext.word_pos = function(word, str) {
            console.log(str.split(" "));
            return str.split(" ").indexOf(word) + 1;
        };
    	
        ext.to_unicode = function(n, str) {
          return str.charCodeAt(n-1);
        };
        
        ext.from_unicode = function(u) {
          if(u < 1) {
              return 'undefined';
          }
          return String.fromCharCode(Number(u));
        };
    
        ext.toAscii = function(bin) {
            return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
                return String.fromCharCode(parseInt(bin, 2));
            });
        };
    
        zeroPad = function(num) {
            return "00000000".slice(String(num).length) + num;
        };
        
        ext.toBinary = function(str, spaceSeparatedOctets) {
            return str.replace(/[\s\S]/g, function(str) {
                str = zeroPad(str.charCodeAt().toString(2));
                return (!1 == spaceSeparatedOctets) ? str : str + " ";
            });
        };
    
		ScratchExtensions.register('Strings', descriptor, ext);
	})({});
};

TGB.installExtensionSensing = function () {
	(function(ext) {
		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 1, msg: 'May be Laggy'};
		};
        
        if(keyDetection === false) {
            $(document).on("keyup keydown", function(e) {
                switch(e.type) {
                    case "keydown" :
                        keysPressed[e.keyCode] = true;
                        break;
                    case "keyup" :
                        keysPressed[e.keyCode] = false;
                        break;
                }
            });
            
            function isKeyPressed(code) {
                return keysPressed[code];
            }
            
            function menuCheck(key) {
                switch(key) {
                    case 'shift':
                        return isKeyPressed(16);
                    case 'ctrl':
                        return isKeyPressed(17);
                    case 'enter':
                        return isKeyPressed(13);
                    case 'backspace':
                        return isKeyPressed(8);
                    case 'alt':
                        return isKeyPressed(18);
                    case 'tab':
                        return isKeyPressed(9);
                    case 'caps':
                        return isKeyPressed(20);
                    case 'esc':
                        return isKeyPressed(27);
                    case 'any':
                        return keysPressed.indexOf(true) > -1;
                    default:
                        return isKeyPressed(key_code.charCodeAt(0));
                }
            }
            keyDetection = true;
        }
        
		var descriptor = {
			blocks: [
                ['h', 'when key %m.keys is pressed', 'h_check_key', 'shift'],
                ['-'],
                ['b', '%m.keys key pressed?', 'check_key', 'shift'],
                ['b', '%n key pressed?', 'check_key', 17],
                ['-'],
                ['r', 'Which key is pressed?', 'which_key']
			],
                
            menus: {
                keys: ['shift', 'ctrl', 'enter', 'backspace', 'alt', 'tab', 'caps', 'esc', 'any'],
            }
		};
     
        last_h_value = false;
    
        ext.h_check_key = function(key) {
            if(!last_h_value && menuCheck(key) == true) {
				last_h_value = true;
                return true;
            } else {
                last_h_value = false;
                return false;
            }
        };
    
    	ext.check_key = function(key_code) {
            if (isNaN(Number((key_code)))) {
				return menuCheck(key_code);
            } else {
				return isKeyPressed(key_code);
            }
        };

        ext.which_key = function() {
            key = keysPressed.indexOf(true);
            return key;
        };
	 
		ScratchExtensions.register('Sensing', descriptor, ext);
	})({});
};

TGB.installExtensionDate = function () {
	(function(ext) {
		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 2, msg: 'Installed'};
		};

		var descriptor = {
			blocks: [
				['r', 'UTC %m.types', 'UTC', 'Hours'],
				['r', 'User GMT Timezone Offset', 'timezone'],
			],

			menus: {
				types: ["Hours", "Minutes", "Seconds", "Day of the Week", "Date", "Month", "Year"],
			}
		};
     
         ext.UTC = function(type) {
            var d = new Date();
            switch(type) {
                case "Milliseconds":
                    return d.getUTCMilliseconds();
                case "Seconds":
                    return d.getUTCSeconds();
                case "Minutes":
                    return d.getUTCMinutes();
                case "Hours":
                    return d.getUTCHours();
                case "Date":
                    return d.getUTCDate();
                case "Month":
                    return d.getUTCMonth();
                case "Year":
                    return d.getUTCFullYear();
                case "Day of the Week":
                    switch (d.getDay()) {
                        case 0:
                            day = "Sunday";
                            break;
                        case 1:
                            day = "Monday";
                            break;
                        case 2:
                            day = "Tuesday";
                            break;
                        case 3:
                            day = "Wednesday";
                            break;
                        case 4:
                            day = "Thursday";
                            break;
                        case 5:
                            day = "Friday";
                            break;
                        case 6:
                            day = "Saturday";
                            break;
                    }
                    return day;
            }
        };
        
        ext.timezone = function() {
            var d = new Date();
            return d.getTimezoneOffset();
        };

		ScratchExtensions.register('Date', descriptor, ext);
	})({});
};

TGB.installExtensionData = function () {
	(function(ext) {

		ext._shutdown = function() {};

		ext._getStatus = function() {
			return {status: 2, msg: 'Installed'};
		};

		var descriptor = {
			blocks: [
				['r', 'Counter %s', 'counter', 'Help'],
                ['r', 'Cookie %s', 'cookie', '!Cookie'],
                ['-'],
                [' ', 'Set counter %s to %s', 's_counter', 'Score', 10],
                [' ', 'Increase counter %s by %s', 'i_counter', 'Score', 1],
                [' ', 'Reset counter %s', 'r_counter', 'Score'],
                [' ', 'Reset all counters', 'r_all_counters'],
                ['-'],
                [' ', 'Set cookie %s to %s', 's_cookie', 'Level', 1],
                [' ', 'Increase cookie %s by %s', 'i_cookie', 'Level', 1],
                [' ', 'Delete cookie %s', 'd_cookie', 'Level'],
                [' ', 'Delete all cookies', 'd_all_cookies']
			]
		};
                
        //Holder
        Tips = ["You can use counters as local variables!", "To open Project and Discussion pages you have to use their respective ID's."];
        counters = {Help: Tips};
        
        //Blocks
        ext.counter = function(name) {
            if(name != 'Help' || counters.Help != Tips) {
                return counters[name];
            } else {
                return math.pickRandom(counters.Help);
            }
        };
        
        ext.cookie = function(name) {
            if (storage) {
                return storage[name];
            }
        };
        
		ext.s_counter = function(name, val) {
            if(Object.keys(counters).length <= 50001) {
                /*if(is_creator) {
                    console.log("Counter '" + name + "' set to '" + val + "'.");
                }*/
                counters[name] = val;
            } else {
                if(is_creator) {
                	console.log("Too many counters.");
                }
            }
        };
        
        ext.i_counter = function(name, val) {
            if(Object.keys(counters).length <= 50001) {
            	/*if(is_creator) {
            		console.log("Counter '" + name + "' increased by '" + val + "'.");
            	}*/
                if(typeof counters[name] != "undefined") {
        			counters[name] += val;
                } else {
                    counters[name] = val;
                }
            }
            else if(is_creator) {
                console.log("Too many counters.");
            }
        };
        
        ext.r_counter = function(name) {
            /*if(is_creator) {
            	console.log("Counter '" + name + "' was reseted.");
            }*/
            delete counters[name];
        };
        
        ext.r_all_counters = function() {
            /*if(is_creator) {
                console.log("All counters were reseted.");
            }*/
            counters = {Help: Tips};
        };
        
		ext.s_cookie = function(name, val) {
            if(storage) {
                if(storage.length <= 500) {
                    /*if(is_creator) {
                        console.log("Cookie '" + name + "' set to '" + val + "'.");
                    }*/
                    storage.setItem(name, val);
                } else {
                    if(is_creator) {
                        console.log("Too many cookies.");
                    }
                }
            }
        };
        
        ext.i_cookie = function(name, val) {
            if(storage) {
                if(storage.length <= 500) {
                    /*if(is_creator) {
                        console.log("Cookie '" + name + "' increased by '" + val + "'.");
                    }*/
                    if(typeof storage[name] != "undefined") {
                        if(isNaN(val) || isNaN(storage[name])) {
                        	storage[name] += val;
                        } else {
                            storage[name] = Number(storage[name]) + Number(val);
                        }
                    } else {
                        storage.setItem(name, val);
                    }
                }
                else if(is_creator) {
                    console.log("Too many cookies.");
                }
            }
        };
        
        ext.d_cookie = function(name) {
            if(storage) {
                /*if(is_creator) {
                    console.log("Cookie '" + name + "' was deleted.");
                }*/
                storage.removeItem(name);
            }
        };
        
        ext.d_all_cookies = function() {
            if(storage) {
                /*if(is_creator) {
                    console.log("All cookies were deleted.");
                }*/
                storage.clear();
            }
        };
                 
		ScratchExtensions.register('Data', descriptor, ext);
	})({});
};

waitfor(SWFready.isResolved, true, 100, function() {
    extensions = Object.getOwnPropertyNames(TGB).sort();
    if(!is_creator) {
        OWstr = $('.overview').html();
        extensionSpecified = OWstr.search(/\[?((\w|\&| |,){1,})\]/) > -1;
    }
    
    try {
        if(extensionSpecified) {
            chosenExtensions = OWstr.replace(/.(?!(\[???((\w|\&| |,){1,})?\]))/g ,'');
            chosenExtensions = chosenExtensions.slice(chosenExtensions.indexOf('?') + 1).split(',');
            for(a in chosenExtensions) {
                chosenExtensions[a] = chosenExtensions[a].trim();
                if(extensions.indexOf('installExtension' + chosenExtensions[a]) === -1) {
                    extensionSpecified = false;
                    break;
                }
            }
    	}
    } catch(e) {}

    setTimeout(function() {
        swal({
            title: "Load TGB's Extension?",
            text: "If so, wait until the project finishes loading\n and then click on the \"Yes!\" button.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: 'No! :(',
            closeOnConfirm: false
        }, function(isConfirm){
            if(isConfirm) {
                swal({
                    title: "Loading...",
                    text: "Loading TGB's Extensions",
                    type: "info",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok!",
                });
                setTimeout(function() {
                    console.log('Loading Extensions...');
                    try {
                        if(extensionSpecified) {
                            for(i in chosenExtensions) {
                                console.log('Installing extension ' + chosenExtensions[i]);
                                TGB['installExtension' + chosenExtensions[i]]();
                            }
                        } else {
                            for(i in extensions) {
                            	console.log('Installing extension ' + extensions[i].slice(16));
                            	TGB[extensions[i]]();
                        	}
                        }
                    } catch(e) {
                        for(i in extensions) {
                            console.log('Installing extension ' + extensions[i].slice(16));
                            TGB[extensions[i]]();
                        }
                    }
                    console.log('Extensions loaded!');
                    swal({title: "Yay!", text: "The extension was successfully installed!", timer: 1000, type: "success"});
                }, 50);
            }
        });
    });
    
    if(Scratch.FlashApp.model.attributes.isPublished == false) {
        JSsetProjectBanner((Scratch.FlashApp.isEditMode) ? 'To share projects using this extension you have to click the "Share" button found on the <a href="' + 'http://scratch.mit.edu/projects/' + Scratch.FlashApp.model.id + '">Project Page</a>.' : 'To share projects using this extension you have to click the "Share" button found on this page.');
    }
    
    overviewHtml = ($('#info textarea').html() === null) ? $('.overview::lt(1)').html() : $('#info textarea').html();
    searchAddition = (overviewHtml.search(/&lt;?\d{1}|\d{2}&gt;/) < 0) ? false : (overviewHtml.search(/&lt;?\d{1}&gt;/) > -1) ? overviewHtml.search(/&lt;?\d{1}&gt;/) : overviewHtml.search(/&lt;?\d{2}&gt;/);
    numberAddition = (overviewHtml.search(/&lt;?\d{1}&gt;/) > -1) ? Number(overviewHtml.charAt(searchAddition + 5)) : Number(overviewHtml.substr(searchAddition + 5, searchAddition + 6));
    
    if(searchAddition != false) {
        if(overviewHtml.search(/&lt;?\d{1}&gt;/ > -1)) {
			$('.overview::lt(1)').html(overviewHtml.replace(overviewHtml.slice(searchAddition).slice(0, 10), ''));
        } else {
			$('.overview::lt(1)').html(overviewHtml.replace(overviewHtml.slice(searchAddition).slice(0, 11), ''));
        }
        $('textarea[name=content]').focus( function(){
            JSsetProjectBanner(commentAddition[numberAddition - 1]);
        });
    }
});