

// browser.storage.local.clear().then(setItem, onError);
browser.storage.local.get("datas").then(gotdatas, onError);



$('.save').click(function(){
  adddata(this);
});


$('.del').click(function(obj){
  console.log('删除');
});
$('.clear').click(function(){
  browser.storage.local.clear();
  location.reload(); 
});



function setItem() {
  console.log("OK");
}

function onError(error) {
  console.log(error)
}

function gotdatas(item){
  if(item.datas==undefined){
    console.log('未定义');
  }else{
    var htmldata='';
    var storagedata=item.datas;
    $.each(storagedata,function(n,value){
      var checkedstatus='';
      if(value['dataisdefault']){
        checkedstatus='checked';
      }
      htmldata=htmldata+'<tr><td><input type="text" hidden class="id" value="'+n+'"><input type="text" class="name" value="'+value['dataname']+'" /></td><td><input type="text" class="url" value="'+value['dataurl']+'" id="urlvalidate'+n+'"/></td><td><input type="checkbox" class="isdefault" name="isdefault" '+checkedstatus+'></td><td><div class="btn-group"><div class="edit btn btn-primary">修改</div><div class="del btn btn-primary">删除</div></div></td></tr>';
    });
    $('tbody').append(htmldata);
    $('.edit').click(function(){
      adddata(this);
    });
    $('.del').click(function(){
      deldata(this);
    });
  }
}

$("button").click(function(event){
  event.preventDefault();
});
$('.reloadsidebar').click(function(){
  browser.sidebarAction.setPanel({panel: '../sidebar/sidebar.html'});
});

var adddata=function(obj){
  console.log('新增');
  browser.storage.local.get("datas").then((item)=>{
      if(item.datas==undefined){
        var datas=[];
      }else{
        var datas = item.datas;
      }
      var data=$(obj).parents('tr');
      datas=datagroup(data,datas);
      if(datas instanceof Array){
        browser.storage.local.set({datas:datas}).then(setItem,onError);
        browser.sidebarAction.setPanel({panel: '../sidebar/sidebar.html'});
        location.reload(); 
      }else{
        geturlerror(datas);
      }
      
    }, onError);
}
var deldata=function(obj){
  console.log('删除');
  var id=$(obj).parents('tr').find(".id").val();
  console.log(id);
  browser.storage.local.get("datas").then((item)=>{
      var datas = item.datas;
      datas.splice(id,1);
      browser.storage.local.set({datas:datas}).then(setItem,onError);
      browser.sidebarAction.setPanel({panel: '../sidebar/sidebar.html'});
      location.reload(); 
    }, onError);
}
var datagroup=function(data,datas){
  var datainfos=[];
  datainfos['dataname']=data.find('.name').val();
  datainfos['dataurl']=data.find('.url').val();
  if(!isURL(datainfos['dataurl'])){
    console.log('不是网址');
    return data.find('.url');
  }else{
    datainfos['dataisdefault']=data.find('.isdefault')[0].checked;
    var id=data.find('.id').val();
    if(id==undefined){
      datas.push(datainfos);
    }else{
      datas[id]=datainfos;
    }
    return datas;
  }
  
}

function isURL(str){
  return true;
    return !!str.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g);
}
function geturlerror(obj){
  console.log('不是网址提示');
  var id=$(obj).parents('tr').find('.id').val();
  if(id==undefined){
    id='';
  }
  $(obj).parents('td').attr('class','has-error');
  $(obj).parents('td').append('<label class="control-label" for="urlvalidate'+id+'">不是网址</label>');
}