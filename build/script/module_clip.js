/*
 * Clip v:final
 *
 * Copyright 2011, GuoAimin
 * Date: 2011-9-14
 */
 
 
/*
 *	类名：[Clip]
 *	功能：功能组件
 *	作用：剪裁框组件，稳定版本
 */

void function(window,undefined){
	var Clip=function(node){
		var indicator=arguments.callee,
			doc=document,
			tk=imageMagic.tk,
			that=this,
			handlerSize=6,
			rules=null;
			node=node || doc.getElementsByTagName('body')[0];
			
		if(!that instanceof indicator){ return new indicator(node)};	
		
		rules={
			'TL':{
				css:'top:0;left:0;cursor:nw-resize',
				size:function(e){//左上
					rules['CL'].size(e); rules['TC'].size(e);
				}
			},	
			'TC':{
				css:'top:0;left:48%;cursor:n-resize',
				size:function(e){//上
					/*that.hanlderInfo.height= Math.max(that.hanlderInfo._down - e.clientY,40);
					that.hanlderInfo.top = that.hanlderInfo._fixTop - that.hanlderInfo.height;*/
					that.correctY(that.hanlderInfo._down-e.clientY,that.hanlderInfo._mxTH);
					that.correctTop();
				}	
			},
			'TR':{
				css:'right:0;top:0;cursor:ne-resize',
				size:function(e){//右上
					rules['CR'].size(e); rules['TC'].size(e);
				}
			},
			'CL':{
				css:'top:48%;left:0;cursor:w-resize',
				size:function(e){//左
					/*that.hanlderInfo.width = Math.max(that.hanlderInfo._right - e.clientX,40);
					that.hanlderInfo.left = that.hanlderInfo._fixLeft - that.hanlderInfo.width;*/
					that.correctX(that.hanlderInfo._right - e.clientX,that.hanlderInfo._mxLW);
					that.correctLeft();
					
				}
			},
			'CR':{
				css:'top:48%;right:0px;cursor:e-resize',
				size:function(e){//右
					//that.hanlderInfo.width = Math.max(e.clientX - that.hanlderInfo._left,40);
					that.correctX(e.clientX-that.hanlderInfo._left,that.hanlderInfo._mxRW);
				}	
			},
			'BL':{
				css:'bottom:0;left:0;cursor:sw-resize',
				size:function(e){//左下
					rules['CL'].size(e); rules['BC'].size(e);
				}	
			},
			'BC':{
				css:'bottom:0;left:48%;cursor:s-resize',
				size:function(e){//下
					//that.hanlderInfo.height = Math.max(e.clientY-that.hanlderInfo._up,40);
					that.correctY(e.clientY-that.hanlderInfo._top,that.hanlderInfo._mxDH);  
				}	
			},
			'BR':{
				css:'bottom:0;right:0px;cursor:se-resize',
				size:function(e){//右下
					rules['CR'].size(e); rules['BC'].size(e);
				}
			}
		};
		
		that.area=null;
		
		that.activity || (indicator.prototype.constructor=indicator),
		indicator.fn=indicator.prototype,
		indicator.fn.constructor=indicator;
		
		indicator.fn.activity=function(config,fn){
			var handler=null,handleStyle=[];
			typeof fn==='function' && (that.fn=fn);
			that.data && (that.Data=null);
			
			if(null===that.area){
				that.info=tk.getHtmlElement('span')
				that.area=tk.getHtmlElement('div');
				that.area.style.visibility='hidden';
				that.area.id='clipArea';
				
				that.area.appendChild(that.info);
				node.appendChild(that.area);	
					
				handleStyle=['TL','TC','TR','CL','CR','BL','BC','BR'];
				
				tk.each(Array(8),function(a,b){
					handler=tk.getHtmlElement('b');
					handler.id=handleStyle[a];
					handler.fn=rules[handleStyle[a]];
					tk.addEvent(handler,'mousedown',that.mousemoveCheckThreshold,false);
					that.area.appendChild(handler);
					that.setHanldPosition(handler,that.area,handleStyle[a]);
				});
				tk.addEvent(that.area,'mousedown',that.mousemoveCheckThreshold,false);
				that.area.style.visibility='visible';
			};
			that.setProp(+config.width,+config.height);
			that.area.style.width=config.width+'px';
			that.area.style.height=config.height+'px';
		};
		
		indicator.fn.setHanldPosition=function(c,p,d){
			var W=p.offsetWidth,H=p.offsetHeight,w1=(W-handlerSize),w2=Math.floor((W-handlerSize)/2),h1=(H-handlerSize),h2=Math.floor((W-handlerSize)/2);
			c.style.cssText=rules[d].css;
		};
		
		indicator.fn.mousemoveCheckThreshold=function(e){
			e=tk.getEvent(e);
			var target=tk.getTarget(e),pointer=[],eType=e.type;
			while(target && target.nodeType!==1){
				target=target.parentNode;
			};
			({
				mousedown:function(e){
					e=tk.getEvent(e);
					tk.stopEvent(e);
					
					doc.currentTarget=target;
					that.pos=tk.getClinetRect(target);
					that.origin=[e.clientX-that.pos.left,e.clientY-that.pos.top];
					target.nodeName.toLowerCase()==='b' && that.checkHandler(e);
					tk.addEvent(doc,'mouseup',that.mousemoveCheckThreshold,false);
					tk.addEvent(doc,'mousemove',that.mousemoveCheckThreshold,false);
					
				},
				mousemove:function(e){
					e=tk.getEvent(e);
					var target=doc.currentTarget,reffer={
						top:e.clientX,
						right:e.clientY+target.offsetWidth,
						down:e.clientX+target.offsetHeight,
						left:e.clientY
					};
										
					target.nodeName.toLowerCase()==='b' ? that.handlerMove.call(target,e,reffer) : that.areaMove.call(target,e,reffer);
					tk.stopEvent(e);
				},
				mouseup:function(e){
					e=tk.getEvent(e);
					var target=tk.getTarget(e);
					if(target.nodeName.toLowerCase()!=='b'){try{target.style.cursor='move'}catch(e){}};
					tk.removeEvent(doc,'mousemove',that.mousemoveCheckThreshold,false);
					tk.removeEvent(doc,'mouseup',that.mousemoveCheckThreshold,false);
					
					that.pos=that.origin=null;
					delete that.hanlderInfo;
					tk.stopEvent(e);
				}
			})[e.type](e)
			
		};
		
		indicator.fn.checkHandler=function(e){
			
			e=tk.getEvent(e);
			var target=tk.getTarget(e),parent=target.parentNode,rect=tk.getClinetRect(parent);
			that.hanlderInfo || (that.hanlderInfo={});
			
			that.hanlderInfo.mxT=0;
			that.hanlderInfo.mxL=0;
			that.hanlderInfo.mxR=parent.parentNode.clientWidth+parent.parentNode.scrollLeft-2;
			that.hanlderInfo.mxB=parent.parentNode.clientHeight+parent.parentNode.scrollTop-2;
			
			that.hanlderInfo.mxR=Math.max(that.hanlderInfo.mxR,that.hanlderInfo.mxL+40);
			that.hanlderInfo.mxB=Math.max(that.hanlderInfo.mxB,that.hanlderInfo.mxT+40);
  
			//起始信息
			that.hanlderInfo.width=parent.clientWidth;
			that.hanlderInfo.height=parent.clientHeight;
			that.hanlderInfo.left=parent.offsetLeft;
			that.hanlderInfo.top=parent.offsetTop;
			
			//元素四个边界的位置
			that.hanlderInfo._left=rect.left;
			that.hanlderInfo._right=rect.right;
			that.hanlderInfo._top=rect.top;
			that.hanlderInfo._down=rect.bottom;
			
			/*that.hanlderInfo._left=e.clientX-that.hanlderInfo.width;
			that.hanlderInfo._right=e.clientX+that.hanlderInfo.width;
			that.hanlderInfo._top=e.clientY-that.hanlderInfo.height;
			that.hanlderInfo._down=e.clientY+that.hanlderInfo.height;*/

			that.hanlderInfo._fixLeft=that.hanlderInfo.width+that.hanlderInfo.left;
			that.hanlderInfo._fixTop=that.hanlderInfo.height+that.hanlderInfo.top;
					
			that.hanlderInfo._mxRW = that.hanlderInfo.mxR-that.hanlderInfo.left;  
			that.hanlderInfo._mxDH = that.hanlderInfo.mxB-that.hanlderInfo.top;  
			that.hanlderInfo._mxTH = Math.max(that.hanlderInfo._fixTop -that.hanlderInfo.mxT,0);  
			that.hanlderInfo._mxLW = Math.max(that.hanlderInfo._fixLeft-that.hanlderInfo.mxL,0);
			
		};
		indicator.fn.correctX=function(w,mxW){
			w = that.correctWidth(w,mxW);
			that.hanlderInfo.width=w;
		};
		indicator.fn.correctY=function(h,mxH){
			h = that.correctHeight(h,mxH);
			that.hanlderInfo.height=h;
		};
		indicator.fn.correctWidth=function(w,mxW){
			w = Math.min(mxW,w);  
 			w = Math.max(w,40,0);
			return w;
		};
		indicator.fn.correctHeight=function(h,mxH){
			h = Math.min(mxH, h);  
 			h = Math.max(h,40,0);
			return h;
		};
		indicator.fn.correctTop=function() {  
			that.hanlderInfo.top=that.hanlderInfo._fixTop-that.hanlderInfo.height;  
		}; 
		indicator.fn.correctLeft=function() {  
			that.hanlderInfo.left=that.hanlderInfo._fixLeft-that.hanlderInfo.width;  
		};
		indicator.fn.handlerMove=function(e){
			e=tk.getEvent(e);
			var d=this.id;
			this.fn.size(e);
			that.resize();
			tk.stopEvent(e);
		};
		indicator.fn.resize=function(t){
			var target=that.area;
				target.style.cssText='width:'+that.hanlderInfo.width+'px;height:'+that.hanlderInfo.height+'px;top:'+that.hanlderInfo.top+'px;left:'+that.hanlderInfo.left+'px';
				
				that.fn && that.fn();
				
				that.setProp(that.hanlderInfo.width,that.hanlderInfo.height);
		},
		indicator.fn.areaMove=function(e){
			var pointer=[e.clientX,e.clientY],parent=this.parentNode,max=[parent.scrollWidth,parent.scrollHeight],size=tk.getClinetRect(this.parentNode);
			this.style.cursor='crosshair';
			

			var temp=Math.max(pointer[0]-size.left+parent.scrollLeft-that.origin[0],0);
			temp=Math.min(temp,max[0]-this.offsetWidth);
			this.style.left=temp+'px';

			var temp=Math.max(pointer[1]-size.top+parent.scrollTop-that.origin[1],0);
			temp=Math.min(temp,max[1]-this.offsetHeight);
			this.style.top=temp+'px';

		};
		indicator.fn.removeArea=function(fn){
			try{that.area.parentNode.removeChild(that.area),that.area=null;}catch(e){}finally{('function'===typeof fn) && fn();};
		};
		indicator.fn.getData=function(){
			try{return [that.area.offsetLeft,that.area.offsetTop,that.area.offsetWidth,that.area.offsetHeight];}catch(e){};
		};
		indicator.fn.setProp=function(a,b){
			that.info.innerHTML='宽:'+a+'px&nbsp;&nbsp;高:'+b+'px&nbsp;&nbsp;比例:'+that.proportion(a,b);
		};
		indicator.fn.proportion=function (x,y){
			x=x.toPrecision(1),y=y.toPrecision(1);
			var z = ((x < y) ? x : y);
			while (true) {
				if (x % z == 0 && y % z == 0) {
					break;
				}
				z--;
			};			
			return (Math.abs(x / z) + ":" + Math.abs(y / z));
    	};
	};	
	imageMagic.tk.domReady(function(){
		imageMagic.clip || (imageMagic.clip=new Clip(document.getElementById(imageMagic.config.canvasContainer)));
	});
	
}(window);
