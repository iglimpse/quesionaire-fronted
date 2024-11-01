<template>
  <el-container class="main-content">

    <!--创建问题的导引侧边栏-->
    <el-aside style="width: 200px" class="aside-question">
      <el-collapse>
        <el-collapse-item title="选择题">
          <el-button type="text" @click="addQuestion('单选题')">单选题</el-button>
          <el-button type="text" @click="addQuestion('多选题')">多选题</el-button>
          <el-button type="text" @click="addQuestion('量表题')">量表题</el-button>
        </el-collapse-item>
        <el-collapse-item title="填空题">
          <el-button type="text" @click="addQuestion('填空题')">填空题</el-button>
          <el-button type="text" @click="addQuestion('位置信息')">位置信息</el-button>
        </el-collapse-item>
        <el-collapse-item title="特殊">
          <el-button type="text" @click="addQuestion('星级评分')">星级评分</el-button>
          <el-button type="text" @click="addQuestion('日期选择')">日期选择</el-button>
        </el-collapse-item>
      </el-collapse>
    </el-aside>

    <!--创建问题的主体部分-->
    <el-main>
      <div class="card">
        <div style="display: flex; margin-bottom: 20px">
          <!--发布状态显示-->
          <div style="flex: 1">
            <div>
              <span style="font-size: 24px; margin-right: 10px">{{ pages.name }}</span>
              <el-tag v-if="pages.saved === '否'" type="danger">未发布</el-tag>
              <el-tag v-if="pages.saved === '是'" type="success">已发布</el-tag>
              <el-tag v-if="pages.saved === '待'" type="warning">待审核</el-tag>
              <el-tooltip v-if="pages.saved === '驳'" class="item" effect="dark" placement="top">
                <div slot="content">
                    <p>审核失败，驳回理由: {{ pages.reason }}</p>
                </div>
                <el-tag style="background-color: #ff4d4d; color: #ffffff;">审核失败</el-tag>
              </el-tooltip>
            </div>
          </div>
          <!--问卷操作按钮-->
          <div>
            <el-button type="primary" @click="share"><i class="el-icon-share"></i> 分享</el-button>
            <el-button type="info" @click="preview(pages.id)"><i class="el-icon-video-play"></i> 预览</el-button>
            <el-button type="success" class="btn-green" :disabled="pages.saved === '是'" @click="handleSaved"><i
                class="el-icon-s-promotion"></i> 发布
            </el-button>
          </div>
        </div>

        <!--问卷问题列表-->
        <div>
          <!--问题显示-->
          <div v-for="(item, index) in questionList" :key="item.id" style="margin-bottom: 20px">
            <!--题目项及类型显示-->
            <div>
              <span style="font-weight: bold; margin-right: 5px">题目{{ index + 1 }}</span>
              <el-input v-model="item.name" style="width: 70%; margin-right: 5px"
                        @change="changeQuestionName(item)"></el-input>
              <el-tag style="margin-right: 5px; color: #2a60c9" v-if="item.type === '单选题'">{{ item.type }}</el-tag>
              <el-tag style="margin-right: 5px; color: orange" v-if="item.type === '多选题'">{{ item.type }}</el-tag>
              <el-tag style="margin-right: 5px; color: seagreen" v-if="item.type === '填空题'">{{ item.type }}</el-tag>
               <el-tag style="margin-right: 5px; color: purple" v-if="item.type === '位置信息'">{{ item.type }}</el-tag>
              <el-tag style="margin-right: 5px; color: #2a60c9" v-if="item.type === '量表题'">{{ item.type }}</el-tag>
              <el-tag style="margin-right: 5px; color: orange" v-if="item.type === '星级评分'">{{ item.type }}</el-tag>
              <el-tag style="margin-right: 5px; color: seagreen" v-if="item.type === '日期选择'">{{ item.type }}</el-tag>
              <span style="color: red; cursor: pointer; font-size: 12px" @click="delQuestion(item.id)"><i
                  class="el-icon-delete"></i>删除</span>
            </div>
            <!-- 选项 -->
            <!-- <div style="padding-left: 40px" v-if="item.questionItemList?.length || item.newContent !== undefined">
              <! 内容及修改删除 -->
              <!-- <div v-for="(sub, subIndex) in item.questionItemList" :key="sub.id" style="margin: 10px 0">
                <div>
                  <span style="margin-right: 5px">选项{{ subIndex + 1 }}</span>
                  <el-input v-model="sub.content" style="width: 50%; margin-right: 5px"
                            @change="changeQuestionItem(sub)"></el-input>
                  <span style="color: red; cursor: pointer; font-size: 12px" @click="delQuestionItem(sub.id)"><i
                      class="el-icon-delete"></i>删除</span>
                </div>
              </div> -->
              <!--新选项添加-->
              <!-- <div v-if="item.newContent !== undefined">
                <span style="margin-right: 5px; color: #2a60c9">新选项</span>
                <el-input v-model="item.newContent" style="width: 50%; margin-right: 5px"></el-input>
                <el-button type="primary" class="btn-green" size="mini" @click="addQuestionItem(item)">确认添加
                </el-button>
              </div>
            </div> --> 
            <!--选项-->
            <div style="padding-left: 40px" v-if="item.questionItemList?.length">
              <!--内容及修改删除-->
              <div v-for="(sub, subIndex) in item.questionItemList" :key="sub.id" style="margin: 10px 0">
                <div>
                  <span style="margin-right: 5px">选项{{ subIndex + 1 }}</span>
                  <el-input v-model="sub.content" style="width: 50%; margin-right: 5px"
                            @change="changeQuestionItem(sub)"></el-input>
                  <span style="color: red; cursor: pointer; font-size: 12px" @click="delQuestionItem(sub.id)"><i
                        class="el-icon-delete"></i>删除</span>
                </div>
              </div>
            </div>
            <!--新选项添加-->
            <div v-if="item.type === '单选题' || item.type === '多选题' || item.type === '量表题'">
              <span style="margin-right: 5px; color: #2a60c9">新选项</span>
              <el-input v-model="item.newContent" style="width: 50%; margin-right: 5px"></el-input>
              <el-button type="primary" class="btn-green" size="mini" @click="addQuestionItem(item)">确认添加
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!--问卷发布信息弹出框-->
      <el-dialog title="分享" :visible.sync="shareVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
        <div style="display: flex; align-items: center">
          <span style="margin-right: 5px">链接</span> <el-input v-model="link" style="flex: 1; margin-right: 5px" />
          <el-button type="primary" @click="copyLink">复制</el-button>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="shareVisible = false">关 闭</el-button>
        </div>
      </el-dialog>

      <!-- 返回按钮 -->
      <div style="display: flex; justify-content: center; margin-top: 20px;">
        <el-button type="info" @click="goBack">返回</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "Design",
  data() {
    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      pages: {},
      questionList: [],
      shareVisible: false,
      link: ''
    }
  },
  created() {
    this.load()
  },
  destroyed () {
  },
  methods: {
    // 将链接复制到剪切板
    copyLink() {
      let _input = document.createElement("input");   // 直接构建input
      _input.value = this.link;  // 设置内容
      document.body.appendChild(_input);    // 添加临时实例
      _input.select();   // 选择实例内容
      document.execCommand("Copy");   // 执行复制
      document.body.removeChild(_input)
      this.$message.success("复制成功")
    },
    // 分享（检测问卷状态并生成链接）
    share() {
      if (this.pages.saved !==  '是') {
        this.$message.warning('未公开的问卷不允许分享')
        return
      }

      this.link = location.href.substring(0, location.href.indexOf('/front')) + '/realPage?pageId=' + this.pages.id
      this.shareVisible = true
    },
    // 发布 （更改问卷状态）
    handleSaved() {
      if (!this.validate()) { // 校验没通过  不能发布
        return
      }
      this.$confirm('您确认发布吗？', '确认发布', {type: "warning"}).then(response => {
        let data = JSON.parse(JSON.stringify(this.pages))
        //data.saved = '待';
        if(this.user.role==='USER') {
          data.saved = '待';
        }else{
          data.saved = '是';
        }
        this.$request.put('/pages/update/', data).then(res => {
          if (res.code === '200') {  // 表示成功保存
            this.$message.success('操作成功')
            this.load()
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(err => console.log(err))
    },
    // 问卷可发布性校验
    validate() {
      // 空问卷检验
      if (!this.questionList?.length) {
        this.$message.warning('您未添加任何题目')
        return false
      }
      // 不可发布试题校验
      for (let i = 0; i < this.questionList.length; i++) {
        // 通用检验
        // 题目无名称
        if (!this.questionList[i].name) {
          this.$message.warning('请填写题目名称')
          return false
        }

        // 特殊检验
        // 选择类检验
        if (this.questionList[i].type === '单选题' || this.questionList[i].type === '多选题') {
          // 选择无选项
          if (!this.questionList[i].questionItemList?.length) {
            this.$message.warning('单选题和多选题需要添加选项')
            return false
          }
          // 选项无内容
          this.questionList[i].questionItemList.forEach(item => {
            if (!item.content) {
              this.$message.warning('请完善选项内容')
              return false
            }
          })
        }
      }
      return true
    },
    // 预览 （打开新页面查看问卷效果）
    preview(pageId) {
      if (this.validate()) { // 校验通过了
        window.open('/front/preview?pageId=' + pageId)
      }
    },
    // 添加新选项
    addQuestionItem(question) {
      // 检查新选项是否与已有选项重复
      const duplicateIndex = question.questionItemList.findIndex(item => item.content === question.newContent);
      if (duplicateIndex !== -1) {
        this.$message.warning(`新选项与第${duplicateIndex + 1}个选项重复，请重新输入`);
        return;
      }

      this.$request.post('/questionItem/add', {questionId: question.id, content: question.newContent}).then(res => {
        if (res.code === '200') {  // 表示成功保存
          //this.$message.success('操作成功')
          this.load()
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
    // 添加新问题
    addQuestion(type) {
      this.$request.post('/question/addForUser', {name: '', type: type, pageId: this.pages.id}).then(res => {
        if (res.code === '200') {  // 表示成功保存
          //this.$message.success('操作成功')
          this.load()
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
    // 改变题目名称
    changeQuestionName(question) {
      let data = JSON.parse(JSON.stringify(question))
      this.$request.put('/question/update', data).then(res => {
        if (res.code === '200') {  // 表示成功保存
          //this.$message.success('更新成功')
          this.load()
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
    // 改变选项内容
    changeQuestionItem(questionItem) {
      let data = JSON.parse(JSON.stringify(questionItem))
      this.$request.put('/questionItem/update', data).then(res => {
        if (res.code === '200') {  // 表示成功保存
          // this.$message.success('更新成功')
          this.load()
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
    // 删除问题
    delQuestion(questionId) {
      this.$request.delete('/question/delete/' + questionId).then(res => {
        if (res.code === '200') {   // 表示操作成功
          this.$message.success('操作成功')
          this.load()
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
          .catch(() => {
          })
    },
    // 删除选项
    delQuestionItem(questionItemId) {   // 单个删除
      this.$request.delete('/questionItem/delete/' + questionItemId).then(res => {
        if (res.code === '200') {   // 表示操作成功
          // this.$message.success('操作成功')
          this.load()
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
          .catch(() => {
          })
    },
    // 重新获取数据
    load() {
      let pageId = this.$route.query.pageId
      this.$request.get('/pages/selectById/' + pageId).then(res => {
        this.pages = res.data || {}
      })

      this.$request.get('/question/selectByPageId', {
        params: {
          pageId: pageId
        }
      }).then(res => {
        this.questionList = res.data || []
        this.questionList.forEach(question => {
          if (question.type === '单选题' || question.type === '多选题') {
            if (!question.newContent) {
              this.$set(question, 'newContent', '')
            }
          }
        })
      })
    },
    // 返回按钮方法
    goBack() {
      this.$router.push({ path: '/front/home' });
    }

  }
}
</script>

<style scoped>

</style>
