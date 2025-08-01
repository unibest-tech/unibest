type rgb = {
    r: number,
    g: number,
    b: number,
    a: number
}
type hsla = {
    h: number,
    s: number,
    l: number,
    a: number
}

/**
 * 颜色值列表
 */
export const colors = new Map<string, string>([
    ['primary', '#0579FF'],
    ['success', '#07d73d'],
    ['danger', '#ff6411'],
    ['warn', '#ffa61e'],
    ['error', '#f10226'],
    ['info', '#F2F2F2'],

    ['kleinblue', '#002FA7'], // 克莱因蓝
    ['chinesered', '#FF0000'], // 中国红
    ['internationalorange', '#FF4F00'], // 国际橙
    ['egyptianvlue', '#1034A6'], // 埃及艳蓝
    ['parisviolet', '#6C3082'], // 巴黎紫
    ['moroccanblue', '#1256A7'], // 摩洛哥蓝
    ['brazilgreen', '#009B3A'], // 巴西绿
    ['britishracinggreen', '#004225'], // 英国赛车绿
    ['indianyellow', '#E3A857'], // 印度黄
    ['australiangold', '#FFDF00'], // 澳大利亚金
    ['venetianred', '#C80815'], // 威尼斯红
    ['majorelleblue', '#6050DC'], // 马若雷蓝
    ['tuscanred', '#7C3030'], // 托斯卡红
    ['naplesyellow', '#FADA5E'], // 那不勒斯黄
    ['capumortuum', '#592720'], // 死者之首
    ['mayablue', '#73C2FB'], // 玛雅蓝
    ['persianrose', '#FE28A2'], // 波斯玫瑰
    ['tyrianpurple', '#66023C'], // 泰尔紫
    ['saharasand', '#F1E788'], // 撒哈拉沙
    ['burmeseruby', '#B00A0A'], // 缅甸红宝石

    ['transparent', 'rgba(0,0,0,0)'],
    ['aliceblue', '#F0F8FF'],
    ['antiquewhite', '#FAEBD7'],
    ['aqua', '#00FFFF'],
    ['aquamarine', '#7FFFD4'],
    ['azure', '#F0FFFF'],
    ['beige', '#F5F5DC'],
    ['bisque', '#FFE4C4'],
    ['black', '#000000'],
    ['blanchedalmond', '#FFEBCD'],
    ['blue', '#0000FF'],
    ['blueviolet', '#8A2BE2'],
    ['brown', '#A52A2A'],
    ['burlywood', '#DEB887'],
    ['cadetblue', '#5F9EA0'],
    ['chartreuse', '#7FFF00'],
    ['chocolate', '#D2691E'],
    ['coral', '#FF7F50'],
    ['cornflowerblue', '#6495ED'],
    ['cornsilk', '#FFF8DC'],
    ['crimson', '#DC143C'],
    ['cyan', '#00FFFF'],
    ['darkblue', '#00008B'],
    ['darkcyan', '#008B8B'],
    ['darkgoldenrod', '#B8860B'],
    ['darkgray', '#A9A9A9'],
    ['darkgreen', '#006400'],
    ['darkkhaki', '#BDB76B'],
    ['darkmagenta', '#8B008B'],
    ['darkolivegreen', '#556B2F'],
    ['darkorange', '#FF8C00'],
    ['darkorchid', '#9932CC'],
    ['darkred', '#8B0000'],
    ['darksalmon', '#E9967A'],
    ['darkseagreen', '#8FBC8F'],
    ['darkslateblue', '#483D8B'],
    ['darkslategray', '#2F4F4F'],
    ['darkturquoise', '#00CED1'],
    ['darkviolet', '#9400D3'],
    ['deeppink', '#FF1493'],
    ['deepskyblue', '#00BFFF'],
    ['dimgray', '#696969'],
    ['dodgerblue', '#1E90FF'],
    ['firebrick', '#B22222'],
    ['floralwhite', '#FFFAF0'],
    ['forestgreen', '#228B22'],
    ['fuchsia', '#FF00FF'],
    ['gainsboro', '#DCDCDC'],
    ['ghostwhite', '#F8F8FF'],
    ['gold', '#FFD700'],
    ['goldenrod', '#DAA520'],
    ['gray', '#808080'],
    ['green', '#008000'],
    ['greenyellow', '#ADFF2F'],
    ['honeydew', '#F0FFF0'],
    ['hotpink', '#FF69B4'],
    ['indianred', '#CD5C5C'],
    ['indigo', '#4B0082'],
    ['ivory', '#FFFFF0'],
    ['khaki', '#F0E68C'],
    ['lavender', '#E6E6FA'],
    ['lavenderblush', '#FFF0F5'],
    ['lawngreen', '#7CFC00'],
    ['lemonchiffon', '#FFFACD'],
    ['lightblue', '#ADD8E6'],
    ['lightcoral', '#F08080'],
    ['lightcyan', '#E0FFFF'],
    ['lightgoldenrodyellow', '#FAFAD2'],
    ['lightgray', '#D3D3D3'],
    ['lightgreen', '#90EE90'],
    ['lightpink', '#FFB6C1'],
    ['lightsalmon', '#FFA07A'],
    ['lightseagreen', '#20B2AA'],
    ['lightskyblue', '#87CEFA'],
    ['lightslategray', '#778899'],
    ['lightsteelblue', '#B0C4DE'],
    ['lightyellow', '#FFFFE0'],
    ['lime', '#00FF00'],
    ['limegreen', '#32CD32'],
    ['linen', '#FAF0E6'],
    ['magenta', '#FF00FF'],
    ['maroon', '#800000'],
    ['mediumaquamarine', '#66CDAA'],
    ['mediumblue', '#0000CD'],
    ['mediumorchid', '#BA55D3'],
    ['mediumpurple', '#9370DB'],
    ['mediumseagreen', '#3CB371'],
    ['mediumslateblue', '#7B68EE'],
    ['mediumspringgreen', '#00FA9A'],
    ['mediumturquoise', '#48D1CC'],
    ['mediumvioletred', '#C71585'],
    ['midnightblue', '#191970'],
    ['mintcream', '#F5FFFA'],
    ['mistyrose', '#FFE4E1'],
    ['moccasin', '#FFE4B5'],
    ['navajowhite', '#FFDEAD'],
    ['navy', '#000080'],
    ['oldlace', '#FDF5E6'],
    ['olive', '#808000'],
    ['olivedrab', '#6B8E23'],
    ['orange', '#FFA500'],
    ['orangered', '#FF4500'],
    ['orchid', '#DA70D6'],
    ['palegoldenrod', '#EEE8AA'],
    ['palegreen', '#98FB98'],
    ['paleturquoise', '#AFEEEE'],
    ['palevioletred', '#DB7093'],
    ['papayawhip', '#FFEFD5'],
    ['peachpuff', '#FFDAB9'],
    ['peru', '#CD853F'],
    ['pink', '#FFC0CB'],
    ['plum', '#DDA0DD'],
    ['powderblue', '#B0E0E6'],
    ['purple', '#800080'],
    ['rebeccapurple', '#663399'],
    ['red', '#FF0000'],
    ['rosybrown', '#BC8F8F'],
    ['royalblue', '#4169E1'],
    ['saddlebrown', '#8B4513'],
    ['salmon', '#FA8072'],
    ['sandybrown', '#F4A460'],
    ['seagreen', '#2E8B57'],
    ['seashell', '#FFF5EE'],
    ['sienna', '#A0522D'],
    ['silver', '#C0C0C0'],
    ['skyblue', '#87CEEB'],
    ['slateblue', '#6A5ACD'],
    ['slategray', '#708090'],
    ['snow', '#FFFAFA'],
    ['springgreen', '#00FF7F'],
    ['steelblue', '#4682B4'],
    ['tan', '#D2B48C'],
    ['teal', '#008080'],
    ['thistle', '#D8BFD8'],
    ['tomato', '#FF6347'],
    ['turquoise', '#40E0D0'],
    ['violet', '#EE82EE'],
    ['wheat', '#F5DEB3'],
    ['white', '#FFFFFF'],
    ['whitesmoke', '#F5F5F5'],
    ['yellow', '#FFFF00'],
    ['yellowgreen', '#9ACD32']

])


