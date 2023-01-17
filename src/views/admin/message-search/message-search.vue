<template>
  <div>
    <div class="breadcrumb-container">
      <b-row>
        <b-colxx xxs="12">
          <piaf-breadcrumb/>
        </b-colxx>
      </b-row>
    </div>
    <b-card class="main-without-tab" v-show="pageStatus === 'table'" style="margin-top: 20px;">
      <div class="h-100 d-flex flex-column">
        <b-row class="pt-2">
          <b-col cols="8">
            <b-row>
              <b-col>
                <b-form-group :label="$t('admin.org')">
                  <b-form-select v-model="filter.mode" :options="operationModeOptions" plain/>
                </b-form-group>
              </b-col>
              <b-col>
                <b-form-group :label="$t('admin.class-name')">
                  <b-form-select v-model="filter.taskStatus" :options="statusOptions" plain/>
                </b-form-group>
              </b-col>
              <b-col/>
            </b-row>
          </b-col>
          <b-col cols="4" class="d-flex justify-content-end align-items-center">
            <div>
              <b-button size="sm" class="ml-2" variant="info default" @click="onSearchButton()">
                <i class="icofont-search-1"/>&nbsp;{{ $t('btn.search') }}
              </b-button>
            </div>
          </b-col>
        </b-row>

        <b-row class="flex-grow-1">
          <b-col cols="12">
            <div class="table-wrapper table-responsive">
              <div v-show="loadingTable" class="overlay flex flex-column items-center justify-center">
                <div class="loading"></div>
              </div>
              <vuetable
                ref="taskVuetable"
                track-by="taskId"
                :api-mode="false"
                :api-url="taskVuetableItems.apiUrl"
                :fields="taskVuetableItems.fields"
                :row-class="rowColour"
                :per-page="taskVuetableItems.perPage"
                pagination-path="pagination"
                class="table-hover"
                @vuetable:checkbox-toggled="onCheckStatusChange"
                @vuetable:pagination-data="onTaskVuetablePaginationData"
                @vuetable:loading="loadingTable = true"
                @vuetable:loaded="loadingTable = false"
              >
                <template slot="taskNumber" slot-scope="props">
                    <span class="cursor-p text-primary" @click="onRowClicked(props.rowData.taskId)">
                      {{props.rowData.taskNumber}}
                    </span>
                </template>
                <template slot="mode" slot-scope="props">
                  <div v-if="props.rowData.modeName==null"></div>
                  <div v-else>
                    <div v-if="props.rowData.modeName===getModeDataCode('all')">
                      <b-img draggable="false" src="/assets/img/man_scan_icon.svg" class="operation-icon"/>
                      <b-img draggable="false" src="/assets/img/monitors_icon.svg" class="operation-icon"/>
                      <b-img draggable="false" src="/assets/img/mobile_icon.svg" class="operation-icon"/>
                    </div>
                    <div v-if="props.rowData.modeName===getModeDataCode('scan')">
                      <b-img draggable="false" src="/assets/img/man_scan_icon.svg" class="operation-icon"/>
                    </div>
                    <div v-if="props.rowData.modeName===getModeDataCode('scan+judge')">
                      <b-img draggable="false" src="/assets/img/man_scan_icon.svg" class="operation-icon"/>
                      <b-img draggable="false" src="/assets/img/monitors_icon.svg" class="operation-icon"/>
                    </div>
                    <div v-if="props.rowData.modeName===getModeDataCode('scan+hand')">
                      <b-img draggable="false" src="/assets/img/man_scan_icon.svg" class="operation-icon"/>
                      <b-img draggable="false" src="/assets/img/mobile_icon.svg" class="operation-icon"/>
                    </div>
                  </div>
                </template>
              </vuetable>
            </div>
            <div class="pagination-wrapper">
              <vuetable-pagination-bootstrap
                ref="taskVuetablePagination"
                :initial-per-page="taskVuetableItems.perPage"
                @vuetable-pagination:change-page="onTaskVuetableChangePage"
                @onUpdatePerPage="taskVuetableItems.perPage = Number($event)"
              />
            </div>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>
<style lang="scss">
.vue_slider{
  height: 15px !important;
  width: -moz-available;
  width: -webkit-fill-available;
}
.col-form-label {
  margin-bottom: 1px;
}
.col-30 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 30%;
  flex: 0 0 30%;
  max-width: 30%;
}

.col-70 {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 70%;
  flex: 0 0 70%;
  max-width: 70%;
}

.form-group-margin {
  margin-bottom: 1.5rem;
}

.form-input-border {
  background-color: white !important;
  border: 1px solid #ebebeb;
}

span.cursor-p {
  cursor: pointer !important;
}

.bg-orange {
  background-color: pink;
}

.slide-class {
  margin-top: -30px;
}

.rounded-span {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  cursor: pointer;
  background-color: #007bff;
}

.operation-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.icon-container {
  font-size: 20px;

  .icofont-star {
    color: #ffe400;
  }

  .icofont-search-user {
    color: #ff9c0e;
  }

  .icofont-female {
    color: #fe687f;
  }
}

.control-group {
  display: flex;
  align-items: flex-start;

  .control-btn-wrapper {
    display: flex;
    flex-grow: 1;
    flex-wrap: wrap;

    .control-btn {
      width: calc(100% / 6);
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 5px;

      img {
        $size: 35px;
        width: $size;
        height: $size;
        margin-bottom: 6px;
      }

      span {
        display: block;
      }
    }
  }

  .switch-wrapper {
    width: 60px;
    height: 40px;
    display: flex;
    align-items: center;

    .separator {
      border: 0;
      width: 1px;
      height: 30px;
      background: #1e9dd2;
      flex-shrink: 0;
    }

    .switch {
      .vue-switcher {
        display: flex;
        height: 100%;
        margin: 0;
        transform: scale(0.8);
      }
    }
  }

  @media screen and (max-width: 1700px) {

    .control-btn-wrapper {
      .control-btn {
        img {
          $size: 28px;
          width: $size !important;
          height: $size !important;
        }
      }
    }
    .switch-wrapper {
      height: 28px;

      .separator {
        height: 28px;
      }
    }

  }
}

.history-chart {

  $ratio: 12.8;

  width: 100%;
  padding-bottom: 100% / $ratio;
  position: relative;

  margin-bottom: 24px;

  & > :first-child {
    left: 0;
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;

    background: url("/assets/img/history_chart.png") no-repeat;
    background-size: contain;

    $elements: 5;
    @for $i from 0 to $elements {
      .part:nth-child(#{$i + 1}) {
        position: absolute;
        top: 25%;
        bottom: 25%;
        left: 2% + 20% * $i;
        width: 20% - 4%;
        display: flex;
        color: white;
        align-items: center;
        justify-content: space-between;

        $date-color: #0c70ab;

        .top-date {
          color: $date-color;
          position: absolute;
          top: 104%;
          left: -6%;
        }

        .bottom-date {
          color: $date-color;
          position: absolute;
          bottom: 104%;
          right: 2%;
        }
      }
    }
  }
}

.evidence-gallery {
  .col-auto {
    padding-right: 0px;
  }
}

</style>
<script>

