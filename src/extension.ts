import * as vscode from 'vscode';
import { generate } from './generate';
import { extract } from './extract';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// 生成多语言文件及excel
	let generateLang = vscode.commands.registerCommand('lalala-generate-lang.generateLang', (uri) => {
		generate(uri,context);
	});
	// 提取多语言
	let extractLang = vscode.commands.registerCommand('lalala-generate-lang.extractLang', () => {
		extract(context);
	});
	
	context.subscriptions.push(extractLang);
	context.subscriptions.push(generateLang);
}

export function deactivate() {}
