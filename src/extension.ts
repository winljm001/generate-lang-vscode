import * as vscode from 'vscode';
import { generate } from './generate';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('lalala-generate-lang.generateLang', (uri) => {
		// 生成多语言文件及excel
		generate(uri,context);
	});
	
	context.subscriptions.push(disposable);
}

export function deactivate() {}
