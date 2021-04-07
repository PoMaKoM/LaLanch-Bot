import {deleteMenuFromContext, MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../types/my-context';
import {backButton} from './core/general-buttons';
import {OrderService} from '../services/order.service';
import {Order} from '../../types/order';

// export class OrderMenu {
// 	constructor(private orderService: OrderService) {
// 	}
// }

export const orderStart = new MenuTemplate<MyContext>(context => {
	if (OrderService.isOrderStarted) {
		context.session.tempOrder = <Order>OrderService.initNewOrder(context);
		return context.i18n.t('menu.order.start');
	} else {
		return context.i18n.t('menu.order.stop');
	}
});
// export const adminOrderStart = new MenuTemplate<MyContext>(context => context.i18n.t('menu.order.start'));
const orderHotDish = new MenuTemplate<MyContext>(context => context.i18n.t('menu.order.hotDish'));
const orderSoup = new MenuTemplate<MyContext>(context => context.i18n.t('menu.order.soup'));
const orderSalad = new MenuTemplate<MyContext>(context => context.i18n.t('menu.order.salad'));
const orderOther = new MenuTemplate<MyContext>(context => context.i18n.t('menu.order.other'));
const orderCheck = new MenuTemplate<MyContext>(context => {
	if (!OrderService.isOrderStarted) {
		return context.i18n.t('menu.order.stop');
	}

	const answer = [context.i18n.t('menu.order.check')];
	const customer = context.session.tempOrder.customer;
	const hotDish = context.session.tempOrder.hotDish + 1;
	const soup = context.session.tempOrder.soup + 1;
	const salad = context.session.tempOrder.salad + 1;
	const sandwich = context.session.tempOrder.sandwich;
	const dessert = context.session.tempOrder.dessert;
	const bread = context.session.tempOrder.bread;

	if (customer)
		answer.push(`Клиент: ${customer}`);
	answer.push('');
	if (hotDish > 0)
		answer.push(`Горячее №${hotDish}`);
	if (soup > 0)
		answer.push(soup === 1 ? 'Суп дня' : 'Суп недели');
	if (salad > 0)
		answer.push(`Салат №${salad}`);
	if (sandwich)
		answer.push('Перекусонище');
	if (dessert)
		answer.push('Дисерт');
	if (bread)
		answer.push('Хлеб');

	return answer.join('\n');
});
const orderPay = new MenuTemplate<MyContext>(context => {
	if (!OrderService.isOrderStarted) {
		return context.i18n.t('menu.order.stop');
	}
	return {
		text: context.i18n.t('menu.order.pay'),
		parse_mode: 'Markdown'
	};
});

orderStart.submenu((context) => context.i18n.t('menu.next'), 'hotDish', orderHotDish, {
	hide: () => !OrderService.isOrderStarted
});

// Hot dish
const hotDishList = ['Горячее №1', 'Горячее №2', 'Горячее №3', 'Горячее №4'];
let hotDishSelected: number;
orderHotDish.select('type', hotDishList, {
	columns: 1,
	isSet: (context, key) => {
		hotDishSelected = context.session.tempOrder?.hotDish;
		return hotDishList[hotDishSelected] === key;
	},
	set: (context, key) => {
		hotDishSelected = hotDishList[hotDishSelected] === key ? -1 : hotDishList.indexOf(key);
		// @ts-ignore
		context.session.tempOrder.hotDish = hotDishSelected;
		return true;
	}
});
orderHotDish.manual(backButton);
orderHotDish.submenu(context => context.i18n.t('menu.next'), 'soup', orderSoup, {joinLastRow: true});

// Soup
const soupList = ['Суп дня', 'Суп недели'];
let soupSelected: number;
orderSoup.select('type', soupList, {
	columns: 1,
	isSet: (context, key) => {
		soupSelected = context.session.tempOrder.soup;
		return soupList[soupSelected] === key;
	},
	set: (context, key) => {
		soupSelected = soupList[soupSelected] === key ? -1 : soupList.indexOf(key);
		// @ts-ignore
		context.session.tempOrder.soup = soupSelected;
		return true;
	}
});
orderSoup.manual(backButton);
orderSoup.submenu(context => context.i18n.t('menu.next'), 'salad', orderSalad, {joinLastRow: true});

// Salad
const saladList = ['Слат №1', 'Салат №2', 'Салат №3', 'Салат №4'];
let saladSelected: number;
orderSalad.select('type', saladList, {
	columns: 1,
	isSet: (context, key) => {
		saladSelected = context.session.tempOrder.salad;
		return saladList[saladSelected] === key;
	},
	set: (context, key) => {
		saladSelected = saladList[saladSelected] === key ? -1 : saladList.indexOf(key);
		// @ts-ignore
		context.session.tempOrder.salad = saladSelected;
		return true;
	}
});
orderSalad.manual(backButton);
orderSalad.submenu(context => context.i18n.t('menu.next'), 'other', orderOther, {joinLastRow: true});

// Other
let sandwichSelected: boolean;
orderOther.toggle(context => context.i18n.t('order.sandwich$'), 'sandwich', {
	isSet: (context) => {
		sandwichSelected = context.session.tempOrder.sandwich;
		return sandwichSelected;
	},
	set: (context, newState) => {
		sandwichSelected = newState;
		context.session.tempOrder.sandwich = sandwichSelected;
		return true;
	}
});
let dessertSelected: boolean;
orderOther.toggle(context => context.i18n.t('order.dessert$'), 'dessert', {
	isSet: (context) => {
		dessertSelected = context.session.tempOrder.dessert;
		return dessertSelected;
	},
	set: (context, newState) => {
		dessertSelected = newState;
		context.session.tempOrder.dessert = dessertSelected;
		return true;
	}
});
let breadSelected: boolean;
orderOther.toggle(context => context.i18n.t('order.bread$'), 'bread', {
	isSet: (context) => {
		breadSelected = context.session.tempOrder.bread;
		return breadSelected;
	},
	set: (context, newState) => {
		breadSelected = newState;
		context.session.tempOrder.bread = breadSelected;
		return true;
	}
});
orderOther.manual(backButton);
orderOther.submenu(context => context.i18n.t('menu.next'), 'check', orderCheck, {joinLastRow: true});

// Check
orderCheck.manual(backButton);
orderCheck.submenu(context => context.i18n.t('menu.confirm'), 'pay', orderPay, {joinLastRow: true});

// Pay
orderPay.manual(backButton);
orderPay.interact(context => context.i18n.t('menu.confirm'), 'confirm', {
	do: async context => {
		// OrderService.stopReceivingOrders(context.session.tempOrder);
		await context.reply(context.i18n.t('menu.order.success'));
		await deleteMenuFromContext(context);
		return true;
	}
});
