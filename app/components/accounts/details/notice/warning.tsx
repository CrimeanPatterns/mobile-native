import {AccountBlockItem, AccountKind} from '../row';
import {AccountNotice} from './index';

type AccountWarningProps = AccountBlockItem<
    AccountKind.warning,
    {
        Title: string;
        Message: string;
    }
>;

class AccountWarning extends AccountNotice<AccountWarningProps> {
    // eslint-disable-next-line class-methods-use-this
    get messageIcon(): string {
        return 'info';
    }

    get baseColor(): string {
        const colors = this.themeColors;

        return colors.blue;
    }
}

export default AccountWarning;
