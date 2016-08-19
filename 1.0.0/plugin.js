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
			self=this;
			self.selectedItem;
			self.dropDownSelectEle;
			self.init=function(optionsnew)
			{
				self.dropDownSelectEle=optionsnew.dropDownSelectEle.clone();
				self.dropDownSelectEle.css({
									'position':'absolute',
									'width':target.width()+'px',
									'height':target.height()+'px',
									'top':target.offset().top+target.height()+"px",
									'left':target.offset().left+"px"
				});
				$("body").append(self.dropDownSelectEle);
				$(document).on("keydown",function(event){
					event.preventDefault();
					console.log(event.keyCode);
					if(event.keyCode==37)
					{
						//left
					}else if(event.keyCode==38)
					{
						//top
						self.moveUp();
					}else if(event.keyCode==39)
					{
						//right
					}else if(event.keyCode==40)
					{
						//bottom
						self.moveDown();
					}
				});

				target.on("click",function(event){
					event.preventDefault();
				});

				target.on("focus",function(event){
					self.dropDownSelectEle.show();
				});

				$(document).on("click",function(event){
					if(event.target!=target.get(0) && $(event.target).closest(self.dropDownSelectEle).length  < 1) 
					{
						  self.dropDownSelectEle.hide();
					}
				});

			};
			self.hide=function()
			{
				self.dropDownSelectEle.hide();
			};
			self.show=function()
			{
				self.dropDownSelectEle.show();
			};
			self.comfirm=function()
			{
				self.trigger("qdropdownselect.change",self.selectedItem.date("qvalue"));
			};
			self.moveDown=function(){
				console.log(self.selectedItem);
				if(self.selectedItem!=null)
				{
					console.log("qvalue:"+self.selectedItem.data("qvalue"));
					var v=self.selectedItem.remove("active").next();
					if(v.length>0)
					{
						self.selectedItem=v.addClass("active");
					}else{
						self.selectedItem=null;
					}
				}else{
					var v= self.dropDownSelectEle.find(".qitem").first().addClass("active");
					if(v.length>0)
					{
						self.selectedItem=v;
					}else{
						self.selectedItem=null;
					}
				}
			};
			self.moveUp=function()
			{
				console.log(self.selectedItem);
				if(self.selectedItem!=null)
				{
					console.log("qvalue:"+self.selectedItem.data("qvalue"));
					var v=self.selectedItem.remove("active").prev();
					if(v.length>0)
					{
						self.selectedItem=v.addClass("active");
					}else{
						self.selectedItem=null;
					}
				}else{
					var v=self.selectedItem=self.dropDownSelectEle.find(".qitem").last().addClass("active");
					if(v.length>0)
					{
						self.selectedItem=v;
					}else{
						self.selectedItem=null;
					}
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
