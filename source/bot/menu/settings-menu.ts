import {MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../types/my-context';
import {languageMenu} from './language-menu';
import {backButtons} from './core/general-buttons';

export const settingsMenu = new MenuTemplate<MyContext>(context => context.i18n.t('settings.body'));

settingsMenu.submenu(context => '🏳️‍🌈' + context.i18n.t('menu.language'), 'lang', languageMenu);

settingsMenu.manualRow(backButtons);
