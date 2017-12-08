<?php
    header('Content-type:text/html;charset=utf-8');

    // 根据ajax设置数据提交类型获取数据，动态设置请求方式
    if($_SERVER['REQUEST_METHOD']=='POST') {
        $data = $_POST;
        $ispost = 1;
    } else if($_SERVER['REQUEST_METHOD']=='GET') {
        $data = $_GET;
        $ispost = 0;
    }

    // 获取数据中的url和其他参数
    foreach($data as $key=>$val) {
        if($key == 'url') {
            $url = $val;
        }else {
            $params[$key] = $val;
        }
    }

    $paramstring = http_build_query($params);
    $content = juhecurl($url,$paramstring,$ispost);
    $result = json_decode($content,true);
    if($result){
        if($result['error_code']=='0'){
            echo json_encode($result);
        }else{
            echo $result['error_code'].":".$result['reason'];
        }
    }else{
        echo "请求数据失败";
    }

    /**
     * 请求接口返回内容
     * @param  string $url [请求的URL地址]
     * @param  string $params [请求的参数]
     * @param  int $ipost [是否采用POST形式]
     * @return  string
     */
    function juhecurl($url,$params=false,$ispost=1){
        $httpInfo = array();
        $ch = curl_init();
     
        curl_setopt( $ch, CURLOPT_HTTP_VERSION , CURL_HTTP_VERSION_1_1 );
        curl_setopt( $ch, CURLOPT_USERAGENT , 'JuheData' );
        curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT , 60 );
        curl_setopt( $ch, CURLOPT_TIMEOUT , 60);
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER , true );
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        if( $ispost )
        {
            curl_setopt( $ch , CURLOPT_POST , true );
            curl_setopt( $ch , CURLOPT_POSTFIELDS , $params );
            curl_setopt( $ch , CURLOPT_URL , $url );
        }
        else
        {
            if($params){
                curl_setopt( $ch , CURLOPT_URL , $url.'?'.$params );
            }else{
                curl_setopt( $ch , CURLOPT_URL , $url);
            }
        }
        $response = curl_exec( $ch );
        if ($response === FALSE) {
            //echo "cURL Error: " . curl_error($ch);
            return false;
        }
        $httpCode = curl_getinfo( $ch , CURLINFO_HTTP_CODE );
        $httpInfo = array_merge( $httpInfo , curl_getinfo( $ch ) );
        curl_close( $ch );
        return $response;
    }

?>