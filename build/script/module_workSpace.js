/*
 * ImageMagic v0.5
 *
 * Copyright 2011, GuoAimin
 * Includes toolkit lib
 * Date: 2011-9-14
 */
 
 
/*
 *	类名：[WorkSpace]
 *	功能：核心组件
 *	作用：实现工作区上所有功能
 */
void function(window,undefined){
	var WorkSpace=function(){
		var 
		indicator=arguments.callee,
		doc=document,
		tk=imageMagic.tk,
		IM=imageMagic,
		that=this,
		
		usedWidth=0,
		usedHeight=0,
		workWidth=0,
		workHeight=0,
		IMC=IM.config,
		IMW=IMC.workSpace,
		parent,tbody,tfoot;

		
		if(!that instanceof indicator){ return new indicator()};
		
		IM.editing || (IM.editing=false);
		
		indicator.fn=indicator.prototype;
		indicator.fn.constructor=indicator;
		
		indicator.fn.workSpaceControl=function (){//工作区调整宽高使其充满浏览器视口
			var op={
				toolbar:doc.getElementById(IMC.toolbar),
				leftSidebar:doc.getElementById(IMC.leftSidebar),
				canvasContainer:doc.getElementById(IMC.canvasContainer),
				viewPort:IM.tk.getViewportSize()
			};
	
			usedWidth=doc.getElementById(IMC.leftSidebar).offsetWidth;
			usedHeight=doc.getElementById(IMC.toolbar).offsetHeight;
			
			workWidth=op.viewPort[0]-parseInt(usedWidth)-20;	
			workHeight=op.viewPort[1]-parseInt(usedHeight)-10;
			
			op.canvasContainer.style.width=workWidth+'px';
			op.canvasContainer.style.height=workHeight+'px';
			op.leftSidebar.style.height=workHeight+'px';
			IM.availSize || (IM.availSize=null);
			IM.availSize=[workWidth,workHeight]
		},
		indicator.fn.canvasControl=function(){//创建canvas标签并缓存
			IM.canvas= tk.getHtmlElement('canvas');
		},
		indicator.fn.imageLoader=function(){//图片上传组件控制器
			var viewPort=IM.tk.getViewportSize(),native=doc.getElementById(IMC.imageLoader.native),web=doc.getElementById(IMC.imageLoader.web),btn=doc.getElementById(IMC.imageLoader.btn),reg=/\.(gif|png|jpg)$/i,parent=doc.getElementById('imageForm'),tbody=parent.getElementsByTagName('tbody')[0],tfoot=parent.getElementsByTagName('tfoot')[0];
			
			
			IMC.imageLoader.loader=doc.getElementById(IMC.imageLoader.id);
			IMC.imageLoader.loader.style.height=viewPort[1]+'px';
			
			
			tk.addEvent(web,'change',function(){
				//var reg=/^http\:\/\/.+\.(gif|png|jpg)$/,value=this.value.trim();
				reg.test(value) ? (IM.workSpace.imageGetSrc.call(this)) : alert('地址有误');
			},false);
			
			tk.addEvent(web,'focus',function(){
				this.value==this.defaultValue && (this.value='');
			},false);
			
			tk.addEvent(native,'change',function(){
				var value=this.value;
				IM.workSpace.imageGetSrc.call(this)
				reg.test(value) ? (IM.workSpace.imageGetSrc.call(this)) : (alert('格式有误'),this.value='');
			},false);
			
			tk.addEvent(btn,'click',function(){
				IM.imgSrc && (
					parent.reset(),
					tfoot.style.display='block',
					IM.workSpace.imageInstall(IM.imgSrc)
				);
			},false);
			
			
		},
		indicator.fn.imageGetSrc=function(){//获得本地上传的图片数据
			var src=this.files[0].getAsDataURL();
			IM.imgSrc=src;
		},
		indicator.fn.imageInstall=function(imgSrc,fn){
			var canvas=IM.canvas,cxt=canvas.getContext('2d');
			IM.img=new Image;
			tk.addEvent(IM.img,'load',function(){
				IMC.imageLoader.loader.style.display='none';
				var canvasSize=[IM.img.width,IM.img.height];
				IM.maxSize=canvasSize;
				cxt.strokeStyle=cxt.createPattern(IM.img,'no-repeat');
				canvas.width=canvasSize[0],canvas.height=canvasSize[1];
				cxt.drawImage(IM.img,0,0,canvasSize[0],canvasSize[1]);
				
				typeof(fn)==='function' && fn();
				
			},false);
			tk.addEvent(IM.img,'error',function(){
				IMC.imageLoader.loader.style.display='';
				
			},false);
			IM.img.src=imgSrc;
			doc.getElementById(IMC.canvasContainer).appendChild(canvas);
		};
		indicator.fn.getCanvas=function(){
			//var canvas=IM.canvas,cxt;
			var canvas=doc.getElementById('canvas'),cxt;
			canvas.getContext && (cxt=canvas.getContext('2d'));
			return cxt;
		};		
		indicator.fn.clearCanvas=function(){
			//var canvas=IM.canvas,cxt;
			var canvas=doc.getElementById('canvas'),cxt=canvas.getContext('2d');
			cxt.clearRect(0,0,IM.availSize[0],IM.availSize[1]);
		};	
		indicator.fn.init=function(){
			var temp=IMW.control,handler=doc.getElementById(temp.id).getElementsByTagName(temp.tag),i=handler.length;
		
			tk.each(handler,function(a,b){
				tk.addEvent(b,'click',function(){
					var canvas=IM.canvas,cxt=canvas.getContext('2d');
					/////////////////////////////////
					//console.log(this.id.replace(/IM/,''))
					
					//that.dispose();
					cxt && IM[this.id.replace(/IM/,'')].init();
				},false)
			});			
		};
		indicator.fn.destroy=function(){
			var temp=IMW,handler=temp.button;
			tk.each(handler,function(a,b){
				var b=doc.getElementById(b);
				tk.addEvent(b,'click',function(){
					IM[this.id.replace(/Button/,'')].destroy();
				},false)
				/*b.onfocus=function(){
					this.blur();
				};*/
				tk.addEvent(b,'focus',function(){
					this.blur();
					//this.style.border='solid 1px #4D90FE';
				},false);
				
			});	
		};
		/*indicator.fn.dispose=function(){
			tk.each(IMW.Function,function(a,b){
				IM['_'+b].destroy();
			});		
		};*/
		
		//public method end
		
//interface [init] [destroy] 
//////////////////////////////////////////////////////////////////////////////////////////		
		IM._clip={//工作区剪裁静态方法
			canvas:null,
			init:function(){
				
				try{
					IM.clip.area && IM._clip.removeArea();
					IM._mark.destroy();
				}catch(e){};
				
				var canvas=IM.canvas,cxt=IM.canvas.getContext('2d');
				this.canvas=canvas;
				IM.img.src=canvas.toDataURL();
				IM._clip.areaCut(IMC.areaSize[0],IMC.areaSize[1]);
			},
			uploadImg:function(){//渲染剪裁获得的图片
				var canvas=IM.canvas,cxt=canvas.getContext('2d'),newImg,temp=IM.clip.getData(),x,y,w,h;
				IM.step || (IM.step=0);
				tk.is(temp)==='Array' && (
					x=Math.max(temp[0],0),
					y=Math.max(temp[1],0),
					w=Math.min(temp[2]-2,IM.maxSize[0]-x),
					h=Math.min(temp[3]-2,IM.maxSize[1]-y)
				);
				if (w>0 && h>0){try{newImg=cxt.getImageData(x,y,w,h),canvas.width = w,canvas.height = h}catch(e){}};
				
				try{cxt.putImageData(newImg,0,0)}catch(e){};
				//localStorage.setItem('Img'+IM.step++,JSON.stringify(newImg));
			},
			areaCut:function(x,y){//生成剪裁框
				var clipBtn=doc.getElementById(IMW.button[0]);
				IM.clip.activity({width:x,height:y},function(){
					//////////////////////////////
					console.log(1);	
					//////////////////////////////
				});
				IM.tk.addEvent(IM.clip.area,'dblclick',function(){
					IM._clip.getImage();
				},false);
				
				IM.tk.addEvent(clipBtn,'click',function(){
					/*clipBtn.disabled='disabled';
					
					IM._clip.getImage();
					IM._clip.removeArea(function(){
						clipBtn.removeAttribute('disabled');
					});*/
					IM._clip.finishClip(clipBtn);
					return false;
				},false);
				IM.tk.addEvent(document,'keypress',this.keybordCut,false);
			},
			keybordCut:function(e){
				e=tk.getEvent(e);
				var keyCode=e.keyCode || e.charCode,target=IM.tk.getTarget(e);
				if(keyCode===13){
					IM._clip.finishClip(e.target);
				};
				return false;
			},
			getImage:function(){//获取剪裁图片，重置剪裁框顶点至0 0
				try{
					IM._clip.uploadImg(this);
					IM.clip.area.style.left='0px',
					IM.clip.area.style.top='0px'
				}catch(e){};
			},
			removeArea:function(fn){
				IM.clip.removeArea(fn);
			},
			defaultValue:function(){//工作区默认配置
				var node=doc.getElementById('clipDeafult'),radio=doc.getElementById('clipRadioDefault'),value=null;
				IM.tk.addEvent(node,'change',function(){
					true===radio.checked &&(
						value=this.value.split('*'),
						IM._clip.areaCut(value[0],value[1])
					);
				},false);
			},
			clientValue:function(){
				var radio=doc.getElementById('clipRadioClient'),w=doc.getElementById('clipClientWidth'),h=doc.getElementById('clipClientHeight');

				IM.tk.addEvent(w,'keyup',function(){
					true===radio.checked && IM._clip.setClientValue.call(this,h,0);	
				},false);
				IM.tk.addEvent(h,'keyup',function(){
					true===radio.checked && IM._clip.setClientValue.call(this,w,1);	
				},false);
			},
			setClientValue:function(node,flag){
				var temp=this.value.trim(),x=parseInt(node.value.trim());
				if(/^\d+$/.test(temp) && /^\d+$/.test(x)){
					if(temp>IMC.areaSize[0] && x>IMC.areaSize[1]){
						if(temp<IM.maxSize[0]&& x<IM.maxSize[1]){
							0===flag ? IM._clip.areaCut(temp,x) : IM._clip.areaCut(x,temp);	
						}
					};
				}
			},
			finishClip:function(O){
				O.disabled='disabled';
				IM._clip.getImage();
				IM._clip.removeArea(function(){
					O.removeAttribute('disabled');
				});
				return false;		
			},
			destroy:function(){
				IM.tk.removeEvent(document,'keypress',this.keybordCut,false);
				try{IM._scale.destroy();}catch(e){};
				//IM.img.src=this.canvas.toDataURL();
			}
		};
////////////////////////工作区缩放静态方法//////////////////////////////////////////////////////////////////

		IM._scale={//工作区缩放静态方法
			x:1,
			y:1,
			scaleDW :'scaleDW',
			scaleDH :'scaleDH',
			scaleDS :'scaleDS',
			scaleCS :'scaleCS',
			scaleCW :'scaleCW',
			scaleCH :'scaleCH',
			locked : 'scaleLocked',
			scaleRest : 'scaleRest',
			canvas:null,
			init:function(){
				
				try{
					IM.clip.area && IM._clip.removeArea();
					IM._mark.destroy();
				}catch(e){};
				
				var canvas=IM.canvas,cxt=IM.canvas.getContext('2d');
				
				this.canvas=canvas,
				
				this.dw=doc.getElementById(this.scaleDW),
				this.dh=doc.getElementById(this.scaleDH),
				
				this.ds=doc.getElementById(this.scaleDS),
				this.cs=doc.getElementById(this.scaleCS);
				
				this.cw=doc.getElementById(this.scaleCW),
				this.ch=doc.getElementById(this.scaleCH);
				
				this.lock=doc.getElementById(this.locked);
				this.rest=doc.getElementById(this.scaleRest);
				this.dw.innerHTML=canvas.width;
				this.dh.innerHTML=canvas.height;
				
				IM.img.src=canvas.toDataURL();
				
				this.ds.innerHTML=IM.img.src.length;
				this.w=canvas.width;
				this.h=canvas.height;
				
				this.upInfo(canvas.width,canvas.height);
				this.addEvent();
			},
			upInfo:function(w,h,l){
				w=w || 0, h=h || 0, l=l || 0;
				this.dw.value=w;
				this.dh.value=h;
				this.cs.innerHTML=l || '未知';
			},
			
			addEvent:function(){
				var that=IM._scale;	
				that.container=doc.getElementById(IMC.canvasContainer);
				that.wheel=navigator.userAgent.indexOf('Firefox')!==-1 ? 'DOMMouseScroll' : 'mousewheel';
				
				IM.tk.addEvent(that.cw,'keyup',that.clientValue,false);
				IM.tk.addEvent(that.ch,'keyup',that.clientValue,false);
				
				IM.tk.addEvent(that.rest,'click',function(){
					that.x=1;
					that.y=1;
					that.setScale();	
				},false);
				
				IM.tk.addEvent(that.container,that.wheel,that.zoom,false);
			},
			clientValue:function(e){
				e=IM.tk.getEvent(e);
				var that=IM._scale,target=IM.tk.getTarget(e),value=parseInt(target.value.trim()),reg=/\d+/,checked=that.locked;
				value=Math.max(value,1);
				value=Math.min(value,IMW.scaleType);
				value=isNaN(value) ? 0 : value;
				
				target.value=value;
				if(target===that.cw && reg.test(value)){					
					that.correctXY(value,that.ch);
				}else if(target===that.ch && reg.test(value)){
					that.correctXY(value,that.cw);
				};
				that.x/=100;
				that.y/=100;
				that.setScale(1);
			},
			correctXY:function(value,b){
				var that=IM._scale;				
				that.x=value;
				if(that.lock.checked===true){
					that.y=value;
					b.value=isNaN(value) ? 10 : value;
				}else{
					that.y=parseInt(b.value);
				};
			},
			zoom:function(e){
				e=tk.getEvent(e);
				IM._scale.getScale((e.wheelDelta ? e.wheelDelta / (-120) : (e.detail || 0) / 3) * (IMW.zoom));	
				IM._scale.setScale();
			},
			setScale:function(src){
				var that=IM._scale,canvas=IM.canvas,cxt=IM.canvas.getContext('2d'),img=IM.img,x=Math.ceil(that.x),y=Math.ceil(that.y),w=Math.max(img.width*that.x,IMC.areaSize[0]),h=Math.max(img.height*that.y,IMC.areaSize[1]),w=parseInt(w),h=parseInt(h);
				
				if(IMW.scaleLock){
					w=Math.min(w,IM.availSize[0]),h=Math.min(h,IM.availSize[1]);			
					if(w===IM.availSize[0] || h===IM.availSize[1]){return false};
				};
				
				
				IMW.scaleDataSize===true && this.upInfo(w,h,canvas.toDataURL().length);
				cxt.clearRect(0,0,canvas.width,canvas.height);
				cxt.scale(that.x,that.y);
				canvas.width=w;
				canvas.height=h;
				src===1 || (
					that.ch.value=parseInt(Math.ceil(w/that.w*100)),
					that.cw.value=parseInt(Math.ceil(h/that.h*100))
				);
				
				that.dw.value=isNaN(w)?1:w;
				that.dh.value=isNaN(h)?1:h;
				
				cxt.drawImage(img,0,0,w,h);
			},
			getScale:function () {
				function zoom(s,z) {
					return	s > 0 && s >-z ? z :
							s < 0 && s < z ?-z : 0;
				}
				return function(z) { 
					if(z){
						var hZoom = zoom( this.y, z ), vZoom = zoom( this.x, z );
						if ( hZoom && vZoom ) {
							this.y += hZoom, this.x += vZoom;
							this.x=Math.min(this.x,IMW.scaleType/100);
							this.y=Math.min(this.y,IMW.scaleType/100);
						}
					}
				}
			}(),
			destroy:function(){
				try{IM.tk.removeEvent(this.container,this.wheel,this.zoom,false)}catch(e){};
				//IM.img.src=this.canvas.toDataURL();
			}
		};
//////////////////////////////////////////////////////////////////////////////////////////
		IM._rotate={//57°17'44.806' 一弧度
			a:1,
			b:-1,
			m:0,
			canvas:null,
			init:function(){
				try { 
					IM.clip.area && IM._clip.removeArea();
					IM._mark.destroy();
					IM._scale.destroy();
				}catch(e){};
				
				var that=IM._rotate,canvas=IM.canvas,cxt=IM.canvas.getContext('2d');
				
				that.canvas=canvas;
				
				that.handers=doc.getElementById(IMW.rotateHandler);
				that.r=0;
				
				IM.img.src=canvas.toDataURL();
				
				IM.tk.addEvent(that.handers,'click',that.addEvent,false);	
			},
			addEvent:function(e){
				e=tk.getEvent(e);
				var that=IM._rotate,target=tk.getTarget(e),t=null;
				
				if(target.nodeType ===1 && target.nodeName.toLowerCase()==='img'){
					t=target.getAttribute('alt');
					({
						l:function(){
							(that.m==0)? that.m=3:that.m--;
							that.left();
							that.setRotate(1);
						},
						r:function(){
							(that.m==3)? that.m=0:that.m++;
							that.right();
							that.setRotate(1);
						},
						v:function(){that.a*=-1,that.b*=-1,that.vertical(),that.setRotate();},
						h:function(){that.b*=-1,that.a*=-1,that.horizontal(),that.setRotate();}					
					})[t]();
				};
				IM.tk.stopEvent(e);
			},
			vertical:function(){this.r=Math.PI-this.r;},
			horizontal:function(){this.r=Math.PI-this.r;},
			rotate:function(n) { this.r = n; },
			left:function() {
				/*this.r -= 90;
				if(this.r === -90){
					this.r = 270;	
				};this.setRotate(1)*/
				
				this.r -= Math.PI/2; 
			},
			right:function() { 
				/*this.r += 90;
				this.setRotate(1);
				if(this.r === 270){
					this.r = -90;	
				};*/
				
				this.r -= Math.PI/2; 
			},
			setRotate:function(n){
				var that=IM._rotate,
				canvas=IM.canvas,
				cxt=IM.canvas.getContext('2d'),
				img=IM.img,
				rules=null,
				w=img.width,
				h=img.height;

				cxt.clearRect(0,0,canvas.width,canvas.height);
				cxt.save();

				rules={
					0 : function(){
						canvas.setAttribute('width', w);
						canvas.setAttribute('height', h);
						cxt.rotate(0 * Math.PI / 180);
						cxt.drawImage(img, 0, 0);
						//console.log(1);
					},
					1 : function(){
						canvas.setAttribute('width', h);
						canvas.setAttribute('height', w);
						cxt.rotate(90 * Math.PI / 180);
						cxt.drawImage(img, 0, -h);
						//console.log(2);
					},
					2 : function(){
						canvas.setAttribute('width', w);
						canvas.setAttribute('height', h);
						cxt.rotate(180 * Math.PI / 180);
						cxt.drawImage(img, -w, -h);
						//console.log(2);
					},
					3 : function(){
						canvas.setAttribute('width', h);
						canvas.setAttribute('height', w);
						cxt.rotate(270 * Math.PI / 180);
						cxt.drawImage(img, -w, 0);
						//console.log(4);
					}
						
				}
				n && (rules)[that.m]()
				
				//水平垂直翻转

				n || (
					
					//cxt.translate(0,w),
					//cxt.rotate(this.r),
					console.log(that),
					//cxt.rotate(180*Math.PI/180),
					cxt.transform(that.a,0,0,that.b,0,0),
					cxt.drawImage(img, -w, 0)
					

				);
				cxt.restore(); 
				//IM.img=canvas.toDataURL();
			},
			destroy:function(){
				IM.tk.removeEvent(this.handers,'click',this.addEvent,false);
				IM.img.src=this.canvas.toDataURL();
			}
		};
//////////////////////////////////////////////////////////////////////////////////////////
		IM._mark={
			init:function(){
				try { 
					IM.clip.area && IM._clip.removeArea();
					IM._scale.destroy();
				}catch(e){};
				var that=IM._mark,canvas=IM.canvas;
				that.cxt=IM.canvas.getContext('2d');
				that.canvas=canvas;
				IM.img.src=canvas.toDataURL();
				
				that.markers=doc.getElementById(IMW.watermarkCon);
				that.control || (that.control=null);
				that.preview || (that.preview=null);
				that.xy || (that.xy=null);
				that.handers=doc.getElementById(IMW.watermarkControl);
				that.preview=IM.tk.getHtmlElement('canvas'); 
				that.content=that.preview.getContext('2d');
				that.cancel=doc.getElementById(IMW.watermarkCancel);
				that.OP=doc.getElementById(IMW.watermarkOP);
				that.opacity=IMW.watermarkOpacity;
				console.log(that.OP)
				IM.tk.addEvent(that.cancel,'click',that.removePreview,false);
				IM.tk.addEvent(that.handers,'click',that.addEvent,false);
				IM.tk.addEvent(that.markers,'dblclick',that.markersEvent,false);
				IM.tk.addEvent(that.OP,'blur',that.getWatermarkOpacity,false);
				

				that.hiddenMark();
			},
			hiddenMark:function(){
				this.markers.style.visibility='hidden';
				this.cancel.style.visibility='hidden';
			},
			getWatermark:function(src,alpha){
				var that=IM._mark,markImg=new Image,content=null;

				alpha=alpha||100;
				markImg.onload=function(){
					
					that.preview.width=this.width;
					that.preview.height=this.height;
					that.content.drawImage(markImg,0,0);
					var IMG=that.content.getImageData(0,0,this.width,this.height),data=IMG.data,len=data.length,i=3;
					
					//if(src.indexOf('png')===-1){
						for(;i<len;i+=4){data[i]=alpha*2.55}
					//};
					
					markImg.src=null;
					markImg.onload=null;
					IMG.data=data;
					
					//that.preview.width=0;
					//that.preview.height=0;
					
					that.content.putImageData(IMG,0,0);
					markImg.src=that.preview.toDataURL();
					
					
					if(that.canvas.width>markImg.width && that.canvas.height>markImg.height){
						that.previewMark(markImg);
					}else{
						 alert('水印尺寸不能大于图片尺寸');
						 return false;
					};
					//canvas=null;
				};
				markImg.src=src;
				that.cxt.restore();
			},
			getWatermarkOpacity : function(e){
				e=IM.tk.getEvent(e);
				var that=IM._mark,target=IM.tk.getTarget(e),value=parseInt(this.value);
				if(!isNaN(value) && value>0){
					that.opacity=value;	
				};
			},
			addEvent:function(e){

				e=IM.tk.getEvent(e);
				var target=IM.tk.getTarget(e),that=IM._mark;
			
				/*if(target.nodeType===1 && target.nodeName.toLowerCase()==='img'){
					({
						'waterMark':function(){
							that.markSrc=target.src;
						},
						'waterMarkClose':function(){
							var p=target.parentNode;
							while(p.nodeName.toLowerCase()!=='table'){
								p=p.parentNode;
							};
							p.parentNode.children.length>1 && p.parentNode.removeChild(p);
						}
					})[target.className]()
				}*/
				if(target.nodeType===1 && target.nodeName.toLowerCase()==='input'){
					that.markers.style.visibility='visible';
					that.cancel.style.visibility='visible';
					that.control=target.id.replace(/wm/g,'');
					//that.rules.TL.call(that.canvas);
				}
			},
			markersEvent:function(e){
				var that=this;
				var target=IM.tk.getTarget(e),that=IM._mark;

				
				if(target.nodeType===1 && target.nodeName.toLowerCase()==='img'){
					({
						'waterMark':function(){
							//that.markSrc=target.src;
							that.getWatermark(target.src,that.opacity);
						}				
					})[target.className]()
				}
			},
			rules:{
				TL: function(w,h){
					return [10,10];
				},
				TC: function(w,h){
					return [(this.width-w)/2,10];
				},
				TR: function(w,h){
					return [this.width-w-10,10];
				},
				CL: function(w,h){
					return [10,(this.height-h)/2];
				},
				CC: function(w,h){
					return [(this.width-w)/2,(this.height-h)/2];
				},
				CR: function(w,h){
					return [this.width-w-10,(this.height-h)/2];
				},
				BL: function(w,h){
					return [10,this.height-h-10];
				},
				BC: function(w,h){
					return [(this.width-w)/2,this.height-h-10];
				},
				BR: function(w,h){
					return [this.width-w-10,this.height-h-10];
				}
			},
			previewMark:function(img){
				var that=this;
				
				img.onload=function(){
					that.xy=that.getXY(img);
					that.canvas.parentNode.appendChild(that.preview);
					that.preview.style.cssText='position:absolute;left:'+that.xy[0]+'px;top:'+that.xy[1]+'px;';
					that.content.drawImage(this,0,0);
				}
			},
			getXY:function(img){
				return this.rules[this.control].call(this.canvas,img.width,img.height);	
			},
			uploadImg:function(){
				try{this.cxt.drawImage(this.preview,this.xy[0],this.xy[1])}catch(e){};
			},
			removePreview:function(){
				var that=IM._mark;
				try{that.canvas.parentNode.removeChild(that.preview); that.preview.width=0,that.preview.height=0;}catch(e){};	
			},
			destroy:function(){
				this.uploadImg();
				this.enter=false;
				this.removePreview();
				this.hiddenMark();

				IM.tk.removeEvent(this.handers,'click',this.addEvent,false);
				IM.tk.addEvent(this.cancel,'click',that.removePreview,false);
				IM.img.src=this.canvas.toDataURL();
				this.preview=null;
			}
		};
		if(window===this || 'indicator' in this) { return new indicator };
	};
	imageMagic.workSpace || (imageMagic.workSpace=new WorkSpace());
}(window);