define(["mvc/tours"],function(a){var b=Backbone.Collection.extend({model:Backbone.Model.extend({defaults:{visible:!0,target:"_parent"}}),fetch:function(b){b=b||{},this.reset(),this.add({id:"analysis",title:"Analyze Data",url:"",tooltip:"Analysis home view"}),this.add({id:"workflow",title:"Workflow",url:"workflow",tooltip:"Chain tools into workflows",disabled:!Galaxy.user.id}),this.add({id:"shared",title:"Shared Data",url:"library/index",tooltip:"Access published resources",menu:[{title:"Data Libraries deprecated",url:"library/index"},{title:"Data Libraries",url:"library/list",divider:!0},{title:"Published Histories",url:"history/list_published"},{title:"Published Workflows",url:"workflow/list_published"},{title:"Published Visualizations",url:"visualization/list_published"},{title:"Published Pages",url:"page/list_published"}]}),b.user_requests&&this.add({id:"lab",title:"Lab",menu:[{title:"Sequencing Requests",url:"requests/index"},{title:"Find Samples",url:"requests/find_samples_index"},{title:"Help",url:b.lims_doc_url}]}),this.add({id:"visualization",title:"Visualization",url:"visualization/list",tooltip:"Visualize datasets",disabled:!Galaxy.user.id,menu:[{title:"New Track Browser",url:"visualization/trackster",target:"_frame"},{title:"Saved Visualizations",url:"visualization/list",target:"_frame"}]}),Galaxy.user.get("is_admin")&&this.add({id:"admin",title:"Admin",url:"admin",tooltip:"Administer this Galaxy",cls:"admin-only"});var c={id:"help",title:"Help",tooltip:"Support, contact, and community hubs",menu:[{title:"Support",url:b.support_url,target:"_blank"},{title:"Search",url:b.search_url,target:"_blank"},{title:"Mailing Lists",url:b.mailing_lists,target:"_blank"},{title:"Videos",url:b.screencasts_url,target:"_blank"},{title:"Wiki",url:b.wiki_url,target:"_blank"},{title:"How to Cite Galaxy",url:b.citation_url,target:"_blank"},{title:"Interactive Tours",onclick:function(){Galaxy.app.display(new a.ToursView)},target:"galaxy_main"}]};if(b.terms_url&&c.menu.push({title:"Terms and Conditions",url:b.terms_url,target:"_blank"}),b.biostar_url&&c.menu.unshift({title:"Ask a question",url:"biostar/biostar_question_redirect",target:"_blank"}),b.biostar_url&&c.menu.unshift({title:"Galaxy Biostar",url:b.biostar_url_redirect,target:"_blank"}),this.add(c),Galaxy.user.id){var d={id:"user",title:"User",cls:"loggedin-only",tooltip:"Account preferences and saved data",menu:[{title:"Logged in as "+Galaxy.user.get("email")},{title:"Preferences",url:"user?cntrller=user",target:"galaxy_main"},{title:"Custom Builds",url:"user/dbkeys",target:"galaxy_main"},{title:"Logout",url:"user/logout",target:"_top",divider:!0},{title:"Saved Histories",url:"history/list",target:"galaxy_main"},{title:"Saved Datasets",url:"dataset/list",target:"galaxy_main"},{title:"Saved Pages",url:"page/list",target:"_top"},{title:"API Keys",url:"user/api_keys?cntrller=user",target:"galaxy_main"}]};b.use_remote_user&&d.menu.push({title:"Public Name",url:"user/edit_username?cntrller=user",target:"galaxy_main"}),this.add(d)}else{var d={id:"user",title:"User",cls:"loggedout-only",tooltip:"Account registration or login",menu:[{title:"Login",url:"user/login",target:"galaxy_main"}]};b.allow_user_creation&&d.menu.push({title:"Register",url:"user/create",target:"galaxy_main"}),this.add(d)}var e=this.get(b.active_view);return e&&e.set("active",!0),(new jQuery.Deferred).resolve().promise()}}),c=Backbone.View.extend({initialize:function(a){this.model=a.model,this.setElement(this._template()),this.$dropdown=this.$(".dropdown"),this.$toggle=this.$(".dropdown-toggle"),this.$menu=this.$(".dropdown-menu"),this.$note=this.$(".dropdown-note"),this.listenTo(this.model,"change",this.render,this)},events:{"click .dropdown-toggle":"_toggleClick"},render:function(){var a=this;return $(".tooltip").remove(),this.$el.attr("id",this.model.id).css({visibility:this.model.get("visible")&&"visible"||"hidden"}),this.model.set("url",this._formatUrl(this.model.get("url"))),this.$note.html(this.model.get("note")||"").removeClass().addClass("dropdown-note").addClass(this.model.get("note_cls")).css({display:this.model.get("show_note")&&"block"||"none"}),this.$toggle.html(this.model.get("title")||"").removeClass().addClass("dropdown-toggle").addClass(this.model.get("cls")).addClass(this.model.get("icon")&&"fa fa-2x "+this.model.get("icon")).addClass(this.model.get("toggle")&&"toggle").addClass(this.model.get("disabled")&&"disabled").attr("target",this.model.get("target")).attr("href",this.model.get("url")).attr("title",this.model.get("tooltip")).tooltip("destroy"),this.model.get("tooltip")&&this.$toggle.tooltip({placement:"bottom"}),this.$dropdown.removeClass().addClass("dropdown").addClass(this.model.get("active")&&"active"),this.model.get("menu")&&this.model.get("show_menu")?(this.$menu.show(),$("#dd-helper").show().off().on("click",function(){$("#dd-helper").hide(),a.model.set("show_menu",!1)})):(a.$menu.hide(),$("#dd-helper").hide()),this.$menu.empty().removeClass("dropdown-menu"),this.model.get("menu")&&(_.each(this.model.get("menu"),function(b){a.$menu.append(a._buildMenuItem(b)),b.divider&&a.$menu.append($("<li/>").addClass("divider"))}),a.$menu.addClass("dropdown-menu"),a.$toggle.append($("<b/>").addClass("caret"))),this},_buildMenuItem:function(a){var b=this;return a=_.defaults(a||{},{title:"",url:"",target:"_parent"}),a.url=b._formatUrl(a.url),$("<li/>").append($("<a/>").attr("href",a.url).attr("target",a.target).html(a.title).on("click",function(c){c.preventDefault(),b.model.set("show_menu",!1),a.onclick?a.onclick():Galaxy.frame.add(a)}))},_toggleClick:function(a){function b(a,b){return $("<div/>").append($("<a/>").attr("href",Galaxy.root+b).html(a)).html()}var c=this,d=this.model;a.preventDefault(),$(".tooltip").hide(),d.trigger("dispatch",function(a){d.id!==a.id&&a.get("menu")&&a.set("show_menu",!1)}),d.get("disabled")?(this.$toggle.popover&&this.$toggle.popover("destroy"),this.$toggle.popover({html:!0,placement:"bottom",content:"Please "+b("login","user/login?use_panels=True")+" or "+b("register","user/create?use_panels=True")+" to use this feature."}).popover("show"),setTimeout(function(){c.$toggle.popover("destroy")},5e3)):d.get("menu")?d.set("show_menu",!0):d.get("onclick")?d.get("onclick")():Galaxy.frame.add(d.attributes)},_formatUrl:function(a){return"string"==typeof a&&-1===a.indexOf("//")&&"/"!=a.charAt(0)?Galaxy.root+a:a},_template:function(){return'<ul class="nav navbar-nav"><li class="dropdown"><a class="dropdown-toggle"/><ul class="dropdown-menu"/><div class="dropdown-note"/></li></ul>'}});return{Collection:b,Tab:c}});
//# sourceMappingURL=../../maps/layout/menu.js.map