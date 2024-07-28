import React, { useContext } from "react";
import { auth_context } from "../../loginPage/Auth_service";

export const Credentials=()=>{
let deviceID='';
const {login}=useContext(auth_context);
//const navigate=useNavigate();

const onChange=(e)=>{
    deviceID=e.target.value;
    if(deviceID==='') alert('Invalid input...');
}

   const onSendCredentials=async (e)=>{
    if(deviceID==='')return alert('Invalid input...');
try{
    await login({id:deviceID});
  //  navigate('/homepage');
}
catch(e){
    if(e.status===500){
        alert('Something went wrong with the server...');
    }
    else if(e.status===404){
        alert('cannot connect to the server...');
    }
    else{
        console.log(e.message);
        alert('something went wrong:'+e.message)
    }
}
    
    /*
    await axios.post('http://localhost:2000/admin-auth',{id:deviceID})        
                            .then(response=>{
                                if(response.status===200){
                                    navigate('/homepage');
                                } 
                                })
                            .catch(e=>{
                                if(e.status===500){
                                    alert('Something went wrong with the server...');
                                }
                                else if(e.status===404){
                                    alert('cannot connect to the server...');
                                }
                                else{
                                    console.log(e.message);
                                    alert('something went wrong:'+e.message)
                                }
                            })*/

    }

    return(
        <div>
            <input type="text" placeholder="a2ed45654fsaxa" onChange={onChange}></input>
            <div>
                <button className="loginBtn" onClick={onSendCredentials}>Login</button>
                </div>
        </div>
    )
}