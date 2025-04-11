import User from "../models/user.model";
import { IAuthCredentials, IUserInfo} from "../types/auth.types";
import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string

export class AuthRepository{

    async getUser(email: string){
        return await User.findOne({email:email})
    }

    async getUserById(id: string){
        return await User.findById(id)
    }

    async loginUser(userCredentials: IAuthCredentials){
        const user = await this.getUser(userCredentials.email) as IUserInfo

        const token = jwt.sign({_id: user._id, email: user.email, role: user.role},JWT_SECRET_KEY,{expiresIn: "1d"} )
        return {token, user: user}
    }
}