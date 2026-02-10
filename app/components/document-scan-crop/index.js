import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Card from '../../services/card';
import {Dirs} from '../../services/files';
import CardCapture from '../card/capture';
import DocumentCrop from './crop';

class DocumentScanCrop extends Component {
    static propTypes = {
        accountId: PropTypes.string,
        fileName: PropTypes.string,
        onCapture: PropTypes.func,
    };

    _pictureCapture = React.createRef();

    _documentCrop = React.createRef();

    constructor(props) {
        super(props);

        this.onTakePicture = this.onTakePicture.bind(this);
        this.onCrop = this.onCrop.bind(this);

        this.state = {
            fileName: null,
            localFilePath: null,
            visibleCardCapture: false,
            visibleDocumentCrop: false,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    safeSetState(...args) {
        if (this.mounted) {
            this.setState(...args);
        }
    }

    asyncSetState = (state) =>
        new Promise((resolve) => {
            this.safeSetState(state, () => resolve());
        });

    getLocalPath() {
        const {accountId} = this.props;
        let path = Dirs.images;

        if (accountId) {
            path += `/${accountId}`;
        }

        return `${path}/`;
    }

    getLocalFilePath(localFileName) {
        let {fileName} = this.props;
        let path = this.getLocalPath();

        fileName = localFileName || fileName;
        path += fileName;

        return path;
    }

    capture = () => {
        this.safeSetState({visibleCardCapture: true});
    };

    onTakePicture(imageData) {
        let {uri: arrPath} = imageData;
        const fileName = `Picture-${Date.now()}.jpg`;
        const dstPath = this.getLocalPath();
        const localFilePath = this.getLocalFilePath(fileName);

        arrPath = arrPath.replace('file://', '');

        this.safeSetState({fileName});

        console.log('onTakePicture', imageData);
        console.log('move file', {arrPath, dstPath});

        Card.moveFile(arrPath, dstPath, fileName).then(() => {
            console.log('file moved', {dstPath, fileName, localFilePath});
            setTimeout(
                () =>
                    this.safeSetState({
                        localFilePath,
                        visibleDocumentCrop: true,
                    }),
                500,
            );
        });
    }

    onCrop(filePath) {
        const {onCapture} = this.props;
        const {fileName} = this.state;

        if (_.isFunction(onCapture)) {
            onCapture({fileName, filePath});
        }
    }

    onCloseCardCapture = () => this.asyncSetState({visibleCardCapture: false});

    onCloseDocumentCrop = () => this.asyncSetState({visibleDocumentCrop: false});

    render() {
        const {visibleCardCapture, visibleDocumentCrop, localFilePath} = this.state;

        return (
            <>
                {visibleCardCapture && <CardCapture key='picture-capture' onTakePicture={this.onTakePicture} onClose={this.onCloseCardCapture} />}
                {visibleDocumentCrop && (
                    <DocumentCrop key='document-scan-crop' file={localFilePath} onCrop={this.onCrop} onClose={this.onCloseDocumentCrop} />
                )}
            </>
        );
    }
}

export default DocumentScanCrop;
