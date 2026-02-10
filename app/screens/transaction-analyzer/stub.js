import Translator from 'bazinga-translator';

import {withTheme} from '../../theme';
import {SpendAnalysisStub} from '../spend-analysis/stub';

@withTheme
class TransactionAnalyzerStub extends SpendAnalysisStub {
    renderHeader = () => {
        const helperSubTitle = Translator.trans('analysis.stub.add-accounts', {}, 'mobile-native');

        return this.createHeader({helperSubTitle, isStub: true});
    };

    renderListFooter = () => null;
}

export default TransactionAnalyzerStub;
