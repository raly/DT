DT (dld tools)
==

小型工具库，有待慢慢增强<br />
_Class() 拓展JS类支持<br />
_Tool 常用ECMA5工具方法<br />
DT 加载器，支持CMD写法<br />
类似：<br />
//引入文件，base 为全局优先主动依赖的模块（自选）
<script type="text/javascript" src="xxx/xx/DT.js" base="xxx/xx"></script>
DT.use('moduleID',function(){
  var test = require('moduleID')
})

