<template>
    <div class="tag-box">
        <el-tag
        v-for="(tag, index) in tags"
        :key="tag.name"
        closable
        @close="handleClose(index)"
        :type="routeName == tag.name ? '':'info'">
			<router-link :to="tag.path" class="tags-title">
				{{tag.name}}
			</router-link>
        </el-tag>

		<el-button type="primary" class="tags-button" size="small" @click="closeOther">关闭其他</el-button>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tags: [],
      routeName: ""
    };
  },
  created() {
		this.setTags(this.$route);
  },
  methods: {
    handleClose(index) {
		if (this.tags.length == 1) {
			return false;
		}

		if (this.tags[index].name == this.$route.name) {
			this.tags.splice(index, 1);
			const nextPath = this.tags[this.tags.length-1].path;
			this.$router.push({ path: nextPath });
		} else {
			this.tags.splice(index, 1);
		}
    },
    setTags(newPath) {
        this.routeName = newPath.name;

        const isExist = this.tags.some(item => {
            return item.name == newPath.name;
        });

        !isExist && this.tags.push({
			name: newPath.name,
			path: newPath.path
		});
	},
	closeOther() {
		const curTags = this.tags.filter( item => {
			return item.name == this.$route.name;
		})
		this.tags = curTags;
	}
  },
  watch: {
    $route(newPath, oldPath) {
        this.setTags(newPath)
    }
  }
};
</script>

<style lang="scss" scoped>
.tag-box {
  width: 100%;
  background: #fff;
  padding: 3px 5px 3px 5px;
  box-sizing: border-box;
}
.el-tag {
  margin-right: 10px;
  cursor: pointer;
}
.tags-title{
	text-decoration: none;
	display: inline-block;
	margin-right: 3px;
}
.el-tag{
	padding-left: 0;
}
.el-tag>a{
	color: #409EFF;
	padding-left: 10px;
}
.el-tag--info>a{
	color: #909399;
}
.tags-button{
	float:right;
}
</style>

