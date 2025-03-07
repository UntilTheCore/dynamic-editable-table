import { cloneDeep } from 'lodash'
import * as XLSX from "xlsx";

/**
 * @param {any[]} data
 * @param filterCol
 */
export function preprocessingData(data, { filterCol = [] } = {}) {
  if (filterCol.length > 0) {
    doFilterCol(data, filterCol);
  }
}

/**
 * @param {any[]} data
 * @param {string[]} filterCol
 */
function doFilterCol(data, filterCol) {
  if(filterCol.length > 0) {
    data.forEach(item => {
      filterCol.forEach(col => {
        delete item[col];
      })
    })
  }
}

/**
 * @param {{tableName: string; tableHeader: string[]; tableData: {[key: string]: any}[]}} data
 * @param {{filterCol: string[]}} preprocess - 预处理数据
 */
export function exportExcel({tableName, tableHeader, tableData}, preprocess) {
  const _data = cloneDeep(tableData);
  if(preprocess) {
    preprocessingData(_data, preprocess);
  }

  const worksheet = XLSX.utils.json_to_sheet(_data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tableName);
  XLSX.utils.sheet_add_aoa(worksheet, [tableHeader], { origin: "A1" });

  XLSX.writeFile(workbook, `${tableName}.xlsx`, { compression: true });
}
