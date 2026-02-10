import PropTypes from 'prop-types';
import React from 'react';
import {InteractionManager} from 'react-native';

import {withTheme} from '../../../theme';
import {Html as WebView} from '../../form';
import Message from './message';
import {cssStyles} from './style';

const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

@withTheme
class UserText extends Message {
    static propTypes = {
        ...Message.propTypes,
        body: PropTypes.string.isRequired,
    };

    static defaultProps = {
        ...Message.defaultProps,
    };

    componentDidMount() {
        super.componentDidMount();

        InteractionManager.runAfterInteractions(() => {
            this.setState({longRunningTask: true});
        });
    }

    renderMessage() {
        const {body} = this.props;

        if (this.isInbox()) {
            if (!this.isAutoMessage() && isHTML(body)) {
                const {longRunningTask} = this.state;
                const {backgroundColor, color} = this.getMessageColors();

                return (
                    longRunningTask && (
                        <WebView
                            content={body}
                            cssStyles={`
                                ${cssStyles}
                                * {
                                    color: ${color};
                                    background-color: ${backgroundColor};
                                }
                                body {
                                    background-color: ${backgroundColor};
                                }
                            `}
                        />
                    )
                );
            }
        }

        return super.renderMessage();
    }
}

export default UserText;
