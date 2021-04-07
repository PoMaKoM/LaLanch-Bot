import {MyContext} from '../../types/my-context';
import {Context} from 'telegraf';

export class UserService {
	public static getUserId(context: MyContext | Context): string {
		return String(context.from?.id);
	}
}
