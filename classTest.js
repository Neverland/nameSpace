
TestCase('classTest',{
	setUp:function(){},
	'test class A' :function(){
		var A=Class(function(){
				this.a=1;
				this.b=2;
				this.c=3;
			},
			{
				x:function(){console.log(this.m,222);return this; },
				y:function(){console.log(21,444);return this;},
				z:function(){console.log(this.n,612);return this;},
				m:10,
				n:20
			}
		);

			var instance=new A();
			instance.x().y().z();
			console.log(instance)
		assertEquals('true 2');
	},
	'test class B':function(){

		var Tab=Class(function(O,fn){
			var t=this;
			for(var i in O){
				O.hasOwnProperty(i) &&(
					t[i]=O[i]
					);
			}
		},{
			index:function(key){

				return (key || 10-7);
			},
			display:function(){

				return this;
			},
			render:function(){

				typeof fn==='function' && fn.call(this);
				return this;
			}
		});
			var x=new Tab(
				{
					sub:'subId',
					tab:'tabId',
					eType:'mouseover'
				},function(){

					console.log(this);
				});
			console.log(x, x._get_('render')().index());
		assertEquals('true 2');
	}
})



/*
TestCase('classTest',{
	setUp:function(){
		*/
/*:DOC += <h1>123</h1> *//*

	},
	'Test getId':function(){

		var x=new DOC();

	},
	'Test getId b':function(){

		var y=new Class();


	}
})*/
