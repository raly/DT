DT (dld tools)
==

小型工具库，有待慢慢增强<br />
_Class() 拓展JS类支持<br />
_Tool 常用ECMA5工具方法<br />
DT 加载器，支持CMD写法<br />
//示例：：<br />
//引入文件，base 为全局优先主动依赖的模块（可选，寻址规则跟模块一样）<br />
//模块的寻址方法为 this.getURL(依赖baseUrl，默认寻址路径为baseUrl+moduleID),可按照自己项目需求重构<br />
//baseUrl(代码内)为全局的主域路径，也可根据项目需求重构重构<br />
\<script type="text/javascript" src="xxx/xx/DT.js" base="http://aa.com" \>\</script\><br />
//DT.use(页面入口)，moduleID 为模块 ID（唯一）<br />
DT.use('moduleID',function(){<br />
  var test = require('moduleID')<br />
})<br />
//模块定义,默认一个文件为一个模块，也可多模块合并<br />
//moduleID.js<br />
define('moduleID',function(global){<br />
  //global为全局window对象<br />
  //引入 a模块，此时模块的寻址路径为http://aa.com/a.js(baseUrl:http://aa.com+moduleID:a)<br />
  var a = require('a');<br />
  return a+1;<br />
})<br />
//a.js<br />
define('a',function(global){<br />
  var a = 1;<br />
  return a;<br />
})<br />


