window.jQuery(document).ready(function($){



	// $('#example1').ripples(); // set the ripples effect
	// $('#example2').ripples({
	// 	frecuency : 2000,
	// 	onmousemove : false
	// }); // set the ripples effect

	$('#example1, #example2').on('load', function(){
        $(this).ripples({
          frecuency : 1100
        });
      }).each(function(){
        if(this.complete) {$(this).load();}
      });

});
