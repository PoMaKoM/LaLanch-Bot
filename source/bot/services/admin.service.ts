export class AdminService {
	public static DEFAULT_ADMINS_LIST: string[] = ['295293455', '720675321', '759505643'];

	public static isAdmin(userId: string): boolean {
		const adminIndex: number = this.DEFAULT_ADMINS_LIST.indexOf(userId);
		return adminIndex >= 0;
	}
}

