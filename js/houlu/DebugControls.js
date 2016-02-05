var DebugControls = {}

DebugControls.init = function(count)
{
	this._lastIndex = count - 1 || 0; // last portal index
	this._currIndex = 0;
	this._debugPortal = null;
}

DebugControls.enable = function(index)
{
	// clamp index
	this._currIndex = Math.max(index || 0, 0);
	this._currIndex = Math.min(this._currIndex, this._lastIndex);
	
	if (this._debugPortal != PortalManager.getCurrentPortal())
		this._debugPortal.targetImage.visible = false;
	
	this._debugPortal = PortalManager.getPortalAt(this._currIndex);
	this._debugPortal.targetImage.visible = true;
	
	// move camera to portal position and look at targetImage
	yawObject.position.x = this._debugPortal.position.x;
	yawObject.position.z = this._debugPortal.position.z;
	yawObject.rotation.y = this._debugPortal.targetImage.d.cry;
	pitchObject.rotation.x = this._debugPortal.targetImage.d.crx;
	
	window.addEventListener('keydown', this._onKeyDown, false);
}

DebugControls.disable = function()
{
	window.removeEventListener('keydown', this._onKeyDown, false);
}

DebugControls._onKeyDown = function(e)
{
	switch (e.keyCode)
	{
		case 107: // +
			if (!PortalManager.isInsidePortal())
				DebugControls.enable(DebugControls._currIndex+1);
			break;
		
		case 109: // -
			if (!PortalManager.isInsidePortal())
				DebugControls.enable(DebugControls._currIndex-1);
			break;
		
		case 70: // F
			DebugControls._debugPortal.targetImage.position.x -= .2 * Math.cos(yawObject.rotation.y);
			DebugControls._debugPortal.targetImage.position.z += .2 * Math.sin(yawObject.rotation.y);
			break;
		
		case 72: // H
			DebugControls._debugPortal.targetImage.position.x += .2 * Math.cos(yawObject.rotation.y);
			DebugControls._debugPortal.targetImage.position.z -= .2 * Math.sin(yawObject.rotation.y);
			break;
		
		case 84: // T
			DebugControls._debugPortal.targetImage.position.x += .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			DebugControls._debugPortal.targetImage.position.z -= .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			
			break;
		
		case 71: // G
			DebugControls._debugPortal.targetImage.position.x -= .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			DebugControls._debugPortal.targetImage.position.z += .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			break;
		
		case 82: // R
			DebugControls._debugPortal.targetImage.rotation.y += .02;
			break;
		
		case 89: // Y
			DebugControls._debugPortal.targetImage.rotation.y -= .02;
			break;
		
		case 85: // U
			DebugControls._debugPortal.targetImage.scale.x = DebugControls._debugPortal.targetImage.scale.x + .02;
			DebugControls._debugPortal.targetImage.scale.y = DebugControls._debugPortal.targetImage.scale.y + .02;
			break;
		
		case 74: // J
			DebugControls._debugPortal.targetImage.scale.x = DebugControls._debugPortal.targetImage.scale.x - .02;
			DebugControls._debugPortal.targetImage.scale.y = DebugControls._debugPortal.targetImage.scale.y - .02;
			break;
		
		case 73: // I
			DebugControls._debugPortal.targetImage.position.y += .2;
			break;
		
		case 75: // K
			DebugControls._debugPortal.targetImage.position.y -= .2;
			break;
		
		case 101: // 5
			DebugControls._debugPortal.position.x += .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			DebugControls._debugPortal.position.z -= .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			break;
		
		case 98: // 2
			DebugControls._debugPortal.position.x -= .2 * Math.cos(yawObject.rotation.y + 90 * Math.PI/180);
			DebugControls._debugPortal.position.z += .2 * Math.sin(yawObject.rotation.y + 90 * Math.PI/180);
			break;
		
		case 97: // 1
			DebugControls._debugPortal.position.x -= .2 * Math.cos(yawObject.rotation.y);
			DebugControls._debugPortal.position.z += .2 * Math.sin(yawObject.rotation.y);
			break;
		
		case 99: // 3
			DebugControls._debugPortal.position.x += .2 * Math.cos(yawObject.rotation.y);
			DebugControls._debugPortal.position.z -= .2 * Math.sin(yawObject.rotation.y);
			break;
			
		case 88: // x
			DebugControls._debugPortal.targetImage.visible = !DebugControls._debugPortal.targetImage.visible;
			break;
		
		case 67: // c
			DebugControls._debugPortal.position.x = yawObject.position.x;
			DebugControls._debugPortal.position.z = yawObject.position.z;
			break;
		
		case 90: // Z
			var template = '{"url":"{url}","px":{px},"pz":{pz},"ix":{ix},"iy":{iy},"iz":{iz},"iry":{iry},"iw":{iw},"ih":{ih},"cx":{cx},"cz":{cz},"crx":{crx},"cry":{cry}, "desc":{desc}}';
			var img = DebugControls._debugPortal.targetImage;
			
			console.log(
				template.replace("{url}", img.d.url)
						.replace("{px}", +DebugControls._debugPortal.position.x.toFixed(3))
						.replace("{pz}", +DebugControls._debugPortal.position.z.toFixed(3))
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