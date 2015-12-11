// JavaScript Document
require.config({
　　baseUrl: "JS_V3",
　　paths: {
　　　 　"hammer" : "hammer",
	  'prototype' : 'prototype1.7.1',
	  'effect' : 'scriptaculous/effects',
	  'iscroll' : 'iscroll'
　　},
	shim: {
		'prototype' : {
			exports : 'Prototype'
		},
		'effect' : {
			deps : ['prototype'],
			exports : 'Effect'	
		},
		'iscroll' : {
			exports : 'IScroll'	
		}
　　}
});

require([],function(){
	//alert(document.body.clientWidth);
	//alert(document.body.clientHeight);
});

require(['hammer','effect'],function(Hammer,Effect){
	var topMenuIsShow=false;
	Hammer($('topMenuBt')).on("tap", function(event) {
		//alert('hello 1!');
		
		//Effect.SlideDown('topMenuBtOnBg',{duration:0.2});
		if(!topMenuIsShow){
			$('topMenuBtImg').src='Images/top_menu_bt_on.png';
			$('maskLayout').show();
			new Effect.Opacity('maskLayout', { from: 0.2, to: 1, duration: 0.3 });
			$('topMenuBtOnBg').show();
			Effect.BlindDown('topMenuShow',{duration:0.3 ,afterFinish:function(){
				//Effect.Appear('topMenuBtOnBg', { duration: 0.2});
			}});
			topMenuIsShow=true;
			//Effect.Appear('maskLayout', { duration: 0.5});
		} else {
			new Effect.Opacity('maskLayout', { from: 1, to: 0, duration: 0.3, afterFinish:function(e){
					$(e.element).hide();
			}});
			Effect.BlindUp('topMenuShow',{duration:0.3 ,afterFinish:function(e){
				/*new Effect.Opacity('topMenuBtOnBg', { from: 1, to: 0, duration: 0.3, afterFinish:function(){
					$(e.element).hide();
					$('topMenuBtImg').src='Images/top_menu_bt.png';
				}});*/
				$('topMenuBtOnBg').hide();
				$('topMenuBtImg').src='Images/top_menu_bt.png';
				//Effect.Appear('topMenuBtOnBg', { duration: 0.2});
			}});
			topMenuIsShow=false;
		}
	});
	
	//alert(document.body.clientWidth);
	//alert(document.body.clientHeight);
});
require([],function(){
	//alert(document.body.clientWidth);
	//alert(document.body.clientHeight);
	//alert(topMenuIsShow);不能使用其他require裏的變量
});
/*
require(['effect'],function(){
	$('btn1').observe('click',function(e){
		//Event.element(e).morph('margin-left : 100px');
		var i=parseInt(Event.element(e).getStyle('margin-left'));
		new Effect.Morph('btn1', {
		  style: 'background:#f00; color: #fff; margin-left : '+(i+100)+'px', // CSS Properties
		  duration: 0.8 // Core Effect properties
		});
	});
});
*/



