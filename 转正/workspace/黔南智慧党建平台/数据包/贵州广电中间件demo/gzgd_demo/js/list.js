;(function(){
    var list_page = {};
    var ef = new ef_manage();
    label_obj = {
        type_arr : [],
        first_filter_item :'',
        now_label_area : 0
    }
    list_page.page_data = [];
    bind_key(ef);
    list_page.init = function()
    {
        $("#not_data").hide();
        //starcorCom.bind_key(ef);
        var url_data = get_url_data();
        list_page.url_data = url_data;
        list_page.get_nav_data();
        list_page.get_filter_type_data();
    }
    /*----------数据获取------*/

    // 根据媒资包id读取媒资包信息---栏目
    list_page.get_nav_data = function()
    {
        var url_data =list_page.url_data ;
        var params = {
            nns_media_assets_id : url_data.media_asset_id,
            nns_category_id : url_data.category_id
        }
        starcorCom.get_media_assets_class(params,function(data){
            list_page.render_nav(data);
            console.log(data);
        });
    };

    //根据媒资包
    list_page.get_list_data = function(category_id)
    {
        var url_data = list_page.url_data ;
        var params = {
            nns_media_asset_id : url_data.media_asset_id,
            nns_category_id : category_id
        }
        starcorCom.get_media_assets_list(params,function(data){
            list_page.render_list(data.l);
        })
    };

    //读取媒资包绑定的标签分类，以及分类下的标签列表
    list_page.get_filter_type_data = function()
    {
        var url_data =list_page.url_data ;
        var params = {
            nns_media_assets_id : url_data.media_asset_id,
           // nns_category_id : url_data.category_id
        }
        starcorCom.get_media_assets_bind_labels(params, function (data)
        {
            list_page.render_filter_type(data);
        })
    };

    //根据标签组筛选内容
    list_page.get_list_by_filter_type = function(label_id)
    {
        var url_data =list_page.url_data ;
        var params = {
            nns_media_assets_id : url_data.media_asset_id,
            nns_category_id : url_data.category_id,
            nns_video_label_id : label_id
        }
        starcorCom.get_media_assets_list_by_labels(params, function (data)
        {
            var params = {
                page_ctrl : {
                    "count_num": data.count_num,
                    "count_pages": data.count_pages,
                    "cur_pages": data.cur_pages,
                },
                il:data.item
            }
            list_page.render_list(params);
        })
    }

    /*---------渲染----------*/
    list_page.render_nav = function(data)
    {
        $("#media_name").text(data.name);
        var nav_data=  data.arg_list.category_list;
        var len = Math.min(nav_data.length,5);//最多处理5个
        $("#list_nav_menu").find('.menu_item').hide();
        if(len == 0)
        {
            //无数据处理
            return;
        }
        var checked_nav_id = list_page.category_id,
            idx = 0;
        for(var i=0;i<len;i++)
        {
            var __data = nav_data[i];
            var $dom = $("#list_nav_menu__"+i);
            var id = __data.id;
            if(id == checked_nav_id)
            {
                idx = i;
            }
            $dom.text(__data.name);
            $dom.attr('nns_id',id);
            $dom.attr('nns_type',__data.type);
            $dom.show();
        }
        add_area_nav(len);
        ef.set_focus('list_nav_menu',idx);
       // list_page.get_list_data(nav_data[idx].id);
        ef.bind_key({'key_name':'enter'});
    }
    list_page.render_list = function(data)
    {

        var page_contrl = data.page_ctrl;
        var list_data=  data.il;
        var len = Math.min(list_data.length,4);
        $('.list_item').hide();
        if(len == 0)
        {
            //无数据处理
            $("#not_data").show();
            $("#list_video").hide();
            return;
        }
        $("#not_data").hide();
        $("#list_video").show();
        for(var i=0;i<len;i++)
        {
            var __data = list_data[i];
            var $dom = $("#list_video__"+i);
            $dom.find('span').text(__data.name);
            $dom.find('img').attr('src',__data.img_small);
            $dom.attr('nns_id',__data.id);
            $dom.attr('nns_type',__data.type);
            $dom.attr('index',i);
            $dom.show();
        }
        list_page.page_data = list_data;
        add_area_list(len);
    };

    list_page.render_filter_type = function(data)
    {
        if (data.result.state != 0)
        {
            //异常处理
            return;
        }
        var type_data = data.l.il || [];
        //只处理一组标签
        var len = Math.min(1,type_data.length);
        var html = '';
        if (len > 0)
        {
            for (var i = 0; i < len; i++)
            {
                var _data = type_data[i];
                var label_list = _data.arg_list && _data.arg_list.label_list && _data.arg_list.label_list.il || [];
                var id = _data.id;
                add_area_filter_type(id, (label_list.length + 1));
                label_obj.type_arr.push(id);
                //填充页面
                html += '<div class="filter_type_item  clear_fix" >' +
                    '<span class="filter_class_name fl">' + _data.name + '</span>' +
                    '<div class="filter_class_list focus-area clear_fix fl" id="f_c_' + id + '">' +
                    creat_label_by_type(id, label_list) +
                    '</div>' +
                    '</div>';
            }
            $("#filter_type").html(html);
            label_obj.first_filter_item = 'f_c_' + type_data[0].id;
        }
        else
        {
            //无筛选条件提示
            $("#filter_area").html('<p class="not_filter_data">暂时没有相关筛选条件</p>');
          //  ef.kill_focus();
            // ef.set_focus('filter_area',0);
        }
    };

    function creat_label_by_type(t_id, label_data)
    {
        var f_c = 'f_c_' + t_id;
        var html = '';
        if (1)
        {
            var all_t = f_c + '__0';
            html += '<div class="filter_class_list_div focus-item  menu_item" label_id="" id=' + all_t + '>全部</div>';
        }
        var len = label_data.length;
        len = Math.min(len,5);
        for (var i = 0; i < len; i++)
        {
            var _data = label_data[i];
            var item_id = f_c + "__" + (i + 1);
            html += '<div class="filter_class_list_div menu_item focus-item  menu_item" label_id="' + _data.id + '" id=' + item_id + '>'+ _data.name + '</div>';
        }
        return html;
    }
    /*---------焦点处理----------*/
    function add_area_nav(len)
    {
        ef.add_area('list_nav_menu',{
            row:1,
            col:len,
            total:len
        }).on('click',function(ele, idx, dir){
            $(".checked").removeClass('checked');
            $(ele).addClass('checked');
            var id = $(ele).attr("nns_id");
            list_page.get_list_data(id);
        }).on('focusout',function(ele, idx, dir){
            if(dir == 'up')
            {
               // if($("#list_video").is(":hidden"))
                if($("#list_video")[0].style.display == 'none')
                {
                    ef.set_focus(label_obj.first_filter_item,0);
                }else{
                    ef.set_focus('list_video',0);
                }
            }
        });
    }

    function add_area_list(len)
    {
        ef.add_area('list_video',{
            row:1,
            col:len,
            total:len
        }).on('click',function(ele, idx, dir){
            var id = $(ele).attr('index'),
                data = list_page.page_data[id];
            open_page('detail',{
                video_id : data.video_id || data.id,
                video_type: data.video_type || data.arg_list.video_type,
                media_assets_id : list_page.url_data.media_asset_id,
                category_id:list_page.url_data.category_id
            });
        }).on('focusout',function(ele, idx, dir){
            if(dir == 'down')
            {
                ef.set_focus('list_nav_menu',0);
            }else if(dir == 'up')
            {
                ef.set_focus(label_obj.first_filter_item,0);
            }
        });
    }

    function add_area_filter_type(id, len)
    {
        var name = 'f_c_' + id;
        ef.add_area(name, {
            row :1,// ceil(len / 10),
            col : len,
            total : len,
            idx : 0
        }).on('focus', function (elem, idx, dir)
        {
            if (dir == 'up' || dir == 'down')
            {
                var filter_warp_h = parseInt($("#filter_type").height());
                var top = parseInt(elem.offsetTop);
                if (filter_warp_h < top + 23)
                {
                    //第一个距顶部为23，元素高为34；因此需要加57
                    document.getElementById('filter_type').scrollTop = top - filter_warp_h + 57;
                    // $("#filter_area").scrollTop( top - filter_warp_h + 57);
                }
                else
                {
                    document.getElementById('filter_type').scrollTop = 0;
                }

            }else{
                var filter_warp_w = parseInt($("#filter_type").width()) + 59;
                var left = parseInt(elem.offsetLeft);
                var elem_w = $(elem).width();
                if (filter_warp_w < left + elem_w)
                {
                    $(elem).parent().parent()[0].scrollLeft = left - filter_warp_w + elem_w + 59;
                    //第一个距顶部为23，元素高为34；因此需要加57
                    //document.getElementById('filter_warp').scrollLeft = left - filter_warp_w + elem_w;
                    // $("#filter_area").scrollTop( top - filter_warp_h + 57);
                }
                else
                {
                    $(elem).parent().parent()[0].scrollLeft = 0;
                }
            }
        }).on('click', function (elem)
        {
            $(".checked").removeClass('checked');
            $(elem).addClass('checked');
            var id = $(elem).attr('label_id');
            list_page.get_list_by_filter_type(id);

        }).on('focusout', function (elem, idx, dir)
        {
            var now_label_area = label_obj.now_label_area;
            var type_arr = label_obj.type_arr;
            if (dir == 'up' && now_label_area != 0)
            {
                if (now_label_area == 0)
                {
                    return;
                }
                ef.set_focus('f_c_' + type_arr[--label_obj.now_label_area]);
            }
            else if (dir == 'down' &&  now_label_area != type_arr.length - 1)
            {
                ef.set_focus('f_c_' + type_arr[++label_obj.now_label_area]);
            }
            else if(dir == 'down' &&  (now_label_area == type_arr.length - 1 || type_arr.length == 1))
            {
                //if($("#list_video").is(":hidden"))
                if($("#list_video")[0].style.display == 'none')
                {
                    ef.set_focus('list_nav_menu',0);
                }else{
                    ef.set_focus('list_video',0);
                }
                label_obj.now_label_area = 0;
            }
        });
    }

    ef.on_cancel = function ()
    {
        on_cancel();
    }
    starcorCom.ready(function(){
        list_page.init();
    });
})();