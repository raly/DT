DT (dld tools)
==

小型工具库，有待慢慢增强<br />
_Class() 拓展JS类支持<br />
_Tool 常用ECMA5工具方法<br />
DT 加载器，支持CMD写法<br />
类似：<br />
//引入文件，base 为全局优先主动依赖的模块（可选，寻址规则跟模块一样）<br />
\<script type="text/javascript" src="xxx/xx/DT.js" base="xxx/xx" \>\</script\>
//页面入口，moduleID 为模块 ID（唯一），
DT.use('moduleID',function(){<br />
  var test = require('moduleID')<br />
})<br />
//模块定义,global 为全局 window<br />
define('moduleID',function(global){<br />
  return xxx;<br />
})<br />

