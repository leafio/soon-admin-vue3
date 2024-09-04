<template>
  <el-select v-model="selectedOption" clearable :filterable="filterable" @change="onChange">
    <el-option v-for="item in options" :key="item.dictId" :label="item.dictLabel" :value="item[valueKey]"> </el-option>
  </el-select>
</template>

<script>
import { getOptionList } from "/@/api/system"
export default {
  props: {
    dictType: {
      type: [String, Array],
      default: "",
    },
    valueKey: {
      type: String,
      default: "dictValue",
    },
    modelValue: {
      type: [String, Number],
      default: "",
    },
    valueType: {
      type: String,
      default: "",
    },
    filterable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update:modelValue", "change"],
  data() {
    return {
      options: [],
      selectedOption: "",
    }
  },
  watch: {
    selectedOption(val) {
      this.$emit("update:modelValue", val)
    },
    modelValue(val) {
      if (this.checkNull(val)) return
      if (val != this.selectedOption) {
        let result = val
        if (this.valueType == "string") {
          result = result + ""
        } else if (this.valueType == "number") {
          result = +result
        }
        this.selectedOption = result
      }
    },
  },
  async created() {
    let list = []
    if (this.dictType) {
      if (typeof this.dictType == "string") {
        list = (await getOptionList(this.dictType)).data
      } else {
        for (let index = 0; index < this.dictType.length; index++) {
          const _type = this.dictType[index]
          const childList = (await getOptionList(_type)).data
          const filterList = childList.filter((c) => list.findIndex((l) => l[this.valueKey] == c[this.valueKey]) == -1)
          list.push(...filterList)
        }
      }

      const key = this.valueKey
      let selectedValue = this.modelValue
      if (this.valueType == "string") {
        list = list.map((item) => {
          return {
            ...item,
            [key]: item[key] + "",
          }
        })
        selectedValue = selectedValue + ""
      } else if (this.valueType == "number") {
        list = list.map((item) => {
          return {
            ...item,
            [key]: +item[key],
          }
        })
        selectedValue = +selectedValue
      }

      this.options = list
      if (this.checkNull(this.modelValue)) return
      this.selectedOption = selectedValue
    }
  },
  methods: {
    onChange(e) {
      this.$emit(
        "change",
        this.options.find((s) => s[this.valueKey] == e),
      )
    },
    checkNull(val) {
      if (val == undefined || val == null || val === "") {
        this.selectedOption = ""
        return true
      }
    },
  },
}
</script>

<style scoped>
.imgs {
  margin-top: 5px;
}
.imgs img {
  height: 160px;
  border: 1px solid rgb(230, 230, 230);
}
</style>
