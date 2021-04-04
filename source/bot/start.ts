import {existsSync, readFileSync} from 'fs';
import {generateUpdateMiddleware} from 'telegraf-middleware-console-time';
import {I18n as TelegrafI18n} from '@edjopato/telegraf-i18n';
import {MenuMiddleware} from 'telegraf-inline-menu';
import {Telegraf} from 'telegraf';
import * as TelegrafSessionLocal from 'telegraf-session-local';
import {MyContext} from '../types/my-context';
import {welcomeMenu} from './menu/welcome-menu';

const token = (
	existsSync('/run/secrets/bot-token.txt') && readFileSync('/run/secrets/bot-token.txt', 'utf8').trim()) ||
	(existsSync('bot-token.txt') && readFileSync('bot-token.txt', 'utf8').trim()) ||
	// eslint-disable-next-line @typescript-eslint/dot-notation
	process.env['BOT_TOKEN'];
if (!token) {
	throw new Error('You have to provide the bot-token from @BotFather via file (bot-token.txt) or environment variable (BOT_TOKEN)');
}

const bot = new Telegraf<MyContext>(token);

const localSession = new TelegrafSessionLocal({
	database: 'persist/sessions.json',
	getSessionKey: ctx => String(ctx.from?.id)
});

bot.use(localSession.middleware());

const i18n = new TelegrafI18n({
	directory: 'locales',
	defaultLanguage: 'ru',
	defaultLanguageOnMissing: true,
	useSession: true
});

bot.use(i18n.middleware());

// eslint-disable-next-line @typescript-eslint/dot-notation
if (process.env['NODE_ENV'] !== 'production') {
	// Show what telegram updates (messages, button clicks, ...) are happening (only in development)
	bot.use(generateUpdateMiddleware());
}

bot.command('help', async context => context.reply(context.i18n.t('help')));

bot.command('magic', async (context: MyContext) => {
	console.log(context.sessionDB.get('sessions').getById('295293455').value());

	return context.reply(context.i18n.t('magic'));
});

const menuMiddleware = new MenuMiddleware('/', welcomeMenu);
bot.command('start', async context => menuMiddleware.replyToContext(context));
bot.command('settings', async context => menuMiddleware.replyToContext(context, '/settings/'));
bot.use(menuMiddleware.middleware());

bot.catch(error => {
	console.error('telegraf.ts error occured', error);
});

export async function start(): Promise<void> {
	// The commands you set here will be shown as /commands like /start in your telegram client.
	await bot.telegram.setMyCommands([
		{command: 'start', description: 'Открыть главное меню'},
		{command: 'magic', description: 'Тестовая кнопка'},
		{command: 'help', description: 'Показать помощь'},
		{command: 'settings', description: 'Открыть настройки'}
	]);

	await bot.launch();
	console.log(new Date(), 'Bot started as', bot.botInfo?.username);
}
