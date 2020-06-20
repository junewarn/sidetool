browser.storage.local.get("datas").then(gotdatas, onError);

function gotdatas(item){
	if(item.datas==undefined){
	  console.log('未定义');
	}else{
		console.log('成功');
		var storagedata=item.datas;
		console.log(storagedata);
		$.each(storagedata,function(n,value){
			if(value['dataisdefault']){
				var url=value['dataurl'];
				getsidebar(url);
				return;
			}else{
				htmldata='<button class="gettoolpage btn btn-primary" url="'+value['dataurl']+'">'+value['dataname']+'</button>';
				$('#tool').append(htmldata);
				$('.gettoolpage').click(function(){
					var url=$(this).attr('url');
					getsidebar(url);
				});
			}
		})
	}
}


var getsidebar=function(url){
	browser.sidebarAction.setPanel({panel: url});
}
function onError(error) {
  console.log(error);
}

//moz-extension://4397393e-e916-4cb2-8107-fb3f565a4a50/sidevbar/sidebar.html