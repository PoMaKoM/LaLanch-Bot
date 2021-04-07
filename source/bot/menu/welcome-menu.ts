import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../types/my-context';
import {settingsMenu} from './settings-menu';
import {orderStart} from './order-menu';

export const welcomeMenu = new MenuTemplate<MyContext>(context => context.i18n.t('welcome'));

welcomeMenu.url(context => context.i18n.t('menu.instagram'), 'https://www.instagram.com/lunch.grodno/');

welcomeMenu.submenu(context => context.i18n.t('menu.order.button'), 'order', orderStart);

welcomeMenu.submenu(context => '⚙️' + context.i18n.t('menu.settings'), 'settings', settingsMenu);

// welcomeMenu.submenu(() => '', 'hidden', hiddenMenu, {hide: () => true});
