import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../types/my-context';
import {settingsMenu} from './settings-menu';

export const welcomeMenu = new MenuTemplate<MyContext>(context => context.i18n.t('welcome'));

welcomeMenu.url('Telegram API Documentation', 'https://core.telegram.org/bots/api');
welcomeMenu.url('Telegraf Documentation', 'https://telegraf.js.org/');
welcomeMenu.url('Inline Menu Documentation', 'https://github.com/EdJoPaTo/telegraf-inline-menu');

welcomeMenu.submenu(context => '⚙️' + context.i18n.t('menu.settings'), 'settings', settingsMenu);