export const toHex = (n: number): string => {
    let hex = n.toString(16);
    if (hex.length == 1) {
        return '0' + hex;
    } else {
        return hex;
    }
}
export function isValidColor(color: string): boolean {
    // return chroma.valid(color);
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
    const rgbRegex = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/;
    const rgbaRegex = /^rgba\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\s*,\s*((1(\.0{1,2})?)|(0(\.\d{1,2})?))\)$/;
    const hslRegex = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/;
    const hslaRegex = /^hsla\(\s*((\d{1,2}|[1-2]\d{2}|3[0-5]\d)(\.\d+)?|\d+(\.\d+)?)\s*,\s*((\d{1,2}|\d{0,1}\d{1}\d{1}|[1-2]\d{2}|3[0-5]\d)(\.\d+)?|\d+(\.\d+)?)%\s*,\s*((\d{1,2}|\d{0,1}\d{1}\d{1}|[1-2]\d{2}|3[0-5]\d)(\.\d+)?|\d+(\.\d+)?)%\s*,\s*((1|0(\.\d{1,2})?|(\.\d{1,2})))\)$/i;


    if (color == '') {
        return false; // 颜色值为空
    } else if (color === 'inherit' || color === 'transparent') {
        return false; // 特殊颜色值
    } else if (color === 'currentColor') {
        return false; // currentColor 不是有效的颜色值
    } else if (hexRegex.test(color) || rgbRegex.test(color) || rgbaRegex.test(color) || hslRegex.test(color) || hslaRegex.test(color)) {
        return true; // 符合颜色值的格式
    }
    return false;
}
/**
 * 获取默认的颜色值
 * @param [string]  颜色名称或者16进制颜色值
 */
