/*DT.js(dld tools)*/
~function(global,und){
	//拓展JS类
	global._Class = function(parent){
		var klass = function(){
			this.init.apply(this,arguments);
		}
		if(parent){
			var sub = function(){};
			sub.prototype = parent.prototype;
			klass.prototype = new sub();
			klass.prototype.constructor = klass;
			if(!klass['parent']){
				klass['parent'] = [];
			}
			if(parent['parent']){
				klass['parent'] = klass['parent'].concat(parent['parent'],parent); 
			}else{
				klass['parent'].push(parent);
			}
			if(parent.prototype && (parent.prototype.constructor === Object.prototype.constructor)) {
    			parent.prototype.constructor = parent;
  			}
		}
		klass.prototype.init = function(){
			//初始化
		}
		klass['fn'] = klass.prototype;
		klass['fn']['parent'] = klass;
		klass['proxy'] = function(fun,that){
			var me = that;
			return (function(){
				return fun.apply(me,arguments);
			})
		}
		klass['fn']['proxy'] = klass['proxy'];
		klass['extend'] = function(obj){
			var extended = obj['extended'];
			for(var i in obj){
				klass[i] = obj[i];
			}
			if(extended){
				extended(klass);
			}
		}
		klass['include'] = function(obj){
			var included = obj['included'];
			for(var i in obj){
				klass['fn'][i] = obj[i];
			}
			if(included){
				included(klass);
			}
		}
		return klass;
	}
	//拓展ECMA5方法
	global._Tool = {
			isString: function(v) {
				return Object.prototype.toString.call(v) === '[object String]';
			},
			isFunction: function(v) {
				return Object.prototype.toString.call(v) === '[object Function]';
			},
			isObject: function(v) {
				return v === Object(v);
			},
			ifArray:function(v){
				return Object.prototype.toString.apply(a) === '[object Array]';
			},
			forEach: Array.prototype.forEach ? function(arr, fn) {
				arr.forEach(fn);
			}: function(arr, fn) {
				for (var i = 0; i < arr.length; i++) fn(arr[i], i, arr);
			},
			filter: Array.prototype.filter ? function(arr, fn) {
				return arr.filter(fn);
			}: function(arr, fn) {
				var ret = [];
				_Tool.forEach(arr, function(item, i, arr) {
					if (fn(item, i, arr)) ret.push(item);
				});
				return ret;
			},
			map: Array.prototype.map ? function(arr, fn) {
				return arr.map(fn);
			}: function(arr, fn) {
				var ret = [];
				_Tool.forEach(arr, function(item, i, arr) {
					ret.push(fn(item, i, arr));
				});
				return ret;
			},
			keys: Object.keys ? Object.keys: function(o) {
				var ret = [];
				for (var p in o) {
					if (o.hasOwnProperty(p)) ret.push(p);
				}
				return ret;
			},
			indexOf: Array.prototype.indexOf ? function(arr, selector) {
				return arr.indexOf(selector);
			}: function(arr, selector) {
				for (var i = 0; i < arr.length; i++) {
					if (arr[i] === selector) return i;
				}
				return - 1;
			},
			unique: function(arr) {
				var o = {};
				_Tool.forEach(arr,function(item){
					o[item] = 1;
				});
				return _Tool.keys(o);
			},
			IEboswerCheck:function(){
                if(navigator.appName == "Microsoft Internet Explorer"){
                    if(navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0"){
                        return 6;
                    }else if(navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE7.0"){
                        return 7;
                    }else if(navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE8.0"){
                        return 8;
                    }else if(navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE9.0"){
                        return 9;
                    }else if(navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE10.0"){
                        return 10;
                    };
                }else{
                    return false;
                }
            } 
	}
	/*模块加载器*/
	var DT = function(doc){
		var noop = function(){

			},
			commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
			jsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
			STATUS ={
						none:0,//模块不存在
						create:1,//已经取得模块路径准备开始加载
						done:2,//模块已经成功加载到浏览器
						compile:3,//模块加载编译所有所需依赖中
						success:4//模块所有依赖也已成功加载，已可以使用
					},
			docHeand = doc.getElementsByTagName("head")[0];
			Moudle = _Class(),
			getURL = function(id){
				//根据MoudleID来获取Moudle真实的url路径
				return id+".js";
			}
			Loader = _Class();
		//模块对象
		Moudle.include({
			init:function(id){
				this.id = id;
				this.status = 0;
				this.depend = [];
				this.parent = [];
				this.factory = noop;
				this.exports = null;
				this.type = "js";
			},
			//模块编译子模块
			complie:function(){
				var tempDen = Moudle.getDepend((this.factory).toString()),
					me = this;
				if(!tempDen.length){
					this.status = STATUS['success'];
					return ;
				}
				this.status = STATUS['compile'];
				_Tool.forEach(tempDen,function(id){
					var tempObj = Loader.cache[id]||(Loader.cache[id] = new Moudle(id));
					(tempObj.parent).push(me.id);
					if(tempObj.status<STATUS['create']){
						Loader.load(tempObj,function(){
							this.complie();
						});
					}
					//依赖模块优先于编译而加载完成,模块相互依赖时发生
					if(tempObj.status > STATUS['compile']){
						tempObj.inform();
					}
				})
			},
			//子模块成功编译成功后通知父模块
			inform:function(){
				var tempObj =[];
				_Tool.forEach(this.parent,function(s){
					tempObj.push(Loader.cache[s]);
				});
				if(!tempObj.length){
					//所有依赖都编译完毕
					this.status = STATUS['success'];
					this.exports = (this.factory)();
					(this.callback).apply(null,[this.exports]);
					return ;
				}
				_Tool.forEach(tempObj,function(tempObjArray){
					var key = true;
					_Tool.forEach(tempObjArray.depend,function(id){
						if((Loader.cache[id]).status != STATUS['success']){
							key = false;
						}
					});
					if(key){
					tempObjArray.status = STATUS['success'];
					tempObjArray.exports = tempObjArray['factory']();
					tempObjArray.inform();
					}
				})
			}
		})
		Moudle.extend({
			//获取依赖
			getDepend:function(str){
				var tempStr = [] ;
				str.replace(commentRegExp, '').replace(jsRequireRegExp, function(match, dep) {
					tempStr.push(dep);
				});
				return _Tool.unique(tempStr); 
			}
		})
		//加载调度对象
		Loader.extend({
			//模块储藏室
			cache:{},
			//模块注册
			define:function(id,factory){
				if(!_Tool.isString(id) || !_Tool.isFunction(factory)){
					return ;
				}
				if(Loader.cache[id] && Loader.cache['status']<STATUS.create){
					return ;
				}
				var tempStr = Moudle.getDepend(factory.toString()),
					tempObj = Loader.cache[id]||(Loader.cache[id] = new Moudle(id)),
					me = Loader;
				tempObj['depend'] = tempStr;
				tempObj['status'] = STATUS['done'];
				tempObj['factory'] = factory;
				if(!tempStr.length){
					tempObj['status'] = STATUS['success'];
					tempObj['exports'] = factory();
					tempObj.inform();
				}
			},
			//获取完整模块接口
			require:function(id){
				if(!_Tool.isString(id)){
					return ;
				}
				if(Loader.cache[id]&&Loader.cache[id]['status']== STATUS['success']){
					return Loader.cache[id]['exports'];
				}
				throw "有问题!";
				
			},
			//load方法常规加载JS或者CSS文件到浏览器
			load:function(mod,callbacks){//(单独作为文件加载器时mod为模块id以及模块类型，默认为js)
				//模块状态得变更为create
				mod['status'] = STATUS['create'];
				if(!_Tool.isString(mod['id'])){
					return ;
				}
				if(!mod['type']){
					mod['type'] = 'js';
				}
				var docType = {
					css:function(){
						var tempStr = doc.createElement("link");
						tempStr.rel = "stylesheet";
						tempStr.type = "text/css";
						tempStr.charset = "utf-8";
						tempStr.href = getURL(mod['id']);
						return tempStr;
					},
					js:function(){
						var tempStr = doc.createElement("script");
						tempStr.type = "text/javascript";
						tempStr.charset = "utf-8";
						tempStr.src = getURL(mod['id']);
						return tempStr;
					}
				},
				//检测浏览器是否加载文件完毕 
				checkFileRead = function(file,callback){ 
					if(file['type'] == 'text/javascript'){
						if(!_Tool.IEboswerCheck()){
							//W2c
							file.onload = function(){
									if(callback){
										callback.apply(mod,arguments);
									}
								}
						}else{
							//IE
							file.onreadystatechange = function(){
								var IE6Key = 0;
								if(_Tool.IEboswerCheck() == 6){
									//IE 6
									if(this.readyState == "loading" || this.readyState == "loaded"){
										IE6Key++;
									}
									if(this.readyState == "complete"){
										IE6Key = 2;
									}
									if(IE6Key >= 2){
										this.onreadystatechange = null;
										if(callback){
											callback.apply(mod,arguments);
										}
									}
								}else{
									//IE 其他
									if(this.readyState == "complete" || this.readyState == "loaded"){
										this.onreadystatechange = null;
										if(callback){
											callback.apply(mod,arguments);
										}
									}
								}
							}
						}
					}else if(file['type'] == 'text/css'){
						var styleOnload = function(node, callback){
								//IE6-9 and Opera
								if(node.attachEvent){
									node.attachEvent('onload', callback);
								}else{
									//other boswer
									setTimeout(function(){
										poll(node, callback);	
									},0)
								}	
							},
							poll = function(node, callback){
								if(callback.isCalled){
									return ;
								}
								var isLoaded = false;
								if(/webkit/i.test(navigator.userAgent)){
									if(node['sheet']){
										isLoaded = true;
									}
								}else{
									if(node['sheet']){
										try{
											if(node['sheet'].cssRules){
												isLoaded = true;
											}
										}catch(ex){
											// NS_ERROR_DOM_SECURITY_ERR
											if(ex.code === 1000 || ex.code === 18){
												isLoaded = true;
											}
										}
									}
								}
								if(isLoaded){
									setTimeout(function(){
										callback.apply(mod,arguments);
									},1)
								}else{
									setTimeout(function(){
										poll(node,callback);
									},1)
								}
							};
							styleOnload(file,function(){
								callback();
							});
					}
				};
				var tempStr = docType[mod['type']]();
				docHeand.appendChild(tempStr);
				checkFileRead(tempStr,function(){
					//如果文件被浏览器成功加载。那模块状态应该变为done
					this['status'] = STATUS['done'];
					if(callbacks){
						callbacks.apply(this,arguments);
					}
				});
				return mod ;
			},
			//入口
			use:function(id,cb){
				if(!id){
					return ;
				}
				var tempObj = this.cache[id]|| (this.cache[id] = new Moudle(id));
				this.load(tempObj,function(){
					this.complie();
				});
				if(cb){
					tempObj.callback = cb;
				}
			}
		})
	return Loader;
	}(document);
	global.DT = DT;
	global.require = DT.require;
	global.define = DT.define;
}(window)