/**
 * 提取
 */
 import * as vscode from 'vscode';
 import { loadModuleData } from './utils';
import { getConfig } from './utils/generate';

 export const extract=async (context: vscode.ExtensionContext)=>{
    // 激活的tab
    const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
    // 获取提取的内容
    const selectionText=editor?.document.getText(editor?.selection);
    // 获取config
    const config=getConfig();
    const mainLang=await loadModuleData(config.mainLangPath,context.extensionPath);
    console.log(mainLang);
    
    // const config.mainLangPath;
    console.log(config,selectionText);
 };                                                     