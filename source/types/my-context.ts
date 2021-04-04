import {Context as TelegrafContext} from 'telegraf';
import {I18nContext} from '@edjopato/telegraf-i18n';
import {LowdbSync} from 'lowdb';
import {Session} from './session';

export interface MyContext extends TelegrafContext {
	readonly i18n: I18nContext;
	session: Session;
	sessionDB: LowdbSync<Session> | any;
}
