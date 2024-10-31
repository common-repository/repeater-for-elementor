(function($) {
"use strict";
	jQuery(document).ready(function($){
		let id = setTimeout(render_repeater_admin, 2000);
		$("body").on("click",".e-form-submissions-list-table a",function(e){
			let id1 = setTimeout(render_repeater_admin, 3000);
		})
		function render_repeater_admin() {
			$( "td" ).each(function( index ) {
				if( $(this).hasClass("column-primary")){
					var value = $(this).children("a:first").html();
					if(value !== undefined){
						if( value.search("&lt;ol") > -1 ){
							var decoded = $("<div/>").html(value).text();
						   $(this).children("a:first").html(decoded);
						}
					} 
				}else{
					if( $(this).find("a").length > 0){
						var value = $(this).find("a").html();
						if(value !== undefined){
							if( value.search("&lt;ol") > 0 ){
								var decoded = $("<div/>").html(value).text();
							   $(this).find('a').html(decoded);
							}
						}
					   
					}else{
						var value = $(this).html();
						if(value !== undefined){
							if( value.search("&lt;ol") > -1 ){
								var decoded = $("<div/>").html(value).text();
							   $(this).html(decoded);
							}
						}
					   
					}
				}
			});
		  }
	})
})(jQuery);