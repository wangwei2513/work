;(function(){
    var my_media_page = {}
    var ef = new ef_manage();
    my_media_page.current_action = 0;
    var current_data = [];
    bind_key(ef);
    my_media_page.init = function()
    {
        user_action.get_playlist(function(data){
            my_media_page.render_list(data);
        });
        add_area_my_media_btn();
        ef.set_focus('my_media_btn');
    };
    my_media_page.render_list = function(data)
    {
        current_data = [];
        var list_data=  data;
        var len = Math.min(list_data.length,5);
        $('.list_item').hide();
        if(len == 0)
        {
            $("#not_data").show();
            $("#my_media_list").hide();
            return;
        }
        $("#not_data").hide();
        $("#my_media_list").show();
        for(var i=0;i<len;i++)
        {
            var __data = list_data[i];
            var $dom = $("#my_media_list__"+i);
            $dom.find('span').text(__data.name);
            $dom.find('img').attr('src',__data.img_small || __data.img_v);
            $dom.attr('nns_id',__data.id);
            $dom.attr('nns_index',i);
            $dom.show();
            current_data.push(__data);
        }
        add_area_list(len);
    }
    function add_area_list(len)
    {
        ef.add_area('my_media_list',{
            row:1,
            col:len,
            total:len
        }).on('click',function(ele, idx, dir){
            var method = '',key="",params = {};
            switch (my_media_page.current_action)
            {
                case 0:
                    key = 'playlist_id';
                    method = 'del_playlist';
                    break;
                case 1:
                    key = 'collect_id';
                    method = 'del_collect';
                    break;
                case 2:
                    key = 'catch_id';
                    method = 'del_catch';
                    break;
            }
            params[key] = $(ele).attr("nns_id");
            do_action(params,method);
        }).on('focusout',function(ele, idx, dir){
            if(dir == 'up')
            {
                ef.set_focus('my_media_btn');
            }
        });
    }
    function add_area_my_media_btn()
    {
        ef.add_area('my_media_btn',{
            row:1,
            col:3,
            total:3
        }).on('click',function(ele, idx, dir){
            var method = '';
            switch (idx)
            {
                case 0:
                    method = 'get_playlist';
                    break;
                case 1:
                    method = 'get_collect';
                    break;
                case 2:
                    method = 'get_catch_list';
                    break;
            }
            my_media_page.current_action = idx;
            user_action[method](function(data){
                my_media_page.render_list(data);
            });
        }).on('focusout',function(ele, idx, dir){
            if(dir == 'down')
            {
                current_data.length != 0  && ef.set_focus('my_media_list',0);
            }
        });
    }

    function do_action(params,method)
    {
        user_action[method](params,function(res)
        {
            if (res.result && (res.result.state == 0 || res.result.state == 10001))
            {
                my_media_page.render_list(res.l.il);
                res.l.il.length == 0 && ef.set_focus('my_media_btn');
            }
        })
    }

    ef.on_cancel = function ()
    {
        on_cancel();
    }
    starcorCom.ready(function(){
        my_media_page.init();
    });
})();