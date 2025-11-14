<script lang="jsx">
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ElImage,
  ElEmpty,
  ElCard
} from 'element-plus'
import { defineComponent, ref, computed, unref, watch, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import { set, get } from 'lodash-es'
import { getSlot } from '@/utils/tsxHelper'
import TableActions from './components/TableActions.vue'
import { createVideoViewer } from '@/components/VideoPlayer'
import { Icon } from '@/components/Icon'
import { BaseButton } from '@/components/Button'

export default defineComponent({
  name: 'Table',
  props: {
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    // 是否展示表格的工具栏
    showAction: propTypes.bool.def(false),
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: propTypes.bool.def(true),
    // 表头
    columns: {
      type: Array ,
      default: () => []
    },
    // 是否展示分页
    pagination: {
      type: Object,
      default: () => undefined
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: propTypes.bool.def(false),
    // 加载状态
    loading: propTypes.bool.def(false),
    // 是否叠加索引
    reserveIndex: propTypes.bool.def(false),
    // 对齐方式
    align: propTypes.string
      .validate((v) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    // 表头对齐方式
    headerAlign: propTypes.string
      .validate((v) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    data: {
      type: Array ,
      default: () => []
    },
    // 图片自动预览字段数组
    imagePreview: {
      type: Array ,
      default: () => []
    },
    // 视频自动预览字段数组
    videoPreview: {
      type: Array ,
      default: () => []
    },
    height: propTypes.oneOfType([Number, String]),
    maxHeight: propTypes.oneOfType([Number, String]),
    stripe: propTypes.bool.def(false),
    border: propTypes.bool.def(true),
    size: {
      type: String,
      validator: (v) => ['default', 'small', 'large'].includes(v)
    },
    fit: propTypes.bool.def(true),
    showHeader: propTypes.bool.def(true),
    highlightCurrentRow: propTypes.bool.def(false),
    currentRowKey: propTypes.oneOfType([Number, String]),
    // row-class-name, 类型为 (row: Recordable, rowIndex) => string | string
    rowClassName: {
      type: [Function, String] ,
      default: ''
    },
    rowStyle: {
      type: [Function, Object] ,
      default: undefined
    },
    cellClassName: {
      type: [Function, String]  ,
      default: ''
    },
    cellStyle: {
      type: [Function, Object]  ,
      default: undefined
    },
    headerRowClassName: {
      type: [Function, String] ,
      default: ''
    },
    headerRowStyle: {
      type: [Function, Object]  ,
      default: undefined
    },
    headerCellClassName: {
      type: [Function, String]  ,
      default: ''
    },
    headerCellStyle: {
      type: [Function, Object],
      default: undefined
    },
    rowKey: propTypes.string.def('id'),
    emptyText: propTypes.string.def('No Data'),
    defaultExpandAll: propTypes.bool.def(false),
    expandRowKeys: {
      type: Array ,
      default: undefined
    },
    defaultSort: {
      type: Object ,
      default: () => ({})
    },
    tooltipEffect: {
      type: String,
      default: 'dark'
    },
    tooltipOptions: {
      type: Object  ,
      default: () => ({
        enterable: true,
        placement: 'top',
        showArrow: true,
        hideAfter: 200,
        popperOptions: { strategy: 'fixed' }
      })
    },
    showSummary: propTypes.bool.def(false),
    sumText: propTypes.string.def('Sum'),
    summaryMethod: {
      type: Function ,
      default: undefined
    },
    spanMethod: {
      type: Function  ,
      default: undefined
    },
    selectOnIndeterminate: propTypes.bool.def(true),
    indent: propTypes.number.def(16),
    lazy: propTypes.bool.def(false),
    load: {
      type: Function  ,
      default: undefined
    },
    treeProps: {
      type: Object  ,
      default: () => ({ hasChildren: 'hasChildren', children: 'children', label: 'label' })
    },
    tableLayout: {
      type: String  ,
      default: 'fixed'
    },
    scrollbarAlwaysOn: propTypes.bool.def(false),
    flexible: propTypes.bool.def(false),
    // 自定义内容
    customContent: propTypes.bool.def(false),
    cardBodyStyle: {
      type: Object,
      default: () => ({})
    },
    cardBodyClass: {
      type: String ,
      default: ''
    },
    cardWrapStyle: {
      type: Object,
      default: () => ({})
    },
    cardWrapClass: {
      type: String ,
      default: ''
    }
  },
  emits: ['update:pageSize', 'update:currentPage', 'register', 'refresh'],
  setup(props, { attrs, emit, slots, expose }) {
    const elTableRef = ref()

    // 注册
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef)
    })

    const pageSizeRef = ref(props.pageSize)

    const currentPageRef = ref(props.currentPage)

    // useTable传入的props
    const outsideProps = ref({})

    const mergeProps = ref({})

    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    const setProps = (props = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = { ...props }  
    }

    const setColumn = (columnProps, columnsChildren ) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const addColumn = (column, index ) => {
      const { columns } = unref(getProps)
      if (index !== void 0) {
        columns.splice(index, 0, column)
      } else {
        columns.push(column)
      }
    }

    const delColumn = (field) => {
      const { columns } = unref(getProps)
      const index = columns.findIndex((item) => item.field === field)
      if (index > -1) {
        columns.splice(index, 1)
      }
    }

    const refresh = () => {
      emit('refresh')
    }

    const changSize = (size) => {
      setProps({ size })
    }

    const confirmSetColumn = (columns) => {
      setProps({ columns })
    }

    expose({
      setProps,
      setColumn,
      delColumn,
      addColumn,
      elTableRef
    })

    const pagination = computed(() => {
      return Object.assign(
        {
          small: false,
          background: false,
          pagerCount: 7,
          layout: 'sizes, prev, pager, next, jumper, ->, total',
          pageSizes: [10, 20, 30, 40, 50, 100],
          disabled: false,
          hideOnSinglePage: false,
          total: 10
        },
        unref(getProps).pagination
      )
    })

    watch(
      () => unref(getProps).pageSize,
      (val) => {
        pageSizeRef.value = val
      }
    )

    watch(
      () => unref(getProps).currentPage,
      (val) => {
        currentPageRef.value = val
      }
    )

    watch(
      () => pageSizeRef.value,
      (val) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageRef.value,
      (val) => {
        emit('update:currentPage', val)
      }
    )

    const getBindValue = computed(() => {
      const bindValue  = { ...attrs, ...unref(getProps) }
      delete bindValue.columns
      delete bindValue.data
      delete bindValue.align
      return bindValue
    })

    const renderTreeTableColumn = (columnsChildren) => {
      const { align, headerAlign, showOverflowTooltip, imagePreview, videoPreview } =
        unref(getProps)
      return columnsChildren.map((v) => {
        if (v.hidden) return null
        const props = { ...v } 
        if (props.children) delete props.children

        const children = v.children

        const slots = {
          default: (...args) => {
            const data = args[0]
            let isPreview = false
            isPreview =
              imagePreview.some((item) => (item ) === v.field) ||
              videoPreview.some((item) => (item ) === v.field)

            return children && children.length
              ? renderTreeTableColumn(children)
              : props?.slots?.default
                ? props.slots.default(...args)
                : v?.formatter
                  ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                  : isPreview
                    ? renderPreview(get(data.row, v.field), v.field)
                    : get(data.row, v.field)
          }
        }
        if (props?.slots?.header) {
          slots['header'] = (...args) => props.slots.header(...args)
        }

        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {slots}
          </ElTableColumn>
        )
      })
    }

    const renderPreview = (url, field) => {
      const { imagePreview, videoPreview } = unref(getProps)
      return (
        <div class="flex items-center">
          {imagePreview.includes(field) ? (
            <ElImage
              src={url}
              fit="cover"
              class="w-[100%]"
              lazy
              preview-src-list={[url]}
              preview-teleported
            />
          ) : videoPreview.includes(field) ? (
            <BaseButton
              type="primary"
              icon={<Icon icon="vi-ep:video-play" />}
              onClick={() => {
                createVideoViewer({
                  url
                })
              }}
            >
              预览
            </BaseButton>
          ) : null}
        </div>
      )
    }

    const renderTableColumn = (columnsChildren) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip,
        reserveSelection,
        imagePreview,
        videoPreview
      } = unref(getProps)

      return (columnsChildren || columns).map((v) => {
        if (v.hidden) return null
        if (v.type === 'index') {
          return (
            <ElTableColumn
              type="index"
              index={
                v.index ? v.index : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
              }
              align={v.align || align}
              headerAlign={v.headerAlign || headerAlign}
              label={v.label}
              fixed={v.fixed}
              width="65px"
            ></ElTableColumn>
          )
        } else if (v.type === 'selection') {
          return (
            <ElTableColumn
              type="selection"
              reserveSelection={reserveSelection}
              align={align}
              headerAlign={headerAlign}
              selectable={v.selectable}
              width="50"
            ></ElTableColumn>
          )
        } else {
          const props = { ...v } 
          if (props.children) delete props.children

          const children = v.children

          const slots = {
            default: (...args) => {
              const data = args[0]

              let isPreview = false
              isPreview =
                imagePreview.some((item) => (item ) === v.field) ||
                videoPreview.some((item) => (item ) === v.field)

              return children && children.length
                ? renderTreeTableColumn(children)
                : props?.slots?.default
                  ? props.slots.default(...args)
                  : v?.formatter
                    ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                    : isPreview
                      ? renderPreview(get(data.row, v.field), v.field)
                      : get(data.row, v.field)
            }
          }
          if (props?.slots?.header) {
            slots['header'] = (...args) => props.slots.header(...args)
          }
          return (
            <ElTableColumn
              showOverflowTooltip={showOverflowTooltip}
              align={align}
              headerAlign={headerAlign}
              {...props}
              prop={v.field}
            >
              {slots}
            </ElTableColumn>
          )
        }
      })
    }

    return () => {
      const tableSlots = {}
      if (getSlot(slots, 'empty')) {
        tableSlots['empty'] = (...args) => getSlot(slots, 'empty', args)
      }
      if (getSlot(slots, 'append')) {
        tableSlots['append'] = (...args) => getSlot(slots, 'append', args)
      }

      return (
        <div v-loading={unref(getProps).loading}>
          {unref(getProps).customContent ? (
            <div class="flex flex-wrap">
              {unref(getProps)?.data?.length ? (
                unref(getProps)?.data.map((item) => {
                  const cardSlots = {
                    default: () => {
                      return getSlot(slots, 'content', item)
                    }
                  }
                  if (getSlot(slots, 'content-header')) {
                    cardSlots['header'] = () => {
                      return getSlot(slots, 'content-header', item)
                    }
                  }
                  if (getSlot(slots, 'content-footer')) {
                    cardSlots['footer'] = () => {
                      return getSlot(slots, 'content-footer', item)
                    }
                  }
                  return (
                    <ElCard
                      shadow="hover"
                      class={unref(getProps).cardWrapClass}
                      style={unref(getProps).cardWrapStyle}
                      bodyClass={unref(getProps).cardBodyClass}
                      bodyStyle={unref(getProps).cardBodyStyle}
                    >
                      {cardSlots}
                    </ElCard>
                  )
                })
              ) : (
                <div class="flex flex-1 justify-center">
                  <ElEmpty description="暂无数据" />
                </div>
              )}
            </div>
          ) : (
            <>
              {unref(getProps).showAction && !unref(getProps).customContent ? (
                <TableActions
                  columns={unref(getProps).columns}
                  onChangSize={changSize}
                  onRefresh={refresh}
                  onConfirm={confirmSetColumn}
                />
              ) : null}
              <ElTable ref={elTableRef} data={unref(getProps).data} {...unref(getBindValue)}>
                {{
                  default: () => renderTableColumn(),
                  ...tableSlots
                }}
              </ElTable>
            </>
          )}
          {unref(getProps).pagination ? (
            <ElPagination
              v-model:pageSize={pageSizeRef.value}
              v-model:currentPage={currentPageRef.value}
              class="mt-10px"
              {...unref(pagination)}
            ></ElPagination>
          ) : undefined}
        </div>
      )
    }
  }
})
</script>
