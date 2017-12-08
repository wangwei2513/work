;
(function ()
{
    var search = {}
    var ef = new ef_manage();
    bind_key(ef);
    search.page_data = [];
    search.init = function ()
    {
        search.get_search_list('a');
        add_area_input();
        ef.set_focus('search_input');
    }
    search.get_search_list = function (value)
    {
        var params = {
            nns_media_assets_category_id : '',
            nns_video_type : '0',
            nns_search_type :'name_firstchar',
            nns_search_key : value
        };
        starcorCom.search_media_assets(params, function (data)
        {
            search.render_list(data.item);
        })
    }
    search.render_list = function (data)
    {
        var list_data = data;
        var len = Math.min(list_data.length, 5);
        $('.list_item').hide();
        if (len == 0)
        {
            $("#not_data").show();
            $("#search_list").hide();
            return;
        }
        $("#not_data").hide();
        $("#search_list").show();
        for (var i = 0; i < len; i++)
        {
            var __data = list_data[i];
            var $dom = $("#search_list__" + i);
            $dom.find('span').text(__data.name);
            $dom.find('img').attr('src', __data.img_small || __data.img_v);
            $dom.attr('nns_id', __data.id);
            $dom.attr('index', i);
            $dom.show();
        }
        search.page_data = list_data;
        add_area_list(len);
    };
    function add_area_list(len)
    {
        var row = Math.ceil(len / 4),
            col = Math.min(len,4);
        ef.add_area('search_list', {
            row : row,
            col : col,
            total : len
        }).on('click', function (ele, idx, dir)
        {
            console.log("______________in click");
            var index = $(ele).attr("index");
            console.log("______________index",index);
            var data = search.page_data[index];
            open_page('detail', {
                video_id : data.video_id,
                video_type: data.video_type,
                media_assets_id : data.media_assets_id,
                category_id:data.category_id
            });
        }).on('focusout', function (ele, idx, dir)
        {
            if (dir == 'left')
            {
                ef.set_focus('search_input');
            }
        });
    }

    function add_area_input()
    {
        ef.add_area('search_input', {
            row : 1,
            col : 1,
            total : 1
        }).on('click', function (ele, idx, dir)
        {

        }).on('focusout', function (ele, idx, dir)
        {
            if (dir == 'right')
            {
                ef.set_focus('search_list', 0);
            }
        });
    }
    ef.on_cancel = function ()
    {
        on_cancel();
    }
    starcorCom.ready(function(){
        search.init();
    });
})();