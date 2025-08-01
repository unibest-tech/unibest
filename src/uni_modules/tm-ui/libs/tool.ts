import { getDefaultColor } from "./colors";

export const covetUniNumber = (n: number | string, defaultUnit = 'rpx'): string => {
    if (typeof n === 'number') {
        return `${n}${defaultUnit}`
    }
    let unit = getUnit(n, defaultUnit);
    let zhi = n.match(/\d+(\.\d+)?/g);
    let real = '0'
    if (zhi) {
        real = zhi[0]
    }
    if (unit === 'rpx' && defaultUnit == 'px') {
        return uni.upx2px(Number(real)).toString() + unit;
    }
    if (unit == 'auto') return unit;
    return real + unit;
}
export const getUnit = (n: string | number, defaultUnit = 'rpx'): string => {
    if (typeof n === 'number') {
        return defaultUnit;
    }
    const unit = n.match(/[a-zA-Z|%|auto]+/g);
    if (!unit || !Array.isArray(unit) || unit?.length === 0) return defaultUnit;
    return unit[0];
}

/**
 * 随机一个uid
 * @param rdix 随机因子
 * @param length 取的长度
 * @param isAddStr 是否限制随机结果中的长度,不允许输出长度
 * @returns String
 */
export function getUid(rdix = 1, length = 12): string {
    let ix = Math.floor(Math.random() * rdix * Math.floor(Math.random() * Date.now())).toString().substring(0, length);
    return ix;
}

export const linearValid = (linear: string[]): string => {
    if (linear.length < 3) return '';
    return `linear-gradient(${linear.join(',')})`
}
export const arrayNumberValid = (border: string | number | Array<string | number>, defaultValue = '0px'): string[] => {
    let zhi: string[] = Array.isArray(border) ? border.map((item: string | number): string => covetUniNumber(item)) : [covetUniNumber(border || defaultValue)];
    if (zhi.length == 0) {
        zhi = [covetUniNumber(defaultValue)]
    } else {
        let diff = 4 - zhi.length;
        zhi = [...zhi, ...Array(diff).fill(zhi[0])]
    }
    return zhi;
}
export const arrayNumber = (border: string | number | Array<string | number>, defaultValue = '0px', len = 2): string[] => {
    let zhi: string[] = Array.isArray(border) ? border.map((item: string | number): string => covetUniNumber(item)) : [covetUniNumber(border || defaultValue)];
    if (zhi.length == 0) {
        zhi = Array(len).fill(covetUniNumber(defaultValue))
    } else {
        let diff = len - zhi.length;
        if (diff < 0) {
            zhi = zhi.slice(0, len)
            diff = 0
        }
        zhi = [...zhi, ...Array(diff).fill(zhi[zhi.length - 1])]
    }
    return zhi;
}

/**
 * 用于margin,padding，border-width的校验
 */
export const arrayNumberValidByStyleMP = (border: string | number | Array<string | number>, defaultValue = '0px'): string[] => {
    let zhi: string[] = Array.isArray(border) ? border.map((item: string | number): string => covetUniNumber(item)) : [covetUniNumber(border || defaultValue)];
    if (zhi.length == 0) {
        zhi = [covetUniNumber(defaultValue)]
    } else if (zhi.length == 2) {
        zhi = [zhi[1], zhi[0]]
    } else if (zhi.length == 3) {
        // 左，上，右
        // [0,1,2]
        // 上 右 下 左
        zhi = [zhi[1], zhi[2], covetUniNumber(defaultValue), zhi[0]]
    } else if (zhi.length == 4) {
        zhi = [zhi[1], zhi[2], zhi[3], zhi[0]]
    }
    return zhi;
}

export const arrayNumberValidByStyleBorderColor = (border: string | Array<string>, defaultValue = 'transparent'): string[] => {
    let zhi: string[] = Array.isArray(border) ? border.map((item: string): string => getDefaultColor(item)) : [getDefaultColor(border || defaultValue)];
    if (zhi.length == 0) {
        zhi = [getDefaultColor(defaultValue)]
    } else if (zhi.length == 2) {
        zhi = [zhi[1], zhi[0]]
    } else if (zhi.length == 3) {
        // 左，上，右
        // [0,1,2]
        // 上 右 下 左
        zhi = [zhi[1], zhi[2], getDefaultColor(defaultValue), zhi[0]]
    } else if (zhi.length == 4) {
        zhi = [zhi[1], zhi[2], zhi[3], zhi[0]]
    }
    return zhi;
}
export const arrayNumberValidByStyleBorderStyle = (border: string | Array<string>, defaultValue = 'none'): string[] => {
    let zhi: string[] = Array.isArray(border) ? border : [border || defaultValue];
    if (zhi.length == 0) {
        zhi = [defaultValue]
    } else if (zhi.length == 2) {
        zhi = [zhi[1], zhi[0]]
    } else if (zhi.length == 3) {
        // 左，上，右
        // [0,1,2]
        // 上 右 下 左
        zhi = [zhi[1], zhi[2], defaultValue, zhi[0]]
    } else if (zhi.length == 4) {
        zhi = [zhi[1], zhi[2], zhi[3], zhi[0]]
    }
    return zhi;
}

/**
 * 深度克隆
 * @param {T} data 待大克隆复制的数据
 * @return {T} any
 */
export function deepClone<T>(data: T): T {
    // 对常见的“非”值，直接返回原来值
    if (data === null || typeof data !== "object") {
        return data;
    }
    if (Array.isArray(data)) {
        const clone: any[] = [];
        for (const item of data) {
            clone.push(deepClone(item));
        }
        return clone as any;
    }
    if (data instanceof Date) {
        return new Date(data.getTime()) as unknown as T;
    }
    if (data instanceof RegExp) {
        const flags = data.flags;
        return new RegExp(data.source, flags) as unknown as T;
    }
    if (typeof data === "function") {
        return data as unknown as T;
    }
    const clone = {} as T;
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            clone[key] = deepClone(data[key]);
        }
    }
    return clone;
}