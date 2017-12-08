var varietyPopdata = {//数据数组
	    textArr : ["中国好声音","浙江卫视"],//内容
		totalNum:20,
	    data :[]//有内容的id
};

var varietyPopCss = {
		divConName : "",//整个div名称，不给的话，默认值：_varietyPopCon
		textName:"",//上方内容div名称，默认值是_varietyPopText
		bottomName : "",//下方的div名称，不给的话是默认值_varietyPopBottom
		tdName : "_vPopTd",//下方的div名称，不给的话是默认值,如_vPopTd1、_vPopTd2、_vPopTd3、_vPopTd4
	    menu_type : 0,     //0，高清，1,标清(720*576) 2：标清(640*576),如果不给，会根据屏幕大小确定
		varietyPopdata :varietyPopdata,
		td:{//表格的文字背景等颜色
		      tdBg:"#ffffff",//表格背景色
			  tdcolorS:"#000000",//此集电视内容的日期颜色
			  sizeS:"24px",//此集电视有内容的序号颜色
			  tdcolor:"#d1b100",//“更多”两字的颜色
			  borderColor:"#f0f0f0",
			  titleBg:"#4d4d4d",
			  titleColor:"#ffffff",
			  titleSelBg:"#ffffff",
			  titleSelColor:"#000000"
			 },
		"BG":{	//弹出框
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
		"divTop":{//上面显示内容div的位置颜色等
			 position:"absolute",
			 backgroundColor:"#4d4d4d", 
			 color:"#e3e3e3",    
			 fontSize:"28px",
			 height:"50px",//上方内容div可以给定高度，也可以使用默认高度，其他值无需给定，需使用默认值
			 zIndex:"88"
		},
	  "divCon":{//下方选择内容区域div，此处无需给定定位置大小，上方div大小确定，下方div大小是弹出框出去上方div大小的区域
			 position:"absolute",
			 backgroundColor:"#ffffff", 
			 zIndex:"88",
			 fontSize:"24px",
			 overFlow:"hidden"
		 },
		 
	  "divConLeft":{//左边的图DIv _TVPopBottomLeft
			 position:"absolute",
			 /*background:"url(img/porster.png)", */
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
		 "divConDesc":{//左边的图DIv _TVPopBottomRight
			 position:"absolute",
			 backgroundColor:"#ffffff", 
			 color:"#515151",
			 zIndex:"88",
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