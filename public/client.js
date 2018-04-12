$( document ).ready(function() {

$.fn.appendVal = function( TextToAppend ) {
		
		if( $(this).val() == '' ) {
			return $(this).val(TextToAppend);
		} else {
			return $(this).val($(this).val() + ', ' + TextToAppend);
		};
	};

	$('.word').click(function() {

		const text = $(this).text();

		$(this).addClass('disabled');
		$('#inputWords').appendVal(text);
	});

});