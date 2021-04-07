export interface Order extends CustomerInfo {
	salad: -1 | 0 | 1 | 2 | 3;
	soup: -1 | 0 | 1;
	hotDish: -1 | 0 | 1 | 2 | 3;
	sandwich: boolean;
	dessert: boolean
	bread: boolean;
	payed: boolean;
}

export interface CustomerInfo {
	customer: string;
	customerId: string;
}
