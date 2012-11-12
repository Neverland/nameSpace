/*
 * toolkit lib v1.0
 *
 * Copyright 2011, GuoAimin
 * Includes toolkit lib
 * Date: 2011-9-14
 * lastmodified: 2011-11-20
 *http://bluescript.iteye.com/
 */


/*
 *     类名：[toolKit]
 *     功能：核心组件
 *     作用：微型类库
 */
!function (window, doc, undefined) {
	var toolKit = function () {
		var indicator = arguments.callee, doc = document, that = this;
		Object.keys || (Object.keys = function (o) {
			var t = [];
			for (t[t.length] in o);
			return t;
		});
		indicator.prototype = {
			init:function () {
				indicator._Elements_ = {};
				indicator._Elements_.fn = {};
			}(),
			slice:([]).slice,
			is:function (o) {
				return ({}).toString.call(o).slice(8, -1);
			},
			each:function (object, callback) {
				var index, i = 0, len = object.length >>> 0, isO = ({}).toString.call(object).slice(8, -1) === 'Object';
				if (isO) {
					for (index in object) {
						if (callback.call(object[index], object[index], index) === false) {
							break;
						}
					}
				} else {
					for (; i < len;) {
						if (object.hasOwnProperty(i) && callback.call(object[i], object[i], i++) === false) {
							break;
						}
					}
				}
			},
			extend:function (sub, sup) {
				var _proto_ = sup.prototype

				function F() {
				}

				F.prototype = _proto_;
				sub.prototype = new F();
				sub.prototype.constructor = sub;
				sub._super_ = _proto_;
				_proto_.constructor !== sup && (_proto_.constructor = sup);
			},
			toArray:function (o) {
				return that.slice.call(o);
			},
			getHtmlElement:function (O, attrs) {
				if (typeof O !== 'string') return;
				var fn = arguments.callee,
					elem,
					setStyle = function (str) {
						elem.style.cssText = str;
					};
				fn.element || (fn.element = {});
				fn.element[O] || (fn.element[O] = doc.createElement(O));
				elem = fn.element[O].cloneNode(true);
				if (this.is(attrs) === 'Object') {
					this.each(attrs, function (a, b) {
						switch (b) {
							case 'style':
								setStyle(a);
								break;
							case 'class':
								elem.className = b;
								break;
							case 'for':
								elem.htmlFor = b;
								break;
							case 'html':
								elem.innerHTML = b;
								break;
							default:
								elem.setAttribute(b, a);
						}
					});
				}
				return elem;
			},
			getEvent:function (e) {
				return e || window.event;
			},
			getTarget:function (e) {
				return e.srcElement || e.target;
			},
			stopEvent:function (e) {
				e.returnValue && (
					e.returnValue = false,
						e.cancelBubble = false
					);
				e.preventDefault && (
					e.preventDefault(),
						e.stopPropagation()
					);
			},
			contains:function (a, b) {
				try {
					return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b))
				} catch (e) {
				}
			},
			getViewportSize:function () {
				var value = [0, 0];
				undefined !== window.innerWidth ? value = [window.innerWidth, window.innerHeight] : value = [document.documentElement.clientWidth, document.documentElement.clientHeight];
				return value;
			},
			getClinetRect:function (f) {
				var d = f.getBoundingClientRect(), e = (e = {left:d.left, right:d.right, top:d.top, bottom:d.bottom, height:(d.height ? d.height : (d.bottom - d.top)), width:(d.width ? d.width : (d.right - d.left))});
				return e;
			},
			getScrollPosition:function () {
				return [

					window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
					window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
				];
			},
			getOffsetXY:function (o) {
				if (!o || o.nodeType !== 1) {
					return -1
				}
				var x = 0, y = 0;
				while (o.offsetParent) {
					x += o.offsetLeft;
					y += o.offsetTop;
					o = o.offsetParent;
				}
				return [x, y];
			},
			addEvent:function (elem, evType, fn, capture) {
				if (!elem) return;
				var
				f,
				indicator = arguments.callee;
				that = this,
				call = function () {
					typeof(fn) === 'function' && fn.apply(elem, arguments);
				};

				indicator.fn || (indicator.fn=function(){
					var self=arguments.callee ,fn ,that=this;
					fn=self.prototype;
					fn.constructor=self;
					fn.factory=function (a, b, c, d) {
						a._eIndex=that.id();
						console.log(a._eIndex);
						return [
							this.a = a || {},
							this.b = b,
							this.c = typeof (call) === 'function' ? call : function () {},
							this.d = d || false
						];
					};
					fn.id=function(){
						self.index ||( self.index = 0);
						return '_'+(self.index++);
					};
					fn.fire= window.addEventListener ? (function (a, b, c, d) {
						a.addEventListener(b, c, d || false);
					}) : (
				        window.attachEvent ?
						(function (a, b, c, d) {
							a.attachEvent('on' + b, c);
						})
						:
						(function (a, b, c, d) {
							a['on' + b] = c;
						})
					)
				});
				f=(indicator._FN_ || (indicator._FN_=new indicator.fn()));

				f.fire.apply(null,new f.factory(elem, evType, fn, capture));
				/*indicator.factory || (indicator.factory = function (a, b, c, d) {
					return [
						this.a = a || {},
						this.b = b,
						this.c = typeof (call) === 'function' ? call : function () {},
						this.d = d || false
					];

				});

				(indicator._FN_ || (indicator._FN_ = window.addEventListener ? (function (a, b, c, d) {
					a.addEventListener(b, c, d || false);
				}) : (
					window.attachEvent ?
					(function (a, b, c, d) {
						a.attachEvent('on' + b, c);
					})
					:
					(function (a, b, c, d) {
						a['on' + b] = c;
					})
				))).apply(null,new indicator.factory(elem, evType, fn, capture));*/
				return that;
			},
			removeEvent:function (elem, evType, fn, capture) {
				var arg = arguments,
					that = this;
				(that.removeEvent = elem.removeEventListener ? (function (elem, evType, fn) {
					elem.addEventListener(evType, fn, capture || false);
					return that;
				}) : (
					elem.attachEvent ?
						(function (elem, evType, fn) {
							elem.detachEvent('on' + evType, fn);
							return that;
						})
						:
						(function (elem, evType, fn) {
							elem['on' + evType] = null;
							return that;
						})
					)).apply(elem, arg);
				/*var indicator = arguments.callee;
				 if (elem.removeEventListener) {
				 (indicator = function (elem, evType, fn) {
				 elem.removeEventListener(evType, fn, capture || false);
				 return that;
				 }).apply(elem, arguments);
				 } else if (elem.detachEvent) {
				 (indicator = function (elem, evType, fn) {
				 elem.detachEvent('on' + evType, fn)
				 return that;
				 }).apply(elem, arguments);
				 } else {
				 (indicator = function (elem, evType, fn) {
				 elem['on' + evType] = null;
				 return that;
				 }).apply(elem, arguments);
				 }
				 return this;*/
			},
			style:function (elem, property, fn) {
				if (!elem.nodeType) {
					return -1;
				}
				var indicator = arguments.callee, temp;
				indicator._FN_ = elem.currentStyle ?
					function (a, b) {
						return a.currentStyle[b];
					} :
					function (a, b) {
						return document.defaultView.getComputedStyle(a, null)[b];
					};
				return indicator._FN_.apply(null, arguments);
			},
			ready:function (fn) {
				typeof(fn) === 'function' && setTimeout(fn, 0);
				/*var delay;
				 /^loade|c/.test(document.readyState) ? delay = setTimeout(function () {
				 arguments.callee.apply(null, arguments)
				 }, 50) : delay && clearTimeout(delay), setTimeout(fn, 1);*/
			},
			dynamicScriptProxy:function (src, data, callback, name) {
				var doc = document, script = doc.createElement('script'), timestamp = +(new Date()), keygen = 'abcdefghijk', key = Math.random().toFixed(1) * 10, method = keygen[key] + timestamp, name = name || 'callback';
				//src += src.indexOf('?') > 0 ? '' : '?',
				this.is(data) === 'Array' ?
					(

						this.is(data) === 'Array' && (src += data.join(','))

						)
					:
					(


						this.each(data, function (a, b) {
							src += a + '=' + data[a] + '&';
						})

						);
				//src +=name+'=' + method + '&';
				//src += 'timestamp=' + timestamp;
				if (typeof callback == 'function') {
					window[name] = function () {
						try {
							callback.apply(this, arguments);
						} catch (e) {
							throw new Error(e);
						} finally {
							window[method] = null;
							if (script.attributes.length > 0) {
								for (var j in script) {

									/*if(script.hasOwnProperty(j)){*/
									try {
										script.removeAttribute(script[j]);
									} catch (e) {
									}
									/*}*/
								}
							}
							if (script && script.parentNode) {
								script.parentNode.removeChild(script);
							}
						}
					}
				}
				script.setAttribute('type', 'text/javascript');
				script.setAttribute('src', src);
				doc.getElementsByTagName('head')[0].appendChild(script);
			},
			trigger:function (elem, evType) {//封装模拟用户行为的方法。
				var event, doc = document;
				undefined !== doc.createEvent ? (event = doc.createEvent('MouseEvents'), event.initMouseEvent(evType, true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null), elem.dispatchEvent(event)) : (event = doc.createEventObject(), event.screenX = 100, event.screenY = 0, event.clientX = 0, event.clientY = 0, event.ctrlKey = false, event.altKey = false, event.shiftKey = false, event.button = false, elem.fireEvent('on' + evType, event));
			},
			duffsDevice:function (items, fn) {
				if ('function' !== typeof(fn)) return;
				var iterations = items.length % 8, i = items.length - 1, callback = fn;
				while (iterations) {
					callback(items[i--]);
					iterations--;
				}
				iterations = Math.floor(items.length / 8);
				while (iterations) {
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					callback(i--, items[i]);
					iterations--;
				}
			},
			getCursortPosition:function (ctrl) {
				ctrl.focus();
				var CaretPos = 0;   // IE Support
				if (document.selection) {
					ctrl.focus();
					var Sel = document.selection.createRange();
					Sel.moveStart('character', -ctrl.value.length);
					CaretPos = Sel.text.length;
				}

				// Firefox support
				else if (ctrl.selectionStart || ctrl.selectionStart == '0')

					CaretPos = ctrl.selectionStart;
				return (CaretPos);
			},
			setCaretPosition:function (ctrl, pos) {
				if (ctrl.setSelectionRange) {
					ctrl.focus();
					ctrl.setSelectionRange(pos, pos);
				}
				else if (ctrl.createTextRange) {
					var range = ctrl.createTextRange();
					range.collapse(true);
					range.moveEnd('character', pos);
					range.moveStart('character', pos);
					range.select();
				}
			},
			getElementsByTagNames:function (list, obj) {
				if (!obj) var obj = document;
				var tagNames = list.split(',');
				var resultArray = new Array();
				for (var i = 0; i < tagNames.length; i++) {
					var tags = obj.getElementsByTagName(tagNames[i]);
					for (var j = 0; j < tags.length >>> 0; j++) {
						resultArray.push(tags[j]);
					}
				}
				var testNode = resultArray[0];
				if (!testNode) return [];
				if (testNode.sourceIndex) {
					resultArray.sort(function (a, b) {
						return a.sourceIndex - b.sourceIndex;
					});
				}
				else if (testNode.compareDocumentPosition) {
					resultArray.sort(function (a, b) {
						return 3 - (a.compareDocumentPosition(b) & 6);
					});
				}
				return resultArray;
			},
			getElementsByClassName:doc.getElementsByClassName ? function (className) {
				return   doc.getElementsByClassName(className);
			} : function (className, parentNode) {
				var parentNode = parentNode || doc, elem = parentNode.getElementsByTagName('*'), i = elem.length, node = [], reg = /(^|\s)className(\s|$)/gi, temp;
				for (; i--; (

					temp = elem[i],
						reg.test(temp) && (node.push(temp))

					)) {
				}
				return node;
			}

		};
		if (window === this || 'indicator' in this) {
			return new indicator;
		}
	}();
	this.tk || (this.tk = toolKit);
}(window, document);



