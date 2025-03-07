<script setup>
import { reactive, ref } from "vue";
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-overlay.css'
import { exportExcel } from "@/utils/excel.js";
import { createLoading, warningMessage } from "@/utils/stateHelper.js";
import { ElMessageBox } from "element-plus";
import { Delete } from "@element-plus/icons-vue";

const RefElTable = ref();
const tableName = ref('');
const tableHeader = ref([]);
const tableDataList = ref([]);

const tableStatus = reactive({
  onEdit: false, // 编辑的状态
  editRowIdx: -1,
  editColIdx: -1,
  editHeaderIdx: -1,
})


function setData(data) {
  /**
   * {
   *   "msg": "成功",
   *   "code": 200,
   *   "data": [
   *     {
   *       "uuid": "c3815a1e89f3432b954ed8ad773c2495",
   *       "userId": "db78ff4f-b075-4947-a90d-1a1b8402c0c1",
   *       "type": "1",
   *       "content": "```json\n{\n  \"甲方\": \"重庆测试吧科技有限公司\",\n  \"乙方\": \"重庆测试智能体科技有限公司\",\n  \"合同金额\": \"¥18000元(人民币大写:壹万捌仟圆整)\",\n  \"付款周期\": \"合同签订后,乙方开具有效发票给甲方,甲方在本合同项下的全部设计确定验收通过后通过支票或转账方式结清款项。\",\n  \"合同类型\": \"UI设计制作合同\"\n}\n```",
   *       "createTime": "2025-02-26 06:49:39"
   *     },
   *     {
   *       "uuid": "68d0371b0ff34870823b397ce9224d7c",
   *       "userId": "db78ff4f-b075-4947-a90d-1a1b8402c0c1",
   *       "type": "1",
   *       "content": "```json\n{\n  \"甲方\": \"重庆测试吧科技有限公司\",\n  \"乙方\": \"重庆测试智能体科技有限公司\",\n  \"合同金额\": \"¥18000元(人民币大写:壹万捌仟圆整)\",\n  \"付款周期\": \"合同签订后,乙方开具有效发票给甲方,甲方在本合同项下的全部设计确定验收通过后通过支票或转账方式结清款项。\",\n  \"合同类型\": \"UI设计制作合同\"\n}\n```",
   *       "createTime": "2025-02-26 06:51:12"
   *     }
   *   ]
   * }
   */
  if (!data || data.length === 0) {
    return;
  }

  // 解析出表格名称
  parseTableName(data);
  // 解析表头
  parseTableHeader(data);
  // 解析表数据
  parseTableData(data);
}

function parseTableName(data) {
  tableName.value = data[0].type;
}

/**
 * @param {any[]} data
 */
function parseTableHeader(data) {
  const row = data[0];
  const header = [];

  const rowContent = parseTableJson(row.content);

  for (let key in rowContent) {
    header.push(key)
  }

  tableHeader.value = header;
}

/**
 * @param {any[]} data
 */
function parseTableData(data) {
  const dataList = [];
  const rowObjList = data.map(item => {
    return parseTableJson(item.content);
  })

  rowObjList.forEach(rowObjItem => {
    let i = 0;
    const dataListItem = {};
    for (let rowObjItemKey in rowObjItem) {
      dataListItem[getColName(i)] = rowObjItem[rowObjItemKey];
      i++;
    }

    dataList.push(dataListItem);
  })

  tableDataList.value = dataList;
}

function parseTableJson(json) {
  try {
    const str = json.match(/```json([\s\S]*?)```/)[1].trim();
    return JSON.parse(str);
  } catch (e) {
    warningMessage("Json 格式异常");
  }
}

function getColName(index) {
  return `col-${ index }`;
}

function testData() {
  const data = {
    "msg": "成功",
    "code": 200,
    "data": [
      {
        "uuid": "c3815a1e89f3432b954ed8ad773c2495",
        "userId": "db78ff4f-b075-4947-a90d-1a1b8402c0c1",
        "type": "1",
        "content": "```json\n{\n  \"甲方\": \"测试吧科技有限公司\",\n  \"乙方\": \"测试科技有限公司\",\n  \"合同金额\": \"¥18000元(人民币大写:壹万捌仟圆整)\",\n  \"付款周期\": \"合同签订后,乙方开具有效发票给甲方,甲方在本合同项下的全部设计确定验收通过后通过支票或转账方式结清款项。\",\n  \"合同类型\": \"UI设计制作合同\"\n}\n```",
        "createTime": "2025-02-26 06:49:39"
      },
      {
        "uuid": "68d0371b0ff34870823b397ce9224d7c",
        "userId": "db78ff4f-b075-4947-a90d-1a1b8402c0c1",
        "type": "1",
        "content": "```json\n{\n  \"甲方\": \"测试吧科技有限公司\",\n  \"乙方\": \"重庆测试科技有限公司\",\n  \"合同金额\": \"¥18000元(人民币大写:壹万捌仟圆整)\",\n  \"付款周期\": \"合同签订后,乙方开具有效发票给甲方,甲方在本合同项下的全部设计确定验收通过后通过支票或转账方式结清款项。\",\n  \"合同类型\": \"UI设计制作合同\"\n}\n```",
        "createTime": "2025-02-26 06:51:12"
      }
    ]
  }

  setData(data.data);
}

