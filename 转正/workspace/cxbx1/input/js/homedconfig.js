// JavaScript Document
var isIp = 0;//1:表示是ip访问，0表示是域名访问

var homedAddr = isIp==1?"http://192.168.37.30":"http://homeds.homed.tv";

var messageServer = isIp==1?"http://192.168.37.30":"http://message.homed.me";

var accountAddr =(isIp==1?(homedAddr+":26900"):"http://access.homed.me");

var vodAddr = (isIp==1?(homedAddr+":13900"):"http://homeds.homed.me");

var addFriendAddr = (isIp==1?homedAddr:"http://homeds.homed.me");

var emailAddr = (isIp==1?homedAddr:"http://homeds.homed.me");

var myAppAddr = (isIp==1?homedAddr:"http://homeds.homed.me");

var taotaobaAddr = (isIp==1?homedAddr:"http://homeds.homed.me");

var watchTvAddr = (isIp==1?homedAddr:"http://homeds.homed.me");

var wealthAddr = (isIp==1?(homedAddr+":11600"):"http://access.homed.me");

var textWordsAddr = (isIp==1?(homedAddr+":15900"):"http://access.homed.me");//词库

var messageAddr = (isIp==1?(homedAddr+":18901"):"http://message1.homed.me");  

var messageAddr0 = (isIp==1?(homedAddr+":18900"):"http://message0.homed.me");