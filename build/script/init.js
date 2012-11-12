/*
 * ImageMagic v0.5
 *
 * Copyright 2011, GuoAimin
 * Includes toolkit lib
 * Date: 2011-9-14
 */
 
 
/*
 *	功能：核心组件
 *	作用：实现软件初始化
 */

void function(window,undefined){

	var doc,toolkit,root,rt,IM;
	
	imageMagic.tk.domReady(function(){
		doc=document;
		IM=imageMagic;
		
		IM.root=doc.getElementsByTagName('body')[0];
		//IM.tab(imageMagic.config.workSpace.tab)
		IM.accordion({wrapper:imageMagic.config.leftSidebar,current:'accordionHandler'}).init();
		
		IM.workSpace.workSpaceControl();//调整工作区
		IM.workSpace.imageLoader();
//		if(navigator.userAgent.indexOf('Firefox')===-1 ) {
//			alert('请使用Firefox3.6以上浏览器');
//			IM.root.innerHTML='';
//			return false;
//		};
		
		IM.workSpace.init();
		IM.workSpace.destroy();
		
		IM.workSpace.canvasControl();
		/*IM.workSpace.imageInstall('../images/canvas.jpg',function(){
			IM.workSpace.uploadImg();
		});	*/	

		
		IM._clip.defaultValue();//启用工作区clip预置剪裁框
		IM._clip.clientValue();//启用工作区clip用户自定义剪裁框
		
		
		
		IM.tk.addEvent(window,'beforeunload',function(){
			localStorage.clear();
		},false);
		
		/*IM.tk.addEvent(IM.clip.area,'dblclick',function(){
			IM._clip.getImage();
		},false);*/
		
		imageMagic.tk.addEvent(window,'resize',function(){
			IM.workSpace.workSpaceControl();
			IM.config.imageLoader.loader && IM.workSpace.imageLoader();
		},false);
		
	});
	
	
}(window);