export function getDefaultColor(sColor: string): string {
    if (sColor == "") return ""
    let sc = sColor.toLocaleLowerCase().trim().replace(" ", "");

    if (isValidColor(sc)) {
        // 如果符合所有颜色值，进行转换为16进制。css方便统一解析。
        return sc;
    }
    // 检测是否是颜色名称。
    let sco = colors.get(sc);
    if (typeof sco == 'string') return sco as string;
    return colors.get("primary")!;
}

/**
 * 颜色转rgb
 */
export function hexToRgb(sColors: string) {
    if (sColors == "") {
        return { r: 0, g: 0, b: 0, a: 0 }
    }
    let reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/;
    let sColor: string = sColors.toLowerCase();

    if (sColor != '' && reg.test(sColor)) {

        if (sColor.length == 4) {
            let sColorNew = "#";
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }

        //处理六位的颜色值
        let sColorChange: number[] = [];
        sColorChange.push(parseInt(sColor.substring(1, 3), 16));
        sColorChange.push(parseInt(sColor.substring(3, 5), 16));
        sColorChange.push(parseInt(sColor.substring(5, 7), 16));
        if (sColor.length == 9) {
            sColorChange.push(parseInt(sColor.substring(7, 9), 16) / 255);
        }
        return {
            r: sColorChange[0],
            g: sColorChange[1],
            b: sColorChange[2],
            a: sColorChange.length == 4 ? sColorChange[3] : 1
        }
    } else if (/^(rgb|RGB|rgba|RGBA)/.test(sColor)) {
        let arr: string[] = sColor.replace(/(?:\(|\)|rgba|rgb|RGB|RGBA)*/g, "").split(",")
        let p: number[] = arr.map((val: string): number => parseInt(val));
        if (p.length < 3) {
            return {
                r: 0,
                g: 0,
                b: 0,
                a: 1
            }
        }
        if (p.length == 3) {
            p.push(1)
        }
        return {
            r: p[0],
            g: p[1],
            b: p[2],
            a: arr.length == 3 ? p[3] : parseFloat(arr[3])
        }
    } else {
        return {
            r: 0,
            g: 0,
            b: 0,
            a: 1
        }
    }
}
/**
 * rgb转hsl
 */
