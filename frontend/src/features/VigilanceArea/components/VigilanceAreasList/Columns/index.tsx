import { StyledSkeletonRow } from '@features/commonComponents/Skeleton'
import { PeriodsCell } from '@features/VigilanceArea/components/VigilanceAreasList/Cells/PeriodsCell'

import { ActionsCell } from '../Cells/ActionsCell'
import { HighlightCell } from '../Cells/HighlightCell'
import { StatusCell } from '../Cells/StatusCell'
import { TagsCell } from '../Cells/TagsCell'
import { ThemesCell } from '../Cells/ThemesCells'
import { ValidationDateCell } from '../Cells/ValidationDateCell'
import { VisibilityCell } from '../Cells/VisibilityCell'

export const Columns = (legacyFirefoxOffset: number = 0, isFetching: boolean = false) => [
  {
    accessorFn: row => row.name,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <HighlightCell text={info.getValue()} />),
    enableSorting: true,
    header: () => 'Nom de la zone',
    id: 'name',

    size: 350 + legacyFirefoxOffset
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
    accessorFn: row => row.themes,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ThemesCell themes={info.getValue()} />),
    enableSorting: true,
    header: () => 'Thématiques',
    id: 'themes',
    size: 270 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.tags,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <TagsCell tags={info.getValue()} />),
    enableSorting: true,
    header: () => 'Tags',
    id: 'tags',
    size: 270 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.seaFront,
    cell: info => (isFetching ? <StyledSkeletonRow /> : info.getValue() ?? '-'),
    enableSorting: true,
    header: () => 'Façade',
    id: 'seaFront',
    size: 150 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.validatedAt,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <ValidationDateCell date={info.getValue()} />),
    enableSorting: true,
    header: () => 'Validée le',
    id: 'validatedAt',
    size: 160 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.isDraft,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <StatusCell isDraft={info.getValue()} />),
    enableSorting: true,
    header: () => 'Statut',
    id: 'isDraft',
    size: 140 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.visibility,
    cell: info => (isFetching ? <StyledSkeletonRow /> : <VisibilityCell visibility={info.getValue()} />),
    enableSorting: true,
    header: () => 'Visibilité',
    id: 'visibility',
    size: 110 + legacyFirefoxOffset
  },
  {
    accessorFn: row => row.geom,
    cell: ({ row }) =>
      isFetching ? <StyledSkeletonRow /> : <ActionsCell geom={row.original.geom} id={row.original.id} />,
    enableSorting: false,
    header: () => '',
    id: 'actions',
    size: 82 + legacyFirefoxOffset
  }
]
