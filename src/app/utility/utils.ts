import { KeyValue } from '../common/interfaces/entities/entity';

export default class Utils {
    static idComparer(o1: any, o2: any): boolean {
        if (o1 && o2) {
            return o1 && o2 ? o1.id === o2.id : o2 === o2;
        } else {
            return false;
        }
    }

    static locationComparer(o1: any, o2: any): boolean {
        if (o1 && o2) {
            return o1 && o2 ? o1.location.key === o2.location.key : o2 === o2;
        } else {
            return false;
        }
    }

    static keyValueComparer(o1: KeyValue, o2: KeyValue): boolean {
        if (o1 && o2) {
            return o1 && o2 ? o1.key === o2.key : o2 === o2;
        } else {
            return false;
        }
    }

    static fromEpochToDate(epoch: number): any {
        return new Date(epoch * 1000);
    }
    static fromDateToEpochUnix(date: Date): number {
        return Math.floor(new Date(date).getTime());
    }
    static fromDateToEpoch(date: Date): number {
        return Math.floor(new Date(date).getTime() / 1000);
    }

    public static convertToSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
}

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
