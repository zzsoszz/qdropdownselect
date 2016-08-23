(function($){

		var plugname="qdropdownselect";

		var  defaultoptions = {
			  selector      : this.selector
		};

		$.fn[plugname]=function()
		{
			var isMethodCall=arguments.length>0 && typeof arguments[0] === "string";
			if(isMethodCall)
			{
				var methodname=arguments[0];
				var args = Array.prototype.slice.call(arguments,1);
				this.each(function() {
					var instance = $.data( this,plugname);
					if(instance && $.isFunction( instance[methodname] ))
					{
						var method=instance[methodname];
						method.apply(instance,args);
					}
				});
			}else{
				var inputoptions = arguments;
				$(this).each(
						function ()
						{
							var optionsnew = $.extend( {}, defaultoptions);
							if(inputoptions.length>0)
							{
									optionsnew=$.extend(optionsnew,inputoptions[0]);
							}
							var instance=$(this).data(plugname);
							if(instance)
							{
								instance.init(optionsnew);
							}else
							{
								var target=$(this);
								instance=new PluginObject(target);
								instance.init(optionsnew);
								$(this).data(plugname,instance);
							}
						}
					);
					return this;
			};
		}

		function PluginObject(target)
		{
			this.firstItem;
			this.lastItem;
			this.selectedItem;
			this.dropDownSelectEle;
			this.init=function(optionsnew)
			{
				this.dropDownSelectEle=optionsnew.dropDownSelectEle.clone().removeClass("qdropdownselectTemp");
				this.dropDownSelectEle.css({
									'position':'absolute',
									'width':target.outerWidth()+'px',
									'top':target.offset().top+target.outerHeight()+"px",
									'left':target.offset().left+"px",
									'box-sizing':'border-box'
				}).attr("id",$.guid+"Qdropdownselect");
				//target.attr("id")  jQuery.guid
				//console.log("guid:",$.guid);
				$("body").append(this.dropDownSelectEle);
				this.firstItem=this.dropDownSelectEle.find(".qitem").first();
				this.lastItem=this.dropDownSelectEle.find(".qitem").last();
				var resizeTimer;
				$(document).on("keydown",function(event){
					event.preventDefault();
					//console.log(event.keyCode);
					if(event.keyCode==37)
					{
						//left
					}else if(event.keyCode==38)
					{
						//top
					   
					   if(resizeTimer){
						   clearTimeout(resizeTimer)
					   }
					   resizeTimer=setTimeout(function(){
						  this.moveUp();
					   },100);

					}else if(event.keyCode==39)
					{
						//right
					}else if(event.keyCode==40)
					{
						//bottom
					   if(resizeTimer){
						   clearTimeout(resizeTimer)
					   }
					   resizeTimer=setTimeout(function(){
						  this.moveDown();
					   },100);
					}else if(event.keyCode==13)
					{
						//bottom
						this.comfirm();
					}
				});
				target.on("click",$.proxy(function(event){
					event.preventDefault();
					//console.log("show",this.dropDownSelectEle.attr("id"));
					this.dropDownSelectEle.show();
				},this));
				/*
				target.on("focus",function(event){
					
				});
				*/
				$(document).on("click",$.proxy(function(event){
					//console.log("click",event.target.id);
					if(event.target!=target.get(0) && $(event.target).closest(this.dropDownSelectEle).length  < 1) 
					{
						  //console.log("hide",this.dropDownSelectEle.attr("id"));
						  this.dropDownSelectEle.hide();
					}
				},this));
				this.dropDownSelectEle.on("click",$.proxy(function(event){
					var v=$(event.target).closest(".qitem");
					if(v.length > 0) 
					{
						  this.setSelected(v);
						  this.comfirm();
					}
				},this));
				/*
				$(document).bind('mousewheel', function(event, delta) {
					var dir = delta > 0 ? 'Up' : 'Down';
					console.log(dir);
					return false;
				});
				*/
			};
			this.hide=function()
			{
				this.dropDownSelectEle.hide();
			};
			this.show=function()
			{
				this.dropDownSelectEle.show();
			};
			this.setSelected=function(qitemele)
			{
				if(this.selectedItem!=null)
				{
					this.selectedItem.removeClass("active");
				}
				if(qitemele.length>0)
				{
					this.selectedItem=qitemele.addClass("active");
				}else{
					this.selectedItem=null;
				}
			};
			this.setValue=function(val)
			{
				var result=this.dropDownSelectEle.find(".qitem").filter(function()
					{
						if($(this).data("qvalue")==val){
							return true;
						}
					}
				);
				if(result.length>0)
				{
					this.setSelected($(result.get(0)));
				}
			};
			this.comfirm=function()
			{
				target.trigger("qdropdownselect.change",this.selectedItem.data("qvalue"));
				this.hide();
			};
			this.moveDown=function(){
				if(this.selectedItem==null)
				{
					this.setSelected(this.firstItem);
				}else{
					this.setSelected(this.selectedItem.next());
				}
			};
			this.moveUp=function()
			{
				if(this.selectedItem==null)
				{
					this.setSelected(this.lastItem);
				}else{
					this.setSelected(this.selectedItem.prev());
				}
			};
		}
		/*
		PluginObject.prototype={
			init:function()
			{
				this.ele.on("keydown",function(event){
					console.log(event.keyCode);
				}
			},
			hide:function()
			{
				
			},
			show:function()
			{
				
			}
		}
		*/

})(jQuery);



if(angular && angular.module)
{
	
	var qui=angular.module("qui",[]);
	//angular.element("body>div.ng-scope").scope().username
	qui.directive('qdropdownselect',[function() {
	    return {
		        restrict: 'A',
		        priority: 100,
		        link: function(scope, element, attrs) {
		        	element.qdropdownselect({dropDownSelectEle:$(attrs['qdropdownselecttemp'])});
		        	element.on("qdropdownselect.change",function(event,val){
			          element.val(val);
			          //attrs.$set('ngModel',val);
			          //attrs['ngModel'] 属性的名字
			          //attrs['ngModel'] 属性的的值
			          scope[attrs['ngModel']]=val;
			        });
			        //console.log("ngMoel",attrs);
				 　　// observe changes to interpolated attribute
				 　 attrs.$observe('ngModel', function(value) {
				     　　console.log('ngModel has changed value to ' + value);
				     	 element.qdropdownselect("setValue",""+value);
				 　 });
				 	
		        }
		    };
		}]
	);

	
}




