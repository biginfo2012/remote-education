<template>
  <b-breadcrumb :items="items"/>
</template>

<script>
export default {
  props: ['heading'],
  data () {
    return {
      items: []
    }
  },
  methods: {
    getUrl (path, sub, index) {
      let pathToGo = '/' + path.split(sub)[0] + sub;
      if (pathToGo === '/app') {
        pathToGo = '/'
      }
      return pathToGo
    }
  },
  mounted () {
    let num;
    console.log(this.$route.path.substring(1, 2))
    if(this.$route.path.substring(1, 2)==='a')
      num = 7;
    else num=11;

    let path = this.$route.path.substr(num);
    let rawPaths = path.split('/');

    for (let pName in this.$route.params) {

      if (rawPaths.includes(this.$route.params[pName])&&pName!=="app") {
        rawPaths = rawPaths.filter(x => x !== this.$route.params[pName])
      }
    }
    rawPaths.map((sub, index) => {
      if(sub!=='app'){
        this.items.push({
          text: this.$t('menu.' + sub),
          // to: this.getUrl(path, sub, index)
        })
      }

    })
  }
}
</script>
