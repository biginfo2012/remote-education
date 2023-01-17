<template>
  <div class="dashboard-container d-flex flex-column">
    <b-row>
      <b-col cols="12">
        <div class="" style="padding-top: 0;">
          <h3 style="color: #1a3035" class="font-weight-bold my-4">
            <label style="margin-left: 1rem; font-size: 3rem;">{{ $t('org-admin.description') }}</label>
          </h3>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <b-col cols="12">
        <label></label>
      </b-col>
    </b-row>

    <b-row class="mt-2">
      <b-col cols="12" class="d-flex align-content-end justify-content-end">
        <b-button
          size="sm"
          class="ml-2"
          variant="info default"
          @click="onResetButton()"><i class="icofont-ui-edit"/>&nbsp;
          {{ $t('btn.edit') }}
        </b-button>
      </b-col>
    </b-row>
    <b-row class="px-4 py-4">
      <b-col cols="4" class="d-flex flex-column align-items-center">
        <div class="img-wrapper">
          <img draggable="false" src="../../../assets/img/plus.png" @click="$refs.imgFile.click()">
        </div>
        <input type="file" ref="imgFile" @change="onFileChange" accept="image/*" style="display: none"/>
      </b-col>
      <b-col cols="4" class="d-flex flex-column align-items-center">
        <div class="img-wrapper">
          <img draggable="false" src="../../../assets/img/plus.png" @click="$refs.imgFile.click()">
        </div>
        <input type="file" ref="imgFile" @change="onFileChange" accept="image/*" style="display: none"/>
      </b-col>

      <b-col cols="4" class="d-flex flex-column align-items-center">
        <div class="img-wrapper">
          <img draggable="false" src="../../../assets/img/plus.png" @click="$refs.imgFile.click()">
        </div>
        <input type="file" ref="imgFile" @change="onFileChange" accept="image/*" style="display: none"/>
      </b-col>
    </b-row>
    <b-row class="mt-2">
      <b-col cols="12" class="d-flex align-content-end justify-content-end">
        <b-button
          size="sm"
          class="ml-2"
          variant="info default"
          @click="onResetButton()"><i class="icofont-ui-"/>&nbsp;
          {{ $t('btn.submit') }}
        </b-button>
      </b-col>
    </b-row>

  </div>
</template>
<script>
import {apiBaseUrl} from '../../../constants/config'
import Vuetable from '../../../components/Vuetable2/Vuetable'
import VuetablePaginationBootstrap from '../../../components/Common/VuetablePaginationBootstrap'
import {responseMessages} from '../../../constants/response-messages';
import {downLoadFileFromServer, getApiManager, getApiManagerError, printFileFromServer} from '../../../api';
import {validationMixin} from 'vuelidate';
import {checkPermissionItem, getDicDataByDicIdForOptions, getDirection, getLocale} from "../../../utils";
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Modal from '../../../components/Modal/modal'

const {required} = require('vuelidate/lib/validators');

let getManufacturerName = (options, value) => {
  let name = null;
  if (options == null || options.length === 0)
    return name;
  options.forEach(option => {
    if (option.value === value)
      name = option.text;
  });
  return name;
};

