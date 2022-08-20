(()=>{var e={10:(e,t,n)=>{var i,o;i=[n,t,n(697),n(695),n(882)],o=function(e,t,n,i,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.initAddNodeMenu=void 0,t.initAddNodeMenu=function(e){var t=document.getElementById("node-menu");t.addEventListener("mousedown",(function(e){0==e.button&&e.stopPropagation()}));var r=document.getElementById("node-tree-view"),s={},a=function(a){var u=i.nodeDefinitions[a];u.category in s||(s[u.category]=function(e,t){var n=document.createElement("li");n.classList.add("branch"),n.addEventListener("click",(function(){return n.classList.toggle("expanded")}));var i=document.createElement("div"),o=document.createElement("span");o.classList.add("material-symbols-rounded"),i.appendChild(o);var r=document.createElement("span");r.textContent=t,i.appendChild(r),n.appendChild(i);var s=document.createElement("ul");return n.appendChild(s),e.appendChild(n),s}(r,u.category)),function(e,t){var n=document.createElement("li");n.classList.add("branch");var i=document.createElement("div"),o=document.createElement("span");return o.textContent=t,i.appendChild(o),n.appendChild(i),e.appendChild(n),n}(s[u.category],u.name).addEventListener("click",(function(i){if(0==i.button){i.stopPropagation();var r=e.viewportToAreaPoint((0,o.getTopLeft)(t));e.nodes.push(new n.Node(e,a,r)),t.classList.remove("visible")}}))};for(var u in i.nodeDefinitions)a(u)}}.apply(t,i),void 0===o||(e.exports=o)},712:(e,t,n)=>{var i;i=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LiteEvent=void 0;var n=function(){function e(){this.handlers=[]}return e.prototype.addListener=function(e){this.handlers.push(e)},e.prototype.removeListener=function(e){this.handlers=this.handlers.filter((function(t){return t!==e}))},e.prototype.dispatch=function(e){this.handlers.slice(0).forEach((function(t){return t(e)}))},e.prototype.expose=function(){return this},e}();t.LiteEvent=n}.apply(t,[n,t]),void 0===i||(e.exports=i)},717:(e,t,n)=>{var i,o;i=[n,t,n(307),n(173),n(882)],o=function(e,t,n,i,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Graph=void 0;var r=function(){function e(){var e=this;this.nodes=[],this._panning=!1,this._dragging=!1,this._dragNode=null,this._linking=!1,this._linkPin=null,this.viewport=document.getElementById("graph-viewport"),this.graphArea=document.getElementById("graph-area"),this._drawingLink=new i.Link,this._drawingLink.reset(),this.viewport.addEventListener("mousedown",(function(t){return e.onMouseDown(t)})),this.viewport.addEventListener("mousemove",(function(t){return e.onMouseMove(t)})),this.viewport.addEventListener("mouseup",(function(t){return e.onMouseUp(t)})),this.viewport.addEventListener("contextmenu",(function(t){return e.onContextMenu(t)}))}return e.prototype.beginDrag=function(e,t){this._panning||this._linking||(this._dragNode=e,this._dragNode.element.style.cursor="grabbing",this._dragCursorBegin=t,this._dragTargetBegin=this._dragNode.position,this._dragging=!0)},e.prototype.beginLink=function(e){if(!this._panning&&!this._dragging){this._linkPin=e,this._linkPin.linking=!0,this._linking=!0;var t=this._linkPin.position;this._drawingLink.setPoints(t,t),this._drawingLink.valueType=e.valueType}},e.prototype.endLink=function(e){if(this._linkPin!=e&&this._linkPin.type!=e.type&&this._linkPin.node!=e.node&&this._linkPin.valueType==e.valueType){var t=void 0;switch(this._linkPin.type){case n.PinType.Output:t=new i.Link(this._linkPin,e);break;case n.PinType.Input:t=new i.Link(e,this._linkPin)}t.valueType=e.valueType,this._linkPin.addLink(t),e.addLink(t)}this.endLinking()},e.prototype.viewportToAreaPoint=function(e){var t=(0,o.getTranslation)(this.graphArea);return e.subtract(t.x,t.y)},e.prototype.onMouseDown=function(e){0==e.button&&document.getElementById("node-menu").classList.remove("visible"),1!=e.button||this._dragging||this._linking||(this._dragTargetBegin=(0,o.getTranslation)(this.graphArea),this._dragCursorBegin=new o.Point(e.clientX,e.clientY),this._panning=!0)},e.prototype.onMouseMove=function(e){if(this._panning){var t=new o.Point(this._dragTargetBegin.x+e.clientX-this._dragCursorBegin.x,this._dragTargetBegin.y+e.clientY-this._dragCursorBegin.y);(0,o.setTranslation)(this.graphArea,t)}if(this._dragging&&(t=new o.Point(this._dragTargetBegin.x+e.clientX-this._dragCursorBegin.x,this._dragTargetBegin.y+e.clientY-this._dragCursorBegin.y),this._dragNode.position=t),this._linking){var i=this.graphArea.getBoundingClientRect();switch(t=new o.Point(e.clientX-i.left,e.clientY-i.top),this._linkPin.type){case n.PinType.Output:this._drawingLink.endPoint=t;break;case n.PinType.Input:this._drawingLink.startPoint=t}}},e.prototype.onMouseUp=function(e){this._panning&&(this._panning=!1),this._dragging&&(this._dragNode.element.style.cursor=null,this._dragNode=null,this._dragging=!1),this._linking&&this.endLinking()},e.prototype.onContextMenu=function(e){e.preventDefault();var t=document.getElementById("node-menu"),n=t.getBoundingClientRect(),i=window.innerWidth-n.width;t.style.left="".concat(Math.min(e.x,i),"px"),t.style.top="".concat(e.y,"px"),t.classList.add("visible");var o=document.getElementById("node-search-bar");o.value="",o.focus()},e.prototype.endLinking=function(){this._drawingLink.reset(),this._linking=!1,this._linkPin.linking=!1},e}();t.Graph=r}.apply(t,i),void 0===o||(e.exports=o)},607:(e,t,n)=>{var i,o;i=[n,t,n(717),n(697),n(882),n(10),n(738)],void 0===(o=function(e,t,n,i,o,r,s){"use strict";var a=new n.Graph;(0,r.initAddNodeMenu)(a);var u=new i.Node(a,"start",new o.Point(32,32));a.nodes.push(u),document.getElementById("run-button").addEventListener("click",(function(){(0,s.interpret)(u)}))}.apply(t,i))||(e.exports=o)},738:(e,t,n)=>{var i,o;i=[n,t,n(697)],o=function(e,t,n){"use strict";function i(e){if(null===e)return null;switch(e.type){case"start":return i(e.getOutput(0)),null;case"if":var t=e.getInput(1);return t instanceof n.Node&&(t=i(t)),"boolean"==typeof t?i(e.getOutput(t?0:1)):console.error("Expected inputs [boolean] interpreting node 'if'"),null;case"while":for(;;){if((l=e.getInput(1))instanceof n.Node&&(l=i(l)),"boolean"!=typeof l)return console.error("Expected inputs [boolean] interpreting node 'while"),null;if(!l)break;i(e.getOutput(1))}return i(e.getOutput(0)),null;case"for":var o=e.getInput(1),r=e.getInput(2),s=e.getInput(3);if(o instanceof n.Node&&(o=i(o)),r instanceof n.Node&&(r=i(r)),s instanceof n.Node&&(s=i(s)),"number"!=typeof o||"number"!=typeof r||"number"!=typeof s)return console.error("Expected inputs [number, number, number] interpreting node 'for"),null;for(var a=o;a<r;)i(e.getOutput(1)),a+=s;return i(e.getOutput(0)),null;case"add":var u=e.getInput(0),p=e.getInput(1);return u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u+p:(console.error("Expected inputs [number, number] interpreting node 'add'"),0);case"subtract":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u-p:(console.error("Expected inputs [number, number] interpreting node 'subtract'"),0);case"multiply":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u*p:(console.error("Expected inputs [number, number] interpreting node 'multiply'"),0);case"divide":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?0==p?(console.error("Cannot divide by zero interpreting node 'divide"),0):u/p:(console.error("Expected inputs [number, number] interpreting node 'add'"),0);case"and":case"or":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"boolean"==typeof u&&"boolean"==typeof p?u&&p:(console.error("Expected inputs [boolean, boolean] interpreting node 'and'"),!1);case"not":return(u=e.getInput(0))instanceof n.Node&&(u=i(u)),"boolean"==typeof u?!u:(console.error("Expected inputs [boolean] interpreting node 'not'"),!1);case"equal":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u==p:(console.error("Expected inputs [number, number] interpreting node 'equal'"),!1);case"notEqual":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u!=p:(console.error("Expected inputs [number, number] interpreting node 'notEqual'"),!1);case"less":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u<p:(console.error("Expected inputs [number, number] interpreting node 'less'"),!1);case"lessOrEqual":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u<=p:(console.error("Expected inputs [number, number] interpreting node 'lessOrEqual'"),!1);case"greater":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u>p:(console.error("Expected inputs [number, number] interpreting node 'greater'"),!1);case"greaterOrEqual":return u=e.getInput(0),p=e.getInput(1),u instanceof n.Node&&(u=i(u)),p instanceof n.Node&&(p=i(p)),"number"==typeof u&&"number"==typeof p?u>=p:(console.error("Expected inputs [number, number] interpreting node 'greaterOrEqual'"),!1);case"printInt":var l;return(l=e.getInput(1))instanceof n.Node&&(l=i(l)),"number"==typeof l?(console.log(l),i(e.getOutput(0))):console.error("Expected inputs [number] interpreting node 'printInt'"),!1}}Object.defineProperty(t,"__esModule",{value:!0}),t.interpret=void 0,t.interpret=function(e){"start"==e.type&&i(e)}}.apply(t,i),void 0===o||(e.exports=o)},173:(e,t,n)=>{var i,o;i=[n,t,n(307),n(882)],o=function(e,t,n,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Link=void 0;var o=function(){function e(e,t){null!=e&&null!=e?(this._startPin=e,this._startPoint=e.position):(this._startPin=null,this._startPoint=new i.Point),null!=t&&null!=t?(this._endPin=t,this._endPoint=t.position):(this._endPin=null,this._endPoint=new i.Point),this._element=document.createElementNS("http://www.w3.org/2000/svg","svg"),this._element.classList.add("graph-link"),this._path=document.createElementNS("http://www.w3.org/2000/svg","path"),this._element.appendChild(this._path),document.getElementById("graph-links").appendChild(this._element),this.updatePath()}return Object.defineProperty(e.prototype,"startPin",{get:function(){return this._startPin},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"endPin",{get:function(){return this._endPin},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"startPoint",{set:function(e){this._startPoint=e,this.updatePath()},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"endPoint",{set:function(e){this._endPoint=e,this.updatePath()},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"valueType",{set:function(e){switch(this._element.classList.value="graph-link",e){case n.ValueType.Flow:this._element.classList.add("link-type-flow");break;case n.ValueType.Int:this._element.classList.add("link-type-int");break;case n.ValueType.Float:this._element.classList.add("link-type-float");break;case n.ValueType.String:this._element.classList.add("link-type-string");break;case n.ValueType.Boolean:this._element.classList.add("link-type-boolean")}},enumerable:!1,configurable:!0}),e.prototype.setPoints=function(e,t){this._startPoint=e,this._endPoint=t,this.updatePath()},e.prototype.reset=function(){this._startPoint=new i.Point(0,0),this._endPoint=new i.Point(0,0),this._path.setAttribute("d","")},e.prototype.destroy=function(){this._path.parentElement.removeChild(this._path),this._startPin.breakLink(this),this._endPin.breakLink(this)},e.prototype.updatePath=function(){var t=this._startPoint.x+e.curve,n=this._endPoint.x-e.curve,o=new i.Rect,r=new i.Point,s=new i.Point;this._startPoint.x<=n?(o.x=this._startPoint.x,o.width=this._endPoint.x-this._startPoint.x,s.x=o.width):(o.x=n,o.width=t-n,r.x=this._startPoint.x-n,s.x=e.curve),this._startPoint.y<=this._endPoint.y?(o.y=this._startPoint.y-2,o.height=this._endPoint.y-this._startPoint.y+4,r.y=2,s.y=o.height-2):(o.y=this._endPoint.y-2,o.height=this._startPoint.y-this._endPoint.y+4,r.y=o.height-2,s.y=2),(0,i.setTranslation)(this._element,new i.Point(o.x,o.y)),this._element.setAttribute("width","".concat(o.width)),this._element.setAttribute("height","".concat(o.height)),this._path.setAttribute("d","M ".concat(r.x," ").concat(r.y," C ").concat(r.x+e.curve," ").concat(r.y,", ").concat(s.x-e.curve," ").concat(s.y,", ").concat(s.x," ").concat(s.y))},e.curve=32,e}();t.Link=o}.apply(t,i),void 0===o||(e.exports=o)},695:(e,t,n)=>{var i;i=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.nodeDefinitions=void 0,t.nodeDefinitions={start:{name:"Start",category:"Flow",inputs:[],outputs:[{name:"",type:"Flow"}]},if:{name:"If",category:"Flow",inputs:[{name:"",type:"Flow"},{name:"Condition",type:"Bool"}],outputs:[{name:"True",type:"Flow"},{name:"False",type:"Flow"}]},while:{name:"While",category:"Flow",inputs:[{name:"",type:"Flow"},{name:"Condition",type:"Bool"}],outputs:[{name:"Exit",type:"Flow"},{name:"Body",type:"Flow"}]},for:{name:"For",category:"Flow",inputs:[{name:"",type:"Flow"},{name:"First",type:"Int"},{name:"Last",type:"Int"},{name:"Step",type:"Int"}],outputs:[{name:"Exit",type:"Flow"},{name:"Body",type:"Flow"}]},add:{name:"Add",category:"Math",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Int"}]},subtract:{name:"Subtract",category:"Math",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Int"}]},multipy:{name:"Multiply",category:"Math",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Int"}]},divide:{name:"Divide",category:"Math",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Int"}]},and:{name:"And",category:"Logic",inputs:[{name:"A",type:"Bool"},{name:"B",type:"Bool"}],outputs:[{name:"",type:"Bool"}]},or:{name:"Or",category:"Logic",inputs:[{name:"A",type:"Bool"},{name:"B",type:"Bool"}],outputs:[{name:"",type:"Bool"}]},not:{name:"Not",category:"Logic",inputs:[{name:"",type:"Bool"}],outputs:[{name:"",type:"Bool"}]},equal:{name:"Equal",category:"Logic",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Bool"}]},notEqual:{name:"Not Equal",category:"Logic",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Bool"}]},less:{name:"Less",category:"Logic",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Bool"}]},lessOrEqual:{name:"Less Or Equal",category:"Logic",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Bool"}]},greater:{name:"Greater",category:"Logic",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Bool"}]},greaterOrEqual:{name:"Greater Or Equal",category:"Logic",inputs:[{name:"A",type:"Int"},{name:"B",type:"Int"}],outputs:[{name:"",type:"Bool"}]},printInt:{name:"Print Int",category:"IO",inputs:[{name:"",type:"Flow"},{name:"",type:"Int"}],outputs:[{name:"",type:"Flow"}]}}}.apply(t,[n,t]),void 0===i||(e.exports=i)},697:(e,t,n)=>{var i,o;i=[n,t,n(307),n(695),n(882)],o=function(e,t,n,i,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Node=void 0;var r=function(){function e(e,t,o){var r=this;if(this._inputs=[],this._outputs=[],this._graph=e,this._type=t,t in i.nodeDefinitions){var l=i.nodeDefinitions[t];this.element=document.createElement("div"),this.element.addEventListener("mousedown",(function(e){return r.onMouseDown(e)})),this.element.classList.add("graph-node");var d=document.createElement("div");d.classList.add("head");var c=document.createElement("span");c.textContent=l.name,d.appendChild(c),this.element.appendChild(d);var h=document.createElement("div");h.classList.add("body"),this.element.appendChild(h);for(var g=Math.max(l.inputs.length,l.outputs.length),y=function(e){var t=e+1;if(e<l.inputs.length){var i=l.inputs[e],o=p(i.type),r=new n.Pin(m._graph,m,o,n.PinType.Input);r.element.style.gridColumn="1",r.element.style.gridRow=t.toString(),h.appendChild(r.element);var d=document.createElement("span");d.textContent=i.name,d.style.gridColumn="2",d.style.gridRow=t.toString(),h.appendChild(d);var c=null;o!=n.ValueType.Flow&&(o&(n.ValueType.Int|n.ValueType.Float)?c=new u:o==n.ValueType.String?c=new a:o==n.ValueType.Boolean&&(c=new s),c.element.style.gridColumn="3",c.element.style.gridRow=t.toString(),h.appendChild(c.element),r.onLinksChanged.addListener((function(e){c.element.style.visibility=e>0?"hidden":"visible"}))),m._inputs.push({pin:r,valueField:c})}if(e<l.outputs.length){var g=l.outputs[e],y=(o=p(g.type),document.createElement("span"));y.classList.add("text-right"),y.textContent=g.name,y.style.gridColumn="5",y.style.gridRow=t.toString(),h.appendChild(y);var f=new n.Pin(m._graph,m,o);f.element.style.gridColumn="6",f.element.style.gridRow=t.toString(),m._outputs.push(f),h.appendChild(f.element)}},m=this,f=0;f<g;f++)y(f);document.getElementById("graph-nodes").appendChild(this.element),this.position=o}else console.error("Invalid node types")}return Object.defineProperty(e.prototype,"position",{get:function(){return(0,o.getTranslation)(this.element)},set:function(e){(0,o.setTranslation)(this.element,e),this._inputs.forEach((function(e){return e.pin.updateLinkPositions()})),this._outputs.forEach((function(e){return e.updateLinkPositions()}))},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"type",{get:function(){return this._type},enumerable:!1,configurable:!0}),e.prototype.getInput=function(e){var t=this._inputs[e];return t.pin.links.length>0?t.pin.links[0].startPin.node:t.valueField.value},e.prototype.getOutput=function(e){var t=this._outputs[e];return t.links.length>0?t.links[0].endPin.node:null},e.prototype.onMouseDown=function(e){if(e.target.classList.contains("graph-node")&&0==e.button){e.preventDefault();var t=new o.Point(e.clientX,e.clientY);this._graph.beginDrag(this,t)}},e}();t.Node=r;var s=function(){function e(){var e=this;this._element=document.createElement("div"),this._element.classList.add("checkbox");var t=document.createElement("span");t.classList.add("material-symbols-rounded"),t.textContent="check",this._element.appendChild(t),this._element.addEventListener("click",(function(){e.checked=!e._checked}))}return Object.defineProperty(e.prototype,"checked",{set:function(e){this._checked=e,this._element.setAttribute("checked","".concat(this._checked))},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"element",{get:function(){return this._element},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"value",{get:function(){return this._checked},enumerable:!1,configurable:!0}),e}(),a=function(){function e(){this._element=document.createElement("span"),this._element.classList.add("input"),this._element.setAttribute("role","textbox"),this._element.setAttribute("contenteditable","true")}return Object.defineProperty(e.prototype,"element",{get:function(){return this._element},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"value",{get:function(){return this._element.textContent},enumerable:!1,configurable:!0}),e}(),u=function(){function e(){this._element=document.createElement("span"),this._element.classList.add("input"),this._element.setAttribute("role","textbox"),this._element.setAttribute("contenteditable","true")}return Object.defineProperty(e.prototype,"element",{get:function(){return this._element},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"value",{get:function(){return parseInt(this._element.textContent)},enumerable:!1,configurable:!0}),e}();function p(e){switch(e){case"Flow":default:return n.ValueType.Flow;case"Int":return n.ValueType.Int;case"Float":return n.ValueType.Float;case"String":return n.ValueType.String;case"Bool":return n.ValueType.Boolean}}}.apply(t,i),void 0===o||(e.exports=o)},307:(e,t,n)=>{var i,o;i=[n,t,n(712),n(882)],o=function(e,t,n,i){"use strict";var o,r;Object.defineProperty(t,"__esModule",{value:!0}),t.Pin=t.ValueType=t.PinType=void 0,function(e){e[e.Output=0]="Output",e[e.Input=1]="Input"}(o=t.PinType||(t.PinType={})),function(e){e[e.Flow=1]="Flow",e[e.Int=2]="Int",e[e.Float=4]="Float",e[e.String=8]="String",e[e.Boolean=16]="Boolean"}(r=t.ValueType||(t.ValueType={}));var s=function(){function e(e,t,i,s){void 0===s&&(s=o.Output);var a=this;switch(this._type=o.Output,this.links=[],this.linksChangedEvent=new n.LiteEvent,this._graph=e,this._node=t,this._type=s,this._valueType=i,this.element=document.createElement("div"),this.element.classList.add("pin"),this._type==o.Output&&this.element.classList.add("right"),this.element.addEventListener("mousedown",(function(e){return a.onMouseDown(e)})),this.element.addEventListener("mouseup",(function(e){return a.onMouseUp(e)})),this.element.addEventListener("mouseenter",(function(e){return a.onMouseEnter(e)})),this.element.addEventListener("mouseleave",(function(e){return a.onMouseExit(e)})),this.element.addEventListener("contextmenu",(function(e){return e.preventDefault()})),this.graphic=document.createElement("div"),this.graphic.classList.add("pin-graphic"),this._valueType){case r.Flow:this.graphic.classList.add("type-flow");break;case r.Int:this.graphic.classList.add("type-int");break;case r.Float:this.graphic.classList.add("type-float");break;case r.String:this.graphic.classList.add("type-string");break;case r.Boolean:this.graphic.classList.add("type-boolean")}this.element.appendChild(this.graphic)}return Object.defineProperty(e.prototype,"type",{get:function(){return this._type},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"valueType",{get:function(){return this._valueType},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"node",{get:function(){return this._node},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"onLinksChanged",{get:function(){return this.linksChangedEvent.expose()},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"position",{get:function(){var e=this._graph.graphArea.getBoundingClientRect(),t=this.element.getBoundingClientRect();return new i.Point(t.left+t.width/2-e.left,t.top+t.height/2-e.top)},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"linking",{set:function(e){this._linking=e,this.updateFill()},enumerable:!1,configurable:!0}),e.prototype.addLink=function(e){this.links.push(e),this.updateFill(),this.linksChangedEvent.dispatch(this.links.length)},e.prototype.breakLink=function(e){var t=this.links.indexOf(e);t>-1&&this.links.splice(t,1),this.updateFill(),this.linksChangedEvent.dispatch(this.links.length)},e.prototype.updateLinkPositions=function(){var e=this;switch(this._type){case o.Output:this.links.forEach((function(t){t.startPoint=e.position}));break;case o.Input:this.links.forEach((function(t){t.endPoint=e.position}))}},e.prototype.updateFill=function(){this.setGraphicSolid(this.links.length>0||this._linking)},e.prototype.setGraphicSolid=function(e){e?this.element.classList.add("solid"):this.element.classList.remove("solid")},e.prototype.onMouseDown=function(e){if(e.target.classList.contains("pin"))if(0==e.button)e.preventDefault(),e.stopPropagation(),this._graph.beginLink(this);else if(2==e.button){e.preventDefault(),e.stopPropagation();for(var t=this.links.length,n=0;n<t;n++)this.links[0].destroy()}},e.prototype.onMouseUp=function(e){e.target.classList.contains("pin")&&0==e.button&&this._graph.endLink(this)},e.prototype.onMouseEnter=function(e){this.setGraphicSolid(!0)},e.prototype.onMouseExit=function(e){this.updateFill()},e}();t.Pin=s}.apply(t,i),void 0===o||(e.exports=o)},882:(e,t,n)=>{var i;i=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.setTranslation=t.getTopLeft=t.getTranslation=t.Rect=t.Point=void 0;var n=function(){function e(e,t){this.x=null!=e?e:0,this.y=null!=t?t:0}return e.prototype.add=function(e,t){return this.x+=e,this.y+=t,this},e.prototype.subtract=function(e,t){return this.x-=e,this.y-=t,this},e}();t.Point=n;t.Rect=function(e,t,n,i){this.x=null!=e?e:0,this.y=null!=t?t:0,this.width=null!=n?n:0,this.height=null!=i?i:0},t.getTranslation=function(e){var t=window.getComputedStyle(e),i=new DOMMatrixReadOnly(t.transform);return new n(i.m41,i.m42)},t.getTopLeft=function(e){return new n(e.offsetLeft,e.offsetTop)},t.setTranslation=function(e,t){e.style.transform="translate(".concat(t.x,"px, ").concat(t.y,"px)")}}.apply(t,[n,t]),void 0===i||(e.exports=i)}},t={};!function n(i){var o=t[i];if(void 0!==o)return o.exports;var r=t[i]={exports:{}};return e[i](r,r.exports,n),r.exports}(607)})();
//# sourceMappingURL=script.js.map