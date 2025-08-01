import { defineStore } from 'pinia';


export const useTmConfig = defineStore('tmConfig', {
    state: () => {
        return {
            config: {
                mode: 'light',
                unit: 'rpx',
                fontSizeBase: '28',
                fontSizeScale: 1,
                buttonRadius: 24,
                buttonShadow: 'none',
                color: "primary",

                sheetRadius: 24,
                sheetMargin: [20, 0, 20, 20],
                sheetPadding: [24],
                sheetShadow: 'none',

                cellRadius: 24,

                sheetDarkColor: '#141414',
                sheetDarkBorderColor: ["#232323"],

                /** 输入框暗黑背景 */
                inputDarkColor: '#272727',
                inputLightColor: '#f5f5f5',
                inputRadius: 24,
                borderDarkColor: '#1c1c1c',
                unRadioAndCheckBoxColor: "#cfcfcf",

                switchRadius:64,

                modalRadius: 32,
                drawerRadius:32,
                animation: 'cubic-bezier(.42,.38,.15,.93)',
				
				backgroundColorContentDark:"#000000"

            } as TM.THEME_CONFIG
        }
    },

    actions: {

    },
});

