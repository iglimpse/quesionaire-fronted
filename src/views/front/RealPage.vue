<template>
  <div style="margin: 10px auto; width: 60%;">
    <div class="card">
      <div style="text-align: center; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid #ddd;
        font-size: 24px; color: #2a60c9; font-weight: bold">{{ pages.name }}</div>

      <div style="padding: 10px 0">
        <div v-for="(item, index) in questionList" :key="item.id" style="margin-bottom: 15px">
          <div style="margin-bottom: 10px; font-size: 18px">
            <span>{{ index+1 }}.</span>
            <span style="margin-right: 10px">{{ item.name }}</span>
            <el-tag v-if="item.type === '单选题'" >单选题</el-tag>
            <el-tag v-if="item.type === '多选题'" type="success">多选题</el-tag>
            <el-tag v-if="item.type === '填空题'" type="warning">填空题</el-tag>
            <el-tag v-if="item.type === '位置信息'" type="info">位置信息</el-tag>
            <el-tag v-if="item.type === '量表题'" type="danger">量表题</el-tag>
            <el-tag v-if="item.type === '星级评分'" type="warning">星级评分</el-tag>
            <el-tag v-if="item.type === '日期选择'">日期选择</el-tag>
          </div>
          <div style="padding-left: 20px"> <!--  遍历内容 -->
             <div v-if="item.type === '单选题'">
              <div v-for="sub in item.questionItemList" :key="sub.id" style="margin-bottom: 5px">
                <el-radio :label="sub.content"  v-model="item.answer"></el-radio>
              </div>
            </div>
            <div v-if="item.type === '多选题'">
              <el-checkbox-group v-model="item.answer">
                <div v-for="sub in item.questionItemList" :key="sub.id" style="margin-bottom: 5px">
                  <el-checkbox :label="sub.content"></el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
            <div v-if="item.type === '填空题'">
              <el-input type="textarea" v-model="item.answer"></el-input>
            </div>
            <div v-if="item.type === '位置信息'">
              <el-cascader v-model="item.answer" :options="options" filterable>
              </el-cascader>
            </div>
            <div v-if="item.type === '量表题'">
              <el-radio-group v-model="item.answer">
                <el-radio v-for="sub in item.questionItemList" :key="sub.id" :label="sub.content"></el-radio>
              </el-radio-group>
            </div>
            <div v-if="item.type === '星级评分'">
              <el-rate v-model="item.answer"></el-rate>
            </div>
            <div v-if="item.type === '日期选择'">
              <el-date-picker type="date" v-model="item.answer" placeholder="选择日期"></el-date-picker>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center">
        <el-button size="medium" type="primary" @click="submitAnswer">提 交</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import { locationData } from '@/assets/location'

export default {
  name: "RealPage",
  data() {
    return {
      pages: {},
      questionList: [],
      options:locationData,
    }
  },
  created() {
    this.load()
  },
  methods: {
    submitAnswer() {
      for (let i = 0; i < this.questionList.length; i++) {
        if (!this.questionList[i].answer) {
          this.$message.warning('请填写完所有题目再提交')
          return
        }
      }
      let no = new Date().getTime()
      let answerList = []
      this.questionList.forEach(item => {
        let content = item.answer
         if (item.type === '位置信息'){
          content = item.answer[2]
        }
        if (item.type === '多选题') {
          content = JSON.stringify(content)   // 把数组转换成字符串存到数据库
        }
        answerList.push({ questionId: item.id, content: content, pageId: item.pageId, no: no+''})
      })
      this.$request.post('/answer/addBatch', answerList).then(res => {
        if (res.code === '200') {  // 表示成功保存
          this.$message.success('提交成功')
          setTimeout(() => {
            location.href = '/thanks'
          }, 500)
        } else {
          this.$message.error(res.msg)  // 弹出错误的信息
        }
      })
    },
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
        this.questionList.forEach(item => {
          if (item.type === '多选题') {
            this.$set(item, 'answer', [])   // 注意：多选的时候要设置一个空的数组，否则会报错
          } else {
            this.$set(item, 'answer', '')
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>