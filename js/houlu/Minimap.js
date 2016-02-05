var MiniMap = function()
{
	
};

MiniMap.init = function()
{
	this.mapX = 0;
	this.mapY = 0;
	this.mapW = 991;
	this.mapH = 942;
	this.markerX = 0;
	this.markerY = 0;
	this.markerPivotX = 20;
	this.markerPivotY = 25;
	this.edge = 50; // padding on the edge of the map
	
	this.worldMaxX = 344.37294542232866;
	this.worldMinX = -66.3606553032138;
	this.worldMaxZ = -23.233253826074243;
	this.worldMinZ = -300.95091362123924;
	
	var dz = this.worldMaxZ - this.worldMinZ;
	var dx = this.worldMaxX - this.worldMinX;
	var l = Math.sqrt(dx*dx+dz*dz); // length of the world top edge
	this.angle = Math.atan(dz/dx);
	this.cos = Math.cos(this.angle);
	this.sin = Math.sin(this.angle);
	this.scale = 744/l; // 744: length of the map top end (measured on photoshop)
    this.canvas = $("#minimap canvas")[0];
    this.ctx = this.canvas.getContext("2d");
	
	this.ctx.beginPath();
	this.ctx.arc(this.canvas.width * .5,this.canvas.width * .5, this.canvas.width * .5, 0, Math.PI*2, true);
	this.ctx.clip();
	
	this.imgMap = new Image();
	this.imgMap.src = "img/map.jpg";
	this.imgMarker = new Image();
	this.imgMarker.src = "img/map_marker.png";
	this.imgPortalSpot = new Image();
	this.imgPortalSpot.src = "img/portal_spot.png";
	this.imgPortalSpotVisited = new Image();
	this.imgPortalSpotVisited.src = "img/portal_spot_visited.png";
}

MiniMap.update = function(worldX, worldZ)
{
	this.markerX = (worldX * this.cos + worldZ * this.sin - (this.worldMinX * this.cos + this.worldMinZ * this.sin)) * this.scale;
	this.markerY = (worldZ * this.cos - worldX * this.sin - (this.worldMinZ * this.cos - this.worldMinX * this.sin)) * this.scale;
	
	this.mapX = this.canvas.width * .5 - this.markerX;
	this.mapY = this.canvas.height * .5 - this.markerY;
	
	if (this.mapX < this.canvas.width - this.mapW - this.edge)
		this.mapX = this.canvas.width - this.mapW - this.edge;
	else if (this.mapX > this.edge)
		this.mapX = this.edge;
	
	if (this.mapY < this.canvas.height - this.mapH - this.edge)
		this.mapY = this.canvas.height - this.mapH - this.edge;
	else if (this.mapY > this.edge)
		this.mapY = this.edge;
	
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.drawImage(this.imgMap, this.mapX, this.mapY); // draw map
	
	var px, pz, i, d;
	for (i = 0; i < PortalManager.portals.length; i++)
	{
		d = PortalManager.portals[i].targetImage.d;
		px = (d.px * this.cos + d.pz * this.sin - (this.worldMinX * this.cos + this.worldMinZ * this.sin)) * this.scale;
		pz = (d.pz * this.cos - d.px * this.sin - (this.worldMinZ * this.cos - this.worldMinX * this.sin)) * this.scale;
		this.ctx.drawImage(PortalManager.portals[i].viewed ? this.imgPortalSpotVisited : this.imgPortalSpot, this.mapX + px - 12, this.mapY + pz - 12); // draw portal spot
	}
	
	this.ctx.save();
	this.ctx.translate(this.mapX + this.markerX, this.mapY + this.markerY);
	this.ctx.rotate(- this.angle - yawObject.rotation.y);
	this.ctx.drawImage(this.imgMarker, -this.markerPivotX, -this.markerPivotY); // draw marker
	this.ctx.restore();
}