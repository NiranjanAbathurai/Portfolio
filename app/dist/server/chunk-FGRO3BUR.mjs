import './polyfills.server.mjs';
import{c as ne}from"./chunk-3GPDO3JU.mjs";import{b as ie,c as V,d as re,e as ae,f as ce,g as H,i as le,l as se,m as me,q as pe,s as de}from"./chunk-TCL7CMNU.mjs";import{$ as f,Ga as Y,H as O,Ha as A,I as a,Ia as I,J as C,La as Z,Ma as X,O as K,Q as _,S as s,U as k,V as S,W as j,X as n,Y as o,Ya as ee,Z as l,Za as te,_ as M,_a as oe,a as U,aa as p,ab as R,ba as W,bb as L,ca as z,da as D,ea as r,fa as g,g as J,ga as b,h as w,la as E,ma as F,n as u,na as N,o as P,r as x,s as v}from"./chunk-TE4N5HVV.mjs";import{f as ye}from"./chunk-VVCT4QZE.mjs";var q={};ye(q,{$schema:()=>we,cli:()=>Se,default:()=>je,newProjectRoot:()=>Oe,projects:()=>ke,version:()=>Pe});var we="./node_modules/@angular/cli/lib/config/schema.json",Pe=1,Oe="projects",ke={app:{projectType:"application",schematics:{"@schematics/angular:component":{style:"scss",standalone:!1},"@schematics/angular:directive":{standalone:!1},"@schematics/angular:pipe":{standalone:!1}},root:"",sourceRoot:"src",prefix:"app",architect:{build:{builder:"@angular-devkit/build-angular:application",options:{outputPath:"dist/",index:"src/index.html",browser:"src/main.ts",polyfills:["zone.js"],tsConfig:"tsconfig.app.json",inlineStyleLanguage:"scss",assets:["src/favicon.ico","src/assets"],styles:["src/styles.scss"],scripts:[],server:"src/main.server.ts",prerender:!0,ssr:{entry:"server.ts"}},configurations:{production:{aot:!0,optimization:!0,sourceMap:!1,budgets:[{type:"initial",maximumWarning:"500kb",maximumError:"1mb"},{type:"anyComponentStyle",maximumWarning:"2kb",maximumError:"4kb"}],outputHashing:"all"},development:{optimization:!1,extractLicenses:!1,sourceMap:!0}},defaultConfiguration:"production"},serve:{builder:"@angular-devkit/build-angular:dev-server",configurations:{production:{buildTarget:"app:build:production"},development:{buildTarget:"app:build:development"}},defaultConfiguration:"development"},"extract-i18n":{builder:"@angular-devkit/build-angular:extract-i18n",options:{buildTarget:"app:build"}},test:{builder:"@angular-devkit/build-angular:karma",options:{polyfills:["zone.js","zone.js/testing"],tsConfig:"tsconfig.spec.json",inlineStyleLanguage:"scss",assets:["src/favicon.ico","src/assets"],styles:["src/styles.css"],scripts:[]}}}},models:{projectType:"library",root:"projects/models",sourceRoot:"projects/models/src",prefix:"lib",architect:{build:{builder:"@angular-devkit/build-angular:ng-packagr",options:{project:"projects/models/ng-package.json"},configurations:{production:{tsConfig:"projects/models/tsconfig.lib.prod.json"},development:{tsConfig:"projects/models/tsconfig.lib.json"}},defaultConfiguration:"production"},test:{builder:"@angular-devkit/build-angular:karma",options:{tsConfig:"projects/models/tsconfig.spec.json",polyfills:["zone.js","zone.js/testing"]}}}}},Se={analytics:"13bdd131-a5d6-40a5-9ea9-34afe67289e0"},je={$schema:we,version:Pe,newProjectRoot:Oe,projects:ke,cli:Se};var B=(()=>{class e{constructor(){this.scrollToTarget=new U}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275prov=J({token:e,factory:e.\u0275fac,providedIn:"root"})}}return e})();var Ee=e=>({"margin-bottom":e});function Ie(e,m){e&1&&(n(0,"span",17),r(1,"Thank you! I will respond shortly."),o())}var fe=(()=>{class e{constructor(t){this.fb=t,this.displaySuccess=!1}ngOnInit(){this.contactForm=new ce({firstName:new H("",[V.required]),lastName:new H("",[V.required]),mobile:new H("",[V.required]),email:new H("",[V.required,Te])})}onSubmit(){console.log(this.contactForm),this.displaySuccess=!0,setTimeout(()=>{this.displaySuccess=!1},3e3)}onKeyPress(){let t=JSON.parse(JSON.stringify(this.contactForm.controls.mobile.value));console.log(t);let i=/[^0-9]/;t=t.replace(/[^0-9]/g,""),this.contactForm.controls.mobile.patchValue(t)}onReset(){this.contactForm.reset({firstName:"",lastName:"",mobile:"",email:""}),this.displaySuccess=!1}static{this.\u0275fac=function(i){return new(i||e)(C(pe))}}static{this.\u0275cmp=u({type:e,selectors:[["app-contact"]],decls:32,vars:5,consts:[[1,"contact-page"],[3,"ngSubmit","formGroup"],[1,"row","p-4","form-box","onScroll"],[1,"form-input","row"],[1,"col-md-6","col-12"],["for","firstName",1,"form-label"],["id","firstName","name","firstName","formControlName","firstName","type","text",1,"form-label","form-control"],["for","lastName"],["id","lastName","name","lastName","formControlName","lastName","type","text",1,"form-label","form-control"],["for","mobile",1,"form-label"],["id","mobile","name","mobile","formControlName","mobile","type","text",1,"form-label","form-control",3,"keyup"],["for","email"],["id","email","name","email","formControlName","email","type","email",1,"form-label","form-control"],[1,"col-12","btn-div",3,"ngStyle"],["type","submit",1,"btn","btn-dark","submit-btn","col-md-6","col-12"],["type","button",1,"btn","btn-outline-success","reset-btn","col-md-6","col-12",3,"click"],["class","col-12 success-msg",4,"ngIf"],[1,"col-12","success-msg"]],template:function(i,c){i&1&&(n(0,"div",0)(1,"form",1),f("ngSubmit",function(){return c.onSubmit()}),n(2,"div",2)(3,"div",3)(4,"h4"),r(5,"Feel free to drop a message"),o(),n(6,"div",4)(7,"label",5),r(8,"First Name"),o(),l(9,"br")(10,"input",6),o(),n(11,"div",4)(12,"label",7),r(13,"Last Name"),o(),l(14,"br")(15,"input",8),o(),n(16,"div",4)(17,"label",9),r(18,"Mobile Number"),o(),l(19,"br"),n(20,"input",10),f("keyup",function(){return c.onKeyPress()}),o()(),n(21,"div",4)(22,"label",11),r(23,"Email"),o(),l(24,"br")(25,"input",12),o(),n(26,"div",13)(27,"button",14),r(28,"SUBMIT"),o(),n(29,"button",15),f("click",function(){return c.onReset()}),r(30,"RESET"),o()(),_(31,Ie,2,0,"span",16),o()()()()),i&2&&(a(),s("formGroup",c.contactForm),a(25),s("ngStyle",E(3,Ee,c.displaySuccess?"1rem":"0")),a(5),s("ngIf",c.displaySuccess))},dependencies:[I,Z,le,ie,re,ae,se,me],styles:[".contact-page[_ngcontent-%COMP%]   .form-box[_ngcontent-%COMP%]{width:50%;justify-self:center;border:2px solid green;border-radius:4px;box-shadow:0 3px 12px green;margin-bottom:2rem}@media screen and (max-width: 768px){.contact-page[_ngcontent-%COMP%]   .form-box[_ngcontent-%COMP%]{width:100%}}.contact-page[_ngcontent-%COMP%]   .form-label[_ngcontent-%COMP%]{width:100%;border-radius:4px;border:none;box-shadow:none}.contact-page[_ngcontent-%COMP%]   .form-label[_ngcontent-%COMP%]:focus{box-shadow:0 4px 13px green,0 -4px 12px green,4px 0 12px green,-4px 0 12px green!important}.contact-page[_ngcontent-%COMP%]   .submit-btn[_ngcontent-%COMP%]{width:50%;display:flex;justify-content:center;font-family:regular-font}.contact-page[_ngcontent-%COMP%]   .reset-btn[_ngcontent-%COMP%]{font-family:regular-font;width:50%;display:flex;justify-content:center;align-items:center}.contact-page[_ngcontent-%COMP%]   .form-input[_ngcontent-%COMP%]{padding:1rem}.contact-page[_ngcontent-%COMP%]   .btn-div[_ngcontent-%COMP%]{display:flex;padding:1rem;margin:2rem 0;gap:1rem}.contact-page[_ngcontent-%COMP%]   .btn.btn-dark[_ngcontent-%COMP%]{color:#000;background:green;border:none;border-radius:4px;padding:.75rem}.contact-page[_ngcontent-%COMP%]   .btn.btn-dark[_ngcontent-%COMP%]:hover{color:green;background:#fff;animation:glow-btn-animation 1.5s ease-in-out infinite}.contact-page[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-family:regular-font;color:#fff;padding-top:1rem}.contact-page[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%]{font-family:my-font;color:#fff;text-shadow:0px 8px 12px green,0px -8px 12px green,8px 0px 12px green,-8px 0px 12px green;margin-bottom:1rem}.contact-page[_ngcontent-%COMP%]   .success-msg[_ngcontent-%COMP%]{color:#fff;font-family:regular-font;margin-left:.25rem}"]})}}return e})();function Te(e){let m=e.value;return/[^a-zA-Z0-9]/.test(m)?{nameError:!0}:null}var G=e=>({"right-mbl":e});function Ne(e,m){if(e&1&&(n(0,"div",13),l(1,"i",14),o()),e&2){let t=p(3);s("ngClass",E(1,G,t.isMobile()))}}function Ve(e,m){e&1&&(n(0,"div",15),l(1,"i",14),o())}function He(e,m){if(e&1&&(n(0,"div",9),_(1,Ne,2,3,"div",10),n(2,"h3",11),r(3),o(),n(4,"h4",11),r(5),o(),n(6,"h5",11),r(7),o(),_(8,Ve,2,0,"div",12),o()),e&2){let t=p().$implicit,i=p();s("ngClass",i.isMobile()?"vertical-line-l justify-start":"vertical-line-r justify-end"),a(),s("ngIf",i.isMobile()),a(),s("ngClass",i.isMobile()?"ml-4rem":"mr-4rem"),a(),g(t.role),a(),s("ngClass",i.isMobile()?"ml-4rem":"mr-4rem"),a(),g(t.company),a(),s("ngClass",i.isMobile()?"ml-4rem":"mr-4rem"),a(),g(t.projectName),a(),s("ngIf",!i.isMobile())}}function We(e,m){if(e&1&&(n(0,"li",18),r(1),o()),e&2){let t=m.$implicit;a(),b(" ",t,"")}}function ze(e,m){if(e&1&&(n(0,"div",16)(1,"ul"),_(2,We,2,1,"li",17),o()()),e&2){let t=p().$implicit,i=p();s("ngClass",i.isMobile()?"vertical-line-l ":"pl-2rem"),a(2),s("ngForOf",t.description)}}function De(e,m){if(e&1&&(n(0,"div",19)(1,"div",13),l(2,"i",14),o(),n(3,"h3",20),r(4),o(),n(5,"h4",20),r(6),o(),n(7,"h5",20),r(8),o()()),e&2){let t=p().$implicit,i=p();a(),s("ngClass",E(4,G,i.isMobile())),a(3),g(t.role),a(2),g(t.company),a(2),g(t.projectName)}}function Ae(e,m){if(e&1&&(n(0,"li",18),r(1),o()),e&2){let t=m.$implicit;a(),b(" ",t,"")}}function Re(e,m){if(e&1&&(n(0,"div",16)(1,"ul"),_(2,Ae,2,1,"li",17),o()()),e&2){let t=p().$implicit,i=p();s("ngClass",i.isMobile()?"vertical-line-l justify-start":"vertical-line-r pr-2rem"),a(2),s("ngForOf",t.description)}}function Be(e,m){if(e&1&&(n(0,"div",9)(1,"div",13),l(2,"i",14),o(),n(3,"h3",20),r(4),o(),n(5,"h4",20),r(6),o(),n(7,"h5",20),r(8),o()()),e&2){let t=p().$implicit,i=p();s("ngClass",(i.isMobile(),"vertical-line-1 justify-start")),a(),s("ngClass",E(5,G,i.isMobile())),a(3),g(t.role),a(2),g(t.company),a(2),g(t.projectName)}}function $e(e,m){if(e&1&&(n(0,"div",5),_(1,He,9,9,"div",6)(2,ze,3,2,"div",7)(3,De,9,6,"div",8)(4,Re,3,2,"div",7)(5,Be,9,7,"div",6),o()),e&2){let t=m.odd,i=p();a(),s("ngIf",!t),a(),s("ngIf",!t),a(),s("ngIf",t&&i.isMobile()),a(),s("ngIf",t),a(),s("ngIf",t&&!i.isMobile())}}var _e=(()=>{class e{constructor(t){this.router=t,this.isMobile=K(!1),this.jobDetails=[{role:"Technology Analsyt",company:"Infosys, Ltd, Chennai",projectName:"Hershey's B2B",domain:"E-Commerce shopping site",description:["Working on the development of new SAP Spartacus store front project with Angular 17 version.","Developing responsive UI features according to the figma designs that supports mobile,tablet and desktop view","Worked on registration form using reactive forms, Signals for auto updating changes and @media queries for handling responsiveness of the application","Having hands-on experience in building and deploying the codebase in non-prod environment using SAP commerce cloud."]},{role:"Senior System Engineer",company:"Infosys, Ltd, Chennai",projectName:"Apple Inc,",domain:"Manufacturing & Processing",description:["Worked on creating a user interactive web application where user upload images and process them in OCR and display the data","Created responsive modal dialog with multiple table to add data and validations which will generate and download a report","Have work experience in creating API using spring boot java and do CRUD operations in non-sql mongoDB collections","Also build and deployed the codebase in IT and UAT using Rio and spinnaker tools"]},{role:"System Engineer",company:"Tata Consultancy Services, Chennai",projectName:"NielsenIQ",domain:"Marketing and data analysing",description:["Migrating an exisiting application to Angular 8 project and also optimizing performance of the application","Worked on multiple angular features like Pipes, Directives, Route guards, Lazy loading modules and so on","Creating and integrating API using HTTP modules with the help of Rxjs operators and Ngrx store concepts","Also worked on ag-grid modules for adding grid data and displaying in simpler format"]}]}ngOnInit(){this.onResize(this.event)}onResize(t){this.windowWidth=window.innerWidth,console.log("Window resized, new width:",this.windowWidth),this.windowWidth<=768?this.isMobile.set(!0):this.isMobile.set(!1)}onClick(){this.router.navigate(["mini-projects"])}static{this.\u0275fac=function(i){return new(i||e)(C(R))}}static{this.\u0275cmp=u({type:e,selectors:[["app-work-experience"]],hostBindings:function(i,c){i&1&&f("resize",function(y){return c.onResize(y)},!1,O)},decls:6,vars:1,consts:[[1,"work-experience","mt-4"],[1,"row","m-0","p-4","onScroll"],["class","row",4,"ngFor","ngForOf"],[1,"d-flex","justify-content-center","mt-4"],["type","button",1,"btn","btn-outline-success","w-25",3,"click"],[1,"row"],["class","col-md-6 col-12 p-4",3,"ngClass",4,"ngIf"],["class"," col-md-6 col-12 pt-2rem",3,"ngClass",4,"ngIf"],["class","col-md-6 col-12 p-4 vertical-line-l justify-start",4,"ngIf"],[1,"col-md-6","col-12","p-4",3,"ngClass"],["class","icon-cls-right",3,"ngClass",4,"ngIf"],[1,"role-cls",3,"ngClass"],["class","icon-cls-left",4,"ngIf"],[1,"icon-cls-right",3,"ngClass"],[1,"fa","fa-light","fa-circle"],[1,"icon-cls-left"],[1,"col-md-6","col-12","pt-2rem",3,"ngClass"],["class","li-cls",4,"ngFor","ngForOf"],[1,"li-cls"],[1,"col-md-6","col-12","p-4","vertical-line-l","justify-start"],[1,"ml-4rem","role-cls"]],template:function(i,c){i&1&&(n(0,"div",0)(1,"div",1),_(2,$e,6,5,"div",2),n(3,"div",3)(4,"button",4),f("click",function(){return c.onClick()}),r(5,"View Mini project"),o()()()()),i&2&&(a(2),s("ngForOf",c.jobDetails))},dependencies:[Y,A,I],styles:['.work-experience[_ngcontent-%COMP%]{background-color:#000}.work-experience[_ngcontent-%COMP%]   .text-color[_ngcontent-%COMP%]{color:#fff;text-align:center}.work-experience[_ngcontent-%COMP%]   .mt-8[_ngcontent-%COMP%]{margin-top:2rem!important}.work-experience[_ngcontent-%COMP%]   .pl-2rem[_ngcontent-%COMP%]{padding-left:2rem}.work-experience[_ngcontent-%COMP%]   .pr-2rem[_ngcontent-%COMP%]{padding-right:2rem}.work-experience[_ngcontent-%COMP%]   .vertical-line-r[_ngcontent-%COMP%]{border-right:2px solid grey;position:relative;left:.83rem}.work-experience[_ngcontent-%COMP%]   .vertical-line-l[_ngcontent-%COMP%]{border-left:2px solid grey;position:relative}.work-experience[_ngcontent-%COMP%]   .icon-cls-left[_ngcontent-%COMP%]{font-size:.5rem;color:#fff;position:absolute;top:50%;left:99.4%}.work-experience[_ngcontent-%COMP%]   .icon-cls-right[_ngcontent-%COMP%]{font-size:.5rem;color:#fff;position:absolute;top:50%;right:97.5%}.work-experience[_ngcontent-%COMP%]   .icon-cls-left[_ngcontent-%COMP%]:before{content:"";position:absolute;top:50%;width:50px;height:1px;background-color:#fff}.work-experience[_ngcontent-%COMP%]   .right-mbl[_ngcontent-%COMP%]{right:99.5%!important}.work-experience[_ngcontent-%COMP%]   .icon-cls-right[_ngcontent-%COMP%]:after{content:"";position:absolute;top:45%;width:50px;height:1px;background-color:#fff}.work-experience[_ngcontent-%COMP%]   .icon-cls-left[_ngcontent-%COMP%]:before{right:1%;top:40%}.work-experience[_ngcontent-%COMP%]   .icon-cls-right[_ngcontent-%COMP%]:before{left:1%;top:40%}.work-experience[_ngcontent-%COMP%]   .justify-end[_ngcontent-%COMP%]{justify-items:end;align-content:center}.work-experience[_ngcontent-%COMP%]   .justify-start[_ngcontent-%COMP%]{justify-items:start;align-content:center}.work-experience[_ngcontent-%COMP%]   .role-cls[_ngcontent-%COMP%]{color:#44ed44}.work-experience[_ngcontent-%COMP%]   .mr-4rem[_ngcontent-%COMP%]{margin-right:4rem}.work-experience[_ngcontent-%COMP%]   .ml-4rem[_ngcontent-%COMP%]{margin-left:4rem}.work-experience[_ngcontent-%COMP%]   .pt-2rem[_ngcontent-%COMP%]{padding-top:2rem}@media screen and (max-width: 500px){.work-experience[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{padding-left:0}.work-experience[_ngcontent-%COMP%]   .li-cls[_ngcontent-%COMP%]{padding:0 1rem}}.work-experience[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]:hover{color:#fff;background:green}']})}}return e})();function qe(e,m){if(e&1&&(n(0,"li",24),r(1),o()),e&2){let t=m.$implicit;a(),b("",t," ")}}function Qe(e,m){if(e&1&&(n(0,"li",24),r(1),o()),e&2){let t=m.$implicit;a(),b("",t," ")}}function Ge(e,m){if(e&1&&(n(0,"li",24),r(1),o()),e&2){let t=m.$implicit;a(),b("",t," ")}}var he=(()=>{class e{constructor(){this.toolsUsed=["Figma","Splunk","Postman","Spinnaker","Rio","MongoDB compass","SAP Commernce Cloud","Tortoise git"],this.versionControl=["Git","Bitbucket","Microsoft Azure"],this.ideWorked=["Visual studio code","Eclipse IDE"]}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=u({type:e,selectors:[["app-technology"]],decls:46,vars:12,consts:[[1,"technology-worked","mt-4"],[1,"row","mx-0","my-4","onScroll"],[1,"col-12"],[1,"technology"],[1,"glowing-text"],[1,"image-group","image-div"],["src","../../assets/figma.png","id","img4",1,"img-4","object_contain"],["src","../../assets/java.png","id","img4",1,"img-4","object_contain"],["src","../../assets/sass_logo.png","id","img4",1,"img-4","object_contain"],["src","../../assets/ngrx.png","id","img3",1,"img-3","object_contain"],["src","../../assets/html.png","id","img2",1,"img-2","object_contain"],["src","../../assets/javascript.png","id","img2",1,"img-1","object_contain"],["src","../../assets/nre_angular.png",1,"ang-img","object_contain"],["src","../../assets/typescript.png","id","img1",1,"img-1","object_contain"],["src","../../assets/css3.png","id","img4",1,"img-2","object_contain"],["src","../../assets/jasmine.png","id","img3",1,"img-3","object_contain"],["src","../../assets/bootstrap.png","id","img4",1,"img-4","object_contain"],["src","../../assets/git.png","id","img4",1,"img-4","object_contain"],["src","../../assets/mongo.png","id","img4",1,"img-4","object_contain"],[1,"col-md-6","col-12","mt-4"],[1,"image-div","p-1-2"],[1,"tools","text-color","glowing-text"],[1,"heading"],[1,"my-4"],[1,"li-cls"],[1,"image-div","p-2"],[1,"tools","text-color","glowing-text","mt-3"]],template:function(i,c){i&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h3",3)(4,"span",4),r(5),F(6,"uppercase"),o()(),n(7,"div",5),l(8,"img",6)(9,"img",7)(10,"img",8)(11,"img",9)(12,"img",10)(13,"img",11)(14,"img",12)(15,"img",13)(16,"img",14)(17,"img",15)(18,"img",16)(19,"img",17)(20,"img",18),o()(),n(21,"div",19)(22,"div",20)(23,"h4",21)(24,"span",22),r(25),F(26,"uppercase"),o()(),n(27,"ul",23),S(28,qe,2,1,"li",24,k),o()()(),n(30,"div",19)(31,"div",25)(32,"h4",26)(33,"span",22),r(34),F(35,"uppercase"),o()(),n(36,"ul",23),S(37,Qe,2,1,"li",24,k),o(),n(39,"h4",21)(40,"span",22),r(41),F(42,"uppercase"),o()(),n(43,"ul",23),S(44,Ge,2,1,"li",24,k),o()()()()()),i&2&&(a(5),g(N(6,4,"Technical Skills")),a(20),g(N(26,6,"Tools worked")),a(3),j(c.toolsUsed),a(6),g(N(35,8,"Version controls")),a(3),j(c.versionControl),a(4),g(N(42,10,"IDE worked")),a(3),j(c.ideWorked))},dependencies:[X],styles:[".technology-worked[_ngcontent-%COMP%]   .technology[_ngcontent-%COMP%]{display:flex;justify-content:center;color:green;font-family:my-font;margin-top:2rem;animation:slideIn 1s ease-in forwards}.technology-worked[_ngcontent-%COMP%]   .glowing-text[_ngcontent-%COMP%]{font-weight:700;animation:_ngcontent-%COMP%_glow-animation 1.5s ease-in-out infinite;letter-spacing:.25rem;color:#fff}@keyframes _ngcontent-%COMP%_glow-animation{0%{text-shadow:0 0 5px #28a745,0 0 10px #28a745,0 0 15px #28a745,0 0 20px #28a745}50%{text-shadow:0 0 20px #28a745,0 0 30px #28a745,0 0 40px #28a745,0 0 50px #28a745}to{text-shadow:0 0 5px #28a745,0 0 10px #28a745,0 0 15px #28a745,0 0 20px #28a745}}.technology-worked[_ngcontent-%COMP%]   .image-group[_ngcontent-%COMP%]{display:flex;gap:2%;align-items:center;justify-content:center;margin:2rem 0}.technology-worked[_ngcontent-%COMP%]   .image-div[_ngcontent-%COMP%]{border-radius:8px;box-shadow:0 4px 8px #28a7454d,0 0 15px #28a7451a,0 4px 8px #28a7454d,0 0 15px #28a7451a;animation:slideIn 1s ease-in forwards}.technology-worked[_ngcontent-%COMP%]   .object_contain[_ngcontent-%COMP%]{object-fit:contain}.technology-worked[_ngcontent-%COMP%]   .ang-img[_ngcontent-%COMP%]{width:10%}.technology-worked[_ngcontent-%COMP%]   .img-1[_ngcontent-%COMP%], .technology-worked[_ngcontent-%COMP%]   .img-2[_ngcontent-%COMP%]{width:6%}.technology-worked[_ngcontent-%COMP%]   .img-3[_ngcontent-%COMP%]{width:5%}.technology-worked[_ngcontent-%COMP%]   .img-4[_ngcontent-%COMP%]{width:4%}.technology-worked[_ngcontent-%COMP%]   .tools-cls[_ngcontent-%COMP%]{width:7%}.technology-worked[_ngcontent-%COMP%]   .heading[_ngcontent-%COMP%]{display:flex;justify-content:center}.technology-worked[_ngcontent-%COMP%]   .text-color[_ngcontent-%COMP%]{color:#fff}.technology-worked[_ngcontent-%COMP%]   .p-1-2[_ngcontent-%COMP%]{padding:1.15rem 0}"]})}}return e})();var Je=["projectsViewChild"],Ke=["skillsViewChild"],Ye=["contactViewChild"],Ce=(()=>{class e{constructor(t){this.commonService=t}ngOnInit(){this.onResize(this.event),this.commonService.scrollToTarget.subscribe(t=>{console.log(t),this.projectsSection&&t=="projectsViewChild"?this.projectsSection.nativeElement.scrollIntoView({behavior:"smooth"}):this.skillsSection&&t=="skillsViewChild"?this.skillsSection.nativeElement.scrollIntoView({behavior:"smooth"}):this.contactSection&&t=="contactViewChild"&&this.contactSection.nativeElement.scrollIntoView({behavior:"smooth"})}),this.jsonFile=q}onResize(t){this.windowWidth=window.innerWidth,console.log("Window resized, new width:",this.windowWidth),this.windowWidth<=768?this.isMobile=!0:this.isMobile=!1}downloadFile(){let t=document.createElement("a");t.href="/assets/Niranjan_Abathurai_2025.pdf",t.download="Niranjan_Abathurai_2025.pdf",t.click()}static{this.\u0275fac=function(i){return new(i||e)(C(B))}}static{this.\u0275cmp=u({type:e,selectors:[["app-home"]],viewQuery:function(i,c){if(i&1&&(W(Je,5),W(Ke,5),W(Ye,5)),i&2){let d;z(d=D())&&(c.projectsSection=d.first),z(d=D())&&(c.skillsSection=d.first),z(d=D())&&(c.contactSection=d.first)}},hostBindings:function(i,c){i&1&&f("resize",function(y){return c.onResize(y)},!1,O)},decls:61,vars:0,consts:[["skillsViewChild",""],["projectsViewChild",""],["contactViewChild",""],[1,"home-comp"],[1,"row","row-cls"],[1,"col-md-6","col-12","name-cls"],[1,"text-div"],[1,"hey-cls"],[1,"my-name"],[1,"role"],[1,"btn","btn-dark","my-3",3,"click"],[1,"fa","fa-thin","fa-download","icon-cls"],[1,"role","about-cls"],[1,"row","mt-3rem","experience"],[1,"col-4"],[1,"high-txt"],[1,"low-text"],[1,"col-md-6","col-12","second-col"],["id","carouselExample","data-ride","carousel","data-interval","2500",1,"carousel","slide","mt-6rem"],[1,"carousel-inner"],[1,"carousel-item","active"],["src","../../assets/test/angular-inter.png","alt","...",1,"d-block","w-100"],[1,"carousel-item"],["src","../../assets/test/angular_basic.png","alt","...",1,"d-block","w-100"],["src","../../assets/test/infosys_angular.png","alt","...",1,"d-block","w-100"],["src","../../assets/test/infosys_frontend.png","alt","...",1,"d-block","w-100"],[1,"carousel-indicators"],["data-target","#carouselExample","data-slide-to","0",1,"active"],["data-target","#carouselExample","data-slide-to","1"],["data-target","#carouselExample","data-slide-to","2"],["data-target","#carouselExample","data-slide-to","3"],[1,"col-12","bg-black","pt-2rem"],[1,"col-12","bg-black","pt-2rem","pb-4"]],template:function(i,c){if(i&1){let d=M();n(0,"div",3)(1,"div",4)(2,"div",5)(3,"div",6)(4,"p",7),r(5,"Hey, I'm "),o(),n(6,"h1",8),r(7,"Niranjan Abathurai"),o(),n(8,"h4",9),r(9,"Angular Frontend Developer"),o(),n(10,"button",10),f("click",function(){return x(d),v(c.downloadFile())}),l(11,"i",11),r(12,"Download CV "),o()(),n(13,"div")(14,"h5",12),r(15," Hi, I'm Niranjan Abathurai, a Frontend Developer with a deep passion for crafting exceptional user experiences. Specializing in Angular, I\u2019m dedicated to building dynamic, interactive, and responsive web applications that not only perform flawlessly but also engage and delight users. "),o()(),n(16,"div",13)(17,"div",14)(18,"h3",15),r(19,"5+"),o(),n(20,"p",16),r(21,"years experience as UI developer "),o()(),n(22,"div",14)(23,"h3",15),r(24,"4+"),o(),n(25,"p",16),r(26,"Certification as angular developer"),o()(),n(27,"div",14)(28,"h3",15),r(29,"3+"),o(),n(30,"p",16),r(31,"projects worked on and more"),o()()()(),n(32,"div",17)(33,"div",18)(34,"div",19)(35,"div",20),l(36,"img",21),o(),n(37,"div",22),l(38,"img",23),o(),n(39,"div",22),l(40,"img",24),o(),n(41,"div",22),l(42,"img",25),o()(),n(43,"ol",26)(44,"li",27),r(45,"."),o(),n(46,"li",28),r(47,"."),o(),n(48,"li",29),r(49,"."),o(),n(50,"li",30),r(51,"."),o()()()(),n(52,"div",31,0),l(54,"app-technology"),o(),n(55,"div",31,1),l(57,"app-work-experience"),o(),n(58,"div",32,2),l(60,"app-contact"),o()()()}},dependencies:[fe,_e,he],styles:[".home-comp[_ngcontent-%COMP%]{height:100%;background-color:#000}.home-comp[_ngcontent-%COMP%]   .name-cls[_ngcontent-%COMP%]{text-align:center;font-family:MyFont;background-color:#000}@keyframes _ngcontent-%COMP%_slideright{0%{opacity:0;transform:translate(-50%)}to{opacity:1;transform:translate(0)}}.home-comp[_ngcontent-%COMP%]   .hey-cls[_ngcontent-%COMP%]{font-family:light-font;margin:0;font-weight:500;font-size:larger;color:#f5f5f5}.home-comp[_ngcontent-%COMP%]   .my-name[_ngcontent-%COMP%]{font-family:my-font;font-size:xxx-large;font-weight:700;color:#fff}.home-comp[_ngcontent-%COMP%]   .role[_ngcontent-%COMP%]{font-family:regular-font;font-size:x-large;color:#f5f5f5}.home-comp[_ngcontent-%COMP%]   .icon-cls[_ngcontent-%COMP%]{margin:0 .5rem 0 0;width:1rem}.home-comp[_ngcontent-%COMP%]   .btn.btn-dark[_ngcontent-%COMP%]{color:#000;background:green;border:none;border-radius:0;padding:.75rem}.home-comp[_ngcontent-%COMP%]   .btn.btn-dark[_ngcontent-%COMP%]:hover{color:green;background:#fff;animation:_ngcontent-%COMP%_glow-btn-animation 1.5s ease-in-out infinite}.home-comp[_ngcontent-%COMP%]   .row-cls[_ngcontent-%COMP%]{margin:0;height:auto}@media screen and (max-width: 768px){.home-comp[_ngcontent-%COMP%]   .row-cls[_ngcontent-%COMP%]{height:auto}}.home-comp[_ngcontent-%COMP%]   .second-col[_ngcontent-%COMP%]{background-color:#000}.home-comp[_ngcontent-%COMP%]   .text-div[_ngcontent-%COMP%]{padding-top:4rem;animation:_ngcontent-%COMP%_slideright 1s ease-in forwards}.home-comp[_ngcontent-%COMP%]   .about-cls[_ngcontent-%COMP%]{font-size:small;padding:2rem 4rem;animation:_ngcontent-%COMP%_slideright 1s ease-in forwards}.home-comp[_ngcontent-%COMP%]   .experience[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slideright 1s ease-in forwards}@keyframes _ngcontent-%COMP%_glow-btn-animation{0%{box-shadow:0 0 5px #28a745,0 0 10px #28a745,0 0 15px #28a745,0 0 20px #28a745}50%{box-shadow:0 0 20px #28a745,0 0 30px #28a745,0 0 40px #28a745,0 0 50px #28a745}to{box-shadow:0 0 5px #28a745,0 0 10px #28a745,0 0 15px #28a745,0 0 20px #28a745}}@keyframes _ngcontent-%COMP%_slideIn{0%{opacity:0;transform:translateY(-50%)}to{opacity:1;transform:translateY(0)}}.home-comp[_ngcontent-%COMP%]   .bg-black[_ngcontent-%COMP%]{background-color:#000}.home-comp[_ngcontent-%COMP%]   .high-txt[_ngcontent-%COMP%]{font-family:my-font;color:#fff;justify-self:center}.home-comp[_ngcontent-%COMP%]   .low-text[_ngcontent-%COMP%]{font-family:light-font;color:#f5f5f5;font-size:.75rem;justify-self:center;padding:0 2rem}.home-comp[_ngcontent-%COMP%]   .carousel-indicators[_ngcontent-%COMP%]{position:relative!important}.home-comp[_ngcontent-%COMP%]   .carousel-indicators[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{background-color:green}.home-comp[_ngcontent-%COMP%]   .carousel-indicators[_ngcontent-%COMP%]   .active[_ngcontent-%COMP%]{background-color:#006400}.home-comp[_ngcontent-%COMP%]   #carouselExample[_ngcontent-%COMP%]{height:350px;width:70%;place-self:center;animation:_ngcontent-%COMP%_slideleft 1s ease-in forwards}@media screen and (max-width: 768px){.home-comp[_ngcontent-%COMP%]   #carouselExample[_ngcontent-%COMP%]{height:auto;max-height:430px;min-height:290px}}@keyframes _ngcontent-%COMP%_slideleft{0%{opacity:0;transform:translate(50%)}to{opacity:1;transform:translate(0)}}.home-comp[_ngcontent-%COMP%]   #carouselExample[_ngcontent-%COMP%]   .carousel-inner[_ngcontent-%COMP%]{height:350px}@media screen and (max-width: 768px){.home-comp[_ngcontent-%COMP%]   #carouselExample[_ngcontent-%COMP%]   .carousel-inner[_ngcontent-%COMP%]{max-height:430px;height:auto;min-height:225px}}.home-comp[_ngcontent-%COMP%]   .carousel-inner[_ngcontent-%COMP%]{width:100%}.home-comp[_ngcontent-%COMP%]   .carousel-inner[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{object-fit:contain;width:100%;height:100%}.home-comp[_ngcontent-%COMP%]   .mt-3rem[_ngcontent-%COMP%]{margin-top:3rem}.home-comp[_ngcontent-%COMP%]   .mt-6rem[_ngcontent-%COMP%]{margin-top:6rem}.home-comp[_ngcontent-%COMP%]   .my-2rem[_ngcontent-%COMP%]{margin-top:2rem;margin-bottom:2rem}.home-comp[_ngcontent-%COMP%]   .p-4rem[_ngcontent-%COMP%]{padding:4rem}.home-comp[_ngcontent-%COMP%]   .pt-2rem[_ngcontent-%COMP%]{padding-top:2rem}.home-comp[_ngcontent-%COMP%]   .gap-2[_ngcontent-%COMP%]{gap:2rem!important}"]})}}return e})();var Ze=[{path:"",redirectTo:"/home",pathMatch:"full"},{path:"home",component:Ce},{path:"mini-projects",loadChildren:()=>import("./chunk-OYKLIPSH.mjs").then(e=>e.MiniProjectsModule)},{path:"**",redirectTo:"/home"}],xe=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=P({type:e})}static{this.\u0275inj=w({imports:[L.forRoot(Ze),L]})}}return e})();function Xe(e,m){if(e&1){let t=M();n(0,"li",9),f("click",function(){let c=x(t).$implicit,d=p(2);return v(d.onClickItem(c))}),r(1),o()}if(e&2){let t=m.$implicit;a(),g(t)}}function et(e,m){if(e&1&&(n(0,"nav",6)(1,"ul",7),S(2,Xe,2,1,"li",8,k),o()()),e&2){let t=p();a(2),j(t.navItems)}}function tt(e,m){if(e&1){let t=M();n(0,"li",9),f("click",function(){let c=x(t).$implicit,d=p(3);return v(d.onClickItem(c))}),r(1),o()}if(e&2){let t=m.$implicit;a(),g(t)}}function nt(e,m){if(e&1){let t=M();n(0,"ul",15),f("mouseleave",function(){x(t);let c=p(2);return v(c.toggleDropdown(!1))}),_(1,tt,2,1,"li",16),o()}if(e&2){let t=p(2);a(),s("ngForOf",t.navItems)}}function ot(e,m){if(e&1){let t=M();n(0,"nav",10)(1,"div",11)(2,"i",12),f("click",function(){x(t);let c=p();return v(c.toggleDropdown(!c.dropdownVisible))})("mouseover",function(){x(t);let c=p();return v(c.toggleDropdown(!c.dropdownVisible))}),o()(),n(3,"div",13),_(4,nt,2,1,"ul",14),o()()}if(e&2){let t=p();a(4),s("ngIf",t.dropdownVisible)}}var ve=(()=>{class e{constructor(t,i){this.router=t,this.commonService=i,this.navItems=["Home","Skills","Projects","Contact"],this.isMobile=!1,this.dropdownVisible=!1}ngOnInit(){this.onResize(this.event),this.toggleDropdown(!1)}onResize(t){this.windowWidth=window.innerWidth,console.log("Window resized, new width:",this.windowWidth),this.windowWidth<=768?this.isMobile=!0:this.isMobile=!1}toggleDropdown(t){this.dropdownVisible=t}onClickItem(t){console.log(t),this.dropdownVisible=!1,this.commonService.scrollToTarget.next(t.toLowerCase()+"ViewChild")}static{this.\u0275fac=function(i){return new(i||e)(C(R),C(B))}}static{this.\u0275cmp=u({type:e,selectors:[["app-header"]],hostBindings:function(i,c){i&1&&f("resize",function(y){return c.onResize(y)},!1,O)},decls:8,vars:2,consts:[[1,"header-component"],[1,"nav-row"],[1,"name-cls"],["src","../../assets/image.png",1,"img-cls"],["class","navBar-cls",4,"ngIf"],["class","mobile-nav-view",4,"ngIf"],[1,"navBar-cls"],[1,"ul-list"],[1,"list-cls"],[1,"list-cls",3,"click"],[1,"mobile-nav-view"],[1,"mobile-nav"],[1,"fa-solid","fa-bars","hamburger-icon",3,"click","mouseover"],[1,"position-relative"],["class","ul-list",3,"mouseleave",4,"ngIf"],[1,"ul-list",3,"mouseleave"],["class","list-cls",3,"click",4,"ngFor","ngForOf"]],template:function(i,c){i&1&&(n(0,"div",0)(1,"div",1)(2,"div")(3,"p",2),l(4,"img",3),r(5,"Niranjan"),o()(),_(6,et,4,0,"nav",4)(7,ot,5,1,"nav",5),o()()),i&2&&(a(6),s("ngIf",!c.isMobile),a(),s("ngIf",c.isMobile))},dependencies:[A,I],styles:[".header-component[_ngcontent-%COMP%]{padding:0 1rem;background-color:#000;border-bottom:3px solid green;color:#fff}.header-component[_ngcontent-%COMP%]   .nav-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;padding:0}.header-component[_ngcontent-%COMP%]   .name-cls[_ngcontent-%COMP%]{font-size:xx-large;margin:0;padding:.8rem 0 .5rem;font-family:fantasy;letter-spacing:2px;font-family:my-font;display:flex;align-items:center}.header-component[_ngcontent-%COMP%]   .img-cls[_ngcontent-%COMP%]{width:4rem}.header-component[_ngcontent-%COMP%]   .ul-list[_ngcontent-%COMP%]{display:flex;flex-direction:row;list-style:none;margin:0;z-index:99}@media screen and (max-width: 768px){.header-component[_ngcontent-%COMP%]   .ul-list[_ngcontent-%COMP%]{flex-direction:column}}.header-component[_ngcontent-%COMP%]   .list-cls[_ngcontent-%COMP%]{padding:2rem;cursor:pointer;margin:0}.header-component[_ngcontent-%COMP%]   .list-cls[_ngcontent-%COMP%]:hover{background-color:green;box-shadow:inset 0 0 20px 10px #0003}.header-component[_ngcontent-%COMP%]   .mobile-nav-view[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%]{position:relative;padding:.5rem}.header-component[_ngcontent-%COMP%]   .mobile-nav-view[_ngcontent-%COMP%]   .hamburger-icon[_ngcontent-%COMP%]{margin-top:1rem;font-size:1.5rem}.header-component[_ngcontent-%COMP%]   .mobile-nav-view[_ngcontent-%COMP%]   .ul-list[_ngcontent-%COMP%]{padding:0;background-color:gray;position:absolute;right:0;top:1.25rem;width:200px;margin-right:-1rem}.header-component[_ngcontent-%COMP%]   .mobile-nav-view[_ngcontent-%COMP%]   .list-cls[_ngcontent-%COMP%]{padding:1rem 2rem;margin:0;cursor:pointer}.header-component[_ngcontent-%COMP%]   .mobile-nav-view[_ngcontent-%COMP%]   .list-cls[_ngcontent-%COMP%]:hover{background-color:green}"]})}}return e})();var Me=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=u({type:e,selectors:[["app-footer"]],decls:33,vars:0,consts:[[1,"footer-comp"],[1,"row","m-0","pb-3","onScroll"],[1,"col-6"],[1,"high-txt","mt-4","justify-s"],[1,"icon-grp","justify-s",2,"margin-left","1.25rem"],["src","../../assets/nielsen1.png",1,"prj-cls",2,"background-color","white"],["src","../../assets/apple.png",1,"prj-cls"],["src","../../assets/hersheys.png",1,"prj-cls",2,"background-color","white"],[1,"col-6","border-left"],[1,"high-txt","mt-2","justify-s"],[1,"justify-s","d-flex","mt-4"],["href","https://in.linkedin.com/in/niranjan-hari","target","blank",1,"mx-2","li-type"],["src","../../assets/linkedIn.png",1,"icon-cls"],[1,"low-text","mx-2"],["href","mailto:niranjanhari464@gmail.com",1,"mx-2","li-type"],["src","../../assets/gmail.png",1,"icon-cls"],["href","https://github.com/NiranjanAbathurai",1,"mx-2","li-type"],["src","../../assets/github.png",1,"icon-cls"],["href","https://www.instagram.com/niranjanhari",1,"mx-2","li-type"],["src","../../assets/instagram.png",1,"icon-cls"],["href","https://www.facebook.com/niranjan.hari.1",1,"mx-2","li-type"],["src","../../assets/facebook.png",1,"icon-cls"]],template:function(i,c){i&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h6",3),r(4,"Projects worked on"),o(),n(5,"div",4),l(6,"img",5)(7,"img",6)(8,"img",7),o()(),n(9,"div",8)(10,"h6",9),r(11,"Let's connect on"),o(),n(12,"ul",10)(13,"a",11),l(14,"img",12),n(15,"span",13),r(16,"LinkedIn"),o()(),n(17,"a",14),l(18,"img",15),n(19,"span",13),r(20,"Gmail"),o()(),n(21,"a",16),l(22,"img",17),n(23,"span",13),r(24,"Github"),o()(),n(25,"a",18),l(26,"img",19),n(27,"span",13),r(28,"Instagram"),o()(),n(29,"a",20),l(30,"img",21),n(31,"span",13),r(32,"Facebook"),o()()()()()())},styles:[".footer-comp[_ngcontent-%COMP%]{background-color:#000;color:#fff;border-top:3px solid green}.footer-comp[_ngcontent-%COMP%]   .high-txt[_ngcontent-%COMP%]{font-family:my-font}.footer-comp[_ngcontent-%COMP%]   .low-text[_ngcontent-%COMP%]{font-family:light-font!important;vertical-align:middle!important;font-size:.85rem!important}.footer-comp[_ngcontent-%COMP%]   .mt-8[_ngcontent-%COMP%]{margin-top:4rem}.footer-comp[_ngcontent-%COMP%]   .footer-heading[_ngcontent-%COMP%]{margin:auto}.footer-comp[_ngcontent-%COMP%]   .li-type[_ngcontent-%COMP%]{list-style:none!important;cursor:pointer;text-decoration:none;color:#fff}.footer-comp[_ngcontent-%COMP%]   .icon-cls[_ngcontent-%COMP%]{width:1rem;display:inline-flex}.footer-comp[_ngcontent-%COMP%]   .prj-cls[_ngcontent-%COMP%]{width:5rem;object-fit:contain;margin:.25rem 1.25rem 1rem}.footer-comp[_ngcontent-%COMP%]   .justify-s[_ngcontent-%COMP%]{display:flex;justify-self:center;flex-wrap:wrap}.footer-comp[_ngcontent-%COMP%]   .border-left[_ngcontent-%COMP%]{border-left:1px solid white;margin:1rem 0 0}"]})}}return e})();var $=(()=>{class e{constructor(){this.title="app"}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=u({type:e,selectors:[["app-root"]],decls:3,vars:0,template:function(i,c){i&1&&l(0,"app-header")(1,"router-outlet")(2,"app-footer")},dependencies:[oe,ve,Me]})}}return e})();var be=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=P({type:e,bootstrap:[$]})}static{this.\u0275inj=w({providers:[te()],imports:[ee,xe,de]})}}return e})();var at=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=P({type:e,bootstrap:[$]})}static{this.\u0275inj=w({imports:[be,ne]})}}return e})();export{at as a};
