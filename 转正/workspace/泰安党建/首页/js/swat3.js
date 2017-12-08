/*********************************************************************

	SCUMiX(R) SWAT JavaScript Library
	swat3.js

	author: scumyang@163.com
	create: 2009-04-21

	notes:
	DOM 元素主要扩展属性:
		exDragable	: 1-允许拖动
		exDragDir	: 'LRUD'-拖动锁定方向
		exSizable	: 1-允许调整尺寸
		exHotPos	: 'LRTB'-调整尺寸时的锁定方向
		exTopOnDrag	: 1-拖动时提到最上层(结束拖动后恢复)

	内部 zIndex 分配:
		0-5: 普通
		6: 可交互子组件
		7: Group
		9: Popup 组件

	update:
		2009-04-21: base code.
		2009-04-26: 全局抽象化.
		2009-04-30: +ajax, +webservice, +xmldoc.
		2009-05-02: *全局动画队列, 单定时器.
		2009-05-11: +工具函数.
		2009-09-03: *drag resize 时可锁定方向(上下左右).
		2009-09-15: +newClass(), 创建类.
					+全局标识计数.
					+bind().实现动态绑定上下文.
		2009-09-16: *_doc_mouseup(), 修正 zIndex 无法恢复问题.
					+defaultValue(), 取默认值.
		2009-09-18: +ptIn(), 检测事件是否发生在元素区域内.
		2010-06-01: *animPlay(), left,top,width,height + 'px' 以支持 non-IE.
		2010-10-15: *init(), 修正传入无效的 P 会出错的 bug.
					+focus().
		2010-10-30: *css(), 修正传入值类型为字符串时的计算错误.
		2010-11-02: +eachOption(), 遍历 select 条目.
		2010-11-11: +swapNode(), 兼容非 IE 浏览器的节点交换.
		2011-08-15: +urlParam, URL 参数处理.
		2011-08-26: *_doc_mousemove, 修改了 resize 时的方向计算方法.
		2011-10-19: *exHotPos 改为 exSizeDir.
		2012-12-10: +comp.ignoreDragElem, 指明应忽略拖动的元素.
		2012-12-12: +event(), 绑定事件到对象.
		2012-12-31: *getTarget(), 增加对 getEvent() 失败时的处理.
		2013-01-13: 添加验证类 validate.
		2013-01-14: *makeGlobalId, 增加随机数尾缀.
		2014-01-11: +htmlDecode, htmlEncode, 字符串内的 HTML 标签与逸码互转.
		2014-11-22: +newUniqueId(), 获取唯一序列号

*********************************************************************/

//------------------------------------------------------------------------------
// 全局
//------------------------------------------------------------------------------
Function.prototype.bind = function( O )
{
	var foo = this, iNodeItem;
   	if( window._g_bindThis == null ) _g_bindThis = [];
   	_g_bindThis.push( O );
   	iNodeItem = _g_bindThis.length - 1;
   	O = null;
	var A = arguments;
	return function( E )
   	{
		return foo.call( _g_bindThis[iNodeItem], E||window.event, A );
   	}
}

//n: 从 0 开始的索引
//Array.prototype.remove = function( n )
//{
//	return n < 0 ? this : this.slice( 0, n ).concat( this.slice( n + 1, this.length ));
//}

//
// 伪类
//
var Class =
{
	create: function()
	{
		return function(){ this.constructor.apply( this, arguments ); }
	}
}

//
// 命名空间
//
var Namespace = new Object();
Namespace.register = function( ns )
{
    var a = ns.split('.');
    var e = "";
    var t = "";
    for( var i=0; i<a.length; i++ )
    {
        if( i != 0 ) t += ".";
        t += a[i];
        e += "if( typeof(" + t + ") == 'undefined') " + t + " = new Object();"
    }
    if( e ) eval( e );
}

//
// 基本对象扩展
//
String.prototype.trim = function( F, T, O, R )
{
	F = F || ' ';
	O = O || 'g';
	var r = R || new RegExp( '^' + F + '*|' + F + '*$', O );
	return this.replace( r, T || '' );
}

String.prototype.trimHtml = function()
{
	return this.replace( /<[^>]+>/gi, '' );
}

