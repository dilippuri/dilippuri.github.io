var text = "<!DOCTYPE html>" + document.getElementsByTagName('html')[0].innerHTML + "</html>";
text=text.replace(/\s*(\n\s*)+/ig,'').replace(/\s+(?= )/g,'').split("");

var image=new Image(),
	span=$('<span>',{'text':'.'});
$('#fox').append(span);

var span_width=span.width(),
	span_height=span.height();
span.remove();

image.src='firefox.png';
image.onload=function(){
	var cnvs=document.createElement('canvas');
	cnvs.width=image.width;
	cnvs.height=image.height;

	$('body').append(cnvs);

	var ctx=cnvs.getContext('2d');
	ctx.drawImage(image,0,0);
	var per_box=Math.floor(((cnvs.width*cnvs.height)/text.length)),
		ratio=span_height/span_width,
		x_size=Math.sqrt(per_box/ratio),
		y_size=per_box/x_size,
		imageData;

	try { 
		imageData=ctx.getImageData(0,0,cnvs.width,cnvs.height);
		getPoints(imageData);
		$("#download").show();
	} catch(ex) {
		$("#unsupported").show();
	}
	$(cnvs).remove();

	function getPoints(imagedata){
		var i=0,lastSeven='',title=false;
		
		var target_rows=Math.ceil((cnvs.height-2) / y_size)+1,
			target_cols=Math.ceil((cnvs.width-2) / x_size)+1,
			ypad=span_height;
		
		var qcanvas=document.createElement('canvas');
		qcanvas.width=span_width*target_cols;
		qcanvas.height=span_height*target_rows;
		$("#fox").width(span_width*target_cols + "px");
		$('body').append(qcanvas);
		var c = qcanvas.getContext('2d'); // context of the target canvas..
		
		c.fillStyle="#000";
		c.fillRect(0,0,qcanvas.width,qcanvas.height);
		
		for(var y=0;y<cnvs.height-1;y+=y_size){
			var total=0,row=$('<span>').css({'display':'block','height':span_height});
			var ypos = y * span_height / y_size;

			for(var x=0;x<cnvs.width - 1;x+=x_size){
				var color=getColor(imageData,x,y),
				character=(text[i] !== undefined) ? text[i] : "";
				if(character=="<")title=false;
				if(title)color="#fff";
				
				i++;total++;

				$(row).append($("<span>",{
					'style':('color:'+ color + (title ? ";font:bold 18px Courier;" : '')),
					'text':character
					}
				));
				var font_style=title?"bold":"normal";
				var font_size=title?"18px":"16px";

				lastSeven = (lastSeven+character).substr(-7);
				if(lastSeven== "<"+"title"+">")title=true;
				
				c.textBaseline = "bottom";
				c.font = font_style + " " + font_size + " " + "Courier";
				c.fillStyle = color;
				var xpos = x * span_width / x_size; 
				c.fillText(character, xpos, ypos + ypad);
			}
		   $('#fox').append(row);
		}
		var data = qcanvas.toDataURL();
		$("#png").attr('href', data);
		$(qcanvas).remove();
	}
};
  
  /* get the color */
function getColor(imageData, x, y) {
	var x=Math.round(x),
		y=Math.round(y),
		index=(y*imageData.width+x)*4,
		red=imageData.data[index],
		green=imageData.data[index+1],
		blue=imageData.data[index+2],
		alpha=imageData.data[index+3];

	/* Add border around the pixel */
	for(var x2=-1;x2<=1;x2++){
		for(var y2=-1; y2<=1;y2++){
			if(!(x2==0&&y2==0)){
				var index_new=((y+y2)*imageData.width+x+x2)*4;
				imageData.data[index_new]=255;
				imageData.data[index_new+1]=255;
				imageData.data[index_new+2]=255;
				imageData.data[index_new+3]=alpha;
			}
		}
	}
	return "rgb("+red+","+green+","+blue+")";
}