$(function(){
	$("#bnF1").click(function(){
		$("#pConsole").html($("#p1").val()+" "+$("#p2").val()+" "+$("#perc").val()+"<br/>");
	});
	$("#bnF2").click(function(){
		$("#pConsole").html(
			"P : "+"-"+"<br/>"
			+"Ter : "+"-"+"<br/>"
			+"Pop : "+"-"+"<br/>");
	});
	$("#bnFin").click(function(){
		$("input").each(function(){
			$(this).val("");
		});
	});
});