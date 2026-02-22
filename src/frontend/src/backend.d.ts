import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Store {
    id: bigint;
    url: string;
    reputationScore: bigint;
    city: City;
    name: string;
    averageShippingTime: bigint;
}
export interface Product {
    title: string;
    productUrl: string;
    productID: bigint;
    store: Store;
    imageUrl: string;
    storeCity: City;
    storeName: string;
    price: bigint;
}
export interface City {
    proximityToQom: bigint;
    name: string;
}
export interface backendInterface {
    addCustomStore(name: string, url: string, city: City, averageShippingTime: bigint, reputationScore: bigint): Promise<bigint>;
    addProduct(store: Store, title: string, price: bigint, productUrl: string, imageUrl: string): Promise<void>;
    /**
     * / Initialize hardcoded sellers
     */
    initializeSellers(): Promise<void>;
    searchByProductTitle(title: string): Promise<Array<Product>>;
}