export function rgbToHsl(rgb: rgb): hsla {
    let r = rgb.r / 255
    let g = rgb.g / 255
    let b = rgb.b / 255
    let a = rgb.a

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    let h = 60 * (4 + (r - g) / (max - min));
    let s=(max - min) / (2 - max - min);
    let l = (max + min) / 2;

    if (max === r) {
        h = (60 * (g - b)) / (max - min);
    } else if (max === g) {
        h = 60 * (2 + (b - r) / (max - min));
    }

    if (h < 0) {
        h += 360;
    }


    if (max === min) {
        s = 0;
    } else if (l < 0.5) {
        s = (max - min) / (max + min);
    }

    return { h: h, s: s * 100, l: l * 100, a: a };
}

/**
 * hsl转rgb
 */
export function hslToRgb(hsl: hsla): rgb {
    let h = hsl.h
    let s = hsl.s
    let l = hsl.l
    let a = hsl.a

    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r = l;
    let g = l;
    let b = l;

    function hue2rgb(pxx: number, q: number, txs: number): number {
        let t = txs;
        let p = pxx;
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }



    if (s > 0) {
        let q = l * (1 + s);
        if (l >= 0.5) {
            q = l + s - l * s;
        }
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);

    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return { r, g, b, a };
}

/**
 * rgb转16进制
 */
export function rgbToHex(rgb: rgb): string {
    let r = rgb.r
    let g = rgb.g
    let b = rgb.b
    let a = rgb.a
    return "#" + toHex(r) + toHex(g) + toHex(b) + toHex(a * 255)
}
export function hslaToCss(hsl: hsla): string {

    let rgb = hslToRgb(hsl)

    return rgbToHex(rgb)
}

export function hslaToRgbCss(hsl: hsla): string {

    let rgb = hslToRgb(hsl)
    let r = rgb.r
    let g = rgb.g
    let b = rgb.b
    let a = rgb.a
    return `rgba(${r},${g},${b},${a})`
}

// 根据 HSLA 颜色计算亮度
export function getLuminance(color: rgb | hsla, type = "rgba"): number {


    let colordefault: rgb = (type == 'rgba' ? color : hslToRgb(color as hsla)) as rgb;
    const r = colordefault.r
    const g = colordefault.g
    const b = colordefault.b
    const rs = r / 255
    const gs = g / 255
    const bs = b / 255
    const rl = Math.pow(rs <= 0.03928 ? rs / 12.92 : ((rs + 0.055) / 1.055), 2.4);
    const gl = Math.pow(gs <= 0.03928 ? gs / 12.92 : ((gs + 0.055) / 1.055), 2.4);
    const bl = Math.pow(bs <= 0.03928 ? bs / 12.92 : ((bs + 0.055) / 1.055), 2.4);

    return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/**
 * 对颜色加深
 */
export function colorAddDeepen(sColor: string): string {

    let rgb = hexToRgb(getDefaultColor(sColor));

    let hsl = rgbToHsl(rgb);

    let l = hsl.l - 5;
    l = Math.max(0, Math.min(l, 100))

    return hslaToRgbCss({ h: hsl.h, s: hsl.s, l, a: hsl.a })
}
/**
 * 对颜色提亮
 */
export function colorAddBrighten(sColor: string): string {
    let rgb = hexToRgb(getDefaultColor(sColor));
    let hsl = rgbToHsl(rgb);
    let l = hsl.l + 10;
    l = Math.max(0, Math.min(l, 100))
    return rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l, a: hsl.a }))
}




/**
 * 获取浅色系主题，根据颜色值计算。返回正常值和hover值。
 */
export function colorGetThint(sColor: string) {
    let rgb = hexToRgb(getDefaultColor(sColor));
    let hsl = rgbToHsl(rgb);
    let s = hsl.s;
    // let l = hsl.getNumber("l");
    if (Math.ceil(s) > 0) {
        s = 45
    }
    return {
        default: rgbToHex(hslToRgb({ h: hsl.h, s, l: 93, a: hsl.a })),
        hover: rgbToHex(hslToRgb({ h: hsl.h, s, l: 85, a: hsl.a }))
    }
}
/**
 * 获取正常主题，根据颜色值计算。返回正常值和hover值。
 */
export function colorGetHover(sColor: string) {

    return {
        default: sColor,
        hover: colorAddDeepen(sColor)
    }
}


