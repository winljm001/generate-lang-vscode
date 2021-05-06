import * as vscode from "vscode";
import * as path from "path";
import { Log } from "./log";

const xlsx = require("node-xlsx");
const fs = require("fs");
const prettier = require("prettier");

const prettierOptions = {
  singleQuote: true,
  semi: false,
};
// 数组去重
export const unique = (arr: any[]) => {
  return Array.from(new Set(arr));
};

// 从对象中获取所有的值
export const getAllwords = (langObj: any, parentKey = "") => {
  let resList: any[] = [];
  for (var index in langObj) {
    const item = langObj[index];
    if (typeof item === "string") {
      resList.push({ key: parentKey + "." + index, value: item });
    } else {
      resList = resList.concat(getAllwords(item, parentKey + "." + index));
    }
  }
  return resList;
};

// 读取主语言的文件
export const readFileList = (fullPath: any) => {
  return new Promise((resolve, reject) => {
    if (!fullPath) {
      reject();
    }
    // const res = fs.readFileSync(fullPath,"utf-8");
    console.log("fullPath", fullPath);
    const res = require(fullPath);
    // console.log(res);
    resolve(res);
    // import(fullPath).then((res) => {
    // });
  });
};

// 读取Excel
export const getImportExcel = (importExcelPath: string) => {
  try {
    const workspacePath = getWorkspacePath();
    const workSheetsFromBuffer = xlsx.parse(
      fs.readFileSync(`${workspacePath}/${importExcelPath}`)
    );
    const data = workSheetsFromBuffer[0]?.data;
    const resData: any[] = [];
    if (data.length > 1) {
      for (let i = 1; i < data[0].length; i++) {
        const name = data[0][i];
        resData.push({ name: name, data: [] });
      }
    } else {
      throw new Error("xlsx内格式不对");
    }
    for (let i = 1; i < data.length; i++) {
      for (let j = 1; j <= resData.length; j++) {
        const word = data[i][j];
        resData[j - 1]?.data?.push({
          key: data[i][0],
          value: word ? word : "",
        });
      }
    }
    return resData;
  } catch (error) {
    throw new Error("读取xlsx错误，或者xlsx内格式不对");
  }
};

// 生成Excel文件的数据

export const getExportExcelData = (data: any) => {
  let res: any = [];
  const titleRow: any[] = [""];
  const dataList: any[] = [];
  data.forEach((v: any) => {
    titleRow.push(v?.name);
  });
  data[0].data.forEach((v: any, i: any) => {
    const tempItem: any[] = [v?.key];
    data.forEach((item: any, j: any) => {
      tempItem[j + 1] = item?.data?.find((keyItem: any) => {
        return keyItem?.key === v?.key;
      })?.value;
    });
    dataList.push(tempItem);
  });
  res.push(titleRow);
  res = res.concat(dataList);
  const resData = [{ name: "sheet1", data: res }];
  return resData;
};

// 导出excel
export const writeExcel = (name: any, data: any) => {
  const workspacePath = getWorkspacePath();
  const distPath = `${workspacePath}/excel-dist`;
  try {
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath);
    }
    const buffer: any = xlsx.build(data);
    fs.writeFileSync(`${distPath}/` + name + ".xlsx", buffer, { flag: "w" });
  } catch (error) {
    console.log(error);
  }
};

const replaceLang = (obj: any, originData: any, parentKey = "") => {
  const resObj = JSON.parse(JSON.stringify(obj));
  for (var index in resObj) {
    const item = resObj[index];
    if (typeof item === "string") {
      const findWord = originData.find((v: any) => {
        return v.key === parentKey + "." + index;
      });
      resObj[index] = findWord?.value;
    } else {
      resObj[index] = replaceLang(item, originData, parentKey + "." + index);
    }
  }
  console.log(resObj);
  return resObj;
};
// 多语言文件生成
export const generateJSFiles = (
  mainLang: any,
  importExcelData: any,
  outLang: any,
  outLangPath: any
) => {
  outLang?.forEach((v: any) => {
    const originData = importExcelData.find((item: any) => {
      return item?.name === v;
    })?.data;
    writeTs(v, replaceLang(mainLang, originData), outLangPath);
  });
};

// 生成ts
export const writeTs = (
  name: any,
  data: any,
  outLangPath: any = "lang-dist"
) => {
  const workspacePath = getWorkspacePath();
  const distPath = `${workspacePath}/${outLangPath}`;
  try {
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath);
    }
    const scriptContent = `export default ${JSON.stringify(data)}`;
    const prettierContent = prettier.format(scriptContent, prettierOptions);
    fs.writeFileSync(`${distPath}/` + name + ".ts", prettierContent);
  } catch (error) {
    console.log(error);
  }
};

export const getWorkspacePath = () => {
  const workspaceFolders = vscode.workspace?.workspaceFolders;
  let workspacePath = "./";
  if (workspaceFolders && workspaceFolders?.length > 0) {
    const { uri } = workspaceFolders[0];
    workspacePath = uri?.fsPath;
  }
  return workspacePath;
};
// 加载配置文件

export const loadConfig = (uri: any, context: vscode.ExtensionContext) => {
  try {
    const workspacePath = getWorkspacePath();
    let langPath = path.relative(workspacePath, uri?.fsPath);
    const CONFIG_PATH = path.join(workspacePath, "./generate-lang-config.json");
    if(path.sep==='\\'){
      langPath=langPath.split(path.sep).join('/');
    }
    let config = {
      outLang: ["en-US", "th-TH", "vi-VN"],
      mainLangPath: langPath,
      importExcel: "",
      outLangPath: "lang-dist",
      outExcel: "",
    };
    if (!fs.existsSync(CONFIG_PATH)) {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config));
    } else {
      config = JSON.parse(fs.readFileSync(CONFIG_PATH));
    }
    return config;
  } catch (error) {
    Log.info(error);
  }
};
