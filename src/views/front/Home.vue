<template>
  <div class="main-content">
    <div style="display: flex; margin-bottom: 10px">
      <div style="flex: 1">
        <el-button
          icon="el-icon-document"
          type="primary"
          class="btn-green"
          size="medium"
          @click="handleAdd"
          >创建新的问卷</el-button
        >
      </div>
      <div>
        <el-input
          v-model="name"
          style="width: 300px; margin-right: 10px"
          size="medium"
          placeholder="请输入名称搜索问卷"
          clearable
        ></el-input>
        <el-button
          icon="el-icon-search"
          type="primary"
          size="medium"
          class="btn-green"
          @click="load(1)"
          >搜 索</el-button
        >
      </div>
    </div>

    <div style="margin-bottom: 10px">
      <div
        class="card"
        v-for="item in tableData"
        :key="item.id"
        style="margin-bottom: 5px"
      >
        <div style="display: flex">
          <div style="flex: 1; width: 0">
            <div
              style="display: flex; align-items: center; margin-bottom: 10px"
            >
              <el-tag v-if="item.saved === '否'" type="danger">未发布</el-tag>
              <el-tag v-if="item.saved === '是'" type="success">已发布</el-tag>
              <el-tag v-if="item.saved === '待'" type="warning">待审核</el-tag>
              <el-tooltip
                v-if="item.saved === '驳'"
                class="item"
                effect="dark"
                placement="top"
              >
                <div slot="content">
                  <p>审核失败，驳回理由: {{ item.reason }}</p>
                </div>
                <el-tag style="background-color: #ff4d4d; color: #ffffff"
                  >审核失败</el-tag
                >
              </el-tooltip>
              <span style="font-size: 20px; margin-left: 10px">{{
                item.name
              }}</span>
              <span style="font-size: 15px; color: black; margin-left: 10px"
                >创建时间: {{ item.createTime }}</span
              >
            </div>

            <div>
              <el-button
                type="text"
                style="color: #2a60c9; font-size: 16px"
                @click="handleEdit(item)"
                v-if="item.saved !== '是'"
                ><i class="el-icon-setting"></i> 设计</el-button
              >
              <el-button
                type="text"
                style="color: #2a60c9; font-size: 16px"
                @click="design(item.id)"
                v-if="item.saved !== '是'"
                ><i class="el-icon-edit"></i> 编辑</el-button
              >
              <el-button
                type="text"
                style="color: #2a60c9; font-size: 16px"
                @click="copy(item.id)"
                ><i class="el-icon-document-copy"></i> 复制</el-button
              >
              <el-button
                type="text"
                style="color: #2a60c9; font-size: 16px"
                @click="share(item.id)"
                v-if="item.saved === '是'"
                ><i class="el-icon-share"></i> 分享</el-button
              >
              <el-button
                type="text"
                style="color: #008000; font-size: 16px"
                @click="publish(item.id)"
                v-if="
                  item.saved === '否' ||
                  item.saved === '驳' ||
                  (item.saved === '待' && user.role === 'ADMIN')
                "
                ><i class="el-icon-position"></i> 发布</el-button
              >
              <el-button
                type="text"
                style="color: orange; font-size: 16px"
                @click="unpublish(item.id)"
                v-if="item.saved === '是'"
                ><i class="el-icon-top-left"></i> 撤回</el-button
              >
              <el-button
                type="text"
                style="color: brown; font-size: 16px"
                @click="showDownloadFormatDialog(item.id)"
                ><i class="el-icon-download"></i> 下载</el-button
              >
              <el-button
                type="text"
                style="color: #fc4b4b; font-size: 16px"
                @click="del(item.id)"
                ><i class="el-icon-delete"></i> 删除</el-button
              >
              <el-button
                type="text"
                style="color: #008000; font-size: 16px"
                @click="getPageCount(item.id)"
                v-if="item.saved === '是'"
                ><i class="el-icon-s-marketing"></i> 数据统计</el-button
              >
            </div>
          </div>

          <div style="width: 100px; height: 65px">
            <img
              :src="item.img"
              alt=""
              style="
                width: 100%;
                height: 100%;
                border-radius: 5px;
                display: block;
              "
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="total">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      title="信息"
      :visible.sync="fromVisible"
      width="40%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        :model="form"
        label-width="100px"
        style="padding-right: 50px"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="form.name" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板介绍" prop="descr">
          <el-input v-model="form.descr" placeholder="模板介绍"></el-input>
        </el-form-item>
        <el-form-item label="封面图" prop="img">
          <el-upload
            :action="$baseUrl + '/files/upload'"
            :headers="{ token: user.token }"
            list-type="picture"
            :on-success="handleImgSuccess"
          >
            <el-button type="primary">上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否公开" prop="open" v-if="user.role === 'ADMIN'">
          <el-radio-group v-model="form.open">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择模板" prop="templateId">
          <el-select
            v-model="form.templateId"
            placeholder="请选择模板"
            @change="handleTemplateChange"
          >
            <el-option
              v-for="item in templates"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="数据统计"
      :visible.sync="pageCountVisible"
      width="50%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div v-if="pageCount.answerCount">
        <div style="text-align: center; font-size: 16px">
          <span
            >共收集
            <strong>{{ pageCount.answerCount }}</strong> 份问卷调查结果</span
          >
        </div>

        <div
          class="card"
          v-for="(item, index) in pageCount.questionList"
          :key="index"
          style="margin-bottom: 10px"
        >
          <div style="margin-bottom: 10px">
            <strong>Q: {{ item.name }}</strong>
          </div>
          <div v-if="item.questionItemList?.length">
            <div
              v-if="item.type === '单选题'"
              :id="'chart-' + index"
              style="width: 100%; height: 400px"
            ></div>
            <div
              v-else-if="item.type === '多选题'"
              :id="'chart-' + index"
              style="width: 100%; height: 400px"
            ></div>
            <div v-else>
              <el-table
                :data="getTableData(item.questionItemList)"
                style="width: 100%"
              >
                <el-table-column prop="content" label="内容"></el-table-column>
              </el-table>
              <el-pagination
                small
                layout="prev, pager, next"
                :total="item.questionItemList.length"
                :page-size="pageSize"
                @current-change="
                  handlePageChange($event, item.questionItemList)
                "
              >
              </el-pagination>
            </div>
          </div>
          <div style="margin-top: 10px">有效填写数：{{ item.count }}</div>
        </div>
      </div>
      <div v-else style="text-align: center; color: #888">
        您未收集到任何调查结果
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pageCountVisible = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
        title="分享"
        :visible.sync="shareVisible"
        width="40%"
        :close-on-click-modal="false"
        destroy-on-close
    >
      <div style="display: flex; align-items: center">
        <span style="margin-right: 5px">链接</span>
        <el-input v-model="link" style="flex: 1; margin-right: 5px" />
        <el-button type="primary" @click="copyLink">复制</el-button>
      </div>
      <div style="display: flex; justify-content: center; margin-top: 20px">
        <img :src="qrCodeImage" alt="QR Code" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="shareVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 下载格式选择对话框 -->
    <el-dialog
      title="选择下载格式"
      :visible.sync="downloadFormatVisible"
      width="30%"
    >
      <el-button @click="downloadQuestionnairePdf(pageId)">PDF</el-button>
      <el-button @click="downloadQuestionnaireDocx(pageId)">DOCX</el-button>
      <el-button @click="downloadQuestionnaireXlsx(pageId)">XLSX</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import * as echarts from "echarts";
