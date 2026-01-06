import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { PeriodsCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/PeriodsCell'

import { EditCell } from '../Cells/EditCell'
import { HighlightCell } from '../Cells/HighlightCell'
import { LocalizeCell } from '../Cells/LocalizeCell'
import { StatusCell } from '../Cells/StatusCell'
import { TagsCell } from '../Cells/TagsCell'
import { ValidationDateCell } from '../Cells/ValidationDateCell'
import { VisibilityCell } from '../Cells/VisibilityCell'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching: boolean = false) => [
  {
    accessorFn: row => row.name,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <HighlightCell text={info.getValue()} />),
    enableSorting: true,
    header: () => 'Nom de la zone',
    id: 'name',
    size: 250 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.periods,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <PeriodsCell periods={info.getValue()} />),
    enableSorting: true,
    header: () => 'Période(s) de vigilance',
    id: 'periods',
    size: 250 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.tags,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <TagsCell tags={info.getValue()} />),
    enableSorting: true,
    header: () => 'Tags',
    id: 'tags',
    size: 230 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.comments,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <HighlightCell text={info.getValue()} />),
    enableSorting: true,
    header: () => 'Commentaire',
    id: 'comments',
    size: 330 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : info.getValue() ?? '-'),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 100 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.validatedAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ValidationDateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Validée le',
    id: 'validatedAt',
    size: 100 + legacyFirefoxOffset
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
    accessorFn: row => row.visibility,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <VisibilityCell visibility={info.getValue()} />),
    enableSorting: true,
    header: () => 'Visibilité',
    id: 'visibility',
    size: 105 + legacyFirefoxOffset
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
