var HOulu = {}

HOulu.init = function(scen, cam)
{
	console.log("init");
	
	this._scene = scen;
	this._camera = cam;
	this._score = 0;
	
	this.paused = true;
	
	$.getJSON( "data/data.json", function( data )
	{
		MiniMap.init(data.d);
		PortalManager.init(data.d);
		EditControls.init(data.d.length);
		EditControls.enable(13);
	});
	
	window.addEventListener('keydown', this._onKeyDown, false);
	
	$("#hud .help").click(function() 
	{ 
		TweenMax.to($("#helpDialog"), .5, {css:{top: 0}, ease:Back.easeOut.config(2)});

	});
	
    $("#close").click(function() 
	{ 
		TweenMax.to($("#helpDialog"), .5, {css:{top: -752}, ease:Back.easeIn.config(2)});

	});
    
    $("#cong_close").click(function() 
	{ 
		TweenMax.to($("#congratulations"), .5, {css:{top: -450}, ease:Back.easeIn.config(2)});
	});

}

HOulu._currTime = 0;

HOulu.update = function()
{
	if (!Loader.complete) return;
	
	//if (performance.now() - this._currTime > 50)
	//{
		//this._currTime = performance.now();
		
		if (!PortalManager.isInsidePortal())
		{
			PortalManager.updateRotatingImage();
			
			if (PortalManager.getNearPortal() && !this.paused)
			{
				if (!$("#pressSpace").is(':visible'))
				{
					$("#pressSpace").show();
					$("#pressSpace").css("opacity", 1);
					TweenMax.to($("#pressSpace"), .7, {alpha: .1, repeat: -1, yoyo: true, ease: Linear.easeNone});
				}
			}
			else
			{
				if ($("#pressSpace").is(':visible'))
				{
					$("#pressSpace").hide();
					TweenMax.killTweensOf($("#pressSpace"));
				}
			}
		}
		else
		{
			if ($("#pressSpace").is(':visible'))
			{
				$("#pressSpace").hide();
				TweenMax.killTweensOf($("#pressSpace"));
			}
		}
		
		MiniMap.update(yawObject.position.x, yawObject.position.z);
	//}
}

HOulu._onKeyDown = function(e)
{
	switch (e.keyCode)
	{
		case 32: // space
			if (!Loader.complete) return;
			
			if (HOulu.paused) // leave splash and start
			{
				HOulu.paused = false;
				
				TweenMax.killTweensOf("#title");
				TweenMax.killTweensOf("#pressStart");
				TweenLite.to($("#title"), .5, {css:{top:"-=100", alpha:0}, ease:Back.easeIn.config(4)});
				TweenLite.to($("#pressStart"), .5, {css:{bottom:"-=100", alpha:0}, ease:Back.easeIn.config(4)});
				
				TweenMax.killTweensOf("#hud");
				TweenMax.to($("#hud"), .5, {css:{top: 0}, ease:Back.easeOut.config(2)});
				
				// show minimap
				TweenLite.to($("#minimap"), .5, {css:{left:50}, ease:Back.easeOut});
				return;
			}
			
			if (!PortalManager.isInsidePortal())
			{
				var img = PortalManager.checEnterPortal();
				if (img) // enter portal
				{
					// set player rotation angle
					yawObject.position.x = img.d.cx;
					yawObject.position.z = img.d.cz;
					TweenLite.to(yawObject.rotation, .5, {y: img.d.cry, ease: Linear.easeOut});
					TweenLite.to(pitchObject.rotation, .5, {x: img.d.crx, ease: Linear.easeOut});
					
					// show the portal panel
					TweenMax.killTweensOf("#portalPanel");
					TweenMax.to($("#portalPanel"), .5, {css:{right:-70}, ease:Back.easeOut.config(1)});
					$("#portalPanel .description").html(img.d.desc);
					
					// hide hud
					TweenMax.killTweensOf("#hud");
					TweenMax.to($("#hud"), .5, {css:{top:-300}, ease:Back.easeIn.config(2)});
					
					// hide minimap
					TweenMax.killTweensOf("#minimap");
					TweenLite.to($("#minimap"), .5, {css:{left:-350}, ease:Back.easeOut});
				}
			}
			else // leave portal
			{
				// hide the portal panel
				TweenMax.killTweensOf("#portalPanel");
				TweenMax.to($("#portalPanel"), .5, {css:{right:-700}, ease:Back.easeIn.config(1)});
				
				// show hud
				TweenMax.killTweensOf("#hud");
				TweenMax.to($("#hud"), .5, {css:{top: 0}, ease:Back.easeOut.config(2)});
				
				if (PortalManager.exitPortal()) // first visit
				{
					HOulu._score ++;
					console.log("score: ", HOulu._score);
				}
				
				// show minimap
				TweenMax.killTweensOf("#minimap");
				TweenLite.to($("#minimap"), .5, {css:{left:50}, ease:Back.easeOut});
			}
			break;
	}
}