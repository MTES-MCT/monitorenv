import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { getLocalizedDayjs } from '@mtes-mct/monitor-ui'
import { isNumeric } from '@utils/isNumeric'

export const Columns = (isFetching: boolean) => [
  {
    accessorKey: 'id',
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: false,
    header: '#',
    size: 42
  },
  {
    accessorFn: row => getLocalizedDayjs(row.timestamp).format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: true,
    header: 'Date',
    id: 'timestamp',
    size: 189
  },
  {
    accessorFn: row => (isNumeric(row.speed) ? `${row.speed} nds` : '-'),
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: true,
    header: 'Vit.',
    id: 'speed',
    size: 72
  },
  {
    accessorFn: row => (isNumeric(row.course) ? `${row.course} °` : '-'),
    cell: info => (isFetching ? <StyledSkeletonRow /> : <span>{info.getValue()}</span>),
    enableSorting: true,
    header: 'Cap',
    id: 'course',
    size: 72
  }
]
