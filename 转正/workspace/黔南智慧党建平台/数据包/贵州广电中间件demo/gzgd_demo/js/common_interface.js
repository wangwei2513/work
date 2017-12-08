;
(function ()
{
    //用户行为组接口
    var user_action = {
        get_collect : function (params,callback)
        {
            if(typeof  params == 'function')
            {
                callback = params;
                params = {};
            }
            starcorCom.get_collect_list(params,function (result)
            {
                if (typeof callback === 'function')
                {
                    callback(set_media_data(result.l && result.l.il || []));
                }
            });
        },
        add_collect : function (data, __callback)
        {
            var params =data, callback = function (result)
            {
                var _state = Number(result.result.state);
                var media_data = [];
                if (_state === 0 || _state === 10001)
                {
                    media_data = set_media_data(result.l.il);
                }
                if (typeof __callback === 'function')
                {
                    __callback(result);
                }
            };
            starcorCom.add_collect(params, callback);
        },
        del_collect : function (data, __callback)
        {
            var params = {
                "nns_collect_id" : data.collect_id
            }, callback = function (result)
            {
                var _state = Number(result.result.state);
                var media_data = [];
                if (_state === 0 || _state === 10001)
                {
                    media_data = set_media_data(result.l.il);
                }
                if (typeof __callback === 'function')
                {
                    __callback(result);
                }
            };
            starcorCom.delete_collect(params, callback);
        },
        get_playlist : function (params,__callback)
        {
            if(typeof  params == 'function')
            {
                __callback = params;
                params = {};
            }
            var callback = function (result)
            {
                var _state = Number(result.result.state);
                var media_data = [];
                if (_state === 0 || _state === 10001)
                {
                    media_data = set_media_data(result.l.il);
                }
                if (typeof __callback === 'function')
                {
                    __callback(media_data);
                }
            };
            starcorCom.get_playlist(params, callback);
        },
        add_playlist : function (data, __callback)
        {
            var params = data,
                callback = function (result)
                {
                    if (typeof __callback === 'function')
                    {
                        __callback(result);
                    }
                };
            starcorCom.add_playlist(params, callback);
        },
        del_playlist : function (data, __callback)
        {

            var params = {
                "nns_playlist_id" : data.playlist_id
            }, callback = function (result)
            {
                if (typeof __callback === 'function')
                {
                    __callback(result);
                }
            };
            starcorCom.delete_playlist(params, callback);
        },
        get_catch_list : function (params,__callback)
        {
            if(typeof  params == 'function')
            {
                __callback = params;
                params = {};
            }
            var callback = function (result)
            {
                console.log('_____________catch_result',result);

                if (typeof __callback === 'function')
                {
                    __callback(set_media_data(result.l && result.l.il || []));
                }
            };
            starcorCom.get_catch_list(params, callback);
        },
        add_catch : function (data, __callback)
        {
            var callback = function (result)
                {
                    var _state = Number(result.result.state);
                    var media_data = result;
                    if (typeof __callback === 'function')
                    {
                        __callback(result);
                    }
                };
            starcorCom.add_catch(data, callback);
        },
        del_catch : function (data, __callback)
        {

            var params = {
                "nns_catch_id" : data.catch_id
            }, callback = function (result)
            {
                var _state = Number(result.result.state);
                var media_data = [];
                if (_state === 0 || _state === 10001)
                {
                    media_data = result ;
                }
                if (typeof __callback === 'function')
                {
                    __callback(result);
                }
            };
            starcorCom.delete_catch(params, callback);
        },
        is_collect : function (video_id,callback)
        {
            this.get_collect(function(data){
                for (i = 0; i < data.length; i++)
                {
                    if (data[i].video_id === video_id)
                    {
                        callback(data[i].id);
                        return;
                    }
                }
                callback("");
            });
        },
        is_paly : function (video_id,callback)
        {
            this.get_playlist(function(data){
                for (i = 0; i < data.length; i++)
                {
                    if (data[i].video_id === video_id)
                    {
                        callback(data[i].id);
                        return;
                    }
                }
                callback("");
            });
        },
        is_catch : function (video_id,callback)
        {
            this.get_catch_list(function(data){
                console.log('_____________catch_data',data);
                for (i = 0; i < data.length; i++)
                {
                    if (data[i].video_id === video_id)
                    {
                        callback(data[i].id);
                        return;
                    }
                }
                callback("");
            });
        }
    }

    function set_media_data(datas)
    {
        var _media_data = [];
        for (var i = 0; i < datas.length; i++)
        {
            var _data = datas[i];
            for (var attr in _data.arg_list)
            {
                _data[attr] = _data.arg_list[attr];
            }
            _media_data.push(_data);
        }
        return _media_data;
    }

    window.user_action = user_action;
})();