/*
 * ImageMagic v0.5
 *
 * Copyright 2011, GuoAimin
 * Includes toolkit lib
 * Date: 2011-9-14
 */
 
 
/*
 *	功能：核心组件
 *	作用：软件基本配置
 */

void function(window,undefined){


	imageMagic.config || (imageMagic.config={});
	var doc,toolkit;
	
	imageMagic.config={
		toolbar :'toolbar',
		leftSidebar :'leftSidebar',
		canvasContainer :'canvasContainer',
		workSpace : {
			//添加新功能需要在以下两项注册
			Function:['clip','scale','rotate','mark'],
			button :[
				'Button_clip',
				'Button_scale',
				'Button_rotate',
				'Button_mark'	
			],
			//
			tab:{t:'control',s:'leftSidebar',tag:'h3'},
			control : { id:'leftSidebar' ,tag :'h3'},/**/
			zoom:0.1,//滚轮缩放比率
			scaleLock :false,//开启此项，宽或高等于画布宽或高时停止缩放
			scaleType : 200, //放大界限 200%
			scaleDataSize : false, //是否显示缩放后文件量大小,为了保证鼠标滚轮缩放流程度建议关闭此项
			rotateHandler : 'rotateHandler' ,
			watermarkCon  : 'watermarkCon',
			watermarkControl  : 'watermarkControl',
			watermarkCancel : 'watermarkCancel',
			watermarkOP : 'watermarkOpacity',
			watermarkOpacity :50
		},
		areaSize : [40,40],//剪裁框默认尺寸
		imageLoader:{
			id:'imageLoader',
			native:'imLoaderNative',
			web:'imLoaderWeb',
			btn:'imageLoaderBtn'
		},
		dataURL : {
			'clipSize' : 'http://oracle.pic.ws.netease.com/photohtml5.json?channelid=0080&method=getphotosize',
			'waterMark' : 'http://oracle.pic.ws.netease.com/photohtml5.json?channelid=0080&method=getwatermark',
			'proxyImage' : 'http://oracle.pic.ws.netease.com/photohtml5.json?method=getphotourl'
		}
	}
}(window);