/**
 * 生成
 */
import * as vscode from 'vscode';
import { loadModuleData } from './utils';
import {loadConfig,generateJSFiles, getAllwords, getExportExcelData, getImportExcel, writeExcel } from "./utils/generate";

export const generate=async (uri:any,context:vscode.ExtensionContext)=>{
    
    try {
        // 读取配置文件
        const config:any=loadConfig(uri);
		// 读取mainlang
        const mainLang: any = await loadModuleData(config?.mainLangPath,context.extensionPath);
        // 获取所有单词
        const allword = getAllwords(mainLang);
        const originData = { name: "zh-CN", data: allword };
        // 读取导入的Excel,没有则为空数组
        let importExcelData: any[] = [];
        if (config?.importExcel) {
            const outData = getImportExcel(config?.importExcel);
            importExcelData = outData.map((v) => {
                return v?.name === "zh-CN" ? originData : v;
            });
        } else {
            importExcelData = [
                originData,
                ...config?.outLang?.map((v:any) => {
                    return { name: v, data: [] };
                }),
            ];
        }
        // 生成I18N文件
        generateJSFiles(mainLang, importExcelData, config.outLang);
        // 导出excel
        writeExcel("I18N", getExportExcelData(importExcelData));
    } catch (error) {
        console.log(error);
    }
};