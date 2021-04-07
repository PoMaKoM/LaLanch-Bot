import {createBackMainMenuButtons} from 'telegraf-inline-menu';
import {MyContext} from '../../../types/my-context';
import {ConstOrContextPathFunc} from 'telegraf-inline-menu/dist/source/generic-types';
import {CallbackButtonTemplate} from 'telegraf-inline-menu/dist/source/keyboard';

export const backButton = createBackButton<MyContext>(
	context => context.i18n.t('menu.back')
);

export function createBackButton<MyContext>(
	backButtonText: ConstOrContextPathFunc<MyContext, string> = '⬅ back'):
	(context: MyContext, path: string) => Promise<CallbackButtonTemplate> {
	return async (context, path) => {
		return {
			text: typeof backButtonText === 'function' ? await backButtonText(context, path) : backButtonText,
			relativePath: '..'
		} as CallbackButtonTemplate;
	};
}

export const backButtons = createBackMainMenuButtons<MyContext>(
	context => context.i18n.t('menu.back'),
	context => context.i18n.t('menu.main')
);
