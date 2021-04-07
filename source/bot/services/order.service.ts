import {Order} from '../../types/order';
import low, {LowdbSync} from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import {MyContext} from '../../types/my-context';
import {Manager} from '../../types/manager';
import {UserService} from './user.service';

export class OrderService {
	private ordersDB: LowdbSync<any>;
	public static isOrderStarted = false;
	public static DEFAULT_MANAGER: Manager = {
		managerId: '295293455',
		alpha: '6200081002429',
		prior: '4916989644860685',
		name: 'Роман',
		phone: '+375292668600',
		started: true
	};

	constructor() {
		const file = 'persist/order.json';
		const adapter = new FileSync(file);
		this.ordersDB = low(adapter);

		if (!this.ordersDB.has('orders').value() || !this.ordersDB.has('manager').value()) {
			this.ordersDB.defaults({
				orders: [] as Order[],
				manager: {
					managerId: '',
					prior: '',
					alpha: ''
				} as Manager
			}).write();
		}

		OrderService.isOrderStarted = this.ordersDB.get('manager.started').value();
	}

	public static initNewOrder(context: MyContext): Order {
		return {
			customer: `${context.from?.first_name} ${context.from?.last_name} (@${context.from?.username})`,
			customerId: UserService.getUserId(context),
			bread: true,
			dessert: false,
			sandwich: false,
			salad: -1,
			hotDish: -1,
			soup: -1,
			payed: false
		};
	}

	addNewOrder(order: Order, userId?: string): void {
		if (userId) {
			// @ts-ignore
			const oldOrder = this.ordersDB.get('orders').find({customerId: userId});
			if (oldOrder.value()) {
				oldOrder.assign(order).write();
			}
		} else {
			// @ts-ignore
			this.ordersDB.get('orders').push(order).write();
		}
	}

	removeOrder(customerId: string): void {
		// @ts-ignore
		this.ordersDB.get('orders').remove({customerId}).write();
	}

	async startReceivingOrders(context: MyContext, _time?: string) {
		this.clearOrders();


		// const hour = Number(time.split(':')[0]);
		// const minute = Number(time.split(':')[1]);
		// const date = moment({hour: hour, minute: minute});
		//
		// console.log(date.format());
		// console.log(date.tz('Europe/Minsk'));
		// console.log(date.format());
		//
		// const cronJob = new CronJob({
		// 	cronTime: date,
		//
		// 	onTick: () => {
		// 		console.log('РАБОТАЕТ!');
		// 		cronJob.stop();
		// 	},
		// 	timeZone: '+3'
		// });

		if (context.session.isAdmin) {
			OrderService.isOrderStarted = true;
			this.ordersDB.set('manager', {
				...OrderService.DEFAULT_MANAGER,
				// completionTime: date,
				managerId: UserService.getUserId(context)
			} as Manager).write();
		}

		return context.reply(context.i18n.t('menu.order.takeOrders'));
	}

	async stopReceivingOrders(context: MyContext, _time?: string) {
		// const hour = Number(time.split(':')[0]);
		// const minute = Number(time.split(':')[1]);
		// const date = moment({hour: hour, minute: minute});
		//
		// console.log(date.format());
		// console.log(date.tz('Europe/Minsk'));
		// console.log(date.format());
		//
		// const cronJob = new CronJob({
		// 	cronTime: date,
		//
		// 	onTick: () => {
		// 		console.log('РАБОТАЕТ!');
		// 		cronJob.stop();
		// 	},
		// 	timeZone: '+3'
		// });

		this.ordersDB.set('manager.started', false).write();
		OrderService.isOrderStarted = false;
		// OrderService.addNewOrder(context.session.tempOrder, UserService.getUserId(context));
		context.session.tempOrder = OrderService.initNewOrder(context);


		const orders: Order[] = this.ordersDB.get('orders').value();

		const answer = ['Добрый день', ''];

		orders.forEach(order => {
			if (order.hotDish > 0)
				answer.push(`Горячее №${order.hotDish}`);
			if (order.soup > 0)
				answer.push(order.soup === 1 ? 'Суп дня' : 'Суп недели');
			if (order.salad > 0)
				answer.push(`Салат №${order.salad}`);
			if (order.sandwich)
				answer.push('Перекусонище');
			if (order.dessert)
				answer.push('Дисерт');
			if (order.bread)
				answer.push('Хлеб');
			answer.push('');
		});

		answer.push('+375292668600 Роман');
		answer.push('');
		answer.push('Мостовая 39. 4 этаж. Вход под мостом. Офис IntexSoft');
		answer.push('');
		answer.push('Оплата картой');
		answer.push('');
		answer.push('Комплектацию не ложите пожалуйста');
		return context.reply(answer.join('\n'));
	}

	private clearOrders(): void {
		this.ordersDB.set('orders', []).write();
	}
}