/**
 * 处理相主题色。
 * @param color 需要处理的颜色值
 * @param hoverColor 对应按下去的颜色默认与color相等。
 * @returns UTSJSONObject
 */
export function getDefaultColorObj(color: string, hoverColor: string) {
    let hsla = rgbToHsl(hexToRgb(getDefaultColor(color)));
    let hoverHsla = rgbToHsl(hexToRgb(getDefaultColor(hoverColor)));
    let shadow = hslaToRgbCss({ h: hsla.h, s: (hsla.s) == 0 ? 0 : 100, l: 50, a: 0.2 });
    let shadowHOver = hslaToRgbCss({ h: hoverHsla.h, s: (hoverHsla.s) == 0 ? 0 : 70, l: 50, a: 0.15 });
    if ((hsla.h) == 0 && (hsla.s) == 0) {
        shadow = "transparent"
    }
    if ((hoverHsla.h) == 0 && (hoverHsla.s) == 0) {
        shadowHOver = "transparent"
    }
    let lightnum = getLuminance(hoverHsla, 'hsla');
    let o = {
        default: {
            background: hslaToRgbCss(hsla),
            borderColor: hslaToRgbCss({ h: hsla.h, s: hsla.s, a: hsla.a, l: Math.min(Math.max(0, hsla.l - 5), hsla.l) }),
            fontColor: lightnum < 0.6 && hsla.a > 0.1 ? '#ffffff' : '#000000',
            shadow: shadow
        },
        active: {
            background: hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: Math.min(Math.max(0, hoverHsla.l - 10), hoverHsla.l) }),
            borderColor: hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: Math.max(Math.max(0, hoverHsla.l - 10), hoverHsla.l) }),
            fontColor: lightnum < 0.6 && hoverHsla.a > 0.1 ? '#ffffff' : '#000000',
            shadow: shadowHOver
        }
    }

    return o;
}

/**
 * 处理相主题色。
 * @param color 需要处理的颜色值
 * @param hoverColor 对应按下去的颜色默认与color相等。
 * @returns UTSJSONObject
 */
export function getTextColorObj(color: string, hoverColor: string, isCoverDark?: boolean) {
    let dark = isCoverDark == null ? false : isCoverDark
    // #ifdef WEB
    dark = isCoverDark == undefined ? false : dark
    // #endif
    let hsla = rgbToHsl(hexToRgb(getDefaultColor(color)));
    let hsla2 = rgbToHsl(hexToRgb(getDefaultColor(color)));
    let hoverHsla = rgbToHsl(hexToRgb(getDefaultColor(hoverColor)));
    let bgcolor = hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: dark == true ? 20 : 95 })
    if (dark) {
        let p = hsla2;
        p.l = 20
        p.s = (p.s) != 0 ? 0 : 20
        bgcolor = hslaToRgbCss(p)
    }
    let o = {
        default: {
            background: "transparent",
            borderColor: "transparent",
            fontColor: getLuminance(hsla, 'hsla') < 0.3 && hsla.a > 0.1 ? hslaToRgbCss(hsla) : hslaToRgbCss({ h: hsla.h, s: hsla.s, a: hsla.a, l: 30 }),
            shadow: "transparent",
        },
        active: {
            background: bgcolor,
            borderColor: "transparent",
            fontColor: getLuminance(hoverHsla, 'hsla') < 0.3 && hoverHsla.a > 0.1 ? hslaToRgbCss(hoverHsla) : hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: 30 }),
            shadow: "transparent",
        }
    }
    return o;
}

/**
 * 处理相主题色。
 * @param color 需要处理的颜色值
 * @param hoverColor 对应按下去的颜色默认与color相等。
 * @returns UTSJSONObject
 */
