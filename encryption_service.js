const crypto=require('crypto');
const nodeRSA=require('node-rsa');
const fs=require('fs');

const private_key=fs.readFileSync('certusMealServer/securityKey/private_key2.pem','utf8');

const key_to_use=new nodeRSA(private_key);
key_to_use.setOptions({encryptionScheme:'pkcs1'});

module.exports={
    Decrypt_data:(encrypted_data)=>{
        console.log('^^^^^^^^^^^^^^^^^^'+encrypted_data);
        const decrypted_data=key_to_use.decrypt(encrypted_data,'utf8');
const decrypted_string=decrypted_data.toString('utf8');
console.log('Decrypted data:',decrypted_string);
return JSON.parse(decrypted_data);

//const buffer= Buffer.from(encrypted_data,'base64');
/*const decrypted_data=crypto.privateDecrypt(
    {key:private_key,
        padding:crypto.constants,
        oaepHash:'sha1'
    },
buffer);
*/

/*const aesKey=crypto.privateDecrypt(
    {
        key:private_key,
        padding:crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash:'sha256',
    },
    Buffer.from(encryptedKey,'base64')
);

//decrypting the data
const decipher=crypto.createDecipheriv('aes-256-cfb',aesKey,Buffer.from(iv,'base64'));
let decrypted_data=decipher.update(Buffer.from(encrypted_data,'base64'),'binary','utf8');
decrypted_data+=decipher.final('utf8');
*/


}
}