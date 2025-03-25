import { dashboardsAPI } from '@api/dashboardsAPI'
import { useExportImages } from '@features/Dashboard/hooks/useExportImages'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Button } from '@mtes-mct/monitor-ui'

export function EditableDocButton({ dashboard }) {
  const dispatch = useAppDispatch()

  const { getImages } = useExportImages()

  const exportBrief = async () => {
    const images = await getImages()
    const { data } = await dispatch(dashboardsAPI.endpoints.exportBrief.initiate({ dashboard, images }))

    if (data) {
      try {
        const content = data?.fileContent
        // Decode base64 string
        const decodedContent = atob(content)

        // Convert the decoded content to a Uint8Array
        const uint8Array = new Uint8Array(decodedContent.length)
        for (let i = 0; i < decodedContent.length; i += 1) {
          uint8Array[i] = decodedContent.charCodeAt(i)
        }

        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], { type: 'application/vnd.oasis.opendocument.text' })

        // Create a temporary link element
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = data.fileName

        // Append the link to the document body and trigger a click event
        document.body.appendChild(link)
        link.click()

        // Remove the link element from the document body
        document.body.removeChild(link)
      } catch (error) {
        // console.log('handleDownload error: ', error)
      }
    }
  }

  return <Button onClick={exportBrief}>Générer fichier éditable</Button>
}
