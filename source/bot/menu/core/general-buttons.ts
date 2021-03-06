import {createBackMainMenuButtons} from 'telegraf-inline-menu';
import {MyContext} from '../../../types/my-context';

export const backButtons = createBackMainMenuButtons<MyContext>(
	context => context.i18n.t('menu.back'),
	context => context.i18n.t('menu.main')
);
