import {existsSync, readFileSync} from 'fs';
import {generateUpdateMiddleware} from 'telegraf-middleware-console-time';
import {I18n as TelegrafI18n} from '@edjopato/telegraf-i18n';
import {MenuMiddleware} from 'telegraf-inline-menu';
import {Telegraf} from 'telegraf';
import TelegrafSessionLocal from 'telegraf-session-local';
import {MyContext} from '../types/my-context';
import {welcomeMenu} from './menu/welcome-menu';
import {AdminService} from './services/admin.service';
import {UserService} from './services/user.service';
import {OrderService} from './services/order.service';
import {Order} from '../types/order';
import {NotificationService} from './services/notification.service';

const token = (
	existsSync('/run/secrets/bot-token.txt') && readFileSync('/run/secrets/bot-token.txt', 'utf8').trim()) ||
	(existsSync('bot-token.txt') && readFileSync('bot-token.txt', 'utf8').trim()) ||
	// eslint-disable-next-line @typescript-eslint/dot-notation
	process.env['BOT_TOKEN'];
if (!token) {
	throw new Error('You have to provide the bot-token from @BotFather via file (bot-token.txt) or environment variable (BOT_TOKEN)');
}
const bot = new Telegraf<MyContext>(token);
const orderService = new OrderService();
const menuMiddleware = new MenuMiddleware('/', welcomeMenu);
const localSession = new TelegrafSessionLocal({
	database: 'persist/sessions.json',
	getSessionKey: context => UserService.getUserId(context)
});
const i18n = new TelegrafI18n({
	directory: 'locales',
	defaultLanguage: 'ru',
	defaultLanguageOnMissing: true,
	useSession: true
});
const notificationService = new NotificationService(bot, i18n);

bot.use(localSession.middleware());
bot.use(i18n.middleware());

bot.command('start', async (context: MyContext) => {
	context.session.isAdmin = AdminService.isAdmin(String(context.from?.id));
	return menuMiddleware.replyToContext(context);
});

bot.command('order', async (context: MyContext) => {
	context.session.tempOrder = <Order>OrderService.initNewOrder(context);
	return menuMiddleware.replyToContext(context, '/order/');
});

bot.command('help', async context => context.reply(context.i18n.t('help')));

bot.command('settings', async context => menuMiddleware.replyToContext(context, '/settings/'));

bot.command('takeOrders', async (context: MyContext) => {
	if (AdminService.isAdmin(UserService.getUserId(context))) {
		// @ts-ignore
		// const text: string = context.message?.text;
		// const time = text.replace('/takeOrders ', '');
		// await menuMiddleware.replyToContext(context, '/hidden/conformation/');
		await orderService.startReceivingOrders(context);
	}
});

bot.command('stopOrders', async (context: MyContext) => {
	if (AdminService.isAdmin(UserService.getUserId(context))) {
		// @ts-ignore
		// const text: string = context.message?.text;
		// const time = text.replace('/takeOrders ', '');
		await orderService.stopReceivingOrders(context);
	}
});

bot.use(menuMiddleware.middleware());

bot.catch(error => {
	// if (process.env['NODE_ENV'] !== 'production') {
	// 	notificationService.admins('Error');
	// }
	console.error('telegraf.ts error occurred\n', error);
});

// eslint-disable-next-line @typescript-eslint/dot-notation
if (process.env['NODE_ENV'] !== 'production') {
	// Show what telegram updates (messages, button clicks, ...) are happening (only in development)
	bot.use(generateUpdateMiddleware());
	console.log(menuMiddleware.tree());
} else {
	notificationService.admins('startBot');
}

export async function start(): Promise<void> {
	// The commands you set here will be shown as /commands like /start in your telegram client.
	await bot.telegram.setMyCommands([
		{command: 'start', description: 'Открыть главное меню'},
		{command: 'order', description: 'Сделать новый заказ'},
		{command: 'help', description: 'Показать помощь'},
		{command: 'settings', description: 'Открыть настройки'}
	]);

	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}
