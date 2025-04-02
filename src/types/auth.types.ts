import { Request } from "express"

export interface IUserInfo{
    _id?: string,
    fullname:string,
    email:string,
    password:string,
    role?: string
}   

export interface IAuthCredentials{
    email: string,
    password: string
}

export interface IAuthRequest extends Request{
    user?:Omit<IUserInfo, 'password'|'fullname'>
}
