import React,{useState} from 'react';
import axios from 'axios';
import { delExcelFile } from '../../../redux/actions';
import { delAdminFile } from '../../../redux/actions';
import { useDispatch } from 'react-redux';

export const DeleteFile=({ID=1234,filename,path,adminFile})=>{
    const [message,setMessage]=useState(null);
    const dispatch=useDispatch();

const onDelete= ()=>{
    axios.post('https://codedserver2-578ef8372d7c.herokuapp.com/delete-file',{ID:ID,name:filename,path:path}, {headers:{'Content-Type':'application/json'}})
        .then(resp=>{
            alert('file deletion successfull...');
        (adminFile===true) ? dispatch(delAdminFile(filename)) : dispatch(delExcelFile(filename));
        })    
        .catch(e=>{
          if(e.response.status===500){
         setMessage('A problem occured with the server');
    }
    setMessage('Error occured while deleting:'+e.message);
})
}


return(
<div>
<button className='deleteBtn' onClick={onDelete}>Delete</button>
{(message!==null) && alert(message)}
</div>

)
}