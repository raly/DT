DT (dld tools)
==

小型工具库，有待慢慢增强<br />
_Class() 拓展JS类支持<br />
_Tool 常用ECMA5工具方法<br />
DT 加载器，支持CMD写法<br />
类似：<br />
//引入文件，base 为全局优先主动依赖的模块（可选，寻址规则跟模块一样）<br />
//模块的寻址方法为 this.getURL,可按照自己项目需求重构
//baseUrl为全局的主域路径，也可根据项目需求重构重构
\<script type="text/javascript" src="xxx/xx/DT.js" base="xxx/xx" \>\</script\>
//页面入口，moduleID 为模块 ID（唯一），
DT.use('moduleID',function(){<br />
  var test = require('moduleID')<br />
})<br />
//模块定义,global 为全局 window<br />
define('moduleID',function(global){<br />
  //引入 a模块
  var a = require('a');<br />
  return xxx;<br />
})<br />


