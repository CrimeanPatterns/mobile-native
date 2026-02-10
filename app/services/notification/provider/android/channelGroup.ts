import {NativeChannelGroup} from './constants';

export class ChannelGroup {
    private readonly groupId: string;

    private readonly name: string;

    constructor(groupId: string, name: string) {
        this.groupId = groupId;
        this.name = name;
    }

    build(): NativeChannelGroup {
        if (!this.groupId) {
            throw new Error('ChannelGroup: Missing required `groupId` property');
        } else if (!this.name) {
            throw new Error('ChannelGroup: Missing required `name` property');
        }

        return {
            groupId: this.groupId,
            name: this.name,
        };
    }
}
