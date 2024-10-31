(function($) {
"use strict";
	jQuery(document).ready(function($){
		var repeater_render = false;
		jQuery( document ).on( 'elementor/popup/show', () => {
			get_repeater_data_name(2);
		} );
		setTimeout(function(){ 
			 get_repeater_data_name(1);
		 }, 200);
		function change_name_and_ids(item,field_end = null,form = null,id_rand = null){
			var datas = JSON.parse(field_end.find(".elementor-field-repeater-data").attr("value"));
			var datas_ids = datas.id;
			datas_ids.push(id_rand);
			datas.id = datas_ids;
			field_end.find(".elementor-field-repeater-data").attr("value",JSON.stringify(datas));		
			item = $(item);
			item.attr("data-id",id_rand);
			$(".elementor-field-group input.elementor-field, .elementor-field-group .elementor-field-option input",item).each(function(){
				var group_class = $(this).closest(".elementor-field-group").attr("class");
				var name = $(this).attr("name");
				var type = $(this).attr("type");
				var id = $(this).attr("id");
				if(group_class != "" && id !== undefined){
					var id_group = id.replace("form-field-","");
					if( group_class.search(id_rand) < 0 ) { //no match
						const regex = /-\d$/gm;
						id_group = id_group.replace(regex, '');
						group_class = group_class.replace("elementor-field-group-"+id_group,"elementor-field-group-"+id_group+"-"+id_rand);
						$(this).closest(".elementor-field-group").attr("class",group_class);
					}						
				}
				var index = $(this).closest(".container-repeater-field").data("step");
				if( type == "radio") {
					$(this).attr("name",name+"["+id_rand+"]");
				}else if(type == 'checkbox'){
					if( !name.match(/\[]/)){
						name = name+"["+id_rand+"]";
					}else{
						name = name.replace("[]","["+id_rand+"][]");
					} 
					$(this).attr("name",name);
				}else if(type == 'file'){ 
					if($(this).attr("multiple") == "multiple"){
						const regex = /\[.*?\]\[/gm;
						name = name.replace(regex,"["+id_rand+"][");
						$(this).attr("name",name);
					}else{
						$(this).attr("name",name+"["+id_rand+"]");
					}
				}else{
					$(this).attr("name",name+"["+id_rand+"]");
				}
				$(this).attr("data-id-repeater",id+"-"+id_rand+"");
			})
			$(".elementor-field-group textarea",item).each(function(){
				var group_class = $(this).closest(".elementor-field-group").attr("class");
				var name = $(this).attr("name");
				var id = $(this).attr("id");
				if(group_class != ""){
					var id_group = id.replace("form-field-","");
					group_class = group_class.replace("elementor-field-group-"+id_group,"elementor-field-group-"+id_group+"-"+id_rand);
					$(this).closest(".elementor-field-group").attr("class",group_class);	
				}
				$(this).attr("name",name+"["+id_rand+"]");
				$(this).attr("id",id+"-"+id_rand+"");
				$(this).attr("data-id-repeater",id+"-"+id_rand+"");
			})
			$(".elementor-field-group select",item).each(function(){
				var group_class = $(this).closest(".elementor-field-group").attr("class");
				var name = $(this).attr("name");
				var id = $(this).attr("id");
				if(group_class != ""){
					var id_group = id.replace("form-field-","");
					group_class = group_class.replace("elementor-field-group-"+id_group,"elementor-field-group-"+id_group+"-"+id_rand);
					$(this).closest(".elementor-field-group").attr("class",group_class);	
				}
				$(this).attr("name",name+"["+id_rand+"]");
				$(this).attr("id",id+"-"+id_rand+"");
				$(this).attr("data-id-repeater",id+"-"+id_rand+"");
			})
			return item;
		}
		function update_conditional_logic(id_rand,form){
			var datas = $(".conditional_logic_data_js",form).attr("value");
			if( datas === undefined){
				var datas = $(".conditional_logic_data_js",form).val();
			}
			if( datas !== undefined){
				datas = jQuery.parseJSON(datas);
				var logic_field = datas;
				var update = false;
				$.each( datas, function( field_key, field_value ) {
					update = true;
					var new_key = field_key+"-"+id_rand;
					var field_logic = [];
					var field_value_condi = {};
					$.each( field_value.datas, function( index,field  ) { 
						var name =field.conditional_logic_id+"-"+id_rand;
						field_logic.push( {conditional_logic_id:name,conditional_logic_operator:field.conditional_logic_operator,conditional_logic_value:field.conditional_logic_value});
					})
					logic_field[new_key] = {display:field_value.display, trigger: field_value.trigger,"datas":field_logic};
					
				});
				if( update ){
					var datas = $(".conditional_logic_data_js",form).attr("value",JSON.stringify(logic_field));
					var datas = $(".conditional_logic_data_js",form).val(JSON.stringify(logic_field));
				}
			}
		}
		function add_repeater_data(button, form){
			var start_field;
			var id_rand = Math.floor(Math.random() * 10000);
			var item = $('<div class="repeater-field-item"><div class="repeater-field-header"></div><div class="repeater-field-content"></div></div>');
			button.prevAll().each(function(index){ 
				var item = $(this).clone();
				if( item.hasClass("elementor-field-type-repeater_start") ) {
					start_field = $(this);
					return false;
				}
			})
			var html_field = get_repeater_data(button,form,id_rand);
			var header = get_repeater_data_header(start_field);
			item.find(".repeater-field-header").append(header);
			item.find(".repeater-field-content").append(html_field);
			button.find(".repeater-field-warp-item").append(item);
			update_repeater_count_header();
			$( ".elementor-field-calculator",button ).each(function( index ) {
				  var formula = $(this).data("formula");
				  var installed = $(this).data("installed");
				  if( installed == "yes"){
				  	return;
				  }
				  var id_repeater = $(this).closest(".container-repeater-field").data("id");
				  var datas = button.find(".elementor-field-repeater-data").attr("value");
				  datas = JSON.parse(datas);
				  $.each( datas.fields, function( index,field  ) {
				  	var name = get_name(field);
				  	formula = formula.replace(name,name+"-"+id_repeater);
				  })
				  $(this).attr("data-formula",formula);
				  $(this).attr("installed","yes");
			});
			update_conditional_logic(id_rand,form);
			$( "input" ).trigger( "done_load_repeater",[item] );
			if (typeof flatpickr !== "undefined") {
				if(!elementor_repeater.wp_is_mobile){
					$(".elementor-time-field.flatpickr-input", html_field).flatpickr({
						enableTime: true,
						noCalendar: true,
						dateFormat: "H:i",
					});
					$(".elementor-date-field.flatpickr-input", html_field).flatpickr();
				}
			}
		}
		function get_name(string) {
		  var name = string.match(/\[.*?\]/gm);
		  return name[0].replace(/\[|\]/gm, '');
		}
		function get_repeater_data(step_field,form,id_rand){
			var text_html = repeater_decodeHtml(step_field.find(".elementor-field-repeater-data-html").val());
			var html_step = change_name_and_ids(text_html,step_field,form,id_rand);
			return html_step;
		}
		function repeater_escapeHtml(str){
		    var map =
		    {
		        '&': '&amp;',
		        '<': '&lt;',
		        '>': '&gt;',
		        '"': '&quot;',
		        "'": '&#039;'
		    };
		    return str.replace(/[&<>"']/g, function(m) {return map[m];});
		}
		function repeater_decodeHtml(str){
		    var map =
		    {
		        '&amp;': '&',
		        '&lt;': '<',
		        '&gt;': '>',
		        '&quot;': '"',
		        '&#039;': "'"
		    };
		    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m) {return map[m];});
		}
		function get_repeater_data_name(type=1){
			var i = 1;
			$(".elementor-field-type-repeater_start").each(function(){
				var installed = $(this).attr("data-intalled");
				if( installed != "ok" ){
					$(this).attr("data-intalled","ok");
					repeater_render = true;
					var html_step = $("<div class='container-repeater-field'></div>");
					var names = [];
					var step_field = "";
					var form ="";
					var elements = $(this).nextAll();
					elements.each(function(index){ 
							var item = $(this).clone();
							if( item.hasClass("elementor-field-type-repeater") ) {
								$(this).attr("data-id",i);
								step_field = $(this);
								form = step_field.closest(".elementor-widget-form");
								$(this).find(".elementor-field-repeater-data").attr("value",JSON.stringify({"count":1,"fields":names,"id":[]}));
								return false;
							}
							$(this).remove();
							html_step.append(item);
							var check_name = null;
							if( item.find("input").attr("name") ) {
								names.push(item.find("input").attr("name"));
							}else if( item.find("textarea").attr("name") ){
								names.push(item.find("textarea").attr("name"));
							}else if( item.find("select").attr("name") ){
								names.push(item.find("select").attr("name"));
							}else{
								names.push(item.find("input").attr("name"));
							}	
					})
					var text_html = "<div class='container-repeater-field'>"+html_step.html()+"</div>";
					text_html = repeater_escapeHtml(text_html);
					step_field.find(".elementor-field-repeater-data-html").val(text_html);
					var initial_rows = 0;
					initial_rows = step_field.find(".elementor-field-repeater-end").data("initial_rows");
					var initial_rows_map_field = step_field.find(".elementor-field-repeater-end").data("initial_rows_map");
					
					
					if($("#form-field-"+initial_rows_map_field).length > 0){
						var initial_rows_map_number = $("#form-field-"+initial_rows_map_field).val();
						$("#form-field-"+initial_rows_map_field).attr("data-repeater",step_field.find(".elementor-field-repeater-end").data("map_id"));
						$("#form-field-"+initial_rows_map_field).attr("repeater_initial_rows","ok");
						initial_rows = initial_rows_map_number;
						step_field.find(".repeater-field-button-add").addClass("hidden");
						step_field.addClass("repeater-remove-toolbar");
					}
					setTimeout(function() {
					for (var j = 0; j < initial_rows; j++) {
						add_repeater_data(step_field.closest(".elementor-field-type-repeater"),form);
					}
					}, 100);
					i++;
				}
			})
		}
		$("body").on("change","[repeater_initial_rows='ok']",function (e){
			var repeater_id = $(this).data("repeater");
			$("."+repeater_id).find(".repeater-field-item").remove();
			var number = $(this).val();
			if(number == ""){
				number = $(this).attr("value");
			}
			for (let i = 0; i < number; i++) {
			  $("."+repeater_id).find(".repeater-field-button-add").click();
			}	
		})
		function get_repeater_data_header(start_field){
			var html_step = start_field.find(".repeater-field-header-data").val();
			return html_step;
		}
		function update_repeater_count_header(){
			$(".elementor-field-repeater-end").each(function(){
					var i = 1;
					$(".repeater-field-item",$(this)).each(function(){
						$(this).find(".repeater-field-header-count").html(i);
						i++;
					})
					var datas = JSON.parse($(this).find(".elementor-field-repeater-data").attr("value"));
					datas.count = i-1;
					$(this).find(".elementor-field-repeater-data").attr("value",JSON.stringify(datas));
			});
		}
		function check_max_row(step_field){
			var max = step_field.find(".elementor-field-repeater-end").data("limit");
			if(max == "" || max < 1){
				max = 999;
			}
			var number_item = $('.repeater-field-item',step_field).length;
			if( number_item >= (max -1 ) ){
				step_field.find(".repeater-field-button-add").addClass("hidden");
			}
			if( number_item >= max ){
				return false;
			}else{
				return true;
			}
		}
		function check_min_row(step_field){
			var min = step_field.find(".elementor-field-repeater-end").data("initial_rows");
			if(min == ""){
				min = 0;
			}
			var number_item = $('.repeater-field-item',step_field).length;
			if( number_item <= min ){
				return false;
			}else{
				return true;
			}
		}
		function removeAR(arr) {
		    var what, a = arguments, L = a.length, ax;
		    while (L > 1 && arr.length) {
		        what = a[--L];
		        while ((ax= arr.indexOf(what)) !== -1) {
		            arr.splice(ax, 1);
		        }
		    }
		    return arr;
		}
	    $("body").on("click",".repeater-field-button-add",function(e){
	    	e.preventDefault();
	    	if( check_max_row($(this).closest(".elementor-field-type-repeater")) ){
				var form = $(this).closest(".elementor-widget-form");
				console.log(form);
	    		add_repeater_data($(this).closest(".elementor-field-type-repeater"),form);
	    	}else{
	    		$(this).addClass('hidden');
	    	}
	    })
	    $("body").on("click",".repeater-field-header-acctions-toogle",function(e){
	    	e.preventDefault();
	    	if( $(this).hasClass("icon-down-open")){
	    		$(this).removeClass("icon-down-open");
	    		$(this).addClass("icon-up-open");
	    	}else{
	    		$(this).addClass("icon-down-open");
	    		$(this).removeClass("icon-up-open");
	    	}
	    	$(this).closest(".repeater-field-item").find(".repeater-field-content").slideToggle("slow");
	    	$(this).closest(".repeater-field-item").find(".repeater-field-header").toggleClass('repeater-content-show');
	    })
	    $("body").on("click",".repeater-field-header-acctions-remove",function(e){
	    	e.preventDefault();
	    	$(this).closest(".elementor-field-type-repeater").find(".repeater-field-button-add").removeClass('hidden');
	    	if( check_min_row($(this).closest(".elementor-field-type-repeater")) ){
	    		var id = $(this).closest(".repeater-field-item").find(".container-repeater-field").data("id");
	    		var datas = JSON.parse($(this).closest(".elementor-field-type-repeater").find(".elementor-field-repeater-data").attr("value"));
				var datas_ids = datas.id;
				datas_ids = removeAR(datas_ids,id);
				datas.id = datas_ids;
				$(this).closest(".elementor-field-type-repeater").find(".elementor-field-repeater-data").attr("value",JSON.stringify(datas));
	    		$(this).closest(".repeater-field-item").remove();
	    	}else{
	    	}
	    	update_repeater_count_header();
	    })
	})
})(jQuery);