$(function() 
{
	 $("#Achievments_List")
	.css( 
	{
	   "background":"rgba(255,255,255,0.5)"
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 },
		width: 600,
		height: 400,
		resizable: false,
		draggable: false
	});
	
	 $("#Achievments")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":"0.9", 
	  "position":"absolute", "top":"100px", "right":"4px"
	}) // adds CSS
    .append("<img width='200' height='120' src='images/Achive.png'/>")
    .button()
	.click( 
		function() 
		{ 
			$("#Achievments_List").dialog("open");
		});
    
    
     $("#Sound")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":"0.9", 
	  "position":"absolute", "top":"4px", "right":"130px"
	}) // adds CSS
    .append("<img width='50' height='100' src='images/Sound.png'/>")
     .button()
      $("#Help")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":"0.9", 
	  "position":"absolute", "top":"4px", "right":"40px"
	}) // adds CSS
    .append("<img width='50' height='100' src='images/Help.png'/>")
    .button()
});