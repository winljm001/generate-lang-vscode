import { generateJSFiles, getAllwords, getExportExcelData, getImportExcel, readFileList, writeExcel } from "./utils";

export const main=async (config:any)=>{
    // 读取ts文件
    try {
        console.log('config',config);
        const mainLang: any = await readFileList(config?.mainLangPath);
        console.log('mainLang',mainLang);
        // 获取所有单词
        // const allword = getAllwords(mainLang?.default);
        // const originData = { name: "zh-CN", data: allword };
        // // 读取导入的Excel,没有则为空数组
        // let importExcelData: any[] = [];
        // if (config?.importExcel) {
        //     const outData = getImportExcel(config?.importExcel);
        //     importExcelData = outData.map((v) => {
        //         return v?.name === "zh-CN" ? originData : v;
        //     });
        // } else {
        //     importExcelData = [
        //         originData,
        //         ...config?.outLang.map((v:any) => {
        //             return { name: v, data: [] };
        //         }),
        //     ];
        // }
        // // 生成I18N文件
        // generateJSFiles(mainLang?.default, importExcelData, config.outLang);
        // // // // 导出excel
        // writeExcel("I18N", getExportExcelData(importExcelData));
    } catch (error) {
        console.log(error);
    }
};