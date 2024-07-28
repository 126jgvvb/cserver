
export const Navigator=(obj,event)=>{
    alert(event.target.innerHTML);
    if(event.target.innerHTML==='view sessions'){
        obj.dynamicDiv.title='uploads';
          obj.tabConfig.title='uploads';
    }

    else  if(event.target.innerHTML==='vendor'){
        obj.dynamicDiv.title='IO';
          obj.tabConfig.title='IO';
    }

    else  if(event.target.innerHTML==='Admin'){
        obj.dynamicDiv.title='uploads';
          obj.tabConfig.title='uploads';
    }

    else  if(event.target.innerHTML==='behavior'){
        obj.dynamicDiv.title='behavior';
          obj.tabConfig.title='behavior';
    }

    else  if(event.target.innerHTML==='Backup history'|| event.target.innerHTML==='upload file'){
        alert(event.target.innerHTML);
        event.target.className='tab-active';
    }
}