String.prototype.htmlEncode = function( S )
{
	return this
		.replace( /&/g, "&amp;" )
		.replace( /</g, "&lt;")
		.replace( />/g, "&gt;")
		.replace( /\s/g, "&nbsp;" )
		.replace( /\"/g, "&quot;" )
		;
}

String.prototype.htmlDecode = function()
{
	return this
		.replace( /&amp;/g, "&" )
		.replace( /&lt;/g, "<")
		.replace( /&gt;/g, ">")
		.replace( /&nbsp;/g, " " )
		.replace( /&quot;/g, '"' )
		;
}

String.prototype.br2nl = function()
{
	return this
		.replace( /<br[^>]*>/gi, "\n" )
		.replace( /<p>|<\/p>/gi, "" );
}

String.prototype.nl2br = function()
{
	return this.replace( /\n+/gi, "<br/>" );
}

Date.prototype.setSyncSeed = function( S )
{
	Date.prototype._syncSeed = S - this.getTime();
}

Date.prototype.getRealTime = function()
{
	return this.getTime() + this._syncSeed;
}

Date.prototype.format = function( F )
{
	F = F || 'YYYY-mm-dd HH:ii:ss';
	var o =
	{
		"m+" : this.getMonth() + 1,	//月
		"d+" : this.getDate(),		//日
		"H+" : this.getHours(),		//时
		"i+" : this.getMinutes(),	//分
		"s+" : this.getSeconds(),	//秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), //季
		"S+" : this.getMilliseconds()	//毫秒
	};

	if( /(Y+)/.test( F )) F = F.replace( RegExp.$1, ( this.getFullYear() + "" ).substr( 4 - RegExp.$1.length ));
	for( var K in o )
	{
		if( new RegExp( "(" + K + ")" ).test( F ))
			F = F.replace( RegExp.$1, ( RegExp.$1.length == 1 ) ? (o[K]) : ( ( ( K == 'S+' ? '000' : '00' ) + o[K] ).substr(( "" + o[K]).length )));
	}
	return F;
}

Date.prototype.addDays = function( D )
{
	this.setDate( this.getDate() + D );
};

Date.prototype.addWeeks = function( W )
{
	this.addDays( W * 7 );
};

Date.prototype.addMonths= function( M )
{
	var d = this.getDate();
	this.setMonth( this.getMonth() + M );

	if( this.getDate() < d ) this.setDate(0);
};

Date.prototype.addYears = function( Y )
{
	var m = this.getMonth();
	this.setFullYear( this.getFullYear() + Y );

	if( m < this.getMonth()) this.setDate(0);
};

Date.prototype.diff = function( A, DT )
{
	switch( A )
	{
		case "s":   // 秒
			return parseInt((DT-this)/1000);
		case "m":   // 分
			return parseInt((DT-this)/60000);
		case "h":   // 时
			return parseInt((DT-this)/3600000);
		case "D":   // 日
			return parseInt((DT-this)/86400000);
		case "w":   // 周
			return parseInt((DT-this)/(86400000*7));
		case "M":   // 月
			return (DT.getMonth()+1)+((DT.getFullYear()-this.getFullYear())*12)-(this.getMonth()+1);
		case "Y":   // 年
			return DT.getFullYear()-this.getFullYear();
		default:    // 无效
			return undefined;
	}
}

//
// 备用取元素
//
function $E( id )
{
	// 多个元素, 则返回元素数组
	if( arguments.length > 1 )
	{
		for( var i=0, e=[], len=arguments.length; i<len; i++ ) e.push( $( arguments[i] ));
		return e;
	}

	// 本身是元素则直接返回
	if( typeof( id ) == 'object' ) return id;

	// 取元素
	if( document.getElementById ) return document.getElementById( id );
	return undefined;
}

/*
 * swat3 主对象
 *
 * 原型:
 *		swat( selector, param )
 * 参数:
 *		selector		- 选择器.
 *		param			- 参数. 指定起始节点, 若无则以 document 为起始节点.
 * 例:
 * swat('*img')			: 选择所有 <img> 元素.
 * swat('img1')			: 选择 id 为 img1 的元素.
 * swat('img1,div1')	: 选择 id 为 img1 和 div1 的元素.
 * swat('*div,*p,img1')	: 选择所有 <div> 及 <p> 元素, 和 id 为 img1 的元素.
 * swat('*div,id1','box')	: 选择 box 内所有 <div> 元素和 id 为 id1 的元素.
 *
*/

(function()
{
	var G = this,
		gI = G.swat,
		I = G.swat = G.$ = function( S, P ){ return new I.fn.init( S, P ) };

	I.version = 3.2;
	I.copyright = 'SCUMiX(R) SWAT JavaScript Toolkit';
	I.build = '3.3.0.0(20090430-20141122)';
	I.uniqueId = 1;

	I.instCounter = 1;

	// 实例原型函数
	I.fn = I.prototype =
	{
		// 初始化新实例
		init: function( S, P )
		{
			this.instCounter = I.instCounter++;
			this.hash = '';
			this.isSwatInst = true;
			this.idata = {}
			this.token = S;

			S = S || document;
			if( typeof P == "string" ) P = $E( P );
			P = P || document;

			// 若为 swat 实例
			if( S.isSwatInst ) return S;

			// 若为 DOM 对象
			if( S.nodeType )
			{
				this[0] = S;
				this.length = 1;
				this.context = S;
				this.hash = S.id;
				return this;
			}

			if( typeof S == "string" )
			{
				var it = S.split( "," ), id, e, oid = 0;
				for( var i=0; i<it.length; i++ )
				{
					if( !it[i] ) continue;
					if( /^\*/.test( it[i] ))
					{
						var id = it[i].slice( 1 );
						var e = P.getElementsByTagName( id );
						for( var j=0; j<e.length; j++ )
						{
							this[oid++] = e[j];
							this.hash += e[j].id;
						}
					}
					else
					{
						var e = document.getElementById( it[i] );
						this[oid++] = e;
						if( e ) this.hash += e.id;
					}
					this.length = oid;
				}
				return this;
			}
			else
			{
				this[0] = S;
				this.length = 1;
				this.context = S;
				this.hash = S.id;
				return this;
			}
		},

		// 迭代执行
		each: function( O, F )
		{
            return I.each( this, O, F );
        },

		// 取关联 DOM 元素
		get: function( O )
		{
			return O === gI ? I.toArray( this ) : this[ O || 0 ];
		},

		// 替换关联 DOM 元素
		set: function( D )
		{
			this.length = 0;
			Array.prototype.push.apply( this, D );
			return this;
		},

		// 取关联元素的属性
		attr: function( A, V )
		{
			var l = this.length;
			if( !l ) return null;
			if( arguments.length == 1 )
			{
				if( l == 1 ) return this[0].getAttribute( A );
				var r = [];
				for( var i=0; i<l; i++ )
				{
					r[i] = this[i].getAttribute( A );
				}
				return r;
			}

			for( var i=0; i<l; i++ )
			{
				this[i][A] = V;
				this[i].setAttribute( A, V );
			}
			//this[i][A] = V;
			return this;
		},

		// 读/写当前对象内指定索引元素的 CSS 属性
		cssByIndex: function( id, A, V )
		{
			var e = this[id];
			if( !e ) return null;
			var t = 'style';

			if( typeof V == "undefined" )
			{
				if( A == 'opacity' )
				{
					if( I.comp.opacity )
					{
						if( !e[t][A] ) return 0;
						return e[t][A] * 100;
					}
					else
					{
						var n = e[t]['filter'].match( /[0-9]+/ );
						if( !n ) n = '0';
						return parseInt( n );
					}
				}
				else
				{
					if( typeof e[t][A] == 'undefined' || e[t][A] == '' )
					{
						if( A == 'width' ) A = 'offsetWidth';
						else if( A == 'height' ) A = 'offsetHeight';
						else if( A == 'left' ) A = 'offsetLeft';
						else if( A == 'top' ) A = 'offsetTop';
						return e[A];
					}
						return e[t][A];
				}
			}

			if( A == 'opacity' )
			{
				if( I.comp.opacity ) V = V / 100;
				else
				{
					A = 'filter';
					V = 'alpha(opacity=' + V + ')';
				}
			}

			if( "width,height".indexOf( A ) > -1 ) V += I.comp.borderFix;
			if( I.comp.colors.indexOf( A ) > -1 && !/#/.test( V ) && V ) V = '#' + parseInt( V ).toString( 16 );

			if( "width,height,left,top,marginLeft,padding".indexOf( A ) > -1 ) e[t][A] = V + 'px';
			else e[t][A] = V;

			return this;
		},

		// 读/写关联元素的 CSS 属性
		//??currentStyle, getComputedStyle
		css: function( A, V )
		{
			var l = this.length, t = 'style', r;
			if( !l ) return null;

			// 无传入值视为取值
			if( V == undefined )
			{
				// 单元素
				if( l == 1 )
				{
					// IE 下取出 filter:alpha.opacity 内值
					if( A == 'opacity' )
					{
						if( I.comp.opacity ) return this[0][t][A] * 100;
						else return parseInt( this[0][t]['filter'].match( /[0-9]+/ ));
					}
					else
					{
						if( typeof this[0][t][A] == 'undefined' || this[0][t][A] == '' )
						{
							//$ERR( "css get: A=" + A + " V="+this[0][t][A])
							if( A == 'width' ) A = 'offsetWidth';
							else if( A == 'height' ) A = 'offsetHeight';
							else if( A == 'left' ) A = 'offsetLeft';
							else if( A == 'top' ) A = 'offsetTop';

							r = parseInt( this[0][A] );
							if( isNaN( r )) r = this[0][A];
							return r;
						}

						r = parseInt( this[0][t][A] );
						if( isNaN(r)) r = this[0][t][A];
						return r;

						//return I.browser.msie ? this[0]['currentStyle'][A] : getComputedStyle(this[0]).A;
					}
				}

				// 多元素, 结果以数组返回
				var r = [];
				for( var i=0; i<l; i++ )
				{
					if( A == 'opacity' )
					{
						if( I.comp.opacity ) r[i] = this[i][t][A] * 100;
						else r[i] = parseInt( this[i][t]['filter'].match( /[0-9]+/ ));
					}
					else r[i] = this[i][t][A];
				}

				return r;
			}

			// 透明值处理:
			// 非 IE 取值范围 0 - 1
			// IE 转化为 filter.alpha
			if( A == 'opacity' )
			{
				if( I.comp.opacity ) V = V / 100;
				else
				{
					A = 'filter';
					V = 'alpha(opacity=' + V + ')';
				}
			}

			// 宽度值处理: 添加 px 尾缀
			//else if( I.comp.addPx.indexOf( A ) > -1 ) V += 'px';
			// 边框差异
			if( "width,height".indexOf( A ) > -1 )
			{
				V = parseInt( V );
				if( V ) V += I.comp.borderFix;
			}

			for( var i=0; i<l; i++ )
			{
				// 颜色值处理: 若无 # 开头则视为 10 进制
				if( I.comp.colors.indexOf( A ) > -1 && !/#/.test( V ) && V )
					V = '#' + parseInt( V ).toString( 16 );

				if( A == 'backgroundImage' )
				{
					if( !/^url\(/.test( V )) V = 'url(' + V + ')';
				}

				try
				{
					this[i][t][A] = V;
				}
				catch( E )
				{
					$ERR( 'ERR=' + E.message + ' , DST=(' + this.token.nodeName + ', ID=' + this.token.id + '), CSS: A=' + A + ', V=' + V );
				}
			}
			return this;
		},

		// DOM
		// 移动坐标
		moveTo: function( x, y )
		{
			this.each( function(){ I.moveTo( this, x, y ) });
			return this;
		},

		// 相对原坐标移动
		moveBy: function( x, y )
		{
			this.each( function(){ I.moveTo( this, this.offsetLeft + x, this.offsetTop + y ) });
			return this;
		},

		// 移动到相对指定元素坐标
		moveAs: function( e, x, y )
		{
			e = I(e);
			this.each( function(){ I.moveTo( this, e[0].offsetLeft + x, e[0].offsetTop + y ) });
			return this;
		},

		// 调整尺寸
		resizeTo: function( w, h )
		{
			w += I.comp.borderFix;
			h += I.comp.borderFix;
			this.each( function(){ I.resizeTo( this, w, h ) });
			return this;
		},

		// 对齐到元素
		alignTo: function( E, A )
		{
			this.each( function(){ I.alignTo( this, E, A ) });
			return this;
		},

		// 相对原尺寸调整
		resizeBy: function( w, h )
		{
			this.each( function(){ I.resizeTo( this, this.offsetWidth + w, this.offsetHeight + h ) });
			return this;
		},

		// 隐藏
		hide: function()
		{
			this.each( function(){ this.style.display = 'none' } );
			return this;
		},

		// 显示
		show: function()
		{
			//this.each( function(){ this.style.display = I.browser.msie ? 'block' : 'table-row' } );
			this.each( function(){ this.style.display = I.browser.msie ? 'block' : 'block' } );
			return this;
		},

		visible: function( A )
		{
			this.each( function(){ this.style.visibility = A ? 'visible' : 'hidden' } );
			return this;
		},

		// 聚焦
		focus: function()
		{
			this.each( function(){ try{ this.focus(); } catch(e){}} );
			return this;
		},

		// 取绝对坐标
		absPos: function()
		{
			var rc = this[0].getBoundingClientRect();
			return {left:rc.left, top:rc.top}

			/* 若不支持 getBoundingClientRect, 则改用以下代码.
			var oBody = document.body, E = this[0],
				x = 0, y = 0;

			while( E && E != oBody )
			{
				x += E.offsetLeft - E.scrollLeft;
				y += E.offsetTop - E.scrollTop;
				//E = E.offsetParent;
				E = E.parentNode;
			}

			if( E == oBody )
			{
				if( I.browser.msie )
				{
					if( document.documentElement.scrollTop ) y += document.documentElement.scrollTop;
					if( document.documentElement.scrollLeft ) x += document.documentElement.scrollLeft;
				}
				else
				{
					x += document.body.offsetLeft;
					y += document.body.offsetTop;
				}
			}
			return {left:x, top:y}*/
		},

		// 检测事件是否发生在本元素区域内
		ptIn: function( E )
		{
			if( this[0].nodeType == 9 ) return false;
			var evt = I.getEvent( E ), e = this[0],
				x = evt.clientX, y = evt.clientY,
				p = this.absPos(),
				l = p.left, t = p.top, r = l + e.offsetWidth, b = t + e.offsetHeight;
			return ( x > l && x < r && y > t && y < b )
		},

		ptInRect: function( E, L, T, R, B )
		{
			var evt = I.getEvent( E ), x = evt.clientX, y = evt.clientY;

			if( I.isObject( L )) return ( x > L.left && x < L.right && y > L.top && y < L.bottom )
			return ( x > L && x < R && y > T && y < B )
		},

		isAbsolute: function()
		{
			return this[0].style.position == 'absolute';
		},

		// 添加子元素
	    append: function( S )
		{
			this.each(
				function()
				{
					if( this.nodeType == 1 )
					{
						this.innerHTML = this.innerHTML + S;
						//appendChild( document.createElement( S ));
					}
				});
			return this;
        },

		// 读/写元素值
		value: function( V )
		{
			var q = this, r = [], o;
			for( var i=0; i<q.length; i++ )
			{
				e = q[i];
				if( !e ) continue;
				if( e.nodeName == "SELECT" )
				{
					o = e.options;
					for( var i=0; i<o.length; i++ )
					{
						var it = o[i];
						if( V == undefined )
						{
							//if( it.selected ) r.push( it.value || it.text );
							if( it.selected ) r.push( it.value );
						}
						else
						{
							if(( it.value || it.text ) == V ) it.selected = true;
							else it.selected = false;
						}
					}
				}

				else if( e.nodeName == "INPUT" )
				{
					//if( e.type == "checkbox" ) if( e.checked ) r.push( e.value );
					//else if( e.type == "radiobox" ) if( e.checked ) r.push( e.value );
					if( V == undefined ) return e.value;
					e.value = V;
					return this;
				}

				else
				{
					if( V == undefined ) return e.value;
					e.value = V;
					return this;
				}
			}

			return r;
		},

		// 设置元素文本内容
        setText: function( s )
        {
            this.each( function(){ if( $.browser.msie ) this.innerText = s; else this.textContent = s; } );
        },

		text: function( A )
		{
			return this.each(
				function()
				{
					if( A != undefined )
					{
						//if( $.browser.msie ) this.innerText = A; else this.textContent = A;
						$.browser.firefox ? this.textContent = A : this.innerText = A;
						return this;
					}
					else
					{
						//return $.browser.msie ? this.innerText : this.textContent;
						return $.browser.firefox ? this.textContent : this.innerText;
					}
				}
			);
		},

		// 绑定事件
		event: function( E, F )
		{
			var q = this;
			this.each( function(){ I.addEvent( q, this, E, F ) });
			return this;
		},

		click: function( F )
		{
			var q = this;
			this.each( function(){ I.addEvent( q, this, 'click', F ) });
			return this;
		},

		resize: function( F )
		{
			var q = this;
			this.each( function(){ I.addEvent( q, this, 'resize', F ) });
			return this;
		},

		move: function( F )
		{
			var q = this;
			this.each( function(){ I.addEvent( q, this, 'move', F ) });
			return this;
		},

		swapNode: function( N )
		{
			I.swapNode( this[0], N );
		},

		// 取/设选中区域
		// V: 要选中的内容串
		selection: function( V )
		{
			var E = this[0], S = '';
			if( !I.browser.msie )
			{
				if( typeof( E.selectionStart ) != 'undefined' )
				{
					S = E.value.substr( E.selectionStart, E.selectionEnd - E.selectionStart );
				}
			}
			else
			{
				S = document.selection.createRange().text;
				if( V )
				{
					var p = E.value.indexOf( V );
					if( p < 0 ) return;
					var r = document.selection.createRange();
					r.moveStart("character",-E.value.length);
					r.moveEnd("character",-E.value.length);
					r.collapse(true);
					r.moveStart('character',p);
					r.moveEnd('character',V.length);
					r.select();
				}
			}
			return S;
		},

		// 动画
		// P: 动画参数
		// T: 时钟速度
		// F: 完成回调
		anim: function( P, T, F )
		{
			var q = this, ov, nv, r = 0;

			for( var i=0; i<q.length; i++ )
			{
				if( !q.idata.anim ) q.idata.anim = new Array( q.length );
				q.idata.anim[i] = {};
				q.idata.anim[i].org = {};
				q.idata.anim[i].cur = {};
				q.idata.anim[i].dst = {};
				q.idata.anim[i].step = {};
				q.idata.anim[i].status = {};
				q.idata.anim.onPlayDone = F;

				// 记录变化量
				for( var it in P )
				{
					ov = q.cssByIndex( 0, it );
					if( ov == null ) ov = 0;

					// 原始值处理
					if( /^#/.test( ov )) ov = parseInt( ov.slice( 1 ), 16 );
					if( I.comp.addPx.indexOf( it ) > -1 ) ov = parseInt( ov );

					// 目标值处理
					// 控制符
					// +n -n 相对值
					// #n 颜色值(Hex)
					nv = P[it];
					r = 0;
					if( /^\+/.test( nv ))
					{
						r = 1;
						nv = parseInt( nv.slice( 1 ));
					}
					else if( /^\-/.test( nv ))
					{
						r = 2;
						nv = parseInt( nv );
					}

					q.idata.anim[i].status[it] = 1;
					q.idata.anim[i].org[it] = ov;
					q.idata.anim[i].cur[it] = ov;
					if( r )
					{
						q.idata.anim[i].dst[it] = ov + nv;
						q.idata.anim[i].step[it] = nv / T;
					}
					else
					{
						q.idata.anim[i].dst[it] = nv;
						q.idata.anim[i].step[it] = ( nv - ov ) / T;
					}
				}
			}

			I.addAnim( q );
			I.playAnim();
		},

		clearAnim: function()
		{
			with( I._animData )
			{
				timer = 0;
				status = 0;
				activeItem = 0;
				onPlayDone = 0;
				items.length = 0;
			}
		},

		// 事件
		// E=元素, F=回调
		addEvent: function( E, F )
		{
			var q = this;
			this.each( function(){ I.addEvent( q, this, E, F ) });
			return this;
		},

		disableContextMenu: function()
		{
			this.each( function(){ I.disableContextMenu( this ) });
			return this;
		}
	}

	// 对象扩展
	I.extend = I.fn.extend = function()
	{
		var o = arguments[0] || {},
			ai = 1,
			al = arguments.length,
			recur = false,
			obj;

		// 是否递归
		if( typeof o === "boolean" )
		{
			recur = o;
			o = arguments[1] || {};
			ai = 2;
		}

		// 新建对象
		if( typeof o !== "object" && !I.isFunction( o )) o = {}

		// 扩展自身
		if( al == ai )
		{
			o = this;
			--ai;
		}

		// 复制
		for( ; ai<al; ai++ )
		{
			if(( obj = arguments[ai] ) != null )
			{
				for( var it in obj )
				{
					var e1 = o[it], e2 = obj[it];
					if( e2 === o ) continue;
					if( recur && e2 && typeof e2 === "object" && !e2.nodeType )
					{
						o[it] = I.extend( recur, e1 || ( e2.length != null ? [] : {}), e2 );
					}
					else
					{
						if( e2 !== I ) o[it] = e2;
					}
				}
			}
		}

		return o;
	};

	// 浏览器类型
    var ua = navigator.userAgent.toLowerCase();
    I.browser =
	{
		ua		: ua,
        version	: ( ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"] )[1],
        safari	: /webkit/.test( ua ),
        opera	: /opera/.test( ua ),
        msie	: /msie/.test( ua ) && !/opera/.test( ua ),
        chrome  : /chrome/.test( ua ),
		firefox : /firefox/.test( ua ),
		mozilla2: /mozilla/.test( ua ) && !/(compatible|webkit)/.test( ua ),
		mozilla	: /mozilla/.test( ua ) && !/msie/.test( ua ),
		evm     : /enrich/.test( ua ),
		ipanel  : /ipanel/.test( ua )
    };

	// 兼容性
	I.comp =
	{
		// 标准透明属性 opacity 是否可用
		opacity	: !I.browser.msie,
		// 边框差异(firefox=2px)
		borderFix: I.browser.msie ? 0 : -2,
		// 需要在添加 px 尾缀的属性名
		addPx	: 'left,top,width,height,margin,marginTop,marginRight,marginBottom,marginLeft,padding,paddingTop,paddingRight,paddingBottom,paddingLeft',
		colors	: 'color,backgroundColor,border-color',
		LBtn: I.browser.msie ? 1 : 0,
		RBtn: I.browser.msie ? 2 : 2,
		MBtn: I.browser.msie ? 4 : 1,
		cancelBubble: function( evt ){ if( !I.browser.msie ) evt.preventDefault(); return false },
		ignoreDragElem: 'INPUT,TEXTAREA'
	};

	// 标准扩展(加载至全局 swat 实例)
	var o2str = Object.prototype.toString;
    I.extend(
	{
		// 检测校验
		isFunction	: function( O ){ return o2str.call( O ) === "[object Function]" },
        isArray		: function( O ){ return o2str.call( O ) === "[object Array]" },
		isObject	: function( O ){ return o2str.call( O ) === "[object Object]" },
		isRegExp	: function( O ){ return o2str.call( O ) === "[object RegExp]" },
        isXMLDoc	: function( O ){ return O.documentElement && !O.body || O.tagName && O.ownerDocument && !O.ownerDocument.body },
		isNumber	: function( O ){ return typeof O === "number" },
		isString	: function( O ){ return typeof O === "string" },
		isUndefined : function( O ){ return typeof O === "undefined" },
		isNull		: function( O ){ return O === null },
		isWindow	: function( O ){ return !!O.setInterval },

		// 禁用选择
		_acceptSelect : false,
		_traceElem: 0,

		newUniqueId: function( C )
		{
			return ( C && C.className ? C.className : '' ) + ++I.uniqueId ;
		},

		acceptSelect: function( N )
		{
			this._acceptSelect = N;
		},

		cancle: function()
		{
			return function( evt ){ return false }
		},

		setTraceElement: function( E )
		{
			I._traceElem = $E(E);
			return this;
		},

		trace: function( s )
		{
			if( I._traceElem )
			{
				//I._traceElem.innerHTML = I._traceElem.innerHTML + s + '<br>';
				I._traceElem.innerHTML = s;
			}
			else
			{
				I.browser.msie ? window.status = 'SWAT: ' + s : document.title = 'SWAT: ' + s;
			}
			return this;
		},

		log: function( s )
		{
			if( I._traceElem )
			{
				//I._traceElem.innerHTML = I._traceElem.innerHTML + s + '<br>';
				I._traceElem.innerHTML = s;
			}
			else
			{
				if( typeof console != 'undefined' ) console.log( s );
			}

			return this;
		},

		copy: function( S, D )
		{
			if( !S ) return;
			for( var i in S ) D[i] = S[i];
		},

		// 迭代执行
		each: function( S, O, F )
		{
			if( I.isFunction( O ))
			{
				for( var i=0; i<S.length; i++ )
				{
					O.apply( S[i], F ? [F] : [i] );
				}
			}
		},

		// 取关联元素数组
        toArray: function( O )
		{
            var a = [];
            if( O != null )
			{
                var i = O.length;
                if( i == null || typeof O === "string" || I.isFunction( O ) || O.setInterval )
				{
					a[0] = O;
				}
                else
				{
					while( i ) a[--i] = O[i];
				}
            }
            return a;
        },

		// 取字符串长度
		// ASCII 标准, unicode 作为 2 字符
		strlenA: function( S )
		{
			var n = 0;
			var a = S.split( "" );
			for( var i=0; i<a.length; i++ )
			{
				if( a[i].charCodeAt( 0 ) < 127 ) n++;
				else n += 2;
			}
			return n;
		},

		// 移动元素位置
		moveTo: function( e, x, y )
		{
			if( typeof x == "number" ) e.style.left = x + "px";
			if( typeof y == "number" ) e.style.top = y + "px";
			return this;
		},

		// 调整尺寸
		resizeTo: function( e, w, h )
		{
			if( typeof( w ) == "number" ) e.style.width = w + "px";
			if( typeof( h ) == "number" ) e.style.height = h + "px";
			return this;
		},

		// 对齐到元素
		alignTo: function( e, E, A )
		{
			if( !e ) return this;
			E = E || document.body;
			E = $(E);
			A = A || 'center';
			A = A.toLowerCase();
			var l = E.css('offsetLeft'), t = E.css('offsetTop'),
				w = E == document.body ? E.css('clientWidth') : E.css('offsetWidth'),
				h = E == document.body ? E.css('clientHeight') : E.css('clientHeight'),
				r = l + w - 1, b = t + h - 1,
				e = $(e), ew = e.css('width'), eh = e.css('height');

			if( A.indexOf( 'left' ) > -1 ) e.css( 'left', l );
			if( A.indexOf( 'top' ) > -1 ) e.css( 'top', t );
			if( A.indexOf( 'right' ) > -1 ) e.css( 'left', r - ew );
			if( A.indexOf( 'bottom' ) > -1 ) e.css( 'top', b - eh );
			if( A.indexOf( 'center' ) > -1 )
			{
				e.css( 'left', l + ( w - ew ) / 2 - 1 );
				e.css( 'top', t + ( h - eh ) / 2 - 1 );
			}
			return this;
		},

		// 计时测试 --
		_measureDate:
		{
			beginTick: 0
		},

		// 开始计时
		beginTick: function()
		{
			I._measureDate.beginTick = new Date().getMilliseconds();
			return this;
		},

		// 停止计时, 返回耗时
		endTick: function()
		{
			return new Date().getMilliseconds() - I._measureDate.beginTick + 1;
		},

		// 动画支持 --
		_animData:
		{
			timer: null,
			status: 0,
			activeItem: 0,
			onPlayDone: null,
			items: new Array(),
			startTime: 0
		},

		onPlayDone: function( F )
		{
			if( typeof F != 'function' ) $ERR( 'parameter must be a Function' );
			else this._animData.onPlayDone = F;
			return this;
		},

		// 添加动画条目
		addAnim: function( O )
		{
			var q = this, ad = q._animData;
			ad.animStatus = 1;

			for( var i=0; i<ad.items.length; i++ )
			{
				if( O.hash && ( O.hash == ad.items[i].hash ))
				{
					if( ad.items[i].idata.animStatus == 0 ) ad.activeItem++;
					ad.items[i] = O;
					return this;
				}
			}

			ad.items.push( O );
			ad.activeItem++;

			return this;
		},

		// 开始动画
		playAnim: function()
		{
			var q = this, ad = q._animData;
			if( ad.timer ) clearInterval( ad.timer );
			ad.timer = setInterval( function(){ I._animPlay( q ) }, 1 );
			q._animData.startTime = new Date().getTime();
			return this;
		},

		// 停止动画
		stopAnim: function()
		{
			clearInterval( this._animData.timer );
			return this;
		},

		// 全局动画处理
		_animPlay: function( I )
		{
			var q = I, ad = q._animData, itemDone = true;

			for( var i=0; i<ad.items.length; i++ )
			{
				var o = ad.items[i];
				//document.title = Math.random()*100 + " - " + o.idata.animStatus;
				if( o.idata.animStatus == 0 ) continue;

				// 处理条目内元素
				for( var j=0; j<o.length; j++ )
				{
					var cur = o.idata.anim[j].cur,
						dst = o.idata.anim[j].dst,
						step = o.idata.anim[j].step,
						status = o.idata.anim[j].status,
						callback = o.idata.anim.onPlayDone;

					itemDone = true;

					for( var it in dst )
					{
						// 已越界则标记为停止
						if(( step[it] > 0 && cur[it] >= dst[it] ) || ( step[it] < 0 && cur[it] <= dst[it] ) || step[it] == 0 )
						{
							status[it] = 0;
							continue;
						}

						// 否则更新属性
						if( step[it] > 0 ) cur[it] = Math.min( cur[it] + step[it], dst[it] );
						else cur[it] = Math.max( cur[it] + step[it], dst[it] );

						//document.title=ad.activeItem+" it="+it+" c="+cur[it]+" step="+step[it] + " " + Math.random()*100;
						o.cssByIndex( j, it, cur[it] );
					}

					// 检查所有停止标记, 未全部停止则返回继续
					for( var it in dst )
					{
						if( status[it] > 0 )
						{
							itemDone = false;
							break;
						}
					}

					// 已全部停止: 清除定时器
					if( itemDone )
					{
						// 释放资源
						for( var j=0; j<o.length; j++ )
							o.idata.anim[j] = o.idata.anim[j].org = o.idata.anim[j].cur = o.idata.anim[j].dst = o.idata.anim[j].step = o.idata.anim[j].status = null;
						o.idata.anim = null;

						// 更新活动对象
						o.idata.animStatus = 0;
						ad.activeItem--;

						// 修改为目标属性
						for( var it in dst ) o.cssByIndex( j, it, dst[it] );

						// 对象回调
						if( callback ) callback( o );
					}
				}
			}

			// 检查是否全部停止
			if( ad.activeItem == 0 )
			{
				// 清除定时器
				clearInterval( ad.timer );
				// 全局回调
				//if( ad.onPlayDone ) ad.onPlayDone();
			}

			// ??
			//$ERR( "anim(" + (new Date().getTime() - q._animData.startTime) + ") items:" + ad.activeItem );
			return true;
		},

		// 添加事件
		// o=对象
		addEvent: function( o, e, E, F )
		{
			if( I.browser.msie )
			{
				e.attachEvent( 'on' + E, function(){ return F.call( e ) });
			}
			else
			{
				e.addEventListener( E, function( evt ){ return F.call( e, evt ) }, false );
			}
		},

		// 屏蔽右键菜单
		disableContextMenu: function( E )
		{
			if( !E ) return false;
			if( E.addEventListener )
			{
				E.addEventListener( "mousedown", function(evt){if(evt.button==2){evt.stopPropagation(); /*FF*/ evt.preventDefault(); /*for chrome*/ }}, true );
			}
			else
			{
				E.attachEvent( "onmousedown", function(){if(event.button==2)E.setCapture()} );
				E.attachEvent( "onmouseup", function(){E.releaseCapture()} );
				E.oncontextmenu = function(){ return false }
			}
		},

		// 页面加载事件
		// document.onready 回调方法数组
		_onloadFuncList: new Array(),
		_onresizeFuncList: new Array(),

		// 添加 onload 回调
		pageReady: function( F )
		{
			I._onloadFuncList.push( F );
		},

		// 添加 onresize 回调
		pageResize: function( F )
		{
			I._onresizeFuncList.push( F );
		},

		// 依注册次序执行回调方法
		// 方法返回 false 则中止执行
		_doc_load: function()
		{
			var q = this;
			return function()
			{
				for( var i=0; i<q._onloadFuncList.length; i++ )
				{
					if( q._onloadFuncList[i].call( q ) == false ) return false;
				}
				return true;
			}
		},

		_doc_resize: function()
		{
			var q = this;
			return function()
			{
				for( var i=0; i<q._onresizeFuncList.length; i++ )
				{
					if( q._onresizeFuncList[i].call( q ) == false ) return false;
				}
				return true;
			}
		},

		_doc_unload: function()
		{
			return function()
			{
				if( swat ) swat = null;
			}
		},

		// 鼠标事件对象
		_mouseEvtObj:
		{
			type:0,		// 0=拖动, 1=调整尺寸
			btnDown:0, btn:-1,
			el:null, swatInst:null,
			orgL:0, orgT:0, orgW:0, orgH:0, orgZ:0,
			gapL:0, gapT:0, gapSens:5, ptX:0, ptY:0,
			minW:18, minH:18, topZ:32768, cursor:'default',
			zOrder: 0
		},

		// 按下
		_doc_mousedown: function()
		{
			var q = this;
			return function( evt )
			{
				var evt = evt || window.event,
					e = evt.srcElement || evt.target,
					o = q( e );

				if( I.comp.ignoreDragElem.indexOf( e.nodeName ) > -1 ) return;

				// 是否向上传递事件
				while( e )
				{
					if( e.getAttribute( 'exPass' ) == 1 ) e = e.parentNode;
					else if( e.getAttribute( 'exDragable' )) break;
					else break;
				}
				if( !e ) return false;

				// 获取有效元素
				o = q( e );
				var eo = q._mouseEvtObj;

				// 允许拖放
				if( o.attr( 'exDragable' ) == 1 )
				{
					if( evt.button == I.comp.LBtn )
					{
						eo.btnDown = 1;
						eo.btn = evt.button;
						eo.el = e;
						eo.swatInst = o;
						eo.orgL = e.offsetLeft;
						eo.orgT = e.offsetTop;
						eo.orgW = e.offsetWidth;
						eo.orgH = e.offsetHeight;
						eo.gapL = evt.clientX - eo.orgL;
						eo.gapT = evt.clientY - eo.orgT;

						// 是否提到顶层
						if( o.attr( 'exTopOnDrag' ))
						{
							//eo.orgZ = o.css( 'zIndex' ) || 0;
							//o.css( 'zIndex', eo.topZ );
							o.css('zIndex', ++q._mouseEvtObj.zOrder )
						}

						//e.stopPropagation();
						//e.preventDefault();
						//evt.cancelBubble = true;
					}

					return I.comp.cancelBubble( evt );
				}
			}
		},

		// 放开
		_doc_mouseup: function()
		{
			var q = this;
			return function( evt )
			{
				var evt = evt || window.event,
					e = evt.srcElement || evt.target,
					eo = q._mouseEvtObj;

				// 恢复初始值
				eo.btnDown = 0;
				eo.btn = null;

				// 是否向上传递事件
				while( e )
				{
					if( e.getAttribute( 'exPass' ) == 1 ) e = e.parentNode;
					else if( e.getAttribute( 'exDragable' )) break;
					else break;
				}

				if( e )
				{
					var o = q(e);
					// 恢复层次
					if( o.attr( 'exTopOnDrag' ))
					{
						//o.css( 'zIndex', eo.orgZ );
						//eo.orgZ = 0;
					}
				}
			}
		},

		// 移动
		_doc_mousemove: function()
		{
			var q = this;
			return function( evt )
			{
				var evt = evt || window.event,
					e, o, eo = q._mouseEvtObj;

				e = evt.srcElement || evt.target;
				if( I.comp.ignoreDragElem.indexOf( e.nodeName ) > -1 ) return;

				if( eo.btnDown == 0 )
				{
					e = evt.srcElement || evt.target;
					o = q( e );

					// 是否允许调整尺寸
					if( o.attr( 'exSizable' ) == 1 )
					{
						eo.el = e;
						eo.swatInst = o;
						eo.orgL = e.offsetLeft;
						eo.orgT = e.offsetTop;
						eo.orgW = e.offsetWidth;
						eo.orgH = e.offsetHeight;
						eo.ptX = evt.clientX;
						eo.ptY = evt.clientY;
                        var sizeDir = o.attr( 'exSizeDir' ) || 'LRTB';

						var ap = o.absPos(),
							dl = evt.clientX - ap.left,
							dt = evt.clientY - ap.top,
							dr = e.offsetWidth - dl,
							db = e.offsetHeight - dt,
							c = '';

						eo.gapL = dl;
						eo.gapT = dt;
						//eo.cursor = '';//o.css( 'cursor' );

						if( dt < eo.gapSens && sizeDir.indexOf('T') > -1 ) c += 'n';
						if( db < eo.gapSens && sizeDir.indexOf('B') > -1 ) c += 's';
						if( dl < eo.gapSens && sizeDir.indexOf('L') > -1 ) c += 'w';
						if( dr < eo.gapSens && sizeDir.indexOf('R') > -1 ) c += 'e';

						if( c )
						{
							eo.cursor = c + '-resize';
							eo.type = 1;
						}
						else
						{
							eo.cursor = 'default';
							eo.type = 0;
						}

						o.css( 'cursor', eo.cursor );
                        //window.status = "abs:"+ap.left + ":" + ap.top + " ms:" + evt.clientX + ":" + evt.clientY;
					}
					else
					{
						eo.cursor = '';
						eo.type = 0;
					}
				}
				else
				{
					e = eo.el;
					o = q( e );

					if( e.OnMove ) e.OnMove( evt, e );

					// 无按键
					if( eo.type == 0 )
					{
						var dragDir = o.attr( 'exDragDir' ) || 'XY';
						var x = dragDir.indexOf( 'X' ) > - 1 ? evt.clientX - eo.gapL : eo.orgL;
						var y = dragDir.indexOf( 'Y' ) > - 1 ? evt.clientY - eo.gapT : eo.orgT;
						var dragRect = o.attr( 'exDragRect' );

						if( dragRect )
						{
							//if( x >= dragRect.left && x <= dragRect.right && y >= dragRect.top && y <= dragRect.bottom )
							if( x < dragRect.left ) x = dragRect.left;
							if( x > dragRect.right ) x = dragRect.right;
							if( y < dragRect.top ) y = dragRect.top;
							if( y > dragRect.bottom ) y = dragRect.bottom;

							{
								o.moveTo( x, y );
								//if( o.attr('OnMove') )o.attr('OnMove')( evt, e );
							}
						}
						else
						{
							o.moveTo( x, y );
							//if( o.attr('OnMove') ) o.attr('OnMove')( evt, e );
						}
					}

					// 有键按下
					else if( eo.type == 1 )
					{
						var cursorStr = eo.cursor.substr( 0, 2 );

						if( cursorStr.indexOf( 'e' ) > -1 )
						{
							eo.el.style.width = Math.max( eo.minW, eo.orgW + evt.clientX - eo.ptX ) + 'px';
						}

						if( cursorStr.indexOf( 'w' ) > -1 )
						{
							eo.el.style.width = Math.max( eo.minW, eo.orgW - ( evt.clientX - eo.ptX )) + 'px';
							eo.el.style.left = evt.clientX - eo.gapL + 'px';
						}

						if( cursorStr.indexOf( 'n' ) > -1 )
						{
							eo.el.style.height = Math.max( eo.minH, eo.orgH- evt.clientY + eo.ptY ) + 'px';
							eo.el.style.top = evt.clientY - eo.gapT + 'px';
						}

						if( cursorStr.indexOf( 's' ) > -1 )
						{
							eo.el.style.height = Math.max( eo.minH, evt.clientY - eo.ptY + eo.orgH ) + 'px';
						}
					}
				}

				//if( !I._acceptSelect ) return I.comp.cancelBubble( evt );
			}
		},

		// AJAX
		ajax:
		{
			charSet: "GB2312",

			// 创建 XMLHttpRequest 对象
			createInst: function()
			{
				var x;
				try { x = new XMLHttpRequest() }
				catch( e ) { x = new ActiveXObject( "Microsoft.XMLHTTP" ) }
				return x;
			},

			// 创建 Ajax 请求
			// 例: $.ajax.load( {url:'http://www.scumix.cn/ajax/getcode.jsp', type'post', param:'p=123'} )
			load: function( p )
			{
				if( !p.url ) return false;
				var type = p.type || 'post';
				var ctype = p.contentType || 'application/x-www-form-urlencoded';
				var param = p.param || '';
				var x = p.inst || this.createInst();
				x.onreadystatechange = function()
				{
					var r = '';
					if( 4 == x.readyState )
					{
						if( 200 == x.status )
						{
							r = x.responseText;
							if( p.onData ) p.onData( r, p.onDataParam );
							if( !p.inst ) x = null;
						}
						else
						{
							if( p.onError ) p.onError( x.status, x.statusText );
							else $ERR( 'Ajax Error(' + x.status + ':' + x.statusText + ')' );
						}
					}
				}

				x.open( type, p.url, true );
				x.setRequestHeader( 'Content-type', ctype );
				x.send( param );
				return x;
			},

			error: function( E )
			{
				alert( 'Ajax 请求出错\n\n原因: ' +  E.message );
			}
		},

		//--- JSON 相关 ---
		json:
		{
			assert: function( json )
			{
				if( !json.success )
				{
					alert( "远程调用失败\n\n返回消息: " + json.msg );
					return false;
				}

				return true;
			},

			// 将 Json 串转换为内置对象
			toObject: function( S )
			{
				return ( new Function( "return " + S ))();
			},

			// 将对象转换为 Json 串
			// Key 不使用引号, 所以不能包含空格
			toJson: function( O )
			{
				var S = '{', sEnd = '}';
				if( I.isArray( O ))
				{
					S = '[';
					sEnd = ']';
				}

				for( var i in O )
				{
					S += i + ':';

					//if( I.isUndefined( O[i] )) S += 'undefined';
					if( I.isUndefined( O[i] )) S += '""';
					else if( I.isObject( O[i] )) S += this.toJson( O[i] );
					else if( I.isArray( O[i] )) S += this.toJson( O[i] );
					else if( I.isString( O[i] )) S += '"' + O[i] + '"';
					else S += O[i];

					S += ',';
				}

				S = S.trim(',');
				S += sEnd;

				return S;
			}
		},

		getElementsByClass: function( C, P )
		{
			P = P || document.body;
			var E = P.getElementsByTagName('*');
			var R = [];
			var re = new RegExp( '\\b' + C + '\\b', 'i' );
			var i = 0;

			for( i=0; i<E.length; i++ )
			{
				if( re.test( E[i].className ))
				{
					R.push( E[i] );
				}
			}

			return R;
		},

		// 持久化
		persistent:
		{
			// 获取持久化对象
			getPersistentObject: function( O )
			{
				if( O.persistentProperty == undefined ) return {};
				var o = {}
				for( var i in O.persistentProperty )
				{
					if( O[O.persistentProperty[i]] !== '' )
						o[O.persistentProperty[i]] = O[O.persistentProperty[i]];
				}
				return o;
			}
		},

		// Url 参数
		urlParam:
		{
			__param: [],

			// 设置/获取参数串
			paramString: function( __A )
			{
				if( __A )
				{
					this.__param = [];
					A = __A.split( '&' );
					for( var i in A )
					{
						T = A[i].split( '=' );
						this.__param[T[0]] = T[1];
					}

					return this;
				}

				if( typeof this.__param != 'object' ) return '';
				var R = '';
				for( var i in this.__param ) R += i + '=' + this.__param[i] + '&';
				R = R.substr( 0, R.length - 1 );
				return R;
			},

			// 设置/获取参数
			param: function( A, V )
			{
				if( typeof V != 'undefined' ) this.__param[A] = V;
				return this.__param[A];
			},

			toQueryString: function( O )
			{
				var E = '';
				for( var i in O )
				{
					E += ( i + '=' + O[i] + '&' );
				}

				return E.substr( 0, E.length - 1 );
			}
		},

        // utility
		swapNode: function( N1, N2 )
		{
			var parent = N1.parentNode,
				t1 = N1.nextSibling,
				t2 = N2.nextSibling;

			if( t1 ) parent.insertBefore( N2, t1 );
			else parent.appendChild( N2 );

			if( t2 ) parent.insertBefore( N1, t2 );
			else parent.appendChild( N1 );
		},

		eachOption: function( E, F )
		{
			var E = $E(E);
			if( !E || !F ) return false;
			for( var i=0; i<E.options.length; i++ ) F( E.options[i] );
		},

		// 取事件对象
		getEvent: function( E )
		{
			//return E || window.event;
			if( document.all ) return window.event;

			var F = I.getEvent.caller;
			while( F )
			{
				var a0 = F.arguments[0];
				if( a0 )
				{
					if(( a0.constructor == Event || a0.constructor == MouseEvent) ||
						( typeof( a0 ) == 'object' && a0.preventDefault && a0.stopPropagation ))
					{
						return a0;
					}
				}

				F = F.caller;
			}

			return null;
		},

		// 取事件源元素
		getTarget: function( E )
		{
			if( !E ) E = this.getEvent();
			return E ? ( E.srcElement || E.target ) : null;
		},

		makeRect: function( O, L, T, R, B )
		{
			O.left = L;
			O.top = T;
			O.right = R;
			O.bottom = B;
		},

		rect: function( R, l, t, w, h )
		{
			R.left = l;
			R.top = t;
			R.width = w;
			R.height = h;
		},

		ptInRect: function( x, y, L, T, R, B )
		{
			if( I.isObject( L )) return ( x > L.left && x < L.right && y > L.top && y < L.bottom )
			return ( x > L && x < R && y > T && y < B )
		},

		// 取值, 当 V 未定义时返回 D, 否则返回 V
		defaultValue: function( V, D )
		{
			return typeof( V ) == 'undefined' ? D : V;
		},

		swap: function( n1, n2 )
		{
			var t = n1;
			n1 = n2;
			n2 = t;
		},

		duplicate: function( src )
		{
			var dst = new Array();
			//for( var i in src ) dst.push( src[i] );
			for( var i=0; i<src.length; i++ )
			{
				if( I.isArray( src[i] )) dst[i] = I.duplicate( src[i] );
				else dst[i] = src[i];
			}
			return dst;
		},

		toHex: function( N )
		{
			var d = parseInt( N );
			return d < 16 ? '0' + d.toString(16) : d.toString(16);
		},

		getCurDate: function()
		{
			var dt = new Date();
			/*var y = dt.getYear() + 1900;
			var m = dt.getMonth() + 1; if( m < 10 ) m = "0" + m;
			var d = dt.getDate(); if( d < 10 ) d = "0" + d;
			return y + "-" + m + "-" + d;*/
			return d.format( 'YYYY-mm-dd' );
		},

		getCurTime: function( D )
		{
			var d = new Date();
			/*var h = d.getHours(); if( h < 10 ) h = '0' + h;
			var m = d.getMinutes(); if( m < 10 ) m = '0' + m;
			var s = d.getSeconds(); if( s < 10 ) s = '0' + s;
			var ms = d.getMilliseconds(); if( ms < 10 ) ms = '00' + ms;
			return h + ":" + m + ":" + s + ( D ? '.' + ms : '' );*/
			return d.format( D ? 'HH:ii:ss:SS' : 'HH:ii:ss' );
		},

		getCurDateTime: function()
		{
			return this.getCurDate() + " " + this.getCurTime();
		},

		getObjectLength: function( A )
		{
			var c = 0;
			for( var i in A ) c++;
			return c;
		},

		// 添加到收藏
		addToFav: function( url, title )
		{
            url = url ? url : location.href;
			title = title ? title : document.title;
			if( document.all ) window.external.AddFavorite( url, title );
			else if( window.sidebar ) window.sidebar.addPanel( title, url, "" );
		},

		//页面转向
		redirect: function( url )
		{
			window.location = url;
		},

		// 设置主页
		setHomePage: function( url )
		{
			if( document.all )
			{
				var e = $E( "_swat_eHomePage" );
				if( !e )
				{
					e = document.createElement( "span" );
					e.innerHTML = '<span style="behavior:url(\'#default#homePage\'); display:none" id="_swat_eHomePage">' + url + '</span>';
					document.body.appendChild( e );
					e = $E( "_swat_eHomePage" );
				}
				e.setHomePage( e.innerHTML );
			}

			else // if( this.browser.isNS )
			{
				try{ netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect") }
				catch( ex ){ alert( "Mozilla Secrety decline:\nOpen about:config, set the 'signed.applets.codebase_principal_support' as 'true'" ) }
				var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService( Components.interfaces.nsIPrefBranch );
				prefs.setCharPref( 'browser.startup.homepage', url );
			}
		},

		/**
		 * 创建元素
		 * @param parent: 指定父对象('': 添加至 document.body; null:不添加, 仅返回新元素; 其他值:指定父对象)
		 * @sample: $.createElement( {type:'div', id:'div2', css:'position:absolute;width:100px;height:50px;background:#500', attr:{exDragable:1} } );
		*/
		createElement: function( P, parent )
		{
			if( !P.type || !P.id ) return null;

			var o = document.createElement( P.type );
			o.id = o.name = P.id;

			// copy css
			if( P.css )
			{
				var arr = P.css.split( ';' );
				for( var i=0; i<arr.length; i++ )
				{
					var t = arr[i].split( ':' );
					if(t[0]=='opacity') $(o).css('opacity',t[1]);
					else o.style[t[0]] = t[1];
				}
			}

			// copy attr
			if( P.attr ) for( var i in P.attr )
			{
				o[i]=P.attr[i];
				o.setAttribute( i, P.attr[i] );
			}

			if( parent == '' ) document.body.appendChild( o );
			else if( parent != null ) parent.appendChild( o );

			return o;
		},

		/**
		 * 从数组创建元素(支持嵌套)
		 *
		 * 例:
			var A =
			[
			{
				type:'div', id:'div1',
				css:'position:absolute;width:200px;height:200px;background:#300',
				attr:'exDragable:1',
				child:
				[
					{
						type:'div', id:'div1_1', css:'position:absolute;width:100px;height:50px;background:#ff0', attr:'exDragable:1',
						child:
						[
							{type:'div', id:'div1_1', css:'position:absolute;width:50px;height:50px;background:#f0f', attr:'exDragable:1'}
						]
					}
				]
			}
			];
			$.createElementByArray( A, '' );
		 */
		createElementByArray: function( P, parent )
		{
			for( var i=0; i<P.length; i++ )
			{
				var o = I.createElement( P[i] );

				// 递归
				if( P[i].child ) I.createElementByArray( P[i].child, o );

				if( parent != null )
				{
					if( parent == '' ) document.body.appendChild( o );
					else parent.appendChild( o );
				}
			}
		},

		// 删除元素
		removeElement : I.browser.msie ?
			function()
			{
				var D;
				return function( E )
				{
					if( E && E.tagName != 'BODY' )
					{
						D = D || document.createElement('div');
						D.appendChild( E );
						D.innerHTML = '';
					}
				}
			}()
			:
			function( E )
			{
				if( E && E.parentNode && E.tagName != 'BODY' )
				{
					E.parentNode.removeChild( E );
				}
			},

		// 创建新类
		newClass: function()
		{
			return function(){ this.constructor.apply( this, arguments ); }
		},

		// 全局标识
		__globalCounter: 0,

		// 取下一个全局唯一计数
		getNextGlobalId: function()
		{
			return this.__globalCounter;
		},

		// 生成指定前缀的全局唯一标识
		makeGlobalId: function( S )
		{
			S = S ? S : '';
			return S + ( this.__globalCounter++ ) + (Math.floor( Math.random() * 1000 ) + '');
		},

		errorString: function( E )
		{
			if( Object.prototype.toString.call(E) != '[object Error]' ) return '[no error]';
			var s = '';
			for( var i in E )
			{
				s += ( i + ': ' + ( i == 'number' ? E[i] & 0xFFFF : E[i] )) + '\n';
			}

			return s.trim(',');
		},

		// 计时测量类
		measure:
		{
			_counter: 0,

			// 开始计时
			start: function()
			{
				this._counter = new Date().getTime();
				return this;
			},

			// 取逝去时间
			elapsed: function()
			{
				return new Date().getTime() - this._counter;
			}
		},

		// 验证类
		validate:
		{
			// 正则验证
			// S: 待验证的内容
			// R: 可传入正则表达式, 或是字符串指明的格式
			test: function( S, R )
			{
				//if( I.isRegExp( R )) return R.test( S );
				switch( R )
				{
					case 'number':
						//R = new RegExp( it.acceptExp, 'ig' );
						R = /^[\d|\.]+$/;
						break;

					default:
						R = /.?/;
				}

				return R.test( S );
			},

			// 判断传入值是否是 CSS 属性
			isCssAttr: function( A )
			{
				return '|left|top|width|height|background|backgroundColor|color|fontSize|fontStyle|fontWeight|textAlign|lineHeight|backgroundRepeat|backgroundImage|zIndex|'.indexOf('|' + A + '|') > -1;
			}
		}
	});

	// 绑定方法到新实例
	I.fn.init.prototype = I.fn;
	G.$ERR = I.trace;

	// 扩展接口
	I.ext = {}
	I.ext.extend = I.extend;
	I.ext.codec = {}
	I.ext.codec.extend = I.extend;
	I.ext.algorithm = {}
	I.ext.algorithm.extend = I.extend;

	// 注册标准事件
	I('document').addEvent( 'load', I._doc_load());
	I('document').addEvent( 'unload', I._doc_unload());
	I(window).addEvent( 'resize', I._doc_resize());
	I().addEvent( 'mousedown', I._doc_mousedown());
	I().addEvent( 'mouseup', I._doc_mouseup());
	I().addEvent( 'mousemove', I._doc_mousemove());
})();

//
// CLogger
// 日志记录器类
//
/*
# 用法:
$G.ui.logDNP = new CLogger( {elem:'eLOG',maxRows:1000}, {textCss:'color:#cccccc'} );
*/
function CLogger( P, OPT )
{
	// properties:
	this.uiElem = P ? P.elem || 0 : 0;
	this.rows = P ? P.rows || 0 : 0;
	this.maxRows = P ? P.maxRows || 10 : 10;

	this.option = {}
	this.option.date = OPT ? OPT.date || 1 : 1;
	this.option.dateCss = OPT ? OPT.dateCss || 0 : 0;
	this.option.textCss = OPT ? OPT.textCss || 0 : 0;
	this.option.dateCss == 0 ? this.option.dateCss = 'font:normal 16px tahoma;color:#666666' : 0;
	this.option.textCss == 0 ? this.option.textCss = 'color:#ffffff' : 0;

	// methods:
	this.bindUIElem( this.uiElem );
}

CLogger.prototype =
{
	// 绑定 UI 元素
	bindUIElem: function( E )
	{
		this.uiElem = $E(E);
		return this;
	}

	// 清空日志
	,clear: function()
	{
		try
		{
			with( this )
			{
				if( uiElem )
				{
					uiElem.innerHTML = '';
					rows = 0;
				}
			}
		}
		catch( E ){}

		return this;
	}

	// 输出日志
	// S: 文本内容
	// T: 日志类型
	// C: 文本样式
	// E: 目标元素
	,log: function( S, T, C, E )
	{
		try
		{
			with( this )
			{
				E = $E(E) || uiElem;

				if( uiElem )
				{
					if( rows == maxRows ) clear();

					var css = '';
					switch( T )
					{
						case 'w': css = 'color:#ffff00'; break;
						case 'W': css = 'background:#ffff00;color:#cc0000'; break;
						case 'e': css = 'color:#ff0000'; break;
						case 'E': css = 'background:#ff0000'; C = ';color:#eeeeee'; break;
						case 'i': css = 'color:#6688ff'; break;
						case 'I': css = 'background:#6688ff;color:#111111'; break;
						case 'd': css = 'color:#66ff00'; break;
						case 'D': css = 'background:#66ff00;color:#222222'; break;
						default: css = C ? C : option.textCss;
					}

					E.innerHTML
						+= ( option.date ? '<span style="' + option.dateCss + '">' + $.getCurTime(1) + ':&nbsp;</span>' : '' )
						+ '<span style="' + css + '">' + S + '</span><br/>'
						;

					E.scrollTop = E.scrollHeight;

					rows++;
				}
			}
		}
		catch( E ){}

		return this;
	}
}
