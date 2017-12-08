var index = new Index(),
    focus_index = 0,
    menuData = [];

/*
 * 初始化
 * */
function init(){
    sendAjax("node.js",null,function(data){
        data = eval("("+data+")");
        menuData = data;
    });
    if(mySessionStorage.getItem("focus_index") != 'undefined'){ //判断是否初次加载
        focus_index = parseInt(getGlobalVar("focus_index"));
        index.focusChange();
    }
    index.renderList();
};
function Index() {
    /*
     * 渲染列表
     * */
    this.renderList = function (){
        for(var i=0;i<14;i++){
            $("item_"+i).style.visibility = "visible";
            $("img_"+i).src = menuData[i].focusImageUrl;
            $("title_"+i).innerHTML = menuData[i].name;
        }
    };
    /*
     * 焦点切换逻辑
     * */
    this.focusMove = function (step){
            if(step === -1){
                focus_index -=1;
            }
            else if(step === 1){
                focus_index +=1;
            }
            else if(step === 4){
                focus_index +=4;
            }
            else if(step === -4){
                focus_index -=4;
            }
            else if(step === 5){
                focus_index +=5;
            }
            else if(step === -5){
                focus_index -=5;
            }
            else if(step === 9){
                focus_index +=9;
            }
            else if(step === -9){
                focus_index -=9;
            }
            this.focusChange();
    };
    this.focusChange = function () {
        if(focus_index < 5 && focus_index > 0){
            $("focus_left").style.visibility = "hidden";
            $("focus_right").style.visibility = "visible";
            $("focus_right").style.top = "-10px";
            $("focus_right").style.left = (383+(focus_index - 1)*197)+"px";
        }else if (focus_index > 4 && focus_index < 9){
            $("focus_left").style.visibility = "hidden";
            $("focus_right").style.visibility = "visible";
            $("focus_right").style.top = "167px";
            $("focus_right").style.left = (383+(focus_index - 1)%4*197)+"px";
        }else if (focus_index > 9 && focus_index < 14){
            $("focus_left").style.visibility = "hidden";
            $("focus_right").style.visibility = "visible";
            $("focus_right").style.top = "344px";
            $("focus_right").style.left = (383+(focus_index - 2)%4*197)+"px";
        }else if (focus_index === 0){
            $("focus_right").style.visibility = "hidden";
            $("focus_left").style.visibility = "visible";
            $("focus_left").style.top = (-10+focus_index%2*266)+"px";
        }else if (focus_index === 9){
            $("focus_right").style.visibility = "hidden";
            $("focus_left").style.visibility = "visible";
            $("focus_left").style.top = (-10+focus_index%2*266)+"px";
        }
    };
    /*
     * enter
     * */
    this.doSelect = function (){
        this.focusMemory();
        mySessionStorage.setItem("platformUrl","index.htm");
        window.location.href = menuData[focus_index].linkUrl;
        //window.location.href = 'content.htm'
    };
    this.goBack = function () {
        mySessionStorage.removeItem("focus_index");
    if(havaBackUrl){
        window.location.href = backUrl;
    }else{
        goPortal();
    }
    }
    /**
     * 记录焦点
     *
     */
    this.focusMemory = function (){
        mySessionStorage.setItem("focus_index",focus_index);
    };
}

document.onkeydown = eventHandler;
function eventHandler(eve){
    var e = eve || window.event;
    var keycode = e.keyCode || e.which || e.charCode;
    if(keycode>=48 && keycode <=57){
        index.selectByNum(keycode-48);
    }
    switch(keycode){
        case 1:   // up
        case 38:
        case 87:
            if(focus_index > 4 && focus_index < 9){
                index.focusMove(-4);
            }
            else if (focus_index === 9){
                index.focusMove(-9);
            }
            else if (focus_index > 9){
                index.focusMove(-5);
            }

            return false;
            break;
        case 2:   // down
        case 40:
        case 83:
            if(focus_index > 0 && focus_index < 5){
                index.focusMove(4);
            }
            else if (focus_index === 0){
                index.focusMove(9);
            }
            else if (focus_index > 4 && focus_index < 9 ){
                index.focusMove(5);
            }
            return false;
            break;
        case 3:   // left
        case 37:
        case 65:
            if(focus_index !== 0){
                index.focusMove(-1);
            }
            return false;
            break;
        case 4:   // right
        case 39:
        case 68:
            if(focus_index !== 13){
                index.focusMove(1);
            }
            return false;
            break;
        case 13:  //KEY_SELECT
            index.doSelect();
            return false;
            break;
        case 8:  //KEY_BACK
            window.location.href = "main://index.html";
            return false;
            break;
        case 27:
            return false;
            break;
    }
}