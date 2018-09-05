<template>
  <div>
    <button id="#addFiles">增加文件</button><br>
    <b v-if="percent !== 0">{{percent + '%'}}</b><br>
    <div v-for="item in filesList">
      {{item.name}}
    </div>
    <div>
      <button>上传</button>
    </div>
  </div>
</template>

<script>
  import plupload from "plupload";

  export default {
    name: "uploader",
    data() {
      return {
        filesList: [],
        percent: 0
      };
    },
    mounted() {
      const vm = this;

      const uploader = new plupload.Uploader({
        browse_button: "#addFiles",
        url: MAIN_CONFIH.API_ROOT + "upload"
      });

      uploader.bind("FilesAdded", function (up, files) {
        uploader.start();
      });

      uploader.bind("UploadProgress", function (up, file) {
        vm.percent = file.percent;
      });

      uploader.bind("FileUploaded", function (up, file, response) {
        var result = JSON.parse(response.response);
  
        if (result && result.status == 1 && result.data) {
          var files = result.data.files
          var file, i = 0
          while (file = files[i++]) {
            vm.filesList.push({
              url: file.url,
              name: file.name
            });
          }
        }
      });

      uploader.bind("Error", function (up, err) {
        console.log(err);
      });

      uploader.init();
    }
  };
</script>

<style lang="less">
</style>