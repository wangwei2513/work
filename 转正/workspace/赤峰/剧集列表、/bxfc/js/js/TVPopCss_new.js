
			  
var TVPopdata = {//数据数组
	    textArr : ["当幸福来敲门(11-12)","CCTV-1"],//内容
	    data :[],//有内容的id
		totalNum:40//总共有多少集电视
};

var TVPopCss = {
		divConName : "",//整个div名称，不给的话，默认值：_TVPopCon
		textName:"",//上方内容div名称，默认值是_TVPopText
		bottomName : "",//下方的div名称，不给的话是默认值_TVPopBottom
		tdName : "_popTd",//下方的div名称，不给的话是默认值,如_popTd1、__popTd2、_popTd3、_popTd4
	    menu_type : 0,     //0，高清，1,标清(720*576) 2：标清(640*576),如果不给，会根据屏幕大小确定
		TVPopdata :TVPopdata,
		td:{//表格的文字背景等颜色
		      tdBg:"#ffffff",//表格背景色
			  tdcolor:"#000000",//此集电视有内容的文字颜色
		      tdcolor1:"#4f4f4f",//"更多"两字的颜色
			  tdcolor2:"#969696", //已经看过的颜色
			  tdcolor3:"#098b0a", //更新的是新的颜色
			  borderColor:"#f0f0f0",
			  titleBg:"#4d4d4d",
			  titleColor:"#ffffff",
			  titleSelBg:"#ffffff",
			  titleSelColor:"#000000"
			 },
		"BG":{	//弹出框 _TVPopCon
			backgroundColor:"#ffffff", 
			opacity:"1", 
			position:"absolute",
			visibility:"visible",
			left:"320px",//如果不给就取默认值
			top:"100px",
			width:"650px",
			height:"450px",
			zIndex:"88",
			webkitTransitionDuration:"600ms"
			},
		"divTop":{//上面显示内容div的位置颜色等 _TVPopText
			 position:"absolute",
			 backgroundColor:"#4d4d4d", 
			 color:"#e3e3e3",    
			 fontSize:"24px",
			 height:"50px",//上方内容div可以给定高度，也可以使用默认高度，其他值无需给定，需使用默认值
			 zIndex:"88"
		},
	  "divCon":{//下方选择内容区域div，此处无需给定定位置大小，上方div大小确定，下方div大小是弹出框出去上方div大小的区域 _TVPopBottom
			 position:"absolute",
			 backgroundColor:"#ffffff", 
			// color:"#000000",//此集电视没有内容的文字颜色
			 color:"#e4e4e4",//此集电视没有内容的文字颜色 kongwm  xiongli  要求跟老版本的一致
			 fontSize:"26px",
			 zIndex:"88",
			 overFlow:"hidden"
		 },
		 
	  "divConLeft":{//左边的图DIv _TVPopBottomLeft
			 position:"absolute",
			 /*background:"url(img/porster.png)", */
			 background:"url(images/global_tm.gif)",
			 zIndex:"88",
			 width:"320px",
			 height:"400px",
			 overFlow:"hidden"
		 },
		 "divConRight":{//左边的图DIv _TVPopBottomRight
			 position:"absolute",
			 backgroundColor:"#ffffff", 
			 zIndex:"88",
			 width:"330px",
			 height:"400px",
			 overFlow:"hidden"
		 },
		 "divConDesc":{//左边的图DIv _TvDesc
			 position:"absolute",
			 backgroundColor:"#ffffff", 
			 color:"#515151",
			 zIndex:"88",
			 fontSize:"24px",
			 width:"100%",
			 height:"100px",
			 lineHeight:"35px",
			 overFlow:"hidden"
		 },
		 "divConRightTable":{//左边的图DIv _TVPopBottomRight
			 position:"absolute",
			 backgroundColor:"#ffffff", 
			 zIndex:"88",
			 overFlow:"hidden"
		 },
	    "focusDiv":{//焦点框
		      backgroundColor:"#ffb400",
			  color:"#000000"
		 },
		 fontFamily:"fzzhunyuan"
	
};