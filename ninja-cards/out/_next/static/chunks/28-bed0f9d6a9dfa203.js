(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[28],{9837:function(){},1810:function(e,t,r){"use strict";r.d(t,{w_:function(){return d}});var i=r(2265),n={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},o=i.createContext&&i.createContext(n),a=["attr","size","title"];function h(){return(h=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e}).apply(this,arguments)}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,i)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach(function(t){var i,n;i=t,n=r[t],(i=function(e){var t=function(e,t){if("object"!=typeof e||!e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var i=r.call(e,t||"default");if("object"!=typeof i)return i;throw TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}(e,"string");return"symbol"==typeof t?t:t+""}(i))in e?Object.defineProperty(e,i,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[i]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function d(e){return t=>i.createElement(c,h({attr:l({},e.attr)},t),function e(t){return t&&t.map((t,r)=>i.createElement(t.tag,l({key:r},t.attr),e(t.child)))}(e.child))}function c(e){var t=t=>{var r,{attr:n,size:o,title:s}=e,d=function(e,t){if(null==e)return{};var r,i,n=function(e,t){if(null==e)return{};var r={};for(var i in e)if(Object.prototype.hasOwnProperty.call(e,i)){if(t.indexOf(i)>=0)continue;r[i]=e[i]}return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)r=o[i],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}(e,a),c=o||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),i.createElement("svg",h({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,n,d,{className:r,style:l(l({color:e.color||t.color},t.style),e.style),height:c,width:c,xmlns:"http://www.w3.org/2000/svg"}),s&&i.createElement("title",null,s),e.children)};return void 0!==o?i.createElement(o.Consumer,null,e=>t(e)):t(n)}},6505:function(e,t,r){"use strict";r.d(t,{ZP:function(){return g}});var i=r(2265);let n={x:0,y:0,width:0,height:0,unit:"px"},o=(e,t,r)=>Math.min(Math.max(e,t),r),a=(...e)=>e.filter(e=>e&&"string"==typeof e).join(" "),h=(e,t)=>e===t||e.width===t.width&&e.height===t.height&&e.x===t.x&&e.y===t.y&&e.unit===t.unit;function s(e,t,r){return"%"===e.unit?{...n,...e,unit:"%"}:{unit:"%",x:e.x?e.x/t*100:0,y:e.y?e.y/r*100:0,width:e.width?e.width/t*100:0,height:e.height?e.height/r*100:0}}function l(e,t,r){return e.unit?"px"===e.unit?{...n,...e,unit:"px"}:{unit:"px",x:e.x?e.x*t/100:0,y:e.y?e.y*r/100:0,width:e.width?e.width*t/100:0,height:e.height?e.height*r/100:0}:{...n,...e,unit:"px"}}function d(e,t,r,i,n,o=0,a=0,h=i,s=n){let l={...e},d=Math.min(o,i),c=Math.min(a,n),p=Math.min(h,i),w=Math.min(s,n);t&&(t>1?(c=(d=a?a*t:d)/t,p=h*t):(d=(c=o?o/t:c)*t,w=s/t)),l.y<0&&(l.height=Math.max(l.height+l.y,c),l.y=0),l.x<0&&(l.width=Math.max(l.width+l.x,d),l.x=0);let g=i-(l.x+l.width);g<0&&(l.x=Math.min(l.x,i-d),l.width+=g);let u=n-(l.y+l.height);if(u<0&&(l.y=Math.min(l.y,n-c),l.height+=u),l.width<d&&(("sw"===r||"nw"==r)&&(l.x-=d-l.width),l.width=d),l.height<c&&(("nw"===r||"ne"==r)&&(l.y-=c-l.height),l.height=c),l.width>p&&(("sw"===r||"nw"==r)&&(l.x-=p-l.width),l.width=p),l.height>w&&(("nw"===r||"ne"==r)&&(l.y-=w-l.height),l.height=w),t){let e=l.width/l.height;if(e<t){let e=Math.max(l.width/t,c);("nw"===r||"ne"==r)&&(l.y-=e-l.height),l.height=e}else if(e>t){let e=Math.max(l.height*t,d);("sw"===r||"nw"==r)&&(l.x-=e-l.width),l.width=e}}return l}let c={capture:!0,passive:!1},p=0,w=class e extends i.PureComponent{constructor(){super(...arguments),this.docMoveBound=!1,this.mouseDownOnCrop=!1,this.dragStarted=!1,this.evData={startClientX:0,startClientY:0,startCropX:0,startCropY:0,clientX:0,clientY:0,isResize:!0},this.componentRef=(0,i.createRef)(),this.mediaRef=(0,i.createRef)(),this.initChangeCalled=!1,this.instanceId=`rc-${p++}`,this.state={cropIsActive:!1,newCropIsBeingDrawn:!1},this.onCropPointerDown=e=>{let{crop:t,disabled:r}=this.props,i=this.getBox();if(!t)return;let n=l(t,i.width,i.height);if(r)return;e.cancelable&&e.preventDefault(),this.bindDocMove(),this.componentRef.current.focus({preventScroll:!0});let o=e.target.dataset.ord,a=e.clientX,h=e.clientY,s=n.x,d=n.y;if(o){let t=e.clientX-i.x,r=e.clientY-i.y,l=0,c=0;"ne"===o||"e"==o?(l=t-(n.x+n.width),c=r-n.y,s=n.x,d=n.y+n.height):"se"===o||"s"===o?(l=t-(n.x+n.width),c=r-(n.y+n.height),s=n.x,d=n.y):"sw"===o||"w"==o?(l=t-n.x,c=r-(n.y+n.height),s=n.x+n.width,d=n.y):("nw"===o||"n"==o)&&(l=t-n.x,c=r-n.y,s=n.x+n.width,d=n.y+n.height),a=s+i.x+l,h=d+i.y+c}this.evData={startClientX:a,startClientY:h,startCropX:s,startCropY:d,clientX:e.clientX,clientY:e.clientY,isResize:!!o,ord:o},this.mouseDownOnCrop=!0,this.setState({cropIsActive:!0})},this.onComponentPointerDown=e=>{let{crop:t,disabled:r,locked:i,keepSelection:n,onChange:o}=this.props,a=this.getBox();if(r||i||n&&t)return;e.cancelable&&e.preventDefault(),this.bindDocMove(),this.componentRef.current.focus({preventScroll:!0});let h=e.clientX-a.x,d=e.clientY-a.y,c={unit:"px",x:h,y:d,width:0,height:0};this.evData={startClientX:e.clientX,startClientY:e.clientY,startCropX:h,startCropY:d,clientX:e.clientX,clientY:e.clientY,isResize:!0},this.mouseDownOnCrop=!0,o(l(c,a.width,a.height),s(c,a.width,a.height)),this.setState({cropIsActive:!0,newCropIsBeingDrawn:!0})},this.onDocPointerMove=e=>{let t;let{crop:r,disabled:i,onChange:n,onDragStart:o}=this.props,a=this.getBox();if(i||!r||!this.mouseDownOnCrop)return;e.cancelable&&e.preventDefault(),this.dragStarted||(this.dragStarted=!0,o&&o(e));let{evData:d}=this;d.clientX=e.clientX,d.clientY=e.clientY,h(r,t=d.isResize?this.resizeCrop():this.dragCrop())||n(l(t,a.width,a.height),s(t,a.width,a.height))},this.onComponentKeyDown=t=>{let{crop:r,disabled:i,onChange:n,onComplete:a}=this.props;if(i)return;let h=t.key,d=!1;if(!r)return;let c=this.getBox(),p=this.makePixelCrop(c),w=(navigator.platform.match("Mac")?t.metaKey:t.ctrlKey)?e.nudgeStepLarge:t.shiftKey?e.nudgeStepMedium:e.nudgeStep;if("ArrowLeft"===h?(p.x-=w,d=!0):"ArrowRight"===h?(p.x+=w,d=!0):"ArrowUp"===h?(p.y-=w,d=!0):"ArrowDown"===h&&(p.y+=w,d=!0),d){t.cancelable&&t.preventDefault(),p.x=o(p.x,0,c.width-p.width),p.y=o(p.y,0,c.height-p.height);let e=l(p,c.width,c.height),r=s(p,c.width,c.height);n(e,r),a&&a(e,r)}},this.onHandlerKeyDown=(t,r)=>{let{aspect:i=0,crop:n,disabled:o,minWidth:a=0,minHeight:c=0,maxWidth:p,maxHeight:w,onChange:g,onComplete:u}=this.props,m=this.getBox();if(o||!n||"ArrowUp"!==t.key&&"ArrowDown"!==t.key&&"ArrowLeft"!==t.key&&"ArrowRight"!==t.key)return;t.stopPropagation(),t.preventDefault();let y=(navigator.platform.match("Mac")?t.metaKey:t.ctrlKey)?e.nudgeStepLarge:t.shiftKey?e.nudgeStepMedium:e.nudgeStep,v=d(function(e,t,r,i){let n={...e};return"ArrowLeft"===t?"nw"===i?(n.x-=r,n.y-=r,n.width+=r,n.height+=r):"w"===i?(n.x-=r,n.width+=r):"sw"===i?(n.x-=r,n.width+=r,n.height+=r):"ne"===i?(n.y+=r,n.width-=r,n.height-=r):"e"===i?n.width-=r:"se"===i&&(n.width-=r,n.height-=r):"ArrowRight"===t&&("nw"===i?(n.x+=r,n.y+=r,n.width-=r,n.height-=r):"w"===i?(n.x+=r,n.width-=r):"sw"===i?(n.x+=r,n.width-=r,n.height-=r):"ne"===i?(n.y-=r,n.width+=r,n.height+=r):"e"===i?n.width+=r:"se"===i&&(n.width+=r,n.height+=r)),"ArrowUp"===t?"nw"===i?(n.x-=r,n.y-=r,n.width+=r,n.height+=r):"n"===i?(n.y-=r,n.height+=r):"ne"===i?(n.y-=r,n.width+=r,n.height+=r):"sw"===i?(n.x+=r,n.width-=r,n.height-=r):"s"===i?n.height-=r:"se"===i&&(n.width-=r,n.height-=r):"ArrowDown"===t&&("nw"===i?(n.x+=r,n.y+=r,n.width-=r,n.height-=r):"n"===i?(n.y+=r,n.height-=r):"ne"===i?(n.y+=r,n.width-=r,n.height-=r):"sw"===i?(n.x-=r,n.width+=r,n.height+=r):"s"===i?n.height+=r:"se"===i&&(n.width+=r,n.height+=r)),n}(l(n,m.width,m.height),t.key,y,r),i,r,m.width,m.height,a,c,p,w);if(!h(n,v)){let e=s(v,m.width,m.height);g(v,e),u&&u(v,e)}},this.onDocPointerDone=e=>{let{crop:t,disabled:r,onComplete:i,onDragEnd:n}=this.props,o=this.getBox();this.unbindDocMove(),!(r||!t)&&this.mouseDownOnCrop&&(this.mouseDownOnCrop=!1,this.dragStarted=!1,n&&n(e),i&&i(l(t,o.width,o.height),s(t,o.width,o.height)),this.setState({cropIsActive:!1,newCropIsBeingDrawn:!1}))},this.onDragFocus=()=>{var e;null==(e=this.componentRef.current)||e.scrollTo(0,0)}}get document(){return document}getBox(){let e=this.mediaRef.current;if(!e)return{x:0,y:0,width:0,height:0};let{x:t,y:r,width:i,height:n}=e.getBoundingClientRect();return{x:t,y:r,width:i,height:n}}componentDidUpdate(e){let{crop:t,onComplete:r}=this.props;if(r&&!e.crop&&t){let{width:e,height:i}=this.getBox();e&&i&&r(l(t,e,i),s(t,e,i))}}componentWillUnmount(){this.resizeObserver&&this.resizeObserver.disconnect(),this.unbindDocMove()}bindDocMove(){this.docMoveBound||(this.document.addEventListener("pointermove",this.onDocPointerMove,c),this.document.addEventListener("pointerup",this.onDocPointerDone,c),this.document.addEventListener("pointercancel",this.onDocPointerDone,c),this.docMoveBound=!0)}unbindDocMove(){this.docMoveBound&&(this.document.removeEventListener("pointermove",this.onDocPointerMove,c),this.document.removeEventListener("pointerup",this.onDocPointerDone,c),this.document.removeEventListener("pointercancel",this.onDocPointerDone,c),this.docMoveBound=!1)}getCropStyle(){let{crop:e}=this.props;if(e)return{top:`${e.y}${e.unit}`,left:`${e.x}${e.unit}`,width:`${e.width}${e.unit}`,height:`${e.height}${e.unit}`}}dragCrop(){let{evData:e}=this,t=this.getBox(),r=this.makePixelCrop(t),i=e.clientX-e.startClientX,n=e.clientY-e.startClientY;return r.x=o(e.startCropX+i,0,t.width-r.width),r.y=o(e.startCropY+n,0,t.height-r.height),r}getPointRegion(e,t,r,i){let n;let{evData:o}=this,a=o.clientX-e.x,h=o.clientY-e.y;return n=i&&t?"nw"===t||"n"===t||"ne"===t:h<o.startCropY,(r&&t?"nw"===t||"w"===t||"sw"===t:a<o.startCropX)?n?"nw":"sw":n?"ne":"se"}resolveMinDimensions(e,t,r=0,i=0){let n=Math.min(r,e.width),o=Math.min(i,e.height);return t&&(n||o)?t>1?n?[n,n/t]:[o*t,o]:o?[o*t,o]:[n,n/t]:[n,o]}resizeCrop(){let{evData:t}=this,{aspect:r=0,maxWidth:i,maxHeight:n}=this.props,a=this.getBox(),[h,s]=this.resolveMinDimensions(a,r,this.props.minWidth,this.props.minHeight),l=this.makePixelCrop(a),c=this.getPointRegion(a,t.ord,h,s),p=t.ord||c,w=t.clientX-t.startClientX,g=t.clientY-t.startClientY;(h&&"nw"===p||"w"===p||"sw"===p)&&(w=Math.min(w,-h)),(s&&"nw"===p||"n"===p||"ne"===p)&&(g=Math.min(g,-s));let u={unit:"px",x:0,y:0,width:0,height:0};"ne"===c?(u.x=t.startCropX,u.width=w,r?u.height=u.width/r:u.height=Math.abs(g),u.y=t.startCropY-u.height):"se"===c?(u.x=t.startCropX,u.y=t.startCropY,u.width=w,r?u.height=u.width/r:u.height=g):"sw"===c?(u.x=t.startCropX+w,u.y=t.startCropY,u.width=Math.abs(w),r?u.height=u.width/r:u.height=g):"nw"===c&&(u.x=t.startCropX+w,u.width=Math.abs(w),r?(u.height=u.width/r,u.y=t.startCropY-u.height):(u.height=Math.abs(g),u.y=t.startCropY+g));let m=d(u,r,c,a.width,a.height,h,s,i,n);return r||e.xyOrds.indexOf(p)>-1?l=m:e.xOrds.indexOf(p)>-1?(l.x=m.x,l.width=m.width):e.yOrds.indexOf(p)>-1&&(l.y=m.y,l.height=m.height),l.x=o(l.x,0,a.width-l.width),l.y=o(l.y,0,a.height-l.height),l}renderCropSelection(){let{ariaLabels:t=e.defaultProps.ariaLabels,disabled:r,locked:n,renderSelectionAddon:o,ruleOfThirds:a,crop:h}=this.props,s=this.getCropStyle();if(h)return i.createElement("div",{style:s,className:"ReactCrop__crop-selection",onPointerDown:this.onCropPointerDown,"aria-label":t.cropArea,tabIndex:0,onKeyDown:this.onComponentKeyDown,role:"group"},!r&&!n&&i.createElement("div",{className:"ReactCrop__drag-elements",onFocus:this.onDragFocus},i.createElement("div",{className:"ReactCrop__drag-bar ord-n","data-ord":"n"}),i.createElement("div",{className:"ReactCrop__drag-bar ord-e","data-ord":"e"}),i.createElement("div",{className:"ReactCrop__drag-bar ord-s","data-ord":"s"}),i.createElement("div",{className:"ReactCrop__drag-bar ord-w","data-ord":"w"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-nw","data-ord":"nw",tabIndex:0,"aria-label":t.nwDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"nw"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-n","data-ord":"n",tabIndex:0,"aria-label":t.nDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"n"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-ne","data-ord":"ne",tabIndex:0,"aria-label":t.neDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"ne"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-e","data-ord":"e",tabIndex:0,"aria-label":t.eDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"e"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-se","data-ord":"se",tabIndex:0,"aria-label":t.seDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"se"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-s","data-ord":"s",tabIndex:0,"aria-label":t.sDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"s"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-sw","data-ord":"sw",tabIndex:0,"aria-label":t.swDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"sw"),role:"button"}),i.createElement("div",{className:"ReactCrop__drag-handle ord-w","data-ord":"w",tabIndex:0,"aria-label":t.wDragHandle,onKeyDown:e=>this.onHandlerKeyDown(e,"w"),role:"button"})),o&&i.createElement("div",{className:"ReactCrop__selection-addon",onPointerDown:e=>e.stopPropagation()},o(this.state)),a&&i.createElement(i.Fragment,null,i.createElement("div",{className:"ReactCrop__rule-of-thirds-hz"}),i.createElement("div",{className:"ReactCrop__rule-of-thirds-vt"})))}makePixelCrop(e){return l({...n,...this.props.crop||{}},e.width,e.height)}render(){let{aspect:e,children:t,circularCrop:r,className:n,crop:o,disabled:h,locked:s,style:l,ruleOfThirds:d}=this.props,{cropIsActive:c,newCropIsBeingDrawn:p}=this.state,w=o?this.renderCropSelection():null,g=a("ReactCrop",n,c&&"ReactCrop--active",h&&"ReactCrop--disabled",s&&"ReactCrop--locked",p&&"ReactCrop--new-crop",o&&e&&"ReactCrop--fixed-aspect",o&&r&&"ReactCrop--circular-crop",o&&d&&"ReactCrop--rule-of-thirds",!this.dragStarted&&o&&!o.width&&!o.height&&"ReactCrop--invisible-crop",r&&"ReactCrop--no-animate");return i.createElement("div",{ref:this.componentRef,className:g,style:l},i.createElement("div",{ref:this.mediaRef,className:"ReactCrop__child-wrapper",onPointerDown:this.onComponentPointerDown},t),o?i.createElement("svg",{className:"ReactCrop__crop-mask",width:"100%",height:"100%"},i.createElement("defs",null,i.createElement("mask",{id:`hole-${this.instanceId}`},i.createElement("rect",{width:"100%",height:"100%",fill:"white"}),r?i.createElement("ellipse",{cx:`${o.x+o.width/2}${o.unit}`,cy:`${o.y+o.height/2}${o.unit}`,rx:`${o.width/2}${o.unit}`,ry:`${o.height/2}${o.unit}`,fill:"black"}):i.createElement("rect",{x:`${o.x}${o.unit}`,y:`${o.y}${o.unit}`,width:`${o.width}${o.unit}`,height:`${o.height}${o.unit}`,fill:"black"}))),i.createElement("rect",{fill:"black",fillOpacity:.5,width:"100%",height:"100%",mask:`url(#hole-${this.instanceId})`})):void 0,w)}};w.xOrds=["e","w"],w.yOrds=["n","s"],w.xyOrds=["nw","ne","se","sw"],w.nudgeStep=1,w.nudgeStepMedium=10,w.nudgeStepLarge=100,w.defaultProps={ariaLabels:{cropArea:"Use the arrow keys to move the crop selection area",nwDragHandle:"Use the arrow keys to move the north west drag handle to change the crop selection area",nDragHandle:"Use the up and down arrow keys to move the north drag handle to change the crop selection area",neDragHandle:"Use the arrow keys to move the north east drag handle to change the crop selection area",eDragHandle:"Use the up and down arrow keys to move the east drag handle to change the crop selection area",seDragHandle:"Use the arrow keys to move the south east drag handle to change the crop selection area",sDragHandle:"Use the up and down arrow keys to move the south drag handle to change the crop selection area",swDragHandle:"Use the arrow keys to move the south west drag handle to change the crop selection area",wDragHandle:"Use the up and down arrow keys to move the west drag handle to change the crop selection area"}};let g=w}}]);