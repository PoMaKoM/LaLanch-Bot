import {deleteMenuFromContext, MenuTemplate} from 'telegraf-inline-menu';
import {MyContext} from '../../types/my-context';

// export const hiddenMenu = new MenuTemplate<MyContext>(() => 'Как ты открыл это меню?');
// hiddenMenu.submenu('Подтверждение', 'conformation', confirmMenuCall(null));

/**
 * @deprecated Пока не успел разработать(((
 */
export function confirmMenuCall(callback: Function | null): MenuTemplate<MyContext> {
	const confirmMenu = new MenuTemplate<MyContext>(() => 'Подтвердите действие');
	confirmMenu.interact('Отмена', 'cancel', {
		do: context => {
			console.log('asd');
			deleteMenuFromContext(context);
			return true;
		}
	});
	confirmMenu.interact('Подтвердить', 'confirm', {
		do: context => {
			console.log('dsa');
			if (callback) {
				callback(context);
			}
			deleteMenuFromContext(context);
			return '.';
		},
		joinLastRow: true
	});
	return confirmMenu;
}
