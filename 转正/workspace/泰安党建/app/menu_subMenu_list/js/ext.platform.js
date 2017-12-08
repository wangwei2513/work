/*********************************************************************

	SCUMiX(R) SWAT JavaScript Toolkit for STB
	ext.platform.js

	author: scumyang
	create: 2014-12-03
	desc. : 终端平台兼容
	update:

*********************************************************************/

if( swat && swat.version >= 3.0 )
{

//
// CPlatform 主类
//
var CPlatform =
{
	newInstance: function( __brt )
	{
		with( this )
		{
			__brt = ( __brt || getBrowserType()).toLowerCase();

			switch( __brt )
			{
				case 'ipanel': return new CPlatform_iPanel(); break;
				case 'evm': return new CPlatform_EVM(); break;
				case 'inspur': return new CPlatform_Inspur(); break;
				default: return new CPlatform_General(); break;
			}
		}
	}

	,getBrowserType: function()
	{
		try
		{
			with( this )
			{
				var ua = navigator.userAgent.toLowerCase();

				return /ipanel/.test(ua) ? 'iPanel'
					: /enrich/.test(ua) ? 'EVM'
					: /wobox/.test(ua) ? 'Inspur'
					: window.ActiveXObject ? 'IE'
					: document.getBoxObjectFor || /firefox/.test(ua) ? 'FireFox'
					: window.openDatabase && !/chrome/.test(ua) ? 'Safari'
					: /opr/.test(ua) ? 'Opera'
					: window.MessageEvent && !document.getBoxObjectFor ? 'Chrome'
					: ''
					;
			}
		}
		catch( E ){}
	}
}

//
// CPlatform_Base
// 基类
//
function CPlatform_Base( P )
{
	this.ua = navigator.userAgent.toLowerCase();
	this.browserType = CPlatform.getBrowserType();
	this.version = ( this.ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"] )[1];
}

CPlatform_Base.prototype =
{
	// properties:
	className: 'CPlatform_Base'
	,classId: $.newUniqueId(this)

	,ptInst: null		// 终端对象实例
	,ptInstId: 0		// 实例 ID

	// Methods:

	// 获取 mac-id
	,macId: function( )
	{
		// by derived class
		return '123456789ABC';
	}

	// 取智能卡号
	,cardSN: function()
	{
		// by derived class
		return '[CA00]';
	}

	// 获取取浏览器版本信息
	,versionInfo: function()
	{
		// by derived class
		return this.ua;
	}
}

//
// CPlatform_iPanel
// iPanel 子类
//
/*
function CPlatform_iPanel( P )
{
}

CPlatform_iPanel.prototype = new CPlatform_Base();
CPlatform_iPanel.prototype.extend = swat.extend;
CPlatform_iPanel.prototype.extend(
{
});
*/

//
// CPlatform_EVM
// EVM 子类
//
function CPlatform_EVM( P )
{
}

CPlatform_EVM.prototype = new CPlatform_Base();
CPlatform_EVM.prototype.extend = swat.extend;
CPlatform_EVM.prototype.extend(
{
	// Properties:
	className: 'CPlatform_EVM'
	,classId: $.newUniqueId(this)

	// Methods:

	// 获取播放器实例
	,getInstance: function()
	{
		with( this )
		{
			if( ptInst == null )
			{
				ptInst = new EnReach();
			}

			return ptInst;
		}
	}

	// 获取 mac-id
	,macId: function( )
	{
		try
		{
			return this.getInstance().GetMACAddress();
		}
		catch( E ){}
	}

	// 取智能卡号
	,cardSN: function()
	{
		try
		{
			return this.getInstance().GetSTBID();
		}
		catch( E ){}
	}

	// 获取取浏览器版本信息
	,versionInfo: function()
	{
		try
		{
			return this.getInstance().CodeTimestamp();
		}
		catch( E ){}
	}
});

//
// CPlatform_Inspur
// Inspur 子类
//
function CPlatform_Inspur( P )
{
}

CPlatform_Inspur.prototype = new CPlatform_Base();
CPlatform_Inspur.prototype.extend = swat.extend;
CPlatform_Inspur.prototype.extend(
{
	// Properties:
	className: 'CPlatform_Inspur'
	,classId: $.newUniqueId(this)

	// Methods:

	// 获取播放器实例
	,getInstance: function()
	{
		with( this )
		{
			if( ptInst == null )
			{
				ptInst = iSTB;
			}

			return ptInst;
		}
	}

	// 获取 mac-id
	,macId: function( )
	{
		try
		{
			return '';
			//return this.getInstance().GetMACAddress();
		}
		catch( E ){}
	}

	// 取智能卡号
	,cardSN: function()
	{
		try
		{
			with( this )
			{
				return getInstance().settings.get( 'sys:ca0:cardnumber' ) || '[N/A]';
			}
		}
		catch( E ){}
	}
});


//
// CPlatform_General
// Gerneral 子类
//
function CPlatform_General( P )
{
	// 初始化实例
	this.getInstance();
}

CPlatform_General.prototype = new CPlatform_Base();
CPlatform_General.prototype.extend = swat.extend;
CPlatform_General.prototype.extend(
{
	// Properties:
	className: 'CPlatform_General'
	,classId: $.newUniqueId(this)

	// Methods:

	// 获取播放器实例
	,getInstance: function()
	{
		with( this )
		{
			if( ptInst == null )
			{
				ptInst = {};
			}

			return ptInst;
		}
	}

	// 获取 mac-id
	,macId: function( )
	{
		return '[PC]';
	}

});

}
else
{
	alert('Need swat3.js');
}