export function getThinColorObj(color: string, hoverColor: string, isCoverDark?: boolean) {
    let dark = isCoverDark == null ? false : isCoverDark
    // #ifdef WEB
    dark = isCoverDark == undefined ? false : dark
    // #endif

    let hsla = rgbToHsl(hexToRgb(getDefaultColor(color)));
    let hoverHsla = rgbToHsl(hexToRgb(getDefaultColor(hoverColor)));
    // tmxColor.hslaToCss({ ...hsla}) : tmxColor.hslaToCss({ ...hsla,l:30})
    let fontcolor = getLuminance(hsla, 'hsla') < 0.3 && hsla.a > 0.1 ? hslaToRgbCss(hsla) : hslaToRgbCss({ h: hsla.h, s: hsla.s, a: hsla.a, l: 30 })
    let bordercolor = hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: dark == true ? 21 : 92 })
    let bgcolor = hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: dark == true ? 20 : 95 })

    if (dark) {
        let p = hsla;
        p.l = 98
        fontcolor = hslaToRgbCss(p)
        p.l = 20
        p.s = (p.s) != 0 ? 5 : 20
        bgcolor = hslaToRgbCss(p)
        p.l = 22
        bordercolor = hslaToRgbCss(p)
    }
    let o = {
        default: {
            background: bgcolor,
            borderColor: bordercolor,
            fontColor: fontcolor,
            shadow: "transparent",
        },
        active: {
            background: hslaToRgbCss({ h: hoverHsla.h, s: dark ? 10 : 50, a: hoverHsla.a, l: dark == true ? 15 : 88 }),
            borderColor: hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: 0, l: dark == true ? 18 : 80 }),
            fontColor: getLuminance(hoverHsla, 'hsla') < 0.3 && hoverHsla.a > 0.1 ? hslaToRgbCss(hoverHsla) : hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: 64 }),
            shadow: "transparent",
        }
    }
    return o;
}

/**
 * 处理相主题色。
 * @param color 需要处理的颜色值
 * @param hoverColor 对应按下去的颜色默认与color相等。
 * @returns UTSJSONObject
 */
export function getOutlineColorObj(color: string, hoverColor: string) {
    let hsla = rgbToHsl(hexToRgb(getDefaultColor(color)));
    let hoverHsla = rgbToHsl(hexToRgb(getDefaultColor(hoverColor)));
    // tmxColor.hslaToCss({ ...hsla}) : tmxColor.hslaToCss({ ...hsla,l:30})
    let lightnum = getLuminance(hoverHsla, 'hsla');

    let o = {
        default: {
            background: 'transparent',
            borderColor: hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: 1, l: 75 }),
            fontColor: lightnum < 0.6 && hsla.a > 0.1 ? hslaToRgbCss(hsla) : hslaToRgbCss({ h: hsla.h, s: hsla.s, a: hsla.a, l: 30 }),
            shadow: "transparent",
        },

        active: {
            background: 'transparent',
            borderColor: hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: 1, l: 70 }),
            fontColor: lightnum < 0.6 && hoverHsla.a > 0.1 ? hslaToRgbCss(hoverHsla) : hslaToRgbCss({ h: hoverHsla.h, s: hoverHsla.s, a: hoverHsla.a, l: 30 }),
            shadow: "transparent",
        }
    }
    return o;
}

/**
 * 设置颜色的亮度值。29
 * isCoverDark:是根据亮度值，是否要设置n的值，如果n超过了
 * 指定的30就不操作。
 */
export function setTextColorLightByDark(color: string): string {
    let realColor = getDefaultColor(color);
    let hsla = rgbToHsl(hexToRgb(realColor))
    let l = hsla.l
    let s = hsla.s
    if (l < 30) {
        if (s > 0) {
            hsla.l = 50
        } else {
            hsla.l = 100
        }

    }

    return hslaToRgbCss(hsla)
}
/**
 * 变动的颜色是否需要变深。如果不需要返回原始颜色
 * 如果果需要自动加深。
 */
export function setBgColorLightByDark(color: string): string {
    let realColor = getDefaultColor(color);
    let hsla = rgbToHsl(hexToRgb(realColor))
    let l = hsla.l
    let s = hsla.s
    if (s == 0 && l > 50) {
        hsla.l = 100 - l
    }
    if (s > 0) {
        if (l > 50) {
            hsla.l = 100 - l
        }
    }
    return hslaToRgbCss(hsla)
}

export function isBlackAndWhite(color: string): boolean {
    let realColor = getDefaultColor(color);
    let hsla = rgbToHsl(hexToRgb(realColor))
    let s = hsla.s
    return s == 0
}



