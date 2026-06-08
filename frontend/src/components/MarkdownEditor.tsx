import { Accent, Icon, IconButton } from '@mtes-mct/monitor-ui'
import MDEditor, { bold, EditorContext, italic, unorderedListCommand } from '@uiw/react-md-editor'
import { useContext } from 'react'
import styled from 'styled-components'

function PreviewButtons() {
  const { dispatch, preview } = useContext(EditorContext)

  const click = () => {
    if (!dispatch) {
      return
    }

    dispatch({
      preview: preview === 'edit' ? 'preview' : 'edit'
    })
  }

  return (
    <>
      <IconButton
        accent={Accent.TERTIARY}
        className={preview === 'edit' ? '_active' : ''}
        Icon={Icon.EditUnbordered}
        onClick={click}
        title="Éditer"
      />
      <IconButton
        accent={Accent.TERTIARY}
        className={preview === 'preview' ? '_active' : ''}
        Icon={Icon.Display}
        onClick={click}
        title="Aperçu"
      />
    </>
  )
}

const codePreview = {
  icon: <PreviewButtons />,
  keyCommand: 'preview',
  name: 'preview',
  value: 'preview'
}

export function MarkdownEditor({ onChange, value }: { onChange: (value?: string) => void; value: string }) {
  return (
    <StyledMDEditor
      commands={[bold, italic, unorderedListCommand]}
      extraCommands={[codePreview]}
      height="150px"
      highlightEnable={false}
      onChange={onChange}
      preview="edit"
      toolbarBottom
      value={value}
      visibleDragbar={false}
    />
  )
}

const StyledMDEditor = styled(MDEditor)`
  margin-top: 8px;
  border-radius: 0px;
  background-color: ${p => p.theme.color.gainsboro};
  box-shadow: none;
  padding-bottom: 0px;

  .w-md-editor-text-input {
    color: ${p => p.theme.color.gunMetal};
    font-family: inherit !important;
    font-size: 13px;
  }
  .w-md-editor-content {
    border-radius: 0px;
    .w-md-editor-preview {
      .wmde-markdown {
        background-color: ${p => p.theme.color.gainsboro};
        color: ${p => p.theme.color.gunMetal};
        font-size: 13px;
        ul {
          list-style: disc;
        }
      }
    }
  }
  .w-md-editor-toolbar {
    border-radius: 0px;
    border: 1px solid ${p => p.theme.color.gainsboro};
    li > button {
      background-color: inherit;
      color: ${p => p.theme.color.slateGray};

      &.Element-IconButton {
        color: ${p => p.theme.color.lightGray};
        &._active {
          color: ${p => p.theme.color.blueGray};
        }

        &:hover,
        &._hover {
          color: ${p => p.theme.color.blueYonder};
        }
      }

      &:not(.Element-IconButton) {
        svg {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
`
