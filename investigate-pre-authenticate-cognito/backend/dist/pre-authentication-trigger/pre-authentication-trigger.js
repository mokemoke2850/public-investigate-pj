var i=async t=>{let{userAttributes:r}=t.request,e=r["custom:last_password_change"];if(!e)return t;let n=new Date(e),a=Math.abs(new Date().getTime()-n.getTime());if(Math.ceil(a/(1e3*60*60*24))<=90)return t;throw new Error("PASSWORD_EXPIRED_ERROR")};export{i as handler};
//# sourceMappingURL=pre-authentication-trigger.js.map
