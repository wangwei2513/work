var data = {
	    textArr : ["","恢复出厂设置将清空您之前的所有数据！您确定吗？"],
	    selectText :["确定","取消"]
};

var dialog_tipsCss = {
		divConName : "",//整个div名称，不给的话，默认值：_divContainer
		textName:"",//上方内容div名称，默认值是_textDiv
		btnName : "_D",//上方的div名称，不给的话是默认值,如_D1、_D2、_D3、_D4
		btnCount :2,//下方选择按钮的数量，默认情况是三个
	    menu_type : 0,     //0，高清，1,标清(720*576) 2：标清(640*576),如果不给，会根据屏幕大小确定
		topBorder:"2px #e0e0e0 solid",
		nameColor:"#000000",//名称的颜色
		textColor:"#000000",//内容的颜色
		data:data,
		"BG":{	//弹出框
			backgroundColor:"#fffeea", 
			opacity:"1", 
			position:"absolute",
			visibility:"hidden",
			overFlow:"hidden",
			zIndex:"55",
			left:"445px",//如果不给就取默认值
			top:"220px",
			width:"390px",
			height:"150px"
			},
		"divTop":{//内容div
			 position:"absolute",
			 backgroundColor:"#fffeea", 
			 color:"#FFFFFF",    
			 fontSize:"23px",
			 height:"100px"
		},
		 "divCon":{//选择按钮
			 position:"absolute",
			 backgroundColor:"#fffeea", 
			 textAlign:"center",
			 color:"#a1a1a1",
			 fontSize:"23px",
			 borderTop:"1px #e0e0e0 solid"
		 },
		 "focusDiv":{//焦点框
		      backgroundColor:"#ffca28",
			  color:"#000000"
		 }
	
};
var wifi_tipsCss = {
		divConName : "",//整个div名称，不给的话，默认值：_divContainer
		textName:"",//上方内容div名称，默认值是_textDiv
		btnName : "_D",//上方的div名称，不给的话是默认值,如_D1、_D2、_D3、_D4
		btnCount :2,//下方选择按钮的数量，默认情况是三个
	    menu_type : 0,     //0，高清，1,标清(720*576) 2：标清(640*576),如果不给，会根据屏幕大小确定
		topBorder:"2px #e0e0e0 solid",
		nameColor:"#ffffff",//名称的颜色
		textColor:"#afb0af",//内容的颜色

		data:{
	            textArr : ["","","",""],
	            selectText :["连 接","取 消"]
         },
		"BG":{	//弹出框
			backgroundColor:"#fffeea", 
			opacity:"1", 
			position:"absolute",
			visibility:"hidden",
			overFlow:"hidden",
			left:"336px",//如果不给就取默认值
			top:"210px",
			width:"610px",
			height:"300px",
			zIndex:"55"
			},
		"divTop":{//内容div
			 position:"absolute",
			 backgroundColor:"#fffeea", 
			 color:"#FFFFFF",    
			 fontSize:"23px"
		},
		 "divCon":{//选择按钮
			 position:"absolute",
			 backgroundColor:"#fffeea", 
			 textAlign:"center",
			 color:"#a1a1a1",
			 fontSize:"30px",
			 borderTop:"1px #e0e0e0 solid"
		 },
		 "focusDiv":{//焦点框
		      backgroundColor:"#ffca28",
			  color:"#000000"
		 }
	
};