function handleAddRow() {
  const colLen = getColLength();
  const row = {};
  for (let i = 0; i < colLen; i++) {
    row[getColName(i)] = '点击并修改';
  }
  tableDataList.value.push(row);
}

function handleAddCol() {
  if (tableDataList.value.length === 0) return;

  const colLen = getColLength();
  const data = tableDataList.value

  tableHeader.value.push(`第${ colLen + 1 }列`);

  data.forEach(item => {
    item[getColName(colLen)] = '点击并修改';
  })


  tableDataList.value = data;
}

/**
 * 获取最新的列数
 */
function getColLength() {
  return tableHeader.value.length;
}

function getRowLength() {
  return tableDataList.value.length;
}

function handleExport() {
  const loading = createLoading("导出中...");

  setTimeout(() => {
    try {
      exportExcel({
        tableName: tableName.value,
        tableHeader: tableHeader.value,
        tableData: tableDataList.value
      });
      loading.close();
    } catch (e) {
      loading.close();
      warningMessage("导出失败");
      if (typeof console !== 'undefined') console.error(e)
    }
  }, 500)
}

function handleDelete(idx) {
  ElMessageBox.confirm(
      '确认删除这行数据吗?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        lockScroll: true,
      }
  )
  .then(() => {
    tableDataList.value.splice(idx, 1);
  })
  .catch(() => {
  })
}

function startEdit(rowIdx, colIdx) {
  tableStatus.editRowIdx = rowIdx;
  tableStatus.editColIdx = colIdx;
}

function startHeaderEdit(colIdx) {
  tableStatus.editHeaderIdx = colIdx;
}

function onInputBlur() {
  tableStatus.editRowIdx = -1;
  tableStatus.editColIdx = -1;
}

function onHeaderInputBlur() {
  tableStatus.editHeaderIdx = -1;
}

function handleDeleteCol(colIdx) {
  ElMessageBox.confirm(
      '确认删除这列数据吗?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        lockScroll: true,
      }
  )
  .then(() => {
    deleteTableHeaderCol(colIdx);
    deleteTableDataCol(colIdx);
  })
  .catch(() => {
  })
}

function deleteTableHeaderCol(colIdx) {
  tableHeader.value.splice(colIdx, 1);
}

function deleteTableDataCol(colIdx) {
  const colName = getColName(colIdx);
  tableDataList.value.forEach(item => {
    delete item[colName];
  })

  reorderTableData();
}

function reorderTableData() {
  const result = [];
  tableDataList.value.forEach(item => {
    const r = {};
    let i = 0;
    for (const key in item) {
      r[getColName(i)] = item[key];
      i++;
    }
    result.push(r);
  })

  tableDataList.value = result;
}

testData();
</script>

<template>
  <el-container>
    <el-header>
      <el-row align="middle" style="height: 100%;">
        <el-col :span="12">
          <div class="text-blue mb-2">{{ tableName }}</div>
        </el-col>

        <el-col :span="12">
          <el-row justify="end" align="middle">
            <el-button type="primary" @click="handleAddRow">添加一行</el-button>
            <el-button type="primary" @click="handleAddCol">添加一列</el-button>
            <el-button type="warning" @click="handleExport">导出表格</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <el-main class="">
      <el-empty v-if="tableDataList.length === 0" class="mt-30" description="未查询到数据"/>
      <el-scrollbar v-else always class="pr-2">
        <el-table :data="tableDataList" ref="RefElTable" style="width: 100%" stripe border>
          <el-table-column
              v-for="(_, itemIdx) in tableHeader"
              :prop="getColName(itemIdx)"
              :label="tableHeader[itemIdx]"
          >
            <template #header="{column, $index}">
              <el-row align="middle">
                <el-col :span="23">
                  <template v-if="tableStatus.editHeaderIdx === $index">
                    <el-input v-model="tableHeader[$index]" style="width: 80%" @blur.stop="onHeaderInputBlur" v-focus/>
                  </template>
                  <template v-else>
                    <div @click.stop="startHeaderEdit($index)">{{ column.label }}</div>
                  </template>
                </el-col>
                <el-col :span="1" class="text-center">
                  <el-tooltip content="删除此列" placement="top">
                    <el-icon class="cursor-pointer hover:text-[#F56C6C]" @click.stop="handleDeleteCol($index)">
                      <Delete/>
                    </el-icon>
                  </el-tooltip>
                </el-col>
              </el-row>
            </template>

            <template #default="{ row, $index }">
              <template v-if="tableStatus.editRowIdx === $index && tableStatus.editColIdx === itemIdx">
                <el-input v-model="row[getColName(itemIdx)]" @blur.stop="onInputBlur" v-focus/>
              </template>
              <template v-else>
                <div @click.stop="startEdit($index, itemIdx)" class="min-h-10 flex items-center">{{ row[getColName(itemIdx)] }}</div>
              </template>
            </template>

          </el-table-column>

          <el-table-column label="操作" width="70" align="center">
            <template #default="scope">
              <div>
                <el-text class="mx-1 cursor-pointer hover:underline" type="danger" @click="handleDelete(scope.$index)">
                  删除
                </el-text>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style lang="scss">
</style>

<style lang="scss" scoped>
.el-container {
  .el-main {
    height: calc(100vh - 60px);
  }
}
</style>
