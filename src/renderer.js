
import { ipcRenderer } from 'electron'

new Vue({
  el: '#app',
  data: {
    dirPath: '',
    imgsHead: [
      {
        title: '选中',
        key: 'choosen',
      },
      {
        title: '路径',
        key: 'path',
        sortable: true,
      },
      {
        title: '体积',
        key: 'size',
        sortable: true,
      },
      {
        title: '尺寸',
        key: 'dimension',
        sortable: true,
      },
      {
        title: '创建时间',
        key: 'ctime',
        sortable: true,
      },
      {
        title: '修改时间',
        key: 'mtime',
        sortable: true,
      },
    ],
    imgs: [],
  },
  mounted() {
    this.dirPath = 'C:\\Users\\Duoyi\\Pictures'
    ipcRenderer.on('imgs', (event, {succeed, data}) => {
      console.log(data);
      this.imgs = data;
    });
  },
  methods: {
    openDir() {
      ipcRenderer.send('open-dir', this.dirPath);
    },
  },
});
