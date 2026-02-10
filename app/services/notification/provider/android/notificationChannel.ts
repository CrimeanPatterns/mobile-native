import {NativeAndroidChannel, NotificationImportance, Visibility} from './constants';

export class NotificationChannel {
    private readonly channelId: string;

    private readonly name: string;

    private readonly importance: NotificationImportance;

    private description?: string;

    private lightsEnabled?: boolean;

    private vibrationEnabled?: boolean;

    private group?: string;

    private lightColor?: string;

    private showBadge?: boolean;

    private sound?: string; // "sound_file.mp3" for the file "android/app/src/main/res/raw/sound_file.mp3"

    private vibrationPattern?: number[];

    private bypassDnd?: boolean;

    private lockScreenVisibility?: Visibility;

    constructor(channelId: string, name: string, importance: NotificationImportance) {
        this.channelId = channelId;
        this.name = name;
        this.importance = importance;
    }

    setDescription(description: string): NotificationChannel {
        this.description = description;
        return this;
    }

    setLightColor(color: string): NotificationChannel {
        this.lightColor = color;
        return this;
    }

    setLockScreenVisibility(lockScreenVisibility: Visibility): NotificationChannel {
        if (!Object.values(Visibility).includes(lockScreenVisibility)) {
            throw new Error(`AndroidChannel:setLockScreenVisibility Invalid Visibility: ${lockScreenVisibility}`);
        }
        this.lockScreenVisibility = lockScreenVisibility;
        return this;
    }

    setShowBadge(showBadge: boolean): NotificationChannel {
        this.showBadge = showBadge;
        return this;
    }

    setGroup(groupId: string): NotificationChannel {
        this.group = groupId;
        return this;
    }

    setEnableLights(lightsEnabled: boolean): NotificationChannel {
        this.lightsEnabled = lightsEnabled;
        return this;
    }

    setEnableVibration(enableVibration: boolean): NotificationChannel {
        this.vibrationEnabled = enableVibration;
        return this;
    }

    setVibrationPattern(vibrationPattern: number[]): NotificationChannel {
        this.vibrationPattern = vibrationPattern;
        return this;
    }

    setSound(sound: string): NotificationChannel {
        this.sound = sound;
        return this;
    }

    build(): NativeAndroidChannel {
        if (!this.channelId) {
            throw new Error('NotificationChannel: Missing required `channelId` property');
        } else if (!this.importance) {
            throw new Error('NotificationChannel: Missing required `importance` property');
        } else if (!this.name) {
            throw new Error('NotificationChannel: Missing required `name` property');
        }

        return {
            bypassDnd: this.bypassDnd,
            channelId: this.channelId,
            description: this.description,
            group: this.group,
            importance: this.importance,
            lightColor: this.lightColor,
            lightsEnabled: this.lightsEnabled,
            lockScreenVisibility: this.lockScreenVisibility,
            name: this.name,
            showBadge: this.showBadge,
            sound: this.sound,
            vibrationEnabled: this.vibrationEnabled,
            vibrationPattern: this.vibrationPattern,
        };
    }
}
