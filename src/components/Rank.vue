<template>
    <link rel="stylesheet" href="//unpkg.com/element-plus/dist/index.css" />
    <div class="rank-container">
            <div class="rank">
                <div class="grid-content ep-bg-purple-light">
                    <div class="title">
                        <span >Most Popular Book</span>
                    </div>
                    <el-table :data="bookRank" border stripe>
                        <el-table-column type="index" />
                        <el-table-column prop="bookname" label="Book Name" />
                        <el-table-column prop="author" label="Author" />
                        <el-table-column prop="count" label="Times of Reading" />
                    </el-table>
                </div>
            </div>
            <div class="rank">
                <div class="grid-content ep-bg-purple">
                    <div class="title">
                        <span >Most Popular Author</span>
                    </div>
                    <el-table :data="authorRank" border stripe>
                        <el-table-column type="index" />
                        <el-table-column prop="author" label="Author" />
                        <el-table-column prop="count" label="Times of Reading" />

                    </el-table>
                </div>
            </div>
    </div>
</template>

<script>
export default{
    async created(){
        await this.getBookRank();
        await this.getAuthorRank();
    },
    data(){
        return {
            bookRank:[],
            authorRank: []
        }
    },
    methods: {
        async getBookRank(){
            const { data } = await this.$http.get("/getBookRank");
            this.bookRank = data.rank;
        },
        async getAuthorRank(){
            const { data } = await this.$http.get("/getAuthorRank");
            this.authorRank = data.rank;
            console.log(this.authorRank)
        }
    }
}
</script>

<style lang="less" scoped>
.rank-container{
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.rank {
  width: 47%;
  border-radius: 4px;
  border: 1px solid red;
  margin: 0 10 0 10;
  padding: 10px
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.title{
    text-align: center;
    margin: 10px;
    font-size: large;
    color: #545c64;
    padding: 5px;
}
</style>