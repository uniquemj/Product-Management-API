
export interface IProduct{
    name: string,
    price: string,
    description ?: string,
    category ?: Array<string>,
    inventory: Number
}