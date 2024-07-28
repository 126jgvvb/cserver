import React from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import {useNavigate} from 'react-router-dom'

export const Password_Credentials=()=>{
let deviceID='';
let username='';
let newPassword='';
const navigate=useNavigate();

const onChange1=(e)=>{
    deviceID=e.target.value;
}

const onChange2=(e)=>{
    username=e.target.value;
}

const onChange3=(e)=>{
newPassword=e.target.value;
}


   const onSendCredentials=async (e)=>{
    if(newPassword===''||username==='' || deviceID==='' )return alert('Invalid input...');

    await axios.post('https://codedserver2-578ef8372d7c.herokuapp.com/change-password',{ID:deviceID,newPassword:newPassword})        
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
                                    alert('something went wrong...check your credentials')
                                }
                            })

    }

    return(
        <div>
            <form encType="multipart">
            <label>Enter your deviceID</label>
            <input type="text" name="deviceID" placeholder="a2ed45654fsaxa" onChange={onChange1}></input>
            <label>Enter your username</label>
            <input type="text" name="username" placeholder="name" onChange={onChange2}></input>
            <label>Enter your new password</label>
            <input type="text" name="password" placeholder="1234" onChange={onChange3}></input>
            <div>
                <button className="loginBtn" onClick={onSendCredentials}>change</button>
                </div>
                </form>
        </div>
    )
}