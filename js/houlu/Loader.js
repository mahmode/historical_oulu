var Loader = {}

Loader.init = function()
{
	this._numLoaded = 0;
	this.complete = false;
	
	$("#ThreeJS").hide();
}

Loader.updateLoadProgress = function()
{
	if (++this._numLoaded == 3) // done loading
	{
		setTimeout(function()
		{
			$("#loading").hide();
			$("#ThreeJS").show();
			
			$("#title").show();
			$("#pressStart").show();
			TweenLite.from($("#title"), .5, {css:{top:"-=100", alpha:0}, ease:Back.easeOut.config(4), delay:1});
			TweenLite.from($("#pressStart"), .5, {css:{bottom:"-=100", alpha:0}, ease:Back.easeOut.config(4), delay:1
				,onComplete: function()
				{
					TweenMax.to($("#pressStart"), .7, {alpha: .1, repeat: -1, yoyo: true, ease: Linear.easeNone});
				}
			});
			
			
			Loader.complete = true;
		}, 1000);
	}
}