import {MenuTemplate} from 'telegraf-inline-menu';
import {I18n} from '@edjopato/telegraf-i18n';
import {MyContext} from '../../types/my-context';
import {backButtons} from './core/general-buttons';

const availableLocales = new I18n({directory: 'locales'}).availableLocales();

export const languageMenu = new MenuTemplate<MyContext>(context => context.i18n.t('settings.language'));

languageMenu.select('lang', availableLocales, {
	isSet: (context, key) => context.i18n.locale() === key,
	set: (context, key) => {
		context.i18n.locale(key);
		return true;
	}
});

languageMenu.manualRow(backButtons);
