import { DateCell } from '@components/Table/DateCell'
import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { VigilanceArea } from '@features/VigilanceArea/types'

import { EditCell } from '../Rows/EditCell'
import { FrequencyCell } from '../Rows/FrequencyCell'
import { HighlightCell } from '../Rows/HighlightCell'
import { LocalizeCell } from '../Rows/LocalizeCell'
import { StatusCell } from '../Rows/StatusCell'
import { VisibilityCell } from '../Rows/VisibilityCell'

import type { Row } from '@tanstack/react-table'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching: boolean = false) => [
  {
    accessorFn: row => row.startDatePeriod,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} withoutTime />),
    enableSorting: true,
    header: () => 'Début',
    id: 'startDatePeriod',
    size: 90 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.endDatePeriod,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <DateCell date={info.getValue()} withoutTime />),
    enableSorting: true,
    header: () => 'Fin',
    id: 'endDatePeriod',
    size: 90 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.frequency,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <FrequencyCell frequency={info.getValue()} />),
    enableSorting: true,
    header: () => 'Récurrence',
    id: 'frequency',
    size: 160 + legacyFirefoxOffset,
    sortingFn: (rowA: Row<any>, rowB: Row<any>) => {
      const labelA = VigilanceArea.FrequencyLabel[rowA.original.frequency] ?? ''
      const labelB = VigilanceArea.FrequencyLabel[rowB.original.frequency] ?? ''

      return labelA.localeCompare(labelB)
    }
  },
  {
    accessorFn: row => row.name,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <HighlightCell text={info.getValue()} />),
    enableSorting: true,
    header: () => 'Nom de la zone',
    id: 'name',
    size: 272 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.tags?.map(tag => tag.name).join(', '),
    cell: info =>
      isFetching ? (
        <StyledSkeletonRow />
      ) : (
        <span title={info.getValue()}>{info.getValue() && info.getValue().length > 0 ? info.getValue() : '-'}</span>
      ),
    enableSorting: true,
    header: () => 'Thématique',
    id: 'themes',
    size: 260 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.comments,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <HighlightCell text={info.getValue()} />),
    enableSorting: true,
    header: () => 'Commentaire',
    id: 'comments',
    size: 327 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : info.getValue() ?? '-'),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 104 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.visibility,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <VisibilityCell visibility={info.getValue()} />),
    enableSorting: true,
    header: () => 'Visibilité',
    id: 'visibility',
    size: 130 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.isDraft,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <StatusCell isDraft={info.getValue()} />),
    enableSorting: true,
    header: () => 'Statut',
    id: 'isDraft',
    size: 125 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.createdBy,
    cell: info => (isFetching ? <StyledSkeletonRow /> : info.getValue() ?? '-'),
    enableSorting: true,
    header: () => 'Créée par',
    id: 'createdBy',
    size: 97 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.geom,
    cell: ({ row }) =>
      isFetching ? <StyledSkeletonRow /> : <LocalizeCell geom={row.original.geom} id={row.original.id} />,
    enableSorting: false,
    header: () => '',
    id: 'geom',
    size: 52 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.id,
    cell: ({ row }) =>
      isFetching ? <StyledSkeletonRow /> : <EditCell geom={row.original.geom} id={row.original.id} />,
    enableSorting: false,
    header: () => '',
    id: 'edit',
    size: 52 + legacyFirefoxOffset
  }
]
