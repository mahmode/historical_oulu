var PortalManager = {}

PortalManager.init = function(data)
{
	this.portals = [];
	this._currPortal;
	
	// create historical images and portals
	for (var i = 0; i < data.length; i++)
		PortalManager._addHistoricalSpot(data[i]);
}

PortalManager.isInsidePortal = function()
{
	return this._currPortal != null;
}

PortalManager.checEnterPortal = function()
{
	this._currPortal = PortalManager.getNearPortal();
	
	if (this._currPortal)
	{
		// remove the portal thumb if exists
		if (this._currPortal.thumb)
		{
			scene.remove(this._currPortal.thumb);
			this._currPortal.thumb = null;
		}
		
		// show historical image
		var img = this._currPortal.targetImage;
		img.material.opacity = 0;
		img.visible = true;
		TweenLite.to(img.material, 2, {opacity: 1, delay: .5});
		
		PortalManager.hidePortals();
		
		return img;
	}
	
	return null;
}

PortalManager.exitPortal = function()
{
	var firstVisit = !this._currPortal.viewed;
	if (firstVisit)
	{
		this._currPortal.viewed = true;
		this._currPortal.material.map = THREE.ImageUtils.loadTexture("img/portal_visited.png");
	}
	
	TweenMax.killTweensOf(this._currPortal.targetImage.material);
	this._currPortal.targetImage.visible = false;
	this._currPortal = null;
	
	PortalManager.showPortals();
	
	return firstVisit;
}

PortalManager.getNearPortal = function(distance2)
{
	distance2 = distance2 || 30;
	
	for (var i = 0; i < this.portals.length; i++)
	{
		dx = this.portals[i].position.x - yawObject.position.x;
		dz = this.portals[i].position.z - yawObject.position.z;
		
		if (dx*dx + dz*dz < distance2)
			return this.portals[i];
	}
	
	return null;
}

PortalManager.hidePortals = function()
{
	for (var i = 0; i < this.portals.length; i++)
	{
		if (this.portals[i] != this._currPortal)
		{
			this.portals[i].visible = false;
			
			if (this.portals[i].thumb)
			{
				scene.remove(this.portals[i].thumb);
				this.portals[i].thumb = null;
			}
		}
	}
}

PortalManager.getCurrentPortal = function()
{
	return this._currPortal;
}

PortalManager.getPortalAt = function(index)
{
	return this.portals[index];
}

PortalManager.showPortals = function()
{
	for (var i = 0; i < this.portals.length; i++)
		this.portals[i].visible = true;
}

PortalManager._addHistoricalSpot = function(data)
{
	var image = PortalManager._addImage(data);
	var portal = PortalManager._addPortal(data.px, data.pz);
	
	portal.targetImage = image;
	this.portals.push(portal);
}

PortalManager._addImage = function(data)
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
	scene.add(mesh);
	
	return mesh;
}

PortalManager._addPortal = function(x, z)
{
	var texture = THREE.ImageUtils.loadTexture("img/portal.png");
	var material = new THREE.SpriteMaterial({map:texture, useScreenCoordinates: false, alignment: THREE.SpriteAlignment.center});
	var portal = new THREE.Sprite( material );
	portal.scale.set(5, 5, 1);
	portal.position.x = x;
	portal.position.y = 13.5;
	portal.position.z = z;
	scene.add(portal);
	
	portal.viewed = false;
	
	TweenMax.to(portal.scale, 1, {x: 5.4, y: 5.1, repeat: -1, yoyo: true, ease: Linear.easeInOut});
	
	return portal;
}

PortalManager._addThumbImage = function(portal)
{
	var texture = THREE.ImageUtils.loadTexture(portal.targetImage.d.url);
	var material = new THREE.MeshBasicMaterial({map:texture, side: THREE.DoubleSide, transparent: true});
	var geometry = new THREE.PlaneGeometry(1.8, 1.8 * portal.targetImage.d.ih / portal.targetImage.d.iw);
	var mesh = new THREE.Mesh( geometry, material );
	mesh.position.x = portal.position.x;
	mesh.position.y = 13.7;
	mesh.position.z = portal.position.z;
	scene.add(mesh);
	
	TweenLite.from(mesh.material, 2, {opacity: 0});
	TweenLite.from(mesh.scale, 2, {x: .1, y:.1});
	
	portal.thumb = mesh;
}

PortalManager.updateRotatingImage = function()
{
	for (var i = 0; i < this.portals.length; i++)
	{
		dx = this.portals[i].position.x - yawObject.position.x;
		dz = this.portals[i].position.z - yawObject.position.z;
		
		if (dx*dx + dz*dz < 120)
		{
			if (!this.portals[i].thumb)
				this._addThumbImage(this.portals[i]);
		}
		else
		{
			if (this.portals[i].thumb)
			{
				scene.remove(this.portals[i].thumb);
				this.portals[i].thumb = null;
			}
		}
	}
	
	for (i = 0; i < this.portals.length; i++)
	{
		if (this.portals[i].thumb)
			this.portals[i].thumb.rotation.y += .02;
	}
}