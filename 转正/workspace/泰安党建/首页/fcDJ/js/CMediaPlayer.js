/*******************************************************************************

	CMediaPlayer 类

	媒体播放支持.

	filename: swatMedia.js
	author	: scumyang
	create	: 2013-03-31
	update	:

*******************************************************************************/

/*

# DEMO:

var plat = $.browser.evm ? 'evm' : $.browser.ipanel ? 'ipanel' : 'PC';
var mp = CMediaPlayer.newInstance( plat );
mp.onEvent = function( E )
{
	$.log( 'onEvent: code=' + E.code + ', msg=' + E.message );
}

*/

if( swat && swat.version >= 3.0 )
{

//
// CMediaPlayer 主类
//
var CMediaPlayer =
{
	newInstance: function( K, P )
	{
		switch( K.toLowerCase() )
		{
			case 'ipanel': return new CMediaPlayer_iPanel( P ); break;
			case 'evm': return new CMediaPlayer_EVM( P ); break;
			case 'inspur': return new CMediaPlayer_Inspur( P ); break;
		}

		return {}
	}
}

//
// CMediaPlayer_Base
// 基类
//
function CMediaPlayer_Base( P )
{
}

CMediaPlayer_Base.prototype =
{
	// properties:
	className: 'CMediaPlayer_Base'
	,classId: $.newUniqueId(this)

	,mpInst: null		// 播放器实例
	,mpInstId: 0		// 实例 ID

	,mediaType: ''		// 媒体类型
	,lastURL: ''

	,isFullscreen: 1	// 全屏
	,left: 0			// 视频窗口位置
	,top: 0
	,width: 0
	,height: 0

	,currStatus: 'N/A'	// 当前状态
	,currScale: 0		// 播放速度
	,currVolume: 0		// 当前音量

	,onEvent: 0			// 事件回调

	// Methods:

	// 获取媒体类型
	,getMediaType: function( __url )
	{
		try
		{
			var mt = ''
				,proto = ( __url.match( /.*:\/\// ) + '' ).replace( '://', '' ).toLowerCase();

			switch( proto )
			{
				case 'rtsp': mt = 'VOD'; break;
				case 'https':
				case 'http': mt = 'HTTP'; break;
				case 'delivery': mt = 'DVB'; break;
				case 'udp': mt = "IP-UDP"; break;
				case 'igmp': mediaType = 'LiveTV'; break;
				case 'file': mt = 'FILE'; break;
			}
		}
		catch( E ){}

		return mt;
	}

	// 绑定播放器对象到指定的播放实例
	,bindPlayerInstance: function( __id )
	{
		// by derived class
	}

	// 解绑播放器对象
	,unbindPlayerInstance: function( __id )
	{
		// by derived class
	}

	// 释放播放实例资源
	,releasePlayerInstance: function()
	{
		// by derived class
	}

	// 设置视频格式
	,videoMode: function( __A )
	{
		// by derived class
		return this;
	}

	// 获取/设置视频画面格式
	,videoAspect: function( __A )
	{
		// by derived class
		return this;
	}

	// 获取/设置视频窗口可见性
	// @__F: 立即生效 (* VOD 时将向前端发送 PLAY 指令造成画面停顿)
	,visible: function( __A, __F )
	{
		// by derived class
		return this;
	}

	// 获取/设置视频窗口位置
	,windowPos: function( __A, __F )
	{
		// by derived class
		return this;
	}

	// 获取/设置全屏播放
	,fullscreen: function( __A, __F )
	{
		// by derived class
		return this;
	}

	// 获取媒体时长
	,duration: function()
	{
		// by derived class
	}

	// 获取/设置视频播放速度(数值型)
	,playScale: function( __A, __F )
	{
		// by derived class
	}

	// 获取/设置当前播放时间点
	,playPoint: function( __A, __F )
	{
		// by derived class
	}

	// 获取/设置静音状态
	,mute: function( __A )
	{
		// by derived class
	}

	// 获取当前播放状态(string)
	// N/A-未初始化, Open-打开媒体, Ready-就绪, Play-播放, Pause-暂停, Stop-停止(已播放过), Scale-倍速调整, Seek-定位中, Invalid-无效(实例已销毁)
	,status: function()
	{
		// by derived class
		return this.currStatus;
	}

	// 获取基本流信息
	,elementaryStreamInfo: function()
	{
		// by derived class
		return this;
	}
}

//
// CMediaPlayer_iPanel
// iPanel 子类
//
function CMediaPlayer_iPanel( P )
{
}

CMediaPlayer_iPanel.prototype = new CMediaPlayer_Base();
CMediaPlayer_iPanel.prototype.extend = swat.extend;
CMediaPlayer_iPanel.prototype.extend(
{
	// Properties:
	className: 'CMediaPlayer_iPanel',
	classId: $.newUniqueId(this),

	// Methods:
	getInstance: function()
	{
		return media.AV;
	},

	open: function( __url )
	{
		try
		{
			with( this )
			{
				var mt = getMediaType( __url );

				VOD.changeServer( 'isma_v2', 'ip_ts' );
				//VOD.serviceStart();
				//VOD.server.mode = "IP";

				// mediaType: MPEG,MPG,DivX,MP3,AVI,VOD,TSTV,TVOD,LiveTV,UDP,DVB,localfile,PVR
				media.AV.open( __url, mt );
			}
		}
		catch( E )
		{
		}

		return this;
	},

	play: function()
	{
		try
		{
			media.AV.play();
		}
		catch( E )
		{
		}

		return this;
	},

	stop: function()
	{
		try
		{
			media.AV.stop();
		}
		catch( E )
		{
		}

		return this;
	},

	pause: function()
	{
		try
		{
			media.AV.pause();
		}
		catch( E )
		{
		}

		return this;
	},

	close: function()
	{
		try
		{
			media.AV.stop();
			media.AV.close();
			DVB.stopAV();
		}
		catch( E )
		{
		}

		return this;
	},

	setWindowPosition: function( __x, __y, __w, __h )
	{
		try
		{
			media.video.setPosition( __x, __y, __w, __h );
		}
		catch( E )
		{
		}

		return this;
	},

	fullScreen: function()
	{
		try
		{
			media.video.fullScreen();
		}
		catch( E )
		{
		}

		return this;
	},

	setVolume: function( A )
	{
		try
		{
			// var o = iPanel.pageWidgets.getByName('volume');
			// o.init();
			// o.show();
			switch( A )
			{
				case '+': media.sound.value += 5; break;
				case '-': media.sound.value -= 5; break;
				default: media.sound.value = A;
			}
		}
		catch( E ){}

		return this;
	},

	scale: function( A, N )
	{
		try
		{
			if( A > 0 ) media.AV.forward( A );
			else media.AV.backward( A );
		}
		catch( E )
		{
		}

		return this;
	},

	seek: function( N )
	{
		try
		{
			media.AV.seek( N );
		}
		catch( E )
		{
		}

		return this;
	},

	getStatus: function()
	{
		try
		{
			var s = '';
			switch( media.AV.status )
			{
				case 'play': s = '播放中'; break;
				case 'pause': s = '暂停'; break;
				case 'forward': s = '快进'; break;
				case 'backward': s = '快退'; break;
				case 'repeat': s = '重播'; break;
				case 'slow': s = '慢放'; break;
				case 'stop': s = '停止'; break;
			}
		}
		catch( E )
		{
		}
	},

	getServerList: function()
	{
		try
		{
			return VOD.serverList;
		}
		catch( E )
		{
		}

		return null;
	},

	getMediaInfo: function()
	{
		try
		{
			return {duration: media.AV.duration, progress: media.AV.progress, elapsed: media.AV.elapsed, speed: media.AV.speed}
		}
		catch( E )
		{
			return {duration:0, progress:0, elapsed:0, speed:0}
		}
	},

	strerror: function( __errcode )
	{
		var s = '';
		switch( __errcode )
		{
			case 5974: s = '页面加载完成'; break;
			case 5200: s = '请求时移列表'; break;
			case 5220: s = 'VOD 模块启动成功'; break;
			case 5225: s = 'User Exception'; break;
			case 5228: s = '正在连接服务器...'; break;
			case 5202: s = '缓冲完成'; break;				// EIS_VOD_PREPAREPLAY_SUCCESS
			case 5203: s = '连接服务器失败'; break;
			case 5205: s = '媒体播放成功'; break;			// EIS_VOD_PLAY_SUCCESS
			case 5206: s = '媒体播放失败'; break;
			case 5210: s = '播放结束'; break;
			case 5228: s = '停止播放成功'; break;
			case 5351: s = '解码器关闭'; break;				// CA_MESSAGE_CLOSE
			case 8002: break;
			default:;
		}

		return s;
	}
});


//
// CMediaPlayer_EVM
// EVM 子类
//
function CMediaPlayer_EVM( P )
{
	// 初始化实例
	this.getInstance();

	// 注册系统事件
	var I = this;
	$(document).event
	(
		'systemevent',
		(
			function()
			{
				return function( E )
				{
					if( $.isFunction( I.onEvent )) I.onEvent( I.eventObject( E ) );
				}
			}
		)()
	);
}

CMediaPlayer_EVM.prototype = new CMediaPlayer_Base();
CMediaPlayer_EVM.prototype.extend = swat.extend;
CMediaPlayer_EVM.prototype.extend(
{
	// Properties:
	className: 'CMediaPlayer_EVM'
	,classId: $.newUniqueId(this)

	,mpName: 'Video'		// 播放器实例名
	,mpZindex: 1			// 视频窗口 OSD 层次

	// Methods:

	// 获取播放器实例
	,getInstance: function()
	{
		with( this )
		{
			if( mpInst == null )
			{
				mpInst = new MediaPlayer();
				mpInstId = mpInst.createPlayerInstance( mpName, mpZindex );
				currVolume = mpInst.getVolume();
			}

			return mpInst;
		}
	}

	// 绑定播放器对象到指定的播放实例
	,bindPlayerInstance: function( __id )
	{
		try
		{
			return this.getInstance().bindPlayerInstance( __id );
		}
		catch( E ){}
	}

	// 解绑播放器对象
	,unbindPlayerInstance: function()
	{
		try
		{
			return this.getInstance().unBindPlayerInstance();
		}
		catch( E ){}
	}

	// 释放播放实例资源
	,releasePlayerInstance: function()
	{
		try
		{
			return this.getInstance().releasePlayerInstance();
		}
		catch( E ){}
	}

	// 设置视频格式
	// @__A:
	//	1:PAL, 2:NTSC, 3:SECAM, 4:(默认)Auto
	,videoMode: function( __A )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return getInstance().videoMode;

				getInstance().videoMode = __A;
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置视频画面格式
	// @__A:
	//	1-16:9, 2-4:3 Combined, 3-4:3 Pan-Scan, 4-4:3 Letter-Box, 5-全屏, 6-(默认)Auto
	,videoAspect: function( __A )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return getInstance().videoAspect;

				getInstance().videoAspect = __A;
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置视频窗口可见性
	// @__A:
	//	1:可见, 0:不可见
	,visible: function( __A, __F )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return getInstance().visible;

				getInstance().visible = __A == 1 ? 1 : 0;
				if( !__F ) getInstance().refresh();
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置视频窗口位置
	,windowPos: function( __x, __y, __w, __h, __F )
	{
		try
		{
			with( this )
			{
				//if( $.isUndefined( __h )) return { left:left, top:top, width:width, height:height }

				left = __x;
				top = __y;
				width = __w;
				height = __h;
				getInstance().position = isFullscreen + ', ' + left + ', ' + top + ', ' + width + ', ' + height;

				if( __F ) getInstance().refresh();
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置全屏播放
	// @__A:
	//	1:全屏, 0:取消全屏
	,fullscreen: function( __A, __F )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return isFullscreen;

				isFullscreen = __A;
				getInstance().position = __A == 1 ? '1, 0, 0, 0, 0' : ( '0, ' + left + ', ' + top + ', ' + width + ', ' + height );

				if( !__F ) getInstance().refresh();
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置视频播放速度(数值型)
	// 1:(默认)前进, -1:后退
	// 2|4|8|16|32:快进, -2|-4|-8|-16|-32:快退
	// 1/2|1/4|8/1|1/16:慢进, -1/2|-1/4|-8/1|-1/16:慢退
	,playScale: function( __A, __F )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A ))
				{
					currScale = getInstance().pace;
					return currScale;
				}

				getInstance().pace = __A;

				if( !__F ) getInstance().refresh();
				currScale = getInstance().pace;
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置当前播放时间点(秒)
	,playPoint: function( __A, __F )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return getInstance().currentPoint;

				getInstance().point = __A;
				if( !__F ) getInstance().refresh();
			}
		}
		catch( E ){}

		return this;
	}

	// 播放定位
	,seek: function( __A, __F )
	{
		this.currStatus = 'Seek';
		return this.playPoint( __A, __F );
	}

	// 获取媒体时长
	// 返回格式: "hh:mm:ss"
	,duration: function()
	{
		try
		{
			return this.getInstance().getMediaDuration;
		}
		catch( E ){}
	}

	// 获取/设置音量
	// @__A:
	//	空值, 返回当前音量
	//	0~31, 设置当前音量
	,volume: function( __A )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A ))
				{
					currVolume = getInstance().getVolume();
					return currVolume;
				}

				switch( __A )
				{
					case '+': currVolume += 5; break;
					case '-': currVolume -= 5; break;
					default: currVolume = __A;
				}
			}

			getInstance().setVolume( currVolume );
			currVolume = getInstance().getVolume();
		}
		catch( E ){}

		return this;
	}

	// 获取/设置静音状态(只影响当前播放实例)
	// @__A:
	//	空值, 返回当前音量
	//	0:设置静音, 1:取消静音
	,mute: function( __A )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return this.getInstance().getMute() == 1 ? true : false;

				__A == 1 ? getInstance().audioMute() : getInstance().audioUnmute();
			}
		}
		catch( E ){}

		return this;
	}

	//取基本流信息
	,getElementaryStreamInfo: function()
	{
		try
		{
			return this.getInstance().EleStreams;
		}
		catch( E ){}
	}

	// 开启媒体
	,open: function( __url )
	{
		try
		{
			with( this )
			{
				mediaType = getMediaType( __url );
				getInstance().source = __url;
				currStatus = 'Open';
			}
		}
		catch( E ){}

		return this;
	}

	// 播放
	,play: function()
	{
		try
		{
			with( this )
			{
				currStatus = 'Play';
				return getInstance().play();
			}
		}
		catch( E ){}
	}

	// 停止
	,stop: function()
	{
		try
		{
			with( this )
			{
				currStatus = 'Stop';
				return getInstance().stop();
			}
		}
		catch( E ){}
	}

	// 暂停播放
	// 1: 显示最后帧, 0: 黑场
	,pause: function( __A )
	{
		try
		{
			with( this )
			{
				currStatus = 'Pause';
				return getInstance().pause( __A == 1 ? 1 : 0 );
			}
		}
		catch( E ){}

		return this;
	}

	// 停止播放
	,close: function()
	{
		try
		{
			with( this )
			{
				currStatus = 'Invalid';
				return releasePlayerInstance();
			}
		}
		catch( E ){}
	}

	// 获取播放状态
	,status: function()
	{
		try
		{
			return this.currStatus;
		}
		catch( E ){}
	}

	// 获取播放信息
	,getPlayInfo: function()
	{
		try
		{
			return '';
			//return {duration: media.AV.duration, progress: media.AV.progress, elapsed: media.AV.elapsed, speed: media.AV.speed}
		}
		catch( E )
		{
			return {duration:0, progress:0, elapsed:0, speed:0}
		}
	}

	// 获取系统事件对应的字符串
	,eventObject: function( __E )
	{
		var D =
		{
			     '0': {c:0,		t:'Unknown Event'				,a:'N/A'}
			,'10901': {c:10901, t:'MEDIA_PLAY_END'				,a:'END 结束播放'}
			,'10902': {c:10902, t:'MEDIA_PLAY_START'			,a:'START 开始播放'}
			,'10903': {c:10903, t:'MEDIA_SM_S1_SETUP'			,a:'S1.SETUP'}
			,'10904': {c:10904, t:'MEDIA_SM_S1_TEARDOWN'		,a:'S1.TEARDOWN'}
			,'10905': {c:10905, t:'MEDIA_SM_S1_ANNOUNCE'		,a:'S1.ANNOUNCE'}
			,'10906': {c:10906, t:'MEDIA_SM_S1_PING'			,a:'S1.PING'}
			,'10907': {c:10907, t:'MEDIA_VSS_C1_PLAY'			,a:'C1.PLAY 播放'}
			,'10908': {c:10908, t:'MEDIA_VSS_C1_PAUSE'			,a:'C1.PAUSE 暂停'}
			,'10909': {c:10909, t:'MEDIA_VSS_C1_ANNOUNCE'		,a:'C1.ANNOUNCE 通知'}
			,'10910': {c:10910, t:'MEDIA_VSS_C1_GETPARAMETER'	,a:'C1.GETPARAMETER 获取参数'}
			,'10911': {c:10911, t:'MEDIA_VSS_C1_SETPARAMETER'	,a:'C1.SETPARAMETER 设置参数'}
			,'10912': {c:10912, t:'MEDIA_SM_SETUP_TIMEOUT'		,a:'SM.SETUP 超时'}
			,'10913': {c:10913, t:'MEDIA_SM_TEARDOWN_TIMEOUT'	,a:'SM.TEARDOWN 超时'}
			,'10914': {c:10914, t:'MEDIA_SM_PING_TIMEOUT'		,a:'SM.PING 超时'}
			,'10915': {c:10915, t:'MEDIA_VSS_PLAY_TIMEOUT'		,a:'C1.PLAY 超时'}
			,'10916': {c:10916, t:'MEDIA_VSS_PAUSE_TIMEOUT'		,a:'C1.PAUSE 超时'}
			,'10917': {c:10917, t:'MEDIA_VSS_GETP_TIMEOUT'		,a:'C1.GETPARAMETER 超时'}
			,'10918': {c:10918, t:'MEDIA_VSS_SETP_TIMEOUT'		,a:'C1.SETPARAMETER 超时'}
			,'10919': {c:10919, t:'MEDIA_NGOD_ES_TIMEOUT'		,a:'NGOD.ES 超时'}
			,'10920': {c:10920, t:'MEDIA_NGOD_REES_TIMEOUT'		,a:'NGOD.REES 超时'}
			,'10921': {c:10921, t:'MEDIA_NGOD_PMT_NOTFOUND'		,a:'NGOD.PMT 未找到'}
		}

		var id = __E.which;
		D[id] ? 0 : id = 0;

		return {code:D[id].c, msg:D[id].t, msga:D[id].a, instance:this}
	}
});


