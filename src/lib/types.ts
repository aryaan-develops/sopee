export interface Product {
    id: string;
    _id?: string;
    name: string;
    price: number;
    image: string;
    images?: string[];
    category: string;
    badge?: string;
    rating?: number;
}