import {apiBaseUrl} from "../../../constants/config";
import Vuetable from '../../../components/Vuetable2/Vuetable'
import VuetablePaginationBootstrap from "../../../components/Common/VuetablePaginationBootstrap";
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css'
import {
  getApiManager,
  getDateTimeWithFormat,
  downLoadFileFromServer,
  printFileFromServer,
  getApiManagerError, isAccountValid
} from '../../../api';
import {responseMessages} from '../../../constants/response-messages';
import 'vue-tree-halower/dist/halower-tree.min.css'
import Switches from 'vue-switches';
import {LightGallery} from 'vue-light-gallery';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/zh-cn';
import {loadImageCanvas, imageFilterById, getDirection, getLocale} from '../../../utils'
import VueSlideBar from 'vue-slide-bar'
import {checkPermissionItem} from "../../../utils";
import Videoplayer from '../../../components/Common/VideoPlayer';
import {validationMixin} from "vuelidate";
import Modal from '../../../components/Modal/modal';
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

const {required, email, minLength, maxLength, alphaNum} = require('vuelidate/lib/validators');

export default {
  components: {
    'v-select': vSelect,
    'vuetable': Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'switches': Switches,
    'light-gallery': LightGallery,
    'date-picker': DatePicker,
    'video-player': Videoplayer,
    VueSlideBar,
    VueSlider,
    Modal
  },
  mixins: [validationMixin],
  validations: {
    fileSelection: {
      required
    },
  },
  mounted() {
    this.getSiteOption();
  },
  data() {
    return {
      value1: 0,
      value2: [0, 0],
      dotOptions: [{
        disabled: true
      }, {
        disabled: false
      }],
      link: '',
      timer: '',
      timeout: 5000,
      params: {},
      name: '',
      imgUrl:[],
      isExpanded: false,
      loadingTable:false,
      pageStatus: 'table',
      power: false,
      siteData: [],
      showPage: [],
      renderedCheckList:[],

      fileSelection: [],
      direction: getDirection().direction,
      fileSelectionOptions: [
        {value: 'docx', label: 'WORD'},
        {value: 'xlsx', label: 'EXCEL'},
        {value: 'pdf', label: 'PDF'},
      ],
      isModalVisible: false,

      isSlidebar1Expended: false,
      isSlidebar2Expended: false,
      slidebar1value: [0, 0],
      slidebar2value: [0, 0],
      slider1OldValue:0,
      slider1NewValue:0,
      slider2OldValue:0,
      slider2NewValue:0,

      slider: {
        lineHeight: 10,
        processStyle: {
          backgroundColor: 'blue'
        }
      },

      validIcon: null,

      task_id: null,

      apiBaseURL: '',

      thumbs: [],
      images: [],
      videos: [],
      photoIndex: null,
      showVideo: false,

      widthRate: [],
      heightRate: [],
      imgRect: [],
      cartoonRect: [],
      rRects: [],
      rectAdd: [],
      rectDel: [],
      imageUrls: [],

      imagesInfo: [],
      cartoonsInfo: [],
      imageRectR: [],
      imageRectL: [],
      cartoonRectR: [],
      cartoonRectL: [],
      cntCartoon: 0,
      orderCartoon: 0,
      mode: null,
      conclusionType: null,

      videoOptions: {
        autoplay: true,
        language: 'zh',//todo need to set that lang setting with multiple.
        poster: '/assets/img/glock-thumb.jpg', //todo need to set its image data differently if needed
        sources: [{
          type: "video/mp4",
          src: '/assets/img/113.mp4',
        }],
      },
      videoOption: {},
      selectedVideo: null,

      defaultUserId: 10000,

      history_id: 0,
      collectionLabel: [],
      collectionLabelOptions: [
        {value: '1000002701', label: '好'},
        {value: '1000002702', label: '良'},
        {value: '1000002703', label: '差'},
        {value: '1000002704', label: '非常差'}
      ],
      collectionLabelOption: [],

      isCheckAll: false,
      filter: {
        taskNumber: null,
        mode: null,
        taskStatus: null,
        fieldId: null,
        userName: null,
        startTime: null,
        endTime: null
        // TODO: search filter
      },

      saveFilter: {
        taskNumber: null,
        mode: null,
        taskStatus: null,
        fieldId: null,
        userName: null,
        startTime: null,
        endTime: null
        // TODO: search filter
      },


      taskDetailForm: {
        taskNumber: null,
        fieldName: null,
        deviceName: null,
        gender: "",
        handDeviceName: 0,
        judgeDeviceName: null,
        workModeName: null,
        handTaskResult: null,
        handAppraise: null,
        note: null,
      },

      detailForm: {},
      judgeStartTime: null,
      judgeDeviceName: null,
      judgeUserName: null,
      judgeUserId: null,
      handStartTime: null,
      handDeviceName: null,
      handUserName: null,

      imageUrl: null,
      cartoonUrl: null,
      handGoodDataCode: ['1000001601', '1000001602', '1000001603', '1000001604', '1000001605'],
      handGoodExpanded: [false, false, false, false, false],
      handGoodDataCodeExpanded: [],
      handGoodDataCodeValue: {
        1000001601: {text: '安眠药'},
        1000001602: {text: '仿真枪'},
        1000001603: {text: '玩具枪'},
        1000001604: {text: '气枪'},
        1000001605: {text: '打火机'},
      },
      // TODO: select options

      onSiteOption: [],

      httpOption: null,
      apiUrl: null,

      operationModeOptions: [
        {value: null, text: this.$t('personal-inspection.all')},
        {value: '1', text: this.$t('personal-inspection.security-instrument')},
        {value: '2', text: this.$t('personal-inspection.security-instrument-and-hand-test')},
        {value: '3', text: this.$t('personal-inspection.security-instrument-and-manual-test')},
        {value: '4', text: this.$t('personal-inspection.security-instrument-and-hand-test-and-device')},
      ],

      statusOptions: [
        {value: null, text: this.$t('personal-inspection.all')},
        {value: '1000001102', text: this.$t('maintenance-management.process-task.dispatch')},
        {value: '1000001103', text: this.$t('maintenance-management.process-task.judge')},
        {value: '1000001104', text: this.$t('maintenance-management.process-task.hand')},
        {value: '1000001106', text: this.$t('maintenance-management.process-task.scan')}
      ],

      taskVuetableItems: {
        apiUrl: `${apiBaseUrl}/task/process-task/get-by-filter-and-page`,
        fields: [
          {
            name: '__sequence',
            title: this.$t('admin.no'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: '__slot:taskNumber',
            sortField: 'taskNumber',
            title: this.$t('admin.org'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: '__slot:mode',
            title: this.$t('admin.course-name'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: 'taskStatus',
            title: this.$t('admin.class-name'),
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: (value) => {
              const dictionary = {
                "1000001102": `<span>${this.$t('maintenance-management.process-task.dispatch')}</span>`,
                "1000001103": `<span>${this.$t('maintenance-management.process-task.judge')}</span>`,
                "1000001104": `<span>${this.$t('maintenance-management.process-task.hand')}</span>`,
                "1000001106": `<span>${this.$t('maintenance-management.process-task.scan')}</span>`

              };
              if (!dictionary.hasOwnProperty(value)) return '';
              return dictionary[value];
            }
          },
          {
            name: 'fieldDesignation',
            title: this.$t('admin.receiver-name'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: 'scanDeviceName',
            title: this.$t('admin.mess-type'),
            titleClass: 'text-center',
            dataClass: 'text-center',
          },
          {
            name: 'scanPointsManName',
            title: this.$t('admin.mess-content'),
            titleClass: 'text-center',
            dataClass: 'text-center',
          },
          {
            name: 'scanStartTime',
            sortField: 'scanStartTime',
            title: this.$t('admin.status'),
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: (scanStartTime) => {
              if (scanStartTime == null) return '';
              return getDateTimeWithFormat(scanStartTime);
            }
          },
          {
            name: 'scanStartTime',
            sortField: 'scanStartTime',
            title: this.$t('admin.sent-time'),
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: (scanStartTime) => {
              if (scanStartTime == null) return '';
              return getDateTimeWithFormat(scanStartTime);
            }
          },
        ],
        perPage: 10,
      },
    }
  },
  created() {
    //this.timer = setInterval(this.autoUpdate, 20000)
  },
  beforeDestroy() {
    //clearInterval(this.timer)
  },
  watch: {
    'taskVuetableItems.perPage': function (newVal) {
      this.$refs.taskVuetable.refresh();
      this.changeCheckAllStatus();
    },

    pageStatus(newval) {
      // if (newval === 'show') {
      //   clearInterval(this.timer);
      // } else {
      //   this.timer = setInterval(() => this.autoUpdate(), 20000);
      // }
    },

    siteData: function (newVal, oldVal) {
      this.onSiteOption = [];
      let nest = (newVal, id = 0, depth = 1) =>
        newVal
          .filter(item => item.parentFieldId == id)
          .map(item => ({
            data: {fieldId: item.fieldId},
            children: nest(newVal, item.fieldId, depth + 1),
            text: item.fieldDesignation
          }));
      let treeData = nest(newVal);

      let generateSpace = (count) => {
        let string = '';
        while (count--) {
          string += '&nbsp;&nbsp;&nbsp;&nbsp;';
        }
        return string;
      };

      let changeFieldTree = (treeData, index) => {
        if (!treeData || treeData.length === 0) {
          return;
        }
        let tmp = treeData;
        for (let i = 0; i < tmp.length; i++) {
          changeFieldTree(tmp[i].children, index + 1);
          this.onSiteOption.unshift({
            value: tmp[i].data.fieldId,
            html: `${generateSpace(index)}${tmp[i].text}`
          });
        }
      };

      changeFieldTree(treeData, 1);
      this.onSiteOption.unshift({
        value: null,
        html: `${this.$t('permission-management.all')}`
      });
    },

    power(newValue) {

      this.isSlidebar1Expended = false;
      this.isSlidebar2Expended = false;
      this.loadImage();

    },

    // slidebar1value(newsValue, oldValue) {
    //
    //   // if(newsValue[1] === 0){
    //   //   this.loadImage();
    //   //   return;
    //   // }
    //
    //   if (oldValue[1] < newsValue[1]) {
    //     //for (let i = oldValue[1]; i < newsValue[1]; i++) {
    //       this.filterId(5);
    //     //}
    //   } else if(oldValue[1] > newsValue[1]) {
    //     //for (let i = newsValue[1]; i < oldValue[1]; i++) {
    //       this.filterId(6);
    //     //}
    //   }
    // },
    // slidebar2value(newsValue, oldValue) {
    //
    //   // if(newsValue[1] === 0){
    //   //   this.loadImage();
    //   //   return;
    //   // }
    //
    //   if (oldValue[1] < newsValue[1]) {
    //     //for (let i = oldValue[1]; i < newsValue[1]; i++) {
    //       this.filterId(7);
    //     //}
    //   } else if(oldValue[1] > newsValue[1]) {
    //     //for (let i = newsValue[1]; i < oldValue[1]; i++) {
    //       this.filterId(8);
    //     //}
    //   }
    // },
  },
  methods: {
    setOldBrightness(){
      this.slider1OldValue = this.slidebar1value[1];
    },
    changeBrightness(){
      if (this.slider1OldValue < this.slidebar1value[1]) {
        //for (let i = this.slider1OldValue; i < slidebar1value; i++) {
        this.filterId(5, this.slidebar1value[1]-this.slider1OldValue);
        //}
      } else if(this.slider1OldValue > this.slidebar1value[1]) {
        //for (let i = slidebar1value; i < this.slider1OldValue; i++) {
        this.filterId(6, this.slider1OldValue - this.slidebar1value[1]);
        //}
      }
      //this.slider1OldValue = this.slidebar1value[1];

    },
    setOldContrast(){
      this.slider2OldValue = this.slidebar2value[1]
    },
    changeContrast(){
      if (this.slider2OldValue < this.slidebar2value[1]) {
        //for (let i = this.slider2OldValue; i < this.slidebar2value[1]; i++) {
        this.filterId(7, this.slidebar2value[1]-this.slider2OldValue);
        //}
      } else if(this.slider2OldValue > this.slidebar2value[1]) {
        //for (let i = this.slidebar2value[1]; i < this.slider2OldValue; i++) {
        this.filterId(8, this.slider2OldValue - this.slidebar2value[1]);
        //}
      }
      //this.slider2OldValue = this.slidebar2value[1]
    },
    cancelAutoUpdate() {
      //clearInterval(this.timer)
    },
    selectAll(value){
      this.$refs.taskVuetable.toggleAllCheckboxes('__checkbox', {target: {checked: value}});
      this.$refs.taskVuetable.isCheckAllStatus=value;
      let checkBoxId = "vuetable-check-header-2-" + this.$refs.taskVuetable.uuid;
      let checkAllButton =  document.getElementById(checkBoxId);
      checkAllButton.checked = value;
    },
    selectNone(){
      this.$refs.taskVuetable.isCheckAllStatus=false;
      let checkBoxId = "vuetable-check-header-2-" + this.$refs.taskVuetable.uuid;
      let checkAllButton =  document.getElementById(checkBoxId);
      checkAllButton.checked = false;
    },
    changeCheckAllStatus(){
      let selectList = this.$refs.taskVuetable.selectedTo;
      let renderedList = this.renderedCheckList;
      if(selectList.length>=renderedList.length){
        let isEqual = false;
        for(let i=0; i<renderedList.length; i++){
          isEqual = false;
          for(let j=0; j<selectList.length; j++){
            if(renderedList[i]===selectList[j]) {j=selectList.length; isEqual=true}
          }
          if(isEqual===false){
            this.selectNone();
            break;
          }
          if(i===renderedList.length-1){
            this.selectAll(true);
          }
        }
      }
      else {
        this.selectNone();
      }

    },
    onCheckStatusChange(isChecked){
      if(isChecked){
        this.changeCheckAllStatus();
      }
      else {
        this.selectNone();
      }
    },
    closeModal() {
      this.isModalVisible = false;
    },
    checkPermItem(value) {
      return checkPermissionItem(value);
    },

    onVideoClick(video) {
      this.videoOptions.sources.src = video.src;
      this.$refs.videoPlayer.initialize();
      this.showVideo = true;
    },

    finishVideoShow() {
      this.showVideo = false;
      this.$refs.videoPlayer.dispose();
    },

    onThumbClick(index) {
      this.photoIndex = index;
      this.isOpen = true;
    },

    handleHide() {
      this.photoIndex = null;
      this.isOpen = false;
    },

    onlyOneSlide(value) {
      if (this.power === true) {
        if (value === 1) {
          this.isSlidebar1Expended = !this.isSlidebar1Expended;
          this.isSlidebar2Expended = !this.isSlidebar1Expended;
        }
        if (value === 2) {
          this.isSlidebar2Expended = !this.isSlidebar2Expended;
          this.isSlidebar1Expended = !this.isSlidebar2Expended;
        }
      }
    },

    filterId(id, value=0) {
      if (id < 5 || id > 8) {
        this.isSlidebar1Expended = false;
        this.isSlidebar2Expended = false;
      }
      if (this.power === true) {
        imageFilterById(id, this.cartoonRectL, this.cartoonRectR, value);
      }
    },

    loadImage() {
      let url1 = '';
      let url2 = '';
      this.slidebar1value = [0, 0];
      this.slidebar2value = [0, 0];
      if (this.power === false) {

        if (this.imagesInfo[0] !== undefined) {
          url1 = this.imagesInfo[0].imageUrl;
        }
        if (this.imagesInfo[1] !== undefined) {
          url2 = this.imagesInfo[1].imageUrl;
        }
        loadImageCanvas(url1, url2, this.imageRectL, this.imageRectR, this.power);

      } else {
        let k = this.orderCartoon * 2;
        this.cartoonRectL = [];
        this.cartoonRectR = [];

        if (this.cartoonsInfo[k] !== undefined) {
          url1 = this.cartoonsInfo[k].imageUrl;
          if(this.cartoonsInfo[k].imageRect!=null) {
            if(this.cartoonsInfo[k].rectsDel != null){
              for (let i = 0; i < this.cartoonsInfo[k].imageRect.length; i++) {
                let isDeleted = false;
                for (let j = 0; j < this.cartoonsInfo[k].rectsDel.length; j++) {
                  if(this.cartoonsInfo[k].imageRect[i].x === this.cartoonsInfo[k].rectsDel[j].x && this.cartoonsInfo[k].imageRect[i].y === this.cartoonsInfo[k].rectsDel[j].y && this.cartoonsInfo[k].imageRect[i].width === this.cartoonsInfo[k].rectsDel[j].width && this.cartoonsInfo[k].imageRect[i].height === this.cartoonsInfo[k].rectsDel[j].height) {
                    isDeleted = true;
                    break;
                  }
                }
                if(!isDeleted) {
                  this.cartoonRectL.push({
                    x: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].imageRect[i].x,
                    y: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].imageRect[i].y,
                    width: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].imageRect[i].width,
                    height: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].imageRect[i].height,
                    colour: this.cartoonsInfo[k].colorRect,
                  });
                }
              }
              for (let i = 0; i < this.cartoonsInfo[k].rectsDel.length; i++) {
                let isDeleted = false;
                for (let j = 0; j < this.cartoonsInfo[k].imageRect.length; j++) {
                  if(this.cartoonsInfo[k].rectsDel[i].x === this.cartoonsInfo[k].imageRect[j].x && this.cartoonsInfo[k].rectsDel[i].y === this.cartoonsInfo[k].imageRect[j].y && this.cartoonsInfo[k].rectsDel[i].width === this.cartoonsInfo[k].imageRect[j].width && this.cartoonsInfo[k].rectsDel[i].height === this.cartoonsInfo[k].imageRect[j].height) {
                    isDeleted = true;
                    break;
                  }
                }
                if(!isDeleted) {
                  this.cartoonsInfo[k].rectsDel[i].x = 0;
                  this.cartoonsInfo[k].rectsDel[i].y = 0;
                  this.cartoonsInfo[k].rectsDel[i].width = 0;
                  this.cartoonsInfo[k].rectsDel[i].height = 0;
                }
              }
            }
            else {
              for (let i = 0; i < this.cartoonsInfo[k].imageRect.length; i++) {
                this.cartoonRectL.push({
                  x: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].imageRect[i].x,
                  y: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].imageRect[i].y,
                  width: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].imageRect[i].width,
                  height: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].imageRect[i].height,
                  colour: this.cartoonsInfo[k].colorRect,
                });
              }
            }
          }
          if (this.cartoonsInfo[k].rectsAdd != null) {
            for (let i = 0; i < this.cartoonsInfo[k].rectsAdd.length; i++) {

              this.cartoonRectL.push({
                x: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].rectsAdd[i].x,
                y: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].rectsAdd[i].y,
                width: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].rectsAdd[i].width,
                height: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].rectsAdd[i].height,
                colour: this.cartoonsInfo[k].colorAdd,
              });
            }
          }

          if (this.cartoonsInfo[k].displayDel === '1000000601') {
            if (this.cartoonsInfo[k].rectsDel != null) {
              for (let i = 0; i < this.cartoonsInfo[k].rectsDel.length; i++) {
                this.cartoonRectL.push({
                  x: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].rectsDel[i].x,
                  y: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].rectsDel[i].y,
                  width: this.cartoonsInfo[k].rateWidth * this.cartoonsInfo[k].rectsDel[i].width,
                  height: this.cartoonsInfo[k].rateHeight * this.cartoonsInfo[k].rectsDel[i].height,
                  colour: this.cartoonsInfo[k].colorDel,
                });
              }
            }
          }
        }

        if (this.cartoonsInfo[k + 1] !== undefined) {
          url2 = this.cartoonsInfo[k + 1].imageUrl;
          if (this.cartoonsInfo[k + 1].imageRect != null) {
            if(this.cartoonsInfo[k + 1].rectsDel != null){
              for (let i = 0; i < this.cartoonsInfo[k+ 1].imageRect.length; i++) {
                let isDeleted = false;
                for (let j = 0; j < this.cartoonsInfo[k+ 1].rectsDel.length; j++) {
                  if(this.cartoonsInfo[k+ 1].imageRect[i].x === this.cartoonsInfo[k+ 1].rectsDel[j].x && this.cartoonsInfo[k+ 1].imageRect[i].y === this.cartoonsInfo[k+ 1].rectsDel[j].y && this.cartoonsInfo[k+ 1].imageRect[i].width === this.cartoonsInfo[k+ 1].rectsDel[j].width && this.cartoonsInfo[k+ 1].imageRect[i].height === this.cartoonsInfo[k+ 1].rectsDel[j].height) {
                    isDeleted = true;
                    break;
                  }
                }
                if(!isDeleted) {
                  this.cartoonRectR.push({
                    x: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].imageRect[i].x,
                    y: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].imageRect[i].y,
                    width: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].imageRect[i].width,
                    height: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].imageRect[i].height,
                    colour: this.cartoonsInfo[k + 1].colorRect,
                  });
                }
              }
              for (let i = 0; i < this.cartoonsInfo[k + 1].rectsDel.length; i++) {
                let isDeleted = false;
                for (let j = 0; j < this.cartoonsInfo[k + 1].imageRect.length; j++) {
                  if(this.cartoonsInfo[k + 1].rectsDel[i].x === this.cartoonsInfo[k + 1].imageRect[j].x && this.cartoonsInfo[k + 1].rectsDel[i].y === this.cartoonsInfo[k + 1].imageRect[j].y && this.cartoonsInfo[k + 1].rectsDel[i].width === this.cartoonsInfo[k + 1].imageRect[j].width && this.cartoonsInfo[k + 1].rectsDel[i].height === this.cartoonsInfo[k + 1].imageRect[j].height) {
                    isDeleted = true;
                    break;
                  }
                }
                if(!isDeleted) {
                  this.cartoonsInfo[k + 1].rectsDel[i].x = 0;
                  this.cartoonsInfo[k + 1].rectsDel[i].y = 0;
                  this.cartoonsInfo[k + 1].rectsDel[i].width = 0;
                  this.cartoonsInfo[k + 1].rectsDel[i].height = 0;
                }
              }
            }
            else {
              for (let i = 0; i < this.cartoonsInfo[k + 1].imageRect.length; i++) {
                this.cartoonRectR.push({
                  x: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].imageRect[i].x,
                  y: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].imageRect[i].y,
                  width: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].imageRect[i].width,
                  height: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].imageRect[i].height,
                  colour: this.cartoonsInfo[k + 1].colorRect,
                });
              }
            }
          }

          if (this.cartoonsInfo[k + 1].rectsAdd != null) {
            for (let i = 0; i < this.cartoonsInfo[k + 1].rectsAdd.length; i++) {
              this.cartoonRectR.push({
                x: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].rectsAdd[i].x,
                y: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].rectsAdd[i].y,
                width: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].rectsAdd[i].width,
                height: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].rectsAdd[i].height,
                colour: this.cartoonsInfo[k + 1].colorAdd,
              });
            }
          }

          if (this.cartoonsInfo[k + 1].displayDel === '1000000601' && this.cartoonsInfo[k + 1].rectsDel != null) {
            for (let i = 0; i < this.cartoonsInfo[k + 1].rectsDel.length; i++) {
              this.cartoonRectR.push({
                x: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].rectsDel[i].x,
                y: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].rectsDel[i].y,
                width: this.cartoonsInfo[k + 1].rateWidth * this.cartoonsInfo[k + 1].rectsDel[i].width,
                height: this.cartoonsInfo[k + 1].rateHeight * this.cartoonsInfo[k + 1].rectsDel[i].height,
                colour: this.cartoonsInfo[k + 1].colorDel,
              });
            }
          }
        }

        loadImageCanvas(url1, url2, this.cartoonRectL, this.cartoonRectR, this.power);

      }

    },

    previousImage() {
      if (this.orderCartoon > 0) {
        this.orderCartoon = this.orderCartoon - 1;
        this.loadImage();
      }
    },

    nextImage() {
      if (this.orderCartoon < this.cntCartoon - 1) {
        this.orderCartoon = this.orderCartoon + 1;
        this.loadImage();
      }
    },

    getOptionValue(dataCode) {
      const dictionary = {
        "1000000001": `${this.$t('permission-management.male')}`,
        "1000000002": `${this.$t('permission-management.female')}`,
        "1000000601": `${this.$t('system-setting.parameter-setting.yes')}`,
        "1000000602": `${this.$t('system-setting.parameter-setting.no')}`,
        "1000001701": `${this.$t('permission-management.timeout')}`,
        "1000001702": `${this.$t('permission-management.timein')}`,
        "TRUE": `${this.$t('knowledge-base.suspect')}`,
        "FALSE": `${this.$t('knowledge-base.no-suspect')}`,
        "1000001301": `${this.$t('permission-management.female')}`,
        "1000001302": `${this.$t('permission-management.female')}`,
        "1000001303": `${this.$t('maintenance-management.process-task.hand')}`,
        "1000001304": `${this.$t('maintenance-management.process-task.scan')}`,
        "1000001102": `${this.$t('maintenance-management.process-task.dispatch')}`,
        "1000001103": `${this.$t('maintenance-management.process-task.judge')}}`,
        "1000001104": `${this.$t('maintenance-management.process-task.hand')}`,
        "1000001106": `${this.$t('maintenance-management.process-task.scan')}`,
        "1000001201": `${this.$t('maintenance-management.process-task.system')}`,
        "1000001202": `${this.$t('maintenance-management.process-task.artificial')}`,
        "1000002301": `${this.$t('maintenance-management.process-task.system')}`,
        "1000002302": `${this.$t('maintenance-management.process-task.artificial')}`,
        "1000002303": `${this.$t('maintenance-management.process-task.artificial')}`,
        "1000001801": `${this.$t('maintenance-management.process-task.underreport')}`,
        "1000001802": `${this.$t('maintenance-management.process-task.falsepositive')}`
      };
      if (!dictionary.hasOwnProperty(dataCode)) return '';
      return dictionary[dataCode];
    },

    getModeDataCode(value) {
      const dictionary = {

        "scan": `1000001301`,
        "scan+hand": `1000001302`,
        "scan+judge": `1000001303`,
        "all": `1000001304`,

      };
      if (!dictionary.hasOwnProperty(value)) return '';
      return dictionary[value];
    },

    getModeName(value) {
      const dictionary = {

        "1000001301": this.$t('personal-inspection.security-instrument'),
        "1000001302": this.$t('personal-inspection.security-instrument-and-hand-test'),
        "1000001303": this.$t('personal-inspection.security-instrument-and-manual-test'),
        "1000001304": this.$t('personal-inspection.security-instrument-and-hand-test-and-device'),

      };
      if (!dictionary.hasOwnProperty(value)) return '';
      return dictionary[value];
    },

    onExportButton() {
      // this.fileSelection = [];
      // this.$refs['model-export'].show();
      let checkedAll = this.$refs.taskVuetable.checkedAllStatus;
      let checkedIds = this.$refs.taskVuetable.selectedTo;
      let httpOption = this.$refs.taskVuetable.httpOptions;
      let pagination = this.$refs.taskVuetable.tablePagination;
      this.imgUrl = [];
      this.params = {
        'locale' : getLocale(),
        'isAll': checkedIds.length === 0 && pagination.total !== 0,
        'sort' : httpOption.params.sort,
        'filter': this.filter,
        'idList': checkedIds.join()
      };
      this.link = `task/process-task/generate`;
      this.imgUrl = `task/process-task/generate/image`;
      this.name = this.$t('menu.process-task');
      this.isModalVisible = true;
    },
    onExport() {
      let checkedAll = this.$refs.taskVuetable.checkedAllStatus;
      let checkedIds = this.$refs.taskVuetable.selectedTo;
      let params = {
        'locale' : getLocale(),
        'isAll': checkedIds.length > 0 ? checkedAll : true,
        'filter': this.filter,
        'idList': checkedIds.join()
      };
      let link = `task/process-task/generate`;
      if (checkedIds.length > 0 && this.fileSelection !== null) {
        downLoadFileFromServer(link, params, 'Process-Task', this.fileSelection);
        this.hideModal('model-export')
      }
    },

    hideModal(modal) {
      this.$refs[modal].hide();
    },

    onPrintButton() {
      let checkedAll = this.$refs.taskVuetable.checkedAllStatus;
      let checkedIds = this.$refs.taskVuetable.selectedTo;
      let httpOption = this.$refs.taskVuetable.httpOptions;
      let pagination = this.$refs.taskVuetable.tablePagination;
      let params = {
        'locale' : getLocale(),
        'isAll': checkedIds.length === 0 && pagination.total !== 0,
        'sort' : httpOption.params.sort,
        'filter': this.filter,
        'idList': checkedIds.join()
      };
      let link = `task/process-task/generate`;
      printFileFromServer(link, params);

    },

    getSiteOption() {
      getApiManager()
        .post(`${apiBaseUrl}/site-management/field/get-all`).then((response) => {
        let message = response.data.message;
        let data = response.data.data;
        switch (message) {
          case responseMessages['ok']:
            this.siteData = data;
            break;
        }
      })
        .catch((error) => {
        });

    },

    onRowClicked: function (taskNumber) {

      this.pageStatus = 'show';
      this.power = false;
      this.isSlidebar1Expended = false;
      this.isSlidebar2Expended = false;
      this.cntCartoon = 0;
      this.orderCartoon = 0;
      this.judgeStartTime = null;
      this.judgeDeviceName = null;
      this.judgeUserId = null;
      this.judgeUserName = null;
      this.handStartTime = null;
      this.handDeviceName = null;
      this.handUserName = null;
      let url1 = '';
      let url2 = '';
      let deviceImage, submitRects, cartoonRects;
      let colourInfo = null;
      let handGood = null, handAttached = null;

      // call api
      getApiManager()
        .post(`${apiBaseUrl}/task/process-task/get-one`, {
          'taskId': taskNumber,
        })
        .then((response) => {
          let message = response.data.message;

          switch (message) {
            case responseMessages['ok']:
              this.showPage = response.data.data;
              this.apiBaseURL = apiBaseUrl;
              // if (this.showPage.serCheckResult !== null) {
              //   this.pageStatus = 'table';
              //   this.$refs.taskVuetable.reload();
              // }
              //if(this.showPage.workFlow.modeName
              let modeName;
              if (this.showPage.serJudgeGraph !== null) {
                // this.judgeStartTime = this.showPage.serJudgeGraph.judgeStartTime;
                // this.judgeDeviceName = this.showPage.serJudgeGraph.judgeDevice.deviceName;
                this.judgeUserId = this.showPage.serJudgeGraph.judgeUserId;
                this.judgeUserName = this.showPage.history.judgeUserName;
              }
              if (this.showPage.serHandExamination !== null) {
                //this.handStartTime = this.showPage.serHandExamination.handStartTime;
                //this.handDeviceName = this.showPage.serHandExamination.handDevice.deviceName;
                this.handUserName = this.showPage.history.handUserName;
              }

              for (let i = 0; i < this.showPage.serAssignList.length; i++) {
                if (this.showPage.serAssignList[i].handDevice !== null) {
                  if (this.handUserName === null) {
                    this.handUserName = this.showPage.serAssignList[i].assignUser.userName;
                  }
                  this.handStartTime = this.showPage.serAssignList[i].assignEndTime;
                  this.handDeviceName = this.showPage.serAssignList[i].handDevice.deviceName;
                } else {
                  if (this.showPage.serAssignList[i].judgeDevice !== null) {
                    this.judgeDeviceName = this.showPage.serAssignList[i].judgeDevice.deviceName;
                  }
                  if (this.judgeUserName === null) {
                    this.judgeUserName = this.showPage.serAssignList[i].assignUser.userName;
                    this.judgeUserId = this.showPage.serAssignList[i].assignUser.userId;
                  }
                  this.judgeStartTime = this.showPage.serAssignList[i].assignEndTime;
                }
              }


              this.thumbs = [];
              this.videos = [];
              this.images = [];
              this.imgRect = [];
              this.cartoonRect = [];
              this.rRects = [];
              this.imagesInfo = [];
              this.cartoonsInfo = [];
              this.imageRectR = [];
              this.imageRectL = [];
              this.cartoonRectR = [];
              this.cartoonRectL = [];
              this.handGoodExpanded = [];
              this.handGoodDataCodeExpanded = [];

              // this.conclusionType = null;
              // if(this.judgeUserId===this.defaultUserId) {
              //   this.conclusionType = this.showPage.serCheckResultList[0].conclusionType;
              // }

              deviceImage = [];
              submitRects = [];
              colourInfo = this.showPage.platFormCheckParams;

              if (this.showPage.serScan !== undefined && this.showPage.serScan !== null) {
                if (this.showPage.serScan.scanDeviceImages !== null) {
                  deviceImage = this.showPage.serScan.scanDeviceImages;
                  deviceImage = JSON.parse(deviceImage);
                }
              }

              if (this.showPage.serJudgeGraph !== undefined && this.showPage.serJudgeGraph !== null) {
                if(this.showPage.serJudgeGraph.judgeCartoonRects !== undefined && this.showPage.serJudgeGraph.judgeCartoonRects !== null) {
                  cartoonRects = this.showPage.serJudgeGraph.judgeCartoonRects;
                  cartoonRects = JSON.parse(cartoonRects);
                }
                if (this.showPage.serJudgeGraph.judgeSubmitrects !== undefined &&  this.showPage.serJudgeGraph.judgeSubmitrects !== null) {
                  submitRects = this.showPage.serJudgeGraph.judgeSubmitrects;
                  submitRects = JSON.parse(submitRects);
                }
              }

              this.cntCartoon = Math.floor(deviceImage.length / 2);

              if (deviceImage !== null) {
                for (let i = 0; i < deviceImage.length; i++) {
                  if (i < 2) {
                    this.imagesInfo.push({
                      rateWidth: deviceImage[i].width != 0 && deviceImage[i].width !=null ? 1 / deviceImage[i].width :0,
                      rateHeight: deviceImage[i].width != 0 && deviceImage[i].width !=null ? 1 / deviceImage[i].height :0,
                      imageUrl: deviceImage[i].cartoon,
                      imageRect: deviceImage[i].cartoonRects,
                      colorRect: colourInfo.scanRecogniseColour,
                      colorAdd: colourInfo.judgeRecogniseColour,
                      colorDel: colourInfo.displayDeleteSuspicionColour,
                      displayDel: colourInfo.displayDeleteSuspicion,
                      rectsAdd: cartoonRects !=null && cartoonRects[i] != undefined? cartoonRects[i].rectsAdded : null,
                      rectsDel: cartoonRects !=null && cartoonRects[i] != undefined?  cartoonRects[i].rectsDeleted : null
                    });
                  }


                  this.cartoonsInfo.push({
                    rateWidth: deviceImage[i].width != 0 && deviceImage[i].width !=null ? 1 / deviceImage[i].width :0,
                    rateHeight: deviceImage[i].width != 0 && deviceImage[i].width !=null ?  1 / deviceImage[i].height :0,
                    imageUrl: deviceImage[i].image,
                    imageRect: deviceImage[i].imageRects,
                    colorRect: colourInfo.scanRecogniseColour,
                    colorAdd: colourInfo.judgeRecogniseColour,
                    colorDel: colourInfo.displayDeleteSuspicionColour,
                    displayDel: colourInfo.displayDeleteSuspicion,
                    rectsAdd: submitRects !=null && submitRects[i] != undefined? submitRects[i].rectsAdded : null,
                    rectsDel: submitRects !=null && submitRects[i] != undefined?  submitRects[i].rectsDeleted : null
                  });

                }
              }


              if (this.imagesInfo[0] !== undefined) {
                if (this.imagesInfo[0].imageRect != null) {
                  if(this.imagesInfo[0].rectsDel != null){
                    for (let i = 0; i < this.imagesInfo[0].imageRect.length; i++) {
                      let isDeleted = false;
                      for (let j = 0; j < this.imagesInfo[0].rectsDel.length; j++) {
                        if(this.imagesInfo[0].imageRect[i].x === this.imagesInfo[0].rectsDel[j].x && this.imagesInfo[0].imageRect[i].y === this.imagesInfo[0].rectsDel[j].y && this.imagesInfo[0].imageRect[i].width === this.imagesInfo[0].rectsDel[j].width && this.imagesInfo[0].imageRect[i].height === this.imagesInfo[0].rectsDel[j].height) {
                          isDeleted = true;
                          break;
                        }
                      }
                      if(!isDeleted) {
                        this.imageRectL.push({
                          x: this.imagesInfo[0].rateWidth * this.imagesInfo[0].imageRect[i].x,
                          y: this.imagesInfo[0].rateHeight * this.imagesInfo[0].imageRect[i].y,
                          width: this.imagesInfo[0].rateWidth * this.imagesInfo[0].imageRect[i].width,
                          height: this.imagesInfo[0].rateHeight * this.imagesInfo[0].imageRect[i].height,
                          colour: this.imagesInfo[0].colorRect,
                        });
                      }
                    }
                    for (let i = 0; i < this.imagesInfo[0].rectsDel.length; i++) {

                      let isDeleted = false;
                      for (let j = 0; j < this.imagesInfo[0].imageRect.length; j++) {
                        if(this.imagesInfo[0].rectsDel[i].x === this.imagesInfo[0].imageRect[j].x && this.imagesInfo[0].rectsDel[i].y === this.imagesInfo[0].imageRect[j].y && this.imagesInfo[0].rectsDel[i].width === this.imagesInfo[0].imageRect[j].width && this.imagesInfo[0].rectsDel[i].height === this.imagesInfo[0].imageRect[j].height) {
                          isDeleted = true;
                          break;
                        }
                      }
                      if(!isDeleted) {
                        this.imagesInfo[0].rectsDel[i].x = 0;
                        this.imagesInfo[0].rectsDel[i].y = 0;
                        this.imagesInfo[0].rectsDel[i].width = 0;
                        this.imagesInfo[0].rectsDel[i].height = 0;
                      }
                    }
                  }
                  else {
                    for (let i = 0; i < this.imagesInfo[0].imageRect.length; i++) {
                      this.imageRectL.push({
                        x: this.imagesInfo[0].rateWidth * this.imagesInfo[0].imageRect[i].x,
                        y: this.imagesInfo[0].rateHeight * this.imagesInfo[0].imageRect[i].y,
                        width: this.imagesInfo[0].rateWidth * this.imagesInfo[0].imageRect[i].width,
                        height: this.imagesInfo[0].rateHeight * this.imagesInfo[0].imageRect[i].height,
                        colour: this.imagesInfo[0].colorRect,
                      });
                    }
                  }
                }
                url1 = this.imagesInfo[0].imageUrl;
                if (this.imagesInfo[0].rectsAdd != null) {
                  for (let i = 0; i < this.imagesInfo[0].rectsAdd.length; i++) {

                    this.imageRectL.push({
                      x: this.imagesInfo[0].rateWidth * this.imagesInfo[0].rectsAdd[i].x,
                      y: this.imagesInfo[0].rateHeight * this.imagesInfo[0].rectsAdd[i].y,
                      width: this.imagesInfo[0].rateWidth * this.imagesInfo[0].rectsAdd[i].width,
                      height: this.imagesInfo[0].rateHeight * this.imagesInfo[0].rectsAdd[i].height,
                      colour: this.imagesInfo[0].colorAdd,
                    });
                  }
                }

                if (this.imagesInfo[0].displayDel === '1000000601') {
                  if (this.imagesInfo[0].rectsDel != null) {
                    for (let i = 0; i < this.imagesInfo[0].rectsDel.length; i++) {
                      this.imageRectL.push({
                        x: this.imagesInfo[0].rateWidth * this.imagesInfo[0].rectsDel[i].x,
                        y: this.imagesInfo[0].rateHeight * this.imagesInfo[0].rectsDel[i].y,
                        width: this.imagesInfo[0].rateWidth * this.imagesInfo[0].rectsDel[i].width,
                        height: this.imagesInfo[0].rateHeight * this.imagesInfo[0].rectsDel[i].height,
                        colour: this.imagesInfo[0].colorDel,
                      });
                    }
                  }
                }
              }


              if (this.imagesInfo[1] !== undefined) {
                if (this.imagesInfo[1].imageRect != null) {
                  if(this.imagesInfo[1].rectsDel != null){
                    for (let i = 0; i < this.imagesInfo[1].imageRect.length; i++) {
                      let isDeleted = false;
                      for (let j = 0; j < this.imagesInfo[1].rectsDel.length; j++) {
                        if(this.imagesInfo[1].imageRect[i].x === this.imagesInfo[1].rectsDel[j].x && this.imagesInfo[1].imageRect[i].y === this.imagesInfo[1].rectsDel[j].y && this.imagesInfo[1].imageRect[i].width === this.imagesInfo[1].rectsDel[j].width && this.imagesInfo[1].imageRect[i].height === this.imagesInfo[1].rectsDel[j].height) {
                          isDeleted = true;
                          break;
                        }
                      }
                      if(!isDeleted) {
                        this.imageRectR.push({
                          x: this.imagesInfo[1].rateWidth * this.imagesInfo[1].imageRect[i].x,
                          y: this.imagesInfo[1].rateHeight * this.imagesInfo[1].imageRect[i].y,
                          width: this.imagesInfo[1].rateWidth * this.imagesInfo[1].imageRect[i].width,
                          height: this.imagesInfo[1].rateHeight * this.imagesInfo[1].imageRect[i].height,
                          colour: this.imagesInfo[1].colorRect,
                        });
                      }
                    }
                    for (let i = 0; i < this.imagesInfo[1].rectsDel.length; i++) {
                      let isDeleted = false;
                      for (let j = 0; j < this.imagesInfo[1].imageRect.length; j++) {
                        if(this.imagesInfo[1].rectsDel[i].x === this.imagesInfo[1].imageRect[j].x && this.imagesInfo[1].rectsDel[i].y === this.imagesInfo[1].imageRect[j].y && this.imagesInfo[1].rectsDel[i].width === this.imagesInfo[1].imageRect[j].width && this.imagesInfo[1].rectsDel[i].height === this.imagesInfo[1].imageRect[j].height) {
                          isDeleted = true;
                          break;
                        }
                      }
                      if(!isDeleted) {
                        this.imagesInfo[1].rectsDel[i].x = 0;
                        this.imagesInfo[1].rectsDel[i].y = 0;
                        this.imagesInfo[1].rectsDel[i].width = 0;
                        this.imagesInfo[1].rectsDel[i].height = 0;
                      }
                    }
                  }
                  else {
                    for (let i = 0; i < this.imagesInfo[1].imageRect.length; i++) {
                      this.imageRectR.push({
                        x: this.imagesInfo[1].rateWidth * this.imagesInfo[1].imageRect[i].x,
                        y: this.imagesInfo[1].rateHeight * this.imagesInfo[1].imageRect[i].y,
                        width: this.imagesInfo[1].rateWidth * this.imagesInfo[1].imageRect[i].width,
                        height: this.imagesInfo[1].rateHeight * this.imagesInfo[1].imageRect[i].height,
                        colour: this.imagesInfo[1].colorRect,
                      });
                    }
                  }
                }
                url2 = this.imagesInfo[1].imageUrl;
                if (this.imagesInfo[1].rectsAdd != null) {
                  for (let i = 0; i < this.imagesInfo[1].rectsAdd.length; i++) {
                    this.imageRectR.push({
                      x: this.imagesInfo[1].rateWidth * this.imagesInfo[1].rectsAdd[i].x,
                      y: this.imagesInfo[1].rateHeight * this.imagesInfo[1].rectsAdd[i].y,
                      width: this.imagesInfo[1].rateWidth * this.imagesInfo[1].rectsAdd[i].width,
                      height: this.imagesInfo[1].rateHeight * this.imagesInfo[1].rectsAdd[i].height,
                      colour: this.imagesInfo[1].colorAdd,
                    });
                  }
                }

                if (this.imagesInfo[1].displayDel === '1000000601' && this.imagesInfo[1].rectsDel != null) {
                  for (let i = 0; i < this.imagesInfo[1].rectsDel.length; i++) {
                    this.imageRectR.push({
                      x: this.imagesInfo[1].rateWidth * this.imagesInfo[1].rectsDel[i].x,
                      y: this.imagesInfo[1].rateHeight * this.imagesInfo[1].rectsDel[i].y,
                      width: this.imagesInfo[1].rateWidth * this.imagesInfo[1].rectsDel[i].width,
                      height: this.imagesInfo[1].rateHeight * this.imagesInfo[1].rectsDel[i].height,
                      colour: this.imagesInfo[1].colorDel,
                    });
                  }
                }
              }


              loadImageCanvas(url1, url2, this.imageRectL, this.imageRectR, this.power);

              // let handGoodsStr = this.showPage.serCheckResult.handGoods;
              // let handAttactedStr = this.showPage.serCheckResult.handAttached;
              // if (handGoodsStr !== null) {
              //   handGood = handGoodsStr.split(",");
              // }
              //
              // if (handAttactedStr !== null) {
              //   handAttached = handAttactedStr.split(",");
              // }
              // let k = 0;
              // if (handGood !== null) {
              //   for (let i = 0; i < handGood.length; i++) {
              //     for (let j = 0; j < 5; j++) {
              //       if (handGood[i] === this.handGoodDataCode[j]) {
              //         this.handGoodExpanded[k] = true;
              //         this.handGoodDataCodeExpanded[k] = this.handGoodDataCode[j];
              //         k++;
              //       }
              //     }
              //   }
              // }
              // //getting media data from server.
              // if (handAttached !== null) {
              //   for (let i = 0; i < handAttached.length; i++) {
              //     let iHandAttached = handAttached[i].split(".");
              //     if (iHandAttached[1] === "png" || iHandAttached[1] === "jpg") {
              //       this.thumbs.push({
              //         name: iHandAttached[0],
              //         src: handAttached[i]
              //       });
              //       this.images.push(handAttached[i]);
              //       /* this.thumbs[k].name = iHandAttached[0];
              //     this.thumbs[k].src = handAttached[i];
              //     this.images[k] = handAttached[i];*/
              //
              //     } else {
              //       this.videos.push({
              //         name: iHandAttached[0],
              //         src: handAttached[i],
              //         poster: '',//todo if client need to show different poster for each videos, should get its poster image from server.
              //       });
              //     }
              //   }
              // }

              break;// okay

          }
        })
        .catch((error) => {
        });

      this.task_id = taskNumber;
    },

    getDateTimeFormat2(dataTime) {
      if (dataTime == null) {
        return '';
      }
      return getDateTimeWithFormat(dataTime);
    },

    getDateTimeFormat(dataTime) {
      if (dataTime == null) {
        return '';
      }
      return getDateTimeWithFormat(dataTime, 'monitor');
    },

    onSearchButton() {

      if(this.filter.startTime !== null && this.filter.endTime !== null) {

        if (this.filter.startTime >= this.filter.endTime) {
          this.$notify('warning', this.$t('permission-management.warning'), this.$t(`maintenance-management.process-task.time-select`), {
            duration: 3000,
            permanent: false
          });
          return;
        }

      }
      // saveFilter: {
      //   taskNumber: null,
      //     mode: null,
      //     taskStatus: null,
      //     fieldId: null,
      //     userName: null,
      //     startTime: null,
      //     endTime: null
      //   // TODO: search filter
      // },
      this.saveFilter.taskNumber = this.filter.taskNumber;
      this.saveFilter.mode = this.filter.mode;
      this.saveFilter.taskStatus = this.filter.taskStatus;
      this.saveFilter.fieldId = this.filter.fieldId;
      this.saveFilter.userName = this.filter.userName;
      this.saveFilter.startTime = this.filter.startTime;
      this.saveFilter.endTime = this.filter.endTime;

      this.$refs.taskVuetable.refresh();
    },
    autoUpdate() {
      // if(this.filter.startTime !== null && this.filter.endTime !== null) {
      //
      //   if (this.filter.startTime >= this.filter.endTime) {
      //       return;
      //   }
      //
      // }
      // this.$refs.taskVuetable.reload();
      //this.taskVuetableHttpFetch1(this.apiUrl, this.httpOption);
      //this.$refs.taskVuetable.$parent.transform = this.transform.bind(this);

      //this.transform(transformData);
    },

    onResetButton() {
      this.filter = {
        taskNumber: null,
        mode: null,
        taskStatus: null,
        fieldId: null,
        userName: null,
        startTime: null,
        endTime: null
      };
    },

    transform(response) {

      let transformed = {};

      let data = response.data;

      transformed.pagination = {
        total: data.total,
        per_page: data.per_page,
        current_page: data.current_page,
        last_page: data.last_page,
        from: data.from,
        to: data.to
      };

      transformed.data = [];
      let temp;

      for (let i = 0; i < data.data.length; i++) {
        temp = data.data[i];
        this.renderedCheckList.push(data.data[i].taskId);
        transformed.data.push(temp);
      }

      return transformed

    },

    //:row-class="rowColour(props.rowData)"
    rowColour(dataItem, index) {

      if (dataItem.modeName !== null) {

        if (dataItem.modeName === this.getModeDataCode('all')) {
          if (dataItem.assignHandId === null || dataItem.assignJudgeId === null) {
            return 'bg-orange';
          }
        }
        if (dataItem.modeName === this.getModeDataCode('scan+judge')) {
          if (dataItem.assignHandId === null && dataItem.assignJudgeId === null) {
            return 'bg-orange';
          }
        }
        if (dataItem.modeName === this.getModeDataCode('scan+hand')) {
          if (dataItem.assignHandId === null || dataItem.assignJudgeId === null) {
            return 'bg-orange';
          }
        }
        if (dataItem.modeName === this.getModeDataCode('scan')) {
          if (dataItem.assignHandId === null && dataItem.assignJudgeId === null) {
            return 'bg-orange';
          }
        }

      }
    },

    taskVuetableHttpFetch1(apiUrl, httpOptions) { // customize data loading for table from server

      getApiManager().post(apiUrl, {
        currentPage: httpOptions.params.page,
        filter: this.saveFilter,
        sort: httpOptions.params.sort,
        perPage: this.taskVuetableItems.perPage,
      }).then((response) => {

        let message = response.data.message;
        let data = response.data;
        switch (message) {
          case responseMessages['ok']:
            this.$refs.taskVuetable.loadSuccess(response);
            //this.isLoading = false;

            break;
        }
        //this.isLoading = false;
      });;
    },

    taskVuetableHttpFetch(apiUrl, httpOptions) { // customize data loading for table from server

      this.apiUrl = apiUrl;
      this.httpOption = httpOptions;
      this.renderedCheckList = [];
      //this.changeCheckAllStatus();
      //this.changeCheckAllStatus();

      return getApiManager().post(apiUrl, {
        currentPage: httpOptions.params.page,
        filter: this.filter,
        sort: httpOptions.params.sort,
        perPage: this.taskVuetableItems.perPage,
      });
    },

    onTaskVuetablePaginationData(paginationData) {
      this.$refs.taskVuetablePagination.setPaginationData(paginationData);
      this.changeCheckAllStatus();
    },

    onTaskVuetableChangePage(page) {
      this.$refs.taskVuetable.changePage(page);
      this.changeCheckAllStatus();
    }
  }
}
</script>
