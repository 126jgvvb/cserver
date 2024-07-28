  import React,{useState} from 'react';
  import axios from 'axios';
  import { addNewItem } from '../../../redux/actions';
  import { useDispatch} from 'react-redux';

  export const FileUpload=()=>{
    const [file,setFile]=useState(null);
    const [message,setMessage]=useState(true);
    const dispatch=useDispatch();

    const onChange=e=>{
    //    alert(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    const onSubmit=async e=>{
        e.preventDefault();
        if(!file) alert('No file chosen');

        const Data=new FormData();
        Data.append('file',file);
        Data.append('ID','1234');
      //  alert('hey:=>'+file.name);

        try{
            const response=await axios.post('https://codedserver2-578ef8372d7c.herokuapp.com/upload-file',Data,
               {headers: {'Content-Type':'multipart/form-data'}});
                setMessage('upload successful');
    //            dispatch(addNewItem({name:file.name,path:`certusMealServer/files/${file.name}`}))

        }
        catch(e){
            if(e.response.status===500){
                setMessage('A problem occured with the server');
            }
            else{
                alert(e.response.data.message);
                setMessage(e.response.data.msg);
            }
        }
    }


return(
    <form>
            <div className={'rowItem'}>
                    <form onSubmit={onSubmit}>
                        <input type="file" onChange={onChange} className="uploadBtn" />
                        <input type="submit" onClick={onSubmit} className="doneBtn" value={'Done'}/>     
                        </form>
                        {message!==true && alert(message)}
                    </div>
    </form>
)
  };


