import { Input, InputGroup, Grid, Row, Col } from 'rsuite'

import { ReactComponent as SearchIconSVG } from '../icons/Search.svg'

export default {
  title: 'RsuiteMonitor/Input'
}

const styles = {
  marginBottom: 10
}

function CustomInput({ ...props }) {
  return <Input {...props} style={styles} />
}

function CustomInputGroup({ placeholder, ...props }) {
  return (
    <InputGroup {...props} style={styles}>
      <Input placeholder={placeholder} />
      <InputGroup.Addon>
        <SearchIconSVG />
      </InputGroup.Addon>
    </InputGroup>
  )
}

function CustomInputGroupWidthButton({ placeholder, ...props }) {
  return (
    <InputGroup {...props} inside style={styles}>
      <Input placeholder={placeholder} />
      <InputGroup.Button>
        <SearchIconSVG />
      </InputGroup.Button>
    </InputGroup>
  )
}

function TemplateInput({ classPrefix, style }) {
  return (
    <Grid fluid style={style}>
      <Row>
        <Col md={8} sm={12} xs={24}>
          <CustomInput classPrefix={classPrefix} placeholder="Large" size="lg" />
          <CustomInput classPrefix={classPrefix} placeholder="Medium" size="md" />
          <CustomInput classPrefix={classPrefix} placeholder="Small" size="sm" />
          <CustomInput classPrefix={classPrefix} placeholder="Xsmall" size="xs" />
        </Col>
        <Col md={8} sm={12} xs={24}>
          <CustomInputGroup classPrefix={classPrefix} placeholder="Large" size="lg" />
          <CustomInputGroup classPrefix={classPrefix} placeholder="Medium" size="md" />
          <CustomInputGroup classPrefix={classPrefix} placeholder="Small" size="sm" />
          <CustomInputGroup classPrefix={classPrefix} placeholder="Xsmall" size="xs" />
        </Col>
        <Col md={8} sm={12} xs={24}>
          <CustomInputGroupWidthButton classPrefix={classPrefix} placeholder="Large" size="lg" />
          <CustomInputGroupWidthButton classPrefix={classPrefix} placeholder="Medium" size="md" />
          <CustomInputGroupWidthButton classPrefix={classPrefix} placeholder="Small" size="sm" />
          <CustomInputGroupWidthButton classPrefix={classPrefix} placeholder="Xsmall" size="xs" />
        </Col>
      </Row>
    </Grid>
  )
}

export const InputSizes = TemplateInput.bind({})

function TemplateTextArea({ rows }) {
  return <Input as="textarea" placeholder="Textarea" rows={rows} />
}

export const TextArea = TemplateTextArea.bind({})
TextArea.args = {
  rows: 3
}
