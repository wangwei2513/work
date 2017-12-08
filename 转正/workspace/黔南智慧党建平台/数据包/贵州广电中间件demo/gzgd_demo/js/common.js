try{
    var Webview = starcorExt;
    var utility = Utility;
}catch(e) {}
//绑定按键
function bind_key(ef)
{
    if(window.starcorExt)
    {
        try{
            starcorExt.requestFocus();
            starcorExt.setKeyEventHandler(function (action, keyCode, keyName, metaState)
            {
                console.log('test',"____________keyName",keyName);
                var e = {
                    keyCode: keyCode,
                    key_name : keyName
                };
                ef.bind_key(e);
            });
        }
        catch(e)
        {
            document.onkeydown = function (event)
            {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                // console.log("____________document");
                if (e)
                {
                    // console.log("____________keyCode", e.keyCode);
                    switch (e.keyCode)
                    {
                        case 27:
                        case 8:
                            e.key_name = "esc";
                            break;
                        case 37:
                            e.key_name = "left";
                            break;
                        case 39:
                            e.key_name = "right";
                            break;
                        case 13:
                            e.key_name = "enter";
                            break;
                        case 38:
                            e.key_name = "up";
                            break;
                        case 40:
                            e.key_name = "down";
                            break;
                        case 32:
                            e.key_name = "menu";
                            break;
                    }
                    ef.bind_key(e);
                }
            }
        }
    }
    else if(utility)
    {
        console.log('test',"in bind_key____________utility");
        document.onirkeypress = grab_event;
        document.onkeypress = grab_event;
        function grab_event(e){
            var _code = e.which || e.keyCode;
            if(_code)
            {
                switch(_code)
                {
                    case 27:
                    case 8:
                        e.key_name = "esc";
                        break;
                    case 37:
                        e.key_name = "left";
                        break;
                    case 39:
                        e.key_name = "right";
                        break;
                    case 13:
                        e.key_name = "enter";
                        break;
                    case 38:
                        e.key_name = "up";
                        break;
                    case 40:
                        e.key_name = "down";
                        break;
                    case 32:
                        e.key_name = "menu";
                        break;
                }
                ef.bind_key(e);
            }


        }
    }
    else
    {
        //监听按键
        document.onkeydown = function (event)
        {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            // console.log("____________document");
            if (e)
            {
                // console.log("____________keyCode", e.keyCode);
                switch (e.keyCode)
                {
                    case 27:
                    case 8:
                        e.key_name = "esc";
                        break;
                    case 37:
                        e.key_name = "left";
                        break;
                    case 39:
                        e.key_name = "right";
                        break;
                    case 13:
                        e.key_name = "enter";
                        break;
                    case 38:
                        e.key_name = "up";
                        break;
                    case 40:
                        e.key_name = "down";
                        break;
                    case 32:
                        e.key_name = "menu";
                        break;
                }
                ef.bind_key(e);
            }
        }
    }
}
//跳转页面
function open_page(type,data)
{
    var src = '';
    switch (type){
        case 'list':
            src = 'list.html';
            break;
        case 'detail':
            src = 'detail.html';
            break;
        case 'search':
            src = 'search.html';
            break;
        case 'my_media':
            src = 'my_media_page.html';
            break;
    }
    creat_url(src,data);
}
function creat_url(url,data)
{
    var data_arr = [];
    for(var key in data)
    {
        data[key] && data_arr.push(key+'='+data[key]);
    }
    location.href = url +'?'+data_arr.join('&');
}
//返回
function on_cancel()
{
    console.log('_______________cancel');
    setTimeout(function(){
        console.log('_______________cancel in');
        history.go(-1);
    },10);
}
//URL参数
function get_url_data()
{
    var obj = {};
    try{
        var search = location.href.split("?")[1].split("&");
        for(var i= 0,len=search.length;i<len;i++){
            var _data = search[i].split("=");
            obj[_data[0]] = _data[1];
        }
    }catch(e)
    {

    }
    return obj
}

//jquery 一些方法

