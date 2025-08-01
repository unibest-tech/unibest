import { onPageScroll, onReady, onResize } from "@dcloudio/uni-app";

export default {
    /**
     * tmui3.2.x
     * @param app Vue
     * @param options tmui3.0配置
     */
    // @ts-ignore
    install: (app: App, options: TM.THEME_CONFIG | null = null) => {
        app.mixin({
            onReady(){
                uni.$emit("onReady")
            },
            onResize(){
                uni.$emit("onResize")
            },
            onPageScroll(e:any){
                const pages = getCurrentPages();
                let page = undefined
                if(pages.length>0){
                   page = pages[pages.length - 1]?.route||undefined
                }
                uni.$emit("onPageScroll",{scrollTop:e.scrollTop,page:page})
            }
        })
    }
};