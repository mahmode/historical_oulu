var HOulu = {}

HOulu.init = function(scen, cam)
{
	console.log("init");
	var thiz = this;
	var edit = Util.qs("edit");
    
	this._scene = scen;
	this._camera = cam;
	this._score = 0;

	this._numImages = 0;
	this.first_login = false;
	this.paused = true;
	
	if (!edit)
		this._showSplash();
	
	$.getJSON( "data/data.json", function( data )
	{
		thiz._numImages = data.d.length;
		
		MiniMap.init(data.d);
		PortalManager.init(data.d);
		EditControls.init(data.d.length);
		$(".score_panel .score").text("0/" + thiz._numImages);
		
		// edit mode
		if (edit)
		{
			EditControls.enable(edit-1);
			HOulu.paused = false;
			
			// show hud
			TweenMax.killTweensOf("#hud");
			TweenMax.to($("#hud"), .5, {css:{top: 0}, ease:Back.easeOut.config(2)});
			
			// show minimap
			TweenLite.to($("#minimap"), .5, {css:{left:50}, ease:Back.easeOut});
		}
	});
	
	window.addEventListener('keydown', this._onKeyDown, false);
	
	$("#hud .help").click(function() 
	{ 
		var panelY = ($(window).height() - $("#helpDialog").height()) * .5;
		TweenMax.to($("#helpDialog"), .5, {css:{top: panelY }, ease:Back.easeOut});
	});
	
   $("#close").click(function() 
	{ 
        if (HOulu.first_login) 
        {
			HOulu.paused = false;
			
			// show hud
			TweenMax.killTweensOf("#hud");
			TweenMax.to($("#hud"), .5, {css:{top: 0}, ease:Back.easeOut.config(2)});
			
			// show minimap
			TweenLite.to($("#minimap"), .5, {css:{left:50}, ease:Back.easeOut});
        }
		
		TweenMax.to($("#helpDialog"), .5, {css:{top: -1500}, ease:Back.easeIn});
	});
    
    $("#cong_close").click(function() 
	{ 
		TweenMax.to($("#congratulations"), .5, {css:{top: -1500}, ease:Back.easeIn.config(2)});
       // HOulu.paused = false;
	});

}

HOulu._showSplash = function()
{
	$("#title").show();
	$("#pressStart").show();
	TweenLite.from($("#title"), .5, {css:{top:"-=100", alpha:0}, ease:Back.easeOut.config(4), delay:1});
	TweenLite.from($("#pressStart"), .5, {css:{bottom:"-=100", alpha:0}, ease:Back.easeOut.config(4), delay:1
		,onComplete: function()
		{
			TweenMax.to($("#pressStart"), .7, {alpha: .1, repeat: -1, yoyo: true, ease: Linear.easeNone});
		}
	});
}

//HOulu._currTime = 0;
HOulu.update = function()
{
	if (!Loader.complete) return;
	
	//if (performance.now() - this._currTime > 50)
	//{
		//this._currTime = performance.now();
		
		if (!PortalManager.isInsidePortal())
		{
			if (!EditControls.enabled)
			{
				// update thumbnails
				PortalManager.updateRotatingImage();
			
				// update [press space to enter the portal]
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
				HOulu.first_login = true; 
                
				TweenMax.killTweensOf("#title");
				TweenMax.killTweensOf("#pressStart");
				TweenLite.to($("#title"), .5, {css:{top:"-=100", alpha:0}, ease:Back.easeIn.config(4)});
				TweenLite.to($("#pressStart"), .5, {css:{bottom:"-=100", alpha:0}, ease:Back.easeIn.config(4)});
				
				var panelY = ($(window).height() - $("#helpDialog").height()) * .5;
				TweenMax.to($("#helpDialog"), .5, {css:{top: panelY }, ease:Back.easeOut, delay: 1});
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
					
					$(".score_panel .score").text(HOulu._score +"/" + HOulu._numImages);
                    
                    if (HOulu._score == 2)
                    {
						var panelY = ($(window).height() - $("#congratulations").height()) * .5;
						TweenMax.to($("#congratulations"), .5, {css:{top: panelY}, delay: 1, ease:Back.easeOut.config(2)});
                  //  HOulu.paused = true;
                    }
				}
				// show minimap
				TweenMax.killTweensOf("#minimap");
				TweenLite.to($("#minimap"), .5, {css:{left:50}, ease:Back.easeOut});
			}
			break;
	}
}