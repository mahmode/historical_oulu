var HOulu = {}

HOulu.init = function(scen, cam, cam2)
{
	console.log("init");
	this._scene = scen;
	this._camera = cam;
	this._camera2 = cam2;
	this._portals = [];
	this._score = 0;
	this._debugPortal = null;
	
	this.paused = true;
	this.currPortal; // accessed from FreeLock.onMouseMove
	$.getJSON( "data/data.json", function( data )
	{
		for (var i = 0; i < data.d.length; i++)
			HOulu._addHistoricalImage(data.d[i], i == data.d.length - 1);
	});
	
	window.addEventListener('keydown', this.onKeyDown, false);
	
	//$("#hud .help").click(function()
	//{
		////$("#hud .help").hide();
	//});
	
	//$("#hud .help .close").click(function()
	//{
		////$("#hud .help").hide();
	//});
}

HOulu.update = function()
{
	if (!Loader.complete) return;
	
	if (!HOulu.currPortal)
	{
		if (HOulu._getNearPortal())
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
}

HOulu.onKeyDown = function(e)
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
				
				$("#hud").show();
				$("#map_border").show();
				//TweenLite.from($("#hud"), .5, {css:{right:"+=100", alpha:0}, ease:Back.easeIn.config(4)});
				return;
			}
			
			if (!HOulu.currPortal)
			{
				HOulu.currPortal = HOulu._getNearPortal();
				if (HOulu.currPortal) // enter portal
				{
					// show historical image
					var img = HOulu.currPortal.targetImage;
					img.material.opacity = 0;
					img.visible = true;
					TweenLite.to(img.material, 2, {opacity: 1, delay: .5});
					
					// set player rotation angle
					yawObject.position.x = img.d.cx;
					yawObject.position.z = img.d.cz;
					TweenLite.to(yawObject.rotation, .5, {y: img.d.cry, ease: Linear.easeOut});
					TweenLite.to(pitchObject.rotation, .5, {x: img.d.crx, ease: Linear.easeOut});
					
					// show the portal panel
					TweenMax.killTweensOf("#portalPanel");
					TweenMax.to($("#portalPanel"), .5, {css:{right:-70}, ease:Back.easeOut.config(1)});
					$("#portalPanel .description").html(img.d.desc);
					
					HOulu._hidePortals();
					
					// hide minimap
					$("#map_border").hide();
					mapPos = 0;
				}
			}
			else // leave portal
			{
				// hide the portal panel
				TweenMax.killTweensOf("#portalPanel");
				TweenMax.to($("#portalPanel"), .5, {css:{right:-700}, ease:Back.easeIn.config(1)});
				
				TweenMax.killTweensOf(HOulu.currPortal.targetImage.material);
				
				if (!HOulu.currPortal.viewed) // score
				{
					HOulu._score ++;
					HOulu.currPortal.viewed = true;
					
					HOulu.currPortal.material.map = THREE.ImageUtils.loadTexture("img/portal_visited.png");
					
					console.log("score: ", HOulu._score);
				}
					
				
				HOulu.currPortal.targetImage.visible = false;
				HOulu.currPortal = null;
				
				HOulu._showPortals();
				
				// show minimap
				$("#map_border").show();
				mapPos = 300;
			}
			break;
		
		case 70: // F
			HOulu._debugPortal.targetImage.position.x -= .2 * Math.cos(yawObject.rotation.y);
			HOulu._debugPortal.targetImage.position.z += .2 * Math.sin(yawObject.rotation.y);
			break;
		
		case 72: // H
			HOulu._debugPortal.targetImage.position.x += .2 * Math.cos(yawObject.rotation.y);
			HOulu._debugPortal.targetImage.position.z -= .2 * Math.sin(yawObject.rotation.y);
			break;
		
		case 84: // T
			HOulu._debugPortal.targetImage.position.x += .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			HOulu._debugPortal.targetImage.position.z -= .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			
			break;
		
		case 71: // G
			HOulu._debugPortal.targetImage.position.x -= .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			HOulu._debugPortal.targetImage.position.z += .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			break;
		
		case 82: // R
			HOulu._debugPortal.targetImage.rotation.y += .02;
			break;
		
		case 89: // Y
			HOulu._debugPortal.targetImage.rotation.y -= .02;
			break;
		
		case 85: // U
			HOulu._debugPortal.targetImage.scale.x = HOulu._debugPortal.targetImage.scale.x + .02;
			HOulu._debugPortal.targetImage.scale.y = HOulu._debugPortal.targetImage.scale.y + .02;
			break;
		
		case 74: // J
			HOulu._debugPortal.targetImage.scale.x = HOulu._debugPortal.targetImage.scale.x - .02;
			HOulu._debugPortal.targetImage.scale.y = HOulu._debugPortal.targetImage.scale.y - .02;
			break;
		
		case 73: // I
			HOulu._debugPortal.targetImage.position.y += .2;
			break;
		
		case 75: // K
			HOulu._debugPortal.targetImage.position.y -= .2;
			break;
		
		case 101: // 5
			//HOulu._debugPortal.position.z -= .2;
			HOulu._debugPortal.position.x += .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			HOulu._debugPortal.position.z -= .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			break;
		
		case 98: // 2
			//HOulu._debugPortal.position.z += .2;
			HOulu._debugPortal.position.x -= .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			HOulu._debugPortal.position.z += .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			break;
		
		case 97: // 1
			HOulu._debugPortal.position.x -= .2 * Math.cos(yawObject.rotation.y);
			HOulu._debugPortal.position.z += .2 * Math.sin(yawObject.rotation.y);
			break;
		
		case 99: // 3
			HOulu._debugPortal.position.x += .2 * Math.cos(yawObject.rotation.y);
			HOulu._debugPortal.position.z -= .2 * Math.sin(yawObject.rotation.y);
			break;
			
		case 88: // x
			HOulu._debugPortal.targetImage.visible = !HOulu._debugPortal.targetImage.visible;
			break;
		
		case 67: // c
			HOulu._debugPortal.position.x = yawObject.position.x;
			HOulu._debugPortal.position.z = yawObject.position.z;
			break;
		
		case 90: // Z
			var template = '{"url":"{url}","px":{px},"pz":{pz},"ix":{ix},"iy":{iy},"iz":{iz},"iry":{iry},"iw":{iw},"ih":{ih},"cx":{cx},"cz":{cz},"crx":{crx},"cry":{cry}, "desc":{desc}}';
			var img = HOulu._debugPortal.targetImage;
			
			console.log(
				template.replace("{url}", img.d.url)
						.replace("{px}", +HOulu._debugPortal.position.x.toFixed(3))
						.replace("{pz}", +HOulu._debugPortal.position.z.toFixed(3))
						.replace("{ix}", +img.position.x.toFixed(3))
						.replace("{iy}", +img.position.y.toFixed(3))
						.replace("{iz}", +img.position.z.toFixed(3))
						.replace("{iry}", +img.rotation.y.toFixed(3))
						.replace("{iw}", +(img.geometry.width * img.scale.x).toFixed(3))
						.replace("{ih}", +(img.geometry.height * img.scale.y).toFixed(3))
						.replace("{cx}", +yawObject.position.x.toFixed(3))
						.replace("{cz}", +yawObject.position.z.toFixed(3))
						.replace("{crx}", +pitchObject.rotation.x.toFixed(3))
						.replace("{cry}", +yawObject.rotation.y.toFixed(3))
						.replace("{desc}", '"' + img.d.desc + '"')
			);
	}
}
	