import html2pdf from "html2pdf.js";
import * as XLSX from "xlsx";
import QRCode from "qrcode";
import Clipboard from "clipboard";

export default {
  name: "FPages",
  data() {
    return {
      tableData: [], // 所有的数据
      pageNum: 1, // 当前的页码
      pageSize: 5, // 每页显示的个数
      total: 0,
      name: null,
      fromVisible: false,
      form: {
        templateId: null, // 新增模板ID字段
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        descr: [{ required: true, message: "请输入简介", trigger: "blur" }],
      },
      user: JSON.parse(localStorage.getItem("xm-user") || "{}"),
      pageCount: {},
      pageCountVisible: false,
      shareVisible: false,
      link: "",
      qrCodeImage: "",
      templates: [], // 模板数据
      downloadFormatVisible: false, // 下载格式选择对话框是否可见
    };
  },
  created() {
    this.load(1);
    this.loadTemplates();
  },
  methods: {
    copy(pageId) {
      this.$request.post("/pages/copy?pageId=" + pageId).then((res) => {
        if (res.code === "200") {
          this.$message.success("复制成功！");
          this.load(1);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    randomColor() {
      let arr = ["#f56c6c", "#e6a23c", "#5cb87a", "#1989fa", "#6f7ad3"];
      return arr[Math.floor(Math.random() * arr.length)]; //  0.8 * 1  = 0
    },
    copyLink() {
      let _input = document.createElement("input"); // 直接构建input

      _input.value = this.link; // 设置内容
      document.body.appendChild(_input); // 添加临时实例
      _input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(_input);
      this.$message.success("复制成功");
    },
    publish(pageid) {
      this.$confirm("确认发布此问卷吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用发布问卷的方法
          this.publishQuestionnaire(pageid);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发布",
          });
        });
    },
    unpublish(pageid) {
      this.$confirm("确认撤回发布此问卷吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 调用撤回发布问卷的方法
          this.unpublishQuestionnaire(pageid);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回发布",
          });
        });
    },
    share(pageId) {
      this.link =
          location.href.substring(0, location.href.indexOf("/front")) +
          "/realPage?pageId=" +
          pageId;
      this.generateQRCode(this.link);
      this.shareVisible = true;
    },

    generateQRCode(text) {
      QRCode.toDataURL(text, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          this.$message.error("生成二维码失败");
        } else {
          this.qrCodeImage = url;
        }
      });
    },

    copyLink() {
      let _input = document.createElement("input"); // 直接构建input
      _input.value = this.link; // 设置内容
      document.body.appendChild(_input); // 添加临时实例
      _input.select(); // 选择实例内容
      document.execCommand("Copy"); // 执行复制
      document.body.removeChild(_input);
      this.$message.success("复制成功");
    },


    getPageCount(pageId) {
      this.$request
        .get("/pageCount", {
          params: {
            pageId: pageId,
          },
        })
        .then((res) => {
          this.pageCount = res.data || {};
          this.$nextTick(() => {
            this.renderCharts();
          });
          this.pageCountVisible = true;
        });
    },
    renderCharts() {
      this.pageCount.questionList.forEach((question, index) => {
        const chartDom = document.getElementById("chart-" + index);
        if (chartDom) {
          const myChart = echarts.init(chartDom);
          const total = question.questionItemList.reduce(
              (sum, item) => sum + item.count,
              0
          );
          const option = {
            tooltip: {
              trigger: "item",
              formatter: (params) => {
                const percent = ((params.value / total) * 100).toFixed(2);
                return `${params.name}: ${params.value} (${percent}%)`;
              },
            },
            legend: {
              orient: "vertical",
              left: "left",
            },
            series: [
              {
                name: question.type === "多选题" ? "多选题" : question.name,
                type: question.type === "单选题" ? "pie" : "bar",
                radius: question.type === "单选题" ? "50%" : null,
                data: question.questionItemList.map((item) => ({
                  name: item.content,
                  value: item.count,
                })),
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                  },
                },
              },
            ],
          };
          if (question.type === "多选题") {
            option.xAxis = {
              type: "category",
              data: question.questionItemList.map((item) => item.content),
            };
            option.yAxis = {
              type: "value",
            };
            option.series[0].label = {
              show: true,
              position: "top",
            };

            // 添加折线图系列
            option.series.push({
              name: "折线图",
              type: "line",
              data: question.questionItemList.map((item) => item.count),
              smooth: true,
              label: {
                position: "top",
              },
            });
          }
          myChart.setOption(option);
        }
      });
    },
    getTableData(questionItemList) {
      const start = (this.pageNum - 1) * this.pageSize;
      const end = start + this.pageSize;
      return questionItemList.slice(start, end);
    },
    handlePageChange(page, questionItemList) {
      this.pageNum = page;
      this.getTableData(questionItemList);
    },
    del(pageId) {
      // 单个删除
      this.$confirm("您确定删除吗？", "确认删除", { type: "warning" })
        .then((response) => {
          this.$request.delete("/pages/delete/" + pageId).then((res) => {
            if (res.code === "200") {
              // 表示操作成功
              this.$message.success("操作成功");
              this.load(1);
            } else {
              this.$message.error(res.msg); // 弹出错误的信息
            }
          });
        })
        .catch(() => {});
    },
    design(pageId) {
      window.open("/front/design?pageId=" + pageId);
    },
    handleAdd() {
      // 新增数据
      this.form = {}; // 新增数据的时候清空数据
      this.fromVisible = true; // 打开弹窗
    },
    handleEdit(row) {
      // 编辑数据
      this.form = JSON.parse(JSON.stringify(row)); // 给form对象赋值  注意要深拷贝数据
      this.fromVisible = true; // 打开弹窗
    },
    save() {
      // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (this.form.templateId) {
            this.$request
              .post("/pages/copy?pageId=" + this.form.templateId)
              .then((res) => {
                if (res.code === "200") {
                  // 更新问卷名称
                  this.$request
                    .put("/pages/update", {
                      id: res.data,
                      name: this.form.name,
                      descr: this.form.descr,
                      img: this.form.img,
                      open: this.form.open,
                    })
                    .then((updateRes) => {
                      if (updateRes.code === "200") {
                        this.$message.success("创建成功！");
                        setTimeout(() => {
                          location.href = "/front/design?pageId=" + res.data;
                        }, 500);
                      } else {
                        this.$message.error(updateRes.msg);
                      }
                    });
                } else {
                  this.$message.error(res.msg);
                }
              });
          } else {
            this.$request({
              url: this.form.id ? "/pages/update" : "/pages/add",
              method: this.form.id ? "PUT" : "POST",
              data: this.form,
            }).then((res) => {
              if (res.code === "200") {
                // 表示成功保存
                this.$message.success("创建成功!");
                this.load(1);
                this.fromVisible = false;
              } else {
                this.$message.error(res.msg); // 弹出错误的信息
              }
            });
          }
        }
      });
    },
    load(pageNum) {
      // 分页查询
      if (pageNum) this.pageNum = pageNum;
      this.$request
        .get("/pages/selectPage", {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            name: this.name,
          },
        })
        .then((res) => {
          this.tableData = res.data?.list;
          this.total = res.data?.total;
        });
    },
    reset() {
      this.name = null;
      this.load(1);
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum);
    },
    handleImgSuccess(res) {
      this.form.img = res.data; // 把后台返回的图片url赋值给表单属性 img
    },
    loadTemplates() {
      this.$request
        .get("/pages/selectAll", {
          params: { open: "是" },
        })
        .then((res) => {
          this.templates = res.data || [];
        });
    },
    handleTemplateChange(value) {
      this.form.templateId = value;
    },
    // 发布问卷
    publishQuestionnaire(pageId) {
      // 获取页面数据
      const page = this.tableData.find((item) => item.id === pageId);
      if (!page) {
        this.$message.error("未找到相关问卷");
        return;
      }
      const data = JSON.parse(JSON.stringify(page));

      if (this.user.role === "USER") {
        data.saved = "待";
      } else {
        data.saved = "是";
      }
      this.$request
        .put("/pages/update/", data)
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("操作成功！");
            this.load(1);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 撤回发布问卷
    unpublishQuestionnaire(pageId) {
      // 获取页面数据
      const page = this.tableData.find((item) => item.id === pageId);
      if (!page) {
        this.$message.error("未找到相关问卷");
        return;
      }
      const data = JSON.parse(JSON.stringify(page));
      data.saved = "否";
      this.$request
        .put("/pages/update/", data)
        .then((res) => {
          if (res.code === "200") {
            this.$message.success("撤回发布成功！");
            this.load(1);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showDownloadFormatDialog(pageId) {
      // 在这里设置相关数据或逻辑，例如设置当前下载的问卷ID
      this.pageId = pageId;
      this.downloadFormatVisible = true;
    },
    // 下载问卷为Word文档
    // 修改前端代码，打印请求的完整 URL 以确认路径正确
    downloadQuestionnaireDocx(pageId) {
      const page = this.tableData.find((item) => item.id === pageId);
      if (!page) {
        this.$message.error("未找到相关问卷");
        return;
      }

      // 确认请求的 URL 和参数
      const requestUrl = `/question/selectByPageId?pageId=${pageId}`;
      console.log("Request URL:", requestUrl); // 打印请求的 URL 以进行调试

      this.$request
        .get(requestUrl)
        .then((res) => {
          const questions = res.data;
          if (!questions || questions.length === 0) {
            this.$message.error("未找到相关问卷题目");
            return;
          }
          // 创建Word文档内容
          const doc = new Document({
            sections: [
              {
                properties: {},
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: page.name,
                        bold: true,
                        size: 24,
                      }),
                    ],
                  }),
                  new Paragraph({ text: page.descr }),
                  ...this.generateQuestionnaireContent(questions),
                ],
              },
            ],
          });
          // 下载Word文档
          Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `${page.name}.docx`);
            this.$message.success("问卷下载成功");
          });
        })
        .catch((err) => {
          console.error("Error:", err); // 打印错误信息
          this.$message.error("获取问卷题目失败");
        });
    },

    // 生成问卷内容
    generateQuestionnaireContent(questions) {
      const content = [];
      questions.forEach((question, index) => {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. [${question.type}] ${question.name}`,
                bold: true,
                size: 20,
              }),
            ],
          })
        );
        if (question.type === "单选题" || question.type === "多选题") {
          question.questionItemList.forEach((item, idx) => {
            content.push(
              new Paragraph({
                text: `${String.fromCharCode(65 + idx)}. ${item.content}`,
              })
            );
          });
        } else if (question.type === "填空题") {
          content.push(
            new Paragraph({
              text: "__________", // 填空题的空白
            })
          );
        }
      });
      return content;
    },

    downloadQuestionnairePdf(pageId) {
      const page = this.tableData.find((item) => item.id === pageId);
      if (!page) {
        this.$message.error("未找到相关问卷");
        return;
      }

      const requestUrl = `/question/selectByPageId?pageId=${pageId}`;
      console.log("Request URL:", requestUrl);

      this.$request
        .get(requestUrl)
        .then((res) => {
          const questions = res.data;
          if (!questions || questions.length === 0) {
            this.$message.error("未找到相关问卷题目");
            return;
          }

          // 构建 HTML 内容
          let htmlContent = `
      <h1>${page.name}</h1>
      <p>${page.descr}</p>
      <ul>
    `;

          questions.forEach((question, index) => {
            htmlContent += `<li>${index + 1}. [${question.type}] ${
              question.name
            }</li>`;
            htmlContent += `<ul>`;

            if (question.type === "单选题" || question.type === "多选题") {
              question.questionItemList.forEach((item, idx) => {
                htmlContent += `<li>${String.fromCharCode(65 + idx)}. ${
                  item.content
                }</li>`;
              });
            } else if (question.type === "填空题") {
              htmlContent += `<li>__________</li>`; // 填空题的空白
            }

            htmlContent += `</ul>`;
          });

          htmlContent += `</ul>`;

          // 使用 html2pdf 将 HTML 转换为 PDF
          html2pdf().from(htmlContent).save(`${page.name}.pdf`);
          this.$message.success("成功获取问卷");
        })
        .catch((err) => {
          console.error("Error:", err);
          this.$message.error("获取问卷题目失败");
        });
    },

    downloadQuestionnaireXlsx(pageId) {
      const page = this.tableData.find((item) => item.id === pageId);
      if (!page) {
        this.$message.error("未找到相关问卷");
        return;
      }

      const requestUrl = `/question/selectByPageId?pageId=${pageId}`;
      console.log("Request URL:", requestUrl);

      this.$request
        .get(requestUrl)
        .then((res) => {
          const questions = res.data;
          if (!questions || questions.length === 0) {
            this.$message.error("未找到相关问卷题目");
            return;
          }

          // 创建一个工作簿
          const wb = XLSX.utils.book_new();

          // 创建一个工作表
          const wsData = [["题目", "类型", "选项/答案"]];

          questions.forEach((question, index) => {
            let options = "";
            if (question.type === "单选题" || question.type === "多选题") {
              question.questionItemList.forEach((item, idx) => {
                options += `${String.fromCharCode(65 + idx)}. ${
                  item.content
                }\n`;
              });
            } else if (question.type === "填空题") {
              options = "填空题答案将在此列显示";
            }

            wsData.push([
              `${index + 1}. ${question.name}`,
              question.type,
              options,
            ]);
          });

          const ws = XLSX.utils.aoa_to_sheet(wsData);

          // 将工作表添加到工作簿
          XLSX.utils.book_append_sheet(wb, ws, "问卷");

          // 将工作簿写入文件并下载
          XLSX.writeFile(wb, `${page.name}.xlsx`);
          this.$message.success("成功获取问卷");
        })
        .catch((err) => {
          console.error("Error:", err);
          this.$message.error("获取问卷题目失败");
        });
    },
  },
};
</script>

<style scoped>
</style>

