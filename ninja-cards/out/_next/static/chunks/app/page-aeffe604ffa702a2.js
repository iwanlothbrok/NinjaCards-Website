(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{2309:function(e,t,i){Promise.resolve().then(i.bind(i,2642))},2642:function(e,t,i){"use strict";i.r(t),i.d(t,{default:function(){return w}});var a=i(7437),s=i(2265),n=i(9047),r=i(6159),l=i(3153);function o(e,t){[...t].reverse().forEach(i=>{let a=e.getVariant(i);a&&(0,r.C)(e,a),e.variantChildren&&e.variantChildren.forEach(e=>{o(e,t)})})}function c(){let e=!1,t=new Set,i={subscribe:e=>(t.add(e),()=>void t.delete(e)),start(i,a){(0,n.k)(e,"controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.");let s=[];return t.forEach(e=>{s.push((0,l.d)(e,i,{transitionOverride:a}))}),Promise.all(s)},set:i=>((0,n.k)(e,"controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook."),t.forEach(e=>{Array.isArray(i)?o(e,i):"string"==typeof i?o(e,[i]):(0,r.C)(e,i)})),stop(){t.forEach(e=>{!function(e){e.values.forEach(e=>e.stop())}(e)})},mount:()=>(e=!0,()=>{e=!1,i.stop()})};return i}var d=i(458),m=i(9033);let u=function(){let e=(0,d.h)(c);return(0,m.L)(e.mount,[]),e};var h=i(7847),x=()=>{let[e,t]=(0,s.useState)(!1);(0,s.useEffect)(()=>{let e=()=>{t(window.innerWidth<768)};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]),u();let i=u(),n=u(),r=u(),l=u(),o=u(),c=(0,s.useRef)(null),d=(0,s.useRef)(null),m=(0,s.useRef)(null),x=(0,s.useRef)(null),g=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let e=new IntersectionObserver(t=>{t.forEach(t=>{if(t.isIntersecting){switch(t.target){case c.current:i.start("visible");break;case d.current:n.start("visible");break;case m.current:r.start("visible");break;case x.current:l.start("visible");break;case g.current:o.start("visible")}e.unobserve(t.target)}})},{threshold:.1});return c.current&&e.observe(c.current),d.current&&e.observe(d.current),m.current&&e.observe(m.current),x.current&&e.observe(x.current),g.current&&e.observe(g.current),()=>{e.disconnect()}},[i,n,r,l,o]),(0,a.jsxs)("div",{className:"bg-gradient-to-b from-black via-gray-950 to-black",children:[(0,a.jsxs)(h.E.div,{ref:d,initial:"hidden",animate:n,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-10}},transition:{duration:.8},className:"transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100 mb-4 pt-10 space-y-4 text-center",children:[(0,a.jsx)(h.E.div,{initial:"hidden",animate:n,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-10}},transition:{duration:.6},className:"inline-block  px-3 py-1  text-sm font-semibold text-indigo-100 bg-[#202c47] rounded-full bg-opacity-70 hover:cursor-pointer hover:bg-opacity-50",children:"Профил"}),(0,a.jsx)(h.E.h1,{initial:"hidden",animate:n,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-10}},transition:{duration:.7},className:"text-2xl font-semibold text-white sm:text-3xl",children:"Отключете мощта на NFC технологията"}),(0,a.jsx)(h.E.p,{initial:"hidden",animate:n,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-10}},transition:{duration:.8},className:"text-md text-gray-200 sm:text-lg",children:"Преминете към следващото поколение визитки. Нашите NFC решения правят споделянето на контакт лесно и впечатляващо."})]}),(0,a.jsxs)("div",{className:"relative text-white flex flex-col md:flex-row items-center justify-evenly p-8 md:p-16",children:[(0,a.jsxs)(h.E.div,{ref:c,initial:"hidden",animate:i,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-50}},transition:{duration:1},className:"max-w-md about-section",children:[(0,a.jsxs)(h.E.h2,{initial:"hidden",animate:i,variants:{visible:{opacity:1,x:0},hidden:{opacity:0,x:-50}},transition:{duration:.8},className:"text-3xl md:text-4xl font-bold mb-6 text-center md:text-left leading-tight",children:["Вашият персонализиран профил в ",(0,a.jsx)("span",{className:"text-orange",children:"NinjaCard"})]}),(0,a.jsx)(h.E.p,{initial:"hidden",animate:i,variants:{visible:{opacity:1,x:0},hidden:{opacity:0,x:-50}},transition:{duration:.9},className:"text-gray-400 mb-6 text-center md:text-left leading-relaxed",children:"Получете уникална смарт визитка с изцяло ваш дизайн, която съдържа всичко необходимо за вас и вашите бъдещи клиенти. Профилът Ви ще бъде винаги актуален и лесно достъпен, предоставяйки на клиентите Ви незабавен достъп до важна информация и контакти."}),(0,a.jsxs)(h.E.p,{initial:"hidden",animate:i,variants:{visible:{opacity:1,x:0},hidden:{opacity:0,x:-50}},transition:{duration:1},className:"text-gray-400 mb-8 text-center md:text-left leading-relaxed",children:["С ",(0,a.jsx)("span",{className:"text-orange",children:"NinjaCard"})," профила си можете лесно да споделите всички ваши данни за контакт, връзки към социални мрежи, уебсайтове и още много! Останете свързани в съвременния дигитален свят."]}),!1===e?(0,a.jsx)(h.E.div,{ref:m,initial:"hidden",animate:r,variants:{visible:{opacity:1},hidden:{opacity:0}},transition:{duration:1.4},className:"grid grid-cols-2 md:grid-cols-3 gap-6 text-sm",children:["Мигновено споделяне","Персонализиран дизайн","Здравина и дълготрайност","Безконтактно използване","60 връзки на едно място","Всичко на едно място"].map((e,t)=>(0,a.jsxs)(h.E.div,{initial:"hidden",animate:r,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-10}},transition:{duration:.5,delay:.4*t},className:"flex items-center",children:[(0,a.jsx)("span",{className:"mr-2 text-lg text-green-500",children:"✔"})," ",e]},t))}):null,(0,a.jsx)(h.E.div,{ref:x,initial:"hidden",animate:l,variants:{visible:{opacity:1,scale:1},hidden:{opacity:0,scale:.9}},transition:{duration:1.4},className:"mt-10 mb-8 flex justify-center md:justify-start",children:(0,a.jsx)("button",{className:"bg-gradient-to-r from-orange to-teal-600 text-white px-9 py-4 rounded-full transition-transform transform hover:scale-105 focus:outline-none shadow-xl",children:"ВЗЕМИ ТВОЯТА ВИЗИТКА"})})]}),(0,a.jsx)(h.E.section,{ref:g,initial:"hidden",animate:o,variants:{visible:{opacity:1},hidden:{opacity:0}},transition:{duration:1.5},className:"relative flex items-center justify-center w-[300px] h-[600px] bg-cover bg-center transform transition-transform duration-500 hover:scale-105",children:(0,a.jsx)("img",{src:"/realMockup.png",alt:"Profile Details Screenshot",className:"absolute w-[99%] h-[100%] object-cover rounded-[29px] shadow-2xl transform transition-transform duration-500 hover:scale-100"})}),!0===e?(0,a.jsx)("div",{className:"grid grid-cols-2 md:grid-cols-3 gap-6 text-sm my-8",children:["Мигновено споделяне","Персонализиран дизайн","Здравина и дълготрайност","Безконтактно използване","60 връзки на едно място","Всичко на едно място"].map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center",children:[(0,a.jsx)("span",{className:"mr-2 text-lg text-green-500",children:"✔"})," ",e]},t))}):null]})]})};let g=[{name:"Kanye West",title:"Rapper & Entrepreneur",quote:"It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",image:"https://pbs.twimg.com/profile_images/1276461929934942210/cqNhNk6v_400x400.jpg",link:"https://twitter.com/kanyewest"},{name:"Satya Nadella",title:"CEO of Microsoft",quote:"Tortor dignissim convallis aenean et tortor at. At ultrices mi tempus imperdiet nulla malesuada.",image:"https://pbs.twimg.com/profile_images/1221837516816306177/_Ld4un5A_400x400.jpg",link:"https://twitter.com/satyanadella"},{name:"Dan Schulman",title:"CEO of PayPal",quote:"Quam pellentesque nec nam aliquam sem et tortor consequat id.",image:"https://pbs.twimg.com/profile_images/516916920482672641/3jCeLgFb_400x400.jpeg",link:"https://twitter.com/dan_schulman"},{name:"Parag Agrawal",title:"CEO of Twitter",quote:"It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",image:"https://pbs.twimg.com/profile_images/1375285353146327052/y6jeByyD_400x400.jpg",link:"https://twitter.com/paraga"},{name:"Elon Musk",title:"CEO of Tesla",quote:"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",image:"https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_400x400.jpg",link:"https://twitter.com/elonmusk"},{name:"Tim Cook",title:"CEO of Apple",quote:"Lorem Ipsum has been the industry standard dummy text ever since the 1500s.",image:"https://pbs.twimg.com/profile_images/1535420431766671360/Pwq-1eJc_400x400.jpg",link:"https://twitter.com/tim_cook"}];var p=()=>{let e=u(),t=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let i=new IntersectionObserver(t=>{t.forEach(t=>{t.isIntersecting?e.start("visible"):e.start("hidden")})},{threshold:.1});return t.current&&i.observe(t.current),()=>{t.current&&i.unobserve(t.current)}},[e]),(0,a.jsx)(h.E.section,{ref:t,initial:"hidden",animate:e,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:50}},transition:{duration:.5},id:"testimonies",className:"py-12 px-4 bg-gray-950",children:(0,a.jsxs)("div",{className:"max-w-6xl mx-auto",children:[(0,a.jsx)("div",{className:"transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100",children:(0,a.jsxs)("div",{className:"mb-8 space-y-4 text-center",children:[(0,a.jsx)(h.E.div,{variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-20}},transition:{duration:.6},className:"inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-lg bg-[#202c47] bg-opacity-60 hover:cursor-pointer hover:bg-opacity-40",children:"Клиенти"}),(0,a.jsx)(h.E.h1,{variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-20}},transition:{duration:.7},className:"text-2xl font-semibold text-white sm:text-3xl",children:"Гласовете на нашите клиенти"}),(0,a.jsx)(h.E.p,{variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-20}},transition:{duration:.8},className:"text-md text-gray-100 sm:text-lg",children:"Чуйте какво споделят нашите доволни клиенти за продуктите и услугите ни."})]})}),(0,a.jsx)("div",{className:"grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8",children:g.map((t,i)=>(0,a.jsx)(h.E.div,{initial:"hidden",animate:e,variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:50}},transition:{duration:.5,delay:.1*i},className:"text-sm leading-6",children:(0,a.jsxs)("div",{className:"relative group",children:[(0,a.jsx)("div",{className:"absolute transition rounded-lg opacity-25 -inset-1 bg-gradient-to-r from-orange to-pink-600 blur duration-400 group-hover:opacity-100 group-hover:duration-200"}),(0,a.jsx)("a",{href:t.link,className:"cursor-pointer",children:(0,a.jsxs)("div",{className:"relative p-4 space-y-4 leading-none rounded-lg bg-slate-800 ring-1 ring-gray-900/5",children:[(0,a.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,a.jsx)("img",{src:t.image,className:"w-10 h-10 bg-center bg-cover border rounded-full",alt:t.name}),(0,a.jsxs)("div",{children:[(0,a.jsx)("h3",{className:"text-base font-semibold text-white",children:t.name}),(0,a.jsx)("p",{className:"text-gray-400 text-sm",children:t.title})]})]}),(0,a.jsx)("p",{className:"leading-normal text-gray-300 text-sm",children:t.quote})]})})]})},i))})]})})};let b=e=>{let{id:t,imageUrl:i,name:n,description:r}=e,l=u(),o=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let e=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting?l.start("visible"):l.start("hidden")})},{threshold:.1});return o.current&&e.observe(o.current),()=>{o.current&&e.unobserve(o.current)}},[l]),(0,a.jsxs)(h.E.div,{ref:o,initial:"hidden",animate:l,variants:{visible:{opacity:1,y:0,scale:1},hidden:{opacity:0,y:50,scale:.95}},transition:{duration:.6,ease:"easeOut"},className:"relative w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group",children:[(0,a.jsx)("div",{className:"w-full h-64 bg-gray-300 rounded-t-lg overflow-hidden",children:(0,a.jsx)("img",{src:i,alt:n,className:"w-full h-full object-center object-cover transition-transform duration-300 transform group-hover:scale-105"})}),(0,a.jsxs)("div",{className:"p-4 flex flex-col items-center",children:[(0,a.jsx)("h2",{className:"text-xl font-semibold text-white transition-colors duration-300 group-hover:text-orange",children:n}),(0,a.jsx)("p",{className:"text-md font-semibold text-white transition-colors duration-300 group-hover:text-orange",children:r}),(0,a.jsx)("a",{href:"/product/".concat(t),className:"mt-4 px-5 py-2 bg-orange text-white rounded-lg shadow hover:bg-opacity-50 transition-transform transform hover:scale-125",children:"Buy Now"})]}),(0,a.jsx)("a",{href:"/product/".concat(t),className:"absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 ",style:{cursor:"pointer"},children:(0,a.jsxs)("span",{className:"sr-only",children:["View ",n]})})]})};var f=()=>(0,a.jsxs)("div",{className:"bg-gradient-to-b from-black to-gray-950 py-16",children:[(0,a.jsxs)(h.E.div,{initial:"hidden",animate:"visible",variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-30}},transition:{duration:1},className:"text-center mb-16",children:[(0,a.jsx)(h.E.div,{variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-40}},transition:{duration:1.5},className:"inline-block  px-3 py-1  text-sm font-semibold text-indigo-100 rounded-full bg-[#202c47] bg-opacity-60 hover:bg-opacity-50",children:"Продукти"}),(0,a.jsx)(h.E.h1,{variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-50}},transition:{duration:2},className:"text-3xl font-bold text-white sm:text-4xl",children:"Открийте нашата гама от NFC продукти"}),(0,a.jsx)(h.E.p,{variants:{visible:{opacity:1,y:0},hidden:{opacity:0,y:-20}},transition:{duration:.8},className:"text-lg text-gray-300 sm:text-xl max-w-2xl mx-auto",children:"Предлагаме разнообразие от NFC продукти, съобразени с вашите специфични нужди. Разгледайте нашата колекция и намерете идеалното решение за вашия бизнес."})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-16",children:[(0,a.jsx)(b,{id:"nfcCards",imageUrl:"/Metal-Hybrid-Silver.png",name:"NFC Cards",description:""},1),(0,a.jsx)(b,{id:"googleReveiws",imageUrl:"/rev.webp",name:"Google Reviews",description:""},2),(0,a.jsx)(b,{id:"nfcProducts",imageUrl:"/sticker.jpg",name:"Google Reviews",description:""},3)]})]}),y=()=>{let[e,t]=(0,s.useState)({name:"",email:"",phone:"",subject:""}),[i,n]=(0,s.useState)(""),[r,l]=(0,s.useState)(""),o=e=>{let{name:i,value:a}=e.target;t(e=>({...e,[i]:a}))},c=async i=>{i.preventDefault(),n(""),l(""),(await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})).ok?(l("Message sent successfully!"),t({name:"",email:"",phone:"",subject:""})):n("Failed to send message. Please try again.")};return(0,a.jsxs)("div",{className:"bg-gradient-to-b from-gray-950 to-black min-h-screen flex flex-col justify-center items-center p-6",children:[(0,a.jsx)("div",{className:"transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100",children:(0,a.jsxs)("div",{className:"space-y-4 text-center pt-10",children:[(0,a.jsx)("div",{className:"inline-block px-4 py-2 text-sm font-semibold text-indigo-100 rounded-full bg-[#202c47] bg-opacity-70 hover:cursor-pointer hover:bg-opacity-50",children:"Свържете се с нас"}),(0,a.jsx)("h1",{className:"text-2xl font-semibold text-white sm:text-3xl",children:"Връзка с нашия екип"}),(0,a.jsx)("p",{className:"text-md text-gray-100 sm:text-lg",children:"Имаме готовност да помогнем. Свържете се с нас за всякакви въпроси или предложения."})]})}),(0,a.jsxs)("div",{className:"w-full max-w-md bg-[#1e293b] bg-opacity-95 rounded-lg shadow-xl p-6 mt-8",children:[(0,a.jsx)("h2",{className:"text-2xl font-semibold text-center text-orange mb-6",children:"Свържете се с нас"}),(0,a.jsxs)("form",{onSubmit:c,children:[(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block text-white font-medium mb-2",htmlFor:"name",children:"Имена"}),(0,a.jsx)("input",{type:"text",id:"name",name:"name",value:e.name,onChange:o,placeholder:"Вашето име",className:"w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",required:!0})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block text-white font-medium mb-2",htmlFor:"email",children:"Имейл"}),(0,a.jsx)("input",{type:"email",id:"email",name:"email",value:e.email,onChange:o,placeholder:"Вашият имейл",className:"w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",required:!0})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block text-white font-medium mb-2",htmlFor:"phone",children:"Телефонен номер"}),(0,a.jsx)("input",{type:"text",id:"phone",name:"phone",value:e.phone,onChange:o,placeholder:"Вашият телефонен номер",className:"w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500",required:!0})]}),(0,a.jsxs)("div",{className:"mb-4",children:[(0,a.jsx)("label",{className:"block text-white font-medium mb-2",htmlFor:"subject",children:"Информация"}),(0,a.jsx)("textarea",{id:"subject",name:"subject",value:e.subject,onChange:o,placeholder:"Вашето съобщение",className:"w-full px-3 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none",required:!0})]}),(0,a.jsxs)("div",{className:"flex justify-between",children:[(0,a.jsx)("button",{type:"submit",className:"px-5 py-2 bg-orange  text-white rounded-lg shadow hover:bg-orange-600 transition-transform transform hover:scale-105",children:"ИЗПРАТИ"}),(0,a.jsx)("button",{type:"reset",onClick:()=>t({name:"",email:"",phone:"",subject:""}),className:"px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-transform transform hover:scale-105",children:"Reset Form"})]}),i&&(0,a.jsx)("p",{className:"mt-4 text-red-500 text-center",children:i}),r&&(0,a.jsx)("p",{className:"mt-4 text-green-500 text-center",children:r})]})]})]})},v=i(7138),j=()=>{let[e,t]=(0,s.useState)(!1),i=(0,s.useRef)(null);return(0,s.useEffect)(()=>{let e=new IntersectionObserver(i=>{i.forEach(i=>{i.isIntersecting&&(t(!0),e.unobserve(i.target))})},{threshold:.1});return i.current&&e.observe(i.current),()=>{i.current&&e.unobserve(i.current)}},[]),(0,a.jsxs)("section",{ref:i,className:"relative w-full h-screen bg-cover bg-center",style:{backgroundImage:e?"url(/Metal-Hybrid-Silver.png)":"none",transition:"background-image 0.5s ease-in-out"},children:[(0,a.jsx)("div",{className:"absolute inset-0 bg-black bg-opacity-80"}),(0,a.jsxs)("div",{className:"relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4",children:[(0,a.jsxs)(h.E.h1,{className:"text-5xl md:text-6xl font-extrabold mb-4 leading-tight",initial:{opacity:0,y:-50},animate:{opacity:1,y:0},transition:{duration:1},children:["ПРЕМИУМ ",(0,a.jsx)("span",{className:"text-orange",children:"ДИГИТАЛНА ВИЗИТКА"})]}),(0,a.jsxs)(h.E.p,{className:"text-xl md:text-2xl mb-8 max-w-2xl leading-relaxed",initial:{opacity:0,y:50},animate:{opacity:1,y:0},transition:{duration:1,delay:.5},children:["Най-мощният инструмент за създаване на контакти.",(0,a.jsx)("span",{className:"text-orange",children:" Подобрете бизнеса си"})," с нашите NFC продукти."]}),(0,a.jsxs)(h.E.div,{className:"flex flex-col md:flex-row gap-4",initial:{opacity:0},animate:{opacity:1},transition:{duration:1,delay:1},children:[(0,a.jsx)(v.default,{href:"/contact",children:(0,a.jsx)("button",{className:"bg-orange text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gradient-to-r from-orange to-yellow-600 transition-transform transform hover:scale-105 focus:outline-none",children:"ПОРЪЧАЙ СЕГА"})}),(0,a.jsx)(v.default,{href:"#features",children:(0,a.jsx)("button",{className:"bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-gradient-to-r from-white to-gray-200 hover:text-black transition-transform transform hover:scale-105 focus:outline-none",children:"НАУЧИ ПОВЕЧЕ"})})]})]})]})},N=i(2399);function w(){return N.M?(0,a.jsxs)("main",{className:"",children:[(0,a.jsx)(j,{}),(0,a.jsx)(x,{}),(0,a.jsx)(f,{}),(0,a.jsx)(p,{}),(0,a.jsx)(y,{})]}):null}},2399:function(e,t,i){"use strict";i.d(t,{M:function(){return a}});let a="https://ninja-cards-website-lnp1.vercel.app"}},function(e){e.O(0,[847,138,971,23,744],function(){return e(e.s=2309)}),_N_E=e.O()}]);