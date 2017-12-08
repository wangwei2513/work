var isMovieDetailFlag = 0; //0：不需要详情页面，1：需要详情页面
var demoSwitch = 1; //用于控制演示数据处理(彩虹版)0,正常数据，1，演示数据
var isShowChnNum = 1; //0:直播检索页不需要显示频道号，1：需要显示频道号
var isGuanggao = true; //false:不显示广告F3键,true：显示广告F3键
var testDaId = "50001002";
var testAccessToken = "TOKEN" + testDaId;
var adRevision = 2; //广告版本 1:一期广告 2:二期广告
var isNeedGetAd = true; //true表示请求epg音量条广告，false表示请求前端页面广告
var globalDomain = ".homed.me";
var slaveAddr = "http://10.14.41.245:13160", 
      //slaveAddr = "http://192.168.36.105:13160"
    streamAddr = "http://stream.slave" + globalDomain + ":13160", //推流、限播、自办频道
    audienceAddr = "http://audience.slave" + globalDomain + ":13160", //收视率+edtv
    dtvsAddr = "http://dtv" + globalDomain,
    accountAddr = "http://access" + globalDomain,
    webclient = "http://webclient" + globalDomain,
    appAddr = "http://apps" + globalDomain,
    jiayuAddr = "http://113.98.233.214/app/test/jiayu/pages/index.htm",
    adImgClient = "http://ads" + globalDomain + ":8123", //图文广告的请求域名
    playAddr = webclient + "/application/newPlay/play.php",
    vodDetailAddr = webclient + "/application/homedPortal/vodDetail.php",
    tvodDetailAddr = webclient + "/application/homedPortal/tvodDetail.php",
    navigateAddr = "http://webclient" + globalDomain + "/application/newPlay/navigate/play.php",
    welcomeiPanelAddr = "http://web.eis/demo/welcome_tv/index.htm",
    loaderGetDataAdd = "http://192.168.35.130:9090", //"http://192.168.18.75:8080",//获取升级数据地址
    loaderServerAdd = "http://192.168.35.130:90/", //"http://192.168.18.75/",//loader服务器地址
    subjectPageAdd = webclient + "/application/homedPortal/subject/template/index_stb.html", //专题页面地址
    musicHomePageAdd = "http://192.168.36.154/homed/app/music/homedMusic/homepage/index.htm", //音乐产品化通用版首页地址
    isNeedGetAd = true, //true表示请求epg音量条广告，false表示请求前端页面广告
    defaultVolumeAdImg = webclient + "/application/newPlay/ad/newplayPF.jpg",
    weatherAppAddr = 'http://192.168.36.154/homed/app/weather/wetherPlay.html',
    eduSpecialAreaAddr = 'http://192.168.36.154/homed/app/education/education_homed/landi.htm',
    jiayuDianshangAdrr = webclient + "/application/homedPortal/jiayudianshang/jiayushangcheng.htm", //家峪电商
    jiayuJiaoyuAdrr = "http://web.eis/homed/app/education/education_homed/index.htm", //家峪教育
    rankListAddr = webclient + "/application/homedPortal/rankList.php",
    weatherCode = 440303,
    // http://10.14.41.245:13160/homed/program/get_list?accesstoken=R59F58A4AU508E0029KB2D05E01I9E73CC0AP0ME06WDBA0769EAA1&label=148&pageidx=1&pagenum=20&depth=1
    // http://10.14.41.245/recommend/get_recommend_by_label?accesstoken=R59F58A4AU508E0029KB2D05E01I9E73CC0AP0ME06WDBA0769EAA1&label=138&pageidx=0&pagenum=3&depth=1
    // http://10.14.41.245:13160/homed/program/get_list?accesstoken=R59F58A4AU508E0029KB2D05E01I9E73CC0AP0ME06WDBA0769EAA1&label=148&pageidx=1&pagenum=20&depth=1
    // http://10.14.41.245:13160/recommend/get_recommend_by_label?accesstoken=R59F58A4AU508E0029KB2D05E01I9E73CC0AP0ME06WDBA0769EAA1&label=138&pageidx=0&pagenum=3&depth=1
    labelIdObj = {
        channelType: "1001", //频道1001 
        //contenttype取值:频道1001  监控：1002  电视剧1100  电影1101    综艺1102   音乐1103  资讯1104   动漫1105   纪录片1106  教育1107   体育1108  生活1109   游戏1110

        seriesType: "1100", //电视剧1100
        movieType: "1101", //电影1101  
        varietyType: "1102", //综艺1102 
        musicType: "1103", //音乐1103 
        newsType: "1104", // 资讯1104 
        cartoonType: "1105", //动漫1105
        storyType: "1106", //纪录片1106 
        educationType: "1107", //教育1107  
        sportsType: "1108", // 体育1108
        lifeType: "1109", // 生活1109
        gameType: "1110", //游戏1110
        EbusinessType: "1998", //茁壮网络
        myTvType: "1999", //我的电视
        mosaicType: "1002", //监控：1002

        rootLabel: getLabelVal("rootLabel"), //栏目树根
        channel: getLabelVal("channel"), //频道
        movie: getLabelVal("movie"), //电影
        backTv: getLabelVal("backTv"), //回看
        subBackTv: "125",
        app: getLabelVal("app"), //应用
        backChannel: "131", //回看-频道
        variety: getLabelVal("variety"), //综艺
        Ebusiness: getLabelVal("Ebusiness"), //茁壮网络
        myTv: getLabelVal("myTv"), //我的电视
        monitor: getLabelVal("monitor"), //监控
        comic: getLabelVal("comic"), //动漫
        music: getLabelVal("music"), //音乐
        news: getLabelVal("news"), //资讯
        sports: getLabelVal("sports"), //体育
        education: getLabelVal("education"), //教育
        series: getLabelVal("series"), //电视剧
        game: getLabelVal("game"), //游戏
        documentary: getLabelVal("documentary"), //纪录片
        ad: "140",
        efficiency: getLabelVal("efficiency"), //生活
        jiayuEB: "27159",
        jiayuTour: "27262",
        jiayuVod: "29796",
        iSport: '32541', //iSport栏目
        party: '32243' //党员栏目
    },
    defaultObj = [
        { "name": "运营集群", "addr": "192.168.035.101" },
        { "name": "调试集群", "addr": "192.168.101.130" },
        { "name": "开发集群", "addr": "192.168.036.101" }
    ];

function getLabelVal(_str) {
    var label = 0;
    if (navigator.appName.indexOf("iPanel") != -1) {
        if (iPanel.eventFrame.labelIdObj && iPanel.eventFrame.labelIdObj[_str]) {
            label = iPanel.eventFrame.labelIdObj[_str];
        }
    } else {
        _str = "label_" + _str;
        var str = "";
        var tmp = "";
        if (window.localStorage) {
            var storage = window.localStorage;
            str = storage[_str];
            if (typeof str != "undefined") tmp = str;
        } else {
            var url = document.cookie;
            if (new RegExp(".*\\b" + _name + "\\b(\\s*=([^&;]+)).*", "gi").test(url)) {
                str = unescape(RegExp.$2);
            }
            if (str.indexOf("|") != -1) {
                tmp = str.replace("#0#0#", "|");
            }
            tmp = str;
        }
        label = tmp;
    }
    return label ? label : 0;
};