//
// CMediaPlayer_Inspur
// Inspur 子类
//
function CMediaPlayer_Inspur( P )
{
	// 初始化实例
	this.getInstance( P );
}

CMediaPlayer_Inspur.prototype = new CMediaPlayer_Base();
CMediaPlayer_Inspur.prototype.extend = swat.extend;
CMediaPlayer_Inspur.prototype.extend(
{
	// Properties:
	className: 'CMediaPlayer_Inspur'
	,classId: $.newUniqueId(this)

	,jsInst: 0

	// Methods:

	// 获取播放器实例
	,getInstance: function( P )
	{
		with( this )
		{
			if( mpInst == null )
			{
				mpInst = iSTB.player;
				jsInst = P;
				//currVolume = mpInst.getVolume();

				// 注册系统回调
				iSTB.evt.set_event_callback( jsInst + '.eventCallback' );
			}

			return mpInst;
		}
	}

	// 获取/设置视频窗口位置
	,windowPos: function( __x, __y, __w, __h )
	{
		try
		{
			with( this )
			{
				//if( $.isUndefined( __h )) return { left:left, top:top, width:width, height:height }

				left = __x;
				top = __y;
				width = __w;
				height = __h;

				getInstance().set_video_window( left, top, width, height );
				//getInstance().position = isFullscreen + ', ' + left + ', ' + top + ', ' + width + ', ' + height;
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置全屏播放
	// @__A:
	//	1:全屏, 0:取消全屏
	,fullscreen: function( __A )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return isFullscreen;

				isFullscreen = __A;
				//getInstance().position = __A == 1 ? '1, 0, 0, 0, 0' : ( '0, ' + left + ', ' + top + ', ' + width + ', ' + height );
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置视频播放速度(数值型)
	// 1:(默认)前进, -1:后退
	// 2|4|8|16|32:快进, -2|-4|-8|-16|-32:快退
	// 1/2|1/4|8/1|1/16:慢进, -1/2|-1/4|-8/1|-1/16:慢退
	,playScale: function( __A )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A ))
				{
					//currScale = getInstance().pace;
					return currScale;
				}

				//getInstance().pace = __A;
				//currScale = getInstance().pace;
			}
		}
		catch( E ){}

		return this;
	}

	// 获取/设置当前播放时间点(秒)
	,playPoint: function( __A, __F )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A )) return getInstance().get_position();
				//getInstance().point = __A;
			}
		}
		catch( E ){}

		return this;
	}

	// 播放定位
	,seek: function( __A, __F )
	{
		this.currStatus = 'Seek';
		return this.getInstance().seek( __A );
	}

	// 获取媒体时长
	// 返回格式: "hh:mm:ss"
	,duration: function()
	{
		try
		{
			return this.getInstance().get_duration();
		}
		catch( E ){}
	}

	// 获取/设置音量
	// @__A:
	//	空值, 返回当前音量
	//	0~31, 设置当前音量
	,volume: function( __A )
	{
		try
		{
			with( this )
			{
				if( $.isUndefined( __A ))
				{
					//currVolume = getInstance().getVolume();
					return currVolume;
				}

				switch( __A )
				{
					case '+': currVolume += 5; break;
					case '-': currVolume -= 5; break;
					default: currVolume = __A;
				}
			}

			//getInstance().setVolume( currVolume );
			//currVolume = getInstance().getVolume();
		}
		catch( E ){}

		return this;
	}

	// 获取/设置静音状态(只影响当前播放实例)
	// @__A:
	//	空值, 返回当前音量
	//	0:设置静音, 1:取消静音
	,mute: function( __A )
	{
		try
		{
			with( this )
			{
				//if( $.isUndefined( __A )) return this.getInstance().getMute() == 1 ? true : false;
				//__A == 1 ? getInstance().audioMute() : getInstance().audioUnmute();
			}
		}
		catch( E ){}

		return this;
	}

	//取基本流信息
	,getElementaryStreamInfo: function()
	{
		try
		{
			//return this.getInstance().EleStreams;
		}
		catch( E ){}
	}

	// 开启媒体
	,open: function( __url )
	{
		try
		{
			with( this )
			{
				this.currStatus = 'Open';
				play( __url );
			}
		}
		catch( E ){}

		return this;
	}

	// 播放
	,play: function( __url )
	{
		try
		{
			with( this )
			{
				this.currStatus = 'Play';
				lastURL = __url || lastURL;
				return getInstance().play( lastURL );
			}
		}
		catch( E ){}
	}

	// 停止
	,stop: function()
	{
		try
		{
			with( this )
			{
				this.currStatus = 'Stop';
				return getInstance().stop();
			}
		}
		catch( E ){}
	}

	// 暂停播放
	// 1: 显示最后帧, 0: 黑场
	,pause: function( __A )
	{
		try
		{
			with( this )
			{
				if(__A){
					this.currStatus = 'Pause';
					getInstance().pause();
				}else{
					this.currStatus = 'Play';	
					getInstance().resume();
				}
				//return __A ? getInstance().pause() : getInstance().resume();
			}
		}
		catch( E ){}

		return this;
	}

	// 停止播放
	,close: function()
	{
		try
		{
			with( this )
			{
				this.currStatus = 'Invalid';
				return this;
			}
		}
		catch( E ){}
	}

	// 获取播放状态
	,status: function()
	{
		try
		{
			return this.currStatus;
		}
		catch( E ){}
	}

	// 获取播放信息
	,getPlayInfo: function()
	{
		try
		{
			return '';
			//return {duration: media.AV.duration, progress: media.AV.progress, elapsed: media.AV.elapsed, speed: media.AV.speed}
		}
		catch( E )
		{
			return {duration:0, progress:0, elapsed:0, speed:0}
		}
	}

	// 获取系统事件对应的字符串
	,eventObject: function( __E )
	{
		var D =
		{
			 '0':					 {c:0,    t:'Unknown Event'			,a:'N/A'}
			,'DVB_TUNER_UNLOCK':	 {c:2011, t:'DVB_TUNER_UNLOCK'		,a:'信号线断开'}	// EV=259, T=1
			,'EVENT_NETWORK_STATUS': {c:2111, t:'EVENT_NETWORK_STATUS'	,a:'网线断开'}	// 3断开, 2连接
			,'EVENT_RTSP_HEARTBEAT': {c:8011, t:'EVENT_RTSP_HEARTBEAT'	,a:'RTSP 心跳'}
			,'PLAYER_BUFFERING_END': {c:8001, t:'PLAYER_BUFFERING_END'	,a:'缓冲完成'}
			,'PLAYER_FINISH':		 {c:8061, t:'PLAYER_FINISH'			,a:'播放完成'}
			,'PLAYER_PLAY_STOP':	 {c:8081, t:'PLAYER_PLAY_STOP'		,a:'停止播放'}
			,'STB_RUNNING_TIME_OVERFLOW': {c:1011, t:'STB_RUNNING_TIME_OVERFLOW'	,a:'STB 超时'}
		}

		var id = __E;
		D[id] ? 0 : id = '0';

		return {code:D[id].c, msg:D[id].t, msga:D[id].a, msgo:__E, instance:this}
	}

	,eventCallback: function( T, EN, ET, EV )
	{
		with( this )
		{
			if( EN!='DVB_TUNER_UNLOCK') $LOG.log('T='+T+', EN='+EN+', ET='+ET+', EV='+EV);
			if( $.isFunction( onEvent )) onEvent( eventObject( EN ) );
		}
	}
});

}
else
{
	alert('Need swat3.js');
}