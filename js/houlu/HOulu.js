var HOulu = {}

HOulu.init = function(scen, cam)
{
	this._scene = scen;
	this._camera = cam;
	this._portals = [];
	this._debugPortal = null;
	
	this.currPortal; // accessed from FreeLock.onMouseMove
	
	$.getJSON( "data/data.json", function( data )
	{
		for (var i = 0; i < data.d.length; i++)
			HOulu._addHistoricalImage(data.d[i], i == data.d.length - 1);
	});
	
	
	
	window.addEventListener('keydown', this.onKeyDown, false);
}

HOulu.update = function()
{
	
}

HOulu.onKeyDown = function(e)
{
	switch (e.keyCode)
	{
		case 32: // space
			if (!HOulu.currPortal)
			{
				HOulu.currPortal = HOulu._getNearPortal();
				if (HOulu.currPortal)
				{
					var img = HOulu.currPortal.targetImage;
					img.material.opacity = 0;
					img.visible = true;
					
					TweenMax.to(img.material, 2, {opacity: 1});
					
					yawObject.position.x = img.d.cx;
					yawObject.position.z = img.d.cz;
					yawObject.rotation.y = img.d.cry;
					pitchObject.rotation.x = img.d.crx;
				}
			}
			else
			{
				TweenMax.killTweensOf(HOulu.currPortal.targetImage.material);
				
				HOulu.currPortal.targetImage.visible = false;
				HOulu.currPortal = null;
			}
			break;
		
		case 70: // F
			HOulu._debugPortal.targetImage.position.x -= .2;
			break;
		
		case 72: // H
			HOulu._debugPortal.targetImage.position.x += .2;
			break;
		
		case 84: // T
			HOulu._debugPortal.targetImage.position.z -= .2;
			break;
		
		case 71: // G
			HOulu._debugPortal.targetImage.position.z += .2;
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
			HOulu._debugPortal.position.z -= .2;
			break;
		
		case 98: // 2
			HOulu._debugPortal.position.z += .2;
			break;
		
		case 97: // 1
			HOulu._debugPortal.position.x -= .2;
			break;
		
		case 99: // 3
			HOulu._debugPortal.position.x += .2;
			break;
		
		case 90: // Z
			var template = '{"url":"{url}","px":"{px}","pz":"{pz}","ix":"{ix}","iy":"{iy}","iz":"{iz}","iry":"{iry}","iw":"{iw}","ih":"{ih}","cx":"{cx}","cz":"{cz}","crx":"{crx}","cry":"{cry}"}';
			
			console.log(
				template.replace("{url}", HOulu._debugPortal.targetImage.d.url)
						.replace("{px}", +HOulu._debugPortal.position.x.toFixed(3))
						.replace("{pz}", +HOulu._debugPortal.position.z.toFixed(3))
						.replace("{ix}", +HOulu._debugPortal.targetImage.position.x.toFixed(3))
						.replace("{iy}", +HOulu._debugPortal.targetImage.position.y.toFixed(3))
						.replace("{iz}", +HOulu._debugPortal.targetImage.position.z.toFixed(3))
						.replace("{iry}", +HOulu._debugPortal.targetImage.rotation.y.toFixed(3))
						.replace("{iw}", +HOulu._debugPortal.targetImage.scale.x.toFixed(3))
						.replace("{ih}", +HOulu._debugPortal.targetImage.scale.y.toFixed(3))
						.replace("{cx}", +yawObject.position.x.toFixed(3))
						.replace("{cz}", +yawObject.position.z.toFixed(3))
						.replace("{crx}", +pitchObject.rotation.x.toFixed(3))
						.replace("{cry}", +yawObject.rotation.y.toFixed(3))
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