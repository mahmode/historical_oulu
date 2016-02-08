var MiniMap = function()
{
	
};

MiniMap.init = function()
{
	this._mapX = 0;
	this._mapY = 0;
	this._mapW = 777;
	this._mapH = 741;
	this._markerX = 0;
	this._markerY = 0;
	this._markerPivotX = 20;
	this._markerPivotY = 25;
	this._edge = 50; // padding on the _edge of the map
	this._spotRadius = 8; // radius of portal spot on the map
	this._spotRadiusMod = 0; // used to animate the spot radius
	this._spotRadiusModDir = 1; // used to animate the spot radius
	
	this.worldMinX = -66.3606553032138;
	this.worldMinZ = -300.95091362123924;
	var worldMaxX = 344.37294542232866;
	var worldMaxZ = -23.233253826074243;
	
	var dz = worldMaxZ - this.worldMinZ;
	var dx = worldMaxX - this.worldMinX;
	var l = Math.sqrt(dx*dx+dz*dz); // length of the world top _edge
	this._angle = Math.atan(dz/dx);
	this._cos = Math.cos(this._angle);
	this._sin = Math.sin(this._angle);
	this._scale = 744/l; // 744: length of the map top end (measured on photoshop)
    this._canvas = $("#minimap canvas")[0];
    this._ctx = this._canvas.getContext("2d");
	
	this._ctx.beginPath();
	this._ctx.arc(this._canvas.width * .5,this._canvas.width * .5, this._canvas.width * .5, 0, Math.PI*2, true);
	this._ctx.clip();
	
	this._imgMap = new Image();
	this._imgMap.src = "img/map.jpg";
	this._imgMarker = new Image();
	this._imgMarker.src = "img/map_marker.png";
}

MiniMap.update = function(worldX, worldZ)
{
	this._markerX = (worldX * this._cos + worldZ * this._sin - (this.worldMinX * this._cos + this.worldMinZ * this._sin)) * this._scale;
	this._markerY = (worldZ * this._cos - worldX * this._sin - (this.worldMinZ * this._cos - this.worldMinX * this._sin)) * this._scale;
	
	this._mapX = this._canvas.width * .5 - this._markerX;
	this._mapY = this._canvas.height * .5 - this._markerY;
	
	if (this._mapX < this._canvas.width - this._mapW - this._edge)
		this._mapX = this._canvas.width - this._mapW - this._edge;
	else if (this._mapX > this._edge)
		this._mapX = this._edge;
	
	if (this._mapY < this._canvas.height - this._mapH - this._edge)
		this._mapY = this._canvas.height - this._mapH - this._edge;
	else if (this._mapY > this._edge)
		this._mapY = this._edge;
	
	this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	this._ctx.drawImage(this._imgMap, this._mapX, this._mapY); // draw map
	
	var px, pz, i, d, r;
	this._spotRadiusMod += .12 * this._spotRadiusModDir;
	if (this._spotRadiusMod > 4)
	{
		this._spotRadiusMod = 4;
		this._spotRadiusModDir = -1;
	}
	else if (this._spotRadiusMod < 0)
	{
		this._spotRadiusMod = 0;
		this._spotRadiusModDir = 1;
	}
	
	for (i = 0; i < PortalManager.portals.length; i++)
	{
		d = PortalManager.portals[i].targetImage.d;
		px = this._mapX + (d.px * this._cos + d.pz * this._sin - (this.worldMinX * this._cos + this.worldMinZ * this._sin)) * this._scale;
		pz = this._mapY + (d.pz * this._cos - d.px * this._sin - (this.worldMinZ * this._cos - this.worldMinX * this._sin)) * this._scale;
		r = PortalManager.portals[i].viewed ? this._spotRadius : this._spotRadius + this._spotRadiusMod;
		
		this._ctx.fillStyle = PortalManager.portals[i].viewed ? "#8a8cfe" : "#fdfb7d";
		this._ctx.lineWidth = 3;
		this._ctx.strokeStyle = '#000';
		this._ctx.beginPath();
		this._ctx.arc(px, pz, r, 0, 2 * Math.PI);
		this._ctx.fill();
		this._ctx.stroke();
		  
		//this._ctx.drawImage(PortalManager.portals[i].viewed ? this._imgPortalSpotVisited : this._imgPortalSpot, this._mapX + px - 12, this._mapY + pz - 12); // draw portal spot
	}
	
	this._ctx.save();
	this._ctx.translate(this._mapX + this._markerX, this._mapY + this._markerY);
	this._ctx.rotate(- this._angle - yawObject.rotation.y);
	this._ctx.drawImage(this._imgMarker, -this._markerPivotX, -this._markerPivotY); // draw marker
	this._ctx.restore();
}