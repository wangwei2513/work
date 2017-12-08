;(function(){
    var home_page = {};
    var page_list_data = {};
    var ef = new ef_manage();
    bind_key(ef);
    home_page.init = function()
    {
       // console.log('test','width',$('#home_page').width(),'height：',$('#home_page').height());
        //starcorCom.bind_key(ef);
        //alert('in init5');
        starcorCom.get_home_data({'nns_instance_id':'cpcom_menu_1.0'},function(data){
            var page_data = home_page.analysis_home_data(data);
            home_page.create_menu(page_data.menu);
            ef.set_focus('home_menu');
        });
        add_area_btn();
    };
    //解析首页数据
    home_page.analysis_home_data = function(data)
    {
        var page_data = {};
        page_data.list = {};
        for(var i= 0,len=data.length;i<len;i++)
        {
            var _data =data[i];
            if(_data.id == 'cpcom_menu')//菜单
            {
                page_data.menu = home_page.analysis_list_data(_data.data[0].data);
            }else{//推荐数据
                page_data.list[_data.id] = home_page.analysis_list_data(_data.data[0].data);
            }
        }
        page_list_data = page_data.list;
        return page_data;
    };
    home_page.analysis_list_data = function(data)
    {
        var list_data = [];
        for(var i= 0,len = data.length;i<len;i++)
        {
            var _data = data[i],
                __data = _data.data;
            var obj = {};
            obj.name =_data.name;
            obj.img_default = _data.img_default;
            obj.action =__data.action;
            for(var j= 0,_len = __data.arg_list.length;j<_len;j++){
                var _arg_list = __data.arg_list[j];
                obj[_arg_list.k] = _arg_list.v;
            }
            list_data.push(obj);
        }
        return list_data;
    };
    //初始化页面
    home_page.create_menu = function(data)
    {
        var len = Math.min(data.length,3);
        $('#home_page').find(".menu_item").hide();
        for(var i=0;i<len;i++)
        {
            var id = 'home_menu__'+i;
            var $dom = $("#"+id);
            $dom.text(data[i].name);
            $dom.attr('template_id',data[i].template_id);
            $dom.show();
        }
        add_area_menu(len);
    };
    home_page.create_list = function(template_id)
    {
        var data = page_list_data[template_id];
        if(!data)return;
        var len = Math.min(data.length,3);
        $('#home_page').find(".list_item").hide();
        for(var i=0;i<len;i++)
        {
            var id = 'home_list__'+i;
            var $dom = $("#"+id);
            var src = data[i].img_default || '';
            $dom.find('img').attr('src',src);
            $dom.find("span").text(data[i].name);
            $dom.attr('action',data[i].action);
            $dom.attr('index',i+"$$"+template_id);
            $dom.show();
        }
        add_area_list(len);
    };
    //焦点处理
    function add_area_menu(len){
        ef.add_area('home_menu',{
            row:1,
            col:len,
            total:len
        }).on('click',function(ele, idx, dir){

        }).on('focus',function(ele){
            var template_id = $(ele).attr('template_id');
            home_page.create_list(template_id);
        }).on('focusout',function(ele, idx, dir){
            if(dir == 'down')
            {
                ef.set_focus('home_list',0);
            }else if(dir == 'up'){
                ef.set_focus('home_btn',0);
            }
        });
    }
    function add_area_list(len){
        ef.add_area('home_list',{
            row:1,
            col:len,
            total:len
        }).on('click',function(ele){
            var map = $(ele).attr('index').split("$$");
            var index= map[0],
                template_id = map[1];
            var  data = page_list_data[template_id][index];
            switch (data.action){
                case 'm_open_asset_page'://打开列表页
                    open_page('list',data);
                    break;
                case "m_open_detail_page"://打开列表页
                    open_page('detail',data);
                    break;
            }
        }).on('focusout',function(ele, idx, dir){
            if(dir == 'up')
            {
                ef.set_focus('home_menu',0);
            }
        });
    }
    function add_area_btn(){
        var len =  $("#home_btn").find("span").length;
        ef.add_area('home_btn',{
            row:1,
            col:len,
            total:len
        }).on('click',function(ele, idx, dir){
            switch (idx)
            {
                case 0:
                    open_page('search');
                    break;
                case 1:
                    open_page('my_media');
                    break;
            }
        }).on('focusout',function(ele, idx, dir){
            if(dir == 'down')
            {
                ef.set_focus('home_menu',0);
            }
        });
    }
    ef.on_cancel = function ()
    {

        starcorCom.exit();
       // on_cancel();
       // on_cancel();
        //关闭浏览器
    }

    starcorCom.ready(function(){
        home_page.init();
    });
})();