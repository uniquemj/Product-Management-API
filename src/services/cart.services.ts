import Cart from "../models/cart.model"
import User from "../models/user.model"
import { ICart, ICartItem } from "../types/cart.types"
import { ProductRepository } from "../repository/product.repository"
import { AuthRepository } from "../repository/auth.repository"
import { CartRepository } from "../repository/cart.repository"
import createHttpError from "../utils/httpError.utils"
import { Types } from "mongoose"


export class CartServices {
    private readonly productRepository: ProductRepository;
    private readonly authRepository: AuthRepository;
    private readonly cartRepository: CartRepository

    constructor(){
        this.productRepository = new ProductRepository()
        this.authRepository = new AuthRepository()
        this.cartRepository = new CartRepository()
    }

    getCartList = async (userId: string) => {
        const user = await this.authRepository.getUserById(userId)
        if (!user) {
            throw createHttpError.NotFound("User not found.")
        }
        const cart = await this.cartRepository.getCart(userId)
        if(!cart){
            throw createHttpError.NotFound("Cart is Empty")
        }
        return cart
    }

    addToCart = async (productId: string, quantity: number = 1, user_Id: string): Promise<ICart> => {
        const productExist = await this.productRepository.getProductById(productId)

        if (!productExist) {
            throw createHttpError.NotFound("Product Not found")
        }

        const user = await this.authRepository.getUserById(user_Id)

        if (!user) {
            throw createHttpError.NotFound("User Not Found.")
        }

        if (productExist.inventory < 1) {
            throw createHttpError.BadRequest("Product out of stock")
        }

        const cart = await this.cartRepository.getCart(user_Id)

        if (!cart) {
            const result = await this.cartRepository.createCart({
                userId: user._id as unknown as Types.ObjectId,
                items: [
                    {
                        product: {
                            p_id: productExist?._id as unknown as Types.ObjectId,
                            name: productExist?.name,
                            price: productExist?.price,
                        },
                        quantity: quantity
                    }
                ]
            })
            return result as unknown as ICart
        }

        const result = await this.cartRepository.updateQuantity(user_Id, productExist._id as unknown as string)

        if (!result) {
            const cartItem = {
                product: {
                    p_id: productExist?._id,
                    name: productExist?.name,
                    price: productExist?.price,
                },
                quantity: quantity
            }
            const addItem = await this.cartRepository.pushToCart(user_Id, cartItem as unknown as ICartItem)
            return addItem as unknown as ICart
        }

        return result as unknown as ICart

    }

    removeItemFromCart = async (userId: string, productId: string) => {

        const cart = await Cart.findOne({ userId: userId })
        if (!cart) throw createHttpError.BadRequest("Cart not found")

        const productExistInCart = await Cart.findOne({ userId: userId, 'items.product.p_id': productId })

        if (!productExistInCart) throw createHttpError.NotFound("Product not found in cart.")

        const result = await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { items: { 'product.p_id': productId } } },
            { new: true }
        )

        return result
    }

    updateCartQuantity = async (userId: string, productId: string, quantity: number) => {
        const productExist = await Cart.findOne({ userId: userId, 'items.product.p_id': productId })

        if (!productExist) {
            throw createHttpError.BadRequest("Product not found.")
        }


        const result = await Cart.findOneAndUpdate(
            { userId: userId, 'items.product.p_id': productId },
            {
                $inc: { 'items.$.quantity': quantity },
            },
            { new: true }
        )

        result?.items.forEach(async (item) => {
            if (item.quantity < 1) {
                await Cart.findOneAndUpdate(
                    { userId: userId, 'items.product.p_id': productId },
                    { $pull: { items: { 'product.p_id': productId } } }
                )
                return item
            }
        })
    }
}
