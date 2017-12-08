;
(function ()
{
    var detail_f_j = {};
    var f_j_nav_size = 8;//测试使用
    var detail_page = {};
    var product_id = '';
    var ef = new ef_manage();
    bind_key(ef);
    detail_f_j.in_f_j = false;
    detail_page.playlist = [];//播放记录
    detail_page.btn_show_id = '';
    detail_page.actor_list = [];//演员列表
    detail_page.actor_star = 0;
    detail_page.doctor_list = [];//导演列表
    detail_page.doctor_star = 0;
    detail_page.is_played_index = -2;//已播放的集

    detail_page.init = function ()
    {
       // starcorCom.bind_key(ef);
        var data = get_url_data();
        detail_page.video_id = data.video_id;
        detail_page.video_type = data.video_type;
        detail_page.media_asset_id = data.media_assets_id || data.media_asset_id;
        detail_page.category_id = data.category_id || '';
        detail_page.is_show_index = data.is_show_index || false;
        detail_page.$page_dom = $("#detail_page");
        detail_page.not_recom_list = false;
        ef.reset();
        common_option();
        $("#btn_group__4").hide();
        $("#btn_group__4").show();
        $("#f_j_warp").hide();
    };
    function common_option()
    {
        reset_page();
        //根据影片id获取影片详情
        get_detail_info();
        //影片相关推荐列表
        detail_page.media_asset_id && get_recommon_list();
        //收藏
        is_collect();
        //追剧
        is_catch();
        //auth_play 影片鉴权。
        detail_auth_play_action();
        add_area_btn(6);
        ef.set_focus('btn_group');
    }

    /*
     * 数据拉取和页面渲染
     * */

    //获取影片详情
    function get_detail_info()
    {
        var params = {
            "nns_video_id" : detail_page.video_id,
            "nns_video_type" : detail_page.video_type
        };
        starcorCom.get_video_info(params, function (res)
        {
            if (res.result && res.result.state == 200)
            {
                fill_detail_info(res.i);
            }
        });
    }

    //填充详情
    function fill_detail_info(data)
    {
        if (!detail_page.media_asset_id)
        {
            try
            {
                detail_page.media_asset_id = data.asset_list.asset[0].asset_id;
                get_recommon_list();
            }
            catch (e)
            {
                fill_recommon_list([]);
            }
        }
        var d_page = detail_page;
        var _data = data.arg_list.vod_info;
        set_text('detail_video_name', data.name);
        set_text('d_area', _data.area);
        set_text('d_type', _data.kind);
        set_text('d_score', _data.name);
        set_text('d_time_len', _data.time_len + '分钟');
        set_text('d_doctor', _data.director);
        set_text('d_actor', _data.actor);
        set_text('d_desc', _data.summary);

        var $video_poster = $("#video_poster");
        $video_poster.attr('src', data.img_v);
        btn_grounp_set(ui_sytle);
    }

    function set_text(id, value)
    {
        $("#" + id).text(value);
    }

    //推荐列表
    function get_recommon_list()
    {
        var params = {
            'nns_media_assets_id' : detail_page.media_asset_id,
            'nns_exclude_video_ids' : detail_page.video_id,
            "nns_page_index" : 0,
            "nns_page_size" : 7,
            "nns_video_type" : detail_page.video_type
        }
        starcorCom.get_video_recom_video(params, function (res)
        {
            var data = res.l && res.l.il || [];
            fill_recommon_list(data)
        });
    }

    function fill_recommon_list(data)
    {
        var len = Math.min(5, data.length);
        $("#recommod_list").hide();
        $("#recommod_list").find(".list_item").hide();
        detail_page.not_recom_list = len == 0;
        var id = '', _dom = '', _data = '';
        for (var i = 0; i < len; i++)
        {
            id = 'recommod_list__' + i;
            _dom = $("#" + id);
            _data = data[i];
            if (_dom.length == 0)
            {
                continue;
            }
            var $video_poster = _dom.find('img');
            $video_poster.attr('src', _data.img_v);
            _dom.attr("index",i);
            _dom.show();
        }
        //处理推荐少于7个的情况
        for (; i < 5; i++)
        {
            id = 'detail_recommend_item__' + i;
            _dom = $("#" + id);
            var $video_poster = _dom.find('.video-poster');
            $video_poster.attr('img_src', '');
            _dom.attr("index",i);
        }
        detail_page.detail_recommend = data;
        $("#recommod_list").show();
        add_area_recommend(len);
    }

    //分集面板
    function get_index_data(callback)
    {
        var params = {
            'nns_video_id' : detail_page.video_id,
            'nns_video_type' : detail_page.video_type,
            'nns_page_index' : 0,
            'nns_page_size' : 100
        };
        starcorCom.get_video_index_list(params, function (res)
        {
            var data = res.il.i && res.il.i.index_list || [];
            detail_f_j.f_j_total = parseInt(data.count_num);
            detail_f_j.index_list_data = data.index;
            analyze_index_data(0);
            render_index_menu(0);
            get_index_info(callback);
        });
    }

    //star为分页开始
    function analyze_index_data(idx)
    {
        var data = detail_f_j.index_list_data;
        var len = data.length;
        var size = detail_f_j.f_j_size;
        //  len = Math.min((star + 8) * size, len);//一次最多处理8个数据
        var star = idx * size;
        var c_len = Math.min(f_j_nav_size, Math.ceil((len - star) / size));//一次最多处理8个数据
        for (var i = 0; i < c_len; i++)
        {
            star = (idx + i) * size;
            var end = Math.min(star + size, len);
            console.info("*********************", data[star].index, ":", data[end - 1].index);
            var key = (parseInt(data[star].index) + 1) + '-' + (parseInt(data[end - 1].index) + 1);
            var obj = {
                title : key,
                data : data.slice(star, end)
            };
            detail_f_j.index_list_obj[idx + i] = obj;
        }
    }

    //获取分集数据
    function get_index_list(f_j_index, callback)
    {
        if (detail_f_j.index_list_obj[f_j_index])
        {
            callback(detail_f_j.index_list_obj[f_j_index].data);
        }
    };

    function get_index_info(callback)
    {
        get_index_list(detail_f_j.f_j_index, function (data)
        {
            ef.set_focus('f_j_menu');
            //第一页数据
            render_index_list(data);
        });
    }


    function render_index_menu(m_star, callback)
    {
        var data = detail_f_j.index_list_obj;
        var f_j_size = detail_f_j.f_j_size,
            f_j_index = detail_f_j.f_j_index,
            f_j_total = parseInt(detail_f_j.f_j_total);
        //渲染分集菜单
        if (f_j_total == 0)
        {
            return;
        }//无数据处理
        m_star = m_star || 0;
        var m_s_size = m_star * f_j_size;
        var m_len = Math.ceil((f_j_total - m_s_size) / f_j_size);
        var m_html = '', value = '';
        m_len = Math.min(f_j_nav_size, m_len);//最多显示8个
        for (var i = 0; i < m_len; i++)
        {
            var j = (i + m_star);
            value = data[j].title;
            var checked_class = '';
            if (j == f_j_index)
            {
                checked_class = 'checked';
            }
            m_html += '<span class="f-j-menu-item ' + checked_class + '" index_v="' + j + '" id="f_j_menu__' + i + '">' + value + '</span>';
        }
        $("#f_j_menu").html(m_html);
        if (ef.all_area['f_j_menu'])
        {
            ef.update_area('f_j_menu', {
                "col" : m_len,
                "row" : 1,
                "total" : m_len
            });
        }
        else
        {
            add_area_index_menu(m_len);
        }
        if (typeof callback == 'function')
        {
            callback();
        }
    }

    //渲染分集列表
    function render_index_list(data, callback)
    {
        var f_j = detail_f_j;
        var f_j_size = f_j.f_j_size;
        var m_html = '', value = '';
        var m_len = data.length;
        m_len = Math.min(f_j_size, m_len);//最多显示8个
        var played_index = detail_page.is_played_index;
        var class_name = '';
        var ui_sytle = detail_page.index_ui_style;
        //缺集存在，另用j设置计算的集数
        for (var i = 0, j = 0; i < m_len; i++, j++)
        {
            var __data = data[i];
            var _index = parseInt(__data.index);
            class_name = '';
            value = _index + 1;
            //分集处理更改为只显示上线分集
            m_html += '<span class="f-j-item " id="f_j_list__' + j + '" index_id="' + _index + '">' + value + '</span>';
        }
        $("#f_j_list").html(m_html);
        $("#f_j_warp").show();
       // $("#f_j_warp").style.display == 'block';
        if (ef.all_area['f_j_list'])
        {
            var row = Math.ceil(m_len / (f_j_size / 3)),
                col = row > 1 ? (f_j_size / 3) : m_len;
            ef.update_area('f_j_list', {
                "col" : col,
                "row" : row,
                "total" : m_len
            });
        }
        else
        {
            add_area_index_list(m_len);
        }
        if (typeof  callback == 'function')
        {
            callback();
        }
    }

    //播放鉴权
    function detail_auth_play_action()
    {
        var params = {
            "nns_func" : "check_auth_by_media",
            "nns_video_id" : detail_page.video_id,
            "nns_video_type" : detail_page.video_type,
            "nns_media_assets_id" : detail_page.media_assets_id
        }
        starcorCom.auth_play(params, function (res)
        {
            if (typeof res.result.state !== "undefined")
            {
                switch (parseInt(res.result.state))
                {
                    case 0:
                    case 6:
                        detail_page.play_state = 1;//可播放
                        break;
                    case 1:
                    case 4:
                        detail_page.play_state = 0;//需购买
                        var product_list = res.product_list || [],
                            p_arr = [];
                        for(var i= 0,len=product_list.length;i<len;i++)
                        {
                            p_arr.push(product_list[i].id);
                        }
                        product_id = p_arr.join(",");
                        break;
                    default :
                        detail_page.play_status = 2;// 无可用片源
                        detail_page.auth_play_reason = res.result.reason;
                        break;
                }
                //btn_grounp_set();
                if (detail_page.play_state == 0)
                {
                    $('#btn_group__1').text('购买').attr('play_state',detail_page.play_state);
                }
                else if (detail_page.play_state == 1)
                {
                    $('#btn_group__1').text('播放').attr('play_state',detail_page.play_state);
                }else{

                }
            }
            else
            {

            }

        });
    }


    //test 添加播放记录
    function add_play_list(index)
    {
        var params = {
            'nns_video_type' : detail_page.video_type,
            'nns_video_id' : detail_page.video_id,
            'nns_video_index' : index,
            'nns_media_asset_id' : detail_page.media_asset_id,//必须
        }
        user_action.add_playlist(params, function (datas)
        {

        })
    }

    function add_catch()
    {
        var params = {
            'nns_video_type' : detail_page.video_type,
            'nns_video_id' : detail_page.video_id,
            'nns_media_asset_id' : detail_page.media_asset_id,//必须
        }
        user_action.add_catch(params, function (datas)
        {

        })
    }

    //apply_play 鉴权并获取播放串
    function apply_play()
    {
        var params = {
            'nns_video_type' : detail_page.video_type,
            'nns_video_id' : detail_page.video_id,
            'nns_media_asset_id' : detail_page.media_asset_id,//必须
        }
        starcorCom.apply_play(params, function (datas)
        {
            //console.log(datas);
            //  return datas;
        })
    }

    /*
     * 焦点区域设置
     * */
    //按钮区
    function add_area_btn(len)
    {
        add_area_common('btn_group', len)
            .on('focusout', function (elem, idx, dir)
            {
                if (dir == 'down')
                {
                    //判断是否有数据
                    if (detail_page.not_recom_list)
                    {
                        return;
                    }
                    //进入相似影片
                    set_focus('recommod_list');
                }
            })
            .on('click', function (elem, idx)
            {
                //console.log('btn_type:', idx);
                switch (idx)
                {
                    case 0:
                        detail_f_j.in_f_j = true;
                        get_index_data(function ()
                        {
                            set_focus('f_j_menu');
                            $(ef.get_focus('f_j_menu')).addClass('checked');
                        });
                        break;
                    case 1:
                        var $dom = $(elem),
                            state = $dom.attr("play_state"),
                            params = {};
                        if(state == 1)//播放
                        {
                            params = {
                                video_id : detail_page.video_id,
                                video_index : 0,
                                position :0,
                                source : 'STARCOR',
                            };
                            var env = starcorCom.get_env();
                            //starcor盒子直接跳转播放器
                            if(env == 'starcor')
                            {
                                starcorCom.go_starcor_play(params);
                            }else{
                                starcorCom.apply_play(params,function(data){
                                    //播放器
                                    alert('鉴权结果：'+data && data.result.reason);
                                });
                            }
                        }else{//订购
                            params = {
                                'package_name' : '',
                                'session_id' : 'test',
                                'cp_video_id' : detail_page.video_id,
                                'video_id' : detail_page.video_id,
                                'products' : product_id,
                                'ex_data':{}
                            }
                            starcorCom.go_pay(params,function(data){
                               // alert('back');
                                if(data)
                                {
                                    $dom.text('播放');
                                }else
                                {
                                    //$dom.text('N播放');
                                }
                            });
                        }
                        break;
                    case 2:
                        var $dom = $(elem);
                        var method = $dom.attr("o_type") + '_collect';
                        var is_add = method == 'add_collect';
                        var collect_id = is_add ? '' : $dom.attr('collect_id');
                        do_collect(collect_id, method, function (res)
                        {
                            var tips = is_add ? '取消收藏' : '收藏';
                            collect_id = is_add ? res.l.il[0].id : '';
                            $dom.text(tips).attr("o_type", is_add ? 'del' : 'add').attr('collect_id', collect_id);
                        });
                        break;
                    case 3://catch
                        var $dom = $(elem);
                        var method = $dom.attr("c_type") + '_catch';
                        //console.log('____________method:', method);
                        var is_add = method == 'add_catch';
                        var catch_id = is_add ? '' : $dom.attr('catch_id');
                        do_catch(catch_id, method, function (res)
                        {
                            var tips = is_add ? '取消追剧' : '追剧';
                            catch_id = is_add ? res.l.il[0].id : '';
                            $dom.text(tips).attr("c_type", is_add ? 'del' : 'add').attr('catch_id', catch_id);
                        });
                        break;
                    case 4:
                        apply_play();
                        break;
                    case 5:
                        var params = {
                            video_id : detail_page.video_id,
                            video_index : 0,
                            position :0,
                            source : 'STARCOR',
                        };
                        starcorCom.go_play(params);
                        break;
                }
            });
    }

    //推荐
    function add_area_recommend(len)
    {
        add_area_common('recommod_list', len)
            .on('focusout', function (elem, idx, dir)
            {
                if (dir == 'up')
                {
                    //进入按钮区
                    ef.set_focus('btn_group');
                }
            }).on('click', function (ele, idx)
            {
                var _dom = $(ele);
                var id = $(ele).attr('index'),
                    data = detail_page.detail_recommend[id];
                open_page('detail',{
                        video_id : data.id,
                        video_type: data.arg_list.video_type,
                        media_assets_id : detail_page.media_asset_id,
                        category_id:detail_page.category_id
                });
            });
    }

    //分集菜单
    function add_area_index_menu(len)
    {
        add_area_common('f_j_menu', len)
            .on('focusout', function (elem, idx, dir)
            {
                var index = parseInt($(elem).attr("index_v")),
                    m_star = index;
                if (dir == 'right')
                {
                    m_star = index + 1; //下标从0开始这里+1是校准
                    if (m_star * detail_f_j.f_j_size < detail_f_j.f_j_total)
                    {
                        index = m_star - f_j_nav_size + 1;
                        common_shift(index, m_star);
                    }
                }
                else if (dir == 'left')
                {
                    if (index > 0)
                    {
                        --index;
                        common_shift(index);
                    }
                }
                function common_shift(index, m_star)
                {
                    var data = detail_f_j.index_list_obj;
                    m_star = m_star || index;
                    if (!data[m_star])
                    {
                        analyze_index_data(m_star);
                    }
                    render_index_menu(index);
                    ef.set_focus('f_j_menu');
                    /*$(".f-j-menu-item").removeClass('checked');
                     $(ef.get_focus('f_j_list')).addClass('checked');*/
                }
            }).on("click", function (elem, idx, dir)
            {
                $(".f-j-menu-item").removeClass('checked');
                var _dom = $(elem);
                _dom.addClass('checked');
                if (detail_f_j.f_j_index == _dom.attr('index_v'))
                {//当前页
                    return;
                }
                detail_f_j.f_j_index = _dom.attr('index_v');
                get_index_info();
                // ef.set_focus('f_j_list',0);
            });
    }

    //分集列表
    function add_area_index_list(m_len)
    {
        var f_j_size = detail_f_j.f_j_size;
        var row = Math.ceil(m_len / (f_j_size / 3)),
            col = row > 1 ? (f_j_size / 3) : m_len;
        ef.add_area('f_j_list', {
            "col" : col,
            "row" : row,
            "total" : m_len
        })
            .on('focusout', function (elem, idx, dir)
            {
                if (dir == 'up')
                {
                    //进入按钮区
                    ef.set_focus('f_j_menu');
                }
            }).on('click', function (elem)
            {

            });
    }

    //一行焦点公用方法
    function add_area_common(name, len)
    {
        return ef.add_area(name, {
            "row" : 1,
            "col" : len,
            "total" : len
        });
    }


    /*
     * 公用方法
     * */

    function set_focus(name)
    {
        ef.get_focus(name) == null ? ef.set_focus(name, 0) : ef.set_focus(name);
    }


    //重置参数和页面
    function reset_page()
    {
        var d_page = detail_page;
        detail_f_j = {
            f_j_type : 2,//分集显示类型
            f_j_size : 24,//分集长度
            f_j_index : 0,//分集分页页码
            f_j_total : 0,//分集总数
            in_f_j : false,
            index_list_obj : {}//分集列表对象
        }
        d_page.btn_show_id = '';
        d_page.actor_star = 0;
        d_page.doctor_star = 0;
        d_page.is_played_index = -2;//已播放的集
        d_page.is_played_index = '';
        ef.reset();
    }

    //收藏
    function do_collect(collect_id, method, callback)
    {
        var params = {};
        var is_delete = collect_id != '';
        if (is_delete)
        {
            params.collect_id = collect_id;
        }
        else
        {
            params = {
                'video_id' : detail_page.video_id,
                'video_type' : detail_page.video_type,
                'media_asset_id' : detail_page.media_asset_id,
                'category_id' : detail_page.category_id
            }
        }
        user_action[method](params, function (res)
        {
            var message = '';
            if (res.result && (res.result.state == 0 || res.result.state == 10001))
            {
                message = is_delete ? '已取消收藏' : '收藏成功';
                if (typeof  callback == 'function')
                {
                    callback(res);
                }
            }
            else
            {
                message = datas.result.reason;
            }
            //app_manage.show_tip(message,2000);
        })
    }

    //收藏
    function do_catch(catch_id, method, callback)
    {
        var params = {};
        var is_delete = catch_id != '';
        if (is_delete)
        {
            params.catch_id = catch_id;
        }
        else
        {
            params = {
                'video_id' : detail_page.video_id,
                'video_type' : detail_page.video_type,
                'media_asset_id' : detail_page.media_asset_id,
                'category_id' : detail_page.category_id
            }
        }
        user_action[method](params, function (res)
        {
            var message = '';
            if (res.result && (res.result.state == 0 || res.result.state == 10001))
            {
                if (typeof  callback == 'function')
                {
                    callback(res);
                }
            }
            else
            {
            }
            //app_manage.show_tip(message,2000);
        })
    }

    //判断是否被收藏
    function is_collect()
    {
        var text = '收藏', type = 'add';
        user_action.is_collect(detail_page.video_id, function (collect_id)
        {
            if (collect_id != "")
            {
                text = '取消收藏';
                type = 'del';
            }
            $("#btn_group__2").text(text).attr("o_type", type).attr('collect_id', collect_id);
        });
    }

    //判断是否被收藏
    function is_catch()
    {
        var text = '追剧', type = 'add';
        //console.log('____________is_catch');
        user_action.is_catch(detail_page.video_id, function (catch_id)
        {
            if (catch_id != "")
            {
                text = '取消追剧';
                type = 'del';
            }
            //console.log('____________type',type);
            $("#btn_group__3").text(text).attr("c_type", type).attr('catch_id', catch_id);
        });
    }

    //判断是否已播放
    function is_played()
    {
        var data = user_action.get_playlist();
        for (var i = 0, len = data.length; i < len; i++)
        {
            if (data[i].arg_list.video_id == detail_page.video_id)
            {
                detail_page.is_played_index = data[i].arg_list.video_index;
                return;
            }
        }
        detail_page.is_played_index = -2;
    }

    /**
     * 返回
     * @param key_info
     */
    ef.on_cancel = function ()
    {
        console.log('t_html','in f_j value:',detail_f_j.in_f_j);
        if (detail_f_j.in_f_j)
        {
            console.log('t_html','in f_j else');
            detail_f_j.in_f_j = false;
            ef.set_focus('btn_group');
            $("#f_j_warp").hide();
            return null;
        }
        else
        {
            console.log('t_html','in f_j else');
            on_cancel();
        }
    }

    starcorCom.ready(function ()
    {
        detail_page.init();
    });
})();