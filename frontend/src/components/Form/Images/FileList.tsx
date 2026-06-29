import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import styled from 'styled-components'

import { type FileApi } from '../types'

type FileListProps = {
  files?: FileApi[]
  onDelete: (index: number) => void
}

function humanFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const factor = 1024

  const index = Math.floor(Math.log(bytes) / Math.log(factor))
  const value = bytes / factor ** index

  return `${value.toFixed(decimals).replace(/\.?0+$/, '')} ${units[index]}`
}

export function FileList({ files, onDelete }: FileListProps) {
  return (
    <StyledFileList>
      {files?.map((file, index) => (
        <li key={file.id}>
          <FileItem
            download={file.name}
            href={`data:${file.mimeType};base64,${file.content}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon.Document />
            <span>
              {file.name} <FileSize>{humanFileSize(file.size)}</FileSize>
            </span>
            <IconButton
              accent={Accent.TERTIARY}
              Icon={Icon.Close}
              onClick={() => onDelete(index)}
              style={{ marginLeft: 'auto' }}
            />
          </FileItem>
        </li>
      ))}
    </StyledFileList>
  )
}

const StyledFileList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const FileItem = styled.a`
  background: ${p => p.theme.color.gainsboro};
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  color: black;
`
const FileSize = styled.span`
  white-space: pre;
`
