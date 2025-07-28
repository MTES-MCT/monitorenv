import { useGetRegulatoryLayersQuery } from '@api/regulatoryLayersAPI'
import { SubThemesOrSubTagsContainer, ThemesOrTagsContainer } from '@components/Table/style'

export function RegulatoryAreasTagsCell({ regulatoryAreaIds }: { regulatoryAreaIds: number[] }) {
  const { data: regulatoryAreas } = useGetRegulatoryLayersQuery()
  if (!regulatoryAreas) {
    return null
  }
  if (!regulatoryAreaIds || regulatoryAreaIds.length === 0) {
    return '-'
  }

  const tags = regulatoryAreaIds.flatMap(regulatoryAreaId => regulatoryAreas.entities[regulatoryAreaId]?.tags || [])

  const groupedTagsAndSubtags = tags.reduce((acc, tag) => {
    if (tag) {
      const mainTag = tag.name
      const subTags = tag.subTags?.map(subTag => subTag.name) ?? []

      if (!acc[mainTag]) {
        acc[mainTag] = []
      }
      if (subTags) {
        subTags.forEach(subTag => {
          if (!acc[mainTag]?.includes(subTag)) {
            acc[mainTag]?.push(subTag)
          }
        })
      }
    }

    return acc
  }, {} as Record<string, string[]>)

  const tagsAndSubTags = Object.entries(groupedTagsAndSubtags)
  const title = Object.entries(groupedTagsAndSubtags)
    .flatMap(([tag, subTags]) => `${tag}${subTags.length > 0 ? `: ${subTags.join(', ')}` : ''}`)
    .join(' - ')

  return (
    <>
      {tagsAndSubTags.map(([mainTag, subTags], index) => (
        <ThemesOrTagsContainer key={mainTag} title={title}>
          {mainTag}
          {subTags.length > 0 ? (
            <SubThemesOrSubTagsContainer>{` (${subTags.join(', ')})`}</SubThemesOrSubTagsContainer>
          ) : (
            ''
          )}
          {index < tagsAndSubTags.length - 1 ? ' - ' : ''}
        </ThemesOrTagsContainer>
      ))}
    </>
  )
}