HOulu._addHistoricalImage = function(data, isLast)
{
	var texture = THREE.ImageUtils.loadTexture(data.url);
	var material = new THREE.MeshBasicMaterial({map:texture, transparent: true});
	var geometry = new THREE.PlaneGeometry(data.iw || 5, data.ih || 5);
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = data.ix || 0;
	mesh.position.y = data.iy || 0;
	mesh.position.z = data.iz || 0;
	mesh.rotation.x = data.irx || 0;
	mesh.rotation.y = data.iry || 0;
	mesh.rotation.z = data.irz || 0;
	mesh.d = data;
	mesh.visible = false;
	HOulu._scene.add(mesh);
	
	var portal = HOulu._addPortal(data.px, data.pz);
	portal.targetImage = mesh;
	
	if (isLast)
	{
		HOulu._debugPortal = portal;
		HOulu._debugPortal.targetImage.visible = true;
	}
}

HOulu._addPortal = function(x, z)
{
	//var loader = new THREE.TextureLoader();
	//loader.load("img/portal.png"
	//, function (texture) // success
	//{
		var texture = THREE.ImageUtils.loadTexture("img/portal.png");
		var material = new THREE.SpriteMaterial({map:texture, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center});
		var portal = new THREE.Sprite( material );
		portal.scale.set(5, 5, 1);
		portal.position.x = x;
		portal.position.y = 13.5;
		portal.position.z = z;
		HOulu._scene.add(portal);
		
		portal.viewed = false;
		
		TweenMax.to(portal.scale, 1, {x: 5.4, y: 5.1, repeat: -1, yoyo: true, ease: Linear.easeInOut});
		
		HOulu._portals.push(portal);
		
		return portal;
	//});
}

HOulu._getNearPortal = function()
{
	for (var i = 0; i < this._portals.length; i++)
	{
		dx = this._portals[i].position.x - yawObject.position.x;
		dz = this._portals[i].position.z - yawObject.position.z;
		
		if (dx*dx + dz*dz < 30)
			return this._portals[i];
	}
	
	return null;
}

HOulu._hidePortals = function()
{
	for (var i = 0; i < this._portals.length; i++)
	{
		if (this._portals[i] != this.currPortal)
			this._portals[i].visible = false;
	}
}

HOulu._showPortals = function()
{
	for (var i = 0; i < this._portals.length; i++)
		this._portals[i].visible = true;
}