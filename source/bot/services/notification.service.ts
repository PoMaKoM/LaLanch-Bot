import {AdminService} from './admin.service';
import {Telegraf} from 'telegraf';
import {MyContext} from '../../types/my-context';
import {I18n as TelegrafI18n} from '@edjopato/telegraf-i18n/dist/source/i18n';
import {OrderService} from './order.service';
import {UserService} from './user.service';

export class NotificationService {
	constructor(private bot: Telegraf<MyContext>, private i18n: TelegrafI18n) {
	}

	admins(key: string | null, text?: string) {
		AdminService.DEFAULT_ADMINS_LIST.forEach(async (adminId) => {
			if (key) {
				return await this.bot.telegram.sendMessage(adminId, this.i18n.t('ru', key));
			} else if (text) {
				return await this.bot.telegram.sendMessage(adminId, text);
			} else {
				return console.error('Notification for admins was called incorrectly');
			}
		});
	}

	сbQuery(context: MyContext, text: string) {
		return this.bot.telegram.answerCbQuery(UserService.getUserId(context), text);
	}


	async manager(key: string) {
		const managerId = OrderService.DEFAULT_MANAGER.managerId;
		await this.bot.telegram.sendMessage(managerId, this.i18n.t('ru', key));
	}

	all() {
	}
}
