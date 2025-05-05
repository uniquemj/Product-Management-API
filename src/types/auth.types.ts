import { Request } from "express"

export interface UserInfo{
    _id?: string,
    fullname:string,
    email:string,
    password:string,
    role?: string
}   

export interface AuthCredentials{
    email: string,
    password: string
}

export interface AuthRequest extends Request{
    user?:Omit<UserInfo, 'password'|'fullname'>
}

export interface AuthResponse {
    _id: string,
    email: string,
    role: string,
}

export interface Error{
    status: number,
    message: string
}