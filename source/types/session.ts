import {Order} from './order';

export interface Session {
	isAdmin: boolean;
	tempOrder: Order;
}