export default {
  components: {
    'vuetable': Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'v-select': vSelect,
    Modal
  },
  mounted() {
    // this.getCategoryData();
    // this.getTemplateData();
    // this.getManufacturerOptions();
    this.$refs.vuetable.$parent.transform = this.transformTable.bind(this);
  },
  mixins: [validationMixin],
  validations: {
    fileSelection: {
      required
    },
    archivesForm: {
      archivesName: {
        required
      },
      archivesTemplateId: {
        required
      },
      archivesNumber: {
        required
      }
    }
  },
  data() {
    return {
      isLoading: false,
      loadingTable:false,
      submitted: false,
      templateData: [],
      link: '',
      params: {},
      name: '',
      fileSelection: [],
      renderedCheckList: [],
      direction: getDirection().direction,
      fileSelectionOptions: [
        {value: 'docx', label: 'WORD'},
        {value: 'xlsx', label: 'EXCEL'},
        {value: 'pdf', label: 'PDF'},
      ],
      isModalVisible: false,
      templateOptions: [],
      templateOption:[],
      categoryData: [],
      categoryFilterData: [],
      categoryFilterDatas: [
        {value: null, text: this.$t('permission-management.all')},
        {value: '2', text: this.$t('log-management.device-log.judge')},
        {value: '3', text: this.$t('log-management.device-log.manual')},
        {value: '4', text: this.$t('log-management.device-log.hand')}
      ],
      categorySelectOptions: [],
      pageStatus: 'list',
      stateOptions: [
        {value: null, text: this.$t('permission-management.all')},
        {value: '1000000701', text: this.$t('permission-management.active')},
        {value: '1000000702', text: this.$t('permission-management.inactive')}
      ],

      manufacturerOptions: [],
      indicatorsData: [],
      filterOption: {
        archivesName: '',
        status: null,
        templateId: null,
        categoryId: null
      },
      templateForm: {
        category: '',
        manufacturer: '',
        originalModel: ''
      },
      indicatorsForm: {},
      invalidIndicators: [],
      archivesForm: {
        archiveId: 0,
        archivesTemplateId: null,
        archivesName: null,
        archivesNumber: null,
        imageUrl: null,
        image: null,
        note: '',
        status: '1000000702',
        archiveValueList: []
      },

      vuetableItems: {
        apiUrl: `${apiBaseUrl}/device-management/document-management/archive/get-by-filter-and-page`,
        perPage: 10,
        fields: [
          {
            name: '__checkbox',
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: '__sequence',
            title: this.$t('system-setting.no'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: '__slot:number',
            sortField: 'archivesNumber',
            title: this.$t('device-management.file-no'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: 'archivesName',
            title: this.$t('device-management.device-list.archive'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: 'status',
            title: this.$t('permission-management.th-status'),
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: (value) => {
              const dictionary = {
                "1000000701": `<span class="text-success">${this.$t('system-setting.status-active')}</span>`,
                "1000000702": `<span class="text-muted">${this.$t('system-setting.status-inactive')}</span>`
              };
              if (!dictionary.hasOwnProperty(value)) return '';
              return dictionary[value];
            }

          },
          {
            name: 'archiveTemplate',
            title: this.$t('device-management.template'),
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: (archiveTemplate) => {
              if (archiveTemplate === null) return null
              return archiveTemplate.templateName;
            }
          },
          {
            name: 'categoryId',
            title: this.$t('device-management.device-classify'),
            titleClass: 'text-center',
            dataClass: 'text-center',
            callback: (value) => {
              const dictionary = {
                "2": `<span>${this.$t('log-management.device-log.judge')}</span>`,
                "3": `<span>${this.$t('log-management.device-log.manual')}</span>`,
                "4": `<span>${this.$t('log-management.device-log.hand')}</span>`
              };
              if (!dictionary.hasOwnProperty(value)) return '';
              return dictionary[value];
            }
          },
          {
            name: 'manufacturerName',
            title: this.$t('device-management.manufacture'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: 'originalModelName',
            title: this.$t('device-management.device-model'),
            titleClass: 'text-center',
            dataClass: 'text-center'
          },
          {
            name: '__slot:operating',
            title: this.$t('system-setting.operating'),
            titleClass: 'text-center',
            dataClass: 'text-center',
            width: '210px'
          }
        ]
      },
      deviceForm: {
        method: null,
      },
      extraForm: {
        method: null,
      },
    }
  },
  methods: {
    getLocale() {
      return getLocale();
    },
    selectAll(value) {
      this.$refs.vuetable.toggleAllCheckboxes('__checkbox', {target: {checked: value}});
      this.$refs.vuetable.isCheckAllStatus = value;
      let checkBoxId = "vuetable-check-header-2-" + this.$refs.vuetable.uuid;
      let checkAllButton = document.getElementById(checkBoxId);
      checkAllButton.checked = value;
    },
    selectNone() {
      this.$refs.vuetable.isCheckAllStatus = false;
      let checkBoxId = "vuetable-check-header-2-" + this.$refs.vuetable.uuid;
      let checkAllButton = document.getElementById(checkBoxId);
      checkAllButton.checked = false;
    },
    changeCheckAllStatus() {
      let selectList = this.$refs.vuetable.selectedTo;
      let renderedList = this.renderedCheckList;
      if (selectList.length >= renderedList.length) {
        let isEqual = false;
        for (let i = 0; i < renderedList.length; i++) {
          isEqual = false;
          for (let j = 0; j < selectList.length; j++) {
            if (renderedList[i] === selectList[j]) {
              j = selectList.length;
              isEqual = true
            }
          }
          if (isEqual === false) {
            this.selectNone();
            break;
          }
          if (i === renderedList.length - 1) {
            this.selectAll(true);
          }
        }
      } else {
        this.selectNone();
      }

    },
    onCheckStatusChange(isChecked) {
      if (isChecked) {
        this.changeCheckAllStatus();
      } else {
        this.selectNone();
      }
    },
    closeModal() {
      this.isModalVisible = false;
    },
    checkPermItem(value) {
      return checkPermissionItem(value);
    },
    getManufacturerOptions() {
      this.manufacturerOptions = getDicDataByDicIdForOptions(9);
    },
    onExportButton() {
      // this.fileSelection = [];
      // this.$refs['model-export'].show();
      let checkedAll = this.$refs.vuetable.checkedAllStatus;
      let checkedIds = this.$refs.vuetable.selectedTo;
      let httpOption = this.$refs.vuetable.httpOptions;
      let pagination = this.$refs.vuetable.tablePagination;
      this.params = {
        'isAll': checkedIds.length === 0 && pagination.total !== 0,
        'locale': getLocale(),
        'sort': httpOption.params.sort,
        'filter': this.filterOption,
        'idList': checkedIds.join()
      };
      this.link = `device-management/document-management/archive`;
      this.name = this.$t('menu.document-management');
      this.isModalVisible = true;
    },
    onExport() {
      let checkedAll = this.$refs.vuetable.checkedAllStatus;
      let checkedIds = this.$refs.vuetable.selectedTo;
      let params = {
        'isAll': checkedIds.length > 0 ? checkedAll : true,
        'locale': getLocale(),
        'filter': this.filterOption,
        'idList': checkedIds.join()
      };
      let link = `device-management/document-management/archive`;
      if (this.fileSelection !== null) {
        downLoadFileFromServer(link, params, 'document', this.fileSelection);
        this.hideModal('model-export')
      }
    },
    onPrintButton() {
      let checkedAll = this.$refs.vuetable.checkedAllStatus;
      let checkedIds = this.$refs.vuetable.selectedTo;
      let httpOption = this.$refs.vuetable.httpOptions;
      let pagination = this.$refs.vuetable.tablePagination;
      let params = {
        'isAll': checkedIds.length === 0 && pagination.total !== 0,
        'locale': getLocale(),
        'sort': httpOption.params.sort,
        'filter': this.filterOption,
        'idList': checkedIds.join()
      };
      let link = `device-management/document-management/archive`;
      printFileFromServer(link, params);
    },
    hideModal(modal) {
      this.$refs[modal].hide();
    },
    //get device category data
    getCategoryData() {
      getApiManagerError().post(`${apiBaseUrl}/device-management/device-classify/category/get-all`, {
        type: 'with_parent'
      }).then((response) => {
        let message = response.data.message;
        let data = response.data.data;
        switch (message) {
          case responseMessages['ok']:
            this.categoryData = data;

            break;
        }
      });
    },
    //get document template list
    getTemplateData() {
      getApiManagerError().post(`${apiBaseUrl}/device-management/document-template/archive-template/get-all`, {
        type: 'with_parent'
      }).then((response) => {
        let message = response.data.message;
        let data = response.data.data;
        switch (message) {
          case responseMessages['ok']:
            this.templateData = data;
            break;
        }
      });
    },

    onSearchButton() {
      this.$refs.vuetable.refresh();
    },
    onResetButton() {
      this.filterOption = {
        templateId: null,
        archivesName: '',
        status: null,
        categoryId: null
      };
    },
    onAction(value, data = null) {
      this.initialize(data);
      switch (value) {
        case 'create':
          this.pageStatus = 'create';
          break;
        case 'edit':
          this.pageStatus = 'edit';
          break;
        case 'show':
          this.pageStatus = 'show';
          break;
        case 'show-list':
          this.pageStatus = 'list';
          break;
        case 'activate':
          //this.updateItemStatus('1000000701');
          this.$refs['modal-active'].show();
          break;
        case 'inactivate':
          //this.updateItemStatus('1000000702');
          this.$refs['modal-inactive'].show();
          break;
        case 'delete':
          this.$refs['modal-delete'].show();
          break;
      }
    },
    initialize(data = null) {
      if (data == null)
        this.archivesForm = {
          archiveId: 0,
          archivesTemplateId: null,
          archivesName: null,
          archivesNumber: null,
          image: null,
          imageUrl: null,
          note: '',
          status: '1000000702',
          archiveValueList: []
        };
      else {
        if (Object.keys(data).includes('createdBy')) { //if getting data from table , needful to processing
          for (let key in this.archivesForm) {
            if (Object.keys(data).includes(key)) {
              if (key !== 'imageUrl' && key !== 'image')
                this.archivesForm[key] = data[key];
              else if (key === 'imageUrl')
                this.archivesForm.image = data['imageUrl'] ? data['imageUrl'] : null;
            }
          }
        } else
          this.archivesForm = data;
      }
      this.submitted = false;
      // this.getTemplateDetailData(this.archivesForm.archivesTemplateId);
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      this.onCreateImage(files[0]);
    },
    onCreateImage(file) {
      this.archivesForm.image = new Image();
      let reader = new FileReader();
      reader.onload = (e) => {
        this.archivesForm.image = e.target.result;
      };
      reader.readAsDataURL(file);
      this.archivesForm.imageUrl = file;
    },
    getTemplateDetailData(templateId) {
      this.indicatorsData = [];
      this.templateForm = {
        category: '',
        manufacturer: '',
        originalModel: ''
      };

      for (let item of this.templateData) {
        if (item.archivesTemplateId === templateId) {
          this.templateForm.category = item.deviceCategory.categoryName;
          this.templateForm.manufacturer = getManufacturerName(this.manufacturerOptions, item.manufacturer);
          this.templateForm.originalModel = item.originalModel;
          this.indicatorsData = item.archiveIndicatorsList;
          break;
        }
      }
      let indicatorValues = [];
      if (this.archivesForm != null && Object.keys(this.archivesForm).includes('archiveValueList'))
        indicatorValues = this.archivesForm.archiveValueList;
      this.indicatorsForm = {};
      if (indicatorValues.length > 0) {
        this.indicatorsData.forEach((item, index) => {
          this.indicatorsForm[index] = null;
          for (let v of indicatorValues) {
            if (v.indicatorsId === item.indicatorsId) {
              this.indicatorsForm[index] = v.value;
              break
            }
          }
        });
      }
      //todo indicator part...
    },
    //save archives Item
    saveArchivesItem() {

      this.submitted = true;
      this.$v.archivesForm.$touch();
      if (this.$v.archivesForm.$invalid) {
        if (this.$v.archivesForm.archivesNumber.$invalid) {
          this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.file-number-placeholder`), {
            duration: 3000,
            permanent: false
          });
          return;
        }
        if (this.$v.archivesForm.archivesName.$invalid) {
          this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.file-name-placeholder`), {
            duration: 3000,
            permanent: false
          });
          return;
        }
        if (this.$v.archivesForm.archivesTemplateId.$invalid) {
          this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.template-name-select`), {
            duration: 3000,
            permanent: false
          });
          return;
        }
        return;
      }
      this.invalidIndicators = [];
      let isRequired = false;
      let indicateFormData = [];
      this.indicatorsData.forEach((item, index) => {
        if (Object.keys(this.indicatorsForm).includes(index + "") && (this.indicatorsForm[index]).trim() !== "") {
          indicateFormData.push({
            "indicatorsId": item.indicatorsId,
            "value": this.indicatorsForm[index]
          })
        } else if (item.isNull === '1000000601') {
          this.invalidIndicators.push(index);
          isRequired = true;
        }
      });
      if (isRequired) {
        this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.document-management.required-indicator-value`), {
          duration: 3000,
          permanent: false
        });
        return;
      }

      const formData = new FormData();
      for (let key in this.archivesForm) {
        if (key !== 'imageUrl' && key !== 'image' && key !== 'archiveValueList')
          formData.append(key, this.archivesForm[key]);
        else if (key === 'imageUrl' && this.archivesForm['image'] !== null && this.archivesForm['imageUrl'] !== null)
          formData.append('imageUrl', this.archivesForm['imageUrl'], this.archivesForm['imageUrl'].name);
      }
      formData.append('json', JSON.stringify({"archiveValueList": indicateFormData}));
      this.isLoading = true;
      let finalLink = this.archivesForm.archiveId > 0 ? 'modify' : 'create';
      getApiManager()
        .post(`${apiBaseUrl}/device-management/document-management/archive/` + finalLink, formData)
        .then((response) => {
          let message = response.data.message;
          switch (message) {
            case responseMessages['ok']: // okay
              if (finalLink === 'create') {
                this.$notify('success', this.$t('permission-management.success'), this.$t(`device-management.document-management.added-successfully`), {
                  duration: 10000,
                  permanent: false
                });
              } else {
                this.$notify('success', this.$t('permission-management.success'), this.$t(`device-management.document-management.updated-successfully`), {
                  duration: 10000,
                  permanent: false
                });
              }
              this.pageStatus = 'list';
              this.$refs.vuetable.reload();
              this.isLoading = false;
              break;
            case responseMessages['has-devices']: // okay
              this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.document-management.has-devices`), {
                duration: 3000,
                permanent: false
              });
              break;
            case responseMessages['used-archive-name']:
              this.$notify('warning', this.$t('permission-management.warning'), this.$t(`response-error-message.used-archive-name`), {
                duration: 3000,
                permanent: false
              });
              break;
            case responseMessages['used-archive-number']:
              this.$notify('warning', this.$t('permission-management.warning'), this.$t(`response-error-message.used-archive-number`), {
                duration: 3000,
                permanent: false
              });
              break;
          }
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    //update status
    updateItemStatus(statusValue) {
      let archiveId = this.archivesForm.archiveId;
      if (archiveId === 0)
        return false;
      getApiManager()
        .post(`${apiBaseUrl}/device-management/document-management/archive/update-status`, {
          archiveId: archiveId,
          status: statusValue
        })
        .then((response) => {
          let message = response.data.message;
          let data = response.data.data;
          switch (message) {
            case responseMessages['ok']: // okay
              this.$notify('success', this.$t('permission-management.success'), this.$t(`device-management.document-management.status-updated-successfully`), {
                duration: 3000,
                permanent: false
              });
              if (this.archivesForm.archiveId > 0)
                this.archivesForm.status = statusValue;

              this.$refs.vuetable.reload();
              break;
            case responseMessages['has-devices']: // okay
              this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.document-management.has-devices`), {
                duration: 3000,
                permanent: false
              });
              break;

          }
        })
        .catch((error) => {
        });
      this.$refs['modal-inactive'].hide();
      this.$refs['modal-active'].hide();
    },
    //remove archives
    removeItem() {
      let archiveId = this.archivesForm.archiveId;
      if (archiveId === 0)
        return false;
      getApiManager()
        .post(`${apiBaseUrl}/device-management/document-management/archive/delete`, {
          archiveId: archiveId,
        })
        .then((response) => {
          let message = response.data.message;
          let data = response.data.data;
          switch (message) {
            case responseMessages['ok']: // okay
              this.$notify('success', this.$t('permission-management.success'), this.$t(`device-management.document-management.deleted-successfully`), {
                duration: 3000,
                permanent: false
              });
              this.pageStatus = 'list';
              this.$refs.vuetable.refresh();
              if (this.archivesForm.archiveId > 0)
                initialize();
              break;
            case responseMessages['has-devices']: // okay
              this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.document-management.has-devices`), {
                duration: 3000,
                permanent: false
              });
              break;
            case responseMessages['active-archive']: // okay
              this.$notify('warning', this.$t('permission-management.warning'), this.$t(`device-management.document-management.active-archive`), {
                duration: 3000,
                permanent: false
              });
              break;
          }
        })
        .catch((error) => {
        });
      this.$refs['modal-delete'].hide();
    },
    //methods relative showing list of archives
    transformTable(response) {
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
        this.renderedCheckList.push(data.data[i].archiveId);
        temp.categoryId = temp.archiveTemplate ? temp.archiveTemplate.deviceCategory.categoryId : '';
        temp.manufacturerName = temp.archiveTemplate ? getManufacturerName(this.manufacturerOptions, temp.archiveTemplate.manufacturer) : '';
        temp.originalModelName = temp.archiveTemplate ? temp.archiveTemplate.originalModel : '';
        transformed.data.push(temp);
      }
      return transformed
    },
    vuetableHttpFetch(apiUrl, httpOptions) {
      this.renderedCheckList = [];
      return getApiManager().post(apiUrl, {
        currentPage: httpOptions.params.page,
        perPage: this.vuetableItems.perPage,
        sort: httpOptions.params.sort,
        filter: this.filterOption
      });
    },
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData);
      this.changeCheckAllStatus();
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
      this.changeCheckAllStatus();
    },

  },
  watch: {
    'vuetableItems.perPage': function (newVal) {
      this.$refs.vuetable.refresh();
      this.changeCheckAllStatus();
    },

    categoryData(newVal, oldVal) { // maybe called when the org data is loaded from server

      this.categorySelectOptions = [];
      if (newVal.length === 0) {
        this.categorySelectOptions.push({
          value: 0,
          html: `${this.$t('system-setting.none')}`
        });
      } else {
        this.categorySelectOptions = newVal.map(site => ({
          text: site.categoryName,
          value: site.categoryId
        }));
      }
      this.categoryFilterData = JSON.parse(JSON.stringify(this.categorySelectOptions));
      this.categoryFilterData.push({value: null, text: `${this.$t('permission-management.all')}`})
    },
    templateData(newVal, oldVal) { // maybe called when the org data is loaded from server

      this.templateOptions = [];
      this.templateOption = [];
      if (newVal.length === 0) {
        this.templateOptions.push({
          value: null,
          html: `${this.$t('system-setting.none')}`
        });
        this.templateOption.push({
          value: null,
          html: `${this.$t('system-setting.none')}`
        });
      } else {
        this.templateOptions = newVal.map(template => ({
          text: template.templateName,
          value: template.archivesTemplateId
        }));
        this.templateOption = newVal.map(template => ({
          text: template.templateName,
          value: template.archivesTemplateId
        }));
      }
      this.templateOption.push({value: null, text: `${this.$t('permission-management.all')}`})

    },
    'archivesForm.archivesTemplateId': function (newVal, oldVal) {
      this.getTemplateDetailData(newVal);
    }
  }
}
</script>
<style>

.img-wrapper{
  padding: 12rem;
  border: 1px solid blue;
}

.bg-dashboard {
  height: fit-content;
  height: 400px;
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
  border-radius: 10px;
  background: url("../../../assets/img/admin_home_main_banner.png") no-repeat center;

  & > div {
    background: transparent !important;
  }

}

.bg-image {
  height: fit-content;
  height: 400px;
  box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075) !important;
  border-radius: 15px;
  background: url("../../../assets/img/home_bottom_banner.png") no-repeat center;

  & > div {
    background: transparent !important;
  }

}

.image-label-2 {
  margin-left: 21rem;
  margin-top: 8rem;
  font-size: 15px;
  float: left;
  padding-left: 6rem;
  width: 22rem
}
.image-label-1 {
  margin-left: 21rem;
  font-size: 15px;
  float: left;
  padding-left: 6rem;
  width: 22rem
}
</style>

